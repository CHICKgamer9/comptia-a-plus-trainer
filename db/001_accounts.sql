-- TicketBench accounts + learner profiles.
-- Progress, binder, cards, lingo, and streaks live on profiles.progress.
-- Billing fields stay on accounts. Run against Neon (psql or SQL editor).

CREATE TABLE IF NOT EXISTS accounts (
  id text PRIMARY KEY,
  clerk_user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'bench', 'house')),
  seat_limit integer NOT NULL DEFAULT 1 CHECK (seat_limit >= 1 AND seat_limit <= 6),
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id text PRIMARY KEY,
  account_id text NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar text NOT NULL DEFAULT '🛠️',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),
  progress jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS profiles_account_id_idx ON profiles (account_id);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION ticketbench_account_id() RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(current_setting('app.account_id', true), '');
$$;

DROP POLICY IF EXISTS accounts_owner ON accounts;
CREATE POLICY accounts_owner ON accounts
  USING (id = ticketbench_account_id())
  WITH CHECK (id = ticketbench_account_id());

DROP POLICY IF EXISTS profiles_owner ON profiles;
CREATE POLICY profiles_owner ON profiles
  USING (account_id = ticketbench_account_id())
  WITH CHECK (account_id = ticketbench_account_id());

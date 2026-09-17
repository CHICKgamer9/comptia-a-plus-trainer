"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useAccount } from "@/components/AccountProvider";

export default function AccountPage() {
  const { signedIn, account, profiles, ready } = useAccount();

  if (!ready) {
    return <p className="text-sm text-muted">Loading account…</p>;
  }

  if (!signedIn || !account) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader
          kicker="Account"
          title="Sign in to see the plan"
          description="Start Here does not need an account. Sign in when you want seats and a Binder that follows a learner."
        />
        <Link
          href="/sign-in"
          className="inline-flex rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        kicker="Account"
        title="Billing stays here"
        description="Progress, cards, lingo, and streaks live on a profile — never on this email."
      />
      <dl className="grid gap-3">
        <Row label="Email" value={account.email} />
        <Row label="Plan" value={account.planLabel} />
        <Row label="Seats" value={`${profiles.length} / ${account.seatLimit}`} />
        <Row
          label="Stripe customer"
          value={account.stripeCustomerId ?? "Not linked yet"}
        />
      </dl>
      <p className="mt-4 text-xs text-muted">
        House seats are the <code className="text-foreground">seat_limit</code> field (max 6). Stripe
        Checkout is out of scope for this build.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/account/profiles"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-background"
        >
          Manage profiles
        </Link>
        <Link
          href="/account/onboarding"
          className="rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-surface-2"
        >
          Who is learning?
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <dt className="text-[10px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

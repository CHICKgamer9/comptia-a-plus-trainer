import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { ProgressState } from "@/lib/progress";
import type { Plan } from "@/lib/account/types";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  plan: text("plan").$type<Plan>().notNull().default("free"),
  seatLimit: integer("seat_limit").notNull().default(1),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatar: text("avatar").notNull().default("🛠️"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  progress: jsonb("progress").$type<ProgressState>().notNull(),
});

"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { PageHeader } from "@/components/ui";
import { clerkBrowserConfigured } from "@/components/AuthProvider";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        kicker="Account"
        title="Sign in to TicketBench"
        description="Email magic link, Google, or Apple. Start Here still works as a guest — this only saves a bench."
      />
      {clerkBrowserConfigured() ? (
        <div className="flex justify-center">
          <SignIn
            fallbackRedirectUrl="/account/onboarding"
            signUpUrl="/sign-up"
            appearance={{
              variables: { colorPrimary: "#2dd4bf", colorBackground: "#10151c" },
            }}
          />
        </div>
      ) : (
        <AuthNotConfigured />
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="underline-offset-2 hover:underline">
          Back to Start Here
        </Link>
      </p>
    </div>
  );
}

function AuthNotConfigured() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 text-sm text-muted">
      Hosted sign-in is not configured on this deploy. Add Clerk keys (see{" "}
      <code className="text-foreground">.env.example</code>) and enable Email, Google, and Apple.
      Guest progress on this device is unchanged.
    </div>
  );
}

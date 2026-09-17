"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { PageHeader } from "@/components/ui";
import { clerkBrowserConfigured } from "@/components/AuthProvider";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        kicker="Account"
        title="Create an account"
        description="One account can hold up to six learner profiles. Billing stays on the account."
      />
      {clerkBrowserConfigured() ? (
        <div className="flex justify-center">
          <SignUp
            fallbackRedirectUrl="/account/onboarding"
            signInUrl="/sign-in"
            appearance={{
              variables: { colorPrimary: "#2dd4bf", colorBackground: "#10151c", colorText: "#e8eef6" },
            }}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface p-5 text-sm text-muted">
          Hosted sign-up is not configured yet. You can still use Start Here as a guest.
        </div>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="underline-offset-2 hover:underline">
          Back to Start Here
        </Link>
      </p>
    </div>
  );
}

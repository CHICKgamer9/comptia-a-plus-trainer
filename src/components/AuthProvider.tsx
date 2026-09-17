"use client";

import { ClerkProvider } from "@clerk/nextjs";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) return children;
  return (
    <ClerkProvider afterSignOutUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up">
      {children}
    </ClerkProvider>
  );
}

export function clerkBrowserConfigured() {
  return Boolean(publishableKey);
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function clerkReady() {
  return Boolean(
    process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  );
}

function isProtectedPath(path: string) {
  return (
    path.startsWith("/account") ||
    path.startsWith("/api/account") ||
    path.startsWith("/api/profiles")
  );
}

export default async function proxy(request: NextRequest, event: unknown) {
  if (!clerkReady()) return NextResponse.next();
  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  const handler = clerkMiddleware(async (auth, req) => {
    if (isProtectedPath(req.nextUrl.pathname)) {
      await auth.protect();
    }
  });
  return handler(request, event as never);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

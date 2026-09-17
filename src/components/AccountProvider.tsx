"use client";

import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  readGuestProgress,
  setProgressScope,
  setRemoteProgressWriter,
  saveProgress,
  parseProgress,
} from "@/lib/progress";
import type { ProgressState } from "@/lib/progress";
import type { AccountRecord, ProfilePublic } from "@/lib/account/types";
import { clerkBrowserConfigured } from "./AuthProvider";

export interface AccountPayload {
  id: string;
  email: string;
  plan: AccountRecord["plan"];
  planLabel: string;
  seatLimit: number;
  stripeCustomerId: string | null;
  createdAt: string;
}

interface AccountContextValue {
  ready: boolean;
  authReady: boolean;
  signedIn: boolean;
  clerkSignedIn: boolean;
  account: AccountPayload | null;
  accountUnavailable: boolean;
  profiles: ProfilePublic[];
  activeProfile: ProfilePublic | null;
  refresh: () => Promise<void>;
  switchProfile: (profileId: string | null) => Promise<void>;
  saveGuestBench: (input?: {
    displayName?: string;
    avatar?: string;
    targetProfileId?: string;
  }) => Promise<ProfilePublic | null>;
  createProfile: (input: { displayName: string; avatar?: string }) => Promise<ProfilePublic | null>;
  renameProfile: (profileId: string, displayName: string, avatar?: string) => Promise<boolean>;
  deleteProfile: (profileId: string) => Promise<boolean>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

async function readJson(res: Response) {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  if (clerkBrowserConfigured()) {
    return <ClerkLinkedAccountProvider>{children}</ClerkLinkedAccountProvider>;
  }
  return <AccountSessionProvider>{children}</AccountSessionProvider>;
}

function ClerkLinkedAccountProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  return (
    <AccountSessionProvider
      clerkLoaded={isLoaded}
      clerkUserId={userId ?? null}
      clerkSignedIn={Boolean(isSignedIn)}
    >
      {children}
    </AccountSessionProvider>
  );
}

function AccountSessionProvider({
  children,
  clerkLoaded = true,
  clerkUserId,
  clerkSignedIn,
}: {
  children: React.ReactNode;
  clerkLoaded?: boolean;
  clerkUserId?: string | null;
  clerkSignedIn?: boolean;
}) {
  const clerkEnabled = clerkSignedIn !== undefined;
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<AccountPayload | null>(null);
  const [accountUnavailable, setAccountUnavailable] = useState(false);
  const [profiles, setProfiles] = useState<ProfilePublic[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const syncTimer = useRef<number | undefined>(undefined);
  const lastClerkUserId = useRef<string | null | undefined>(undefined);

  const applySession = useCallback((nextAccount: AccountPayload | null, nextProfiles: ProfilePublic[]) => {
    setAccount(nextAccount);
    setProfiles(nextProfiles);
  }, []);

  const clearToGuest = useCallback(() => {
    applySession(null, []);
    setAccountUnavailable(false);
    setProgressScope("guest");
    setActiveProfileId(null);
    activeRef.current = null;
  }, [applySession]);

  const hydrateProfile = useCallback(async (profileId: string) => {
    setProgressScope({ profileId });
    setActiveProfileId(profileId);
    activeRef.current = profileId;
    const res = await fetch(`/api/profiles/${profileId}/progress`);
    if (!res.ok) return;
    const body = await readJson(res);
    if (body.progress && typeof body.progress === "object") {
      saveProgress(parseProgress(JSON.stringify(body.progress)));
    }
  }, []);

  const switchProfile = useCallback(
    async (profileId: string | null) => {
      if (!profileId) {
        setProgressScope("guest");
        setActiveProfileId(null);
        activeRef.current = null;
        return;
      }
      await hydrateProfile(profileId);
    },
    [hydrateProfile],
  );

  const refresh = useCallback(async () => {
    const res = await fetch("/api/account");
    if (res.status === 401) {
      applySession(null, []);
      setAccountUnavailable(false);
      if (!clerkSignedIn) {
        setProgressScope("guest");
        setActiveProfileId(null);
        activeRef.current = null;
      }
      setReady(true);
      return;
    }
    if (res.status === 503) {
      applySession(null, []);
      setAccountUnavailable(true);
      setReady(true);
      return;
    }
    if (!res.ok) {
      applySession(null, []);
      setAccountUnavailable(false);
      setReady(true);
      return;
    }
    const body = await readJson(res);
    const nextAccount = (body.account as AccountPayload | undefined) ?? null;
    const nextProfiles = Array.isArray(body.profiles) ? (body.profiles as ProfilePublic[]) : [];
    applySession(nextAccount, nextProfiles);
    setAccountUnavailable(false);
    const guest = readGuestProgress();
    const guestBusy = (guest.bench?.owned.length ?? 0) > 0 || (guest.game?.streakCount ?? 0) >= 2;
    const current = activeRef.current;
    if (current && nextProfiles.some((row) => row.id === current)) {
      await hydrateProfile(current);
    } else if (nextProfiles.length && !guestBusy) {
      const last =
        nextProfiles.slice().sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt))[0];
      if (last) await hydrateProfile(last.id);
    } else {
      setProgressScope("guest");
      setActiveProfileId(null);
      activeRef.current = null;
    }
    setReady(true);
  }, [applySession, clerkSignedIn, hydrateProfile]);

  useEffect(() => {
    if (!clerkLoaded) return;

    const userId = clerkEnabled ? (clerkUserId ?? null) : null;
    const prev = lastClerkUserId.current;
    lastClerkUserId.current = userId;

    if (clerkEnabled && prev && !userId) {
      clearToGuest();
      setReady(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [clerkEnabled, clerkLoaded, clerkUserId, clearToGuest, refresh]);

  useEffect(() => {
    setRemoteProgressWriter((state: ProgressState) => {
      const profileId = activeRef.current;
      if (!profileId) return;
      window.clearTimeout(syncTimer.current);
      syncTimer.current = window.setTimeout(() => {
        void fetch(`/api/profiles/${profileId}/progress`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: state }),
        });
      }, 400);
    });
    return () => {
      setRemoteProgressWriter(null);
      window.clearTimeout(syncTimer.current);
    };
  }, []);

  const saveGuestBench = useCallback(
    async (input?: { displayName?: string; avatar?: string; targetProfileId?: string }) => {
      const res = await fetch("/api/profiles/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: readGuestProgress(),
          displayName: input?.displayName,
          avatar: input?.avatar,
          targetProfileId: input?.targetProfileId,
        }),
      });
      const body = await readJson(res);
      if (!res.ok) return null;
      const profile = body.profile as ProfilePublic | undefined;
      if (!profile) return null;
      setProfiles((prev) => {
        const rest = prev.filter((row) => row.id !== profile.id);
        return [...rest, profile].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      });
      await hydrateProfile(profile.id);
      return profile;
    },
    [hydrateProfile],
  );

  const createProfile = useCallback(
    async (input: { displayName: string; avatar?: string }) => {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await readJson(res);
      if (!res.ok) return null;
      const profile = body.profile as ProfilePublic | undefined;
      if (!profile) return null;
      setProfiles((prev) => [...prev, profile]);
      return profile;
    },
    [],
  );

  const renameProfile = useCallback(async (profileId: string, displayName: string, avatar?: string) => {
    const res = await fetch(`/api/profiles/${profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, avatar }),
    });
    const body = await readJson(res);
    if (!res.ok) return false;
    const profile = body.profile as ProfilePublic | undefined;
    if (!profile) return false;
    setProfiles((prev) => prev.map((row) => (row.id === profile.id ? profile : row)));
    return true;
  }, []);

  const deleteProfile = useCallback(
    async (profileId: string) => {
      const res = await fetch(`/api/profiles/${profileId}`, { method: "DELETE" });
      if (!res.ok) return false;
      setProfiles((prev) => prev.filter((row) => row.id !== profileId));
      if (activeRef.current === profileId) {
        await switchProfile(null);
      }
      return true;
    },
    [switchProfile],
  );

  const activeProfile = profiles.find((row) => row.id === activeProfileId) ?? null;
  const clerkIsSignedIn = clerkEnabled ? Boolean(clerkSignedIn) : Boolean(account);

  const value = useMemo<AccountContextValue>(
    () => ({
      ready,
      authReady: clerkLoaded,
      signedIn: clerkIsSignedIn,
      clerkSignedIn: clerkIsSignedIn,
      account,
      accountUnavailable,
      profiles,
      activeProfile,
      refresh,
      switchProfile,
      saveGuestBench,
      createProfile,
      renameProfile,
      deleteProfile,
    }),
    [
      ready,
      clerkLoaded,
      clerkIsSignedIn,
      account,
      accountUnavailable,
      profiles,
      activeProfile,
      refresh,
      switchProfile,
      saveGuestBench,
      createProfile,
      renameProfile,
      deleteProfile,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
}

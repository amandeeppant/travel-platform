import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  portal: string;
};

export type AuthData = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = "travelEaseAuth";

const portalRouteMap: Record<string, string> = {
  traveler: "traveler",
  hotel_partner: "hotel-partner",
  travel_agent: "travel-agent",
  corporate: "corporate",
  admin: "admin",
};

const portalDisplayMap: Record<string, string> = {
  traveler: "Traveler",
  hotel_partner: "Hotel Partner",
  travel_agent: "Travel Agent",
  corporate: "Corporate",
  admin: "Administrator",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredAuthData(): AuthData | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch (err) {
    // Corrupted localStorage data — clear it and return null
    console.warn("Corrupted auth data in localStorage, clearing:", err);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveAuthData(data: AuthData) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAuthData() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getAuthUser(): AuthUser | null {
  return getStoredAuthData()?.user ?? null;
}

export function useAuthUser(): AuthUser | null {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  return authUser;
}

export function useAuthDisplayName(defaultName = "John Doe"): string {
  const authUser = useAuthUser();
  return authUser?.name ?? defaultName;
}

export function getAuthToken(): string | null {
  return getStoredAuthData()?.token ?? null;
}

export function getPortalRouteForUser(user: AuthUser) {
  const normalized = portalRouteMap[user.portal] ?? user.portal;
  return `/portal/${normalized}`;
}

export function getPortalDisplayName(portal: string) {
  return portalDisplayMap[portal] ?? portal.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

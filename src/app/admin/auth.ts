/**
 * Tiny localStorage wrapper for the admin auth token + cached profile.
 *
 * The token comes back from ``POST /api/admin-login/`` and must be sent
 * as ``Authorization: Token <key>`` on every authenticated request. The
 * profile (username) is cached so the topbar can render synchronously
 * without an extra network round-trip on every page navigation.
 */

const TOKEN_KEY = "moreadorn.admin.token";
const PROFILE_KEY = "moreadorn.admin.profile";

export interface AdminProfile {
  username: string;
  is_superuser?: boolean;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* localStorage disabled — non-fatal, user just won't stay logged in */
  }
}

export function clearAuth(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export function getProfile(): AdminProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as AdminProfile) : null;
  } catch {
    return null;
  }
}

export function setProfile(profile: AdminProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

import { API_BASE } from "./client";

interface LoginResponse {
  token: string;
  username: string;
  is_superuser: boolean;
}

interface MeResponse {
  username: string;
  is_superuser: boolean;
  is_staff: boolean;
}

async function asJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      (data && typeof data === "object" && "detail" in data
        ? (data as { detail?: string }).detail
        : null) || `Request failed (${res.status})`;
    throw new Error(detail);
  }
  return data as T;
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/admin-login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return asJson<LoginResponse>(res);
}

export async function adminLogout(token: string): Promise<void> {
  await fetch(`${API_BASE}/admin-logout/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
  }).catch(() => {
    /* even if the network call fails, the local logout still proceeds */
  });
}

export async function adminMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/admin-me/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return asJson<MeResponse>(res);
}

export async function adminResetUsername(
  currentPassword: string,
  newUsername: string,
): Promise<{ username: string }> {
  const res = await fetch(`${API_BASE}/admin-reset-username/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("moreadorn.admin.token") || ""}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_username: newUsername,
    }),
  });
  return asJson<{ username: string }>(res);
}

export async function adminResetPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/admin-reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("moreadorn.admin.token") || ""}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    const detail =
      (data && typeof data === "object" && "detail" in data
        ? (data as { detail?: string }).detail
        : null) || `Request failed (${res.status})`;
    throw new Error(detail);
  }
}

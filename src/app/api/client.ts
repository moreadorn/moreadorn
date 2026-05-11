/**
 * Tiny fetch wrapper for the Django REST API.
 * Set VITE_API_URL / VITE_MEDIA_URL in `.env` to override the defaults.
 */

export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000/api";

export const MEDIA_BASE: string =
  (import.meta.env.VITE_MEDIA_URL as string) || "http://127.0.0.1:8000";

/** Read the admin token at request-time (never cached at module load). */
function authHeader(): Record<string, string> {
  try {
    const token = localStorage.getItem("moreadorn.admin.token");
    return token ? { Authorization: `Token ${token}` } : {};
  } catch {
    return {};
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  const message = extractMessage(data) || `Request failed with ${res.status}`;
  return new ApiError(message, res.status, data);
}

/**
 * Pull the most user-friendly message we can out of a DRF error body.
 * Handles both ``{detail: "..."}`` and field-level ``{email: ["..."]}``
 * shapes — falls back to ``null`` so the caller can supply a default.
 */
function extractMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.detail === "string") return obj.detail;
  // First field-level error wins. DRF returns `{field: ["msg1", "msg2"]}`.
  for (const value of Object.values(obj)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && value.length && typeof value[0] === "string") {
      return value[0] as string;
    }
  }
  return null;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...authHeader() },
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPostForm<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
    headers: { ...authHeader() },
    // Do NOT set Content-Type — the browser sets the multipart boundary.
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPostJson<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPatchJson<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPatchForm<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    body: formData,
    headers: { ...authHeader() },
    // Browser sets multipart Content-Type with the right boundary.
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok && res.status !== 204) throw await parseError(res);
}

/** Make a media URL absolute (Django returns relative `/media/...` paths). */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${MEDIA_BASE}${path}`;
}

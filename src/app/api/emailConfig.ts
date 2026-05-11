import {
  apiDelete,
  apiGet,
  apiPatchJson,
  apiPostJson,
} from "./client";

export interface EmailConfig {
  id: string;
  label: string;
  email: string;
  host: string;
  port: number;
  use_tls: boolean;
  active: boolean;
  /** Masked preview, e.g. "••••••••XX". Never the raw value. */
  app_password: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailConfigPayload {
  label: string;
  email: string;
  host?: string;
  port?: number;
  use_tls?: boolean;
  active?: boolean;
  /** The raw app password — write-only on the backend. */
  app_password_input: string;
}

export interface UpdateEmailConfigPayload {
  label?: string;
  email?: string;
  host?: string;
  port?: number;
  use_tls?: boolean;
  active?: boolean;
  /** Optional on update. Pass a non-empty string to overwrite. */
  app_password_input?: string;
}

interface PaginatedConfigs {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmailConfig[];
}

export async function listEmailConfigs(): Promise<EmailConfig[]> {
  const data = await apiGet<PaginatedConfigs | EmailConfig[]>(
    `/email-configs/?_=${Date.now()}`,
  );
  return Array.isArray(data) ? data : (data.results ?? []);
}

export function getEmailConfig(id: string): Promise<EmailConfig> {
  return apiGet<EmailConfig>(`/email-configs/${id}/?_=${Date.now()}`);
}

export function createEmailConfig(
  payload: CreateEmailConfigPayload,
): Promise<EmailConfig> {
  return apiPostJson<EmailConfig>("/email-configs/", payload);
}

export function updateEmailConfig(
  id: string,
  payload: UpdateEmailConfigPayload,
): Promise<EmailConfig> {
  return apiPatchJson<EmailConfig>(`/email-configs/${id}/`, payload);
}

export function deleteEmailConfig(id: string): Promise<void> {
  return apiDelete(`/email-configs/${id}/`);
}

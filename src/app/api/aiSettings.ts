import { apiGet, apiPatchJson, apiPostJson } from "./client";

export interface AiSettings {
  id: string;
  provider: "gemini";
  model_name: string;
  assistant_name: string;
  welcome_message: string;
  enabled: boolean;
  max_output_tokens: number;
  temperature: number;
  /** Masked preview of the stored API key — never the raw value. */
  api_key: string;
  /** True when a key is configured. */
  api_key_set: boolean;
  updated_at: string;
}

export interface AiSettingsInput {
  provider?: "gemini";
  model_name?: string;
  assistant_name?: string;
  welcome_message?: string;
  enabled?: boolean;
  max_output_tokens?: number;
  temperature?: number;
  /** Pass the new raw key here to overwrite the stored one. */
  api_key_input?: string;
}

const ENDPOINT = "/ai-settings/";

export function fetchAiSettings(): Promise<AiSettings> {
  return apiGet<AiSettings>(`${ENDPOINT}?_=${Date.now()}`);
}

export function updateAiSettings(
  payload: AiSettingsInput,
): Promise<AiSettings> {
  return apiPatchJson<AiSettings>(ENDPOINT, payload);
}

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export interface ChatResponse {
  reply?: string;
  assistant_name?: string;
  offline?: boolean;
  error?: string;
}

export function sendChatMessage(
  message: string,
  history: ChatTurn[],
): Promise<ChatResponse> {
  return apiPostJson<ChatResponse>("/ai-chat/", { message, history });
}

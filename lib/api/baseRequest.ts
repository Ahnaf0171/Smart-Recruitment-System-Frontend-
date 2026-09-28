import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/auth/token";
import { refreshAccessToken } from "@/lib/auth/refresh";

export type BaseRequestResult<T> = {
  response: Response;
  parsed: unknown;
};

export const createBaseRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  retry = true
): Promise<BaseRequestResult<T>> => {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return createBaseRequest<T>(endpoint, method, body, false);
    }
  }

  const isJson = response.headers
    .get("Content-Type")
    ?.includes("application/json");

  const parsed = isJson ? await response.json() : null;

  return { response, parsed };
};

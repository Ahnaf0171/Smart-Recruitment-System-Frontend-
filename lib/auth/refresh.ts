import { API_BASE_URL } from "@/lib/constants";
import { getRefreshToken, saveTokens, clearTokens } from "./token";

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/accounts/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    saveTokens(data.access, data.refresh ?? refresh);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
};

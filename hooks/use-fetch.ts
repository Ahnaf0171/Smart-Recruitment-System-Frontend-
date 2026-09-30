import { useCallback, useEffect, useState } from "react";
import { getData } from "@/lib/api/methods";
import { showError } from "@/lib/toast";

export function useFetch<T>(endpoint: string | null, showToast = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorData, setErrorData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError("");
    setErrorData(null);

    const res = await getData<T>(endpoint);

    if (res.success) {
      setData(res.data);
    } else {
      setError(res.message);
      setErrorData((res as any).errorData ?? null);
      if (showToast) showError(res.message);
    }

    setLoading(false);
  }, [endpoint, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, errorData, refetch: fetchData };
}

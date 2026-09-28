import { useEffect, useState } from "react";
import { getData } from "@/lib/api/methods";

export function usePaginatedFetch<T>(
  endpoint: string,
  initialPage = 1,
  limit = 10
) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = async (pageNo: number) => {
    setLoading(true);
    setError("");

    const res = await getData<any>(
      `${endpoint}?page=${pageNo}&limit=${limit}`
    );

    if (res.success) {
      setData(res.data.data);
      setMeta(res.data.meta);
    } else {
      setError(res.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  return {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch: () => fetchPage(page),
  };
}

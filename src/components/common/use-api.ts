"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/client";

// Thin wrapper over SWR so pages keep a simple { data, error, loading } shape.
// SWR handles fetching, caching, deduplication, and revalidation for us —
// replacing the hand-rolled useAsync hook. Pass `null` as the key to skip a
// fetch (e.g. an empty search query).
export function useApi<T>(key: string | null) {
  const { data, error, isLoading } = useSWR<T>(
    key,
    fetcher as (url: string) => Promise<T>
  );
  return {
    data: (data ?? null) as T | null,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    loading: isLoading,
  };
}

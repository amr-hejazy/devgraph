"use client";

import { TechnologyBadge } from "@/components/common/technology-badge";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { useApi } from "@/components/common/use-api";
import type { Technology } from "@/types/graph";

export default function TechnologiesPage() {
  const { data, loading, error } = useApi<Technology[]>("/api/technologies?limit=200");

  return (
    <div>
      <PageHeader
        title="Technologies"
        description="The tools, languages, and platforms in the network."
      />
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState title="No technologies found" description="The graph database returned no technologies." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((t) => (
            <TechnologyBadge key={t.id} id={t.id} name={t.name} />
          ))}
        </div>
      )}
    </div>
  );
}

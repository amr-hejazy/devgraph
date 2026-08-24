"use client";

import { TechnologyCard } from "@/components/common/technology-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { CardGridSkeleton } from "@/components/common/loading";
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
        <CardGridSkeleton count={12} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No technologies found" description="The graph database returned no technologies." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((t) => (
            <TechnologyCard key={t.id} technology={t} />
          ))}
        </div>
      )}
    </div>
  );
}

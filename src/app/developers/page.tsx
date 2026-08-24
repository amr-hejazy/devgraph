"use client";

import { DeveloperCard } from "@/components/common/developer-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { EmptyState } from "@/components/common/empty-state";
import { useApi } from "@/components/common/use-api";
import type { Developer } from "@/types/graph";

export default function DevelopersPage() {
  const { data, loading, error } = useApi<Developer[]>("/api/developers?limit=200");

  return (
    <div>
      <PageHeader
        title="Developers"
        description="People in the network and the technologies they know."
      />
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <CardGridSkeleton count={12} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No developers found" description="The graph database returned no developers." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((d) => (
            <DeveloperCard key={d.id} developer={d} />
          ))}
        </div>
      )}
    </div>
  );
}

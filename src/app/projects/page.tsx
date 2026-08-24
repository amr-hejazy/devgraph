"use client";

import { ProjectCard } from "@/components/common/project-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { EmptyState } from "@/components/common/empty-state";
import { useApi } from "@/components/common/use-api";
import type { Project } from "@/types/graph";

export default function ProjectsPage() {
  const { data, loading, error } = useApi<Project[]>("/api/projects?limit=200");

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Things being built across the network."
      />
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <CardGridSkeleton count={9} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No projects found" description="The graph database returned no projects." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

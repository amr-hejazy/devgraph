"use client";

import { useParams } from "next/navigation";
import { FolderGit2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/common/project-card";
import { DeveloperCard } from "@/components/common/developer-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { DetailSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { TechnologyWithRelations } from "@/types/graph";

export default function TechnologyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useApi<TechnologyWithRelations>("/api/technologies/" + id);

  if (error) return <ErrorState message={error} />;
  if (loading || !data) return <DetailSkeleton />;

  const { technology, projects, developers } = data;

  return (
    <div className="space-y-8">
      <div>
        <PageHeader title={technology.name} description={technology.category} />
        <Badge variant="outline">{technology.category}</Badge>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <FolderGit2 className="size-5" /> Used by {projects.length} project
          {projects.length === 1 ? "" : "s"}
        </h2>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Users className="size-5" /> Known by {developers.length} developer
          {developers.length === 1 ? "" : "s"}
        </h2>
        {developers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No developers recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {developers.map((d) => (
              <DeveloperCard key={d.id} developer={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

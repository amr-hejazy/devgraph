"use client";

import { useParams } from "next/navigation";
import { FolderGit2, Users } from "lucide-react";
import { ProjectCard } from "@/components/common/project-card";
import { DeveloperCard } from "@/components/common/developer-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { DetailSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { CompanyWithRelations } from "@/types/graph";

function yearRange(start: number | null, end: number | null) {
  if (start === null) return "";
  return start + "–" + (end ?? "Present");
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useApi<CompanyWithRelations>("/api/companies/" + id);

  if (error) return <ErrorState message={error} />;
  if (loading || !data) return <DetailSkeleton />;

  const { company, developers, projects } = data;

  return (
    <div className="space-y-8">
      <PageHeader title={company.name} description={company.industry} />

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Users className="size-5" /> People ({developers.length})
        </h2>
        {developers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No developers recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {developers.map(({ developer, role, startYear, endYear }) => (
              <div key={developer.id} className="space-y-1">
                <DeveloperCard developer={developer} />
                <p className="px-1 text-xs text-muted-foreground">
                  {role} · {yearRange(startYear, endYear)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <FolderGit2 className="size-5" /> Projects ({projects.length})
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
    </div>
  );
}

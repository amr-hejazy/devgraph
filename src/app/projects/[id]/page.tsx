"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, FolderGit2, Users } from "lucide-react";
import { TechnologyBadge } from "@/components/common/technology-badge";
import { DeveloperCard } from "@/components/common/developer-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { DetailSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { ProjectWithRelations } from "@/types/graph";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useApi<ProjectWithRelations>("/api/projects/" + id);

  if (error) return <ErrorState message={error} />;
  if (loading || !data) return <DetailSkeleton />;

  const { project, company, technologies, contributors } = data;

  return (
    <div className="space-y-8">
      <div>
        <PageHeader title={project.name} description={project.description} />
        {company ? (
          <Link
            href={"/companies/" + company.id}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <Building2 className="size-4" /> {company.name}
          </Link>
        ) : null}
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <FolderGit2 className="size-5" /> Technologies used
        </h2>
        {technologies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No technologies recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <TechnologyBadge key={t.id} id={t.id} name={t.name} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Users className="size-5" /> Contributors
        </h2>
        {contributors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contributors recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contributors.map(({ developer, role }) => (
              <div key={developer.id} className="space-y-1">
                <DeveloperCard developer={developer} />
                <p className="px-1 text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

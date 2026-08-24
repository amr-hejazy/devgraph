"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Briefcase, FolderGit2, Users, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechnologyBadge } from "@/components/common/technology-badge";
import { ProjectCard } from "@/components/common/project-card";
import { DeveloperCard } from "@/components/common/developer-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { DetailSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { DeveloperWithRelations } from "@/types/graph";

function yearRange(start: number | null, end: number | null) {
  if (start === null) return "";
  return `${start}–${end ?? "Present"}`;
}

export default function DeveloperDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useApi<DeveloperWithRelations>(`/api/developers/${id}`);

  if (error) return <ErrorState message={error} />;
  if (loading || !data) return <DetailSkeleton />;

  const { developer, technologies, projects, companies, collaborators } = data;

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title={developer.name}
          description={developer.bio}
        />
        {developer.location ? (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {developer.location}
          </p>
        ) : null}
        <div className="mt-4">
          <Button asChild>
            <Link href={`/developers/${developer.id}/connections`}>
              <Network className="size-4" /> Find Connections
            </Link>
          </Button>
        </div>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Badge variant="outline" className="size-6 justify-center p-0">T</Badge>
          Technologies
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
          <FolderGit2 className="size-5" /> Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(({ project, role }) => (
              <div key={project.id} className="space-y-2">
                <ProjectCard project={project} />
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Briefcase className="size-5" /> Experience
        </h2>
        {companies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No companies recorded.</p>
        ) : (
          <div className="space-y-3">
            {companies.map(({ company, role, startYear, endYear }) => (
              <Card key={company.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <Link href={`/companies/${company.id}`} className="font-medium hover:underline">
                      {company.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{role}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {yearRange(startYear, endYear)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Users className="size-5" /> Collaborators
        </h2>
        {collaborators.length === 0 ? (
          <p className="text-sm text-muted-foreground">No direct collaborators recorded.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collaborators.map((c) => (
              <DeveloperCard key={c.id} developer={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

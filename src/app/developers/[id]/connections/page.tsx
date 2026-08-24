"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { DetailSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { CollaboratorSuggestion, Developer } from "@/types/graph";

type ConnectionsResponse = {
  developer: Developer;
  suggestions: CollaboratorSuggestion[];
};

export default function ConnectionsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error } = useApi<ConnectionsResponse>("/api/developers/" + id + "/connections");

  return (
    <div className="space-y-6">
      <Link
        href={"/developers/" + id}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </Link>

      {error ? (
        <ErrorState message={error} />
      ) : loading || !data ? (
        <DetailSkeleton />
      ) : (
        <>
          <PageHeader
            title="People to connect with"
            description={
              "Developer-graph matches for " +
              data.developer.name +
              ", found through shared projects and technologies."
            }
          />

          {data.suggestions.length === 0 ? (
            <EmptyState
              title="No connections found"
              description={
                "We couldn't find any developers connected to " +
                data.developer.name +
                " through shared projects or technologies."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.suggestions.map((s) => (
                <Card key={s.developer.id} className="h-full">
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <Link
                        href={"/developers/" + s.developer.id}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <Network className="size-4 text-primary" />
                        {s.developer.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Shares {s.sharedTechnologies.length} technolog
                        {s.sharedTechnologies.length === 1 ? "y" : "ies"} and{" "}
                        {s.sharedProjects.length} project
                        {s.sharedProjects.length === 1 ? "" : "s"} with{" "}
                        {data.developer.name}.
                      </p>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Shared technologies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.sharedTechnologies.map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-full">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Shared projects
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.sharedProjects.map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-muted px-2.5 py-0.5 text-sm"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import { TechnologyBadge } from "@/components/common/technology-badge";
import { ProjectCard } from "@/components/common/project-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { StatSkeleton, CardGridSkeleton } from "@/components/common/loading";
import { useApi } from "@/components/common/use-api";
import type { Project, Technology } from "@/types/graph";

type Stats = {
  developers: number;
  projects: number;
  technologies: number;
  companies: number;
};

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const stats = useApi<Stats>("/api/stats");
  const techs = useApi<Technology[]>("/api/technologies?limit=12");
  const projects = useApi<Project[]>("/api/projects?limit=6");

  const loading = stats.loading || techs.loading || projects.loading;
  const error = stats.error || techs.error || projects.error;
  const data =
    stats.data && techs.data && projects.data
      ? { stats: stats.data, techs: techs.data, projects: projects.data }
      : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push("/search?q=" + encodeURIComponent(term));
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border bg-muted/30 px-6 py-12 text-center sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">DevGraph</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Explore the developer network. Follow relationships between people,
          the technologies they use, the projects they ship, and the companies
          they build for.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex w-full max-w-md gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search developers, projects, technologies..."
            aria-label="Search"
          />
          <Button type="submit">Search</Button>
        </form>
      </section>

      {error ? (
        <ErrorState message={error} />
      ) : loading || !data ? (
        <div className="space-y-10">
          <StatSkeleton />
          <CardGridSkeleton />
        </div>
      ) : (
        <>
          <section>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Developers" value={data.stats.developers} href="/developers" />
              <StatCard label="Projects" value={data.stats.projects} href="/projects" />
              <StatCard label="Technologies" value={data.stats.technologies} href="/technologies" />
              <StatCard label="Companies" value={data.stats.companies} href="/companies" />
            </div>
          </section>

          <section>
            <PageHeader
              title="Featured technologies"
              description="Jump into a technology to see who knows it and what it powers."
            />
            <div className="flex flex-wrap gap-2">
              {data.techs.map((t) => (
                <TechnologyBadge key={t.id} id={t.id} name={t.name} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Featured projects</h2>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

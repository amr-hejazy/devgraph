"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { useApi } from "@/components/common/use-api";
import type { SearchResult, NodeLabel } from "@/types/graph";

const TYPE_HREF: Record<NodeLabel, (id: string) => string> = {
  Developer: (id) => "/developers/" + id,
  Project: (id) => "/projects/" + id,
  Technology: (id) => "/technologies/" + id,
  Company: (id) => "/companies/" + id,
};

const TYPE_ORDER: NodeLabel[] = ["Developer", "Project", "Technology", "Company"];

export default function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [committed, setCommitted] = useState(initialQuery);

  const { data, loading, error } = useApi<SearchResult[]>("/api/search?q=" + encodeURIComponent(committed));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    setCommitted(term);
    router.push(term ? "/search?q=" + encodeURIComponent(term) : "/search");
  }

  const grouped: Record<string, SearchResult[]> = {};
  if (data) {
    for (const r of data) (grouped[r.type] ??= []).push(r);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description="Find developers, projects, technologies, and companies."
      />

      <form onSubmit={submit} className="flex w-full max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the network..."
            className="pl-8"
            aria-label="Search query"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {committed === "" ? (
        <EmptyState
          title="Start searching"
          description="Type a name, technology, or project to explore the graph."
        />
      ) : error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Searching…</p>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="No results"
          description={`Nothing matched "${committed}".`}
        />
      ) : (
        <div className="space-y-6">
          {TYPE_ORDER.filter((t) => grouped[t]?.length).map((type) => (
            <section key={type}>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {type}s ({grouped[type].length})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[type].map((r) => (
                  <Link key={type + r.id} href={TYPE_HREF[r.type](r.id)}>
                    <Card className="h-full transition-colors hover:border-primary/50">
                      <CardContent className="p-4">
                        <p className="font-medium">{r.label}</p>
                        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                          {r.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

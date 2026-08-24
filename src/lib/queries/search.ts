import type { SearchResult } from "@/types/graph";
import { searchDevelopers } from "./developers";
import { searchProjects } from "./projects";
import { searchTechnologies } from "./technologies";
import { searchCompanies } from "./companies";

// Global search across every node label. Returns a flat, type-tagged list so
// the UI can group/label results by entity type.
export async function globalSearch(term: string): Promise<SearchResult[]> {
  const clean = term.trim();
  if (!clean) return [];

  const [developers, projects, technologies, companies] = await Promise.all([
    searchDevelopers(clean),
    searchProjects(clean),
    searchTechnologies(clean),
    searchCompanies(clean),
  ]);

  const results: SearchResult[] = [
    ...developers.map((d) => ({
      type: "Developer" as const,
      id: d.id,
      label: d.name,
      detail: d.location || "Developer",
    })),
    ...projects.map((p) => ({
      type: "Project" as const,
      id: p.id,
      label: p.name,
      detail: p.description ? p.description.slice(0, 80) : "Project",
    })),
    ...technologies.map((t) => ({
      type: "Technology" as const,
      id: t.id,
      label: t.name,
      detail: t.category || "Technology",
    })),
    ...companies.map((c) => ({
      type: "Company" as const,
      id: c.id,
      label: c.name,
      detail: c.industry || "Company",
    })),
  ];

  return results;
}

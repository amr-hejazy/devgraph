import { runRead } from "@/lib/db";
import type { Developer, Project, Technology } from "@/types/graph";
import { nodeProps, toDeveloper, toProject, toTechnology } from "./helpers";

export async function listTechnologies(limit = 200): Promise<Technology[]> {
  return runRead(
    `MATCH (t:Technology) RETURN t ORDER BY t.name LIMIT $limit`,
    { limit },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
}

export async function getTechnology(id: string): Promise<Technology | null> {
  const rows = await runRead(
    `MATCH (t:Technology {id: $id}) RETURN t`,
    { id },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
  return rows[0] ?? null;
}

export async function searchTechnologies(term: string, limit = 20): Promise<Technology[]> {
  const clean = term.trim();
  if (!clean) return [];
  return runRead(
    `MATCH (t:Technology)
     WHERE toLower(t.name) CONTAINS toLower($term)
        OR toLower(t.category) CONTAINS toLower($term)
     RETURN t ORDER BY t.name LIMIT $limit`,
    { term: clean, limit },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
}

export async function getTechnologyProjects(id: string): Promise<Project[]> {
  return runRead(
    `MATCH (p:Project)-[:USES]->(t:Technology {id: $id})
     RETURN p ORDER BY p.name`,
    { id },
    (r) => toProject(nodeProps(r.get("p")))
  );
}

export async function getTechnologyDevelopers(id: string): Promise<Developer[]> {
  return runRead(
    `MATCH (d:Developer)-[:KNOWS]->(t:Technology {id: $id})
     RETURN d ORDER BY d.name`,
    { id },
    (r) => toDeveloper(nodeProps(r.get("d")))
  );
}

export async function getTechnologyWithRelations(
  id: string
): Promise<{ technology: Technology; projects: Project[]; developers: Developer[] } | null> {
  const technology = await getTechnology(id);
  if (!technology) return null;

  const [projects, developers] = await Promise.all([
    getTechnologyProjects(id),
    getTechnologyDevelopers(id),
  ]);

  return { technology, projects, developers };
}

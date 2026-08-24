import { runRead } from "@/lib/db";
import type {
  Developer,
  DeveloperWithRelations,
  Project,
  Technology,
  Company,
} from "@/types/graph";
import {
  nodeProps,
  toDeveloper,
  toProject,
  toTechnology,
  toCompany,
  toInt,
} from "./helpers";

export async function listDevelopers(limit = 200): Promise<Developer[]> {
  return runRead(
    `MATCH (d:Developer) RETURN d ORDER BY d.name LIMIT $limit`,
    { limit },
    (r) => toDeveloper(nodeProps(r.get("d")))
  );
}

export async function getDeveloper(id: string): Promise<Developer | null> {
  const rows = await runRead(
    `MATCH (d:Developer {id: $id}) RETURN d`,
    { id },
    (r) => toDeveloper(nodeProps(r.get("d")))
  );
  return rows[0] ?? null;
}

export async function searchDevelopers(term: string, limit = 20): Promise<Developer[]> {
  const clean = term.trim();
  if (!clean) return [];
  return runRead(
    `MATCH (d:Developer)
     WHERE toLower(d.name) CONTAINS toLower($term)
        OR toLower(d.location) CONTAINS toLower($term)
     RETURN d ORDER BY d.name LIMIT $limit`,
    { term: clean, limit },
    (r) => toDeveloper(nodeProps(r.get("d")))
  );
}

// Technologies directly known by a developer (Query 1).
export async function getDeveloperTechnologies(id: string): Promise<Technology[]> {
  return runRead(
    `MATCH (d:Developer {id: $developerId})-[:KNOWS]->(t:Technology)
     RETURN t ORDER BY t.name`,
    { developerId: id },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
}

// Technologies used by a developer's projects (Query 2, multi-hop).
export async function getDeveloperProjectTechnologies(id: string): Promise<Technology[]> {
  return runRead(
    `MATCH (d:Developer {id: $developerId})-[:CONTRIBUTED_TO]->(p:Project)-[:USES]->(t:Technology)
     RETURN DISTINCT t ORDER BY t.name`,
    { developerId: id },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
}

export async function getDeveloperProjects(
  id: string
): Promise<Array<{ project: Project; role: string }>> {
  return runRead(
    `MATCH (d:Developer {id: $id})-[r:CONTRIBUTED_TO]->(p:Project)
     RETURN p, r ORDER BY p.name`,
    { id },
    (r) => ({
      project: toProject(nodeProps(r.get("p"))),
      role: String(r.get("r").properties.role ?? ""),
    })
  );
}

export async function getDeveloperCompanies(
  id: string
): Promise<
  Array<{ company: Company; role: string; startYear: number | null; endYear: number | null }>
> {
  return runRead(
    `MATCH (d:Developer {id: $id})-[r:WORKED_AT]->(c:Company)
     RETURN c, r ORDER BY r.startYear`,
    { id },
    (r) => {
      const rel = r.get("r").properties;
      return {
        company: toCompany(nodeProps(r.get("c"))),
        role: String(rel.role ?? ""),
        startYear: toInt(rel.startYear),
        endYear: rel.endYear === null ? null : toInt(rel.endYear),
      };
    }
  );
}

export async function getDeveloperCollaborators(id: string): Promise<Developer[]> {
  return runRead(
    `MATCH (d:Developer {id: $id})-[:COLLABORATED_WITH]-(other:Developer)
     WHERE other.id <> d.id
     RETURN DISTINCT other ORDER BY other.name`,
    { id },
    (r) => toDeveloper(nodeProps(r.get("other")))
  );
}

export async function getDeveloperWithRelations(
  id: string
): Promise<DeveloperWithRelations | null> {
  const dev = await getDeveloper(id);
  if (!dev) return null;

  const [technologies, projects, companies, collaborators] = await Promise.all([
    getDeveloperTechnologies(id),
    getDeveloperProjects(id),
    getDeveloperCompanies(id),
    getDeveloperCollaborators(id),
  ]);

  return { developer: dev, technologies, projects, companies, collaborators };
}

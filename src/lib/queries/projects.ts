import { runRead } from "@/lib/db";
import type { Company, Developer, Project, Technology } from "@/types/graph";
import {
  nodeProps,
  toCompany,
  toDeveloper,
  toProject,
  toTechnology,
} from "./helpers";

export async function listProjects(limit = 200): Promise<Project[]> {
  return runRead(
    `MATCH (p:Project) RETURN p ORDER BY p.name LIMIT $limit`,
    { limit },
    (r) => toProject(nodeProps(r.get("p")))
  );
}

export async function getProject(id: string): Promise<Project | null> {
  const rows = await runRead(
    `MATCH (p:Project {id: $id}) RETURN p`,
    { id },
    (r) => toProject(nodeProps(r.get("p")))
  );
  return rows[0] ?? null;
}

export async function searchProjects(term: string, limit = 20): Promise<Project[]> {
  const clean = term.trim();
  if (!clean) return [];
  return runRead(
    `MATCH (p:Project)
     WHERE toLower(p.name) CONTAINS toLower($term)
        OR toLower(p.description) CONTAINS toLower($term)
     RETURN p ORDER BY p.name LIMIT $limit`,
    { term: clean, limit },
    (r) => toProject(nodeProps(r.get("p")))
  );
}

export async function getProjectTechnologies(id: string): Promise<Technology[]> {
  return runRead(
    `MATCH (p:Project {id: $id})-[:USES]->(t:Technology)
     RETURN t ORDER BY t.name`,
    { id },
    (r) => toTechnology(nodeProps(r.get("t")))
  );
}

export async function getProjectCompany(id: string): Promise<Company | null> {
  const rows = await runRead(
    `MATCH (p:Project {id: $id})-[r:OWNED_BY]->(c:Company)
     RETURN c`,
    { id },
    (r) => toCompany(nodeProps(r.get("c")))
  );
  return rows[0] ?? null;
}

export async function getProjectContributors(
  id: string
): Promise<Array<{ developer: Developer; role: string }>> {
  return runRead(
    `MATCH (p:Project {id: $id})<-[r:CONTRIBUTED_TO]-(d:Developer)
     RETURN d, r ORDER BY d.name`,
    { id },
    (r) => ({
      developer: toDeveloper(nodeProps(r.get("d"))),
      role: String(r.get("r").properties.role ?? ""),
    })
  );
}

export async function getProjectWithRelations(
  id: string
): Promise<{
  project: Project;
  company: Company | null;
  technologies: Technology[];
  contributors: Array<{ developer: Developer; role: string }>;
} | null> {
  const project = await getProject(id);
  if (!project) return null;

  const [company, technologies, contributors] = await Promise.all([
    getProjectCompany(id),
    getProjectTechnologies(id),
    getProjectContributors(id),
  ]);

  return { project, company, technologies, contributors };
}

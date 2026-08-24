import { runRead } from "@/lib/db";
import type { Company, Developer, Project } from "@/types/graph";
import { nodeProps, toCompany, toDeveloper, toProject, toInt } from "./helpers";

export async function listCompanies(limit = 200): Promise<Company[]> {
  return runRead(
    `MATCH (c:Company) RETURN c ORDER BY c.name LIMIT $limit`,
    { limit },
    (r) => toCompany(nodeProps(r.get("c")))
  );
}

export async function getCompany(id: string): Promise<Company | null> {
  const rows = await runRead(
    `MATCH (c:Company {id: $id}) RETURN c`,
    { id },
    (r) => toCompany(nodeProps(r.get("c")))
  );
  return rows[0] ?? null;
}

export async function searchCompanies(term: string, limit = 20): Promise<Company[]> {
  const clean = term.trim();
  if (!clean) return [];
  return runRead(
    `MATCH (c:Company)
     WHERE toLower(c.name) CONTAINS toLower($term)
        OR toLower(c.industry) CONTAINS toLower($term)
     RETURN c ORDER BY c.name LIMIT $limit`,
    { term: clean, limit },
    (r) => toCompany(nodeProps(r.get("c")))
  );
}

export async function getCompanyDevelopers(
  id: string
): Promise<
  Array<{ developer: Developer; role: string; startYear: number | null; endYear: number | null }>
> {
  return runRead(
    `MATCH (d:Developer)-[r:WORKED_AT]->(c:Company {id: $id})
     RETURN d, r ORDER BY r.startYear`,
    { id },
    (r) => {
      const rel = r.get("r").properties;
      return {
        developer: toDeveloper(nodeProps(r.get("d"))),
        role: String(rel.role ?? ""),
        startYear: toInt(rel.startYear),
        endYear: rel.endYear === null ? null : toInt(rel.endYear),
      };
    }
  );
}

export async function getCompanyProjects(id: string): Promise<Project[]> {
  return runRead(
    `MATCH (p:Project)-[:OWNED_BY]->(c:Company {id: $id})
     RETURN p ORDER BY p.name`,
    { id },
    (r) => toProject(nodeProps(r.get("p")))
  );
}

export async function getCompanyWithRelations(
  id: string
): Promise<
  | {
      company: Company;
      developers: Array<{
        developer: Developer;
        role: string;
        startYear: number | null;
        endYear: number | null;
      }>;
      projects: Project[];
    }
  | null
> {
  const company = await getCompany(id);
  if (!company) return null;

  const [developers, projects] = await Promise.all([
    getCompanyDevelopers(id),
    getCompanyProjects(id),
  ]);

  return { company, developers, projects };
}

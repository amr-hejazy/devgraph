import { runRead, toNumber } from "@/lib/db";

export interface GraphStats {
  developers: number;
  projects: number;
  technologies: number;
  companies: number;
}

// One query that computes the four dashboard counts.
export async function getGraphStats(): Promise<GraphStats> {
  const rows = await runRead(
    `MATCH (d:Developer) WITH count(d) AS dev
     MATCH (p:Project) WITH dev, count(p) AS proj
     MATCH (t:Technology) WITH dev, proj, count(t) AS tech
     MATCH (c:Company)
     RETURN dev AS developers, proj AS projects, tech AS technologies, count(c) AS companies`,
    {},
    (r) => ({
      developers: toNumber(r.get("developers")) ?? 0,
      projects: toNumber(r.get("projects")) ?? 0,
      technologies: toNumber(r.get("technologies")) ?? 0,
      companies: toNumber(r.get("companies")) ?? 0,
    })
  );
  return rows[0] ?? { developers: 0, projects: 0, technologies: 0, companies: 0 };
}

export async function countProjectsUsingTechnology(techId: string): Promise<number> {
  const rows = await runRead(
    `MATCH (p:Project)-[:USES]->(t:Technology {id: $techId})
     RETURN count(p) AS c`,
    { techId },
    (r) => toNumber(r.get("c")) ?? 0
  );
  return rows[0] ?? 0;
}

export async function countDevelopersKnowingTechnology(techId: string): Promise<number> {
  const rows = await runRead(
    `MATCH (d:Developer)-[:KNOWS]->(t:Technology {id: $techId})
     RETURN count(d) AS c`,
    { techId },
    (r) => toNumber(r.get("c")) ?? 0
  );
  return rows[0] ?? 0;
}

export async function countProjectsOwnedByCompany(companyId: string): Promise<number> {
  const rows = await runRead(
    `MATCH (p:Project)-[:OWNED_BY]->(c:Company {id: $companyId})
     RETURN count(p) AS c`,
    { companyId },
    (r) => toNumber(r.get("c")) ?? 0
  );
  return rows[0] ?? 0;
}

export async function countDevelopersAtCompany(companyId: string): Promise<number> {
  const rows = await runRead(
    `MATCH (d:Developer)-[:WORKED_AT]->(c:Company {id: $companyId})
     RETURN count(d) AS c`,
    { companyId },
    (r) => toNumber(r.get("c")) ?? 0
  );
  return rows[0] ?? 0;
}

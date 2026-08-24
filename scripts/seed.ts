import { readFileSync } from "fs";
import { resolve } from "path";
import { getDriver } from "../src/lib/db";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env.local optional.
  }
}

loadEnvFile();

interface TechInput { id: string; name: string; category: string; }
interface CompanyInput { id: string; name: string; industry: string; }
interface ProjectInput { id: string; name: string; description: string; companyId: string; techIds: string[]; }

const TECHNOLOGIES: TechInput[] = [
  { id: "react", name: "React", category: "Frontend" },
  { id: "nextjs", name: "Next.js", category: "Framework" },
  { id: "nodejs", name: "Node.js", category: "Backend" },
  { id: "typescript", name: "TypeScript", category: "Language" },
  { id: "python", name: "Python", category: "Language" },
  { id: "postgresql", name: "PostgreSQL", category: "Database" },
  { id: "mongodb", name: "MongoDB", category: "Database" },
  { id: "docker", name: "Docker", category: "DevOps" },
  { id: "aws", name: "AWS", category: "Cloud" },
  { id: "dotnet", name: ".NET", category: "Framework" },
  { id: "graphql", name: "GraphQL", category: "API" },
  { id: "kubernetes", name: "Kubernetes", category: "DevOps" },
];

const COMPANIES: CompanyInput[] = [
  { id: "comp-1", name: "Northwind Labs", industry: "Software" },
  { id: "comp-2", name: "Helix Systems", industry: "Fintech" },
  { id: "comp-3", name: "BluePeak Cloud", industry: "Cloud Infrastructure" },
  { id: "comp-4", name: "Orbit Media", industry: "Media" },
  { id: "comp-5", name: "Quanta AI", industry: "Artificial Intelligence" },
  { id: "comp-6", name: "Forge Consulting", industry: "Consulting" },
  { id: "comp-7", name: "Lumina Health", industry: "Healthcare" },
];

const DEVELOPER_NAMES: string[] = [
  "Amr Khaled", "Aisha Rahman", "Liam Chen", "Sofia Martinez", "Noah Patel",
  "Maya Singh", "Ethan Walker", "Zara Ali", "Lucas Romano", "Hana Kim",
  "Omar Farouk", "Elena Petrova", "Daniel Cohen", "Priya Nair", "Yusuf Demir",
  "Chloe Dubois", "Mateo Rossi", "Nina Kovac", "Sami Hassan", "Lara Novak",
  "Ivan Petrov", "Aisha Khan", "Theo Muller", "Ravi Sharma", "Leila Haddad",
  "Felix Wagner", "Amara Okafor", "Jonas Lind", "Yuki Tanaka", "Camila Diaz",
  "Arjun Mehta", "Sara Lindqvist", "Hassan Ali", "Mia Andersson", "Kenji Sato",
];

const PROJECT_DEFS: Array<{ name: string; description: string; companyId: string; techIds: string[] }> = [
  { name: "CloudBoard", description: "Real-time collaborative whiteboard for distributed teams.", companyId: "comp-3", techIds: ["react", "nextjs", "typescript", "nodejs"] },
  { name: "FinanceTracker", description: "Personal finance dashboard with budgeting insights.", companyId: "comp-2", techIds: ["react", "typescript", "postgresql", "nodejs"] },
  { name: "DataLens", description: "Analytics pipeline for streaming event data.", companyId: "comp-5", techIds: ["python", "aws", "docker", "kubernetes"] },
  { name: "StudentHub", description: "Learning management system for universities.", companyId: "comp-1", techIds: ["nextjs", "typescript", "postgresql", "graphql"] },
  { name: "MedRecord", description: "Electronic health records with audit trails.", companyId: "comp-7", techIds: ["dotnet", "postgresql", "docker", "aws"] },
  { name: "Streamly", description: "Video streaming platform with adaptive playback.", companyId: "comp-4", techIds: ["react", "nodejs", "mongodb", "aws"] },
  { name: "ShopSync", description: "Inventory and order sync for e-commerce.", companyId: "comp-6", techIds: ["nodejs", "mongodb", "docker", "kubernetes"] },
  { name: "CodePulse", description: "CI observability and build metrics.", companyId: "comp-3", techIds: ["python", "docker", "kubernetes", "aws"] },
  { name: "ChatNest", description: "Team messaging with threaded conversations.", companyId: "comp-1", techIds: ["react", "typescript", "nodejs", "graphql"] },
  { name: "LedgerLine", description: "Double-entry accounting engine for small banks.", companyId: "comp-2", techIds: ["dotnet", "postgresql", "typescript"] },
  { name: "VisionQA", description: "Computer-vision quality inspection service.", companyId: "comp-5", techIds: ["python", "docker", "aws", "kubernetes"] },
  { name: "PortfolioOS", description: "Investment portfolio tracker for advisors.", companyId: "comp-2", techIds: ["nextjs", "typescript", "postgresql"] },
  { name: "DocuFlow", description: "Document workflow automation.", companyId: "comp-6", techIds: ["dotnet", "mongodb", "nodejs"] },
  { name: "EventBridge", description: "Event bus for microservices choreography.", companyId: "comp-3", techIds: ["nodejs", "docker", "kubernetes", "aws"] },
  { name: "CarePlan", description: "Care coordination app for clinics.", companyId: "comp-7", techIds: ["react", "nextjs", "postgresql", "graphql"] },
  { name: "AdVerse", description: "Campaign management for ad agencies.", companyId: "comp-4", techIds: ["react", "typescript", "mongodb"] },
  { name: "SecureVault", description: "Secrets management for platform teams.", companyId: "comp-3", techIds: ["python", "docker", "kubernetes", "aws"] },
  { name: "LearnLoop", description: "Adaptive quiz engine for online courses.", companyId: "comp-1", techIds: ["nextjs", "typescript", "postgresql", "graphql"] },
];

const ROLES = ["Backend Developer", "Frontend Developer", "Full-stack Engineer", "Platform Engineer", "Data Engineer", "Mobile Developer"];
const LOCATIONS = ["Cairo", "Berlin", "Toronto", "Bengaluru", "Sao Paulo", "Tokyo", "London", "Lagos", "Stockholm", "Austin"];

interface DeveloperInput {
  id: string; name: string; bio: string; location: string;
  companyId: string; role: string; startYear: number; endYear: number | null;
  knowsTechIds: string[]; contributed: Array<{ projectId: string; role: string }>;
}

function buildDevelopers(): DeveloperInput[] {
  const projectContributors: Record<number, number[]> = {};
  PROJECT_DEFS.forEach((_, pIdx) => {
    const base = pIdx % DEVELOPER_NAMES.length;
    projectContributors[pIdx] = [
      base,
      (base + 5) % DEVELOPER_NAMES.length,
      (base + 11) % DEVELOPER_NAMES.length,
    ].filter((v, i, a) => a.indexOf(v) === i);
  });

  const devProjects: Record<number, Array<{ projectId: string; role: string }>> = {};
  PROJECT_DEFS.forEach((_, pIdx) => {
    projectContributors[pIdx].forEach((dIdx) => {
      (devProjects[dIdx] ??= []).push({
        projectId: `proj-${pIdx + 1}`,
        role: ROLES[dIdx % ROLES.length],
      });
    });
  });

  const devTechIds: Record<number, Set<string>> = {};
  Object.entries(devProjects).forEach(([dIdx, projects]) => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const def = PROJECT_DEFS[Number(p.projectId.split("-")[1]) - 1];
      def.techIds.forEach((t) => set.add(t));
    });
    devTechIds[Number(dIdx)] = set;
  });

  return DEVELOPER_NAMES.map((name, i) => {
    const company = COMPANIES[i % COMPANIES.length];
    const startYear = 2016 + (i % 8);
    const stillThere = i % 3 === 0;
    return {
      id: `dev-${i + 1}`, name,
      bio: `${name.split(" ")[0]} is a ${ROLES[i % ROLES.length].toLowerCase()} with experience across modern web stacks.`,
      location: LOCATIONS[i % LOCATIONS.length],
      companyId: company.id, role: ROLES[i % ROLES.length],
      startYear, endYear: stillThere ? null : startYear + 2 + (i % 4),
      knowsTechIds: Array.from(devTechIds[i] ?? []),
      contributed: devProjects[i] ?? [],
    };
  });
}

const DEVELOPERS = buildDevelopers();
const PROJECTS: ProjectInput[] = PROJECT_DEFS.map((p, i) => ({ id: `proj-${i + 1}`, ...p }));

async function seed() {
  const driver = getDriver();
  const session = driver.session({ defaultAccessMode: "WRITE" });

  try {
    console.log("Seeding technologies...");
    for (const t of TECHNOLOGIES) {
      await session.executeWrite((tx) =>
        tx.run(
          `MERGE (t:Technology {id: $id})
           SET t.name = $name, t.category = $category`,
          t
        )
      );
    }

    console.log("Seeding companies...");
    for (const c of COMPANIES) {
      await session.executeWrite((tx) =>
        tx.run(
          `MERGE (c:Company {id: $id})
           SET c.name = $name, c.industry = $industry`,
          c
        )
      );
    }

    console.log("Seeding projects...");
    for (const p of PROJECTS) {
      await session.executeWrite((tx) =>
        tx.run(
          `MERGE (p:Project {id: $id})
           SET p.name = $name, p.description = $description`,
          { id: p.id, name: p.name, description: p.description }
        )
      );
      await session.executeWrite((tx) =>
        tx.run(
          `MATCH (p:Project {id: $projectId})
           MATCH (c:Company {id: $companyId})
           MERGE (p)-[:OWNED_BY]->(c)`,
          { projectId: p.id, companyId: p.companyId }
        )
      );
      for (const techId of p.techIds) {
        await session.executeWrite((tx) =>
          tx.run(
            `MATCH (p:Project {id: $projectId})
             MATCH (t:Technology {id: $techId})
             MERGE (p)-[:USES]->(t)`,
            { projectId: p.id, techId }
          )
        );
      }
    }

    console.log("Seeding developers...");
    for (const d of DEVELOPERS) {
      await session.executeWrite((tx) =>
        tx.run(
          `MERGE (d:Developer {id: $id})
           SET d.name = $name, d.bio = $bio, d.location = $location`,
          { id: d.id, name: d.name, bio: d.bio, location: d.location }
        )
      );
      await session.executeWrite((tx) =>
        tx.run(
          `MATCH (d:Developer {id: $developerId})
           MATCH (c:Company {id: $companyId})
           MERGE (d)-[r:WORKED_AT]->(c)
           SET r.role = $role, r.startYear = $startYear, r.endYear = $endYear`,
          { developerId: d.id, companyId: d.companyId, role: d.role, startYear: d.startYear, endYear: d.endYear }
        )
      );
      for (const techId of d.knowsTechIds) {
        await session.executeWrite((tx) =>
          tx.run(
            `MATCH (d:Developer {id: $developerId})
             MATCH (t:Technology {id: $techId})
             MERGE (d)-[:KNOWS]->(t)`,
            { developerId: d.id, techId }
          )
        );
      }
      for (const contrib of d.contributed) {
        await session.executeWrite((tx) =>
          tx.run(
            `MATCH (d:Developer {id: $developerId})
             MATCH (p:Project {id: $projectId})
             MERGE (d)-[r:CONTRIBUTED_TO]->(p)
             SET r.role = $role`,
            { developerId: d.id, projectId: contrib.projectId, role: contrib.role }
          )
        );
      }
    }

    console.log("Seeding collaboration edges...");
    const seen = new Set<string>();
    for (const p of PROJECTS) {
      const contributors = DEVELOPERS.filter((d) => d.contributed.some((c) => c.projectId === p.id));
      for (let a = 0; a < contributors.length; a++) {
        for (let b = a + 1; b < contributors.length; b++) {
          const key = [contributors[a].id, contributors[b].id].sort().join("|");
          if (seen.has(key)) continue;
          seen.add(key);
          await session.executeWrite((tx) =>
            tx.run(
              `MATCH (a:Developer {id: $aId})
               MATCH (b:Developer {id: $bId})
               MERGE (a)-[:COLLABORATED_WITH]->(b)`,
              { aId: contributors[a].id, bId: contributors[b].id }
            )
          );
        }
      }
    }

    console.log("Seed complete.");
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

import { runRead } from "@/lib/db";
import type { CollaboratorSuggestion, Developer } from "@/types/graph";
import { nodeProps, toDeveloper } from "./helpers";

// Query 3 — potential collaborators (the showcase multi-hop traversal).
// A developer is a candidate collaborator when they contribute to a project
// that uses a technology the focal developer also uses via their projects.
export async function getPotentialCollaborators(
  id: string,
  limit = 10
): Promise<CollaboratorSuggestion[]> {
  return runRead(
    `MATCH (me:Developer {id: $developerId})-[:CONTRIBUTED_TO]->(myProject:Project)-[:USES]->(technology:Technology)
           <-[:USES]-(otherProject:Project)<-[:CONTRIBUTED_TO]-(other:Developer)
     WHERE other.id <> me.id
     RETURN other,
            collect(DISTINCT technology.name) AS sharedTechnologies,
            collect(DISTINCT otherProject.name) AS sharedProjects
     ORDER BY size(sharedTechnologies) DESC, size(sharedProjects) DESC
     LIMIT $limit`,
    { developerId: id, limit },
    (r) => ({
      developer: toDeveloper(nodeProps(r.get("other"))),
      sharedTechnologies: (r.get("sharedTechnologies") as string[] | null) ?? [],
      sharedProjects: (r.get("sharedProjects") as string[] | null) ?? [],
    })
  );
}

// Query 4 — multi-degree collaboration network (variable-depth traversal).
export async function getCollaborationNetwork(
  id: string,
  depth = 3,
  limit = 20
): Promise<Developer[]> {
  return runRead(
    `MATCH (me:Developer {id: $developerId})-[:COLLABORATED_WITH*1..${depth}]-(other:Developer)
     WHERE other.id <> me.id
     RETURN DISTINCT other
     ORDER BY other.name
     LIMIT $limit`,
    { developerId: id, limit },
    (r) => toDeveloper(nodeProps(r.get("other")))
  );
}

import { getProjectWithRelations } from "@/lib/queries";
import { handle, notFound } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handle(async () => {
    const project = await getProjectWithRelations(id);
    if (!project) return notFound("Project not found.");
    return project;
  });
}

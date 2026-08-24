import { getDeveloperWithRelations } from "@/lib/queries";
import { handle, notFound } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handle(async () => {
    const developer = await getDeveloperWithRelations(id);
    if (!developer) return notFound("Developer not found.");
    return developer;
  });
}

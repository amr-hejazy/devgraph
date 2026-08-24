import { getTechnologyWithRelations } from "@/lib/queries";
import { handle, notFound } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handle(async () => {
    const technology = await getTechnologyWithRelations(id);
    if (!technology) return notFound("Technology not found.");
    return technology;
  });
}

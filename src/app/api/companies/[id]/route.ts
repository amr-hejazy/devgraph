import { getCompanyWithRelations } from "@/lib/queries";
import { handle, notFound } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handle(async () => {
    const company = await getCompanyWithRelations(id);
    if (!company) return notFound("Company not found.");
    return company;
  });
}

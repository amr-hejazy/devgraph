import { listTechnologies } from "@/lib/queries";
import { handle, badRequest } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    const { searchParams } = new URL(req.url);
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Number(limitRaw) : 200;
    if (!Number.isFinite(limit) || limit < 1) return badRequest("Invalid limit.");
    return await listTechnologies(limit);
  });
}

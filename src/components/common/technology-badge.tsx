import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TechnologyBadge({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <Link href={`/technologies/${id}`}>
      <Badge
        variant="secondary"
        className="rounded-full px-2.5 py-0.5 font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {name}
      </Badge>
    </Link>
  );
}

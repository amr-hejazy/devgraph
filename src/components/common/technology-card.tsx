import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Technology } from "@/types/graph";

export function TechnologyCard({ technology }: { technology: Technology }) {
  return (
    <Link href={"/technologies/" + technology.id} className="block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <p className="font-medium">{technology.name}</p>
          <Badge variant="outline" className="shrink-0 text-xs">
            {technology.category}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

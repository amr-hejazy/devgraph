import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TechnologyBadge } from "./technology-badge";
import type { Developer, Technology } from "@/types/graph";

export function DeveloperCard({
  developer,
  technologies,
}: {
  developer: Developer;
  technologies?: Technology[];
}) {
  return (
    <Link href={`/developers/${developer.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="space-y-3 p-5">
          <div>
            <p className="font-medium">{developer.name}</p>
            {developer.location ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {developer.location}
              </p>
            ) : null}
          </div>
          {technologies && technologies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((t) => (
                <TechnologyBadge key={t.id} id={t.id} name={t.name} />
              ))}
              {technologies.length > 5 ? (
                <span className="text-xs text-muted-foreground">
                  +{technologies.length - 5} more
                </span>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

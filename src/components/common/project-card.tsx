import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/types/graph";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="space-y-2 p-5">
          <p className="font-medium">{project.name}</p>
          {project.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

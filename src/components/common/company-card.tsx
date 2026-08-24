import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Company } from "@/types/graph";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="space-y-1 p-5">
          <p className="font-medium">{company.name}</p>
          {company.industry ? (
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

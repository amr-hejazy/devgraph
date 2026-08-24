"use client";

import { CompanyCard } from "@/components/common/company-card";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { EmptyState } from "@/components/common/empty-state";
import { useApi } from "@/components/common/use-api";
import type { Company } from "@/types/graph";

export default function CompaniesPage() {
  const { data, loading, error } = useApi<Company[]>("/api/companies?limit=200");

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Organizations building across the network."
      />
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <CardGridSkeleton count={7} />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No companies found" description="The graph database returned no companies." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}

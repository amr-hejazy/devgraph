import { Suspense } from "react";
import SearchResults from "./search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <Suspense>
      <SearchResults initialQuery={q ?? ""} />
    </Suspense>
  );
}

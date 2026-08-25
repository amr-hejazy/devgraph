"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Network, Search } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";

const NAV = [
  { href: "/developers", label: "Developers" },
  { href: "/projects", label: "Projects" },
  { href: "/technologies", label: "Technologies" },
  { href: "/companies", label: "Companies" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");

  // Hide the global search on pages that render their own search input.
  const hideSearch = pathname === "/" || pathname === "/search";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Network className="size-5 text-primary" />
          DevGraph
        </Link>
        {!hideSearch && (
          <form onSubmit={submit} className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search developers, projects, technologies..."
              className="pl-8"
              aria-label="Global search"
            />
          </form>
        )}
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

import { toNumber } from "@/lib/db";
import type {
  Company,
  Developer,
  Project,
  Technology,
} from "@/types/graph";

// Helpers that coerce raw Neo4j node properties into typed, plain objects.
// Neo4j Integer values (e.g. years) are converted to native numbers here so
// the React UI never receives Integer objects.

type Props = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  return v === null || v === undefined ? fallback : String(v);
}

export function toDeveloper(props: Props): Developer {
  return {
    id: str(props.id),
    name: str(props.name),
    bio: str(props.bio),
    location: str(props.location),
  };
}

export function toTechnology(props: Props): Technology {
  return {
    id: str(props.id),
    name: str(props.name),
    category: str(props.category),
  };
}

export function toProject(props: Props): Project {
  return {
    id: str(props.id),
    name: str(props.name),
    description: str(props.description),
  };
}

export function toCompany(props: Props): Company {
  return {
    id: str(props.id),
    name: str(props.name),
    industry: str(props.industry),
  };
}

export function nodeProps(value: unknown): Props {
  const node = value as { properties?: Props } | undefined;
  return node?.properties ?? {};
}

export function toInt(v: unknown): number | null {
  return toNumber(v);
}

import neo4j, {
  Driver,
  QueryResult,
  Session,
} from "neo4j-driver";

import { DatabaseUnavailableError } from "../types/graph";

let driver: Driver | null = null;

function buildDriver(): Driver {
  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !username || !password) {
    throw new DatabaseUnavailableError(
      "Missing CognoDB environment variables (COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD)."
    );
  }

  return neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 10,
    connectionTimeout: 5000,
  });
}

// Single shared driver instance. Never create a new driver per request.
export function getDriver(): Driver {
  if (!driver) {
    driver = buildDriver();
  }
  return driver;
}

export function isConfigured(): boolean {
  return Boolean(
    process.env.COGNODB_URI &&
      process.env.COGNODB_USERNAME &&
      process.env.COGNODB_PASSWORD
  );
}

// Convert a possibly-Neo4j-Integer value into a native number when safe.
export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  const maybeInt = value as { toNumber?: () => number };
  if (typeof maybeInt.toNumber === "function") {
    return maybeInt.toNumber();
  }
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function normalizeError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code ?? "";

  if (
    code === "ServiceUnavailable" ||
    code === "SessionExpired" ||
    /ECONNREFUSED|ENOTFOUND|getaddrinfo|timeout|bolt|connection/i.test(message)
  ) {
    return new DatabaseUnavailableError();
  }
  return error instanceof Error ? error : new Error(message);
}

// Run a Cypher read query with parameters and map each record.
// Always closes the session in `finally`. Rethrows a normalized error so the
// API layer can translate it into a safe, user-facing response.
export async function runRead<T>(
  cypher: string,
  params: Record<string, unknown> = {},
  map: (record: QueryResult["records"][number]) => T
): Promise<T[]> {
  const session: Session = getDriver().session();
  try {
    const result = await session.executeRead((tx) => tx.run(cypher, params));
    return result.records.map(map);
  } catch (error) {
    throw normalizeError(error);
  } finally {
    await session.close();
  }
}

export { neo4j };

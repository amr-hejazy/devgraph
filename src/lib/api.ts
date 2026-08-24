import { DatabaseUnavailableError } from "@/types/graph";

// Thin helpers so route handlers stay one-liners and DB failures never leak
// internal messages or credentials to the client.

export function ok(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function notFound(message = "The requested resource could not be found."): Response {
  return Response.json({ error: message }, { status: 404 });
}

export function badRequest(message = "Invalid request."): Response {
  return Response.json({ error: message }, { status: 400 });
}

// Wrap a route handler body. If it returns a Response (e.g. notFound), pass it
// through untouched; otherwise serialize the data. Database connection/query
// failures are normalized to a safe 503 with a user-friendly message.
export async function handle(handler: () => Promise<unknown>): Promise<Response> {
  try {
    const result = await handler();
    if (result instanceof Response) return result;
    return Response.json(result);
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return Response.json(
        { error: "The graph database is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }
    return Response.json(
      { error: "Something went wrong while loading data." },
      { status: 500 }
    );
  }
}

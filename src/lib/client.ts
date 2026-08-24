// Client-side fetch helper. Pages are client components that talk to the
// Next.js API layer; they never import the database/query layer directly.

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: "application/json" } });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse failure, keep default message
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

// SWR fetcher: takes a URL key and returns parsed JSON, reusing getJson's
// error handling (throws a readable message on non-2xx responses).
export const fetcher = (url: string) => getJson(url);

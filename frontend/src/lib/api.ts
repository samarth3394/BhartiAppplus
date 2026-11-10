/**
 * Resolves backend API URLs across all environments:
 * - Server-side (Next.js server components / functions): uses the Vercel Service Binding
 *   env var `BACKEND_INTERNAL_URL` via `new URL(...)`, or `NEXT_PUBLIC_API_URL`, with local fallback.
 * - Client-side (browser): returns a relative path (`/api/...`) so same-origin requests route
 *   through the top-level Vercel rewrite (`vercel.json`) to the `app` FastAPI service.
 */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window === "undefined") {
    const internalBase =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:5000";
    return new URL(normalizedPath, internalBase).toString();
  }

  const publicBase = process.env.NEXT_PUBLIC_API_URL || "";
  return `${publicBase}${normalizedPath}`;
}


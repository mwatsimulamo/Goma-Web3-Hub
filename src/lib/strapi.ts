const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

type StrapiAuthOptions = {
  token?: string | null;
};

function normalizePath(path: string) {
  if (path.startsWith("/")) return `${STRAPI_URL}${path}`;
  return `${STRAPI_URL}/${path}`;
}

export async function strapiFetch<T = unknown>(
  path: string,
  options: RequestInit & StrapiAuthOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(normalizePath(path), {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi request failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

export function getJwtFromStorage() {
  return localStorage.getItem("strapi_jwt");
}

export function setJwtToStorage(token: string) {
  localStorage.setItem("strapi_jwt", token);
}

export function clearJwtFromStorage() {
  localStorage.removeItem("strapi_jwt");
}

type StrapiUrlAttributes = { url?: string };
type StrapiMediaData = { attributes?: StrapiUrlAttributes };
type StrapiMediaLike = {
  url?: string;
  attributes?: StrapiUrlAttributes;
  data?: StrapiMediaData | StrapiMediaData[];
};

export function mediaToUrl(media: unknown): string | null {
  // Strapi REST media format commonly:
  // - single media: { data: { attributes: { url } } }
  // - array media: { data: [{ attributes: { url } }, ...] }
  // - sometimes already-populated url string
  if (!media) return null;

  if (typeof media === "string") {
    return media.startsWith("http") ? media : `${STRAPI_URL}${media}`;
  }

  const m = media as StrapiMediaLike;
  const url =
    m.url ||
    m.attributes?.url ||
    (Array.isArray(m.data) ? m.data[0]?.attributes?.url : m.data?.attributes?.url);
  if (!url) return null;

  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

export function mediaArrayToUrls(media: unknown): string[] {
  if (!media) return [];
  if (Array.isArray(media)) {
    return media
      .map((m) => mediaToUrl(m))
      .filter((u): u is string => typeof u === "string");
  }

  const m = media as StrapiMediaLike;
  const arr = m.data;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((d) => mediaToUrl({ data: d } as unknown))
    .filter((u): u is string => typeof u === "string");
}


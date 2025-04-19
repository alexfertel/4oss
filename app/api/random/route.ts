import { list } from "@vercel/blob";

const BATCH_SIZE = 100;

type Variant = "desktop" | "mobile";

const PREFIX: Record<Variant, string> = {
  desktop: "desktop/",
  mobile: "mobile/",
};

type CacheMap = Record<Variant, string[]>;
type CursorMap = Partial<Record<Variant, string | undefined>>;

const cache: CacheMap = { desktop: [], mobile: [] };
const cursor: CursorMap = { desktop: undefined, mobile: undefined };

/** In‑place Fisher‑Yates shuffle. */
function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Ensures the cache for `variant` contains at least one URL,
 * fetching additional pages as necessary.
 */
async function fillCache(variant: Variant): Promise<void> {
  while (cache[variant].length === 0) {
    const { blobs, cursor: next } = await list({
      limit: BATCH_SIZE,
      prefix: PREFIX[variant],
      cursor: cursor[variant],
    });

    cursor[variant] = next; // undefined when no further pages exist

    if (blobs.length) {
      const urls = blobs.map((b) => b.url); // pathname + url fields confirmed in SDK response :contentReference[oaicite:0]{index=0}
      shuffle(urls);
      cache[variant].push(...urls);
    }

    // If we fetched an empty page and there’s nothing left, stop looping
    if (!next) break;
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const variant: Variant =
    searchParams.get("variant") === "mobile" ? "mobile" : "desktop";

  if (cache[variant].length === 0) {
    await fillCache(variant);
    if (cache[variant].length === 0) {
      return new Response("No screenshots found for this variant", {
        status: 404,
      });
    }
  }

  const url = cache[variant].pop() as string; // safe: cache has ≥1 item
  return Response.redirect(url, 302);
}

export const runtime = "edge";

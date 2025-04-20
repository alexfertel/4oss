import { list } from "@vercel/blob";
import type { Project, ProjectInfo } from "../../../lib/types";
import { projects } from "../../data/projects";

export const runtime = "edge";

/* ------------------------------------------------------------------ */
/*  Project map.                                                      */
/* ------------------------------------------------------------------ */
const bannedProjects = new Set([
  "wannabet-cc",
  "zkpod.ai",
  "0xhoneyjar",
  "bridgers.xyz",
  "https://x.com
]);

const PROJECT_MAP: Record<string, ProjectInfo> = (() => {
  const map: Record<string, ProjectInfo> = {};

  (projects as Project[])
    .filter((p) => !bannedProjects.has(p.name))
    .filter((p) => p.websites?.length)
    .filter((p) => !p.description?.includes("Discontinued"))
    .forEach((p) => {
      const url = p.websites![0].url!;
      const safe = url.replace(/^https?:\/\//, "").replace("/", "_");
      map[safe] = { id: p.name, title: p.display_name, url };
    });

  return map;
})();

/* ------------------------------------------------------------------ */
/*  Load **all** blobs once per variant.                              */
/* ------------------------------------------------------------------ */
type Variant = "desktop" | "mobile";

const PREFIX: Record<Variant, string> = {
  desktop: "desktop/",
  mobile: "mobile/",
};

const PAGE_LIMIT = 1000; // Bigger => fewer round‑trips.

// In‑memory bags of URLs per variant. We *pop* from these until empty.
const bags: Record<Variant, string[]> = { desktop: [], mobile: [] };

// A single module‑level promise per variant so concurrent cold‑starts
// share the same list‑everything storm.
const BAG_PROMISE: Record<Variant, Promise<void>> = {
  desktop: loadAll("desktop"),
  mobile: loadAll("mobile"),
};

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Crawl **all** pages for one variant and fill `bags[variant]`. */
async function loadAll(variant: Variant): Promise<void> {
  let cursor: string | undefined;
  const urls: string[] = [];

  do {
    const { blobs, cursor: next } = await list({
      limit: PAGE_LIMIT,
      prefix: PREFIX[variant],
      cursor,
    });
    urls.push(...blobs.map((b) => b.url));
    cursor = next ?? undefined;
  } while (cursor);

  shuffle(urls);
  bags[variant] = urls;
  console.log(`[${variant}] loaded ${urls.length} blobs`);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function slugFromBlob(url: string): string {
  return new URL(url).pathname // /desktop/acme‑tool.avif
    .replace(/^\/?[^/]+\/+/, "") // acme‑tool.avif
    .replace(/\.[^.]+$/, ""); // acme‑tool
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const variant: Variant =
    searchParams.get("variant") === "mobile" ? "mobile" : "desktop";

  /* 1. Ensure the big list is loaded (cold‑start). */
  await BAG_PROMISE[variant];

  /* 2. Pop one URL; reshuffle when bag is empty.   */
  if (bags[variant].length === 0) {
    shuffle(bags[variant]); // Re‑mix the exhausted bag.
  }
  const blobUrl = bags[variant].pop()!; // Guaranteed by initial load.

  /* 3. Map to project.                             */
  const project = PROJECT_MAP[slugFromBlob(blobUrl)] ?? null;

  return Response.json({ variant, blobUrl, project }, { status: 200 });
}

import { list } from "@vercel/blob";
import type { Project, ProjectInfo } from "../../../lib/types";
import { projects } from "../../data/projects";

export const runtime = "edge";

/* ------------------------------------------------------------------ */
/*  1. Load & cache projects *once*                                   */
/* ------------------------------------------------------------------ */
const bannedProjects = [
  "wannabet-cc",
  "zkpod.ai",
  "0xhoneyjar",
  "bridgers.xyz",
];

async function loadProjects(): Promise<Record<string, ProjectInfo>> {
  const rawProjects = projects as Project[];
  const map: Record<string, ProjectInfo> = {};

  rawProjects
    .filter((p) => !bannedProjects.includes(p.name))
    .filter((p) => p.websites?.length)
    .filter((p) => !p.description?.includes("Discontinued"))
    .forEach((p) => {
      const url = p.websites![0].url!;
      const safe = url.replace(/^https?:\/\//, "").replace("/", "_");
      map[safe] = { id: p.name, title: p.display_name, url };
    });

  return map;
}

const PROJECTS_PROMISE = loadProjects();

/* ------------------------------------------------------------------ */
/*  2. Screenshot blob pagination + cache                             */
/* ------------------------------------------------------------------ */
type Variant = "desktop" | "mobile";

const PREFIX: Record<Variant, string> = {
  desktop: "desktop/",
  mobile: "mobile/",
};

const BATCH_SIZE = 100;

type CacheMap = Record<Variant, string[]>;
type CursorMap = Partial<Record<Variant, string | null>>; // `null` ⇒ exhausted

const cache: CacheMap = { desktop: [], mobile: [] };
const cursor: CursorMap = { desktop: undefined, mobile: undefined };
const inflight: Partial<Record<Variant, Promise<void>>> = {};

/* ---------- Utils -------------------------------------------------- */
function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Try to fetch *one* additional page for the given variant.
 * If nothing new was fetched or the cursor is exhausted we simply return.
 * After every successful fetch the whole cache is reshuffled.
 */
async function fetchNextBatch(variant: Variant): Promise<void> {
  // Cursor === null  → we already fetched every page
  if (cursor[variant] === null) return;
  if (inflight[variant]) return inflight[variant]; // already running

  const p = list({
    limit: BATCH_SIZE,
    prefix: PREFIX[variant],
    // We know it's no longer null, so we can cast it.
    cursor: cursor[variant] as string | undefined,
  })
    .then((response) => {
      // When `response.cursor` is undefined, save `null` to mark exhaustion.
      cursor[variant] = response.cursor ?? null;

      if (response.blobs.length > 0) {
        cache[variant].push(...response.blobs.map((b) => b.url));
        shuffle(cache[variant]); // <— global reshuffle
      }
    })
    .finally(() => {
      inflight[variant] = undefined;
    });

  inflight[variant] = p;
  return p;
}

/* ------------------------------------------------------------------ */
/*  3. Helper: derive project‑slug from blob URL                      */
/* ------------------------------------------------------------------ */
function slugFromBlob(url: string): string {
  return new URL(url).pathname // /desktop/acme‑tool.avif
    .replace(/^\/?[^/]+\/+/, "") // acme‑tool.avif
    .replace(/\.[^.]+$/, ""); // acme‑tool
}

/* ------------------------------------------------------------------ */
/*  4. Route handler                                                  */
/* ------------------------------------------------------------------ */
const MAX_ATTEMPTS = 5;

export async function GET(
  request: Request,
  ctx: { waitUntil?: (p: Promise<any>) => void } = {},
): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const variant: Variant =
    searchParams.get("variant") === "mobile" ? "mobile" : "desktop";

  const projectMap = await PROJECTS_PROMISE;

  /* --------------------------------------------------------------
   * Pop immediately, but schedule another fetch in the background.
   * -------------------------------------------------------------- */
  if (cache[variant].length === 0) {
    // Need something to serve → block until we have at least one.
    await fetchNextBatch(variant);
  }

  let blobUrl: string | undefined;
  let project: ProjectInfo | undefined;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    if (cache[variant].length === 0) {
      // Maybe the first fetch returned zero items — try one last time.
      await fetchNextBatch(variant);
      if (cache[variant].length === 0) break;
    }

    blobUrl = cache[variant].pop()!;
    project = projectMap[slugFromBlob(blobUrl)];
    if (project) break;
    attempts++;
  }

  /* ------------------------------------
   * Background pre‑fetch (non‑blocking)
   * ------------------------------------ */
  if (cursor[variant] !== null) {
    // Fire & forget; keep the function alive with waitUntil if available.
    const prefetch = fetchNextBatch(variant);
    ctx.waitUntil?.(prefetch);
  }
  console.log("cache size:", cache[variant].length);

  return Response.json(
    { variant, blobUrl: blobUrl ?? null, project: project ?? null },
    { status: 200 },
  );
}

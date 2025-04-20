import { list } from "@vercel/blob";
import type { Project, ProjectInfo } from "../../../lib/types";
import { projects } from "../../data/projects";

export const runtime = "edge";

/* ------------------------------------------------------------------ */
/*  1. Load & cache projects *once*                                   */
/* ------------------------------------------------------------------ */
// These are either broken or redirect to other things.
const bannedProjects = ["wannabet-cc", "zkpod.ai", "0xhoneyjar"];

async function loadProjects(): Promise<Record<string, ProjectInfo>> {
  const rawProjects = projects as Project[];
  const map: Record<string, ProjectInfo> = {};

  rawProjects
    .filter((p) => !bannedProjects.includes(p.name))
    .filter((p) => p.websites?.length)
    .filter((p) => !p.description?.includes("Discontinued"))
    .forEach((p) => {
      const url = p.websites![0].url!;
      const safe = url
        .replace("https://", "")
        .replace("http://", "")
        .replace("/", "_");
      map[safe] = {
        id: p.name,
        title: p.display_name,
        url,
      };
    });

  return map;
}

const PROJECTS_PROMISE = loadProjects(); // Fire‑and‑forget at module load.

/* ------------------------------------------------------------------ */
/*  2. Screenshot blob pagination + cache                             */
/* ------------------------------------------------------------------ */
type Variant = "desktop" | "mobile";

const PREFIX: Record<Variant, string> = {
  desktop: "desktop/",
  mobile: "mobile/",
};

const BATCH_SIZE = 10;

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

/** Fills the blob cache (paged) until at least one URL is present. */
async function fillCache(variant: Variant): Promise<void> {
  while (cache[variant].length === 0) {
    const { blobs, cursor: next } = await list({
      limit: BATCH_SIZE,
      prefix: PREFIX[variant],
      cursor: cursor[variant],
    });

    cursor[variant] = next; // undefined when no more pages

    if (blobs.length > 0) {
      const urls = blobs.map((b) => b.url);
      shuffle(urls);
      cache[variant].push(...urls);
    }

    if (!next) break; // exhausted pages
  }
}

/* ------------------------------------------------------------------ */
/*  3. Helper: derive project‑slug from blob URL                      */
/* ------------------------------------------------------------------ */
function slugFromBlob(url: string): string {
  // https://<dom>/desktop/acme‑tool.avif → acme‑tool
  const pathname = new URL(url).pathname; // /desktop/acme‑tool.avif
  const withNoPrefix = pathname?.replace(/^\/?[^/]+\/+/, "") ?? ""; // acme‑tool.avif
  return withNoPrefix?.replace(/\.[^.]+$/, "") ?? ""; // acme‑tool
}

/* ------------------------------------------------------------------ */
/*  4. Route handler                                                  */
/* ------------------------------------------------------------------ */
const MAX_ATTEMPTS = 5; // arbitrary but sane upper bound

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const variant: Variant =
    searchParams.get("variant") === "mobile" ? "mobile" : "desktop";

  const projectMap = await PROJECTS_PROMISE;

  let blobUrl: string | undefined;
  let project: ProjectInfo | undefined;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    // Make sure the cache isn't empty before we pop.
    if (cache[variant].length === 0) {
      await fillCache(variant);
      if (cache[variant].length === 0) break; // nothing left to try
    }

    blobUrl = cache[variant].pop()!;
    const slug = slugFromBlob(blobUrl);
    project = projectMap[slug];

    if (project) break; // success!
    attempts++;
  }

  // If we still failed to match, respond exactly as before.
  if (!project) {
    return Response.json(
      { variant, blobUrl: blobUrl ?? null, project: null },
      { status: 200 },
    );
  }

  return Response.json({ variant, blobUrl, project }, { status: 200 });
}

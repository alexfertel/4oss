import { list } from "@vercel/blob";
import type { DeviceType, RawProject, ProjectInfo, Project } from "./types";
import { projects } from "../app/data/projects";

/* ------------------------------------------------------------------ */
/*  Project map.                                                      */
/* ------------------------------------------------------------------ */
const banned = [
  "wannabet-cc",
  "zkpod.ai",
  "0xhoneyjar",
  "bridgers.xyz",
  "https://x.com",
  "premia.blue",
  "micro3.io",
  "dappradar.com",
  "besmetaverse",
  "lumosdao",
  "spreadsheet",
  "t.me_",
  "colledge.social",
  "volume.li",
  "moonbase.app",
  "nftearth.exchange",
  "ezkalibur",
  "signupeoseos.com",
  "degen.game",
  "ipfs-search.com",
  "alps.finance",
  "primordiumdao.xyz",
];

const PROJECT_MAP: Record<string, ProjectInfo> = (() => {
  const map: Record<string, ProjectInfo> = {};

  (projects as RawProject[])
    .filter((p) => (p.websites?.length ?? 0) > 0)
    .filter((p) => !banned.some((bp) => bp.includes(p.name)))
    .filter((p) => !banned.some((bp) => bp.includes(p.websites![0].url!)))
    .filter((p) => !p.description?.includes("Discontinued"))
    .forEach((p) => {
      const url = p.websites![0].url!;
      const safe = url.replace(/^https?:\/\//, "").replace("/", "_");
      map[safe] = { id: p.name, title: p.display_name, url };
    });

  return map;
})();

/* ------------------------------------------------------------------ */
/*  Load **all** blobs once per deviceType.                           */
/* ------------------------------------------------------------------ */
const PREFIX: Record<DeviceType, string> = {
  desktop: "desktop/",
  mobile: "mobile/",
};

const PAGE_LIMIT = 1000; // Bigger => fewer round‑trips.

// In‑memory bags of URLs per deviceType. We *pop* from these until empty.
const bags: Record<DeviceType, string[]> = { desktop: [], mobile: [] };

// A single module‑level promise per deviceType so concurrent cold‑starts
// share the same list‑everything storm.
const BAG_PROMISE: Record<DeviceType, Promise<void>> = {
  desktop: loadAll("desktop"),
  mobile: loadAll("mobile"),
};

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* Crawl **all** pages for one deviceType and fill `bags[deviceType]`. */
async function loadAll(deviceType: DeviceType): Promise<void> {
  let cursor: string | undefined;
  const urls: string[] = [];

  do {
    const { blobs, cursor: next } = await list({
      limit: PAGE_LIMIT,
      prefix: PREFIX[deviceType],
      cursor,
    });
    urls.push(...blobs.map((b) => b.url));
    cursor = next ?? undefined;
  } while (cursor);

  shuffle(urls);
  bags[deviceType] = urls;
  console.log(`[${deviceType}] loaded ${urls.length} blobs`);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function slugFromBlob(url: string): string {
  return (
    new URL(url).pathname // /desktop/acme‑tool.avif
      .replace(/^\/?[^/]+\/+/, "") // acme‑tool.avif
      .replace(/\.[^.]+$/, "") // acme‑tool
      // Remove `-mobile` suffix if present. This was added by us, so it's won't
      // appear in projects loaded from the json file.
      .replace("-mobile", "")
  );
}

export async function fetchRandomScreenshot(
  deviceType: DeviceType,
): Promise<Project> {
  /* Ensure the big list is loaded (cold‑start). */
  await BAG_PROMISE[deviceType];

  /* Try up to 10 times (reshuffling if bag empties) until we get a non-null `info`. */
  let project: Project;
  for (let attempt = 0; attempt < 10; attempt++) {
    if (bags[deviceType].length === 0) {
      shuffle(bags[deviceType]);
    }
    const blobUrl = bags[deviceType].pop()!; // Should always exist after loadAll.
    const info = PROJECT_MAP[slugFromBlob(blobUrl)] ?? null;
    project = { src: blobUrl, info };

    if (info !== null) {
      return project;
    }
    // Otherwise loop around and try again.
  }

  // After 10 failed attempts, return whatever we ended up with.
  return project!;
}

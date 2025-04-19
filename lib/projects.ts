import { Project, fetchData } from "oss-directory";
import hmacSha256 from "crypto-js/hmac-sha256";

import { ProjectInfo } from "./types";

const bannedProjects = [
  "wannabet-cc", // Client-side error.
  "zkpod.ai", // Blank screen.
];

export async function getProjects(
  deviceType: "mobile" | "desktop",
): Promise<ProjectInfo[]> {
  const data = await fetchData();
  const rawProjects: Project[] = data.projects;
  const notBannedProjects = rawProjects.filter(
    (p) => !bannedProjects.includes(p.name),
  );
  const filteredProjects = notBannedProjects.filter(
    (p) => Boolean(p.websites) && (p.websites?.length ?? 0) > 0,
  );
  const activeProjects = filteredProjects.filter(
    (p) => !p.description?.includes("Discontinued"),
  );

  const projects = activeProjects;
  const shuffledProjects = shuffle(projects, projects.length);

  // console.log(JSON.stringify(shuffledProjects, null, 2));

  const projectInfos = shuffledProjects.map((p) => {
    const url = p.websites?.[0].url!;
    const params = new URLSearchParams();
    params.set("url", url);
    params.set("block_ads", "true");
    params.set("hide_cookie_banners", "true");
    params.set("wait_until", "mostrequestsfinished");
    params.set("fail_on_4xx", "true");
    params.set("fail_on_5xx", "true");

    if (deviceType == "mobile") {
      params.set("width", "390");
      params.set("height", "844");
      params.set("thumb_width", "200");
    }

    const secretKey = process.env.URLBOX_SECRET_KEY!;
    const token = hmacSha256(params.toString(), secretKey).toString();
    const urlbox = buildUrlboxUrl(token, params.toString());
    return {
      id: p.name,
      title: p.display_name,
      url: url,
      urlbox: urlbox,
    };
  });

  return [];
}

function shuffle(array: Project[], k: number): Project[] {
  // Make a shallow copy of the array so the original is not modified
  const sample = [...array];

  // Ensure k is between 0 and the sample length.
  const n = Math.max(Math.min(k, sample.length), 0);

  // Perform an in-place shuffle on the first n elements using Fisher–Yates.
  for (let index = 0; index < n; index++) {
    const randomIndex =
      index + Math.floor(Math.random() * (sample.length - index));
    // Swap elements at index and randomIndex
    [sample[index], sample[randomIndex]] = [sample[randomIndex], sample[index]];
  }

  // Return the first n elements of the shuffled array.
  return sample.slice(0, n);
}

function buildUrlboxUrl(token: string, params: string): string {
  const public_key = process.env.URLBOX_PUBLIC_KEY!;
  return `https://api.urlbox.com/v1/${public_key}/${token}/avif?${params}`;
}

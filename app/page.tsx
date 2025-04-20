import { Projects } from "./components/projects";
import { getDeviceType } from "lib/user-agent";

/**
 * Next.js’ built‑in fetch polyfill needs an absolute URL on the server,
 * so we derive one that works both locally and on Vercel.
 */
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // Filled automatically on Vercel.
    return `https://${process.env.VERCEL_URL}`;
  }
  // Dev / `next dev`
  return "http://localhost:3000";
}

export default async function Page() {
  const deviceType = await getDeviceType();
  let initialProject = null;
  const res = await fetch(
    `${getBaseUrl()}/api/random?deviceType=${deviceType}`,
    { cache: "no-store" },
  );

  if (res.ok) {
    const { project } = await res.json();
    initialProject = project;
  }

  return (
    <section className="flex flex-col min-w-0 px-2 md:px-0 min-h-[calc(100dvh-40px)] items-center justify-center">
      <Projects deviceType={deviceType} initialProject={initialProject} />
    </section>
  );
}

import { fetchRandomScreenshot } from "lib/random-screenshot";
import { Projects } from "./components/projects";
import { getDeviceType } from "lib/user-agent";

export default async function Page() {
  const deviceType = await getDeviceType();
  const initialProject = await fetchRandomScreenshot(deviceType);

  return (
    <section className="flex flex-col min-w-0 px-2 md:px-0 min-h-[calc(100dvh-40px)] items-center justify-center">
      <Projects deviceType={deviceType} initialProject={initialProject} />
    </section>
  );
}

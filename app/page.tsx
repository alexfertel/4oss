import { getProjects } from "lib/projects";
import { Projects } from "./components/projects";
import { getDeviceType } from "lib/user-agent";

export default async function Page() {
  const deviceType = await getDeviceType();
  const projects = [];
  // const projects = await getProjects(deviceType);
  return (
    <section className="flex flex-col min-w-0 px-2 md:px-0 min-h-[calc(100dvh-28px)] items-center justify-center">
      <Projects projects={projects} />
    </section>
  )
}

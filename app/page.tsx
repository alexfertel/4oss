import { getProjects } from "lib/projects";
import { Projects } from "./components/projects";

export default async function Page() {
  const projects = await getProjects();
  return (
    <section className="flex flex-col max-w-xl mx-4 lg:mx-auto min-w-0 px-2 md:px-0 min-h-[calc(100dvh-28px)] items-center justify-center">
      <Projects projects={projects} />
    </section>
  )
}

"use client";
import * as React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import { GalaxyIcon } from "./icons";
import { DeviceType, Project } from "lib/types";

interface ProjectsProps {
  deviceType: DeviceType;
  initialProject?: Project | null;
}

export async function fetchRandomScreenshot(
  deviceType: DeviceType,
): Promise<Project> {
  const res = await fetch(`/api/random?variant=${deviceType}`, {
    redirect: "follow", // Follow the 302 from the Edge function.
    cache: "no-store", // Force a fresh request every click.
  });
  const { project } = await res.json();

  return project;
}

export function Projects({ deviceType, initialProject = null }: ProjectsProps) {
  const [project, setProject] = React.useState<Project | null>(initialProject);
  const [loading, toggleLoading] = React.useReducer((prev) => !prev, false);

  React.useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  const loadNext = async () => {
    toggleLoading();
    try {
      const project = await fetchRandomScreenshot(deviceType);
      setProject(project);
    } catch (err) {
      console.error("Failed to load random screenshot:", err);
    } finally {
      toggleLoading();
    }
  };

  return (
    <div className="text-zinc-100">
      {/* Screenshot Container */}
      {project !== null && (
        <GlassmorphismCard className="bg-transparent">
          <a
            href={project.info?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 flex justify-center items-center"
          >
            <img
              src={project.src}
              alt={project.info?.title ?? "Random website screenshot"}
              width={800}
              height={600}
              className="max-w-full h-auto"
            />
          </a>
        </GlassmorphismCard>
      )}

      {/* Button */}
      <div className="flex justify-center items-center">
        <GlassmorphismButton
          onClick={loadNext}
          loading={loading}
          icon={<GalaxyIcon loading={loading} className="w-8 h-8 mr-2" />}
          className="mt-16"
        />
      </div>
    </div>
  );
}

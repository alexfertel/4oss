"use client";
import * as React from "react";

import { Card } from "./card";
import { GalaxyIcon } from "./icons";
import { DeviceType, Project } from "lib/types";

interface ProjectsProps {
  deviceType: DeviceType;
  initialProject?: Project | null;
}

export async function fetchRandomScreenshot(
  deviceType: DeviceType,
): Promise<Project> {
  const res = await fetch(`/api/random?deviceType=${deviceType}`, {
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

  const width = deviceType === "desktop" ? 600 : 300;
  const height = deviceType === "desktop" ? 400 : 700;
  if (project === null && initialProject === null) {
    return (
      <div
        className={`sm:p-4 flex items-center justify-center w-[${width}px] h-[${height}px]`}
      >
        <span>Loading website…</span>
      </div>
    );
  }

  const viewableProject = project ?? initialProject!;

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
    <React.Fragment>
      {/* Screenshot Container */}
      {viewableProject !== null && (
        <Card className="bg-transparent">
          <a
            href={viewableProject.info?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:p-4 flex justify-center items-center group"
          >
            <img
              src={viewableProject.src}
              alt={viewableProject.info?.title ?? "Random website screenshot"}
              width={width}
              height={height}
              className="max-w-full h-auto transition duration-200 ease-in-out filter group-hover:blur-[1px]"
            />
          </a>
        </Card>
      )}

      {/* Button */}
      <div className="mt-16 flex flex-col justify-center items-center">
        <button
          onClick={loadNext}
          className={`
              relative
              inline-flex
              items-center
              justify-center
              transition-all
              duration-300
              hover:scale-[1.1]
              ${loading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <GalaxyIcon className="mt-4 w-9 h-9 text-zinc-700" />
        </button>
      </div>
    </React.Fragment>
  );
}

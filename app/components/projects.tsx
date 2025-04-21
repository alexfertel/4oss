"use client";
import * as React from "react";

import { Card } from "./card";
import { GalaxyIcon } from "./icons";
import { DeviceType, Project } from "lib/types";
import { toast } from "sonner";

interface ProjectsProps {
  deviceType: DeviceType;
  initialProject?: Project | null;
}

async function fetchScreenshot(deviceType: DeviceType): Promise<Project> {
  const res = await fetch(`/api/random?deviceType=${deviceType}`, {
    redirect: "follow", // Follow the 302 from the Edge function.
    cache: "no-store", // Force a fresh request every click.
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const { project } = await res.json();
  return project;
}

export function Projects({ deviceType, initialProject = null }: ProjectsProps) {
  const [project, setProject] = React.useState<Project | null>(initialProject);
  const [loading, toggleLoading] = React.useReducer((prev) => !prev, false);

  if (project === null && initialProject === null) {
    return (
      <div className="sm:p-4 flex items-center justify-center w-[250px] h-[600px] sm:w-[600px] sm:h-[400px]">
        <span>Loading website…</span>
      </div>
    );
  }

  const viewableProject = project ?? initialProject!;

  const loadNext = async () => {
    toggleLoading();
    try {
      const project = await fetchScreenshot(deviceType);
      setProject(project);
    } catch (err) {
      console.error("Failed to load random screenshot:", err);
      toast.error(
        <p>
          Failed to load screenshot. <br />
          Please try again or contact
          <a
            href="https://x.com/alexfertel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-zinc-600"
          >
            &thinsp;@alexfertel&thinsp;
          </a>
          on Twitter.
        </p>,
      );
    } finally {
      toggleLoading();
    }
  };

  const className =
    deviceType === "desktop"
      ? "object-contain w-[300px] h-[240px] xs:w-[400px] xs:h-[320px] sm:w-[600px] sm:h-[480px]"
      : "object-contain w-[200px] h-[432px] xs:w-[250px] xs:h-[541px] sm:w-[390px] sm:h-[844px]";

  return (
    <React.Fragment>
      {/* Screenshot Container */}
      {viewableProject !== null && (
        <Card className="relative flex bg-transparent">
          <a
            href={viewableProject.info?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:p-4 cursor-alias"
          >
            <img
              src={viewableProject.src}
              alt={viewableProject.info?.title ?? "Random website screenshot"}
              className={className}
            />
          </a>
        </Card>
      )}

      {/* Button */}
      <div className="mt-8 xs:mt-12 sm:mt-18 flex flex-col justify-center items-center">
        <button
          onClick={loadNext}
          disabled={loading}
          aria-label="Load next screenshot"
          className={`
              relative
              inline-flex
              items-center
              justify-center
              transition-all
              duration-300
              hover:scale-[1.1]
              focus:outline-none focus:ring
              ${loading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <GalaxyIcon className="w-9 h-9 text-zinc-700" />
        </button>
      </div>
    </React.Fragment>
  );
}

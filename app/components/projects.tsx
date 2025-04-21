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
    const className =
      deviceType == "desktop"
        ? "sm:p-4 flex items-center justify-center w-[600px] h-[400px]"
        : "sm:p-4 flex items-center justify-center w-[300px] h-[700px]";
    return (
      <div className={className}>
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

  return (
    <React.Fragment>
      {/* Screenshot Container */}
      {viewableProject !== null && (
        <Card className="relative bg-transparent">
          <a
            href={viewableProject.info?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:p-4 flex justify-center items-center cursor-alias"
          >
            <img
              src={viewableProject.src}
              alt={viewableProject.info?.title ?? "Random website screenshot"}
              width={deviceType === "desktop" ? 600 : 300}
              height={deviceType === "desktop" ? 400 : 700}
              className="max-w-full h-auto"
            />
          </a>
        </Card>
      )}

      {/* Button */}
      <div className="mt-18 flex flex-col justify-center items-center">
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

"use client";
import * as React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import { GalaxyIcon } from "./icons";
import { ProjectInfo } from "../../lib/types";

interface ProjectsProps {
  deviceType: "desktop" | "mobile";
}

interface Project {
  src: string;
  info: ProjectInfo;
}

export function Projects({ deviceType }: ProjectsProps) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, toggleLoading] = React.useReducer((prev) => !prev, false);

  const loadNext = async () => {
    toggleLoading();
    try {
      const res = await fetch(`/api/random?variant=${deviceType}`, {
        redirect: "follow", // Follow the 302 from the Edge function.
        cache: "no-store", // Force a fresh request every click.
      });
      const { blobUrl, project } = await res.json();
      setProject({
        src: blobUrl, // Final blob.vercel‑storage.com URL.
        info: project,
      });
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
              width={1280}
              height={720}
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

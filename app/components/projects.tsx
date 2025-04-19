'use client'
import React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import { ProjectInfo } from "lib/types";
import { GalaxyIcon } from "./icons";

// Helper function to fetch binary data for a project's urlbox concurrently.
const fetchProjectImage = async (project: ProjectInfo): Promise<string | null> => {
  try {
    const res = await fetch(project.urlbox);
    if (!res.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error(`Error fetching image for "${project.title}":`, err);
    return null;
  }
};



interface ProjectsParams {
  projects: ProjectInfo[];
}

export function Projects({ projects }: ProjectsParams) {
  let [loading, toggleLoading] = React.useReducer(prev => !prev, false);

  const currentProject = {
    project: {
      id: "avatar",
      title: "avatar",
      url: "https://avatars.githubusercontent.com/u/22298999?v=4",
      urlbox: "https://avatars.githubusercontent.com/u/22298999?v=4",
    },
    src: "https://avatars.githubusercontent.com/u/22298999?v=4"
  };

  return (
    <div className="text-zinc-100">
      <div className="bg-transparent">
        {currentProject !== undefined && (
          <GlassmorphismCard>
            <a
              href={currentProject.project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex justify-center items-center"
            >
              <img
                src={currentProject.src}
                alt={currentProject.project.title}
              />
            </a>
          </GlassmorphismCard>
        )}
      </div>
      <div className="flex justify-center items-center">
        <GlassmorphismButton onClick={toggleLoading} loading={loading} className="mt-16" />
      </div>
    </div>
  );
}

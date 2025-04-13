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



const WINDOW_SIZE = 3;
const MAX_LOOKAHEAD = 10;

type WindowProject = {
  project: ProjectInfo;
  src: string;
};

interface ProjectsParams {
  projects: ProjectInfo[];
}

export function Projects({ projects }: ProjectsParams) {
  // Holds successfully loaded projects along with their object URL.
  const [windowProjects, setWindowProjects] = React.useState<WindowProject[]>([]);
  // Tracks the project to render from the window.
  const [windowIdx, setWindowIdx] = React.useState(-1);
  // Tracks the next project in the array to attempt loading.
  const [nextIndex, setNextIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleExplore = () => {
    // Prevent duplicate calls if loading.
    if (loading) return;

    // If there's an error and there are already some loaded projects, move on to the next.
    if (error && windowIdx < windowProjects.length - 1) {
      setWindowIdx(prev => prev + 1);
      setError(false);
      return;
    }

    // No more projects to fetch.
    if (nextIndex >= projects.length) return;

    setLoading(true);

    // How many projects are needed to fill the window?
    const alreadyInWindow = windowProjects.length - (windowIdx + 1);
    const projectsNeeded = WINDOW_SIZE - alreadyInWindow;

    // Define a batch from the next index up to the next MAX_LOOKAHEAD (but not beyond available projects)
    const batchEnd = Math.min(projects.length, nextIndex + MAX_LOOKAHEAD);

    // Launch fetches for the projects in the batch.
    for (let i = nextIndex; i < batchEnd; i++) {
      const project = projects[i];
      fetchProjectImage(project)
        .then(src => {
          if (src !== null) {
            // Immediately update the state when a project finishes fetching.
            setWindowProjects(prev => {
              // Avoid duplicates by checking if this project is already in the list.
              if (!prev.some(item => item.project.url === project.url)) {
                const updated = [...prev, { project, src }];
                // If this is the first project loaded, set windowIdx to 0 to render it right away.
                if (updated.length === 1 && windowIdx === -1) {
                  setWindowIdx(0);
                }
                return updated;
              }
              return prev;
            });
          }
        })
        .catch(err => {
          console.error("Error fetching project image:", err);
        });
    }

    // Update pointer to skip over this batch.
    setNextIndex(batchEnd);
    setLoading(false);
  };

  // const currentProject = windowIdx >= 0 ? windowProjects[windowIdx] : undefined;
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
      <div className="bg-transparent max-w-xl w-full">
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
        {!currentProject && !loading && error && <p>No projects available.</p>}
      </div>
      <div className="flex mt-8 justify-center items-center">
        <GlassmorphismButton onClick={handleExplore} loading={loading} />
      </div>
    </div>
  );
}

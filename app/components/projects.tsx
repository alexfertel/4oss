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

type WindowProject = {
  project: ProjectInfo;
  src: string;
};

interface ProjectsParams {
  projects: ProjectInfo[];
}

export function Projects({ projects }: ProjectsParams) {
  // Holds successfully loaded projects along with their object URL.
  const [slidingWindow, setWindow] = React.useState<WindowProject[]>([]);

  // Tracks the project to render from the slidingWindow.
  const [[windowIdx, fresh], setWindowIdx] = React.useState([-1, true]);

  // Tracks the next project in the array to attempt loading.
  const [projectIdx, setProjectIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    async function initialFetch() {
      if (projectIdx >= projects.length) {
        return;
      }
      setLoading(true);

      let i = projectIdx;
      for (; i < WINDOW_SIZE; i++) {
        const project = projects[i];
        fetchProjectImage(project)
          .then(src => {
            if (src === null) return;

            setWindow(prev => {
              // Avoid duplicates by checking if this project is already in the list.
              if (!prev.some(item => item.project.url === project.url)) {
                const updated = [...prev, { project, src }];

                if (updated.length > 0 && windowIdx === -1) {
                  setWindowIdx(prev => {
                    if (prev[0] === -1) {
                      return [0, prev[1]];
                    }
                  });
                }

                setLoading(false);
                return updated;
              }
              return prev;
            });
          });
      }
    }

    initialFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExplore = React.useCallback(() => {
    // Prevent duplicate calls if loading.
    if (loading) return;

    // If there are already some loaded projects, move on to the next.
    if (windowIdx < slidingWindow.length - 1) {
      setWindowIdx(([prev,]) => [prev + 1, true]);
    } else {
      setWindowIdx(([prev,]) => [prev, false]);
    }

    // No more projects to fetch.
    if (projectIdx >= projects.length) return;

    if (windowIdx == slidingWindow.length - 1) {
      setLoading(true);
    }

    // How many projects are needed to fill the slidingWindow?
    const alreadyInWindow = slidingWindow.length - (windowIdx + 1);
    const projectsNeeded = WINDOW_SIZE - alreadyInWindow;
    console.log("alreadyInWindow", alreadyInWindow, "projectsNeeded", projectsNeeded);

    // Define a batch from the next index up to the next MAX_LOOKAHEAD (but not beyond available projects)
    const batchEnd = Math.min(projects.length, projectIdx + projectsNeeded);

    // Launch fetches for the projects in the batch.
    for (let i = projectIdx; i < batchEnd; i++) {
      const project = projects[i];
      fetchProjectImage(project).then(src => {
        if (src !== null) {
          // Immediately update the state when a project finishes fetching.
          setWindow(prev => {
            if (prev.some(item => item.project.url === project.url)) {
              return prev;
            }

            const updated = [...prev, { project, src }];
            setLoading(false);
            setWindowIdx(([prev, fresh]) => {
              if (!fresh) {
                return [prev + 1, true];
              } else {
                return [prev, false];
              }
            });

            return updated;
          });
        }
      });
    }

    setProjectIdx(batchEnd);
  }, [loading, windowIdx, slidingWindow, projectIdx]);

  const currentProject = windowIdx >= 0 ? slidingWindow[windowIdx] : undefined;
  // const currentProject = {
  //   project: {
  //     id: "avatar",
  //     title: "avatar",
  //     url: "https://avatars.githubusercontent.com/u/22298999?v=4",
  //     urlbox: "https://avatars.githubusercontent.com/u/22298999?v=4",
  //   },
  //   src: "https://avatars.githubusercontent.com/u/22298999?v=4"
  // };

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
        {!currentProject && !loading && <p>No projects available.</p>}
      </div>
      <div className="flex justify-center items-center">
        <GlassmorphismButton onClick={handleExplore} loading={loading} className="mt-16" />
      </div>
    </div>
  );
}

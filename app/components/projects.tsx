'use client'
import React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import { ProjectInfo } from "lib/types";
import { Loader } from "./loader";

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

const WINDOW_SIZE = 1;

type WindowProject = {
  project: ProjectInfo;
  imageUrl: string;
};

interface ProjectsParams {
  projects: ProjectInfo[];
}

export function Projects({ projects }: ProjectsParams) {
  // Holds successfully loaded projects along with their object URL.
  const [windowProjects, setWindowProjects] = React.useState<WindowProject[]>([]);
  // Tracks the next project in the array to attempt loading.
  const [nextIndex, setNextIndex] = React.useState(0);
  // Controls whether the project card is visible; initially only the explore
  // button is shown.
  const [showProject, setShowProject] = React.useState(false);
  // Controls the animation state for the project card.
  const [animateCard, setAnimateCard] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Fill the window concurrently until we have WINDOW_SIZE projects or we run
  // out of projects.
  React.useEffect(() => {
    let isMounted = true;
    async function fillWindow() {
      if (windowProjects.length >= WINDOW_SIZE || nextIndex >= projects.length) return;
      const projectsNeeded = WINDOW_SIZE - windowProjects.length;
      setLoading(true);
      const batch = projects.slice(nextIndex, nextIndex + projectsNeeded);
      const fetchPromises = batch.map((project) =>
        fetchProjectImage(project).then((imageUrl) =>
          imageUrl ? { project, imageUrl } : null
        )
      );
      const results = await Promise.all(fetchPromises);
      if (!isMounted) return;
      const successful = results.filter((item): item is WindowProject => item !== null);
      setWindowProjects(prev => [...prev, ...successful]);
      setNextIndex(prev => prev + projectsNeeded);
      setLoading(false);
    }

    fillWindow();
    return () => {
      isMounted = false;
    };
  }, [nextIndex, projects, windowProjects.length]);

  // On the first click, show the project card; on subsequent clicks, remove the
  // current project.
  const handleExplore = () => {
    if (!showProject) {
      setShowProject(true);
      return;
    }
    if (windowProjects.length === 0) return;
    const [first, ...rest] = windowProjects;
    URL.revokeObjectURL(first.imageUrl);
    setWindowProjects(rest);
  };

  const currentProject = windowProjects[0];

  let shouldShowProject = showProject && currentProject;
  let shouldShowLoader = showProject && loading;

  return (
    <div className="text-zinc-100">
      {shouldShowProject && (
        <GlassmorphismCard className="p-2 max-w-xl w-full">
          <a
            href={currentProject.project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="rounded-sm"
              src={currentProject.imageUrl}
              alt={currentProject.project.title}
            />
          </a>
        </GlassmorphismCard>
      )}
      {/*shouldShowLoader && <Loader className="relative inset-0 rounded-full bg-zinc-50 will-change-transform w-6 h-6" />*/}
      {showProject && !currentProject && !loading && <p>No projects available.</p>}
      <div className="flex mt-8 justify-center items-center">
        <GlassmorphismButton onClick={handleExplore} loading={shouldShowLoader}>Explore</GlassmorphismButton>
      </div>
    </div>
  );
}

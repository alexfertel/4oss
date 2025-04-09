'use client'
import React from "react";
import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import Link from "next/link";
import { ProjectInfo } from "lib/types";

type WindowProject = {
  project: ProjectInfo;
  imageUrl: string;
};

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

export function Projects({ projects }: { projects: ProjectInfo[] }) {
  // `windowProjects` holds successfully loaded projects along with their object
  // URL.
  const [windowProjects, setWindowProjects] = React.useState<WindowProject[]>([]);
  // `nextIndex` tracks the next project in the array to attempt loading.
  const [nextIndex, setNextIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // Fill the window concurrently until we have 5 projects or we run out of
  // projects.
  React.useEffect(() => {
    let isMounted = true;
    async function fillWindow() {
      // Do nothing if window is full or we've attempted all projects.
      if (windowProjects.length >= 5 || nextIndex >= projects.length) return;

      // Calculate how many projects we need to load.
      const projectsNeeded = 5 - windowProjects.length;

      // Grab a batch of projects concurrently; here we try exactly as many as needed.
      setLoading(true);
      const batch = projects.slice(nextIndex, nextIndex + projectsNeeded);
      const fetchPromises = batch.map((project) =>
        fetchProjectImage(project).then((imageUrl) =>
          imageUrl ? { project, imageUrl } : null
        )
      );
      const results = await Promise.all(fetchPromises);
      if (!isMounted) return;

      // Filter out any unsuccessful fetches.
      const successful = results.filter((item): item is WindowProject => item !== null);
      setWindowProjects((prev) => [...prev, ...successful]);
      // Update nextIndex by the batch size regardless of success/failure.
      setNextIndex((prev) => prev + projectsNeeded);
      setLoading(false);
    }

    fillWindow();
    return () => {
      isMounted = false;
    };
  }, [nextIndex, projects, windowProjects.length]);

  // Remove the first project and revoke its object URL; the effect will then
  // try to fill the window.
  const handleExplore = () => {
    if (windowProjects.length === 0) return;
    const [first, ...rest] = windowProjects;
    URL.revokeObjectURL(first.imageUrl);
    setWindowProjects(rest);
  };

  const currentProject = windowProjects[0];

  return (
    <>
      {currentProject ? (
        <GlassmorphismCard className="relative inset-0 p-6 max-w-md w-full">
          <p className="text-black/90 font-semibold text-lg">
            {currentProject.project.title}
          </p>
          <img
            src={currentProject.imageUrl}
            alt={currentProject.project.title}
          />
          <Link
            href={currentProject.project.url}
            {...(currentProject.project.url?.startsWith("https://")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Visit
          </Link>
        </GlassmorphismCard>
      ) : (
        <p>{loading ? "Loading..." : "No projects available."}</p>
      )}
      <div className="flex mt-8 justify-center items-center">
        <GlassmorphismButton onClick={handleExplore}>Explore</GlassmorphismButton>
      </div>
    </>
  );
}

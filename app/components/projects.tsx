'use client'
import { Project } from "oss-directory";
import React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";

export function Projects({ projects }: { projects: Project[] }) {
  const [index, setIndex] = React.useState(0);

  const project = projects[index];
  const title = project.display_name;
  const description = project.description;
  // TODO: Use better types. We know this field is not undefined at this point.
  const url = (project.websites?.[0] ?? "wut") as unknown as string;

  return (
    <>
      <GlassmorphismCard className="relative inset-0 p-6 max-w-md w-full">
        <p className="text-black/90 font-semibold text-lg">
          {title}
        </p>
        <p className="text-black/90">
          {description}
          <a href={url} target="_blank" rel="noopener noreferrer">Visit</a>
        </p>
      </GlassmorphismCard>
      <div className="flex mt-8 justify-center items-center">
        <GlassmorphismButton onClick={() => setIndex((prev) => prev + 1)} >
          Explore
        </GlassmorphismButton>
      </div>
    </>
  )
}

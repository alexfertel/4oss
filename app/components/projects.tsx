'use client'
import React from "react";

import { GlassmorphismCard } from "./card";
import { GlassmorphismButton } from "./button";
import Link from "next/link";
import { ProjectInfo } from "lib/types";

export function Projects({ projects }: { projects: ProjectInfo[] }) {
  const [index, setIndex] = React.useState(0);

  const project = projects[index];
  const { title, url, urlbox } = project;

  return (
    <>
      <GlassmorphismCard className="relative inset-0 p-6 max-w-md w-full">
        <p className="text-black/90 font-semibold text-lg">
          {title}
        </p>
        {/* <img src={urlbox} /> */}
        <Link
          className=''
          href={url}
          draggable={false}
          {...(url?.startsWith('https://')
            ? {
              target: '_blank',
              rel: 'noopener noreferrer',
            }
            : {})}>Visit
        </Link>
      </GlassmorphismCard>
      <div className="flex mt-8 justify-center items-center">
        <GlassmorphismButton onClick={() => setIndex((prev) => prev + 1)} >
          Explore
        </GlassmorphismButton>
      </div>
    </>
  )
}

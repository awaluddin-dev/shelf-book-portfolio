import React from "react";
import { Project } from "../types";

export const legendLevels = [
  { level: 0, darkBg: 'bg-zinc-800/60', lightBg: 'bg-gray-200', label: 'No contributions (0)' },
  { level: 1, darkBg: 'bg-emerald-950', lightBg: 'bg-indigo-100', label: 'Low (1-2 contributions)' },
  { level: 2, darkBg: 'bg-emerald-800', lightBg: 'bg-indigo-300', label: 'Medium (3-4 contributions)' },
  { level: 3, darkBg: 'bg-emerald-500', lightBg: 'bg-indigo-500', label: 'High (5-7 contributions)' },
  { level: 4, darkBg: 'bg-emerald-400', lightBg: 'bg-indigo-600', label: 'Very high (8+ contributions)' }
];

export const getTagProjectCount = (tag: string, allProjects: Project[]) => {
  return allProjects.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase())).length;
};

export const getRelatedProjects = (currentProj: Project, allProjects: Project[]) => {
  return allProjects
    .filter(p => p.id !== currentProj.id)
    .map(p => {
      const overlapCount = p.tags.filter(t => currentProj.tags.includes(t)).length;
      return { project: p, overlapCount };
    })
    .sort((a, b) => b.overlapCount - a.overlapCount)
    .slice(0, 2)
    .map(x => x.project);
};


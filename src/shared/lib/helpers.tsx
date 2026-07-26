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

export const TECHNICAL_IMAGERY: Record<string, {
  featured: string;
  blueprint: string;
  metrics: string;
  featuredCaption: string;
  blueprintCaption: string;
  metricsCaption: string;
}> = {
  'auraflow-ai': {
    featured: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    blueprint: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    metrics: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    featuredCaption: 'Enterprise multi-agent scheduler nodes',
    blueprintCaption: 'LangGraph state transition graph mapping',
    metricsCaption: 'Distributed Redis queue latency tracker'
  },
  'sera-migration': {
    featured: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=800',
    blueprint: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800',
    metrics: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    featuredCaption: 'Kubernetes container fleet nodes',
    blueprintCaption: 'Azure Service Bus topic exchange pipelines',
    metricsCaption: 'Microservice domain isolation telemetry'
  },
  'ledgerflow': {
    featured: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800',
    blueprint: 'https://images.unsplash.com/photo-1642156814441-ab8994f46e3e?auto=format&fit=crop&q=80&w=800',
    metrics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    featuredCaption: 'Atomic ledger thread orchestration engine',
    blueprintCaption: 'Optimistic Concurrency Control pipeline checks',
    metricsCaption: 'Redis balance cache transaction logs'
  },
  'telkomsel-iot': {
    featured: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    blueprint: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    metrics: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800',
    featuredCaption: 'Physical server hardware provisioning',
    blueprintCaption: 'Bare-metal Kubernetes cluster configurations',
    metricsCaption: 'IoT streaming metric ingestion logs'
  },
  'doeku-p2p': {
    featured: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    blueprint: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    metrics: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    featuredCaption: 'Transaction registry & database architecture',
    blueprintCaption: 'Asynchronous payout queues & background workers',
    metricsCaption: 'Automated auditing ledger security telemetry'
  }
};

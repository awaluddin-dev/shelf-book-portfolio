const fs = require('fs');

const lines = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8').split('\n');
const profLines = lines.slice(1765, 2289).join('\n');

const profComponent = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, GitFork, Cpu, Globe, Rocket, ArrowRight, Activity, TrendingUp, Layers, PenTool, ExternalLink, BriefcaseBusiness } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { legendLevels } from '@/shared/lib/helpers';

interface ProficiencySectionProps {
  dynamicProficiency: any[];
  activeRoadmap: any[];
  activeCurrentFocus: any[];
  renderIcon: (iconName: string, isSavings: boolean, size: number) => React.ReactNode;
  selectedLevelFilter: number | null;
  setSelectedLevelFilter: (val: number | null) => void;
  contributionData: any[][];
  chartType: "temporal" | "repository";
  setChartType: (val: "temporal" | "repository") => void;
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  hoveredMonth: number | null;
  setHoveredMonth: (val: number | null) => void;
  hoveredLang: string | null;
  setHoveredLang: (val: string | null) => void;
  selectedRoadmapIndex: number;
  setSelectedRoadmapIndex: (val: number) => void;
  isDark: boolean;
}

export default function ProficiencySection({
  dynamicProficiency,
  activeRoadmap,
  activeCurrentFocus,
  renderIcon,
  selectedLevelFilter,
  setSelectedLevelFilter,
  contributionData,
  chartType,
  setChartType,
  timelineData,
  repoData,
  languageData,
  hoveredMonth,
  setHoveredMonth,
  hoveredLang,
  setHoveredLang,
  selectedRoadmapIndex,
  setSelectedRoadmapIndex,
  isDark
}: ProficiencySectionProps) {
  return (
    <>
${profLines}
    </>
  );
}`;

fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profComponent);
console.log('Created ProficiencySection.tsx');

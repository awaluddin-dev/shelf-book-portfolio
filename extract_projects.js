const fs = require('fs');

const lines = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8').split('\n');
const projectsLines = lines.slice(1256, 1764).join('\n');

const projectsComponent = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Wrench, ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import BookItem from '@/entities/project/ui/BookItem';
import MobileFilterModal from './components/MobileFilterModal';

interface ProjectsSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  categories: string[];
  sortBy: any;
  setSortBy: (sort: any) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  filteredProjects: any[];
  getTechIconAndColor: (tag: string) => any;
  getTagProjectCount: (tag: string) => number;
  setSelectedProject: (proj: any) => void;
  setFocusedProject: (proj: any) => void;
  isDark: boolean;
}

export default function ProjectsSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  isFilterModalOpen,
  setIsFilterModalOpen,
  filteredProjects,
  getTechIconAndColor,
  getTagProjectCount,
  setSelectedProject,
  setFocusedProject,
  isDark
}: ProjectsSectionProps) {
  return (
    <>
${projectsLines}
    </>
  );
}`;

fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projectsComponent);
console.log('Created ProjectsSection.tsx');

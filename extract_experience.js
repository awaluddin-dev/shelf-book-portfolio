const fs = require('fs');

const lines = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8').split('\n');
const expLines = lines.slice(2290, 3321).join('\n'); // 2291 to 3321 in 1-based indexing means indices 2290 to 3321 (exclusive) -> slice(2290, 3321) covers 2291 to 3321.

const expComponent = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Quote, QuoteIcon, Wrench } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Testimonial } from '@/shared/types';

interface ExperienceSectionProps {
  dynamicWork: any[];
  activeExpIdx: number | null;
  setActiveExpIdx: (idx: number | null) => void;
  testimonialsList: Testimonial[];
  setSelectedTestimonial: (test: any) => void;
}

export default function ExperienceSection({
  dynamicWork,
  activeExpIdx,
  setActiveExpIdx,
  testimonialsList,
  setSelectedTestimonial
}: ExperienceSectionProps) {
  return (
    <>
${expLines}
    </>
  );
}`;

fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expComponent);
console.log('Created ExperienceSection.tsx');

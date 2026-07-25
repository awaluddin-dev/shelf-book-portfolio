const fs = require('fs');

const lines = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8').split('\n');

// Lines 892 to 1255 (inclusive) in 1-based indexing means indices 891 to 1254
const heroLines = lines.slice(891, 1255).join('\n');

const heroComponent = `import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Download, Terminal, Github, Linkedin, PenTool, Mail } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import CircuitBoardBg from '@/shared/ui/CircuitBoardBg';

interface HeroSectionProps {
  isLoading: boolean;
  dynamicHeroConfig: any;
  activeMetrics: any[];
  renderIcon: (iconName: string, isSavings: boolean, size: number) => React.ReactNode;
  triggerToast: (msg: string) => void;
  setShowInquiryModal: (val: boolean) => void;
}

export default function HeroSection({
  isLoading,
  dynamicHeroConfig,
  activeMetrics,
  renderIcon,
  triggerToast,
  setShowInquiryModal
}: HeroSectionProps) {
  return (
    <>
${heroLines}
    </>
  );
}`;

fs.mkdirSync('src/views/home/ui/sections', { recursive: true });
fs.writeFileSync('src/views/home/ui/sections/HeroSection.tsx', heroComponent);
console.log('Created HeroSection.tsx');

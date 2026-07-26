import { motion, useMotionValue, useTransform } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { Code2 } from "lucide-react";
import { Project } from '@/shared/types';

interface BookItemProps {
  project: Project;
  setSelectedProject: (p: Project) => void;
  setFocusedProject: (p: Project | null) => void;
  isDark: boolean;
  getTagProjectCount: (tag: string) => number;
}

export default function BookItem({
  project,
  setFocusedProject,
}: BookItemProps) {
  // Motion values to track dynamic mouse coords relative to element center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Translate coordinates to specific 3D rotation angles
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized position relative to element center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onClick={() => setFocusedProject(project)}
      className="relative cursor-pointer group flex-shrink-0 snap-center w-24 sm:w-28 md:w-auto flex justify-center"
      style={{ perspective: 800 }}
    >
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{
          scale: 1.08,
          y: -16,
          z: 30
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative transition-all duration-300 group-hover:z-20 group-hover:shadow-neu-modal w-full md:w-auto flex justify-center"
      >
        {/* The "Book Spine" */}
        <div
          className={cn(
            "w-20 md:w-20 h-80 shadow-neu relative flex flex-col justify-between p-3 border border-white/40 overflow-hidden",
            !project.spineColor?.startsWith('#') && !project.spineColor?.startsWith('rgb') ? project.spineColor : ""
          )}
          style={{ 
            transform: "translateZ(10px)",
            ...(project.spineColor?.startsWith('#') || project.spineColor?.startsWith('rgb') ? { backgroundColor: project.spineColor } : {})
          }}
        >
          {/* Spine Details */}
          <div className="w-full h-1 bg-black/10 rounded-full mb-2 shadow-inner"></div>
          <div className="w-full h-1 bg-black/10 rounded-full mb-4 shadow-inner"></div>

          <div className="flex-1 relative flex items-center justify-center">
            <span className="absolute whitespace-pre-wrap transform -rotate-90 origin-center text-sm md:text-[10px] lg:text-xs font-mono font-bold tracking-widest text-white drop-shadow-md w-[260px] md:w-[220px] text-center leading-tight">
              {project.spineText}
            </span>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="w-full h-0.5 bg-white/40 shadow-sm"></div>
            <Code2 size={16} className="text-white drop-shadow-sm md:w-3 md:h-3" />
            <div className="w-full h-0.5 bg-white/40 shadow-sm"></div>
          </div>

          {/* Page Edge Effect */}
          <div className="absolute right-0 top-0 bottom-0 w-2 md:w-1 bg-gradient-to-r from-transparent to-black/10 rounded-r-lg"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

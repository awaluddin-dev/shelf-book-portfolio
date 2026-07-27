import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  Github,
  Terminal,
  Lightbulb,
  Target,
  FileText,
  Network,
  Layers,
  Sparkles,
  Code2,
  Check,
  Copy,
  User
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import ReactMarkdown from "react-markdown";
import MermaidDiagram from "@/shared/ui/MermaidDiagram";
import ProjectLifecycleTracker from "@/entities/project/ui/ProjectLifecycleTracker";
import ProjectArchitectureDiagram from "@/entities/project/ui/ProjectArchitectureDiagram";

interface ProjectModalProps {
  selectedProject: any;
  onClose: () => void;
  onPrevProject: () => void;
  onNextProject: () => void;
  onSelectProject: (project: any) => void;
  isBannerMinimized: boolean;
  setIsBannerMinimized: (val: boolean) => void;
  isDark: boolean;
  getRelatedProjects: (project: any) => any[];
  getTechIconAndColor: (tag: string) => {
    color: string;
    icon: React.ReactNode;
  };
  getTagProjectCount: (tag: string) => number;
  TECHNICAL_IMAGERY: Record<string, any>;
}

export default function ProjectModal({
  selectedProject,
  onClose,
  onPrevProject,
  onNextProject,
  onSelectProject,
  isDark,
  getRelatedProjects,
  getTechIconAndColor,
  getTagProjectCount,
  TECHNICAL_IMAGERY,
}: Readonly<ProjectModalProps>) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Flip Book Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  // Reset page when project changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(1); // open book animation implicitly moves forward
  }, [selectedProject?.id]);

  const pages = useMemo(() => {
    if (!selectedProject) return [];
    const p: { id: string, type: string }[] = [];
    
    // Page 0: Header
    p.push({ id: 'header', type: 'header' });
    
    // Page 1: Details
    p.push({ id: 'details', type: 'details' });
    
    // Page 2: System Spec
    if (selectedProject.markdown) {
      p.push({ id: 'markdown', type: 'markdown' });
    }
    
    // Page 3: Architecture
    if ((selectedProject.systemArchitectures && selectedProject.systemArchitectures.length > 0) || selectedProject.architectureImage) {
      p.push({ id: 'architecture', type: 'architecture' });
    }
    
    // Page 4: Lifecycle
    if (selectedProject.projectLifecycles && selectedProject.projectLifecycles.length > 0) {
      p.push({ id: 'lifecycle', type: 'lifecycle' });
    }
    
    // Page 5: Related
    p.push({ id: 'related', type: 'related' });
    
    // Page 6: About Author
    p.push({ id: 'about', type: 'about' });
    
    return p;
  }, [selectedProject]);

  const paginate = (newDirection: number) => {
    const nextIndex = currentPage + newDirection;
    if (nextIndex >= 0 && nextIndex < pages.length) {
      setDirection(newDirection);
      setCurrentPage(nextIndex);
    } else if (nextIndex < 0) {
      // Go to previous project
      onPrevProject();
    } else if (nextIndex >= pages.length) {
      // Go to next project
      onNextProject();
    }
  };

  // Keyboard navigation for pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowLeft") {
        e.stopPropagation();
        paginate(-1);
      } else if (e.key === "ArrowRight") {
        e.stopPropagation();
        paginate(1);
      } else if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, currentPage, pages.length]);

  const pageVariants: any = {
    enter: (direction: number) => {
      return {
        rotateY: direction > 0 ? 90 : -90,
        opacity: 0,
        z: direction > 0 ? 100 : -100,
        scale: 0.95
      };
    },
    center: {
      rotateY: 0,
      opacity: 1,
      z: 0,
      scale: 1,
      transition: {
        rotateY: { type: "spring", stiffness: 100, damping: 20 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction: number) => {
      return {
        rotateY: direction < 0 ? 90 : -90,
        opacity: 0,
        z: direction < 0 ? 100 : -100,
        scale: 0.95,
        transition: {
          rotateY: { type: "spring", stiffness: 100, damping: 20 },
          opacity: { duration: 0.3 }
        }
      };
    }
  };

  const renderPageContent = (page: { id: string, type: string }) => {
    if (!selectedProject) return null;

    switch (page.type) {
      case 'header':
        return (
          <div className="w-full h-full flex flex-col relative">
            <div 
              className={cn(
                "absolute inset-0 z-0",
                !selectedProject.coverColor?.startsWith("#") && !selectedProject.coverColor?.startsWith("rgb") ? selectedProject.coverColor : ""
              )}
              style={{
                ...(selectedProject.coverColor?.startsWith("#") || selectedProject.coverColor?.startsWith("rgb") ? { backgroundColor: selectedProject.coverColor } : {})
              }}
            >
              <img
                src={TECHNICAL_IMAGERY[selectedProject.id]?.featured || TECHNICAL_IMAGERY["auraflow-ai"]?.featured}
                alt="Background"
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neu-bg via-neu-bg/80 to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 pb-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-medium text-white/90">
                  {selectedProject.category}
                </span>
                <span className="text-white/70 text-sm font-mono">
                  {selectedProject.date}
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-white tracking-tight mb-4 drop-shadow-lg">
                {selectedProject.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl drop-shadow-md">
                {selectedProject.subtitle}
              </p>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="w-full h-full flex flex-col p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-neu-text/10">
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neu-accent hover:bg-neu-accent/90 text-white rounded-xl font-mono text-sm font-bold shadow-md transition-transform active:scale-95"
                >
                  <Globe size={16} /> Live Demo
                </a>
              )}
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neu-bg hover:bg-neu-base text-neu-text rounded-xl font-mono text-sm font-bold shadow-neu-sm border border-neu-text/10 transition-transform active:scale-95"
                >
                  <Github size={16} /> Source Code
                </a>
              )}
            </div>

            {selectedProject.stats && selectedProject.stats.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Terminal size={14} /> Project Impact & Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProject.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl glass-card flex flex-col justify-between items-start text-left border border-white/5">
                      <span className="text-2xl font-bold font-display text-neu-text tracking-tight mb-1">{stat.value}</span>
                      <span className="text-xs font-mono text-neu-text-muted">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(selectedProject.reasonToBuild || selectedProject.problemSolved) && (
              <div className="flex flex-col gap-6 mb-10">
                {selectedProject.reasonToBuild && (
                  <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-inset border border-white/5">
                    <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Lightbulb size={14} className="text-neu-accent" /> Why I Built This
                    </h4>
                    <p className="text-neu-text-muted text-sm leading-relaxed">{selectedProject.reasonToBuild}</p>
                  </div>
                )}
                {selectedProject.problemSolved && (
                  <div className="bg-neu-bg p-6 rounded-3xl shadow-neu-inset border border-white/5">
                    <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target size={14} className="text-neu-accent" /> Business Problem Solved
                    </h4>
                    <p className="text-neu-text-muted text-sm leading-relaxed">{selectedProject.problemSolved}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code2 size={14} /> Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {(selectedProject.tags || []).map((tag: string) => {
                  const { color, icon } = getTechIconAndColor(tag);
                  const count = getTagProjectCount(tag);
                  return (
                    <div key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neu-base border border-neu-text/5 text-xs font-mono font-medium shadow-sm">
                      <span className={cn("flex-shrink-0", color)}>{icon}</span>
                      <span className="text-neu-text">{tag}</span>
                      <span className="text-neu-accent text-[10px] ml-1">+{count} projects</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'markdown':
        return (
          <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar prose prose-slate max-w-none font-sans
            prose-headings:font-display prose-headings:font-bold prose-headings:text-neu-text
            prose-p:text-neu-text-muted prose-li:text-neu-text-muted prose-strong:text-neu-text
            dark:prose-invert">
            <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 not-prose border-b border-neu-text/10 pb-4">
              <FileText size={14} /> System Specifications
            </h4>
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!match) return <code className="bg-neu-base px-1.5 py-0.5 rounded text-pink-500 text-sm font-mono" {...props}>{children}</code>;
                  if (match[1] === "mermaid") return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
                  return (
                    <div className="relative group/code my-4 rounded-xl overflow-hidden border border-neu-text/10 bg-[#0d1117] not-prose">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[10px] font-mono text-gray-400">
                        <span>{match[1]}</span>
                        <button onClick={() => { navigator.clipboard.writeText(String(children)); setCopiedCode(String(children)); setTimeout(() => setCopiedCode(null), 2000); }} className="hover:text-white transition-colors">
                          {copiedCode === String(children) ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                        {String(children)}
                      </div>
                    </div>
                  );
                }
              }}
            >
              {selectedProject.markdown}
            </ReactMarkdown>
          </div>
        );

      case 'architecture':
        return (
          <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
            <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-neu-text/10 pb-4 shrink-0">
              <Layers size={14} /> System Architecture
            </h4>
            <div className="flex-1 min-h-0">
              <ProjectArchitectureDiagram project={selectedProject} isDark={isDark} />
            </div>
          </div>
        );

      case 'lifecycle':
        return (
          <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-8 flex items-center gap-2 border-b border-neu-text/10 pb-4">
              <Network size={14} /> Project Lifecycle Tracker
            </h4>
            <ProjectLifecycleTracker projectId={selectedProject.id} spineColor={selectedProject.spineColor} />
          </div>
        );

      case 'related':
        return (
          <div className="w-full h-full p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-8 flex items-center gap-2 border-b border-neu-text/10 pb-4">
              <Sparkles size={14} /> Related Projects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getRelatedProjects(selectedProject).map((proj) => (
                <div
                  key={proj.id}
                  onClick={(e) => { e.stopPropagation(); onSelectProject(proj); }}
                  className="p-5 rounded-2xl glass-card hover:shadow-neu-sm border border-gray-300/10 dark:border-zinc-800 cursor-pointer group transition-all flex items-center gap-4 text-left"
                >
                  <div className={cn("w-12 h-16 rounded-md flex-shrink-0 flex items-center justify-center relative shadow-sm",
                      !proj.spineColor?.startsWith("#") && !proj.spineColor?.startsWith("rgb") ? proj.spineColor : ""
                    )}
                    style={{ ...(proj.spineColor?.startsWith("#") || proj.spineColor?.startsWith("rgb") ? { backgroundColor: proj.spineColor } : {}) }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-neu-accent font-bold uppercase tracking-wider block">{proj.category}</span>
                    <h5 className="text-sm font-bold text-neu-text truncate mt-1 group-hover:text-neu-accent transition-colors">{proj.title}</h5>
                    <p className="text-xs text-neu-text-muted truncate mt-1">{proj.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="w-full h-full p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
             <div className="w-24 h-24 rounded-full bg-neu-accent/10 border-2 border-neu-accent flex items-center justify-center mb-6 shadow-neu">
                <User size={40} className="text-neu-accent" />
             </div>
             <h2 className="text-3xl font-display font-bold text-neu-text mb-4">About the Author</h2>
             <p className="text-neu-text-muted max-w-md mx-auto leading-relaxed mb-8">
               I am a passionate software engineer dedicated to building scalable and robust solutions. Every project here is crafted with attention to detail, performance, and best practices.
             </p>
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="px-6 py-3 bg-neu-accent text-white rounded-xl font-mono text-sm font-bold shadow-md hover:scale-105 transition-transform">
               Close Book
             </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Main Book Container */}
          <motion.div
            initial={{ scale: 0.8, rotateX: 10, y: 50, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, rotateX: -10, y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-full max-w-lg md:max-w-xl h-[85vh] max-h-[850px] relative perspective-[2000px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute -top-12 right-0 md:-right-12 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-colors z-50 shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Pagination Controls */}
            {currentPage > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 p-4 rounded-full bg-neu-bg/90 shadow-neu-sm text-neu-text hover:text-neu-accent hover:scale-110 active:scale-95 transition-all z-50 border border-neu-text/10"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {currentPage < pages.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 p-4 rounded-full bg-neu-bg/90 shadow-neu-sm text-neu-text hover:text-neu-accent hover:scale-110 active:scale-95 transition-all z-50 border border-neu-text/10"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* The Book Page Container */}
            <div className="w-full h-full relative preserve-3d shadow-2xl rounded-l-[1rem] rounded-r-[2rem] overflow-hidden bg-neu-bg border-r-8 border-r-neu-text/5 border-l border-l-neu-text/20">
               {/* Book Binding/Spine visual effect */}
               <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-40 pointer-events-none border-r border-black/5"></div>
               
               <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ transformOrigin: direction > 0 ? "left center" : "right center" }}
                    className="absolute inset-0 w-full h-full bg-neu-bg"
                  >
                    {renderPageContent(pages[currentPage])}
                  </motion.div>
               </AnimatePresence>

               {/* Page Number Indicator */}
               <div className="absolute bottom-4 right-8 z-50 text-xs font-mono font-bold text-neu-text-muted">
                 Page {currentPage + 1} of {pages.length}
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

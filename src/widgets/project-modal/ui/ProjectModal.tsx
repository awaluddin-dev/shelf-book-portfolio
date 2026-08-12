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
  Quote,
  Database
} from "lucide-react";
import { cn, secureMathRandom } from "@/shared/lib/utils";
import ReactMarkdown from "react-markdown";
import MermaidDiagram from "@/shared/ui/MermaidDiagram";
import ProjectLifecycleTracker from "@/entities/project/ui/ProjectLifecycleTracker";
import ProjectArchitectureDiagram from "@/entities/project/ui/ProjectArchitectureDiagram";

import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { getRelatedProjects, TECHNICAL_IMAGERY, getTagProjectCount } from "@/shared/lib/helpers";

interface ProjectModalProps {
  isDark: boolean;
  getTechIconAndColor: (tag: string) => {
    color: string;
    icon: React.ReactNode;
  };
}

const ProjectDetailsPage = ({ selectedProject }: { selectedProject: any }) => (
  <div className="flex flex-col h-full space-y-8">
    <div>
      <h2 className="text-3xl font-display font-black tracking-tight mb-2 text-zinc-900 dark:text-white">{selectedProject.title}</h2>
      <p className="text-sm italic font-mono text-zinc-600 dark:text-zinc-400">{selectedProject.subtitle}</p>
    </div>
    
    <div className="flex flex-wrap items-center gap-3">
      {selectedProject.demoUrl && (
        <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-neu-accent hover:bg-neu-accent/90 text-white rounded-lg font-mono text-[10px] font-bold shadow-md transition-transform active:scale-95">
          <Globe size={14} /> Live Demo
        </a>
      )}
      {selectedProject.github && (
        <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-mono text-[10px] font-bold shadow-sm border border-zinc-300 dark:border-zinc-700 transition-transform active:scale-95">
          <Github size={14} /> Source Code
        </a>
      )}
    </div>

    {selectedProject.stats && selectedProject.stats.length > 0 && (
      <div>
        <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
          <Terminal size={14} /> Project Metrics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {selectedProject.stats.map((stat: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between items-start text-left">
              <span className="text-lg font-bold font-display text-zinc-900 dark:text-white tracking-tight">{stat.value}</span>
              <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ProjectTechStackPage = ({ selectedProject, getTechIconAndColor, activeProjects }: { selectedProject: any, getTechIconAndColor: any, activeProjects: any[] }) => (
  <div className="flex flex-col h-full space-y-8">
    {(selectedProject.reasonToBuild || selectedProject.problemSolved) && (
      <div className="flex flex-col gap-6">
        {selectedProject.reasonToBuild && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb size={14} className="text-neu-accent" /> Why I Built This
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{selectedProject.reasonToBuild}</p>
          </div>
        )}
        {selectedProject.problemSolved && (
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target size={14} className="text-neu-accent" /> Business Problem Solved
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{selectedProject.problemSolved}</p>
          </div>
        )}
      </div>
    )}

    <div>
      <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <Code2 size={14} /> Technology Stack
      </h4>
      <div className="flex flex-wrap gap-2">
        {(selectedProject.tags || []).map((tag: string) => {
          const { color, icon } = getTechIconAndColor(tag);
          return (
            <div key={tag} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-medium shadow-sm">
              <span className={cn("flex-shrink-0 w-3 h-3", color)}>{icon}</span>
              <span className="text-zinc-700 dark:text-zinc-300">{tag}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const ProjectMarkdownPage = ({ content, index, total, copiedCode, setCopiedCode }: { content: any, index: number, total: number, copiedCode: string | null, setCopiedCode: any }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <FileText size={14} /> System Specifications {total > 1 ? `(${index + 1}/${total})` : ''}
    </h4>
    {content ? (
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar prose prose-slate prose-sm max-w-none font-sans
        prose-headings:font-display prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white
        prose-p:text-zinc-600 dark:prose-p:text-zinc-400 
        prose-li:text-zinc-600 dark:prose-li:text-zinc-400 
        prose-strong:text-zinc-900 dark:prose-strong:text-white
        dark:prose-invert">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              if (!match) return <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-pink-500 text-xs font-mono" {...props}>{children}</code>;
              if (match[1] === "mermaid") return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
              return (
                <div className="relative group/code my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0d1117] not-prose">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 text-[10px] font-mono text-zinc-500 dark:text-gray-400">
                    <span>{match[1]}</span>
                    <button onClick={() => { navigator.clipboard.writeText(String(children)); setCopiedCode(String(children)); setTimeout(() => setCopiedCode(null), 2000); }} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {copiedCode === String(children) ? <Check size={12} className="text-green-500 dark:text-green-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto text-xs font-mono text-zinc-700 dark:text-gray-300">
                    {String(children)}
                  </div>
                </div>
              );
            }
          }}
        >{content}</ReactMarkdown>
      </div>
    ) : (
      <p className="text-xs text-zinc-500 italic">No markdown specifications provided.</p>
    )}
  </div>
);

const ProjectArchitecturePage = ({ content, index, total, selectedProject, isDark }: { content: any, index: number, total: number, selectedProject: any, isDark: boolean }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Layers size={14} /> System Architecture {total > 1 ? `(${index + 1}/${total})` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {content?.imageUrl ? (
           <ProjectArchitectureDiagram imageUrl={content.imageUrl} />
        ) : (
          <p className="text-xs text-zinc-500 italic">No architecture diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectLifecyclePage = ({ selectedProject }: { selectedProject: any }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Network size={14} /> Lifecycle Tracker
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-y-auto custom-scrollbar">
       {selectedProject.projectLifecycles?.length > 0 ? (
         <ProjectLifecycleTracker projectId={selectedProject.id} spineColor={selectedProject.spineColor} />
       ) : (
         <p className="text-xs text-zinc-500 italic text-center mt-4">No lifecycle data provided.</p>
       )}
    </div>
  </div>
);

const ProjectSchemaPage = ({ content, index, total }: { content: any, index: number, total: number }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Database size={14} /> Database Schema {total > 1 ? `(${index + 1}/${total})` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#0d1117] rounded-lg">
        {content?.imageUrl ? (
          <img src={content.imageUrl} alt="Schema Diagram" className="w-full h-full object-contain" />
        ) : (
          <p className="text-xs text-zinc-500 italic">No schema diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectErdPage = ({ content, index, total }: { content: any, index: number, total: number }) => (
  <div className="w-full h-full flex flex-col">
    <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
      <Database size={14} /> Entity Relationship Diagram {total > 1 ? `(${index + 1}/${total})` : ''}
    </h4>
    <div className="flex-1 min-h-0 bg-white dark:bg-zinc-900/50 rounded-xl p-2 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden flex flex-col relative gap-2">
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#0d1117] rounded-lg">
        {content?.imageUrl ? (
          <img src={content.imageUrl} alt="ERD Diagram" className="w-full h-full object-contain" />
        ) : (
          <p className="text-xs text-zinc-500 italic">No ERD diagram provided.</p>
        )}
      </div>
      {content?.description && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shrink-0 overflow-y-auto max-h-[40%] custom-scrollbar text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
          {content.description}
        </div>
      )}
    </div>
  </div>
);

const ProjectRelatedPage = ({ selectedProject, activeProjects, onSelectProject }: { selectedProject: any, activeProjects: any, onSelectProject: any }) => (
  <div className="w-full h-full flex flex-col justify-between">
    <div>
      <h4 className="text-[10px] font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <Sparkles size={14} /> Related Projects
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {getRelatedProjects(selectedProject, activeProjects).slice(0, 4).map((proj) => (
          <div
            key={proj.id}
            onClick={(e) => { e.stopPropagation(); onSelectProject(proj); }}
            className="p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-neu-accent/50 cursor-pointer group transition-all flex items-center gap-3 text-left"
          >
            <div className={cn("w-10 h-12 rounded-sm flex-shrink-0 flex items-center justify-center relative shadow-sm",
                !proj.spineColor?.startsWith("#") && !proj.spineColor?.startsWith("rgb") ? proj.spineColor : ""
              )}
              style={{ ...(proj.spineColor?.startsWith("#") || proj.spineColor?.startsWith("rgb") ? { backgroundColor: proj.spineColor } : {}) }}
            ></div>
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-mono text-neu-accent font-bold uppercase tracking-wider block">{proj.category}</span>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-0.5 group-hover:text-neu-accent transition-colors">{proj.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ProjectModal({
  isDark,
  getTechIconAndColor,
}: Readonly<ProjectModalProps>) {
  const { 
    selectedProject, setSelectedProject,
    dynamicProjects: activeProjects,
  } = usePortfolioStore();

  const onClose = () => setSelectedProject(null);
  const onSelectProject = (project: any) => setSelectedProject(project);

  const onPrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = activeProjects.findIndex(
      (p) => p.id === selectedProject.id,
    );
    if (currentIndex === -1) return;
    if (currentIndex > 0) {
      setSelectedProject(activeProjects[currentIndex - 1]);
    } else {
      setSelectedProject(activeProjects.at(-1));
    }
  };

  const onNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = activeProjects.findIndex(
      (p) => p.id === selectedProject.id,
    );
    if (currentIndex === -1) return;
    if (currentIndex < activeProjects.length - 1) {
      setSelectedProject(activeProjects[currentIndex + 1]);
    } else {
      setSelectedProject(activeProjects[0]);
    }
  };

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Flip Book Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Reset page when project changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(1);
  }, [selectedProject?.id]);

  const spreads = useMemo(() => {
    if (!selectedProject) return [];
    
    const sp: any[] = [];
    
    // Spread 0: Front Cover (Single Page)
    sp.push({ id: 'front-cover', type: 'front-cover' });
    
    // Parse Markdown and Architecture
    const mdParts = (selectedProject.markdown || '')
      .split('---')
      .map((p: string) => p.trim())
      .filter(Boolean);

    const architectures = selectedProject.systemArchitectures || [];
    const schemas = selectedProject.projectDatabaseSchemas || [];
    const erds = selectedProject.projectErds || [];

    // Flatten ALL interior pages into a single continuous array
    // This prevents any blank pages in the middle of the book
    const interiorPages: any[] = [];
    
    interiorPages.push({ type: 'details' });
    interiorPages.push({ type: 'tech-stack' });

    // Add all markdown pages
    mdParts.forEach((content: string, i: number) => {
        interiorPages.push({ type: 'markdown', content, index: i, total: mdParts.length });
    });

    // Add all architecture pages
    architectures.forEach((arch: any, i: number) => {
        interiorPages.push({ type: 'architecture', content: arch, index: i, total: architectures.length });
    });

    // Add all schema pages
    schemas.forEach((schema: any, i: number) => {
        interiorPages.push({ type: 'schema', content: schema, index: i, total: schemas.length });
    });

    // Add all ERD pages
    erds.forEach((erd: any, i: number) => {
        interiorPages.push({ type: 'erd', content: erd, index: i, total: erds.length });
    });

    // Add tail pages
    interiorPages.push({ type: 'lifecycle' });
    interiorPages.push({ type: 'related' });

    // Pair interiorPages into spreads (2 pages per spread)
    for (let i = 0; i < interiorPages.length; i += 2) {
       sp.push({
         id: `spread-dynamic-${i}`,
         type: 'spread',
         left: interiorPages[i],
         right: interiorPages[i + 1] || null // If null, it will just render a blank page (only possible at the very end)
       });
    }

    // Spread Last: Back Cover (Single Page)
    sp.push({ id: 'back-cover', type: 'back-cover' });
    
    return sp;
  }, [selectedProject]);

  const paginate = (newDirection: number) => {
    const nextIndex = currentPage + newDirection;
    if (nextIndex >= 0 && nextIndex < spreads.length) {
      setDirection(newDirection);
      setCurrentPage(nextIndex);
    } else if (nextIndex < 0) {
      onPrevProject();
    } else if (nextIndex >= spreads.length) {
      onNextProject();
    }
  };

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
  }, [selectedProject, currentPage, spreads.length]);

  const pageVariants: any = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      transition: { rotateY: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 }, opacity: { duration: 0.25, ease: "easeOut" } }
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 60 : -60,
      opacity: 0,
      transition: { rotateY: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 }, opacity: { duration: 0.25, ease: "easeIn" } }
    })
  };

    const renderInteriorSection = (data: any) => {
    if (!selectedProject || !data) return null;
    const { type, content, index, total } = data;

    switch (type) {
      case 'details':
        return <ProjectDetailsPage selectedProject={selectedProject} />;
      case 'tech-stack':
        return <ProjectTechStackPage selectedProject={selectedProject} getTechIconAndColor={getTechIconAndColor} activeProjects={activeProjects} />;
      case 'markdown':
        return <ProjectMarkdownPage content={content} index={index} total={total} copiedCode={copiedCode} setCopiedCode={setCopiedCode} />;
      case 'architecture':
        return <ProjectArchitecturePage content={content} index={index} total={total} selectedProject={selectedProject} isDark={isDark} />;
      case 'lifecycle':
        return <ProjectLifecyclePage selectedProject={selectedProject} />;
      case 'schema':
        return <ProjectSchemaPage content={content} index={index} total={total} />;
      case 'erd':
        return <ProjectErdPage content={content} index={index} total={total} />;
      case 'related':
        return <ProjectRelatedPage selectedProject={selectedProject} activeProjects={activeProjects} onSelectProject={onSelectProject} />;
      default: return null;
    }
  };

const renderSpreadContent = (spread: any) => {
    if (!selectedProject) return null;

    if (spread.type === 'front-cover') {
      return (
        <div className="w-full h-full flex flex-col relative bg-zinc-900 rounded-r-[2rem] rounded-l-md overflow-hidden shadow-2xl border-l-4 border-l-black/50 border-y border-r border-white/10">
           <div 
             className={cn(
               "absolute inset-0 z-0",
               !selectedProject.coverColor?.startsWith("#") && !selectedProject.coverColor?.startsWith("rgb") ? selectedProject.coverColor : ""
             )}
             style={{
               ...(selectedProject.coverColor?.startsWith("#") || selectedProject.coverColor?.startsWith("rgb") ? { backgroundColor: selectedProject.coverColor } : {})
             }}
           >
             <img src={selectedProject.technicalImagery?.featured || TECHNICAL_IMAGERY[selectedProject.id]?.featured || TECHNICAL_IMAGERY["auraflow-ai"]?.featured} alt="Cover" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
           </div>
           
           <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center border-[6px] border-white/5 m-6 rounded-2xl backdrop-blur-[2px]">
             <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-white tracking-[0.2em] uppercase mb-6 shadow-sm border border-white/20">
               {selectedProject.category}
             </span>
             <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight mb-4 drop-shadow-2xl leading-[1.1] uppercase">
               {selectedProject.title}
             </h1>
             <div className="w-12 h-1 bg-neu-accent my-6 rounded-full shadow-[0_0_15px_rgba(var(--color-neu-accent),0.6)]"></div>
             <p className="text-xs md:text-sm text-white/80 font-mono italic max-w-[250px] drop-shadow-md leading-relaxed">
               {selectedProject.subtitle}
             </p>

             <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
               <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] mb-1">Author</span>
               <span className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-[0.2em]">Awaluddin</span>
             </div>
           </div>
           
           {/* Book Spine Edge effect on the left side of the front cover */}
           <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none"></div>
           <div className="absolute left-[6px] top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none"></div>
        </div>
      );
    }

    if (spread.type === 'back-cover') {
       return (
        <div className="w-full h-full flex flex-col relative bg-zinc-950 rounded-l-[2rem] rounded-r-md overflow-hidden shadow-2xl border-r-4 border-r-black/50 border-y border-l border-white/5">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen-2.png')] opacity-30 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
           
           <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-center">
              <div className="mb-12 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-xl">
                <Quote size={20} className="text-neu-accent mb-4 mx-auto opacity-60" />
                <p className="text-[11px] md:text-xs text-white/60 font-mono italic leading-relaxed max-w-[220px]">
                  "Software is a great combination between artistry and engineering. Every line of code is a brushstroke."
                </p>
              </div>

              <div className="w-32 h-14 bg-white/90 rounded-sm mb-4 flex flex-col justify-around px-2 py-1.5 relative shadow-inner">
                {/* Fake Barcode */}
                <div className="flex gap-[1px] items-stretch h-full opacity-80 justify-center">
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className="bg-black" style={{ width: secureMathRandom() > 0.5 ? '2px' : '4px', height: '100%', opacity: secureMathRandom() > 0.2 ? 1 : 0 }}></div>
                  ))}
                </div>
              </div>
              <span className="text-[7px] font-mono text-white/30 tracking-[0.4em]">ISBN 978-AWAL-PORTFOLIO</span>
           </div>

           {/* Book Spine Edge effect on the right side of the back cover */}
           <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/70 via-black/20 to-transparent pointer-events-none"></div>
           <div className="absolute right-[6px] top-0 bottom-0 w-[1px] bg-white/10 pointer-events-none"></div>
        </div>
       );
    }

    // Interior Spread (Double Page)
    return (
      <div className="w-full h-full flex flex-col md:flex-row bg-[#f8f9fa] dark:bg-[#1a1b1e] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-2xl relative text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
        
        {/* Left Page */}
        <div className="flex-1 h-1/2 md:h-full overflow-y-auto custom-scrollbar p-6 md:p-10 relative bg-gradient-to-r from-transparent to-black/5 dark:to-black/30 border-b border-b-black/10 md:border-b-0">
          {renderInteriorSection(spread.left)}
          <div className="hidden md:flex absolute bottom-4 left-8 right-8 items-center justify-between text-[9px] font-mono text-black/30 dark:text-white/30">
            <span>{currentPage * 2 - 1}</span>
            <span className="uppercase tracking-widest opacity-70 truncate max-w-[200px]">{selectedProject.title}</span>
          </div>
        </div>

        {/* Center Crease (Visible only on Desktop) */}
        <div className="hidden md:block w-[2px] h-full bg-black/10 dark:bg-black/60 relative z-20 shrink-0">
          <div className="absolute top-0 bottom-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-transparent via-black/10 dark:via-black/50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/10 dark:from-black/40 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/10 dark:from-black/40 to-transparent pointer-events-none"></div>
        </div>

        {/* Right Page */}
        <div className="flex-1 h-1/2 md:h-full overflow-y-auto custom-scrollbar p-6 md:p-10 relative bg-gradient-to-l from-transparent to-black/5 dark:to-black/30">
          {renderInteriorSection(spread.right)}
          <div className="hidden md:flex absolute bottom-4 left-8 right-8 items-center justify-between text-[9px] font-mono text-black/30 dark:text-white/30">
            <span className="uppercase tracking-widest opacity-70 truncate max-w-[200px]">{selectedProject.title}</span>
            <span>{currentPage * 2}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedProject) return null;

  // Determine container width based on current spread type
  const isSinglePage = spreads[currentPage]?.type === 'front-cover' || spreads[currentPage]?.type === 'back-cover';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Main Book Container */}
        <motion.div
          layout
          initial={{ scale: 0.8, rotateX: 10, y: 50, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, rotateX: -10, y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={cn(
            "w-full h-[85vh] max-h-[850px] relative perspective-[2000px] flex items-center justify-center transition-all duration-500",
            isSinglePage ? "max-w-[380px] md:max-w-[550px] aspect-[2/3] md:aspect-[1/1.4]" : "max-w-[380px] md:max-w-[1100px]"
          )}
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
              className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-neu-bg/90 shadow-neu-sm text-neu-text hover:text-neu-accent hover:scale-110 active:scale-95 transition-all z-50 border border-neu-text/10"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {currentPage < spreads.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
              className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-neu-bg/90 shadow-neu-sm text-neu-text hover:text-neu-accent hover:scale-110 active:scale-95 transition-all z-50 border border-neu-text/10"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* The Book Container */}
          <div className="w-full h-full relative preserve-3d">
             <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ 
                    transformOrigin: direction > 0 ? "left center" : "right center",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden"
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  {renderSpreadContent(spreads[currentPage])}
                </motion.div>
             </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

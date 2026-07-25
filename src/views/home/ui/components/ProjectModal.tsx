import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Globe, Github, 
  Terminal, Lightbulb, Target, FileText, Network, Layers, Sparkles 
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import ReactMarkdown from 'react-markdown';
import MermaidDiagram from '@/shared/ui/MermaidDiagram';
import ProjectLifecycleTracker from '@/entities/project/ui/ProjectLifecycleTracker';
import ProjectArchitectureDiagram from '@/entities/project/ui/ProjectArchitectureDiagram';

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
  getTechIconAndColor: (tag: string) => { color: string; icon: React.ReactNode };
  getTagProjectCount: (tag: string) => number;
  TECHNICAL_IMAGERY: Record<string, any>;
}

export default function ProjectModal({
  selectedProject,
  onClose,
  onPrevProject,
  onNextProject,
  onSelectProject,
  isBannerMinimized,
  setIsBannerMinimized,
  isDark,
  getRelatedProjects,
  getTechIconAndColor,
  getTagProjectCount,
  TECHNICAL_IMAGERY
}: ProjectModalProps) {
  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Left Desktop Arrow Button */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevProject();
              }}
              className="p-4 rounded-full bg-neu-bg/90 backdrop-blur-md shadow-neu hover:shadow-neu-sm text-neu-text-muted hover:text-neu-accent hover:scale-110 active:scale-95 transition-all border border-white/5"
              title="Previous Volume (Left Arrow)"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Right Desktop Arrow Button */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextProject();
              }}
              className="p-4 rounded-full bg-neu-bg/90 backdrop-blur-md shadow-neu hover:shadow-neu-sm text-neu-text-muted hover:text-neu-accent hover:scale-110 active:scale-95 transition-all border border-white/5"
              title="Next Volume (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <motion.div
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(event, info) => {
              const swipeThreshold = 70;
              if (info.offset.x < -swipeThreshold) {
                onNextProject();
              } else if (info.offset.x > swipeThreshold) {
                onPrevProject();
              }
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <motion.div
                  animate={{
                    padding: isBannerMinimized ? "1.5rem 2rem" : "2rem 3rem",
                    height: isBannerMinimized ? "auto" : "auto",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={cn(
                    "relative overflow-hidden flex-shrink-0",
                    !selectedProject.coverColor?.startsWith('#') && !selectedProject.coverColor?.startsWith('rgb') ? selectedProject.coverColor : ""
                  )}
                  style={{
                    ...(selectedProject.coverColor?.startsWith('#') || selectedProject.coverColor?.startsWith('rgb') ? { backgroundColor: selectedProject.coverColor } : {})
                  }}
                >
                  {/* The High-Quality Unsplash Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={
                        TECHNICAL_IMAGERY[selectedProject.id]?.featured ||
                        TECHNICAL_IMAGERY["auraflow-ai"]?.featured
                      }
                      alt="Background Tech Grid"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25"></div>
                  </div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-15"></div>
                  <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBannerMinimized(!isBannerMinimized);
                      }}
                      className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors border border-white/10 shadow-sm"
                      title={
                        isBannerMinimized
                          ? "Expand Banner"
                          : "Minimize Banner"
                      }
                    >
                      {isBannerMinimized ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronUp size={20} />
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors border border-white/10 shadow-sm"
                      title="Close"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Navigation helper hint */}
                  <div
                    className={cn(
                      "absolute top-6 hidden md:flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-[10px] font-mono text-white/80 select-none right-28",
                    )}
                  >
                    <span>Swipe or use Arrow keys to browse</span>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-mono font-medium text-white/90">
                      {selectedProject.category}
                    </span>
                    <span className="text-white/70 text-xs sm:text-sm font-mono">
                      {selectedProject.date}
                    </span>
                  </div>

                  <motion.h2
                    animate={{
                      fontSize: isBannerMinimized ? "1.5rem" : "3rem",
                      marginBottom: isBannerMinimized ? "0" : "0.5rem",
                    }}
                    className="font-display font-bold text-white relative z-10 tracking-tight"
                  >
                    {selectedProject.title}
                  </motion.h2>

                  <AnimatePresence>
                    {!isBannerMinimized && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {/* Horizontal Tech Stack Row */}
                        <div className="relative z-10 flex flex-wrap gap-2.5 mb-4 mt-3">
                          {(selectedProject.tags || []).map((tag: string) => {
                            const { color, icon } = getTechIconAndColor(tag);
                            const count = getTagProjectCount(tag);
                            return (
                              <div
                                key={tag}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-sm text-xs font-mono font-medium text-white/95 hover:bg-black/50 hover:border-white/20 transition-all cursor-default select-none hover:scale-[1.03]"
                              >
                                <span className={cn("flex-shrink-0", color)}>
                                  {icon}
                               </span>
                                <span>{tag}</span>
                                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                  +{count} project{count > 1 ? "s" : ""} exp
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <p className="text-sm sm:text-base md:text-lg text-white/80 font-light max-w-2xl relative z-10">
                          {selectedProject.subtitle}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {/* Modal Content */}
                <div
                  tabIndex={0}
                  className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neu-accent focus-visible:ring-inset"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-neu-text/10">
                    <div className="flex flex-wrap gap-2">
                      {(selectedProject.tags || []).map((tag: string) => {
                        const count = getTagProjectCount(tag);
                        return (
                          <span
                            key={tag}
                            className="px-4 py-2 glass-card-sm text-neu-text rounded-xl text-xs font-mono font-medium flex items-center gap-2 hover:scale-[1.02] transition-transform"
                          >
                            {tag}{" "}
                            <span className="text-neu-accent font-bold text-[10px]">
                              +{count} project experience
                            </span>
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {(selectedProject as any).demoUrl && (
                        <a
                          href={(selectedProject as any).demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neu-accent hover:bg-neu-accent/90 text-white rounded-xl font-mono text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                        >
                          <Globe size={16} /> View Live Demo
                        </a>
                      )}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neu-bg hover:bg-neu-base text-neu-text rounded-xl font-mono text-xs sm:text-sm font-bold shadow-neu-sm border border-neu-text/10 transition-all active:scale-95"
                        >
                          <Github size={16} /> Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-12">
                    {/* Project Impact & Metrics (Moved to top for high visibility) */}
                    {selectedProject.stats &&
                      selectedProject.stats.length > 0 && (
                        <div className="w-full">
                          <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Terminal size={14} /> Key Impact & Metrics
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(selectedProject.stats || []).map(
                              (stat: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-5 rounded-2xl glass-card flex flex-col justify-between items-start text-left border border-white/5 hover:shadow-neu-sm transition-all hover:-translate-y-1"
                                >
                                  <span className="text-2xl sm:text-3xl font-bold font-display text-neu-text tracking-tight mb-1">
                                    {stat.value}
                                  </span>
                                  <span className="text-xs font-mono text-neu-text-muted">
                                    {stat.label}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    <div className="w-full pt-8">
                      {/* New Sections: Reason to Build & Business Problem */}
                      {(selectedProject.reasonToBuild ||
                        selectedProject.problemSolved) && (
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                          {selectedProject.reasonToBuild && (
                            <div className="flex-1 bg-neu-bg p-6 rounded-3xl shadow-neu-inset border border-white/5">
                              <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Lightbulb
                                  size={14}
                                  className="text-neu-accent"
                                />{" "}
                                Why I Built This
                              </h4>
                              <p className="text-neu-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedProject.reasonToBuild}
                              </p>
                            </div>
                          )}
                          {selectedProject.problemSolved && (
                            <div className="flex-1 bg-neu-bg p-6 rounded-3xl shadow-neu-inset border border-white/5">
                              <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Target
                                  size={14}
                                  className="text-neu-accent"
                                />{" "}
                                Business Problem Solved
                              </h4>
                              <p className="text-neu-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                                {selectedProject.problemSolved}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* System Specifications Markdown block */}
                      <div
                        className="prose prose-slate max-w-none font-sans
                          prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neu-text
                          prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-neu-text/10 prose-h2:pb-2
                          prose-p:text-neu-text-muted prose-p:leading-relaxed
                          prose-a:text-neu-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                          prose-li:text-neu-text-muted prose-strong:text-neu-text"
                      >
                        <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-4 flex items-center gap-2">
                          <FileText size={14} className="text-neu-accent" />{" "}
                          System Specifications & In-depth Overview
                        </h4>
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );

                              // Custom high-fidelity inline highlighting logic for the project spec sheets
                              const highlightCode = (
                                code: string,
                                lang: string,
                              ) => {
                                if (!code) return "";
                                // Escape HTML tags to prevent rendering issues
                                let html = code
                                  .replace(/&/g, "&amp;")
                                  .replace(/</g, "&lt;")
                                  .replace(/>/g, "&gt;")
                                  .replace(/"/g, "&quot;")
                                  .replace(/'/g, "&#039;");

                                // Apply custom theme colors to the code block tokens
                                const keywords =
                                  /\b(const|let|var|function|return|import|export|from|class|extends|if|else|for|while|async|await|try|catch|def|elif|print|public|private|protected|interface|new|this|package|void|string|number|boolean|any|type|implements)\b/g;
                                html = html.replace(
                                  keywords,
                                  '<span class="text-purple-400 dark:text-purple-400 font-medium">$1</span>',
                                );

                                const strings = /(["'`])(.*?)\1/g;
                                html = html.replace(
                                  strings,
                                  '<span class="text-emerald-400 dark:text-emerald-400">$1$2$1</span>',
                                );

                                const comments = /(\/\/.*|#.*)/g;
                                html = html.replace(
                                  comments,
                                  '<span class="text-zinc-500 italic">$1</span>',
                                );

                                const numbers = /\b(\d+)\b/g;
                                html = html.replace(
                                  numbers,
                                  '<span class="text-amber-400 dark:text-amber-400">$1</span>',
                                );

                                const builtins =
                                  /\b(console|log|error|window|document|process|env|true|false|null|undefined)\b/g;
                                html = html.replace(
                                  builtins,
                                  '<span class="text-rose-400 dark:text-rose-400 font-medium">$1</span>',
                                );

                                return html;
                              };

                              return match ? (
                                // Mermaid diagram — rendered as interactive SVG
                                match[1] === "mermaid" ? (
                                  <MermaidDiagram
                                    key={String(children)}
                                    chart={String(children).replace(
                                      /\n$/,
                                      "",
                                    )}
                                  />
                                ) : (
                                  <div className="relative group/code my-6 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-zinc-950 dark:bg-black/40">
                                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 dark:bg-zinc-900/20 border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                      <span>{match[1]}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            String(children),
                                          );
                                        }}
                                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                                      >
                                        Copy
                                      </button>
                                    </div>
                                    <pre className="p-5 overflow-x-auto font-mono text-sm leading-relaxed text-zinc-300 select-text bg-transparent m-0">
                                      <code
                                        className={`language-${match[1]}`}
                                        dangerouslySetInnerHTML={{
                                          __html: highlightCode(
                                            String(children).replace(
                                              /\n$/,
                                              "",
                                            ),
                                            match[1],
                                          ),
                                        }}
                                      />
                                    </pre>
                                  </div>
                                )
                              ) : (
                                <code
                                  className={cn(
                                    "bg-neutral-200 dark:bg-zinc-850 text-neu-text px-1.5 py-0.5 rounded text-xs font-mono font-medium",
                                    className,
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {selectedProject.markdown}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <div className="w-full pt-8">
                      {/* Right Column (Sidebar with Key metrics, visual blueprints, lifecycle tracker) */}
                      <div className="mb-10 p-6 md:p-8 rounded-3xl glass-card-inset border border-gray-300/10 relative overflow-hidden transition-all duration-300">
                        {/* Vertical Project Lifecycle Tracker */}
                        <div className="w-full bg-neu-bg p-6 md:p-8 rounded-3xl shadow-neu-inset">
                          <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Network size={14} /> Project Lifecycle
                          </h4>
                          <ProjectLifecycleTracker
                            projectId={selectedProject.id}
                            spineColor={selectedProject.spineColor}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Architecture Diagram */}
                    <div className="w-full pt-8">
                      <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Layers size={14} /> System Architecture
                      </h4>
                      <ProjectArchitectureDiagram
                        project={selectedProject}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  {/* Related Projects Section */}
                  <div className="mt-12 pt-8 border-t border-gray-300/30 dark:border-gray-700/30">
                    <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider mb-5 flex items-center gap-2">
                      <Sparkles size={14} className="animate-pulse" /> Related
                      Volumes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {getRelatedProjects(selectedProject).map((proj) => (
                        <div
                          key={proj.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(proj);
                          }}
                          className="p-5 rounded-2xl glass-card hover:shadow-neu-sm border border-gray-300/10 dark:border-zinc-800 cursor-pointer group hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-4 text-left"
                        >
                          <div
                            className={cn(
                              "w-10 h-14 rounded-md shadow-md flex-shrink-0 flex items-center justify-center relative border border-white/20",
                              proj.spineColor,
                            )}
                          >
                            <span className="absolute text-[6px] font-mono font-bold text-white/80 whitespace-nowrap overflow-hidden text-ellipsis w-10 text-center transform -rotate-90">
                              {proj.title}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-neu-accent font-bold uppercase tracking-wider block">
                              {proj.category}
                            </span>
                            <h5 className="text-sm font-bold text-neu-text truncate mt-0.5 group-hover:text-neu-accent transition-colors">
                              {proj.title}
                            </h5>
                            <p className="text-xs text-neu-text-muted truncate">
                              {proj.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

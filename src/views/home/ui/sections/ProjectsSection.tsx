import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Filter, ChevronLeft, ChevronRight, Code2, ArrowLeft } from 'lucide-react';
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";
import { cn } from '@/shared/lib/utils';
import BookItem from '@/entities/project/ui/BookItem';
import MobileFilterModal from '../components/MobileFilterModal';

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
  focusedProject: any;
  dynamicHeroConfig: any;
  triggerToast: (msg: string) => void;
  shelfRef: any;
  activeProjects: any[];
  selectedProject: any;
  isBannerMinimized: boolean;
  setIsBannerMinimized: (b: boolean) => void;
  isLoading: boolean;
  scrollShelf: (dir: "left" | "right") => void;
}


const LoadingState = () => (
  <div className="relative z-10 flex gap-6 overflow-hidden py-10 px-2 justify-center sm:justify-start">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="w-16 md:w-20 h-64 md:h-80 rounded-lg bg-gray-300/30 dark:bg-zinc-700/40 animate-pulse border border-white/5 relative shadow-neu flex flex-col justify-between p-3"
      >
        <div className="space-y-1.5">
          <div className="w-full h-1 bg-black/5 rounded-full"></div>
          <div className="w-full h-1 bg-black/5 rounded-full"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-2.5 h-32 bg-gray-300/40 dark:bg-zinc-700/50 rounded-full"></div>
        </div>
        <div className="w-full h-3 bg-gray-300/40 dark:bg-zinc-700/50 rounded-md"></div>
      </div>
    ))}
  </div>
);

const EmptyState = ({
  searchQuery,
  selectedCategory,
  setSearchQuery,
  setSelectedCategory,
  triggerToast
}: any) => (
  <div className="py-16 px-4 text-center max-w-md mx-auto relative z-10">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center justify-center w-16 h-16 rounded-3xl glass-card text-neu-accent/60 mb-6 border border-white/5"
    >
      <Search size={28} />
    </motion.div>
    <h3 className="text-lg font-display font-bold text-neu-text tracking-tight mb-2">
      No matching projects found
    </h3>
    <p className="text-xs md:text-sm text-neu-text-muted font-light mb-6 leading-relaxed">
      We couldn&apos;t find any projects matching{" "}
      <span className="font-mono font-semibold text-neu-accent">
        &ldquo;{searchQuery}&rdquo;
      </span>
      {selectedCategory
        ? ` in category &ldquo;${selectedCategory}&rdquo;`
        : ""}
      . Try checking for typos or simplifying your search query.
    </p>
    <button
      onClick={() => {
        setSearchQuery("");
        setSelectedCategory(null);
        triggerToast("Filters reset: Showing all projects");
      }}
      className="px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-neu-accent shadow-neu hover:shadow-neu-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
    >
      Clear All Filters
    </button>
  </div>
);

const ProjectList = ({
  filteredProjects,
  shelfRef,
  setSelectedProject,
  setFocusedProject,
  isDark,
  getTagProjectCount
}: any) => (
  <motion.div
    layout
    ref={shelfRef}
    className="flex overflow-x-auto snap-x snap-mandatory gap-x-8 items-end justify-start min-h-[440px] pb-6 pt-16 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-[12.5vw] md:px-10"
  >
    <AnimatePresence mode="popLayout">
      {filteredProjects.map((project: any) => (
        <BookItem
          key={project.id}
          project={project}
          setSelectedProject={setSelectedProject}
          setFocusedProject={setFocusedProject}
          isDark={isDark}
          getTagProjectCount={getTagProjectCount}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);

const FocusedProject = ({
  focusedProject,
  setSelectedProject,
  setFocusedProject,
  dynamicHeroConfig,
  getTechIconAndColor,
  getTagProjectCount
}: any) => (
  <div className="relative py-8 md:py-12 px-4 md:px-8 z-20 flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-16">
    <div className="absolute inset-0 bg-black/5 dark:bg-black/30 backdrop-blur-md rounded-3xl z-0 pointer-events-none"></div>
    <div
      className={cn(
        "absolute -inset-10 opacity-15 blur-[120px] rounded-full z-0 pointer-events-none transition-all duration-500",
        !focusedProject.spineColor?.startsWith('#') && !focusedProject.spineColor?.startsWith('rgb') ? focusedProject.spineColor : ""
      )}
      style={{
        ...(focusedProject.spineColor?.startsWith('#') || focusedProject.spineColor?.startsWith('rgb') ? { backgroundColor: focusedProject.spineColor } : {})
      }}
    ></div>

    <div
      className="relative z-10 flex-shrink-0 flex items-center justify-center w-[280px] md:w-[320px] h-[340px] md:h-[400px]"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        initial={{
          scale: 0.8,
          rotateY: -35,
          rotateX: 12,
          rotateZ: -6,
          opacity: 0,
        }}
        animate={{
          scale: 1.05,
          rotateY: -18,
          rotateX: 8,
          rotateZ: -4,
          opacity: 1,
        }}
        whileHover={{
          rotateY: -8,
          rotateX: 4,
          rotateZ: -2,
          scale: 1.12,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
        className="relative cursor-pointer group flex items-center justify-center"
        onClick={() => setSelectedProject(focusedProject)}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute left-[12px] top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent z-40 pointer-events-none" />

        <div
          className="absolute right-[-8px] top-[4px] bottom-[4px] w-[10px] bg-stone-100 dark:bg-zinc-800 border-y border-r border-stone-300 dark:border-zinc-700/60 rounded-r shadow-md z-10"
          style={{
            transform: "skewY(6deg)",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.08) 2px, rgba(0, 0, 0, 0.08) 3px)",
          }}
        />

        <div
          className={cn(
            "w-[200px] md:w-[240px] h-[280px] md:h-[340px] rounded-r-xl shadow-2xl relative flex flex-col justify-between p-6 border-y border-r border-white/20 overflow-hidden z-20",
            !(focusedProject.coverColor || focusedProject.spineColor)?.startsWith('#') && !(focusedProject.coverColor || focusedProject.spineColor)?.startsWith('rgb') ? (focusedProject.coverColor || focusedProject.spineColor) : ""
          )}
          style={{
            ...((focusedProject.coverColor || focusedProject.spineColor)?.startsWith('#') || (focusedProject.coverColor || focusedProject.spineColor)?.startsWith('rgb') ? { backgroundColor: focusedProject.coverColor || focusedProject.spineColor } : {})
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10 pointer-events-none z-10" />

          <div className="relative z-20 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-white/70 uppercase">
                {focusedProject.category}
              </span>
              <span className="text-[8px] font-mono text-white/50">
                {focusedProject.date}
              </span>
            </div>

            <div className="my-auto py-2">
              <h4 className="text-lg md:text-xl font-display font-black text-white tracking-tight leading-snug drop-shadow-md">
                {focusedProject.title}
              </h4>
              <p className="text-[10px] md:text-xs text-white/80 font-mono mt-1.5 font-medium italic line-clamp-2 leading-relaxed">
                {focusedProject.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/15">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-white/40 tracking-wider uppercase">
                  Author
                </span>
                <span className="text-[9px] font-mono font-bold text-white/80 leading-none">
                  {dynamicHeroConfig?.name?.toUpperCase() || "AWALUDDIN"}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/20 border border-white/10 text-white/80">
                <Code2 size={12} />
              </div>
            </div>
          </div>

          <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-black/25 z-30" />
          <div className="absolute left-[4px] top-0 bottom-0 w-[1px] bg-white/10 z-30" />
          <div className="absolute top-0 right-4 w-3 h-8 bg-red-500 shadow-md origin-top transform translate-y-[-4px] z-10 rounded-b" />
        </div>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.15 }}
      className="relative z-10 flex-1 max-w-xl p-6 md:p-8 rounded-3xl bg-neu-bg/90 dark:bg-zinc-900/80 backdrop-blur-lg border border-gray-300/25 dark:border-zinc-700/30 shadow-neu flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 glass-card-inset rounded-xl text-xs font-mono font-bold text-neu-accent uppercase tracking-wider">
            {focusedProject.category}
          </span>
          <span className="text-neu-text-muted text-xs font-mono">
            {focusedProject.date}
          </span>
        </div>

        <h3 className="text-2xl md:text-4xl font-display font-bold text-neu-text tracking-tight mb-3">
          {focusedProject.title}
        </h3>

        <p className="text-sm md:text-base text-neu-text-muted font-light mb-6">
          {focusedProject.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(focusedProject.tags || []).map((tag: string) => {
            const { color, icon } = getTechIconAndColor(tag);
            const count = getTagProjectCount(tag);
            return (
              <div
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card-inset text-[10px] font-mono font-semibold text-neu-text-muted hover:scale-[1.02] transition-transform"
              >
                <span className={cn("flex-shrink-0", color)}>{icon}</span>
                <span>{tag}</span>
                <span className="text-neu-accent font-bold text-[9px] ml-1 bg-neu-accent/5 px-1 rounded-md">
                  +{count} project{count > 1 ? "s" : ""} experience
                </span>
              </div>
            );
          })}
        </div>

        {focusedProject.stats && focusedProject.stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            {(focusedProject.stats || []).map((stat: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-2xl glass-card-inset flex flex-col sm:flex-col justify-center items-center text-center"
              >
                <span className="text-base md:text-lg font-bold font-display text-neu-text tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm sm:text-[9px] font-mono text-neu-text-muted mt-1 leading-none">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mt-2">
        <button
          onClick={() => setSelectedProject(focusedProject)}
          className="w-full sm:flex-1 py-4 sm:py-3.5 px-5 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm sm:text-xs text-center flex items-center justify-center gap-2"
        >
          <BookOpen size={16} className="sm:w-3.5 sm:h-3.5" /> Open Full Dev Log
        </button>
        <button
          onClick={() => setFocusedProject(null)}
          className="w-full sm:w-auto py-4 sm:py-3.5 px-6 rounded-xl font-bold text-neu-text glass-card hover:shadow-neu-sm active:scale-95 transition-all text-sm sm:text-xs text-center flex items-center justify-center gap-2 border border-gray-300/10"
        >
          <ArrowLeft size={16} className="sm:w-3.5 sm:h-3.5" /> Exit Spotlight
        </button>
      </div>
    </motion.div>
  </div>
);

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
  isDark,
  focusedProject,
  dynamicHeroConfig,
  triggerToast,
  shelfRef,
  isLoading,
  scrollShelf
}: ProjectsSectionProps) {

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (focusedProject) return <FocusedProject focusedProject={focusedProject} setSelectedProject={setSelectedProject} setFocusedProject={setFocusedProject} dynamicHeroConfig={dynamicHeroConfig} getTechIconAndColor={getTechIconAndColor} getTagProjectCount={getTagProjectCount} />;
    if (filteredProjects.length === 0) return <EmptyState searchQuery={searchQuery} selectedCategory={selectedCategory} setSearchQuery={setSearchQuery} setSelectedCategory={setSelectedCategory} triggerToast={triggerToast} />;
    return <ProjectList filteredProjects={filteredProjects} shelfRef={shelfRef} setSelectedProject={setSelectedProject} setFocusedProject={setFocusedProject} isDark={isDark} getTagProjectCount={getTagProjectCount} />;
  };

  return (
    <>
        {/* Projects Section with Intersection Observer Animations */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Section Heading */}
          <div className="max-w-7xl mx-auto mb-10">
            <div className="flex items-center gap-2 text-neu-accent mb-1">
              <BookOpen size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                Featured Portfolio & Works
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              Projects
            </h2>
            <p className="text-xs text-neu-text-muted font-mono mt-1">
              ✦ Interactive archive of production applications, system APIs, and
              developer tools.
            </p>
          </div>

          {/* Controls: Search & Filter */}
          <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neu-text-muted group-focus-within:text-neu-accent transition-colors z-10">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 rounded-xl glass-card-inset text-neu-text placeholder-neu-text-muted focus:outline-none focus:ring-0 sm:text-sm transition-all"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 items-center justify-between md:justify-end w-full md:w-auto">
              {/* Desktop Filter */}
              <div className="hidden md:flex flex-wrap gap-3 bg-neu-bg p-1.5 rounded-2xl shadow-neu-inset">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all relative",
                    !selectedCategory
                      ? "text-neu-accent font-bold"
                      : "text-neu-text-muted hover:text-neu-text",
                  )}
                >
                  {!selectedCategory && (
                    <motion.div
                      layoutId="activeCategoryDesktop"
                      className="absolute inset-0 glass-card rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">All</span>
                </button>
                {(categories || []).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all relative",
                      selectedCategory === cat
                        ? "text-neu-accent font-bold"
                        : "text-neu-text-muted hover:text-neu-text",
                    )}
                  >
                    {selectedCategory === cat && (
                      <motion.div
                        layoutId="activeCategoryDesktop"
                        className="absolute inset-0 glass-card rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative group/sort flex-shrink-0 flex-1 md:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none w-full md:w-auto pl-4 pr-10 py-3 rounded-xl glass-card text-neu-text text-xs font-mono cursor-pointer focus:outline-none transition-all hover:text-neu-accent text-center md:text-left"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option
                    value="newest"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: Newest
                  </option>
                  <option
                    value="oldest"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: Oldest
                  </option>
                  <option
                    value="alphabetical"
                    className="bg-white dark:bg-black text-neu-text"
                  >
                    Order: A-Z
                  </option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neu-text-muted">
                  <span className="text-[9px]">▼</span>
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="md:hidden flex items-center justify-center p-3 rounded-xl glass-card text-neu-text-muted hover:text-neu-accent transition-colors"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Filter Modal */}
          <MobileFilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />

          {/* Bookshelf Layout */}
          <div id="projects" className="max-w-7xl mx-auto scroll-mt-24">
            <div className="bg-neu-bg p-4 sm:p-8 md:p-12 rounded-3xl shadow-neu-inset relative overflow-hidden">
              {/* Centered Bookshelf Projects Title inside, matching book spine font but bold */}
              <div className="flex justify-center items-center gap-2 mb-10 relative z-20">
                <h3 className="text-sm sm:text-base md:text-lg font-mono font-bold tracking-[0.25em] text-neu-text uppercase text-center border-b border-gray-300/40 dark:border-zinc-800/40 pb-2 flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className="text-neu-accent animate-pulse"
                  />{" "}
                  My Bookshelf Projects
                </h3>
              </div>
              {/* Wooden Shelf Aesthetic Details */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/10 to-transparent opacity-50 z-10"></div>

              {/* Scroll Buttons */}
              {!isLoading && !focusedProject && filteredProjects.length > 0 && (
                <>
                  <button
                    onClick={() => scrollShelf("left")}
                    className="absolute left-4 top-[45%] -translate-y-1/2 z-20 p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5"
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scrollShelf("right")}
                    className="absolute right-4 top-[45%] -translate-y-1/2 z-20 p-3.5 rounded-full glass-card hover:shadow-neu-sm transition-all text-neu-text-muted hover:text-neu-accent active:scale-95 flex items-center justify-center border border-white/5"
                    aria-label="Scroll Right"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {renderContent()}

              {/* The visual "shelf" plank */}
              <div className="w-full h-4 glass-card mt-4 rounded-xl relative z-0"></div>
            </div>
          </div>
        </motion.div>

        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider 
          icon={BookOpen} 
          quote="A shelf built from real problems, late nights, and systems that had to work." 
        />
    </>
  );
}
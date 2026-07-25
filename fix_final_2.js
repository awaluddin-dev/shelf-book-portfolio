const fs = require('fs');

// 1. ProjectsSection
let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace("import { BookOpen, Search, Wrench, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';",
  "import { BookOpen, Search, Wrench, ChevronDown, Filter, ChevronLeft, ChevronRight, Code2, ArrowLeft } from 'lucide-react';");

projCode = projCode.replace('}\n\nexport default function ProjectsSection', `  focusedProject: any;\n  dynamicHeroConfig: any;\n  triggerToast: (msg: string) => void;\n  shelfRef: any;\n  activeProjects: any[];\n  selectedProject: any;\n  isBannerMinimized: boolean;\n  setIsBannerMinimized: (b: boolean) => void;\n  isLoading: boolean;\n  scrollShelf: (dir: "left" | "right") => void;\n}\n\nexport default function ProjectsSection`);

projCode = projCode.replace('  setFocusedProject,\n  isDark\n}: ProjectsSectionProps) {', `  setFocusedProject,\n  isDark,\n  focusedProject,\n  dynamicHeroConfig,\n  triggerToast,\n  shelfRef,\n  activeProjects,\n  selectedProject,\n  isBannerMinimized,\n  setIsBannerMinimized,\n  isLoading,\n  scrollShelf\n}: ProjectsSectionProps) {`);

// fix getTagProjectCount calls
projCode = projCode.replace(/getTagProjectCount\(tag, activeProjects\)/g, 'getTagProjectCount(tag)');
projCode = projCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={getTagProjectCount}');
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

// 2. ProficiencySection
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace('}\n\nexport default function ProficiencySection', `  activeProficiency: any[];\n  isLoading: boolean;\n  categoryScores: any;\n  overallScore: number;\n}\n\nexport default function ProficiencySection`);
profCode = profCode.replace('  isDark\n}: ProficiencySectionProps) {', `  isDark,\n  activeProficiency,\n  isLoading,\n  categoryScores,\n  overallScore\n}: ProficiencySectionProps) {`);
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

// 3. ExperienceSection
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace('}\n\nexport default function ExperienceSection', `  heatmapRef: any;\n  monthsData: any;\n  getContributionColor: (count: number) => string;\n  handleTooltipContent: (count: number, date: string) => string;\n  activeTestimonialIdx: number;\n  setActiveTestimonialIdx: (idx: number) => void;\n  setIsTestimonialHovered: (val: boolean) => void;\n  selectedLevelFilter: number | null;\n  setSelectedLevelFilter: (val: number | null) => void;\n  handleTouchStart: (date: string) => void;\n  handleTouchEnd: () => void;\n  handleTouchMove: () => void;\n  activeTooltipDate: string | null;\n  legendLevels: any[];\n  activeWork: any[];\n}\n\nexport default function ExperienceSection`);
expCode = expCode.replace('  setSelectedTestimonial\n}: ExperienceSectionProps) {', `  setSelectedTestimonial,\n  heatmapRef,\n  monthsData,\n  getContributionColor,\n  handleTooltipContent,\n  activeTestimonialIdx,\n  setActiveTestimonialIdx,\n  setIsTestimonialHovered,\n  selectedLevelFilter,\n  setSelectedLevelFilter,\n  handleTouchStart,\n  handleTouchEnd,\n  handleTouchMove,\n  activeTooltipDate,\n  legendLevels,\n  activeWork\n}: ExperienceSectionProps) {`);

// Types for map functions
expCode = expCode.replace(/\\(monthGroup, mIdx\\)/g, '(monthGroup: any, mIdx: number)');
expCode = expCode.replace(/\\(week, wIdxInMonth\\)/g, '(week: any, wIdxInMonth: number)');
expCode = expCode.replace(/\\(day\\) =>/g, '(day: any) =>');
expCode = expCode.replace(/\\(day, dIdx\\)/g, '(day: any, dIdx: number)');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 4. Update Home.tsx
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

homeCode = homeCode.replace(/<ProjectsSection([\\s\\S]*?)isDark=\\{isDark\\}/,
  '<ProjectsSection$1isDark={isDark}\\n        focusedProject={focusedProject}\\n        dynamicHeroConfig={dynamicHeroConfig}\\n        triggerToast={triggerToast}\\n        shelfRef={shelfRef}\\n        activeProjects={activeProjects}\\n        selectedProject={selectedProject}\\n        isBannerMinimized={isBannerMinimized}\\n        setIsBannerMinimized={setIsBannerMinimized}\\n        isLoading={isLoading}\\n        scrollShelf={scrollShelf}');
homeCode = homeCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={(t: string) => getTagProjectCount(t, activeProjects)}');

homeCode = homeCode.replace(/<ProficiencySection([\\s\\S]*?)isDark=\\{isDark\\}/, 
  '<ProficiencySection$1isDark={isDark}\\n        activeProficiency={activeProficiency}\\n        isLoading={isLoading}\\n        categoryScores={categoryScores}\\n        overallScore={overallScore}');

homeCode = homeCode.replace(/<ExperienceSection([\\s\\S]*?)setSelectedTestimonial=\\{setSelectedTestimonial\\}/, 
  '<ExperienceSection$1setSelectedTestimonial={setSelectedTestimonial}\\n        heatmapRef={heatmapRef}\\n        monthsData={monthsData}\\n        getContributionColor={getContributionColor}\\n        handleTooltipContent={handleTooltipContent}\\n        activeTestimonialIdx={activeTestimonialIdx}\\n        setActiveTestimonialIdx={setActiveTestimonialIdx}\\n        setIsTestimonialHovered={setIsTestimonialHovered}\\n        selectedLevelFilter={selectedLevelFilter}\\n        setSelectedLevelFilter={setSelectedLevelFilter}\\n        handleTouchStart={handleTouchStart}\\n        handleTouchEnd={handleTouchEnd}\\n        handleTouchMove={handleTouchMove}\\n        activeTooltipDate={activeTooltipDate}\\n        legendLevels={legendLevels}\\n        activeWork={activeWork}');

fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

console.log("Fixed all missing props!");

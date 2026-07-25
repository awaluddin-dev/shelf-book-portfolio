const fs = require('fs');

// 1. Fix ProficiencySection.tsx
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
if(!profCode.includes('categoryScores: any')) {
  profCode = profCode.replace('}\n\nexport default function ProficiencySection', `  categoryScores: any;\n  overallScore: number;\n}\n\nexport default function ProficiencySection`);
  profCode = profCode.replace('  activeCurrentFocus\n}: ProficiencySectionProps) {', '  activeCurrentFocus,\n  categoryScores,\n  overallScore\n}: ProficiencySectionProps) {');
  fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);
}

// 2. Fix ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
if(!expCode.includes('monthsData: any')) {
  expCode = expCode.replace('}\n\nexport default function ExperienceSection', `  monthsData: any;\n  getContributionColor: (count: number) => string;\n  handleTooltipContent: (count: number, date: string) => string;\n  activeTestimonialIdx: number;\n  setActiveTestimonialIdx: (idx: number) => void;\n  setIsTestimonialHovered: (val: boolean) => void;\n}\n\nexport default function ExperienceSection`);
  expCode = expCode.replace('  heatmapRef\n}: ExperienceSectionProps) {', '  heatmapRef,\n  monthsData,\n  getContributionColor,\n  handleTooltipContent,\n  activeTestimonialIdx,\n  setActiveTestimonialIdx,\n  setIsTestimonialHovered\n}: ExperienceSectionProps) {');
  fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);
}

// 3. Fix ProjectsSection.tsx
let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
if(!projCode.includes('filteredProjects: any')) {
  projCode = projCode.replace('}\n\nexport default function ProjectsSection', `  filteredProjects: any[];\n  focusedProject: any;\n  dynamicHeroConfig: any;\n  triggerToast: (msg: string) => void;\n  shelfRef: any;\n  activeProjects: any[];\n  selectedProject: any;\n  setSelectedProject: (p: any) => void;\n  isBannerMinimized: boolean;\n  setIsBannerMinimized: (b: boolean) => void;\n}\n\nexport default function ProjectsSection`);
  projCode = projCode.replace('  isDark\n}: ProjectsSectionProps) {', '  isDark,\n  filteredProjects,\n  focusedProject,\n  dynamicHeroConfig,\n  triggerToast,\n  shelfRef,\n  activeProjects,\n  selectedProject,\n  setSelectedProject,\n  isBannerMinimized,\n  setIsBannerMinimized\n}: ProjectsSectionProps) {');
  fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);
}

// 4. Update Home.tsx to pass all these props
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/<ProficiencySection([\\s\\S]*?)activeCurrentFocus=\\{activeCurrentFocus\\}/, 
  '<ProficiencySection$1activeCurrentFocus={activeCurrentFocus}\\n        categoryScores={categoryScores}\\n        overallScore={overallScore}');

homeCode = homeCode.replace(/<ExperienceSection([\\s\\S]*?)heatmapRef=\\{heatmapRef\\}/,
  '<ExperienceSection$1heatmapRef={heatmapRef}\\n        monthsData={monthsData}\\n        getContributionColor={getContributionColor}\\n        handleTooltipContent={handleTooltipContent}\\n        activeTestimonialIdx={activeTestimonialIdx}\\n        setActiveTestimonialIdx={setActiveTestimonialIdx}\\n        setIsTestimonialHovered={setIsTestimonialHovered}');

homeCode = homeCode.replace(/<ProjectsSection([\\s\\S]*?)isDark=\\{isDark\\}/,
  '<ProjectsSection$1isDark={isDark}\\n        filteredProjects={filteredProjects}\\n        focusedProject={focusedProject}\\n        dynamicHeroConfig={dynamicHeroConfig}\\n        triggerToast={triggerToast}\\n        shelfRef={shelfRef}\\n        activeProjects={activeProjects}\\n        selectedProject={selectedProject}\\n        setSelectedProject={setSelectedProject}\\n        isBannerMinimized={isBannerMinimized}\\n        setIsBannerMinimized={setIsBannerMinimized}');

// Also there was an error about getTagProjectCount expected 1 arg but got 2 in ProjectsSection:
projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={getTagProjectCount}');
projCode = projCode.replace(/const count = getTagProjectCount\\(tag, activeProjects\\);/g, 'const count = getTagProjectCount(tag);');
// Add getTagProjectCount to interface and props
projCode = projCode.replace('}\n\nexport default function ProjectsSection', `  getTagProjectCount: (tag: string) => number;\n}\n\nexport default function ProjectsSection`);
projCode = projCode.replace('  setIsBannerMinimized\n}: ProjectsSectionProps) {', '  setIsBannerMinimized,\n  getTagProjectCount\n}: ProjectsSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

homeCode = homeCode.replace(/<ProjectsSection([\\s\\S]*?)setIsBannerMinimized=\\{setIsBannerMinimized\\}/,
  '<ProjectsSection$1setIsBannerMinimized={setIsBannerMinimized}\\n        getTagProjectCount={(t: string) => getTagProjectCount(t, activeProjects)}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

console.log("Fixed!");

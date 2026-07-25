const fs = require('fs');

let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace(/  isDark: boolean;\n  getTagProjectCount: \(tag: string\) => number;\n}/, `  isDark: boolean;
  focusedProject: any;
  dynamicHeroConfig: any;
  triggerToast: (msg: string) => void;
  shelfRef: any;
  activeProjects: any[];
  selectedProject: any;
  isBannerMinimized: boolean;
  setIsBannerMinimized: (b: boolean) => void;
}`);
projCode = projCode.replace(/  setFocusedProject,\n  isDark\n}: ProjectsSectionProps\) {/g, `  setFocusedProject,
  isDark,
  focusedProject,
  dynamicHeroConfig,
  triggerToast,
  shelfRef,
  activeProjects,
  selectedProject,
  isBannerMinimized,
  setIsBannerMinimized
}: ProjectsSectionProps) {`);
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/  heatmapRef,\n}: ExperienceSectionProps\) {/, `  heatmapRef,
  monthsData,
  getContributionColor,
  handleTooltipContent,
  activeTestimonialIdx,
  setActiveTestimonialIdx,
  setIsTestimonialHovered
}: ExperienceSectionProps) {`);
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace(/  activeCurrentFocus,\n}: ProficiencySectionProps\) {/, `  activeCurrentFocus,
  categoryScores,
  overallScore
}: ProficiencySectionProps) {`);
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

console.log("Done fixing props!");

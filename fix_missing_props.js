const fs = require('fs');

// 1. Fix ProficiencySection.tsx
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
if(!profCode.includes('activeProficiency: any')) {
  profCode = profCode.replace('}\n\nexport default function ProficiencySection', `  activeProficiency: any[];\n  isLoading: boolean;\n}\n\nexport default function ProficiencySection`);
  profCode = profCode.replace('  overallScore\n}: ProficiencySectionProps) {', '  overallScore,\n  activeProficiency,\n  isLoading\n}: ProficiencySectionProps) {');
  fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);
}

// 2. Fix ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
if(!expCode.includes('selectedLevelFilter: number | null')) {
  expCode = expCode.replace('}\n\nexport default function ExperienceSection', `  selectedLevelFilter: number | null;\n  setSelectedLevelFilter: (val: number | null) => void;\n  handleTouchStart: (date: string) => void;\n  handleTouchEnd: () => void;\n  handleTouchMove: () => void;\n  activeTooltipDate: string | null;\n  legendLevels: any[];\n  activeWork: any[];\n}\n\nexport default function ExperienceSection`);
  expCode = expCode.replace('  setIsTestimonialHovered\n}: ExperienceSectionProps) {', '  setIsTestimonialHovered,\n  selectedLevelFilter,\n  setSelectedLevelFilter,\n  handleTouchStart,\n  handleTouchEnd,\n  handleTouchMove,\n  activeTooltipDate,\n  legendLevels,\n  activeWork\n}: ExperienceSectionProps) {');
  fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);
}

// 3. Fix ProjectsSection.tsx
let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
if(!projCode.includes('scrollShelf: (dir')) {
  projCode = projCode.replace('}\n\nexport default function ProjectsSection', `  isLoading: boolean;\n  scrollShelf: (dir: "left" | "right") => void;\n}\n\nexport default function ProjectsSection`);
  projCode = projCode.replace('  getTagProjectCount\n}: ProjectsSectionProps) {', '  getTagProjectCount,\n  isLoading,\n  scrollShelf\n}: ProjectsSectionProps) {');
  
  // Fix getTagProjectCount calls
  projCode = projCode.replace(/getTagProjectCount\\(tag, activeProjects\\)/g, 'getTagProjectCount(tag)');
  projCode = projCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={getTagProjectCount}');
  fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);
}

// 4. Update Home.tsx to pass all these props
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/<ProficiencySection([\\s\\S]*?)overallScore=\\{overallScore\\}/, 
  '<ProficiencySection$1overallScore={overallScore}\\n        activeProficiency={activeProficiency}\\n        isLoading={isLoading}');

homeCode = homeCode.replace(/<ExperienceSection([\\s\\S]*?)setIsTestimonialHovered=\\{setIsTestimonialHovered\\}/,
  '<ExperienceSection$1setIsTestimonialHovered={setIsTestimonialHovered}\\n        selectedLevelFilter={selectedLevelFilter}\\n        setSelectedLevelFilter={setSelectedLevelFilter}\\n        handleTouchStart={handleTouchStart}\\n        handleTouchEnd={handleTouchEnd}\\n        handleTouchMove={handleTouchMove}\\n        activeTooltipDate={activeTooltipDate}\\n        legendLevels={legendLevels}\\n        activeWork={activeWork}');

homeCode = homeCode.replace(/<ProjectsSection([\\s\\S]*?)getTagProjectCount=\\{\\(t: string\\) => getTagProjectCount\\(t, activeProjects\\)\\}/,
  '<ProjectsSection$1getTagProjectCount={(t: string) => getTagProjectCount(t)}\\n        isLoading={isLoading}\\n        scrollShelf={scrollShelf}');
  
// Fix any other stray getTagProjectCount calls in Home.tsx
homeCode = homeCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={(t: string) => getTagProjectCount(t)}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

console.log("Fixed missing props!");

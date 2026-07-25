const fs = require('fs');

// 1. Home.tsx
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

// Remove selectedLevelFilter from ProficiencySection
homeCode = homeCode.replace(/        selectedLevelFilter=\{selectedLevelFilter\}\n        setSelectedLevelFilter=\{setSelectedLevelFilter\}\n        \n/g, "");

// Remove missing local variables from ExperienceSection
homeCode = homeCode.replace(/        getContributionColor=\{getContributionColor\}\n        handleTooltipContent=\{handleTooltipContent\}\n        activeTestimonialIdx=\{activeTestimonialIdx\}\n        setActiveTestimonialIdx=\{setActiveTestimonialIdx\}\n        setIsTestimonialHovered=\{setIsTestimonialHovered\}\n/g, "");

// Remove ProjectModal heatmapRef
homeCode = homeCode.replace(/        heatmapRef=\{heatmapRef\}\n        isDark=\{isDark\}\n        onClose=\{\(\) => setSelectedProject\(null\)\}/g, 
  "        onClose={() => setSelectedProject(null)}");
homeCode = homeCode.replace(/        heatmapRef=\{heatmapRef\}\n        onClose=\{\(\) => setSelectedProject\(null\)\}/g, 
  "        onClose={() => setSelectedProject(null)}");

fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);


// 2. ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');

// Fix interface props (remove missing local ones)
expCode = expCode.replace(/  getContributionColor: \(count: number\) => string;\n  handleTooltipContent: \(count: number, date: string\) => string;\n  activeTestimonialIdx: number;\n  setActiveTestimonialIdx: \(idx: number\) => void;\n  setIsTestimonialHovered: \(val: boolean\) => void;\n/g, "");
expCode = expCode.replace(/  getContributionColor,\n  handleTooltipContent,\n  activeTestimonialIdx,\n  setActiveTestimonialIdx,\n  setIsTestimonialHovered,\n/g, "");

// Fix types
expCode = expCode.replace(/\\(monthGroup, mIdx\\) =>/g, '(monthGroup: any, mIdx: number) =>');
expCode = expCode.replace(/\\(week, wIdxInMonth\\) =>/g, '(week: any, wIdxInMonth: number) =>');
expCode = expCode.replace(/\\(day\\) => day.month/g, '(day: any) => day.month');
expCode = expCode.replace(/\\(day, dIdx\\) =>/g, '(day: any, dIdx: number) =>');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);


// 3. ProficiencySection.tsx
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');

profCode = profCode.replace(/24,\n                            24/g, "24");
// There might be some spaces or formatting difference for 24, 24
profCode = profCode.replace(/24,\n *24\n/g, "24\n");
profCode = profCode.replace(/renderIcon\(\n *activeRoadmap\[selectedRoadmapIndex\].icon,\n *24,\n *24\n *\)/g, 
  "renderIcon(activeRoadmap[selectedRoadmapIndex].icon, 24)");
profCode = profCode.replace(/renderIcon\((.*?), 24, 24\)/g, "renderIcon($1, 24)");
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

console.log("Fixed final 3!");

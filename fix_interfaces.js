const fs = require('fs');

// Fix ProficiencySection
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
const profRegex = /contributionData:\s*any;[\s\S]*?setHoveredLang:\s*\(lang:\s*string\s*\|\s*null\)\s*=>\s*void;/;
profCode = profCode.replace(profRegex, '');

// Wait, I should also remove them from the component props:
const profPropsRegex = /contributionData,[\s\S]*?setHoveredLang,/;
profCode = profCode.replace(profPropsRegex, '');

fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

// Fix ExperienceSection
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
const expInterfaceInject = `
  contributionData: any;
  chartType: "temporal" | "repository";
  setChartType: (type: "temporal" | "repository") => void;
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  hoveredMonth: string | null;
  setHoveredMonth: (month: string | null) => void;
  hoveredLang: string | null;
  setHoveredLang: (lang: string | null) => void;
  mounted: boolean;`;
expCode = expCode.replace(/setSelectedTestimonial: \(test: any\) => void;/, 'setSelectedTestimonial: (test: any) => void;' + expInterfaceInject);

const expPropsInject = `
  setSelectedTestimonial,
  contributionData,
  chartType,
  setChartType,
  timelineData,
  repoData,
  languageData,
  hoveredMonth,
  setHoveredMonth,
  hoveredLang,
  setHoveredLang,
  mounted`;
expCode = expCode.replace(/setSelectedTestimonial/, expPropsInject);

fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);


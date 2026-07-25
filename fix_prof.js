const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');

// I need to remove all these from ProficiencySectionProps:
/*
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
*/
code = code.replace(/contributionData:\s*any;/, '');
code = code.replace(/chartType:\s*"temporal"\s*\|\s*"repository";/, '');
code = code.replace(/setChartType:\s*\(type:\s*"temporal"\s*\|\s*"repository"\)\s*=>\s*void;/, '');
code = code.replace(/timelineData:\s*any\[\];/, '');
code = code.replace(/repoData:\s*any\[\];/, '');
code = code.replace(/languageData:\s*any\[\];/, '');
code = code.replace(/hoveredMonth:\s*string\s*\|\s*null;/, '');
code = code.replace(/setHoveredMonth:\s*\(month:\s*string\s*\|\s*null\)\s*=>\s*void;/, '');
code = code.replace(/hoveredLang:\s*string\s*\|\s*null;/, '');
code = code.replace(/setHoveredLang:\s*\(lang:\s*string\s*\|\s*null\)\s*=>\s*void;/, '');

// And remove from the function arguments:
code = code.replace(/contributionData,/g, '');
code = code.replace(/chartType,/g, '');
code = code.replace(/setChartType,/g, '');
code = code.replace(/timelineData,/g, '');
code = code.replace(/repoData,/g, '');
code = code.replace(/languageData,/g, '');
code = code.replace(/hoveredMonth,/g, '');
code = code.replace(/setHoveredMonth,/g, '');
code = code.replace(/hoveredLang,/g, '');
code = code.replace(/setHoveredLang,/g, '');

fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', code);

// Fix HeroSection CircuitBoardBg
let heroCode = fs.readFileSync('src/views/home/ui/sections/HeroSection.tsx', 'utf-8');
heroCode = heroCode.replace(/import CircuitBoardBg from "@\/shared\/ui\/CircuitBoardBg";/, 'import { CircuitBoardBg } from "@/shared/ui/CircuitBoardBg";');
fs.writeFileSync('src/views/home/ui/sections/HeroSection.tsx', heroCode);

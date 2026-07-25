const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');

code = code.replace(/  setSelectedTestimonial\n}: ExperienceSectionProps\) {/, `  setSelectedTestimonial,
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
  mounted
}: ExperienceSectionProps) {`);

fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', code);

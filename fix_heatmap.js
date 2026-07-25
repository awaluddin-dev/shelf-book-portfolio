const fs = require('fs');

// 1. Add heatmapStats to ExperienceSectionProps in ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/isDark: boolean;/g, 'isDark: boolean;\n  heatmapStats: any;');
expCode = expCode.replace(/isDark\n}: ExperienceSectionProps\) {/g, 'isDark,\n  heatmapStats\n}: ExperienceSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 2. Pass heatmapStats from Home.tsx to ExperienceSection
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/isDark={isDark}/g, 'isDark={isDark}\n        heatmapStats={heatmapStats}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

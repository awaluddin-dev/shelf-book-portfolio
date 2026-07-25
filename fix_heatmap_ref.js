const fs = require('fs');

// 1. Add heatmapRef to ExperienceSectionProps in ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/heatmapStats: any;/g, 'heatmapStats: any;\n  heatmapRef: any;');
expCode = expCode.replace(/heatmapStats\n}: ExperienceSectionProps\) {/g, 'heatmapStats,\n  heatmapRef\n}: ExperienceSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 2. Pass heatmapRef from Home.tsx to ExperienceSection
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/heatmapStats={heatmapStats}/g, 'heatmapStats={heatmapStats}\n        heatmapRef={heatmapRef}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

const fs = require('fs');

// 1. Add isLoading to ExperienceSectionProps in ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/mounted: boolean;/g, 'mounted: boolean;\n  isLoading: boolean;');
expCode = expCode.replace(/mounted\n}: ExperienceSectionProps\) {/g, 'mounted,\n  isLoading\n}: ExperienceSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 2. Pass isLoading from Home.tsx to ExperienceSection
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/mounted={mounted}/g, 'mounted={mounted}\n        isLoading={isLoading}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

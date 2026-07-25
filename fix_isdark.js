const fs = require('fs');

// 1. Add isDark to ExperienceSectionProps in ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/isLoading: boolean;/g, 'isLoading: boolean;\n  isDark: boolean;');
expCode = expCode.replace(/isLoading\n}: ExperienceSectionProps\) {/g, 'isLoading,\n  isDark\n}: ExperienceSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 2. Pass isDark from Home.tsx to ExperienceSection
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/isLoading={isLoading}/g, 'isLoading={isLoading}\n        isDark={isDark}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

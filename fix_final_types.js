const fs = require('fs');

// 1. ProjectsSection
let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace(/getTagProjectCount=\\{\\(t\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={getTagProjectCount}');
projCode = projCode.replace(/getTagProjectCount=\\{\\(t: string\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={getTagProjectCount}');
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

// 2. ProficiencySection
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace(/activeRoadmap: number \| null;/g, 'activeRoadmap: any[];');
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

// 3. ExperienceSection
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/\\(day, dIdx\\)/g, '(day: any, dIdx: number)');
expCode = expCode.replace(/\\(monthGroup, mIdx\\)/g, '(monthGroup: any, mIdx: number)');
expCode = expCode.replace(/\\(week, wIdxInMonth\\)/g, '(week: any, wIdxInMonth: number)');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// 4. Home
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/getTagProjectCount=\\{\\(t: string\\) => getTagProjectCount\\(t, activeProjects\\)\\}/g, 'getTagProjectCount={(t: string) => getTagProjectCount(t, activeProjects)}');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

console.log("Types fixed!");

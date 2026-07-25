const fs = require('fs');

let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace(/selectedRoadmapIndex!,\n  setSelectedRoadmapIndex/g, 'selectedRoadmapIndex,\n  setSelectedRoadmapIndex');
profCode = profCode.replace(/selectedRoadmapIndex!,/g, 'selectedRoadmapIndex,');
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);
console.log("Syntax fixed");

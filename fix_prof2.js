const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');

code = code.replace(/contributionData:\s*any\[\]\[\];/, '');
code = code.replace(/setChartType:\s*\(val:\s*"temporal"\s*\|\s*"repository"\)\s*=>\s*void;/, '');
code = code.replace(/hoveredMonth:\s*number\s*\|\s*null;/, '');
code = code.replace(/setHoveredMonth:\s*\(val:\s*number\s*\|\s*null\)\s*=>\s*void;/, '');
code = code.replace(/setHoveredLang:\s*\(val:\s*string\s*\|\s*null\)\s*=>\s*void;/, '');

fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', code);

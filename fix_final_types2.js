const fs = require('fs');

// ExperienceSection
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace("import { PieChart, Pie, Cell } from 'recharts';", "import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';");
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// ProficiencySection
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace("import SkillTree from '@/views/home/ui/components/SkillTree';", "import SkillTree from '../components/SkillTree';");
profCode = profCode.replace(/selectedRoadmapIndex/g, 'selectedRoadmapIndex!');
// Fix the function argument definition we just broke
profCode = profCode.replace(/setSelectedRoadmapIndex!: \(idx: number \| null\) => void;/g, 'setSelectedRoadmapIndex: (idx: number | null) => void;');
profCode = profCode.replace(/selectedRoadmapIndex!: number \| null;/g, 'selectedRoadmapIndex: number | null;');
profCode = profCode.replace(/selectedRoadmapIndex!,\n  setSelectedRoadmapIndex!/g, 'selectedRoadmapIndex,\n  setSelectedRoadmapIndex');
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

// ProjectsSection
let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace("getTagProjectCount={(t) => getTagProjectCount(t, activeProjects)}", "getTagProjectCount={getTagProjectCount}");
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

console.log("Fixed types 2!");

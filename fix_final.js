const fs = require('fs');
let heroCode = fs.readFileSync('src/views/home/ui/sections/HeroSection.tsx', 'utf-8');
heroCode = heroCode.replace(/import CircuitBoardBg from '@\/shared\/ui\/CircuitBoardBg';/, 'import { CircuitBoardBg } from "@/shared/ui/CircuitBoardBg";');
fs.writeFileSync('src/views/home/ui/sections/HeroSection.tsx', heroCode);

let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/hoveredMonth: string \| null;/g, 'hoveredMonth: number | null;');
expCode = expCode.replace(/setHoveredMonth: \(month: string \| null\) => void;/g, 'setHoveredMonth: (month: number | null) => void;');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

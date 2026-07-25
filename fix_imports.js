const fs = require('fs');

// ExperienceSection
let exp = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
exp = exp.replace("import { Briefcase, Quote, QuoteIcon, Wrench } from 'lucide-react';", "import { Briefcase, Quote, QuoteIcon, Wrench, Activity, Code2, ChevronUp, ChevronDown, Sparkles, MessageCircle, MessageSquare } from 'lucide-react';\nimport { PieChart, Pie, Cell } from 'recharts';");
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', exp);

// ProficiencySection
let prof = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
prof = prof.replace("import { Code2, GitFork, Cpu, Globe, Rocket, ArrowRight, Activity, TrendingUp, Layers, PenTool, ExternalLink, BriefcaseBusiness } from 'lucide-react';", "import { Code2, GitFork, Cpu, Globe, Rocket, ArrowRight, Activity, TrendingUp, Layers, PenTool, ExternalLink, BriefcaseBusiness, Briefcase, BrainCircuit, Milestone } from 'lucide-react';\nimport P5Background from '../components/P5Background';\nimport SkillTree from '../components/SkillTree';");
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', prof);

// ProjectsSection
let proj = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
proj = proj.replace("import { BookOpen, Search, Wrench, ChevronDown, Filter } from 'lucide-react';", "import { BookOpen, Search, Wrench, ChevronDown, Filter, ChevronLeft, ChevronRight, Code2, ArrowLeft } from 'lucide-react';");
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', proj);

console.log("Fixed imports!");

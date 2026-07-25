const fs = require('fs');

// 1. Home.tsx
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

// Fix HeroSection spurious props
homeCode = homeCode.replace(/<HeroSection \n        isLoading=\{isLoading\}\n        heatmapRef=\{heatmapRef\}\n        isDark=\{isDark\}\n        dynamicHeroConfig=\{dynamicHeroConfig\}/, 
  "<HeroSection \n        isLoading={isLoading}\n        dynamicHeroConfig={dynamicHeroConfig}");

// Fix ProjectsSection spurious props
homeCode = homeCode.replace(/<ProjectsSection \n        searchQuery=\{searchQuery\}\n        heatmapRef=\{heatmapRef\}\n        isDark=\{isDark\}\n        setSearchQuery=\{setSearchQuery\}/, 
  "<ProjectsSection \n        searchQuery={searchQuery}\n        setSearchQuery={setSearchQuery}");

// Fix activeCurrentFocus type issue by replacing its assignment
homeCode = homeCode.replace(/const activeCurrentFocus = dynamicProficiency\[1\];/g, "const activeCurrentFocus = !!dynamicProficiency[1];");

// Fix setSelectedRoadmapIndex type issue
homeCode = homeCode.replace(/const \[selectedRoadmapIndex, setSelectedRoadmapIndex\] = useState\(0\);/g, "const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState<number | null>(0);");

// Fix ExperienceSection props completely
homeCode = homeCode.replace(/<ExperienceSection \n        dynamicWork=\{dynamicWork\}\n        activeExpIdx=\{activeExpIdx\}\n        heatmapRef=\{heatmapRef\}\n        isDark=\{isDark\}\n        setActiveExpIdx=\{setActiveExpIdx\}\n        testimonialsList=\{testimonialsList\}\n        setSelectedTestimonial=\{setSelectedTestimonial\}\n      \/>/g, 
  `<ExperienceSection 
        dynamicWork={dynamicWork}
        activeExpIdx={activeExpIdx}
        setActiveExpIdx={setActiveExpIdx}
        testimonialsList={testimonialsList}
        setSelectedTestimonial={setSelectedTestimonial}
        heatmapRef={heatmapRef}
        monthsData={monthsData}
        getContributionColor={getContributionColor}
        handleTooltipContent={handleTooltipContent}
        activeTestimonialIdx={activeTestimonialIdx}
        setActiveTestimonialIdx={setActiveTestimonialIdx}
        setIsTestimonialHovered={setIsTestimonialHovered}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        handleTouchMove={handleTouchMove}
        activeTooltipDate={activeTooltipDate}
        legendLevels={legendLevels}
        activeWork={activeWork}
        contributionData={contributionData}
        chartType={chartType}
        setChartType={setChartType}
        timelineData={timelineData}
        repoData={repoData}
        languageData={languageData}
        hoveredMonth={hoveredMonth}
        setHoveredMonth={setHoveredMonth}
        hoveredLang={hoveredLang}
        setHoveredLang={setHoveredLang}
        mounted={mounted}
        isLoading={isLoading}
        isDark={isDark}
        heatmapStats={heatmapStats}
      />`);

// Fix ProjectModal spurious props
homeCode = homeCode.replace(/<ProjectModal \n        selectedProject=\{selectedProject\}\n        heatmapRef=\{heatmapRef\}\n        isDark=\{isDark\}\n        onClose=\{\(\) => setSelectedProject\(null\)\}/, 
  "<ProjectModal \n        selectedProject={selectedProject}\n        onClose={() => setSelectedProject(null)}");

fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);


// 2. ExperienceSection.tsx
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');

// Fix imports
expCode = expCode.replace("import { Briefcase, Quote, QuoteIcon, Wrench, Activity, Code2, ChevronUp, ChevronDown, Sparkles, MessageCircle, MessageSquare } from 'lucide-react';", 
  "import { Briefcase, Quote, QuoteIcon, Wrench, Activity, Code2, ChevronUp, ChevronDown, Sparkles, MessageCircle, MessageSquare, GitCommit, BarChart2 } from 'lucide-react';");

expCode = expCode.replace("import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';", 
  "import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, AreaChart, Area } from 'recharts';");

// Fix map types
expCode = expCode.replace(/\\(monthGroup, mIdx\\) =>/g, '(monthGroup: any, mIdx: number) =>');
expCode = expCode.replace(/\\(week, wIdxInMonth\\) =>/g, '(week: any, wIdxInMonth: number) =>');
expCode = expCode.replace(/\\(day\\) => day.month/g, '(day: any) => day.month');
expCode = expCode.replace(/\\(day, dIdx\\) =>/g, '(day: any, dIdx: number) =>');

fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);


// 3. ProficiencySection.tsx
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');

profCode = profCode.replace("import SkillTree from '../components/SkillTree';", "import SkillTree from '@/entities/skill/ui/SkillTree';");
profCode = profCode.replace(/24,\n                            24/g, '24'); // Fix the renderIcon expected 1-2 args

fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

console.log("Master fix completed!");

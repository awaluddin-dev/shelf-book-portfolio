const fs = require('fs');

// 1. ExperienceSection
let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
// Fix Props Interface
expCode = expCode.replace(/interface ExperienceSectionProps \{[\s\S]*?\}\n\nexport default function ExperienceSection/m, `interface ExperienceSectionProps {
  dynamicWork: any[];
  activeExpIdx: number | null;
  setActiveExpIdx: (idx: number | null) => void;
  testimonialsList: Testimonial[];
  setSelectedTestimonial: (test: any) => void;
  contributionData: any;
  chartType: "temporal" | "repository";
  setChartType: (type: "temporal" | "repository") => void;
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  hoveredMonth: number | null;
  setHoveredMonth: (month: number | null) => void;
  hoveredLang: string | null;
  setHoveredLang: (lang: string | null) => void;
  mounted: boolean;
  isLoading: boolean;
  isDark: boolean;
  heatmapStats: any;
  heatmapRef: any;
  monthsData: any;
  getContributionColor: (count: number) => string;
  handleTooltipContent: (count: number, date: string) => string;
  activeTestimonialIdx: number;
  setActiveTestimonialIdx: (idx: number) => void;
  setIsTestimonialHovered: (val: boolean) => void;
  selectedLevelFilter: number | null;
  setSelectedLevelFilter: (val: number | null) => void;
  handleTouchStart: (date: string) => void;
  handleTouchEnd: () => void;
  handleTouchMove: () => void;
  activeTooltipDate: string | null;
  legendLevels: any[];
  activeWork: any[];
}

export default function ExperienceSection`);
// Fix Props Destructuring
expCode = expCode.replace(/export default function ExperienceSection\([\s\S]*?\}\: ExperienceSectionProps\) \{/m, `export default function ExperienceSection({
  dynamicWork,
  activeExpIdx,
  setActiveExpIdx,
  testimonialsList,
  setSelectedTestimonial,
  contributionData,
  chartType,
  setChartType,
  timelineData,
  repoData,
  languageData,
  hoveredMonth,
  setHoveredMonth,
  hoveredLang,
  setHoveredLang,
  mounted,
  isLoading,
  isDark,
  heatmapStats,
  heatmapRef,
  monthsData,
  getContributionColor,
  handleTooltipContent,
  activeTestimonialIdx,
  setActiveTestimonialIdx,
  setIsTestimonialHovered,
  selectedLevelFilter,
  setSelectedLevelFilter,
  handleTouchStart,
  handleTouchEnd,
  handleTouchMove,
  activeTooltipDate,
  legendLevels,
  activeWork
}: ExperienceSectionProps) {`);
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);


// 2. ProficiencySection
let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace(/interface ProficiencySectionProps \{[\s\S]*?\}\n\nexport default function ProficiencySection/m, `interface ProficiencySectionProps {
  dynamicProficiency: any[];
  activeRoadmap: number | null;
  activeCurrentFocus: boolean;
  renderIcon: (name: string, props?: any) => React.ReactNode;
  selectedRoadmapIndex: number | null;
  setSelectedRoadmapIndex: (idx: number | null) => void;
  isDark: boolean;
  activeProficiency: any[];
  isLoading: boolean;
  categoryScores: any;
  overallScore: number;
}

export default function ProficiencySection`);
profCode = profCode.replace(/export default function ProficiencySection\([\s\S]*?\}\: ProficiencySectionProps\) \{/m, `export default function ProficiencySection({
  dynamicProficiency,
  activeRoadmap,
  activeCurrentFocus,
  renderIcon,
  selectedRoadmapIndex,
  setSelectedRoadmapIndex,
  isDark,
  activeProficiency,
  isLoading,
  categoryScores,
  overallScore
}: ProficiencySectionProps) {`);

profCode = profCode.replace("import P5Background from '../components/P5Background';", "import P5Background from '@/shared/ui/P5Background';");
profCode = profCode.replace("import SkillTree from '../components/SkillTree';", "import SkillTree from '@/views/home/ui/components/SkillTree';");
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

console.log("Fixed props clean!");

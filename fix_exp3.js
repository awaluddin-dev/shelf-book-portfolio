const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');

const targetBadInterface = `  setHoveredLang: (lang: string | null) => void;
  mounted: boolean;: (test: any) => void;
  contributionData: any;
  chartType: "temporal" | "repository";
  setChartType: (type: "temporal" | "repository") => void;
  timelineData: any[];
  repoData: any[];
  languageData: any[];
  hoveredMonth: string | null;
  setHoveredMonth: (month: string | null) => void;
  hoveredLang: string | null;
  setHoveredLang: (lang: string | null) => void;
  mounted: boolean;
}

export default function ExperienceSection({`;

const goodInterface = `  setHoveredLang: (lang: string | null) => void;
  mounted: boolean;
}

export default function ExperienceSection({`;

code = code.replace(targetBadInterface, goodInterface);

fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', code);

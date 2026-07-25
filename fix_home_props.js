const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

const targetPropsToMove = `contributionData={contributionData}
        chartType={chartType}
        setChartType={setChartType}
        timelineData={timelineData}
        repoData={repoData}
        languageData={languageData}
        hoveredMonth={hoveredMonth}
        setHoveredMonth={setHoveredMonth}
        hoveredLang={hoveredLang}
        setHoveredLang={setHoveredLang}`;

// Replace them in ProficiencySection with empty
code = code.replace(targetPropsToMove, '');

// Add them to ExperienceSection
const expReplacement = `      <ExperienceSection 
        dynamicWork={dynamicWork}
        activeExpIdx={activeExpIdx}
        setActiveExpIdx={setActiveExpIdx}
        testimonialsList={testimonialsList}
        setSelectedTestimonial={setSelectedTestimonial}
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
      />`;

code = code.replace(/<ExperienceSection[\s\S]*?\/>/, expReplacement);
fs.writeFileSync('src/views/home/ui/Home.tsx', code);

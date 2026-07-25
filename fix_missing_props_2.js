const fs = require('fs');

let profCode = fs.readFileSync('src/views/home/ui/sections/ProficiencySection.tsx', 'utf-8');
profCode = profCode.replace(/  isDark\n\}: ProficiencySectionProps\) \{/, '  isDark,\n  activeProficiency,\n  isLoading\n}: ProficiencySectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ProficiencySection.tsx', profCode);

let projCode = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
projCode = projCode.replace(/  isDark\n\}: ProjectsSectionProps\) \{/, '  isDark,\n  isLoading,\n  scrollShelf\n}: ProjectsSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', projCode);

let expCode = fs.readFileSync('src/views/home/ui/sections/ExperienceSection.tsx', 'utf-8');
expCode = expCode.replace(/\(monthGroup, mIdx\)/g, '(monthGroup: any, mIdx: number)');
expCode = expCode.replace(/\(week, wIdxInMonth\)/g, '(week: any, wIdxInMonth: number)');
expCode = expCode.replace(/\(day\) =>/g, '(day: any) =>');
expCode = expCode.replace(/\(day, dIdx\)/g, '(day: any, dIdx: number)');
fs.writeFileSync('src/views/home/ui/sections/ExperienceSection.tsx', expCode);

// Fix Home.tsx to pass all the props
let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

// Replace ProjectsSection in Home
homeCode = homeCode.replace(/<ProjectsSection([\s\S]*?)isDark=\{isDark\}\n\s*\/>/, 
  '<ProjectsSection$1isDark={isDark}\n        filteredProjects={filteredProjects}\n        focusedProject={focusedProject}\n        dynamicHeroConfig={dynamicHeroConfig}\n        triggerToast={triggerToast}\n        shelfRef={shelfRef}\n        activeProjects={activeProjects}\n        selectedProject={selectedProject}\n        setSelectedProject={setSelectedProject}\n        isBannerMinimized={isBannerMinimized}\n        setIsBannerMinimized={setIsBannerMinimized}\n        getTagProjectCount={(t: string) => getTagProjectCount(t)}\n        isLoading={isLoading}\n        scrollShelf={scrollShelf}\n      />');

// Replace ProficiencySection in Home
homeCode = homeCode.replace(/<ProficiencySection([\s\S]*?)isDark=\{isDark\}\n\s*\/>/, 
  '<ProficiencySection$1isDark={isDark}\n        categoryScores={categoryScores}\n        overallScore={overallScore}\n        activeProficiency={activeProficiency}\n        isLoading={isLoading}\n      />');

// Replace ExperienceSection in Home
homeCode = homeCode.replace(/<ExperienceSection([\s\S]*?)heatmapRef=\{heatmapRef\}\n\s*\/>/, 
  '<ExperienceSection$1heatmapRef={heatmapRef}\n        monthsData={monthsData}\n        getContributionColor={getContributionColor}\n        handleTooltipContent={handleTooltipContent}\n        activeTestimonialIdx={activeTestimonialIdx}\n        setActiveTestimonialIdx={setActiveTestimonialIdx}\n        setIsTestimonialHovered={setIsTestimonialHovered}\n        selectedLevelFilter={selectedLevelFilter}\n        setSelectedLevelFilter={setSelectedLevelFilter}\n        handleTouchStart={handleTouchStart}\n        handleTouchEnd={handleTouchEnd}\n        handleTouchMove={handleTouchMove}\n        activeTooltipDate={activeTooltipDate}\n        legendLevels={legendLevels}\n        activeWork={activeWork}\n      />');

fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

console.log("Fixed!");

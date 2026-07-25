const fs = require('fs');
let content = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

const imports = `import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import ProficiencySection from './sections/ProficiencySection';
import ExperienceSection from './sections/ExperienceSection';
import ContactModal from "@/features/contact/ui/ContactModal";`;

content = content.replace('import ContactModal from "@/features/contact/ui/ContactModal";', imports);

const startStr = `      {/* Combined Section 1: Intro & Projects */}
      <section id="hero" className="relative z-0 mb-16 md:mb-24 w-full">`;
const endStr = `      {/* Footer */}`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const sectionsReplacement = `
      {/* Extracted Sections */}
      <HeroSection 
        isLoading={isLoading}
        dynamicHeroConfig={dynamicHeroConfig}
        activeMetrics={activeMetrics}
        renderIcon={renderIcon}
        triggerToast={triggerToast}
        setShowInquiryModal={setShowInquiryModal}
      />
      <ProjectsSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        filteredProjects={filteredProjects}
        getTechIconAndColor={getTechIconAndColor}
        getTagProjectCount={(t) => getTagProjectCount(t, activeProjects)}
        setSelectedProject={setSelectedProject}
        setFocusedProject={setFocusedProject}
        isDark={isDark}
      />
      <ProficiencySection 
        dynamicProficiency={dynamicProficiency}
        activeRoadmap={activeRoadmap}
        activeCurrentFocus={activeCurrentFocus}
        renderIcon={renderIcon}
        selectedLevelFilter={selectedLevelFilter}
        setSelectedLevelFilter={setSelectedLevelFilter}
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
        selectedRoadmapIndex={selectedRoadmapIndex}
        setSelectedRoadmapIndex={setSelectedRoadmapIndex}
        isDark={isDark}
      />
      <ExperienceSection 
        dynamicWork={dynamicWork}
        activeExpIdx={activeExpIdx}
        setActiveExpIdx={setActiveExpIdx}
        testimonialsList={testimonialsList}
        setSelectedTestimonial={setSelectedTestimonial}
      />

`;
  
  content = content.substring(0, startIndex) + sectionsReplacement + content.substring(endIndex);
  fs.writeFileSync('src/views/home/ui/Home.tsx', content);
  console.log("Successfully replaced sections!");
} else {
  console.log("Could not find start or end strings!");
  console.log("startIndex", startIndex);
  console.log("endIndex", endIndex);
}

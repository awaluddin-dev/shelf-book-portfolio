const fs = require('fs');

let home = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');

// Add imports
const imports = `import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProficiencySection } from './components/ProficiencySection';
import { ExperienceSection } from './components/ExperienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';
`;

home = home.replace("import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';", imports + "import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';");


// Replace Hero
const heroStart = home.indexOf('<header className="relative');
const heroEnd = home.indexOf('</header>') + '</header>'.length;
if (heroStart !== -1 && heroEnd !== -1) {
  home = home.substring(0, heroStart) + 
         `<HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />` + 
         home.substring(heroEnd);
}

// Replace Projects
const projStart = home.indexOf('<section id="projects"');
// We need to be careful with nested sections. 
// Instead of full parsing, we can just replace the blocks based on markers.
// Actually, it's easier to find the index of `<section id="projects"` and `<section id="proficiency"`
const profStart = home.indexOf('<section id="proficiency"');
if (projStart !== -1 && profStart !== -1) {
  const dividerBeforeProf = home.lastIndexOf('<div className="h-px', profStart);
  home = home.substring(0, projStart) + 
         `<ProjectsSection pd={pd} triggerToast={triggerToast} activeProjects={activeProjects} isLoading={isLoading} isDark={isDark} focusedProject={focusedProject} setFocusedProject={setFocusedProject} setSelectedProject={setSelectedProject} getTagProjectCount={getTagProjectCount} />\n        ` + 
         home.substring(dividerBeforeProf !== -1 && dividerBeforeProf > projStart ? dividerBeforeProf : profStart);
}

// Replace Proficiency
const expStart = home.indexOf('<section id="experience"');
if (profStart !== -1 && expStart !== -1) {
  // Need to recalculate profStart because string length changed
  const pStart = home.indexOf('<section id="proficiency"');
  const eStart = home.indexOf('<section id="experience"');
  const dividerBeforeExp = home.lastIndexOf('<div className="h-px', eStart);
  home = home.substring(0, pStart) + 
         `<ProficiencySection renderIcon={renderIcon} activeRoadmap={activeRoadmap} activeCurrentFocus={activeCurrentFocus} activeProficiency={activeProficiency} isLoading={isLoading} isDark={isDark} />\n        ` + 
         home.substring(dividerBeforeExp !== -1 && dividerBeforeExp > pStart ? dividerBeforeExp : eStart);
}

// Replace Experience
const testStart = home.indexOf('<section id="testimonials"');
if (expStart !== -1 && testStart !== -1) {
  const eStart = home.indexOf('<section id="experience"');
  const tStart = home.indexOf('<section id="testimonials"');
  const dividerBeforeTest = home.lastIndexOf('<div className="h-px', tStart);
  home = home.substring(0, eStart) + 
         `<ExperienceSection activeWork={activeWork} activeRoadmap={activeRoadmap} gh={gh} isLoading={isLoading} isDark={isDark} renderIcon={renderIcon} legendLevels={legendLevels} />\n        ` + 
         home.substring(dividerBeforeTest !== -1 && dividerBeforeTest > eStart ? dividerBeforeTest : tStart);
}

// Replace Testimonials
// Where does it end? After <section id="testimonials">, there is <div className="h-px... and then footer.
const footerStart = home.indexOf('<footer');
if (testStart !== -1 && footerStart !== -1) {
  const tStart = home.indexOf('<section id="testimonials"');
  const fStart = home.indexOf('<footer');
  const dividerBeforeFooter = home.lastIndexOf('<div className="h-px', fStart);
  home = home.substring(0, tStart) + 
         `<TestimonialsSection testimonialsList={testimonialsList} isLoading={isLoading} setSelectedTestimonial={setSelectedTestimonial} />\n        ` + 
         home.substring(dividerBeforeFooter !== -1 && dividerBeforeFooter > tStart ? dividerBeforeFooter : fStart);
}

fs.writeFileSync('src/views/home/ui/Home.tsx', home);
console.log('Re-split done');

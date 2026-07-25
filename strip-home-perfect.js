const fs = require('fs');

// We use the original checkout to get the perfect boundaries.
const execSync = require('child_process').execSync;
execSync('git checkout src/views/home/ui/Home.tsx');

let home = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');

const imports = `import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProficiencySection } from './components/ProficiencySection';
import { ExperienceSection } from './components/ExperienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';\n`;

home = home.replace('import { useState, useRef, useMemo, useCallback, useEffect } from "react";', 'import { useState, useRef, useMemo, useCallback, useEffect } from "react";\n' + imports);

// We find the indices of the sections
const markers = [
    { start: home.indexOf('<header className="relative z-10'), replacement: '<HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />' },
    { start: home.indexOf('<section id="projects"'), replacement: '<ProjectsSection pd={pd} triggerToast={triggerToast} activeProjects={activeProjects} isLoading={isLoading} isDark={isDark} focusedProject={focusedProject} setFocusedProject={setFocusedProject} setSelectedProject={setSelectedProject} getTagProjectCount={getTagProjectCount} />' },
    { start: home.indexOf('<section id="proficiency"'), replacement: '<ProficiencySection renderIcon={renderIcon} activeRoadmap={activeRoadmap} activeCurrentFocus={activeCurrentFocus} activeProficiency={activeProficiency} isLoading={isLoading} isDark={isDark} />' },
    { start: home.indexOf('<section id="experience"'), replacement: '<ExperienceSection activeWork={activeWork} activeRoadmap={activeRoadmap} gh={gh} isLoading={isLoading} isDark={isDark} renderIcon={renderIcon} legendLevels={legendLevels} />' },
    { start: home.indexOf('<section id="testimonials"'), replacement: '<TestimonialsSection testimonialsList={testimonialsList} isLoading={isLoading} setSelectedTestimonial={setSelectedTestimonial} />' },
    { start: home.indexOf('<footer') }
];

let newHome = home.substring(0, markers[0].start);

for (let i = 0; i < markers.length - 1; i++) {
    const current = markers[i];
    const next = markers[i + 1];
    
    // Find the divider before the next section
    const dividerStr = '<div className="h-px bg-border/50 w-full" />';
    const dividerIdx = home.lastIndexOf(dividerStr, next.start);
    
    newHome += current.replacement + '\n\n';
    
    if (dividerIdx > current.start && dividerIdx < next.start) {
        // newHome += dividerStr + '\n\n'; // Actually I can just omit the dividers if they are inside the sections or keep them
    }
}

newHome += home.substring(markers[5].start);

fs.writeFileSync('src/views/home/ui/Home.tsx', newHome);
console.log('Stripped home.tsx to minimal size!');

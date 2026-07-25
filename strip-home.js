const fs = require('fs');
let home = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');

// The exact string in original file:
const headerRegex = /<header className="relative z-10 min-h-\[70vh\].*?<\/header>/s;
home = home.replace(headerRegex, '<HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />');

const projRegex = /<section id="projects".*?<\/section>/s;
home = home.replace(projRegex, '<ProjectsSection pd={pd} triggerToast={triggerToast} activeProjects={activeProjects} isLoading={isLoading} isDark={isDark} focusedProject={focusedProject} setFocusedProject={setFocusedProject} setSelectedProject={setSelectedProject} getTagProjectCount={getTagProjectCount} />');

const profRegex = /<section id="proficiency".*?<\/section>/s;
home = home.replace(profRegex, '<ProficiencySection renderIcon={renderIcon} activeRoadmap={activeRoadmap} activeCurrentFocus={activeCurrentFocus} activeProficiency={activeProficiency} isLoading={isLoading} isDark={isDark} />');

const expRegex = /<section id="experience".*?<\/section>/s;
home = home.replace(expRegex, '<ExperienceSection activeWork={activeWork} activeRoadmap={activeRoadmap} gh={gh} isLoading={isLoading} isDark={isDark} renderIcon={renderIcon} legendLevels={legendLevels} />');

const testRegex = /<section id="testimonials".*?<\/section>/s;
home = home.replace(testRegex, '<TestimonialsSection testimonialsList={testimonialsList} isLoading={isLoading} setSelectedTestimonial={setSelectedTestimonial} />');

// Remove dividers (like <div className="h-px bg-border/50 w-full" />)
home = home.replace(/<div className="h-px bg-border\/50 w-full" \/>/g, '');

const imports = `import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProficiencySection } from './components/ProficiencySection';
import { ExperienceSection } from './components/ExperienceSection';
import { TestimonialsSection } from './components/TestimonialsSection';\n`;

// Find first React import and put these after it
const reactImport = home.match(/import React.*?from 'react';/);
if (reactImport) {
    home = home.replace(reactImport[0], reactImport[0] + '\n' + imports);
}

fs.writeFileSync('src/views/home/ui/Home.tsx', home);
console.log('Stripped home.tsx');

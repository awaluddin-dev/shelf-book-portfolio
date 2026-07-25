const fs = require('fs');

const lines = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8').split('\n');

const imports = `import HeroSection from './sections/HeroSection';
import ProjectsSection from './sections/ProjectsSection';
import ProficiencySection from './sections/ProficiencySection';
import ExperienceSection from './sections/ExperienceSection';`;

// Find the line index where 'import ContactModal from "@/features/contact/ui/ContactModal";' is
let contactModalLine = lines.findIndex(l => l.includes('import ContactModal from "@/features/contact/ui/ContactModal";'));

if (contactModalLine !== -1) {
  lines.splice(contactModalLine, 0, imports);
}

// Since we added 4 lines, all indices after contactModalLine are shifted by +4.
// Let's re-read the array or just write a safer replacement method.

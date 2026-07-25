const fs = require('fs');

let content = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');

const importStatement = `import ContactModal from "@/features/contact/ui/ContactModal";
import MobileFilterModal from "./components/MobileFilterModal";
import ProjectModal from "./components/ProjectModal";
import TestimonialModal from "./components/TestimonialModal";`;

content = content.replace('import ContactModal from "@/features/contact/ui/ContactModal";', importStatement);

const mobileFilterReplacement = `          {/* Mobile Filter Modal */}
          <MobileFilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />`;

const projectModalReplacement = `      {/* Project Modal */}
      <ProjectModal 
        selectedProject={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onPrevProject={handlePrevProject} 
        onNextProject={handleNextProject} 
        onSelectProject={setSelectedProject}
        isBannerMinimized={isBannerMinimized} 
        setIsBannerMinimized={setIsBannerMinimized} 
        isDark={isDark} 
        getRelatedProjects={getRelatedProjects} 
        getTechIconAndColor={getTechIconAndColor} 
        getTagProjectCount={getTagProjectCount} 
        TECHNICAL_IMAGERY={TECHNICAL_IMAGERY} 
      />`;

const testimonialModalReplacement = `      {/* Testimonial Modal */}
      <TestimonialModal 
        selectedTestimonial={selectedTestimonial} 
        onClose={() => setSelectedTestimonial(null)} 
      />`;

const mobileFilterOriginal = fs.readFileSync('.gemini/scratch/MobileFilterModal.txt', 'utf-8');
const projectModalOriginal = fs.readFileSync('.gemini/scratch/ProjectModal.txt', 'utf-8');
const testimonialModalOriginal = fs.readFileSync('.gemini/scratch/TestimonialModal.txt', 'utf-8');

if (content.includes(testimonialModalOriginal)) {
  content = content.replace(testimonialModalOriginal, testimonialModalReplacement);
  console.log("Replaced Testimonial Modal");
} else {
  console.log("Could not find Testimonial Modal");
}

if (content.includes(projectModalOriginal)) {
  content = content.replace(projectModalOriginal, projectModalReplacement);
  console.log("Replaced Project Modal");
} else {
  console.log("Could not find Project Modal");
}

if (content.includes(mobileFilterOriginal)) {
  content = content.replace(mobileFilterOriginal, mobileFilterReplacement);
  console.log("Replaced Mobile Filter Modal");
} else {
  console.log("Could not find Mobile Filter Modal");
}

fs.writeFileSync('src/views/home/ui/Home.tsx', content);

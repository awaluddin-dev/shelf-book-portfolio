const fs = require('fs');
let home = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');
home = home.replace(
    '<HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />\n\n<ProjectsSection',
    '<HeroSection pd={pd} gh={gh} isLoading={isLoading} isDark={isDark} activeMetrics={activeMetrics} renderIcon={renderIcon} setShowInquiryModal={setShowInquiryModal} triggerToast={triggerToast} />\n      </section>\n\n<ProjectsSection'
);
fs.writeFileSync('src/views/home/ui/Home.tsx', home);

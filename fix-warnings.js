const fs = require('fs');
let content = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');

// 1. Remove unused lucide-react icons
const icons = ['ArrowRight', 'BarChart2', 'BookOpen', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Download', 'Filter', 'GitCommit', 'Github', 'Linkedin', 'Mail', 'Milestone', 'PenTool', 'Quote', 'Search', 'Sparkles', 'X'];
icons.forEach(icon => {
    content = content.replace(new RegExp(`\\b${icon}\\b\\s*,?\\s*`, 'g'), '');
});
content = content.replace(/import\s*\{\s*\}\s*from\s*"lucide-react";/g, '');

// 2. Remove unused recharts imports
const recharts = ['ResponsiveContainer', 'AreaChart', 'Area', 'BarChart', 'Bar', 'XAxis', 'YAxis', 'Tooltip', 'CartesianGrid', 'Legend', 'PieChart', 'Pie', 'Cell'];
recharts.forEach(comp => {
    content = content.replace(new RegExp(`\\b${comp}\\b\\s*,?\\s*`, 'g'), '');
});
content = content.replace(/import\s*\{\s*\}\s*from\s*"recharts";/g, '');

// 3. Remove unused local component imports
const components = ['CircuitBoardBg', 'SkillTree', 'P5Background', 'BookItem', 'ContactModal'];
components.forEach(comp => {
    content = content.replace(new RegExp(`import.*?\\b${comp}\\b.*?\\n`, 'g'), '');
});

// 4. Comment out or prefix unused state variables to avoid TS errors
const states = [
    'chartType', 'setChartType', 'setSearchQuery', 'setSelectedCategory', 'selectedTestimonial',
    'hoveredMonth', 'setHoveredMonth', 'selectedLevelFilter', 'setSelectedLevelFilter',
    'setIsFilterModalOpen', 'setSortBy', 'selectedRoadmapIndex', 'setSelectedRoadmapIndex',
    'activeExpIdx', 'setActiveExpIdx', 'activeTooltipDate', 'hoveredLang', 'setHoveredLang', 'mounted'
];
states.forEach(s => {
    // We will just prefix them with _
    content = content.replace(new RegExp(`\\b${s}\\b`, 'g'), `_${s}`);
});

// 5. Prefix unused destructured variables
const destructures = ['timelineData', 'repoData', 'languageData', 'heatmapStats', 'monthsData', 'categories', 'scrollShelf', 'handleTouchStart', 'handleTouchEnd', 'handleTouchMove'];
destructures.forEach(s => {
    content = content.replace(new RegExp(`\\b${s}\\b`, 'g'), `_${s}`);
});

// Cleanup empty imports again just in case
content = content.replace(/,\s*\}/g, ' }');

fs.writeFileSync('src/views/home/ui/Home.tsx', content);
console.log('Warnings fixed');

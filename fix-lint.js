const fs = require('fs');

function _removeUnusedImports(filePath, unusedVars) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    unusedVars.forEach(v => {
        // Remove from import { ... }
        const regex1 = new RegExp(`\\b${v}\\s*,?\\s*`, 'g');
        content = content.replace(regex1, _match => {
            // Check if it's inside an import
            return ''; // This is a bit risky but mostly safe for these specific icons
        });
        
        // Specifically for lucide-react or recharts imports
        // we can just replace the exact word
    });
    
    // Clean up empty imports
    content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?/g, '');
    content = content.replace(/,\s*\}/g, ' }');
    
    fs.writeFileSync(filePath, content);
}

// 1. Fix test files (unused useRouter, container, resolveMermaid, etc)
const testFiles = [
    '__tests__/AdminArchitecture.test.tsx',
    '__tests__/AdminCurrent.test.tsx',
    '__tests__/AdminDashboard.test.tsx',
    '__tests__/AdminLearning.test.tsx',
    '__tests__/AdminLifecycle.test.tsx',
    '__tests__/AdminPlayground.test.tsx',
    '__tests__/AdminProficiency.test.tsx',
    '__tests__/AdminProjects.test.tsx',
    '__tests__/AdminSkill.test.tsx',
    '__tests__/AdminTestimoni.test.tsx',
    '__tests__/AdminWork.test.tsx',
];
testFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/const router = useRouter\(\);/g, '');
        content = content.replace(/import \{ useRouter \} from 'next\/navigation';/g, '');
        content = content.replace(/useRouter/g, '');
        fs.writeFileSync(f, content);
    }
});

// For AdminLogin
if (fs.existsSync('__tests__/AdminLogin.test.tsx')) {
    let content = fs.readFileSync('__tests__/AdminLogin.test.tsx', 'utf8');
    content = content.replace(/const \{ container \} = render/g, 'render');
    fs.writeFileSync('__tests__/AdminLogin.test.tsx', content);
}

// For MermaidDiagram
if (fs.existsSync('__tests__/MermaidDiagram.test.tsx')) {
    let content = fs.readFileSync('__tests__/MermaidDiagram.test.tsx', 'utf8');
    content = content.replace(/let resolveMermaid: any;/g, '');
    content = content.replace(/const \{ container \} = render/g, 'render');
    fs.writeFileSync('__tests__/MermaidDiagram.test.tsx', content);
}

// 2. Fix Home.tsx unused states
if (fs.existsSync('src/views/home/ui/Home.tsx')) {
    let content = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf8');
    
    const unusedStates = [
        'chartType', 'setChartType', 'hoveredMonth', 'setHoveredMonth', 
        'selectedLevelFilter', 'setSelectedLevelFilter', 'selectedRoadmapIndex', 'setSelectedRoadmapIndex',
        'activeExpIdx', 'setActiveExpIdx', 'hoveredLang', 'setHoveredLang', 'mounted', 'setMounted'
    ];
    
    unusedStates.forEach(s => {
        const r = new RegExp(`const\\s*\\[\\s*${s}\\s*,\\s*set[A-Za-z0-9_]+\\s*\\]\\s*=\\s*useState.*?;`, 'g');
        content = content.replace(r, '');
        const r2 = new RegExp(`const\\s*\\[\\s*[A-Za-z0-9_]+\\s*,\\s*${s}\\s*\\]\\s*=\\s*useState.*?;`, 'g');
        content = content.replace(r2, '');
    });
    
    // activeTooltipDate
    content = content.replace(/const \[activeTooltipDate, setActiveTooltipDate\] = useState.*?;\n/g, '');
    
    // timelineData, repoData, languageData, heatmapStats, monthsData
    content = content.replace(/const \{ timelineData, repoData, languageData, heatmapStats, monthsData \} = useMemo.*?\}\);/s, '');
    content = content.replace(/const \{ timelineData, repoData, languageData, heatmapStats, monthsData \} = gh \|\| \{\};/g, '');
    content = content.replace(/const timelineData.*?;\n/g, '');
    content = content.replace(/const repoData.*?;\n/g, '');
    content = content.replace(/const languageData.*?;\n/g, '');
    content = content.replace(/const heatmapStats.*?;\n/g, '');
    content = content.replace(/const monthsData.*?;\n/g, '');
    
    // categories
    content = content.replace(/const categories = useMemo.*?\];/s, '');
    
    // touch handlers
    content = content.replace(/const handleTouchStart =.*?};/s, '');
    content = content.replace(/const handleTouchEnd =.*?};/s, '');
    content = content.replace(/const handleTouchMove =.*?};/s, '');
    
    // scrollShelf
    content = content.replace(/const scrollShelf =.*?\};/s, '');
    
    fs.writeFileSync('src/views/home/ui/Home.tsx', content);
}

console.log('Lint auto fix applied');

const fs = require('fs');

const testFiles = [
    '__tests__/AdminArchitecture.test.tsx',
    '__tests__/AdminCurrent.test.tsx',
    '__tests__/AdminDashboard.test.tsx',
    '__tests__/AdminLearning.test.tsx',
    '__tests__/AdminLifecycle.test.tsx',
    '__tests__/AdminLogin.test.tsx',
    '__tests__/AdminPlayground.test.tsx',
    '__tests__/AdminProficiency.test.tsx',
    '__tests__/AdminProjects.test.tsx',
    '__tests__/AdminSkill.test.tsx',
    '__tests__/AdminTestimoni.test.tsx',
    '__tests__/AdminWork.test.tsx',
    '__tests__/ButtonSprinkles.test.tsx',
    '__tests__/MermaidDiagram.test.tsx',
    '__tests__/ThemeProvider.test.tsx',
    '__tests__/projects-data.test.ts',
    '__tests__/tech-icons.test.tsx'
];

testFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Prefix useRouter
    content = content.replace(/\buseRouter\b/g, '_useRouter');
    
    // Prefix container
    content = content.replace(/\bcontainer\b/g, '_container');
    
    // Prefix resolveMermaid
    content = content.replace(/\bresolveMermaid\b/g, '_resolveMermaid');
    
    // Prefix fireEvent, within, screen
    content = content.replace(/\bfireEvent\b/g, '_fireEvent');
    content = content.replace(/\bwithin\b/g, '_within');
    content = content.replace(/\bscreen\b/g, '_screen');
    
    // Prefix projects
    content = content.replace(/\bprojects\b/g, '_projects');
    
    // Prefix render in tech-icons
    if (file === '__tests__/tech-icons.test.tsx') {
        content = content.replace(/\brender\b/g, '_render');
    }

    fs.writeFileSync(file, content);
});

console.log('Test warnings fixed');

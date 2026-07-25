const fs = require('fs');

let heroCode = fs.readFileSync('src/views/home/ui/sections/HeroSection.tsx', 'utf-8');
heroCode = heroCode.replace(/isLoading: boolean;/g, 'isLoading: boolean;\n  isDark: boolean;');
heroCode = heroCode.replace(/isLoading\n}: HeroSectionProps\) {/g, 'isLoading,\n  isDark\n}: HeroSectionProps) {');
fs.writeFileSync('src/views/home/ui/sections/HeroSection.tsx', heroCode);

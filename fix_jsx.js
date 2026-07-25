const fs = require('fs');
let code = fs.readFileSync('src/views/home/ui/sections/ProjectsSection.tsx', 'utf-8');
code = code.replace(/      <\/section>\n    <\/>\n  \);\n}/, '    </>\n  );\n}');
fs.writeFileSync('src/views/home/ui/sections/ProjectsSection.tsx', code);

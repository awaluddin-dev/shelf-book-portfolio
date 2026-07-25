const fs = require('fs');

let homeCode = fs.readFileSync('src/views/home/ui/Home.tsx', 'utf-8');
homeCode = homeCode.replace(/        heatmapStats={heatmapStats}\n/g, '');
fs.writeFileSync('src/views/home/ui/Home.tsx', homeCode);

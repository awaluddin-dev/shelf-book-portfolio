const fs = require('fs');

const lintOutput = fs.readFileSync('lint-output.txt', 'utf8').split('\n');

let currentFile = '';

lintOutput.forEach(line => {
    if (line.startsWith('/')) {
        currentFile = line.trim();
    } else if (line.includes('warning') && line.includes('never used')) {
        const match = line.match(/^\s*(\d+):(\d+)\s+warning\s+'([^']+)'/);
        if (match && currentFile) {
            const lineNum = parseInt(match[1]) - 1;
            const colNum = parseInt(match[2]) - 1;
            const varName = match[3];

            if (fs.existsSync(currentFile)) {
                let fileLines = fs.readFileSync(currentFile, 'utf8').split('\n');
                let targetLine = fileLines[lineNum];
                
                if (targetLine.includes('import ')) {
                    // Try to remove from import
                    const regex = new RegExp(`\\b${varName}\\s*,?\\s*`);
                    targetLine = targetLine.replace(regex, '');
                    targetLine = targetLine.replace(/,\s*\}/g, ' }');
                    targetLine = targetLine.replace(/\{\s*\}/g, '');
                    if (targetLine.trim() === 'import from "lucide-react";' || targetLine.trim() === 'import from "recharts";' || targetLine.trim() === 'import from "motion/react";' || targetLine.trim() === 'import  from "react";') {
                        targetLine = '';
                    }
                } else {
                    // Prefix with underscore
                    const regex = new RegExp(`\\b${varName}\\b`);
                    targetLine = targetLine.replace(regex, `_${varName}`);
                }
                
                fileLines[lineNum] = targetLine;
                fs.writeFileSync(currentFile, fileLines.join('\n'));
            }
        }
    }
});

// Post processing for empty imports
const files = [...new Set(lintOutput.filter(l => l.startsWith('/')).map(l => l.trim()))];
files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/import\s*from\s*['"][^'"]+['"];?/g, '');
        content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?/g, '');
        fs.writeFileSync(f, content);
    }
});

console.log('Auto fix applied');

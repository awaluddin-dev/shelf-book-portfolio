const fs = require('fs');

const svgFile = '/home/awaluddin/workshop/shelf-book-portofolio/src/shared/ui/CircuitBoardBg.tsx';
let code = fs.readFileSync(svgFile, 'utf8');

const replacement = fs.readFileSync('/home/awaluddin/workshop/shelf-book-portofolio/scratch/transformed.txt', 'utf8');

// The block to replace starts at <defs>\n          <g id="circuit-quadrant">
// and ends after <use href="#circuit-quadrant" transform="scale(-1, -1)" />
const startIndex = code.indexOf('<defs>\n          <g id="circuit-quadrant">');
const endString = '<use href="#circuit-quadrant" transform="scale(-1, -1)" />';
const endIndex = code.indexOf(endString) + endString.length;

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  
  // We don't need <defs> anymore for the quadrants, but we DO need <defs> for something else?
  // Actually, there's no other <defs> in that block! Wait, let's check if there are other defs.
  // We can just put the replacement directly inside the <svg>.
  
  const newCode = before + replacement + after;
  fs.writeFileSync(svgFile, newCode, 'utf8');
  console.log('patched successfully');
} else {
  console.log('could not find boundaries');
}

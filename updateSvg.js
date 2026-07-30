const fs = require('fs');

const path = './src/shared/ui/CircuitBoardBg.tsx';
// read original again since we didn't modify it on fail
// Actually we DID modify it but with same content
let content = fs.readFileSync(path, 'utf8');

const colorMap = {
  amb: '#fbbf24',
  cya: '#22d3ee',
  eme: '#10b981',
  pur: '#8b5cf6',
  ros: '#f43f5e',
  acc: '#00FF87'
};

const keyTimes = "0; 0.35; 0.45; 0.55; 0.65; 1";

// quadrantText is the input string, type is 'Fast Amber', dur is '16s'
function replaceNode(quadrantText, type, dur, rVal, oldColor, newColor) {
  const regex = new RegExp(`{/\\* ${type} \\*/}\\s*<g>\\s*<g>\\s*<circle r="${rVal}" fill="([^"]+)" fillOpacity="0.5" />\\s*<circle r="[\\d\\.]+" fill="#fff" />\\s*<animateMotion dur="${dur}"[^>]+/>\\s*<animate attributeName="opacity"[^>]+/>\\s*</g>\\s*<g>\\s*<text([^>]*)>(.*?)</text>\\s*<animateMotion dur="${dur}"[^>]+/>\\s*<animate attributeName="opacity"[^>]+/>\\s*</g>\\s*</g>`, 's');
  
  const match = quadrantText.match(regex);
  if (!match) {
    console.error(`Could not find match for ${type} with dur ${dur}`);
    return quadrantText;
  }
  
  const fullMatch = match[0];
  const currentFill = match[1];
  const textPropsMatch = match[2];
  const actualLabelText = match[3];
  
  const rAnimated = parseFloat(rVal) * 1.5;
  const newFill = newColor;
  
  const animatedFill = `<animate attributeName="fill" values="${newFill}; ${newFill}; ${colorMap.acc}; ${colorMap.acc}; ${newFill}; ${newFill}" keyTimes="${keyTimes}" dur="${dur}" repeatCount="indefinite" />`;
  const animatedR = `<animate attributeName="r" values="${rVal}; ${rVal}; ${rAnimated}; ${rAnimated}; ${rVal}; ${rVal}" keyTimes="${keyTimes}" dur="${dur}" repeatCount="indefinite" />`;

  const newCircleStr = `<circle r="${rVal}" fill="${newFill}" fillOpacity="0.5">\n                ${animatedFill}\n                ${animatedR}\n              </circle>`;
  
  let textProps = textPropsMatch.replace(/fill="[^"]+"/, `fill="${newFill}"`);
  textProps = textProps.replace(/textShadow:\s*"0 0 \d+px [^"]+"/, `textShadow: "0 0 3px ${newFill}"`);
  
  const newTextStr = `<text${textProps}>\n                ${animatedFill}\n                ${actualLabelText}\n              </text>`;

  let newMatch = fullMatch.replace(/<circle r="[\d\.]+" fill="[^"]+" fillOpacity="0.5" \/>/, newCircleStr);
  newMatch = newMatch.replace(/<text[^>]*>.*?<\/text>/, newTextStr);

  return quadrantText.replace(fullMatch, newMatch);
}

const q1Start = content.indexOf('{/* Quadrant 1: Top Right */}');
const q2Start = content.indexOf('{/* Quadrant 2: Top Left */}');
const q3Start = content.indexOf('{/* Quadrant 3: Bottom Right */}');
const q4Start = content.indexOf('{/* Quadrant 4: Bottom Left */}');
const svgEnd = content.indexOf('</svg>', q4Start);

let q1 = content.slice(q1Start, q2Start);
let q2 = content.slice(q2Start, q3Start);
let q3 = content.slice(q3Start, q4Start);
let q4 = content.slice(q4Start, svgEnd);

// Q1
q1 = replaceNode(q1, 'Fast Amber', '16s', '4', colorMap.amb, colorMap.eme);
q1 = replaceNode(q1, 'Slow Cyan', '22s', '5', colorMap.cya, colorMap.cya);
q1 = replaceNode(q1, 'Medium Amber', '18s', '3', colorMap.amb, colorMap.amb);

// Q2
q2 = replaceNode(q2, 'Fast Amber', '17s', '4', colorMap.amb, colorMap.amb);
q2 = replaceNode(q2, 'Slow Cyan', '23s', '5', colorMap.cya, colorMap.cya);
q2 = replaceNode(q2, 'Medium Amber', '19s', '3', colorMap.amb, colorMap.pur);

// Q3
q3 = replaceNode(q3, 'Fast Amber', '15s', '4', colorMap.amb, colorMap.amb);
q3 = replaceNode(q3, 'Slow Cyan', '21s', '5', colorMap.cya, colorMap.ros);
q3 = replaceNode(q3, 'Medium Amber', '17s', '3', colorMap.amb, colorMap.amb);

// Q4
q4 = replaceNode(q4, 'Fast Amber', '16.5s', '4', colorMap.amb, colorMap.amb);
q4 = replaceNode(q4, 'Slow Cyan', '22.5s', '5', colorMap.cya, colorMap.cya);
q4 = replaceNode(q4, 'Medium Amber', '18.5s', '3', colorMap.amb, colorMap.amb);

const newContent = content.slice(0, q1Start) + q1 + q2 + q3 + q4 + content.slice(svgEnd);

fs.writeFileSync(path, newContent);
console.log('Update complete.');

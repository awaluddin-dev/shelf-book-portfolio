const fs = require('fs');
let content = fs.readFileSync('./src/shared/ui/CircuitBoardBg.tsx', 'utf8');

// We use replace with functions to do safe manipulation inside the node groups
const colorMap = {
  amb: '#fbbf24',
  cya: '#22d3ee',
  eme: '#10b981',
  pur: '#8b5cf6',
  ros: '#f43f5e',
  acc: '#00FF87'
};

const keyTimes = "0; 0.35; 0.45; 0.55; 0.65; 1";

function addAnimations(nodeStr, newColorStr, rVal, durStr, labelText) {
  const rAnimated = parseFloat(rVal) * 1.5;
  const animatedFill = `<animate attributeName="fill" values="${newColorStr}; ${newColorStr}; ${colorMap.acc}; ${colorMap.acc}; ${newColorStr}; ${newColorStr}" keyTimes="${keyTimes}" dur="${durStr}" repeatCount="indefinite" />`;
  const animatedR = `<animate attributeName="r" values="${rVal}; ${rVal}; ${rAnimated}; ${rAnimated}; ${rVal}; ${rVal}" keyTimes="${keyTimes}" dur="${durStr}" repeatCount="indefinite" />`;

  let updated = nodeStr;
  
  // replace <circle r="X" fill="Y" fillOpacity="0.5" />
  const circleRegex = new RegExp(`<circle r="${rVal}" fill="[^"]+" fillOpacity="0.5" />`);
  updated = updated.replace(circleRegex, `<circle r="${rVal}" fill="${newColorStr}" fillOpacity="0.5">\n                ${animatedFill}\n                ${animatedR}\n              </circle>`);
  
  // replace <text ...>label</text>
  const textRegex = new RegExp(`<text([^>]*)>(.*?)</text>`);
  updated = updated.replace(textRegex, (match, props, labelContent) => {
    let newProps = props.replace(/fill="[^"]+"/, `fill="${newColorStr}"`);
    newProps = newProps.replace(/textShadow:\s*"0 0 \d+px [^"]+"/, `textShadow: "0 0 3px ${newColorStr}"`);
    return `<text${newProps}>\n                ${animatedFill}\n                ${labelContent}\n              </text>`;
  });
  
  return updated;
}

// Q1
content = content.replace(/{[\s\S]*?{`{JSON}`}[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.eme, "4", "16s").replace('{/* Fast Amber */}', '{/* Fast Emerald */}');
});
content = content.replace(/{[\s\S]*?\[TENSOR\][\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.cya, "5", "22s");
});
content = content.replace(/{[\s\S]*?gRPC[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "3", "18s");
});

// Q2
content = content.replace(/{[\s\S]*?REST[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "4", "17s");
});
content = content.replace(/{[\s\S]*?GraphQL[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.cya, "5", "23s");
});
content = content.replace(/{[\s\S]*?Kafka[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.pur, "3", "19s").replace('{/* Medium Amber */}', '{/* Medium Purple */}');
});

// Q3
content = content.replace(/{[\s\S]*?Redis[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "4", "15s");
});
content = content.replace(/{[\s\S]*?Docker[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.ros, "5", "21s").replace('{/* Slow Cyan */}', '{/* Slow Rose */}');
});
content = content.replace(/{[\s\S]*?SQL[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "3", "17s");
});

// Q4
content = content.replace(/{[\s\S]*?OAuth[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "4", "16.5s");
});
content = content.replace(/{[\s\S]*?CUDA[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.cya, "5", "22.5s");
});
content = content.replace(/{[\s\S]*?Python[\s\S]*?<\/g>\s*<\/g>/, match => {
  return addAnimations(match, colorMap.amb, "3", "18.5s");
});

fs.writeFileSync('./src/shared/ui/CircuitBoardBg.tsx', content);
console.log('Update finished.');

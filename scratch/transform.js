const fs = require('fs');

const svgSource = `
            {/* Center Processor Chip (Quarter) */}
            <rect x="0" y="0" width="80" height="80" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
            <rect x="0" y="0" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="10" y="10" width="45" height="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32.5" cy="32.5" r="15" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />

            {/* Chip pins */}
            <path d="M 80,15 L 95,15 M 80,35 L 95,35 M 80,55 L 95,55 M 80,75 L 95,75" stroke="currentColor" strokeWidth="2" />
            <path d="M 15,80 L 15,95 M 35,80 L 35,95 M 55,80 L 55,95 M 75,80 L 75,95" stroke="currentColor" strokeWidth="2" />

            {/* Glowing / Thick Data Buses */}
            <path d="M 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" fill="none" stroke="currentColor" strokeWidth="2.5" />

            {/* Static Traces with pulsing glow */}
            <g>
              <animate attributeName="opacity" values="0.1;1;0.1" dur="4s" repeatCount="indefinite" />
              {/* Standard Traces */}
              <path d="M 95,35 L 130,35 L 180,85 L 280,85 L 330,135 L 500,135" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,55 L 110,55 L 160,105 L 250,105 L 300,155 L 450,155 L 500,205" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 35,95 L 35,130 L 85,180 L 85,280 L 135,330 L 135,500" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 55,95 L 55,110 L 105,160 L 105,250 L 155,300 L 155,450 L 205,500" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 75,95 L 75,105 L 110,140 L 110,220 L 160,270 L 160,350 L 210,400 L 210,500" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Dense 45-degree corner memory bus */}
              <path d="M 200,200 L 250,250 L 500,250" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 190,210 L 240,260 L 500,260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 180,220 L 230,270 L 500,270" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 170,230 L 220,280 L 500,280" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 160,240 L 210,290 L 500,290" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 200,200 L 250,150 L 250,0" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 210,190 L 260,140 L 260,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 220,180 L 270,130 L 270,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 230,170 L 280,120 L 280,0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 240,160 L 290,110 L 290,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>

            {/* Vias (Nodes/Circles) */}
            <circle cx="500" cy="115" r="4" fill="currentColor" />
            <circle cx="115" cy="500" r="4" fill="currentColor" />
            <circle cx="500" cy="155" r="3" fill="currentColor" />
            <circle cx="155" cy="450" r="3" fill="currentColor" />
            <circle cx="280" cy="85" r="2.5" fill="currentColor" />
            <circle cx="85" cy="280" r="2.5" fill="currentColor" />
            <circle cx="200" cy="200" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="200" r="1.5" fill="currentColor" />

            {/* Component Blocks */}
            <rect x="320" y="320" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="325" y="325" width="30" height="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="300" y="400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="307.5" cy="407.5" r="3" fill="currentColor" />
            <path d="M 400,320 L 400,280 L 450,230 L 500,230" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
`;

function transformSVG(svg, scaleX, scaleY) {
  let res = svg;

  // Transform paths
  res = res.replace(/d="([^"]+)"/g, (match, d) => {
    const newD = d.replace(/([ML])\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g, (m, cmd, x, y) => {
      const nx = parseFloat(x) * scaleX;
      const ny = parseFloat(y) * scaleY;
      return cmd + ' ' + nx + ',' + ny;
    });
    return 'd="' + newD + '"';
  });

  // Transform rects
  res = res.replace(/<rect([^>]+)>/g, (match, attrs) => {
    let x = 0, y = 0, width = 0, height = 0;
    const xMatch = attrs.match(/x="(-?\d+(?:\.\d+)?)"/);
    if (xMatch) x = parseFloat(xMatch[1]);
    const yMatch = attrs.match(/y="(-?\d+(?:\.\d+)?)"/);
    if (yMatch) y = parseFloat(yMatch[1]);
    const wMatch = attrs.match(/width="(-?\d+(?:\.\d+)?)"/);
    if (wMatch) width = parseFloat(wMatch[1]);
    const hMatch = attrs.match(/height="(-?\d+(?:\.\d+)?)"/);
    if (hMatch) height = parseFloat(hMatch[1]);

    let nx = x;
    let ny = y;
    if (scaleX === -1) nx = - (x + width);
    if (scaleY === -1) ny = - (y + height);

    let newAttrs = attrs;
    if (xMatch) newAttrs = newAttrs.replace(xMatch[0], 'x="' + nx + '"');
    if (yMatch) newAttrs = newAttrs.replace(yMatch[0], 'y="' + ny + '"');
    return '<rect' + newAttrs + '>';
  });

  // Transform circles
  res = res.replace(/<circle([^>]+)>/g, (match, attrs) => {
    let cx = 0, cy = 0;
    const cxMatch = attrs.match(/cx="(-?\d+(?:\.\d+)?)"/);
    if (cxMatch) cx = parseFloat(cxMatch[1]);
    const cyMatch = attrs.match(/cy="(-?\d+(?:\.\d+)?)"/);
    if (cyMatch) cy = parseFloat(cyMatch[1]);

    let ncx = cx * scaleX;
    let ncy = cy * scaleY;

    let newAttrs = attrs;
    if (cxMatch) newAttrs = newAttrs.replace(cxMatch[0], 'cx="' + ncx + '"');
    if (cyMatch) newAttrs = newAttrs.replace(cyMatch[0], 'cy="' + ncy + '"');
    return '<circle' + newAttrs + '>';
  });

  return res;
}

const q1 = transformSVG(svgSource, 1, 1);
const q2 = transformSVG(svgSource, -1, 1);
const q3 = transformSVG(svgSource, 1, -1);
const q4 = transformSVG(svgSource, -1, -1);

const combined = '          {/* Quadrant 1 (Bottom Right -> original positive coords) */}\n          <g id="circuit-quadrant-1">\n' + q1 + '          </g>\n          {/* Quadrant 2 (Bottom Left) */}\n          <g id="circuit-quadrant-2">\n' + q2 + '          </g>\n          {/* Quadrant 3 (Top Right) */}\n          <g id="circuit-quadrant-3">\n' + q3 + '          </g>\n          {/* Quadrant 4 (Top Left) */}\n          <g id="circuit-quadrant-4">\n' + q4 + '          </g>\n';

fs.writeFileSync('/home/awaluddin/workshop/shelf-book-portofolio/scratch/transformed.txt', combined);
console.log('done');

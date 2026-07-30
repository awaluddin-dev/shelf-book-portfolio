const fs = require('fs');
let content = fs.readFileSync('./src/shared/ui/CircuitBoardBg.tsx', 'utf8');

const transforms = [
  // Q1
  {
    find: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-9" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>{\`{JSON}\`}</text>`,
    replace: `{/* Fast Emerald */}
          <g>
            <g>
              <circle r="4" fill="#10b981" fillOpacity="0.5">
                <animate attributeName="fill" values="#10b981; #10b981; #00FF87; #00FF87; #10b981; #10b981" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16s" repeatCount="indefinite" />
                <animate attributeName="r" values="4; 4; 6; 6; 4; 4" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-9" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #10b981" }}>
                <animate attributeName="fill" values="#10b981; #10b981; #00FF87; #00FF87; #10b981; #10b981" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16s" repeatCount="indefinite" />
                {\`{JSON}\`}
              </text>`
  },
  {
    find: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5" />
              <circle r="2" fill="#fff" />
              <animateMotion dur="22s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-10" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>[TENSOR]</text>`,
    replace: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5">
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22s" repeatCount="indefinite" />
                <animate attributeName="r" values="5; 5; 7.5; 7.5; 5; 5" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22s" repeatCount="indefinite" />
              </circle>
              <circle r="2" fill="#fff" />
              <animateMotion dur="22s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-10" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22s" repeatCount="indefinite" />
                [TENSOR]
              </text>`
  },
  {
    find: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1" fill="#fff" />
              <animateMotion dur="18s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-7" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>gRPC</text>`,
    replace: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18s" repeatCount="indefinite" />
                <animate attributeName="r" values="3; 3; 4.5; 4.5; 3; 3" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18s" repeatCount="indefinite" />
              </circle>
              <circle r="1" fill="#fff" />
              <animateMotion dur="18s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text x="0" y="-7" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18s" repeatCount="indefinite" />
                gRPC
              </text>`
  },
  
  // Q2
  {
    find: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="17s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-9" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>REST</text>`,
    replace: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
                <animate attributeName="r" values="4; 4; 6; 6; 4; 4" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="17s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-9" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
                REST
              </text>`
  },
  {
    find: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5" />
              <circle r="2" fill="#fff" />
              <animateMotion dur="23s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-10" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>GraphQL</text>`,
    replace: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5">
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="23s" repeatCount="indefinite" />
                <animate attributeName="r" values="5; 5; 7.5; 7.5; 5; 5" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="23s" repeatCount="indefinite" />
              </circle>
              <circle r="2" fill="#fff" />
              <animateMotion dur="23s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-10" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="23s" repeatCount="indefinite" />
                GraphQL
              </text>`
  },
  {
    find: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1" fill="#fff" />
              <animateMotion dur="19s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-7" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>Kafka</text>`,
    replace: `{/* Medium Purple */}
          <g>
            <g>
              <circle r="3" fill="#8b5cf6" fillOpacity="0.5">
                <animate attributeName="fill" values="#8b5cf6; #8b5cf6; #00FF87; #00FF87; #8b5cf6; #8b5cf6" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="19s" repeatCount="indefinite" />
                <animate attributeName="r" values="3; 3; 4.5; 4.5; 3; 3" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="19s" repeatCount="indefinite" />
              </circle>
              <circle r="1" fill="#fff" />
              <animateMotion dur="19s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, 1)" x="0" y="-7" fill="#8b5cf6" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #8b5cf6" }}>
                <animate attributeName="fill" values="#8b5cf6; #8b5cf6; #00FF87; #00FF87; #8b5cf6; #8b5cf6" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="19s" repeatCount="indefinite" />
                Kafka
              </text>`
  },

  // Q3
  {
    find: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="15s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="15" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>Redis</text>`,
    replace: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="15s" repeatCount="indefinite" />
                <animate attributeName="r" values="4; 4; 6; 6; 4; 4" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="15s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="15s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="15" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="15s" repeatCount="indefinite" />
                Redis
              </text>`
  },
  {
    find: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5" />
              <circle r="2" fill="#fff" />
              <animateMotion dur="21s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="15" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>Docker</text>`,
    replace: `{/* Slow Rose */}
          <g>
            <g>
              <circle r="5" fill="#f43f5e" fillOpacity="0.5">
                <animate attributeName="fill" values="#f43f5e; #f43f5e; #00FF87; #00FF87; #f43f5e; #f43f5e" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="21s" repeatCount="indefinite" />
                <animate attributeName="r" values="5; 5; 7.5; 7.5; 5; 5" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="21s" repeatCount="indefinite" />
              </circle>
              <circle r="2" fill="#fff" />
              <animateMotion dur="21s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="15" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #f43f5e" }}>
                <animate attributeName="fill" values="#f43f5e; #f43f5e; #00FF87; #00FF87; #f43f5e; #f43f5e" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="21s" repeatCount="indefinite" />
                Docker
              </text>`
  },
  {
    find: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1" fill="#fff" />
              <animateMotion dur="17s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="12" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>SQL</text>`,
    replace: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
                <animate attributeName="r" values="3; 3; 4.5; 4.5; 3; 3" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
              </circle>
              <circle r="1" fill="#fff" />
              <animateMotion dur="17s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(1, -1)" x="0" y="12" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="17s" repeatCount="indefinite" />
                SQL
              </text>`
  },

  // Q4
  {
    find: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="16.5s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="15" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>OAuth</text>`,
    replace: `{/* Fast Amber */}
          <g>
            <g>
              <circle r="4" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="4; 4; 6; 6; 4; 4" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="#fff" />
              <animateMotion dur="16.5s" repeatCount="indefinite" rotate="auto" path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="15" fill="#fbbf24" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="16.5s" repeatCount="indefinite" />
                OAuth
              </text>`
  },
  {
    find: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5" />
              <circle r="2" fill="#fff" />
              <animateMotion dur="22.5s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="15" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>CUDA</text>`,
    replace: `{/* Slow Cyan */}
          <g>
            <g>
              <circle r="5" fill="#22d3ee" fillOpacity="0.5">
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="5; 5; 7.5; 7.5; 5; 5" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22.5s" repeatCount="indefinite" />
              </circle>
              <circle r="2" fill="#fff" />
              <animateMotion dur="22.5s" repeatCount="indefinite" rotate="auto" path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="15" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 3px #22d3ee" }}>
                <animate attributeName="fill" values="#22d3ee; #22d3ee; #00FF87; #00FF87; #22d3ee; #22d3ee" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="22.5s" repeatCount="indefinite" />
                CUDA
              </text>`
  },
  {
    find: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5" />
              <circle r="1" fill="#fff" />
              <animateMotion dur="18.5s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="12" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>Python</text>`,
    replace: `{/* Medium Amber */}
          <g>
            <g>
              <circle r="3" fill="#fbbf24" fillOpacity="0.5">
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="3; 3; 4.5; 4.5; 3; 3" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1" fill="#fff" />
              <animateMotion dur="18.5s" repeatCount="indefinite" rotate="auto" path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </g>
            <g>
              <text transform="scale(-1, -1)" x="0" y="12" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 0 2px #fbbf24" }}>
                <animate attributeName="fill" values="#fbbf24; #fbbf24; #00FF87; #00FF87; #fbbf24; #fbbf24" keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur="18.5s" repeatCount="indefinite" />
                Python
              </text>`
  }
];

let replaced = 0;
for (const t of transforms) {
  if (content.includes(t.find)) {
    content = content.replace(t.find, t.replace);
    replaced++;
  } else {
    console.error('Could not find chunk:', t.find.split('\n')[0]);
  }
}

fs.writeFileSync('./src/shared/ui/CircuitBoardBg.tsx', content);
console.log(`Replaced ${replaced} out of ${transforms.length}`);

import React = require("react");
import "./style.scss"

export const Legend = () => (

    <img src={"./legend.png"} style={{ position: "absolute", bottom: 30, left: 10, border: "2px solid rgba(0, 0, 0, 0.2)", borderRadius: "5px" }}/>
)

// <img src={"./legend.png"} style={{position : "absolute", bottom: 30, left: 10}}/>

//
//     <svg id={"legenda"} height="190" width="420" style={{position : "absolute", bottom: 30, left: 10}}>
// <defs>
// <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
//     <stop offset="0%" stopColor={"rgb(60,160,225)"}  stopOpacity={1}/>
// <stop offset="50%" stopColor={"rgb(255,255,255)"}  stopOpacity={1}/>
// <stop offset="75%" stopColor={"rgb(255,200,180)"}  stopOpacity={1}/>
// <stop offset="100%" stopColor={"rgb(255,0,0)"}  stopOpacity={1}/>
// </linearGradient>
// </defs>
// <rect x="0" y="0" width={420} height={160} />
//
// <text x="170" y="15" fill="black">Legenda</text>
// <line x1="5" y1="10" x2="25" y2="10" stroke={"rgb(227,26,28)"} strokeWidth={2} />
// <text x="30" y="15" fill="black">A</text>
// <line x1="5" y1="30" x2="25" y2="30" stroke={"rgb(227,26,28)"} strokeWidth={1.4}/>
// <text x="30" y="35" fill="black">S</text>
// <line x1="5" y1="50" x2="25" y2="50" stroke={"rgb(51,160,44)"} strokeWidth={1}/>
// <text x="30" y="55" fill="black">DK</text>
// <rect x="5" y="65" width="20" height="10" fill={"transparent"} stroke={"black"} strokeWidth={1}/>
// <text x="30" y="75" fill="black">Województwa</text>
//
//
//
// <polygon points="15,120 370,90 370,140 15,140" fill={"url(#grad1)"}/>
// <circle cx="15" cy="130" r="10" stroke="black" stroke-width="0.5" fill="rgb(60,160,225)" />
// <circle cx="103.75" cy="126.25" r="13.75" stroke="black" stroke-width="0.5" fill="transparent" />
// <circle cx="192.5" cy="122.5" r="17.5" stroke="black" stroke-width="0.5" fill="transparent" />
// <circle cx="281.25" cy="118.75" r="21.25" stroke="black" stroke-width="0.5" fill="transparent" />
// <circle cx="370" cy="115" r="25" stroke="black" stroke-width="0.5" fill="red" />
//
// <text x="165" y="95" fill="black">DR/SDRR</text>
// <text x="2" y="155" fill="black">{"<0,4"}</text>
// <text x="94" y="155" fill="black">0,7</text>
// <text x="189" y="155" fill="black">1,0</text>
// <text x="270" y="155" fill="black">1,3</text>
// <text x="355" y="155" fill="black">>1,6</text>
//
// </svg>


Home hero, version 1 (archived 2026-09-24)

These are copies of the halftone ALOBI hero exactly as it was on 2026-09-24:
the long opening animation (the ZH mark, the sweep line, the rising field),
the ARCH / PD / PM retype and the eye, over a field of halftone squares.

This hero is live again, with one change: the background is now a field of
fine lines instead of squares (pattern: 'lines' in home-arrival.js). To get
the squares back, in home-arrival.js remove
  pattern:'lines',cellSize:innerWidth<700?5:8,dotSize:1,lineDrift:30,color:'#1d1d1f',hoverColor:'#1d1d1f',backgroundColor:'#ffffff',speed:1,scale:1,contrast:1.1,brightness:.4,
and put back
  cellSize:8,dotSize:.75,color:'#000000',hoverColor:'#7b6f6f',backgroundColor:'#ffffff',speed:1,scale:1,contrast:.95,brightness:.37,
change splashRadius:120 back to splashRadius:62, and remove
"border-bottom:1px solid #1d1d1f;" from .shape-waves-host in home-arrival.css.
(Or copy home-arrival.js and home-arrival.css from this folder.)

hero-canvas.js / hero-canvas.css in the site root are the "design canvas"
cover that was tried and set aside on 2026-09-24. Nothing loads them.

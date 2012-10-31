Matrix code rain
================

Attempt to create some *Matrix* code rain in `canvas`. See experiment write up [here](http://neilcarpenter.com/labs/matrix-rain/). Performance isn't great on large displays, and it doens't work at all in Firefox for some reason.

**See live demo [here](http://neilcarpenter.com/demos/canvas/matrix/)**

Uses [stats.js](https://github.com/mrdoob/stats.js/) for the performance logging, and *Matrix* font is from [here](http://www.dafont.com/matrix-code-nfi.font).

TO DO

- Improve performance, aim for 60FPS with as many code columns as possible
- Randomly replace code characters as code falls - I already had this working, but was causing too much of a performance hit
- Add feature where you can type and whatever you write will appear in the code as it falls
- Add something with `getUserMedia()` and webcam outline interacting with falling code
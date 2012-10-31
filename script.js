// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¶ller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// stats
var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );


var M = {

	settings: {
		COL_WIDTH: 20,
		COL_HEIGHT: 25,
		VELOCITY_PARAMS: {
			min: 4,
			max: 8
		},
		CODE_LENGTH_PARAMS: {
			min: 20,
			max: 40
		}
	},

	animation: null,

	c: null,
	ctx: null,

	lineC: null,
	ctx2: null,

	WIDTH: window.innerWidth,
	HEIGHT: window.innerHeight,

	COLUMNS: null,

	// font from here http://www.dafont.com/matrix-code-nfi.font
	font: '30px matrix-code',
	letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '$', '+', '-', '*', '/', '=', '%', '"', '\'', '#', '&', '_', '(', ')', ',', '.', ';', ':', '?', '!', '\\', '|', '{', '}', '<', '>', '[', ']', '^', '~'],
	
	codes: [],

	createCodeLoop: null,
	codesCounter: 0,

	init: function () {
		M.c = document.getElementById( 'canvas' );
		M.ctx = M.c.getContext( '2d' );
		M.c.width = M.WIDTH;
		M.c.height = M.HEIGHT;

		M.ctx.shadowBlur = 0;
		M.ctx.fillStyle = '#000';
		M.ctx.fillRect(0, 0, M.WIDTH, M.HEIGHT);
		M.ctx.font = M.font;

		M.COLUMNS = Math.ceil(M.WIDTH / M.settings.COL_WIDTH);

		for (var i = 0; i < M.COLUMNS; i++) {
			M.codes[i] = [];
			M.codes[i][0] = {
				'open': true,
				'position': {'x': 0, 'y': 0},
				'strength': 0
			};
		}

		M.loop();

		M.createLines();

		M.createCode();

		// not doing this, kills CPU
		// M.swapCharacters();

		window.onresize = function () {
			window.cancelAnimationFrame(M.animation);
			M.animation = null;
			M.ctx.clearRect(0, 0, M.WIDTH, M.HEIGHT);
			M.codesCounter = 0;

			M.ctx2.clearRect(0, 0, M.WIDTH, M.HEIGHT);

			M.WIDTH = window.innerWidth;
			M.HEIGHT = window.innerHeight;
			M.init();
		};
	},

	loop: function () {
		M.animation = requestAnimationFrame( function(){ M.loop(); } );
		M.draw();

		stats.update();
	},

	draw: function() {

		var codesLen = M.codes.length;
		var codeLen;
		var x;
		var y;
		var text;
		var velocity;
		var columnIndex;
		var strength;
		var fadeStrength;

		M.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
		M.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		M.ctx.fillRect(0, 0, M.WIDTH, M.HEIGHT);

		M.ctx.globalCompositeOperation = 'source-over';

		for (var i = 0; i < codesLen; i++) {
			
			velocity = M.codes[i][0].velocity;
			M.codes[i][0].position.y += velocity;

			y = M.codes[i][0].position.y;
			x = M.codes[i][0].position.x;
			codeLength = M.codes[i].length;
			strength = M.codes[i][0].strength;

			for (var j = 1; j < codeLength; j++) {
				text = M.codes[i][j];

				if (j < 5) {
					M.ctx.shadowColor = 'hsl(104, 79%, 74%)';
					M.ctx.shadowOffsetX = 0;
					M.ctx.shadowOffsetY = 0;
					M.ctx.shadowBlur = 10;
					M.ctx.fillStyle = 'hsla(104, 79%, ' + (100 - (j * 5)) + '%, ' + strength + ')';
				} else if (j > (codeLength - 4)) {
					fadeStrength = j / codeLength;
					fadeStrength = 1 - fadeStrength;

					M.ctx.shadowOffsetX = 0;
					M.ctx.shadowOffsetY = 0;
					M.ctx.shadowBlur = 0;
					M.ctx.fillStyle = 'hsla(104, 79%, 74%, ' + (fadeStrength + 0.3) + ')';
				} else {
					M.ctx.shadowOffsetX = 0;
					M.ctx.shadowOffsetY = 0;
					M.ctx.shadowBlur = 0;
					M.ctx.fillStyle = 'hsla(104, 79%, 74%, ' + strength + ')';
				}

				// M.ctx.fillStyle = 'hsl(104, 79%, ' + (M.codes[i][0].strength * 74) + '%)';
				M.ctx.fillText(text, x, (y - (j * M.settings.COL_HEIGHT)));

				if ((j === codeLength - 1) && (y - ((j + 1) * M.settings.COL_HEIGHT) > M.HEIGHT)) {
					columnIndex = M.codes[i][0].position.x / M.settings.COL_WIDTH;
					M.codes[columnIndex][0].open = true;
					M.codes[columnIndex][0].position.y = 0;
				}
			}
		}

	},

	createCode: function() {

		if (M.codesCounter === M.COLUMNS) {
			clearTimeout(M.createCodeLoop);
			return;
		}

		var randomInterval = M.randomFromInterval(0, 100);
		var column = M.assignColumn();

		if (column) {
			
			var codeLength = M.randomFromInterval(M.settings.CODE_LENGTH_PARAMS.min, M.settings.CODE_LENGTH_PARAMS.max);
			var codeVelocity = (Math.random() * (M.settings.VELOCITY_PARAMS.max - M.settings.VELOCITY_PARAMS.min)) + M.settings.VELOCITY_PARAMS.min;
			var lettersLength = M.letters.length;

			M.codes[column][0].position = {'x': (column * M.settings.COL_WIDTH), 'y': 0};
			M.codes[column][0].velocity = codeVelocity;
			M.codes[column][0].strength = M.codes[column][0].velocity / M.settings.VELOCITY_PARAMS.max;

			for (var i = 1; i <= codeLength; i++) {
				var newLetter = M.randomFromInterval(0, (lettersLength - 1));
				M.codes[column][i] = M.letters[newLetter];
			}

		}

		M.codesCounter++;

		M.createCodeLoop = setTimeout(M.createCode, randomInterval);

	},

	swapCharacters: function() {
		var randomCodeIndex;
		var randomCode;
		var randomCodeLen;
		var randomCharIndex;
		var newRandomCharIndex;
		var newRandomChar;

		for (var i = 0; i < 20; i++) {
			randomCodeIndex = M.randomFromInterval(0, (M.codes.length - 1));
			randomCode = M.codes[randomCodeIndex];
			randomCodeLen = randomCode.length;
			randomCharIndex = M.randomFromInterval(2, (randomCodeLen - 1));
			newRandomCharIndex = M.randomFromInterval(0, (M.letters.length - 1));
			newRandomChar = M.letters[newRandomCharIndex];
		
			randomCode[randomCharIndex] = newRandomChar;
		}

		M.swapCharacters();
	},

	createLines: function() {
		M.linesC = document.createElement('canvas');
		M.linesC.width = M.WIDTH;
		M.linesC.height = M.HEIGHT;
		M.linesC.style.position = 'absolute';
		M.linesC.style.top = 0;
		M.linesC.style.left = 0;
		M.linesC.style.zIndex = 10;
		document.body.appendChild(M.linesC);

		var linesYBlack = 0;
		var linesYWhite = 0;
		M.ctx2 = M.linesC.getContext('2d');

		M.ctx2.beginPath();

		M.ctx2.lineWidth = 1;
		M.ctx2.strokeStyle = 'rgba(0, 0, 0, 0.7)';

		while (linesYBlack < M.HEIGHT) {

			M.ctx2.moveTo(0, linesYBlack);
			M.ctx2.lineTo(M.WIDTH, linesYBlack);

			linesYBlack += 5;
		}

		M.ctx2.lineWidth = 0.15;
		M.ctx2.strokeStyle = 'rgba(255, 255, 255, 0.7)';

		while (linesYWhite < M.HEIGHT) {

			M.ctx2.moveTo(0, linesYWhite+1);
			M.ctx2.lineTo(M.WIDTH, linesYWhite+1);

			linesYWhite += 5;
		}

		M.ctx2.stroke();
	},

	assignColumn: function() {
		var randomColumn = M.randomFromInterval(0, (M.COLUMNS - 1));

		if (M.codes[randomColumn][0].open) {
			M.codes[randomColumn][0].open = false;
		} else {
			return false;
		}

		return randomColumn;
	},

	randomFromInterval: function(from, to) {
		return Math.floor(Math.random() * (to - from+ 1 ) + from);
	},

	snapshot: function() {
		window.open(M.c.toDataURL());
	}

};

function eventListenerz() {
	var controlToggles = document.getElementsByClassName('toggle-info');
	var controls = document.getElementById('info');
	var snapshotBtn = document.getElementById('snapshot');

	function toggleControls(e) {
		e.preventDefault();
		controls.className = controls.className === 'closed' ? '' : 'closed';
	}

	for (var j = 0; j < 2; j++) {
		controlToggles[j].addEventListener('click', toggleControls, false);
	}

	snapshotBtn.addEventListener('click', M.snapshot, false);

}

window.onload = function() {

	M.init();

	eventListenerz();

};
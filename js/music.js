// Background music. Plays the audio file in the button's data-src if set,
// otherwise a synthesized music-box "Happy Birthday" (public-domain melody).
// Starts on load when the browser allows it; otherwise on the visitor's first
// tap, click or key press anywhere on the page. The button pauses/resumes.
(function () {
	'use strict';

	var btn = document.getElementById('music-toggle');
	if (!btn) return;

	var playing = false;
	var userPaused = false;
	var player = btn.getAttribute('data-src') ? filePlayer(btn.getAttribute('data-src')) : synthPlayer();

	function setPlaying(on) {
		playing = on;
		btn.setAttribute('aria-pressed', String(on));
		btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
		btn.classList.toggle('is-playing', on);
		btn.classList.toggle('hint', !on && !userPaused);
	}

	// player.play() resolves to true only if sound is actually playing
	var starting = null;
	function start() {
		starting = starting || player.play().then(function (ok) {
			starting = null;
			if (ok) setPlaying(true);
			return ok;
		});
		return starting;
	}

	btn.addEventListener('click', function () {
		if (playing) {
			player.stop();
			userPaused = true;
			setPlaying(false);
		} else {
			userPaused = false;
			start();
		}
	});

	var gestures = ['pointerdown', 'touchend', 'keydown'];
	function onFirstGesture(e) {
		gestures.forEach(function (type) { document.removeEventListener(type, onFirstGesture, true); });
		// A tap on the music button itself is handled by its click listener
		if (btn.contains(e.target) || playing || userPaused) return;
		start();
	}

	start().then(function (ok) {
		if (!ok) {
			gestures.forEach(function (type) { document.addEventListener(type, onFirstGesture, true); });
		}
	});

	function filePlayer(src) {
		var audio = new Audio(src);
		audio.loop = true;
		audio.volume = 0.6;
		return {
			play: function () {
				return audio.play().then(function () { return true; }, function () { return false; });
			},
			stop: function () { audio.pause(); }
		};
	}

	function synthPlayer() {
		var N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
		// [note, beats]
		var song = [
			['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2], [null, 1],
			['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2], [null, 1],
			['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2], [null, 1],
			['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3], [null, 2]
		];
		var beat = 0.55;
		var ctx, master, timer;

		function note(freq, at, len) {
			[[1, 0.5, 'sine'], [2, 0.12, 'sine'], [3, 0.05, 'triangle']].forEach(function (h) {
				var osc = ctx.createOscillator();
				var gain = ctx.createGain();
				osc.type = h[2];
				osc.frequency.value = freq * h[0];
				gain.gain.setValueAtTime(0, at);
				gain.gain.linearRampToValueAtTime(h[1], at + 0.01);
				gain.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(len, 0.6) + 0.6);
				osc.connect(gain).connect(master);
				osc.start(at);
				osc.stop(at + Math.max(len, 0.6) + 0.7);
			});
		}

		function scheduleLoop(start) {
			var t = start;
			song.forEach(function (n) {
				if (n[0]) note(N[n[0]], t, n[1] * beat);
				t += n[1] * beat;
			});
			// Queue the next round shortly before this one ends
			timer = setTimeout(function () { scheduleLoop(t); }, (t - ctx.currentTime - 1) * 1000);
		}

		return {
			play: function () {
				var AC = window.AudioContext || window.webkitAudioContext;
				if (!AC) return Promise.resolve(false);
				ctx = ctx || new AC();
				// Without a user gesture resume() can hang, so don't wait on it forever
				var settle = new Promise(function (resolve) { setTimeout(resolve, 300); });
				return Promise.race([ctx.resume(), settle]).then(function () {
					if (ctx.state !== 'running') return false;
					begin();
					return true;
				}, function () { return false; });
			},
			stop: function () {
				clearTimeout(timer);
				var old = master;
				old.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
				setTimeout(function () { old.disconnect(); }, 600);
			}
		};

		function begin() {
			master = ctx.createGain();
			master.gain.value = 0.25;
			// A short echo makes it sound less like a beeper
			var delay = ctx.createDelay();
			var feedback = ctx.createGain();
			delay.delayTime.value = 0.28;
			feedback.gain.value = 0.25;
			master.connect(ctx.destination);
			master.connect(delay).connect(feedback).connect(delay);
			feedback.connect(ctx.destination);
			scheduleLoop(ctx.currentTime + 0.1);
		}
	}
}());

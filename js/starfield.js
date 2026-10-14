// Twinkling starfield with the occasional shooting star, drawn behind the page.
// Static (no animation) when the visitor prefers reduced motion.
(function () {
	'use strict';

	var canvas = document.getElementById('starfield');
	if (!canvas || !canvas.getContext) return;

	var ctx = canvas.getContext('2d');
	var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var tints = ['255,255,255', '255,246,213', '200,220,255', '255,214,240'];
	var stars = [], meteors = [], w, h, lastW = 0, nextMeteor = 0;

	function resize() {
		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		// Phones fire resize as the address bar slides; keep the same sky then
		if (w === lastW && stars.length) {
			if (still) draw(0);
			return;
		}
		lastW = w;
		var skyH = Math.max(h, window.screen ? window.screen.height : h);
		var count = Math.round(w * skyH / 3500);
		stars = [];
		for (var i = 0; i < count; i++) {
			var big = Math.random() < 0.06;
			stars.push({
				x: Math.random() * w,
				y: Math.random() * skyH,
				r: big ? 1.2 + Math.random() * 0.9 : 0.3 + Math.random() * 0.8,
				tint: tints[Math.floor(Math.random() * tints.length)],
				base: 0.35 + Math.random() * 0.55,
				speed: 0.5 + Math.random() * 2,
				phase: Math.random() * Math.PI * 2,
				big: big
			});
		}
		if (still) draw(0);
	}

	function drawStar(s, t) {
		var a = s.base * (still ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * s.speed + s.phase));
		ctx.fillStyle = 'rgba(' + s.tint + ',' + a.toFixed(3) + ')';
		ctx.beginPath();
		ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
		ctx.fill();
		if (s.big) {
			// Soft glow and a faint cross flare on the brightest stars
			ctx.fillStyle = 'rgba(' + s.tint + ',' + (a * 0.15).toFixed(3) + ')';
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = 'rgba(' + s.tint + ',' + (a * 0.35).toFixed(3) + ')';
			ctx.lineWidth = 0.6;
			ctx.beginPath();
			ctx.moveTo(s.x - s.r * 6, s.y);
			ctx.lineTo(s.x + s.r * 6, s.y);
			ctx.moveTo(s.x, s.y - s.r * 6);
			ctx.lineTo(s.x, s.y + s.r * 6);
			ctx.stroke();
		}
	}

	function spawnMeteor() {
		var angle = Math.PI * (0.15 + Math.random() * 0.15);
		var speed = 9 + Math.random() * 6;
		meteors.push({
			x: Math.random() * w * 0.8,
			y: Math.random() * h * 0.4,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: 0,
			max: 50 + Math.random() * 30
		});
	}

	function drawMeteors() {
		meteors = meteors.filter(function (m) {
			m.x += m.vx;
			m.y += m.vy;
			m.life++;
			var fade = 1 - m.life / m.max;
			var tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 10, m.y - m.vy * 10);
			tail.addColorStop(0, 'rgba(255,255,255,' + fade.toFixed(3) + ')');
			tail.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.strokeStyle = tail;
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			ctx.moveTo(m.x, m.y);
			ctx.lineTo(m.x - m.vx * 10, m.y - m.vy * 10);
			ctx.stroke();
			return m.life < m.max;
		});
	}

	function draw(t) {
		ctx.clearRect(0, 0, w, h);
		for (var i = 0; i < stars.length; i++) drawStar(stars[i], t);
		if (still) return;
		if (t > nextMeteor) {
			spawnMeteor();
			nextMeteor = t + 3500 + Math.random() * 6000;
		}
		drawMeteors();
		requestAnimationFrame(draw);
	}

	window.addEventListener('resize', resize);
	resize();
	if (!still) {
		nextMeteor = 2000;
		requestAnimationFrame(draw);
	}
}());

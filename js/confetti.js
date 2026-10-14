// Lightweight canvas confetti. window.launchConfetti() fires from both sides;
// window.launchConfetti({ x, y }) pops it out of that point instead.
(function () {
	'use strict';

	var colors = ['#ffd479', '#fff6d5', '#8b7bff', '#7dd3fc', '#ff6fb5', '#ffffff'];
	var canvas, ctx, pieces = [], running = false;

	function setup() {
		canvas = document.createElement('canvas');
		canvas.className = 'confetti-canvas';
		canvas.setAttribute('aria-hidden', 'true');
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		resize();
		window.addEventListener('resize', resize);
	}

	function resize() {
		var dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function burst(count, origin) {
		var w = window.innerWidth, h = window.innerHeight;
		for (var i = 0; i < count; i++) {
			var fromLeft = i % 2 === 0;
			// Fan upwards out of the origin, or shoot in from the side edges
			var angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
			var speed = 6 + Math.random() * 10;
			pieces.push({
				x: origin ? origin.x : (fromLeft ? 0 : w),
				y: origin ? origin.y : h * 0.7,
				vx: origin ? Math.cos(angle) * speed : (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
				vy: origin ? Math.sin(angle) * speed : -(9 + Math.random() * 12),
				size: 6 + Math.random() * 6,
				rot: Math.random() * Math.PI,
				vr: (Math.random() - 0.5) * 0.3,
				color: colors[i % colors.length],
				star: i % 3 === 0,
				life: 0
			});
		}
	}

	// Four-pointed twinkle star centred on the origin
	function sparkle(r) {
		ctx.beginPath();
		for (var k = 0; k < 8; k++) {
			var len = k % 2 === 0 ? r : r * 0.3;
			var a = k * Math.PI / 4;
			ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
		}
		ctx.closePath();
		ctx.fill();
	}

	function frame() {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		pieces = pieces.filter(function (p) {
			p.vy += 0.25;
			p.vx *= 0.99;
			p.x += p.vx;
			p.y += p.vy;
			p.rot += p.vr;
			p.life++;
			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rot);
			ctx.fillStyle = p.color;
			if (p.star) {
				sparkle(p.size * 0.7);
			} else {
				ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
			}
			ctx.restore();
			return p.y < window.innerHeight + 20 && p.life < 400;
		});
		if (pieces.length) {
			requestAnimationFrame(frame);
		} else {
			running = false;
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		}
	}

	window.launchConfetti = function (origin) {
		if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (!canvas) setup();
		if (origin) {
			burst(140, origin);
		} else {
			burst(160);
			setTimeout(function () { burst(100); }, 700);
		}
		if (!running) {
			running = true;
			requestAnimationFrame(frame);
		}
	};
}());

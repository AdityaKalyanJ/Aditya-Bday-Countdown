// Dependency-free countdown to the party. The target time (with its UTC offset)
// lives in the data-target attribute of #countdown in index.html.
(function () {
	'use strict';

	var el = document.getElementById('countdown');
	if (!el) return;

	var target = new Date(el.getAttribute('data-target')).getTime();
	var done = document.getElementById('countdown-done');
	var nums = {};
	['days', 'hours', 'minutes', 'seconds'].forEach(function (unit) {
		nums[unit] = el.querySelector('[data-unit="' + unit + '"]');
	});

	function pad(n) {
		return n < 10 ? '0' + n : String(n);
	}

	function set(unit, value) {
		var text = unit === 'days' ? String(value) : pad(value);
		if (nums[unit].textContent !== text) {
			nums[unit].textContent = text;
			nums[unit].classList.remove('tick');
			void nums[unit].offsetWidth; // restart the animation
			nums[unit].classList.add('tick');
		}
	}

	var timer;
	function update() {
		var left = Math.max(0, Math.floor((target - Date.now()) / 1000));

		set('days', Math.floor(left / 86400));
		set('hours', Math.floor(left / 3600) % 24);
		set('minutes', Math.floor(left / 60) % 60);
		set('seconds', left % 60);

		if (left === 0) {
			clearInterval(timer);
			el.hidden = true;
			done.hidden = false;
		}
	}

	update();
	timer = setInterval(update, 1000);
}());

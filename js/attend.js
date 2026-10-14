// "I'll be there!" buttons: pop a party popper with confetti out of the button.
// The choice is remembered in this browser only; nobody is notified.
(function () {
	'use strict';

	var KEY = 'aditya-bday-attending';
	var buttons = document.querySelectorAll('.js-attend');
	if (!buttons.length) return;

	function remembered() {
		try { return localStorage.getItem(KEY) === 'yes'; } catch (e) { return false; }
	}

	function remember() {
		try { localStorage.setItem(KEY, 'yes'); } catch (e) { /* private mode */ }
	}

	function markAttending() {
		Array.prototype.forEach.call(buttons, function (btn) {
			btn.classList.add('is-attending');
			btn.querySelector('.attend-label').textContent = "Yay! See you there";
		});
	}

	function popper(x, y) {
		var el = document.createElement('span');
		el.className = 'party-popper';
		el.setAttribute('aria-hidden', 'true');
		el.textContent = '🎉';
		el.style.left = x + 'px';
		el.style.top = y + 'px';
		document.body.appendChild(el);
		setTimeout(function () { el.remove(); }, 1200);
	}

	Array.prototype.forEach.call(buttons, function (btn) {
		btn.addEventListener('click', function () {
			var r = btn.getBoundingClientRect();
			var x = r.left + r.width / 2, y = r.top + r.height / 2;
			popper(x, y);
			if (window.launchConfetti) window.launchConfetti({ x: x, y: y });
			remember();
			markAttending();
		});
	});

	if (remembered()) markAttending();
}());

// "Share invite" buttons: native share sheet on phones, copy-link fallback elsewhere.
(function () {
	'use strict';

	var url = 'https://adityainvite.netlify.app/';
	var data = {
		title: "Aditya's Birthday Bash",
		text: "You're invited to Aditya's birthday party on Sat, 17 Oct 2026 at 4:00 PM! 🎂🎉",
		url: url
	};

	function toast(message) {
		var el = document.createElement('div');
		el.className = 'share-toast';
		el.setAttribute('role', 'status');
		el.textContent = message;
		document.body.appendChild(el);
		setTimeout(function () { el.classList.add('show'); }, 10);
		setTimeout(function () {
			el.classList.remove('show');
			setTimeout(function () { el.remove(); }, 400);
		}, 2200);
	}

	function copyLink() {
		if (navigator.clipboard && window.isSecureContext) {
			return navigator.clipboard.writeText(data.text + ' ' + url);
		}
		return Promise.reject();
	}

	function share() {
		if (navigator.share) {
			navigator.share(data).catch(function () { /* user closed the sheet */ });
			return;
		}
		copyLink().then(function () {
			toast('Invite link copied!');
		}, function () {
			window.open('https://wa.me/?text=' + encodeURIComponent(data.text + ' ' + url), '_blank', 'noopener');
		});
	}

	Array.prototype.forEach.call(document.querySelectorAll('.js-share'), function (btn) {
		btn.addEventListener('click', share);
	});
}());

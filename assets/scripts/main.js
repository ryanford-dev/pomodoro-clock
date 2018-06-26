'use strict';

const toSeconds = n => {
	const time = n.split(':');
	const hours = Number(time[0]);
	const minutes = Number(time[1]);
	const seconds = Number(time[2]);

	return hours * 60 * 60 + minutes * 60 + seconds;
}

const toTime = n => {
	let date = new Date(null);
	date.setSeconds(n);
	return date.toISOString().substr(11,8);
}

let running = false;
let	mode = 'work-time';
let	start = 0;
const	chime = new Audio('assets/sound/notification.wav');

const incrementTimer = e => {
	if (running) return;
	const button = e.target;
	const	timer = button.parentNode.querySelector('span');
	const	control = button.dataset.controls;
	const	currentTime = document.querySelector('h1');
	let	time = toSeconds(timer.textContent);

	if (control === 'less') {
		if (time > 60) {
			time -= 60;
		} else {
			timer.classList.add('error');
			window.setTimeout(() => {
				timer.removeAttribute('class');
			}, 100);
			return;
		}
	} else {
		time += 60;
	}
	timer.textContent = toTime(time);
	if (button.parentElement.parentElement.classList.contains('work-time')) {
	currentTime.textContent = toTime(time);
	}
}

const update = () => {
	if (running) {
		const currentTime = document.querySelector('h1').textContent;
		const	modeIndicator = document.querySelector('.' + mode + ' h3');
		const	active = document.querySelector('.active');
		let	timer = toSeconds(document.querySelector('.' + mode + ' .controls span').textContent);
		let time = toSeconds(currentTime);

		if (!active || active.textContent.toLowerCase() !== mode) {
			if (active) {
				active.removeAttribute('class');
			}
			modeIndicator.classList.add('active');
		}

		if (time <= 0) {
			mode = (mode === 'work-time') ? 'break-time' : 'work-time';
			document.querySelector('h1').textContent = document.querySelector('.' + mode + ' .controls span').textContent;
			start = performance.now() / 1000;
			chime.play();
			return update();
		}

		timer = (start - performance.now() / 1000) + timer;
		document.querySelector('h1').textContent = toTime(timer);

		window.requestAnimationFrame(update);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	const buttons = document.querySelectorAll('.settings .controls button');
	buttons.forEach(button => {
		button.addEventListener('click', incrementTimer);
	})
	document.getElementById('switch').addEventListener('click', function(e) {
		if (!running) {
			start = performance.now() / 1000;
			running = true;
			update();
			e.target.firstChild.textContent = 'stop';
		} else {
			running = false;
			mode = 'work-time';
			document.querySelector('.active').removeAttribute('class');
			document.querySelector('h1').textContent = document.querySelector('.work-time .controls span').textContent;
			e.target.firstChild.textContent = 'play_arrow'
		}
	});
});

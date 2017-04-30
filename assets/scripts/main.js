'use strict';

String.prototype.toSeconds = function() {
	let time = this.split(":"),
		hours = +time[0],
		minutes = +time[1],
		seconds = +time[2];

		return hours * 60 * 60 + minutes * 60 + seconds;
}

Number.prototype.toTime = function() {
	let date = new Date(null);
	date.setSeconds(this);
	return date.toISOString().substr(11,8);
}

var running = false,
	mode = "work-time",
	start = 0,
	chime = new Audio("assets/sound/notification.wav");

function incrementTimer(e) {
	e.preventDefault();
	if (running) return;
	let button = (e.target.tagName !== "button") ? e.target.parentElement : e.target, 
		timer = button.parentNode.querySelector("span"),
		time = timer.textContent.toSeconds(),
		control = button.getAttribute('data-controls'),
		currentTime = document.querySelector("h1");

	if (control === "less") {
		if (time > 60) {
			time -= 60;
		} else {
			timer.classList.add("error");
			window.setTimeout(function(){
				timer.removeAttribute("class");
			}, 100);
			return;
		}
	} else {
		time += 60;
	}
	timer.textContent = time.toTime();
	if (button.parentElement.parentElement.classList.contains("work-time")) {
	currentTime.textContent = time.toTime();
	}
}

function update() {
	if (running) {
		let currentTime = document.querySelector("h1").textContent,
			time = currentTime.toSeconds(),
			modeIndicator = document.querySelector("." + mode + " h3"),
			active = document.querySelector(".active"),
			timer = document.querySelector("." + mode + " .controls span").textContent.toSeconds();

		if (!active || active.textContent.toLowerCase() !== mode) {
			if (active) {
				active.removeAttribute("class");
			}
			modeIndicator.classList.add("active");
		}

		if (time <= 0) {
			mode = (mode === "work-time") ? "break-time" : "work-time";
			document.querySelector("h1").textContent = document.querySelector("." + mode + " .controls span").textContent;
			start = performance.now() / 1000;
			chime.play();
			return update();
		}

		timer = (start - performance.now() / 1000) + timer;
		document.querySelector("h1").textContent = timer.toTime();

		window.requestAnimationFrame(update);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	var buttons = document.querySelectorAll(".settings .controls button");
	for (let i = 0, len = buttons.length; i < len; i++) {
		buttons[i].addEventListener("click", incrementTimer);
	}
	document.getElementById("switch").addEventListener("click", function(e) {
		if (!running) {
			start = performance.now() / 1000;
			running = true;
			update();
			e.target.textContent = "stop";
		} else {
			running = false;
			mode = "work-time";
			document.querySelector(".active").removeAttribute("class");
			document.querySelector("h1").textContent = document.querySelector(".work-time .controls span").textContent;
			e.target.textContent = "play_arrow"
		}
	});
});

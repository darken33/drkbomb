var start_time;
var stop_time;
var counter;
var who;
var chrono_thread;
var blink_thread;

function startChrono() {
	start_time = (new Date()).getTime();
	chrono_thread = setInterval(tictac, 1000);
}

function stopChrono() {
	clearInterval(chrono_thread);
	chrono_thread = null;
	stop_time = (new Date()).getTime();
}

function getChrono() {
	return (stop_time - start_time > 0 ? Math.round((stop_time - start_time) / 1000) : 0);
}

function getChronoString() {
	time = getChrono();
	time_min = Math.floor(time / 60);
	time_sec = time % 60;
	return time_min + ":" + (time_sec < 10 ? "0" : "") + time_sec;
}

function tictac() {
	counter--;
	if (game_options.soundactive) m_tictac.play(); 
	if (counter == 0 && game) {
		game = false;
		inter = true;
		counter = intertimer;
	}
	else if (counter == 0 && inter) {
		lose();
	}
	else if (counter == 0 && relay) {
		lose();
	}
	if (inter) {
		if (player == 1) {
			player2Blink();
		}
		else {
			player1Blink();
		}
	}
}

function player2Blink() {
	if ($('#player2').hasClass('highlight')) $('#player2').removeClass('highlight');
	else $('#player2').addClass('highlight');
}

function player1Blink() {
	if ($('#player1').hasClass('highlight')) $('#player1').removeClass('highlight');
	else $('#player1').addClass('highlight');
}

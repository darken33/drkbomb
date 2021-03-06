var tictac_snd = "/android_asset/www/sound/tic-tac.wav";
var m_tictac;
var explode_snd = "/android_asset/www/sound/bomb_exploding.wav";
var m_explode;
var sound_loaded = 0;

function soundLoaded() {
	sound_loaded++;
}

function isSoundReady() {
	return (sound_loaded == 2);
}

function soundErr(err) {
	alert(err);
}

function loadSounds() {
	if (isFirefoxOS()) {
		m_tictac = document.getElementById("tictac_snd");
		m_explode = document.getElementById("explode_snd");
		sound_loaded = 2;
	}
	else {
		m_tictac = new Media(tictac_snd, soundLoaded, soundErr);
		m_explode = new Media(explode_snd, soundLoaded, soundErr);
	}
}

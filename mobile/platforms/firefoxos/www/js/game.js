/**
 * game.js : script du jeu drkBomb
 * 
 * @author : Philippe Bousquet <darken33@free.fr>
 * @date   : 09/2013
 * @version: 1.0
 * 
 * This software is under GNU General Public License
 */
var game_version  = "1.4";
var navplay = false;
var ready = false;
var popclosed = false;
var started = false;
var timer = 10;
var intertimer = 5;
var relaytimer = 2;
var sensitivity = 4;
var nb_games = 0;
var player = 1;
var player1_down = false;
var player2_down = false;
var inter = false;
var relay = false;
var game = false;
var inthegame = false;
var thread_anim_menu;
var perdu = false;;

function isFirefoxOS() {
	return (device.platform == "firefoxos");
}

/**
 * initGame() - initialisation du jeu
 */ 		 
function initGame() {
	inthegame = false;
	sensitivity = (game_options.difficulty == 1 ? 2.5 : (game_options.difficulty == 2 ? 2 : 1.5));
	intertimer = (game_options.difficulty == 1 ? 3 : (game_options.difficulty == 2 ? 2 : 2));
	relaytimer = 2;
	$('#player2').removeClass('highlight');
	$('#player2').removeClass('player2_down');
	$('#player1').removeClass('highlight');
	$('#player1').removeClass('player1_down');
	player = 1;
	player1_down = false;
	player2_down = false;
	nb_games = 0;
	start_time = 0;
	$(".title").hide();
	$(".ingame").show();
	blink_thread = setInterval(player1Blink, 1000);
	setTimeout(bindInGame, 1000);
	$.mobile.changePage('#ingame', 'none', true, true);	
}

/**
 * startGame() - demarrer la partie
 */
function startGame() {
	inthegame = true;
	clearInterval(blink_thread);
	blink_thread = null;
	counter = timer;
	startChrono();
	startWatch();
}

/**
 * lose() - La bombe explose
 */ 
function lose() {
	stopWatch();
	stopChrono();
	inthegame = false;
	perdu=true;
	if (game_options.soundactive) m_explode.play(); 
	playExplodeAnim()
	navigator.notification.vibrate(1000);
	unbindInGame();
}

/**
 * player1Up() - le bouton 1 est enfoncé
 */ 
function player1Down() {
	if (!player1_down) {
		player1_down = true;
		$('#player1').removeClass('highlight');
		$('#player1').addClass('player1_down');
		if (!inthegame) {
			player2_down = false;
			inter = false;
			game = true;
			startGame();
		}
		else if (relay && player == 2) {
			player = 1;
			nb_games++;
			relay=false;
			game=true;
			counter = timer;
		}
		else {
			lose();
		}
	}
}

/**
 * player2Down() - le bouton 2 est enfoncé
 */ 
function player2Down() {
	if (!player2_down) {
		if (relay && player ==1) {
			player = 2;
			nb_games++;
			relay=false;
			game=true;
			counter = timer;
			player2_down = true;
			$('#player2').removeClass('highlight');
			$('#player2').addClass('player2_down');
		}
		else if (inthegame) {
			lose();
		}
	}
}

/**
 * player1Up() - le bouton 1 est relâché
 */ 
function player1Up() {
	if (inthegame) {
		player1_down = false;
		$('#player1').removeClass('player1_down');
		if (!inter) {
			lose();
		}
		else {
			counter = relaytimer;
			inter = false;
			relay = true;
		}
	}
}

/**
 * player2Up() - le bouton 2 est relâché
 */ 
function player2Up() {
	if (inthegame) {
		player2_down = false;
		$('#player2').removeClass('player2_down');
		if (!inter) {
			lose();
		}
		else {
			counter = relaytimer;
			inter = false;
			relay = true;
		}
	}
}

/**
 * clearExplodeAnim() - réinitialisation de l'animation
 */ 
function clearExplodeAnim() {
	$("#explode").removeClass("anim");
	$("#explode").removeClass("im10");
	$("#explode").removeClass("im09");
	$("#explode").removeClass("im08");
	$("#explode").removeClass("im07");
	$("#explode").removeClass("im06");
	$("#explode").removeClass("im05");
	$("#explode").removeClass("im04");
	$("#explode").removeClass("im03");
	$("#explode").removeClass("im02");
	$("#explode").removeClass("im01");
}

/**
 * playExplodeAnim() - animation d'explosion
 */ 
function playExplodeAnim() {
	$("#explode").addClass("im01");
	$("#explode").addClass("anim");
	setTimeout(function(){
		$("#explode").addClass("im02");
		$("#explode").removeClass("im01");
		setTimeout(function(){
			$("#explode").addClass("im03");
			$("#explode").removeClass("im02");
			setTimeout(function(){
				$("#explode").addClass("im04");
				$("#explode").removeClass("im03");
				setTimeout(function(){
					$("#explode").addClass("im05");
					$("#explode").removeClass("im04");
					setTimeout(function(){
						$("#explode").addClass("im06");
						$("#explode").removeClass("im05");
						setTimeout(function(){
							$("#explode").addClass("im07");
							$("#explode").removeClass("im06");
							setTimeout(function(){
								$("#explode").addClass("im08");
								$("#explode").removeClass("im07");
								setTimeout(function(){
									$("#explode").addClass("im09");
									$("#explode").removeClass("im08");
									setTimeout(function(){
										$("#explode").addClass("im10");
										$("#explode").removeClass("im09");
										setTimeout(function(){
											$("#explode").removeClass("anim");
											$("#explode").removeClass("im10");
											if (perdu) $("#broken_screen").show();
											setTimeout(score, 2000);
											perdu = false;
										}, 50);
									}, 50);
								}, 50);
							}, 75);
						}, 75);
					}, 75);
				}, 100);
			}, 100);
		}, 100);
	}, 100);
}

/**
 * score() - affiche le score obtenu
 */ 
function score() {
	if (!$("score").is(':visible')) {
		$("#txt_score").html(texte_hsc_score[game_options.lang]);
		var int_sc = nb_games * getChrono();
		int_sc *= (game_options.difficulty == 1 ? 100 : (game_options.difficulty == 2 ? 1000 : 10000));
		var str_sc = texte_hsc_passes[game_options.lang]+" : " + nb_games +"<br/>";
		str_sc += texte_hsc_temps[game_options.lang]+" : " + getChronoString() +"<br/>";
		$("#scr").html(int_sc);
		$("#scr_detail").html(str_sc);
		updateHighscore(nb_games, getChronoString(), int_sc);
		if (game_options.sharescore) {
			service(nb_games, getChronoString(), int_sc);
		}
		$.mobile.changePage('#score', 'none', true, true);	
		$(".title").show();
		$(".ingame").hide();
		$("#broken_screen").hide();
		bindGame();
	}
}
function backToTitle() {
	inthegame = false;
	$(".title").show();
	$(".ingame").hide();
	$("#broken_screen").hide();
	unbindInGame();
	bindGame();
	$.mobile.changePage('#game', 'none', true, true);	
}
/**
 * onBackButton() - bouton back pressé
 */ 
function onBackButton() {
	if ($("#menu").is(':visible')) {
		$("#menu").hide();
	}
	else { 
		if ($('#param-1').css('display') == 'block') {
			updateParam();
			$(".title").show();
			$(".ingame").hide();
			inthegame = false;
			$.mobile.changePage('#game', 'none', true, true);
		}	
		else if ($('#broken_screen').css('display') == 'block') {
			score();
		}
		else if ($('#score').css('display') == 'block') {
			quitscore();
		}
		else if ($('#hsc_local').css('display') == 'block') {
			quithscl();
		}
		else if ($('#hsc_internet').css('display') == 'block') {
			quithsci();
		}
		else if ($('#ingame').css('display') == 'block') {
			if (!inthegame) {
				backToTitle();
			}
			else {
				lose();
			}
			$.mobile.changePage('#game', 'none', true, true);
		}
		else if ($('#game').css('display') != 'block') {
			backToTitle();
		}
		else {
			quit();
		}
	}
}

/**
 * onMenuButton() - bouton menu pressé
 */ 
function onMenuButton() {
	if ($('#game').css('display') == 'block' && !$("#splash").is(':visible')) {
		if ($("#menu").is(':visible')) {
			$("#menu").hide();
		} 
		else {
			$('#menu').show();
		}
	}
}    

/**
 * closeMenu() - fermer le menu
 */     
function  closeMenu() {
	if ($("#menu").is(':visible')) {
		$("#menu").hide();
	}
	else if (!inthegame) {
		$("#menu").show();
	}
}

/**
 * quit() - quitter le jeu
 */ 
function quit() {
	if ($("#menu").is(':visible')) {
		$("#menu").hide();
	}
	navigator.notification.confirm(
		texte_alert_quitter[game_options.lang],
		quitConfirm,
		'Exit',
		['Ok','Cancel']
	);
}

function quitConfirm(btnIdx) {
	if (btnIdx == 1) {
		if (isFirefoxOS()) window.close();
		else navigator.app.exitApp();
		
	}
}
/**
 * aide() - afficher la page d'aide
 */ 
function aide() {
	$("#help_subtitle").html(texte_sous_titre[game_options.lang]);
	$("#help_content").html(texte_aide_content[game_options.lang]);
	$.mobile.changePage('#aide-1', 'none', true, true);
}

/**
 * param() - afficher la page des paramètres
 */ 
function param() {
	$('#txt_param').html(texte_param_title[game_options.lang]);
	game_lang = '<option value="fr" '+(game_options.lang == "fr" ? 'selected="selected"' : '')+'>'+texte_option_langue_fr[game_options.lang]+'</option>';
	game_lang += '<option value="en" '+(game_options.lang == "en" ? 'selected="selected"' : '')+'>'+texte_option_langue_en[game_options.lang]+'</option>';
	$('#l_game_lang').html(texte_option_langage[game_options.lang]);
	$('#game_lang').html(game_lang).selectmenu().selectmenu("refresh");
	game_diff = '<option value="1" '+(game_options.difficulty == 1 ? 'selected="selected"' : '')+'>'+texte_difficulte_facile[game_options.lang]+'</option>';
	game_diff += '<option value="2" '+(game_options.difficulty == 2 ? 'selected="selected"' : '')+'>'+texte_difficulte_moyen[game_options.lang]+'</option>';
	game_diff += '<option value="3" '+(game_options.difficulty == 3 ? 'selected="selected"' : '')+'>'+texte_difficulte_difficile[game_options.lang]+'</option>';
	$('#l_game_level').html(texte_niveau[game_options.lang]);
	$('#game_level').html(game_diff).selectmenu().selectmenu("refresh");
	$('#l_game_team').html(texte_equipe[game_options.lang]);
	$('#game_team').val(game_options.teamname);
	$('#l_options').html(texte_options[game_options.lang]);
	$('#l_game_help').html(texte_option_aide[game_options.lang]);
	$('#l_game_sound').html(texte_option_sons[game_options.lang]);
	$('#l_game_score').html(texte_option_share[game_options.lang]);
	if (game_options.helponstart) $('#game_help').attr('checked', true);
	if (game_options.soundactive) $('#game_sound').attr('checked', true);
	if (game_options.sharescore) $('#game_score').attr('checked', true);
	$('#game_sound').checkboxradio().checkboxradio("refresh");
	$('#game_help').checkboxradio().checkboxradio("refresh");
	$('#game_score').checkboxradio().checkboxradio("refresh");
	$.mobile.changePage('#param-1', 'none', true, true);
}
function loading() {
	$.mobile.changePage('#loading', 'none', true, true);
}

/**
 * updateparam() - MAJ des paramètres
 */ 
function updateParam() {
	game_options.lang = $('#game_lang').val();
	game_options.difficulty = $('#game_level').val();
	game_options.teamname = $('#game_team').val(); 
	game_options.helponstart = ($('#game_help').attr('checked') == "checked");
	game_options.soundactive = ($('#game_sound').attr('checked') == "checked");
	game_options.sharescore = ($('#game_score').attr('checked') == "checked");
	writeOptions();
	updateMenu();
}

function updateMenu() {
	$('#m_txt_jouer').html(texte_menu_jouer[game_options.lang]);
	$('#m_txt_param').html(texte_menu_param[game_options.lang]);
	$('#m_txt_aide').html(texte_menu_aide[game_options.lang]);
	$('#m_txt_quitter').html(texte_menu_quitter[game_options.lang]);
}

/**
 * unbindGame() - supprimer la gestion des evenements
 */ 
function unbindGame() {
	$("#menub").off("tap");
	$("#btngo").off("tap");
	$("#param_back").off("tap");
	$("#hlp_back").off("tap");
	$("#score").off("tap");
	$("#hsc_local").off("tap");
	$("#hsc_internet").off("tap");
	$("#b_score").off("tap");
	$("#b_hsc_local").off("tap");
	$("#b_hsc_internet").off("tap");
	$("#broken_screen").off("tap");
}

/**
 * bindGame() - gestion des evenements sur l'ecran
 */ 
function bindGame() {
	unbindGame();
//	$("#game").on("taphold", function(event) {
//		event.preventDefault();
//		event.stopPropagation();
//		if (!inthegame && popclosed) closeMenu();
//	});	
	$("#menub").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!inthegame && popclosed) closeMenu();
	});	
	$("#btngo").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		initGame();
	});
	$("#param_back").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		onBackButton();
	});
	$("#hlp_back").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		onBackButton();
	});
	$("#score").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quitscore();
	});
	$("#hsc_local").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithscl();
	});
	$("#hsc_internet").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithsci();
	});
	$("#b_score").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quitscore();
	});
	$("#b_hsc_local").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithscl();
	});
	$("#b_hsc_internet").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithsci();
	});
	$("#broken_screen").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		score();
	});
}

function unbindInGame() {
	$("#player1").off("vmousedown");
	$("#player1").off("vmouseup");
	$("#player2").off("vmousedown");
	$("#player2").off("vmouseup");
}

/**
 * bindGame() - gestion des evenements sur l'ecran
 */ 
function bindInGame() {
	unbindGame();
	$("#player1").on("vmousedown", function(event) {
		event.preventDefault();
		event.stopPropagation();
		player1Down();
	});	
	$("#player1").on("vmouseup", function(event) {
		event.preventDefault();
		event.stopPropagation();
		player1Up();
	});
	$("#player2").on("vmousedown", function(event) {
		event.preventDefault();
		event.stopPropagation();
		player2Down();
	});	
	$("#player2").on("vmouseup", function(event) {
		event.preventDefault();
		event.stopPropagation();
		player2Up();
	});
}

/**
 * bindMenu() - gestion des evenements du menu
 */ 
function bindMenu() {
	$("#mstart").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		initGame();
		closeMenu();
	});
	$("#mparam").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		param();
		closeMenu();
	});
	$("#mhelp").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		aide(); 
		closeMenu();
	});
	$("#mquit").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		quit(); 
	});
}

/**
 * initiailsation du jeu
 */ 
function init() {
	ready=false;
	popclosed=false;
	document.addEventListener("deviceready", onDeviceReady, true);		
	setTimeout(onDeviceReady, 5000);
}


function closepop() {
	$("#splash").hide();
	$('#game').unbind('tap');
	popclosed = true;
	if (new_install) {
		param();
	}
}

function popup() {
	header = '<div data-role="header"><h2>'+texte_aide_title[game_options.lang]+'</h2></div>',
	closebtn = "",
	popup = '';
	if ($(window).width() < 320) {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0;">' + closebtn + header +
				texte_popup_mini[game_options.lang] + 
				'</div>';
	}
	else if ($(window).width() < 480) {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0;">' + closebtn + header +
				texte_popup_normal[game_options.lang] + 
				'</div>';
	}
	else {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0; top: 30%; bottom: 30%; left: 15%; right: 15%;">' + closebtn + header +
				texte_popup_grand[game_options.lang] + 
				'</div>';	
	}

	// Create the popup. Trigger "pagecreate" instead of "create" because currently the framework doesn't bind the enhancement of toolbars to the "create" event (js/widgets/page.sections.js).
	$.mobile.activePage.append( popup ).trigger( "pagecreate" );
	// Wait with opening the popup until the popup image has been loaded in the DOM.
	// This ensures the popup gets the correct size and position
	// Fallback in case the browser doesn't fire a load event
	var fallback = setTimeout(function() {
		$("#game").bind("tap", function(event) {
			event.preventDefault();
			closepop();
		});
		$( "#splash").show();
	}, 1000);
}

/**
 * phoneGap ready
 */ 
var onDeviceReady = function() {
	if (!ready) {
		document.addEventListener("backbutton", onBackButton, true);
		document.addEventListener("menubutton", onMenuButton, true);
		document.querySelector("#game_lang").addEventListener("change", function onchange(event) {
			loading(); 
			updateParam(); 
			param();
			event.preventDefault();
		}, true);
		initFileSystem();
		loadSounds();
		if (navplay) {
			new_install = true;
			initOptions();
			initHighscores();
			activateApp();	
		}
	}
};

function activateApp() {
	if (!ready && (isFsReady() || navplay)) {
		updateMenu();
		$.mobile.changePage('#game', 'none', true, true);
		bindGame();	
		bindMenu();
		ready = true;
		if (game_options.helponstart) {
			popclosed = false;
			popup();
		} 
		else {
			popclosed = true;
		}
		ready = true;
	}
}

init();

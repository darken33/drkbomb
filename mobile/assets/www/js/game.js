/**
 * game.js : script du jeu drkBomb
 * 
 * @author : Philippe Bousquet <darken33@free.fr>
 * @date   : 09/2013
 * @version: 1.0
 * 
 * This software is under GNU General Public License
 */
var game_version  = "1.0";
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

/**
 * initGame() - initialisation du jeu
 */ 		 
function initGame() {
	inthegame = false;
	sensitivity = (game_options.difficulty == 1 ? 3 : 2);
	intertimer = (game_options.difficulty == 1 ? 4 : (game_options.difficulty == 2 ? 3 : 2));
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
	clearExplodeAnim();
	clearInterval(thread_anim_menu);
	thread_anim_menu = null;
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
	navigator.notification.vibrate(1000);
	if (game_options.soundactive) m_explode.play(); 
	playExplodeAnim()
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
		else {
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
 * playMenuAnim() sur la page titre jouer l'explosion toutes les 4 sec 
 */
function playMenuAnim() {
	thread_anim_menu = setInterval(playExplodeAnim, 4000);
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
	$("#explode2").removeClass("anim");
	$("#explode2").removeClass("im10");
	$("#explode2").removeClass("im09");
	$("#explode2").removeClass("im08");
	$("#explode2").removeClass("im07");
	$("#explode2").removeClass("im06");
	$("#explode2").removeClass("im05");
	$("#explode2").removeClass("im04");
	$("#explode2").removeClass("im03");
	$("#explode2").removeClass("im02");
	$("#explode2").removeClass("im01");
}

/**
 * playExplodeAnim() - animation d'explosion
 */ 
function playExplodeAnim() {
	$("#explode").addClass("im01");
	$("#explode").addClass("anim");
	$("#explode2").addClass("im01");
	$("#explode2").addClass("anim");
	setTimeout(function(){
		$("#explode").addClass("im02");
		$("#explode").removeClass("im01");
		$("#explode2").addClass("im02");
		$("#explode2").removeClass("im01");
		setTimeout(function(){
			$("#explode").addClass("im03");
			$("#explode").removeClass("im02");
			$("#explode2").addClass("im03");
			$("#explode2").removeClass("im02");
			setTimeout(function(){
				$("#explode").addClass("im04");
				$("#explode").removeClass("im03");
				$("#explode2").addClass("im04");
				$("#explode2").removeClass("im03");
				setTimeout(function(){
					$("#explode").addClass("im05");
					$("#explode").removeClass("im04");
					$("#explode2").addClass("im05");
					$("#explode2").removeClass("im04");
					setTimeout(function(){
						$("#explode").addClass("im06");
						$("#explode").removeClass("im05");
						$("#explode2").addClass("im06");
						$("#explode2").removeClass("im05");
						setTimeout(function(){
							$("#explode").addClass("im07");
							$("#explode").removeClass("im06");
							$("#explode2").addClass("im07");
							$("#explode2").removeClass("im06");
							setTimeout(function(){
								$("#explode").addClass("im08");
								$("#explode").removeClass("im07");
								$("#explode2").addClass("im08");
								$("#explode2").removeClass("im07");
								setTimeout(function(){
									$("#explode").addClass("im09");
									$("#explode").removeClass("im08");
									$("#explode2").addClass("im09");
									$("#explode2").removeClass("im08");
									setTimeout(function(){
										$("#explode").addClass("im10");
										$("#explode").removeClass("im09");
										$("#explode2").addClass("im10");
										$("#explode2").removeClass("im09");
										setTimeout(function(){
											$("#explode").removeClass("anim");
											$("#explode").removeClass("im10");
											$("#explode2").removeClass("anim");
											$("#explode2").removeClass("im10");
											if (perdu) $("#broken_screen").show();
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
	var int_sc = nb_games * getChrono();
	int_sc *= (game_options.difficulty == 1 ? 100 : (game_options.difficulty == 2 ? 1000 : 10000));
	var str_sc = "Passes : " + nb_games +"<br/>";
	str_sc += "Temps : " + getChronoString() +"<br/>";
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
	playMenuAnim();
}
function backToTitle() {
	inthegame = false;
	$(".title").show();
	$(".ingame").hide();
	$("#broken_screen").hide();
	unbindInGame();
	bindGame();
	playMenuAnim();
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
//			$.mobile.changePage('#game', 'none', true, true);
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
	if (confirm("Voulez vous quitter jeu ?")) {
		navigator.app.exitApp();
	}
}

/**
 * aide() - afficher la page d'aide
 */ 
function aide() {
	$.mobile.changePage('#aide-1', 'none', true, true);
}

/**
 * param() - afficher la page des paramètres
 */ 
function param() {
	game_diff = '<option value="1" '+(game_options.difficulty == 1 ? 'selected="selected"' : '')+'>Facile</option>';
	game_diff += '<option value="2" '+(game_options.difficulty == 2 ? 'selected="selected"' : '')+'>Moyen</option>';
	game_diff += '<option value="3" '+(game_options.difficulty == 3 ? 'selected="selected"' : '')+'>Difficile</option>';
	$('#game_level').html(game_diff);
	$('#game_team').val(game_options.teamname);
	if (game_options.helponstart) $('#game_help').attr('checked', "checked");
	if (game_options.soundactive) $('#game_sound').attr('checked', "checked");
	if (game_options.sharescore) $('#game_score').attr('checked', "checked");
	$.mobile.changePage('#param-1', 'none', true, true);
}

/**
 * updateparam() - MAJ des paramètres
 */ 
function updateParam() {
	game_options.difficulty = $('#game_level').val();
	game_options.teamname = $('#game_team').val(); 
	game_options.helponstart = ($('#game_help').attr('checked') == "checked");
	game_options.soundactive = ($('#game_sound').attr('checked') == "checked");
	game_options.sharescore = ($('#game_score').attr('checked') == "checked");
	writeOptions();
}

/**
 * unbindGame() - supprimer la gestion des evenements
 */ 
function unbindGame() {
	$("#game").off("taphold");
	$("#btngo").off("tap");
}

/**
 * bindGame() - gestion des evenements sur l'ecran
 */ 
function bindGame() {
	unbindGame();
	$("#game").on("taphold", function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!inthegame && popclosed) closeMenu();
	});	
	$("#btngo").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		initGame();
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
	player1Blink();
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

/**
 * phoneGap ready
 */ 
var onDeviceReady = function() {
	if (!ready) {
		document.addEventListener("backbutton", onBackButton, true);
		document.addEventListener("menubutton", onMenuButton, true);
		initFileSystem();
		loadSounds();
		n=0;
		do {
			n++;
		} while (!isFsReady() && n < 5000)
		if (n == 5000) {
			new_install = true;
			initOptions();
			initHighscores();	
		}
		$.mobile.changePage('#game', 'none', true, true);
		bindGame();	
		bindMenu();
		playMenuAnim();	
		ready = true;
		if (game_options.helponstart) {
			popclosed = false;
			popup();
		} 
		else {
			popclosed = true;
		}
	}
};

function closepop() {
	$("#splash").hide();
	$('#game').unbind('tap');
	popclosed = true;
	if (new_install) {
		param();
	}
}

function popup() {
	header = '<div data-role="header"><h2>Aide</h2></div>',
	closebtn = "",
	popup = '';
	if ($(window).width() < 320) {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0;">' + closebtn + header +
				'<div data-role="content" style="text-align: justify; background: #a0a0a0; color: #000000; text-shadow: none; font-weight: normal; font-size: 85%;">' +
					'<strong>"menu"</strong> : affiche le menu du jeu (jouer, options, aide, quitter).<br/>'+
					'<strong>"GO"</strong> : demarre la partie.<br/>'+ 
					'<strong>"Le jeu"</strong> : maintenez le bouton clignotant, sans secouer le smartphone.<br/>'+
					'Bonne partie...' +
				'</div>' +	
		'</div>';
	}
	else if ($(window).width() < 480) {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0;">' + closebtn + header +
				'<div data-role="content" style="text-align: justify; background: #a0a0a0; color: #000000; text-shadow: none; font-weight: normal; font-size: 90%;">' +
					'La touche <strong>"menu"</strong>, ou un appui long sur l\'&eacute;cran de votre t&eacute;l&eacute;phone permet d\'afficher le menu du jeu (jouer, options, aide, quitter).<br/>'+
					'Le bouton <strong>"GO"</strong> permet d\'initialiser le jeu, il commence lorsque vous appuyez sur le bouton clignotant.<br/>'+ 
					'Chaque fois qu\'un bouton clignote, vous devez relacher le bouton enfonc&eacute;, et rapidement l\'autre joueur (ou vous, si vous &ecirc;tes seul) doit appueyr sur le bouton clignotant.<br/>'+
					'Attention, &eacute;vitez de secouer le t&eacute;l&eacute;phone, d\'appuyer trop t&ocirc;t ou rel&acirc;cher trop tard un bouton, sinon la bombe explose et la partie est termin&eacute;e.<br/>'+ 
					'Bonne partie...' +
				'</div>' +	
		'</div>';
	}
	else {
		popup = '<div data-role="popup" id="splash" class="popup" data-short="Comment Jouer ?" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15" style="background: #a0a0a0; top: 30%; bottom: 30%; left: 15%; right: 15%;">' + closebtn + header +
				'<div data-role="content" style="text-align: justify; background: #a0a0a0; color: #000000; text-shadow: none; font-weight: normal;">' +
				'<strong>Comment jouer ?</strong><br/>' +
				'Pour faire appara&icirc;tre le menu il suffit d\'appuyer sur la touche <strong>"menu"</strong>, ou simplement effectuer un appui long sur l\'&eacute;cran, vous pourrez d&eacute;finir le niveau de jeu dans les param&egrave;tres.<br/>' +
				'Pour initialiser une partie, appuyez sur le bouton <strong>"GO"</strong> il faut alors maintenir le bouton jaune enfonc&eacute; pour d&eacute;marrer le jeu.<br/>' +
				'Au bout de 10 secondes l\'autre bouton devient clignote,  il faut alors relacher le premier bouton et dans un d&eacute;lai de 2 secondes appuyer sur ce second bouton. Si cette action n\'est pas faite au bout de 4 secondes, la bombe explose. R&eacute;p&eacute;tez alors l\'op&eacute;ration.<br/>' +
				'Attention, &eacute;vitez de secouer le t&eacute;l&eacute;phone, d\'appuyer trop t&ocirc;t ou rel&acirc;cher trop tard un bouton, sinon la bombe explose et la partie est termin&eacute;e.<br/>' +
				'Bonne partie...' +
				'</div>' +	
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


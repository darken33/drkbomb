<!DOCTYPE HTML>
<?php
 $dbuser = "root" ;
 $dbhost = "localhost";
 $dbname = "drkbomb"; 
 $dbpasswd = "";
 // On récupère la difficulté (par defaut 1 : Facile)
 $d = (isset($_GET['d']) ? $_GET['d'] : 1);
 if ($d != 1 && $d != 2 && $d != 3) $d = 1;    

 // on se connecte à la DB
 mysql_connect($dbhost,$dbuser,$dbpasswd);
 mysql_select_db($dbname);

 // On recupère les meilleurs scores
$requete="SELECT `id`, `name`, `passe`, `duree`, `score`, `difficulty` FROM drkbomb_score WHERE `difficulty` = '".$d."' ORDER BY score DESC, duree DESC;";
$result=mysql_query($requete);

?>
<html>
	<head>
		<title>drkBomb - Passe la bombe &agrave; ton voisin</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="css/jquery.mobile-1.3.1.min.css">
		<link rel="stylesheet" href="css/main.css">
		<script src="js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/jquery-ui-1.8.18.custom.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/jquery.mobile-1.3.1.min.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		
		<!--
			page highscores mondiaux
		-->	
		<div data-role="page" id="hsc_internet">
			<div data-role="header">
				<!-- /navbar -->
					<div data-role="navbar">
						<ul>
							<li><a href="./index.php?d=1">Facile</a></li>
							<li><a href="./index.php?d=2">Moyen</a></li>
							<li><a href="./index.php?d=3">Difficile</a></li>
						</ul>
					</div>        
			</div>
			<!-- 
				Le Tableau des scores
			-->	
			<div class="text-title-2">drkBomb</div>
			<div id="hst_int" class="highscore-title" >Meilleurs Scores Mondiaux : <?php echo ($d == 1 ? "Facile" : ($d == 2 ? "Moyen" : "Difficile")); ?></div>
			<div>
				<table id="hsc_int" class="highscore">
					<tr><th style="text-align: right;">#</th><th style="text-align: left;">Nom</th><th style="text-align: right;">Passes</th><th style="text-align: right;">Temps</th><th style="text-align: right;">Score</th></tr>
<?php
 $pos = 1;
 while ($row=mysql_fetch_array($result)) {
	echo '<tr><td style="text-align: right;">'.$pos.
		'.</td><td style="text-align: left;">'.$row['name'].
		'</td><td style="text-align: right;">'.$row['passe'].
		'</td><td style="text-align: right;">'.$row['duree'].
		'</td><td style="text-align: right;">'.$row['score'].'</td></tr>';
	$pos++;
 }
 for ($i = $pos; $i < 100; $i++) {
	echo '<tr><td style="text-align: right;">'.$i.'.</td><td style="text-align: left;">-</td><td style="text-align: right;">-</td><td style="text-align: right;">-</td><td style="text-align: right;">-</td></tr>';
 }
?>					
				</table>
			</div>
		</div>

	</body>
</html>

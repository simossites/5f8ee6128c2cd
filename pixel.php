<?php
//"q.php"	
//"thank_you/index.html"
//"q_backfix.php"
//$_SESSION['pixel']            = "__PIXEL__";


$content = file_get_contents("thank_you/index.html");
$content = preg_replace('/id\=.*?\&ev\=Lead\&noscript\=1/i', 'id='.$_GET['pixel'].'&ev=Lead&noscript=1', $content);
file_put_contents("thank_you/index.html", $content);
if (file_exists("q_backfix.php")) {
	$content = file_get_contents("q_backfix.php");
	$content = preg_replace('/\$_SESSION\[\'pixel\'\].*/i', '$_SESSION[\'pixel\']            = "'.$_GET['pixel'].'";', $content);
	file_put_contents("q_backfix.php", $content);
}

$content = file_get_contents("q.php");
$content = preg_replace('/\$_SESSION\[\'pixel\'\].*/i', '$_SESSION[\'pixel\']            = "'.$_GET['pixel'].'";', $content);
file_put_contents("q.php", $content);
?>
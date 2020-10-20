<?php
session_start();
error_reporting(0);
$_SESSION['pixel']            = "PIXEL_HERE";
$_SESSION['binom_click_path'] = "/home/admin/web/trk22.perfectinstall.net/public_html/click.php";
$_SESSION['camp_key']         = "22910mz63bl051j5tnlu";
$id 						  = 0;
$param 						  = "";
foreach ($_GET as $key => $value) {
	$id = (int)$value;
	$param = $key;
}



global $pre_land;
$pre_land = true;
$referrer = $_SERVER['HTTP_REFERER'];
$referrer = preg_replace("/.*?\?/i", "", $referrer);
$params   = explode("&", $referrer);
foreach($params as $value) {
    $parts = explode("=", $value);
    $_GET[$parts[0]] = urldecode($parts[1]);
}
$_SESSION['prefetch'] = false;
include_once($_SESSION['binom_click_path']);
$_SESSION['preland'] = $_SESSION['preland_path'];

function getRoutelink() {
	print "../route.php?uclick=".substr($_SESSION['binom_uclick'], 0)."&binom_click_id=".substr($_SESSION['binom_click_id'], 3);
}
?>
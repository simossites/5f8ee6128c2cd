<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link media="all" rel="stylesheet" type="text/css" href="/thank_you/css/order-style.css">		
	</head>
<body>
<div class="goback">
<h1 style="font-size:70px;margin:25% auto;text-align: center;color:#fcca49;">ขอบพระคุณ!</h1>
</div>
<?php
$filename = "/home/admin/web/trk22.perfectinstall.net/public_html/emails/__PRODUCT__/mail.txt";
$s = $_POST['mail'];
$sum = $s . PHP_EOL;
file_put_contents($filename, $sum, FILE_APPEND);
?>

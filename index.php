<?php
	$app = "covermaker";
?>
<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js ie ie6 oldie" lang="en"><![endif]-->
<!--[if IE 7]><html class="no-js ie ie7 oldie" lang="en"><![endif]-->
<!--[if IE 8]><html class="no-js ie ie8 oldie" lang="en"><![endif]-->
<!--[if IE 9]><html class="no-js ie ie9 oldie" lang="en"><![endif]-->
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<title></title>
	<link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
	<meta name="viewport" content="width=device-width" />
	<link rel="stylesheet" type="text/css" href="com/covermaker/styles/style.css">
	<style type="text/css">
		html {
			height: 950px;
		}
		body {
			margin: 0;
			padding: 0;
			width: 810px;
			height: 900px;
			overflow: hidden;
		}
		canvas {
			background: url('com/covermaker/images/background.jpg') no-repeat 0 0;
			height: 900px;
			width: 810px;
		}
		img {
			display: none;
		}
	</style>
</head>
<body>

	<canvas id="app" width="810" height="900"></canvas>
	<div id="fb-root"></div>
	<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.min.js"></script>
	<script type="text/javascript" src="//bs-static.cdn.telerik.com/1.2.9/everlive.all.min.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/createjs-2014.12.12.min.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/underscore.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min.js"></script>
	<script type="text/javascript" src="//connect.facebook.net/en_US/all.js#xfbml=1&appId=193491900675284"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/addons/facebook/facebook.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/preloader.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/config.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/navigation.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/buttons.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/scenes.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/intro/intro.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/tabs/tabs.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/choice/choice.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/cover/cover.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/post/post.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/studio/studio.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/cover-ready/cover-ready.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/post-ready/post-ready.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/congratulations/congratulations.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/footer.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scripts/background.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/addons/scroller/scroller.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/addons/webcam/webcam.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/addons/video/video.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/addons/user/user.js"></script>
	<script type="text/javascript" src="com/<?php echo $app; ?>/scenes/progress/progress.js"></script>
</body>
</html>
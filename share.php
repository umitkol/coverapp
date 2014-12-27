<?php

	$post = $_POST;
	$cover = utf8_decode($post['cover']);

	$file = 'covers/'.md5(uniqid()) . '.png';

	$cover = str_replace('data:image/png;base64,', '', $cover);
	$cover = str_replace(' ', '+', $cover);
	$data = base64_decode($cover);

	file_put_contents($file, $data);

	echo $file;

?>
this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var config 		= CoverMaker.config,
		stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		loader		= CoverMaker.Preload;

	//CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {
		canvas.style.background = "url("+loader.queue.getItem('background').src+")";
	};

})()
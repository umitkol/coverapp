this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var helper 		= CoverMaker.Helper,
		stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		loader		= CoverMaker.Preload;

	var height = 80;

	CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {

		var background 	= new createjs.Shape();
        background.graphics.clear();
        background.graphics.beginFill('#fff').drawRect(0, 0, canvas.width, height);

		//var nexumLogo = new createjs.Bitmap(loader.queue.getResult('nexumLogo'));
		var nexumLogo = new CoverMaker.Button({
			images: [loader.queue.getItem("nexumLogo").src],
			frames: {width:133, height:49},
			animations: {normal:[0]}
		});
		helper.Alignment.horizontalCenter(nexumLogo, canvas);
		helper.Alignment.verticalCenter(nexumLogo, {height: height});

		var container 	= new createjs.Container();
		container.setBounds(0, 0, canvas.width, height);
		helper.Alignment.bottomWithRef(container, canvas);
		container.addChild(background, nexumLogo);

		stage.addChild(container);
	};

})();
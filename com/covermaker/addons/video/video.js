this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage			= CoverMaker.stage,
		canvas			= CoverMaker.canvas,
		helper 			= CoverMaker.Helper,
		loader			= CoverMaker.Preload,
		instance;

	var Video = function(props) {
		this.DisplayObject_constructor();
		var options = {
			width: 471,
			height: 353
		};
		helper.setProperties(this, helper.extend(options, props));
		this.initialize();
	};
	var p = createjs.extend(Video, createjs.DisplayObject);
	p.initialize = Video;

	p.initialize = function() {
		this.setBounds(0, 0, this.width, this.height);
		this.sourceRect = new createjs.Rectangle(0, 0, this.width, this.height);

		var a = 125;
		var b = 0;
		var c = 0;
		var d = 180;
		var tx = 170;
		var ty = 70;

		var mask = new createjs.Shape();
		mask.graphics.beginStroke("#F00000").beginFill("#3C6452").drawEllipse(0, 0, 1, 1).endFill().endStroke();
		var matrix = new createjs.Matrix2D(a, b, c, d, tx, ty);
		matrix.decompose(mask);

		this.video = document.createElement('video');
		this.video.autoplay = true;
		this.video.width = this.width;
		this.video.height = this.height;
		this.video.style.display = 'none';
		document.body.appendChild(this.video);

		/*
		var colorMatrix = new createjs.ColorMatrix();
		colorMatrix.adjustSaturation(-100);
		colorMatrix.adjustContrast(50);
		var blackAndWhiteFilter = new createjs.ColorMatrixFilter(colorMatrix);
		this.filters = [blackAndWhiteFilter];
		this.cache(0, 0, this.width, this.height);
	*/

		/*this.scaleX = -1;
		this.x = this.width;*/

		//this.mask = mask;

	};

	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache) || this.video.paused) { return true; }
		ctx.scale(-1, 1);
		ctx.drawImage(this.video, -this.width, 0, this.width, this.height);
	};

	p.setSource = function(source) {
		this.video.pause();
		this.video.src = this.source = source;
		this.video.play();
	};

	p.getSource = function() {
		return this.source;
	};

	p.stop = function() {
		this.video.pause();
	};

	p.toString = function() {
		return "[Addon.Video]";
	};

	Video.getInstance = function () {
		if (!instance) {
			instance = new Video();
		}
		return instance;
	};

	CoverMaker.Video = createjs.promote(Video, "DisplayObject");

})();
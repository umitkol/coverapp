this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		scenes 		= CoverMaker.Scenes,
		loader		= CoverMaker.Preload,
		helper 		= CoverMaker.Helper,
		navigation	= CoverMaker.Navigation.getInstance(),
		instance;

	CoverMaker.Preload.queue.addEventListener("complete", complete);
	CoverMaker.Preload.queue.addEventListener("progress", progress);

	function complete(e) {
		setTimeout(function() { instance.complete(); }, 1000);
	}

	function progress(e) {
		if (!instance) {
			navigation.go(CoverMaker.Progress);
		} else {
			instance.drawProgress(e);
		}
	}


	var Progress = function(props) {
		props = props || {};
		var options = {
			barWidth: 400,
			barHeight: 30,
			barRadius: 15
		};
		helper.setProperties(this, helper.extend(options, props));

		this.initialize();
	};

	var p = createjs.extend(Progress, CoverMaker.Scene);
	p.initialize = Progress;

	p.initialize = function() {
		this.Scene_initialize();
		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var that = this;

		var logoImg = new Image();
		logoImg.src = "com/covermaker/images/logo.png";
		var logo;
		logoImg.onload = function() {
			logo = new createjs.Bitmap(logoImg);

			var bounds = logo.getBounds();
			logo.scaleX = logo.scaleY = 0.7;

			logo.setBounds(0, 0, logo.getTransformedBounds().width, logo.getTransformedBounds().height);

			helper.Alignment.horizontalCenter(logo, canvas);
			helper.Alignment.verticalCenter(logo, canvas);
			logo.set({y: logo.getTransformedBounds().y - 80});
			
			/*
			* logo.regX = 190 / 2;
			* logo.regY = 92 / 2;
			*/

			that.logo = logo;
			that.addChild(logo);
		};
		
		var loading = new createjs.Text("yükleniyor...", "55px GanacheRegular", "#fff");
		loading.shadow = new createjs.Shadow(createjs.Graphics.getRGB(0, 0, 0, .17), 2, 2, 4);

		var progressLength = new createjs.Text("%0", "48px GanacheRegular", "#fff");
		progressLength.shadow = new createjs.Shadow(createjs.Graphics.getRGB(0, 0, 0, .17), 2, 2, 4);

		var barContainer = new createjs.Container();

		var barBg = new createjs.Shape();
		barBg.graphics.beginLinearGradientFill(["#c10007", "#cd0008"], [0, 1], 0, 20, 0, 0).drawRoundRect(0, 0, this.barWidth, this.barHeight, this.barRadius).endFill();
		barBg.shadow = new createjs.Shadow(createjs.Graphics.getRGB(0, 0, 0, .25), 0, -2, 2);
		barBg.cache(0, 0, this.barWidth, this.barHeight);

		var barMask = new createjs.Shape();
		barMask.graphics.beginFill("#000").drawRoundRect(0, 0, this.barWidth, this.barHeight, this.barRadius).endFill();
		barMask.cache(0, 0, this.barWidth, this.barHeight);

		var bar = new createjs.Shape();
		bar.graphics.beginLinearGradientFill(["#e3b300", "#ffbe00"], [0, 1], 0, 30, 0, 5).drawRoundRect(0, 0, this.barRadius * 2, this.barHeight , this.barRadius);

		bar.filters = [
			new createjs.AlphaMaskFilter(barMask.cacheCanvas)
		];

		barContainer.addChild(barBg, bar);
		barContainer.setBounds(0, 0, this.barWidth + progressLength.getMeasuredWidth(), this.barHeight);

		barContainer.addChild(loading, progressLength);

		this.addChild(loading, barContainer);

		helper.Alignment.horizontalCenter([barContainer, loading], canvas);
		helper.Alignment.verticalCenter([barContainer, loading], canvas);

		progressLength.set({x: barMask.getTransformedBounds().width, y: -28});
		loading.set({x: (canvas.width / 2) - (loading.getMeasuredWidth() / 2), y: loading.y + 50});

		this.bar = bar;
		this.barContainer = barContainer;
		this.progressLength = progressLength;
		this.loading = loading;

		this.visible = false;
		this.alpha = 0;

	};

	p.OnLeave = function() {
		var that = this;
		this.leaveTimeline.addTween(
			createjs.Tween.get(this.loading).to({ y: this.loading.y + 20, alpha: 0 }, 650, createjs.Ease.sineIn),
			createjs.Tween.get(this.barContainer).to({ alpha: 0 }, 700, createjs.Ease.sineIn),
			createjs.Tween.get(this.logo).to({ x: (canvas.width / 2) - 225, y: 20, scaleY: 1, scaleX: 1}, 1000, createjs.Ease.circInOut).call(function() {
				that.Scene_OnLeave();
			})
		);
		this.leaveTimeline.gotoAndPlay();
	};

	p.drawProgress = function(e) {
		if (this.barWidth * (e.loaded / e.total) >= 30) {
			this.bar.graphics.drawRoundRect(0, 0, this.barWidth * (e.loaded / e.total), this.barHeight, this.barRadius);
		}
		this.progressLength.set({text: '%' + Math.round(100 * (e.loaded / e.total))});
	};

	p.complete = function() {
		navigation.go(CoverMaker.Intro);
	};

	p.toString = function() {
		return "[Scene.Progress]";
	};

	Progress.getInstance = function () {
		if (!instance) {
			instance = new Progress();
		}
		return instance;
	};
	
	CoverMaker.Progress = createjs.promote(Progress, "Scene");

})();
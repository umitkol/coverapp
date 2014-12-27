this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		scenes 		= CoverMaker.Scenes,
		instance;

	var Scene = function(props) {
		this.initialize();
	};

	var p = createjs.extend(Scene, createjs.Container);
	p.initialize = Scene;

	p.initialize = function() {
		this.Container_initialize();

		this.enterTimeline = new createjs.Timeline();
		this.leaveTimeline = new createjs.Timeline();
		this.enterTimeline.addEventListener('change', createjs.proxy(this.OnChange, this));
		this.leaveTimeline.addEventListener('change', createjs.proxy(this.OnChange, this));

	};

	p.OnEnter = function() {
		this.OnEnterScene();
	};

	p.OnLeave = function() {
		this.OnLeaveScene();
	};

	p.OnLeaveScene = function() {
		var that = this;
		that.alpha = 1;
		createjs.Tween.get(this).to({ alpha: 0 }, 500, createjs.Ease.sineIn).call(function() {
			that.visible = false;
		});
	};

	p.OnEnterScene = function() {
		var that = this;
		that.visible = true;
		that.alpha = 0;
		createjs.Tween.get(this).to({ alpha: 1 }, 500, createjs.Ease.sineIn);
	};

	p.OnEnterCompleted = function() {
		
	};

	p.OnChange = function(e) {
		if (this.leaveTimeline.duration > 0 && this.leaveTimeline.position >= this.leaveTimeline.duration) {
		}
	};

	p.toString = function() {
		return "[Scene.Scene]";
	};

	Scene.getInstance = function () {
		if (!instance) {
			instance = new Scene();
		}
		return instance;
	};

	
	CoverMaker.Scene = createjs.promote(Scene, "Container");

})();
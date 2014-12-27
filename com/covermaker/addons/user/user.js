this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	window.addEventListener('onfacebookloginsuccess', complete);

	function complete(e) {
		CoverMaker.User.getInstance(e.detail);
	}

	var stage			= CoverMaker.stage,
		canvas			= CoverMaker.canvas,
		helper 			= CoverMaker.Helper,
		loader			= CoverMaker.Preload,
		instance;

	var User = function(props) {
		this.Container_constructor();

		var options = {
			height: 110,
			width: 110,
			border: 4
		};
		helper.setProperties(this, helper.extend(options, props));
		this.initialize();
	};

	var p = createjs.extend(User, createjs.Container);
	p.initialize = User;

	p.initialize = function() {
		var border = new createjs.Shape();
		border.graphics.beginStroke("#e5e5e5").setStrokeStyle(this.border).drawRect(0, 0, this.border + this.width, this.border + this.height).endStroke().beginFill("#fff").drawRect(2, 2, 110, 110);
		border.setBounds(0, 0, this.border + this.width, this.border + this.height);

		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = "https://graph.facebook.com/"+this.userID+"/picture?width="+this.width+"&height="+this.height;
		var that = this;
		img.onload = function() {
			var image = new createjs.Bitmap(img);
			image.set({x: that.border / 2 , y: that.border / 2});

			that.addChild(border, image);
		}
		this.setBounds(0, 0, this.width, this.height);
	};

	User.getInstance = function (props) {
		if (!instance) {
			instance = new User(props);
		}
		return instance;
	};

	CoverMaker.User = createjs.promote(User, "Container");

})();
this.createjs = this.createjs || {};

(function() {
	"use strict";

	var helper 		= CoverMaker.Helper,
		loader		= CoverMaker.Preload;

	var Button = function(data) {
		this.initialize(data);
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
		this.addEventListener('tick', createjs.proxy(this.onTick, this));
	};
	
	var p = Button.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button);

		button.gotoAndStop("normal");

	};

	p.OnClick = function() {
		createjs.Sound.play("sound_click");
	};

	p.onTick = function() {
		this.alpha = this.disabled ? 0.3 : 1;
	};

	CoverMaker.Button = Button;

	var ChoiceButton = function(data) {
		this.initialize(data);
	};
	
	var p = ChoiceButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.cursor = 'default';

		this.addEventListener("mouseover", helper.getMethod(this, 'onOver'));
		this.addEventListener("mouseout", helper.getMethod(this, 'onOut'));

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, 340, 520).endFill();

		this.bg = new createjs.Shape();
		this.bg.graphics.beginFill("#ffd000").drawRoundRect(0, 0, 340, 520, 20).endFill();
		this.bg.shadow = new createjs.Shadow(createjs.Graphics.getRGB(0, 0, 0, .25), 0, -2, 2);
		this.bg.alpha = 1;
		//this.bg.visible = false;
		
		this.setBounds(0, 0, 340, 520);

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var buttonHelper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		button.x = (340 / 2) - data.frames.width / 2;
		button.y = 40;

		this.addChild(this.bg, button);
		button.gotoAndStop("normal");

	};

	p.onOver = function() {
		this.bg.alpha = 1;
	};

	p.onOut = function() {
		this.bg.alpha = 0;
	};

	CoverMaker.ChoiceButton = ChoiceButton;

	var BackButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_back").src],
			frames: {width:175, height:52},
			animations: {normal:[0], hover:[1]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = BackButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button);

		button.gotoAndStop("normal");

	};

	p.OnClick = function() {
		createjs.Sound.play("sound_click");
	};

	CoverMaker.BackButton = BackButton;

	var ContinueButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_continue").src],
			frames: {width:204, height:66},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
		this.addEventListener('mouseover', createjs.proxy(this.OnOver, this));
		this.addEventListener('mouseout', createjs.proxy(this.OnOut, this));
	};
	
	var p = ContinueButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		this.check = new createjs.Bitmap(loader.queue.getResult('btn_check'));
		this.check.set({
			alpha: 0, scaleX: 0.5, scaleY: 0.5,
			regX: this.check.getBounds().width / 2,
			regY: this.check.getBounds().height / 2
		}); 

		this.check.set({
			x: this.check.regX,
			y: this.check.regY
		});

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button, this.check);

		button.gotoAndStop("normal");

	};

	p.OnClick = function() {
		createjs.Sound.play("sound_click");
	};

	p.OnOver = function(e) {
		createjs.Tween.get(this.check).to({alpha: 1, scaleX: 1, scaleY: 1}, 200, createjs.Ease.backOut);
	};

	p.OnOut = function(e) {
		createjs.Tween.get(this.check).to({alpha: 0, scaleX: 0.5, scaleY: 0.5}, 200, createjs.Ease.backOut);
	};

	CoverMaker.ContinueButton = ContinueButton;

	var CancelButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_cancel").src],
			frames: {width:204, height:66},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});

		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = CancelButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button);

		button.gotoAndStop("normal");

	};

	p.OnClick = function(e) {
		if (this.parent && this.parent.OnCancelButton_Clicked) {
			this.parent.OnCancelButton_Clicked(e);
		}
		createjs.Sound.play("sound_click");
	};

	CoverMaker.CancelButton = CancelButton;

	var SaveButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_save").src],
			frames: {width:204, height:66},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = SaveButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button);

		button.gotoAndStop("normal");

	};

	p.OnClick = function(e) {
		if (this.parent && this.parent.OnSaveButton_Clicked) {
			this.parent.OnSaveButton_Clicked(e);
		}
		createjs.Sound.play("sound_click");
	};

	CoverMaker.SaveButton = SaveButton;

	var ShareButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_share").src],
			frames: {width:204, height:66},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = ShareButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button);

		button.gotoAndStop("normal");

	};

	p.OnClick = function(e) {
		if (this.parent && this.parent.OnShareButton_Clicked) {
			this.parent.OnShareButton_Clicked(e);
		}
		createjs.Sound.play("sound_click");
	};

	CoverMaker.ShareButton = ShareButton;

	var DeleteButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_delete").src],
			frames: {width:61, height:64},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
		this.addEventListener('mouseover', createjs.proxy(this.OnOver, this));
		this.addEventListener('mouseout', createjs.proxy(this.OnOut, this));
	};
	
	var p = DeleteButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		this.regX = 30;
		this.regY = 32;

		this.icon = new createjs.Bitmap(loader.queue.getResult('btn_delete-icon'));
		this.icon.mouseEnabled = false;
		this.icon.regX = this.icon.getBounds().width / 2;
		this.icon.regY = this.icon.getBounds().height / 2;
		this.icon.set({x: 30, y: 30, rotation: 180});

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button, this.icon);

		button.gotoAndStop("normal");

	};

	p.OnOver = function() {
		createjs.Tween.get(this.icon).to({rotation: 0}, 300, createjs.Ease.backOut);
	};

	p.OnOut = function() {
		createjs.Tween.get(this.icon).to({rotation: 180}, 300, createjs.Ease.backOut);
	};

	p.OnClick = function(e) {
		createjs.Sound.play("sound_click");
	};

	CoverMaker.DeleteButton = DeleteButton;

	var SendButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_send").src],
			frames: {width:204, height:66},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = SendButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button, this.icon);

		button.gotoAndStop("normal");

	};

	p.OnClick = function(e) {
		createjs.Sound.play("sound_click");
	};

	CoverMaker.SendButton = SendButton;

	var AgainButton = function() {
		this.initialize({
			images: [loader.queue.getItem("btn_again").src],
			frames: {width:225, height:52},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		this.addEventListener('click', createjs.proxy(this.OnClick, this));
	};
	
	var p = AgainButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(data) {
		this.Container_initialize();
		this.setBounds(0, 0, data.frames.width, data.frames.height);

		var hit = new createjs.Shape();
		hit.graphics.beginFill("#000").drawRect(0, 0, data.frames.width, data.frames.height).endFill();

		var spriteSheet = new createjs.SpriteSheet(data);
		var button = new createjs.Sprite(spriteSheet);
		var helper = new createjs.ButtonHelper(button, "normal", "hover", "clicked", false, hit);

		this.addChild(button, this.icon);

		button.gotoAndStop("normal");

	};

	p.OnClick = function(e) {
		createjs.Sound.play("sound_click");
	};

	CoverMaker.AgainButton = AgainButton;

}());
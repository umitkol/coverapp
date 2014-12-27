this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		scenes 		= CoverMaker.Scenes,
		loader		= CoverMaker.Preload,
		helper 		= CoverMaker.Helper,
		navigation	= CoverMaker.Navigation.getInstance(),
		facebook	= CoverMaker.Facebook.getInstance(),
		instance,
		logo;

	CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {
		var klass = Intro.getInstance();
		//navigation.go(CoverMaker.Intro);
	}

	var Intro = function() {
		this.initialize();
	};

	var p = createjs.extend(Intro, CoverMaker.Scene);
	p.initialize = Intro;

	p.initialize = function() {
		this.Container_initialize();

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		logo = new createjs.Bitmap(loader.queue.getResult('logo'));
		logo.y = 20;
		logo.visible = false;

		var text = new createjs.Bitmap(loader.queue.getResult('intro_text'));

		var container = new createjs.Container();
		var man1 = new createjs.Bitmap(loader.queue.getResult('intro_man1'));
		var man2 = new createjs.Bitmap(loader.queue.getResult('intro_man2'));
		var woman1 = new createjs.Bitmap(loader.queue.getResult('intro_woman1'));
		var woman2 = new createjs.Bitmap(loader.queue.getResult('intro_woman2'));
		var mug = new createjs.Bitmap(loader.queue.getResult('intro_mug'));
		var camera = new createjs.Bitmap(loader.queue.getResult('intro_camera'));
		var baloon = new createjs.Bitmap(loader.queue.getResult('intro_baloon'));
		var mugBig = new createjs.Bitmap(loader.queue.getResult('intro_mug-big'));
		var mugSmall = new createjs.Bitmap(loader.queue.getResult('intro_mug-small'));
		var mugText1 = new createjs.Bitmap(loader.queue.getResult('intro_mug-text1'));
		var mugText2 = new createjs.Bitmap(loader.queue.getResult('intro_mug-text2'));

		mugText1.set({x: -25, y: 164, alpha: 0});
		mugText2.set({x: -120, y: 165, alpha: 0});
		mugSmall.set({x: 205, y: 518, visible: false});

		var mugButton = new createjs.Shape();
		mugButton.cursor = 'pointer';
		mugButton.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("red").drawRect(200, 510, 60, 60).endFill());

		mugButton.addEventListener("mouseover", createjs.proxy(this.mugButton_MouseOver, this));
		mugButton.addEventListener("mouseout", createjs.proxy(this.mugButton_MouseOut, this));

		baloon.set({alpha: 0, x: 220, y: 520, rotation: 30, scaleX: 0.6, scaleY: 0.6, regX: baloon.getBounds().width, regY: baloon.getBounds().height});
		mugBig.set({alpha: 0, x: 40, y: 360, scaleX: 0.6, scaleY: 0.6, regX: mugBig.getBounds().width / 2, regY: mugBig.getBounds().height / 2});

		var overlay = new createjs.Shape(new createjs.Graphics().beginFill(createjs.Graphics.getRGB(237, 28, 36, .8)).drawRect(-canvas.width / 2 + 15, 0, canvas.width, canvas.height).endFill());
		overlay.set({alpha: 0});

		camera.set({x: -350, y: 380});
		mug.set({x: 230, y: 370});

		var startButton = new CoverMaker.Button({
			images: [loader.queue.getItem("intro_startButton").src],
			frames: {width:309, height:104},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		startButton.set({y: 610});
		startButton.regX = startButton.getBounds().width / 2;
		startButton.regY = startButton.getBounds().height / 2;
		startButton.scaleX = startButton.scaleY = 0.9;

		startButton.addEventListener("click", this.startButton_OnClicked);

		text.set({y: helper.getBottomPosition(startButton) });
		container.addChild(mug, camera, woman1, woman2, man1, man2, startButton, overlay, mugText1, mugText2, baloon, mugBig, mugSmall, mugButton);
		woman1.regX = woman2.regX = woman1.getBounds().width / 2;
		woman1.regY = woman2.regY = woman1.getBounds().height;

		man1.regX = man2.regX = man1.getBounds().width / 2;
		man1.regY = man2.regY = man1.getBounds().height;

		woman1.y = woman2.y = man1.y = man2.y = helper.getBottomPosition(startButton) - 15;

		man1.set({x: helper.getLeftPosition(startButton) + 50});
		man2.set({x: man1.x});
		woman1.set({x: helper.getLeftPosition(startButton) + 215});
		woman2.set({x: woman1.x});

		woman1.scaleX = woman2.scaleX = woman1.scaleY = woman2.scaleY = 0.8;
		man1.scaleX = man2.scaleX = man1.scaleY = man2.scaleY = woman1.scaleX;
		mug.alpha = camera.alpha = man1.alpha = man2.alpha = woman1.alpha = woman2.alpha = 0;

		this.addChild(logo, text, container);
		helper.Alignment.horizontalCenter([logo, text], canvas);
		container.set({x: 390, y: -30});

		this.container = container;
		this.woman1 = woman1;
		this.woman2 = woman2;
		this.man1 = man1;
		this.man2 = man2;
		this.startButton = startButton;
		this.mug = mug;
		this.camera = camera;
		this.baloon = baloon;
		this.mugBig = mugBig;
		this.overlay = overlay;
		this.mugSmall = mugSmall;
		this.mugText1 = mugText1;
		this.mugText2 = mugText2;

		this.visible = false;
		this.alpha = 0;

		var tab = new CoverMaker.Tabs.getInstance();

		stage.addChild(tab);

	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
		this.enterTimeline = new createjs.Timeline();
		var that = this;

		setTimeout(function() { logo.visible = true; }, 800);

		this.enterTimeline.addTween(
			createjs.Tween.get(that.startButton).wait(500).to({ scaleX: 1, scaleY: 1 }, 650, createjs.Ease.backOut).wait(150),
			createjs.Tween.get(that.woman1).wait(1000).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 650, createjs.Ease.backOut).wait(150),
			createjs.Tween.get(that.woman2).wait(1000).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 650, createjs.Ease.backOut).wait(150),
			createjs.Tween.get(that.man1).wait(1500).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 650, createjs.Ease.backOut).wait(150),
			createjs.Tween.get(that.man2).wait(1500).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 650, createjs.Ease.backOut).wait(150),
			createjs.Tween.get(that.camera).wait(1600).to({ alpha: 1 }, 1000, createjs.Ease.linear).wait(250),
			createjs.Tween.get(that.mug).wait(2000).to({ alpha: 1 }, 1000, createjs.Ease.linear).wait(150).call(function() {
				createjs.Tween.get(that.man2, {loop: true}).to({ alpha: 0 }, 750).to({alpha:1}, 750).wait(100);
				createjs.Tween.get(that.woman2, {loop: true}).to({ alpha: 0 }, 1000).to({alpha:1}, 1000).wait(150);
			})
		);
		this.enterTimeline.gotoAndPlay();
	};

	p.OnLeave = function() {
		this.Scene_OnLeave();
	};

	p.startButton_OnClicked = function() {
		/*if (facebook.isUserLikedPage) {
			navigation.go(CoverMaker.Choice);
		} else {
			alert("Başlamak için sayfayı beğen.");
		}*/
		navigation.go(CoverMaker.Choice);
	};

	p.mugButton_MouseOver = function() {
		this.mugSmall.visible = true;
		createjs.Tween.get(this.baloon).to({ alpha: 1, rotation: 0, scaleX: 1, scaleY: 1 }, 400, createjs.Ease.backOut);
		createjs.Tween.get(this.mugBig).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 400, createjs.Ease.backOut);
		createjs.Tween.get(this.overlay).to({ alpha: 1 }, 200, createjs.Ease.backOut);
		createjs.Tween.get(this.mugText1).to({ alpha: 1, x: -85 }, 500, createjs.Ease.backOut);
		createjs.Tween.get(this.mugText2).to({ alpha: 1, x: -140 }, 400, createjs.Ease.backOut);

		createjs.Sound.play('sound_back').volume = 0.1;
	};

	p.mugButton_MouseOut = function() {
		this.mugSmall.visible = false;
		createjs.Tween.get(this.baloon).to({ alpha: 0, rotation: 30, scaleX: .6, scaleY: .6 }, 400, createjs.Ease.backIn);
		createjs.Tween.get(this.mugBig).to({ alpha: 0, scaleX: .6, scaleY: .6 }, 400, createjs.Ease.backIn);
		createjs.Tween.get(this.overlay).to({ alpha: 0 }, 200, createjs.Ease.backIn);
		createjs.Tween.get(this.mugText1).to({ alpha: 0, x: -25 }, 500, createjs.Ease.backIn);
		createjs.Tween.get(this.mugText2).to({ alpha: 0, x: -120 }, 400, createjs.Ease.backIn);

		createjs.Sound.play('sound_back').volume = 0.1;
	};

	p.toString = function() {
		return "[Scene.Intro]";
	};

	Intro.getInstance = function () {
		if (!instance) {
			instance = new Intro();
		}
		return instance;
	};
	
	CoverMaker.Intro = createjs.promote(Intro, "Scene");

})();
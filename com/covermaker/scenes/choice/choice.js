this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		scenes 		= CoverMaker.Scenes,
		loader		= CoverMaker.Preload,
		helper 		= CoverMaker.Helper,
		navigation	= CoverMaker.Navigation.getInstance(),
		instance,
		makePostButton,
		makeCoverButton;

	window.addEventListener('PreloaderComplete', complete);

	function complete(e) {
		var klass = Choice.getInstance();
		loader = CoverMaker.Preload;
	}

	var Choice = function() {
		this.initialize();

	};

	var p = createjs.extend(Choice, CoverMaker.Scene);
	p.initialize = Choice;

	p.initialize = function() {
		this.Container_initialize();

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var backButton = new CoverMaker.BackButton();
		backButton.set({x: 80, y: 50});
		backButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		makeCoverButton = new CoverMaker.ChoiceButton({
			images: [loader.queue.getItem("choice_makeCoverBtn").src],
			frames: {width:loader.queue.getResult("choice_makeCoverBtn").width, height:loader.queue.getResult("choice_makeCoverBtn").height},
			animations: {normal:[0]}
		});
		makeCoverButton.set({alpha: 0, rotation: -40});

		makePostButton = new CoverMaker.ChoiceButton({
			images: [loader.queue.getItem("choice_makePostBtn").src],
			frames: {width:loader.queue.getResult("choice_makePostBtn").width, height:loader.queue.getResult("choice_makePostBtn").height},
			animations: {normal:[0]}
		});
		makePostButton.set({alpha: 0, rotation: 40});

		var continueCoverButton = new CoverMaker.ContinueButton();
		continueCoverButton.name = 'continue';
		continueCoverButton.set({y: 400, x: (makePostButton.getBounds().width / 2) - continueCoverButton.getBounds().width / 2});
		var continuePostButton = new CoverMaker.ContinueButton();
		continuePostButton.name = 'continue';
		continuePostButton.set({y: 400, x: (makePostButton.getBounds().width / 2) - continuePostButton.getBounds().width / 2});

		continueCoverButton.visible = continuePostButton.visible = false;

		makeCoverButton.addChild(continueCoverButton);
		makePostButton.addChild(continuePostButton);

		makeCoverButton.addEventListener('mouseover', helper.getMethod(this, 'OnChoiceButtonMouseOver'));
		makeCoverButton.addEventListener('mouseout', helper.getMethod(this, 'OnChoiceButtonMouseOut'));
		continueCoverButton.addEventListener('click', helper.getMethod(this, 'onCoverBtnClicked'));
		makePostButton.addEventListener('mouseover', helper.getMethod(this, 'OnChoiceButtonMouseOver'));
		makePostButton.addEventListener('mouseout', helper.getMethod(this, 'OnChoiceButtonMouseOut'));
		continuePostButton.addEventListener('click', helper.getMethod(this, 'onPostBtnClicked'));

		makeCoverButton.regX = 0;
		makeCoverButton.regY = makeCoverButton.getBounds().height;

		makePostButton.regX = makePostButton.getBounds().width;
		makePostButton.regY = makePostButton.getBounds().height;

		makeCoverButton.y = makePostButton.y = makePostButton.getBounds().height + 140;
		helper.Alignment.distributeHorizontalCenter([makeCoverButton, makePostButton], canvas);
		makePostButton.x = 900;
		makeCoverButton.x = -150;

		/*makeCoverButton.addEventListener("click", helper.getMethod(this, "onBtnClicked"));
		makePostButton.addEventListener("click", helper.getMethod(this, "onBtnClicked"));*/

		this.addChild(backButton, makeCoverButton, makePostButton);


		this.visible = false;
		this.alpha = 0;
	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
		var that = this;
		this.enterTimeline = new createjs.Timeline();
		this.enterTimeline.addTween(
			createjs.Tween.get(makeCoverButton).wait(1000).to({ rotation: 0, alpha: 1, x: 32.5 }, 1000, createjs.Ease.backOut).call(function() {
				createjs.Tween.get(makeCoverButton.bg).to({alpha: 0}, 250);
			}),
			createjs.Tween.get(makePostButton).wait(500).to({ rotation: 0, alpha: 1, x: 777.5 }, 1000, createjs.Ease.backOut).call(function() {
				createjs.Tween.get(makePostButton.bg).to({alpha: 0}, 250);
			})
		);
		this.enterTimeline.gotoAndPlay();
	};

	p.OnLeave = function() {
		this.leaveTimeline = new createjs.Timeline();
		var that = this;
		this.leaveTimeline.addTween(
			createjs.Tween.get(makeCoverButton).to({ rotation: -40, alpha: 0, x: -150 }, 1000, createjs.Ease.backOut).call(function() {
				createjs.Tween.get(makeCoverButton.bg).to({alpha: makeCoverButton.bg.alpha}, 250).call(function() {
					that.visible = false;
				})
			}),
			createjs.Tween.get(makePostButton).to({ rotation: 40, alpha: 0, x: 900 }, 1000, createjs.Ease.backOut).call(function() {
				createjs.Tween.get(makePostButton.bg).to({alpha: makePostButton.bg.alpha}, 250);
			})
		);

		this.leaveTimeline.gotoAndPlay();
	};

	p.onCoverBtnClicked = function() {
		this.OnLeave();
		CoverMaker.session.photoType = 'cover';
		if(CoverMaker.Navigation.hasClass(CoverMaker.Post.getInstance())) {
			CoverMaker.Navigation.replace(CoverMaker.Post.getInstance(), CoverMaker.Cover);
			navigation.go(CoverMaker.Cover, CoverMaker.Choice);
		} else {
			navigation.go(CoverMaker.Cover, CoverMaker.Choice);
		}
	};

	p.onPostBtnClicked = function() {
		this.OnLeave();
		CoverMaker.session.photoType = 'post';
		if(CoverMaker.Navigation.hasClass(CoverMaker.Cover.getInstance())) {
			CoverMaker.Navigation.replace(CoverMaker.Cover.getInstance(), CoverMaker.Post);
			navigation.go(CoverMaker.Post, CoverMaker.Choice);
		} else {
			navigation.go(CoverMaker.Post, CoverMaker.Choice);
		}
	};

	p.OnBackButtonClicked = function(e) {
		this.OnLeave();
		navigation.go(CoverMaker.Intro, CoverMaker.Choice);
	};

	p.OnChoiceButtonMouseOver = function(e) {
		var continueButton = e.currentTarget.getChildByName('continue');
		continueButton.visible = true;
	};

	p.OnChoiceButtonMouseOut = function(e) {
		var continueButton = e.currentTarget.getChildByName('continue');
		continueButton.visible = false
	};

	p.toString = function() {
		return "[Scene.Choice]";
	};

	Choice.getInstance = function () {
		if (!instance) {
			instance = new Choice();
		}
		return instance;
	};

	CoverMaker.Choice = createjs.promote(Choice, "Scene");

})();
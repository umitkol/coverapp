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
		continueButton,
		currentItem;

	CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {
		var klass = Post.getInstance();
	}

	var Post = function() {
		this.initialize();
	};

	var p = createjs.extend(Post, CoverMaker.Scene);
	p.initialize = Post;

	p.initialize = function() {
		this.Container_initialize();

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var backButton = new CoverMaker.BackButton();
		backButton.set({x: 80, y: 50});
		backButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		var title = new createjs.Bitmap(loader.queue.getResult('post_title'));
		title.y = 125;
		helper.Alignment.horizontalCenter(title, canvas);

		var scroller = new CoverMaker.Scroller({
			height: 420,
			width: 726
		});

		scroller.addPostImage('post_photo_1', loader.queue.getResult('post_photo_1'), 1);
		scroller.addPostImage('post_photo_2', loader.queue.getResult('post_photo_2'), 2);
		scroller.addPostImage('post_photo_3', loader.queue.getResult('post_photo_3'), 3);
		scroller.addPostImage('post_photo_4', loader.queue.getResult('post_photo_4'), 4);
		scroller.addPostImage('post_photo_5', loader.queue.getResult('post_photo_5'), 5);
		scroller.addPostImage('post_photo_6', loader.queue.getResult('post_photo_6'), 6);
		scroller.addPostImage('post_photo_7', loader.queue.getResult('post_photo_7'), 7);
		scroller.addPostImage('post_photo_8', loader.queue.getResult('post_photo_8'), 8);

		scroller.set({y: helper.getBottomPosition(title) + 10});
		window.addEventListener('onitemclicked', helper.getMethod(this, 'OnItemClicked'));

		continueButton = new CoverMaker.ContinueButton();
		continueButton.set({
			scaleX: 0.5,
			scaleY: 0.5,
			regX: continueButton.getBounds().width / 2,
			regY: continueButton.getBounds().height / 2,
			y: helper.getBottomPosition(scroller) + 60
		});

		helper.Alignment.horizontalCenter([scroller, continueButton], canvas);
		continueButton.alpha = 0;
		continueButton.addEventListener('click', helper.getMethod(this, 'OnContinueButtonClicked'));

		this.addChild(backButton, title, scroller, continueButton);
		this.visible = false;
		this.alpha = 0;
	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
	};

	p.OnLeave = function() {
		this.Scene_OnLeave();
		this.visible = false;
		this.alpha = 0;

		console.log("OnLeave Post");
	};

	p.OnItemClicked = function(e) {
		var that = e.currentTarget;
		currentItem = that.currentItem;
		createjs.Tween.get(continueButton).to({alpha: 1, scaleX: 1, scaleY: 1}, 300, createjs.Ease.backOut);
	};

	p.OnBackButtonClicked = function(e) {
		this.OnLeave();
		navigation.go(CoverMaker.Choice);
	};

	p.OnContinueButtonClicked = function() {
		navigation.go(CoverMaker.Studio);
	};

	p.getCurrentItem = function() {
		return currentItem;
	};
 
	p.toString = function() {
		return "[Scene.Post]";
	};

	Post.getInstance = function () {
		if (!instance) {
			instance = new Post();
		}
		return instance;
	};

	CoverMaker.Post = createjs.promote(Post, "Scene");

})();
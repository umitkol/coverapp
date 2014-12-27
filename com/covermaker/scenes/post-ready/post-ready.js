this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		scenes 		= CoverMaker.Scenes,
		loader		= CoverMaker.Preload,
		helper 		= CoverMaker.Helper,
		facebook	= CoverMaker.Facebook,
		navigation	= CoverMaker.Navigation.getInstance(),
		instance,
		continueButton,
		coverContainer,
		cover,
		capturedPhoto,
		user,
		title,
		cancelButton,
		saveButton,
		shareButton,
		coverWidth = 400,
		coverHeight = 400;

	CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {
		var klass = PostReady.getInstance();
	};

	var PostReady = function() {
		this.initialize();
	};

	var p = createjs.extend(PostReady, CoverMaker.Scene);
	p.initialize = PostReady;

	p.initialize = function() {
		this.Container_initialize();

		window.addEventListener('onphotocaptured', createjs.proxy(this.OnPhotoCaptured, this));
		window.addEventListener('onitemclicked', createjs.proxy(this.OnItemClicked, this));
		window.addEventListener('onfacebooksharesuccess', createjs.proxy(this.OnShareSuccess, this));

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var backButton = new CoverMaker.BackButton();
		backButton.set({x: 80, y: 50});
		backButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		cancelButton = new CoverMaker.CancelButton();
		saveButton = new CoverMaker.SaveButton();
		shareButton = new CoverMaker.ShareButton();

		title = new createjs.Bitmap(loader.queue.getResult('cover_ready_title'));
		title.set({y: 125});

		coverContainer = new createjs.Container();
		cover = new createjs.Bitmap(new Image());
		var coverBounds = cover.getBounds();
		var d = new createjs.Shape();
			d.graphics.beginFill("#fff").drawRect(0, 0, coverWidth, coverHeight).endFill;
			d.setBounds(0, 0, coverWidth, coverHeight);

		coverContainer.scaleY = coverContainer.scaleX = coverWidth / coverBounds.width;
		coverContainer.setBounds(0, 0, coverWidth, coverBounds.height);
		coverContainer.cache(0, 0, coverBounds.width, coverBounds.height);
		coverContainer.set({y: helper.getBottomPosition(title) - 25, alpha: 0});

		helper.Alignment.horizontalCenter([title, coverContainer, cancelButton], canvas);

		user = CoverMaker.User.getInstance();

		this.addChild(backButton, title, coverContainer, cancelButton, saveButton, shareButton);

		helper.Alignment.distributeHorizontalCenter([cancelButton, saveButton, shareButton], canvas, 5);
		this.visible = false;
	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
		var that = this;
		this.enterTimeline = new createjs.Timeline();
		this.enterTimeline.addTween(
			createjs.Tween.get(coverContainer).to({ y: coverContainer.y + 50, alpha: 1 }, 500, createjs.Ease.backOut).call(function() {
				createjs.Sound.play('sound_tada');
			})
		);
		this.enterTimeline.gotoAndPlay();
	};

	p.OnLeave = function() {
		this.Scene_OnLeave();
		var that = this;
		this.leaveTimeline = new createjs.Timeline();
		this.leaveTimeline.addTween(
			createjs.Tween.get(coverContainer).to({ y: coverContainer.y - 50, alpha: 0 }, 500, createjs.Ease.backOut)
		);
		this.leaveTimeline.gotoAndPlay();
	};

	p.OnBackButtonClicked = function(e) {
		navigation.prev();
	};

	p.OnPhotoCaptured = function(e) {

		var def = {x: 345, y: 20, rotation: 0, scaleX: 1, scaleY: 1};
		var pos = {};
		switch (cover.coverName) {

			case 'post_photo_1':
				pos = { x: 180, y: 100, scaleX: 2, scaleY: 2 };
			break;
			case 'post_photo_2':
				pos = { x: 310, y: 50, scaleX: 0.7, scaleY: 0.7 };
			break;
			case 'post_photo_3':
				pos = { x: 270, y: 170, scaleX: 1, scaleY: 1 };
			break;
			case 'post_photo_4':
				pos = { x: 150, y: 80, scaleX: 2.5, scaleY: 2.5 };
			break;
			case 'post_photo_5':
				pos = { x: 280, y: 185, scaleX: 1.2, scaleY: 1.2 };
			break;
			case 'post_photo_6':
				pos = { x: 230, y: 50, scaleX: 2, scaleY: 2 };
			break;
			case 'post_photo_7':
				pos = { x: 210, y: 50, scaleX: 1.3, scaleY: 1.3 };
			break;
			case 'post_photo_8':
				pos = { x: 160, y: 100, scaleX: 1.5, scaleY: 1.5 };
			break;
		}

		var image = e.detail.image.clone();
		image.name = 'captured';
		//image.scaleY = image.scaleX = coverContainer.scaleX;
		image.set(def);
		image.set(helper.extend(def, pos));

		//coverContainer.addChild(image);
		coverContainer.removeChild(coverContainer.getChildByName('captured'));
		coverContainer.addChildAt(image, 0);
		coverContainer.updateCache();

	};

	p.OnItemClicked = function(e) {
		var current = e.detail.current;
		var image = cover = current.getChildByName('image').clone(true);
		image.coverName = e.detail.name;

		var coverBounds = image.getBounds();

		coverContainer.removeChild(coverContainer.getChildByName('image'));

		coverContainer.scaleY = coverContainer.scaleX = coverWidth / coverBounds.width;
		coverContainer.setBounds(0, 0, coverWidth, coverBounds.height);
		coverContainer.cache(0, 0, coverBounds.width, coverBounds.height);
		coverContainer.set({y: helper.getBottomPosition(title) - 25, alpha: 0});

		cancelButton.set({y: helper.getBottomPosition(coverContainer) + 80});
		saveButton.set({y: cancelButton.y });
		shareButton.set({y: cancelButton.y});

		coverContainer.addChild(image);
		coverContainer.updateCache();
	};

	p.OnCancelButton_Clicked = function(e) {
		navigation.prev();
	};

	p.OnSaveButton_Clicked = function(e) {
		if (cover) {
			this.saveCover().done(function(file) {
				window.location.href =  "download.php?path="  + file;
			});
		}
	};

	p.OnShareButton_Clicked = function(e) {
		if (cover) {
			this.saveCover().done(function(file) {
				facebook.sharePost(file);
			});
			/*this.saveCover().done(function(file) {
				facebook.shareCover(file);
			});*/
		}
	};

	p.OnShareSuccess = function() {
		navigation.go(CoverMaker.Congratulations);
	};

	p.saveCover = function() {
		return $.ajax({
			url: 'save.php',
			method: 'POST',
		    data: {cover: coverContainer.cacheCanvas.toDataURL('jpeg', 1)},
		    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			success: function(file) {
				//window.location.href =  "download.php?path="  + file;
			},
			error: function(err) {
				console.error(err);
			}
		});
	};
 
	p.toString = function() {
		return "[Scene.PostReady]";
	};

	PostReady.getInstance = function () {
		if (!instance) {
			instance = new PostReady();
		}
		return instance;
	};

	CoverMaker.PostReady = createjs.promote(PostReady, "Scene");

})();
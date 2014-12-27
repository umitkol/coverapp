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
		webcam,
		video,
		capturePhotoButton,
		continueButton,
		croppedImage,
		videoContainer,
		shadePlus,
		deleteButton;

	//CoverMaker.Preload.queue.addEventListener("complete", complete);

	function complete(e) {
		var klass = Studio.getInstance();
	}

	var Studio = function() {
		this.initialize();
	};
	
	var p = createjs.extend(Studio, CoverMaker.Scene);
	p.initialize = Studio;

	p.initialize = function() {
		this.Container_initialize();

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var backButton = new CoverMaker.BackButton();
		backButton.set({x: 80, y: 50});
		backButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		var text = new createjs.Bitmap(loader.queue.getResult('studio_text'));
		text.set({y: 130});

		capturePhotoButton = new CoverMaker.Button({
			images: [loader.queue.getItem("studio_capturePhotoButton").src],
			frames: {width:394, height:loader.queue.getResult("studio_capturePhotoButton").height},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		capturePhotoButton.addEventListener('click', createjs.proxy(this.capturePhotoButton_Clicked, this), false);

		continueButton = new CoverMaker.Button({
			images: [loader.queue.getItem("studio_continueButton").src],
			frames: {width:394, height:loader.queue.getResult("studio_continueButton").height},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		continueButton.addEventListener('click', createjs.proxy(this.continueButton_Clicked, this));

		deleteButton = new CoverMaker.DeleteButton();
		deleteButton.set({x: 540, y: 290, alpha: 0, scaleX: 0.5, scaleY: 0.5});
		deleteButton.addEventListener('click', createjs.proxy(this.deleteButton_Clicked, this));

		this.container = new createjs.Container();
		this.container.set({y: 250});
		var background = new createjs.Bitmap(loader.queue.getResult('studio_cameraBackground'));
		background.set({x: 150,y: 140});
		this.container.setBounds(0, 0, background.getBounds().width, background.getBounds().height);
		var mask = new createjs.Shape();
		mask.graphics.beginFill("#000").drawCircle(405, 486, 176).endFill();

		var shade = new createjs.Bitmap(loader.queue.getResult('studio_shade'));
		shade.set({x: 160, y: 50});

		shadePlus = new createjs.Bitmap(loader.queue.getResult('studio_shade-plus'));
		shadePlus.set({x: 160, y: 50});

		this.container.addChild(shadePlus, shade);

		webcam = CoverMaker.Webcam.getInstance();
		webcam.addEventListener('onhandledvideo', helper.getMethod(this, 'OnHandledVideo'));
		webcam.addEventListener('onerrorvideo', helper.getMethod(this, 'OnErrorVideo'));

		video = CoverMaker.Video.getInstance();

		this.addChild(background, backButton, text, this.container, capturePhotoButton, continueButton, deleteButton);

		helper.Alignment.horizontalCenter([text, this.container, capturePhotoButton, continueButton, background], canvas);
		capturePhotoButton.set({y: helper.getBottomPosition(this.container) - 340, visible: false});
		continueButton.set({y: helper.getBottomPosition(this.container) - 340, visible: false});

		this.container.mask = mask;

		this.visible = false;
	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
		capturePhotoButton.visible = false;
		continueButton.visible = false;
		createjs.Tween.get(deleteButton).to({alpha: 0, scaleX: 0.5, scaleY: 0.5}, 400, createjs.Ease.backOut);
		video.uncache();
		webcam.open();
	};

	p.OnLeave = function() {
		this.Scene_OnLeave();
		webcam.close();
	};

	p.OnBackButtonClicked = function() {
		navigation.prev();
	};

	p.OnHandledVideo = function(e) {
		video.setSource(webcam.getObjectURL());
		videoContainer = new createjs.Container();
		videoContainer.set({x: 125, y: 64});
		videoContainer.addChild(video);
		//videoContainer.set({scaleX: -1, x: videoContainer.x + 471});
		//this.addChild(video);
		this.container.addChildAt(videoContainer, 0);
		capturePhotoButton.visible = true;
		continueButton.visible = false;
		createjs.Tween.get(deleteButton).to({alpha: 0, scaleX: 0.5, scaleY: 0.5}, 400, createjs.Ease.backOut);
	};

	p.OnErrorVideo = function() {
		continueButton.visible = false;
		capturePhotoButton.visible = true;
		deleteButton.visible = false;
	};

	p.capturePhotoButton_Clicked = function() {
		if (!webcam.isCanWork) return;
		createjs.Sound.play('sound_capture-photo');
		continueButton.visible = true;
		capturePhotoButton.visible = false;
		video.cache(160, 70, 150, 190);
		video.video.pause();
		webcam.close();

		createjs.Tween.get(deleteButton).to({alpha: 1, scaleX: 1, scaleY: 1}, 400, createjs.Ease.backOut);

		croppedImage = video.captured = new createjs.Bitmap(video.cacheCanvas.toDataURL('image/png'))
	};

	p.deleteButton_Clicked = function() {
		capturePhotoButton.visible = true;
		continueButton.visible = false;
		webcam.open();
		video.uncache();
		video.video.play();
	};

	p.continueButton_Clicked = function() {
		if (CoverMaker.session.photoType == 'post') {
			if(CoverMaker.Navigation.hasClass(CoverMaker.CoverReady.getInstance())) {
				CoverMaker.Navigation.replace(CoverMaker.CoverReady.getInstance(), CoverMaker.PostReady);
				navigation.go(CoverMaker.PostReady);
			} else {
				navigation.go(CoverMaker.PostReady);
			}
		}
		if (CoverMaker.session.photoType == 'cover') {
			if(CoverMaker.Navigation.hasClass(CoverMaker.PostReady.getInstance())) {
				CoverMaker.Navigation.replace(CoverMaker.PostReady.getInstance(), CoverMaker.CoverReady);
				navigation.go(CoverMaker.CoverReady);
			} else {
				navigation.go(CoverMaker.CoverReady);
			}
		}

		var e = new CustomEvent('onphotocaptured',
			{
				detail:{
					image: croppedImage
				},
				bubbles: true,
				cancelable: true
			}
		);
		window.dispatchEvent(e);
	};

	p.toString = function() {
		return "[Scene.Studio]";
	};

	Studio.getInstance = function () {
		if (!instance) {
			instance = new Studio();
		}
		return instance;
	};

	CoverMaker.Studio = createjs.promote(Studio, "Scene");

})();
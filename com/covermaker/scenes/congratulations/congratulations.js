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

	function complete(e) {
		var klass = Congratulations.getInstance();
	}

	var Congratulations = function() {
		this.initialize();
	};

	var p = createjs.extend(Congratulations, CoverMaker.Scene);
	p.initialize = Congratulations;

	p.initialize = function() {
		this.Scene_initialize();

		this.setBounds(0, 0, canvas.width, canvas.height);
		stage.addChild(this);

		var inputElement = document.createElement('input');
		inputElement.id = 'email_text';
		inputElement.style.padding = '8px 5px';
		inputElement.style.width = '365px';
		inputElement.style.border = 'none';
		inputElement.style.fontSize = '20px';
		inputElement.setAttribute('type', 'email');
		document.body.appendChild(inputElement);

		var backButton = new CoverMaker.BackButton();
		backButton.set({x: 80, y: 50});
		backButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		var title = new createjs.Bitmap(loader.queue.getResult('congratulations_title'));
		title.y = 190;

		var text = new createjs.Bitmap(loader.queue.getResult('congratulations_text'));
		text.y = 324;

		var container = new createjs.Container();
		container.setBounds(0, 0, 624, 66);
		container.y = 430;
		var inputBg = new createjs.Bitmap(loader.queue.getResult('congratulations_input-bg'));
		var sendButton = new CoverMaker.SendButton();
		sendButton.addEventListener('click', createjs.proxy(this.sendBtn_Clicked, this));
		sendButton.x = helper.getRightPosition(inputBg) + 10;

		var input = new createjs.DOMElement(inputElement);
		input.regX = -110;
		input.regY = 465;

		container.addChild(inputBg, sendButton);

		var againButton = new CoverMaker.AgainButton();
		againButton.y = 560;
		againButton.addEventListener('click', createjs.proxy(this.againBtn_Clicked, this));

		helper.Alignment.horizontalCenter([title, text, container, againButton], canvas);
		this.addChild(title, text, container, againButton, input);

		this.visible = false;
		this.alpha = 0;
	};

	p.OnEnter = function() {
		this.Scene_OnEnter();
	};

	p.OnLeave = function() {
		this.Scene_OnLeave();
	};

	p.sendBtn_Clicked = function(e) {
		var facebook = CoverMaker.Facebook.getInstance();
		var el = new Everlive('Z9aMgoDg0vdvXhO0');
		var data = el.data('Subscribers');
		data.create(
			{ 
				facebookId: facebook.getUserID(),
				email: document.getElementById('email_text').innerText
			},
			function(data){
			    alert('Bilgileriniz başarıyla kaydedildi.');
			    navigation.go(CoverMaker.Intro, CoverMaker.Congratulations);
			},
			function(error){
			    alert('Bilgileriniz kaydedilirken bir haya oluştu.');
			}
		);
	};

	p.againBtn_Clicked = function(e) {
		navigation.go(CoverMaker.Choice, CoverMaker.Congratulations);
	};
 
	p.toString = function() {
		return "[Scene.Congratulations]";
	};

	Congratulations.getInstance = function () {
		if (!instance) {
			instance = new Congratulations();
		}
		return instance;
	};

	CoverMaker.Congratulations = createjs.promote(Congratulations, "Scene");

})();
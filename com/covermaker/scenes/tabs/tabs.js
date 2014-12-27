this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage		= CoverMaker.stage,
		canvas		= CoverMaker.canvas,
		helper		= CoverMaker.Helper,
		loader		= CoverMaker.Preload,
		navigation	= CoverMaker.Navigation.getInstance(),
		instance,
		activeTab;

	var Tabs = function(props) {
		this.Container_constructor();
		this.initialize();
	};

	var p = createjs.extend(Tabs, createjs.Container);
	p.initialize = Tabs;

	p.initialize = function() {
		this.Container_initialize();

		var tab1 = new createjs.Container();

		var tab1BackButton = new CoverMaker.BackButton();
		tab1BackButton.set({x: 80, y: 50});
		tab1BackButton.addEventListener('click', helper.getMethod(this, 'OnBackButtonClicked'));

		tab1.name = 'tab1';

		var tab1Title = new createjs.Bitmap(loader.queue.getResult('tab_1_title'));
		tab1Title.y = 120;
		var tab1Scroller = new CoverMaker.Scroller({
			height: 450,
			width: 720
		});
		tab1Scroller.addContent(new createjs.Bitmap(loader.queue.getResult('tab_1')));
		tab1Scroller.y = 270;
		tab1.addChild(tab1BackButton, tab1Title, tab1Scroller);

		var tab2 = new createjs.Container();
		tab2.name = 'tab2';

		var tab2BackButton = new CoverMaker.BackButton();
		tab2BackButton.set({x: 80, y: 50});
		tab2BackButton.addEventListener('click', createjs.proxy(this.OnBackButtonClicked, this));

		var tab2Title = new createjs.Bitmap(loader.queue.getResult('tab_2_title'));
		tab2Title.y = 120;
		var tab2Scroller = new CoverMaker.Scroller({
			height: 450,
			width: 700
		});
		tab2Scroller.addContent(new createjs.Bitmap(loader.queue.getResult('tab_2')));
		tab2Scroller.y = 270;
		tab2.addChild(tab2BackButton, tab2Title, tab2Scroller);

		tab1.setBounds(0, 0, stage.width, stage.height);
		tab2.setBounds(0, 0, stage.width, stage.height);

		tab1.alpha = tab2.alpha = 0;

		var btn1 = new CoverMaker.Button({
			images: [loader.queue.getItem("tab_nasil-oynarim").src],
			frames: {width:219, height:81},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		btn1.name = 'btn2';
		btn1.play = true;
		btn1.x = 159;

		var btn2 = new CoverMaker.Button({
			images: [loader.queue.getItem("tab_kullanim-kosullari").src],
			frames: {width:253, height:81},
			animations: {normal:[0], hover:[1], clicked:[2]}
		});
		btn2.name = 'btn1';
		btn2.play = true;
		btn2.x = 388;

		btn1.y = btn2.y = 730;

		btn1.addEventListener('click', createjs.proxy(this.OnClick, this));
		btn2.addEventListener('click', createjs.proxy(this.OnClick, this));

		helper.Alignment.horizontalCenter([tab1Title, tab1Scroller, tab2Title, tab2Scroller], canvas);

		this.addChild(tab1, tab2, btn1, btn2);

	};

	p.OnClick = function(e) {
		var that = e.currentTarget;
		var target = e.target;
		var currentKlass = navigation.getCurrentKlass();
		createjs.Tween.get(currentKlass).to({alpha: 0}, 100, createjs.Ease.backOut);
		switch(that.name) {
			case 'btn1':
				activeTab = this.getChildByName('tab1');
				this.getChildByName('tab2').alpha = 0;
			break;
			case 'btn2':
				activeTab = this.getChildByName('tab2');
				this.getChildByName('tab1').alpha = 0;
			break;
		}
		createjs.Tween.get(activeTab).to({alpha: 1}, 100, createjs.Ease.backOut);
	};

	p.OnBackButtonClicked = function() {
		var currentKlass = navigation.getCurrentKlass();
		createjs.Tween.get(currentKlass).to({alpha: 1}, 100, createjs.Ease.backOut);
		createjs.Tween.get(activeTab).to({alpha: 0}, 100, createjs.Ease.backOut);
	};

	p.toString = function() {
		return "[Tabs]";
	};

	Tabs.getInstance = function () {
		if (!instance) {
			instance = new Tabs();
		}
		return instance;
	};

	
	CoverMaker.Tabs = createjs.promote(Tabs, "Container");

})();
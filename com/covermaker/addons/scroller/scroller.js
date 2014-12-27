this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage			= CoverMaker.stage,
		canvas			= CoverMaker.canvas,
		helper 			= CoverMaker.Helper,
		loader			= CoverMaker.Preload;

	var Scroller = function(props) {
		var options = {
			trackHeight: 100,
			trackWidth: 20,
			trackPosition: 'right',
			dragHeight: 100,
			width: 500,
			height: 150,
			contentMarginRight: 25
		};
		this.currentItem = null;
		this.scrollEnd = false;
		this.scrollStart = false;
		this.percentScroll = 0;
		helper.setProperties(this, helper.extend(options, props));
		this.initialize();
	};

	var p = Scroller.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function() {
		this.Container_initialize();
		this.setBounds(0, 0, this.width, this.height);

		var track = new createjs.Container();
		track.cursor = "pointer";
		var trackBg = new createjs.Shape();
		trackBg.graphics.beginFill(createjs.Graphics.getRGB(162, 0, 5, .5)).drawRoundRect(0, 0, this.trackWidth, this.height, 10).endFill();
		trackBg.graphics.beginFill("#fff").drawRoundRect(5, 5, 10, (this.height - 10), 5).endFill();
		track.addChild(trackBg);

		if(this.trackPosition == 'left') {
			track.set({x: 0});
		} else {
			track.set({x: this.width - this.trackWidth});
		}
		track.setBounds(track.x, track.y, this.trackWidth, this.trackHeight);

		this.drag = new createjs.Container();
		this.drag.setBounds(this.drag.x, this.drag.y, this.trackWidth, this.dragHeight);
		var dragImg = new createjs.Bitmap(loader.queue.getResult('scroller_drag'));
		var dragImgBounds = dragImg.getBounds();
		this.dragHeight = dragImgBounds.height;
		this.dragWidth = dragImgBounds.width;
		trackBg.set({x: (this.dragWidth / 2) - (this.trackWidth / 2)});
		this.trackWidth = dragImgBounds.width;


		var dragBg = new createjs.Shape();
		dragBg.graphics.beginFill("#fff").drawRoundRect(0, 0, this.trackWidth, this.dragHeight, 5).endFill();
		this.drag.addChild(dragImg);

		this.drag.addEventListener("pressmove", helper.getMethod(this, 'OnTrackDrag'));
		this.drag.addEventListener("mousedown", helper.getMethod(this, 'OnTrackMouseDown'));
		//this.drag.addEventListener("click", helper.getMethod(this, 'OnTrackDrag'));

		track.addChild(this.drag);

		this.container = new createjs.Container();
		this.container.setBounds(0, 0, this.width - this.trackWidth, this.height);

		this.content = new createjs.Container();
		this.content.set({width: this.width - this.contentMarginRight - this.trackWidth});
		//this.content.setBounds(0, 0, this.width - this.trackWidth, 800);

		this.container.addChild(this.content);

		var mask = new createjs.Shape();
		mask.graphics.beginFill("#000").drawRect(0, 0, this.width - this.trackWidth, this.height);
		this.container.mask = mask;

		this.addChild(this.container, track);

		this.maxScrollY = this.height - this.dragHeight;

	};

	p.OnTrackDrag = function(e) {
		this.scrollEnd = (e.currentTarget.y >= this.height - this.trackHeight);
		this.scrollStart = (e.currentTarget.y <= 0);

		e.currentTarget.y = this.trackY + e.stageY - this.stageY;

		if ( e.currentTarget.y < 0 ) {
			e.currentTarget.y = 0;
		} else if ( e.currentTarget.y > this.maxScrollY ) {
			e.currentTarget.y = this.maxScrollY;
		}

		this.OnScrollContent();
	};

	p.OnTrackMouseDown = function(e) {
		this.scrollEnd = (e.currentTarget.y >= this.height - this.trackHeight);
		this.scrollStart = (e.currentTarget.y <= 0);

		this.stageY = e.stageY;
		this.trackY = e.currentTarget.y;
	};

	p.OnScrollContent = function() {
		var contentBounds = this.content.getTransformedBounds();
		var dragBounds = this.drag.getTransformedBounds();
		var containerBounds = this.container.getTransformedBounds();
		var delta = this.percentScroll * (containerBounds.height - contentBounds.height);

		// scrollable vertical - is below > 1
		//console.log(contentBounds.height / containerBounds.height);
		this.percentScroll = parseInt(dragBounds.y) / (containerBounds.height - dragBounds.height);
		if (this.scrollEnd) {
			delta = ~~(containerBounds.height - contentBounds.height);
		}
		createjs.Tween.removeTweens(this.content);
		createjs.Tween.get(this.content).to({y: delta}, 500, createjs.Ease.quadOut)

	};

	p.addContent = function(obj) {

		this.content.addChild(obj);
		//this.content.setBounds(0, 0, this.content.width, bottom - 10);
	};

	p.addPostImage = function(name, imgSource, index) {

		var img = new createjs.Bitmap(imgSource);

		var imgBounds = img.getBounds();

		img.name = 'image';
		img.coverName = name;
		img.type = 'post';

		var container = new createjs.Container();
		container.cursor = 'pointer';

		var bg = new createjs.Shape();
		bg.graphics.beginBitmapFill(loader.queue.getResult('cover_bg'), "repeat").drawRoundRect(0, 0, imgBounds.width, imgBounds.height, 10).endFill()

		container.addChild(bg, img);
		var left = 0;
		if (index % 2 == 0) {
			left = (this.content.width / 2) + 10;
		} else {
			left = 0;
		}
		container.scaleY = container.scaleX = (this.content.width / imgBounds.width) / 2;
		container.setBounds(left, 0, container.scaleY * imgBounds.width, container.scaleY * imgBounds.height);
		var containerBounds = container.getBounds();

		var bottom = 0;
		if (index % 2 == 0) {
			bottom = (index - 2) * containerBounds.height + ((index - 2) * 10);;
		} else {
			bottom = this.content.numChildren * containerBounds.height + (this.content.numChildren * 10);
		}

		container.y = bottom / 2;
		container.x = left;

		var mask = new createjs.Shape();
		mask.graphics.beginFill("#fff").drawRoundRect(0, 0, imgBounds.width, imgBounds.height, 10).endFill()
		mask.cache(0, 0, imgBounds.width, imgBounds.height);

		var hover = new createjs.Container();
		hover.set({width: imgBounds.width, height: imgBounds.height});
		hover.name = "hover";

		var hoverShape = new createjs.Shape();
		hoverShape.name = 'hover-shape';
		hoverShape.graphics.beginFill(createjs.Graphics.getRGB(255, 208, 0, 0.6)).drawRect(0, 0, imgBounds.width, imgBounds.height).endFill();
		hoverShape.cache(0, 0, imgBounds.width, imgBounds.height);

		var hoverThumb = new createjs.Container();
		hoverThumb.name = 'hover-thumb';
		hoverThumb.setBounds(0, 0, 288, 288);

		var hoverImg = new createjs.Bitmap(loader.queue.getResult('post_hover_'+name.replace('post_photo_', '')));
		hoverImg.scaleX = hoverImg.scaleY = 2;
		var hoverImgBounds = hoverThumb.getBounds();
		
		var hoverImgBorder = new createjs.Shape();
		hoverImgBorder.graphics.beginStroke("#fff");
		hoverImgBorder.graphics.setStrokeStyle(4, 'round');
		hoverImgBorder.graphics.drawRoundRect(0, 0, 288, 288, 8);

		var pos = helper.getCenterPosition(hoverThumb.getBounds(), hoverShape.getTransformedBounds());

		hoverThumb.set(helper.setProperties(hoverThumb, helper.extend(pos, {alpha: 0})));
		hoverThumb.addChild(hoverImg, hoverImgBorder);

		var hoverTick = new createjs.Bitmap(loader.queue.getResult('scroller_tick'));
		hoverTick.name = "tick";
		helper.Alignment.horizontalCenter(hoverTick, hover);
		helper.Alignment.verticalCenter(hoverTick, hover);
		hoverTick.alpha = 0;
		hover.addChild(hoverShape, hoverTick);

		container.addChild(hover, hoverThumb);

		var border = new createjs.Shape();
		border.name = "border";
		border.graphics.beginStroke("#fff");
		border.graphics.setStrokeStyle(8, 'round');
		border.graphics.drawRoundRect(4, 4, imgBounds.width - 8, imgBounds.height - 8, 10);
		container.addChild(border);

		hover.visible = false;

		container.filters = [
			new createjs.AlphaMaskFilter(mask.cacheCanvas)
		];
		container.cache(0, 0, imgBounds.width, imgBounds.height);

		this.content.addChild(container);
		this.content.setBounds(0, 0, this.content.width, (imgBounds.height / 2) * (index/2) + (index * 15));

		container.addEventListener('mouseover', helper.getMethod(this, 'OnContentItemMouseOver'));
		container.addEventListener('mouseout', helper.getMethod(this, 'OnContentItemMouseOut'));
		container.addEventListener('click', helper.getMethod(this, 'OnContentItemClick'));

		//container.scaleX = container.scaleY = 0.4;
	};

	p.addImage = function(name, imgSource) {

		var img = new createjs.Bitmap(imgSource);

		var imgBounds = img.getBounds();

		img.name = 'image';
		img.coverName = name;
		img.type = 'cover';

		var container = new createjs.Container();
		container.cursor = 'pointer';

		var bg = new createjs.Shape();
		bg.graphics.beginBitmapFill(loader.queue.getResult('cover_bg'), "repeat").drawRoundRect(0, 0, imgBounds.width, imgBounds.height, 10).endFill()

		container.addChild(bg, img);

		container.scaleY = container.scaleX = this.content.width / imgBounds.width;
		container.setBounds(0, bottom, container.scaleY * imgBounds.width, container.scaleY * imgBounds.height);
		var containerBounds = container.getBounds();

		var bottom = this.content.numChildren * containerBounds.height + (this.content.numChildren * 10);
		container.y = bottom;

		var mask = new createjs.Shape();
		mask.graphics.beginFill("#fff").drawRoundRect(0, 0, imgBounds.width, imgBounds.height, 10).endFill()
		mask.cache(0, 0, imgBounds.width, imgBounds.height);

		var hover = new createjs.Container();
		hover.set({width: imgBounds.width, height: imgBounds.height});
		hover.name = "hover";

		var hoverShape = new createjs.Shape();
		hoverShape.name = 'hover-shape';
		hoverShape.graphics.beginFill(createjs.Graphics.getRGB(255, 208, 0, 0.6)).drawRect(0, 0, imgBounds.width, imgBounds.height).endFill();
		hoverShape.cache(0, 0, imgBounds.width, imgBounds.height);

		var hoverThumb = new createjs.Container();
		hoverThumb.name = 'hover-thumb';
		hoverThumb.setBounds(0, 0, 144, 144);

		var hoverImg = new createjs.Bitmap(loader.queue.getResult('cover_hover_'+name.replace('cover_photo_', '')));
		var hoverImgBounds = hoverThumb.getBounds();
		
		var hoverImgBorder = new createjs.Shape();
		hoverImgBorder.graphics.beginStroke("#fff");
		hoverImgBorder.graphics.setStrokeStyle(4, 'round');
		hoverImgBorder.graphics.drawRoundRect(0, 0, 144, 144, 8);

		var pos = helper.getCenterPosition(hoverThumb.getBounds(), hoverShape.getTransformedBounds());

		hoverThumb.set(helper.setProperties(hoverThumb, helper.extend(pos, {alpha: 0})));
		hoverThumb.addChild(hoverImg, hoverImgBorder);

		var hoverTick = new createjs.Bitmap(loader.queue.getResult('scroller_tick'));
		hoverTick.name = "tick";
		helper.Alignment.horizontalCenter(hoverTick, hover);
		helper.Alignment.verticalCenter(hoverTick, hover);
		hoverTick.alpha = 0;
		hover.addChild(hoverShape, hoverTick);

		container.addChild(hover, hoverThumb);

		var border = new createjs.Shape();
		border.name = "border";
		border.graphics.beginStroke("#fff");
		border.graphics.setStrokeStyle(8, 'round');
		border.graphics.drawRoundRect(4, 4, imgBounds.width - 8, imgBounds.height - 8, 10);
		container.addChild(border);

		hover.visible = false;

		container.filters = [
			new createjs.AlphaMaskFilter(mask.cacheCanvas)
		];
		container.cache(0, 0, imgBounds.width, imgBounds.height);

		this.content.addChild(container);
		this.content.setBounds(0, 0, this.content.width, bottom - 10);

		container.addEventListener('mouseover', helper.getMethod(this, 'OnContentItemMouseOver'));
		container.addEventListener('mouseout', helper.getMethod(this, 'OnContentItemMouseOut'));
		container.addEventListener('click', helper.getMethod(this, 'OnContentItemClick'));
	};

	p.OnContentItemMouseOver = function(e) {
		var container = e.currentTarget, 
			hover = container.getChildByName('hover'), 
			hoverThumb = container.getChildByName('hover-thumb');

		if (this.currentItem && container == this.currentItem) {
			return;
		}
		hover.visible = true;
		hoverThumb.alpha = 1;
		container.updateCache();
	};

	p.OnContentItemMouseOut = function(e) {
		var container = e.currentTarget, 
			hover = container.getChildByName('hover'), 
			hoverThumb = container.getChildByName('hover-thumb');

		if (this.currentItem && container == this.currentItem) {
			return;
		}
		hover.visible = false;
		hoverThumb.alpha = 0;
		container.updateCache();
	};

	p.OnContentItemClick = function(e) {
		createjs.Sound.play('sound_click');

		var container 	= e.currentTarget, 
			hover 		= container.getChildByName('hover'), 
			tick 		= hover.getChildByName('tick'), 
			hoverThumb 	= container.getChildByName('hover-thumb'),
			hoverShape 	= hover.getChildByName('hover-shape'),
			image 		= container.getChildByName('image'); 

		if (this.currentItem) {
			this.currentItem.getChildByName('hover').visible = false;
			this.currentItem.getChildByName('hover').getChildByName('tick').alpha = 0;
			this.currentItem.updateCache();
		}
		this.currentItem = container;
		createjs.Tween.get(hoverThumb).to({alpha: 0}, 200, function() {
			container.updateCache();
		},
		createjs.Ease.backOut);
		tick.alpha = 1;
		/*
		createjs.Tween.get(tick).to({alpha: 1}, 200, function() {
			container.updateCache();
		},
		createjs.Ease.backIn);
		*/
		hover.visible = true;
		var e = new CustomEvent('onitemclicked',
			{
				detail:{
					current: container,
					name: image.coverName
				},
				bubbles: true,
				cancelable: true
			}
		);
		window.dispatchEvent(e);
	};

	p.getCurrentItem = function() {
		return this.currentItem;
	};

	CoverMaker.Scroller = Scroller;

})();
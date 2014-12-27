this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	CoverMaker.config = {
		appURL: 'http://covertest.herokuapp.com/'
	};
	CoverMaker.session = {
		photoType: null
	};
	CoverMaker.canvas = document.getElementById('app');
	CoverMaker.ctx = CoverMaker.canvas.getContext('2d');
	//CoverMaker.ctx.globalCompositeOperation = 'lighter';
	CoverMaker.stage = new createjs.Stage(CoverMaker.canvas);
	CoverMaker.stage.enableMouseOver();

	CoverMaker.Preload.queue.addEventListener("complete", complete);

	var stats;

	var context = CoverMaker.stage.canvas.getContext("2d");
	context.webkitImageSmoothingEnabled = context.mozImageSmoothingEnabled = true;

	createjs.Ticker.setFPS(24);
	createjs.Ticker.setInterval(50);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.addEventListener( "tick", CoverMaker.stage );

	function complete() {
		stats = new Stats();
		stats.setMode(0);

		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );
		createjs.Ticker.addEventListener('tick', onTick); 

		var bgMusic = createjs.Sound.play('sound_bg', {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
		bgMusic.volume = 0.4;
	}

	function onTick(){
		stats.begin();
		CoverMaker.stage.update();
		stats.update();
	}

	CoverMaker.Helper = {
		Alignment: {
			horizontalCenter: function(obj, ref) {
				if (obj.length > 0) {
					for(var i = 0; i < obj.length; i++) {
						this.horizontalCenter(obj[i], ref);
					}
					return;
				}
				var bounds = obj.getBounds() ?  obj.getBounds() : obj.getTransformedBounds();
				obj.x = (ref.width / 2) - (bounds.width / 2) + obj.regX;
			},
			verticalCenter: function(obj, ref) {
				if (obj.length > 0) {
					for(var i = 0; i < obj.length; i++) {
						this.verticalCenter(obj[i], ref);
					}
					return;
				}
				var bounds = obj.getBounds() ?  obj.getBounds() : obj.getTransformedBounds();
				obj.y = (ref.height / 2) - (bounds.height / 2) + obj.regY;
			},
			bottomWithRef: function(obj, ref) {
				if (obj.length > 0) {
					for(var i = 0; i < obj.length; i++) {
						this.verticalCenter(obj[i], ref);
					}
					return;
				}
				var bounds = obj.getBounds() ?  obj.getBounds() : obj.getTransformedBounds();
				obj.y = ref.height - bounds.height;
			},
			distributeHorizontalCenter: function(objArr, ref, spacing) {
				var objectsWidth = CoverMaker.Helper.getSumObjectsWidth(objArr);
				var usableWidth = Math.abs(ref.width - objectsWidth) / objArr.length;
				var left = 0;

				_.forEach(objArr, function(obj, i) {
					if (i > 0) {
						var bounds = objArr[(i-1)].getTransformedBounds();
						obj.x = bounds.x + bounds.width + usableWidth;
						if (spacing) {
							obj.x -= (usableWidth - spacing);
						}
					} else {
						obj.x = (usableWidth / objArr.length);
						if (spacing) {
							obj.x += (usableWidth - spacing);
						}
					}
				});
			}
		},
		getBottomPosition: function(obj) {
			var bounds = obj.getTransformedBounds();
			return bounds.height + bounds.y;
		},
		getLeftPosition: function(obj) {
			var bounds = obj.getTransformedBounds();
			return bounds.x;
		},
		getRightPosition: function(obj) {
			var bounds = obj.getTransformedBounds();
			return bounds.width + bounds.x;
		},
		getSumObjectsWidth: function(objArr) {
			var bounds, total = 0;
			_.forEach(objArr, function(obj) {
				bounds = obj.getBounds();
				total += bounds.width; 
			});
			return total;
		},
		getCenterPosition: function(bounds1, bounds2) {
			return { 
				x: (bounds2.width - bounds1.width) / 2,
				y: (bounds2.height - bounds1.height) / 2
			}

		},
		getMethod: function(obj, method) {
			return function () { obj[method].apply(obj, arguments);};
		},
		setProperties: function(object, props) {
			for(var i in props) {
				object[i] = props[i];
			}
		},
		extend: function(obj1, obj2) {
			return _.extend(obj1, obj2);
		},
		forEach: _.forEach
	};

})();
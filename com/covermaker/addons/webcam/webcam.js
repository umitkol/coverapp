this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var stage			= CoverMaker.stage,
		canvas			= CoverMaker.canvas,
		helper 			= CoverMaker.Helper,
		loader			= CoverMaker.Preload,
		vendorURL = window.URL || window.webkitURL,
		instance;

	var Webcam = function(props) {
		var options = {

		};
		helper.setProperties(this, helper.extend(options, props));

		this.isCanWork = false;
		this.onhandledvideo = new createjs.Event("onhandledvideo");
		this.onerrorvideo = new createjs.Event("onerrorvideo");
		this.initialize();
	};

	var p = Webcam.prototype = new createjs.Container();
	p.DisplayObject_initialize = p.initialize;

	p.initialize = function() {
		this.DisplayObject_initialize();
		this.setBounds(0, 0, this.width, this.height);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

		if (navigator.getUserMedia) {
			this.isCanWork = true;
		} else {
			this.isCanWork = false;
			console.log("The browser you are using doesn\'t support getUserMedia");
			return;
		}

	};

	p.OnHandleVideo = function(stream) {
		this.isCanWork = true;
		this.stream = stream;

		this.dispatchEvent('onhandledvideo');
	};

	p.OnErrorVideo = function(error) {
		this.isCanWork = false;
		console.log('Something went wrong. (error name: '+error.name + ', error message: ' + error.message + ')');
		this.dispatchEvent('onerrorvideo');
		return;
	};

	p.getStream = function() {
		if (!this.stream) {
			console.error('Stream not found!');
		}
		return this.stream;
	};

	p.open = function() {
		navigator.getUserMedia({video: true, audio: false}, helper.getMethod(this, 'OnHandleVideo'), helper.getMethod(this, 'OnErrorVideo'));
	};

	p.close = function() {
		if (!this.stream) {
			return;
		}
		this.stream.stop();
	};	

	p.getObjectURL = function() {
		if (!this.isCanWork) {
			console.error('Something went wrong!');
		}
		return vendorURL.createObjectURL(this.getStream());
	};

	p.toString = function() {
		return "[Addon.Webcam]";
	};

	Webcam.getInstance = function () {
		if (!instance) {
			instance = new Webcam();
		}
		return instance;
	};

	CoverMaker.Webcam = Webcam;

})();
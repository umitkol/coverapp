this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var history		= [],
		instance;

	var Navigation = function() {

	};

	Navigation.prototype.push = function(obj, refKlass) {
		var klass = obj.getInstance();

		if (!Navigation.hasClass(klass)) {
			history.push(klass);
		}
 		var prevKlass = Navigation.getPrevClassWithOtherClass(klass);
		if (refKlass) {
			prevKlass = refKlass.getInstance();
		}
 		console.log("klass ===> " + klass);
 		console.log("prevKlass ===> " + prevKlass);
 		if (prevKlass) {
 			prevKlass.OnLeave();
 		}
		klass.OnEnter();
		this.currentKlass = klass;
	};

	Navigation.prototype.next = function(obj) {
		
	};

	Navigation.prototype.prev = function() {
		if (this.currentKlass) {
			this.currentKlass.OnLeave();
			var prevKlass = Navigation.getPrevClassWithOtherClass(this.currentKlass);
			if (prevKlass) {
				this.currentKlass = prevKlass;
				prevKlass.OnEnter();
			}
		}
	};

	Navigation.prototype.go = function(obj, params) {
		this.push(obj, params);
	};

	Navigation.prototype.getCurrentKlass = function() {
		return this.currentKlass;
	};

	Navigation.getInstance = function () {
		if (!instance) {
			instance = new Navigation();
		}
		return instance;
	};

	Navigation.getPrevClassWithOtherClass = function(klass) {
		return history[Navigation.getIndexClass(klass) - 1];
	};

	Navigation.getNextClassWithOtherClass = function(klass) {
		return history[Navigation.getIndexClass(klass) + 1];
	};

	Navigation.hasClass = function(klass) {
		return Navigation.getIndexClass(klass) > -1;
	};

	Navigation.replace = function(oldKlass, newKlass) {
		return history[Navigation.getIndexClass(oldKlass)] = newKlass.getInstance();
	};

	Navigation.getIndexClass = function(klass) {
		return history.indexOf(klass);
	};

	CoverMaker.Navigation = Navigation;

})();
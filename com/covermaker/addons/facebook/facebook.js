this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	var instance,
		pageId		= 193491900675284,
		config		= CoverMaker.config;

	window.fbAsyncInit = complete;

	function complete() {
		Facebook.getInstance();
	};

	var Facebook = function() {
		this.initialize();
	};

	var p = Facebook.prototype;

	p.initialize = function() {
		var that = this;

		FB.init({
			appId      	: '300615676799106',
			version    	: 'v2.2',
            status		: true,
            cookie		: true,
            xfbml		: true
		});
		FB.Canvas.setSize({ width: 850, height: 1000 });
		this.isUserLikedPage = false;
		this.getLoginStatus();

		FB.Event.subscribe('edge.create', createjs.proxy(this.subscribeCreate, this));
		FB.Event.subscribe('edge.remove', createjs.proxy(this.subscribeRemove, this));
	};

	Facebook.prototype.uploadPhoto = function(imgURL) {

		var access_token = FB.getAuthResponse()['accessToken'];

		FB.api('/me/photos', 'post', {
		    message: 'Cover fotomu XXX kullanarak değiştirdim. Sen de dene!',
		    url: imgURL,
		    access_token: access_token    
		},
		function(response){
		    if (!response || response.error) {
		    	console.error(response.error);
		    } else {
		        console.log('Post ID: ' + response.id);
		    }

		});
	};

	Facebook.shareCover = function(imgURL) {
		var access_token = FB.getAuthResponse()['accessToken'];

		FB.ui({
			method: 'feed',
			link: 'https://www.facebook.com/nexumcreative/app_300615676799106',
			picture: 'http://covertest.herokuapp.com/'+imgURL
		}, function(response){
			if (!response || response.error) {
		    	console.error(response.error);
		    } else {
		        var e = new CustomEvent('onfacebooksharesuccess',
				{
						detail:{
							response: response
						},
						bubbles: true,
						cancelable: true
					}
				);
				window.dispatchEvent(e);
		    }
		});

		/*
		FB.api('/me/photos', 'POST', {
		    message: 'Cover fotomu XXX kullanarak değiştirdim. Sen de dene!',
		    url: 'http://covertest.herokuapp.com/'+imgURL,
		    access_token: access_token 
		},
		function(response){
		    if (!response || response.error) {
		    	console.error(response.error);
		    } else {
		        var e = new CustomEvent('onfacebooksharesuccess',
				{
						detail:{
							response: response
						},
						bubbles: true,
						cancelable: true
					}
				);
				window.dispatchEvent(e);
		    }

		});

		*/
	};

	Facebook.sharePost = function(imgURL) {
		var access_token = FB.getAuthResponse()['accessToken'];

		FB.api('/me/photos', 'POST', {
		    message: 'Kafamı XXX ile çektim. Sen de dene!',
		    url: 'http://covertest.herokuapp.com/'+imgURL,
		    access_token: access_token 
		},
		function(response){
		    if (!response || response.error) {
		    	console.error(response.error);
		    } else {
		        var e = new CustomEvent('onfacebooksharesuccess',
				{
						detail:{
							response: response
						},
						bubbles: true,
						cancelable: true
					}
				);
				window.dispatchEvent(e);
		    }

		});
	};

	Facebook.prototype.getLoginStatus = function() {
		var that = this;
		FB.getLoginStatus(
			function (response) {
				if (response.authResponse) {
					that.isUserLikesPage();
					that.loginSuccess(response);
				} else {
					that.login();
				}
			}
		);
	};

	Facebook.prototype.login = function() {
		var that = this;
		FB.login(
			function(response){
				if (response.authResponse) {
					that.isUserLikesPage();
					that.loginSuccess(response);
				} else {
					console.error("Uygulama yetki verilmedi");
				}
			},
			{
				scope: 'email, publish_actions',
				return_scopes: true
			}
		);
	};

	Facebook.prototype.loginSuccess = function(response) {
		this.userID = response.authResponse.userID;
		var e = new CustomEvent('onfacebookloginsuccess',
			{
				detail:{
					userID: response.authResponse.userID
				},
				bubbles: true,
				cancelable: true
			}
		);
		window.dispatchEvent(e);
	};

	Facebook.prototype.getUserID = function() {
		return this.userID ? this.userID : '';
	};

	Facebook.prototype.subscribeCreate = function(url, html_element) {
		this.isUserLikedPage = true;
	};

	Facebook.prototype.subscribeRemove = function(url, html_element) {
		this.isUserLikedPage = false;
	};

	Facebook.prototype.isUserLikesPage = function() {
		var that = this;
		FB.api("me/likes/"+pageId, function(response) {
		    if ( response.data.length === 1 ) {
		        that.isUserLikedPage = true;
		    } else {
		        that.isUserLikedPage = false;
		    }
		});
	};

	Facebook.getInstance = function () {
		if (!instance) {
			instance = new Facebook();
		}
		return instance;
	};

	CoverMaker.Facebook = Facebook;

})();
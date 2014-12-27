window.fbAsyncInit = function() {
	var that = window;
	FB.init({
		appId      : '300615676799106',
		xfbml      : true,
		version    : 'v2.2'
	});
	FB.login(
		function(response){
			FB.api(
				'/me',
				function(response) {
					var e = new CustomEvent('onfacebookloginsuccess',
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
			);
		},
		{
			scope: 'email, user_likes',
			return_scopes: true
		}
	);
};
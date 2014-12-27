this.CoverMaker = this.CoverMaker || {};

(function() {
	"use strict";

	CoverMaker.Preload = {
		queue : new createjs.LoadQueue(false)
	};

	CoverMaker.Preload.queue.installPlugin(createjs.Sound);
	createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
	createjs.Sound.alternateExtensions = ["mp3"];

	CoverMaker.Preload.queue.loadManifest([
	    { id: "background", src: "com/covermaker/images/background.jpg" },
	    { id: "nexumLogo", src: "com/covermaker/images/nexumlogo.jpg" },
	    { id: "logo", src: "com/covermaker/images/logo.png" },

	    { id: "sound_back", src: "com/covermaker/sounds/back.mp3" },
	    { id: "sound_click", src: "com/covermaker/sounds/click.mp3" },
	    { id: "sound_tada", src: "com/covermaker/sounds/tada.mp3" },
	    { id: "sound_capture-photo", src: "com/covermaker/sounds/capture-photo.mp3" },
	    { id: "sound_bg", src: "com/covermaker/sounds/bg.mp3" },

	    { id: "progress_bar", src: "com/covermaker/scenes/progress/bar.png" },
	    { id: "progress_bar-container", src: "com/covermaker/scenes/progress/bar-container.png" },

	    { id: "intro_text", src: "com/covermaker/scenes/intro/text.png" },
	    { id: "intro_startButton", src: "com/covermaker/scenes/intro/startButton.png" },
	    { id: "intro_man1", src: "com/covermaker/scenes/intro/man1.png" },
	    { id: "intro_man2", src: "com/covermaker/scenes/intro/man2.png" },
	    { id: "intro_woman1", src: "com/covermaker/scenes/intro/woman1.png" },
	    { id: "intro_woman2", src: "com/covermaker/scenes/intro/woman2.png" },
	    { id: "intro_mug", src: "com/covermaker/scenes/intro/mug.png" },
	    { id: "intro_camera", src: "com/covermaker/scenes/intro/camera.png" },
	    { id: "intro_baloon", src: "com/covermaker/scenes/intro/baloon.png" },
	    { id: "intro_mug-big", src: "com/covermaker/scenes/intro/mug-big.png" },
	    { id: "intro_mug-small", src: "com/covermaker/scenes/intro/mug-small.png" },
	    { id: "intro_mug-text1", src: "com/covermaker/scenes/intro/mug-text1.png" },
	    { id: "intro_mug-text2", src: "com/covermaker/scenes/intro/mug-text2.png" },

	    { id: "choice_makeCoverBtn", src: "com/covermaker/scenes/choice/makeCoverBtn.png" },
	    { id: "choice_makePostBtn", src: "com/covermaker/scenes/choice/makePostBtn.png" },

	    { id: "cover_title", src: "com/covermaker/scenes/cover/title.png" },
	    { id: "cover_bg", src: "com/covermaker/scenes/cover/repeat.jpg" },

	    { id: "post_title", src: "com/covermaker/scenes/post/title.png" },

	    { id: "studio_text", src: "com/covermaker/scenes/studio/text.png" },
	    { id: "studio_capturePhotoButton", src: "com/covermaker/scenes/studio/capturePhotoButton.png" },
	    { id: "studio_continueButton", src: "com/covermaker/scenes/studio/continueButton.png" },
	    { id: "studio_cameraBackground", src: "com/covermaker/scenes/studio/cameraBackground.png" },
	    { id: "studio_shade", src: "com/covermaker/scenes/studio/shade.png" },
	    { id: "studio_shade-plus", src: "com/covermaker/scenes/studio/shade-plus.png" },

	    { id: "cover_ready_title", src: "com/covermaker/scenes/cover-ready/title.png" },

	    { id: "congratulations_title", src: "com/covermaker/scenes/congratulations/title.png" },
	    { id: "congratulations_text", src: "com/covermaker/scenes/congratulations/text.png" },
	    { id: "congratulations_input-bg", src: "com/covermaker/scenes/congratulations/input-bg.png" },

	    { id: "tab_kullanim-kosullari", src: "com/covermaker/scenes/tabs/kullanim-kosullari.png" },
	    { id: "tab_nasil-oynarim", src: "com/covermaker/scenes/tabs/nasil-oynarim.png" },
	    { id: "tab_nedir", src: "com/covermaker/scenes/tabs/nedir.png" },
	    { id: "tab_1", src: "com/covermaker/scenes/tabs/tab_1.png" },
	    { id: "tab_1_title", src: "com/covermaker/scenes/tabs/tab_1_title.png" },
	    { id: "tab_2", src: "com/covermaker/scenes/tabs/tab_2.png" },
	    { id: "tab_2_title", src: "com/covermaker/scenes/tabs/tab_2_title.png" },

	    { id: "scroller_drag", src: "com/covermaker/addons/scroller/images/drag.png" },
	    { id: "scroller_tick", src: "com/covermaker/addons/scroller/images/tick.png" },

	    { id: "btn_back", src: "com/covermaker/images/buttons/back.png" },
	    { id: "btn_continue", src: "com/covermaker/images/buttons/continue.png" },
	    { id: "btn_cancel", src: "com/covermaker/images/buttons/cancel.png" },
	    { id: "btn_save", src: "com/covermaker/images/buttons/save.png" },
	    { id: "btn_share", src: "com/covermaker/images/buttons/share.png" },
	    { id: "btn_again", src: "com/covermaker/images/buttons/again.png" },
	    { id: "btn_send", src: "com/covermaker/images/buttons/send.png" },
	    { id: "btn_check", src: "com/covermaker/images/buttons/check.png" },
	    { id: "btn_delete", src: "com/covermaker/images/buttons/delete.png" },
	    { id: "btn_delete-icon", src: "com/covermaker/images/buttons/delete-icon.png" },

	    { id: "cover_photo_1", src: "com/covermaker/images/covers/1.png" },
	    { id: "cover_photo_2", src: "com/covermaker/images/covers/2.png" },
	    { id: "cover_photo_3", src: "com/covermaker/images/covers/3.png" },
	    { id: "cover_photo_4", src: "com/covermaker/images/covers/4.png" },
	    { id: "cover_photo_5", src: "com/covermaker/images/covers/5.png" },
	    { id: "cover_photo_6", src: "com/covermaker/images/covers/6.png" },
	    { id: "cover_photo_7", src: "com/covermaker/images/covers/7.png" },
	    { id: "cover_photo_8", src: "com/covermaker/images/covers/8.png" },
	    { id: "cover_photo_9", src: "com/covermaker/images/covers/9.png" },
	    { id: "cover_photo_10", src: "com/covermaker/images/covers/10.png" },
	    { id: "cover_photo_11", src: "com/covermaker/images/covers/11.png" },
	    { id: "cover_photo_12", src: "com/covermaker/images/covers/12.png" },
	    { id: "cover_photo_13", src: "com/covermaker/images/covers/13.png" },
	    { id: "cover_photo_14", src: "com/covermaker/images/covers/14.png" },

	    { id: "cover_hover_1", src: "com/covermaker/images/covers/hover/1.jpg" },
	    { id: "cover_hover_2", src: "com/covermaker/images/covers/hover/2.jpg" },
	    { id: "cover_hover_3", src: "com/covermaker/images/covers/hover/3.jpg" },
	    { id: "cover_hover_4", src: "com/covermaker/images/covers/hover/4.jpg" },
	    { id: "cover_hover_5", src: "com/covermaker/images/covers/hover/5.jpg" },
	    { id: "cover_hover_6", src: "com/covermaker/images/covers/hover/6.jpg" },
	    { id: "cover_hover_7", src: "com/covermaker/images/covers/hover/7.jpg" },
	    { id: "cover_hover_8", src: "com/covermaker/images/covers/hover/8.jpg" },
	    { id: "cover_hover_9", src: "com/covermaker/images/covers/hover/9.jpg" },
	    { id: "cover_hover_10", src: "com/covermaker/images/covers/hover/10.jpg" },
	    { id: "cover_hover_11", src: "com/covermaker/images/covers/hover/11.jpg" },
	    { id: "cover_hover_12", src: "com/covermaker/images/covers/hover/12.jpg" },
	    { id: "cover_hover_13", src: "com/covermaker/images/covers/hover/13.jpg" },
	    { id: "cover_hover_14", src: "com/covermaker/images/covers/hover/14.jpg" },

	    { id: "post_photo_1", src: "com/covermaker/images/posts/1.png" },
	    { id: "post_photo_2", src: "com/covermaker/images/posts/2.png" },
	    { id: "post_photo_3", src: "com/covermaker/images/posts/3.png" },
	    { id: "post_photo_4", src: "com/covermaker/images/posts/4.png" },
	    { id: "post_photo_5", src: "com/covermaker/images/posts/5.png" },
	    { id: "post_photo_6", src: "com/covermaker/images/posts/6.png" },
	    { id: "post_photo_7", src: "com/covermaker/images/posts/7.png" },
	    { id: "post_photo_8", src: "com/covermaker/images/posts/8.png" },

	    { id: "post_hover_1", src: "com/covermaker/images/posts/hover/1.jpg" },
	    { id: "post_hover_2", src: "com/covermaker/images/posts/hover/2.jpg" },
	    { id: "post_hover_3", src: "com/covermaker/images/posts/hover/3.jpg" },
	    { id: "post_hover_4", src: "com/covermaker/images/posts/hover/4.jpg" },
	    { id: "post_hover_5", src: "com/covermaker/images/posts/hover/5.jpg" },
	    { id: "post_hover_6", src: "com/covermaker/images/posts/hover/6.jpg" },
	    { id: "post_hover_7", src: "com/covermaker/images/posts/hover/7.jpg" },
	    { id: "post_hover_8", src: "com/covermaker/images/posts/hover/8.jpg" },

	]);

	CoverMaker.Preload.queue.addEventListener("complete", complete);
	CoverMaker.Preload.queue.addEventListener("progress", progress);

	function progress() {

	}

	function complete(e) {

	}

})();
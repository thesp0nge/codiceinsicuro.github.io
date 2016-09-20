(function ($) {
    "use strict";

	var imageSrc = "",
		thisimage = "";

	function setImageSize(imageSrc) {
		var newImg = new Image();

		newImg.onload = function() {
			if((jQuery(window).height()-150) >= newImg.height && jQuery(window).width() >= (newImg.width-150)){
				var height = newImg.height;
				var width = newImg.width;
			}else{
				if(jQuery(window).width() <= jQuery(window).height()){
					if(newImg.width <= newImg.height){
						var width = newImg.width / newImg.height * (jQuery(window).height()-150);
						var height = newImg.height / newImg.width * width;
					}else{
						var height = newImg.height / newImg.width * (jQuery(window).width()-150);
						var width = newImg.width / newImg.height * height;
					}
				}else{
					var width = newImg.width / newImg.height * (jQuery(window).height()-150);
					var height = newImg.height / newImg.width * width;
				}
			}

			var winposition = jQuery(window).scrollTop();

			jQuery("#lightbox-box > div > img").attr("src", "images/px.gif");

			jQuery("#lightbox-box > div").css("height",height+"px").css("width",width+"px").css("top",((jQuery(window).height()/2)-(height/2)+winposition)+"px").css("left",((jQuery(window).width()/2)-(width/2))+"px");
			jQuery("#lightbox-box").addClass("blackout");
			thetop = parseInt((jQuery(window).height()/2)-(height/2), 10);
			setTimeout(function (){
				jQuery("#lightbox-box > a").fadeIn("slow");
				jQuery("#lightbox-box > div > span").fadeIn("slow");
				jQuery("#lightbox-box > div > font").fadeIn("slow");
				jQuery("#lightbox-box > div > img").attr("src", imageSrc);
				thisimage = imageSrc;
			}, 500);
		}

		jQuery(".lightbox-bg").on("click", function (){
			jQuery(this).parent().remove();
		}).children().on("click", function(e) {
			return false;
		});

		jQuery("#lightbox-box > a").on("click", function (){
			jQuery(this).parent().remove();
			return false;
		});

		jQuery("#lightbox-left").on("click", function (){
			jQuery("#lightbox-box").removeClass("blackout");
			var photoCount = jQuery(".lightbox-photo").length;
			for(n=0;n<photoCount;n++){
				if(jQuery(".lightbox-photo").eq(n).attr("href") == thisimage){

					if(n-1 <= 0){
						var theone = photoCount-1;
					}else{
						var theone = n-1;
					}
				}
			}
			jQuery("#lightbox-box > div > span").remove();
			if(jQuery(".lightbox-photo").eq(theone).attr("title")){
				jQuery("#lightbox-box > div > img").before("<span>"+jQuery(".lightbox-photo").eq(theone).attr("title")+"</span>");
			}
			takeNextPhoto(theone);
			return false;
		});

		jQuery("#lightbox-right").on("click", function (){
			jQuery("#lightbox-box").removeClass("blackout");
			var photoCount = jQuery(".lightbox-photo").length;
			for(n=0;n<photoCount;n++){
				if(jQuery(".lightbox-photo").eq(n).attr("href") == thisimage){
					if(n+1 >= photoCount){
						var theone = 0;
					}else{
						var theone = parseInt(n, 10)+1;
					}
				}
			}
			jQuery("#lightbox-box > div > span").remove();
			if(jQuery(".lightbox-photo").eq(theone).attr("title")){
				jQuery("#lightbox-box > div > img").before("<span>"+jQuery(".lightbox-photo").eq(theone).attr("title")+"</span>");
			}
			takeNextPhoto(theone);
			return false;
		});

		newImg.src = imageSrc;
	}


	jQuery(document).on("ready", function() {
		var photoCount = jQuery(".lightbox-photo").length;

		jQuery(".lightbox-photo").on("click", function (){
			imageSrc = jQuery(this).attr("href");
			var offset = jQuery(this).offset();

			jQuery("body").before("<div id='lightbox-box'><a href='#'>Close</a><div style='top:"+(offset.top)+"px;left:"+(offset.left)+"px;width:"+(jQuery(this).find("img").width())+"px;height:"+(jQuery(this).find("img").height())+"px;'><img src='images/px.gif' alt='' title='' /></div><span class='lightbox-bg'></span></div>");
			if(jQuery(this).attr("title")){
				jQuery("#lightbox-box > div > img").before("<span>"+jQuery(this).attr("title")+"</span>");
			}
			if(photoCount > 1){
				jQuery("#lightbox-box > div > img").before("<font><a href='#' id='lightbox-left'><-</a><a href='#' id='lightbox-right'>-></a></font>");
			}
			setTimeout(function(){new setImageSize(imageSrc);}, 500);
			return false;
		});
	});

	function takeNextPhoto(photo){
		imageSrc = jQuery(".lightbox-photo").eq(photo).attr("href");
		setTimeout(function(){new setImageSize(imageSrc);}, 500);
	}

	var thetop = 0;

	jQuery(document).on("scroll", function() {
		if(jQuery("#lightbox-box > div")){
			var winposition = parseInt(jQuery(window).scrollTop(), 10);

			jQuery("#lightbox-box > div").css("top",(parseInt(winposition+thetop, 10))+"px");
		}
	});

})(jQuery);

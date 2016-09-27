(function ($) {
	"use strict";

	var breakingStart = true; // autostart breaking news
	var breakingSpeed = 40; // breaking msg speed

	var breakingScroll = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var breakingOffset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var elementsToClone = [true, true, true, true, true, true, true, true, true, true];
	var elementsActive = [];
	var theCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	Array.prototype.forEach2=function(a){ var l=this.length; for(var i=0;i<l;i++)a(this[i],i) };

	function lightboxclose() {
		var lightblock = jQuery(".lightbox", "body");
		lightblock.css('overflow', 'hidden');
		jQuery(".lightcontent", ".lightbox").fadeOut('fast');
		lightblock.fadeOut('slow');
		jQuery("body").css('overflow', 'auto');
	}

	function start() {
	    var z = 0;
	    jQuery(".br-article-list-inner", ".br-article-list").each(function () {
		var thisitem = jQuery(this), thisindex = z;
		z = z + 1;
		if (thisitem.find(".br-article").size() > 0) {

		    if (!breakingStart) { return false; }
		    var theBreakingMargin = parseInt(thisitem.find(".br-article").css("margin-right"), 10),
			theBreakingWidth = parseInt(thisitem.parent().css("width"), 10),

					itemul = thisitem,
			itemtemp = 0,
			items = itemul.find(".br-article").each(function(){
				itemtemp = itemtemp+parseInt(jQuery(this).width(), 10) + parseInt(jQuery(this).css("padding-right"), 10) + parseInt(jQuery(this).css("margin-right"), 10);
			});

		    theCount[thisindex] = (itemtemp / 2);

		    if (elementsToClone[thisindex]) {
			jQuery(this).parent().parent().parent().addClass("isscrolling");
			jQuery('.br-article-list-inner').eq(thisindex).parent().parent().parent().attr("rel", thisindex);
			thisitem.find(".br-article").clone().appendTo(this);

			elementsToClone[thisindex] = false;
		    }
		    var theNumber = theCount[thisindex] + breakingOffset[thisindex];

		    if (Math.abs(theNumber) <= (Math.abs(breakingScroll[thisindex]))) {
			cloneBreakingLine(thisindex);
		    }

		    if (!elementsActive[thisindex]) {
			elementsActive[thisindex] = setInterval(function () {
			    beginScrolling(thisitem, thisindex);
			}, breakingSpeed);
		    }
		}
	    });

	    setTimeout(function(){new start();}, breakingSpeed);
	}

    new start();

	function beginScrolling(thisitem, thisindex) {
	    breakingScroll[thisindex] = breakingScroll[thisindex] - 1;
	    thisitem.css("left", breakingScroll[thisindex] + 'px');
	}

	function cloneBreakingLine(thisindex) {
	    breakingScroll[thisindex] = 0;
	    jQuery('.br-article-list').eq(thisindex).find('.br-article-list-inner').css("left", "0px");
	}

	function scrollNimate(_element) {

		var datanime = _element.data("animation"),
			uptimeout = 0;

		_element.children("div, a, blockquote").toArray().forEach2(function (a) {
			var coolem = jQuery(a);
			coolem.css("visibility", "hidden");
			setTimeout(function () {
				coolem.css("visibility", "visible").addClass("animated "+datanime);
			}, uptimeout);
			uptimeout = uptimeout+200;
		});
		_element.removeClass("ot-scrollnimate");
		return false;

	}

	jQuery(document).on("ready", function() {

		jQuery("[data-ot-css]", "body").toArray().forEach2(function(a){
			var thisel = jQuery(a);
			thisel.attr("style", thisel.data("ot-css"));
		});

		// Sets retina images @2x
		var retina = window.devicePixelRatio > 1;
		if(retina) {
			jQuery(".retina-check", "body").toArray().forEach2(function(a){
				jQuery(a).addClass("go-retina");
			});
			var n = 0;
			jQuery("img[data-ot-retina]", "body").toArray().forEach2(function(a){
				var thisel = jQuery(a);
				var theImage = new Image();
				if(thisel.data("ot-retina") == "") return false;
				theImage.src = thisel.attr("src");
				jQuery(theImage).load(function(){
					var thisnew = jQuery(this);
					thisel.attr("src", generatePlaceholder(thisnew[0].width,thisnew[0].height));
					thisel.css({
						"background-image": "url('"+thisel.data("ot-retina")+"')",
						"background-size": "100% 100%",
						"background-repeat": "none"
					});
				});
			});
		}


		jQuery("input[type=text]", ".search-nav").on("focus blur", function(){
			var thisel = jQuery(this);
			if(thisel.val() != ""){
				thisel.addClass("active");
			}else{
				thisel.removeClass("active");
			}
		});

		// Tabs shortcode
		jQuery(".short-tabs", "body").toArray().forEach2(function(a){
			var thisel = jQuery(a);
			thisel.children("ul").children("li").eq(0).addClass("active");
			thisel.children("div").eq(0).addClass("active");
		})

		jQuery(".short-tabs > ul > li a", "body").on("click", function () {
			var thisel = jQuery(this).parent();
			thisel.siblings(".active").removeClass("active");
			thisel.addClass("active");
			thisel.parent().siblings("div.active").removeClass("active");
			thisel.parent().siblings("div").eq(thisel.index()).addClass("active");
			return false;
		});

		// Accordion blocks
		jQuery(".accordion > div > a", "body").on("click", function() {
			var thisel = jQuery(this).parent();
			if (thisel.hasClass("active")) {
				thisel.removeClass("active").children("div").animate({
					"height": "toggle",
					"opacity": "toggle",
					"padding-top": "toggle"
				}, 300);
				return false;
			}
			// thisel.siblings("div").removeClass("active");
			thisel.siblings("div").toArray().forEach2(function(key) {
				var tz = jQuery(key);
				if (tz.hasClass("active")) {
					tz.removeClass("active").children("div").animate({
						"height": "toggle",
						"opacity": "toggle",
						"padding-top": "toggle"
					}, 300);
				}
			});
			// thisel.addClass("active");
			thisel.addClass("active").children("div").animate({
				"height": "toggle",
				"opacity": "toggle",
				"padding-top": "toggle"
			}, 300);
			return false;
		});


		// Photo Gallery thumbs navigation
		jQuery("button", ".photo-gallery-thumbs").on("click", function(){
			var thisel = jQuery(this),
				marginHandler = thisel.siblings(".photo-gallery-thumbs-inner").children(".item").eq(0),
				current = thisel.siblings(".photo-gallery-thumbs-inner").data("thumbs-start-from");

			if(thisel.hasClass("photo-gallery-nav-left")){
				if(current+216 >= 0){
					current = 0;
					thisel.siblings(".photo-gallery-thumbs-inner").removeClass("not-first").removeClass("is-last");
				}else{
					current = current+216;
					thisel.siblings(".photo-gallery-thumbs-inner").removeClass("is-last");
				}
			}else
			if(thisel.hasClass("photo-gallery-nav-right")){
				var maxsize = (thisel.siblings(".photo-gallery-thumbs-inner").children(".item").size()*(78+8))-parseInt(jQuery(".photo-gallery-thumbs-inner", ".photo-gallery-thumbs").width(), 10);

				if(current-216 <= (-1)*maxsize){
					if(maxsize > 0){
						current = (-1)*maxsize;
						thisel.siblings(".photo-gallery-thumbs-inner").addClass("is-last");
					}
				}else {
					current = current-216;
					thisel.siblings(".photo-gallery-thumbs-inner").addClass("not-first").removeClass("is-last");
				}
			}

			marginHandler.css("margin-left", current+"px");
			thisel.siblings(".photo-gallery-thumbs-inner").data("thumbs-start-from", current);
			return false;
		});

		jQuery(".lightbox", "body").on("click", function () {
			var thisel = jQuery(this);
			thisel.css('overflow', 'hidden');
			jQuery("body").css('overflow', 'auto');
			thisel.find(".lightcontent").fadeOut('fast');
			thisel.fadeOut('slow');
		}).children().on("click", function (e) {
			return false;
		});


		jQuery(".lightbox .light-close", "body").on("click", function(){
			jQuery(".lightbox").click();
			return false;
		});

	});

	var menuisfollowing = false;

	jQuery(window).on("scroll", function(){

		// Refreshes fixed main menu position
		var wr = jQuery(".ot-menu-will-follow .main-menu-placeholder").parent(),
			wrfollow = jQuery(".ot-menu-will-follow .is-now-following");

		if(wr.size() > 0 && jQuery(window).scrollTop() >= parseInt(wr.offset().top, 10)+280){
			wr.addClass("smallify");
		}else if(wrfollow.size() > 0 && jQuery(window).scrollTop() < parseInt(wrfollow.offset().top, 10)+280){
			wrfollow.removeClass("smallify");
		}

		if(wr.size() > 0 && jQuery(window).scrollTop() >= parseInt(wr.offset().top, 10) && menuisfollowing == false){
			menuisfollowing = true;
			wr.css({"height": wr.children(".main-menu-placeholder").height()});
			wr.addClass("is-now-following");
		}else if(wrfollow.size() > 0 && jQuery(window).scrollTop() < parseInt(wrfollow.offset().top, 10) && menuisfollowing == true){
			menuisfollowing = false;
			wrfollow.removeClass("is-now-following").css({"height": "auto"});
		}
	});

	// Generating retina placeholder image
	function generatePlaceholder(w, h){
		var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image;
		canvas.height = h;
		canvas.width = w;
		ctx.drawImage(img,0,0);
		setTimeout(function(){
			canvas = null;
		}, 10);
		return canvas.toDataURL('image/png');
	}

	setTimeout(function(){
		jQuery('.theiaStickySidebar', "body").parent().theiaStickySidebar({
			// Settings
			additionalMarginTop: 30
		});
	}, 100);

	// Breaking News Scroller
    jQuery(".breaking-news").on("mouseenter", function () {
	var thisindex = jQuery(this).attr("rel");
	clearTimeout(elementsActive[thisindex]);
    }).on("mouseleave", function () {
	var thisindex = jQuery(this).attr("rel");
	elementsActive[thisindex] = false;
    });


	// Sets spacer color
	jQuery("[data-spacer-color]", "body").toArray().forEach2(function(a){
		var thisel = jQuery(a);
		thisel.css({"color": thisel.data("spacer-color"), "background-color": thisel.data("spacer-color")});
	});


})(jQuery);

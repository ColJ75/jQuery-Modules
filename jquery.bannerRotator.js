/*
/* jquery.bannerRotator.js - take a list of banner images (and hyperlinks e.g. <a href="..."><img src="..." /></a>) and turn them in to a rotating banner system
/* Colin Jaggs (c) 2012 Pin Digital Ltd
*/
(function ($)
{
	var bannerRotator_counter = 0;
	var bannerRotator_ids = new Array();
	var bannerRotator_item_counts = new Array();
	var bannerRotator_active = new Array();
	var bannerRotator_timers = new Array();

	$.fn.bannerRotator = function (opts)
	{
		opts = $.extend({}, $.fn.bannerRotator.defaults, opts || {});
		$(this).each(function ()
		{
			// set up banner set
			var $bannerRotator_index = ++bannerRotator_counter;
			bannerRotator_ids[bannerRotator_counter] = $(this).attr("id");

			// set classes on child banners and add rel tag for quicker processing - count and hide all but the first one, making it the active banner
			var i = 0;
			$("> " + opts.childSel, this).each(function ()
			{
				$(this).addClass("bnr_" + ++i).attr("rel", i);
				if (i > 1) $(this).hide();
			});
			bannerRotator_item_counts[bannerRotator_counter] = i;
			bannerRotator_active[bannerRotator_counter] = 1;

			// add auto rotate function
			if (opts.autoRotate)
			{
				bannerRotator_timers[bannerRotator_counter] = setInterval(function ()
				{
					// find next and currently active banners for this set, and swap them over
					var $next_bnr = $("#" + bannerRotator_ids[$bannerRotator_index] + " .bnr_" + ((bannerRotator_active[$bannerRotator_index] + 1 > bannerRotator_item_counts[$bannerRotator_index]) ? 1 : bannerRotator_active[$bannerRotator_index] + 1));
					var $active_bnr = $("#" + bannerRotator_ids[$bannerRotator_index] + " .bnr_" + bannerRotator_active[$bannerRotator_index]);
					$active_bnr.fadeOut(opts.fadeSpeed, function () { $next_bnr.fadeIn(opts.fadeSpeed); bannerRotator_active[$bannerRotator_index] = parseInt($next_bnr.attr("rel")); });

					$("#" + bannerRotator_ids[$bannerRotator_index] + " > ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : "") + " > li" + (opts.buttonItemClass != "" ? "." + opts.buttonItemClass : "") + " > a").removeClass("on");
					$("#" + bannerRotator_ids[$bannerRotator_index] + " > ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : "") + " > li" + (opts.buttonItemClass != "" ? "." + opts.buttonItemClass : "") + " > a[rel=" + $bannerRotator_index + "_" + parseInt($next_bnr.attr("rel")) + "]").addClass("on");

				}, opts.interval);
			}

			// add link buttons to swtich between banners
			if (opts.addButtons)
			{
				$(this).prepend("<ul" + (opts.buttonListClass != "" ? " class=\"" + opts.buttonListClass + "\"" : "") + " />");
				for (var i = 1; i <= bannerRotator_item_counts[bannerRotator_counter]; i++) $("> ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : ""), this).append("<li" + (opts.buttonItemClass != "" ? " class=\"" + opts.buttonItemClass + "\"" : "") + "><a" + (i == 1 ? " class=\"on\"" : "") + " href=\"javascript:;\" rel=\"" + $bannerRotator_index + "_" + i + "\"><span>" + i + "</span></a></li>");
				$("> ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : "") + " > li" + (opts.buttonItemClass != "" ? "." + opts.buttonItemClass : "") + " > a", this).click(function ()
				{
					// switch between current and manually selected banners
					var bannerRotator_index = parseInt($(this).attr("rel").split("_")[0]);
					var bannerRotator_item_index = parseInt($(this).attr("rel").split("_")[1]);
					var $next_bnr = $("#" + bannerRotator_ids[bannerRotator_index] + " .bnr_" + bannerRotator_item_index);
					var $active_bnr = $("#" + bannerRotator_ids[bannerRotator_index] + " .bnr_" + bannerRotator_active[bannerRotator_index]);
					$active_bnr.fadeOut(opts.fadeSpeed, function () { $next_bnr.fadeIn(opts.fadeSpeed); bannerRotator_active[bannerRotator_index] = bannerRotator_item_index; });
					$("#" + bannerRotator_ids[bannerRotator_index] + " > ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : "") + " > li" + (opts.buttonItemClass != "" ? "." + opts.buttonItemClass : "") + " > a").removeClass("on");
					$(this).addClass("on");

					if (opts.autoRotate) clearInterval(bannerRotator_timers[bannerRotator_index]);
				});

				// should buttons be centered horizontally against the banners (uses the width of the banner space)
				if (opts.buttonsCentered) $("> ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : ""), this).css({ "margin-left": (($(this).outerWidth() / 2) - ($("> ul" + (opts.buttonListClass != "" ? "." + opts.buttonListClass : ""), this).outerWidth() / 2)) + "px" });
			}
		});
	}

	// set defaults
	$.fn.bannerRotator.defaults =
	{
		interval: 5000,
		childSel: "a",
		fadeSpeed: 400,
		autoRotate: true,
		addButtons: true,
		buttonListClass: "btns",
		buttonItemClass: "btn",
		buttonsCentered: true
	}
})(jQuery);

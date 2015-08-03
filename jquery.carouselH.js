/*
/* jQuery carouselH - take a list of objects and make a horizontal carousel from them
/* Colin Jaggs (c) 2014 Pin Digital Ltd
*/
(function ($)
{
	$.fn.carouselH = function (opts)
	{
		opts = $.extend({}, $.fn.carouselH.defaults, opts || {});

		var carouselList = $(this);

		// check if parent element is relative or absolute position - if neither then make relative
		if ($(carouselList).parent().css("position") == "static") $(carouselList).parent().css({ position: "relative" });

		// add all the necessary css to the object itself (set high width in case child elements are floated, then we can calculate the width properly)
		$(carouselList).css({ position: "absolute", overflow: "hidden", left: 0, right: 0, height: "auto", width: "21474836px" });

		// calculate width of child items and update the width of the object
		var width = 0, height = 0, items = 0, itemWidth = 0;
		itemWidth = $(carouselList).children().first().outerWidth(true);
		$(carouselList).children().each(function () { width += $(this).outerWidth(true); if ($(this).outerHeight(true) > height) height = $(this).outerHeight(true); $(this).removeClass(opts.classToRemove); items++; });
		$(carouselList).css({ width: width * items, height: height, "min-height": height });

		// create a container for the whole carousel and wrap around the clip layer
		$(carouselList).wrap($("<div class=\"" + opts.className + "\">").css({ position: "relative" }));
		var carousel = $(carouselList).parent();

		// create a clip container and wrap around the content
		$(carouselList).wrap($("<div class=\"clip\">").css({ "min-height": height, position: "relative", overflow: "hidden" }));

		// add next / previous buttons
		var prev = $("<a href=\"javascript:;\" class='prev'>" + opts.prevButtonHtml + "</a>").addClass("dis").css({ display: "none", position: "absolute", top: "50%", 'z-index': 2 }), next = $("<a href=\"javascript:;\" class='next'>" + opts.nextButtonHtml + "</a>").addClass("dis").css({ display: "none", position: "absolute", top: "50%", 'z-index': 2 });
		$(carousel).append($(prev), $(next));
		$(prev).css({ left: 0 - ($(prev).width() / 2), "margin-top": 0 - ($(prev).outerHeight() / 2) }).css(opts.prevButtonCss).click(function () { scrollTo(this, -1); });
		$(next).css({ right: 0 - ($(next).width() / 2), "margin-top": 0 - ($(next).outerHeight() / 2) }).css(opts.nextButtonCss).click(function () { scrollTo(this, 1); });

		// start by scrolling to position 0, which will configure the buttons accordingly
		scrollTo(null, 0);

		function scrollTo(o, dir)
		{
			if (o && $(o).is(".dis")) return;

			switch (dir)
			{
				case 1:
					$(".clip", $(carousel)).filter(':not(:animated)').animate({ scrollLeft: $(".clip", $(carousel)).scrollLeft() + itemWidth }, 300, toggleNav);
					break;
				case -1:
					$(".clip", $(carousel)).filter(':not(:animated)').animate({ scrollLeft: $(".clip", $(carousel)).scrollLeft() - itemWidth }, 300, toggleNav);
					break;
				default:
					$(".clip", $(carousel)).filter(':not(:animated)').animate({ scrollLeft: 0 }, 0, toggleNav);
					break;
			}
		};

		// check which nav buttons should be visible based on current scroll
		function toggleNav()
		{
			if (width > $(carousel).outerWidth()) { $(prev).show(); $(next).show(); } else { $(prev).hide(); $(next).hide(); }
			if ($(".clip", $(carousel)).scrollLeft() > 0) $(prev).removeClass('dis'); else $(prev).addClass('dis');
			if (width > $(carousel).outerWidth() + $(".clip", $(carousel)).scrollLeft()) $(next).removeClass('dis'); else $(next).addClass('dis');
		}
	};
	$.fn.carouselH.defaults =
	{
		className: "carouselH",
		classToRemove: "eol",				// class to remove from items, e.g. if every nth item has a class to say it's the end of a line then remove it to allow wrapping
		prevButtonHtml: "Previous",		// html to use for previous button (text default but could be image tag etc.)
		prevButtonCss: {},						// additional css to override previous button default css
		nextButtonHtml: "Next",				// html to use for next button (text default but could be image tag etc.)
		nextButtonCss: {}						// additional css to override next button default css
	}
})(jQuery);

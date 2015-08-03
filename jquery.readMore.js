/*
/* jquery.readMore.js - take a chunk of text and if over a specific number of characters add a 'read more' link and hide the excess
/* Colin Jaggs (c) 2011 Pin Digital Ltd
*/
(function ($)
{
	$.fn.readMore = function (opts)
	{
		opts = $.extend({}, $.fn.readMore.defaults, opts || {});
		$(this).each(function ()
		{
			if ($(this).html().length > opts.maxLength)
			{
				var isIE6or7 = ($.browser.msie && /msie [6|7]\.0/i.test(navigator.userAgent)) ? true : false;
				if (!isIE6or7) while (opts.maxLength > 0 && $(this).html()[opts.maxLength].match(/[0-9A-Za-z]/)) opts.maxLength --;
				var part1 = $(this).html().substring(0, opts.maxLength), part2 = $(this).html().substring(opts.maxLength);
				$(this).html(part1 + '<a href="javascript:void(0)" onclick="return false;" class="moreLnk">' + opts.linkText + '</a><span class="more" style="display:none;">' + part2 + "</span>");
				$("a.moreLnk", this).click(function ()
				{
					$(this).hide();
					if (isIE6or7) $(this).siblings(1).show();
					else $(this).siblings(1).fadeIn("fast");
				})
			}
		})
	};
	$.fn.readMore.defaults = 
	{
		maxLength: 150,
		linkText: " … Read more >>>"
	}
})(jQuery);

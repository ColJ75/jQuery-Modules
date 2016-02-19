/*!
 * jquery.modalDialog.js - modal dialog plugin for jQuery
 * Colin Jaggs (c) 2011 Pin Digital Ltd
 * adds 3 layers (a 'blackout' mask to cover content behind the modal window, the modal window itself at the size specified, and a modal background ideal for providing borders around the content)
*/
(function ($)
{
	// global $ methods for showing/hiding the modal dialog
	$.fn.modalDialog = function (opts)
	{
		// no support for ie6 so don't do anything
		if (/MSIE 6.0/.test(navigator.userAgent)) return;

		// set options and defaults
		opts = $.extend({}, $.fn.modalDialog.defaults, opts || {});
		opts.overlayCSS = $.extend({}, $.fn.modalDialog.defaults.overlayCSS, opts.overlayCSS || {});
		var css = $.extend({}, $.fn.modalDialog.defaults.css, opts.css || {});
		var bgCss = $.extend({}, $.fn.modalDialog.defaults.bgCss, opts.bgCss || {});
		var msg = $(this);
		clearTimeout($.fn.modalDialog.cleanupTimer);

		// remove any previous active modal dialogs
		$(".modalDialog").remove();

		// create layers: 1 = overlay, 2 = modal background, 3 = modal dialog
		var z = opts.zIndex;
		var lyr1 = $('<div class="modalDialog modalOvl" style="z-index:' + z++ + ';display:block;border:none;margin:0;padding:0;position:fixed;width:100%;height:100%;top:0;left:0;right:0;bottom:0;"></div>');
		var lyr2 = $('<div class="modalDialog modalBg" style="z-index:' + z++ + ';display:block;position:absolute;"></div>');
		var lyr3 = $('<div class="modalDialog modalMsg" style="z-index:' + z + ';display:block;position:fixed;"></div>');
		var lyr4 = $('<div style="display:block;position:' + "absolute" + ';top:0;left:0;right:0;bottom:0;width:100%;height:100%;"></div>');

		// add specific css to layers including making the iframe layer transparent
		lyr1.css(opts.overlayCSS);
		lyr2.css(bgCss);
		lyr3.css(css);

		// add the dialog to the top layer
		$(msg).show().appendTo($(lyr4));
		lyr4.appendTo(lyr3);

		// add the layers to the body
		//$(lyr3).appendTo($("body"));
		var layers = [lyr1, lyr2, lyr3];
		$.each(layers, function () { if (this != "") this.appendTo($("body")); });

		// position the dialog in the center of the viewable area
		lyr2.css({ left: "50%", marginLeft: (lyr2.outerWidth() / 2) * -1, top: ($(window).height() / 2), marginTop: (lyr2.outerHeight() / 2) * -1, display: "none" });
		lyr3.css({ left: "50%", marginLeft: (lyr3.outerWidth() / 2) * -1, top: ($(window).height() / 2), marginTop: (lyr3.outerHeight() / 2) * -1, display: "none" });

		// show the overlay and dialog
		if (opts.fadeIn)
		{
			lyr1.fadeIn(opts.fadeIn);
			lyr2.fadeIn(opts.fadeIn);
			lyr3.fadeIn(opts.fadeIn, function () { if (opts.onLoad) opts.onLoad(); });
		}
		else
		{
			lyr1.show();
			lyr2.show();
			lyr3.show();
			if (opts.onLoad) opts.onLoad();
		}

		// add class to document body to let it know modal windows are active, and record current vertical scroll position so we can restore it after should we need to
		$.fn.modalDialog.originalScrollY = $(window).scrollTop();
		$("body").addClass("modalActive");
		$("body form").css({ top: (- $.fn.modalDialog.originalScrollY) + "px" });

		// add event to the overlay to close the dialog when clicked
		if (opts.overlayClickToClose) lyr1.click(function () { $.fn.modalDialogHide(opts); });

		// add click event to all close elements matching the set selector
		$("#modal " + opts.closeSel).click(function () { $.fn.modalDialogHide(opts); });
	};
	$.fn.modalDialogHide = function (opts)
	{
		opts = $.extend({}, $.fn.modalDialog.defaults, opts || {});
		$(".modalDialog", $(window.parent ? window.parent.document : document)).fadeOut(opts.fadeOut);
		$.fn.modalDialog.cleanupTimer = setTimeout(function ()
		{
			var win = (window.parent ? window.parent : window);
			var $body = $("body", $(win.document)).removeClass("modalActive");
			$(".modalDialog", $(window.parent ? window.parent.document : document)).remove();
			if ($.fn.modalDialog.originalScrollY > 0) win.scrollTo(0, parseInt($.fn.modalDialog.originalScrollY));
		}, opts.fadeOut);
	};
	$.fn.modalDialog.cleanupTimer = null;
	$.fn.modalDialog.originalScrollY = null;

	// override these in your code to change the default behavior and style
	$.fn.modalDialog.defaults =
	{
		css: {},			// default styles for the dialog
		bgCss: {},			// default styles for the dialog background, e.g. larger with background to create border effect etc
		overlayCSS: { backgroundColor: "#000", opacity: 0.75 },			// styles for the overlay
		iframeSrc: "about:blank",
		zIndex: 1000, // z-index for the overlay
		fadeIn: 300, // fadeIn time (or 0 to disable fadeIn)
		fadeOut: 300, // fadeOut time (or 0 to disable fadeOut)
		closeSel: ".close", // jquery selector to attach close event to
		overlayClickToClose: true, // close the dialog when the overlay is clicked
		onLoad: null // callback method invoked when fadeIn has completed modal dialog is visible
	};
})(jQuery);

/*
/* jquery.modalDialog.js - modal dialog plugin for jQuery
/* Colin Jaggs (c) 2011 Pin Digital Ltd
/* adds 4 layers (an iframe (ie6 only) and a 'blackout' mask to cover content behind the modal window, the modal window itself at the size specified, and a modal background ideal for providing borders around the content etc.)
*/
(function ($)
{
	// ie6 needs special treatment so test for it first and set a flag
	var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent);

	// global $ methods for showing/hiding the modal dialog
	$.fn.modalDialog = function(opts)
	{
		opts = $.extend({}, $.fn.modalDialog.defaults, opts || {});
		opts.overlayCSS = $.extend({}, $.fn.modalDialog.defaults.overlayCSS, opts.overlayCSS || {});
		var css = $.extend({}, $.fn.modalDialog.defaults.css, opts.css || {});
		var bgCss = $.extend({}, $.fn.modalDialog.defaults.bgCss, opts.bgCss || {});
		var msg = $(this);

		// create layers: 1 = iframe (ie6 only), 2 = overlay, 3 = modal dialog
		var z = opts.zIndex;
		var lyr1 = (ie6) ? $('<iframe class="modalDialog modaliFrm" style="z-index:' + (z++) + ';border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>') : "";
		var lyr2 = $('<div class="modalDialog modalOvl" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:fixed;width:100%;height:100%;top:0;left:0"></div>');
		var lyr3 = $('<div class="modalDialog modalBg" style="z-index:' + (z++) + ';display:none;position:fixed"></div>');
		var lyr4 = $('<div class="modalDialog modalMsg" style="z-index:' + z + ';display:none;position:fixed"></div>');

		// add specific css to layers including making the iframe layer transparent
		if (ie6) lyr1.css('opacity', 0.0);
		lyr2.css(opts.overlayCSS);
		lyr3.css(bgCss);
		lyr4.css(css);

		// add the dialog to the top layer
		$(msg).show().appendTo($(lyr4));

		// add the layers to the body
		var layers = [lyr1, lyr2, lyr3, lyr4];
		$.each(layers, function () { if (this != "") this.appendTo($('body')); });

		// ie6 - fix size and position of the layers
		if (ie6)
		{
			$.each([lyr1, lyr2], function() { $(this).css({ position: "absolute", width: jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px", height: Math.max(document.body.scrollHeight, document.body.offsetHeight) + "px" }); });
			lyr3.css({ position: "absolute" });
			lyr4.css({ position: "absolute" });
		}

		// position the dialog in the center of the viewable area
		lyr3.css({ left: '50%', marginLeft: (lyr3.outerWidth() / 2) * -1, top: '50%', marginTop: (lyr3.outerHeight() / 2) * -1 });
		lyr4.css({ left: '50%', marginLeft: (lyr4.outerWidth() / 2) * -1, top: '50%', marginTop: (lyr4.outerHeight() / 2) * -1 });

		// show the overlay and dialog
		if (opts.fadeIn)
		{
			lyr2.fadeIn(opts.fadeIn);
			lyr3.fadeIn(opts.fadeIn);
			lyr4.fadeIn(opts.fadeIn, function () { if (opts.onLoad) opts.onLoad(); });
		}
		else
		{
			lyr2.show();
			lyr3.show();
			lyr4.show();
			if (opts.onLoad) opts.onLoad();
		}

		// add event to the overlay to close the dialog when clicked
		if (opts.overlayClickToClose) lyr2.click(function () { $.fn.modalDialogHide(opts); });

		// add click event to all close elements matching the set selector
		$("#modal " + opts.closeSel).click(function () { $.fn.modalDialogHide(opts); });
	};
	$.fn.modalDialogHide = function(opts)
	{
		opts = $.extend({}, $.fn.modalDialog.defaults, opts || {});
		var els = $('body').children().filter('.modalDialog').add('body > .modalDialog');
		if (opts.fadeOut) els.fadeOut(opts.fadeOut, function() { $(this).remove(); });
		else els.remove();
	};

	// override these in your code to change the default behavior and style
	$.fn.modalDialog.defaults =
	{
		css: { background: "#fff" }, 	// default styles for the dialog
		bgCss: {}, 	// default styles for the dialog background, e.g. larger with background to create border effect etc
		overlayCSS: { backgroundColor: '#000', opacity: 0.6 }, 			// styles for the overlay
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',		// for ie6 set the correct iframe source ('about:blank' fails on HTTPS and javascript:false is very slow)
		zIndex: 1000,																				// z-index for the overlay
		fadeIn: 300, 																					// fadeIn time (or 0 to disable fadeIn)
		fadeOut: 300, 																				// fadeOut time (or 0 to disable fadeOut)
		closeSel: ".close",																			// jquery selector to attach close event to
		overlayClickToClose: true,															// close the dialog when the overlay is clicked
		onLoad: null																					// callback method invoked when fadeIn has completed modal dialog is visible
	};

})(jQuery);

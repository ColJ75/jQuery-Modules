/*
/* jqValidate - jQuery form validation */
/* Colin Jaggs (c) 2014 Pin Digital Ltd
*/
(function ($)
{
	$.fn.jqValidate = function (opts)
	{
		var firstRun = true;
		opts = $.extend({}, $.fn.jqValidate.defaults, opts);
		$(document).ready(init);

		function init()
		{
			// if running for the first time add an end request handler to reinitialise after postbacks
			if (firstRun) { firstRun = false; (Sys.WebForms.PageRequestManager.getInstance()).add_endRequest(init); }

			// add change event to each validated field, to check when changed
			$("*[data-jqValidate='true']").on('change blur', function () { $(this).jqValidateField(opts); });

			// attach click event to validation triggers (e.g. buttons)
			$("*[data-jqvalidate-trigger='true']").on('click', function (e)
			{
				opts.groupName = $(this).attr("data-jqvalidate-group");
				if ($.fn.jqValidateForm(opts)) return true;
				else { e.preventDefault(); return false; }
			});
		}
	};
	$.fn.jqValidateForm = function (opts)
	{
		// if not options are provided use the defaults
		opts = $.extend({}, $.fn.jqValidate.defaults, opts);

		// find all elements in the given group, or if no group is specified then all elements enabled for validation
		var isValid = true;
		$(opts.groupName != null ? "*[data-jqvalidate][data-jqvalidate-group='" + opts.groupName + "']" : "*[data-jqvalidate]").each(function () { if (!$(this).jqValidateField(opts)) isValid = false; });
		if ($("." + opts.toolTipClassName).length > 0) $('html, body').animate({ scrollTop: $("." + opts.toolTipClassName).first().offset().top - 10 }, 'fast');
		return isValid;
	};
	$.fn.jqValidateField = function (opts)
	{
		// if not options are provided use the defaults
		opts = $.extend({}, $.fn.jqValidate.defaults, opts);

		var result = true;
		this.each(function ()
		{
			// determine if the source element is the one to wrap and highlight as warn/ok, or if there is another object we need to focus on (e.g. could be a text box, but if it's a hidden field then the target might be a parent container or UL/OL etc.)
			var $srcEl = ($(this).attr("data-jqvalidate-target")) ? $($(this).attr("data-jqvalidate-target")) : $(this);

			// check if the source element has been wrapped yet (an outer layer to allow positioning of the floating messages) - if not wrapped then do it now
			if ($srcEl.parent().attr("class") != "jqValidate") $srcEl.wrap($("<div class=\"jqValidate\" />").css({ position: "relative", "min-height": ($(this).attr("data-jqvalidate-height") ? $(this).attr("data-jqvalidate-height") : ($(this).attr("data-jqvalidate-target") ? $($(this).attr("data-jqvalidate-target")) : $(this)).outerHeight() + "px") }));

			// if the field is empty (based on required pattern regex) then show the required error message
			if (!(new RegExp(opts.requiredPattern)).test($(this).val()))
			{
				$(".jqValidateResult", $(this).parent()).fadeOut('fast', function () { $(this).remove(); });
				if (/(INPUT|TEXTAREA|SELECT)/.test($srcEl[0].tagName)) $srcEl.attr("style", "border: " + opts.css.txtBoxWarning.border + " !important");
				$srcEl.parent().append(opts.msgTemplate.clone().css(opts.css.overlay).css(opts.css.overlayWarning).append($("<span>" + ($(this).attr("data-jqvalidate-requiredMessage") ? $(this).attr("data-jqvalidate-requiredMessage") : "required") + "</span>").addClass(opts.toolTipClassName != null ? opts.toolTipClassName : '').css(opts.css.toolTip)).fadeIn('fast'));
				result = false; return false;
			}

			// check for a regex pattern to match against, and if invalid show invalid message rather than required
			if ($(this).attr("data-jqvalidate-pattern") && !(new RegExp($(this).attr("data-jqvalidate-pattern"))).test($(this).val()))
			{
				$(".jqValidateResult", $(this).parent()).fadeOut('fast', function () { $(this).remove(); });
				if (/(INPUT|TEXTAREA|SELECT)/.test($srcEl[0].tagName)) $srcEl.attr("style", "border: " + opts.css.txtBoxWarning.border + " !important");
				$srcEl.parent().append(opts.msgTemplate.clone().css(opts.css.overlay).css(opts.css.overlayWarning).append($("<span>" + ($(this).attr("data-jqvalidate-invalidMessage") ? $(this).attr("data-jqvalidate-invalidMessage") : "invalid") + "</span>").addClass(opts.toolTipClassName != null ? opts.toolTipClassName : '').css(opts.css.toolTip)).fadeIn('fast'));
				result = false; return false;
			}

			// if still here then validated ok
			$(".jqValidateResult", $(this).parent()).fadeOut('fast', function () { $(this).remove(); });
			if (/(INPUT|TEXTAREA|SELECT)/.test($srcEl[0].tagName)) $srcEl.attr("style", "border: " + opts.css.txtBoxOk.border + " !important");
			$srcEl.parent().append(opts.msgTemplate.clone().css(opts.css.overlay).css(opts.css.overlayOk).fadeIn('fast'));
			return true;
		});
		return result;
	};

	// global defaults - exposed so they can be changed globally across the application
	$.fn.jqValidate.defaults = {
		groupName: null,
		toolTipClassName: 'jqValidateToolTip',		// class name overrides tooltip css below
		requiredPattern: "^.+$",
		css: {
			txtBoxWarning: {
				"border": "1px solid #c00"
			},
			txtBoxOk: {
				//"border": "1px solid #458902"
			},
			overlay: {
				"position": "absolute",
				"top": "0",
				"right": "0",
				//"margin-right": "-4px",
				"font-weight": "normal",
				"font-size": "11px",
				"width": "32px",
				"height": "32px",
				"background": "#f2f2f2",
				//"padding": "0 0 0 27px",
				"z-index": "20"
			},
			overlayWarning: {
				//"background": "url(" + FolderRoot + "/Img/jqValWarn.png) no-repeat 0 50%"
				"background": "transparent",
			},
			overlayOk: {
				"background": "url(" + FolderRoot + "Img/jqValOk.png) no-repeat 4px 50%",
			},
			toolTip: {
				"background-color": "#ffe0e0",
				"border": "1px solid #c00",
				//"border-radius": "8px",
				"padding": "7px",
				"min-height": "32px",
				"line-height": "16px",
				"display": "inline-block",
				"white-space": "pre",
				"color": "#c00",
				"font-weight": "bold",
				"font-size": "11px",
				"z-index": "20",
				"margin-left": "31px"
			}
		},
		msgTemplate: $("<div class=\"jqValidateResult\" style=\"display:none;\"></div>")
	};

	// auto run on document ready
	$(document.forms[0]).jqValidate();
})(jQuery);

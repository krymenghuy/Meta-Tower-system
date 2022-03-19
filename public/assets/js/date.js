/*Start: jquery-style javascript code for Date input format textbox (eg: user enter number and press Space key so that the textbox will add slash sign '/' automatically)*/
(function ($, window) {
    /* jquery function with options as argument*/
    //$.fn.dateFormatter = function (settings) {
    //    return $(this).each(function () {
    //        var el = $(settings.element);
    //        el.on('keyup', function () {
    //            alert('jquery keycode ... ');
    //        });
    //    });
    //};
    var num_lock_key_values = ['`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    /* jquery function without options as argument*/
    $.fn.dateFormatter = function () {
        //do not allow space in date field
        $(this).on('keydown', function (event, ui) {
            //var value = $(this).val();
            if (event.which == 32)
                return false;
        });

        $(this).on('keyup', function (event, ui) {
            if (event.keyCode == 13) {
                $(this).trigger('blur');
                return;
            }
            var key = String.fromCharCode(event.keyCode);
            if (!(key >= 0 && key <= 9) && num_lock_key_values.indexOf(key) < 0) $(this).val($(this).val().substr(0, $(this).val().length - 1));
            var value = $(this).val();
            if (value.length == 1 && (event.keyCode == 32 || event.keyCode == 191 || event.keyCode == 220 || event.keyCode == 111)) $(this).val('0' + $(this).val() + '-');

            if (value.length == 2) {
                $(this).val($(this).val() + '-');
            }
            else if (value.length == 4) {
                var st = value.split('-');
                if (parseInt(st[1]) > 1) {
                    $(this).val([st[0], '-', st[1], '-'].join(''));
                }
                else {
                    if (event.keyCode == 32) {
                        $(this).val($(this).val() + '-');
                    }
                }

            }
            else if (value.length == 5) {
                if (value.slice(-1) != '-')
                    $(this).val($(this).val() + '-');
            }
        });

        $(this).on('blur', function (event, ui) {
            var d = $(this).val();
            var ss = d.split('-');
            var dd = ss[0];
            var mm = ss[1]; //NOTE that mm can be either Month Number or Three-character month name such as jan or Feb or Mar
            var yy = ss[2];
            if (yy == 0) {
                yy = 2000;
            } else if (yy < 99) {
                yy = ['20', yy].join('');
            }

            d = [dd, '-', mm, '-', yy].join('');

            if (DateHelper.isDate(d)) {
                $(this).parent().removeClass('has-error');
                //d = $.datepicker.formatDate('dd-M-yy', new Date(d)); //this is original line: but it convert from, for example: 2-08-2016 to 08-Feb-2016, while the intended format is 02-Aug-2016
                //$(this).val(d);
                $(this).val(DateHelper.formatDate(d));
            } else {
                $(this).parent().addClass('has-error');
            }
        });

    };
})(jQuery, window);
/* End of jquery style code for Date input format textbox*/

//$('.datepicker').parent().addClass('input-group');
//$('.datepicker').parent().append('<div class="input-group-addon">..</div>');

// Make all inputs with class 'datepicker' become DatePickers. // {datepicker:'dd-M-yy',changeYear:true,inline:false,disabled:true}
//$('.datepicker').datepicker({ dateFormat: 'dd-M-yy', changeYear: true});
////$('.datepicker').datepicker({ dateFormat: 'dd-M-yy', changeYear: true });
////$('.datepicker').on('focus', function () {
////    if (!$(this).hasClass('hasDatepicker'))
////        $(this).datepicker({ dateFormat: 'dd-M-yy', changeYear: true });
////    //$(this).datepicker('show');
////});

////*******This following event handler is defined in $.fn.dateFormatter() already
////$('.datepicker').on('blur', function () {
////    if (!$(this).is('[readOnly]'))
////    {
////        $(this).val(DateHelper.format($(this).val()));
////    }
////});

var _datepicker_inputs = $('.datepicker');
_datepicker_inputs.dateFormatter();
_datepicker_inputs.attr('autocomplete','off');

/*Input.text behavior, Textbox behavior */
$('input').on('focus', function (event, ui) {
    $(this)
    .one('mouseup', function () {
        if ($(this).prop('readOnly') ==false) $(this).select();
        return false;
    })
    .select();

	if ($(this).prop('readonly')) {
    $('#ui-datepicker-div').css({ 'visibility': 'hidden' })
    } else { $('#ui-datepicker-div').css({ 'visibility': 'visible' }) }

    // if ($(this).hasClass('datepicker')) {
        // if ($(this).prop('readOnly') ==true)
		// {
			 // $(this).readonlyDatepicker(true);
		// }
        // else
            // $(this).readonlyDatepicker(false);
    // }
	
});
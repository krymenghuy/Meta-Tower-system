'use strict'
let Validator = new function () {
    let mThis = this;
    this.onLostFocus_select2 = (el) => {
        let required = el.data('required');
        if (required == 1) Validator.checkValue(el);
    };

    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
        'january', 'february', 'april', 'may', 'june', 'july', 'august', 'september', 'november', 'december'];

    this.validateFields = function (fields) {
        let c, i = 0;
        do {
            c = fields[i];
            if (c == undefined) break;
            if (c.validate == true) {
                if (c.choices instanceof Array)
                {
                    if (c.choices.indexOf(c.element.val()) < 0) {
                        cv_interact.alert(c.validateText, null, 'error');
                        return false;
                    }
                }

                if (c.dataType == 'string') {
                    if (validator.isNullOrEmpty1(c.element)) {
                        cv_interact.alert(c.validateText, null, 'error');
                        return false;
                    }
                } else if (c.dataType == 'number') {
                    if (!validator.isNumber1(c.element)) {
                        cv_interact.alert(c.validateText, null, 'error');
                        return false;
                    }
                } else if (c.dataType == 'date') {
                    if (!validator.isDate1(c.element)) {
                        cv_interact.alert(c.validateText, null, 'error');
                        return false;
                    }
                }
                else if (c.dataType == 'positive' || c.dataType == 'number positive') {
                    if (!validator.isPositiveFloat1(c.element)) {
                        cv_interact.alert(c.validateText, null, 'error');
                        return false;
                    }
                }
            } else {
                if (c.dataType == 'date') {
                    if (!DateHelper.isDate(c.element.val())) c.element.val('0/0/0');
                }
            }

            i += 1;
        } while (c != undefined);

        return true;
    };

    this.clearForm = function (fields) {
        var c, i = 0;
        do {
            c = fields[i];
            if (c == undefined) break;
            if (c.dataType == 'number')
                c.element.val(0);
            else
                c.element.val('');
            var readOnly = c.alwaysReadOnly ? true : false;

            if (c.element.is('select'))
                c.element.prop('disabled', readOnly);
            else
                c.element.prop('readOnly', readOnly);

            c.element.parent().removeClass('has-error');
            i += 1;
        } while (c != undefined);
    };

    this.isNullOrEmpty = function (mValue) {
        if (mValue == null)
            return true;
        if (mValue.toString().trim().length <= 0)
            return true;
    };
    this.isPositiveFloat = function (mValue) {
        if (!Number(mValue) || !$.isNumeric(mValue)) return false;
        if ($.isNumeric(mValue)) {
            return true;
        } else {
            return false;
        }
    };
    this.isPositiveInt = function (mValue) {
        var d = parseInt(mValue);
        if (d > 0 && $.isNumeric(mValue)) {
            return true;
        } else {
            return false;
        }
    };
    this.isNumber = function (mValue) {
        return $.isNumeric(mValue);
    };
    this.isBoolean = function (mValue) {
        mValue = mValue.toString().toLowerCase().trim();

        if (mValue == 'true' || mValue == 'false') {
            return true;
        } else {
            return false;
        }
    };
    this.isInteger = function (mValue) {
        if (!$.isNumeric(mValue)) return false;
        return (mValue % 1 === 0);
    };
    this.isDate = function (mValue) {
        return DateHelper.isDate(mValue);
    };

    this.isEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    this.isPhoneNumber = (d) => {
        d = d + '';
        let len = d.length;
        if (len > 25) return false;
        for (let i = 0; i < len; i++) {
            if (!$.isNumeric(d.charAt(i))) return false;
        }
        return true;
    }

    this.isValidMonth = function (mValue, checkByMonthNameOnly) {

        if (checkByMonthNameOnly == true) {
            if (months.indexOf(mValue.toString().toLowerCase()) == -1)
                return false;
            else
                return true;
        }

        if (months.indexOf(mValue.toString().toLowerCase()) >= 0) {
            return true;
        }
        else {
            if (this.isInteger(mValue)) {
                if (mValue < 1 || mValue > 12) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    };

    this.isNullOrEmpty1 = function (el) {
        var d = el.val();
        if (d == '' || d == 'null') {
            el.parent().addClass('has-error');
            el.focus();
            return true;
        } else {
            el.parent().removeClass('has-error');
        }
    };

    this.isDate1 = function(el){
        if (DateHelper.isDate(el.val())) {
            el.parent().removeClass('has-error');
            return true;
        }
        else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isEmail1 = function(el){
        if(this.isEmail(el.val())){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isPositiveFloat1 = function (el) {
        if(this.isPositiveFloat(el.val())){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isPositiveInt1 = function (el) {
        if(this.isPositiveInt(el.val())){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isBetween1 = function (el, min, max) {
        var v = el.val();
        if(v >= min && v <= max){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.atMost1 = function (el, number) {
        var v = el.val();
        if(v <= number){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.atLeast1 = function (el, number) {
        var v = el.val();
        if(v >= number){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isInteger1 = function (el) {
        var val = el.val();
        if(this.isInteger(val)){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            return false;
        }
    };

    this.isNumber1 = function(el){
        if(this.isNumber(el.val())){
            el.parent().removeClass('has-error');
            return true;
        }
        else{
            el.parent().addClass('has-error');
            return false;
        }
    };

    this.avoidZero = function(el){
        if (parseFloat(el.val()) == 0) {
            el.parent().addClass('has-error');
            el.focus();

            return false;
        } else {
            el.parent().removeClass('has-error');
            return true;
        }
    };

    this.trans = (text) => {
        if (!LocaleManager) return text;
        let langSection = 'validation';
        return LocaleManager.trans(text, langSection);
    }

    this.getErrorText = (el, dtype = null) => {
        let err = el.data('errortext');
        if (!err) {
            if (!dtype) dtype = el.data('datatype');
            switch (dtype) {
                case 'email': {
                    err = 'Email is not correct';
                    break;
                }
                case 'phone': {
                    err = 'Phone number is not correct';
                    break;
                }
                case 'name': {
                    err = 'name is required';
                    break;
                }
                case 'lastname': {
                    err = 'Last name is not correct';
                    break;
                }
                case 'firstname': {
                    err = 'First name is not correct';
                    break;
                }
                case 'sex': {
                    err = 'Sex is not correct';
                    break;
                }
                case 'date_of_birth': {
                    err = 'Date of birth is not correct';
                    break;
                }
                case 'dob': {
                    err = 'Date of birth is not correct';
                    break;
                }
                case 'start_date': {
                    err = 'Start date is not correct';
                    break;
                }
                case 'end_date': {
                    err = 'End date is not correct';
                    break;
                }
                default: {
                    let f = el.data('ffield');
                    f = f ? f : el.data('field');
                    f = mThis.properCase(f);
                    err = [f ? f : 'This field', ` is required`].join('');
                    break;
                }
            }
        }
        return mThis.trans(err);
    }

    this.properCase = (inputString) => {
        if (!inputString) return null;
        return inputString
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    this.clearErrors = (div) => {
        div.find('.data-input').each(function () {
            let el = $(this);
            el.data('error', null);
            let p = el.parent();
            p.find('.error_text').remove();
            p.removeClass('has-error');
        });
        div.find('.server-error-text').val(null);
    }

    this.getError = (el) => {
        let dtype = el.data('datatype');
        switch(dtype){
            case 'email': {
                if (!Validator.isEmail(el.val())) return mThis.getErrorText(el, 'email');
                break;
            }
            case 'phone': {
                if (!Validator.isPhoneNumber(el.val())) return mThis.getErrorText(el, 'phone');
                break;
            }
            case 'name': {
                if (Validator.isNullOrEmpty(el.val())) return mThis.getErrorText(el, 'name');
                break;
            }
            case 'number': {
                if (!$.isNumeric(el.val())) return mThis.getErrorText(el, 'number');
                break;
            }

            case 'positive': {
                if (!(el.val() > 0)) return mThis.getErrorText(el, 'positive');
                break;
            }
            case 'negative': {
                if (!(el.val() < 0)) return mThis.getErrorText(el, dtype);
                break;
            }
            case 'range': {
                let min = el.data('min');
                let max = el.data('max');
                if (!(min > 0 || min <= 0)) min = 0;
                if (!(max > 0 || max <= 0)) max = 0;
                if (el.val() < min || el.val() > max) return mThis.getErrorText(el, dtype);
                break;
            }
            default: {
                if (Validator.isNullOrEmpty(el.val())) return mThis.getErrorText(el);
                break;
            }
        }
    }

    this.checkValue = (el) => {
        let err = mThis.getError(el);
        if (err) {
            if (el.hasClass('modal-select2')) {
                let select2_containter = el.next();
                select2_containter.find('.select2-selection--single').addClass('select2-error');
                return;
            }

            let p = el.parent();
            if (p.hasClass('input-group')) p = p.parent();
            if (p) {
                let span = p.find('.error_text');
                if (span.length === 0) {
                    p.append(`<span class="error_text">${err}</span>`);
                    p.addClass('has-error');
                }
            }
            el.data('error', 1);
        }
        else{
            if(el.hasClass('modal-select2')){
                let select2_containter = el.next();
                select2_containter.find('.select2-selection--single').removeClass('select2-error');
                return;
            }

            let p = el.parent();
            if (p.hasClass('input-group')) p = p.parent();
            let span = p.find('.error_text');
            span.remove();
            p.removeClass('has-error');
            el.data('error', null);
        }
    }
};

window.addEventListener('DOMContentLoaded', function(){
    $(document).find('.data-input').each(function(){
        let el = $(this);
        if(el.data('required') == 1){
            el.on('blur', () => {
                Validator.checkValue(el);
            });

            el.on('change', () => {
                Validator.checkValue(el);
            });
        }
    });
    this.removeEventListener('DOMContentLoaded',() => {
        $(document).find('.data-input').each(function(){
            let el = $(this);
            if(el.data('required') == 1){
                el.on('blur', () => {
                    Validator.checkValue(el);
                });
    
                el.on('change', () => {
                    Validator.checkValue(el);
                });
            }
        });
    });
});
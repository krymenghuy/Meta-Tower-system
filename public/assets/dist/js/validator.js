'use strict'
 /** Dependency info 
  validator.js depends on the following js files
  1. jquery and bootstrap (js and css) for expecially "has-error" class
  2. DateHelper.js for DateHelper.isDate() function
  3. cv_interact.js for cv_interact.alert(), message box function
 **/

//begin Validator class
var Validator = new function () {
    let mThis = this;
    var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
                   'january', 'february', 'april', 'may', 'june', 'july', 'august', 'september', 'november', 'december'];

    /*
       validateFields() methods validates the given fields, which is an array with the following structure
       var fields = [
        {
          dataMember:'StudentCode',
          dataType:'string'
          element: $('#pmtheader_studentCode');
          validate:true,
          validateText:'Student ID is cannot be empty' 
        },
        ......... 
       ];
   */
    this.validateFields = function (fields) {
        var c, i = 0;
        do {
            c = fields[i];
            if (c == undefined) break;
            if (c.validate == true) {
                if (c.choices instanceof Array) //c.choices is array of possible values. For example InstrunctionLang = ['English','Khmer','Chinese']
                {
                    if (c.choices.indexOf(c.element.val()) <0)
                    {
                        cv_interact.alert(c.validateText,null,'error');
                        return false;
                    }
                }

                if (c.dataType == 'string') {
                    if (validator.isNullOrEmpty1(c.element)) {
                        cv_interact.alert(c.validateText,null,'error');
                        return false;
                    }
                } else if (c.dataType == 'number') {
                    if (!validator.isNumber1(c.element)) {
                        cv_interact.alert(c.validateText,null,'error');
                        return false;
                    }
                } else if (c.dataType == 'date') {
                    if (!validator.isDate1(c.element)) {
                        cv_interact.alert(c.validateText,null,'error');
                        return false;
                    }
                }
                else if (c.dataType == 'positive' || c.dataType == 'number positive') {
                    if (!validator.isPositiveFloat1(c.element)) { 
                        cv_interact.alert(c.validateText,null,'error');
                        return false;
                    }
                }
            } else 
			{
				if (c.dataType == 'date')
				{
					if (!DateHelper.isDate(c.element.val())) c.element.val('0/0/0');
				}
			}

            i += 1;
        } while (c != undefined);

        return true;
    };
    /*
       clearForm() methods clear the given fields, which is an array with the following structure
       var fields = [
        {
          dataMember:'StudentCode',
          dataType:'string'
          element: $('#pmtheader_studentCode');
          validate:true,
          validateText:'Student ID is cannot be empty',
          alwaysReadOnly:false
        },
        ......... 
       ];
   */
    this.clearForm = function (fields) {
        var c, i = 0;
        do {
            c = fields[i];
            if (c == undefined) break;
            if (c.dataType == 'number')
                c.element.val(0);
            else
                c.element.val('');
            var readOnly =c.alwaysReadOnly? true:false; 
            
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
        if (!Number(mValue) || !$.isNumeric(mValue) ) return false;
        //var d = parseFloat(mValue);
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
        //return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        //var d = parseFloat(mValue);
        //if ((d / d) === 1) return true; else return false;
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
        return  DateHelper.isDate(mValue);
        //if (Date.parse(mValue)) return true; else return false;
    };

    //validate email in form of anystring@anystring.anystring
    this.isEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
        /*
         //more sophisticated regex for validating email today
        var re = \A[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@
        (?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\z
        */
    };
    
    this.isPhoneNumber = (d)=>{
        d = d+'';
       let len =d.length;  
       if(len >25) return false;
       for (let i = 0; i <len; i++) {
          if(!$.isNumeric(d.charAt(i))) return false;
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

        //the following code check month by name and by month number (1 to 12)
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
    //////////  The following member functions take element as argument ///////////////////////////////
    this.isNullOrEmpty1 = function (el) {
        var d = el.val(); // String(Sanitizer.sanitizeIn(el.val())).trim();
        if (d =='' || d=='null' ) {
            el.parent().addClass('has-error');
            //el.val('');
            el.focus();
            return true;
        } else {
            el.parent().removeClass('has-error');
        }
    };

    this.isDate1 = function (el) {
       // dateHelper class is defined in Samsethy.js
        if (DateHelper.isDate(el.val()))  {
            el.parent().removeClass('has-error');
            return true;
        }  
        else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };
    this.isEmail1 = function (el) {
        if (this.isEmail(el.val())) {
            el.parent().removeClass('has-error');
            return true;
        }
        else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isPositiveFloat1 = function (el) {
        if (this.isPositiveFloat(el.val())) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };
    this.isPositiveInt1 = function (el) {

        if (this.isPositiveInt(el.val())) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };
    this.isBetween1 = function (el, min, max) {
        var v = el.val(); // Sanitizer.sanitizeIn(el.val());
        if (v >= min && v <= max) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };
    this.atMost1 = function (el, number) {
        var v = el.val(); // Sanitizer.sanitizeIn(el.val());
        if (v <= number) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };
    this.atLeast1 = function (el, number) {
        var v = el.val(); //Sanitizer.sanitizeIn(el.val());
        if (v >= number) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            el.focus();
            return false;
        }
    };

    this.isInteger1 = function (el) {
        var val = el.val(); //Sanitizer.sanitizeIn(el.val());
        if (this.isInteger(val)) {
            el.parent().removeClass('has-error');
            return true;
        } else {
            el.parent().addClass('has-error');
            return false;
        }
    };

    this.isNumber1 = function (el) {
		//Sanitizer.sanitizeIn(el.val())
        if (this.isNumber(el.val()))
        {
            el.parent().removeClass('has-error');
            return true;
        } else 
        {
            el.parent().addClass('has-error');
            return false;
        }
    };
    /* newer version of validation functions */
    this.avoidZero = function (el) {
		//Sanitizer.sanitizeIn(el.val()
        if (parseFloat(el.val()) == 0) {
            el.parent().addClass('has-error');
            el.focus();

            return false;
        } else {
            el.parent().removeClass('has-error');
            return true;
        }
    };
    /*End of newer function of validation functions */

    this.getErrorText = (el,dtype=null)=>{
        let err = el.data('errortext');
        if(!err){
            if(!dtype) dtype = el.data('datatype');
            
            if (dtype=='email') err ='Email is not valid';
            else if (dtype=='phone') err ='Phone mumber is not correct';
            else if (dtype=='name') err ='Name cannot be empty!';
            else if (dtype=='firstname') err ='First Name cannot be empty!';
            else if (dtype=='lastname') err ='Last Name cannot be empty!';
            else if (dtype=='sex') err ='Sex cannot be empty!';
            else if (dtype=='dob' || dtype=='dateofbirth' || dtype=='date_of_birth') err ='Date of birth is not valid!';
            else if (dtype=='start_date' || dtype=='startdate') err ='Start date is required!';
            else if (dtype=='end_date' || dtype=='enddate') err ='End date is required!';
            else {
                let f = el.data('ffield');
                err =`${f?f:'This field'} is required`;
            }
        }

       
        return err;
    }

    this.clearErrors = (div)=>{
        div.find('.data-input').each(function(){
          let el = $(this);
          el.data('error',null);
          let p = el.parent();
          p.find('.error_text').remove();
          p.removeClass('has-error'); 
        });
        div.find('.server-error-text').val(null);
    }

    /**
       //$el i, for example, an Input box with `data-required=1 
       data-min=0 data-max=10 
       data-ffield="Date of birth" 
       data-errortext="error message" 
       data-datatype="phone" `
    **/
   //validate value and return error message
    this.getError = (el)=>{
       let dtype = el.data('datatype');
       switch(dtype){
           case 'email':{
               if(!Validator.isEmail(el.val())) return mThis.getErrorText(el,'email');
               break;
           }
           case 'phone':{
             if(!Validator.isPhoneNumber(el.val())) return mThis.getErrorText(el,'phone');
             break;
           }
           case 'name':{
             if(Validator.isNullOrEmpty(el.val())) return mThis.getErrorText(el,'name');
             break;
           }
           case 'number':{
            if(!$.isNumeric(el.val())) return mThis.getErrorText(el,'number');  
             break;
           }
          
           case 'positive':{
             if(!(el.val() >0)) return mThis.getErrorText(el,'positive');  
             break;
           }
           case 'negative':{
             if(!(el.val()<0)) return mThis.getErrorText(el,dtype);  
             break;
           }
           case 'range':{
             let min = el.data('min');
             let max = el.data('max');
             if(!$.isNumeric(min)) min =0;
             if(!$.isNumeric(max)) max =0;   
             if(el.val() < min || el.val() > max) return mThis.getErrorText(el,dtype);  
             break;
           }
           default:{
             if(Validator.isNullOrEmpty(el.val())) return mThis.getErrorText(el);      
             break;
           }
       }
     }

     //Check input element's value (input text, or Select box) and then highlight if error 
     //parameter @el is html input element (it is jquery object)
     this.checkValue =(el)=>{
            //e.preventDefault();
            let err = mThis.getError(el);
            if(err) 
            { 
                let p = el.parent();
                if(p){
                   let span = p.find('.error_text');
                   if(span.length === 0)
                   {
                      p.append(`<span class="error_text">${err}</span>`);
                      p.addClass('has-error');
                   }
                }
                el.data('error',1);
                
            }
            else
            { 
                let p = el.parent(); 
                let span = p.find('.error_text');
                span.remove(); 
                p.removeClass('has-error');
                el.data('error',null);
            }
        
        }

};
//End of Validator class

window.addEventListener('DOMContentLoaded',(e)=>{

    $(document).find('.data-input').each(function(){
        let el = $(this);
        if(el.data('required')==1){
            el.on('blur',()=>{
                Validator.checkValue(el);
            });
            el.on('change',()=>{
                Validator.checkValue(el);
            });
               
        } 

        
    });        
   
});


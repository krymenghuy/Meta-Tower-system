var DateHelper = new function () {
    var mThis = this;
    //Allowed date formats are dd-mm-yyyy or dd-MMM-yyyy or dd/mm/yyyy or dd.mm.yyyy
    this.isDate = function (text) {
        var dd, mm, yy;
        //turn text into String type
        text = [text, ''].join('');

        //if (text.length > 11) return false; //commented out in order to improve speed. NOTE that string.length is loop through all chars in a string that might cost some performance overhead

		//remove spaces from the @text
        text = text.split(' ').join('');
        var st;
        if (text.indexOf('-') >= 0)
            st = text.split('-');
        else if (text.indexOf('/') >= 0)
            st = text.split('/');
        else if (text.indexOf('.') > 0)
            st = text.split('.');
        else
            return false;

        if (st.length != 3) return false;

        dd = st[0];
        mm = st[1];
        yy = st[2];

        if (!$.isNumeric(dd)) return false;
        if (!$.isNumeric(yy)) return false;

        //validate month
        if ($.isNumeric(mm)) {
            if (mm < 1 || mm > 12)
                return false;
        } else {
            //Check the three letter month name such as Aug, Sep, Oct, etc
            //var months = ['dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov'];
            mm = mThis.getMonthNumber(mm);
            if (parseInt(mm) == 0 || !mm) //invalid month name (three-character name)
                return false;
        }

        //validate Day
        if (dd < 1 || dd > 31)
            return false;
        //To do check if this month (mm) has only 30 days
        if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
            if (dd > 30)
                return false;
        }

        //Check Feb day
        if (mm == 2) {
            if (dd > 29) return false;

            if ((parseInt(yy) % 4) != 0) //indivisible by 4
            {
                if (dd > 28)
                    return false;
            }
        }
        //validate year
        if (yy < 1900)
            return false;

        return true;
    };

    //convert format from dd-mm-yyyy to dd-MMM-yyyy  
    this.formatDate = function (date) {
        date = date.split(' ').join('');
        //also removes empty space from the given date 
        if (!mThis.isDate(date)) return null;
        var st;
        if (date.indexOf('-'))
            st = date.split('-');
        else if (date.indexOf('/'))
            st = date.split('/');
        else if (date.indexOf('.'))
            st = date.split('.');
        else
            return null;

        var mm, dd, yy;
        if ($.isNumeric(st[1])) //if mm = {'Nov','dec','Jan', etc...} 
            mm = mThis.getMonthName(st[1]);
        else
            mm = st[1];

        dd = parseInt(st[0]);
        yy = parseInt(st[2]);

        if (mm < 10) mm = ['0', Number(mm)].join('');
        if (dd < 10) dd = ['0', Number(dd)].join('');
        return [dd, '-', mm, '-', yy].join('');
    };

    //Convert from yyyy-mm-dd to dd-MMM-yyyy. Returns a Friendly format date
    /*For example 2018-12-11 is converted to 11-Dec-2018 */
    /*For example 2018-Aug-11 is converted to 11-Aug-2018 */
    this.format = function (date) {
        if (!date) return null;
        var st = String(date).split('-');
        if (st[0] > 31) /*If the first part,st[0], is greater than 31 than take it as Year and put it last. The middle part is always taken as month (either month Name or month Number) */
            return [st[2], '-', $.isNumeric(st[1]) ? mThis.getMonthName(st[1]) : st[1], '-', st[0]].join('');
        else /* if date is like: 12-Nov-2017 or 12-11-2018. The middle part is always taken as month (either month Name or month Number) */
            return [st[0], '-', $.isNumeric(st[1]) ? mThis.getMonthName(st[1]) : st[1], '-', st[2]].join('');
    };

    // this.getServerDate = function () {
        // return getJsonString('/Services/CommonService.svc', 'ajaxCommonService', 'GetTodayDate', '{}');
    // };

	this.getMonthName = function(month) {
    month = parseInt(month);
    if (month == 1) {
        return 'Jan';
    }
    else if (month == 2) {
        return 'Feb';
    }
    else if (month == 3) {
        return 'Mar';
    }
    else if (month == 4) {
        return 'Apr';
    }
    else if (month == 5) {
        return 'May';
    }
    else if (month == 6) {
        return 'Jun';
    }
    else if (month == 7) {
        return 'Jul';
    }
    else if (month == 8) {
        return 'Aug';
    }
    else if (month == 9) {
        return 'Sep';
    }
    else if (month == 10) {
        return 'Oct';
    }
    else if (month == 11) {
        return 'Nov';
    }
    else if (month == 12) {
        return 'Dec';
    }
  };


  this.getMonthNumber = function(name) {
    
	name = (name+'').toLowerCase();
    if (name == 'jan') {
        return 1;
    }
    else if (name == 'feb') {
        return 2;
    }
    else if (name == 'mar') {
        return 3;
    }
    else if (name == 'apr') {
        return 4;
    }
    else if (name == 'may') {
        return 5;
    }
    else if (name == 'jun') {
        return 6;
    }
    else if (name == 'jul') {
        return 7;
    }
    else if (name =='aug') {
        return 8;
    }
    else if (name == 'sep') {
        return 9;
    }
    else if (name =='oct') {
        return 10;
    }
    else if (name =='nov') {
        return 11;
    }
    else if (name =='dec') {
        return 12;
    }
  };

  
    this.getTodayDate = function () {
        //*** The following code get TodayDate on client machine
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; /* This is sepcial in javascript that month begins from 0 */
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return ( dd + '-' + mThis.getMonthName(mm) + '-' + yyyy);
    };

    /*Returns a date in format from dd-MMM-yyyy to yyyy-mm-dd that is generally acceptable by browswers.
      NOTE that the input @mDate must be dd-MMM-yyyy or dd-MM-yyyy
    */
    this.formatDate_general = function (mDate) {
        var st;
        if (mDate.indexOf('-') >= 0)
            st = mDate.split('-');
        else if (mDate.indexOf('/') >= 0)
            st = mDate.split('/');
        else if (mDate.indexOf(' ') >= 0)
            st = mDate.split(' ');
        else
            return 'invalid date';

        var dd = st[0];
        var mm = st[1];
        var yyyy = st[2];
        if (!$.isNumeric(mm)) mm = mThis.getMonthNumber(mm);

        var retDate = yyyy + '-' + mm + '-' + dd;
        return retDate;
    };
};
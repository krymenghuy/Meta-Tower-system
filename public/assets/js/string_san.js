'use strict'
/*StringSanitizer class */
/* IMPORTANT When updating the array of whiteList characters ==> please also update the escapeHtml() function defined in Scripts/bootstrap-table.js (for URM project) */
let StringSanitizer = new function () {
    let mThis = this;
    this.reverse_char_codes = [
        {"'&U01;'":'-'},
        {'&U02;':'$'},
        {'&U03;':'('},
        {'&U04;':')'},
        {'&U05;':'@'},
        {'&U06;':'/'},
        {'&U07;':'%'},
         {'&U08;':'!'},
         {'&U09;':':'},
         {'&U10;':'\''},
         {'&U11;':'#'},
         {'&U12;':';'},
         {'&U13;':'\\'},
         {'&U14;':'='},
         {'&U16;':'.'},
         {'&U17;':','},
         {'&U18;':'?'},
         {'&U19;':'['},
         {'&U20;':']'},
         {'&U21;':'+'},
         {'&U23;':'&'},
         {'&U24;':';'}
     ];

    //SanitizeOut() = sanitize output for display. itemName = { 'json???','none','image','nodeTag','sessionType','classTime', 'classTimes','classDays','batchName','schoolSession', 'termName','notes'}
    //when itemName ='none' ==> not allowing any special chars
    this.sanitizeOut = (text, itemName, allowedChars) =>{
        //if (typeof text == 'number' || !text) return text; 
        if (!text) return text;
        if ($.isNumeric(text)) return text; //NOTE: $.isNumeric() requires jQuery
        let num = (text+'').replace(',','');
        if ($.isNumeric(num)) return num;

        text = [text, ''].join(''); //Faster way to turn text to String
        let len = text.length;
        let mayBeDate = false;
        if (len >= 10 && len <= 11) mayBeDate = true; //If len between 10 and 11 chars then check if it is a date

        if (mayBeDate === true) {
            //NOTE: DateHelper.isDate() is defined in Samsethy.js file, which is loaded after this file. The reason that there is no error because, sanitizeOut() is called after Samsethy.js has been loaded
            if (DateHelper.isDate(text)) return text;
        }
        let c = undefined, i = 0;

        //IMPORTANT NOTE: allowed characters are - ( ) @ / These characters will be encoded as &U01; &U03; &U04; &U05; &U06;
        //var allowedChars = ['-', '(', ')', '@', '/', '#',':']; // The char # is used in TreeView node tag
        //var encodes = ['&U01;', '&U03;', '&U04;', '&U05;', '&U06;', '&U11;','&U09;'];
        ////var allowedChars;
        let encodes = [];
        if (itemName) {
            allowedChars = []; // convert allowedChars into an array to avoid errors: " Uncaught TypeError: Cannot read property '0' of undefined "
            if (itemName ==='currency' || itemName ==='currency_symbol')
			{
				return text.slice(0,4);
			}
            else if (itemName ==='email')
			{
				//allowedChars = ['.', '@'];
                //encodes = ['&U01;', '&U04;'];
				if (this.isEmail(text)) return text.slice(0,150); 				
			}
             
        } else // if no itemName specified, check allowedChars array if any  
        {
            //check if allowedChars is an array
            // encodes = [];
            if ($.isArray(allowedChars)) {
                i = 0; //reset variable i
                do {
                    c = allowedChars[i];
                    if (!c) break;
                    encodes.push(this.getEncodedChar(c));
                    i++;
                } while (c);

            } else // No itemName and No allowedChars specified, so allowed all special chars that are encoded (for encoded chars, see encoded character list for URM system in documentation)  
            {
                allowedChars = ['-', '(', ')', '#', ':', '@', '/', ';', '=', '.', ',']; // The char # is used in TreeView node tag and batchName
                encodes = ['&U01;', '&U03;', '&U04;', '&U11;', '&U09;', '&U05;', '&U06;', '&U12;', '&U14;', '&U16;', '&U17;'];
            }
        }

        //////***The following code removes allowed chars (that are not encoded) from String (This is in case that hacker intercepts and inject characters that are allowed and specified in allowedChars array)
        //////NOTE: Special case then we allow semicolon ; or & then allowedChars array contains ; and it turn encoded char, for example, from &U12; to &U12 by removing semicolon ; This causes problem then decoding &U12 to equal sign = 
        //////Hacker can intercept and insert special chars ; and & without encoding them
        ////i = 0; //reset variable i
        ////    do {
        ////        c = allowedChars[i];
        ////        if (!c) break;
        ////        if (c != '&' && c != ';') text = text.split(c).join(''); //Replaces bad characters or bad string with empty string 
        ////        i++;
        ////    } while (c);

        let badChars = ['?', '[', ']', '+', '.', ',', '-', '(', ')', '@', '/', '#', ':',
                        "~", "^", "&", "&amp;", "!", "$", "*", ";", "%", "=", "\"", "'", "\\", "<", ">", "&quot;", "&lt;", "&gt;", "&#x27;", "&#x2F;", "&#60;", "&#62;", "&#34;", ".fromCharCode", "{", "}", "[", "]", "?"];

        let st = text.split(''); //Create char array from the input string
        i = 0; //reset variable i
        c = null;

        do {
            c = st[i];
            if (!c) break;

            if (c === '|' && itemName === 'nodeTag') //if there is bar | and the text is TreeView item's nodeTag
            {
                if (st[i + 1] === '|')
                    i = i + 1;
                else
                    st[i] = '';
            }
            else if (c === '|' && itemName != 'nodeTag') {
                if (itemName === 'answerSet')
                    i = i + 1;
                else
                    st[i] = '';

            }
            else if (c === '#' && itemName === 'nodeTag') //if there is hush sign # and the text is TreeView item's nodeTag
            {
                if (st[i + 1] == '#')
                    i = i + 1;
                else
                    st[i] = '';
            }
            else if (c === '#' && itemName != 'nodeTag') {
                i = i + 1; //allow plus sign
            }
            else if (c === '+' && i > 0 && itemName === 'grade') {
                st[i]
            }

            else if (c === '&')   /** Begin checking the encoded chars for example  &U01; is encode for dash - **/ {
                //NOTE: valid encode has 5 characters only. For example  &U01; represents - or &U06; represents /
                if (st[i + 1] === 'U' && st[i + 4] === ';') //It is Capital letter '&U01;'
                {
                    //Replace encoded chars with real char. For example, replace &U01; with -
                    let e = [st[i], st[i + 1], st[i + 2], st[i + 3], st[i + 4]].join('');
                    st[i] = '';
                    st[i + 1] = '';
                    st[i + 2] = '';
                    st[i + 3] = '';
                    let index = encodes.indexOf(e);
                    if (index >= 0) {
                        st[i + 4] = allowedChars[index];
                        badChars.splice(badChars.indexOf(st[i + 4]), 1); //Remove allowed chars from badChars array
                        //alert('encode: ' + e + '    char: ' + st[i+ 4] + '      next i: ' + i);
                    } else
                        st[i + 4] = '';

                    i = i + 4;
                    //if (e) 
                    //{
                    //    alert('encode: ' + e + '    char: ' + st[4] + '      next i: ' + i);

                    //}

                } else st[i] = ''; // if (encodes.indexOf('&') < 0) st[i] = '';

            }
            else if (c === ';') {
                if (encodes.indexOf(';') < 0) st[i] = '';
                //if ((typeof st[i - 1] != 'number' || st[i - 4] != '&')) // && st[i-1]%1 != 0 
                //{
                //    st[i] = '';
                //}
            }
            else if (c === '-') { //part-time full-time
                if (st[i - 4]) {
                    let a = String(st[i - 4]).toLowerCase();
                    let b;
                    if (a === 'p' || a === 'f') //Allow Part-time and Full-time string. Note that 'p' is start of 'Part-time' or 'f' is start of 'Full-time'
                    {
                        a = [st[i - 4], st[i - 3], st[i - 2], st[i - 1]].join(''); //expected to be 'part' or 'full'
                        b = [st[i + 1], st[i + 2], st[i + 3], st[i + 4]].join(''); // expected 'time'
                        if (a && b) {
                            a = a.toLowerCase();
                            if ((a === 'part' || a === 'full') && b.toLowerCase() === 'time') {
                                i = i + 4;
                            }
                        }

                    }
                }

            }
            else if (badChars.indexOf(c) >= 0) {
                st[i] = '';
                //badChars.splice(badChars.indexOf(c), 1); //Remove allowed chars from badChars array
            }
            i++;
        } while (c);
 

        return st.join('');
    };

	this.isEmail = function(email) 
    {
		//var email_length = 150;
        let re = /\S+@\S+\.\S+/;
        //if (email[email_length-1]) email = email.substring(0,email_length-1);
		return re.test(email);
    };
	
    //SanitizeIn() = sanitize input before sending to Server. This does NOT remove allowed charaters that are specified in the allowedChars parameter such as - ( ) @ /
    this.sanitizeIn = function (text, allowedChars) {
        if ($.isNumeric(text) || !text) {
            return text;
        } else if (DateHelper.isDate(text)) {
            return text;
        }
        else {
            text = [text, ''].join(''); //Faster way to turn text to String
            let c = undefined, i = 0;
            //The only problem with this sanitize() is that it replaces case&U01;sensitive characters, but the server method Sanitize() will do repalcement Case-Insensitive 
            let badChars = ["?", "[", "]", "+", ".", ",", "~", "^", "(", ")", "@", "&", "&amp;", "!", "$", "#", "*", ";", "/", "-", "%", "=", "\"", "'", "\\", ":", "<", ">", "&quot;", "&lt;", "&gt;", "&#x27;", "&#x2F;", "&#60;", "&#62;", "&#34;", ".fromCharCode", "{", "}", "[", "]", "?"];

            //** Remove allow chars from badChars array, if there are allowed chars
            if (allowedChars)
                do {
                    c = allowedChars[i];
                    if (!c) break;
                    badChars.splice(badChars.indexOf(c), 1);
                    i++;
                } while (c != undefined);

           
            c = undefined;
            //Reset counter value
            i = 0;
            do {
                c = badChars[i];
                if (!c) break;
                text = text.split(c).join(''); //Replaces bad characters or bad string with empty string 
                i++;
            } while (c != undefined);
            return text;
        }
    };

    //getItemName() checks JSON object's property name and tries to guess some typical property name such as email, currency, start_date, etc and return itemName for method sanitizeOut() to process the string value 
    this.getItemName = (property)=>{
        let itemName = null;
        let prop = (property+'').toLowerCase();
        switch(prop){
          case 'email':{
             itemName ='email';  
             break;
          }
          case 'currency':{
            itemName ='currency';  //allows '$' sign
            break;
          }
          case 'currency_symbol':{
            itemName ='currency';  //allows '$' sign
            break;
          }
          case 'notes':{
            itemName='remarks';
            break;
          }
          case 'remarks':{
            itemName='remarks';
            break;
          }
          case 'description':{
            itemName='remarks';
            break;
          }
             default:{
             break;
          }
        } 
        return itemName;
    }

    //Sanitizes javascript object (or JSON object). NOTE: This method sanitize the first nesting level of object (Not recursively through all nested props), NOT an array of objects
    //sanitizeArray() recursively
    this.sanitizeObject = function (obj,allowedChars,except_props=[]) { 
		if (Array.isArray(obj)) // process Array object = [{pro1,prop2,...}]
		{
			let i=0, myObj;
			do
			{
				myObj = obj[i];
				if (!myObj) break;
				for (let property in myObj) {
				   if (myObj.hasOwnProperty(property)) 
                    //{
                        if (except_props.indexOf(property) ===-1) {
                            if (Array.isArray(myObj[property]))  
                               myObj[property] = this.sanitizeObject(myObj[property]);
                            else myObj[property] = this.sanitizeOut(myObj[property], this.getItemName(property), allowedChars); //NOTE: this.Sanitize() = Sanitize output for display     
                        }  
                                                          
				    //}
              } //end::for loop 

               i++;				
			}while(myObj);
		}
		else //process the non-array object object = {'prop1','prop2',...}
		{
			for (let property in obj) {
              if (obj.hasOwnProperty(property)) 
              {      
                if (except_props.indexOf(property) ===-1) {
                    if (Array.isArray(obj[property])){
                        obj[property] = this.sanitizeObject(obj[property]);
                    }else obj[property] = this.sanitizeOut(obj[property], this.getItemName(property), allowedChars); //NOTE: this.Sanitize() = Sanitize output for display
                }
              }
            }
			
		}
        
        return obj;
    };
 
    //return decoded character
    this.getDecodeChar =  (e)=> {
        // e is encoded char such as &U01;    
        return mThis.reverse_char_codes[e]?mThis.reverse_char_codes[e]:'';
        // if (e === '&U01;')
        //     return '-';
        // else if (e === '&U02;')
        //     return '$';
        // else if (e === '&U03;')
        //     return '(';
        // else if (e === '&U04;')
        //     return ')';
        // else if (e === '&U05;')
        //     return '@';
        // else if (e === '&U06;')
        //     return '/';
        // else if (e === '&U07;')
        //     return '%';
        // else if (e === '&U08;')
        //     return '!';
        // else if (e === '&U09;')
        //     return ':';
        // else if (e === '&U10;')
        //     return '\'';
        // else if (e === '&U11;')
        //     return '#';
        // else if (e === '&U12;')
        //     return ';';
        // else if (e === '&U13;')
        //     return '\\';
        // else if (e === '&U14;')
        //     return '=';
        // else if (e === '&U16;')
        //     return '.';
        // else if (e === '&U17;')
        //     return ',';
        // else if (e === '&U18;')
        //     return '?';
        // else if (e === '&U19;')
        //     return '[';
        // else if (e === '&U20;')
        //     return ']';
        // else if (e === '&U21;')
        //     return '+';
        // else if (e === '&') // encoding &U15;  for &  
        //     return '&';
        // else
        //     return '';
    };

    this.getEncodedChar = function (ch) {
        var chars = ['\'', '"', ']', '[', '?', '+', ',', '.', '-', '(', ')', '#', ':', '/', '=', '\\', '@', '%', '!', '$']; // The char # is used in TreeView node tag and Batch Name
        var encodes = ['&U10;', '&U22;', '&U20', '&U19;', '&U18;', '&U21;', '&U17;', '&U16;', '&U01;', '&U03;', '&U04;', '&U11;', '&U09;', '&U06;', '&U14;', '&U13;', '&U05;', '&U07;', '&U08;', '&U02;'];
        return encodes[chars.indexOf(ch)];
        //c = encodes[chars.indexOf(ch)];
        //return c?c:ch; //If there is no corresponding encoded char ==> allow the char directly. For example. There is no encoding for char $, so just allow $ 
    };

    this.encodeSpecialChars = function (text, chars) {
        var i = 0, c;
        text = [text, ''].join('');
        if (!chars) return text;
        do {
            c = chars[i];
            if (!c) break;
            text.split(c).join(this.getEncodedChar(c));
            i++;
        } while (c);

        return text;
    };

    // this.isClassTime = function (text) {
        // //9:0-1:0
        // text = [text, ''].join('');
        // var len = text.length;
        // if (len < 7 || len > 11) return false;
        // var st = text.split('-');
        // if (st.length == 2) {
            // var timeParts = st[0].split(':');
            // var startHH, startMM
            // //Validate starting time
            // if (timeParts.length == 2) {
                // startHH = timeParts[0];
                // startMM = timeParts[1];
                // //validate starting Hour
                // if (startHH >= 0) {
                    // if (startHH > 23) return false;
                // } else return false;

                // //Validate starting minutes
                // if (startMM >= 0) {
                    // if (startMM > 59) return false;
                // } else return false;

                // //Validate Ending time
                // timeParts = st[1].split(':');
                // if (timeParts.length == 2) {
                    // startHH = timeParts[0];
                    // startMM = timeParts[1];
                    // //validate Ending Hour
                    // if (startHH >= 0) {
                        // if (startHH > 23) return false;
                    // } else return false;

                    // //Validate Ending minutes
                    // if (startMM >= 0) {
                        // if (startMM > 59) return false;
                    // } else return false;

                // } else return false;


            // } else return false;

            // return true;
        // }
    // };

    // this.isClassDays = function (text) {
        // text = [text, ''].join('');
        // if (text.toLowerCase() == 'tba') return true; //TBA = To Be Arranged

        // var dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        // var st = text.split('-');
        // if (st.length == 2) {
            // var x1 = dayNames.indexOf(st[0].toLowerCase());
            // var x2 = dayNames.indexOf(st[1].toLowerCase());
            // if (x1 < x2 && x1 >= 0) return true;
        // } else {
            // st = text.split(',');
            // var i = 0, c;
            // do {
                // c = st[i];
                // if (!c) break;
                // if (dayNames.indexOf(c.toLowerCase()) < 0) return false;
                // i++;
            // } while (c);
        // }

        // return true;
    // };

    /* XXXXXXXXXXXXXXXXXX escape HTML string. For example, replace '<' with '&lt;' XXXXXXXXXXXXXXXXXXX*/
    //// List of HTML entities for escaping.
    //var htmlEscapes = {
    //    '&': '&amp;',
    //    '<': '&lt;',
    //    '>': '&gt;',
    //    '"': '&quot;',
    //    "'": '&#x27;',
    //    '/': '&#x2F;'
    //};

    //// Regex containing the keys listed immediately above.
    //var htmlEscaper = /[&<>"'\/]/g;

    //// Escape a string for HTML interpolation.
    //this.escape = function (string) {
    //    /*replace,for example, replace '<' with '&lt' */
    //    return ('' + string).replace(htmlEscaper, function (match) {
    //        return htmlEscapes[match];
    //    });
    //};
    /*XXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXX*/
};


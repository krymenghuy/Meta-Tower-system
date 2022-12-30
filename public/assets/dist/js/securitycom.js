'use strict'
let __access_token_prop = 'acc_tk_dms'; //document.getElementById('__xsp_tkname').value; use json prop "acc_tk_dms" instead of "access_token"
let __csrfName ='_csrf_115578';
let  __csrfHash;
let _back_home_path ='/'; 
/**NOTE THAT global variable  @__csrfName takes initial value of "_cv_csrf_name" that is the default csrf name in javascript and it must be same as $config['csrf_token_name'] = '_cv_csrf_name' in config.php file of CodeIgniter.
This default value is IMPORTANT in page load slowly or script load slowly causing the variable @__csrfName become undefined when ajax call is made quickly when page load is not yet complete 
 **/
var __def_busy_loader = {};

$(document).ready(function() {
	//NOTE that csrf values stored in hidden fields __xsp_name and __xsp_value are important for first load or first request to server only. Because, most calls are done through ajax (that means no page refresh), so that we javascript variables "__csrfName" and "__csrfHash" will be updated everytime when receiving server resonse, regardless of onError() or onSuccess()     
	__csrfName = document.getElementById('__xsp_name').value;
	__csrfHash = document.getElementById('__xsp_value').value;
	__def_busy_loader = $('#cover-spin');
	//alert('hey name: ' + __csrfName + '   | hash: ' + __csrfHash );
});

function _getCookieValue(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
 
 /* This will apply to all .ajax(), but some times annoying or not needed */
// $.ajaxSetup({
    // // beforeSend:function(){
        // // // show gif here, eg:
        // // __def_busy_loader.show();
    // // },
    // complete:function(){
        // // hide gif here, eg:
        // __def_busy_loader.hide();
    // }
// });



//IMPORTANT NOTE: due to asynchronous nature of callback function, CSRF verification error can occur when, for example, multiple calls to method post_ajax() at same time (concurently) causing the server to return new cookie_value of csrfHash while the some ajax calls are already sent to sever but still in process. In this case, there are error 403 (Forbidden) or action not allowed. 

/**Each response data returned by .ajax call has three main properties: 'data', 'csrfName', 'csrfHash'. 'data' is the user data intended to be returned by user, 'csrfHash' and 'csrfName' are security tokens used to protect agains CSRF attack and is used on every request to server for verification **/
 
function post_ajax(url, param_data = {}, onSuccess, busy_indicator,onFail=null)
  {
	     let cookie_name ='_lms1177055_csrf_name';
		 let tk_cookie_name = 'lms5378_3508zd';  /** there is this name "_da337_csfz1298" specified in loginController.processLogin()  **/
		  // In case that post_ajax is called while page or script not yet completely loaded, in such case, the __csrfHash is still undefined and causes the error 403(action not allowed). Therefore, if __csrfHash == undefined => get its value from cookie instead  
		 //if (!__csrfHash) __csrfHash =_getCookieValue(cookie_name);
		 let  __access_token = _getCookieValue(tk_cookie_name);
	     if (!param_data|| param_data ==undefined ) param_data = {};
         //param_data[__csrfName]  = __csrfHash;
		 param_data[__access_token_prop]  = __access_token;

		  //alert("BEFORE SEND: cookie value: " + _getCookieValue(cookie_name) + " VS header value: " + __csrfHash + "\n" + url);
		 //$.cookie(cookie_name,__csrfHash , { expires: 1 }); //set cookie to be expired in 1 day //requires jquery, but error here
		 //var d = new Date();
		 // document.cookie = cookie_name + __csrfHash+ ";expires=" + d.toUTCString() + ";";
		 
         //alert('securitycom param data: '+ JSON.stringify(param_data) + ' || url: ' + url);
		$.ajax({
			url : url,
			timeout: 0, /*0= never timeout. To minimize chances, if not totally avoid, error of ERR_NETWORK_CHANGED, or ERR_NETWORK_SUSPENDED, etc */
		    type: 'POST', /** |type: 'POST'| is used along with |contentType: "application/x-www-form-urlencoded; charset=utf-8"| , **/
			data: param_data, /* no need to stringify() since it may slow down */
			//async:false, //may cause browser stuck in 'Not Responding' mode if many calls at same time
			dataType:"json", /** released this line causes weird error that the "error" function is fired when transaction succceed, and "success" callback never fired **/
            //contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            headers: {
				  //'X-CSRF-TOKEN':__csrfHash,
				  'X-Requested-With':'XMLHttpRequest'
				  // [__csrfName]:__csrfHash
                 ,//'content-type':'application/json' //relase this contentType causes security error 403 (Forbidden)
				},
		   beforeSend:function(){
				//if (busy_indicator.isEmptyObject()) 
				//if (!busy_indicator) return;
				if (busy_indicator) busy_indicator.show(); 
				else if (busy_indicator!= false && __def_busy_loader.length) 
					__def_busy_loader.show();
			},
			complete:function(){
				// hide gif here, eg:
				//if (!busy_indicator) return;
				if (busy_indicator) busy_indicator.hide(); else { if (__def_busy_loader.length) __def_busy_loader.hide() }; 
			},				
			success : function(response, statusText, jqXHR)
			{   
			
                if (response.csrfName && response.csrfHash)
				{
					__csrfName = response.csrfName;
					//when Success then csrfHash is stored in and sent via response.csrfHash and its value is the same as cookie value _getCookieValue(cookie_name). NOTE that Code igniter automatically update csrfHash in cookie ==> updating global variable __csrfHash can be done in two ways, one is to make it same as cookie value (in this case response.csrfHash is NOT NECESSARY here), the other is to assign it to response.csrfHash.  
					__csrfHash = response.csrfHash; //update global variable __csrfHash via the server response data
					//__csrfHash = _getCookieValue(cookie_name); //update global variable __csrfHash via cookie value
					
				}					
				
				//alert("SUCCESS: cookie value: " + _getCookieValue(cookie_name) + " VS header value: " + __csrfHash + "\n" + url);
				if (response.status =='OK' || response.status =='ok')
				{
					
					//response.data = StringSanitizer.sanitizeObject(response.data);
					
					/** This is the handled errors or validation errors caught and sent from server, so we can handle them and display in specific context, NOT general context **/
                    // var handled_err_status = (response.data)? response.data.status:null;
					// if (handled_err_status=='Error') 
						// cv_interact.alert(response.data.error_message);
                    // else  					
					    onSuccess(response.data);
				} else  //if (response.status =='Error')
				{
					if (response.status_code ==350) {
						window.location.href = _back_home_path;
						return;
					}else if (response.status_code ==360){
                        cv_interact.alert(response.error_message,'','warning'); 
						return;
					}  

					if ((response.error_message+'').indexOf('Authorization failed') >=0) {
						window.location.href = _back_home_path;
					} else 
					{
						if (response.error_message=='' || !response.error_message) 
							response.error_message = 'Please check this method for correctness => ' + url + '\nHint: operation successful but the status is not OK. This usually occurs because the method process_response_json() is not used from server side';
						cv_interact.alert(response.error_message,null,'Error');
					
						if (typeof onFail =='function') onFail(null, 'Error', response.error_message);	
					}						
				}
				 
				
			},
			error:function(jqXHR, statusText, errorThrown)
			{
				//alert("ERROR: cookie value: " + _getCookieValue(cookie_name) + " VS header value: " + __csrfHash + "\n" + url);
				__csrfHash = _getCookieValue(cookie_name);
				if (jqXHR.status ==200 && jqXHR.statusText =='OK') //sometimes successful, but error callback is fired instead of success callback
				{  
					var b;
					if (jqXHR.responseText !='') 
					{
						try{
							b = JSON.parse(jqXHR.responseText);
						} catch(e) {
                             return;
						}
						 
					}
					//This usually happens because of invalid JSON format string returned from Server method. Error is  "Unexpected token..."
					 var err_text = null;
					// if ((errorThrown+'').indexOf('Unexpected token') > 0) 
						// err_text ='This is because returned json data is not valid format';
					 // else if (errorThrown) 
                        // err_text = errorThrown;
                     // else 
                       err_text = jqXHR.responseText;  						 
					onSuccess('weird: status = OK, but Error callback fired => '+ err_text); 
					//cv_interact.alert(jqXHR.responseText);
				} else //status =500 with statusText
				{
					//Wrong CSRF token, so redirect to login page too
					if (jqXHR.status ==403) {
						window.location.href = _back_home_path;
						return;
					}
					  /**  ERR_NETWORK_CHANGED SUSPENDED can happen here **/
					  //alert the error message, this should be placed in log file later 
					  if (jqXHR.statusText && jqXHR.status > 0)
					  {
						if (jqXHR.status ==429) 
						  return; /** encountered error => Too Many Requests attempts **/
						else  
					       cv_interact.alert('There was error in ajax response\n Status: ' + jqXHR.status + '\nStatusText: ' + jqXHR.statusText +'\n' + 'ResponseText: ' + JSON.stringify(jqXHR.responseText));
					  }
					  //console.log('There was error in ajax response\n Status: ' + jqXHR.status + '\nStatusText: ' + jqXHR.statusText +'\n' + 'ResponseText: ' + JSON.stringify(jqXHR.responseText));
					  
					if (typeof onFail =='function') onFail(jqXHR, statusText, errorThrown);	
				}
				
			},
			statusCode:{
				500:function(e) { 
					//For the time being, display internal error of status 500 
					if(e.status ==429) 
					   return; /** status =429 => Error Too Many Requests attempts**/
					else 
					   cv_interact.alert(e.responseText); 
				},
			    403:function(e) {
					window.location.href = _back_home_path;
				},
				429:function(e) {
					 /** 429: Error (Too many requests attemp)**/
					 return;
				} 
			}
	
		});
  };
  
  ///////////////////End of post_ajax///////////////////////////////

  
//####BEGIN::Start of CommonLib common class that contains all commonly used  functions
var CommonLib = new function()
{
	this.addCSRF = (param_data)=>
	{
		   var param_data = {};
		   var cookie_name ='_lms1588_csrfbn35'; 
		  // In case that post_ajax is called while page or script not yet completely loaded, in such case, the __csrfHash is still undefined and causes the error 403(action not allowed). Therefore, if __csrfHash == undefined => get its value from cookie instead  
		  if (!__csrfHash) __csrfHash =_getCookieValue(cookie_name);
		  if (!param_data|| param_data ==undefined ) param_data = {};
		  param_data[__csrfName]  = __csrfHash;
		  return param_data;
	};
	
	//get cookie value by name
	this.getCookieValue =(name)=> {
		 var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		 if (match) return match[2];
	};

	//set cookie value expires in half a way, if not deleted
	this.setCookieValue =(name,value,days=1)=> {
			 var expires = "";
			 if (days) {
				 var date = new Date();
				 date.setTime(date.getTime() + (days*24*60*60*1000));
				 expires = "; expires=" + date.toUTCString();
			 }
				 document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	  }
   
	  //delete cookie by name
	 this.deleteCookie = (name)=> {   
		 document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	 };

	  this.setComboItems = (cb,items,value_prop='id', text_prop='text', add_empty_item=false,first_option_text=null,default_value)=>
	 {
		 if (!cb || cb.length <=0) 
		 {
			   
			 alert('CommonLib.setComboItems() => The Select box object specified is null or invalid');
			 throw 'Select box is NULL or invalid. FYI: value_prop= ' + value_prop + '  text_prop = ' + text_prop + '   items: ' + JSON.stringify(items);
			 return false;
		 }
		 cb.empty();
		 if (!first_option_text) first_option_text ='<All>';
		 if (add_empty_item == true) cb.append($('<option/>').val(0).text(first_option_text));
		  var i=0, c;
				  do{
					  c = items[i];
					  if(!c) break;
					  cb.append($('<option/>').val(c[value_prop]).text(c[text_prop]));
					  i++;
				  }while(c);
				  
				   cb.val(default_value);
				   if (!cb.val()){
						cb.append($('<option/>').val(default_value).text(default_value)).val(default_value);
				   }
				   
		  return true;
	 };
	 
	/** find data in the specified dataStore (usually dataSore object is created locally inside a specific class). Find by specified key_name and key_value then returns the found data, otherwise returns NULL **/	
   this.findData_local = (dataStores, key_value)=>
   {
		   if (!dataStores) return null;
		   var i=0,c ;
		 do{
			 c = dataStores[i];
			 if (!c) break;
			 if (c.key == key_value) return c.value;
			 i++;
		 }while(c);	  
   };
   
   this.setData_local = (dataStores, key_value,data)=>
   {
	   if (!dataStores) return false
		 var x = {};
		  x.key = key_value;
		  x.value = data;
		  dataStores.push(x);
		  return true;
   };
   
	this.isEqual = (x, y)=> {
	   const ok = Object.keys, tx = typeof x, ty = typeof y;
	   return x && y && tx === 'object' && tx === ty ? (
		 ok(x).length === ok(y).length &&
		   ok(x).every(key => this.isEqual(x[key], y[key]))
	   ) : (x === y);
	 };

	   
};
//#### END::END OF CommonLib class

  
  //The following code make sure user can type in only number in the textbox
  $('.integer .decimal').on('keypress keyup blur',function(evt) {
	  
	   var charCode = (evt.which) ? evt.which : evt.keyCode
        if (evt.which == 46)
            return true;
        else
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
        return true;
  });


  function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }

  function get_cookies_array() {

    var cookies = { };

    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }

    return cookies;
   
}
  
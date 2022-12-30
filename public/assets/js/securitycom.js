'use strict';
//let __access_token_prop = 'acc_tk_dms'; //document.getElementById('__xsp_tkname').value; use json prop "acc_tk_dms" instead of "access_token"
let __csrfName ='_csrf_115578';
let  __csrfHash;
let _back_home_path ='/'; 
/**NOTE THAT global variable  @__csrfName takes initial value of "_cv_csrf_name" that is the default csrf name in javascript and it must be same as $config['csrf_token_name'] = '_cv_csrf_name' in config.php file of CodeIgniter.
This default value is IMPORTANT in page load slowly or script load slowly causing the variable @__csrfName become undefined when ajax call is made quickly when page load is not yet complete 
 **/
let __def_busy_loader = {};

$(document).ready(function() {
	//NOTE that csrf values stored in hidden fields __xsp_name and __xsp_value are important for first load or first request to server only. Because, most calls are done through ajax (that means no page refresh), so that we javascript variables "__csrfName" and "__csrfHash" will be updated everytime when receiving server resonse, regardless of onError() or onSuccess()     
	__csrfName = document.getElementById('__xsp_name').value;
	__csrfHash = document.getElementById('__xsp_value').value;
	__def_busy_loader = $('#vs_loader');
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
 
//example function using javascript fetch() function
async function mypost(url = '', data = {}){
	 
   //begin:: read cookie value
	  let cookie_name = 'vsmclinic997891zb';
	  let access_token = null;
	  let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
	  if (c_match) access_token = c_match[2]; 
   //end:: read cookie for access token

     let csrf_token  = $('meta[name="csrf-token"]').attr('content');
 
	    // Default options are marked with *
		const myFetch = await fetch(url, {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					body:data, // body data type must match "Content-Type" header
					headers: {
						//'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization':['Bearer ',access_token].join(''),
						//'Authentication':['token ',access_token].join(''),
						'X-CSRF-TOKEN':csrf_token,
						//'X-Requested-With':'XMLHttpRequest'
						//'Content-Type': 'application/x-www-form-urlencoded',
					},
					redirect: 'follow', // manual, *follow, error
					referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
					
				});
				
				let res = await myFetch.json();
			    //alert(JSON.stringify(res.status_code));
                if (myFetch.ok){
					return new Promise((resolve,reject)=>{
						if (res.status_code ===401){
							//User authentication failed
							window.location.href = '/';	 
						}else if(res.status_code===403){
							//CSRF is not correct
							window.location.href = '/';	 
						}else if (res.status_code===402){
							//Expired token
							window.location.href = '/';
						}else if (res.status_code !=200){
							window.location.href = '/';
						}
						resolve(res);
					});
				}else{
					if(cv_interact) cv_interact.error(res.status); else alert(res.status); 
					return new Promise((resolve,reject)=>{
						reject(myFetch);
					})
				}
  
}

/**Each response data returned by .ajax call has three main properties: 'data', 'csrfName', 'csrfHash'. 'data' is the user data intended to be returned by user, 'csrfHash' and 'csrfName' are security tokens used to protect agains CSRF attack and is used on every request to server for verification **/
function post_ajax(url=null, param_data = {}, onSuccess=null, busy_indicator=null,onFail=null)
  {
	     //begin:: read cookie value
			let cookie_name = 'vsmclinic997891zb';
			let access_token = null;
			let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
			if (c_match) access_token = c_match[2]; 
		 //end:: read cookie for access token 
          
        let csrf_token  = $('meta[name="csrf-token"]').attr('content');
		$.ajax({
			url : url,
			timeout: 0, /*0= never timeout. To minimize chances, if not totally avoid, error of ERR_NETWORK_CHANGED, or ERR_NETWORK_SUSPENDED, etc */
		    type: 'POST', /** |type: 'POST'| is used along with |contentType: "application/x-www-form-urlencoded; charset=utf-8"| , **/
			data: param_data, /* no need to stringify() since it may slow down */
			//async:false, //may cause browser stuck in 'Not Responding' mode if many calls at same time
			dataType:"json", /** released this line causes weird error that the "error" function is fired when transaction succceed, and "success" callback never fired **/
            //contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            headers: {
				  'Authorization':['Bearer ',access_token].join(''),
				  'X-CSRF-TOKEN':csrf_token,
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
				if (response.status_code === 401)
				{
                    //Go to login screen;
					window.location.href = _back_home_path;
				}else
				{
					onSuccess(response);	 
				}	
			},
			error:function(jqXHR, statusText, errorThrown)
			{
				//alert("ERROR: cookie value: " + _getCookieValue(cookie_name) + " VS header value: " + __csrfHash + "\n" + url);
				__csrfHash = _getCookieValue(cookie_name);
				if (jqXHR.status ===200 && jqXHR.statusText ==='OK') //sometimes successful, but error callback is fired instead of success callback
				{  
					let b;
					if (jqXHR.responseText !='') 
					{
						try{
							b = JSON.parse(jqXHR.responseText);
						} catch(e) {
                             return;
						}
						 
					}
					 
				} else //status =500 with statusText
				{
					//Wrong CSRF token, so redirect to login page too
					if (jqXHR.status ===403) {
						window.location.href = _back_home_path;
						return;
					}
					  /**  ERR_NETWORK_CHANGED SUSPENDED can happen here **/
					  //alert the error message, this should be placed in log file later 
					  if (jqXHR.statusText && jqXHR.status > 0)
					  {
						let msg =null
						if (jqXHR.status ===429) 
						  return; /** encountered error => Too Many Requests attempts **/
						else  
						   {
							msg ='There was error in ajax response\n Status: ' + jqXHR.status + '\nStatusText: ' + jqXHR.statusText +'\n' + 'ResponseText: ' + JSON.stringify(jqXHR.responseText);
						   }
					       if(msg) if (cv_interact) cv_interact.alert(msg); else alert(msg);
					  }
					  //console.log('There was error in ajax response\n Status: ' + jqXHR.status + '\nStatusText: ' + jqXHR.statusText +'\n' + 'ResponseText: ' + JSON.stringify(jqXHR.responseText));
					  
					if (typeof onFail ==='function') onFail(jqXHR, statusText, errorThrown);	
				}
				
			},
			statusCode:{
				500:function(e) { 
					//For the time being, display internal error of status 500 
					if(e.status ===429) 
					   return; /** status =429 => Error Too Many Requests attempts**/
					else 
					{
						if (cv_interact) 
						   cv_interact.alert(e.responseText);
						else alert(e.responseText);
					}
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
   
  //The following code make sure user can type in only number in the textbox
  $('.integer .decimal').on('keypress keyup blur',function(evt) {
	  
	   let charCode = (evt.which) ? evt.which : evt.keyCode
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

    let cookies = { };

    if (document.cookie && document.cookie != '') {
        let split = document.cookie.split(';');
        for (let i = 0; i < split.length; i++) {
            let name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }

    return cookies;
   
}
  
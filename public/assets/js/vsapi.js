

"use strict";

//begin window.vsapi
window.vsapi = new function(){
        let mThis = this;
		//Default loader spining class.
		//defaultLoader is javascript node object. document.getElenentById()
		this.defaultLoader=null;

        this.call = async (url = '', data = {},api_method='POST',loader=null) =>{
			api_method =api_method?api_method:'POST';
            if(!url){
				console.error(`Empty url is not processed or fecthed`);
				return;
			}

			if(!mThis.defaultLoader) mThis.defaultLoader = document.getElementById('vs_loader');
			let show_loader = false;
			if(loader===false) show_loader = false;
			else if (!loader){
				loader = this.defaultLoader;
				if(loader) show_loader =true;
			}

			 //begin:: read cookie value
			 let cookie_name = 'vsmclinic997891zb';
			 let access_token = null;
			 let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
			 if (c_match) access_token = c_match[2]; 
		  //end:: read cookie for access token
	   
		   //let csrf_token  = $('meta[name="csrf-token"]').attr('content');
		   if(show_loader) loader.style.display='block';

            // //**begin::try-catch   
			// try{
						// Default options are marked with *
						const myFetch = await fetch(url, {
							method: api_method, // *GET, POST, PUT, DELETE, etc.
							mode: 'cors', // no-cors, *cors, same-origin
							//cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
							//credentials: 'same-origin', // include, *same-origin, omit
							body:JSON.stringify(data), // body data type must match "Content-Type" header
							headers: {
								//'Accept': 'application/json',
								'Content-Type': 'application/json',
								'Authorization':['Bearer ',access_token].join(''),
								//'Authentication':['token ',access_token].join(''),
								//'X-CSRF-TOKEN':csrf_token,
								//'X-Requested-With':'XMLHttpRequest'
								//'Content-Type': 'application/x-www-form-urlencoded',
							}
							//,redirect: 'follow', // manual, *follow, error
							//referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
							
						});
						
					let res = await myFetch.json();
					//alert(myFetch.ok + " | " + JSON.stringify(res.status_code));
					if(!res) return;

					if (myFetch.ok){					    
					switch(Number(res.status_code)){
						case 401:{
							//User authentication failed
							window.location.href = '/';	 
							return;
						}case 402:{
							//Expired token
							window.location.href = '/';
							return;
						}case 403:{
							//CSRF is not correct
							console.error('Error status 403 at url ' + url);
							window.location.href = '/';
							return;
						}
						case 405:{
							//Data Input Validation failed
							console.error('Error status 405: method not allowed at url ' + url);
							break;
						}
						case 500:{
							console.error('Error status 500 at ' + url);
							//Data Input Validation failed
							break;
						}
						default:{
							break;
						}
					}

					return new Promise((resolve,reject)=>{
							if(show_loader) loader.style.display='none';
							resolve(res);
					});

					}else{

						//if(cv_interact) cv_interact.error(JSON.stringify(res)); else alert(JSON.stringify(res));
						alert(JSON.stringify(res));
						return new Promise((resolve,reject)=>{
							reject(res);
						});  
					}

		    // }catch(e){
            //    console.error(`Fecth error at url ${url}`);
			// }
			// //**end:: try-catch
    
        }       
}
//end::window.vsapi

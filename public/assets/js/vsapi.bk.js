

"use strict";
//begin window.vsapi
window.vsapi = new function(){
        let mThis = this;
		//Default loader spining class.
		//defaultLoader is javascript node object. document.getElenentById()
		this.defaultLoader=null;

		function translateToQueryString(params){
			let q = '';
			for (let prop in params) {
				let sp = '';
				if (q) sp = '&';
				//let var_name = prop.replace(/_/g, '');
				let var_name =prop;
				q = [q, sp, var_name, '=', params[prop]].join('');
			}
			return encodeURI(q);
		}

		this.get = async (url, params = null, loader) => {
			if (!mThis.defaultLoader) mThis.defaultLoader = document.getElementById('vs_loader');
			let show_loader = false;
			if (loader === false) show_loader = false;
			else if (!loader) {
			  loader = this.defaultLoader;
			  if (loader) show_loader = true;
			}
			if (show_loader) loader.style.display = 'block';
			const q_string = translateToQueryString(params);
			try {
			  const response = await fetch([url, '?', q_string].join(''));
			  const res = await response.json();
			  if (show_loader) loader.style.display = 'none';
			  return res;
			} catch (error) {
			  console.error(error);
			}
		  }

		  /** behaviorOptions = {'loader': object } */
		  this.post = async (url = '', data = {}, agent=null,loader=false) => {
			if (!url) {
			  console.error(`Empty url is not processed or fetched`);
			  return;
			}
		  
			const defaultLoader = document.getElementById('vs_loader');
			let show_loader = loader === false ? false : (!loader || !loader.length===0 ? false : true);
			const cookie_name = 'vsksm997878za';
			const access_token = document.cookie.split('; ').find(row => row.startsWith(cookie_name)).split('=')[1];
		  
			if (!loader) show_loader = false;
			if(agent) agent.addClass('btn-working');
			if (show_loader) loader.style.display = 'block';
		  
			try {
			  const myFetch = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(data),
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': ['Bearer ', access_token].join('')
				}
			  });
		  
			  if (myFetch.ok) {
				const res = await myFetch.json();
				switch (Number(res.status_code)) {
				  case 401:
					window.location.href = '/';
					break;
				  case 402:
					window.location.href = '/';
					break;
				  case 403:
					console.error('Error status 403 at url ' + url);
					window.location.href = '/';
					break;
				  case 405:
					console.error('Error status 405: method not allowed at url ' + url);
					break;
				  case 500:
					console.error('Error status 500 at ' + url);
					break;
				  default:
					break;
				}
		  
				if (show_loader) loader.style.display = 'none';
				if(agent) agent.removeClass('btn-working');
				return Promise.resolve(res);
			  } else {
				if(agent) agent.removeClass('btn-working');
				alert(JSON.stringify(myFetch));
				return Promise.reject(myFetch);
			  }
			} catch (error) {
			  if(agent) agent.removeClass('btn-working');
			  console.error(`Fetch error at url ${url}. details: ` + error);
			  return Promise.reject(error);
			}
		}

        this.call = async (url = '', data = {},agent=null,loader=null) =>{
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
			 let cookie_name = 'vsksm997878za';
			 let access_token = null;
			 let c_match = document.cookie.match(new RegExp('(^| )' + cookie_name + '=([^;]+)'));
			 if(c_match) access_token = c_match[2];
		  //end:: read cookie for access token
	   
		   //let csrf_token  = $('meta[name="csrf-token"]').attr('content');
		   if(agent) agent.addClass('btn-working');  
		   if(show_loader) loader.style.display='block';
              
            // //**begin::try-catch   
			// try{
						// Default options are marked with *
						const myFetch = await fetch(url, {
							method:'POST', // *GET, POST, PUT, DELETE, etc.
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
							if(agent) agent.removeClass('btn-working');
							if(show_loader) loader.style.display='none';
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
						    if(agent) agent.removeClass('btn-working');   
							if(show_loader) loader.style.display='none';
							resolve(res);
					});

					}else{
						//if(cv_interact) cv_interact.error(JSON.stringify(res)); else alert(JSON.stringify(res));
						alert(JSON.stringify(res));
						return new Promise((resolve,reject)=>{
							if(agent) agent.removeClass('btn-working');
							if(show_loader) loader.style.display='none';
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

"use strict";
  
//####BEGIN::Start of CommonLib common class that contains all commonly used  functions
let VSUtil = new function()
{
	
	  this.base_url = ()=>{
		 //let el = document.querySelector('meta[name="base_url"]');
		 //return el? el.textContent:'';
		 return $('meta[name="base_url"]').attr('content'); 
	  }
	  
	  this.asset_url = ()=>{
		return $('meta[name="asset_url"]').attr('content'); 
		//let el = $('meta[name="asset_url"]');
		//return el? el.content:'';
	  }

	  //IMPORTANT NOTE: there must be the following html block on target bootstrap dialog form:
	  /***
	    <div class="dialog-error">
		   <span class="dialog-error-text"></span>
		</div> 
	  ***/
	 // @param show_time = 5000 (5 seconds) by detault 
	  this.showDialogError =(dialog_id, error_message=null,timeout = 4000)=>{
		 if((error_message+'')==='') return;
		 if(timeout==0 || !timeout) timeout =4000;
         let dialog = document.getElementById(dialog_id);
		 if(dialog) {
			let div = dialog.querySelector('.dialog-error');
			if(div){
				    div.style.display='block';
				    div.classList.add('dialog-error-animation');  
					let span = div.querySelector('.dialog-error-text');
					span.textContent = error_message;
					setTimeout(() => {
						div.classList.remove('dialog-error-animation');
						div.style.display='none';
					}, timeout);
			}
		}
	  }

	  this.hideDialogError =(dialog_id=null)=>{
			if((dialog_id+'')==='') return;
			let dialog = document.getElementById(dialog_id);
			if(dialog){
			  let div = dialog.querySelector('.dialog-error'); 	
			   if(div) {
					div.style.display='none';	
					let span = div.querySelector('.dialog-error-text');
					if(span) span.textContent = null;
			   }
		    }
	  }

	  //Set selected option in Selectt2 by value 
	  this.setSelect2_value=(element_or_id,value=null)=>{
		//select2-_appt_contact_channel-container
		//let el = document.getElementById(element_id);
		//option = {'value':'Telegram','text':"Telegram"};
		if(!element_or_id) return;
  
		let el_id ="";
		let el = null;
		if(typeof element_or_id ==='string')
		  {
			el_id = element_or_id;
		    el = document.getElementById(el_id);
		  }
		else{
		   el_id = element_or_id.getAttribute('id');
		   el = element_or_id;
		}

		if (!el_id) return;
		  
		//IMPORTANT NOTE: in javascript, to access value of data attribute such as "<select data-select2-id="something"></select> => we use " let id = el.dataset.select2Id; "   
		//let select2_container_id = el.dataset.select2Id;
		//if(!select2_container_id) return;
		   if(el){
			// $(el).on('change',(e)=>{
            //    alert('onchange => ' + e.target.getAttribute('id'));
			// });
			  let options = Array.from(el.options);
			//let i=0,c;
			//   let optionToSelect =null;
			//   do{
            //      c = options[i];
			// 	 if(!c) break;
            //          if(c.value == value){
			// 			optionToSelect = c;
			// 			break;
			// 		 }
			// 	 i++;
			//   }while(c);

			  let optionToSelect = options.filter(item=>{
				 return item.value == value;
			  });
			  optionToSelect= optionToSelect?optionToSelect[0]:[];

			  //if (el_id==='_appt_consultant') alert(JSON.stringify(optionToSelect.text));
			   //alert(el_id + ' provided value = ' + value);
			  if(optionToSelect){
				  optionToSelect.selected =true;
				  //alert('===> '+ el_id + ' => Found '+optionToSelect.value?optionToSelect.value:'null' + ' text ='+ optionToSelect.text);
			  }else optionToSelect={};
			  //if (el.dataset.field ==='consultant_id')  optionToSelect.text="GGG";

			  el.value = optionToSelect.value;
			  
			  let sel_span = document.getElementById(`select2-${el_id}-container`);
			  //if(!sel_span) return;
			 
			  //if (el_id==='_appt_consultant') optionToSelect.text =`${el_id} =>TEST DOCTOR DDD`;
			  
			  sel_span.setAttribute('title',optionToSelect.text);
			  sel_span.textContent = optionToSelect.text;
			  //if (el_id === '_appt_contact_channel')
			   //alert(`id = ${el_id} | span text = ${sel_span.textContent}`);
			  
			    //if (el.dataset.field ==='consultant_id')  alert('value = ' + el.selectedIndex + ' text =' + optionToSelect.text);
			    //el.dispatchEvent(new Event('change'));
		     }
	}

	this.addCSRF = (param_data=null)=>
	{
		   if (!param_data) param_data = {};
		   let cookie_name ='_lms1588_csrfbn35'; 
		  // In case that post_ajax is called while page or script not yet completely loaded, in such case, the __csrfHash is still undefined and causes the error 403(action not allowed). Therefore, if __csrfHash == undefined => get its value from cookie instead  
		  if (!__csrfHash) __csrfHash =_getCookieValue(cookie_name);
		  if (!param_data|| param_data ==undefined ) param_data = {};
		  param_data[__csrfName]  = __csrfHash;
		  return param_data;
	};
	
	//get cookie value by name
	this.getCookieValue =(name)=> {
		 let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		 if (match) return match[2];
	};

	//set cookie value expires in half a way, if not deleted
	this.setCookieValue =(name,value,days=1)=> {
			 let expires = "";
			 if (days) {
				 let date = new Date();
				 date.setTime(date.getTime() + (days*24*60*60*1000));
				 expires = "; expires=" + date.toUTCString();
			 }
				 document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	  }
   
	  //delete cookie by name
	 this.deleteCookie = (name)=> {   
		 document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	 };

	 this.treatAsUTC =(date)=> {
		let result = new Date(date);
		result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
		return result;
	}
	 this.daysBetween=(startDate, endDate) =>{
		let millisecondsPerDay = 24 * 60 * 60 * 1000;
		return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
	 }
	 
	 this.setComboItems = (cb=null,items=[],value_prop='id', text_prop='text', add_empty_item=false,first_option_text=null,default_value=null)=>
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
		  let i=0, c;
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
		   let i=0,c ;
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
		 let x = {};
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
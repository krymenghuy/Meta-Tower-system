 'use strict';
 let cv_interact = new function()
 {
	  let mThis = this;
	  //"message_box_default" is default property in km.json file or en.json file for language lookup translation
	  this.default_lang_section ='message_box_default';
	  //default message title, this is usally App name or system name
	  this.default_alert_title ='MClinic';
  
	  //@footer = '<a href="">Why do I have this issue?</a>'
	  this.error = (message,title=null,position='center',onClose=null,footer=null)=>{
		message = LocaleManager.trans(message,mThis.default_lang_section);
		title = LocaleManager.trans(title,mThis.default_lang_section);
		let op = {
			icon: 'error',
			title: title,
			text: message,
			position:"center"
		  };
		  if (position) op.position = position;   
		  if (footer) op.footer = footer;  
		Swal.fire(op).then((result)=>{
		    if(typeof onClose === 'function') onClose(result);	
		});
	  }
	  
	  this.info = (message,title=null,position='center',onClose=null,footer=null)=>{
		message = LocaleManager.trans(message,mThis.default_lang_section);
		title = LocaleManager.trans(title,mThis.default_lang_section);
		let op = {
			icon: 'info',
			title: title,
			text: message,
			position:"center"
	   	   };

		  if (position) op.position = position;
		  if (footer) op.footer = footer;  
		Swal.fire(op).then((result)=>{
		    if(typeof onClose==='function') onClose(result);	
		});
	  }

	  this.success = (message,title=null,position='center',onClose=null,footer=null)=>{
		message = LocaleManager.trans(message,mThis.default_lang_section);
		title = LocaleManager.trans(title,mThis.default_lang_section);
		let op = {
			icon: 'success',
			title: title,
			text: message
		  };
		  op.position ='center';  
		if (position) op.position = position;   
		if (footer) op.footer = footer;  
		Swal.fire(op).then((result)=>{
		    if(typeof onClose==='function') onClose(result);	
		});
	  }
 
	  this.warning = (message,title=null,position='center',onClose=null,footer=null)=>{
		message = LocaleManager.trans(message,mThis.default_lang_section);
		title = LocaleManager.trans(title,mThis.default_lang_section);
		let op = {
			icon: 'warning',
			title: title,
			text: message
		  };
		  op.position ='center';
		  if (position) op.position = position;   
		  if (footer) op.footer = footer;   
		Swal.fire(op).then((result)=>{
		    if(typeof onClose==='function') onClose(result);	
		});
	  }

      //NOTE that alert() and confirm() share the same html and OK button 
	  // @option = {icon ='success','info','error','warning'} 
	  this.alert = (message,title=null, icon=null,position='center',lang_option=null) =>{
             if(!message) return;
			 //By default, translate to current langauge based on LocaleManager.lang
			 if(!lang_option) if(LocaleManager) lang_option = LocaleManager.lang; 
			 if(lang_option){
				message = LocaleManager.trans(message,mThis.default_lang_section);
				if(title) title = LocaleManager.trans(title,mThis.default_lang_section);
			 }
			 Swal.fire({
				position: position?position:'top-end',
				icon: icon, //'success','info','error','warning'
				title:title,
				text: message,
				showConfirmButton: false,
				//reverseButtons: true, /** change Cancel/OK buttons' position **/
				//timer: 1500
			  });		  
	  };
	  

	   //@option = {title,confirmButtonText,cancelButtonText,context=delete|remove|other,translate:true|false,langSection:'message_box_default'}
	   //langSection:'validation' or langSection:'message_box_default', where "validation" is property in file km.json or en.json that contains list of langauge props to be translated 
	  /***
	   cv_interact.confirm('Delete this file?',{'title':"Delete File",'confirmButtonText':'Delete','cancelButtonText':'Close',context:'delete','translate':true,'langSection':'validation'},(yes)=>{
		  if(yes) {
			 //do something here
		  }
	   });  
	  ***/ 
	   this.confirm = (message,option=null,onResult=null)=>{
		    if(!option) option={};
			// if (typeof option ==='function'){
			// 	onResult = option;
			// 	//***if (typeof onResult==='object') option = onResult;
			// }

			let title = option.title?option.title:mThis.default_alert_title;
			let cancel_text = option.cancelButtonText?option.cancelButtonText:'Cancel';
			let ok_text = option.confirmButtonText?option.confirmButtonText:'OK';
			let context = option.context;
			let langSection = option.langSection?option.langSection:mThis.default_lang_section;
            option.translate =option.translate?option.translate:true;

			//set default OK color. For every confirm. But different types of confirm => delete (red), confirm (resore)(green) etc ... 
			let ok_button_color = '#079229';
			let cancel_button_color ='#5B92EC';
			 
			if(ok_text === 'Remove' || ok_text === 'Delete' || context==='delete' || context==='remove' || context==='cancel')
			{
				            ok_button_color ='#ee2a0b';
							cancel_button_color ='#5B92EC';
							if(!ok_text) ok_text ='Remove'; else if (ok_text.toLowerCase() =='ok') ok_text = context==='remove'? 'Remove':'Delete';
							if(!cancel_text) cancel_text = 'Cancel';
							if (option.translate === true) if(ok_text) ok_text = LocaleManager.trans(ok_text,langSection);  
							 
			}else{
				ok_button_color = '#11A767';
				cancel_button_color ='#D6DCCC';
				if(!ok_text) ok_text ='OK';
				if(!cancel_text) cancel_text='Cancel';
			}
           
			if (option.translate===true){
				message = LocaleManager.trans(message,langSection);
				if(cancel_text) cancel_text = LocaleManager.trans(cancel_text,langSection);  
				if(title) title= LocaleManager.trans(title,langSection);
			}
			let op = {
				title: message,
				//text: message,
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor:ok_button_color,
				cancelButtonColor: cancel_button_color,
				confirmButtonText: ok_text,
				cancelButtonText:cancel_text,
				reverseButtons:true
			};  
			Swal.fire(op).then((result) => {
					if(typeof onResult==='function') onResult(result.isConfirmed);
			});

		}

		
		/**
		  behavior_option = {
			translate:true|false
			maxlength:10, 
			autocapitalize:'off',
			autocorrect:'off',
			'showCancelButton':true,
			'confirmButtonText':"OK",
			'cancelButtonText':'Cancel',
			'placeHolder':'enter your password',
			inputValidator:(value)=>{
				if(!value){
					alert('write something');
				}
			}
		 }
		 **/
		 /***
		  Example:
		  let pwd = cv_interact.inputBox('Enter your password','Password','password',null,{
			maxlength:50,
			inputValidator:(value)=>{
				if(!value) alert('password cannot be empty!');
			}
		  }); 

			if(pwd){
		        //do someting with the input of password here		
			}
		 ***/
		//input_type = 'password','email','url','text'. for @behavior_option, please read description above
		this.inputBox = async (message,labelText,input_type ='text',default_value=null,behavior_option={})=>{
			if(!behavior_option) behavior_option = {};
			if(!behavior_option.cancelButtonText) behavior_option.cancelButtonText='Cancel';
			if(!behavior_option.confirmButtonText) behavior_option.confirmButtonText='OK';

			if(behavior_option.translate){
				message = LocaleManager.trans(message,mThis.default_lang_section);
				labelText = LocaleManager.trans(labelText,mThis.default_lang_section);
				if(behavior_option.cancelButtonText) behavior_option.cancelButtonText = LocaleManager.trans(behavior_option.cancelButtonText,mThis.default_lang_section);
				if(behavior_option.confirmButtonText) behavior_option.confirmButtonText = LocaleManager.trans(behavior_option.confirmButtonText,mThis.default_lang_section);
			}
			if (behavior_option.showCancelButton === null || behavior_option.showCancelButton ==undefined) behavior_option.showCancelButton =true;
			const result = await Swal.fire({
				title: message,
				input: input_type,
				inputLabel: labelText,
				inputValue:default_value,
				inputPlaceholder: behavior_option.placeHolder,
				inputAttributes:behavior_option,
				cancelButtonText:behavior_option.cancelButtonText,
				confirmButtonText:behavior_option.confirmButtonText,
				showCancelButton: behavior_option.showCancelButton,
				reverseButtons:true, //make OK button to the right
				'inputValidator': (value) => {
				  if(typeof behavior_option.inputValidator ==='function') return behavior_option.inputValidator(value);
				}
			  });
			  //result = {'value':'some value here'}
			  return result;
		}
 } //close cv_interact class
 
 //});//close $(document).ready(function()) 
 
 //$.noConflict();
 // if $.noConflict() is called => Outside $(document).ready() => Code that uses other library's $ can follow here. $.(something) here is not jquery stuff
'use strict'
var __cvi_dialog = {}; //local storage for dialog ist

var _cvi_htm1205 = [
  '<div class="modal-dialog" role="dialog">',
    '<div class="modal-content">',
      '<div class="modal-header">',
        '<h5 class="modal-title" id="__cvi_alert_title">Message title</h5>',
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">',
        //'<span aria-hidden="true">&times;</span>',
		'</button>',
      '</div>',
      '<div class="modal-body">',
        //'<p id="__cvi_message">Modal body text goes here.</p>',
		'<div id="__cvi_message" style="scroll:vertical;"></div>',
      '</div>',
      '<div class="modal-footer">',
	    '<button type="button" class="btn btn-default" id="__cvi_alert_btnCancel"><i class="fa fa-times"></i> Cancel</button>', 
	    '<button type="button" class="btn btn-primary" id="__cvi_alert_btnOK"><i class="fa fa-check" style="color:#EBEBC2"></i> OK</button>',
      '</div>',
    '</div>',
  '</div>'].join('');
  
  
  var el = document.getElementById('__cvi_alert_dlg');
	if(!el)
	{
		var div = document.createElement('div');
		div.className = 'modal'; // using "modal fade" => the backdrop remains there and users cannot click on anything after the modal closed
		div.id ="__cvi_alert_dlg";
		div.setAttribute('tabindex',-1);
		div.setAttribute('role','dialog');
		div.innerHTML = _cvi_htm1205;
	    document.body.appendChild(div); 
	}
 
 //$(document).ready(function() {
	// Code that uses jQuery's $ can follow here. $.(something) here is recogized as jquery code stuff
	 //the "cv_interact" class is used for interaction with users in terms of alert(), confirm(), prompt(), log(message)
 var cv_interact = new function()
 {
	  var mThis = this;
	  this.default_alert_title ='DMS';
	  this.alert_self = $('#__cvi_alert_dlg');
	  this.alert_title = $('#__cvi_alert_title');
	  this.alert_message = $('#__cvi_message');
	  this.confirm_self = null;
	  this.alert_btnOK = $('#__cvi_alert_btnOK');
	  this.alert_btnCancel = $('#__cvi_alert_btnCancel');
	  this.interactType =''; //interactType = {'alert','confirm','prompt','log','scrrollview'}
	  this.alert_sentiment =''; //sentiment = {'error','warning','info'} //only for alert box
      this.onResult;
      
		this.prepareHTML = function()
		{
			//scale-up-center
			var el = document.getElementById('__cvi_alert_dlg');
			if(!el)
			{
				var div = document.createElement('div');
				div.className = 'modal fade';
				div.id ="__cvi_alert_dlg";
				div.setAttribute('tabindex',-1);
				div.setAttribute('role','dialog');
				div.innerHTML = _cvi_htm1205;
				document.body.appendChild(div);
				 
			}
			
			 // if (typeof jQuery.ui == 'undefined') 
			 // {
				 // alert('cv_interact.alert() failed because there is no jquery-ui.min.js loaded yet');
			 // } else 
			 // {
				 
			 // }
			 
		};	
	  
         mThis.alert_btnOK.off('click').on('click',function(e) {
		    mThis.alert_self.modal('hide');
			   if (mThis.interactType =='confirm')
			  {
				  if (typeof mThis.onResult == 'function')
					  mThis.onResult(true)  
			  }
	       });
	  
	  	mThis.alert_btnCancel.off('click').on('click',function(e) {
		    mThis.alert_self.modal('hide');
			  if (mThis.interactType =='confirm')
			  {
				  if (typeof mThis.onResult == 'function')
					  mThis.onResult(false)  
			  }				  
			  
	     });
	  
    //NOTE that alert() and confirm() share the same html and OK button 	  
	  this.alert = function(message,title, alert_sentiment=null) {
		    //mThis.prepareHTML();
             if(!message) return;
			 // if (typeof jQuery.ui == 'undefined') 
			 // {
				 // alert('cv_interact.alert() failed because there is no jquery-ui.min.js loaded yet');
			 // } 
			 
		       if (!title) title = mThis.default_alert_title;
		       mThis.alert_title.text(title);
			   mThis.alert_message.html(message);
			   //mThis.alert_message.text(message);
			   mThis.alert_btnCancel.hide();
		       mThis.alert_btnOK.text('OK');
        		 
	           mThis.interactType ='alert';
			  //jQuery.noConflict(); //in case jQuery loaded multiple times => bootstrap .modal does not work	
               mThis.alert_self.modal(
               {
                    backdrop:'static',
                    keyboard:false, 
                    //escapeClose:false,
                    closeExisting:false
                    //clickClose:false
               }).on('shown.bs.modal',function(){
				   mThis.alert_self.addClass('scale-up-center');
			   });
			   return false;
		  
	  };
	  
	  //context = {'delete','continue'}
	  this.confirm = function(message,title,onResult,ok_title,cancel_title,context)
	  {     
   	         //mThis.prepareHTML();
		      if (!title) title = mThis.default_alert_title; 
              mThis.alert_title.text(title);
			   mThis.alert_message.text(message);
			   if ((ok_title+'').toLowerCase() =='delete' || (ok_title+'').toLowerCase() =='delete now') context =='delete';
			   else if((ok_title+'').toLowerCase() =='remove') context =='remove';
			   if(context=='delete')
			     {
					mThis.alert_btnOK.removeClass().addClass('btn btn-danger');  
					mThis.alert_btnOK.html(['<i class="fa fa-trash" style="font-size:0.9em;padding-bottom:5px"></i> Delete'].join(''));
				 }
			   else if (context=='remove')
			     {
					mThis.alert_btnOK.removeClass().addClass('btn btn-warning');   
					mThis.alert_btnOK.html(['<i class="fa fa-times"></i> Remove'].join('')); 
				 }
			   else 	  	  
			      {
					mThis.alert_btnOK.removeClass();
					mThis.alert_btnOK.addClass('btn btn-primary');
					if (ok_title) mThis.alert_btnOK.text(ok_title);
				  }

			   if (cancel_title) mThis.alert_btnCancel.html(['<i class="fa fa-times"></i> ', cancel_title].join(''));
			   mThis.alert_btnCancel.show();
			   mThis.onResult = onResult;
			   
			   mThis.interactType ='confirm';
               //jQuery.noConflict(); //in case jQuery loaded multiple times => bootstrap .modal does not work			   
               mThis.alert_self.modal(
               {
                    backdrop:'static',
                    keyboard:false, 
                    //escapeClose:false,
                    closeExisting:false
                    //clickClose:false
               }).on('shown.bs.modal',function(){
				  mThis.alert_self.add('scale-up-center');
			   });
			   return false;
	  };
	  
	//   this.inputBox = function(message, title,input_num,onClose,ok_title,cancel_title){
		  
	//   }
   
 }; //close cv_interact class
 
 //});//close $(document).ready(function()) 
 
 //$.noConflict();
 // if $.noConflict() is called => Outside $(document).ready() => Code that uses other library's $ can follow here. $.(something) here is not jquery stuff
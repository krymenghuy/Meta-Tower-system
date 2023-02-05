/** Dependency: 
 *  FormUntil class requires "vsapi.js" for api call
 *  FormUtil depends on string_san.js for method "StringSanitizer.sanitizeObject()"
 *  FormUtil depends optionally on cv_interact.js for alert message
 *  FormUtil depends  on "vsutl.js" for VUTil.setSelect2_value(), VSUtil.showDialogError(dialog_id,error_text), VSUtil.hideDialogError(dialog_id)
 *  **/
"use strict";
class FormUntil{
   //option = {'formId','apiSave','apiGet',identityProps: [],'titleId','errorId','saveButtonId'}
   // *** "titleId,errorId,saveButtonId" are optional props
   //***  identityProps can be string or array of possible identity props when the dialog form is used in multiple contexts such as updating person profile based on person_id and sometimes based on appointment_id etc. This multiple context means => dialog may take different identity prop names in different situations */

    constructor(option){
      if(!option) option= {};
      this.option = option;
     
      //let form_id = option.formId;
      this.form_id = option.formId; //this.form_id is used in this.setData(@d) 
      this.self = $(`#${this.form_id}`);
      this.me = option.instance;
      this.identity_prop = option.identityProp; //key_field_name
      this.identityProps  = option.identityProps?option.identityProps:[];
      this.itemName = option.itemName;

      this.api_save = option.apiSave;
      this.api_get = option.apiGet;
      this.sanitize_excepts = option.sanitize_excepts?option.sanitize_excepts:[];
      this.use_alert_error = option.use_alert_error;

      this.elTitle = $(`#${this.form_id}_title`);
      this.elError = $(`#${this.form_id}_error`);
      if (option.saveButtonId) 
         this.btnSave = $(`#${option.saveButtonId}`);
      else 
      {
            this.btnSave = $(`#${this.form_id}_btnOK`);
            if (this.btnSave.length ===0 || !this.btnSave)  this.btnSave = $(`#${this.form_id}_btnSave`);
      }
        
      if (option.titleId) this.elTitle = $(`#${option.titleId}`);
      if (option.errorId) this.elError = $(`#${option.errorId}`);
      //*** For non-jquery
      //if (this.elError.length ===0) this.elError = document.querySelector(`#${this.form_id}`).querySelector('.dialog-error>.dialog-error-text');
     
      //*** for jquery */
      if (this.elError.length ===0) this.elError = this.self.find('.dialog-error>.dialog-error-text');
       
      if (this.elTitle.length ===0) console.error(`Error: Missing title element with id "${this.form_id}_title" inside the dialog ${this.form_id}`);
      if (this.elError.length ===0) console.error(`Error: Missing error element with id "${this.form_id}_error" inside the dialog ${this.form_id}`);
      
      option.itemName = option.itemName?option.itemName:"Unknow Item";
      this.createTitle = option.createTitle?option.createTitle:['New ',option.itemName].join('');
      this.modifyTitle = option.modifyTitle?option.modifyTitle:['Modify ',option.itemName].join('');
    
      if (this.elError.length ===0 || !this.elError) this.use_alert_error = true;
      //option.saveButtonId=option.saveButtonId?option.saveButtonId: [this.form_id,'_btnOK'].join('');
       
      // document.querySelector(`#_appt_contact_channel`).addEventListener('change',(e)=>{
      //    alert("Channel ID changed111!");
      // });

      this.btnSave.off('click').on('click',(e)=>{
         e.preventDefault();
         let that = this;
         let d = this.getData();
         if(d.has_error) return;   
         window.vsapi.call(this.api_save,d.data).then(res=>{
               if(res.status_code === 200){
                  if(typeof this.option.onClose === 'function') this.option.onClose(res);
                  this.self.modal('hide');
                  //if (this.option.previousComponent) this.option.previousComponent.show(this.option.previousComponentOptions);
               }else{
                  if (!that.use_alert_error || !cv_interact) 
                  {
                     let x = VSUtil.showDialogError(this.form_id, res.error_message);
                     if(!x) alert(res.error_message);
                  }
                  else cv_interact.error(res.error_message);
               }
         }).catch((e)=>{
             console.error("Error occured at "+ this.api_save);
         }); 
      });
 
      this.self.on('hide.bs.modal',(e)=>{
          if(this.option.previousComponent) this.option.previousComponent.show(this.option.previousComponentOptions); 
      });

      ////formUtl.init = ()={ ...  }
      //this.init = ()=>{
         // write additional or custom init code here
      //}
      if (typeof(this.option.init) ==='function') this.option.init();
    }
  
    isDialog(component=null){
      if(!component) return false;
      if(!component.self) return false;
      return (component.self.find('div.modal-dialog').length > 0);
    }

    //return input data for sending to server api
     getData = ()=>{
        if(!this.self) return null;
        let p = {};
        let err_element = null;
        let ff = null, field =null;
        let has_error =false;
        if (this.identity_prop) p[this.identity_prop] = this.identity_prop_value; // me[this.identity_prop];
        this.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                has_error =true;
                err_element = el;
                ff = el.data('ffield');
                field= f;
                return false;
            }
            p[f] = el.val();
        });
        if(this.option.sub_prop) p[this.option.sub_prop]= this.option.sub_prop_function();  
        if(has_error) return {'element':err_element,'field':field,'ff':ff,'data':null,'has_error':has_error};

        return {'data':p};
     }
     
     //for editing item purpose
     //NOTE: it is assumed that api_get return query results through property "data" or res.data
     getItemDetails(id,onFinish){
       let p ={};
       p[this.identity_prop] = id;
       let that = this;
        window.vsapi.call(this.api_get,p).then((res)=>{
          if(res.status_code ===200){
             let d = StringSanitizer.sanitizeObject(res.data,null,that.sanitize_excepts);
             onFinish(d);
          }else cv_interact.error(res.error_message);
        });
     }

   //   //Set selected option in Selectt2 by value 
   //   setSelect2_value(element_or_id,value){
   //    //select2-_appt_contact_channel-container
   //    //let el = document.getElementById(element_id);
   //    //option = {'value':'Telegram','text':"Telegram"};
   //    if(!element_or_id) return;

   //    let el_id ="";
   //    let el = null;
   //    if(typeof element_or_id ==='string')
   //      {
   //       el = document.getElementById(element_or_id);
   //       el_id = element_or_id;
   //      }
   //    else{
   //       el_id = element_or_id.getAttribute('id');
   //       el = element_or_id;
   //    }
   //    if (!el_id) return;
        
   //    //IMPORTANT NOTE: in javascript, to access value of data attribute such as "<select data-select2-id="something"></select> => we use " let id = el.dataset.select2Id; "   
   //    //let select2_container_id = el.dataset.select2Id;
   //    //if(!select2_container_id) return;
         
   //       if(el){
   //          const options = Array.from(el.options);
   //          let optionToSelect = options.filter(item=>{
   //             return Number(item.value) ===value;
   //          })[0];
             
   //          if(optionToSelect){
   //              optionToSelect.selected = true;
   //          }else optionToSelect={};
   //          //el.dispatchEvent(new Event('change'));

   //          let sel_span = document.querySelector(`#select2-${el_id}-container`);
   //          if(!sel_span) return;
   //          sel_span.setAttribute('title',optionToSelect.text);
   //          sel_span.textContent = optionToSelect.text;
   //       }
        
   //   }

     clearErrorMessages = ()=>{
         document.getElementById(this.form_id).querySelectorAll('.error_text').forEach(el=>{
            if(el) el.remove();
         });
         VSUtil.hideDialogError(this.form_id);
     }

     //additional_props is array = [{name,value},...]
     setData = (d=null,additional_props=null)=>{
        if(!d) d = {};
         if (this.elError) this.elError.text(null);
         if (this.identity_prop) this.me[this.identity_prop] = d[this.identity_prop];
  
         document.getElementById(this.form_id).querySelectorAll('.data-input').forEach(el=>{
            let f = el.dataset.field; // el.getAttribute('field');
            if(el.classList.contains('modal-select2') || el.classList.contains('select2')){
               VSUtil.setSelect2_value(el,d[f]);
               //el.dispatchEvent(new Event('change'));
            }else  el.value = d[f]?d[f]:'';

            //set data-error =0 (No data validation error on first show) attribute of each input or SELECT box
            el.dataset.error = 0;
         });
    
         //set additional special fields in mThis[field_name] = value
         if(additional_props){
            additional_props.map((prop)=>{
                this.me[prop.name] = prop.value;
            });
         }
     }

     clearForm(){
        this.clearErrorMessages();
        this.setData(null);
     }

     currentInstance(){
       return this.me; 
     }

   //picks on identity prop from array this.options.identityProps and then returns it as object {idenityProp, identityValue}
    getIdentityInfo(){
      let i=0,c;
      do{
         c = this.identityProps[i];
         if(!c) break;
           if(this.option[c]) return {identityProp:c, identityValue:this.option[c]};   
         i++;
      }while(c);
      return {'identityProp':this.identity_prop?this.identity_prop:'id',identityValue:null};
    }

     //option = {'item_name':"CO",create_title:"New CO",modify_title:'Modify CO',langSection:"co_form", identity_prop, identity_prop_value:0, "onClose": function(result)=>{ do smething ... }}
     //NOTE: we can use "option.identity_value or option.identity_prop_value| or option.id => they are the same"
     show(option){
       if (!option) option = {};
       //that = this; = this.me

       //this.me.onClose = onClose;
       //option for this.show()

       //begin:: Hide previous component if it is Modal Dialog 
       if(option.previousComponent){
         //Hide previous dialog, if there is previous dialog.
         if(option.previousComponent)
           if(this.isDialog(option.previousComponent)) option.previousComponent.self.modal('hide');  
       }
      //end:: Hide previous component if it is Modal Dialog

       this.option = option;
       this.item_name = option.item_name;

       /** By defult, formUtil uses "id" as identity prop, which is the primary key field name used to update existing record.
        but if the option.identityProp is supplied, formUtil will use that one.
        NOTE: if option.id is nothing or 
        * **/
 
       //if(!option.identity_prop_value) option.identity_prop_value = option.identity_value?option.identity_value:option.id; 
      //if(!this.identity_prop) this.identity_prop = option.identity_prop; 
      
       this.clearForm();
 
       let pk_field = this.getIdentityInfo();
       if (pk_field.identityValue && !pk_field.identityProp){
         console.error(`error: (${this.itemName} Dialog) formUtil.options should have identityProps:['id'] and form ${this.itemName}Dialog option should have property "id":${pk_field.identityValue} that represent array of possible primary fields used to update data. This error occured because method formUtil.getIdentityInfo() returns NULL`);
         alert(`(${this.itemName} Dialog) formUtil.getIdentityInfo() returns NULL. to fixed this issue, please set formUtil options.identityProps: ['id'] form ${this.itemName}Dialog option should have property "id":${pk_field.identityValue}  correctly`); 
       }

       this.identity_prop = pk_field.identityProp;
       this.identity_prop_value = pk_field.identityValue;
        
       if(pk_field.identityValue > 0){
           this.elTitle.text(LocaleManager.trans(this.modifyTitle,'titles'));

           this.getItemDetails(pk_field.identityValue,(d)=>{
              if (typeof this.option.beforeShow ==='function'){
                setTimeout(() => {
                  this.option.beforeShow();
                }, 3000);
              }

              this.setData(d);
              this.self.modal({
                 backdrop:'static'
              });

           });
       }else{
           this.elTitle.text(LocaleManager.trans(this.createTitle,'titles'));
           if (typeof this.option.beforeShow ==='function') this.option.beforeShow();
           this.self.modal({
              backdrop:'static'
           });
       }      
     }
      
}
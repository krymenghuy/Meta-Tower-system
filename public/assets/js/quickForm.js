/**
  QuickForm is a class that helps create new Dialog on the fly with specified fields of input, and Save, Delete functionality.
  Dependencies: 
    1.sweet alert
    2.cv_interact
    3.string-san
    4.validator
    5.formUtls.js 

**/
"use strict";
class QuickForm{
    /**option: {form_id,title,showSaveButton,showDeleteButton,showCancelButton,saveApi,DeleteApi,infoApi,apiBaseUrl,
    fields:[{langSection,label,required:0,friendlyName, name,inputType,dataType:string,cssWidth,cssClass,dataInput:true}]} **/
    constructor(option=null){
      this.option = option?option:{};
      this.self = $(`#${this.option.form_id}`);
      this.me = this;
      
      if (!this.option.cancelButtonText) this.option.cancelButtonText ='Close';
      if (!this.option.saveButtonText) this.option.saveButtonText ='Save';
      if (!this.option.deleteButtonText) this.option.deleteButtonText ='Delete';
      if (!this.langSection_title) this.langSection_title ='titles';
      if (!this.langSection_button) this.langSection_button ='buttons';

      //set default buttons
      if(this.option.showCancelButton !==true && this.option.showCancelButton !==false) this.option.showCancelButton = true;
      this.formUtil = new this.formUtil(this.option.form_id,this);

      this.prepareHtml();
      this.btnCancel = $(`#${this.option.form_id}_btnCancel`);
      this.btnDelete = $(`#${this.option.form_id}_btnDelete`);
      this.btnSave = $(`#${this.option.form_id}_btnSave`);
      this.elTitle = $(`#${this.option.form_id}_title`);
      
      this.btnSave.on('click',(e)=>{
        alert('todo: Save');
        if(typeof this.me.onClose ==='function') this.me.onClose();
        this.self.modal('hide'); 
      });

      this.btnDelete.on('click',(e)=>{
        alert('todo: Delete');
      });

    }
  
    createField(op){
        let langSection = op.langSection;
        let field_name = op.label?op.label:(op.friendlyName?op.friendlyName:op.name); 
        let label = op.label?op.label:(op.friendlyName?op.friendlyName:op.name);
        
        let dataInputClass ="";
        if (op.dataInput) dataInputClass ="data-input";
        let input_html = `<input type="text" data-required="${op.required}" data-type="${op.dataType}" data-field="${op.name}" data-ffield="${op.friendlyName}" class="form-control ${op.cssClass} ${dataInputClass}" id="${op.id}">`;
        if(!op.inputType) op.inputType ='default';

        switch (op.inputType) {
            case 'select2':{
                input_html = `<input data-field="${op.name}" data-type="${op.dataType}" data-ffield="${op.friendlyName}" class="modal-select2 ${op.cssClass} ${dataInputClass}" id="${op.id}">
                </select>`;
                break;
            }
            case 'select':{
                input_html = `<select  data-type="${op.dataType}" data-field="${op.name}" data-ffield="${op.friendlyName}" class="form-control ${op.cssClass} ${dataInputClass}" id="${op.id}">
                </select>`;
                break; 
            }
            case 'number':{
                input_html = `<input type="number"  data-type="${op.dataType}" data-field="${op.name}" data-ffield="${op.friendlyName}" class="form-control ${op.cssClass} ${dataInputClass}" id="${op.id}" data-select="datepicker">`;
                break;
            }
            case 'date':{
                input_html = `<input data-field="${op.name}"  data-type="${op.dataType}" data-ffield="${op.friendlyName}" class="form-control ${op.cssClass} ${dataInputClass}" id="${op.id}" data-select="datepicker">`;
                break;
            }
            default:{
               break;
            } 
        }
        //cssWidth example => " col-lg-6";
       return `<div class="form-group ${op.cssWidth}">
         <span class="simple-label trans-text" data-langprop="${langSection}.${field_name}">${label}</span> 
         <div>${input_html}</div> 
       </div>`;
    }

    createFields_html(){  
      if (!this.option.fields) this.option.fields = [];
      let html = '';
      this.option.fields.map((field,index)=>{
         html = [html,this.createField(field)].join('');
      });
      return html;
    }

    createFormHtml(){
      let cancelButton_hidden ="display:none";
      let deleteButton_hidden ="display:none";
      let saveButton_hidden ="display:none";

      if (this.option.showCancelButton) cancelButton_hidden="";
      if (this.option.showDeleteButton) showDeleteButton="";
      if (this.option.showSaveButton) showSaveButton="";

      return `<div class="modal fade" id="${this.option.form_id}" tabindex="-1" role="dialog" aria-labelledby="${this.option.form_id}" aria-hidden="true">
                <div class="modal-dialog" role="dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title​ trans-text" data-langprop="${this.langSection_title}.${this.option.title}" id="${this.form_id}_title">${this.option.title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row" id="${this.option.form_id}_body">
                                        ${this.createFields_html(this.option.fields)}  
                                        <div>
                                           <span style="margin-left:15px" id="${this.option.form_id}_error" class="text-danger"></span>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button style="${cancelButton_hidden}" type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span class="trans-text" data-langprop="${this.langSection_button}.${this.option.cancelButtonText}">${this.option.cancelButtonText}</span></button>
                                        <button style="${deleteButton_hidden}" type="button" class="btn btn-danger" id="${this.option.form_id}_btnDelete"><i class="fa fa-check"></i><span class="trans-text" data-langprop="${this.langSection_button}.${this.option.deleteButtonText}">${this.option.deleteButtonText}</span></button>
                                        <button style="${saveButton_hidden}" type="button" class="btn btn-primary" id="${this.option.form_id}_btnSave"><i class="fa fa-check"></i><span class="trans-text" data-langprop="${this.langSection_button}.${this.option.saveButtonText}">${this.option.saveButtonText}</span></button>
                                    </div>
                        </div>
                    </div>
                </div>
                </div>`;
                
    }

   prepareHtml(){
      let e = document.getElementById(this.option.form_id);
      if(!e) document.body.append(this.createFormHtml());
   }
   
   show(op =null, onClose = null){
      if(!op) op = {};
      this.onClose = onClose;
      if (op[op.key_field_name] > 0){
          this.elTitle.text('Modify '+ this.option.item_name);
      }else  this.elTitle.text('New '+ this.option.item_name);

      //$(`#${this.form_id}_error`).text(null);
      this.formUtil.clearForm();
      this.self.modal({
        backdrop:"static"
      });
   }
}
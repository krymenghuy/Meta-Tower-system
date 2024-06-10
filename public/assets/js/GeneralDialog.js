"use strict";
/**
 options = {
   fields:[
     name:"account_type_id",
     label:"trans::titles.Account Type",
     dataType:"number",
     type:"select",
     config:{
        account_type_id:{
            data:"account_types", NOTE: if data is a string then it means we use statically defined data, not from api
            valueField:"id",
            textField:"account_type",
            default:1 
        }
     }
   ],
   buttons:[
     {
        label:"",
        icon:"",
        action:"do_somthing",
        cssClass:"",
        click:(instance,  btn, divModal)=>{
        }
     },

   ],
  createFields:()=>{}  NOTE: if use createFields() you must ensure that each field has class "data-input" and has attribute "data-field", do not use "fields"
  prepareFormOptions:{
     createTitle:"Create Account",
     modifyTitle:"Edit Account",
     api:{
        targetProp:"account",
        endpoint:"",
        params:()=>{}
     }
  },
  onInit:()=>{}
  onShow:(instance,fields, divModal)=>{},
  onPrepareForm:(instance,fields,divModal)=>{}
}
*/
class GeneralDialog{
    constructor(options){
        this.dialog_id = "_vs_generalDialog";
        this.options = options || {
           fields:[
               {
                name:"password",
                label:"Password",
                dataType:"password", // dataType = password|string|number|date
                displayType:"password"
               },
               {
                name:"confirm_password",
                label:"Confirm Password",
                dataType:"password", // dataType = password|string|number|date
                displayType:"password",
                // config:{
                //     data:"countries",
                //     valueField:"id",
                //     textField:"country",
                //     default: 13
                // }
               },
           ],
        //    createFields:()=>{
        //      return '<div> ... </div>';
        //    },
           buttons:[
             {
                cssClass:"btn-cancel",
                icon:"",
                dismissModal:true,
                action:"cancel",
                label:"Cancel",
                click:(btn, divModal)=>{}
              },
              {
                cssClass:"btn-save", // or className
                icon:"",
                label:"",
                action:"",
                click:(btn,divModal)=>{}
              }
           ],
        //    selectConfig:{
        //      country_id:{
        //         data:"countries",
        //         valueField:"id",
        //         textField:"country",
        //         default: 13
        //      },
        //      emp_type:{
        //         source:'static',
        //         data:[],
        //         valueField:"emp_type",
        //         textField:"emp_type",
        //         default:"full-time"
        //      }
        //    },
           prepareFormOptions:{
              createTitle:"Create",
              modifyTitle:"Modify",
              api:{
                targetProp:null,
                endpoint: null,
                params:()=>{}
              }
           },
           onClose:(isCanceled) =>{}
        };

        this.divModal = document.getElementById(this.dialog_id);
        if(!this.divModal){
              this.divModal = document.createElement('div');
              this.divModal.className =`modal fade"`;
              this.divModal.setAttribute('id',`${this.dialog_id}`);
              this.divModal.tabIndex =-1;
              this.divModal.ariaLabel =`${this.dialog_id}_title`;
              this.divModal.ariaHidden = true;
      
               const html = `
               <div class="modal-dialog vs-modal-dialog">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" id="${this.dialog_id}_title">Reset Password</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div class="modal-body">
                  </div>
                  <div class="modal-footer">
                     <button type="button" class="btn-cancel btn btn-secondary" data-dismiss="modal">Cancel</button>
                     <button type="button" class="btn-save btn btn-primary">Reset Now</button>
                  </div>
               </div>
               </div>`;
               this.divModal.innerHTML = html ;
            document.body.append(this.divModal);
        } 
       this.modalBody = this.divModal.querySelector('.modal-body'); 
       this.modalFooter = this.divModal.querySelector('.modal-footer'); 
       this.elTitle = this.divModal.querySelector('.modal-title');
       this.renderButtons(this.options.buttons);
       if(typeof this.options.onInit ==='function') this.options.onInit(this,this.divModal);
    }
 
    renderButtons(buttons){
       let html = '';
       let index = 0;
       buttons.map(btn =>{
          let data_dismiss_modal ="";
          if(btn.dismissModal ==true || btn.dismissModal ==1) data_dismiss_modal = ` data-dismiss="modal"`;
          let className = btn.cssClass || btn.className;
          className = className || "btn btn-default";
          html = [html, `<button type="button" class="${className}" data-action="${btn.action || ''}" data-index="${index}" ${data_dismiss_modal}>${btn.icon} ${btn.label || btn.text}</button>`].join('');
          index++;
        });

       this.modalFooter.innerHTML = html;
       const that = this;
       this.modalFooter.addEventListener('click', e=>{
          let btn = e.target.closest('button');
          if(btn){
            that.canceled = (( btn.dataset.action || "").toLowerCase() == "cancel" ) || (btn.dismissModal ==true);
            let idx = btn.dataset.index;
            if(idx >=0){
                let fn = that.options.buttons[idx].click;
                if(fn) fn(that,btn,that.divModal);
            }
           
          }
       });
    }

    renderFields(fields){
       let html = ''; 
       fields.map(field =>{
          let required = (field.required ==true || field.required ==1)? 1:0;
          let xType = (field.dataType || "").toLowerCase();
          xType = xType || (field.type || "").toLowerCase();
          let inputType = xType =="number"? "number":"text";
          if (xType ==="password") inputType ="password";
          else if(xType =='date') inputType ='text';
          if (field.displayType =='select') inputType = 'select';
          let selectClass = 'form-control';
          if (inputType == 'select') selectClass ='modal-select2';
          let inputHtml = [`<div><input type="`,inputType,`" data-type="${field.dataType || field.type}" class="${selectClass} data-input" data-field="${field.name}"  placeholder="`,(field.placeholder || ''),`" data-required="`,required,`">
         </div></div>`].join('');
         
         if(inputType == 'select')
         inputHtml = [`<div><select data-type="${field.dataType || field.type}" class="${selectClass} data-input" data-field="${field.name}" placeholder="`,(field.placeholder || ''),`" data-required="`,required,`"> </select></div> `].join('');
          html = [html,` <div class="form-group">
              <label for="`,field.name,`">`,field.label,`</label>`,inputHtml].join('');
       });

       this.modalBody.innerHTML =[`<form id="${this.dialog_id}_form">`,html,'</form>'].join('');

       this.modalBody.querySelectorAll('.data-input').forEach(el =>{
          let type = el.dataset.type;
          if (type =='date') DateHelper.initDate($(el));
       });
 
    }

    getFields(){
       let fields = {}; 
       this.modalBody.querySelectorAll('.data-input').forEach(el=>{
          let f = el.dataset.field;
          fields[f] = el;
         //  fields.push(field);
       });
       return fields;
    }

    getData(){
       let p = {}; 
       this.modalBody.querySelectorAll('.data-input').forEach(el =>{
           const f = el.dataset.field;
           p[f] = el.value;
       });
       return p;
    }

    setData(d){
        d = d || {};
        this.modalBody.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            if(el.tagName =='SELECT'){
                el.value = d[f] || "";
                el.dispatchEvent(new Event('change'));
            }else if(el.tagName =='IMG'){
                el.setAttribute('src', d[f] || "");
            }else{
                el.value = d[f] || "";
            }
        });
    }
 
    prepreForm(op,onFinish){
       const that = this;  
       let opx = this.options.prepareFormOptions;
       if(!opx || !opx.api){
         if (typeof that.options.onPrepareForm === 'function') that.options.onPrepareForm(that,null,that.getFields(), that.divModal);
         onFinish(null);
         return;
       }
       //op.vsapi = op.vsapi || vsapi;
       let p = null;
       if (typeof opx.api.params ==='function') p = opx.api.params(); 
       else p = opx.api.params || {};
       p = p || {};

       //NOTE: that this.show(options). The $options can have options.id field that is unique ID
       p.id = that.dataOptions.id;
       vsapi.call(opx.api.endpoint,p,null,null,false).then(res =>{
          let d = res.status_code ==200 ? res.data: {};
          let fieldElments = that.getFields();
          that.options.fields.map(field =>{
             let cfg = field.config;
             let el =fieldElments[field.name];
            if(el && cfg && field.displayType =='select'){
                let items = ((typeof cfg.data ==='string' && cfg.data) ? d[cfg.data]: cfg.data);
               VSUtil.setComboItems(el,items, cfg.valueField,cfg.textField,null,null,null );
            }
          })
          if (typeof that.options.onPrepareForm === 'function') that.options.onPrepareForm(that,d,that.getFields(), that.divModal);
          onFinish(d);
       });
    }
  
   show(options){
      const that = this;
      that.canceled = false;

      this.dataOptions = options || {};
      if(this.options.createFields){
         let html = this.options.createFields();
         this.modalBody.innerHTML = html;
      }else that.renderFields(that.options.fields);

      if(typeof that.options.onShow === 'function') that.options.onShow(that.getFields()); 

      this.prepreForm(options,(d)=>{
        let title = that.options.title;
        let prepareOp = that.options.prepareFormOptions;
        if (prepareOp){
            if (prepareOp.api){
                if(prepareOp.targetProp){
                    title = d[prepareOp.targetProp]? prepareOp.modifyTitle: prepareOp.createTitle;
                }
            }else title = that.options.title || prepareOp.createTitle;
                  
        }
        that.elTitle.innerHTML = title;

        that.jm = this.jm || $(that.divModal);
        if(d){
            this.setData(d);
        }
        
        that.jm.off('hide.bs.modal').on('hide.bs.modal',()=>{
            that.options.onClose(that.canceled);
        });

       that.jm.modal({
           backdrop:'static'
        });
      });
   } 
 
 }

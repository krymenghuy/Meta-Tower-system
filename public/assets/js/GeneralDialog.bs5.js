"use strict";
/** dependencies: vsapi.js, jqueryDatePicker2.js, VSUtil, LocaleManager */
/**
 GeneraDialogOptions = {
   title:"Dialog Tile",
   cssClass:"", NOTE: className also possible
   showCancelButton:true,
   fields:[
     name:"account_type_id",
     label:"trans::titles.Account Type",
     dataType:"number",
     displayType:"select", or inputType:"select"
     
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
  configSelect:[
   {
      name:"country_id",
      data:"countries",
      valueField:"country_id",
      textField:"country",
      default:13,
      onChange:(selectElement,value){...}
   },

  ],
  override:{
    getData:(me,fields,divModal)=>{
        ...
        return {new_prop:"111", newOne:"222"};
    },
    setData: ()=>{
       
    }
  },
  extendMethod:{
     getData:(me,divModal)=>{
       ...
       return something more;
     },
     setData:(me,data,divModal)=>{
     }
  }
  prepareFormOptions:{
     createTitle:"Create Account",
     modifyTitle:"Edit Account",
     targetProp:"account",
     api:{
        endpoint:"",
        params:(dataOptions)=>{...} //NOTE: the parameter "dataOption" is the options that is passed from, for example RoleDialog.show(options);
        onResponse:(res)=>{ ...}
     }
  },
  onInit:()=>{}
  onShow:(instance,fields, divModal)=>{},
  onPrepareForm:(instance,data,fields,divModal)=>{}
}
*/
class GeneralDialog{
    //static container_id  = "_xdialog_container1107";
    //static container = null;
    static usedIds = new Set();
    static dialogStore = new Map();

    //Fetch each control element that has "name" attribute, and ensure space is replaced by "_"
    static createControls = (divModal)=>{
        let elements = divModal.querySelectorAll('[name]');
        let controls = {};
        elements.forEach(el =>{
          const name = el.getAttribute('name');
          if(name) controls[name] = el;
        });
        return {
            "controls":controls,
            "controlList":elements
        }
    }

    static createControlList = (divModal)=>{
        return divModal.querySelectorAll('[name]');
    }

    constructor(options){
        this.dialog_id_prefix = "_vsd1188";
      //   if (!GeneralDialog.container){
      //     let xdiv = document.createElement('div');
      //     xdiv.setAttribute('id',GeneralDialog.container_id);
      //     GeneralDialog.container = document.body.appendChild(xdiv);
      //   }

        options = options || {
           backdrop: false,
           keyboard:false,
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
        //    createFields:(dataOptionss)=>{
        //      return '<div> ... </div>';
        //    },
           buttons:[
             {
                cssClass:"btn-cancel btn btn-secondary",
                icon:"",
                dismissModal:true,
                action:"cancel",
                label:"Cancel"
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
              createTitle:"Create It",
              modifyTitle:"Modify It",
              targetProp:null,
              api:{
                endpoint: null,
                params:(dataOptions)=>{},
                //onResponse:(res)=>{}
              }
           },
           onClose:(isCanceled) =>{ return;}
        };
        const that = this;
        options.contentCreated = options.contentCreated || options.afterInit || options.onAfterInit;
        this.options = options;

        if(!this.options.dialogId){
            this.options.dialogId= this._createRandomId();
            //throw "GeneralDialog => options.dialogId cannot be null or empty and it must be unique";
        }
        this.dialog_id = [this.dialog_id_prefix,this.options.dialogId].join('');
        this.divModal = GeneralDialog.dialogStore.get(this.dialog_id);
         //if(this.dialog_id) this.divModal =  GeneralDialog.container.querySelector (`#${this.dialog_id}`);
         //   if(this.dialog_id) 
         //      this.divModal = document.body.querySelector(`#${this.dialog_id}`);
         //   else{
         //     this.dialog_id = this._createRandomId();
         //     this.divModal = null;
         //   }

        let formClassName = options.cssClass || options.className || options.dialogClass;
        formClassName = formClassName || 'vs-modal-dialog'; 

        if(!this.divModal){
              if(GeneralDialog.usedIds.has(this.dialog_id)){
                 throw `GeneralDialog => dialogId "${this.dialog_id}" is already in use.`;
              }  
              this.divModal = document.createElement('div');
              this.divModal.className =`modal fade"`;
              this.divModal.setAttribute('id',`${this.dialog_id}`);
              this.divModal.tabIndex =-1;
              this.divModal.ariaLabel =`${this.dialog_id}_title`;
              this.divModal.ariaHidden = true;
               const html = [`
               <div class="modal-dialog">
               <div class="modal-content">`,
                  `<div class="modal-header">
                     <h5 class="modal-title" id="${this.dialog_id}_title">Reset Password</h5>`,
                  //   (that.options.showCancelButton? '': `<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  //   <span aria-hidden="true">&times;</span>
                  //   </button>`),
                  `</div>`,
                  `<div class="modal-body">
                  </div>
                  <div class="modal-footer">
                     <button type="button" class="btn-cancel btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                     <button type="button" class="btn-save btn btn-primary">Reset Now</button>
                  </div>
               </div>
               </div>`].join('');
               this.divModal.innerHTML = html ;
               document.body.append(this.divModal);
               GeneralDialog.dialogStore.set(this.dialog_id,this.divModal);
               GeneralDialog.usedIds.add(this.dialog_id);
        }
        
       if(formClassName){
         const cls = formClassName.split(' ');
         const div = that.divModal.querySelector('div.modal-dialog'); 
         cls.map(c =>{
             if(c){
               if(!div.classList.contains(c)) div.classList.add(c);  
             }
         }); 
       }

       this.options.createFields = this.options.createFields || this.options.createContent;
      //  if(this.options.showCancelButton){
      //     this.options.buttons = this.options.buttons || {};
      //     this.options.buttons.unshift({ 
      //       cssClass:"btn-cancel btn btn-secondary",
      //       icon:"",
      //       dismissModal:true,
      //       action:"cancel",
      //       label:"Cancel"
      //     });
      //  }

       this.modal = new bootstrap.Modal(this.divModal, { backdrop: this.options.backdrop ?? false,
        keyboard: this.options.keyboard ?? false});

       this.modalBody = this.divModal.querySelector('.modal-body'); 
       this.modalFooter = this.divModal.querySelector('.modal-footer'); 
       this.elTitle = this.divModal.querySelector('.modal-title');
       this.modalTitle = this.elTitle;
       //this.renderButtons(this.options.buttons);
       if(typeof this.options.onInit ==='function') this.options.onInit(this,this.divModal);
       this.override = this.options.override || this.options.overrideMethod || this.options.overrideMethods || {};
       this.extendMethod = this.options.extendMethod || this.options.extendMethods || {};
       this.lnkClose = this.divModal.querySelector('div.modal-header').querySelector('.close');
       if(this.lnkClose){
         this.lnkClose.onclick = e =>{
            e.preventDefault();
             this.canceled = true;
             this.modal.hide();
         };
       }
       //because this._handleShown is passed as a callback to _addEventListener(), so we need to bind context to $this, so that the this.options inside _handleClose() will be working as usual
       this._handleShown = this._handleShown.bind(this);
       this._handleClose = this._handleClose.bind(this);
    }
 
    _handleClose (){
        /*** the following code to remove backdrop is need only when the DIV dialog is render in a parent DIV, and NOT appended directly to document.body */
        // /** Remove backgroup "div.modal-backdrop" from document's body */
        // const backdrop = document.querySelector('.modal-backdrop');
        // if (backdrop) {
        //    backdrop.remove();
        //    //backdrop.parentNode.removeChild(backdrop);
        // }
        if (this.options.onClose) {
           this.options.onClose(this.canceled);
        }
        if(this.canceled === false && this.manualHide === false && this.dataOptions.onClose){
            this.dataOptions.onClose(this.getData());
        }
        if(this.options.onHide) this.options.onHide(this);
      }
    
      //handleOpen handler
      _handleShown() {
        if(this.options.onShow) this.options.onShow(this,this.fields, this.controls,this.divModal);
      }

    _createRandomId() {
      // Helper function to generate a random string
      function generateRandomString(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }
    
      // Main function to create a unique ID
      let id;
      do {
        id = generateRandomString();
      } while (GeneralDialog.usedIds.has(id)); // Check for uniqueness in the Set
       //GeneralDialog.usedIds.add(id); // Add the new unique ID to the Set
      return id;
    }

    renderButtons(buttons){
       let html = '';
       let index = 0;
       buttons.map(btn =>{
          let data_dismiss_modal ="";
          if(btn.dismissModal ==true || btn.dismissModal ==1) data_dismiss_modal = ` data-bs-dismiss="modal"`;
          let className = btn.cssClass || btn.className;
          className = className || "btn btn-default";
          html = [html, `<button type="button" class="${className}" data-action="${btn.action || ''}" data-index="${index}" ${data_dismiss_modal}>${btn.icon || ""} ${btn.label || (btn.text || "")}</button>`].join('');
          index++;
        });

       this.modalFooter.innerHTML = html;
       const that = this;
       this.modalFooter.onclick = e => {
          let btn = e.target.closest('button');
          if(btn){
            const data_dimiss = btn.getAttribute('data-bs-dismiss');
            if(data_dimiss) that.canceled = true;
            else that.canceled = (( btn.dataset.action || "").toLowerCase() == "cancel" ) || (btn.dismissModal ==true);
            let idx = btn.dataset.index;
            if(idx >=0){
                let fn = that.options.buttons[idx]?.click;
                if(fn) fn(that,btn,that.divModal);
            }
           
          }
       };
    }

    //Close Dialog
    hide(success = false, passBackData = null){
      //if(this.options.onClose) this.options.onClose(this.canceled);
      this.canceled = !success;
      if (success && this.dataOptions.onClose){
        passBackData = passBackData || this.getData();
        this.dataOptions.onClose(this.getData(passBackData));
      }
      this.manualHide = true;
      this.modal.hide();
      // this.jm = this.jm || $(this.divModal);
      // this.jm.modal('hide');
    }

    disposeControls(){
        this.fields = null;
        this.controls = null;
        this.controlList = null;
        this.fieldList = null;
    }

    renderFields(fields){
       let html = ''; 
       //dispose previous instances of controls if any  
       this.disposeControls();
       fields.map(field =>{
          let required = (field.required ==true || field.required ==1)? 1:0;
          let xType = (field.dataType || "").toLowerCase();
          xType = xType || (field.type || "").toLowerCase();
          let inputType = field.inputType || field.displayType;
          //inputType = xType =="number"? "number":"text";
          if (xType ==="password") inputType ="password";
          else if(xType =='date') inputType ='text';
          else if (['number','integer','decimal'].indexOf(xType) >=0 && !inputType) inputType ='number';

          let selectClass = 'form-control';
          if (inputType === 'select') selectClass ='modal-select2';
          let inputHtml = [`<div><input type="`,inputType,`" data-type="${field.dataType || field.type}" class="${selectClass} data-input" data-field="${field.name}"  placeholder="`,(field.placeholder || ''),`" data-required="`,required,`">
         </div></div>`].join('');
         
         if(inputType == 'select')
         inputHtml = [`<div><select data-type="${field.dataType || field.type}" class="${selectClass} data-input" data-field="${field.name}" placeholder="`,(field.placeholder || ''),`" data-required="`,required,`"> </select></div> `].join('');
          html = [html,` <div class="form-group">
              <label for="`,field.name,`">`,field.label,`</label>`,inputHtml].join('');
       });

       this.modalBody.innerHTML =[`<form id="${this.dialog_id}_form">`,html,'</form>'].join('');
       if(this.options.contentCreated) this.options.contentCreated(this, this.divModal);
       this.initInputStyle(this.modalBody);
       this.fields = this.getFields();
       this.controls = this.getControls();
    }

    getFields(){
      // if (this.fields && Object.keys(this.fields)[0]) {
      //    return this.fields;
      // }
       let fields = {};
       const elements = this.modalBody.querySelectorAll('.data-input');
       elements.forEach(el=>{
          let f = el.dataset.field;
          if(f){
            fields[f] = el;
          }
       });
       //this.fields = fields;
       this.fieldList = elements;
       return fields;
    }

    getFieldList(){
        return this.modalBody.querySelectorAll('.data-input');
    }

    getData(){
      if (this.override.getData) return this.override.getData(this,this.divModal);
      
      let p = {id: this.dataOptions ? (this.dataOptions.id || '') : null}; 
      const elements = this.modalBody.querySelectorAll('.data-input');
      elements.forEach(el => {
          const d = el.dataset;
           //use dataset.field is not available, use the "name" attribute's value as field_name
           const f = d.field || el.getAttribute('name');
          if (el.tagName ==='IMG'){
            p[f] = el.getAttribute('src');
          }else{
            p[f] = el.value;
          }
      });
      
      if (this.extendMethod.getData){
          const p1 = this.extendMethod.getData(this,this.divModal);
          p = {...p, ...p1};  // Merge properties of p1 into p
      } 
      
      return p;
  }
  
  setData(d){
        d = d || {};
        const that = this;
        if (this.override.setData) return this.override.setData(this,d,this.divModal);
        that.stored_datailed = {};
        this.modalBody.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            if(el.tagName === 'SELECT'){
                el.value = d[f] || ""; //value needs to match with data type exactly "1" is not 1
                el.dispatchEvent(new Event('change'));
                that.stored_datailed[f] = d[f] || "";  
            }else if(el.tagName =='IMG'){
                el.setAttribute('src', d[f] || "");
            }else{
                el.value = d[f] || "";
            }
        });

        if (this.extendMethod.setData) this.extendMethod.setData(this,d,this.divModal);
    }

    //private method to add event handler to a control, by ensuring no duplicate
    _addEventhandler(element,eventName, handler){
      if(!element || !handler) return;
      element.removeEventListener(eventName,handler);
      element.addEventListener(eventName,handler);
    }

    prepareForm(dataOptions, onFinish){
       const that = this;  
       dataOptions= dataOptions ||{};
       let opx = this.options.prepareFormOptions;

      //  if(!that.fields) that.fields = that.getFields();
      //  if(!that.controls) that.controls = that.getControls();
       if(!opx || !opx.api){
          if (!that.options.onPrepareForm){
            onFinish();
            return;
             //throw "If the prepareformOptions.api is not provided, the onPrepareForm() must be an async function";
          } 
          try{
            (async () => {
                await that.options.onPrepareForm(that, null, that.fields, that.divModal);
            })();
          }catch(e){
            const isAsync = that.options.onPrepareForm.constructor.name === 'AsyncFunction';
            if(!isAsync){
               throw "If the prepareformOptions.api is not provided, the onPrepareForm() must be an async function";
            }else throw e;
          }
          onFinish(null);
          return;
        }

       //op.vsapi = op.vsapi || vsapi;
       let p = null;
       if (typeof opx.api.params ==='function') p = opx.api.params(that.dataOptions); 
       else p = opx.api.params || {};
       p = p || {};
       //NOTE: that this.show(options). The $options can have options.id field that is unique ID
       p.id = dataOptions.id;
       vsapi.call(opx.api.endpoint,p,false,false,false).then(res =>{
          if(opx.api.onResponse) opx.api.onResponse(that,res,that.divModal);
          let d = res.status_code ==200 ? res.data: {};
          let fieldElments = that.fields;
          let controls = that.controls;
          let configSelect = that.options.configSelect || that.options.selectConfig;
          if(configSelect){
             try{
               configSelect.map(selectField =>{
                  let el = selectField.name? fieldElments[selectField.name]:null;
                  el = el || controls[selectField.name];
                  if(el && el.tagName ==='SELECT'){
                     let items = [];
                     if(!selectField.depends){
                        items = ((typeof selectField.data ==='string' && selectField.data) ? d[selectField.data]: selectField.data);
                        if(!items || !items[0]){
                         if(selectField.dataProp) items = d[selectField.dataProp];
                        }
                     }
                     
                     let filterData = selectField.filterData || selectField.filter;
                     if(filterData) items = filterData(items,res);

                    let firstOption = selectField.firstOption;
                    if(firstOption){
                      //error may occur when firstOption data structure is no same as each item in the array "items"
                      items.unshift(firstOption);
                    }
                     let def = selectField.defaultValue || selectField.default;
                     def = (typeof def ==='function')? def(that,that.dataOptions) : def;
                              if (selectField.filterOptions){
                                 let fo = selectField.filterOptions;
                                 let triggerByName = fo.triggerBy || fo.parentElement || fo.parentName;
                                 let triggerBy = triggerByName? controls[triggerByName] : null;
                                 if(triggerBy && triggerBy.tagName ==='SELECT'){
                                 triggerBy.addEventListener("change", e=>{
                                       if(fo.filter){
                                       let filter_items = fo.filter(that,(items || []),controls);
                                       let set_value = null;
                                       let field_name = that.controls[selectField.name].dataset.field;
                                       if(that.stored_datailed) set_value = that.stored_datailed[field_name];
                                       if(set_value) def = set_value; 
                                       VSUtil.setComboItems(el,filter_items,(selectField.valueField || "value"),(selectField.textField || "label"),false,null,def);
                                       }
                                 });
                                 } 
                           }else if (selectField.depends){
                              let fo = selectField.depends;
                              let triggerByName = fo.triggerBy || fo.parentElement || fo.parentName;
                              let triggerBy = triggerByName? controls[triggerByName] : null;
                              if(triggerBy && triggerBy.tagName ==='SELECT'){
                                 const onChangehandler = ()=>{
                                          let endpoint = fo.api?.endpoint;
                                          if(endpoint){
                                             let p = (typeof fo.api.params ==='function')? fo.api.params(that,that.dataOptions,controls): fo.api.params;
                                             vsapi.call(endpoint,p,false,false,false).then(res =>{
                                                if(fo.processResponse) 
                                                items = fo.processResponse(res);
                                                else items = res.status_code ==200? res.data:[];
                                                let set_value = null;
                                                let field_name = that.controls[selectField.name].dataset.field;
                                                if(that.stored_datailed) set_value = that.stored_datailed[field_name]; 
                                                if(set_value) def = set_value;
                                                VSUtil.setComboItems(el,items,(selectField.valueField || "value"),(selectField.textField || "label"),false,null,def);
                                             }); 
                                          }
                                 }
                                 that._addEventhandler(triggerBy,'change',onChangehandler);
                              }
                              
                           }else{
                                 let value_field = selectField.valueField || "value";
                                 let text_field = selectField.textField || "label";
                                 if(items && items[0]){
                                    let x = items[0];
                                    //Check if the textField is a function
                                    const textField_is_function = typeof text_field === 'function';
                                    if(x && (!textField_is_function && (!x[text_field]) || !x[value_field])) {
                                            console.error('Select box named "' + selectField.name + '" does not have correct options data. Please ensure that each item option has "value" and "label" or you can set your own names using key "textField" and "valueField" ');
                                    }
                                    
                                   
                                 }else if(!items) {
                                    console.error(`It seems you dont have options or any items provide via the "data" key inside selectConfig: [{name:"select_name", data:"options_item"}]`);
                                 }
                                 const labelField = selectField.textField ?? null;
                                 if (typeof labelField ==='function'){
                                    const items1 = items.map(x => ({ 
                                        "value": x[value_field] ?? '',
                                        "label": labelField(that, x)
                                    }));
                                    VSUtil.setComboItems(el,items1,'value','label',false,null,def);
                                 }
                                 else VSUtil.setComboItems(el,items,value_field,text_field,false,null,def);
                           }

                           if(selectField.onChange){
                              el.addEventListener("change",e =>{
                                 e.preventDefault();
                                 selectField.onChange(that,el,that.divModal);
                              });
                           }
 
                   }   
               });   
             }catch (e){
                console.error(e + ' .hint: make sure configSelect is an array like this [ {name:"select_name",dataProp:"some_key_name"} ]');
             }
          }
          if (typeof that.options.onPrepareForm === 'function') that.options.onPrepareForm(that,d,that.getFields(), that.divModal);
          onFinish(d);
       });
    }
  
   initInputStyle(modalMody){
      modalMody.querySelectorAll('.data-input').forEach(el =>{
         let type = el.dataset.type;
         let inputType = el.tagName.toLowerCase();
         //Use select2 for all SELECT field
         if(inputType ==='select'){
             VSUtil.initSelect(el);
         }
         
         //use jquery DatePicker2 for Date field
         switch (type) {
           case 'date':
            DateTimePicker.init($(el));
              break;
           // case 'dateRange':
           //       DateHelper.initDateRange($(el));
           //       break;
           default:
              break;
         }
           
      });
      if (typeof Validator !== 'undefined') Validator.validatePanel(modalMody);
   }

   hasError() {
      const elements = this.modalBody.querySelectorAll('.data-input[data-required="1"]');
      for (let el of elements) {
          if (el.dataset.error === '1' || el.dataset.error === 'true') {
              return true;
          }
      }
      return false;
  }

  errorCount() {
   const elements = this.modalBody.querySelectorAll('.data-input[data-required="1"]');
   let errCount = 0;
   for (let el of elements) {
       if (el.dataset.error === '1' || el.dataset.error === 'true') {
          errCount++;
       }
   }
   return errCount;
 }
   
   getControls(){
      let p = GeneralDialog.createControls(this.divModal);
      this.controlList = p.controlList;
      return p.controls;
      //   this.controls = this.controls || GeneralDialog.createControls(that.divModal); 
      //   return  this.controls;
   }

   getControlList(){
     return GeneralDialog.createControlList(this.divModal);
   }
   _renderCloseButton(){
      const that = this;
      let header = this.divModal.querySelector('.modal-header');
      let footer = this.divModal.querySelector('.modal-footer');
      if (this.options.showCancelButton){
         header?.querySelector('.close')?.remove(); 
         let btn = footer.querySelector('[data-bs-dismiss]');
         if(!btn){
             btn = document.createElement('button');
             btn.className = 'btn btn-default';
             btn.setAttribute('data-bs-dismiss','modal');
             btn.innerHTML = '<span vslang="buttons.Cancel">Cancel</span>';
             footer.insertBefore(btn, footer.firstChild);
         }
         if(btn) btn.onclick = e =>{
            that.modal.hide();
         }
      }else{
        footer.querySelector('[data-bs-dismiss]')?.remove();
        let btn = header?.querySelector('.close');
        if(!btn){
           let closeButton = `<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">&times;</span>
           </button>`;
           header.insertAdjacentHTML("beforeend",closeButton);
           let btn = header.querySelector('button.close');
           btn.onclick = e =>{
              that.canceled = true;
              that.modal.hide();
           }
        }
      }
   }
   
   show(options){
      const that = this;
      that.canceled = true;
      this.manualHide = false;

      this.dataOptions = options || {};
      //console.log('html rendered = ',this.htmlRendered);
      if(!this.htmlRendered){
        const createContents = this.options.createContents || this.options.createContent || this.options.createFields; 
        if(createContents){
            this.disposeControls();
            let html = createContents();
            this.modalBody.innerHTML = html;
            this.initInputStyle(this.modalBody);
            this.fields = this.getFields();
            this.controls = this.getControls();
            if(this.options.contentCreated) this.options.contentCreated(this, this.divModal);
         }else that.renderFields(that.options.fields);
         this.htmlRendered = true;
      } 
     
       //Create controls array as object. It is associative array or object that represents each control element such as DIV, input, select, label etc...
       let p1 = GeneralDialog.createControls(that.divModal);
       that.controls = p1.controls;;
       that.fields = that.getFields();
       
      this.renderButtons(that.options.buttons);
      this._renderCloseButton();
 
      this.prepareForm(options,(d)=>{
        let title = that.options.title;
        let prepareOp = that.options.prepareFormOptions;
        let targetProp =null;
        if (prepareOp){
            if (prepareOp.api){
                targetProp = prepareOp.targetProp || prepareOp.api.targetProp;
                if(targetProp){
                    title = d[targetProp]? prepareOp.modifyTitle: prepareOp.createTitle;
                }
                //IMPORTANT NOTE: dataOptions.id is the fixed name key as "id" for GeneralDialog to check to see if it is Modify or Create intention
                if( (options?.id) && !d[targetProp]){
                    console.error('It seems the issue with API return incorrect json format. The key "data" is missing. Exapected format is {status_code, error_message, data: {} }');  
                } 
            }else title = that.options.title || prepareOp.createTitle;
                  
        }

        that.elTitle.innerHTML = title;
        if(this.options.prepareFormOptions) this.setData(targetProp? d[targetProp]:null);
      
        that._addEventhandler(that.divModal, 'hide.bs.modal',this._handleClose);
        that._addEventhandler(that.divModal,'shown.bs.modal',this._handleShown);
        that.modal.show();
      });
   }

 }
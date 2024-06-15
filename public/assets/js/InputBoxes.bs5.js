/** inputBox using bootstrap 5.3 */
'use strict';
const InputBox1 = new function(){
  const mThis = this;
  //this.self = $('#_dlgInputBox1');
  this.label = "Enter value";
  this.allowBlankValue = false;
  this.manualClosing = false;
 
  //begin::inputBox1.init()
  this.init = () => {
    if (mThis.initAlready) return;
    if (!mThis.self) mThis.self = main_view.appContent.children('#_dlgInputBox1')[0];
    
    if(!mThis.self){
      main_view.appContent[0].insertAdjacentHTML('beforeend',`<div class="modal fade" id="_dlgInputBox1" tabindex="-1" role="dialog" aria-labelledby="_dlgInputBox1Title" aria-hidden="true">
        <div class="modal-dialog vs-modal-dialog" role="dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="_dlgInputBox1Title">Title</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="_inputbox1_value" class="col-form-label" id="_inputbox1_label" >Label</label>
                <input type="text" class="form-control" id="_inputbox1_input">
              </div>
              <div>
                <span id="_inputbox1_error" class="error_text"></span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-default height" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary height" id="_inputbox1_btnOK">OK</button>
            </div>
          </div>
        </div>
      </div>`);
      }
    mThis.self = main_view.appContent.children('#_dlgInputBox1')[0];
    this.modal = new bootstrap.Modal(this.self);
    const v = mThis.self;
    //mThis.modalBody = v.querySelector('div.modal-body');
    mThis.elData = v.querySelector('#_inputbox1_input');
    mThis.btnOK = v.querySelector('#_inputbox1_btnOK');
    mThis.lblTitle = v.querySelector('.modal-title');
    mThis.lblLabel = v.querySelector('#_inputbox1_label');  
    this.elError = v.querySelector('#_inputbox1_error');

    this.elData.addEventListener('keyup',e=>{
       if(e.key === "Enter") mThis.btnOK.dispatchEvent(new Event('click'));
    });
  
    this.btnOK.onclick = (e)=>{
        e.preventDefault();
        let d = mThis.elData.value;
        if(!mThis.allowBlankValue) {
            if(!mThis.elData.value) {
              let text = mThis.blankErrorMessage? mThis.blankErrorMessage:'Cannot accept blank value';
              mThis.elError.innerHTML =  LocaleManager? LocaleManager.trans(text,'titles') :text;
              return;
            }
        }
       if (typeof mThis.onClose =='function') mThis.onClose(d);
       if (!mThis.manualClosing) mThis.self.modal('hide');
    };   
    
    mThis.self.addEventListener('show.bs.modal',function(){
      mThis.elData.value =  mThis.def_value;
    });

    mThis.self.addEventListener('shown.bs.modal',function(){
      mThis.elData.focus();
      mThis.elData.select();
    });
    mThis.self.addEventListener('hide.bs.modal',function(){
      if(mThis.previousDialog) mThis.previousDialog.modal('show');
   });

   mThis.initAlready = true;
  }
  //end:: InputBox1.init();

 
  this.close = ()=>{
    mThis.modal.hide();
  }

  this.show = function(option,onClose){
      mThis.init();
      mThis.elError.innerHTML = '';
      if(option){
          mThis.title = option.title;
          mThis.manualClosing = (option.manualClosing?option.manualClosing:false);

          if(option.defaultValue)
            mThis.def_value = option.defaultValue;
          else
            mThis.def_value = option.def_value;

         if(option.label)
           mThis.label = option.label;
         else if (option.dataLabel)
           mThis.label = option.dataLabel;

           mThis.previousDialog = option.previousDialog;
           if(option.allowBlankValue ===undefined) option.allowBlankValue =false;
           mThis.allowBlankValue = option.allowBlankValue;
           if(option.valueMember) mThis.valueMember = option.valueMember;
           if(option.textMember) mThis.textMember = option.textMember;
           mThis.blankErrorMessage = option.blankErrorMessage? option.blankErrorMessage: option.errorMessage;
           mThis.data = option.data;

           if (option.btnOKText) mThis.btnOK.innerHTML= [`<span class="trans-text" data-langprop="buttons.`,option.btnOKText,`">`,option.btnOKText,`</span>`].join('');
      }
       mThis.onClose = onClose;

      mThis.lblTitle.innerHTML =  option.title;
      mThis.lblLabel.innerHTML = mThis.label;
      mThis.elData.value = mThis.def_value;

      if(mThis.previousDialog) mThis.previousDialog.hide();
      this.modal.show();
  }
}

const InputBox2 = new function(){
  const mThis = this;
  this.label = "Enter value";
  //this.allowBlankValue = false;
  this.options = { autoClose: true, allowBlankValue:false};
  
  //begin::InputBox2.init() 
   this.init = () =>{
    if (mThis.initAlready) return;
    if (!mThis.self) mThis.self = main_view.appContent.children('#_dlgInputBox2')[0];
    if(!mThis.self){
      main_view.appContent[0].insertAdjacentHTML('beforeend',`<div class="modal fade" id="_dlgInputBox2" tabindex="-1" role="dialog" aria-labelledby="_dlgInputBox2Title" aria-hidden="true">
      <div class="modal-dialog vs-modal-dialog" role="dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="_dlgInputBox2Title">Title</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="_inputbox2_value" class="col-form-label" id="_inputbox2_label">Label</label>
              <select class="form-control modal-select2" id="_inputbox2_select"></select>
            </div>
            <div>
              <span id="_inputbox2_error" class="error_text"></span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-default height" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary height" id="_inputbox2_btnOK"><span class="trans-text" data-langprop="buttons.OK">OK</span></button>
          </div>
        </div>
      </div>
    </div>`);
      }

    mThis.self = main_view.appContent.children('#_dlgInputBox2')[0];
    mThis.modal = new bootstrap.Modal(mThis.self);
    const v = mThis.self;
    mThis.elData = v.querySelector('#_inputbox2_select');
    mThis.btnOK = v.querySelector('#_inputbox2_btnOK');
    mThis.lblTitle =v.querySelector('.modal-title');
    mThis.lblLabel =v.querySelector('#_inputbox2_label');
    this.elError = v.querySelector('#_inputbox2_error');
    this.elData.addEventListener('keyup',e=>{
      if(e.key ==="Enter") mThis.btnOK.trigger('click');
    });
  
    this.btnOK.onclick = e => {
        e.preventDefault();
        let d = mThis.elData.value;
        let op_item =  mThis.elData.options[mThis.elData.selectedIndex];
        let d_name =op_item? op_item.text:'';
        let retData = {value:d,text:d_name};
        if(!d) retData = null;
        if((mThis.options.allowBlankValue || '').trim() =='') {
            if(!mThis.elData.value) {
              let text = mThis.blankErrorMessage?mThis.blankErrorMessage:'Cannot accept blank value';
              mThis.elError.innerHTML = LocaleManager? LocaleManager.trans(text,'titles') :text;
              return;
            }
        }
       if (typeof mThis.onClose ==='function') mThis.onClose(retData, mThis.btnOK);
       if(mThis.options.autoClose) mThis.self.modal('hide');
    };

    mThis.self.addEventListener('show.bs.modal',function(){
      mThis.elData.value =  mThis.def_value;
      mThis.elData.dispatchEvent(new Event('change'));
    });

    mThis.self.addEventListener('shown.bs.modal',function(){
      mThis.elData.focus();
    });

    mThis.self.addEventListener('hide.bs.modal',function(){
       if(mThis.previousDialog) mThis.previousDialog.modal('show');
    });
    
    mThis.initAlready =true;
  }
  //end::InputBox2.init() 
 
  this.close = ()=>{
     mThis.modal.hide();
  }
  this.show = (option,onClose)=>{
       mThis.init(); //init() is run only once
       mThis.options = option || {};
       mThis.elError.innerHTML = '';
      if(option){
          mThis.title = option.title;
          if(option.defaultValue)
            mThis.def_value = option.defaultValue;
          else
            mThis.def_value = option.def_value;

         mThis.previousDialog = option.previousDialog;
         if(option.label)
           mThis.label = option.label;
         else if (option.dataLabel)
           mThis.label = option.dataLabel;

           //if(option.allowBlankValue)
           //mThis.allowBlankValue = option.allowBlankValue;
           if(option.valueMember) mThis.valueMember = option.valueMember;
           if(option.textMember) mThis.textMember = option.textMember;
           if(option.blankErrorMessage) mThis.blankErrorMessage = option.blankErrorMessage;
           mThis.data = option.data;
           option.confirmButtonText = option.confirmButtonText || option.OKButtonText; 
           if (option.confirmButtonText) mThis.btnOK.innerHTML = [`<span class="trans-text" data-langprop="buttons."`,option.confirmButtonText,`">`,option.confirmButtonText,`</span>`].join('');
      }
       mThis.onClose = onClose;

      mThis.lblTitle.innerHTML =  option.title;
      mThis.lblLabel.innerHTML =  mThis.label;
      if(mThis.data) {
          let i =0, c = null;
          let value="id", text ="name";
          if(mThis.valueMember) value = mThis.valueMember;
          if(mThis.textMember) text = mThis.textMember;
          mThis.elData.innerHTML = '';
          while ((c = mThis.data[i])) {
            mThis.elData.appendChild(new Option(c[text],c[value]));
            i++;
          }
          $(mThis.elData).select2();
      }

      if(mThis.previousDialog) mThis.previousDialog.modal('hide');
      mThis.modal.show();
      
  }
}

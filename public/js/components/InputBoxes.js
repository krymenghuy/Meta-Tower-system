/** 
    - This file required html codes as bootstrap dialogs for inputBox1, InputBox2
    - This script files must run after the html codes or its corresponding DOM objects have been rendered by browser  
**/
'use strict';
//begin::InputBox1 (User type in one value)
let InputBox1 = new function () {
  let mThis = this;
  this.self = $('#_dlgInputBox1');
  this.elData = $('#_inputbox1_input');
  this.btnOK = $('#_inputbox1_btnOK');
  this.lblTitle = $('#_dlgInputBox1Title');
  this.lblLabel = $('#_inputbox1_label');
  this.label = "Enter value";
  this.allowBlankValue = false;
  this.manualClosing = false;

  this.elError = $('#_inputbox1_error');

  this.elData.on('keyup', (e) => {
    if (e.keyCode === 13) mThis.btnOK.trigger('click');
  });

  this.btnOK.on('click', function (e) {
    e.preventDefault();
    let d = mThis.elData.val();
    if (!mThis.allowBlankValue) {
      if (!mThis.elData.val()) {
        mThis.elError.html(mThis.blankErrorMessage ? mThis.blankErrorMessage : 'Cannot accept blank value');
        return;
      }
    }
    if (typeof mThis.onClose == 'function') mThis.onClose(d);
    if (!mThis.manualClosing) mThis.self.modal('hide');
  });

  this.close = () => {
    mThis.self.modal('hide');
  }

  //option = {title,def_value,dataLabel,btnOKText,btnCancelText,allowBlankValue =false,blankErrorMessage,'previousDialog','manualClosing':false}
  this.show = function (option, onClose) {
    //option.manualClosing = false (by default) 
    mThis.elError.html(null);
    if (option) {
      mThis.title = option.title;
      mThis.manualClosing = (option.manualClosing ? option.manualClosing : false);

      if (option.defaultValue)
        mThis.def_value = option.defaultValue;
      else
        mThis.def_value = option.def_value;

      if (option.label)
        mThis.label = option.label;
      else if (option.dataLabel)
        mThis.label = option.dataLabel;

      mThis.previousDialog = option.previousDialog;
      if (option.allowBlankValue === undefined) option.allowBlankValue = false;
      mThis.allowBlankValue = option.allowBlankValue;
      if (option.valueMember) mThis.valueMember = option.valueMember;
      if (option.textMember) mThis.textMember = option.textMember;
      mThis.blankErrorMessage = option.blankErrorMessage ? option.blankErrorMessage : option.errorMessage;
      mThis.data = option.data;

      if (option.btnOKText) mThis.btnOK.text(option.btnOKText);
    }
    mThis.onClose = onClose;

    mThis.lblTitle.html(option.title);
    mThis.lblLabel.html(mThis.label);
    mThis.elData.val(mThis.def_value);

    if (mThis.previousDialog) mThis.previousDialog.modal('hide');
    mThis.self.on('shown.bs.modal', function () {
      mThis.elData.val(mThis.def_value);
      mThis.elData.focus();
      mThis.elData.select();
    }).modal({
      backdrop: 'static'
    });

    mThis.self.on('hide.bs.modal', function () {
      if (mThis.previousDialog) mThis.previousDialog.modal('show');
    });
  }
}
//end::InputBox1(User type in one value)

//begin::InputBox2 (Select one value)
let InputBox2 = new function () {
  let mThis = this;
  this.self = $('#_dlgInputBox2');
  this.elData = $('#_inputbox2_select');
  this.btnOK = $('#_inputbox2_btnOK');
  this.lblTitle = $('#_dlgInputBox2Title');
  this.lblLabel = $('#_inputbox2_label');
  this.label = "Enter value";
  this.allowBlankValue = false;

  this.elError = $('#_inputbox2_error');

  this.elData.on('keyup', (e) => {
    if (e.keyCode === 13) mThis.btnOK.trigger('click');
  });

  this.btnOK.on('click', function (e) {
    e.preventDefault();
    let d = mThis.elData.val();
    let d_name = mThis.elData.find('option:selected').text();
    let retData = { value: d, text: d_name };
    if (!d) retData = null;
    if (!mThis.allowBlankValue) {
      if (!mThis.elData.val()) {
        mThis.elError.html(mThis.blankErrorMessage ? mThis.blankErrorMessage : 'Cannot accept blank value');
        return;
      }
    }
    if (typeof mThis.onClose === 'function') mThis.onClose(retData);
    mThis.self.modal('hide');
  });

  //option = {title,def_value,dataLabel,btnOKText,btnCancelText,allowBlankValue =false,'blankErrorMessage','previousDialog'}
  this.show = function (option, onClose) {
    mThis.elError.html(null);
    if (option) {
      mThis.title = option.title;
      if (option.defaultValue)
        mThis.def_value = option.defaultValue;
      else
        mThis.def_value = option.def_value;

      //Store previous dialog, if any   
      mThis.previousDialog = option.previousDialog;
      if (option.label)
        mThis.label = option.label;
      else if (option.dataLabel)
        mThis.label = option.dataLabel;

      if (option.allowBlankValue)
        mThis.allowBlankValue = option.allowBlankValue;
      if (option.valueMember) mThis.valueMember = option.valueMember;
      if (option.textMember) mThis.textMember = option.textMember;
      if (option.blankErrorMessage) mThis.blankErrorMessage = option.blankErrorMessage;
      mThis.data = option.data;

      if (option.btnOKText) mThis.btnOK.text(option.btnOKText);
    }
    mThis.onClose = onClose;

    mThis.lblTitle.html(option.title);
    mThis.lblLabel.html(mThis.label);

    //If there SELECT box 's options are provided through option.data
    if (mThis.data) {
      let i = 0, c;
      let value = "id", text = "name";
      if (mThis.valueMember) value = mThis.valueMember;
      if (mThis.textMember) text = mThis.textMember;
      mThis.elData.empty();
      do {
        c = mThis.data[i];
        if (!c) break;
        mThis.elData.append($('<option/>').val(c[value]).text(c[text]));
        i++;
      } while (c);
    }

    if (mThis.previousDialog) mThis.previousDialog.modal('hide');
    mThis.self.modal({
      backdrop: 'static'
    });

    mThis.self.on('shown.bs.modal', function () {
      mThis.elData.val(mThis.def_value);
      mThis.elData.trigger('focus');
      mThis.elData.trigger('select');
    });

    mThis.self.on('hide.bs.modal', function () {
      if (mThis.previousDialog) mThis.previousDialog.modal('show');
    });
  }
}
//end::InputBox2(Select one Value)
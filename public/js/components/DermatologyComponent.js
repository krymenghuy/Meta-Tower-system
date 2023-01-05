"use strict";

let DermatologyComponent = new function(){
    let mThis = this;
    this.title_prop = 'Dermatology';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_dermatologyComponent');
    this.btnAdd = $('#_derm_btnNew');

    this.init = () => {
        
    }

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

$(document).ready(function() {
    DermatologyComponent.init();
});
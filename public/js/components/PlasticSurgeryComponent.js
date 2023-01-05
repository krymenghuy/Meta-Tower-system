"use strict";

let PlasticSurgeryComponent = new function(){
    let mThis = this;
    this.title_prop = 'Plastic Surgery';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_plasticSurgeryComponent');
    this.btnAdd = $('#_pls_btnNew');

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
    PlasticSurgeryComponent.init();
});
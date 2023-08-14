'use strict';
var RequestDiscountComponent = new function(){
    let mThis = this;
    this.title_prop = 'Request Discount';
    this.self = $('#_main_requestDiscountComponent');

    this.init = () => {}

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        let x = mThis.self.siblings(':visible');
        x.fadeOut('fast',function(){
            mThis.self.hide().fadeIn(300);
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RequestDiscountComponent.init();
});
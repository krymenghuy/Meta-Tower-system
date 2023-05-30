"use strict";
var PrintStudentCardsComponent = new function(){
    let mThis = this;
    this.title_prop = "Print Student Cards";
    this.self = $('#_main_printStudentCardComponent');

    this.init = () => {}

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

window.addEventListener('DOMContentLoaded',() => {
    PrintStudentCardsComponent.init();
});
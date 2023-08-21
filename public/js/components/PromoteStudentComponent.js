'use strict';
var PromoteStudentComponent = new function(){
    let mThis = this;
    this.title_prop = 'Promote';
    this.self = $('#_main_promoteStudentComponent');

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
    PromoteStudentComponent.init();
});
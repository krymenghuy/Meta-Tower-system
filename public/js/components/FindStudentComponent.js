"use strict";
var FindStudentComponent = new function(){
    let mThis = this;
    this.title_prop = "Find Student";
    this.self = $('#_main_findStudentComponent');

    this.div_filter = mThis.self.find('.div--ssp');
    this.div_list = mThis.self.find('.div--fsd');
    this.btnFind = mThis.self.find('.btn--find');

    this.init = () => {}

    mThis.btnFind.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        console.log(p);

        mThis.div_list.show().siblings().hide();
    });

    this.getDataForm = () => {
        let p = {};
        mThis.div_filter.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

window.addEventListener('DOMContentLoaded',() => {
    FindStudentComponent.init();
});
'use strict';
var PromoteStudentComponent = new function(){
    let mThis = this;
    this.title_prop = 'Promote';
    this.self = $('#_main_promoteStudentComponent');

    this.btnNew = mThis.self.find('#_pms_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {}
            };
            PromoteStudentDialog.show(op);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        let x = mThis.self.siblings(':visible');
        x.fadeOut('fast',function(){
            mThis.self.hide().fadeIn(300);
        });
    }
}

let PromoteStudentDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_pms_');

    this.prepareFormOption = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/form-option`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.self.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'term_id':
                        VSUtil.setComboItems(el,d.terms,'id','term',null,null,null);
                        break;
                    case 'next_term_id':
                        VSUtil.setComboItems(el,d.terms,'id','term',null,null,null);
                        break;
                    case 'program_id':
                        VSUtil.setComboItems(el,d.programs,'id','program_name',null,null,null);
                        break;
                    default:
                        break;
                }
            });
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(() => {
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    PromoteStudentComponent.init();
});
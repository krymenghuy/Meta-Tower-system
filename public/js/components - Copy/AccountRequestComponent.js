'use strict';
var AccountRequestComponent = new function(){
    const mThis = this;
    this.title_prop = 'Account Request';
    this.self = $('#_main_accountRequestComponent');

    this.btnNew = mThis.self.find('#_arq_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {}
            };
            AccountRequestDialog.show(op);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        let x = mThis.self.siblings(':visible');
        x.hide(0,function(){
            mThis.self.hide().fadeIn(200);
        });
    }
}

let AccountRequestDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_arq_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.elStudent = mThis.self.find('#dlg_el_student');
    this.btnSave = mThis.self.find('#dlg_arq_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        p = mThis.prepareData(p);
        vsapi.call(`${main_view.base_url}/api/guardian/request-account`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.prepareData = (d) => {
        d = d ? d : {};
        let student = [];
        if(!($.isEmptyObject(d))){
            d.student_id.map(st => {
                student.push({
                    'student_id': st
                });
            });
        }
        d.student_info = student;
        delete(d.student_id);
        return d;
    }

    this.prepareFormOption = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/settings/deposite-options`,null,null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data.options_student,
                student = mThis.elStudent;
                VSUtil.setComboItems(student,d,'id','student_name',null,null,null);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.getDataForm = () => {
        const div = mThis.self;
        let p = {
            'id': mThis.options.id
        };
        div.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Parent','titles'));
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Parent','titles'));
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    AccountRequestComponent.init();
});
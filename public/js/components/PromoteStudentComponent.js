'use strict';
var PromoteStudentComponent = new function(){
    let mThis = this;
    this.title_prop = 'Promote';
    this.self = $('#_main_promoteStudentComponent');

    this.btnNew = mThis.self.find('#_pms_btn_new');

    this.cols = [{
        title: "Student ID",
        data: "code"
    },
    {
        title: "Full Name",
        data: "name"
    },
    {
        title: "Full Name (KH)",
        data: "name_kh"
    },
    {
        title: "Age",
        data: "age"
    },
    {
        title: "Date of Birth",
        data: "dob"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-pms-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl_pms_',{
            'fetchApi':`${main_view.base_url}/api/promote/student-list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-id',data.id);
            },
            'beforeRender':()=>{}
        });

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            PromoteStudentDialog.show(op);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let PromoteStudentDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_pms_');
    this.options = {};

    this.btnSave = mThis.self.find('#dlg_pms_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(p.promote_info.next_term_id > 0){
            window.vsapi.call(`${main_view.base_url}/api/promote/students`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
                    cv_interact.success('Students Promoted Successfully!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        }
        else{
            cv_interact.error('Next Term Cannot Empty!');
        }
    });

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
                        mThis.getPromoteByTerm(el);
                        break;
                    case 'next_term_id':
                        VSUtil.setComboItems(el,d.terms,'id','term',null,null,null);
                        break;
                    case 'program_id':
                        VSUtil.setComboItems(el,d.programs,'id','program_name',null,null,null);
                        mThis.getPromoteByProgram(el);
                        break;
                    default:
                        break;
                }
            });
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.getPromoteByTerm = (el) => {
        el.on('change',function(e){
            e.preventDefault();
            let op = {
                'term_id': $(this).val(),
                'program_id': $(this).closest('.modal-body').find('.data-program').val()
            };
            window.vsapi.call(`${main_view.base_url}/api/promote/form-options`,op,null,false).then(res => {
                let d = {};
                if(res.status_code === 200){
                    d = res.data;
                }
                mThis.self.find('.data-input').each(function(){
                    let el = $(this);
                    let f = el.data('field');
                    let next_term_id = (d && d['next_term']) ? d['next_term']['id'] : null;

                    switch(f){
                        case 'next_term_id':
                            el.val(next_term_id).trigger('change');
                            break;
                        case 'total_student':
                            el.val(d.count).trigger('change');
                            break;
                        default:
                            break;
                    }
                });
            });
        });
    }

    this.getPromoteByProgram = (el) => {
        el.on('change',function(e){
            e.preventDefault();
            let op = {
                'term_id': $(this).closest('.modal-body').find('.data-term').val(),
                'program_id': $(this).val()
            };
            window.vsapi.call(`${main_view.base_url}/api/promote/form-options`,op,null,false).then(res => {
                let d = {};
                if(res.status_code === 200){
                    d = res.data;
                }
                mThis.self.find('.data-input').each(function(){
                    let el = $(this);
                    let f = el.data('field');

                    switch(f){
                        case 'total_student':
                            el.val(d.count).trigger('change');
                            break;
                        default:
                            break;
                    }
                });
            });
        });
    }

    this.getDataForm = () => {
        let p = {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        p.promote_info = [{
            "term_id": p.term_id,
            "next_term_id": p.next_term_id
        }];
        ['total_student','term_id','next_term_id'].forEach(ob => {
            delete(p[ob]);
        });

        return p;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        
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
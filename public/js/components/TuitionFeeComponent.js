"use strict";
var TuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Tuition Fee";
    this.self = $('#_main_tuitionFeeComponent');
    
    this.btnAdd = mThis.self.find('.btn--add');

    this.cols = [{
        title: "Name",
        data: "name"
    },
    {
        title: "Start Date",
        data: "start_date"
    },
    {
        title: "End Date",
        data: "end_date"
    },
    {
        title: "Academic Year",
        data: "academic_year"
    },
    {
        title: "Created By",
        data: (data, a, b) => {
            return [`<p class="pb-0 mb-0">${data.create_user}</p>
            <p class="pb-0 mb-0">${data.created_at}</p>`].join('');
        }
    },
    {
        title: "Authorized By",
        data: (data, a, b) => {
            let user = data.auth_user ? data.auth_user : '', date = data.auth_date ? data.auth_date : '';
            return [`<p class="pb-0 mb-0">${user}</p>
            <p class="pb-0 mb-0">${date}</p>`].join('');
        }
    },
    {
        title: "Description",
        data: "description"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-ttf-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                </a>
                <a href="javascript:void(0)" class="btn-ttf-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('_ttf_tbl',{
            'fetchApi':`${main_view.base_url}/api/price-list/list-paginate`,
            'columns':mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });

        mThis.tblTuitionFee = $(mThis.itemView.getTable());

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this tuition fee?',{title: 'Delete Tuition Fee', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let TuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__ttf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_ttf_btn_save');
    this.elProgram = mThis.self.find('#dlg_ttf_program');
    this.elPriceList = mThis.self.find('#dlg_ttf_price_list');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/price-list/save-item`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = () => {
        let id = mThis.options.id ? mThis.options.id : 0;
        let p = {'id': id};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            el.val(d[f]);
        });
    }

    this.loadDataEdit = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',null,null,null);
            VSUtil.setComboItems(mThis.elPriceList,d.price_list,'id','name',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Edit Price List','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check item details before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Price List','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input tuition fee details','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    TuitionFeeComponent.init();
});
"use strict";
var PolicyDiscountComponent = new function(){
    let mThis = this;
    this.title_prop = "Policy Discount";
    this.self = $('#_main_policyDiscountComponent');

    this.btnAdd = mThis.self.find('#pld_btn_add');
    this.elSearch = mThis.self.find('#_pdl_search');

    this.cols = [{
        title: "Name",
        data: "price_list_name"
    },
    {
        title: "Payment Option",
        data: "pmt_option"
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
        title: "Session",
        data: "session"
    },
    {
        title: "Discount",
        data: "discount"
    },
    {
        title: "Discount Type",
        data: "discount_type"
    },
    {
        title: "Created By",
        data: "create_user"
    },
    {
        title: "Create Date",
        data: "created_at"
    },
    {
        title: "Authorized By",
        data: "auth_user"
    },
    {
        title: "Authorize Date",
        data: "auth_date"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-pld-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-pld-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl_pld',{
            'fetchApi':`${main_view.base_url}/api/pol-discount/list-paginate`,
            'columns':mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': (e) => {
                    if(e){
                        mThis.itemView.showPage({'search_value': mThis.elSearch.val()});
                    }
                }
            };
            PolicyDiscountOutsideDialog.show(op);
        });

        mThis.tblPolicyDiscount = $(mThis.itemView.getTable());

        mThis.tblPolicyDiscount.on('click','a.btn-pld-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': (e) => {
                    if(e){
                        mThis.itemView.showPage({'search_value': mThis.elSearch.val()});
                    }
                }
            };
            PolicyDiscountOutsideDialog.show(op);
        });

        mThis.tblPolicyDiscount.on('click','a.btn-pld-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this policy?',{title: 'Delete Policy', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage({'search_value': mThis.elSearch.val()});
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            if(e.keyCode === 13)
                mThis.itemView.showPage({'search_value': $(this).val()});
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

let PolicyDiscountOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__pld');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('.btn--save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/pol-discount/save`,p,null).then(res => {
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

    this.loadDataEdit = (id, onFinish) => {
        let op = {'id': id};
        window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            onFinish && onFinish(data);
        });
    }
    
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Edit Discount Policy','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check discount type before editing','titles'));
            mThis.loadDataEdit(options.id, (data) => {
                mThis.setDataForm(data);
            });
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('Add Discount Policy','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input discount type details','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    PolicyDiscountComponent.init();
});
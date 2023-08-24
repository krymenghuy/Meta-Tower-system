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
        data: (data, a, b) => {
            let discount = data.discount ? data.discount : '';
            let discount_type = data.discount_type == 'percentage' ? '%' : '$';
            return [discount,discount_type].join(' ');
        }
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
            let user = data.auth_user ? data.auth_user : '';
            return [`<p class="pb-0 mb-0">${user}</p>
            <p class="pb-0 mb-0">${data.auth_date}</p>`].join('');
        }
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
                'onClose': () => {
                    mThis.itemView.showPage({'search_value': mThis.elSearch.val()});
                }
            };
            PolicyDiscountOutsideDialog.show(op);
        });

        mThis.tblPolicyDiscount = $(mThis.itemView.getTable());

        mThis.tblPolicyDiscount.on('click','a.btn-pld-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.itemView.showPage({'search_value': mThis.elSearch.val()});
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
                    window.vsapi.call(`${main_view.base_url}/api/pol-discount/delete`,op,null).then(res => {
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

        new SearchData(mThis.elSearch,mThis.tblPolicyDiscount);
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

let PolicyDiscountOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__pld');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_pld_btn_save');
    this.elPriceList = mThis.self.find('#dlg_pld_price_list');
    this.elPmtOption = mThis.self.find('#dlg_pld_pmt_option');
    this.elSession = mThis.self.find('#dlg_pld_session');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        mThis.validate.validator(() => {
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
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id
        };
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.validate.resetForm();
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.loadDataEdit = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/pol-discount/details`,{'id': options.id},null).then(res => {
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
            VSUtil.setComboItems(mThis.elPriceList,d.price_list,'id','name',null,null,null);
            VSUtil.setComboItems(mThis.elPmtOption,d.pmt_options,'id','name',null,null,null);
            VSUtil.setComboItems(mThis.elSession,d.sessions,'id','name',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.validate = new FormValidator(mThis.self,{
        className: 'data-input'
    });
    
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Edit Discount Policy','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check discount type before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Discount Policy','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input discount type details','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    PolicyDiscountComponent.init();
});
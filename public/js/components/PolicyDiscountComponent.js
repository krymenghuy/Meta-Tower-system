"use strict";
var PolicyDiscountComponent = new function(){
    let mThis = this;
    this.title_prop = "Policy Discount";
    this.self = $('#_main_policyDiscountComponent');

    this.btnAdd = mThis.self.find('#pld_btn_add');
    this.elFilter_academic_year = this.self.find('#_pol_filter_acad_year');
    this.elFilter_price_list = this.self.find('#_pol_filter_price_list');

    this.cols = [{
        title: "Price List",
        className: 'align-middle',
        data: (data, index, tr)=>{
            return ['<span class="text-capitalize fw-semibold">',data.price_list_name,'</span>'].join('');
        }
    },
    {
        title: "Date Range",
        className: 'align-middle',
        data: (data, index, tr)=>{
            return ['<span class="border rounded-3 p-2">',data.start_date,'</span>',' to ','<span class="border rounded-3 p-2">',data.end_date,'</span>'].join('');
        }
    },
    {
        title: "Academic Year",
        className: 'align-middle',
        data: "academic_year"
    },
    {
        title: "Payment Option",
        className: 'align-middle',
        data: "pmt_option"
    },
    {
        title: "Session",
        className: 'align-middle',
        data: "session"
    },
    {
        title: "Discount",
        className: 'align-middle',
        data: (data, a, b) => {
            const discount = data.discount ? data.discount : '';
            const discount_type = data.discount_type == 'percentage' ? '%' : '$';
            return [discount,discount_type].join(' ');
        }
    },
    {
        title: "Updated By",
        className: 'align-middle',
        data: (data, a, b) => {
            return [`<p class="text-capitalize pb-0 mb-0">`,data.update_user,`</p>
            <p class="pb-0 mb-0"><small>`,data.updated_at,`</small></p>`].join('');
        }
    },
    {
        title: "Authorization",
        className: 'align-middle',
        data: (data, index, tr) => {
            const auth_info = data.authorized == 1 ? [`<p class="text-capitalize d-block pb-0 mb-0">`,data.auth_user ? data.auth_user : data.update_user,`</p>
            <p class="d-block pb-0 mb-0"><small>${data.auth_date}</small></p>`].join('') : '<span class="text-capitalize text-warning p-1">Pending</span>';
            return auth_info;
        }
    },
    {
        title: "Action",
        className: 'align-middle',
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

    this.getFilterData = ()=>{
        return {
            'academic_year':mThis.elFilter_academic_year.val(),
            'price_list_id':mThis.elFilter_price_list.val(),
            'search_value':null
        };
    }

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
                    mThis.itemView.showPage(mThis.getFilterData());
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
                    mThis.itemView.showPage(mThis.getFilterData());
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
                    vsapi.call(`${main_view.base_url}/api/pol-discount/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(mThis.getFilterData());
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        this.elFilter_price_list.on('change',(e)=>{
            mThis.itemView.showPage(mThis.getFilterData());
        });

        this.elFilter_academic_year.on('change',(e)=>{
            vsapi.call(`${main_view.base_url}/api/price-list/select-options`,{'academic_year':e.target.value},null).then(res=>{
                const items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.elFilter_price_list,items,'id','price_list_name',true,'(All Price Lists)',0);
                mThis.itemView.showPage(mThis.getFilterData());
            });
        });
    }

    this.prepareFormOptions = (onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/settings/options-academic-year`,null,false).then(res=>{
            if(res.status_code===200){
                const items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.elFilter_academic_year,items,'academic_year','academic_year',true,'(All Years)',0);
                onFinish();
            }
            else
                cv_interact.error('Failed to load Price List options');
        });
    }
    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOptions(()=>{
            mThis.elFilter_price_list.trigger('change');
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

let PolicyDiscountOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__pld');
    this.options = {};
    let ref = {
        click: true
    };

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_pld_btn_save');
    this.elPriceList = mThis.self.find('#dlg_pld_price_list');
    this.elPmtOption = mThis.self.find('#dlg_pld_pmt_option');
    this.elSession = mThis.self.find('#dlg_pld_session');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/pol-discount/save`,p,null).then(res => {
                ref.click = false;
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function')
                        mThis.options.onClose();
                    ref.click = true;
                }
                else{
                    cv_interact.error(res.error_message);
                    ref.click = true;
                }
            });
        }
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
        d.discount_type = d.discount_type?d.discount_type:'percentage';
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
        vsapi.call(`${main_view.base_url}/api/pol-discount/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
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
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Edit Policy Discount','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Policy Discount','titles'));
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
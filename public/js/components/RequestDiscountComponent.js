'use strict';
var RequestDiscountComponent = new function(){
    let mThis = this;
    this.title_prop = 'Request Discount';
    this.self = $('#_main_requestDiscountComponent');

    this.btnNew = mThis.self.find('#_rqdc_btn_new');
    this.btnRequest = mThis.self.find('#_rqdc_send_request');
    this.elDiscountType = mThis.self.find('#_rqdc_discount_type');

    this.cols = [{
        title: "Check",
        className: "position-relative text-center",
        data: () => {
            return [`<input type="checkbox" class="form-check-input"/>`].join('');
        }
    },
    {
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "Student ID",
        data: "code"
    },
    {
        title: "Full Name",
        className: 'text-capitalize',
        data: "name"
    },
    {
        title: "Full Name (KH)",
        className: 'text-capitalize',
        data: "name_kh"
    },
    {
        title: "Sex",
        data: (data, a, b) => {
            let sex = data.sex === 'M' ? 'Male' : 'Female';
            return sex;
        }
    },
    {
        title: "Date of Birth",
        data: (data, a, b) => {
            let dob = data.date_of_birth ? data.date_of_birth : '';
            return new Date(dob).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Discount",
        data: (data, a, b) => {
            let discount_type = data.type === 'amount' ? '$':'%';
            let amount = data.amount ? data.amount : 'N/A';
            return [`${amount} ${data.amount ? discount_type : ''}`].join('');
        }
    },
    {
        title: "Status",
        data: (data, a, b) => {
            return [`${data.status ? `<span class="text-capitalize p-2 bg-warning text-white rounded-3">${data.status}</span>`:''}`].join('');
        }
    },
    {
        title: "Created By",
        data: (data, a, b) => {
            let update_user = data.update_user ? data.update_user : '',updated_at = data.updated_at ? data.updated_at : '';
            return [`<p class="pb-0 mb-1 text-capitalize">${update_user}</p>
            <small>${new Date(updated_at).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replaceAll(' ','-').replace(',','')}</small>`].join('');
        }
    },
    {
        title: "Remark",
        data: "remarks"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-rqdc-send" data-id="${data.id}">
                    <i class="fa-regular fa-paper-plane text-success fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-rqdc-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('_rqdc_tbl',{
            'fetchApi':`${main_view.base_url}/api/activity/request-discount/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
                tr.setAttribute('data-discountid',data.discount_type_id);
            },
            'beforeRender':()=>{}
        });
        mThis.tblDiscount = $(mThis.itemView.getTable());

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            RequestDiscountDialog.show(op);
        });

        mThis.tblDiscount.on('click','a.btn-rqdc-send',function(e){
            e.preventDefault();
            let op = {
                'request_info':[
                    {
                        'discount_request_id': $(this).data('id')
                    }
                ]
            };
            vsapi.call(`${main_view.base_url}/api/activity/send-request-discount`,op,null).then(res => {
                if(res.status_code === 200){
                    mThis.itemView.showPage(null);
                    cv_interact.success('Request has been seen!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        });

        mThis.tblDiscount.on('click','a.btn-rqdc-delete',function(e){
            e.preventDefault();
            let op = {
                'discount_request_id': $(this).data('id')
            };
            cv_interact.confirm('Delete this request?',{title: 'Delete Request', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/activity/request-discount/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                    });
                }
            });
        });

        mThis.btnRequest.on('click',function(e){
            e.preventDefault();
            mThis.getDiscountID(mThis.tblDiscount);
        });
    }

    this.getDiscountID = (tbl) => {
        let p = {
            'request_info':[]
        };
        tbl.find('input[type=checkbox]:checked').each(function(){
            let tr = $(this).closest('tr');
            let obj = {
                'discount_request_id': tr.data('id')
            };
            p.request_info.push(obj);
        });
        vsapi.call(`${main_view.base_url}/api/activity/send-request-discount`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.itemView.showPage(null);
                cv_interact.success('Request has been seen!');
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    }

    this.prepareOption = () => {
        vsapi.call(`${main_view.base_url}/api/option/discount-type`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elDiscountType,d.discount_type,'id','name',null,null,null);
        });
    }

    this.show = (options) => {
        if(!options) options = {};

        mThis.itemView.showPage(null,null,() => {
            mThis.prepareOption();
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let RequestDiscountDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_rqdc_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_rqdc_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/activity/create-request-discount`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = (silent=false) => {
        let p = {
            'id': mThis.options.id
        };
        let has_error = false;
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                has_error = true;
                if(!silent) cv_interact.warning([Validator.properCase(f),' is not correct'].join(''));
                return false;
            }
            p[f] = el.val();
        });
        return has_error? null: p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        Validator.clearErrors(mThis.self);
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.prepareFormOption = (onFinish=null) => {
        let option = '';
        vsapi.call(`${main_view.base_url}/api/option/discount-type`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.self.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'student_id':
                        (option,d && d.students.map(op => {
                            option = [option,`<option value="${op.student_id}">${op.student_name} (${op.student_code})</option>`].join('');
                        }),option=['<option selected></option>',option].join(''),el.html(option));
                        break;
                    case 'discount_type_id':
                        VSUtil.setComboItems(el,d.discount_type,'id','name',null,null,null);
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
        mThis.options = options;

        mThis.prepareFormOption(() => {
            mThis.setDataForm(null);
            mThis.elTitle.text(LocaleManager.trans('New Request','titles'));
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RequestDiscountComponent.init();
});
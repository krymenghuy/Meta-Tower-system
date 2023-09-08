"use strict";
var DiscountComponent = new function(){
    let mThis = this;
    this.title_prop = "Discount";
    this.self = $('#_main_discountComponent');

    this.elFilterContainer = mThis.self.find('#el_dsn_container');

    this.cols = [{
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "Student Code",
        data: "code"
    },
    {
        title: "Full Name",
        className: "text-capitalize",
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
            return [`<span>${data.sex === 'M' ? 'Male' : 'Female'}</span>`].join('');
        }
    },
    {
        title: "Date of Birth",
        data: (data, a, b) => {
            let dob = data.date_of_birth ? data.date_of_birth : '';
            return new Date(dob).toLocaleDateString('km-KH',{
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Amount",
        data: (data, a, b) => {
            let discount = '%';
            return [data.amount,discount].join(' ');
        }
    },
    {
        title: "Discount Type",
        data: "discount_type"
    },
    {
        title: "Remark",
        data: "remarks"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            let cls = data.status === 'pending' ? 'bg-warning' : data.status === 'approved' ? 'bg-success' : 'bg-info';
            return [`<span class="text-capitalize p-2 ${cls} rounded-3 text-white">${data.status}</span>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            let cls = data.status === 'pending' ? '' : data.status === 'approved' ? 'd-none' : '',cls_reject = data.status === 'rejected' ? 'd-none' : '';
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-dns-approve ${cls}" data-id="${data.id}">
                    <i class="fa-regular fa-circle-check fs-5 text-success"></i>
                </a>
                <a href="javascript:void(0)" class="btn-dns-reject ${cls} ${cls_reject}" data-id="${data.id}">
                    <i class="fa-regular fa-circle-xmark fs-5 text-warning"></i>
                </a>
                <a href="javascript:void(0)" class="btn-dns-delete ${cls}" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('_dsn_tbl',{
            'fetchApi':`${main_view.base_url}/api/approval/request-discount-list`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-studentid',data.id);
            },
            'beforeRender':()=>{}
        });
        mThis.tblDiscount = $(mThis.itemView.getTable());

        mThis.tblDiscount.on('click','a.btn-dns-approve',function(e){
            e.preventDefault();
            let op = {
                'approve_info':[
                    {
                        'discount_id': $(this).data('id')
                    }
                ]
            };
            vsapi.call(`${main_view.base_url}/api/approval/approve-request-discount`,op,null).then(res => {
                if(res.status_code === 200){
                    mThis.itemView.showPage(null);
                    cv_interact.success('Approved Successfully!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        });

        mThis.tblDiscount.on('click','a.btn-dns-reject',function(e){
            e.preventDefault();
            let op = {
                "discount_id": $(this).data('id')
            };
            Swal.fire({
                input: 'textarea',
                inputLabel: 'Why You Rejected This Request?',
                inputPlaceholder: 'Type your reasons here...',
                inputAttribute: {
                    'aria-label': 'Type your reasons here'
                },
                showCancelButton: true,
                inputValidator: (value) => {
                    if(!value)
                        return 'You need to write something!';
                    else{
                        op.remark = value;
                        vsapi.call(`${main_view.base_url}/api/approval/reject-request-discount`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.itemView.showPage(null);
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                }
            });
        });

        mThis.tblDiscount.on('click','a.btn-dns-delete',function(e){
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
    }

    this.prepareFilter = () => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.elFilterContainer.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'discount_type':
                        VSUtil.setComboItems(el,d.discount_type,'id','name',null,null,null);
                        break;
                    case 'academic_year':
                        VSUtil.setComboItems(el,d.academic_year,'academic_year','academic_year',null,null,null);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.prepareFilter();
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    DiscountComponent.init();
});
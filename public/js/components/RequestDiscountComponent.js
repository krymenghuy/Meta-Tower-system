'use strict';
var RequestDiscountComponent = new function(){
    let mThis = this;
    this.title_prop = 'Request Discount';
    this.self = $('#_main_requestDiscountComponent');

    this.btnNew = mThis.self.find('#_rqdc_btn_new');

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
        data: "name"
    },
    {
        title: "Full Name (KH)",
        data: "name_kh"
    },
    {
        title: "Sex",
        data: "sex"
    },
    {
        title: "Date of Birth",
        data: "date_of_birth"
    },
    {
        title: "Discount",
        data: (data, a, b) => {
            let discount_type = data.type === 'percentage' ? '%':'$';
            let amount = data.amount ? data.amount : 'N/A';
            return [`${amount} ${data.amount ? discount_type : ''}`].join('');
        }
    },
    {
        title: "Status",
        data: (data, a, b) => {
            return [`${data.status ? `<span class="p-2 bg-warning text-white rounded-3">${data.status}</span>`:''}`].join('');
        }
    },
    {
        title: "Created By",
        data: "update_user"
    },
    {
        title: "Created At",
        data: "updated_at"
    },
    {
        title: "Remark",
        data: "remarks"
    }];

    this.init = () => {
        mThis.itemView = new ListView('_rqdc_tbl',{
            'fetchApi':`${main_view.base_url}/api/activity/request-discount/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
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
            RequestDiscountDialog.show(op);
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

let RequestDiscountDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_rqdc_');

    this.elTitle = mThis.self.find('.modal-title');

    this.show = (options) => {
        if(!options) options = {};

        mThis.elTitle.text(LocaleManager.trans('New Request','titles'));
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RequestDiscountComponent.init();
});
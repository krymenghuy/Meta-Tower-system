'use strict';
var PaymentPendingComponent = new function(){
    let mThis = this;
    this.title_prop = 'Payment Pending';
    this.self = $('#_main_paymentPendingComponent');

    this.cols = [{
        title: "Name Khmer",
        data: "name_kh"
    },
    {
        title: "Name",
        data: "name"
    },
    {
        title: "Tuition",
        data: "tuition"
    },
    {
        title: "Tuition Due",
        data: "tuition_due"
    },
    {
        title: "Tuition Paid",
        data: "tuition_paid"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            return [`<span class="p-2 bg-danger text-white rounded-3">${data.status}</span>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-ppd-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('_ppd_tbl',{
            'fetchApi':`${main_view.base_url}/api/price-list/pending/payment`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
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

window.addEventListener('DOMContentLoaded',() => {
    PaymentPendingComponent.init();
});
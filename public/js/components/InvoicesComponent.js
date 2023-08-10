"use strict";
var InvoicesComponent = new function(){
    let mThis = this;
    this.title_prop = "Invoices";
    this.self = $('#_main_invoicesComponent');

    this.cols = [{
        title: "Invoice Number",
        data: "invoice_number"
    },
    {
        title: "Student Code",
        data: "student_code"
    },
    {
        title: "Student Name",
        data: "student_name"
    },
    {
        title: "School Level",
        data: "program"
    },
    {
        title: "Level",
        data: "level"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            let bg = data.status === 'unpaid' ? 'bg-danger':'bg-success';
            return [`<span class="p-2 rounded-3 text-white text-capitalize ${bg}">${data.status}</span>`].join('');
        }
    },
    {
        title: "Amount",
        data: (data, a, b) => {
            let amount = data.amount ? ['$',data.amount].join(' ') : 'N/A';
            return amount;
        }
    },
    {
        title: "Invoice Date",
        data: "invoice_date"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            let cls = data.status === 'unpaid' ? 'd-block':'d-none'; 
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-inv-modify ${cls}" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-inv-delete ${cls}" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl_inv_',{
            'fetchApi':`${main_view.base_url}/api/student/invoice-list`,
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
    InvoicesComponent.init();
});
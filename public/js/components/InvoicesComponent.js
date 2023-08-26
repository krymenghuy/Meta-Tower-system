"use strict";
var InvoicesComponent = new function(){
    let mThis = this;
    this.title_prop = "Invoices";
    this.self = $('#_main_invoicesComponent');

    this.currency_symbol = '$';

    this.cols = [{
        title: "Invoice Number",
        data: (data, index, tr) => {
            return [`<div class="d-flex flex-column">
                <a href="javascript:void(0)" class="btn-inv-print" data-id="${data.id}">${data.invoice_number}</a>
                <small class="text-capitalize text-left text-success">${data.invoice_type ? data.invoice_type.replace('_',' ') : 'General'}</small>
            </div>`].join('');
        }
    },
    {
        title: "Student",
        data: (data, index, tr) => {
            return [`<div class="d-flex flex-column">
                <a href="javascript:void(0)" class="lnk-print-invoice" data-id="${data.id}">
                    <p class="pb-0 mb-1 text-capitalize">${data.student_name}</p>
                </a>
                <small class="text-capitalize">${data.student_code}</small>
            </div>`].join('');
        }
    },
    {
        title: "Program",
        data: (data, a, b) => {
            return [`<p class="pb-0 mb-1">${data.program}</p>
            <small class="text-center">(${data.session})</small>`].join('');
        }
    },
    {
        title: "Level",
        data: "level"
    },  
    // {
    //     title: "Amount",
    //     data: (data, a, b) => {
    //         let amount = data.amount ? ['$',data.amount].join(' ') : 'N/A';
    //         return amount;
    //     }
    // },
    {
        title: "Due",
        data: (data, a, b) => {
            const cur =  data.currency_symbol?data.currency_symbol:mThis.currency_symbol;
            let due_amount = data.due_amount ? [cur,data.due_amount].join(' ') : 'NA';
            return due_amount;
        }
    },
    {
        title: "Paid",
        data: (data, a, b) => {
            const cur =  data.currency_symbol?data.currency_symbol:mThis.currency_symbol;
            let paid_amount = data.paid_amount ? [cur,data.paid_amount].join('') : 'NA';
            return paid_amount;
        }
    },
 
    {
        title: "Issue Date",
        data: "invoice_date"
    },
    {
        title: "Pmt Date",
        data: "pmt_date"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            let bg = data.status === 'unpaid' ? 'bg-danger':'bg-success';
            return [`<span class="p-2 rounded-3 text-white text-capitalize ${bg}">${data.status}</span>`].join('');
        }
    },
    {
        title: "Last Updated",
        data: (data, index, tr)=>{
            return [`<div class="d-flex flex-column">
                <span class="fw-semibold">${data.update_user}</span>
                <small class="text-muted">${data.updated_at}</small>
            </div>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            let cls = data.status === 'unpaid' ? 'd-block':'d-none'; 
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-inv-pay ${cls}" data-studentid="${data.student_id}" data-invoice="${data.invoice_number}">
                    <i class="fa-solid fa-hand-holding-dollar text-success fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-inv-modify ${cls}" data-id="${data.id}" data-studentid="${data.student_id}" data-invoice="${data.invoice_number}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-inv-delete ${cls}" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-inv-print" data-id="${data.id}">
                    <i class="fa fa-print text-primary fs-5"></i>
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

        mThis.tblInvoice = $(mThis.itemView.getTable());
        
        mThis.tblInvoice.on('click','a.btn-inv-print',function(e){
            e.preventDefault();
            const invoice_id = $(this).data('id');
            alert('todo: Print invoice ID ' + invoice_id);
        });

        mThis.tblInvoice.on('click','a.btn-inv-pay',function(e){
            e.preventDefault();
            let op = {
                'student_id': $(this).data('studentid'),
                'invoice_number': $(this).data('invoice')
            };
            cv_interact.confirm('Recieve pay now?',{title: 'Pay', context: 'OK'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/student/school-fee/pay`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                    });
                }
            });
        });

        mThis.tblInvoice.on('click','a.btn-inv-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('studentid'),
                'invoice_id': $(this).data('id'),
                'invoice_number': $(this).data('invoice'),
                'action':'modify',
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            GenerateInvoiceFSN.show(op);
        });

        mThis.tblInvoice.on('click','a.btn-inv-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this invoice?',{title: 'Delete Invoice', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/student/invoice-delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
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
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    InvoicesComponent.init();
});
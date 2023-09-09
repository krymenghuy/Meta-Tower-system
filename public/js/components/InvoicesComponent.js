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
                <small class="text-capitalize text-left text-success">${data.invoice_type ? data.invoice_type.replaceAll('_',' ') : 'General'}</small>
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
    {
        title: "Due",
        data: (data, a, b) => {
            const cur =  data.currency_symbol ? data.currency_symbol : mThis.currency_symbol;
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
        data: (data, a, b) => {
            const issueDate = data.invoice_date ? new Date(data.invoice_date).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replace(',','') : '';
            return issueDate;
        }
    },
    {
        title: "Pmt Date",
        data: (data, a, b) => {
            const pmt_date = data.pmt_date ? new Date(data.pmt_date).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replace(',','') : '';
            return pmt_date;
        }
    },
    {
        title: "Status",
        data: (data, a, b) => {
            let bg = data.status === 'unpaid' ? 'bg-danger' : 'bg-success';
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
                <a href="javascript:void(0)" class="btn-inv-pay ${cls}" data-enrollmentid="${data.enrollment_id}" data-id="${data.id}">
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
            const op = {
                'invoice_id': $(this).data('id')
            };
            InvoiceDialog.show(op);
        });

        mThis.tblInvoice.on('click','a.btn-inv-pay',function(e){
            e.preventDefault();
            let op = {
                'enrollment_id': $(this).data('enrollmentid'),
                'inv_id': $(this).data('id')
            };
            cv_interact.confirm('Recieve Payment?',{title: 'Pay', context: 'OK'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/student/school-fee/pay`,op,null).then(res => {
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
                    vsapi.call(`${main_view.base_url}/api/student/invoice-delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('tbl_inv__table',{
            'dontExpandByClickingOn': ['btn-inv-print','btn-inv-pay','btn-inv-modify', 'btn-inv-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                if(id > 0)
                    mThis.displayInvoiceDetails(detail_tr, id);
            }
        });
    }

    this.displayInvoiceDetails = (tr, id) => {
        let div_wrapper = $(tr).find('.expandable-row-container'),
        html = null;
        div_wrapper.empty();

        vsapi.call(`${main_view.base_url}/api/invoice/items`,{'invoice_id': id},null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }

            if(d && d.length > 0){
                d.map(inv => {
                    let cur_symbol = '$';
                    html = [html,`<div class="d-flex w-50 rounded-3 bg-light gap-2 min-width-box-enroll">
                        <div class="w-50 p-3 text-nowrap">
                            <p>
                                <span class="text-primary-emphasis">Fee Type</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.fee_type ? inv.fee_type.replaceAll('_',' ') : ''}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Price</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.price ? [cur_symbol,inv.price].join(' ') : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Net Amount</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.net_amount ? [cur_symbol,inv.net_amount].join(' ') : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Discount</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.discount ? inv.discount : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Discount Type</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.discount_type ? inv.discount_type : 'Percentage'}</span>
                            </p>
                        </div>
                        <div class="w-50 p-3 text-nowrap">
                            <p>
                                <span class="text-primary-emphasis">Start Date</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.start_date ? new Date(inv.start_date).toLocaleDateString('km-KH',{'day': 'numeric','month':'short','year':'numeric'}).replace(',','') : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Date Range</span>
                                <span>:</span>
                                <span class="text-wrap">${inv.date_range ? inv.date_range : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">End Date</span>
                                <span>:</span>
                                <span class="text-capitalize">${inv.end_date ? new Date(inv.net_amount).toLocaleDateString('km-KH',{'day':'numeric','month':'short','year':'numeric'}).replace(',','') : 'N/A'}</span>
                            </p>
                            <p>
                                <span class="text-primary-emphasis">Description</span>
                                <span>:</span>
                                <span class="text-wrap">${inv.description ? inv.description : 'N/A'}</span>
                            </p>
                        </div>
                    </div>`].join('');
                });
                html = [`<div class="position-absolute d-flex flex-nowrap gap-2">`,html,`</div>`].join('');
                div_wrapper.html(html).addClass(['p-3','on-hover-to-scroll']);
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let InvoiceDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_inv_');

    this.elBody = mThis.self.find('#dlg_elBody');

    this.loadFormDetails = (div,op,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/invoice/items`,{'invoice_id': op.invoice_id},null).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                mThis.prepareData(div,d);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.prepareData = (div,d) => {
        d = d ? d : {};
        console.log(d);
        if(d && !($.isEmptyObject(d))){
            const html = [`<div class="d-flex align-items-center flex-column">
                <div class="w-50 position-relative">
                    <img class="w-100 h-100 object-fit-scale" src="${main_view.base_url}/assets/images/logo/photo_report.png" alt=""/>
                </div>
                <div class="d-flex align-items-center flex-column mt-2 gap-2">
                    <h5 style="font-family: 'Moul', cursive">បង្កាន់ដៃទទួលប្រាក់សរុប</h5>
                    <h6>Total Official Receipt</h6>
                </div>
            </div>
            <div class="d-flex align-items-end w-100 flex-column">
                <p class="pb-0 mb-1">
                    <span class="fw-semibold">Receipt No.</span>
                    <span class="px-2">:</span>
                    <span></span>
                </p>
                <p class="pb-0 mb-1">
                    <span class="fw-semibold">Date</span>
                    <span class="px-2">:</span>
                </p>
            </div>`].join('');
            div.html(html);
        }
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.loadFormDetails(mThis.elBody,options,() => {
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    InvoicesComponent.init();
});
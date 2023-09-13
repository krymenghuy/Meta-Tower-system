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
                        else{
                            cv_interact.error(res.error_message);
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
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

let InvoiceDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_inv_');

    this.elBody = mThis.self.find('#dlg_elBody');
    this.btnPrint = mThis.self.find('#dlg_inv_btn_save');
    this.htmlString = null;

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        if(mThis.htmlString){
            windowPrintInvoice(mThis.htmlString);
        }
    });

    this.loadFormDetails = (div,op,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/invoice/receipt-details`,{'invoice_id': op.invoice_id},null).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                mThis.prepareData(div,d);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.prepareData = (div,d) => {
        d = d ? d : {};
        if(d && !($.isEmptyObject(d))){
            const invoice = d.invoice ? d.invoice : {},
            company_info = d.company_profile ? d.company_profile : {},
            cur_symbol = '$';
            let html = null, tbl_html = null;

            html = [`<div class="d-flex align-items-center flex-column">
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
                    <span>${invoice.invoice_number ? invoice.invoice_number : 'N/A'}</span>
                </p>
                <p class="pb-0 mb-1">
                    <span class="fw-semibold">Date</span>
                    <span class="px-2">:</span>
                    <span>${invoice.tuition_end_date ? invoice.tuition_end_date : 'N/A'}</span>
                </p>
            </div>
            <div class="d-flex align-items-center justify-content-lg-between gap-2 mt-2">
                <p class="text-nowrap">
                    <span>ឈ្មោះសិស្ស / Student's Name</span>
                    <span class="px-2">:</span>
                    <span class="fw-bold text-capitalize">${invoice.name ? invoice.name : 'N/A'}</span>
                </p>
                <p class="text-nowrap">
                    <span>ភេទ / Gender</span>
                    <span class="px-2">:</span>
                    <span class="fw-bold text-capitalize">${invoice.sex === 'M' ? 'Male' : 'Female'}</span>
                </p>
                <p class="text-nowrap">
                    <span>ថ្នាក់ / Class</span>
                    <span class="px-2">:</span>
                    <span class="fw-bold text-capitalize">${invoice.level ? invoice.level : 'N/A'}</span>
                </p>
                <p class="text-nowrap">
                    <span>Time</span>
                    <span class="px-2">:</span>
                    <span class="fw-bold text-capitalize">${invoice.session ? invoice.session : 'N/A'}</span>
                </p>
                <p class="text-nowrap">
                    <span>Campus</span>
                    <span class="px-2">:</span>
                    <span class="fw-bold text-capitalize">${invoice.campus ? invoice.campus : 'N/A'}</span>
                </p>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr class="text-nowrap">
                            <th rowspan="2" class="text-center align-middle">No</th>
                            <th rowspan="2" class="text-center align-middle">Description</th>
                            <th colspan="2" class="text-center align-middle">Payment Period</th>
                            <th rowspan="2" class="text-center align-middle">Duration</th>
                            <th rowspan="2" class="text-center align-middle">Amount</th>
                        </tr>
                        <tr>
                            <th class="text-center align-middle">From</th>
                            <th class="text-center align-middle">To</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tbl_html=null,invoice && invoice.invoice_info.map((inv,i) => {
                            tbl_html = [tbl_html,`<tr class="text-nowrap">
                                <td class="text-center align-middle">${i+1}</td>
                                <td class="text-capitalize align-middle">${inv.fee_type ? inv.fee_type.replace('_',' ') : 'N/A'}</td>
                                <td class="text-center align-middle">${inv.start_date ? new Date(inv.start_date).toLocaleDateString('km-KH',{
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }).replace(',','') : 'N/A'}</td>
                                <td class="text-center align-middle">${inv.end_date ? new Date(inv.end_date).toLocaleDateString('km-KH',{
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }).replace(',','') : 'N/A'}</td>
                                <td class="text-wrap text-center align-middle text-capitalize">${inv.duration ? inv.duration : 'N/A'}</td>
                                <td class="align-middle">${inv.net_amount ? [cur_symbol,inv.net_amount].join(' ') : [cur_symbol,'-'].join(' ')}</td>
                            </tr>`].join('')
                        }),tbl_html ? tbl_html : ''}
                        <tr class="text-nowrap">
                            <td rowspan="5" colspan="4">
                                <div class="w-100 h-100 d-flex flex-column gap-2 px-3">
                                    <div class="d-block">
                                        <p>
                                            <sup>*</sup>
                                            <span class="text-decoration-underline">Method of payment</span>
                                        </p>
                                    </div>
                                    <div class="d-flex gap-3 align-items-center">
                                        <p class="fixed-width-p p-0 m-0">Cash</p>
                                        <div class="box-size-invoice border rounded-3"></div>
                                    </div>
                                    <div class="d-flex gap-3 align-items-center">
                                        <p class="fixed-width-p p-0 m-0">Transfer</p>
                                        <div class="box-size-invoice border rounded-3"></div>
                                    </div>
                                    <div class="d-flex gap-3 align-items-center">
                                        <p class="fixed-width-p p-0 m-0">Cheque</p>
                                        <div class="box-size-invoice border rounded-3"></div>
                                        <span>Bank (${('.').repeat(30)}) No (${('.').repeat(30)})</span>
                                    </div>
                                </div>
                            </td>
                            <td class="align-middle text-end">Total</td>
                            <td class="align-middle">${invoice.total ? [cur_symbol,invoice.total].join(' ') : [cur_symbol,'0.00'].join(' ')}</td>
                        </tr>
                        <tr class="text-nowrap">
                            <td class="align-middle text-end">Test Fee Returns</td>
                            <td class="align-middle">${invoice.test_fee ? [cur_symbol,invoice.test_fee].join(' ') : [cur_symbol,'0.00'].join(' ')}</td>
                        </tr>
                        <tr class="text-nowrap">
                            <td class="align-middle text-end">Amount Due</td>
                            <td class="align-middle">${invoice.amount_due ? [cur_symbol,invoice.amount_due].join(' ') : [cur_symbol,'0.00'].join(' ')}</td>
                        </tr>
                        <tr class="text-nowrap">
                            <td class="align-middle text-end">Paid</td>
                            <td class="align-middle">${invoice.paid_amount ? [cur_symbol,invoice.paid_amount].join(' ') : [cur_symbol,'0.00'].join(' ')}</td>
                        </tr>
                        <tr class="text-nowrap">
                            <td class="align-middle text-end">Unpaid</td>
                            <td class="align-middle">${invoice.unpaid_amount ? [cur_symbol,invoice.unpaid_amount].join(' ') : [cur_symbol,'0.00'].join(' ')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex gap-2">
                <p class="fw-bold text-capitalize pe-2">Amount in word:</p>
                <p class="text-capitalize">${(invoice.paid_amount && parseInt(invoice.paid_amount) > 0) ? convertCurrencyToWords(invoice.paid_amount) : 'N/A'}</p>
            </div>
            <div class="d-flex gap-2">
                <p class="fw-bold text-capitalize">
                    <sup class="fw-bold">*</sup>Remarks:
                </p>
                <p>${invoice.remarks ? invoice.remarks : ('_').repeat(85)}</p>
            </div>
            <div class="d-flex px-5 justify-content-between mt-3">
                <div class="d-block">
                    <p>អ្នកទទួលប្រាក់ / Receiver</p>
                    <p>${invoice.receiver ? invoice.receiver : ('.').repeat(40)}</p>
                </div>
                <div class="d-block">
                    <p>អ្នកបង់ប្រាក់ / Payer</p>
                    <p>${('.').repeat(40)}</p>
                </div>
            </div>
            <div class="mt-2">
                <p class="text-nowrap fw-bold">
                    <sup class="fw-bold">***</sup>Note:
                    All Payments cannot be returned or transferred & All payments shall only be made in school office or via bank.
                </p>
            </div>
            <hr style="height:1px" class="bg-black m-0 p-0"/>
            <div class="d-block mt-2">
                <span class="fw-bold pe-3">អាស័យដ្នាន៖</span>
                <span>${company_info.address ? company_info.address : 'N/A'}</span>
            </div>
            <div class="d-block mt-2">
                <span class="fw-bold pe-3">Address</span>
                <span>${company_info.address_kh ? company_info.address_kh : 'N/A'}</span>
            </div>
            <div class="d-flex justify-content-center gap-3 mt-3">
                <div class="d-flex gap-2 align-items-center">
                    <i class="fa-regular fa-envelope fs-4"></i>
                    <span>${company_info.email ? company_info.email : 'N/A'}</span>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <i class="fa-solid fa-phone fs-4"></i>
                    <span>${company_info.phone_number ? company_info.phone_number : 'N/A'}</span>
                </div>
            </div>`].join('');
            mThis.htmlString = html;
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
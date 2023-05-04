"use strict";
let InvoiceSettings = new function () {
    this.currency = { 'code': 'USD', 'symbol': '$' };
    this.default_discount_type = 'percentage';
    this.default_price_type = 'retail';
    this.init = () => {
        return;
    }
}

let InvoicesComponent = new function () {
    this.retail_sales = 1;
    let mThis = this;
    this.title_prop = 'Invoices';
    this.self = $('#_main_invoicesComponent');
    this.tblInvoice = $('#_inv_tblInvoice');
    this.invoiceTable = null;
    this.elSearchInvoice = $('#_inv_search_invoice');
    this.invoiceListView =null;

    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.btnNewInvoice = $('#_invs_btnNewInvoice');

     
    //col_titles for caching language transaltion
    this.col_titles = {
        "No": "No",
        "Ref Number": "Invoice Number",
        "Customer": "Customer",
        "Issue Date": "Issue Date",
        "Due Date": "Due Date",
        "Amount Due": "Amount Due",
        "Paid": "Paid",
        "Pmt Status": "Pmt Status",
        "Action": "Action"
    };

    this.formatInvoiceAmount = (currency_code = 'USD', amount = 0) => {
        let cur_symbol = ExchangeManager.currencies[currency_code].symbol;
        return [cur_symbol, amount].join('');
    }

    // this.setLanguage = () => {
    //     if (LocaleManager.lang !== mThis.lang) {
    //         for (let prop in mThis.col_titles) {
    //             mThis.col_titles[prop] = LocaleManager.trans(prop, 'invoice', LocaleManager.lang);
    //         }
    //         mThis.lang = LocaleManager.lang;
    //     }
    // }

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'Undefined');
    }

     this.invoice_columns = [
            {
            title:'Invoice Number',
            data:(data, index, tr) => {
                return `<a href="javascript:void(0)" class="text-nowrap btn_print_invoice fw-bold" data-id="${data.id}" data-refnumber="${data.ref_number}"><i class="fa fa-print"></i>&nbsp;${data.ref_number}</a>`;
            }
            },
            {
            title:'Customer',
            data:(data, index, tr) => {
                return [`<span class="d-block fw-bold customer-name">`, data.customer_name, `</span>`,
                    `<i class="fa fa-solid fa-square-phone p-1"></i><span class="small text-left p-1">`, data.customer_phone, `</span>`].join('');
            } 
            },
            {
            title:'Issue Date',
            data:'issue_date' 
            },
            {
            title:'Due Date',
            data:'due_date' 
            },
            {
            title:'Amount',
            data:(data, index, tr) => {
                return this.formatInvoiceAmount(data.currency_code, data.amount_due);
            }
            },
            {
            className: 'col-amount-paid',
            title: "Paid",
            data: (data, index, tr) => {
                return this.formatInvoiceAmount(data.currency_code, data.amount_paid);
            }
            },
            {
            className: "col-pmt-status",
            title: mThis.trans_title("Pmt Status"),
            data: (data, a, b) => {
                return mThis.generatePmtStatus(data);
            }
        },
        {
            title: mThis.trans_title("Action"),
            data: (data, index, tr) => {
                let html = [`<div class="d-flex align-items-center gap-2">
                <a href="javascript:void(0)" class="btn-ivc-receivepmt" data-id="${data.id}">
                <i class="fa fa-credit-card text-success"></i>
                </a>
                <a href="javascript:void(0)" class="btn-ivc-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-secondary"></i>
                </a>
                <a href="javascript:void(0)" class="btn-ivc-delete" data-id="${data.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </a>
            </div>`].join();
                return html;
            }
        }
        ];
        

    this.init = () => {
        InvoiceSettings.init();

        mThis.invoiceListView = new ListView('_ivc_list_container',{
            'fetchApi':`${main_view.base_url}/api/invoice/list-paginate`,
            'columns': this.invoice_columns,
            'perPage':10, 
            'tableClass':'table header-light-blue header-uppercase',
            'rowCreated':(data,index,tr)=>{
                tr.setAttribute('id', `ivc_${data.id}`);
                tr.dataset.id = data.id;
             }
          });

       
        //vannila javascript table object. NOTE that "this.invoiceTable" is also used somewhere in this InvoiceComponent.js
        this.invoiceTable = mThis.invoiceListView.getTable();
        //for jquery operations such as mThis.tblInvoice.on('click',()=>{ .... })
        this.tblInvoice = $(mThis.invoiceListView.getTable());
        this.cfg = new ExpandableRowConfig(this.invoiceTable.getAttribute('id'), {
            'dontExpandByClickingOn': ['btn_print_invoice', 'btn-ivc-receivepmt', 'btn-ivc-modify', 'btn-ivc-delete'],
            'wrapperClass': 'invoice-pmt-wrapper',
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let invoice_id = qtr.data('id');
                mThis.displayInvoicePayments(detail_tr, invoice_id);
            }
        });
 
        this.tblInvoice.on('click', 'a.btn-ivc-delete', function (e) {
            e.preventDefault();
            let invoice_id = $(this).data('id');
            let tr = $(this).closest('tr');
            let p = { 'id': invoice_id };
            cv_interact.confirm('Delete this invoice?', { 'title': "Delete Invoice", 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${main_view.base_url}/api/invoice/delete`, p, null, null).then(res => {
                        if (res.status_code === 200) {
                            mThis.refreshInvoiceInfo(tr.prev(), res.data);
                            mThis.invoiceListView.showPage({'search_value':mThis.elSearchInvoice.val()});
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        this.tblInvoice.on('click', 'a.btn-ivc-modify', function (e) {
            e.preventDefault();
            let invoice_id = $(this).data('id');
            let tr = $(this).closest('tr');
            let op = {
                'id': invoice_id,
                'onClose': function (data) {
                    mThis.displayInvoices();
                }
            };
            InvoiceDialog.show(op);
        });

        this.tblInvoice.on('click', 'a.btn-ivc-receivepmt', function (e) {
            e.preventDefault();
            let x = $(this);
            let invoice_id = e.target.dataset.id ? e.target.dataset.id : x.data('id');
            let tr = mThis.invoiceTable.querySelector(`#ivc_${invoice_id}`);
            let op = {
                'invoice_id': invoice_id,
                'id': null,
                'onClose': function (data) {
                    mThis.refreshInvoiceInfo(invoice_id, data);
                    if (tr.nextSibling) mThis.displayInvoicePayments(tr.nextSibling, invoice_id);
                }
            };
            PaymentDialog.show(op);
        });

        this.tblInvoice.on('click', 'a.btn_print_invoice', function (e) {
            e.preventDefault();
            let id = $(this).data('id');
            let qString = ['rtype=rpt_invoice&id=', id].join('');
            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/geninvoice/', d].join(''), '_blank');
            });
        });

        this.btnNewInvoice.on('click', (e) => {
            e.preventDefault();
            let op = {
                onClose: (data) => {
                    if (data) {
                        mThis.invoiceListView.showPage(null);
                    }
                }
            };
            InvoiceDialog.show(op);
        });

        this.elSearchInvoice.on('keyup', function (e) {
            e.preventDefault();
            let d = mThis.elSearchInvoice.val();
            if ((d + '').length >= 3 || !d)  mThis.invoiceListView.showPage({'search_value':mThis.elSearchInvoice.val()});
        });
 
        mThis.tblInvoice.on('click', 'a.ivc-pmt-edit', e => {
            let x = $(e.currentTarget);
            let pmt_id = x.data('id');
            let invoice_id = x.data('invoiceid');
            let invoiceRowId = ['ivc_', invoice_id].join('');
            let op = {
                "id": pmt_id, 'invoice_id': invoice_id,
                'onClose': function (data) {
                    mThis.refreshInvoiceInfo(invoice_id, data);
                    let tr = mThis.invoiceTable.querySelector(`#${invoiceRowId}`);
                    mThis.displayInvoicePayments(tr.nextElementSibling, invoice_id);
                }
            };
            PaymentDialog.show(op);
        });

        mThis.tblInvoice.on('click', 'a.ivc-pmt-delete', function (e) {
            let x = $(this);
            let pmt_id = x.data('id');
            let invoice_id = x.data('invoiceid');
            let p = { "id": pmt_id };
            let invoiceRowId = ['ivc_', invoice_id].join('');
            cv_interact.confirm("Delete this payment?", { "title": "Delete payment", 'context': "delete" }, e => {
                if (e) {
                    vsapi.call(`${main_view.base_url}/api/invoice-payment/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            let invoiceInfo = StringSanitizer.sanitizeObject(res.data);
                            mThis.refreshInvoiceInfo(invoiceInfo.id, invoiceInfo);
                            let tr = mThis.invoiceTable.querySelector(`#${invoiceRowId}`);
                            mThis.displayInvoicePayments(tr.nextElementSibling, invoice_id);
                        }
                    });
                }
            });
        });

        mThis.tblInvoice.on('click', '.ivc-pmt-print', function (e) {
            let pmt_id = $(this).data('id');
            let qString = ['id=', pmt_id].join('');

            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/receipt/', d].join(''), '_blank');
            });
        });
    };

    this.displayInvoicePayments = (detail_tr, invoice_id = 0) => {
        let div_wrapper = detail_tr.querySelector('div.expandable-row-container');
        div_wrapper.innerHTML = '<div class="animation-line" style="height:2px;margin:0;"></div>';
        let p = { 'invoice_id': invoice_id };
        let div_id = ['ivc_pmt_wrapper_', invoice_id].join('');
        let inner_table_body_id = [div_id, '_pmts_', invoice_id].join('');

        window.vsapi.call(`${main_view.base_url}/api/invoice/payments-with-summary`, p, null, false).then((res) => {
            if (res.status_code === 200) {

                let d = StringSanitizer.sanitizeObject(res.data);
                if (!d) {
                    div_wrapper.innerHTML = "";
                    return;
                }
                let epanel = detail_tr.querySelector(`#${div_id}`);

                let tr = detail_tr.previousElementSibling;
                if (tr) {
                    d.amount_paid = d.amount_paid ? d.amount_paid : 0;
                    tr.querySelector('.col-amount-paid').textContent = mThis.formatInvoiceAmount(d.currency_code, Number(d.amount_paid).toFixed(2));
                    tr.querySelector('.btn-pmt-status').textContent = d.pmt_status;
                }

                if (!epanel) {
                    let html = `<div id="${div_id}" data-invoiceid="${d.invoice_id}" data-pmtstatus="${d.pmt_status}" class="invoice-pmt-wrapper shadow-lg d-flex" style="width:100%;">
                                    <div class="d-flex" style="width:100%">
                                    <table class="table payment-table">
                                    <thead>
                                        <tr>
                                            <th>Ref Number</th>
                                            <th>Payment Date</th>
                                            <th>Amount</th>
                                            <th>Tax Amount</th>
                                            <th>Method</th>
                                            <th>Received By</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody id="${inner_table_body_id}">
                                        ${mThis.generatePaymentRows(invoice_id, d.currency_code, d.payments)}
                                    </tbody>
                                    
                                    </table>       
                                    </div>
                                </div>`;
                    div_wrapper.innerHTML = html;
                } else {
                    let tbody = div_wrapper.querySelector(inner_table_body_id);
                    tbody.innerHTML = mThis.generatePaymentRows(invoice_id, d.currency_code, d.payments);
                }

            } else div_wrapper.innerHTML = `<div class="expanded-row-error">${res.error_message}</div>`;

        });
    }

    this.generatePaymentRows = (invoice_id, currency_code, rows = []) => {
        let html = "";
        let cur_symbol = ExchangeManager.currencies[currency_code].symbol;
        let cnt = 0;
        rows.map(c => {
            html = [html, `<tr><td><a href="javascript:void(0)" class="btn_print_pmt fw-bold" data-id="${c.id}">${c.ref_number}</a></td><td>${c.payment_date}</td><td>${cur_symbol}${c.amount}</td><td>${cur_symbol}${c.tax_amount}</td><td>${c.pmt_method}</td><td><span class="d-block">${c.create_user}</span><span class="d-block text-secondary text-sm-left p-2">${c.notes ? c.notes : ''}</span></td>
         <td class="col-action">
         <a href="javascript:void(0)" class="ivc-pmt-edit" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-edit text-secondary"></i></a>
         <a href="javascript:void(0)" class="ivc-pmt-delete" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-trash"></i></a>
         <a href="javascript:void(0)" class="ivc-pmt-print" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-print"></i></a>
         </td></tr>`].join('');
            cnt++;
        });
        if (cnt === 0) {
            let empty_text = LocaleManager.trans('No payments to display');
            return `<tr><td colspan="100%" class="text-center"><span class="text-secondary text-nowrap fw-bold">${empty_text ? empty_text.toUpperCase() : ''}</span></td></tr>`;
        }
        return html;
    }

    // this.displayInvoices = (onFinish = null) => {
    //     let p = { 'search_value': mThis.elSearchInvoice.val() };
    //     window.vsapi.call(`${mThis.base_url}/api/invoice/list`, p).then(res => {
    //         let data = [];
    //         if (res.status_code === 200) data = StringSanitizer.sanitizeObject(res.data, null, ['ref_number']);

    //         if (mThis.table) {
    //             mThis.tblInvoice.DataTable().clear().destroy();
    //             mThis.tblInvoice.empty();
    //             mThis.table = null;
    //         }

    //         let columns = [
    //             {
    //                 title: mThis.trans_title("Ref Number"),
    //                 data: (data, a, b) => {
    //                     return `<a href="javascript:void(0)" class="text-nowrap btn_print_invoice fw-bold" data-id="${data.id}" data-refnumber="${data.ref_number}"><i class="fa fa-print"></i>&nbsp;${data.ref_number}</a>`;
    //                 }
    //             }, {
    //                 title: mThis.trans_title("Customer"),
    //                 data: (data, a, b) => {
    //                     return [`<span class="d-block fw-bold customer-name">`, data.customer_name, `</span>`,
    //                         `<i class="fa fa-solid fa-square-phone p-1"></i><span class="small text-left p-1">`, data.customer_phone, `</span>`].join('');
    //                 }
    //             },
    //             {
    //                 title: mThis.trans_title("Issue Date"),
    //                 data: "issue_date"
    //             },
    //             {
    //                 title: mThis.trans_title("Due Date"),
    //                 data: "due_date"
    //             },
    //             {
    //                 title: mThis.trans_title("Amount Due"),
    //                 data: (data, a, b) => {
    //                     return this.formatInvoiceAmount(data.currency_code, data.amount_due);
    //                 }
    //             },
    //             {
    //                 className: 'col-amount-paid',
    //                 title: mThis.trans_title("Paid"),
    //                 data: (data, a, b) => {
    //                     return this.formatInvoiceAmount(data.currency_code, data.amount_paid);
    //                 }
    //             },
    //             {
    //                 className: "col-pmt-status",
    //                 title: mThis.trans_title("Pmt Status"),
    //                 data: (data, a, b) => {
    //                     return mThis.generatePmtStatus(data);
    //                 }
    //             },
    //             {
    //                 title: mThis.trans_title("Action"),
    //                 data: (data, a, b) => {
    //                     let html = [`<div class="d-flex align-items-center gap-2">
    //                     <a href="javascript:void(0)" class="btn-ivc-receivepmt" data-id="${data.id}">
    //                     <i class="fa fa-credit-card text-success"></i>
    //                     </a>
    //                     <a href="javascript:void(0)" class="btn-ivc-modify" data-id="${data.id}">
    //                         <i class="fa-regular fa-pen-to-square text-secondary"></i>
    //                     </a>
    //                     <a href="javascript:void(0)" class="btn-ivc-delete" data-id="${data.id}">
    //                         <i class="fa-solid fa-trash-can"></i>
    //                     </a>
    //                 </div>`].join();
    //                     return html;
    //                 }
    //             }];

    //         if (!mThis.table) {
    //             mThis.table = mThis.tblInvoice.DataTable({
    //                 searching: false,
    //                 destroy: true,
    //                 paging: true,
    //                 ordering: false,
    //                 retrieve: true,
    //                 info: true,
    //                 pageLength: 10,
    //                 bLengthChange: false,
    //                 saveState: true,
    //                 'processing': true,
    //                 'language': {
    //                     'loadingRecords': '&nbsp;',
    //                     'processing': 'Loading...',
    //                     "emptyTable": LocaleManager.trans('No data to display', 'datatable')
    //                 },
    //                 'data': data,
    //                 'columns': columns,
    //                 "createdRow": function (row, data, dataIndex) {
    //                     let tr = $(row);
    //                     tr.attr('id', `ivc_${data.id}`);
    //                     tr.data('id', data.id);
    //                 }
    //             });
    //         }
    //         if (typeof onFinish === 'function') onFinish();
    //     });
    // }

    this.generatePmtStatus = (d) => {
        let amount_paid = Number(d.amount_paid);
        let pmt_status = (Number(d.amount_due) <= amount_paid) ? 'Paid' : (amount_paid > 0 ? 'Partially Paid' : 'Unpaid');
        return [`<button class="btn btn-sm ${mThis.getPmtStatusClass(pmt_status)} btn-pmt-status">`, pmt_status, `</button>`].join('');
    }

    this.getPmtStatusClass = (s) => {
        let p = (s || '').toLowerCase();
        switch (p) {
            case 'paid': {
                return 'btn-outline-success';
            }

            case 'partially paid': {
                return 'btn-outline-primary';
            }

            case 'partially-paid': {
                return 'btn-outline-primary';
            }
            default: {
                return 'btn-outline-danger';
            }
        }
    }

    this.refreshInvoiceInfo = (invoice_id, d) => {
        if (!d) return;
        let cur_symbol = (ExchangeManager.currencies[d.currency_code] || {}).symbol;
        if (!cur_symbol) cur_symbol = 'CUR?';

        if (!d.amount_paid) d.amount_paid = d.total_paid;
        let tr = mThis.tblInvoice.find(`tbody > tr#ivc_${invoice_id}`);
        tr.find('td.col-amount-paid').html(mThis.formatInvoiceAmount(d.currency_code, d.amount_paid));
        tr.find('td.col-pmt-status').html(mThis.generatePmtStatus(d));
    }

    this.show = (option = null) => {
        if (!option) option = {};
        mThis.invoiceListView.showPage(null,null,()=>{
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}

let InvoiceDialog = new function () {
    let mThis = this;
    this.self = $('#_invs_dlgNewInvoice');
    this.Invoice_Title = $('#_invs_dlgInvoice_title');
    this.elReceiptNumber = $('#ivc_ref_number');

    this.btnSave = $('#_invs_dlgNewInvoice_btnSave');
    this.lnkAddInvoice = $('#_invs_lnkAddInvoice');
    this.base_url = $('#__base_url').val();
    this.elPmtTerms = $('#_inv_pmt_terms');

    this.lnkAddCustomer = $('_inv_lnkAddCustomer');
    this.elCustomer = $('#_inv_customer');
    this.elCustomerEmail = $('#_inv_customer_email');
    this.elCustomerPhone = $('#_inv_customer_phone');
    this.elCustomerType = $('#_inv_customer_type');
    this.elCustomerAddress = $('#_inv_customer_address');

    this.options = {};
    this.elSummary_balanceDue = $('#ivc_balance_due');
    this.elSummary_subTotal = $('#ivc_sub_total');
    this.elSummary_discount = $('#ivc_discount');
    this.elSummary_taxAmount = $('#ivc_tax_amount');
    this.elSummary_grandTotal = $('#ivc_grand_total');

    this.div_item_panel = $('#_ivc_items_panel');
    this.div_product_panel = $('#_ivc_product_panel');
    this.div_service_panel = $('#_ivc_service_panel');

    this.cols_product = [{
        "name": "item_id",
        "displayName": "item_name",
        "title": "Item Name",
        "dataType": "string",
        "displayType": "select",
        "width": "30%"
    },
    {
        "name": "qty",
        "title": "Quantity",
        "dataType": "number",
        "defaultValue": 1,
        "displayType": "input"
    },
    {
        "name": "sku",
        "title": "SKU",
        "dataType": "string",
        "displayType": "input",
        "readOnly": true
    },
    {
        "currencySymbol": mThis.cur_symbol,
        "name": "price",
        "title": "Price",
        "dataType": "number",
        "displayType": "input"
    },
    {
        "showPercentage": true,
        "name": "discount_percent",
        "title": "Discount (%)",
        "dataType": "number",
        "displayType": "input"
    },
    {
        "isPercentage": true,
        "name": "tax_rate",
        "title": "Tax (%)",
        "dataType": "number",
        "displayType": "input"
    },
    {
        "currencySymbol": mThis.cur_symbol,
        "name": "line_total",
        "title": "Line Total",
        "dataType": "number",
        "displayType": "input",
        "readOnly": true
    }];

    this.cols_service = [{
        "name": "item_id",
        "title": "Service",
        "dataType": "string",
        "displayType": "select",
        "width": "250px"
    }, {
        "name": "qty",
        "title": "Qty",
        "dataType": "number",
        "displayType": "input"
    },
    {
        "name": "price",
        "title": "Price",
        "dataType": "number",
        "displayType": "input"
    },
    {
        "name": "discount_percent",
        "title": "Discount(%)",
        "isPercentage": true,
        "dataType": "number",
        "displayType": "input"
    },
    {
        "name": "tax_rate",
        "title": "Tax",
        "isPercentage": true,
        "dataType": "number",
        "displayType": "input"
    }, {
        "name": "line_total",
        "title": "Line Total",
        "dataType": "number",
        "displayType": "input",
        "readOnly": true
    }];

    //begin::Event hendlers for InvoiceDialog
    this.elCustomer.on('change', e => {
        let p = { 'id': mThis.elCustomer.val() };
        vsapi.call(`${main_view.base_url}/api/invoice/customer-info`, p, null, false).then(res => {
            if (res.status_code === 200) {
                let cus = StringSanitizer.sanitizeObject(res.data);
                mThis.elCustomerEmail.val(cus.email);
                mThis.elCustomerAddress.val(cus.billing_address);
                mThis.elCustomerPhone.val(cus.phone_number).trigger('change');
                mThis.elCustomerType.val('Individual').trigger('change');
            }
        });
    });
    //end:: Event hendlers for InvoiceDialog

    this.initItemsView = () => {
        mThis.initServiceItemView();
        mThis.initProductItemView();
        mThis.itemTabs = {
            'product': {
                'pane': mThis.div_product_panel,
                'tabButtonClass': 'tab-item-product'
            },
            'service': {
                'pane': mThis.div_service_panel,
                'tabButtonClass': 'tab-item-service'
            }
        }
        mThis.self.on('click', '.tab-item', function (e) {
            e.preventDefault();
            let viewname = $(this).data("viewname");
            mThis.setActiveItemView(viewname);
        });
    }

    this.initServiceItemView = () => {
        mThis.tblServiceItems = new ItemsView('_ivc_service_panel', {
            columns: mThis.cols_service,
            showColumnHeaders: true,
            showAddLineButton: true,
            validateColumns: { 'item_id': 'string', 'qty': 'number', 'price': 'number' },
            onItemChange: (row_id, item, cols_name, td, tr) => {
                mThis.setItemServiceInfo(cols_name, tr);
            },
            onInputChange: (el, col_name, td) => {
                let tr = td.parentNode;
                mThis.setLineTotal_service(tr);
            },
        });
    }

    this.setItemServiceInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.tblServiceItems.getDataRow(tr);
            let p = { 'id': d.item_id }; //d.item_id is, in fact, the d.service_id
            vsapi.call(`${mThis.base_url}/api/service/info`, p, null, false).then(res => {
                if (res.status_code === 200) {
                    let item = res.data ? res.data : {};
                    mThis.tblServiceItems.setCellValue(tr, 'qty', 1);
                    mThis.tblServiceItems.setCellValue(tr, 'price', item.price);
                    mThis.tblServiceItems.setCellValue(tr, 'tax_rate', item.tax_rate);
                    mThis.setLineTotal_service(tr);
                }
            });
        }
    }

    this.initProductItemView = () => {
        mThis.tblProductItems = new ItemsView('_ivc_product_panel',
            {
                columns: mThis.cols_product,
                showColumnHeaders: true,
                showAddLineButton: true,
                validateColumns: { 'item_id': 'string', 'qty': 'number', 'price': 'number' },
                maxRows: 5,
                onItemChange: (row_id, sitem, col_name, td, tr) => {
                    mThis.setItemInfo(col_name, tr);
                },
                onInputChange: (el, col_name, td) => {
                    let tr = td.parentNode;
                    mThis.setLineTotal_product(tr);
                },
                onItemDeleted: (row_id, tr) => {
                    mThis.setTotals(null);
                }
            });
    }

    this.setItemInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.tblProductItems.getDataRow(tr);
            let p = { 'id': d.item_id };

            vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                if (res.status_code === 200) {
                    let item = res.data ? res.data : {};
                    mThis.tblProductItems.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                    let price = item.ws_selling_price;
                    if (InvoiceSettings.default_price_type === 'retail') price = item.selling_price;
                    mThis.tblProductItems.setCellValue(tr, 'price', price);
                    mThis.tblProductItems.setCellValue(tr, 'qty', 1);
                    mThis.tblProductItems.setCellValue(tr, 'tax_rate', item.sales_tax_rate >= 0 ? item.sales_tax_rate : 0);
                    mThis.setLineTotal_product(tr);
                }
            });
        }
    }

    this.calculateInvoiceDiscount = (discount = 0, sub_total = 0) => {
        discount = isNaN(discount) ? 0 : discount;
        let discount_type = InvoiceSettings.default_discount_type;

        if (discount_type === 'percentage' || discount_type === 'percent') {
            return {
                'discount_type': 'percentage',
                'discount_percent': discount,
                'discount_amount': Number((sub_total * discount / 100))
            };
        } else {
            return {
                'discount_type': 'amount',
                'discount_percent': Number((discount * 100) / sub_total),
                'discount_amount': discount
            };
        }
    }

    this.getCurrencySymbol = (l) => {
        return mThis.currency_symbol ? mThis.currency_symbol : InvoiceSettings.currency.symbol;
    }

    this.setLineTotal_product = (tr) => {
        let cur_symbol = mThis.getCurrencySymbol();
        let d = mThis.tblProductItems.getDataRow(tr);

        let price = parseFloat(d.price);
        let qty = parseFloat(d.qty);
        let discount_percent = parseFloat(d.discount_percent);
        let line_total = price * qty;
        let discount_amt = line_total * discount_percent / 100;

        let tax_rate = parseFloat(d.tax_rate);
        let tax_amount = (line_total - discount_amt) * tax_rate / 100;
        line_total = isNaN(line_total) ? 0 : line_total - discount_amt + tax_amount;
        d.line_total = line_total;
        mThis.tblProductItems.setCellValue(tr, 'line_total', d.line_total);
        mThis.setTotals(cur_symbol);
    }

    this.setLineTotal_service = (tr) => {
        let cur_symbol = mThis.getCurrencySymbol();
        let d = mThis.tblServiceItems.getDataRow(tr);
        let price = parseFloat(d.price);
        let qty = parseFloat(d.qty);
        let discount_percent = parseFloat(d.discount_percent);
        let line_total = price * qty;
        let discount_amt = line_total * discount_percent / 100;

        let tax_rate = parseFloat(d.tax_rate);
        let tax_amount = (line_total - discount_amt) * tax_rate / 100;
        line_total = isNaN(line_total) ? 0 : line_total - discount_amt + tax_amount;
        d.line_total = line_total;
        mThis.tblServiceItems.setCellValue(tr, 'line_total', d.line_total);
        mThis.setTotals(cur_symbol);
    }

    this.setTotals = (cur_symbol = null) => {
        if (!cur_symbol) cur_symbol = mThis.getCurrencySymbol();
        let sub_total = 0;
        let total_tax = 0;

        let items = mThis.tblProductItems.getItems();
        (items || []).map(i => {
            let line_total = parseFloat(i.line_total);
            let tax_rate = parseFloat(i.tax_rate);
            let amount_before_tax = (line_total * 100) / (100 + tax_rate);
            let tax_amt = line_total - amount_before_tax;
            total_tax += parseFloat(tax_amt);
            sub_total += parseFloat(line_total);
        });

        let service_items = mThis.tblServiceItems.getItems();
        (service_items || []).map(i => {
            let line_total = parseFloat(i.line_total);
            let tax_rate = parseFloat(i.tax_rate);
            let amount_before_tax = (line_total * 100) / (100 + tax_rate);
            let tax_amt = line_total - amount_before_tax;
            total_tax += parseFloat(tax_amt);
            sub_total += parseFloat(line_total);
        });
        sub_total = isNaN(sub_total) ? 0 : sub_total;
        total_tax = isNaN(total_tax) ? 0 : total_tax;
        let discount_base = sub_total - total_tax;
        let discountInfo = mThis.calculateInvoiceDiscount(mThis.elSummary_discount.val(), Number(discount_base));

        let grand_total = Number(sub_total - discountInfo.discount_amount).toFixed(2);
        mThis.elSummary_subTotal.text([cur_symbol, ' ', sub_total].join(''));
        mThis.elSummary_taxAmount.text([cur_symbol, ' ', Number(total_tax).toFixed(2)].join(''));
        mThis.elSummary_grandTotal.text([cur_symbol, ' ', grand_total].join(''));
        mThis.elSummary_balanceDue.text([cur_symbol, ' ', grand_total].join(''));
    }

    this.initItemsView();

    this.elSummary_discount.on('keyup', (e) => {
        e.preventDefault();
        mThis.setTotals();
    });

    this.lnkAddInvoice.on('click', (e) => {
        e.preventDefault();
        let op = {
            'id': 0,
            "previousComponent": mThis,
            "previousComponentOptions": mThis.options,
            "onClose": res => {
                if (res.status_code === 200) {
                    alert('New Customer created => ' + JSON.stringify(res));
                }
            }
        };
        CustomerDialog.show(op);
    });

    this.btnSave.on('click', (e) => {
        e.preventDefault();
        let p = mThis.getDataForm();
 
        let api_endpoint = `${mThis.base_url}/api/invoice/create`;
        if (p.id > 0) api_endpoint = `${mThis.base_url}/api/invoice/update`;
        vsapi.call(api_endpoint, p, 'POST', null).then(res => {
            if (res.status_code === 200) {
                p.created = !p.id;
                if (p.created)
                    cv_interact.success(['Invoice ', res.data.ref_number, ' created!'].join(''));
                else
                    cv_interact.info(['Invoice ', res.data.ref_number, ' updated!'].join(''));
                if (typeof mThis.onClose === 'function') mThis.onClose(p);
                mThis.self.modal('hide');
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.loadInvoiceFormOptions = (onFinish = null) => {
        vsapi.call(`${mThis.base_url}/api/invoice/form-options`, null).then(res => {
            if (res.status_code === 200) {
                let data = res.data;
                onFinish(data);
            }
        });
    }

    this.setData = (d = null) => {
        if (!d) d = {};
        let cur_symbol = d.currency_symbol ? d.currency_symbol : InvoiceSettings.currency.symbol;
        mThis.currency_symbol = cur_symbol;
        mThis.elReceiptNumber.html(d.ref_number);
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            if (el.is('select')) el.val(d[f]).trigger('change');
            else el.val(d[f]);
        });

        mThis.tblProductItems.setData(d.products);
        mThis.tblServiceItems.setData(d.services);

        d.sub_total = d.amount;
        d.grand_total = d.amount_due;

        mThis.elSummary_discount.val(d.discount_type === 'percentage' ? d.discount_percent : d.discount_amount);
        mThis.elSummary_subTotal.text([cur_symbol, ' ', d.sub_total].join(''));
        mThis.elSummary_taxAmount.text([cur_symbol, ' ', Number(d.tax_amount)].join(''));
        mThis.elSummary_grandTotal.text([cur_symbol, ' ', d.grand_total].join(''));
        mThis.elSummary_balanceDue.text([cur_symbol, ' ', d.grand_total].join(''));
    }

    this.getDataForm = () => {
        let p = {
            'id': (mThis.options || {}).id
        };

        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');

            p[f] = el.val();
        });
        p.discount = mThis.elSummary_discount.val();
        p.discount_type = InvoiceSettings.default_discount_type;

        const items = mThis.tblProductItems.getItems().map(obj => ({ ...obj, invoice_item_class: 'Product' }));
        const services = mThis.tblServiceItems.getItems().map(obj => ({ ...obj, invoice_item_class: 'Service' }));
        //NOTE: p.items is array containing both products and services together
        p.items = Array.from(items).concat(services);
        return p;
    }

    this.setActiveItemView = (viewname) => {
        let x = mThis.itemTabs[viewname];
        x.pane.show().siblings().hide();
        mThis.self.find(`.${x.tabButtonClass}`).addClass('bg-success').siblings().removeClass('bg-success');
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.onClose = options.onClose;
        mThis.options = options;

        mThis.loadInvoiceFormOptions((d) => {
            mThis.tblProductItems.setSelectOptions('item_id', d.items);
            mThis.tblServiceItems.setSelectOptions('item_id', d.services);
            VSUtil.setComboItems(mThis.elPmtTerms, d.pmt_terms, 'code', 'description', true, '(select terms)', null);
            VSUtil.setComboItems(mThis.elCustomer, d.customers, 'id', 'customer_name', true, '(select client)', null);

            if (options.id > 0) {
                mThis.Invoice_Title.text("Modify Invoice");
                let p = { 'id': options.id };
                vsapi.call(`${mThis.base_url}/api/invoice/details`, p).then(res => {
                    if (res.status_code === 200) {
                        let data = res.data;
                        let products = StringSanitizer.sanitizeObject(data.products);
                        let services = StringSanitizer.sanitizeObject(data.services);
                        data.products = null;
                        data.services = null;
                        data.labo_tests = null;
                        let invoice = StringSanitizer.sanitizeObject(data);
                        invoice.products = products;
                        invoice.services = services;

                        mThis.setData(invoice);
                        mThis.self.modal({
                            backdrop: 'static'
                        });
                    }
                });
            }
            else {
                mThis.Invoice_Title.text("New Invoice");
                mThis.setData(null);
                mThis.self.modal({
                    backdrop: 'static'
                });
            }
            mThis.setActiveItemView('product');
        });
    }
}

let PaymentDialog = new function () {
    let mThis = this;
    this.self = $(`#_ivc_dlgPayment`);
    this.btnSave = $('#_ivc_dlgPayment_btnSave');
    this.invoiceInfoPanel = $('#_ivc_dlgPayment_invoice_info');
    this.elTitle = $('#_ivc_dlgPayment_title');
    this.elPaymentMethod = $('#_pmt_pmt_method');

    this.options = null;

    this.btnSave.on('click', (e) => {
        let api_end_point = `${main_view.base_url}/api/invoice-payment/receive`;
        if (mThis.options.id > 0) api_end_point = `${main_view.base_url}/api/invoice-payment/update`;

        let p = mThis.getFormData();
        mThis.btnSave.prop('disabled', true);
        vsapi.call(api_end_point, p).then(res => {
            if (res.status_code === 200) {
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(res.data);
                mThis.self.modal('hide');
                mThis.btnSave.prop('disabled', false);
            } else {
                cv_interact.error(res.error_message);
                mThis.btnSave.prop('disabled', false);
            }
        });
    });

    this.prepareFormOptions = (invoice_id=null, onFinish=null) => {
        let d = {};
        vsapi.call(`${main_view.base_url}/api/invoice/payment-form-options`,null,null,false).then(res=>{
            if(res.status_code===200){
                //if(typeof onFinish==='function')
                onFinish(res.data);
            }
        });  
    }

    this.getFormData = () => {
        let p = { 'id': mThis.options.id };
        p.invoice_id = mThis.options.invoice_id;
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.displayPaymentData = (d = {}) => {
        let invoice = (d || {}).invoice;
        if (!invoice) invoice = {};
        let open_amount = parseFloat(invoice.amount_due) - parseFloat(invoice.amount_paid);
        let cur_symbol = (ExchangeManager.currencies[invoice.currency_code] || {}).symbol;
        if (!cur_symbol) cur_symbol = '$';
        open_amount = (open_amount >= 0 || open_amount < 0) ? open_amount : 0;
        invoice.open_amount = [cur_symbol, open_amount].join('');
        invoice.amount_due = [cur_symbol, invoice.amount_due].join('');
        invoice.amount_paid = [cur_symbol, invoice.amount_paid ? invoice.amount_paid : 0].join('');

        mThis.invoiceInfoPanel.find('.display-field').each(function () {
            let span = $(this);
            let f = span.data('name');
            span.html(invoice[f]);
        });

        let pmt = (d || {}).payment;
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            if (el.is('select')) el.val(pmt[f]).trigger('change');
            else el.val(pmt[f]);
        });
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
        let title = "Receive Payment";
        if (options.id > 0) {
            title = "Modify Payment";
        }

        mThis.prepareFormOptions(options.invoice_id, (d) => {
            VSUtil.setComboItems(mThis.elPaymentMethod,d.pmt_methods,'id','pmt_method',null,null,'Cash');

            if (options.id > 0) {
                let p = { 'id': options.id, 'invoice_id': options.invoice_id };
                vsapi.call(`${main_view.base_url}/api/invoice-payment/details-with-summary`, p).then(res => {
                    if (res.status_code === 200) {
                        let d = res.data;
                        d.invoice = StringSanitizer.sanitizeObject(d.invoice);
                        d.payment = StringSanitizer.sanitizeObject(d.payment);
                        mThis.displayPaymentData(d);
                        mThis.self.modal({
                            'backdrop': 'static'
                        });
                        mThis.elTitle.html(LocaleManager.trans(title, 'titles'));

                    } else cv_interact.error(res.error_message);
                });
                return;
            }

            let p = { 'id': options.invoice_id };
            vsapi.call(`${main_view.base_url}/api/invoice/basic-info`, p).then(res => {
                if (res.status_code === 200) {
                    let d = {};
                    d.invoice = StringSanitizer.sanitizeObject(res.data);
                    d.payment = {};
                    mThis.displayPaymentData(d);
                    mThis.self.modal({
                        'backdrop': 'static'
                    });
                    mThis.elTitle.html(LocaleManager.trans(title, 'titles'));
                } else cv_interact.error(res.error_message);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    InvoicesComponent.init();
});
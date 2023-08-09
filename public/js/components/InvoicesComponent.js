"use strict";
var InvoicesComponent = new function(){
    let mThis = this;
    this.title_prop = "Invoices";
    this.self = $('#_main_invoicesComponent');

    this.tblInvoice = mThis.self.find('.tbl--inv');

    this.init = () => {}

    this.displayInvoiceList = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            
            let cols = [{
                title: "Invoice Nº",
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
                data: "school_level"
            },
            {
                title: "Level",
                data: "level"
            },
            {
                title: "Status",
                data: "status"
            },
            {
                title: "Amount",
                data: "amount"
            },
            {
                title: "Paid",
                data: "paid"
            },
            {
                title: "Due Amount",
                data: "due_amount"
            },
            {
                title: "Invoice Date",
                data: "invoice_date"
            },
            {
                title: "Paid Date",
                data: "paid_date"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <span class="trans-text" data-langprop="buttons.Options"></span>
                        <i class="fa-solid fa-caret-down"></i>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblInvoice.DataTable().clear().destroy();
                mThis.tblInvoice.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblInvoice.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayInvoiceList(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    InvoicesComponent.init();
});
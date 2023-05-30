"use strict";
var DiscountComponent = new function(){
    let mThis = this;
    this.title_prop = "Discount";
    this.self = $('#_main_discountComponent');

    this.tblApproval = mThis.self.find('.tbl__apv');

    this.init = () => {}

    this.displayApproval = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cnt = 1;
            let cols = [{
                title: "No",
                data: (data, a, b) => {
                    return [`<span>${cnt++}</span>`].join('');
                }
            },
            {
                className: 'select-checkbox',
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Checked',
                            value: function(rowData,rowIdx){}
                        },
                        {
                            label: 'Un-Checked',
                            value: function(rowData, rowIdx){}
                        }
                    ]
                },
            },
            {
                title: "Invoice No",
                data: "invoice_number"
            },
            {
                title: "Type Invoice",
                data: "type_invoice"
            },
            {
                title: "Invoice Date",
                data: "invoice_date"
            },
            {
                title: "Student ID",
                data: "student_id"
            },
            {
                title: "Student Name",
                data: "student_name"
            },
            {
                title: "Description",
                data: "description"
            },
            {
                title: "Status",
                data: "status"
            },
            {
                title: "Approved By",
                data: "approved_by"
            },
            {
                title: "Date",
                data: "date"
            },
            {
                title: "Time",
                data: "time"
            },
            {
                title: "Total",
                data: "total"
            }];

            if(mThis.table){
                mThis.tblApproval.DataTable().clear().destroy();
                mThis.tblApproval.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.tblApproval.DataTable({
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
        mThis.displayApproval(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    DiscountComponent.init();
});
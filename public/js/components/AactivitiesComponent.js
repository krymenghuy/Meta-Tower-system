"use strict";
var AactivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_aActivitiesComponent');

    this.tblActivities = mThis.self.find('.tbl__aavt');

    this.init = () => {}

    this.displayActivities = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

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
                }
            },
            {
                title: "Invoice No",
                data: "invoice_number"
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
                title: "Cancelled By",
                data: "cancelled_by"
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
                title: "Amount",
                data: "amount"
            }];

            if(mThis.table){
                mThis.tblActivities.DataTable().clear().destroy();
                mThis.tblActivities.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblActivities.DataTable({
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
        mThis.displayActivities(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    AactivitiesComponent.init();
});
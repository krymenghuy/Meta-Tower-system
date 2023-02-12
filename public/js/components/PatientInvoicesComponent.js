"use strict";
let PatientInvoicesComponent = new function () {
    let mThis = this;
    this.title_prop = 'Patient Invoices';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_patientInvoicesComponent');
    this.btnNew = $('#_pic_btnNew');
    this.elSearchItem = $('#_pic_search');
    this.elFilter_Invoice = $('#_pic_group_filter');
    this.tblItems = $('#_pic_tblInvoice');
    this.form_data = {};

    this.col_titles = {
        "No.": "No.",
        "Invoice Number": "Invoice Number",
        "Patient": "Patient",
        "Invoice Date": "Invoice Date",
        "Due Date": "Due Date",
        "Amount": "Amount",
        "Paid": "Paid",
        "Status": "Status",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'patients', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displaypatientInvoices();
                        console.log(mThis.itemConfig.getItems());
                    }
                }
            };
            PatientInvoicesDialog.show(op);
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displaypatientInvoices();
        });

        mThis.tblItems.on('click', '.btn-pic-print', function (e) {
            e.preventDefault();
            let patient_id = $(this).data('id');
            let qString = ['rtype=invoice_report&patient_id=', patient_id].join('');

            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/geninvoice/', d].join(''), '_blank');
            });
        });

        mThis.tblItems.on('click', '.btn-pic-modify', function (e) {
            e.preventDefault();
            let patient_id = $(this).data('id');
            let op = {
                id: patient_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displaypatientInvoices();
                    }
                }
            };
            PatientInvoicesDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn-pic-delete', function (e) {
            e.preventDefault();
            let patient_id = $(this).data('id');
            let op = { 'id': patient_id };
            cv_interact.confirm('Delete this invoice?', { title: 'Delete Invoice', context: 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/inventory/delete-item`, op).then(res => {
                        if (res.status_code === 200) {
                            mThis.displaypatientInvoices();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elFilter_Invoice.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displaypatientInvoices(e);
                    }
                }
            };
            FilterInvoiceDialog.show(op);
        });
    }

    this.displaypatientInvoices = (options, onFinish = null) => {
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val(), 'start_date': options.start_date, 'end_date': options.end_date, 'patient': options.patient, 'status': options.status };
        window.vsapi.call(`${mThis.base_url}/api/inventory/items`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblItems.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null);
            let cnt = 1;
            //begin::Set up columns
            let my_columns = [
                {
                    title: mThis.trans_title("No."),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data: "invoice_number",
                    title: mThis.trans_title('Invoice Number')
                },
                {
                    title: mThis.trans_title('Patient'),
                    data: "patient"
                },
                {
                    title: mThis.trans_title('Invoice Date'),
                    data: "invoice_date"
                },
                {
                    title: mThis.trans_title('Due Date'),
                    data: "due_date"
                },
                {
                    title: mThis.trans_title('Amount'),
                    data: "amount"
                },
                {
                    title: mThis.trans_title('Paid'),
                    data: "paid"
                },
                {
                    title: mThis.trans_title('Status'),
                    data: "status"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: (data, a, b) => {
                        let html = [`<div class="d-flex align-items-center gap-2">
                            <a href="javascript:void(0)" class="btn-pic-modify" data-id="${data.id}">
                                <i class="fa-regular fa-pen-to-square text-warning"></i>
                            </a>
                            <a href="javascript:void(0)" class="btn-pic-delete" data-id="${data.id}">
                                <i class="fa-solid fa-trash-can text-danger"></i>
                            </a>
                            <a href="javascript:void(0)" class="btn-pic-print" data-id="${data.id}">
                                <i class="fa-solid fa-print text-info"></i>
                            </a>
                        </div>`].join('');
                        return html;
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

            if (!mThis.table)
                mThis.table = mThis.tblItems.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    //dom: 'Bfrtip',
                    retrieve: true,
                    //scrollY:390,
                    //scrollX:500,
                    //pagingType:'numbers',
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    'processing': true,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    'data': data,
                    'columns': my_columns,
                    "createdRow": function (row, data, dataIndex) {
                        cnt++;
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        mThis.displaypatientInvoices(options, () => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let PatientInvoicesDialog = new function () {
    let mThis = this;
    this.self = $(`#_pic_dlgInvoice`);
    this.btnOK = $('#_pic_dlgInvoice_btnSave');

    this.columns = [
        {
            "name": "item_id",
            "title": "Item Name",
            "dataType": "string",
            "displayType": "select",
            "cssClass": "",
            "width": "250"
        },
        {
            "name": "description",
            "title": "Description",
            "dataType": "string",
            "displayType": "input",
        },
        {
            "name": "qty",
            "title": "Qty",
            "dataType": "number",
            "displayType": "input"
        }, {
            "name": "sku",
            "title": "SKU",
            "dataType": "string",
            "readOnly": true
        },
        {
            "name": "price",
            "title": "Price",
            "dataType": "number",
            "displayType": "input"
        },
        {
            "name": "discount",
            "title": "Discount(%)",
            "dataType": "number",
            "displayType": "input"
        }
    ];

    this.formUntil = new FormUntil({
        "itemName": "Patient Invoices",
        "formId": '_pic_dlgInvoice',
        //"titleId":"_pic_dlgInvoice-title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/inventory/save-item`,
        "apiGet": `${main_view.base_url}/api/inventory/item-details`,
        //"identityProp":"id",
        "modifyTitle": "Modify Invoice",
        "createTitle": "New Invoice",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts": [],
        'use_alert_error': true,
        "init": () => {
            vsapi.call(`${main_view.base_url}/api/settings/options-product`, null, null, false).then(res => {
                if (res.status_code === 200) {
                    let options_items = res.data;
                    mThis.columns[0].selectOptions = options_items.products;
                    mThis.itemConfig = new ItemsView('_pic_panel', {
                        columns: mThis.columns,
                        "langProp": "invoice",
                        "showColumnHeaders": true,
                        "showAddLineButton": true,
                        "onItemChange": (selOp, col_name, td) => {
                            let tr = td.parentNode;
                            mThis.setItemInfo(col_name, tr);
                        },
                        "validateColumns": { 'item_id': 'number', 'qty': 'number', 'price': 'number' },
                    });
                }
            })
            mThis.btnOK.on('click', function (e) {
                e.preventDefault();
                console.log(mThis.itemConfig.getItems());
            });
        }
    });

    this.setItemInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.itemConfig.getDataRow(tr);
            let p = { 'item_id': d.item_id };
            vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                if (res.status_code === 200) {
                    let item = res.data;
                    mThis.itemConfig.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                }
            });
        }
    }

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}

let FilterInvoiceDialog = new function () {
    let mThis = this;
    this.self = $('#_pic_dlgFilterInvoice');
    this.modal_title = $('#_pic_dlgFilterInvoice_title');
    this.btnSave = $('#_pic_dlgFilterInvoice_btnSave');

    this.startDate = $('#_pic_dlgFilterInvoice_StartDate');
    this.endDate = $('#_pic_dlgFilterInvoice_EndDate');
    this.patient = $('#_pic_dlgFilterInvoice_Patient');
    this.status = $('#_pic_dlgFilterInvoice_Status');
    this.onClose = null;

    this.btnSave.on('click', (e) => {
        e.preventDefault();
        let op = {
            'start_date': mThis.startDate.val(),
            'end_date': mThis.endDate.val(),
            'patient': mThis.patient.val(),
            'status': mThis.status.val()
        }
        //todo: if invlid filter, don hide
        if (typeof mThis.onClose === 'function') mThis.onClose(op);
        mThis.self.modal('hide');
    });

    this.show = (options) => {
        if (!options) options = {};
        mThis.modal_title.text("Filter Invoice");
        mThis.onClose = options.onClose;

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

$(document).ready(function () {
    PatientInvoicesComponent.init();
});
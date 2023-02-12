"use strict";
let PatientReceiptsComponent = new function () {
    let mThis = this;
    this.title_prop = 'Patient Reciepts';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_patientRecieptsComponent');
    this.btnNew = $('#_prc_btnNew');
    this.elSearchItem = $('#_prc_search');
    this.FilterDialog = $('#_prc_filtergroup');
    this.tblReciept = $('#_prc_tblReciept');
    this.form_data = {};

    this.itemViewColumns = [
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

    this.col_titles = {
        "No.": "No.",
        "Reciept Date": "Reciept Date",
        "Patient": "Patient",
        "Reciept Number": "Reciept Number",
        "Amount": "Amount",
        "Cash Account": "Cash Account",
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
                        mThis.displaypatientReceipts();
                    }
                }
            };
            PatientReceiptsDialog.show(op);
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displaypatientReceipts();
        });

        mThis.FilterDialog.on('click', function (e) {
            e.preventDefault();
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displaypatientReceipts(e);
                    }
                }
            };
            FilterReceiptDialog.show(op);
        });

        //begin: Initialize receipt item view
        mThis.tblItems = new ItemsView('_receipt_panel', {
            "columns": this.itemViewColumns,
            "langProp": "consult",
            "showColumnHeaders": true,
            "showAddLineButton": true,
            "addLineButtonText": "Add Item",
            "numeroFormatter": (numero, row) => {
                return `<span class="text-secondary fw-bold">${numero}</span>`;
            },
            "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No items to dispaly', 'receipt')}</span>`,
            "validateColumns": { 'item_id': 'number', 'qty': 'number', 'price': 'number' }
        });
        //end:: initialize Receipt item view
    }

    this.displaypatientReceipts = (options, onFinish = null) => {
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val(), 'receipt_date': options.receipt_date, 'patient': options.patient, 'cash_account': options.cash_account };
        window.vsapi.call(`${mThis.base_url}/api/inventory/items`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblReciept.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblReciept.empty();
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
                    data: "reciept_date",
                    title: mThis.trans_title('Reciept Date')
                },
                {
                    title: mThis.trans_title('Patient'),
                    data: "patient"
                },
                {
                    title: mThis.trans_title('Reciept Number'),
                    data: "reciept_number"
                },
                {
                    title: mThis.trans_title('Amount'),
                    data: "amount"
                },
                {
                    title: mThis.trans_title('Cash Account'),
                    data: "cash_account"
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

            if (!mThis.table)
                mThis.table = mThis.tblReciept.DataTable({
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
        mThis.displaypatientReceipts(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let PatientReceiptsDialog = new function () {
    let mThis = this;
    this.self = $(`#_prc_tblReciept`);

    this.formUntil = new FormUntil({
        "itemName": "Patient Reciepts",
        "formId": '_prc_dlgReciept',
        "titleId": "_prc_dlgReciept_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/inventory/save-item`,
        //"apiGet":`${main_view.base_url}/api/inventory/details-item`,
        //"identityProp":"id",
        //"modifyTitle":"Modify Product Group",
        "createTitle": "New Reciept",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => { },
        'init': () => { }
    });

    this.show = (options) => {
        vsapi.call(`${main_view.base_url}/api/settings/options-product`, null).then(res => {
            if (res.status_code === 200) {
                let d = res.data;
                PatientReceiptsComponent.tblItems.setSelectOptions('item_id', d.products);
            }
        });
        mThis.formUntil.show(options);
    }
}

let FilterReceiptDialog = new function () {
    let mThis = this;
    this.self = $('#_prc_dlgFilterReceipt');
    this.modalTitle = $('#_prc_dlgFilterReceipt_title');
    this.btnSave = $('#_prc_dlgFilterReceipt_btnSave');

    this.FilterReceiptDate = $('#_prc_dlgFilterReceipt_Date');
    this.FilterReceiptPatient = $('#_prc_dlgFilterReceipt_Patient');
    this.FilterReceiptCashAccount = $('#_prc_dlgFilterReceipt_CashAccount');

    this.btnSave.on('click', function (e) {
        e.preventDefault();
        let op = {
            'receipt_date': mThis.FilterReceiptDate.val(),
            'patient': mThis.FilterReceiptPatient.val(),
            'cash_account': mThis.FilterReceiptCashAccount.val()
        };

        if (typeof mThis.onClose === 'function') mThis.onClose(op);
        mThis.self.modal('hide');
    });

    this.show = (options) => {
        if (!options) options = {};
        mThis.modalTitle.text("Filter Receipt");
        mThis.onClose = options.onClose;
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

$(document).ready(function () {
    PatientReceiptsComponent.init();
});
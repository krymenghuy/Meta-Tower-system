"use strict";
let ExchangeRateComponent = new function () {
    let mThis = this;
    this.title_prop = 'Exchange Rate';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_exchangeRateComponent');
    this.btnNew = $('#_ecr_btnNew');
    this.btnNew_details = $('#_ecr_btnNew_title');
    this.elSearchDate = $('#_ecr_search');
    this.tblItems = $('#_ecr_tblexchangeRate');
    this.tblexchangeRate_detail = $('#_ecr_exchangeRate_details');
    this.form_data = {};

    this.col_titles = {
        "No": "No",
        "Code": "Code",
        "Name": "Name",
        "Symbol": "Symbol",
        "Symbol After": "Symbol After",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'currencies', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        $('#_ecr_dp_curr_pair').text($('#_ecr_currency_pair option:selected').text());

        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayexchangeRate();
                    }
                }
            };
            ExchangeRateDialog.show(op);
        });

        mThis.btnNew_details.on('click', (e) => {
            e.preventDefault();
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayexchangeRate();
                    }
                }
            };
            ExchangeRateDetailsDialog.show(op);
        });

        mThis.elSearchDate.on('change', (e) => {
            e.preventDefault();
            mThis.displayexchangeRate();
        });

        mThis.tblItems.on('click', '.btn_ecr_modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayexchangeRate();
                    }
                }
            };
            ExchangeRateDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_ecr_delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this currency?`, { title: "Delete Currency", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/currency/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayexchangeRate();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblexchangeRate_detail.on('click', '.btn_ecr_modify_details', (e) => {
            let rate_id = $(this).data("id");
            let op = {
                id: rate_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayexchangeRate();
                    }
                }
            };
        });

        mThis.tblexchangeRate_detail.on('click', '.btn_ecr_delete_details', (e) => {
            let rate_id = $(this).data('id');
            cv_interact.confirm(`Delete this rate?`, { title: "Delete Rate", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": rate_id };
                    vsapi.call(`${main_view.base_url}/api/exchange-rate/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayexchangeRate();
                        }
                        else {
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_ecr_tblexchangeRate', {
            'dontExpandByClickingOn': ['btn_ecr_print', 'btn_ecr_modify', 'btn_ecr_delete', 'btn_ecr_action'],
            'tr_dataset': ['patient_id'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let rate_id = q_tr.data('id');
                console.log(rate_id);
                mThis.displayExchangeRateDetails($(detail_tr), rate_id);
            }
        });
    }

    this.displayExchangeRateDetails = (detail_tr, rate_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = { 'id': rate_id, 'search_value': mThis.elSearchDate.val() };
        vsapi.call(`${main_view.base_url}/api/currency/history`,p, 'POST', false).then((res) => {
            let html = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                html = `<div class="d-flex align-items-center">
                <div class="input-group flex-nowrap">
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="currencies.Search"></span>
                    </div>
                    <input data-select="datepicker" class="form-control" id="_ecr_search"/>
                </div>
            </div>
            <div class="table-responsive">
            <table class="table" id="_ecr_exchangeRate_details">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Buy Rate</th>
                    <th>Sell Rate</th>
                </tr>
            </thead>
            <tbody>`;
                (d || {}).map(currency => {
                    html = [html, `<tr>
                    <td>${currency.date}</td>
                    <td>${currency.buy_rate}</td>
                    <td>${currency.sell_rate}</td>
                    <td>
                        <a href="javascript:void(0)" class="btn-cur-modify-details" data-id="${d.id}">
                            <i class="fa fa-edit"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-cur-delete-details" data-id="${d.id}">
                            <i class="fa-solid fa-trash-can text-danger"></i>
                        </a>
                    </td>
                </tr>`].join('');
                });
                html = [html, `</tbody></table></div>`].join('');
            }
            else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }

            div_wrapper.html(html);
        });
    }

    this.displayexchangeRate = (onFinish = null) => {
        mThis.setLanguage();
        let p = {};
        vsapi.call(`${mThis.base_url}/api/currency/list`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblItems.DataTable().clear().destroy();
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null);
            let cnt = 1;
            let my_columns = [
                {
                    title: mThis.trans_title("No"),
                    data: () => {
                        return cnt++;
                    }
                },
                {
                    data: "code",
                    title: mThis.trans_title('Code')
                },
                {
                    title: mThis.trans_title('Name'),
                    data: "name"
                },
                {
                    title: mThis.trans_title('Symbol'),
                    data: "symbol"
                },
                {
                    title: mThis.trans_title('Symbol After'),
                    data: "symbol_after"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_ecr_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_ecr_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" data-id="${data.id}" class="btn_ecr_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `&nbsp;<a href="javascript:void(0)" data-id="${data.id}" class="btn_ecr_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblItems.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
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
        mThis.displayexchangeRate(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ExchangeRateDialog = new function () {
    let mThis = this;
    this.self = $('#_ecr_dlgexchangeRate');

    this.formUntil = new FormUntil({
        "itemName": "Currency",
        "formId": '_ecr_dlgexchangeRate',
        "instance": this,
        "apiSave": `${main_view.base_url}/api/currency/save`,
        "apiGet": `${main_view.base_url}/api/currency/details`,
        "modifyTitle":"Modify Currency",
        "createTitle": "New Currency",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => {}
    });

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}

let ExchangeRateDetailsDialog = new function () {
    let mThis = this;
    this.self = $(`#_ecr_dlgExchangeRate_detail`);

    this.formUntil = new FormUntil({
        "itemName": "Currency Rate",
        "formId": '_ecr_dlgExchangeRate_detail',
        "titleId": "_ecr_dlgExchangeRate_detail_title",
        "saveButtonId": "_ecr_detail_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/x-rate/save`,
        "apiGet": `${main_view.base_url}/api/x-rate/details`,
        "modifyTitle": "Modify Currency Rate",
        "createTitle": "New Currency Rate",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => { }
    });

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}

$(document).ready(function () {
    ExchangeRateComponent.init();
});
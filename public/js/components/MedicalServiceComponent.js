"use strict";
let MedicalServiceComponent = new function () {
    let mThis = this;
    this.title_prop = "Medical Services";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_medicalServiceComponent');
    this.btnNew = $('#_msl_btnNew');
    this.elSearchItem = $('#_msl_search');
    this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_msl_tblItems');
    this.form_data = {};

    this.col_titles = {
        "Numero": "No.",
        "Name": "Name",
        "Description": "Description",
        "Price": "Price",
        "Department": "Department",
        "Service Type": "Service Type",
        "Treatment Method": "Treatment Method",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'service', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    //begin:: MedicalServiceCompoent.int()
    this.init = () => {

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displayMedicalServices();
        });

        mThis.btnNew.on('click', (e) => {
            let op = {
                department_id: mThis.elFilter_department.val(),
                onClose: (e) => {
                    if (e) {
                        mThis.displayMedicalServices();
                    }
                }
            };
            MedicalServiceDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayMedicalServices();
                    }
                }
            };
            MedicalServiceDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this service?`, { title: "Delete Service", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/service/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayMedicalServices();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elFilter_department.on('change', (e) => {
            mThis.displayMedicalServices();
        });
    }

    this.displayMedicalServices = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val(), "department_id": mThis.elFilter_department.val() };
        vsapi.call(`${mThis.base_url}/api/service/items`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblItems.DataTable().clear().destroy();
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null, ['display_price']);
            let cnt = 1;
            let my_columns = [
                {
                    data: (item, a, b) => {
                        return cnt;
                    },
                    title: mThis.trans_title('Numero')
                },
                {
                    data: (item, a, b) => {
                        return [`<div>${item.name}</div>`].join('');
                    },
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Service Type'),
                    data: "service_type"
                },
                {
                    title: mThis.trans_title('Treatment Method'),
                    data: "treatment_method"
                },
                {
                    title: mThis.trans_title('Description'),
                    data: "description"
                },
                {
                    title: mThis.trans_title('Price'),
                    data: 'display_price'
                },
                {
                    title: mThis.trans_title('Department'),
                    data: 'department_name'
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (item, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn_item_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
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
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: my_columns,
                    createdRow: function (row, data, dataIndex) {
                        cnt++;

                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.loadFilterOptions = (onFinish) => {
        if (mThis.form_data.departments) {
            onFinish(mThis.form_data.departments);
        } else {
            vsapi.call(`${main_view.base_url}/api/settings/departments`, null).then(res => {
                if (res.status_code === 200) {
                    let items = StringSanitizer.sanitizeObject(res.data);
                    mThis.form_data.departments = items;
                    onFinish(items);
                }
            });
        }
    }

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;

        mThis.loadFilterOptions((items) => {
            VSUtil.setComboItems(mThis.elFilter_department, items, 'id', 'name', true, '(Select department)', 0);
            mThis.displayMedicalServices(() => {
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            })
        });
    }
}

//begin::MedicalServiceDialog
let MedicalServiceDialog = new function () {
    let mThis = this;
    this.self = $(`#_msl_dlgService`);
    this.elDepartment = $('#_msl_dlgService_department');

    //on ServiceDialog: display department items in Select2/Dropdown list for user to select
    this.prepareFormOptions = (default_id, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/settings/departments`, null).then((res) => {
            let items = StringSanitizer.sanitizeObject(res.data);
            VSUtil.setComboItems(mThis.elDepartment, items, 'id', 'name', true, '(Select Department)', default_id);
            if (default_id) mThis.elDepartment.trigger('change');
            onFinish();
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Service",
        "formId": '_msl_dlgService',
        "instance": this,
        "apiSave": `${main_view.base_url}/api/service/save`,
        "apiGet": `${main_view.base_url}/api/service/details`,
        "modifyTitle": "Modify Service",
        "createTitle": "New Service",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => { }
    });

    this.show = (options) => {
        mThis.prepareFormOptions(options.department_id, () => {
            mThis.formUntil.show(options);
        })
    }
}

window.addEventListener('DOMContentLoaded',function () {
    MedicalServiceComponent.init();
});
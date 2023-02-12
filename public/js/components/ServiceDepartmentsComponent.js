"use strict";
let ServiceDepartmentsComponent = new function () {
    let mThis = this;
    this.title_prop = 'Service Departments';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_serviceDepartmentsComponent');
    this.btnNew = $('#_svd_btnNew');
    // this.elSearchItem = $('#_msl_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_svd_tblItem');
    // this.form_data = {};

    this.col_titles = {
        "Numero": "No.",
        "Name": "Name",
        "Description": "Description",
        "Create User": "Create User",
        "Create At": "Create At",
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

    this.init = () => {
        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayServiceDepartments();
                    }
                }
            };
            ServiceDepartmentsDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    //do something on dialog closed
                    if (e) {
                        mThis.displayServiceDepartments();
                    }
                }
            };
            ServiceDepartmentsDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this department?`, { title: "Delete Department", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/settings/delete-department`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayServiceDepartments();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.displayServiceDepartments = (onFinish = null) => {
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {};
        window.vsapi.call(`${mThis.base_url}/api/settings/departments`, p, 'POST', null).then((result) => {
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
                    title: mThis.trans_title("Numero"),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data: (item, a, b) => {
                        return [`<div>${item.name}</div>`].join('');
                    },
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Description'),
                    data: "description"
                },
                {
                    title: mThis.trans_title('Create User'),
                    data: "create_user"
                },
                {
                    title: mThis.trans_title('Create At'),
                    data: "create_at"
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
        mThis.displayServiceDepartments(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::MedicalServiceDialog
let ServiceDepartmentsDialog = new function () {
    let mThis = this;
    this.self = $(`#_msl_dlgDepartment`);

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName": "Service Departments",
        "formId": '_svd_dlgDepartment',
        //"titleId":"_msl_dlgService_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/settings/save-department`,
        "apiGet": `${main_view.base_url}/api/settings/department-info`,
        //"identityProp":"id",
        "modifyTitle": "Modify Department",
        "createTitle": "New Department",
        "identityProps": ['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props": ['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => { }
        // "init": ()=>{
        //  }
    });

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}
//end::MedicalServiceDialog

$(document).ready(function () {
    ServiceDepartmentsComponent.init();
});
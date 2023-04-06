"use strict";
let EmployeeListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Employee List';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_employeeListComponent');
    this.btnNew = $('#_epl_btnNew');
    this.elSearchItem = $('#_epl_search');
    this.tblItems = $('#_epl_tblEmployee');
     
    this.form_data = null;

    this.col_titles = {
        "No.": "No.",
        "ID": "ID",
        "Name": "Name",
        "First Name": "First Name",
        "Last Name": "Last Name",
        "Sex": "Sex",
        "Email": "Email",
        "Phone Number": "Phone Number",
        "Date Of Birth": "Date Of Birth",
        "Employee Type": "Employee Type",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop]);
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'employees', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayemployeeList();
                    }
                }
            };
            EmployeeListDialog.show(op);
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displayemployeeList();
        });

        mThis.tblItems.on('click', '.btn_epl_modify', function (e) {
            e.preventDefault();
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayemployeeList();
                    }
                }
            };
            EmployeeListDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_epl_delete', function (e) {
            e.preventDefault();
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this employee?`, { title: "Delete Employee", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/employee/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayemployeeList();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblItems.on('click','.btn_epl_print',function(e){
            e.preventDefault();
            let id = $(this).data('id');
            let qString = ['rtype=employee_profile&id=',id].join('');
            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/person-profile/', d].join(''), '_blank');
            });
        });
    }

    this.displayemployeeList = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val() };
        window.vsapi.call(`${mThis.base_url}/api/employee/list`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblItems.DataTable().clear().destroy();
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null,['email']);
            let cnt = 1;
            let my_columns = [
                {
                    title: mThis.trans_title("No."),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data: "code",
                    title: mThis.trans_title('ID')
                },
                {
                    title: mThis.trans_title('Name'),
                    data: "name"
                },
                {
                    title: mThis.trans_title('Sex'),
                    data: "sex"
                },
                {
                    title: mThis.trans_title('Email'),
                    data: "email"
                },
                {
                    title: mThis.trans_title('Phone Number'),
                    data: "phone_number"
                },
                {
                    title: mThis.trans_title('Date Of Birth'),
                    data: "date_of_birth"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_epl_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_epl_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_epl_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
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
        mThis.displayemployeeList(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let EmployeeListDialog = new function () {
    let mThis = this;
    this.self = $(`#_epl_dlgEmployee`);
    this.btnChooseFile = $('#_epl_dlgEmployee_btnChooseFile');
    this.imgPhoto = $('#_epl_dlgEmployee_img');
    this.elNationality = $('#_epl_dlgEmployee_nat');
    this.elDepartment = $('#_epl_dlgEmployee_department');
    this.elPosition = $('#_epl_dlgEmployee_position');
    this.elEmploymentType = $('#_epl_dlgEmployee_emp_type');
    
    this.loadFormOptions =(refresh=false,onFinish)=>{
        if(!refresh){
            if(mThis.form_data){
                onFinish(mThis.form_data);
                return;
            }
        }
        vsapi.call(`${main_view.base_url}/api/employee/form-options`,null,null,false).then(res=>{
            if(res.status_code ===200){
                mThis.form_data = res.data;
                onFinish(mThis.form_data);
            }
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Employee",
        "formId": '_epl_dlgEmployee',
        "titleId": "_epl_dlgEmployee_title",
        "saveButtonId": "_epl_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/employee/save`,
        "apiGet": `${main_view.base_url}/api/employee/details`,
        "createTitle": "New Employee",
        "modifyTitle": "Modify Employee",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": ['email','photo'],
        'use_alert_error': true,
        'init':()=>{
            mThis.btnChooseFile.on('click',(e)=>{
                FileChooser.chooseFile(null,(d)=>{
                    if(d){
                        mThis.imgPhoto.prop('src',d.dataUrl);
                    }
                });
            });
        }
    });
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.loadFormOptions(true,d=>{
            VSUtil.setComboItems(mThis.elNationality,d.nationalities,'id','nationality',false,false,null);
            VSUtil.setComboItems(mThis.elDepartment,d.departments,'id','department',false,false,null);
            VSUtil.setComboItems(mThis.elPosition,d.positions,'id','position_title',false,false,null);
            mThis.formUntil.show(options);
        });
    }
}

window.addEventListener('DOMContentLoaded',()=> {
    EmployeeListComponent.init();
});
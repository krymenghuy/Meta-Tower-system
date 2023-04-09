"use strict";
let PatientListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Patients';
    this.self = $('#_main_patientListComponent');
    this.base_url = $('#__base_url').val();
    this.tblPatients = $('#_pal_tblPatients');
    this.elSearch = $('#_pal_search');
    this.options = {};

    this.icon_url = () => {
        return `${[VSUtil.asset_url()].join('')}/images/icons`;
    }

    this.btnNewPatient = $('#_pal_btnNewPatient');
    this.col_titles = {
        "ID": "Patient ID",
        "Name": "Name",
        "Gender": "Gender",
        "Age": "Age",
        "Phone Number": "Phone Number",
        "Email": "Email",
        "Address": "Address",
        "Type": "Type",
        "Remarks": "Remarks",
        "Register Date": "Register Date",
        "Action": "Action"
    };

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'patient', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        LocaleManager.setLanguageChangeHandler((lang) => {
            mThis.displayPatients();
        });

        mThis.elSearch.on('keyup', (e) => {
            e.preventDefault();
            mThis.displayPatients();
        });

        mThis.btnNewPatient.on('click', function (e) {
            e.preventDefault();
            let op = { 'identity_value': 0 };
            PatientDialog.show(op, (e) => {
                if (e) {
                    cv_interact.info('New Patient has been created', null, true);
                    mThis.displayPatients();
                }
            });
        });

        mThis.tblPatients.on('click', 'a.btn_pat_action', function (e) {
            e.preventDefault();
        });

        mThis.tblPatients.on('click','a.btn_pat_print',function(e){
            e.preventDefault();
            let id = $(this).data('id');
            console.log(id);
        });

        mThis.tblPatients.on('click', 'a.btn_pat_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let op = { 'identity_value': lnk.data('id')};
            PatientDialog.show(op, (e) => {
                if (e) {
                    cv_interact.info('Patient details has been saved', null, true);
                    mThis.displayPatients();
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_pal_tblPatients', {
            'dontExpandByClickingOn': ['btn_pat_print', 'btn_pat_modify', 'btn_pat_action', 'btn_pat_delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let ticket_id = q_tr.data('id');

                if (ticket_id > 0){
                    TicketDetails.show($(detail_tr), {
                        'ticket_id': ticket_id,
                        'client_id': q_tr.data('clientid'),
                        'person_id': q_tr.data('personid'),
                        'status_id': q_tr.data('statusid')
                    },QueueComponent.options.default_tab_view);
                }
            }
        });

        mThis.tblPatients.on('click', 'a.btn_pat_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this patient?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Cancel', title: null, 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/patient/delete`, p).then((res) => {
                        if (res.status_code === 200) {
                            mThis.displayPatients();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop]);
    }

    this.createDropdownMenuHtml_loan = (items = [], data = null, data_props = []) => {
        if (!data_props) data_props = [];
        let str_props = "";
        data_props.map((prop_name) => {
            prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
            if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
        });

        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Review Application</span</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="javascript:void(0)"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.displayPatients = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearch.val() };
        window.vsapi.call(`${mThis.base_url}/api/patient/list`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblPatients.DataTable().clear().destroy();
                mThis.tblPatients.empty();
                mThis.table = null;
            }
            data = StringSanitizer.sanitizeObject(data, null, ['cur_symbol']);

            let my_columns = [
                {
                    title: mThis.trans_title('ID'),
                    data: function (data, a, b) {
                        return [`<img class="dt-icon" src="${mThis.icon_url()}/patient.png">&nbsp;`, data.code
                        ].join('');
                    }
                },
                {
                    title: mThis.trans_title('Name'),
                    data: (data, a, b) => {
                        return data.name;
                    },
                },
                {
                    title: mThis.trans_title('Gender'),
                    data: 'sex'

                },
                {
                    title: mThis.trans_title('Phone Number'),
                    data: (data, a, b) => {
                       return [`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                       <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                     </svg><span class="ml-1">`,data.phone_number,`</span>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Email'),
                    data: (data, a, b) => {
                        return data.email;
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_pat_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_pat_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" data-id="${data.id}" class="btn_pat_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `&nbsp;<a href="javascript:void(0)" data-id="${data.id}" class="btn_pat_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblPatients.DataTable({
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
                        let tr = $(row);
                        tr.data('id', data.id);
                        tr.data('tid', data.id);
                        tr.data('statusid', data.status_id);
                        tr.data('clientid', data.client_id);
                        tr.data('personid', data.person_id);
                    }

                });
            if (typeof onFinish === 'function') onFinish();
        });

    };

    this.show = (option = null) => {
        if(!option) option = {}; 
        mThis.displayPatients(() => {
            mThis.options = option;
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}

window.addEventListener('DOMContentLoaded',e=> {
    PatientListComponent.init();
});
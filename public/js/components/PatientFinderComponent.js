"use strict";
let PatientFinderComponent = new function () {
    let mThis = this;
    this.title_prop = 'Find Patient';
    this.self = $('#_main_patientFinderComponent');
    this.base_url = $('#__base_url').val();
    this.tblPatients = $('#_paf_tblPatients');
    this.elSearch = $('#_apl_search');
    this.btnNew = $('#_paf_btnNew');

    this.col_titles = {
        "ID": "ID",
        "Name": "Name",
        "Sex": "Sex",
        "Age": "Age",
        "Phone Number": "Phone Number",
        "Email": "Email",
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
            mThis.displayPatients();
        });

        mThis.btnNew.on('click', e => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayPatients();
                    }
                }
            };
            PatientDialog.show(op);
        });

        mThis.tblPatients.on('click', 'a.btn_patient_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let op = { 'id': lnk.data('id') };
            PersonDialog.show(op);
        });

        mThis.tblPatients.on('click', 'a.btn_patient_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let id = lnk.data('id');
            alert('todo: delete patient if can');
        });

        this.cfg = new ExpandableRowConfig('_paf_tblPatients', {
            'dontExpandByClickingOn': ['btn_patient_modify', 'btn_patient_delete', 'btn_patient_action'],
            'tr_dataset': ['patient_id'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let patient_id = q_tr.data('id');
                let current_view_name = detail_tr.dataset.currentview;
                PatientDetails.show($(detail_tr), {
                    'default_tab_view': current_view_name ? current_view_name : 'invoices',
                    'patient_id': patient_id,
                    'person_id': q_tr.data('personid'),
                    'status_id': q_tr.data('statusid')
                });
            }
        });

        mThis.tblPatients.on('click', 'a.btn_patient_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this patient?', { 'confirmButtonText': 'Delete', 'cancelButtonText': "Don't Delete", title: null, 'context': 'delete' }, (e) => {
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

    this.createDropdownMenus = (items = [], data = null, data_props = []) => {
        if (!data_props) data_props = [];
        let str_props = "";
        data_props.map((prop_name) => {
            prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
            if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
        });

        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _pf_patient_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>View Profile</span</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _pf_medical_history" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> View Medical History</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _pf_patient_delete" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete Profile</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _pf_patient_invoices" href="javascript:void(0)"><i class="fa fa-list" style="color:green"></i> Invoices</a>',
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
                    data: function (data, a, b) {
                        return ['<span style="display:block;padding:3px;">', data.code, '</span>',
                        ].join('');
                    },
                    title: mThis.trans_title('ID'),
                },
                {
                    title: mThis.trans_title('Name'),
                    data: 'name',

                },
                {
                    title: mThis.trans_title('Sex'),
                    data: 'sex'

                },
                {
                    title: mThis.trans_title('Phone Number'),
                    data: (data, a, b) => {
                        return data.phone_number;
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
                            `<a href="javascript:void(0)" class="btn_co_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_patient_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_patient_delete"><i class="fa-regular fa-trash-can" style="color:#de0000"></i></a>`,
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_apt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
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
                    'columns': my_columns
                    , "createdRow": function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                        tr.data('statusid', data.status_id);
                        tr.data('personid', data.person_id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });

    };

    this.show = (option = null) => {
        mThis.displayPatients(() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}

let PatientDetails = new function () {
    let mThis = this;
    mThis.current_view_name = 'history';
    mThis.tblPatients = $('#_paf_tblPatients');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.init = () => {
        mThis.tblPatients.on('click', 'a.btn-ticket-tab', function (e) {
            e.preventDefault();
            let btn = $(this);
            let ws_id = btn.data('target');
            let view_name = btn.data('viewname');
            let ws = $(`#${ws_id}`);
            mThis.displayPatientTab(ws, view_name);
        });
    }

    this.setActiveTabButton = (div_wrapper, view_name = null) => {
        div_wrapper.find('.btn-ticket-tab').each(function () {
            let btn = $(this);
            if (btn.data('viewname') === view_name) {
                btn.addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');

                div_wrapper.closest('tr').attr('data-currentview', view_name);
                return false;
            }
        });
    }

    this.displayPatientTab = (div_workspace, view_name = null) => {
        let div_main_wrapper = div_workspace.parent();

        let patient_id = div_workspace.data('patientid');

        let renderPatientDetails = {
            "history": () => {
                mThis.div_tab_history_id = [`patient_details_history_`, patient_id].join('');
                vsapi.call(`${main_view.base_url}/api/patient/history`, null).then(res => {

                    if (res.status_code === 200) {
                        let d = res.data;

                        let medical_reports = d ? d.medical_reports : [];

                        let medical_history = d ? d.medical_history : {};

                        let html = `<div id="${mThis.div_tab_history_id}" class="table-reponsive">
                        <table class="table _patient-history-table">
                        <thead>
                            <tr>
                                <th>
                                    <span class="trans-text" data-langprop="history.Ticket Number"></span>
                                </th>
                                <th>
                                    <span class="trans-text" data-langprop="history.Consultant Name"></span>
                                </th>
                                <th>
                                    <span class="trans-text" data-langprop="history.Date"></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>`;
                        let cnt = 0;
                        medical_reports.map(c => {
                            html = [html, `
                                    <tr>
                                        <td>${c.ticket_number}</td>
                                        <td><a data-id="${c.id}" class="btn-print-medical-report" href="javascript:void(0)">${c.consult_date} report</a></td>
                                        <td>${c.consultant_name}</td>
                                    </tr>
                                `].join('');
                            cnt++;
                        });
                        html = [html, `</tbody></table>
                        </div>`].join('');

                        if (cnt === 0) {
                            div_workspace.html(`<span class="">${LocaleManager.trans('There are no medical reports', 'patient')}!</span>`);
                        } else {
                            div_workspace.html(html);
                            LocaleManager.translateZone(div_workspace.attr('id'));
                        }
                    }
                });
            },

            "photos": () => {
                mThis.div_tab_invoices_id = [`patient_details_photos_`, patient_id].join('');
                vsapi.call(`${main_view.base_url}/api/patient/photos`, null).then(res => {
                    if (res.status_code === 200) {
                        let image_urls = res.data;
                        let image_content = null;
                        image_urls.map(item => {
                            image_content = [image_content, `<img class="img-thumbnail" src="${item.image_url}"/>`].join('');
                        });
                        image_content = `<span class="no-image">${LocaleManager.trans('There are no photos to display', 'patient')}!</span>`;
                        let html = [`<div id="${mThis.div_tab_invoices_id}" class="d-flex align-items-center justify-content-center gap-2">`, image_content, `</div>`].join('');
                        div_workspace.html(html);
                    }
                });
            },

            "invoices": () => {
                mThis.div_tab_invoices_id = [`patient_details_invoices_`, patient_id].join('');
                vsapi.call(`${main_view.base_url}/api/patient/invoices`, null).then(res => {
                    if (res.status_code === 200) {
                        let cnt = 0;
                        let invoices = res.data;

                        let contents = null;
                        invoices.map(c => {
                            contents = [contents, `
                                        <tr>
                                            <td>${cnt + 1}</td>
                                            <td>${c.ticket_number}</td>
                                            <td>${c.issue_date}</td>
                                            <td>${c.due_date}</td>
                                            <td>${c.amount}</td>
                                            <td>${c.status}</td>
                                        </tr>
                                    `].join('');
                            cnt++;
                        });

                        let html = [`<div id="${mThis.div_tab_invoices_id}" class="table-responsive">
                        <table class="table _pa-details-invoices">
                            <thead>
                                <tr>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.No"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.Ticket Number"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.Issue Date"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.Due Date"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.Amount"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="transaction.Status"></span>
                                    </th>
                                </tr>
                            </thead><tbody>`, contents, `</tbody></table></div>`].join('');

                        if (cnt === 0) {
                            div_workspace.html(`<span class="">${LocaleManager.trans('There are no payment transactions', 'patient')}</span>`);
                        } else {
                            div_workspace.html(html);

                            LocaleManager.translateZone(div_workspace.attr('id'));
                        }
                    }
                });
            }
        };

        mThis.setActiveTabButton(div_main_wrapper, view_name);
        renderPatientDetails[view_name]();
    }

    this.show = (detail_tr, options) => {
        let patient_id = options.patient_id;
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        let div_wrapper_id = `patient_details_wrapper_${patient_id}`;
        let div_id = `ws_${patient_id}`;

        let div_tab_pane = detail_tr.find(`div#${div_wrapper_id}`);
        if (div_tab_pane.length === 0 || !div_tab_pane) {
            let html = `<div id = "${div_wrapper_id}" class="ticket-info-wrapper shadow-lg d-flex" style="width:100%;dislay:none">
                            <div class="form-inline ticket-tab-buttons" role="group" aria-label="ticket tabs" style="display:block">
                                <a style="padding:5px" data-viewname="history" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-history trans-text" data-langprop="buttons.History">History</a>
                                <a style="padding:5px" data-viewname="photos" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-photo trans-text" data-langprop="buttons.Photo">Photos</a>
                                <a style="padding:5px" data-viewname="invoices" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-invoices trans-text btn-ticket-tab--active" data-langprop="buttons.Invoices">Invoices</a>
                            </div>
                            <div id="${div_id}" class="qul-workspace pt-3" style="width:100%;display:block;">
                            </div>
                    </div>`;
            div_wrapper.html(html);
            div_tab_pane = detail_tr.find(`div#${div_wrapper_id}`);
        }
        div_tab_pane.show();
        mThis.displayPatientTab(div_wrapper.find(`#${div_id}`), options.default_tab_view);
    }
}

$(document).ready(() => {
    PatientDetails.init();
    PatientFinderComponent.init();
});
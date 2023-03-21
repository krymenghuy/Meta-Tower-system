"use strict";
let AppointmentListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Appointments';
    this.self = $('#_main_appointmentListComponent');

    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.tblAppointments = $('#_apl_tblAppts');
    this.elSearchAppt = $('#_apl_search_appt');
    this.btnSearchAppt = $('#_apl_btnFindAppt');
    this.appt_filter_status = $('#_apl_filter_status');
    this.appt_filter_date = $('#_apl_filter_date');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.btnNewAppointment = $('#_apl_btnNewAppointment');
    this.col_titles = {
        "Arrival Date": "Arrival Date",
        "Arrival Time": "Arrival Time",
        "Client Name": "Client Name",
        "Client Phone": "Client Phone",
        "Status": "Status",
        "Schedule Type": "Schedule Type",
        "Priority": "Priority",
        "Action": "Action"
    };

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'appointment', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.loadChiefComplaints = () => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((d) => {
            mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
        });
    }

    this.addCCToList = (ul, item = {}) => {
        let appt_id = ul.data('apptid');

        ul.find('li[data-apptid="0"]').remove();
        ul.append(`<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="appt-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`);
    }

    this.displayCCList = (list_id, items = []) => {
        let ul = $(`#${list_id}`);
        ul.empty();
        let appt_id = ul.data('apptid');
        let i = 0, html = '';
        (items || []).map((item) => {
            html = [html, `<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="appt-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`].join('');
            i++;
        });
        if (i === 0) html = `<li data-apptid="0"><span class="text-muted">(No chief complaints)</span></li>`;
        return html;
    }

    this.setAppointmentStatus = (detail_tr, d = {}) => {
        let tr = detail_tr.prev();
        let btn = tr.find('a.btn-appt-status');
        btn.text(d.status);
        btn.data('statusid', d.status_id);
        tr.data('statusid', d.status_id);

        let btnQ = detail_tr.find('.btn-add-queue');

        if (d.status_id >= 3) {
            btnQ.hide();
            detail_tr.find('.btn-start-consult').show();
        }
        else
            btnQ.show();
        if (d.status_id >= 2)
            detail_tr.find('.btn-view-profile').show();
        else
            detail_tr.find('.btn-view-profile').hide();
    }

    this.displayAppointmentDetails = (detail_tr, appt_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = { 'id': appt_id };
        window.vsapi.call(`${main_view.base_url}/api/appointment/details`, p, 'POST', false).then((res) => {
            let html = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                d.patient_code = d.patient_code ? d.patient_code : 'N.A.';
                d.consultant_name = d.consultant_name ? d.consultant_name : 'Any';

                let tr = detail_tr.prev();
                tr.find('.client-name').text(d.client_name);
                tr.find('.client-code').text(d.patient_code);

                html = `<div data-apptid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="appt-info-wrapper shadow-lg d-flex" style="width:100%;">
                        <div class="thumbnail-wrapper">
                        <img src="${mThis.icon_url()}/client-girl.png" class="profile-thumbnail img-thumbnail">
                        </div>

                        <div class="d-flex" style="width:100%">
                                <div style="width:50%">
                                        <span class="detail-header-text">Client Information</span>
                                        <div class="divider"></div>
                                        <div class="detail-item"> <span class="detail-item-label">Patient ID</span> <span class="detail-item-value" data-field="patient_code">${d.patient_code}</span></div>
                                        <div class="detail-item"> <span class="detail-item-label">Name</span> <span class="detail-item-value" data-field="name">${d.client_name}</span></div>
                                        <div class="detail-item"> <span class="detail-item-label">Gender</span> <span class="detail-item-value" data-field="sex">${d.client_sex}</span></div>
                                        <div class="detail-item"> <span class="detail-item-label">Phone</span> <span class="detail-item-value" data-field="phone_number">${d.client_phone_number}</span></div>
                                        <div class="btn-group">
                                        <button style="display:${d.status_id > 2 ? 'block' : 'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-view-profile">View Profile</button>&nbsp;
                                        <button style="display:${d.status_id < 2 ? 'block' : 'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-warning btn-register"><i class="fa fa-list-alt"></i><span class="trans-text" data-langprop="buttons.Register">Register</span></button>
                                        <button style="display:${d.status_id == 2 ? 'block' : 'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-add-queue"><i class="fa fa-tasks"></i><span class="trans-text" data-langprop="buttons.Add to Queue">Queue</span></button>
                                        <button style="display:none" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-start-consult"><i class="fa fa-user-check"></i><span class="trans-text" data-langprop="buttons.Serve">Serve</span></button>
                                        </div>
                                </div>

                                <div style="width:50%">
                                    <span class="detail-header-text">Consultant/Doctor</span>
                                    <span class="text-normal" style="display:block;margin-left:15px">${d.consultant_name}</span>

                                    <div class="d-flex flex-row">
                                        <span class="detail-header-text trans-text" data-langprop="appointment.Chief Compalaints">Chief Complaints</span>&nbsp;
                                        <a href="#" data-ulid="apl-complaint-list-${d.id}" data-apptid="${d.id}" class="appt-add-complaint" style="margin-top:5px;"><i class="fa fa-plus-circle" style="color:#14B1D1;font-size:1.5em"></i></a>
                                    </div>
                                    <div class="apl-cc-wrapper">
                                        <ul id ="apl-complaint-list-${d.id}" data-apptid="${d.id}" class="apl-complaint-list" style="list-style:none">
                                         ${mThis.displayCCList(['apl-complaint-list-', d.id].join(''), d.chief_complaints)}  
                                        </ul>
                                    </div>
                                </div>
                        </div> 
                    </div>`;
            } else {
                html = `<div class="expanded-row-error">${res.error_message}</div>`;
            }
            div_wrapper.html(html);
        });
    }

    this.getClientInfo = (tr) => {
        let div = tr.find('.appt-info-wrapper');
        let appt_id = div.data('apptid');
        let lead_id = div.data('leadid');
        let d = { 'appt_id': appt_id, "lead_id": lead_id };
        div.find('.detail-item-value').each(function () {
            let span = $(this);
            let f = span.data('field');
            d[f] = span.text();
        });
        return d;
    }

    this.init = () => {
        LocaleManager.setLanguageChangeHandler((lang) => {
            mThis.displayAppointmentList(false);
        });

        mThis.loadOptions();

        mThis.btnSearchAppt.on('click', (e) => {
            e.preventDefault();
            mThis.displayAppointmentList(false);
        });

        mThis.elSearchAppt.on('keyup', (e) => {
            e.preventDefault();
            if (e.key === "Enter") mThis.displayAppointmentList(false);
        });

        mThis.appt_filter_date.on('change', (e) => {
            mThis.displayAppointmentList(false);
        });

        mThis.appt_filter_status.on('change', (e) => {
            mThis.displayAppointmentList(false);
        });

        mThis.btnNewAppointment.on('click', function (e) {
            e.preventDefault();

            let op = {
                'id': 0,
                'onClose': (e) => {
                    if (e) {
                        cv_interact.info('New Appointment has been created', null, null, true);
                        mThis.displayAppointmentList(true);
                    }
                }
            };

            AppointmentDialog.show(op);
        });

        mThis.tblAppointments.on('click', 'a.btn_appt_action', function (e) {
            e.preventDefault();
        });

        mThis.tblAppointments.on('click', 'a.appt-add-complaint', function (e) {
            e.preventDefault();
            let x = $(this);
            let ul_id = x.data('ulid');
            let ul = $(`#${ul_id}`);
            let appt_id = x.data('apptid');

            let option = { 'title': 'Choose Chief Complaint', 'dataLabel': 'Select Chief Complaint', 'valueMember': 'id', 'textMember': 'name', 'data': mThis.form_data.chief_complaints, 'blankErrorMessage': "Please choose chief complaint" };
            InputBox2.show(option, function (d) {
                if (d) {
                    let p = { "cc_id": d.value, "name": d.text, 'appt_id': appt_id };
                    window.vsapi.call(`${main_view.base_url}/api/appointment/add-chief-complaint`, p, null, null).then((res) => {
                        if (res.status_code === 200) {
                            let item = {
                                "id": d.value,
                                "name": d.text
                            }
                            ul.data('apptid', appt_id);
                            mThis.addCCToList(ul, item);
                        } else cv_interact.warning(res.error_message);
                    });
                }
            });
        });

        mThis.tblAppointments.on('click', '.btn-view-profile', function(e) {
            e.preventDefault();
            let patient_id = $(this).data('patientid');
            let qString = ['rtype=general_report&patient_id=', patient_id].join('');
            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/genreport/', d].join(''), '_blank');
            });
            //alert(`View profile for ${patient_id}`);
        });

        mThis.tblAppointments.on('click', '.btn-add-queue', function (e) {
            let x = $(this);
            let detail_tr = x.closest('tr');
            let client_id = x.data('patientid');
            let appt_id = x.data('apptid');
            let op = { 'client_id': client_id, 'appt_id': appt_id }; 
            ServiceQueueDialog.show(op, (p) => {
                if (p) {
                    vsapi.call(`${main_view.base_url}/api/ticket/create`, p).then((res) => {
                        if (res.status_code === 200) {
                            let d = (res.data || {});
                            let status_info = StringSanitizer.sanitizeObject(d.status_info);
                            cv_interact.info(['Queue Ticket: ', d.ticket_number].join(''));
                            mThis.setAppointmentStatus(detail_tr, status_info);
                        } else cv_interact.warning(res.error_message);
                    });
                }
            });
        });

        mThis.tblAppointments.on('click', '.btn-register', function (e) {
            let tr = $(this).closest('tr');
            let appt_id = $(this).data('apptid');
            let op = {
                "id": 0,
                "default_data": mThis.getClientInfo(tr),
                "onClose": (res) => {
                    if (res) {
                        let d = res.status_info;
                        mThis.setAppointmentStatus(tr, { 'status': d.status, 'status_id': d.status_id });
                        mThis.displayAppointmentDetails(tr, appt_id);
                    }
                }
            };
            PatientDialog.show(op);
        });

        mThis.tblAppointments.on('click', 'a.appt-remove-complaint', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let ul = lnk.closest('ul');
            let p = {
                'cc_id': lnk.data('id'),
                'appt_id': ul.data('apptid')
            };

            let li = $(this).closest('li');
            cv_interact.confirm('Delete this item?', {
                'confirmButtonText': 'Delete',
                'cancelButtonText': 'Dont Delete',
                'context': 'delete'
            }, (yes) => {
                if (yes) {
                    window.vsapi.call(`${main_view.base_url}/api/appointment/remove-chief-complaint`, p, null, null).then((res) => {
                        if (res.status_code === 200) {
                            li.remove();
                        } else cv_interact.warning(res.error_message);
                    });
                }
            });
        });

        mThis.tblAppointments.on('click', '.btn-appt-status', function (e) {
            e.preventDefault();
            let btn = $(this);
            let status_id = btn.data('statusid');
            alert('Change status from ' + status_id);
        });

        mThis.tblAppointments.on('click', 'a.btn_appt_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let tr = lnk.closest('tr');
            let appt_id = tr.data('id');
            let op = {};
            op.onClose = (e) => {
                if (e) {
                    mThis.displayAppointmentDetails(tr.next(), appt_id);
                }
            };

            let status_id = tr.data('statusid');

            if(status_id > 2) {
                op.appt_id = appt_id;
                PersonDialog.show(op);

            }
            else if (status_id <= 2) {
                op.id = appt_id;
                AppointmentDialog.show(op);
            }
            else console.error(`Error: Editing Appointment or personal profile requires status_id to be known exactly`);
        });

        this.cfg = new ExpandableRowConfig('_apl_tblAppts', {
            'dontExpandByClickingOn': ['btn_appt_modify', 'btn_appt_delete', 'btn_appt_action', 'btn_appt_print'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let appt_id = qtr.data('id');
                if (appt_id > 0)
                mThis.displayAppointmentDetails($(detail_tr), appt_id);
            }
        });

        mThis.tblAppointments.on('click', 'a.btn_appt_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this appointment?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Dont Delete', title: null, 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/appointment/delete`, p).then((res) => {
                        if (res.status_code === 200) {
                            mThis.displayAppointmentList();
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
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="#"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.getApptStatusClass = (status_id) => {
        if (status_id == 0) return 'border-secondary';
        else if (status_id == 1) return 'border-warning';
        else if (status_id == 2) return 'border-success';
        else 'btn btn-outline-warning';
    }

    this.displayAppointmentList = (order_by_id=false,onFinish = null) => { 
        mThis.setLanguage();
        let p = {'order_by_id':order_by_id?1:0, 'search_value': mThis.elSearchAppt.val(), 'date': mThis.appt_filter_date.val(), 'status_id': mThis.appt_filter_status.val() };
        window.vsapi.call(`${mThis.base_url}/api/appointment/list`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblAppointments.DataTable().clear().destroy();
                mThis.tblAppointments.empty();
                mThis.table = null;
            }
            data = StringSanitizer.sanitizeObject(data, null, ['cur_symbol', 'arrival_time']);
            let my_columns = [
                {
                    data: function (data, a, b) {
                        return ['<span style="display:block;padding:3px;">', data.arrival_date, '</span>',
                        ].join('');
                    },
                    title: mThis.trans_title('Arrival Date')
                },
                {
                    title: mThis.trans_title('Arrival Time'),
                    data:(data,a,b)=>{
                        return [`<span class="d-block text-success">`,data.arrival_time,`</span>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Client Name'),
                    data: (data, a, b) => {
                        return [`<span style="display:block" class="client-name text-bold fw-bold">`, data.client_name, `</span>`, `<span style="display:block;" class="client-code">`, data.patient_code, `</span>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Client Phone'),
                    data: (data, a, b) => {
                        return data.client_phone_number;
                    }
                },
                {
                    title: mThis.trans_title('Schedule Type'),
                    data: (data, a, b) => {
                        return data.schedule_type;
                    }
                },
                {
                    title: mThis.trans_title('Priority'),
                    data: (data, a, b) => {
                        return data.priority;
                    }
                },
                {
                    title: mThis.trans_title('Status'),
                    data: (data, a, b) => {
                        return [`<a href="#" style="display:block;text-align:center;min-width:75px;padding:5px;" data-statusid="${data.status_id}" class="btn-appt-status border rounded-pill ${mThis.getApptStatusClass(data.status_id)}">`, data.status, `</a>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        let status_class = null;
                        return [`<div class="form-inline">`,
                            //`<a href="javascript:void(0)" class="btn_appt_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_appt_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_appt_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            //`&nbsp;<a href="#" data-id="${data.id}" class="btn_appt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblAppointments.DataTable({
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
                    'columns': my_columns
                    , "createdRow": function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                        tr.data('statusid', data.status_id);
                        tr.data('leadid', data.lead_id);
                        tr.data('clientid', data.client_id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.loadOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((d) => {
            mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
        });

        window.vsapi.call(`${main_view.base_url}/api/settings/options-appt-status`, null).then((res) => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.appt_filter_status, items, 'id', 'appt_status', true, 'All Statuses', 0);
                if (onFinish) onFinish();
                mThis.form_data.statuses = items;
            }
        });
    }

    this.show = (option = null) => {
        if(!option) option = {};
        mThis.displayAppointmentList(false,() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}
 
let AppointmentDialog = new function () {
    let mThis = this;
    this.self = $('#_apl_dlgAppt');
    this.cc_list = $('#_appt_cc_list');
    this.elChannel = $('#_appt_contact_channel');
    this.elConsultant = $('#_appt_consultant');
    this.elChiefComplaint = $('#_appt_chief_complaint');

    this.elSearch = $('#_appt_search_client');
    this.btnSearchClient = $('#_appt_btnSearch');
    this.elPatientCode = $('#_appt_client_code');
    this.elName = $('#_appt_client_name');
    this.elPhoneNumber = $('#_appt_client_phone');
    this.elSex = $('#_appt_client_sex');
    this.elEmail = $('#_appt_client_email');


    this.cc_input = $('#appt_cc_input');
    this.btnFindClient = $('#_appt_btnFindClient');

    window.vsapi.call(`${main_view.base_url}/api/settings/options-contact-channel`, null).then((d) => {
        let items = StringSanitizer.sanitizeObject(d.data);
        VSUtil.setComboItems(mThis.elChannel, items, 'id', 'channel_name', '(Select channel)', null);
    });

    window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`, null).then((d) => {
        let items = StringSanitizer.sanitizeObject(d.data);
        VSUtil.setComboItems(mThis.elConsultant, items, 'id', 'consultant_name', '(Select consultant)', null);
    });

    this.getChiefComplaints = () => {
        let ps = [];
        mThis.cc_list.find('li').each(function () {
            let li = $(this);
            ps.push({ 'id': li.data('id'), 'name': li.text() });
        });
        return ps;
    }

    this.addChiefComplaintToList = (item = null) => {
        if (!item) {
            item = {
                "id": mThis.elChiefComplaint.val(),
                "name": mThis.elChiefComplaint.find('option:selected').text()
            };
        }

        let html = [`<li data-id="${item.id}"><a href="javascript:void(0)" class ="cc-item-delete"><i class="fa-solid fa-trash-can text-danger"></i></a>&nbsp;${item.name}</li>`].join('');
        let found_item = null;
        mThis.cc_list.find('li').each(function () {
            let li = $(this);
            if (li.data('id') == item.id) {
                found_item = li;
                return false;
            }
        });
        if (!found_item) mThis.cc_list.append(html);
    }

    this.displayChiefComplaints = (items) => {
        items.map((i) => {
            mThis.addChiefComplaintToList(i);
        });
    }

    this.displayComboItems_cc = (id) => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((d) => {
            let items = StringSanitizer.sanitizeObject(d.data);
            VSUtil.setComboItems(mThis.elChiefComplaint, items, 'id', 'name', true, '(Chief complaint)', id);
            if (id) mThis.elChiefComplaint.trigger('change');
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Appointment",
        "formId": '_apl_dlgAppt',
        "instance": this,
        "apiSave": `${main_view.base_url}/api/appointment/save`,
        "apiGet": `${main_view.base_url}/api/appointment/details`,
        "modifyTitle": "Modify Appointment",
        "createTitle": "New Appointment",
        "identityProps": ['id'],
        "form_data_props": ['lead_id', 'client_id'],
        "sub_prop": "chief_complaint_items",
        "sub_prop_function": ()=>{
            return mThis.getChiefComplaints();
        },
        "sanitize_excepts": ['email', 'client_email', 'arrival_time','items'],
        'use_alert_error': true,
        "init": () => {
            mThis.displayComboItems_cc();

            mThis.cc_list.on('click', '.cc-item-delete', function (e) {
                e.preventDefault();
                $(this).closest('li').remove();
            });

            mThis.elSearch.on('keyup', (e) => {
                e.preventDefault();
                let d = mThis.elSearch.val();
                if((d+'').length>=3) mThis.findClient(d);
            });

            mThis.elPhoneNumber.on('keyup', (e) => {
                e.preventDefault();
                let d = mThis.elPhoneNumber.val();
                if((d+'').length>=3) mThis.findClient(d,'by_phone_number');
            });

            mThis.elSearch.on('blur', (e) => {
                e.preventDefault();
                mThis.findClient(mThis.elSearch.val());
            });

            mThis.btnFindClient.on('click', (e) => {
                mThis.findClient(mThis.elSearch.val());
            });

            mThis.elChiefComplaint.on('change', (e) => {
                mThis.addChiefComplaintToList();
            });

            $('#appt_lnkAddChiefComplaint').on('click', (e) => {
                e.preventDefault();

                let option = { 'previousDialog': mThis.self, 'title': 'New Chief Complaint', 'dataLabel': 'Enter new chief complaint', 'valueMember': 'id', 'textMember': 'name', 'blankErrorMessage': "Please enter new chief complaint" };
                InputBox1.show(option, function (d) {
                    if (d) {
                        let p = { "name": d };
                        window.vsapi.call(`${main_view.base_url}/api/settings/save-chief-complaint`, p).then((res) => {
                            if (res.status_code === 200) {
                                mThis.displayComboItems_cc(res.data.id);
                            } else cv_interact.error(res.error_message);
                        });
                    }
                });
            });
        }
    });

    this.findClient = (search_value=null,findBy =null)=>{
        let p = { "search_value": search_value };
        window.vsapi.call(`${main_view.base_url}/api/appointment/find-client`, p).then((res) => {
            if (res.status_code === 200) {
                let c = StringSanitizer.sanitizeObject(res.data);
                if (!c){
                    if (findBy === 'by_phone_number') return;
                    else c = {};
                }
                mThis.elPatientCode.val(c.patient_code);
                mThis.elName.val(c.name).trigger('change');
                mThis.elEmail.val(c.email);
                if (findBy != 'by_phone_number') mThis.elPhoneNumber.val(c.phone_number).trigger('change');
                mThis.elSex.val(c.sex).trigger('change');
                mThis.lead_id = c.lead_id;
                mThis.client_id = c.client_id;
            }
        });
    }

    this.show = (option = null) => {
        if(option.identity_value > 0)
            mThis.self.find('.cc-input').hide();
        else{
            mThis.cc_list.empty();
            mThis.self.find('.cc-input').show();
        }

        mThis.formUntil.show(option);
    }
}

let PatientDialog = new function () {
    let mThis = this;
    this.self = $('#_apl_dlgPatient');
    this.elTitle = $('#_apl_dlgPatient_title');
    this.elNat = $('#_pat_nationality');
    this.elConsultant = $('#_pat_consultant');
    this.elDepartment = $('#_pat_department');

    this.elError = $('#_apl_dlgPatient_error');
    this.btnSave = $('#_apl_dlgPatient_btnSave');
    this.btnSaveAndQueue = $('#_apl_dlgPatient_btnSaveAndQueue');

    this.elDateOfBirth = $('#_pat_dob');
    this.elAge = $('#_pat_age');
    this.elAgeUnit = $('#_pat_age_unit');
    this.divVitalSign = $('#pat_vital_signs');
    this.divMedConditions = $('#med_con_panel');

    this.btnSave.on('click', function (e) {
        e.preventDefault();
        mThis.registerPatient(0);
    });

    this.btnSaveAndQueue.on('click', (e) => {
        mThis.registerPatient(1);
    });

    this.elDateOfBirth.on('change', (e) => {
        let now = Date();
        let d = VSUtil.daysBetween(this.elDateOfBirth.val(), now);
        let unit = 'months';
        d = Number(d).toFixed(2);
        if (d > 360) {
            unit = 'years';
            d = Number(d / 365).toFixed(2);
        } else if (d < 30) {
            unit = 'days';
            d = Number(d).toFixed(2);
        } else if (d >= 30) {
            unit = 'months';
            d = Number(d / 30.5).toFixed(2);
        }

        mThis.elAgeUnit.text(unit);
        mThis.elAge.val(d);
    });

    this.registerPatient = (addToQueue = 0) => {
        let p = mThis.getFormData();
        p.addToQueue = addToQueue;
        window.vsapi.call(`${main_view.base_url}/api/patient/register`, p, null, null).then((res) => {
            if(res.status_code === 200) {
                if (typeof mThis.onClose === 'function') mThis.onClose(res);
                mThis.self.modal('hide');
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    }

    this.getVitalSignInputs = () => {
        let ps = [];
        mThis.divVitalSign.find('.data-input').each(function () {
            let el = $(this);
            let vs_id = el.data('vitalsignid');
            ps.push({ "id": vs_id, "display_name": el.data('ffield'), "value": el.val() ? el.val() : "" });
        });
        return ps;
    }

    this.getMedConditions = () => {
        let ps = [];
        mThis.divMedConditions.find('.m-checkbox').each(function () {
            let el = $(this);
            let mc_id = el.data('mcid');
            let val = el.is(':checked') ? 1 : 0;
            ps.push({ "id": mc_id, "display_name": el.data('ffield'), "value": val });
        });
        return ps;
    }

    this.prepareVitalSignFields = (fields = []) => {
        mThis.divVitalSign.empty();

        (fields || []).map((f, index) => {
            let field_name = (f.display_name + '').replace(' ', '').toLowerCase();
            mThis.divVitalSign.append(`
             <div data-id="vital_sign_${f.id}" class="form-group col-lg-3">
                <span class="simple-label trans-text vital-sign-label text-nowrap" data-langprop="patient.${f.display_name}">${f.display_name}</span> 
                <div><input data-vitalsignid="${f.id}" type="${f.value_type}" data-field="${field_name}" data-ffield="${f.display_name}" class="form-control data-input"></div> 
              </div>
           `);
        });
    }

    this.prepareMCFields = (fields = []) => {
        mThis.divMedConditions.empty();
        (fields || []).map((f, index) => {
            let field_name = (f.display_name + '').replace(' ', '').toLowerCase();
            mThis.divMedConditions.append(`
              <div class="form-inline"><input type="checkbox" class="m-checkbox" data-mcid="${f.id}" data-field="${field_name}" data-ffield="${f.display_name}">&nbsp;<span>${f.display_name}</span></div>
           `);
        });
    }

    this.getFormData = () => {
        let p = {};
        p.appt_id = mThis.appt_id;
        p.lead_id = mThis.lead_id;
        mThis.self.find('.data-input-reg').each(function () {
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        p.department_id = mThis.elDepartment.val();
        p.consultant_id = mThis.elConsultant.val();
        p.vital_signs = mThis.getVitalSignInputs();
        p.mc_items = mThis.getMedConditions();
        return p;
    }

    this.prepareOptions = (onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/patient-reg-options`, null).then((res) => {
            if (res.status_code === 200) {
                let nats = StringSanitizer.sanitizeObject(res.data.nationalities);
                let vital_sign_fields = StringSanitizer.sanitizeObject(res.data.vital_sign_fields);
                let mc_items = StringSanitizer.sanitizeObject(res.data.mc_items);
                let departments = StringSanitizer.sanitizeObject(res.data.departments);
                let consultants = StringSanitizer.sanitizeObject(res.data.consultants);

                VSUtil.setComboItems(mThis.elNat, nats, 'id', 'nationality', true, '(Choose nationality)', null);
                VSUtil.setComboItems(mThis.elDepartment, departments, 'id', 'department_name', false, null, null);
                VSUtil.setComboItems(mThis.elConsultant, consultants, 'id', 'consultant_name', true, '(Choose doctor)', null);
                mThis.prepareVitalSignFields(vital_sign_fields);
                mThis.prepareMCFields(mc_items);
                onFinish();
            }
        });
    }

    this.clearForm = () => {
        mThis.setData(null);
        mThis.self.find('.error_text').each(function () {
            $(this).remove();
        });
        VSUtil.hideDialogError('_apl_dlgPatient');
    }

    this.setData = (d) => {
        d = d ? d : {};
        mThis.appt_id = d.appt_id;
        mThis.lead_id = d.lead_id;
        mThis.elAgeUnit.text(null);
        mThis.elError.val(null);

        mThis.self.find('.data-input-reg').each(function () {
            let el = $(this);
            let f = el.data('field');
            if (el.is('select')) {
                el.val(d[f]).trigger('change');
                el.data('error', 0);
            } else el.val(d[f]);
        });
    }

    this.show = (option) => {
        option = option ? option : {};
        mThis.option = option;
        mThis.onClose = option.onClose;
        mThis.appt_id = option.appt_id;

        mThis.prepareOptions(() => {

            if (option.id > 0) {
                mThis.elTitle.text(LocaleManager.trans('Modify Patient', 'titles'));
            } else {
                mThis.clearForm();
                mThis.elTitle.text(LocaleManager.trans('Register Patient', 'titles'));

                if (!option.default_data) option.default_data = {};
                option.default_data.nationality = "Cambodia";
                if (option.default_data.nationality) {
                    let nat_id = 0;
                    let ops = mThis.elNat.find('option');

                    ops.map((index, i) => {
                        if (i.textContent === 'Cambodia') {
                            nat_id = i.value;
                            return false;
                        }
                    });
                    if (nat_id > 0) {
                        option.default_data.nationality_id = nat_id;
                    }
                }
                mThis.setData(option.default_data);
            }

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

let ServiceQueueDialog = new function () {
    let mThis = this;
    this.elTitle = $('#_qsd_dlgQService_title');
    this.title_prop = "Choose Department";
    this.dialog_id = '_qsd_dlgQService';
    this.self = $('#_qsd_dlgQService');
    this.elConsultant = $('#_qsd_consultant');
    this.elDepartment = $('#_qsd_department');
    this.elRemarks = $('#_qsd_remarks');
    this.btnOK = $('#_qsd_dlgQService_btnOK');

    mThis.btnOK.on('click', (e) => {
        e.preventDefault();
        let p = {
            'appt_id': mThis.appt_id,
            'client_id': mThis.client_id,
            'department_id': mThis.elDepartment.val(),
            'consultant_id': mThis.elConsultant.val(),
            'remarks': mThis.elRemarks.val()
        }
        let error = mThis.getValidateError();
        if (error) {
            VSUtil.showDialogError(mThis.dialog_id, error);
            return;
        }
        mThis.self.modal('hide');
        if (typeof mThis.onClose === 'function') mThis.onClose(p);
    });

    mThis.elDepartment.on('change', () => {
        mThis.displayConsultants(mThis.elDepartment.val());
    });

    this.getValidateError = () => {
        if (!mThis.elDepartment.val() || mThis.elDepartment.val() == 0) return LocaleManager.trans('Service department is required', 'message_box_default');
    }

    this.prepareOptions = (onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-department`, null).then((res) => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.elDepartment, items, 'id', 'department_name', null, null);
                onFinish();
            }
        });
    }

    this.displayConsultants = (department_id = 0) => {
        let p = { 'department_id': department_id };
        window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`, p).then((res) => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.elConsultant, items, 'id', 'consultant_name', null, null);
            }
        });
    }

    this.show = (option = null, onClose) => {
        if (!option) option = {};
        mThis.appt_id = option.appt_id;
        mThis.client_id = option.client_id;
        mThis.onClose = onClose;
        VSUtil.hideDialogError(mThis.dialog_id);
        mThis.prepareOptions(() => {
            mThis.self.modal({
                backdrop: 'static'
            });
            mThis.elTitle.text(LocaleManager.trans(mThis.title_prop));
        });
    }
}

$(document).ready(() => {
    AppointmentListComponent.init();
});
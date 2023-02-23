"use strict";
let R_TicketDetails = new function () {
    let mThis = this;
    mThis.current_view_name = 'info';
    mThis.tblTickets = null;

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    //begin:: initialize TicketDetails. Eventhandler bindlings
    this.init = (tblTickets_id) => {
        mThis.tblTickets = $(`#${tblTickets_id}`);

        if (mThis.tblTickets.length === 0) console.error(`Error: failed create object element ${tblTickets_id}`);
        mThis.tblTickets.on('click', '.btn-ticket-tab', function (e) {
            $(this).addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');
        });

        mThis.tblTickets.on('click', '.qul-btn-info', function (e) {
            e.preventDefault();
            let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            mThis.showInfo(div_wrapper);
        });

        //remove Chief complaint item, on Appoinment list expanaded view
        mThis.tblTickets.on('click', 'tbody>tr> td a.qul-remove-complaint', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let ul = lnk.closest('ul');
            let p = {
                'chief_complaint_id': lnk.data('id'),
                'ticket_id': ul.data('tid')
            };

            let li = $(this).closest('li');
            cv_interact.confirm('Delete this item?', {
                'confirmButtonText': 'Delete',
                'cancelButtonText': 'Dont Delete',
                'context': 'delete'
            }, (yes) => {
                if (yes) {
                    vsapi.call(`${main_view.base_url}/api/ticket/remove-chief-complaint`, p, null, null).then((res) => {
                        if (res.status_code === 200) {
                            li.remove();
                        } else cv_interact.warning(res.error_message);
                    });
                }
            });
        });

        //within the TicketDetails class => TicketDetails.tblTickets
        mThis.tblTickets.on('click', 'tbody>tr>td a.qul-add-complaint', function (e) {
            e.preventDefault();
            let x = $(this);
            let ul_id = x.data('ulid');
            let ul = $(`#${ul_id}`);
            let ticket_id = x.data('tid');

            mThis.getChiefComplaintOptions((chief_complaints) => {
                let option = { 'title': 'Choose Chief Complaint', 'dataLabel': 'Select Chief Complaint', 'valueMember': 'id', 'textMember': 'name', 'data': chief_complaints, 'blankErrorMessage': "Please choose chief complaint" };
                InputBox2.show(option, function (d) {
                    //NOTE: d is object with {value,text}
                    if (d) {
                        let p = { "chief_complaint_id": d.value, "name": d.text, 'ticket_id': ticket_id }; /** d.value = chief complaint id **/
                        window.vsapi.call(`${main_view.base_url}/api/ticket/add-chief-complaint`, p, null, null).then((res) => {
                            if (res.status_code === 200) {
                                let item = {
                                    "id": d.value,
                                    "name": d.text
                                }
                                ul.data('tid', ticket_id);
                                mThis.addCCToList(ul, item);
                            } else cv_interact.warning(res.error_message);
                        });
                    }
                });
            });
        });
    }
    //end::TicketDetails.init()

    //AddChiefComplaintToList() on Appointment List' s expanded view
    this.addCCToList = (ul, item = {}) => {
        let appt_id = ul.data('apptid');

        //Remove first default element "(No chief complaint)"
        ul.find('li[data-apptid="0"]').remove();
        ul.append(`<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="qul-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`);
    }

    //return html string for array of <li>
    this.displayCCList = (list_id, items = []) => {
        let ul = $(`#${list_id}`);
        ul.empty();
        let appt_id = ul.data('apptid');
        let i = 0, html = '';
        (items || []).map((item) => {
            html = [html, `<li id="${item.id}" data-apptid="${appt_id}"><a href="javascript:void(0)" data-apptid="${appt_id}" data-id="${item.id}" class="qul-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`].join('');
            i++;
        });
        if (i === 0) html = `<li data-apptid="0"><span class="text-muted">(No chief complaints)</span></li>`;
        return html;
    }

    this.getChiefComplaintOptions = (onFinish) => {
        if (!mThis.form_data) mThis.form_data = {};

        mThis.form_data.chief_complaints = null;

        if (!mThis.form_data.chief_complaints) {
            vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((res) => {
                if (res.status_code === 200)
                    onFinish(StringSanitizer.sanitizeObject(res.data));
                else cv_interact.error(res.error_message);
            });
        } else onFinish(mThis.form_data.chief_complaints);
    }

    //Display Ticket Detail panel, by displaying the "Info" tab as default view
    this.show = (detail_tr, d = {}) => {
        let div_wrapper = detail_tr.find('div.expandable-row-containter');

        let html = `<div data-tid="${d.ticket_id}" data-clientid="${d.client_id}" data-personid="${d.person_id}" data-statusid="${d.status_id}" class="ticket-info-wrapper shadow-lg d-flex" style="width:100%;">
                    <div class="form-inline ticket-tab-buttons" role="group" aria-label="ticket tabs" style="display:block">
                        <a style="padding:5px" type="button"  data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-info trans-text" data-langprop="buttons.Info">Info</a>
                    </div>
                    <div data-tid="${d.ticket_id}" class="qul-workspace pt-3" style="width:100%;display:block;">
                    </div>
                  </div>`;
        div_wrapper.html(html);
        let div_panel = div_wrapper.find('div.ticket-info-wrapper');
        switch (mThis.current_view_name) {
            case 'info': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-info');
                mThis.showInfo(div_panel);
                break;
            }
            default: {
                mThis.setActiveTabButton(div_panel, 'qul-btn-info');
                mThis.showInfo(div_panel);
                break;
            }
        }
    }

    this.setActiveTabButton = (div_wrapper, btn_class) => {
        div_wrapper.find(`.${btn_class}`).addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');
    }

    this.displayMedicalConditions = (items) => {
        let html = "";
        (items || []).map((i) => {
            let display_value = (i.mc_value == 1) ? 'Yes' : 'No';
            html = [html, `<div class="detail-item row"> <span class="detail-item-label col-6 ps-4">${i.description}</span> <span class="detail-item-value col-6" data-field="${i.description}">${display_value}</span></div>`].join('');
        });
        return html;
    }

    //return html string for array of <li>
    this.displayCCList = (list_id, items = []) => {
        let ul = $(`#${list_id}`);
        ul.empty();
        let ticket_id = ul.data('tid');
        let i = 0, html = '';
        (items || []).map((item) => {
            html = [html, `<li id="${item.id}" data-tid="${ticket_id}">
            <a href="javascript:void(0)" data-apptid="${ticket_id}" data-id="${item.id}" class="qul-remove-complaint">
            <i class="fa fa-times" style="color:red"></i>
            </a>&nbsp;${item.name}</li>`].join('');
            i++;
        });
        if (i === 0) html = `<li data-apptid="0"><span class="text-muted">(No chief complaints)</span></li>`;
        return html;
    }

    this.showInfo = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = { 'id': ticket_id };

        window.vsapi.call(`${main_view.base_url}/api/ticket/details`, p, 'POST', false).then((res) => {
            let html = null;
            let ws_id = null;

            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                if (!d) d = {};
                d.patient_code = d.patient_code ? d.patient_code : 'N.A.';
                d.consultant_name = d.consultant_name ? d.consultant_name : 'N.A.';
                d.membership_card = d.membership_card ? d.membership_card : 'None';
                let email = d.email ? d.email : 'N.A.';
                ws_id = ['ticket_', d.id].join('');
                let ticket_id = d.id;

                html = [`<div id="${ws_id}" data-ticketid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="row">
                        <div class="d-flex" style="max-width: 1300px; width:100%">
                            <div class="row gy-3 w-100">
                                <div class="col-xl-6">
                                    <div class="row d-flex flex-nowrap">
                                        <div style="width:163px; max-width: 165px;">
                                            <img src="${mThis.icon_url()}/client-girl.png" class="profile-thumbnail pe-2"/>
                                        </div>
                                        <div class="col-8">
                                            <div class="row g-1">
                                                <p class="trans-text fw-bold fs-5 text-nowrap" data-langprop="patient.Client Information"></p>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0 text-nowrap">Patient ID</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="patient_code">${d.client_code}</p>
                                                </div>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0">Name</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="name">${d.client_name}</p>
                                                </div>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0">Gender</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="sex">${d.client_sex}</p>
                                                </div>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0">Phone</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="phone_number">${d.client_phone_number}</p>
                                                </div>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0">Email</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="email">${email}</p>
                                                </div>
                                            </div>
                                            <div class="row g-1">
                                                <div class="detail-item">
                                                    <p class="detail-item-label col-6 py-0">Membership</p>
                                                    <p class="detail-item-value col-6 py-0" data-field="membership_card">${d.membership_card}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="row gy-3 d-flex justify-content-center">
                                        <!--This option hidden-->
                                        <!--<div class="col-sm-6">
                                            <div class="row">
                                                <p class="trans-text text-nowrap fw-bold fs-5" data-langprop="patient.Vital Signs"></p>
                                            </div>
                                            <div class="row">${mThis.displayVitalSignItems(d.vital_signs)}</div>
                                        </div>-->
                                        <div class="col-sm-6">
                                            <div class="row">
                                                <p class="detail-header-text">Consultant/Doctor</p>
                                            </div>
                                            <div class="row">
                                                <p class="text-normal">${d.consultant_name}</span>
                                            </div>
                                            <div class="row">
                                                <div class="d-flex px-0">
                                                    <p class="detail-header-text trans-text text-nowrap" data-langprop="patient.Chief Complaints"></p>
                                                    <a href="javascript:void(0)" data-ulid="qul-complaint-list-${ticket_id}" data-tid="${ticket_id}" class="qul-add-complaint">
                                                        <i class="fa fa-plus-circle mt-1" style="color:#14b1d1; font-size:1.5em"></i>
                                                    </a>
                                                </div>
                                                <div class="apl-cc-wrapper">
                                                    <ul id="qul-complaint-list-${ticket_id}" data-tid="${ticket_id}" class="apl-complaint-list" style="list-style:none">
                                                        ${mThis.displayCCList(['qul-complaint-list-', ticket_id].join(''), d.chief_complaints)}  
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:10px; margin-bottom:10px; width:100%; background-color:#aeabaa; border:1px solid #abaeaa;"></div>
                        <div class="row">
                            <div class="col-sm-4">
                                <p class="detail-header-text trans-text" data-langprop="patient.Medical Conditions"></p>
                                <div class="divider"></div>
                                <div>${mThis.displayMedicalConditions(d.mc_items)}</div>
                            </div>
                            <div class="col-sm-4">
                                <button class="btn btnsm btn-outline-primary qul-btn-prescribe">Prescription</button>
                            </div>
                        </div>
                    </div>`
                ].join('');
            } else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }

            div_workspace.html(html);
            LocaleManager.translateZone(ws_id);
            mThis.current_view_name = 'info';
        });
    }

    this.displayVitalSignItems = (items = []) => {
        let html = null;
        (items || []).map((v) => {
            html = [html,
                `<div class="detail-item">
                    <p class="detail-item-label col-6 py-0">${v.name}</p>
                    <p class="detail-item-value col-6 py-0" data-id="${v.id}" data-field="${v.name}">${v.vital_sign_value}</p>
                </div>`].join('');
        });
        return html ? html : '<span class="detail-item-empty">No vital signs</span>';
    }

    this.showPhoto = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html(`<div class="d-flex align-items-center justify-content-center">
            <div class="d-flex gx-4">
                <div class="">
                    <img class="img-thumbnail rounded" src="${VSUtil.asset_url()}/images/icons/client-girl.png"/>
                </div>
                <div class="">
                    <img class="img-thumbnail rounded" src="${VSUtil.asset_url()}/images/icons/client-girl.png"/>
                </div>
                <div class="">
                    <img class="img-thumbnail rounded" src="${VSUtil.asset_url()}/images/icons/client-girl.png"/>
                </div>
            </div>
        </div>`);
        mThis.current_view_name = 'photo';
    };

    this.startConsult = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html();
        mThis.current_view_name = 'consult';
    };
}

//begin:: RQueueComponent
let R_QueueComponent = new function () {
    let mThis = this;
    this.title_prop = 'Queued Tickets';
    this.self = $('#_main_r_queueComponent');

    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.tblTickets = $('#_r_qul_tblTickets');
    this.elSearchAppt = $('#_r_qul_search_ticket');
    this.btnSearchAppt = $('#_r_qul_btnFindTicket');
    this.appt_filter_status = $('#_r_qul_filter_status');
    this.appt_filter_date = $('#_r_qul_filter_date');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.btnNewTicket = $('#_r_qul_btnNewTicket');
    this.col_titles = {
        "Ticket Number": "Ticket Date",
        "Client ID": "Client ID",
        "Client Name": "Client Name",
        "Sex": "Sex",
        "Client Phone": "Phone Number",
        "Date": "Date",
        "Priority": "Priority",
        "Schedule Type": "Schedule Type",
        "Status": "Status",
        "Action": "Action"
    };

    //Initialize langauge translation tasks (for dataTable columns headers)
    //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
    //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'ticket', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    //SetQueueStatus()
    this.setTicketStatus = (detail_tr, d = {}) => {
        let tr = detail_tr.prev();
        let btn = tr.find('a.btn_ticket_status');
        btn.text(d.status);
        btn.data('statusid', d.status_id);
        let btnQ = detail_tr.find('.btn-add-queue');
        if (d.status_id > 2) {
            btnQ.hide();
            tr.find('a.btn_ticket_modify').hide();
        } else {
            btnQ.show();
            tr.find('a.btn_ticket_modify').show();
        }

        btnQ.show();
    }

    this.init = () => {
        //This is to refresh Datatable's header texts when language changes
        LocaleManager.setLanguageChangeHandler((lang) => {
            mThis.displayTicketList();
        });

        //loadChiefComplaints() will retrieve list of chief complaints and stores them in "mThis.chief_complaints"
        mThis.loadOptions();

        mThis.btnSearchAppt.on('click', (e) => {
            e.preventDefault();
            mThis.displayTicketList();
        });

        //Search Appointment on Appointment List view
        mThis.elSearchAppt.on('keyup', (e) => {
            e.preventDefault();
            let d = mThis.elSearchAppt.val();
            if (!d) mThis.displayTicketList();
            else if (e.keyCode === 13) mThis.displayTicketList();
        });

        mThis.appt_filter_date.on('change', (e) => {
            mThis.displayTicketList();
        });

        mThis.appt_filter_status.on('change', (e) => {
            mThis.displayTicketList();
        });

        mThis.btnNewTicket.on('click', function (e) {
            e.preventDefault();

            let op = { 'identity_value': 0 };
            PatientDialog.show(op, (e) => {
                if (e) {
                    cv_interact.info('New Ticket has been created', null, true);
                    mThis.displayTicketList();
                }
            });
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_action', function (e) {
            e.preventDefault();
        });

        mThis.tblTickets.on('click', '.btn_ticket_status', function (e) {
            e.preventDefault();
            let btn = $(this);
            let status_id = btn.data('statusid');
            alert('Change status from ' + status_id);
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
        });

        this.cfg = new ExpandableRowConfig('_r_qul_tblTickets', {
            'dontExpandByClickingOn': ['btn_ticket_modify', 'btn_apt_delete', 'btn_ticket_action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let ticket_id = q_tr.data('id');
                //Show Expandable Details of each ticket (QTicket)
                R_TicketDetails.show($(detail_tr), {
                    'ticket_id': ticket_id,
                    'client_id': q_tr.data('clientid'),
                    'person_id': q_tr.data('personid'),
                    'status_id': q_tr.data('statusid')
                });
            }
        });

        mThis.tblTickets.on('click', 'a.btn_apt_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this ticket?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Dont Delete', title: null, 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/ticket/delete`, p).then((res) => {
                        if (res.status_code === 200) {
                            mThis.displayTicketList();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.createDropdownMenuHtml_loan = (items = [], data = null, data_props = []) => {
        if (!data_props) data_props = [];
        let str_props = "";
        data_props.map((prop_name) => {
            prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
            if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
        });

        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Review Application</span</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="#"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.getTicketStatusClass = (status_id) => {
        if (status_id == 0) return 'border-secondary';
        else if (status_id == 1) return 'border-warning';
        else if (status_id == 2) return 'border-success';
        else 'btn btn-outline-warning';
    }

    //displayCreditOfficerList()| displayCO|
    this.displayTicketList = (onFinish = null) => {
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchAppt.val(), 'date': mThis.appt_filter_date.val(), 'status_id': mThis.appt_filter_status.val() };
        vsapi.call(`${mThis.base_url}/api/ticket/list`, p).then((result) => {
            let data = [];

            if (result.status_code === 200) data = StringSanitizer.sanitizeObject(result.data, null, ['cur_symbol', 'arrival_time']);
            if (mThis.table) {
                mThis.tblTickets.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblTickets.empty();
                mThis.table = null;
            }
            //begin::Set up columns
            let my_columns = [
                {
                    data: function (data, a, b) {
                        return ['<span class="qul-ticket-number">', data.ticket_number, '</span>',
                        ].join('');
                    },
                    title: mThis.trans_title('Ticket Number')
                },
                {
                    title: mThis.trans_title('Client ID'),
                    data: 'client_code'

                },
                {
                    title: mThis.trans_title('Client Name'),
                    data: 'client_name'

                },
                {
                    title: mThis.trans_title('Sex'),
                    data: (data, a, b) => {
                        return data.client_sex;
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
                        return [`<a href="javascript:void(0)" style="display:block; text-align:center; width:85px; padding:5px;" data-statusid="${data.status_id}" class="btn_ticket_status border rounded-pill ${mThis.getTicketStatusClass(data.status_id)}">`, data.status, `</a>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        let status_class = null; //mThis.getStatusClass(data.status_id);
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_co_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a style="display:${data.status_id > 2 ? 'none' : 'block'}" href="javascript:void(0)" class="btn_ticket_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_apt_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `&nbsp;<a href="javascript:void(0)" data-id="${data.id}" class="btn_apt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names

            if (!mThis.table)
                mThis.table = mThis.tblTickets.DataTable({
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
                    // rowReorder: {
                    // dataSrc: 'sequence'
                    // },
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
                        //both of the above "tid" and "id" are the same. It is ticket ID
                        tr.data('statusid', data.status_id);
                        tr.data('clientid', data.client_id);
                        tr.data('personid', data.person_id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.loadOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then((d) => {
            mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
        });

        window.vsapi.call(`${main_view.base_url}/api/settings/options-ticket-status`, null).then((res) => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.appt_filter_status, items, 'id', 'ticket_status', true, 'All Statuses', 0);
                if (onFinish) onFinish();
                mThis.form_data.departments = items;
            }
        });
    }

    this.show = (option = null) => {
        mThis.displayTicketList(() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}

$(document).ready(() => {
    R_QueueComponent.init();
});
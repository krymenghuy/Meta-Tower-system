"use strict";
//begin::TicketDetails class
let TicketDetails = new function () {
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

        mThis.tblTickets.on('click', 'a.qul-btn-photo', function (e) {
            e.preventDefault();
            let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            mThis.showPhoto(div_wrapper);
        });

        mThis.tblTickets.on('click', 'a.qul-btn-consult', function (e) {
            e.preventDefault();

            let ticket_id = $(this).data('tid');
            let patient_id = $(this).data('clientid');
            let op = {
                patient_id: patient_id,
                ticket_id: ticket_id,
                onClose: (d) => {
                    alert('Consult Window is closing');
                }
            };
            ConsultDialog.show(op);
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
                    window.vsapi.call(`${main_view.base_url}/api/ticket/remove-chief-complaint`, p, null, null).then((res) => {
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
            html = [html, `<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="qul-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`].join('');
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
                        <a style="padding:5px" type="button"  data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-photo trans-text" data-langprop="buttons.Photo">Photo</a>
                        <a style="padding:5px" type="button" data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-consult trans-text" data-langprop="buttons.Consult Now">Consult Now</a>
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
            case 'photo': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-photo')
                mThis.showPhoto(div_panel);
                break;
            }
            case 'consult': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-consult')
                mThis.startConsult(div_panel);
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
            <a href="#" data-apptid="${ticket_id}" data-id="${item.id}" class="qul-remove-complaint">
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
                                        <div class="col-sm-6">
                                            <div class="row">
                                                <p class="trans-text text-nowrap fw-bold fs-5" data-langprop="patient.Vital Signs"></p>
                                            </div>
                                            <div class="row">${mThis.displayVitalSignItems(d.vital_signs)}</div>
                                        </div>
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
//end::TicketDetails class

//begin:: QueueComponent
let QueueComponent = new function () {
    let mThis = this;
    this.title_prop = 'Queued Tickets';
    this.self = $('#_main_queueComponent');

    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.tblTickets = $('#_qul_tblTickets');
    this.elSearchAppt = $('#_qul_search_ticket');
    this.btnSearchAppt = $('#_qul_btnFindTicket');
    this.appt_filter_status = $('#_qul_filter_status');
    this.appt_filter_date = $('#_qul_filter_date');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.btnNewTicket = $('#_qul_btnNewTicket');
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

        this.cfg = new ExpandableRowConfig('_qul_tblTickets', {
            'dontExpandByClickingOn': ['btn_ticket_modify', 'btn_apt_delete', 'btn_ticket_action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let ticket_id = q_tr.data('id');
                //Show Expandable Details of each ticket (QTicket)
                TicketDetails.show($(detail_tr), {
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
        window.vsapi.call(`${mThis.base_url}/api/ticket/list`, p).then((result) => {
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
                        return [`<a href="#" style="display:block;text-align:center;width:85px;padding:5px;" data-statusid="${data.status_id}" class="btn_ticket_status border rounded-pill ${mThis.getTicketStatusClass(data.status_id)}">`, data.status, `</a>`].join('');
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
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_apt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

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

//begin::ConsultTabView 
let ConsultTabView = new function () {
    let mThis = this;
    this.self = $('#_consultTabView');
    this.base_url = main_view.base_url;

    //save all consult data
    this.btnSaveConsult = $('#_qul_dlgConsult_btnSave');

    this.tblChiefComplaints = null;
    this.tblPrescribedItems = null;
    this.tblLaboTests = null;

    //this.data is used to store form options such as chief_complaints, vital_signs, etc ...
    this.data = {};

    this.cur_view = 'consultation';

    this.self.on('click', 'div.tab-header>a.tab-button', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(mThis.options, view_name, true);
    });

    this.btnSaveConsult.on('click', (e) => {
        e.preventDefault();
        let p = mThis.getConsultData();
    });

    this.getInput_chiefcomplaints = (div = null) => {
        return mThis.tblChiefComplaints ? mThis.tblChiefComplaints.getItems() : [];
    }

    this.getInput_vitalsigns = (div = null) => {
        let ps = [];
        div.find('.data-input').each(function () {
            let el = $(this);
            let vital_sign_id = el.data('id');
            ps.push({ "id": vital_sign_id, "observed_value": el.val() });
        });
        return ps;
    }

    this.getInput_medical_history = (div = null) => {
        let ps = [];
        div.find('.data-input').each(function () {
            let el = $(this);
            let category = el.data('category');
            ps.push({ 'category': category, 'value': el.val() });
        });
        return ps;
    }

    this.getInput_pe = (div) => {
        //Physical examination is one textarea
        let el = div.find('.data-input');
        return el.val();
    }

    this.getInput_labotests = (div = null) => {
        return mThis.tblLaboTests ? mThis.tblLaboTests.getItems() : [];
    }

    this.getInput_diagnosis = (div = null) => {
        //Dianosis is one textarea
        let el = div.find('.data-input');
        return el.val();
    }

    this.getInput_prescription = (div = null) => {
        let d = {
            'issue_date': "",
            'consultant_id': "",
            'description': "",
            'items': mThis.tblPrescribedItems ? mThis.tblPrescribedItems.getItems() : []
        };
        //if there are no items in presecription, then return NULL
        if (!d.items[0]) return null;
        return d;
    }

    this.getInput_advice = (div) => {
        //Medical advice or recommendation is one textarea
        let el = div.find('.data-input');
        return el.val();
    }


    //returns doctor's consultation data including Chielf cpmpaint, Medical history, PE, labor test, prescription, Diagnosis
    //getData()|getInputData()
    this.getConsultData = () => {
        let consult_panel = mThis.self.find('div#_consult_panel');
        let p = {};
        consult_panel.find('.consult-content-panel').each(function () {
            let div = $(this);
            let view_name = div.attr('viewname');

            switch (view_name) {
                case 'chief-complaints': {
                    p.chief_compaints = mThis.getInput_chiefcomplaints(div);
                    break;
                }
                case 'vital-signs': {
                    p.vital_signs = mThis.getInput_vitalsigns(div);
                    break;
                }
                case 'medical-history': {
                    p.medical_history = mThis.getInput_medical_history(div);
                    break;
                }
                case 'physical-examination': {
                    p.physical_examination = mThis.getInput_pe(div);
                    break;
                }
                case 'labo-tests': {
                    p.labo_tests = mThis.getInput_labotests(div);
                    break;
                }
                case 'diagnosis': {
                    p.diagnosis = mThis.getInput_diagnosis(div);
                    break;
                }
                case 'prescription': {
                    p.prescription = mThis.getInput_prescription(div);
                    break;
                }
                case 'advice': {
                    p.advice = mThis.getInput_advice(div);
                    break;
                }
            }
        });

        return p;
    }

    //options = {patient_id,ticket_id}
    this.show = function (options, view_name, tab_button_clicked = false) {
        if (!options) options = {};
        mThis.options = options;

        //Store patient_id and ticket_id as data attributes of each panel container
        mThis.consultItemPanel.data('tid', mThis.options.ticket_id);
        mThis.consultItemPanel.data('patientid', mThis.options.patient_id);
        mThis.historyItemPanel.data('tid', mThis.options.ticket_id);
        mThis.historyItemPanel.data('patientid', mThis.options.patient_id);

        if (!mThis.options.ticket_id) console.error('ConsultTabView on ConsultDialog does not have valid ticket_id, thus it is not possible to identify patient');

        if (!view_name) view_name = mThis.cur_view;
        view_name = (view_name + '').toLowerCase();

        mThis.self.find('div.tab-body > div.tab-panel').each(function () {
            let this_view_name = ($(this).data('viewname') + '').toLowerCase();
            let div_tab_panel = $(this);

            if (view_name === this_view_name) {
                mThis.cur_view = view_name;
                $(this).show().siblings().hide();

                //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
                if (view_name === 'history') {
                    mThis.displayHistory(mThis.ticket_id, div_tab_panel);
                } else if (view_name === 'consultation') {
                    mThis.displayConsultation(mThis.ticket_id, div_tab_panel);
                }
                mThis.setFirstActiveMenu(view_name);
                return;
            }
        });

        //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
        if (!tab_button_clicked) {
            mThis.self.find('div.tab-header>a.tab-button').each(function () {
                let this_view_name = ($(this).data('viewname') + '').toLowerCase();
                if (view_name === this_view_name) {
                    $(this).addClass('active').siblings().removeClass('active');
                }
            });
        }
    }

    //begin:: Event handlers for History Tab  and Consultation tab    
    this.displayHistory = (client_id = 0, div_tab_panel = null) => { }
    this.displayConsultation = (client_id = 0, div_tab_panel = null) => { }
    //end:: Event handlers for History Tab  and Consultation tab

    //NOTE: tabeViewName = {'history','consultation'}
    this.setFirstActiveMenu = (tabViewName = null) => {
        if (mThis.has_already_init[tabViewName]) return;
        if (tabViewName === 'consultation') {
            //Initialize activ menu on Consultation tab
            let def_consult_view = 'medical-history';
            mThis.details_routes_consult[def_consult_view]();
            let li = mThis.ul_menus_consult.find(`[data-viewname="${def_consult_view}"]`).closest('li');
            li.addClass('consult-menu-selected');
            mThis.prev_selected_li_consult = li;
        } else {
            //Initialize active menu on History tab
            let def_history_view = 'medical-reports';
            mThis.details_routes_history[def_history_view]();
            let li = mThis.ul_menus_history.find(`[data-viewname="${def_history_view}"]`).closest('li');
            li.addClass('history-menu-selected');
            mThis.prev_selected_li_history = li;
        }
        mThis.has_already_init[tabViewName] = true;
    }

    //begin::init ConsultTabeView (menus item event handlers and so on)
    this.init = () => {
        mThis.ul_menus_consult = $('#_consult_menus');
        mThis.ul_menus_history = $('#_history_menus');

        //div panel that contains each consultation item's details
        mThis.consultItemPanel = $('#_consult_panel');
        mThis.historyItemPanel = $('#_history_panel');

        //Object variable to store bool whetther the first active menu on each tab has been set or not on first show of each TabView {'Consultation','History'}
        mThis.has_already_init = {};

        mThis.consultItemPanel.on('click', 'a.consultview-add-cc', (e) => {
            e.preventDefault();
            (mThis.tblChiefComplaints || {}).addRow();
        });

        mThis.details_routes_history = mThis.defineDetailRoutesHistory(mThis.historyItemPanel);
        mThis.details_routes_consult = mThis.defineDetailRoutesConsult(mThis.consultItemPanel);

        mThis.ul_menus_consult.on('click', 'li', (e) => {
            e.preventDefault();
            let li = $(e.currentTarget)
            let view_name = li.find('a').data('viewname');
            if (mThis.prev_selected_li_consult) mThis.prev_selected_li_consult.removeClass('consult-menu-selected');
            li.addClass('consult-menu-selected');
            mThis.prev_selected_li_consult = li;

            mThis.details_routes_consult[view_name]();
        });

        mThis.ul_menus_history.on('click', 'li', (e) => {
            e.preventDefault();
            let li = $(e.currentTarget);
            let view_name = li.find('a').data('viewname');

            mThis.details_routes_history[view_name]();

            if (mThis.prev_selected_li_history) mThis.prev_selected_li_history.removeClass('history-menu-selected');
            li.addClass('history-menu-selected');
            mThis.prev_selected_li_history = li;
        });
    }
    //end::init ConsultTabeView (menus item event handlers and so on)

    //begin:: Define routes to details view of all menu items on the "Consult" tab
    this.defineDetailRoutesConsult = (div) => {
        return {
            "chief-complaints": () => {
                mThis.showConsultChiefComplaints(div, "chief-complaints");
            },
            "vital-signs": () => {
                mThis.showConsultVitalSigns(div, "vital-signs");
            },
            "medical-history": () => {
                mThis.showConsultMedicalHistory(div, "medical-history");
            },
            "physical-examination": () => {
                mThis.showConsultPE(div, "physical-examination");
            },
            "prescription": () => {
                mThis.showConsultPrescription(div, "prescription");
            },
            "labo-tests": () => {
                mThis.showConsultLaboratoryTests(div, "labo-tests");
            },
            "diagnosis": () => {
                mThis.showConsultDiagnosis(div, "diagnosis");
            },
            "advice": () => {
                mThis.showConsultRecommendations(div, "advice");
            },
            "medical-report": () => {
                //Show report printing
                mThis.showConsultMedicalReport(div);

            },
            "medical-certificate": () => {
                mThis.showConsultMedicalCertificate(div);
            },
        };
    }
    //end::Detail Routes of Consult

    //Define menu routes on History tab
    this.defineDetailRoutesHistory = (div) => {
        return {
            "chief-complaints": () => {
                mThis.showHistoryChiefComplaints(div);
            },
            "pe": () => {
                mThis.showHistoryPhysicalExamination(div);
            },
            "labo-tests": () => {
                mThis.showHistoryLaboratoryTests(div);
            },
            "diagnosis": () => {
                mThis.showHistoryDiagnosis(div);
            },
            "prescriptions": () => {
                mThis.showHistoryPrescription(div);
            },
            "advice": () => {
                mThis.showHistoryRecommendations(div);
            },
            "medical-reports": () => {
                mThis.showHistoryMedicalReports(div);
            }
        };
    };

    //begin::Any options of consult
    this.showConsultChiefComplaints = (div, view_name) => {
        let wrapper_id = '_consult_cc_warpper';
        let div_id = '_consult_cc_list';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');
        //let patient_id = div.data('patientid');

        if (!el || el.length === 0) {
            let title = LocaleManager.trans('Chief Complaints', 'consult');
            let html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none"><h3 class="trans-text" data-langprop="consult.Chief Complaints">${title} &nbsp;<a href="#" class="consultview-add-cc"><i class="fa fa-plus-circle"></i></a></h3>
              <div id="${div_id}"></div>
            </div>`;

            div.append(html);

            let columns = [
                {
                    "name": "id",
                    "title": "Chief Complaint",
                    "dataType": "string",
                    "displayType": "select",
                    "cssClass": "",
                }
            ];

            mThis.loadChiefComplaintOptions(ticket_id, cc_items => {
                //After having loaded chief complaint options from server => init cc-table

                columns[0].selectOptions = cc_items;
                mThis.tblChiefComplaints = new ItemsView(div_id, {
                    "columns": columns,
                    "langProp": "consult",
                    "tableClass": "table",
                    "showColumnHeaders": false,
                    "showAddLineButton": false,
                    "onItemChange": (item,col_name,td) => {
                        //console.error(JSON.stringify(col_name) + ' has changed');
                    },
                    // "onItemDeleted": (tr) => {
                    //     //console.error(JSON.stringify(col_name) + ' has changed');
                    // },
                    "numeroFormatter": (numero, row) => {
                        return `<span class="text-secondary fw-bold">${numero}</span>`;
                    },
                    "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No chief complaints', 'consult')}</span>`,

                });

                //mThis.tblChiefComplaints.setSelectOptions('name',cc_items);
                el = div.find(`#${wrapper_id}`);
            });
        }
        el.show().siblings().hide();
    }

    this.loadChiefComplaintOptions = (patient_id = 0, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`, null).then(res => {
            if (res.status_code === 200) {
                let items = res.data;
                (items || []).map(c => {
                    c.value = c.code;
                    c.text = c.name;
                });
                onFinish(items);
            } else onFinish([]);
        });
        //onFinish(mThis.data.chief_complaint_options);
    }

    //LoadPatientVitalSigns() | Load vital signs for one patient
    this.loadVitalSigns_patient = (ticket_id = 0, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/ticket/patient-vital-signs`, null).then(res => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                onFinish(items);
            } else onFinish({ 'vital_signs': [], 'items': [] });
        });
    }

    this.showConsultVitalSigns = (div, view_name) => {
        let ticket_id = div.data('tid');
        let wrapper_id = '_consult_vt_wrapper';
        let el = div.find(`#${wrapper_id}`);

        mThis.loadVitalSigns_patient(ticket_id, items => {
            let html_vs_items = "";
            items.map(t => {
                html_vs_items = [html_vs_items, `<tr data-id="${t.id}" data-tid="${ticket_id}"><td>`, t.description, `</td><td><input data-id="${t.id}" class="data-input form-control w-50" type="text" value ="`, t.vital_sign_value, `"></td></tr>`].join('');
            });

            if (!el || el.length === 0) {
                let title = LocaleManager.trans('Vital Signs', 'consult');
                let html = `
                        <div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                        <h3 class="trans-text" data-langprop="consult.Vital Signs">${title}</a></h3>
                        <div class="">
                            <table class="table">
                                    <tbody>
                                        ${html_vs_items}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                    `;
                div.append(html);
                el = div.find(`#${wrapper_id}`);
            }

            el.show().siblings().hide();
        });
    }

    this.loadConsult_PE = (ticket_id, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/ticket/patient-pe`, null).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeOut(res.data);
                onFinish(d);
            } else onFinish(null);
        });
    }

    //showConsultPhysicalExamination
    this.showConsultPE = (div, view_name) => {
        let ticket_id = div.data('tid');
        let wrapper_id = '_consult_pe_wrapper';
        let el = div.find(`#${wrapper_id}`);
        mThis.loadConsult_PE(ticket_id, pe => {
            let html = "";
            if (!pe) pe = "";

            if (!el || el.length === 0) {
                let title = LocaleManager.trans('Physical Examination', 'consult');
                html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                        <h3 class="trans-text" data-langprop="consult.Pysical Examination">${title}</a></h3>
                        <div class="">
                           <textarea class="form-control data-input" cols="10" rows="5">${pe}</textarea>
                        </div>
                    </div>`;
                div.append(html);
                el = div.find(`#${wrapper_id}`);
            }
            el.show().siblings().hide();
        });
    }

    this.loadPrescription = (ticket_id = 0, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/settings/options-product`, null).then(res => {
            if (res.status_code === 200) {
                onFinish(res.data);
            }
        });
    }

    this.showConsultPrescription = (div, view_name) => {
        let wrapper_id = '_consult_pres_warpper';
        let div_id = '_consult_prescription';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');

        if (!el || el.length === 0) {
            let title = LocaleManager.trans('Prescription', 'consult');
            let html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}"><h3 class="trans-text" data-langprop="consult.Prescription">${title}</h3>
              <div id="${div_id}"></div>
            </div>`;

            div.html(html);
            let columns = [
                {
                    "name": "item_id",
                    "title": "Product",
                    "dataType": "string",
                    "displayType": "select",
                    "cssClass": "",
                },
                {
                    "name": "qty",
                    "title": "Quantity",
                    "dataType": "number",
                    "displayType": "input"
                },
                {
                    "name": "sku",
                    "title": "UOM",
                    "dataType": "string",
                    "displayType": "input",
                    "readOnly": true
                },
                {
                    "name": "usage",
                    "title": "usage",
                    "dataType": "string",
                    "displayType": "select"
                },
                {
                    "name": "duration_days",
                    "title": "Days",
                    "dataType": "number",
                    "displayType": "input"
                },
                {
                    "name": "reason",
                    "title": "Reasons",
                    "dataType": "string",
                    "displayType": "input"
                }
            ];

            mThis.loadPrescription(ticket_id, d => {
                //After having loaded prescription data from server => init prescription table
                columns[0].selectOptions = d.products;
                columns[3].selectOptions = d.usage_options;
                //tblPrescribedItems
                mThis.tblPrescribedItems = new ItemsView(div_id, {
                    "columns": columns,
                    "langProp": "consult",
                    "tableClass": "table presciption-table",
                    "showColumnHeaders": true,
                    "showAddLineButton": true,
                    "addLineButtonText": "Add Item",
                    "onItemChange": (selOp, col_name, td) => {
                        let tr = td.parentNode;
                        //st item sku
                        mThis.setItemInfo(col_name, tr);
                    },
                    "numeroFormatter": (numero, row) => {
                        return `<span class="text-secondary fw-bold">${numero}</span>`;
                    },
                    "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No item prescribed', 'consult')}</span>`,
                });
                el = div.find(`#${wrapper_id}`);
            });
        }
        el.show().siblings().hide();
    }

    this.setItemInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.tblPrescribedItems.getDataRow(tr);
            let p = { 'item_id': d.item_id };
            vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                if (res.status_code === 200) {
                    let item = res.data;
                    mThis.tblPrescribedItems.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                }
            });
        }
    }

    //showConsultMedicalHistory()
    this.showConsultMedicalHistory = (div, view_name) => {
        let wrapper_id = '_consult_medical_history_warpper';
        let ticket_id = div.data('tid');
        let patient_id = div.data('patientid');
        let el = div.find(`#${wrapper_id}`);

        if (el.length === 0 || !el) {
            let html =
                `<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
              <h3 class="trans-text" data-langprop="consult.Medical History">Medical History</h3>
              <div class="d-flex flex-column">
                <div>
                   <label class="control-label">Personal History</label>
                   <textarea data-category="Personal History" class="data-input form-control" cols="10" rows="3" id="_consul_history_personal"></textarea>
                </div>

                <div>
                  <label class="control-label">Family History</label>
                  <textarea data-category="Family History" class="data-input form-control" cols="10" rows="3" id="_consul_history_familiy"></textarea>
                </div>

                <div>
                  <label class="control-label">Traveling</label>
                  <textarea data-category ="Traveling" class="data-input form-control" cols="10" rows="3" id="_consul_history_traveling"></textarea>
                </div>
                
                <div>
                  <label class="control-label">Vacination</label>
                  <textarea data-category ="Vacination" class="data-input form-control" cols="10" rows="3" id="_consul_history_vacination"></textarea>
                </div>

                <div>
                  <label class="control-label">Allergy</label>
                  <textarea data-category="Allergy" class="data-input form-control" cols="10" rows="3" id="_consul_history_allergy"></textarea>
                </div>

                <div>
                  <label class="control-label">Surgery</label>
                  <textarea data-category="Surgery" class="data-input form-control" cols="10" rows="3" id="_consul_history_surgery"></textarea>
                </div>

                <div>
                  <label class="control-label">Others</label>
                  <textarea data-category="Others" class="data-input form-control" cols="10" rows="3" id="_consul_history_others"></textarea>
                </div>
              </div>
           </div>`;
            div.append(html);
            el = $(`#${wrapper_id}`);
        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);
    }


    this.showConsultLaboratoryTests = (div, view_name) => {
        let wrapper_id = '_consult_labo_warpper';
        let div_labotest_panel_id = '_consult_div_labotest_panel';

        let ticket_id = div.data('tid');
        let patient_id = div.data('patientid');
        let el = div.find(`#${wrapper_id}`);

        if (el.length === 0 || !el) {
            let html =
                `<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                <h3 class="trans-text" data-langprop="consult.Laboratory Tests">Laboratory Tests</h3>
                <div class="d-flex">
                    <div id="${div_labotest_panel_id}" class="table-responsive">  
                    </div>
                </div>
           </div>`;
            div.append(html);
            el = $(`#${wrapper_id}`);

            //initialize mThis.tblLaboTests for the first time
            let cols = [
                {
                    name: 'labo_test_id',
                    title: 'Test Name',
                    selectOptions: [
                        { 'value': "Boold test", 'text': 'Blood Test' },
                        { 'value': "Other Test", 'text': 'Other Test' },
                    ]
                },
                {
                    name: 'description',
                    title: 'Description'
                },
                {
                    name: 'labo_id',
                    title: 'Labo Name',
                    selectOPtions: []
                }
            ];

            mThis.tblLaboTests = new ItemsView(div_labotest_panel_id, {
                columns: cols,
                tableClass: "table",
                addLineButtonText: "Add Labo Test",
                langProp: 'labotest'
            });

        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);
    }

    this.showConsultDiagnosis = (div, view_name) => {
        let wrapper_id = '_consult_diagnosis_warpper';
        let ticket_id = div.data('tid');
        let patient_id = div.data('patientid');
        let el = div.find(`#${wrapper_id}`);

        if (el.length === 0 || !el) {
            let html =
                `<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
              <h3 class="trans-text" data-langprop="consult.Diagnosis">Diagnosis</h3>
              <div class="d-flex flex-column">
                 <label class="control-label">Diagnosis details</label>
                 <textarea class="form-control data-input" cols="10" rows="3" id="_consul_diagnosis"></textarea>
              </div>
           
            </div>`;
            div.append(html);
            el = div.find(`#${wrapper_id}`);
        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);
    }

    this.showConsultRecommendations = (div, view_name) => {
        let wrapper_id = '_consult_advice_warpper';
        let el = div.find(`#${wrapper_id}`);

        if (el.length === 0 || !el) {
            let html =
                `<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
              <h3 class="trans-text" data-langprop="consult.Recommendations">Recommendations</h3>
              <div class="d-flex flex-column">
                 <label class="control-label">Doctor's recommendation</label>
                 <textarea class="form-control data-input" cols="10" rows="3" id="_consul_advice"></textarea>
              </div>
            </div>  
           `;
            div.append(html);
            el = div.find(`#${wrapper_id}`);
        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);
    }

    this.showConsultMedicalReport = (div = null, ticket_id = 0) => {
        let qString = ['rtype=medical_report&ticketid=', ticket_id].join('');
        main_view.getEncryptData(qString, (d) => {
            window.open([main_view.base_url, '/genreport/', d].join(''), '_blank');
        });
    }

    this.showConsultMedicalCertificate = (div = null, ticket_id = 0) => {
        let qString = [`rtype=medical_certificate&ticketid=`, ticket_id].join('');
        main_view.getEncryptData(qString, (d) => {
            window.open([main_view.base_url, '/genreport/', d].join(''), '_blank');
        });
    }
    //end::Any options of consult

    //begin::Any options of history
    this.showHistoryChiefComplaints = (div) => {
        let html = `<h3>Chief Complaint</h3>
        <div class="d-block">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="fw-bold">Date</th>
                            <th class="fw-bold">h:m:ss</th>
                            <th class="fw-bold text-nowrap">Doctor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>ADFA</li>
                                    <li>ADFA</li>
                                    <li>ADFA</li>
                                </ul>
                            </td>
                            <td>12-11-2021</td>
                            <td>Peter</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th class="fw-bold">Date</th>
                            <th class="fw-bold">h:m:ss</th>
                            <th class="fw-bold text-nowrap">Doctor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>ADFA</li>
                                    <li>ADFA</li>
                                    <li>ADFA</li>
                                </ul>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`;
        div.html(html);
    }

    this.showHistoryPhysicalExamination = (div) => {
        let wrapper_id = '_history_pe_wapper';
        let patient_id = div.data('patientid');
        let ticket_id = div.data('tid');
        let el = $(`#${wrapper_id}`);

        if (!el || el.length === 0) {
            let html =
                `<div id="${wrapper_id}">
            <h3 class="trans-text" data-langprop="consult.Physical Examination">Physical Examination</h3>
            <div class="d-block">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="fw-bold">27-08-2021</th>
                                <th class="fw-bold">h:m:ss</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p>
                                        During a physical examination, a health care provider studies your body to determine if you do or do not have a physical problem. A physical examination usually includes: Inspection (looking at the body) Palpation (feeling the body with fingers or hands) Auscultation (listening to sounds)
                                    </p>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
    
                        <thead>
                            <tr>
                                <th class="fw-bold">27-08-2021</th>
                                <th class="fw-bold">h:m:ss</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p>
                                        During a physical examination, a health care provider studies your body to determine if you do or do not have a physical problem. A physical examination usually includes: Inspection (looking at the body) Palpation (feeling the body with fingers or hands) Auscultation (listening to sounds)
                                    </p>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
            div.html(html);
            el = $(`#${wrapper_id}`);
        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);
    }

    this.showHistoryLaboratoryTests = (div) => {

        let wrapper_id = '_history_labo_wapper';
        let patient_id = div.data('patientid');
        let ticket_id = div.data('tid');
        let el = $(`#${wrapper_id}`);

        if (!el || el.length === 0) {
            let html = `<h3>Laboratory Tests</h3>
            <div class="d-block">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="fw-bold text-nowrap">Test Name</th>
                                <th class="fw-bold">Laboratory</th>
                                <th class="fw-bold">Date</th>
                                <th class="fw-bold">Result</th>
                                <th class="fw-bold">Docs</th>
                                <th class="fw-bold">Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
            div.html(html);
            el = $(`#${wrapper_id}`);
        }

        el.show().siblings().hide();
        LocaleManager.translateZone(wrapper_id);

    }

    this.loadHistory_diagnosis = (patient_id, onFinish) => {
        let items = [
            {
                "ticket_id": 1,
                "date": "12 Dec 2022",
                "ticket_number": "D0001",
                "description": "This is diagnosis one",
                "consultant_name": "Mr. Doctor A"
            },
            {
                "ticket_id": 2,
                "date": "13 Dec 2022",
                "ticket_number": "D0001",
                "description": "An irregular heartbeat is an arrhythmia (also called dysrhythmia). Heart rates can also be irregular. A normal heart rate is 50 to 100 beats per minute. Arrhythmias and abnormal heart rates don’t necessarily occur together. Arrhythmias can occur with a normal heart rate, or with heart rates that are slow (called bradyarrhythmias — less than 50 beats per minute). Arrhythmias can also occur with rapid heart rates (called tachyarrhythmias — faster than 100 beats per minute).",
                "consultant_name": "Mr. Doctor One"
            },
            {
                "ticket_id": 3,
                "date": "20 Dec 2022",
                "ticket_number": "D0001",
                "description": "This is diagnosis three",
                "consultant_name": "Mr. Doctor BBBB"
            }
        ];
        onFinish(items);
    }

    this.showHistoryDiagnosis = (div) => {
        let patient_id = div.data('patientid');
        let wrapper_id = '_history_hs_wrapper';
        let el = div.find(`#${wrapper_id}`);

        if (!el || el.length === 0) {

            mThis.tblHistoryDiagnosis_body_id = `tblHis_tbody_${patient_id}`;

            let html = `<h3>Diagnosis</h3>
                <div class="d-block">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="fw-bold">Date</th>
                                    <th class="fw-bold">Description</th>
                                    <th class="fw-bold text-nowrap">Doctor Name</th>
                                </tr>
                            </thead>
                            <tbody id ="${mThis.tblHistoryDiagnosis_body_id}">
                            </tbody>
                        </table>
                    </div>
                </div>`;
            div.html(html);
            el = $(`#${wrapper_id}`);
        }

        //Insert rows to History table
        mThis.loadHistory_diagnosis(patient_id, items => {
            let tbody = document.querySelector(`#${mThis.tblHistoryDiagnosis_body_id}`);
            if (tbody) {
                let row_html = '';
                let i = 0;

                tbody.innerHTML = '';
                items.map(item => {
                    row_html = [row_html, `<tr>
                            <td>
                                <span class="d-block p-1" style="min-width:110px">${item.date}</span>
                                <span class="d-inline-block text-secondary p-1">${item.ticket_number}</span>
                                </td>
                                <td class="vs-contain-custom">
                                    <p>
                                        ${item.description}
                                    <p>
                                    <span data-tid="${item.ticket_id}" class="span lnk-show-more"></span>
                                </td>
                            <td>${item.consultant_name}</td>
                        </tr>`].join('');
                    i++;
                });

                tbody.innerHTML = row_html;

                (tbody.querySelectorAll('.lnk-show-more') || {}).forEach(d => {
                    d.addEventListener('click', e => {
                        let td = VSDOM.getClosestParentByType(e.target, 'TD');
                        let ticket_id = e.target.dataset.tid;
                        if (td) td.classList.toggle('active');
                    });
                });
            }
        });


        el.show().siblings().hide();

    }

    this.showHistoryPrescription = (div) => {
        let patient_id = div.data('patientid');

        let wrapper_id = '_history_prescriptions';
        let el = $(`#${wrapper_id}`);

        if (!el || el.length === 0) {
            let html =
                `<div id="${wrapper_id}">
                <h3 class="trans-text" data-langprop="history.Historical Prescriptions">Historical Prescriptions</h3>
                <div>
                  Please display a list of prescription by date and doctor's name here!
                </div>
             </div>
            `;
            div.html(html);
            el = $(`#${wrapper_id}`);
        }

        LocaleManager.translateZone(wrapper_id);
        el.show().siblings().hide();
    }

    this.showHistoryRecommendations = (div) => {
        let patient_id = div.data('patientid');
        let wrapper_id = '_history_advice';
        let el = $(`#${wrapper_id}`);

        if (!el || el.length === 0) {
            let html =
                `<div id="${wrapper_id}">
                <h3 class="trans-text" data-langprop="history.Historical Recommendations">Historical Recommedations</h3>
                <div>
                  Doctor advice is to be displayed here!
                </div>
             </div>
            `;
            div.html(html);
            el = $(`#${wrapper_id}`);
        }

        LocaleManager.translateZone(wrapper_id);
        el.show().siblings().hide();
    }

    //load historical medical report items
    this.loadHistory_medical_report = (patient_id = 0, onFinish) => {
        let d = {};
        d.patient_id = 101;
        d.patient_code = '1011';
        d.patient_name = 'Sovano';
        d.patient_sex = 'M';

        let items = [
            { "ticket_id": 1, "ticket_number": "D0001", "date": "11 Dec 2022", "consultant_name": "Dr. A" }
            , { "ticket_id": 2, "ticket_number": "D0003", "date": "15 Dec 2022", "consultant_name": "Dr. A" }
            , { "ticket_id": 3, "ticket_number": "D0002", "date": "25 Dec 2022", "consultant_name": "Dr. B" }
            , { "ticket_id": 4, "ticket_number": "D0001", "date": "31 Dec 2022", "consultant_name": "Dr. A" }
        ];
        d.items = items;
        onFinish(d);
    }

    this.showHistoryMedicalReports = (div) => {
        let patient_id = div.data('patientid');
        let wrapper_id = '_history_med_report_wrapper';
        mThis.tblHistoryReports_body_id = '_history_tblMedReports_body';

        this.loadHistory_medical_report(patient_id, d => {
            let items = d.items;

            let el = div.find(`#${wrapper_id}`);
            if (!el || el.length === 0) {

                let html =
                    `<div id="${wrapper_id}">
                   <div class="d-flex flex-column history-mr-header border border-success rounded p-2 my-3">
                       <div class="d-flex flex-row">
                          <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Patient ID"></span>
                          <span class="">${d.patient_code}</span>
                       </div>

                       <div class="d-flex flex-row">
                         <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Patient Name"></span>
                         <span class="">${d.patient_name}</span>
                      </div>

                      <div class="d-flex flex-row">
                        <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Sex"></span>
                        <span class="">${d.patient_sex}</span>
                      </div>

                      <div class="d-flex flex-row">
                        <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Phone Number"></span>
                        <span class="">${d.patient_phone_number}</span>
                     </div>
                   </div>
                   
                   <div class="table-responsive border border-success rounded-3 shadow-sm">
                     <table class="table">
                      <thead>
                        <th class="trans-text" data-langprop="history.No"></th>
                        <th class="trans-text" data-langprop="history.Date"></th>
                        <th class="trans-text" data-langprop="history.Consultant"></th>
                      </thead>
                      <tbody id="${mThis.tblHistoryReports_body_id}"></tbody>
                     </table>
                   </div>
                </div>
               `;

                div.html(html);
                let el = $(`#${wrapper_id}`);
            }

            LocaleManager.translateZone(wrapper_id);

            el.find('.history-mr-header').each(function () {
                let x = $(this);
                let f = x.data('field');
                x.text(d[f]);
            });

            let tbody = document.querySelector(`#${mThis.tblHistoryReports_body_id}`);
            let row_html = '';
            items.map(item => {
                row_html = [row_html, `<tr>
                    <td>${item.ticket_number}</td>
                    <td><a href="javascript:void(0)"><i class="fa fa-print"></i><span class="pl-1">${item.date} medical report</span></a></td>
                    <td>${item.consultant_name}</td>
                   </tr>`].join('');
            });
            tbody.innerHTML = row_html;

            el.show().siblings().hide();
        });
    }
    //end::Any options of history
}
//end::ConsultTabView

//begin::ConsultDialog
let ConsultDialog = new function () {
    let mThis = this;
    this.self = $('#_qul_dlgConsult');
    this.btnSaveConult = $('#_qul_dlgConsult_btnSave');
    this.defaultTabView = 'consultation';

    this.btnSaveConult.on('click', (e) => {
        e.preventDefault();
        let p = ConsultTabView.getConsultData();
        console.error(JSON.stringify(p));
        vsapi.call(`${main_view.base_url}/api/consultation/save`, p).then(res => {
            if (res.status_code === 200) {

            }
        });

        mThis.self.modal('hide');
        mThis.onClose(true);
    });

    ConsultTabView.init();

    // @option = {patient_id,ticket_id,onClose:()=> { ... }}
    this.show = (option) => {
        if (!option) option = {};
        mThis.onClose = option.onClose;

        ConsultTabView.show({ "ticket_id": option.ticket_id, "patient_id": option.patient_id }, this.defaultTabView);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}
//end::ConsultDialog

$(document).ready(() => {
    TicketDetails.init('_qul_tblTickets');
    QueueComponent.init();
});
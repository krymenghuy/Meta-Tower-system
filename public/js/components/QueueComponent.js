"use strict";

//begin::TicketDetails class
let TicketDetails = new function () {
    let mThis = this;
    //mThis.default_view = 'info';
    mThis.current_view_name = 'info';
    mThis.tblTickets = null;
    
    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    //begin:: initialize TicketDetails. Eventhandler bindlings
    this.init = (tblTickets_id) => {
        mThis.tblTickets = $(`#${tblTickets_id}`);

        if(mThis.tblTickets.length === 0) console.error(`Error: failed create object element ${tblTickets_id}`); 
        mThis.tblTickets.on('click', '.btn-ticket-tab', function (e) {
            $(this).addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');
        });

        mThis.tblTickets.on('click', '.qul-btn-info', function (e) {
            e.preventDefault();
            let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            mThis.showInfo(div_wrapper);
        });

        mThis.tblTickets.on('click', 'a.qul-btn-history', function (e) {
            e.preventDefault();
            let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            mThis.showHistory(div_wrapper);
        });

         mThis.tblTickets.on('click', 'a.qul-btn-consult', function (e) {
            e.preventDefault();
            
            //let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            //mThis.startConsult(div_wrapper);
            
            let ticket_id = $(this).data('tid');
            let patient_id = $(this).data('clientid');
  
            let op = {
                patient_id: patient_id,
                ticket_id: ticket_id,
                onClose:(d)=>{
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
        mThis.tblTickets.on('click','tbody>tr>td a.qul-add-complaint',function (e) {
            e.preventDefault();
            let x = $(this);
            let ul_id = x.data('ulid');
            let ul = $(`#${ul_id}`);
            let ticket_id = x.data('tid');
            
            mThis.getChiefComplaintOptions((chief_complaints)=>{
                let option = { 'title': 'Choose Chief Complaint', 'dataLabel': 'Select Chief Complaint', 'valueMember': 'id', 'textMember': 'name', 'data':chief_complaints, 'blankErrorMessage': "Please choose chief complaint" };
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
        //let ul = $(`complaint_list-${appt_id}`);
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
 
    this.getChiefComplaintOptions = (onFinish)=>{
        if(!mThis.form_data) mThis.form_data = {};
        
        mThis.form_data.chief_complaints = null;

        if(!mThis.form_data.chief_complaints){
            vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((res)=>{
                if(res.status_code===200)
                onFinish(StringSanitizer.sanitizeObject(res.data));
                else cv_interact.error(res.error_message);   
            });
        }else onFinish(mThis.form_data.chief_complaints); 
    }

    //Display Ticket Detail panel, by displaying the "Info" tab as default view
    this.show = (detail_tr, d = {}) => {
        let div_wrapper = detail_tr.find('div.expandable-row-containter');

        let html = `<div data-tid="${d.ticket_id}" data-clientid="${d.client_id}" data-personid="${d.person_id}" data-statusid="${d.status_id}" class="ticket-info-wrapper shadow-lg d-flex" style="width:100%;">
                    <div class="form-inline ticket-tab-buttons" role="group" aria-label="ticket tabs" style="display:block">
                        <a style="padding:5px" type="button"  data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-info trans-text" data-langprop="buttons.Info">Info</a>
                        <a style="padding:5px" type="button"  data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-history trans-text" data-langprop="buttons.History">History</a>
                        <a style="padding:5px" type="button" data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-consult trans-text" data-langprop="buttons.Consult Now">Consult Now</a>
                    </div>
                    <div data-tid="${d.ticket_id}" class="qul-workspace pt-3" style="width:100%;display:block;">
                    </div>
                  </div>`;
        div_wrapper.html(html);
        //div_wrapper.slideDown(500);
        let div_panel = div_wrapper.find('div.ticket-info-wrapper');
        switch (mThis.current_view_name) {
            case 'info': {
                //div_wrapper.find('a.qul-btn-info').addClass('btn-ticket-tab--active');
                mThis.setActiveTabButton(div_panel, 'qul-btn-info');
                mThis.showInfo(div_panel);
                break;
            }
            case 'history': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-history')
                mThis.showHistory(div_panel);
                break;
            }
            case 'consult': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-consult')
                mThis.startConsult(div_panel);
                break;
            }
            default: {
                mThis.setActiveTabButton(div_panel, 'qul-btn-info');
                mThis.showHistory(div_panel);
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
                //d.chief_complaints = d.chief_complaints?d.chief_complaints:[];
                d.patient_code = d.patient_code ? d.patient_code : 'N.A.';
                d.consultant_name = d.consultant_name ? d.consultant_name : 'N.A.';
                d.membership_card = d.membership_card ? d.membership_card : 'None';
                let email = d.email ? d.email : 'N.A.';
                ws_id = ['ticket_',d.id].join('');
                let ticket_id = d.id;
                
                html = [
                    `<div id="${ws_id}" data-ticketid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="row">
                        <div class="col-xl-6 col-lg-8 col-sm-12">
                            <div class="row">
                                <div class="col-4">
                                    <img src="${mThis.icon_url()}/client-girl.png" class="profile-thumbnail pe-2"/>
                                </div>
                                <div class="col-8">
                                    <div class="row g-1">
                                        <p class="trans-text fw-bold fs-5 text-nowrap" data-langprop="patient.Client Information"></p>
                                    </div>
                                    <div class="row g-1">
                                        <div class="detail-item">
                                            <p class="detail-item-label col-6 py-0 text-nowrap">Patient ID</p>
                                            <p class="detail-item-value col-6 py-0" data-field="patient_code">${d.client_code}</span>
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
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="row">
                                <p class="trans-text text-nowrap fw-bold fs-5" data-langprop="patient.Vital Signs"></p>
                            </div>
                            <div class="row">${mThis.displayVitalSignItems(d.vital_signs)}</div>
                        </div>
                        <div class="col-xl-3 col-lg-4 col-sm-6">
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
            //div_wrapper.slideDown(500);
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

    this.showHistory = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        //div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        div_workspace.html(`<div class="d-flex p-3">
        <div style="height:25px"></div>
        <ul>
         <li>Chief Complaints</li>
         <li>Physical Examinations</li>
         <li>Laboratory Tests</li>
         <li>Diagnosis</li>
         <li>Prescriptions</li>
         <li>Recommendations</li>
        </ul>
        </div>`);
        mThis.current_view_name = 'history';
    };

    this.startConsult = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        //div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        div_workspace.html(`<div class="d-flex p-3">
        <div style="height:25px"></div>
        <ul>
         <li>Chief Complaints</li>
         <li>Physical Examinations</li>
         <li>Laboratory Tests</li>
         <li>Diagnosis</li>
         <li>Recommendations</li>
        </ul>
        </div>`);
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
        //let d = 0;
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                //if (mThis.col_titles.hasOwnProperty(prop)) {}
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'ticket', LocaleManager.lang);
            }
            //d =1;
            mThis.lang = LocaleManager.lang;
        }
        //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
    }

    // this.loadChiefComplaints = ()=>{
    //     window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((d)=>{
    //         mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
    //    });
    // }
 
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

    // //return json object about Appointment's client details (name,sex,phone_number,...) from expandable view
    // this.getClientInfo = (tr)=>{
    //    let div = tr.find('.appt-info-wrapper');
    //    let appt_id = div.data('apptid');
    //    let lead_id = div.data('leadid');
    //    let d = {'appt_id':appt_id,"lead_id":lead_id};
    //    div.find('.detail-item-value').each(function(){
    //       let span = $(this);
    //       let f = span.data('field');
    //       d[f] = span.text();
    //    });
    //    return d;
    // }

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
 
        // //remove Chief complaint item, on Appoinment list expanaded view
        // mThis.tblTickets.on('click', 'a.qul-remove-complaint', function (e) {
        //     e.preventDefault();
        //     let lnk = $(this);
        //     let ul = lnk.closest('ul');
        //     let p = {
        //         'chief_complaint_id': lnk.data('id'),
        //         'ticket_id': ul.data('tid')
        //     };

        //     let li = $(this).closest('li');
        //     cv_interact.confirm('Delete this item?', {
        //         'confirmButtonText': 'Delete',
        //         'cancelButtonText': 'Dont Delete',
        //         'context': 'delete'
        //     }, (yes) => {
        //         if (yes) {
        //             window.vsapi.call(`${main_view.base_url}/api/ticket/remove-chief-complaint`, p, null, null).then((res) => {
        //                 if (res.status_code === 200) {
        //                     li.remove();
        //                 } else cv_interact.warning(res.error_message);
        //             });
        //         }
        //     });
        // });

        mThis.tblTickets.on('click', '.btn_ticket_status', function (e) {
            e.preventDefault();
            let btn = $(this);
            let status_id = btn.data('statusid');
            alert('Change status from ' + status_id);
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_modify', function (e) {
            e.preventDefault();
            let lnk = $(this);
            //let op = {'identity_value':lnk.data('id')};
            // AppointmentDialog.show(op,(e)=>{
            //     if(e){
            //         cv_interact.info('Appointment details has been saved',null,true);
            //         mThis.displayTicketList();
            //     }
            // });
        });

        this.cfg = new ExpandableRowConfig('_qul_tblTickets', {
            'dontExpandByClickingOn': ['btn_ticket_modify', 'btn_apt_delete', 'btn_ticket_action'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen': (container, detail_tr, parent_tr) => {
                //alert(detail_tr.find('ul').html());
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

        // mThis.setExpandableRow('_activeloan_tblLoans',function(){
        //    return `<div style="width:100%;padding:10px"> This is new expandable</div>`;   
        // });

        // this.tblTickets.on('click','tr',function(e){
        //     let tr = $(this);
        //     mThis.expandableRow(tr,'expandable-wrapper'); 
        // });

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


        // mThis.tblTickets.on('mouseover','tr',function(e){
        //    let btn = $(this).find('a.btn_apt_action');

        //    btn.find('i').css('color','red');
        // }).on('mouseleave','tr',function(e){
        //     let btn = $(this).find('a.btn_apt_action');
        //     btn.find('i').css('color','#E9E7E7');

        // });
    }

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    /**
     items = [
        {
            cssClass:"acl_edit",
            click:function(){

            },
            
        }
     ]  
      **/
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
            //'<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_approve" href="#"><i class="fa fa-check" style="color:green"></i> Approve Loan</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="#"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            //'<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_change_status" href="#"><i class="fa fa-tasks" style="color:grey;margin-top:3px;font-size:1.1em"></i> <span>Change Status</span</a>',
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
                //alert('destroyed => '+  mThis.tblTickets.html());
                mThis.table = null;
            }
            //begin::Set up columns
            //let cnt = 1;
            let my_columns = [
                //  {
                //      // data:function(data,type,meta) {
                //      //     return cnt++;
                //      // },
                //      // title:'NO.'
                //      className:'col_action',
                //      data:function(data,row,display) {
                //       let html =['<div class="action-menus dropdown" style="margin-top:-10px">',
                //           '<a href="javascript:void(0)" data-id="',data.id,'" data-personid="',data.person_id,'" data-statusid="',data.status_id,'" class="btn_apt_action">',
                //           '<i class="fa fa-tasks" style="color:#E9E7E7;font-size:1.1em"></i>',
                //           //' Action',
                //           '</a>',
                //          '</div>'].join('');
                //          return html;

                //      } 
                //  },
                {
                    data: function (data, a, b) {
                        return ['<span class="qul-ticket-number">', data.ticket_number, '</span>',
                            //'<a class="btn btn-sm btn-outline-success btn-consult"><i class="fa fa-user-check"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Serve">Serve</span></a>'
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
                //  {
                //     title: mThis.trans_title('Client Phone'),
                //     data:(data,a,b)=>{
                //       return data.client_phone_number;
                //     }
                // },
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
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_apt_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
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
                    'columns': my_columns
                    , "createdRow": function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                        tr.data('tid', data.id);
                        //both of the above "tid" and "id" are the same. It is ticket ID
                        tr.data('statusid', data.status_id);
                        tr.data('clientid', data.client_id);
                        tr.data('personid', data.person_id);
                    }
                    //    ,"cellCreated":function(td,data,colIndex) {
                    //        alert('test');
                    //      if(colIndex==9){
                    //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                    //         $(td).html(html); 
                    //      }
                    //   }    								
                });
            // let div = $('#_dl_d_filter_panel');  
            // $('#_dl_tblTickets_wrapper>div.dt-buttons').prepend(div);
            if (typeof onFinish === 'function') onFinish();
            //mThis.cfg.open(mThis.tblTickets.find(`tr:last`));                
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
        //if(!option) option={};
        mThis.displayTicketList(() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }

    // this.setExpandableRow = (table_id,createHTML=null,op={})=>{
    //    let tbl = $(`#${table_id}`);
    //    if(!op) op = {};

    //    tbl.on('click','tr',function(){
    //         let tr = $(this);
    //         if (tr.hasClass('expandable-row')) return;
    //         let next_tr = tr.next();
    //         if (next_tr.hasClass('expandable-row')){
    //             next_tr.show();
    //             mThis.prev_selected_row =null;
    //             return;
    //         }
    //         // `<tr class="expandable-row"><td colspan="10"><div class="${cssClass}"></div><h4>This is a test expanded</h4></td></tr>`;  
    //         let html = (typeof createHTML==='function')? createHTML():`</div><h4> This is default Panel for Expandable Row </h4></div>`; 
    //         let row_id = [table_id,'_',op.id].join('');
    //         tr.after(`<tr id="${row_id}" data-id="${op.id}" class="expandable-row ${op.rowClass}"><td colspan="${op.colspan?op.colspan:'100%'}">${html}</td></tr>`);     
    //    });
    // }
}


// //begin::PatientDialog => register Patient
//  let PatientDialog = new function(){
//     let mThis = this;
//     this.self = $('#_qul_dlgPatient');
//     this.elTitle = $('#_qul_dlgPatient_title');
//     this.elNat = $('#_pat_nationality');
//     this.elConsultant = $('#_pat_consultant');
//     this.elDepartment = $('#_pat_department');

//     this.elError = $('#_qul_dlgPatient_error');
//     this.btnSave = $('#_qul_dlgPatient_btnSave');
//     this.btnSaveAndQueue = $('#_qul_dlgPatient_btnSaveAndQueue');

//     this.elDateOfBirth = $('#_pat_dob');
//     this.elAge = $('#_pat_age');
//     this.elAgeUnit = $('#_pat_age_unit'); //span
//     this.divVitalSign = $('#pat_vital_signs');
//     this.divMedConditions = $('#med_con_panel');

//     this.btnSave.on('click',function(e){
//        e.preventDefault();
//        //let tr = $(this).closest('tr');
//        mThis.registerPatient(0);
//     });

//     this.btnSaveAndQueue.on('click',(e)=>{
//         mThis.registerPatient(1);
//     });

//     this.elDateOfBirth.on('change',(e)=>{
//         let now = Date();
//         let d = VSUtil.daysBetween(this.elDateOfBirth.val(),now);
//         let unit = 'months';
//         d = Number(d).toFixed(2);
//         if(d >360){
//             unit ='years';
//             d = Number(d/365).toFixed(2);
//         }else if (d<30){
//             unit ='days';
//             d = Number(d).toFixed(2);
//         }else if (d>=30){
//             unit ='months';
//             d = Number(d/30.5).toFixed(2);
//         }

//         mThis.elAgeUnit.text(unit);
//         mThis.elAge.val(d);
//     });

//     //save patient details (profile), or/and Add the patient to Waiting Queue 
//     this.registerPatient = (addToQueue=0)=>{
//         let p = mThis.getFormData();
//         p.addToQueue = addToQueue;

//         if (!p.appt_id){
//           cv_interact.warning('The appointment identifer is unexpectedly missing'); 
//           return;
//         }

//         //alert(JSON.stringify(p));
//         window.vsapi.call(`${main_view.base_url}/api/patient/register`,p,null,null).then((res)=>{
//            if(res.status_code===200){
//               //Refresh data in Expanded panel
//               if (typeof mThis.onClose === 'function') mThis.onClose(res);
//                mThis.self.modal('hide');
//            }else{
//                //cv_interact.warning(res.error_message);
//                VSUtil.showDialogError('_apl_dlgPatient',res.error_message,5000);
//            }
//         });
//     }

//     this.getVitalSignInputs = ()=>{
//         let ps = [];
//         mThis.divVitalSign.find('.data-input').each(function(){
//             let el = $(this);
//             let vs_id = el.data('vitalsignid');
//             ps.push({"id":vs_id,"display_name":el.data('ffield'),"value":el.val()?el.val():""});
//         });
//         return ps;
//     }

//     this.getMedConditions = ()=>{
//         let ps = [];
//         mThis.divMedConditions.find('.m-checkbox').each(function(){
//             let el = $(this);
//             //mc_id = Medical Condition item ID
//             let mc_id = el.data('mcid');
//             let val = el.is(':checked')? 1:0;
//             ps.push({"id":mc_id,"display_name":el.data('ffield'),"value":val});
//         });
//         return ps;
//     }


//     this.prepareVitalSignFields =(fields =[])=>{
//         mThis.divVitalSign.empty();

//         (fields || []).map((f,index)=>{
//             let field_name = (f.display_name+'').replace(' ','').toLowerCase();
//             mThis.divVitalSign.append(`
//              <div data-id="vital_sign_${f.id}" class="form-group col-lg-3">
//                 <span class="simple-label trans-text vital-sign-label" data-langprop="patient.${f.display_name}">${f.display_name}</span> 
//                 <div><input data-vitalsignid="${f.id}" type="${f.value_type}" data-field="${field_name}" data-ffield="${f.display_name}" class="form-control data-input"></div> 
//               </div>
//            `);
//         });
//     }

//     //Prepare Medical Conditions Fields for user to input
//     this.prepareMCFields =(fields=[])=>{
//         mThis.divMedConditions.empty();
//         (fields || []).map((f,index)=>{
//             let field_name = (f.display_name+'').replace(' ','').toLowerCase();
//             mThis.divMedConditions.append(`
//               <div class="form-inline"><input type="checkbox" class="m-checkbox" data-mcid="${f.id}" data-field="${field_name}" data-ffield="${f.display_name}">&nbsp;<span>${f.display_name}</span></div>
//            `);
//         });
//     }

//     this.getFormData = ()=>{
//         let p = {};
//         //Appointment ID (appt_id). If Regisering patient from Appointment List, there is mThis.appt_id > 0
//         p.appt_id = mThis.appt_id;
//         p.lead_id= mThis.lead_id;
//         mThis.self.find('.data-input-reg').each(function(){
//             let el = $(this);
//             let f = el.data('field');
//             p[f] = el.val();
//         });
//         p.department_id = mThis.elDepartment.val();
//         p.consultant_id = mThis.elConsultant.val();
//         p.vital_signs = mThis.getVitalSignInputs();
//         p.mc_items = mThis.getMedConditions();
//         return p;
//     }

//     this.prepareOptions = (onFinish)=>{
//         /** "api/patient-reg-options" returns object {nationalities: [], vital_sign_fields:[] } that is used as nationality options and vital sign fields **/
//      window.vsapi.call(`${main_view.base_url}/api/patient-reg-options`,null).then((res)=>{
//         if(res.status_code===200){
//             let nats = StringSanitizer.sanitizeObject(res.data.nationalities);
//             let vital_sign_fields = StringSanitizer.sanitizeObject(res.data.vital_sign_fields);
//             //mc_items is array of medical condition items
//             let mc_items = StringSanitizer.sanitizeObject(res.data.mc_items);
//             let departments = StringSanitizer.sanitizeObject(res.data.departments);
//             let consultants = StringSanitizer.sanitizeObject(res.data.consultants);

//             VSUtil.setComboItems(mThis.elNat,nats,'id','nationality',true,'(Choose nationality)',null);
//             VSUtil.setComboItems(mThis.elDepartment,departments,'id','department_name',false,null,null);
//             VSUtil.setComboItems(mThis.elConsultant,consultants,'id','consultant_name',true,'(Choose doctor)',null);
//             mThis.prepareVitalSignFields(vital_sign_fields);
//             mThis.prepareMCFields(mc_items);
//             onFinish();
//         }
//      });
//     }

//     this.clearForm = ()=>{
//         mThis.setData(null);
//         mThis.self.find('.error_text').each(function(){
//                $(this).remove();   
//         });
//         VSUtil.hideDialogError('_apl_dlgPatient');
//     }

//     //setData() on PatientDialog
//     this.setData = (d)=>{
//        d = d?d:{};
//        mThis.appt_id = d.appt_id;
//        mThis.lead_id = d.lead_id;
//        mThis.elAgeUnit.text(null);1153
//        mThis.elError.val(null);

//        // class "data-input-reg" is for person's data input such as "name, date_of_birth,phone_number,email, ..."
//        mThis.self.find('.data-input-reg').each(function(){
//          let el = $(this);
//          let f = el.data('field');
//          if(el.is('select')){
//            el.val(d[f]).trigger('change');
//            //set data attribute data-error =0 (i.e: No data validation error on first load)
//            el.data('error',0);
//          }else el.val(d[f]);
//        });
//     }

//     //option = {id,default_nationality}
//     this.show = (option,onClose=null)=>{
//         option = option?option:{};   
//         mThis.option = option;
//         mThis.onClose = onClose;

//         mThis.prepareOptions(()=>{

//             if(option.id > 0){
//                 mThis.elTitle.text(LocaleManager.trans('Modify Patient','titles'));
//             }else  {
//                 //Clear previous data
//                 mThis.clearForm();
//                 mThis.elTitle.text(LocaleManager.trans('Register Patient','titles'));

//                 //Set default nationality
//                 if (!option.default_data) option.default_data = {};
//                 option.default_data.nationality ="Cambodia";
//                 if (option.default_data.nationality){
//                     let nat_id = 0;
//                     let ops = mThis.elNat.find('option');

//                      ops.map((index,i)=>{
//                        //console.error(i.textContent);
//                        if(i.textContent === 'Cambodia'){
//                          nat_id = i.value;
//                          return false;
//                        }
//                     });

//                     //  nat_id = mThis.elNat.find('option').filter((item)=>{
//                     //      return item.text === option.default_data.nationality;
//                     //  });

//                      if(nat_id>0){
//                           option.default_data.nationality_id = nat_id;
//                           //mThis.elNat.val(nat_id).trigger('change');
//                      }
//                  }

//                  //Set default data on Patient Form
//                  mThis.setData(option.default_data);
//             }

//                     mThis.self.modal({
//                         backdrop:'static'
//                     });

//          });

//     }

//  }
// //end::PatientDialog



//begin::ConsultTabView 
let ConsultTabView = new function(){
    let mThis = this;
    this.self = $('#_consultTabView');
    this.base_url = main_view.base_url;
    this.ticket_id = null;
    this.patient_id =null;

    //this.data is used to store form options such as chief_complaints, vital_signs, etc ...
    this.data = {};

    this.cur_view = 'consultation';
    
    this.self.on('click','div.tab-header>a.tab-button',function(e){
        e.preventDefault();
        //alert($(this).data('target'));
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(mThis.client_id,view_name,true);
    }); 

    //options = {patient_id,ticket_id}
    this.show = function(options,view_name,tab_button_clicked = false){
         if(!options) options = {};
         mThis.patient_id = options.patient_id;
         mThis.ticket_id = options.ticket_id;
        if(!mThis.ticket_id) console.error('ConsultTabView on ConsultDialog does not have valid ticket_id, thus it is not possible to identify patient');

         if (!view_name) view_name = mThis.cur_view;
         view_name = (view_name+'').toLowerCase();
               
         mThis.self.find('div.tab-body>div.tab-panel').each(function(){
            let this_view_name =($(this).data('viewname')+'').toLowerCase();
            let div_tab_panel = $(this);
        
            if(view_name === this_view_name) {
                mThis.cur_view = view_name;
                $(this).show().siblings().hide();
                   
                  //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
                       if (view_name ==='history') {
                           mThis.displayHistory(mThis.patient_id,div_tab_panel);
                       } else if (view_name ==='consultation') {
                           mThis.displayConsultation(mThis.ticket_id,div_tab_panel);
                       }
                       // else {
                       //   //do nothing   
                       // }
                  //end:: dispay content data

                return;
             } 
         }); 

         //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
         if(!tab_button_clicked) {
           mThis.self.find('div.tab-header>a.tab-button').each(function() {
             let this_view_name =($(this).data('viewname')+'').toLowerCase();
             if (view_name === this_view_name){
                 $(this).addClass('active').siblings().removeClass('active');
             }
           });
        }
    } 

    //begin:: Event handlers for History Tab  and Consultation tab

    ////this.displayHistory = (patient_id =0, div_tab_panel=null)=>{}

    ////this.displayConsultation = (ticket_id = 0,div_tab_panel=null)=>{}
    //end:: Event handlers for History Tab  and Consultation tab

    //begin::init ConsultTabeView (menus item event handlers and so on)
    this.init = () => {
        mThis.ul_menus_consult = $('#_consult_menus');
        mThis.ul_menus_history = $('#_history_menus');

        //div panel that contains each consultation item's details
        mThis.consultItemPanel = $('#_consult_panel');
        mThis.historyItemPanel = $('#_history_panel');

        mThis.consultItemPanel.on('click','a.consultview-add-cc',(e)=>{
            e.preventDefault();
            mThis.tblChiefComplaints.addRow();
        });
        
        mThis.details_routes_history = mThis.defineDetailRoutesHistory(mThis.historyItemPanel);
        mThis.details_routes_consult = mThis.defineDetailRoutesConsult(mThis.consultItemPanel);

        mThis.ul_menus_consult.on('click','li',function(e){
           e.preventDefault();
           let li = $(this);
           //let targetElementId = li.find('a').data('target');
           let view_name =  li.find('a').data('viewname'); 
           if(mThis.prev_selected_li_consult) mThis.prev_selected_li_consult.removeClass('consult-menu-selected');
           li.addClass('consult-menu-selected');
           mThis.prev_selected_li_consult = li;

           mThis.details_routes_consult[view_name]();
        });

        mThis.ul_menus_history.on('click','li',function(e){
            e.preventDefault();
            let li = $(this);
            let view_name = li.find('a').data('viewname');
            if(mThis.prev_selected_li_history) mThis.prev_selected_li_history.removeClass('history-menu-selected');
            li.addClass('history-menu-selected');
            mThis.prev_selected_li_history = li;

            mThis.details_routes_history[view_name]();
        });
    }
    //end::init ConsultTabeView (menus item event handlers and so on)

    //begin:: Define routes to details view of all menu items on the "Consult" tab
    this.defineDetailRoutesConsult = (div)=>{
       return {
          "chief_complaints":() => {
             mThis.showConsultChiefComplaints(div);
          },
          "vital_signs":() => {
            mThis.showConsultVitalSigns(div);
          },
          "visual_signs":() => {
            mThis.showConsultVisualSigns(div);
          },
          "physical_examination":() => {
            mThis.showConsultPE(div);
          },
          "prescription":() => {
            mThis.showConsultPrescription(div);
          },
          "labo_tests":() => {
            mThis.showConsultLaboratoryTests(div);
          },
          "diagnosis":() => {
            mThis.showConsultDiagnosis(div);
          },
          "recommendations":() => {
            mThis.showConsultRecommendations(div);
          },
          "medical_report":() => {
            mThis.showConsultMedicalReport(div);
          },
       };
    }
    //end::Detail Routes of Consult

    //Define menu routes on History tab
    this.defineDetailRoutesHistory = (div) => {
        return {
            "chief_complaints":() => {
                mThis.showHistoryChiefComplaints(div);
            },
            "physical_examinations":() => {
                mThis.showHistoryPhysicalExaminations(div);
            },
            "laboratory_tests":() => {
                mThis.showHistoryLaboratoryTests(div);
            },
            "diagnosis":() => {
                mThis.showHistoryDiagnosis(div);
            },
            "prescriptions":() => {
                mThis.showHistoryPrescription(div);
            },
            "recommendations":() => {
                mThis.showHistoryRecommendations(div);
            },
            "medical-reports":() => {
                mThis.showHistoryMedicalReports(div);
            }
        };
    };

    //begin::Any options of consult
    this.showConsultChiefComplaints = (div)=>{
        let wrapper_id ='_consult_cc_warpper';
        let div_id = '_consult_cc_list';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');

        if (!el || el.length ===0){
            let title = LocaleManager.trans('This is Chief complaints','consult');
            let html = `<div id="${wrapper_id}"><h3 class="trans-text" data-langprop="consult.Chief Complaints">${title} &nbsp;<a href="#" class="consultview-add-cc"><i class="fa fa-plus-circle"></i></a></h3>
              <div id="${div_id}"></div>
            </div>`;
           
            div.append(html);

                let columns = [
                    {
                        "name":"name",
                        "title":"Chief Complaint",
                        "dataType":"string",
                        "displayType":"select",
                        "cssClass":"",
                        //"selectOptions":[] 
                    }
                ];

                mThis.loadChiefComplaintOptions(ticket_id,cc_items=>{
                    //After having loaded chief complaint options from server => init cc-table
                   
                    columns[0].selectOptions = cc_items;
                    mThis.tblChiefComplaints = new ItemsView(div_id,{
                        "columns":columns,
                        "langProp":"consult",
                        "tableClass":"table",
                        "showColumnHeaders":false,
                        "showAddLineButton":false,
                        "onItemChange":(col_name)=>{
                             console.error(col_name + ' has changed');
                        },
                        //"addLineButtonText":"Add CC",
                        //"addLineButtonClass":null,
                        //"cssClass":"td_class",
                        "numeroFormatter":(numero,row)=>{
                            return `<span class="text-secondary fw-bold">${numero}</span>`; 
                        },
                        "emptyMessage":`<span class="text-secondary text-align-center">${LocaleManager.trans('No chief complaints','consult')}</span>`,
    
                    });
                    
                    //mThis.tblChiefComplaints.setSelectOptions('name',cc_items);
                    el = div.find(`#${wrapper_id}`);
                });
        }

        el.show().siblings().hide();   
       
    }

    this.loadChiefComplaintOptions =(patient_id=0, onFinish=null)=>{
       mThis.data.chief_complaint_options = [
        {"value":"1","text":"Highe temperature"},
        {"value":"2","text":"Abdominal pain"}
       ];
       onFinish(mThis.data.chief_complaint_options);
    }

    //LoadPatientVitalSigns() | Load vital signs for one patient
    this.loadVitalSigns_patient = (patient_id=0,onFinish)=>{
        let items = [
            {'name':'s1','value':'30'},
            {'name':'s2','value':'35'},
            {'name':'23','value':'51'},
        ];
         onFinish(items);
    }
 
    this.showConsultVitalSigns = (div)=>{
        let ticket_id = div.data('tid');
        let wrapper_id ='_consult_vt_wrapper';
        let el = div.find(`#${wrapper_id}`);

        mThis.loadVitalSigns_patient(ticket_id, items => {
             let html_vs_items = "";
             items.map(t =>{
                html_vs_items = [html_vs_items,`<tr><td>`,t.name,`</td><td><input class="form-control w-50" type="text" value ="`,t.value,`"></td></tr>`].join('');
             });

                if(!el || el.length === 0){
                        let title = LocaleManager.trans('Vital Signs','consult'); 
                        let html = `
                        <div id="${wrapper_id}" style="display:none">
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
    
    this.loadPE_patient = (ticket_id,onFinish)=>{
       let d = {};
       onFinish(d);
    }

    this.showConsultPE = (div)=>{
        let patient_id = div.data('patientid');
        let ticket_id = div.data('tid');
        let wrapper_id ='_consult_pe_wrapper';
        let el = div.find(`#${wrapper_id}`);

        mThis.loadPE_patient(ticket_id, pe => {
             let html = "";
            
                if(!el || el.length === 0){
                        let title = LocaleManager.trans('Physical Examination','consult'); 
                        let html = `
                        <div id="${wrapper_id}" style="display:none">
                        <h3 class="trans-text" data-langprop="consult.Pysical Examination">${title}</a></h3>
                        <div class="">
                           <textarea class="form-control" cols="10"></textarea>
                        </div>
                    </div>
                    `;
                    div.append(html);
                    el = div.find(`#${wrapper_id}`);
                }
                
                el.show().siblings().hide();
        });

    
         
    }
    
    this.loadPrescription = (ticket_id=0,onFinish)=>{
       let d = {};
       d.products = [
         {value:"1","text":"Medicine 1"}
         , {value:"2","text":"Medicine 2"}
         , {value:"4","text":"Medicine 3"}
         , {value:"5","text":"Medicine 4"}
         , {value:"6","text":"Medicine 5"}
       ];
       d.usage_options = [
        {value:"1","text":"1 x 3"}
        , {value:"2","text":"1 x 4"}
        , {value:"4","text":"1 x 5 After Meal"}
       ];  
       onFinish(d);
    }

    this.showConsultPrescription = (div)=>{
        let wrapper_id ='_consult_pres_warpper';
        let div_id = '_consult_prescription';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');

        if (!el || el.length ===0){
            let title = LocaleManager.trans('Prescription','consult');
            let html = `<div id="${wrapper_id}"><h3 class="trans-text" data-langprop="consult.Prescription">${title}</h3>
              <div id="${div_id}"></div>
            </div>`;
           
            div.append(html);
                let columns = [
                    {
                        "name":"name",
                        "title":"Medication",
                        "dataType":"string",
                        "displayType":"select",
                        "cssClass":"",
                        //"selectOptions":[] 
                    },
                    {
                        "name":"qty",
                        "title":"Quantity",
                        "dataType":"number",
                        "displayType":"input"
                        // ,"data":(value,row)=>{
                        //     return "";
                        // }
                    },
                    {
                        "name":"usage",
                        "title":"Usage",
                        "dataType":"string",
                        "displayType":"select"
                    }
                ];

                mThis.loadPrescription(ticket_id,d=>{
                    //After having loaded prescription data from server => init prescription table
                    columns[0].selectOptions = d.products;
                    columns[2].selectOptions = d.usage_options;
                    mThis.tblProducts  = new ItemsView(div_id,{
                        "columns":columns,
                        "langProp":"consult",
                        "tableClass":"table presciption-table",
                        "showColumnHeaders":true,
                        "showAddLineButton":true,
                        "addLineButtonText":"Add Item",
                        //"addLineButtonClass":null,
                        //"cssClass":"td_class",
                        "numeroFormatter":(numero,row)=>{
                            return `<span class="text-secondary fw-bold">${numero}</span>`; 
                        },
                        "emptyMessage":`<span class="text-secondary text-align-center">${LocaleManager.trans('No item prescribed','consult')}</span>`,
    
                    });
                    //mThis.tblChiefComplaints.setSelectOptions('name',cc_items);
                    el = div.find(`#${wrapper_id}`);
                });
        }

        el.show().siblings().hide();   
    }

    this.showConsultVisualSigns = (div)=>{
        let html = `<h3>This is Visual Signs</h3>`;
        div.html(html);
    }

    this.showConsultPhysicalExamination = (div) => {
        let html = `<h3>This is Physical Examination</h3>`;
        div.html(html);
    }

    this.showConsultLaboratoryTests = (div) => {
        let html = `<h3>This is Laboratory Test</h3>`;
        div.html(html);
    }

    this.showConsultDiagnosis = (div) => {
        let html = `<h3>This is Diagnosis</h3>`;
        div.html(html);
    }
    
    this.showConsultRecommendations = (div) => {
        let html = `<h3>This is Recommendations</h3>`;
        div.html(html);
    }

    this.showConsultMedicalReport = (div) => {
        let html = `<h3>This is Medical Report`;
        div.html(html);
    }
    //end::Any options of consult

    //begin::Any options of history
    this.showHistoryChiefComplaints = (div) => {
        let html = `<h3>This is Chief Complaint</h3>
        <div class="d-block">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="fw-bold">Date</th>
                            <th class="fw-bold">h:m:ss</th>
                            <th class="fw-bold">Doctor Name</th>
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

    this.showHistoryPhysicalExaminations = (div) => {
        let html = `<h3>Physical Examination</h3>
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
                </table>
            </div>
        </div>`;
        div.html(html);
    }

    this.showHistoryLaboratoryTests = (div) => {
        let html = `<h3>Laboratory Tests</h3>
        <div class="d-block">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="fw-bold">Test Name</th>
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
    }

    this.showHistoryDiagnosis = (div) => {
        let html = `<h3>This is Diagnosis</h3>
        <div class="d-block">
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="fw-bold">Date</th>
                            <th class="fw-bold">Description</th>
                            <th class="fw-bold">Doctor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td class="vs-contain-custom">
                                <p>
                                    A clinic (or outpatient clinic or ambulatory care clinic) is a health facility that is primarily focused on the care of outpatients. Clinics can be privately operated or publicly managed and funded. They typically cover the primary care needs of populations in local communities, in contrast to larger hospitals which offer more specialised treatments and admit inpatients for overnight stays.
                                <p>
                                <span id = "diag_${patient_id}" class="diag-detail"></span>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`;
        div.html(html);
    }

    this.showHistoryPrescription = (div) => {
        let html = `<h3>This is Prescription</h3>`;
        div.html(html);
    }

    this.showHistoryRecommendations = (div) => {
        let html = `<h3>This is Recommedations</h3>`;
        div.html(html);
    }

    this.showHistoryMedicalReports = (div) => {
        let html = `<div class="d-block">
            <div class="d-flex align-items-center justify-content-center">
                <h3>Medical Reports</h3>
            </div>
            <div class="d-block">
                <div class="d-flex align-items-center">
                    <div>
                        <p class="trans-text" data-langprop="patient.Patient ID">Patient ID :</p>
                    </div>
                    <div>
                        <p class="">008</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div>
                        <p class="trans-text" data-langprop="patient.Patient Name">Patient Name :</p>
                    </div>
                    <div>
                        <p class="">Koko</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div>
                        <p class="trans-text" data></p>
                    </div>
                    <div></div>
                </div>
            </div>
        <div>`;
        div.html(html);
    }
    //end::Any options of history
}
//end::ConsultTabView

//begin::ConsultDialog
let ConsultDialog = new function(){
    let mThis = this;
    this.self = $('#_qul_dlgConsult');
    this.btnSave = $('#_qul_dlgConsult_btnSave');
    this.defaultTabView= 'consultation';

    this.btnSave.on('click',(e)=>{
      e.preventDefault();
      //tod; Save consult session info

      mThis.self.modal('hide');
      mThis.onClose(true);
    });
    
    ConsultTabView.init();

    // @option = {patient_id,ticket_id,onClose:()=> { ... }}
    this.show = (option)=>{
        if(!option) option = {};
        mThis.onClose = option.onClose;
        ConsultTabView.show({"ticket_id":option.ticket_id,"patient_id":option.patient_id },this.defaultTabView);
        mThis.self.modal({
            backdrop:'static'
        });
    }
}
//end::ConsultDialog


$(document).ready(() => {
    TicketDetails.init('_qul_tblTickets');
    QueueComponent.init();
});
"use strict";
let TicketDetails = new function () {
    let mThis = this;
    mThis.current_view_name = 'info';
    mThis.tblTickets = null;

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    this.init = (tblTickets_id) => {
        mThis.tblTickets = $(`#${tblTickets_id}`);

        if (mThis.tblTickets.length === 0) console.error(`Error: failed create object element ${tblTickets_id}`);
        mThis.tblTickets.on('click', '.btn-ticket-tab', function (e) {
            $(this).addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');
        });

        mThis.tblTickets.on('click','.qul-add-photo',(e)=>{
            e.preventDefault();
            let x = $(e.currentTarget);
            let ticket_id = x.data('id');
            
            FileChooser.chooseFile(null,(d)=>{
                if(!d) return ; 
                let p = {
                    ticket_id:ticket_id,
                    file_type: d.file_type,
                    photoData: d.photoData
                };
                vsapi.call(`${main_view.base_url}/api/ticket/save-patient-photo`,p,null,false).then(res=>{
                    if(res.status_code === 200){
                        let data = res.data;
                        mThis.refreshPhotos(ticket_id,data.image_urls);
                    }
                    else cv_interact.error(res.error_message);
                }); 
            });
        });

        mThis.tblTickets.on('click','.qul-delete-photo',(e)=>{
            let x = $(e.currentTarget);
            let image_id = x.data('id');
            let ticket_id =x.data('ticketid');
            cv_interact.confirm("Delete this photo?",{title:'Delete Photo',context:'delete'},e=>{
                if(e){
                    let p = {'id':image_id};
                    vsapi.call(`${main_view.base_url}/api/ticket/delete-patient-photo`,p,null,false).then(res=>{
                        if(res.status_code === 200){
                            let data = res.data;
                            mThis.refreshPhotos(ticket_id,data.image_urls);
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
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

        mThis.tblTickets.on('click', 'a.qul-btn-photo', function (e) {
            e.preventDefault();
            let div_wrapper = $(this).closest('div.ticket-info-wrapper');
            mThis.showPhoto(div_wrapper);
        });

        mThis.tblTickets.on('click', 'a.qul-btn-consult', function (e) {
            e.preventDefault();

            let ticket_id = $(this).data('tid');
            let patient_id = $(this).data('clientid');
            let that = $(this);

            cv_interact.confirm('Start consultation now?',{title:'Consultation','confirmButtonText':'Consult Now','cancelButtonText':'Later',context:'other'},(e)=>{
                if(e){
                    let op = {
                        patient_id: patient_id,
                        ticket_id: ticket_id,
                        onClose: (d) => {
                            alert('Consult Window is closing');
                        }
                    };
                    ConsultDialog.show(op);
                }
                else{
                    let tr = that.closest('tr.detail-row');
                    let div_panel = tr.find('div.ticket-info-wrapper');
                    mThis.setActiveTabButton(div_panel, 'qul-btn-history')
                    mThis.showHistory(div_panel);
                }
            });
        });

        mThis.tblTickets.on('click', 'tbody > tr > td a.qul-remove-complaint', function (e) {
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

        mThis.tblTickets.on('click', 'tbody > tr > td a.qul-add-complaint', function (e) {
            e.preventDefault();
            let x = $(this);
            let ul_id = x.data('ulid');
            let ul = $(`#${ul_id}`);
            let ticket_id = x.data('tid');

            mThis.getChiefComplaintOptions((chief_complaints) => {
                let option = { 'title': 'Choose Chief Complaint', 'dataLabel': 'Select Chief Complaint', 'valueMember': 'id', 'textMember': 'name', 'data': chief_complaints, 'blankErrorMessage': "Please choose chief complaint" };
                InputBox2.show(option, function (d) {
                    if (d) {
                        let p = { "chief_complaint_id": d.value, "name": d.text, 'ticket_id': ticket_id };
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

    this.addCCToList = (ul, item = {}) => {
        let appt_id = ul.data('apptid');

        ul.find('li[data-apptid="0"]').remove();
        ul.append(`<li id="${item.id}" data-apptid="${appt_id}"><a href="javascript:void(0)" data-apptid="${appt_id}" data-id="${item.id}" class="qul-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`);
    }

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

    this.show = (detail_tr, d = {},def_tab_view=null) => {
        //For Receiptionist, default tab view is "info", and other tab buttons such as "History", "Photo","Consult" are not allowed
        if(def_tab_view) mThis.current_view_name = def_tab_view;
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        let html_photo_button =``;
        let html_consult_button =``;
        let html_history_button =``;
        let html_prescribption_button =``;
        if (QueueComponent.options.showPatientPhotos || QueueComponent.options.showPatientPhoto) html_photo_button = `<a style="padding:5px" type="button" data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-photo trans-text" data-langprop="buttons.Photo">Photo</a>`;
        if (QueueComponent.options.showConsultButton) html_consult_button =`<a style="padding:5px" type="button" data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-consult trans-text" data-langprop="buttons.Consult Now">Consult Now</a>`;
        if (QueueComponent.options.showPrescriptionButton) html_prescribption_button =`<a href="javascript:void(0)" class="qul-btn-prescribe btn-sm btn-outline-primary trans-text" data-langprop="buttons.Prescription">Prescription</a>`;
        if (QueueComponent.options.showHistoryButton) html_history_button =`<a style="padding:5px" type="button" data-clientid="${d.client_id}" data-tid="${d.ticket_id}" data-patientid="${d.patient_code}" class="btn-ticket-tab qul-btn-history trans-text" data-langprop="buttons.History">History</a>`;
        
        let html = `<div data-tid="${d.ticket_id}" data-clientid="${d.client_id}" data-personid="${d.person_id}" data-statusid="${d.status_id}" class="ticket-info-wrapper shadow-lg d-flex" style="width:100%;">
                    <div class="form-inline ticket-tab-buttons" role="group" aria-label="ticket tabs" style="display:block">
                        <a style="padding:5px" type="button"  data-clientid="${d.client_id}" data-tid="${d.ticket_id}" class="btn-ticket-tab qul-btn-info trans-text" data-langprop="buttons.Info">Info</a>
                        ${html_history_button}
                        ${html_photo_button}
                        ${html_consult_button}
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
            case 'history': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-history')
                mThis.showHistory(div_panel);
                break;
            }
            case 'photo': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-photo')
                mThis.showPhoto(div_panel);
                break;
            }
            case 'consult': {
                mThis.setActiveTabButton(div_panel, 'qul-btn-consult');
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
        let ws_id = ['ticket_', ticket_id].join('');
        let div = div_workspace.find(`#${ws_id}`);
        
        div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = { 'id': ticket_id };
        window.vsapi.call(`${main_view.base_url}/api/ticket/details`, p, 'POST', false).then((res) => {
            let html = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                if (!d) d = {};
                d.patient_code = d.patient_code ? d.patient_code : 'N.A.';
                d.consultant_name = d.consultant_name ? d.consultant_name : 'N.A.';
                d.membership_card = d.membership_card ? d.membership_card : 'None';
                let email = d.email ? d.email : 'N.A.';
                
                let ticket_id = d.id;
                let html_prescription_button =``;
                let html_generate_invoice_button =``;
                if (QueueComponent.options.showPrescriptionButton) html_prescription_button =` <button class="qul-btn-prescribe btn btnsm btn-outline-primary qul-btn-prescribe">${LocaleManager.trans('Prescription','buttons')}</button>`;
                if (QueueComponent.options.showInvoiceButton) html_generate_invoice_button =`<button data-tid="${ticket_id}" class="qul-btn-generate-invoice btn btn-sm btn-outline-primary trans-text" data-langprop="buttons.Generate Invoice">${LocaleManager.trans('Generate Invoice','buttons')}</button>`;   
                   html = [`<div id="${ws_id}" data-ticketid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="row">
                        <div class="d-flex" style="max-width: 1300px; width:100%">
                            <div class="row gy-3 w-100">
                                <div class="col-xl-6">
                                    <div class="row d-flex flex-nowrap">
                                        <div style="width:163px; max-width: 165px;">
                                            <img src="${mThis.icon_url()}/client-girl.png" class="profile-thumbnail pe-2 img-thumbnail"/>
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
                                                    <ul id="qul-complaint-list-${ticket_id}" data-tid="${ticket_id}" class="apl-complaint-list overflow-y-auto" style="list-style:none;max-height:141px">
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
                                <div class="d-block">
                                    ${html_prescription_button}
                                    ${html_generate_invoice_button}
                                </div>
                            </div>
                        </div>
                    </div>`
                    ].join('');
                }
                else {
                    html = `<div class="expanded-row-error">${error_message}</div>`;
                }

                div_workspace.html(html);
                div.show();
                ////LocaleManager.translateZone(ws_id);
                mThis.current_view_name = 'info';

                div_workspace.find('.qul-btn-generate-invoice').off('click').on('click',e => {
                    e.preventDefault();
                    let p = {'ticket_id':ticket_id};
                    vsapi.call(`${main_view.base_url}/api/medical-invoice/create`,p,null,false).then(res=>{
                        if(res.status_code ==200){
                            let invoice_number = res.data.ref_number;
                            cv_interact.success(`Invoice ${invoice_number} created!`);
                        }
                        else cv_interact.error(res.error_message);
                    });
                });

                div_workspace.find('.qul-btn-prescribe').off('click').on('click',e => {
                    e.preventDefault();
                    let op = {
                        'ticket_id': ticket_id
                    };
                    PrescriptionDialog.show(op);
                });

                div_workspace.find('.qul-btn-prescribe').off('click').on('click',e=>{
                    e.preventDefault();
                    let op = {
                        'ticket_id': ticket_id
                    };
                    PrescriptionDialog.show(op);
                });
        });
    }

    this.displayVitalSignItems = (items = []) => {
        let html = null;
        (items || []).map((v) => {
            html = [html,
                `<div class="detail-item">
                    <p class="detail-item-label text-nowrap col-6 py-0">${v.description}</p>
                    <p class="detail-item-value text-nowrap col-6 py-0" data-id="${v.id}" data-code="${v.code}" data-field="${v.description}">${v.vital_sign_value}</p>
                </div>`].join('');
        });
        return html ? html : '<span class="detail-item-empty">No vital signs</span>';
    }

    this.createPhotoItems =(ticket_id,items=[])=>{
        let html ="";
        items.map(img =>{
            html = [html,`<div class="d-flex flex-column mx-2">
                  <img style="width:150px; height:150px" class="img-thumbnail rounded" src="${img.image_url}"/>
                  <button type="button" class="btn btn-sm btn-outline-danger qul-delete-photo mt-2" data-ticketid="${ticket_id}" data-id="${img.id}">Remove</button>
                </div>`].join('');
        });
       return html;
    }

    this.refreshPhotos = (ticket_id,imgs =[])=>{
      let div = $(`#qul_photo_list_${ticket_id}`);  
      div.html(mThis.createPhotoItems(ticket_id,imgs));
    }

    this.showPhoto = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        let div_id =['div_photos_',ticket_id].join('');

        let dv = div_workspace.find(`#${div_id}`);
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/ticket/patient-photos`,p).then(res=>{
           if(res.status_code===200){
                let imgs = res.data;
                if(dv.length>0){
                    mThis.refreshPhotos(ticket_id,imgs);
                    dv.show();
                    mThis.current_view_name = 'photo';
                    return;
                }
               
                div_workspace.html(`<div id="${div_id}" class="d-flex align-items-center justify-content-center">
                    <div class="d-flex flex-column gx-3">
                    <div class="center d-flex flex-column p-3">
                        <button data-id="${ticket_id}" class="btn btn-sm btn-primary qul-add-photo">Add Photo</button> 
                    </div>   
                    </div>
                    <div id="qul_photo_list_${ticket_id}" class="d-flex gx-4 qul-photo-list">
                    ${mThis.createPhotoItems(ticket_id,imgs)}
                    </div>
                </div>`);
               mThis.current_view_name = 'photo';
           } 
        });
    };

    this.showHistory = (div_panel,ticket_id=null) => {
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html(mThis.showHistoryMedicalReports());
        mThis.current_view_name = 'history';
    };
 
    this.startConsult = (div_panel, ticket_id = null) => {
        if (!ticket_id) ticket_id = div_panel.data('tid');
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html();
        mThis.current_view_name = 'consult';
    };

    this.showHistoryMedicalReports = () => {
        this.loadDataTable = () => {
            let data = [
                {"id":"D07452","date":"12-9-2093","consultant":"Dr.A"},
                {"id":"D07450","date":"12-9-2092","consultant":"Dr.B"}
            ];

            let tr = null;
            data.map(i => {
                tr = [tr,`
                    <tr class="border">
                        <td>${i.id}</td>
                        <td>
                            <a href="javascript:void(0)">
                                <i class="fa-solid fa-print pe-1"></i>
                                ${i.date}
                            </a>
                        </td>
                        <td>${i.consultant}</td>
                    </tr>
                `].join('');
            });
            return tr;
        }

        let html = [`
            <div class="table-responsive border border-success rounded-3">
                <table class="table table-hover">
                    <thead>
                        <tr class="border">
                            <th class="fw-semibold">No</th>
                            <th class="fw-semibold">Date</th>
                            <th class="fw-semibold">Consultant</th>
                        </tr>
                    </thead>
                    <tbody>`,mThis.loadDataTable(),`</tbody>
                </table>
            </div>
        `].join('');
        return html;
    }
}

let PrescriptionDialog = new function(){
    let mThis = this;
    this.title_prop = "Prescription";
    this.self = $('#_qul_dlgPrescription');
    this.base_url = $("#__base_url").val();
    this.btnSave = $('#_qul_dlgPrescription_btnSave');
    this.ticket_id = null;
    
    this.cols = [
        {
            "name": "item_id",
            "title": "Product",
            "dataType": "string",
            "displayType": "select",
            "cssClass": "",
            "width":250
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
            "title": "Usage",
            "dataType": "string",
            "displayType": "input"
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

    this.btnSave.on('click',function(e){
        e.preventDefault();
        mThis.self.modal('hide');
    });

    this.loadPrescription = (ticket_id = 0, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/consultation/prescription`, {'ticket_id':ticket_id}).then(res => {
            if (res.status_code === 200) {
                onFinish(res.data);
            }
        });
    }

    this.setItemInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.pspDlg.getDataRow(tr);
            let p = { 'item_id': d.item_id };
            vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                if (res.status_code === 200) {
                    let item = res.data;
                    if(item) mThis.pspDlg.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                }
            });
        }
    }

    this.pspDlg = new ItemsView('_qul_dlgPrescription_body',{
        "columns": mThis.cols,
        validateColumns:{'item_id':'positive','qty':'number','duration_days':'number','sku':'string'},
        "langProp": "consult",
        "tableClass": "table presciption-table",
        "showColumnHeaders": true,
        "showAddLineButton": true,
        "addLineButtonText": "Add Item",
        onItemChange: (row_id,item, col_name, td,tr) => {
            mThis.setItemInfo(col_name, tr);
        },
        onItemValidated:(id,item,tr)=>{
            let thisItem = mThis.pspDlg.getDataRow(tr);
            let p= {'id':id,'item_id':thisItem.item_id,'description':thisItem.name,'qty':thisItem.qty,'sku':thisItem.sku,'usage':thisItem.usage,'duration_days':thisItem.duration_days,'reason':thisItem.reason,'remarks':thisItem.remarks,'ticket_id': mThis.ticket_id};
            vsapi.call(`${main_view.base_url}/api/consultation/save-prescription-item`,p,null,false).then(res => {
                if(res.status_code === 200){
                    let new_row_id = res.data.id; 
                    this.pspDlg.setRowId(tr,new_row_id);
                }
                else cv_interact.error(res.error_message);
            });
        },
        onItemDeleted:(row_id,tr)=>{
            let p= {'id':row_id,'ticket_id':mThis.ticket_id};
            vsapi.call(`${main_view.base_url}/api/consultation/remove-prescription-item`,p,null,false).then(res => {
                if(res.status_code !== 200) cv_interact.error(res.error_message); 
            });
        },
        numeroFormatter: (numero, row) => {
            return `<span class="text-secondary fw-bold">${numero}</span>`;
        },
        "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No item prescribed', 'consult')}</span>`,
    });

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.ticket_id = options.ticket_id;
        mThis.loadPrescription(options.ticket_id,(data) => {
            mThis.pspDlg.setSelectOptions('item_id',data.options_product);
            mThis.pspDlg.setData(data.items);
            mThis.self.modal({
                backdrop: "static"
            });
        });
    }
}

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

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'ticket', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

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
        LocaleManager.setLanguageChangeHandler((lang) => {
            mThis.displayTicketList();
        });

        mThis.loadOptions();

        mThis.btnSearchAppt.on('click', (e) => {
            e.preventDefault();
            mThis.displayTicketList();
        });

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

        mThis.tblTickets.on('click', 'a.btn_ticket_print', function (e) {
            e.preventDefault();
            alert('todo: print ticket');
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
            alert("No ADD NEW");
        });

        this.cfg = new ExpandableRowConfig('_qul_tblTickets', {
            'dontExpandByClickingOn': ['btn_ticket_modify', 'btn_ticket_delete', 'btn_ticket_print','btn_ticket_action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let ticket_id = q_tr.data('id');
                if (ticket_id > 0)
                TicketDetails.show($(detail_tr), {
                    'ticket_id': ticket_id,
                    'client_id': q_tr.data('clientid'),
                    'person_id': q_tr.data('personid'),
                    'status_id': q_tr.data('statusid')
                },QueueComponent.options.default_tab_view);
            }
        });

        mThis.tblTickets.on('click', 'a.btn_ticket_delete', function (e) {
            e.preventDefault();
            let lnk = $(this);
            let p = { 'id': lnk.data('id') };
            cv_interact.confirm('Remove this ticket?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Cancel', title: null, 'context': 'delete' }, (e) => {
                if(e){
                    vsapi.call(`${mThis.base_url}/api/ticket/delete`, p).then((res) => {
                        if(res.status_code === 200){
                            mThis.displayTicketList();
                        }
                        else cv_interact.error(res.error_message);
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
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="javascript:void(0)"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.getTicketStatusClass = (status_id) => {
        if (status_id == 0) return 'border-secondary';
        else if (status_id == 1) return 'border-warning';
        else if (status_id == 2) return 'border-success';
        else 'btn btn-outline-warning';
    }

    this.displayTicketList = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchAppt.val(), 'date': mThis.appt_filter_date.val(), 'status_id': mThis.appt_filter_status.val() };
        window.vsapi.call(`${mThis.base_url}/api/ticket/list`, p).then((result) => {
            let data = [];

            if (result.status_code === 200) data = StringSanitizer.sanitizeObject(result.data, null, ['cur_symbol', 'arrival_time']);
            if (mThis.table) {
                mThis.tblTickets.DataTable().clear().destroy();
                mThis.tblTickets.empty();
                mThis.table = null;
            }

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
                        return [`<a href="javascript:void(0)" style="display:block;text-align:center;width:85px;padding:5px;" data-statusid="${data.status_id}" class="btn_ticket_status border rounded-pill ${mThis.getTicketStatusClass(data.status_id)}">`, data.status, `</a>`].join('');
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        return [`<div class="form-inline">`,
                            `<a style="display:${data.status_id > 2 ? 'none' : 'block'}" href="javascript:void(0)" class="btn_ticket_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_ticket_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,`</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblTickets.DataTable({
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

    this.show = (options = null) => {
        if(!options) options = {};
        mThis.displayTicketList(() => {
            mThis.self.show().siblings().hide();
            mThis.options = options;
            main_view.setTitle(mThis.title_prop);
        });
    }
}

let ConsultTabView = new function () {
    let mThis = this;
    this.self = $('#_consultTabView');
    this.base_url = main_view.base_url;

    this.btnSaveConsult = $('#_qul_dlgConsult_btnSave');

    this.tblChiefComplaints = null;
    this.tblPrescribedItems = null;
    this.tblLaboTests = null;
    this.tblServiceItems = null;

    this.data = {};

    this.cur_view = 'consultation';

    this.self.on('click', 'div.tab-header > a.tab-button', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(mThis.options, view_name, true);
    });

    this.btnSaveConsult.on('click', (e) => {
        e.preventDefault();
        let p = mThis.getConsultData();
        console.log(p);
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
        let el = div.find('.data-input');
        return el.val();
    }

    this.getInput_labotests = (div = null) => {
        return mThis.tblLaboTests ? mThis.tblLaboTests.getItems() : [];
    }

    this.getInput_diagnosis = (div = null) => {
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
        if (!d.items[0]) return null;
        return d;
    }

    this.getInput_advice = (div) => {
        let el = div.find('.data-input');
        return el.val();
    }

    this.getConsultData = () => {
        let consult_panel = mThis.self.find('div#_consult_panel');
        let p = {};

        consult_panel.find('.consult-content-panel').each(function () {
            let div = $(this);
            let view_name = div.attr('viewname');

            switch (view_name) {
                case 'chief-complaints': {
                    p.chief_complaints = mThis.getInput_chiefcomplaints(div);
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

    this.getDataInput_VitalSignsAutoSave = () => {
        let div = $('#_consult_vt_wrapper');
        let ps = [];
        div.find('.consult-vt-input').each(function(){
            let el = $(this);
            let id = el.data('id');
            let ticket_id = el.data('tid');
            ps.push({'ticket_id':ticket_id,'id':id,'observed_value':el.val()});
        });
        return ps;
    }

    this.getDataInput_MedicalHistoryAutoSave = () => {
        let div = $('#_consult_medical_history_warpper');
        let pm = [];
        div.find('._consult_medical_history_input').each(function(){
            let el = $(this);
            let category = el.data('category');
            pm.push({'category': category, 'content': el.val()});
        });
        return pm;
    }

    this.getDataInput_PhysicalExaminationAutoSave = () => {
        let div = $('#_consult_pe_wrapper');
        let pe = [];
        div.find('textarea._consult_pe_input').each(function(){
            let el = $(this);
            pe.push({'category':'General','content': el.val()});
        });
        return pe;
    }

    this.getDataInput_DiagnosisAutoSave = () => {
        let div = $('#_consult_diagnosis_warpper');
        let pd = [];
        div.find('._consult_diagnosis_input').each(function(){
            let el = $(this);
            pd.push({'category':'General','content': el.val()});
        });
        return pd;
    }

    this.getDataInput_RecommedationsAutoSave = () => {
        let div = $('#_consult_advice_warpper');
        let pr = [];
        div.find('._consult_advice_input').each(function(){
            let el = $(this);
            pr.push({"category":"General","content":el.val()});
        });
        return pr;
    }

    this.show = function (options, view_name, tab_button_clicked = false) {
        if (!options) options = {};
        mThis.options = options;

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

                if (view_name === 'history') {
                    mThis.displayHistory(mThis.ticket_id, div_tab_panel);
                } else if (view_name === 'consultation') {
                    mThis.displayConsultation(mThis.ticket_id, div_tab_panel);
                }
                mThis.setFirstActiveMenu(view_name);
                return;
            }
        });

        if (!tab_button_clicked) {
            mThis.self.find('div.tab-header>a.tab-button').each(function () {
                let this_view_name = ($(this).data('viewname') + '').toLowerCase();
                if(view_name === this_view_name){
                    $(this).addClass('active').siblings().removeClass('active');
                }
            });
        }
    }

    this.displayHistory = (client_id = 0, div_tab_panel = null) => { }
    this.displayConsultation = (client_id = 0, div_tab_panel = null) => { }

    this.setFirstActiveMenu = (tabViewName = null) => {
        if (mThis.has_already_init[tabViewName]) return;
        if (tabViewName === 'consultation') {
            let def_consult_view = 'medical-history';
            mThis.details_routes_consult[def_consult_view]();
            let li = mThis.ul_menus_consult.find(`[data-viewname="${def_consult_view}"]`).closest('li');
            li.addClass('consult-menu-selected');
            mThis.prev_selected_li_consult = li;
        }
        else {
            let def_history_view = 'medical-reports';
            mThis.details_routes_history[def_history_view]();
            let li = mThis.ul_menus_history.find(`[data-viewname="${def_history_view}"]`).closest('li');
            li.addClass('history-menu-selected');
            mThis.prev_selected_li_history = li;
        }
        mThis.has_already_init[tabViewName] = true;
    }

    this.init = () => {
        mThis.ul_menus_consult = $('#_consult_menus');
        mThis.ul_menus_history = $('#_history_menus');

        mThis.consultItemPanel = $('#_consult_panel');
        mThis.historyItemPanel = $('#_history_panel');

        mThis.consultItemPanel.on('click', 'a.consultview-add-cc', (e) => {
            e.preventDefault();
            (mThis.tblChiefComplaints || {}).addRow();
        });
   
        mThis.details_routes_history = mThis.defineDetailRoutesHistory(mThis.historyItemPanel);
        mThis.details_routes_consult = mThis.defineDetailRoutesConsult(mThis.consultItemPanel);

        mThis.ul_menus_consult.on('click', 'li', (e) => {
            e.preventDefault();
            let li = $(e.currentTarget);
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

        mThis.has_already_init = {};
    }

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
            "service": () => {
                mThis.showConsultService(div, "service");
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
                mThis.showConsultMedicalReport(div);
            },
            "medical-certificate": () => {
                mThis.showConsultMedicalCertificate(div);
            },
        };
    }

    this.defineDetailRoutesHistory = (div) => {
        return {
            "medical-reports": () => {
                mThis.showHistoryMedicalReports(div);
            }
        };
    };

    this.showConsultChiefComplaints = (div, view_name) => {
        let wrapper_id = '_consult_cc_warpper';
        let div_id = '_consult_cc_list';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');

        if (el.length > 0){
            let p = {'ticket_id':ticket_id};
            vsapi.call(`${main_view.base_url}/api/ticket/chief-complaints`,p,null,false).then(res =>{
                if (res.status_code === 200){
                    let cc_items = StringSanitizer.sanitizeObject(res.data);
                    mThis.tblChiefComplaints.setData(cc_items);
                    el.show().siblings().hide();
                } 
            });
            return;
        }

        let title = LocaleManager.trans('Chief Complaints', 'consult');
        title=title ? title:'Chief Complaints';
        let html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none"><h3 class="trans-text" data-langprop="consult.Chief Complaints">${title} &nbsp;<a href="javascript:void(0)" class="consultview-add-cc"><i class="fa fa-plus-circle"></i></a></h3>
            <div class="border border-1 border-success rounded-3 p-4 pt-5 mt-5 overflow-y-auto" id="${div_id}" style="max-height:500px"></div>
        </div>`;

        div.append(html);

        let columns = [
            {
                "name": "chief_complaint_id",
                "title": "Chief Complaint",
                "dataType": "string",
                "displayType": "select",
            }
        ];
 
        mThis.loadChiefComplaintOptions(ticket_id, d => {
            let cc_options = StringSanitizer.sanitizeObject(d.chief_complaint_options);
            columns[0].selectOptions = cc_options;
            mThis.tblChiefComplaints = new ItemsView(div_id, {
                "columns": columns,
                "validateColumns":{'chief_complaint_id':'positive'},
                "langProp": "consult",
                "tableClass": "table",
                "showColumnHeaders": false,
                "showAddLineButton": false,
                "onItemValidated":(id,item,tr)=>{
                    let p= {'id':id,'cc_id':item.chief_complaint_id,'ticket_id':ticket_id};
                    vsapi.call(`${main_view.base_url}/api/consultation/save-chief-complaint`,p,null,false).then(res => {
                        if(res.status_code !== 200) cv_interact.error(res.error_message); 
                    });
                },
                "onItemDeleted": (id,tr) => {
                    let p= {'id':id};
                    vsapi.call(`${main_view.base_url}/api/consultation/remove-chief-complaint`,p,null,false).then(res => {
                        if(res.status_code === 200){
                            alert("Success");
                        }
                    });
                },
                "numeroFormatter": (numero, row) => {
                    return `<span class="text-secondary fw-bold">${numero}</span>`;
                },
                "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No chief complaints', 'consult')}</span>`,
            });

            mThis.tblChiefComplaints.setData(StringSanitizer.sanitizeObject(d.cc_items));
            el = div.find(`#${wrapper_id}`);
            el.show().siblings().hide();
        });
    }
    
    this.saveMedicalHistory = (item)=>{
        item.ticket_id = mThis.ticket_id;
        vsapi.call(`${main_view.base_url}/api/consult/save-medical-history`,item,null,false).then(res=>{
            if(res.status_code===200){}
        }); 
    }

    this.loadChiefComplaintOptions = (ticket_id = 0, onFinish = null) => {
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/consultation/chief-complaints`, p).then(res => {
            if (res.status_code === 200) {
                let data = res.data?res.data:{};
                let op_items = [];
                (data.chief_complaint_options || []).map(c => {
                    op_items.push({'value':c.id,'text':c.chief_complaint});
                });
                onFinish({'chief_complaint_options':op_items,'cc_items':data.cc_items});
            } else onFinish({});
        });
    }

    this.loadVitalSigns_patient = (ticket_id = 0, onFinish) => {
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/ticket/patient-vital-signs`, p).then(res => {
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
            let html_vs_items = null;
            items.map(t => {
                html_vs_items = [html_vs_items, `<tr data-id="${t.id}" data-tid="${ticket_id}"><td>`, t.description, `</td><td><input data-id="${t.id}" data-tid="${ticket_id}" class="consult-vt-input data-input form-control w-50" type="text" value ="`, t.vital_sign_value,`"></td></tr>`].join('');
            });

            if (!el || el.length === 0) {
                let title = LocaleManager.trans('Vital Signs', 'consult');
                title=title?title:'Vital Signs';
                let html = `
                        <div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                        <h3 class="trans-text" data-langprop="consult.Vital Signs">${title}</a></h3>
                        <div class="border border-1 border-success rounded-3 p-3 pt-5 shadow-sm mt-5">
                            <table class="table">
                                    <tbody>
                                        ${html_vs_items?html_vs_items:'No vital signs to display'}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                    `;
                div.append(html);
                el = div.find(`#${wrapper_id}`);
                el.show().siblings().hide();
         
                el.on('change','input.consult-vt-input',(e)=>{
                    let d = mThis.getDataInput_VitalSignsAutoSave();
                    vsapi.call(`${main_view.base_url}/api/consultation/save-vital-signs`,d,null,false).then(res => {
                        if(res.status_code === 200){}
                    });
                });
            }
            el.show().siblings().hide();
        });
    }

    this.loadConsult_PE = (ticket_id, onFinish) => {
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/consultation/pe`, p,null,false).then(res => {
            if (res.status_code === 200) {
                let items = res.data?res.data:[];
                onFinish(items[0]);
            }
            else onFinish(null);
        });
    }

    this.showConsultPE = (div, view_name) => {
        let ticket_id = div.data('tid');
        let wrapper_id = '_consult_pe_wrapper';
        let el = div.find(`#${wrapper_id}`);

        mThis.loadConsult_PE(ticket_id, pe => {
            let html = "";
            if (!pe) pe = {};
           
            if(el.length > 0){
                el.find('textarea._consult_pe_input').val(pe.content);
                el.show().siblings().hide();
                return;
            }      
            let title = LocaleManager.trans('Physical Examination', 'consult');      
            html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                    <h3 class="trans-text" data-langprop="consult.Pysical Examination">${title}</a></h3>
                    <div class="mt-5">
                        <textarea data-category="${pe ? pe.category:''}" class="_consult_pe_input form-control data-input" cols="10" rows="5">${pe ? pe.content:''}</textarea>
                    </div>
                </div>`;
            div.append(html);
            el = div.find(`#${wrapper_id}`);
            el.show().siblings().hide();

            el.on('change','textarea._consult_pe_input',function(){
                let p = {'ticket_id':ticket_id,'items':mThis.getDataInput_PhysicalExaminationAutoSave()};
                vsapi.call(`${main_view.base_url}/api/consultation/save-pe`,p,null,false).then(res =>{
                        if(res.status_code !==200) cv_interact.error(res.error_message);
                }); 
            });
        });
    }

    this.loadPrescription = (ticket_id = 0, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/consultation/prescription`, {'ticket_id':ticket_id}).then(res => {
            if (res.status_code === 200) {
                onFinish(res.data);
            }
        });
    }

    this.loadService = (ticket_id = 0, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/settings/options-product`, null).then(res => {
            if(res.status_code === 200){
                onFinish(res.data);
            }
        });
    }

    this.showConsultPrescription = (div, view_name) => {
        let wrapper_id = '_consult_pres_warpper';
        let div_id = '_consult_prescription';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');
        
        if (el.length > 0){
            el.show().siblings().hide();
        }
        else{
            let title = LocaleManager.trans('Prescription', 'consult');
            let html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}"><h3 class="trans-text" data-langprop="consult.Prescription">${title}</h3>
            <div class="border border-1 border-success rounded-3 shadow-sm p-3 w-100 mt-5 overflow-y-auto" id="${div_id}" style="max-height:500px"></div>
            </div>`;
            div.html(html);
            let columns = [
                {
                    "name": "item_id",
                    "title": "Product",
                    "dataType": "string",
                    "displayType": "select",
                    "cssClass": "",
                    "width":250
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
                    "title": "Usage",
                    "dataType": "string",
                    "displayType": "input"
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
    
            mThis.tblPrescribedItems = new ItemsView(div_id, {
                "columns": columns,
                validateColumns:{'item_id':'positive','qty':'number','duration_days':'number','sku':'string'},
                "langProp": "consult",
                "tableClass": "table presciption-table",
                "showColumnHeaders": true,
                "showAddLineButton": true,
                "addLineButtonText": "Add Item",
                onItemChange: (row_id,item, col_name, td,tr) => {
                    mThis.setItemInfo(col_name, tr);
                },
                onItemValidated:(id,item,tr)=>{
                    let thisItem = mThis.tblPrescribedItems.getDataRow(tr);
                    let p= {'id':id,'item_id':thisItem.item_id,'description':thisItem.name,'qty':thisItem.qty,'sku':thisItem.sku,'usage':thisItem.usage,'duration_days':thisItem.duration_days,'reason':thisItem.reason,'remarks':thisItem.remarks,'ticket_id':ticket_id};
                    vsapi.call(`${main_view.base_url}/api/consultation/save-prescription-item`,p,null,false).then(res => {
                        if(res.status_code === 200){
                            let new_row_id = res.data.id; 
                            mThis.tblPrescribedItems.setRowId(tr,new_row_id); 
                        }
                        else cv_interact.error(res.error_message);
                    });
                },
                onItemDeleted:(row_id,tr)=>{
                    let p= {'id':row_id,'ticket_id':ticket_id};
                    vsapi.call(`${main_view.base_url}/api/consultation/remove-prescription-item`,p,null,false).then(res => {
                        if(res.status_code !== 200) cv_interact.error(res.error_message); 
                    });
                },
                numeroFormatter: (numero, row) => {
                    return `<span class="text-secondary fw-bold">${numero}</span>`;
                },
                "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No item prescribed', 'consult')}</span>`,
            });
            el = div.find(`#${wrapper_id}`);
            el.show().siblings().hide();
        }
 
        mThis.loadPrescription(ticket_id,(data)=>{
            mThis.tblPrescribedItems.setSelectOptions('item_id',data.options_product);
            mThis.tblPrescribedItems.setData(data.items);
        });
    }

    this.loadService = (ticket_id,onFinish)=>{
        let p = {'ticket_id':ticket_id};
      vsapi.call(`${main_view.base_url}/api/consultation/services`,p,null,false).then(res=>{
          onFinish(res.data?res.data:{});
      });
    }

    this.showConsultService = (div, view_name) => {
        let wrapper_id = '_consult_service_warpper';
        let div_id = '_consult_service';
        let el = div.find(`#${wrapper_id}`);
        let ticket_id = div.data('tid');
   
        let title = LocaleManager.trans('Service', 'consult');
        if(el.length > 0){
            el.show().siblings().hide();
        }
        else{
            let html = `<div id="${wrapper_id}" class="consult-content-panel" viewname="${view_name}"><h3 class="trans-text" data-langprop="consult.Service">${title}</h3>
            <div class="border border-1 border-success p-3 rounded-3 mt-5 overflow-y-auto" id="${div_id}" style="max-height:500px"></div>
            </div>`;

            div.html(html);
            let columns = [
                {
                    "name": "service_id",
                    "title": "Name",
                    "dataType": "string",
                    "displayType": "select",
                    "width":"250px"
                },
                {
                    "name": "qty",
                    "title": "Quantity",
                    "dataType": "number",
                    "displayType": "input",
                    "defaultValue":1,
                    "readOnly":true
                },
                {
                    "name": "emp_id",
                    "title": "Performed By",
                    "dataType": "number",
                    "displayType": "select"
                }
                ,{
                    "name": "remarks",
                    "title": "Remarks",
                    "dataType": "string",
                    "displayType": "input"
                }
            ];

            mThis.tblServiceItems = new ItemsView(div_id, {
                "columns": columns,
                validateColumns:{'service_id':'positive'},
                "langProp": "consult",
                "tableClass": "table presciption-table",
                "showColumnHeaders": true,
                "showAddLineButton": true,
                "addLineButtonText": "Add Item",
                "onItemChange": (row_id,selOp, col_name, td,tr) => {
                    mThis.setServiceInfo(col_name, tr);
                },
                onItemValidated:(id,item,tr)=>{
                    let thisItem = mThis.tblServiceItems.getDataRow(tr);
                    let p= {'ticket_id':ticket_id,'id':id,'service_id':thisItem.service_id,'description':thisItem.name,'qty':thisItem.qty?thisItem.qty:1,'sku':thisItem.sku?thisItem.sku:'none','remarks':thisItem.remarks,'emp_id':thisItem.emp_id};
                    if(p.service_id){
                        vsapi.call(`${main_view.base_url}/api/consultation/save-service-item`,p,null,false).then(res => {
                            if(res.status_code === 200){
                            mThis.tblServiceItems.setRowId(tr,res.data.id);
                            }else cv_interact.error(res.error_message);  
                        });
                    }
                },
                onItemDeleted:(row_id,tr)=>{
                    let p= {'id':row_id,'ticket_id':ticket_id};
                    vsapi.call(`${main_view.base_url}/api/consultation/remove-service-item`,p,null,false).then(res => {
                        if(res.status_code !== 200) cv_interact.error(res.error_message); 
                    });
                },
                numeroFormatter: (numero, row) => {
                    return `<span class="text-secondary fw-bold">${numero}</span>`;
                },
                "emptyMessage": `<span class="text-secondary text-align-center">${LocaleManager.trans('No item prescribed', 'consult')}</span>`,
                "validateColumns":{"item_id":"string"}
            });               
            el = div.find(`#${wrapper_id}`);
            el.show().siblings().hide();
        }
        
        mThis.loadService(ticket_id,data => {
            mThis.tblServiceItems.setSelectOptions('service_id',data.options_service);
            mThis.tblServiceItems.setSelectOptions('emp_id',data.options_emp);
            mThis.tblServiceItems.setData(data.items);
        });
    }

    this.setItemInfo = (col_name, tr) => {
        if (col_name === 'item_id') {
            let d = mThis.tblPrescribedItems.getDataRow(tr);
            let p = { 'item_id': d.item_id };
            vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                if (res.status_code === 200) {
                    let item = res.data;
                    if(item) mThis.tblPrescribedItems.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                }
            });
        }
    }
 
    this.setServiceInfo = (col_name,tr)=>{
        mThis.tblServiceItems.setCellValue(tr, 'qty',1);
        return;
    }

    this.loadMedicalHistory =(ticket_id,onFinish)=>{
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/consultation/medical-history`,p,null,false).then(res=>{
           if(res.status_code===200){
              onFinish(res.data);
           }else onFinish({});
        });
    }

    this.showConsultMedicalHistory = (div, view_name) => {
        let wrapper_id = '_consult_medical_history_warpper';
        let ticket_id = div.data('tid');
        let el = div.find(`#${wrapper_id}`);
       
        mThis.loadMedicalHistory(ticket_id,d =>{
            let categories =['Personal History','Family History','Traveling','Vacination','Allergy','Surgery'];
            if (el.length > 0){
                el.show().siblings().hide();
                el.find('.data-input').each(function(){
                    let e = $(this);
                    let cat = e.data('category');
                    e.val(d[cat]);
                });
                LocaleManager.translateZone(wrapper_id);
                return;
            }
            let html =`<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
            <h3 class="trans-text" data-langprop="consult.Medical History">Medical History</h3>
            <div class="d-flex flex-column">`;

            categories.map(c=>{
                let content = d[c]?d[c]:'';  
                html= [html,`<div class="mt-4">
                <label class="control-label fw-semibold">${c}</label>
                <textarea data-category="${c}" class="_consult_medical_history_input data-input form-control" cols="10" rows="3">${content}</textarea>
                </div>`].join('');
            });
            html = [html,`</div></div>`].join('');
 
            div.append(html);
            el = $(`#${wrapper_id}`);
            el.show().siblings().hide();
            LocaleManager.translateZone(wrapper_id);

            el.on('change','textarea._consult_medical_history_input',function(){
                let p = {'ticket_id':ticket_id,'items':mThis.getDataInput_MedicalHistoryAutoSave()};
                vsapi.call(`${main_view.base_url}/api/consultation/save-medical-history`,p,null,false).then(res => {
                    if(res.status_code === 200){
                        console.log(p);
                    }
                });
            });
        });
    }

    this.getTicketInfo_laboTest =(ticket_id,onFinish)=>{
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/ticket/labo-tests`,p,null,false).then(res=>{
            if(res.status_code===200) 
            onFinish(res.data);
            else onFinish([]);
        });
    }

    this.showConsultLaboratoryTests = (div, view_name) => {
        let wrapper_id = '_consult_labo_warpper';
        let div_labotest_panel_id = '_consult_div_labotest_panel';

        let ticket_id = div.data('tid');
        let el = div.find(`#${wrapper_id}`);

        if (el.length > 0) {
            LocaleManager.translateZone(wrapper_id);
            el.show().siblings().hide();
            mThis.getTicketInfo_laboTest(ticket_id,d=>{
                mThis.tblLaboTests.setData(d);
            });
            return;
        }

        let html =`<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                <h3 class="trans-text" data-langprop="consult.Laboratory Tests">Laboratory Tests</h3>
                <div class="d-flex mt-5">
                    <div class="border border-1 border-success rounded-3 p-3 shadow-sm w-100" id="${div_labotest_panel_id}" class="table-responsive overflow-y-auto" style="max-height:500px">  
                    </div>
                </div>
           </div>`;
        div.append(html);
        el = $(`#${wrapper_id}`);

        let cols = [
            {
                name: 'test_id',
                title: 'Test Name',
                displayType:'select'
            },
            {
                name: 'remarks',
                title: 'Remarks',
                displayType:'input'
            },
            {
                name: 'labo_id',
                title: 'Labo Name',
                displayType:'select',
                selectOPtions: [],
                readOnly:true
            }
        ];

        mThis.tblLaboTests = new ItemsView(div_labotest_panel_id,{
            columns: cols,
            validateColumns:{'test_id':'string','labo_id':'string'},
            tableClass: "table",
            addLineButtonText: "Add Labo Test",
            langProp: 'labotest',
            onItemChange:(row_id,item,col_name,td,tr)=>{
                    if (col_name ==='test_id') mThis.displayTestInfo(item.test_id,tr);
            },
            onItemValidated:(row_id,item,tr)=>{
                let thisItem = mThis.tblLaboTests.getDataRow(tr);
                let p= {'id':row_id,'test_id':thisItem.test_id,'labo_id':thisItem.labo_id,'remarks':thisItem.remarks,'ticket_id':ticket_id};
                vsapi.call(`${main_view.base_url}/api/consultation/save-labo-test`,p,null,false).then(res => {
                    if(res.status_code === 200){
                        mThis.tblLaboTests.setRowId(tr,res.data.id);
                    }else cv_interact.error(res.error_message); 
                });
            },
            onItemDeleted:(row_id,tr)=>{
                let p= {'id':row_id,'ticket_id':ticket_id};
                vsapi.call(`${main_view.base_url}/api/consultation/remove-labo-test`,p,null,false).then(res => {
                    if(res.status_code !== 200) cv_interact.error(res.error_message); 
                });
            },
        });
        
        let p = {'ticket_id':ticket_id};
        vsapi.call(`${main_view.base_url}/api/consultation/labo-test-data`,p,null,false).then(res=>{
            if(res.status_code===200){
                let d = res.data;
                mThis.tblLaboTests.setSelectOptions('test_id',d.labo_test_options);
                mThis.tblLaboTests.setSelectOptions('labo_id',d.labo_options);
                mThis.tblLaboTests.setData(d.labo_tests);
                el.show().siblings().hide();
                LocaleManager.translateZone(wrapper_id);
            }else cv_interact.error(res.error_message);
        });
    }

    this.displayTestInfo =(test_id,tr)=>{
        vsapi.call(`${main_view.base_url}/api/labo-test/info`,{'test_id':test_id},null,false).then(res=>{
            if(res.status_code===200){ 
                let test = res.data?res.data:{};
                mThis.tblLaboTests.setCellValue(tr,'labo_id',test.labo_id);
            }
        });
    }

    this.loadDiagnosis = (ticket_id,onFinish)=>{
       let p = {'ticket_id':ticket_id};
       vsapi.call(`${main_view.base_url}/api/consultation/diagnosis`,p,null,false).then(res=>{
          let items = res.data?res.data:[];
          onFinish(items[0]);
       });
    }

    this.showConsultDiagnosis = (div, view_name) => {
        let wrapper_id = '_consult_diagnosis_warpper';
        let ticket_id = div.data('tid');
        let el = div.find(`#${wrapper_id}`);
        
        if(el.length > 0){
            LocaleManager.translateZone(wrapper_id);
            el.show().siblings().hide();
        }
        else{
            let html = `<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                <h3 class="trans-text" data-langprop="consult.Diagnosis">Diagnosis</h3>
                <div class="d-flex flex-column mt-3">
                <label class="control-label fw-semibold">Diagnosis details</label>
                <textarea class="_consult_diagnosis_input form-control data-input" cols="10" rows="3" id="_consul_diagnosis"></textarea>
                </div>
            </div>`;
            div.append(html);
            el = div.find(`#${wrapper_id}`);
           
            el.on('change','textarea._consult_diagnosis_input',function(){
                let p = {'ticket_id':ticket_id,'items':mThis.getDataInput_DiagnosisAutoSave()};
                vsapi.call(`${main_view.base_url}/api/consultation/save-diagnosis`,p,null,false).then(res=>{
                    if(res.status_code !==200) cv_interact.error(res.error_message);
                });
            });
            LocaleManager.translateZone(wrapper_id);
            el.show().siblings().hide(); 
        }
        
        mThis.loadDiagnosis(ticket_id,d=>{
            if (el.length>0){
                el.find('textarea._consult_diagnosis_input').val(d?d.content:'');
            }            
        });
    }

    this.showConsultRecommendations = (div, view_name) => {
        let wrapper_id = '_consult_advice_warpper';
        let ticket_id = div.data('tid');
        let el = div.find(`#${wrapper_id}`);
        if(el.length>0){
            el.show().siblings().hide();
        }else{
                let html =`<div id ="${wrapper_id}" class="consult-content-panel" viewname="${view_name}" style="display:none">
                <h3 class="trans-text" data-langprop="consult.Recommendations">Recommendations</h3>
                <div class="d-flex flex-column mt-3">
                <label class="control-label fw-semibold">Doctor's recommendation</label>
                <textarea class="_consult_advice_input form-control data-input" cols="10" rows="3" id="_consult_advice"></textarea>
                </div>
            </div>  
            `;
            div.append(html);
            el = div.find(`#${wrapper_id}`);
            el.show().siblings().hide();
            
            el.on('change','textarea._consult_advice_input',function(){
                let p ={'ticket_id':ticket_id,'items':mThis.getDataInput_RecommedationsAutoSave()};
                vsapi.call(`${main_view.base_url}/api/consultation/save-advice`,p,null,false).then(res=>{
                    if(res.error_message) cv_interact.error(res.error_message);  
                });
            });
        }
        LocaleManager.translateZone(wrapper_id);
        mThis.loadAdvice(ticket_id,d=>{
            el.find(`#_consult_advice`).val(d?d.content:'');
        });
    }

    this.loadAdvice = (ticket_id,onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/consultation/advice`,{'ticket_id':ticket_id},null,false).then(res=>{
            let items = res.data?res.data:[];
            onFinish(items[0]);
        });
    }

    this.showConsultMedicalReport = (div) => {
        let ticket_id = div.data('tid');
        let qString = ['rtype=medical_report&ticketid=', ticket_id,'&id=',ticket_id].join('');
        main_view.getEncryptData(qString, (d) => {
            window.open([main_view.base_url, '/genreport/', d].join(''), '_blank');
        });
    }

    this.showConsultMedicalCertificate = (div) => {
        let ticket_id = div.data('tid');
        let qString = [`rtype=medical_certificate&ticketid=`, ticket_id,'&id=',ticket_id].join('');
        main_view.getEncryptData(qString, (d) => {
            window.open([main_view.base_url, '/genreport/', d].join(''), '_blank');
        });
    }

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
                          <span>${d.patient_code}</span>
                       </div>

                       <div class="d-flex flex-row">
                         <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Patient Name"></span>
                         <span>${d.patient_name}</span>
                      </div>

                      <div class="d-flex flex-row">
                        <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Sex"></span>
                        <span>${d.patient_sex}</span>
                      </div>

                      <div class="d-flex flex-row">
                        <span class="w-25 lh-lg fw-bold trans-text" data-langprop="patient.Phone Number"></span>
                        <span>${d.patient_phone_number}</span>
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
}

let ConsultDialog = new function () {
    let mThis = this;
    this.self = $('#_qul_dlgConsult');
    this.btnSaveConsult = $('#_qul_dlgConsult_btnSave');
    this.defaultTabView = 'consultation';

    this.btnSaveConsult.on('click', (e) => {
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

    this.show = (option) => {
        if (!option) option = {};
        mThis.onClose = option.onClose;

        ConsultTabView.show({ "ticket_id": option.ticket_id, "patient_id": option.patient_id }, this.defaultTabView);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded', e => {
    TicketDetails.init('_qul_tblTickets');
    QueueComponent.init();
});
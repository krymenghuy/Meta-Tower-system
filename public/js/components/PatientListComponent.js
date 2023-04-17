"use strict";
let PatientListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Patients';
    this.self = $('#_main_patientListComponent');
    this.base_url = $('#__base_url').val();
    this.tblPatients = $('#_pal_tblPatients');
    this.elSearch = $('#_pal_search');
    this.options = {};
    this.div_patient_list = document.querySelector('#_ptl_list');

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
        // LocaleManager.setLanguageChangeHandler((lang) => {
        //     mThis.displayPatients();
        // });

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

        // this.cfg = new ExpandableRowConfig('_pal_tblPatients', {
        //     'dontExpandByClickingOn': ['btn_pat_print', 'btn_pat_modify', 'btn_pat_action', 'btn_pat_delete'],
        //     'onOpen': (container, detail_tr, parent_tr) => {
        //         let q_tr = $(parent_tr);
        //         let ticket_id = q_tr.data('id');

        //         if (ticket_id > 0){
        //             PatientDetails.show($(detail_tr), {
        //                 'ticket_id': ticket_id,
        //                 'client_id': q_tr.data('clientid'),
        //                 'patient_id': q_tr.data('clientid'),
        //                 'person_id': q_tr.data('personid'),
        //                 'status_id': q_tr.data('statusid')
        //             },QueueComponent.options.default_tab_view);
        //         }
        //     }
        // });

        mThis.div_patient_list.addEventListener('click',e=>{
          let el = e.target;
          if(el.parentNode.classList.contains('ptl-btn-choose-photo') || el.classList.contains('ptl-btn-choose-photo')){
              let id = el.dataset.id?el.dataset.id : el.parentNode.dataset.id;
              let img = mThis.div_patient_list.querySelector(`img#profile_photo_${id}`);
              FileChooser.chooseFile(null,d=>{
                 if(d){
                    if(img) img.setAttribute('src',d.dataUrl); 
                 }
              });
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
        return (mThis.col_titles[title_prop]?mThis.col_titles[title_prop]:title_prop );
    }

    this.createDropdownMenuHtml_patient = (items = [], data = null, data_props = []) => {
        if (!data_props) data_props = [];
        let str_props = "";
        data_props.map((prop_name) => {
            prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
            if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
        });

        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Add To Queue</span</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> Consultation History</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Medication History</a>',
            '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="javascript:void(0)"><i class="fa fa-list" style="color:green"></i> Print Profile</a>',
            '</div>'].join('');
        return html;
    }

    this.addPatientRow = (d={},prepend=1)=>{
        let ps = d.summary?d.summary:{};
        let cur_symbol = d.currency_code ==='USD'?'$':'៛';
        d.patient_type = d.patient_type?d.patient_type:'OPD'; // OPD, IPD
        d.email =d.email?d.email:'NA';
        d.profile_url = d.profile_url?d.profile_url:[main_view.asset_url,'/images/icons/care.jpg'].join('');

        d.date_of_birth =d.date_of_birth?d.date_of_birth:'(No available)';
        d.has_membership_card = d.has_membership_card?d.has_membership_card:'No';
        d.address = d.address?d.address:'(Not available)';
        d.phone_number =d.phone_number?d.phone_number:'(Not available)';
        ps.consultation_count =ps.consultation_count?ps.consultation_count:0;
        ps.total_open_amount = ps.total_open_amount?ps.total_open_amount:0;
        ps.invoice_count = ps.invoice_count?ps.invoice_count:0;   
      
        let html_patient_row =`
        <div class="card" style="margin-top:5px">
        <div class="card-body d-flex">
         <div class="d-flex align-items-center flex-column justify-content-center">
                 <div class="rounded-circle overflow-hidden mx-3" style="width: 120px; height: 120px;">
                     <img id="profile_photo_${d.id}" src="${d.profile_url}" alt="Image" class="profile-photo w-100 h-100">
                 </div>
                 <div class="d-flex flex-column justify-content-center m-1">
                     <a data-id="${d.id}" data-code="${d.code}" href="javascript:void(0)" class="border border-3 border-secondary border-rounded-4 p-2 align-self-start ptl-btn-choose-photo"><i class="fa fa-pencil text-secondary"></i></a>
                 </div>
             </div>
        
          <div class="flex-grow-1">
            <div class="row mb-3">
              <div class="col-sm-6">
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Patient Type:</span> ${d.patient_type}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Patient ID:</span> ${d.code}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Patient Name:</span> ${d.name}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Sex:</span> ${d.sex}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Date of Birth:</span> ${d.date_of_birth}</p>
              </div>
              <div class="col-sm-6">
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Phone Number:</span> ${d.phone_number}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Email:</span> ${d.email}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Address:</span> ${d.address}</p>
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Membership Card:</span> ${d.has_membership_card}</p>
              </div>
            </div>
            <hr class="my-3 border border-3 border-primary">
            <div class="row">
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 180px; display: inline-block;">Previous Consultations:</span> ${ps.consultation_count}</p>
              </div>
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Total Invoices:</span> ${ps.invoice_count}</p>
              </div>
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 180px; display: inline-block;">Total Invoice Amount:</span> ${cur_symbol}${ps.total_open_amount}</p>
              </div>
            </div>
          </div>
          <div class="my-auto mx-3">
             <button data-id="${d.id}" class="btn btn-secondary rounded-4"><i class="fa fa-pencil" style="font-size:0.8em"></i></button>
             <button data-id="${d.id}" class="btn btn-primary rounded-4"><i class="fa fa-print" style="font-size:0.8em"></i></button>
             <button data-id="${d.id}" class="btn btn-danger rounded-4"><i class="fa fa-trash" style="font-size:0.8em"></i></button>
          </div>       
      </div>
     </div>
     `;
       if (prepend===1) mThis.div_patient_list.insertAdjacentHTML('afterbegin', html_patient_row);
       else mThis.div_patient_list.insertAdjacentHTML('beforeend', html_patient_row);
    }

    this.displayPatients = (onFinish = null) => {
 
        let p = { 'search_value': mThis.elSearch.val() };
        window.vsapi.call(`${mThis.base_url}/api/patient/list`, p, 'POST', null).then((res) => {
           if(res.status_code===200){
              let rows = res.data;
              let i=0,d=null;
              do{
                d = rows[i];
                if(!d) break;
                 mThis.addPatientRow(d,0);
                i++;
              }while(d); 
           }
           
           if(typeof onFinish ==='function') onFinish();
        });
   
    };

    this.show = (option = null) => {
        if(!option) option = {}; 
        mThis.displayPatients(() => {
            mThis.options = option;
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
            //mThis.self.parent().css('overflow-y','hidden');
        });
    }
}

window.addEventListener('DOMContentLoaded',e=> {
    PatientListComponent.init();
});
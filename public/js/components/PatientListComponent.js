"use strict";
let PatientListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Patients';
    this.self = $('#_main_patientListComponent');
    this.base_url = $('#__base_url').val();
    this.tblPatients = $('#_pal_tblPatients');
    this.elSearch = $('#_pal_search');
    this.options = {};
    this.patientListView = null;
    this.div_patient_list = document.querySelector('#_ptl_list');
    this.client_list_paginator = document.getElementById("client_list_pagination");

    this.icon_url = () => {
        return `${[VSUtil.asset_url()].join('')}/images/icons`;
    }

    this.btnNewPatient = $('#_pal_btnNewPatient');
    // this.col_titles = {
    //     "ID": "Patient ID",
    //     "Name": "Name",
    //     "Gender": "Gender",
    //     "Age": "Age",
    //     "Phone Number": "Phone Number",
    //     "Email": "Email",
    //     "Address": "Address",
    //     "Type": "Type",
    //     "Remarks": "Remarks",
    //     "Register Date": "Register Date",
    //     "Action": "Action"
    // };

    // this.setLanguage = () => {
    //     if (LocaleManager.lang !== mThis.lang) {
    //         for (let prop in mThis.col_titles) {
    //             mThis.col_titles[prop] = LocaleManager.trans(prop, 'patient', LocaleManager.lang);
    //         }
    //         mThis.lang = LocaleManager.lang;
    //     }
    // }

    this.init = () => {
        // LocaleManager.setLanguageChangeHandler((lang) => {
        //     mThis.displayPatients();
        // });
        mThis.patientListView = new ListView('_ptl_list_container',{
          'fetchApi':`${main_view.base_url}/api/patient/list-paginate`,
          // 'columns':[
          //   {
          //     title:'Patient ID',
          //     data:'code'
          //   },
          //   {
          //     title:'Patient Name',
          //     data:(data,index,tr)=>{
          //        return `<span class="fw-bold text-success p-2">${data.name}</span>`;
          //     }
          //   },
          //   {
          //     title:'date_of_birth',
          //     data:'date_of_birth' 
          //   }
          // ],
          'perPage':5,
          'renderItems':(items,list_container)=>{
                list_container.innerHTML =null;
                let i=0,d=null;
                do{
                  d = items[i];
                  if(!d) break;
                  mThis.addPatientRow(list_container,d,0);
                  i++;
                }while(d); 
                
                if(i===0){
                  list_container.innerHTML=`<div style="border:1px dotted grey;border-radius:5px;padding:10px;"><span class="d block text-center fw-bold p-2">There are no registered patients</span></div>`;
                }
                // else{
                //    mThis.createPaginationButtons(res.data); 
                // }
          }
          ,'listContainerClass':'flex-box' 
        });

        /** For assigning patient's row event handler. For example:
          
           mThis.div_patient_list.addEventListener('click',(e)=>{
 
           });

          WHERE "mThis.div_patient_list" represents the item List container. (It is usually "DIV" element)
        **/
        mThis.div_patient_list = mThis.patientListView.getListContainer();

        mThis.elSearch.on('keyup', (e) => {
            e.preventDefault();
            mThis.patientListView.showPage({'search_value':mThis.elSearch.val()});
        });
          
        mThis.btnNewPatient.on('click', function (e) {
            e.preventDefault();
            let op = { 'identity_value': 0,
              'onClose':(d)=>{
                cv_interact.info('New patient has been created', null, true);
                mThis.elSearch.val(null);
                mThis.patientListView.showPage(null);
              }
            };
            PatientDialog.show(op);
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

        this.clickOnClass = (target,cssClass)=>{
            return (target.parentNode.classList.contains(cssClass) || target.classList.contains(cssClass));
        }
 
        mThis.div_patient_list.addEventListener('click',e=>{
          let el = e.target;
         
          if(mThis.clickOnClass(el,'ptl-btn-choose-photo')){
              let id = el.dataset.id?el.dataset.id : el.parentNode.dataset.id;
              let img = mThis.div_patient_list.querySelector(`img#profile_photo_${id}`);
              FileChooser.chooseFile(null,d=>{
                 if(d){
                    if(img) img.setAttribute('src',d.dataUrl);
                    let p = {'id':id,'photo':d.dataUrl};
                    vsapi.call(`${main_view.base_url}/api/patient/save-profile-picture`,p,null,false).then(res=>{
                      if(res.status_code===200){
                        cv_interact.success('Profile photo saved!');
                      }else cv_interact.warning(res.error_message);
                    }); 
                 }
              });
          }
          else if (mThis.clickOnClass(el,'btn_pat_modify')){
            let lnk = el.closest('.btn_pat_modify');
              //op.id is person_id // If op.id > 0 => we meant to update person's info via the given person_id
              let patient_id = lnk.dataset.id;
              let op = {'patient_id':patient_id,'onClose':(e)=>{
                 //refresh Patient Info
                 mThis.patientListView.showPage({'search_value':mThis.elSearch.val()});
              }};

              PersonDialog.show(op);
          }

          else if(mThis.clickOnClass(el,'btn_pat_delete')){
            let lnk = el.closest('.btn_pat_delete');
            let p = { 'id': lnk.dataset.id};
            cv_interact.confirm('Remove this patient?', { 'confirmButtonText': 'Delete', 'cancelButtonText': 'Cancel', title: null, 'context': 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${mThis.base_url}/api/patient/delete`, p).then((res) => {
                        if (res.status_code === 200) {
                            mThis.patientListView.showPage({'search_value':mThis.elSearch.val()});
                        } else cv_interact.error(res.error_message);
                    });
                }
            }); 
          }
          else if(mThis.clickOnClass(el,'btn_pat_print')){
            let lnk = el.closest('.btn_pat_print');
            let p = { 'id': lnk.dataset.id};
            alert(JSON.stringify(p));  
          }

        });

    }
 
    // this.createDropdownMenuHtml_patient = (items = [], data = null, data_props = []) => {
    //     if (!data_props) data_props = [];
    //     let str_props = "";
    //     data_props.map((prop_name) => {
    //         prop_name = (prop_name ? prop_name : '').replace(/_/g, '');
    //         if (prop_name) str_props = [str_props, str_props ? " " : "", prop_name, `="${data[prop_name]}"`].join('');
    //     });

    //     let html = ['<div class="dropdown-menu action-menus">',
    //         '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Add To Queue</span</a>',
    //         '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_disburse" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> Consultation History</a>',
    //         '<div class="dropdown-divider"></div>',
    //         '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Medication History</a>',
    //         '<a data-id="', loan_app_id, '" data-personid="', person_id, '" class="dropdown-item _apl_loanapp_person_profile" href="javascript:void(0)"><i class="fa fa-list" style="color:green"></i> Print Profile</a>',
    //         '</div>'].join('');
    //     return html;
    // }

    this.refreshClientSummary = (list_container,patient_id,d={})=>{
       let div = list_container.querySelector(`#dpl_client_summary_${patient_id}`);
       if(!div) return;
       div.querySelectorAll('.data-input').forEach(el=>{
          let f = el.dataset.field;
          el.textContent = d[f];
       });
    }

    this.addPatientRow = (list_container,d={},prepend=1)=>{
        let ps = d.summary?d.summary:{};
        let cur_symbol = d.currency_code ==='USD'?'$':'៛';
        d.patient_type = d.patient_type?d.patient_type:'OPD'; // OPD, IPD
        d.email =d.email?d.email:'NA';
        d.image_url = d.image_url?d.image_url:[main_view.asset_url,'/images/icons/care.jpg'].join('');

        d.date_of_birth =d.date_of_birth? d.date_of_birth:'(No available)';
        d.has_membership_card = d.has_membership_card?d.has_membership_card:'No';
        d.address = d.address?d.address:'(Not available)';
        d.phone_number =d.phone_number?d.phone_number:'(Not available)';
        ps.consultation_count ='...'; //ps.consultation_count?ps.consultation_count:0;
        ps.total_open_amount = '...'; // ps.total_open_amount?ps.total_open_amount:0;
        ps.invoice_count = '...'; //ps.invoice_count?ps.invoice_count:0;   

        let html_patient_row =[`
        <div class="card" style="margin-top:5px;max-height:292px">
        <div class="card-body d-flex">
         <div class="d-flex align-items-center flex-column justify-content-center">
                 <div class="rounded-circle overflow-hidden mx-3" style="width: 120px; height: 120px;">
                     <img id="profile_photo_${d.id}" src="${d.image_url}" alt="Image" class="profile-photo w-100 h-100">
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
            <div id="dpl_client_summary_${d.id}" class="row pdl-bottom-summary" data-id="${d.id}">
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 180px; display: inline-block;">Consultations:</span><span class="data-input" data-field="consultation_count">...</span></p>
              </div>
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 140px; display: inline-block;">Total Invoices:</span><span class="data-input" data-field="invoice_count">...</span></p>
              </div>
              <div class="col-sm-4">
                <p class="card-text"><span class="fw-bold" style="width: 180px; display: inline-block;">Receivable:</span><span class="data-input" data-field="total_receivable">...</span></p>
              </div>
            </div>
          </div>
          <div class="my-auto mx-3">`,
             `<button data-id="${d.id}" class="btn_pat_modify btn btn-secondary rounded-4"><i class="fa fa-user-edit" style="font-size:0.8em"></i></button>`,
             `<button data-id="${d.id}" class="btn_pat_print btn btn-primary rounded-4"><i class="fa fa-print" style="font-size:0.8em"></i></button>`,
             `<button data-id="${d.id}" class="btn_pat_delete btn btn-danger rounded-4"><i class="fa fa-trash" style="font-size:0.8em"></i></button>`,
          `</div>       
      </div>
     </div>`].join('');

       if (prepend===1) list_container.insertAdjacentHTML('afterbegin', html_patient_row);
       else list_container.insertAdjacentHTML('beforeend', html_patient_row);

       //begin:: Add mousemove event handler to bottom summary panel
       let div_summary = list_container.querySelector(`#dpl_client_summary_${d.id}`);
     
        if(div_summary){
          div_summary.addEventListener('mousemove',e=>{
            let el = e.target.closest('.pdl-bottom-summary'); 
            if(el)
            {
              let id = el.dataset.id;
             
              if(id>0){

                  //calculate time elapsed in seconds from previous call to api
                    let elapsedSeconds =0;
                    let start_timestamp = el.dataset.lastrefreshtime;
                    if(start_timestamp){
                      const elapsed = Date.now() - start_timestamp;
                      // Calculate the elapsed time in seconds
                      elapsedSeconds = elapsed / 1000;
                    }

                  //Call api to refresh client summary if the time elapsed >=3 seconds  
                  if(!start_timestamp || elapsedSeconds>15){
                      /** el.setAttribute() => Prevent from immediate repeated call when user keep moving mouse over the div panel **/
                      el.setAttribute('data-lastrefreshtime',new Date().getTime());
                      //console.error(JSON.stringify(elapsedSeconds+' seconds elapsed'));
                      vsapi.call(`${main_view.base_url}/api/patient/quick-summary`,{'id':id},null,false).then(res=>{ 
                        if(res.status_code ===200){
                            mThis.refreshClientSummary(list_container,id,res.data);
                        }
                        //const nowTime = new Date().getTime();
                        //el.setAttribute() => is important to set threhold or start_time for next call
                        el.setAttribute('data-lastrefreshtime',new Date().getTime());
                      });
                  }
              
              } 
            }
          });
        }


    }
  
    // this.displayPatients = (onFinish = null,current_page=1) => {
    //     let p = { 'search_value': mThis.elSearch.val(),'page_number':current_page?current_page:1};

    //     window.vsapi.call(`${mThis.base_url}/api/patient/list-paginate`, p, null, null).then((res) => {
    //        if(res.status_code===200){
    //         mThis.div_patient_list.innerHTML =null;
    //           let rows = res.data.data;
    //           let i=0,d=null;
    //           do{
    //             d = rows[i];
    //             if(!d) break;
    //              mThis.addPatientRow(mThis.div_patient_list, d,0);
    //             i++;
    //           }while(d); 

    //           if(i===0){
    //             mThis.div_patient_list.innerHTML=`<div style="border:1px dotted grey;border-radius:5px;padding:10px;"><span class="d block text-center fw-bold p-2">There are no registered patients</span></div>`;
    //           }else{
    //             mThis.createPaginationButtons(res.data); 
    //           } 
    //        }
    //        if(typeof onFinish ==='function') onFinish();
    //     });
   
    // };

    this.show = (option = null) => {
        if(!option) option = {};
        mThis.patientListView.showPage(null,null,()=>{
          mThis.self.show().siblings().hide();
          main_view.setTitle(mThis.title_prop);
        });
      
        // mThis.displayPatients(() => {
        //     mThis.options = option;
        //     mThis.self.show().siblings().hide();
        //     main_view.setTitle(mThis.title_prop);
        //     //mThis.self.parent().css('overflow-y','hidden');
        // });
    }
}

window.addEventListener('DOMContentLoaded',e=> {
    PatientListComponent.init();
});
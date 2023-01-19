"use strict";
//begin:: AppointmentListComponent
 let AppointmentListComponent = new function(){
        let mThis = this;
        this.title_prop ='Appointments';
        this.self = $('#_main_appointmentListComponent');
  
        this.base_url = $('#__base_url').val();
        this.form_data = {};

        this.tblAppointments = $('#_apl_tblAppts');
        this.elSearchAppt = $('#_apl_search_appt');
        this.btnSearchAppt = $('#_apl_btnFindAppt');
        this.appt_filter_status = $('#_apl_filter_status');
        this.appt_filter_date =$('#_apl_filter_date');

        //this.btnSave = $('#_loanapp_btnSave');
        //this.btnApprove = $('#_loanapp_btnApprove');

        this.icon_url = ()=>{
            return `${VSUtil.asset_url()}/images/icons`;
        }

        this.btnNewAppointment = $('#_apl_btnNewAppointment');
        this.col_titles = {
              "Arrival Date":"Arrival Date",
              "Arrival Time":"Time",
              "Client Name":"Client Name",
              "Client Phone":"Client Phone",
              "Status":"Status",
              "Schedule Type":"Schedule Type",
              "Priority":"Priority",
              "Action":"Action"
        };
 
        //Initialize langauge translation tasks (for dataTable columns headers)
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        this.setLanguage = ()=>{
            //let d = 0;
            if (LocaleManager.lang !== mThis.lang){
                for (let prop in mThis.col_titles){
                    //if (mThis.col_titles.hasOwnProperty(prop)) {}
                     mThis.col_titles[prop] = LocaleManager.trans(prop,'appointment',LocaleManager.lang);
                }
                //d =1;
                mThis.lang = LocaleManager.lang;
            }
            //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
        }

        this.loadChiefComplaints = ()=>{
            window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((d)=>{
                mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
           });
        }

        //AddChiefComplaintToList() on Appointment List' s expanded view
        this.addCCToList = (ul,item={})=>{
            //let ul = $(`complaint_list-${appt_id}`);
            let appt_id = ul.data('apptid');

            //Remove first default element "(No chief complaint)"
            ul.find('li[data-apptid="0"]').remove();
            ul.append(`<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="appt-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`);  
        }

        //return html string for array of <li>
        this.displayCCList = (list_id,items=[])=>{
            let ul = $(`#${list_id}`);
            ul.empty();
            let appt_id = ul.data('apptid');
            let i =0, html='';
            (items || []).map((item)=>{
                html = [html,`<li id="${item.id}" data-apptid="${appt_id}"><a href="#" data-apptid="${appt_id}" data-id="${item.id}" class="appt-remove-complaint"><i class="fa fa-times" style="color:red"></i></a>&nbsp;${item.name}</li>`].join('');  
               i++;
            });
            if(i===0) html = `<li data-apptid="0"><span class="text-muted">(No chief complaints)</span></li>`;
            return html; 
        }
      
        this.setAppointmentStatus = (detail_tr,d={})=>{
            let tr = detail_tr.prev();
            let btn = tr.find('a.btn-appt-status');
            btn.text(d.status);
            btn.data('statusid',d.status_id);
            tr.data('statusid',d.status_id);

            let btnQ = detail_tr.find('.btn-add-queue');
            //let btnEdit = tr.find('a.btn_appt_modify').hide();
            // status_id => -1= canceled , 1 = Pending, 2= Registered, 3 = Queued 4 = Served

            // if (d.status_id >2) 
            //    btnEdit.hide();
            // else btnEdit.show();

            if(d.status_id >=3 ) 
               {
                btnQ.hide();
                detail_tr.find('.btn-start-consult').show();  
               }
            else
                btnQ.show();
            if (d.status_id >=2)
               detail_tr.find('.btn-view-profile').show();
            else
               detail_tr.find('.btn-view-profile').hide();  
        }

        this.displayAppointmentDetails = (detail_tr, appt_id=0)=>{
            let div_wrapper = detail_tr.find('div.expandable-row-containter');
            div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
            let p = {'id':appt_id};
            window.vsapi.call(`${main_view.base_url}/api/appointment/details`,p,'POST',false).then((res)=>{ 
              let html=null; 
              if (res.status_code === 200){
                 let d = StringSanitizer.sanitizeObject(res.data); 
                 //d.chief_complaints = d.chief_complaints?d.chief_complaints:[];
                 d.patient_code = d.patient_code?d.patient_code:'N.A.';
                 d.consultant_name=d.consultant_name?d.consultant_name:'Any';
                 
                 //begin:: refresh display of Client name and client code
                   let tr = detail_tr.prev();
                   tr.find('.client-name').text(d.client_name);
                   tr.find('.client-code').text(d.patient_code);
                 //end::refresh display of Client name and client code
              
                 html = `<div data-apptid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="appt-info-wrapper shadow-lg d-flex" style="width:100%;">
                        <div class="thumbnail-wrapper">
                        <img src="${mThis.icon_url()}/client-girl.png" class="profile-thumbnail">
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
                                        <button style="display:${d.status_id>2? 'block':'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-view-profile">View Profile</button>&nbsp;
                                        <button style="display:${d.status_id<2? 'block':'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-warning btn-register"><i class="fa fa-list-alt"></i><span class="trans-text" data-langprop="buttons.Register">Register</span></button>
                                        <button style="display:${d.status_id==2? 'block':'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-add-queue"><i class="fa fa-tasks"></i><span class="trans-text" data-langprop="buttons.Add to Queue">Queue</span></button>
                                        <button style="display:${d.status_id===3? 'block':'none'}" type="button" data-apptid="${d.id}" data-patientid="${d.client_id}" class="btn btn-sm btn-outline-success btn-start-consult"><i class="fa fa-user-check"></i><span class="trans-text" data-langprop="buttons.Serve">Serve</span></button>
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
                                         ${mThis.displayCCList(['apl-complaint-list-',d.id].join(''),d.chief_complaints)}  
                                        </ul>
                                    </div>
                                </div>
                        </div> 
                    
                    </div>`;
              
              }else{
                html =`<div class="expanded-row-error">${res.error_message}</div>`;
              }

              div_wrapper.html(html);
              //div_wrapper.slideDown(500);
            });
        }

        //return json object about Appointment's client details (name,sex,phone_number,...) from expandable view
        this.getClientInfo = (tr)=>{
           let div = tr.find('.appt-info-wrapper');
           let appt_id = div.data('apptid');
           let lead_id = div.data('leadid');
           let d = {'appt_id':appt_id,"lead_id":lead_id};
           div.find('.detail-item-value').each(function(){
              let span = $(this);
              let f = span.data('field');
              d[f] = span.text();
           });
           return d;
        }

        this.init = ()=>{

            //This is to refresh Datatable's header texts when language changes
            LocaleManager.setLanguageChangeHandler((lang)=>{
                mThis.displayAppointmentList();
            });

            //loadChiefComplaints() will retrieve list of chief complaints and stores them in "mThis.chief_complaints"
            //mThis.loadChiefComplaints();
            mThis.loadOptions();

            mThis.btnSearchAppt.on('click',(e)=>{
                e.preventDefault();
                mThis.displayAppointmentList();
            });

            //Search Appointment on Appointment List view
            mThis.elSearchAppt.on('keyup',(e)=>{
                e.preventDefault();
                //let d = mThis.elSearchAppt.val();
                //if(!d || d.length >3) 
               if (e.keyCode === 13) mThis.displayAppointmentList();
            });

            mThis.appt_filter_date.on('change',(e)=>{
               mThis.displayAppointmentList();
            });

            mThis.appt_filter_status.on('change',(e)=>{
                mThis.displayAppointmentList();
             });
 
            mThis.btnNewAppointment.on('click', function (e) {
                e.preventDefault();

                let op = {'id':0,
                 'onClose':(e)=>{
                    if(e){
                        cv_interact.info('New Appointment has been created',null,true);
                        mThis.displayAppointmentList();
                      }
                   }
                };

                AppointmentDialog.show(op);
            });
            
            mThis.tblAppointments.on('click','a.btn_appt_action',function(e){
                e.preventDefault();
            });

            mThis.tblAppointments.on('click','a.appt-add-complaint',function(e){
                e.preventDefault();
                let x = $(this);
                let ul_id = x.data('ulid');
                let ul = $(`#${ul_id}`);
                let appt_id =x.data('apptid');

                let option = {'title':'Choose Chief Complaint','dataLabel':'Select Chief Complaint','valueMember':'id','textMember':'name','data':mThis.form_data.chief_complaints,'blankErrorMessage':"Please choose chief complaint"};
                InputBox2.show(option,function(d){
                    //NOTE: d is object with {value,text}
                    if(d){
                       let  p = {"cc_id":d.value,"name":d.text,'appt_id':appt_id}; /** d.value = chief complaint id **/
                       window.vsapi.call(`${main_view.base_url}/api/appointment/add-chief-complaint`,p,null,null).then((res)=>{
                            if(res.status_code===200){
                                let item = {
                                    "id":d.value,
                                    "name":d.text
                                }
                                ul.data('apptid',appt_id);
                                mThis.addCCToList(ul,item); 
                            }else cv_interact.warning(res.error_message);
                       });
                    }
                });
            });
  
            mThis.tblAppointments.on('click','.btn-view-profile',(e)=>{
               e.preventDefault();
               
            });

            mThis.tblAppointments.on('click','.btn-add-queue',function(e){
                let x = $(this);
                let detail_tr = x.closest('tr');
                let client_id = x.data('patientid'); 
                let appt_id = x.data('apptid'); 
                let op = {'client_id':client_id,'appt_id':appt_id};

                ServiceQueueDialog.show(op,(p)=>{
                    if(p){
                       //let p = {'client_id':d.client_id,'department_id':d.department_id,'consultant_id':d.consultant_id};  
                       vsapi.call(`${main_view.base_url}/api/ticket/create`,p).then((res)=>{ 
                           if(res.status_code === 200){
                               let status_info = StringSanitizer.sanitizeObject(res.status_info); 
                               cv_interact.info(['Queue Ticket: ',res.ticket_number].join(''));
                               mThis.setAppointmentStatus(detail_tr,status_info);
                           }else cv_interact.warning(res.error_message); 
                       });
                    }
                });
            });
             
            mThis.tblAppointments.on('click','.btn-register',function(e){
                let tr = $(this).closest('tr');
                let appt_id = $(this).data('apptid'); 
                let op = {
                    "id":0,
                     "default_data":mThis.getClientInfo(tr),
                     "onClose":(res)=>{
                        if(res){
                            let d = res.status_info;
                            mThis.setAppointmentStatus(tr, {'status':d.status,'status_id':d.status_id});
                            mThis.displayAppointmentDetails(tr,appt_id);
                        }
                    }
                };
                PatientDialog.show(op);
            });
            
            //remove Chief complaint item, on Appoinment list expanaded view
            mThis.tblAppointments.on('click','a.appt-remove-complaint',function(e){
                e.preventDefault();
                let lnk = $(this);
                let ul = lnk.closest('ul');
                let p = {
                    'cc_id':lnk.data('id'),
                    'appt_id':ul.data('apptid')
                };

                let li = $(this).closest('li');
                cv_interact.confirm('Delete this item?',{
                    'confirmButtonText':'Delete',
                    'cancelButtonText':'Dont Delete',
                    'context':'delete'
                },(yes)=>{
                    if(yes){
                        window.vsapi.call(`${main_view.base_url}/api/appointment/remove-chief-complaint`,p,null,null).then((res)=>{
                            if(res.status_code===200){
                                li.remove();
                            }else cv_interact.warning(res.error_message);
                        });
                    }
                });               
            });

            mThis.tblAppointments.on('click','.btn-appt-status',function(e){
                e.preventDefault();
                let btn = $(this);
                let status_id = btn.data('statusid');
                alert('Change status from ' + status_id);
            });

            mThis.tblAppointments.on('click','a.btn_appt_modify',function(e){
                e.preventDefault();
                let lnk = $(this);
                let tr = lnk.closest('tr');
                let appt_id = tr.data('id');
                let op = {}; //{'identity_value':appt_id}; //appt_id for editing Appointment
                op.id = appt_id;
                op.onClose = (e)=>{
                   if(e){
                       mThis.displayAppointmentDetails(tr.next(),appt_id);
                   }
                };

                let status_id = tr.data('statusid');
                
                //Edit only Personal demogrpahic (name,sex, phone, email) when status_id > 2 (Quued)
                if(status_id > 2){
                    //In case of Editing Person Info only => also use @appt_id (instad of "id") to edit person info
                    /***
                     @op = {'appt_id':##} => api/person/save() will use appt_id to retrieve @person_id in order to update person profile 
                    **/
                    op.appt_id = appt_id;
                    PersonDialog.show(op);

                }else if(status_id<=2){
                    AppointmentDialog.show(op);
                } else console.error(`Error: Editing Appointment or personal profile requires status_id to be known exactly`);
            });

            this.cfg = new ExpandableRowConfig('_apl_tblAppts',{
                'dontExpandByClickingOn':['btn_appt_modify','btn_appt_delete','btn_appt_action','btn_appt_print'],
                //'content':`<div class="alert alert-info">Loading details</div>`,
                'onOpen':(container,detail_tr,parent_tr)=>{
                    //alert(detail_tr.find('ul').html());
                    let qtr = $(parent_tr);
                    let appt_id = qtr.data('id');
                    mThis.displayAppointmentDetails($(detail_tr),appt_id);
                 }
            });
           
            // mThis.setExpandableRow('_activeloan_tblLoans',function(){
            //    return `<div style="width:100%;padding:10px"> This is new expandable</div>`;   
            // });

            // this.tblAppointments.on('click','tr',function(e){
            //     let tr = $(this);
            //     mThis.expandableRow(tr,'expandable-wrapper'); 
            // });

            mThis.tblAppointments.on('click','a.btn_appt_delete',function(e){
                e.preventDefault();
                let lnk = $(this);
                let p = {'id':lnk.data('id')};
                cv_interact.confirm('Remove this appointment?',{'confirmButtonText':'Delete','cancelButtonText':'Dont Delete',title:null,'context':'delete'},(e)=>{
                    if(e){
                            vsapi.call(`${mThis.base_url}/api/appointment/delete`,p).then((res)=>{
                                if(res.status_code === 200){
                                   mThis.displayAppointmentList();    
                                }else cv_interact.error(res.error_message);
                            });
                    }
                });

            });
 

            // mThis.tblAppointments.on('mouseover','tr',function(e){
            //    let btn = $(this).find('a.btn_apt_action');
      
            //    btn.find('i').css('color','red');
            // }).on('mouseleave','tr',function(e){
            //     let btn = $(this).find('a.btn_apt_action');
            //     btn.find('i').css('color','#E9E7E7');

            // });

        }
   
    this.trans_title = (title_prop='undefined')=>{
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
    this.createDropdownMenuHtml_loan =(items=[],data=null, data_props=[])=> {
        if (!data_props) data_props = [];
        let str_props ="";
        data_props.map((prop_name)=>{
             prop_name = (prop_name?prop_name:'').replace(/_/g,'');
             if (prop_name) str_props =[str_props,str_props?" ":"",prop_name,`="${data[prop_name]}"`].join('');
        });

        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu action-menus">',
            '<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_edit" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue;font-size:1.1em;margin-top:2px;"></i> <span>Review Application</span</a>',
            //'<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_approve" href="#"><i class="fa fa-check" style="color:green"></i> Approve Loan</a>',
            '<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_disburse" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Disburse Loan</a>',
            '<div class="dropdown-divider"></div>',
            '<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Loan Application</a>',
            '<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_person_profile" href="#"><i class="fa fa-list" style="color:green"></i> Personal Profile</a>',
            //'<a data-id="',loan_app_id,'" data-personid="',person_id,'" class="dropdown-item _apl_loanapp_change_status" href="#"><i class="fa fa-tasks" style="color:grey;margin-top:3px;font-size:1.1em"></i> <span>Change Status</span</a>',
        '</div>'].join('');
        return html;
    } 

    this.getApptStatusClass = (status_id)=>{
      if(status_id==0) return 'border-secondary';
      else if(status_id==1) return 'border-warning';
      else if (status_id==2) return 'border-success';
      else 'btn btn-outline-warning'; 
    }

    //displayCreditOfficerList()| displayCO|
     this.displayAppointmentList =(onFinish=null)=>
     { 
         //Initialize language for DataTable columns headers
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
         mThis.setLanguage();
         let p = {'search_value':mThis.elSearchAppt.val(),'date':mThis.appt_filter_date.val(),'status_id':mThis.appt_filter_status.val()};
         window.vsapi.call(`${mThis.base_url}/api/appointment/list`,p,'POST',null).then((result)=>{
             let data = [];
             if(result.status_code === 200) data = result.data;
             if (mThis.table){
                     mThis.tblAppointments.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblAppointments.empty();
                     //alert('destroyed => '+  mThis.tblAppointments.html());
                     mThis.table = null;
             }
              data = StringSanitizer.sanitizeObject(data,null,['cur_symbol','arrival_time']);
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
                        data:function(data,a,b){
                            return ['<span style="display:block;padding:3px;">',data.arrival_date,'</span>',
                            //'<a class="btn btn-sm btn-outline-primary loanapp-btn-action">Approve</a>'
                            ].join('');
                        },
                        title: mThis.trans_title('Arrival Date')
                      },
                     {
                        title: mThis.trans_title('Arrival Time'),
                         data:(data,a,b)=>{
                            return [`<img class="dt-icon" src="${this.icon_url()}/time.png">&nbsp;`,data.arrival_time].join('');
                         },
                     },
                     {
                        title: mThis.trans_title('Client Name'),
                        data:(data,a,b)=>{
                           return [`<span style="display:block" class="client-name text-bold">`,data.client_name,`</span>`,`<span style="display:block;" class="client-code text-success">`,data.patient_code,`</span>`].join('');
                        }
                     },
                     {
                         title: mThis.trans_title('Client Phone'),
                         data:(data,a,b)=>{
                           return data.client_phone_number;
                         }
                     },
                     {
                        title: mThis.trans_title('Schedule Type'),
                        data:(data,a,b)=>{
                          return data.schedule_type;
                        }
                    },
                    {
                        title: mThis.trans_title('Priority'),
                        data:(data,a,b)=>{
                          return data.priority;
                        }
                    },
                     {
                        title: mThis.trans_title('Status'),
                        data:(data,a,b)=>{
                            return [`<a href="#" style="display:block;text-align:center;min-width:75px;padding:5px;" data-statusid="${data.status_id}" class="btn-appt-status border rounded-pill ${mThis.getApptStatusClass(data.status_id)}">`,data.status,`</a>`].join('');
                        }
                    },
                     {
                        title:mThis.trans_title('Action'),
                        data: function(data,a,b){
                            let status_class = null; //mThis.getStatusClass(data.status_id);
                            return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_appt_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_appt_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_appt_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_appt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                           ].join('');
                        }
                    }
                     // {
                     //       className:'name', //css class "total" is used for accessing value and update values of totals in <td>
                     //       data:function(data,a,b){
                     //         return ['<div style="display:flex;flex-direction:column">',
                     //             '<div class="pg-total_driver"><span class="total-label">Driver:</span><span class="total-value driver-total">',data.driver_total,'</span></div>',
                     //             '<div class="pg-total_sender"><span class="total-label">Sender:</span><span class="total-value sender-total">',data.sender_total,'</span></div>',
                     //         '</div>'].join(''); 
                     //     },
                     //     title:'Totals'
                     // }
                 ];
                 //END Define colum

             //translate column names
             //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

             if (!mThis.table)
             mThis.table = mThis.tblAppointments.DataTable({
                 searching:false,
                 destroy:true,
                 paging:true,
                 ordering:false,
                 //dom: 'Bfrtip',
                 retrieve: true,
                 //scrollY:390,
                 //scrollX:500,
                 //pagingType:'numbers',
                 info:true,
                 pageLength: 10,
                 bLengthChange:false,
                 saveState:true,
                  // rowReorder: {
                     // dataSrc: 'sequence'
                   // },
                    'processing': true,
                    'language': {
                         'loadingRecords': '&nbsp;',
                         'processing': 'Loading...',
                         "emptyTable": LocaleManager.trans('No data to display','datatable')
                     },
                     'data':data,
                     'columns':my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('id',data.id); //appt_id
                            tr.data('statusid',data.status_id);
                            tr.data('leadid',data.lead_id);
                            tr.data('clientid',data.client_id);
                            //tr.data('personid',data.person_id);
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
             // $('#_dl_tblAppointments_wrapper>div.dt-buttons').prepend(div);
              if(typeof onFinish ==='function') onFinish();      
              //mThis.cfg.open(mThis.tblAppointments.find(`tr:last`));                
         });
                  
     };

     this.loadOptions = (onFinish=null)=>{
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((d)=>{
            mThis.form_data.chief_complaints = StringSanitizer.sanitizeObject(d.data);
        });

        window.vsapi.call(`${main_view.base_url}/api/settings/options-appt-status`,null).then((res)=>{
            if(res.status_code===200){
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.appt_filter_status,items,'id','appt_status',true,'All Statuses',0);
                if(onFinish) onFinish();
                mThis.form_data.statuses = items;
              
            }
           
        });
     }

        this.show = (option=null)=>{
            //if(!option) option={};
            mThis.displayAppointmentList(()=>{
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
 

 
let AppointmentDialog = new function(){
    //this.base_url = main_view.base_url;     
    let mThis = this;
    this.self = $('#_apl_dlgAppt');
    this.cc_list = $('#_appt_cc_list');
    this.elChannel = $('#_appt_contact_channel');
    this.elConsultant = $('#_appt_consultant');
    this.elChiefComplaint = $('#_appt_chief_complaint');
   
    //On AppointmentDialog, find client
    this.elSearch = $('#_appt_search_client');
    this.btnSearchClient = $('#_appt_btnSearch');
    this.elPatientCode = $('#_appt_client_code');
    this.elName = $('#_appt_client_name');
    this.elPhoneNumber = $('#_appt_client_phone');
    this.elSex = $('#_appt_client_sex');
    this.elEmail= $('#_appt_client_email');

    
    this.cc_input = $('#appt_cc_input');
    this.btnFindClient = $('#_appt_btnFindClient');

    window.vsapi.call(`${main_view.base_url}/api/settings/options-contact-channel`,null).then((d)=>{
        let items = StringSanitizer.sanitizeObject(d.data);
        VSUtil.setComboItems(mThis.elChannel,items,'id','channel_name','(Select channel)',null);
    });

    window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`,null).then((d)=>{
        let items = StringSanitizer.sanitizeObject(d.data);
        VSUtil.setComboItems(mThis.elConsultant,items,'id','consultant_name','(Select consultant)',null);
    });
     
    // let beforeShow =()=>{
    //      window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`,null).then((d)=>{
    //         let items = StringSanitizer.sanitizeObject(d.data);
    //         VSUtil.setComboItems(mThis.elConsultant,items,'id','name','(Select consultant)',null);
    //     });
    // }

    // let init = ()=>{
    //     alert('custom init');
    //         window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((d)=>{
    //         let items = StringSanitizer.sanitizeObject(d.data);
    //         VSUtil.setComboItems(mThis.elChiefComplaint,items,'id','name','(Chief complaint)',null);
    //     });
    // }

    this.getChiefComplaints = ()=>{
        let ps = [];
        mThis.cc_list.find('li').each(function(){
            let li = $(this);
            ps.push({'id':li.data('id'),'name':li.text()});
        });
        return ps;
    }

    //*** On New Appointment Dialog, when user select a Chief Complaint => add the selected Chief complaint to the <ul> list below ***/
    //NOTE: item is object = {id,name}
    this.addChiefComplaintToList = (item=null)=>{
         if(!item){
            item ={
                "id":mThis.elChiefComplaint.val(),
                "name":mThis.elChiefComplaint.find('option:selected').text()
            };
         }

         let html = [`<li data-id="${item.id}"><a href="javascript:void(0)" class ="cc-item-delete"><i class="fa fa-trash" style="color:red"></i></a>&nbsp;${item.name}</li>`].join('');
         let found_item = null;
         mThis.cc_list.find('li').each(function(){
            let li = $(this);
            if (li.data('id') == item.id){
                found_item = li;
                return false;
            } 
        });
        if (!found_item) mThis.cc_list.append(html);
    }

    //Display Chief complaint Items in context of user's Editing or Updating Appointment info, and add/Remove Chief complaints
    //items is array [{id,name},{id,name}, ...]
    this.displayChiefComplaints = (items)=>{
       items.map((i)=>{
         mThis.addChiefComplaintToList(i);
       });
    }

    //on AppointmentDialog: display Chief Complaint items in Select2/Dropdown list for user to select
    this.displayComboItems_cc = (id)=>{
        window.vsapi.call(`${main_view.base_url}/api/settings/options-chief-complaint`,null).then((d)=>{
            let items = StringSanitizer.sanitizeObject(d.data);
            VSUtil.setComboItems(mThis.elChiefComplaint,items,'id','name',true,'(Chief complaint)',id);
            if(id) mThis.elChiefComplaint.trigger('change'); 
       });
    }

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Appointment",
        "formId":'_apl_dlgAppt',
        //"titleId":"_apl_dlgAppt_title",
        //"errorId":"_apl_dlgAppt_error",
        //"saveButtonId":"_apl_dlgAppt_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/appointment/save`,
        "apiGet":`${main_view.base_url}/api/appointment/details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Appointment",
        "createTitle":"New Appointment",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['lead_id','client_id'],
        "sub_prop":"chief_complaint_items",
        "sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":['email','client_email','arrival_time'],
        'use_alert_error':false,
        "init": ()=>{

               mThis.displayComboItems_cc();

               mThis.cc_list.on('click','.cc-item-delete',function(e){
                   e.preventDefault();
                   $(this).closest('li').remove();  
               });

               mThis.elSearch.on('keyup',(e)=>{
                  e.preventDefault();
                  if(e.keyCode === 13) mThis.btnFindClient.trigger('click');
               });

               mThis.elSearch.on('blur',(e)=>{
                  e.preventDefault();
                   mThis.btnFindClient.trigger('click');
               });

               mThis.btnFindClient.on('click',(e)=>{
                   let p={"search_value":mThis.elSearch.val()};
                  window.vsapi.call(`${main_view.base_url}/api/appointment/find-client`,p).then((res)=>{
                    if(res.status_code===200){
                       let c = StringSanitizer.sanitizeObject(res.data);
                       if(!c) c ={};
                       mThis.elPatientCode.val(c.patient_code);
                       mThis.elName.val(c.name);
                       mThis.elEmail.val(c.email);
                       mThis.elPhoneNumber.val(c.phone_number);
                       mThis.elSex.val(c.sex).trigger('change');
                       mThis.lead_id = c.lead_id;
                       mThis.client_id = c.client_id;
                    }

                  });
               });

               mThis.elChiefComplaint.on('change',(e)=>{
                 mThis.addChiefComplaintToList();
               });
                     // //Add Event listeners or event handlers
                     $('#appt_lnkAddChiefComplaint').on('click',(e)=>{
                        e.preventDefault();
                        
                        let option = {'previousDialog':mThis.self,'title':'New Chief Complaint','dataLabel':'Enter new chief complaint','valueMember':'id','textMember':'name','blankErrorMessage':"Please enter new chief complaint"};
                        InputBox1.show(option,function(d){
                            if(d){
                                let p = {"name": d}; /** d.value = chief complaint id **/
                                window.vsapi.call(`${main_view.base_url}/api/settings/save-chief-complaint`,p).then((res)=>{
                                   if(res.status_code===200){
                                      mThis.displayComboItems_cc(res.data.id);
                                   }else cv_interact.error(res.error_message);
                                }); 
                            }
                        });
     
                     });

        }
        //,"beforeShow":beforeShow
    });
 
    this.show = (option=null)=>{
        //let x = document.getElementById('_appt_contact_channel').options;
       
        if (option.identity_value > 0)
            mThis.self.find('.cc-input').hide();
        else{
            mThis.cc_list.empty();
            mThis.self.find('.cc-input').show(); 
        }

        mThis.formUntil.show(option);
    }
     
} 

//begin::PatientDialog => register Patient
 let PatientDialog = new function(){
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
    this.elAgeUnit = $('#_pat_age_unit'); //span
    this.divVitalSign = $('#pat_vital_signs');
    this.divMedConditions = $('#med_con_panel');

    this.btnSave.on('click',function(e){
       e.preventDefault();
       //let tr = $(this).closest('tr');
       mThis.registerPatient(0);
    });
    
    this.btnSaveAndQueue.on('click',(e)=>{
        mThis.registerPatient(1);
    });

    this.elDateOfBirth.on('change',(e)=>{
        let now = Date();
        let d = VSUtil.daysBetween(this.elDateOfBirth.val(),now);
        let unit = 'months';
        d = Number(d).toFixed(2);
        if(d >360){
            unit ='years';
            d = Number(d/365).toFixed(2);
        }else if (d<30){
            unit ='days';
            d = Number(d).toFixed(2);
        }else if (d>=30){
            unit ='months';
            d = Number(d/30.5).toFixed(2);
        }

        mThis.elAgeUnit.text(unit);
        mThis.elAge.val(d);
    });

    //save patient details (profile), or/and Add the patient to Waiting Queue 
    this.registerPatient = (addToQueue=0)=>{
        let p = mThis.getFormData();
        p.addToQueue = addToQueue;

        // if (!p.appt_id){
        //   cv_interact.warning('The appointment identifer is unexpectedly missing'); 
        //   return;
        // }
 
        //alert(JSON.stringify(p));
        window.vsapi.call(`${main_view.base_url}/api/patient/register`,p,null,null).then((res)=>{
           if(res.status_code===200){
              //Refresh data in Expanded panel
              if (typeof mThis.onClose === 'function') mThis.onClose(res);
               mThis.self.modal('hide');
           }else{
               //cv_interact.warning(res.error_message);
               VSUtil.showDialogError('_apl_dlgPatient',res.error_message,5000);
           }
        });
    }

    this.getVitalSignInputs = ()=>{
        let ps = [];
        mThis.divVitalSign.find('.data-input').each(function(){
            let el = $(this);
            let vs_id = el.data('vitalsignid');
            ps.push({"id":vs_id,"display_name":el.data('ffield'),"value":el.val()?el.val():""});
        });
        return ps;
    }

    this.getMedConditions = ()=>{
        let ps = [];
        mThis.divMedConditions.find('.m-checkbox').each(function(){
            let el = $(this);
            //mc_id = Medical Condition item ID
            let mc_id = el.data('mcid');
            let val = el.is(':checked')? 1:0;
            ps.push({"id":mc_id,"display_name":el.data('ffield'),"value":val});
        });
        return ps;
    }


    this.prepareVitalSignFields =(fields =[])=>{
        mThis.divVitalSign.empty();

        (fields || []).map((f,index)=>{
            let field_name = (f.display_name+'').replace(' ','').toLowerCase();
            mThis.divVitalSign.append(`
             <div data-id="vital_sign_${f.id}" class="form-group col-lg-3">
                <span class="simple-label trans-text vital-sign-label" data-langprop="patient.${f.display_name}">${f.display_name}</span> 
                <div><input data-vitalsignid="${f.id}" type="${f.value_type}" data-field="${field_name}" data-ffield="${f.display_name}" class="form-control data-input"></div> 
              </div>
           `);
        });
    }

    //Prepare Medical Conditions Fields for user to input
    this.prepareMCFields =(fields=[])=>{
        mThis.divMedConditions.empty();
        (fields || []).map((f,index)=>{
            let field_name = (f.display_name+'').replace(' ','').toLowerCase();
            mThis.divMedConditions.append(`
              <div class="form-inline"><input type="checkbox" class="m-checkbox" data-mcid="${f.id}" data-field="${field_name}" data-ffield="${f.display_name}">&nbsp;<span>${f.display_name}</span></div>
           `);
        });
    }

    this.getFormData = ()=>{
        let p = {};
        //Appointment ID (appt_id). If Regisering patient from Appointment List, there is mThis.appt_id > 0
        p.appt_id = mThis.appt_id;
        p.lead_id= mThis.lead_id;
        mThis.self.find('.data-input-reg').each(function(){
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

    this.prepareOptions = (onFinish)=>{
        /** "api/patient-reg-options" returns object {nationalities: [], vital_sign_fields:[] } that is used as nationality options and vital sign fields **/
     window.vsapi.call(`${main_view.base_url}/api/patient-reg-options`,null).then((res)=>{
        if(res.status_code===200){
            let nats = StringSanitizer.sanitizeObject(res.data.nationalities);
            let vital_sign_fields = StringSanitizer.sanitizeObject(res.data.vital_sign_fields);
            //mc_items is array of medical condition items
            let mc_items = StringSanitizer.sanitizeObject(res.data.mc_items);
            let departments = StringSanitizer.sanitizeObject(res.data.departments);
            let consultants = StringSanitizer.sanitizeObject(res.data.consultants);

            VSUtil.setComboItems(mThis.elNat,nats,'id','nationality',true,'(Choose nationality)',null);
            VSUtil.setComboItems(mThis.elDepartment,departments,'id','department_name',false,null,null);
            VSUtil.setComboItems(mThis.elConsultant,consultants,'id','consultant_name',true,'(Choose doctor)',null);
            mThis.prepareVitalSignFields(vital_sign_fields);
            mThis.prepareMCFields(mc_items);
            onFinish();
        }
     });
    }
    
    this.clearForm = ()=>{
        mThis.setData(null);
        mThis.self.find('.error_text').each(function(){
               $(this).remove();   
        });
        VSUtil.hideDialogError('_apl_dlgPatient');
    }

    //setData() on PatientDialog
    this.setData = (d)=>{
       d = d?d:{};
       mThis.appt_id = d.appt_id;
       mThis.lead_id = d.lead_id;
       mThis.elAgeUnit.text(null);
       mThis.elError.val(null);

       // class "data-input-reg" is for person's data input such as "name, date_of_birth,phone_number,email, ..."
       mThis.self.find('.data-input-reg').each(function(){
         let el = $(this);
         let f = el.data('field');
         if(el.is('select')){
           el.val(d[f]).trigger('change');
           //set data attribute data-error =0 (i.e: No data validation error on first load)
           el.data('error',0);
         }else el.val(d[f]);
       });
    }

    //option = {id,default_nationality}
    this.show = (option)=>{
        option = option?option:{};   
        mThis.option = option;
        mThis.onClose = option.onClose;

        mThis.prepareOptions(()=>{

            if(option.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Patient','titles'));
            }else  {
                //Clear previous data
                mThis.clearForm();
                mThis.elTitle.text(LocaleManager.trans('Register Patient','titles'));
    
                //Set default nationality
                if (!option.default_data) option.default_data = {};
                option.default_data.nationality ="Cambodia";
                if (option.default_data.nationality){
                    let nat_id = 0;
                    let ops = mThis.elNat.find('option');
                    
                     ops.map((index,i)=>{
                       //console.error(i.textContent);
                       if(i.textContent === 'Cambodia'){
                         nat_id = i.value;
                         return false;
                       }
                    });
 
                    //  nat_id = mThis.elNat.find('option').filter((item)=>{
                    //      return item.text === option.default_data.nationality;
                    //  });

                     if(nat_id>0){
                          option.default_data.nationality_id = nat_id;
                          //mThis.elNat.val(nat_id).trigger('change');
                     }
                 }

                 //Set default data on Patient Form
                 mThis.setData(option.default_data);
            }
             
                    mThis.self.modal({
                        backdrop:'static'
                    });
            
         });

    }

 }
//end::PatientDialog

//begin:: ServiceQueueDialog
  let ServiceQueueDialog = new function(){
     let mThis = this;
     this.elTitle = $('#_qsd_dlgQService_title');
     this.title_prop ="Choose Department";
     this.dialog_id = '_qsd_dlgQService';
     this.self = $('#_qsd_dlgQService');
     this.elConsultant = $('#_qsd_consultant');
     this.elDepartment = $('#_qsd_department');
     this.elRemarks = $('#_qsd_remarks');
     this.btnOK = $('#_qsd_dlgQService_btnOK');

     mThis.btnOK.on('click',(e)=>{
        e.preventDefault();
        let p = {
            'appt_id':mThis.appt_id,
            'client_id':mThis.client_id,
            'department_id':mThis.elDepartment.val(),
            'consultant_id':mThis.elConsultant.val(),
            'remarks':mThis.elRemarks.val()
        }
        let error = mThis.getValidateError();
        if(error){
            VSUtil.showDialogError(mThis.dialog_id,error);
            return;
        }
        mThis.self.modal('hide');
        if(typeof mThis.onClose ==='function') mThis.onClose(p);
    });

     mThis.elDepartment.on('change',()=>{
        mThis.displayConsultants(mThis.elDepartment.val());
     });

     this.getValidateError = ()=>{
        if(!mThis.elDepartment.val() || mThis.elDepartment.val() ==0) return LocaleManager.trans('Service department is required','message_box_default');
     }

     this.prepareOptions = (onFinish)=>{
        window.vsapi.call(`${main_view.base_url}/api/settings/options-department`,null).then((res)=>{
            if(res.status_code ===200){
                 let items = StringSanitizer.sanitizeObject(res.data);
                 VSUtil.setComboItems(mThis.elDepartment, items,'id','department_name',null,null);
                 onFinish();
            }
        });
     }

     this.displayConsultants = (department_id = 0)=>{
        let p = {'department_id':department_id};
        window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`,p).then((res)=>{
            if(res.status_code ===200){
                 let items = StringSanitizer.sanitizeObject(res.data);
                 VSUtil.setComboItems(mThis.elConsultant,items,'id','consultant_name',null,null);
            }
        });
     }

     this.show = (option=null,onClose)=>{
       if(!option) option = {};
       mThis.appt_id = option.appt_id;
       mThis.client_id = option.client_id;
       mThis.onClose = onClose;
       VSUtil.hideDialogError(mThis.dialog_id);
       mThis.prepareOptions(()=>{
          mThis.self.modal({
             backdrop:'static'
          });
          mThis.elTitle.text(LocaleManager.trans(mThis.title_prop));
       });
     }
  }
//end:: ServiceQueueDialog
 
$(document).ready(()=>{
    AppointmentListComponent.init();
});
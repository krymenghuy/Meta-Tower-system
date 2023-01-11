"use strict";
//begin:: PatientFinderComponent
 let PatientFinderComponent = new function(){
        let mThis = this;
        this.title_prop ='Find Patient';
        this.self = $('#_main_patientFinderComponent');
        this.base_url = $('#__base_url').val();
        this.tblPatients = $('#_paf_tblPatients');
        this.elSearch = $('#_apl_search');
        this.btnNew = $('#_paf_btnNew');
        //this.btnSave = $('#_loanapp_btnSave');
        //this.btnApprove = $('#_loanapp_btnApprove');
 
        this.col_titles = {
              "ID":"ID",
              "Name":"Name",
              "Sex":"Sex",
              "Age":"Age",
              "Phone Number":"Phone Number",
              "Email":"Email",
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
                     mThis.col_titles[prop] = LocaleManager.trans(prop,'patient',LocaleManager.lang);
                }
                //d =1;
                mThis.lang = LocaleManager.lang;
            }
            //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
        }

        this.init = ()=>{
            LocaleManager.setLanguageChangeHandler((lang)=>{
                mThis.displayPatients();
            });

            mThis.elSearch.on('keyup',(e)=>{
                mThis.displayPatients();
            });

            mThis.btnNew.on('click',e => {
                let op = {
                    onClose:(e)=>{
                       if(e){
                         mThis.displayPatients();
                       }
                    }
                };
                PatientDialog.show(op);
            });
      
            // mThis.tblPatients.on('click','a.btn_apt_action',function(e){
            //     e.preventDefault();
            // });

            mThis.tblPatients.on('click','a.btn_patient_modify',function(e){
                e.preventDefault();
                let lnk = $(this);
                let op = {'id':lnk.data('id')};
                PersonDialog.show(op);
            });

            mThis.tblPatients.on('click','a.btn_patient_delete',function(e){
                e.preventDefault();
                let id = lnk.data('id');
                alert('todo: delete patient if can');
            });

            this.cfg = new ExpandableRowConfig('_paf_tblPatients',{
                'wrapperClass':'patient-info-wrapper',
                'html':`<div style="width:100%;padding:10px">The patient details is displayed here</div>`
            });
           
            // mThis.setExpandableRow('_activeloan_tblLoans',function(){
            //    return `<div style="width:100%;padding:10px"> This is new expandable</div>`;   
            // });

            // this.tblPatients.on('click','tr',function(e){
            //     let tr = $(this);
            //     mThis.expandableRow(tr,'expandable-wrapper'); 
            // });

            mThis.tblPatients.on('click','a.btn_patient_delete',function(e){
                e.preventDefault();
                let lnk = $(this);
                let p = {'id':lnk.data('id')};
                cv_interact.confirm('Remove this patient?',{'confirmButtonText':'Delete','cancelButtonText':'Dont Delete',title:null,'context':'delete'},(e)=>{
                    if(e){
                        vsapi.call(`${mThis.base_url}/api/patient/delete`,p).then((res)=>{
                            if(res.status_code === 200){
                                mThis.displayPatients();    
                            }else cv_interact.error(res.error_message);
                        });
                    }
                });
            });
 
            // mThis.tblPatients.on('mouseover','tr',function(e){
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
 
    //displayCreditOfficerList()| displayCO|
     this.displayPatients =(onFinish=null)=>
     { 
         //Initialize language for DataTable columns headers
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
         mThis.setLanguage();
         let p = {'search_value':mThis.elSearch.val()};
         window.vsapi.call(`${mThis.base_url}/api/patient/list`,p,'POST',null).then((result)=>{
             let data = [];
             if(result.status_code ===200) data = result.data;
             if (mThis.table){
                     mThis.tblPatients.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblPatients.empty();
                     //alert('destroyed => '+  mThis.tblPatients.html());
                     mThis.table = null;
             }
              data = StringSanitizer.sanitizeObject(data,null,['cur_symbol']);
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
                            return ['<span style="display:block;padding:3px;">',data.code,'</span>',
                            //'<a class="btn btn-sm btn-outline-primary loanapp-btn-action">Approve</a>'
                            ].join('');
                        },
                        title: mThis.trans_title('ID')
                      },
                     {
                        title: mThis.trans_title('Name'),
                         data:'name',
                       
                     },
                     {
                        title: mThis.trans_title('Sex'),
                        data: 'sex'
                        
                     },
                     {
                         title: mThis.trans_title('Age'),
                         data:(data,a,b)=>{
                           return data.age;
                         }
                     },
                     {
                        title: mThis.trans_title('Phone Number'),
                        data:(data,a,b)=>{
                            return data.phone_number;
                        }
                    },
                    {
                        title: mThis.trans_title('Email'),
                        data:(data,a,b)=>{
                            return data.email;
                        }
                    },
                     {
                        title:mThis.trans_title('Action'),
                        data: function(data,a,b){
                            let status_class = null; //mThis.getStatusClass(data.status_id);
                            return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_co_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_patient_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_patient_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_apt_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
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
             mThis.table = mThis.tblPatients.DataTable({
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
                            tr.data('id',data.id);
                            tr.data('statusid',data.status_id);
                            tr.data('personid',data.person_id);
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
             // $('#_dl_tblPatients_wrapper>div.dt-buttons').prepend(div);
              if(typeof onFinish ==='function') onFinish();      
              mThis.cfg.open(mThis.tblPatients.find(`tr:first`));                
         });
                  
     };
 
        this.show = (option=null)=>{
            //if(!option) option={};
            mThis.displayPatients(()=>{
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
 

 
// let AppointmentDialog = new function(){
//     //this.base_url = main_view.base_url;     
//     let mThis = this;
//     mThis.elChannel = $('#_appt_contact_channel');
//     mThis.elConsultant = $('#_appt_consultant');

//     window.vsapi.call(`${main_view.base_url}/api/settings/options-contact-channel`,null).then((d)=>{
//         let items = StringSanitizer.sanitizeObject(d.data);
//         VSUtil.setComboItems(mThis.elChannel,items,'id','name','(select channel)',null);
//     });

//     window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`,null).then((d)=>{
//         let items = StringSanitizer.sanitizeObject(d.data);
//         VSUtil.setComboItems(mThis.elConsultant,items,'id','name','(Select consultant)',null);
//     });
 
//     // let beforeShow =()=>{
//     //      window.vsapi.call(`${main_view.base_url}/api/settings/options-consultant`,null).then((d)=>{
//     //         let items = StringSanitizer.sanitizeObject(d.data);
//     //         VSUtil.setComboItems(mThis.elConsultant,items,'id','name','(Select consultant)',null);
//     //     });
//     // }


//     this.formUntil = new FormUntil({
//         "itemName":"Appointment",
//         "formId":'_apl_dlgAppt',
//         "titleId":"_apl_dlgAppt_title",
//         "errorId":"_apl_dlgAppt_error",
//         "saveButtonId":"_apl_dlgAppt_btnSave",
//         "instance":this,
//         "apiSave":`${main_view.base_url}/api/appointment/save`,
//         "apiGet":`${main_view.base_url}/api/appointment/details`,
//         "identityProp":"id",
//         "modifyTitle":"Modify Appointment",
//         "createTitle":"New Appointment",
//         "sanitize_excepts":['email','client_email','arrival_time'],
//         'use_alert_error':false
//         //,"beforeShow":beforeShow
//     });
 
//     this.show = (option=null,onClose=null)=>{
//         //let x = document.getElementById('_appt_contact_channel').options;
//         //alert(JSON.stringify(x[3].text));
//         mThis.formUntil.show(option,onClose);
//     }
     
// } 

$(document).ready(()=>{
    PatientFinderComponent.init();
});
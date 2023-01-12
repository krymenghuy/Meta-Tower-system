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

            this.cfg = new ExpandableRowConfig('_paf_tblPatients', {
                'dontExpandByClickingOn': ['btn_patient_modify', 'btn_patient_delete', 'btn_patient_action'],
                'tr_dataset':['patient_id'],
                //'content':`<div class="alert alert-info">Loading details</div>`,
                'onOpen': (container, detail_tr, parent_tr) => {
                    //alert(detail_tr.find('ul').html());
                    let q_tr = $(parent_tr);
                    let patient_id = q_tr.data('id');  
                    //Capture value using jquery
                    //if (!patient_id) patient_id = $(parent_tr).data('id'); 

                    //Show Expandable Details of each ticket (QTicket)
                    PatientDetails.show($(detail_tr), {
                        'patient_id': patient_id,  
                        'person_id': q_tr.data('personid'),
                        'status_id': q_tr.data('statusid')
                    });
                }
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
        }
   
    this.trans_title = (title_prop='undefined')=>{
       return (mThis.col_titles[title_prop] || 'undefined');
    }

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
                            //tr.attr('data-id',data.id);
                            tr.data('id',data.id);
                            tr.data('statusid',data.status_id);
                            tr.data('personid',data.person_id);
                       }   								
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
}

let PatientDetails = new function () {
    let mThis = this;
    mThis.current_view_name = 'history';
    mThis.tblPatients = $('#_paf_tblPatients');

    this.icon_url = () => {
        return `${VSUtil.asset_url()}/images/icons`;
    }

    //begin:: initialize PatientDetails. Eventhandler bindlings
    this.init = () => {
        mThis.tblPatients.on('click','a.btn-ticket-tab',function(e){
            e.preventDefault();
            let ws_id = $(this).data('target');
            let view_name = $(this).data('viewname');
            let ws = $(`#${ws_id}`);
            mThis.displayPatientTab(ws,view_name);
        });
    }
    //end::TicketDetails.init()

    this.displayPatientTab = (div_workspace,view_name)=>{
        let renderPatientDetails ={
            "history":() => {
                vsapi.call(`${main_view.base_url}/api/patient/history`,null).then(res => {
                    if(res.stutus_code === 200){
                        let history_urls = res.data;
                        let html = `<div class="table-reponsive">
                        <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <span class="trans-text" data-langprop="dt_columns.Ticket Number"></span>
                                </th>
                                <th>
                                    <span class="trans-text" data-langprop="dt_columns.Doctor"></span>
                                </th>
                                <th>
                                    <span class="trans-text" data-langprop="dt_columns.Date"></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>`;
                        history_urls.map(url => {
                            html = [`
                                    <tr>
                                        <td>${url.ticket_id}</td>
                                        <td>${url.doctor}</td>
                                        <td>${url.date}</td>
                                    </tr>
                                `].join('');
                        });
                        html = [html,`</tbody></table>
                        </div>`].join('');

                        div_workspace.html(html);
                    }
                });
            },
            "photo":() => {
                vsapi.call(`${main_view.base_url}/api/paitent/photos`,null).then(res=>{
                    if(res.status_code===200){
                         let image_urls = res.data;
                         let html =`<div class="d-flex align-items-center justify-content-center gap-2">`;
                         image_urls.map(url=>{
                            html = [html,`<img class="img-thumbnail" src="${url}"/>`].join('');
                         });
                         html = [html,`</div>`].join('');
                        div_workspace.html(html);
                    }
                });
 
            },

            "invoices":() => {
                vsapi.call(`${main_view.base_url}/api/patient/invoice`,null).then(res => {
                    if(res.status_code === 200){
                        cnt = 1;
                        let invoice_urls = res.data;
                        let html = `<div class="table-responsive">
                        <talbe class="table">
                            <thead>
                                <tr>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.No"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Ticket Number"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Patient"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Invoice Date"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Due Date"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Amount"></span>
                                    </th>
                                    <th>
                                        <span class="trans-text" data-langprop="dt_columns.Paid"></span>
                                    </th>
                                </tr>
                            </thead><tbody>`;
                        invoice_urls.map(ulr => {
                            html = [`
                                <tr>
                                    <td>${cnt++}</td>
                                    <td>${ulr.ticket_id}</td>
                                    <td>${ulr.patient}</td>
                                    <td>${ulr.invoiceDate}</td>
                                    <td>${ulr.dueDate}</td>
                                    <td>${ulr.amount}</td>
                                    <td>${ulr.paid}</td>
                                </tr>
                            `].join('');
                        });
                        html = [`</tbody></table></div>`].join('');
                        div_workspace.html(html);
                    }
                });
            }
        };
        renderPatientDetails[view_name]() ;
    }

    //Display Patient Details panel, by displaying the "History" tab as default view
    this.show = (detail_tr,options) => {
        let patient_id =options.patient_id;
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        //patient_id = detail_tr.data('patientid');
        let div_id = `ws_${patient_id}`;

        let html = `<div class="ticket-info-wrapper shadow-lg d-flex" style="width:100%;">
                    <div class="form-inline ticket-tab-buttons" role="group" aria-label="ticket tabs" style="display:block">
                        <a style="padding:5px" data-viewname="history" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-history trans-text" data-langprop="buttons.History">History</a>
                        <a style="padding:5px" data-viewname="photo" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-photo trans-text" data-langprop="buttons.Photo">Photos</a>
                        <a style="padding:5px" data-viewname="invoices" data-target ="${div_id}" type="button" class="btn-ticket-tab btn-patient-invoices trans-text" data-langprop="buttons.Invoices">Invoices</a>
                    </div>
                    <div id="${div_id}" class="qul-workspace pt-3" style="width:100%;display:block;">
                    </div>
                  </div>`;
        div_wrapper.html(html);
        //div_wrapper.slideDown(500);
        ///todo: show detaul tab "Histosry"



    }

    this.setActiveTabButton = (div_wrapper, btn_class) => {
        div_wrapper.find(`.${btn_class}`).addClass('btn-ticket-tab--active').siblings().removeClass('btn-ticket-tab--active');
    }

    this.showHistory = (div_panel) => {
        let div_workspace = div_panel.find('div.qul-workspace');
        div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');

        window.vsapi.call(`${main_view.base_url}/api/ticket/details`, p, 'POST', false).then((res) => {
            let html = null;
            let ws_id = null;

            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                if(!d) d = {};
                //d.chief_complaints = d.chief_complaints?d.chief_complaints:[];

                html = [].join('');
            } else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }

            div_workspace.html(html);
            LocaleManager.translateZone(ws_id);
            //div_wrapper.slideDown(500);
            mThis.current_view_name = 'history';
        });
    }

    this.showPhoto = (div_panel) => {
        let div_workspace = div_panel.find('div.qul-workspace');
        //div_workspace.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
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

    this.startInvoice = (div_panel, ticket_id = null) => {
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
        mThis.current_view_name = 'invoice';
    };
}

$(document).ready(()=>{
    PatientDetails.init();
    PatientFinderComponent.init();
});
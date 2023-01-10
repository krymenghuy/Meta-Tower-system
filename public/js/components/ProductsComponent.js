"use strict";
let ProductsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Products';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_productsComponent');
    this.btnNew = $('#_pdc_btnNew');
    // this.elSearchItem = $('#_msl_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_pdc_tblItem');
    // this.form_data = {};

    this.col_titles = {
        "No.":"No.",
        "Code":"Code",
        "Name":"Name",
        "Group":"Group",
        "Type":"Type",
        "Action":"Action"
    };

    this.displayProductsDetails = (detail_tr, appt_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'id':appt_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/details-item`,p,'POST',false).then((res) => {
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
            html =`<div class="expanded-row-error">${error_message}</div>`;
          }

          div_wrapper.html(html);
          //div_wrapper.slideDown(500);
        });
    }

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'items',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                    mThis.displayProducts();
                    }
                }
            };
            ProductsDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_item_modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                    //do something on dialog closed
                    if(e){
                        mThis.displayProducts();
                    }
                }
            };
            ProductsDialog.show(op);
        });

        mThis.tblItems.on('click','.btn-delete-item',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this product ddd?`,{title:"Delete Product11",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-item`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayProducts();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_pdc_tblItem',{
            'dontExpandByClickingOn':['btn_appt_modify','btn_appt_delete','btn_appt_action','btn_appt_print'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen':(container,detail_tr,parent_tr)=>{
                //alert(detail_tr.find('ul').html());
                let qtr = $(parent_tr);
                let appt_id = qtr.data('id');
                mThis.displayProductsDetails($(detail_tr),appt_id);
             }
        });
    }
     
    this.displayProducts =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {};
        window.vsapi.call(`${mThis.base_url}/api/inventory/items`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code === 200) data = result.data;
            if (mThis.table){
                mThis.tblItems.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null);
            let cnt = 1;
            //begin::Set up columns
            let my_columns = [
                {
                    title: mThis.trans_title("No."),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    title: mThis.trans_title("Code"),
                    data: "code"
                },
                {
                    data:(item,a,b) =>{
                        return [`<div>${item.name}</div>`].join('');
                    },
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Group'),
                    data:"group"
                },
                {
                    title: mThis.trans_title('Type'),
                    data: "type"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(item,a,b){
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${item.id}" class="btn-delete-item"><i class="fa fa-trash" style="color:red"></i></a>`,
                        `</div>`
                        ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');
            
            if (!mThis.table)
            mThis.table = mThis.tblItems.DataTable({
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
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...',
                    "emptyTable": LocaleManager.trans('No data to display','datatable')
                    },
                'data':data,
                'columns':my_columns,
                "createdRow": function(row, data, dataIndex){
                    cnt++;
                    let tr = $(row);
                    tr.data('id',data.id);
                }						
            });
            if(typeof onFinish ==='function') onFinish();                
        });     
    };

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.displayProducts(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::MedicalServiceDialog
let ProductsDialog = new function(){
    let mThis = this;
    this.self = $(`#_pdc_dlgProducts`);

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Products",
        "formId":'_pdc_dlgProducts',
        //"titleId":"_msl_dlgService_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/inventory/save-item`,
        "apiGet":`${main_view.base_url}/api/inventory/details-item`,
        //"identityProp":"id",
        "modifyTitle":"Modify Product",
        "createTitle":"New Product",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        'beforeShow': () => {}
        // "init": ()=>{  
        //  }
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}
//end::MedicalServiceDialog

$(document).ready(function() {
    ProductsComponent.init();
});
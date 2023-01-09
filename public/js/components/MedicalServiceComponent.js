"use strict";

let MedicalServiceComponent = new function(){
    let mThis = this;
    this.title_prop = 'Medical Services';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_medicalServiceComponent');
    this.btnNew = $('#_msl_btnNew');
    this.elSearchItem = $('#_msl_search');
    this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_msl_tblItems');
    this.form_data = {};

    this.col_titles = {
        "Numero":"No.",
        "Name":"Name",
        "Description":"Description",
        "Price":"Price",
        "Department":"Department",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
     }

    this.setLanguage = ()=>{
        //let d = 0;
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                //if (mThis.col_titles.hasOwnProperty(prop)) {}
                 mThis.col_titles[prop] = LocaleManager.trans(prop,'service',LocaleManager.lang);
            }
            //d =1;
            mThis.lang = LocaleManager.lang;
        }
        //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
    }

    //begin:: MedicalServiceCompoent.int()
    this.init = () => {

        mThis.elSearchItem.on('keyup',(e)=>{
            if(e.keyCode === 13) mThis.displayMedicalServices();
        });

        mThis.btnNew.on('click',(e)=>{
            let op = {
                department_id:mThis.elFilter_department.val(),
                onClose:(e)=>{
                     if(e){
                         mThis.displayMedicalServices();
                     }
                }
            };
            MedicalServiceDialog.show(op); 
        });

        mThis.tblItems.on('click','.btn_item_modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                     //do something on dialog closed
                     if(e){
                         mThis.displayMedicalServices();
                     }
                }
            };
            MedicalServiceDialog.show(op); 
        });

        mThis.tblItems.on('click','.btn_item_delete',function(e){
            let item_id = $(this).data("id");
             //alert(item_id);
            cv_interact.confirm(`Delete this service?`,{title:"Delete Service",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/service/delete`,p).then(res=>{
                       if(res.status_code===200){
                          mThis.displayMedicalServices();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });

        });

        mThis.elFilter_department.on('change',(e)=>{
            mThis.displayMedicalServices();
        });
    }

    this.displayMedicalServices =(onFinish=null)=>
     { 
         //Initialize language for DataTable columns headers
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
         mThis.setLanguage();
         let p = {'search_value':mThis.elSearchItem.val(),"department_id":mThis.elFilter_department.val()};
         window.vsapi.call(`${mThis.base_url}/api/service/items`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code ===200) data = result.data;
            if (mThis.table){
                mThis.tblItems.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblItems.empty();
                //alert('destroyed => '+  mThis.tblItems.html());
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null,['display_price']);
             //begin::Set up columns
                let cnt = 1;
                //data = [ {name: "sffdf", description:"sddfsf",price:100, cur_symbol:"$"},{}, ... ]
                let my_columns = [
                    {
                        data:(item,a,b)=>{
                            return cnt;
                        },
                        title: mThis.trans_title('Numero')
                    },
                    {
                        data:(item,a,b) =>{
                            return [`<div>${item.name}</div>`].join('');
                        },
                        title: mThis.trans_title('Name')
                    },
                    {
                        title:mThis.trans_title('Service Type'),
                        data:"service_type"
                    },
                    {
                        title:mThis.trans_title('')
                    },
                    {
                        title: mThis.trans_title('Description'),
                        data:"description"
                    },
                    {
                        title: mThis.trans_title('Price'),
                        data:'display_price'
                        // data:(item,a,b)=>{
                        //     return [item.cur_symbol,item.price].join('');
                        // }
                    },
                    {
                        title: mThis.trans_title('Department'),
                        data:'department_name'
                        // data:(item,a,b)=>{
                        //     return [item.cur_symbol,item.price].join('');
                        // }
                    },
                    {
                        title:mThis.trans_title('Action'),
                        data: function(item,a,b){
                            return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn_item_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
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
                             cnt++;
 
                            let tr = $(row);
                            tr.data('id',data.id); //appt_id
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
             // $('#_dl_tblItems_wrapper>div.dt-buttons').prepend(div);
              if(typeof onFinish ==='function') onFinish();      
              //mThis.cfg.open(mThis.tblItems.find(`tr:last`));                
         });     
     };

    this.loadFilterOptions= (onFinish)=>{
      if (mThis.form_data.departments){
         onFinish(mThis.form_data.departments);
      } else{
                vsapi.call(`${main_view.base_url}/api/settings/departments`,null).then(res=>{
                    if(res.status_code === 200) {
                    let items = StringSanitizer.sanitizeObject(res.data);
                    // items = [{id, name}]
                    ////VSUtil.setComboItems(mThis.elFilter_department,items,'id','name',true,'(Select department)',0); 
                    //if(!mThis.form_data) mThis.form_data = {};
                    mThis.form_data.departments = items;
                    onFinish(items);
                    }
                });
      } 
    } 

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;

        mThis.loadFilterOptions((items) =>{
            VSUtil.setComboItems(mThis.elFilter_department,items,'id','name',true,'(Select department)',0); 
            mThis.displayMedicalServices(()=>{
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            });
        });
    }
}

//begin::MedicalServiceDialog
 let MedicalServiceDialog = new function(){
      let mThis = this;
      this.self = $(`#_msl_dlgService`);
      this.elDepartment = $('#_msl_dlgService_department');

        //on ServiceDialog: display department items in Select2/Dropdown list for user to select
        this.prepareFormOptions = (default_id,onFinish)=>{
                window.vsapi.call(`${main_view.base_url}/api/settings/departments`,null).then((res)=>{
                    let items = StringSanitizer.sanitizeObject(res.data);
                    VSUtil.setComboItems(mThis.elDepartment,items,'id','name',true,'(Select Department)',default_id); 
                    if(default_id) mThis.elDepartment.trigger('change'); 
                    onFinish();
            });
        }

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Service",
        "formId":'_msl_dlgService',
        //"titleId":"_msl_dlgService_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/service/save`,
        "apiGet":`${main_view.base_url}/api/service/details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Service",
        "createTitle":"New Service",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        'beforeShow': ()=>{

        }
        // "init": ()=>{
            
        //  }
        
    });

    this.show = (options)=>{
        mThis.prepareFormOptions(options.department_id,()=>{
            //mThis.elDepartment.val(options.department_id).trigger('change');
            mThis.formUntil.show(options);
        })
    }
 }
//end::MedicalServiceDialog

$(document).ready(function() {
    MedicalServiceComponent.init();
});
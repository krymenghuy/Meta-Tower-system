"use strict";
let ItemGroupsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Products Group';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemGroupsComponent');
    this.btnNew = $('#_pdg_btnNew');
    this.elSearchItem = $('#_pdg_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_pdg_tblProductGroup');
    // this.form_data = {};

    this.col_titles = {
        "No.":"No.",
        "Name":"Name",
        "Description":"Description",
        "Create By":"Create By",
        "Action":"Action"
    };

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
                        mThis.displayProductsGroup();
                     }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_item_modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                     //do something on dialog closed
                     if(e){
                         mThis.displayProductsGroup();
                     }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_item_delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this department?`,{title:"Delete Department",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-group`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayProductsGroup();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elSearchItem.on('keyup',(e)=>{
            if(e.keyCode === 13) mThis.displayProductsGroup();
        });

        this.cfg = new ExpandableRowConfig('_pdg_tblProductGroup', {
            'dontExpandByClickingOn': ['btn_item_modify', 'btn_item_delete', 'btn_item_action'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen': (container, detail_tr, parent_tr) => {
                //alert(detail_tr.find('ul').html());
                let q_tr = $(parent_tr);
                //It is IMPORTANT to access patient_id using jquery object here because the "createdRow" event passes data-id atttribue using jquery method
                let group_id = q_tr.data('id');  
                //Show Expandable Details of each rate
                mThis.displayProductsGroupDetails($(detail_tr),group_id);
            }
        });
    }

    this.displayProductsGroupDetails = (detail_tr, group_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = {'id':group_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/group-details`,p,'POST',false).then((res)=>{ 
          let html=null;
          if (res.status_code === 200){
            let d = StringSanitizer.sanitizeObject(res.data);
            html = [``].join('');
          }
          else{
            html =`<div class="expanded-row-error">${error_message}</div>`;
          }
          div_wrapper.html(html);
        });
    }

    this.displayProductsGroup =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val()};
        window.vsapi.call(`${mThis.base_url}/api/inventory/groups`,p,'POST',null).then((result)=>{
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
                    data:(item,a,b) =>{
                        return [`<div>${item.name}</div>`].join('');
                    },
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Description'),
                    data:"description"
                },
                {
                    title: mThis.trans_title('Create By'),
                    data: "create_by"
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
        mThis.displayProductsGroup(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::MedicalServiceDialog
let ItemGroupDialog = new function(){
    let mThis = this;
    this.self = $(`#_pdg_dlgProductGroup`);
     this.elCat = $(`#_pdg_dlgProductGroup_cat`);
     //elUnit
     this.elSKU = $(`#_pdg_dlgProductGroup_unit`);

    this.prepareFormOptions = (onFinish)=>{
       
        vsapi.call(`${main_view.base_url}/api/group/form-options`,null).then(res=>{
            if(res.status_code===200){
                let d = StringSanitizer.sanitizeObject(res.data);
                 onFinish(d);
            }
        });
    }

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Item Group",
        "formId":'_pdg_dlgProductGroup',
        "titleId":"_pdg_dlgProductGroup_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_pdg_dlgProductGroup_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/inventory/save-group`,
        "apiGet":`${main_view.base_url}/api/inventory/group-details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Product Group",
        "createTitle":"New Product Group",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        //'beforeShow': () => {}
        // "init": ()=>{
        //  }
    });
     
    this.show = (options)=>{
        mThis.prepareFormOptions(d=>{
            let cats = d.categories;
            let units = d.units;
            VSUtil.setComboItems(mThis.elCat,cats,'id','category',true,'(select category)',null);
            VSUtil.setComboItems(mThis.elSKU,units,'id','unit_name',true,'(select sku)',null);
            mThis.formUntil.show(options);
        });
        
    }
}
//end::MedicalServiceDialog

$(document).ready(function() {
    ItemGroupsComponent.init();
});
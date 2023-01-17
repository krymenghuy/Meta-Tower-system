"use strict";
let StockTrackingComponent = new function(){
    let mThis = this;
    this.title_prop = 'Stock Tracking';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_stockTrackingComponent');
    this.btnNew = $('#_stk_btnExport');
    this.elSearchItem = $('#_stk_search');
    this.elFilter_category = $('#_stk_filter_category');
    this.elFilter_stock_class = $('#_stk_filter_class');

    this.elFilter_loc_warehouse = $('#_stk_filter_warehouse');
    this.elFilter_loc_block = $('#_stk_filter_block');

    this.tblItems = $('#_stk_tblItems');
    // this.form_data = {};
    this.icon_url = [VSUtil.asset_url(),'/images/icons'].join('');

    this.col_titles = {
        "No.":"No.",
        "Code":"Code",
        "Name":"Name",
        "Group":"Group",
        "Category":"Category",
        "SKU":"SKU",
        "Qty":"Quantity",
        "Quantity":"Quantity",
        "Action":"Action"
    };

     //prepareOptions()| prepareFormOptions() for ItemsComponent.show()
     this.prepareOptions = (onFinish)=>{
        //load all data options for Stock Tracking Form
        vsapi.call(`${main_view.base_url}/api/inventory/settings/stock-tracking-options`,null).then(res=>{
           if(res.status_code === 200){
             let d = StringSanitizer.sanitizeObject(res.data);
             onFinish(d);  
           } 
          
        });
    }

    this.displayVariances = (detail_tr, appt_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'id':appt_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/item-details`,p,'POST',false).then((res) => {
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
                    <img src="${mThis.icon_url}/client-girl.png" class="profile-thumbnail">
                    </div>

                    <div class="d-flex" style="width:100%">
                            <div style="width:50%">
                                    
                            </div>

                            <div style="width:50%">
                        
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

        this.expandableConfig = new ExpandableRowConfig('_stk_tblItems',{
            'dontExpandByClickingOn':['tbody-stock-items','lnk-item-category','btn-group-action','btn-group-modify','btn-group-delete','btn-group-print'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen':(container,detail_tr,parent_tr)=>{
                let qtr = $(parent_tr);
                let group_id = qtr.data('id');
                mThis.createExpandedPanelContent($(detail_tr),{'group_id':group_id});
             }
        });
 
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displayItemGroups();
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.elFilter_category.on('change',(e)=>{
            e.preventDefault();
            mThis.displayItemGroups();
        });

        mThis.tblItems.on('click','a.btn-group-modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                    //do something on dialog closed
                    if(e){
                        mThis.displayItemGroups();
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click','a.btn-group-delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this product?`,{title:"Delete Product",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-item`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayItemGroups();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
 

        mThis.elSearchItem.on('keyup',(e)=>{
            let d = mThis.elSearchItem.val();
            if(!d || d.length >2 || e.keyCode ===13) mThis.displayItemGroups();
        });
    }
  
     this.createExpandedPanelContent = (detail_tr,options)=>{
        let group_id = options.group_id;
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'group_id':group_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/stock/group-items`,p,'POST',false).then((res)=>{ 
          let html=null;
          if (res.status_code === 200){
             
             let items = StringSanitizer.sanitizeObject(res.data); 
              
             html = [
                `<div class="stock-items-panel">`,
                        `<table class="w-100 inner-item-table header-uppercase">`,
                            `<thead><tr>`,
                                `<th>Item Code</th>`,
                                `<th>Name</th>`,
                                `<th>Desciption</th>`,
                                `<th>Qty</th>`,
                                `<th>Last Updated</th>`,
                                `</tr></thead>`,
                            `<tbody class="tbody-stock-items">`,
                                mThis.createRowItems(items)
                            ,`</tbody>
                        </table>`,
                 `</div>`].join('');
          
          }else{
            html =`<div class="expanded-row-error">${res.error_message}</div>`;
          }

          div_wrapper.html(html);
          //div_wrapper.slideDown(500);
        });
    }
 
    this.createRowItems = (items)=>{
        let html = "";
       (items || []).map(t=>{
          let sku = t.sku;
          if(t.qty>1 && sku) sku =[sku,'s'].join('');
          let qty = [t.qty?t.qty:0,` `,sku].join('');
          let inner_html =`<td>${t.code}</td><td>${t.name}</td> <td>${t.description?t.description:"NA"}</td> <td>${qty}</td><td>${t.last_updated?t.last_updated:"NA"}</td>`;
          html = [html,`<tr data-itemid="`,t.id,`">`,inner_html,`</tr>`].join('');
       });
       return html;
    }

    this.displayItemGroups =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()};
        window.vsapi.call(`${mThis.base_url}/api/inventory/stock/group-list`,p,'POST',null).then((result)=>{
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
                    data:"name",
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Category'),
                    data:(data,a,b)=>{
                        return [
                            `<span class="fw-normal d-block lnk-item-category"><a data-gid="${data.id}" data-catid="${data.category_id}" href="javasvript:void(0)">`,data.category,`</a></span>`,
                            `<span class="text-secondary">`,data.detail_type,`</span>`
                        ].join('');
                    }
                },
                {
                    title: mThis.trans_title('Quantity'),
                    data: (data,a,b)=>{
                        let sku = data.sku;
                        if(data.qty>1 && sku) sku = [sku,'s'].join('');
                        return [data.qty?data.qty:0,' ',sku].join('');
                    }
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(item,a,b){
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn-group-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${item.id}" class="btn-group-delete"><i class="fa fa-trash" style="color:red"></i></a>`,
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
        mThis.prepareOptions(d=>{
            VSUtil.setComboItems(mThis.elFilter_category,d.categories,'id','category',true,'(All Categories)',0);
            VSUtil.setComboItems(mThis.elFilter_stock_class,d.stockclasses,'code','stock_class',true,'(All Classes)',0);
            mThis.displayItemGroups(() => {
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            });
        });

       
    }
}

// //begin::ItemDialog
// let ItemDialog = new function(){
//     let mThis = this;
//     this.form_data = {};
//     this.self = $(`#_itm_dlgProduct`);
//     this.elItemCode = $('#_itm_item_code');
//     this.elItemGroup = $('#_itm_item_group');
//     this.elUnit = $('#_itm_item_unit');

//     this.prepareOptions = (def={},onFinish)=>{
//        if(!def) def = {}; 
//        if (mThis.form_data.groups){
//          onFinish(mThis.form_data);
//          return;
//        }

//        //api/settings/item-form-options returns all sets of options for productDialog including arrays of "units,item-groups" 
//        vsapi.call(`${main_view.base_url}/api/inventory/settings/item-form-options`,null).then(res=>{
//            if(res.status_code === 200){
//              let d = StringSanitizer.sanitizeObject(res.data);
//              //VSUtil.setComboItems(mThis.elItemGroup,items,'id','name',false,null,def.group_id);
//              mThis.form_data.groups = d.groups;
//              mThis.form_data.units = d.units;
//              onFinish(mThis.form_data);
//            }     
//        });  
//     }

//     //ProductDialog using FormUtil as helper
//     this.formUntil = new FormUntil({
//         "itemName":"Products",
//         "formId":'_itm_dlgProduct',
//         //"titleId":"_itm_dlgProduct_title",
//         //"errorId":"_itm_dlgProduct_error",
//         //"saveButtonId":"_itm_dlgProduct_btnSave",
//         "instance":this,
//         "apiSave":`${main_view.base_url}/api/inventory/save-item`,
//         "apiGet":`${main_view.base_url}/api/inventory/item-details`,
//         //"identityProp":"id",
//         "modifyTitle":"Modify Product",
//         "createTitle":"New Product",
//         "identityProps":['id'],
//         //Set additional data props for getFormData() to collect on gathering data inputs from this form,
//         "form_data_props":['id'],
//         //"sub_prop":"chief_complaint_items",
//         //"sub_prop_function":mThis.getChiefComplaints,
//         "sanitize_excepts":[],
//         'use_alert_error':true,
//         //'beforeShow': () => {}
//         // "init": ()=>{  
//         //  }
//     });

//     this.show = (options)=>{
//         //default_input = {group_id, unit_id, etc...}. This is default selections when Dialog is shown for better user experiences
//         if (!options.default_input) options.default_input = {};
//         mThis.prepareOptions(options.default_input,(d)=>{
//             //mThis.elItemCode.prop('readOnly', (options.id > 0));
//             VSUtil.setComboItems(mThis.elItemGroup,d.groups,'id','name',false,null,options.default_input.group_id);
//             VSUtil.setComboItems(mThis.elUnit,d.units,'id','name',false,null,options.default_input.unit_id);
//             mThis.formUntil.show(options);
//         });
//     }
// }
// //end::ItemDialog

$(document).ready(function() {
    StockTrackingComponent.init();
});
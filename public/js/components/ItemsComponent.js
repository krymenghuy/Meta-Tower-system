"use strict";
let ItemsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Products';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemsComponent');
    this.btnNew = $('#_itm_btnNew');
    this.elSearchItem = $('#_itm_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_itm_tblItem');
    // this.form_data = {};
    this.icon_url = [VSUtil.asset_url(),'/images/icons'].join('');

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
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displayProducts();
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click','a.btn-item-modify',function(e){
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
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click','a.btn-item-delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this product?`,{title:"Delete Product",context:"delete"},(yes)=>{
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

        this.cfg = new ExpandableRowConfig('_itm_tblItem',{
            'dontExpandByClickingOn':['btn-item-modify','btn-item-delete','btn-item-action'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen':(container,detail_tr,parent_tr)=>{
                //alert(detail_tr.find('ul').html());
                let qtr = $(parent_tr);
                let appt_id = qtr.data('id');
                mThis.displayProductsDetails($(detail_tr),appt_id);
             }
        });

        mThis.elSearchItem.on('keyup',(e)=>{
            if(e.keyCode === 13) mThis.displayProducts();
        });
    }
     
    this.displayProducts =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val()};
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
                    data:"name",
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Group'),
                    data:"group_name"
                },
                {
                    title: mThis.trans_title('Type'),
                    data: "item_type"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(item,a,b){
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn-item-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${item.id}" class="btn-item-delete"><i class="fa fa-trash" style="color:red"></i></a>`,
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

//begin::ItemDialog
let ItemDialog = new function(){
    let mThis = this;
    this.form_data = {};
    this.self = $(`#_itm_dlgProduct`);
    this.elItemCode = $('#_itm_item_code');
    this.elItemGroup = $('#_itm_item_group');
    this.elCategory = $(`#_itm_item_category`);
    this.elManufacturer = $(`#_itm_item_manufacturer`);
    this.elDetailType = $(`#_itm_item_detail_type`);
    this.elUnit = $('#_itm_item_unit');
    this.detail_type_panel = $('#_itm_detail_type_panel');
    this.lnkAddGroup = $(`#_itm_lnkAddGroup`);
    this.lnkAddCategory = $(`#_itm_lnkAddCategory`);
    this.lnkAddUnit = $(`#_itm_lnkAddUnit`);
    this.lnkAddManufacturer = $(`#_itm_lnkAddManufacturer`);

    this.prepareOptions = (def={},onFinish)=>{
       if(!def) def = {}; 
       if (mThis.form_data.groups){
         onFinish(mThis.form_data);
         return;
       }

       //api/settings/item-form-options returns all sets of options for productDialog including arrays of "units,item-groups" 
       vsapi.call(`${main_view.base_url}/api/inventory/settings/item-form-options`,null).then(res=>{
           if(res.status_code === 200){
             let d = StringSanitizer.sanitizeObject(res.data);
             //VSUtil.setComboItems(mThis.elItemGroup,items,'id','name',false,null,def.group_id);
             mThis.form_data.groups = d.groups;
             mThis.form_data.units = d.units;
             mThis.form_data.categories = d.categories;
             mThis.form_data.manufacturers = d.manufacturers;
             onFinish(mThis.form_data);
           }     
       });  
    }

    //ProductDialog using FormUtil as helper
    this.formUntil = new FormUntil({
        "itemName":"Products",
        "formId":'_itm_dlgProduct',
        //"titleId":"_itm_dlgProduct_title",
        //"errorId":"_itm_dlgProduct_error",
        //"saveButtonId":"_itm_dlgProduct_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/inventory/save-item`,
        "apiGet":`${main_view.base_url}/api/inventory/item-details`,
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
        //'beforeShow': () => {}
        "init": ()=>{

            mThis.elCategory.on('change',function(e){
                e.preventDefault();
                let p = {"category_id":$(this).val()};
                vsapi.call(`${main_view.base_url}/api/setings/options-detail-type`,p).then(res=>{
                    if(res.status_code===200){
                        let items = StringSanitizer.sanitizeObject(res.data);
                       
                        if(!items[0]){
                            mThis.detail_type_panel.hide()
                        }else{
                            VSUtil.setComboItems(mThis.elDetailType,items,'id','detail_type',false,null);
                            mThis.detail_type_panel.show();
                            if(!items[1]){
                              mThis.elDetailType.val(items[0]).trigger('change');   
                            } 
                        } 
                    } 
                });
            });
             
            mThis.lnkAddGroup.on('click',(e)=>{
                //General name = "Product Line" or "Variance Group" or "Product Name" in which, there can be more than one variances of the product
                 let op = {
                    previousDialog:mThis.self,
                    title:"Add General Name",
                    label:`<span style="display:block">Enter new product line</span>
                    <span class="text-secondary">You must enter product code, for example, D1001:Doliprane</span>`,
                    allowBlankValue:false 
                 };

                 InputBox1.show(op,d=>{
                     if(d){
                        let parts = d.split(':');
                        let code = parts[0];
                        let group_name = parts[1];

                        let p = {code:code,name:group_name};
                        vsapi.call(`${main_view.base_url}/api/inventory/save-group`,p).then(res=>{
                            if(res.status_code ===200){
                                let new_id= res.data.id;
                                mThis.refreshOptions('group',new_id,null);  
                            }else cv_interact.error(res.error_message);
                        });
                     }
                 });
            });

            mThis.lnkAddCategory.on('click',(e)=>{
                //General name = "Product Line" or "Variance Group" or "Product Name" in which, there can be more than one variances of the product
                 let op = {
                    previousDialog:mThis.self,
                    title:"Add Category",
                    label:`<span style="display:block">Enter new category</span>
                    <span class="text-secondary">You can also add detail type by inputting like this iMac desktop:Brand New iMac</span>`,
                    allowBlankValue:false 
                 };

                 InputBox1.show(op,d=>{
                     if(d){
                        let parts = d.split(':');
                        let category_name = parts[0];
                        let detail_type = parts[1];

                        if(detail_type) detail_type = detail_type.trim();   
                        let p = {name:category_name,detail_type:detail_type};
                        vsapi.call(`${main_view.base_url}/api/category/save`,p).then(res=>{
                            if(res.status_code ===200){
                                let new_id= res.data.id;
                                mThis.refreshOptions('category',new_id,null);  
                            }else cv_interact.error(res.error_message);
                        });
                     }
                 });
            });

            //Add New SKU
            mThis.lnkAddUnit.on('click',(e)=>{
                //example input is "box=10 bottles"
               let op = {
                    previousDialog:mThis.self,
                    title:"Add SKU",
                    label:`<span style="display:block">Enter new SKU</span>
                    <span class="text-secondary">Example:box =10 bottles</span>`,
                    allowBlankValue:false,
                    manualClosing:true, //wait until we call "InputBox1.close()"
                 };

                 InputBox1.show(op,d=>{
                     if(d){
                        //mThis.processUnit(string) => processes the given string such as "box= 10 bottles" into JSON object such as {name:box,sub_unit_name:bottles,sub_unit_qty:10}
                        let unit = mThis.processUnit(d);
                        if(unit.error){
                            cv_interact.warning(unit.error);
                            return;
                        }
                        let p = {name:unit.name,sub_unit_name:unit.sub_unit_name,sub_unit_qty:unit.sub_unit_qty};
                        vsapi.call(`${main_view.base_url}/api/inventory/save-sku`,p).then(res=>{
                            if(res.status_code ===200){
                                let new_id= res.data.id;
                                mThis.refreshOptions('sku',new_id,null);
                                InputBox1.close();  
                            }else cv_interact.error(res.error_message);
                        });
                     }
                 });
            });


            //Add New manufacturer
             mThis.lnkAddManufacturer.on('click',(e)=>{
                        //example input is "box=10 bottles"
                       let op = {
                            previousDialog:mThis.self,
                            title:"Add Manufacturer",
                            label:`<span style="display:block">Enter new manufacturer</span>`,
                            allowBlankValue:false,
                            manualClosing:true, //wait until we call "InputBox1.close()"
                         };
        
                         InputBox1.show(op,d=>{
                             if(d){
                                 
                                let p = {'name':d};
                                vsapi.call(`${main_view.base_url}/api/inventory/save-manufacturer`,p).then(res=>{
                                    if(res.status_code ===200){
                                        let new_id= res.data.id;
                                        mThis.refreshOptions('manufacturer',new_id,null);
                                        InputBox1.close();  
                                    }else cv_interact.error(res.error_message);
                                });
                             }
                         });
                    });


         }
         //end::init
    });

    this.refreshOptions = (field_name,def_value=0,onFinish=null)=>{
        let method_name ='';
        let el = null;
        let text_field ='';

         switch(field_name){
                    case 'group':
                    {
                        el = mThis.elItemGroup;
                        text_field ='group_name';
                        method_name = 'api/inventory/settings/options-group';
                        break;
                    }
                    case 'category':{

                        el = mThis.elCategory;
                        text_field ='category';
                        method_name = 'api/inventory/settings/options-category';
                        break;
                    }
                    case 'sku':{

                        el = mThis.elUnit;
                        text_field ='unit_name';
                        method_name = 'api/inventory/settings/options-sku';
                        break;
                    }    
                
                case 'manufacturer':{
                    el = mThis.elManufacturer;
                    text_field ='manufacturer'
                    method_name = 'api/inventory/settings/options-manufacturer';
                    break;
                }
                default:{
                    method_name = 'api/settings/unknown???';
                    break;
                }
        }

         vsapi.call(`${main_view.base_url}/${method_name}`,null).then(res=>{
            if(res.status_code===200){
                let items = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(el,items,'id',text_field,false,null,def_value);
                if(typeof onFinish==='function') onFinish();
            }
         });

    } 

    this.unitNames = {
       "bottles":"bottle",
       "bottle":"bottle",
       "pcs":"pcs",
       "pills":"pill",
       "pill":"pill",
       "boxes":"box",
       "box":"box",
       "ampul":"ampul",
       "ampuls":"ampul" 
    };

    //processUnit() or processSKU() converts skuInfo into JSON object
    //unitInfo can be  "box =10 bottles" or "bottle = 60 pills"
    this.processUnit = (unitInfo=null)=>{
       if(!unitInfo) return {};
       let parts = unitInfo.split('=');
       let unit_name = parts[0];
       let part1 = (parts[1]?parts[1]:'').split(' ');
       let sub_unit_name ='';
       let sub_unit_qty = 0;

       let i =0, c =null;
       //NOTE: make sure there must NEVER be NULL in the middle of string "unitInfo"
       let sts = (parts[1]+'').trim().split(' ');
       sub_unit_qty = sts[0];
       sub_unit_name = [sts[1],sts[2]].join('');
       if(!$.isNumeric(sub_unit_qty)) sub_unit_qty =0;
       let translated_unit_name = mThis.unitNames[sub_unit_name];

       return {
        'error':translated_unit_name?null:`Unit name ${sub_unit_name} is not allowed`,
        'name':unit_name,
        'sub_unit_name':sub_unit_name,
        'sub_unit_qty':sub_unit_qty
       }
    }

    this.show = (options)=>{
        //default_input = {group_id, unit_id, etc...}. This is default selections when Dialog is shown for better user experiences
        if (!options.default_input) options.default_input = {};
        mThis.prepareOptions(options.default_input,(d)=>{
            //mThis.elItemCode.prop('readOnly', (options.id > 0));
            VSUtil.setComboItems(mThis.elItemGroup,d.groups,'id','group_name',false,null,options.default_input.group_id);
            VSUtil.setComboItems(mThis.elCategory,d.categories,'id','category',false,null,options.default_input.category_id);
            VSUtil.setComboItems(mThis.elUnit,d.units,'id','unit_name',false,null,options.default_input.unit_id);
            VSUtil.setComboItems(mThis.elManufacturer,d.manufacturers,'id','manufacturer',false,null,options.default_input.manufacturer_id);
            mThis.formUntil.show(options);
        });
    }
}
//end::ItemDialog

$(document).ready(function() {
    ItemsComponent.init();
});
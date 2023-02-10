"use strict";
let VendorsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Vendors';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_vendorsComponent');
    this.btnNew = $('#_vdr_btnNew');
    this.elSearchItem = $('#_vdr_search');

    this.tblVendors = $('#_vdr_tblVendors');

    this.col_titles = {
        "No":"No",
        "Name":"Name",
        "Vendor Type":"Vendor Type",
        "Balance":"Balance",
        "Tax Number":"Tax Number",
        "Email":"Email",
        "Phone":"Phone",
        "Action":"Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'vendors',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        this.expandableConfig = new ExpandableRowConfig('_vdr_tblVendors',{
            'dontExpandByClickingOn':['btn-vdr-modify','btn-vdr-delete'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen':(container,detail_tr,parent_tr)=>{
                let qtr = $(parent_tr);
                let group_id = qtr.data('id');
                mThis.displayVendorsDetails($(detail_tr),{'group_id':group_id});
            }
        });

        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displayVendors();
                    }
                }
            };
            VendorsDialog.show(op);
        });

        mThis.tblVendors.on('click','a.btn-vdr-modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                    //do something on dialog closed
                    if(e){
                        mThis.displayVendors();
                    }
                }
            };
            VendorsDialog.show(op);
        });

        mThis.tblVendors.on('click','a.btn-vdr-delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this vendor?`,{title:"Delete Vendor",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-item`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayVendors();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
 
        mThis.elSearchItem.on('keyup',(e)=>{
            let d = mThis.elSearchItem.val();
            if(!d || d.length >2 || e.keyCode ===13) mThis.displayVendors();
        });
    }

     this.displayVendorsDetails = (detail_tr,options)=>{
        let group_id = options.group_id;
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'group_id':group_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/stock/group-items`,p,'GET',false).then((res)=>{ 
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

    this.displayVendors =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val()};
        window.vsapi.call(`${mThis.base_url}/api/inventory/stock/group-list`,p,'POST',null).then((result) => {
            let data = [];
            if(result.status_code === 200) data = result.data;
            if (mThis.table){
                mThis.tblVendors.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblVendors.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null);
            let cnt = 1;
            //begin::Set up columns
            let my_columns = [
                {
                    title: mThis.trans_title("No"),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    title: mThis.trans_title("Name"),
                    data: "name"
                },
                {
                    data:"vendor_type",
                    title: mThis.trans_title('Vendor Type')
                },
                {
                    title: mThis.trans_title('Balance'),
                    data: "balance"
                },
                {
                    title: mThis.trans_title('Tax Number'),
                    data: "tax_number"
                },
                {
                    title: mThis.trans_title('Email'),
                    data: "email"
                },
                {
                    title: mThis.trans_title('Phone'),
                    data: "phone"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(item,a,b){
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn-vdr-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${item.id}" class="btn-vdr-delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                        `</div>`
                        ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

            if (!mThis.table)
            mThis.table = mThis.tblVendors.DataTable({
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
        mThis.displayVendors(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let VendorsDialog = new function(){
    let mThis = this;
    this.self = $('#_vdr_dlgVendors');
    this.formUntil = new FormUntil({
        "itemName":"Vendor",
        "formId":'_vdr_dlgVendors',
        "titleId":"_vdr_dlgVendors_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/inventory/save-item`,
        "apiGet":`${main_view.base_url}/api/inventory/details-item`,
        //"identityProp":"id",
        "modifyTitle":"Modify Vendor",
        "createTitle":"New Vendor",
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

$(document).ready(function() {
    VendorsComponent.init();
});
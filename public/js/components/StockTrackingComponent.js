"use strict";
let StockTrackingComponent = new function(){
    let mThis = this;
    this.title_prop = 'Stock Tracking';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_stockTrackingComponent');
    this.btnNew = $('#_stk_btnNew');
    this.elSearchItem = $('#_stk_search');
    this.elFilter_category = $('#_stk_filter_category');
    this.elFilter_stock_class = $('#_stk_filter_class');

    this.elFilter_loc_warehouse = $('#_stk_filter_warehouse');
    this.elFilter_loc_block = $('#_stk_filter_block');
    this.dlgFilter = $('#_stk_dlg_filter');
    this.btnReceiveStock = $('#_stk_btnNew_ReceiveStock');

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

        mThis.dlgFilter.on('click',(e)=>{
            e.preventDefault();
            let op = {
                onClose: (e) => {
                    if(e){
                        //do something
                    }
                }
            };
            FilterDialog.show(op);
        });

        mThis.btnReceiveStock.on('click',(e)=>{
            e.preventDefault();
            let op = {
                onClose: (e) => {
                    if(e){
                        //do something
                    }
                }
            };
            ReceiveStokeDialog.show(op);
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

//Begin::FilterDialog
let FilterDialog = new function(){
    let mThis = this;
    this.self = $('#_stk_dlgFilterStockTracking');

    this.show = (option) => {
        if (!option) option = {};
        mThis.onClose = option.onClose;
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}
//End::FilterDialog

//Begin::ReceiveStokeDialog
let ReceiveStokeDialog = new function(){
    let mThis = this;
    this.self = $('#_stk_dlgReceiveStock');
    this.elVendor = $('#_stk_select_vendors');

    this.loadItems = (onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/inventory/settings/receive-stock-options`,null).then((res)=>{
            if(res.status_code === 200){
                let d = StringSanitizer.sanitizeObject(res.data);
                /*** d.vendors , d.items */
                onFinish(d);
            }
        });
    }

    mThis.columns = [
        {
            "name": "item_id",
            "title": "Name",
            "dataType": "string",
            "displayType": "select",
            "width":"250px",
            //"cssClass": "",
            //"selectOptions":[] 
        },
        {
            "name":"qty",
            "title":"Qty",
            "width":"100px",
            "dataType":"number",
            "displayType":"input",
            //"cssClass":""
        },
        {
            "name":"sku",
            "title":"SKU",
            "dataType":"string",
            "displayType":"input",
            "readOnly":true,
            //"cssClass":""
        },
        {
            "name":"price",
            "title":"Price",
            "dataType":"number",
            "displayType":"input",
            "currencySymbol":"$"
            //"cssClass":""
        },
        {
            "name":"discount",
            "title":"Discount(%)",
            "dataType":"number",
            "displayType":"input",
            "cssClass":""
        },
        {
            "name":"line_total",
            "title":"Total",
            "dataType":"number",
            //todo: later get currency symbol from api
            "currencySymbol":"$",
            "readOnly":true
        }
    ];
    
    this.cfg = new ItemsView('_stk_div_items_panel',{
        columns: mThis.columns,
        "validateColumns":{"name":"positive","qty":"positive","price":"positive"},
        "showColumnHeaders":true,
        "showAddLineButton":true,
        "onItemChange":(selOp,col_name,td)=>{
            let tr = td.parentNode; 
            mThis.setTotal(col_name,tr);
        },
        "keyup":(e,col_name,td)=>{
              let tr = td.parentNode; 
              mThis.setTotal(col_name,tr);
        },
        "onInputChange":(e,col_name,td)=>{
            let tr = td.parentNode; 
            mThis.setTotal(col_name,tr);
        }
    });

    this.setTotal =(col_name,tr)=>{
        let d = mThis.cfg.getDataRow(tr);
        //cause_cols contains list of columns, when values of these columns change => it will cause the Line Total to change as (line_total = price * qty - discount) 
        let cause_cols = {'name':1,'qty':1,'price':1,'discount':1};
        //let cause_cols = {'name':1,'qty':1,'price':1,'discount':1,'sku':1}; //In case: we allow user to change SKU per item, when they receive stock
        let p = {"id":d.item_id};

        vsapi.call(`${main_view.base_url}/api/inventory/item-info`,p).then(res=>{
            if(res.status_code===200){
                mThis.cfg.setCellValue(tr,'sku',item.sku);
                mThis.cfg.setCellValue(tr,'price',item.cost);

                //update to override "price" directly from API
                d.price = parseFloat(item.cost);

                //NOTE: instead of using If, we use array $cause_cols. NOTE that "price" here is the cost per unit SKU
                if(cause_cols[col_name]){
                    d.qty = parseFloat(d.qty);
                    //d.price = parseFloat(d.price);
                    let total = (d.qty * d.price);
                    d.discount = parseFloat(d.discount);
                    let discount_amt = total * d.discount/100;
                    let net_total = total - discount_amt; 
                    mThis.cfg.setCellValue(tr,'line_total',net_total);
                }
            }
           
        }); 
    }

    //this.cfg.getItems();
    // this.cfg.setData(items);

    this.show = (option) => {
        if(!option) option = {};
        mThis.onClose = option.onClose;
        mThis.loadItems((d)=>{
            ///items [ {text,value}, {text,value}]
            mThis.cfg.setSelectOptions("item_id",d.items);
            VSUtil.setComboItems(mThis.elVendor,d.vendors,'id','vendor_name',true,'(select vendor)',null);
            mThis.self.modal({
                backdrop:'static',
            });
        });
    }
}
//End::ReceiveStokeDialog

$(document).ready(function() {
    StockTrackingComponent.init();
});
"use strict";
var PurchaseOrdersComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Purchase Orders";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_purchases_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnPurchases");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_purchases");
    mThis.elFilter_type = mThis.self.querySelector('#_purchases _type_id');
    mThis.elFilter_category = mThis.self.querySelector('#_purchases_category_id');
    mThis.elSearch = mThis.self.querySelector("#_search_purchases");
    let PurchaseOrderDialog = null;

    mThis.itemColumns = [
      {
          "name": "item_id",
          "title": "Item",
          "dataType": "string",
          "displayType": "select",
          "width": "250px",
          "valueField":"value",
          "textField":"label",
          // "formatter":(data,col,td)=>{
          //     return ['<span class="d-block p-1 border-primary rounded-3 w-100 h-100">',data.text,'</span>'].join('');
          // }
      },
      {
          "name": "qty",
          "title": "QTY",
          // "width": "100px",
          "dataType": "number",
          "displayType": "input",
      },
      {
      "name": "unit_price",
      "title": "Unit Price",
      "currencySymbol": "$",
      "width": "100px",
      "dataType": "decimal",
      "displayType": "input",
      "visible":false
    },
    {
      "name": "total",
      "title": "Total Price",
      "currencySymbol": "$",
      "dataType": "decimal",
      "width": "150px",
      "displayType": "input", 
      "isNumeric":true,
      "readOnly": true
    },
      // {
      //     "name": "accepted_qty",
      //     "title": "Accepted",
      //     "width": "80px",
      //     "dataType": "number",
      //     "displayType": "input",
      // },
    //   {
    //       "name": "uom",
    //       "title": "UOM",
    //       "dataType": "string",
    //       "displayType": "input",
    //       "readOnly": true,
    //   },
      // {
      //     "name": "receipt_comment",
      //     "title": "Remarks",
      //     "dataType": "string"
      //     //"readOnly": false
      // }
  ];
    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Po Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">Po-2026-100001</span>`;
            }
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">Chhorng</span>`;
            }
        },
        {
            title: "Po Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">12-12-2026</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'active') {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                else if (status === 'inactive') {
                    cls = 'badge text-dark bg-danger-subtle border border-danger';
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ''}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PoListView = new ListView('_purchases_list', {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PoListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            showPurchaseOrderDialog(op);
        };


        mThis.pr_tbl = mThis.PoListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        }
        const tblPo = mThis.PoListView.getTable();
        mThis.initDropdownMenus(tblPo);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }, 250);
        });
        mThis.Acfg = new ExpandableRowConfig(tblPo.id, {
            dontExpandByClickingOn: [
                'dropdown-menu',
                "btn-po-action"
            ],
            onOpen: (container, detail_tr, parent_tr) => {
                const qtr = parent_tr;
                let op = {
                    id: qtr.dataset.id,
                    // block_code: qtr.dataset.blockcode,
                    // request_type_id: qtr.dataset.request_typeid,
                    // request_id: qtr.dataset.requestid,
                };
                // op[qtr.dataset.field] = qtr.dataset.toid;
                // if(op.student_id > 0 && op.request_type_id > 0)
                // mThis.displayApprovalActivityDetails(detail_tr, op);
                const div_wrapper = detail_tr.querySelector(".expandable-row-container");
                renderPoItem(op, div_wrapper);
            },
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            // vendor_type_id: mThis.elFilter_type.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {

        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Vendor"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_vendor"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Vendor"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_vendor"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'modify_vendor': {
                        mThis.editVendor(id, menuLink);
                        break;
                    }
                    case 'delete_vendor': {
                        mThis.deleteVendor(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }
     const renderPoItem = (d, elBody, onFinish = null , expandableRow = true) => {
    vsapi.call(`${main_view.base_url}/prm/vendor/list-paginate`,{
      id: d.id
    },null,false).then((res) => {
        let info = {};
        if(res.status_code === 200)
        {
            let data = res.data;
            info = data;
            //(3232,info);
        // console.log(999888,d);
        }
        let html = ``;
        const tHead = `
          <thead>
              <tr>
                  <th class="text-nowrap">Code</th>
                  <th class="text-nowrap">Item</th>
                  <th class="text-nowrap">QTY</th>
                  <th class="text-nowrap">Unit Price</th>
                  <th class="text-nowrap">Total Price</th>
                  <th class="text-nowrap">Accept QTY</th>
              </tr>
          </thead>
        `;
        let tBody = ``;
        if(info.length > 0){
          info.map(item => {
            tBody += `<tr>
                        <th class="text-nowrap">123</th>
                        <th class="text-nowrap">Book</th>
                        <th class="text-nowrap">ITM-10001</th>
                        <th class="text-nowrap">10</th>
                        <th class="text-nowrap">7</th>
                    </tr>`
          });
        }else
        tBody = ' <tr><th colspan="100%" class="text-nowrap text-center">No item</th></tr>'

        tBody ='<tbody>' + tBody + '</tbody>';
        html += '<table class = "table w-100" >' + tHead + tBody + '</table>';

        elBody.innerHTML = html;

        elBody.classList.add("p-3","rounded-3","table-secondary");
        if(!expandableRow){
          elBody.querySelectorAll("select.modal-select2").forEach(el => {
              $(el).select2({
                  tags: true
              });
          });
          // const elGroup = mThis.elBody.querySelector('.opt_group');
          // elGroup.onchange = (e) => {
          //     e.preventDefault();
          //     mThis.options.group_id = e.target.value;
          // };
          // ApprovalDialog.setOption(elBody,d,elBody.querySelector("#pre_price"));
          if (typeof onFinish === "function") onFinish();
        }

    });
  };

    mThis.editVendor = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        };

        PurchaseOrderDialog(op);
    }
    mThis.deleteVendor = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Vendor?', {
            transTitle: 'Delete Vendor',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/vendor/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.PoListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    };


     //create and show RemarkDialog on demand only
  const showPurchaseOrderDialog = (op) =>{
    PurchaseOrderDialog = PurchaseOrderDialog || new GeneralDialog({
        cssClass:"modal-xl vs-modal",
        createContent:()=>{
          return `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Vendor</span>
                        <span class="mx-2 fw-bold">:</span>
                        <div class="w-50"><select name="vendor_id" class="data-input form-control" data-field="vendor_id">
                            <option>Select vendor...</option>
                            <option>Logistics</option>
                            <option>Modern Office</option>
                            <option>BlueChip</option>
                        </select></div>
                    </div>
                    
                    <div class="d-flex mb-1">
                        <span class="fw-bold" style="width:90px;">Vattin</span>
                        <span class="mx-2 fw-bold">:</span>
                        <span>L001-1001818</span>
                    </div>
                    <div class="d-flex">
                        <span class="fw-bold" style="width:90px;">Phone</span>
                        <span class="mx-2 fw-bold">:</span>
                        <span>0965809080</span>
                    </div>
                    <div class="d-flex">
                        <span class="fw-bold" style="width:90px;">Address</span>
                        <span class="mx-2 fw-bold">:</span>
                        <span>Kampong Cham, Phnom Penh, Cambodia</span>
                    </div>

                </div>
                <div class="col-md-5">
                </div>
                <div class="col-md-3 mt-3 mt-md-0">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">PO Number</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="po_number"
                            class="data-input form-control flex-grow-1"
                            data-field="po_number"
                            placeholder="">
                    </div>

                    <div class="d-flex align-items-center">
                        <span class="fw-bold" style="min-width:90px;">PO Date</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="date"
                            name="po_date"
                            class="data-input form-control flex-grow-1"
                            data-field="po_date">
                    </div>
                </div>
                <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                    <div id="purchase_item_list" class="purchase-item-list"></div>
                </div>
                
        </div>
        `;
        },
        configSelect:[
          {
             name:"warehouse",
             data:"warehouses",
             textField:"warehouse_name",
             valueField:"id",
             defaultValue:(me, d)=>{ return me.dataOptions.warehouse_id ?? 1; }
          }
          
        ],
        contentCreated:(me)=>{
         
          // const op = {id: me.dataOptions?.id, owner_id: me.dataOptions?.owner_id};
          // op.owner_id = me.dataOptions?.owner_id;
          // vsapi.call(`${main_view.base_url}/dms/shop/transfer/form-options`,op,false).then(res =>{
          //   if(res.status_code ==200){
          //     const data = res.data ?? [];
          //     let product_id =null;
          //     if(data.transfer){
          //       const items = data.transfer.items
          //       items.forEach(item => {
          //         product_id = item.item_id;
          //       });
          //       me.purchaseItemsView.setSelectOptions('item_id',data.products,product_id);

          //     }else
          //     me.purchaseItemsView.setSelectOptions('item_id',data.products,null);

          //   }
          // });
          me.purchaseItemsView = new ItemsView('purchase_item_list', {
            tableClass:'table',
            columns: mThis.itemColumns,
            //validateColumns: { "name": "positive", "qty": "positive","uom":"string", "price": "positive" },
            showColumnHeaders: true,
            showAddLineButton: true,
            "onItemChange":async(row_id, item, col_name, td, tr) => {
              // me.purchaseItemsView.setCellValue(tr,'uom','bottle1');
              const p = {item_id : item.item_id || item.id, merchant_id : me.dataOptions.merchant_id || me.dataOptions.owner_id};
              const res = await vsapi.call(`${main_view.base_url}/prm//vendor/details`, p,false);
              const d = res.data ?? {};
              me.current_item = d;
              console.log(3,d);
              tr.dataset.sku = d.default_sku;
              tr.dataset.code = d.code;
              me.setTotal(col_name, tr,d);
            },
            "keyup": (e, col_name, td) => {
                const tr = td.parentNode;
                const item = me.purchaseItemsView.getDataRow(tr,['sku','code']);
                me.setTotal(col_name, tr,item);
            },
            // "onInputChange": (el, col_name, td)=> {
            //     const tr = td.parentNode;
            //     // me.setTotal(col_name, tr);
            // }
          });
          
          me.clear = ()=>{
            for(const name in me.fields){
              const el = me.fields[name];
              const tag = el.tagName ;
  
              if(['SELECT','INPUT','TEXTAREA'].indexOf(tag) >= 0){
                el.value = '';
              }
              else{
                el.textContent = '';
              }
            }
            me.purchaseItemsView.setData(null);
          };
          
        },
        buttons:[
           {
             label:"Cancel",
             cssClass:"btn btn-warning",
             click:(me,btn)=>{
                me.hide(false);
             }
             
           },
           {
             label:"<span>Save</span>",
             cssClass:"btn btn-primary",
             click:(me) =>{
                  let p = me.getData();
                  p.items = me.purchaseItemsView.getItems(null,['sku','code']);
                  p.merchant_id = me.dataOptions.owner_id;
                  console.log(2,JSON.stringify(p,null,2));
                  vsapi.call(`${main_view.base_url}/dms/shop/transfer/save`,p,false).then(res =>{
                      if(res.status_code ==200){
                        cv_interact.success('Created transfer success!'); 
                        me.hide(true);
                        StockInListView.showPage(getFilterData());
                      }else cv_interact.warning(res.error_message); 
                  });
             }
           }
        ],
       onPrepareForm:(me,data)=>{
           //LocaleManager.translateZone(me.divModal); //This translation is done automatically
           const title = me.divModal.querySelector('.modal-title');
           title.innerHTML = `<h2 class="text-prm-custom text-start fw-bold">PURCHASE ORDER</h2>`;
          me.controls.merchant_name.textContent = data.merchant.name;
          
          me.purchaseItemsView.setSelectOptions('item_id',data.products,null);

          me.setTotal = (col_name, tr,item) => {
            //if(!tr) return;
            let d = me.purchaseItemsView.getDataRow(tr);
            const index = tr.querySelector('td.item-numero').textContent-1;
            //cause_cols contains list of columns, when values of these columns change => it will cause the Line Total to change as (line_total = price * qty - discount) 
            let cause_cols = { 'item_id': 1, 'qty': 1, 'price': 1};
            //let cause_cols = {'name':1,'qty':1,'price':1,'discount':1,'uom':'bag'}; //In case: we allow user to change UOM per item, when they receive stock
            // let p = { "item_id": d.item_id ,"owner_id": me.dataOptions?.owner_id};
            // vsapi.call(`${main_view.base_url}/dms/inventory/item/details`, p).then(res => {
            //     if (res.status_code === 200) {
            //         let item = Sanitizer.sanitizeObject(res.data);
                    // console.log(2222,item);
                    if(!item) item ={};
                    if(item.name) if(!item.uom) cv_interact.warning([item.name,' does not have valid UOM'].join(''));  
                    me.purchaseItemsView.setCellValue(tr, 'uom', item.uom);
                    // me.purchaseItemsView.setCellValue(tr, 'price', item.price ?? 0);
                    if(col_name ==='item_id') me.purchaseItemsView.setCellValue(tr, 'price', item.price ?? 0);
                    d.sku = item.default_sku
                    d.code = item.code

                    //*** update to override "price" directly from API
                    //d.price = parseFloat(item.cost);
    
                    //NOTE: instead of using If, we use array $cause_cols. NOTE that "price" here is the cost per unit UOM
                    if (cause_cols[col_name]) {
                        d.qty = parseFloat(d.qty);
                        //d.price = parseFloat(d.price);
                        let total = (d.qty * d.price);
                        // d.discount = parseFloat(d.discount);
                        // let discount_amt = total * d.discount / 100;
                        let net_total = total;
                        d.line_total = net_total;
                        me.purchaseItemsView.setCellValue(tr, 'line_total', net_total);
                    }

                // }
            // });
          }

          if(me.dataOptions.id){
            me.purchaseItemsView.setData(data.transfer.items,['sku','code']);
          }else
          me.clear();
       },
       prepareFormOptions:{
          modifyTitle: LocaleManager.trans("Edit Purchase Order","titles"),
          createTitle: LocaleManager.trans("Create Purchase Order","titles"),
          targetProp:"transfer",
          api:{
            endpoint:`${main_view.base_url}/prm/vendor/form-options`,
            params:(dataOptions)=>{
              return {id: dataOptions?.id, owner_id: dataOptions?.owner_id};
            }
          }
       } 
    });

    PurchaseOrderDialog.show(op);
  };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/vendor/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_type, d.vendor_types, 'id', 'vendor_type', true, 'All Type', null);
                VSUtil.setComboItems(mThis.elFilter_category, d.vendor_categories, 'id', 'vendor_category', true, 'All Category', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.PoListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();



// const CreatePurchasesOrderDialog = (op) => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog =
//             dialog ||
//             new GeneralDialog({
//                 cssClass: "modal-xl vs-modal",
//                 backdrop: "static",
//                 keyboard: true,
//                 createContent: () => {
//                     return `
//                             <div class="row mb-4">
//                                 <div class="col-md-4">
//                                     <div class="d-flex mb-1">
//                                         <span class="fw-bold" style="width:60px;">Vendor</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <div class="w-50">
//                                             <select name="vendor_id" class="data-input form-control" data-field="vendor_id">
//                                                 <option>Select vendor...</option>
//                                                 <option>Logistics</option>
//                                                 <option>Modern Office</option>
//                                                 <option>BlueChip</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div class="d-flex mb-1">
//                                         <span class="fw-bold" style="width:60px;">Vattin</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <span>L001-1001818</span>
//                                     </div>
//                                     <div class="d-flex">
//                                         <span class="fw-bold" style="width:60px;">Phone</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <span>0965809080</span>
//                                     </div>
//                                     <div class="d-flex">
//                                         <span class="fw-bold" style="width:60px;">Address</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <span>Kampong Cham, Phnom Penh, Cambodia</span>
//                                     </div>

//                                 </div>
//                                 <div class="col-md-5">
//                                 </div>
//                                 <div class="col-md-3 mt-3 mt-md-0">
//                                     <div class="d-flex align-items-center mb-2">
//                                         <span class="fw-bold" style="min-width:90px;">PO Number</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <input type="text"
//                                             name="po_number"
//                                             class="data-input form-control flex-grow-1"
//                                             data-field="po_number"
//                                             placeholder="">
//                                     </div>

//                                     <div class="d-flex align-items-center">
//                                         <span class="fw-bold" style="min-width:90px;">PO Date</span>
//                                         <span class="mx-2 fw-bold">:</span>
//                                         <input type="date"
//                                             name="po_date"
//                                             class="data-input form-control flex-grow-1"
//                                             data-field="po_date">
//                                     </div>
//                                 </div>
//                                 <div class="col-lg-12 p-2" style="background-color:#ebebeb;">
//                                     <div id="purchase_item_list" class="purchase-item-list"></div>
//                                 </div>
                               
//                         </div>
//                         `;
//                 },

//                 contentCreated: (me) => {

//                      me.purchaseItemsView = new ItemsView('purchase_item_list', {
//                         tableClass:'table',
//                         columns: mThis.itemColumns,
//                         //validateColumns: { "name": "positive", "qty": "positive","uom":"string", "price": "positive" },
//                         showColumnHeaders: true,
//                         showAddLineButton: true,
//                         "onItemChange":async(row_id, item, col_name, td, tr) => {
//                         // me.purchaseItemsView.setCellValue(tr,'uom','bottle1');
//                         const p = {item_id : item.item_id || item.id, merchant_id : me.dataOptions.merchant_id || me.dataOptions.owner_id};
//                         const res = await vsapi.call(`${main_view.base_url}/prm/tenant/details`, p,false);
//                         const d = res.data ?? {};
//                         me.current_item = d;
//                         console.log(3,d);
//                         tr.dataset.sku = d.default_sku;
//                         tr.dataset.code = d.code;
//                         me.setTotal(col_name, tr,d);
//                         },
//                         "keyup": (e, col_name, td) => {
//                             const tr = td.parentNode;
//                             const item = me.purchaseItemsView.getDataRow(tr,['sku','code']);
//                             me.setTotal(col_name, tr,item);
//                         },
//                         // "onInputChange": (el, col_name, td)=> {
//                         //     const tr = td.parentNode;
//                         //     // me.setTotal(col_name, tr);
//                         // }
//                     });
//                 },
//                 configSelect: [
//                     {
//                         name: "vendor_type_id",
//                         data: "vendor_types",
//                         textField: "vendor_type",
//                         valueField: "id",
//                     },
//                     {
//                         name: "vendor_category_id",
//                         data: "vendor_categories",
//                         textField: "vendor_category",
//                         valueField: "id",
//                     },

//                 ],
//                 prepareFormOptions: {
//                     createTitle: "Create Purchase Order",
//                     modifyTitle: "Modify Purchase Order",
//                     targetProp: "purchase_order_details",
//                     api: {
//                         endpoint: [main_view.base_url, "/prm/vendor/form-options",].join(""),
//                         params: (op) => {
//                             return { id: op.id };
//                         },
//                     },
//                 },

//                 onPrepareForm: (me, data) => {
//                     // LocaleManager.translateZone(me.divModal);
//                     // console.log(12,data);
//                     const header = me.divModal.querySelector('.modal-header');
//                     const title = me.divModal.querySelector('.modal-title');
//                     title.innerHTML = `<h2 class="text-primary text-start fw-bold">PURCHASE ORDER</h2>`;
//                     const btnClose = header.querySelector('button');
//                     if (btnClose) btnClose.classList.add('d-none');
//                 },


//                 buttons: [
//                     {
//                         label: '<span vslang="buttons.Cancel"></span>',
//                         cssClass: 'btn btn-secondary',
//                         click: (me, btn) => {
//                             me.hide(false);
//                         },
//                     },
//                     {
//                         label: '<span vslang="buttons.Save"></span>',
//                         cssClass: 'btn btn-primary',
//                         click: (me, btn) => {
//                             const op = me.getData();
//                             op.id = me.dataOptions.id;
//                             vsapi.call([main_view.base_url, "/prm/vendor/save",].join(""), op, btn, null).then((res) => {
//                                 if (res.status_code === 200) {
//                                     me.hide(true, op);
//                                     if (me.dataOptions.id > 0) {
//                                         cv_interact.success(
//                                             "Vendor has been updated successfully"
//                                         );
//                                     } else {
//                                         cv_interact.success(
//                                             "New vendor has been added successfully"
//                                         );
//                                     }
//                                 } else {
//                                     cv_interact.error(res.error_message);
//                                 }
//                             });
//                         },
//                     },
//                 ],
//             });
//         dialog.show(op);
//     };
//     return self;
// };




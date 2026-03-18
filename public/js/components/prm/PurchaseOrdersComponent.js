"use strict";

var PurchaseOrdersComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Purchase Orders";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_purchases_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnPurchases");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_purchases");
    mThis.elFilter_vendor = mThis.self.querySelector('#_po_vendor_id');
    mThis.elFilter_status = mThis.self.querySelector('#_po_status_id');
    mThis.elSearch = mThis.self.querySelector("#_po_search");
    let PurchaseOrderDialog = null;

//     mThis.itemColumns = [
//       {
//           "name": "item_id",
//           "transTitle": "Item",
//           "dataType": "string",
//           "displayType": "select",
//         //   "width": "250px",
//         //   "valueField":"value",
//         //   "textField":"label",
//           // "formatter":(data,col,td)=>{
//           //     return ['<span class="d-block p-1 border-primary rounded-3 w-100 h-100">',data.text,'</span>'].join('');
//           // }
//       },
//       {
//           "name": "qty",
//           "title": "QTY",
//           "width": "100px",
//           "dataType": "number",
//           "displayType": "input",
//       },
//       {
//       "name": "unit_price",
//       "title": "Unit Price",
//       "currencySymbol": "$",
//       "width": "100px",
//       "dataType": "decimal",
//       "displayType": "input",
//       "visible":false
//     },
//     {
//       "name": "total",
//       "title": "Total Price",
//       "currencySymbol": "$",
//       "dataType": "decimal",
//       "width": "150px",
//       "displayType": "input",
//       "isNumeric":true,
//       "readOnly": true
//     },
//       // {
//       //     "name": "accepted_qty",
//       //     "title": "Accepted",
//       //     "width": "80px",
//       //     "dataType": "number",
//       //     "displayType": "input",
//       // },
//     //   {
//     //       "name": "uom",
//     //       "title": "UOM",
//     //       "dataType": "string",
//     //       "displayType": "input",
//     //       "readOnly": true,
//     //   },
//       // {
//       //     "name": "receipt_comment",
//       //     "title": "Remarks",
//       //     "dataType": "string"
//       //     //"readOnly": false
//       // }
//   ];
    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Po Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.po_number ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.vendor_name}</span>`;
            }
        },
        {
            title: "Po Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.po_date}</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status_id = data.status_id;
                let cls = 'badge text-warning bg-warning-subtle border border-warning';

                if (status_id == 1) {
                    cls = 'badge text-warning bg-warning-subtle border border-warning';
                }
                else if (status_id == 2) {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                else if (status_id == 3) {
                    cls = 'badge text-primary bg-primary-subtle border border-primary';
                }
                else if (status_id == 4) {
                    cls = 'badge text-info bg-info-subtle border border-info';
                }
                else if (status_id == 5) {
                    cls = 'badge text-dark bg-secondary-subtle border border-secondary';
                }
                else if (status_id == 6) {
                    cls = 'badge text-danger bg-danger-subtle border border-danger';
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
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
                    <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
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
            fetchApi: `${main_view.base_url}/prm/purchase/order/list-paginate`,
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
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
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
                    html: '<span class="ps-2 " vslang="titles.Modify Purchase Order"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_purchase_order"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Purchase Order"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_purchase_order"
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
    vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`,{
      id: d.id
    },null,false).then((res) => {
        let info = {};
        if(res.status_code === 200)
        {
            let data = res.data;
            info = data;
            //(3232,info);
        console.log(7777,info);
        }
        let html = ``;
        const tHead = `
          <thead>
              <tr>
                  <th class="text-nowrap">Code</th>
                  <th class="text-nowrap">Item</th>
                  <th class="text-nowrap">QTY</th>
                  <th class="text-nowrap">Unit</th>
                  <th class="text-nowrap">Unit Price</th>
                  <th class="text-nowrap">Total Price</th>
              </tr>
          </thead>
        `;
        let tBody = ``;
        if(info.length > 0){
          info.map(item => {
            tBody += `<tr>
                        <th class="text-nowrap">${item.code}</th>
                        <th class="text-nowrap">${item.item_name}</th>
                        <th class="text-nowrap">${item.qty}</th>
                        <th class="text-nowrap">${item.unit}</th>
                        <th class="text-nowrap">${item.unit_price}</th>
                        <th class="text-nowrap">${item.total_price}</th>
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
                        <input
                            name="vendor"
                            class="data-input form-control flex-grow-1"
                            data-field="vendor_id"
                            placeholder="">
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Phone</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="phone_number"
                            class="data-input form-control flex-grow-1"
                            data-field="phone_number"
                            placeholder="">
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Address</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="address"
                            class="data-input form-control flex-grow-1"
                            data-field="address"
                            placeholder="">
                    </div>


                </div>
                <div class="col-md-5">
                </div>
                <div class="col-md-3 mt-3 mt-md-0">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">PO Date</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input data-type="date"
                            name="po_date"
                            class="data-input form-control flex-grow-1"
                            data-field="po_date">
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold" style="min-width:90px;">PO Number</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="po_number"
                            class="data-input form-control flex-grow-1"
                            data-field="po_number"
                            placeholder="">
                    </div>
                </div>
                <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                    <div id="purchase_item_list" class="purchase-item-list"></div>
                </div>

        </div>
        `;
        },
        configSelect:[
            // {
            //     name: "vendor_id",
            //     data: "vendors",
            //     textField: "vendor_id",
            //     valueField: "id",
            // },
        ],
        contentCreated:(me)=>{
           me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                type: 'select',
                prefetch: true,
                query: {
                    from: 'vendors',
                    select: ['id', 'name', 'code', 'tax_number', 'phone_number', 'address'],
                    searchFields: { name: 'LIKE', phone_number: 'LIKE' }
                },
                columns: { name: 'Name', phone_number: 'Phone' },
                showColumnHeader: true,
                placeholder: 'Search vendor',
                onSelect: (vendor) => {
                    me._selectedVendorId = vendor.id;

                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`,
                    { vendor_id: vendor.id }, {})
                    .then(res => {
                        const d = res.data || {};
                        const v = d.vendor || {};

                        me.controls.vendor.value = v.name || '';
                        me.controls.phone_number.value = v.phone_number || '';
                        me.controls.address.value = v.address || '';
                         me._selectedVendorId = vendor.id;
                    });
                }
            });

            me.searchVendor.reset('');
            me.purchaseItemsView = new ItemsView('purchase_item_list', {
                columns: [
                    { name:"item_id", transTitle:"titles.Item", displayType:"select" },
                    { name:"qty", transTitle:"titles.Qty", dataType:"number", defaultValue:1, isNumeric:true },
                    { name:"unit", transTitle:"titles.Unit", displayType:"select" },
                    { name:"unit_price", transTitle:"titles.UnitPrice", dataType:"number", defaultValue:0, isNumeric:true },
                    { name:"total_price", transTitle:"titles.TotalPrice", readOnly:true, dataType:"number", isNumeric:true }
                ],
                calc:{ mode:"auto", qtyField:"qty", priceField:"unit_price", totalField:"total_price", currencyPrecision:2 },
                totalSummary:{ container:"#sum", showTax:false, allowDiscount:false, currency:"USD" },
                validateColumns: {item_id: "positive",qty: "positive",unit: "positive",unit_price: "positive"},
                tableClass:'table',
                showColumnHeaders: true,
                showAddLineButton: true,
                addLineButtonText: 'Add Item',
                onItemChange:async(row_id, item, col_name, td, tr) => {
                const p = {item_id : item.item_id || item.id, vendor_id : me.dataOptions.vendor_id || me.dataOptions.owner_id};
                const res = await vsapi.call(`${main_view.base_url}/prm/item/details`, p,false);
                const d = res.data ?? {};
                me.current_item = d;
                tr.dataset.code = d.code;
                },
                "keyup": (e, col_name, td) => {
                    const tr = td.parentNode;
                    const item = me.purchaseItemsView.getDataRow(tr,'code');
                },
            });
            me.purchaseItemsView.setSelectOptions("unit", [
                    { value: 1, label: "pcs" },
                    { value: 2, label: "kg" },
                    { value: 3, label: "box" },
                    { value: 4, label: "meter" },
                ],'',{value:'id', label:'Select unit'});
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
                  p.items = me.purchaseItemsView.getItems();

                //   p.items = me.purchaseItemsView.getItems(null,['item_id','qty','unit','unit_price','total_price']);
                  p.vendor_id =me._selectedVendorId;
                  console.log(4444,me._selectedVendorId);

                //   console.log(2,JSON.stringify(p,null,2));
                  vsapi.call(`${main_view.base_url}/prm/purchase/order/save`,p,false).then(res =>{
                      if(res.status_code ==200){
                        cv_interact.success('Created Purchase Order success!');
                        me.hide(true);
                        PoListView.showPage(getFilterData());
                      }else cv_interact.warning(res.error_message);
                  });
             }
           }
        ],
       onPrepareForm:(me,data)=>{
           //LocaleManager.translateZone(me.divModal); //This translation is done automatically
           const title = me.divModal.querySelector('.modal-title');
           title.innerHTML = `<h2 class="text-prm-custom text-start fw-bold">PURCHASE ORDER</h2>`;
           //   me.controls.merchant_name.textContent = data.merchant.name;
          me.purchaseItemsView.setSelectOptions('item_id',data.item,null);
          if(me.dataOptions.id){
            me.purchaseItemsView.setData(data.transfer.items,['sku','code']);
          }else
          me.clear();
       },
       prepareFormOptions:{
          modifyTitle: LocaleManager.trans("Edit Purchase Order","titles"),
          createTitle: LocaleManager.trans("Create Purchase Order","titles"),
          targetProp:"item_details",
          api:{
            endpoint:`${main_view.base_url}/prm/item/form-options`,
            params:(dataOptions)=>{
              return {id: dataOptions?.id, owner_id: dataOptions?.owner_id};
            }
          }
       }
    });

    PurchaseOrderDialog.show(op);
  };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, 'id', 'vendor', '', 'All Vendor', '');
                VSUtil.setComboItems(mThis.elFilter_status, d.po_statuses, 'id', 'name', '', 'All Statuses', '');
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




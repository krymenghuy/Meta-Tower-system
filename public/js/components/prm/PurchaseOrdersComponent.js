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
    let _currentEditPoId = null;

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
        if (!tblPo.id) tblPo.id = '_purchases_list_table';
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
                'btn_dropdown_vendor_action'
            ],
            onOpen: (container, detail_tr, parent_tr) => {
                const poId = parent_tr.dataset.id;
                if (!poId) return;
                renderPoItem({ id: poId }, container);
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
                    case 'modify_purchase_order': {
                        mThis.editPurchaseOrder(id, menuLink);
                        break;
                    }
                    case 'delete_purchase_order': {
                        mThis.deletePurchaseOrder(id, menuLink);
                        break;
                    }
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
    const renderPoItem = (po, container, onFinish) => {
        if (!container) return;
        const poId = po.id || po.po_id;
        if (!poId) {
            container.innerHTML = '<div class="alert alert-warning m-3">No purchase order selected.</div>';
            return;
        }
        container.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div><div class="small text-muted mt-1">Loading items...</div></div>';
        vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`, { id: poId, po_id: poId }, null, false)
            .then((res) => {
                const raw = res.data;
                const items = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : (Array.isArray(raw?.data) ? raw.data : []));
                const rows = items.map(item => `
                    <tr>
                        <td class="text-nowrap">${item.code ?? ''}</td>
                        <td class="text-nowrap">${item.item_name ?? ''}</td>
                        <td class="text-nowrap">${item.qty ?? ''}</td>
                        <td class="text-nowrap">${item.unit ?? ''}</td>
                        <td class="text-nowrap">${item.unit_price ?? ''}</td>
                        <td class="text-nowrap">${item.total_price ?? ''}</td>
                    </tr>
                `).join('');
                const tbody = items.length
                    ? rows
                    : '<tr><td colspan="6" class="text-center text-muted py-3">No items</td></tr>';
                container.innerHTML = `
                    <div class="p-3 rounded-3 table-responsive" style="background-color:#f8f9fa;">
                        <table class="table table-sm table-bordered mb-0 w-100">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-nowrap">Code</th>
                                    <th class="text-nowrap">Item</th>
                                    <th class="text-nowrap">QTY</th>
                                    <th class="text-nowrap">Unit</th>
                                    <th class="text-nowrap">Unit Price</th>
                                    <th class="text-nowrap">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>${tbody}</tbody>
                        </table>
                    </div>
                `;
                if (typeof onFinish === 'function') onFinish();
            })
            .catch(() => {
                container.innerHTML = '<div class="alert alert-danger m-3">Failed to load purchase order items.</div>';
            });
    };

    mThis.editPurchaseOrder = (id, menuLink) => {
        let poId = id;
        if (!poId && menuLink) {
            const btn = typeof menuLink === 'object' && menuLink.target ? menuLink.target : menuLink;
            const el = (btn && btn.closest) ? btn.closest('[data-id]') : null;
            if (el && el.dataset && el.dataset.id) poId = el.dataset.id;
            const row = (btn && btn.closest) ? btn.closest('tr') : null;
            if (!poId && row && row.dataset && row.dataset.id) poId = row.dataset.id;
        }
        const op = {
            id: poId || id,
            btn: menuLink,
            onClose: () => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        };
        showPurchaseOrderDialog(op);
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

        showPurchaseOrderDialog(op);
    }
    mThis.deletePurchaseOrder = (id, menuLink) => {
        cv_interact.confirm('Delete this Purchase Order?', {
            transTitle: 'Delete Purchase Order',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/purchase/order/delete`, { id: id }, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        cv_interact.success(res.message || 'Purchase order has been deleted.');
                        mThis.PoListView.showPage(mThis.getFilterData());
                    } else {
                        cv_interact.error(res.error_message || 'Failed to delete purchase order.');
                    }
                });
            }
        });
    };

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
    const loadPurchaseOrderForEdit = (me, editPoId) => {
        if (!me || !editPoId) return Promise.resolve(null);
        if (!me.purchaseItemsView || typeof me.purchaseItemsView.setData !== 'function') {
            return Promise.reject(new Error('Purchase items view is not initialized'));
        }
        // Always reload on open to avoid stale/empty state after hard refresh or dialog reuse.

        return vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`, { id: editPoId }, null, false)
            .then(formRes => {
                if (!formRes || formRes.status_code !== 200) {
                    throw new Error(formRes?.error_message || 'Failed to load purchase order details');
                }
                const titleEl2 = me.divModal && me.divModal.querySelector('.modal-title');
                if (titleEl2) titleEl2.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order</h2>';

                const formData = formRes.data || {};
                const poDetails = formData.po_details || {};
                const vendors = formData.vendors || [];
                const vendorId = poDetails.vendor_id;
                const vendor = vendors.find(v => Number(v.id) === Number(vendorId));

                if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                if (me.controls.vendor) me.controls.vendor.value = vendor ? (vendor.vendor || vendor.name || vendor.vendor_name || vendor.code || '') : '';
                if (me.controls.po_date) me.controls.po_date.value = poDetails.po_date || '';
                if (me.controls.po_number) me.controls.po_number.value = poDetails.po_number || '';

                me._selectedVendorId = vendorId;

                if (vendorId && (me.controls.phone_number || me.controls.address)) {
                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                        .then(r => {
                            const v = (r.data || {}).vendor || {};
                            if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                            if (me.controls.address) me.controls.address.value = v.address || '';
                        })
                        .catch(() => {});
                }

                // ensure item select options are ready when binding rows
                if (me._itemOptions && me.purchaseItemsView?.setSelectOptions) {
                    const normalizedItemOptions = (me._itemOptions || []).map(o => {
                        const v = o?.id ?? o?.value ?? o?.item_id;
                        const l = o?.name ?? o?.label ?? o?.item_name;
                        return { id: v, value: v, name: l, label: l };
                    });
                    me.purchaseItemsView.setSelectOptions('item_id', normalizedItemOptions, null);
                }

                return vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`, { id: editPoId, po_id: editPoId }, null, false);
            })
            .then(itemsRes => {
                if (!itemsRes || itemsRes.status_code !== 200) {
                    throw new Error(itemsRes?.error_message || 'Failed to load purchase order items');
                }
                const raw = itemsRes.data;
                const items = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : (Array.isArray(raw?.data) ? raw.data : []));
                const unitByName = { pcs: 1, kg: 2, box: 3, meter: 4 };

                const rows = items.map(it => {
                    const unitNum = Number(it.unit);
                    const unitValue = (unitNum >= 1 && unitNum <= 4) ? unitNum : (unitByName[String(it.unit).toLowerCase()] ?? it.unit);
                    return {
                        item_id: it.item_id,
                        qty: it.qty,
                        unit: unitValue,
                        unit_price: it.unit_price || 0,
                        total_price: it.total_price || (Number(it.qty) * Number(it.unit_price || 0)),
                        code: it.code || ''
                    };
                });

                // ItemsView implementations differ; `setData()` does not always bind into the grid.
                // Prefer rebuilding via `addRow()` when available (used elsewhere, e.g. InvoiceComponent).
                if (typeof me.purchaseItemsView.addRow === 'function') {
                    if (typeof me.purchaseItemsView.setData === 'function') me.purchaseItemsView.setData(null);
                    rows.forEach(r => me.purchaseItemsView.addRow(r));
                } else {
                    me.purchaseItemsView.setData(rows);
                }
                // Remove the initial empty row if the grid auto-creates one.
                if (typeof me.purchaseItemsView.getItems === 'function' && typeof me.purchaseItemsView.setData === 'function') {
                    const cur = me.purchaseItemsView.getItems() || [];
                    const cleaned = cur.filter((it) => {
                        const itemId = String(it?.item_id ?? '').trim();
                        const qty = Number(it?.qty ?? 0);
                        const price = Number(it?.unit_price ?? it?.price ?? 0);
                        return itemId !== '' || qty > 0 || price > 0;
                    });
                    if (cleaned.length !== cur.length) {
                        me.purchaseItemsView.setData(cleaned);
                    }
                }
                if (typeof me.purchaseItemsView.render === 'function') me.purchaseItemsView.render();
                if (typeof me.purchaseItemsView.refresh === 'function') me.purchaseItemsView.refresh();
                if (typeof me.purchaseItemsView.draw === 'function') me.purchaseItemsView.draw();
                if (typeof me.updatePOTotals === 'function') me.updatePOTotals();
                if (!items.length) {
                    cv_interact.warning('This purchase order has no items (items-by-po returned empty).');
                }
                if (me.purchaseItemsView?.getItems) {
                    console.log('[PO] ItemsView getItems after setData', me.purchaseItemsView.getItems());
                }
                return items;
            });
    };
    PurchaseOrderDialog = PurchaseOrderDialog || new GeneralDialog({
        cssClass:"modal-xl vs-modal",
        override: {
            // Prevent GeneralDialog.setData() from clearing ItemsView row inputs/selects.
            // GeneralDialog's default setData targets all `.data-input` elements; ItemsView uses similar controls.
            setData: (dlg, data) => {
                data = data || {};
                const rootEl = dlg?.divModal;
                if (!rootEl || !rootEl.querySelectorAll) return;

                rootEl.querySelectorAll('.data-input').forEach((el) => {
                    if (el.closest && el.closest('#purchase_item_list')) return;
                    const field = el.dataset?.field || el.getAttribute('name');
                    if (!field) return;
                    const val = data[field] ?? '';
                    if (el.tagName === 'SELECT') {
                        el.value = val;
                        el.dispatchEvent(new Event('change'));
                    } else if (el.tagName === 'IMG') {
                        el.setAttribute('src', val);
                    } else {
                        el.value = val;
                    }
                });
            },
        },
        createContent:()=>{
          return `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Vendor</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input
                            name="vendor"
                            class="form-control flex-grow-1"
                            placeholder="">
                        <input type="hidden"
                            name="vendor_id"
                            class="data-input"
                            data-field="vendor_id">
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
                <div class="col-lg-12 mt-3 d-flex justify-content-end">
                    <div class="p-3 rounded-3 shadow-sm border" style="background-color:#fff; min-width:280px;">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Sub Total</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="po_subtotal_display" class="ms-2">$ 0.00</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Discount</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="number" name="discount_value" class="data-input form-control ms-2" data-field="discount_value" style="width:80px" value="0" min="0" step="0.01" placeholder="0">
                            <select name="discount_type" class="data-input form-control ms-1" data-field="discount_type" style="width:60px">
                                <option value="percent">%</option>
                                <option value="amount">$</option>
                            </select>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Tax</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="po_tax_display" class="ms-2">$ 0.00</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Total</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="po_total_display" class="ms-2 fw-bold">$ 0.00</span>
                        </div>
                    </div>
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
            const applyVendorInfo = (vendorId) => {
                me._selectedVendorId = vendorId || '';
                if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                if (!vendorId) {
                    if (me.controls.phone_number) me.controls.phone_number.value = '';
                    if (me.controls.address) me.controls.address.value = '';
                    return;
                }
                vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                    .then(res => {
                        const d = res.data || {};
                        const v = d.vendor || {};
                        if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                        if (me.controls.address) me.controls.address.value = v.address || '';
                    })
                    .catch(() => {});
            };

            // Keep the same dropdown UI style as screenshot (VSSearchInput),
            // but source data from purchase order form-options vendors list.
            if (me.controls.vendor) {
                me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                    type: 'select',
                    prefetch: true,
                    minChars: 0,
                    api: {
                        endpoint: `${main_view.base_url}/prm/purchase/order/form-options`,
                    },
                    processResponse: (res) => {
                        const vendors = res?.data?.vendors || [];
                        return (Array.isArray(vendors) ? vendors : []).map(v => ({
                            ...v,
                            vendor: v.vendor || v.name || v.vendor_name || v.code || '',
                            phone_number: v.phone_number || v.contact_phone || v.phone || ''
                        }));
                    },
                    columns: { vendor: 'VENDOR', phone_number: 'PHONE' },
                    showColumnHeader: true,
                    placeholder: 'Search vendor',
                    onSelect: (vendor) => {
                        const id = vendor?.id || '';
                        me.controls.vendor.value = vendor?.vendor || '';
                        applyVendorInfo(id);
                    }
                });

                // prefill in modify mode
                if (me._selectedVendorId) {
                    applyVendorInfo(me._selectedVendorId);
                }
            }
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
                onItemChange: async (row_id, item, col_name, td, tr) => {
                    if (typeof me.updatePOTotals === 'function') me.updatePOTotals();

                    if (col_name !== 'item_id') return;

                    const itemId = item.item_id || item.id;
                    if (!itemId) return;

                    const res = await vsapi.call(`${main_view.base_url}/prm/item/details`, {
                        item_id: itemId,
                        vendor_id: me.dataOptions.vendor_id || me.dataOptions.owner_id
                    }, false);
                    const itemDetails = res.data || {};
                    me.current_item = itemDetails;
                    tr.dataset.code = itemDetails.code || '';

                    if (!itemDetails.unit || !me.purchaseItemsView.setCellValue) return;

                    const unitByName = { pcs: 1, kg: 2, box: 3, meter: 4 };
                    const unitNum = Number(itemDetails.unit);
                    const unitValue = (unitNum >= 1 && unitNum <= 4) ? unitNum : (unitByName[String(itemDetails.unit).toLowerCase()] ?? itemDetails.unit);
                    me.purchaseItemsView.setCellValue(tr, 'unit', unitValue);

                    if (typeof me.updatePOTotals === 'function') me.updatePOTotals();
                },
                "keyup": (e, col_name, td) => {
                    const tr = td.parentNode;
                    const item = me.purchaseItemsView.getDataRow(tr,'code');
                },
            });
            const itemListEl = me.divModal.querySelector('#purchase_item_list');
            if (itemListEl) {
                itemListEl.addEventListener('input', () => { if (typeof me.updatePOTotals === 'function') me.updatePOTotals(); });
                itemListEl.addEventListener('change', () => { if (typeof me.updatePOTotals === 'function') me.updatePOTotals(); });
            }
            me.purchaseItemsView.setSelectOptions("unit", [
                    { value: 1, label: "pcs" },
                    { value: 2, label: "kg" },
                    { value: 3, label: "box" },
                    { value: 4, label: "meter" },
                ],'',{value:'id', label:'Select unit'});
            const formatMoney = (n) => '$ ' + (Number(n).toFixed(2));
            me.updatePOTotals = () => {
                if (!me.divModal || !me.purchaseItemsView) return;
                const items = me.purchaseItemsView.getItems ? me.purchaseItemsView.getItems() : [];
                let subTotal = 0;
                if (Array.isArray(items)) {
                    items.forEach(it => {
                        const t = Number(it.total_price) || (Number(it.qty) * Number(it.unit_price || 0));
                        subTotal += t;
                    });
                }
                const discountEl = me.controls.discount_value || me.divModal.querySelector('[data-field="discount_value"]');
                const discountTypeEl = me.controls.discount_type || me.divModal.querySelector('[data-field="discount_type"]');
                const discountVal = Number(discountEl?.value) || 0;
                const discountType = (discountTypeEl?.value || 'percent') === 'percent' ? 'percent' : 'amount';
                const discountAmount = discountType === 'percent' ? (subTotal * discountVal / 100) : discountVal;
                const afterDiscount = Math.max(0, subTotal - discountAmount);
                const taxAmount = 0;
                const total = afterDiscount + taxAmount;
                const subtotalEl = me.divModal.querySelector('#po_subtotal_display');
                const taxEl = me.divModal.querySelector('#po_tax_display');
                const totalEl = me.divModal.querySelector('#po_total_display');
                if (subtotalEl) subtotalEl.textContent = formatMoney(subTotal);
                if (taxEl) taxEl.textContent = formatMoney(taxAmount);
                if (totalEl) totalEl.textContent = formatMoney(total);
            };
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
                if (me.controls.discount_value) me.controls.discount_value.value = '0';
                if (me.controls.discount_type) me.controls.discount_type.value = 'percent';
                me.purchaseItemsView.setData(null);
                me.updatePOTotals();
            };
            ['discount_value', 'discount_type'].forEach(field => {
                const el = me.controls[field];
                if (el) {
                    el.addEventListener('input', () => me.updatePOTotals());
                    el.addEventListener('change', () => me.updatePOTotals());
                }
            });
            me.updatePOTotals();
        },
        onShow: (me) => {
            const editPoId = _currentEditPoId ?? me?._editPoId ?? (PurchaseOrderDialog && PurchaseOrderDialog._editPoId) ?? (me?.dataOptions && me.dataOptions.id);
            console.log('[PO] onShow', { editPoId, hasItemsView: !!me?.purchaseItemsView });
            if (!editPoId) return;

            const tryLoad = (attempt = 0) => {
                if (!me.purchaseItemsView || typeof me.purchaseItemsView.setData !== 'function') {
                    if (attempt === 0) console.log('[PO] waiting for purchaseItemsView...');
                    if (attempt < 60) return setTimeout(() => tryLoad(attempt + 1), 50);
                    return cv_interact.error('Purchase items view not ready.');
                }
                loadPurchaseOrderForEdit(me, editPoId)
                    .then((items) => console.log('[PO] loaded items', { editPoId, count: Array.isArray(items) ? items.length : null }))
                    .catch((err) => {
                        console.error('[PO] load failed', err);
                        cv_interact.error(err?.message || 'Failed to load purchase order for edit.');
                    });
            };

            // Run after GeneralDialog internal setData() which can clear [name] controls.
            setTimeout(() => tryLoad(0), 0);
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
                  p.vendor_id = me._selectedVendorId;
                  const savePoId = _currentEditPoId ?? me._editPoId ?? (me.dataOptions && me.dataOptions.id);
                  if (savePoId) p.id = savePoId;
                  vsapi.call(`${main_view.base_url}/prm/purchase/order/save`, p, false).then(res =>{
                      if (res.status_code == 200) {
                        cv_interact.success(savePoId ? 'Purchase order updated.' : 'Purchase order created.');
                        me.hide(true);
                        PoListView.showPage(getFilterData());
                      } else cv_interact.warning(res.error_message);
                  });
             }
           }
        ],
       onPrepareForm:(me,data)=>{
           const editPoId = _currentEditPoId ?? me._editPoId ?? (PurchaseOrderDialog && PurchaseOrderDialog._editPoId) ?? (me.dataOptions && me.dataOptions.id);
           const isModify = !!editPoId;
           const titleEl = me.divModal.querySelector('.modal-title');
           if (titleEl) {
               titleEl.innerHTML = isModify
                   ? '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order</h2>'
                   : '<h2 class="text-prm-custom text-start fw-bold">Create Purchase Order</h2>';
           }
           me._itemOptions = data.item || [];
           if (me.purchaseItemsView && me.purchaseItemsView.setSelectOptions) {
               me.purchaseItemsView.setSelectOptions('item_id', me._itemOptions, null);
           }
           // Only clear defaults when creating a new PO (not in modify mode).
           // `onPrepareForm` may run before `contentCreated`, so don't reset edit state here.
           if (!isModify) {
               _currentEditPoId = null;
               me.clear();
           }
       },
       prepareFormOptions:{
          modifyTitle: "Purchase Order",
          createTitle: "Purchase Order",
          targetProp:"item_details",
          api:{
            endpoint:`${main_view.base_url}/prm/item/form-options`,
            params:(dataOptions)=>{
              return { owner_id: dataOptions?.owner_id };
            }
          }
       }
    });

    _currentEditPoId = op.id || null;
    PurchaseOrderDialog._editPoId = op.id || null;
    PurchaseOrderDialog.show(op);
    if (op.id) {
        setTimeout(() => {
            const t = PurchaseOrderDialog.divModal && PurchaseOrderDialog.divModal.querySelector('.modal-title');
            if (t) t.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order</h2>';
        }, 250);
    }
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




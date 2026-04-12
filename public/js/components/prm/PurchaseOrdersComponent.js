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
    let ReceivePurchaseOrderDialog = null;
    // let BillDialog = null;

    mThis.cols = [
        { title: '', className: 'align-middle' },
        {
            transTitle: 'titles.Po Number',
            className: 'align-middle text-nowrap',
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.po_number ?? ''}</span>`,
        },
        {
            transTitle: 'titles.Vendor',
            className: 'align-middle text-nowrap',
            data: (data) => `<span class="d-block text-prm-custom">${data.vendor_name}</span>`,
        },
        {
            title: 'Po Date',
            className: 'align-middle text-nowrap',
            data: (data) => `<span class="text-prm-custom text-nowrap">${data.po_date}</span>`,
        },
        {
            title: "Subtotal",
            className: "align-middle text-nowrap text-end",
            data: (data) => {
                const sub_total = VSMoney.formatAmount(data.sub_total, data.currency_code ?? 'USD');
                const cls_color = data.sub_total > 0 ? 'text-prm-custom' : 'text-danger';
                return `<span class="d-block ${cls_color}">${sub_total}</span>`;
            }
        },
        {
            title: "Discount",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<div class="d-flex justify-content-center"><span class='text-nowrap text-center'>${
                    data.discount_type === "percent"
                        ? data.discount_value ? parseFloat(data.discount_value) + " %" : ""
                        : data.discount_value ? "$ " + parseFloat(data.discount_value).toFixed(2) : ""
                }</span></div>`;
            },
        },
        {
            title: "Grand Total",
            className: "align-middle text-nowrap text-end",
            data: (data) => {
                const cls_color = data.total_amount > 0 ? 'text-prm-custom' : 'text-danger';
                const total_amount = VSMoney.formatAmount(data.total_amount, data.currency_code ?? 'USD');
                return `<span class="${cls_color}">${total_amount}</span>`;
            }
        },
        {
            title: "Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'pending') cls = 'badge text-warning bg-warning-subtle border border-warning';
                else if (status === 'approved') cls = 'badge text-info bg-info-subtle border border-info';
                else if (status === 'ordered') cls = 'badge text-primary bg-primary-subtle border border-primary';
                else if (status === 'cancelled') cls = 'badge text-danger bg-danger-subtle border border-danger';
                else if (status === 'partially') cls = 'badge text-dark bg-warning-subtle border border-warning';
                else if (status === 'received') cls = 'badge text-success bg-success-subtle border border-success';
                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">${data.status ?? ''}</span>`;
            }
        },
        {
            title: "Remarks",
            className: "align-middle text-nowrap",
            data: (data) => {
                const remarks = String(data.remarks || '').trim();
                return `<span class="text-prm-custom d-block text-truncate" style="max-width:180px;" title="${remarks}">${remarks || '-'}</span>`;
            }
        },
        {
            title: "Authorized",
            className: 'align-middle text-nowrap text-center',
            data: (data) => {
                if (!data.authorizer) {
                    return `<div class="d-flex justify-content-start">
                        <a href="javascript:void(0)" class="authorized-po d-flex align-items-center gap-1 text-decoration-none text-primary"
                        data-id="${data.id}">
                            <span class="tool-tip">
                                <i class="fa-solid fa-user-clock fs-6"></i>
                                <span class="tool-tiptext fs-6">Authorize</span>
                            </span>
                        </a>
                    </div>`;
                }
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start">
                        ${data.authorizer}
                    </span>
                    <span class="text-start small text-muted">${data.auth_date ?? ''}</span>
                </div>`;
            }
        },
        {
            title: "Received",
            className: 'align-middle text-nowrap',
            data: (data) => {
                if (!data.receiver) return `<div class="text-muted small">Not yet</div>`;
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start">
                        <i class="fa-solid fa-box-check text-success me-1"></i>
                        ${data.receiver}
                    </span>
                    <span class="text-start small text-muted">${data.receive_date ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: 'titles.Updated By',
            className: 'align-middle text-nowrap',
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ''}</span>
                <span class="small text-muted">${data.updated_at ?? ''}</span>
            </div>`,
        },
        {
            transTitle: 'titles.Action',
            className: 'col_action align-middle',
            data: (data) => {
                return `<div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_purchase_action" 
                       data-id="${data.id}" 
                       data-authorized="${data.authorized}" 
                       data-statusid="${data.status_id}" 
                       aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`;
            }
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PoListView = new ListView('_purchases_list', {
            fetchApi: `${main_view.base_url}/prm/purchase/order/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            showPurchaseOrderDialog({
                id: null,
                btn: e.target,
                onClose: () => mThis.PoListView.showPage(mThis.getFilterData())
            });
        };

        const tblPo = mThis.PoListView.getTable();
        if (!tblPo.id) tblPo.id = '_purchases_list_table';

        mThis.initDropdownMenus(tblPo);

        tblPo.addEventListener('click', (e) => {
            const btn = e.target.closest('.authorized-po');
            if (btn) mThis.authorizedPurchaseOrder(btn.dataset.id, btn);
        });

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.PoListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }, 250);
        });

        new ExpandableRowConfig(tblPo.id, {
            dontExpandByClickingOn: ['dropdown-menu', 'btn_dropdown_purchase_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                renderPurchaseOrderItems({ po_id: parent_tr.dataset.id }, detail_tr.querySelector(".expandable-row-container"));
            },
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => ({
        vendor_id: mThis.elFilter_vendor.value,
        status_id: mThis.elFilter_status.value,
        search_value: mThis.elSearch.value,
    });

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_purchase_action",
            cssClass: "bg-white shadow",
            menus: [
                { html: '<span class="ps-2" vslang="titles.Modify PO"></span>', 
                  icon: `<i class="fa-solid fa-square-pen fs-5 text-warning"></i>`, 
                  cssClass: "border-bottom pb-2", 
                  name: "modify_purchase_order" 
                },
                { html: '<span class="ps-2" vslang="titles.Delete PO"></span>', 
                  icon: `<i class="fa-solid fa-rectangle-xmark fs-5 text-danger"></i>`, 
                  cssClass: "border-bottom pb-2", 
                  name: "delete_purchase_order"
                },
                { html: '<span class="ps-2" vslang="titles.Authorized PO"></span>', 
                  icon: `<i class="fa-solid fa-check-to-slot fs-5 text-primary"></i>`, 
                  cssClass: "border-bottom pb-2", 
                  name: "authorized_purchase_order" },
                { html: '<span class="ps-2" vslang="titles.Receive PO"></span>', 
                  icon: `<i class="fa-solid fa-box-open fs-5 text-success"></i>`, 
                  name: "receive_purchase_order" 
                },
                { html: '<span class="ps-2" vslang="titles.Generate Bill"></span>', 
                  icon: `<i class="fa-solid fa-file-invoice-dollar fs-5 text-success"></i>`, 
                  name: "generate_bill" 
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = Number(container.dataset.statusid);
                let allowed = [];

                if (status_id == 1) allowed = ["modify_purchase_order", "delete_purchase_order", "authorized_purchase_order", "generate_bill"];
                else if (status_id == 3 || status_id == 4) allowed = ["receive_purchase_order"];
                else if (status_id == 5) allowed = ["generate_bill"];

                Object.keys(menu).forEach(key => {
                    if (menu[key]?.style) {
                        menu[key].style.display = allowed.includes(menu[key].dataset.mnuaction) ? "block" : "none";
                    }
                });
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'modify_purchase_order': mThis.editPurchaseOrder(id, menuLink); break;
                    case 'delete_purchase_order': mThis.deletePurchaseOrder(id, menuLink); break;
                    case 'authorized_purchase_order': mThis.authorizedPurchaseOrder(id, menuLink); break;
                    case 'receive_purchase_order': mThis.receivePurchaseOrder(id, menuLink); break;
                    case 'generate_bill': mThis.generateBill(id, menuLink); break;
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.generateBill = (po_id, menuLink) => {
        vsapi.call(`${main_view.base_url}/prm/purchase/order/po-form-options`, { id: po_id }, false)
            .then(res => {
                if (res.status_code !== 200) {
                    cv_interact.error(res.error_message || 'Failed to load Purchase Order data.');
                    return;
                }

                const po = res.data?.po_detail || {};

                const prefill = {
                    vendor_id:    po.vendor_id || '',
                    vendor_name:  po.name || po.vendor_name || '',
                    phone_number: po.phone_number || '',
                    bill_date:    po.po_date || '',
                    ref_no:       po.po_number || '',
                    total_amount: po.total_amount || 0,
                    remark:       po.remarks || `Generated from Purchase Order #${po.po_number || po_id}`
                };

                const op = {
                    id: null,
                    btn: menuLink,
                    prefill: prefill,
                    onClose: () => mThis.PoListView.showPage(mThis.getFilterData())
                };

                if (!BillDialog) {
                    cv_interact.error("Bill Dialog is not available.");
                    return;
                }

                BillDialog.show(op);
            })
            .catch(() => {
                cv_interact.error("Failed to generate bill from Purchase Order.");
            });
    };

    mThis.receivePurchaseOrder = (id, menuLink) => {
        showReceivePurchaseOrderDialog({ id: id, btn: menuLink });
    };

    mThis.authorizedPurchaseOrder = (id, btn) => {
        if (btn.dataset.authorized == 2) {
            cv_interact.warning('You already authorized this Purchase order.');
            return;
        }
        cv_interact.confirm('Are you sure you want to authorize this purchase order?', {
            title: 'Authorize Purchase order',
            context: 'update',
            confirmButtonText: 'Authorize'
        }, (e) => {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/purchase/order/authorized`, { po_id: id }, false)
                    .then(res => {
                        if (res.status_code === 200) {
                            mThis.PoListView.showPage(mThis.getFilterData());
                            cv_interact.success('Purchase Order has been authorized!');
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        });
    };

    mThis.editPurchaseOrder = (id, menuLink) => {
        showPurchaseOrderDialog({
            id: id,
            btn: menuLink,
            onClose: () => mThis.PoListView.showPage(mThis.getFilterData())
        });
    };

    mThis.deletePurchaseOrder = (id, menuLink) => {
        cv_interact.confirm('Delete this Purchase Order?', {
            transTitle: 'Delete Purchase Order',
            context: 'delete',
            confirmButtonText: "Delete"
        }, (e) => {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/purchase/order/delete`, { id: id }, false)
                    .then(res => {
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

    const showPurchaseOrderDialog = (op) => {
        PurchaseOrderDialog = PurchaseOrderDialog || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            createContent: () => {
                return `<div class="row">
                    <div class="col-md-4">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Vendor</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                            <input type="text" name="vendor" class="data-input form-control flex-grow-1">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Phone</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="phone_number" class="data-input form-control flex-grow-1">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Address</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="address" class="data-input form-control flex-grow-1">
                        </div>
                    </div>
                    <div class="col-md-5"></div>
                    <div class="col-md-3 mt-3 mt-md-0">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">PO Date</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input data-type="date" name="po_date" class="data-input form-control flex-grow-1">
                        </div>
                    </div>
                    <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                        <div name="purchaseItemList" class="purchase-item-list"></div>
                    </div>
                    <div class="col-lg-12 mt-3 d-flex justify-content-end">
                        <div name="div_purchase_summary"></div>
                    </div>
                </div>`;
            },
            contentCreated: (me) => {

                me.controls.div_purchase_summary = me.divModal.querySelector(
                    '[name="div_purchase_summary"]'
                );

                const applyVendorInfo = (vendorId) => {
                    me._selectedVendorId = vendorId || '';
                    if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                    if (!vendorId) {
                        me.controls.phone_number.value = '';
                        me.controls.address.value = '';
                        return;
                    }
                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                        .then(res => {
                            const d = res.data || {};
                            const v = d.vendor || {};
                            if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                            if (me.controls.address) me.controls.address.value = v.address || '';
                        })
                        .catch(() => { });

                };
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
                            phone_number: v.phone_number || v.contact_phone || v.phone || '',
                            address: v.address || ''
                        }));
                    },
                    columns: { vendor: 'VENDOR', phone_number: 'PHONE' },
                    showColumnHeader: true,
                    placeholder: 'Search vendor',
                    onSelect: (vendor) => {
                        const id = vendor?.id || '';
                        me.controls.vendor.value = vendor?.vendor || '';
                        me.vendor_id = id;
                        applyVendorInfo(id);
                    }
                });
                if (me._selectedVendorId) {
                        applyVendorInfo(me._selectedVendorId);
                    }
               

                me.purchaseItemsView = new ItemsView(me.controls.purchaseItemList, {
                    currencyCode: "USD",
                    columns: [
                        { name: "item_id", transTitle: "titles.Item", displayType: "select" },
                        { name: "qty", transTitle: "titles.Qty", dataType: "number", defaultValue: 1, isNumeric: true },
                        { name: "unit", transTitle: "titles.Unit", dataType: "string", displayType: "number", readOnly: true },
                        { name: "unit_price", transTitle: "titles.Price", dataType: "decimal",displayType:"input",currencySymbol: "$" },
                        { name: "total_price", transTitle: "titles.Total",dataType: "decimal",displayType:"input",currencySymbol: "$" },

                    ],
                    calc: { mode: "auto", qtyField: "qty", priceField: "unit_price", totalField: "total_price", currencyPrecision: 2 },

                    totalSummary: { container: me.controls.div_purchase_summary, showTax: false, allowDiscount: true, discountBeforeTax: true, currency: "USD" },
                    validateColumns: { item_id: "positive", qty: "positive", unit_price: "positive" },
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: true,
                    addLineButtonText: 'Add Item',
                    onItemChange: async (row_id, item, col_name, td, tr) => {
                        if (col_name !== 'item_id') return;
                        const itemId = item.item_id || item.id;
                        if (!itemId) return;
                        const res = await vsapi.call(
                            `${main_view.base_url}/prm/item/details`,
                            { id: itemId },
                            false
                        );

                        const d = res.data ?? {};
                        console.log(123,d);
                        
                        tr.dataset.code = d.code || '';
                        me.setTotal(col_name, tr, d);
                    },
                    "keyup": (e, col_name, td) => {
                        const tr = td.parentNode;
                        const item = me.purchaseItemsView.getDataRow(tr, ['code']);
                        me.setTotal(col_name, tr, item);
                    },
                });
               
                me.saveData = (onFinish) => {
                    let p = me.getData();
                    let po_data = me.purchaseItemsView.getData();
                    let items = po_data.items || [];
                   if (!me.hasValidPOItems(items)) {
                        return cv_interact.error('Please select at least one item before saving the purchase order.');
                    }
                    p.items = items;
                    p.totals = po_data.totals;
                    p.id = me.dataOptions.id;

                    console.log(6666, p);

                    vsapi.call(`${main_view.base_url}/prm/purchase/order/save`, p, false)
                        .then(onFinish);
                }
                me.clear = () => {
                    for (const name in me.fields) {
                        const el = me.fields[name];
                        const tag = el.tagName;

                        if (['SELECT', 'INPUT', 'TEXTAREA'].indexOf(tag) >= 0) {
                            el.value = '';
                        }
                        else {
                            el.textContent = '';
                        }
                    }
                    me.purchaseItemsView.setData(null);
                };
                me.setTotal = (col_name, tr,item) => {
                    if (!tr) return;
                    console.log(1233322,item);
                    
                    const d = me.purchaseItemsView.getDataRow(tr);
                    me.purchaseItemsView.setCellValue(tr, 'unit', item.unit || '');
                
                };
                me.hasValidPOItems = (items) => {
                    if (!Array.isArray(items) || items.length === 0) return false;

                    return items.some((row) => {
                        const rawId = row?.item_id || row?.id;
                        const qty = Number(row?.qty);

                        const id = Number(rawId);

                        return Number.isFinite(id) && id > 0 && Number.isFinite(qty) && qty > 0;
                    });
                };
            },
            buttons: [
                { label: "Cancel", cssClass: "btn btn-warning", click: (me) => me.hide(false) },
                { 
                    label: "<span>Save</span>", 
                    cssClass: "btn btn-primary", 
                    click: (me) => {
                        me.saveData(res => {
                            if (res.status_code == 200) {
                                cv_interact.success("New purchase order has been added successfully");
                                me.hide(true);
                                mThis.PoListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                },
            ],
            onPrepareForm: (me, data) => {
                me.controls.vendor.value = data.po_detail?.name || '';
                me.purchaseItemsView.setSelectOptions('item_id',data.item_options,null);
                if (me.dataOptions.id) {
                    console.log(8888,data);
                     me.purchaseItemsView.setData(data.po_detail);
                    // me.purchaseItemsView.setData({
                    //     currency_code: data.po_detail?.currency_code || "USD",
                    //     items: data.items || [],
                    //     totals: data.totals || {
                    //         discount_type: "amount",
                    //         discount_value: 0,
                    //         extra_items: {}
                    //     }
                    // });

                } else {
                    me.clear();
                    if (me.searchVendor && typeof me.searchVendor.reset === 'function') {
                        me.searchVendor.reset();
                    }
                }
            },
            onShow: (me) => {
                const title = me.divModal.querySelector('.modal-title');
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order</h2>'
                        : '<h2 class="text-prm-custom text-start fw-bold">Purchase Order</h2>';
                }
            },
            prepareFormOptions: {
                modifyTitle: "Modify Purchase Order",
                createTitle: "Purchase Order",
                targetProp: "po_detail",
                api: {
                    endpoint: `${main_view.base_url}/prm/purchase/order/po-form-options`,
                    params: (op) => ({ id: op.id })
                }
            }
        });

        PurchaseOrderDialog.show(op);
    };

    const showReceivePurchaseOrderDialog = (op) => {
        ReceivePurchaseOrderDialog = ReceivePurchaseOrderDialog || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            createContent: () => {
                return `<div class="row">
                    <div class="col-md-4">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Vendor</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                            <input type="text" name="vendor" class="data-input form-control flex-grow-1">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Phone</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="phone_number" class="data-input form-control flex-grow-1">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Address</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="address" class="data-input form-control flex-grow-1">
                        </div>
                    </div>
                    <div class="col-md-5"></div>
                    <div class="col-md-3 mt-3 mt-md-0">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">PO Date</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input data-type="date" name="po_date" class="data-input form-control flex-grow-1">
                        </div>
                    </div>
                    <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                        <div name="purchaseItemList" class="purchase-item-list"></div>
                    </div>
                    <div class="col-lg-12 mt-3 d-flex justify-content-end">
                        <div name="div_purchase_summary"></div>
                    </div>
                </div>`;
            },
            // Note: Receive dialog contentCreated and other logic can be added similarly if needed
            buttons: [
                { label: "Cancel", 
                  cssClass: "btn btn-warning", 
                  click: (me) => me.hide(false) 
                },
                { label: "<span>Save</span>", 
                  cssClass: "btn btn-primary", 
                  click: (me) => me.hide(true)
                },
            ],
            prepareFormOptions: {
                api: {
                    endpoint: `${main_view.base_url}/prm/purchase/order/po-form-options`,
                    params: (op) => ({ id: op.id })
                }
            }
        });

        ReceivePurchaseOrderDialog.show(op);
    };

    const renderPurchaseOrderItems = (d, elBody) => {
        vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`, { po_id: d.po_id }, null, false)
            .then((res) => {
                let html = '';
                const tHead = `<thead class="text-primary"><tr>
                    <th class="text-nowrap">Code</th>
                    <th class="text-nowrap">Name</th>
                    <th class="text-nowrap">Price</th>
                    <th class="text-nowrap">QTY</th>
                    <th class="text-nowrap">Amount</th>
                </tr></thead>`;

                let tBody = '';
                const items = res.data || [];
                if (items.length > 0) {
                    items.forEach(item => {
                        tBody += `<tr>
                            <td class="text-nowrap">${item.item_code || item.code || ''}</td>
                            <td class="text-nowrap">${item.item_name}</td>
                            <td class="text-nowrap">${VSMoney.formatAmount(item.unit_price || 0, 'USD')}</td>
                            <td class="text-nowrap">${item.qty} <small>${item.unit ?? 'pcs'}</small></td>
                            <td class="text-nowrap">${VSMoney.formatAmount(item.total_price || 0, 'USD')}</td>
                        </tr>`;
                    });
                }

                html = `<table class="table">${tHead}<tbody>${tBody}</tbody></table>`;
                elBody.innerHTML = html;
                elBody.classList.add('p-3', 'table-responsive');
            });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, 'id', 'vendor', '', 'All Vendor', '');
                VSUtil.setComboItems(mThis.elFilter_status, d.po_statuses, 'id', 'name', '', 'All Statuses', '');
                if (typeof onFinish === 'function') onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.PoListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();
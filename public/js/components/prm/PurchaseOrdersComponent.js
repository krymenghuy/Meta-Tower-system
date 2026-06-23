"use strict";

var PurchaseOrdersComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Purchase Orders";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_purchases_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnPurchases");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_purchases");
    mThis.elFilter_building = mThis.self.querySelector('#_po_building_id');
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
            transTitle: 'titles.Po Date',
            className: 'align-middle text-nowrap',
            data: (data) => `<span class="text-prm-custom text-nowrap">${data.po_date}</span>`,
        },
        // {
        //     transTitle: 'titles.Subtotal',
        //     className: "align-middle text-nowrap text-end",
        //     data: (data) => {
        //         const sub_total = VSMoney.formatAmount(data.sub_total, data.currency_code ?? 'USD');
        //         const cls_color = data.sub_total > 0 ? 'text-prm-custom' : 'text-danger';
        //         return `<span class="d-block ${cls_color}">${sub_total}</span>`;
        //     }
        // },
        // {
        //     transTitle: 'titles.Discount',
        //     className: "align-middle text-nowrap",
        //     data: (data) => {
        //         return `<div class="d-flex justify-content-center"><span class='text-nowrap text-center'>${
        //             data.discount_type === "percent"
        //                 ? data.discount_value ? parseFloat(data.discount_value) + " %" : ""
        //                 : data.discount_value ? "$ " + parseFloat(data.discount_value).toFixed(2) : ""
        //         }</span></div>`;
        //     },
        // },
        {
            transTitle: 'titles.Total',
            className: "align-middle text-nowrap text-end",
            data: (data) => {
                const cls_color = data.total_amount > 0 ? 'text-prm-custom' : 'text-danger';
                const total_amount = VSMoney.formatAmount(data.total_amount, data.currency_code ?? 'USD');
                return `<span class="${cls_color}">${total_amount}</span>`;
            }
        },
        {
            transTitle: 'titles.Status',
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'pending') cls = 'badge text-warning bg-warning-subtle border border-warning';
                else if (status === 'approved') cls = 'badge text-info bg-info-subtle border border-info';
                else if (status === 'ordered') cls = 'badge text-info bg-info-subtle border border-info';
                else if (status === 'rejected') cls = 'badge text-danger bg-danger-subtle border border-danger';
                else if (status === 'partially') cls = 'badge text-primary bg-primary-subtle border border-primary';
                else if (status === 'received') cls = 'badge text-success bg-success-subtle border border-success';
                else if (status === 'cancelled') cls = 'badge text-dark bg-secondary-subtle border border-secondary';

                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">${data.status ?? ''}</span>`;
            }
        },
        {
            transTitle: 'titles.Remark',
            className: "align-middle text-nowrap",
           data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? '_'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: 'titles.Authorized',
            className: 'align-middle text-nowrap text-center',
            data: (data) => {
                if (!data.authorizer) {
                    return `<div class="d-flex justify-content-start">
                        <a href="javascript:void(0)" class="authorized-po d-flex align-items-center gap-1 text-decoration-none text-primary"
                        data-id="${data.id}">
                            <span class="tool-tip">
                                <i class="fa-solid fa-user-clock fs-6"></i>
                                <span class="tool-tiptext fs-6" >${LocaleManager.trans('Authorize','titles')}</span>
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
        // {
        //     transTitle: 'titles.Received',
        //     className: 'align-middle text-nowrap',
        //     data: (data) => {
        //         console.log(888,data);
                
        //         if (!data.receiver) return `<div class="text-muted small">Not yet</div>`;
        //         return `<div class="d-flex flex-column">
        //             <span class="text-capitalize text-start">
        //                 <i class="fa-solid fa-box-check text-success me-1"></i>
        //                 ${data.receiver}
        //             </span>
        //             <span class="text-start small text-muted">${data.receive_date ?? ''}</span>
        //         </div>`;
        //     }
        // },
       {
            transTitle: 'titles.Last Updated',
            className: 'align-middle text-nowrap',
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom">
                    ${data.update_user ?? '_'} : ${data.building_name ?? '_'}
                </span>
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
                       aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
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
            if (!AuthManager.allowed(269,false)) return;
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
            dontExpandByClickingOn: ['dropdown-menu','authorized-po', 'btn_dropdown_purchase_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                renderPurchaseOrderItems({ po_id: parent_tr.dataset.id }, detail_tr.querySelector(".expandable-row-container"));
            },
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => ({
        building_id: mThis.elFilter_building.value,
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
                {
                    html: '<span class="ps-2" vslang="titles.Reject PO"></span>',
                    icon: `<i class="fa-solid fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                    name: "reject_purchase_order",
                    cssClass: "border-bottom pb-2"
                },
                { html: '<span class="ps-2" vslang="titles.Delete PO"></span>',
                  icon: `<i class="fa-solid fa-trash fs-5 text-danger"></i>`,
                  cssClass: "border-bottom pb-2",
                  name: "delete_purchase_order"
                },
                { html: '<span class="ps-2" vslang="titles.Authorized PO"></span>',
                  icon: `<i class="fa-solid fa-check-to-slot fs-5 text-success"></i>`,
                  cssClass: "border-bottom pb-2",
                  name: "authorized_purchase_order" },
                { html: '<span class="ps-2" vslang="titles.Receive PO"></span>',
                  icon: `<i class="fa-solid fa-box-open fs-5 text-success"></i>`,
                  name: "receive_purchase_order"
                },
                // { html: '<span class="ps-2" vslang="titles.Generate Bill"></span>',
                //   icon: `<i class="fa-solid fa-file-invoice-dollar fs-5 text-primary"></i>`,
                //   name: "generate_bill"
                // },
               
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                let allowed = [];

                if (status_id == 1) allowed = ["modify_purchase_order", "delete_purchase_order", "authorized_purchase_order", "reject_purchase_order"];
                else if (status_id == 3 || status_id == 4) allowed = ["receive_purchase_order"];
                else if (status_id == 6 || status_id == 7) allowed = ["delete_purchase_order"];
                else if (status_id == 5) allowed = ["delete_purchase_order"];

                Object.keys(menu).forEach(key => {
                    if (menu[key]?.style) {
                        menu[key].style.display = allowed.includes(menu[key].dataset.mnuaction) ? "block" : "none";
                    }
                });
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'modify_purchase_order': mThis.editPurchaseOrder(id, menuLink); break;
                    case 'reject_purchase_order': mThis.rejectPurchaseOrder(id, menuLink); break;
                    case 'delete_purchase_order': mThis.deletePurchaseOrder(id, menuLink); break;
                    case 'authorized_purchase_order': mThis.authorizedPurchaseOrder(id, menuLink); break;
                    case 'receive_purchase_order': mThis.receivePurchaseOrder(id, menuLink); break;
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.rejectPurchaseOrder = (id, menuLink) => {
        let op ={
            po_id:id
        }
        if (!AuthManager.allowed(272,false)) return;
        Swal.fire({
            input: "textarea",
            inputLabel: " ",
            inputPlaceholder: "Please, enter new remark why reject this PO",
            reverseButtons: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if(!value)
                    return "Remark required!";
                else
                {
                    op.remarks = value;

                    vsapi.call(`${main_view.base_url}/prm/purchase/order/reject`,op,null).then((res) => {
                        if(res.status_code === 200)
                        {
                            cv_interact.success('reject_success_order');
                            mThis.PoListView.showPage(mThis.getFilterData());
                        }
                        else
                        {
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            },
        });
    };

    mThis.receivePurchaseOrder = (id, menuLink) => {
        showReceivePurchaseOrderDialog({ id: id, btn: menuLink });
    };

    mThis.authorizedPurchaseOrder = (id, btn) => {
        if (!AuthManager.allowed(273,false)) return;
        if (btn.dataset.authorized == 2) {
            cv_interact.warning('You already authorized this Purchase order.');
            return;
        }
        cv_interact.confirm('confirm_authorize', {
            title: 'Authorize Purchase order',
            context: 'update',
            confirmButtonText: 'Authorize'
        }, (e) => {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/purchase/order/authorized`, { po_id: id }, false)
                    .then(res => {
                        if (res.status_code === 200) {
                            mThis.PoListView.showPage(mThis.getFilterData());
                            cv_interact.success('authorized_purchase');
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        });
    };

    mThis.editPurchaseOrder = (id, menuLink) => {
        if (!AuthManager.allowed(270,false)) return;
        showPurchaseOrderDialog({
            id: id,
            btn: menuLink,
            onClose: () => mThis.PoListView.showPage(mThis.getFilterData())
        });
    };

    mThis.deletePurchaseOrder = (id, menuLink) => {
        if (!AuthManager.allowed(271,false)) return;
        cv_interact.confirm('confirm_delete', {
            'langSection':"message_box_default",
            'translate': true,
            'title': 'deleted',
            'context': 'delete',
            'confirmButtonText': "Delete"
        }, (e) => {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/purchase/order/delete`, { id: id }, false)
                    .then(res => {
                        if (res.status_code == 200) {
                            cv_interact.success('delete_success_order');
                            mThis.PoListView.showPage(mThis.getFilterData());
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        });
    };
    
    const showPurchaseOrderDialog = (op) => {
        PurchaseOrderDialog = PurchaseOrderDialog || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            title: (me) => {
                    const title = me.dataOptions.id ? "Modify Purchase Orders" : "Purchase Orders";
                    if (title) {
                       return  `<h4 class="text-white text-start">${LocaleManager.trans(title,'titles')}</h4>`;
                    }
                },
            createContent: () => {
                return `<div class="row">
                    <div class="col-md-4">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;"​ vslang="labels.Vendor"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                            <input type="text" name="vendor" class="data-input form-control flex-grow-1" Readonly>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Phone"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="phone_number" class="data-input form-control flex-grow-1" Readonly data-field="phone_number">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Address"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="address" class="data-input form-control flex-grow-1" Readonly data-field="address">
                        </div>
                    </div>
                    <div class="col-md-5"></div>
                    
                    <div class="col-md-3 mt-3 mt-md-0">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Building"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <div class="w-100"><select  name="building_id" data-style="material" class="data-input form-control" data-field="building_id" placeholder=" " >
                            </select></div>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.PO Date"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input data-type="date" name="po_date" class="data-input form-control flex-grow-1" data-field="po_date">
                        </div>
                    </div>
                    <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                        <div name="purchaseItemList" class="purchase-item-list"></div>
                    </div>
                    <div class="col-lg-12 my-3 d-flex justify-content-end">
                        <div name="div_purchase_summary"></div>
                    </div>
                    <div class="col-12">
                        <div class="vs-material-field">
                            <textarea class="data-input form-control" data-field="remarks" name="remarks" placeholder="" rows="1"></textarea>
                            <label vslang="labels.Remarks"></label>
                        </div>
                    </div>
                </div>`;
            },
            contentCreated: (me) => {
                // const today = new Date();

                // const dd = String(today.getDate()).padStart(2, '0');
                // const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                // const mm = months[today.getMonth()];
                // const yyyy = today.getFullYear();

                // const formattedDate = `${dd}-${mm}-${yyyy}`;

                // me.controls.po_date.value = formattedDate;
                // console.log(3335553,formattedDate);
                
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
                    ensureEmptyRow: false,
                    columns: [
                        { name: "item_id", transTitle: "titles.Item", displayType: "select" },
                        { name: "qty", transTitle: "titles.Order Qty", dataType: "number", defaultValue: 1, isNumeric: true },
                        { name: "unit", transTitle: "titles.Unit Type", dataType: "string", displayType: "number", readOnly: true },
                        { name: "unit_price", transTitle: "titles.Unit Price", dataType: "decimal",displayType:"input",currencySymbol: "$" },
                        { name: "total_price", transTitle: "titles.Total",dataType: "decimal", readOnly: true,displayType:"input",currencySymbol: "$" },

                    ],
                    calc: { mode: "auto", qtyField: "qty", priceField: "unit_price", totalField: "total_price", currencyPrecision: 2 },

                    totalSummary: { container: me.controls.div_purchase_summary, showTax: false, allowDiscount: false, discountBeforeTax: true, currency: "USD" },
                    validateColumns: { item_id: "positive", qty: "positive", unit_price: "positive" },
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: true,
                    addLineButtonText: LocaleManager.trans('Add Item', 'buttons'),
                    
                    onItemChange: async (iMe,ctx) => {
                        const item = ctx.item;
                        const tr = ctx.tr;
                        const itemId = item.item_id || item.id;
                        if (!itemId) return;
                        const res = await vsapi.call(
                            `${main_view.base_url}/prm/item/details`,
                            { id: itemId },
                            false
                        );

                        const d = res.data ?? {};
                        me.purchaseItemsView.setCellValue(tr, 'unit', d.unit || '');

                    },

                });


                me.saveData = (onFinish) => {
                    
                    let p = me.getData();
                    let items = me.purchaseItemsView.getItems();
                    let totals = me.purchaseItemsView.getCurrentTotals?.() || {};
                    // let items = po_data.items || [];
                    // if (!me.hasValidPOItems(items)) {
                    //     return cv_interact.error('Please select at least one item before saving the purchase order.');
                    // }
                    p.items = items;
                    p.totals = totals;
                    p.id = me.dataOptions.id;
                    
                    vsapi.call(`${main_view.base_url}/prm/purchase/order/save`, p, false)
                        .then(onFinish);
                };
                
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
                
                // me.hasValidPOItems = (items) => {
                //     if (!Array.isArray(items) || items.length === 0) return false;

                //     return items.some((row) => {
                //         const rawId = row?.item_id || row?.id;
                //         const qty = Number(row?.qty);

                //         const id = Number(rawId);

                //         return Number.isFinite(id) && id > 0 && Number.isFinite(qty) && qty > 0;
                //     });
                // };
                me.controls.purchaseItemList.addEventListener('input', (e) => {
                    const target = e.target;
                    if (!target.closest('td[data-name="unit_price"]')) return;

                    let v = target.value;
                    v = v.replace(/[^0-9.]/g, '');
                    const parts = v.split('.');
                    if (parts.length > 2) v = parts[0] + '.' + parts[1];
                    if (parts[1] !== undefined) v = parts[0] + '.' + parts[1].slice(0, 2);
                    target.value = v;
                });

                me.controls.purchaseItemList.addEventListener('blur', (e) => {
                    const target = e.target;
                    if (!target.closest('td[data-name="unit_price"]')) return;

                    let v = parseFloat(target.value);
                    if (isNaN(v) || v <= 0) {
                        target.value = '';
                        return;
                    }
                    target.value = v.toFixed(2);
                }, true);
            },
            buttons: [
                { 
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me) => {
                        const isUpdate = me.dataOptions?.id || 0 > 0;

                        me.saveData((res) => {
                            if (res?.status_code === 200) {
                                cv_interact.success(isUpdate ? "update_success_order"  : "create_success_order");
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
                me.purchaseItemsView.setSelectOptions('item_id', data.item_options, null);
                // const today = new Date();

                // const dd = String(today.getDate()).padStart(2, '0');
                // const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                // const mm = months[today.getMonth()];
                // const yyyy = today.getFullYear();

                // const formattedDate = `${dd}-${mm}-${yyyy}`;

                // me.controls.po_date.value = formattedDate;
                
                if (me.dataOptions.id) {
                    const po = data.po_detail || {};
                    me.controls.vendor.value = po.name || po.vendor_name || '';
                    if (po.vendor_id) {
                        me._selectedVendorId = po.vendor_id;
                        if (me.controls.vendor_id) me.controls.vendor_id.value = po.vendor_id;
                        // Trigger vendor info load (phone, address)
                        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: po.vendor_id }, {})
                            .then(res => {
                                const v = res.data?.vendor || {};
                                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                                if (me.controls.address) me.controls.address.value = v.address || '';
                            });
                    }

                    // if (po.po_date && me.controls.po_date) {
                    //     me.controls.po_date.value = po.po_date;
                    // }
                    me.purchaseItemsView.setData(po);

                   
                } else {
                    me.clear();
                    if (me.searchVendor && typeof me.searchVendor.reset === 'function') {
                        me.searchVendor.reset();
                    }
                }
            },
            // onShow: (me) => {
            //     const title = me.divModal.querySelector('.modal-title');
            //     if (title) {
            //         const isModify = !!me.dataOptions?.id;
            //         title.innerHTML = isModify
            //             ? '<h2 class="text-prm-custom text-start fw-bold" vslang="titles.Modify Purchase Order"></h2>'
            //             : '<h2 class="text-prm-custom text-start fw-bold" vslang="titles.Purchase Order"></h2>';
            //     }
            // },
            configSelect: [
                    
                    {
                        name: "building_id",
                        data: "buildings",
                        textField: "building",
                        valueField: "id",
                    },

                ],
            prepareFormOptions: {
                // modifyTitle: "Modify Purchase Order",
                // createTitle: "Purchase Order",
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
            title: (me) => {
                    const title = me.dataOptions.id ? "Receive Purchase Order" : "Purchase Orders";
                    if (title) {
                       return  `<h4 class="text-prm-custom text-start fw-bold">${LocaleManager.trans(title,'titles')}</h4>`;
                    }
            },
                    
            createContent: () => {
                return `<div class="row">
                    <div class="col-md-4">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Vendor"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                            <input type="text" name="vendor" class="data-input form-control flex-grow-1">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Phone"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="phone_number" class="data-input form-control flex-grow-1" Readonly data-field="phone_number">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Address"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="text" name="address" class="data-input form-control flex-grow-1" Readonly data-field="address">
                        </div>
                    </div>
                    <div class="col-md-5"></div>
                    <div class="col-md-3 mt-3 mt-md-0">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.Building"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <div class="w-100"><select  name="building_id" data-style="material" class="data-input form-control" data-field="building_id" placeholder=" " >
                            </select></div>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;" vslang="labels.PO Date"></span>
                            <span class="mx-2 fw-bold">:</span>
                            <input data-type="date" name="po_date" class="data-input form-control flex-grow-1" data-field="po_date">
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
                me.purchaseItemsView = new ItemsView(me.controls.purchaseItemList, {

                    currencyCode: "USD",
                    columns: [
                        { name: "item_id", transTitle: "titles.Item", displayType: "select",readOnly: true},
                        { name: "qty", transTitle: "titles.Ordered Qty", dataType: "number", defaultValue: 1,readOnly: true, isNumeric: true },
                        { name: 'received_qty', transTitle: 'Received Qty', dataType: 'number', defaultValue: 0,readOnly: false, isNumeric: true},
                        { name: "accept",transTitle: "titles.Accept",html: '<input type="checkbox" class="check_accept">'}

                    ],
                    // calc: { mode: "auto", qtyField: "qty", priceField: "unit_price", totalField: "total_price", currencyPrecision: 2 },

                    // totalSummary: { container: me.controls.div_purchase_summary, showTax: false, allowDiscount: true, discountBeforeTax: true, currency: "USD" },
                    validateColumns: { item_id: "positive", qty: "positive", receive_qty: "positive" },
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: false,
                    addLineButtonText: 'Add Item',
                    itemRendered: (iMe, ctx) => {

                        const tr = ctx.tr;
                        const data = ctx.data || {};

                        const checkbox = tr.querySelector(".check_accept");
                        const cell = tr.querySelector("[data-name='received_qty']");
                        const input = cell?.querySelector("input");

                        const receivedQty = Number(data.received_qty || 0);
                        const isReceived = receivedQty > 0;

                        if (checkbox) {
                            checkbox.checked = isReceived;
                            checkbox.disabled = isReceived;
                        }
                        if (input) {
                            input.readOnly = isReceived;
                            input.disabled = isReceived;
                        } else if (cell) {
                            if (isReceived) {
                                cell.classList.add("cell-disabled");
                            } else {
                                cell.classList.remove("cell-disabled");
                            }
                        }

                        iMe.setRowMeta(tr, {
                            received_qty: receivedQty,
                            checked: isReceived
                        });
                    },
                    onItemChange: (iMe, ctx) => {

                        const tr = ctx.tr;
                        const item = ctx.item || {};
                        if (ctx.fieldName === "received_qty") {
                            const checkbox = tr.querySelector(".check_accept");
                            const cell = tr.querySelector("[data-name='received_qty']");
                            const input = cell?.querySelector("input");
                            const receivedQty = Number(item.received_qty || 0);
                            const isReceived = receivedQty > 0;
                            if (checkbox) {
                                checkbox.checked = isReceived;
                                checkbox.disabled = isReceived;
                            }
                            if (input) {
                                input.readOnly = isReceived;
                                input.disabled = isReceived;
                            }
                            iMe.setRowMeta(tr, {
                                received_qty: receivedQty,
                                checked: isReceived
                            });
                        }
                    },
                });

                me.saveData = (onFinish) => {
                    let p = me.getData();
                    let items = me.purchaseItemsView.getItems();
                    // let totals = me.purchaseItemsView.getCurrentTotals?.() || {};
                    p.items = items;
                    p.id = me.dataOptions.id;
                    vsapi.call(`${main_view.base_url}/prm/purchase/order/receive`, p, false)
                        .then(onFinish);
                };
                
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
            
            },
            buttons: [
                { 
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me) => {
                        me.saveData(res => {
                            if (res.status_code == 200) {
                                cv_interact.success("receive_success_order");
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
                
                const isReadOnly = me.dataOptions.id > 0;
                me.setReadOnly(isReadOnly,['po_date','building_id']);
                me.controls.vendor.disabled = isReadOnly;
                me.controls.vendor.value = data.po_detail?.name || '';
                me.controls.building_id.value = data.po_detail?.building_id || '';
                me.purchaseItemsView.setSelectOptions('item_id', data.item_options, null);
                const today = new Date();

                const dd = String(today.getDate()).padStart(2, '0');
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                const mm = months[today.getMonth()];
                const yyyy = today.getFullYear();

                const formattedDate = `${dd}-${mm}-${yyyy}`;

                me.controls.po_date.value = formattedDate;
                if (me.dataOptions.id) {
                    const po = data.po_detail || {};

                    me.controls.vendor.value = po.name || po.vendor_name || '';
                    
                    if (po.vendor_id) {
                        me._selectedVendorId = po.vendor_id;
                        if (me.controls.vendor_id) me.controls.vendor_id.value = po.vendor_id;
                        // Trigger vendor info load (phone, address)
                        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: po.vendor_id }, {})
                            .then(res => {
                                const v = res.data?.vendor || {};
                                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                                if (me.controls.address) me.controls.address.value = v.address || '';
                            });
                    }

                    if (po.po_date && me.controls.po_date) {
                        me.controls.po_date.value = po.po_date;
                    }
                    me.controls.building_id.value = po.building_id || '';
                    me.purchaseItemsView.setData(po);

                   
                } 
                // else {
                //     me.clear();
                //     if (me.searchVendor && typeof me.searchVendor.reset === 'function') {
                //         me.searchVendor.reset();
                //     }
                // }
            },
        
            configSelect: [
                {
                    name: "building_id",
                    data: "buildings",
                    textField: "building",
                    valueField: "id",
                },

            ],
            prepareFormOptions: {
                // modifyTitle: "Receive Purchase Order",
                // createTitle: "Purchase Order",
                targetProp: "po_detail",
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
                    <th class="text-nowrap">#</th>
                    <th class="text-nowrap" vslang="labels.Name"></th>
                    <th class="text-nowrap" vslang="labels.Unit Price"></th>
                    <th class="text-nowrap" vslang="labels.Order Qty"></th>
                    <th class="text-nowrap" vslang="labels.Received Qty"></th>
                    <th class="text-nowrap" vslang="labels.Receiver"></th>
                </tr></thead>`;

                let tBody = '';
                const items = res.data || [];
                
                if (items.length > 0) {
                    items.forEach((item,index) => {

                        tBody += `<tr>
                            <td class="text-nowrap">${index+1}</td>
                            <td class="text-nowrap">${item.item_name}</td>
                            <td class="text-nowrap">${VSMoney.formatAmount(item.unit_price || 0, 'USD')}</td>
                            <td class="text-nowrap">${item.qty ?? "0"} <small class="text-golden text-capitalize">(${item.unit ?? 'pcs'})</small></td>
                            <td class="text-nowrap">${item.received_qty ?? "0"} <small class="text-golden text-capitalize">(${item.unit ?? 'pcs'})</small></td>
                            <td class="text-nowrap">
                                <div class="d-flex flex-column">
                                    <span class="text-capitalize text-start">
                                        ${item.received_user ?? '_'}
                                    </span>
                                    <span class="text-start small text-muted">${item.received_date ?? ''}</span>
                                </div>
                            </td>
                        </tr>`;
                    });
                }

                html = `<table class="table table--dropdown">${tHead}<tbody>${tBody}</tbody></table>`;
                elBody.innerHTML = html;
                LocaleManager.translateZone(elBody);
                elBody.classList.add(['p-3','table-responsive']);
            });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_building, d.buildings, 'id', 'building', '', 'All Buildings', '');
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, 'id', 'vendor', '', 'All Vendors', '');
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

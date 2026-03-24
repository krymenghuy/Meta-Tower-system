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
    let ReceivePoLineDialog = null;
    let _currentEditPoId = null;

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };
    const formatQty = (qty) => {
        const n = Number(qty || 0);
        if (Number.isInteger(n)) return String(n);
        // Show up to 2 decimals, trim trailing zeros.
        return n.toFixed(2).replace(/\.?0+$/, '');
    };
    const formatDiscount = (data) => {
        const discountType = (data?.discount_type || 'percent') === 'amount' ? 'amount' : 'percent';
        const discountValue = Number(data?.discount_value || 0);
        if (discountType === 'percent') {
            // Show `12 %` instead of `12.00 %` when value is integer.
            const isInt = Number.isInteger(discountValue);
            const v = isInt ? String(discountValue) : discountValue.toFixed(2).replace(/\.?0+$/, '');
            return `${v} %`;
        }
        return formatCurrency(discountValue);
    };
    /** At least one line must have a real catalog item (empty default row does not count). */
    const hasValidPurchaseOrderLineItems = (items) => {
        if (!Array.isArray(items) || items.length === 0) return false;
        return items.some((row) => {
            const id = row?.item_id ?? row?.id;
            if (id === null || id === undefined || id === '') return false;
            const n = Number(id);
            return !Number.isNaN(n) && n > 0;
        });
    };
    /** Strip ItemsView row-delete column and append Action column with Receive button (last column). */
    const applyReceiveActionColumn = (me, rows) => {
        const root = me.divModal && me.divModal.querySelector('#receive_purchase_item_list');
        if (!root || !Array.isArray(rows) || !rows.length) return;
        const table = root.querySelector('table');
        if (!table) return;
        const theadRow = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        if (!theadRow || !tbody) return;
        const isDeleteCell = (cell) => {
            if (!cell) return false;
            if (cell.classList.contains('iv-td-action')) return true;
            return !!cell.querySelector('i.fa-trash, i.fa-trash-can, i.fa-trash-alt, .fa-regular.fa-trash-can, .fa-solid.fa-trash-can');
        };
        theadRow.querySelectorAll('th[data-receive-po-col]').forEach((el) => el.remove());
        tbody.querySelectorAll('td[data-receive-po-col]').forEach((el) => el.remove());

        theadRow.querySelectorAll('th.iv-th-action').forEach((el) => el.remove());
        tbody.querySelectorAll('td.iv-td-action').forEach((el) => el.remove());

        const th = document.createElement('th');
        th.className = 'text-center align-middle';
        th.setAttribute('data-receive-po-col', '1');
        th.textContent = 'Action';
        theadRow.appendChild(th);
        const expectedCellCount = theadRow.querySelectorAll('th').length;

        const liveItems = (me.receiveItemsView && typeof me.receiveItemsView.getItems === 'function')
            ? (me.receiveItemsView.getItems() || [])
            : [];

        tbody.querySelectorAll('tr').forEach((tr, idx) => {
            const existingActionCell = Array.from(tr.querySelectorAll('td')).find((cell) => isDeleteCell(cell));
            const row = liveItems[idx] || rows[idx] || {};
            const td = existingActionCell || document.createElement('td');
            td.className = 'text-center align-middle';
            td.setAttribute('data-receive-po-col', '1');
            td.innerHTML = '';
            const linePending = !row.status_id || Number(row.status_id) === 1;
            if (linePending) {
                const sendBtn = document.createElement('button');
                sendBtn.type = 'button';
                sendBtn.className = 'btn btn-sm btn-primary receive-po-line-btn';
                const poItemId = Number(row.id || 0);
                sendBtn.dataset.poItemId = String(poItemId || '');
                sendBtn.textContent = 'Receive';
                sendBtn.disabled = !(poItemId > 0);
                td.appendChild(sendBtn);
            } else {
                const span = document.createElement('span');
                span.className = 'text-muted small';
                span.textContent = 'Received';
                td.appendChild(span);
            }
            if (!existingActionCell) tr.appendChild(td);

            let cells = Array.from(tr.children).filter((el) => el.tagName === 'TD');
            while (cells.length > expectedCellCount) {
                const customActionCell = tr.querySelector('td[data-receive-po-col]');
                const removable = (customActionCell && customActionCell.previousElementSibling && customActionCell.previousElementSibling.tagName === 'TD')
                    ? customActionCell.previousElementSibling
                    : cells.slice().reverse().find((cell) => !cell.hasAttribute('data-receive-po-col'));
                if (!removable) break;
                removable.remove();
                cells = Array.from(tr.children).filter((el) => el.tagName === 'TD');
            }
        });
    };
    const syncReceiveActionColumn = (me, rows) => {
        applyReceiveActionColumn(me, rows);
        requestAnimationFrame(() => applyReceiveActionColumn(me, rows));
        setTimeout(() => applyReceiveActionColumn(me, rows), 120);
    };
    const refreshReceivePoHeaderStatus = (me) => {
        const poId = me.dataOptions?.id;
        if (!poId) return;
        vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`, { id: poId }, null, false)
            .then((res) => {
                if (res && res.status_code === 200 && res.data && res.data.po_details) {
                    me._receivePoStatusId = res.data.po_details.status_id;
                }
            })
            .catch(() => {});
    };
    /** Real line: Receive amount + Break Amount must equal Ordered Qty (saved on item). */
    const isReceiveLineRowComplete = (it) => {
        const itemId = Number(it.item_id ?? 0);
        if (!itemId || itemId <= 0) return true;
        const ordered = Number(it.qty) || 0;
        const recvRaw = it.receive_qty != null ? it.receive_qty : it.recieve_amount;
        const recv = Number(recvRaw) || 0;
        const brk = Number(it.break_amount) || 0;
        return Math.abs((recv + brk) - ordered) < 0.02;
    };
    const validateAllReceiveLinesComplete = (me) => {
        const items = (me.receiveItemsView && typeof me.receiveItemsView.getItems === 'function')
            ? (me.receiveItemsView.getItems() || [])
            : [];
        if (!items.length) return false;
        return items.every(isReceiveLineRowComplete);
    };
    const showIncompleteReceiveRemarkDialog = ({ poId, triggerEl, onConfirmed }) => {
        let incompleteReceiveDialog = mThis._incompleteReceiveDialog;
        incompleteReceiveDialog = incompleteReceiveDialog || new GeneralDialog({
            cssClass: 'modal-lg vs-modal',
            backdrop: 'static',
            createContent: () => `
                <div class="py-2">
                    <label class="form-label fw-bold fs-2 mb-3">Remarks</label>
                    <textarea
                        name="remarks"
                        class="form-control data-input"
                        data-field="remarks"
                        rows="5"
                        placeholder=""></textarea>
                </div>
            `,
            onShow: (dlg) => {
                const titleEl = dlg.divModal && dlg.divModal.querySelector('.modal-title');
                if (titleEl) titleEl.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Confirm Receive</h2>';
                if (dlg.controls.remarks) dlg.controls.remarks.value = '';
            },
            buttons: [
                {
                    label: 'Cancel',
                    cssClass: 'btn btn-secondary',
                    click: (dlg) => dlg.hide(false)
                },
                {
                    label: '<span>Confirm</span>',
                    cssClass: 'btn btn-primary',
                    click: (dlg, btn) => {
                        const remarks = String(dlg.controls.remarks?.value || '').trim();
                        if (!remarks) return cv_interact.warning('Please enter remarks.');
                        if (typeof onConfirmed === 'function') onConfirmed({ remarks, btn, dlg });
                    }
                }
            ]
        });
        mThis._incompleteReceiveDialog = incompleteReceiveDialog;
        incompleteReceiveDialog.show({ id: poId, btn: triggerEl });
    };
    /** Current line row from ItemsView (by purchase_order_items.id or table row index). */
    const getReceiveLineRowData = (me, poItemId, tr) => {
        const id = Number(poItemId);
        const items = (me.receiveItemsView && typeof me.receiveItemsView.getItems === 'function')
            ? (me.receiveItemsView.getItems() || [])
            : [];
        let row = items.find((it) => Number(it.id) === id);
        if (!row && tr && tr.parentNode) {
            const rows = Array.from(tr.parentNode.querySelectorAll('tr'));
            const idx = rows.indexOf(tr);
            if (idx >= 0) row = items[idx];
        }
        const orderedQty = row && row.qty != null && !Number.isNaN(Number(row.qty)) ? Number(row.qty) : 0;
        const receiveRaw = row && (row.receive_qty != null ? row.receive_qty : row.recieve_amount);
        const receiveQty = receiveRaw != null && !Number.isNaN(Number(receiveRaw)) ? Number(receiveRaw) : 0;
        const breakAmount = row && row.break_amount != null && !Number.isNaN(Number(row.break_amount))
            ? Number(row.break_amount)
            : 0;
        return { orderedQty, receiveQty, breakAmount, row };
    };
    const bindReceiveLineButtonDelegation = (me) => {
        const root = me.divModal && me.divModal.querySelector('#receive_purchase_item_list');
        if (!root || root.dataset.receiveLineDelegateBound === '1') return;
        root.dataset.receiveLineDelegateBound = '1';
        root.addEventListener('click', (e) => {
            const sendBtn = e.target && e.target.closest && e.target.closest('.receive-po-line-btn');
            if (!sendBtn || sendBtn.disabled) return;
            e.preventDefault();
            const poId = me.dataOptions && me.dataOptions.id;
            const poItemId = Number(sendBtn.dataset.poItemId);
            if (!poId || !poItemId) return;
            if (Number(me._receivePoStatusId) === 2) {
                return cv_interact.warning('This purchase order is already fully received.');
            }
            const tr = sendBtn.closest('tr');
            const { orderedQty, receiveQty, breakAmount } = getReceiveLineRowData(me, poItemId, tr);
            showReceivePoLineDialog({
                me,
                poId,
                poItemId,
                orderedQty,
                receiveQty,
                breakAmount,
                triggerEl: sendBtn,
                onSuccess: () => {
                    refreshReceivePoHeaderStatus(me);
                    loadReceivePurchaseOrder(me)
                        .then(() => {
                            if (mThis.PoListView && mThis.getFilterData) {
                                mThis.PoListView.showPage(mThis.getFilterData());
                            }
                        })
                        .catch(() => {});
                }
            });
        });
    };
    const lockReceivePurchaseOrderFields = (me) => {
        const root = me.divModal;
        if (!root) return;
        root.querySelectorAll('.data-input').forEach((el) => {
            if (el.closest && el.closest('#receive_purchase_item_list')) return;
            if (el.tagName === 'SELECT') el.disabled = true;
            else if (el.type !== 'hidden') el.readOnly = true;
        });
        const v = root.querySelector('[name="vendor"]');
        if (v) v.readOnly = true;
        const itemRoot = root.querySelector('#receive_purchase_item_list');
        if (itemRoot) {
            itemRoot.querySelectorAll('input, select, textarea').forEach((el) => {
                el.disabled = true;
            });
        }
    };
    const loadReceivePurchaseOrder = (me) => {
        const poId = me.dataOptions?.id;
        if (!poId) return Promise.resolve(null);
        if (!me.receiveItemsView || typeof me.receiveItemsView.setData !== 'function') {
            return Promise.reject(new Error('Receive items view is not initialized'));
        }
        return Promise.all([
            vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`, { id: poId }, null, false),
            vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`, { id: poId, po_id: poId }, null, false)
        ])
            .then(([formRes, itemsRes]) => {
                if (!formRes || formRes.status_code !== 200) {
                    throw new Error(formRes?.error_message || 'Failed to load purchase order details');
                }
                if (!itemsRes || itemsRes.status_code !== 200) {
                    throw new Error(itemsRes?.error_message || 'Failed to load purchase order items');
                }
                const formData = formRes.data || {};
                const poDetails = formData.po_details || {};
                const vendors = formData.vendors || [];
                const vendorId = poDetails.vendor_id;
                const vendor = vendors.find(v => Number(v.id) === Number(vendorId));

                if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                if (me.controls.vendor) me.controls.vendor.value = vendor ? (vendor.vendor || vendor.name || vendor.vendor_name || '') : '';
                if (me.controls.po_date) me.controls.po_date.value = poDetails.po_date || '';
                if (me.controls.po_number) me.controls.po_number.value = poDetails.po_number || '';
                if (me.controls.discount_value) me.controls.discount_value.value = poDetails.discount_value ?? 0;
                if (me.controls.discount_type) me.controls.discount_type.value = poDetails.discount_type || 'percent';

                me._selectedVendorId = vendorId;
                if (vendorId && (me.controls.phone_number || me.controls.address)) {
                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                        .then(r => {
                            const d = r.data || {};
                            const v = d.vendor || {};
                            if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                            if (me.controls.address) me.controls.address.value = v.address || '';
                        })
                        .catch(() => {});
                }

                if (me._itemOptions && me.receiveItemsView?.setSelectOptions) {
                    const normalizedItemOptions = (me._itemOptions || []).map(o => {
                        const iv = o?.id ?? o?.value ?? o?.item_id;
                        const lb = o?.name ?? o?.label ?? o?.item_name;
                        return { id: iv, value: iv, name: lb, label: lb };
                    });
                    me.receiveItemsView.setSelectOptions('item_id', normalizedItemOptions, null);
                }

                const raw = itemsRes.data;
                const items = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : (Array.isArray(raw?.data) ? raw.data : []));
                const unitByName = { pcs: 1, kg: 2, box: 3, meter: 4 };

                const rows = items.map(it => {
                    const unitNum = Number(it.unit);
                    const unitValue = (unitNum >= 1 && unitNum <= 4) ? unitNum : (unitByName[String(it.unit).toLowerCase()] ?? it.unit);
                    const receiveRaw = it.receive_qty != null ? it.receive_qty : it.recieve_amount;
                    return {
                        id: it.id,
                        status_id: it.status_id,
                        item_id: it.item_id,
                        qty: it.qty != null ? Number(it.qty) : 0,
                        unit: unitValue,
                        unit_price: it.unit_price || 0,
                        total_price: it.total_price || (Number(it.qty) * Number(it.unit_price || 0)),
                        receive_qty: receiveRaw != null ? Number(receiveRaw) : 0,
                        break_amount: it.break_amount != null ? Number(it.break_amount) : 0,
                        code: it.code || ''
                    };
                });

                if (!rows.length) {
                    if (typeof me.receiveItemsView.setData === 'function') me.receiveItemsView.setData([]);
                } else if (typeof me.receiveItemsView.addRow === 'function') {
                    if (typeof me.receiveItemsView.setData === 'function') me.receiveItemsView.setData(null);
                    rows.forEach(r => me.receiveItemsView.addRow(r));
                } else {
                    me.receiveItemsView.setData(rows);
                }
                if (typeof me.receiveItemsView.render === 'function') me.receiveItemsView.render();
                if (typeof me.receiveItemsView.refresh === 'function') me.receiveItemsView.refresh();
                if (typeof me.receiveItemsView.draw === 'function') me.receiveItemsView.draw();

                setTimeout(() => {
                    bindReceiveLineButtonDelegation(me);
                    syncReceiveActionColumn(me, rows);
                    lockReceivePurchaseOrderFields(me);
                    if (typeof me.updateReceiveTotals === 'function') me.updateReceiveTotals();
                }, 60);

                me._receivePoStatusId = poDetails.status_id;
                if (!items.length) {
                    cv_interact.warning('This purchase order has no items.');
                }
                return items;
            });
    };
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
            title: "Total Price",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${formatCurrency(data.sub_total)}</span>`;
            }
        },
        {
            title: "Discount",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${formatDiscount(data)}</span>`;
            }
        },
        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${formatCurrency(data.total_amount)}</span>`;
            }
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status_id = Number(data.status_id || 0);
                const isReceived = status_id === 2 || status_id === 3;
                let cls = 'badge text-warning bg-warning-subtle border border-warning';
                let badgeStyle = 'min-width:90px';

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

                if (isReceived) {
                    cls = 'badge border';
                    badgeStyle = 'min-width:90px;background:#dff3ea;color:#37b07f;border-color:#70c39f !important;font-weight:500;';
                }

                const statusText = isReceived ? 'Received' : (data.status ?? '');
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="${badgeStyle}">
                        ${statusText}
                    </span>
                `;
            },
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data) => {
                const remarks = String(data.remarks || '').trim();
                return `<span class="text-prm-custom d-block text-truncate" style="max-width:180px;" title="${remarks}">${remarks || '-'}</span>`;
            }
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
            data: (data) => {
                const statusId = Number(data.status_id || 0);
                const isReceived = statusId === 2 || statusId === 3;
                const actionBtnClass = isReceived ? 'btn_dropdown_vendor_action_received' : 'btn_dropdown_vendor_action';
                return `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${actionBtnClass}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
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

        const baseMenus = [
            {
                html: '<span class="ps-2 " vslang="titles.Modify PO"></span>',
                icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                cssClass: "border-bottom pb-2",
                name: "modify_purchase_order"
            },
            {
                html: '<span class="ps-2  " vslang="titles.Delete PO"></span>',
                icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                cssClass: "border-bottom pb-2",
                name: "delete_purchase_order"
            }
        ];

        const onMenuClick = (menuLink, id, name) => {
            switch (name) {
                case 'modify_purchase_order': {
                    mThis.editPurchaseOrder(id, menuLink);
                    break;
                }
                case 'delete_purchase_order': {
                    mThis.deletePurchaseOrder(id, menuLink);
                    break;
                }
                case 'receive_purchase_order': {
                    mThis.receivePurchaseOrder(id, menuLink);
                    break;
                }
                default: {
                    break;
                }
            }
        };

        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                ...baseMenus,
                {
                    html: '<span class="ps-2" vslang="titles.Receive PO"></span>',
                    icon: `<i class="fa-solid fa-box-open fs-5 text-primary"></i>`,
                    cssClass: '',
                    name: "receive_purchase_order"
                },
            ],

            onClick: onMenuClick
        };

        const menuOptionsReceived = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action_received",
            cssClass: "bg-white shadow",
            menus: [...baseMenus],
            onClick: onMenuClick
        };

        new VSDropdownMenu(menuOptions);
        new VSDropdownMenu(menuOptionsReceived);
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
                        <td class="text-nowrap">${formatQty(item.qty)}</td>
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
                                    <th class="text-nowrap">Price</th>
                                    <th class="text-nowrap">Total</th>
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
    mThis.receivePurchaseOrder = (id, menuLink) => {
        showReceivePurchaseOrderDialog({ id, btn: menuLink });
    };
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
                    if (me.controls.discount_value) me.controls.discount_value.value = poDetails.discount_value || 0;
                    if (me.controls.discount_type) me.controls.discount_type.value = poDetails.discount_type || 'percent';

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
                            id: it.id,
                            item_id: it.item_id,
                            qty: it.qty != null ? Number(it.qty) : 0,
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
                    if (subtotalEl) subtotalEl.textContent = formatCurrency(subTotal);
                    if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
                    if (totalEl) totalEl.textContent = formatCurrency(total);
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
                    if (!me.purchaseItemsView || typeof me.purchaseItemsView.getItems !== 'function') {
                        return cv_interact.error('Purchase items are not ready. Please try again.');
                    }
                    p.items = me.purchaseItemsView.getItems() || [];
                    if (!hasValidPurchaseOrderLineItems(p.items)) {
                        return cv_interact.error('Please select at least one item before saving the purchase order.');
                    }
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
    const showReceivePurchaseOrderDialog = (op) => {
        ReceivePurchaseOrderDialog = ReceivePurchaseOrderDialog || new GeneralDialog({
            cssClass: 'modal-xl vs-modal',
            backdrop: 'static',
            override: {
                setData: (dlg, data) => {
                    data = data || {};
                    const rootEl = dlg?.divModal;
                    if (!rootEl || !rootEl.querySelectorAll) return;
                    rootEl.querySelectorAll('.data-input').forEach((el) => {
                        if (el.closest && el.closest('#receive_purchase_item_list')) return;
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
            createContent: () => `
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Vendor</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input
                            name="vendor"
                            class="form-control flex-grow-1"
                            placeholder=""
                            readonly>
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
                            placeholder=""
                            readonly>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:90px;">Address</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="address"
                            class="data-input form-control flex-grow-1"
                            data-field="address"
                            placeholder=""
                            readonly>
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
                            data-field="po_date"
                            readonly>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold" style="min-width:90px;">PO Number</span>
                        <span class="mx-2 fw-bold">:</span>
                        <input type="text"
                            name="po_number"
                            class="data-input form-control flex-grow-1"
                            data-field="po_number"
                            placeholder=""
                            readonly>
                    </div>
                </div>
                <div class="col-lg-12 mt-3 p-3" style="background-color:#ebebeb;">
                    <div id="receive_po_loading" class="text-center py-3">
                        <div class="spinner-border text-primary" role="status"></div>
                        <div class="small text-muted mt-2">Loading purchase order…</div>
                    </div>
                    <div id="receive_po_content_wrap" style="display:none;">
                        <div id="receive_purchase_item_list" class="purchase-item-list"></div>
                    </div>
                </div>
                <div class="col-lg-12 mt-3 d-flex justify-content-end">
                    <div class="p-3 rounded-3 shadow-sm border" style="background-color:#fff; min-width:280px;">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Sub Total</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="receive_po_subtotal_display" class="ms-2">$ 0.00</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Discount</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="number" name="discount_value" class="data-input form-control ms-2" data-field="discount_value" style="width:80px" value="0" min="0" step="0.01" placeholder="0" readonly>
                            <select name="discount_type" class="data-input form-control ms-1" data-field="discount_type" style="width:60px" disabled>
                                <option value="percent">%</option>
                                <option value="amount">$</option>
                            </select>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Tax</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="receive_po_tax_display" class="ms-2">$ 0.00</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:90px;">Total</span>
                            <span class="mx-2 fw-bold">:</span>
                            <span id="receive_po_total_display" class="ms-2 fw-bold">$ 0.00</span>
                        </div>
                    </div>
                </div>
            </div>
            `,
            contentCreated: (me) => {
                me.receiveItemsView = new ItemsView('receive_purchase_item_list', {
                    columns: [
                        { name: 'item_id', transTitle: 'titles.Item', displayType: 'select', readOnly: true },
                        { name: 'qty', transTitle: 'titles.Ordered Qty', dataType: 'number', defaultValue: 1, isNumeric: true, readOnly: true },
                        { name: 'receive_qty', transTitle: 'Received Qty', dataType: 'number', defaultValue: 0, isNumeric: true, readOnly: true },
                        { name: 'unit_price', transTitle: 'titles.Unit Price', dataType: 'number', defaultValue: 0, isNumeric: true, readOnly: true },
                        { name: 'total_price', transTitle: 'titles.Total Price', readOnly: true, dataType: 'number', isNumeric: true }
                    ],
                    calc: { mode: 'auto', qtyField: 'qty', priceField: 'unit_price', totalField: 'total_price', currencyPrecision: 2 },
                    totalSummary: { container: '#sum', showTax: false, allowDiscount: false, currency: 'USD' },
                    validateColumns: {},
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: false,
                    addLineButtonText: 'Add Item'
                });
                me.receiveItemsView.setSelectOptions('unit', [
                    { value: 1, label: 'pcs' },
                    { value: 2, label: 'kg' },
                    { value: 3, label: 'box' },
                    { value: 4, label: 'meter' },
                ], '', { value: 'id', label: 'Select unit' });

                me.updateReceiveTotals = () => {
                    if (!me.divModal || !me.receiveItemsView) return;
                    const items = me.receiveItemsView.getItems ? me.receiveItemsView.getItems() : [];
                    let subTotal = 0;
                    if (Array.isArray(items)) {
                        items.forEach((it) => {
                            const receiveRaw = it.receive_qty != null ? it.receive_qty : it.recieve_amount;
                            const receiveAmt = Number(receiveRaw) || 0;
                            const unitPrice = Number(it.unit_price) || 0;
                            subTotal += receiveAmt * unitPrice;
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
                    const subtotalEl = me.divModal.querySelector('#receive_po_subtotal_display');
                    const taxEl = me.divModal.querySelector('#receive_po_tax_display');
                    const totalEl = me.divModal.querySelector('#receive_po_total_display');
                    if (subtotalEl) subtotalEl.textContent = formatCurrency(subTotal);
                    if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
                    if (totalEl) totalEl.textContent = formatCurrency(total);
                };
            },
            onPrepareForm: (me, data) => {
                const raw = data.item || [];
                me._itemOptions = raw.map(o => ({
                    ...o,
                    id: o.id ?? o.value ?? o.item_id,
                    name: o.name ?? o.label ?? o.item_name
                }));
                if (me.receiveItemsView && me.receiveItemsView.setSelectOptions) {
                    me.receiveItemsView.setSelectOptions('item_id', me._itemOptions, null);
                }
            },
            onShow: (me) => {
                const titleEl = me.divModal && me.divModal.querySelector('.modal-title');
                if (titleEl) {
                    titleEl.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Receive Purchase Order</h2>';
                }
                const loadingEl = me.divModal.querySelector('#receive_po_loading');
                const wrap = me.divModal.querySelector('#receive_po_content_wrap');
                if (loadingEl) loadingEl.style.display = '';
                if (wrap) wrap.style.display = 'none';

                const tryLoad = (attempt = 0) => {
                    if (!me.receiveItemsView || typeof me.receiveItemsView.setData !== 'function') {
                        if (attempt < 60) return setTimeout(() => tryLoad(attempt + 1), 50);
                        return cv_interact.error('Receive items view is not ready.');
                    }
                    loadReceivePurchaseOrder(me)
                        .then(() => {
                            if (loadingEl) loadingEl.style.display = 'none';
                            if (wrap) wrap.style.display = '';
                        })
                        .catch((err) => {
                            cv_interact.error(err?.message || 'Failed to load purchase order.');
                            if (loadingEl) loadingEl.style.display = 'none';
                        });
                };
                setTimeout(() => tryLoad(0), 0);
            },
            buttons: [
                {
                    label: 'Cancel',
                    cssClass: 'btn btn-warning',
                    click: (me) => { me.hide(false); }
                },
                {
                    label: '<span>Confirm receive</span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const poId = me.dataOptions?.id;
                        if (!poId) {
                            return cv_interact.error('Invalid purchase order.');
                        }
                        if (Number(me._receivePoStatusId) === 2) {
                            return cv_interact.warning('This purchase order is already fully received.');
                        }
                        if (!validateAllReceiveLinesComplete(me)) {
                            return showIncompleteReceiveRemarkDialog({
                                poId,
                                triggerEl: btn,
                                onConfirmed: ({ remarks, btn: remarkBtn, dlg }) => {
                                    vsapi.call(`${main_view.base_url}/prm/purchase/order/confirm-received`, {
                                        id: poId,
                                        allow_partial: 1,
                                        remarks
                                    }, remarkBtn).then((res) => {
                                        if (res.status_code === 200) {
                                            cv_interact.success(res.message || 'Purchase order updated.');
                                            dlg.hide(true);
                                            me.hide(true);
                                            if (mThis.PoListView && mThis.getFilterData) {
                                                mThis.PoListView.showPage(mThis.getFilterData());
                                            }
                                        } else {
                                            cv_interact.warning(res.error_message || 'Could not update purchase order.');
                                        }
                                    });
                                }
                            });
                        }
                        vsapi.call(`${main_view.base_url}/prm/purchase/order/confirm-received`, {
                            id: poId
                        }, btn).then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success(res.message || 'Purchase order confirmed as received.');
                                me._receivePoStatusId = 2;
                                me.hide(true);
                                if (mThis.PoListView && mThis.getFilterData) {
                                    mThis.PoListView.showPage(mThis.getFilterData());
                                }
                            } else {
                                cv_interact.warning(res.error_message || 'Could not confirm purchase order.');
                            }
                        });
                    }
                }
            ],
            prepareFormOptions: {
                createTitle: 'Receive Purchase Order',
                modifyTitle: 'Receive Purchase Order',
                targetProp: 'item_details',
                api: {
                    endpoint: `${main_view.base_url}/prm/item/form-options`,
                    params: (dataOptions) => ({ owner_id: dataOptions?.owner_id })
                }
            }
        });
        ReceivePurchaseOrderDialog.show(op);
    };
    const showReceivePoLineDialog = ({ me, poId, poItemId, orderedQty, receiveQty, breakAmount, triggerEl, onSuccess }) => {
        const payload = {
            id: poId,
            po_item_id: poItemId,
            ordered_qty: Number(orderedQty) || 0,
            receive_qty: Number(receiveQty) || 0,
            break_amount: Number(breakAmount) || 0,
            onLineReceiveSuccess: onSuccess,
            btn: triggerEl
        };

        InputBox.resetInstance('receivePoLinePopup');
        InputBox.show({
            title: "Receive Line Item",
            instanceKey: "receivePoLinePopup",
            columns: 2,
            fields: [
                { name: "ordered_qty", label: "Ordered Qty", type: "text", readOnly: true },
                { name: "receive_qty", label: "Receive Qty", type: "number", required: true },
                { name: "break_amount", label: "Break Amount", type: "number", required: true, colSpan: 2 },
            ],
            onOpen: (ibMe) => {
                if (ibMe.controls.ordered_qty) ibMe.controls.ordered_qty.value = payload.ordered_qty;
                if (ibMe.controls.receive_qty) ibMe.controls.receive_qty.value = payload.receive_qty;
                if (ibMe.controls.break_amount) ibMe.controls.break_amount.value = payload.break_amount;
            },
            onConfirm: (data, btn, ibMe) => {
                const rq = Number(data.receive_qty ?? payload.receive_qty ?? 0);
                const ba = Number(data.break_amount ?? payload.break_amount ?? 0);
                const oq = Number(data.ordered_qty ?? payload.ordered_qty ?? 0);
                const linePoId = payload.id;
                const linePoItemId = Number(payload.po_item_id);
                if (!linePoId || !linePoItemId) return cv_interact.error('Invalid line.');
                if (Number.isNaN(rq) || rq < 0) return cv_interact.error('Receive qty must be 0 or greater.');
                if (Number.isNaN(ba) || ba < 0) return cv_interact.error('Break amount must be 0 or greater.');
                if ((rq + ba) > oq) return cv_interact.error('Receive qty + break amount cannot exceed ordered qty.');
                vsapi.call(`${main_view.base_url}/prm/purchase/order/receive`, {
                    id: linePoId,
                    po_item_ids: [linePoItemId],
                    receive_qty: rq,
                    break_amount: ba
                }, btn).then((res) => {
                    if (res.status_code === 200) {
                        cv_interact.success(res.message || 'Line received.');
                        ibMe.close();
                        if (typeof payload.onLineReceiveSuccess === 'function') payload.onLineReceiveSuccess();
                    } else {
                        cv_interact.warning(res.error_message || 'Could not receive line.');
                    }
                });
            }
        });
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



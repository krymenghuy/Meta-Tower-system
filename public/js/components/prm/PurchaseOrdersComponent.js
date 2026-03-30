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
    let _currentEditPoId = null;

    const formatCurrency = (amount) => `$ ${(Number(+amount || 0)).toFixed(2)}`;
    const formatQty = (qty) => {
        const n = Number(+qty || 0);
        if (Number.isInteger(n)) return String(n);
        return n.toFixed(2).replace(/\.?0+$/, '');
    };
    /** Fallback when API omits discount_formatted. */
    const formatDiscount = (data) => {
        const discountType = (data?.discount_type || 'percent') === 'amount' ? 'amount' : 'percent';
        const discountValue = Number(+data?.discount_value || 0);
        if (discountType === 'percent') {
            const isInt = Number.isInteger(discountValue);
            const v = isInt ? String(discountValue) : discountValue.toFixed(2).replace(/\.?0+$/, '');
            return `${v} %`;
        }
        return formatCurrency(discountValue);
    };
    const applyReceiveCheckboxUi = (checkboxEl) => {
        if (!checkboxEl) return;
        checkboxEl.style.transform = 'scale(1.35)';
        checkboxEl.style.transformOrigin = 'center';
        checkboxEl.style.cursor = checkboxEl.disabled ? 'not-allowed' : 'pointer';
        checkboxEl.style.border = '1.5px solid #5b63e6';
        checkboxEl.style.borderRadius = '3px';
        checkboxEl.style.accentColor = '#5b63e6';
    };
    const normalizeItems = (raw) => {
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.items)) return raw.items;
        if (Array.isArray(raw?.data)) return raw.data;
        return [];
    };
    const setDialogDataExcluding = (dlg, data, excludeSelector) => {
        data = data || {};
        const rootEl = dlg?.divModal;
        if (!rootEl || !rootEl.querySelectorAll) return;

        rootEl.querySelectorAll('.data-input').forEach((el) => {
            if (excludeSelector && el.closest && el.closest(excludeSelector)) return;
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
    };
    const getEditPoId = (me) => (
        _currentEditPoId ??
        me?._editPoId ??
        (PurchaseOrderDialog && PurchaseOrderDialog._editPoId) ??
        (me?.dataOptions && me.dataOptions.id)
    );
    const getReceiveRoot = (me) => me.divModal && me.divModal.querySelector('#receive_purchase_item_list');
    const getReceiveItems = (me) => (
        me.receiveItemsView && typeof me.receiveItemsView.getItems === 'function'
            ? (me.receiveItemsView.getItems() || [])
            : []
    );
    const getReceiveQtyRaw = (rowOrItem) => {
        if (!rowOrItem) return undefined;
        return rowOrItem.receive_qty != null ? rowOrItem.receive_qty : rowOrItem.recieve_amount;
    };
    const normalizeUnit = (unit) => {
        const unitByName = { pcs: 1, kg: 2, box: 3, meter: 4 };
        const unitNum = Number(unit);
        if (unitNum >= 1 && unitNum <= 4) return unitNum;
        return unitByName[String(unit).toLowerCase()] ?? unit;
    };
    const mapItemSelectOptions = (arr) => (arr || []).map((o) => {
        const iv = o?.id ?? o?.value ?? o?.item_id;
        const lb = o?.name ?? o?.label ?? o?.item_name;
        return { id: iv, value: iv, name: lb, label: lb };
    });
    const mapEditRows = (items) => (items ?? []).map((it) => ({
        trx_id: it.id,
        item_id: it.item_id,
        qty: it.qty != null ? Number(it.qty) : 0,
        unit: normalizeUnit(it.unit_id ?? it.unit),
        unit_price: it.unit_price || 0,
        total_price: it.total_price || (Number(it.qty) * Number(it.unit_price || 0)),
        code: it.code || ''
    }));
    const mapReceiveRows = (items) => (items || []).map((it) => {
        const receiveRaw = getReceiveQtyRaw(it);
        return {
            id: it.id,
            status_id: it.status_id,
            item_id: it.item_id,
            qty: it.qty != null ? Number(it.qty) : 0,
            unit: normalizeUnit(it.unit_id ?? it.unit),
            unit_price: it.unit_price || 0,
            total_price: it.total_price || (Number(it.qty) * Number(it.unit_price || 0)),
            receive_qty: receiveRaw != null ? Number(receiveRaw) : 0,
            break_amount: it.break_amount != null ? Number(it.break_amount) : 0,
            code: it.code || ''
        };
    });
    /** Line already persisted to server with receive/break (re-open Receive PO: show tick, disable). */
    const isReceiveLineAlreadySaved = (row) => {
        const itemId = Number(row?.item_id ?? 0);
        if (!itemId || itemId <= 0) return false;
        if (Number(row?.status_id) === 2) return true;
        const recv = Number(getReceiveQtyRaw(row)) || 0;
        const brk = Number(row?.break_amount) || 0;
        return recv > 0.02 || brk > 0.02;
    };
    const loadVendorInfo = (me, vendorId) => {
        if (!vendorId || !(me.controls.phone_number || me.controls.address)) return;
        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
            .then((r) => {
                const v = (r.data ?? {}).vendor ?? {};
                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                if (me.controls.address) me.controls.address.value = v.address || '';
            })
            .catch(() => { });
    };
    const vendorDisplayName = (vendor, withCode) => {
        if (!vendor) return '';
        const n = vendor.vendor || vendor.name || vendor.vendor_name || '';
        return withCode ? (n || vendor.code || '') : (n || '');
    };
    const applyPoHeaderToDialog = (me, poDetails, vendors, withCode) => {
        const vid = poDetails.vendor_id;
        const v = vendors.find((x) => Number(x.id) === Number(vid));
        const name = vendorDisplayName(v, withCode);
        if (me.controls.vendor_id) me.controls.vendor_id.value = vid || '';
        if (me.controls.vendor) me.controls.vendor.value = name;
        if (me.controls.po_date) me.controls.po_date.value = poDetails.po_date || '';
        if (me.controls.po_number) me.controls.po_number.value = poDetails.po_number || '';
        if (me.controls.discount_value) me.controls.discount_value.value = poDetails.discount_value ?? 0;
        if (me.controls.discount_type) me.controls.discount_type.value = poDetails.discount_type || 'percent';
        me._selectedVendorId = vid;
        loadVendorInfo(me, vid);
    };
    /** One Bootstrap field row: Label : control */
    const poFormRow = (label, fieldHtml, mb) =>
        `<div class="d-flex align-items-center${mb ? ' mb-2' : ''}"><span class="fw-bold" style="min-width:90px;">${label}</span><span class="mx-2 fw-bold">:</span>${fieldHtml}</div>`;
    const poTotalsBoxHtml = (pfx, dis) => {
        const ro = dis ? ' readonly' : '';
        const ds = dis ? ' disabled' : '';
        const dInp = `<input type="number" name="discount_value" class="data-input form-control ms-2" data-field="discount_value" style="width:80px" value="0" min="0" step="0.01" placeholder="0"${ro}>`;
        const dSel = `<select name="discount_type" class="data-input form-control ms-1" data-field="discount_type" style="width:60px"${ds}><option value="percent">%</option><option value="amount">$</option></select>`;
        return `<div class="col-lg-12 mt-3 d-flex justify-content-end"><div class="p-3 rounded-3 shadow-sm border" style="background-color:#fff; min-width:280px;">`
            + poFormRow('Sub Total', `<span id="${pfx}subtotal_display" class="ms-2">$ 0.00</span>`, true)
            + poFormRow('Discount', dInp + dSel, true)
            + poFormRow('Tax', `<span id="${pfx}tax_display" class="ms-2">$ 0.00</span>`, true)
            + poFormRow('Total', `<span id="${pfx}total_display" class="ms-2 fw-bold">$ 0.00</span>`, true)
            + '</div></div>';
    };

    const calcTotals = (subTotal, discountVal, discountType) => {
        const dv = +discountVal || 0;
        const dt = (discountType || 'percent') === 'percent' ? 'percent' : 'amount';
        const discountAmount = dt === 'percent' ? (subTotal * dv / 100) : dv;
        const afterDiscount = Math.max(0, subTotal - discountAmount);
        const taxAmount = 0;
        const total = afterDiscount + taxAmount;
        return { subTotal, taxAmount, total };
    };
    const writeTotalsToDom = (rootEl, ids, totals) => {
        if (!rootEl) return;
        const subtotalEl = rootEl.querySelector(ids.subtotal);
        const taxEl = rootEl.querySelector(ids.tax);
        const totalEl = rootEl.querySelector(ids.total);
        if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subTotal);
        if (taxEl) taxEl.textContent = formatCurrency(totals.taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(totals.total);
    };
    const setItemsViewRows = (view, rows) => {
        if (!view) return;
        if (!rows || !rows.length) {
            if (typeof view.setData === 'function') view.setData([]);
            return;
        }
        if (typeof view.addRow === 'function') {
            if (typeof view.setData === 'function') view.setData(null);
            rows.forEach((r) => view.addRow(r));
            return;
        }
        if (typeof view.setData === 'function') view.setData(rows);
    };
    const renderItemsView = (view) => {
        if (!view) return;
        if (typeof view.render === 'function') view.render();
        else if (typeof view.refresh === 'function') view.refresh();
        else if (typeof view.draw === 'function') view.draw();
    };
    const removeLeadingEmptyItemRow = (view) => {
        if (!view) return;

        // Keep only meaningful rows in ItemsView data (no direct DOM mutation).
        // Directly removing table rows can desync ItemsView internal state.
        if (typeof view.getItems === 'function' && typeof view.setData === 'function') {
            const cur = view.getItems() || [];
            const cleaned = cur.filter((it) => {
                const itemId = String(it?.item_id ?? '').trim();
                const qty = Number(it?.qty ?? 0);
                const price = Number(it?.unit_price ?? it?.price ?? 0);
                return itemId !== '' || qty > 0 || price > 0;
            });
            if (cleaned.length !== cur.length) {
                view.setData(cleaned);
                renderItemsView(view);
            }
        }
    };
    const UNIT_OPTIONS = [
        { value: 1, label: 'pcs' },
        { value: 2, label: 'kg' },
        { value: 3, label: 'box' },
        { value: 4, label: 'meter' },
    ];
    const applyUnitOptions = (itemsView) => {
        if (!itemsView || typeof itemsView.setSelectOptions !== 'function') return;
        itemsView.setSelectOptions('unit', UNIT_OPTIONS, '', { value: 'id', label: 'Select unit' });
    };
    const bindTotalsInputListeners = (me, fields, onChange) => {
        if (!me || !me.controls) return;
        (fields || []).forEach((field) => {
            const el = me.controls[field];
            if (!el) return;
            el.addEventListener('input', onChange);
            el.addEventListener('change', onChange);
        });
    };
    const RECEIVED_STATUS_BADGE_STYLE =
        'min-width:90px;background:#dff3ea;color:#37b07f;border-color:#70c39f !important;font-weight:500;';
    const PARTIAL_RECEIVE_BADGE_STYLE =
        'min-width:90px;background:#fff3e0;color:#e65100;border-color:#ffb74d !important;font-weight:500;';
    const PENDING_RECEIVE_BADGE_STYLE =
        'min-width:90px;background:#fff3cd;color:#664d03;border-color:#ffc107 !important;font-weight:600;';
    const PO_HEADER_STATUS = {
        PENDING: 1,
        APPROVED: 2,
        ORDERED: 3,
        PARTIALLY_RECEIVED: 4,
        RECEIVED: 5,
        CANCELLED: 6,
    };
    const poStatusBadgeFallback = (statusId, statusLabel) => {
        const status_id = Number(statusId || 0);
        const isReceived = status_id === PO_HEADER_STATUS.RECEIVED;
        const byStatus = {
            1: 'badge text-warning bg-warning-subtle border border-warning',
            2: 'badge text-info bg-info-subtle border border-info',
            3: 'badge text-primary bg-primary-subtle border border-primary',
            4: 'badge text-dark border',
            5: 'badge text-success bg-success-subtle border border-success',
            6: 'badge text-danger bg-danger-subtle border border-danger',
        };
        const byStyle = {
            1: PENDING_RECEIVE_BADGE_STYLE,
            4: PARTIAL_RECEIVE_BADGE_STYLE,
            5: RECEIVED_STATUS_BADGE_STYLE,
        };
        let cls = byStatus[status_id] || 'badge text-warning bg-warning-subtle border border-warning';
        if (isReceived) cls = 'badge border';
        const statusText = isReceived ? 'Received' : (statusLabel ?? '');
        const badgeStyle = byStyle[status_id] || (isReceived ? RECEIVED_STATUS_BADGE_STYLE : 'min-width:90px');
        return { cls, statusText, badgeStyle };
    };
    /** Uses status_class / status_label / status_badge_style from API when present (list sets these from receive progress). */
    const poStatusBadgeHtml = (data) => {
        const sid = Number(data?.status_id ?? 0);
        const isReceived = sid === PO_HEADER_STATUS.RECEIVED;
        const fb = poStatusBadgeFallback(sid, data?.status);
        const cls = data?.status_class || fb.cls;
        const statusText = data?.status_label ?? fb.statusText;
        const badgeStyle = data?.status_badge_style
            || fb.badgeStyle
            || (isReceived ? RECEIVED_STATUS_BADGE_STYLE : 'min-width:90px');
        return `<span class="${cls} text-capitalize d-inline-block text-center" style="${badgeStyle}">${statusText}</span>`;
    };
    /** Same rules as PurchaseOrder::receiveProgressStateFromLines (effective = receive + break, lines with qty > 0). */
    const computeReceiveProgressStateFromItems = (items) => {
        const rows = Array.isArray(items) ? items : [];
        const meaningful = [];
        rows.forEach((it) => {
            const itemId = Number(it?.item_id ?? 0);
            if (!itemId || itemId <= 0) return;
            const ordered = Number(it?.qty) || 0;
            if (ordered <= 0) return;
            const recvRaw = getReceiveQtyRaw(it);
            const recv = recvRaw != null && !Number.isNaN(Number(recvRaw)) ? Number(recvRaw) : 0;
            const brk = Number(it?.break_amount) || 0;
            const lineMarkedReceived = Number(it?.status_id) === 2;
            meaningful.push({ ordered, eff: recv + brk, lineMarkedReceived });
        });
        if (!meaningful.length) return 'none';
        let anyReceived = false;
        let allSatisfied = true;
        meaningful.forEach((m) => {
            if (m.eff > 0.02 || m.lineMarkedReceived) anyReceived = true;
            if (!m.lineMarkedReceived && m.eff + 1e-6 < m.ordered) allSatisfied = false;
        });
        if (!anyReceived) return 'none';
        if (allSatisfied) return 'complete';
        return 'partial';
    };
    const RECEIVE_PROGRESS_BADGE_MAP = {
        complete: {
            label: 'Received',
            cls: 'badge border',
            style: RECEIVED_STATUS_BADGE_STYLE,
        },
        partial: {
            label: 'Partially Received',
            cls: 'badge text-dark border',
            style: PARTIAL_RECEIVE_BADGE_STYLE,
        },
        none: {
            label: 'Pending',
            cls: 'badge text-dark border',
            style: PENDING_RECEIVE_BADGE_STYLE,
        },
    };
    const updateReceiveProgressBadge = (me) => {
        const el = me.divModal && me.divModal.querySelector('#receive_po_progress_badge');
        if (!el) return;
        if (Number(me._receivePoStatusId) === PO_HEADER_STATUS.RECEIVED) {
            const cfg = RECEIVE_PROGRESS_BADGE_MAP.complete;
            el.textContent = cfg.label;
            el.className = `${cfg.cls} text-capitalize d-inline-block text-center`;
            el.setAttribute('style', cfg.style);
            return;
        }
        const items = getReceiveItems(me);
        const state = computeReceiveProgressStateFromItems(items);
        const cfg = RECEIVE_PROGRESS_BADGE_MAP[state] || RECEIVE_PROGRESS_BADGE_MAP.none;
        el.textContent = cfg.label;
        el.className = `${cfg.cls} text-capitalize d-inline-block text-center`;
        el.setAttribute('style', cfg.style);
    };
    const scheduleReceiveProgressBadgeUpdate = (me) => {
        if (me._receiveBadgeTimer) clearTimeout(me._receiveBadgeTimer);
        me._receiveBadgeTimer = setTimeout(() => {
            me._receiveBadgeTimer = null;
            updateReceiveProgressBadge(me);
        }, 200);
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
    const getCleanPurchaseItems = (itemsView) => {
        if (!itemsView || typeof itemsView.getItems !== 'function') return [];
        const source = itemsView.getItems() || [];
        const seenTrxIds = new Set();

        return source
            .filter((row) => {
                const itemId = Number(row?.item_id ?? row?.id ?? 0);
                const qty = Number(row?.qty ?? 0);
                const unitPrice = Number(row?.unit_price ?? row?.price ?? 0);
                return itemId > 0 || qty > 0 || unitPrice > 0;
            })
            .filter((row) => {
                const trxId = Number(row?.trx_id ?? 0);
                if (trxId <= 0) return true;
                if (seenTrxIds.has(trxId)) return false;
                seenTrxIds.add(trxId);
                return true;
            })
            .map((row) => ({
                ...row,
                trx_id: Number(row?.trx_id ?? 0) > 0 ? Number(row.trx_id) : null
            }));
    };
    const applyReceiveActionColumn = (me, rows) => {
        const root = getReceiveRoot(me);
        if (!root || !Array.isArray(rows) || !rows.length) return;
        const table = root.querySelector('table');
        if (!table) return;
        const theadRow = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        if (!theadRow || !tbody) return;

        const checkedStateByPoItemId = {};
        tbody.querySelectorAll('input.receive-po-line-cb').forEach((cb) => {
            const id = Number(cb.dataset.poItemId || 0);
            if (id > 0) checkedStateByPoItemId[id] = !!cb.checked;
        });

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

        const liveItems = getReceiveItems(me);

        tbody.querySelectorAll('tr').forEach((tr, idx) => {
            const existingActionCell = Array.from(tr.querySelectorAll('td')).find((cell) => isDeleteCell(cell));
            const row = liveItems[idx] || rows[idx] || {};
            const td = existingActionCell || document.createElement('td');
            td.className = 'text-center align-middle';
            td.setAttribute('data-receive-po-col', '1');
            td.innerHTML = '';
            const poItemId = Number(row.id || 0);
            const itemId = Number(row.item_id ?? 0);
            const alreadySaved = isReceiveLineAlreadySaved(row);
            if (alreadySaved && itemId > 0 && poItemId > 0) {
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'form-check-input receive-po-line-cb';
                cb.title = 'This line already has a saved receipt';
                cb.dataset.poItemId = String(poItemId);
                cb.dataset.receiveLineSaved = '1';
                cb.checked = true;
                cb.disabled = true;
                applyReceiveCheckboxUi(cb);
                td.appendChild(cb);
                setReceiveQtyLocked(tr, true);
            } else if (itemId > 0) {
                const recvRaw = getReceiveQtyRaw(row);
                const receiveQtyNum = (recvRaw != null && recvRaw !== '' && !Number.isNaN(Number(recvRaw)))
                    ? Number(recvRaw)
                    : 0;
                const canMark = poItemId > 0 && receiveQtyNum > 0;
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'form-check-input receive-po-line-cb';
                cb.title = 'Receive this line';
                cb.dataset.poItemId = String(poItemId || '');
                cb.disabled = !canMark;
                applyReceiveCheckboxUi(cb);

                if (checkedStateByPoItemId[poItemId]) {
                    cb.checked = true;
                }
                td.appendChild(cb);
                setReceiveQtyLocked(tr, cb.checked);
            } else {
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'form-check-input receive-po-line-cb';
                cb.disabled = true;
                cb.dataset.poItemId = '';
                applyReceiveCheckboxUi(cb);
                td.appendChild(cb);
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
    const refreshReceiveLineActionsInPlace = (me, rows) => {
        const root = getReceiveRoot(me);
        if (!root || !Array.isArray(rows) || !rows.length) return;
        const table = root.querySelector('table');
        const tbody = table && table.querySelector('tbody');
        if (!tbody) return;
        const trList = tbody.querySelectorAll('tr');
        let needFull = false;
        trList.forEach((tr) => {
            const td = tr.querySelector('td[data-receive-po-col]');
            if (!td) {
                needFull = true;
                return;
            }
            const cb = td.querySelector('.receive-po-line-cb');
            if (!cb) return;
            if (cb.dataset.receiveLineSaved === '1') {
                cb.checked = true;
                cb.disabled = true;
                applyReceiveCheckboxUi(cb);
                setReceiveQtyLocked(tr, true);
                return;
            }

            const poItemId = Number(cb.dataset.poItemId || 0);
            const qtyInput = getReceiveQtyInputInRow(tr);
            if (!qtyInput) return;
            const receiveQtyNum = Number(qtyInput.value);
            if (Number.isNaN(receiveQtyNum)) return;

            const canMark = poItemId > 0 && receiveQtyNum > 0;
            cb.disabled = !canMark;
            applyReceiveCheckboxUi(cb);
            setReceiveQtyLocked(tr, cb.checked);
        });
        if (needFull) syncReceiveActionColumn(me, rows);
    };
    const refreshReceiveQtyDependentUi = (me) => {
        if (typeof me.updateReceiveTotals === 'function') me.updateReceiveTotals();
        refreshReceiveLineActionsInPlace(me, getReceiveItems(me));
        scheduleReceiveProgressBadgeUpdate(me);
    };
    const RECV_QTY_INPUT_SEL = ['input[data-field="receive_qty"]', 'input[name="receive_qty"]', 'input[data-field="recieve_amount"]', 'input[name="recieve_amount"]', 'input[data-name="receive_qty"]', 'input[data-name="recieve_amount"]'];
    const getReceiveQtyCellInRow = (tr) => {
        if (!tr?.querySelectorAll) return null;
        for (let i = 0; i < RECV_QTY_INPUT_SEL.length; i++) {
            const el = tr.querySelector(RECV_QTY_INPUT_SEL[i]);
            if (el) return el.closest('td');
        }
        const isRecvInp = (el) => {
            const nm = el.getAttribute?.('name'), df = el.dataset?.field, dn = el.dataset?.name, id = el.getAttribute?.('id');
            return ['receive_qty', 'recieve_amount'].some((k) => nm === k || df === k || dn === k || (id && String(id).includes(k)));
        };
        const hit = Array.from(tr.querySelectorAll('input')).find(isRecvInp);
        if (hit) return hit.closest('td');
        const ths = tr.closest?.('table')?.querySelector?.('thead tr')?.querySelectorAll?.('th');
        if (!ths) return null;
        const idx = Array.from(ths).findIndex((th) => String(th.textContent || '').trim().toLowerCase() === 'received qty');
        return idx < 0 ? null : (tr.querySelectorAll('td')[idx] || null);
    };
    const getReceiveQtyInputInRow = (tr) => {
        const recvTd = getReceiveQtyCellInRow(tr);
        if (!recvTd) return null;
        return recvTd.querySelector('input:not([type="hidden"]), textarea, select, [contenteditable="true"], [contenteditable=""]') || null;
    };

    const setReceiveQtyLocked = (tr, locked) => {
        const recvTd = getReceiveQtyCellInRow(tr);
        if (!recvTd) return;
        recvTd.querySelectorAll('input, textarea, select, button').forEach((el) => {
            if (String(el.type || '').toLowerCase() === 'hidden') return;
            el.disabled = !!locked;
            if ('readOnly' in el) el.readOnly = !!locked;
        });
        recvTd.querySelectorAll('[contenteditable]').forEach((el) => {
            el.setAttribute('contenteditable', locked ? 'false' : 'true');
        });
        recvTd.style.pointerEvents = locked ? 'none' : '';
    };
    const refreshReceivePoHeaderStatus = (me) => {
        const poId = me.dataOptions?.id;
        if (!poId) return Promise.resolve(null);
        return vsapi.call(`${main_view.base_url}/prm/purchase/order/form-options`, { id: poId }, null, false)
            .then((res) => {
                if (res && res.status_code === 200 && res.data && res.data.po_details) {
                    me._receivePoStatusId = res.data.po_details.status_id;
                    return me._receivePoStatusId;
                }
                return null;
            })
            .catch(() => null);
    };
    /** Real line: Receive amount + Break Amount must equal Ordered Qty (saved on item). */
    const isReceiveLineRowComplete = (it) => {
        const itemId = Number(it.item_id ?? 0);
        if (!itemId || itemId <= 0) return true;
        const ordered = Number(it.qty) || 0;
        if (ordered <= 0) return true;
        if (Number(it.status_id) === 2) return true;
        const recvRaw = getReceiveQtyRaw(it);
        const recv = Number(recvRaw) || 0;
        const brk = Number(it.break_amount) || 0;
        return (recv + brk) + 1e-6 >= ordered;
    };
    const validateAllReceiveLinesComplete = (me) => {
        const items = getReceiveItems(me);
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
        const items = getReceiveItems(me);
        let row = items.find((it) => Number(it.id) === id);
        if (!row && tr && tr.parentNode) {
            const rows = Array.from(tr.parentNode.querySelectorAll('tr'));
            const idx = rows.indexOf(tr);
            if (idx >= 0) row = items[idx];
        }
        const orderedQty = row && row.qty != null && !Number.isNaN(Number(row.qty)) ? Number(row.qty) : 0;
        const receiveRaw = row && getReceiveQtyRaw(row);
        const receiveQty = receiveRaw != null && !Number.isNaN(Number(receiveRaw)) ? Number(receiveRaw) : 0;
        const breakAmount = row && row.break_amount != null && !Number.isNaN(Number(row.break_amount))
            ? Number(row.break_amount)
            : 0;
        return { orderedQty, receiveQty, breakAmount, row };
    };
    const setReceiveLineRowLoading = (tr, isLoading) => {
        if (!tr) return;
        const cb = tr.querySelector('.receive-po-line-cb');
        if (!cb) return;
        if (!isLoading && cb.dataset.receiveLineSaved === '1') {
            cb.checked = true;
            cb.disabled = true;
            applyReceiveCheckboxUi(cb);
            return;
        }
        cb.disabled = isLoading;
    };
    const resetLineCheckbox = (tr) => {
        const cb = tr && tr.querySelector ? tr.querySelector('.receive-po-line-cb') : null;
        if (cb) cb.checked = false;
    };
    const refreshReceiveActions = (me) => refreshReceiveLineActionsInPlace(me, getReceiveItems(me));
    /**
     * @param {object} opts - silent: no toast; skipReload: no table reload (batch mode)
     * @returns {Promise<boolean>} true if line saved OK
     */
    const submitReceivePoLine = (me, tr, poItemId, loadingEl, opts = {}) => {
        const silent = opts.silent === true;
        const skipReload = opts.skipReload === true;
        const clearCb = () => {
            const cb = tr && tr.querySelector('.receive-po-line-cb');
            if (cb) cb.checked = false;
        };
        const poId = me.dataOptions && me.dataOptions.id;
        if (!poId || !poItemId) {
            clearCb();
            cv_interact.error('Invalid line.');
            return Promise.resolve(false);
        }
        const existingCb = tr && tr.querySelector('.receive-po-line-cb');
        if (existingCb && existingCb.dataset.receiveLineSaved === '1') {
            return Promise.resolve(true);
        }
        if (Number(me._receivePoStatusId) === PO_HEADER_STATUS.RECEIVED) {
            clearCb();
            cv_interact.warning('This purchase order is already fully received.');
            return Promise.resolve(false);
        }
        const { orderedQty, receiveQty, breakAmount } = getReceiveLineRowData(me, poItemId, tr);
        const rq = Number(receiveQty) || 0;
        const ba = Number(breakAmount) || 0;
        const oq = Number(orderedQty) || 0;
        if (Number.isNaN(rq) || rq < 0) {
            clearCb();
            cv_interact.error('Receive qty must be 0 or greater.');
            return Promise.resolve(false);
        }
        if (Number.isNaN(ba) || ba < 0) {
            clearCb();
            cv_interact.error('Break amount must be 0 or greater.');
            return Promise.resolve(false);
        }
        if ((rq + ba) > oq) {
            clearCb();
            cv_interact.error('Receive qty + break amount cannot exceed ordered qty.');
            return Promise.resolve(false);
        }
        setReceiveLineRowLoading(tr, true);
        return vsapi.call(`${main_view.base_url}/prm/purchase/order/receive`, {
            id: poId,
            po_item_ids: [poItemId],
            receive_qty: rq,
            break_amount: ba
        }, loadingEl || tr.querySelector('.receive-po-line-cb') || tr).then((res) => {
            if (res.status_code === 200) {
                if (!silent) cv_interact.success(res.message || 'Line received.');
                if (!skipReload) {
                    refreshReceivePoHeaderStatus(me);
                    return loadReceivePurchaseOrder(me)
                        .then(() => {
                            if (mThis.PoListView && mThis.getFilterData) {
                                mThis.PoListView.showPage(mThis.getFilterData());
                            }
                            return true;
                        })
                        .catch(() => true);
                }
                return true;
            }
            resetLineCheckbox(tr);
            setReceiveLineRowLoading(tr, false);
            refreshReceiveActions(me);
            cv_interact.warning(res.error_message || 'Could not receive line.');
            return false;
        }).catch(() => {
            resetLineCheckbox(tr);
            setReceiveLineRowLoading(tr, false);
            refreshReceiveActions(me);
            return false;
        }).then((ok) => {
            if (ok && skipReload) {
                const cb = tr && tr.querySelector('.receive-po-line-cb');
                if (cb) {
                    cb.dataset.receiveLineSaved = '1';
                    cb.checked = true;
                }
                setReceiveLineRowLoading(tr, false);
                setReceiveQtyLocked(tr, true);
            }
            return ok;
        });
    };
    /**
     * Save all checked lines before final PO confirmation.
     * Checkbox is selection-only, so confirmation must persist selected rows first.
     */
    const saveCheckedReceiveLines = (me, triggerEl) => {
        const root = getReceiveRoot(me);
        if (!root) return Promise.resolve(true);
        const checked = Array.from(root.querySelectorAll('tbody .receive-po-line-cb:checked'))
            .filter((el) => !el.disabled);
        if (!checked.length) return Promise.resolve(true);

        return checked.reduce((chain, cb) => {
            return chain.then((ok) => {
                if (!ok) return false;
                const tr = cb.closest('tr');
                const poItemId = Number(cb.dataset.poItemId);
                return submitReceivePoLine(me, tr, poItemId, triggerEl, { silent: true, skipReload: true });
            });
        }, Promise.resolve(true)).then((ok) => {
            if (!ok) return false;
            return refreshReceivePoHeaderStatus(me).then(() => {
                scheduleReceiveProgressBadgeUpdate(me);
                return true;
            });
        });
    };
    const bindReceiveLineActionDelegation = (me) => {
        const root = getReceiveRoot(me);
        if (!root || root.dataset.receiveLineDelegateBound === '1') return;
        root.dataset.receiveLineDelegateBound = '1';
        root.addEventListener('change', (e) => {
            const cb = e.target && e.target.closest && e.target.closest('.receive-po-line-cb');
            if (!cb || cb.disabled) return;
            const poItemId = Number(cb.dataset.poItemId);
            const tr = cb.closest('tr');
            if (Number(me._receivePoStatusId) === PO_HEADER_STATUS.RECEIVED) {
                cb.checked = false;
                setReceiveQtyLocked(tr, false);
                return cv_interact.warning('This purchase order is already fully received.');
            }
            if (cb.checked) {
                const { receiveQty } = getReceiveLineRowData(me, poItemId, tr);
                if (Number(receiveQty) <= 0) {
                    cb.checked = false;
                    setReceiveQtyLocked(tr, false);
                    return cv_interact.warning('Enter received qty before selecting a line.');
                }
            }
            setReceiveQtyLocked(tr, cb.checked);
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
                if (el.classList && el.classList.contains('receive-po-line-cb')) return;
                const nm = el.getAttribute('name') || '';
                const df = el.dataset && el.dataset.field ? el.dataset.field : '';
                if (nm === 'receive_qty' || df === 'receive_qty' || nm === 'recieve_amount') return;
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
                applyPoHeaderToDialog(me, poDetails, vendors, false);

                if (me._itemOptions && me.receiveItemsView?.setSelectOptions) {
                    me.receiveItemsView.setSelectOptions('item_id', mapItemSelectOptions(me._itemOptions), null);
                }

                const items = normalizeItems(itemsRes.data);

                const rows = mapReceiveRows(items);

                setItemsViewRows(me.receiveItemsView, rows);
                renderItemsView(me.receiveItemsView);

                setTimeout(() => {
                    bindReceiveLineActionDelegation(me);
                    syncReceiveActionColumn(me, rows);
                    lockReceivePurchaseOrderFields(me);
                    if (typeof me.updateReceiveTotals === 'function') me.updateReceiveTotals();
                    updateReceiveProgressBadge(me);
                }, 60);

                me._receivePoStatusId = poDetails.status_id;
                if (!items.length) {
                    cv_interact.warning('This purchase order has no items.');
                }
                return items;
            });
    };
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
            title: "Total Price",
            className: "align-middle text-nowrap text-end",
            data: (data) =>
                `<span class="d-block text-prm-custom">${data.sub_total_formatted ?? formatCurrency(data.sub_total)}</span>`,
        },
        {
            title: "Discount",
            className: "align-middle text-nowrap text-end",
            data: (data) =>
                `<span class="d-block text-prm-custom">${data.discount_formatted ?? formatDiscount(data)}</span>`,
        },
        {
            title: "Total Amount",
            className: "align-middle text-nowrap text-end",
            data: (data) =>
                `<span class="d-block text-prm-custom">${data.total_amount_formatted ?? formatCurrency(data.total_amount)}</span>`,
        },
        {
            title: "Authorized By",
            className: 'align-middle text-nowrap text-center',
            data: (data) => {
                return `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom"><span>${data.authorizer ?? ''}</span></span>
                <span class="text-start small text-muted">${data.auth_date ?? ''}</span>
            </div>`;

            }
        },
        {
            title: "Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                console.log(123,data.status);

                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'pending') {
                    cls = 'badge text-warning bg-warning-subtle border border-warning';
                }
                else if (status === 'approved') {
                    cls = 'badge text-info bg-info-subtle border border-info';
                }
                else if (status === 'ordered') {
                    cls = 'badge text-primary bg-primary-subtle border border-primary';
                }
                else if (status === 'cancelled') {
                    cls = 'badge text-danger bg-danger-subtle border border-danger';
                }
                else if (status === 'partially') {
                    cls = 'badge text-dark bg-warning-subtle border border-warning';
                }
                else if (status === 'received') {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ''}
                    </span>
                `;
            },
            // data: (data) => poStatusBadgeHtml(data),
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
            title: "Received By",
            className: 'align-middle text-nowrap',
            data: (data) => {
                return `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom"><span>${data.authorizer ?? ''}</span></span>
                <span class="text-start small text-muted">${data.auth_date ?? ''}</span>
            </div>`;

            }
        },

        {
            transTitle: 'titles.Updated By',
            className: 'align-middle text-nowrap',
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                <span class="text-muted">${data.updated_at ?? ''}</span>
            </div>`,
        },
        {
            transTitle: 'titles.Action',
            className: 'col_action align-middle',
            data: (data) => {
                const isFullyReceived = Number(data.status_id) === PO_HEADER_STATUS.RECEIVED;
                const actionClass = isFullyReceived
                    ? 'btn_dropdown_purchase_received'
                    : 'btn_dropdown_purchase_action';
                return `<div class="d-flex justify-content-center align-items-end"><a href="javascript:void(0)" class="btn--Options ${actionClass}" data-id="${data.id}" data-authorized="${data.authorized}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i></a></div>`;
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

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PoListView.showPage(mThis.getFilterData());
                }
            };
            showPurchaseOrderDialog(op);
        };


        mThis.pr_tbl = mThis.PoListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        sh_parent.classList.add("overflow-y-auto");
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
                'btn_dropdown_purchase_action',
                'btn_dropdown_purchase_received',
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
    const resolvePoIdFromMenuContext = (id, menuLink) => {
        let poId = id;
        const btn = typeof menuLink === 'object' && menuLink?.target ? menuLink.target : menuLink;
        const el = (btn && btn.closest) ? btn.closest('[data-id]') : null;
        if ((!poId || Number(poId) <= 0) && el && el.dataset && el.dataset.id) poId = el.dataset.id;
        const row = (btn && btn.closest) ? btn.closest('tr') : null;
        if ((!poId || Number(poId) <= 0) && row && row.dataset && row.dataset.id) poId = row.dataset.id;
        const n = Number(poId);
        return Number.isNaN(n) || n <= 0 ? null : n;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_purchase_action",
            cssClass: "bg-white shadow",
            menus: [

                {
                    html: '<span class="ps-2" vslang="titles.Modify PO"></span>',
                    icon: `<i class="fa-solid fa-square-pen fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_purchase_order"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete PO"></span>',
                    icon: `<i class="fa-solid fa-rectangle-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_purchase_order"
                },

                {
                    html: '<span class="ps-2  " vslang="titles.Authorized PO"></span>',
                    icon: `<i class="fa-solid fa-check-to-slot fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "authorized_purchase_order"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Receive PO"></span>',
                    icon: `<i class="fa-solid fa-box-open fs-5 text-success"></i>`,
                    cssClass: '',
                    name: "receive_purchase_order"
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
                    case 'receive_purchase_order': {
                        mThis.receivePurchaseOrder(id, menuLink);
                        break;
                    }
                    case 'authorized_purchase_order': {
                        mThis.authorizedPurchaseOrder(id, menuLink);
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
            }
        }
        new VSDropdownMenu(menuOptopns);
    };
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
                const items = normalizeItems(res.data);
                const rows = items.map((item) => `
                    <tr>
                        <td class="text-nowrap">${item.code ?? ''}</td>
                        <td class="text-nowrap">${item.item_name ?? ''}</td>
                        <td class="text-nowrap">${formatQty(item.qty)}</td>
                        <td class="text-nowrap">${item.unit ?? ''}</td>
                        <td class="text-nowrap">${item.unit_price_formatted ?? formatCurrency(item.unit_price)}</td>
                        <td class="text-nowrap">${item.total_price_formatted ?? formatCurrency(item.total_price)}</td>
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
    mThis.authorizedPurchaseOrder = (id, btn) => {
        const authorized = btn.dataset.authorized;
        let op = {
            po_id: id
        };
        if (authorized == 1) {
            cv_interact.warning('You already authorized this Purchase order.');
        }
        else {
            cv_interact.confirm('Are you sure you want to authorize this purchase order?',
                {
                    title: 'Authorize Purchase order',
                    context: 'update',
                    confirmButtonText: 'Authorize'
                },
                (e) => {
                    if (e) {
                        vsapi.call(`${main_view.base_url}/prm/purchase/order/authorized`, op, false, null, null).then(res => {
                            if (res.status_code === 200) {
                                mThis.PoListView.showPage(mThis.getFilterData());
                                cv_interact.success('Purchase Order has been authorized!');
                            }
                            else
                                cv_interact.error(res.error_message);
                        });
                    }
                });
        }

    };
    mThis.editPurchaseOrder = (id, menuLink) => {
        const poId = resolvePoIdFromMenuContext(id, menuLink);
        if (!poId) return cv_interact.warning('Invalid purchase order.');
        const op = {
            id: poId,
            btn: menuLink,
            onClose: () => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        };
        showPurchaseOrderDialog(op);
    };
    mThis.receivePurchaseOrder = (id, menuLink) => {
        const poId = resolvePoIdFromMenuContext(id, menuLink);
        if (!poId) return cv_interact.warning('Invalid purchase order.');
        showReceivePurchaseOrderDialog({ id: poId, btn: menuLink });
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
    const showPurchaseOrderDialog = (op) => {
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
                    if (titleEl2) titleEl2.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order1</h2>';

                    const formData = formRes.data || {};
                    const poDetails = formData.po_details || {};
                    const vendors = formData.vendors || [];
                    applyPoHeaderToDialog(me, poDetails, vendors, true);

                    if (me._itemOptions && me.purchaseItemsView?.setSelectOptions) {
                        me.purchaseItemsView.setSelectOptions('item_id', mapItemSelectOptions(me._itemOptions), null);
                    }

                    return vsapi.call(`${main_view.base_url}/prm/purchase/order/items-by-po`, { id: editPoId, po_id: editPoId }, null, false);
                })
                .then(itemsRes => {
                    if (!itemsRes || itemsRes.status_code !== 200) {
                        throw new Error(itemsRes?.error_message || 'Failed to load purchase order items');
                    }
                    const items = normalizeItems(itemsRes.data);

                    const rows = mapEditRows(items);

                    // ItemsView implementations differ; `setData()` does not always bind into the grid.
                    // Prefer rebuilding via `addRow()` when available (used elsewhere, e.g. InvoiceComponent).
                    setItemsViewRows(me.purchaseItemsView, rows);
                    renderItemsView(me.purchaseItemsView);
                    removeLeadingEmptyItemRow(me.purchaseItemsView);
                    if (typeof me.updatePOTotals === 'function') me.updatePOTotals();
                    if (!items.length) {
                        cv_interact.warning('This purchase order has no items (items-by-po returned empty).');
                    }
                    return items;
                });
        };
        PurchaseOrderDialog = PurchaseOrderDialog || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
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
            createContent: () => {
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
            configSelect: [
            ],
            contentCreated: (me) => {
                const applyVendorInfo = (vendorId) => {
                    me._selectedVendorId = vendorId || '';
                    if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                    if (!vendorId) {
                        if (me.controls.phone_number) me.controls.phone_number.value = '';
                        if (me.controls.address) me.controls.address.value = '';
                        return;
                    }
                    loadVendorInfo(me, vendorId);
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
                        { name: "item_id", transTitle: "titles.Item", displayType: "select" },
                        { name: "qty", transTitle: "titles.Qty", dataType: "number", defaultValue: 1, isNumeric: true },
                        { name: "unit", transTitle: "titles.Unit", displayType: "select" },
                        { name: "unit_price", transTitle: "titles.UnitPrice", dataType: "number", defaultValue: 0, isNumeric: true },
                        { name: "total_price", transTitle: "titles.TotalPrice", readOnly: true, dataType: "number", isNumeric: true }
                    ],
                    calc: { mode: "auto", qtyField: "qty", priceField: "unit_price", totalField: "total_price", currencyPrecision: 2 },
                    totalSummary: { container: "#sum", showTax: false, allowDiscount: false, currency: "USD" },
                    validateColumns: { item_id: "positive", qty: "positive", unit: "positive", unit_price: "positive" },
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: true,
                    addLineButtonText: 'Add Item',
                    onItemChange: async (row_id, item, col_name, td, tr) => {
                        if (col_name !== 'item_id') {
                            if (typeof me.updatePOTotals === 'function') me.updatePOTotals();
                            return;
                        }
                        // ItemsView / setCellValue may fire item_id again for the same row; per-row flag avoids loops
                        // (and avoids clobbering parallel edits on other rows).
                        if (!tr || tr.dataset.poItemDetailHydrate === '1') return;

                        if (typeof me.updatePOTotals === 'function') me.updatePOTotals();

                        const itemId = item.item_id || item.id;
                        if (!itemId) return;

                        const res = await vsapi.call(`${main_view.base_url}/prm/item/details`, {
                            item_id: itemId,
                            vendor_id: me.dataOptions.vendor_id || me.dataOptions.owner_id
                        }, false);
                        const itemDetails = res.data || {};
                        me.current_item = itemDetails;
                        tr.dataset.code = itemDetails.code || '';

                        if (!me.purchaseItemsView.setCellValue) return;

                        tr.dataset.poItemDetailHydrate = '1';
                        try {
                            // Keep selected item visible in the row (label/value), not back to "Select Item".
                            me.purchaseItemsView.setCellValue(tr, 'item_id', itemId);
                            const itemSelectEl = tr.querySelector('[name="item_id"], [data-field="item_id"]');
                            if (itemSelectEl && itemSelectEl.tagName === 'SELECT') {
                                let hasOption = false;
                                for (let i = 0; i < itemSelectEl.options.length; i++) {
                                    if (String(itemSelectEl.options[i].value) === String(itemId)) {
                                        hasOption = true;
                                        break;
                                    }
                                }
                                if (!hasOption && itemDetails?.name) {
                                    itemSelectEl.add(new Option(itemDetails.name, itemId, false, false));
                                }
                                itemSelectEl.value = String(itemId);
                                // Do not dispatch a synthetic "change" here — ItemsView will call onItemChange again
                                // and this handler awaits the API, causing an infinite loop.
                            }
                            if (itemDetails.unit_id != null || itemDetails.unit != null) {
                                me.purchaseItemsView.setCellValue(tr, 'unit', normalizeUnit(itemDetails.unit_id ?? itemDetails.unit));
                            }
                        } finally {
                            delete tr.dataset.poItemDetailHydrate;
                        }

                        if (typeof me.updatePOTotals === 'function') me.updatePOTotals();
                    },
                });
                const itemListEl = me.divModal.querySelector('#purchase_item_list');
                if (itemListEl) {
                    itemListEl.addEventListener('input', () => { if (typeof me.updatePOTotals === 'function') me.updatePOTotals(); });
                    itemListEl.addEventListener('change', () => { if (typeof me.updatePOTotals === 'function') me.updatePOTotals(); });
                }
                applyUnitOptions(me.purchaseItemsView);
                me.updatePOTotals = () => {
                    if (!me.divModal || !me.purchaseItemsView) return;
                    const items = getCleanPurchaseItems(me.purchaseItemsView);
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
                    const totals = calcTotals(subTotal, discountVal, discountType);
                    writeTotalsToDom(me.divModal, {
                        subtotal: '#po_subtotal_display',
                        tax: '#po_tax_display',
                        total: '#po_total_display',
                    }, totals);
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
                    if (me.controls.discount_value) me.controls.discount_value.value = '0';
                    if (me.controls.discount_type) me.controls.discount_type.value = 'percent';
                    me.purchaseItemsView.setData(null);
                    me.updatePOTotals();
                };
                bindTotalsInputListeners(me, ['discount_value', 'discount_type'], () => me.updatePOTotals());
                me.updatePOTotals();
            },
            onShow: (me) => {
                const editPoId = getEditPoId(me);
                if (!editPoId) return;

                const tryLoad = (attempt = 0) => {
                    if (!me.purchaseItemsView || typeof me.purchaseItemsView.setData !== 'function') {
                        if (attempt < 60) return setTimeout(() => tryLoad(attempt + 1), 50);
                        return cv_interact.error('Purchase items view not ready.');
                    }
                    loadPurchaseOrderForEdit(me, editPoId)
                        .catch((err) => {
                            cv_interact.error(err?.message || 'Failed to load purchase order for edit.');
                        });
                };

                // Run after GeneralDialog internal setData() which can clear [name] controls.
                setTimeout(() => tryLoad(0), 0);
            },
            buttons: [
                {
                    label: "Cancel",
                    cssClass: "btn btn-warning",
                    click: (me, btn) => {
                        me.hide(false);
                    }
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-primary",
                    click: (me) => {
                        let p = me.getData();
                        if (!me.purchaseItemsView || typeof me.purchaseItemsView.getItems !== 'function') {
                            return cv_interact.error('Purchase items are not ready. Please try again.');
                        }
                        p.items = getCleanPurchaseItems(me.purchaseItemsView);
                        if (!hasValidPurchaseOrderLineItems(p.items)) {
                            return cv_interact.error('Please select at least one item before saving the purchase order.');
                        }
                        p.vendor_id = me._selectedVendorId;

                        const savePoId = _currentEditPoId ?? me._editPoId ?? (me.dataOptions && me.dataOptions.id);
                        if (savePoId) p.id = savePoId;
                        vsapi.call(`${main_view.base_url}/prm/purchase/order/save`, p, false).then(res => {
                            if (res.status_code == 200) {
                                cv_interact.success(savePoId ? 'Purchase order updated.' : 'Purchase order created.');
                                me.hide(true);
                                mThis.PoListView.showPage(mThis.getFilterData());
                            } else cv_interact.warning(res.error_message);
                        });
                    }
                }
            ],
            onPrepareForm: (me, data) => {
                const editPoId = getEditPoId(me);
                const isModify = !!editPoId;
                const titleEl = me.divModal.querySelector('.modal-title');
                if (titleEl) {
                    titleEl.innerHTML = isModify
                        ? '<h2 class="text-prm-custom text-start fw-bold">Modify Purchase Order2</h2>'
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
            prepareFormOptions: {
                modifyTitle: "Purchase Order",
                createTitle: "Create Purchase Order",
                targetProp: "item_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/item/form-options`,
                    params: (dataOptions) => {
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
                setData: (dlg, data) => setDialogDataExcluding(dlg, data, '#receive_purchase_item_list'),
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
                        <div class="mb-3 d-flex align-items-center flex-wrap gap-2">
                            <span class="fw-bold text-prm-custom">Receive status</span>
                            <span class="mx-1">:</span>
                            <span id="receive_po_progress_badge" class="badge text-secondary bg-secondary-subtle border border-secondary text-capitalize d-inline-block text-center" style="${PENDING_RECEIVE_BADGE_STYLE}">Pending</span>
                        </div>
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
                        { name: 'receive_qty', transTitle: 'Received Qty', dataType: 'number', defaultValue: 0, isNumeric: true, readOnly: false },
                        { name: 'unit_price', transTitle: 'titles.Unit Price', dataType: 'number', defaultValue: 0, isNumeric: true, readOnly: true },
                        { name: 'total_price', transTitle: 'titles.Total Price', readOnly: true, dataType: 'number', isNumeric: true }
                    ],
                    calc: { mode: 'auto', qtyField: 'qty', priceField: 'unit_price', totalField: 'total_price', currencyPrecision: 2 },
                    totalSummary: { container: '#sum', showTax: false, allowDiscount: false, currency: 'USD' },
                    validateColumns: {},
                    tableClass: 'table',
                    showColumnHeaders: true,
                    showAddLineButton: false,
                    addLineButtonText: 'Add Item',
                    onItemChange: (row_id, item, col_name) => {
                        if (col_name !== 'receive_qty') return;
                        refreshReceiveQtyDependentUi(me);
                    },
                    keyup: (e, col_name) => {
                        if (col_name !== 'receive_qty') return;
                        refreshReceiveQtyDependentUi(me);
                    }
                });
                applyUnitOptions(me.receiveItemsView);

                me.updateReceiveTotals = () => {
                    if (!me.divModal || !me.receiveItemsView) return;
                    const items = me.receiveItemsView.getItems ? me.receiveItemsView.getItems() : [];
                    let subTotal = 0;
                    if (Array.isArray(items)) {
                        items.forEach((it) => {
                            const receiveAmt = Number(getReceiveQtyRaw(it)) || 0;
                            const unitPrice = Number(it.unit_price) || 0;
                            subTotal += receiveAmt * unitPrice;
                        });
                    }
                    const discountEl = me.controls.discount_value || me.divModal.querySelector('[data-field="discount_value"]');
                    const discountTypeEl = me.controls.discount_type || me.divModal.querySelector('[data-field="discount_type"]');
                    const discountVal = Number(discountEl?.value) || 0;
                    const discountType = (discountTypeEl?.value || 'percent') === 'percent' ? 'percent' : 'amount';
                    const totals = calcTotals(subTotal, discountVal, discountType);
                    writeTotalsToDom(me.divModal, {
                        subtotal: '#receive_po_subtotal_display',
                        tax: '#receive_po_tax_display',
                        total: '#receive_po_total_display',
                    }, totals);
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
                        if (Number(me._receivePoStatusId) === PO_HEADER_STATUS.RECEIVED) {
                            return cv_interact.warning('This purchase order is already fully received.');
                        }
                        saveCheckedReceiveLines(me, btn).then((savedOk) => {
                            if (!savedOk) return;
                            if (Number(me._receivePoStatusId) === PO_HEADER_STATUS.RECEIVED) {
                                cv_interact.success('Purchase order confirmed as received.');
                                me.hide(true);
                                if (mThis.PoListView && mThis.getFilterData) {
                                    mThis.PoListView.showPage(mThis.getFilterData());
                                }
                                return;
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
                                    me._receivePoStatusId = PO_HEADER_STATUS.RECEIVED;
                                    me.hide(true);
                                    if (mThis.PoListView && mThis.getFilterData) {
                                        mThis.PoListView.showPage(mThis.getFilterData());
                                    }
                                } else {
                                    cv_interact.warning(res.error_message || 'Could not confirm purchase order.');
                                }
                            });
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



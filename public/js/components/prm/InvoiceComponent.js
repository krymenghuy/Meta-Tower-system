"use strict";


var InvoiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = '$';
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoice_component");
    mThis.btnAdd          = mThis.self.querySelector("#_btnInvoice");
    mThis.btnAddTest          = mThis.self.querySelector("#_btnInvoice_test");
    mThis.divFilter       = mThis.self.querySelector("#_divFilter_invoice");
    mThis.elFilter_status = mThis.self.querySelector('#payment_status');
    mThis.elBuilding      = mThis.self.querySelector('#building_id');
    mThis.elSpaceType     = mThis.self.querySelector('#space_type_id');
    mThis.elTenant        = mThis.self.querySelector('#tenant_id');
    mThis.elSearch        = mThis.self.querySelector("#_search_invoice");

    mThis.cols = [
        { transTitle: "", className: "align-middle text-capitalize" },
        { transTitle: "titles.Invoice Num", className: "align-middle text-start",
            data: (data) => `<span class="text-yp-custom">${data.code || 'N/A'}</span>` },
        { transTitle: "titles.Tenant", className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.tenant_name || '—'}</span>` },
        { transTitle: "titles.Space Code", className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.space_code || '—'}</span>` },
        { transTitle: "titles.Amount", className: "align-middle text-primary",
            data: (data) => {
                const amt = data.amount ? Number(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        { transTitle: "titles.Paid", className: "align-middle text-success",
            data: (data) => {
                const amt = data.paid_amount ? Number(data.paid_amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        { transTitle: "titles.Balance", className: "align-middle text-danger",
            data: (data) => {
                const amt = data.balance ? Number(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        { transTitle: "titles.Due Date", className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.due_date || 'N/A'}</span>` },
        { transTitle: "titles.Status", className: "align-middle text-center",
            data: (data) => {
                const statusName = (data.payment_status_name || '').toLowerCase();
                let cls = 'bg-secondary';
                if (statusName === 'paid')               cls = 'bg-success';
                else if (statusName === 'unpaid')        cls = 'bg-danger';
                else if (statusName.includes('partial')) cls = 'bg-warning text-dark';
                return `<span class="badge ${cls} text-capitalize px-2 py-1">${data.payment_status_name || '—'}</span>`;
            }
        },
        { transTitle: "titles.Updated By", className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user || '—'}</span>
                    <small class="text-muted">${data.updated_at || '—'}</small>
                </div>`
        },
        { transTitle: "titles.Action", className: "col_action align-middle text-center",
            data: (data) => `
                <div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action"
                        data-id="${data.id}" data-statusid="${data.payment_status_id || ''}">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.InvoiceListView = new ListView('_invoice_list', {
            fetchApi: `${main_view.base_url}/prm/invoice/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.payment_status_id;
                tr.classList.add('invoice');
                tr.id = `invoice_id_${data.id}`;
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            InvoiceDialog.show({ id: null, btn: e.target,
                onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData()) });
        };
        const pr_tbl    = mThis.InvoiceListView.getListContainer();
        const sh_parent = pr_tbl.parentElement;
        sh_parent.style.height = `${window.innerHeight - 200}px`;
        sh_parent.classList.add("overflow-y-auto", "overflow-x-hidden");
        window.addEventListener('resize', () => {
            sh_parent.style.height = `${window.innerHeight - 200}px`;
        }, { passive: true });

        mThis.tblInvoice = mThis.InvoiceListView.getTable();
        mThis.initDropdownMenus(mThis.tblInvoice);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.InvoiceListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener('input', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.InvoiceListView.showPage(mThis.getFilterData());
            }, 350);
        });

        new ExpandableRowConfig(mThis.tblInvoice.id, {
            dontExpandByClickingOn: ['btn_leave_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.id.replace('invoice_id_', '');
                if (id && !isNaN(id)) mThis.displayInvoiceDetail(container, id);
            }
        });

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }
                mThis.renderInvoiceDetail(container, res.data || {});
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice details</div>`;
            });
    };

mThis.renderInvoiceDetail = (container, invoice) => {
    const currency = mThis.currency_symbol || '$';
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const itemsHtml = (invoice.items || []).map(item => {
        // Use real type from backend
        const rawType = (item.type || 'service').toLowerCase().trim();

        let badgeClass = 'bg-light border text-dark';
        if (rawType === 'rent')    badgeClass = 'bg-primary text-white border-0';
        if (rawType === 'utility') badgeClass = 'bg-warning text-dark border-0';

        const qty     = Number(item.qty || 1);
        const price   = Number(item.price || (item.amount / (qty || 1)) || 0);
        const amount  = qty * price;
        const disc    = Number(item.discount || item.special_discount_value || 0);
        const taxRate = Number(item.tax_rate || 0);
        const taxAmt  = (amount - disc) * (taxRate / 100);
        const net     = amount - disc + taxAmt;

        subtotal      += amount;
        totalDiscount += disc;
        totalTax      += taxAmt;


        const startDate = item.start_date
            ? new Date(item.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';
        const endDate = item.end_date
            ? new Date(item.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';

        return `
            <tr>
                <td class="fw-medium">${ item.remarks || item.description || '—'}</td>
                <td class="text-center">
                    <span class="badge rounded-pill ${badgeClass} px-3 py-1 text-capitalize">
                        ${rawType}
                    </span>
                </td>
                <td class="text-center text-muted small">${item.unit_type ? item.unit_type.trim() : '—'}</td>
                <td class="text-center small">${startDate}</td>
                <td class="text-center small">${endDate}</td>
                <td class="text-end">${currency}${amount.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                <td class="text-end text-danger">-${currency}${disc.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                <td class="text-end text-info">${currency}${taxAmt.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                <td class="text-end fw-bold">${currency}${net.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
            </tr>`;
    }).join('');

    const grandTotal = subtotal - totalDiscount + totalTax;

    container.innerHTML = `
        <div class="bg-white rounded shadow-sm p-3">
            <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                    <thead style="background:#f0f4ff;">
                        <tr>
                            <th class="text-center" style="width:250px;">Description</th>
                            <th class="text-center" style="width:110px;">Type</th>
                            <th class="text-center" style="width:90px;">Charge As</th>
                            <th class="text-center" style="width:110px;">Start Date</th>
                            <th class="text-center" style="width:110px;">End Date</th>
                            <th class="text-end">Amount</th>
                            <th class="text-end">Discount</th>
                            <th class="text-end">Tax</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml || '<tr><td colspan="9" class="text-center py-4 text-muted">No items found</td></tr>'}
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <td colspan="5" class="text-end fw-bold">Total</td>
                            <td class="text-end fw-bold">${currency}${subtotal.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
                            <td class="text-end fw-bold text-danger">-${currency}${totalDiscount.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
                            <td class="text-end fw-bold text-info">${currency}${totalTax.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
                            <td class="text-end fw-bold text-success fs-5">${currency}${grandTotal.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            ${invoice.remarks ? `
                <div class="mt-3 p-3 bg-light rounded border">
                    <small class="text-muted fw-semibold d-block mb-1">Remarks:</small>
                    <p class="mb-0 small">${invoice.remarks}</p>
                </div>
            ` : ''}

            <div class="text-end mt-4">
                <button class="btn btn-sm btn-outline-secondary" onclick="window.print()">
                    <i class="bi bi-printer me-1"></i> Print Invoice
                </button>
            </div>
        </div>`;
};
    mThis.getFilterData = () => {
        const params = {
            payment_status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value.trim()
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            if (el.value) params[el.dataset.field] = el.value;
        });
        return params;
    };

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                { html: '<span class="ps-2">Modify</span>', icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`, cssClass: "border-bottom pb-2", name: "edit_invoice" },
                { html: '<span class="ps-2">Delete</span>',  icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`, cssClass: "border-bottom pb-2", name: "delete_invoice" },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "edit_invoice")        mThis.editInvoice(id, menuLink);
                else if (name === "delete_invoice") mThis.deleteInvoice(id, menuLink);
            }
        });
    };

    mThis.editInvoice = (id, menuLink) => {
        InvoiceDialog.show({ id, btn: menuLink, onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData()) });
    };

    mThis.deleteInvoice = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Are you sure you want to delete this invoice?', {
            transTitle: 'Delete Invoice', confirmButtonText: "Delete", context: 'danger'
        }, (confirmed) => {
            if (!confirmed) return;
            vsapi.call(`${main_view.base_url}/prm/invoice/delete`, { id }, menuLink)
                .then(res => {
                    if (res.status_code === 200) {
                        mThis.InvoiceListView.showPage(mThis.getFilterData());
                        cv_interact.success('Invoice deleted successfully');
                    } else {
                        cv_interact.error(res.error_message || 'Failed to delete');
                    }
                });
        });
    };

    mThis.prepareFormOptions = (callback) => {
        vsapi.call(`${main_view.base_url}/prm/invoice/form-options`)
            .then(res => {
                if (res.status_code === 200) {
                    const d = res.data || {};
                    VSUtil.setComboItems(mThis.elFilter_status, d.statuses,  'id', 'payment_status', '', 'All Statuses');
                    VSUtil.setComboItems(mThis.elBuilding,      d.buildings, 'id', 'building',        '',   'All Buildings');
                }
                if (typeof callback === 'function') callback();
            });
    };

    mThis.show = (options = {}) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.InvoiceListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();


const InvoiceDialog = (() => {
    let dlg = null;
    let availableItem = [];

    const self = {};
    self.show = (op = {}) => {
        dlg = dlg || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label style="padding-left:6px;color:#777;"><i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span></label>
                            <div class="material-input outlined">
                                <input name="tenant" class="data-input form-control" data-field="tenant_id" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label style="padding-left:6px;color:#777;"><i class="fas fa-door-open me-2 text-info"></i>Room / Space <span class="text-danger">*</span></label>
                            <div class="material-input outlined">
                                <select name="space" class="data-input form-control" data-field="space_id" required>
                                    <option value="">-- Select Room / Space --</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label style="padding-left:6px;color:#777;"><i class="fas fa-phone-alt text-success me-1"></i>Phone Number</label>
                            <div class="material-input outlined">
                                <input name="phone_number" class="data-input form-control">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label style="padding-left:6px;color:#777;"><i class="fas fa-envelope text-success me-1"></i>Email</label>
                            <div class="material-input outlined">
                                <input name="email" class="data-input form-control">
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3 d-flex justify-content-between align-items-end">
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-calendar-alt text-warning me-1"></i>Due Date <span class="text-danger">*</span>
                            </label>
                            <input type="text" data-type="date" name="due_date" class="form-control data-input" required>
                        </div>

                        <div class="col-md-auto">
                            <div class="d-flex gap-2">
                                <button name="btnRend"    class="btn btn-primary" type="button">Rent</button>
                                <button name="btnService"    class="btn btn-primary" type="button">Service</button>
                                <button name="btnUtility" class="btn btn-primary" type="button">Utility</button>
                            </div>
                        </div>
                    </div>

                    <div name="divItemsView"></div>

                    <div class="mt-4 d-flex justify-content-end">
                        <div name="div_invoice_summary"></div>
                    </div>
                </div>
            `,

            contentCreated: (me) => {
                me.controls = me.controls || {};
                const allInputs = me.divModal.querySelectorAll('.data-input, input, select, textarea');
                allInputs.forEach(el => {
                    const key = el.dataset.field || el.name;
                    if (key) me.controls[key] = el;
                });
                me.controls.divItemsView = me.divModal.querySelector('[name="divItemsView"]');
                me.controls.div_invoice_summary = me.divModal.querySelector('[name="div_invoice_summary"]');

                me.controls.btnRend.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first");
                    }

                    const spaces = me._tenantSpaces || [];
                    const months = me._tenantMonths || [];
                    console.log("spaces:", spaces);
                    console.log("months:", months);

                    const selectedSpaceId = me.controls.space_id?.value || me.controls.space?.value || '';
                    const matchedContract = spaces.find(s => String(s.space_id) === String(selectedSpaceId));
                    const defaultContractId = matchedContract?.contract_id ?? spaces[0]?.contract_id;

                   const monthOptions = months
                        .filter(m => String(m.contract_id) === String(defaultContractId))
                        .map(m => `<option value="${m.month}">${m.month}</option>`)
                        .join('');

                    InputBox.resetInstance("rentPopUp");

                    InputBox.show({
                        title: "Rent",
                        instanceKey: "rentPopUp",
                        createContent() {
                            const div = document.createElement('div');
                            div.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;';
                            div.innerHTML = `
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Unit Code / Room <span style="color:red">*</span></label>
                                    <input class="data-input form-control bg-light"
                                        data-field="contract_id"
                                        name="contract_id"
                                        type="text"
                                        readonly
                                        placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Month</label>
                                    <select class="data-input form-control" data-field="monthly" name="monthly">
                                        <option value="">-- Select Month --</option>
                                        ${monthOptions}
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Start Date</label>
                                    <input class="data-input form-control" data-field="start_date"
                                        name="start_date" type="text" readonly placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">End Date</label>
                                    <input class="data-input form-control" data-field="end_date"
                                        name="end_date" type="text" readonly placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Price</label>
                                    <input class="data-input form-control" data-field="price"
                                        name="price" type="text" placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Discount</label>
                                    <div style="display:flex; gap:8px;">
                                        <input class="data-input form-control" data-field="discount"
                                            name="discount" type="text" placeholder="0">
                                        <select class="data-input form-control" data-field="discount_type"
                                                name="discount_type" style="width:80px;">
                                            <option value="percent">%</option>
                                            <option value="amount">$</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Tax %</label>
                                    <input class="data-input form-control" data-field="tax_rate"
                                        name="tax_rate" type="text" placeholder="0">
                                </div>
                                <div style="grid-column: span 2;">
                                    <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                    <textarea class="data-input form-control" data-field="remark"
                                            name="remark" rows="3"></textarea>
                                </div>
                            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elContract   = document.querySelector('[data-field="contract_id"]');
                            const elMonthly    = document.querySelector('[data-field="monthly"]');
                            const elPrice      = document.querySelector('[data-field="price"]');
                            const elStartDate  = document.querySelector('[data-field="start_date"]');
                            const elEndDate    = document.querySelector('[data-field="end_date"]');

                            if (!elContract || !elMonthly) return;
                            const updateDates = (selectedMonth, contractId) => {
                                const matchedMonth = months.find(m =>
                                    String(m.contract_id) === String(contractId) &&
                                    m.month === selectedMonth
                                );

                                if (matchedMonth) {
                                    if (elStartDate) elStartDate.value = matchedMonth.start_date || "";
                                    if (elEndDate) elEndDate.value = matchedMonth.end_date || "";
                                } else {
                                    if (elStartDate) elStartDate.value = "";
                                    if (elEndDate) elEndDate.value = "";
                                }
                            };
                            elMonthly.addEventListener('change', (e) => {
                                const currentContractId = elContract.dataset.contractId;
                                updateDates(e.target.value, currentContractId);
                            });

                            const fillFields = contractId => {
                                if (!contractId) return;

                                const matchedSpace = spaces.find(s => String(s.contract_id) === String(contractId));

                                // Find the first available month for this specific contract as default
                                const defaultMonth = months.find(m => String(m.contract_id) === String(contractId)) || {};

                                if (matchedSpace && elPrice) {
                                    elPrice.value = Number(matchedSpace.price || 0).toFixed(2);
                                }

                                // Set initial values in the UI
                                if (elMonthly) elMonthly.value = defaultMonth.month || "";
                                if (elStartDate) elStartDate.value = defaultMonth.start_date || "";
                                if (elEndDate) elEndDate.value = defaultMonth.end_date || "";
                            };

                            // Determine which contract/space to pre-select
                            let targetContractId = null;
                            let displaySpaceCode = '';

                            if (selectedSpaceId) {
                                const match = spaces.find(s => String(s.space_id) === String(selectedSpaceId));
                                if (match) {
                                    targetContractId = match.contract_id;
                                    displaySpaceCode = match.space_code || '';
                                }
                            }

                            // Fallback to first available
                            if (!targetContractId && spaces.length > 0) {
                                targetContractId = spaces[0].contract_id;
                                displaySpaceCode = spaces[0].space_code || '';
                            }

                            if (targetContractId) {
                                elContract.dataset.contractId = String(targetContractId);
                                elContract.value = displaySpaceCode || "(No room code)";
                                fillFields(targetContractId);
                            }

                        },

                        onConfirm(data, btn, ibMe) {
                            console.log("Rent confirmed:", data);

                            const elContract = document.querySelector('[data-field="contract_id"]');
                            const realContractId = elContract?.dataset.contractId || data.contract_id;

                            if (!realContractId) {
                                cv_interact.error('Unit Code / Room is missing');
                                return;
                            }

                            const matchedSpace = spaces.find(s => String(s.contract_id) === String(realContractId));
                            const roomCode = matchedSpace?.space_code || '—';

                            const filteredMonths = months.filter(m => String(m.contract_id) === String(realContractId));
                            const matchedMonth = filteredMonths.find(m => m.month === data.monthly)
                                                || filteredMonths[0]
                                                || null;

                            // ✅ Resolve start/end date from input fields OR matched month
                            const elStartDate = document.querySelector('[data-field="start_date"]');
                            const elEndDate   = document.querySelector('[data-field="end_date"]');

                            const resolvedStartDate = elStartDate?.value || matchedMonth?.start_date || '';
                            const resolvedEndDate   = elEndDate?.value   || matchedMonth?.end_date   || '';

                            me.itemsView.addRow({
                                item_id:        null,
                                item_name:     `Rent - ${roomCode}`,
                                type:          'rent',
                                price:         Number(data.price)    || 0,
                                qty:           1,
                                remarks:       `Rent - ${roomCode} (${data.monthly || 'N/A'})`,
                                // unit_type:     roomCode,
                                contract_id:   realContractId,
                                monthly:       data.monthly,
                                start_date:    resolvedStartDate,   // ✅ correctly resolved
                                end_date:      resolvedEndDate,     // ✅ correctly resolved
                                space_code:    roomCode,
                                space_price:   data.price,
                                discount:      Number(data.discount)      || 0,
                                discount_type: data.discount_type         || 'percent',
                                tax_rate:      Number(data.tax_rate)      || 0
                            }, 0);

                            cv_interact.success("Rent item added");
                            ibMe.close();
                        }
                    });
                };





                me.controls.btnService.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first");
                    }

                    const services = availableItem || [];

                    if (services.length === 0) {
                        return cv_interact.error("No services available");
                    }

                    // Build options for dropdown
                    const serviceOptions = services
                        .map(s => `<option value="${s.id}">${s.service || s.name || `Service #${s.id}`}</option>`)
                        .join('');

                    InputBox.show({
                        title: "Add Service",
                        instanceKey: "servicePopUp",

                        createContent() {
                            const div = document.createElement('div');
                            div.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;';
                            div.innerHTML = `
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">
                                        Service <span style="color:red">*</span>
                                    </label>
                                    <select class="data-input form-control" data-field="service_id" name="service_id">
                                        <option value="">-- Select Service --</option>
                                        ${serviceOptions}
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Unit Type</label>
                                    <input class="data-input form-control" data-field="unit_type"
                                        name="unit_type" type="text" readonly placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Price</label>
                                    <input class="data-input form-control" data-field="price"
                                        name="price" type="text" readonly placeholder="Auto filled">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Discount</label>
                                    <div style="display:flex; gap:8px;">
                                        <input class="data-input form-control" data-field="discount"
                                            name="discount" type="text" placeholder="0">
                                        <select class="data-input form-control" data-field="discount_type"
                                                name="discount_type" style="width:80px;">
                                            <option value="percent">%</option>
                                            <option value="amount">$</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:13px;color:#555;">Tax %</label>
                                    <input class="data-input form-control" data-field="tax_rate"
                                        name="tax_rate" type="text" placeholder="0">
                                </div>
                                <div style="grid-column: span 2;">
                                    <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                    <textarea class="data-input form-control" data-field="remark"
                                            name="remark" rows="3"></textarea>
                                </div>
                            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elService   = document.querySelector('[data-field="service_id"]');
                            const elUnitType  = document.querySelector('[data-field="unit_type"]');
                            const elPrice     = document.querySelector('[data-field="price"]');

                            const fillFields = (serviceId) => {
                                const selected = services.find(s => String(s.id) === String(serviceId));
                                if (!selected) return;

                                if (elUnitType) elUnitType.value = selected.unit_type || '—';
                                if (elPrice)    elPrice.value    = Number(selected.price || 0).toFixed(2);
                            };

                            // Auto fill when user selects a service
                            elService.addEventListener('change', (e) => {
                                fillFields(e.target.value);
                            });
                        },

                        onConfirm(data, btn, ibMe) {
                            if (!data.service_id) {
                                cv_interact.error("Please select a Service");
                                return;
                            }

                            const selectedService = services.find(s => String(s.id) === String(data.service_id));
                            if (!selectedService) return;

                            // ── Important: set item_name for display + item_id null for save ──
                            const serviceDisplayName = selectedService.service || selectedService.name || `Service #${selectedService.id}`;

                            me.itemsView.addRow({
                                item_id:   null,
                                item_name: serviceDisplayName,
                                type:          'service',
                                price:     Number(selectedService.price) || 0,
                                qty:       1,
                                remarks:   selectedService.service || selectedService.name || 'Service',
                                unit_type: selectedService.unit_type || '—',
                                discount:  Number(data.discount) || 0,
                                discount_type: data.discount_type || 'percent',
                                tax_rate:  Number(data.tax_rate) || 0
                            }, 0);

                            cv_interact.success("Service added at the top");
                            ibMe.close();
                        }
                    });
                };

                me.itemsView = new ItemsView(
                    me.controls.divItemsView,
                    {
                        currencyCode: 'USD',
                        columns: [
                            {
                                name: "item_id",
                                displayType: "hidden",
                                readOnly: true,
                                width: "20px"
                            },
                            {
                                name: "item_name",
                                transTitle: "titles.Item",
                                displayType: "text",
                                dataType: "string",
                                readOnly: true,
                                className: "col-item-name"
                            },
                            {
                                name: "type",
                                transTitle: "titles.Type",
                                dataType: "text",
                                readOnly: true,
                                displayType: "hidden",
                            },
                            {
                                name: "remarks",
                                transTitle: "titles.Remarks",
                                dataType: "string",
                                readOnly: true,
                            },
                            {
                                name: "qty",
                                transTitle: "titles.Qty",
                                dataType: "number",
                                readOnly: true,
                            },
                            {
                                name: "price",
                                transTitle: "titles.Price",
                                dataType: "number",
                                readOnly: true,
                            },
                            {
                                name: "start_date",
                                transTitle: "titles.Start Date",
                                dataType: "text",
                                readOnly: true,

                            },
                            {
                                name: "end_date",
                                transTitle: "titles.End Date",
                                dataType: "text",
                                readOnly: true,
                            },

                            {
                                name: "unit_type",
                                transTitle: "titles.Charge As",
                                dataType: "text",
                                readOnly: true,
                            },
                            {
                                name: "discount",
                                transTitle: "titles.Disc",
                                // isDiscount: true,
                                discountType: ["percent", "amount"],
                                defaultDiscountType: "percent",
                                discountBeforeTax: true,
                                readOnly: true,
                            },
                            {
                                name: "tax_rate",
                                transTitle: "titles.Tax %",
                                dataType: "number",
                                readOnly: true,
                            },
                            {
                                name: "total",
                                transTitle: "titles.Total",
                                dataType: "number",
                                readOnly: true,
                            },
                        ],
                        calc: {
                            mode: "auto",
                            qtyField: "qty",
                            priceField: "price",
                            totalField: "total",
                            taxField: "tax_rate",
                            currencyPrecision: 2
                        },
                        totalSummary: {
                            container: me.controls.div_invoice_summary,
                            showTax: true,
                            allowDiscount: true,
                            discountBeforeTax: true,
                            discountTypeDefault: "percent",
                            currency: "USD"
                        },
                        validateColumns: {
                            item_id: "positive",
                            qty: "positive",
                            price: "positive"
                        },

                        onItemChange: (rowId, item, fieldName, td, tr) => {
                            if (fieldName === "item_id") {
                                const selected = availableItem.find(s => String(s.id) === String(item.item_id));
                                if (selected) {
                                    me.itemsView.setCellValue(tr, "price", Number(selected.price) || 0);
                                    me.itemsView.setCellValue(tr, "unit_type", selected.unit_type || '—');
                                    me.itemsView.setCellValue(tr, "qty", 1);
                                    const remarkText = selected.service || selected.name || selected.legal_name || '—';
                                    me.itemsView.setCellValue(tr, "remarks", remarkText);
                                }
                            }
                        }
                    }
                );

                me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    type: 'select',
                    prefetch: true,
                    query: {
                        from: 'tenants',
                        select: ['id', 'name', 'legal_name', 'email', 'phone_number'],
                        searchFields: { name: 'LIKE', legal_name: 'like', email: '=', phone: '=' }
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: (tenant) => {
                        me._selectedTenantId = tenant.id;
                        vsapi.post(`${main_view.base_url}/prm/tenant/option-tenant-with-contract`, { tenant_id: tenant.id }, {})
                            .then(res => {
                                 const d = res.data || {};
                                me.controls.phone_number.value = d.tenant?.phone_number || '';
                                me.controls.email.value = d.tenant?.email || '';
                                me._selectedTenantId = tenant.id;

                                me._tenantData   = d;
                                me._tenantSpaces = d.spaces || [];
                                me._tenantMonths = d.months || [];


                                VSUtil.setComboItems(me.controls.space, d.spaces || [], 'space_id', 'space_code', '', '-- Select Room / Space --','');


                                console.log('Space', d.spaces);
                                 console.log('Full response11111:', res);
                            });
                    }
                });

                me.searchTenant.reset('');

                // === Save data helper ===
                me.saveData = () => {
                    const header = me.getData();
                    const items = me.itemsView.getItems();
                    const totals = me.itemsView.getCurrentTotals?.() || {};
                    if (me._selectedTenantId) {
                        header.tenant_id = me._selectedTenantId;
                    }
                    const mappedItem = items.map(item => {
                        const qty = parseFloat(item.qty ?? 1);
                        const price = parseFloat(item.price ?? 0);
                        const amount = qty * price;
                        const discountValue = parseFloat(item.discount || 0);
                        const discountType = item.discount_type || 'percent';

                        return {
                            ...item,
                            description: item.remarks || item.description || '',
                            amount: amount,
                            type: item.type || 'service',
                            unit_type: item.unit_type || '—',
                            service_id: item.item_id || null,

                            discount: discountValue,
                            special_discount_value: discountValue,
                            special_discount_type: discountType,
                            tax_rate: parseFloat(item.tax_rate || 0),
                            start_date:             item.start_date || null,
                            end_date:               item.end_date   || null,

                        };
                    });
                    return { ...header, items: mappedItem, ...totals };
                };
            },

            onPrepareForm: (me, data) => {
                availableItem = data.services || [];
                me.detail = op.id ? (data.invoice_details || {}) : {};

                console.log("111112", availableItem);

                setTimeout(() => {
                    if (me.populateItemDropdown) me.populateItemDropdown();
                }, 300);
            },
            prepareFormOptions: {
                createTitle: "Create Invoice",
                modifyTitle: "Modify Invoice",
                targetProp: "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: op => ({ id: op.id })
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => { me.itemsView.setData(null); me.hide(false) }
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const formData = me.saveData();
                        if (!formData.items || formData.items.length === 0) {
                            return cv_interact.error('Add at least one item');
                        }
                        vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn)
                            .then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success(formData.id ? 'Updated' : 'Created Invoice');
                                    me.hide(true);
                                } else {
                                    cv_interact.error(res.error_message || 'Save failed');
                                }
                            });
                    }
                }
            ]
        });

        dlg.show(op);
    };

    return self;
})();

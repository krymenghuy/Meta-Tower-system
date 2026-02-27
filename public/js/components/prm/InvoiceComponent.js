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

        mThis.btnAddTest.onclick = (e) => {
            e.preventDefault();
            InvoiceDialogTest.show({ id: null, btn: e.target,
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
        const items      = invoice.items || [];
        const currency   = mThis.currency_symbol;
        const statusName = invoice.payment_status_name || '—';
        const statusCls  = statusName.toLowerCase() === 'paid'          ? 'bg-success'
                         : statusName.toLowerCase() === 'unpaid'        ? 'bg-danger'
                         : statusName.toLowerCase().includes('partial') ? 'bg-warning text-dark'
                         : 'bg-secondary';

        let itemsHtml = '', subtotal = 0, totalDiscount = 0, totalTax = 0;

        if (items.length > 0) {
            items.forEach(item => {
                const amount   = Number(item.amount   || 0);
                const discount = Number(item.discount || 0);
                const tax      = Number(item.tax      || 0);
                subtotal      += amount;
                totalDiscount += discount;
                totalTax      += tax;

                const typeName = item.type || item.service_name || '—';

                itemsHtml += `
                    <tr>
                        <td>
                            <div class="fw-semibold">${item.description || '—'}</div>
                            ${item.notes ? `<small class="text-muted">${item.notes}</small>` : ''}
                        </td>
                        <td class="text-center">
                            <span class="badge bg-light text-dark border">${typeName}</span>
                        </td>
                        <td class="text-end">${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end text-danger">-${currency}${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end text-info">${currency}${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end fw-bold">${currency}${(amount - discount + tax).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>`;
            });
        } else {
            itemsHtml = `<tr><td colspan="6" class="text-center text-muted py-3">No items found</td></tr>`;
        }

        const grandTotal = subtotal - totalDiscount + totalTax;

        container.innerHTML = `
            <div class="bg-white rounded p-1">
                <div class="table-responsive">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background-color:#f0f4ff;">
                            <tr>
                                <th>Description</th>
                                <th class="text-center" width="120">Type</th>
                                <th class="text-end"    width="130">Amount</th>
                                <th class="text-end"    width="130">Discount</th>
                                <th class="text-end"    width="100">Tax</th>
                                <th class="text-end"    width="130">Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="2" class="text-end fw-bold">Subtotal</td>
                                <td class="text-end fw-bold">
                                    ${currency}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td class="text-end fw-bold text-danger">
                                    -${currency}${totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td class="text-end fw-bold text-info">
                                    ${currency}${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td class="text-end fw-bold fs-6 text-success">
                                    ${currency}${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                ${invoice.remarks ? `
                    <div class="mt-3 p-2 bg-light rounded">
                        <small class="text-muted fw-semibold">Remarks:</small>
                        <p class="mb-0 small">${invoice.remarks}</p>
                    </div>` : ''}
                <div class="text-end mt-3">
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
                    VSUtil.setComboItems(mThis.elFilter_status, d.statuses,  'id', 'payment_status', true, 'All Statuses');
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
    const self = {};
    let invoiceItems      = [];
    let availableServices = [];
    let dlg = null;

    self.show = (op) => {
        dlg = dlg || new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-6 col-md-3"><button class="btn btn-outline-primary w-100 py-3"  id="btnQuickRent"><span class="fw-semibold">Add Base Rent</span></button></div>
                            <div class="col-6 col-md-3"><button class="btn btn-outline-success w-100 py-3" id="btnQuickUtilities"><span class="fw-semibold">Add Utilities</span></button></div>
                            <div class="col-6 col-md-3"><button class="btn btn-outline-info w-100 py-3"    id="btnQuickServices"><span class="fw-semibold">Browse Services</span></button></div>
                            <div class="col-6 col-md-3"><button class="btn btn-outline-warning w-100 py-3" id="btnQuickCustom"><span class="fw-semibold">Custom Item</span></button></div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label style="padding-left:6px;color:#777;"><i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span></label>
                                <div class="material-input outlined">
                                    <input name="tenant" class="data-input form-control" data-field="tenant_id" required></input>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px;color:#777;"><i class="fas fa-door-open me-2 text-info"></i>Room / Space <span class="text-danger">*</span></label>
                                <div class="material-input outlined">
                                    <select name="space" class="data-input form-control" data-field="space_id" required><option value="">-- Select Room / Space --</option></select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px;color:#777;"><i class="fas fa-phone-alt text-success me-1"></i>Phone Number</label>
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control"></input>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px;color:#777;"><i class="fas fa-envelope text-success me-1"></i>Email</label>
                                <div class="material-input outlined">
                                    <input name="email" class="data-input form-control"></input>
                                </div>
                            </div>
                        </div>
                        <div class="row g-3 mt-2">
                            <div class="col-md-3">
                                <label class="form-label fw-semibold"><i class="fas fa-calendar-alt text-warning me-1"></i>Due Date <span class="text-danger">*</span></label>
                                <input type="text" data-type="date" name="due_date" class="form-control data-input" required>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px;color:#777;"><i class="fas fa-coins me-2 text-warning"></i>Currency <span class="text-danger">*</span></label>
                                <div class="material-input outlined">
                                    <select name="currency_id" class="data-input form-control" data-field="currency_id" required><option value="">-- Select Currency --</option></select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center" style="background-color:#e1e5f2">
                        <h6 class="mb-0"><i class="fas fa-list me-2"></i>Invoice Items</h6>
                        <span class="badge bg-white text-primary" id="items_count">0 items</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Description</th>
                                        <th class="text-center" width="120">Type</th>
                                        <th class="text-end" width="130">Amount</th>
                                        <th class="text-end" width="130">Discount</th>
                                        <th class="text-end" width="100">Tax</th>
                                        <th class="text-end" width="130">Net Amount</th>
                                        <th class="text-center" width="80">Action</th>
                                    </tr>
                                </thead>
                                <tbody name="invoice_items_tbody"></tbody>
                                <tfoot class="table-light">
                                    <tr>
                                        <td colspan="2" class="text-end fw-bold">Subtotal:</td>
                                        <td class="text-end fw-bold"                   id="invoice_subtotal">$0.00</td>
                                        <td class="text-end fw-bold text-danger"       id="invoice_total_discount">$0.00</td>
                                        <td class="text-end fw-bold text-info"         id="invoice_total_tax">$0.00</td>
                                        <td class="text-end fw-bold fs-6 text-success" id="invoice_grand_total">$0.00</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm">
                    <div class="card-body">
                        <label class="form-label fw-semibold"><i class="fas fa-sticky-note text-secondary me-1"></i>Additional Notes (Optional)</label>
                        <textarea name="remarks" class="form-control data-input" rows="3" placeholder="Enter any additional notes or terms..."></textarea>
                    </div>
                </div>
            `,

            contentCreated: (me) => {
                // ─── 1. Create controls map ──────────────────────────────────────────────
                me.controls = {};

                const inputs = me.divModal.querySelectorAll('.data-input, input, select, textarea');
                inputs.forEach(el => {
                    const key = el.dataset.field || el.name;
                    if (key) me.controls[key] = el;
                });

                me.controls.tenant               = me.divModal.querySelector('input[name="tenant"]');
                me.controls.space                = me.divModal.querySelector('select[name="space"]');
                me.controls.phone_number         = me.divModal.querySelector('input[name="phone_number"]');
                me.controls.email                = me.divModal.querySelector('input[name="email"]');
                me.controls.due_date             = me.divModal.querySelector('input[name="due_date"]');
                me.controls.currency_id          = me.divModal.querySelector('select[name="currency_id"]');
                me.controls.remarks              = me.divModal.querySelector('textarea[name="remarks"]');
                me.controls.invoice_items_tbody  = me.divModal.querySelector('tbody[name="invoice_items_tbody"]');

                // ─── 2. Define helper functions FIRST ────────────────────────────────────
                const formatNumber = (num) =>
                    Number(num || 0).toFixed(2).replace(/\.?0+$/, '');

                const formatCurrency = (num) =>
                    Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                const updateTotals = () => {
                    let subtotal = 0, totalDiscount = 0, totalTax = 0;
                    invoiceItems.forEach(item => {
                        subtotal      += parseFloat(item.amount   || 0);
                        totalDiscount += parseFloat(item.discount || 0);
                        totalTax      += parseFloat(item.tax      || 0);
                    });
                    const grandTotal = subtotal - totalDiscount + totalTax;

                    const set = (id, val) => {
                        const el = document.getElementById(id);
                        if (el) el.textContent = val;
                    };

                    set('invoice_subtotal',       `$${formatCurrency(subtotal)}`);
                    set('invoice_total_discount', `$${formatCurrency(totalDiscount)}`);
                    set('invoice_total_tax',      `$${formatCurrency(totalTax)}`);
                    set('invoice_grand_total',    `$${formatCurrency(grandTotal)}`);
                    set('items_count',            `${invoiceItems.length} item${invoiceItems.length !== 1 ? 's' : ''}`);
                };

                me.renderItemsTable = (tbody) => {
                    if (!tbody) return;
                    tbody.innerHTML = '';

                    invoiceItems.forEach((item, index) => {
                        const net = (parseFloat(item.amount || 0) - parseFloat(item.discount || 0) + parseFloat(item.tax || 0)).toFixed(2);

                        const row = tbody.insertRow();
                        row.className = 'invoice-item-row';
                        row.innerHTML = `
                            <td>
                                <div class="fw-semibold">${item.description || '—'}</div>
                                ${item.notes ? `<small class="text-muted">${item.notes}</small>` : ''}
                            </td>
                            <td class="text-center"><span class="badge bg-light text-dark border">${item.type || '—'}</span></td>
                            <td class="text-end">$${formatCurrency(item.amount)}</td>
                            <td class="text-end text-danger">
                                -$${formatCurrency(item.discount || 0)}
                                <small class="d-block text-muted">
                                    ${item.discount_type === 'percent' ? `(${formatNumber(item.discount_value)}%)` : `($${formatCurrency(item.discount_value)})`}
                                </small>
                            </td>
                            <td class="text-end text-info">
                                +$${formatCurrency(item.tax || 0)}
                                <small class="d-block text-muted">
                                    ${item.tax_type === 'percent' ? `(${formatNumber(item.tax_value)}%)` : `($${formatCurrency(item.tax_value)})`}
                                </small>
                            </td>
                            <td class="text-end fw-bold">$${formatCurrency(net)}</td>
                            <td class="text-center">
                                <button type="button" class="btn p-0 text-danger" onclick="InvoiceDialog.removeItem(${index})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>`;
                    });

                    const addRow = tbody.insertRow();
                    addRow.id = 'add_item_row';
                    addRow.className = 'table-active';
                    addRow.innerHTML = `
                        <td colspan="7" class="p-0">
                            <button type="button" class="btn btn-link w-100 py-2" id="btnShowAddItemForm">
                                <i class="fas fa-plus-circle me-2"></i><span class="fw-semibold">Add Item</span>
                            </button>
                        </td>`;

                    document.getElementById('btnShowAddItemForm')?.addEventListener('click', () => showAddItemForm(tbody));

                    updateTotals();
                };
                const showAddItemForm = (tbody, prefillServiceId = null) => {
                    const addRow = document.getElementById('add_item_row');
                    if (!addRow) return;

                    addRow.innerHTML = `
                        <td colspan="7" class="p-3 bg-light">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-concierge-bell text-primary me-1"></i>
                                        Service <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" id="new_item_service">
                                        <option value="">-- Select Service --</option>
                                        ${availableServices.map(s => `<option value="${s.id}">${s.service || s.name || s.service_type || '—'}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-file-alt text-info me-1"></i>
                                        Description <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="new_item_description" placeholder="Enter description">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">
                                        <i class="fas fa-dollar-sign text-success me-1"></i>
                                        Amount <span class="text-danger">*</span>
                                    </label>
                                    <input type="number" class="form-control" id="new_item_amount" step="0.01" min="0" placeholder="0.00">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">Discount</label>
                                    <div class="d-flex gap-1">
                                        <select class="form-select" id="new_item_discount_type" style="max-width:120px;">
                                            <option value="fixed">$</option>
                                            <option value="percent">%</option>
                                        </select>
                                        <input type="number" class="form-control" id="new_item_discount_value" step="0.01" min="0" placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">Tax</label>
                                    <div class="d-flex gap-1">
                                        <select class="form-select" id="new_item_tax_type" style="max-width:120px;">
                                            <option value="fixed">$</option>
                                            <option value="percent">%</option>
                                        </select>
                                        <input type="number" class="form-control" id="new_item_tax_value" step="0.01" min="0" placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">Notes</label>
                                    <input type="text" class="form-control" id="new_item_notes" placeholder="Optional">
                                </div>
                                <div class="col-12 text-end mt-3">
                                    <button type="button" class="btn btn-sm btn-secondary me-2" id="btnCancelAddItem">Cancel</button>
                                    <button type="button" class="btn btn-sm btn-primary" id="btnSaveNewItem">Add Item</button>
                                </div>
                            </div>
                        </td>`;
                    const serviceSelect = document.getElementById('new_item_service');
                    const descInput     = document.getElementById('new_item_description');
                    const amountInput   = document.getElementById('new_item_amount');

                    if (serviceSelect) {
                        serviceSelect.addEventListener('change', () => {
                            const serviceId = serviceSelect.value.trim();
                            if (!serviceId) {
                                if (descInput)   descInput.value   = '';
                                if (amountInput) amountInput.value = '';
                                return;
                            }

                            const selectedService = availableServices.find(s => String(s.id) === serviceId);
                            if (!selectedService) return;
                            if (descInput) {
                                descInput.value = selectedService.service || '';
                            }
                            if (amountInput) {
                                amountInput.value = selectedService.price || 0;
                            }
                        });
                        if (prefillServiceId) {
                            serviceSelect.value = prefillServiceId;
                            serviceSelect.dispatchEvent(new Event('change'));
                        }
                    }
                    document.getElementById('btnCancelAddItem')?.addEventListener('click', () => {
                        me.renderItemsTable(tbody);
                    });

                    document.getElementById('btnSaveNewItem')?.addEventListener('click', () => {
                        saveNewItem(tbody);
                    });
                };



                const saveNewItem = (tbody) => {
                    const els = {
                        service:    document.getElementById('new_item_service'),
                        desc:       document.getElementById('new_item_description'),
                        amount:     document.getElementById('new_item_amount'),
                        discType:   document.getElementById('new_item_discount_type'),
                        discVal:    document.getElementById('new_item_discount_value'),
                        taxType:    document.getElementById('new_item_tax_type'),
                        taxVal:     document.getElementById('new_item_tax_value'),
                        notes:      document.getElementById('new_item_notes'),
                    };

                    if (!els.service?.value) return cv_interact.error('Please select a service'), els.service?.focus();
                    if (!els.desc?.value?.trim()) return cv_interact.error('Description is required'), els.desc?.focus();

                    const amt = parseFloat(els.amount?.value || 0);
                    if (isNaN(amt) || amt <= 0) return cv_interact.error('Valid amount > 0 required'), els.amount?.focus();

                    const discType = els.discType?.value || 'fixed';
                    const discVal  = parseFloat(els.discVal?.value || 0);
                    const taxType  = els.taxType?.value  || 'fixed';
                    const taxVal   = parseFloat(els.taxVal?.value  || 0);
                    const notes    = els.notes?.value?.trim() || '';

                    if (discVal < 0 || (discType === 'percent' && discVal > 100)) return cv_interact.error('Invalid discount'), els.discVal?.focus();
                    if (taxVal  < 0 || (taxType  === 'percent' && taxVal  > 100)) return cv_interact.error('Invalid tax'), els.taxVal?.focus();

                    const discAmt = discType === 'percent' ? amt * (discVal / 100) : discVal;
                    const taxAmt  = taxType  === 'percent' ? amt * (taxVal  / 100) : taxVal;

                    if (discAmt > amt && !confirm('Discount > amount. Continue?')) return;

                    const service = availableServices.find(s => String(s.id) === els.service.value) || {};
                    const typeName = service.service_type || service.service || service.name || '—';

                    invoiceItems.push({
                        service_id:     parseInt(els.service.value, 10),
                        type:           typeName,
                        description:    els.desc.value.trim(),
                        amount:         amt,                    // ← FIXED HERE
                        discount_type:  discType,
                        discount_value: discVal,
                        discount:       discAmt,
                        tax_type:       taxType,
                        tax_value:      taxVal,
                        tax:            taxAmt,
                        notes
                    });

                    me.renderItemsTable(tbody);
                    cv_interact.success('Item added');
                };

                self.removeItem = (index) => {
                    if (index < 0 || index >= invoiceItems.length) return;
                    cv_interact.confirm('Remove this item?', {
                        transTitle: 'Confirm Removal',
                        confirmButtonText: 'Remove',
                        context: 'warning'
                    }, confirmed => {
                        if (!confirmed) return;
                        invoiceItems.splice(index, 1);
                        me.renderItemsTable(me.controls.invoice_items_tbody);
                        cv_interact.success('Item removed');
                    });
                };
                const tbody = me.controls.invoice_items_tbody;
                if (tbody) me.renderItemsTable(tbody);

                // Tenant search
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
                        vsapi.post(`${main_view.base_url}/prm/tenant/options-tenant-info`, { tenant_id: tenant.id }, {})
                            .then(res => {
                                const d = res.data || {};
                                me.controls.phone_number.value = d.tenant?.phone_number || '';
                                me.controls.email.value        = d.tenant?.email || '';
                                VSUtil.setComboItems(me.controls.space, d.spaces || [], 'id', 'space_code', '', '-- Select Room / Space --');
                            });
                    }
                });

                me.searchTenant.reset('');

                // Quick buttons logic
                const quickConfig = {
                    rent:      { keywords: ['rent', 'rental', 'base rent', 'monthly rent', 'lease'] },
                    utilities: { keywords: ['utility', 'utilities', 'electric', 'water', 'internet', 'power', 'gas'] },
                    services:  { },
                    custom:    { }
                };

                ['btnQuickRent', 'btnQuickUtilities', 'btnQuickServices', 'btnQuickCustom'].forEach(id => {
                    const btn = me.divModal.querySelector(`#${id}`);
                    if (btn) {
                        btn.onclick = () => {
                            const type = id.replace('btnQuick', '').toLowerCase();
                            const cfg = quickConfig[type] || {};

                            me.renderItemsTable(me.controls.invoice_items_tbody); // reset form if open

                            let prefillId = null;
                            if (cfg.keywords) {
                                const kw = cfg.keywords.map(k => k.toLowerCase());
                                const match = availableServices.find(s => {
                                    const txt = [s.service, s.name, s.service_type, s.type_name].join(' ').toLowerCase();
                                    return kw.some(k => txt.includes(k));
                                });
                                if (match) prefillId = match.id;
                            }

                            showAddItemForm(me.controls.invoice_items_tbody, prefillId);

                            if (!prefillId && (type === 'rent' || type === 'utilities')) {
                                setTimeout(() => cv_interact.info(`No matching ${type} service found.`), 400);
                            }
                        };
                    }
                });
            },

            onPrepareForm: (me, data) => {
                availableServices = data.services || [];
                me.detail = op.id ? (data.invoice_details || {}) : {};

                if (op.id && Array.isArray(me.detail?.items)) {
                    invoiceItems = me.detail.items.map(item => {
                        const a = parseFloat(item.amount || 0);
                        const d = parseFloat(item.discount || 0);
                        const t = parseFloat(item.tax || 0);
                        return {
                            service_id:     item.service_id,
                            type:           item.type || item.service_name || '—',
                            description:    item.description || '',
                            amount:         a,
                            discount_type:  item.discount_type || 'fixed',
                            discount_value: item.discount_type === 'percent' && a > 0 ? (d / a * 100) : d,
                            discount:       d,
                            tax_type:       item.tax_type || 'fixed',
                            tax_value:      item.tax_type === 'percent' && a > 0 ? (t / a * 100) : t,
                            tax:            t,
                            notes:          item.notes || ''
                        };
                    });
                } else {
                    invoiceItems = [];
                }

                if (me.controls?.invoice_items_tbody) {
                    me.renderItemsTable(me.controls.invoice_items_tbody);
                }
            },

            prepareFormOptions: {
                createTitle: "Create Invoice",
                modifyTitle: "Modify Invoice",
                targetProp:  "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: op => ({ id: op.id })
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: 'btn btn-secondary',
                    click: (me) => {
                        invoiceItems = [];
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        if (!invoiceItems.length) return cv_interact.error('Add at least one item');

                        const formData = me.getData();
                        formData.id        = me.dataOptions.id;
                        formData.items     = invoiceItems;
                        formData.tenant_id = me._selectedTenantId;

                        vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn)
                            .then(res => {
                                if (res.status_code === 200) {
                                    invoiceItems = [];
                                    me.hide(true, formData);
                                    cv_interact.success(formData.id ? 'Updated' : 'Created');
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



// INVOICE DIALOG TEST

const InvoiceDialogTest = (() => {

  let dlg = null;

  const self = {};

  self.show = (op = {}) => {

    dlg = dlg || new GeneralDialog({

      cssClass: "modal-xl",

      createContent: () => `
        <div class="container-fluid">

          <div class="row g-3 mb-3">

            <div class="col-md-4">
              <label>Customer</label>
              <input name="customer_name" class="form-control data-input"/>
            </div>

            <div class="col-md-4">
              <label>Phone</label>
              <input name="customer_phone" class="form-control data-input"/>
            </div>

            <div class="col-md-4">
              <label>Currency</label>
              <select name="currency_code" class="form-select data-input">
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>

          </div>

          <div name="divItemsView"></div>

          <div class="mt-4 d-flex justify-content-end">
            <div name ="div_invoice_summary"></div>
          </div>

        </div>
      `,

      contentCreated: (me) => {

        me.itemsView = new ItemsView(
          me.controls.divItemsView,
          {

            columns: [

              {
                name: "item_id",
                transTitle: "Product",
                displayType: "select"
              },
              {
                name: "remarks",
                transTitle: "Remarks",
                dataType: "string"
              },
              {
                name: "qty",
                transTitle: "Qty",
                dataType: "number",
                defaultValue: 1,
                isNumeric: true
              },
              {
                name: "price",
                transTitle: "Unit Price",
                dataType: "number",
                defaultValue: 0,
                isNumeric: true
              },
              {
                name: "discount",
                transTitle: "titles.Disc",
                isDiscount: true,
                discountType: ["percent", "amount"],
                defaultDiscountType: "percent",
                discountBeforeTax: true
              },
              {
                name: "tax_rate",
                transTitle: "Tax %",
                dataType: "number",
                defaultValue: 10,
                isNumeric: true
              },
              {
                name: "total",
                title: "Line Total",
                readOnly: true,
                dataType: "number",
                isNumeric: true
              }

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

                let remarkText = "";

                switch (Number(item.item_id)) {
                  case 1: remarkText = "Standard quality"; break;
                  case 2: remarkText = "Premium grade"; break;
                  case 3: remarkText = "Special promotion"; break;
                }

                me.itemsView.setCellHTML(
                  tr,
                  "remarks",
                  `<span class="badge bg-info">${remarkText}</span>`,
                  { value: remarkText }
                );
              }

            }

          }
        );

        me.itemsView.setSelectOptions("item_id", [
          { value: 1, label: "Product A" },
          { value: 2, label: "Product B" },
          { value: 3, label: "Product C" }
        ]);

        me.saveData = () => {

          const header = me.getData();
          const items = me.itemsView.getItems();
          const totals = me.itemsView.getCurrentTotals?.() || {};

          return {
            ...header,
            items,
            ...totals
          };
        };
      },

      buttons: [

        {
          label: "Cancel",
          cssClass: "btn btn-secondary",
          click: (me) => me.hide(false)
        },

        {
          label: "Save",
          cssClass: "btn btn-primary",
          click: (me) => {
            console.log("items:", me.itemsView.getItems());
            me.hide(true);
          }
        }

      ]

    });

    dlg.show(op);
  };

  return self;

})();

"use strict";

var InvoiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = '$';
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoice_component");
    mThis.btnAdd          = mThis.self.querySelector("#_btnInvoice");
    mThis.divFilter       = mThis.self.querySelector("#_divFilter_invoice");
    mThis.elFilter_status = mThis.self.querySelector('#payment_status');
    mThis.elBuilding      = mThis.self.querySelector('#building_id');
    mThis.elSpaceType     = mThis.self.querySelector('#space_type_id');
    mThis.elTenant        = mThis.self.querySelector('#tenant_id');
    mThis.elSearch        = mThis.self.querySelector("#_search_invoice");

    mThis.cols = [
        { title: "", className: "align-middle text-capitalize" },
        {
            transTitle: "titles.Invoice Num",
            className: "align-middle text-start",
            data: (data) => `<span class="text-yp-custom">${data.code || 'N/A'}</span>`,
        },
        {
            title: "Tenant",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.tenant_name || '—'}</span>`,
        },
        {
            title: "Building",
            className: "align-middle",
            data: (data) => `<span class="d-block text-yp-custom" style="max-width:90px;">${data.building_name || 'N/A'}</span>`,
        },
        {
            title: "Space Code",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.space_code || '—'}</span>`,
        },
        {
            title: "Amount",
            className: "align-middle text-primary",
            data: (data) => {
                const amt = data.amount ? Number(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Paid",
            className: "align-middle text-success",
            data: (data) => {
                const amt = data.paid_amount ? Number(data.paid_amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Balance",
            className: "align-middle text-danger",
            // ✅ Fixed: use data.balance instead of data.amount
            data: (data) => {
                const amt = data.balance ? Number(data.balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Due Date",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.due_date || 'N/A'}</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            // ✅ Fixed: use payment_status_name for display, payment_status_id for logic
            data: (data) => {
                const statusName = (data.payment_status_name || '').toLowerCase();
                let cls = 'bg-secondary';
                if (statusName === 'paid')             cls = 'bg-success';
                else if (statusName === 'unpaid')      cls = 'bg-danger';
                else if (statusName.includes('partial')) cls = 'bg-warning text-dark';
                return `<span class="badge ${cls} text-capitalize px-2 py-1">${data.payment_status_name || '—'}</span>`;
            },
        },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user || '—'}</span>
                    <small class="text-muted">${data.updated_at || '—'}</small>
                </div>`,
        },
        {
            title: "Action",
            className: "col_action align-middle text-center",
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
            InvoiceDialog.show({
                id: null,
                btn: e.target,
                onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
            });
        };

        const pr_tbl = mThis.InvoiceListView.getListContainer();
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

        // Expandable row – invoice detail
        new ExpandableRowConfig(mThis.tblInvoice.id, {
            dontExpandByClickingOn: ['btn_leave_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.id.replace('invoice_id_', '');
                if (id && !isNaN(id)) {
                    mThis.displayInvoiceDetail(container, id);
                }
            }
        });

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status"></div>
            </div>`;

        vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }
                const invoice = res.data || {};
                mThis.renderInvoiceDetail(container, invoice);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice details</div>`;
            });
    };

    // ✅ Fixed: now loops through invoice.items array from API
    mThis.renderInvoiceDetail = (container, invoice) => {
        const items      = invoice.items || [];
        const currency   = mThis.currency_symbol;
        const statusName = invoice.payment_status_name || '—';
        const statusCls  = statusName.toLowerCase() === 'paid' ? 'bg-success'
                         : statusName.toLowerCase() === 'unpaid' ? 'bg-danger'
                         : statusName.toLowerCase().includes('partial') ? 'bg-warning text-dark'
                         : 'bg-secondary';

        // Build items rows
        let itemsHtml = '';
        let subtotal = 0, totalDiscount = 0, totalTax = 0;

        if (items.length > 0) {
            items.forEach(item => {
                const amount   = Number(item.amount   || 0);
                const discount = Number(item.discount || 0);
                const tax      = Number(item.tax      || 0);
                const net      = amount - discount + tax;

                subtotal      += amount;
                totalDiscount += discount;
                totalTax      += tax;

                itemsHtml += `
                    <tr>
                        <td>
                            <div class="fw-semibold">${item.description || '—'}</div>
                            ${item.notes ? `<small class="text-muted">${item.notes}</small>` : ''}
                        </td>
                        <td class="text-end">${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end text-danger">-${currency}${discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end text-info">${currency}${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="text-end fw-bold">${currency}${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>`;
            });
        } else {
            itemsHtml = `<tr><td colspan="5" class="text-center text-muted">No items found</td></tr>`;
        }

        const grandTotal = subtotal - totalDiscount + totalTax;

        container.innerHTML = `
            <div class="bg-white rounded p-3">

                <!-- Invoice Header Info -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <table class="table table-sm table-borderless">
                            <tr>
                                <td class="text-muted fw-semibold" width="140">Invoice No:</td>
                                <td class="fw-bold text-primary">${invoice.code || '—'}</td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Tenant:</td>
                                <td>${invoice.tenant_name || '—'}</td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Building:</td>
                                <td>${invoice.building_name || '—'}</td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Space Code:</td>
                                <td>${invoice.space_code || '—'}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="table table-sm table-borderless">
                            <tr>
                                <td class="text-muted fw-semibold" width="140">Invoice Date:</td>
                                <td>${invoice.invoice_date || '—'}</td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Due Date:</td>
                                <td class="text-danger fw-semibold">${invoice.due_date || '—'}</td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Status:</td>
                                <td><span class="badge ${statusCls}">${statusName}</span></td>
                            </tr>
                            <tr>
                                <td class="text-muted fw-semibold">Currency:</td>
                                <td>${invoice.currency_code || '—'}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="table-responsive">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background-color: #f0f4ff;">
                            <tr>
                                <th>Description</th>
                                <th class="text-end" width="130">Amount</th>
                                <th class="text-end" width="130">Discount</th>
                                <th class="text-end" width="130">Tax</th>
                                <th class="text-end" width="130">Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td class="text-end fw-bold">Subtotal</td>
                                <td class="text-end fw-bold">${currency}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td class="text-end fw-bold text-danger">-${currency}${totalDiscount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td class="text-end fw-bold text-info">${currency}${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td class="text-end fw-bold fs-6 text-success">${currency}${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
            search_value: mThis.elSearch.value.trim(),
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
                {
                    html: '<span class="ps-2">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_invoice"
                },
                {
                    html: '<span class="ps-2">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_invoice"
                },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "edit_invoice") {
                    mThis.editInvoice(id, menuLink);
                } else if (name === "delete_invoice") {
                    mThis.deleteInvoice(id, menuLink);
                }
            }
        });
    };

    mThis.editInvoice = (id, menuLink) => {
        InvoiceDialog.show({
            id: id,
            btn: menuLink,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.deleteInvoice = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;

        cv_interact.confirm('Are you sure you want to delete this invoice?', {
            title: 'Delete Invoice',
            confirmButtonText: "Delete",
            context: 'danger'
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
                    VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'payment_status', true, 'All Statuses');
                    VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', '', 'All Buildings');
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
    let invoiceItems = [];

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // ✅ Update totals + item count badge together
    const updateTotals = () => {
        let subtotal = 0, totalDiscount = 0, totalTax = 0;

        invoiceItems.forEach(item => {
            subtotal      += parseFloat(item.amount   || 0);
            totalDiscount += parseFloat(item.discount || 0);
            totalTax      += parseFloat(item.tax      || 0);
        });

        const grandTotal = subtotal - totalDiscount + totalTax;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('invoice_subtotal',        `$${formatCurrency(subtotal)}`);
        set('invoice_total_discount',  `$${formatCurrency(totalDiscount)}`);
        set('invoice_total_tax',       `$${formatCurrency(totalTax)}`);
        set('invoice_grand_total',     `$${formatCurrency(grandTotal)}`);
        set('items_count', `${invoiceItems.length} item${invoiceItems.length !== 1 ? 's' : ''}`);
    };

    const renderItemsTable = (tbody) => {
        if (!tbody) return;
        tbody.innerHTML = '';

        invoiceItems.forEach((item, index) => {
            const netAmount = parseFloat(item.amount || 0) - parseFloat(item.discount || 0) + parseFloat(item.tax || 0);
            const row = tbody.insertRow();
            row.className = 'invoice-item-row';
            row.innerHTML = `
                <td>
                    <div class="fw-semibold">${item.description || '—'}</div>
                    ${item.notes ? `<small class="text-muted">${item.notes}</small>` : ''}
                </td>
                <td class="text-center">
                    <span class="badge bg-light text-dark border">${item.type || '—'}</span>
                </td>
                <td class="text-end">$${formatCurrency(item.amount)}</td>
                <td class="text-end text-danger">-$${formatCurrency(item.discount || 0)}</td>
                <td class="text-end text-info">$${formatCurrency(item.tax || 0)}</td>
                <td class="text-end fw-bold">$${formatCurrency(netAmount)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger"
                            onclick="InvoiceDialog.removeItem(${index})" title="Remove">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>`;
        });

        // Add Item row
        const addRow = tbody.insertRow();
        addRow.id = 'add_item_row';
        addRow.className = 'table-active';
        addRow.innerHTML = `
            <td colspan="7" class="p-0">
                <button type="button" class="btn btn-link text-decoration-none w-100 py-3" id="btnShowAddItemForm">
                    <i class="fas fa-plus-circle me-2"></i>
                    <span class="fw-semibold">Add Item</span>
                </button>
            </td>`;

        setTimeout(() => {
            const btn = document.getElementById('btnShowAddItemForm');
            if (btn) btn.onclick = () => showAddItemForm(tbody);
        }, 0);

        updateTotals();
    };

    const showAddItemForm = (tbody) => {
        const addRow = document.getElementById('add_item_row');
        if (!addRow) return;

        addRow.innerHTML = `
            <td colspan="7" class="p-3 bg-light">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">
                            <i class="fas fa-concierge-bell text-primary me-1"></i>
                            Service / Item <span class="text-danger">*</span>
                        </label>
                        <select class="form-select" id="new_item_service">
                            <option value="">-- Select Service/Item --</option>
                            <optgroup label="Base Charges">
                                <option value="base_rent" data-type="Rent">Base Rent</option>
                                <option value="service_charge" data-type="Service">Service Charge</option>
                                <option value="parking" data-type="Parking">Parking Fee</option>
                            </optgroup>
                            <optgroup label="Utilities">
                                <option value="electricity" data-type="Utility">Electricity</option>
                                <option value="water" data-type="Utility">Water</option>
                                <option value="gas" data-type="Utility">Gas</option>
                            </optgroup>
                            <optgroup label="Services">
                                <option value="cleaning" data-type="Service">Cleaning Service</option>
                                <option value="deep_cleaning" data-type="Service">Deep Cleaning</option>
                                <option value="maintenance" data-type="Service">Maintenance</option>
                                <option value="security" data-type="Service">Security Service</option>
                            </optgroup>
                            <optgroup label="Other">
                                <option value="penalty" data-type="Fee">Late Fee / Penalty</option>
                                <option value="deposit" data-type="Deposit">Security Deposit</option>
                                <option value="other" data-type="Other">Other</option>
                            </optgroup>
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
                        <input type="number" class="form-control" id="new_item_amount" placeholder="0.00" step="0.01" min="0.01">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">
                            <i class="fas fa-percent text-danger me-1"></i>
                            Discount
                        </label>
                        <input type="number" class="form-control" id="new_item_discount" placeholder="0.00" step="0.01" min="0" value="0">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">
                            <i class="fas fa-receipt text-warning me-1"></i>
                            Tax
                        </label>
                        <input type="number" class="form-control" id="new_item_tax" placeholder="0.00" step="0.01" min="0" value="0">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">
                            <i class="fas fa-sticky-note text-secondary me-1"></i>
                            Notes
                        </label>
                        <input type="text" class="form-control" id="new_item_notes" placeholder="Optional">
                    </div>
                    <div class="col-12">
                        <div class="d-flex gap-2 justify-content-end">
                            <button type="button" class="btn btn-sm btn-secondary" id="btnCancelAddItem">
                                <i class="fas fa-times me-1"></i>Cancel
                            </button>
                            <button type="button" class="btn btn-sm btn-primary" id="btnSaveNewItem">
                                <i class="fas fa-check me-1"></i>Add Item
                            </button>
                        </div>
                    </div>
                </div>
            </td>`;

        setTimeout(() => {
            const serviceSelect = document.getElementById('new_item_service');
            const descInput     = document.getElementById('new_item_description');

            if (serviceSelect && descInput) {
                serviceSelect.onchange = (e) => {
                    const option = e.target.options[e.target.selectedIndex];
                    if (option.value && !descInput.value) {
                        descInput.value = option.text;
                    }
                };
            }

            const btnCancel = document.getElementById('btnCancelAddItem');
            if (btnCancel) btnCancel.onclick = () => renderItemsTable(tbody);

            const btnSave = document.getElementById('btnSaveNewItem');
            if (btnSave) btnSave.onclick = () => saveNewItem(tbody);

            if (serviceSelect) serviceSelect.focus();
        }, 0);
    };

    const saveNewItem = (tbody) => {
        const serviceEl  = document.getElementById('new_item_service');
        const service    = serviceEl?.value;
        const type       = serviceEl?.options[serviceEl.selectedIndex]?.dataset.type || '';
        const description = document.getElementById('new_item_description')?.value?.trim();
        const amount     = document.getElementById('new_item_amount')?.value;
        const discount   = document.getElementById('new_item_discount')?.value;
        const tax        = document.getElementById('new_item_tax')?.value;
        const notes      = document.getElementById('new_item_notes')?.value?.trim();

        if (!service) {
            cv_interact.error('Please select a service/item');
            serviceEl?.focus();
            return;
        }
        if (!description) {
            cv_interact.error('Please enter a description');
            document.getElementById('new_item_description')?.focus();
            return;
        }
        if (!amount || parseFloat(amount) < 0.01) {
            cv_interact.error('Please enter a valid amount greater than 0');
            document.getElementById('new_item_amount')?.focus();
            return;
        }

        invoiceItems.push({
            service_id:  null,       // ✅ Fixed: always null (string keys not valid integers)
            type:        type,
            description: description,
            amount:      parseFloat(amount   || 0),
            discount:    parseFloat(discount || 0),
            tax:         parseFloat(tax      || 0),
            notes:       notes || ''
        });

        renderItemsTable(tbody);
        cv_interact.success('Item added successfully');
    };

    self.removeItem = (index) => {
        if (index < 0 || index >= invoiceItems.length) return;

        cv_interact.confirm('Remove this item from the invoice?', {
            title: 'Confirm Removal',
            confirmButtonText: 'Remove',
            context: 'warning'
        }, (confirmed) => {
            if (!confirmed) return;
            invoiceItems.splice(index, 1);
            const tbody = document.getElementById('invoice_items_tbody');
            renderItemsTable(tbody);
            cv_interact.success('Item removed');
        });
    };

    const handleQuickAction = (actionType, me) => {
        const tbody = document.getElementById('invoice_items_tbody');
        if (!tbody) return;

        showAddItemForm(tbody);

        setTimeout(() => {
            const serviceSelect = document.getElementById('new_item_service');
            if (!serviceSelect) return;

            if (actionType === 'rent')      serviceSelect.value = 'base_rent';
            else if (actionType === 'utilities') serviceSelect.value = 'electricity';
            else if (actionType === 'custom')    serviceSelect.value = 'other';

            serviceSelect.dispatchEvent(new Event('change'));
        }, 100);
    };

    // ✅ Fixed: dialog is NOT cached — reset every time show() is called
    self.show = (op) => {
        invoiceItems = [];

        const dlg = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-6 col-md-3">
                                <button class="btn btn-outline-primary w-100 py-3" id="btnQuickRent">
                                    <span class="fw-semibold">Add Base Rent</span>
                                </button>
                            </div>
                            <div class="col-6 col-md-3">
                                <button class="btn btn-outline-success w-100 py-3" id="btnQuickUtilities">
                                    <span class="fw-semibold">Add Utilities</span>
                                </button>
                            </div>
                            <div class="col-6 col-md-3">
                                <button class="btn btn-outline-info w-100 py-3" id="btnQuickServices">
                                    <span class="fw-semibold">Browse Services</span>
                                </button>
                            </div>
                            <div class="col-6 col-md-3">
                                <button class="btn btn-outline-warning w-100 py-3" id="btnQuickCustom">
                                    <span class="fw-semibold">Custom Item</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label style="padding-left:6px; color:#777;">
                                    <i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span>
                                </label>
                                <div class="material-input outlined">
                                    <select name="tenant_id" class="data-input form-control" data-field="tenant_id" required>
                                        <option value="">-- Select Tenant --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px; color:#777;">
                                    <i class="fas fa-building me-2 text-info"></i>Building <span class="text-danger">*</span>
                                </label>
                                <div class="material-input outlined">
                                    <select name="legal_name_id" class="data-input form-control" data-field="legal_name_id" required>
                                        <option value="">-- Select Legal Name --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px; color:#777;">
                                    <i class="fas fa-door-open me-2 text-info"></i>Room / Space  <span class="text-danger">*</span>
                                </label>
                                <div class="material-input outlined">
                                    <select name="space_id" class="data-input form-control" data-field="space_id" required>
                                        <option value="">-- Select Room / Space --</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px; color:#777;">
                                    <i class="fas fa-phone-alt text-success me-1"></i> Phone Number
                                </label>
                                <div class="material-input outlined">
                                    <select name="phone_id" class="data-input form-control" data-field="phone_id">
                                        <option value="">-- Select Phone Number  --</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row g-1">
                            <div class="col-md-3">
                                <label class="form-label fw-semibold">
                                    <i class="fas fa-calendar-alt text-warning me-1"></i>
                                    Invoice Date <span class="text-danger">*</span>
                                </label>
                                <input type="date" name="invoice_date" class="form-control data-input" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-semibold">
                                    <i class="fas fa-calendar-alt text-warning me-1"></i>
                                    Due Date <span class="text-danger">*</span>
                                </label>
                                <input type="date" name="due_date" class="form-control data-input" required>
                            </div>
                            <div class="col-md-3">
                                <label style="padding-left:6px; color:#777;">
                                   <i class="fas fa-coins me-2 text-warning"></i>Currency <span class="text-danger">*</span>
                                </label>
                                <div class="material-input outlined">
                                    <select name="currency_id" class="data-input form-control" data-field="currency_id" required>
                                        <option value="">-- Select Currency --</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Step 3: Invoice Items -->
                <div class="card shadow-sm mb-3">
                    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <h6 class="mb-0"><i class="fas fa-list me-2"></i>Invoice Items</h6>
                        <span class="badge bg-white text-success" id="items_count">0 items</span>
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
                                <tbody id="invoice_items_tbody"></tbody>
                                <tfoot class="table-light">
                                    <tr>
                                        <td colspan="2" class="text-end fw-bold">Subtotal:</td>
                                        <td class="text-end fw-bold" id="invoice_subtotal">$0.00</td>
                                        <td class="text-end fw-bold text-danger" id="invoice_total_discount">$0.00</td>
                                    <td class="text-end fw-bold text-info" id="invoice_total_tax">$0.00</td>
                                        <td class="text-end fw-bold fs-6 text-success" id="invoice_grand_total">$0.00</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="card shadow-sm">
                    <div class="card-body">
                        <label class="form-label fw-semibold">
                            <i class="fas fa-sticky-note text-secondary me-1"></i>
                            Additional Notes (Optional)
                        </label>
                        <textarea name="remarks" class="form-control data-input" rows="3"
                            placeholder="Enter any additional notes or terms..."></textarea>
                    </div>
                </div>
            `,

            contentCreated: (me) => {
                const tbody = document.getElementById('invoice_items_tbody');
                renderItemsTable(tbody);

                ['btnQuickRent', 'btnQuickUtilities', 'btnQuickServices', 'btnQuickCustom'].forEach(btnId => {
                    const btn = me.divModal.querySelector(`#${btnId}`);
                    if (btn) {
                        const type = btnId.replace('btnQuick', '').toLowerCase();
                        btn.onclick = () => handleQuickAction(type, me);
                    }
                });

                // Load existing items when editing
                if (op.id && me.detail?.items) {
                    invoiceItems = me.detail.items.map(item => ({
                        service_id:  item.service_id  || null,
                        type:        item.type         || '—',
                        description: item.description  || '',
                        amount:      parseFloat(item.amount   || 0),
                        discount:    parseFloat(item.discount || 0),
                        tax:         parseFloat(item.tax      || 0),
                        notes:       item.notes        || ''
                    }));
                    renderItemsTable(tbody);
                }
            },

            configSelect: [
                {
                    name: "tenant_id",
                    data: "tenants",
                    textField: "tenant",
                    valueField: "id",
                    dependents: [
                        {
                            name: "space_id",
                            itemsLoaded: (me, items) => {
                                me.controls.space_id.value = me.detail?.space_id || '';
                            },
                            api: {
                                endpoint: `${main_view.base_url}/prm/tenant/options-tenant-info`,
                            },
                            textField: "space_code",
                            valueField: "id"
                        },
                        {
                            name: "phone_id",
                            itemsLoaded: (me, items) => {
                                me.controls.phone_id.value = me.detail?.phone_id || '';
                            },
                            api: {
                                endpoint: `${main_view.base_url}/prm/tenant/options-tenant-info`,
                            },
                            textField: "tenant_phone",
                            valueField: "id"
                        },
                        {
                            name: "legal_name_id",
                            itemsLoaded: (me, items) => {
                                me.controls.legal_name_id.value = me.detail?.legal_name_id || '';
                            },
                            api: {
                                endpoint: `${main_view.base_url}/prm/tenant/options-tenant-info`,
                            },
                            textField: "tenant_legal_name",
                            valueField: "id"
                        }
                    ]
                },
            ],

            onPrepareForm: (me, data) => {
                me.detail = data.invoice_details;
            },

            prepareFormOptions: {
                createTitle: "Create Invoice",
                modifyTitle: "Modify Invoice",
                targetProp: "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: (op) => ({ id: op.id }),
                },
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: 'btn btn-secondary',
                    click: (me, btn) => me.hide(false),
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        if (invoiceItems.length === 0) {
                            cv_interact.error('Please add at least one item to the invoice');
                            return;
                        }

                        const formData      = me.getData();
                        formData.id         = me.dataOptions.id;
                        formData.items      = invoiceItems;

                        vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn, null)
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true, formData);
                                    cv_interact.success(formData.id > 0
                                        ? 'Invoice updated successfully'
                                        : 'Invoice created successfully'
                                    );
                                } else {
                                    cv_interact.error(res.error_message || 'Failed to save invoice');
                                }
                            });
                    },
                },
            ],
        });

        dlg.show(op);
    };

    return self;
})();

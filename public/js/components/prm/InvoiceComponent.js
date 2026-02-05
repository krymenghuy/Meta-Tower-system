"use strict";

var InvoiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = '$';
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoice_component");

    // DOM elements
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
            title: "Invoice Num",
            className: "align-middle",
            // data: (data, index) => `<span class="text-yp-custom">${data.invoice_number || `INV-${String(1000 + index).padStart(4, '0')}`}</span>`,
            data:(data,index)=>{
                const Al = 'MP';
                const seq = String(index + 1).padStart(4, '0');
                const displayNum = data.invoice_number || `${Al}-${seq}`;
                return `<span class="text-yp-custom">${displayNum}</span>`;
            }
        },
        {
            title: "Tenant",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom"><small>${data.tenant_name || '—'}</small></span>`,
        },
        {
            title: "Building",
            className: "align-middle",
            data: (data) => `<span class="d-block text-yp-custom" style="max-width:90px;"><small>${data.building_name || 'N/A'}</small></span>`,
        },
        {
            title: "Floor",
            className: "align-middle",
            data: (data) => `<span class="d-block text-yp-custom" style="max-width:75px;"><small>${data.floor_name || data.floor_id || 'N/A'}</small></span>`,
        },
        {
            title: "Code",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom"><small>${data.space_code || '—'}</small></span>`,
        },
        {
            title: "Due Amount",
            className: "align-middle text-end",
            data: (data) => {
                const amt = data.due_amount ? Number(data.due_amount).toLocaleString() : '—';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Due Date",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom"><small>${data.due_date || 'N/A'}</small></span>`,
        },
        {
            title: "Type",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom"><small>${data.invoice_type || '—'}</small></span>`,
        },
        {
            title: "Remark",
            className: "align-middle",
            data: (data) => `<div class="text-yp-custom" style="max-width:140px;"><small class="text-wrap">${data.remarks || '—'}</small></div>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status || '').toLowerCase();
                let cls = 'text-secondary';
                if (status === 'paid') cls = 'text-success fw-semibold';
                else if (status === 'unpaid') cls = 'text-danger fw-semibold';
                else if (status === 'partially paid') cls = 'text-warning fw-semibold';
                return `<span class="${cls} text-capitalize px-2 py-1"><small>${data.status || '—'}</small></span>`;
            },
        },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold"><small>${data.update_user || '—'}</small></span>
                    <small class="text-muted">${data.updated_at || '—'}</small>
                </div>`,
        },
        {
            title: "Action",
            className: "col_action align-middle text-center",
            data: (data) => `
                <div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}"
                       data-id="${data.id}" data-statusid="${data.status_id || ''}">
                        <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
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
                tr.dataset.statusid = data.status_id;
                tr.classList.add('invoice');
                tr.id = `invoice_id_${data.id}`;
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            Invoicedialog.show({
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
        container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div></div>';

        vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }

                const data = res.data || {};
                mThis.renderInvoiceDetail(container, data);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const invoiceNo = invoice.invoice_number || `INV-${invoice.id || 'NEW'}`;
        const dueDate   = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A';
        const netAmount = invoice.net_amount || invoice.due_amount || 0;

        const html = `
            <div class="p-4 bg-white rounded shadow-sm">

                <!-- Company Header -->
                <div class="text-center mb-4">
                    <h3 class="fw-bold mb-1">META TOWER MANAGEMENT CO., LTD</h3>
                    <p class="mb-1 text-muted">
                        <i class="bi bi-geo-alt-fill me-1"></i> SBC Tower, Street 2004, Phnom Penh, Cambodia
                    </p>
                    <p class="small mb-0">
                        <span class="me-3"><i class="bi bi-card-text me-1"></i> Tax ID: 000123456</span>
                        <span><i class="bi bi-telephone-fill me-1"></i> +855 23 999 888</span>
                    </p>
                </div>

                <hr class="my-4">

                <!-- Invoice Title -->
                <div class="text-center mb-4">
                    <h4 class="fw-bold mb-2">TAX INVOICE / វិក្កយបត្រ</h4>
                    <span class="badge bg-primary fs-6 px-4 py-2">${invoiceNo}</span>
                </div>

                <!-- Meta Info -->
                <div class="row g-4 mb-5">
                    <div class="col-md-6">
                        <table class="table table-borderless table-sm mb-0">
                            <tr><td class="fw-bold w-40">Tenant:</td><td>${invoice.tenant_name || '—'}</td></tr>
                            <tr><td class="fw-bold">Space / Room:</td><td>${invoice.space_code || '—'}</td></tr>
                            <tr><td class="fw-bold">Building:</td><td>${invoice.building_name || '—'}</td></tr>
                            <tr><td class="fw-bold">Floor:</td><td>${invoice.floor_name || invoice.floor_id || '—'}</td></tr>
                        </table>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <table class="table table-borderless table-sm mb-0">
                            <tr><td class="fw-bold w-40 text-end">Invoice Date:</td><td>${invoice.invoice_date || invoice.created_at || '—'}</td></tr>
                            <tr><td class="fw-bold text-danger text-end">Due Date:</td><td class="text-danger">${dueDate}</td></tr>
                            <tr><td class="fw-bold text-end">Status:</td><td>${invoice.status || '—'}</td></tr>
                        </table>
                    </div>
                </div>

                <!-- Invoice Items Table -->
                <div class="table-responsive mb-4">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Fee Type</th>
                                <th>Duration</th>
                                <th class="text-end">Amount</th>
                                <th class="text-end">Discount</th>
                                <th class="text-end">Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(invoice.items || []).map(item => `
                                <tr>
                                    <td>${item.fee_type || '—'}</td>
                                    <td>${item.duration || '—'}</td>
                                    <td class="text-end">${mThis.currency_symbol}${Number(item.amount || 0).toLocaleString()}</td>
                                    <td class="text-end text-danger">-${mThis.currency_symbol}${Number(item.discount || 0).toLocaleString()}</td>
                                    <td class="text-end fw-bold">${mThis.currency_symbol}${Number(item.net_amount || item.amount || 0).toLocaleString()}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" class="text-center text-muted py-4">No items found</td></tr>'}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-end fw-bold">Total Net Amount:</td>
                                <td class="text-end fw-bold fs-5">${mThis.currency_symbol}${Number(netAmount).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Remarks -->
                ${invoice.remarks ? `
                    <div class="border-top pt-3">
                        <h6 class="fw-bold">Remarks:</h6>
                        <p class="text-muted">${invoice.remarks}</p>
                    </div>
                ` : ''}

                <div class="text-end mt-4">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.print()">
                        <i class="bi bi-printer me-1"></i> Print Invoice
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    };

    mThis.getFilterData = () => {
        const params = {
            status_id: mThis.elFilter_status.value,
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
        Invoicedialog.show({
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

// ────────────────────────────────────────────────
// Invoicedialog – still basic (you can add cascading later)
// ────────────────────────────────────────────────

const Invoicedialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            createContent: () => `
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Tenant</label>
                        <select name="tenant_id" class="form-select data-input" data-field="tenant_id"></select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Building</label>
                        <select name="building_id" class="form-select data-input" data-field="building_id"></select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Floor</label>
                        <select name="floor_id" class="form-select data-input" data-field="floor_id"></select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Space / Room</label>
                        <select name="space_id" class="form-select data-input" data-field="space_id"></select>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Service / Fee Type</label>
                        <select name="service_id" class="form-select data-input" data-field="service_id"></select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Due Amount</label>
                        <input type="number" name="due_amount" class="form-control data-input" data-field="due_amount" min="0" step="0.01">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Remark / Note</label>
                        <input type="text" name="remarks" class="form-control data-input" data-field="remarks">
                    </div>
                </div>
            `,
            prepareFormOptions: {
                createTitle: "Create New Invoice",
                modifyTitle: "Edit Invoice",
                targetProp: "invoice",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: op => ({ id: op.id || null })
                }
            },
            buttons: [
                { label: 'Cancel', cssClass: 'btn-secondary', click: me => me.hide(false) },
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    click: (me, btn) => {
                        const formData = me.getData();
                        formData.id = op.id || null;

                        vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn)
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true);
                                    cv_interact.success(op.id ? "Invoice updated" : "Invoice created");
                                    if (op.onClose) op.onClose();
                                } else {
                                    cv_interact.error(res.error_message || 'Save failed');
                                }
                            });
                    }
                }
            ]
        });

        dialog.show(op);
    };

    return self;
})();

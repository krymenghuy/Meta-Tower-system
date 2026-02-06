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
            title: "Invoice Num",
            className: "align-middle",
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
            title: "Code",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.space_code || '—'}</span>`,
        },
        {
            title: "Due Amount",
            className: "align-middle text-end",
            data: (data) => {
                const amt = data.amount? Number(data.amount).toLocaleString() : '—';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Due Date",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.due_date || 'N/A'}</span>`,
        },
        {
            title: "Type",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.invoice_type || '—'}</span>`,
        },
        {
            title: "Remark",
            className: "align-middle",
            data: (data) => `<d class="text-yp-custom" style="max-width:140px;">${data.remarks || '—'}`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = data.payment_status_id || '';
                let cls = 'text-secondary';
                if (status === 'paid') cls = 'text-success fw-semibold';
                else if (status === 'unpaid') cls = 'text-danger fw-semibold';
                else if (status === 'partially paid') cls = 'text-warning fw-semibold';
                return `<span class="${cls} text-capitalize px-2 py-1">${data.payment_status_id || '—'}</span>`;
            },
        },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user || '—'}</span>
                    <small class="text-muted">${data.updated_at || '—'}
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
        container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary " role="status"></div></div>';

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
        const netAmount = invoice.net_amount || invoice.due_amount || 0;

        const html = `
            <div class=" bg-white rounded ">
                <!-- Invoice Items Table -->
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <tbody>
                                <tr style="background-color: #fbf8cc;">
                                    <td><strong>Fee Type</strong></td>
                                    <td><strong>Duration</strong></td>
                                    <td class="text-end"><strong>Amount</strong></td>
                                    <td class="text-end"><strong>Discount</strong></td>
                                    <td class="text-end"><strong>Net Amount</strong></td>
                                </tr>
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

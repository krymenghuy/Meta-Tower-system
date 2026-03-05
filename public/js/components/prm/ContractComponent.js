"use strict";

var ContractComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    // mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
    // mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elStatus = mThis.self.querySelector("#el_contract_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");



    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data, index) => `<div class="text-prm-custom">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.tenant_name ?? ''}</span>
                    </div>
                    `,
        },
        {
            transTitle: "titles.Contact Info",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block">${data.phone_number ?? ''}</span>
                        <small class="d-block text-primary">${data.email}</small>`;
            }
        },
         {
            transTitle: "titles.Start Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<small class="px-2 py-1 bg-body-secondary text-muted rounded-5"><i class="fa-regular fa-clock"></i> ${data.start_date ?? ''}</small>`;
            }
        },
         {
            transTitle: "titles.End Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<small class="px-2 py-1 bg-body-secondary text-muted rounded-5"><i class="fa-regular fa-clock"></i> ${data.end_date ?? ''}</smaLL>`;
            }
        },
        {
            transTitle: "titles.Business",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom">${data.business_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-white rounded font-medium">${data.space_code ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom">${data.space_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                const cur = data.cur_symbol ?? '$';
                const price = data.price ? Number(data.price).toLocaleString() : '-';

                if (data.price_type === 'total') {
                    return `
                        <span class="fw-semibold">
                            ${cur} ${price}
                            <small class="text-muted">/mon</small>
                        </span>
                        <div class="text-muted small">Whole Room</div>
                    `;
                }

                return `
                    <span class="text-primary-custom">
                        ${cur} ${price}
                        <small class="text-muted">/sqm</small>
                    </span>
                    <div class="text-muted small">
                        ${data.sqm_size ?? '-'} sqm
                    </div>
                `;
            }
        },

        {
            transTitle: "titles.remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-prm-custom">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
         {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();

                let cls  = 'badge rounded-5 border border-warning text-warning bg-warning-subtle';
                let icon = 'bi-check-circle-fill';
                let dot  = 'bg-warning';

                if (status === 'active') {
                    cls  = 'badge rounded-4 shadow-sm border border-success text-success bg-success-subtle';
                    icon = 'fa-regular fa-circle-check';
                    dot  = 'bg-success';
                }
                else if (status === 'expired') {
                    cls  = 'badge rounded-5 shadow-sm border border-danger text-danger bg-danger-subtle';
                    icon = 'fa-regular fa-clock';
                    dot  = 'bg-danger';
                }
                else if (status === 'terminated') {
                    cls  = 'badge rounded-5 shadow-sm border border-warning text-warning bg-warning-subtle';
                    icon = 'fa-regular fa-circle-xmark';
                    dot  = 'bg-warning';
                }

                return `
                    <span class="${cls} px-3 py-2 d-inline-flex align-items-center gap-2"
                        style="min-width:110px"
                        data-status_id="${data.status_id}">
                        <i class="${icon}" style="font-size:13px;"></i>

                        <span class="text-capitalize">${data.status ?? ''}</span>
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom fw-semibold">${data.update_user ?? ''}</span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn_contract_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm  rounded-2 text-nowrap">
                            <span>
                                <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                            </span>
                       </button>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add('contract');
                tr.setAttribute('id', ['contract_invoice_id', data.id].join(''));
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ContractListView.showPage(mThis.getFilterData());
                }
            };
            ContractDialog.show(op);
        };

        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);

        // Filter change handler with tooltip reinitialization
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after filter
                setTimeout(() => {
                    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        // Search handler with tooltip reinitialization
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after search
                setTimeout(() => {
                    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
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
            actionButtonClass: "btn_contract_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Generate Invoice"></span>',
                    icon: `<i class="fa-solid fa-dollar-sign text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "generate_invoice"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Renew Contract"></span>',
                    icon: `<i class="fa-solid fa-arrows-rotate fs-5 text-prm-custom"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "renew_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Print Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_contract"
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;

                menu.renew_contract.style.display = (status_id == 1 || status_id == 2) ? 'block' : 'none';
                menu.renew_contract.style.display = status_id == 2 ? 'none' : 'block';
                menu.edit_contract.style.display = status_id == 2 ? 'none' : 'block';
                menu.generate_invoice.style.display = status_id ==2 ? 'none': 'block';


            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'generate_invoice':{
                        mThis.generateInvoice(id,menuLink);
                        break;
                    }
                    case 'edit_contract': {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case 'renew_contract': {
                        mThis.renewContract(id, menuLink);
                        break;
                    }
                    case 'print_contract': {
                        mThis.printContract(id, menuLink);
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

    mThis.generateInvoice = (id, menuLink) => {
        let op = {
            contract_invoice_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        CreateInvoiceContractDialog.show(op);
    };

    mThis.editContract = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        ContractDialog.show(op);
    }
    mThis.renewContract = (id, menulink) => {
        if (!id) return;

        let op = {
            id: id,
            contract_id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };

        RenewDialog.show(op);
    };

    mThis.printContract = (id, menulink) => {
       alert('Coming Soon');
    }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/contract/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(mThis.elStatus, d.statuses, 'id', 'status_name', true, 'All Statues', null);
                // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'id', 'business_type', true, 'business type', null);

                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());

            // Initialize tooltips after table loads
            setTimeout(() => {
                $('[data-bs-toggle="tooltip"]').tooltip();
                // console.log('Tooltips initialized');
            }, 800);

            // Auto-refresh every hour to update contract statuses
            if (!mThis.autoRefreshInterval) {
                mThis.autoRefreshInterval = setInterval(() => {
                    console.log('Auto-refreshing contracts...');
                    mThis.ContractListView.showPage(mThis.getFilterData());

                    // Re-initialize tooltips after refresh
                    setTimeout(() => {
                        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }, 800);
                }, 3600000); // 1 hour = 3600000ms
            }
        });
    };

    return mThis;
})();

const CreateInvoiceContractDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        if (!dialog) {
            dialog = new GeneralDialog({
                cssClass: "modal-xl vs-modal",
                backdrop: "static",
                keyboard: true,

                createContent: () => `
                    <div class="row g-4">
                        <!-- Tenant & Contract Info -->
                        <div class="col-12">
                            <div class="border border-info border-2 rounded-3 p-3 bg-white">
                                <div class="row g-3 text-start">
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Tenant:</span><br>
                                        <span class="fw-semibold fs-6" id="info-tenant">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Room/Unit:</span><br>
                                        <span class="fw-semibold fs-6" id="info-space">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Business:</span><br>
                                        <span class="fw-semibold fs-6" id="info-business">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Type:</span><br>
                                        <span class="fw-semibold fs-6" id="info-type">-</span>
                                    </div>
                                </div>
                                <div class="row g-3 text-start mt-2">
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Start Date:</span><br>
                                        <span class="fw-semibold fs-6" id="info-start-date">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">End Date:</span><br>
                                        <span class="fw-semibold fs-6" id="info-end-date">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Monthly Price:</span><br>
                                        <span class="fw-semibold fs-6" id="info-price">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Email:</span><br>
                                        <span class="fw-semibold fs-6" id="info-email">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Invoice Date, Discount, Tax -->
                        <div class="col-12">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold">Invoice Date <span class="text-danger">*</span></label>
                                    <input type="text" data-type="date" class="form-control data-input" data-field="due_date" required>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold">Discount</label>
                                    <div class="d-flex gap-1">
                                        <select class="form-select" id="discount_type" style="max-width:90px;">
                                            <option value="percent">%</option>
                                            <option value="fixed">$</option>
                                        </select>
                                        <input type="number" step="0.01" min="0" class="form-control" id="discount_value" placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-semibold">Tax</label>
                                    <div class="d-flex gap-1">
                                        <select class="form-select" id="tax_type" style="max-width:90px;">
                                            <option value="percent">%</option>
                                            <option value="fixed">$</option>
                                        </select>
                                        <input type="number" step="0.01" min="0" class="form-control" id="tax_value" placeholder="0">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Invoice Item Table -->
                        <div class="col-12">
                            <div class="border border-info border-2 rounded-3 p-3 bg-white">
                                <div class="card-header d-flex justify-content-between align-items-center" style="background-color:#e1e5f2; margin:-16px -16px 16px -16px; padding:12px 20px; border-radius:6px 6px 0 0;">
                                    <h6 class="mb-0"><i class="fas fa-list me-2"></i>Invoice Item (Contract)</h6>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-sm align-middle table-hover mb-0">
                                        <thead style="background-color:#f0f4ff;">
                                            <tr>
                                                <th>Description</th>
                                                <th class="text-center">Type</th>
                                                <th class="text-end">Amount</th>
                                                <th class="text-end">Discount</th>
                                                <th class="text-end">Tax</th>
                                                <th class="text-end">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody id="items-body"></tbody>
                                        <tfoot class="table-light">
                                            <tr>
                                                <td colspan="2" class="text-end fw-bold">Subtotal</td>
                                                <td class="text-end fw-bold" id="calc-subtotal">$0.00</td>
                                                <td class="text-end fw-bold text-danger" id="calc-discount">-$0.00</td>
                                                <td class="text-end fw-bold text-info" id="calc-tax">+$0.00</td>
                                                <td class="text-end fw-bold fs-5 text-success" id="calc-total">$0.00</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Remarks -->
                        <div class="col-12">
                            <label class="form-label fw-semibold">Remarks</label>
                            <textarea class="form-control data-input" data-field="remarks" rows="3" placeholder="Invoice note..."></textarea>
                        </div>

                        <!-- Hidden fields -->
                        <input type="hidden" data-field="tenant_id">
                        <input type="hidden" data-field="space_id">
                        <input type="hidden" data-field="contract_invoice_id">
                    </div>
                `,

                contentCreated: (me) => {
                    me.controls = {};
                    me.divModal.querySelectorAll('.data-input').forEach(el => {
                        if (el.dataset.field) me.controls[el.dataset.field] = el;
                    });

                    const calculateAndUpdate = () => {
                        if (!me._subtotal) return;

                        const subtotal = parseFloat(me._subtotal);
                        const discType = document.getElementById('discount_type')?.value || 'percent';
                        const discVal  = parseFloat(document.getElementById('discount_value')?.value || 0);
                        const taxType  = document.getElementById('tax_type')?.value  || 'percent';
                        const taxVal   = parseFloat(document.getElementById('tax_value')?.value  || 0);

                        const discount = discType === 'percent' ? subtotal * (discVal / 100) : discVal;
                        const tax      = taxType  === 'percent' ? subtotal * (taxVal  / 100) : taxVal;
                        const net      = subtotal - discount + tax;

                        document.getElementById('calc-subtotal').textContent = `$${subtotal.toFixed(2)}`;
                        document.getElementById('calc-discount').textContent = `-$${discount.toFixed(2)}`;
                        document.getElementById('calc-tax').textContent      = `+$${tax.toFixed(2)}`;
                        document.getElementById('calc-total').textContent    = `$${net.toFixed(2)}`;

                        const itemDiscountEl = document.getElementById('item-discount');
                        const itemTaxEl      = document.getElementById('item-tax');
                        const itemNetEl      = document.getElementById('item-net');

                        if (itemDiscountEl) itemDiscountEl.textContent = `-$${discount.toFixed(2)}`;
                        if (itemTaxEl)      itemTaxEl.textContent      = `+$${tax.toFixed(2)}`;
                        if (itemNetEl)      itemNetEl.textContent      = `$${net.toFixed(2)}`;
                    };

                    ['discount_value', 'tax_value'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.addEventListener('input', calculateAndUpdate);
                    });
                    ['discount_type', 'tax_type'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.addEventListener('change', calculateAndUpdate);
                    });

                    me.loadContractData = (op) => loadContractData(me, op);
                    me.calculateAndUpdate = calculateAndUpdate;
                },

                buttons: [
                    { label: 'Cancel', cssClass: 'btn btn-secondary', click: me => me.hide(false) },
                    {
                        label: 'Generate Invoice',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            if (!me._contractData) return cv_interact.error('No contract data loaded');

                            const formData = me.getData() || {};

                            const discType = document.getElementById('discount_type')?.value || 'percent';
                            const discVal  = parseFloat(document.getElementById('discount_value')?.value || 0);
                            const taxType  = document.getElementById('tax_type')?.value  || 'percent';
                            const taxVal   = parseFloat(document.getElementById('tax_value')?.value  || 0);

                            const subtotal = me._subtotal || 0;
                            const discount = discType === 'percent' ? subtotal * (discVal / 100) : discVal;
                            const tax      = taxType  === 'percent' ? subtotal * (taxVal  / 100) : taxVal;

                            const itemType = me._contractData.space_type || 'Rent';
                            const description = me._contractData.description ||
                                                `Monthly Rent - ${me._contractData.space_code || 'Unit'} (${me._contractData.period || 'Contract Period'})`;

                            formData.items = [{
                                description: description,
                                type: itemType,
                                amount: subtotal,
                                discount_type: discType,
                                discount_value: discVal,
                                discount: discount,
                                tax_type: taxType,
                                tax_value: taxVal,
                                tax: tax,
                                contract_invoice_id: me._contractData.id
                            }];

                            formData.tenant_id    = me._contractData.tenant_id;
                            formData.space_id     = me._contractData.space_id;
                            formData.contract_invoice_id = op.contract_invoice_id || op.id;
                            formData.due_date = formData.due_date || new Date().toISOString().split('T')[0];

                            console.log("Invoice payload:", formData);

                            vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn)
                                .then(res => {
                                    if (res.status_code === 200) {
                                        me.hide(true);
                                        cv_interact.success('Contract invoice generated!');
                                        if (op.onClose) op.onClose();
                                    } else {
                                        cv_interact.error(res.error_message || 'Failed to generate invoice');
                                    }
                                })
                                .catch(() => cv_interact.error('Network error'));
                        }
                    }
                ]
            });
        }

        dialog.show(op);

        setTimeout(() => {
            if (dialog.loadContractData) dialog.loadContractData(op);
        }, 150);
    };

    const loadContractData = (me, op) => {
        if (!op?.contract_invoice_id) {
            console.warn("No contract ID passed");
            return;
        }

        me._contractData = null;
        me._subtotal = 0;

        // Reset UI
        ['info-tenant','info-space','info-business','info-type','info-start-date','info-end-date','info-price','info-email']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '-';
            });
        document.getElementById('items-body').innerHTML = '';

        vsapi.call(`${main_view.base_url}/prm/contract/list-paginate`, { id: op.contract_invoice_id })
            .then(res => {
                console.log("[Contract Invoice] Full response:", res);

                if (res.status_code !== 200 || !res.data?.data?.length) {
                    cv_interact.error('No contract found');
                    console.warn("No data found in paginate response");
                    return;
                }

                const data = res.data.data[0] || {};

                console.log("[Contract Invoice] Selected contract:", data);

                const start  = data.start_date  || '-';
                const end    = data.end_date    || '-';
                const period = (start !== '-' && end !== '-') ? `${start} → ${end}` : '-';

                // Fill UI
                document.getElementById('info-tenant').textContent     = data.tenant_name   || '-';
                document.getElementById('info-space').textContent      = data.space_code    || '-';
                document.getElementById('info-business').textContent   = data.business_type || '-';
                document.getElementById('info-type').textContent       = data.space_type    || '-';
                document.getElementById('info-start-date').textContent = start;
                document.getElementById('info-end-date').textContent   = end;
                document.getElementById('info-price').textContent      = data.price ? `$${Number(data.price).toFixed(2)}` : '-';
                document.getElementById('info-email').textContent      = data.email || '-';
                const description = `Monthly Rent - ${data.space_code || 'Unit'} (${period})`;
                me._contractData = {
                    id: data.id,
                    tenant_id: data.tenant_id,
                    space_id: data.space_id,
                    price: parseFloat(data.price || 0),
                    description: description,
                    space_type: data.space_type || 'Rent',
                    period: period,
                    space_code: data.space_code || 'Unit'
                };
                if (me.controls) {
                    if (me.controls.tenant_id)  me.controls.tenant_id.value  = data.tenant_id || '';
                    if (me.controls.space_id)   me.controls.space_id.value   = data.space_id  || '';
                    if (me.controls.contract_invoice_id)
                        me.controls.contract_invoice_id.value = data.id || op.contract_invoice_id;
                }

                me._subtotal = me._contractData.price;
                document.getElementById('items-body').innerHTML = `
                    <tr>
                        <td>${description}</td>
                        <td class="text-center">${me._contractData.space_type}</td>   <!-- shows space_type -->
                        <td class="text-end">$${me._subtotal.toFixed(2)}</td>
                        <td class="text-end text-danger" id="item-discount">-$0.00</td>
                        <td class="text-end text-info" id="item-tax">+$0.00</td>
                        <td class="text-end fw-bold" id="item-net">$${me._subtotal.toFixed(2)}</td>
                    </tr>`;

                if (me.calculateAndUpdate) me.calculateAndUpdate();
            })
            .catch(err => {
                console.error("[Contract Invoice] API failed:", err);
                cv_interact.error('Failed to load contract data');
            });
    };

    return self;
})();


const ContractDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                console.log(111,op);

                return [
                    `<div class="row justify-content-start">
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
                            <div class="material-input outlined">
                                <input name="tenant" class="data-input form-control" data-field="tenant_name">
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="legalName">Legal Name</label>
                            <div class="material-input outlined">
                                <input name="legal_name" class="data-input form-control" disabled data-field="legal_name" />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Start Date</label>
                            <div class="material-input outlined">
                                <input type="text" data-type="date" name="start_date" required class="data-input form-control form_input" data-field="start_date" />
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">End Date</label>
                            <div class="material-input outlined">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" />
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="businessType">Business Type</label>
                            <div class="material-input outlined">
                                <select name="business_type_id" placeholder=" " class="data-input form-control" data-field="business_type_id"> </select>
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px; user-select: none;pointer-events: none;" for="Code">Unit Code</label>
                            <div class="material-input outlined">
                                <select name="code" placeholder=" " class="data-input form-control" data-field="space_id">
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="spaceType">Unit Type</label>
                            <div class="material-input outlined">
                                <select  name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                                </select>
                            </div>
                        </div>
                        <!-- <div class="col-4 sqm-wrapper" style="display:none;"> -->
                            <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Size (m²)</label>
                            <div class="material-input outlined">
                                <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="priceType">Unit Price</label>
                            <div class="material-input outlined">
                            <select name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                                <option value="sqm">Per Square Meter</option>
                                <option value="total">Whole Room</option>
                            </select>
                            </div>
                        </div>



                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Price</label>
                            <div class="material-input outlined">
                                <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                            </div>
                        </div>

                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Remarks</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                            </div>
                        </div>
                    </div>`
                ].join("");
            },

            contentCreated: (me) => {
                me.searchTenant= VSSearchInput.init(me.controls.tenant,{
                    type: 'select',
                    prefetch: true,
                    // api:
                    query: {
                        from: 'tenants',
                        select: ['id', 'name', 'code', 'legal_name'],
                        searchFields: { name: 'LIKE', code: '=',legal_name:'LIKE' },
                        orderBy:[['id','desc']]
                    },
                    // showColumnHeader: false,
                    columns:{
                        code: "Code",
                        name: "Name",
                        // legal_name: "Legal Name"
                    },
                    onSelect: (item) => {
                        console.log(123,item);
                        me.tenant_id = item.id;
                        me.controls.legal_name.value = item.legal_name || '';
                    }
                });
            },

            configSelect: [
                {
                    name: "tenant_id",
                    data: "tenants",
                    textField: "tenant",
                    valueField: "id",
                },
                {
                    name: "business_type_id",
                    data: "business_types",
                    textField: "business_type",
                    valueField: "id",
                },
                {
                    name: "space_type_id",
                    data: "space_types",
                    textField: "space_type",
                    valueField: "id",
                },
                {
                    name: "code",
                    data: "building_spaces",
                    textField: "floor_id",
                    valueField: "id",
                },
            ],

            prepareFormOptions: {
                createTitle: "Create Contract",
                modifyTitle: "Modify Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options",].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                //LocaleManager.translateZone(me.divModal);
                me.tenant_id =data.contract_details.tenant_id;

                // const isReadOnly = me.dataOptions.data.code > 0;
                // me.setReadOnly(isReadOnly, ['code','space_type_id','price_type','price','sqm_size']);

                const header = me.divModal.querySelector('.modal-header');
                const btnClose = header.querySelector('button');
                if(btnClose) btnClose.classList.add('d-none');

                // me.controls.space_type_id.value = me.dataOptions.data.space_type_id;
                // me.controls.code.value = me.dataOptions.data.code;
                // me.controls.price_type.value = me.dataOptions.data.price_type;
                // me.controls.price.value = me.dataOptions.data.price;
                // me.controls.sqm_size.value = me.dataOptions.data.sqm_size;
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: 'btn btn-secondary',
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const op = me.getData();
                        op.tenant_id = me.tenant_id;
                        op.id = me.dataOptions.id;

                        vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Contract has been updated successfully");
                                } else {
                                    cv_interact.success("New contract has been added successfully");
                                }
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                    },
                },
            ],
        });
        dialog.show(op);
    };
    return self;
})();
const RenewDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
           createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="p-3 mb-3 bg-light border rounded">
                                <h6 class="mb-3 text-secondary">Old Contract</h6>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">Start Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="start_date" class="data-input form-control" data-field="start_date" disabled />
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">End Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="end_date" class="data-input form-control" data-field="end_date" disabled />
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">Price</label>
                                        <div class="material-input outlined">
                                            <input type="number" name="price" class="data-input form-control" data-field="price" disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-primary">Renew Contract</h6>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Start Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="start_date" class="data-input form-control" data-field="start_date" />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">End Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="end_date" class="data-input form-control" data-field="end_date" />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Price Type</label>
                                        <div class="material-input outlined">
                                            <select name="price_type" class="data-input form-control" data-field="price_type">
                                                <option value="sqm">Per Square Meter</option>
                                                <option value="total">Whole Room</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Price</label>
                                        <div class="material-input outlined">
                                            <input type="number" name="price" class="data-input form-control" data-field="price" />
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label style="color:#777777;padding-left:6px;">Remarks</label>
                                        <div class="material-input outlined">
                                            <textarea name="remarks" class="data-input form-control" data-field="remarks"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },


            contentCreated: (me) => {
                DateTimePicker.initAll(me.divModal);
            },

            prepareFormOptions: {
                createTitle: "Renew Contract",
                modifyTitle: "Renew Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options"].join(""),
                    params: (op) => ({ id: op.id }),
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.controls.start_date.value = data.contract_details.end_date;
                me.controls.end_date.value = '';
                me.controls.price.value = '';
                me.controls.price_type.value = '';
                me.controls.remarks.value = '';
                // me.controls.price.value = data.contract_details.price;
                // me.controls.price_type.value = data.contract_details.price_type;
                // me.controls.remarks.value = data.contract_details.remarks;
                me.detail = data.contract_details;
            },

            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn-vs-cancel',
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span>Renew</span>',
                    cssClass: 'btn-vs-save',
                    click: (me, btn) => {
                        const op = me.getData();
                        op.id = me.dataOptions.id; // existing contract id

                        vsapi.call([main_view.base_url, "/prm/contract/renew"].join(""), op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success("Contract has been renewed successfully");
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();



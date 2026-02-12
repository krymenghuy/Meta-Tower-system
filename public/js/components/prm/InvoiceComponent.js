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
            title: "Code",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.space_code || '—'}</span>`,
        },
        {
            title: "Due",
            className: "align-middle text-primary",
            data: (data) => {
                const amt = data.amount? Number(data.amount).toLocaleString() : '—';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Pay",
            className: "align-middle text-success",
            data: (data) => {
                const amt = data.paid_amount? Number(data.paid_amount).toLocaleString() : '—';
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            title: "Balance",
            className: "align-middle text-danger",
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
                tr.dataset.statusid = data.status_id;
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
        container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary " role="status"></div></div>';

        vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }

                const invoice = res.data || res || {};
                console.log("Invoice detail loaded:", invoice);
                mThis.renderInvoiceDetail(container, invoice);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const amount    = Number(invoice.amount || invoice.total || invoice.total_amount || 0);
        const discount  = Number(invoice.discount || invoice.discount_amount || 0);
        const netAmount = Number(invoice.net_amount || invoice.final_amount || invoice.due_amount || (amount - discount) || amount);
        const dueDate   = invoice.due_date || invoice.due_on || invoice.expiry_date || '—';
        const feeType   = invoice.service_id || invoice.invoice_type || invoice.fee_type || invoice.type_name || invoice.type || '—';

        const html = `
            <div class="bg-white rounded">
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <tbody>
                            <tr style="background-color: #fbf8cc;">
                                <th>Fee Type</th>
                                <th>Duration / Due Date</th>
                                <th class="text-end">Amount</th>
                                <th class="text-end">Discount</th>
                                <th class="text-end">Net Amount</th>
                            </tr>
                            <tr>
                                <td>${feeType}</td>
                                <td>${dueDate}</td>
                                <td class="text-end">${mThis.currency_symbol}${amount.toLocaleString()}</td>
                                <td class="text-end text-danger">-${mThis.currency_symbol}${discount.toLocaleString()}</td>
                                <td class="text-end fw-bold">${mThis.currency_symbol}${netAmount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-end fw-bold">Total Net Amount</td>
                                <td class="text-end fw-bold fs-5">${mThis.currency_symbol}${netAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
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

// const InvoiceDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog = dialog || new GeneralDialog({
//             cssClass: "modal-lg",
//             backdrop: "static",
//             keyboard: true,
//             createContent: () => {
//                 console.log(111,op);
//                 return [
//                     `<div class="row justify-content-start">
//                         <div class="col-6">
//                             <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
//                             <div class="material-input outlined">
//                                 <select name="tenant_id" class="data-input form-control" data-field="tenant_id"> </select>
//                             </div>
//                         </div>
//                         <div class="col-6">
//                             <label style="color:#777777;padding-left:6px;" for="legalName">Legal Name</label>
//                             <div class="material-input outlined">
//                                 <input name="legal_name" class="data-input form-control" data-field="legal_name" />
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;" for="businessType">Business Type</label>
//                             <div class="material-input outlined">
//                                 <select name="business_type_id" placeholder=" " class="data-input form-control" data-field="business_type_id"> </select>
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;" for="spaceType">Space Type</label>
//                             <div class="material-input outlined">
//                                 <select  name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
//                                 </select>
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px; user-select: none;pointer-events: none;" for="Code">Code</label>
//                             <div class="material-input outlined">
//                                 <select name="code" placeholder=" " class="data-input form-control" data-field="space_id">
//                                 </select>
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;">Start Date</label>
//                             <div class="material-input outlined">
//                                 <input type="date" name="start_date" required class="data-input form-control form_input" data-field="start_date" />
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;">End Date</label>
//                             <div class="material-input outlined">
//                                 <input type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" />
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;" for="priceType">Unit Price</label>
//                             <div class="material-input outlined">
//                             <select name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
//                                 <option value="sqm">Per Square Meter</option>
//                                 <option value="total">Whole Room</option>
//                             </select>
//                             </div>
//                         </div>

//                         <div class="col-4 sqm-wrapper" style="display:none;">
//                             <label style="color:#777777;padding-left:6px;">Unit (m²)</label>
//                             <div class="material-input outlined">
//                                 <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
//                             </div>
//                         </div>

//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;">Price</label>
//                             <div class="material-input outlined">
//                                 <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
//                             </div>
//                         </div>

//                         <div class="col-12">
//                             <label style="color:#777777;padding-left:6px;">Remarks</label>
//                             <div class="material-input outlined">
//                                 <textarea class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
//                             </div>
//                         </div>
//                     </div>`
//                 ].join("");
//             },

//             contentCreated: (me) => {
//                 DateTimePicker.initAll(me.divModal);

//                 const footer = me.divModal.querySelector('.modal-footer');
//                 const header = me.divModal.querySelector('.modal-header');
//                 const headerTitle = header.querySelector('.modal-title');
//                 const btnClose = header.querySelector('button');

//                 btnClose.classList.add('d-none');
//                 header.classList.add('bg-prm-custom', 'modal-header-custom');
//                 header.parentElement.classList.add('overflow-hidden');
//                 header.parentElement.style = 'border-radius: 20px !important;';

//                 const headerWrapper = document.createElement('div');
//                 headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
//                 headerTitle.classList.add('text-white', 'text-center', 'w-100');
//                 headerWrapper.appendChild(headerTitle);
//                 header.innerHTML = '';
//                 header.appendChild(headerWrapper);

//                 me.controls.price_type.onchange = (e) => {
//                     const sqmWrapper = me.controls.sqm_size.closest('.sqm-wrapper');
//                     if (!sqmWrapper) return;
//                     sqmWrapper.style.display = e.target.value === 'sqm' ? '' : 'none';
//                 };
//             },

//             configSelect: [
//                 {
//                     name: "tenant_id",
//                     data: "tenants",
//                     textField: "tenant",
//                     valueField: "id",
//                 },
//                 {
//                     name: "business_type_id",
//                     data: "business_types",
//                     textField: "business_type",
//                     valueField: "id",
//                 },
//                 {
//                     name: "space_type_id",
//                     data: "space_types",
//                     textField: "space_type",
//                     valueField: "id",
//                 },
//                 {
//                     name: "code",
//                     data: "building_spaces",
//                     textField: "floor_id",
//                     valueField: "id",
//                 },
//             ],

//             prepareFormOptions: {
//                 createTitle: "Create Invoice",
//                 modifyTitle: "Modify Invoice",
//                 targetProp: "Invoice_details",
//                 api: {
//                     endpoint: [main_view.base_url, "/prm/invoice/form-options",].join(""),
//                     params: (op) => {
//                         return { id: op.id };
//                     },
//                 },
//             },

//             onPrepareForm: (me, data) => {
//                 LocaleManager.translateZone(me.divModal);

//                 const header = me.divModal.querySelector('.modal-header');
//                 const btnClose = header.querySelector('button');
//                 if(btnClose) btnClose.classList.add('d-none');
//             },

//             buttons: [
//                 {
//                     label: '<span>Cancel</span>',
//                     cssClass: 'btn-vs-cancel',
//                     click: (me, btn) => {
//                         me.hide(false);
//                     },
//                 },
//                 {
//                     label: '<span>Submit</span>',
//                     cssClass: 'btn-vs-save',
//                     click: (me, btn) => {
//                         const op = me.getData();
//                         op.id = me.dataOptions.id;

//                         vsapi.call([main_view.base_url, "/prm/invoice/save",].join(""), op, btn, null).then((res) => {
//                             if (res.status_code === 200) {
//                                 me.hide(true, op);
//                                 if (me.dataOptions.id > 0) {
//                                     cv_interact.success("Invoice has been updated successfully");
//                                 } else {
//                                     cv_interact.success("New invoice has been added successfully");
//                                 }
//                             } else {
//                                 cv_interact.error(res.error_message);
//                             }
//                         });
//                     },
//                 },
//             ],
//         });
//         dialog.show(op);
//     };
//     return self;
// })();

// const InvoiceDialog = (() => {
//     const self = {};
//     let dialog = null;
//     let invoiceItems = []; // Store line items
//     let currentPeriod = {
//         month: new Date().getMonth() + 1,
//         year: new Date().getFullYear()
//     };

//     // Calculate totals
//     const calculateTotals = () => {
//         let subtotal = 0;
//         let vat = 0;
//         let grandTotal = 0;

//         invoiceItems.forEach(item => {
//             subtotal += parseFloat(item.amount || 0);
//         });

//         vat = subtotal * 0.07; // 7% VAT
//         grandTotal = subtotal + vat;

//         return { subtotal, vat, grandTotal };
//     };

//     // Render invoice items table
//     const renderItemsTable = () => {
//         const tbody = dialog.controls.invoice_items_tbody;
//         if (!tbody) return;

//         tbody.innerHTML = '';
//         const { subtotal, vat, grandTotal } = calculateTotals();

//         // Add invoice items
//         invoiceItems.forEach((item, index) => {
//             const row = tbody.insertRow();

//             row.innerHTML = `
//                 <td>${item.description}</td>
//                 <td class="text-center">${item.period || '-'}</td>
//                 <td class="text-center">${item.quantity || 1}</td>
//                 <td class="text-center">${formatCurrency(item.rate)}</td>
//                 <td class="text-end">${formatCurrency(item.amount)}</td>
//                 <td class="text-center">
//                     <button type="button" class="btn btn-sm btn-danger btn-remove-item" data-index="${index}">
//                         <i class="fas fa-trash"></i>
//                     </button>
//                 </td>
//             `;
//         });

//         // Update totals display
//         if (dialog.controls.subtotal) dialog.controls.subtotal.value = formatCurrency(subtotal);
//         if (dialog.controls.vat_amount) dialog.controls.vat_amount.value = formatCurrency(vat);
//         if (dialog.controls.grand_total) dialog.controls.grand_total.value = formatCurrency(grandTotal);
//     };

//     // Format currency
//     const formatCurrency = (amount) => {
//         return parseFloat(amount || 0).toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         });
//     };

//     // Add invoice item
//     const addInvoiceItem = (item) => {
//         invoiceItems.push(item);
//         renderItemsTable();
//     };

//     // Service selection dialog
//     const showServiceSelection = (tenantId, spaceId) => {
//         const serviceDialog = new GeneralDialog({
//             cssClass: "modal-lg",
//             title: "Select Services to Bill",
//             createContent: () => `
//                 <div class="container-fluid py-3">
//                     <!-- Service Categories -->
//                     <div class="row mb-4">
//                         <div class="col-12">
//                             <ul class="nav nav-tabs" id="serviceTabs" role="tablist">
//                                 <li class="nav-item" role="presentation">
//                                     <button class="nav-link active" id="recurring-tab" data-bs-toggle="tab" data-bs-target="#recurring" type="button">
//                                         Recurring Charges
//                                     </button>
//                                 </li>
//                                 <li class="nav-item" role="presentation">
//                                     <button class="nav-link" id="utilities-tab" data-bs-toggle="tab" data-bs-target="#utilities" type="button">
//                                         Utilities
//                                     </button>
//                                 </li>
//                                 <li class="nav-item" role="presentation">
//                                     <button class="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#services" type="button">
//                                         On-Demand Services
//                                     </button>
//                                 </li>
//                                 <li class="nav-item" role="presentation">
//                                     <button class="nav-link" id="amenities-tab" data-bs-toggle="tab" data-bs-target="#amenities" type="button">
//                                         Amenities
//                                     </button>
//                                 </li>
//                             </ul>

//                             <div class="tab-content mt-3" id="serviceTabsContent">
//                                 <!-- Recurring Charges Tab -->
//                                 <div class="tab-pane fade show active" id="recurring">
//                                     <div class="row">
//                                         <div class="col-6">
//                                             <div class="form-check mb-2">
//                                                 <input class="form-check-input service-checkbox" type="checkbox" value="base_rent" id="base_rent">
//                                                 <label class="form-check-label" for="base_rent">
//                                                     Base Rent
//                                                 </label>
//                                             </div>
//                                             <div class="form-check mb-2">
//                                                 <input class="form-check-input service-checkbox" type="checkbox" value="cam" id="cam">
//                                                 <label class="form-check-label" for="cam">
//                                                     CAM/Service Charge
//                                                 </label>
//                                             </div>
//                                         </div>
//                                         <div class="col-6">
//                                             <div class="form-check mb-2">
//                                                 <input class="form-check-input service-checkbox" type="checkbox" value="internet" id="internet">
//                                                 <label class="form-check-label" for="internet">
//                                                     Internet Service
//                                                 </label>
//                                             </div>
//                                             <div class="form-check mb-2">
//                                                 <input class="form-check-input service-checkbox" type="checkbox" value="cleaning_sub" id="cleaning_sub">
//                                                 <label class="form-check-label" for="cleaning_sub">
//                                                     Cleaning Subscription
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <!-- Utilities Tab -->
//                                 <div class="tab-pane fade" id="utilities">
//                                     <div class="row">
//                                         <div class="col-6">
//                                             <div class="mb-3">
//                                                 <label>Electricity (kWh)</label>
//                                                 <input type="number" class="form-control" id="electricity_usage" placeholder="Enter consumption">
//                                             </div>
//                                         </div>
//                                         <div class="col-6">
//                                             <div class="mb-3">
//                                                 <label>Water (m³)</label>
//                                                 <input type="number" class="form-control" id="water_usage" placeholder="Enter consumption">
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <!-- Services Tab -->
//                                 <div class="tab-pane fade" id="services">
//                                     <table class="table table-sm">
//                                         <thead>
//                                             <tr>
//                                                 <th>Service</th>
//                                                 <th>Type</th>
//                                                 <th>Date/Period</th>
//                                                 <th>Quantity</th>
//                                                 <th>Add</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody id="serviceRequests">
//                                             <!-- Will be populated via API -->
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 <!-- Amenities Tab -->
//                                 <div class="tab-pane fade" id="amenities">
//                                     <table class="table table-sm">
//                                         <thead>
//                                             <tr>
//                                                 <th>Amenity</th>
//                                                 <th>Booking Date</th>
//                                                 <th>Hours/Days</th>
//                                                 <th>Rate</th>
//                                                 <th>Add</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody id="amenityBookings">
//                                             <!-- Will be populated via API -->
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Selected Items Preview -->
//                     <div class="row">
//                         <div class="col-12">
//                             <h6>Selected Items</h6>
//                             <div class="table-responsive">
//                                 <table class="table table-sm">
//                                     <thead>
//                                         <tr>
//                                             <th>Description</th>
//                                             <th>Period</th>
//                                             <th>Quantity</th>
//                                             <th>Rate</th>
//                                             <th>Amount</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody id="selectedItemsPreview">
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             `,
//             contentCreated: (me) => {
//                 // Load service requests and bookings via API
//                 loadServiceRequests(tenantId, spaceId);
//                 loadAmenityBookings(tenantId);

//                 // Initialize tab functionality
//                 const tabTriggerList = [].slice.call(me.divModal.querySelectorAll('[data-bs-toggle="tab"]'));
//                 tabTriggerList.forEach(tabTriggerEl => {
//                     new bootstrap.Tab(tabTriggerEl);
//                 });
//             },
//             buttons: [
//                 {
//                     label: 'Cancel',
//                     cssClass: 'btn-secondary',
//                     click: (me) => me.hide(false)
//                 },
//                 {
//                     label: 'Add Selected',
//                     cssClass: 'btn-primary',
//                     click: (me) => {
//                         // Collect selected items and add to invoice
//                         const selectedServices = collectSelectedServices();
//                         selectedServices.forEach(item => addInvoiceItem(item));
//                         me.hide(true);
//                     }
//                 }
//             ]
//         });

//         serviceDialog.show({});
//     };

//     // Load service requests for tenant
//     const loadServiceRequests = (tenantId, spaceId) => {
//         vsapi.call([main_view.base_url, "/prm/service-requests/unbilled"].join(""),
//             { tenant_id: tenantId, space_id: spaceId },
//             null,
//             (res) => {
//                 if (res.status_code === 200 && res.data) {
//                     const tbody = dialog.controls.serviceRequests;
//                     if (!tbody) return;

//                     tbody.innerHTML = '';
//                     res.data.forEach(request => {
//                         const row = tbody.insertRow();
//                         row.innerHTML = `
//                             <td>${request.service_name}</td>
//                             <td>${request.service_type}</td>
//                             <td>${formatDate(request.service_date)}</td>
//                             <td>
//                                 <input type="number" class="form-control form-control-sm quantity-input"
//                                        value="${request.quantity || 1}"
//                                        data-rate="${request.rate}"
//                                        data-id="${request.id}">
//                             </td>
//                             <td>
//                                 <button class="btn btn-sm btn-outline-primary add-service-btn"
//                                         data-service='${JSON.stringify(request)}'>
//                                     <i class="fas fa-plus"></i>
//                                 </button>
//                             </td>
//                         `;
//                     });
//                 }
//             }
//         );
//     };

//     // Main invoice dialog
//     self.show = (op) => {
//         dialog = dialog || new GeneralDialog({
//             cssClass: "modal-xl",
//             backdrop: "static",
//             keyboard: true,
//             createContent: () => {
//                 return `
//                 <div class="container-fluid py-3">
//                     <!-- Invoice Header -->
//                     <div class="row mb-4">
//                         <div class="col-6">
//                             <div class="mt-2">
//                                 <div class="d-flex align-items-center mb-2">
//                                     <span class="me-2" style="min-width: 100px;">Invoice #:</span>
//                                     <div class="material-input outlined flex-grow-1">
//                                         <input name="invoice_number" class="data-input form-control"
//                                             ata-field="invoice_number" placeholder="Auto-generated" readonly />
//                                     </div>
//                                 </div>
//                                 <div class="d-flex align-items-center mb-2">
//                                     <span class="me-2" style="min-width: 100px;">Period:</span>
//                                     <div class="d-flex gap-2 flex-grow-1">
//                                         <div class="material-input outlined flex-grow-1">
//                                             <select name="invoice_month" class="data-input form-control" data-field="invoice_month">
//                                                 ${Array.from({length: 12}, (_, i) =>
//                                                     `<option value="${i+1}" ${i+1 === currentPeriod.month ? 'selected' : ''}>
//                                                         ${new Date(2000, i).toLocaleString('default', { month: 'long' })}
//                                                     </option>`
//                                                 ).join('')}
//                                             </select>
//                                         </div>
//                                         <div class="material-input outlined flex-grow-1">
//                                             <select name="invoice_year" class="data-input form-control" data-field="invoice_year">
//                                                 ${Array.from({length: 5}, (_, i) => {
//                                                     const year = new Date().getFullYear() - 2 + i;
//                                                     return `<option value="${year}" ${year === currentPeriod.year ? 'selected' : ''}>${year}</option>`;
//                                                 }).join('')}
//                                             </select>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="d-flex align-items-center">
//                                     <span class="me-2" style="min-width: 100px;">Due Date:</span>
//                                     <div class="material-input outlined flex-grow-1">
//                                         <input type="date" name="due_date" class="data-input form-control" data-field="due_date" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-6 text-end">
//                             <div class="mb-3">
//                                 <h5 class="text-muted mb-1">Billed To:</h5>
//                                 <div class="d-flex justify-content-end mb-2">
//                                     <div style="min-width: 200px;">
//                                         <div class="material-input outlined">
//                                             <select name="tenant_id" class="data-input form-control" data-field="tenant_id" style="text-align: right;"></select>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div id="tenantInfo" class="text-muted">
//                                     <!-- Tenant details will be populated here -->
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Tenant & Space Selection -->
//                     <div class="row mb-4">
//                         <div class="col-4">
//                             <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
//                             <div class="material-input outlined">
//                                 <select name="tenant_id" class="data-input form-control" data-field="tenant_id"> </select>
//                         </div>
//                             </div>
//                         <div class="col-4">
//                             <label class="form-label">Legal Name</label>
//                             <div class="material-input outlined">
//                                 <input name="legal_name" class="data-input form-control" data-field="legal_name" />
//                             </div>
//                         </div>
//                         <div class="col-4">
//                             <label class="form-label">Business Type</label>
//                             <div class="material-input outlined">
//                                 <select name="business_type_id" class="data-input form-control" data-field="business_type_id"></select>
//                             </div>
//                         </div>
//                         <div class="col-4">
//                             <label class="form-label">Space</label>
//                             <div class="material-input outlined">
//                                 <select name="space_id" class="data-input form-control" data-field="space_id"></select>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Invoice Line Items -->
//                     <div class="row mb-4">
//                         <div class="col-12">
//                             <div class="d-flex justify-content-between align-items-center mb-3">
//                                 <h5 class="mb-0">Invoice Items</h5>
//                                 <div class="btn-group">
//                                     <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddBaseCharges">
//                                         <i class="fas fa-plus me-1"></i> Add Base Charges
//                                     </button>
//                                     <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddServices">
//                                         <i class="fas fa-concierge-bell me-1"></i> Add Services
//                                     </button>
//                                     <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddManual">
//                                         <i class="fas fa-edit me-1"></i> Add Manual
//                                     </button>
//                                 </div>
//                             </div>

//                             <div class="table-responsive">
//                                 <table class="table table-bordered">
//                                     <thead class="table-light">
//                                         <tr>
//                                             <th width="35%">Description</th>
//                                             <th width="15%" class="text-center">Period</th>
//                                             <th width="10%" class="text-center">Quantity</th>
//                                             <th width="15%" class="text-center">Rate</th>
//                                             <th width="15%" class="text-center">Amount</th>
//                                             <th width="10%" class="text-center">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody id="invoice_items_tbody">
//                                         <!-- Invoice items will be populated here -->
//                                     </tbody>
//                                     <tfoot>
//                                         <tr>
//                                             <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
//                                             <td class="text-end">
//                                                 <div class="material-input outlined">
//                                                     <input type="text" name="subtotal" class="data-input form-control text-end"
//                                                            data-field="subtotal" readonly />
//                                                 </div>
//                                             </td>
//                                             <td></td>
//                                         </tr>
//                                         <tr>
//                                             <td colspan="4" class="text-end"><strong>VAT (7%):</strong></td>
//                                             <td class="text-end">
//                                                 <div class="material-input outlined">
//                                                     <input type="text" name="vat_amount" class="data-input form-control text-end"
//                                                            data-field="vat_amount" readonly />
//                                                 </div>
//                                             </td>
//                                             <td></td>
//                                         </tr>
//                                         <tr>
//                                             <td colspan="4" class="text-end"><strong>Grand Total:</strong></td>
//                                             <td class="text-end">
//                                                 <div class="material-input outlined">
//                                                     <input type="text" name="grand_total" class="data-input form-control text-end"
//                                                            data-field="grand_total" readonly />
//                                                 </div>
//                                             </td>
//                                             <td></td>
//                                         </tr>
//                                     </tfoot>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Additional Information -->
//                     <div class="row">
//                         <div class="col-12">
//                             <label class="form-label">Notes / Payment Instructions</label>
//                             <div class="material-input outlined">
//                                 <textarea name="notes" class="data-input form-control" data-field="notes" rows="3"
//                                         placeholder="Payment terms, bank details, etc."></textarea>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Hidden data storage -->
//                     <input type="hidden" name="invoice_items" data-field="invoice_items" />
//                 </div>`;
//             },

//             contentCreated: (me) => {
//                 // Initialize date pickers
//                 DateTimePicker.initAll(me.divModal);

//                 // Set default due date (today + 7 days)
//                 const dueDate = new Date();
//                 dueDate.setDate(dueDate.getDate() + 7);
//                 me.controls.due_date.value = dueDate.toISOString().split('T')[0];

//                 // Generate invoice number
//                 me.controls.invoice_number.value = `INV-${currentPeriod.year}${String(currentPeriod.month).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

//                 // Event listeners
//                 me.controls.tenant_id.onchange = () => loadTenantInfo(me);
//                 me.controls.space_id.onchange = () => loadSpaceInfo(me);

//                 // Button events
//                 me.controls.btnAddBaseCharges.onclick = () => addBaseCharges(me);
//                 me.controls.btnAddServices.onclick = () => {
//                     const tenantId = me.controls.tenant_id.value;
//                     const spaceId = me.controls.space_id.value;
//                     if (tenantId && spaceId) {
//                         showServiceSelection(tenantId, spaceId);
//                     } else {
//                         cv_interact.warning("Please select tenant and space first");
//                     }
//                 };
//                 me.controls.btnAddManual.onclick = () => showManualItemDialog(me);

//                 // Initialize empty invoice items array
//                 invoiceItems = [];
//                 renderItemsTable();
//             },

//             configSelect: [
//                 {
//                     name: "tenant_id",
//                     data: "tenants",
//                     textField: "tenant_name",
//                     valueField: "id",
//                 },
//                 {
//                     name: "business_type_id",
//                     data: "business_types",
//                     textField: "business_type",
//                     valueField: "id"
//                 },
//                 {
//                     name: "space_id",
//                     data: "building_spaces",
//                     textField: "space_code",
//                     valueField: "id",
//                     params: (me) => ({
//                         tenant_id: me.controls.tenant_id.value
//                     })
//                 }
//             ],

//             prepareFormOptions: {
//                 createTitle: "Create New Invoice",
//                 modifyTitle: "Edit Invoice",
//                 targetProp: "Invoice",
//                 api: {
//                     endpoint: [main_view.base_url, "/prm/invoice/form-options"].join(""),
//                     params: (op) => ({ id: op.id })
//                 }
//             },

//             onPrepareForm: (me, data) => {
//                 LocaleManager.translateZone(me.divModal);

//                 if (data.Invoice && data.Invoice.invoice_items) {
//                     invoiceItems = JSON.parse(data.Invoice.invoice_items || '[]');
//                     renderItemsTable();
//                 }

//                 // Custom styling
//                 const header = me.divModal.querySelector('.modal-header');
//                 const btnClose = header.querySelector('button');
//                 if (btnClose) btnClose.classList.add('d-none');
//                 header.classList.add('bg-prm-custom', 'modal-header-custom');
//             },

//             buttons: [
//                 {
//                     label: '<span>Cancel</span>',
//                     cssClass: 'btn-vs-cancel',
//                     click: (me) => {
//                         me.hide(false);
//                     }
//                 },
//                 {
//                     label: '<span>Preview Invoice</span>',
//                     cssClass: 'btn-vs-secondary',
//                     click: (me) => {
//                         previewInvoice(me);
//                     }
//                 },
//                 {
//                     label: '<span>Save & Send</span>',
//                     cssClass: 'btn-vs-save',
//                     click: (me) => {
//                         saveInvoice(me, true); // true = send email
//                     }
//                 },
//                 {
//                     label: '<span>Save Draft</span>',
//                     cssClass: 'btn-vs-primary',
//                     click: (me) => {
//                         saveInvoice(me, false); // false = don't send
//                     }
//                 }
//             ]
//         });

//         dialog.show(op);
//     };

//     // Load tenant information
//     const loadTenantInfo = (me) => {
//         const tenantId = me.controls.tenant_id.value;
//         if (!tenantId) return;

//         vsapi.call([main_view.base_url, "/prm/tenant/info"].join(""),
//             { id: tenantId },
//             null,
//             (res) => {
//                 if (res.status_code === 200 && res.data) {
//                     const tenant = res.data;
//                     const tenantInfoDiv = me.controls.tenantInfo;
//                     tenantInfoDiv.innerHTML = `
//                         <p class="mb-1"><strong>${tenant.legal_name || tenant.company_name}</strong></p>
//                         <p class="mb-1">${tenant.address || ''}</p>
//                         <p class="mb-1">Tax ID: ${tenant.tax_id || 'N/A'}</p>
//                         <p class="mb-0">Email: ${tenant.email || 'N/A'}</p>
//                     `;
//                     me.controls.legal_name.value = tenant.legal_name || '';
//                 }
//             }
//         );
//     };

//     // Load space information
//     const loadSpaceInfo = (me) => {
//         const spaceId = me.controls.space_id.value;
//         if (!spaceId) return;

//         vsapi.call([main_view.base_url, "/prm/space/info"].join(""),
//             { id: spaceId },
//             null,
//             (res) => {
//                 if (res.status_code === 200 && res.data) {
//                     const space = res.data;
//                     // You can use space info for calculations
//                 }
//             }
//         );
//     };

//     // Add base charges (rent, CAM, etc.)
//     const addBaseCharges = (me) => {
//         const tenantId = me.controls.tenant_id.value;
//         const spaceId = me.controls.space_id.value;
//         const month = me.controls.invoice_month.value;
//         const year = me.controls.invoice_year.value;

//         if (!tenantId || !spaceId) {
//             cv_interact.warning("Please select tenant and space first");
//             return;
//         }

//         vsapi.call([main_view.base_url, "/prm/invoice/calculate-base-charges"].join(""),
//             {
//                 tenant_id: tenantId,
//                 space_id: spaceId,
//                 month: month,
//                 year: year
//             },
//             null,
//             (res) => {
//                 if (res.status_code === 200 && res.data) {
//                     res.data.forEach(charge => {
//                         addInvoiceItem({
//                             description: charge.description,
//                             period: `${month}/${year}`,
//                             quantity: charge.quantity || 1,
//                             rate: charge.rate,
//                             amount: charge.amount,
//                             charge_type: charge.charge_type,
//                             reference_id: charge.reference_id
//                         });
//                     });
//                     cv_interact.success("Base charges added successfully");
//                 }
//             }
//         );
//     };

//     // Manual item dialog
//     const showManualItemDialog = (me) => {
//         const manualDialog = new GeneralDialog({
//             cssClass: "modal-md",
//             title: "Add Manual Item",
//             createContent: () => `
//                 <div class="container-fluid py-3">
//                     <div class="row">
//                         <div class="col-12 mb-3">
//                             <label>Description</label>
//                             <div class="material-input outlined">
//                                 <input type="text" class="form-control" id="manual_description"
//                                        placeholder="Item description">
//                             </div>
//                         </div>
//                         <div class="col-6 mb-3">
//                             <label>Quantity</label>
//                             <div class="material-input outlined">
//                                 <input type="number" class="form-control" id="manual_quantity" value="1" min="1">
//                             </div>
//                         </div>
//                         <div class="col-6 mb-3">
//                             <label>Rate/Price</label>
//                             <div class="material-input outlined">
//                                 <input type="number" class="form-control" id="manual_rate"
//                                        placeholder="0.00" step="0.01">
//                             </div>
//                         </div>
//                         <div class="col-12 mb-3">
//                             <label>Charge Type</label>
//                             <div class="material-input outlined">
//                                 <select class="form-control" id="manual_charge_type">
//                                     <option value="other">Other</option>
//                                     <option value="penalty">Penalty/Late Fee</option>
//                                     <option value="adjustment">Adjustment</option>
//                                     <option value="deposit">Security Deposit</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             `,
//             buttons: [
//                 {
//                     label: 'Cancel',
//                     cssClass: 'btn-secondary',
//                     click: (m) => m.hide(false)
//                 },
//                 {
//                     label: 'Add Item',
//                     cssClass: 'btn-primary',
//                     click: (m) => {
//                         const description = m.controls.manual_description.value;
//                         const quantity = parseFloat(m.controls.manual_quantity.value) || 1;
//                         const rate = parseFloat(m.controls.manual_rate.value) || 0;
//                         const chargeType = m.controls.manual_charge_type.value;

//                         if (!description || rate <= 0) {
//                             cv_interact.warning("Please enter description and valid rate");
//                             return;
//                         }

//                         addInvoiceItem({
//                             description: description,
//                             period: `${currentPeriod.month}/${currentPeriod.year}`,
//                             quantity: quantity,
//                             rate: rate,
//                             amount: quantity * rate,
//                             charge_type: chargeType,
//                             is_manual: true
//                         });

//                         m.hide(true);
//                         cv_interact.success("Manual item added");
//                     }
//                 }
//             ]
//         });

//         manualDialog.show({});
//     };

//     // Preview invoice
//     const previewInvoice = (me) => {
//         const invoiceData = prepareInvoiceData(me);

//         // Open preview in new window or modal
//         const previewWindow = window.open('', '_blank');
//         previewWindow.document.write(`
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <title>Invoice Preview - ${invoiceData.invoice_number}</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; margin: 40px; }
//                     .invoice-header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
//                     .total-row { font-weight: bold; background: #f8f9fa; }
//                 </style>
//             </head>
//             <body>
//                 <div class="invoice-header">
//                     <h1>INVOICE</h1>
//                     <p><strong>Invoice #:</strong> ${invoiceData.invoice_number}</p>
//                     <p><strong>Period:</strong> ${invoiceData.invoice_month}/${invoiceData.invoice_year}</p>
//                     <p><strong>Due Date:</strong> ${invoiceData.due_date}</p>
//                 </div>

//                 <h3>Bill To:</h3>
//                 <p>${invoiceData.legal_name}<br>
//                 ${invoiceData.tenant_address || ''}</p>

//                 <table border="1" cellpadding="8" cellspacing="0" width="100%">
//                     <thead>
//                         <tr>
//                             <th>Description</th>
//                             <th>Period</th>
//                             <th>Qty</th>
//                             <th>Rate</th>
//                             <th>Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${invoiceItems.map(item => `
//                             <tr>
//                                 <td>${item.description}</td>
//                                 <td align="center">${item.period || '-'}</td>
//                                 <td align="center">${item.quantity}</td>
//                                 <td align="right">${formatCurrency(item.rate)}</td>
//                                 <td align="right">${formatCurrency(item.amount)}</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                     <tfoot>
//                         <tr class="total-row">
//                             <td colspan="4" align="right">Subtotal:</td>
//                             <td align="right">${formatCurrency(calculateTotals().subtotal)}</td>
//                         </tr>
//                         <tr class="total-row">
//                             <td colspan="4" align="right">VAT (7%):</td>
//                             <td align="right">${formatCurrency(calculateTotals().vat)}</td>
//                         </tr>
//                         <tr class="total-row">
//                             <td colspan="4" align="right">Grand Total:</td>
//                             <td align="right">${formatCurrency(calculateTotals().grandTotal)}</td>
//                         </tr>
//                     </tfoot>
//                 </table>

//                 <div style="margin-top: 30px;">
//                     <p><strong>Notes:</strong><br>${invoiceData.notes || ''}</p>
//                 </div>
//             </body>
//             </html>
//         `);
//         previewWindow.document.close();
//     };

//     // Prepare invoice data for saving
//     const prepareInvoiceData = (me) => {
//         const { subtotal, vat, grandTotal } = calculateTotals();

//         return {
//             id: me.dataOptions?.id || 0,
//             tenant_id: me.controls.tenant_id.value,
//             legal_name: me.controls.legal_name.value,
//             business_type_id: me.controls.business_type_id.value,
//             space_id: me.controls.space_id.value,
//             invoice_number: me.controls.invoice_number.value,
//             invoice_month: me.controls.invoice_month.value,
//             invoice_year: me.controls.invoice_year.value,
//             due_date: me.controls.due_date.value,
//             subtotal: subtotal,
//             vat_amount: vat,
//             grand_total: grandTotal,
//             notes: me.controls.notes.value,
//             invoice_items: JSON.stringify(invoiceItems),
//             status: 'draft'
//         };
//     };

//     // Save invoice
//     const saveInvoice = (me, sendEmail = false) => {
//         const invoiceData = prepareInvoiceData(me);

//         // Validate required fields
//         if (!invoiceData.tenant_id) {
//             cv_interact.error("Please select a tenant");
//             return;
//         }

//         if (invoiceItems.length === 0) {
//             cv_interact.error("Please add at least one invoice item");
//             return;
//         }

//         invoiceData.send_email = sendEmail;

//         vsapi.call([main_view.base_url, "/prm/invoice/save"].join(""),
//             invoiceData,
//             me.buttons[3], // Save button
//             (res) => {
//                 if (res.status_code === 200) {
//                     me.hide(true, invoiceData);
//                     if (sendEmail) {
//                         cv_interact.success("Invoice saved and sent to tenant successfully");
//                     } else {
//                         cv_interact.success("Invoice saved as draft successfully");
//                     }
//                 } else {
//                     cv_interact.error(res.error_message || "Error saving invoice");
//                 }
//             }
//         );
//     };

//     // Helper function to format date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     return self;
// })();


const InvoiceDialog = (() => {
    const self = {};
    let dialog = null;
    let invoiceItems = [];
    let currentTenant = null;
    let currentSpace = null;
    let currentPeriod = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    };

    // Modern color scheme
    const colors = {
        primary: '#4361ee',
        secondary: '#3a0ca3',
        success: '#4cc9f0',
        warning: '#f72585',
        light: '#f8f9fa',
        dark: '#212529'
    };

    // Format currency
    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' ฿';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0;
        let vat = 0;
        let grandTotal = 0;

        invoiceItems.forEach(item => {
            subtotal += parseFloat(item.amount || 0);
        });

        vat = subtotal * 0.07;
        grandTotal = subtotal + vat;

        return { subtotal, vat, grandTotal };
    };

    // Render invoice items with modern design
    const renderItemsTable = () => {
        const tbody = dialog.controls.invoice_items_tbody;
        if (!tbody) return;

        tbody.innerHTML = '';
        const { subtotal, vat, grandTotal } = calculateTotals();

        invoiceItems.forEach((item, index) => {
            const row = tbody.insertRow();
            row.className = 'align-middle';

            row.innerHTML = `
                <td>
                    <div class="fw-medium">${item.description}</div>
                    ${item.charge_type ? `<small class="text-muted badge bg-light text-dark">${item.charge_type}</small>` : ''}
                </td>
                <td class="text-center">
                    <span class="badge bg-light text-dark">${item.period || 'Monthly'}</span>
                </td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-center fw-medium">${formatCurrency(item.rate)}</td>
                <td class="text-end fw-bold">${formatCurrency(item.amount)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger btn-remove-item"
                            data-index="${index}" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });

        // Update totals
        if (dialog.controls.subtotal) dialog.controls.subtotal.value = formatCurrency(subtotal);
        if (dialog.controls.vat_amount) dialog.controls.vat_amount.value = formatCurrency(vat);
        if (dialog.controls.grand_total) dialog.controls.grand_total.value = formatCurrency(grandTotal);

        // Update summary card
        updateSummaryCard();
    };

    // Update summary card
    const updateSummaryCard = () => {
        const summaryEl = dialog.controls.summaryCard;
        if (!summaryEl) return;

        const { subtotal, vat, grandTotal } = calculateTotals();
        const itemCount = invoiceItems.length;

        summaryEl.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">Items:</span>
                <span class="fw-bold">${itemCount}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">Subtotal:</span>
                <span class="fw-bold">${formatCurrency(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">VAT (7%):</span>
                <span class="fw-bold">${formatCurrency(vat)}</span>
            </div>
            <hr class="my-2">
            <div class="d-flex justify-content-between align-items-center">
                <span class="fs-5 fw-bold text-primary">Total:</span>
                <span class="fs-4 fw-bold text-primary">${formatCurrency(grandTotal)}</span>
            </div>
        `;
    };

    // Add invoice item
    const addInvoiceItem = (item) => {
        invoiceItems.push(item);
        renderItemsTable();
        showToast('Item added successfully', 'success');
    };

    // Show toast notification
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast fade show bg-${type} text-white`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Load tenant information
    const loadTenantInfo = async (tenantId) => {
        if (!tenantId) return;

        try {
            const res = await vsapi.call([main_view.base_url, "/prm/tenant/info"].join(""),
                { id: tenantId }
            );

            if (res.status_code === 200 && res.data) {
                currentTenant = res.data;
                updateTenantDisplay();
                loadTenantContracts(tenantId);
                loadUnbilledServices(tenantId);
            }
        } catch (error) {
            console.error('Error loading tenant info:', error);
        }
    };

    // Update tenant display
    const updateTenantDisplay = () => {
        if (!currentTenant || !dialog) return;

        const tenantInfoEl = dialog.controls.tenantInfoCard;
        const contactEl = dialog.controls.tenantContactCard;

        if (tenantInfoEl) {
            tenantInfoEl.innerHTML = `
                <div class="d-flex align-items-center mb-3">
                    <div class="tenant-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center"
                         style="width: 50px; height: 50px; font-size: 20px; color: white;">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="ms-3">
                        <h5 class="mb-1">${currentTenant.company_name || currentTenant.legal_name}</h5>
                        <small class="text-muted">${currentTenant.business_type || 'Business'}</small>
                    </div>
                </div>

                <div class="tenant-details">
                    <div class="detail-item mb-2">
                        <i class="fas fa-id-card text-primary me-2"></i>
                        <span>Tax ID: <strong>${currentTenant.tax_id || 'N/A'}</strong></span>
                    </div>
                    <div class="detail-item mb-2">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                        <span>${currentTenant.address || 'Address not specified'}</span>
                    </div>
                    <div class="detail-item mb-2">
                        <i class="fas fa-file-contract text-primary me-2"></i>
                        <span>Contract: <strong>${currentTenant.contract_number || 'N/A'}</strong></span>
                    </div>
                </div>
            `;
        }

        if (contactEl) {
            contactEl.innerHTML = `
                <h6 class="mb-3"><i class="fas fa-user-circle me-2"></i>Contact Person</h6>
                <div class="contact-details">
                    <div class="detail-item mb-2">
                        <i class="fas fa-user text-primary me-2"></i>
                        <span><strong>${currentTenant.contact_person || 'N/A'}</strong></span>
                    </div>
                    <div class="detail-item mb-2">
                        <i class="fas fa-envelope text-primary me-2"></i>
                        <span>${currentTenant.email || 'N/A'}</span>
                    </div>
                    <div class="detail-item mb-2">
                        <i class="fas fa-phone text-primary me-2"></i>
                        <span>${currentTenant.phone || 'N/A'}</span>
                    </div>
                </div>
            `;
        }
    };

    // Load space information
    const loadSpaceInfo = async (spaceId) => {
        if (!spaceId) return;

        try {
            const res = await vsapi.call([main_view.base_url, "/prm/space/info"].join(""),
                { id: spaceId }
            );

            if (res.status_code === 200 && res.data) {
                currentSpace = res.data;
                updateSpaceDisplay();
            }
        } catch (error) {
            console.error('Error loading space info:', error);
        }
    };

    // Update space display
    const updateSpaceDisplay = () => {
        if (!currentSpace || !dialog) return;

        const spaceInfoEl = dialog.controls.spaceInfoCard;
        if (!spaceInfoEl) return;

        // Calculate area in different units
        const areaSqm = currentSpace.area_sqm || 0;
        const areaSqft = Math.round(areaSqm * 10.7639);

        spaceInfoEl.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <div class="space-icon bg-success rounded-circle d-flex align-items-center justify-content-center"
                     style="width: 50px; height: 50px; font-size: 20px; color: white;">
                    <i class="fas fa-home"></i>
                </div>
                <div class="ms-3">
                    <h5 class="mb-1">${currentSpace.space_code || 'Space'}</h5>
                    <small class="text-muted">${currentSpace.space_type || 'Commercial Space'}</small>
                </div>
            </div>

            <div class="space-details">
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <div class="info-box bg-light p-2 rounded">
                            <div class="text-muted small">Area</div>
                            <div class="fw-bold">${areaSqm} m²</div>
                            <div class="text-muted x-small">${areaSqft} ft²</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="info-box bg-light p-2 rounded">
                            <div class="text-muted small">Floor</div>
                            <div class="fw-bold">${currentSpace.floor_number || 'N/A'}</div>
                            <div class="text-muted x-small">${currentSpace.building_name || ''}</div>
                        </div>
                    </div>
                </div>

                <div class="amenities">
                    <h6 class="mb-2"><i class="fas fa-list me-2"></i>Amenities</h6>
                    <div class="amenity-tags">
                        ${(currentSpace.amenities || []).map(amenity =>
                            `<span class="badge bg-light text-dark me-1 mb-1">${amenity}</span>`
                        ).join('') || '<span class="text-muted small">No amenities listed</span>'}
                    </div>
                </div>
            </div>
        `;
    };

    // Load building information
    const loadBuildingInfo = async () => {
        try {
            const res = await vsapi.call([main_view.base_url, "/prm/building/info"].join(""));

            if (res.status_code === 200 && res.data) {
                const buildingInfoEl = dialog.controls.buildingInfoCard;
                if (buildingInfoEl && res.data) {
                    const building = res.data;

                    buildingInfoEl.innerHTML = `
                        <div class="d-flex align-items-center mb-3">
                            <div class="building-icon bg-warning rounded-circle d-flex align-items-center justify-content-center"
                                 style="width: 50px; height: 50px; font-size: 20px; color: white;">
                                <i class="fas fa-building"></i>
                            </div>
                            <div class="ms-3">
                                <h5 class="mb-1">${building.name || 'Building'}</h5>
                                <small class="text-muted">${building.type || 'Mixed-Use'}</small>
                            </div>
                        </div>

                        <div class="building-details">
                            <div class="detail-item mb-2">
                                <i class="fas fa-map-pin text-warning me-2"></i>
                                <span>${building.address || 'Address not specified'}</span>
                            </div>
                            <div class="detail-item mb-2">
                                <i class="fas fa-phone text-warning me-2"></i>
                                <span>${building.phone || 'N/A'}</span>
                            </div>
                            <div class="detail-item mb-2">
                                <i class="fas fa-tax text-warning me-2"></i>
                                <span>Tax ID: <strong>${building.tax_id || 'N/A'}</strong></span>
                            </div>
                        </div>

                        <div class="building-stats mt-3">
                            <div class="row g-2">
                                <div class="col-6">
                                    <div class="stat-box bg-light p-2 rounded text-center">
                                        <div class="text-muted x-small">Floors</div>
                                        <div class="fw-bold">${building.total_floors || 'N/A'}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="stat-box bg-light p-2 rounded text-center">
                                        <div class="text-muted x-small">Units</div>
                                        <div class="fw-bold">${building.total_units || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error loading building info:', error);
        }
    };

    // Main invoice dialog
    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-xxl", // Extra extra large for better layout
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                <div class="container-fluid p-0">
                    <!-- Header with Gradient -->
                    <div class="modal-header-custom bg-gradient-primary text-white p-4">
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <div>
                                <h4 class="mb-1"><i class="fas fa-file-invoice me-2"></i>Create New Invoice</h4>
                                <p class="mb-0 opacity-75">Generate professional invoices for tenants</p>
                            </div>
                            <div class="invoice-header-info text-end">
                                <div class="mb-1">
                                    <span class="badge bg-light text-primary">DRAFT</span>
                                </div>
                                <small class="opacity-75">Auto-save enabled</small>
                            </div>
                        </div>
                    </div>

                    <div class="modal-body p-4">
                        <div class="row g-4">
                            <!-- LEFT COLUMN: Information Panels -->
                            <div class="col-lg-4">
                                <!-- Quick Actions Card -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title mb-3"><i class="fas fa-bolt text-primary me-2"></i>Quick Actions</h5>
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-outline-primary" id="btnQuickRent">
                                                <i class="fas fa-home me-2"></i>Add Base Rent
                                            </button>
                                            <button class="btn btn-outline-success" id="btnQuickUtilities">
                                                <i class="fas fa-bolt me-2"></i>Add Utilities
                                            </button>
                                            <button class="btn btn-outline-info" id="btnQuickServices">
                                                <i class="fas fa-concierge-bell me-2"></i>Browse Services
                                            </button>
                                            <button class="btn btn-outline-warning" id="btnQuickManual">
                                                <i class="fas fa-plus-circle me-2"></i>Custom Item
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tenant Information Card -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="mb-0"><i class="fas fa-user-tie me-2"></i>Tenant Information</h5>
                                    </div>
                                    <div class="card-body" id="tenantInfoCard">
                                        <div class="text-center py-5">
                                            <i class="fas fa-user-circle fa-3x text-muted mb-3"></i>
                                            <p class="text-muted">Select a tenant to view details</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Contact Information Card -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-header bg-info text-white">
                                        <h5 class="mb-0"><i class="fas fa-address-card me-2"></i>Contact Details</h5>
                                    </div>
                                    <div class="card-body" id="tenantContactCard">
                                        <div class="text-center py-4">
                                            <i class="fas fa-envelope fa-2x text-muted mb-3"></i>
                                            <p class="text-muted small">Contact info will appear here</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CENTER COLUMN: Invoice Form -->
                            <div class="col-lg-8">
                                <!-- Invoice Header Section -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <select name="tenant_id" class="form-control"
                                                            id="tenantSelect" data-field="tenant_id">
                                                        <option value="">Select Tenant...</option>
                                                    </select>
                                                    <label for="tenantSelect"><i class="fas fa-user me-1"></i>Select Tenant</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <select name="space_id" class="form-control"
                                                            id="spaceSelect" data-field="space_id">
                                                        <option value="">Select Space...</option>
                                                    </select>
                                                    <label for="spaceSelect"><i class="fas fa-home me-1"></i>Select Space</label>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-floating">
                                                    <input type="text" name="invoice_number"
                                                           class="form-control" id="invoiceNumber"
                                                           data-field="invoice_number" readonly>
                                                    <label for="invoiceNumber"><i class="fas fa-hashtag me-1"></i>Invoice #</label>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-floating">
                                                    <input type="date" name="due_date"
                                                           class="form-control" id="dueDate"
                                                           data-field="due_date">
                                                    <label for="dueDate"><i class="fas fa-calendar-alt me-1"></i>Due Date</label>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-floating">
                                                    <select name="payment_terms" class="form-control"
                                                            id="paymentTerms" data-field="payment_terms">
                                                        <option value="7">Net 7 Days</option>
                                                        <option value="15">Net 15 Days</option>
                                                        <option value="30">Net 30 Days</option>
                                                    </select>
                                                    <label for="paymentTerms"><i class="fas fa-clock me-1"></i>Payment Terms</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Space Information Card -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0"><i class="fas fa-building me-2"></i>Space Details</h5>
                                        <small class="badge bg-light text-dark" id="spaceStatus">Not Selected</small>
                                    </div>
                                    <div class="card-body" id="spaceInfoCard">
                                        <div class="text-center py-4">
                                            <i class="fas fa-door-closed fa-3x text-muted mb-3"></i>
                                            <p class="text-muted">Select a space to view details</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Invoice Items Section -->
                                <div class="card border-0 shadow-sm mb-4">
                                    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0"><i class="fas fa-receipt me-2"></i>Invoice Items</h5>
                                        <div class="btn-group">
                                            <button class="btn btn-sm btn-light" id="btnAddCharge">
                                                <i class="fas fa-plus me-1"></i>Add Charge
                                            </button>
                                            <button class="btn btn-sm btn-light" id="btnImportServices">
                                                <i class="fas fa-download me-1"></i>Import Services
                                            </button>
                                        </div>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="table-responsive">
                                            <table class="table table-hover mb-0">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th width="40%">Description</th>
                                                        <th width="15%" class="text-center">Period</th>
                                                        <th width="10%" class="text-center">Qty</th>
                                                        <th width="15%" class="text-center">Rate</th>
                                                        <th width="15%" class="text-center">Amount</th>
                                                        <th width="5%" class="text-center"></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="invoice_items_tbody">
                                                    <tr class="no-items">
                                                        <td colspan="6" class="text-center py-5 text-muted">
                                                            <i class="fas fa-clipboard-list fa-2x mb-3"></i>
                                                            <p>No items added yet. Click 'Add Charge' to get started.</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes & Summary Section -->
                                <div class="row g-4">
                                    <div class="col-md-8">
                                        <div class="card border-0 shadow-sm h-100">
                                            <div class="card-body">
                                                <h5 class="card-title mb-3"><i class="fas fa-sticky-note me-2"></i>Notes & Instructions</h5>
                                                <div class="form-floating">
                                                    <textarea name="notes" class="form-control"
                                                              id="invoiceNotes" data-field="notes"
                                                              style="height: 150px;"
                                                              placeholder="Add payment instructions, terms, or notes..."></textarea>
                                                    <label for="invoiceNotes">Additional notes...</label>
                                                </div>
                                                <div class="mt-3">
                                                    <small class="text-muted">
                                                        <i class="fas fa-info-circle me-1"></i>
                                                        This will appear on the invoice sent to the tenant.
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card border-0 shadow-sm h-100 bg-light">
                                            <div class="card-body">
                                                <h5 class="card-title mb-3"><i class="fas fa-calculator me-2"></i>Invoice Summary</h5>
                                                <div id="summaryCard" class="mb-3">
                                                    <div class="text-center py-4 text-muted">
                                                        <i class="fas fa-calculator fa-2x mb-3"></i>
                                                        <p>Add items to see summary</p>
                                                    </div>
                                                </div>
                                                <div class="d-grid">
                                                    <button class="btn btn-primary" id="btnCalculate">
                                                        <i class="fas fa-redo me-1"></i>Recalculate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer with Action Buttons -->
                    <div class="modal-footer bg-light border-top">
                        <div class="d-flex justify-content-between w-100 align-items-center">
                            <div>
                                <span class="text-muted me-3">
                                    <i class="fas fa-save me-1"></i>Auto-saved: <span id="lastSaved">Just now</span>
                                </span>
                                <span class="text-muted">
                                    <i class="fas fa-clock me-1"></i>Time spent: <span id="timeSpent">00:00</span>
                                </span>
                            </div>
                            <div class="btn-group">
                                <button type="button" class="btn btn-outline-secondary" id="btnCancel">
                                    <i class="fas fa-times me-1"></i>Cancel
                                </button>
                                <button type="button" class="btn btn-outline-primary" id="btnSaveDraft">
                                    <i class="fas fa-save me-1"></i>Save Draft
                                </button>
                                <button type="button" class="btn btn-primary" id="btnSaveSend">
                                    <i class="fas fa-paper-plane me-1"></i>Save & Send
                                </button>
                                <button type="button" class="btn btn-success" id="btnPreview">
                                    <i class="fas fa-eye me-1"></i>Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Hidden fields -->
                <input type="hidden" name="invoice_items" data-field="invoice_items" />
                <input type="hidden" name="invoice_month" data-field="invoice_month" value="${currentPeriod.month}" />
                <input type="hidden" name="invoice_year" data-field="invoice_year" value="${currentPeriod.year}" />
                <input type="hidden" name="legal_name" data-field="legal_name" />
                <input type="hidden" name="business_type_id" data-field="business_type_id" />`;
            },

            contentCreated: (me) => {
                // Initialize with current date
                DateTimePicker.initAll(me.divModal);

                // Set default due date (today + 7 days)
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 7);
                me.controls.due_date.value = dueDate.toISOString().split('T')[0];

                // Generate invoice number
                me.controls.invoice_number.value = `INV-${currentPeriod.year}${String(currentPeriod.month).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

                // Add custom styles
                addCustomStyles();

                // Initialize event listeners
                initializeEventListeners(me);

                // Load building info
                loadBuildingInfo();

                // Initialize empty arrays
                invoiceItems = [];
                currentTenant = null;
                currentSpace = null;

                // Start timer
                startTimer();

                // Auto-save setup
                setupAutoSave(me);
            },

            configSelect: [
                {
                    name: "tenant_id",
                    data: "tenants",
                    textField: "display_name",
                    valueField: "id",
                    onChange: (me, value) => {
                        loadTenantInfo(value);
                        me.controls.space_id.innerHTML = '<option value="">Select Space...</option>';
                        if (value) {
                            loadTenantSpaces(me, value);
                        }
                    }
                },
                {
                    name: "space_id",
                    data: "spaces",
                    textField: "display_name",
                    valueField: "id",
                    params: (me) => ({
                        tenant_id: me.controls.tenant_id.value
                    }),
                    onChange: (me, value) => {
                        loadSpaceInfo(value);
                    }
                }
            ],

            onPrepareForm: (me, data) => {
                // Handle existing invoice data
                if (data.Invoice) {
                    const invoice = data.Invoice;

                    // Load existing items
                    if (invoice.invoice_items) {
                        try {
                            invoiceItems = JSON.parse(invoice.invoice_items);
                            renderItemsTable();
                        } catch (e) {
                            console.error('Error parsing invoice items:', e);
                        }
                    }

                    // Load tenant and space info if available
                    if (invoice.tenant_id) {
                        setTimeout(() => {
                            loadTenantInfo(invoice.tenant_id);
                            if (invoice.space_id) {
                                setTimeout(() => {
                                    loadSpaceInfo(invoice.space_id);
                                }, 500);
                            }
                        }, 100);
                    }
                }

                // Update UI based on data
                updateUIState(me);
            },

            buttons: [] // Using custom buttons in the footer
        });

        dialog.show(op);
    };

    // Add custom CSS styles
    const addCustomStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .modal-xxl {
                max-width: 1400px;
            }

            .bg-gradient-primary {
                background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            }

            .modal-header-custom {
                border-radius: 0;
                border: none;
            }

            .card {
                border-radius: 12px;
                transition: transform 0.2s ease;
            }

            .card:hover {
                transform: translateY(-2px);
            }

            .info-box {
                transition: all 0.3s ease;
            }

            .info-box:hover {
                background: #e9ecef !important;
            }

            .badge {
                border-radius: 20px;
                padding: 6px 12px;
            }

            .table-hover tbody tr:hover {
                background-color: rgba(67, 97, 238, 0.05);
            }

            .btn {
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .btn-primary {
                background: ${colors.primary};
                border-color: ${colors.primary};
            }

            .btn-primary:hover {
                background: ${colors.secondary};
                border-color: ${colors.secondary};
            }

            .form-control, .form-select {
                border-radius: 8px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
            }

            .form-control:focus, .form-select:focus {
                border-color: ${colors.primary};
                box-shadow: 0 0 0 0.2rem rgba(67, 97, 238, 0.25);
            }

            .detail-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 10px;
            }

            .amenity-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }

            .stat-box {
                transition: all 0.3s ease;
            }

            .stat-box:hover {
                transform: scale(1.05);
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .tenant-avatar, .space-icon, .building-icon {
                transition: all 0.3s ease;
            }

            .tenant-avatar:hover, .space-icon:hover, .building-icon:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .no-items {
                opacity: 0.6;
            }

            .no-items i {
                opacity: 0.4;
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize event listeners
    const initializeEventListeners = (me) => {
        // Quick action buttons
        me.controls.btnQuickRent.onclick = () => addBaseCharges(me);
        me.controls.btnQuickUtilities.onclick = () => showUtilityDialog(me);
        me.controls.btnQuickServices.onclick = () => showServiceSelection(me.controls.tenant_id.value, me.controls.space_id.value);
        me.controls.btnQuickManual.onclick = () => showManualItemDialog(me);

        // Invoice action buttons
        me.controls.btnAddCharge.onclick = () => showChargeSelectionDialog(me);
        me.controls.btnImportServices.onclick = () => importServices(me);
        me.controls.btnCalculate.onclick = () => renderItemsTable();

        // Footer buttons
        me.controls.btnCancel.onclick = () => me.hide(false);
        me.controls.btnSaveDraft.onclick = () => saveInvoice(me, false);
        me.controls.btnSaveSend.onclick = () => saveInvoice(me, true);
        me.controls.btnPreview.onclick = () => previewInvoice(me);

        // Remove item buttons (delegated)
        me.controls.invoice_items_tbody.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-item')) {
                const index = e.target.closest('.btn-remove-item').dataset.index;
                removeInvoiceItem(index);
            }
        });

        // Real-time validation
        ['tenant_id', 'space_id'].forEach(field => {
            if (me.controls[field]) {
                me.controls[field].addEventListener('change', () => {
                    updateUIState(me);
                });
            }
        });
    };

    // Update UI state based on selections
    const updateUIState = (me) => {
        const hasTenant = !!me.controls.tenant_id.value;
        const hasSpace = !!me.controls.space_id.value;

        // Enable/disable buttons based on selections
        const buttons = ['btnAddCharge', 'btnImportServices', 'btnQuickRent', 'btnQuickUtilities', 'btnQuickServices'];
        buttons.forEach(btnId => {
            if (me.controls[btnId]) {
                me.controls[btnId].disabled = !hasTenant || !hasSpace;
            }
        });

        // Update space status badge
        if (me.controls.spaceStatus) {
            if (hasSpace && currentSpace) {
                me.controls.spaceStatus.textContent = currentSpace.space_code;
                me.controls.spaceStatus.className = 'badge bg-success';
            } else if (hasTenant) {
                me.controls.spaceStatus.textContent = 'Select Space';
                me.controls.spaceStatus.className = 'badge bg-warning';
            } else {
                me.controls.spaceStatus.textContent = 'Not Selected';
                me.controls.spaceStatus.className = 'badge bg-light text-dark';
            }
        }
    };

    // Timer for tracking time spent
    let startTime = new Date();
    const startTimer = () => {
        const timeSpentEl = dialog?.controls.timeSpent;
        if (!timeSpentEl) return;

        setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now - startTime) / 1000);
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            timeSpentEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    };

    // Auto-save functionality
    const setupAutoSave = (me) => {
        let lastSave = new Date();
        const lastSavedEl = dialog?.controls.lastSaved;

        // Save every 30 seconds if there are changes
        setInterval(() => {
            if (invoiceItems.length > 0 || me.controls.tenant_id.value) {
                autoSaveDraft(me);
                lastSave = new Date();
                if (lastSavedEl) {
                    const now = new Date();
                    const diff = Math.floor((now - lastSave) / 1000);
                    if (diff < 60) {
                        lastSavedEl.textContent = 'Just now';
                    } else if (diff < 3600) {
                        lastSavedEl.textContent = `${Math.floor(diff / 60)} minutes ago`;
                    }
                }
            }
        }, 30000);
    };

    // Auto-save draft
    const autoSaveDraft = (me) => {
        const invoiceData = prepareInvoiceData(me);
        invoiceData.status = 'auto_saved';

        // Save to local storage or send to backend
        localStorage.setItem(`invoice_draft_${invoiceData.invoice_number}`, JSON.stringify(invoiceData));
    };

    // Remove invoice item
    const removeInvoiceItem = (index) => {
        if (confirm('Are you sure you want to remove this item?')) {
            invoiceItems.splice(index, 1);
            renderItemsTable();
            showToast('Item removed', 'warning');
        }
    };

    // Show utility dialog
    const showUtilityDialog = (me) => {
        // Implementation for utility dialog
        showToast('Utility dialog will be implemented', 'info');
    };

    // Show charge selection dialog
    const showChargeSelectionDialog = (me) => {
        // Implementation for charge selection
        showToast('Charge selection dialog will be implemented', 'info');
    };

    // Import services
    const importServices = (me) => {
        // Implementation for importing services
        showToast('Service import feature will be implemented', 'info');
    };

    // Load tenant spaces
    const loadTenantSpaces = (me, tenantId) => {
        // Implementation for loading tenant spaces
    };

    // Load tenant contracts
    const loadTenantContracts = (tenantId) => {
        // Implementation for loading tenant contracts
    };

    // Load unbilled services
    const loadUnbilledServices = (tenantId) => {
        // Implementation for loading unbilled services
    };

    return self;
})();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .modal-xxl .modal-content {
        animation: fadeIn 0.3s ease-out;
    }

    .card {
        animation: fadeIn 0.5s ease-out;
    }

    .table tbody tr {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);



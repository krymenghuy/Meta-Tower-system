"use strict";

var ServiceRequestComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Service Request Component";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");

    const $ = sel => mThis.self.querySelector(sel);
    Object.assign(mThis, {
        elSearch: $("#_search_service_request"),
        elStatus: $("#_service_request_status"),
        elService_type: $("#_service_request_type_id"),
        elBtnCreate: $("#_btnServiceRequest"),
        divFilter: $("#_divFilter_service_request"),
    });

    mThis.columns = [
    { title: "", className: "align-middle text-capitalize" },
    {
            title: "Request Num",
            className: "align-middle text-start",
            data: (data) => `<span class="text-yp-custom">${data.code || 'N/A'}</span>`,
    },
    {
        title: "Tenant",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.tenant_name ?? ''}</span>`
    },
    {
        title: "Room Code",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom user-select-none">${data.space_code ?? ''}</span>`
    },
    {
        title: "Service",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.service_name ?? ''}</span>`
    },
    {
        title: "Price",
        className: "align-middle",
        data: (data) => {
            const cur = data.cur_symbol ?? '$';
            let mainPrice = data.total_price ?? data.service_price;
            let displayPrice = mainPrice
                ? Number(mainPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—';

            let extraInfo = '';

            if (data.unit_type === 'hour' && data.duration_hours > 0 && data.service_price) {
                const base = Number(data.service_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                extraInfo = `<small class="text-muted d-block">$${base} × ${data.duration_hours}h</small>`;
            } else if (data.unit_type) {
                extraInfo = `<small class="text-muted d-block">/ ${data.unit_type}</small>`;
            }

            return `
                <span class="fw-bold fs-6">${cur} ${displayPrice}</span>
                ${extraInfo}
            `;
        }
    },
    {
    title: "Description",
    className: "align-middle",
    data: (data) => `<span class="text-primary-custom">${data.description ?? ''}</span>`
    },

    {
        title: "Status",
        className: "align-middle",
        data: (data) => {
            const rawStatus = data.status_name || data.request_status_name || '';
            const status_name = rawStatus.toLowerCase().trim();

            const baseCls = 'text-white px-3 py-1 rounded-3 d-inline-block';

            const statusMap = {
                'pending':      'bg-warning',
                'in progress':  'bg-warning text-dark',
                'approved':     'bg-success',
                'cancelled':    'bg-danger',
                'completed':    'bg-primary',
            };

            const cls = `${baseCls} ${statusMap[status_name] || 'bg-secondary'}`;

            return `
                <span class="${cls}" data-status-id="${data.request_status_id}">
                    <small>${rawStatus}</small>
                </span>`;
        },
    },
    {
        title: "Updated By",
        className: 'align-middle',
        data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom fw-semibold">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
    },
    {
        title: "Action",
        className: 'col_action align-middle',
        data: (data) => `
            <div class="d-flex justify-content-center align-items-end">
                <a href="javascript:void(0)"
                    class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'} bg-second pointer p-4"
                    data-id="${data.id}"
                    data-status-id="${data.request_status_id}"
                    aria-haspopup="true" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis-vertical fs-5 text-prm-custom"></i>
                </a>
            </div>`
    }
];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ServiceRequestListView = new ListView('_service_request_list', {
            fetchApi: `${main_view.base_url}/prm/service-request/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.columns,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusId = data.request_status_id;
                tr.classList.add('service-request');
                tr.setAttribute('id', `service_request_id_${data.id}`);
            }
        });

        mThis.elBtnCreate.onclick = (e) => {
            e.preventDefault();
            CreateServiceRequestDialog.show({
                id: null,
                btn: e.target,
                onClose: () => mThis.ServiceRequestListView.showPage(mThis.getFilterData())
            });
        };

        const sh_parent = mThis.ServiceRequestListView.getListContainer().parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto", "overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        };

        mThis.initDropdownMenus(mThis.ServiceRequestListView.getTable());

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => ({
        request_status_id: mThis.elStatus.value,
        service_type_id: mThis.elService_type.value,
        search_value: mThis.elSearch.value,
    });

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2">Generate Invoice</span>',
                    icon: `<i class="fa-solid fa-dollar-sign text-success"></i>`,
                    name: "generate_invoice",
                    cssClass: "border-bottom pb-2 mb-2"
                },
                {
                    html: '<span class="ps-2">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,
                    name: "change_status",
                    cssClass: "border-bottom pb-2"
                },
                {
                    html: '<span class="ps-2">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    name: "edit_request",
                    cssClass: "border-bottom pb-2" },
                {
                    html: '<span class="ps-2">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    name: "delete_request",
                    cssClass: "border-bottom pb-2" }
            ],
            onClick: (menuLink, id, name) => {
                if (name === 'generate_invoice')mThis.generateInvoice(id, menuLink);
                if (name === 'change_status') mThis.changeStatus(id, menuLink);
                if (name === 'edit_request') mThis.editServiceRequest(id, menuLink);
                if (name === 'delete_request') mThis.deleteRequest(id, menuLink);
            }
        });
    };

    mThis.generateInvoice = (id, menuLink) => {
        CreateInvoiceServiceRequestDialog.show({
            id: id,
            btn: menuLink,
            onClose: () => mThis.ServiceRequestListView.showPage(mThis.getFilterData())
        });
    };

    mThis.editServiceRequest = (id, menuLink) => {
        CreateServiceRequestDialog.show({
            id: id,
            btn: menuLink,
            onClose: () => mThis.ServiceRequestListView.showPage(mThis.getFilterData())
        });
    };

    mThis.deleteRequest = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Service Request?', {
            title: 'Delete Service Request',
            confirmButtonText: "Delete"
        }, (confirmed) => {
            if (confirmed) {
                vsapi.call(`${main_view.base_url}/prm/service-request/delete`, { id }, false, false, false)
                    .then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('Service request deleted');
                            mThis.ServiceRequestListView.showPage();
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        });
    };

    mThis.changeStatus = (id, link) => {
        const tr = link.closest('tr');
        const currentStatusId = tr?.dataset.statusId || "1";

        const options = {
            title: 'Change Status',
            cssClass: '',
            backdropClose: true,
            type: 'select',
            label: 'Status',
            valueField: 'status_id',
            textField: 'name',
            confirmButtonText: "Submit",
            requiredMessage: 'Select one valid status',
            context: 'success',
            data: [
                { status_id: "1", name: "Pending"    },
                { status_id: "2", name: "Approved"   },
                { status_id: "3", name: "Cancelled"  },
                { status_id: "4", name: "Completed"  },
            ],
            defaultValue: currentStatusId,
            onConfirm: (value, btn, me) => {
                const payload = { id, status_id: value };
                vsapi.post(`${mThis.base_url}/prm/service-request/update-status`, payload, { loader: false })
                    .then(res => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success('Service Request Status has been updated');
                            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                        } else {
                            me.setError(res.error_message || 'Unable to update status');
                        }
                    });
            }
        };
        InputBox.show(options);
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });
    };

    mThis.prepareFormOptions = (callback) => {
        vsapi.call(`${main_view.base_url}/prm/service-request/form-options`)
            .then(res => {
                if (res.status_code === 200) {
                    VSUtil.setComboItems(mThis.elStatus, res.data.request_statuses, 'id', 'name', true, 'All Statuses');
                    VSUtil.setComboItems(mThis.elService_type, res.data.service_types, 'id', 'service_type', true, 'All Service Types');
                }
                if (typeof callback === 'function') callback();
            });
    };

    return mThis;
})();


// const CreateInvoiceServiceRequestDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog = new GeneralDialog({
//             cssClass: "modal-lg",
//             backdrop: "static",
//             keyboard: true,

//             createContent: () => `
//                 <div class="row g-3">
//                     <div class="col-12">
//                         <div class="card bg-light">
//                             <div class="card-body">
//                                 <h6 class="card-title text-muted mb-3">Service Request Details</h6>
//                                 <div class="row g-2">
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Tenant:</small>
//                                         <div class="fw-semibold" id="info-tenant">Loading...</div>
//                                     </div>
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Room Code:</small>
//                                         <div class="fw-semibold" id="info-space">Loading...</div>
//                                     </div>
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Service:</small>
//                                         <div class="fw-semibold" id="info-service">Loading...</div>
//                                     </div>
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Phone:</small>
//                                         <div class="fw-semibold" id="info-phone">Loading...</div>
//                                     </div>
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Base Price:</small>
//                                         <div class="fw-semibold text-primary" id="info-price">Loading...</div>
//                                     </div>
//                                     <div class="col-md-6">
//                                         <small class="text-muted">Email:</small>
//                                         <div class="fw-semibold" id="info-email">Loading...</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Invoice Details -->
//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Invoice Number</label>
//                         <div class="material-input outlined">
//                             <input type="text" class="data-input form-control" data-field="invoice_number"
//                                 placeholder="Auto-generated if empty" />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Invoice Date <span class="text-danger">*</span></label>
//                         <div class="material-input outlined">
//                             <input type="date" class="data-input form-control" data-field="invoice_date" required />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Due Date <span class="text-danger">*</span></label>
//                         <div class="material-input outlined">
//                             <input type="date" class="data-input form-control" data-field="due_date" required />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Payment Status</label>
//                         <select class="data-input form-control" data-field="payment_status">
//                             <option value="unpaid">Unpaid</option>
//                             <option value="pending">Pending</option>
//                             <option value="paid">Paid</option>
//                             <option value="overdue">Overdue</option>
//                         </select>
//                     </div>

//                     <!-- Pricing Section -->
//                     <div class="col-12">
//                         <hr class="my-2">
//                         <h6 class="text-muted">Pricing Details</h6>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Quantity / Hours</label>
//                         <div class="material-input outlined">
//                             <input type="number" step="0.5" min="0.5" class="data-input form-control"
//                                 data-field="quantity" value="1" />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Unit Price</label>
//                         <div class="material-input outlined">
//                             <input type="number" step="0.01" min="0" class="data-input form-control"
//                                 data-field="unit_price" readonly />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Discount (%)</label>
//                         <div class="material-input outlined">
//                             <input type="number" step="0.01" min="0" max="100" class="data-input form-control"
//                                 data-field="discount_percent" value="0" />
//                         </div>
//                     </div>

//                     <div class="col-md-6">
//                         <label style="padding-left:6px; color:#777;">Tax (%)</label>
//                         <div class="material-input outlined">
//                             <input type="number" step="0.01" min="0" class="data-input form-control"
//                                 data-field="tax_percent" value="0" />
//                         </div>
//                     </div>

//                     <!-- Total Calculation -->
//                     <div class="col-12">
//                         <div class="card bg-light">
//                             <div class="card-body">
//                                 <div class="row g-2">
//                                     <div class="col-6 text-muted">Subtotal:</div>
//                                     <div class="col-6 text-end fw-semibold" id="calc-subtotal">$0.00</div>

//                                     <div class="col-6 text-muted">Discount:</div>
//                                     <div class="col-6 text-end text-danger" id="calc-discount">-$0.00</div>

//                                     <div class="col-6 text-muted">Tax:</div>
//                                     <div class="col-6 text-end" id="calc-tax">$0.00</div>

//                                     <div class="col-12"><hr class="my-1"></div>

//                                     <div class="col-6 fw-bold fs-5">Total:</div>
//                                     <div class="col-6 text-end fw-bold fs-5 text-primary" id="calc-total">$0.00</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="col-12">
//                         <label style="padding-left:6px; color:#777;">Notes / Remarks</label>
//                         <div class="material-input outlined">
//                             <textarea class="data-input form-control" data-field="notes" rows="3"
//                                 placeholder="Additional information..."></textarea>
//                         </div>
//                     </div>

//                     <input type="hidden" data-field="service_request_id" />
//                     <input type="hidden" data-field="total_amount" />
//                     <input type="hidden" data-field="tenant_id" />
//                     <input type="hidden" data-field="space_id" />
//                     <input type="hidden" data-field="service_id" />
//                     <input type="hidden" data-field="service_type_id" />
//                 </div>
//             `,

//             contentCreated: (me) => {

//                 // Header customization
//                 const header = me.divModal.querySelector('.modal-header');
//                 header.querySelector('button')?.classList.add('d-none');
//                 header.classList.add('bg-prm-custom', 'modal-header-custom');
//                 header.parentElement.style.borderRadius = '20px';

//                 const title = header.querySelector('.modal-title');
//                 title.classList.add('text-white', 'text-center', 'w-100');
//                 title.textContent = 'Generate Invoice';

//                 const today = new Date().toISOString().split('T')[0];
//                 me.controls.invoice_date.value = today;
//                 const dueDate = new Date();
//                 dueDate.setDate(dueDate.getDate() + 30);
//                 me.controls.due_date.value = dueDate.toISOString().split('T')[0];

//                 const calculateTotals = () => {
//                     const quantity = parseFloat(me.controls.quantity.value) || 0;
//                     const unitPrice = parseFloat(me.controls.unit_price.value) || 0;
//                     const discountPercent = parseFloat(me.controls.discount_percent.value) || 0;
//                     const taxPercent = parseFloat(me.controls.tax_percent.value) || 0;

//                     const subtotal = quantity * unitPrice;
//                     const discountAmount = subtotal * (discountPercent / 100);
//                     const afterDiscount = subtotal - discountAmount;
//                     const taxAmount = afterDiscount * (taxPercent / 100);
//                     const total = afterDiscount + taxAmount;

//                     me.divModal.querySelector('#calc-subtotal').textContent = `$${subtotal.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-discount').textContent = `-$${discountAmount.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-tax').textContent = `$${taxAmount.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-total').textContent = `$${total.toFixed(2)}`;

//                     me.controls.total_amount.value = total.toFixed(2);
//                 };

//                 ['quantity', 'unit_price', 'discount_percent', 'tax_percent'].forEach(field => {
//                     me.controls[field]?.addEventListener('input', calculateTotals);
//                 });
//                 const requestId = op.id;

//                 console.log('=== LOADING INVOICE FOR ID:', requestId, '===');

//                 if (requestId) {
//                     me.controls.service_request_id.value = requestId;

//                     vsapi.call(`${main_view.base_url}/prm/service-request/form-options`, { id: requestId })
//                         .then(res => {
//                             console.log('API Response for ID', requestId, ':', res);

//                             if (res.status_code === 200 && res.data && res.data.request_details) {
//                                 const data = res.data.request_details;

//                                 console.log('Request Details for ID', requestId, ':', data);

//                                 if (data.id != requestId) {
//                                     console.error('ID MISMATCH! Expected:', requestId, 'Got:', data.id);
//                                     cv_interact.error('Data mismatch error');
//                                     return;
//                                 }
//                                 me.controls.tenant_id.value = data.tenant_id || '';
//                                 me.controls.space_id.value = data.space_id || '';
//                                 me.controls.service_id.value = data.service_id || '';
//                                 me.controls.service_type_id.value = data.service_type_id || '';

//                                 const tenant = res.data.tenants?.find(t => t.id == data.tenant_id);
//                                 const space = res.data.building_spaces?.find(s => s.id == data.space_id);
//                                 const service = res.data.services?.find(s => s.id == data.service_id);
//                                 const serviceType = res.data.service_types?.find(st => st.id == data.service_type_id);

//                                 me.divModal.querySelector('#info-tenant').textContent = tenant?.tenant || '-';
//                                 me.divModal.querySelector('#info-space').textContent = space?.floor_id || '-';
//                                 me.divModal.querySelector('#info-service').textContent = service?.service || '-';
//                                 me.divModal.querySelector('#info-email').textContent = tenant?.tenant_email  || '-';
//                                 me.divModal.querySelector('#info-phone').textContent = tenant?.tenant_phone  || '-';
//                                 const price = data.total_price || data.service_price || 0;
//                                 me.divModal.querySelector('#info-price').textContent = `$${Number(price).toFixed(2)}`;
//                                 me.controls.unit_price.value = price;

//                                 if (data.duration_hours && data.duration_hours > 0) {
//                                     me.controls.quantity.value = data.duration_hours;
//                                 } else {
//                                     me.controls.quantity.value = 1;
//                                 }

//                                 calculateTotals();
//                             } else {
//                                 cv_interact.error('Unable to load service request details');
//                                 console.error('Invalid response:', res);
//                             }
//                         })
//                         .catch(err => {
//                             cv_interact.error('Failed to fetch service request details');
//                             console.error('Fetch error:', err);
//                         });
//                 } else {
//                     console.error('No ID provided to CreateInvoiceServiceRequestDialog!');
//                     cv_interact.error('No service request ID provided');
//                 }

//                 me.onBeforeSubmit = () => {
//                     const invoiceDate = new Date(me.controls.invoice_date.value);
//                     const dueDate = new Date(me.controls.due_date.value);

//                     if (dueDate < invoiceDate) {
//                         cv_interact.error('Due date cannot be earlier than invoice date');
//                         return false;
//                     }
//                     return true;
//                 };
//             },

//             buttons: [
//                 {
//                     label: '<span>Cancel</span>',
//                     cssClass: 'btn-vs-cancel',
//                     click: (me) => me.hide(false)
//                 },
//                 {
//                     label: '<span>Generate Invoice</span>',
//                     cssClass: 'btn-vs-save',
//                     click: (me, btn) => {
//                         const data = me.getData();

//                         console.log('Invoice Data to Submit:', data);

//                         vsapi.call(
//                             `${main_view.base_url}/prm/invoice/save`,
//                             data,
//                             btn
//                         ).then(res => {
//                             if (res.status_code === 200) {
//                                 me.hide(true);
//                                 cv_interact.success('Invoice generated successfully');
//                                 if (me.dataOptions?.onClose) {
//                                     me.dataOptions.onClose();
//                                 }
//                             } else {
//                                 cv_interact.error(res.error_message || 'Failed to generate invoice');
//                             }
//                         });
//                     }
//                 }
//             ]
//         });

//         dialog.show(op);
//     };

//     return self;
// })();



// const CreateInvoiceServiceRequestDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog = new GeneralDialog({
//             cssClass: "modal-lg invoice-modal-custom",
//             backdrop: "static",
//             keyboard: true,

//             createContent: () => `
        
//                 <div class="invoice-dialog-container">
//                     <!-- Service Request Info Card -->
//                     <div class="sr-info-card">
//                         <div class="row g-3">
//                             <div class="col-md-6">
//                                 <div class="sr-info-title">Tenant</div>
//                                 <div class="sr-info-value" id="info-tenant">—</div>
//                             </div>
//                             <div class="col-md-6">
//                                 <div class="sr-info-title">Room / Space</div>
//                                 <div class="sr-info-value" id="info-space">—</div>
//                             </div>
//                             <div class="col-md-6">
//                                 <div class="sr-info-title">Service</div>
//                                 <div class="sr-info-value" id="info-service">—</div>
//                             </div>
//                             <div class="col-md-6">
//                                 <div class="sr-info-title">Service</div>
//                                 <div class="sr-info-value" id="info-price">—</div>
//                             </div>
//                         </div>
//                     </div>

//                     <!-- Invoice Details Form -->
//                     <form id="invoiceForm">
//                         <div class="row g-3">
//                             <!-- Invoice Number -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">Invoice Number</label>
//                                     <input
//                                         type="text"
//                                         class="form-control-invoice"
//                                         id="invoice_number"
//                                         placeholder="Auto-generated (e.g. SR-0423-INV-01)"
//                                     />
//                                     <small class="form-text-muted">Will be auto-created from service request code if left empty</small>
//                                 </div>
//                             </div>

//                             <!-- Invoice Date -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">
//                                         Invoice Date <span class="text-danger">*</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         class="form-control-invoice"
//                                         id="invoice_date"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <!-- Due Date -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">
//                                         Due Date <span class="text-danger">*</span>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         class="form-control-invoice"
//                                         id="due_date"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <!-- Pricing Details Section -->
//                         <hr class="section-divider">
//                         <div class="section-title">Pricing Details</div>

//                         <div class="row g-3">
//                             <!-- Billable Hours -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">Billable Hours</label>
//                                     <input
//                                         type="number"
//                                         class="form-control-invoice"
//                                         id="quantity"
//                                         step="0.5"
//                                         min="0.5"
//                                         value="1"
//                                     />
//                                     <small class="form-text-muted" id="qty-hint">Number of units or hours</small>
//                                 </div>
//                             </div>

//                             <!-- Unit Price -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">Unit Price</label>
//                                     <input
//                                         type="number"
//                                         class="form-control-invoice"
//                                         id="unit_price"
//                                         step="0.01"
//                                         readonly
//                                     />
//                                 </div>
//                             </div>

//                             <!-- Discount -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">Discount (%)</label>
//                                     <input
//                                         type="number"
//                                         class="form-control-invoice"
//                                         id="discount_percent"
//                                         step="0.01"
//                                         min="0"
//                                         max="100"
//                                         value="0"
//                                     />
//                                 </div>
//                             </div>

//                             <!-- Tax -->
//                             <div class="col-md-6">
//                                 <div class="form-group-custom">
//                                     <label class="form-label-custom">Tax (%)</label>
//                                     <input
//                                         type="number"
//                                         class="form-control-invoice"
//                                         id="tax_percent"
//                                         step="0.01"
//                                         min="0"
//                                         value="0"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <!-- Totals Card -->
//                         <div class="totals-card-invoice">
//                             <div class="totals-row-invoice">
//                                 <span class="totals-label-invoice">Subtotal:</span>
//                                 <span class="totals-value-invoice" id="calc-subtotal">$85.00</span>
//                             </div>
//                             <div class="totals-row-invoice">
//                                 <span class="totals-label-invoice">Discount:</span>
//                                 <span class="totals-value-invoice discount" id="calc-discount">$0.00</span>
//                             </div>
//                             <div class="totals-row-invoice">
//                                 <span class="totals-label-invoice">Tax:</span>
//                                 <span class="totals-value-invoice" id="calc-tax">$0.00</span>
//                             </div>
//                             <div class="totals-row-invoice total-row">
//                                 <span class="totals-label-invoice">Total:</span>
//                                 <span class="totals-value-invoice" id="calc-total">$85.00</span>
//                             </div>
//                         </div>

//                         <!-- Notes -->
//                         <div class="form-group-custom" style="margin-top: 20px;">
//                             <label class="form-label-custom">Notes / Remarks</label>
//                             <textarea
//                                 class="form-control-invoice"
//                                 id="notes"
//                                 rows="4"
//                                 placeholder="Payment terms, special instructions, thank you message, bank details, etc..."
//                             ></textarea>
//                         </div>

//                         <!-- Hidden Fields -->
//                         <input type="hidden" id="service_request_id" />
//                         <input type="hidden" id="tenant_id" />
//                         <input type="hidden" id="space_id" />
//                         <input type="hidden" id="service_id" />
//                         <input type="hidden" id="total_amount" />
//                     </form>
//                 </div>
//             `,

//             contentCreated: (me) => {
//                 // Update modal header
//                 const header = me.divModal.querySelector('.modal-header');
//                 const closeBtn = header.querySelector('button.btn-close');
//                 if (closeBtn) closeBtn.style.display = 'none';

//                 const title = header.querySelector('.modal-title');
//                 if (title) title.textContent = 'Create Invoice from Service Request';

//                 // Store control references
//                 me.controls = {
//                     invoice_number: me.divModal.querySelector('#invoice_number'),
//                     invoice_date: me.divModal.querySelector('#invoice_date'),
//                     due_date: me.divModal.querySelector('#due_date'),
//                     quantity: me.divModal.querySelector('#quantity'),
//                     unit_price: me.divModal.querySelector('#unit_price'),
//                     discount_percent: me.divModal.querySelector('#discount_percent'),
//                     tax_percent: me.divModal.querySelector('#tax_percent'),
//                     notes: me.divModal.querySelector('#notes'),
//                     service_request_id: me.divModal.querySelector('#service_request_id'),
//                     tenant_id: me.divModal.querySelector('#tenant_id'),
//                     space_id: me.divModal.querySelector('#space_id'),
//                     service_id: me.divModal.querySelector('#service_id'),
//                     total_amount: me.divModal.querySelector('#total_amount')
//                 };

//                 // Set default dates
//                 const today = new Date().toISOString().split('T')[0];
//                 me.controls.invoice_date.value = today;

//                 const dueDate = new Date();
//                 dueDate.setDate(dueDate.getDate() + 30);
//                 me.controls.due_date.value = dueDate.toISOString().split('T')[0];

//                 // Calculation function
//                 const calculateTotals = () => {
//                     const quantity = parseFloat(me.controls.quantity.value) || 0;
//                     const unitPrice = parseFloat(me.controls.unit_price.value) || 0;
//                     const discountPercent = parseFloat(me.controls.discount_percent.value) || 0;
//                     const taxPercent = parseFloat(me.controls.tax_percent.value) || 0;

//                     const subtotal = quantity * unitPrice;
//                     const discountAmount = subtotal * (discountPercent / 100);
//                     const afterDiscount = subtotal - discountAmount;
//                     const taxAmount = afterDiscount * (taxPercent / 100);
//                     const total = afterDiscount + taxAmount;

//                     me.divModal.querySelector('#calc-subtotal').textContent = `$${subtotal.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-discount').textContent = `$${discountAmount.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-tax').textContent = `$${taxAmount.toFixed(2)}`;
//                     me.divModal.querySelector('#calc-total').textContent = `$${total.toFixed(2)}`;

//                     me.controls.total_amount.value = total.toFixed(2);
//                 };

//                 // Attach calculation listeners
//                 ['quantity', 'unit_price', 'discount_percent', 'tax_percent'].forEach(field => {
//                     me.controls[field]?.addEventListener('input', calculateTotals);
//                 });

//                 // Load service request data
//                 const requestId = op.id;
//                 if (requestId) {
//                     me.controls.service_request_id.value = requestId;

//                     vsapi.call(`${main_view.base_url}/prm/service-request/form-options`, { id: requestId })
//                         .then(res => {
//                             if (res.status_code === 200 && res.data && res.data.request_details) {
//                                 const data = res.data.request_details;

//                                 // Populate hidden fields
//                                 me.controls.tenant_id.value = data.tenant_id || '';
//                                 me.controls.space_id.value = data.space_id || '';
//                                 me.controls.service_id.value = data.service_id || '';

//                                 // Find related data
//                                 const tenant = res.data.tenants?.find(t => t.id == data.tenant_id);
//                                 const space = res.data.building_spaces?.find(s => s.id == data.space_id);
//                                 const service = res.data.services?.find(s => s.id == data.service_id);

//                                 // Update display fields
//                                 me.divModal.querySelector('#info-tenant').textContent = tenant?.tenant || '-';
//                                 me.divModal.querySelector('#info-space').textContent = space?.space_code || '-';
//                                 me.divModal.querySelector('#info-service').textContent = service?.service || '-';

//                                 // Set pricing
//                                 const price = data.total_price || data.service_price || 0;
//                                 me.divModal.querySelector('#info-price').textContent = `$${Number(price).toFixed(2)} / hour`;
//                                 me.controls.unit_price.value = price;

//                                 // Set quantity
//                                 if (data.duration_hours && data.duration_hours > 0) {
//                                     me.controls.quantity.value = data.duration_hours;
//                                     me.divModal.querySelector('#qty-hint').textContent =
//                                         `(based on ${data.duration_hours} hour${data.duration_hours !== 1 ? 's' : ''})`;
//                                 } else {
//                                     me.controls.quantity.value = 1;
//                                 }

//                                 calculateTotals();
//                             } else {
//                                 cv_interact.error('Unable to load service request details');
//                             }
//                         })
//                         .catch(err => {
//                             cv_interact.error('Failed to fetch service request details');
//                             console.error('Fetch error:', err);
//                         });
//                 } else {
//                     cv_interact.error('No service request ID provided');
//                 }

//                 // Validation
//                 me.onBeforeSubmit = () => {
//                     const invoiceDate = new Date(me.controls.invoice_date.value);
//                     const dueDate = new Date(me.controls.due_date.value);

//                     if (dueDate < invoiceDate) {
//                         cv_interact.error('Due date cannot be earlier than invoice date');
//                         return false;
//                     }
//                     return true;
//                 };
//             },

//             buttons: [
//                 {
//                     label: 'Cancel',
//                     cssClass: 'btn-invoice btn-cancel-invoice',
//                     click: (me) => me.hide(false)
//                 },
//                 {
//                     label: 'Preview PDF',
//                     cssClass: 'btn-invoice btn-preview-invoice',
//                     click: (me) => {
//                         cv_interact.info('Preview PDF feature - to be implemented');
//                     }
//                 },
//                 {
//                     label: 'Create Invoice',
//                     cssClass: 'btn-invoice btn-create-invoice',
//                     click: (me, btn) => {
//                         if (!me.onBeforeSubmit()) return;

//                         const data = {
//                             service_request_id: me.controls.service_request_id.value,
//                             tenant_id: me.controls.tenant_id.value,
//                             space_id: me.controls.space_id.value,
//                             service_id: me.controls.service_id.value,
//                             invoice_number: me.controls.invoice_number.value,
//                             invoice_date: me.controls.invoice_date.value,
//                             due_date: me.controls.due_date.value,
//                             quantity: me.controls.quantity.value,
//                             unit_price: me.controls.unit_price.value,
//                             discount_percent: me.controls.discount_percent.value,
//                             tax_percent: me.controls.tax_percent.value,
//                             total_amount: me.controls.total_amount.value,
//                             notes: me.controls.notes.value
//                         };

//                         vsapi.call(
//                             `${main_view.base_url}/prm/invoice/save`,
//                             data,
//                             btn
//                         ).then(res => {
//                             if (res.status_code === 200) {
//                                 me.hide(true);
//                                 cv_interact.success('Invoice generated successfully');
//                                 if (op?.onClose) {
//                                     op.onClose();
//                                 }
//                             } else {
//                                 cv_interact.error(res.error_message || 'Failed to generate invoice');
//                             }
//                         });
//                     }
//                 }
//             ]
//         });

//         dialog.show(op);
//     };

//     return self;
// })();




const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select name="tenant_id" class="data-input form-control" data-field="tenant_id" required>
                                    <option value="">-- Select Tenant --</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-door-open me-2 text-info"></i>Room / Space Code <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select name="space_id" class="data-input form-control" data-field="space_id" required>
                                    <option value="">-- Select Room --</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-concierge-bell me-2 text-success"></i>Service <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select name="service_id" class="data-input form-control" data-field="service_id" required>
                                    <option value="">-- Select Service --</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-dollar-sign me-2 text-success"></i>Charge Unit <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select name="unit_type" class="data-input form-control" data-field="unit_type" required>
                                    <option value="">-- Select Unit --</option>
                                    <option value="hour">⏱️ Price Per Hour</option>
                                    <option value="month">📅 Price Per Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6 select-type-time" style="display:none;">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-clock me-2 text-info"></i>Duration (hours) <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select name="duration_hours" class="data-input form-control" data-field="duration_hours">
                                    <option value="">-- Select Duration --</option>
                                    <option value="0.5">⏰ 30 minutes</option>
                                    <option value="1">⏰ 1 hour</option>
                                    <option value="1.5">⏰ 1.5 hours</option>
                                    <option value="2">⏰ 2 hours</option>
                                    <option value="2.5">⏰ 2.5 hours</option>
                                    <option value="3">⏰ 3 hours</option>
                                    <option value="4">⏰ 4 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3" id="price-preview-row" style="display:none;">
                        <div class="col-12">
                            <div class="alert alert-info d-flex align-items-center justify-content-between shadow-sm price-alert">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-calculator fa-2x me-3 text-primary"></i>
                                    <div>
                                        <small class="text-muted d-block mb-1">Estimated Total</small>
                                        <strong class="fs-4 text-primary" id="calc-total">$0.00</strong>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <small class="text-muted d-block">Base Price × Duration</small>
                                    <span class="badge bg-primary" id="calc-breakdown">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label style="padding-left:6px; color:#777;">
                                <i class="fas fa-comment-dots me-2 text-primary"></i>Remarks / Description
                            </label>
                            <div class="material-input outlined position-relative">
                                <textarea class="data-input form-control"
                                        data-field="description"
                                        rows="4"
                                        placeholder="Enter any additional details..."
                                        maxlength="500"></textarea>
                                <div class="char-counter">
                                    <small class="text-muted">
                                        <span id="char-count">0</span> / 500
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" name="status_id" data-field="status_id" value="1" />
                </div>
            `,

            contentCreated: (me) => {
                const header = me.divModal.querySelector('.modal-header');
                header.querySelector('button')?.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.style.borderRadius = '20px';

                const title = header.querySelector('.modal-title');
                title.classList.add('text-white', 'text-center', 'w-100');

                const textarea = me.divModal.querySelector('[data-field="description"]');
                const charCount = me.divModal.querySelector('#char-count');
                if (textarea && charCount) {
                    textarea.addEventListener('input', () => {
                        charCount.textContent = textarea.value.length;
                        if (textarea.value.length > 450) {
                            charCount.parentElement.classList.add('text-danger');
                        } else {
                            charCount.parentElement.classList.remove('text-danger');
                        }
                    });
                }

                const updatePricePreview = () => {
                    const unit = me.controls?.unit_type?.value || '';
                    const showDuration = unit === 'hour';
                    const durationRow = me.divModal.querySelector('.select-type-time');
                    const previewRow = me.divModal.querySelector('#price-preview-row');

                    if (durationRow) durationRow.style.display = showDuration ? 'block' : 'none';

                    if (!showDuration) {
                        if (previewRow) previewRow.style.display = 'none';
                        return;
                    }

                    const hours = parseFloat(me.controls?.duration_hours?.value || '0') || 0;
                    const price = parseFloat(me.servicePrice || 0);

                    if (price <= 0 || !me.servicePrice) {
                        if (previewRow) previewRow.style.display = 'none';
                        return;
                    }

                    if (hours > 0 && price > 0) {
                        const total = price * hours;
                        me.divModal.querySelector('#calc-total').textContent = `$${total.toFixed(2)}`;
                        me.divModal.querySelector('#calc-breakdown').textContent = `$${price.toFixed(2)} × ${hours}h`;
                        if (previewRow) previewRow.style.display = 'block';
                    } else {
                        if (previewRow) previewRow.style.display = 'none';
                    }
                };

                me.controls?.service_id?.addEventListener('change', () => {
                    const serviceId = me.controls.service_id.value;
                    if (!serviceId) return;

                    const service = me.data?.services?.find(s => String(s.id) === String(serviceId));
                    if (service) {
                        me.servicePrice = service.price;
                        me.controls.unit_type.value = service.unit_type || '';
                        updatePricePreview();
                    }
                });

                ['unit_type', 'duration_hours'].forEach(f => {
                    me.controls?.[f]?.addEventListener('change', updatePricePreview);
                });

                updatePricePreview();

                me.onBeforeSubmit = () => {
                    const data = me.getData();
                    const required = {
                        tenant_id: 'Tenant',
                        space_id: 'Room/Space',
                        service_id: 'Service',
                        unit_type: 'Charge Unit'
                    };

                    for (const [field, label] of Object.entries(required)) {
                        if (!data[field]) {
                            cv_interact.error(`Please select ${label}`);
                            return false;
                        }
                    }

                    if (data.unit_type === 'hour' && !data.duration_hours) {
                        cv_interact.error('Please select duration for hourly service');
                        return false;
                    }

                    console.log('[SUBMIT] Data to send:', data);
                    return true;
                };
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
                                me.controls.space_id.value = me.detail?.space_id;
                            },
                            api: {
                                endpoint: `${main_view.base_url}/prm/tenant/options-active-space`,
                            },
                            textField: "space_code",
                            valueField: "id"
                        }
                    ]
                },
                { name: "service_id", data: "services", textField: "service", valueField: "id" },
                { name: "service_type_id", data: "service_types", textField: "service_type", valueField: "id" }
            ],

            onPrepareForm: (me, data) => {
                me.detail = data.request_details;
            },

            prepareFormOptions: {
                createTitle: "Create Service Request",
                modifyTitle: "Modify Service Request",
                targetProp: "request_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/service-request/form-options`,
                    params: (op) => ({ id: op.id || null })
                }
            },

            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn-vs-cancel btn-xl px-4',
                    click: (me) => me.hide(false)
                },
                {
                    label: '<span>Submit</span>',
                    cssClass: 'btn-vs-save btn-xl px-4',
                    click: (me, btn) => {
                        const data = me.getData();
                        data.id = me.dataOptions?.id || null;

                        vsapi.call(
                            `${main_view.base_url}/prm/service-request/save`,
                            data,
                            btn
                        ).then(res => {
                            if (res.status_code === 200) {
                                me.hide(true);
                                cv_interact.success(data.id ? "✓ Updated!" : "✓ Created!");
                            } else {
                                cv_interact.error(res.error_message || "Save failed");
                            }
                        });
                    }
                }
            ]
        });
        const originalShow = dialog.show;
        dialog.show = function(innerOp) {
            originalShow.call(this, innerOp);

            setTimeout(() => {
                if (!innerOp?.id) return;
                const select = this.controls?.duration_hours;
                if (!select) {
                    return;
                }

                let target = String(this.detail?.duration_hours ?? '').trim();
                if (!target) return;

                const candidates = [
                    target,
                    target.replace(/0+$/, ''),
                    parseFloat(target).toFixed(1),       // → "2.5"
                    parseFloat(target).toString(),       // clean string
                    target.replace('.', ',')             // some locales use comma
                ];
                let success = false;
                for (let val of candidates) {
                    select.value = val;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    select.dispatchEvent(new Event('input', { bubbles: true }));
                    if (select.value === val || select.value !== "") {;
                        success = true;
                        break;
                    }
                }


                if (window.jQuery && jQuery.fn?.select2) {
                    const $sel = jQuery(select);
                    if ($sel.hasClass('select2-hidden-accessible') || $sel.data('select2')) {
                        $sel.val(target).trigger('change');
                        $sel.val(candidates[1]).trigger('change');
                        success = true;
                    }
                }

                // Final check
                setTimeout(() => {
                    const finalVal = select.value;
                    const finalText = select.options[select.selectedIndex]?.text?.trim() || '(none)';
                    if (finalVal) {
                        updatePricePreview();
                    } else {
                        console.warn("[DURATION] Still empty – likely third-party library issue");
                    }
                }, 900);

            }, 700); // 700 ms delay – adjust between 500–1200 if needed
        };
        dialog.show(op);
    };

    return self;
})();



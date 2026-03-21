"use strict";

var ServiceRequestComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Service Request";
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
            transTitle: "titles.Request Num",
            className: "align-middle text-start",
            data: (data) => data.code
                ? `<span class="text-yp-custom">${data.code}</span>`
                : `<span class="text-muted fst-italic">N/A</span>`,
    },
    {
        transTitle: "titles.Tenant",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.tenant_name ?? ''}</span>`
    },
    {
        transTitle: "titles.Room Code",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom user-select-none">${data.space_code ?? ''}</span>`
    },
    {
        transTitle: "titles.Category",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.service_type ?? ''}</span>`
    },
    {
        transTitle: "titles.Service",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.service_name ?? ''}</span>`
    },
    {
        transTitle: "titles.Price",
        className: "align-middle",
        data: (data) => {
            const cur = data.cur_symbol ?? '$';
            let mainPrice = data.total_price ?? data.service_price;
            let displayPrice = mainPrice
                ? Number(mainPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—';

            let extraInfo = '';

            if (data.unit_type === '2' && data.duration_hours > 0 && data.service_price) {
                const base = Number(data.service_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                extraInfo = `<small class="text-muted d-block">$${base} × ${data.duration_hours}h</small>`;
            } else if (data.unit_type) {
                extraInfo = `<small class="text-nowrap text-muted d-block">/ ${data.unit_type}</small>`;
            }

            return `
                <span class="fw-bold fs-6">${cur} ${displayPrice}</span>
                ${extraInfo}
            `;
        }
    },
    {
        transTitle: "titles.Description",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.description ?? ''}</span>`
    },
    {
        transTitle: "titles.Schedule Date", className: "align-middle text-center",
        data: (data) => {
            const rawDate = (data.scheduled_date || '').toString().trim();
            const rawTime = (data.start_time || '').toString().trim();

            let datePart = rawDate;
            let timePart = rawTime.substring(0, 5);

            // Try to normalise date to YYYY-MM-DD if it's a valid date string.
            if (rawDate) {
                const d = new Date(rawDate);
                if (!Number.isNaN(d.getTime())) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    datePart = `${y}-${m}-${day}`;
                }
            }

            if (!datePart && !timePart) {
                return '<span class="text-yp-custom">...</span>';
            }

            if (!timePart) {
                return `<span class="text-yp-custom">${datePart}</span>`;
            }

            return `
                <div class="d-flex flex-column align-items-center">
                    <span class="text-yp-custom text-nowrap">${datePart}</span>
                    <span class="text-muted small text-nowrap">${timePart}</span>
                </div>
            `;
        }
    },
    {
        transTitle: "titles.Status",
        className: "align-middle",
        data:  (row,index,tr)=>{
            const statusId   = parseInt(row.status_id) || 2;
            const statusName = (row.status_name || "-").trim();

            const badgeClass = mThis.getStatusClass(statusId);

            if (statusId ===2){
                return `
                    <button data-id = "${row.id}"
                            data-statusid="${row.status_id}"
                            class="btn btn-sm ${badgeClass} fw-bold status-change-btn"
                            data-id="${row.id}"
                            data-current-status="${statusId}"
                            aria-expanded="false">
                            ${statusName}
                    </button>
                `;
            }else {
                return `
                    <span class="badge ${badgeClass.replace('btn-', 'bg-')} fs-6 px-3 py-2"
                        style="cursor: not-allowed;"
                        title="This status cannot be changed">
                        ${statusName}
                    </span>
                `;
            }

        }
    },
    {
        transTitle: "titles.Updated By",
        className: 'align-middle',
        data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom fw-semibold">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
    },
    {
        transTitle: "titles.Action",
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

    mThis.getStatusClass =(status_id)=>{
        switch(status_id){
            case 1: {
                return"btn-danger";
            }
            case 2: {
                return"btn-warning";
            }
            case 3:{
                return"btn-success";
            }
        }
    }

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.divListView = mThis.divListView || mThis.self.querySelector('#_service_request_list');
        mThis.ServiceRequestListView = new ListView(mThis.divListView, {
            //fetchApi: `${main_view.base_url}/prm/service-request/list`, // Old version
            api:{
                endpoint:`${main_view.base_url}/prm/service-request/list`, // new version
                method:'POST',
                cacheTTL:3000 //Cache data 3 seconds
            },
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.columns,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusId = data.status_id;
                tr.classList.add('service-request');
                tr.setAttribute('id', `service_request_id_${data.id}`);
            }
        });

        mThis.table=  mThis.ServiceRequestListView.getTable();

        mThis.table.addEventListener('click',(e)=>{
            let btn = VSUtil.closestLimited(e.target,' .status-change-btn');
            if(btn){
                const def = btn.dataset.statusid;
                const id = btn.dataset.id;
                const data = [
                    {
                        id:1,
                        name: 'Canceled'
                    },
                    {
                        id:2,
                        name: 'Pending'
                    },
                    {
                        id:3,
                        name: 'Accepted'
                    },
                ];
                InputBox.show({
                    type:'select',
                    title: 'Change Status ',
                    allowBlankValue: false,
                    data:data,
                    textField: 'name',
                    valueField: 'id',
                    defaultValue: def,
                    requiredMessage: 'Select Correct Status',
                    onConfirm(value, btn, me) {
                            const p = {id:id,status_id:value.id};
                            console.log("111111",p);
                            vsapi.post(`${main_view.base_url}/prm/service-request/set-status`,p,{})
                            .then(res => {
                                if(res.status_code == 200){
                                    mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                                    me.close();
                                }
                                else{
                                    me.setError(res.error_message);
                                }
                            });

                        }
                    });
                return ;
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
        status_id: mThis.elStatus.value,
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
                html: '<span class="ps-2" vslang="title.Generate Invoice"></span>',
                icon: `<i class="fa-solid fa-dollar-sign text-success"></i>`,
                name: "generate_invoice",
                cssClass: "border-bottom pb-2 mb-2"
            },
            {
                html: '<span class="ps-2 " vslang="title.Modify" ></span>',
                icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                name: "edit_request",
                cssClass: "border-bottom pb-2"
            },
            {
                html: '<span class="ps-2" vslang="title.Delete"></span>',
                icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                name: "delete_request",
                cssClass: "border-bottom pb-2"
            }
        ],
        onClick: (menuLink, id, name) => {
            const row = document.getElementById(`service_request_id_${id}`);
            const statusId = parseInt(row.dataset.statusId || '0', 10);
            if (statusId !== 2) {
                if (name === 'edit_request') {
                    cv_interact.info('Cannot modify');
                    return;
                }
            }
            if (name === 'generate_invoice') mThis.generateInvoice(id, menuLink);
            if (name === 'edit_request')     mThis.editServiceRequest(id, menuLink);
            if (name === 'delete_request')   mThis.deleteRequest(id, menuLink);
        }
    });
};


    mThis.generateInvoice = (id, menuLink) => {
        CreateInvoiceServiceRequestDialog.show({
            service_request_id: id,
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
            transTitle: 'Delete Service Request',
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

      function formatStatus(item){
        return `<span class="badge text-prm-custom bg-light" >${item.name}</span>`;
      }

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
                    VSUtil.setComboItems(mThis.elStatus, res.data.request_statuses, 'id', 'name', '', 'All Statuses', '');
                    VSUtil.setComboItems(mThis.elService_type, res.data.service_types, 'id', 'service_type', '', 'All Category', '');
                }
                if (typeof callback === 'function') callback();
            });
    };

    return mThis;
})();



const CreateInvoiceServiceRequestDialog = (() => {
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

                        <!-- Tenant & Service Info -->
                        <div class="col-12">
                            <div class="border border-info border-2 rounded-3 p-3 bg-white">
                                <div class="row g-3 text-start">
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Tenant:</span><br>
                                        <span class="fw-semibold fs-6" id="info-tenant">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Room:</span><br>
                                        <span class="fw-semibold fs-6" id="info-space">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Service:</span><br>
                                        <span class="fw-semibold fs-6" id="info-service">-</span>
                                    </div>
                                    <div class="col-md-3">
                                        <span class="text-muted fw-medium">Unit Type:</span><br>
                                        <span class="fw-semibold fs-6" id="info-unit">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Due Date, Discount, Tax -->
                        <div class="col-12">
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">Due Date <span class="text-danger">*</span></label>
                                    <input type="text"  data-type="date" class="form-control data-input" data-field="due_date" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label fw-semibold">Discount</label>
                                    <div class="d-flex gap-1">
                                        <select class="form-select" id="discount_type" style="max-width:90px;">
                                            <option value="percent">%</option>
                                            <option value="fixed">$</option>
                                        </select>
                                        <input type="number" step="0.01" min="0" class="form-control" id="discount_value" placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-3">
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

                        <!-- Service Request Item Table -->
                        <div class="col-12">
                            <div class="border border-info border-2 rounded-3 p-3 bg-white">
                                <div class="card-header d-flex justify-content-between align-items-center" style="background-color:#e1e5f2; margin:-16px -16px 16px -16px; padding:12px 20px; border-radius:6px 6px 0 0;">
                                    <h6 class="mb-0"><i class="fas fa-list me-2"></i>Service Request Item</h6>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-sm align-middle table-hover mb-0">
                                        <thead style="background-color:#f0f4ff;">
                                            <tr>
                                                <th>Description</th>
                                                <th class="text-center">Type</th>
                                                <th class="text-center">Qty/Unit</th>
                                                <th class="text-end">Amount</th>
                                                <th class="text-end">Discount</th>
                                                <th class="text-end">Tax</th>
                                                <th class="text-end">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody id="items-body"></tbody>
                                        <tfoot class="table-light">
                                            <tr>
                                                <td colspan="3" class="text-end fw-bold">Subtotal</td>
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
                         <div class="col-12">
                            <div class="col-md-3">
                            <label class="form-label fw-semibold"><i class="fas fa-calendar-alt text-warning me-1"></i>Due Date <span class="text-danger">*</span></label>
                            <input type="text" data-type="date" name="due_date" class="form-control data-input" required>
                        </div>
                        </div>

                        <!-- Remarks -->
                        <div class="col-12">
                            <label class="form-label fw-semibold">Remarks</label>
                            <textarea class="form-control data-input" data-field="remarks" rows="3" placeholder="Additional notes..."></textarea>
                        </div>

                        <!-- Hidden fields -->
                        <input type="hidden" data-field="tenant_id">
                        <input type="hidden" data-field="space_id">
                        <input type="hidden" data-field="service_id">
                    </div>
                `,

                contentCreated: (me) => {
                    me.controls = {};
                    me.divModal.querySelectorAll('.data-input').forEach(el => {
                        if (el.dataset.field) me.controls[el.dataset.field] = el;
                    });

                    const calculateAndUpdate = () => {
                        if (!me._serviceRequestData) return;

                        const subtotal = parseFloat(me._subtotal || 0);
                        const discType = document.getElementById('discount_type')?.value || 'percent';
                        const discVal  = parseFloat(document.getElementById('discount_value')?.value || 0);
                        const taxType  = document.getElementById('tax_type')?.value || 'percent';
                        const taxVal   = parseFloat(document.getElementById('tax_value')?.value || 0);

                        const discount = discType === 'percent' ? subtotal * (discVal / 100) : discVal;
                        const tax      = taxType === 'percent' ? subtotal * (taxVal / 100) : taxVal;   // ← CHANGED HERE
                        const netAmount = subtotal - discount + tax;

                        // Footer
                        document.getElementById('calc-subtotal').textContent = `$${subtotal.toFixed(2)}`;
                        document.getElementById('calc-discount').textContent = `-$${discount.toFixed(2)}`;
                        document.getElementById('calc-tax').textContent      = `+$${tax.toFixed(2)}`;
                        document.getElementById('calc-total').textContent    = `$${netAmount.toFixed(2)}`;

                        // Table row
                        document.getElementById('item-discount').textContent = `-$${discount.toFixed(2)}`;
                        document.getElementById('item-tax').textContent      = `+$${tax.toFixed(2)}`;
                        document.getElementById('item-net').textContent      = `$${netAmount.toFixed(2)}`;
                    };

                    ['discount_value', 'tax_value'].forEach(id => {
                        document.getElementById(id)?.addEventListener('input', calculateAndUpdate);
                    });
                    ['discount_type', 'tax_type'].forEach(id => {
                        document.getElementById(id)?.addEventListener('change', calculateAndUpdate);
                    });

                    me.loadServiceData = (op) => loadServiceRequestData(me, op);
                    me.calculateAndUpdate = calculateAndUpdate;
                },
                buttons: [
                    { label: 'Cancel', cssClass: 'btn btn-secondary', click: me => me.hide(false) },
                    {
                        label: 'Generate Invoice',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            if (!me._serviceRequestData) return cv_interact.error('No service request data loaded');

                            const formData = me.getData();
                            console.log("1234222",formData);
                            const discType = document.getElementById('discount_type')?.value || 'percent';
                            const discVal  = parseFloat(document.getElementById('discount_value')?.value || 0);
                            const taxType  = document.getElementById('tax_type')?.value || 'percent';
                            const taxVal   = parseFloat(document.getElementById('tax_value')?.value || 0);

                            const subtotal = me._serviceRequestData.amount;
                            const discount = discType === 'percent' ? subtotal * (discVal / 100) : discVal;
                            const tax      = taxType === 'percent' ? subtotal * (taxVal / 100) : taxVal;   // ← CHANGED HERE TOO

                            formData.items = [{

                                service_id: me._serviceRequestData.service_id,
                                description: me._serviceRequestData.description,
                                type: 'Service',
                                unit_type: me._serviceRequestData.unit_type,
                                quantity: me._serviceRequestData.quantity,
                                amount: subtotal,
                                discount_type: discType,
                                discount_value: discVal,
                                discount: discount,
                                tax_type: taxType,
                                tax_value: taxVal,
                                tax: tax
                            }];

                            formData.tenant_id = me._serviceRequestData.tenant_id;
                            formData.space_id  = me._serviceRequestData.space_id;
                            vsapi.call(`${main_view.base_url}/prm/invoice/save`, formData, btn)
                                .then(res => {
                                    if (res.status_code === 200) {
                                        me.hide(true);
                                        cv_interact.success('Invoice generated successfully!');
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
            if (dialog.loadServiceData) dialog.loadServiceData(op);
        }, 150);
    };

    const loadServiceRequestData = (me, op) => {
        if (!op?.service_request_id) return;

        me._serviceRequestData = null;
        me._subtotal = 0;

        document.getElementById('info-tenant').textContent = '-';
        document.getElementById('info-space').textContent  = '-';
        document.getElementById('info-service').textContent = '-';
        document.getElementById('info-unit').textContent   = '-';
        document.getElementById('items-body').innerHTML = '';

        vsapi.call(`${main_view.base_url}/prm/service-request/form-options`, { id: op.service_request_id })
            .then(res => {
                if (res.status_code !== 200) return cv_interact.error('Failed to load data');

                const data = res.data.request_details || {};
                console.log("1111",data);
                const service = res.data.services?.find(s => s.id == data.service_id) || {};
                document.getElementById('info-tenant').textContent = data.tenant_name || '-';
                document.getElementById('info-space').textContent  = data.space_code || '-';
                document.getElementById('info-service').textContent = service.service || '-';
                document.getElementById('info-unit').textContent   = data.unit_type || '-';

                me._serviceRequestData = {
                    tenant_id: data.tenant_id,
                    space_id: data.space_id,
                    service_id: data.service_id,
                    description: data.description || service.service || 'Service Request',
                    unit_type: data.unit_type || '',
                    quantity: parseFloat(data.quantity || 1),
                    amount: parseFloat(data.total_price || data.service_price || 0)
                };
                me.controls.tenant_id.value = data.tenant_id || '';
                me.controls.space_id.value  = data.space_id || '';
                me.controls.service_id.value = data.service_id || '';

                me._subtotal = me._serviceRequestData.amount;

                const qtyDisplay = me._serviceRequestData.quantity !== 1
                    ? `${me._serviceRequestData.quantity} ${me._serviceRequestData.unit_type || ''}`.trim()
                    : me._serviceRequestData.unit_type || '—';

                document.getElementById('items-body').innerHTML = `
                    <tr>
                        <td>${me._serviceRequestData.description || '-'}</td>
                        <td class="text-center">Service</td>
                        <td class="text-center"><span class="badge-unit">${qtyDisplay}</span></td>
                        <td class="text-end">$${me._serviceRequestData.amount.toFixed(2)}</td>
                        <td class="text-end text-danger" id="item-discount">-$0.00</td>
                        <td class="text-end text-info" id="item-tax">$0.00</td>
                        <td class="text-end fw-bold" id="item-net">$${me._serviceRequestData.amount.toFixed(2)}</td>
                    </tr>`;

                if (typeof me.calculateAndUpdate === 'function') me.calculateAndUpdate();
            })
            .catch(() => cv_interact.error('Network error loading data'));
    };

    return self;
})();



const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3 mb-3">
                        <!-- HIDDEN real tenant_id (sent to backend) -->
                        <input type="hidden" class="data-input" data-field="tenant_id">

                        <!-- Visible Tenant Search (NO data-field so name is NOT sent) -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <input name="tenant" class="form-control" placeholder="Search tenant..." autocomplete="off">
                            </div>
                        </div>

                        <!-- Room / Space -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-door-open me-2 text-info"></i>Room / Space <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="space_id" required></select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <!-- Service Category -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-layer-group me-2 text-warning"></i>Service Category <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="service_type_id" required></select>
                            </div>
                        </div>

                        <!-- Service -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-concierge-bell me-2 text-success"></i>Service <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="service_id" required></select>
                            </div>
                        </div>
                    </div>

                    <!-- Charge Unit - uses 1/2 (matches your PHP validation) -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-dollar-sign me-2 text-success"></i>Charge Unit <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="unit_type" required>
                                    <option value="">-- Select Unit --</option>
                                    <option value="1">📅 Price Per One Time</option>
                                    <option value="2">⏱️ Price Per Hour</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6 select-type-time" style="display:none;">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-clock me-2 text-info"></i>Duration (hours) <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="duration_hours">
                                    <option value="">-- Select Duration --</option>
                                    <option value="0.5">30 minutes</option>
                                    <option value="1">1 hour</option>
                                    <option value="1.5">1.5 hours</option>
                                    <option value="2">2 hours</option>
                                    <option value="2.5">2.5 hours</option>
                                    <option value="3">3 hours</option>
                                    <option value="4">4 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Price Preview, Date, Time, Remarks (your exact HTML) -->
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
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-calendar-alt text-warning me-1"></i>Scheduled Date <span class="text-danger">*</span>
                            </label>
                            <input type="date" class="form-control data-input" data-field="scheduled_date" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Start Time</label>
                            <input type="time" class="form-control data-input" data-field="start_time">
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-comment-dots me-2 text-primary"></i>Remarks
                            </label>
                            <div class="material-input outlined position-relative">
                                <textarea class="data-input form-control" data-field="description"
                                    rows="4" placeholder="Enter any additional details..." maxlength="500"></textarea>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" class="data-input" data-field="status_id" value="1">
                </div>
            `,

            contentCreated: (me) => {

                const updatePricePreview = () => {
                    const unit = me.controls.unit_type?.value || '';
                    const showDuration = unit === '2';
                    const durationRow = me.divModal.querySelector('.select-type-time');
                    const previewRow  = me.divModal.querySelector('#price-preview-row');

                    if (durationRow) durationRow.style.display = showDuration ? 'block' : 'none';
                    if (!showDuration) { if (previewRow) previewRow.style.display = 'none'; return; }

                    const hours = parseFloat(me.controls.duration_hours?.value || 0);
                    const price = parseFloat(me.servicePrice || 0);

                    if (hours > 0 && price > 0) {
                        const total = price * hours;
                        me.divModal.querySelector('#calc-total').textContent = `$${total.toFixed(2)}`;
                        me.divModal.querySelector('#calc-breakdown').textContent = `$${price.toFixed(2)} × ${hours}h`;
                        if (previewRow) previewRow.style.display = 'block';
                    } else if (previewRow) {
                        previewRow.style.display = 'none';
                    }
                };

                me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    type: 'select',
                    prefetch: true,
                    query: {
                        from: 'tenants',
                        select: ['id', 'name', 'legal_name', 'email', 'phone_number'],
                        searchFields: { name: 'LIKE', legal_name: 'LIKE', email: '=', phone_number: '=' }
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: (tenant) => {
                        me.controls.tenant_id.value = tenant.id;
                        // me._selectedTenantId = tenant.id;

                        vsapi.post(`${main_view.base_url}/prm/tenant/option-tenant-with-service`, {
                            tenant_id: tenant.id
                        }).then(res => {
                            const d = res.data || {};
                            VSUtil.setComboItems(me.controls.space_id, d.spaces || [], 'space_id', 'space_code', '', '-- Select Room --');

                            const typesMap = {};
                            (d.service || []).forEach(s => {
                                if (!typesMap[s.service_type_id]) {
                                    typesMap[s.service_type_id] = { id: s.service_type_id, service_type: s.service_type };
                                }
                            });
                            VSUtil.setComboItems(me.controls.service_type_id, Object.values(typesMap), 'id', 'service_type', '', '-- Select Category --');

                            me._availableServices = d.service || [];
                            me.controls.service_id.innerHTML = '<option value="">-- Select Service --</option>';
                            updatePricePreview();
                        });
                    }
                });

                // Service selected → force numeric unit_type
                me.controls.service_id?.addEventListener('change', () => {
                    const svc = me._availableServices?.find(s => String(s.id) === me.controls.service_id.value);
                    if (svc) {
                        me.servicePrice = parseFloat(svc.price) || 0;
                        me.controls.unit_type.value = (svc.unit_type === 'hour') ? '2' : '1';  // ← CRITICAL
                        updatePricePreview();
                    }
                });

                me.controls.service_type_id?.addEventListener('change', () => {
                    const typeId = me.controls.service_type_id.value;
                    let filtered = me._availableServices || [];
                    if (typeId) filtered = filtered.filter(s => String(s.service_type_id) === typeId);
                    VSUtil.setComboItems(me.controls.service_id, filtered, 'id', 'service_name', '', '-- Select Service --');
                    me.controls.service_id.value = '';
                    me.servicePrice = 0;
                    updatePricePreview();
                });

                ['unit_type', 'duration_hours'].forEach(f => {
                    me.controls[f]?.addEventListener('change', updatePricePreview);
                });
            },


            onPrepareForm: (me, data) => {
                me.detail = data.request_details;
                if (me.detail) {
                    const raw = (me.detail.scheduled_date || '').trim();
                    if (raw) {
                        const d = new Date(raw);
                        if (!isNaN(d.getTime())) {
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            me.controls.scheduled_date.value = `${y}-${m}-${day}`;
                        }
                    }
                    if (me.detail.start_time && me.controls.start_time) {
                        me.controls.start_time.value = me.detail.start_time.substring(0, 5);
                    }
                }
            },

             prepareFormOptions: {
                createTitle: "Create Service Request",
                modifyTitle: "Modify Service Request",
                targetProp: "request_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/service-request/form-options`,
                    params: (op) => { id: op.id }
                }
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
                        const data = me.getData();
                        data.id = op?.id || null;
                        vsapi.call([main_view.base_url, "/prm/service-request/save",].join(""), data, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true,data);
                                    cv_interact.success(data.id ? "Updated!" : "Created!");
                                } else {
                                    cv_interact.error(res.error_message);
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





const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3 mb-3">
                        <input type="hidden" class="data-input" data-field="tenant_id">
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;"><i class="fas fa-user me-2 text-primary"></i>Tenant <span class="text-danger">*</span></label>
                            <div class="material-input outlined">
                                <input name="tenant" class="data-input form-control" data-field="tenant_search" required>
                            </div>
                        </div>

                        <!-- Room / Space -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-door-open me-2 text-info"></i>Room / Space <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="space_id" required></select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <!-- Service Category -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-layer-group me-2 text-warning"></i>Service Category <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="service_type_id" required></select>
                            </div>
                        </div>

                        <!-- Service -->
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-concierge-bell me-2 text-success"></i>Service <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="service_id" required></select>
                            </div>
                        </div>
                    </div>

                    <!-- Charge Unit - uses 1/2 (matches your PHP validation) -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-dollar-sign me-2 text-success"></i>Charge Unit <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="unit_type" required>
                                    <option value="">-- Select Unit --</option>
                                    <option value="1">📅 Price Per One Time</option>
                                    <option value="2">⏱️ Price Per Hour</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6 select-type-time" style="display:none;">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-clock me-2 text-info"></i>Duration (hours) <span class="text-danger">*</span>
                            </label>
                            <div class="material-input outlined">
                                <select class="data-input form-control" data-field="duration_hours">
                                    <option value="">-- Select Duration --</option>
                                    <option value="0.5">30 minutes</option>
                                    <option value="1">1 hour</option>
                                    <option value="1.5">1.5 hours</option>
                                    <option value="2">2 hours</option>
                                    <option value="2.5">2.5 hours</option>
                                    <option value="3">3 hours</option>
                                    <option value="4">4 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Price Preview, Date, Time, Remarks (your exact HTML) -->
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
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">
                                <i class="fas fa-calendar-alt text-warning me-1"></i>Scheduled Date <span class="text-danger">*</span>
                            </label>
                            <input type="date" class="form-control data-input" data-field="scheduled_date" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Start Time</label>
                            <input type="time" class="form-control data-input" data-field="start_time">
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label style="padding-left:6px;color:#777;">
                                <i class="fas fa-comment-dots me-2 text-primary"></i>Remarks
                            </label>
                            <div class="material-input outlined position-relative">
                                <textarea class="data-input form-control" data-field="description"
                                    rows="4" placeholder="Enter any additional details..." maxlength="500"></textarea>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" class="data-input" data-field="status_id" value="1">
                </div>
            `,

            contentCreated: (me) => {

                const updatePricePreview = () => {
                    const unit = me.controls.unit_type?.value || '';
                    const showDuration = unit === '2';
                    const durationRow = me.divModal.querySelector('.select-type-time');
                    const previewRow  = me.divModal.querySelector('#price-preview-row');

                    if (durationRow) durationRow.style.display = showDuration ? 'block' : 'none';
                    if (!showDuration) { if (previewRow) previewRow.style.display = 'none'; return; }

                    const hours = parseFloat(me.controls.duration_hours?.value || 0);
                    const price = parseFloat(me.servicePrice || 0);

                    if (hours > 0 && price > 0) {
                        const total = price * hours;
                        me.divModal.querySelector('#calc-total').textContent = `$${total.toFixed(2)}`;
                        me.divModal.querySelector('#calc-breakdown').textContent = `$${price.toFixed(2)} × ${hours}h`;
                        if (previewRow) previewRow.style.display = 'block';
                    } else if (previewRow) {
                        previewRow.style.display = 'none';
                    }
                };

                me.searchTenant = VSSearchInput.init(me.divModal.querySelector('[name="tenant"]'),{
                    type: 'select',
                    prefetch: true,
                    query: {
                        from: 'tenants',
                        select: ['id', 'name', 'legal_name', 'email', 'phone_number'],
                        searchFields: { name: 'LIKE', legal_name: 'LIKE', email: '=', phone_number: '=' }
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: (tenant) => {
                        me.controls.tenant_id.value = tenant.id;
                        // me._selectedTenantId = tenant.id;

                        vsapi.post(`${main_view.base_url}/prm/tenant/option-tenant-with-service`, {tenant_id: tenant.id
                        }).then(res => {
                            const d = res.data || {};
                            VSUtil.setComboItems(me.controls.space_id, d.spaces || [], 'space_id', 'space_code', '', '-- Select Room --');
                            const typesMap = {};
                            (d.service || []).forEach(s => {
                                if (!typesMap[s.service_type_id]) {
                                    typesMap[s.service_type_id] = { id: s.service_type_id, service_type: s.service_type };
                                }
                            });
                            VSUtil.setComboItems(me.controls.service_type_id, Object.values(typesMap), 'id', 'service_type', '', '-- Select Category --');

                            me._availableServices = d.service || [];
                            me.controls.service_id.innerHTML = '<option value="">-- Select Service --</option>';
                            updatePricePreview();
                        });
                    }
                });

                // Service selected → force numeric unit_type
                me.controls.service_id?.addEventListener('change', () => {
                    const svc = me._availableServices?.find(s => String(s.id) === me.controls.service_id.value);
                    if (svc) {
                        me.servicePrice = parseFloat(svc.price) || 0;
                        me.controls.unit_type.value = (svc.unit_type === 'hour') ? '2' : '1';  // ← CRITICAL
                        updatePricePreview();
                    }
                });

                me.controls.service_type_id?.addEventListener('change', () => {
                    const typeId = me.controls.service_type_id.value;
                    let filtered = me._availableServices || [];
                    if (typeId) filtered = filtered.filter(s => String(s.service_type_id) === typeId);
                    VSUtil.setComboItems(me.controls.service_id, filtered, 'id', 'service_name', '', '-- Select Service --');
                    me.controls.service_id.value = '';
                    me.servicePrice = 0;
                    updatePricePreview();
                });

                ['unit_type', 'duration_hours'].forEach(f => {
                    me.controls[f]?.addEventListener('change', updatePricePreview);
                });
            },


            onPrepareForm: (me, data) => {
                me.detail = data.request_details;
                if (me.detail) {
                    const raw = (me.detail.scheduled_date || '').trim();
                    if (raw) {
                        const d = new Date(raw);
                        if (!isNaN(d.getTime())) {
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            me.controls.scheduled_date.value = `${y}-${m}-${day}`;
                        }
                    }
                    if (me.detail.start_time && me.controls.start_time) {
                        me.controls.start_time.value = me.detail.start_time.substring(0, 5);
                    }
                }
            },

             prepareFormOptions: {
                createTitle: "Create Service Request",
                modifyTitle: "Modify Service Request",
                targetProp: "request_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/service-request/form-options`,
                }
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
                        const data = me.getData();
                        data.id = op?.id || null;
                        vsapi.call([main_view.base_url, "/prm/service-request/save",].join(""), data, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true,data);
                                    cv_interact.success(data.id ? "Updated!" : "Created!");
                                } else {
                                    cv_interact.error(res.error_message);
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



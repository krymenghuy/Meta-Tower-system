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
        title: "Category",
        className: "align-middle",
        data: (data) => `<span class="text-primary-custom">${data.service_type_name ?? ''}</span>`
    },
    // ── New Priority column with colors ───────────────────────────────
    {
        title: "Priority",
        className: "align-middle text-center",
        data: (data) => {
            const prio = (data.priority || 'medium').toLowerCase();
            let cls = '';
            let text = prio.charAt(0).toUpperCase() + prio.slice(1);

            if (prio === 'high' || prio === 'urgent') {
                cls = 'text-danger fw-bold';
            } else if (prio === 'medium') {
                cls = 'text-warning fw-semibold';
            } else if (prio === 'low') {
                cls = 'text-success';
            }

            return `<span class="${cls}">${text}</span>`;
        }
    },
    // ── Improved Price column ── show final/total price when available ──
    {
        title: "Price",
        className: "align-middle",
        data: (data) => {
            const cur = data.cur_symbol ?? '$';

            // Prefer total_price if it exists and is different / calculated
            let mainPrice = data.total_price ?? data.service_price;
            let displayPrice = mainPrice
                ? Number(mainPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '—';

            let extraInfo = '';

            // If we have duration → show small hint (optional)
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
                tr.dataset.statusId = data.request_status_id;           // consistent kebab → camel
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
                { html: '<span class="ps-2">Change Status</span>', icon: `<i class="fa fa-exchange fs-5 text-info"></i>`, name: "change_status", cssClass: "border-bottom pb-2" },
                { html: '<span class="ps-2">Modify</span>', icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`, name: "edit_request", cssClass: "border-bottom pb-2" },
                { html: '<span class="ps-2">Delete</span>', icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`, name: "delete_request", cssClass: "border-bottom pb-2" }
            ],
            onClick: (menuLink, id, name) => {
                if (name === 'change_status') mThis.changeStatus(id, menuLink);
                if (name === 'edit_request') mThis.editServiceRequest(id, menuLink);
                if (name === 'delete_request') mThis.deleteRequest(id, menuLink);
            }
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
        const currentStatusId = tr?.dataset.statusId || "1";   // ← FIXED: use the actual ID

        const options = {
            title: 'Change Status',
            cssClass: '',
            backdropClose: true,
            type: 'select',
            label: 'Status',
            valueField: 'status_id',
            textField: 'name',
            confirmButtonText: "Submit",                    // fixed typo
            requiredMessage: 'Select one valid status',
            context: 'success',
            data: [
                { status_id: "1", name: "Pending"    },
                { status_id: "2", name: "Approved"   },
                { status_id: "3", name: "Cancelled"  },
                { status_id: "4", name: "Completed"  },
            ],
            defaultValue: currentStatusId,                  // ← now correctly pre-selects
            onConfirm: (value, btn, me) => {                // fixed typo: onConfirm
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


const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="row justify-content-center g-3">
                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Tenant</label>
                        <div class="material-input outlined">
                            <select name="tenant_id" class="data-input form-control" data-field="tenant_id"></select>
                        </div>
                    </div>

                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Room / Space Code</label>
                        <div class="material-input outlined">
                            <select name="space_id" class="data-input form-control" data-field="space_id"></select>
                        </div>
                    </div>

                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Service</label>
                        <div class="material-input outlined">
                            <select name="service_id" class="data-input form-control" data-field="service_id"></select>
                        </div>
                    </div>

                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Category</label>
                        <div class="material-input outlined">
                            <select name="service_type_id" class="data-input form-control" data-field="service_type_id"></select>
                        </div>
                    </div>

                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Charge Unit</label>
                        <div class="material-input outlined">
                            <select name="unit_type" class="data-input form-control" data-field="unit_type">
                                <option value="">-- Select unit --</option>
                                <option value="hour">Price Per Hour</option>
                                <option value="month">Price Per Month</option>
                                <option value="time">Per Usage / Per Time</option>
                                <option value="one_time">One-time</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-12 select-type-time" style="display:none;">
                        <label style="padding-left:6px; color:#777;">Duration (hours)</label>
                        <div class="material-input outlined">
                            <select name="duration_hours" class="data-input form-control" data-field="duration_hours">
                                <option value="">-- Select duration --</option>
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

                    <div class="col-12 mt-2 text-muted small" id="price-preview" style="display:none;">
                        Estimated total: <strong id="calc-total">$0.00</strong>
                    </div>
                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Priority</label>
                        <select name="priority" class="data-input form-control" data-field="priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div class="col-12">
                        <label style="padding-left:6px; color:#777;">Remarks</label>
                        <div class="material-input outlined">
                            <textarea class="data-input form-control" data-field="description" rows="3" placeholder="Enter details..."></textarea>
                        </div>
                    </div>

                    <input type="hidden" name="status_id" data-field="status_id" value="1" />
                </div>`,

            contentCreated: (me) => {
                // Header customization
                const header = me.divModal.querySelector('.modal-header');
                header.querySelector('button')?.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.style.borderRadius = '20px';

                const title = header.querySelector('.modal-title');
                title.classList.add('text-white', 'text-center', 'w-100');

                // Price preview logic
                const updatePricePreview = () => {
                    const unit = me.controls.unit_type?.value || '';
                    const showDuration = unit === 'hour';
                    me.divModal.querySelector('.select-type-time').style.display = showDuration ? 'block' : 'none';

                    if (!showDuration) {
                        me.divModal.querySelector('#price-preview').style.display = 'none';
                        return;
                    }

                    const hours = parseFloat(me.controls.duration_hours?.value) || 0;
                    const price = parseFloat(me.servicePrice || 0);
                    const preview = me.divModal.querySelector('#price-preview');
                    const totalEl = me.divModal.querySelector('#calc-total');

                    if (hours > 0 && price > 0) {
                        const total = price * hours;
                        totalEl.textContent = `$${total.toFixed(2)}`;
                        preview.style.display = 'block';
                    } else {
                        preview.style.display = 'none';
                    }
                };

                me.controls.service_id?.addEventListener('change', () => {
                    const serviceId = me.controls.service_id.value;
                    if (!serviceId) return;

                    const service = me.data?.services?.find(s => s.id == serviceId);
                    if (service) {
                        me.servicePrice = service.price;
                        me.controls.unit_type.value = service.unit_type || '';
                        updatePricePreview();
                    }
                });

                ['unit_type', 'duration_hours'].forEach(f => {
                    me.controls[f]?.addEventListener('change', updatePricePreview);
                });

                updatePricePreview();

                me.onBeforeSubmit = () => {
                    const data = me.getData();
                    console.log("=== SUBMIT DATA DEBUG ===");
                    console.log("Sent to backend:", data);
                    console.log("unit_type:", data.unit_type);
                    console.log("priority:", data.priority);
                    console.log("duration_hours:", data.duration_hours);
                    return true;
                };
            },

            configSelect: [
                { name: "tenant_id",     data: "tenants",        textField: "tenant",     valueField: "id" },
                { name: "space_id",      data: "building_spaces", textField: "floor_id",   valueField: "id" },
                { name: "service_id",    data: "services",       textField: "service",    valueField: "id" },
                { name: "service_type_id", data: "service_types",  textField: "service_type", valueField: "id" }
            ],

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
                    cssClass: 'btn-vs-cancel',
                    click: (me) => me.hide(false)
                },
                {
                    label: '<span>Submit</span>',
                    cssClass: 'btn-vs-save',
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
                                cv_interact.success(data.id ? "Service request updated" : "Service request created");
                            } else {
                                cv_interact.error(res.error_message || "Save failed");
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

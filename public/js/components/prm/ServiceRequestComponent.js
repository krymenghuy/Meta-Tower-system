"use strict";

var ServiceRequestComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Service Request";
    // mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service_request");
    mThis.elService_type = mThis.self.querySelector('#_service_request_type_id');
    mThis.elStatus = mThis.self.querySelector('#_service_request_status');
    mThis.elSearch = mThis.self.querySelector("#_search_service_request");
    mThis.elBtnCreate = mThis.self.querySelector("#_btnServiceRequest");

    mThis.columns = [
        { title: "", className: "align-middle text-capitalize" },
        {
            transTitle: "titles.Request No",
            className: "align-middle text-nowrap text-start",
            data: (data) => {
                const code = data.code ? `<span class="text-prm-custom">${data.code}</span>`: `<span class="text-muted fst-italic">N/A</span>`;
                const date = data.request_date ? `<span class="text-danger-emphasis small">${data.request_date}</span>`: `<span class="text-muted fst-italic small">N/A</span>`;
                return `
                    <div class="d-flex flex-column">
                        ${code}
                        <hr class="m-0 border border-secondary border-3 opacity-75">
                        ${date}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle text-capitalize",
            data: (data) => {
                return ` <div class="d-flex text-nowrap align-items-center gap-2">
                <div>
                    <span class="text-prm-custom d-block">
                        ${data.tenant_name ?? ''}
                    </span>
                    <span class="d-block text-primary">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            }
        },
        {
            title: "Request Type",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap">${data.service_type ?? ""}</span>
                 <span class="d-block text-prm-custom text-nowrap">${data.service_name ?? ""}</span>`,
        },
        {
            transTitle: "titles.Charge As",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="badge text-success bg-success-subtle border border-success text-nowrap" style="min-width:70px;">${data.unit_type}</span>`;
            }
        },
        {
            transTitle: "titles.Duration",
            className: "align-middle",
            data: (data) => {
                const hours = parseFloat(data.duration_hours);

                if (!data.duration_hours || isNaN(hours)) {
                    return `<span class="text-nowrap">___</span>`;
                }

                const display = `${hours % 1 === 0 ? hours.toFixed(0) : hours} H`;
                return `<span class="text-nowrap">${display}</span>`;
            }
        },
        {
            title: "Amount",
            className: "align-middle text-nowrap text-end",
            data: (data) =>{
                const service_price = VSMoney.formatAmount(data.total_price,data.currency_code ?? 'USD');
                const text = service_price;
                const cls_color = data.total_price > 0 ? 'text-prm-custom' : 'text-danger';
                    return `<span class="d-block ${cls_color}">${text}</span>`;

            }
        },
        {
            transTitle: "titles.Schedule Date",
            className: "align-middle text-nowrap text-center",
            data: (data) => {

                const formatTime = (time) => {
                    if (!time) return '';

                    // Support HH:mm:ss or HH:mm
                    let parts = time.split(':');
                    let hour = parseInt(parts[0], 10);
                    let minute = parts[1] ?? '00';

                    if (isNaN(hour)) return '';

                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    hour = hour % 12 || 12;

                    // ensure 2-digit minute
                    minute = minute.padStart(2, '0');

                    return `${hour}:${minute} ${ampm}`;
                };

                return `
                    <div class="d-flex flex-column align-items-start">
                        <span class="text-prm-custom text-nowrap">${data.scheduled_date ?? ''}</span>
                        <span class="text-primary text-nowrap">
                            Start Time: ${formatTime(data.start_time)}
                        </span>
                    </div>
                `;
            }
        },

        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? '...'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Status",
            className: "align-middle text-nowrap",
            data: (data) => {
                const status = (data.status_name ?? '').toLowerCase();
                const statusId = Number(data.status_id) || 0;
                const statusClasses = {
                    pending: 'badge text-warning bg-warning-subtle border border-warning',
                    accepted: 'badge text-primary bg-primary-subtle border border-primary',
                    rejected: 'badge text-danger bg-danger-subtle border border-danger'
                };
                const cls = statusClasses[status] ?? 'badge text-dark bg-light border';
                const isEditable = status === 'pending';
                return `
            <span
                data-id="${data.id}"
                data-statusid= "${data.status_id}"
                data-current-status="${statusId}"
                class="${cls} ${isEditable} text-capitalize d-inline-block text-center"
                style="min-width:70px; cursor:${isEditable }"
                title="${isEditable ? 'Click to change status' : 'This status cannot be changed'}">
                ${data.status_name ?? ''}
            </span>
        `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex justify-content-center align-items-end">
                <a href="javascript:void(0)"
                    class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_service_request_action'} bg-second pointer p-4"
                    data-id="${data.id}"
                    data-statusid="${data.status_id}"
                    data-status-id="${data.request_status_id}"
                    aria-haspopup="true" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis-vertical fs-5 text-prm-custom"></i>
                </a>
            </div>`
        }
    ];


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.divListView = mThis.divListView || mThis.self.querySelector('#_service_request_list');
        mThis.ServiceRequestListView = new ListView(mThis.divListView, {
            //fetchApi: `${main_view.base_url}/prm/service-request/list`, // Old version
            api: {
                endpoint: `${main_view.base_url}/prm/service-request/list`, // new version
                method: 'POST',
                cacheTTL: 3000 //Cache data 3 seconds
            },
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.columns,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusId = data.status_id;
                tr.classList.add('service-request');
                tr.setAttribute('id', `service_request_id_${data.id}`);
            }
        });

        // mThis.table = mThis.ServiceRequestListView.getTable();


        mThis.elBtnCreate.onclick = (e) => {
            e.preventDefault();
            CreateServiceRequestDialog.show({
                id: null,
                btn: e.target,
                onClose: () => mThis.ServiceRequestListView.showPage(mThis.getFilterData())
            });
        };
        mThis.listContainer = mThis.ServiceRequestListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 220) + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + "px";
        };
        mThis.tblServiceRequest = mThis.ServiceRequestListView.getTable();






        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {mThis.ServiceRequestListView.showPage(mThis.getFilterData());}, 250);
        };
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });
        mThis.initDropdownMenus(mThis.tblServiceRequest);
        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elStatus.value,
            service_type_id: mThis.elService_type.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };
    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_service_request_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="title.Accept"></span>',
                    icon: `<i class="fa-regular fa-square-check fs-5 text-primary"></i>`,
                    name: "accept_request",
                    cssClass: "border-bottom pb-2"
                },
                {
                    html: '<span class="ps-2" vslang="title.Reject"></span>',
                    icon: `<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                    name: "reject_request",
                    cssClass: "border-bottom pb-2"
                },
                {
                    html: '<span class="ps-2 " vslang="title.Modify"></span>',
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
             onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
               menu.edit_request.style.display = (status_id >= 2) ? 'none' : 'block';
            //    menu.delete_request.style.display = (status_id >= 2) ? 'none' : 'block';
               menu.accept_request.style.display = (status_id >= 2) ? 'none' : 'block';
               menu.reject_request.style.display = (status_id >= 2) ? 'none' : 'block';
               


            },
            onClick: (menuLink, id, name) => {
                if (name === 'accept_request') mThis.acceptRequest(id, menuLink);
                if (name === 'reject_request') mThis.rejectRequest(id, menuLink);
                if (name === 'edit_request') mThis.editServiceRequest(id, menuLink);
                if (name === 'delete_request') mThis.deleteRequest(id, menuLink);
            }
        });
    };
    mThis.rejectRequest = (id, menuLink) => {
        let op ={
            id:id
        }
        Swal.fire({
            input: "textarea",
            inputLabel: " ",
            inputPlaceholder: "Please, enter new remark why reject this request",
            reverseButtons: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if(!value)
                    return "Remark required!";
                else
                {
                    op.remarks = value;
                    console.log(44,op);

                    vsapi.call(`${main_view.base_url}/prm/service-request/reject`,op,null).then((res) => {
                        if(res.status_code === 200)
                        {
                            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                        }
                        else
                        {
                            cv_interact.error(res.error_message ?? "Something went wrong!");
                        }
                    });
                }
            },
        });
    };
    mThis.acceptRequest = (id, menuLink) => {
        cv_interact.confirm(
            'Are you sure you want to accept this service request?',
            {
                title: 'Accept Service Request',
                context: 'update',
                confirmButtonText: 'Accept'
            },
            (e) => {
                if (!e) return;

                vsapi.call(
                    `${main_view.base_url}/prm/service-request/accept`,
                    { id },
                    false
                )
                .then(res => {
                    if (res.status_code === 200) {
                        mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                        cv_interact.success('Service Request has been accepted!');
                    } else {
                        cv_interact.error(res.error_message || 'Something went wrong');
                    }
                })
                .catch(() => {
                    cv_interact.error('Network error');
                });
            }
        );
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
                            cv_interact.success('Service request deleted.');
                            mThis.ServiceRequestListView.showPage();
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        });
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/service-request/form-options`,null,null,null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                    VSUtil.setComboItems(mThis.elStatus, d.request_statuses, 'id', 'name', '', 'All Statuses', '');
                    VSUtil.setComboItems(mThis.elService_type, d.service_types, 'id', 'service_type', '', 'All Categories', '');
                if (typeof onFinish === 'function') onFinish();
            });
    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });
    };
return mThis;


})();

const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {

console.log(123,op);

        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3 mb-3">
                        <input type="hidden" class="data-input" data-field="tenant_id">
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <input name="tenant" class="form-control" data-field="tenant_id" placeholder="Tenant" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="space_id" required placeholder="Space"></select>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="service_type_id" required placeholder="Service Type"></select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="service_id" required placeholder="Service"></select>
                            </div>
                        </div>
                        
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="unit_type" disabled placeholder="Unit Type">
                                    <option value=""> Select Unit </option>
                                    <option value="1">One Time</option>
                                    <option value="2">Hour</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3 select-type-time" style="display:none;">
                            <div class="material-input outlined">
                                <select name="duration_hours" data-style="material" class="data-input form-control" data-field="duration_hours" placeholder="Duration (hours)">
                                    <option value=""> Select Duration </option>
                                    <option value="0.5">30 minutes</option>
                                    <option value="1.0">1 hour</option>
                                    <option value="1.5">1.5 hours</option>
                                    <option value="2.0">2 hours</option>
                                    <option value="2.5">2.5 hours</option>
                                    <option value="3.0">3 hours</option>
                                    <option value="4.0">4 hours</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <input data-type="date" class="form-control data-input" data-field="scheduled_date" required />
                                <label style="padding-left:6px;color:#777777;">Scheduled Date</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <input type="time" class="form-control data-input" data-field="start_time" placeholder=" " />
                                <label style="color:#777777;padding-left:6px;">Start Time</label>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3" id="price-preview-row" style="display:none;">
                        <div class="col-12">
                            <div class="alert alert-secondary d-flex align-items-center justify-content-between shadow-sm price-alert">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-calculator fa-2x me-3 text-primary"></i>
                                    <div>
                                        <small class="text-muted d-block mb-1">Amount</small>
                                        <strong class="fs-4 text-primary" id="calc-total">$0.00</strong>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <small class="text-muted d-block">Price x Duration</small>
                                    <span class="badge bg-primary" id="calc-breakdown">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                <label style="padding-left:6px;color:#777;">Remark</label>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            contentCreated: (me) => {
                const updatePricePreview = () => {
                    const unit = me.controls.unit_type?.value || '';
                    const showDuration = unit === '2';
                    const durationRow = me.divModal.querySelector('.select-type-time');
                    const previewRow = me.divModal.querySelector('#price-preview-row');

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
                        where: [['status_id','=',2]],
                        select: ['id', 'name', 'legal_name', 'email', 'phone_number'],
                        orderBy: [['id','DESC']],
                        limit:50,
                        searchFields: { name: 'LIKE', legal_name: 'LIKE', email: '=', phone_number: '=' }
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: (tenant) => {
                        me.controls.tenant_id.value = tenant.id;
                        me.loadTenantOptions(tenant.id);
                    }
                });
                me.searchTenant.reset("");

                // Shared loader: populate spaces & services for a tenant.
                // Pass restoreValues to pre-select saved fields after loading (used in Modify mode).
                me.loadTenantOptions = (tenantId, restoreValues = null) => {
                    vsapi.post(`${main_view.base_url}/prm/tenant/option-tenant-with-service`, {
                        tenant_id: tenantId
                    }).then(res => {
                        const d = res.data || {};
                        me._availableServices = d.service || [];
                        VSUtil.setComboItems(me.controls.space_id, d.spaces || [], 'space_id', 'space_code', '', '-- Select Room --');
                        const typesMap = {};
                        me._availableServices.forEach(s => {
                            if (!typesMap[s.service_type_id]) {
                                typesMap[s.service_type_id] = { id: s.service_type_id, service_type: s.service_type };
                            }
                        });
                        VSUtil.setComboItems(me.controls.service_type_id, Object.values(typesMap), 'id', 'service_type', '', '-- Select Category --');

                        if (restoreValues) {
                            // Restore mode: set saved values
                            if (restoreValues.space_id) me.controls.space_id.value = String(restoreValues.space_id);

                            // Derive service_type_id from service if missing
                            let resolvedTypeId = restoreValues.service_type_id;
                            if (!resolvedTypeId && restoreValues.service_id) {
                                const match = me._availableServices.find(s => String(s.id) === String(restoreValues.service_id));
                                if (match) resolvedTypeId = match.service_type_id;
                            }
                            if (resolvedTypeId) me.controls.service_type_id.value = String(resolvedTypeId);

                            // Filter services by type then restore
                            let filtered = me._availableServices;
                            if (resolvedTypeId) filtered = filtered.filter(s => String(s.service_type_id) === String(resolvedTypeId));
                            VSUtil.setComboItems(me.controls.service_id, filtered, 'id', 'service_name', '', '-- Select Service --');
                            if (restoreValues.service_id) me.controls.service_id.value = String(restoreValues.service_id);

                            // Restore service price
                            const svc = me._availableServices.find(s => String(s.id) === String(restoreValues.service_id));
                            if (svc) me.servicePrice = parseFloat(svc.price) || 0;

                            // unit_type & duration
                            if (me.controls.unit_type && restoreValues.unit_type) me.controls.unit_type.value = restoreValues.unit_type;
                            if (me.controls.duration_hours && restoreValues.duration_hours) me.controls.duration_hours.value = restoreValues.duration_hours;
                        } else {
                            // Create mode: just reset service dropdowns
                            me.controls.service_id.innerHTML = '<option value="">-- Select Service --</option>';
                        }

                        updatePricePreview();
                    });
                };
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
                if (!me.detail) return;
                const detail = me.detail;
                const raw = (detail.scheduled_date || '').trim();
                if (raw) {
                    const d = new Date(raw);
                    if (!isNaN(d.getTime())) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        me.controls.scheduled_date.value = `${y}-${m}-${day}`;
                    }
                }

                if (detail.start_time && me.controls.start_time) {
                    me.controls.start_time.value = detail.start_time.substring(0, 5);
                }

                if (me.controls.description) {
                    me.controls.description.value = detail.description || '';
                }

                if (me.controls.unit_type && detail.unit_type) {
                    me.controls.unit_type.value = detail.unit_type;
                }
                console.log(6666,me.detail);
                
                if (me.controls.duration_hours && detail.duration_hours) {
                    me.controls.duration_hours.value = detail.duration_hours;
                }

                if (detail.tenant_id) {
                    me.controls.tenant_id.value = detail.tenant_id;

                    if (me.searchTenant) {
                        const tenantName = detail.tenant_name || String(detail.tenant_id);
                        if (typeof me.searchTenant.setValue === 'function') {
                            me.searchTenant.setValue({ id: detail.tenant_id, name: tenantName });
                        } else if (me.controls.tenant) {
                            me.controls.tenant.value = tenantName;
                        }
                    }

                    me.loadTenantOptions(detail.tenant_id, {
                        space_id: detail.space_id,
                        service_type_id: detail.service_type_id,
                        service_id: detail.service_id,
                        unit_type: detail.unit_type,
                        duration_hours: detail.duration_hours,
                    });
                }
            },

            prepareFormOptions: {
                createTitle: "Create Service Request",
                modifyTitle: "Modify Service Request",
                targetProp: "request_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/service-request/form-options`,
                    params: (op) => ({ id: op.id })
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
                        console.log(3333,data);

                        vsapi.call([main_view.base_url, "/prm/service-request/save",].join(""), data, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, data);
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

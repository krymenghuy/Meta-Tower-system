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
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-nowrap align-items-center gap-2">
                <div>
                    <span class="text-prm-custom d-block">
                        ${data.tenant_name ?? ''}
                    </span>
                    <span class="d-block text-warning">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            }
        },
        {
            title: "Service Type",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap">${data.service_type ?? ""}</span>
                 <span class="d-block text-prm-custom text-nowrap">${data.service_name ?? ""}</span>`,
        },
        // {
        //     transTitle: "titles.Price",
        //     className: "align-middle",
        //     data: (data) => {
        //         const cur = data.cur_symbol ?? '$';
        //         let mainPrice = data.service_price;
        //         console.log(55,data.service_price);

        //         let displayPrice = mainPrice
        //             ? Number(mainPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        //             : '—';

        //         let extraInfo = '';

        //         if (data.unit_type == '2' && data.duration_hours > 0 && data.service_price) {
        //             const base = Number(data.service_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        //             extraInfo = `<small class="text-muted d-block">$${base} × ${data.duration_hours}h</small>`;
        //         } else if (data.unit_type) {
        //             extraInfo = `<small class="text-nowrap text-muted d-block">/ ${data.unit_type}</small>`;
        //         }

        //         return `
        //         <span class="fw-bold fs-6">${cur} ${displayPrice}</span>
        //         ${extraInfo}
        //     `;
        //     }
        // },
            {
            title: "Price",
            className: "align-middle text-nowrap text-end",
            data: (data) =>{
                const service_price = VSMoney.formatAmount(data.service_price,data.currency_code ?? 'USD');
                const text = service_price;
                const cls_color = data.service_price > 0 ? 'text-prm-custom' : 'text-danger';
                    return `<span class="d-block ${cls_color}">${text}</span>`;

            }
        },
        {
            transTitle: "titles.Duration",
            className: "align-middle",
            data: (data) => {
                const hours = parseFloat(data.duration_hours);

                if (!data.duration_hours || isNaN(hours)) {
                    return `<span class="text-nowrap">One Time</span>`;
                }

                const display = `${hours % 1 === 0 ? hours.toFixed(0) : hours} H`;
                return `<span class="text-nowrap">${display}</span>`;
            }
        },
        // {
        //     transTitle: "titles.Schedule Date",
        //     className: "align-middle text-nowrap text-center",
        //     data: (data) => {
        //         console.log(123,data);

        //         const rawDate = (data.scheduled_date || '').toString().trim();
        //         const rawTime = (data.start_time || '').toString().trim();

        //         let datePart = rawDate;
        //         let timePart = rawTime.substring(0, 5);

        //         // Try to normalise date to YYYY-MM-DD if it's a valid date string.
        //         if (rawDate) {
        //             const d = new Date(rawDate);
        //             if (!Number.isNaN(d.getTime())) {
        //                 const y = d.getFullYear();
        //                 const m = String(d.getMonth() + 1).padStart(2, '0');
        //                 const day = String(d.getDate()).padStart(2, '0');
        //                 datePart = `${y}-${m}-${day}`;
        //             }
        //         }

        //         if (!datePart && !timePart) {
        //             return '<span class="text-yp-custom">...</span>';
        //         }

        //         if (!timePart) {
        //             return `<span class="text-yp-custom">${datePart}</span>`;
        //         }

        //         return `
        //         <div class="d-flex flex-column align-items-center">
        //             <span class="text-prm-custom text-nowrap">${datePart}</span>
        //             <span class="text-muted small text-nowrap">${timePart}</span>
        //         </div>
        //     `;
        //     }
        // },
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
                        <span class="text-warning small text-nowrap">
                            ${formatTime(data.start_time)}
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
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? '...'}</span>
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
                    cancelled: 'badge text-danger bg-danger-subtle border border-danger'
                };
                const cls = statusClasses[status] ?? 'badge text-dark bg-light border';
                const isEditable = status === 'pending';
                return `
            <span
                data-id="${data.id}"
                data-statusid= "${data.status_id}"
                data-current-status="${statusId}"
                class="${cls} ${isEditable ? 'status-change-btn' : ''} text-capitalize d-inline-block text-center"
                style="min-width:70px; cursor:${isEditable ? 'pointer' : 'not-allowed'}"
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
                <span class="text-capitalize text-primary-custom fw-semibold">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle text-nowrap',
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

        mThis.tblServiceRequest.addEventListener('click', (e) => {
            let btn = VSUtil.closestLimited(e.target, ' .status-change-btn');
            if (btn) {
                const def = btn.dataset.statusid;
                const id = btn.dataset.id;
                const data = [
                    {
                        id: 1,
                        name: 'Canceled'
                    },
                    {
                        id: 2,
                        name: 'Pending'
                    },
                    {
                        id: 3,
                        name: 'Accepted'
                    },
                ];
                InputBox.show({
                    type: 'select',
                    title: 'Change Status ',
                    allowBlankValue: false,
                    data: data,
                    textField: 'name',
                    valueField: 'id',
                    defaultValue: def,
                    requiredMessage: 'Select Correct Status',
                    onConfirm(value, btn, me) {
                        const p = { id: id, status_id: value.id };
                        vsapi.post(`${main_view.base_url}/prm/service-request/set-status`, p, {})
                            .then(res => {
                                if (res.status_code == 200) {
                                    mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                                    me.close();
                                }
                                else {
                                    me.setError(res.error_message);
                                }
                            });

                    }
                });
                return;
            }

        });




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
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="title.Accept"></span>',
                    icon: `<i class="fa-regular fa-square-check fs-5 text-primary"></i>`,
                    name: "accept_request",
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
            onClick: (menuLink, id, name) => {
                const row = document.getElementById(`service_request_id_${id}`);
                const statusId = parseInt(row.dataset.statusId || '0', 10);
                if (statusId !== 2) {
                    if (name === 'edit_request') {
                        cv_interact.info('Cannot modify');
                        return;
                    }
                }
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

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/service-request/form-options`,null,null,null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                    VSUtil.setComboItems(mThis.elStatus, d.request_statuses, 'id', 'name', '', 'All Statuses', '');
                    VSUtil.setComboItems(mThis.elService_type, d.service_types, 'id', 'service_type', '', 'All Category', '');
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
                            <div class="material-input outlined">
                                <input name="tenant" class="form-control" data-field="tenant_id" placeholder="Tenant" autocomplete="off">
                                <!--<label style="padding-left:6px;color:#777;">Tenant</label> -->
                            </div>
                        </div>

                        <!-- Room / Space -->
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="space_id" required placeholder="Space"></select>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <!-- Service Category -->
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="service_type_id" required placeholder="Service Type"></select>
                            </div>
                        </div>

                        <!-- Service -->
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="service_id" required placeholder="Service"></select>
                            </div>
                        </div>
                    </div>

                    <!-- Charge Unit - uses 1/2 (matches your PHP validation) -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="unit_type" required placeholder="Unit Type">
                                    <option value="">-- Select Unit --</option>
                                    <option value="1">One Time</option>
                                    <option value="2">Hour</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6 select-type-time" style="display:none;">
                            <div class="material-input outlined">
                                <select data-style="material" class="data-input form-control" data-field="duration_hours" placeholder="Duration (hours)">
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
                                    <small class="text-muted d-block">Base Price x Duration</small>
                                    <span class="badge bg-primary" id="calc-breakdown">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="material-input outlined">
                                <input data-type="date" class="form-control data-input" data-field="scheduled_date" required />
                                <label style="padding-left:6px;color:#777777;">Scheduled Date</label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="material-input outlined">
                                <input type="time" class="form-control data-input" data-field="start_time" placeholder=" " />
                                <label style="color:#777777;padding-left:6px;">Start Time</label>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                <label style="padding-left:6px;color:#777;">Remarks</label>
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
                console.log(4444444444,data.request_details);

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





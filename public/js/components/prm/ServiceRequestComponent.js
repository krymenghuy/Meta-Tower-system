"use strict";
var ServiceRequestComponent = (function () {

    const mThis = {};
    mThis.title_prop = "Service Request Component";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");
    mThis.elSearch = mThis.self.querySelector("#_search_service_request");
    mThis.elServiceRequest_status = mThis.self.querySelector("#_service_request_status");
    mThis.elService_type = mThis.self.querySelector("#_service_request_type_id");
    mThis.elBtnCreate = mThis.self.querySelector("#_btnServiceRequest");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service_request");

    mThis.columns = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.tenant_name ?? ''}</span>`;
            }
        },
        {
            title: "Building",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.building_space_building_id ?? ''}</span>`;
            }
        },
        {
            title: "Floor",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.building_space_floor_id ?? ''}</span>`;
            }
        },
        {
            title: "Service",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_name ?? ''}</span>`;
            }
        },
        {
            title: "Category",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_type_name ?? ''}</span>`;
            }
        },
         {
            title: "Price",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_price ?? ''}</span>`;
            }
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.description ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const rawStatus = data.status_name || data.request_status_name || '';
                const status_name = rawStatus.toLowerCase();

                const baseCls = 'text-white px-3 py-1 rounded-3 d-inline-block';

                const statusMap = {
                    rejected: 'bg-danger',
                    approved: 'bg-success',
                    pending: 'bg-primary','in progress': 'bg-warning text-dark',
                    completed: 'bg-success',
                };

                const cls = `${baseCls} ${statusMap[status_name] || 'bg-secondary'}`;

                return `
                    <span class="${cls}" data-status_id="${data.request_status_id}">
                        <small>${rawStatus}</small>
                    </span>
                `;
            },
        },


        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-primary-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn--Options   ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}  bg-second pointer p-4"
                    data-id="${data.id}"
                    data-statusid="${data.request_status_id}"
                    aria-haspopup="true"
                    aria-expanded="false"">
                        <i class="fa-solid fa-ellipsis-vertical  fs-5 text-prm-custom"></i>
                    </a>
                </div>`
        },


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
                tr.dataset.statusid = data.request_status_id;
                tr.classList.add('service-request');
                tr.setAttribute('id', ['service_request_id', data.id].join(''));
            },
            listContainerClass: null
        });

        mThis.elBtnCreate.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateServiceRequestDialog.show(op);
        };

        mThis.pr_tbl = mThis.ServiceRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        };

        mThis.tblServiceRequest = mThis.ServiceRequestListView.getTable();
        mThis.initDropdownMenus(mThis.tblServiceRequest);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            request_status_id: mThis.elServiceRequest_status.value,
            service_request_type_id: mThis.elService_type.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_status"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_request"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_request"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'change_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'edit_request': {
                        mThis.editServiceRequest(id, menuLink);
                        break;
                    }
                    case 'delete_request': {
                        mThis.deleteRequest(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editServiceRequest = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            }
        };
        CreateServiceRequestDialog.show(op);
    };

    mThis.deleteRequest = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Service Request?', {
            title: 'Delete Service Request',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/service-request/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        cv_interact.success('Service request deleted successfully');
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
        const status_id = tr?.dataset.statusid || "";
        const inputOptions = {
            title: 'Change Status',
            dataLabel: "Service Request Status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {status_id: "1", name: "Approved"},
                {status_id: "2", name: "Rejected"},
                {status_id: "3", name: "Pending"},
                {status_id: "4", name: "In Progress"},
                {status_id: "5", name: "Completed"},
            ],
            defaultValue: status_id
        };
        InputBox2.show(inputOptions, (selected) => {
            if (!selected) return;
            if (!AuthManager.allowed(321)) return;

            const payload = {id, status_id: selected.value};
            vsapi.call(`${mThis.base_url}/prm/service-request/update-status`, payload).then(res => {
                if (res.status_code === 200) {
                    InputBox2.close();
                    cv_interact.success('Service Status has been updated');
                    mThis.ServiceRequestListView.showPage(mThis.getFilterData());
                } else {
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/service-request/from-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elServiceRequest_status, d.service_statuses, 'id', 'name', true, 'All Statuses', null);
                VSUtil.setComboItems(mThis.elService_type, d.service_types, 'id', 'service_type', true, 'All Service Types', null);
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
        dialog = dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                            <div class="col-12">
                                <label style="padding-left:6px;" for="name">Tenant</label>
                                <div class="material-input outlined">
                                    <select name="name" class="data-input form-control" data-field="tenant_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="padding-left:6px;" for="service_type">Category</label>
                                <div class="material-input outlined">
                                    <select name="service_type" class="data-input form-control" data-field="service_type_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="padding-left:6px;" for="building">Building</label>
                                <div class="material-input outlined">
                                    <select name="building" class="data-input form-control" data-field="building_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="padding-left:6px;" for="service_type">Floor</label>
                                <div class="material-input outlined">
                                    <select name="service_type" class="data-input form-control" data-field="floor_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="padding-left:6px;" for="service_type">Service</label>
                                <div class="material-input outlined">
                                    <select name="service_type" class="data-input form-control" data-field="service_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <label style="padding-left:6px;">Price</label>
                                <div class="material-input outlined">
                                    <input type="number" name="service_price" required class="data-input form-control" data-field="service_price" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-8">
                                <label style="padding-left:6px;" for="service_types">Charge As</label>
                                <div class="material-input outlined">
                                    <select name="unit_type" class="data-input form-control" data-field="unit_type">
                                        <option value="hour">Price Per Hour</option>
                                        <option value="month">Price Per Month</option>
                                        <option value="time">Per Usage / Per Time</option>
                                        <option value="one_time">One-time Service</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="d-none material-input outlined">
                                    <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                    <label>Status ID</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <label style="padding-left:6px;">Remarks</label>
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                </div>
                            </div>
                        </div>`
                    ].join("");
                },

                contentCreated: (me) => {
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-prm-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                    headerTitle.classList.add('text-white', 'text-center', 'w-100');
                    headerWrapper.appendChild(headerTitle);

                    header.innerHTML = '';
                    header.appendChild(headerWrapper);
                },

                configSelect: [
                    {
                        name: "tenant_id",
                        data: "tenants",
                        textField: "tenant",
                        valueField: "id",
                    },
                    {
                        name: "building_id",
                        data: "building_spaces",
                        textField: "building_id",
                        valueField: "id"
                    },
                    {
                        name: "floor_id",
                        data: "building_spaces",
                        textField: "floor_id",
                        valueField: "id",
                    },
                    {
                        name: "service_id",
                        data: "services",
                        textField: "service",
                        valueField: "id",
                    },
                    {
                        name: "service_type_id",
                        data: "service_types",
                        textField: "service_type",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Create Service Request",
                    modifyTitle: "Modify Service Request",
                    targetProp: "service_requests",
                    api: {
                        endpoint: [main_view.base_url, "/prm/service-request/from-options"].join(""),
                        params: (op) => {
                            return {id: op.id};
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if (btnClose) btnClose.classList.add('d-none');
                },

                buttons: [
                    {
                        label: '<span>Cancel</span>',
                        cssClass: 'btn-vs-cancel',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span>Submit</span>',
                        cssClass: 'btn-vs-save',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url, "/prm/service-request/save"].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success("Service request has been updated successfully");
                                    } else {
                                        cv_interact.success("New service request has been added successfully");
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

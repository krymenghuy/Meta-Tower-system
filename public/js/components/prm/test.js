"use strict";

var TenantComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Tenant Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant");

    // View toggle buttons
    mThis.btnCardView = mThis.self.querySelector("#_btnCardView");
    mThis.btnListView = mThis.self.querySelector("#_btnListView");

    // Containers
    mThis.listContainer = mThis.self.querySelector("#_tenant_list");
    mThis.cardContainer = mThis.self.querySelector("#_tenant_cards");

    // Current view mode: 'list' or 'card'
    mThis.currentView = 'card'; // Default to card view

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="font-size:12px;"><i class="fa-solid text-gary "></i>${data.name ?? ''}</span>
                        <small class="d-block text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "National ID",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.national_id ?? ''}</span>`;
            }
        },
        {
            title: "Passport Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.passport_number ?? ''}</span>`;
            }
        },
        {
            title: "Legal Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.legal_name ?? ''}</span>`;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data, index, tr) =>
                `<span class="d-block text-primary" style="font-size:12px;"><i class="fa-solid text-success px-1 fa-envelope"></i> ${data.email ?? ""}</span>
                 <span class="d-block" style="font-size:12px;"><i class="fa-solid text-warning px-1 fa-phone"></i> ${data.phone_number ?? ""}</span>`,
        },
        {
            title: "Address",
            className: "align-middle ",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i><span class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        // Initialize List View
        mThis.TenantListView = new ListView('_tenant_list', {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add('tenant');
                tr.setAttribute('id', ['tenant_id', data.id].join(''));
            },
            listContainerClass: null
        });

        // Initialize Card View
        mThis.TenantCardView = new CardView('_tenant_cards', {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 12,
            apiCluster: main_view.apiCluster,
            cardTemplate: mThis.createCardTemplate,
            onCardCreated: mThis.onCardCreated
        });

        // View toggle button handlers
        mThis.btnCardView.onclick = (e) => {
            e.preventDefault();
            mThis.switchView('card');
        };

        mThis.btnListView.onclick = (e) => {
            e.preventDefault();
            mThis.switchView('list');
        };

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.refreshCurrentView();
                }
            };
            CreateTenantDialog.show(op);
        };

        mThis.pr_tbl = mThis.TenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblTenant = mThis.TenantListView.getTable();
        mThis.initDropdownMenus(mThis.tblTenant);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.refreshCurrentView();
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.refreshCurrentView();
            }, 250);
        });

        mThis.initAlready = true;
    };

    // Switch between list and card view
    mThis.switchView = (viewType) => {
        mThis.currentView = viewType;

        if (viewType === 'card') {
            mThis.listContainer.classList.add('d-none');
            mThis.cardContainer.classList.remove('d-none');
            mThis.btnCardView.classList.add('active');
            mThis.btnListView.classList.remove('active');
            mThis.TenantCardView.showPage(mThis.getFilterData());
        } else {
            mThis.cardContainer.classList.add('d-none');
            mThis.listContainer.classList.remove('d-none');
            mThis.btnListView.classList.add('active');
            mThis.btnCardView.classList.remove('active');
            mThis.TenantListView.showPage(mThis.getFilterData());
        }
    };

    // Refresh current view
    mThis.refreshCurrentView = () => {
        if (mThis.currentView === 'card') {
            mThis.TenantCardView.showPage(mThis.getFilterData());
        } else {
            mThis.TenantListView.showPage(mThis.getFilterData());
        }
    };

    // Create card template
    mThis.createCardTemplate = (data) => {
        const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
        const sexIcon = data.sex === 'M' ? 'fa-mars' : data.sex === 'F' ? 'fa-venus' : 'fa-genderless';

        return `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                <div class="tenant-card" data-id="${data.id}" data-statusid="${data.status_id}">
                    <div class="tenant-card-header">
                        <div class="tenant-avatar">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div class="tenant-card-actions">
                            <button class="btn--Options-card btn_card_action" data-id="${data.id}" data-statusid="${data.status_id}">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        </div>
                    </div>

                    <div class="tenant-card-body">
                        <h5 class="tenant-name">${data.name ?? 'N/A'}</h5>
                        <p class="tenant-gender">
                            <i class="fa-solid ${sexIcon} me-1"></i>
                            ${sexLabel}
                        </p>

                        ${data.legal_name ? `
                            <div class="tenant-info-item">
                                <i class="fa-solid fa-id-card text-primary"></i>
                                <span>${data.legal_name}</span>
                            </div>
                        ` : ''}

                        ${data.national_id ? `
                            <div class="tenant-info-item">
                                <i class="fa-solid fa-fingerprint text-info"></i>
                                <span>${data.national_id}</span>
                            </div>
                        ` : ''}

                        ${data.passport_number ? `
                            <div class="tenant-info-item">
                                <i class="fa-solid fa-passport text-success"></i>
                                <span>${data.passport_number}</span>
                            </div>
                        ` : ''}

                        <div class="tenant-contact">
                            ${data.email ? `
                                <div class="tenant-info-item">
                                    <i class="fa-solid fa-envelope text-primary"></i>
                                    <span class="text-truncate">${data.email}</span>
                                </div>
                            ` : ''}

                            ${data.phone_number ? `
                                <div class="tenant-info-item">
                                    <i class="fa-solid fa-phone text-warning"></i>
                                    <span>${data.phone_number}</span>
                                </div>
                            ` : ''}
                        </div>

                        ${data.address ? `
                            <div class="tenant-info-item">
                                <i class="fa-solid fa-location-dot text-danger"></i>
                                <span class="text-truncate" title="${data.address}">${data.address}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="tenant-card-footer">
                        <small class="text-muted">
                            <i class="fa-solid fa-user-pen me-1"></i>
                            ${data.update_user ?? 'N/A'}
                        </small>
                        <small class="text-muted">${data.updated_at ?? ''}</small>
                    </div>
                </div>
            </div>
        `;
    };

    // Handle card created event
    mThis.onCardCreated = (cardContainer) => {
        mThis.initDropdownMenusForCards(cardContainer);
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
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_tenant"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant"
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'edit_tenant': {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case 'delete_tenant': {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }

    mThis.initDropdownMenusForCards = (cardContainer) => {
        const menuOptions = {
            containerElement: cardContainer,
            actionButtonClass: "btn_card_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 ">Edit</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_tenant"
                },
                {
                    html: '<span class="ps-2 ">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant"
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'edit_tenant': {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case 'delete_tenant': {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }

    mThis.editTenant = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.refreshCurrentView();
            }
        };
        CreateTenantDialog.show(op);
    }

    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.refreshCurrentView();
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Tenant??', {
            title: 'Delete Tenant',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/tenant/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.refreshCurrentView();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }
        });
    }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/tenant/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.switchView(mThis.currentView);
        });
    };

    return mThis;
})();

// Card View Helper Class (add this if you don't have it)
class CardView {
    constructor(containerId, options) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.currentPage = 1;
        this.totalPages = 1;
    }

    showPage(params = {}) {
        params.page = this.currentPage;
        params.per_page = this.options.perPage || 12;

        vsapi.call(this.options.fetchApi, params).then(res => {
            if (res.status_code === 200) {
                this.render(res.data);
                if (this.options.onCardCreated) {
                    this.options.onCardCreated(this.container);
                }
            }
        });
    }

    render(data) {
        const items = data.data || [];
        let html = '<div class="row">';

        items.forEach(item => {
            html += this.options.cardTemplate(item);
        });

        html += '</div>';
        this.container.innerHTML = html;
    }
}

const CreateTenantDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row justify-content-center">
                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                <label>Full Name</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="text" name="legal_name" required class="data-input form-control" data-field="legal_name" placeholder=" " />
                                <label>Legal Name</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;" for="sex"> Select Gender</label>
                            <div class="material-input outlined">
                                <select name="sex" placeholder=" " class="data-input form-control" data-field="sex">
                                    <option value="m">Male</option>
                                    <option value="f">Female</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="tel" name="phone_number" required class="data-input form-control" data-field="phone_number" placeholder=" " />
                                <label>Phone Number</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="text" name="email" required class="data-input form-control" data-field="email" placeholder=" " />
                                <label>Email</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                <label>Address</label>
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
                header.classList.add('bg-yp-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);

                header.innerHTML = '';
                header.appendChild(headerWrapper);
            },

            prepareFormOptions: {
                createTitle: "Create New Tenant",
                modifyTitle: "Modify Tenant ",
                targetProp: "tenants",
                api: {
                    endpoint: [main_view.base_url, "/prm/tenant/form-options",].join(""),
                    params: (op) => {
                        return { id: op.id };
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
                        vsapi.call([main_view.base_url, "/prm/tenant/create",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Tenant has been updated successfully");
                                } else {
                                    cv_interact.success("New tenant has been added successfully");
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

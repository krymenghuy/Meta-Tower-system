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
    mThis.btnListView = mThis.self.querySelector("#_btnListView");
    mThis.btnCardView = mThis.self.querySelector("#_btnCardView");
    mThis.listContainer = mThis.self.querySelector("#_tenant_list");
    mThis.cardContainer = mThis.self.querySelector("#_tenant_cards");

    mThis.currentView = 'card';
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "photo",
            className: "align-middle",
            data:(data) => `<img class="btn-view-tenant-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/meta/default_tenant.jpg`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px;"/>`,
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="font-size:12px;">${data.name ?? ''}</span>
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
            data: (data) =>
                `<span class="d-block text-primary" style="font-size:12px;"><i class="fa-solid text-success px-1 fa-envelope"></i> ${data.email ?? ""}</span>
                <span class="d-block" style="font-size:12px;"><i class="fa-solid text-warning px-1 fa-phone"></i> ${data.phone_number ?? ""}</span>`,
        },
        {
            title: "Address",
            className: "align-middle",
            data: (data) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i>
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.address ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data) => {
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
                    <a href="javascript:void(0)"
                    class="btn--Options btn_leave_action"
                    data-id="${data.id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="cursor: pointer; padding: 8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-white fs-5" style="pointer-events: none;"></i>
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
            onCardCreated: (container) => {
                // Initialize dropdown menus for card view
                mThis.initDropdownMenus(container);
            }
        });

        mThis.btnListView.onclick = (e) => {
            e.preventDefault();
            mThis.switchView('list');
        };

        mThis.btnCardView.onclick = (e) => {
            e.preventDefault();
            mThis.switchView('card');
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

        // Card container scroll management
        const card_parent = mThis.cardContainer;
        card_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        card_parent.classList.add("overflow-y-auto");

        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
            card_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        };

        mThis.tblTenant = mThis.TenantListView.getTable();
        // console.log('tblTenant:', mThis.tblTenant);
        mThis.initDropdownMenus(mThis.tblTenant);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.refreshCurrentView();
            };
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.refreshCurrentView();
            }, 250);
        });

        mThis.tblTenant.addEventListener("click", function (e) {
            let btn = e.target.closest(".btn-view-tenant-photo");
            if (btn) {
                ImageBox.viewPhoto({
                    imageUrl:btn.src,
                    features:['zoom','rotate','brightness','contrast'],
                    imageClass:'',
                    dialogClass:'',
                    dialogSize:'lg',
                    freeZoom:true,
                    //imageClass:"",
                    //photoViewSize: "lg", //lg or xl
                    //freeZoom:false,
                   
                });

                // let op = {
                //     id: btn.dataset.member_id,
                //     image_url: btn.src
                // };
                // PreViewMemberDialog.show(op);
                return;
            }
        })
        mThis.initAlready = true;
    };

    // Switch between List and Card View
    mThis.switchView = (view) => {
        mThis.currentView = view;
        if (view === 'list') {
            mThis.cardContainer.classList.add('d-none');
            mThis.listContainer.classList.remove('d-none');
            mThis.btnListView.classList.add('active');
            mThis.btnCardView.classList.remove('active');
            mThis.TenantListView.showPage(mThis.getFilterData());
        } else {
            mThis.listContainer.classList.add('d-none');
            mThis.cardContainer.classList.remove('d-none');
            mThis.btnCardView.classList.add('active');
            mThis.btnListView.classList.remove('active');
            mThis.TenantCardView.showPage(mThis.getFilterData());
        }
    };

    // Refresh current view
    mThis.refreshCurrentView = () => {
        if (mThis.currentView === 'list') {
            mThis.TenantListView.showPage(mThis.getFilterData());
            setTimeout(() => {
                mThis.initDropdownMenus(mThis.tblTenant);
            }, 100);
        } else {
            mThis.TenantCardView.showPage(mThis.getFilterData());
        }
    };

    // Create card template
   mThis.createCardTemplate = (data) => {
    const sexLabel = data.sex?.toUpperCase() === 'M' ? 'Male' : data.sex?.toUpperCase() === 'F' ? 'Female' : 'Other';
    const imageUrl = data.image_url || `${main_view.base_url}/assets/images/meta/default_tenant.jpg`;

    return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
        <div class="tenant-card" data-id="${data.id}">
            <div class="card-header btn-relative">
                <div class="avatar-wrapper">
                    <div class="avatar">
                        ${data.image_url
                            ? `<img src="${imageUrl}" alt="${data.name}" class="tenant-avatar-img btn-view-tenant-photo" data-id="${data.id}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <i class="fa-solid fa-user" style="display:none;"></i>`
                            : `<i class="fa-solid fa-user"></i>`
                        }
                    </div>
                </div>
                <div class="header-info">
                    <div class="header-info-name">${data.name ?? ''}</div>
                    <div class="tenant-company">${data.legal_name ?? ''}</div>
                    <small class="text-muted">${sexLabel}</small>
                </div>
                <div class="menu-btn-wrapper btn-absolute">
                    <a href="javascript:void(0)"
                        class="btn--Options btn_leave_action"
                        data-id="${data.id}"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style="cursor: pointer; padding: 8px;">
                            <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" style="pointer-events: none;"></i>
                        </a>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex box-card">
                    <div class="info-grid">
                        <div class="vertical-sidebar-left">
                            <div class="vertical-icon info-icon text-primary">
                                <i class="fas fa-id-card info-icon.id"></i>
                            </div>
                            <div class="vertical-icon info-icon text-primary">
                                <i class="fas fa-passport info-icon.passport"></i>
                            </div>
                            <div class="vertical-icon info-icon text-success">
                                <i class="fas fa-phone info-icon.phone"></i>
                            </div>
                            <div class="vertical-icon info-icon text-warning">
                                <i class="fas fa-envelope info-icon.email"></i>
                            </div>
                            <div class="vertical-icon info-icon text-light">
                                <i class="fas fa-map-marker-alt info-icon.location"></i>
                            </div>
                        </div>
                    </div>
                    <div class="info-grid" style="position: relative; flex: 1;">
                        <div class="info-row">
                            <div class="info-text">: ${data.national_id ?? 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-text">: ${data.passport_number ?? 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-text">: ${data.phone_number ?? 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-text">: ${data.email ?? 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-text">: ${data.address ?? 'N/A'}</div>
                        </div>
                        <div class="image-background"></div>
                    </div>
                </div>
                <div class=" footer-actions">
                    <div class="left-icons text-success">
                        Active
                    </div>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

            </div>
            <div class="footer-actions">
                <div class="left-icons text-muted">
                    <small>Updated by ${data.update_user ?? 'N/A'} • ${data.updated_at ?? 'N/A'}</small>
                </div>
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    </div>
    `;
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

    // Initialize dropdown menus for both table and cards
    mThis.initDropdownMenus = (container) => {
        console.log('Initializing dropdowns for container:', container); // Debug
        console.log('Found action buttons:', container.querySelectorAll('.btn_leave_action').length); // Debug
        const menuOptions = {
            containerElement: container,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_tenant"
                },
                {
                    html: '<span class="ps-2">Delete</span>',
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
        };
        new VSDropdownMenu(menuOptions);

        // Also attach click handlers to card footer buttons
       container.querySelectorAll('.btn-view-tenant-photo').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            ImageBox.viewPhoto({
                imageUrl: btn.src,
                features: ['zoom', 'rotate', 'brightness', 'contrast'],
                imageClass: '',
                dialogClass: '',
                dialogSize: 'lg',
                freeZoom: true,
                });
            };
        });
    };

    mThis.editTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.refreshCurrentView();
            }
        };
        CreateTenantDialog.show(op);
    };

    mThis.viewTenant = (id, btn) => {
        // Implement view functionality
        console.log(`Viewing tenant with ID: ${id}`);
        // You can open a view dialog or navigate to a detail page here
        cv_interact.info(`View functionality for tenant ID: ${id}`);
    };

    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.refreshCurrentView();
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Tenant?', {
            title: 'Delete Tenant',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/tenant/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.refreshCurrentView();
                        cv_interact.success('Tenant deleted successfully');
                    } else {
                        cv_interact.error(res.error_message);
                    }
                });
            }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/tenant/form-options`, null, null, null)
            .then(res => {
                if (typeof onFinish === 'function') onFinish();
            });
    };

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

// Enhanced CardView class with proper pagination
class CardView {
    constructor(containerId, options) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.currentPage = 1;
        this.totalPages = 1;
        this.paginationContainer = null;
        this.lastParams = {};
    }

    showPage(params = {}) {
        this.lastParams = params;
        params.page = this.currentPage;
        params.per_page = this.options.perPage || 12;

        vsapi.call(this.options.fetchApi, params).then(res => {
            if (res.status_code === 200) {
                this.totalPages = res.data.last_page || 1;
                this.render(res.data);
                this.renderPagination(res.data);

                // Call onCardCreated callback after rendering
                if (this.options.onCardCreated) {
                    this.options.onCardCreated(this.container);
                }
            }
        });
    }

    render(data) {
        const items = data.data || [];
        let html = '<div class="row">';

        if (items.length === 0) {
            html += `
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fa-solid fa-users fa-3x text-muted mb-3"></i>
                        <p class="text-muted">No tenants found</p>
                    </div>
                </div>
            `;
        } else {
            items.forEach(item => {
                html += this.options.cardTemplate(item);
            });
        }

        html += '</div>';
        html += '<div class="card-pagination mt-3"></div>';
        this.container.innerHTML = html;
        this.paginationContainer = this.container.querySelector('.card-pagination');
    }

    renderPagination(data) {
        if (!this.paginationContainer || this.totalPages <= 1) return;

        let html = '<nav><ul class="pagination justify-content-center">';

        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= this.totalPages; i++) {
            if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                html += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a>
            </li>
        `;

        html += '</ul></nav>';
        this.paginationContainer.innerHTML = html;

        // Add click handlers
        this.paginationContainer.querySelectorAll('a.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage && page >= 1 && page <= this.totalPages) {
                    this.currentPage = page;
                    this.showPage(this.lastParams);
                }
            });
        });
    }
}

const CreateTenantDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<form>
                    <div class="row justify-content-center">
                        <div class="col-3">
                            <div class="data-input border border-ypg-custom rounded-3 d-flex justify-content-center align-items-center mx-auto" style="width:100px; height:100px;">
                                <div   name="div_tenant_photo"
                                    class="data-input h-100 w-100" 
                                    data-field="photo" 
                                    style="background-image: url('/assets/images/default/placeholder.svg'); background-size: cover; background-position: center;"></div>
                            </div>
                            <label class="mt-2 text-muted small d-block text-center">Profile Photo</label>
                        </div>
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
                            <div class="material-input outlined">
                                <input type="text" name="national_id" required class="data-input form-control" data-field="national_id" placeholder=" " />
                                <label>National ID</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="text" name="passport_number" required class="data-input form-control" data-field="passport_number" placeholder=" " />
                                <label>Passport Number</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;" for="sex">Select Gender</label>
                            <div class="material-input outlined">
                                <select name="sex" placeholder=" " class="data-input form-control" data-field="sex">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
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
                                <input type="email" name="email" required class="data-input form-control" data-field="email" placeholder=" " />
                                <label>Email</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                <label>Address</label>
                            </div>
                        </div>
                    </div>
                </form>`
                ].join("");
            },
            contentCreated: (me) => {
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');
                const btnClose = header.querySelector('button');

                if (btnClose) btnClose.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);
                header.innerHTML = '';
                header.appendChild(headerWrapper);



                const div_tenant_photo = me.controls.div_tenant_photo;
                me.tenantImageBox = new ImageBox(div_tenant_photo, {
                        defaultPhotoName: "default-skill",
                        containerClass: "tenant-profile-container",
                        imgClass: "data-input",
                        dataset: {
                            field: "photo",
                        } /** please set field: photo so that we can use for both Edit and Create easily */,
                        //dataset: { field: "image_url" },
                        beforeDeleteImage: async () => {
                            if (me.dataOptions.id > 0) {
                                const yes = await cv_interact.confirm(
                                    "Are you sure to delete this profile photo?",
                                    { title: "Delete Photo", context: "delete" }
                                );
                                if (yes) {
                                    //delete member's photo from backend
                                    me.deleteProfilePhoto(me.dataOptions.id);
                                    return true;
                                } else 
                                    return false;
                            } else {
                                 //Case of Create new member, just clear photo
                                 me.tenantImageBox.setImage(null);
                            }
                            return true;
                        },
                        //When user browse new photo and loads it in the IMG element
                        onOpenImage: (img) => {
                            if (me.dataOptions.id > 0) {
                                //This is case of Editing Existing member information
                                me.saveProfilePhoto(img, me.dataOptions.id);
                            }
                        },
                        
                    });

                    me.deleteProfilePhoto = (id) => {
                        const p = { id: id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/prm/tenant/profile/photo/delete",
                                ].join(""),
                                p,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.tenantImageBox.setImage(null);
                                    cv_interact.info(
                                        "Profile photo was deleted!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };

                    me.saveProfilePhoto = (photo, id) => {
                        const p = { "photo": photo, "id": id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/prm/tenant/profile/photo/save",
                                ].join(""),
                                p,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.tenantImageBox.setImage(res.data.image_url);
                                    cv_interact.success(
                                        "Profile photo was saved!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };
                   
            },
            prepareFormOptions: {
                createTitle: "Create New Tenant",
                modifyTitle: "Modify Tenant",
                targetProp: "tenant",
                api: {
                    endpoint: [main_view.base_url, "/prm/tenant/form-options"].join(""),
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

            extendMethod: {
                    setData: (me, data) => {
                        // console.log(data);
                        
                        me.tenantImageBox.setImage(data.image_url);
                        
                    }
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
                            op.photo = me.tenantImageBox ? me.tenantImageBox.getImage() : '';
                            vsapi.call([main_view.base_url, "/prm/tenant/create"].join(""), op, btn, null).then((res) => {
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




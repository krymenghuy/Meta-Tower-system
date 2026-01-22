"use strict";

var TenantComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Tenant Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant_");
    mThis.cardViewContainer = mThis.self.querySelector("#_tenant_card_view");
    mThis.listViewContainer = mThis.self.querySelector("#_tenant_list_view");
    mThis.currentViewMode = 'card';

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "photo",
            className: "align-middle",
            data: (data) => `<img class="btn-view-tenant-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/meta/default_tenant.jpg`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px;"/>`,
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
    mThis.renderTenantCard = (data) => {
    const sexLabel =
        data.sex?.toUpperCase() === 'M' ? 'Male' :
        data.sex?.toUpperCase() === 'F' ? 'Female' : 'Other';

    const imageUrl = data.image
        ? `${main_view.base_url}/storage/${data.image}`
        : null;

    return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
        <div class="tenant-card" data-id="${data.id}">
            <div class="card-header position-relative">
                <div class="avatar-wrapper">
                    <div class="avatar">
                        ${
                            imageUrl
                                ? `<img src="${imageUrl}" alt="${data.name}"
                                    class="tenant-avatar-img"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                   <i class="fa-solid fa-user d-none"></i>`
                                : `<i class="fa-solid fa-user"></i>`
                        }
                    </div>
                </div>

                <div class="header-info">
                    <div class="header-info-name">${data.name ?? ''}</div>
                    <div class="tenant-company">${data.legal_name ?? ''}</div>
                </div>

                <div class="menu-btn-wrapper position-absolute top-0 end-0">
                    <a href="javascript:void(0)"
                       class="btn_leave_action"
                       data-id="${data.id}">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>
            </div>

            <div class="card-body">
                <div class="info-row">ID : ${data.national_id ?? 'N/A'}</div>
                <div class="info-row">Phone : ${data.phone_number ?? 'N/A'}</div>
                <div class="info-row">Email : ${data.email ?? 'N/A'}</div>
                <div class="info-row">Address : ${data.address ?? 'N/A'}</div>
            </div>

            <div class="card-footer text-success fw-semibold">
                Active
            </div>
        </div>
    </div>
    `;
};


    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.tenantCardView = new ListView(mThis.cardViewContainer, {
            fetchApi: `${mThis.base_url}/prm/tenant/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                // container.innerHTML = '';
                // let html = '<div class="row">';
                // items.forEach(item => {
                //     html += mThis.renderTenantCard(item);
                // });
                // html += '</div>';
                // container.innerHTML = html;
                mThis.renderTenantCard(container, items);
            },
            listContainerClass: null
        });

        // List View
        mThis.tenantListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${mThis.base_url}/prm/tenant/list-paginate`,
            perPage: 10,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
            }
        });
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

        const cardTab = document.getElementById('tenantViewCard');
        const listTab = document.getElementById('tenantViewList');

        if (cardTab && listTab) {
            cardTab.addEventListener('change', () => {
                mThis.currentViewMode = 'card';
                mThis.renderView();
            });

            listTab.addEventListener('change', () => {
                mThis.currentViewMode = 'list';
                mThis.renderView();
            });
        }

        mThis.renderTenantCard = (div, data) => {
            data = data ?? [];
            // if (!AuthManager) {
            //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
            //     return;
            // }
            AuthManager.init().then((user) => {
                mThis.renderCard(data, user);
            });
        };
   mThis.renderCard = (items) => {

    let html = `<div class="row g-3">`;

    if (Array.isArray(items) && items.length > 0) {

        items.forEach(d => {

            const imageUrl = d.image
                ? `${main_view.base_url}/storage/${d.image}`
                : null;

            html += `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="card tenant-card h-100 shadow-sm border-0" data-id="${d.id}">

                    <!-- Header -->
                    <div class="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-3">
                            <div class="tenant-avatar">
                                ${
                                    imageUrl
                                        ? `<img src="${imageUrl}" alt="${d.name}"
                                            onerror="this.style.display='none'; this.nextElementSibling.classList.remove('d-none');">`
                                        : `<i class="fa-solid fa-user"></i>`
                                }
                                <i class="fa-solid fa-user ${imageUrl ? 'd-none' : ''}"></i>
                            </div>

                            <div class="text-truncate">
                                <div class="fw-semibold text-dark text-truncate">${d.name ?? ''}</div>
                                <div class="text-muted small text-truncate">${d.legal_name ?? ''}</div>
                            </div>
                        </div>

                        <a href="javascript:void(0)"
                           class="text-muted btn_leave_action"
                           data-id="${d.id}">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </a>
                    </div>

                    <!-- Body -->
                    <div class="card-body pt-2 small text-muted">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fa-regular fa-id-card me-2"></i>
                            ${d.national_id ?? 'N/A'}
                        </div>

                        <div class="d-flex align-items-center mb-2">
                            <i class="fa-solid fa-phone me-2"></i>
                            ${d.phone_number ?? 'N/A'}
                        </div>

                        <div class="d-flex align-items-center mb-2 text-truncate">
                            <i class="fa-regular fa-envelope me-2"></i>
                            ${d.email ?? 'N/A'}
                        </div>

                        <div class="d-flex align-items-start text-truncate">
                            <i class="fa-solid fa-location-dot me-2 mt-1"></i>
                            ${d.address ?? 'N/A'}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                        <span class="badge bg-success-subtle text-success">Active</span>
                        <a href="javascript:void(0)" class="text-primary small">
                            View →
                        </a>
                    </div>

                </div>
            </div>
            `;
        });

    } else {

        html += `
        <div class="col-12">
            <div class="alert alert-light border text-center text-danger">
                Tenant not found!
            </div>
        </div>
        `;
    }

    html += `</div>`;

    mThis.cardViewContainer.innerHTML = html;
};

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.renderView();
        });
        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.renderView();
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.renderView = () => {
        const params = mThis.getFilterData();

        if (mThis.currentViewMode === 'card') {
            mThis.cardViewContainer.classList.remove('d-none');
            mThis.listViewContainer.classList.add('d-none');

            mThis.tenantCardView.showPage(params);
        } else {
            mThis.cardViewContainer.classList.add('d-none');
            mThis.listViewContainer.classList.remove('d-none');

            mThis.tenantListView.showPage(params);
        }
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            p[el.dataset.field] = el.value;
        });

        return p;
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
            mThis.renderView();
        });
    };

    return mThis;
})();

   



const CreateTenantDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                <form class="tenant-form row p-1">

                    <!-- Profile Section -->
                        <div class="col-md-4 text-center d-flex flex-column justify-content-center">
                            <div class="tenant-photo-wrapper border border-prm-custom rounded-3 d-flex align-items-center justify-content-center mx-auto"
                                style="width: 210px; height: 140px; cursor: pointer; background-color: #f8f8f8;">
                                <div name="div_tenant_photo"
                                    class="w-100 h-100"
                                    style="background-size: cover; background-position: center;">
                                </div>
                            </div>
                            <small class="text-muted d-block mt-2">Profile Photo</small>
                        </div>
                        <div class="col-md-8 row pb-3">
                            <div class="col-12 col-md-6">
                                <label class="form-label">Full Name</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="name"
                                        class="data-input form-control"
                                        data-field="name"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label">Legal Name</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="legal_name"
                                        class="data-input form-control"
                                        data-field="legal_name"
                                        placeholder=" " />
                                </div>
                            </div>

                            <div class="col-12 col-md-6">
                                <label class="form-label">Phone Number </label>
                                <div class="material-input outlined">
                                    <input type="number"
                                        name="phone_number"
                                        class="data-input form-control"
                                        data-field="phone_number"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label">Email</label>
                                <div class="material-input outlined">
                                    <input type="email"
                                        name="email"
                                        class="data-input form-control"
                                        data-field="email"
                                        placeholder=" " />
                                </div>
                            </div>
                        </div>
                        
                    <!-- Basic Info -->
                    <div class="row g-2 mx-1">
                        <div class="col-12 col-md-4">
                            <label class="form-label">Gender</label>
                            <div class="material-input outlined">
                                <select name="sex"
                                    class="data-input form-control"
                                    data-field="sex">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12 col-md-4">
                            <label class="form-label">National ID</label>
                            <div class="material-input outlined">
                                <input type="text"
                                    name="national_id"
                                    class="data-input form-control"
                                    data-field="national_id"
                                    placeholder=" " />
                            </div>
                        </div>

                        <div class="col-12 col-md-4">
                            <label class="form-label">Passport Number</label>
                            <div class="material-input outlined">
                                <input type="text"
                                    name="passport_number"
                                    class="data-input form-control"
                                    data-field="passport_number"
                                    placeholder=" " />
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label">Upload File</label>
                            <div style="border: 1px solid lightgray; border-radius: 6px;">
                                <input type="file"
                                    name="file_name"
                                    class="data-input form-control"
                                    data-field="file_name" />
                            </div>
                        </div>

                        <div class="col-12 ">
                            <label class="form-label">Address</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control"
                                    data-field="address"
                                    rows="3"
                                    placeholder=" ">
                                </textarea>
                            </div>
                        </div>
                    </div>

                </form>
                `;
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




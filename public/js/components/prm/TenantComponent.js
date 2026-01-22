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
                        <i class="fa-solid fa-ellipsis-vertical text-white fs-5" ></i>
                    </a>
                </div>`
        },
    ];



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
                    html += `
                        <aside class="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <div class="card tenant-card shadow-sm rounded-4 border-0 p-4 text-center" style="background-size: contain;  background-repeat: no-repeat;background-image:url('${d.bg_image ?? '/assets/images/default/bg_card7.jpg'}');">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="status_tenant px-3"> <span>Active</span> </div>
                                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white" style="width:32px;height:32px;">
                                        <div class="">
                                            <a href="javascript:void(0)" class="btn-tenant-dropdown-action" aria-haspopup="true" aria-expanded="false">
                                                <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="avatar-wrapper">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjuoKqwfDiuhAYJ6E7wlc9xrtEi-JtrlhkqnJr6SD4vdfKOer1EIPtrn6Wn3q1aomxXf9PHQb8w9o-DPlr5kjvUIGibK2-e_msAv-FYV7Xx-EvgkAzqtZFUlDDFScFH6JRUStbFX0TlRLEnAnKSlW8TOTDxSUpLXDKQa-MP5gBHYR-n1uuRHxDckGQAfIHKPXK20hjiCvPMRwhAIbuO787sbe7hpNt292QOm6vuOK7uFS74sTthpwN4k6eLwMbrqi2Qy0MMKrYS3xX" alt="Jonathan Miller">
                                    <div class="status-badge">
                                        <i class="fa-solid fa-circle-check fs-4"></i>
                                    </div>
                                </div>
                                <h5>${d.name}</h5>
                                <p class="card-subtitle mb-4">#TEN-88420 • Verified Tenant</p>

                                <div class="text-start mx-auto" style="max-width: 250px;">
                                    <p class="mb-2 text-truncate">
                                        <i class="fa-solid fa-envelope text-muted me-2"></i>
                                        <span>${d.email ?? 'N/A'}</span>
                                    </p>
                                    <p class="mb-2 text-truncate">
                                        <i class="fa-solid fa-phone text-muted me-2"></i>
                                        <span>${d.phone_number ?? 'N/A'}</span>
                                    </p>
                                    <p class="mb-0 text-truncate">
                                       <i class="fa-brands fa-space-awesome text-muted fs-6 me-2"></i>
                                        <span>Unit 502, Meta Tower</span>
                                    </p>
                                </div>
                                <div class="mt-3 d-flex justify-content-between align-items-center">
                                    
                                    <div class="text-start">
                                       <small class="text-muted">Created By</small> <small class="text-muted"> : ${d.update_user}</small>
                                        <!-- <small class="text-muted">Date :</small><small class="text-muted">${d.updated_at}</small>-->
                                    </div>
                                    <div class="text-start"><a href="javascript:void(0)" class="text-primary small">View →</a></div>
                                </div>

                            </div>
                        </aside>
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

         mThis.pr_tbl = mThis.tenantCardView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblTenant = mThis.tenantCardView.getTable();

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.renderView();
        });
        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.renderView();
            }, 250);
        });
        mThis.initDropdownMenus(mThis.cardViewContainer);
        mThis.initAlready = true;
    };

     mThis.initDropdownMenus = (listContainer) => {
        const menuOptopns = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [

                {
                    html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_status",
                },
                {

                    html: '<span class="ps-2 " vslang="titles.Modify Space "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_space",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Space"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_space",
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }

                    case "edit_space": {
                        mThis.editSpace(id, menuLink);
                        break;
                    }
                    case "delete_space": {
                        mThis.deleteSpace(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
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
                <form class="tenant-form">

                    <!-- Profile Section -->
                    <div class="row g-4 align-items-start mb-3">
                        <div class="col-12 col-md-3 text-center">
                            <div class="tenant-photo-wrapper mx-auto">
                                <div name="div_tenant_photo"
                                    class="data-input tenant-photo"
                                    data-field="photo"
                                    style="background-image:url('/assets/images/default/placeholder.svg');">
                                </div>
                            </div>
                            <small class="text-muted d-block mt-2">Profile Photo</small>
                        </div>

                        <div class="col-12 col-md-9">
                            <label class="form-label">Full Name</label>
                            <div class="material-input outlined">
                                <input type="text"
                                    name="name"
                                    class="data-input form-control"
                                    data-field="name"
                                    placeholder=" "
                                    required />
                            </div>
                        </div>
                    </div>

                    <!-- Basic Info -->
                    <div class="row g-3">
                        <div class="col-12 col-md-4">
                            <label class="form-label">Gender</label>
                            <div class="material-input outlined">
                                <select name="sex"
                                    class="data-input form-control"
                                    data-field="sex">
                                    <option value="">Select</option>
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
                            <label class="form-label">Passport Number</label>
                            <div class="material-input outlined">
                                <input type="text"
                                    name="passport_number"
                                    class="data-input form-control"
                                    data-field="passport_number"
                                    placeholder=" " />
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <label class="form-label">Phone Number</label>
                            <div class="material-input outlined">
                                <input type="tel"
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

                        <div class="col-12">
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




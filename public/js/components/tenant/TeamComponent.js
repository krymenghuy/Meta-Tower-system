"use strict";

var TeamComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Team Management";
    this.defaultPage = "team_list";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_team_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTeam");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_team");
    mThis.elSearch = mThis.self.querySelector("#_search_team");
    mThis.elStatus = mThis.self.querySelector("#_el_team_status");
    mThis.btnBack = document.querySelector("#_btn_back_team");
    mThis.divTenantListContainer = mThis.self.querySelector(
        "#_team_list_container",
    );
    mThis.divProfileView = document.querySelector("#_team_profile_view");
    mThis.listViewContainer = mThis.self.querySelector("#_team_list_view");
    this.pages = {
        team_list: this.divTenantListContainer,
        profile_view: this.divProfileView,
    };
    mThis.profile_info_tenant = this.divProfileView.querySelector(
        "#profile_info_team",
    );
    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Photo",
            className: "align-middle",
            data: (data) =>
                `<img class="btn-view-tenant-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/default/placeholder.svg`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px;"/>`,
        },
        {
            transTitle: "titles.Code",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.code ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "_";
                return `
                    <div class="text-prm-custom" style="width:120px;">
                        <span class="text-wrap text-break text-capitalize" style ="word-break:break-word;">${data.name ?? "_"}</span>
                        <span class="d-block text-primary" style="font-size:12px;">${sexLabel}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone_number ?? "_"}</span>
                 <span class="d-block text-primary"><i class="fa-solid text-primary px-1 fa-envelope" style="font-size:12px;"></i> ${data.email ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Position",
            className: "align-middle ",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.position ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle ",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.start_date ?? "_"}</span>`;
            },
        },

        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = data.status;
                let cls =
                    "badge text-warning bg-warning-subtle border border-warning";

                if (status == "Pending") {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                } else if (status === "Inactive") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                } else if (status == "Active") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px"
                        data-status_id="${data.status_id}">
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn-tenant-dropdown-action"
                    data-id="${data.id}"
                    data-statusid="${data.status_id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="cursor: pointer; padding: 8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" ></i>
                    </a>
                </div>`,
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.staffListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/team/list-paginate`,
            perPage: 8,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase text-nowrap",
            rowCreated: (data, index, tr) => {
                // console.log(9090,tr);

                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                mThis.initDropdownMenus(tr);
            },
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.renderView();
                    mThis.staffListView.showPage(mThis.getFilterData());
                },
            };
            CreateTeamDialog.show(op);
        };
        // mThis.btnAdd.onclick = function (e) {
        //     e.preventDefault();
        //     const op = {
        //         id: null,
        //         btn: e.target,
        //         onClose: () => {
        //             mThis.renderView();
        //             mThis.staffListView.showPage(mThis.getFilterData());
        //         },
        //     };
        //     CreateTeamDialog.show(op);
        // };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("team_list", mThis.getFilterData());
        };

        mThis.pr_tbl = mThis.staffListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        };
        mThis.tblTenant = mThis.staffListView.getTable();

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.renderView();
            };
        });
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.renderView();
            }, 250);
        };


        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = (listContainer) => {
        const menuOptions = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.View Details">View Details</span>',
                    icon: `<i class="fa-solid fa-user fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_profile",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify Staff">Modify Staff</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_staff",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Staff">Delete Staff</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_staff",
                },

            ],
            onShow: (me, container) => {
            },

            onClick: (menuLink, id, name) => {;
                switch (name) {
                    case "view_profile": {
                        mThis.showPage("profile_view", { tenant_id: id });
                        break;
                    }

                    case "modify_staff": {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case "delete_staff": {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };
    // mThis.editTenant = (id, menuLink) => {
    //     let op = {
    //         id: id,
    //         btn: menuLink,
    //         onClose: () => {
    //             mThis.renderView();
    //         },
    //     };
    //     CreateTeamDialog.show(op);
    // };

    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "deleted",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/tenant/team/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                mThis.renderView();
                                cv_interact.success("delete_success_tenant");
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.renderStaffCard = (div, data) => {
        data = data ?? [];
        // if (!AuthManager) {
        //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
        //     return;
        // }
        AuthManager.init().then((user) => {
            mThis.renderCard(div, data);
        });
    };
    mThis.renderCard = (container, data) => {
        // console.log(8888, data);
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                /** Backend: status_id 2 means tenant has a currently active contract. */
                const hasContractAlready = Number(d.status_id) === 2;
                const currentUnitCode =
                    hasContractAlready && d.space_code ? d.space_code : "Unit";
                const status = (d.status || "Pending").toLowerCase();
                let statusClass = "";
                switch (status) {
                    case "active":
                        statusClass =
                            "badge text-success bg-success-subtle border border-success";

                        break;
                    case "inactive":
                        statusClass =
                            "badge text-danger bg-danger-subtle border border-danger";

                        break;
                    default:
                        statusClass =
                            "badge text-warning bg-warning-subtle border border-warning";

                        break;
                }
                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:80px;height:80px;">
                                            <img src="${d.image_url || main_view.asset_url + "/images/default/placeholder.svg"}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
                                        </div>
                                        <div class="flex items-start justify-between mb-6">
                                            <span class="fw-semibold text-start mb-1 text-dark text-capitalize">${d.name}</span>
                                            <div class="d-flex align-items-center mt-1 gap-2">
                                                    <span class="${statusClass}" style="min-width:70px; text-transform: capitalize;">${status}</span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                                                <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body text-center" style="background-color:#fbfcfd; padding: 1rem;">
                                <div class="row g-4 py-2 border-bottom border-gray">
                                    <div class="col-5">
                                        <div class="card bg-prm-custom text-center shadow-sm">
                                                <div class="fs-6 py-1 text-gold-custom">${currentUnitCode}</div>
                                        </div>
                                    </div>
                                    <div class="col-1"></div>
                                    <div class="col-6">
                                        ${
                                            hasContractAlready
                                                ? `
                                                <div class="d-flex flex-column text-center gap-1">
                                                    <span class="text-prm-custom fw-semibold">
                                                        Lease Expiry
                                                    </span>
                                                    <small class="text-muted">
                                                        ${d.end_date || d.start_date || "—"}
                                                    </small>
                                                </div>
                                            `
                                                : `
                                                <div class="text-end">
                                                    <a href="javascript:void(0)"
                                                    class="create-tenant-contract fw-semibold"
                                                    data-id="${d.id}" data-name="${d.name}">
                                                        <span class="tool-tip">
                                                            <i class="fa-solid fa-file-circle-plus text-prm-custom fs-6"></i>
                                                            <span class="tool-tiptext fs-6" vslang="titles.Create Contract">Create Contract</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            `
                                        }

                                    </div>
                                </div>
                                <div class="card_container" style="max-width: 250px;">
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-hashtag me-2 text-muted"></i>
                                        <span>${d.code ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-regular fa-calendar me-2 text-muted"></i>
                                        <span>${d.date_of_birth ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-phone me-2 text-muted"></i>
                                        ${d.phone_number || ""}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-at me-2 text-muted"></i>
                                        ${d.email || "_"}
                                    </p>


                                </div>
                            </div>
                                <div class="d-flex justify-content-between rounded-bottom-2 align-items-center px-2 py-2"
                                    style="font-size: 1rem; background-color: #d4d4db; border-top: 1px solid #e2e8f0;">
                                    <span style="color: #64748b; font-size: 0.85rem;">
                                        <span class="small" vslang="titles.Last Updated">Last Updated</span>:
                                        ${d.update_user || "System"}
                                    </span>
                                    <a href="javascript:void(0)" class="text-primary-custom see-tenant-detail  text-decoration-none" style="font-size: 0.85rem;" data-id="${d.id}">
                                        <span vslang="titles.View Details">View Details</span> <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.85rem;"></i>
                                    </a>
                                </div>

                        </div>
                    </div>
                    `;
            });
        } else {
            html += `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    No tenants found
                </div>
            </div>`;
        }
        html += `</div>`;
        container.innerHTML = html;
        LocaleManager.translateZone(container);

        const seeProfileInfo =
            mThis.cardViewContainer.querySelectorAll(".see-tenant-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                mThis.showPage("profile_view", tenantId);
            });
        });

        const createContract = mThis.cardViewContainer.querySelectorAll(
            ".create-tenant-contract",
        );
        const container_te = mThis.cardViewContainer;
        const te_parent = container_te;
        te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        te_parent.classList.add("overflow-y-auto");
        te_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };
    };

    mThis.renderView = () => {
        mThis.staffListView.showPage(mThis.getFilterData());
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });

        return p;
    };
    mThis.getPageContainer = (pageName) => {
        return mThis.pages[pageName];
    };
    mThis.showPage = async (pageName, op = {}) => {
        if (this.self.style.display !== "block") {
            main_view.setContentView(this.self, this.title_prop);
        }
        switch (pageName) {
            case "team_list": {
                mThis.currentPage = "team_list";
                mThis.renderView();
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [main_view.base_url, "/prm/tenant/team/details"].join(""),
                    p,
                    false,
                    null,
                );
                const data = res.data || {};
                mThis.renderProfile(data);
                break;
            }
            default: {
                return;
            }
        }
        const targetPage = mThis.getPageContainer(pageName);
        const siblings = Array.from(targetPage.parentElement.children);
        // Hide all siblings smoothly
        siblings.forEach((div) => {
            if (div !== targetPage && div.style.display !== "none") {
                div.style.display = "none";
            }
        });
        targetPage.style.display = "block";
    };
    mThis.renderProfile = (data) => {
        // console.log(123, data);

        let cls_class = "";
        if (data && data.status) {
            switch (data.status) {
                case "Pending":
                    cls_class =
                        "badge text-warning bg-warning-subtle border border-warning";
                    break;
                case "Active":
                    cls_class =
                        "badge text-success bg-success-subtle border border-success";
                    break;
                case "Inactive":
                    cls_class =
                        "badge text-danger bg-danger-subtle border border-danger";
                    break;
                default:
                    cls_class = "badge text-muted bg-light";
                    break;
            }
        }
        let html = `
        <div class="row g-4 d-flex align-items-stretch"> <div class="col-12 col-lg-3">
                <div class="card shadow-sm mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column">
                        <div class="position-relative d-inline-block mb-3">
                            <img src="${data.image_url || `${main_view.base_url}/assets/images/default/placeholder.svg`}"
                                class="rounded-circle border shadow-sm"
                                width="140" height="140"
                                style="object-fit: cover; object-position: center;">
                        </div>
                        <h4 class="fw-bold mb-2 text-capitalize">${data.name}</h4>
                        <div class="mb-3">
                            <span class="${cls_class} px-3 py-2">${data.status}</span>
                        </div>
                        <hr class="my-3">

                        <div class="mt-auto">
                            <div class="row g-3 text-center">
                                <div class="col-6">
                                    <div class="p-3 bg-light rounded">
                                        <div class="text-muted small" vslang="labels.ID">ID</div>
                                        <div class="">${data.code ?? "_"}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-light rounded">
                                        <div class="text-muted small" vslang="labels.Unit">Unit</div>
                                        <div class="">${data.space_code ?? "_"}</div>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <div class="p-3 bg-light rounded text-center">
                                        <h6 class="mb-3" vslang="labels.Lease Terms">Lease Terms</h6>
                                        <div class="row text-center">
                                            <div class="col-6 border-end border-info">
                                                <div class="text-muted mb-1 small" vslang="labels.Start Date">Start Date</div>
                                                <div class="small">${data.start_date ?? "_"}</div>
                                            </div>
                                            <div class="col-6">
                                                <div class="text-muted mb-1 small" vslang="labels.End Date">End Date</div>
                                                <div class="small">${data.end_date ?? "_"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-9">
                <div class="card shadow-sm h-100"> <div class="card-header bg-white">
                        <ul class="nav nav-tabs card-header-tabs" id="tenantTabs">
                            <li class="nav-item">
                                <a class="nav-link active fw-semibold" href="#overview_tenant_detail"><span vslang="titles.Overview">Overview</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-semibold" href="#lease_tenant_history"><span vslang="titles.Contract">Contract</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-semibold" href="#document_staff_list"><span vslang="titles.Document">Documents</span></a>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body tab-content">
                        <div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <h5 class="fw-bold mb-2 d-flex align-items-center">
                                <i class="fa fa-user me-2 text-primary"></i> <span vslang="titles.Personal Information">Personal Information</span> 
                            </h5>
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="text-capitalize">${data.name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Gender</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class=" text-primary">${data.phone_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                            

                        </div>

                        <div class="tab-pane" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2 d-flex align-items-center">
                                <i class="fa fa-file-text me-2 text-primary"></i> <span vslang="titles.Contract">Contract</span>
                            </h5>
                            <div class="container py-4 position-relative overflow-auto lease-history-scroll" style="max-height: 360px; scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;">
                                <p class="text-muted small mb-0">Open this tab to load contracts.</p>
                            </div>
                        </div>

                        <div class="tab-pane" id="document_staff_list">
                            <h5 class="fw-bold mb-4 d-flex align-items-center">
                                <i class="fa fa-folder me-2 text-primary"></i> <span vslang="titles.Documents">Documents</span>
                            </h5>
                            <div class="table-responsive">
                                <table class="table align-middle">
                                    <thead class="bg-light">
                                        <tr class="text-uppercase">
                                            <th class="border-0 ps-3" style="letter-spacing: 0.05em;">Type</th>
                                            <th class="border-0">File Name</th>
                                            <th class="border-0">File Type</th>
                                            <th class="border-0">Remark</th>
                                            <th class="border-0 text-start">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-bottom">
                                            <td class="ps-3 py-3">
                                                <div class="fw-bold text-dark">${data.document_type_id ?? ""}</div>
                                            </td>
                                            <td><div class="fw-bold text-dark">${data.original_file_name ?? ""}</div></td>
                                            <td><div class="fw-semibold text-dark">${data.ext ?? ""}</div></td>
                                            <td><span class="text-muted small">${data.remarks ?? ""}</span></td>
                                            <td class="text-end pe-3">
                                                <button class="btn btn-sm text-muted p-0 ">
                                                    <i class="fa-solid fa-ellipsis fa-shake"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        mThis.profile_info_tenant.innerHTML = html;

        // ===== Tabs JS =====
        const tabLinks =
            mThis.profile_info_tenant.querySelectorAll("#tenantTabs a");
        const tabPanes =
            mThis.profile_info_tenant.querySelectorAll(".tab-pane");

        tabLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("href").replace("#", "");

                // remove active class
                tabLinks.forEach((l) => l.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                link.classList.add("active");
                const profile_info_tenant =
                    mThis.profile_info_tenant.querySelector(`#${target}`);

                profile_info_tenant.classList.add("active");
                mThis.renderOverView(profile_info_tenant, target, data);
            });
        });
        LocaleManager.translateZone(mThis.profile_info_tenant);

        mThis.setActionsProfileInfo(mThis.profile_info_tenant);
    };
    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };
    mThis._fmtMoney = (n) => {
        if (n == null || n === "") return "—";
        const x = Number(n);
        if (Number.isNaN(x)) return String(n);
        return x.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };
    mThis._getUnitCode = (row, fallback = "—") => {
        if (!row) return fallback;
        const value =
            row.unit_code ??
            row.space_code ??
            row.unit ??
            row.code ??
            row.unit_number;
        return value == null || value === "" ? fallback : value;
    };
    mThis._leaseHistoryContractsHtml = (renewalEntriesRaw) => {
        const entries = Array.isArray(renewalEntriesRaw)
            ? renewalEntriesRaw
            : [];
        if (!entries.length) {
            return `<div class="text-center py-5 text-muted">
                <i class="fa fa-file-text fa-2x mb-2 opacity-50 d-block"></i>
                <p class="mb-0">No contract recorded for this tenant.</p>
            </div>`;
        }

        // Group by contract_id so we render one card per contract.
        const groupsByContractId = new Map();
        entries.forEach((e) => {
            const cid = e.contract_id ?? "0";
            if (!groupsByContractId.has(cid)) groupsByContractId.set(cid, []);
            groupsByContractId.get(cid).push(e);
        });

        let cards = "";
        groupsByContractId.forEach((group) => {
            if (!group.length) return;
            const first = group[0];

            const contractStatusName = String(
                first.contract_status ?? "",
            ).trim();
            const contractStatusLower = contractStatusName.toLowerCase();

            // const hasCurrent = group.some((r) => !!r.is_current);

            let accent = "#adb5bd";
            let circleBg = "#6c757d";
            let headerBadgeHtml = "";
            let priceColor = "#212529";
            let depositBadgeStyle =
                "color:#3f51d8;background-color:#e7efff;border:1px solid #cfdbff;";

            if (contractStatusLower === "active") {
                accent = "#0f49bd";
                circleBg = "#0f49bd";
                priceColor = "#3f51d8";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">CURRENT</span>`;
            } else if (contractStatusLower === "pending") {
                accent = "#fd7e14";
                circleBg = "#fd7e14";
                priceColor = "#fd7e14";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#fd7e14;">PENDING</span>`;
            } else if (contractStatusLower === "terminated") {
                accent = "#dc3545";
                circleBg = "#dc3545";
                priceColor = "#dc3545";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#dc3545;">TERMINATED</span>`;
            } else {
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 ms-1" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${mThis._escapeHtml(contractStatusName || "—")}</span>`;
            }

            const start = mThis._escapeHtml(first.contract_start_date ?? "");
            const end = mThis._escapeHtml(first.contract_end_date ?? "");
            const title = `${LocaleManager.trans("Contract", "titles")} : ${start} — ${end}`;

            const unitPart = mThis._escapeHtml(mThis._getUnitCode(first, "—"));
            const sqmPart =
                first.sqm_size != null && first.sqm_size !== ""
                    ? `${mThis._fmtMoney(first.sqm_size)} m²`
                    : "—";
            const bldg = first.building_name
                ? mThis._escapeHtml(first.building_name)
                : "";
            const detailPillsHtml = `
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${LocaleManager.trans("unit", "titles")} ${unitPart}</span>
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${sqmPart}</span>
                    ${bldg ? `<span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${bldg}</span>` : ""}
                </div>`;

            const priceNum = Number(first.price ?? 0);
            const sqmNum = Number(first.space_sqm_size ?? first.sqm_size ?? 0);
            const isTotalPriceType =
                String(first.price_type ?? "sqm").toLowerCase() === "total";
            const totalPriceNum = isTotalPriceType
                ? priceNum
                : sqmNum > 0
                  ? priceNum * sqmNum
                  : null;
            const priceLine =
                totalPriceNum != null && !Number.isNaN(totalPriceNum)
                    ? `${VSMoney.formatAmount(totalPriceNum, "USD")}`
                    : "—";
            const depositSmallHtml =
                first.deposit != null && first.deposit !== ""
                    ? `Deposit ${VSMoney.formatAmount(first.deposit, "USD")}`
                    : "";
            if (first.deposit_remarks) {
                depositSmallHtml = dep
                    ? `${depositSmallHtml} <span class="text-muted">• ${mThis._escapeHtml(first.deposit_remarks)}</span>`
                    : `<span class="text-muted">${mThis._escapeHtml(first.deposit_remarks)}</span>`;
            }
            const depositBadgeHtml = depositSmallHtml
                ? `<span class="badge rounded-2 px-3 py-2" style="${depositBadgeStyle}">${depositSmallHtml}</span>`
                : "";

            const renewalsTableRowsHtml = group
                .map((r) => {
                    const isInitial = !!r.is_initial;
                    const renewalDate = r.renewal_date
                        ? mThis._escapeHtml(r.renewal_date)
                        : isInitial
                          ? "Initial"
                          : "—";

                    const rowStart = mThis._escapeHtml(
                        r.renewal_start_date ?? "—",
                    );
                    const rowEnd = mThis._escapeHtml(r.renewal_end_date ?? "—");

                    const rowUnitCode = mThis._escapeHtml(
                        mThis._getUnitCode(first, "—"),
                    );
                    const currentBadgeHtml = r.is_current
                        ? `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">Current</span>`
                        : "";

                    const remarks =
                        r.remarks != null && r.remarks !== ""
                            ? mThis._escapeHtml(r.remarks)
                            : "—";

                    const updatedBy = r.update_user
                        ? `${mThis._escapeHtml(r.update_user)}${r.updated_at ? ` • ${mThis._escapeHtml(r.updated_at)}` : ""}`
                        : "—";

                    return `<tr class="${r.is_current ? "table-prm-current-row" : ""}">
                        <td class="text-nowrap">${renewalDate}</td>
                        <td class="text-nowrap">${rowStart}</td>
                        <td class="text-nowrap">${rowEnd}</td>
                        <td class="text-nowrap">
                            <span class="fw-semibold text-prm-custom">${rowUnitCode}</span>
                            ${currentBadgeHtml}
                        </td>
                        <td>${remarks}</td>
                        <td class="text-nowrap">${updatedBy}</td>
                    </tr>`;
                })
                .join("");

            const renewalsCount = group.length;

            cards += `<div class="d-flex position-relative mb-4">

                <div class="flex-grow-1 ms-3">
                    <div class="card shadow-sm" style="border-left: 6px solid ${accent};border-radius: 14px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between flex-column flex-md-row mb-3">
                                <div>
                                    <h5 class="card-title mb-1">${title} ${headerBadgeHtml}</h5>
                                    ${detailPillsHtml}
                                </div>
                                <div class="text-end mt-2 mt-md-0">
                                    <small class="text-muted d-block mb-1" vslang="labels.Monthly">Monthly</small>
                                    <p class="h5 mb-0" style="color:${priceColor};">${priceLine}</p>
                                    <div class="mt-2">${depositBadgeHtml}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        return cards;
    };


    mThis.setActionsProfileInfo = (divProfile) => {
        divProfile.addEventListener("click", (e) => {
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/tenant/team/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.statuses,
                    "id",
                    "name",
                    "",
                    "All Statuses",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            // main_view.setContentView(mThis.self, mThis.title_prop);
            // mThis.renderView();
            mThis.showPage(mThis.defaultPage, mThis.getFilterData());
        });
    };

    return mThis;
})();

const CreateTeamDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12 col-md-8">
                            <div class="vs-material-field">
                                <input type="text" 
                                       name="team_name" 
                                       class="data-input form-control" 
                                       data-field="team_name" 
                                       placeholder=" " 
                                       required />
                                <label vslang="labels.Team Name">Team Name</label>
                            </div>
                        </div>
                        
                        <div class="col-12 col-md-4">
                            <div class="vs-material-field">
                                <input type="number" 
                                       name="member_count" 
                                       class="data-input form-control" 
                                       data-field="member_count" 
                                       placeholder=" " 
                                       min="1" />
                                <label vslang="labels.Member Count">Member Count</label>
                            </div>
                        </div>         
                        <input type="hidden" name="space_id" data-field="space_id" class="data-input" />
                    </div>
                `;
            },

            prepareFormOptions: {
                createTitle: "vslang:titles.Create New Team",
                modifyTitle: "vslang:titles.Modify Team",
                targetProp: "team",
                api: {
                    endpoint: `${main_view.base_url}/prm/tenant/team/form-options`,
                    params: (op) => ({ id: op.id })
                }
            },

            onPrepareForm: (me, data) => {
                // Pre-fill hidden fields if passed from parent
                if (op.tenant_id) {
                    me.controls.tenant_id.value = op.tenant_id;
                }
                
            },


            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const formData = me.getData();
                        
                        vsapi.call(
                            `${main_view.base_url}/prm/tenant/team/save`,
                            formData,
                            btn,
                            null
                        ).then((res) => {
                            if (res.status_code === 200) {
                                const newTeamId = res.data?.id || null;
                                me.hide(true, formData, newTeamId);

                                if (formData.id > 0) {
                                    cv_interact.success("update_success_team");
                                } else {
                                    cv_interact.success("create_success_team");
                                }
                            } else {
                                cv_interact.error(res.error_message || "Failed to save team");
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


const CreateTeamMemberDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal ",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                <div class="tenant-form row">
                    <div class="col-12 col-md-3 d-flex justify-content-center">
                        <div id="tenant-profile-container" class="tenant-profile-container d-flex align-items-center justify-content-center" >
                            <div id="tenant-upload-zone" class="tenant-image-card">
                                <input type="file" name="documents" class="data-input form-control" data-field="documents" accept=".png,.jpg,.jpeg" style="display: none;" />
                                <button type="button" id="btn_chooseFile" class="upload-trigger-area">
                                    <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </button>
                            </div>

                            <div id="tenant-preview-zone" class="tenant-image-card d-none">
                                <button type="button" id="btn_removeFile" class="close-badge-btn" aria-label="Remove image">
                                    <span class="close-icon">&times;</span>
                                </button>
                                <div class="preview-crop-box">
                                    <img id="tenant-preview-img" src="" alt="Tenant Profile" />
                                </div>
                                <input type="text" name="documents_display" id="documents_display" class="d-none" readonly />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-9 row align-content-between flex-wrap" > 
                            <div class="col-12 col-md-6 ">
                                <div class="vs-material-field">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder="" />
                                    <label vslang="labels.Full Name">Full Name</label>
                                </div>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <select data-style="material" name="sex" class="data-input form-control" data-field="sex" placeholder="Gender">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                    <label vslang="labels.Start Date">Start Date</label>
                                </div>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" data-field="date_of_birth" placeholder=" " />
                                    <label vslang="labels.Date of Birth">Date of Birth</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 d-none">
                                <select data-style="material" name="tenant_type" class="data-input form-control" data-field="tenant_type" placeholder="Tenant Type">
                                    <option value="1">Premium</option>
                                    <option value="2">Standard</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="legal_name" class="data-input form-control" data-field="legal_name" placeholder=" " />
                                    <label vslang="labels.Legal Name">Legal Name</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6" >
                                <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" placeholder="Nationality"></select>
                            </div>
                    </div>
                    <div class="col-12 row g-2"> 
                        <div class="col-12 col-md-6">
                            <div class="vs-material-field">
                                <input type="text" name="position" class="data-input form-control" data-field="position" placeholder=" " />
                                <label vslang="labels.Position">Position</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="vs-material-field">
                                <input type="text" name="national_id" class="data-input form-control" data-field="national_id" placeholder=" " />
                                <label vslang="labels.National ID">National ID</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-3 pt-2">
                            <div class="vs-material-field">
                                <input type="text" name="unit_id" class="data-input form-control" data-field="unit_id" placeholder=" " />
                                <label vslang="labels.Unit">Unit</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-3 pt-2">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="nid_issue_date" class="data-input form-control form_input" data-field="nid_issue_date" placeholder=" " />
                                <label vslang="labels.Issue Date">Issue Date</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="text" name="passport_number" class="data-input form-control" data-field="passport_number" placeholder=" " />
                                <label vslang="labels.Passport">Passport Number</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="number" name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " />
                                <label vslang="labels.Phone Number">Phone Number</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                <label vslang="labels.Email">Email</label>
                            </div>
                        </div>
                    <div class="col-12 pt-2">
                        <div class="vs-material-field">
                            <textarea name="address" class="data-input form-control" data-field="address" rows="3" placeholder=" "></textarea>
                            <label vslang="labels.Address">Address</label>
                        </div>
                    </div>

                </div>
                `;
                },

                contentCreated: (me) => {
                    me.uploadInput = me.divModal.querySelector(
                        'input[name="documents"]',
                    );
                    me.uploadZone = me.divModal.querySelector(
                        "#tenant-upload-zone",
                    );
                    me.previewZone = me.divModal.querySelector(
                        "#tenant-preview-zone",
                    );
                    me.previewImg = me.divModal.querySelector(
                        "#tenant-preview-img",
                    );
                    me.displayInput =
                        me.divModal.querySelector("#documents_display");

                    me.controls.btn_chooseFile =
                        me.divModal.querySelector("#btn_chooseFile");
                    me.controls.btn_removeFile =
                        me.divModal.querySelector("#btn_removeFile");

                    me.fileBase64 = null;
                    me.ext = null;

                    me.renderTenantImage = () => {
                        console.log(1, me.dataOptions.id);
                        console.log(2, me.fileBase64);

                        const src = new URL(me.previewImg.src).pathname
                            .split("/")
                            .pop();

                        console.log(3, src);

                        if (me.dataOptions.id == null && me.fileBase64) {
                            console.log(4, "start if");

                            me.uploadZone.classList.add("d-none");
                            me.previewZone.classList.remove("d-none");
                        } else if (
                            me.dataOptions.id == null &&
                            !me.fileBase64
                        ) {
                            console.log(4, "start else if 1");

                            me.uploadZone.classList.remove("d-none");
                            me.previewZone.classList.add("d-none");
                            me.uploadInput.value = "";
                            if (me.displayInput) me.displayInput.value = "";
                            if (me.previewImg) me.previewImg.src = "";
                        } else if (
                            me.dataOptions.id > 0 &&
                            !me.fileBase64 &&
                            src == "placeholder.svg"
                        ) {
                            console.log(4, "start else if 2");

                            me.uploadZone.classList.remove("d-none");
                            me.previewZone.classList.add("d-none");
                            me.uploadInput.value = "";
                            if (me.displayInput) me.displayInput.value = "";
                            if (me.previewImg) me.previewImg.src = "";
                        } else {
                            console.log(4, "start else");

                            me.uploadZone.classList.add("d-none");
                            me.previewZone.classList.remove("d-none");
                        }
                    };

                    me.controls.btn_chooseFile.onclick = () => {
                        me.uploadInput.click();
                    };
                    me.previewImg.style.cursor = "pointer";
                    me.previewImg.title = "Click to change photo";
                    me.previewImg.onclick = () => {
                        me.uploadInput.click();
                    };

                    me.uploadInput.addEventListener("change", (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const extension = file.name
                                .split(".")
                                .pop()
                                .toLowerCase();

                            if (!["jpg", "jpeg", "png"].includes(extension)) {
                                cv_interact.error(
                                    "Please select a valid image file (.jpg, .jpeg, .png)",
                                );
                                return;
                            }

                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const fullResult = event.target.result;

                                me.fileBase64 = null;

                                me.fileBase64 = fullResult.split(",")[1];
                                let detectedExt = fullResult
                                    .split(";")[0]
                                    .split(":")[1];
                                me.ext = detectedExt.split("/")[1];

                                me.previewImg.src = fullResult;
                                me.displayInput.value = file.name;

                                me.renderTenantImage();

                                if (me.dataOptions.id > 0) {
                                    me.saveProfilePhoto(
                                        fullResult,
                                        me.dataOptions.id,
                                    );
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    });

                    me.controls.btn_removeFile.onclick = async () => {
                        if (me.dataOptions.id > 0) {
                            const yes = await cv_interact.confirm(
                                "Are you sure to delete this profile photo?",
                                { title: "Delete Photo", context: "delete" },
                            );
                            if (yes) {
                                me.deleteProfilePhoto(me.dataOptions.id);
                            }
                        } else {
                            me.fileBase64 = null;
                            me.ext = null;
                            me.renderTenantImage();
                        }
                    };

                    me.deleteProfilePhoto = (id) => {
                        const p = { id: id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/prm/tenant/team/profile/photo/delete",
                                ].join(""),
                                p,
                                false,
                                false,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.fileBase64 = null;
                                    me.ext = null;
                                    me.renderTenantImage();
                                    cv_interact.success(
                                        "Profile photo was deleted!",
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };

                    me.saveProfilePhoto = (photo, id) => {
                        const p = { photo: photo, id: id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/prm/tenant/team/profile/photo/save",
                                ].join(""),
                                p,
                                false,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    cv_interact.success(
                                        "Profile photo was saved!",
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };
                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "nationality",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create New Staff",
                    modifyTitle: "vslang:titles.Modify Staff",
                    targetProp: "staff",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/tenant/team/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    me.renderTenantImage();
                    // console.log(6666666, me);
                    if (me.dataOptions.phone_number) {
                        me.controls.name.value = me.dataOptions.name;
                        me.controls.phone_number.value =
                            me.dataOptions.phone_number;
                        me.controls.email.value = me.dataOptions.email;
                    }
                },

                extendMethod: {
                    setData: (me, data) => {
                        if (me.dataOptions.id > 0) {
                            if (data && data.image_url) {
                                me.previewImg.src = data.image_url;
                                me.fileBase64 = data.image_url;
                            }
                        }
                    },
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            op.photo = me.fileBase64 ? me.previewImg.src : "";

                            // Normalize date fields to YYYY-MM-DD before sending
                            // (date picker may output "01-May-2026" / "DD-MMM-YYYY" format)
                            ["start_date", "date_of_birth", "nid_issue_date"].forEach((f) => {
                                if (op[f]) {
                                    const d = new Date(op[f]);
                                    if (!isNaN(d.getTime())) {
                                        const y = d.getFullYear();
                                        const m = String(d.getMonth() + 1).padStart(2, "0");
                                        const day = String(d.getDate()).padStart(2, "0");
                                        op[f] = `${y}-${m}-${day}`;
                                    }
                                }
                            });

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/tenant/team/create",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        const newTenantId =
                                            res.data?.id || null;
                                        me.hide(true, op, newTenantId);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_tenant");
                                            me.previewZone.classList.add(
                                                "d-none",
                                            );
                                        } else {
                                           cv_interact.success("create_success_tenant");
                                            me.previewZone.classList.add(
                                                "d-none",
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                        // me.fileData = null;
                                        if (me.controls?.documents) {
                                            me.controls.documents.value = "";
                                            me.controls.documents.classList.add(
                                                "d-none",
                                            );
                                        }
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


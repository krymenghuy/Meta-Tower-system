"use strict";

var TenantComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Tenant Management";
    this.defaultPage = "tenant_list";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.btnDocument = mThis.self.querySelector("#_btnDocument");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant_");
    mThis.elStatus = mThis.self.querySelector("#_el_tenant_status");
    mThis.btnBack = document.querySelector("#_btn_back_tenant");
    mThis.divTenantListContainer = mThis.self.querySelector(
        "#_tenant_list_container",
    );
    mThis.divProfileView = document.querySelector("#_ten_profile_view");
    mThis.cardViewContainer = mThis.self.querySelector("#_tenant_card_view");
    mThis.listViewContainer = mThis.self.querySelector("#_tenant_list_view");
    mThis.currentViewMode = "card";
    mThis.paginationContainer = mThis.self.querySelector(
        "#tenant_card_container_pagination",
    );
    this.pages = {
        tenant_list: this.divTenantListContainer,
        profile_view: this.divProfileView,
    };
    mThis.profile_info_tenant = this.divProfileView.querySelector(
        "#profile_info_tenant",
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
                return `<span class="text-prm-custom text-nowrap">${data.code ?? ""}</span>`;
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
                          : "Other";
                return `
                    <div class="text-prm-custom" style="width:120px;">
                        <span class="text-wrap text-break text-capitalize" style ="word-break:break-word;">${data.name ?? ""}</span>
                        <span class="d-block text-primary" style="font-size:12px;">${sexLabel}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Date of Birth",
            className: "align-middle ",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.date_of_birth ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.National ID",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.national_id ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Passport",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom text-nowrap">${data.passport_number ?? "_"}</span>`;
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
        mThis.tenantCardView = new ListView(mThis.cardViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            renderItems: (items, container) => {
                mThis.renderTenantCard(container, items);
            },
            listContainerClass: null,
        });
        mThis.tenantListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
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
                    mThis.tenantListView.showPage(mThis.getFilterData());
                },
            };
            CreateTenantDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("tenant_list", mThis.getFilterData());
        };
        const cardTab = document.getElementById("tenantViewCard");
        const listTab = document.getElementById("tenantViewList");
        if (cardTab && listTab) {
            cardTab.addEventListener("change", () => {
                mThis.currentViewMode = "card";
                mThis.renderView();
            });

            listTab.addEventListener("change", () => {
                mThis.currentViewMode = "list";
                mThis.renderView();
            });
        }
        mThis.pr_tbl = mThis.tenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        };
        mThis.tblTenant = mThis.tenantListView.getTable();

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
                    html: '<span class="ps-2">View Details</span>',
                    icon: `<i class="fa-solid fa-user fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_profile",
                },
                {
                    html: '<span class="ps-2">Modify Tenant</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_tenant",
                },
                {
                    html: '<span class="ps-2">Delete Tenant</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant",
                },
                {
                    html: '<span class="ps-2">Upload Document</span>',
                    icon: `<i class="fa-solid fa-file-upload fs-5 text-muted"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "upload_document",
                },
                {
                    html: '<span class="ps-2">Create Contract</span>',
                    icon: `<i class="fa-solid fa-file-contract fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract",
                },
                {
                    html: '<span class="ps-2">Service Requests</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "service_request",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                // console.log(123456, status_id);

                // menu.edit_student.style.display = enroll_finalized == 1 ? 'none' : 'block';
                menu.create_contract.style.display =
                    Number(status_id) !== 2 ? "block" : "none";
                menu.service_request.style.display = "none";
                // menu.upload_document.style.display =status_id == 1 || status_id == 2  ? "block" : "none";
            },
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_profile": {
                        mThis.showPage("profile_view", { tenant_id: id });
                        break;
                    }
                    case "create_contract": {
                        mThis.createContract(id, menuLink);
                        break;
                    }
                    case "upload_document": {
                        mThis.uploadDocument(id, menuLink);
                        break;
                    }
                    case "modify_tenant": {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case "delete_tenant": {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    case "service_request": {
                        mThis.serviceRequest(id, menuLink);
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
    mThis.editTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateTenantDialog.show(op);
    };
    mThis.serviceRequest = (id, menuLink) => {
        let op = {
            id: null, // id
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateServiceRequestDialog.show(op);
    };
    mThis.createContract = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        ContractDialog.show(op);
    };
    mThis.uploadDocument = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        console.log(111, op);

        TenantDocumentDialog.show(op);
    };
    mThis.renewContract = (id, menuLink) => {
        let op = {
            id: null,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // renewDialog.show(op);
        alert("coming soon!");
    };
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
            "Delete this Tenant?",
            {
                title: "Delete Tenant",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/tenant/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                mThis.renderView();
                                cv_interact.success("Tenant has been deleted.");
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.renderTenantCard = (div, data) => {
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
        console.log(8888, data);
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
                                        <div class="flex-shrink-0"> <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
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
                                                            <span class="tool-tiptext fs-6">Create Contract</span>
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
                                        Last Updated :  ${d.update_user || "System"}
                                    </span>

                                    <a href="javascript:void(0)"
                                    class="text-primary-custom see-tenant-detail  text-decoration-none" style="font-size: 0.85rem;"
                                    data-id="${d.id}">
                                        View Details <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.85rem;"></i>
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
        const seeProfileInfo =
            mThis.cardViewContainer.querySelectorAll(".see-tenant-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                mThis.showPage("profile_view", tenantId);
                //const employeeData = data.find((emp) => emp.id == employeeId);
                // if (employeeData) {
                //     let sub_content = mThis.self.querySelector("#sub_content");
                //     sub_content.classList.add("d-none");
                //     let view_see_info =
                //         mThis.self.querySelector("#view_see_info__");
                //     view_see_info.classList.remove("d-none");

                //     mThis.renderProfile(employeeData);
                //     mThis.renderCardCenter(employeeId);
                //     mThis.renderCardLeft(employeeId);
                //     mThis.renderCardRight(employeeId);
                //     mThis.renderCardTaxAllowance(employeeId);
                //     mThis.renderEmpDocuments(employeeId);
                // } else {
                //     console.error(
                //         "Employee data not found for ID:",
                //         employeeId
                //     );
                // }
            });
        });

        const createContract = mThis.cardViewContainer.querySelectorAll(
            ".create-tenant-contract",
        );
        createContract.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                const op = {
                    id: null,
                    tenant_id: tenantId,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.renderView();
                    },
                };
                ContractDialog.show(op);
            });
        });
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
        const params = mThis.getFilterData();

        if (mThis.currentViewMode === "card") {
            mThis.cardViewContainer.classList.remove("d-none");
            mThis.listViewContainer.classList.add("d-none");
            mThis.paginationContainer.style.display = "block";
            mThis.tenantCardView.showPage(params);
        } else {
            mThis.cardViewContainer.classList.add("d-none");
            mThis.listViewContainer.classList.remove("d-none");
            mThis.paginationContainer.style.display = "none";
            mThis.tenantListView.showPage(params);
        }
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
    mThis.openTenantDocument = async (id, mode = "view") => {
        const res = await vsapi.call(
            [main_view.base_url, "/prm/tenant/document/download"].join(""),
            { id },
            false,
            null,
        );
        if (res.status_code !== 200) {
            cv_interact.error(res.error_message || "Failed to open document.");
            return;
        }
        const { data_url, file_name } = res.data || {};
        if (!data_url) {
            cv_interact.error("Document URL is missing.");
            return;
        }
        if (mode === "download") {
            const a = document.createElement("a");
            a.href = data_url;
            a.download = file_name || "document";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }
        const extFromName = (file_name || "").split(".").pop();
        const ext = String(
            (res.data && res.data.ext) || extFromName || "",
        ).toLowerCase();

        const overlay = document.createElement("div");
        overlay.style.cssText =
            "position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:pointer;";

        const wrapper = document.createElement("div");
        wrapper.style.cssText =
            "position:relative; max-width:90vw; max-height:90vh;";

        const isImage = ["png", "jpg", "jpeg"].includes(ext);
        const isPdf = ext === "pdf";

        if (isImage) {
            const img = document.createElement("img");
            img.src = data_url;
            img.style.cssText =
                "max-width:100%; max-height:90vh; border-radius:8px; box-shadow:0 4px 32px #000;";
            wrapper.appendChild(img);
        } else if (isPdf) {
            const iframe = document.createElement("iframe");
            iframe.src = data_url;
            iframe.style.cssText =
                "width:80vw; height:85vh; border:none; border-radius:8px;";
            wrapper.appendChild(iframe);
        } else {
            window.open(data_url, "_blank");
            return;
        }

        const btnClose = document.createElement("button");
        btnClose.style.cssText =
            "position:absolute; top:-16px; right:-16px; border:none; background:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer; line-height:1;";
        btnClose.innerHTML = "&times;";
        btnClose.onclick = (e) => {
            e.stopPropagation();
            document.body.removeChild(overlay);
        };

        wrapper.appendChild(btnClose);
        overlay.appendChild(wrapper);
        overlay.onclick = () => document.body.removeChild(overlay);
        document.body.appendChild(overlay);
    };
    mThis.showPage = async (pageName, op = {}) => {
        if (this.self.style.display !== "block") {
            main_view.setContentView(this.self, this.title_prop);
        }
        switch (pageName) {
            case "tenant_list": {
                mThis.currentPage = "tenant_list";
                mThis.renderView();
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [main_view.base_url, "/prm/tenant/details"].join(""),
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
        console.log(123, data);

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
                                        <div class="text-muted small">ID</div>
                                        <div class="">${data.code ?? "_"}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-light rounded">
                                        <div class="text-muted small">Unit</div>
                                        <div class="">${data.space_code ?? "_"}</div>
                                    </div>
                                </div>
                                <div class="col-12 mb-2">
                                    <div class="p-3 bg-light rounded text-center">
                                        <h6 class="mb-3">Lease Terms</h6>
                                        <div class="row text-center">
                                            <div class="col-6 border-end border-info">
                                                <div class="text-muted mb-1 small">Start Date</div>
                                                <div class="small">${data.start_date ?? "_"}</div>
                                            </div>
                                            <div class="col-6">
                                                <div class="text-muted mb-1 small">End Date</div>
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
                                <a class="nav-link active fw-semibold" href="#overview_tenant_detail">Overview</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-semibold" href="#lease_tenant_history">Contract</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link fw-semibold" href="#document_tenant_list">Documents</a>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body tab-content">
                        <div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <h5 class="fw-bold mb-2 d-flex align-items-center">
                                <i class="fa fa-user me-2 text-primary"></i> Personal Information
                            </h5>
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="text-capitalize">${data.name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Gender</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class=" text-primary">${data.phone_number ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>

                        <div class="tab-pane" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2 d-flex align-items-center">
                                <i class="fa fa-file-text me-2 text-primary"></i> Contract
                            </h5>
                            <div class="container py-4 position-relative overflow-auto lease-history-scroll" style="max-height: 360px; scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;">
                                <p class="text-muted small mb-0">Open this tab to load contracts.</p>
                            </div>
                        </div>

                        <div class="tab-pane" id="document_tenant_list">
                            <h5 class="fw-bold mb-4 d-flex align-items-center">
                                <i class="fa fa-folder me-2 text-primary"></i> Documents
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
            const hasCurrent = group.some((r) => !!r.is_current);

            let accent = "#adb5bd";
            let circleBg = "#6c757d";
            let headerBadgeHtml = "";
            let priceColor = "#212529";
            let depositBadgeStyle =
                "color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;";
            if (hasCurrent || contractStatusLower === "active") {
                accent = "#0f49bd";
                circleBg = "#0f49bd";
                priceColor = "#3f51d8";
                depositBadgeStyle =
                    "color:#3f51d8;background-color:#e7efff;border:1px solid #cfdbff;";
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">CURRENT</span>`;
            } else if (contractStatusLower === "pending") {
                accent = "#fd7e14";
                circleBg = "#fd7e14";
                priceColor = "#fd7e14";
                depositBadgeStyle =
                    "color:#9a5a19;background-color:#fff1e6;border:1px solid #ffd9bf;";
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#fd7e14;">PENDING</span>`;
            } else {
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 ms-1" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${mThis._escapeHtml(contractStatusName || "—")}</span>`;
            }

            const start = mThis._escapeHtml(first.contract_start_date ?? "");
            const end = mThis._escapeHtml(first.contract_end_date ?? "");
            const title = `Contract: ${start} — ${end}`;

            const unitPart = mThis._escapeHtml(mThis._getUnitCode(first, "—"));
            const sqmPart =
                first.sqm_size != null && first.sqm_size !== ""
                    ? `${mThis._fmtMoney(first.sqm_size)} sqm`
                    : "—";
            const bldg = first.building_name
                ? mThis._escapeHtml(first.building_name)
                : "";
            const detailPillsHtml = `
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">Unit ${unitPart}</span>
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
                    ? `$ ${mThis._fmtMoney(totalPriceNum)}`
                    : "—";

            const dep = first.deposit != null && first.deposit !== "";
            let depositSmallHtml = dep
                ? `Deposit $${mThis._fmtMoney(first.deposit)}`
                : "";
            if (first.deposit_remarks) {
                depositSmallHtml = dep
                    ? `${depositSmallHtml} <span class="text-muted">• ${mThis._escapeHtml(first.deposit_remarks)}</span>`
                    : `<span class="text-muted">${mThis._escapeHtml(first.deposit_remarks)}</span>`;
            }
            const depositBadgeHtml = depositSmallHtml
                ? `<span class="badge rounded-pill px-3 py-2" style="${depositBadgeStyle}">${depositSmallHtml}</span>`
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
                                    <small class="text-muted d-block mb-1">Monthly</small>
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
    mThis.renderOverView = (div, target, data) => {
        if (target == "overview_tenant_detail") {
            const p = { id: data.id };

            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/details"].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const d = res.status_code == 200 ? res.data : {};

                    let html = "";
                    html += `<div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <h5 class="fw-bold mb-2"><i class="fa fa-user me-1 text-primary"></i> Personal Information</h5>
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="">${data.name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Sex</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class="">${data.phone_number ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>`;
                    div.innerHTML = html;
                });
        }
        if (target == "lease_tenant_history") {
            const p = { id: data.id };
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/lease-history"].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const raw =
                        res.status_code == 200 && res.data != null
                            ? res.data
                            : [];
                    const contracts = Array.isArray(raw) ? raw : [];
                    const cardsHtml =
                        mThis._leaseHistoryContractsHtml(contracts);
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class=" py-4 position-relative overflow-auto lease-history-scroll" style="max-height: 360px; scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;">
                                ${cardsHtml}
                            </div>
                        </div>`;
                })
                .catch((err) => {
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class="alert alert-danger m-3">Failed to load contracts: ${mThis._escapeHtml(err && err.message ? err.message : "Unknown error")}</div>
                        </div>`;
                });
        }
        if (target === "document_tenant_list") {
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/document/list"].join(""),
                    { tenant_id: data.id },
                    false,
                    null,
                )
                .then((res) => {
                    const documents =
                        res.status_code === 200 && Array.isArray(res.data)
                            ? res.data
                            : [];

                    let rows = "";

                    documents.forEach((doc) => {
                        rows += `
                    <tr class="border-bottom">
                        <td class="ps-3 py-3" style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="d-flex align-items-center">
                                <div>
                                    <div class="text-dark">
                                        ${doc.document_type || doc.document_type_id || "—"}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.original_file_name || "—"}
                            </div>
                        </td>
                        <td style="width: 12%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.ext ? doc.ext.toUpperCase() : "—"}
                            </div>
                        </td>
                        <td style="width: 30%; height: 65px; vertical-align: middle;">
                            <span class="text-dark">
                                ${doc.remarks || ""}
                            </span>
                        </td>
                        <td class="text-end py-3 px-3" style="width: 10%; height: 55px; vertical-align: middle; ">
                            <div class="d-flex justify-content-start gap-2">
                                <a href="javascript:void(0)" class="view-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-eye text-success fs-6"></i>
                                        <span class="tool-tiptext fs-6">View</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="download-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-solid fa-cloud-arrow-down text-primary fs-6"></i>
                                        <span class="tool-tiptext fs-6">Download</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="delete-doc-btn" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-trash-can text-danger fs-6"></i>
                                        <span class="tool-tiptext fs-6">Delete</span>
                                    </span>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;
                    });

                    // Empty state
                    if (documents.length === 0) {
                        rows = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            No data to display
                        </td>
                    </tr>`;
                    }

                    const html = `
                <div class="tab-pane active" id="document_tenant_list">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-2"><i class="fa fa-address-card me-2 text-primary"></i> Identity Documents</h5>
                        <button type="button" class="fw-light btn btn-primary w-16 w-md-auto btnAddNewPrm" id="_btnDocument">
                            <span vslang="buttons.Upload Document">Upload Document</span>
                        </button>
                    </div>

                    <div class="table-responsive " style="max-height: 290px; overflow-y: auto; scrollbar-width: thin;">
                        <table class="table align-middle mb-3">
                            <thead class="bg-light">
                                <tr class="text-uppercase small">
                                    <th class="border-0 ps-3" style="letter-spacing: 0.05em;">Type</th>
                                    <th class="border-0">File Name</th>
                                    <th class="border-0">File Type</th>
                                    <th class="border-0">Remark</th>
                                    <th class="border-0 text-start">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>

                </div>`;

                    div.innerHTML = html;
                    const btnDocument = div.querySelector("#_btnDocument");
                    if (btnDocument) {
                        btnDocument.onclick = () => {
                            TenantDocumentDialog.show({
                                id: null,
                                tenant_id: data.id,
                                onClose: () => {
                                    mThis.renderOverView(div, target, data);
                                },
                            });
                        };
                    }

                    div.querySelectorAll(".view-doc").forEach((btn) => {
                        btn.addEventListener("click", async (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "view");
                        });
                    });
                    div.querySelectorAll(".download-doc").forEach((btn) => {
                        btn.addEventListener("click", (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "download");
                        });
                    });

                    document
                        .querySelectorAll(".delete-doc-btn")
                        .forEach((btn) => {
                            btn.addEventListener("click", async function (e) {
                                const docId = this.dataset.id;

                                const confirmed = await cv_interact.confirm(
                                    "Are you sure you want to delete this document?",
                                    {
                                        title: "Delete Document",
                                        context: "delete",
                                    },
                                );

                                if (confirmed) {
                                    const p = { id: docId };
                                    vsapi
                                        .call(
                                            [
                                                main_view.base_url,
                                                "/prm/tenant/document/delete",
                                            ].join(""),
                                            p,
                                            false,
                                            false,
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                cv_interact.success(
                                                    "Document deleted.",
                                                );
                                                mThis.renderOverView(
                                                    div,
                                                    target,
                                                    data,
                                                );
                                            } else {
                                                cv_interact.error(
                                                    res.error_message,
                                                );
                                            }
                                        });
                                }
                            });
                        });
                })
                .catch((err) => {
                    div.innerHTML = `<div class="alert alert-danger m-3">Failed to load documents: ${err.message}</div>`;
                });
        }
    };

    mThis.setActionsProfileInfo = (divProfile) => {
        console.log(33, divProfile);

        divProfile.addEventListener("click", (e) => {
            // let btn = VSUtil.closestLimited(e.target, ".edit_tenant_profile_info ");
            // if (btn) {
            //     mThis.editTenantInfo(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".delete_employee");
            // if (btn) {
            //     mThis.deleteEmployee(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".set_resign");
            // if (btn) {
            //     mThis.setResign(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".movement");
            // if (btn) {
            //     mThis.movement(btn.dataset.id, btn);
            //     return;
            // }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/tenant/form-options`,
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
const CreateTenantDialog = (() => {
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

                    <!-- Profile Section -->
                        <div class="col-md-4 text-center d-flex flex-column justify-content-center">
                            <div class="data-input tenant-photo-wrapper border border-prm-custom rounded-3 d-flex align-items-center justify-content-center mx-auto"
                                style="width: 210px; height: 130px; cursor: pointer; background-color: #f8f8f8;">
                                <div name="div_tenant_photo" class="data-input w-100 h-100">
                                </div>
                            </div>
                           <!-- <small class="text-muted d-block mt-2">Profile Photo</small> -->
                        </div>
                        <div class="col-md-8 row g-1">
                            <div class="col-12 ">
                                <div class="vs-material-field">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder="" />
                                    <label>Full Name</label>
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
                                    <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" data-field="date_of_birth" placeholder=" " />
                                    <label>Date of Birth</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4 d-none">
                                <select data-style="material" name="tenant_type" class="data-input form-control" data-field="tenant_type" placeholder="Tenant Type">
                                    <option value="1">Premium</option>
                                    <option value="2">Standard</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 row g-3">
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="text" name="legal_name" class="data-input form-control" data-field="legal_name" placeholder=" " />
                                    <label>Legal Name</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" placeholder="Nationality"></select>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="text" name="national_id" class="data-input form-control" data-field="national_id" placeholder=" " />
                                    <label>National ID</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="text" name="passport_number" class="data-input form-control" data-field="passport_number" placeholder=" " />
                                    <label>Passport Number</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="number" name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " />
                                    <label>Phone Number</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                    <label>Email</label>
                                </div>
                            </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="address" class="data-input form-control" data-field="address" rows="3" placeholder=" "></textarea>
                                <label>Address</label>
                            </div>
                        </div>


                </div>
                `;
                },

                contentCreated: (me) => {
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
                                    {
                                        title: "Delete Photo",
                                        context: "delete",
                                    },
                                );
                                if (yes) {
                                    //delete member's photo from backend
                                    me.deleteProfilePhoto(me.dataOptions.id);
                                    return true;
                                } else return false;
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
                                false,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.tenantImageBox.setImage(null);
                                    cv_interact.info(
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
                                    "/prm/tenant/profile/photo/save",
                                ].join(""),
                                p,
                                false,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.tenantImageBox.setImage(
                                        res.data.image_url,
                                    );
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
                        valueField: "id", // "id" is the country_id
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Create New Tenant",
                    modifyTitle: "Modify Tenant",
                    targetProp: "tenant",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/tenant/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    console.log(1122, me.dataOptions);

                    if (me.dataOptions.phone_number) {
                        me.controls.name.value = me.dataOptions.name;
                        me.controls.phone_number.value =
                            me.dataOptions.phone_number;
                        me.controls.email.value = me.dataOptions.email;
                    }
                },

                extendMethod: {
                    setData: (me, data) => {
                        // console.log(data);

                        me.tenantImageBox.setImage(data.image_url);
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
                            op.photo = me.tenantImageBox
                                ? me.tenantImageBox.getImage()
                                : "";
                            console.log(4444, op);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/tenant/create",
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
                                            cv_interact.success(
                                                "Tenant has been updated successfully.",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New tenant has been added successfully.",
                                            );
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
const TenantDocumentDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op = {}) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,

                createContent: () => {
                    return `
                <div class="document-form row g-3 justify-content-start">
                    <div class="col-8">
                        <select name="document_type" data-style="material" class="data-input form-control" data-field="document_type_id" placeholder="Document Type"></select>
                    </div>
                    <div class="col-4">
                        <div class="vs-material-field d-flex">
                            <button name ="btn_chooseFile"  class="btn btn-secondary btn-block" style="padding: 0.5rem 0.75rem !important;">Choose File </button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="vs-material-field d-flex">
                            <input type="text" name="documents" class="d-none form-control"  accept=".pdf,.png,.jpg,.jpeg" /disabled>
                        </div>
                    </div>
                     <div class="col-12">
                        <div class="vs-material-field">
                            <textarea type="text" name="remarks" class="data-input form-control" data-field="remarks" placeholder=" " /></textarea>
                            <label>Remark</label>
                        </div>
                    </div>

                </div>`;
                },

                contentCreated: (me) => {
                    me.uploadInput = me.divModal.querySelector(
                        'input[name="documents"]',
                    );
                    me.fileBase64 = null; // Store base64 data here
                    // me.controls.btn_chooseFile.onclick = () => {
                    //     FileChooser.chooseFile(
                    //         {
                    //             accept: ".pdf,.png,.jpg,.jpeg",
                    //         },
                    //         (d) => {
                    //             me.fileData = d;
                    //             me.controls.documents.value = d.fileName;
                    //             me.controls.documents.classList.remove('d-none');
                    //         },
                    //     );
                    // };
                    me.controls.btn_chooseFile.onclick = () => {
                        FileChooser.chooseFile(
                            {
                                accept: ".pdf,.png,.jpg,.jpeg",
                            },
                            (d) => {
                               
                                const extension = d.fileName
                                    .split(".")
                                    .pop()
                                    .toLowerCase();
                                console.log("File Name:", d.fileName);
                                console.log("File Extension:", extension);
                                console.log("Full Data Object:", d);
                                me.fileData = d;
                                me.controls.documents.value = d.fileName;
                                me.controls.documents.classList.remove(
                                    "d-none",
                                );
                            },
                        );
                    };
                    me.uploadInput.addEventListener("change", (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                me.fileBase64 =
                                    event.target.result.split(",")[1];

                                me.ext = event.target.result
                                    .split(";")[0]
                                    .split(":")[1];
                                me.ext = me.ext.split("/")[1];
                            };
                            reader.readAsDataURL(file);
                        }
                    });

                    me.deleteTenantDocument = async (documentId) => {
                        const confirmed = await cv_interact.confirm(
                            "Are you sure you want to delete this document? This action cannot be undone.",
                            {
                                title: "Delete Document",
                                context: "delete",
                            },
                        );

                        if (!confirmed) return;

                        const p = { id: documentId };

                        vsapi
                            .call(
                                main_view.base_url,
                                "/prm/tenant/document/delete",
                                p,
                                false,
                                false,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.info("Document deleted.");

                                    // Use the callback we passed in
                                    if (
                                        typeof me.loadTenantDocuments ===
                                        "function"
                                    ) {
                                        me.loadTenantDocuments();
                                    }
                                    me.hide(true);
                                }
                            });
                    };
                },

                configSelect: [
                    {
                        name: "document_type_id",
                        data: "document_types",
                        textField: "document_type",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Upload Document",
                    modifyTitle: "Modify Document",
                    targetProp: "document_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/tenant/document/form-options",
                        ].join(""),
                        params: (op) => ({ id: op.id }),
                    },
                },
                onPrepareForm: (me) => {
                    me.fileData = null;
                    me.fileBase64 = null;
                    me.ext = null;

                    if (me.controls?.documents) {
                        me.controls.documents.value = "";
                        me.controls.documents.classList.add("d-none");
                    }

                    if (me.controls?.remarks) {
                        me.controls.remarks.value = "";
                    }

                    if (me.controls?.document_type) {
                        me.controls.document_type.value = "";
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Close"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            if (!me.controls.document_type.value) {
                                cv_interact.error(
                                    "Please select a document type.",
                                );
                                return;
                            }
                            if (!me.fileData) {
                                cv_interact.error("Please select a file.");
                                return;
                            }
                            const remarks = me.controls.remarks.value || "";

                            if (remarks.length > 255) {
                                cv_interact.error(
                                    "Remarks must not exceed 255 characters.",
                                );
                                return;
                            }

                            const allowExt = ["jpg", "jpeg", "png", "pdf"];

                            if (allowExt.indexOf(me.fileData.ext) === -1) {
                                cv_interact.error(
                                    "Please select a valid file.",
                                );
                                return;
                            }
                            const nameWithoutExt = me.fileData.fileName.replace(
                                /\.[^/.]+$/,
                                "",
                            );
                            const p = {
                                tenant_id: me.dataOptions.tenant_id,
                                ext: me.fileData.ext,
                                data: me.fileData.dataUrl,
                                remarks: me.controls.remarks.value,
                                document_type_id:
                                    me.controls.document_type.value,
                                original_file_name: nameWithoutExt,
                            };
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/tenant/document/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        // me.fileData = null;
                                        // if (me.controls?.documents) {
                                        //     me.controls.documents.value = "";
                                        //     me.controls.documents.classList.add(
                                        //         "d-none",
                                        //     );
                                        // }
                                        me.hide(true, p);
                                        cv_interact.success(
                                            "Document saved successfully.",
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                        me.fileData = null;

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

"use strict";
var VendorComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Vendors";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_vendor_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnVendor");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_vendor");
    mThis.elFilter_type = mThis.self.querySelector("#_vendor_type_id");
    mThis.elFilter_status = mThis.self.querySelector("#_vendor_status_id");
    mThis.elFilter_category = mThis.self.querySelector("#_vendor_category_id");
    mThis.elSearch = mThis.self.querySelector("#_search_vendor");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                const name = data.name ?? "";
                const code = data.code ?? "";

                const initials = name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                let bgClass = "bg-secondary-subtle text-secondary";

                if (code === "equipment") {
                    bgClass = "bg-primary-subtle text-primary";
                } else if (code === "maintenance") {
                    bgClass = "bg-warning-subtle text-warning";
                } else if (code === "utility") {
                    bgClass = "bg-success-subtle text-success";
                }

                return `
            <div class="d-flex text-nowrap align-items-center gap-2">
                <div class="rounded ${bgClass} d-flex align-items-center justify-content-center fw-bold small" style="width:32px;height:32px;">
                    ${initials}
                </div>

                <div>
                    <span class="text-prm-custom d-block text-capitalize">
                        ${name}
                    </span>
                    <small class="d-block text-primary">
                        ${data.type ?? "_"}
                    </small>
                </div>
            </div>
        `;
            },
        },

        {
            transTitle: "titles.Category",
            className: "align-middle",
            data: (data) => {
                const code = data.code ?? "";
                const name = data.category ?? "";

                let bgClass = "bg-secondary-subtle text-secondary";

                if (code === "equipment") {
                    bgClass = "bg-primary-subtle text-primary";
                } else if (code === "maintenance") {
                    bgClass = "bg-warning-subtle text-warning";
                } else if (code === "utility") {
                    bgClass = "bg-success-subtle text-success";
                }

                return `<span class="badge ${bgClass} text-uppercase fw-bold" style="min-width:120px;">
                    ${name}
                </span>`;
            },
        },

        {
            transTitle: "titles.Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone_number ?? "_"}</span>
                 <span class="d-block text-primary text-nowrap"><i class="fa-solid text-primary px-1 fa-envelope" ></i> ${data.email ?? "_"}</span>`,
        },

        {
            transTitle: "titles.Contact Person",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom text-capitalize"> ${data.contact_person ?? "_"}</span>
                         <span class="d-block text-primary"> ${data.contact_phone ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Address",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:250px;">
                        <i class="fa-solid fa-location-dot" style="color: rgb(72 71 83);"></i> 
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? "_"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls =
                    "badge text-warning bg-warning-subtle border border-warning";
                if (status === "active") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status === "inactive") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? "_"}</span></span>
                    <span class="text-muted small">${data.updated_at ?? "_"}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.VendorListView = new ListView("_vendor_list", {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("vendor");
                tr.setAttribute("id", ["vendor_id", data.id].join(""));
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.VendorListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(265,false)) return;
            CreateVendorDialog.show(op);
        };

        mThis.pr_tbl = mThis.VendorListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        mThis.tblVendor = mThis.VendorListView.getTable();
        mThis.initDropdownMenus(mThis.tblVendor);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.VendorListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.VendorListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            type_id: mThis.elFilter_type.value,
            category_id: mThis.elFilter_category.value,
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Create Expense"></span>',
                    icon: `<i class="fa-solid fa-circle-dollar-to-slot fs-5 text-primary-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_expense",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_vendor",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_vendor",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-arrow-right-arrow-left fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_vendor_status",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                // menu.change_vendor_status.style.display =  'none';
                menu.create_expense.style.display = "none";
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "create_expense": {
                        mThis.createExpense(id, menuLink);
                        break;
                    }
                    case "change_vendor_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "modify_vendor": {
                        mThis.editVendor(id, menuLink);
                        break;
                    }
                    case "delete_vendor": {
                        mThis.deleteVendor(id, menuLink);
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
    mThis.createExpense = (id, menulink) => {
        let op = {
            id: null,
            vendor_id: id,
            btn: menulink,
            onClose: () => {
                mThis.VendorListView.showPage(mThis.getFilterData());
            },
        };

        CreateExpenseDialog.show(op);
    };
    mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";
        if (!AuthManager.allowed(268,false)) return;
        const inputOptions = {
            context: "success",
            title: `${LocaleManager.trans('Change Status', "titles")}`,
            label: "Vendor Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: `${LocaleManager.trans('Save', "buttons")}`,
            cancelButtonText: `${LocaleManager.trans('Close', "buttons")}`,
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(
                        `${mThis.base_url}/prm/vendor/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success("update_success_status");
                            mThis.VendorListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(
                                res.error_message || "Unable to update status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };
    mThis.editVendor = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.VendorListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(266,false)) return;
        CreateVendorDialog.show(op);
    };
    mThis.deleteVendor = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.VendorListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(267,false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                'langSection': "message_box_default",
                'translate': true,
                'title': "deleted",
                'context': "delete",
                'confirmButtonText': "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/vendor/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_vendor");
                                mThis.VendorListView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/vendor/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_type,
                    d.types,
                    "id",
                    "vendor_type",
                    "",
                    "All Types",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.statuses,
                    "id",
                    "vendor_status",
                    "",
                    "All Statuses",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_category,
                    d.categories,
                    "id",
                    "vendor_category",
                    "",
                    "All Categories",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.VendorListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const CreateVendorDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                <div class="vendor-form">
                        <div class="col-12 row g-3">
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                             <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="number" name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " />
                                    <label vslang="labels.Phone Number"></label>
                                </div>
                            </div>
                             <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                    <label vslang="labels.Email (optional)"></label>
                                </div>
                            </div>
                             <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="tax_number" class="data-input form-control" data-field="tax_number" placeholder=" " />
                                    <label vslang="labels.Tax Number (optional)"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <select data-style="material" name="vendor_type_id" class="data-input form-control" data-field="vendor_type_id" placeholder="${LocaleManager.trans('Type', 'titles')}">
                                    <!-- <option value="" selected hidden></option> -->
                                    </select>
                                </div>
                            </div>
                             <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <select data-style="material" name="vendor_category_id" class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'titles')}">
                                    </select>
                                </div>
                            </div>
                               
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="contact_person" class="data-input form-control" data-field="contact_person" placeholder=" " />
                                    <label vslang="labels.Contact Person"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="number" name="contact_phone" class="data-input form-control" data-field="contact_phone" placeholder=" " />
                                    <label vslang="labels.Contact Person Phone"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="address" class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                    <label vslang="labels.Address"></label>
                                </div>
                            </div>
                         </div>
                </div>
                `;
                },

                contentCreated: (me) => {},
                configSelect: [
                    {
                        name: "vendor_type_id",
                        data: "types",
                        textField: "vendor_type",
                        valueField: "id",
                    },
                    {
                        name: "vendor_category_id",
                        data: "categories",
                        textField: "vendor_category",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Vendor",
                    modifyTitle: "vslang:titles.Modify Vendor",
                    targetProp: "vendor_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/vendor/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    // LocaleManager.translateZone(me.divModal);
                    // console.log(12,data);
                    const header = me.divModal.querySelector(".modal-header");
                    const btnClose = header.querySelector("button");
                    if (btnClose) btnClose.classList.add("d-none");
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
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/vendor/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success('update_success_vendor');
                                        } else {
                                            cv_interact.success('create_success_vendor');
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

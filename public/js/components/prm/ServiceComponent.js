"use strict";
var ServiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Service Prices";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_service_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnService");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service");
    mThis.elFilter_category = mThis.self.querySelector("#_service_category_id");
    mThis.elFilter_type = mThis.self.querySelector("#_service_type_id");
    mThis.elFilter_status = mThis.self.querySelector("#_status_id");
    mThis.elFilter_charge_as = mThis.self.querySelector("#_charge_as");
    mThis.elSearch = mThis.self.querySelector("#_search_service");

    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle text-capitalize",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-primary-custom">${data.name ?? ""}</span>
                    <small class=" text-muted">${data.service_level ?? ""}</small>
                </div>`;
            },
        },
        {
            transTitle: "titles.Category",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_category ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-capitalize text-prm-custom">${data.service_type ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Charge As",
            className: "align-middle text-nowrap",
            data: (data) => {
                const unitMap = {
                    per_unit: "Unit",
                    one_time: "Once",
                    hour: "Hourly",
                    month: "Monthly",
                };

                const label = unitMap[data.charge_as] || "-";

                return `<span class="badge text-info bg-info-subtle border border-info text-nowrap" style="min-width:90px;">${label}</span>`;
            },
        },
        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                const currency = data.currency_code ?? "USD";

                const unitMap = {
                    per_unit: "Unit",
                    one_time: "Once",
                    hour: "Hourly",
                    month: "Monthly",
                };

                // const unit = unitMap[data.charge_as] || '';
                const formattedPrice = VSMoney.formatAmount(
                    data.price,
                    currency,
                );

                return `
                    <span class="text-nowrap" style="color: #0C447C">
                        ${formattedPrice}
                    </span>
                `;
            },
        },
        // {
        //     transTitle: "titles.Remark",
        //     className: "align-middle",
        //     data: (data, index, tr) => {
        //         return `
        //             <div class="text-primary-custom" style="width:120px;">
        //                 <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? ''}</span>
        //             </div>
        //         `;
        //     }
        // },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls =
                    "badge text-dark bg-warning-subtle border border-warning";
                if (status === "active") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status === "inactive") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:170px">
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? "d-none" : "btn_service_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ServiceListView = new ListView("_service_list", {
            fetchApi: `${main_view.base_url}/prm/service/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("service", "cursor-pointer");

                tr.setAttribute("id", ["service_id", data.id].join(""));
                tr.__serviceDescription = data.description ?? "";
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ServiceListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(252, false)) return;
            CreateServicePriceDialog.show(op);
        };

        mThis.pr_tbl = mThis.ServiceListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        mThis.tblService = mThis.ServiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblService);

        if (!mThis.tblService.id) {
            mThis.tblService.id = "_service_list_table";
        }
        new ExpandableRowConfig(mThis.tblService.id, {
            dontExpandByClickingOn: ["btn_service_action", "btn--Options"],
            // showExpandSignal: false,
            onOpen: (container, detail_tr, parent_tr) => {
                const qtr = parent_tr;
                console.log(2222, qtr.dataset);

                let op = {
                    service_id: qtr.dataset.id,
                    description: qtr.__serviceDescription,
                };
                if (op.service_id > 0)
                    mThis.displayServiceDescription(container, op);
            },
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ServiceListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ServiceListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            category_id: mThis.elFilter_category.value,
            type_id: mThis.elFilter_category.value,
            status_id: mThis.elFilter_status.value,
            charge_as: mThis.elFilter_charge_as.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.displayServiceDescription = (container, op) => {
        const raw = op?.description ?? "";

        const hasData =
            raw !== null &&
            raw !== undefined &&
            String(raw).trim() !== "" &&
            String(raw).toLowerCase() !== "null" &&
            String(raw).toLowerCase() !== "undefined";
        if (!hasData) {
            container.innerHTML = `
        <div class="card shadow-sm border-0 rounded-0 mx-0 bg-body-tertiary">
            <div class="card-body py-3 px-4">

                <div class="text-uppercase small text-muted mb-2 fw-semibold">
                    <span vslang="labels.Description"></span>
                </div>
                <div class="text-primary-custom text-break;">_</div>
            </div>
        </div>
    `;
            return;
        }
        const escapeHtml = (str) => {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        };
        container.innerHTML = `
        <div class="card shadow-sm border-0 rounded-0 mx-0 bg-body-tertiary">
            <div class="card-body py-3 px-4">

                <div class="text-uppercase small text-muted mb-2 fw-semibold">
                    <span vslang="labels.Description"></span>
                </div>

                <div class="text-primary-custom text-break;">
                    ${escapeHtml(raw)}
                </div>

            </div>
        </div>
    `;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_service_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_service",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_service",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_service_status",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                // menu.change_service_status.style.display =  'none';
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_service_status": {
                        mThis.changeServiceStatus(id, menuLink);
                        break;
                    }
                    case "edit_service": {
                        mThis.editService(id, menuLink);
                        break;
                    }
                    case "delete_service": {
                        mThis.deleteService(id, menuLink);
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
   
    mThis.editService = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ServiceListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(253, false)) return;
        CreateServicePriceDialog.show(op);
    };
    mThis.deleteService = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ServiceListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(255, false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                transTitle: "Delete Service",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/service/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_service");
                                mThis.ServiceListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message || "delete_failed",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/service/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_category,
                    d.service_categories,
                    "id",
                    "service_category",
                    "",
                    LocaleManager.trans("All Categories", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_type,
                    d.service_types,
                    "id",
                    "service_type",
                    "",
                    LocaleManager.trans("All Types", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.statuses,
                    "id",
                    "status_name",
                    "",
                    LocaleManager.trans("All Statuses", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_charge_as,
                    d.charge_as,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Charge As", "titles"),
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
            mThis.ServiceListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const CreateServicePriceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder="" />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="service_type" class="data-input form-control" data-field="type_id" placeholder="${LocaleManager.trans('Type', 'labels')}">
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="service_category" class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'labels')}">
                                </select>
                            </div>
                            <div class="col-6">
                                    <select data-style="material" name="charge_as" class="data-input form-control" data-field="charge_as" placeholder="${LocaleManager.trans('Charge As', 'labels')}">
                                    <option value="per_unit">Unit</option>
                                    <option value="one_time">Once</option>
                                    <option value="hour">Hourly</option>
                                    <option value="month">Monthly</option>
                                    </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="level" class="data-input form-control" data-field="level" placeholder="${LocaleManager.trans('Level', 'labels')}">
                                    <option value="1" selected >Standard</option>
                                    <option value="2">Premium</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price" class="data-input form-control" data-field="price" placeholder="" />
                                    <label vslang="labels.Price"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    me.resetCreateForm = () => {
                        ["name", "description"].forEach((f) => {
                            if (me.controls[f]) me.controls[f].value = "";
                        });
                        if (me.controls.price) {
                            me.controls.price.value = "";
                            me.controls.price.defaultValue = "";
                            me.controls.price.dispatchEvent(
                                new Event("input", { bubbles: true }),
                            );
                        }
                        ["service_type", "service_category", "charge_as"].forEach(
                            (f) => {
                                if (me.controls[f]) {
                                    me.controls[f].value = "";
                                    me.controls[f].dispatchEvent(
                                        new Event("change", { bubbles: true }),
                                    );
                                }
                            },
                        );
                        if (me.controls.level) {
                            me.controls.level.value = "1";
                            me.controls.level.dispatchEvent(
                                new Event("change", { bubbles: true }),
                            );
                        }
                        me.setReadOnly?.(false, ["charge_as"]);
                    };

                    me.updateChargeAs = () => {
                        const typeText = (
                            me.controls.service_type?.selectedOptions?.[0]
                                ?.text || ""
                        )
                            .trim()
                            .toLowerCase();
                        const isSubscription = typeText === "subscription";
                        if (isSubscription)
                            me.controls.charge_as.value = "month";
                        me.setReadOnly?.(isSubscription, ["charge_as"]);
                    };
                    me.controls.service_type?.addEventListener(
                        "change",
                        me.updateChargeAs,
                    );
                    if (me.controls.price) applyNumberInput(me.controls.price);
                },

                onShow: (me) => {
                    if (!me.dataOptions?.id) {
                        me.resetCreateForm?.();
                        [50, 150, 300].forEach((ms) =>
                            setTimeout(() => me.resetCreateForm?.(), ms),
                        );
                    }
                    setTimeout(() => me.updateChargeAs?.(), 100);
                },

                extendMethod: {
                    setData: (me) => {
                        if (!me.dataOptions?.id) {
                            setTimeout(() => me.resetCreateForm?.(), 0);
                        }
                    },
                },

                configSelect: [
                    {
                        name: "service_category",
                        data: "service_categories",
                        textField: "service_category",
                        valueField: "id",
                    },
                    {
                        name: "service_type",
                        data: "service_types",
                        textField: "service_type",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Service Price",
                    modifyTitle: "vslang:titles.Modify Service Price",
                    targetProp: "service_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/service/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const isCreate =
                        !me.dataOptions?.id && !data?.service_details;
                    if (isCreate) {
                        me.resetCreateForm?.();
                        [50, 150, 300].forEach((ms) =>
                            setTimeout(() => me.resetCreateForm?.(), ms),
                        );
                    } else if (data?.service_details?.price != null) {
                        if (me.controls.price)
                            me.controls.price.value =
                                data.service_details.price;
                    }
                    setTimeout(() => me.updateChargeAs?.(), 100);
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
                            console.log(666, op);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/service/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_service",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success_service",
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

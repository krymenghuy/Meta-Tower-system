"use strict";


var AccessControlComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Access Control";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_access_control_component"
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAccessCard");
    // FIXED: ID matched HTML wrapper (#_divFilter_access_control)
    mThis.divFilter = mThis.self.querySelector("#_divFilter_access_control");
    mThis.elFilter_status = mThis.self.querySelector("#_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_access");

    mThis.cols = [
        { title: "", className: "align-middle text-nowrap text-capitalize" },
        {
            transTitle: "titles.Code",
            className: "align-middle text-nowrap",
            data: data => `<span class="text-prm-custom">${data.code ?? "_"}</span>`
        },
        {
            transTitle: "titles.Holder",
            className: "align-middle text-nowrap",
            data: data =>
                `<div class="text-prm-custom text-capitalize" style="width:170px;">
                    <span class="text-wrap text-break">${data.holder_name ?? data.holder_id ?? "_"}</span>
                </div>`
        },
        {
            transTitle: "titles.Type",
            className: "align-middle text-nowrap",
            data: data => `<span class="text-nowrap" style="min-width:100px">${data.type ?? "_"}</span>`
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: data => `<div class="text-prm-custom"><span>${data.unit_code ?? "_"}</span></div>`
        },
        {
            transTitle: "titles.Expiry Date",
            className: "align-middle text-nowrap",
            data: data => `<div class="text-prm-custom"><span>${data.expire_date ?? "_"}</span></div>`
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: data => {
                const status = (data.status ?? "").toLowerCase();
                let cls = "text-info";

                if (status === "inactive") {
                    cls = "badge text-danger bg-danger-subtle border border-danger";
                } else if (status === "active") {
                    cls = "badge text-success bg-success-subtle border border-success";
                } else if (status === "draft") {
                    cls = "badge text-warning bg-warning-subtle border border-warning";
                }

                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ""}
                    </span>`;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: data => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: data => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? "d-none" : "btn_access_card_action"}" data-id="${data.id}" data-statusid="${data.status}" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`
        }
    ];

    mThis.populateStatusFilter = () => {
        if (!mThis.elFilter_status) return;

        const statuses = [
            { id: "active", name: LocaleManager.trans("Active", "titles") },
            { id: "inactive", name: LocaleManager.trans("Inactive", "titles") },
        ];

        VSUtil.setComboItems(
            mThis.elFilter_status,
            statuses,
            "id",
            "name",
            "",
            LocaleManager.trans("All Statuses", "titles"),
            ""
        );
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.populateStatusFilter();

        mThis.AccessControlListView = new ListView("_access_control_list", {
            fetchApi: `${main_view.base_url}/prm/access_control/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.status = data.status;
                tr.classList.add("access_control", "cursor-pointer");
                tr.setAttribute("id", `access_card_id${data.id}`);
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function(e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.AccessControlListView.showPage(mThis.getFilterData());
                }
            };
            AccessControlDialog.show(op);
        };

        mThis.tblAccessCard = mThis.AccessControlListView.getTable();
        mThis.initDropdownMenus(mThis.tblAccessCard);

        if (mThis.divFilter) {
            mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
                el.onchange = e => {
                    e.preventDefault();
                    mThis.AccessControlListView.showPage(mThis.getFilterData());
                };
            });
        }

        if (mThis.elSearch) {
            mThis.elSearch.addEventListener("keyup", e => {
                e.preventDefault();
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(() => {
                    mThis.AccessControlListView.showPage(mThis.getFilterData());
                }, 250);
            });
        }

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status: mThis.elFilter_status ? mThis.elFilter_status.value : "",
            search_value: mThis.elSearch ? mThis.elSearch.value : ""
        };
        return p;
    };

    mThis.initDropdownMenus = table => {
        if (!table) return;

        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_access_card_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_access_card"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_access_card"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_access_card_status"
                }
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_access_card":
                        mThis.editCard(id, menuLink);
                        break;
                    case "delete_access_card":
                        mThis.deleteCard(id, menuLink);
                        break;
                    case "change_access_card_status":
                        mThis.changeAccessCardStatus(id, menuLink);
                        break;
                    default:
                        break;
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editCard = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => mThis.AccessControlListView.showPage(mThis.getFilterData())
        };
        AccessControlDialog.show(op);
    };

    mThis.deleteCard = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => mThis.AccessControlListView.showPage(mThis.getFilterData())
        };
        cv_interact.confirm(
            "confirm_delete",
            {
                transTitle: "Delete Access Card",
                context: "delete",
                confirmButtonText: "Delete"
            },
            confirmed => {
                if (confirmed) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/access_control/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then(res => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success");
                                mThis.AccessControlListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message || "delete_failed");
                            }
                        });
                }
            }
        );
    };

    mThis.changeAccessCardStatus = (id, link) => {
        const tr = link.closest("tr");
        const status = tr?.dataset.status || "";

        const inputOptions = {
            context: "success",
            title: `${LocaleManager.trans("Change Status", "titles")}`,
            label: "Card Status",
            valueKey: "status",
            labelKey: "name",
            confirmButtonText: `${LocaleManager.trans("Save", "buttons")}`,
            cancelButtonText: `${LocaleManager.trans("Close", "buttons")}`,
            requiredMessage: "Please select a status",
            data: [
                { status: "active", name: LocaleManager.trans("Active", "titles") },
                { status: "inactive", name: LocaleManager.trans("Inactive", "titles") }
            ],
            defaultValue: status.toLowerCase(),
            onConfirm: (selected, btn, me) => {
                const payload = { id, status: selected.status };
                vsapi
                    .post(`${mThis.base_url}/prm/access_control/update-status`, payload, { loader: false, agent: btn })
                    .then(res => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success("update_success");
                            mThis.AccessControlListView.showPage(mThis.getFilterData());
                        } else {
                            me.setError(res.error_message || "update_failed");
                        }
                    });
            }
        };
        InputBox.show(inputOptions);
    };

    mThis.prepareFormOptions = onFinish => {
        vsapi
            .call(`${main_view.base_url}/prm/access_control/form-options`, null, null, null)
            .then(res => {
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = options => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.AccessControlListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const AccessControlDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = op => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,

                createContent: () =>
                    [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="code" class="data-input form-control" data-field="code" placeholder=" " />
                                    <label vslang="labels.Card Code (Auto/Optional)"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <select name="category" id="_holder_category" class="data-input form-control" data-field="category" data-style="material" placeholder="${LocaleManager.trans('Select Category', 'labels')}">
                                        <option value="internal">Internal Holder</option>
                                        <option value="external">External Holder</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12" id="_search_hint_container">
                                <h3 class="fs-6 mb-2 text-start" style="color:#6c757d">
                                    Search by prefix: <code class="text-danger" style="font-size: 14px;">e-</code> for Employee, <code class="text-danger" style="font-size: 14px;">t-</code> for Tenant, or <code class="text-danger" style="font-size: 14px;">m-</code> for Member
                                </h3>
                            </div>
                            <div class="col-6">
                                <div class="input-group d-flex align-items-center">
                                    <div class="vs-material-field flex-grow-1 w-75">
                                        <input name="holder_id" class="form-control data-input" data-field="holder_id"/> 
                                        <label vslang="labels.Holder"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="type" id="_holder_type" required class="data-input form-control" data-field="type" placeholder=" " />
                                    <label vslang="labels.Holder Type"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="space_id" class="data-input form-control" data-field="space_id" placeholder=" "></select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="expire_date" class="data-input form-control" data-field="expire_date" placeholder=" " />
                                    <label vslang="labels.Expire Date"></label>
                                </div>
                            </div>
                        </div>`
                    ].join(""),

                contentCreated: me => {
                    me.resetCreateForm = () => {
                        me.selectedHolderId = null;
                        ["code", "holder_id", "type", "expire_date"].forEach(f => {
                            if (me.controls[f]) me.controls[f].value = "";
                        });
                        ["category", "space_id"].forEach(f => {
                            if (me.controls[f]) {
                                me.controls[f].value = me.controls[f].options?.[0]?.value || "";
                                me.controls[f].dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        });
                    };

                    const hintContainer = me.dialog ? me.dialog.querySelector("#_search_hint_container") : document.querySelector("#_search_hint_container");

                    const initSearch = () => {
                        if (me.searchConfig && typeof me.searchConfig.destroy === "function") {
                            me.searchConfig.destroy();
                        }

                        me.searchConfig = VSSearchInput.init(me.controls.holder_id, {
                            type: "select",
                            api: {
                                endpoint: `${main_view.base_url}/prm/access_control/search-card-holder`,
                                method: "POST"
                            },
                            placeholder: "name",
                            maxDropdownHeight: "450px",
                            showColumnHeader: true,
                            columns: { name: "name", code: "code" },
                            onSelect: item => {
                                me.selectedHolderId = item.id;
                                me.controls.holder_id.value = item.name;
                                me.controls.type.value = item.holder_type || "";
                            }
                        });
                    };

                    const handleCategoryToggle = isExternal => {
                        me.selectedHolderId = null;
                        if (me.controls.holder_id) me.controls.holder_id.value = "";
                        if (me.controls.type) me.controls.type.value = "";

                        if (isExternal) {
                            if (me.searchConfig && typeof me.searchConfig.destroy === "function") {
                                me.searchConfig.destroy();
                            }
                            if (me.controls.type) me.controls.type.readOnly = false;
                            if (hintContainer) hintContainer.style.display = "none";
                        } else {
                            initSearch();
                            if (me.controls.type) me.controls.type.readOnly = true;
                            if (hintContainer) hintContainer.style.display = "block";
                        }
                    };

                    if (me.controls.category) {
                        me.controls.category.addEventListener("change", e => {
                            handleCategoryToggle(e.target.value === "external");
                        });
                    }

                    handleCategoryToggle(false);
                },

                onShow: me => {
                    if (!me.dataOptions?.id) {
                        me.resetCreateForm?.();
                        [50, 150, 300].forEach(ms => setTimeout(() => me.resetCreateForm?.(), ms));
                    }
                },

                extendMethod: {
                    setData: me => {
                        if (!me.dataOptions?.id) {
                            setTimeout(() => me.resetCreateForm?.(), 0);
                        }
                    }
                },

                configSelect: [
                    {
                        name: "space_id",
                        data: "building_spaces",
                        textField: "space_id",
                        valueField: "id"
                    },
                    {
                        name: "floor_id",
                        data: "building_spaces",
                        textField: "floor_name",
                        valueField: "id"
                    }
                ],

                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Access Card",
                    modifyTitle: "vslang:titles.Modify Access Card",
                    targetProp: "access_card",
                    api: {
                        endpoint: `${main_view.base_url}/prm/access_control/form-options`,
                        params: op => ({ id: op.id })
                    }
                },

                onPrepareForm: (me, data) => {
                    const isCreate = !me.dataOptions?.id && !data?.access_card;

                    VSUtil.setComboItems(
                        me.controls.space_id,
                        data.building_spaces ?? [],
                        "id",
                        "code",
                        "",
                        LocaleManager.trans("Select Unit", "titles"),
                        ""
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

                    if (isCreate) {
                        me.resetCreateForm?.();
                        [50, 150, 300].forEach(ms => setTimeout(() => me.resetCreateForm?.(), ms));
                    } else if (data?.access_card) {
                        const card = data.access_card;
                        const isExternal = card.category === "external";

                        if (me.controls.code) me.controls.code.value = card.code || "";
                        if (me.controls.category) me.controls.category.value = card.category || "internal";
                        if (me.controls.type) me.controls.type.value = card.type || "";
                        if (me.controls.space_id) me.controls.space_id.value = card.space_id || "";
                        if (me.controls.expire_date) me.controls.expire_date.value = card.expire_date || "";

                        if (isExternal) {
                            me.selectedHolderId = null;
                            if (me.controls.holder_id) {
                                me.controls.holder_id.value = card.holder_name || "";
                            }
                        } else {
                            me.selectedHolderId = card.holder_id;
                            if (me.controls.holder_id) {
                                me.controls.holder_id.value = card.holder_name || card.holder_id || "";
                            }
                        }
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false)
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const payload = me.getData();
                            payload.id = me.dataOptions.id;

                            const category = me.controls.category ? me.controls.category.value : "internal";

                            if (category === "external") {
                                payload.category = "external";
                                payload.holder_name = me.controls.holder_id ? me.controls.holder_id.value : "";
                                payload.holder_id = null;
                            } else {
                                payload.category = "internal";
                                payload.holder_id = me.selectedHolderId;
                                payload.holder_name = null;
                            }

                            vsapi
                                .call(
                                    `${main_view.base_url}/prm/access_control/save`,
                                    payload,
                                    btn,
                                    null
                                )
                                .then(res => {
                                    if (res.status_code === 200) {
                                        me.hide(true, payload);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success");
                                        } else {
                                            cv_interact.success("create_success");
                                        }
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
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
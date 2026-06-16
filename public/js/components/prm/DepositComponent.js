"use strict";

var DepositComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Deposit Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_deposit_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_deposit");
    mThis.elFilter_building = mThis.self.querySelector("#_bill_building_id");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elFilter_category = mThis.self.querySelector(
        "#_bill_expense_type_id",
    );
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Building",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-nowrap fw-semibold">${data.building_name ?? "_"}</span>
                 <span class="d-block text-muted small">${data.space_code ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block fw-semibold text-capitalize">${data.tenant_name ?? "_"}</span>
                 <span class="d-block text-primary small">${data.phone_number ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Contract Period",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-prm-custom small">${data.start_date ?? "_"} to ${data.end_date ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Deposit Date",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-prm-custom">${data.deposit_date ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block fw-semibold text-primary">${VSMoney.formatAmount(data.total_amount, "USD")}</span>`;
            },
        },

        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.remark ?? "_"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const status = (data.status ?? "pending").toLowerCase();
                const statusConfig = {
                    pending:
                        "border border-danger text-danger bg-danger-subtle",
                    paid: "border border-success text-success bg-success-subtle",
                    refunded:
                        "border border-warning text-warning bg-warning-subtle",
                };
                const cls = statusConfig[status] ?? "bg-secondary text-white";
                return `
                    <span class="badge ${cls} text-capitalize d-inline-flex align-items-center justify-content-center px-3 py-2 gap-2" style="min-width:100px; font-size:12px;">
                        ${status}
                    </span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? "_"}</span></span>
                    <span class="text-muted small">${data.updated_at ?? "_"}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_bill_action"
                        data-id="${data.id}"
                        data-status="${data.status}"
                        aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView("_deposit_list", {
            fetchApi: `${main_view.base_url}/prm/deposit/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.status = data.status;
                tr.dataset.tenantId = data.tenant_id;
                tr.dataset.buildingId = data.building_id;
                tr.dataset.contractId = data.contract_id;
                tr.classList.add("deposit");
                tr.setAttribute("id", `deposit_payment_id${data.id}`);
            },

            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BillListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(274, false)) return;
            DepositDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        const tblBill = mThis.BillListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_list_table";
        mThis.initDropdownMenus(tblBill);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            building_id: mThis.elFilter_building.value,
            tenant_id: mThis.elFilter_vendor.value,
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
            actionButtonClass: "btn_dropdown_bill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_deposit",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_deposit",
                },
                {
                    html: '<span class="ps-2">Refund</span>',
                    icon: `<i class="fa-solid fa-circle-dollar-to-slot fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "refund_deposit",
                },
            ],

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status = (container.dataset.status || "").toLowerCase();

                menu.modify_deposit.style.display =
                    status === "pending" ? "block" : "none";
                menu.delete_deposit.style.display =
                    status === "pending" ? "block" : "none";
                menu.refund_deposit.style.display =
                    status === "paid" ? "block" : "none";
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_deposit": {
                        mThis.editDeposit(id, menuLink);
                        break;
                    }
                    case "delete_deposit": {
                        mThis.deleteDeposit(id, menuLink);
                        break;
                    }
                    case "refund_deposit": {
                        mThis.refundDeposit(id, menuLink);
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

    mThis.editDeposit = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(275, false)) return;
        DepositDialog.show(op);
    };

    mThis.deleteDeposit = (id, menuLink) => {
        if (!AuthManager.allowed(276, false)) return;
        cv_interact.confirm(
            "Delete this Deposit Record?",
            {
                transTitle: "Delete Deposit Record",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${mThis.base_url}/prm/deposit/delete`,
                            { id: id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success");
                                mThis.BillListView.showPage(
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

    mThis.refundDeposit = (id, menuLink) => {
        if (!AuthManager.allowed(277, false)) return;
        cv_interact.confirm(
            "Refund this deposit? Status will be updated to 'refunded'.",
            {
                transTitle: "Refund Deposit",
                context: "delete",
                confirmButtonText: "Refund",
            },
            function (confirmed) {
                if (!confirmed) return;
                vsapi
                    .call(
                        `${mThis.base_url}/prm/deposit/update-status`,
                        { id: id, status_id: "refunded" },
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success(
                                "Refund processed successfully.",
                            );
                            mThis.BillListView.showPage(mThis.getFilterData());
                        } else {
                            cv_interact.error(
                                res.error_message ||
                                    "Failed to process refund.",
                            );
                        }
                    })
                    .catch(() => {
                        cv_interact.error(
                            "Network error while processing refund.",
                        );
                    });
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${mThis.base_url}/prm/deposit/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_building,
                    d.buildings,
                    "id",
                    "building",
                    "",
                    "All Buildings",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_vendor,
                    d.tenants,
                    "id",
                    "tenant",
                    "",
                    "All Tenants",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.deposit_statuses,
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
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const DepositDialog = (() => {
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
                    return [
                        `<div class="row g-3">
                            <input name="tenant_id" class="d-none data-input form-control" data-field="tenant_id">
                            <input name="contract_id" class="d-none data-input form-control" data-field="contract_id">
                            
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="tenant_name" class="data-input form-control" data-field="tenant_name" placeholder="Search Tenant..." autocomplete="off">
                                    <label>Tenant</label>
                                </div>
                            </div>
                            
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " disabled />
                                    <label vslang="labels.Phone Number">Phone Number</label>
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="vs-material-field">
                                    <input name="building" class="data-input form-control" data-field="building" placeholder=" " disabled />
                                    <label vslang="labels.Building"></label>
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="vs-material-field">
                                    <input name="space_code" class="data-input form-control" data-field="space_code" placeholder=" " disabled />
                                    <label vslang="labels.Unit Code">Unit Code</label>
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="vs-material-field">
                                    <input name="amount" class="data-input form-control" data-field="amount" placeholder=" " disabled />
                                    <label>Deposit Owed ($)</label>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="deposit_date" class="data-input form-control form_input" data-field="deposit_date" placeholder=" "/>
                                    <label vslang="labels.Payment Date"></label>
                                </div>
                            </div>

                            <div class="col-6">
                                <select name="payment_method" data-style="material" class="data-input form-control" data-field="payment_method" placeholder="Payment Method">
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                            <!-- 8. Payment Amount (User enters this) -->
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" inputmode="decimal" name="payment_amount" class="data-input form-control" data-field="payment_amount" placeholder=" ">
                                    <label>Payment Amount ($)</label>
                                </div>
                            </div>
                            <!-- 9. Reference / Transaction No. -->
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="ref_no" class="data-input form-control" data-field="ref_no" placeholder=" ">
                                    <label>Reference No.</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label>Remark</label>
                                </div>
                            </div>
                        </div>
                        `,
                    ].join("");
                },

                contentCreated: (me) => {
                    const fillContractInfo = (tenantId) => {
                        me._selectedTenantId = tenantId || "";
                        if (me.controls.tenant_id)
                            me.controls.tenant_id.value = tenantId || "";
                        if (!tenantId) {
                            if (me.controls.phone_number)
                                me.controls.phone_number.value = "";
                            if (me.controls.building)
                                me.controls.building.value = "";
                            if (me.controls.space_code)
                                me.controls.space_code.value = "";
                            if (me.controls.amount)
                                me.controls.amount.value = "";
                            return;
                        }
                        vsapi
                            .post(
                                `${main_view.base_url}/prm/tenant/option-tenant-with-contract`,
                                { tenant_id: tenantId },
                                {},
                            )
                            .then((res) => {
                                const d = res.data || {};
                                const tenant = d.tenant || {};
                                const activeSpaces = d.spaces || [];

                                if (me.controls.phone_number)
                                    me.controls.phone_number.value =
                                        tenant.phone_number || "";

                                if (activeSpaces.length > 0) {
                                    const space = activeSpaces[0];
                                    if (me.controls.contract_id)
                                        me.controls.contract_id.value =
                                            space.contract_id || "";
                                    if (me.controls.building)
                                        me.controls.building.value =
                                            space.building_name || "";
                                    if (me.controls.space_code)
                                        me.controls.space_code.value =
                                            space.space_code || "";
                                    if (me.controls.amount)
                                        me.controls.amount.value =
                                            space.deposit || "0.00";
                                }
                            })
                            .catch(() => {});
                    };

                    if (me.controls.tenant_name) {
                        me.searchTenant = VSSearchInput.init(
                            me.controls.tenant_name,
                            {
                                type: "select",
                                prefetch: true,
                                minChars: 0,
                                api: {
                                    endpoint: `${main_view.base_url}/prm/deposit/form-options`,
                                },
                                processResponse: (res) => {
                                    const tenants = res?.data?.tenants || [];
                                    return (
                                        Array.isArray(tenants) ? tenants : []
                                    ).map((t) => ({
                                        ...t,
                                        tenant_name: t.tenant || t.name || "",
                                        phone_number: t.phone_number || "",
                                    }));
                                },
                                columns: {
                                    tenant_name: "TENANT",
                                    phone_number: "PHONE",
                                },
                                showColumnHeader: true,
                                placeholder: "Search tenant",
                                onSelect: (tenant) => {
                                    const id = tenant?.id || "";
                                    me.controls.tenant_name.value =
                                        tenant?.tenant_name || "";
                                    fillContractInfo(id);
                                },
                            },
                        );
                    }

                    applyNumberInput(me.controls.paid_amount);
                },

                configSelect: [],
                onShow: (me) => {
                    const title = me.divModal.querySelector(".modal-title");
                    if (title) {
                        const isModify = !!me.dataOptions?.id;
                        title.innerHTML = isModify
                            ? '<h4 class="text-prm-custom text-start fw-bold">Modify Deposit</h4>'
                            : '<h4 class="text-prm-custom text-start fw-bold">Receive Deposit</h4>';
                    }
                    if (!me.dataOptions?.id) {
                        setTimeout(() => {
                            if (
                                me.controls.deposit_date &&
                                !me.controls.deposit_date.value
                            ) {
                                me.controls.deposit_date.value = new Date()
                                    .toISOString()
                                    .split("T")[0];
                            }
                        }, 100);
                    }
                },
                prepareFormOptions: {
                    createTitle: "Receive Deposit",
                    modifyTitle: "Modify Deposit",
                    targetProp: "deposit_details",
                    api: {
                        endpoint: `${main_view.base_url}/prm/deposit/form-options`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const details = data?.deposit_details;
                    if (details) {
                        me.controls.tenant_id.value = details.tenant_id || "";
                        me.controls.contract_id.value =
                            details.contract_id || "";
                        if (me.controls.tenant_name)
                            me.controls.tenant_name.value =
                                details.tenant_name || "";
                        if (me.controls.phone_number)
                            me.controls.phone_number.value =
                                details.phone_number || "";
                        if (me.controls.building)
                            me.controls.building.value =
                                details.building_name || "";
                        if (me.controls.space_code)
                            me.controls.space_code.value =
                                details.space_code || "";
                        if (me.controls.amount)
                            me.controls.amount.value =
                                details.total_amount || "";
                        if (me.controls.deposit_date)
                            me.controls.deposit_date.value =
                                details.deposit_date || "";
                        if (me.controls.paid_amount)
                            me.controls.paid_amount.value =
                                details.paid_amount || "";
                        if (me.controls.remarks)
                            me.controls.remarks.value = details.remark || "";
                    } else {
                        if (
                            me.searchTenant &&
                            typeof me.searchTenant.reset === "function"
                        ) {
                            me.searchTenant.reset();
                        }
                        me._selectedTenantId = null;
                        if (me.controls.tenant_id)
                            me.controls.tenant_id.value = "";
                        if (me.controls.contract_id)
                            me.controls.contract_id.value = "";
                        if (me.controls.phone_number)
                            me.controls.phone_number.value = "";
                        if (me.controls.building)
                            me.controls.building.value = "";
                        if (me.controls.space_code)
                            me.controls.space_code.value = "";
                        if (me.controls.amount) me.controls.amount.value = "";
                        if (me.controls.deposit_date)
                            me.controls.deposit_date.value = "";
                        if (me.controls.paid_amount)
                            me.controls.paid_amount.value = "";
                        if (me.controls.remarks) me.controls.remarks.value = "";
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                            me._selectedTenantId = null;
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            if (me._selectedTenantId != null) {
                                op.tenant_id = me._selectedTenantId;
                            }

                            op.amount = me.controls.amount.value;
                            op.contract_id = me.controls.contract_id.value;

                            vsapi
                                .call(
                                    `${main_view.base_url}/prm/deposit/save`,
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        me._selectedTenantId = null;
                                        cv_interact.success(
                                            me.dataOptions.id > 0
                                                ? "Deposit updated successfully."
                                                : "Deposit recorded successfully.",
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                })
                                .catch(() => {
                                    cv_interact.error(
                                        "Network error while saving deposit.",
                                    );
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };
    return self;
})();
window.DepositDialog = DepositDialog;

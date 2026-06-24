"use strict";

var DepositComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Deposit Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_deposit_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnDeposit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_deposit");
    mThis.elFilter_building = mThis.self.querySelector("#_deposit_building_id");
    mThis.elFilter_vendor = mThis.self.querySelector("#_deposit_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_deposit_status_id");

    mThis.elFilter_category = mThis.self.querySelector(
        "#_deposit_expense_type_id",
    );
    mThis.elSearch = mThis.self.querySelector("#_search_deposit");

    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-nowrap fw-semibold">${data.space_code ?? "_"}</span>
                 <span class="d-block text-muted small">${data.building_name ?? "_"}</span>`,
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
            transTitle: "titles.Refund Amount",
            className: "align-middle",
            data: (data) => {
                const refund_amount = VSMoney.formatAmount(
                    data.refund_amount,
                    data.currency_code ?? "USD",
                );
                return `<div class="text-primary-prm text-capitalize" style="width:90px;">
                        <span class="text-prm-custom" >${refund_amount || "_"}</span>
                    </div>`;
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
                        "border border-warning text-warning bg-warning-subtle",
                    paid: "border border-success text-success bg-success-subtle",
                    refunded:
                        "border border-danger text-danger bg-danger-subtle",
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
            className: "col_action align-middle",
            data: (data) => {

                if (data.status_id == 2) return "";
                return `<div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_deposit_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.DepositListView = new ListView("_deposit_list", {
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
                    mThis.DepositListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(274, false)) return;
            DepositDialog.show(op);
        };

        mThis.pr_tbl = mThis.DepositListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        const tblDeposit = mThis.DepositListView.getTable();
        if (!tblDeposit.id) tblDeposit.id = "_deposit_list_table";
        mThis.initDropdownMenus(tblDeposit);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.DepositListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.DepositListView.showPage(mThis.getFilterData());
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
            actionButtonClass: "btn_dropdown_deposit_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Receive Deposit"></span>',
                    icon: `<i class="fa-solid fa-hand-holding-dollar fa-lg" style="color: rgb(137, 185, 137);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "receive_deposit",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Deposit"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_deposit",
                },
                {
                    html: '<span class="ps-2" vslang="titles.View Refund"></span>',
                    icon: `<i class="fa-solid fa-eye fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_refund",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = parseInt(container.dataset.statusid);

                menu.receive_deposit.style.display = "none";
                menu.delete_deposit.style.display = "none";
                menu.view_refund.style.display = "none";

                if (status_id === 1) {
                    menu.receive_deposit.style.display = "block";
                }

                else if (status_id === 3) {
                    menu.delete_deposit.style.display = "block";
                    menu.view_refund.style.display = "block";
                }

            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "receive_deposit": {
                        mThis.editDeposit(id, menuLink);
                        break;
                    }
                    case "delete_deposit": {
                        mThis.deleteDeposit(id, menuLink);
                        break;
                    }
                    // case "refund_deposit": {
                    //     mThis.refundDeposit(id, menuLink);
                    //     break;
                    // }
                    case "view_refund": {
                        mThis.viewRefund(id, menuLink);
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

    mThis.viewRefund = (id, menuLink) => {
        const tr = menuLink?.closest("tr");
        const contractId = Number(tr?.dataset?.contractId ?? 0);
        if (!contractId) {
            cv_interact.error("No contract found for this deposit.");
            return;
        }
        RefundDetailsDialog.show({
            contract_id: contractId,
            onSuccess: () => {
                mThis.DepositListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.editDeposit = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
            btn: menuLink,
            onClose: () => {
                mThis.DepositListView.showPage(mThis.getFilterData());
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
                                mThis.DepositListView.showPage(
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

    // mThis.refundDeposit = (id, menuLink) => {
    //     if (!AuthManager.allowed(277, false)) return;
    //     cv_interact.confirm(
    //         "Refund this deposit? Status will be updated to 'refunded'.",
    //         {
    //             transTitle: "Refund Deposit",
    //             context: "delete",
    //             confirmButtonText: "Refund",
    //         },
    //         function (confirmed) {
    //             if (!confirmed) return;
    //             vsapi
    //                 .call(
    //                     `${mThis.base_url}/prm/deposit/update-status`,
    //                     { id: id, status_id: "refunded" },
    //                     false,
    //                     false,
    //                     false,
    //                 )
    //                 .then((res) => {
    //                     if (res.status_code === 200) {
    //                         cv_interact.success(
    //                             "Refund processed successfully.",
    //                         );
    //                         mThis.DepositListView.showPage(
    //                             mThis.getFilterData(),
    //                         );
    //                     } else {
    //                         cv_interact.error(
    //                             res.error_message ||
    //                                 "Failed to process refund.",
    //                         );
    //                     }
    //                 })
    //                 .catch(() => {
    //                     cv_interact.error(
    //                         "Network error while processing refund.",
    //                     );
    //                 });
    //         },
    //     );
    // };

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
            mThis.DepositListView.showPage(mThis.getFilterData());
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
                                    <input name="tenant_name" class="data-input form-control" data-field="tenant_name" placeholder=" " autocomplete="off" />
                                    <label vslang="labels.Tenant">Tenant</label>
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
                                    <label vslang="labels.Deposit Owed ($)"></label>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="deposit_date" class="data-input form-control form_input" data-field="deposit_date" placeholder=" "/>
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
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" inputmode="decimal" name="paid_amount" class="data-input form-control" data-field="paid_amount" placeholder=" " disabled>
                                    <label vslang="labels.Payment Amount ($)"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="ref_no" class="data-input form-control" data-field="ref_no" placeholder=" ">
                                    <label vslang="labels.Reference No."></label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label vslang="labels.Remark"></label>
                                </div>
                            </div>
                        </div>
                        `,
                    ].join("");
                },

                contentCreated: (me) => {
                    const setTenantFieldLocked = (locked) => {
                        if (!me.controls.tenant_name) return;
                        me.controls.tenant_name.disabled = locked;
                        me.controls.tenant_name.readOnly = locked;
                        if (locked && me.searchTenant) {
                            if (typeof me.searchTenant.close === "function")
                                me.searchTenant.close();
                            if (typeof me.searchTenant.hide === "function")
                                me.searchTenant.hide();
                        }
                    };
                    me.setTenantFieldLocked = setTenantFieldLocked;

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
                                    if (me.controls.paid_amount)
                                        me.controls.paid_amount.value =
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
                    DateTimePicker.initAll(me.divModal);
                },

                configSelect: [],
                onShow: (me) => {
                    const title = me.divModal.querySelector(".modal-title");
                    if (title) {
                        title.innerHTML =
                            '<h4 class="text-start text-white fw-light" vslang="titles.Receive Deposit">Receive Deposit</h4>';
                    }
                    LocaleManager.translateZone(me.divModal);
                    me.setTenantFieldLocked?.(!!me.dataOptions?.id);
                    if (!me.dataOptions?.id) {
                        setTimeout(() => {
                            if (
                                me.controls.deposit_date &&
                                !me.controls.deposit_date.value
                            ) {
                                const now = new Date();
                                const months = [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ];
                                const day = String(now.getDate()).padStart(
                                    2,
                                    "0",
                                );
                                const month = months[now.getMonth()];
                                const year = now.getFullYear();
                                me.controls.deposit_date.value = `${day}-${month}-${year}`;
                            }
                        }, 100);
                    }
                },
                prepareFormOptions: {
                    createTitle: "Receive Deposit",
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
                    const isExistingDeposit = !!(
                        me.dataOptions?.id || details?.tenant_id
                    );
                    me.setTenantFieldLocked?.(isExistingDeposit);

                    if (details) {
                        me.controls.tenant_id.value = details.tenant_id || "";
                        me.controls.contract_id.value =
                            details.contract_id || "";

                        me._selectedTenantId = details.tenant_id || null;
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
                                details.total_amount ||
                                details.paid_amount ||
                                "";
                        if (me.controls.remarks)
                            me.controls.remarks.value = details.remark || "";
                    } else {
                        me.setTenantFieldLocked?.(false);
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
                            op.paid_amount = me.controls.paid_amount.value;

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

const RefundDetailsDialog = (() => {
    const self = {};

    self.show = ({ contract_id, onSuccess }) => {
        InputBox.resetInstance("refundDetailsView");

        InputBox.show({
            title: `${LocaleManager.trans("Refund Details", "titles")}`,
            instanceKey: "refundDetailsView",
            context: "info",
            size: "lg",
            confirmButtonText: null,
            showconfirmButtonText: false,
            cancelButtonText: `${LocaleManager.trans("Close", "buttons")}`,

            createContent() {
                const div = document.createElement("div");
                div.innerHTML = `

                    <div id="_rdv_loader" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary"></div>
                        <span class="ms-2 text-muted small">Loading...</span>
                    </div>

                    <div id="_rdv_content" class="d-none">
                        <div class="d-flex align-items-center mb-3">
                            <span id="_rdv_unit_header_badge" class="badge text-primary border border-primary bg-primary-subtle px-3 py-1 fs-6">
                            </span>
                            <div style="flex:1; height:1px; background:#e0e0e0; margin-left:10px;"></div>
                        </div>
                        <div class="card shadow-sm border border-danger-subtle overflow-hidden">
                            <div class="card-body p-0">
                                <table class="table table-sm table--white mb-0 align-middle w-100">
                                    <thead class="header-uppercase table-light">
                                        <tr>
                                            <th class="text-start ps-3" vslang="titles.Tenant">Tenant</th>
                                            <th class="text-start" vslang="labels.Deposit Amount">Deposit Amount</th>
                                            <th class="text-start" vslang="labels.Deduct Amount">Deduct Amount</th>
                                            <th class="text-start" vslang="labels.Refund Amount">Refund Amount</th>
                                            <th class="text-start pe-3" vslang="labels.Remark">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="align-middle ps-3 py-3" id="_rdv_tenant"></td>
                                            <td class="align-middle text-start text-dark fw-semibold py-3" id="_rdv_deposit"></td>
                                            <td class="align-middle text-start text-danger fw-semibold py-3" id="_rdv_deduct"></td>
                                            <td class="align-middle text-start text-success fs-6 fw-bold py-3" id="_rdv_refund"></td>
                                            <td class="align-middle pe-3 py-3">
                                                <div id="_rdv_remarks" class="text-prm-custom text-wrap text-break" style="font-size: 13px; max-width: 250px; word-break: break-word;"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="p-3 border-top bg-light d-flex justify-content-end align-items-center flex-wrap gap-2 ">
                                    <div id="_rdv_date" class="text-end"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                LocaleManager.translateZone(div);
                return div;
            },

            onOpen(ibMe) {
                const divInputboxCard = InputBox._store
                    .get("refundDetailsView")
                    .container.closest(".inputbox-card");
                const btnOk = divInputboxCard.querySelector(".inputbox-btn.ok");
                btnOk.classList.add("d-none");

                const restore = () => btnOk.classList.remove("d-none");
                divInputboxCard.addEventListener("click", function handler(e) {
                    const isClose = e.target.closest(
                        ".inputbox-btn.cancel, .inputbox-close, .btn-close, [data-dismiss]",
                    );
                    if (isClose) {
                        restore();
                        divInputboxCard.removeEventListener("click", handler);
                    }
                });

                const loader = document.getElementById("_rdv_loader");
                const content = document.getElementById("_rdv_content");
                const depositEl = document.getElementById("_rdv_deposit");
                const deductEl = document.getElementById("_rdv_deduct");
                const refundEl = document.getElementById("_rdv_refund");
                const remarksEl = document.getElementById("_rdv_remarks");
                const dateEl = document.getElementById("_rdv_date");

                vsapi
                    .call(
                        `${main_view.base_url}/prm/contract/details`,
                        { id: contract_id },
                        null,
                        null,
                    )
                    .then((res) => {
                        loader.classList.add("d-none");
                        content.classList.remove("d-none");

                        if (
                            res.status_code !== 200 ||
                            !res.data ||
                            !res.data.refund_details
                        ) {
                            content.innerHTML = `<div class="alert alert-danger mb-0">No refund details found for this contract.</div>`;
                            return;
                        }

                        const details = res.data;
                        const refund = details.refund_details;
                        const currency = details.currency_code ?? "USD";

                        const tenantInfo = `
                        <span class="d-block text-prm-custom text-nowrap text-capitalize fw-semibold">${details.tenant_name ?? ""}</span>
                        <small class="d-block text-muted text-nowrap">${details.phone_number ?? ""}</small>
                        <small class="d-block text-muted text-nowrap" style="font-size: 11px;">${details.email ?? ""}</small>
                    `;
                        const unitInfo = `
                        <span class="d-block text-prm-custom text-nowrap fw-semibold">${details.space_code ?? ""}</span>
                        <small class="d-block text-muted text-nowrap">${details.space_name ?? ""}</small>
                    `;

                        document.getElementById("_rdv_tenant").innerHTML =
                            tenantInfo;
                        const headerBadge = document.getElementById(
                            "_rdv_unit_header_badge",
                        );
                        if (headerBadge) {
                            headerBadge.textContent = details.space_code
                                ? `${LocaleManager.trans("Unit", "labels")}: ${details.space_code}`
                                : LocaleManager.trans("Unit Details", "labels");
                        }

                        depositEl.textContent = VSMoney.formatAmount(
                            refund.deposit_amount,
                            currency,
                        );
                        deductEl.textContent = VSMoney.formatAmount(
                            refund.deduct_amount,
                            currency,
                        );
                        refundEl.textContent = VSMoney.formatAmount(
                            refund.refund_amount,
                            currency,
                        );
                        remarksEl.textContent = refund.remarks || "_";

                        const statusKey = String(refund.status).toLowerCase();
                        let dateHtml = `
                            <small class="text-prm-custom d-block" style="font-size: 11px;">
                                ${LocaleManager.trans("Refunded on", "labels")}: ${refund.updated_at ?? ""}
                            </small>
                        `;
                        dateEl.innerHTML = dateHtml;
                    })
                    .catch(() => {
                        loader.classList.add("d-none");
                        content.classList.remove("d-none");
                        content.innerHTML = `<div class="alert alert-danger mb-0">Failed to load refund details.</div>`;
                    });
            },
        });
    };

    return self;
})();

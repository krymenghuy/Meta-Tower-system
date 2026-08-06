"use strict";
var PayrollComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_payrollComponent",
    );

    mThis.title_prop = "Payroll";
    mThis.elAuthorized = mThis.self.querySelector("#el_authorized");
    mThis.elDisbursed = mThis.self.querySelector("#el_disbursed");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddpayroll");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_payroll");

    const monthNames = [
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

    mThis.cols = [
    {
        title: "",
        className: "align-middle text-center",
        data: "",
    },
    {
        transTitle: "titles.Name",
        className: "align-middle text-nowrap",
        data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-prm-custom">${data.name}</span>
                <small class="text-muted">
                    <i class="fa-solid fa-hashtag me-1"></i><span class="text-danger-emphasis">${ data.p_number ? data.p_number == 1 ? "(First)" : data.p_number == 2 ? "(Second)" : "Other" : "" }</span>
                </small>
            </div>
        `,
    },
    {
        transTitle: "titles.Staff Count",
        className: "text-center align-middle",
        data: (data) => `
            <a href="javascript:void(0)"
               class="show_payroll_list badge bg-light text-dark border px-3 py-2"
               data-id="${data.id}">
                <i class="fa-solid fa-users me-1 text-primary"></i>
                <span>${data.head_count}</span>
            </a>
        `,
    },
    {
        transTitle: "titles.Duration",
        className: "align-middle",
        data: (data) => `
            <span class="text-prm-custom text-nowrap">
                ${data.start_date ?? "-"} - ${data.end_date ?? "-"}
            </span>
        `,
    },
   
    {
        transTitle: "titles.Total",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="fw-bold text-success">
                ${VSMoney.formatAmount(data.total, data.currency_code ?? "USD")}
            </span>
        `,
    },
    {
        transTitle: "titles.Exchange Rate",
        className: "align-middle text-nowrap text-center",
        data: (data) => `
            <span class="badge bg-light text-dark border px-3 py-2">
                 ${VSMoney.formatAmount(data.exchange_rate,"KHR")}
            </span>
        `,
    },
   {
        transTitle: "titles.Last Updated",
        className: "align-middle text-nowrap",
        data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                <span class="text-muted small">${data.updated_at ?? ""}</span>
            </div>`,
    },
    {
        transTitle: "titles.Authorize",
        className: "align-middle text-nowrap text-center",
        data: (data) => `
            <span class="badge px-3 py-2 ${
                data.authorized
                    ? "bg-success text-white"
                    : "bg-warning text-white"
            }">
                <i class="fa-solid ${
                    data.authorized ? "fa-check-circle" : "fa-clock"
                } me-1"></i>
                ${data.authorized ? "Approved" : "Pending"}
            </span>
        `,
    },
    {
        transTitle: "titles.Disbursed",
        className: "align-middle text-nowrap text-center",
        data: (data) => `
            <span class="badge px-3 py-2 ${
                data.disbursed
                    ? "bg-success text-white"
                    : "bg-warning text-white"
            }">
                <i class="fa-solid ${
                    data.disbursed
                        ? "fa-money-check-dollar"
                        : "fa-hourglass-half"
                } me-1"></i>
                ${data.disbursed ? "Disbursed" : "Pending"}
            </span>
        `,
    },
    {
        transTitle: "titles.Action",
        className: "align-middle",
        data: (data) => `
            <div class="d-flex align-items-center gap-2">

                <button
                    class="btnAuthorized d-flex justify-content-center align-items-center bg-info rounded-2 border-0"
                    data-id="${data.id}"
                    style="width:25px; height:25px;"
                    id="_btnAuthorized">
                    <i class="fa-solid fa-check tool-tip" style="color:#fff;">
                        <span class="tool-tiptext">
                            ${LocaleManager.trans("Authorize", "titles")}
                        </span>
                    </i>
                </button>

                <button
                    class="btnReset d-flex justify-content-center align-items-center bg-danger rounded-2 border-0"
                    data-id="${data.id}"
                    style="width:25px; height:25px;"
                    id="_btnReset">
                    <i class="fa-solid fa-reply fs-10 tool-tip" style="color:#fff;">
                        <span class="tool-tiptext">
                            ${LocaleManager.trans("Reset", "titles")}
                        </span>
                    </i>
                </button>

                <button
                    class="btnDisbursed d-flex justify-content-center align-items-center bg-success rounded-2 border-0"
                    data-id="${data.id}"
                    style="width:25px; height:25px;"
                    id="_btnDisburse">
                    <i class="fa-solid fa-square-check fs-6 tool-tip" style="color:#fff;">
                        <span class="tool-tiptext">
                            ${LocaleManager.trans("Disburse", "titles")}
                        </span>
                    </i>
                </button>

            </div>
        `,
    },
    {
        title: "",
        className: "col_action align-middle",
        data: (data) => `
            <div class="d-flex justify-content-center align-items-center">
                <a
                    href="javascript:void(0)"
                    class="btn_payroll_action"
                    data-id="${data.id}">
                    <img
                        src="${main_view.asset_url}/images/icons/more_vert (3).svg"
                        alt="More Actions">
                </a>
            </div>
        `,
    },
];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView("_payroll_list", {
            fetchApi: `${main_view.base_url}/mhr/payroll/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.classList.add("tr_action");
            },
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: (p) => {
                    if (!p) return;

                    mThis.PayrollListView.showPage();
                },
            };
            // content.parentElement.classList.add('d-none');
            // if (!AuthManager.allowed(473)) return;
            AddPayRollListDialog.show(op);
        };

        mThis.pr_tbl = mThis.PayrollListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };

        mThis.pr_tbl.onclick = (e) => {
            let lnk = VSUtil.closestLimited(e.target, "a.show_payroll_list");
            if (lnk) {
                const op = { payroll_id: lnk.dataset.id };
                VSRoute.showComponent("PayrollListComponent", op);
                return;
            }

            //     // *** You can add other action button click here like mThis
            //    lnk = VSUtil.closestLimited(e.target,'a.other_click_action');
            //    if(lnk){
            //      //do something when user clicks on "other_click_action"
            //      return;
            //    }
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.PayrollListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PayrollListView.showPage(mThis.getFilterData());
            }, 200);
        });

        mThis.pr_table = mThis.PayrollListView.getTable();
        mThis.initDropdownMenus(mThis.pr_table);
        mThis.setActionListeners();
        mThis.initAlready = true;
    };
    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btnAuthorized");
            if (btn) {
                mThis.authorizePayroll(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btnReset");
            if (btn) {
                mThis.resetPayroll(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btnDisbursed");
            if (btn) {
                mThis.disbursePayroll_all(btn.dataset.id, btn);
            }
        });
    };
    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_payroll_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang=titles.Authorize> Authorize </span>',
                    icon: '<i class="fa-regular fa-circle-check fs-5 text-primary"></i>',
                    name: "change_authorize",
                },
                {
                    html: '<span class="ps-2" vslang=titles.Reset> Reset</span>',
                    icon: '<i class="fa fa-reply fs-5 text-danger"></i>',
                    name: "reset_authorize",
                },
                {
                    html: '<span class="ps-2" vslang=titles.Disburse All> Disburse All</span>',
                    icon: '<i class="fa-solid fa-square-check fs-5 text-success"></i>',
                    name: "change_disbursed",
                },
                {
                    html: '<span class="ps-2" vslang=titles.Modify Payroll>Modify Payroll</span>',
                    icon: '<i class="fa-regular fa-edit fs-5 text-warning"></i>',
                    name: "edit_payroll",
                },
                {
                    html: '<span class="ps-2" vslang=titles.Delete Payroll>Delete Payroll</span>',
                    icon: '<i class="fa-regular fa-trash-can fs-5 text-danger"></i>',
                    name: "delete_payroll",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const authorized = container.dataset.authorized;

                if (authorized == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display =
                                menu[item].dataset.mnuaction ===
                                    "edit_payroll" ||
                                menu[item].dataset.mnuaction ===
                                    "delete_payroll" ||
                                menu[item].dataset.mnuaction ===
                                    "change_authorize"
                                    ? "none"
                                    : "block";
                        }
                    }
                }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_authorize":
                        mThis.authorizePayroll(id, menuLink);
                        break;
                    case "reset_authorize":
                        mThis.resetPayroll(id, menuLink);
                        break;
                    case "change_disbursed":
                        mThis.disbursePayroll_all(id, menuLink);
                        break;
                    case "edit_payroll":
                        mThis.editPayroll(id, menuLink);
                        break;
                    case "delete_payroll":
                        mThis.deletePayroll(id, menuLink);
                        break;
                }
            },
        };
        new VSDropdownMenu(menuOptions);
        table.querySelectorAll("a.btn_payroll_action").forEach((e) => {
            const isAuthorized = e.dataset.authorized == "1";

            menuOptions.menus.forEach((el, i) => {
                // const action = el.dataset.mnuaction;
                if (isAuthorized) {
                    if (
                        el.name === "edit_payroll" ||
                        el.name === "delete_payroll"
                    ) {
                        delete menuOptions.menus[i];
                    }
                } else {
                    menuOptions.menus[i + 1] = menuOptions.menus[i];
                }
            });
        });
    };

    mThis.authorizePayroll = (id, menuLink) => {
        let p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };

        // if (!AuthManager.allowed(474)) return;
        cv_interact.confirm(
            "authorize_payroll",
            {
                title: "Authorize Payroll",
                context: "authorize",
                confirmButtonText: LocaleManager.trans("Authorize", "buttons"),
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${mThis.base_url}/mhr/payroll/authorize`, p)
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Authorized successfully");
                                mThis.PayrollListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            },
        );
    };
    mThis.resetPayroll = (id, menuLink) => {
        const p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        // if (!AuthManager.allowed(475)) return;
        cv_interact.confirm(
            'html:<span class="d-block">Are you sure you want to reset this payroll?</span> <small>This action will reverse all payroll transactions from staff payroll accounts back to the master payroll account!</small>',
            {
                title: "Reset Payroll",
                context: "delete",
                confirmButtonText: LocaleManager.trans("Reset", "buttons"),
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${mThis.base_url}/mhr/payroll/reset`,
                            p,
                            false,
                            null,
                        )

                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Payroll has been reset!");
                                mThis.PayrollListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else cv_interact.error(res.error_message);
                        });
                }
            },
        );
    };
    mThis.disbursePayroll_all = (id, menuLink) => {
        const p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        // if (!AuthManager.allowed(476)) return;
        cv_interact.confirm(
            "disburse_payroll",
            {
                title: "Disburse Payroll",
                context: "disburse",
                confirmButtonText: LocaleManager.trans("Disburse", "buttons"),
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${mThis.base_url}/mhr/payroll/disburse-all`,
                            p,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success(
                                    "Payroll disbursement was successful!",
                                );
                                mThis.PayrollListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            },
        );
    };

    mThis.editPayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        // if (!AuthManager.allowed(477)) return;
        AddPayRollListDialog.show(op);
    };
    mThis.deletePayroll = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
        };
        // if (!AuthManager.allowed(478)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/payroll/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_payroll");
                                mThis.PayrollListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else cv_interact.error(res.error_message);
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            },
        );
    };

    mThis.getFilterData = () => {
        const p = {
            search_value: mThis.elSearch.value,
            disbursed: mThis.elDisbursed.value,
            authorized: mThis.elAuthorized.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });
        return p;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/payroll/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elAuthorized,
                    d.authorized,
                    "id",
                    "name",
                    "",
                    "All Authorization",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elDisbursed,
                    d.disbursed,
                    "id",
                    "name",
                    "",
                    "All Disbursement",
                    "",
                );
            });
    };
    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.PayrollListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const AddPayRollListDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        const months = [
            { value: 0, name: "select month" },
            { value: 1, name: "Jan" },
            { value: 2, name: "Feb" },
            { value: 3, name: "Mar" },
            { value: 4, name: "Apr" },
            { value: 5, name: "May" },
            { value: 6, name: "Jun" },
            { value: 7, name: "Jul" },
            { value: 8, name: "Aug" },
            { value: 9, name: "Sep" },
            { value: 10, name: "Oct" },
            { value: 11, name: "Nov" },
            { value: 12, name: "Dec" },
        ];

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 11 },
                        (_, i) => currentYear + i,
                    );

                    return [
                        `<div class="row g-3">
                        <div class="col-md-3">
                            <select data-style="material" name="month" class="data-input" data-field="month" placeholder="${LocaleManager.trans("Month", "labels")}">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`,
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select data-style="material" name="year" class="data-input" data-field="year" placeholder="${LocaleManager.trans("Year", "labels")}">
                                <option value="0">select year</option>
                                ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`,
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="p_number" class="data-input form-control" data-field="p_number" id="p_number" placeholder="${LocaleManager.trans("Payroll Number", "labels")}">
                                <option value="0">select number</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <div class="vs-material-field">
                                <input name="name" class="form-control data-input form_input" data-field="name" placeholder=" " />
                                <label vslang="titles.Name"></label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input data-type="date" name="start_date" class="form-control data-input" data-field="start_date" required />
                                <label vslang="labels.Start Date"></label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input data-type="date" name="end_date" class="form-control data-input" data-field="end_date" required />
                                <label vslang="labels.End Date"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans("Currency Code", "labels")}" disabled></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="number" name="exchange_rate" class="form-control data-input" data-field="exchange_rate" placeholder=" " />
                                <label vslang="labels.Exchange Rate"></label>
                            </div>
                        </div>

                    </div>`,
                    ].join("");
                },

                contentCreated: (me) => {},

                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    },
                ],

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/payroll/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_payroll",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "update_success_payroll",
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "vslang:titles.Add Payroll",
                    modifyTitle: "vslang:titles.Edit Payroll",
                    targetProp: "payrolls",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/payroll/form-options",
                        ].join(""),
                        params: (me, op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    if (!me.dataOptions?.id && me.controls?.currency_code) {
                        me.controls.currency_code.value = "USD";
                    }

                    const { payrolls } = data;

                    if (payrolls) {
                        me.controls.name.value = payrolls.name;
                        me.controls.month.value = payrolls.month;
                        me.controls.year.value = payrolls.year;
                        me.controls.start_date.value = payrolls.start_date;
                        me.controls.end_date.value = payrolls.end_date;
                        me.controls.exchange_rate.value =
                            payrolls.exchange_rate;
                        me.controls.p_number.value = payrolls.p_number;
                    } else {
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/payroll/get-end-date`,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.controls.start_date.value =
                                        res.data.end_date;
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    }

                    const updatePayrollName = () => {
                        const month =
                            months[parseInt(me.controls.month.value)]?.name ||
                            "";

                        const year = me.controls.year.value
                            ? `-${me.controls.year.value}`
                            : "";

                        const number = me.controls.p_number.value
                            ? `-${me.controls.p_number.value}`
                            : "";

                        me.controls.name.value = `${month}${year}${number}`;
                    };

                    updatePayrollName();

                    me.controls.month.onchange = updatePayrollName;
                    me.controls.year.onchange = updatePayrollName;
                    me.controls.p_number.oninput = updatePayrollName;
                },
            });

        dialog.show(op);
    };
    return self;
})();

"use strict";
var PayrollComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_payrollComponent");
    
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
            className: "align-middle text-capitalize text-nowrap",
            data: "",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => `<div class="d-block">
                            <p class="p-0 m-0" style="color:#2b3991;">${
                                data.name
                            }</p>
                            <small class="text-success">${
                                data.p_number
                                    ? data.p_number == 1
                                        ? "(First)"
                                        : data.p_number == 2
                                        ? "(Second)"
                                        : "Other"
                                    : ""
                            }</small>

                        </div>`,
        },
        {
            title: "Duration",
            className: "align-middle w-15",
            data: (data) =>
                `<span class="text-dark">(<small class="text-dark">${
                    data.start_date ?? ""
                }​ <small class="text-warning">~</small> ${
                    data.end_date ?? ""
                }</small>)</span>`,
        },
        {
            title: "Staff Count",
            className: "align-middle",
            data: (data) =>
                `<a href="javascript:void(0);" class="text-success show_payroll_list" data-id="${data.id}">${data.head_count}</a>`,
        },

        {
            title: "Total",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.total,
                    data.currency_code ?? 'USD'
                )}</p>`;
            },
        },
        {
            title: "Exchange Rate",
            className: "align-middle w-12",
            data: (data) => {
                let x_rate = data.exchange_rate;
                // if (x_rate >= 1) {
                //     x_rate = VSMoney.formatAmount(x_rate, null, null, {
                //         minimumFractionDigits: 2,
                //         maximumFractionDigits: 2,
                //         useGrouping: true,
                //     });
                // }
                return `<p class="p-0 m-0">${x_rate}</p>`;
            },
        },
        {
            title: "Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="text-warning fw-semibold">${data.update_user}</span>
                    <span>
                        <small class="text-nowrap">${data.update_date}</small>
                    </span>
                </div>`;
            },
        },
        {
            title: "Authorize",
            className: "authorized text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-2";
                let bg_color = "";
                let cls_icon = "";

                if (data.authorized === 1) {
                    cls_class =
                        "text-white text-center border border-success rounded-2 p-1";
                    bg_color = "#28a745";
                    cls_icon = "fa fa-check text-center align-center justify-content-center";
                } else if (data.authorized === 0) {
                    cls_class =
                        "text-white text-center align-center border border-warning rounded-2 p-1";
                    bg_color = "#ffc107";
                    cls_icon = "fa fa-times text-center align-center justify-content-center";

                }

                return `<div><a class="d-block" data-authorized="${
                    data.authorized
                }" data-id="${data.id}" href="javascript:void(0)">
                            <small style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                            <i class="${cls_icon}" style="font-size: 10px;"></i>
                                ${data.authorized == 0 ? "Pending" : "Approved"}
                            </small>
                        </a></div>`;
            },
        },
        {
            title: "Disbursed",
            className: "status text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-2";
                let bg_color = "";
                let cls_icon = "";

                if (data.disbursed === 1) {
                    cls_class =
                        "text-white text-center border border-success rounded-2 p-1";
                    bg_color = "#28a745";
                    cls_icon = "fa fa-check text-center align-center justify-content-center";
                } else if (data.disbursed === 0) {
                    cls_class =
                        "text-white text-center border border-warning rounded-2 p-1";
                    bg_color = "#ffc107";
                    cls_icon = "fa fa-times text-center align-center justify-content-center";
                }

                return `<div><a class="d-block" data-status="${
                    data.disbursed
                }" data-id="${data.id}" href="javascript:void(0)">
                            <small style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                            <i class="${cls_icon}" style="font-size: 10px;"></i>
                                ${data.disbursed == 0 ? "Pending" : "Disbursed"}
                            </small>
                        </a></div>`;
            },
        },
        {
            title: "Actions",
            className: "align-middle",
            data: (data) =>
                `<div class="d-flex align-items-center gap-1">
                    <button class="btnAuthorized d-flex justify-content-center align-items-center bg-info rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnAuthorized">
                            <i class="fa-solid fa-check tool-tip" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Authorize','titles')}</span></i>
                    </button>
                    <button class="btnReset d-flex justify-content-center align-items-center bg-danger rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnReset">
                            <i class="fa-solid fa-reply fs-10 tool-tip" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Reset','titles')}</span></i>
                    </button>
                    <button class="btnDisbursed d-flex justify-content-center align-items-center bg-success rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnDisburse">
                            <i class="fa-solid fa-square-check tool-tip fs-6" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Disburse','titles')}</span></i>
                    </button>
                </div>`,
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <a href="javascript:void(0)"
                       class="btn_payroll_action"
                       data-id="${data.id}">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>`,
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
                // id: 1,
                btn: e.target,
                onClose: (p) => {
                    if (!p) return;

                    mThis.PayrollListView.showPage();
                },
            };
            // content.parentElement.classList.add('d-none');
            if (!AuthManager.allowed(473)) return;
            AddPayRollListDialog.show(op);
        };

        mThis.pr_tbl = mThis.PayrollListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
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
                    html: '<span class="ps-2"> Authorize </span>',
                    icon: '<i class="fa-regular fa-circle-check"></i>',
                    name: "change_authorize",
                },
                {
                    html: '<span class="ps-2"> Reset</span>',
                    icon: '<i class="fa fa-reply"></i>',
                    name: "reset_authorize",
                },
                {
                    html: '<span class="ps-2"> Disburse All</span>',
                    icon: '<i class="fa-solid fa-square-check"></i>',
                    name: "change_disbursed",
                },
                {
                    html: '<span class="ps-2">Modify Payroll</span>',
                    icon: '<i class="fa-regular fa-edit fs-5"></i>',
                    name: "edit_payroll",
                },
                {
                    html: '<span class="ps-2">Delete Payroll</span>',
                    icon: '<i class="fa-regular fa-trash-can fs-5"></i>',
                    name: "delete_payroll",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const authorized = container.dataset.authorized;

                if (authorized == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display = menu[item].dataset.mnuaction === "edit_payroll" || menu[item].dataset.mnuaction === "delete_payroll" ||menu[item].dataset.mnuaction === "change_authorize"? "none": "block";
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

        if (!AuthManager.allowed(474)) return;
        cv_interact.confirm(
            "Authorize this payroll?",
            {
                title: "Authorize Payroll",
                context: "authorize",
                confirmButtonText: "Authorize",
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
            }
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
        if (!AuthManager.allowed(475)) return;
        cv_interact.confirm(
            'html:<span class="d-block">Are you sure you want to reset this payroll?</span> <small>This action will reverse all payroll transactions from staff payroll accounts back to the master payroll account!</small>',
            {
                title: "Reset Payroll",
                context: "delete",
                confirmButtonText: "Reset Now",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${mThis.base_url}/mhr/payroll/reset`,
                            p,
                            false,
                            null
                        )

                        .then((res) => {

                            if (res.status_code === 200) {
                                cv_interact.success("Payroll has been reset!");
                                mThis.PayrollListView.showPage(mThis.getFilterData());
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
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
        if (!AuthManager.allowed(476)) return;
        cv_interact.confirm(
            "Disburse this payroll?",
            {
                title: "Disburse Payroll",
                context: "disburse",
                confirmButtonText: "Disburse",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${mThis.base_url}/mhr/payroll/disburse-all`, p,false)
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Payroll disbursement was successful!");
                                mThis.PayrollListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
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
        if (!AuthManager.allowed(477)) return;
        AddPayRollListDialog.show(op);
    };
    mThis.deletePayroll = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink
        };
        if (!AuthManager.allowed(478)) return;
        cv_interact.confirm(
            "Delete this payroll?",
            {
                title: "Delete Payroll",
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
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Payroll has been deleted!");
                                mThis.PayrollListView.showPage(mThis.getFilterData());
                            } else cv_interact.error(res.error_message);
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            }
        );
    };

    mThis.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/payroll/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elAuthorized,
                    d.authorized,
                    "id",
                    "name",
                    true,
                    "All",
                    null
                );
                VSUtil.setComboItems(
                    mThis.elDisbursed,
                    d.disbursed,
                    "id",
                    "name",
                    true,
                    "All",
                    null
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
    let dialogAdd = null;
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

        dialogAdd =
            dialogAdd ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 11 },
                        (_, i) => currentYear + i
                    );

                    return [
                        `<div class="row">
                        <div class="form-group col-4">
                            <label for="month" class="form-label" vslang="titles.Month"></label>
                            <select name="month" class="data-input" data-field="month">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="year" class="form-label" vslang="titles.Year"></label>
                            <select name="year" class="data-input" data-field="year">
                                <option value="0">select year</option>
                                ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>

                        <div class="form-group col-4">
                            <label for="p_number" class="form-label" vslang="titles.Payroll Number"></label>
                            <select name="p_number" class="data-input form_input" data-field="p_number">
                                <option value="0">select number</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="name" class="form-label" vslang="titles.Name"></label>
                            <input name="name" class="form-control data-input form_input" data-field="name" placeholder="auto" />
                        </div>
                        <div class="form-group col-4">
                            <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                            <input name="start_date" class="form-control data-input form_input" data-field="start_date" />
                        </div>
                        <div class="form-group col-4">
                            <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                            <input name="end_date" class="form-control data-input form_input" data-field="end_date" />
                        </div>
                        <div class="form-group col-4">
                            <label for="currency_code" class="form-label" vslang="titles.Currency">Currency</label>
                            <select  class="modal-select data-input" name="currency_code" data-field="currency_code" disabled>
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate"></label>
                            <input name="exchange_rate" type="number" class="form-control data-input" data-field="exchange_rate" />
                        </div>


                    </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.start_date);
                    DateTimePicker.init(me.controls.end_date);
                },

                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    }
                ],

                buttons: [
                    {
                        label: '<span class="text-warning" vslang="titles.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span vslang='titles.save'></span>",
                        cssClass: "btn btn-primary",
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
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Payroll is updated successfully"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New payroll is created successfully"
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
                    createTitle: "Add Payroll",
                    modifyTitle: "Edit Payroll",
                    targetProp: "payrolls",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/payroll/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                    me.controls.currency_code.value = VSMoney.getCurrency().code;
                    const { payrolls } = data;
                    if (payrolls) {
                        me.controls.name.value = payrolls.name;
                        me.controls.month.value = payrolls.month;
                        me.controls.year.value = payrolls.year;
                        me.controls.start_date.value = payrolls.start_date;
                        me.controls.end_date.value = payrolls.end_date;
                        me.controls.exchange_rate.value = payrolls.exchange_rate;
                        me.controls.p_number.value = payrolls.p_number;
                        // me.controls.total.value = payrolls.total;
                    } else {
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/payroll/get-end-date",
                                ].join(""),
                                null,
                                null,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.controls.start_date.value =
                                        res.data.end_date;
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    }
                    me.payroll_name = "";
                    me.month = payrolls ? months[payrolls.month].name : "";
                    me.year = payrolls ? "-" + payrolls.year : "-";
                    me.p_number = payrolls ? "-" + payrolls.p_number : "-";
                    me.controls.month.onchange = (e) => {
                        me.month = e.target.textContent;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };
                    me.controls.year.onchange = (e) => {
                        me.year = "-" + e.target.textContent;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };
                    me.controls.p_number.onchange = (e) => {
                        me.p_number = "-" + e.target.value;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };

                    LocaleManager.translateZone(me.divModal);
                },

            });

        dialogAdd.show(op);
    };
    return self;
})();

// document.addEventListener('DOMContentLoaded', () => {
//     document.body.addEventListener('click', function (event) {
//         if (event.target.classList.contains('payroll-link')) {
//             const payrollId = event.target.getAttribute('data-payroll-id');
//             const option = {
//                  payroll_id: payrollId
//                 };

//             if (typeof PayrollListComponent !== 'undefined' && PayrollListComponent.show) {
//                 VSRoute.showComponent('PayrollListComponent', option);
//                 //PayrollListComponent.show(option);
//             } else {
//                 console.error('PayrollListComponent.show is not defined.');
//             }
//         }
//     });
// });

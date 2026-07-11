var PayrollAccountComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_accountComponent");
    mThis.title_prop = "Account";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddAccount");
    mThis.btnAddAccountMissing = mThis.self.querySelector("#_btnAddAccountMissing");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_sdl_search_account");
    mThis.elDepartment = mThis.self.querySelector("#el_department");
    mThis.elAccount = mThis.self.querySelector("#el_account");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_account");
    mThis._transaction_info = mThis.self.querySelector("#_transaction_info");
    mThis.btnPrintTransaction = mThis.self.querySelector("#_print_transaction");
    mThis.divListView = mThis.self.querySelector('#_account_list');

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-capitalize text-nowrap w-15",
            data: (data, index, tr) => {
                return `
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.emp_name ?? ""
                                }</span>
                                <br/>
                                <span style="font-size: 11px; color: gray;">${
                                    data.position ?? ""
                                }</span>
                            </div>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Account Type",
            className: "align-middle",
            data: (data, index, tr) => {
                 return `<div class="text-primary-custom" style="width:80px;">
                            <span class="badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis text-capitalize d-inline-block text-center" style="min-width:70px">
                                ${data.account_type ?? ""}
                            </span>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Account Number",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ""}</p>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.balance,data.currency_code)}</p>`;
            },
        },

        {
            transTitle: "titles.Last Balance Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ""}</p>`;
            },
        },
        {
            transTitle: "titles.Currency",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.currency_code ?? ""}</p>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_account_action"
                    }" data-id="${data.id}" data-emp_id="${
                data.emp_id
            }" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.AccountListView = new ListView(mThis.divListView, {
            fetchApi: `${main_view.base_url}/mhr/account/payroll-account/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden  header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                btn: e.target,
                onClose: () => {
                    mThis.AccountListView.showPage();
                },
            };
            if (!AuthManager.allowed(315)) return;
            AccountDialog.show(op);
        };
        mThis.btnAddAccountMissing.onclick = function (e) {
            e.preventDefault();
            const op = {
                account_type: "Payroll",
            };
            if (!AuthManager.allowed(210)) return;
            cv_interact.confirm(
                'html:<span class="d-block fw-semibold text-success">Create accounts for all staff? </span><small>This process will create payroll account for staff who do not have an account yet!</small>',
                {
                    title: "Bulk Create Accounts",
                    context: "update", //NOTE that now "context" can be "delete" for red color, and "update" for Green color
                    confirmButtonText: "Bulk Create",
                },
                function (confirmation) {
                    if (confirmation) {
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/account/bulk-create",
                                ].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    const d = res.data;
                                    if (d.success_count > 0) {
                                        mThis.AccountListView.showPage(
                                            mThis.getFilterData()
                                        );
                                        cv_interact.success(
                                            `${d.success_count} accounts have been created!`
                                        );
                                    } else
                                        cv_interact.info(
                                            "No account were created! Maybe because all staff already have an account!"
                                        );
                                } else cv_interact.error(res.error_message);
                            });
                    }
                }
            );
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_content_account = mThis.self.querySelector(
                "#sub_content_account"
            );
            sub_content_account.classList.remove("d-none");
            const view_transaction =
                mThis.self.querySelector("#view_transaction");
            view_transaction.classList.add("d-none");
        };

        const pr_tbl = mThis.AccountListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.AccountListView.showPage(mThis.getFilterData());
            };
        });

        mThis.initAlready = true;
    };

    mThis.renderTransaction = (data) => {
        if (!data || !data[0] || !data[0].trx) {
            console.error("Invalid data format");
            return;
        }

        const employee = data[0];
        const transactions = employee.trx;

        let html = `
            <style>
                .transaction_card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    width: 98%;
                }
                .transaction_header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 10px;
                    padding-bottom: 20px;
                }
                .transaction_logo {
                    position: absolute;
                    left: 0;
                }
                .transaction_title {
                    text-align: center;
                    flex-grow: 1;
                }
                .transaction_profile {
                    gap: 10px;
                    justify-content: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 5px;
                }
                .transaction_image {
                    display: flex;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .transaction_table {
                    display: flex;
                    padding: 10px;
                }
            </style>
            <div class="transaction_card overflow-y-auto overflow-x-hidden">
                <div class="transaction_header">
                    <div class="transaction_logo">
                        <img src="${
                            main_view.base_url
                        }/assets/images/logo/lc_logo.svg" alt="Company Logo">
                    </div>
                    <div class="transaction_title">
                        <h4>Transaction</h4>
                    </div>
                </div>
                <div class="transaction_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="transaction_image">
                                <img src="${
                                    employee.image_url
                                }" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.emp_name
                                }</p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Number</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${
                                    employee.account_number
                                }</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Balance</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.balance
                                }</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Type</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap">${
                                    employee.account_type
                                }</p>
                            </div>
                             <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Currency</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.currency_code
                                }</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Last Balance Date</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.last_balance_date
                                }</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction_table row" style="display: flex !important;">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Trx Type</th>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions
                                    .map(
                                        (trx) => `
                                    <tr>
                                        <td>${
                                            trx.trx_type === 1
                                                ? "Deposit"
                                                : trx.trx_type === 2
                                                ? "Withdrawal"
                                                : "Transfer"
                                        }</td>
                                       <td>${trx.from_account_number ?? 'N/A'}</td>
                                        <td>${trx.to_account_number ?? 'N/A'}</td>
                                        <td class="${
                                            trx.status === "in"
                                                ? "text-success"
                                                : "text-danger"
                                        }">
                                            ${Number(trx.amount)
                                                .toLocaleString("en-US")
                                                .replace(/,/g, " ")}
                                        </td>
                                        <td>${trx.created_at}</td>
                                        <td>
                                            <span class="${
                                                trx.status === "in"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }">
                                                ${trx.status}
                                            </span>
                                        </td>
                                        <td>${trx.remarks ?? 'N/A'}</td>
                                    </tr>
                                `
                                    )
                                    .join("")}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        `;

        mThis._transaction_info.innerHTML = html;
    };

    mThis.btnPrintTransaction.addEventListener("click", () => {
        windowPrintTransaction(mThis._transaction_info.innerHTML);
        // window.print();
    });

    mThis.elSearch.addEventListener("keyup", (e) => {
        e.preventDefault();
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.AccountListView) {
                mThis.AccountListView.showPage(mThis.getFilterData());
            } else {
                console.error("Payroll account is not defined");
            }
        }, 200);
    });

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_account_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Deposit Cash">Deposit Cash</span>',
                    icon: `<i class="fa fa-calculator"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "deposit_amount",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.View Transactios">View Transaction</span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_transaction",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Transfer">Transfer</span>',
                    icon: `<i class="fa-solid fa-money-bill-transfer"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "transfer",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Account Details"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Account">Delete Account</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_account",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                // Ensure 'deposit_amount' is part of the menu and exists before hiding it
                if (menu.deposit_amount) {
                    menu.deposit_amount.style.display = "block";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "transfer": {
                        mThis.transfer(id, menuLink);
                        break;
                    }
                    case "deposit_amount": {
                        mThis.deposit_amount(id, menuLink);
                        break;
                    }
                    case "view_transaction": {
                        mThis.viewTransaction(id, menuLink);
                        break;
                    }
                    case "edit_account": {
                        mThis.editAccount(id, menuLink);
                        break;
                    }
                    case "delete_account": {
                        mThis.deleteAccount(id, menuLink);
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
    mThis.transfer = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(327)) return;
        TransferDialog.show(op);
    };
    mThis.deposit_amount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(326)) return;
        DepositDialog.show(op);
    };

    mThis.viewTransaction = (id, menuLink) => {
        const sub_content_account = mThis.self.querySelector(
            "#sub_content_account"
        );
        sub_content_account.classList.add("d-none");
        const view_transaction = mThis.self.querySelector("#view_transaction");
        view_transaction.classList.remove("d-none");

        let emp_id = menuLink.dataset.emp_id;
        let op = {
            emp_id: emp_id,
            account_id: id,
        };
        if (!AuthManager.allowed(328)) return;
        vsapi
            .call(
                `${main_view.base_url}/mhr/account/print-transaction`,
                op,
                false,
                false,
                false
            )
            .then((res) => {
                if (res.status_code == 200) {
                    let d = res.data;
                    mThis.renderTransaction(d);
                }
            });
    };
    mThis.editAccount = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(211)) return;
        AccountDialog.show(op);
    };

    mThis.deleteAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Deleted successfully");
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(212)) return;
        cv_interact.confirm(
            "Delete this account?",
            {
                title: "Delete Account",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.AccountListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };

    mThis.setDefaultFilter = ()=>{
        if(!mThis.rem_filter) return;
        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
             const f = el.dataset.field;
             el.value = mThis.rem_filter[f] ?? '';
        });
    };

    mThis.getFilterData = () => {
        const p = {};
        p.search_value = mThis.elSearch.value;
       // p.sort_by_department = mThis.elSortByDepartment.value;
        // p.sort_by_branch = mThis.elSortByBranch.value;
        //p.sort_by_account = mThis.elSortByAccount.value;
        //p.account_id = mThis.divFilter.value;

        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        mThis.rem_filter = main_filters;
        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/account/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elDepartment,
                    d.departments,
                    "id",
                    "name",
                    '',
                    'All Departments'
                );
                VSUtil.setComboItems(
                    mThis.elAccount,
                    d.account,
                    "id",
                    "name",
                    '',
                    'All Accounts'
                );
                onFinish();
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions(()=>{
            if (mThis.rem_filter){
                mThis.setDefaultFilter();
            }
            mThis.AccountListView.showPage();
            main_view.setContentView(mThis.self, mThis.title_prop);
        });

    };
    return mThis;
})();

const AccountDialog = (() => {
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
                        <div class="col-6">
                            <select data-style="material" name="employee" class="data-input form-control"  data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" class="data-input form-control" name="account_type" data-field="account_type" placeholder="${LocaleManager.trans('Account Type', 'labels')}">
                                <option value="Payroll">Payroll</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="account_number" class="form-control data-input" data-field="account_number" placeholder=" " />
                                <label vslang="titles.Account Number"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="balance" class="form-control data-input" data-field="balance" placeholder=" " />
                                <label vslang="titles.Balance"></label>
                            </div>
                        </div>
                           <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="currency_code" class="form-control data-input" data-field="currency_code" placeholder=" " />
                                <label vslang="titles.Currency"></label>
                            </div>
                        </div>
                    </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const currency_codeField = me.controls.currency_code;
                    
                    if (currency_codeField && !currency_codeField.value) {
                        currency_codeField.value = VSMoney.getCurrency().code;

                    }
                  
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span class="choices__item_text"> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
                    },
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
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save">Save</span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        // if (me.dataOptions.id > 0) {
                                        //     cv_interact.success(
                                        //         "Updated payroll account successfully"
                                        //     );
                                        // } else {
                                        //     cv_interact.success(
                                        //         "Added payroll account successfully"
                                        //     );
                                        // }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Account",
                    modifyTitle: "vslang:titles.Detail Account",
                    targetProp: "accounts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me) => {
                    LocaleManager.translateZone(me.divModal);
                    me.setReadOnly(true,['account_number','currency_code'], {"currency_code":VSMoney.getCurrency().code});
                    const isReadOnly = me.dataOptions.id > 0;
                    me.setReadOnly(isReadOnly,['balance','employee'],isReadOnly? null : {"balance":"0.00"});
                    // me.controls.account_name.style.display = me.dataOptions.id > 0 ? 'block':'none';
                    // me.controls.account_name.setAttribute('readonly',true);

                    const balanceField = me.divModal.querySelector(
                        '[data-field="balance"]'
                    );
                    if (balanceField) {
                        if (me.dataOptions && me.dataOptions.id) {
                            balanceField.disabled = true;
                        } else {
                            balanceField.disabled = false;
                        }
                    }
                },
            });
        dialog.show(op);
    };

    return self;
})();

const DepositDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        '<div class="row">',
                        '<div class="form-group col-6">',
                        '<label for="account_name" class="form-label" vslang="titles.Account Name"></label>',
                        '<input name="account_name" class="data-input form-control" data-field="account_name" disabled/>',
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="balance" class="form-label" vslang="titles.Master Balance"></label>',
                        '<input name="balance" class="data-input form-control" data-field="balance" disabled/>',
                        "</div>",
                        '<div class="form-group col-12">',
                        '<label for="account_type" class="form-label" vslang="titles.Account Type"></label>',
                        '<select class="modal-select data-input" name="account_type" data-field="account_type" disabled>',
                        '<option value="Payroll">Payroll</option>',
                        '<option value="Wallet">Wallet</option>',
                        "</select>",
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="amount" class="form-label" vslang="titles.Amount"></label>',
                        '<input name="amount" class="form-control data-input" data-field="amount" />',
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="currency_code" class="form-label" vslang="titles.Currency"></label>',
                        '<input name="currency_code" class="data-input form-control" data-field="currency_code" disabled/>',
                        "</div>",
                        '<div class="form-group col-md-12">',
                        '<label for="remarks" class="form-label" vslang="titles.Remarks"></label>',
                        '<textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>',
                        "</div>",
                        "</div>",
                    ].join("");
                },
                contentCreated: (me) => {
                    const currency_codeField = me.controls.currency_code;
                    if (currency_codeField && !currency_codeField.value) {
                        currency_codeField.value = VSMoney.getCurrency().code;
                    }
                },
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
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="titles.Submit">Submit</span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            if (!AuthManager.allowed(326)) return;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/deposit",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        cv_interact.success(
                                            "Updated balance successfully"
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Deposit Cash",
                    modifyTitle: "Deposit Cash",
                    targetProp: "account",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/deposit/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                       onResponse: (me, res)=>{
                        //  console.log('result from api "/form-options": ', res);
                       }
                },

                onPrepareForm: (me,acc) => {
                    LocaleManager.translateZone(me.divModal);
                    // me.controls.account_name.value = acc.account_name ?? acc.emp_name ?? '';
                    // me.controls.account_number.value = acc.account_number;
                    // me.controls.currency_code.value = acc.currency_code;
                    // me.controls.account_name.setAttribute('readonly',true);
                    // me.controls.account_number.setAttribute('readonly',true);
                    // me.controls.currency_code.setAttribute('readonly',true);
                },
            });
        dialog.show(op);
    };

    return self;
})();

const TransferDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row">
                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">From Account</div>

                            <div class="form-group col-6">
                                <label for="account_number" class="form-label" vslang="titles.Account Number" ></label>
                                <input name="account_number" class="form-control data-input" data-field="account_number"disabled  />
                            </div>
                            <div class="form-group col-6">
                                <label for="balance" class="form-label" vslang="titles.Balance" ></label>
                                <input name="balance" class="form-control data-input" data-field="balance" disabled/>
                            </div>

                             <div class="form-group  col-12 ">
                                <div name="from_account_info" id="info"></div>
                             </div>

                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">To Account</div>

                            <div class="form-group col-6">
                                <label for="to_account_number" class="form-label" vslang="titles.Account Number"></label>
                                <input name="to_account_number" class="form-control data-input" data-field="to_account_number" />
                            </div>
                            <div class="form-group col-6">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" />
                            </div>

                            <div class="form-group  col-12 ">
                                <div id="info" name="to_account_info"></div>
                             </div>
                            <div class="form-group exchange_rate col-6">
                                <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate"></label>
                                <input name="exchange_rate" class="form-control data-input" data-field="exchange_rate" />
                            </div>
                        </div>
                    `;
                },
                contentCreated: (me) => {},
                prepareFormOptions: {
                    createTitle: "Add Account",
                    modifyTitle: "Transfer",
                    targetProp: "accounts",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/account/form-options`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    let account = me.controls.account_number;
                    let to_account = me.controls.to_account_number;
                    let from_account_info = me.controls.from_account_info;
                    let to_account_info = me.controls.to_account_info;
                    const exchange_rate =
                        me.divModal.querySelector(".exchange_rate");
                    exchange_rate.classList.add("d-none");

                    // account.onchange = (e) => {
                    let p = { account_number: account.value };
                    vsapi
                        .call(
                            [main_view.base_url, "/mhr/account/get-info"].join(
                                ""
                            ),
                            p,
                            null,
                            null
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                let d = res.data;
                                me.account_type = d.account_type;
                                me.currency_code = d.currency_code;
                                let div = "";
                                div = `<div class = "d-flex justify-content-between border rounded-4 p-2">
                                            <div>
                                                <label for="account_type" class="form-label">Account Type</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.account_type}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Employee</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.emp_name}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Currency</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.currency_code}</span>
                                            </div>

                                        </div>`;
                                from_account_info.innerHTML = div;
                            }
                        });
                    // };

                    to_account.onchange = (e) => {
                        let p = { account_number: to_account.value };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/account/get-info",
                                ].join(""),
                                p,
                                null,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    let d = res.data;
                                    me.to_account_type = d.account_type;
                                    me.to_account_currency_code =
                                        d.currency_code;
                                    let div = "";
                                    div = `<div class = "d-flex justify-content-between border rounded-4 p-2">
                                            <div>
                                                <label for="account_type" class="form-label">Account Type</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.account_type}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Employee</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.emp_name}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Currency</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.currency_code}</span>
                                            </div>
                                        </div>`;
                                    to_account_info.innerHTML = div;
                                    if (
                                        me.to_account_currency_code == me.currency_code
                                    ) {
                                        exchange_rate.classList.add("d-none");
                                    } else {
                                        exchange_rate.classList.remove("d-none");
                                    }
                                }
                            });
                    };
                },

                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Transfer</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.account_type = me.account_type;
                            p.currency_code = me.currency_code;
                            p.to_account_type = me.to_account_type;
                            p.to_account_currency_code = me.to_account_currency_code;
                            p.id = me.dataOptions.id;
                            if (
                                me.to_account_currency_code != me.currency_code
                            ) {
                                if (!me.controls.exchange_rate.value) {
                                    cv_interact.error(
                                        "Please enter exchange rate"
                                    );
                                    return;
                                }
                            }

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/get-confirm",
                                    ].join(""),
                                    p,
                                    null,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code === 200 && res.data) {
                                        const confirmationMessage = `Are you sure to transfer? to [${res.data.to_account_number}] (${res.data.to_account_type}) - ${res.data.emp_name}`;

                                        cv_interact.confirm(
                                            confirmationMessage,
                                            {
                                                title: "Confirm or Cancel Transfer",
                                                context: "Cancel",
                                                confirmButtonText: "Transfer",
                                            },
                                            function (confirmation) {
                                                if (confirmation) {
                                                    p.from_account = {'account_number':p.account_number}
                                                    p.to_account = {'account_number':p.to_account_number}
                                                    vsapi
                                                        .call(
                                                            [
                                                                main_view.base_url,
                                                                "/hr/account/transfer",
                                                            ].join(""),
                                                            p,
                                                            null,
                                                            null
                                                        )
                                                        .then((res) => {
                                                            if (
                                                                res.status_code ===
                                                                    200 &&
                                                                res.data
                                                            ) {
                                                                let formattedData = `
                                                        Transfer Successful
                                                        From: ${res.data.from_account_number}
                                                        To: ${res.data.to_account_number}
                                                    `;
                                                                cv_interact.success(
                                                                    formattedData
                                                                );
                                                                AccountManagementComponent.AccountListView.showPage();
                                                                me.hide(false);
                                                            } else {
                                                                cv_interact.error(
                                                                    res.error_message ||
                                                                        "Error in processing transfer"
                                                                );
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            cv_interact.error(
                                                                res.error_message ||
                                                                    "Error in processing transfer"
                                                            );
                                                        });
                                                }
                                            }
                                        );
                                    } else {
                                        cv_interact.error(
                                            res.error_message ||
                                                "Error fetching confirmation data"
                                        );
                                    }
                                })
                                .catch((err) => {
                                    cv_interact.error(
                                        "Error in processing confirmation"
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

function windowPrintTransaction(html = null) {
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if (HtmlString) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Pay Slip</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }

                </style>

            </head>
            <body>${HtmlString}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 500);
    } else cv_interact.warning("Select run report before print!");
}

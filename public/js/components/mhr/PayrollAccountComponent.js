var PayrollAccountComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_accountComponent");
    mThis.title_prop = "payroll_account";
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
            className: "align-middle text-center",
            data: (data, index) => index + 1,
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-prm-custom">
                        ${data.emp_name ?? "_"}
                    </span>
                    <small class="text-muted">
                        ${data.position ?? "_"}
                    </small>
                </div>
            `,
        },
        {
            transTitle: "titles.Account Type",
            className: "align-middle text-center",
            data: (data) => `
            <div class="text-primary-custom">
                <span class="badge rounded-2 bg-primary text-white border px-3 py-2 text-capitalize" style="width:90px;">
                    ${data.account_type ?? "_"}
                </span>
            </div>
            `,
        },
        {
            transTitle: "titles.Account Number",
            className: "align-middle",
            data: (data) => `
                <span class="fw-medium text-dark">
                    ${data.account_number ?? "_"}
                </span>
            `,
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data) => `
                <span class="fw-bold text-success">
                    ${VSMoney.formatAmount(data.balance, data.currency_code ?? 'USD')}
                </span>
            `,
        },
        {
            transTitle: "titles.Last Balance Date",
            className: "align-middle text-nowrap",
            data: (data) => `
                <span class="text-nowrap text-muted">
                    ${data.last_balance_date ?? "_"}
                </span>
            `,
        },
        {
            title: "",
            className: "align-middle text-end",
            data: (data) => `
                <div class="d-flex justify-content-end">
                    ${
                        data.action_id > 1
                            ? ""
                            : `
                            <a href="javascript:void(0)"
                            class="btn_account_action d-inline-flex align-items-center justify-content-center"
                            data-id="${data.id}"
                            data-emp_id="${data.emp_id}"
                            data-statusid="${data.status_id}"
                            aria-haspopup="true"
                            aria-expanded="false"
                            title="More Actions">
                                <img src="${main_view.asset_url}/images/icons/more_vert (3).svg"
                                    alt="Actions">
                            </a>
                        `
                    }
                </div>
            `,
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
            if (!AuthManager.allowed(367,false)) return;
            PayrollAccountDialog.show(op);
        };
        mThis.btnAddAccountMissing.onclick = function (e) {
            e.preventDefault();
            const op = {
                account_type: "Payroll",
            };
            if (!AuthManager.allowed(368,false)) return;
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
    if (!Array.isArray(data) || !data.length || !data[0]) {
        console.error("Invalid transaction data.");
        mThis._transaction_info.innerHTML = `
            <div class="text-center text-muted py-4">
                No transaction information available.
            </div>
        `;
        return;
    }

    const employee = data[0];
    const transactions = Array.isArray(employee.trx)
        ? employee.trx
        : [];

    const currency = employee.currency_code ?? "USD";

    const escapeHtml = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const formatAmount = (amount) => {
        return VSMoney.formatAmount(
            amount ?? 0,
            currency
        );
    };

    const getTransactionType = (type) => {
        switch (Number(type)) {
            case 1:
                return "Deposit";

            case 2:
                return "Withdrawal";

            default:
                return "Transfer";
        }
    };

    const getStatus = (status) => {
        return String(status ?? "").toLowerCase() === "in";
    };

    const transactionRows = transactions.length
        ? transactions
              .map((trx) => {
                  const moneyIn = getStatus(trx.status);
                  const trxType = getTransactionType(
                      trx.trx_type
                  );

                  return `
                    <tr>
                        <td class="text-center text-nowrap">
                            ${escapeHtml(trxType)}
                        </td>

                        <td class="account-number">
                            ${escapeHtml(
                                trx.from_account_number
                            )}
                        </td>

                        <td class="account-number">
                            ${escapeHtml(
                                trx.to_account_number
                            )}
                        </td>

                        <td class="text-end ${
                            moneyIn
                                ? "text-success"
                                : "text-danger"
                        } amount">
                            ${
                                moneyIn ? "+" : "-"
                            }${formatAmount(trx.amount)}
                        </td>

                        <td class="text-center text-nowrap">
                            ${escapeHtml(trx.created_at)}
                        </td>

                        <td class="text-center">
                            <span class="status-badge ${
                                moneyIn
                                    ? "status-in"
                                    : "status-out"
                            }">
                                ${
                                    moneyIn
                                        ? "Money In"
                                        : "Money Out"
                                }
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(trx.remarks)}
                        </td>
                    </tr>
                `;
              })
              .join("")
        : `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-muted py-4"
                >
                    No transactions found.
                </td>
            </tr>
        `;

    const html = `
        <div id="full_elbody" style="zoom:95%">

            <style>
                /* =====================================
                   Report Base
                ===================================== */

                #full_elbody {
                    font-family:
                        "Khmer OS Battambang",
                        Arial,
                        sans-serif;
                    font-size: 12px;
                    color: #000;
                    background: #fff;
                }

               
                /* =====================================
                   Report Header
                ===================================== */

                .report-header {
                    text-align: center;
                    margin-bottom: 18px;
                }

                .report-header .kh-title {
                    margin: 0;
                    font-family:
                        "Khmer OS Muol Light",
                        Arial,
                        sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                }

                .report-header .en-title {
                    margin: 2px 0 0;
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .report-header .report-line {
                    width: 100%;
                    height: 1px;
                    background: #000;
                    margin-top: 10px;
                }

                /* =====================================
                   Account Information
                ===================================== */

                .account-info {
                    width: 100%;
                    margin-bottom: 18px;
                    border: 1px solid #000;
                    border-radius: 4px;
                    padding: 10px 14px;
                }

                .account-info-row {
                    display: flex;
                    width: 100%;
                }

                .account-info-column {
                    width: 50%;
                    padding: 0 12px;
                }

                .account-info-column:first-child {
                    padding-left: 0;
                }

                .account-info-column:last-child {
                    padding-right: 0;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    min-height: 25px;
                }

                .info-label {
                    width: 125px;
                    flex-shrink: 0;
                    color: #555;
                    font-weight: normal;
                }

                .info-separator {
                    width: 20px;
                    text-align: center;
                }

                .info-value {
                    flex: 1;
                    font-weight: 600;
                    color: #000;
                }

                .balance-value {
                    font-weight: bold;
                    font-size: 13px;
                }

                /* =====================================
                   Section Title
                ===================================== */

                .section-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .section-title .title {
                    font-size: 13px;
                    font-weight: bold;
                }

                .section-title .count {
                    font-size: 11px;
                    color: #666;
                }

                /* =====================================
                   Transaction Table
                ===================================== */

                .table-report {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                .table-report th,
                .table-report td {
                    border: 1px solid #000;
                    padding: 5px 6px;
                    vertical-align: middle;
                }

                .table-report thead th {
                    background: #ffff99;
                    text-align: center;
                    font-weight: bold;
                    font-size: 11px;
                    white-space: nowrap;
                }

                .table-report tbody td {
                    font-size: 10.5px;
                }

                .table-report tbody tr {
                    page-break-inside: avoid;
                }

                /* Column Width */

                .table-report th:nth-child(1),
                .table-report td:nth-child(1) {
                    width: 13%;
                }

                .table-report th:nth-child(2),
                .table-report td:nth-child(2) {
                    width: 15%;
                }

                .table-report th:nth-child(3),
                .table-report td:nth-child(3) {
                    width: 15%;
                }

                .table-report th:nth-child(4),
                .table-report td:nth-child(4) {
                    width: 13%;
                }

                .table-report th:nth-child(5),
                .table-report td:nth-child(5) {
                    width: 13%;
                }

                .table-report th:nth-child(6),
                .table-report td:nth-child(6) {
                    width: 12%;
                }

                .table-report th:nth-child(7),
                .table-report td:nth-child(7) {
                    width: 19%;
                }

                .account-number {
                    font-family: Arial, sans-serif;
                    font-size: 10px;
                }

                .amount {
                    white-space: nowrap;
                    font-weight: bold;
                }

                /* =====================================
                   Status
                ===================================== */

                .status-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 9px;
                    font-weight: bold;
                    white-space: nowrap;
                }

                .status-in {
                    color: #198754;
                    background: #d1e7dd;
                }

                .status-out {
                    color: #dc3545;
                    background: #f8d7da;
                }

                /* =====================================
                   Print
                ===================================== */

                @page {
                    size: A4 portrait;
                    margin: 12mm;
                }

            </style>

            <div class="page">

                <!-- Report Header -->
                <div class="report-header">

                    <p class="kh-title">
                        ប្រវត្តិប្រតិបត្តិការគណនី
                    </p>

                    <p class="en-title">
                        Transaction History
                    </p>

                    <div class="report-line"></div>

                </div>

                <!-- Account Information -->
                <div class="account-info">

                    <div class="account-info-row">

                        <!-- Left -->
                        <div class="account-info-column">

                            <div class="info-item">
                                <span class="info-label">
                                    Employee Name
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value">
                                    ${escapeHtml(
                                        employee.emp_name
                                    )}
                                </span>
                            </div>

                            <div class="info-item">
                                <span class="info-label">
                                    Account Number
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value">
                                    ${escapeHtml(
                                        employee.account_number
                                    )}
                                </span>
                            </div>

                            <div class="info-item">
                                <span class="info-label">
                                    Balance
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value balance-value">
                                    ${formatAmount(
                                        employee.balance
                                    )}
                                </span>
                            </div>

                        </div>

                        <!-- Right -->
                        <div class="account-info-column">

                            <div class="info-item">
                                <span class="info-label">
                                    Account Type
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value">
                                    ${escapeHtml(
                                        employee.account_type
                                    )}
                                </span>
                            </div>

                            <div class="info-item">
                                <span class="info-label">
                                    Account Currency
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value">
                                    ${escapeHtml(currency)}
                                </span>
                            </div>

                            <div class="info-item">
                                <span class="info-label">
                                    Last Balance Date
                                </span>

                                <span class="info-separator">
                                    :
                                </span>

                                <span class="info-value">
                                    ${escapeHtml(
                                        employee.last_balance_date
                                    )}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <!-- Transaction Section -->
                <div class="section-title">

                    <span class="title">
                        Transaction Details
                    </span>

                    <span class="count">
                        ${transactions.length}
                        transaction${
                            transactions.length !== 1
                                ? "s"
                                : ""
                        }
                    </span>

                </div>

                <!-- Transaction Table -->
                <table class="table-report">

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
                        ${transactionRows}
                    </tbody>

                </table>

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
                    html: '<span class="ps-2" vslang="titles.Deposit to Account"></span>',
                    icon: `<i class="fa fa-calculator text-success fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "deposit_to_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.View Transactios">View Transaction</span>',
                    icon: `<i class="fa-regular fa-eye text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_transaction",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Transfer">Transfer</span>',
                    icon: `<i class="fa-solid fa-money-bill-transfer text-info fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "transfer",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Detail Account"></span>',
                    icon: `<i class="fa-regular fa-edit text-warning fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "detail_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Account">Delete Account</span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_account",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                // Ensure 'cash_deposit' is part of the menu and exists before hiding it
                // if (menu.cash_deposit) {
                //     menu.cash_deposit.style.display = "block";
                // }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "transfer": {
                        mThis.transfer(id, menuLink);
                        break;
                    }
                    case "deposit_to_account": {
                        mThis.depositToAccount(id, menuLink);
                        break;
                    }
                    case "view_transaction": {
                        mThis.viewTransaction(id, menuLink);
                        break;
                    }
                    case "detail_account": {
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
        if (!AuthManager.allowed(371,false)) return;
        TransferDialog.show(op);
    };
    mThis.depositToAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(369,false)) return;
        DepositDialog.show(op);
    };

    mThis.viewTransaction = (id, menuLink) => {
        if (!AuthManager.allowed(370,false)) return;
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
                mThis.AccountListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(372,false)) return;
        PayrollAccountDialog.show(op);
    };

    mThis.deleteAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(373,false)) return;
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
                            `${main_view.base_url}/mhr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_payroll_account");
                                mThis.AccountListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };

 

    mThis.getFilterData = () => {
        let p = {
            search_value : mThis.elSearch.value,
            department_id : mThis.elDepartment.value,
            // p.sort_by_branch = mThis.elSortByBranch.value;
            //p.sort_by_account = mThis.elSortByAccount.value;
            account_type : mThis.elAccount.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        
        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/mhr/account/form-options`,null,{loader:false}).then((res) => {
            if(res.status_code === 200){
                const d = res.data;
                VSUtil.setComboItems(mThis.elAccount,d.accounts,"id","name",null,null,1);
                VSUtil.setComboItems(mThis.elDepartment,d.departments,"id","name","",LocaleManager.trans("All Department", "titles"),"");
                // mThis.elAccount.dispatchEvent(
                //     new Event("change", { bubbles: true }),
                // );
                onFinish();
            }
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions(()=>{
            mThis.AccountListView.showPage(
                mThis.getFilterData(),
                null,
                () => {
                    main_view.setContentView(mThis.self, mThis.title_prop);
                },
            );
        });

    };
    return mThis;
})();

const PayrollAccountDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = op => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                        <input type="hidden" class="data-input" data-field="emp_id" />
                         <div class="col-6">
                            <div class="vs-material-field">
                                <input name="employee" class="data-input form-control" data-field="employee_name" placeholder=" " autocomplete="off" />
                                <label vslang="labels.Employee"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" class="data-input form-control" name="account_type" data-field="account_type" placeholder="${LocaleManager.trans('Account Type', 'labels')}" disabled>
                                <option value="Payroll" selected>Payroll</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="account_number" class="form-control data-input" data-field="account_number" placeholder=" " disabled />
                                <label vslang="titles.Account Number"></label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="vs-material-field">
                                <input type="text" name="balance" class="form-control data-input" data-field="balance" placeholder=" " />
                                <label vslang="titles.Balance"></label>
                            </div>
                        </div>
                          <div class="col-3">
                            <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans("Currency Code", "labels")}" disabled></select>
                        </div>
                    </div>`,
                    ].join("");
                },
                contentCreated: (me) => {

                    me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                        type: "select",
                        prefetch: true,
                        api: {
                            endpoint: `${main_view.base_url}/mhr/account/form-options`,
                        },
                        processResponse: (res) => {
                            const employees = res?.data?.employees || [];
                            return (Array.isArray(employees) ? employees : []).map((i) => ({
                                ...i,
                                code: i.code || "",
                                name: i.name || "",
                            }));
                        },
                        showColumnHeader: true,
                        columns: {
                            code: "Code",
                            name: "Name",
                        },
                        onSelect: (employee) => {
                            if (me.controls.emp_id) {
                                me.controls.emp_id.value = employee.id || "";
                            }
                            if (me.controls.account_number) {
                                me.controls.account_number.value = `${employee.code}-P`;
                            }
                        }
                    });
                    me.searchEmployee.reset("");
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
                                        "/mhr/account/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_payroll_account");
                                        } else {
                                            cv_interact.success("create_success_payroll_account");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Account",
                    modifyTitle: "vslang:titles.Detail Account",
                    targetProp: "account",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/form-options",
                        ].join(""),
                        params: (me,op) => {
                            return { id: op.id};
                        },
                    },
                },

               onPrepareForm: (me,data) => {
                    if (!me.dataOptions?.id && me.controls?.currency_code) {
                        me.controls.currency_code.value = "USD";
                    }
                    me.controls.account_type.value = "Payroll";
                    const isEdit = me.dataOptions.id > 0;
                    const details = data?.account || {};
                    if (isEdit) {
                        me.controls.balance.disabled = true;
                        me.controls.employee.disabled = true;
                         me.controls.emp_id.value = details.emp_id;
                            if (me.controls.employee) {
                                me.controls.employee.value =
                                    details.account_name || "";
                            }
                    }
               
                
                }
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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                        <div class="col-12">
                            <div class="vs-material-field">
                                <input name="account_name" class="data-input form-control" data-field="account_name" placeholder=" " disabled />
                                <label vslang="titles.Account"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="account_type" class="data-input form-control" data-field="account_type" disabled placeholder="${LocaleManager.trans('Type', 'labels')}">
                                <option value="Payroll" >Payroll</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="balance" class="data-input form-control" data-field="balance" placeholder=" " disabled />
                                <label vslang="titles.Master Balance"></label>
                            </div>
                        </div>                     
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="amount" class="data-input form-control" data-field="amount" placeholder=" " />
                                <label vslang="titles.Amount"></label>
                            </div>
                        </div>
                         <div class="col-6">
                            <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans("Currency", "labels")}" ></select>
                        </div>
                       <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                <label vslang="titles.Remark"></label>
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
                    applyNumberInput(me.controls.amount);
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

                            // if (!AuthManager.allowed(326)) return;
                            vsapi.call([main_view.base_url,"/mhr/account/deposit",].join(""),p,{loader: false,agent :btn}).then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        cv_interact.success("create_cash_deposit_success");
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Deposit To Account",
                    modifyTitle: "Deposit To Account",
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
                       }
                },

                onPrepareForm: (me,acc) => {
         
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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="account_name" class="data-input form-control" data-field="account_name" placeholder=" " disabled />
                                    <label vslang="titles.Form Account"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="account_number" class="data-input form-control" data-field="account_number" placeholder=" " disabled />
                                    <label vslang="titles.Account Number"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="account_type" class="data-input form-control" data-field="account_type" disabled placeholder="${LocaleManager.trans('Type', 'labels')}">
                                    <option value="Payroll" >Payroll</option>
                                    <option value="Wallet">Wallet</option>
                                </select>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input name="balance" class="data-input form-control" data-field="balance" placeholder=" " disabled />
                                    <label vslang="titles.Balance"></label>
                                </div>
                            </div>  
                            <div class="col-3">
                                <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans("Currency", "labels")}" ></select>
                            </div>

                            <div class="text-prm-custom fs-6 p-2 mx-2 mb-2 border rounded-2 bg-primary-subtle">To Account</div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="to_account_number" class="data-input form-control" data-field="to_account_number" placeholder=" " />
                                    <label vslang="titles.To Account"></label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input name="amount" class="data-input form-control" data-field="amount" placeholder=" " />
                                    <label vslang="titles.Amount"></label>
                                </div>
                            </div>  
                            <div class="col-3 exchange_rate">
                                <div class="vs-material-field">
                                    <input type="number" name="exchange_rate" class="form-control data-input" data-field="exchange_rate" placeholder=" " />
                                    <label vslang="labels.Exchange Rate"></label>
                                </div>
                            </div>
                            <div class="form-group col-12">
                                <div id="info" name="to_account_info"></div>
                            </div>
                            
                        </div>
                    `;
                },
                contentCreated: (me) => {},
                prepareFormOptions: {
                    createTitle: "Add Account",
                    modifyTitle: "Transfer",
                    targetProp: "account",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/account/form-options`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    let account = me.controls.account_number;
                    let to_account = me.controls.to_account_number;
                    let to_account_info = me.controls.to_account_info;
                    const exchange_rate =
                        me.divModal.querySelector(".exchange_rate");
                    exchange_rate.classList.add("d-none");

          

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
                                    console.log(12,d);
                                    
                                    me.to_account_type = d.account_type;
                                    me.to_account_currency_code = d.currency_code;
                                    let div = "";
                                    div = `<div class="d-flex justify-content-between border rounded-2 p-2">
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
                                    if (me.to_account_currency_code == me.currency_code) {
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
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Transfer"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();
                            // p.account_type = me.account_type;
                            // p.currency_code = me.currency_code;
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
                                                    console.log(3333,p);
                                                    
                                                    vsapi
                                                        .call(
                                                            [
                                                                main_view.base_url,
                                                                "/mhr/account/transfer",
                                                            ].join(""),
                                                            p,
                                                            null,
                                                            null
                                                        )
                                                        .then((res) => {
                                                    console.log(123456,res);

                                                            if (res.status_code == 200 && res.data) {
                                                                let formattedData = `
                                                                    Transfer Successful
                                                                    From: ${res.data.from_account_number}
                                                                    To: ${res.data.to_account_number}
                                                                `;
                                                                cv_interact.success(formattedData);
                                                                AccountManagementComponent.AccountListView.showPage();
                                                                me.hide(true);
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

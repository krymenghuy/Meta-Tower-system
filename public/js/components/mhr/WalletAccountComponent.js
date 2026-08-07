var WalletAccountComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_walletAccountComponent");
    
    mThis.title_prop = "Wallet Accounts";
    mThis.btnAdd = mThis.self.querySelector("#_btnWalletAddAccount");
    mThis.btnAddAccountMissing = mThis.self.querySelector("#_btnWalletAddAccountMissing");
    mThis.divFilter = mThis.self.querySelector("#_wla_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_wla_search_wallet_account");
    mThis.elFilter_department = mThis.self.querySelector("#_wla_filter_department");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_wallet_account");
    mThis._wallet_transaction_info = mThis.self.querySelector("#_wallet_transaction_info");
    mThis.btnPrintTransaction = mThis.self.querySelector("#_print_transaction");

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
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt=""style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span>${data.emp_name ?? "_"}</span>
                                <br/>
                                <small class="text-muted">${data.position ?? "_"}</small>
                            </div>
                        </div>`;
            },
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
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ""}</p>`;
            },
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
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ""}</p>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1
                            ? "d-none"
                            : "btn_wallet_account_action"
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

        mThis.WalletAccountListView = new ListView("_wallet_account_list", {
            fetchApi: `${main_view.base_url}/mhr/account/wallet-account/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden  header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WalletAccountListView.showPage();
                },
            };
            // if (!AuthManager.allowed(256)) return;
            WalletAccountDialog.show(op);
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_wallet_content = mThis.self.querySelector("#sub_wallet_content");
            sub_wallet_content.classList.remove("d-none");
            const view_wallet_transaction = mThis.self.querySelector("#view_wallet_transaction");
            view_wallet_transaction.classList.add("d-none");

        };

        const pr_tbl = mThis.WalletAccountListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 220) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);
        const filter_fields = mThis.divFilter.querySelectorAll('.filter-field');
        filter_fields.forEach(el =>{
            el.onchange =  (e) => {
               e.preventDefault();
               mThis.WalletAccountListView.showPage(mThis.getFilterData());
            }
        });

        mThis.btnAddAccountMissing.onclick = function (e) {
            e.preventDefault();

            const op = {
                //account_id: mThis.divFilter.value,
                account_type:"Wallet"
            };
            // if (!AuthManager.allowed(471)) return;
            cv_interact.confirm(
                'html:<span class="d-block fw-semibold text-success">Create wallet accounts for all staff? </span><small>This process will create wallet account for staff who do not have a wallet account yet!</small>',
                {
                    title: "Create Wallet Accounts",
                    context: "update",
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
                                    const d = res.data ?? {};
                                    const success_count = d.success_count ?? 0;
                                    if(success_count > 0) {
                                        mThis.WalletAccountListView.showPage(
                                            mThis.getFilterData()
                                        );
                                        cv_interact.success(`${success_count} wallet accounts have been creted!`);
                                    }
                                    else cv_interact.info('No wallet accounts were created. This is maybe because all staffs already have a wallet account!');

                                } else cv_interact.error(res.error_message);
                            });
                    }
                }
            );
        };

        mThis.initAlready = true;
    };

    mThis.renderWalletTransaction = (data) => {
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
                        <img src="${main_view.base_url}/assets/images/logo/lc_logo.svg" alt="Company Logo">
                    </div>
                    <div class="transaction_title">
                        <h4>Transaction</h4>
                    </div>
                </div>
                <div class="transaction_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="transaction_image">
                                <img src="${employee.image_url}" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${employee.emp_name}</p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Number</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${employee.account_number}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Balance</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${employee.balance}</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Type</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap">${employee.account_type}</p>
                            </div>
                             <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Currency</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${employee.currency_code}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Last Balance Date</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${employee.last_balance_date}</p>
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
                                ${transactions.map(trx => `
                                    <tr>
                                        <td>${trx.trx_type === 1 ? 'Deposit' : trx.trx_type === 2 ? 'Withdrawal' : 'Transfer'}</td>
                                        <td>${trx.from_account_number}</td>
                                        <td>${trx.to_account_number}</td>
                                        <td class="${trx.status === 'in' ? 'text-success' : 'text-danger'}">
                                            ${Number(trx.amount).toLocaleString('en-US').replace(/,/g, ' ')}
                                        </td>
                                        <td>${trx.created_at}</td>
                                        <td>
                                            <span class="${trx.status === 'in' ? 'text-success' : 'text-danger'}">
                                                ${trx.status}
                                            </span>
                                        </td>
                                        <td>${trx.remarks ?? 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        `;

        mThis._wallet_transaction_info.innerHTML = html;
    };


    mThis.btnPrintTransaction.addEventListener('click', () => {
        windowPrintWalletTransaction(mThis._wallet_transaction_info.innerHTML);
        // window.print();
    })

    mThis.elSearch.addEventListener("keyup", (e) => {
        e.preventDefault();
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WalletAccountListView) {
                mThis.WalletAccountListView.showPage(mThis.getFilterData());
            } else {
                console.error("Wallet account is not defined");
            }
        }, 200);
    });

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_wallet_account_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.View Transactions"></span>',
                    icon: `<i class="fa-regular fa-eye text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_wallet_transaction",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Wallet Details"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_wallet_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Wallet"></span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_wallet_account",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_wallet_transaction": {
                        mThis.viewWalletTransaction(id, menuLink);
                        break;
                    }
                    case "edit_wallet_account": {
                        mThis.editWalletAccount(id, menuLink);
                        break;
                    }
                    case "delete_wallet_account": {
                        mThis.deleteWalletAccount(id, menuLink);
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


    mThis.editWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WalletAccountListView.showPage();
            },
        };
        // if (!AuthManager.allowed(257)) return;
        WalletAccountDialog.show(op);
    };

    mThis.deleteWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Deleted successfully");
                mThis.WalletAccountListView.showPage();
            },
        };
        // if (!AuthManager.allowed(258)) return;
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
                            `${main_view.base_url}/mhr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_wallet_account");
                                mThis.WalletAccountListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };
    mThis.viewWalletTransaction = (id, menuLink) => {

        const sub_wallet_content = mThis.self.querySelector("#sub_wallet_content");
        sub_wallet_content.classList.add("d-none");
        const view_wallet_transaction = mThis.self.querySelector("#view_wallet_transaction");
        view_wallet_transaction.classList.remove("d-none");

        let emp_id = menuLink.dataset.emp_id;
        let op = {
            emp_id: emp_id,
            account_id: id,
        }
        // if (!AuthManager.allowed(259)) return;
        vsapi.call(`${main_view.base_url}/mhr/account/print-transaction`,op,false,false,false).then(res => {

            if(res.status_code == 200){
                let d = res.data;
                mThis.renderWalletTransaction(d)
            }
        })
    }

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
               VSUtil.setComboItems(mThis.elFilter_department, d.departments, 'id', 'name', '',LocaleManager.trans("All Department", "titles"),"");
               onFinish();

            });
    };

    mThis.setDefaultFilter = ()=>{
        if(!mThis.rem_filter) return;
        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
             const f = el.dataset.field;
             el.value = mThis.rem_filter[f] ?? '';
        });
    };

    mThis.getFilterData = ()=>{
        const els = mThis.divFilter.querySelectorAll('.filter-field');
        const p = {};
        p.search_value = mThis.elSearch.value;
        els.forEach(el =>{
            const f = el.dataset.field;
            p[f] = el.value;
        });
        mThis.rem_filter = p;
        return p;
    }
    mThis.show = function () {
        mThis.init();
        
        mThis.prepareFormOptions(()=>{
            if(mThis.rem_filter){
                 mThis.setDefaultFilter();
            }
            mThis.WalletAccountListView.showPage(mThis.getFilterData());
            main_view.setContentView(mThis.self, mThis.title_prop);
        });

    };
    return mThis;
})();

const WalletAccountDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
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
                                    me.controls.emp_id.value =
                                        employee.id || "";
                            console.log("Selected employee:", me.controls.emp_id.value);

                                }
                            if (me.controls.account_number) {
                                me.controls.account_number.value = `${employee.code}-W`;
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
                    }
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
                            vsapi.call([main_view.base_url,"/mhr/account/save",].join(""),p,btn,null).then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_wallet_account");
                                        }
                                        else{
                                        cv_interact.success("create_success_wallet_account");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Account",
                    modifyTitle: "vslang:titles.Wallet Details",
                    targetProp: "account",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/form-options",
                        ].join(""),
                        params: (me,op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    if (!me.dataOptions?.id && me.controls?.currency_code) {
                        me.controls.currency_code.value = "USD";
                    }
                    me.controls.account_type.value = "Wallet";
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
                },
            });

        dialog.show(op);
    };

    return self;
})();
function windowPrintWalletTransaction(html=null)
{
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if(HtmlString)
    {
        let myWindow = window.open('','PRINT');
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
        },500);
    }
    else
        cv_interact.warning('Select run report before print!');
}

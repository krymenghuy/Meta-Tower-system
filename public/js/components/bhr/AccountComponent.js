var AccountMenagmentComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_accountComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll Account ";
    this.btnAdd = this.self.querySelector("#_btnAddAccount");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_account");
    this.elSortBy = this.self.querySelector("#el_sort_by");
    this.btnBack = this.self.querySelector("#_btn_backTo_account");

    const formattedNumber = (number) => {
        number = Number(number) || 0;
        return number
            .toLocaleString('en-US', {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            .replace(/,/g, ' ');
    };



    this.cols = [
        {
            title: "No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap w-15",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${
                                data.image_url
                            }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
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
            title: "Account Type",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-1 m-0 text-center rounded-5 m-0 border text-white w-50 bg-success">${data.account_type ?? ""}</p>`;
            },
        },
        {
            title: "Account Number",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ""}</p>`;
            },
        },
        {
            title: "Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol} ${formattedNumber(data.balance ?? 0)}</p>`;
            },
        },

        {
            title: "Last Balance Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ""}</p>`;
            },
        },
        {
            title: "Currency",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.currency ?? ""}</p>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_account_action"
                    }" data-id="${data.id}" data-emp_id="${data.emp_id}" data-statusid="${
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


    this.cols2 = [
        {
            title: "No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Trx Type",
            className: 'trx_type text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = '';
                let trx_label = '';

                if (data.trx_type === 1) {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#9DBDFF';
                    trx_label = 'Deposit';
                } else if (data.trx_type === 2) {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#FFB26F';
                    trx_label = 'Withdrawal';
                } else if (data.trx_type === 3) {
                    cls_class = 'text-white text-center border border-primary rounded-5 p-1';
                    bg_color = '#88C273';
                    trx_label = 'Transfer';
                }

                return `<div><a class="d-block" data-trx_type="${data.trx_type}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${trx_label}
                            </span>
                        </a></div>`;
            }
        },
        {
            title: "From Account",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.from_account_number ?? ""}</p>`;
            },
        },
        {
            title: "To Account",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.to_account_number ?? ""}</p>`;
            },
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol + formattedNumber(data.amount ?? 0.00)}</p>`;
            },
        },
        {
            title: "Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.created_at ?? ""}</p>`;
            },
        },
        {
            title: "Status",
            className: "status text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = '';
                let status_label = '';

                if (data.status === 'in') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#73EC8B';
                    status_label = 'In';
                } else if (data.status === 'out') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#FF6B6B';
                    status_label = 'Out';
                }

                return `<div>
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${status_label}
                            </span>
                        </div>`;
            }
        },

        {
            title: "Remarks",
            className: "align-middle w-25",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.remarks ?? ""}</p>`;
            },
        },

    ];
    this.initTransaction = () => {
        if (mThis.initTransactionAlready) return;
        mThis.TransactionListView = new ListView("_transaction_info", {
            fetchApi: `${main_view.base_url}/hr/transaction/get-list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols2,
            tableClass: "table table--white overflow-hidden  header-uppercase",
            listContainerClass: null,
        });
        console.log(222,mThis.TransactionListView);


        mThis.initTransactionAlready = true;

    };
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.AccountListView = new ListView("_account_list", {
            fetchApi: `${main_view.base_url}/hr/account/payroll-account-list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white overflow-hidden  header-uppercase",
            listContainerClass: null,
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                btn: e.target,
                onClose: () => {
                    cv_interact.success('Account Added Successfully');
                    mThis.AccountListView.showPage();
                },
            };
            AccountDialog.show(op);
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            let view_see_info = mThis.self.querySelector("#view_transaction_info");
            view_see_info.classList.add("d-none");
            let sub_content = mThis.self.querySelector("#sub_content");
            sub_content.classList.remove("d-none");
        };

        const pr_tbl = mThis.AccountListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

            el.onchange =  (e) => {
           e.preventDefault();
           mThis.AccountListView.showPage(mThis.getDataFormFilter());
            }
       });

        mThis.initAlready = true;
    };

    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.AccountListView) {
                mThis.AccountListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("Payroll account is not defined");
            }
        }, 200);
    });

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_account_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [

                {
                    html: '<span class="ps-2  " vslang="titles.View Transaction">View Transaction</span>',
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
                    html: '<span class="ps-2  " vslang="titles.Modify Account">Modify Account</span>',
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

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "transfer": {
                        mThis.transfer(id, menuLink);
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
        new VSDropdownMenu(menuOptopns);
    };
    this.transfer = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success('Account Transferred Successfully');
                mThis.AccountListView.showPage();
            },
        };

        TransferDialog.show(op);
    };

    this.viewTransaction = (id, menuLink) => {
        console.log(321,menuLink );
        let emp_id = menuLink.dataset.emp_id;
        let p = {
            emp_id:emp_id,
            account_id:id

        }
        const viewTran = this.self.querySelector("#view_transaction_info");
        const sub_content = this.self.querySelector("#sub_content");
        // this.show = function () {
            mThis.initTransaction();
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
            mThis.TransactionListView.showPage(p);

            viewTran.classList.remove("d-none");
            sub_content.classList.add("d-none");

        // };

    }
    this.editAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success('Account Updated Successfully');
                mThis.AccountListView.showPage();
            },
        };

        AccountDialog.show(op);
    };

    this.deleteAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Deleted Successfully");
                mThis.AccountListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Account?",
            {
                title: "Delete Account",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.AccountListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.getDataFormFilter = () => {
        let p = {};
        // p.search_value = mThis.elSearch.value;
        // p.sort_by = mThis.elSortBy.value;



        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, main_filters);

        return p;
    };
    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/account/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                // console.log(1111, this.elSortBy);

            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'Default', null);


            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.AccountListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);

    };

})();

const AccountDialog = (() => {
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
                    return [
                        `<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class=" data-input"  data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="account_type" class="form-label" vslang="titles.Account Type"></label>
                        <select class="modal-select data-input" name="account_type" data-field="account_type">
                            <option value="Payroll">Payroll</option>
                            <option value="Wallet">Wallet</option>
                        </select>
                    </div>
                    <div class="form-group col-6">
                        <label for="account_number" class="form-label" vslang="titles.Account Number"></label>
                        <input name="account_number" class="form-control data-input" data-field="account_number" />
                    </div>
                    <div class="form-group col-6">
                        <label for="ballance" class="form-label" vslang="titles.Balance"></label>
                        <input name="ballance" class="form-control data-input" data-field="balance"  />
                    </div>
                    <div class="form-group col-6">
                        <label for="currency" class="form-label" vslang="titles.Currency"></label>
                        <select class="modal-select data-input" name="currency" data-field="currency">
                            <option value="KHR">KHR</option>
                            <option value="USD">USA</option>
                        </select>
                    </div>
                    </div>


              </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const currencyField = me.controls.currency;
                    if (currencyField && !currencyField.value) {
                        currencyField.value = "KHR";
                    }
                    const accountField = me.controls.account_type;
                    if (accountField && !accountField.value) {
                        accountField.value = "Payroll";
                    }
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
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
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            console.log(555,p);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/account/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Account",
                    modifyTitle: "Edit Account",
                    targetProp: "accounts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/account/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },

                onPrepareForm: (me) => {
                    LocaleManager.translateZone(me.divModal);

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

const TransferDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row">
                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">From Account</div>

                            <div class="form-group col-4">
                                <label for="account_number" class="form-label" vslang="titles.Account Number"></label>
                                <input name="account_number" class="form-control data-input" data-field="account_number" disabled />
                            </div>
                            <div class="form-group col-4">
                                <label for="balance" class="form-label" vslang="titles.Balance"></label>
                                <input name="balance" class="form-control data-input" data-field="balance" disabled />
                            </div>
                            <div class="form-group col-4">
                                <label for="currency" class="form-label" vslang="titles.Currency"></label>
                                <select class="modal-select data-input" data-field="currency">
                                    <option value="KHR">KHR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>

                             <div class="form-group  col-12 d.none">
                                <div id="info"></div>
                             </div>

                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">To Account</div>

                            <div class="form-group col-4">
                                <label for="to_account_number" class="form-label" vslang="titles.Account Number"></label>
                                <input name="to_account_number" class="form-control data-input" data-field="to_account_number" />
                            </div>
                            <div class="form-group col-4">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" />
                            </div>
                            <div class="form-group col-4">
                                <label for="currency" class="form-label" vslang="titles.Currency"></label>
                                <select class="modal-select data-input" data-field="currency">
                                    <option value="KHR">KHR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div class="form-group  col-8 d.none">
                                <div id="info"></div>
                             </div>
                            <div class="form-group col-4 d-none">
                                <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate"></label>
                                <input name="exchange_rate" class="form-control data-input" data-field="exchange_rate" />
                            </div>



                        </div>
                    `;
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
                            p.id = me.dataOptions.id;
                            console.log(1234, p);

                            // Perform the API call to get confirmation data
                            vsapi.call([main_view.base_url, '/hr/account/transfer'].join(''), p, null, null).then(res => {
                                if (res.status_code === 200 && res.data) {
                                    const confirmationMessage = `Are you sure to transfer? To '${res.data.to_account_number} (${res.data.to_account_type}) - ${res.data.emp_name}'`;

                                    cv_interact.confirm(confirmationMessage, {
                                        title: 'Confirm or Cancel Transfer',
                                        context: 'Cancel',
                                        confirmButtonText: "Transfer"
                                    }, function (confirmation) {
                                        if (confirmation) {
                                            console.log(222,p);

                                            vsapi.call([main_view.base_url, '/hr/account/transfer'].join(''), p, null, null).then(res => {
                                                if (res.status_code === 200 && res.data && res.data.message === 'Transfer Success') {
                                                    cv_interact.error('Transfer successful');
                                                } else {
                                                    let formattedData = `
                                                        From: ${res.data.from_account_number}
                                                        To: ${res.data.to_account_number}
                                                    `;
                                                    cv_interact.success(formattedData);
                                                    AccountMenagmentComponent.AccountListView.showPage();
                                                    me.hide(false);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }

                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Account",
                    modifyTitle: "Transfer",
                    targetProp: "accounts",
                    api: {
                        endpoint: `${main_view.base_url}/hr/account/form-options`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();



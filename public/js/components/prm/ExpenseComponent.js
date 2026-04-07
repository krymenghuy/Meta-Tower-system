"use strict";
var ExpenseComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Expense Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_expense_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnExpense");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_expense");
    mThis.elFilter_category = mThis.self.querySelector('#_expense_category_id');
    mThis.elFilter_status = mThis.self.querySelector('#_expense_status_id');
    mThis.elSearch = mThis.self.querySelector("#_search_expense");


    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Expense No",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_no}</span>`,
        },
        {
            title: "Expense Date",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_date}</span>`,
        }, 
        {
            title: "Vendor",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.vendor_name}</span>`,
        },
        {
            title: "Ref No",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.reference_no}</span>`,
        },
        {
            title: "Category",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_category}</span>`,
        },
        {
            title: "Amount",
            className: "align-middle text-end", // align right for numbers
            data: (data) => {
                if (!data.amount) return `<span class="text-muted">0.00</span>`;
                const amount = parseFloat(data.amount).toFixed(2);
                return `<span class="text-prm-custom">$ ${amount}</span>`;
            },
        },
        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';

                if (status === 'pending') {
                    cls = 'badge text-warning bg-warning-subtle border border-warning';
                } else if (status === 'approved') {
                    cls = 'badge text-primary bg-primary-subtle border border-primary';
                } else if (status === 'paid') {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }

                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">${data.status ?? ''}</span>`;
            },
        },
       {
            title: "Updated By",
            className: 'align-middle',
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ''}</span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ExpenseListView = new ListView('_expense_list', {
            fetchApi: `${main_view.base_url}/prm/expense/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {


                tr.dataset.statusid = data.status_id;
                tr.classList.add('payment');
                tr.setAttribute('id', ['payments_id', data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExpenseListView.showPage(mThis.getFilterData());
                }
            };
            CreateExpenseDialog.show(op);
        };


        mThis.pr_tbl = mThis.ExpenseListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblBilling = mThis.ExpenseListView.getTable();
        mThis.initDropdownMenus(mThis.tblBilling);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.ExpenseListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ExpenseListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            category_id: mThis.elFilter_category.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Edit Expense"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_expense"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Expense"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_expense"
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {

                   
                    case 'edit_expense': {
                        mThis.editExpense(id, menuLink);
                        break;
                    }
                    case 'delete_expense': {
                        mThis.deleteExpense(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    mThis.editExpense = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.ExpenseListView.showPage(mThis.getFilterData());
            }
        };

        CreateExpenseDialog.show(op);
    }
    mThis.deleteExpense = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ExpenseListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Expense?', {
            title: 'Delete Expense',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/expense/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.ExpenseListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }
           
        });
    }

   
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/expense/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'expense_status', '', 'All Statuses', '');
                VSUtil.setComboItems(mThis.elFilter_category, d.categories, 'id', 'expense_category', '', 'All Category', '');
                if (typeof onFinish === 'function') onFinish();
            })
    }
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ExpenseListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const CreateExpenseDialog = (() => {
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
                    <div class="expense-form row p-1">
                        <div class="col-12 row pb-3">
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <select name="vendor_id" data-style="material" class="data-input form-control" data-field="vendor_id" placeholder="Pay To (Vendor)">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="expense_date" class="data-input form-control" data-field="expense_date" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Expense Date</label>
                                </div>
                            </div>

                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <select name="category_id" data-style="material" class="data-input form-control" data-field="category_id" placeholder="Category">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="text" name="reference_no" class="data-input form-control" data-field="reference_no" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Reference No</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="number" step="0.01" name="amount" class="data-input form-control" data-field="amount" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Amount</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label style="padding-left:6px;color:#777777;">Remarks</label>
                                </div>
                            </div>

                            

                        </div>

                    </div>
                    `;
                },
                contentCreated: (me) => {
                    
                },
                configSelect: [
                    {
                        name: "category_id",
                        data: "categories",
                        textField: "expense_category",
                        valueField: "id",
                    },
                    {
                        name: "vendor_id",
                        data: "vendors",
                        textField: "vendor",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Create Expense",
                    modifyTitle: "Modify Expense",
                    targetProp: "expense_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/expense/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    // LocaleManager.translateZone(me.divModal);
                    // console.log(12,data);
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if (btnClose) btnClose.classList.add('d-none');
                    if(me.dataOptions.vendor_id){
                        console.log(8888,me.dataOptions.vendor_id);
                        
                        me.controls.vendor_id.value = me.dataOptions.vendor_id;
                    }
                    
                },


                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: 'btn btn-secondary',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            console.log(4444,op);
                            vsapi.call([main_view.base_url, "/prm/expense/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Expense has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New Expense has been added successfully"
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







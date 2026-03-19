"use strict";
var ExpenseComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Expense Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_expense_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnExpense");
    mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBuilding = mThis.self.querySelector('#building_id');
    mThis.elInvoice = mThis.self.querySelector('#invoice_id');
    mThis.elSpace = mThis.self.querySelector('#space_id');
    mThis.elPaymentMethod = mThis.self.querySelector('#payment_method_id');
    mThis.elFilter_status = mThis.self.querySelector('#payment_status');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_expense");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_expense");


    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Code",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_no}</span>`,
        },
        {
            title: "Date",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_date}</span>`,
        }, 
         {
            title: "Ref No",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.reference_no}</span>`,
        },
        {
            title: "Type",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.expense_type}</span>`,
        },
        {
            title: "Vendor",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.vendor_name}</span>`,
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.amount}</span>`,
        },
        {
            title: "Tax",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.tax_amount}</span>`,
        },
        {
            title: "Total",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom">${data.total_amount}</span>`,
        },
        {
            title: "Pmt Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'text-info';

                if (status === 'paid') {
                    cls = 'text-success px-2 py-1 d-inline-block';
                } else if (status === 'unpaid') {
                    cls = 'text-danger px-2 py-1 d-inline-block';
                } else if (status === 'partially paid') {
                    cls = 'text-warning px-2 py-1 d-inline-block';
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
            },
        },
       {
            title: "Updated By",
            className: 'align-middle',
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
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

        mThis.BillingListView = new ListView('_expense_list', {
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
                    mThis.BillingListView.showPage(mThis.getFilterData());
                }
            };
            CreateBillingdialog.show(op);
        };


        mThis.pr_tbl = mThis.BillingListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblBilling = mThis.BillingListView.getTable();
        mThis.initDropdownMenus(mThis.tblBilling);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillingListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillingListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            // status_id: mThis.elFilter_status.value,
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
                    html: '<span class="ps-2 " vslang="titles.Modify "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_billing"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_billing"
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'change_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'edit_billing': {
                        mThis.editBilling(id, menuLink);
                        break;
                    }
                    case 'delete_billing': {
                        mThis.deleteBilling(id, menuLink);
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

    mThis.editBilling = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.BillingListView.showPage(mThis.getFilterData());
            }
        };

        CreateBillingdialog.show(op);
    }
    mThis.deleteBilling = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillingListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Billing??', {
            title: 'Delete Billing',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/payments/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.BillingListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.changeStatus = (id, lnk) => {
        const tr = lnk.closest('tr');
        const status_id = VSUtil.properCase(tr?.dataset.statusid || "");

        // const inputOptions = {
        //     title: 'Change Status',
        //     dataLabel: "Payment Status",
        //     valueMember: "status_id",
        //     textMember: "name",
        //     confirmButtonText: "Save",
        //     blankErrorMessage: "Status is not correct!",
        //     data:[
        //         {status_id:"1",name:"Paid"},
        //         {status_id:"2",name:"Unpaid"},
        //         {status_id:"3",name:"partially Paid"},
        //     ],
        //     defaultValue: status_id
        // };

        // InputBox2.show(inputOptions,(selected)=>{
        //     if(!selected) return;
        //     if(!AuthManager.allowed(321)) return;

        //     const payload = {id, status_id :selected.value};
        //     vsapi.call(`${mThis.base_url}/prm/payment/update-status`,payload).then(res=>{
        //         if(res.status_code ===200){
        //             InputBox2.close();
        //             cv_interact.success('Payment Status has been updated');
        //             mThis.BillingListView.showPage(mThis.getFilterData());

        //         }else{
        //             cv_interact.error(res.error_message || 'Unable to update status');
        //         }
        //     });
        // });

        const options = {
            title: 'Change Status',
            cssClass: '',
            backdropClose: true,
            //type:'select',
            label: 'Payment Status',
            valueField: 'status_id',
            textField: 'name',
            confirmButtonText: "Submit",
            requiredMessage: 'Select one valid status!',
            context: 'success', // sucess | prmary | delete | danger | error
            data: [
                { status_id: "1", name: "Paid" },
                { status_id: "2", name: "Unpaid" },
                { status_id: "3", name: "partially Paid" },
            ],
            defaultValue: status_id,
            onConfirm: (value, btn, me) => {
                const payload = { id, value: selected.value };
                vsapi.post(`${mThis.base_url}/prm/payment/update-status`, payload, { loader: false }).then(res => {
                    if (res.status_code === 200) {
                        me.close();
                        cv_interact.success('Payment Status has been updated');
                        mThis.BillingListView.showPage(mThis.getFilterData());

                    } else {
                        me.setError(res.error_message || 'Unable to update status');
                    }
                });
            }
        };

        InputBox.show(options);

    };
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/payments/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'payment_status', true, 'All Statuses', null);
                VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenant', null);
                VSUtil.setComboItems(mThis.elPaymentMethod, d.payment_methods, 'id', 'payment_method', '', 'All Payment Method', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillingListView.showPage(mThis.getFilterData());
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
                                    <select name="expense_type_id" data-style="material" class="data-input form-control" data-field="expense_type_id" placeholder="Expense Type">
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

                            

                        </div>

                    </div>
                    `;
                },
                contentCreated: (me) => {
                },
                configSelect: [
                    {
                        name: "vendor_type_id",
                        data: "types",
                        textField: "vendor_type",
                        valueField: "id",
                    },
                    {
                        name: "vendor_category_id",
                        data: "categories",
                        textField: "vendor_category",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Create Expense",
                    modifyTitle: "Modify Expense",
                    targetProp: "expense_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/vendor/form-options",].join(""),
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
                            vsapi.call([main_view.base_url, "/prm/vendor/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Vendor has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New vendor has been added successfully"
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







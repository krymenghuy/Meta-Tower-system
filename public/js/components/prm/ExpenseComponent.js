"use strict";
var ExpenseComponent =   ( () => {
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
            title: "Bill Number",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.payment_no ?? ''}</span>`,
        },
        {
            title: "Payment Date",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.payment_date ?? ''}</span>`,
        },
        {
            title: "Payee",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.tenant_name ?? ''}</span>`,
        },
        {
            title: "Status",
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
            title: "Amount",
            className: "align-middle",
            data: (data) => `<span class="text-yp-custom">${data.total_paid ?? ''}</span>`,
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillingListView = new ListView('_expense_list', {
            fetchApi: `${main_view.base_url}/prm/payments/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
               rowCreated:(data,index,tr)=>{


              tr.dataset.statusid = data.status_id;
              tr.classList.add('payment');
              tr.setAttribute('id',['payments_id',data.id].join(''));

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

    mThis.editBilling = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
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

      mThis.changeStatus = (id, lnk) =>{
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
           title:'Change Status',
           cssClass:'',
           backdropClose:true,
           //type:'select',
           label:'Payment Status',
           valueField:'status_id',
           textField:'name',
           confirmButtonText: "Submit",
           requiredMessage:'Select one valid status!',
           context:'success', // sucess | prmary | delete | danger | error
           data:[
                {status_id:"1",name:"Paid"},
                {status_id:"2",name:"Unpaid"},
                {status_id:"3",name:"partially Paid"},
            ],
           defaultValue: status_id,
           onConfirm:(value,btn,me)=>{
              const payload = {id, value :selected.value};
                    vsapi.post(`${mThis.base_url}/prm/payment/update-status`,payload,{loader:false}).then(res=>{
                        if(res.status_code ===200){
                            me.close();
                            cv_interact.success('Payment Status has been updated');
                            mThis.BillingListView.showPage(mThis.getFilterData());

                        }else{
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
                VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '','All Tenant', null);
                VSUtil.setComboItems(mThis.elPaymentMethod, d.payment_methods, 'id', 'payment_method', '','All Payment Method', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillingListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const CreateBillingdialog = (() => {
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


                        `<div class="row justify-content-center">

                            <div class="col-12">
                             <label style="color:#777777;padding-left:6px;" for="tenant_name">Tenant</label>
                                <div class="material-input outlined">
                                    <select name="tenant_id" class="data-input form-control" data-field="tenant_id"> </select>
                                </div>
                            </div>

                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="building">Building</label>
                                <div class="material-input outlined">
                                    <select name="building_id" class="data-input form-control" data-field="building_id">
                                    </select>
                                </div>
                            </div>

                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="buildingSpace">Space Code</label>
                                <div class="material-input outlined">
                                    <select name="space_id" class="data-input form-control" data-field="space_id"> </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="paymentMethod"> Select Payment Method</label>
                                <div class="material-input outlined">
                                    <select   name="payment_method_id" placeholder=" " class="data-input form-control" data-field="payment_method_id">
                                    </select>

                                </div>
                            </div>

                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="amount" required class="data-input form-control" data-field="amount" placeholder=" " />
                                    <label>Amount</label>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="discount" required class="data-input form-control" data-field="discount" placeholder=" " />
                                    <label>Discount</label>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="total" required class="data-input form-control" data-field="total_paid" placeholder=" " />
                                    <label>Total</label>
                                </div>
                            </div>


                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="note" placeholder=" "></textarea>
                                    <label>Note</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="d-none material-input outlined">
                                    <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                    <label>Status ID</label>
                                </div>
                            </div>
                        </div>`
                    ].join("");
                },


                contentCreated: (me) => {
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');

                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-yp-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');



                    headerTitle.classList.add('text-white', 'text-center', 'w-100');
                    headerWrapper.appendChild(headerTitle);

                    header.innerHTML = '';
                    header.appendChild(headerWrapper);




                },
                configSelect: [
                    {
                        name: "tenant_id",
                        data: "tenants",
                        textField: "tenant",
                        valueField: "id",
                    },

                    {
                        name: "payment_method_id",
                        data: "payment_methods",
                        textField: "payment_method",
                        valueField: "id",
                    },

                    {
                        name: "space_id",
                        data: "building_spaces",
                        textField: "code",
                        valueField: "id",
                    },

                    {
                        name: "building_id",
                        data: "buildings",
                        textField: "building",
                        valueField: "id",
                    },



                ],
                prepareFormOptions: {
                    createTitle: "Create New Payment",
                    modifyTitle: "Modify Payment ",
                    targetProp: "payment_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/payments/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    // console.log(12,data);
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');
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
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url, "/prm/payments/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Payment has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New payment has been added successfully"
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








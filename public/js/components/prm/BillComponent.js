"use strict";
var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bills";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elSearch = mThis.self.querySelector("#_search_bill");


    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        
        {
            transTitle: "titles.Vendor Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.vendor_name ?? ""}</span>`;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone_number ?? ""}</span>`
        },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom"> ${data.bill_number ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Bill Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.bill_date ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.due_date ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Sub-total",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.sub_total ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Grand Total",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.grand_total ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Description",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.d ?? '...'}</span>
                    </div>
                `;
            }
        }, 
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'active') {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                else if (status === 'inactive') {
                    cls = 'badge text-dark bg-danger-subtle border border-danger';
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ''}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_bill_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView('_bill_list', {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add('vendor');
                tr.setAttribute('id', ['vendor_id', data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BillListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateBillDialog.show(op);
        };


        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        }
        mThis.tblVendor = mThis.BillListView.getTable();
        mThis.initDropdownMenus(mThis.tblVendor);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
           
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
            actionButtonClass: "btn_dropdown_bill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_bill_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Bill"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Bill"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'change_bill_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'modify_bill': {
                        mThis.editBill(id, menuLink);
                        break;
                    }
                    case 'delete_bill': {
                        mThis.deleteBill(id, menuLink);
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
      mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";
        console.log(123,status_id);
        
        const inputOptions = {
            context: "success",
            title: "Change Status",
            label: "Vendor Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: "Save",
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(
                        `${mThis.base_url}/prm/vendor/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success(
                                "Vendor status has been updated",
                            );
                            mThis.BillListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(
                                res.error_message || "Unable to update status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };
    mThis.editBill = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };

        CreateBillDialog.show(op);
    }
    mThis.deleteBill = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Vendor?', {
            transTitle: 'Delete Vendor',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/vendor/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.BillListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/vendor/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
               
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();



const CreateBillDialog = (() => {
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
                <div class="vendor-form row p-1">
                        <div class="col-12 row pb-3">
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="vendor_id" class="data-input form-control" data-field="vendor_id" placeholder="Vendor Name">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Vendor Contact</label>
                                </div>
                            </div>
                            
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Bill Number</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="file" name="file_image" class="data-input form-control" data-field="file_image" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">File Image </label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
                                    <label style="color:#777777;padding-left:6px;">Bill Date</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="due_date" required class="data-input form-control form_input" data-field="due_date" />
                                    <label style="color:#777777;padding-left:6px;">Due Date</label>
                                </div>
                            </div>
                            

                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Subtotal</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Grand Total</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea name="description" class="data-input form-control" data-field="address" rows="3" placeholder="" ></textarea> 
                                    <label style="color:#777777;padding-left:6px;">Description</label>
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
                    createTitle: "Add New Bill",
                    modifyTitle: "Modify Bill",
                    targetProp: "bill_details",
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




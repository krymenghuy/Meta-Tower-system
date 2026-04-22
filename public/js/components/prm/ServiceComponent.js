"use strict";
var ServiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Service Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnService");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service");
    mThis.elFilter_type = mThis.self.querySelector('#_service_type_id');
    mThis.elSearch = mThis.self.querySelector("#_search_service");


    mThis.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.name ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Category",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Charge As",
            className: "align-middle text-nowrap",
            data: (data) => {
                const unit_type = data.unit_type == "hour" ? 'Hour' : 'One Time';
                return `<span class="badge text-info bg-info-subtle border border-info text-nowrap" style="min-width:70px;">${unit_type}</span>`;
            }
        },
        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                
                const currency = data.currency_code ?? 'USD';
                const unit_type = data.unit_type == "hour" ? 'Hour' : data.unit_type == "one_time" ? 'One Time' : '';
                const formattedPrice = VSMoney.formatAmount(data.price, currency);
                return `<span class="text-nowrap text-info">${formattedPrice} <small class="text-muted ">/ ${unit_type}</small></span>`;
            }
        },
        // {
        //     transTitle: "titles.Remark",
        //     className: "align-middle",
        //     data: (data, index, tr) => {
        //         return `
        //             <div class="text-primary-custom" style="width:120px;">
        //                 <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? ''}</span>
        //             </div>
        //         `;
        //     }
        // },
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
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_service_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ServiceListView = new ListView('_service_list', {
            fetchApi: `${main_view.base_url}/prm/service/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add('service');
                tr.setAttribute('id', ['service_id', data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ServiceListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateServiceDialog.show(op);
        };


        mThis.pr_tbl = mThis.ServiceListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblService = mThis.ServiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblService);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.ServiceListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ServiceListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            service_type_id: mThis.elFilter_type.value,
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
            actionButtonClass: "btn_service_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_service_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_service"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_service"
                },
            ],
            onShow: (me,container) => {
                const menu = me.getActiveMenus(container);
                menu.change_service_status.style.display =  'none';
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'change_service_status': {
                        mThis.changeServiceStatus(id, menuLink);
                        break;
                    }
                    case 'edit_service': {
                        mThis.editService(id, menuLink);
                        break;
                    }
                    case 'delete_service': {
                        mThis.deleteService(id, menuLink);
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
    mThis.changeServiceStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";
        const inputOptions = {
            context: "success",
            title: "Change Status",
            label: "Service Status",
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
                        `${mThis.base_url}/prm/service/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success(
                                "Service status has been updated",
                            );
                            mThis.ServiceListView.showPage(
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
    mThis.editService = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.ServiceListView.showPage(mThis.getFilterData());
            }
        };

        CreateServiceDialog.show(op);
    }
    mThis.deleteService = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ServiceListView.showPage(mThis.getFilterData());
            }
        };
        cv_interact.confirm('Delete this Service?', {
            transTitle: 'Delete Service',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/service/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.ServiceListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    };

    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/service/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(mThis.elFilter_type, d.service_types, 'id', 'service_type', '', 'All Categories ', '');
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ServiceListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const CreateServiceDialog = (() => {
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
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder="" />
                                    <label style="padding-left:6px;color:#777777;">Service 
                                    
                                    Name</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="service_types" class="data-input form-control" data-field="service_type_id" placeholder="Service Type">
                                    </select>
                                </div>
                           </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="price" required class="data-input form-control" data-field="price" placeholder="" />
                                    <label style="padding-left:6px;color:#777777;">Price</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="unit_type" class="data-input form-control" data-field="unit_type" placeholder="Unit Type">
                                        <option value="hour">Hour</option>
                                        <option value="one_time">One Time</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label style="padding-left:6px;color:#777777;">Remark</label>
                                </div>
                            </div>
                        </div>`
                    ].join("");
                },


                contentCreated: (me) => {
                },
                configSelect: [
                    {
                        name: "service_types",
                        data: "service_types",
                        textField: "service_type",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Create Service",
                    modifyTitle: "Modify Service ",
                    targetProp: "service_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/service/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    me.controls.unit_type.value = data.service_details.unit_type;
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
                            vsapi.call([main_view.base_url, "/prm/service/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Service has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New service has been added successfully"
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






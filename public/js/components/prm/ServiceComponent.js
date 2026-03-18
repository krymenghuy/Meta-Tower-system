"use strict";
var ServiceComponent =   ( () => {
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
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                // const cur_symbol = data.cur_symbol ?? '$';
                // const formattedPrice = data.price ? Number(data.price).toLocaleString() : '-';
                const currency = data.currency_code ?? 'USD';
                // const currency =  'KHR';
                const formattedPrice = VSMoney.formatAmount(data.price,currency);
                const unitLabel = data.unit_type ? `/ ${data.unit_type}` : '';
                return `<span class="text-nowrap fw-semibold text-primary">${formattedPrice} <small class="text-muted ">${unitLabel}</small></span>`;
        }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? '...'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle : "titles.Action",
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
               rowCreated:(data,index,tr)=>{


              tr.dataset.statusid = data.status_id;
              tr.classList.add('service');
              tr.setAttribute('id',['service_id',data.id].join(''));

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
                    html: '<span class="ps-2 " vslang="titles.Modify Service"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_service"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Service"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_service"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
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

    mThis.editService = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
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
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Service??', {
            transTitle: 'Delete Service',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/service/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.ServiceListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/service/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(mThis.elFilter_type, d.service_types, 'id', 'service_type', '', 'All Category ', '');
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
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
                                    <label style="padding-left:6px;color:#777777;">Name<span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select name="service_types" class="data-input form-control" data-field="service_type_id">
                                    </select>
                                    <label style="display:none;padding-left:6px;color:#777777;">Category<span class="text-danger">*</span></label>
                                </div>
                           </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="price" required class="data-input form-control" data-field="price" placeholder="0" />
                                    <label style="padding-left:6px;color:#777777;">Price<span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select name="unit_type" class="data-input form-control" data-field="unit_type">
                                        <option value="hour">Price Per Hour</option>
                                        <option value="month">Price Per Month</option>
                                        <option value="one_time">One Time Charge</option>
                                        <option value="kwh">Price Per Kwh</option>
                                        <option value="m3">Price Per M3</option>
                                        <option value="sqm">Price Per Sqm</option>
                                    </select>
                                    <label style="display:none;padding-left:6px;color:#777777;" for="service_types">Charge As</label>

                                </div>
                            </div>

                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label style="padding-left:6px;color:#777777;">Remarks</label>

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






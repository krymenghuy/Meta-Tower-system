"use strict";

var ContractComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.base_url = main_view.base_url;
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elFilter_status = mThis.self.querySelector("#el_status");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");



    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            title: " ID",
            className: "align-middle",
            data: (data, index) => `<span class="text-yp-custom">${data.id}</span>`,
        },
        {
            title: " tenant",
            className: "align-middle",
            data: (data, index) => `<span class="text-yp-custom">${100001 + index}</span>`,
        },
        {
            title: "Business Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-yp-custom" style="width:75px;">${data.business_name}</span>`;
            }
        },
        {
            title: "start date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.start_date ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "end date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.end_date ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "space",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.space_id ?? 'N/A'}</span>
                    </div>
                `;
            }
        },

        {
            title: "Size",
            className: "align-middle",
            data: (data) => {
                return data.price_type === 'total'
                    ? `<span class="text-primary-custom">Whole Room</span>`
                    : `<span class="text-primary-custom">${data.sqm_size ?? '-'} <small class="text-danger">(sqm)</small></span>`;
            }
        },
        {
            title: "Price",
            className: "align-middle",
            data: (data) => {
                const cur_symbol = data.cur_symbol ?? '$';
                const formattedPrice = data.price ? Number(data.price).toLocaleString() : '-';

                return data.price_type === 'total'
                    ? `<span class="fw-semibold">${cur_symbol} ${formattedPrice} <small class="text-muted">/monthly</small></span>`
                    : `<span class="text-primary-custom">${cur_symbol} ${formattedPrice} <small class="text-muted">/sqm</small></span>`;
            }
        },
        
        {
            title: "remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-yp-custom rounded-2 text-nowrap">
                           <span><i class="fa fa-pencil"></i></span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/building/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {


                tr.dataset.statusid = data.status_id;
                tr.classList.add('contract');
                tr.setAttribute('id', ['contract_id', data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ContractListView.showPage(mThis.getFilterData());
                }
            };
            ContractDialog.show(op);
        };


        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblBuilding = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuilding);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());
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
                    html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contact"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_contract"
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
                    case 'edit_contract': {
                        mThis.editBuilding(id, menuLink);
                        break;
                    }
                    case 'delete_contract': {
                        mThis.deleteBuilding(id, menuLink);
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

    mThis.editBuilding = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };


        ContractDialog.show(op);
    }
    mThis.deleteBuilding = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this contract?', {
            title: 'Delete Contract',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/building/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.ContractListView.showPage();
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
        console.log(123, status_id);

        const inputOptions = {
            title: 'Change Status',
            dataLabel: "Building Status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                { status_id: "1", name: "Available" },
                { status_id: "2", name: "Unavailable" }
            ],
            defaultValue: status_id
        };
        InputBox2.show(inputOptions, (selected) => {
            if (!selected) return;
            if (!AuthManager.allowed(321)) return;
            const status = { id, status_id: selected.value };
            vsapi.call(`${mThis.base_url}/prm/building/update-status`, status).then(res => {
                if (res.status_code === 200) {
                    InputBox2.close();
                    cv_interact.success('The Contract Status has been updated');
                    mThis.ContractListView.showPage(mThis.getFilterData());

                } else {
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        });

    }
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/building/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'building_status', true, 'All Statuses', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();




const ContractDialog = (() => {
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
        `<div class="row justify-content-center">
            <div class="col-6">
                <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
                 <div class="material-input outlined">
                     <select name="tenant_id" class="data-input form-control" data-field="tenant_id"> </select>
                 </div>
            </div>

            <div class="col-6">
                <label style="color:#777777;padding-left:6px;" for="businessType">Business Type</label>
                 <div class="material-input outlined">
                     <select name="business_type_id" placeholder=" " class="data-input form-control" data-field="business_type_id"> </select>
                 </div>
            </div>

             <div class="col-6">
                <label style="color:#777777;padding-left:6px;" for="tenant">Space</label>
                 <div class="material-input outlined">
                     <select name="space_code" class="data-input form-control" data-field="building_space_code"> </select>
                 </div>
            </div>
            <div class="col-6">
                <label style="color:#777777;padding-left:6px;" for="spaceType">Space Type</label>
                <div class="material-input outlined">
                    <select   name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                    </select>
                                    
                </div>
            </div>
           

            <div class="col-6">
                <div class="material-input outlined">
                    <input type="date" name="start_date" required class="data-input form-control" data-field="start_date" placeholder=" " />
                    <label>Start Date</label>
                </div>
            </div>

            <div class="col-6">
                <div class="material-input outlined">
                    <input type="date" name="end_date" required class="data-input form-control" data-field="end_date" placeholder=" " />
                    <label>End Date</label>
                </div>
            </div>
             <div class="col-12">
                <div class="material-input outlined">
                <select   name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                    <option value="">Select Price Type</option>
                    <option value="sqm">Per Square Meter</option>
                    <option value="total">Whole Room</option>
                </select>
                     <label class="d-none">Price Type</label>
                </div>
            </div>
            <div class="col-12">
                <div class="material-input outlined sqm-wrapper" style="display:none;">
                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                    <label>Size (m²)</label>
                </div>
            </div>
            <div class="col-12">    
                <div class="material-input outlined">
                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                    <label>Price</label>
                </div>
            </div>
            

            <div class="col-12">
                <div class="material-input outlined">
                    <textarea class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                    <label>Remarks</label>
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
                    me.controls.price_type.onchange = (e) => {
                        const sqmWrapper = me.controls.sqm_size.closest('.sqm-wrapper');
                        if (!sqmWrapper) return;
                        sqmWrapper.style.display = e.target.value === 'sqm' ? '' : 'none';
                    };


                },
                configSelect: [
                    
                    {
                        name: "business_type_id",
                        data: "business_types",
                        textField: "business_type",
                        valueField: "id",
                    },
                    {
                        name: "space_type_id",
                        data: "space_types",
                        textField: "space_type",
                        valueField: "id",
                    },

                ],
                
                prepareFormOptions: {
                    createTitle: "Create New Contract",
                    modifyTitle: "Modify Contract",
                    targetProp: "building_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/building/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    //LocaleManager.translateZone(me.divModal); //Translation is automatic!
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');

                    
                },


                // onPrepareForm: (me, data) => {
                //     LocaleManager.translateZone(me.divModal);
                //     me.controls.price_type.onchange = function (e) {
                //         e.preventDefault();
                //         const value = me.controls.price_type.value;
                //         const parent = me.controls.price_type.closest('.col-12');
                //         if (!parent) return;

                //         const container = parent.parentElement;
                //         if (!container) return;

                //         const labelElement = container.querySelector('label[vslang="titles.Total (m²)"]');
                //         if (!labelElement) return;

                //         labelElement.textContent = value === 'price'
                //             ? LocaleManager.trans('Total (m²)', 'titles')
                //             : LocaleManager.trans('Total ($)', 'titles');
                //     };
                //     me.controls.discount_type.dispatchEvent(new Event('change'));
                // },


                buttons: [
                    {
                        label: '<span>Cancel</span>',
                        cssClass: 'btn-vs-cancel',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span>Submit</span>',
                        cssClass: 'btn-vs-save',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url, "/prm/building/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Contract has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New contract has been added successfully"
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

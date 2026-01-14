"use strict";
var TenantComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Tenant Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant");
    // mThis.elFilter_status = mThis.self.querySelector("#el_status");

    // View toggle button card and list table
    mThis.btnListView = mThis.self.querySelector("#_btnListView");
    mThis.btnCardView = mThis.self.querySelector("#_btnCardView");
    mThis.listContainer = mThis.self.querySelector("#_tenant_list");
    mThis.cardContainer = mThis.self.querySelector("#_tenant_cards");

    mThis.currentView = 'list'; // default view


    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        // {
        //     title: "Tenant ID",
        //     className: "align-middle",
        //    data: (data, index) => `<span class="text-yp-custom">${100001 + index}</span>`,
        // },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="font-size:12px;"><i class="fa-solid text-gary "></i>${data.name ?? ''}</span>
                        <small class="d-block text-muted">${sexLabel}</small>`;

            }
        },
        {
            title: "National ID",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.national_id ?? ''}</span>`;
            }
        },
        {
            title: "Passport Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.passport_number ?? ''}</span>`;
            }
        },
        {
            title: "Legal Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.legal_name ?? ''}</span>`;
            }
        },
        {
            title: "contact Info",
            className: "align-middle",
            data: (data, index, tr) =>
                `<span class="d-block text-primary" style="font-size:12px;"><i class="fa-solid text-success px-1 fa-envelope"></i> ${data.email ?? ""}</span>
                 <span class="d-block" style="font-size:12px;"><i class="fa-solid text-warning px-1 fa-phone"></i> ${data.phone_number ?? ""}</span>`,
        },
        {
            title: "Address",
            className: "align-middle ",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i><span class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
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
        // Initialize list View
        mThis.TenantListView = new ListView('_tenant_list', {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
                tr.dataset.statusid = data.status_id;
                tr.classList.add('tenant');
                tr.setAttribute('id',['tenant_id',data.id].join(''));
            },
            listContainerClass: null
        });
        // Initialize Card View
        mThis.TenatCardView = new CardView('_tenant_cards', {
        fetchApi:`${main_view.base_url}/prm/tenant/list-all`,
        perPage: 12,
        apiCluster: main_view.apiCluster,
        cardTemaple: mThis.createCardTemplate,
        onCardCreated: mThis.onCardCreated
        });

        mThis.btnListView.onclick = (e)=>{
            e.preventDefault();
            mThis.switchView('list');
        }
        mThis.btnCardView.onclick =(e) =>{
            e.preventDefault();
            mThis.switchView('card');
        }
        
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.TenantListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateTenantDialog.show(op);
        };


        mThis.pr_tbl = mThis.TenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblTenant = mThis.TenantListView.getTable();
        mThis.initDropdownMenus(mThis.tblTenant);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.TenantListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.TenantListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    // Switch between List and Card View
    mThis.switchView = (view) =>{
        mThis.currentView = ViewType;
        if(viewType ==='list'){
            mThis.listContainer.classList.add('d-none');
            mThis.cardContainer.classList.remove('d-none');
            mThis.btnCardView.classList.remove('active');
            mThis.btnListView.classList.add('active');
            mThis.TenatListView.showPage(mThis.getFilterData());
        }else{
            mThis.cardContainer.classlist.add('d-none');
            mThis.listContainer.classlist.remove('d-none');
            mThis.btnListView.classList.remove('active');
            mThis.btnCardView.classList.add('active');
            mThis.TenantCardView.showPage(mThis.getFilterData());
        }
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
                // {
                //     html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                //     icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

                //     cssClass: "border-bottom pb-2",
                //     name: "change_status"
                // },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_tenant"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant"
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
                    case 'edit_tenant': {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case 'delete_tenant': {
                        mThis.deleteTenant(id, menuLink);
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

    mThis.editTenant = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
                mThis.TenantListView.showPage(mThis.getFilterData());
            }
        };
        console.log(1123,op);

        CreateTenantDialog.show(op);
    }
     mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TenantListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Tenant??', {
            title: 'Delete Tenant',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/tenant/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.TenantListView.showPage();
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
        console.log(123,status_id);

        const inputOptions = {
            title: 'Change Status',
            dataLabel: "Tenant Status",
            valueMember: "tenant_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data:[
                {status_id:"1",name:"Active"},
                {status_id:"2",name:"Inactive"}
            ],
            defaultValue: status_id
        };
        InputBox2.show(inputOptions,(selected)=>{
            if(!selected) return;
            if(!AuthManager.allowed(321)) return;
            const status = {id,status_id:selected.value};
            vsapi.call(`${mThis.base_url}/prm/tenant/update-status`,status).then(res=>{
                if(res.status_code ===200){
                    InputBox2.close();
                    cv_interact.success('Tenant Status has been updated');
                    mThis.TenantListView.showPage(mThis.getFilterData());

                }else{
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        });

    };
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/tenant/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'tenant_status', true, 'All Statuses', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.TenantListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const CreateTenantDialog = (() => {
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
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label>Full Name</label>
                                </div>
                            </div>



                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="legal_name" required class="data-input form-control" data-field="legal_name" placeholder=" " />
                                    <label>Legal Name</label>
                                </div>
                            </div>


                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;" for="sex"> Select Gender</label>
                                <div class="material-input outlined">
                                    <select name="sex" placeholder=" " class="data-input form-control" data-field="sex">
                                        <option value="m">Male</option>
                                        <option value="f">Female</option>
                                    </select>
                                </div>
                            </div>


                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="tel" name="phone_number" required class="data-input form-control" data-field="phone_number" placeholder=" " />
                                    <label>Phone Number</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="email" required class="data-input form-control" data-field="email" placeholder=" " />
                                    <label>Email</label>
                                </div>
                            </div>


                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                    <label>Address</label>
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
                // configSelect: [
                //     {
                //         name: "nationality_id",
                //         data: "nationality",
                //         textField: "nationality",
                //         valueField: "id",
                //     },

                // ],
                prepareFormOptions: {
                    createTitle: "Create New Tenant",
                    modifyTitle: "Modify Tenant ",
                    targetProp: "tenants",
                    api: {
                        endpoint: [main_view.base_url, "/prm/tenant/form-options",].join(""),
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
                    if(btnClose) btnClose.classList.add('d-none');
                },


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
                            vsapi.call([main_view.base_url, "/prm/tenant/create",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Tenant has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New tenant has been added successfully"
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

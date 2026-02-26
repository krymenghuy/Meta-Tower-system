"use strict";

var ContractComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    // mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
    // mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elStatus = mThis.self.querySelector("#el_contract_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");



    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },



        // {
        //     transTitle: "Status",
        //     className: "align-middle text-center",
        //     data: (data) => {

        //         const status = (data.status ?? '').toLowerCase();

        //         let cls = 'badge text-dark bg-warning-subtle border border-warning';

        //         if (status === 'active') {
        //             cls = 'badge text-success bg-success-subtle border border-success';
        //         }
        //         else if (status === 'expired') {
        //             cls = 'badge text-dark bg-danger-subtle border border-danger';
        //         }
        //         else if (status === 'terminated') {
        //             cls = 'badge text-danger bg-danger-subtle border border-danger';
        //         }

        //         return `
        //             <span class="${cls} text-capitalize d-inline-block text-center"
        //                 style="min-width:80px"
        //                 data-status_id="${data.status_id}">
        //                 ${data.status ?? ''}
        //             </span>
        //         `;
        //     },
        // },
        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index) => `<div class="text-prm-custom" style="width:180px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.tenant_name ?? ''}</span>
                    </div>
                    `,
        },
        {
            transTitle: "titles.Contact Info",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block">${data.phone_number ?? ''}</span>
                        <small class="d-block text-primary">${data.email}</small>`;
            }
        },
         {
            transTitle: "titles.Start Date",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index, tr) => {
                return `<small class="px-2 py-1 bg-body-secondary text-muted rounded-5"><i class="fa-regular fa-clock"></i> ${data.start_date ?? ''}</small>`;
            }
        },
         {
            transTitle: "titles.End Date",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index, tr) => {
                return `<small class="px-2 py-1 bg-body-secondary text-muted rounded-5"><i class="fa-regular fa-clock"></i> ${data.end_date ?? ''}</smaLL>`;
            }
        },
        //  {
        //     transTitle: " Legal Name",
        //     className: "align-middle text-nowrap text-capitalize",
        //     data: (data, index) => `<div class="text-prm-custom" style="width:150px;">
        //                 <span class="text-wrap text-break" style ="word-break:break-word;">${data.legal_name ?? ''}</span>
        //             </div>`,
        // },
        {
            transTitle: "titles.Business",
            className: "align-middle text-nowrap text-capitalize",
            data: (data) => {
                return `<span class="text-prm-custom">${data.business_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-white rounded font-medium">${data.space_code ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Type",
            className: "align-middle text-nowrap text-capitalize",
            data: (data) => {
                return `<span class="text-prm-custom">${data.space_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Price",
            className: "align-middle text-nowrap text-capitalize",
            data: (data) => {
                const cur = data.cur_symbol ?? '$';
                const price = data.price ? Number(data.price).toLocaleString() : '-';

                if (data.price_type === 'total') {
                    return `
                        <span class="fw-semibold">
                            ${cur} ${price}
                            <small class="text-muted">/mon</small>
                        </span>
                        <div class="text-muted small">Whole Room</div>
                    `;
                }

                return `
                    <span class="text-primary-custom">
                        ${cur} ${price}
                        <small class="text-muted">/sqm</small>
                    </span>
                    <div class="text-muted small">
                        ${data.sqm_size ?? '-'} sqm
                    </div>
                `;
            }
        },

        {
            transTitle: "titles.remark",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:120px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
         {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();

                let cls  = 'badge rounded-5 border border-warning text-warning bg-warning-subtle';
                let icon = 'bi-check-circle-fill';
                let dot  = 'bg-warning';

                if (status === 'active') {
                    cls  = 'badge rounded-4 shadow-sm border border-success text-success bg-success-subtle';
                    icon = 'fa-regular fa-circle-check';
                    dot  = 'bg-success';
                }
                else if (status === 'expired') {
                    cls  = 'badge rounded-5 shadow-sm border border-danger text-danger bg-danger-subtle';
                    icon = 'fa-regular fa-clock';
                    dot  = 'bg-danger';
                }
                else if (status === 'terminated') {
                    cls  = 'badge rounded-5 shadow-sm border border-warning text-warning bg-warning-subtle';
                    icon = 'fa-regular fa-circle-xmark';
                    dot  = 'bg-warning';
                }

                return `
                    <span class="${cls} px-3 py-2 d-inline-flex align-items-center gap-2"
                        style="min-width:110px"
                        data-status_id="${data.status_id}">
                        <i class="${icon}" style="font-size:13px;"></i>

                        <span class="text-capitalize">${data.status ?? ''}</span>
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap text-capitalize',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom fw-semibold">${data.update_user ?? ''}</span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle text-capitalize',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn_contract_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm  rounded-2 text-nowrap">
                            <span>
                                <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                            </span>
                       </button>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
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
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);

        // Filter change handler with tooltip reinitialization
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after filter
                setTimeout(() => {
                    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        // Search handler with tooltip reinitialization
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after search
                setTimeout(() => {
                    $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
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
            actionButtonClass: "btn_contract_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Generate Invoice"></span>',
                    icon: `<i class="fa-solid fa-dollar-sign text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "generate_invoice"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Renew Contract"></span>',
                    icon: `<i class="fa-solid fa-arrows-rotate fs-5 text-prm-custom"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "renew_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Print Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_contract"
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;

                // menu.edit_student.style.display = enroll_finalized == 1 ? 'none' : 'block';
                menu.renew_contract.style.display = (status_id == 1 || status_id == 2) ? 'block' : 'none';
                menu.renew_contract.style.display = status_id == 2 ? 'none' : 'block';
                menu.edit_contract.style.display = status_id == 2 ? 'none' : 'block';
                menu.generate_invoice.style.display = status_id ==2 ? 'none': 'block';


            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'generate_invoice':{
                        mThis.generateInvoice(id,menuLink);
                        break;
                    }
                    case 'edit_contract': {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case 'renew_contract': {
                        mThis.renewContract(id, menuLink);
                        break;
                    }
                    case 'print_contract': {
                        mThis.printContract(id, menuLink);
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
    mThis.CreateInvoiceServiceRequestDialog =(id,menulink) =>{
        let op ={
            id: id,
            btn: menulink,
            onCLose:() =>{
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        }
    }

    mThis.editContract = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        ContractDialog.show(op);
    }
    mThis.renewContract = (id, menulink) => {
        if (!id) return;

        let op = {
            id: id,
            contract_id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };

        RenewDialog.show(op);
    };

    mThis.printContract = (id, menulink) => {
       alert('Coming Soon');
    }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/contract/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(mThis.elStatus, d.statuses, 'id', 'status_name', true, 'All Statues', null);
                // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'id', 'business_type', true, 'business type', null);

                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());

            // Initialize tooltips after table loads
            setTimeout(() => {
                $('[data-bs-toggle="tooltip"]').tooltip();
                console.log('Tooltips initialized');
            }, 800);

            // Auto-refresh every hour to update contract statuses
            if (!mThis.autoRefreshInterval) {
                mThis.autoRefreshInterval = setInterval(() => {
                    console.log('Auto-refreshing contracts...');
                    mThis.ContractListView.showPage(mThis.getFilterData());

                    // Re-initialize tooltips after refresh
                    setTimeout(() => {
                        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }, 800);
                }, 3600000); // 1 hour = 3600000ms
            }
        });
    };

    return mThis;
})();

const ContractDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                console.log(111,op);

                return [
                    `<div class="row justify-content-start">
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
                            <div class="material-input outlined">
                            <input name="tenant" class="data-input form-control" data-field="tenant_id">
                       <!--       <select name="c" class="data-input form-control" data-field="tenant_id"> </select>-->
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="legalName">Legal Name</label>
                            <div class="material-input outlined">
                                <input name="legal_name" class="data-input form-control" data-field="legal_name" />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Start Date</label>
                            <div class="material-input outlined">
                                <input type="date" name="start_date" required class="data-input form-control form_input" data-field="start_date" />
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">End Date</label>
                            <div class="material-input outlined">
                                <input type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" />
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="businessType">Business Type</label>
                            <div class="material-input outlined">
                                <select name="business_type_id" placeholder=" " class="data-input form-control" data-field="business_type_id"> </select>
                            </div>
                        </div>

                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px; user-select: none;pointer-events: none;" for="Code">Unit Code</label>
                            <div class="material-input outlined">
                                <select name="code" placeholder=" " class="data-input form-control" data-field="space_id">
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="spaceType">Unit Type</label>
                            <div class="material-input outlined">
                                <select  name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                                </select>
                            </div>
                        </div>
                        <!-- <div class="col-4 sqm-wrapper" style="display:none;"> -->
                            <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Size (m²)</label>
                            <div class="material-input outlined">
                                <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;" for="priceType">Unit Price</label>
                            <div class="material-input outlined">
                            <select name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                                <option value="sqm">Per Square Meter</option>
                                <option value="total">Whole Room</option>
                            </select>
                            </div>
                        </div>



                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Price</label>
                            <div class="material-input outlined">
                                <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                            </div>
                        </div>

                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Remarks</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                            </div>
                        </div>
                    </div>`
                ].join("");
            },

            contentCreated: (me) => {
                me.searchTenant= VSSearchInput.init(me.controls.tenant,{
                    type: 'select',
                    prefetch: true,
                    // api:
                    query: {
                        from: 'tenants',
                        select: ['id', 'name', 'code', 'legal_name'],
                        searchFields: { name: 'LIKE', code: '=',legal_name:'LIKE' }
                    },
                    // showColumnHeader: false,
                    columns:{
                        name: "Name",
                        code: "Code",
                        legal_name: "Legal Name"
                    }
                });
                // DateTimePicker.initAll(me.divModal);
                // const footer = me.divModal.querySelector('.modal-footer');
                // const header = me.divModal.querySelector('.modal-header');
                // const headerTitle = header.querySelector('.modal-transTitle');
                // const btnClose = header.querySelector('button');

                // btnClose.classList.add('d-none');
                // header.classList.add('bg-prm-custom', 'modal-header-custom');
                // header.parentElement.classList.add('overflow-hidden');
                // header.parentElement.style = 'border-radius: 20px !important;';

                // const headerWrapper = document.createElement('div');
                // headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                // headerTitle.classList.add('text-white', 'text-center', 'w-100');
                // headerWrapper.appendChild(headerTitle);
                // header.innerHTML = '';
                // header.appendChild(headerWrapper);


                //Transform input into select, if me.controls.tenant_id is an <input>, not <select>
                //   me.selectTenant = VSSearchInput.init(me.controls.tenant_id,{
                //         //type:'select',
                //         query:{
                //            from:'tenants',
                //            select:['id','name','code'],
                //            searchFields:{_search_tenant:'LIKE'}
                //         },
                //         columns:{
                //             name:'Name'
                //         }
                //  });

                me.controls.tenant_id.onchange = (e) => {
                    const p = {tenant_id:me.controls.tenant_id.value};

                    vsapi.call([main_view.base_url, "/prm/contract/get-tenant-info"].join(""), p, null, null).then((res) => {
                            const d = res;
                            console.log(3333,d);

                            if(d){
                                me.controls.legal_name.value = d.legal_name;

                            }

                        });

                };
            },

            configSelect: [
                {
                    name: "tenant_id",
                    data: "tenants",
                    textField: "tenant",
                    valueField: "id",
                },
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
                {
                    name: "code",
                    data: "building_spaces",
                    textField: "floor_id",
                    valueField: "id",
                },
            ],

            prepareFormOptions: {
                createTitle: "Create Contract",
                modifyTitle: "Modify Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options",].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);

                // const isReadOnly = me.dataOptions.data.code > 0;
                // me.setReadOnly(isReadOnly, ['code','space_type_id','price_type','price','sqm_size']);

                const header = me.divModal.querySelector('.modal-header');
                const btnClose = header.querySelector('button');
                if(btnClose) btnClose.classList.add('d-none');

                // me.controls.space_type_id.value = me.dataOptions.data.space_type_id;
                // me.controls.code.value = me.dataOptions.data.code;
                // me.controls.price_type.value = me.dataOptions.data.price_type;
                // me.controls.price.value = me.dataOptions.data.price;
                // me.controls.sqm_size.value = me.dataOptions.data.sqm_size;
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

                        vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Contract has been updated successfully");
                                } else {
                                    cv_interact.success("New contract has been added successfully");
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
const RenewDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
           createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="p-3 mb-3 bg-light border rounded">
                                <h6 class="mb-3 text-secondary">Old Contract</h6>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">Start Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="start_date" class="data-input form-control" data-field="start_date" disabled />
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">End Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="end_date" class="data-input form-control" data-field="end_date" disabled />
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <label style="color:#777777;padding-left:6px;">Price</label>
                                        <div class="material-input outlined">
                                            <input type="number" name="price" class="data-input form-control" data-field="price" disabled />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-primary">Renew Contract</h6>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Start Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="start_date" class="data-input form-control" data-field="start_date" />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">End Date</label>
                                        <div class="material-input outlined">
                                            <input type="date" name="end_date" class="data-input form-control" data-field="end_date" />
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Price Type</label>
                                        <div class="material-input outlined">
                                            <select name="price_type" class="data-input form-control" data-field="price_type">
                                                <option value="sqm">Per Square Meter</option>
                                                <option value="total">Whole Room</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label style="color:#777777;padding-left:6px;">Price</label>
                                        <div class="material-input outlined">
                                            <input type="number" name="price" class="data-input form-control" data-field="price" />
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label style="color:#777777;padding-left:6px;">Remarks</label>
                                        <div class="material-input outlined">
                                            <textarea name="remarks" class="data-input form-control" data-field="remarks"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },


            contentCreated: (me) => {
                DateTimePicker.initAll(me.divModal);
            },

            prepareFormOptions: {
                createTitle: "Renew Contract",
                modifyTitle: "Renew Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options"].join(""),
                    params: (op) => ({ id: op.id }),
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.controls.start_date.value = data.contract_details.end_date;
                me.controls.end_date.value = '';
                me.controls.price.value = '';
                me.controls.price_type.value = '';
                me.controls.remarks.value = '';
                // me.controls.price.value = data.contract_details.price;
                // me.controls.price_type.value = data.contract_details.price_type;
                // me.controls.remarks.value = data.contract_details.remarks;
            },

            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn-vs-cancel',
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span>Renew</span>',
                    cssClass: 'btn-vs-save',
                    click: (me, btn) => {
                        const op = me.getData();
                        op.id = me.dataOptions.id; // existing contract id

                        vsapi.call([main_view.base_url, "/prm/contract/renew"].join(""), op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success("Contract has been renewed successfully");
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



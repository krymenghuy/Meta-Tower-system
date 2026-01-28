"use strict";

var ContractComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
    mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elFilter_status = mThis.self.querySelector("#el_status");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");



    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "ID",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index) =>  `<span class="text-yp-custom">${String(index + 1).padStart(3, '0')}</span>`
        },
        {
            title: "Name",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index) => `<span class="text-primary-custom">${data.tenant_name}</span>`,
        },
        {
            title: " Legal Name",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index) => `<span class="text-primary-custom fw-medium">${data.legal_name}</span>`,
        },
        {
            title: "Contact Info",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block" style="font-size:12px;">${data.phone_number ?? ''}</span>
                        <small class="d-block text-primary">${data.email}</small>`;
            }
        },
        {
            title: "Business / Space",
            className: "align-middle text-nowrap text-capitalize",
            data: (data) => {
                return `<span class="d-block" style="font-size:12px;">${data.business_type ?? ''}</span>
                        <small class="d-block text-muted">${data.space_type}</small>`;
            }
        },
        {
            title: "Duration",
            className: "align-middle text-nowrap text-capitalize",
            
            data: (data) => {
                
                const parseDate = (dateStr) => {
                    if (!dateStr) return null;
                    
                    const months = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                    };
                    
                    const parts = dateStr.split('-');
                    if (parts.length !== 3) return null;
                    
                    const [day, month, year] = parts;
                    if (!months.hasOwnProperty(month)) return null;
                    
                    return new Date(year, months[month], parseInt(day));
                };

                const start = parseDate(data.start_date);
                const end = parseDate(data.end_date);
                
                if (!start || !end) {
                    return `<small class="text-muted">Invalid date</small>`;
                }
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Calculate days
                const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
                const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
                
                let progressClass = 'bg-success';
                let statusText = 'Active';
                let textColor = 'text-success';
                let progressWidth = 0;
                let tooltipText = '';
                
                if (today < start) {
                    // Contract hasn't started yet
                    progressClass = 'bg-info';
                    statusText = 'Pending';
                    textColor = 'text-info';
                    progressWidth = 0;
                    const daysUntilStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
                    tooltipText = `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`;
                } else if (today > end) {
                    // Contract has ended
                    progressClass = 'bg-danger';
                    statusText = 'Expired';
                    textColor = 'text-danger';
                    progressWidth = 100;
                    const daysExpired = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
                    tooltipText = `Expired ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`;
                } else {
                    // Contract is active
                    progressWidth = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
                    
                    if (remainingDays <= 7) {
                        // Expiring soon (within 7 days)
                        progressClass = 'bg-warning';
                        textColor = 'text-warning';
                        statusText = 'Expiring Soon';
                        tooltipText = `${remainingDays} day${remainingDays !== 1 ? 's' : ''} remaining`;
                    } else if (remainingDays <= 30) {
                        // Expiring this month (within 30 days)
                        progressClass = 'bg-warning';
                        textColor = 'text-warning';
                        statusText = 'Active';
                        tooltipText = `${remainingDays} days remaining`;
                    } else {
                        // Active with plenty of time
                        statusText = 'Active';
                        tooltipText = `${remainingDays} days remaining`;
                    }
                }

                return `
                    <div class="d-flex flex-column gap-1">
                        <small class="text-muted">
                            ${data.start_date} – ${data.end_date}
                        </small>
                        <div class="progress" style="height:6px; width:70%;">
                            <div
                                class="progress-bar ${progressClass} progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style="width:${progressWidth}%"
                                aria-valuenow="${progressWidth}"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="${tooltipText}">
                            </div>
                        </div>
                        <small class="text-start ${textColor}">• ${statusText}</small>
                    </div>
                `;
            }
        },
        {
            title: "Space / code",
            className: "align-middle text-nowrap text-capitalize",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-white rounded font-medium">${data.space_code ?? ''}</span>`;
            }
        },
        {
            title: "Price / Size",
            className: "align-middle text-nowrap text-capitalize",
            data: (data) => {
                const cur = data.cur_symbol ?? '$';
                const price = data.price ? Number(data.price).toLocaleString() : '-';

                if (data.price_type === 'total') {
                    return `
                        <span class="fw-semibold">
                            ${cur} ${price}
                            <small class="text-muted">/month</small>
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
            title: "remark",
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
            title: "Updated By",
            className: 'align-middle text-nowrap text-capitalize',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle text-capitalize',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
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
            // rememberCurrentPage: false,
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
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);




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
                    html: '<span class="ps-2 " vslang="titles.Modify Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Print Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_contract"
                },
                // {
                //     html: '<span class="ps-2" vslang="titles.Delete Contract"></span>',
                //     icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "delete_contract"
                // },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {

                   
                    case 'edit_contract': {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case 'print_contract': {
                        mThis.printContract(id, menuLink);
                        break;
                    }
                    // case 'delete_contract': {
                    //     mThis.deleteContract(id, menuLink);
                    //     break;
                    // }

                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
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
    mThis.printContract = (id, menulink) => {
       alert('Coming Soon');
    }
    // mThis.deleteContract = (id, menuLink) => {
    //     let op = {
    //         id: id,
    //         btn: menuLink,
    //         onClose: () => {
    //             mThis.ContractListView.showPage(mThis.getFilterData());
    //         }
    //     };
    //     if (!AuthManager.allowed(242)) return;
    //     cv_interact.confirm('Delete this contract?', {
    //         title: 'Delete Contract',
    //         context: 'delete',
    //         confirmButtonText: "Delete"
    //     }, function (e) {
    //         if (e) {
    //             vsapi.call(`${main_view.base_url}/prm/contract/delete`, op, false, false, false).then(res => {
    //                 if (res.status_code == 200) {
    //                     mThis.ContractListView.showPage();
    //                 }
    //             })
    //         }
    //         else {
    //             cv_interact.error(res.error_message);
    //         }
    //     });
    // }

    // mThis.changeStatus = (id, lnk) => {
    //     const tr = lnk.closest('tr');
    //     const status_id = VSUtil.properCase(tr?.dataset.statusid || "");
    //     console.log(123, status_id);

    //     const inputOptions = {
    //         title: 'Change Status',
    //         dataLabel: "Building Status",
    //         valueMember: "status_id",
    //         textMember: "name",
    //         confirmButtonText: "Save",
    //         blankErrorMessage: "Status is not correct!",
    //         data: [
    //             { status_id: "1", name: "Available" },
    //             { status_id: "2", name: "Unavailable" }
    //         ],
    //         defaultValue: status_id
    //     };
    //     InputBox2.show(inputOptions, (selected) => {
    //         if (!selected) return;
    //         if (!AuthManager.allowed(321)) return;
    //         const status = { id, status_id: selected.value };
    //         vsapi.call(`${mThis.base_url}/prm/building/update-status`, status).then(res => {
    //             if (res.status_code === 200) {
    //                 InputBox2.close();
    //                 cv_interact.success('The Contract Status has been updated');
    //                 mThis.ContractListView.showPage(mThis.getFilterData());

    //             } else {
    //                 cv_interact.error(res.error_message || 'Unable to update status');
    //             }
    //         });
    //     });

    // }
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/contract/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'id', 'business_type', true, 'All Business Type', null);
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', true, 'All Space Type', null);

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
    // console.log(88888,op);

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-start">
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
                                <div class="material-input outlined">
                                    <select name="tenant_id" class="data-input form-control" data-field="tenant_id"> </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="legalName">Legal Name</label>
                                <div class="material-input outlined">
                                    <input name="legal_name" class="data-input form-control" data-field="legal_name" />
                                </div>
                            </div>

                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px;" for="businessType">Business Type</label>
                                <div class="material-input outlined">
                                    <select name="business_type_id" placeholder=" " class="data-input form-control" data-field="business_type_id"> </select>
                                </div>
                            </div>

                            
                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px;" for="spaceType">Space Type</label>
                                <div class="material-input outlined">
                                    <select  name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                                    </select>
                                                    
                                </div>
                            </div>
                           
                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px; user-select: none;pointer-events: none;" for="Code">Code</label>
                                <div class="material-input outlined">
                                    <select name="code" placeholder=" " class="data-input form-control" data-field="space_id">
                                    </select>
                                                    
                                </div>
                            </div>
                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px;">Start Date</label>
                                <div class="material-input outlined">
                                    <input type="date" name="start_date" required class="data-input form-control form_input" data-field="start_date" />
                                </div>
                            </div>

                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px;">End Date</label>
                                <div class="material-input outlined">
                                    <input type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" />
                                </div>
                            </div>
                            <div class="col-4">
                                <label style="color:#777777;padding-left:6px;" for="priceType">Unit Price</label>
                                <div class="material-input outlined">
                                <select name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                                    <option value="sqm">Per Square Meter</option>
                                    <option value="total">Whole Room</option>
                                </select>
                                </div>
                            </div>
                            <div class="col-4 sqm-wrapper" style="display:none;">
                                <label style="color:#777777;padding-left:6px;">Unit (m²)</label>
                                <div class="material-input outlined">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-4">
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
                    DateTimePicker.initAll(me.divModal);

                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-prm-custom', 'modal-header-custom');
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
                        name: "tenant_id",
                        data: "tenants",
                        textField: "tenant",
                        valueField: "id",
                    },
                    // {
                    //     name: "legal_name",
                    //     data: "legal_names",
                    //     textField: "legal_name",
                    //     valueField: "id",
                    // },
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
                            // console.log(33,op);
                            
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal); 
                    
                    const isReadOnly = me.dataOptions.data.code > 0;
                    me.setReadOnly(isReadOnly, ['code','space_type_id','price_type','price','sqm_size']);
                    // const price = me.divModal.querySelector(
                    //     '[data-field="price"]'
                    // );
                    // if (price) {
                    //     if (me.dataOptions && me.dataOptions.id) {
                    //         price.disabled = true;
                    //     } else {
                    //         price.disabled = false;
                    //     }
                    // }
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');
                    console.log(909,me.dataOptions);
                    
                    me.controls.space_type_id.value = me.dataOptions.data.space_type_id;
                    me.controls.code.value = me.dataOptions.data.code;
                    me.controls.price_type.value = me.dataOptions.data.price_type;
                    me.controls.price.value = me.dataOptions.data.price;
                    me.controls.sqm_size.value = me.dataOptions.data.sqm_size;

                  

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
                            // console.log(909090,op);  
                            
                            vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
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
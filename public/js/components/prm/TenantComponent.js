"use strict";
var TenantComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Tenant Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant");
    mThis.elFilter_status = mThis.self.querySelector("#el_status");

    mThis.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: " ID",
            className: "align-middle ",
            data: (data) => `<span class="text-yp-custom"><small>${data.code ?? 'N/A'}</small></span>`,
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="width:75px;"><small>${data.name ?? ''}</small></span>
                        <small class="text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "Legal Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="width:75px;"><small>${data.legal_name ?? ''}</small></span>`;
            }
        },

        // {
        //     title: "Position",
        //     className: "align-middle text-capitalize",
        //     data: (data) => `<span class="text-nowrap text-yp-custom">${data.role ?? ''}</span>`,
        // },
        {
            title: "contact Info",
            className: "align-middle",
            data: (data, index, tr) =>
                `<span class="d-block text-" style="font-size:12px;" ><i class="fa-solid text-success px-1 fa-envelope" style="font-size:11px;"></i> ${data.email ?? ""}</span>
                 <span class="d-block" style="font-size:12px;"><i class="fa-solid text-warning px-1 fa-phone" style="font-size:11px;"></i> ${data.phone_number ?? ""}</span>`,
        },
        // {
        //     title: "contact info",
        //     className: "align-middle",
        //     data: (data) => {
        //         const phone = data.phone_number || 'N/A';

        //         let telegramHTML = '<span class="text-muted">Telegram: N/A</span>';
        //         if (data.telegram_link && data.telegram_link.trim() !== '') {
        //             const url = data.telegram_link.trim();
        //             const displayText = url.replace(/^https?:\/\/t\.me\//, '');

        //             const deepLink = displayText.startsWith('+')
        //                 ? `tg://resolve?phone=${displayText.replace(/^\+/, '')}`
        //                 : `tg://resolve?domain=${displayText}`;

        //             telegramHTML = `
        //                 <a href="${url}"
        //                 onclick="event.preventDefault(); window.location='${deepLink}';"
        //                 class="text-decoration-none d-inline-flex align-items-center mt-1"
        //                 target="_blank"
        //                 title="Open in Telegram"
        //                 aria-label="Telegram">
        //                     <small><i class="fa-brands fa-telegram me-1" style="color:#229ED9;"></i></small>
        //                     <small class="text-nowrap">${displayText}</small>
        //                 </a>`;
        //         }

        //         return `
        //             <div class="d-flex flex-column">
        //                 <div><small><i class="fa-solid fa-phone me-1 text-success"></i></small><small class="text-nowrap text-yp-custom">${phone}</small></div>
        //                 <div>${telegramHTML}</div>
        //             </div>`;
        //     }
        // },
        // {
        //     title: "Zone",
        //     className: "align-middle text-capitalize",
        //     data: (data, index, tr) => {
        //         return `
        //             <div class="text-yp-custom" style="width:50px;">
        //                 <small><i class="fa-solid fa-location-dot text-primary me-2"></i></small><small class="text-wrap text-break" style ="word-break:break-word;">${data.zones ?? 'N/A'}</small>
        //             </div>
        //         `;
        //     }
        // },
        //    {
        //     title: "Floor",
        //     className: "align-middle text-capitalize",
        //     data: (data, index, tr) => {
        //         return `
        //             <div class="text-yp-custom" style="width:50px;">
        //                 <small class="text-wrap text-break" style ="word-break:break-word;">${data.floors ?? 'N/A'}</small>
        //             </div>
        //         `;
        //     }
        // },
        // {
        //     title: "Status",
        //     className: "align-middle",
        //     data: (data) => {
        //         const status = (data.status ?? '').toLowerCase();
        //         let cls = 'text-info';

        //         if (status === 'inactive') {
        //             cls = 'text-danger px-2 py-1 d-inline-block';
        //         } else if (status === 'active') {
        //             cls = 'text-success px-2 py-1 d-inline-block';
        //         }

        //         return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
        //     },
        // },
         {
            title: "Address",
            className: "align-middle text-capitalize",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <small><i class="fa-solid fa-location-dot text-primary me-2"></i></small><small class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? 'N/A'}</small>
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
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-yp-custom rounded-2 text-nowrap">
                           <span><i class="fa fa-pencil"></i></span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.AccStaffListView = new ListView('_tenant_list', {
            fetchApi: `${main_view.base_url}/prm/account-staff/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
               rowCreated:(data,index,tr)=>{
                
              
              tr.dataset.statusid = data.status_id;
              tr.classList.add('staff');
              tr.setAttribute('id',['staff_id',data.id].join('')); 

            }, 
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.AccStaffListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            AccStaffDialog.show(op);
        };


        mThis.pr_tbl = mThis.AccStaffListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblAccStaff = mThis.AccStaffListView.getTable();
        mThis.initDropdownMenus(mThis.tblAccStaff);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }, 250);
        });
     

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
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
                    html: '<span class="ps-2 " vslang="titles.Modify Tenant "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_staff"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Tenant"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_staff"
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
                    case 'edit_staff': {
                        mThis.editStaff(id, menuLink);
                        break;
                    }
                    case 'delete_staff': {
                        mThis.deleteStaff(id, menuLink);
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


    mThis.changeStatus = (id, lnk) =>{
        const tr = lnk.closest('tr');
        const status_id = VSUtil.properCase(tr?.dataset.statusid || "");
        console.log(123,status_id);
        
        const inputOptions = {
            title: 'Change Status',
            dataLabel: "Account Staff Status",
            valueMember: "status_id",
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
            vsapi.call(`${mThis.base_url}/prm/account-staff/update-status`,status).then(res=>{
                if(res.status_code ===200){
                    InputBox2.close();
                    cv_interact.success('The Account Staff Status has been updated');
                    mThis.AccStaffListView.showPage(mThis.getFilterData());

                }else{
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        });

    };
    mThis.editStaff = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }
        };
        AccStaffDialog.show(op);
    }
     mThis.deleteStaff = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Tenant??', {
            title: 'Delete Tenant',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/account-staff/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.AccStaffListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/account-staff/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'staff_status', true, 'All Statuses', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

  

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.AccStaffListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();




const AccStaffDialog = (() => {
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
                                    <select required class="data-input form-control" data-field="sex">
                                        <option value="" disabled selected>Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                    <label class="d-none">Gender</label>
                                </div>
                            </div>

                             <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="legal_name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label>Legal Name</label>
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
                    modifyTitle: "Modify Tenant Information",
                    targetProp: "acc_staff_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/account-staff/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal); 
                    console.log(12,data);
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
                            vsapi.call([main_view.base_url, "/prm/account-staff/save",].join(""), op, btn, null).then((res) => {
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

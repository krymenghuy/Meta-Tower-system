"use strict";

var SpaceComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Space Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_space_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnSpace");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_space");
    mThis.elBuilding = mThis.self.querySelector('#building_id');
    mThis.elFloor = mThis.self.querySelector('#floor_number');
    mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.elFilter_status = mThis.self.querySelector('#_space_status');
    mThis.elSearch = mThis.self.querySelector("#_search_space");
    let div = mThis.self.querySelector("#_space_list");

    // mThis.cols = [

    //         {
    //             title: "",
    //             className: "align-middle text-capitalize",
    //         },

    //         {
    //             title: "Building",
    //             className: "align-middle",
    //             data: (data,index) => `<span class="text-primary-custom">${data.building_name}</span>`,
    //         },

    //         {
    //             title: "Floor",
    //             className: "align-middle",
    //             data: (data) => {
    //                 const floor = data.floor_number ?? '';
    //                 let floorText = `${floor}th Floor`;

    //                 return `<span class="text-primary-custom">${floorText}</span>`;
    //             }
    //         },
    //         {
    //             title: "Code",
    //             className: "align-middle ",
    //             data: (data) => `<span class="text-primary-custom">${data.code}</span>`,
    //         },
    //         {
    //             title: "Space Type",
    //             className: "align-middle ",
    //             data: (data) => `<span class="text-primary-custom">${data.space_type}</span>`,
    //         },
    //         {
    //             title: "Size",
    //             className: "align-middle",
    //             data: (data) => {
    //                 return data.price_type === 'total'
    //                     ? `<span class="text-primary-custom">Whole Room</span>`
    //                     : `<span class="text-primary-custom">${data.sqm_size ?? '-'} <small class="text-danger">(sqm)</small></span>`;
    //             }
    //         },
    //         {
    //             title: "Price",
    //             className: "align-middle",
    //             data: (data) => {
    //                 const cur_symbol = data.cur_symbol ?? '$';
    //                 const formattedPrice = data.price ? Number(data.price).toLocaleString() : '-';

    //             return data.price_type === 'total'
    //                 ? `<span class="fw-semibold">${cur_symbol} ${formattedPrice} <small class="text-muted">/monthly</small></span>`
    //                 : `<span class="text-primary-custom">${cur_symbol} ${formattedPrice} <small class="text-muted">/sqm</small></span>`;
    //         }
    //     },

    //     {
    //         title: "Location",
    //         className: "align-middle text-capitalize",
    //         data: (data, index, tr) => {
    //             return `
    //                 <div class="text-yp-custom" style="width:150px;">
    //                     <small><i class="fa-solid fa-location-dot text-primary me-2"></i></small><small class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? 'N/A'}</small>
    //                 </div>
    //             `;
    //         }
    //     },

    //     {
    //         title: "Status",
    //         className: "align-middle",
    //         data: (data) => {
    //             const status = (data.status ?? '').toLowerCase();
    //             let cls = 'text-info';

    //             if (status === 'available') {
    //                 cls = 'text-success px-2 py-1 d-inline-block';
    //             } else if (status === 'unavailable') {
    //                 cls = 'text-danger px-2 py-1 d-inline-block';
    //             } else if (status === 'maintainance') {
    //                 cls = 'text-warning px-2 py-1 d-inline-block';
    //             }

    //             return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
    //         },
    //     },


    //         {
    //             title: "Updated By",
    //             className: 'align-middle',
    //             data: (data, index, tr) => {
    //                 return `<div class="d-flex flex-column">
    //                     <span class="text-capitalize text-start fw-semibold"><small>${data.update_user ?? ''}</small></span>
    //                     <small class="text-muted">${data.updated_at ?? ''}</small>
    //                 </div>`;
    //             }
    //         },
    //         {
    //             className: 'col_action align-middle',
    //             data: (data) => `
    //                 <div class="d-flex justify-content-center align-items-end">
    //                     <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_space_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
    //                     <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
    //                     </a>
    //                 </div>`
    //         },

    // ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.SpaceListView = new ListView('_space_list', {
            fetchApi: `${main_view.base_url}/prm/building-space/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
                rowCreated:(data,index,tr)=>{

            },
           processResponse: (res) => {
                return res.data;
            },
            renderItems: (data,list_container) => {
                console.log(124,data);

                mThis.renderSpaceCard(list_container, data);

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SpaceListView.showPage(mThis.getFilterData());
                }
            };
            BuildingSpaceDialog.show(op);
        };


        mThis.pr_tbl = mThis.SpaceListView.getListContainer();
        mThis.setAction(div);

        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 330) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 330) + 'px';
        }
        mThis.tblBuildingSpace = mThis.SpaceListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuildingSpace);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };


    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            building_id: mThis.elBuilding.value,
            status_id: mThis.elFloor.value,
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
            actionButtonClass: "btn_space_action",
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

                    html: '<span class="ps-2 " vslang="titles.Modify Space "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_space"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Space"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_space"
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menulink, id, name) => {
                switch (name) {
                    case 'change_status': {
                        mThis.changeStatus(id, menulink);
                        break;
                    }

                    case 'edit_space': {
                        mThis.editSpace(id, menulink);
                        break;
                    }
                    case 'delete_space': {
                        mThis.deleteSpace(id, menulink);
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
     mThis.renderSpaceCard = (div,data) => {
        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }

        AuthManager.init().then(user => {
           mThis.renderSpace(data,user)
        });
    }
    mThis.renderSpace = (data) => {
        let html = `<div class="row g-4">`;
        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                console.log(222,d);
                
                // ===== STATUS DEFAULT (Available) =====
                let statusColor = 'bg-success';
                let statusText = 'Available';
                let btnClass = 'btn-outline-success rounded-2 btn-create-contract';
                let icon = '<i class="fa-solid fa-file-contract"></i>';
                let btnText = 'Create Contract';
                let progressWidth = '0%';

                const statusId = d.status_id ?? 1;

                // ===== STATUS MAPPING =====
                if (statusId === 2) { // Maintenance
                    statusColor = 'bg-danger';
                    statusText = 'Maintenance';
                    btnClass = 'btn-outline-danger rounded-2 btn-view-ticket';
                    icon = '<i class="fa-solid fa-eye"></i>';
                    btnText = 'View Tickets';
                    progressWidth = d.occupancy_percent ? d.occupancy_percent + '%' : '50%';

                } else if (statusId === 3) { // Occupied
                    statusColor = 'bg-primary';
                    statusText = 'Occupied';
                    btnClass = 'btn-outline-primary rounded-2 btn-manage-space';
                    icon = '<i class="fa-solid fa-screwdriver-wrench"></i>';
                    btnText = 'Manage Space';
                    progressWidth = '100%';
                }

                // ===== PRICE & SIZE =====
                const sizeLabel = d.price_type === 'total'
                    ? 'Whole Room'
                    : `${d.sqm_size ?? '-'} sqm`;

                const priceLabel = d.price_type === 'total'
                    ? `${d.cur_symbol || '$'} ${Number(d.price || 0).toLocaleString()} /month`
                    : `${d.cur_symbol || '$'} ${Number(d.price || 0).toLocaleString()} /sqm`;

                html += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="unit-card position-relative overflow-hidden group h-100">
                        <div class="p-4 d-flex flex-column gap-3">

                            <!-- Header -->
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="unit-name mb-1 text-truncate">
                                        ${d.building_name ?? 'Building'} - ${d.code ?? 'Unit'}
                                    </h5>
                                    <p class="unit-floor text-muted small mb-0">
                                        Floor ${d.floor_number ?? '-'} • ${d.wing ?? 'West Wing'}
                                    </p>
                                </div>
                                <span><a href="javascript:void(0)" class="${d.action_id > 1 ? 'd-none' : 'btn_space_action'}" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                </a></span>
                                <!-- <span class="unit-status-indicator ${statusColor}"></span> -->
                            </div>

                            <!-- Info -->
                            <div class="d-flex justify-content-between text-muted small">
                                <div class="d-flex align-items-center gap-1">
                                    <i class="fa-solid fa-ruler-combined"></i>
                                    <span>${sizeLabel}</span>
                                </div>
                                <div class="d-flex align-items-center gap-1">
                                    <i class="fa-regular fa-building"></i>
                                    <span>${d.space_type ?? 'Residential'}</span>
                                </div>
                            </div>

                            <!-- Occupancy -->
                            <div>
                                <div class="d-flex justify-content-between small fw-bold text-muted text-uppercase">
                                    <span>Status</span>
                                    <span class="${
                                        statusId === 1 ? 'text-success' :
                                        statusId === 2 ? 'text-danger' :
                                        'text-primary'
                                    }">${statusText}</span>
                                </div>
                                <div class="progress mt-1" style="height:6px;">
                                    <div class="progress-bar ${statusColor}" style="width:${progressWidth};"></div>
                                </div>
                            </div>

                            <!-- Price & Action -->
                            <div class="mt-auto">
                                <div class="text-muted small mb-2">Price: ${priceLabel}</div>
                                <button class="btn ${btnClass} btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                                    data-id="${d.id}" data-statusid="${statusId}">
                                    <span>${icon}</span>
                                    ${btnText}
                                </button>
                                <div class="d-flex justify-content-between text-muted small">
                                    <div class="d-flex align-items-center gap-1">
                                        <div class="text-muted mt-2">Create By :</i> ${d.update_user ?? 'System'}</div>
                                    </div>
                                    <div class="d-flex align-items-center gap-1">
                                        <div class="text-muted mt-2"><i class="fa-regular fa-clock"></i> <span>${d.updated_at ?? ''}</span></div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        

                        <input type="checkbox"
                            class="unit-checkbox position-absolute top-2 end-2 opacity-0 group-hover:opacity-100 rounded">
                    </div>
                </div>
                `;
                cmt++;
            });
        }

        // ===== NO DATA =====
        if (cmt === 0) {
            html += `
            <div class="col-12">
                <div class="bg-white rounded-3 p-4 text-center">
                    <h5 class="text-muted m-0">No Units Available</h5>
                </div>
            </div>`;
        }

        html += `</div>`;
        div.innerHTML = html;
    };



    mThis.editSpace = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };

        BuildingSpaceDialog.show(op);
    }
     mThis.deleteSpace = (id, menulink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Space??', {
            title: 'Delete Space',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/building-space/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.SpaceListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }
    mThis.changeStatus = (id, menulink) =>{

        const status_id = menulink.dataset.statusid;
        console.log(123,status_id);

        const inputOptions = {
            title: 'Change Status',
            dataLabel: "Space Status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data:[
                {status_id:"1",name:"Available"},
                {status_id:"2",name:"Maintenance"},
                {status_id:"3",name:"Occupied"},
            ],
            defaultValue: status_id
        };
        InputBox2.show(inputOptions,(selected)=>{
            if(!selected) return;
            if(!AuthManager.allowed(321)) return;

            const payload = {id, status_id :selected.value};
            vsapi.call(`${mThis.base_url}/prm/building-space/update-status`,payload).then(res=>{
                if(res.status_code ===200){
                    InputBox2.close();
                    cv_interact.success('Building Space Status has been updated');
                    mThis.SpaceListView.showPage(mThis.getFilterData());

                }else{
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        });

    };  
    mThis.setAction = (tbl)=>{
        tbl.addEventListener('click',(e) =>{
        let btn = VSUtil.closestLimited(e.target,'.btn-create-contract');
        if(btn){
           e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SpaceListView.showPage(mThis.getFilterData());
                }
            };
            ContractDialog.show(op);
        }
        })
    }


    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/building-space/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'space_status', true, 'All Statuses', null);
                VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', '','All Building', null);
                VSUtil.setComboItems(mThis.elFloor, d.floors, 'id', 'floor_number', '','All Floor', null);
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', true, 'All Space Type', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.SpaceListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const BuildingSpaceDialog = (() => {
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
                                <label style="color:#777777;padding-left:6px;" for="building">Building</label>
                                <div class="material-input outlined">
                                    <select name="building_id" class="data-input form-control" data-field="building_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="number" name="floor_number" class="data-input form-control" data-field="floor_number" placeholder=" " />
                                    <label>Floor Number</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;" for="spaceType"> Select Space Type</label>
                                <div class="material-input outlined">
                                    <select   name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                                    </select>

                                </div>
                            </div>
                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;" for="spaceType"> Select Price Type</label>
                                <div class="material-input outlined">
                                    <select   name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                                        <option value="sqm">Per Sqaure Meter</option>
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
                                    <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                    <label>Location</label>
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


                 me.controls.price_type.onchange = (e) => {
                        const sqmWrapper = me.controls.sqm_size.closest('.sqm-wrapper');
                        if (!sqmWrapper) return;
                        sqmWrapper.style.display = e.target.value === 'sqm' ? '' : 'none';
                    };

                },
                configSelect: [
                    {
                        name: "building_id",
                        data: "buildings",
                        textField: "building",
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
                    createTitle: "Create New Space",
                    modifyTitle: "Modify Space ",
                    targetProp: "space_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/building-space/form-options",].join(""),
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
                            console.log(9090,op);

                            vsapi.call([main_view.base_url, "/prm/building-space/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Space has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New space has been added successfully"
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


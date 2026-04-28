"use strict";
var BuildingComponent = ( () => {
    const mThis = {};
    mThis.title_prop = "Buildings";

    mThis.self = main_view.VSAppContent.querySelector("#_main_building_component");
    mThis.btnAddBuilding = mThis.self.querySelector("#_btnAddBuilding");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_building");
    mThis.elSearch = mThis.self.querySelector("#_search_building");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-row align-items-center">
                    <!-- <img class="btn-view-member-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/meta/building-default.jfif`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px; object-fit: cover;"/> -->

                  <div class="d-flex flex-column">
                    <span class="text-prm-custom d-inline-block" style="min-width:150px; ">
                        ${data.name ?? ''}
                    </span>
                    <small class="text-muted text-break" style="max-width:250px;">
                        ${data.address ?? ''}
                    </small>
                  </div>
                </div>
            `,
        },
        {
            title: "Total Areas",
            className: "align-middle",
            data: (data) => {
                let area = data.total_area ?? '';
                return `<span class="text-primary-custom">${area}${area ? ' (sqm)' : ''}</span>`;
            },
        },
        {
            title: "Total Floors",
            className: "align-middle",
            data: (data) => `
                <span class="text-primary-custom">${data.total_floor ?? '0'}</span>
            `,
        },
        {
            title: "Total Spaces",
            className: "align-middle",
            data: (data) => `<span class="text-primary-custom">${data.total_space ?? '0'}</span>`,
        },
        // {
        //     title: "Occupancy",
        //     className: "align-middle",
        //     data: (data) => {
        //         let occ = data.occupancy ?? 75;
        //         let space = data.total_space ?? 100;
        //         let percent = space > 0 ? Math.round((occ / space) * 100) : 0;

        //         return `
        //             <div class="d-flex align-items-center gap-2">
        //                 <div class="progress" style="width:120px; height:8px;">
        //                     <div class="progress-bar bg-primary" role="progressbar"
        //                         style="width: ${percent}%;"
        //                         aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
        //                     </div>
        //                 </div>
        //                 <span class="fw-semibold text-dark">${percent}%</span>
        //             </div>
        //         `;
        //     }
        // },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-prm-custom">${data.update_user ?? ''}</span>
                    <span class="text-muted small">${data.updated_at ?? ''}</span>
                </div>
            `,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <a href="javascript:void(0)"
                       class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}"
                       data-id="${data.id}"
                       data-statusid="${data.status_id}">
                       <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>
            `,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BuildingListView = new ListView('_building_list', {
            fetchApi: `${main_view.base_url}/prm/building/list-paginate`,
            perPage: 7,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated:(data,index,tr)=>{
                tr.dataset.statusid = data.status_id;
                tr.dataset.totalfloor = data.total_floor ?? 0;
                tr.classList.add('building');
                tr.setAttribute('id',['building_id',data.id].join(''));
            },
            listContainerClass: null
        });

        mThis.btnAddBuilding.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BuildingListView.showPage(mThis.getFilterData());
                    mThis.fetchSummaryData();
                }
            };
            BuildingDialog.show(op);
        };

        mThis.pr_tbl = mThis.BuildingListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblBuilding = mThis.BuildingListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuilding);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BuildingListView.showPage(mThis.getFilterData());
            }
        });
        mThis.cfg = new ExpandableRowConfig(mThis.tblBuilding.getAttribute('id'), {
            dontExpandByClickingOn: ['btn_leave_action'],
            // showExpandSignal: false,
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.dataset.id;
                const totalFloor = parseInt(parent_tr.dataset.totalfloor || '0', 10);
                if (id > 0) {
                    mThis.displayFloorNumber(container, id, totalFloor);
                }
            }
        });
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.displayFloorNumber = (container, id, totalFloor = 0) => {
        let html = '';
        container.innerHTML = '';
        console.log(444,id);

        vsapi.call(`${main_view.base_url}/prm/building/list-floor`,{
                id: id
        },null).then(res => {
            const data = res.status_code === 200 ? res.data : [];
            console.log(444,data);
            const maxFloorNo = (data || []).reduce((max, level) => {
                const floorNo = parseInt(level.floor_no || '0', 10);
                return floorNo > max ? floorNo : max;
            }, 0);
            const canAddFloor = (parseInt(totalFloor || '0', 10) > 0) && (maxFloorNo < parseInt(totalFloor || '0', 10));

            html = `${canAddFloor ? `<div class="rounded-3 p-2 bg-danger-subtle mb-2">
                <button data-buildingid="${id}" class="btn-add-floor btnAddNewPrm" type="button">
                    <span class="">${LocaleManager.trans('New Floor','buttons')}</span>
                </button>
            </div>` : ''}
            <table class="table table-sm table-hover align-middle tbl_list_floor">
            <thead class="table-light text-nowrap">
                <tr>
                    <th>${LocaleManager.trans('Name')}</th>
                    <th>${LocaleManager.trans('Floor Number')}</th>
                    <th>${LocaleManager.trans('Total Space')}</th>
                    <th>${LocaleManager.trans('Description')}</th>
                    <th>${LocaleManager.trans('Last Updated')}</th>
                    <th>${LocaleManager.trans('Action')}</th>
                </tr>
            </thead>
            <tbody></tbody>`;

            html = html+`</table>`;
            container.innerHTML =  html;

            const tbody = container.querySelector('table.tbl_list_floor > tbody');
            const btnNewFloor = container.querySelector('.btn-add-floor');

            if (btnNewFloor) {
                btnNewFloor.addEventListener('click',e => {
                    e.preventDefault();
                    let building_id = btnNewFloor.dataset.buildingid;
                    let op = {
                        id: null,
                        building_id: building_id,
                        onClose: (success) => {
                            if (!success) return;
                            mThis.displayFloorNumber(container, btnNewFloor.dataset.buildingid, totalFloor);
                        }
                    };

                    // if(!AuthManager.allowed(264)) return;
                    CreateFloorDialog.show(op);
                });
            }

            mThis.renderFloorList(tbody, data, id);

            tbody.addEventListener('click', (e) => {
                const btnEdit = e.target.closest('.btn-edit-floor');
                const btnDelete = e.target.closest('.btn-delete-floor');
                if (btnEdit) {
                    e.preventDefault();
                    mThis.editFloor({
                        id: btnEdit.dataset.id,
                        building_id: btnEdit.dataset.buildingid
                    }, () => {
                        mThis.displayFloorNumber(container, id, totalFloor);
                    });
                    return;
                }
                if (btnDelete) {
                    e.preventDefault();
                    mThis.deleteFloor({
                        id: btnDelete.dataset.id,
                        building_id: btnDelete.dataset.buildingid
                    }, () => {
                        mThis.displayFloorNumber(container, id, totalFloor);
                    });
                }
            });
        });
    }
    mThis.renderFloorList = (tbody, data, buildingId) => {
        let html = '';
        if(!data) data = [];

        (data || []).map(level => {
            let shortcut = level.floor_name ? `(${level.floor_name ?? ''})` : '';
            html = [html,`<tr>
                <td>
                    <span class="d-block">${level.floor_name ?? ''}</span>
                    <span class="d-block text-muted">
                        <small>${shortcut ?? ''}</small>
                    </span>
                </td>
                <td>${level.floor_no ?? ''}</td>
                <td>${level.total_space ?? ''}</td>
                <td>${level.description ?? ''}</td>
                <td>
                    <span class="d-block">${level.update_user ?? ''}</span>
                    <span>
                        <small>${level.updated_at ?? ''}</small>
                    </span>
                </td>
                <td class="text-nowrap">
                    <a href="javascript:void(0)" class="btn-edit-floor me-2 text-warning"
                       data-id="${level.id}" data-floorid="${level.floor_id}" data-buildingid="${buildingId}">
                        <i class="fa-regular fa-edit fs-6"></i>
                    </a>
                    <a href="javascript:void(0)" class="btn-delete-floor text-danger"
                       data-id="${level.id}" data-floorid="${level.floor_id}" data-buildingid="${buildingId}">
                        <i class="fa-regular fa-trash-can fs-6"></i>
                    </a>
                </td>
            </tr>`].join('');
        });
        tbody.innerHTML = html;

    }

    mThis.editFloor = (op, onDone) => {
        CreateFloorDialog.show({
            id: parseInt(op.id || 0, 10),
            building_id: parseInt(op.building_id || 0, 10),
            onClose: (success) => {
                if (success && typeof onDone === 'function') onDone();
            }
        });
    };

    mThis.deleteFloor = (op, onDone) => {
        cv_interact.confirm('Delete this Floor?', {
            title: 'Delete Floor',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (isConfirm) {
            if (!isConfirm) return;
            vsapi.call(`${main_view.base_url}/prm/building/delete-floor`, op, false, false, false).then(res => {
                if (res.status_code === 200) {
                    cv_interact.success("Floor has been deleted successfully.");
                    if (typeof onDone === 'function') onDone();
                } else {
                    cv_interact.error(res.error_message || 'Delete failed');
                }
            });
        });
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
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_building"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_building"
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'edit_building': {
                        mThis.editBuilding(id, menuLink);
                        break;
                    }
                    case 'delete_building': {
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

    mThis.editBuilding = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{
                mThis.BuildingListView.showPage(mThis.getFilterData());
                mThis.fetchSummaryData();
            }
        };
        BuildingDialog.show(op);
    }

    mThis.deleteBuilding = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
                mThis.fetchSummaryData();
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Building?', {
            title: 'Delete Building',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/building/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.BuildingListView.showPage();
                        mThis.fetchSummaryData();
                    } else {
                        cv_interact.error(res.error_message || 'Delete failed');
                    }
                })
            }
        });
    }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/building/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                if (typeof onFinish === 'function') onFinish();
            })
    };

    mThis.show = (options) => {
        mThis.init();
        if(!options) options = {};
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self,mThis.title_prop);
            mThis.BuildingListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const BuildingDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row justify-content-center">
                        <div class="col-12">
                            <div class="material-input outlined">
                                <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                <label style="color:#777777;padding-left:6px;">Building Name</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="material-input outlined">
                                <input type="text" name="total_floor" required class="data-input form-control" data-field="total_floor" placeholder=" " />
                                <label style="color:#777777;padding-left:6px;">Total Floors</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="material-input outlined">
                                <input type="number" name="total_area" required class="data-input form-control" data-field="total_area" placeholder=" " />
                                <label style="color:#777777;padding-left:6px;">Total Areas</label>
                            </div>
                        </div>
                       
                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea type="number" name="address" class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                <label style="color:#777777;padding-left:6px;">Address</label>
                            </div>
                        </div>
                    </div>`
                ].join("");
            },
            contentCreated: (me) => {
                header.innerHTML = '';
                header.appendChild(headerWrapper);
            },
            prepareFormOptions: {
                createTitle: "Create Building",
                modifyTitle: "Modify Building",
                targetProp: "building_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/building/form-options",].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },
            onShow: (me) => {
                const title = me.divModal.querySelector('.modal-title');
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h4 class="text-prm-custom text-start fw-bold">Modify Building</h4>'
                        : '<h4 class="text-prm-custom text-start fw-bold">Create Building</h4>';
                }
            },
            onPrepareForm: (me, data) => {
               const isReadOnly = me.dataOptions.id > 0;
               me.setReadOnly(isReadOnly, ["total_floor"]);

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
                        vsapi.call([main_view.base_url, "/prm/building/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Building has been updated successfully");
                                } else {
                                    cv_interact.success("New building has been added successfully.");
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
const CreateFloorDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div class="row justify-content-center">
                    <div class="col-6">
                        <div class="material-input outlined">
                            <input type="number" name="floor_number" required class="data-input form-control" data-field="floor_number" placeholder=" " />
                            <label style="color:#777777;padding-left:6px;">Floor Number</label>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="material-input outlined">
                            <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                            <label style="color:#777777;padding-left:6px;">Floor Name</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="material-input outlined">
                            <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                            <label style="color:#777777;padding-left:6px;">Description</label>
                        </div>
                    </div>
                </div>
            `,
            contentCreated: (me) => {
            },
            prepareFormOptions: {
                createTitle: "Create Floor",
                modifyTitle: "Add Floor",
                targetProp: "floor_details",
                api: {
                    endpoint: main_view.base_url + "/prm/building/form-options",
                    params: (op) => ({ id: op.id, building_id: op.building_id }),
                },
            },
            onShow: (me) => {
                const title = me.divModal.querySelector('.modal-title');
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h4 class="text-prm-custom text-start fw-bold">Modify Floor</h4>'
                        : '<h4 class="text-prm-custom text-start fw-bold">New Floor</h4>';
                }
            },
           onPrepareForm: (me) => {
                const floorNumber = me.divModal.querySelector('[data-field="floor_number"]');
                const floorName = me.divModal.querySelector('[data-field="name"]');
                const isCreate = !(me.dataOptions?.id > 0);

                if (floorNumber && floorName) {
                    if (isCreate) {
                        floorNumber.setAttribute('disabled', 'disabled');
                        floorName.setAttribute('disabled', 'disabled');
                    } else {
                        floorNumber.removeAttribute('disabled');
                        floorName.removeAttribute('disabled');
                    }

                    floorNumber.addEventListener('input', function () {
                        const num = this.value;
                        floorName.value = num ? `Floor ${num}` : '';
                    });
                }
            },
            buttons: [
                {
                    label: 'Cancel',
                    cssClass: 'btn btn-secondary',
                    click: (me) => me.hide(false),
                },
                {
                    label: 'Save',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const op = me.getData();
                        op.building_id = me.dataOptions.building_id;
                        op.id = me.dataOptions?.id || 0;
                        console.log(444,op);

                        vsapi.call(main_view.base_url + "/prm/building/add-floor", op, btn)
                        .then((res) => {
                            if (res.status_code === 200) {
                                if (typeof me.dataOptions?.onClose === 'function') {
                                    me.dataOptions.onClose(true, res.data);
                                }
                                me.hide(true, op);
                                const msg = op.id > 0 ? "Floor has been updated successfully" : "New floor has been added successfully";
                                cv_interact.success(msg);
                            } else {
                                cv_interact.error(res.error_message || "Failed to save floor");
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


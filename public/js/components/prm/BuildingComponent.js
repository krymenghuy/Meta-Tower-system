"use strict";
var BuildingComponent = ( () => {
    const mThis = {};
    mThis.title_prop = "Buildings";

    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_building_component");
    mThis.btnAddBuilding = mThis.self.querySelector("#_btnAddBuilding");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_building");
    mThis.elSearch = mThis.self.querySelector("#_search_building");
    mThis.divSummaryCards = mThis.self.querySelector("#_summary_cards"); 

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Building",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-row align-items-center">
                    <img class="btn-view-member-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/meta/building_img.jpg`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px; object-fit: cover;"/>
                  
                  <div class="d-flex flex-column">  
                    <span class="text-primary-custom fw-semibold d-inline-block" style="min-width:150px; ">
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
            title: "Total Area",
            className: "align-middle",
            data: (data) => {
                let area = data.total_area ?? '';
                return `<span class="text-primary-custom">${area}${area ? ' sqm' : ''}</span>`;
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
            title: "Total Space",
            className: "align-middle",
            data: (data) => `<span class="text-primary-custom">${data.total_space ?? '0'}</span>`,
        },
        {
            title: "Occupancy",
            className: "align-middle",
            data: (data) => {
                let occ = data.occupancy ?? 75;
                let space = data.total_space ?? 100;
                let percent = space > 0 ? Math.round((occ / space) * 100) : 0;

                return `
                    <div class="d-flex align-items-center gap-2">
                        <div class="progress" style="width:120px; height:8px;">
                            <div class="progress-bar bg-primary" role="progressbar" 
                                style="width: ${percent}%;" 
                                aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span class="fw-semibold text-dark">${percent}%</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-primary-custom fw-semibold">${data.update_user ?? ''}</span>
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
                       <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
                    </a>
                </div>
            `,
        },
    ];

    
    mThis.renderSummaryCards = (summaryData) => {
        if (!mThis.divSummaryCards) return;

        const cards = [
            {
                title: "TOTAL MANAGED AREA",
                value: summaryData.total_area || "4,900",
                unit: "sqm",
                change: summaryData.area_change || "+12%",
                changePositive: true,
                subtitle: "Square meters total"
            },
            {
                title: "ACTIVE TENANTS",
                value: summaryData.active_tenants || "248",
                unit: "",
                change: summaryData.tenants_change || "+5.4%",
                changePositive: true,
                subtitle: "Across all properties"
            },
            {
                title: "AVG. OCCUPANCY",
                value: summaryData.avg_occupancy || "68",
                unit: "%",
                change: summaryData.occupancy_change || "-21%",
                changePositive: false,
                subtitle: "Global average"
            },
            {
                title: "REVENUE MTD",
                value: summaryData.revenue_mtd || "$142k",
                unit: "",
                change: summaryData.revenue_change || "+18%",
                changePositive: true,
                subtitle: "Month to date"
            }
        ];

        const cardsHTML = cards.map(card => `
            <div class="col-12 col-sm-6 col-md-2">
                <div class="card border-0 h-100">
                    <div class="card-body border border-gray rounded-3">
                        <p class="text-muted text-uppercase small mb-2" style="font-size: 0.75rem; font-weight: 600;">
                            ${card.title}
                        </p>
                        <div class="d-flex align-items-end justify-content-between">
                            <div>
                                <h3 class="mb-0 fw-bold">
                                    ${card.value}<span class="fs-5">${card.unit}</span>
                                </h3>
                                <p class="text-muted small mb-0 mt-1" style="font-size: 0.8rem;">
                                    ${card.subtitle}
                                </p>
                            </div>
                            <div>
                                <span class="badge ${card.changePositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} fw-semibold">
                                    ${card.change}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        mThis.divSummaryCards.innerHTML = `
            <div class="row g-3 mb-4 d-none">
                ${cardsHTML}
            </div>
        `;
    };

    
    mThis.fetchSummaryData = () => {
        vsapi.call(`${main_view.base_url}/prm/building/summary`, null, null, null)
            .then(res => {
                if (res.status_code == 200) {
                    mThis.renderSummaryCards(res.data);
                }
            })
            .catch(err => {
                
                mThis.renderSummaryCards({});
            });
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BuildingListView = new ListView('_building_list', {
            fetchApi: `${main_view.base_url}/prm/building/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
                tr.dataset.statusid = data.status_id;
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
                if (id > 0) {
                    mThis.displayFloorNumber(container,id);
                }
            }
        });

        // {

        //     dontExpandByClickingOn:['btn_leave_action'],
        //     onOpen:(container,detail_tr,parent_tr) => {
        //         const id = parent_tr.dataset.id;
        //         if(id > 0) mThis.displayFloorNumber(container,id);
        //     }
        // });
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.displayFloorNumber = (container, id) => {
        let html = null;
        container.innerHTML = '';
        console.log(444,id);

        vsapi.call(`${main_view.base_url}/prm/building/list-floor`,{
                id: id
        },null).then(res => {
            const data = res.status_code === 200 ? res.data : [];
            console.log(444,data);
            
            html = `<div class="d-none rounded-3 p-2 bg-white">
                <button data-id="${id}" class="btn-add-floor btnAddNewPrm" type="button">
                    <span class="">${LocaleManager.trans('Add Floor','buttons')}</span>
                </button>
            </div>
            <div class="table-responsive p-1">
            <table class="table table-sm table-hover align-middle tbl_list_floor">
            <thead class="table-light text-nowrap">
                <tr>
                    <th>${LocaleManager.trans('Name')}</th>
                    <th>${LocaleManager.trans('Floor Number')}</th>
                    <th>${LocaleManager.trans('Total Space')}</th>
                    <th>${LocaleManager.trans('Description')}</th>
                    <th>${LocaleManager.trans('Last Updated')}</th>
                    <!-- <th>${LocaleManager.trans('Action')}</th> -->
                </tr>
            </thead>
            <tbody></tbody>`;

            html = html+`</table></div>`;
            container.innerHTML =  html;

            const tbody = container.querySelector('table.tbl_list_floor > tbody');
            const btnNewFloor = container.querySelector('.btn-add-floor');

            btnNewFloor.addEventListener('click',e => {
                e.preventDefault();
                let id = btnNewFloor.dataset.id;
                let op = {
                    id: null,
                    id: id,
                    onClose: (me,d,cancel) => {
                        mThis.renderLevelList(tbody,d.levels);
                    }
                };

                // if(!AuthManager.allowed(264)) return;
                alert('soon');
                floorDialog.show(op);
            });

            mThis.renderLevelList(tbody, data);
        });
    }
    mThis.renderLevelList = (tbody, data) => {
        let html = null;
        if(!data) data = [];
        
        (data || []).map(level => {
        console.log(66,level);

            let shortcut = level.name ? `(${level.name ?? ''})` : '';
            html = [html,`<tr>
                <td>
                    <span class="fw-semibold d-block">${level.name ?? ''}</span>
                    <span class="d-block text-muted">
                        <small>${shortcut ?? ''}</small>
                    </span>
                </td>
                <td>${level.floor_no ?? ''}</td>
                <td>${level.total_space ?? ''}</td>
                <td>${level.description ?? ''}</td>
                <td>
                    <span class="d-block p-1 fw-semibold">${level.update_user ?? ''}</span>
                    <span>
                        <small>${level.updated_at ?? ''}</small>
                    </span>
                </td>
                <!-- <td>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-level-modify" data-buildingid ="${level.id}" data-id="${level.id}">
                           <span class="tool-tip">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                            <span class="tool-tiptext fs-6">Modify</span>
                           </span>
                        </a>
                        <a href="javascript:void(0)" class="btn-level-delete" data-programid ="${level.id}" data-id="${level.id}">
                           <span class="tool-tip">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                            <span class="tool-tiptext fs-6">Delete</span>
                           </span>
                        </a>
                    </div>
                </td> -->
            </tr>`].join('');
        });
        tbody.innerHTML = html;
        //mThis.makeSortable(tbody);
        // mThis.setActionHandlers(tbody);

    }
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
                    html: '<span class="ps-2 " vslang="titles.Edit Building"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_building"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Building"></span>',
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
            mThis.fetchSummaryData();
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
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row justify-content-center">
                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Building Name</label>
                            <div class="material-input outlined">
                                <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                
                            </div>
                        </div>                   
                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Total Floor</label>
                            <div class="material-input outlined">
                                <input type="text" name="total_floor" required class="data-input form-control" data-field="total_floor" placeholder=" " />
                               
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Total Area</label>
                            <div class="material-input outlined">
                                <input type="number" name="total_area" required class="data-input form-control" data-field="total_area" placeholder=" " />
                                
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="color:#777777;padding-left:6px;">Total Space</label>
                            <div class="material-input outlined">
                                <input type="number" name="total_space" required class="data-input form-control" data-field="total_space" placeholder=" " />
                                
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Address</label>
                            <div class="material-input outlined">
                                <textarea type="number" name="address" class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                
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
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);

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
            onPrepareForm: (me, data) => {
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
                        vsapi.call([main_view.base_url, "/prm/building/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Building has been updated successfully");
                                } else {
                                    cv_interact.success("New building has been added successfully");
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
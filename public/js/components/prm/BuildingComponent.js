"use strict";
var BuildingComponent = ( () => {
    const mThis = {};
    mThis.title_prop = "Buildings";

    mThis.base_url = main_view.base_url;
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
        title: "Building",
        className: "align-middle",
        data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-primary-custom fw-semibold d-inline-block" style="min-width:150px;">
                    ${data.name ?? ''}
                </span>
                <small class="text-muted text-break" style="max-width:250px;">
                    ${data.address ?? ''}
                </small>
            </div>
        `,
    },
    {
        title: "Total Area",
        className: "align-middle",
        data: (data) => {
            let area = data.total_area ?? '';
            return `<span class="text-yp-custom">${area}${area ? ' sqm' : ''}</span>`;
        },
    },

    {
        title: "Total Floors",
        className: "align-middle",
        data: (data) => `
            <span class="text-primary-custom">${data.total_floor ?? 'N/A'}</span>
        `,
    },
   
    {
        title: "Total Space",
        className: "align-middle",
        data: (data) => `<span class="text-yp-custom">${data.total_space ?? ''}</span>`,
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
                <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>
        `,
    },
    {
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



    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BuildingListView = new ListView('_building_list', {
            fetchApi: `${main_view.base_url}/prm/building/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
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
                }
            };
            BuildingDialog.show(op);
        };


        mThis.pr_tbl = mThis.BuildingListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
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

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
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
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
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
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

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
            onClose:()=>{;
                mThis.BuildingListView.showPage(mThis.getFilterData());
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
                    }else {
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
        mThis.options = options;
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
                                    <label>Building Name</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="total_floor" required class="data-input form-control" data-field="total_floor" placeholder=" " />
                                    <label>Total Floor</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="number" name="total_area" required class="data-input form-control" data-field="total_area" placeholder=" " />
                                    <label>Total Area</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="number" name="total_space" required class="data-input form-control" data-field="total_space" placeholder=" " />
                                    <label>Total Space</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea type="number" name="address" class="data-input form-control" data-field="address" placeholder=" "></textarea>
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
                    //LocaleManager.translateZone(me.divModal); //Translation is automatic!
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
                                        cv_interact.success(
                                            "Building has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New building has been added successfully"
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

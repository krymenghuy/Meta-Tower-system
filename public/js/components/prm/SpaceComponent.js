"use strict";

var SpaceComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Space Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_space_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnSpace");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_space");
    mThis.elBuilding = mThis.self.querySelector('#building_id');
    mThis.elFloor = mThis.self.querySelector('#floor_id');
    mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.elFilter_status = mThis.self.querySelector('#_space_status');
    mThis.elSearch = mThis.self.querySelector("#_search_space");
    let div = mThis.self.querySelector("#_space_list");
    mThis.paginationContainer = mThis.self.querySelector("#space_container_pagination");

    mThis.divSummary = mThis.self.querySelector('#_space_div_summary');



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
            perPage: 8,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
            },
            processResponse: (res) => {
                return res.data;
            },
            renderItems: (data, list_container) => {
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
        // mThis.elBuilding.addEventListener('change',(e)=>{
        //     e.preventDefault();
        //     mThis.SpaceListView.showPage(mThis.getFilterData());

        //     const p = {
        //         building_id: e.target.value
        //     }
        //     console.log(5555,p);

        //     vsapi.call([main_view.base_url, '/prm/settings/options-floors'].join(''), p, null, false).then((res) => {
        //         const data = res.status_code == 200 ? res.data : [];
        //         VSUtil.setComboItems(mThis.elFloor, data, 'id', 'name', '',"All Floor", null);
        //     });
        // });

        mThis.pr_tbl = mThis.SpaceListView.getListContainer();
        mThis.setAction(div);

        const sh_parent = mThis.pr_tbl.parentElement;
        // sh_parent.style.maxHeight = (window.innerHeight - 320) + 'px';
        // sh_parent.classList.add("overflow-y-auto");
        // // sh_parent.classList.add("overflow-x-hidden");
        // window.onresize = () => {
        //     sh_parent.style.maxHeight = (window.innerHeight - 320) + 'px';
        // }
        mThis.tblBuildingSpace = mThis.SpaceListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuildingSpace);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => {
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
    mThis.setDataSummary = () => {

        const s = {
            total_units: 10,
            occupancy: 92.4,
            available: 3,
            pending: 3
        };

        let html = `<div class="row g-2">`;

        html += `<div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid #5867dd;">
                    <div class="metric-head-sm">
                        <span class="metric-dot bg-primary"></span>
                        <span>Total Units</span>
                    </div>
                    <div class="metric-value-sm">${s.total_units}</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid #0abb87;">
                    <div class="metric-head-sm">
                        <span class="metric-dot bg-success"></span>
                        <span>Occupancy</span>
                    </div>
                    <div class="metric-value-sm">${s.occupancy}%</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid #fd397a;">
                    <div class="metric-head-sm">
                        <span class="metric-dot bg-danger"></span>
                        <span>Available</span>
                    </div>
                    <div class="metric-value-sm">${s.available}</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid #ffb822;">
                    <div class="metric-head-sm">
                        <span class="metric-dot bg-warning"></span>
                        <span>Pending</span>
                    </div>
                    <div class="metric-value-sm">${s.pending}</div>
                </div>
            </div>`;

        html += `</div>`;
        mThis.divSummary.innerHTML = html;
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            status_id: mThis.elFilter_status.value,
            building_id: mThis.elBuilding.value,
            floor_id: mThis.elFloor.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        // console.log(6767,p);


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
                    html: '<span class="ps-2  " vslang="titles.Create Booking">Create Booking</span>',
                    icon: `<i class="fa-regular fa-calendar-plus fs-5 text-info-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_booking"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Create Contract">Create Contract</span>',
                    icon: `<i class="fa-regular fa-file-lines fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Set Maintenance">Set Maintenance</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5 text-warning-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_maintenance"
                },
                  {
                    html: '<span class="ps-2  " vslang="titles.Finish Maintenance">Finish Maintenance</span>',
                    icon: `<i class="fa-solid fa-hourglass-end fs-5 text-success-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "finish_maintenance"
                },
                {

                    html: '<span class="ps-2 " vslang="titles.Modify Space"></span>',
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

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                const status_id = Number(container.dataset.statusid);
                const maintenance_status_id = Number(container.dataset.maintenanceStatusid);
                const isMaintenance = maintenance_status_id === 1;
                menu.create_booking.style.display = (!isMaintenance && status_id === 1) ? 'block' : 'none';
                menu.create_contract.style.display = (!isMaintenance && (status_id === 1 || status_id === 2)) ? 'block' : 'none';
                menu.edit_space.style.display = (!isMaintenance && status_id === 1) ? 'block' : 'none';
                menu.delete_space.style.display = (!isMaintenance && status_id === 1) ? 'block' : 'none';
                // menu.set_maintenance.style.display = (!isMaintenance && status_id === 3) ? 'block' : 'none';
            },

            onClick: (menulink, id, name) => {
                switch (name) {
                    case 'set_maintenance': {
                        mThis.setMaintenance(id, menulink);
                        break;
                    }
                    case 'finish_maintenance': {
                        mThis.finishMaintenance(id, menulink);
                        break;
                    }
                    case 'create_booking': {
                        mThis.createBooking(id, menulink);
                        break;
                    }
                    case 'create_contract': {
                        mThis.createContract(id, menulink);
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
    mThis.renderSpaceCard = (div, data) => {
        data = data ?? [];
        // if(!AuthManager)
        // {
        //     console.error('Authentication Management does not seems to work properly. You may need to refresh page');
        //     return;
        // }

        AuthManager.init().then(user => {
            mThis.renderSpace(div, data)
        });
    }
    mThis.renderSpace = (container, data) => {
        console.log(9090, data);
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
              
                const status = (d.status || "Available").toLowerCase();
                let statusClass = "";
                let statusColor = "#08b9d5";
                switch (status) {
                    case "available":
                        statusClass = "badge text-uppercase text-white shadow-sm rounded-4 bg-success";
                        statusColor = "#0abb87";
                        break;
                    case "booked":
                        statusClass = "badge text-uppercase text-white shadow-sm rounded-4 bg-info";
                        statusColor = "#5578eb";
                        break;
                    case "occupied":
                        statusClass = "badge text-uppercase text-white bg-danger shadow-sm rounded-4";
                        statusColor = "#fd397a";

                        break;
                    default:
                        statusClass = "badge text-uppercase text-white bg-warning shadow-sm rounded-4";
                        statusColor = "#ffb822";
                        break;
                }
                const symbol = d.cur_symbol || '$';
                const size = Number(d.sqm_size || 0);
                const price = Number(d.price || 0);

                const sizeLabel = size ? `${size} m²` : '';

                const pricePerMonth = d.price_type === 'total'
                    ? price
                    : price * size;

                const priceLabel = d.price_type === 'total'
                    ? `${symbol} ${price.toLocaleString()} /month`
                    : `${symbol} ${price.toLocaleString()}`;

                const priceLabelPerMonth = `${symbol} ${pricePerMonth.toLocaleString()}`;
                html += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="unit-card position-relative overflow-hidden h-100" style="background-image:url('${d.bg_image ?? '/assets/images/default/bg-card1.jpg'}');">
                        <div class="p-4 d-flex flex-column gap-2">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="unit-name mb-1 text-prm-custom" style="font-weight: 700;">
                                        Unit ${d.code ?? ''}
                                    </h5>
                                    <p class="unit-floor text-muted small mb-0">
                                        ${d.floor_number ?? '-'} • ${d.building_name ?? ''}
                                    </p>
                                   <p class="unit-floor text-muted small mb-0">
                                        Charge as ( ${d.price_type === 'total' ? 'Monthly' : 'per m²'} )
                                    </p>

                                </div>
                                <span>
                                    <a href="javascript:void(0)" class="btn_space_action" data-id="${d.id}" data-buildingid="${d.building_id}" data-floorid="${d.floor_id}" data-statusid="${d.status_id}" data-maintenance-statusid="${d.maintenance_status_id}" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="d-flex justify-content-between text-muted">
                                <div class="d-flex align-items-center text-muted gap-2">
                                    <i class="fa-regular fa-building text-primary-custom"></i>
                                    <span class="space-type">${d.space_type ?? ''}</span>
                                </div>
                                <div class="d-flex align-items-center text-muted gap-2">
                                    <span class="${statusClass}" style="min-width:80px">${status}</span>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between text-muted">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="w-100 d-flex flex-row justify-content-center align-items-center">
                                        <div class="position-relative" style="width: 120px; height: 100px;">
                                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                                <path class="circle-bg" d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fff" stroke-width="4"></path>
                                                <path class="circle" d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${statusColor}" stroke-width="4" stroke-dasharray="60, 100" stroke-linecap="round"></path>
                                            </svg>
                                            <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" style="font-weight: bold; text-align: center;">
                                                <small class="text-prm-custom">${sizeLabel}</small>
                                            </div>
                                        </div>
                                        <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                            <div class="w-100">
                                                <p class="fs-6 text-prm-custom m-0">Total Price</p>
                                                <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                                <p class="fs-6" style="color: #2b3991;">
                                                   ${priceLabelPerMonth}

                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between text-muted small">
                                    <div class="d-flex align-items-center gap-1">
                                        <div class="text-muted">Create By :</i> ${d.update_user ?? ''}</div>
                                    </div>
                                    <div class="d-flex align-items-center gap-1">
                                        <div class="text-muted"><i class="fa-regular fa-clock"></i> <span>${d.updated_at ?? ''}</span></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <input type="checkbox" class="unit-checkbox position-absolute top-2 end-2 opacity-0 group-hover:opacity-100 rounded">
                    </div>
                </div>
                `;
            });
        }
        else {
            html += `
            <div class="col-12">
                <div class="bg-white rounded-3 p-4 text-center">
                    <h5 class="text-muted m-0">No Units Available</h5>
                </div>
            </div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    };
    mThis.createContract = (id, menulink) => {
        let op = {
            id: null,
            btn: menulink,
            onClose: () => {
                ;
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };
        ContractDialog.show(op);
    }
    mThis.editSpace = (id, menulink) => {
        let op = {
            id: id,
            data: {
                building_id: menulink?.dataset?.buildingid ?? null,
                floor_id: menulink?.dataset?.floorid ?? null,
            },
            btn: menulink,
            onClose: () => {
                ;
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };

        BuildingSpaceDialog.show(op);
    }
    // mThis.setMaintenance = (id, menulink) => {
    //     let op = {
    //         id: id,
    //         btn: menulink,
    //         onClose: () => {
    //             ;
    //             mThis.SpaceListView.showPage(mThis.getFilterData());
    //         }
    //     };

    //     SetMaintenanceDialog.show(op);
    // }
    mThis.createBooking = (id, menulink) => {
        let op = {
            id: null,
            space_id: id,
            btn: menulink,
            onClose: () => {
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };

        CreateBookingDialog.show(op);
    }
    mThis.deleteSpace = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.SpaceListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Space?', {
            title: 'Delete ',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/building-space/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {

                        cv_interact.success('Space has been deleted')
                        mThis.SpaceListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    }

    mThis.setAction = (tbl) => {
        tbl.addEventListener('click', (e) => {
            let btn = VSUtil.closestLimited(e.target, '.btn-create-contract');
            if (btn) {
                e.preventDefault();
                const op = {
                    id: null,
                    data: {
                        space_type_id: btn.dataset.spacetypeid,
                        code: btn.dataset.spaceid,
                        price_type: btn.dataset.pricetype,
                        price: btn.dataset.price,
                        sqm_size: btn.dataset.sqmsize,
                    },
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
                VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', true, 'All Building', null);
                VSUtil.setComboItems(mThis.elFloor, d.floors, 'id', 'name', true, 'All Floor', null);
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', true, 'All Space Type', null);

                // mThis.elBuilding.onchange = function (e) {
                //     e.preventDefault();
                //     mThis.SpaceListView.showPage(mThis.getFilterData());
                //     const p = {
                //         building_id: e.target.value
                //     }
                //     vsapi.call([main_view.base_url, '/prm/settings/options-floors'].join(''), p, null, false).then((res) => {
                //         const data = res.status_code == 200 ? res.data : [];
                //         console.log(3333,data);

                //         VSUtil.setComboItems(mThis.elFloor, data, 'id', 'name', '',"All Floor", null);
                //     });
                // };

                if (typeof onFinish === 'function') onFinish();
            });

    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.setDataSummary();
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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;" for="building">Building</label>
                                <div class="material-input outlined">
                                    <select placeholder="Building" name="building_id" class="data-input form-control" data-field="building_id">
                                    </select>
                                </div>
                            </div>

                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="spaceType">Category</label>
                                <div class="material-input outlined">
                                    <select name="space_type_id" placeholder=" " class="data-input form-control" data-field="space_type_id">
                                    </select>

                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Floor Number</label>
                                <div class="material-input outlined">
                                    <select name="floor_id" class="data-input form-control" data-field="floor_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Unit Code</label>
                                <div class="material-input outlined">
                                    <input type="text" name="code" class="data-input form-control" data-field="code" placeholder=" " />
                                </div>
                            </div>
                            <!-- <div class="col-12 sqm-wrapper" style="display:none;"> -->
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Size (m²)</label>
                                <div class="material-input outlined">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                                </div>
                            </div>

                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Price</label>
                                <div class="material-input outlined">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="spaceType">Price Type</label>
                                <div class="material-input outlined">
                                    <select   name="price_type" placeholder=" " class="data-input form-control" data-field="price_type">
                                        <option value="sqm">Per Square Meter</option>
                                        <option value="total">Whole Room</option>
                                    </select>
                                    <label class="d-none">Price Type</label>
                                </div>
                            </div>


                        </div>`
                    ].join("");
                },


                contentCreated: (me) => {


                    //  me.controls.price_type.onchange = (e) => {
                    //         const sqmWrapper = me.controls.sqm_size.closest('.sqm-wrapper');
                    //         if (!sqmWrapper) return;
                    //         sqmWrapper.style.display = e.target.value === 'sqm' ? '' : 'none';
                    //     };

                },
                configSelect: [
                    {
                        name: "building_id",
                        data: "buildings",
                        textField: "building",
                        valueField: "id",
                    },
                    {
                        name: "floor_id",
                        textField: "name",
                        valueField: "id",
                        defaultValue: (me, op) => {
                            return op?.data?.floor_id ?? null;
                        },
                        depends: {
                            name: "building_id",
                            api: {
                                endpoint: `${main_view.base_url}/prm/settings/options-floors`,
                                params: (me, op) => {
                                    let building_id = me.controls.building_id.value;
                                    return {
                                        building_id: building_id,

                                    };
                                },
                            },
                        },

                    },
                    {
                        name: "space_type_id",
                        data: "space_types",
                        textField: "space_type",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Create Space",
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
                    if (btnClose) btnClose.classList.add('d-none');
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
                            console.log(9090, op);

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

const CreateBookingDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log(123, op);

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
                                <label style="color:#777777;padding-left:6px;">Booker Name</label>
                                <div class="material-input outlined">
                                    <input type="text" name="booker_name" class="data-input form-control" data-field="booker_name" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Booker Phone</label>
                                <div class="material-input outlined">
                                    <input type="number" name="booker_phone" class="data-input form-control" data-field="booker_phone" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Booker Email</label>
                                <div class="material-input outlined">
                                    <input type="email" name="booker_email" class="data-input form-control" data-field="booker_email" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Booking Date</label>
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="booking_date" class="data-input form-control" data-field="booking_date" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Expired Booking Date</label>
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="expired_booking_date"
                                        class="data-input form-control form_input"
                                        data-field="expired_booking_date" />
                                </div>
                            </div>
                           

                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;">Booking Price</label>
                                <div class="material-input outlined">
                                    <input type="number" name="booking_fee" class="data-input form-control" data-field="booking_fee" placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;">Remarks</label>
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control"
                                        data-field="remarks"
                                        rows="3"
                                        placeholder=" ">
                                    </textarea>
                                </div>
                            </div>


                        </div>`
                    ].join("");
                },


                contentCreated: (me) => {


                    //  me.controls.price_type.onchange = (e) => {
                    //         const sqmWrapper = me.controls.sqm_size.closest('.sqm-wrapper');
                    //         if (!sqmWrapper) return;
                    //         sqmWrapper.style.display = e.target.value === 'sqm' ? '' : 'none';
                    //     };

                },
                configSelect: [

                ],
                prepareFormOptions: {
                    createTitle: "Create Booking",
                    modifyTitle: "Edit Booking",
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
                    if (btnClose) btnClose.classList.add('d-none');
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
                            op.space_id = me.dataOptions.space_id;
                            console.log(9099000, op);

                            vsapi.call([main_view.base_url, "/prm/building-space/create-booking",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Booking has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New booking has been created successfully"
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

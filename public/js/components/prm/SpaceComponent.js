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
                const payload = res.data;
                if (payload && payload.summary) {
                    mThis.setDataSummary(payload.summary);
                } else {
                    mThis.setDataSummary(null);
                }
                return payload;
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
                    mThis.applyListFilters();
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
        sh_parent.style.maxHeight = (window.innerHeight - 320) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 320) + 'px';
        }
        mThis.tblBuildingSpace = mThis.SpaceListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuildingSpace);




        mThis.bindSpaceFilterListeners();

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.applyListFilters();
            }, 250);
        });


        mThis.initAlready = true;
    };
    // Align accent + value colors with unit-card status colors in renderSpace (available / booked / occupied).
    mThis.summaryPalette = {
        total: '#5867dd',
        occupancy: '#fd397a',
        available: '#0abb87',
        booked: '#5578eb',
    };

    mThis.setDataSummary = (summary) => {
        const pal = mThis.summaryPalette;
        const s = summary && typeof summary === 'object'
            ? summary
            : { total_units: 0, occupancy: 0, available: 0, booked: 0 };
        const total = Number(s.total_units ?? 0);
        const occ = Number(s.occupancy ?? 0);
        const avail = Number(s.available ?? 0);
        const booked = Number(s.booked ?? 0);

        let html = `<div class="row g-2">`;

        html += `<div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid ${pal.total};">
                    <div class="metric-head-sm">
                        <span class="metric-dot d-inline-block rounded-circle" style="width:8px;height:8px;background:${pal.total};"></span>
                        <span>Total Units</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.total};">${total}</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid ${pal.occupancy};">
                    <div class="metric-head-sm">
                        <span class="metric-dot d-inline-block rounded-circle" style="width:8px;height:8px;background:${pal.occupancy};"></span>
                        <span>Occupancy</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.occupancy};">${occ}</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid ${pal.available};">
                    <div class="metric-head-sm">
                        <span class="metric-dot d-inline-block rounded-circle" style="width:8px;height:8px;background:${pal.available};"></span>
                        <span>Available</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.available};">${avail}</div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid ${pal.booked};">
                    <div class="metric-head-sm">
                        <span class="metric-dot d-inline-block rounded-circle" style="width:8px;height:8px;background:${pal.booked};"></span>
                        <span>Booked</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.booked};">${booked}</div>
                </div>
            </div>`;

        html += `</div>`;
        mThis.divSummary.innerHTML = html;
    };

    mThis.getFilterData = () => {
        const nz = (v) => (v === "" || v === null || v === undefined ? "0" : String(v));
        let p = {
            search_value: mThis.elSearch.value || "",
            status_id: nz(mThis.elFilter_status && mThis.elFilter_status.value),
            building_id: nz(mThis.elBuilding && mThis.elBuilding.value),
            floor_id: nz(mThis.elFloor && mThis.elFloor.value),
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) {
                if (f === "status_id" || f === "building_id" || f === "floor_id") {
                    p[f] = nz(el.value);
                } else {
                    p[f] = el.value;
                }
            }
        });

        return p;
    };

    /**
     * ListView merges cached api_params; falsy values get overwritten by stale params.
     * We send "0" for "All …" selects (PHP treats as no filter). setParams keeps cache aligned.
     */
    mThis.applyListFilters = () => {
        const d = mThis.getFilterData();
        if (mThis.SpaceListView && typeof mThis.SpaceListView.setParams === "function") {
            mThis.SpaceListView.setParams(d);
        }
        mThis.SpaceListView.showPage(d);
    };

    mThis.bindSpaceFilterListeners = () => {
        if (mThis._spaceFilterListenersBound) {
            return;
        }
        mThis._spaceFilterListenersBound = true;
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.applyListFilters();
        });
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_space_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                
                {
                    html: '<span class="ps-2" vslang="titles.Contract">Contract</span>',
                    icon: `<i class="fa-regular fa-file-lines fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract"
                },
                 {
                    html: '<span class="ps-2 " vslang="titles.Modify">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_space"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Booking">Booking</span>',
                    icon: `<i class="fa-solid fa-bold fs-5 text-info-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_booking"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Maintenance">Maintenance</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5 text-warning-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_maintenance"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Finish">Finish</span>',
                    icon: `<i class="fa-solid fa-clipboard-check fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "finish_maintenance"
                },
               
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                const status_id = container.dataset.statusid;
                const maintenance_status_id = container.dataset.maintenancestatusid;
                
                const isMaintenance = maintenance_status_id == 1;

                menu.create_booking.style.display =  status_id >= 2 ? 'none' : 'block';
                menu.create_contract.style.display = status_id >= 2 ? 'none' : 'block';
                menu.edit_space.style.display = status_id == 3 ? 'none' : 'block';
                menu.finish_maintenance.style.display = isMaintenance ? 'block' : 'none';
                menu.set_maintenance.style.display = isMaintenance ? 'none' : 'block';
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
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {

                const status = (d.status || "Available").toLowerCase();
                let statusClass = "";
                let statusColor = "#08b9d5";
                switch (status) {
                    case "available":
                        statusClass = "badge text-uppercase text-white shadow-sm bg-success";
                        statusColor = "#0abb87";
                        break;
                    case "booked":
                        statusClass = "badge text-uppercase text-white shadow-sm  bg-info";
                        statusColor = "#5578eb";
                        break;
                    case "occupied":
                        statusClass = "badge text-uppercase text-white bg-danger shadow-sm ";
                        statusColor = "#fd397a";

                        break;
                    default:
                        statusClass = "badge text-uppercase text-white bg-warning shadow-sm ";
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
                const isUnderMaintenance = Number(d.maintenance_status_id) === 1;
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
                                        ${d.floor_number ?? '-'} • ${d.building_name ?? ''}${isUnderMaintenance ? ' <span class="text-warning fw-semibold">(Maintenance)</span>' : ''}
                                    </p>
                                   <p class="unit-floor text-muted small mb-0">
                                        Charge as ( ${d.price_type === 'total' ? `${symbol} ${price.toLocaleString()}/month` : `${symbol} ${price.toLocaleString()}/ m²`} )
                                    </p>

                                </div>
                                <span>
                                    <a href="javascript:void(0)" class="btn_space_action" data-id="${d.id}" data-buildingid="${d.building_id}" data-floorid="${d.floor_id}" data-statusid="${d.status_id}" data-maintenanceStatusId="${d.maintenance_status_id}" aria-haspopup="true" aria-expanded="false">
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
        vsapi.call(
            `${main_view.base_url}/prm/contract/form-options`,
            { space_id: id },
            menulink,
            null
        ).then((res) => {
            if (res.status_code !== 200) {
                cv_interact.error(res.error_message || "Please create tenant first.");
                return;
            }
            let op = {
                id: null,
                space_id: id,
                btn: menulink,
                onClose: () => {
                    mThis.applyListFilters();
                }
            };
            ContractDialog.show(op);
        });
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
                mThis.applyListFilters();
            }
        };

        BuildingSpaceDialog.show(op);
    }
    mThis.setMaintenance = (id, menulink) => {
        const op = {
            space_id: id,
            building_id: menulink?.dataset?.buildingid || null,
            btn: menulink,
            onClose: () => {
                mThis.applyListFilters();
            }
        };
        if (typeof CreateMaintenanceDialog !== "undefined") {
            CreateMaintenanceDialog.show(op);
        }
    };
    mThis.finishMaintenance = (id, menulink) => {
        cv_interact.confirm("Mark this maintenance as finished (Completed)?", { transTitle: "Finish Maintenance", context: "confirm", confirmButtonText: "Finish" }, (e) => {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/maintenance/finish-by-space`, { space_id: id }, menulink, null).then(res => {
                    if (res.status_code === 200) {
                        cv_interact.success("Maintenance finished.");
                        mThis.applyListFilters();
                    } else {
                        cv_interact.error(res.error_message || "Failed");
                    }
                });
            }
        });
    };
    mThis.createBooking = (id, menulink) => {
        let op = {
            id: null,
            space_id: id,
            btn: menulink,
            onClose: () => {
                mThis.applyListFilters();
            }
        };

        CreateBookingDialog.show(op);
    }
    mThis.deleteSpace = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.applyListFilters();
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
                        mThis.applyListFilters();
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
                        mThis.applyListFilters();
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
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'space_status', '', 'All Statuses', '');
                VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', '', 'All Buildings', '');
                VSUtil.setComboItems(mThis.elFloor, d.floors, 'id', 'name', '', 'All Floors', '');
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', '', 'All Space Type', '');

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
            mThis.setDataSummary(null);
            mThis.applyListFilters();
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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <select data-style="material" placeholder="Building" name="building_id" class="data-input form-control" data-field="building_id">
                                    </select>

                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="space_type_id" placeholder="Type" class="data-input form-control" data-field="space_type_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="floor_id" class="data-input form-control" data-field="floor_id" placeholder="Floor">
                                    </select>

                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" name="code" class="data-input form-control" data-field="code" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Unit Code</label>
                                </div>
                            </div>
                            <!-- <div class="col-12 sqm-wrapper" style="display:none;"> -->
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Price</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="price_type" required placeholder="Price Type" class="data-input form-control" data-field="price_type">
                                        <option value="">Select Price Type</option>
                                        <option value="sqm">Per Square Meter</option>
                                        <option value="total">Whole Room</option>
                                    </select>
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
                    me.controls.price_type.value = data.space_details.price_type;
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
                            console.log(220,op);
                            
                            // if (!op.price_type) {
                            //     cv_interact.error("Please select Price Type");
                            //     return;
                            // }
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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" name="booker_name" class="data-input form-control" data-field="booker_name" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Booker Name</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" name="booker_phone" class="data-input form-control" data-field="booker_phone" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Phone Number</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="email" name="booker_email" class="data-input form-control" data-field="booker_email" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Email</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="booking_date" class="data-input form-control" data-field="booking_date" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Booking Date</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="expired_booking_date" class="data-input form-control form_input" data-field="expired_booking_date" />
                                    <label style="color:#777777;padding-left:6px;">Expired  Date</label>
                                </div>

                            </div>


                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input type="number" min="1" step="0.01" name="booking_fee" class="data-input form-control" data-field="booking_fee" placeholder=" " />
                                    <label style="color:#777777;padding-left:6px;">Booking Amount</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remarks" rows="3" placeholder=" "></textarea>
                                    <label style="color:#777777;padding-left:6px;">Remarks</label>
                                </div>
                            </div>


                        </div>`
                    ].join("");
                },
                contentCreated: (me) => {
                   me.controls.booking_fee.addEventListener('input', (e) => {
                    let v = parseFloat(e.target.value);
                    if (isNaN(v)) {
                        e.target.value = '';
                        return;
                    }
                    if (v <= 0) {
                        e.target.value = '';
                        return;
                    }
                    e.target.value = v;
                });
                       
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

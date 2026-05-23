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
    mThis.summaryPalette = {
        total: '#f6d673',
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
                        <span >Total Units</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.total};">${total}</div>
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
            </div>

            <div class="col-12 col-sm-6 col-lg-2">
                <div class="metric-card-sm" style="border-left:6px solid ${pal.occupancy};">
                    <div class="metric-head-sm">
                        <span class="metric-dot d-inline-block rounded-circle" style="width:8px;height:8px;background:${pal.occupancy};"></span>
                        <span>Occupancy</span>
                    </div>
                    <div class="metric-value-sm fw-bold px-4" style="color:${pal.occupancy};">${occ}</div>
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
            space_type_id: nz(mThis.elSpaceType && mThis.elSpaceType.value),
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) {
                if (f === "status_id" || f === "building_id" || f === "floor_id" || f === "space_type_id") {
                    p[f] = nz(el.value);
                } else {
                    p[f] = el.value;
                }
            }
        });

        return p;
    };
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
                    html: '<span class="ps-2" vslang="titles.Modify Space"></span>',
                    icon: `<i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_space"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Space"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_space"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Create Booking"></span>',
                    icon: `<i class="fa-regular fa-square-plus fs-5 text-danger-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_booking"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Create Contract"></span>',
                    icon: `<i class="fa-regular fa-file-lines fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Create Maintenance"></span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5 text-warning-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_maintenance"
                },
                {
                    html: '<span class="ps-2" vslang="titles.View Booking"></span>',
                    icon: `<i class="fa-regular fa-eye fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_booking"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify Booking"></span>',
                    icon: `<i class="fa-solid fa-pencil fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_booking"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Cancel Booking"></span>',
                    icon: `<i class="fa-solid fa-square-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "cancel_booking"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Finish Maintenance"></span>',
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
                const statusIdNum = Number(status_id);
                const maintenance_status_id = Number(container.dataset.maintenancestatusid || 0);

                const isUpcomingMaintenance = maintenance_status_id === 1;
                const isMaintenance = maintenance_status_id === 2;
                const hasActiveMaintenance = isUpcomingMaintenance || isMaintenance;

                const booked = statusIdNum === 2;
                const occupiedOrNotBookable = statusIdNum >= 3;
                menu.view_booking.style.display = booked ? 'block' : 'none';
                menu.edit_booking.style.display = booked ? 'block' : 'none';
                menu.cancel_booking.style.display = booked ? 'block' : 'none';
                menu.create_booking.style.display = booked || occupiedOrNotBookable ? 'none' : 'block';
                menu.create_contract.style.display = statusIdNum >= 3 ? 'none' : 'block';
                // menu.modify_space.style.display = status_id == 3 ? 'none' : 'block';
                menu.finish_maintenance.style.display = isMaintenance ? 'block' : 'none';
                menu.set_maintenance.style.display = hasActiveMaintenance ? 'none' : 'block';
                menu.delete_space.style.display = statusIdNum > 1 ? 'none' : 'block';
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
                    case 'modify_space': {
                        mThis.modifySpace(id, menulink);
                        break;
                    }
                    case 'delete_space': {
                        mThis.deleteSpace(id, menulink);
                        break;
                    }
                    case 'view_booking': {
                        mThis.viewBooking(id, menulink);
                        break;
                    }
                    case 'edit_booking': {
                        mThis.editBooking(id, menulink);
                        break;
                    }
                    case 'cancel_booking': {
                        mThis.cancelBooking(id, menulink);
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
                    ? `${symbol} ${price.toLocaleString(undefined,{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} /month`
                    : `${symbol} ${price.toLocaleString(undefined,{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;

                const priceLabelPerMonth = `${symbol} ${pricePerMonth.toLocaleString(undefined,{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
                const maintenanceStatusId = Number(d.maintenance_status_id || 0);
                const maintenanceStatusName = String(d.maintenance_status ?? d.maintenance_status_name ?? '').trim().toLowerCase();
                const isPlannedMaintenance = maintenanceStatusId === 1 || maintenanceStatusName === 'planned' || maintenanceStatusName === 'upcoming';
                const maintenanceLabel = isPlannedMaintenance ? ' <span class="text-warning small fw-semibold">(Upcoming Maintenance)</span>' : (maintenanceStatusId === 2 ? ' <span class="text-warning small fw-semibold">(Maintenance)</span>' : '');
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
                                        ${d.floor_number ?? '-'} • ${d.building_name ?? ''}${maintenanceLabel}
                                    </p>
                                   <p class="unit-floor text-muted small mb-0">
                                        Charge as ( ${d.price_type === 'total' ? `${symbol} ${price.toLocaleString()} / month` : `${symbol} ${price.toLocaleString()} / m²`} )
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
                                        <div class="text-muted small">Last Updated :</i> ${d.update_user ?? ''}</div>
                                    </div>
                                    <div class="d-flex align-items-center gap-1">
                                        <div class="text-muted small"><i class="fa-regular fa-clock fs-6"></i> <span class="small">${d.updated_at ?? ''}</span></div>
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
        ).then(res => {
            if (res.status_code !== 200 && res.error_message === "Tenant") {
                const status_id = Number(menulink?.dataset?.statusid || 0);

                if (status_id === 2) {
                    vsapi.call(
                        `${main_view.base_url}/prm/building-space/latest-booking`,
                        { space_id: id },
                        menulink,
                        null
                    ).then(bookingRes => {
                        const booking = bookingRes?.data?.data || bookingRes?.data || {};
                        let op  = {
                            id: null,
                            phone_number: booking.booker_phone || "",
                            name: booking.booker_name || "",
                            email: booking.booker_email || "",
                            onClose: newTenantId => {
                                if (newTenantId) {
                                    vsapi.call(
                                        `${main_view.base_url}/prm/contract/form-options`,
                                        { space_id: id, tenant_id: newTenantId },
                                        menulink,
                                        null
                                    ).then(finalRes => {
                                        ContractDialog.show({
                                            id: null,
                                            space_id: id,
                                            tenant_id: newTenantId,
                                            data: finalRes.data,
                                            btn: menulink,
                                            onClose: () => mThis.applyListFilters()
                                        });
                                    });
                                } else {
                                    mThis.applyListFilters();
                                }
                            }
                        }
                        CreateTenantDialog.show(op);
                    });
                    return;
                }
                cv_interact.error(res.error_message || "Please create tenant first.");
                return;
            }
            ContractDialog.show({
                id: null,
                space_id: id,
                data: res.data,
                btn: menulink,
                onClose: () => mThis.applyListFilters()
            });
        });
    };
    mThis.modifySpace = (id, menulink) => {
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
        cv_interact.confirm("Finish this maintenance?", { transTitle: "Finish Maintenance", context: "confirm", confirmButtonText: "Finish" }, (e) => {
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

                        cv_interact.success('Unit has been deleted');
                        mThis.applyListFilters();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    }
    mThis.viewBooking = (id, menuLink) => {
        let op = {
            id: id,
            onClose: () => {
                mThis.applyListFilters();

            }
        };
        ViewBookingDialog.show(op);
    };
    mThis.editBooking = (id, menuLink) => {
        vsapi.call(`${main_view.base_url}/prm/building-space/view-booking`, { id }, menuLink, null).then((res) => {
            if (res.status_code !== 200 || !res.data) {
                cv_interact.error(res.error_message || "Booking not found.");
                return;
            }
            CreateBookingDialog.show({
                space_id: id,
                booking: res.data,
                detail: { space_id: id, booking: res.data },
                dataOptions: { space_id: id, booking: res.data },
                btn: menuLink,
                onClose: () => { mThis.applyListFilters(); },
            });
        });
    };
    mThis.cancelBooking = (id, menuLink) => {
        cv_interact.confirm("Cancel this booking ?", {
            title: "Cancel Booking",
            context: "delete",
            confirmButtonText: "Yes",
        }, (yes) => {
            if (!yes) return;
            vsapi.call(`${main_view.base_url}/prm/building-space/cancel-booking`, { space_id: id }, menuLink, null).then((res) => {
                if (res.status_code === 200) {
                    cv_interact.success("Booking has been cancelled.");
                    mThis.applyListFilters();
                } else {
                    cv_interact.error(res.error_message || "Failed.");
                }
            });
        });
    };

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
                VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', '', 'All buildings', '');
                VSUtil.setComboItems(mThis.elFloor, d.floors, 'id', 'name', '', 'All Floors', '');
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', '', 'All Types', '');

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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                            <div class="col-12">
                                <select data-style="material" placeholder="Building" name="building_id" class="data-input form-control" data-field="building_id">
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="floor_id" class="data-input form-control" data-field="floor_id" placeholder="Floor">
                                </select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="code" class="data-input form-control" data-field="code" placeholder=" " />
                                    <label>Unit Code (Optional)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="space_type_id" placeholder="Type" class="data-input form-control" data-field="space_type_id">
                                </select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="sqm_size" class="data-input  form-control" data-field="sqm_size" placeholder=" " />
                                    <label>Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price" class="data-input form-control" data-field="price" placeholder=" " />
                                    <label>Price</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="price_type" placeholder="Charge As" class="data-input form-control" data-field="price_type">
                                    <option value="">Select Charge As</option>
                                    <option value="sqm">m²</option>
                                    <option value="total">Unit</option>
                                </select>
                            </div>


                        </div>`
                    ].join("");
                },

                contentCreated: (me) => {
                    applyNumberInput(me.controls.sqm_size);
                    applyNumberInput(me.controls.price);

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
                        lazyLoading: false,
                        defaultValue: (me, op) => {
                            return op?.data?.floor_id ?? null;
                        },
                        depends: {
                            name: "building_id",
                            api: {
                                endpoint: `${main_view.base_url}/prm/settings/options-floors`,
                                // params: (me, op) => {
                                //     let building_id = me.controls.building_id.value;
                                //     return {
                                //         building_id: building_id,

                                //     };
                                // },
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
                onShow: (me) => {
                    const title = me.divModal.querySelector('.modal-title');
                    if (title) {
                        const isModify = !!me.dataOptions?.id;
                        title.innerHTML = isModify
                            ? '<h4 class="text-prm-custom text-start fw-bold">Modify Space</h4>'
                            : '<h4 class="text-prm-custom text-start fw-bold">Create Space</h4>';
                    }
                },
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
                    console.log(777,data);
                    if(me.dataOptions.id) {
                        me.controls.price_type.value = data.space_details.price_type;

                    };
                    const isReadOnly = me.dataOptions.id > 0;
                    me.setReadOnly(isReadOnly, ["building_id","floor_id"]);
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
                            console.log(220, op);

                            // if (!op.price_type) {
                            //     cv_interact.error("Please select Price Type");
                            //     return;
                            // }
                            vsapi.call([main_view.base_url, "/prm/building-space/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Space has been updated successfully."
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New space has been added successfully."
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
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="booker_name" class="data-input form-control" data-field="booker_name" placeholder=" " />
                                    <label>Booker Name</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="booker_phone" class="data-input form-control" data-field="booker_phone" placeholder=" " />
                                    <label>Booker Phone</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="email" name="booker_email" class="data-input form-control" data-field="booker_email" placeholder=" " />
                                    <label>Email (Optional)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="booking_date" class="data-input form-control" Readonly data-field="booking_date" placeholder=" " />
                                    <label>Booking Date</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="expired_booking_date" class="data-input form-control form_input" data-field="expired_booking_date" />
                                    <label>Expired  Date</label>
                                </div>

                            </div>


                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" inputmode="decimal"
                                        name="booking_fee"
                                        class="data-input form-control"
                                        data-field="booking_fee"
                                        placeholder=" " />
                                    <label>Booking Amount</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" rows="3" placeholder=" "></textarea>
                                    <label>Remark</label>
                                </div>
                            </div>


                        </div>`
                    ].join("");
                },
                contentCreated: (me) => {
                    me.controls.booking_fee.addEventListener('input', (e) => {
                        let v = e.target.value;
                        v = v.replace(/[^0-9.]/g, '');

                        const parts = v.split('.');
                        if (parts.length > 2) {
                            v = parts[0] + '.' + parts[1];
                        }
                        if (parts[1] !== undefined) {
                            v = parts[0] + '.' + parts[1].slice(0, 2);
                        }

                        e.target.value = v;
                    });
                    me.controls.booking_fee.addEventListener('blur', (e) => {
                        let v = parseFloat(e.target.value);

                        if (isNaN(v) || v <= 0) {
                            e.target.value = '';
                            return;
                        }
                        e.target.value = v;
                    });




                },
                onShow: (me) => {
                    const title = me.divModal.querySelector('.modal-title');
                    if (!title) return;
                    const bookingId =
                        me.dataOptions?.booking?.id ?? me.detail?.booking?.id;
                    const isEdit = Number(bookingId) > 0;
                    title.innerHTML = isEdit
                        ? '<h4 class="text-prm-custom text-start fw-bold">Edit Booking</h4>'
                        : '<h4 class="text-prm-custom text-start fw-bold">Create Booking</h4>';
                    const c = me.controls;
                    if (c?.booking_date) c.booking_date.disabled = isEdit;
                    if (c?.expired_booking_date) c.expired_booking_date.disabled = isEdit;
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
                            return { id: op.space_id ?? op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const today = new Date();

                    const dd = String(today.getDate()).padStart(2, '0');
                    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                    const mm = months[today.getMonth()];
                    const yyyy = today.getFullYear();

                    const formattedDate = `${dd}-${mm}-${yyyy}`;

                    me.controls.booking_date.value = formattedDate;
                    const c = me.controls;
                    if (!c) return;
                    const b = me.dataOptions?.booking ?? me.detail?.booking;
                    const isEdit = Boolean(b && Number(b.id) > 0);
                    if (c.booking_date) c.booking_date.disabled = isEdit;
                    if (c.expired_booking_date) c.expired_booking_date.disabled = isEdit;
                    if (!b) return;
                    const sv = (k, v) => { if (c[k]) c[k].value = v != null ? String(v) : ""; };
                    sv("booker_name", b.booker_name);
                    sv("booker_phone", b.booker_phone);
                    sv("booker_email", b.booker_email);
                    sv("booking_date", b.booking_date);
                    sv("expired_booking_date", b.expired_booking_date);
                    sv("booking_fee", b.booking_fee);
                    sv("remarks", b.remarks);
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
                            const editId = me.dataOptions?.booking?.id ?? me.detail?.booking?.id;
                            const isEdit = Boolean(editId);
                            if (isEdit) op.booking_id = editId;
                            if (isEdit && me.controls) {
                                if (me.controls.booking_date) {
                                    op.booking_date = me.controls.booking_date.value;
                                }
                                if (me.controls.expired_booking_date) {
                                    op.expired_booking_date = me.controls.expired_booking_date.value;
                                }
                            }
                            const url = isEdit ? "/prm/building-space/update-booking" : "/prm/building-space/create-booking";

                            vsapi.call([main_view.base_url, url].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success(
                                        isEdit
                                            ? "Booking has been updated successfully."
                                            : "New booking has been created successfully."
                                    );
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

const ViewBookingDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal modal-content-vs-dialog",
                backdrop: "static",
                TriggerOnClose: true,
                createContent: () => { return ['<div name="container_fluid"></div>'].join(''); },
                contentCreated: (me) => {
                    me.renderProfile = (div, data) => {
                        let html = '';

                        html += `
                            <style>
                                .booker_profile {
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                    padding: 5px;
                                    width: 100%;
                                }
                                .student_header {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    position: relative;
                                    padding: 10px;
                                    padding-bottom: 20px;
                                }
                                .school_logo {
                                    position: absolute;
                                    left: 0;
                                }
                                .info_title {
                                    text-align: center;
                                    flex-grow: 1;
                                }
                                .booker_info {
                                    gap: 10px;
                                    justify-content: center;
                                    border: 1px solid #ccc;
                                    padding: 10px;
                                    border-radius: 5px;
                                }
                            </style>

                            <div class="booker_profile overflow-y-auto overflow-x-hidden">
                                <div class="info_title p-2 text-primary-custom">
                                        <h5>Unit ${data.space_code ?? '_'}</h5>
                                </div>

                                <div class="booker_info">
                                    <div class="row cols-2 mb-0">
                                        <div class="col-4 p_profile_left">
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Booking Name</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap text-capitalize data-get">${data.booker_name ?? '_'}</p>
                                            </div>
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Booking Date</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap text-capitalize data-get">${data.booking_date ?? '_'}</p>
                                            </div>
                                        </div>
                                        <div class="col-4 p_profile_center">
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Booking Phone</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap text-capitalize data-get">${data.booker_phone ?? '_'}</p>
                                            </div>
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Expired Date</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap text-capitalize data-get">${data.expired_booking_date ?? '_'}</p>
                                            </div>
                                        </div>
                                        <div class="col-4 p_profile_right">
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Booking Email</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap data-get">${data.booker_email ?? '_'}</p>
                                            </div>
                                            <div class="d-flex">
                                                <p class="text-nowrap text-muted width-p">Booking Amount</p>
                                                <p class="px-3">:</p>
                                                <p class="text-nowrap text-capitalize data-get">${VSMoney.formatAmount(data.booking_fee, data.currency ?? 'USD') ?? '_'}</p>
                                            </div>
                                        </div>
                                        <div class="row cols-2 mb-0">
                                            <div class="d-flex align-items-start">
                                                <p class="text-muted mb-0">Remark</p>
                                                <p class="px-3 mb-0">:</p>
                                                <p class="data-get mb-0 text-capitalize" style="word-break: break-word; overflow-wrap: anywhere;">
                                                    ${data.remarks ?? '_'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        div.innerHTML = html;
                    };
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Close"></span>',
                        cssClass: 'btn btn-secondary',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Booking Detail",
                    modifyTitle: "Booking Detail",
                    targetProp: "divModal",
                    api: {
                        endpoint: `${main_view.base_url}/prm/building-space/view-booking`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, d) => {
                    me.renderProfile(me.controls.container_fluid, d);
                },
            });

        dialog.show(op);
    };

    return self;
})();

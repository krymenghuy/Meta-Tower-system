"use strict";
var ReservationComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Reservation";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_reservation_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnReservation");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_reservation");
    mThis.elFilter_status = mThis.self.querySelector("#_reservation_status");
    mThis.elAmenity = mThis.self.querySelector("#amenity_id");
    mThis.elBookingDate = mThis.self.querySelector("#booking_date");
    mThis.elSearch = mThis.self.querySelector("#_search_reservation");
    mThis.elBookingDateTo = mThis.self.querySelector("booking_date_to");
    mThis.autoRefreshMs = 60000;
    mThis.autoRefreshTimer = null;
    mThis.autoRefreshStartTimeout = null;

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom text-capitalize">${data.tenant_name ?? "_"}</span>
                        <span class="d-block text-primary"style="font-size:12px;">${data.phone_number ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Amenity",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.amenity_name ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Reservation Date",
            className: "align-middle",
            data: (data) => {
                const to12h = (hhmm) => {
                    if (!hhmm) return "";
                    const [h, m] = String(hhmm).trim().split(":").map(Number);
                    const hour = isNaN(h) ? 0 : h % 24;
                    const min = isNaN(m) ? 0 : m;
                    const ampm = hour < 12 ? "AM" : "PM";
                    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
                };
                const start12 = to12h((data.start_time ?? "").substring(0, 5));
                const end12 = to12h((data.end_time ?? "").substring(0, 5));
                return `<span class="d-block text-prm-custom">${data.booking_date ?? ""}</span>
                            <span class="d-block text-primary"style="font-size:12px;">${start12} - ${end12}</span>`;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:320px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "_"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls = "badge border border-secondary text-secondary bg-secondary-subtle";
                let label = "Upcoming";
                if (status === "upcoming") {
                    cls ="badge border border-info text-info bg-info-subtle";
                    label = "Upcoming";
                } else if (status === "in-progress") {
                    cls ="badge border border-warning text-warning bg-warning-subtle";
                    label = "In-Progress";
                } else if (status === "completed") {
                    cls ="badge border border-success text-success bg-success-subtle";
                    label = "Completed";
                } else if (status === "cancelled") {
                    cls = "badge border border-danger text-danger bg-danger-subtle";
                    label = "Cancelled";
                }
                return `
                    <span class="${cls} px-3 py-2 d-inline-flex align-items-center gap-2" style="min-width:90px">
                        ${label}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => {
                console.log(444,data.status_id);

                if (data.status_id == 2) return '';
                return `<div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_reservation_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`;
            },


        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        if (mThis.elBookingDateTo && !mThis.elBookingDateTo.value) {
            const today = new Date().toISOString().split('T')[0];
            mThis.elBookingDateTo.value = today;
        }

        mThis.ReservationListView = new ListView("_reservation_list", {
            fetchApi: `${main_view.base_url}/prm/reservation/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("reservation");
                tr.setAttribute("id", `reservation_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ReservationListView.showPage(mThis.getFilterData());
                },
            };
            // if (!AuthManager.allowed(240)) return;
            CreateReservationDialog.show(op);
        };

        mThis.pr_tbl = mThis.ReservationListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        mThis.tblReservation = mThis.ReservationListView.getTable();

        mThis.initDropdownMenus(mThis.tblReservation);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ReservationListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
            // building_id: mThis.elBuilding.value,
            // floor_id: mThis.elFloor.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.isActiveView = () => !!(mThis.self && mThis.self.offsetParent !== null);
    mThis.refreshListIfActive = () => {
        if (!mThis.initAlready || !mThis.isActiveView()) return;
        mThis.ReservationListView.showPage(mThis.getFilterData());
    };

    mThis.startAutoRefresh = () => {
        clearInterval(mThis.autoRefreshTimer);
        clearTimeout(mThis.autoRefreshStartTimeout);
        const now = Date.now();
        const msToNextMinute = 60000 - (now % 60000);
        mThis.autoRefreshStartTimeout = setTimeout(() => {
            mThis.refreshListIfActive();
            mThis.autoRefreshTimer = setInterval(() => {
                mThis.refreshListIfActive();
            }, mThis.autoRefreshMs);
        }, msToNextMinute);
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_reservation_action",
            cssClass: "bg-white shadow",
            menus: [

                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_reservation",
                },
                {
                    html: '<span class="ps-2">Cancel</span>',
                    icon: `<i class="fa-solid fa-square-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "cancel_reservation",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_reservation",
                },
            ],

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = parseInt(container.dataset.statusid);

                menu.edit_reservation.style.display = 'none';
                menu.cancel_reservation.style.display = 'none';
                menu.delete_reservation.style.display = 'none';

                if (status_id === 1) {
                    menu.cancel_reservation.style.display = 'block';
                    menu.edit_reservation.style.display = 'block';
                }
                else if (status_id === 3 || status_id === 4) {
                    menu.delete_reservation.style.display = 'block';
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_reservation": {
                        mThis.editReservation(id, menuLink);
                        break;
                    }
                    case "cancel_reservation": {
                        mThis.cancelReservation(id, menuLink);
                        break;
                    }
                    case "delete_reservation": {
                        mThis.deleteReservation(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editReservation = (id, menulink) => {
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            },
        };
        CreateReservationDialog.show(op);
    };

    mThis.cancelReservation = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Cancel this reservation ?",
            {
                transTitle: "Cancel Reservation",
                context:"delete",
                confirmButtonText: "Cancel",
            },
            (confirmed) => {
                if(!confirmed) return;
                vsapi.call(
                    `${main_view.base_url}/prm/reservation/cancel`,
                    { id: id },
                    false, false, false,
                ).then((res) => {
                    if (res.status_code === 200){
                        cv_interact.success("Reservation cancelled.");
                        mThis.ReservationListView.showPage(mThis.getFilterData());
                    } else {
                        cv_interact.error(res.error_message || "Cancel failed");
                    }
                });
            }
        );
    };

    mThis.deleteReservation = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this reservation?",
            {
                transTitle: "Delete Reservation",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (e) => {
                if (!e) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/reservation/delete`,
                        { id: id },
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Reservation deleted.");
                            mThis.ReservationListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Delete failed",
                            );
                        }
                    });
            },
        );
    };


    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/reservation/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.reservation_statuses, "id", "reservation_status", "", "All Statuses", "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ReservationListView.showPage(mThis.getFilterData());
            mThis.startAutoRefresh();

        });
    };
    return mThis;
})();

const CreateReservationDialog = (() => {
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
                        `<div class="row g-3 justify-content-center">
                            <input type="hidden" class="data-input" data-field="tenant_id">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="tenant" class="data-input form-control" data-field="tenant_name" placeholder="Tenant" autocomplete="off">
                                    <label>Tenant</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" disabled placeholder=" "></input>
                                    <label>Phone Number</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="amenity" class="data-input form-control" data-field="amenity_id" placeholder="Amenity">
                                </select>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" class="data-input form-control" data-field="amenity_code" placeholder=" " disabled />
                                    <label>Amenity Code</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="booking_date" required class="data-input form-control form_input" data-field="booking_date" />
                                    <label>Booking Date</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input type="time" name="start_time" class="data-input form-control form_input" data-field="start_time" placeholder=" " />
                                    <label>Check-in Time</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input type="time" name="end_time" required class="data-input form-control form_input" data-field="end_time" placeholder=" " />
                                    <label>Check-out Time</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label>Remark</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                        type: "select",
                        prefetch: true,
                        query: {
                            from: "tenants",
                            select: ["id", "name", "phone_number"],
                            where: [['status_id','=',2]],
                            orderBy: [['id','DESC']],
                            limit:50,
                            searchFields: {
                                name: "LIKE",
                                phone_number: "LIKE",
                            },
                        },
                        showColumnHeader: true,
                        columns: {
                            name: "Name",
                            phone_number: "Phone",
                        },
                        onSelect: (tenant) => {
                            me._selectedTenantId = tenant.id;

                            // Direct mapping from the search result
                            if (me.controls.phone_number) {
                                me.controls.phone_number.value =
                                    tenant.phone_number || "";
                            }
                        },
                    });
                    me.searchTenant.reset("");
                },

                configSelect: [
                    {
                        name: "amenity_id",
                        data: "amenities",
                        textField: "amenity",
                        valueField: "id",
                    },

                    {
                        name: "reservation_statuses",
                        data: "reservation_statuses",
                        textField: "reservation_status",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Create Reservation",
                    modifyTitle: "Modify Reservation",
                    targetProp: "reservation_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/reservation/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id, tenant_id: op.tenant_id ?? null };
                        },
                    },
                },



                onPrepareForm: (me, data) => {
                    const details = data?.reservation_details || {};
                    const amenitySelect = me.divModal.querySelector('[data-field="amenity_id"]');
                    const applyAmenityData = (amenityId) => {
                    const amenities = Array.isArray(data?.amenities) ? data.amenities: [];
                    const selected = amenities.find((item) => String(item.id) === String(amenityId));
                    const codeInput = me.divModal.querySelector('[data-field="amenity_code"]');
                    if (codeInput)
                        codeInput.value = selected?.amenity_code ?? "";
                    };
                    if (me.searchTenant && typeof me.searchTenant.reset === "function") {
                        me.searchTenant.reset();
                    }

                    amenitySelect.onchange = (e) => applyAmenityData(e.target.value);
                    if (me.dataOptions.id > 0) {
                         console.log(1221,data);
                        me.controls.tenant_id.value = details.tenant_id;
                        setTimeout(() => {
                            if (details.amenity_id) {
                                amenitySelect.value = details.amenity_id;
                                applyAmenityData(details.amenity_id);
                            }
                            // $(amenitySelect).trigger("change");
                        }, 500);
                    }

                },
               
                

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                            me._selectedTenantId = null; 
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            if (me._selectedTenantId != null && me._selectedTenantId !== undefined) {
                                op.tenant_id = me._selectedTenantId;
                            }

                            // op.tenant_id = me._selectedTenantId;
                            op.id = me.dataOptions.id;
                            console.log(123,op);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/reservation/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        me._selectedTenantId = null; 
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Reservation has been updated successfully.",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New reservation has been added successfully.",
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

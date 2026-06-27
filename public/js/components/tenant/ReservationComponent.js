"use strict";
var ReservationComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Booking Amenity";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_reservation_component",
    );
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

    mThis.escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
    };

    mThis.to12h = (hhmm) => {
        if (!hhmm) return "";
        const [h, m] = String(hhmm).trim().split(":").map(Number);
        const hour = isNaN(h) ? 0 : h % 24;
        const min = isNaN(m) ? 0 : m;
        const ampm = hour < 12 ? "AM" : "PM";
        const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
    };

    mThis.getStatusMeta = (data) => {
        const status = (data.status ?? "").toLowerCase();
        const statusId = parseInt(data.status_id, 10);
        const map = {
            upcoming: {
                label: "Upcoming",
                rowCls: "reservation-row--upcoming",
                badgeCls: "reservation-row__status-badge reservation-row__status-badge--upcoming",
            },
            "in-progress": {
                label: "In-Progress",
                rowCls: "reservation-row--in-progress",
                badgeCls: "reservation-row__status-badge reservation-row__status-badge--in-progress",
            },
            completed: {
                label: "Completed",
                rowCls: "reservation-row--completed",
                badgeCls: "reservation-row__status-badge reservation-row__status-badge--completed",
            },
            cancelled: {
                label: "Cancelled",
                rowCls: "reservation-row--cancelled",
                badgeCls: "reservation-row__status-badge reservation-row__status-badge--cancelled",
            },
        };
        const meta = map[status] || null;
        if (meta) return meta;
        if (statusId === 1) return map.upcoming;
        if (statusId === 2) return map["in-progress"];
        if (statusId === 3) return map.completed;
        if (statusId === 4) return map.cancelled;
        return {
            label: data.status ?? "—",
            rowCls: "",
            badgeCls: "reservation-row__status-badge",
        };
    };

    mThis.renderReservationAction = (data) => {
        if (data.status_id == 2) return "";
        return `<a href="javascript:void(0)" class="btn_reservation_action reservation-row__menu-btn"
            data-id="${data.id}"
            data-statusid="${data.status_id ?? ""}"
            aria-haspopup="true" aria-expanded="false"
            title="More options">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </a>`;
    };

    mThis.renderReservationList = (container, items) => {
        items = items ?? [];
        container.innerHTML = "";

        if (!items.length) {
            container.innerHTML = `
                <div class="reservation-list-empty text-center py-5 px-3">
                    <span class="reservation-list-empty__icon d-inline-flex align-items-center justify-content-center mb-3">
                        <i class="fa-regular fa-calendar-check"></i>
                    </span>
                    <p class="mb-1 fw-semibold text-prm-custom">No reservations found</p>
                    <small class="text-muted">Try adjusting your search or filters.</small>
                </div>`;
            return;
        }

        let rowsHtml = "";
        items.forEach((data) => {
            const status = mThis.getStatusMeta(data);
            const amenityName = mThis.escapeHtml(data.amenity_name ?? "—");
            const bookingDate = mThis.escapeHtml(data.booking_date ?? "—");
            const start12 = mThis.to12h((data.start_time ?? "").substring(0, 5));
            const end12 = mThis.to12h((data.end_time ?? "").substring(0, 5));
            const remarksRaw = (data.remarks ?? "").trim();
            const remarks = remarksRaw
                ? mThis.escapeHtml(remarksRaw)
                : "—";
            const rowCls = status.rowCls ? ` ${status.rowCls}` : "";

            rowsHtml += `
            <div class="reservation-row${rowCls} reservation" id="reservation_id${data.id}" data-statusid="${data.status_id ?? ""}">
                <div class="reservation-row__accent"></div>
                <div class="reservation-row__grid">
                    <div class="reservation-row__cell reservation-row__cell--amenity">
                        <span class="reservation-row__amenity">${amenityName}</span>
                    </div>
                    <div class="reservation-row__cell reservation-row__cell--date">
                        <i class="fa-regular fa-calendar reservation-row__icon"></i>
                        <span>${bookingDate}</span>
                    </div>
                    <div class="reservation-row__cell reservation-row__cell--time">
                        <i class="fa-regular fa-clock reservation-row__icon"></i>
                        <span>${start12} - ${end12}</span>
                    </div>
                    <div class="reservation-row__cell reservation-row__cell--notes">
                        <span class="reservation-row__notes-pill">${remarks}</span>
                    </div>
                    <div class="reservation-row__cell reservation-row__cell--status">
                        <span class="${status.badgeCls}">${mThis.escapeHtml(status.label)}</span>
                    </div>
                </div>
                <div class="reservation-row__action">
                    ${mThis.renderReservationAction(data)}
                </div>
            </div>`;
        });

        container.innerHTML = `
            <div class="reservation-list">
                <div class="reservation-list__header">
                    <div class="reservation-list__header-accent"></div>
                    <div class="reservation-list__header-grid">
                        <div class="reservation-list__header-cell reservation-list__header-cell--amenity">
                            <span class="reservation-list__header-en">Amenity</span>
                        </div>
                        <div class="reservation-list__header-cell reservation-list__header-cell--date">
                            <span class="reservation-list__header-en">Date</span>
                        </div>
                        <div class="reservation-list__header-cell reservation-list__header-cell--time">
                            <span class="reservation-list__header-en">Time Detail</span>
                        </div>
                        <div class="reservation-list__header-cell reservation-list__header-cell--notes">
                            <span class="reservation-list__header-en">Administrative Notes</span>
                        </div>
                        <div class="reservation-list__header-cell reservation-list__header-cell--status">
                            <span class="reservation-list__header-en">Status</span>
                        </div>
                    </div>
                    <div class="reservation-list__header-action"></div>
                </div>
                <div class="reservation-list__rows">
                    ${rowsHtml}
                </div>
            </div>`;
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        if (mThis.elBookingDateTo && !mThis.elBookingDateTo.value) {
            const today = new Date().toISOString().split("T")[0];
            mThis.elBookingDateTo.value = today;
        }

        mThis.ReservationListView = new ListView("_reservation_list", {
            fetchApi: `${main_view.base_url}/tenant/reservation/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                mThis.renderReservationList(container, items);
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
        mThis.initDropdownMenus(mThis.pr_tbl);

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

    mThis.isActiveView = () =>
        !!(mThis.self && mThis.self.offsetParent !== null);
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
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_reservation_action",
            cssClass: "reservation-row__dropdown shadow-sm",
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

                menu.edit_reservation.style.display = "none";
                menu.cancel_reservation.style.display = "none";
                menu.delete_reservation.style.display = "none";

                if (status_id === 1) {
                    menu.cancel_reservation.style.display = "block";
                    menu.edit_reservation.style.display = "block";
                } else if (status_id === 3 || status_id === 4) {
                    menu.delete_reservation.style.display = "block";
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
        new VSDropdownMenu(menuOptions);
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
                context: "delete",
                confirmButtonText: "Cancel",
            },
            (confirmed) => {
                if (!confirmed) return;
                vsapi
                    .call(
                        `${main_view.base_url}/tenant/reservation/cancel`,
                        { id: id },
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Reservation cancelled.");
                            mThis.ReservationListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Cancel failed",
                            );
                        }
                    });
            },
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
                        `${main_view.base_url}/tenant/reservation/delete`,
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
                `${main_view.base_url}/tenant/reservation/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.reservation_statuses,
                    "id",
                    "reservation_status",
                    "",
                    "All Statuses",
                    "",
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
                            <!-- <input type="hidden" class="data-input" data-field="tenant_id"> -->
                            <!-- <div class="col-6">
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
                            </div> -->
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
                    // me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    //     type: "select",
                    //     prefetch: true,
                    //     query: {
                    //         from: "tenants",
                    //         select: ["id", "name", "phone_number"],
                    //         where: [["status_id", "=", 2]],
                    //         orderBy: [["id", "DESC"]],
                    //         limit: 50,
                    //         searchFields: {
                    //             name: "LIKE",
                    //             phone_number: "LIKE",
                    //         },
                    //     },
                    //     showColumnHeader: true,
                    //     columns: {
                    //         name: "Name",
                    //         phone_number: "Phone",
                    //     },
                    //     onSelect: (tenant) => {
                    //         me._selectedTenantId = tenant.id;

                    //         // Direct mapping from the search result
                    //         if (me.controls.phone_number) {
                    //             me.controls.phone_number.value =
                    //                 tenant.phone_number || "";
                    //         }
                    //     },
                    // });
                    // me.searchTenant.reset("");
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
                            "/tenant/reservation/form-options",
                        ].join(""),
                        params: (op) => {
                            return {
                                id: op.id,
                                tenant_id: op.tenant_id ?? null,
                            };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const details = data?.reservation_details || {};
                    const amenitySelect = me.divModal.querySelector(
                        '[data-field="amenity_id"]',
                    );
                    const applyAmenityData = (amenityId) => {
                        const amenities = Array.isArray(data?.amenities)
                            ? data.amenities
                            : [];
                        const selected = amenities.find(
                            (item) => String(item.id) === String(amenityId),
                        );
                        const codeInput = me.divModal.querySelector(
                            '[data-field="amenity_code"]',
                        );
                        if (codeInput)
                            codeInput.value = selected?.amenity_code ?? "";
                    };
                    if (
                        me.searchTenant &&
                        typeof me.searchTenant.reset === "function"
                    ) {
                        me.searchTenant.reset();
                    }

                    amenitySelect.onchange = (e) =>
                        applyAmenityData(e.target.value);
                    if (me.dataOptions.id > 0) {
                        // console.log(1221, data);
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
                            // op.id = me.dataOptions.id;
                            // if (
                            //     me._selectedTenantId != null &&
                            //     me._selectedTenantId !== undefined
                            // ) {
                            //     op.tenant_id = me._selectedTenantId;
                            // }

                            // op.tenant_id = me._selectedTenantId;
                            // op.id = me.dataOptions.id;
                            console.log(123, op);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/tenant/reservation/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        // me._selectedTenantId = null;
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

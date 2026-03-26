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
    mThis.elSearch = mThis.self.querySelector("#_search_reservation");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        // {
        //     transTitle: "titles.Amenity Category",
        //     className: "align-middle",
        //    data: (data) => {
        //         return `<span class="text-primary-custom">${data.amenity_category ?? ''}</span>`;
        //     }
        // },
        {
            transTitle: "titles.Amenity Info",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.amenity_name ?? ""}</span>
                        <small class="d-block text-muted">${data.amenity_code ?? ""}</small>`;
            },
        },
        // {
        //     transTitle: "titles.Building Info",
        //     className: "align-middle",
        //    data: (data) => {
        //         return `<span class="text-primary-custom">${data.building_name ?? ''}</span>
        //                 <small class="d-block text-muted">${data.floor_number ?? ''}</small>`;
        //     }
        // },
        {
            transTitle: "titles.Tenant Info",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.tenant_name ?? ""}</span>
                        <small class="d-block text-muted">${data.phone_number ?? ""}</small>`;
            },
        },
        {
            transTitle: "titles.Schedule Date",
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
                return `<span class="d-block text-prm-custom">${data.date ?? ""}</span>
                            <small class="text-muted">${start12} - ${end12}</small>`;
            },
        },
        // {
        //     transTitle: "titles.MAX Capacity",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="text-primary-custom">${data.amenity_capacity ?? ""}</span> <span class="text-muted">PAX/Room</span>`;
        //     },
        // },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? "__"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                // Standardize the status string
                const status = (data.status ?? "").toLowerCase();
                let cls =
                    "badge border border-secondary text-secondary bg-secondary-subtle";
                let icon = "fa-regular fa-calendar";
                let label = "Upcoming";

                if (status === "upcoming") {
                    cls ="badge border border-info text-info bg-info-subtle";
                    icon = "fa-regular fa-clock fa-spin";
                    label = "Upcoming";
                } else if (status === "in-progress") {
                    cls ="badge border border-warning text-warning bg-warning-subtle";
                    icon = "fa-solid fa-spinner fa-spin-pulse"; 
                    label = "In-Progress";
                } else if (status === "completed") {
                    cls ="badge border border-success text-success bg-success-subtle";
                    icon = "fa-regular fa-circle-check fa-beat-fade";
                    label = "Completed";
                }

                return `
                    <span class="${cls} px-3 py-2 d-inline-flex align-items-center gap-2"
                        style="min-width:120px"
                        data-status_id="${data.status_id}">
                        <i class="${icon}" style="font-size:13px;"></i>
                        <span>${label}</span>
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? "d-none" : "btn_leave_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

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

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
               
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Reservation"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_reservation",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_reservation",
                },
            ],

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = Number(container.dataset.statusid);

                if (menu.edit_reservation) {
                    // Hide if status is 2 or 3
                    const isBlocked = status_id === 2 || status_id === 3;
                    menu.edit_reservation.style.display = isBlocked ? "none" : "block";
                }

                if (menu.delete_reservation) {
                    // Hide only if status is 2
                    const isBlocked = status_id === 2;
                    menu.delete_reservation.style.display = isBlocked ? "none" : "block";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "edit_reservation": {
                        mThis.editReservation(id, menuLink);
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
            id: parseInt(id, 10),
            btn: menulink,
            onClose: () => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            },
        };

        console.log(33333, op);

        CreateReservationDialog.show(op);
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
                    d.reservation_statuses, "id", "reservation_status", "", "All Status", "",
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
        });
    };
    return mThis;
})();

const CreateReservationDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log("DEBUG 1: Opening Dialog with op:", op);

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                                <input name="tenant_id" class="d-none data-input form-control" data-field="tenant_id">
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input  name="tenant" class="data-input form-control" data-field="tenant_name" placeholder="Tenant Name"></input>
                                    <label style="color:#777777;padding-left:6px; display:none;">Tenant</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Phone Number</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="amenity_category" class="data-input form-control" data-field="category_id" placeholder="Amenity Category">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="amenity" class="data-input form-control" data-field="amenity_id" placeholder="Amenity Name">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input style="cursor: not-allowed;" type="text" class="data-input form-control" data-field="amenity_code" placeholder=" " readonly />
                                    <label style="color:#777777;padding-left:6px;" for="amenity">Amenity Code</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined " >
                                    <input style="cursor: not-allowed;" type="text" class="data-input form-control" data-field="amenity_capacity" placeholder=" " readonly />
                                    <label style="color:#777777;padding-left:6px;" for="amenity">Max Occupancy</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="start_date" required class="data-input form-control form_input" data-field="date" />
                                    <label style="color:#777777;padding-left:6px;">Start Date</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class=" material-input outlined">
                                    <input type="time" name="start_time" required class="data-input form-control form_input" data-field="start_time" />
                                    <label style="color:#777777;padding-left:6px;">Start Time</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class=" material-input outlined">
                                    <input type="time" name="end_time" required class="data-input form-control form_input" data-field="end_time" />
                                    <label style="color:#777777;padding-left:6px;">End Time</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label style="color:#777777;padding-left:6px;">Description</label>
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
                            searchFields: {
                                name: "LIKE",
                                phone_number: "LIKE",
                            },
                        },
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
                            } else {
                                console.error(
                                    "DEBUG ERROR: phone_number control not found!",
                                );
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
                        name: "category_id", 
                        data: "amenity_categories",
                        textField: "amenity_category",
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
                            return { id: op.id };
                        },
                    },
                },

                

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);

                    const details = data?.reservation_details || {};
                    console.log(12121, details);

                    const amenitySelect = me.divModal.querySelector(
                        '[data-field="amenity_id"]',
                    );
                    const categorySelect = me.divModal.querySelector(
                        '[data-field="category_id"]',
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
                        const capacityInput = me.divModal.querySelector(
                            '[data-field="amenity_capacity"]',
                        );

                        if (codeInput)
                            codeInput.value = selected?.amenity_code ?? "";
                        if (capacityInput)
                            capacityInput.value = selected?.max_capacity ?? "";
                    };

                    amenitySelect.onchange = (e) =>
                        applyAmenityData(e.target.value);

                    // Manual Force-Fill for Modify Mode
                    if (me.dataOptions.id > 0) {
                        setTimeout(() => {
                            if (details.category_id) {
                                categorySelect.value = details.category_id;
                            }
                            if (details.amenity_id) {
                                amenitySelect.value = details.amenity_id;
                                applyAmenityData(details.amenity_id);
                            }
                            $(categorySelect).trigger("change");
                            $(amenitySelect).trigger("change");
                        }, 500);
                    }

                    // if (details.tenant_name && me.searchTenant) {
                    //     me.searchTenant.reset(details.tenant_name);
                    //     me._selectedTenantId = details.tenant_id;
                    // }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            if (
                                me._selectedTenantId != null &&
                                me._selectedTenantId !== undefined
                            ) {
                                op.tenant_id = me._selectedTenantId;
                            }
                            op.date = op.start_date || op.date;
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
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Reservation has been updated successfully",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New reservation has been added successfully",
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

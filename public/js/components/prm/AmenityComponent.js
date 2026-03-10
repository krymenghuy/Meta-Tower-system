"use strict";

var AmenityComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Amenity Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_amenity_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAmenity");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_amenity");
    mThis.elFilter_status = mThis.self.querySelector("#_amenity_status");
    mThis.elSearch = mThis.self.querySelector("#_search_amenity");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.name ?? ""}</span>`,
        },

        {
            title: "Floor",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.floor ?? "-"}</span>`,
        },
        // {
        //     title: "Description",
        //     className: "align-middle",
        //     data: (data) => `
        //         <div class="text-primary-custom" style="width:150px;">
        //             <span class="text-wrap text-break" style="word-break:break-word;">${data.description ?? ''}</span>
        //         </div>`
        // },
        // {
        //     title: "Location",
        //     className: "align-middle",
        //     data: (data) => `
        //         <div class="text-primary-custom" style="width:150px;">
        //             <span class="text-wrap text-break" style="word-break:break-word;">${data.location_detail ?? '-'}</span>
        //         </div>`
        // },
        // {
        //     title: "Access Level",
        //     className: "align-middle",
        //     data: (data) => {
        //         const accessLabel = data.access_level ?? `${data.access_level}`;
        //         return `<span class="text-primary-custom">${accessLabel ?? ''}</span>`
        //     }

        // },
        {
            title: "Max Capacity",
            className: "align-middle text-center",
            data: (data) =>
                `<span class="text-primary-custom">${data.max_capacity ?? "-"}</span>`,
        },
        {
            title: "Requires Booking",
            className: "align-middle text-center",
            data: function (data) {
                const val = data.requires_booking ?? "";
                const isRequired = val == 1;

                return isRequired
                    ? '<span class="badge bg-warning-subtle text-dark">Required</span>'
                    : '<span class="badge bg-secondary text-dark">Not Required</span>';
            },
        },
        {
            title: "Available",
            className: "align-middle text-center",
            data: function (data) {
                const val = data.is_available ?? 0;
                const isYes = val == 1;

                return isYes
                    ? '<span class="badge text-warning bg-info-subtle text-dark">Available</span>'
                    : '<span class="badge text-warning bg-danger-subtle text-dark">Unavailable</span>';
            },
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls = "text-info";

                if (status == "inactive") {
                    cls =
                        "text-white px-3 py-1 rounded-3 bg-danger d-inline-block";
                } else if (status == "active") {
                    cls =
                        "text-white px-3 py-1 rounded-3 bg-success d-inline-block";
                } else if (status == "under maintenance") {
                    cls =
                        "text-white px-3 py-1 rounded-3 bg-warning d-inline-block";
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ""}</small></span>`;
            },
        },
        {
            title: "Updated By",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold">${data.update_user ?? ""}</span>
                    <span class="text-muted">${data.updated_at ?? ""}</span>
                </div>`,
        },
        {
            title: "Action",
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

        mThis.AmenityListView = new ListView("_amenity_list", {
            fetchApi: `${main_view.base_url}/prm/amenity/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("amenity");
                tr.setAttribute("id", `amenity_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () =>
                    mThis.AmenityListView.showPage(mThis.getFilterData()),
            };
            AmenityDialog.show(op);
        };

        // Table container height
        mThis.pr_tbl = mThis.AmenityListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = `${window.innerHeight - 200}px`;
        sh_parent.classList.add("overflow-y-auto", "overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.maxHeight = `${window.innerHeight - 200}px`;
        };

        mThis.tblAmenity = mThis.AmenityListView.getTable();
        mThis.initDropdownMenus(mThis.tblAmenity);

        // Filter listeners
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.AmenityListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.AmenityListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status?.value,
            access_level: mThis.elFilter_access_level?.value,
            requires_booking: mThis.elFilter_requires_booking?.value,
            is_available: mThis.elFilter_is_available?.value,
            search_value: mThis.elSearch?.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2"  vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_status",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_amenity",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_amenity",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "edit_amenity": {
                        mThis.editAmenity(id, menuLink);
                        break;
                    }
                    case "delete_amenity": {
                        mThis.deleteAmenity(id, menuLink);
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

    mThis.editAmenity = (id, menuLink) => {
        const op = {
            id,
            btn: menuLink,
            onClose: () =>
                mThis.AmenityListView.showPage(mThis.getFilterData()),
        };
        AmenityDialog.show(op);
    };

    mThis.deleteAmenity = (id, menuLink) => {
        const op = {
            id,
            btn: menuLink,
            onClose: () =>
                mThis.AmenityListView.showPage(mThis.getFilterData()),
        };

        cv_interact.confirm(
            "Delete this Amenity?",
            {
                title: "Delete Amenity",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (confirmed) => {
                if (confirmed) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/amenity/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success(
                                    "Amenity deleted successfully",
                                );
                                mThis.AmenityListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message ||
                                        "Failed to delete amenity",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";

        const inputOptions = {
            context: "success",
            title: "Change Status",
            label: "Amenity Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: "Save",
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
                { status_id: "3", name: "Under Maintenance" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(
                        `${mThis.base_url}/prm/amenity/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success(
                                "Amenity status has been updated",
                            );
                            mThis.AmenityListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(
                                res.error_message || "Unable to update status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/amenity/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.amenity_statuses,
                    "id",
                    "name",
                    true,
                    "Statuses",
                );
                // VSUtil.setComboItems(mThis.elFilter_type, d.service_types, 'id', 'service_type', true, 'All Services type', null);
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.AmenityListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const AmenityDialog = (() => {
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
                        `
                    <div class="row g-3">
                        <div class="col-12">
                            <label style="padding-left:6px;">Amenity Name</label>
                            <div class="material-input outlined">
                                <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                            </div>
                        </div>
                       
                        <div class="col-6">
                            <label style="padding-left:6px;">Floor</label>
                            <div class="material-input outlined">
                                <input type="text" name="floor" required class="data-input form-control" data-field="floor" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="padding-left:6px;">Location Detail</label>
                            <div class="material-input outlined">
                                <input type="text" name="location" required class="data-input form-control" data-field="location_detail" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="padding-left:6px;">Description</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for="access_level">Access Level</label>
                            <div class="material-input outlined">
                                <select name ="access_level" class="data-input form-control" data-field="access_level" placeholder=" ">
                                    <option value="All Tenants">All Tenants</option>
                                    <option value="Management Only">Management Only</option>
                                    <option value="Staff Only">Staff Only</option>
                                    <option value="Admin Only">Admin Only</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;">Max Capacity</label>
                            <div class="material-input outlined">
                                <input type="number" name="capacity" required class="data-input form-control" data-field="max_capacity" min="0" value="0 " placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for ="requires_booking">Requires Booking</label>
                            <div class="material-input outlined">
                                <select name="requirebooking" class="data-input form-control" data-field="requires_booking" placeholder=" ">
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>    
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for="is_available">Available</label>
                            <div class="material-input outlined">
                                <select name="available" class="data-input form-control" data-field="is_available" placeholder=" ">
                                    <option value="1">Available</option>
                                    <option value="0">Unavailable</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="d-none material-input outlined">
                                <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                <label>Status ID</label>
                            </div>
                        </div>
                    </div>`,
                    ].join("");
                },

                contentCreated: (me) => {},
                configSelect: [
                    {
                        name: "amenity_id",
                        data: "amenities",
                        textField: "amenity",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Create Amenity",
                    modifyTitle: "Modify Amenity",
                    targetProp: "amenity_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/amenity/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    // console.log(11,data);
                    const header = me.divModal.querySelector(".modal-header");
                    const btnClose = header.querySelector(
                        "button[data-bs-dismiss]",
                    );
                    if (btnClose) btnClose.classList.add("d-none");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            let payload = me.getData() || {};

                            const modal = me.divModal || document;

                            // Collect text, number, and textarea fields
                            modal
                                .querySelectorAll(
                                    "input[data-field], textarea[data-field]",
                                )
                                .forEach((el) => {
                                    let val = el.value.trim();
                                    if (el.type === "number")
                                        val = Number(val) || 0;
                                    payload[el.dataset.field] = val;
                                });

                            // Collect all select fields (fixes requires_booking & is_available)
                            modal
                                .querySelectorAll("select[data-field]")
                                .forEach((el) => {
                                    payload[el.dataset.field] = el.value;
                                });

                            // Ensure correct numeric types
                            payload.requires_booking = Number(
                                payload.requires_booking ?? 0,
                            );
                            payload.is_available = Number(
                                payload.is_available ?? 1,
                            );
                            payload.max_capacity = Number(
                                payload.max_capacity ?? 0,
                            );

                            // Preserve ID for updates
                            if (me.dataOptions?.id) {
                                payload.id = me.dataOptions.id;
                            }

                            // Optional debug (remove in production if not needed)
                            console.log("Final payload being sent:", payload);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/amenity/save",
                                    ].join(""),
                                    payload,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, payload);
                                        const msg = payload.id
                                            ? "Amenity updated successfully"
                                            : "New amenity added successfully";
                                        cv_interact.success(msg);
                                        if (me.dataOptions?.onClose)
                                            me.dataOptions.onClose();
                                    } else {
                                        cv_interact.error(
                                            res.error_message ||
                                                "Failed to save amenity",
                                        );
                                    }
                                })
                                .catch((err) => {
                                    console.error("Save request failed:", err);
                                    cv_interact.error("Network/server error");
                                });
                        },
                    },
                ],
            });

        dialog.show(op);
    };

    return self;
})();

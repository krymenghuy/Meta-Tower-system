"use strict";

var AmenityComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Amenity Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_amenity_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAmenity");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_amenity");
    mThis.elBuilding = mThis.self.querySelector("#building_id");
    mThis.elFloor = mThis.self.querySelector("#floor_id");
    mThis.elFilter_category = mThis.self.querySelector("#amenity_category_id");
    mThis.elFilter_status = mThis.self.querySelector("#_amenity_status");
    mThis.elSearch = mThis.self.querySelector("#_search_amenity");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-nowrap text-capitalize",
        },
        {
            transTitle: "titles.Code",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-prm-custom">${data.code ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<div class="text-prm-custom text-capitalize" style="width:170px; ">
                    <span class="text-wrap text-break" style ="word-break:break-word;">${data.name ?? "_"}</span>
                </div>`,
        },
        {
            transTitle: "titles.Category",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-nowrap" style="min-width:100px">${data.category ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Building",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<div class="text-prm-custom">
                    <span>${data.building_name ?? "_"}</span>
                </div>`,
        },
        {
            transTitle: "titles.Floor",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<div class="text-prm-custom">
                    <span>${data.floor_number ?? "_"}</span>
                </div>`,
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <small class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? "_"}</small>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Capacity",
            className: "align-middle text-nowrap",
            data: (data) =>
                data.max_capacity != null
                    ? `<span class="text-prm-custom">${data.max_capacity}</span> <small class="text-muted">PAX/Room</small>`
                    : `<span class="text-prm-custom">_</span>`,
        },
        {
            transTitle: "titles.Bookable",
            className: "align-middle text-nowrap text-center",
            data: function (data) {
                const val = data.requires_booking ?? "";
                const isRequired = val == 1;

                return isRequired
                    ? '<span class=" text-prm-custom"><i class="fa-regular fa-circle-check text-success"></i> Yes</span>'
                    : '<span class=" text-prm-custom"><i class="fa-regular fa-circle-xmark text-danger"></i> No</span>';
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls = " text-info ";

                if (status == "inactive") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                } else if (status == "active") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status == "maintenance") {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                }

                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ""}
                    </span> `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-nowrap",
            data: (data) => {
                return `<div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_amenity_action" data-id="${data.id}" data-statusid="${data.status_id}" data-isreserved="${data.is_reserved}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                       <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`;
            },
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
                tr.dataset.buildingid = data.building_id ?? "";
                tr.dataset.floorid = data.floor_id ?? "";
                tr.dataset.isreserved = data.is_reserved ?? "";
                tr.classList.add("amenity");
                tr.setAttribute("id", `amenity_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            const op = {
                id: null,
                // data: {
                //     amenity_category_id: btn.dataset.categoryid,
                //     amenity_name: btn.dataset.name,
                //     code: btn.dataset.amenitycode,
                //     max_capacity: btn.dataset.capacity,
                //     building_id: btn.dataset.buildingid,
                //     floor_id: btn.dataset.floorid
                // },
                btn: e.target,
                onClose: () =>
                    mThis.AmenityListView.showPage(mThis.getFilterData()),
            };
            if (!AuthManager.allowed(243)) return;
            AmenityDialog.show(op);
        };

        // Table container height
        mThis.pr_tbl = mThis.AmenityListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = `${window.innerHeight - 200}px`;
        sh_parent.classList.add("overflow-y-auto");

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
            status_id: mThis.elFilter_status.value,
            category_id: mThis.elFilter_category.value,
            search_value: mThis.elSearch.value,
            building_id: mThis.elBuilding.value,
            floor_id: mThis.elFloor.value,
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
            actionButtonClass: "btn_amenity_action",
            cssClass: "bg-white shadow",
            menus: [
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
                {
                    html: '<span class="ps-2" vslang="titles.Maintenance">Maintenance</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5 text-warning-emphasis"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_maintenance",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Finish">Finish</span>',
                    icon: '<i class="fa-solid fa-clipboard-check fs-5 text-success"></i>',
                    cssClass: "border-bottom pb-2",
                    name: "finish_maintenance",
                },
                {
                    html: '<span class="ps-2"  vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_status",
                },
                {
                    html: '<span class="ps-2"  vslang="titles.View Reservation">View Reservation</span>',
                    icon: `<i class="fa-regular fa-eye fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_reservation",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                const status_id = container.dataset.statusid;
                // menu.create_booking.style.display = (!isMaintenance && status_id === 1) ? 'block' : 'none';
                // menu.create_contract.style.display = (!isMaintenance && (status_id === 1 || status_id === 2)) ? 'block' : 'none';
                // menu.edit_space.style.display = (!isMaintenance && status_id === 1) ? 'block' : 'none';
                menu.finish_maintenance.style.display =
                    status_id == 3 ? "block" : "none";
                menu.set_maintenance.style.display =
                    status_id != 3 ? "block" : "none";
                menu.change_status.style.display =
                    status_id != 3 ? "block" : "none";
                menu.view_reservation.style.display = "block";
                // menu.set_maintenance.style.display = (!isMaintenance && status_id === 3) ? 'block' : 'none';
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_reservation": {
                        mThis.viewReservation(id, menuLink);
                        break;
                    }
                    case "change_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "set_maintenance": {
                        mThis.setMaintenance(id, menuLink);
                        break;
                    }
                    case "finish_maintenance": {
                        mThis.finishMaintenance(id, menuLink);
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
        const tr = menuLink?.closest("tr");
        const buildingId = tr?.dataset?.buildingid || null;
        const floorId = tr?.dataset?.floorid || null;
        const isReserved = tr?.dataset?.isreserved || null;
        let op = {
            id: id,
            data: {
                building_id: buildingId,
                floor_id: floorId,
            },
            btn: menuLink,
            onClose: () =>
                mThis.AmenityListView.showPage(mThis.getFilterData()),
        };
        if (!AuthManager.allowed(244)) return;
        AmenityDialog.show(op);
    };

    mThis.setMaintenance = async (id, menuLink) => {
        const tr = menuLink?.closest("tr");
        const buildingId = tr?.dataset?.buildingid || null;
        if (!AuthManager.allowed(213, false)) return;

        const op = {
            amenity_id: id,
            building_id: buildingId || null,
            btn: menuLink,
            onClose: () =>
                mThis.AmenityListView.showPage(mThis.getFilterData()),
        };
        const ok = await mThis.checkActiveReservation(op.amenity_id);
        if (!ok) return;
        CreateMaintenanceDialog.show(op);
    };

    mThis.finishMaintenance = (id, menuLink) => {
        if (!AuthManager.allowed(216, false)) return;
        cv_interact.confirm(
            "confirm_finish",
            {
                transTitle: "Finish Maintenance",
                context: "confirm",
                confirmButtonText: "Finish",
            },
            (e) => {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/maintenance/finish-by-amenity`,
                            { amenity_id: id },
                            menuLink,
                            null,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("maintenance_finished");
                                mThis.AmenityListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message || "Failed",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.deleteAmenity = (id, menuLink) => {
        const op = {
            id,
            btn: menuLink,
            onClose: () =>
                mThis.AmenityListView.showPage(mThis.getFilterData()),
        };
        if (!AuthManager.allowed(245)) return;
        cv_interact.confirm(
            "confirm_delete",
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
                                cv_interact.success("delete_success_amenity");
                                mThis.AmenityListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.changeStatus = (id, link) => {
        if (!AuthManager.allowed(246)) return;

        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";

        const inputOptions = {
            context: "success",
            title: `${LocaleManager.trans("Change Status", "titles")}`,
            label: "Amenity Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: `${LocaleManager.trans("Save", "buttons")}`,
            cancelButtonText: `${LocaleManager.trans("Close", "buttons")}`,
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
                // { status_id: "3", name: "Maintenance" },
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
                            cv_interact.success("update_success_status");
                            mThis.AmenityListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(
                                res.error_message || "update_failed_status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };
    mThis.checkActiveReservation = async (amenity_id) => {
        const res = await vsapi.call(
            `${main_view.base_url}/prm/amenity/check-amenity-reservation`,
            { amenity_id },
            null,
            null,
        );
        if (res.status_code == 200) {
            return true;
        }
        cv_interact.error(res.error_message);
        return false;
    };

    mThis.viewReservation = (id, menuLink) => {
        const tr = menuLink?.closest("tr");
        if (!AuthManager.allowed(247)) return;
        ActiveReservationDialog.show({
            amenity_id: id,
            amenity_name:
                tr?.querySelector(".text-prm-custom")?.innerText || "",
            btn: menuLink,
        });
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
                    "amenity_status",
                    "",
                    LocaleManager.trans("All Statuses", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elBuilding,
                    d.buildings,
                    "id",
                    "building",
                    "",
                    LocaleManager.trans("All buildings", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFloor,
                    d.floors,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Floors", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_category,
                    d.amenity_categories,
                    "id",
                    "amenity_category",
                    "",
                    LocaleManager.trans("All Categories", "titles"),
                    "",
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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,

                createContent: () => {
                    return [
                        `<div class="row g-3">
                        <div class="col-12">
                            <div class="vs-material-field">
                                <input type="text" name="amenity" required class="data-input form-control" data-field="name" placeholder=" " />
                                <label vslang="labels.Name"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="building_id" class="data-input form-control" data-field="building_id" placeholder="${LocaleManager.trans('Building', 'labels')}">
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="floor_id" class="data-input form-control" data-field="floor_id" placeholder="${LocaleManager.trans('Floor Number', 'labels')}">
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="code" class="data-input form-control" data-field="code" placeholder=" " />
                                <label vslang="labels.Code (Optional)"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" type="text" name="category_id"  class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'labels')}" >
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="requires_booking" class="data-input form-control" data-field="requires_booking" placeholder="${LocaleManager.trans('Bookable', 'labels')}">
                                <option value="0" >No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="capacity" required class="data-input form-control" data-field="max_capacity" min="0" value="0 " placeholder=" " />
                                <label vslang="labels.Capacity"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                <label vslang="labels.Remark">Remark</label>
                            </div>
                        </div>
                    </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    const capacity =
                        me.divModal.querySelector('[name="capacity"]');
                    if (capacity) {
                        capacity.addEventListener("input", function () {
                            let start = this.selectionStart;
                            let v = this.value.replace(/[^0-9]/g, "");
                            v = v.replace(/^0+/, "");
                            if (v === "") {
                                v = "";
                            }
                            if (v.length > 3) {
                                v = v.slice(0, 3);
                            }
                            this.value = v;
                            this.setSelectionRange(start, start);
                        });
                    }
                },
                configSelect: [
                    {
                        name: "amenity_categories",
                        data: "amenity_categories",
                        textField: "amenity_category",
                        valueField: "id",
                    },
                    {
                        name: "amenity_statuses",
                        data: "amenity_statuses",
                        textField: "amenity_status",
                        valueField: "id",
                    },
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
                                    let building_id =
                                        me.controls.building_id.value;
                                    return {
                                        building_id: building_id,
                                    };
                                },
                            },
                        },
                    },
                    {
                        name: "category_id",
                        data: "amenity_categories",
                        textField: "amenity_category",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Amenity",
                    modifyTitle: "vslang:titles.Modify Amenity",
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
                    const isReadOnly = me.dataOptions.id > 0;
                    me.setReadOnly(isReadOnly, ["building_id", "floor_id"]);
                    me.controls.requires_booking.value =
                        data.amenity_details.requires_booking;
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
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            // console.log(123456,op);

                            op.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/amenity/save",
                                    ].join(""),
                                    op,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_amenity",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success_amenity",
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

const ActiveReservationDialog = (() => {
    const self = {};

    const statusBadge = (status_id, status) => {
        const map = {
            1: "border-info text-info bg-info-subtle",
            2: "border-warning text-warning bg-warning-subtle",
        };
        const cls =
            map[status_id] ||
            "border-secondary text-secondary bg-secondary-subtle";
        return `<span class="badge border ${cls} px-2 py-1 text-capitalize">${status ?? ""}</span>`;
    };

    const to12h = (hhmm) => {
        if (!hhmm) return "";
        const [h, m] = String(hhmm).trim().split(":").map(Number);
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    };

    const renderRows = (tbody, rows) => {
        if (!rows || rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-4">
            ${LocaleManager.trans("No data to display", "titles")}
        </td>
                </tr>`;
            return;
        }
        tbody.innerHTML = rows
            .map(
                (r) => `
            <tr>
                <td class="align-middle">
                    <span class="d-block text-prm-custom text-nowrap text-capitalize">${r.tenant_name ?? ""}</span>
                    <small class="text-muted text-nowrap">${r.phone_number ?? ""}</small>
                </td>
                <td class="align-middle">
                    <span class="d-block text-prm-custom text-nowrap">${r.booking_date ?? ""}</span>
                    <small class="text-primary text-nowrap">${to12h(r.start_time)} – ${to12h(r.end_time)}</span>
                </td>
                <td class="align-middle" style="min-width:70px">${statusBadge(r.status_id, r.status)}</td>
                <td class="align-middle">
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${r.remarks ?? "_"}</span>
                    </div>
                </td>
            </tr>
        `,
            )
            .join("");
    };

    self.show = ({ amenity_id, amenity_name, btn }) => {
        InputBox.resetInstance("activeReservationView");

        InputBox.show({
            title: `${LocaleManager.trans("Reservation Details", "titles")}`,
            instanceKey: "activeReservationView",
            context: "info",
            size: "md",
            confirmButtonText: null,
            showconfirmButtonText: false,
            cancelButtonText: `${LocaleManager.trans("Close", "buttons")}`,

            createContent() {
                const div = document.createElement("div");
                div.innerHTML = `
                    <div class="d-flex align-items-center mb-3">
                        <span class="badge text-primary border border-primary bg-primary-subtle px-3 py-1 fs-6">
                            ${amenity_name || `Amenity #${amenity_id}`}
                        </span>
                        <div style="flex:1; height:1px; background:#e0e0e0; margin-left:10px;"></div>
                    </div>

                    <div id="_arv_loader" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary"></div>
                        <span class="ms-2 text-muted small">Loading...</span>
                    </div>

                    <div id="_arv_table_wrap" class="d-none align-item-center">
                        <table class="table table-sm table--white rounded-2 overflow-hidden">
                            <thead class="header-uppercase" >
                                <tr>
                                    <th class="text-start" style="width:100px;" vslang="titles.Tenant"></th>
                                    <th class="text-start" style="width: 150px;" vslang="titles.Schedule Date"></th>
                                    <th class="text-center" style="width:80px;" vslang="titles.Status"></th>
                                    <th class="text-start" style="width:160px;" vslang="titles.Remark"></th>
                                </tr>
                            </thead>
                            <tbody id="_arv_tbody"></tbody>
                        </table>
                    </div>
                `;
                LocaleManager.translateZone(div);
                return div;
            },

            onOpen(ibMe) {
                const divInputboxCard = InputBox._store
                    .get("activeReservationView")
                    .container.closest(".inputbox-card");
                const btnOk = divInputboxCard.querySelector(".inputbox-btn.ok");
                btnOk.classList.add("d-none");

                // restore btnOk on any close action so next dialog isn't affected
                const restore = () => btnOk.classList.remove("d-none");
                divInputboxCard.addEventListener("click", function handler(e) {
                    const isClose = e.target.closest(
                        ".inputbox-btn.cancel, .inputbox-close, .btn-close, [data-dismiss]",
                    );
                    if (isClose) {
                        restore();
                        divInputboxCard.removeEventListener("click", handler);
                    }
                });

                const loader = document.getElementById("_arv_loader");
                const tableWrap = document.getElementById("_arv_table_wrap");
                const tbody = document.getElementById("_arv_tbody");

                vsapi
                    .call(
                        `${main_view.base_url}/prm/reservation/list-paginate`,
                        { amenity_id, per_page: 50 },
                        null,
                        null,
                    )
                    .then((res) => {
                        loader.classList.add("d-none");
                        tableWrap.classList.remove("d-none");

                        const allRows = Array.isArray(res.data)
                            ? res.data
                            : (res.data?.data ?? []);

                        const rows = allRows.filter(
                            (r) => r.status_id == 1 || r.status_id == 2,
                        );
                        renderRows(tbody, rows);
                    })
                    .catch(() => {
                        loader.classList.add("d-none");
                        tableWrap.classList.remove("d-none");
                        tbody.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center text-danger py-3">
                                Failed to load reservations.
                            </td>
                        </tr>`;
                    });
            },
        });
    };

    return self;
})();

"use strict";
var MaintenanceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Maintenance";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_maintenance_component");
    mThis.btnAdd = mThis.self.querySelector("#_btn_maintenance");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_maintenance");
    mThis.elFilter_building = mThis.self.querySelector('#_maintenance_building_id');
    mThis.elFilter_status = mThis.self.querySelector('#_maintenance_status_id');
    mThis.elFilter_type = mThis.self.querySelector('#_maintenance_type_id');
    mThis.elSearch = mThis.self.querySelector("#_search_maintenance");

    mThis.cols = [
        { title: "", className: "align-middle" },
        {
            transTitle: "titles.Building",
            className: "align-middle",
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.building_name ?? ""}</span>`
        },
        {
            transTitle: "titles.Type unit",
            className: "align-middle text-center",
            data: (data) => {
                const space = data.space_id && data.space_code ? data.space_code : null;
                const amenityCode = data.amenity_id ? (data.amenity_code || data.amenity_name || "") : null;
                if (space) return `<div class="d-flex flex-column align-items-center"><span class="text-nowrap">${space}</span><span class="text-muted small">Space</span></div>`;
                if (amenityCode) return `<div class="d-flex flex-column align-items-center"><span class="text-nowrap">${amenityCode}</span><span class="text-muted small">Amenity</span></div>`;
                return `<span class="text-nowrap">—</span>`;
            }
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle text-center",
            data: (data) => {
                const val = data.start_date;
                if (!val) return "<span class=\"text-nowrap\">—</span>";
                const s = String(val).trim().split(/\s+/);
                const datePart = s[0] || "";
                const timePart = (s[1] || "00:00").substring(0, 5);
                const parsed = new Date(datePart + (s[1] ? " " + s[1] : ""));
                let dateStr = datePart;
                if (!isNaN(parsed.getTime())) {
                    dateStr = parsed.getFullYear() + "-" + String(parsed.getMonth() + 1).padStart(2, "0") + "-" + String(parsed.getDate()).padStart(2, "0");
                }
                return `<div class="d-flex flex-column align-items-center"><span class="text-nowrap">${dateStr}</span><span class="text-muted small">${timePart}</span></div>`;
            }
        },
        {
            transTitle: "titles.End Date",
            className: "align-middle text-center",
            data: (data) => {
                const val = data.end_date;
                if (!val) return "<span class=\"text-nowrap\">—</span>";
                const s = String(val).trim().split(/\s+/);
                const datePart = s[0] || "";
                const timePart = (s[1] || "00:00").substring(0, 5);
                const parsed = new Date(datePart + (s[1] ? " " + s[1] : ""));
                let dateStr = datePart;
                if (!isNaN(parsed.getTime())) {
                    dateStr = parsed.getFullYear() + "-" + String(parsed.getMonth() + 1).padStart(2, "0") + "-" + String(parsed.getDate()).padStart(2, "0");
                }
                return `<div class="d-flex flex-column align-items-center"><span class="text-nowrap">${dateStr}</span><span class="text-muted small">${timePart}</span></div>`;
            }
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = parseInt(data.status_id, 10);
                if (statusId === 3) {
                    return `<span class="badge bg-success-subtle text-success">Completed</span>`;
                }
                if (statusId === 4) {
                    return `<span class="badge bg-secondary-subtle text-secondary">Cancelled</span>`;
                }
                const now = new Date();
                const startStr = (data.start_date || "").toString().trim();
                const endStr = (data.end_date || "").toString().trim();
                let displayStatus = data.status_name ?? "";
                let cls = "badge bg-warning-subtle text-warning";
                if (startStr && endStr) {
                    const startDt = new Date(startStr.replace(/\s+/g, " "));
                    const endDt = new Date(endStr.replace(/\s+/g, " "));
                    if (!isNaN(startDt.getTime()) && !isNaN(endDt.getTime())) {
                        const sameDay = startDt.getFullYear() === endDt.getFullYear() &&
                            startDt.getMonth() === endDt.getMonth() &&
                            startDt.getDate() === endDt.getDate();
                        if (sameDay) {
                            if (now < startDt) {
                                displayStatus = "Pending";
                                cls = "badge bg-warning-subtle text-warning";
                            } else if (now > endDt) {
                                displayStatus = "Completed";
                                cls = "badge bg-success-subtle text-success";
                            } else {
                                displayStatus = "In Progress";
                                cls = "badge bg-info-subtle text-info";
                            }
                        } else {
                            if (now >= endDt) {
                                displayStatus = "Completed";
                                cls = "badge bg-success-subtle text-success";
                            } else if (now >= startDt && now < endDt) {
                                displayStatus = "In Progress";
                                cls = "badge bg-info-subtle text-info";
                            } else {
                                displayStatus = "Pending";
                                cls = "badge bg-warning-subtle text-warning";
                            }
                        }
                    }
                }
                if (displayStatus && cls === "badge bg-warning-subtle text-warning") {
                    const s = displayStatus.toLowerCase();
                    if (s === "completed") cls = "badge bg-success-subtle text-success";
                    else if (s === "in progress") cls = "badge bg-info-subtle text-info";
                    else if (s === "cancelled") cls = "badge bg-secondary-subtle text-secondary";
                }
                return `<span class="badge ${cls}">${displayStatus || "—"}</span>`;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => `<div class="d-flex flex-column"><span class="text-capitalize text-prm-custom fw-semibold">${data.update_user ?? ""}</span><span class="text-muted small">${data.updated_at ?? ""}</span></div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_maintenance_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MaintenanceListView = new ListView("_maintenance_list", {
            fetchApi: `${main_view.base_url}/prm/maintenance/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.setAttribute("id", "maintenance_id_" + data.id);
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            CreateMaintenanceDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.MaintenanceListView.showPage(mThis.getFilterData());
                }
            });
        };

        const pr_tbl = mThis.MaintenanceListView.getListContainer();
        const sh_parent = pr_tbl.parentElement;
        if (sh_parent) {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
            sh_parent.classList.add("overflow-y-auto");
        }
        window.addEventListener("resize", () => {
            if (sh_parent) sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        });
        mThis.tblMaintenance = mThis.MaintenanceListView.getTable();
        mThis.initDropdownMenus(mThis.tblMaintenance);

        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            el.onchange = () => mThis.MaintenanceListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.MaintenanceListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const p = {
            search_value: mThis.elSearch.value
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            const f = el.dataset.field;
            if (f) p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_maintenance_action",
            cssClass: "bg-white shadow",
            menus: [
                { html: '<span class="ps-2" vslang="titles.Modify"></span>', icon: '<i class="fa-regular fa-edit fs-5 text-warning"></i>', cssClass: "border-bottom pb-2", name: "modify" },
                { html: '<span class="ps-2" vslang="titles.Finish Maintenance"></span>', icon: '<i class="fa-solid fa-flag-checkered fs-5 text-success"></i>', cssClass: "border-bottom pb-2", name: "finish_maintenance" },
                { html: '<span class="ps-2" vslang="titles.Cancel Maintenance"></span>', icon: '<i class="fa-solid fa-times-circle fs-5 text-secondary"></i>', cssClass: "border-bottom pb-2", name: "cancel_maintenance" },
                { html: '<span class="ps-2" vslang="titles.Delete"></span>', icon: '<i class="fa-regular fa-trash-can fs-5 text-danger"></i>', cssClass: "border-bottom pb-2", name: "delete" }
            ],
            onClick: (menuLink, id, name) => {
                if (name === "modify") {
                    CreateMaintenanceDialog.show({
                        id: parseInt(id, 10),
                        btn: menuLink,
                        onClose: () => mThis.MaintenanceListView.showPage(mThis.getFilterData())
                    });
                } else if (name === "finish_maintenance") {
                    cv_interact.confirm("Mark this maintenance as finished (Completed)?", { transTitle: "Finish Maintenance", context: "confirm", confirmButtonText: "Finish" }, (e) => {
                        if (e) {
                            vsapi.call(`${main_view.base_url}/prm/maintenance/set-status`, { id: id, status_id: 3 }, menuLink, null).then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success("Maintenance finished.");
                                    mThis.MaintenanceListView.showPage(mThis.getFilterData());
                                } else {
                                    cv_interact.error(res.error_message || "Failed");
                                }
                            });
                        }
                    });
                } else if (name === "cancel_maintenance") {
                    cv_interact.confirm("Cancel this maintenance?", { transTitle: "Cancel Maintenance", context: "confirm", confirmButtonText: "Cancel" }, (e) => {
                        if (e) {
                            vsapi.call(`${main_view.base_url}/prm/maintenance/set-status`, { id: id, status_id: 4 }, menuLink, null).then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success("Maintenance cancelled.");
                                    mThis.MaintenanceListView.showPage(mThis.getFilterData());
                                } else {
                                    cv_interact.error(res.error_message || "Failed");
                                }
                            });
                        }
                    });
                } else if (name === "delete") {
                    cv_interact.confirm("Delete this maintenance record?", { transTitle: "Delete Maintenance", context: "delete", confirmButtonText: "Delete" }, (e) => {
                        if (e) {
                            vsapi.call(`${main_view.base_url}/prm/maintenance/delete`, { id: id }, false, false, false).then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success("Deleted");
                                    mThis.MaintenanceListView.showPage(mThis.getFilterData());
                                } else {
                                    cv_interact.error(res.error_message || "Delete failed");
                                }
                            });
                        }
                    });
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/maintenance/form-options`, null, null, null)
            .then(res => {
                if (res.status_code === 200) {
                    const d = res.data || {};
                    VSUtil.setComboItems(mThis.elFilter_building, d.buildings || [], "id", "building", true, "All Building", null);
                    VSUtil.setComboItems(mThis.elFilter_status, d.maintenance_statuses || [], "id", "maintenance_status", true, "All Status", null);
                    VSUtil.setComboItems(mThis.elFilter_type, d.maintenance_types || [], "id", "maintenance_type", true, "All Type", null);
                }
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.MaintenanceListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const CreateMaintenanceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-md vs-modal vs-modal--compact",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div class="maintenance-form-sections py-1">
                    <section class="maintenance-form-section border rounded-2 p-2 mb-2 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-2 d-flex align-items-center gap-1"><i class="fas fa-map-marker-alt"></i> Location & unit</h6>
                        <div class="row g-2">
                            <div class="col-12 col-sm-6">
                                <label class="form-label small mb-0">Building <span class="text-danger">*</span></label>
                                <select name="building_id" class="data-input form-control form-control-sm" data-field="building_id" required><option value="">Select building</option></select>
                            </div>
                            <div class="col-12 col-sm-6">
                                <label class="form-label small mb-0">Type unit <span class="text-danger">*</span></label>
                                <select name="type_unit" class="data-input form-control form-control-sm" data-field="type_unit" id="_maintenance_type_unit" required><option value="">Select type</option><option value="space">Space</option><option value="amenity">Amenity</option></select>
                            </div>
                            <div id="_maintenance_unit_space_row" class="col-12 col-sm-6" style="display:none;">
                                <label class="form-label small mb-0">Space</label>
                                <select name="space_id" class="data-input form-control form-control-sm" data-field="space_id"><option value="">Select space</option></select>
                            </div>
                            <div id="_maintenance_unit_amenity_row" class="col-12 col-sm-6" style="display:none;">
                                <label class="form-label small mb-0">Amenity</label>
                                <select name="amenity_id" class="data-input form-control form-control-sm" data-field="amenity_id"><option value="">Select amenity</option></select>
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-2 mb-2 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-2 d-flex align-items-center gap-1"><i class="fas fa-calendar-alt"></i> Time stamp</h6>
                        <div class="row g-2">
                            <div class="col-6 col-md-3">
                                <label class="form-label small mb-0">Start date</label>
                                <input type="text" data-type="date" name="start_date" class="form-control form-control-sm data-input" data-field="start_date" placeholder="dd-MM-yyyy">
                            </div>
                            <div class="col-6 col-md-3">
                                <label class="form-label small mb-0">Start time</label>
                                <input type="time" name="start_time" class="form-control form-control-sm data-input" data-field="start_time" value="00:00">
                            </div>
                            <div class="col-6 col-md-3">
                                <label class="form-label small mb-0">End date</label>
                                <input type="text" data-type="date" name="end_date" class="form-control form-control-sm data-input" data-field="end_date" placeholder="dd-MM-yyyy">
                            </div>
                            <div class="col-6 col-md-3">
                                <label class="form-label small mb-0">End time</label>
                                <input type="time" name="end_time" class="form-control form-control-sm data-input" data-field="end_time" value="00:00">
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-2 mb-2 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-2 d-flex align-items-center gap-1"><i class="fas fa-comment"></i> Remarks</h6>
                        <textarea name="remarks" class="data-input form-control form-control-sm" data-field="remarks" rows="2" placeholder="Additional notes..."></textarea>
                    </section>
                </div>
            `,
            contentCreated: (me) => {
                const typeUnit = me.controls?.type_unit;
                const spaceRow = me.divModal?.querySelector("#_maintenance_unit_space_row");
                const amenityRow = me.divModal?.querySelector("#_maintenance_unit_amenity_row");
                const toggleUnitFields = () => {
                    const val = typeUnit?.value || "";
                    if (spaceRow) spaceRow.style.display = val === "space" ? "" : "none";
                    if (amenityRow) amenityRow.style.display = val === "amenity" ? "" : "none";
                    if (val !== "space" && me.controls?.space_id) me.controls.space_id.value = "";
                    if (val !== "amenity" && me.controls?.amenity_id) me.controls.amenity_id.value = "";
                };
                typeUnit?.addEventListener("change", toggleUnitFields);
                if (me.detail) {
                    if (me.detail.space_id) typeUnit.value = "space";
                    else if (me.detail.amenity_id) typeUnit.value = "amenity";
                }
                toggleUnitFields();
            },
            configSelect: [
                { name: "building_id", data: "buildings", textField: "building", valueField: "id" },
                { name: "space_id", data: "building_spaces", textField: "code", valueField: "id" },
                { name: "amenity_id", data: "amenities", textField: "code", valueField: "id" }
            ],
            prepareFormOptions: {
                createTitle: "Create Maintenance",
                modifyTitle: "Modify Maintenance",
                targetProp: "maintenance_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/maintenance/form-options`,
                    params: (op) => ({ id: op.id || null })
                }
            },
            onPrepareForm: (me, data) => {
                me.detail = data.maintenance_details || null;
                if (me.dataOptions?.space_id) {
                    me.detail = me.detail || {};
                    me.detail.type_unit = "space";
                    me.detail.space_id = me.dataOptions.space_id;
                    if (me.dataOptions.building_id) me.detail.building_id = me.dataOptions.building_id;
                } else if (me.dataOptions?.amenity_id) {
                    me.detail = me.detail || {};
                    me.detail.type_unit = "amenity";
                    me.detail.amenity_id = me.dataOptions.amenity_id;
                    if (me.dataOptions.building_id) me.detail.building_id = me.dataOptions.building_id;
                } else if (me.detail) {
                    if (me.detail.space_id) me.detail.type_unit = "space";
                    else if (me.detail.amenity_id) me.detail.type_unit = "amenity";
                }
                setTimeout(function () {
                    const typeUnit = me.controls?.type_unit;
                    const spaceRow = me.divModal?.querySelector("#_maintenance_unit_space_row");
                    const amenityRow = me.divModal?.querySelector("#_maintenance_unit_amenity_row");
                    if (typeUnit && me.detail?.type_unit) typeUnit.value = me.detail.type_unit;
                    if (me.detail?.space_id && me.controls?.space_id) me.controls.space_id.value = me.detail.space_id;
                    if (me.detail?.amenity_id && me.controls?.amenity_id) me.controls.amenity_id.value = me.detail.amenity_id;
                    if (me.detail?.building_id && me.controls?.building_id) me.controls.building_id.value = me.detail.building_id;
                    if (spaceRow && amenityRow) {
                        const val = typeUnit?.value || "";
                        spaceRow.style.display = val === "space" ? "" : "none";
                        amenityRow.style.display = val === "amenity" ? "" : "none";
                    }
                    if (me.detail?.start_date && me.controls?.start_date) {
                        const s = String(me.detail.start_date).trim().split(/\s+/);
                        me.controls.start_date.value = s[0] || "";
                        if (me.controls.start_time) me.controls.start_time.value = (s[1] || "00:00").substring(0, 5);
                    }
                    if (me.detail?.end_date && me.controls?.end_date) {
                        const e = String(me.detail.end_date).trim().split(/\s+/);
                        me.controls.end_date.value = e[0] || "";
                        if (me.controls.end_time) me.controls.end_time.value = (e[1] || "00:00").substring(0, 5);
                    }
                }, 0);
            },
            buttons: [
                { label: '<span vslang="buttons.Cancel"></span>', cssClass: "btn btn-secondary", click: (me) => me.hide(false) },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const data = me.getData();
                        data.id = me.dataOptions.id;
                        const typeUnit = me.controls?.type_unit?.value || "";
                        if (typeUnit === "space") data.amenity_id = null;
                        else if (typeUnit === "amenity") data.space_id = null;
                        delete data.type_unit;
                        if (data.start_date && data.start_time) data.start_date = data.start_date + " " + data.start_time;
                        if (data.end_date && data.end_time) data.end_date = data.end_date + " " + data.end_time;
                        delete data.start_time;
                        delete data.end_time;
                        vsapi.call(`${main_view.base_url}/prm/maintenance/save`, data, btn, null)
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true, data);
                                    cv_interact.success(data.id ? "Updated!" : "Maintenance created!");
                                    if (op && typeof op.onClose === "function") op.onClose();
                                } else {
                                    cv_interact.error(res.error_message || "Save failed");
                                }
                            });
                    }
                }
            ]
        });
        dialog.show(op);
    };

    return self;
})();

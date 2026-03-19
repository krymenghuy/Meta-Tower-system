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
            transTitle: "titles.Date",
            className: "align-middle text-center",
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
                const formatDate = (val) => {
                    if (!val) return { dateStr: "—", timePart: "", time12: "" };
                    const s = String(val).trim().split(/\s+/);
                    const datePart = s[0] || "";
                    const timePart = (s[1] || "00:00").substring(0, 5);
                    const parsed = new Date(datePart + (s[1] ? " " + s[1] : ""));
                    let dateStr = datePart;
                    if (!isNaN(parsed.getTime())) {
                        dateStr = parsed.getFullYear() + "-" + String(parsed.getMonth() + 1).padStart(2, "0") + "-" + String(parsed.getDate()).padStart(2, "0");
                    }
                    return { dateStr, timePart, time12: to12h(timePart) };
                };
                const start = formatDate(data.start_date);
                const end = formatDate(data.end_date);
                const sameDate = start.dateStr !== "—" && end.dateStr !== "—" && start.dateStr === end.dateStr;
                const dateLine = sameDate
                    ? `<div class="date-cell-date fw-medium text-prm-custom">${start.dateStr}</div>`
                    : `<div class="d-flex align-items-center justify-content-center gap-1 flex-wrap date-cell-date fw-medium text-prm-custom"><span>${start.dateStr}</span><i class="fa-solid fa-arrow-right fa-xs text-muted" style="opacity:0.8"></i><span>${end.dateStr}</span></div>`;
                const timeLine = sameDate && (start.time12 || end.time12)
                    ? `<div class="d-flex align-items-center justify-content-center gap-1 mt-1 py-1 px-2 rounded small text-muted bg-light" style="font-size:0.8rem;">
                        <span>${start.time12 || "—"}</span>
                        <i class="fa-solid fa-arrow-right fa-xs" style="opacity:0.7"></i>
                        <span>${end.time12 || "—"}</span>
                    </div>`
                    : "";
                return `<div class="d-flex flex-column align-items-center date-cell py-1">
                    ${dateLine}
                    ${timeLine}
                </div>`;
            }
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = parseInt(data.status_id, 10);
                const map = {
                    1: { text: "Planned", cls: "badge bg-warning-subtle text-warning" },
                    2: { text: "In Progress", cls: "badge bg-info-subtle text-info" },
                    3: { text: "Completed", cls: "badge bg-success-subtle text-success" },
                    4: { text: "Cancelled", cls: "badge bg-secondary-subtle text-secondary" },
                };
                const m = map[statusId] || null;
                const label = m?.text || data.status_name || "—";
                const cls = m?.cls || "badge bg-light text-muted";
                return `<span class="badge ${cls}">${label}</span>`;
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
                    <a href="javascript:void(0)"
                       class="btn--Options btn_dropdown_maintenance_action"
                       data-id="${data.id}"
                       data-statusid="${data.status_id}"
                       aria-haspopup="true"
                       aria-expanded="false">
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
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const statusId = Number(
                    container.dataset.statusid ||
                    container.closest("tr")?.dataset?.statusid ||
                    0
                );

                const hideForCompleted = statusId === 3;

                if (menu.cancel_maintenance) {
                    menu.cancel_maintenance.style.display = hideForCompleted ? "none" : "block";
                }
                if (menu.delete) {
                    menu.delete.style.display = hideForCompleted ? "none" : "block";
                }
            },
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
                    VSUtil.setComboItems(mThis.elFilter_building, d.buildings || [], "id", "building", '', "All Building", '');
                    VSUtil.setComboItems(mThis.elFilter_status, d.maintenance_statuses || [], "id", "maintenance_status", '', "All Status", '');
                    VSUtil.setComboItems(mThis.elFilter_type, d.maintenance_types || [], "id", "maintenance_type", '', "All Type", '');
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
                    <section class="maintenance-form-section border rounded-2 p-3 mb-3 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-3 d-flex align-items-center gap-1"><i class="fas fa-map-marker-alt"></i> Location & unit</h6>
                        <div class="row g-3">
                            <div class="col-12 col-sm-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="building_id" class="data-input form-control" data-field="building_id" placeholder="Building" required><option value="">Select building</option></select>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="material-input outlined">
                                    <select data-style="material" name="type_unit" class="data-input form-control" data-field="type_unit" id="_maintenance_type_unit" placeholder="Type unit" required><option value="">Select type</option><option value="space">Space</option><option value="amenity">Amenity</option></select>

                                </div>
                            </div>
                            <div id="_maintenance_unit_space_row" class="col-12 col-sm-6" style="display:none;">
                                <div class="material-input outlined">
                                    <select data-style="material" name="space_id" class="data-input form-control" data-field="space_id" placeholder="Select space"><option value="">Select space</option></select>

                                </div>
                            </div>
                            <div id="_maintenance_unit_amenity_row" class="col-12 col-sm-6" style="display:none;">
                                                      <div class="material-input outlined">
                                    <select data-style="material" name="amenity_id" class="data-input form-control" data-field="amenity_id" placeholder="Select code amenity"><option value="">Select code amenity</option></select>

                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-3 mb-3 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-3 d-flex align-items-center gap-1"><i class="fas fa-calendar-alt"></i> Time stamp</h6>
                        <div class="row g-3">
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">Start date</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="time" name="start_time" class="data-input form-control" data-field="start_time" value="00:00" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">Start time</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">End date</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="time" name="end_time" class="data-input form-control" data-field="end_time" value="00:00" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">End time</label>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-3 mb-3 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-3 d-flex align-items-center gap-1"><i class="fas fa-comment"></i> Remarks</h6>
                        <div class="material-input outlined">
                            <textarea name="remarks" class="data-input form-control" data-field="remarks" rows="2" placeholder=" "></textarea>
                            <label style="color:#777777;padding-left:6px;">Additional notes</label>
                        </div>
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
                // Prefer showing amenity code (list view uses `amenity_code`).
                { name: "amenity_id", data: "amenities", textField: "amenity_code", valueField: "id" }
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
                    const fromSpace = !!me.dataOptions?.space_id;
                    [me.controls?.building_id, me.controls?.type_unit, me.controls?.space_id].forEach(el => {
                        if (el) el.disabled = fromSpace;
                    });
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
                        // basic front-end validation: all fields required except remarks
                        const buildingId = me.controls?.building_id?.value || "";
                        const typeUnitVal = me.controls?.type_unit?.value || "";
                        const spaceId = me.controls?.space_id?.value || "";
                        const amenityId = me.controls?.amenity_id?.value || "";
                        const startDate = me.controls?.start_date?.value || "";
                        const startTime = me.controls?.start_time?.value || "";
                        const endDate = me.controls?.end_date?.value || "";
                        const endTime = me.controls?.end_time?.value || "";

                        if (!buildingId.trim()) {
                            cv_interact.error("Building is required.");
                            me.controls?.building_id?.focus();
                            return;
                        }

                        if (!typeUnitVal.trim()) {
                            cv_interact.error("Type unit is required.");
                            me.controls?.type_unit?.focus();
                            return;
                        }

                        if (typeUnitVal === "space" && !spaceId.trim()) {
                            cv_interact.error("Space is required.");
                            me.controls?.space_id?.focus();
                            return;
                        }

                        if (typeUnitVal === "amenity" && !amenityId.trim()) {
                            cv_interact.error("Amenity is required.");
                            me.controls?.amenity_id?.focus();
                            return;
                        }

                        if (!startDate.trim()) {
                            cv_interact.error("Start date is required.");
                            me.controls?.start_date?.focus();
                            return;
                        }

                        if (!startTime.trim()) {
                            cv_interact.error("Start time is required.");
                            me.controls?.start_time?.focus();
                            return;
                        }

                        if (!endDate.trim()) {
                            cv_interact.error("End date is required.");
                            me.controls?.end_date?.focus();
                            return;
                        }

                        if (!endTime.trim()) {
                            cv_interact.error("End time is required.");
                            me.controls?.end_time?.focus();
                            return;
                        }

                        const data = me.getData();
                        data.id = me.dataOptions.id;
                        if (me.dataOptions?.space_id) {
                            data.space_id = me.dataOptions.space_id;
                            data.type_unit = "space";
                            if (me.dataOptions.building_id) data.building_id = me.dataOptions.building_id;
                        }
                        const typeUnit = data.type_unit || me.controls?.type_unit?.value || "";
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

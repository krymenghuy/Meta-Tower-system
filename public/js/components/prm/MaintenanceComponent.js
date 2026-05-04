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
    mThis.elSearch = mThis.self.querySelector("#_search_maintenance");
    mThis.autoRefreshMs = 60000;
    mThis.autoRefreshTimer = null;
    mThis.autoRefreshStartTimeout = null;

    mThis.cols = [
        { title: "", className: "align-middle" },
        {
            transTitle: "titles.Building",
            className: "align-middle",
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.building_name ?? ""}</span>`
        },
        {
            transTitle: "titles.unit",
            className: "align-middle",
            data: (data) => {
                const space = data.space_id && data.space_code ? data.space_code : null;
                const amenityCode = data.amenity_id ? (data.amenity_code || data.amenity_name || "") : null;
                if (space) return `<div class="d-flex flex-column align-items-start"><span class="text-nowrap">${space}</span><span class="text-muted small">Space</span></div>`;
                if (amenityCode) return `<div class="d-flex flex-column align-items-start"><span class="text-nowrap">${amenityCode}</span><span class="text-muted small">Amenity</span></div>`;
                return `<span class="text-nowrap">—</span>`;
            }
        },
        {
            transTitle: "titles.Schedule Date",
            className: "align-middle text-start",
            data: (data) => {

                const to12h = (t) => {
                    if (!t) return "";
                    const m = String(t).match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
                    if (!m) return "";
                    let h = +m[1], mm = m[2];
                    if (m[3]) return `${h > 12 ? h - 12 : (h || 12)}:${mm} ${m[3].toUpperCase()}`;
                    const ap = h < 12 ? "AM" : "PM";
                    h = h % 12 || 12;
                    return `${h}:${mm} ${ap}`;
                };

                const parse = (v) => {
                    if (!v) return { d: "—", t: "" };
                    const [d, t1, t2] = String(v).split(" ");
                    return { d, t: to12h(t2 ? `${t1} ${t2}` : t1) };
                };

                const s = parse(data.start_date);
                const e = parse(data.end_date);
                const same = s.d === e.d;

                return `
                <div class="text-start">
                    <div class="fw-medium text-prm-custom">
                        ${same ? s.d : `${s.d} <i class="fa fa-arrow-right mx-1"></i> ${e.d}`}
                    </div>
                    ${same && (s.t || e.t) ? `
                    <div class="text-primary mt-1">
                        ${s.t || "—"} <i class="fa fa-arrow-right mx-1"></i> ${e.t || "—"}
                    </div>` : ""}
                </div>`;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-prm-custom text-capitalize" style="width:220px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = parseInt(data.effective_status_id ?? data.status_id, 10);
                const map = {
                    1: { text: "Planned", cls: "badge bg-warning-subtle text-warning border border-warning" },
                    2: { text: "In Progress", cls: "badge bg-info-subtle text-info border border-info" },
                    3: { text: "Completed", cls: "badge bg-success-subtle text-success border border-success" },
                    4: { text: "Cancelled", cls: "badge bg-danger-subtle text-danger border border-danger" },
                };
                const m = map[statusId] || null;
                const label = m?.text || data.status_name || "—";
                const cls = m?.cls || "badge bg-light text-muted";
                return `<span class="badge ${cls}" style="min-width: 100px;">${label}</span>`;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => `<div class="d-flex flex-column"><span class="text-capitalize text-prm-custom">${data.update_user ?? ""}</span><span class="text-muted small">${data.updated_at ?? ""}</span></div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                       class="btn--Options btn_dropdown_maintenance_action"
                       data-id="${data.id}"
                       data-statusid="${data.effective_status_id ?? data.status_id}"
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
                tr.dataset.statusid = String(data.effective_status_id ?? data.status_id ?? "");
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
            search_value: mThis.elSearch.value,
            building_id: mThis.elFilter_building.value,
            status_id: mThis.elFilter_status.value,

        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            const f = el.dataset.field;
            if (f) p[f] = el.value;
        });
        return p;
    };

    mThis.isActiveView = () => !!(mThis.self && mThis.self.offsetParent !== null);

    mThis.refreshListIfActive = () => {
        if (!mThis.initAlready || !mThis.isActiveView()) return;
        mThis.MaintenanceListView.showPage(mThis.getFilterData());
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
            actionButtonClass: "btn_dropdown_maintenance_action",
            cssClass: "bg-white shadow",
            menus: [
                { html: '<span class="ps-2" vslang="titles.Modify"></span>', icon: '<i class="fa-regular fa-edit fs-5 text-warning"></i>', cssClass: "border-bottom pb-2", name: "modify" },
                { html: '<span class="ps-2" vslang="titles.Cancel"></span>', icon: '<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>', cssClass: "border-bottom pb-2", name: "cancel_maintenance" },
                { html: '<span class="ps-2" vslang="titles.Delete"></span>', icon: '<i class="fa-regular fa-trash-can fs-5 text-danger"></i>', cssClass: "border-bottom pb-2", name: "delete" },
                { html: '<span class="ps-2" vslang="titles.Finish"></span>', icon: '<i class="fa-solid fa-clipboard-check fs-5 text-success"></i>', cssClass: "border-bottom pb-2", name: "finish_maintenance" },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = parseInt(container.dataset.statusid, 10) || 0;
                menu.finish_maintenance.style.display = status_id === 2 ? 'block' : 'none';
                // Planned (1): allow delete before work starts; Completed (3): allow cleanup of history row.
                menu.delete.style.display = (status_id === 1 || status_id === 3) ? 'block' : 'none';
                menu.cancel_maintenance.style.display = status_id > 1 ? 'none' : 'block';
                menu.modify.style.display = 'none';



            },
            onClick: (menuLink, id, name) => {
                if (name === "modify") {
                    CreateMaintenanceDialog.show({
                        id: parseInt(id, 10),
                        btn: menuLink,
                        onClose: () => mThis.MaintenanceListView.showPage(mThis.getFilterData())
                    });
                } else if (name === "finish_maintenance") {
                    cv_interact.confirm("Finish this maintenance?", { transTitle: "Finish Maintenance", context: "confirm", confirmButtonText: "Finish" }, (e) => {
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
                    VSUtil.setComboItems(mThis.elFilter_building, d.buildings || [], "id", "building", '', "All Buildings", '');
                    VSUtil.setComboItems(mThis.elFilter_status, d.maintenance_statuses || [], "id", "maintenance_status", '', "All Statuses", '');
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
            mThis.startAutoRefresh();
        });
    };

    return mThis;
})();

const CreateMaintenanceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal vs-modal--compact",
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
                            <div class="col-12 col-sm-3">
                                <div class="material-input outlined">
                                    <select data-style="material" name="type_unit" class="data-input form-control" data-field="type_unit" id="_maintenance_type_unit" placeholder="Type unit" required><option value="">Select type</option><option value="space">Space</option><option value="amenity">Amenity</option></select>
                                </div>
                            </div>
                            <div id="_maintenance_unit_space_row" class="col-3" style="display:none;">
                                <div class="material-input outlined">
                                    <select data-style="material" name="space_id" class="data-input form-control" data-field="space_id" id="_maintenance_space_id" placeholder="Select space"><option value="">Select space</option></select>
                                </div>
                            </div>
                            <div id="_maintenance_unit_amenity_row" class="col-3" style="display:none;">
                                <div class="material-input outlined">
                                    <select data-style="material" name="amenity_id" class="data-input form-control" data-field="amenity_id" placeholder="Select amenity"><option value="">Select amenity</option></select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-3 mb-3 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-3 d-flex align-items-center gap-1"><i class="fas fa-calendar-alt"></i> Timestamp</h6>
                        <div class="row g-3">
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="text" data-type="date" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">Start date</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="material-input outlined">
                                    <input type="time" name="start_time" class="data-input form-control" data-field="start_time"  placeholder=" ">
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
                                    <input type="time" name="end_time" class="data-input form-control" data-field="end_time" placeholder=" ">
                                    <label style="color:#777777;padding-left:6px;">End time</label>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="maintenance-form-section border rounded-2 p-3 mb-3 bg-light">
                        <h6 class="text-uppercase text-muted fw-semibold small mb-3 d-flex align-items-center gap-1"><i class="fas fa-comment"></i>Remark</h6>
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
                const unitPreset = me.detail || me.dataOptions;
                if (unitPreset) {
                    if (unitPreset.space_id) typeUnit.value = "space";
                    else if (unitPreset.amenity_id) typeUnit.value = "amenity";
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
                    params: (op) => {
                        const p = { id: op.id || null };
                        if (op.space_id != null && op.space_id !== "") p.space_id = op.space_id;
                        if (op.amenity_id != null && op.amenity_id !== "") p.amenity_id = op.amenity_id;
                        return p;
                    }
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
                const fromAmenity = !!me.dataOptions?.amenity_id;
                const lockContext = fromSpace || fromAmenity;

                if (me.controls?.building_id) me.controls.building_id.disabled = lockContext;
                if (me.controls?.type_unit) me.controls.type_unit.disabled = lockContext;
                if (me.controls?.space_id) me.controls.space_id.disabled = lockContext;
                if (me.controls?.amenity_id) me.controls.amenity_id.disabled = lockContext;

                // ✅ helper: convert 12h → 24h
                const to24h = (time, ampm) => {
                    if (!time) return "00:00";
                    let [h, m] = time.split(':').map(Number);

                    if (ampm === 'PM' && h < 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;

                    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                };

                // ✅ START DATE
                if (me.detail?.start_date && me.controls?.start_date) {
                    const s = String(me.detail.start_date).trim().split(/\s+/);

                    me.controls.start_date.value = s[0] || "";

                    if (me.controls.start_time) {
                        const time = s[1] || "00:00";
                        const ampm = s[2] || "AM";
                        me.controls.start_time.value = to24h(time, ampm);
                    }
                }

                // ✅ END DATE
                if (me.detail?.end_date && me.controls?.end_date) {
                    const e = String(me.detail.end_date).trim().split(/\s+/);

                    me.controls.end_date.value = e[0] || "";

                    if (me.controls.end_time) {
                        const time = e[1] || "00:00";
                        const ampm = e[2] || "AM";
                        me.controls.end_time.value = to24h(time, ampm);
                    }
                }

            }, 0);
            },
            buttons: [
                { label: '<span vslang="buttons.Cancel"></span>', cssClass: "btn btn-secondary", click: (me) => me.hide(false) },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const op = me.getData();
                        op.id = me.dataOptions?.id;
                        if (op.type_unit === 'space') {
                            op.amenity_id = null;
                            if (!op.space_id) {
                                cv_interact.error("Space is required.");
                                return;
                            }
                        } else if (op.type_unit === 'amenity') {
                            op.space_id = null;

                            if (!op.amenity_id) {
                                cv_interact.error("Amenity is required.");
                                return;
                            }
                        }
                        delete op.type_unit;
                        if (op.start_date && op.start_time) op.start_date = op.start_date + " " + op.start_time;
                        if (op.end_date && op.end_time) op.end_date = op.end_date + " " + op.end_time;
                        delete op.start_time;
                        delete op.end_time;

                        vsapi.call(`${main_view.base_url}/prm/maintenance/save`, op, btn, null)
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success(op.id ? "Updated!" : "Maintenance created!");
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

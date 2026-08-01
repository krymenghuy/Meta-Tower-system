"use strict";

var MovementComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Employee Movements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employeeMovementComponent");

    // mThis.btnAdd = mThis.self.querySelector("#_btnAddMovement");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_emp_movement");
    mThis.elEvent = mThis.self.querySelector("#el_event");
    mThis.elEmployee = mThis.self.querySelector("#el_employee");

   mThis.cols = [
    {
        title: "",
        className: "align-middle text-center",
    },
    {
        transTitle: "titles.Employee",
        className: "align-middle text-nowrap",
        data: (row) => {

            const photo = row.image_url ||
                `${main_view.base_url}/assets/images/default/default-staff.png`;

            return `
                <div class="d-flex align-items-center">
                    <img src="${photo}"
                        class="rounded-circle border shadow-sm me-3"
                        style="width:42px;height:42px;object-fit:cover;"
                        onerror="this.src='${main_view.base_url}/assets/images/default/default-staff.png'">
                    <div>
                        <div class="text-prm-custom text-nowrap">
                            ${row.emp_name ?? "_"}
                        </div>

                        <small class="text-muted">
                            ${row.position ?? "_"}
                        </small>
                    </div>
                </div>
            `;
        }
    },
    {
        transTitle: "titles.Event",
        className: "align-middle",
        data: (data) =>{
            return `<span class="text-prm-custom text-nowrap">${data.event ?? "_"}</span>`;
        } 
    },
    {
        transTitle: "titles.Date",
        className: "align-middle text-nowrap",
        data: row => `
            <span class="text-prm-custom">
                ${row.event_date ?? "-"}
            </span>
        `
    },
    {
        transTitle: "titles.Last Updated",
        className: "align-middle",
        data: (data) => {
            return `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                <small class="text-muted">${data.updated_at ?? ""}</small>
            </div>`;
        },
    },
    {
        transTitle: "titles.Impact",
        className: "align-middle text-center",
        data: (row) => {

            const impact = (row.impact || "").toLowerCase();

            let badge = "badge text-warning bg-warning-subtle border border-warning";

            switch (impact) {

                case "positive":
                    badge = "badge text-success bg-success-subtle border border-success";
                    break;

                case "neutral":
                    badge = "badge text-warning bg-warning-subtle border border-warning";
                    break;

                case "negative":
                    badge = "badge text-danger bg-danger-subtle border border-danger";
                    break;
            }

            return `
                <span class="text-capitalize d-inline-block text-center ${badge}" style="min-width:70px">
                    ${row.impact ?? "_"}
                </span>
            `;
        }
    }
];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MovementListView = new ListView("_emp_movement_list", {
            fetchApi: `${main_view.base_url}/mhr/emp-event/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white overflow-hidden rounded-3 header-uppercase",
            listContainerClass: null,
        });

        // mThis.btnAdd.onclick = function (e) {
        //     e.preventDefault();
        //     let op = {
        //         id: null,
        //         btn: e.target,
        //         onClose: () => {
        //             mThis.MovementListView.showPage();
        //         }
        //     };
        //     MovementDialog.show(op);
        // };

        mThis.tblMovement = mThis.MovementListView.getTable();
        mThis.sh_container = mThis.MovementListView.getListContainer();

        const pr_tbl = mThis.MovementListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 215 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 215 + "px";
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            }, 300);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
            emp_id: mThis.elEmployee.value,
            event_id: mThis.elEvent.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            if (field) filters[field] = el.value;
        });
        return filters;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/emp-event/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elEmployee,
                    d.employees,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Employee", "titles"),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elEvent,
                    d.events,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Movements", "titles"),
                    "",
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.MovementListView.showPage(mThis.getFilterData());
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const MovementDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class=" data-input" data-field="emp_id"></select>
                    </div>
                    <div class="form-group col-12 d-none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="event" class="form-label" vslang="titles.Movement Type"></label>
                        <select name="event" class=" data-input" data-field="event_id"></select>
                    </div>
                    <div class="form-group col-6">
                        <label for="event_date" class="form-label" vslang="titles.Date"></label>
                        <input name="event_date" class="form-control data-input form_input" data-field="event_date" />
                    </div>
                    <div class="form-group col-12">
                        <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                        <textarea type="text" class="form-control data-input" data-field="remarks"></textarea>
                    </div>
              </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.event_date);
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
                    },
                    {
                        name: "event",
                        data: "events",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-event/save"].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Add Employee Movement",
                    modifyTitle: "vslang:titles.Edit Employee Movement",
                    targetProp: "emp_event",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/emp-event/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: MovementDialog

/** Profile Movement — Branch / Position / Salary / Work Shift */
const ProfileMovementDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(LocaleManager.trans("Employee is required", "message_box_default"));
            return;
        }

        op.emp_id = op.emp_id || op.employee.id;

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                title: LocaleManager.trans("Movement", "titles"),
                createContent: () => {
                    return [`<div>
                        <div class="d-flex align-items-center gap-3 border-bottom ">
                            <input data-target="div_position" name="change_position" class="mb-2 change-option data-input" data-field="position_id" type="checkbox"  value="position" />
                            <label class="text-primary-custom" vslang="labels.Change Position"></label>

                            <input data-target="div_salary" name="change_salary" class="mb-2 change-option" type="checkbox"  value="salary" />
                            <label class="text-primary-custom" vslang="labels.Change Salary"></label>

                            <input data-target="div_work_shift" name="change_work_shift" class="mb-2 change-option " type="checkbox"  value="work_shift" />
                            <label class="text-primary-custom" vslang="labels.Change Work Shift"></label>
                        </div>
                    </div>`,
                    `<div name="div_position" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_position"  class="form-control data-input" data-field="position" placeholder=" " />
                                    <label vslang="labels.Position"></label>
                                </div>
                            </div>
                             <div class="col-md-3">
                                <select data-style="material" name="to_position" class="form-control data-input" data-field="to_position_id" placeholder="${LocaleManager.trans("To Position","labels")}" >
                                </select>
                            </div>`,
                            `<div id="remarks" class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="position_remarks" class="form-control data-input" placeholder=" " data-field="remarks" />
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>
                    </div>`,

                    `<div name="div_salary" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div id="salary" class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_salary" class="form-control  data-input" placeholder="" data-field="salary"/>
                                    <label vslang="labels.Original Salary"></label> 
                                </div>
                            </div>
                            <div id="salary" class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="new_salary" type="number" class="form-control  data-input" placeholder="" data-field="new_salary" />
                                    <label vslang="labels.New Salary"></label>
                                </div>
                            </div>

                            <div id="remarks" class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="salary_remarks" class="form-control  data-input" placeholder="" data-field="remarks" />
                                    <label vslang="labels.Remarks"></label>
                                </div>  
                            </div>
                        </div>
                    </div>`,
                    `<div name="div_work_shift" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_work_shift" class="form-control data-input" data-field="work_shift" />
                                    <label vslang="labels.Current Work Shift"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <select data-style="material" name="to_work_shift" class="form-control data-input" data-field="to_work_shift_id" placeholder="${LocaleManager.trans('To Work Shift','labels')}" >
                                </select>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="work_shift_remarks" class="form-control  data-input" placeholder=" " data-field="remarks">
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>

                    </div>`].join('');
                },
                contentCreated: (me) => {
                      me.setEvent = (div) => {
                        const elements = div.querySelectorAll("input.change-option");
                        elements.forEach(
                            (input) => {
                                input.onchange = (e) => {
                                    e.preventDefault();
                                    const divTarget = me.controls[input.dataset.target];
                                    if (divTarget) {
                                        divTarget.style.display = input.checked
                                            ? "block"
                                            : "none";
                                    }
                                };
                            }
                        );
                    };
                    me.setEvent(me.divModal);
                },
                configSelect: [
                  
                    {
                        name: "to_position_id",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "to_work_shift_id",
                        data: "work_shifts",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                  buttons: [
                    {
                       label: '<span  vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn, divModal) => {
                            const p = me.getData();
                            p.emp_id = op.emp_id;
                            const d = {};
                            d.emp_id = p.emp_id;
                            let change_position = {},
                                change_salary = {},
                                change_work_shift = {};

                            if (me.controls.change_position.checked) {
                                change_position.position_id = p.position_id;
                                change_position.to_position_id = p.to_position_id;
                                change_position.remarks = me.controls.position_remarks.value;
                                change_position.start_date = p.start_date;
                            }
                            if (me.controls.change_salary.checked) {
                                change_salary.new_salary = p.new_salary;
                                change_salary.remarks = me.controls.salary_remarks.value;
                                change_salary.org_salary = p.salary;
                                change_salary.org_position_id = p.position_id;
                                change_salary.new_position_id = p.position_id;
                            }
                            if (me.controls.change_work_shift.checked) {
                                change_work_shift.work_shift_id = p.work_shift_id;
                                change_work_shift.to_work_shift_id = p.to_work_shift_id;
                                change_work_shift.remarks = me.controls.work_shift_remarks.value;
                                //change_work_shift.effective_date = p.effective_date;
                            }

                            d.change_position = change_position;
                            d.change_salary = change_salary;
                            d.change_work_shift = change_work_shift;

                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/staff-promotion/promote`,
                                    d,
                                    btn,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        cv_interact.success(
                                            "This employee has been promoted successfully!"
                                        );
                                        mThis.showPage('profile_view', d.emp_id);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    // createTitle: "vslang:titles.Employee Movement",
                    // modifyTitle: "vslang:titles.Movement",
                    targetProp: "employee",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/employee/form-options`,
                        params: (op) => {
                            console.log(123, op);
                            return { id: op.dataOptions.emp_id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    me.setReadOnly(true,['org_position','org_salary','org_work_shift']);
                    
                    const divModal = me.divModal;
                    divModal
                        .querySelectorAll("input.change-option")
                        .forEach((input) => {
                            input.checked = false;
                            const divTarget = me.controls[input.dataset.target];
                            if (divTarget) {
                                divTarget.style.display = input.checked
                                    ? "block"
                                    : "none";
                            }
                        });

                    //me.setEvent(divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ProfileMovementDialog

/** Employee movement history timeline (profile Detail Movement) */
const EmployeeMovementHistoryDialog = (() => {
    const self = {};
    let dialog = null;

    const MOVEMENT_EVENTS = [
        "change branch",
        "change position",
        "change salary",
        "change work shift",
    ];

    const EVENT_META = {
        "change branch": {
            icon: "fa-solid fa-building",
            type: "branch",
            label: "Branch",
        },
        "change position": {
            icon: "fa-solid fa-briefcase",
            type: "position",
            label: "Position",
        },
        "change salary": {
            icon: "fa-solid fa-coins",
            type: "salary",
            label: "Salary",
        },
        "change work shift": {
            icon: "fa-solid fa-clock",
            type: "shift",
            label: "Work Shift",
        },
    };

    const esc = (s) =>
        String(s ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    const initialOf = (name) => {
        const n = String(name || "").trim();
        return n ? n.charAt(0).toUpperCase() : "?";
    };

    const formatSalaryValue = (value) => {
        const raw = String(value ?? "").trim();
        const cleaned = raw.replace(/[$,\s]/g, "");
        if (!cleaned) return raw;

        let n;
        if (cleaned.includes(".")) {
            n = parseFloat(cleaned);
        } else if (/^\d+$/.test(cleaned) && cleaned.length >= 5) {
            // Legacy remarks lost "." when saving (100.00 became 10000)
            n = parseFloat(cleaned.slice(0, -2) + "." + cleaned.slice(-2));
        } else {
            n = parseFloat(cleaned);
        }

        if (!Number.isFinite(n)) return raw;
        return n.toFixed(2);
    };

    const parseChangeParts = (remarks, event) => {
        const raw = String(remarks || "").trim();
        if (!raw) return { from: "—", to: "—" };
        const arrowPart = raw.split("|")[0].trim();
        if (!arrowPart) return { from: raw, to: "—" };

        const parts = arrowPart.split("→").map((p) => p.trim());
        if (parts.length < 2) return { from: arrowPart, to: "—" };

        let from = parts[0] || "—";
        let to = parts[1] || "—";
        if (String(event || "").trim().toLowerCase() === "change salary") {
            from = formatSalaryValue(from);
            to = formatSalaryValue(to);
        }
        return { from, to };
    };

    const eventMeta = (event) => {
        const key = String(event || "").trim().toLowerCase();
        return (
            EVENT_META[key] || {
                icon: "fa-solid fa-right-left",
                type: "default",
                label: event || "Event",
            }
        );
    };

    /** Newest-first list → keep one row per movement type (max 4) */
    const latestPerMovementType = (rows) => {
        const seen = {};
        const out = [];
        (rows || []).forEach((row) => {
            const key = String(row?.event || "")
                .trim()
                .toLowerCase();
            if (!MOVEMENT_EVENTS.includes(key) || seen[key]) return;
            seen[key] = true;
            out.push(row);
        });
        return out;
    };

    const renderContent = (me, data) => {
        const emp = me.dataOptions.employee || {};
        const page = data || {};
        const allRows = Array.isArray(page)
            ? page
            : page.data || page.items || page.rows || [];
        const rows = latestPerMovementType(allRows);
        const first = rows[0] || allRows[0] || {};
        const name = emp.name || first.emp_name || "Employee";
        const photo = emp.image_url || first.image_url || "";
        const position = emp.position || first.position || "";

        const count = rows.length;
        const titleText = "Detail Movement";

        const titleEl =
            me.divModal.querySelector(".modal-title") ||
            me.divModal.querySelector(".modal-header h5") ||
            me.divModal.querySelector(".modal-header .modal-title");
        if (titleEl) {
            titleEl.textContent = titleText;
        }

        const header = me.divModal.querySelector("#_mv_history_header");
        const list = me.divModal.querySelector("#_mv_history_list");
        if (!header || !list) return;

        const avatarHtml = photo
            ? `<img class="mv-history-avatar-img" src="${esc(photo)}" alt="" />`
            : `<span class="mv-history-avatar-letter">${esc(initialOf(name))}</span>`;

        header.innerHTML = `
            <div class="mv-history-avatar">${avatarHtml}</div>
            <div class="mv-history-header-text">
                <div class="mv-history-title">${esc(name)}</div>
                <div class="mv-history-subtitle">
                    ${position ? `<span class="mv-history-role">${esc(position)}</span>` : ""}
                    <span class="mv-history-count">${count} event${count === 1 ? "" : "s"}</span>
                </div>
            </div>`;

        if (!rows.length) {
            list.innerHTML = `
                <div class="mv-history-empty">
                    <div class="mv-history-empty-icon"><i class="fa-regular fa-folder-open"></i></div>
                    <div class="mv-history-empty-title">No movements found</div>
                    <div class="mv-history-empty-text">This employee has no recorded movement yet.</div>
                </div>`;
            return;
        }

        list.innerHTML = rows
            .map((row, index) => {
                const meta = eventMeta(row.event);
                const change = parseChangeParts(row.remarks, row.event);
                const isLatest = index === 0;
                return `
                    <div class="mv-history-item mv-history-item--${esc(meta.type)}${isLatest ? " is-latest" : ""}">
                        <div class="mv-history-rail">
                            <div class="mv-history-dot" title="${esc(meta.label)}">
                                <i class="${esc(meta.icon)}"></i>
                            </div>
                        </div>
                        <div class="mv-history-card">
                            <div class="mv-history-card-top">
                                <div class="mv-history-event-wrap">
                                    <span class="mv-history-event">${esc(row.event || "Event")}</span>
                                    ${isLatest ? `<span class="mv-history-badge">Latest</span>` : ""}
                                </div>
                                <time class="mv-history-date">${esc(row.event_date || "")}</time>
                            </div>
                            <div class="mv-history-change">
                                <span class="mv-history-pill mv-history-pill--from" title="From">${esc(change.from)}</span>
                                <span class="mv-history-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
                                <span class="mv-history-pill mv-history-pill--to" title="To">${esc(change.to)}</span>
                            </div>
                        </div>
                    </div>`;
            })
            .join("");
    };

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(
                LocaleManager.trans("Employee is required", "message_box_default"),
            );
            return;
        }
        op.emp_id = op.emp_id || op.employee.id;

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal mv-history-dialog",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="mv-history-body">
                            <div id="_mv_history_header" class="mv-history-header"></div>
                            <div id="_mv_history_list" class="mv-history-timeline"></div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {},
                buttons: [
                    {
                        label: '<span vslang="buttons.Close"></span>',
                        cssClass: "btn btn-secondary mv-history-btn-close",
                        click: (me, btn) => me.hide(false),
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Detail Movement",
                    modifyTitle: "Detail Movement",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/emp-event/list-paginate",
                        ].join(""),
                        params: (op) => {
                            return {
                                emp_id: op.emp_id || op.employee?.id || null,
                            };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    console.log(3333,data);
                    renderContent(me, data);
                    setTimeout(() => renderContent(me, data), 0);
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: EmployeeMovementHistoryDialog

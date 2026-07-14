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
            className: "align-middle",
        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.emp_name ?? ""}</span>
                                <br/>
                                <span style="font-size: 10px; color: #2b3991;">${data.position ?? ""}</span>
                            </div>
                        </div>`;
            },
        },
        {
            title: "Event",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event ?? ""}</p>`;
            },
        },
        {
            title: "Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event_date ?? ""}</p>`;
            },
        },
        {
            title: "last Updated",
            className: "align-middle",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 10px; color: #2b3991;">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            title: "Impact",
            className: "status text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = "";

                if ((data.impact || "").toLowerCase() === "positive") {
                    cls_class = "text-white text-center border border-success rounded-5 p-1";
                    bg_color = "#28a745";
                } else if ((data.impact || "").toLowerCase() === "neutral") {
                    cls_class = "text-white text-center border border-warning rounded-5 p-1";
                    bg_color = "#ffc107";
                } else if ((data.impact || "").toLowerCase() === "negative") {
                    cls_class = "text-white text-center border border-danger rounded-5 p-1";
                    bg_color = "#dc3545";
                } else {
                    bg_color = "#6c757d";
                }

                return `<div><a class="d-block" data-status="${data.impact}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:100px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.impact ?? ""}
                            </span>
                        </a></div>`;
            },
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                            <a href="javascript:void(0)" class="btn_movement_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            },
        },
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
        mThis.initDropdownMenus(mThis.tblMovement);
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
            el.onchange = (e) => {
                e.preventDefault();
                mThis.MovementListView.showPage(mThis.getFilterData());
            };
        });

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            }, 250);
        };

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            event_id: mThis.elEvent.value,
            emp_id: mThis.elEmployee.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            let f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_movement_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Movement">Modify Movement</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_movement",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Movement">Delete Movement</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_movement",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_movement": {
                        mThis.editMovement(id, menuLink);
                        break;
                    }
                    case "delete_movement": {
                        mThis.deleteMovement(id, menuLink);
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

    mThis.editMovement = (movement_id, menuLink) => {
        let op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            },
        };
        MovementDialog.show(op);
    };

    mThis.deleteMovement = (movement_id, menuLink) => {
        const op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this employee movement?",
            {
                title: "Delete Employee Movement",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${main_view.base_url}/mhr/emp-event/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.MovementListView.showPage();
                            }
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            },
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/emp-event/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elEvent, d.events, "id", "name", true, "All Movements", null);
                VSUtil.setComboItems(mThis.elEmployee, d.employees, "id", "name", true, "All Employee", null);
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
                    createTitle: "Add Employee Movement",
                    modifyTitle: "Edit Employee Movement",
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

    const isChecked = (val) =>
        val === true || val === 1 || val === "1" || val === "on";

    const fillCurrentValues = (me, data) => {
        const emp = data?.employee || me.dataOptions.employee || {};
        const branches = data?.branches || [];

        if (me.controls.emp_id) {
            me.controls.emp_id.value = emp.id || me.dataOptions.emp_id || "";
        }

        const branchName =
            emp.branch_name ||
            branches.find((b) => String(b.id) === String(emp.branch_id))?.branch_name ||
            branches.find((b) => String(b.id) === String(emp.branch_id))?.name ||
            "";

        if (me.controls.current_branch) {
            me.controls.current_branch.value = branchName;
        }
        if (me.controls.current_position) {
            me.controls.current_position.value = emp.position || emp.position_title || "";
        }
        if (me.controls.original_salary) {
            me.controls.original_salary.value =
                emp.salary != null && emp.salary !== "" ? emp.salary : "";
        }
        if (me.controls.current_work_shift) {
            me.controls.current_work_shift.value = emp.work_shift || "";
        }
    };

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(LocaleManager.trans("Employee is required", "message_box_default"));
            return;
        }

        op.emp_id = op.emp_id || op.employee.id;

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal movement-dialog",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="movement-dialog-body">
                            <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />

                            <div class="movement-check-row d-flex flex-wrap align-items-center gap-3 gap-md-4 mb-3">
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_branch" data-field="change_branch" data-section="branch" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Branch">Change Branch</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_position" data-field="change_position" data-section="position" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Position">Change Position</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_salary" data-field="change_salary" data-section="salary" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Salary">Change Salary</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_work_shift" data-field="change_work_shift" data-section="work_shift" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Work Shift">Change Work Shift</span>
                                </label>
                            </div>
                       <div class="position-relative">
                            <div class="row g-3 movement-section mb-2" data-section-row="branch">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Branch">Current Branch <span class="text-danger">*</span></label>
                                    <input type="text" name="current_branch" class="form-control data-input movement-readonly" data-field="current_branch" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Branch">To Branch <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_branch" class="form-control data-input" placeholder="To Branch" data-field="to_branch_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="branch_remarks" class="form-control data-input" data-field="branch_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="position">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Position">Current Position <span class="text-danger">*</span></label>
                                    <input type="text" name="current_position" class="form-control data-input movement-readonly" data-field="current_position" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Position">To Position <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_position" class="form-control data-input" placeholder="To Position" data-field="to_position_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="position_remarks" class="form-control data-input" data-field="position_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="salary">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Original Salary">Original Salary</label>
                                    <input type="text" name="original_salary" class="form-control data-input movement-readonly" data-field="original_salary" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.New Salary">New Salary <span class="text-danger">*</span></label>
                                    <input type="number" name="new_salary" class="form-control data-input" data-field="new_salary" min="0" step="0.01" />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="salary_remarks" class="form-control data-input" data-field="salary_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="work_shift">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Work Shift">Current Work Shift <span class="text-danger">*</span></label>
                                    <input type="text" name="current_work_shift" class="form-control data-input movement-readonly" data-field="current_work_shift" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Work Shift">To Work Shift <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_work_shift" class="form-control data-input" placeholder="To Work Shift" data-field="to_work_shift_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="work_shift_remarks" class="form-control data-input" data-field="work_shift_remarks" />
                                </div>
                            </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    me.syncMovementSections = () => {
                        me.divModal.querySelectorAll(".movement-toggle").forEach((chk) => {
                            const key = chk.dataset.section;
                            console.log(111,key);
                            const row = me.divModal.querySelector(`[data-section-row="${key}"]`);
                            if (!row) return;
                            row.classList.toggle("is-open", chk.checked);
                            row.querySelectorAll(
                                "input:not([type=checkbox]), select, textarea",
                            ).forEach((el) => {
                                el.disabled = false;
                                el.removeAttribute("disabled");
                                if (el.classList.contains("movement-readonly")) {
                                    el.readOnly = true;
                                }
                            });
                        });
                    };
                    me.divModal.querySelectorAll(".movement-toggle").forEach((chk) => {
                        chk.addEventListener("change", () => {
                            me.syncMovementSections();
                            fillCurrentValues(me, me._formData || {});
                        });
                    });
                    me.syncMovementSections();
                },
                configSelect: [
                    {
                        name: "to_branch",
                        data: "branches",
                        textField: "branch_name",
                        valueField: "id",
                    },
                    {
                        name: "to_position",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "to_work_shift",
                        data: "work_shifts",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.emp_id =
                                me.dataOptions.emp_id || me.dataOptions.employee?.id || p.emp_id;
                            p.change_branch = isChecked(p.change_branch) ? 1 : 0;
                            p.change_position = isChecked(p.change_position) ? 1 : 0;
                            p.change_salary = isChecked(p.change_salary) ? 1 : 0;
                            p.change_work_shift = isChecked(p.change_work_shift) ? 1 : 0;

                            if (
                                !p.change_branch &&
                                !p.change_position &&
                                !p.change_salary &&
                                !p.change_work_shift
                            ) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "Please select at least one change",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }
                            if (p.change_branch && !p.to_branch_id) {
                                cv_interact.warning(
                                    LocaleManager.trans("To Branch is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_position && !p.to_position_id) {
                                cv_interact.warning(
                                    LocaleManager.trans("To Position is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_salary && (p.new_salary === "" || p.new_salary == null)) {
                                cv_interact.warning(
                                    LocaleManager.trans("New Salary is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_work_shift && !p.to_work_shift_id) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "To Work Shift is required",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }

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
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose(p);
                                        }
                                        cv_interact.success("Set movement successfully");
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Movement",
                    modifyTitle: "Movement",
                    targetProp: "employee",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/emp-event/form-options"].join(""),
                        params: (op) => {
                            return {
                                id: op.id || null,
                                emp_id: op.emp_id || op.employee?.id || null,
                            };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    me._formData = data || {};
                    fillCurrentValues(me, me._formData);
                    if (typeof me.syncMovementSections === "function") {
                        me.syncMovementSections();
                    }
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ProfileMovementDialog

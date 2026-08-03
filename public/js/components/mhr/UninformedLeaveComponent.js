"use strict";
var UninformedLeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Uninformed Leaves";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_leave_uninformed_component",
    );

    mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_leave");
    // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
    mThis.elFilter_work_shift = mThis.self.querySelector("#el_work_shift");
    // mThis.elFilter_session = mThis.self.querySelector('#el_leave_session');
    mThis.elSearch = mThis.self.querySelector("#_uninformed_leave_search");
    mThis.divListView = mThis.self.querySelector("#_leave_uninformed_list");

    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-start text-nowrap",
            data: (data) => {
                return `
                    <div class="d-flex align-items-center">
                        <div>
                            <span class="fw-bold" style="font-size: 13px;">${data.emp_name ?? ""}</span>
                            <br/>
                            <span class="text-muted" style="font-size: 11px;">${data.emp_code ?? ""}</span>
                        </div>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-start",
            data: (data) => {
                return `
                    <div class="d-flex flex-column">
                        <span>${data.position_name ?? "-"}</span>
                    </div>
                `;
            },
        },

        {
            transTitle: "titles.Absent Period",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.date_period ?? data.start_date + " - " + data.end_date}
                    </span>
                `;
            },
        },

        {
            transTitle: "titles.Issue",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:250px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Attendance Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = data.status;
                let cls =
                    "badge text-warning bg-warning-subtle border border-warning";
                let statusText = data.status ?? "";

                if (status == "Pending") {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                } else if (
                    status === "Inactive" ||
                    status === "Uninformed" ||
                    status === "uninformed"
                ) {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                } else if (
                    status == "Active" ||
                    status === "Excused" ||
                    status === "excused"
                ) {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px"
                        data-status_id="${data.status_id}">
                        ${statusText}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Decision",
            className: "align-middle text-center",
            data: (data) => {
                let decision = null;
                let cls = "";

                if (data.remarks && data.remarks.toLowerCase().includes("warning issued")) {
                    decision = "Warning";
                    cls = "badge text-warning bg-warning-subtle border border-warning";
                } else if (parseFloat(data.deduction) > 0) {
                    decision = "Deduct";
                    cls = "badge text-danger bg-danger-subtle border border-danger";
                }

                if (!decision) {
                    return `<span class="text-muted">-</span>`;
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" 
                          style="min-width:70px;">
                        ${decision}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? '_'}</span><br/>
                <small >${data.updated_at ?? ""}</small>
            </div>`,
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn_leave_action"
                    data-id="${data.id}"
                    data-emp_id="${data.emp_id ?? ""}"
                    data-emp_name="${data.emp_name ?? ""}"
                    data-emp_salary="${data.emp_salary ?? 0.0}"
                    data-deduction="${data.deduction ?? 0.0}"
                    data-remarks="${data.remarks ?? ""}"
                    data-start_date="${data.start_date ?? ""}"
                    data-end_date="${data.end_date ?? ""}"
                    data-has_warning="${data.has_warning ?? 0}"
                    data-statusid="${data.status_id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="cursor: pointer; padding: 8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" ></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView("_leave_uninformed_list", {
            fetchApi: `${main_view.base_url}/mhr/leave/uninformed`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                },
            };

            UninformedLeaveDialog.show(op);
        };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();
        mThis.initDropdownMenus(mThis.tblLeaves);

        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }, 250);
        });

        const elStartDate = mThis.divFilter.querySelector(
            "[data-field='start_date']",
        );
        const elEndDate = mThis.divFilter.querySelector(
            "[data-field='end_date']",
        );
        if (elStartDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elStartDate);
        }
        if (elEndDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elEndDate);
        }

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            work_shift_id: mThis.elFilter_work_shift.value,
            // leave_type_id: mThis.elFilter_leaveType.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f == "start_date") p["date"] = el.value;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_uninformed_leave",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Excuse Reason"></span>',
                    icon: `<i class="fa-regular fa-circle-question fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "excuse_uninformed_leave",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Deduction"></span>',
                    icon: `<i class="fa-solid fa-file-invoice-dollar fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "deduct_uninformed_leave",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Warning"></span>',
                    icon: `<i class="fa-regular fa-bell fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "warning_uninformed_leave",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_uninformed_leave",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_uninformed_leave": {
                        //   if (!id) {
                        //       cv_interact.error("No leave request exists for this absence yet. Please approve/reject the status first.");
                        //       break;
                        //   }
                        mThis.editUninformedLeave(id, menuLink);
                        break;
                    }
                    case "excuse_uninformed_leave": {
                        mThis.excuseLeave(id, menuLink);
                        break;
                    }
                    case "deduct_uninformed_leave": {
                        mThis.deductLeave(id, menuLink);
                        break;
                    }
                    case "warning_uninformed_leave": {
                        mThis.warningLeave(id, menuLink);
                        break;
                    }
                    case "delete_uninformed_leave": {
                        // if (!id) {
                        //     cv_interact.error("No leave request exists for this absence yet.");
                        //     break;
                        // }
                        mThis.deleteUninformedLeave(id, menuLink);
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

    mThis.editUninformedLeave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            },
        };

        UninformedLeaveDialog.show(op);
    };

    mThis.deleteUninformedLeave = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage();
            },
        };
        cv_interact.confirm(
            "delete_uninformed",
            {
                title: "Delete Leave Request",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/leave/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_uninformed_success");
                                mThis.LeaveRequestListView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.excuseLeave = (id, menuLink) => {
        ExcuseLeaveDialog.show({
            id: id,
            btn: menuLink,
            onClose: (res) => {
                cv_interact.success(
                    res?.data?.message || "Leave excused successfully",
                );
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.deductLeave = (id, menuLink) => {
        let deduction = parseFloat(menuLink.dataset.deduction);
        if (deduction > 0) {
            cv_interact.error(
                "deduct_already_issued",
            );
            return;
        }

        DeductLeaveDialog.show({
            id: id,
            emp_id: menuLink.dataset.emp_id,
            employee: menuLink.dataset.emp_name,
            emp_salary: menuLink.dataset.emp_salary,
            deduction: menuLink.dataset.deduction,
            remarks: menuLink.dataset.remarks,
            start_date: menuLink.dataset.start_date,
            end_date: menuLink.dataset.end_date,
            btn: menuLink,
            onClose: (res) => {
                cv_interact.success(
                    res?.data?.message || "Leave deducted successfully",
                );
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.warningLeave = (id, menuLink) => {
        let has_warning = menuLink.dataset.has_warning;
        if (has_warning === "1" || has_warning === "true") {
            cv_interact.error(
                "Warning has already been issued for this absence.",
            );
            return;
        }

        let emp_id = menuLink.dataset.emp_id;
        let start_date = menuLink.dataset.start_date;
        let end_date = menuLink.dataset.end_date;

        let issues = `Uninformed Leave from ${start_date} to ${end_date}`;
        let temp_issues = issues;

        const onInputWarning = (e) => {
            if (e.target && e.target.name === "issues") {
                temp_issues = e.target.value;
            }
        };
        document.addEventListener("input", onInputWarning);

        let op = {
            id: null,
            emp_id: emp_id,
            warning_date: start_date,
            issues: issues,
            btn: menuLink,
            onClose: (arg1, arg2) => {
                document.removeEventListener("input", onInputWarning);

                let saved = false;
                if (typeof arg1 === "boolean") {
                    saved = arg1;
                } else if (arg1 && typeof arg1 === "object") {
                    saved = true;
                }

                if (!saved) return;

                // Update the leave status to refresh the last updated details
                const payload = {
                    id: id,
                    status_id: "uninformed",
                    remarks: `Warning issued: ${temp_issues}`,
                };

                vsapi
                    .call(
                        `${main_view.base_url}/mhr/leave/update-status`,
                        payload,
                        menuLink,
                        false,
                    )
                    .then((res) => {
                        mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                    });
            },
        };
        WarningDialog.show(op);
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/leave/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elFilter_work_shift,
                    d.work_shifts,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Work Shifts", "titles"),
                    "",
                );
                // VSUtil.setComboItems(mThis.elFilter_leaveType,d.leave_types,'id','leave_type',true,'All',null);
                onFinish(null);
            });
    };

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions(() => {
            mThis.LeaveRequestListView.showPage(
                mThis.getFilterData(),
                null,
                () => {
                    main_view.setContentView(mThis.self, mThis.title_prop);
                },
            );
        });
    };
    return mThis;
})();

const UninformedLeaveDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />
                                    <input name="employee" class="data-input form-control" data-field="employee" placeholder=" " autocomplete="off" />
                                    <label vslang="labels.Employee"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="employee_code" class="data-input form-control" data-field="emp_code" placeholder=" " disabled />
                                    <label vslang="labels.Employee Code">Employee Code</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="start_date" class="form-control data-input" data-field="start_date" required />
                                    <label vslang="labels.Start Date"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="end_date" class="form-control data-input" data-field="end_date" required />
                                    <label vslang="labels.End Date"></label>
                                </div>
                            </div>  
                            <div class="col-6 d-none">
                                <input data-style="material" name="leave_type" class="form-control data-input" placeholder="Leave Type"  data-field="leave_type_id"></input>
                            </div>
                            <div class="col-6 d-none">
                                <input data-style="material" name="status_id" class="form-control data-input" placeholder="Status"  data-field="status_id"></input>
                            </div>
                            
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label vslang="labels.Reason"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    me.searchEmployee = VSSearchInput.init(
                        me.controls.employee,
                        {
                            type: "select",
                            prefetch: true,
                            api: {
                                endpoint: `${main_view.base_url}/mhr/leave/form-options`,
                            },
                            processResponse: (res) => {
                                const employees = res?.data?.employees || [];
                                return (
                                    Array.isArray(employees) ? employees : []
                                ).map((i) => ({
                                    ...i,
                                    code: i.code || "",
                                    name: i.name || "",
                                }));
                            },
                            showColumnHeader: true,
                            columns: {
                                code: "Code",
                                name: "Name",
                            },
                            onSelect: (employee) => {
                                if (me.controls.employee_code) {
                                    me.controls.employee_code.value =
                                        employee.code || "";
                                }
                                if (me.controls.emp_id) {
                                    me.controls.emp_id.value =
                                        employee.id || "";
                                }
                                if (
                                    employee.work_shift_id &&
                                    me.controls.work_shift_id
                                ) {
                                    me.controls.work_shift_id.value =
                                        employee.work_shift_id;
                                    me.controls.work_shift_id.dispatchEvent(
                                        new Event("change"),
                                    );
                                    if (window.jQuery) {
                                        jQuery(
                                            me.controls.work_shift_id,
                                        ).change();
                                    }
                                }
                            },
                        },
                    );
                    me.searchEmployee.reset("");
                },
                configSelect: [
                    {
                        name: "work_shift_id",
                        data: "work_shift_name",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "leave_type",
                        data: "leave_types",
                        textField: "leave_type",
                        valueField: "id",
                        defaultValue: (me, op) => {
                            const leaveTypes = me.formOptionsData
                                ? me.formOptionsData.leave_types
                                : [];
                            const uninformedType = leaveTypes.find((t) =>
                                t.leave_type
                                    .toLowerCase()
                                    .includes("uninformed"),
                            );
                            return uninformedType ? uninformedType.id : null;
                        },
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            const payload = {
                                ...p,
                                leave_type_id: me.dataOptions.id
                                    ? p.leave_type_id
                                    : 6,
                                status_id: 4,
                            };
                            // console.log(1122, payload);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/leave/save",
                                    ].join(""),
                                    payload,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_uninformed_success",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "Set uninformed leave successfully",
                                            );
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Uninformed Leave",
                    modifyTitle: "vslang:titles.Modify Uninformed Leave",
                    targetProp: "leave_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/leave/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    me.formOptionsData = data;
                },
            });

        dialog.show(op);
    };

    return self;
})();

const ExcuseLeaveDialog = (() => {
    const self = {};

    self.show = (op) => {
        const dialog = new GeneralDialog({
            title: "vslang:titles.Excuse Leave Request",
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: (me) => {
                return `
                <div class="row g-3">
                    <div class="col-12">
                        <div class="vs-material-field">
                            <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" " required style="height: 100px;"></textarea>
                            <label vslang='titles.Excuse Reason'></label>
                        </div>
                    </div>
                </div>
                `;
            },
            buttons: [
                {
                    label: "    <span vslang='buttons.Cancel'></span>",
                    cssClass: "btn-vs-cancel",
                    click: (me) => {
                        me.hide(false);
                    },
                },
                {
                    label: "<span vslang='buttons.Save'></span>",
                    cssClass: "btn-vs-save",
                    click: (me, btn) => {
                        const p = me.getData();
                        const payload = {
                            id: me.dataOptions.id,
                            status_id: "excuse",
                            remarks: p.remarks,
                        };

                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/leave/update-status`,
                                payload,
                                btn,
                                false,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true);
                                    if (
                                        typeof me.dataOptions.onClose ===
                                        "function"
                                    ) {
                                        me.dataOptions.onClose(res);
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

const DeductLeaveDialog = (() => {
    const self = {};

    self.show = (op) => {
        if (typeof DeductionComponent === "undefined" || !DeductionComponent.DeductDialog) {
            cv_interact.error("Deduction dialog is not available.");
            return;
        }

        let temp_deduct = op.deduction || 0.0;
        let default_remarks = `Uninformed Leave (${op.start_date} to ${op.end_date})`;
        let temp_remarks = default_remarks;

        const onInputDeduct = (e) => {
            if (e.target) {
                if (e.target.name === "deduct_amount") {
                    temp_deduct = e.target.value;
                }
                if (e.target.name === "issues") {
                    temp_remarks = e.target.value;
                }
            }
        };
        document.addEventListener("input", onInputDeduct);
        document.addEventListener("change", onInputDeduct);

        const deductDialogOptions = {
            id: null,
            emp_id: op.emp_id || op.btn?.dataset?.emp_id,
            deduct_amount: op.deduction,
            deduct_date: op.start_date || op.end_date || "",
            issues: default_remarks,
            btn: op.btn,
            silentSuccess: true, // prevent double dialogs on save
            onClose: (arg1, arg2) => {
                document.removeEventListener("input", onInputDeduct);
                document.removeEventListener("change", onInputDeduct);

                let saved = false;
                if (typeof arg1 === "boolean") {
                    saved = arg1;
                } else if (arg1 && typeof arg1 === "object") {
                    saved = true;
                }

                if (!saved) return;

                let final_deduct = arg2?.deduct_amount || temp_deduct;
                let final_remarks = arg2?.issues || temp_remarks;

                // Fallback: read directly from modal inputs if still in DOM
                const domDeduct = document.querySelector('.vs-modal [name="deduct_amount"]');
                const domRemarks = document.querySelector('.vs-modal [name="issues"]');
                if (!final_deduct && domDeduct && domDeduct.value) final_deduct = domDeduct.value;
                if (!final_remarks && domRemarks && domRemarks.value) final_remarks = domRemarks.value;

                // If saved successfully, update leave status
                const payload = {
                    id: op.id,
                    status_id: "deduct",
                    remarks: final_remarks || default_remarks,
                    deduction: final_deduct || 0.0,
                };

                vsapi
                    .call(
                        `${main_view.base_url}/mhr/leave/update-status`,
                        payload,
                        op.btn,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code == 200) {
                            if (typeof op.onClose === "function") {
                                op.onClose(res);
                            }
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        };

        DeductionComponent.DeductDialog.show(deductDialogOptions);
    };

    return self;
})();

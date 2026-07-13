"use strict";
var StaffAttendanceComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_staffAttendanceComponent",
    );

    mThis.title_prop = "Staff Attendances";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddStaffAttendance");
    mThis.elSearch = mThis.self.querySelector("#_attendance_search");
    mThis.elWorkShift = mThis.self.querySelector("#work_shift");
    mThis.containerFilter = mThis.self.querySelector(
        "#_divFilter_staff_attendance",
    );
    mThis.divListView = mThis.self.querySelector("#_staff_attendance_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            title: "Staff ID",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.code}</span>`;
            },
        },
        {
            title: "Full Name",
            className: "name text-capitalize align-middle",
            data: (data, index, tr) => {
                const sex =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "Other";
                return `<p class="d-flex flex-column">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            title: "Position",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            title: "Date",
            className: "text-capitalize align-middle",
            data: (data, index, tr) => {
                return data.attendance_date ?? "";
            },
        },
        {
            title: "Work Shift",
            className: "text-capitalize align-middle",
            data: "work_shift",
        },
        {
            title: "Scan Info",
            className: "align-middle",
            data: (data) => {
                if (!Array.isArray(data.scan_info)) return "";
                return data.scan_info
                    .map((info) => {
                        const timeParts = info.time.split(":");
                        let hours = parseInt(timeParts[0]);
                        const minutes = timeParts[1];
                        const ampm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12;
                        const formattedTime = `${hours}:${minutes} ${ampm}`;

                        const isCheckIn = (info.scan_action || "").toLowerCase().includes("in");
                        const badgeClass = isCheckIn 
                            ? "border-success text-success" 
                            : "border-warning text-warning";

                        const shortAction = isCheckIn ? "IN" : "OUT";

                        return `
                            <span class="badge bg-transparent border ${badgeClass} px-2 py-1 me-1 mb-1 d-inline-flex align-items-center" style="font-size: 78%; font-weight: 500; text-transform: uppercase;">
                                ${shortAction}: ${formattedTime}
                            </span>
                        `;
                    })
                    .join("");
            },
        },
        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const status = data.attendance_status ?? "Present";
                let badgeClass = "bg-success text-white";
                if (status === "Late") {
                    badgeClass = "bg-warning text-dark";
                } else if (status === "Absent") {
                    badgeClass = "bg-danger text-white";
                } else if (status === "Leave" || status === "Permission" || status === "Half Day") {
                    badgeClass = "bg-info text-white";
                } else if (status === "Holiday" || status === "Weekend") {
                    badgeClass = "bg-secondary text-white";
                }
                return `<span class="badge ${badgeClass} rounded-pill px-2.5 py-1.5 d-inline-flex align-items-center" style="font-size: 75%; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">${status}</span>`;
            }
        },

        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_scan_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.StaffAttendanceListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/mhr/attendances/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                },
            };
            // if (!AuthManager.allowed(247)) return;
            StaffAttendanceDialog.show(op);
        };

        mThis.pr_tbl = mThis.StaffAttendanceListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/attendances/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elWorkShift,
                    d.work_shifts || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Shifts", "titles"),
                    "",
                );
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };
    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.StaffAttendanceListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const StaffAttendanceDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                             <div class="col-6">
                                 <div class="vs-material-field">
                                     <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />
                                     <input name="employee" class="data-input form-control" data-field="employee_name" placeholder=" " autocomplete="off" />
                                     <label vslang="labels.Employee"></label>
                                 </div>
                             </div>
                             <div class="col-6">
                                 <div class="vs-material-field">
                                     <input type="text" name="employee_code" class="data-input form-control" data-field="employee_code" placeholder=" " disabled />
                                     <label vslang="labels.Employee Code">Employee Code</label>
                                 </div>
                             </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="attendance_date" class="data-input form-control form_input" data-field="attendance_date" placeholder=" " />
                                    <label vslang="labels.Attendance Date">Attendance Date</label>
                                </div>
                            </div>
                             <div class="col-6">
                                 <select data-style="material" data-field="scan_action" name="scan_action" class="data-input form-control" placeholder="Attendance Type">
                                     <option value="Check In">Check In</option>
                                     <option value="Check Out">Check Out</option>
                                 </select>
                             </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="time" name="scan_time" class="data-input form-control form_input" data-field="scan_time" placeholder=" " />
                                    <label vslang="labels.Time">Time</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="work_shift_id" name="work_shift_id" class="data-input form-control" placeholder="Work Shift">
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="position_id" name="position_id" class="data-input form-control" placeholder="Position"></select>
                            </div>
                             <div class="col-6">
                                 <select data-style="material" data-field="attendance_status" name="attendance_status" class="data-input form-control" placeholder="Status"></select>
                             </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                    <label for="remark" vslang="titles.Remark"></label>
                                </div>
                            </div>

                         </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "work_shift_id",
                    data: "work_shifts",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "position_id",
                    data: "positions",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "attendance_status",
                    data: "attendance_statuses",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span class="text-warning">Cancel</span>',
                    cssClass: "btn btn-default",
                    click: (me, btn) => {
                        //Close with Cancel button
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
                                [
                                    main_view.base_url,
                                    "/mhr/attendances/save",
                                ].join(""),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    cv_interact.success(
                                        "Attendance save successfully",
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            contentCreated: (me, divModal) => {
                DateTimePicker.init(me.controls.attendance_date);

                me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                    type: "select",
                    prefetch: true,
                    api: {
                        endpoint: `${main_view.base_url}/mhr/attendances/form-options`,
                    },
                    processResponse: (res) => {
                        const employees = res?.data?.employees || [];
                        return (Array.isArray(employees) ? employees : []).map(
                            (i) => ({
                                ...i,
                                code: i.code || "",
                                name: i.name || "",
                            }),
                        );
                    },
                    showColumnHeader: true,
                    columns: {
                        code: "Code",
                        name: "Name",
                    },
                    onSelect: (employee) => {
                        if (me.controls.employee_code) {
                            me.controls.employee_code.value = employee.code || "";
                        }
                        if (me.controls.emp_id) {
                            me.controls.emp_id.value = employee.id || "";
                        }
                        if (employee.position_id && me.controls.position_id) {
                            me.controls.position_id.value = employee.position_id;
                            me.controls.position_id.dispatchEvent(new Event("change"));
                            if (window.jQuery) {
                                jQuery(me.controls.position_id).change();
                            }
                        }
                    },
                });
                me.searchEmployee.reset("");

                me.saveStaffAttendance = (p) => {
                    alert("Data saved.");
                };
            },
            prepareFormOptions: {
                createTitle: "Create Attendance",
                modifyTitle: "Modify Attendance",
                targetProp: "attendance",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/attendances/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log('result from api "/form-options": ', res);
                // },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
        });

        dialog.show(op);
    };

    return self;
})();

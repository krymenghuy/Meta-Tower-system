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
            className: "text-capitalize align-middle",
            data: (data) => {
                return data.scan_info
                    .map((info, index) => {
                        const timeParts = info.time.split(":");
                        let hours = parseInt(timeParts[0]);
                        const minutes = timeParts[1];
                        const ampm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12;
                        const formattedTime = `${hours}:${minutes} ${ampm}`;

                        return `
                            <div class="d-flex flex-column mb-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-primary-custom fw-bold" style="font-size: 80%;">${info.action_type}</small>
                                    <small class="text-info px-2" style="font-size: 80%;">→</small>
                                    <small class="text-success  fw-bold" style="font-size: 80%;">${formattedTime}</small>
                                </div>
                                ${index < data.scan_info.length - 1 ? '<hr class="my-1 border-primary-custom">' : ""}
                            </div>
                        `;
                    })
                    .join("");
            },
        },
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.StaffAttendanceListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/hr/attendances/list-paginate`,
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
                `${main_view.base_url}/hr/employee/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                let d = res.status_code === 200 ? res.data : {};

                if (d) {
                    mThis.containerFilter
                        .querySelectorAll(".filter-field")
                        .forEach((el) => {
                            const f = el.dataset.field;
                            switch (f) {
                                case "branch_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.branches,
                                        "id",
                                        "branch_name",
                                        null,
                                        null,
                                        1,
                                    );
                                    break;
                                case "emp_type_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.types || [],
                                        "id",
                                        "name",
                                        true,
                                        "All Type",
                                        null,
                                    );
                                    break;
                                case "department_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.departments,
                                        "id",
                                        "name",
                                        true,
                                        "All Department",
                                        null,
                                    );
                                    break;
                                case "work_shift_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.work_shifts,
                                        "id",
                                        "name",
                                        true,
                                        "All Shift",
                                        null,
                                    );
                                    break;
                                default:
                                    break;
                            }
                        });
                }
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
                                    <input name="employee" class="data-input form-control" data-field="employee_name"  placeholder="Employee" />
                                    <label vslang="labels.Employee"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" class="data-input form-control" data-field="employee_code" placeholder=" " disabled />
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
                                <select data-style="material" data-field="action_type" name="attendance_type" class="data-input form-control" placeholder="Attendance Type">
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
                                <select data-style="material" data-field="department_id" name="department_id" class="data-input form-control" placeholder="Department"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="status" name="status" class="data-input form-control" placeholder="Status"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea  type="text" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                    <label for="remark" vslang="titles.Remark"></label>
                                </div>
                            </div>

                         </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "employee",
                    data: "employees",
                    textField: (me, d) => {
                        return `<div class="d-flex gap-2 py-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span><span> ${d.position} </span> </div></div>`;
                    },
                    // textField:"name",
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
                                    "/hr/attendances/save",
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
                me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                    type: "select",
                    prefetch: true,
                    maxDropdownHeight: "380px",
                    
                    api: {
                        endpoint: `${main_view.base_url}/mhr/attendance/form-options`,
                    },
                    processResponse: (res) => {
                        const employees = res?.data?.employees || [];
                        return (Array.isArray(employees) ? employees : []).map(
                            (i) => ({
                                ...i,
                                code: i.emp_code || "",
                                name: i.emp_name || "",
                            }),
                        );
                    },
                    showColumnHeader: true,
                    columns: {
                        code: "Code",
                        name: "Name",
                        // legal_name: "Legal Name"
                    },
                    onSelect: (item) => {
                        const tenantId = item?.id || "";
                        const tenantName = item?.tenant || "";
                        const tenantCode = item?.code || "";
                        me.controls.tenant.value = tenantCode
                            ? `${tenantName} (${tenantCode})`
                            : tenantName;
                        me.controls.tenant.dataset.tenantId = tenantId;
                        me.tenant_id = tenantId;
                        me.controls.legal_name.value = item?.legal_name || "";
                    },
                });
                DateTimePicker.init(me.controls.attendance_date);

                me.saveStaffAttendance = (p) => {
                    alert("Data saved.");
                };
            },
            prepareFormOptions: {
                createTitle: "Create Attendance",
                modifyTitle: "Edit Attendance",
                targetProp: "attendance",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/attendances/form-options",
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

"use strict";
var EmployeeAttendanceComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_staffAttendanceComponent",
    );

    mThis.title_prop = "Employee Attendance";
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
            transTitle: "titles.Employee ID",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.emp_code ?? '_'}</span>`;
            },
        },
        {
            transTitle: "titles.Full Name",
            className: "align-middle",
            data: (data, index, tr) => {
                const sex = data.sex === "M" ? "Male" : data.sex === "F" ? "Female" : "Other";
                return `<p class="d-flex flex-column" style="width:120px;">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Work Shift",
            className: "text-nowrap align-middle",
            data: "work_shift",
        },
        {
            transTitle: "titles.Attendance Date",
            className: "text-nowrap align-middle",
            data: (data, index, tr) => {
                return data.attendance_date ?? "_";
            },
        },
    
        {
            title: "Scan Info",
            className: "align-middle text-center",
            data: (data) => {
                if (!Array.isArray(data.scan_info) || data.scan_info.length === 0) {
                    return '<span class="text-muted">-</span>';
                }

                return `
                    <div class="d-flex flex-column gap-2">
                        ${data.scan_info.map((info) => {

                            const timeParts = (info.time || "00:00").split(":");
                            let hours = parseInt(timeParts[0], 10);
                            const minutes = timeParts[1] || "00";

                            const ampm = hours >= 12 ? "PM" : "AM";
                            hours = hours % 12 || 12;

                            const formattedTime = `${hours}:${minutes} ${ampm}`;

                            let badgeClass = "bg-secondary text-secondary";

                            switch ((info.action || "").toLowerCase()) {
                                case "check in":
                                    badgeClass = "bg-success text-white";
                                    break;

                                case "check out":
                                    badgeClass = "bg-danger text-white";
                                    break;

                                case "break":
                                    badgeClass = "bg-warning text-white";
                                    break;
                            }

                            return `
                                <div class="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 bg-light">
                                    <span class="badge ${badgeClass}" style="width:80px;">
                                        ${info.action}
                                    </span>
                                    <span class="text-muted">
                                        <i class="fa-solid fa-arrow-right-long"></i>
                                    </span>
                                    <span class="text-muted small">
                                        <i class="fa-regular fa-clock me-1"></i>
                                        ${formattedTime}
                                    </span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                `;
            },
        },
        // {
        //     transTitle: "titles.Scan Time",
        //     className: "align-middle text-nowrap",
        //     data: (data) => {
        //         const time = data.scan_time;
        //         if (!time) return "";
        //         const timeParts = time.split(":");
        //         let hours = parseInt(timeParts[0]);
        //         const minutes = timeParts[1];
        //         const ampm = hours >= 12 ? "PM" : "AM";
        //         hours = hours % 12 || 12;
        //         const formattedTime = `${hours}:${minutes} ${ampm}`;
        //         return `<span class="d-block text-prm-custom">${formattedTime}</span>`;
        //     },
        // },
        // {
        //     transTitle: "titles.Status",
        //     className: "align-middle",
        //     data: (data) => {
        //         const status = data.scan_action || "";
        //         let badgeClass = "bg-success-subtle text-success border border-success";
        //         if (status === "Check In") {
        //             badgeClass = "bg-success-subtle text-success border border-success";
        //         } else if (status === "Check Out") {
        //             badgeClass = "bg-danger-subtle text-danger border border-danger";
        //         }
        //         return `<span class="badge ${badgeClass} px-2.5 py-1.5 d-inline-flex align-items-center justify-content-center" style="min-width: 100px; font-size: 75%; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">${status}</span>`;
        //     }
        // },

        // {
        //     className: 'col_action align-middle',
        //     data: function (data, row, display) {
        //         return `
        //             <div class="d-flex justify-content-center align-items-center">
        //                 <div class="text-center gap-2 d-flex flex-wrap">
        //                         <a href="javascript:void(0)" class="btn_attendance_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
        //                             <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
        //                     </a>
        //                 </div>
        //             </div>
        //         `;
        //     }
        // },

        

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
        mThis.initDropdownMenus(mThis.pr_tbl);
        const elDate = mThis.containerFilter.querySelector("[data-select='datepicker']");
        if (elDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elDate);
        }
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
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

     mThis.initDropdownMenus = (table)=>{
        const menuOptions = {
            containerElement: table,
            actionButtonClass:"btn_attendance_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Attendance"></span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_attendance"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Attendance"></span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_attendance"
                },
            ],
        //     adjustPosition:{
        //         top:-200 ,
        //         left:-300
        //    },

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_attendance':{
                      mThis.editAttendance(id, menuLink);
                      break;
                    }
                    case 'delete_attendance':{
                        mThis.deleteAttendance(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }

    mThis.editAttendance = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(241)) return;
        StaffAttendanceDialog.show(op);
    }

    mThis.deleteAttendance = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('delete_attendance?',{
            title: 'Delete Attendance Record.',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/attendances/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('attendance_delete_successfully');
                        mThis.StaffAttendanceListView.showPage();
                    } else {
                        cv_interact.error(res.error_message || 'An error occurred while deleting');
                    }
                })
            }
        });
    }

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
                                 <select data-style="material" data-field="scan_action" name="scan_action" class="data-input form-control" placeholder="${LocaleManager.trans('Action', 'labels')}">
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
                                <select data-style="material" data-field="work_shift_id" name="work_shift_id" class="data-input form-control" placeholder="${LocaleManager.trans('Work Shift', 'titles')}" disabled></select>
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="position_id" name="position_id" class="data-input form-control" placeholder="${LocaleManager.trans('Position', 'labels')}" disabled></select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="session" class="data-input form-control" data-field="session" placeholder=" " />
                                    <label vslang="labels.Session"></label>
                                </div>
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
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn-vs-cancel",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn-vs-save",
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
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "attendance_update_successfully",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "attendance_create_successfully",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            contentCreated: (me, divModal) => {
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
                        console.log("Selected employee:", employee);
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
                        if (employee.work_shift_id && me.controls.work_shift_id) {
                            me.controls.work_shift_id.value = employee.work_shift_id;
                            me.controls.work_shift_id.dispatchEvent(new Event("change"));
                            if (window.jQuery) {
                                jQuery(me.controls.work_shift_id).change();
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
                createTitle: "vslang:titles.Set Attendance",
                modifyTitle: "vslang:titles.Modify Attendance",
                
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
             
            },

            onPrepareForm: (me, data) => {
            },
        });

        dialog.show(op);
    };

    return self;
})();

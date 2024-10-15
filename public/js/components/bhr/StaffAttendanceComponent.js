"use strict";

var StaffAttendanceComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_staffAttendanceComponent");
    this.self = this.jm[0];
    this.title_prop = "Staff Attendance";
    this.btnAdd = this.self.querySelector("#_btnAddStaffAttendance");
    this.elSearch = this.self.querySelector("#_staff_attendance_search");
    this._searchAttendance = this.self.querySelector("#search");
    this.btnSearch = mThis.self.querySelector("#_sdl_btnSearch");

    this.cols = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Name",
            className: "align-middle text-start",
            data: (data) => `
                <div style="display: flex; align-items: center;">
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.name ?? ""
                        }</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`,
        },
        {
            title: "Check in",
            className: "align-middle",
            data: "check_in_time",
        },
        {
            title: "attendance date",
            className: "align-middle",
            data: "attendance_date",
        },
        {
            title: "Status",
            className: "align-middle",
            data: "status_id",
        },
        {
            title: "Remark",
            className: "align-middle",
            data: "remark",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_staffAttendance_action"
                        }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                            <img src="${
                                main_view.asset_url
                            }/images/icons/more_vert (3).svg" />
                        </a>
                    </div>
                </div>`,
        },
    ];

    // Initialize component
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.StaffAttendanceListView = new ListView("_staff_attendance_list", {
            fetchApi: `${mThis.base_url}/hr/attendances/list-paginate`,
            perPage: 6,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
            rowCreated: (data, index, tr) => {
                console.log(123, data);

                tr.dataset.id = data.id; // recode data
            },
            renderComplete: () => {
                mThis.initDropdownMenus(
                    mThis.StaffAttendanceListView.getTable()
                );
            },
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.StaffAttendanceListView.showPage();
                },
            };
            StaffAttendanceDialog.show(op);
        };
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.StaffAttendanceListView) {
                mThis.StaffAttendanceListView.showPage(
                    mThis.getDataFormFilter()
                );
            } else {
                console.error("Staff is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = (e) => {
        if (mThis.StaffAttendanceListView) {
            mThis.StaffAttendanceListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("Staff  is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchAttendance.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p.search_value, main_filters);

        return p;
    };
    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_staffAttendance_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit StaffAttendance">Edit Staff Attendance</span>',
                    icon: `<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "edit_staff_attendance",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete StafAttendance">Delete Staff Attendance</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_staff_attendance",
                },
            ],
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_staff_attendance": {
                        mThis.editStaffAttendance(id, menulink);
                        break;
                    }
                    case "delete_staff_attendance": {
                        mThis.deleteStaffAttendance(id, menulink);
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

    this.editStaffAttendance = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage();
            },
        };
        StaffAttendanceDialog.show(op);
    };
    this.deleteStaffAttendance = (id, menulink) => {
        console.log(13456, id, menulink);

        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Attendance?",
            {
                title: "Delete this Attendance?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/attendances/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Attendances Delete Successfully");
                                mThis.StaffAttendanceListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/attendances/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.StaffAttendanceListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };

    // Save attendances function
    this.saveStaffAttendance = function () {
        return new Promise((resolve, reject) => {
            // Get form values
            let emp_id = document.getElementById("emp_id").value;
            let attendance_date =
                document.getElementById("attendance_date").value;
            let check_in_time = document.getElementById("check_in_time").value;
            let check_out_time =
                document.getElementById("check_out_time").value;
            let remark = document.getElementById("remark").value;
            // Validate the inputs
            if (
                !emp_id ||
                !attendance_date ||
                check_in_time ||
                check_out_time ||
                !remark
            );
            let staffAttendance = {
                emp_id: emp_id,
                attendance_date: attendance_date,
                check_in_time: check_in_time,
                check_out_time: check_out_time,
                remark: remark,
            };

            // API call to save the attendances to the database
            vsapi
                .call(`${mThis.base_url}/hr/attendances/save`, staffAttendance)
                .then((response) => {
                    if (response.status_code === 200) {
                        cv_interact.success(
                            "New attendances saved successfully."
                        );
                        resolve(true);
                    } else {
                        cv_interact.error(response.error_message);
                        // reject(response.error_message);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                    cv_interact.error(
                        "Failed to save attendances. Please try again."
                    );
                    reject(error);
                });
        });
    };
})();

const StaffAttendanceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: "Add Staff Attendance",
                createContent: () => {
                    return [
                        `<form id="staffAttendanceForm">    
                            <div class="mb-3">
                                <label for="emp_id" class="form-label">Employee Id</label>
                                <input type="number" class="form-control data-input" data-field="id" id="emp_id" placeholder="Input Employee Id" required>
                            </div>
                            <div class="mb-3">
                                <label for="check_in_time" class="form-label">Check In Time</label>
                                <input type="time" class="form-control data-input" data-field="check_in_time" id="check_in_time" placeholder="Input Check In Time" required>
                            </div>
                            <div class="mb-3">
                                <label for="check_out_time" class="form-label">Check Out Time</label>
                                <input type="time" class="form-control data-input" data-field="check_out_time" id="check_out_time" placeholder="Input Check Out Time" required>
                            </div>
                            <div class="mb-3">
                                <label for="attendance_date" class="form-label">Attendance Date</label>
                                <input type="date" class="form-control data-input" data-field="attendance_date" id="attendance_date" placeholder="Select Attendance Date" required>
                            </div>
                            <div class="mb-3">
                                <label for="remark" class="form-label">Remark</label>
                                <textarea class="form-control data-input" data-field="remark" id="remark" rows="2" placeholder="Input remark" required></textarea>
                            </div>     
                        </form>`,
                    ].join("");
                },
                buttons: [
                    {
                        name: "cancel",
                        label: "Cancel",
                        click: (me, btn, divModal) => {
                            me.hide(true);
                        },
                    },
                    {
                        name: "save",
                        label: "Save",
                        click: (me, btn, divModal) => {
                            // Validate form before saving
                            const staffAttendanceForm = document.getElementById(
                                "staffAttendanceForm"
                            );
                            if (!staffAttendanceForm.checkValidity()) {
                                staffAttendanceForm
                                    .reportValidity()
                                    .then((result) => {});
                                // return;
                            }

                            // Call JobLevel function to save data to the database
                            StaffAttendanceComponent.saveStaffAttendance();

                            // Hide dialog after saving
                            me.hide(true);
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveStaffAttendance = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Staff Attendance",
                    modifyTitle: "Edit Staff Attendance",
                    targetProp: "staff_attendance",
                    api: {
                        endpoint:
                            main_view.base_url + "/hr/attendances/form-options",
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (res) => {
                        console.log(2355777, res);
                    },
                },
            });

        dialog.show(op);
    };
    return self;
})();

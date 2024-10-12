"use strict";

var StaffAttendanceComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_staffAttendanceComponent");
    this.self = this.jm[0];
    this.title_prop = "Staff Attendance";

    this.cols = [
        {
            title: "NO",
            className: "align-middle",
            data: "id",
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
            title: "Leave Type",
            className: "align-middle",
            data: "leave_type",
        },
        {
            title: "start sate",
            className: "align-middle",
            data: "start_date",
        },
        {
            title: "end date",
            className: "align-middle",
            data: "end_date",
        },
        {
            title: "reason",
            className: "align-middle",
            // data: (data) => `reason: ${data.reason}`,
            data: "reason",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
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
            fetchApi: `${mThis.base_url}/hr/leave-management/list-paginate`,
            perPage: 6,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id; // recode data
            },
            renderComplete: () => {
                mThis.initDropdownMenus(
                    mThis.StaffAttendanceListView.getTable()
                );
            },
        });

        // Event binding for add leave-management button
        // mThis.btnAddStaff Attendance.onclick = () => {
        //     let op = {
        //         id: null,
        //         onClose: (p) => {
        //             mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
        //         },
        //     };
        //     Staff AttendanceDialog.show(op);
        // };
        // mThis.elSearch.addEventListener("keyup", (e) => {
        //     clearTimeout(mThis.search_timeout);
        //     mThis.search_timeout = setTimeout(() => {
        //         if (mThis.StaffAttendanceListView) {
        //             mThis.StaffAttendanceListView.showPage(mThis.getDataFormFilter());
        //         } else {
        //             console.error("StaffAttendanceListView is not defined");
        //         }
        //     }, 200);
        // });

        // this.getDataFormFilter = () => {
        //     let p = {};
        //     p.search_value = mThis.elSearch.value;
        //     return p;
        // };
        mThis.initAlready = true;
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
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_staff_attendance": {
                        mThis.editStaffAttendance(id, menuLink);
                        break;
                    }
                    case "delete_staff_attendance": {
                        mThis.deleteStaffAttendance(id, menuLink);
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

    this.getFilterData = () => {
        return {};
    };

    this.editStaffAttendance = (id) => {
        let op = {
            id: id,
            onClose: (p) => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            },
        };
        StaffAttendanceDialog.show(op);
    };
    this.deleteStaffAttendance = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage();
            },
        };
        cv_interact.confirm(
            "Do you want to delete this Staff Attendance?",
            {
                title: "Delete Staff Attendance",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/leave-management/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.StaffAttendanceListView.showPage();
                            }
                        });
                }
            }
        );
    };

    // Show component
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.StaffAttendanceListView.showPage(
            mThis.getFilterData(),
            null,
            () => {
                mThis.jm.siblings().hide();
                mThis.jm.fadeIn(200);
            }
        );
    };

    // Save leave-management function
    this.saveStaffAttendance = function () {
        return new Promise((resolve, reject) => {
            // Get form values
            let employeeId = document.getElementById("employeeId").value;
            let leave_type = document.getElementById("leave_types").value;
            let reason = document.getElementById("reason").value;
            // Validate the inputs
            if (!employeeId || !leave_type || !reason) {
                return cv_interact.error("Please fill all required fields.");
            }

            let staffAttendance = {
                emp_id: employeeId,
                leave_type_id: leave_type,
                reason: reason,
            };

            // API call to save the leave-management to the database
            vsapi
                .call(`${mThis.base_url}/hr/leave-management/save`, staffAttendance)
                .then((response) => {
                    if (response.status_code === 200) {
                        cv_interact.success("New leave-management saved successfully.");
                        resolve();
                    } else {
                        cv_interact.error(response.error_message);
                        reject(response.error_message);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                    cv_interact.error(
                        "Failed to save leave-management. Please try again."
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
                                <label for="empId" class="form-label">Employee Id</label>
                                <input type="number" class="form-control data-input" data-field="id" id="employeeId" placeholder="Input Employee Id" required>
                            </div>
                            <div class="mb-3">
                                <label for="leave_type" class="form-label">Leave Type</label>
                                <select type="number" class="form-control" id="leave_type" placeholder="Input leave type id"></select>
                            </div>
                            <div class="mb-3">
                                <label for="reason" class="form-label">Reason</label>
                                <textarea class="form-control data-input" data-field="issues" id="reason" rows="2" placeholder="Input reason here" required></textarea>
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
                                staffAttendanceForm.reportValidity();
                                return;
                            }

                            // Call saveStaff Attendance function to save data to the database
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
                    targetProp: "staffAttendance",
                    api: {
                        endpoint:
                            main_view.base_url +
                            "/hr/leave-management/form-options",
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (res) => {
                        console.log(2355, res);
                    },
                },
            });

        dialog.show(op);
    };
    return self;
})();

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
                <img class="image-student-tbl" src="${data.image_url}" alt="" 
                    style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
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
            title: "Check Out",
            className: "align-middle",
            data: "check_out_time",
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
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
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
        const pr_tbl = mThis.StaffAttendanceListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = window.innerHeight - 235 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);

        mThis._searchAttendance.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.StaffAttendanceListView.showPage(mThis.getDataFormFilter());
        });
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
    this.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
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
                                cv_interact.success(
                                    "Attendances Delete Successfully"
                                );
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
                console.log(1111, this.elSortBy);
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
})();

const StaffAttendanceDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Name"></label>
                                <select name="employee" class=" data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group  col-12 d.none">
                               <div id="info"></div>
                            </div>
                            <div class="form-group col-6">
                                <label for="check_in_time" class="form-label" vslang="titles.Check In Time">Check In Time</label>
                                <input type="time" name="check_in_time" class="form-control data-input" data-field="check_in_time" />
                            </div>
                            <div class="form-group col-6">
                                <label for="check_out_time" class="form-label" vslang="titles.Check Out Time">Check Out Time</label>
                                <input type="time" name="check_out_time" class="form-control data-input" data-field="check_out_time" />
                            </div>
                            <div class="form-group col-12">
                                <label for="attendance_date" class="form-label">Attendance Date</label>
                                <input type="date" class="form-control data-input" data-field="attendance_date" id="attendance_date" placeholder="Select Attendance Date" required>
                            </div>
                            <div class="form-group col-12">
                                <label for="remark" class="form-label" vslang="titles.Reason"></label>
                                <textarea  type="text" class="form-control data-input" data-field="remark"></textarea>
                            </div>

                         </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    //Convert field to be DatePicker : check_in_time and check_out_time
                    DateTimePicker.init(me.controls.check_in_time);
                    DateTimePicker.init(me.controls.check_out_time);
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2 py-2"><img style="width:80px;height:50px margin-top:100px;margin-right:10px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span> ${d.position} </span> </div></div>`;
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

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/attendances/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                    StaffAttendanceComponent.saveStaffAttendance();
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveStaffAttendance = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Attendance",
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
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
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

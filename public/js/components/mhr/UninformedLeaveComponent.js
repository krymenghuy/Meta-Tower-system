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
            transTitle: "titles.Staff Information",
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
            transTitle: "titles.Work Shift",
            className: "align-middle text-start",
            data: (data) => {
                return `
                    <div class="d-flex flex-column">
                        <span>${data.work_shift_name ?? "-"}</span>
                        <small class="text-muted">${data.work_shift_time ?? ""}</small>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Absent Period",
            className: "align-middle text-center",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.start_date ?? "-"} - ${data.end_date ?? "-"}
                    </span>
                `;
            },
        },
       
         {
            transTitle: "titles.Reason",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            className: 'col_action align-middle text-center',
            data: (data) => {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <a href="javascript:void(0)" class="btn_leave_action"
                           data-id="${data.id ?? ''}"
                           data-status_id="${data.status_id ?? ''}"
                           data-emp_id="${data.emp_id ?? ''}"
                           data-start_date="${data.start_date ?? ''}"
                           data-end_date="${data.end_date ?? ''}">
                            <i class="fa-solid fa-ellipsis-vertical text-dark fs-5"></i>
                        </a>
                    </div>
                `;
            }
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView("_leave_uninformed_list", {
            fetchApi: `${main_view.base_url}/mhr/leave/uninformed`,
            perPage: 3,
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
                    html: '<span class="ps-2  " vslang="titles.Modify Uninformed Leave">Modify Leave Request</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_uninformed_leave",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Uninformed Leave">Delete Leave Request</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_uninformed_leave",
                },
            ],
            adjustPosition: {
                top: -200,
                left: -300,
            },

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

    mThis.changeStatus = (id, lnk) => {
        let tr = lnk.closest("tr");
        let status_id = Validator.properCase(lnk.dataset.status_id ?? "");
        let emp_id = lnk.dataset.emp_id;
        let start_date = lnk.dataset.start_date;
        let end_date = lnk.dataset.end_date;

        let inputOptions = {
            title: "Set Leave Request Status",
            dataLabel: "Leave status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {
                    status_id: "2",
                    name: "Approved",
                },
                {
                    status_id: "3",
                    name: "Rejected",
                },
            ],
            defaultValue: status_id,
        };

        InputBox2.show(inputOptions, (d) => {
            if (d) {
                let p = {
                    id: id,
                    status_id: d.value,
                    emp_id: emp_id,
                    start_date: start_date,
                    end_date: end_date,
                };

                vsapi
                    .call(`${mThis.base_url}/mhr/leave/update-status`, p)
                    .then((res) => {
                        if (res.status_code === 200) {
                            InputBox2.close();
                            cv_interact.success(
                                "The leave request status has been updated",
                            );
                            mThis.LeaveRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else cv_interact.error(res.error_message);
                    });
            }
        });
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
            "Delete this leave request?",
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
                                cv_interact.success("Deleted successfully");
                                mThis.LeaveRequestListView.showPage();
                            }
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            },
        );
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
                    true,
                    "All Work Shifts",
                    d.work_shifts[0].id,
                );
                // VSUtil.setComboItems(mThis.elFilter_session,d.sessions,'id','session',true,'All Sessions',null);
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
                                    <label>Start Date</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="end_date" class="form-control data-input" data-field="end_date" required />
                                    <label>End Date</label>
                                </div>
                            </div>
                            
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label>Reason</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                        type: "select",
                        prefetch: true,
                        api: {
                            endpoint: `${main_view.base_url}/mhr/leave/form-options`,
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
                            const leaveTypes = me.formOptionsData ? me.formOptionsData.leave_types : [];
                            const uninformedType = leaveTypes.find(t => t.leave_type.toLowerCase().includes('uninformed'));
                            return uninformedType ? uninformedType.id : null;
                        }
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

                            p.id = me.dataOptions.id;
                            const payload = {
                                ...p,
                                leave_type_id:  me.dataOptions.id ? p.leave_type_id : 6,
                                status_id: me.dataOptions.id ? p.status_id : 4
                            }

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
                                                "Updated uninformed leave successfully",
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

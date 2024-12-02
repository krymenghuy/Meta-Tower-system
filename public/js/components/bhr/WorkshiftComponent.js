"use strict";

var WorkshiftComponent = new (function () {
    const mThis = this;
    this.title_prop = "Work Shifts";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_workshiftComponent");
    this.self = this.jm[0];
    this.elSearch = this.self.querySelector("#_work_shift_search");
    this.btnAddShiftDetail = this.self.querySelector("#_btnAddShiftDetail");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.work_shift_header = this.self.querySelector("#_work_shift_header");
    this.elFilter_status = this.self.querySelector("#el_work_shift");
    const list_container = mThis.self.querySelector("#_work_shift_body");
    const header_container = mThis.self.querySelector("#_work_shift_header");

    this.init = function () {
        if (mThis.initAlready) return;

        let html = `
        <div class="_work_shift_header" id="_work_shift_header">
            <div id="work_shift_type" class="col-12 p-3 border d-flex">
                <div class="shift_date col-1-5">Monday</div>
                <div class="shift_date col-1-5">Tuesday</div>
                <div class="shift_date col-1-5">Wednesday</div>
                <div class="shift_date col-1-5">Thursday</div>
                <div class="shift_date col-1-5">Friday</div>
                <div class="shift_date col-1-5">Saturday</div>
                <div class="shift_date col-1-5">Sunday</div>
            </div>
        </div>`;
        header_container.innerHTML = html;

        mThis.btnAddShiftDetail.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Save Shift Detail successfully");
                    mThis.updateWorkshiftList();
                },
            };
            ShiftDetailDialog.show(op);
        };
        mThis.elFilter_status
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.WorkshiftListView.showPage(mThis.getFilterData());
                };
            });
        const sh_parent = list_container;
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(list_container);
        mThis.initAlready = true;
    };
    mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
        el.onchange = (e) => {
            e.preventDefault();
            vsapi
                .call(
                    `${main_view.base_url}/hr/shift-details/list-paginate`,
                    mThis.getFilterData(),
                    null,
                    null
                )
                .then((res) => {
                    const d = res.status_code == 200 ? res.data : {};
                    console.log(12321, d);

                    mThis.renderWorkShift(list_container, d);
                });
            console.log(1111, mThis.getFilterData());
        };
    });
    mThis.updateWorkshiftList = () => {
        vsapi
            .call(
                `${mThis.base_url}/hr/shift-details/list-paginate`,
                mThis.getFilterData(),
                null,
                null
            )
            .then((res) => {
                if (res.status_code === 200) {
                    mThis.renderWorkShift(list_container, res.data);
                }
            });
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WorkshiftListView) {
                mThis.WorkshiftListView.showPage(mThis.getFilterData());
            } else {
                console.error("shift-details is not defined");
            }
        }, 200);
    });

    this.renderWorkShift = (div, data) => {
        data = data ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seem to work properly. You may need to refresh the page"
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.beginRenderWorkShift(div, data);
        });
    };
    this.beginRenderWorkShift = (div, data) => {
        let html = `
        <div class="_work_shift_body col-12">
            <div class="row">
    `;

        for (const [day, shifts] of Object.entries(data)) {
            html += `
            <div class="time_cards col-2">
                <div class="day_card">
        `;

            if (shifts.length === 0) {
                html += `<div class="card p-4 bg-secondary no_shifts">No Shift</div>`;
            } else {
                shifts.forEach((shift) => {
                    const actionClass =
                        shift.action === "Check In" ||
                        shift.action === "CheckIn"
                            ? "bg-green"
                            : shift.action === "Check Out" ||
                              shift.action === "CheckOut"
                            ? "bg-gold"
                            : "";

                    html += `
                    <div class="shift_card ${actionClass}">
                        <div class="shift_element">
                            <div class="shift_time">${shift.time}</div>
                            <div class="shift_action">${shift.action}</div>
                        </div>
                        <div class="d-flex justify-content-start align-items-start">
                            <div class="text-end gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="${
                                    shift.action_id > 1
                                        ? "d-none"
                                        : "btn_shift-details_action"
                                }" data-id="${shift.id}" data-statusid="${
                        shift.status_id
                    }" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5 "></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                });
            }

            html += `
                </div>
            </div>
        `;
        }

        html += `
            </div>
        </div>
    `;

        div.innerHTML = html;
    };
    this.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
            work_shift_id: mThis.elFilter_status.value,
        };
        mThis.elFilter_status
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_shift-details_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit WorkShift">Edit WorkShift</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_shift-details",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete WorkShift">Delete WorkShift</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_shift-details",
                },
            ],
            onClick: (menuLink, id, name) => {
                console.log(1, menuLink, 2, id, 3, name);

                switch (name) {
                    case "edit_shift-details": {
                        mThis.editWorkShift(id, menuLink);
                        break;
                    }
                    case "delete_shift-details": {
                        mThis.deleteWorkShift(id, menuLink);
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

    this.editWorkShift = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Save Shift Detail successfully");
                mThis.updateWorkshiftList();
            },
        };
        console.log(3929, op);

        ShiftDetailDialog.show(op);
    };
    this.deleteWorkShift = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
        };
        cv_interact.confirm(
            "Are you sure you want to delete this WorkShift?",
            {
                title: "Delete WorkShift",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (isConfirmed) => {
                if (isConfirmed) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/shift-details/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success(
                                    "WorkShift deleted successfully!"
                                );
                                mThis.updateWorkshiftList();
                            } else {
                                cv_interact.error(
                                    "Failed to delete the WorkShift. Please try again."
                                );
                            }
                        })
                        .catch((error) => {
                            console.error("Error deleting WorkShift:", error);
                            cv_interact.error(
                                "An unexpected error occurred. Please try again."
                            );
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/shift-details/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data;
                    VSUtil.setComboItems(
                        mThis.elFilter_status,
                        d.shifts,
                        "id",
                        "name",
                        false,
                        null,
                        1
                    );
                }
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.jm.siblings().hide();
        mThis.jm.hide().fadeIn(250);
    };
})();
const ShiftDetailDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static", // User click outside form, do not close form
            keyboard: true, // Prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row">
                            <div class="form-group col-md-12">
                                <label for="shifts" class="form-label" vslang="titles.Work Shift"></label>
                                <span class="text-danger">*</span>
                                <select class="form-control data-input" name="shifts" data-field="work_shift_id"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <div name="day" class="d-flex week data-input" data-field="day">
                                    <div class="days" data-value="Mon">Mon</div>
                                    <div class="days" data-value="Tue">Tue</div>
                                    <div class="days" data-value="Wed">Wed</div>
                                    <div class="days" data-value="Thu">Thu</div>
                                    <div class="days" data-value="Fri">Fri</div>
                                    <div class="days" data-value="Sat">Sat</div>
                                    <div class="days" data-value="Sun">Sun</div>
                                </div>
                                
                            </div>
                            <div class="form-group col-12">
                                <label for="time" class="form-label" vslang="titles.Time">Time</label>
                                <input type="time" class="form-control data-input" data-field="time" />
                            </div>                                                                     
                            <div class="form-group col-12">
                                <label for="action" class="form-label" vslang="titles.Action">Action</label>
                                <select class="modal-select data-input form_input" data-field="action">
                                    <option value="Check In">Check In</option>
                                    <option value="Check Out">Check Out</option>
                                </select>
                            </div>                                                                     
                         </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                const days = me.divModal.querySelectorAll(".days");
                days.forEach((day) => {
                    day.addEventListener("click", () => {
                        day.classList.toggle("active");
                    });
                });

                if (op.days) {
                    const selectedDays = op.days.split("|");
                    days.forEach((day) => {
                        if (selectedDays.includes(day.dataset.value)) {
                            day.classList.add("active");
                        }
                    });
                }
            },

            configSelect: [
                {
                    name: "shifts",
                    data: "shifts",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span class="text-shift-details">Cancel</span>',
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
                        console.log(9090, p);
                        const selectedDays = [];
                        const days =
                            me.divModal.querySelectorAll(".days.active");
                        days.forEach((day) => {
                            selectedDays.push(day.dataset.value);
                        });
                        p.days = selectedDays.join("|");
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/hr/shift-details/save",
                                ].join(""),
                                p,
                                btn,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],

            prepareFormOptions: {
                createTitle: "Add Shift Details",
                modifyTitle: "Edit Shift Details",
                targetProp: "shift_details",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/shift-details/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                onResponse: (me, res) => {
                    console.log('Result from API "/form-options": ', res);
                },
            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.divModal.querySelectorAll(".data-input").forEach((el) => {
                    const data_member = el.dataset.field;
                    const id = op.id;
                    if (id) {
                        const days = me.divModal.querySelectorAll(".days");

                        days.forEach((day) => {
                            if (data.shift_details.day == day.dataset.value) {
                                day.classList.add("active");
                            } else day.classList.remove("active");

                            day.classList.add("disabled");
                        });

                        if (el.tagName.toLowerCase() === "select") {
                            if (
                                data_member == "shifts" ||
                                data_member == "work_shift_id" ||
                                data_member == "emp_type_id"
                            ) {
                                el.setAttribute("disabled", true);
                            }
                        }
                        id = null;
                    } else {
                        const days = me.divModal.querySelectorAll(".days");
                        days.forEach((day) => {
                            day.classList.remove("disabled");
                        });
                    }
                });
            },
        });

        dialog.show(op);
    };

    return self;
})();

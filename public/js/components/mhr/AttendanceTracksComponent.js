"use strict";
var AttendanceTracksComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Attendance Track";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_work_shiftComponent",
    );

    mThis.btnAddShiftDetail = mThis.self.querySelector("#_btnAddShiftDetail");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.work_shift_header = mThis.self.querySelector("#_work_shift_header");
    mThis.elFilter_status = mThis.self.querySelector("#el_work_shift");
    const list_container = mThis.self.querySelector("#_work_shift_body");
    const header_container = mThis.self.querySelector("#_work_shift_header");

    mThis.init = function () {
        if (mThis.initAlready) return;
        mThis.WorkshiftListView = () => {
            vsapi
                .call(
                    `${mThis.base_url}/mhr/shift-details/list-paginate`,
                    mThis.getFilterData(),
                    null,
                    null,
                )
                .then((res) => {
                    if (res.status_code === 200) {
                        mThis.renderWorkShift(list_container, res.data);
                    }
                });
        };

        let html = `
        <div class="_work_shift_header">
            <div id="work_shift_type" class="col-12 p-3 border d-flex justify-content-between text-center align-items-center mb-3 gap-2">
                <div class="shift_date col p-2 text-center">Monday</div>
                <div class="shift_date col p-2 text-center">Tuesday</div>
                <div class="shift_date col p-2 text-center">Wednesday</div>
                <div class="shift_date col p-2 text-center">Thursday</div>
                <div class="shift_date col p-2 text-center">Friday</div>
                <div class="shift_date col p-2 text-center">Saturday</div>
                <div class="shift_date col p-2 text-center">Sunday</div>
            </div>
        </div>`;
        header_container.innerHTML = html;

        mThis.btnAddShiftDetail.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success(
                        "Scanpoint has been saved successfully!",
                    );
                    mThis.WorkshiftListView();
                },
            };
            if (!AuthManager.allowed(487)) return;
            ShiftDetailDialog.show(op);
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.WorkshiftListView(mThis.getFilterData());
            };
        });

        mThis.initDropdownMenus(list_container);
        mThis.initAlready = true;
    };

    mThis.renderWorkShift = (div, data) => {
        data = data ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seem to work properly. You may need to refresh the page",
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.beginRenderWorkShift(div, data);
        });
    };
    mThis.beginRenderWorkShift = (div, data) => {
        let html = `
        <div class="_work_shift_body col-12">
            <div class="row g-2">
    `;

        for (const [day, shifts] of Object.entries(data)) {
            html += `
            <div class="time_cards col p-1">
                <div class="day_card w-100">
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
                        <div class="d-flex justify-content-center align-items-center">
                            <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_shift-details_action" data-id="${shift.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
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
    mThis.getFilterData = () => {
        const p = {
            work_shift_id: mThis.elFilter_status.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
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

    mThis.editWorkShift = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Scanpoint is updated successfully!");
                mThis.WorkshiftListView();
            },
        };
        if (!AuthManager.allowed(488)) return;
        ShiftDetailDialog.show(op);
    };
    mThis.deleteWorkShift = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
        };
        if (!AuthManager.allowed(489)) return;
        cv_interact.confirm(
            "Are you sure you want to delete this scanpoint?",
            {
                title: "Delete Scanpoint",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/shift-details/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted successfully!");
                                mThis.WorkshiftListView();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/shift-details/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data;
                    VSUtil.setComboItems(
                        mThis.elFilter_status,
                        d.shifts,
                        "id",
                        "name",
                        "",
                        LocaleManager.trans("All Shifts", "titles"),
                        "",
                    );
                }
            });
    };

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.WorkshiftListView();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();
const ShiftDetailDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-12">
                            <select data-style="material" name="shifts" class="form-control data-input" placeholder="${LocaleManager.trans("Work Shift", "labels")}" data-field="work_shift_id"></select>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-muted fs-7 mb-1" vslang="titles.Days">Days</label>
                            <div name="day" class="d-flex week gap-1 w-100">
                                <div class="days flex-fill text-center" data-value="Mon">Mon</div>
                                <div class="days flex-fill text-center" data-value="Tue">Tue</div>
                                <div class="days flex-fill text-center" data-value="Wed">Wed</div>
                                <div class="days flex-fill text-center" data-value="Thu">Thu</div>
                                <div class="days flex-fill text-center" data-value="Fri">Fri</div>
                                <div class="days flex-fill text-center" data-value="Sat">Sat</div>
                                <div class="days flex-fill text-center" data-value="Sun">Sun</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="time" name="time" class="data-input form-control form_input" data-field="time" placeholder=" " />
                                <label vslang="labels.Time"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="session" class="form-control data-input" placeholder="${LocaleManager.trans("Session", "labels")}" data-field="session">
                                <option value="m">Morning</option>
                                <option value="a">Afternoon</option>
                                <option value="e">Evening</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="action" class="form-control data-input" placeholder="${LocaleManager.trans("Action", "labels")}" data-field="action">
                                <option value="Check In">Check In</option>
                                <option value="Check Out">Check Out</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="number" name="shift_order_number" class="data-input form-control form_input" data-field="shift_order_number" placeholder=" " />
                                <label vslang="labels.Scan Order Number"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="time" name="start_time" class="data-input form-control form_input" data-field="start_time" placeholder=" " />
                                <label vslang="labels.Allow Scan From"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="time" name="end_time" class="data-input form-control form_input" data-field="end_time" placeholder=" " />
                                <label vslang="labels.Allow Scan To"></label>
                            </div>
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
                    emptyText: LocaleManager.trans("Work Shift", "titles"),
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
                                    "/mhr/shift-details/save",
                                ].join(""),
                                p,
                                btn,
                                null,
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
                createTitle: "Add Shift Detail",
                modifyTitle: "Edit Shift Detail",
                targetProp: "shift_details",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/shift-details/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log('Result from API "/form-options": ', res);
                // },
            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                let id = op.id;
                const days = me.divModal.querySelectorAll(".days");
                if (id && data?.shift_details) {
                    const currentDay = (
                        data.shift_details.day || ""
                    ).toLowerCase();
                    days.forEach((day) => {
                        const val = (day.dataset.value || "").toLowerCase();
                        if (currentDay === val || currentDay.startsWith(val)) {
                            day.classList.add("active");
                        } else {
                            day.classList.remove("active");
                        }
                    });
                } else {
                    days.forEach((day) => {
                        day.classList.remove("active");
                    });
                }

                me.divModal.querySelectorAll(".data-input").forEach((el) => {
                    const data_member = el.dataset.field;
                    if (id) {
                        if (el.tagName.toLowerCase() === "select") {
                            if (
                                data_member == "shifts" ||
                                data_member == "work_shift_id" ||
                                data_member == "emp_type_id"
                            ) {
                                el.setAttribute("disabled", true);
                            }
                        }
                    }
                });

                const shift =
                    AttendanceTracksComponent.getFilterData()?.work_shift_id;
                if (shift && me.controls.shifts && !me.controls.shifts.value) {
                    me.controls.shifts.value = shift;
                }
            },
        });

        dialog.show(op);
    };

    return self;
})();

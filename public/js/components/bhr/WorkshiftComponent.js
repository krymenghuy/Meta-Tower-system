"use strict";

var WorkshiftComponent = new (function () {
    const mThis = this;
    this.title_prop = "Workshifts";
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
                    cv_interact.success("Add Shift Detail successfully");
                    mThis.WorkshiftListView.showPage();
                },
            };
            ShiftDetailDialog.show(op);
        };
        mThis.elFilter_status
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.WorkshiftListView.showPage(mThis.getDataFormFilter());
                };
            });
        // const pr_tbl = mThis.WorkshiftListView.getListContainer();
        const sh_parent = list_container;
        // sh_parent.style.height = window.innerHeight - 225 + "px";
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
                    mThis.getDataFormFilter(),
                    null,
                    null
                )
                .then((res) => {
                    const d = res.status_code == 200 ? res.data : {};
                    console.log(12321, d);

                    mThis.renderWorkShift(list_container, d);
                });
            console.log(1111, mThis.getDataFormFilter());
        };
    });
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WorkshiftListView) {
                mThis.WorkshiftListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("shift-details is not defined");
            }
        }, 200);
    });

    this.setFilterPeriod = (p, name) => {
        return p;
    };
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

    // Begin rendering the work shifts with a table structure
    this.beginRenderWorkShift = (div, data) => {
        let html = `
        <div class="_work_shift_body col-12">
            <div class="row">
    `;

        // Iterate through the days and create a block for each day
        for (const [day, shifts] of Object.entries(data)) {
            html += `
            <div class="time_cards col-1-8">
                <div class="day_card">
        `;

            if (shifts.length === 0) {
                html += `<div class="no_shifts">No shifts scheduled</div>`;
            } else {
                shifts.forEach((shift) => {
                    // Determine the class for the action
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
                        <div class="shift_time">${shift.time}</div>
                        <div class="shift_action">${shift.action}</div>
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


    this.getDataFormFilter = () => {
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
            //menuItemClass:"",
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
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_shift-details": {
                        console.log(98787653, id);

                        mThis.editWorkShift(id, menulink);
                        break;
                    }
                    case "delete_shift-details": {
                        mThis.deleteWorkShift(id, menulink);
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

    this.editWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkshiftListView.showPage();
            },
        };
        WorkShiftDialog.show(op);
    };
    this.deleteWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkshiftListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this WorkShift?",
            {
                title: "Delete this WorkShift?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/shift-details/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "WorkShifts Delete Successfully"
                                );
                                mThis.WorkshiftListView.showPage();
                            }
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
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.shifts,
                    "id",
                    "name",
                    true,
                    "All work shift",
                    null
                );
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        // mThis.WorkshiftListView.showPage(
        //     mThis.getDataFormFilter(),
        //     null,
        //     () => {
        //     }
        // );
        mThis.jm.siblings().hide();
        mThis.jm.hide().fadeIn(250);
    };
})();
const ShiftDetailDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
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
                                <div class="d-flex week data-input" data-field="days">
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
                                <input type="time" name="time" class="form-control data-input" data-field="time" />
                            </div>                                                                     
                            <div class="form-group col-12">
                                <label for="action" class="form-label" vslang="titles.Action">Action</label>
                                <select type="text" name="action" class="form-control data-input" data-field="action">
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
                        day.addEventListener("click", (event) => {
                            day.classList.toggle("active");
                        });
                    });
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

                            // Collect the selected days as an array
                            const selectedDays = [];
                            const days =
                                me.divModal.querySelectorAll(".days.active");
                            days.forEach((day) => {
                                selectedDays.push(day.dataset.value);
                            });

                            // Convert the array to a string with | separator
                            p.days = selectedDays.join("|");
                            console.log(3333, p);

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
                    targetProp: "shift-details",
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
                },
            });

        dialog.show(op);
    };

    return self;
})();

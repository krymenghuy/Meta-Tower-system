"use strict";

var WorkshiftComponent = new (function () {
    const mThis = this;
    this.title_prop = "Workshifts";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_workshiftComponent");
    this.self = this.jm[0];
    this.elSearch = this.self.querySelector("#_work_shift_search");
    this.btnAdd = this.self.querySelector("#_btnAddWorkShift");
    this.btnAddShiftDetail = this.self.querySelector("#_btnAddShiftDetail");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.work_shift_header = this.self.querySelector("#_work_shift_header");
    this.elFilter_status = this.self.querySelector("#el_work_shift");
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.WorkshiftListView = new ListView("_work_shift_body", {
            fetchApi: `${mThis.base_url}/hr/shift-details/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            renderItems: (data, list_container) => {
                mThis.renderWorkShift(list_container, data);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Add shift-details successfully");
                    mThis.WorkshiftListView.showPage();
                },
            };
            WorkShiftDialog.show(op);
        };
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
        const pr_tbl = mThis.WorkshiftListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);
        mThis.initAlready = true;
    };
    mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
        el.onchange = (e) => {
            e.preventDefault();
            mThis.WorkshiftListView.showPage(mThis.getDataFormFilter());
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
                "Authentication Management does not seems to work properly. You may need to refresh page"
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.beginRenderWorkShift(div, data);
        });
    };

    this.renderHeader = () => {
        let html = "";

        return [
            `<div id="_work_shift_header">
                <div id="work_shift_type" class="col-12 p-3 border d-flex" >
                    <div class="shift_date col-1-5">Monday</div>
                    <div class="shift_date col-1-5">Tuesday</div>
                    <div class="shift_date col-1-5">Wednesday</div>
                    <div class="shift_date col-1-5">Thursday</div>
                    <div class="shift_date col-1-5">Friday</div>
                    <div class="shift_date col-1-5">Saturday</div>
                    <div class="shift_date col-1-5">Sunday</div>
                </div>
            </div>
            `,
        ].join("");
    };
    this.beginRenderWorkShift = (div, data) => {
        let html = "";
        html += this.renderHeader();

        data.forEach((d) => {
            // Determine the class for the action
            const actionClass =
                d.action === "Check Out"
                    ? "bg-secondary text-info border-info"
                    : "";

            html += `
            <div class="shift_time d-flex" id="shift_time_row1">
                <div class="shift-status-monday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div class="morning_shift">${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-tuesday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div class="morning_shift">${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-wednesday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div class="afternoon_shift">${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-thursday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div class="morning_shift">${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-friday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div class="morning_shift">${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-saturday">
                    <div class="btn-act-check-in ${actionClass}">
                        <div>${d.time}</div>
                        <span>${d.action}</span>
                    </div>
                </div>
                <div class="shift-status-sunday">
                    <div class="btn-act-inactive">
                        <div class="inactive">${d.time}</div>
                        <span>weekend</span>
                    </div>
                </div>
            </div>`;
        });

        // Update the content of the container
        div.innerHTML = html;
    };

    this.getDataFormFilter = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

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
        mThis.WorkshiftListView.showPage(
            mThis.getDataFormFilter(),
            null,
            () => {
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);
            }
        );
    };
})();
const WorkShiftDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-md-12">
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                <span class="text-danger" >*</span>
                                <input type="text" class="form-control data-input" data-field="name">
                            </div>                                                                         
                         </div>`,
                    ].join("");
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
                                        "/hr/work-shifts/save",
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
                contentCreated: (me, divModal) => {
                    me.saveWorkShift = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add WorkShift",
                    modifyTitle: "Edit WorkShift",
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
                                <div class="d-flex days data-input" data-field="day">
                                    <div class="day" data-value="Mon">Mon</div>
                                    <div class="day" data-value="Tue">Tue</div>
                                    <div class="day" data-value="Wed">Wed</div>
                                    <div class="day" data-value="Thu">Thu</div>
                                    <div class="day" data-value="Fri">Fri</div>
                                    <div class="day" data-value="Sat">Sat</div>
                                    <div class="day" data-value="Sun">Sun</div>
                                </div>
                            </div>
                            <div class="form-group col-12">
                                <label for="time" class="form-label" vslang="titles.Time">Time</label>
                                <input type="time" name="time" class="form-control data-input" data-field="time" />
                            </div>                                                                     
                            <div class="form-group col-12">
                                <label for="action" class="form-label" vslang="titles.Action">Action</label>
                                <select type="text" name="action" class="form-control data-input" data-field="action">
                                    <option value="check_in">Check In</option>
                                    <option value="check_out">Check Out</option>
                                </select>
                            </div>                                                                     
                         </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    // DateTimePicker.init(me.controls.time);
                    const days = me.divModal.querySelectorAll(".day");
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
                            // const selectedDays = [];
                            let selectedDays = '';
                            const days =
                                me.divModal.querySelectorAll(".day.active");
                            days.forEach((day) => {
                                // selectedDays.push(
                                //     day.getAttribute("data-value")
                                // );
                                selectedDays += day.dataset.value + ',';
                            });
                            p.day = selectedDays;
                            console.log(3333,p);

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

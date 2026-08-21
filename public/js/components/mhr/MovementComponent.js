"use strict";

var MovementComponent = (() => {
    const mThis = {};
    mThis.title_prop = "employee_movements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employeeMovementComponent");

    // mThis.btnAdd = mThis.self.querySelector("#_btnAddMovement");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_emp_movement");
    mThis.elEvent = mThis.self.querySelector("#el_event");
    mThis.elEmployee = mThis.self.querySelector("#el_employee");

   mThis.cols = [
    {
        title: "",
        className: "align-middle text-center",
    },
    {
        transTitle: "titles.Employee",
        className: "align-middle text-nowrap",
        data: (row) => {

            const photo = row.image_url ||
                `${main_view.base_url}/assets/images/default/default-staff.png`;

            return `
                <div class="d-flex align-items-center">
                    <img src="${photo}"
                        class="rounded-circle border shadow-sm me-3"
                        style="width:42px;height:42px;object-fit:cover;"
                        onerror="this.src='${main_view.base_url}/assets/images/default/default-staff.png'">
                    <div>
                        <div class="text-prm-custom text-nowrap">
                            ${row.emp_name ?? "_"}
                        </div>

                        <small class="text-muted">
                            ${row.position ?? "_"}
                        </small>
                    </div>
                </div>
            `;
        }
    },
    {
        transTitle: "titles.Event",
        className: "align-middle",
        data: (data) =>{
            return `<span class="text-prm-custom text-nowrap">${data.event ?? "_"}</span>`;
        } 
    },
    {
        transTitle: "titles.Date",
        className: "align-middle text-nowrap",
        data: row => `
            <span class="text-prm-custom">
                ${row.event_date ?? "-"}
            </span>
        `
    },
    {
        transTitle: "titles.Last Updated",
        className: "align-middle",
        data: (data) => {
            return `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                <small class="text-muted">${data.updated_at ?? ""}</small>
            </div>`;
        },
    },
    {
        transTitle: "titles.Impact",
        className: "align-middle text-center",
        data: (row) => {

            const impact = (row.impact || "").toLowerCase();

            let badge = "badge text-warning bg-warning-subtle border border-warning";

            switch (impact) {

                case "positive":
                    badge = "badge text-success bg-success-subtle border border-success";
                    break;

                case "neutral":
                    badge = "badge text-warning bg-warning-subtle border border-warning";
                    break;

                case "negative":
                    badge = "badge text-danger bg-danger-subtle border border-danger";
                    break;
            }

            return `
                <span class="text-capitalize d-inline-block text-center ${badge}" style="min-width:70px">
                    ${row.impact ?? "_"}
                </span>
            `;
        }
    }
];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MovementListView = new ListView("_emp_movement_list", {
            fetchApi: `${main_view.base_url}/mhr/emp-event/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white overflow-hidden rounded-3 header-uppercase",
            listContainerClass: null,
        });

        mThis.tblMovement = mThis.MovementListView.getTable();
        mThis.sh_container = mThis.MovementListView.getListContainer();

        const pr_tbl = mThis.MovementListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 215 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 215 + "px";
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            }, 300);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const p = {
            search_value: mThis.elSearch.value,
            emp_id: mThis.elEmployee.value,
            event_id: mThis.elEvent.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/emp-event/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elEmployee,d.employees,"id","name","",LocaleManager.trans("All Employee", "titles"),"");
                VSUtil.setComboItems(mThis.elEvent,d.events,"id","name","",LocaleManager.trans("All Movements", "titles"),"");
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.MovementListView.showPage(mThis.getFilterData());
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();



const MovementDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(LocaleManager.trans("Employee is required", "message_box_default"));
            return;
        }
        op.emp_id = op.emp_id || op.employee.id;
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                title: LocaleManager.trans("Movement", "titles"),
                createContent: () => {
                    return [`<div>
                        <div class="d-flex align-items-center gap-3 border-bottom ">
                            <input data-target="div_position" name="change_position" class="mb-2 change-option data-input" data-field="position_id" type="checkbox"  value="position" />
                            <label class="text-primary-custom" vslang="labels.Change Position"></label>

                            <input data-target="div_salary" name="change_salary" class="mb-2 change-option" type="checkbox"  value="salary" />
                            <label class="text-primary-custom" vslang="labels.Change Salary"></label>

                            <input data-target="div_work_shift" name="change_work_shift" class="mb-2 change-option " type="checkbox"  value="work_shift" />
                            <label class="text-primary-custom" vslang="labels.Change Work Shift"></label>
                        </div>
                    </div>`,
                    `<div name="div_position" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_position"  class="form-control data-input" data-field="position" placeholder=" " />
                                    <label vslang="labels.Position"></label>
                                </div>
                            </div>
                             <div class="col-md-3">
                                <select data-style="material" name="to_position" class="form-control data-input" data-field="to_position_id" placeholder="${LocaleManager.trans("To Position","labels")}" >
                                </select>
                            </div>`,
                            `<div id="remarks" class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="position_remarks" class="form-control data-input" placeholder=" " data-field="remarks" />
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>
                    </div>`,

                    `<div name="div_salary" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div id="salary" class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_salary" class="form-control  data-input" placeholder="" data-field="salary"/>
                                    <label vslang="labels.Original Salary"></label> 
                                </div>
                            </div>
                            <div id="salary" class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="new_salary" type="number" class="form-control  data-input" placeholder="" data-field="new_salary" />
                                    <label vslang="labels.New Salary"></label>
                                </div>
                            </div>

                            <div id="remarks" class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="salary_remarks" class="form-control  data-input" placeholder="" data-field="remarks" />
                                    <label vslang="labels.Remarks"></label>
                                </div>  
                            </div>
                        </div>
                    </div>`,
                    `<div name="div_work_shift" class="p-3" style="display:none;">
                        <div class="row g-2">
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input name="org_work_shift" class="form-control data-input" data-field="work_shift" />
                                    <label vslang="labels.Current Work Shift"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <select data-style="material" name="to_work_shift" class="form-control data-input" data-field="to_work_shift_id" placeholder="${LocaleManager.trans('To Work Shift','labels')}" >
                                </select>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input name="work_shift_remarks" class="form-control  data-input" placeholder=" " data-field="remarks">
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>

                    </div>`].join('');
                },
                contentCreated: (me) => {
                      me.setEvent = (div) => {
                        const elements = div.querySelectorAll("input.change-option");
                        elements.forEach(
                            (input) => {
                                input.onchange = (e) => {
                                    e.preventDefault();
                                    const divTarget = me.controls[input.dataset.target];
                                    if (divTarget) {
                                        divTarget.style.display = input.checked
                                            ? "block"
                                            : "none";
                                    }
                                };
                            }
                        );
                    };
                    me.setEvent(me.divModal);
                },
                configSelect: [
                  
                    {
                        name: "to_position_id",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "to_work_shift_id",
                        data: "work_shifts",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                  buttons: [
                    {
                       label: '<span  vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn, divModal) => {
                            const p = me.getData();
                            p.emp_id = op.emp_id;
                            const d = {};
                            d.emp_id = p.emp_id;
                            let change_position = {},
                                change_salary = {},
                                change_work_shift = {};

                            if (me.controls.change_position.checked) {
                                change_position.position_id = p.position_id;
                                change_position.to_position_id = p.to_position_id;
                                change_position.remarks = me.controls.position_remarks.value;
                                change_position.start_date = p.start_date;
                            }
                            if (me.controls.change_salary.checked) {
                                change_salary.new_salary = p.new_salary;
                                change_salary.remarks = me.controls.salary_remarks.value;
                                change_salary.org_salary = p.salary;
                                change_salary.org_position_id = p.position_id;
                                change_salary.new_position_id = p.position_id;
                            }
                            if (me.controls.change_work_shift.checked) {
                                change_work_shift.work_shift_id = p.work_shift_id;
                                change_work_shift.to_work_shift_id = p.to_work_shift_id;
                                change_work_shift.remarks = me.controls.work_shift_remarks.value;
                                //change_work_shift.effective_date = p.effective_date;
                            }

                            d.change_position = change_position;
                            d.change_salary = change_salary;
                            d.change_work_shift = change_work_shift;

                            vsapi.call(`${main_view.base_url}/mhr/staff-promotion/promote`,d,{loader:false,agent:btn})
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        cv_interact.success("promote_success_employee");
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    // createTitle: "vslang:titles.Employee Movement",
                    // modifyTitle: "vslang:titles.Movement",
                    targetProp: "employee",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/employee/form-options`,
                        params: (op) => {
                            return { id: op.dataOptions.emp_id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    me.setReadOnly(true,['org_position','org_salary','org_work_shift']);
                    
                    const divModal = me.divModal;
                    divModal
                        .querySelectorAll("input.change-option")
                        .forEach((input) => {
                            input.checked = false;
                            const divTarget = me.controls[input.dataset.target];
                            if (divTarget) {
                                divTarget.style.display = input.checked
                                    ? "block"
                                    : "none";
                            }
                        });

                    //me.setEvent(divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();


"use strict";

var EmployeeBenefitComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children(
        "#_main_employee_benefit_component"
    );
    this.self = this.jm[0];
    this.title_prop = "Employee Benefits";
    let div = mThis.self.querySelector("#_employee_bonus_list");
    this.btnAdd = this.self.querySelector("#_btn_add_benefit");
    this.divFilter = this.self.querySelector("#_divFilter_emp_benefit");
    this.elSearch = this.self.querySelector("#_sdl_search_bonus");
    this.elCategory = this.self.querySelector("#el_category");
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
                    <img class="image-student-tbl" src="${
                        data.image_url
                    }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
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
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${`$ ` + data.amount ?? ""}</p>`;
            },
        },
        {
            title: "Remark",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.remarks ?? ""}</p>`;
            },
        },
        // {
        //     title: "Duration",
        //     className: "align-middle",
        //     data: (data, index, tr) => {
        //         return `<p class="p-0 m-0">${data.start_date} <span class="text-danger">~</span> ${data.end_date}</p>`;
        //     },
        // },
        {
            title: "Action",
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-start align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <button class="btn btn-sm btn-primary btn_edit_bonus" data-id="${data.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button class="btn btn-sm btn-danger btn_delete_bonus" data-id="${data.id}"><i class="fa-regular fa-trash-can"></i></button>
                            </a>
                        </div>
                    </div>
                `;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.EmployeeBenefitListView = new ListView("_employee_bonus_list", {
            fetchApi: `${main_view.base_url}/hr/employee/benefit/all-list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        // Event for adding a benefit
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            EmployeeBenefitDailog.show({
                btn: e.target,
                onClose: mThis.reloadList,
            });
        };

        // Apply filter on category selection
        mThis.elCategory.addEventListener("change", () => {
            mThis.EmployeeBenefitListView.showPage(mThis.getDataFormFilter());
        });

        // Initialize other event listeners
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    this.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_bonus");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn_edit_bonus");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };

    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.EmployeeBenefitListView) {
                mThis.EmployeeBenefitListView.showPage(
                    mThis.getDataFormFilter()
                );
            } else {
                console.error("Employee Benefit is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = (e) => {
        if (mThis.EmployeeBenefitListView) {
            mThis.EmployeeBenefitListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("Employee Benefit  is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {
            benefit_type_id: mThis.elCategory.value, // Get the selected category value
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            p[field] = el.value;
        });

        return p;
    };
    this.reloadList = () => {
        mThis.EmployeeBenefitListView.showPage(mThis.getDataFormFilter());
    };

    this.editBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage();
            },
        };
        console.log(333, op);

        EmployeeBenefitDailog.show(op);
    };

    this.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage();
            },
        };

        cv_interact.confirm(
            "Delete this Employee Benefit?",
            {
                title: "Delete Employee Benefit",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/employee/benefit/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.EmployeeBenefitListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/employee/benefit/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elCategory,
                    d.categories,
                    "id",
                    "name",
                    true,
                    "All Benefit Type",
                    null
                );
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.reloadList();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const EmployeeBenefitDailog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class="data-input" data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-12">
                                <label for="category" class="form-label" vslang="titles.Category"></label>
                                <select name="category" class="data-input" data-field="benefit_type_id" id="benefit_type_id"></select>
                            </div>
                            <div class="form-group col-6">
                                <label for="start_date" class="form-label" vslang="titles.StartDate">Start Date</label>
                                <input type="date" class="form-control data-input" data-field="start_date" />
                            </div>
                            <div class="form-group col-6">
                                <label for="end_date" class="form-label" vslang="titles.EndDate">End Date</label>
                                <input type="date" class="form-control data-input" data-field="end_date" />
                            </div>
                            <div class="form-group col-12">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <textarea type="text" class="form-control data-input" data-field="amount"></textarea>
                            </div>
                            <div class="form-group col-12">
                                <label for="remark" class="form-label" vslang="titles.Remark"></label>
                                <textarea type="text" class="form-control data-input" data-field="remarks"></textarea>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span>${d.name}</span><span>${d.position}</span></div></div>`,
                        valueField: "id",
                    },
                    {
                        name: "category",
                        data: "categories",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    `${main_view.base_url}/hr/employee/benefit/save`,
                                    p,
                                    btn
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "New Employee Benefit",
                    modifyTitle: "Edit Employee Benefit",
                    targetProp: "benefit",
                    api: {
                        endpoint: `${main_view.base_url}/hr/employee/benefit/form-options`,
                        params: (op) => ({ id: op.id }),
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

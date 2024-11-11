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
            data: (data, index, i) => index + 1,
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
            title: "Benefity Type",
            className: "align-middle text-center",
            data: (data) => {
                const benefitTypeName =
                    mThis.benefitTypeMap[data.benefit_type_id] || "Unknown";
                const backgroundColor =
                    benefitTypeName === "Bonus"
                        ? "danger"
                        : benefitTypeName === "Seniority"
                        ? "success"
                        : "info";

                return `
                <p class="p-2 rounded-5 m-0 border text-white w-50 bg-${backgroundColor}">
                    ${benefitTypeName}
                </p>`;
            },
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data) =>
                `<p class="p-0 m-0">${`៛ ` + (data.amount ?? "")}</p>`,
        },

        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-start align-items-center">
                <div class="text-center gap-2 d-flex flex-wrap">
                    <button class="btn btn-sm btn-primary btn_edit_bonus" data-id="${data.id}">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn_delete_bonus" data-id="${data.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>`,
        },
    ];
    this.cols_seniority = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, i) => index + 1,
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
            title: "Benefity Type",
            className: "align-middle text-center",
            data: (data) => {
                const benefitTypeName =
                    mThis.benefitTypeMap[data.benefit_type_id] || "Unknown";
                const backgroundColor =
                    benefitTypeName === "Bonus"
                        ? "danger"
                        : benefitTypeName === "Seniority"
                        ? "success"
                        : "info";

                return `
                <p class="p-2 rounded-5 m-0 border text-white w-100 bg-${backgroundColor}">
                    ${benefitTypeName}
                </p>`;
            },
        },
        {
            title: "Start Date",
            className: "align-middle text-start ",
            data: (data) =>
                `<p class="p-0 m-0">${data.se_start_date ?? "null"}</p>`,
        },
        {
            title: "End Date",
            className: "align-middle text-start ",
            data: (data) => `<p class="p-0 m-0">${data.remarks ?? ""}</p>`,
            data: (data) => `<p class="p-0 m-0">${data.se_end_date ?? ""}</p>`,
        },
        {
            title: "Create By",
            className: "align-middle text-start",
            data: (data) => `<p class="p-0 m-0">${data.update_user ?? ""}</p>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => `
        <div class="d-flex justify-content-start align-items-center">
            <div class="text-center gap-2 d-flex flex-wrap">
                <button class="btn btn-sm btn-primary btn_edit_bonus" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-danger btn_delete_bonus" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`,
        },
    ];
    this.cols_insurance = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, i) => index + 1,
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
            title: "Benefity Type",
            className: "align-middle text-center",
            data: (data) => {
                const benefitTypeName =
                    mThis.benefitTypeMap[data.benefit_type_id] || "Unknown";
                const backgroundColor =
                    benefitTypeName === "Bonus"
                        ? "danger"
                        : benefitTypeName === "Seniority"
                        ? "success"
                        : "info";

                return `
                <p class="p-2 rounded-5 m-0 border text-white w-100 bg-${backgroundColor}">
                    ${benefitTypeName}
                </p>`;
            },
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data) =>
                `<p class="p-0 m-0">${`៛ ` + (data.amount ?? "")}</p>`,
        },
        {
            title: "Start Date",
            className: "align-middle text-start ",
            data: (data) =>
                `<p class="p-0 m-0">${data.li_start_date ?? ""}</p>`,
        },
        {
            title: "End Date",
            className: "align-middle text-start ",
            data: (data) => `<p class="p-0 m-0">${data.li_end_date ?? ""}</p>`,
        },
        {
            title: "Create By",
            className: "align-middle text-start",
            data: (data) => `<p class="p-0 m-0">${data.update_user ?? ""}</p>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => `
        <div class="d-flex justify-content-start align-items-center">
            <div class="text-center gap-2 d-flex flex-wrap">
                <button class="btn btn-sm btn-primary btn_edit_bonus" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-danger btn_delete_bonus" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`,
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
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Add benefit successfully");
                    mThis.EmployeeBenefitListView.showPage();
                },
            };
            EmployeeBenefitDialog.show(op)
        };

        // Apply filter on category selection
        mThis.elCategory.addEventListener("change", () => {
            mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
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
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            } else {
                console.error("Employee Benefit is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = (e) => {
        if (mThis.EmployeeBenefitListView) {
            mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        } else {
            console.error("Employee Benefit  is not defined");
        }
    };

    this.getFilterData = () => {
        let p = {
            benefit_type_id: mThis.elCategory.value, // Get the selected category value
            search_value: mThis.elSearch.value,
        };
        console.log(1234, p);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            p[field] = el.value;
        });

        return p;
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

        EmployeeBenefitDialog.show(op);
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
                    false,
                    null,
                    1
                );

                // Create benefit type name map for displaying names instead of IDs
                mThis.benefitTypeMap = d.categories.reduce((map, category) => {
                    map[category.id] = category.name;
                    return map;
                }, {});
            });
    };
    mThis.elCategory.onchange = () => {
        const selectedColumns =
            mThis.elCategory.value === "1"
                ? mThis.cols
                : mThis.elCategory.value === "2"
                ? mThis.cols_seniority
                : mThis.elCategory.value === "3"
                ? mThis.cols_insurance
                : mThis.cols; // default columns

        mThis.EmployeeBenefitListView.showPage(mThis.getFilterData(), {
            columns: selectedColumns,
        });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        const selectedColumns =
            mThis.elCategory.value === "1"
                ? mThis.cols
                : mThis.elCategory.value === "2"
                ? mThis.cols_seniority
                : mThis.elCategory.value === "3"
                ? mThis.cols_insurance
                : mThis.cols;

        mThis.EmployeeBenefitListView.showPage(mThis.getFilterData(), {
            columns: selectedColumns,
        });
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const EmployeeBenefitDialog = (() => {
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
                            <div class="form-group col-md-12">
                           <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                           <span class="text-danger" >*</span>
                           <input name="start_date" class="form-control data-input" data-field="start_date">
                        </div>
                        <div class="form-group col-12">
                            <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                            <span class="text-danger" >*</span>
                            <input name="end_date" class="form-control data-input" data-field="end_date" />
                        </div>
                            <div class="form-group col-12">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <input type="number" name="amount" class="form-control data-input" data-field="amount"></input>
                            </div>
                            <div class="form-group col-12">
                                <label for="remark" class="form-label" vslang="titles.Remark"></label>
                                <textarea type="text" class="form-control data-input" data-field="remarks"></textarea>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.start_date);
                    DateTimePicker.init(me.controls.end_date);
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span>${d.name}</span><span>${d.position}</span></div></div>`,
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
                        params: (op) => {
                            console.log(2020, op, 2021, op.id);

                            return { id: op.id };
                        },
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

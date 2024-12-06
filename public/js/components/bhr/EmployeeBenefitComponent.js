"use strict";

var EmployeeBenefitComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children(
        "#_main_employee_benefit_component"
    );
    this.self = this.jm[0];
    this.title_prop = "Employee Benefits";

    this.btnAdd = this.self.querySelector("#_btn_add_benefit");
    this.divFilter = this.self.querySelector("#_divFilter_employee_benefit");
    this.elSearch = this.self.querySelector("#_sdl_search_bonus");
    this.elCategory = this.self.querySelector("#el_category");

    this.cols = [
        {
            title: "Name",
            className: "align-middle text-start",
            data: (data) => {
                return `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${
                        data.image_url
                    }" alt=""
                        style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.name ?? ""
                        }</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`;
            },
        },
        {
            title: "Benefit",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    data.benefit_name ?? ""
                }</p>`;
            },
        },
        {
            title: "Balance",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    main_view.currency.symbol + data.balance ?? ""
                }</p>`;
            },
        },
        {
            title: "Benefit Type",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    data.benefit_type_id == "1" ? "Remuneration" : ""
                }${data.benefit_type_id == "2" ? "Fringe Benefit" : ""}`;
            },
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    main_view.currency.symbol + data.amount ?? ""
                }</p>`;
            },
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${data.remarks ?? ""}`;
            },
        },
        {
            title: "Tax Option",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    data.tax_option_id == "1" ? "Taxable" : ""
                }${data.tax_option_id == "2" ? "Non Taxable" : ""}${
                    data.tax_option_id == "3" ? "Flat Rate" : ""
                }`;
            },
        },
        {
            title: "Flat Tax Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.flat_tax_rate ?? ""} %</p>`;
            },
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <button class="btn btn-sm btn-primary btn_edit_benefit" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn_delete_benefit" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
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
            tableClass:
                "table table--white overflow-hidden rounded-3 header-uppercase",
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            EmployeeBenefitDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Added benefit successfully");
                    mThis.EmployeeBenefitListView.showPage();
                },
            });
        };

        mThis.elCategory.addEventListener("change", () => {
            mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        });

        mThis.setActionListeners();
        mThis.elSearch.addEventListener(
            "keyup",
            this.debounce(() => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            }, 300)
        );

        mThis.initAlready = true;
    };

    this.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_benefit");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_benefit");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
        });
    };

    this.getFilterData = () => {
        const filters = {
            benefit_type_id: mThis.elCategory.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };

    this.editBenefit = (id, btn) => {
        EmployeeBenefitDialog.show({
            id,
            btn,
            onClose: () => mThis.EmployeeBenefitListView.showPage(),
        });
    };

    this.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            },
        };
        cv_interact.confirm(
            "Delete this Benefit?",
            {
                title: "Delete Benefit",
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
                                mThis.EmployeeBenefitListView.showPage(
                                    mThis.getFilterData()
                                );
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = async () => {
        try {
            const res = await vsapi.call(
                `${main_view.base_url}/hr/employee/benefit/form-options`
            );
            const data = res.status_code === 200 ? res.data : {};
            VSUtil.setComboItems( mThis.elCategory, data.benefits, "id", "name", true, "All benefits", null);
        } catch (err) {
            console.error("Error fetching form options:", err);
        }
    };

    this.debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();
const EmployeeBenefitDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class="data-input" data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="benefits" class="form-label" vslang="titles.Benefit"></label>
                                <select name="benefits" class="data-input" data-field="benefit_id" id="benefit_id"></select>
                            </div>
                            <div class="form-group col-6">
                                <label for="benefit_type_id" class="form-label" vslang="titles.Benefit Type"></label>
                                <select name="benefit_type_id" class="modal-select data-input form_input" data-field="benefit_type_id">
                                    <option value="">(Select Benefit Type)</option>
                                    <option value="1">Remuneration</option>
                                    <option value="2">Fringe</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <input type="number" name="amount" class="form-control data-input" data-field="amount"></input>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="balance" class="form-label" vslang="titles.Balance"></label>
                                <input type="number" name="balance" class="form-control data-input" data-field="balance"></input>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="flat_tax_rate" class="form-label" vslang="titles.Flat Tax"></label>
                                <input type="number" name="flat_tax_rate" class="form-control data-input" data-field="flat_tax_rate"></input>
                            </div>
                            <div class="form-group col-6">
                                <label for="tax_option_id" class="form-label" vslang="titles.Tax Option"></label>
                                <select name="tax_option_id" class="modal-select data-input form_input" data-field="tax_option_id">
                                    <option value="">(Select Tax Option)</option>
                                    <option value="1">Taxable</option>
                                    <option value="2">Non Taxable</option>
                                    <option value="3">Flat Rate</option>
                                </select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="remarks" class="form-label" vslang="titles.Remark"></label>
                                <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                            </div>
                        </div>`;
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
                        name: "benefits",
                        data: "benefits",
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
                                    if (res.status_code === 200) {
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
                    targetProp: "emp_benefits",
                    api: {
                        endpoint: `${main_view.base_url}/hr/employee/benefit/form-options`,
                        params: (op) => ({ id: op.id }),
                    },
                },
                onPrepareForm: (me, data) => {
                    Object.keys(data).forEach((key) => {
                        const input = me.divModal.querySelector(
                            `[data-field="${key}"]`
                        );
                        if (input) {
                            if (input.tagName === "SELECT") {
                                input.value = data[key];
                            } else {
                                input.value = data[key];
                            }
                        }
                    });
                    LocaleManager.translateZone(me.divModal);
                },
            });
        

        dialog.show(op);
    };

    return self;
})();


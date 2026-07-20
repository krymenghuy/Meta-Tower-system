"use strict";

var EmployeeBenefitComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employee_benefit_component");
 
    mThis.title_prop = "Employee Benefits";

    mThis.btnAdd = mThis.self.querySelector("#_btn_add_benefit");
    mThis.btnImport = mThis.self.querySelector("#_btn_import_benefit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_employee_benefit");
    mThis.elSearch = mThis.self.querySelector("#_sdl_search_bonus");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    mThis.elTaxOption = mThis.self.querySelector("#el_tax_option");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.emp_name ?? "-"}
                            <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Benefit",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<span>${data.benefit_name ?? '-'}</span>`;
             }
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary p-0 m-0">${
                    data.effective_date ?? "N/A"
                }</span>`;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.amount,
                    data.currency_code
                )}</p>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.balance,
                    data.currency_code
                )}</p>`;
            },
        },

        {
            transTitle: "titles.Tax Option",
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
            transTitle: "titles.Flat Tax Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return data.tax_option_id == "3"
                    ? `<p class="p-0 m-0">${data.flat_tax_rate ?? "0"} %</p>`
                    : `<p class="p-0 m-0">N/A</p>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_emp_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.EmployeeBenefitListView = new ListView("_employee_bonus_list", {
            fetchApi: `${main_view.base_url}/mhr/emp-benefit/all-list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white overflow-hidden rounded-2 border-none header-uppercase",
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            if (!AuthManager.allowed(273)) return;
            EmployeeBenefitDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
                },
            });
        };
        mThis.btnImport.onclick = (e) => {
            e.preventDefault();
            if (!AuthManager.allowed(325)) return;
            FileChooser.chooseFile({
                accept: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },(d) => {
                if(d){
                    vsapi.call(`${main_view.base_url}/mhr/emp-benefit/import-emp-benefits`,{
                        file: d.dataUrl
                    },false).then(res => {

                        if(res.status_code === 200){
                            mThis.EmployeeBenefitListView.showPage(null);
                            cv_interact.success('Employees Benefit Were Import Successfully!');
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });

        };

        const pr_tbl = mThis.EmployeeBenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }
        mThis.elSearch.addEventListener(
            "keyup",
            mThis.debounce(() => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            }, 300)
        );
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        });
        mThis.setActionListeners();
        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_benefit");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_emp_benefit");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
        });
    };

    mThis.getFilterData = () => {
        const filters = {
            benefit_id: mThis.elBenefit.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };

    mThis.editBenefit = (id, btn) => {
        if (!AuthManager.allowed(274)) return;
        EmployeeBenefitDialog.show({
            id,
            btn,
            onClose: () => mThis.EmployeeBenefitListView.showPage(mThis.getFilterData()),
        });
    };

    mThis.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(275)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Employee Benefit",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/emp-benefit/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_employee_benefit");
                                mThis.EmployeeBenefitListView.showPage(
                                    mThis.getFilterData()
                                );
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp-benefit/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefit, d.benefits, "id", "name", "",LocaleManager.trans("All Benefits", "titles"), "");
                VSUtil.setComboItems(mThis.elTaxOption, d.tax_options, "id", "name", "",LocaleManager.trans("All Tax Options", "titles"), "");

            });
    };

    mThis.debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(mThis, args), delay);
        };
    };
    mThis.show = function () {
        mThis.init();
        mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        mThis.prepareFormOptions();
         main_view.setContentView(mThis.self, mThis.title_prop);

    };
    return mThis;
})();
const EmployeeBenefitDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="employee" class="data-input form-control" data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="benefits" class="data-input form-control" data-field="benefit_id" id="benefit_id" placeholder="${LocaleManager.trans('Benefit', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans('Currency Code', 'labels')}" disabled></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="tax_option_id" class="data-input form-control" data-field="tax_option_id" id="tax_option_id" placeholder="${LocaleManager.trans('Tax Options', 'labels')}">
                                <option value="">(Select Tax Option)</option>
                                <option value="1">Tax</option>
                                <option value="2">Non</option>
                                <option value="3">Flat Rate</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="number" name="amount" class="form-control data-input" data-field="amount" placeholder=" " />
                                <label vslang="titles.Amount"></label>

                            </div>
                        </div>
                        <div class="col-6 effective_date d-none">
                            <div class="vs-material-field">
                                <input name="effective_date" class="form-control data-input" data-field="effective_date" placeholder=" "></input>
                                <label vslang="titles.Effective Date"></label>
                            </div>
                        </div>
                        <div class="col-6 flat_tax_rate d-none">
                            <div class="vs-material-field">
                                <input type="number" name="flat_tax_rate" class="form-control data-input" data-field="flat_tax_rate" placeholder=" " />
                                <label vslang="titles.Flat Tax"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                <label vslang="titles.Remark"></label>
                            </div>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.effective_date);
                const taxOptionField = me.divModal.querySelector("#tax_option_id");
                const flatTaxRateField = me.divModal.querySelector(".flat_tax_rate");
                taxOptionField.addEventListener("change", () => {
                    flatTaxRateField.classList.toggle(
                        "d-none",
                        taxOptionField.value !== "3"
                    );
                });

            },

            prepareFormOptions: {
                createTitle: "vslang:titles.Create Employee Benefit",
                modifyTitle: "vslang:titles.Edit Employee Benefit",
                targetProp: "emp_benefits",
                api: {
                    endpoint: `${main_view.base_url}/mhr/emp-benefit/form-options`,
                    params: (op) => ({ id: op.id }),
                },
            },
            onPrepareForm: (me, data) => {

                const BenefitField = me.divModal.querySelector("#benefit_id");

                const effective_date = me.divModal.querySelector(".effective_date");
                BenefitField.addEventListener("change", () => {
                    const selectedValue = BenefitField.value;
                    const benefit_disburse_policies =
                        data.benefit_disburse_policies;
                    const exists = benefit_disburse_policies.find(e => e.benefit_id === selectedValue);
                    if (exists) {
                        effective_date.classList.remove("d-none");
                    } else {
                        effective_date.classList.add("d-none");
                    }
                });
                BenefitField.dispatchEvent(new Event("change"));
                LocaleManager.translateZone(me.divModal);
                me.controls.currency_code.value = VSMoney.getCurrency().code;

                Object.keys(data).forEach((key) => {
                    const input = me.divModal.querySelector(
                        `[data-field="${key}"]`
                    );
                    if (input) {
                        input.value = data[key];
                    }
                });
            },
            configSelect: [
                {
                    name: "employee",
                    data: "employees",
                    textField: (me, d) => `
                        <div class="d-flex gap-2">
                            <img class="img_select" src="${d.image_url}" />
                            <div class="d-flex flex-column">
                                <span>${d.name}</span>
                                <span>${d.position}</span>
                            </div>
                        </div>`,
                    valueField: "id",
                },
                {
                    name: "benefits",
                    data: "benefits",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "currency_code",
                    data: "currency_codes",
                    textField: "code",
                    valueField: "code",
                },
            ],
            buttons: [
                {
                    label: '<span  vslang="buttons.Cancel"></span>',
                    cssClass: "btn-vs-cancel",
                    click: (me, btn) => {
                        me.hide(false)
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn-vs-save",
                    click: (me, btn) => {
                        const p = me.getData();
                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/emp-benefit/save`,
                                p,
                                btn
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success("update_success_employee_benefit");
                                    } else {
                                        cv_interact.success("create_success_employee_benefit");
                                    }
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();




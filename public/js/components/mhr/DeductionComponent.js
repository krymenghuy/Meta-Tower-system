"use strict";
var DeductionComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_deductionComponent",
    );

    mThis.title_prop = "Employee Deduction";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddDeduction");
    mThis.elSearch = mThis.self.querySelector("#_deduction_search");
    mThis.containerFilter = mThis.self.querySelector("#_divFilter_deduction");
    mThis.elDeductionType = mThis.self.querySelector("#deduction_type");

    mThis.divListView = mThis.self.querySelector("#_deduction_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-start text-nowrap",
            data: (data) => {
                return `
                    <div class="d-flex align-items-center">
                        <div>
                            <span class="fw-bold" style="font-size: 13px;">${data.name ?? ""}</span>
                            <br/>
                            <span class="text-muted" style="font-size: 11px;">${data.emp_code ?? ""}</span>
                        </div>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            transTitle: "titles.Deduct Amount",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                let amt = parseFloat(data.deduct_amount) || 0;
                return `<span class="text-nowrap text-prm-custom">$${amt.toFixed(2)}</span>`;
            }
        },
        // {
        //     transTitle: "titles.Date",
        //     className: "align-middle text-center text-nowrap",
        //     data: (data, index, tr) => {
        //         return `
        //             <span class="badge bg-light text-prm-custom border px-3 py-2">
        //                 <i class="fa-regular fa-calendar me-1"></i>
        //                 ${data.deduct_date ?? "-"}
        //             </span>
        //         `;
        //     },
        // },
        {
            transTitle: "titles.Issue",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.issues ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? '_'}</span><br/>
                <small >${data.updated_at ?? ""}</small>
            </div>`,
        },
        // {
        //     className: 'col_action align-middle',
        //     data: function (data, row, display) {
        //         return `
        //             <div class="d-flex justify-content-center align-items-center">
        //                 <div class="text-center gap-2 d-flex flex-wrap">
        //                         <a href="javascript:void(0)" class="btn_warning_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
        //                             <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
        //                     </a>
        //                 </div>
        //             </div>
        //         `;
        //     }
        // },

    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.DeductListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/mhr/emp-deduction/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.DeductListView.showPage(mThis.getFilterData());
                },
            };
            DeductDialog.show(op);
        };

        mThis.pr_tbl = mThis.DeductListView.getListContainer();
        mThis.initDropdownMenus(mThis.pr_tbl);
        const elDate = mThis.containerFilter.querySelector(
            "[data-select='datepicker']",
        );
        if (elDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elDate);
        }
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.DeductListView.showPage(mThis.getFilterData());
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.DeductListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp-deduction/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elWarningType,
                    d.warning_types || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("Warning Type", "titles"),
                    "",
                );
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Deduction"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_deduction",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Deduction"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_deduction",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_deduction": {
                        mThis.editDeduction(id, menuLink);
                        break;
                    }
                    case "delete_deduction": {
                        mThis.deleteDeduction(id, menuLink);
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

    mThis.editDeduction = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DeductListView.showPage(mThis.getFilterData());
            },
        };
        DeductDialog.show(op);
    };

    mThis.deleteDeduction = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DeductListView.showPage(mThis.getFilterData());
            },
        };
        cv_interact.confirm("delete_deduction?",
        {
            title: "Delete Deduction.",
            context: "delete",
            confirmButtonText: "Delete",
        },function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/mhr/emp-deduction/delete`,op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("deduction_delete_successfully");
                                mThis.DeductListView.showPage();
                            } else {
                                cv_interact.error(res.error_message || 'An error occurred while deleting.');
                            }
                        })
                    }
        });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.DeductListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const DeductDialog = (() => {
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
                        <div class="col-6"> 
                            <select data-style="material" name="employee_id" class="form-control data-input" placeholder="${LocaleManager.trans('Employee', 'labels')}" data-field="emp_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="deduct_amount" class="data-input form-control form_input" data-field="deduct_amount" placeholder=" " />
                                <label vslang="labels.Deduct Amount"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="deduct_date" class="data-input form-control form_input" data-field="deduct_date" placeholder=" " />
                                <label vslang="labels.Deduct Date"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="issues" class="form-control data-input form_input" placeholder=" " data-field="issues"></textarea>
                                <label vslang="labels.Issues"></label>
                            </div>
                        </div>  
                    </div>`,
                ].join("");
            },
            contentCreate: (me) => {

            },
            configSelect: [
                {
                    name: "employee_id",
                    data: "employees",
                    textField: (me, d) => {
                        return `${d.name ?? '-'} <small class="text-muted">(${d.code ?? '-'})</small>`;
                    },
                    valueField: "id",
                    emptyText: LocaleManager.trans("Employee", "titles"),
                }
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn-vs-cancel",
                    click: (me, btn) => me.hide(false),
                },
                {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            if (!p.deduct_amount || parseFloat(p.deduct_amount) <= 0) {
                                cv_interact.error(LocaleManager.trans("Deduction amount must be greater than 0", "validation") || "Deduction amount must be greater than 0");
                                return;
                            }

                            p.id = me.dataOptions.id;
                            
                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-deduction/save"].join(
                                        ""
                                    ),
                                    p,
                                     {loader: false,agent :btn}
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (!me.dataOptions.silentSuccess) {
                                            if(me.dataOptions.id > 0)
                                            {
                                                cv_interact.success("deduction_update_successfully");
                                            }
                                            else
                                            {
                                                cv_interact.success("deduction_create_successfully");
                                            }
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Create Deduction",
                modifyTitle: "vslang:titles.Modify Deduction",
                targetProp: "deduction",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/emp-deduction/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },

            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);

                const deductionRecord = data?.deduction;
                if (deductionRecord) {
                    if (me.controls.employee_id) {
                        me.controls.employee_id.value = deductionRecord.emp_id || "";
                        me.controls.employee_id.dispatchEvent(new Event("change"));
                    }
                    if (me.controls.deduct_amount) {
                        me.controls.deduct_amount.value = deductionRecord.deduct_amount || "";
                    }
                    if (me.controls.deduct_date) {
                        me.controls.deduct_date.value = deductionRecord.deduct_date || "";
                    }
                    if (me.controls.issues) {
                        me.controls.issues.value = deductionRecord.issues || deductionRecord.remarks || "";
                    }
                } else if (me.dataOptions) {
                    if (me.dataOptions.emp_id && me.controls.employee_id) {
                        me.controls.employee_id.value = me.dataOptions.emp_id;
                        me.controls.employee_id.dispatchEvent(new Event("change"));
                    }
                    if (me.dataOptions.deduct_amount && me.controls.deduct_amount) {
                        me.controls.deduct_amount.value = me.dataOptions.deduct_amount;
                    }
                    if (me.dataOptions.deduct_date && me.controls.deduct_date) {
                        me.controls.deduct_date.value = me.dataOptions.deduct_date;
                    }
                    if (me.controls.issues) {
                        me.controls.issues.value = me.dataOptions.issues || me.dataOptions.remarks || "";
                    }
                }
            },
        });

        dialog.show(op);
    };

    return self;
})();

DeductionComponent.DeductDialog = DeductDialog;

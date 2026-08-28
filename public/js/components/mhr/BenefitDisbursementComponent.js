"use strict";

var BenefitDisbursementComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self= main_view.VSAppContent.querySelector("#_main_benefit_disbursement_component");
    mThis.title_prop = "benefit_disbursements";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefitDisburse");
    mThis.elSearch = mThis.self.querySelector("#_benefit_disburse_search");
    mThis.elCard = mThis.self.querySelector(".top_level_card");
    mThis._searchBenefitDisburse = mThis.self.querySelector("#container_benefit_disburse");
    mThis.divFilter = mThis.self.querySelector("#container_benefit_disburse");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    const monthNames = [
        "All Months",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    mThis.cols = [
        {
        title: "",
        className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-start",
            data: (data) => {
                // const imageUrl =
                //     data.image_url ||
                //     `${main_view.asset_url}/images/default/default-staff.png`;

                return `
                    <div class="d-flex align-items-center">
                        <div class="ms-2 overflow-hidden">
                            <div class="text-prm-custom text-truncate">
                                ${data.name ?? "-"}
                            </div>
                            <div class="small text-muted text-truncate" style="max-width: 200px;">
                                ${data.email ?? "-"}
                            </div>
                        </div>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Benefit",
            className: "align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex align-items-center">
                    <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 34px;height: 34px;background: rgba(43, 57, 145, 0.1);">
                        <i class="fa-solid fa-gift text-primary-custom"></i>
                    </div>
                    <span class="ms-2 fw-medium text-primary-custom">
                        ${data.benefit_name ?? "-"}
                    </span>
                </div>
            `,
        },
        {
            transTitle: "titles.Target Month",
            className: "align-middle text-nowrap",
            data: (data) => {
                const monthIndex = Number(data.target_month ?? 0);
                const month = monthNames[monthIndex] ?? "-";
                return `
                    <span class="badge ${monthIndex === 0 ? "bg-primary-subtle text-primary" : "bg-light text-dark"} border px-3 py-2 fw-normal">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${month}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Target Year",
            className: "align-middle text-nowrap",
            data: (data) => {
                const year = Number(data.target_year ?? 0);
                return `
                    <span class="badge ${year === 0 ? "bg-primary-subtle text-primary" : "bg-light text-dark"} border px-3 py-2 fw-normal">
                        <i class="fa-solid fa-calendar-days me-1"></i>
                        ${year === 0 ? "All Years" : year}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Withdraw Percent",
            className: "align-middle text-nowrap",
            data: (data) => {
                const rate = Math.min(Math.max(Number(data.withdraw_rate ?? 0), 0),100);
                return `
                    <div style="min-width: 120px;">
                        <div class="d-flex align-items-center">
                            <span class="fw-semibold text-primary-custom">
                                ${rate}%
                            </span>
                        </div>
                        <div class="progress mt-1" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${rate}%" aria-valuenow="${rate}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="fw-medium text-primary-custom">
                        ${data.update_user ?? "-"}
                    </span>
                    <small class="text-muted">
                        ${data.updated_at ?? "-"}
                    </small>
                </div>
            `,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center",
            data: (data) => `
                <div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_benefit_disbursement_action"} d-inline-flex align-items-center justify-content-center data-id="${data.id}" data-statusid="${data.status_id ?? ""}">
                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                    </a>
                </div>
            `,
        },

    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.BenefitDisburseListView = new ListView("_benefit_disburse_list", {
            fetchApi: `${mThis.base_url}/mhr/emp/benefit-disbursement/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BenefitDisburseListView.showPage();
                },
            };
            if (!AuthManager.allowed(392,false)) return;
            BenefitDisburseDialog.show(op);
        };
        const pr_tbl = mThis.BenefitDisburseListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);

        mThis._searchBenefitDisburse.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.BenefitDisburseListView) {
                mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
            } else {
                console.error("Benefit Disburse is not defined");
            }
        }, 200);
    });

    mThis.setFilterPeriod = (p) => {
        return p;
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
  
    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_benefit_disbursement_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_benefit_disbursement"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_benefit_disbursement"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_benefit_disbursement": {
                        mThis.editBenefitDisburse(id, menuLink);
                        break;
                    }
                    case "delete_benefit_disbursement": {
                        mThis.deleteBenefitDisburse(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };
    mThis.editBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        if (!AuthManager.allowed(393,false)) return;
        BenefitDisburseDialog.show(op);
    };
    mThis.deleteBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        if (!AuthManager.allowed(394,false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/emp/benefit-disbursement/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_benefit_disbursement");
                                mThis.BenefitDisburseListView.showPage();
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
                `${main_view.base_url}/mhr/emp/benefit-disbursement/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elBenefit,
                    d.benefits,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Benefits", "titles"),
                    ""
                );
            });
    };
    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.BenefitDisburseListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();
const BenefitDisburseDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    const months = [
                        { value: 0, name: "All" },
                        { value: 1, name: "January" },
                        { value: 2, name: "February" },
                        { value: 3, name: "March" },
                        { value: 4, name: "April" },
                        { value: 5, name: "May" },
                        { value: 6, name: "June" },
                        { value: 7, name: "July" },
                        { value: 8, name: "August" },
                        { value: 9, name: "September" },
                        { value: 10, name: "October" },
                        { value: 11, name: "November" },
                        { value: 12, name: "December" },
                    ];

                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 10 },
                        (_, i) => currentYear + i
                    );
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="employee" class="form-control data-input" data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="benefits" class="form-control data-input" data-field="benefit_id" placeholder="${LocaleManager.trans('Benefit', 'labels')}"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="withdraw_rate" required class="data-input form-control" data-field="withdraw_rate" placeholder=" " />
                                    <label vslang="labels.Withdraw Percent"></label>
                                </div>
                            </div>
                      
                        <div class="col-6">
                            <select data-style="material" name="target_month" class="form-control data-input" data-field="target_month" placeholder="${LocaleManager.trans('Month', 'labels')}">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="year" class="form-control data-input" data-field="target_year" placeholder="${LocaleManager.trans('Year', 'labels')}">
                                ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
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
                            const jl = me.getData();

                            jl.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/emp/benefit-disbursement/save",
                                    ].join(""),
                                    jl,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, jl);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_benefit_disbursement");
                                        }
                                        else{
                                        cv_interact.success("create_success_benefit_disbursement");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    
                },
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Benefit Disburse",
                    modifyTitle: "vslang:titles.Edit Benefit Disburse",
                    targetProp: "benefit_disbursements",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/emp/benefit-disbursement/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    // onResponse: (me, res) => {

                    //     if (res.target_month && res.target_year) {
                    //         setTimeout(() => {
                    //             const monthSelect = me.divModal.querySelector(
                    //                 '[name="target_month"]'
                    //             );
                    //             const yearSelect = me.divModal.querySelector(
                    //                 '[name="target_year"]'
                    //             );
                    //             if (monthSelect)
                    //                 monthSelect.value = res.target_month;
                    //             if (yearSelect)
                    //                 yearSelect.value = res.target_year;
                    //         }, 100);
                    //     }
                    // },
                },

                onPrepareForm: (me, data) => {
                    setTimeout(() => {
                        if (data.target_month) {
                            const monthSelect = me.divModal.querySelector(
                                '[name="target_month"]'
                            );
                            if (monthSelect)
                                monthSelect.value = data.target_month;
                        }
                        if (data.target_year) {
                            const yearSelect = me.divModal.querySelector(
                                '[name="target_year"]'
                            );
                            if (yearSelect) yearSelect.value = data.target_year;
                        }
                    }, 100);
                },
            });

        dialog.show(op);
    };

    return self;
})();

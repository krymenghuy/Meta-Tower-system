"use strict";

var BenefitDisbursementComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children(
        "#_main_benefit_disbursement_component"
    );
    mThis.self = mThis.jm[0];
    mThis.title_prop = "Benefits Disbursement";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefitDisburse");
    mThis.elSearch = mThis.self.querySelector("#_benefit_disburse_search");
    mThis.elCard = mThis.self.querySelector(".top_level_card");
    mThis._searchBenefitDisburse = mThis.self.querySelector("#container_benefit_disburse");
    mThis.divFilter = mThis.self.querySelector("#container_benefit_disburse");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    const monthNames = [
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
            title: "Name",
            className: "align-middle text-start w-25",
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
            title: "benefit",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.benefit_name ?? "HD"
                }</span>`,
        },
        {
            title: "Target Month",
            className: "align-middle",
            data: (data) => {
                const month = monthNames[data.target_month - 1] ?? "";

                return `<p class="p-0 m-0">${month} </p>`;
            },
        },
        {
            title: "Target Year",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.target_year}</span>`,
        },
        {
            title: "Withdraw Percent",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.withdraw_rate ?? "0"}%</span>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-benefit-disbursement-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-benefit-disbursement-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.BenefitDisburseListView = new ListView("_benefit_disburse_list", {
            fetchApi: `${mThis.base_url}/hr/employee/benefit-disbursement/list-paginate`,
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
            if (!AuthManager.allowed(276)) return;
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
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(
                e.target,
                ".btn-benefit-disbursement-modify"
            );
            if (btn) {
                mThis.editBenefitDisburse(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(
                e.target,
                ".btn-benefit-disbursement-delete"
            );
            if (btn) {
                mThis.deleteBenefitDisburse(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    mThis.editBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        if (!AuthManager.allowed(277)) return;
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
        if (!AuthManager.allowed(278)) return;
        cv_interact.confirm(
            "Delete this benefit disburse?",
            {
                title: "Delete disbursement",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/employee/benefit-disbursement/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Benefit disburse delete successfully"
                                );
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
                `${main_view.base_url}/hr/employee/benefit-disbursement/form-options`,
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
                    true,
                    "All Benefits",
                    null
                );
                console.log(1111, mThis.elBenefit);
            });
    };
    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.BenefitDisburseListView.showPage();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
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
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    const months = [
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
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class="form-control data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-md-6">
                            <label for="benefits" class="form-label" vslang="titles.Benefit"></label>
                            <select name="benefits" class="data-input" data-field="benefit_id" id="benefit_id"></select>
                        </div>
                        <div class="form-group col-6">
                            <label for="withdraw_rate" class="form-label" vslang="titles.Withdraw Percent"></label>
                            <input name="withdraw_rate" class="form-control data-input" data-field="withdraw_rate" />
                        </div>
                        <div class="form-group col-6">
                            <label for="target_month" class="form-label" vslang="titles.Month"></label>
                            <select name="target_month" class="form-control data-input" data-field="target_month">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="form-group col-6">
                            <label for="year" class="form-label" vslang="titles.Year"></label>
                            <select name="year" class="form-control data-input" data-field="target_year">
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
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const jl = me.getData();

                            jl.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/employee/benefit-disbursement/save",
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
                                            cv_interact.success("Updated benefit disbursement successfully");
                                        }
                                        else{
                                        cv_interact.success("Added benefit disbursement successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveBenefitDisburse = (bd) => {
                        alert("It seems no action yet!");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Create Benefit Disburse",
                    modifyTitle: "Edit Benefit Disburse",
                    targetProp: "benefit_disbursements",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/employee/benefit-disbursement/form-options",
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
                    LocaleManager.translateZone(me.divModal);
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

"use strict";

var BenefitDisbursePolicyComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector( "#_main_benefit_disbursement_policy_component");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_benefit_disbursement_policy_component");
    mThis.title_prop = "disburse_policies";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddbdp");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    mThis.elTargetYear = mThis.self.querySelector("#target_year");

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
        transTitle: "titles.No",
        className: "align-middle text-center",
        data: (data, index) =>
            `<div class="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-semibold"
                style="width: 32px;height: 32px;background-color: #2b3991;font-size: 13px;">
                ${index + 1}
            </div>`,
        },
        {
            transTitle: "titles.Benefit",
            className: "align-middle text-nowrap",
            data: (data) => `
                <div class="d-flex align-items-center">
                    <div class="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style="width: 34px;height: 34px;background-color: rgba(43, 57, 145, 0.1);color: #2b3991;">
                        <i class="fa-solid fa-gift"></i>
                    </div>
                    <div>
                        <div class="text-prm-custom">
                            ${data.benefit_name ?? "-"}
                        </div>
                    </div>
                </div>
            `,
        },
        {
            transTitle: "titles.Target Month",
            className: "align-middle text-nowrap",
            data: (data) => {
                const monthIndex = Number(data.target_month ?? 0);
                const month = monthNames[monthIndex] ?? "-";
                const badgeClass =
                    monthIndex === 0
                        ? "bg-primary-subtle text-primary"
                        : "bg-light text-dark";
                return `
                    <span class="badge ${badgeClass} px-3 py-2 fw-normal">
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
                    <span class="badge ${year === 0 ? "bg-primary-subtle text-primary" : "bg-light text-dark"} px-3 py-2 fw-normal">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${year === 0 ? "All Years" : year}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Withdraw Rate",
            className: "align-middle",
            data: (data) => {
                const rate = Math.min(Math.max(Number(data.withdraw_rate ?? 0), 0),100);
                return `
                    <div style="min-width: 130px;">
                        <div class="d-flex justify-content-between mb-1">
                            <small class="text-muted">Rate</small>
                            <span class="fw-semibold text-primary-prm">
                                ${rate}%
                            </span>
                        </div>
                        <div class="progress" style="height: 6px; border-radius: 10px;">
                            <div class="progress-bar" role="progressbar" style="width: ${rate}%" aria-valuenow="${rate}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_bdp_action"} d-flex align-items-center justify-content-center" data-id="${data.id}" data-statusid="${data.status_id ?? ""}">
                        <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                    </a>
                </div>
            `,
        },

    ];


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BdpListView = new ListView("_benefit_disbursement_policy_list", {
            fetchApi: `${main_view.base_url}/mhr/disburse-policy/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BdpListView.showPage(mThis.getDataFormFilter());
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BdpListView.showPage(mThis.getDataFormFilter());
                },
            };
            if (!AuthManager.allowed(395,false)) return;
            BdpDialog.show(op);
        };

        mThis.pr_tbl = mThis.BdpListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement || mThis.pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 225) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BdpListView.showPage(mThis.getDataFormFilter());
        });

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_bdp_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_bdp"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bdp"
                }
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_bdp": {
                        mThis.editBfp(id, menuLink);
                        break;
                    }
                    case "delete_bdp": {
                        mThis.deleteBdp(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editBfp = (id, btn) => {
        if (!AuthManager.allowed(396,false)) return;
        BdpDialog.show({
            id,
            btn,
            onClose: () =>{
                mThis.BdpListView.showPage(mThis.getDataFormFilter());
            } 
        });
    };

    mThis.deleteBdp = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BdpListView.showPage(mThis.getDataFormFilter());
            },
        };
        if (!AuthManager.allowed(397,false)) return;
        cv_interact.confirm(
            "Delete this benefit disbursement policy?",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/disburse-policy/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.BdpListView.showPage(mThis.getDataFormFilter());
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getDataFormFilter = () => {
        let filters = {
            benefit_id: mThis.elBenefit.value,
            target_year: mThis.elTargetYear.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/disburse-policy/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefit,d.benefits,"id","name","",LocaleManager.trans("All Benefits","titles"),"");
                VSUtil.setComboItems(mThis.elTargetYear,d.years,"year","year","",LocaleManager.trans("All Years","titles"),"");
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.BdpListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const BdpDialog = (() => {
    const self = {};
    let dialogAdd = null;
    self.show = (op) => {

        dialogAdd =
            dialogAdd ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
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

                            <div class="col-6">
                                <select data-style="material" placeholder="${LocaleManager.trans('Benefit', 'labels')}" name="benefits" class="data-input form-control" data-field="benefit_id" id="benefit_id"> </select>
                            </div> 
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="withdraw_rate" class="form-control data-input" data-field="withdraw_rate" />
                                    <label vslang="titles.Withdraw Rate"></label>
                                </div>
                            </div>

                        <div class=" col-6">
                            <select data-style="material" placeholder="${LocaleManager.trans('Month', 'labels')}" name="month" class="form-control data-input" data-field="target_month">
                                ${months
                                        .map(
                                            (month) =>
                                                `<option value="${month.value}">${month.name}</option>`
                                        )
                                        .join("")}
                             </select>
                        </div>
                        <div class=" col-6">
                            <select data-style="material" placeholder="${LocaleManager.trans('Year', 'labels')}" name="year" class="form-control data-input" data-field="target_year">
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
                            const p = me.getData();
                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/disburse-policy/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated benefit disburse policy successfully");
                                        }
                                        else{
                                            cv_interact.success("Added benefit disburse policy successfully");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Benefit Disburse Policy",
                    modifyTitle: "vslang:titles.Modify Benefit Disburse Policy",
                    targetProp: "disburse_policy",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/disburse-policy/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {            
                },
            });

        dialogAdd.show(op);
    };
    return self;
})();
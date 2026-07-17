"use strict";

var BenefitDisbursePolicyComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector( "#_main_benefit_disbursement_policy_component");
    mThis.title_prop = "Benefit Disbursement Policy";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddbdp");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");

    const monthNames = [
        "All",
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
            title: "No",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Benefit",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "benefit_name",
        },

        {
            title: "Target Month",
            className: "align-middle",
            data: (data) => {
                const month = monthNames[data.target_month ] ?? "";

                return `<p class="p-0 m-0">${month} </p>`;
            },
        },

        {
            title: "Target Year",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "target_year",
        },
        {
            title: "Withdraw Rate",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.withdraw_rate ?? 0} %</p>`;
            },
        },

        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn_edit_bdp" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn_delete_bdp" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
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
                    mThis.BdpListView.showPage();
                },
            };
            if (!AuthManager.allowed(279)) return;
            BdpDialog.show(op);
        };
        const pr_tbl = mThis.BdpListView.getListContainer();
        const sh_parent = pr_tbl;
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
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_bdp");
            if (btn) {
                mThis.deleteBdp(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_bdp");
            if (btn) {
                mThis.editBfp(btn.dataset.id, btn);
            }
        });
    };

    mThis.editBfp = (id, btn) => {
        if (!AuthManager.allowed(280)) return;
        BdpDialog.show({
            id,
            btn,
            onClose: () => mThis.BdpListView.showPage(mThis.getDataFormFilter()),
        });
    };

    mThis.deleteBdp = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BdpListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(281)) return;
        cv_interact.confirm(
            "Delete this benefit disbursement policy?",
            {
                title: "Delete Benefit Disbursement Policy",
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
                                mThis.BdpListView.showPage();
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

                VSUtil.setComboItems(
                    mThis.elBenefit,
                    d.benefits,
                    "id",
                    "name",
                    true,
                    "All Benefits",
                    null
                );
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
                cssClass: "modal-lg",
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
                        `<div class="row">
                        <div class="form-group col-md-6">
                            <label for="benefits" class="form-label" vslang="titles.Benefit"></label>
                            <select name="benefits" class="data-input" data-field="benefit_id" id="benefit_id"></select>
                        </div>
                        <div class="form-group col-6">
                            <label for="withdraw_rate" class="form-label" vslang="titles.Withdraw Rate"></label>
                            <input name="withdraw_rate" class="form-control data-input" data-field="withdraw_rate" />
                        </div>
                        <div class="form-group col-6">
                            <label for="month" class="form-label" vslang="titles.Month"></label>
                            <select name="month" class="form-control data-input" data-field="target_month">
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
                    createTitle: "Add Benefit Disburse Policy",
                    modifyTitle: "Edit Benefit Disburse Policy",
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
                    // onResponse: (me, res) => {
                    //     console.log('result from api "/form-options": ', res);
                    // },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialogAdd.show(op);
    };
    return self;
})();

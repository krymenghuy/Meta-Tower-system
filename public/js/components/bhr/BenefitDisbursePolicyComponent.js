"use strict";

var BenefitDisbursePolicyComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_benefit_disbursement_policy_component");
    this.self = this.jm[0];
    this.title_prop = "Benefit Disbursement Policy";
    this.btnAdd = this.self.querySelector("#_btnAddbdp");
    this.divFilter = this.self.querySelector("#_divFilter");

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.cols = [
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
                const month = monthNames[data.target_month - 1] ?? '';

                return `<p class="p-0 m-0">${month} </p>`;
            }
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
            }
        },

        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <button class="btn btn-sm btn-primary btn_edit_bdp" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn_delete_bdp" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.BdpListView = new ListView("_benefit_disbursement_policy_list", {
            fetchApi: `${main_view.base_url}/hr/bdp/list-paginate`,
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
            BdpDialog.show(op);
        };
        const pr_tbl = mThis.BdpListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    this.setActionListeners = () => {
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

    this.editBfp = (id, btn) => {
        BdpDialog.show({
            id,
            btn,
            onClose: () => mThis.BdpListView.showPage(),
        });
    };

    this.deleteBdp = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BdpListView.showPage(mThis.getFilterData());
            },
        };
        cv_interact.confirm(
            "Delete this Benefit Disbursement Policy?",
            {
                title: "Delete Benefit Disbursement Policy",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/bdp/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.BdpListView.showPage()

                            }
                        });
                }
            }
        );
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        // mThis.prepareFormOptions();
        mThis.BdpListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };

})

const BdpDialog = (() => {
    const self = {};
    let dialogAdd = null;
    self.show = (op) => {
        console.log(999, op);

        dialogAdd = dialogAdd || new GeneralDialog({
            cssClass: 'modal-lg',
            backdrop: 'static',
            keyboard: true,
            createContent: () => {
                const months = [
                    { value: 1, name: "Jan" },
                    { value: 2, name: "Feb" },
                    { value: 3, name: "Mar" },
                    { value: 4, name: "Apr" },
                    { value: 5, name: "May" },
                    { value: 6, name: "Jun" },
                    { value: 7, name: "Jul" },
                    { value: 8, name: "Aug" },
                    { value: 9, name: "Sep" },
                    { value: 10, name: "Oct" },
                    { value: 11, name: "Nov" },
                    { value: 12, name: "Dec" },
                ];

                const currentYear = new Date().getFullYear();
                const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

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
                                ${months.map(month => `<option value="${month.value}">${month.name}</option>`).join("")}
                            </select>
                        </div>
                        <div class="form-group col-6">
                            <label for="year" class="form-label" vslang="titles.Year"></label>
                            <select name="year" class="form-control data-input" data-field="target_year">
                                ${years.map(year => `<option value="${year}">${year}</option>`).join("")}
                            </select>
                        </div>


                    </div>`
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
                    cssClass: 'btn btn-default',
                    click: (me, btn) => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span>Save</span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const p = me.getData();
                        p.id = me.dataOptions.id;

                        vsapi.call([main_view.base_url, '/hr/bdp/save'].join(''), p, btn, null).then(res => {
                            if (res.status_code == 200) {
                                me.hide(true, p);
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                }
            ],

            prepareFormOptions: {
                createTitle: 'Add Benefit Disburse Policy',
                modifyTitle: 'Edit Benefit Disburse Policy',
                targetProp: 'bdp',
                api: {
                    endpoint: [main_view.base_url, '/hr/bdp/form-options'].join(''),
                    params: (op) => {
                        return { 'id': op.id };
                    }
                },
                onResponse: (me, res) => {
                    console.log('result from api "/form-options": ', res);
                }
            },

            onPrepareForm:(me, data)=>{
                LocaleManager.translateZone(me.divModal);
           }
        });

        dialogAdd.show(op);
    }
    return self;
})();

"use strict";

var BenefitDisbursementComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children( "#_main_benefit_disbursement_component");
    this.self = this.jm[0];
    this.title_prop = "Benefits Disbursement";
    this.btnAdd = this.self.querySelector("#_btnAddBenefitDisburse");
    this.elSearch = this.self.querySelector("#_benefit_disburse_search");
    this.elCard = this.self.querySelector(".top_level_card");
    this._searchBenefitDisburse = this.self.querySelector("#container_benefit_disburse");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
                const target_month = monthNames[data.target_month - 1] ?? "";
                return `<p class="p-0 m-0">${target_month}</p>`;
            },
        },
        {
            title: "Target Year",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.target_year}</span>`,
        },
        {
            title: "Withdraw Rate",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${data.withdraw_rate}%</span>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <button class="btn btn-sm btn-primary btn-benefit-disbursement-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-benefit-disbursement-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.BenefitDisburseListView = new ListView("_benefit_disburse_list", {
            fetchApi: `${mThis.base_url}/hr/employee/benefit-disbursement/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
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
            BenefitDisburseDialog.show(op);
        };
        const pr_tbl = mThis.BenefitDisburseListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

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

    this.setFilterPeriod = (p) => {
        return p;
    };

    this.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchBenefitDisburse.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p.search_value, main_filters);

        return p;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-benefit-disbursement-modify");
            if (btn) {
                mThis.editBenefitDisburse(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-benefit-disbursement-delete");
            if (btn) {
                mThis.deleteBenefitDisburse(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.editBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        BenefitDisburseDialog.show(op);
    };
    this.deleteBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Benefit Disburse?",
            {
                title: "Delete this Benefit Disburse?",
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
                                    "Benefit Disburse Delete Successfully"
                                );
                                mThis.BenefitDisburseListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/employee/benefit-disbursement/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log(1111, this.elSortBy);
            });
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.BenefitDisburseListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
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
                    return [
                        `<div class="row">
                            <div class="form-group col-md-6">
                                <label for="name" class="form-label">Name</label>
                                <span class="text-danger">*</span>
                                <input type="text" class="form-control data-input" data-field="name" id="name" required>
                            </div>
                             <div class="form-group col-md-6">
                                <label for="rank" class="form-label">Rank</label>
                                <span class="text-danger">*<small>(1-100)</small></span>
                                <input type="number" class="form-control data-input" data-field="rank" id="job_ranking" rows="2" placeholder="" required>                        
                            </div>
                            <div class="form-group col-md-12">
                                <label for="description" class="form-label">Description</label>
                                <textarea type="text" class="form-control data-input" data-field="description" id="description" placeholder="job description"></textarea>
                            </div>
                            
                           
                           
                         </div>`,
                    ].join("");
                },
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
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveBenefitDisburse = (bd) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Benefit Disbursement",
                    modifyTitle: "Edit Benefit Disbursement",
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
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
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

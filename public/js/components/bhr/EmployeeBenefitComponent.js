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

    this.bonus_cols = [
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                        </div>`;
            },
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<div style="display: block;; align-items: center;">
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.name ?? ""
                                }</span>
                                <br/>
                                <span style="font-size: 12px; color: gray;">${
                                    data.email ?? ""
                                }</span>
                            </div>
                        </div>`;
            },
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: "remarks",
        },
        // {
        //     title: "benefit types",
        //     className: "align-middle",
        //     data: (data, index, tr) => {
        //         return `<p class="p-0 m-0">${data.benefit_type ?? ""}</p>`;
        //     },
        // },
        {
            title: "Create date",
            className: "align-middle",
            data: "create_date",
        },
        {
            title: "Create By",
            className: "align-middle",
            data: "update_user",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_employee_benefit_action"
                        }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                            <img src="${
                                main_view.asset_url
                            }/images/icons/more_vert (3).svg" />
                        </a>
                    </div>
                </div>`,
        },
    ];

    this.seniority_cols = [
        {
            title: "Photo",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                        </div>`;
            },
        },
        {
            title: "Seniority",
            className: "align-middle",
            data: "benefit_id",
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: "remarks",
        },
        {
            title: "Start date",
            className: "align-middle",
            data: "start_date",
        },
        {
            title: "End date",
            className: "align-middle",
            data: "create_date",
        },
        {
            title: "Create By",
            className: "align-middle",
            data: "update_user",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_employee_benefit_action"
                        }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                            <img src="${
                                main_view.asset_url
                            }/images/icons/more_vert (3).svg" />
                        </a>
                    </div>
                </div>`,
        },
    ];

    this.init = function () {
        if (mThis.initAlready) return;

        mThis.EmployeeBenefitListView = new ListView("_employee_bonus_list", {
            fetchApi: `${mThis.base_url}/hr/benefit/bonus-list`,
            perPage: 6,
            apiCluster: main_view.apiCluster,
            columns: mThis.bonus_cols,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
        });

        // Handle tab switching between Bonuses and Seniorities
        const bonusTab = document.getElementById("bonus-tab");
        const seniorityTab = document.getElementById("seniority-tab");

        bonusTab.addEventListener("click", function () {
            mThis.switchView("bonus");
        });

        seniorityTab.addEventListener("click", function () {
            mThis.switchView("seniority");
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeBenefitListView.showPage();
                },
            };
            EmployeeBenefitDialog.show(op);
        };

        const pr_tbl = mThis.EmployeeBenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);
        this.setFilterPeriod = (p, name, start_date, end_date) => {
            return p;
        };
        mThis.initAlready = true;
    };

    this.switchView = function (viewType) {
        const apiUrl =
            viewType === "bonus"
                ? `${mThis.base_url}/hr/benefit/bonus-list`
                : `${mThis.base_url}/hr/benefit/seniority-list`;

        const columns =
            viewType === "bonus" ? mThis.bonus_cols : mThis.seniority_cols;

        // Reinitialize the list view based on the selected tab
        mThis.EmployeeBenefitListView = new ListView("_employee_bonus_list", {
            fetchApi: apiUrl,
            perPage: 6,
            apiCluster: main_view.apiCluster,
            columns: columns,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.EmployeeBenefitListView.showPage();
    };

    this.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_employee_benefit_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Edit Employee Benefit">Edit Employee Benefit</span>',
                    icon: `<i class="fa-regular fa-pen-to-square fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_employee_benefit",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Benefit">Delete Employee Benefit</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_employee_benefit",
                },
            ],
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_employee_benefit": {
                        mThis.editEmployeeBenefit(id, menulink);
                        break;
                    }
                    case "delete_employee_benefit": {
                        mThis.deleteEmployeeBenefit(id, menulink);
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    this.editEmployeeBenefit = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage();
            },
        };
        EmployeeBenefitDialog.show(op);
    };

    this.deleteEmployeeBenefit = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Employee Benefit?",
            {
                title: "Delete this Employee Benefit?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/benefit/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Employee Benefits Deleted Successfully"
                                );
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
                `${main_view.base_url}/hr/benefit/form-options`,
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
        mThis.EmployeeBenefitListView.showPage();
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
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Name"></label>
                                <select name="employee" class=" data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group  col-12 d.none">
                            <div id="info"></div>
                            </div>
                            
                            <div class="form-group col-12">
                                <label for="benefit_type_id" class="form-label" vslang="titles.Benefit Type"></label>
                                <input type="number" name="benefit_type_id" class=" form-control data-input"  data-field="benefit_type_id"></input>
                            </div>
                        
                            <div class="form-group col-12">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <textarea  type="number" class="form-control data-input" data-field="amount"></textarea>
                            </div>
                            <div class="form-group col-12">
                                <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                                <textarea  type="text" class="form-control data-input" data-field="remarks"></textarea>
                            </div>

                         </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2 py-2"><img style="width:80px;height:50px margin-top:100px;margin-right:10px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span> ${d.position} </span> </div></div>`;
                        },
                        // textField:"name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/benefit/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Employee Benefits",
                    modifyTitle: "Edit Employee Benefits",
                    targetProp: "benefit",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/benefit/form-options",
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

"use strict";
var PositionComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_positionComponent",
    );

    mThis.title_prop = "Positions";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddPosition");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_position");
    mThis.elDepartment = mThis.self.querySelector("#el_department");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "",
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<span class="text-primary-custom">${data.title}</span>`,
        },
        {
            title: "Staff Group",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<span class="text-primary-custom">${data.staff_group}</span>`,
        },
        {
            title: "Job Level",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<span class="text-capitalize text-primary-custom">${data.level}</span>`,
        },

        {
            title: "Department",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) =>
                `<span class="text-primary-custom ">${data.department}</span>`,
        },
        {
            title: "Salary",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.salary, data.currency_code)}</p>`;
            },
        },

        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? ""}</span><br/>
                <small >${data.updated_at ?? ""}</small>
            </div>`,
        },
        {
            className: "col_action align-end",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_position_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PositionListView = new ListView("_position_list", {
            fetchApi: `${main_view.base_url}/mhr/position/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.PositionListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PositionListView.showPage();
                },
            };
            if (!AuthManager.allowed(219)) return;
            PositionDialog.show(op);
        };
        mThis.listContainer = mThis.PositionListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.PositionListView) {
                    mThis.PositionListView.showPage(mThis.getFilterData());
                } else {
                    console.error("PositionListView is not defined");
                }
            }, 200);
        });

        mThis.initDropdownMenus(mThis.listContainer);

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_position_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Position">Modify Position</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_position",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Position">Delete Position</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_position",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_position": {
                        mThis.editPosition(id, menuLink);
                        break;
                    }
                    case "delete_position": {
                        mThis.deletePosition(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editPosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(220)) return;
        PositionDialog.show(op);
    };

    mThis.deletePosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            },
        };
        if (!AuthManager.allowed(221)) return;
        cv_interact.confirm(
            "Delete this position?",
            {
                title: "Delete Position",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/position/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "The position was deleted!",
                                );
                                mThis.PositionListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            },
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/position/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elDepartment,
                    d.departments,
                    "id",
                    "name",
                    true,
                    "All Department",
                    null,
                );
            });
    };

    mThis.show = function () {
        mThis.init();

        mThis.PositionListView.showPage(mThis.getFilterData());
        mThis.prepareFormOptions();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const PositionDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static", //User click outside form, do not close form
            keyboard: true, //prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row g-3">
                <div class="col-6">
                    <select data-style="material" name="department" class="form-control data-input" placeholder="Department"  data-field="department_id"></select>
                </div>
                <div class="col-6">
                    <select data-style="material" name="job_level" class="form-control data-input" placeholder="Job Level"  data-field="job_level_id"></select>
                </div>
                <div class="col-6">
                    <div class="vs-material-field">
                        <input type="text" data-type="text" name="position" class="data-input form-control form_input" data-field="name" placeholder=" " />
                        <label vslang="labels.Position"></label>
                    </div>
                </div>
                  <div class="form-group col-md-4">
                        <label for="staff_group" class="form-label" vslang="titles.Staff Group">Staff Group</label>
                        <span class="text-danger">*</span>
                        <select class="data-input" name="staff_group" data-field="staff_group_id">
                        </select>
                    </div>
                 <div class="form-group col-md-4">
                        <label for="salary" class="form-label" vslang="titles.Salary"></label>
                        <span class="text-danger" >*</span>
                        <input  type="number" class="form-control data-input" data-field="salary">
                 </div>
                <div class="form-group col-4">
                    <label for="currency_code" class="form-label" vslang="titles.Currency">Currency</label>
                    <select  class="modal-select data-input" name="currency_code" data-field="currency_code" disabled>
                    </select>
                </div>


              </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "department",
                    data: "departments",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "job_level",
                    data: "job_levels",
                    textField: "level",
                    valueField: "id",
                },
                {
                    name: "staff_group",
                    data: "staff_groups",
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
                    label: '<span class=""><i class="fa-solid text-danger fa-xmark"></i></span>',
                    cssClass: "btn btn-sm-outline rounded-3",
                    click: (me, btn) => {
                        //Close with Cancel button
                        me.hide(false);
                    },
                },
                {
                    label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                    cssClass: "btn btn-sm-outline rounded-3",
                    click: (me, btn) => {
                        const p = me.getData();
                        p.staff_group = Number(p.staff_group);
                        p.id = me.dataOptions.id; //get "id" from op
                        console.log(123, p);

                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/position/save"].join(
                                    "",
                                ),
                                p,
                                btn,
                                null,
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
                createTitle: "Add Position",
                modifyTitle: "Edit Position",
                targetProp: "positions",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/position/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                //    onResponse: (me, res)=>{
                //      console.log('result from api "/form-options": ', res);
                //    }
            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.controls.currency_code.value = VSMoney.getCurrency().code;
            },
        });

        dialog.show(op);
    };

    return self;
})();

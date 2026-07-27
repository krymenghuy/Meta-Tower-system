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
            transTitle: "titles.No",
            className: "align-middle text-capitalize",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<div class="text-prm-custom text-capitalize" style="width:90px; ">
                <span class="text-prm-custom text-capitalize" >${data.name ?? "_"}</span></div>`,
        },
        {
            transTitle: "titles.Shortcut",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-capitalize text-primary-custom">${data.code ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Level",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-capitalize text-primary-custom">${data.level ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Department",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-primary-custom ">${data.department ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Staff Group",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-primary-custom">${data.staff_group ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Salary",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.salary, data.currency_code)}</p>`;
            },
        },
        {
            transTitle: "titles.Description",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break small" style ="word-break:break-word;">${data.description ?? '_'}</span>
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
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_position_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            },
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
            // if (!AuthManager.allowed(219)) return;
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
        const menuOptions = {
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
        new VSDropdownMenu(menuOptions);
    };

    mThis.editPosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(220)) return;
        PositionDialog.show(op);
    };

    mThis.deletePosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(221)) return;
        cv_interact.confirm(
            "delete_position",
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
                                    "delete_success_position",
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
                    d.departments || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Department", "titles"),
                    "",
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        
        mThis.PositionListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();

const PositionDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static", //User click outside form, do not close form
            keyboard: true, //prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="position" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label vslang="labels.Name"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="position_kh" class="data-input form-control form_input" data-field="name_kh" placeholder=" " />
                                <label vslang="labels.Name (KH)"></label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="code" class="data-input form-control form_input" data-field="code" placeholder=" " />
                                <label vslang="labels.Shortcut"></label>
                            </div>
                        </div>
                        <div class="col-3">
                            <select data-style="material" name="job_level" class="form-control data-input" placeholder="${LocaleManager.trans('Job Level', 'labels')}"  data-field="job_level_id"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="department" class="form-control data-input" placeholder="${LocaleManager.trans('Department', 'labels')}"  data-field="department_id"></select>
                        </div>
                        <div class="col-3">
                            <div class="vs-material-field">
                                <input type="number" data-type="text" name="salary" class="data-input form-control form_input" data-field="salary" placeholder=" " />
                                <label vslang="labels.Salary"></label>
                            </div>
                        </div>
                        <div class="col-3">
                            <select data-style="material" name="currency_code" class="form-control data-input" placeholder="${LocaleManager.trans('Currency Code', 'labels')}"  data-field="currency_code"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="staff_group" class="form-control data-input" placeholder="${LocaleManager.trans('Staff Group', 'labels')}"  data-field="staff_group_id"></select>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                <label vslang="labels.Description"></label>
                            </div>
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
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_success_position",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_success_position",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Create Position",
                modifyTitle: "vslang:titles.Modify Position",
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
                me.controls.currency_code.value = VSMoney.getCurrency().code;
            },
        });

        dialog.show(op);
    };

    return self;

})();

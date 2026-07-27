"use strict";
var DepartmentComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_departmentComponent",
    );

    mThis.title_prop = "Departments";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddDepartment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    // mThis.elStatus = mThis.self.querySelector("#el_status");
    mThis.elSearch = mThis.self.querySelector("#_search_department");
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
            data: (data) => `
                <span class="text-primary-custom">${data.name ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Shortcut",
            className: "align-middle text-capitalize text-nowrap",
            data: (data) =>
                `<span class="text-prm-custom">${data.shortcut ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Description",
            className: "align-middle text-capitalize text-nowrap",
            data: (data) =>
                `<span class="text-prm-custom">${data.description ?? '_'}</span>`,
        },
        {
            transTitle: "titles.Last Updated",
            className: 'align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_department_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.DepartmentListView = new ListView("_dep_list", {
            fetchApi: `${main_view.base_url}/mhr/department/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

         mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

               mThis.DepartmentListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.DepartmentListView.showPage();
                },
            };
            if (!AuthManager.allowed(217)) return;
            DepartmentDialog.show(op);
        };
        mThis.listContainer = mThis.DepartmentListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.DepartmentListView) {
                    mThis.DepartmentListView.showPage(mThis.getFilterData());
                } else {
                    console.error("Department List view is not defined");
                }
            }, 200);
        });
        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };    

       mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_department_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_department",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_department",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_department": {
                        mThis.editDepartment(id, menuLink);
                        break;
                    }
                    case "delete_department": {
                        mThis.deleteDepartment(id, menuLink);
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
    mThis.editDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(216)) return;
        DepartmentDialog.show(op);
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

    mThis.deleteDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(218)) return;
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
                            `${main_view.base_url}/mhr/department/delete`,
                            { id: id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_department_success");
                                mThis.DepartmentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/department/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.DepartmentListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();

const DepartmentDialog = (() => {
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
                        <div class="col-md-6">
                            <div class="vs-material-field">
                                <input id="dep_name" type="text" data-type="text" name="department" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label for="dep_name" vslang="labels.Name"></label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="vs-material-field">
                                <input id="dep_shortcut" type="text" data-type="text" name="shortcut" class="data-input form-control form_input" data-field="shortcut" placeholder=" " />
                                <label for="dep_shortcut" vslang="titles.Shortcut"></label>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="vs-material-field">
                                <textarea id="dep_description" name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                <label for="dep_description" vslang="labels.Description"></label>
                            </div>
                        </div> 

                    </div>`,
                ].join("");
            },

            // configSelect:[
            //    {
            //      name:"department",
            //      data:'departments',
            //      textField:"name",
            //      valueField:'id'
            //    },
            // ],
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
                                [
                                    main_view.base_url,
                                    "/mhr/department/save",
                                ].join(""),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_department_success",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_department_success",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Create Department",
                modifyTitle: "vslang:titles.Modify Department",
                targetProp: "departments",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/department/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },

            onPrepareForm: (me, data) => {
            },
        });

        dialog.show(op);
    };

    return self;
})();

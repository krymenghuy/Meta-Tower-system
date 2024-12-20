"use strict";

var ExitFormItemComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exit_form_item_component");
    this.self = this.jm[0];
    this.title_prop = "Exit Form Items";
    this.btnAdd = this.self.querySelector("#_btnAddExitFormItem");
    this.elSearch = this.self.querySelector("#_exit_form_item_search");
    this.divFilter = this.self.querySelector("#container_exit_form_item");

    this.cols = [
        {
            title: "Item",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.name ?? "NULL"
                }</span>`,
        },
        {
            title: "category",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.category_name ?? "NULL"
                }</span>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-exit_form_item-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-exit_form_item-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitFormListView = new ListView("_exit_form_item_list", {
            fetchApi: `${mThis.base_url}/hr/exit-item/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage();
                },
            };
            ExitFormItemDialog.show(op);
        };
        const pr_tbl = mThis.ExitFormListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitFormListView) {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit Form is not defined");
            }
        }, 200);
    });

    this.setFilterPeriod = (p) => {
        return p;
    };

    this.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(
                e.target,
                ".btn-exit_form_item-modify"
            );
            if (btn) {
                mThis.edit_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form_item-delete");
            if (btn) {
                mThis.delete_exit_form(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.edit_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        ExitFormItemDialog.show(op);
    };
    this.delete_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Item Status?",
            {
                title: "Delete this Item Status?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/exit-item/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Item Status Delete Successfully"
                                );
                                mThis.ExitFormListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi.call(
            `${main_view.base_url}/hr/exit-item/form-options`,
            null,
            null,
            null
        );
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.ExitFormListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const ExitFormItemDialog = (() => {
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
                            <div class="form-group col-md-12">
                                <label for="category_name" class="form-label" vslang="titles.Category"></label>
                                <select name="category_name" class="form-control data-input" data-field="check_point_cat_id" id="category_name"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="name" class="form-label" vslang="titles.name"></label>
                                <input name="name" class="form-control data-input" data-field="name" id="remarks">
                            </div>                           
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "category_name",
                        data: "check_point_categories",
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
                                        "/hr/exit-item/save",
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
                    createTitle: "Add Exit Form Item",
                    modifyTitle: "Edit Exit Form Item",
                    targetProp: "exit_items",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/exit-item/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (me, res) => {
                        console.log("API Response:", res);
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

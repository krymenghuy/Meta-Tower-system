"use strict";

var CheckPointComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_check_point_component");
    mThis.self = mThis.jm[0];
    mThis.title_prop = "Check Points";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPoint");
    mThis.elSearch = mThis.self.querySelector("#_check_point_search");
    mThis.divFilter = mThis.self.querySelector("#container_check_point");
    mThis.elCheckPoint = mThis.self.querySelector("#el_checkPoint");
    mThis.cols = [
        {
            title: "#",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
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
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-check_point-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-check_point-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = function () {
        if (mThis.initAlready) return;
        mThis.CheckPointListView = new ListView("_check_point_list", {
            fetchApi: `${mThis.base_url}/hr/check-point/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.CheckPointListView.showPage();
                },
            };
            ExitFormItemDialog.show(op);
        };
        const pr_tbl = mThis.CheckPointListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };
        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.CheckPointListView) {
                mThis.CheckPointListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit form is not defined");
            }
        }, 200);
    });

    mThis.setFilterPeriod = (p) => {
        return p;
    };

    mThis.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
            category_id: mThis.elCheckPoint.value,
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
                ".btn-check_point-modify"
            );
            if (btn) {
                mThis.edit_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-check_point-delete");
            if (btn) {
                mThis.delete_exit_form(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    mThis.edit_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.CheckPointListView.showPage();
            },
        };
        ExitFormItemDialog.show(op);
    };
    mThis.delete_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.CheckPointListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this checkpoint?",
            {
                title: "Delete checkpoint",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/check-point/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Checkpoint delete successfully"
                                );
                                mThis.CheckPointListView.showPage();
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
        vsapi.call(
            `${main_view.base_url}/hr/check-point/form-options`,
            null,
            null,
            null
        )
        .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elCheckPoint,
                    d.check_point_categories,
                    "id",
                    "name",
                    true,
                    "All Category",
                    null
                );
            });
    };
    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.CheckPointListView.showPage();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);

    };
    return mThis;
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
                                <select name="category_name" class="form-control data-input" data-field="category_id"></select>
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
                                        "/hr/check-point/save",
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
                                            cv_interact.success('Updated checkpoints successfully');
                                        }
                                        else{
                                        cv_interact.success('Create checkpoints successfully');
                                        }
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
                    createTitle: "Create Check Point",
                    modifyTitle: "Edit Check Point",
                    targetProp: "check_points",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/check-point/form-options",
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

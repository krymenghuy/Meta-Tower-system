"use strict";

var CheckPointCategoryComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exitCheckpoints_component");
    this.self = this.jm[0];
    this.title_prop = "Check Point Category";
    this.btnAdd = this.self.querySelector("#_btnAddExitCheckpoints");
    this.elSearch = this.self.querySelector("#_exitCheckpoints_search");
    this.divFilter = this.self.querySelector("#container_exitCheckpoints");
    this.cols = [
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
            title: "",
            className: "align-middle ",
            data: "",
        },

        {
            title: "",
            className: "align-middle ",
            data: "",
        },

        {
            title: "",
            className: "align-middle ",
            data: "",
        },
        {
            title: "Name",
            className: "align-left text-start w-10",
            data: (data) =>
                `<span class="text-primary-custom text-start">${data.name}</span>`,
        },
        {
            title: "Date",
            className: "align-left text-start w-10",
            data: (data) =>
                `<span class="text-primary-custom text-start">${data.update_date}</span>`,
        },
        {
            title: "",
            className: "col_action align-end",
            data: (data) => {
                return `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end align-end gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-check_points-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-check_points-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitCheckpointsListView = new ListView("_exitCheckpoints_list", {
            fetchApi: `${mThis.base_url}/hr/check-point-category/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitCheckpointsListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ExitCheckpointsListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            ExitCheckpointsDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitCheckpointsListView.showPage();
                },
            });
        };
        const pr_tbl = mThis.ExitCheckpointsListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 210 + "px";
        };


        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitCheckpointsListView.showPage(mThis.getFilterData());
        });
        mThis.initDropdownMenus();
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitCheckpointsListView) {
                mThis.ExitCheckpointsListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit exit check point is not defined");
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
                ".btn-check_points-modify"
            );
            if (btn) {
                mThis.edit_check_points(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-check_points-delete");
            if (btn) {
                mThis.delete_check_points(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.edit_check_points = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitCheckpointsListView.showPage();
            },
        };
        ExitCheckpointsDialog.show(op);
    };
    this.delete_check_points = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitCheckpointsListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Exit check point?",
            {
                title: "Delete this Exit exit check point?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/check-point-category/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Exit check point Delete Successfully"
                                );
                                mThis.ExitCheckpointsListView.showPage();
                            }
                            else {
                                cv_interact.error(res.message);
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/check-point-category/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.ExitCheckpointsListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();
const ExitCheckpointsDialog = (() => {
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
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                <input name="name" class="form-control data-input"  data-field="name"></input>
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
                                        "/hr/check-point-category/save",
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
                                            cv_interact.success('Updated Checkpoints Category Successfully');
                                        }
                                        else
                                        {
                                            cv_interact.success('Added Checkpoints Category Successfully');
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
                    createTitle: "Add Checkpoints Category",
                    modifyTitle: "Edit Checkpoints Category",
                    targetProp: "check_point_categories",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/check-point-category/form-options",
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

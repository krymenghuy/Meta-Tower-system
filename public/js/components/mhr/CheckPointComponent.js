"use strict";

var CheckPointComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_check_point_component");

    mThis.title_prop = "Checkpoints";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPoint");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_check_point_search");
    mThis.elCategory = mThis.self.querySelector("#el_check_point_category");

    mThis.cols = [
        {
            className: "align-middle text-nowrap ",
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.name ?? "-"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Category",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.category_name ?? "-"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                const [date, time] = (data.updated_at ?? "").split(" ");
                return `<div class="d-flex flex-column align-items-center text-center" style="width:180px;">
                    ${data.update_user ? `<span class="text-capitalize text-prm-custom">${data.update_user}</span>` : ""}
                    <small class="text-muted">${date || "-"}</small>
                    <small class="text-muted">${time ?? ""}</small>
                </div>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_check_point" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_check_point" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.CheckPointListView = new ListView("_check_point_list", {
            fetchApi: `${main_view.base_url}/mhr/check-point/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.CheckPointListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(302)) return;
            CheckPointDialog.show(op);
        };
        mThis.pr_tbl = mThis.CheckPointListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.CheckPointListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_check_point");
            if (btn) {
                mThis.deleteCheckPoint(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_check_point");
            if (btn) {
                mThis.editCheckPoint(btn.dataset.id, btn);
            }
        });
    };

    mThis.editCheckPoint = (id, btn) => {
        if (!AuthManager.allowed(301)) return;
        CheckPointDialog.show({ id, btn, onClose: () => mThis.CheckPointListView.showPage(mThis.getFilterData()), });
    };

    mThis.deleteCheckPoint = (id, menuLink) => {
        if (!AuthManager.allowed(303)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Checkpoint",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${main_view.base_url}/mhr/check-point/delete`, { id: id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_check_point");
                                mThis.CheckPointListView.showPage(mThis.getFilterData());
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
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
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/check-point/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elCategory, d.check_point_categories, "id", "name", "", LocaleManager.trans("All Categories", "titles"), "");
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const CheckPointDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="category" class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'labels')}">
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input id="_check_point_name" type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label for="_check_point_name" vslang="labels.Name"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                configSelect: [
                    {
                        name: "category",
                        data: "check_point_categories",
                        textField: "name",
                        valueField: "id",
                    },
                ],

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/check-point/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_check_point");
                                        }
                                        else {
                                            cv_interact.success("create_success_check_point");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Check Point",
                    modifyTitle: "vslang:titles.Edit Check Point",
                    targetProp: "check_points",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/check-point/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
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

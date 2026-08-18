"use strict";

var CheckPointComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_check_point_component");

    mThis.title_prop = "checkpoints";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPoint");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_check_point_search");
    mThis.elCategory = mThis.self.querySelector("#el_check_point_category");

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
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.name ?? "_"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Name KH",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.name_kh ?? "_"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Evaluator",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:170px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.category_name ?? "_"}</span>
                    </div>
                `;
            }
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
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_check_point_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
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
            // if (!AuthManager.allowed(302)) return;
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
        mThis.initDropdownMenus(mThis.pr_tbl)
        mThis.initAlready = true;
    };
    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_check_point_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Job Level</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "btn_edit_check_point"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "btn_delete_check_point"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "btn_edit_check_point": {
                        mThis.editCheckPoint(id, menuLink);
                        break;
                    }
                    case "btn_delete_check_point": {
                        mThis.deleteCheckPoint(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editCheckPoint = (id, btn) => {
        // if (!AuthManager.allowed(301)) return;
        CheckPointDialog.show({ id, btn, onClose: () => mThis.CheckPointListView.showPage(mThis.getFilterData()), });
    };

    mThis.deleteCheckPoint = (id, menuLink) => {
        // if (!AuthManager.allowed(303)) return;
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
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input id="name" type="text" name="name"  class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input id="name_kh" type="text" name="name_kh" class="data-input form-control" data-field="name_kh" placeholder=" " />
                                    <label vslang="labels.Name (KH)"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="category" class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'labels')}">
                                </select>
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
                        name: "category",
                        data: "check_point_categories",
                        textField: "name",
                        valueField: "id",
                    },
                ],

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
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
                    // LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

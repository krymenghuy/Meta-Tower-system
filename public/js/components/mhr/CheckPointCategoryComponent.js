"use strict";

var CheckPointCategoryComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_check_point_category_component");

    mThis.title_prop = "Checkpoint Categories";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPointCategory");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_check_point_category_search");

    mThis.cols = [
        {
            className: "align-middle text-nowrap ",
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                console.log(123456,data);

                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.name ?? "-"}</span>
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
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_check_point_category" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_check_point_category" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.CheckPointCategoryListView = new ListView("_check_point_category_list", {
            fetchApi: `${main_view.base_url}/mhr/check-point-category/list-paginate`,
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
                    mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(299)) return;
            CheckPointCategoryDialog.show(op);
        };
        mThis.pr_tbl = mThis.CheckPointCategoryListView.getListContainer();
        const sh_parent = mThis.pr_tbl;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_check_point_category");
            if (btn) {
                mThis.deleteCheckPointCategory(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_check_point_category");
            if (btn) {
                mThis.editCheckPointCategory(btn.dataset.id, btn);
            }
        });
    };

    mThis.editCheckPointCategory = (id, btn) => {
        if (!AuthManager.allowed(298)) return;
        CheckPointCategoryDialog.show({ id, btn, onClose: () => mThis.CheckPointCategoryListView.showPage(mThis.getFilterData()),});
    };

    mThis.deleteCheckPointCategory = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(300)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Checkpoint Category",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call( `${main_view.base_url}/mhr/check-point-category/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_check_point_category");
                                mThis.CheckPointCategoryListView.showPage();
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
            .call(`${main_view.base_url}/mhr/check-point-category/form-options`,null,null,null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show =  (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());

        });

    };
    return mThis;
})();

const CheckPointCategoryDialog = (() => {
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
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

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
                                        "/mhr/check-point-category/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_check_point_category");
                                        }
                                        else{
                                        cv_interact.success("create_success_check_point_category");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Checkpoint Category",
                    modifyTitle: "vslang:titles.Edit Checkpoint Category",
                    targetProp: "check_point_categories",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/check-point-category/form-options",
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
                },
            });

        dialog.show(op);
    };

    return self;
})();

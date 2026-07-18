"use strict";
var WorkShiftListComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_workShiftListComponent");

    mThis.title_prop = "Shift List";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWorkShift");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_work_shift_list_search");
    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #1a1647; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-capitalize",
            data: (data) => {
                return `<span class="text-pr-custom">${data.name}</span>`;
            },
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data) => {
                return [
                    `<span class="text-Capitalize d-block">${data.update_user ?? '-'}</span>`,
                    `<span class="text-small">${data.updated_at ?? '-'}</span>`,
                ].join("");
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_work_shift" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_work_shift" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.WorkShiftListsView = new ListView("_work_shift_lists", {
            fetchApi: `${mThis.base_url}/mhr/work-shifts/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

                mThis.WorkShiftListsView.showPage(mThis.getFilterData());
            };
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WorkShiftListsView.showPage();
                },
            };
            // if (!AuthManager.allowed(267)) return;
            WorkShiftListDialog.show(op);
        };
        mThis.listContainer = mThis.WorkShiftListsView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WorkShiftListsView) {
                mThis.WorkShiftListsView.showPage(mThis.getFilterData());
            } else {
                console.error("Work is not defined");
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_edit_work_shift");
            if (btn) {
                mThis.editWorkShift(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn_delete_work_shift");
            if (btn) {
                mThis.deleteWorkShift(btn.dataset.id, btn);
            }
        });
    };
    mThis.editWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        // if (!AuthManager.allowed(268)) return;
        WorkShiftListDialog.show(op);
    };
    mThis.deleteWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        // if (!AuthManager.allowed(269)) return;
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
                            `${main_view.base_url}/mhr/work-shifts/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_work_shift");
                                mThis.WorkShiftListsView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };
    mThis.show = function () {
        mThis.init();

        mThis.WorkShiftListsView.showPage(
            mThis.getFilterData(),
            null,
            () => {
               main_view.setContentView(mThis.self, mThis.title_prop);
            }
        );
    };
    return mThis;
})();
const WorkShiftListDialog = (() => {
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
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/work-shifts/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_work_shift");
                                        } else {
                                            cv_interact.success("create_success_work_shift");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Shift",
                    modifyTitle: "vslang:titles.Edit Shift",
                    targetProp: "work_shifts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/work-shifts/form-options",
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

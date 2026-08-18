"use strict";
var WorkShiftListComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_workShiftListComponent");

    mThis.title_prop = "work_shifts";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWorkShift");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_work_shift_list_search");
    mThis.cols = [
   
       {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-pr-custom">${data.name ?? '_'}</span>`;
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
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "work_shift_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
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
                }
        }, 200);
    });
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
    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "work_shift_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Job Level</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_work_shift"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_work_shift"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_work_shift": {
                        mThis.editWorkShift(id, menuLink);
                        break;
                    }
                    case "delete_work_shift": {
                        mThis.deleteWorkShift(id, menuLink);
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

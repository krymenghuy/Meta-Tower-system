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
            title: "NO",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #1a1647; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            title: "Name",
            className: "align-middle fw-bold",
            data: (data) => {
                return `<span class="text-primary-custom">${data.name}</span>`;
            },
        },

        {
            title: "last Updated",
            className: "align-middle fw-bold",
            data: (data) => {
                return [
                    `<span class="text-Capitalize d-block">${data.update_user}</span>`,
                    `<span class="text-muted" style="font-size:80%;">${data.updated_at}</span>`,
                ].join("");
            },
        },
        {
            title: "Action",
            className: "col_action align-items-end",
            data: function (data, row, display) {
                return `
                    <div class="d-flex align-items-center gap-3">
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-work-shift-modify">
                            <i class="fa-regular fa-pen-to-square text-warning fs-6"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-work-shift-delete">
                            <i class="fa-regular fa-trash-can text-danger fs-6"></i>
                        </a>
                    </div>
                `;
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
            tableClass: "table table--white rounded-3 overflow-hidden header-uppercase",
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
            if (!AuthManager.allowed(267)) return;
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
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-work-shift-modify");
            if (btn) {
                mThis.editWorkShift(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-work-shift-delete");
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
        if (!AuthManager.allowed(268)) return;
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
        if (!AuthManager.allowed(269)) return;
        cv_interact.confirm(
            "Delete this work shift?",
            {
                title: "Delete Shift",
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
                                cv_interact.success("Deleted successfully");
                                mThis.WorkShiftListsView.showPage();
                            } else {
                                // Display an error if the deletion fails
                                cv_interact.error("Delete failed. Try again.");
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            // Re-enable the button after completion
                            menuLink.disabled = false;
                        });
                } else {
                    // Re-enable the button if the user cancels the confirmation
                    menuLink.disabled = false;
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
        dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row">
                        <div class="form-group col-md-12">
                            <label for="name" class="form-label" vslang="titles.Name"></label>
                            <span class="text-danger"*</span>
                            <input type="text" class="form-control data-input" name="shifts" data-field="name">
                        </div>
                    </div>`,
                ].join("");
            },
            configSelect: [
                {
                    name: "shifts",
                    data: "shifts",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span class=""><i class="fa-solid text-danger fa-xmark"></i></span>',
                    cssClass: "btn btn-sm-outline rounded-3",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                    cssClass: "btn btn-sm-outline rounded-3",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/work-shifts/save"].join(
                                    ""
                                ),
                                p,
                                btn,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "Create Schedule",
                modifyTitle: "Edit Schedule",
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

"use strict";

var WorkShiftListComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_workShiftListComponent");
    this.self = this.jm[0];
    this.title_prop = "WorkShiftList";
    this.btnAdd = this.self.querySelector("#_btnAddWorkShift");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.cols = [
        {
            title: "",
            className: "align-middle",
           
        },
        {
            title: "Work Shift",
            className: "align-middle fw-bold",
            data: (data) => {
                return `<span class="text-primary-custom">${data.name}</span>`;
            },
        },
        
        {
            title: "Update By",
            className: "align-middle fw-bold",
            data: (data) => {
                return `<span class="text-Capitalize">${data.update_user}</span>`;
            },
        },
        {
            title: "Last Updated",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-muted" style="font-size:80%;">${data.update_date}</span>`;
            },
        },
        {
            title: "Action",
            className: "col_action align-end",
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
    this.init = () => {
        if (mThis.initAlready) return;
        mThis.WorkShiftListsView = new ListView("_work_shift_lists", {
            fetchApi: `${mThis.base_url}/hr/work-shifts/list-paginate`,
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
            WorkShiftListDialog.show(op);
        };
        const listContainer = mThis.WorkShiftListsView.getListContainer();
        const sh_parent = listContainer;
        // sh_parent.style.height = window.innerHeight - 275 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

       
        mThis.initDropdownMenus(listContainer);
        mThis.initAlready = true;
    };
    this.getFilterData = () => {
        let p = {
            // search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-work-shift-modify");
            if (btn) {
                mThis.editWorkShift(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-work-shift-delete");
            if (btn) {
                mThis.deleteWorkShift(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.editWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        WorkShiftListDialog.show(op);
    };
    this.deleteWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Work Shift?",
            {
                title: "Delete this Work Shift?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/work-shifts/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted Successfully");
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
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.WorkShiftListsView.showPage(
            mThis.getFilterData(),
            null,
            () => {
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);
            }
        );
    };
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
                                [main_view.base_url, "/hr/work-shifts/save"].join(
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
                createTitle: "Create Work Shift",
                modifyTitle: "Edit Work Shift",
                targetProp: "work_shifts",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/work-shifts/form-options",
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

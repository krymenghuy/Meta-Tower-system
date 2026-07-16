"use strict";
var HolidayComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_holidayComponent");
    
    mThis.title_prop = "Manage Holiday";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddHoliday");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_holiday");
    mThis.btnSearch = mThis.self.querySelector("#_sdl_btnSearch");
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            // data: (data, index, i) => {

            // },
        },
        {
            title: "Holiday Date",
            className: "align-middle",
            data: (data)=>{
                return ` <div class="d-flex flex-column">
                                <div class="d-flex justify-content-start align-items-center">
                                    <span class="text-nowrap fw-bold" style="font-size: 90%;">${data.start_date}</span>
                                    <span class="text-primary px-1">~</span>
                                    <span class="text-nowrap  fw-bold" style="font-size: 90%;">${data.end_date}</span>
                                </div>
                            </div>`
            },
        },

        {
            title: "Holiday",
            className: "align-middle fw-bold",
            data: (data)=>{
                return `<span class="text-danger">${data.name}</span>`
            },
        },
        {
            title: "Holiday Type",
            className: "align-middle",
            data: "holiday_type",
        },
        {
            title: "Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="text-primary fw-semibold">${data.update_user}</span>
                    <span>
                        <small class="text-nowrap">${data.updated_at}</small>
                    </span>
                </div>`;

            }
        },
        {
            title: "Actions",
            className: "align-middle col_action",
            data: function (data, row, display) {
                return `
                    <div class="d-flex align-items-center gap-3">
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-holiday-modify">
                            <i class="fa-solid fa-pen-to-square text-primary fs-6"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-holiday-delete">
                            <i class="fa fa-trash-can text-danger fs-6"></i>
                        </a>
                    </div>
                `;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.HolidayListView = new ListView("_holiday_list", {
            fetchApi: `${main_view.base_url}/mhr/holiday/list-paginate`,
            perPage: 15,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

                mThis.HolidayListView.showPage(mThis.getFilterData());
            };
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.HolidayListView.showPage();
                },
            };
            if (!AuthManager.allowed(260)) return;
            HolidayDialog.show(op);
        };
        mThis.listContainer = mThis.HolidayListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.HolidayListView) {
                    mThis.HolidayListView.showPage(mThis.getFilterData());
                } else {
                    console.error("Holiday is not defined");
                }
            }, 200);
        });
        mThis.initDropdownMenus(mThis.listContainer);

        mThis.initAlready = true;
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

    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-holiday-modify");
            if (btn) {
                mThis.editHoliday(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-holiday-delete");
            if (btn) {
                mThis.deleteHoliday(btn.dataset.id, btn);
            }
        });
    };
    mThis.editHoliday = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage();
            },
        };
        if (!AuthManager.allowed(262)) return;
        HolidayDialog.show(op);
    };

    mThis.deleteHoliday = (id, menuLink) => {
        menuLink.disabled = true;
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage();
            },
        };
        if (!AuthManager.allowed(263)) return;
        cv_interact.confirm(
            "Delete this holiday?",
            {
                title: "Delete Holiday",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/holiday/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.HolidayListView.showPage();
                            } else {
                                cv_interact.error(
                                    "Deletion failed. Try again."
                                );
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menuLink.disabled = false;
                        });
                } else {
                    menuLink.disabled = false;
                }
            }
        );
    };

    mThis.show = function () {
        mThis.init();
        
        mThis.HolidayListView.showPage(mThis.getFilterData(), null, () => {
           main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();
const HolidayDialog = (() => {
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
                        <div class="form-group col-md-6">
                           <label for="name" class="form-label" vslang="titles.Holiday"></label>
                            <span class="text-danger" >*</span>
                           <input type="text" class="rounded-5 form-control data-input" data-field="name">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="holiday_type" class="form-label" vslang="titles.Holiday Type"></label>
                            <span class="text-danger" >*</span>
                            <select name="holiday_type" class=" form-control data-input"  data-field="holiday_type_id"></select>
                        </div>

                        <div class="form-group col-md-6">
                           <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                           <input name="start_date" class="rounded-5 form-control data-input" data-field="start_date">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                            <input name="end_date" class="rounded-5 form-control data-input" data-field="end_date" />
                        </div>
                        <div class="form-group col-md-12">
                           <label for="description" class="form-label" vslang="titles.Description"></label>
                           <textarea class="form-control data-input" data-field="description"></textarea>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.start_date);
                DateTimePicker.init(me.controls.end_date);

            },
            configSelect: [
                {
                    name: "holiday_type",
                    data: "holiday_types",
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
                                [main_view.base_url, "/mhr/holiday/save"].join(""),
                                p,
                                btn,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Updated holiday successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "Added holiday successfully"
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "Create Holiday",
                modifyTitle: "Modify Holiday",
                targetProp: "holidays",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/holiday/form-options",
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

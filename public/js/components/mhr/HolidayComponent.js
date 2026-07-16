"use strict";
var HolidayComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_holidayComponent",
    );

    mThis.title_prop = "Manage Holiday";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddHoliday");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_holiday");
    mThis.elSearch = mThis.self.querySelector("#_search_holiday");
    mThis.elHolidayType = mThis.self.querySelector("#holiday_type");
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            // data: (data, index, i) => {

            // },
        },
        {
            transTitle: "titles.Holiday Date",
            className: "align-middle",
            data: (data) => {
                return ` <div class="d-flex flex-column">
                                <div class="d-flex justify-content-start align-items-center">
                                    <span class="text-nowrap" style="font-size: 90%;">${data.start_date}</span>
                                    <span class="text-primary px-1">~</span>
                                    <span class="text-nowrap" style="font-size: 90%;">${data.end_date}</span>
                                </div>
                            </div>`;
            },
        },

        {
            transTitle: "titles.Holiday",
            className: "align-middle fw-bold",
            data: (data) => {
                return `<span class="text-danger text-capitalize">${data.name}</span>`;
            },
        },
        {
            transTitle: "titles.Holiday Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.holiday_type ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="text-primary fw-semibold text-capitalize">${data.update_user}</span>
                    <span>
                        <small class="text-nowrap">${data.updated_at}</small>
                    </span>
                </div>`;
            },
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_holiday_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
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
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

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

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_holiday_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Holiday"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_holiday",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Holiday"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_holiday",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_holiday": {
                        mThis.editHoliday(id, menuLink);
                        break;
                    }
                    case "delete_holiday": {
                        mThis.deleteHoliday(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editHoliday = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(262)) return;
        HolidayDialog.show(op);
    };

    mThis.deleteHoliday = (id, menuLink) => {
        // menuLink.disabled = true;
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage(mThis.getFilterData());
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
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.HolidayListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    "Deletion failed. Try again.",
                                );
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again.",
                            );
                        })
                        .finally(() => {
                            menuLink.disabled = false;
                        });
                } else {
                    menuLink.disabled = false;
                }
            },
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/holiday/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elHolidayType,
                    d.holiday_types || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("Holiday Type", "titles"),
                    "",
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();

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
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="holiday" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label vslang="labels.Holiday"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="holiday_type" class="form-control data-input" placeholder="Holiday Type" data-field="holiday_type_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                <label vslang="labels.Start Date"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" placeholder=" " />
                                <label vslang="labels.End Date"></label>
                            </div>
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
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
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
                                [main_view.base_url, "/mhr/holiday/save"].join(
                                    "",
                                ),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Updated holiday successfully",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "Added holiday successfully",
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

"use strict";

var HolidayComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_holidayComponent");
    this.self = this.jm[0];
    this.title_prop = "Holiday";
    this.btnAdd = this.self.querySelector("#_btnAddHoliday");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_holiday");
    this.btnSearch = mThis.self.querySelector("#_sdl_btnSearch");
    this.cols = [
        {
            title: "No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Holiday",
            className: "align-middle text-capitalize text-nowrap",
            data: "name",
        },
        {
            title: "Holiday Type",
            className: "align-middle",
            data: "holiday_type",
        },
        {
            title: "description",
            className: "align-middle",
            data: "description",
        },
        {
            title: "Start date",
            className: "align-middle",
            data: "start_date",
        },
        {
            title: "End date",
            className: "align-middle",
            data: "end_date",
        },
        {
            title: "",
            className: "col_action align-end",
            data: function (data, row, display) {
                return `
                    <div class="d-flex align-items-center gap-3">
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-holiday-modify">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-holiday-delete">
                            <i class="fa-solid fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>
                `;
            },
        },
    ];
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.HolidayListView = new ListView("_holiday_list", {
            fetchApi: `${main_view.base_url}/hr/holiday/list-paginate`,
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
            HolidayDialog.show(op);
        };
        const listContainer = mThis.HolidayListView.getListContainer();
        const sh_parent = listContainer;
        // sh_parent.style.height = window.innerHeight - 275 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

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
        mThis.initDropdownMenus(listContainer);

        mThis.initAlready = true;
    };
    this.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(345, p);

        return p;
    };
    // this.initDropdownMenus = (table) => {
    //     const menuOptopns = {
    //         containerElement: table,
    //         actionButtonClass: "btn_holiday_action",
    //         cssClass: "bg-white shadow",
    //         //menuItemClass:"",
    //         menus: [
    //             {
    //                 html: '<span class="ps-2  " vslang="titles.Modify Holiday">Modify Holiday</span>',
    //                 icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
    //                 cssClass: "border-bottom pb-2",
    //                 name: "edit_holiday",
    //             },
    //             {
    //                 html: '<span class="ps-2  " vslang="titles.Delete Holiday">Delete Holiday</span>',
    //                 icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
    //                 cssClass: "border-bottom pb-2",
    //                 name: "delete_holiday",
    //             },
    //         ],

    //         onClick: (menuLink, id, name) => {
    //             switch (name) {
    //                 case "edit_holiday": {
    //                     mThis.editHoliday(id, menuLink);
    //                     break;
    //                 }
    //                 case "delete_holiday": {
    //                     mThis.deleteHoliday(id, menuLink);
    //                     break;
    //                 }

    //                 default: {
    //                     break;
    //                 }
    //             }
    //         },
    //     };
    //     new VSDropdownMenu(menuOptopns);
    // };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-holiday-modify");
            if (btn) {
                mThis.editHoliday(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-holiday-delete");
            if (btn) {
                mThis.deleteHoliday(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.editHoliday = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage();
            },
        };
        HolidayDialog.show(op);
    };

    this.deleteHoliday = (id, menuLink) => {
        // Prevent multiple clicks on the delete button
        menuLink.disabled = true;

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage();
            },
        };

        cv_interact.confirm(
            "Delete this Holiday?",
            {
                title: "Delete Holiday",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/holiday/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.HolidayListView.showPage();
                            } else {
                                // Display an error if the deletion fails
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

    // Show component
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.HolidayListView.showPage(mThis.getFilterData(), null, () => {
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(250);
        });
    };
})();
const HolidayDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static", //User click outside form, do not close form
            keyboard: true, //prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row">
                        <div class="form-group col-md-12">
                           <label for="name" class="form-label" vslang="titles.name"></label>
                            <span class="text-danger" >*</span>
                           <input type="string" class="form-control data-input" data-field="name">
                        </div>
                        <div class="form-group col-md-12">
                            <label for="holiday_type" class="form-label" vslang="titles.Holiday Type"></label>
                            <span class="text-danger" >*</span>
                            <select name="holiday_type" class=" form-control data-input"  data-field="holiday_type_id"></select>
                        </div>
                        <div class="form-group col-md-12">
                           <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                           <span class="text-danger" >*</span>
                           <input name="start_date" class="form-control data-input" data-field="start_date">
                        </div>
                        <div class="form-group col-12">
                            <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                            <span class="text-danger" >*</span>
                            <input name="end_date" class="form-control data-input" data-field="end_date" />
                        </div>
                        <div class="form-group col-md-12">
                           <label for="description" class="form-label" vslang="titles.Description"></label>
                           <input type="text" class="form-control data-input" data-field="description">               
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

                        p.id = me.dataOptions.id; //get "id" from op

                        vsapi
                            .call(
                                [main_view.base_url, "/hr/holiday/save"].join(
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
                createTitle: "Add Holiday",
                modifyTitle: "Edit Holiday",
                targetProp: "holidays",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/holiday/form-options",
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

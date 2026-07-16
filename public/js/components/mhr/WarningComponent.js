"use strict";
var WarningComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_warningComponent",
    );

    mThis.title_prop = "Employee Warning";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWarning");
    mThis.elSearch = mThis.self.querySelector("#_warning_search");
    mThis.containerFilter = mThis.self.querySelector("#_divFilter_warning");
    mThis.elWarningType = mThis.self.querySelector("#warning_type");

    mThis.divListView = mThis.self.querySelector("#_warning_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            transTitle: "titles.Employee Code",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-prm text-capitalize">${data.emp_code}</span>`;
            },
        },
        {
            transTitle: "titles.Full Name",
            className: "name text-capitalize align-middle",
            data: (data, index, tr) => {
                const sex =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "Other";
                return `<p class="d-flex flex-column">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            transTitle: "titles.Warning Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.warning_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Date",
            className: "align-middle text-center text-nowrap",
            data: (data, index, tr) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.warning_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Issue",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.issues ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_warning_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.WarningListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/mhr/emp-warning/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WarningListView.showPage(mThis.getFilterData());
                },
            };
            WarningDialog.show(op);
        };

        mThis.pr_tbl = mThis.WarningListView.getListContainer();
        mThis.initDropdownMenus(mThis.pr_tbl);
        const elDate = mThis.containerFilter.querySelector(
            "[data-select='datepicker']",
        );
        if (elDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elDate);
        }
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.WarningListView.showPage(mThis.getFilterData());
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp-warning/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elWarningType,
                    d.warning_types || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("Warning Type", "titles"),
                    "",
                );
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Warning"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_warning",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Warning"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_warning",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_warning": {
                        mThis.editWarning(id, menuLink);
                        break;
                    }
                    case "delete_warning": {
                        mThis.deleteWarning(id, menuLink);
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

    mThis.editWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(241)) return;
        WarningDialog.show(op);
    };

    mThis.deleteWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm("Deleting this Warning?",
        {
            title: "Delete Warning.",
            context: "delete",
            confirmButtonText: "Delete",
        },function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/mhr/emp-warning/delete`,op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.WarningListView.showPage();
                            } else {
                                cv_interact.error(res.error_message || 'An error occurred while deleting.');
                            }
                        })
                    }
        });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.WarningListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const WarningDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6"> 
                            <select data-style="material" name="employee_id" class="form-control data-input" placeholder="Employee" data-field="emp_id"></select>
                        </div>
                       
                        <div class="col-6">
                            <select data-style="material" name="position" class="form-control data-input" placeholder="Position" data-field="position_id"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="warning_type" class="form-control data-input" placeholder="Warning Type" data-field="warning_type_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="warning_date" class="data-input form-control form_input" data-field="warning_date" placeholder=" " />
                                <label vslang="labels.Warning Date"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="issues" class="data-input form-control form_input" data-field="issues" placeholder=" " />
                                <label vslang="labels.Reason"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="form-control data-input form_input" placeholder=" " data-field="remarks"></textarea>
                                <label vslang="labels.Remarks"></label>
                            </div>
                        </div>  
                    </div>`,
                ].join("");
            },
            contentCreate: (me) => {

            },
            configSelect: [
                {
                    name: "employee_id",
                    data: "employees",
                    textField: (me, d) => {
                        return `${d.name ?? '-'} <small class="text-muted">(${d.code ?? '-'})</small>`;
                    },
                    valueField: "id",
                    emptyText: LocaleManager.trans("Employee", "titles"),
                },
                {
                    name: "position",
                    data: "positions",
                    textField: "name",
                    valueField: "id",
                    emptyText: LocaleManager.trans("Position", "titles"),
                },
                {
                    name: "warning_type",
                    data: "warning_types",
                    textField: "name",
                    valueField: "id",
                    emptyText: LocaleManager.trans("Warning Type", "titles"),
                }
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => me.hide(false),
                },
                {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-warning/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated warning successfully");
                                        }
                                        else
                                        {
                                            cv_interact.success("Warning successfully saved");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
            ],
            prepareFormOptions: {
                createTitle: "Add Warning",
                modifyTitle: "Modify Warning",
                targetProp: "warning",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/emp-warning/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },

            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);

                if (me.controls.employee_id && me.controls.position) {
                    me.controls.position.setAttribute('disabled', 'true');

                    const updatePosition = () => {
                        const empId = me.controls.employee_id.value;
                        const emp = (data.employees || []).find(e => e.id == empId);
                        if (emp) {
                            me.controls.position.value = emp.position_id || "";
                        } else {
                            me.controls.position.value = "";
                        }
                        me.controls.position.dispatchEvent(new Event("change"));
                        if (window.jQuery) {
                            jQuery(me.controls.position).change();
                        }
                    };

                    me.controls.employee_id.addEventListener("change", updatePosition);

                    if (me.controls.employee_id.value) {
                        updatePosition();
                    }
                }
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var ExitFormComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_exit_form_component");

    mThis.title_prop = "Exit Forms";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddExitForm");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_exit_form_search");
    mThis.cols = [
        {
            transTitle: "titles.Staff Name",
            className: "align-middle text-start",
            data: (data) => {
                return `
                <div class="d-flex align-items-center gap-2">
                    <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%;"/>
                    <div>
                        <span class="d-block fw-semibold">${data.emp_name ?? "-"}</span>
                        <span class="d-block text-muted" style="font-size: 12px;">${data.email ?? "-"}</span>
                    </div>
                </div>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<span class="text-pr-custom">${data.position ?? "-"}</span>`,
        },
        {
            transTitle: "titles.Form",
            className: "align-middle",
            data: (data) =>
                `<span class="text-pr-custom">${data.name ?? "-"}</span>`,
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap",
            data: (data) => {
                if (data.is_finished == 1) {
                    return `<span class="badge rounded-pill bg-success">Done</span>`;
                }
                return `<span class="badge rounded-pill bg-warning text-dark">Pending</span>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_exit_form" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_exit_form" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn_view_exit_form" data-id="${data.id}" data-empid="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${mThis.base_url}/mhr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            if (!AuthManager.allowed(282)) return;
            ExitFormDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage(mThis.getFilterData());
                },
            });
        };

        mThis.listContainer = mThis.ExitFormListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };

    mThis.elSearch.addEventListener("keyup", () => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitFormListView) {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            }
        }, 200);
    });

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_edit_exit_form");
            if (btn) {
                mThis.editExitForm(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn_delete_exit_form");
            if (btn) {
                mThis.deleteExitForm(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn_view_exit_form");
            if (btn) {
                mThis.viewExitForm(btn.dataset.id, btn);
            }
        });
    };

    mThis.editExitForm = (id, menulink) => {
        if (!AuthManager.allowed(283)) return;
        ExitFormDialog.show({
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.deleteExitForm = (id, menulink) => {
        if (!AuthManager.allowed(284)) return;
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };

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
                            `${main_view.base_url}/mhr/exit-form/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_exit_form");
                                mThis.ExitFormListView.showPage(mThis.getFilterData());
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

    mThis.viewExitForm = (form_id, menulink) => {
        if (!AuthManager.allowed(285)) return;
        ViewExitFormDialog.show({
            form_id: form_id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.show = function () {
        mThis.init();
        mThis.ExitFormListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };

    return mThis;
})();

const ExitFormDialog = (() => {
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
                                <select data-style="material" name="employee" class="form-control data-input" data-field="emp_id" placeholder="${LocaleManager.trans("Employee", "labels")}"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="form_name" required class="form-control data-input" data-field="name" placeholder=" " />
                                    <label vslang="titles.Form"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="is_finished" class="form-control data-input" data-field="is_finished" placeholder="${LocaleManager.trans("Status", "titles")}">
                                    <option value="0">Pending</option>
                                    <option value="1">Done</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url || ""}" alt="" /> <div class="d-flex flex-column"><span>${d.name ?? "-"}</span><span>${d.position ?? ""}</span></div></div>`,
                        valueField: "id",
                        emptyText: LocaleManager.trans("Employee", "labels"),
                    },
                ],
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
                                    [main_view.base_url, "/mhr/exit-form/save"].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_exit_form");
                                        } else {
                                            cv_interact.success("create_success_exit_form");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Exit Form",
                    modifyTitle: "vslang:titles.Modify Exit Form",
                    targetProp: "exit_forms",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/exit-form/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    const form = data?.exit_forms || null;
                    if (form?.emp_id && me.controls.emp_id) {
                        me.controls.emp_id.value = form.emp_id;
                    }
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

const ViewExitFormDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        let htmlString = [
            '<div class="d-block position-relative min-height-top form_header">',
            '<h4 class="text-center text-uppercase form_title">',
            "</h4>",
            '<div class="employee-info-section">',
            '<table class="table table-bordered ">',
            "<tbody>",
            '<tr colspan="6">',
            '<td colspan="1">ឈ្មោះបុគ្គលិក៖</td>',
            '<td colspan="1" class="employee_name">',
            "</td>",
            '<td colspan="1">អត្ថលេខ៖</td>',
            '<td colspan="1" class="employee_code">',
            "</td>",
            '<td colspan="1">កាលបរិច្ឆេទចូលធ្វើការ៖</td>',
            '<td colspan="1" class="employee_joining_date">',
            "</td>",
            "</tr>",
            '<tr colspan="6">',
            '<td colspan="1">កាលបរិច្ឆេទបិទការងារ៖</td>',
            '<td colspan="1" class="employee_effective_date">',
            "</td>",
            '<td colspan="1">នាយកដ្ឋាន ឬសាខា៖</td>',
            '<td colspan="3" class="employee_branch">',
            "</td>",
            "</tr>",
            "<tr>",
            '<td colspan="6" style="text-align:left;">',
            '<div class="d-flex text-center gap-4">',
            "<span>គោលបំណង៖</span>",
            '<div class="d-flex disabled">',
            '<div class="form-check me-3">',
            '<input type="checkbox" value="action" checked >',
            '<label class="form-check-label" for="resignation">ការលាលែងពីតំណែង</label>',
            "</div>",
            '<div class="form-check me-3">',
            '<input type="checkbox" value="action">',
            '<label class="form-check-label" for="terminate">ការបញ្ចប់</label>',
            "</div>",
            '<div class="form-check">',
            '<input type="checkbox" value="action">',
            '<label class="form-check-label" for="other">ផ្សេងៗ  (សូមបញ្ជាក់)៖</label>',
            "</div>",
            "</div>",
            "</div>",
            "</td>",
            "</tr>",
            "</tbody>",
            "</table>",
            "</div>",
            "</div>",
            '<div class="pb-3 bg-white">',
            '<table class="table table-bordered tbl_exit_check_item">',
            "<thead>",
            "</thead>",
            "<tbody>",
            "</tbody>",
            "</table>",
            '<table class="table table-bordered mt-3">',
            '<thead class="bg bg-secondary">',
            "<tr>",
            '<th class="align-middle text-center ">បុគ្គលិក</th>',
            '<th class="align-middle text-center ">បញ្ជាក់ដោយ</th>',
            '<th class="align-middle text-center ">បញ្ជាក់ដោយ</th>',
            '<th class="align-middle text-center ">បញ្ជាក់ដោយ</th>',
            '<th class="align-middle text-center ">អនុម័តដោយ</th>',
            "</tr>",
            "</thead>",
            "<tbody>",
            "<tr>",
            '<td class="p-5"></td>',
            '<td class="p-5"></td>',
            '<td class="p-5"></td>',
            '<td class="p-5"></td>',
            '<td class="p-5"></td>',
            "</tr>",
            "<tr>",
            '<td class="align-middle text-center">ហត្ថលេខា</td>',
            '<td class="align-middle text-center">ហត្ថលេខា</td>',
            '<td class="align-middle text-center">ហត្ថលេខា</td>',
            '<td class="align-middle text-center">ហត្ថលេខា</td>',
            '<td class="align-middle text-center">ហត្ថលេខា</td>',
            "</tr>",
            "<tr>",
            '<td class="align-left text-start"><br>',
            "ឈ្មោះ ........................................<br><br>",
            "តំណែង .....................................",
            "</td>",
            '<td class="align-left text-start"><br>',
            "ឈ្មោះ ........................................<br><br>",
            "តំណែង .....................................",
            "</td>",
            '<td class="align-left text-start"><br>',
            "ឈ្មោះ ........................................<br><br>",
            "តំណែង .....................................",
            "</td>",
            '<td class="align-left text-start"><br>',
            "ឈ្មោះ ........................................<br><br>",
            "តំណែង .....................................",
            "</td>",
            '<td class="align-left text-start"><br>',
            "ឈ្មោះ ........................................<br><br>",
            "តំណែង .....................................",
            "</td>",
            "</tr>",
            "<tr>",
            '<td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>',
            '<td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>',
            '<td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>',
            '<td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>',
            '<td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>',
            "</tr>",
            "</tbody>",
            "</table>",
            "</div>",
            '<div class="d-flex flex-column">',
            "<span><strong>ចំណាំ៖</strong></span>",
            "<span>ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ ត្រូវអនុវត្តន៍ជាចាំបាច់ និងប្រើប្រាស់ជាឯកសារយោងសម្រាប់ការទូទាត់ប្រាក់បំណាច់ចុងក្រោយជូនដល់បុគ្គលិកដែលត្រូវបញ្ចប់ការងារ ឬចាក់ចេញពីក្រុមហ៊ុន។ ប្រធាននាយកដ្ឋាន ឬប្រធានសាខានីមួយៗត្រូវអនុវត្តន៍ និងពិនិត្យឱ្យបានហ្មត់ចត់មុនផ្ញើឯកសារនេះទៅកាន់នាយកក្រុមហ៊ុន ដើម្បីសុំសេចក្តីសម្រេចចិត្តចុងក្រោយ។</span>",
            "</div>",
        ].join("");

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg custom-modal-size",
                backdrop: "static",
                keyboard: true,
                alwaysTriggerOnClose: true,
                createContent: () => {
                    return htmlString;
                },
                contentCreated: (me) => {
                    me.generateTableHeaders = (headers) => {
                        let html = "";
                        (headers || []).map((h) => {
                            html = [
                                html,
                                `<th>${h.name ?? ""}</th>`,
                            ].join("");
                        });
                        return ["<tr>", html, "</tr>"].join("");
                    };

                    me.generateTableBody = (list) => {
                        let row_group = "";

                        (list || []).map((c) => {
                            c.items.map((item, index) => {
                                let row_html = "";
                                let checkbox_html = `<input type="checkbox" ${
                                    item.status_id == 1 ? "checked" : ""
                                } class="exit_form_check_box" data-id="${
                                    item.id
                                }" style="cursor:pointer; margin-right:10px"></input>`;

                                if (index === 0) {
                                    row_html = [
                                        "<tr>",
                                        '<td rowspan="',
                                        c.items.length,
                                        '" class="text-capitalize align-middle">',
                                        c.name,
                                        "</td>",
                                        "<td>",
                                        checkbox_html,
                                        item.name,
                                        "</td>",
                                        "<td></td>",
                                        "<td></td>",
                                        "<td></td>",
                                        "</tr>",
                                    ].join("");
                                } else {
                                    row_html = [
                                        "<tr>",
                                        "<td>",
                                        checkbox_html,
                                        item.name,
                                        "</td>",
                                        "<td></td>",
                                        "<td></td>",
                                        "<td></td>",
                                        "</tr>",
                                    ].join("");
                                }

                                row_group = [row_group, row_html].join("");
                            });
                        });

                        return row_group;
                    };

                    me.saveCheckBoxes = (event, form_id) => {
                        const op = {
                            id: event.target.dataset.id,
                            form_id: form_id,
                            status_id: event.target.checked ? 1 : 0,
                        };
                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/exit-form/update-checkbox"].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code != 200) {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    };
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Close"></span>',
                        cssClass: "btn btn-default",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span><i class="fa-solid fa-print"></i></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = {
                                ...me.getData(),
                                form_id: me.dataOptions.form_id,
                                id: me.dataOptions.form_id,
                            };
                            if (!AuthManager.allowed(286)) return;
                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/exit-form/details`,
                                    p,
                                    btn
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        windowPrintExitForm(
                                            me.divModal.querySelector(".modal-body").innerHTML
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.View Exit Form",
                    modifyTitle: "vslang:titles.View Exit Form",
                    targetProp: "exit_form",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/exit-form/checkpoints`,
                        params: (op) => {
                            return { id: op.id, form_id: op.form_id };
                        },
                    },
                },
                onPrepareForm: (me, d) => {
                    const tbl = me.divModal.querySelector(".tbl_exit_check_item");
                    const thead = tbl.querySelector("thead");
                    const tbody = tbl.querySelector("tbody");

                    thead.innerHTML = me.generateTableHeaders(d.headers);
                    tbody.innerHTML = me.generateTableBody(d.list);

                    const form_header = me.divModal.querySelector(".form_header");
                    const form_title = form_header.querySelector(".form_title");
                    const emp_info = form_header.querySelector(".employee-info-section");
                    const emp_name = emp_info.querySelector(".employee_name");
                    const emp_code = emp_info.querySelector(".employee_code");
                    const emp_join_date = emp_info.querySelector(".employee_joining_date");
                    const emp_effective_date = emp_info.querySelector(".employee_effective_date");
                    const emp_branch = emp_info.querySelector(".employee_branch");

                    form_title.innerHTML = d.title;
                    emp_name.innerHTML = d.employee.emp_name;
                    emp_code.innerHTML = d.employee.code;
                    emp_join_date.innerHTML = d.employee.joining_date;
                    emp_effective_date.innerHTML = d.employee.efective_date;
                    emp_branch.innerHTML = d.employee.branch_name;

                    tbl.querySelectorAll(".exit_form_check_box").forEach((cb) => {
                        cb.onchange = (event) => {
                            me.saveCheckBoxes(event, me.dataOptions.form_id);
                        };
                    });
                },
            });

        dialog.show(op);
    };

    return self;
})();

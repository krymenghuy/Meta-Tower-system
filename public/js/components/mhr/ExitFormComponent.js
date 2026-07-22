"use strict";
var ExitFormComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_exit_form_component");
 
    mThis.title_prop = "Exit Forms";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddExitForm");
    mThis.elSearch = mThis.self.querySelector("#_exit_form_search");
    mThis.divFilter = mThis.self.querySelector("#container_exit_form");
    mThis.cols = [
        {
            title: "Staff Name",
            className: "align-middle text-start w-25",
            data: (data) => {
                return `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png" }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.emp_name ?? ""
                        }</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`;
            },
        },
        {
            title: "Postion",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${data.position}</span>`,
        },
        {
            title: "Form Name",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${data.name ?? ""}</span>`,
        },
        {
            title: "Settled",
            className: "settled text-nowrap align-middle",
            data: (data) => {
                let settledText = "Panding";
                let settledClass = "";

                if (data.is_finished == 1) {
                    settledText = "Done";
                    settledClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else {
                    settledClass =
                        "text-white text-center bg-warning border border-info rounded-5 p-1";
                }

                return `<p class="p-0 m-0 text-white ${settledClass}" style="border-radius: 5px; padding: 5px;">${settledText}</p>`;
            },
        },
        {
            title: "",
            className: "col_action align-end",
            data: (data) => {
                return `
                <div class="d-flex justify-content-end align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-exit_form-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-delete-exit-form" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn-exit_form-view" data-id="${data.id}" data-empid="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${main_view.base_url}/mhr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage();
                },

            };
            if (!AuthManager.allowed(282)) return;
            ExitFormDialog.show(op);
        };

        const pr_tbl = mThis.ExitFormListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };
        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };

    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            mThis.ExitFormListView.showPage(
                mThis.getFilterData(mThis.getFilterData())
            );
            //WHY DO YOU need to check Defined?
            // if (mThis.ExitFormListView) {
            //     mThis.ExitFormListView.showPage(mThis.getFilterData());
            // } else {
            //     console.error("Exit Form is not defined");
            // }
        }, 200);
    });

    // // *** What is this for ? DELETE function that is NOTY used!
    // mThis.setFilterPeriod = (p) => {
    //     return p;
    // };

    mThis.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };

    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-exit_form-modify");
            if (btn) {
                mThis.edit_exit_form(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn-delete-exit-form");
            if (btn) {
                mThis.delete_exit_form(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form-view");
            if (btn) {
                const form_id = btn.dataset.id;
                mThis.view_exit_form(form_id, btn);
                return;
            }
        });
    };

    mThis.edit_exit_form = (id, menulink) => {
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        if (!AuthManager.allowed(283)) return;
        ExitFormDialog.show(op);
    };

    mThis.delete_exit_form = (id, menulink) => {
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        if (!AuthManager.allowed(284)) return;
        cv_interact.confirm(
            "Delete this exit form?",
            {
                title: "Delete Form",
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
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Form was deleted successfully!"
                                );
                                mThis.ExitFormListView.showPage(
                                    mThis.getFilterData()
                                );
                            }
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            }
        );
    };

    mThis.view_exit_form = (form_id, menulink) => {
        const op = {
            form_id: form_id,
            btn: menulink,
            onClose: (p,canceled) => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(285)) return;
        ViewExitFormDialog.show(op);
    };

    mThis.prepareFormOptions = () => {
        vsapi.call(
            `${main_view.base_url}/mhr/exit-form/form-options`,
            null,
            null,
            null
        );
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.ExitFormListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const ExitFormDialog = (() => {
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
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class="form-control data-input" data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-12">
                                <label for="form_name" class="form-label" vslang="titles.Form"></label>
                                <input name="form_name" class="form-control data-input" data-field="name" />
                            </div>
                            <div class="form-group col-md-12">
                                <label for="is_finished" class="form-label" vslang="titles.Is Finished"></label>
                                <select name="is_finished" class="modal-select data-input" data-field="is_finished" id="is_finished">
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
                        `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
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
                                [main_view.base_url, "/mhr/exit-form/save"].join(
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
                createTitle: "Create Exit Form",
                modifyTitle: "Modify Exit Form",
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
            // generateFormTitle(form_title)
            "</h4>",
            '<div class="employee-info-section">',
            // generateEmployeeInfo(employee),
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
            //generateTableHeaders(thead),
            "</thead>",
            "<tbody>",
            //  generateTableBody(tbody,thead),
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

        dialog = dialog ||
            new GeneralDialog({
                cssClass: "modal-lg custom-modal-size",
                backdrop: "static",
                keyboard: true,
                //showCancelButton: false, //This is default value. So you do not need to set "showCancelButton : false"
                alwaysTriggerOnClose:true, //(default value is "false") Always trigger event onClose() even if user clocks on Cancel button or Close button on top right corner of dialog
                createContent: () => {
                    return htmlString;
                },
                contentCreated: (me) => {
                    me.getCheckPointItems = (htmlString) => {
                        htmlString
                            .querySelectorAll(".check-point-id")
                            .forEach((el) => {
                            });
                    };
                    me.saveCheckBoxes = (event, form_id) => {
                        const op = {};
                        op.id = event.target.dataset.id;
                        op.form_id = form_id;
                        op.status_id = event.target.checked ? 1 : 0;
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/exit-form/update-checkbox",
                                ].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    return;
                                } else cv_interact.error(res.error_message);
                            });
                        return;
                    };
                    me.generateTableHeaders = (headers) => {
                        let html = "";
                        (headers || []).map((h) => {
                            html = [
                                html,
                                `
                                    <th>${h.name ?? ""}</th>
                                `,
                            ].join("");
                        });
                        return ["<tr>", html, "</tr>"].join("");
                    };

                    // @d = list or data.list
                    me.generateTableBody = (list) => {
                        let row_group = "";

                        (list || []).map((c) => {
                            c.items.map((item, index) => {
                                let row_html = "";
                                let checkbox_html = `<input type="checkbox" ', ${
                                    item.status_id == 1 ? "checked" : ""
                                } ,' class="exit_check_box" data-id="${
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

                    me.getCheckPointItems(me.divModal);
                },
                buttons: [

                    {
                        label: '<span class="justify-content-center align-center text-center pl-2"><i class="fa-solid text-white fa-xmark"></i></span>',
                        cssClass: "btn btn-sm btn-warning",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span id="_btnPrintExitForm" class="pl-2"><i class="fa-solid text-white fa-print"></i></span>',
                        cssClass: "btn btn-sm btn-primary-custom",
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
                                            me.divModal.querySelector(
                                                ".modal-body"
                                            ).innerHTML
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "View Exit Form",
                    modifyTitle: "View Exit Form",
                    targetProp: "exit_form",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/exit-form/checkpoints`,
                        params: (op) => {
                            return { id: op.id, form_id: op.form_id };
                        },
                    },
                },
                onPrepareForm: (me, d) => {
                    const tbl = me.divModal.querySelector(
                        ".tbl_exit_check_item"
                    );
                    const thead = tbl.querySelector("thead");
                    const tbody = tbl.querySelector("tbody");

                    thead.innerHTML = me.generateTableHeaders(d.headers);

                    tbody.innerHTML = me.generateTableBody(d.list);

                    const form_header =
                        me.divModal.querySelector(".form_header");
                    const form_title = form_header.querySelector(".form_title");

                    const emp_info = form_header.querySelector(
                        ".employee-info-section"
                    );
                    const emp_name = emp_info.querySelector(".employee_name");
                    const emp_code = emp_info.querySelector(".employee_code");
                    const emp_join_date = emp_info.querySelector(
                        ".employee_joining_date"
                    );
                    const emp_effective_date = emp_info.querySelector(
                        ".employee_effective_date"
                    );
                    const emp_branch =
                        emp_info.querySelector(".employee_branch");

                    form_title.innerHTML = d.title;
                    emp_name.innerHTML = d.employee.emp_name;
                    emp_code.innerHTML = d.employee.code;
                    emp_join_date.innerHTML = d.employee.joining_date;
                    emp_effective_date.innerHTML = d.employee.efective_date;
                    emp_branch.innerHTML = d.employee.branch_name;

                    const checkboxes = tbl.querySelectorAll(".exit_check_box");

                    checkboxes.forEach((cb) => {
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

/** hello Ratanak , Please DO NOT Write function outside like this. This is VERY BAD practice */
// function check_box(event) {
//     if (event.target.checked) {
//         const op = {};
//         op.check_point_id = event.target.dataset.id;
//         op.form_id = form_id;
//         op.status_id = 1;
//         vsapi
//             .call(
//                 [main_view.base_url, "/mhr/exit-form/save-item"].join(""),
//                 op,
//                 false,
//                 null
//             )
//             .then((res) => {
//                 if (res.status_code == 200) {
//                     //cv_interact.success('saved!')
//                     return;
//                 } else cv_interact.error(res.error_message);
//             });
//     } else {
//         const op = {};
//         op.check_point_id = event.target.dataset.id;
//         op.form_id = form_id;
//         op.status_id = 0;
//         console.log("uncheck");
//         vsapi
//             .call(
//                 [main_view.base_url, "/mhr/exit-form/save-item"].join(""),
//                 op,
//                 null,
//                 null
//             )
//             .then((res) => {
//                 if (res.status_code == 200) {
//                     return;
//                 } else cv_interact.error(res.error_message);
//             });
//     }
// }

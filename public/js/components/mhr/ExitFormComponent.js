"use strict";

var ExitFormComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Exit Forms";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_exit_form_component");

    mThis.btnAdd = mThis.self.querySelector("#_btnAddExitForm");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_exit_form");
    mThis.elSearch = mThis.self.querySelector("#_search_exit_form");

    mThis.cols = [
        {
            transTitle: "titles.Employee",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="d-flex align-items-center gap-2">
                        <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%;"/>
                        <div class="d-flex flex-column">
                            <span>${data.emp_name ?? "-"}</span>
                            <span class="d-block text-muted" style="font-size:12px;">${data.email ?? "-"}</span>
                        </div>
                    </div>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="text-prm-custom">${data.position ?? "-"}</span>`;
            },
        },
        {
            transTitle: "titles.Form Name",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="text-prm-custom">${data.name ?? "-"}</span>`;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                if (data.is_finished == 2) {
                    return `<span class="badge bg-success-subtle text-success border border-success" style="min-width: 100px;">Done</span>`;
                }
                return `<span class="badge bg-warning-subtle text-warning border border-warning" style="min-width: 100px;">Pending</span>`;
            },
        },
        {
            className: "col_action align-middle",
            data: function (data) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                            <a href="javascript:void(0)" class="btn_exit_form_action" data-id="${data.id}" data-empid="${data.emp_id}" aria-haspopup="true" aria-expanded="false">
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

        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${main_view.base_url}/mhr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.empid = data.emp_id;
                tr.classList.add("exit-form");
                tr.setAttribute("id", ["exit_form_id", data.id].join(""));
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage(mThis.getFilterData());
                },
            };
            // if (!AuthManager.allowed(282)) return;
            ExitFormDialog.show(op);
        };

        mThis.tblExitForms = mThis.ExitFormListView.getTable();
        mThis.initDropdownMenus(mThis.tblExitForms);

        mThis.pr_tbl = mThis.ExitFormListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

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

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_exit_form_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.View">View</span>',
                    icon: `<i class="fa-regular fa-eye fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_exit_form",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify Exit Form">Modify Exit Form</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_exit_form",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Exit Form">Delete Exit Form</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_exit_form",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_exit_form": {
                        mThis.viewExitForm(id, menuLink);
                        break;
                    }
                    case "edit_exit_form": {
                        mThis.editExitForm(id, menuLink);
                        break;
                    }
                    case "delete_exit_form": {
                        mThis.deleteExitForm(id, menuLink);
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

    mThis.editExitForm = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(283)) return;
        ExitFormDialog.show(op);
    };

    mThis.deleteExitForm = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(284)) return;
        cv_interact.confirm(
            "Delete this exit form?",
            {
                title: "Delete Exit Form",
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
                                cv_interact.success("Deleted successfully");
                                mThis.ExitFormListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(
                                    res.error_message || "An error occurred while deleting"
                                );
                            }
                        });
                }
            }
        );
    };

    mThis.viewExitForm = (id, menuLink) => {
        let op = {
            id: id,
            form_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(285)) return;
        ViewExitFormDialog.show(op);
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
                                    <label vslang="titles.Form Name"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="is_finished" class="form-control data-input" data-field="is_finished" placeholder="${LocaleManager.trans("Status", "labels")}">
                                    <option value="1">Pending</option>
                                    <option value="2">Done</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {},
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url || ""}" /> <div class="d-flex flex-column"><span> ${d.name ?? "-"} </span>  <span>${d.position ?? ""}</span></div></div>`,
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
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
                                            cv_interact.success("Updated exit form successfully");
                                        } else {
                                            cv_interact.success("Create exit form successfully");
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
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ExitFormDialog

const ViewExitFormDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        const signatureCell = [
            '<td class="align-left text-start p-3">',
            '<div class="text-center mb-3">ហត្ថលេខា</div>',
            "<div>ឈ្មោះ ............................</div><br>",
            "<div>តំណែង ............................</div><br>",
            '<div class="text-center mt-2">កាលបរិច្ឆេទ</div>',
            "</td>",
        ].join("");

        const htmlString = [
            '<div class="d-block position-relative min-height-top form_header">',
            '<h4 class="text-center text-uppercase form_title"></h4>',
            '<div class="employee-info-section">',
            '<table class="table table-bordered mb-0">',
            "<tbody>",
            "<tr>",
            "<td>ឈ្មោះបុគ្គលិក៖</td>",
            '<td class="employee_name"></td>',
            "<td>អត្តលេខ៖</td>",
            '<td class="employee_code"></td>',
            "</tr>",
            "<tr>",
            "<td>កាលបរិច្ឆេទបិទការងារ៖</td>",
            '<td class="employee_effective_date"></td>',
            "<td>នាយកដ្ឋាន ឬសាខា៖</td>",
            '<td class="employee_branch"></td>',
            "</tr>",
            "<tr>",
            '<td colspan="4" style="text-align:left;">',
            '<div class="d-flex align-items-center flex-wrap gap-3">',
            "<span>គោលបំណង៖</span>",
            '<div class="d-flex flex-wrap">',
            '<div class="form-check me-3">',
            '<input type="checkbox" value="action" checked disabled>',
            '<label class="form-check-label">ការលាលែងពីតំណែង</label>',
            "</div>",
            '<div class="form-check me-3">',
            '<input type="checkbox" value="action" disabled>',
            '<label class="form-check-label">ការបញ្ចប់</label>',
            "</div>",
            '<div class="form-check">',
            '<input type="checkbox" value="action" disabled>',
            '<label class="form-check-label">ផ្សេងៗ (សូមបញ្ជាក់)៖</label>',
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
            "<thead></thead>",
            "<tbody></tbody>",
            "</table>",
            '<table class="table table-bordered mt-3">',
            "<thead>",
            "<tr>",
            '<th class="align-middle text-center text-primary" style="background:#e8eaf6;">បុគ្គលិក</th>',
            '<th class="align-middle text-center text-primary" style="background:#e8eaf6;">បញ្ជាក់ដោយ</th>',
            '<th class="align-middle text-center text-primary" style="background:#e8eaf6;">អនុម័តដោយ</th>',
            "</tr>",
            "</thead>",
            "<tbody>",
            "<tr>",
            signatureCell,
            signatureCell,
            signatureCell,
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
                cssClass: "modal-lg custom-modal-size vs-modal",
                backdrop: "static",
                keyboard: true,
                alwaysTriggerOnClose: true,
                createContent: () => {
                    return htmlString;
                },
                contentCreated: (me) => {
                    me.generateTableHeaders = (headers) => {
                        let html = "";
                        (headers || []).forEach((h) => {
                            html += `<th class="text-primary">${h.name ?? ""}</th>`;
                        });
                        return ["<tr>", html, "</tr>"].join("");
                    };

                    me.generateTableBody = (list) => {
                        let row_group = "";
                        (list || []).forEach((c) => {
                            const items = c.items || [];
                            if (!items.length) return;

                            items.forEach((item, index) => {
                                const checkbox_html = `<input type="checkbox" ${
                                    item.status_id == 1 ? "checked" : ""
                                } class="exit_form_check_box" data-id="${item.id}" style="cursor:pointer; margin-right:10px">`;

                                if (index === 0) {
                                    row_group += [
                                        "<tr>",
                                        `<td rowspan="${items.length}" class="text-capitalize align-middle">${c.name ?? ""}</td>`,
                                        `<td>${checkbox_html}${item.name ?? ""}</td>`,
                                        "<td></td>",
                                        "</tr>",
                                    ].join("");
                                } else {
                                    row_group += [
                                        "<tr>",
                                        `<td>${checkbox_html}${item.name ?? ""}</td>`,
                                        "<td></td>",
                                        "</tr>",
                                    ].join("");
                                }
                            });
                        });
                        return row_group;
                    };

                    me.saveCheckBoxes = (event, form_id) => {
                        const p = {
                            id: event.target.dataset.id,
                            form_id: form_id,
                            status_id: event.target.checked ? 1 : 0,
                        };
                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/exit-form/update-checkbox"].join(""),
                                p,
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
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span><i class="fa-solid fa-print"></i></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            // same permission as View Exit Form
                            // if (!AuthManager.allowed(285, false)) return;

                            const body =
                                me.divModal.querySelector(".modal-body") ||
                                me.divModal.querySelector(".form_header")?.parentElement;
                            const html = body ? body.innerHTML : "";

                            if (!html) {
                                cv_interact.warning("Nothing to print");
                                return;
                            }

                            windowPrintExitForm(html);
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.View Exit Form",
                    modifyTitle: "vslang:titles.View Exit Form",
                    targetProp: "exit_form",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/exit-form/checkpoints",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id || op.form_id, form_id: op.form_id || op.id };
                        },
                    },
                },
                onPrepareForm: (me, d) => {
                    const tbl = me.divModal.querySelector(".tbl_exit_check_item");
                    const thead = tbl.querySelector("thead");
                    const tbody = tbl.querySelector("tbody");

                    thead.innerHTML = me.generateTableHeaders(d?.headers || []);
                    tbody.innerHTML = me.generateTableBody(d?.list || []);

                    const form_header = me.divModal.querySelector(".form_header");
                    const emp_info = form_header.querySelector(".employee-info-section");
                    const employee = d?.employee || {};

                    form_header.querySelector(".form_title").innerHTML = d?.title || "";
                    emp_info.querySelector(".employee_name").innerHTML = employee.emp_name || "-";
                    emp_info.querySelector(".employee_code").innerHTML = employee.code || "-";
                    emp_info.querySelector(".employee_effective_date").innerHTML = employee.effective_date || "-";
                    emp_info.querySelector(".employee_branch").innerHTML = employee.branch_name || "-";

                    tbl.querySelectorAll(".exit_form_check_box").forEach((cb) => {
                        cb.onchange = (event) => {
                            me.saveCheckBoxes(
                                event,
                                me.dataOptions.form_id || me.dataOptions.id
                            );
                        };
                    });
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ViewExitFormDialog

function windowPrintExitForm(html = null) {
    const HtmlString = html || null;
    if (!HtmlString) {
        cv_interact.warning("Select run report before print!");
        return;
    }

    const myWindow = window.open("", "PRINT");
    if (!myWindow) {
        cv_interact.warning("Please allow pop-ups to print this form");
        return;
    }

    myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Exit Form</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:12px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .form_title{
                        font-size: 18px;
                        margin-bottom: 12px;
                    }
                </style>
            </head>
            <body>${HtmlString.replace(/table-responsive/g, "")}</body>
        </html>`);
    myWindow.document.close();
    setTimeout(() => {
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }, 500);
}

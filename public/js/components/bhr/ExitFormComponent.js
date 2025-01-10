"use strict";

var ExitFormComponent = new (function () {
    const mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exit_form_component");
    this.self = this.jm[0];
    this.title_prop = "Exit Form";
    this.btnAdd = this.self.querySelector("#_btnAddExitForm");
    this.elSearch = this.self.querySelector("#_exit_form_search");
    this.divFilter = this.self.querySelector("#container_exit_form");
    this.viewExitForm = this.self.querySelector("#view_exit_form_");
    this.cols = [
        {
            title: "Name",
            className: "align-middle text-start w-25",
            data: (data) => {
                return `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${
                        data.image_url
                    }" alt=""
                        style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
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
                        <button class="btn rounded-3 p-1 btn-warning btn-exit_form-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn-exit_form-view" data-id="${data.id}" data-emp_id="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${mThis.base_url}/hr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
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
            if (mThis.ExitFormListView) {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit Form is not defined");
            }
        }, 200);
    });

    this.setFilterPeriod = (p) => {
        return p;
    };

    this.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-exit_form-modify");
            if (btn) {
                mThis.edit_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form-delete");
            if (btn) {
                mThis.delete_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form-view");
            if (btn) {
                form_id = btn.dataset.id;
                mThis.view_exit_form(btn.dataset.emp_id, btn);
            }
        });
    };
    this.edit_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };

        ExitFormDialog.show(op);
    };
    this.delete_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Item Status?",
            {
                title: "Delete this Item Status?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/exit-form/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Item Status Delete Successfully"
                                );
                                mThis.ExitFormListView.showPage();
                            }
                        });
                }
                else {
                    cv_interact.error(res.error_message);
                }
            }
        );
    };
    this.view_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        ViewExitFormDialog.show(op);
    };

    this.prepareFormOptions = () => {
        vsapi.call(
            `${main_view.base_url}/hr/exit-form/form-options`,
            null,
            null,
            null
        );
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.ExitFormListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

let form_id = null;

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
                                [main_view.base_url, "/hr/exit-form/save"].join(
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
            contentCreated: (me, divModal) => {
                me.saveBenefitDisburse = (bd) => {
                    //alert("Data saved.");
                };
            },
            prepareFormOptions: {
                createTitle: "Create Exit Form",
                modifyTitle: "Edit Exit Form",
                targetProp: "exit_forms",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/exit-form/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                onResponse: (me, res) => {
                    console.log("API Response:", res);
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

    const generateTableHeaders = (thead) => {
        return thead
            .map((t) => {
                const headerName = t.name.toLowerCase();
                const displayName =
                    headerName === "starting date"
                        ? "Admission Date"
                        : headerName === "tuition fee"
                        ? "School Fee"
                        : t.name ?? "";

                return `
                    <th class="table-header bg bg-secondary">
                        ${displayName}
                    </th>`;
            })
            .join("");
    };

    const generateTableBody = (tbody, thead) => {
        return Object.entries(tbody)
            .map(([key, d]) => {
                const rowData = thead
                    .map((k) => {
                        const cellData = d[k.key] ?? "";

                        if (k.key === "name") {
                            return `<td class="text-capitalize align-middle">${cellData}</td>`;
                        }

                        if (Array.isArray(cellData)) {
                            const divContent = cellData
                                .map((item,index) => {
                                    const itemName =
                                        typeof item === "object" &&
                                        item !== null
                                            ? item.name ?? ""
                                            : item;

                                    console.log(1010, item);

                                    return `
                                    <div class="d-flex ml-1">
                                        <div data_id="items" style="cursor:pointer">${
                                            item.check
                                        }</div>
                                        <div class="d-flex ml-1">
                                        <span
                                            class="ms-2 item-name"
                                            id="item_name_${key}_${index}"
                                            title="${item.item_type}"
                                            style="cursor:pointer"
                                            data-info="${
                                                item.details ||
                                                "No additional details available"
                                            }">
                                            ${itemName}
                                        </span>
                                        <div class="details-container" id="details_${key}_${index}" style="display: none; padding: 5px; background: #f9f9f9; border: 1px solid #ccc; margin-top: 5px;">
                                        </div>
                                    </div>
                                    </div>`;
                                })

                                .join("");

                            return `<td class="text-start">${divContent}</td>`;
                        }
                        return `<td class="text-start">${cellData}</td>`;
                    })
                    .join("");

                return `<tr class="table-row">${rowData}</tr>`;
            })
            .join("");
    };

    const generateEmployeeInfo = (employeeInfo) => {
        const {
            emp_name = "",
            position = "",
            code = "",
            joining_date = "",
            branch_name = "",
            effective_date = "",
            emp = "resignation",
        } = employeeInfo[0];

        return `
                <table class="table table-bordered">
                    <tbody>
                        <tr colspan="6">
                            <td colspan="1">ឈ្មោះបុគ្គលិក៖</td>
                            <td colspan="1"> ${emp_name}</td>
                            <td colspan="1">អត្ថលេខ៖</td>
                            <td colspan="1">${code}</td>
                            <td colspan="1">កាលបរិច្ឆេទចូលធ្វើការ៖</td>
                            <td colspan="1">${joining_date}</td>
                        </tr>
                        <tr colspan="6">
                            <td colspan="1">កាលបរិច្ឆេទបិទការងារ៖</td>
                            <td colspan="1"> ${effective_date}</td>
                            <td colspan="1">នាយកដ្ឋាន ឬសាខា៖</td>
                            <td colspan="3">${branch_name}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align:left;">
                                <div class="d-flex text-center gap-4">
                                    <span>គោលបំណង៖</span>
                                    <div class="d-flex disabled">
                                        <div class="form-check me-3">
                                            <input type="checkbox" value="action" checked >
                                            <label class="form-check-label" for="resignation">ការលាលែងពីតំណែង</label>
                                        </div>
                                        <div class="form-check me-3">
                                            <input type="checkbox" value="action" >
                                            <label class="form-check-label" for="terminate">ការបញ្ចប់</label>
                                        </div>
                                        <div class="form-check">
                                            <input type="checkbox" value="action" >
                                            <label class="form-check-label" for="other">ផ្សេងៗ  (សូមបញ្ជាក់)៖</label>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>`;
    };
    self.show = (op) => {
        vsapi
            .call(`${main_view.base_url}/hr/exit-form/list-all`, {
                emp_id: op.id,
            })
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data ?? {};
                    const {
                        header: thead = [],
                        list: tbody = [],
                        title = "",
                    } = d;
                    const employee = d.employee ?? {};
                    let htmlString = `
                        <div class="d-block position-relative min-height-top">
                            <div class="d-flex flex-column gap-2">
                                <h4 class="text-center text-uppercase">${title}</h4>
                            </div>
                            <div class="employee-info-section">
                                ${generateEmployeeInfo(employee)}
                            </div>
                        </div>
                        <div class="pb-3 bg-white">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>${generateTableHeaders(thead)}</tr>
                                </thead>
                                <tbody>${generateTableBody(
                                    tbody,
                                    thead
                                )}</tbody>
                            </table>
                            <table class="table table-bordered mt-3">
                                <thead class="bg bg-secondary">
                                    <tr>
                                        <th class="align-middle text-center ">បុគ្គលិក</th>
                                        <th class="align-middle text-center ">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center ">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center ">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center ">អនុម័តដោយ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="p-5"></td>
                                        <td class="p-5"></td>
                                        <td class="p-5"></td>
                                        <td class="p-5"></td>
                                        <td class="p-5"></td>
                                    </tr>
                                    <tr>
                                        <td class="align-middle text-center">ហត្ថលេខា</td>
                                        <td class="align-middle text-center">ហត្ថលេខា</td>
                                        <td class="align-middle text-center">ហត្ថលេខា</td>
                                        <td class="align-middle text-center">ហត្ថលេខា</td>
                                        <td class="align-middle text-center">ហត្ថលេខា</td>
                                    </tr>
                                    <tr>
                                        <td class="align-left text-start"><br>
                                            ឈ្មោះ ........................................<br><br>
                                            តំណែង .....................................
                                        </td>
                                        <td class="align-left text-start"><br>
                                            ឈ្មោះ ........................................<br><br>
                                            តំណែង .....................................
                                        </td>
                                        <td class="align-left text-start"><br>
                                            ឈ្មោះ ........................................<br><br>
                                            តំណែង .....................................
                                        </td>
                                        <td class="align-left text-start"><br>
                                            ឈ្មោះ ........................................<br><br>
                                            តំណែង .....................................
                                        </td>
                                        <td class="align-left text-start"><br>
                                            ឈ្មោះ ........................................<br><br>
                                            តំណែង .....................................
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>
                                        <td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>
                                        <td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>
                                        <td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>
                                        <td class="align-middle text-center">កាលបរិច្ឆេទ<br><br> ................/................/................</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div class="d-flex flex-column">
                            <span><strong>ចំណាំ៖</strong></span>
                            <span>ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ ត្រូវអនុវត្តន៍ជាចាំបាច់ និងប្រើប្រាស់ជាឯកសារយោងសម្រាប់ការទូទាត់ប្រាក់បំណាច់ចុងក្រោយជូនដល់បុគ្គលិកដែលត្រូវបញ្ចប់ការងារ ឬចាក់ចេញពីក្រុមហ៊ុន។ ប្រធាននាយកដ្ឋាន ឬប្រធានសាខានីមួយៗត្រូវអនុវត្តន៍ និងពិនិត្យឱ្យបានហ្មត់ចត់មុនផ្ញើឯកសារនេះទៅកាន់នាយកក្រុមហ៊ុន ដើម្បីសុំសេចក្តីសម្រេចចិត្តចុងក្រោយ។</span>
                        </div>
                    `;



                    dialog = new GeneralDialog({
                        cssClass: "modal-lg custom-modal-size",
                        backdrop: "static",
                        keyboard: true,
                        createContent: () => htmlString,
                        contentCreated: (me) => {
                            me.getCheckPointItems = (htmlString) => {
                                htmlString
                                    .querySelectorAll(".check-point-id")
                                    .forEach((el) => {
                                        console.log(el);
                                    });
                            };

                            me.getCheckPointItems(me.divModal);
                        },
                        buttons: [
                            {
                                label: '<span class="bg bg-danger rounded-3" style="outline:none; padding:10px;"><i class="fa-solid ml-2 text-white fa-xmark"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me) => me.hide(true, null),
                            },
                            {
                                label: '<span id="_btnAddExitItem" class="bg bg-success rounded-3" style="outline:none; padding:10px;"><i class="fa-solid ml-2 text-white fa-check"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me) => me.hide(true, null),
                            },
                            {
                                label: '<span id="_btnPrintExitForm" class="bg bg-info rounded-3" style="outline:none; padding:10px;"><i class="fa-solid ml-2 text-white fa-print"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me, btn) => {
                                    const p = {
                                        ...me.getData(),
                                        id: me.dataOptions.id,
                                    };

                                    vsapi
                                        .call(
                                            `${main_view.base_url}/hr/exit-form/details`,
                                            p,
                                            btn
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                windowPrintExitForm(htmlString);
                                            } else {
                                                cv_interact.error(
                                                    res.error_message
                                                );
                                            }
                                        });
                                },
                            },
                        ],
                        prepareFormOptions: {
                            createTitle: "View Exit Form",
                            modifyTitle: "View Exit Form",
                            targetProp: "exit_forms",
                            api: {
                                endpoint: [
                                    main_view.base_url,
                                    "/hr/exit-form/form-options",
                                ].join(""),
                                params: (op) => {
                                    return { id: op.id };
                                },
                            },
                            onResponse: (me, res) => {
                                console.log("API Response:", res);
                            },
                        },
                    });

                    dialog.show(op);
                } else {
                    cv_interact.error(res.error_message);
                }
            });
    };

    return self;
})();
function check_box(event) {
    if (event.target.checked) {
        console.log("checked");
        let op = {};
        op.check_point_id = event.target.dataset.id;
        op.form_id = form_id;
        op.status_id = 1;

        console.log(8888, op);
        vsapi
            .call(
                [main_view.base_url, "/hr/exit-form/save-item"].join(""),
                op,
                null,
                null
            )
            .then((res) => {
                if (res.status_code == 200) {
                    //cv_interact.success('saved!')
                    return;
                } else cv_interact.error(res.error_message);
            });
    } else {
        let op = {};
        op.check_point_id = event.target.dataset.id;
        op.form_id = form_id;
        op.status_id = 0;
        console.log("uncheck");
        vsapi
            .call(
                [main_view.base_url, "/hr/exit-form/save-item"].join(""),
                op,
                null,
                null
            )
            .then((res) => {
                if (res.status_code == 200) {
                    return;
                } else cv_interact.error(res.error_message);
            });
    }
}

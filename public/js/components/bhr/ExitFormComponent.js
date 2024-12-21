"use strict";

var ExitFormComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exit_form_component");
    this.self = this.jm[0];
    this.title_prop = "Exit Form";
    this.btnAdd = this.self.querySelector("#_btnAddExitForm");
    // this.btnPrint = this.self.querySelector("#_btnPrintExitForm");
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
                `<span class="text-primary-custom">${
                    data.form_name ?? "Null"
                }</span>`,
        },
        {
            title: "Amount",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">
                    ${main_view.currency.symbol +' '+ (data.amount ?? '0.00')
                }</span>`,
        },
        {
            title: "Remarks",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.remarks ?? "N/A"
                }</span>`,
        },
        {
            title: "Settled",
            className: "settled text-nowrap align-middle",
            data: (data) => {
                let settledText = "text-white text-center border rounded-5";
                let settledClass = "";

                if (data.settled == "1") {
                    settledText = "Done";
                    settledClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else if (data.settled == "2") {
                    settledText = "Not Yet";
                    settledClass =
                        "text-white text-center bg-warning border border-info rounded-5 p-1";
                }

                return `
            <p class="p-0 m-0 text-white ${settledClass}" style="border-radius: 5px; padding: 5px;">
                ${settledText}
            </p>
        `;
            },
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
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
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

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

const ExitFormDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
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
                                <select name="form_name" class="form-control data-input" data-field="form_id"></select>
                            </div>
                            <div class="form-group col-12">
                                <label for="item_name" class="form-label" vslang="titles.Item"></label>
                                <select name="item_name" class="form-control data-input" data-field="item_id"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="amount" class="form-label" vslang="titles.amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" id="amount">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                                <input name="remarks" class="form-control data-input" data-field="remarks" id="amount">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="settled" class="form-label" vslang="titles.settled"></label>
                                <select name="settled" class="modal-select data-input" data-field="settled" id="amount">
                                    <option value="1">Done</option>
                                    <option value="2">Not Yet</option>
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
                    {
                        name: "item_name",
                        data: "exit_items",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "form_name",
                        data: "forms",
                        textField: "name",
                        valueField: "id",
                    }
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
                                    [
                                        main_view.base_url,
                                        "/hr/exit-form/save",
                                    ].join(""),
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
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Exit Form",
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
                                .map((item) => {
                                    const itemName =
                                        typeof item === "object" &&
                                        item !== null
                                            ? item.name ?? ""
                                            : item;

                                    return `
                                    <div class="d-flex ml-1">
                                        <div>${item.check}</div>
                                        <span class="ms-2">${itemName}</span>
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
            purpose = "resignation",
        } = employeeInfo[0];

        return `
                <table class="employee-info-section table">
                    <tr>
                        <td style="width:40%; text-align:left;">ឈ្មោះបុគ្គលិក៖ ${emp_name}</td>
                        <td style="width:30%; text-align:left;">អត្តលេខ៖ ${code}</td>
                        <td style="width:30%; text-align:left;">កាលបរិច្ឆេទចូលធ្វើការ៖ ${joining_date}</td>
                    </tr>
                    <tr>
                        <td style="width:40%; text-align:left;">ផ្នែក៖ ${position}</td>
                        <td style="width:30%; text-align:left;">នាយកដ្ឋាន ឬសាខា៖ ${branch_name}</td>
                        <td style="width:30%; text-align:left;">កាលបរិច្ឆេទបិទការងារ៖ ${effective_date}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align:left;">
                            <div class="d-flex text-center gap-4 ml-2">
                                <span>គោលបំណង៖</span>
                                <div class="d-flex disabled">
                                    <div class="form-check me-3">
                                        <i class="fa fa-check-circle"></i>
                                        <label class="form-check-label" for="resignation">ការលាលែងពីតំណែង</label>
                                    </div>
                                    <div class="form-check me-3">
                                        <i class="fa fa-circle"></i>
                                        <label class="form-check-label" for="terminate">ការបញ្ចប់</label>
                                    </div>
                                    <div class="form-check">
                                        <i class="fa fa-circle"></i>
                                        <label class="form-check-label" for="other">ផ្សេងៗ  (សូមបញ្ជាក់)៖</label>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
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
                            <div class="employee-info-section mt-4">
                                ${generateEmployeeInfo(employee)}
                            </div>
                        </div>
                        <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>${generateTableHeaders(thead)}</tr>
                                </thead>
                                <tbody>${generateTableBody(
                                    tbody,
                                    thead
                                )}</tbody>
                            </table>
                            <table class="table table-bordered mt-5">
                                     <thead class="bg bg-secondary">
                                         <th>បុគ្គលិក</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>អនុម័តដោយ</th>
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
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                        </tr>
                                     
                                 </tbody>
                             </table>
                        </div>
                    `;

                    dialog = new GeneralDialog({
                        cssClass: "modal-lg custom-modal-size",
                        backdrop: "static",
                        keyboard: true,
                        createContent: () => htmlString,
                        buttons: [
                            {
                                label: '<span><i class="fa-solid text-danger fa-xmark"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me) => me.hide(true, null),
                            },
                            {
                                label: '<span id="_btnPrintExitForm"><i class="fa-solid text-success fa-print"></i></span>',
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

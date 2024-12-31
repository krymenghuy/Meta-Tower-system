"use strict";

var ExitFormItemComponent = new (function () {
    const mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exit_form_item_component");
    this.self = this.jm[0];
    this.title_prop = "Exit Form Item";
    this.btnAdd = this.self.querySelector("#_btnAddExitFormItem");
    this.elSearch = this.self.querySelector("#_exit_form_item_search");
    this.divFilter = this.self.querySelector("#container_exit_form_item");
    this.viewExitForm = this.self.querySelector("#view_exit_form_item");
    const formattedNumber = (number) => {
        number = Number(number) || 0;
        return number
            .toLocaleString("en-US", {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            .replace(/,/g, " ");
    };
    this.cols = [
        {
            title: "Name",
            className: "align-middl",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.form_name ?? ""
                }</span>`,
        },
        {
            title: "Item Name",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.item_name ?? ""
                }</span>`,
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                let currencySymbol = "";
                if (data.currency === "USD") {
                    currencySymbol = "$";
                } else if (data.currency === "KHR") {
                    currencySymbol = "៛";
                }
                return `<p class="p-0 m-0">${currencySymbol} ${formattedNumber(
                    data.amount ?? 0
                )}</p>`;
            },
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.remarks ?? "N/A"
                }</span>`,
        },
        {
            title: "Settled",
            className: "IsSettled text-nowrap align-middle",
            data: (data) => {
                let IsSettledText = "Pending";
                let IsSettledClass =
                    "text-white text-center bg-warning border border-info rounded-5 p-1";

                if (data.is_settled == 1) {
                    IsSettledText = "Done";
                    IsSettledClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else {
                    IsSettledClass =
                        "text-white text-center bg-warning border border-info rounded-5 p-1";
                }

                return `<p class="p-0 m-0 text-white ${IsSettledClass}" style="border-radius: 5px; padding: 5px;">${IsSettledText}</p>`;
            },
        },
        {
            title: "Item Type",
            className: "ItemType text-nowrap align-middle",
            data: (data) => {
                let ItemTypeText = "no type";
                let ItemTypeClass =
                    "text-white text-center bg-warning border border-info rounded-5 p-1";

                if (data.item_type == 1) {
                    ItemTypeText = "Item";
                    ItemTypeClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else if (data.item_type == 2) {
                    ItemTypeText = "Loan";
                    ItemTypeClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else if (data.item_type == 3) {
                    ItemTypeText = "Document";
                    ItemTypeClass =
                        "text-white text-center bg-primary-custom border border-success rounded-5 p-1";
                } else if (data.item_type == 4) {
                    ItemTypeText = "General";
                    ItemTypeClass =
                        "text-primary text-center bg-secondary border border-success rounded-5 p-1";
                } else {
                    ItemTypeClass =
                        "text-white text-center bg-warning border border-info rounded-5 p-1";
                }

                return `<p class="p-0 m-0 text-white ${ItemTypeClass}" style="border-radius: 5px; padding: 5px;">${ItemTypeText}</p>`;
            },
        },
        {
            title: "",
            className: "col_action align-end",
            data: (data) => {
                return `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end align-end gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-exit_form_item-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-exit_form_item-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn-exit_form_item-view" data-id="${data.id}" data-emp_id="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitFormItemListView = new ListView("_exit_form_item_list", {
            fetchApi: `${mThis.base_url}/hr/exit-form-item/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormItemListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ExitFormItemListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormItemListView.showPage();
                },
            };
            FormItemDialog.show(op);
        };

        const pr_tbl = mThis.ExitFormItemListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 240 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 210 + "px";
        };

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormItemListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitFormItemListView) {
                mThis.ExitFormItemListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit Form Item is not defined");
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
            let btn = VSUtil.closestLimited(
                e.target,
                ".btn-exit_form_item-modify"
            );
            if (btn) {
                mThis.edit_exit_form_item(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form_item-delete");
            if (btn) {
                mThis.delete_exit_form_item(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form_item-view");
            if (btn) {
                mThis.view_exit_form_item(btn.dataset.emp_id, btn);
            }
        });
    };
    this.edit_exit_form_item = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormItemListView.showPage();
            },
        };

        FormItemDialog.show(op);
    };
    this.delete_exit_form_item = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormItemListView.showPage();
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
                            `${main_view.base_url}/hr/exit-form-item/delete`,
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
                                mThis.ExitFormItemListView.showPage();
                            }
                            else {
                                cv_interact.error(res.message);
                            }
                        });
                }
            }
        );
    };
    this.view_exit_form_item = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormItemListView.showPage();
            },
        };
        ViewFormItemDialog.show(op);
    };

    this.prepareFormOptions = () => {
        vsapi.call(
            `${main_view.base_url}/hr/exit-form-item/form-options`,
            null,
            null,
            null
        );
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.ExitFormItemListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const FormItemDialog = (() => {
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
                                <label for="form_name" class="form-label" vslang="titles.Form"></label>
                                <select name="form_name" class="form-control data-input" data-field="form_id"></select>
                            </div>
                            <div class="form-group col-12">
                                <label for="item_name" class="form-label" vslang="titles.check point"></label>
                                <select name="item_name" class="form-control data-input" data-field="check_point_id"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="is_settled" class="form-label" vslang="titles.settled"></label>
                                <select name="is_settled" class="modal-select data-input" data-field="is_settled" id="is_settled">
                                    <option value="0">Pending</option>
                                    <option value="1">Done</option>
                                </select>
                            </div>
                            <div class="form-group col-12">
                                <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                                <input name="remarks" class="form-control data-input" data-field="remarks" />
                            </div>
                            <div class="form-group col-12">
                                <label for="amount" class="form-label" vslang="titles.amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" />
                            </div>
                            <div class="form-group col-6">
                                <label for="currency" class="form-label" vslang="titles.Currency"></label>
                                <select class="modal-select data-input" name="currency" data-field="currency">
                                    <option value="KHR">KHR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="item_type" class="form-label" vslang="titles.item type"></label>
                                <select name="item_type" class="modal-select data-input" data-field="item_type" id="item_type">
                                    <option value="1">item</option>
                                    <option value="2">loan</option>
                                    <option value="3">document </option>
                                    <option value="4">general</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const currencyField = me.controls.currency;
                    if (currencyField && !currencyField.value) {
                        currencyField.value = "KHR";
                    }
                },
                configSelect: [
                    {
                        name: "form_name",
                        data: "exit_forms",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "item_name",
                        data: "check_points",
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
                                    [
                                        main_view.base_url,
                                        "/hr/exit-form-item/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated Exit Form Item Successfully");
                                        }
                                        else{
                                            cv_interact.success("Added Exit Form Item Successfully");
                                        }
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
                    createTitle: "Add Exit Form Item",
                    modifyTitle: "Edit Exit FormItem",
                    targetProp: "exit_form_items",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/exit-form-item/form-options",
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


const ViewFormItemDialog = (() => {
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
                    </th>

                    `;
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

    self.show = (op) => {
        vsapi
            .call(`${main_view.base_url}/hr/exit-form-item/list-all`, {
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
                                <table class="table table-bordered">
                                    <tbody>
                                        <tr colspan="6">
                                            <td colspan="1">ឈ្មោះបុគ្គលិក៖</td>
                                            <td colspan="3">អត្ថលេខ៖</td>
                                            <td colspan="2">កាលបរិច្ឆេទចូលធ្វើការ៖</td>
                                        </tr>
                                        <tr colspan="6">
                                            <td colspan="1">កាលបរិច្ឆេទបិទការងារ៖</td>
                                            <td colspan="2"></td>
                                            <td colspan="3">នាយកដ្ឋាន ឬសាខា៖</td>
                                        </tr>
                                        <tr colspan="6">
                                            <td colspan="1">គោលបំណង៖</td>
                                            <td colspan="5">
                                                <div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="checkbox" id="purpose1">
                                                        <label class="form-check-label" for="purpose1">ការចាកចេញគ្រប់គ្រង</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="checkbox" id="purpose2">
                                                        <label class="form-check-label" for="purpose2">ការចុះ</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="checkbox" id="purpose3">
                                                        <label class="form-check-label" for="purpose3">ផ្សេងៗ</label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 pb-3 bg-white">
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
                                    <tr>
                                        <th class="align-middle text-center">បុគ្គលិក</th>
                                        <th class="align-middle text-center">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center">បញ្ជាក់ដោយ</th>
                                        <th class="align-middle text-center">អនុម័តដោយ</th>
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
                            <div class="d-flex flex-column">
                                <span><strong>ចំណាំ៖</strong></span>
                                <span>ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ ត្រូវអនុវត្តន៍ជាចាំបាច់ និងប្រើប្រាស់ជាឯកសារយោងសម្រាប់ការទូទាត់ប្រាក់បំណាច់ចុងក្រោយជូនដល់បុគ្គលិកដែលត្រូវបញ្ចប់ការងារ ឬចាក់ចេញពីក្រុមហ៊ុន។ ប្រធាននាយកដ្ឋាន ឬប្រធានសាខានីមួយៗត្រូវអនុវត្តន៍ និងពិនិត្យឱ្យបានហ្មត់ចត់មុនផ្ញើឯកសារនេះទៅកាន់នាយកក្រុមហ៊ុន ដើម្បីសុំសេចក្តីសម្រេចចិត្តចុងក្រោយ។</span>
                            </div>
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
                                            `${main_view.base_url}/hr/exit-form-item/details`,
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
                            createTitle: "View Exit Form Item",
                            modifyTitle: "View Exit Form Item",
                            targetProp: "exit_forms",
                            api: {
                                endpoint: [
                                    main_view.base_url,
                                    "/hr/exit-form-item/form-options",
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

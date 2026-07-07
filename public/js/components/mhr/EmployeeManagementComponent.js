"use strict";

var EmployeeManagementComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Employee Management";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_employee_management_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddEmployee");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_employee");
    mThis.elBranch = mThis.self.querySelector("#_emp_branch_id");
    mThis.elEmpType = mThis.self.querySelector("#_emp_type_id");
    mThis.elStatus = mThis.self.querySelector("#_emp_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_employee");
    mThis.paginationContainer = mThis.self.querySelector(
        "#employee_container_pagination",
    );

    mThis._sexLabel = (sex) => {
        if (sex === "M") return LocaleManager.trans("Male", "titles");
        if (sex === "F") return LocaleManager.trans("Female", "titles");
        return sex || "_";
    };

    mThis.cols = [
        { transTitle: "", className: "align-middle" },
        {
            transTitle: "titles.Photo",
            className: "align-middle",
            data: (data) =>
                `<img src="${data.image_url || `${main_view.base_url}/assets/images/default/default-staff.png`}" alt="" style="width:50px;height:50px;border-radius:6px;object-fit:cover;" />`,
        },
        {
            transTitle: "titles.Code",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.code ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => `
                <div class="text-prm-custom" style="min-width:120px;">
                    <span class="text-capitalize">${data.name ?? "_"}</span>
                    <span class="d-block text-primary" style="font-size:12px;">${mThis._sexLabel(data.sex)}</span>
                </div>`,
        },
        {
            transTitle: "titles.Position",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.position ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.type ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom"><i class="fa-solid fa-phone text-success px-1" style="font-size:12px;"></i> ${data.phone_number ?? "_"}</span>
                 <span class="d-block text-primary"><i class="fa-solid fa-envelope px-1" style="font-size:12px;"></i> ${data.email ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Joining Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.joining_date ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status || "").toLowerCase();
                let cls =
                    "badge text-warning bg-warning-subtle border border-warning";
                if (status.includes("active")) {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (
                    status.includes("inactive") ||
                    status.includes("terminated")
                ) {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                }
                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">${data.status ?? ""}</span>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                        class="btn-employee-dropdown-action"
                        data-id="${data.id}"
                        data-statusid="${data.status_id}"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style="cursor:pointer;padding:8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView("_employee_list", {
            fetchApi: `${main_view.base_url}/mhr/employee/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase text-nowrap",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            EmployeeDialog.show({
                id: null,
                btn: e.target,
                onClose: () => mThis.applyListFilters(),
            });
        };

        mThis.pr_tbl = mThis.EmployeeListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        };

        mThis.tblEmployee = mThis.EmployeeListView.getTable();
        mThis.initDropdownMenus(mThis.tblEmployee);
        mThis.bindFilterListeners();

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.applyListFilters();
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const nz = (v) =>
            v === "" || v === null || v === undefined ? "0" : String(v);
        const p = {
            search_value: mThis.elSearch.value || "",
            branch_id: nz(mThis.elBranch && mThis.elBranch.value),
            status_id: nz(mThis.elStatus && mThis.elStatus.value),
            emp_type_id: nz(mThis.elEmpType && mThis.elEmpType.value),
        };

        mThis.divFilter.querySelectorAll(".emp-filter-control").forEach((el) => {
            const f = el.dataset.field;
            if (!f) return;
            if (
                ["branch_id", "status_id", "emp_type_id"].includes(f)
            ) {
                p[f] = nz(el.value);
            } else {
                p[f] = el.value;
            }
        });

        return p;
    };

    mThis.applyListFilters = () => {
        const d = mThis.getFilterData();
        if (
            mThis.EmployeeListView &&
            typeof mThis.EmployeeListView.setParams === "function"
        ) {
            mThis.EmployeeListView.setParams(d);
        }
        mThis.EmployeeListView.showPage(d);
    };

    mThis.bindFilterListeners = () => {
        if (mThis._filterListenersBound) return;
        mThis._filterListenersBound = true;
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.applyListFilters();
        });
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn-employee-dropdown-action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Employee">Modify Employee</span>',
                    icon: '<i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>',
                    cssClass: "border-bottom pb-2",
                    name: "modify_employee",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Employee">Delete Employee</span>',
                    icon: '<i class="fa-regular fa-trash-can fs-5 text-danger"></i>',
                    cssClass: "border-bottom pb-2",
                    name: "delete_employee",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_employee":
                        EmployeeDialog.show({
                            id,
                            btn: menuLink,
                            onClose: () => mThis.applyListFilters(),
                        });
                        break;
                    case "delete_employee":
                        mThis.deleteEmployee(id, menuLink);
                        break;
                    default:
                        break;
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.deleteEmployee = (id, btn) => {
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "deleted",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (confirmed) => {
                if (!confirmed) return;
                vsapi
                    .call(
                        `${main_view.base_url}/mhr/employee/delete`,
                        { id },
                        btn,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("delete_success");
                            mThis.applyListFilters();
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            },
        );
    };

    mThis.populateFilterSelect = (el, items, valueKey, textKey, defaultLabel) => {
        if (!el) return;
        const current = el.value;
        el.innerHTML = "";
        const emptyOpt = document.createElement("option");
        emptyOpt.value = "";
        emptyOpt.textContent = defaultLabel;
        el.appendChild(emptyOpt);
        (items || []).forEach((item) => {
            const opt = document.createElement("option");
            opt.value = item[valueKey];
            opt.textContent = item[textKey];
            el.appendChild(opt);
        });
        if (current && el.querySelector(`option[value="${current}"]`)) {
            el.value = current;
        }
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/employee/form-options`, null)
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                mThis.populateFilterSelect(
                    mThis.elBranch,
                    d.branches,
                    "id",
                    "branch_name",
                    LocaleManager.trans("All Branches", "titles"),
                );
                mThis.populateFilterSelect(
                    mThis.elStatus,
                    d.status,
                    "id",
                    "name",
                    LocaleManager.trans("All Statuses", "titles"),
                );
                mThis.populateFilterSelect(
                    mThis.elEmpType,
                    d.types,
                    "id",
                    "name",
                    LocaleManager.trans("All Types", "titles"),
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.applyListFilters();
        });
    };

    return mThis;
})();

const EmployeeDialog = (() => {
    const self = {};
    let dialog = null;

    const lbl = (text, required = false) => {
        const t = LocaleManager.trans(text, "labels");
        return `<label class="emp-dialog-label">${t}${required ? ' <span class="text-danger">*</span>' : ""}</label>`;
    };

    const wrapField = (labelHtml, controlHtml) =>
        `<div class="emp-dialog-field">${labelHtml}${controlHtml}</div>`;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal emp-employee-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) =>
                    LocaleManager.trans(
                        me.dataOptions.id ? "Modify Employee" : "Add Employee",
                        "titles",
                    ),
                createContent: () => `
                    <style>
                        .emp-employee-modal .modal-body { padding-top: 0.5rem; }
                        .emp-dialog-label {
                            display: block;
                            margin-bottom: 6px;
                            font-size: 13px;
                            font-weight: 600;
                            color: #1a2566;
                        }
                        .emp-dialog-field { margin-bottom: 0; }
                        .emp-dialog-input,
                        .emp-employee-modal .form-control {
                            min-height: 38px;
                            border-radius: 8px;
                            border: 1px solid #d9dbe3;
                            font-size: 13px;
                        }
                        .emp-dialog-input:focus,
                        .emp-employee-modal .form-control:focus {
                            border-color: #94a3b8;
                            box-shadow: 0 0 0 3px rgba(29, 43, 77, 0.08);
                        }
                        .emp-dialog-photo-wrap {
                            width: 100%;
                            min-height: 170px;
                            border: 1px solid #d9dbe3;
                            border-radius: 10px;
                            background: #f8f9fb;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                        }
                        .emp-dialog-divider {
                            border-color: #e8ebf0;
                            margin: 1rem 0 1.25rem;
                        }
                        .emp-dialog-btn-cancel {
                            background: #d88994;
                            border: none;
                            color: #fff;
                            min-width: 90px;
                        }
                        .emp-dialog-btn-cancel:hover {
                            background: #c97783;
                            color: #fff;
                        }
                        .emp-dialog-btn-save {
                            background: #4f5fd0;
                            border: none;
                            color: #fff;
                            min-width: 90px;
                        }
                        .emp-dialog-btn-save:hover {
                            background: #3f4fc0;
                            color: #fff;
                        }
                    </style>
                    <div class="emp-employee-dialog">
                        <div class="row g-3 align-items-start mb-2">
                            <div class="col-md-3">
                                <div id="_emp_dialog_photo" class="emp-dialog-photo-wrap"></div>
                            </div>
                            <div class="col-md-9">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        ${wrapField(
                                            lbl("Name", true),
                                            '<input type="text" name="name" class="form-control data-input emp-dialog-input" data-field="name" />',
                                        )}
                                    </div>
                                    <div class="col-md-6">
                                        ${wrapField(
                                            lbl("Khmer Name", true),
                                            '<input type="text" name="name_kh" class="form-control data-input emp-dialog-input" data-field="name_kh" />',
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            lbl("Sex"),
                                            `<select data-style="material" name="sex" class="form-control data-input emp-dialog-input" data-field="sex" placeholder="${LocaleManager.trans("Sex", "labels")}">
                                                <option value="">${LocaleManager.trans("Select", "labels")}</option>
                                                <option value="M">${LocaleManager.trans("Male", "titles")}</option>
                                                <option value="F">${LocaleManager.trans("Female", "titles")}</option>
                                            </select>`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            lbl("Marital Status", true),
                                            `<select data-style="material" name="marital_status" class="form-control data-input emp-dialog-input" data-field="marital_status" placeholder="${LocaleManager.trans("Marital Status", "labels")}">
                                                <option value="single">${LocaleManager.trans("Single", "titles")}</option>
                                                <option value="married">${LocaleManager.trans("Married", "titles")}</option>
                                                <option value="divorced">${LocaleManager.trans("Divorced", "titles")}</option>
                                                <option value="widowed">${LocaleManager.trans("Widowed", "titles")}</option>
                                            </select>`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            lbl("Date Of Birth", true),
                                            '<input type="text" data-type="date" name="date_of_birth" class="form-control data-input emp-dialog-input" data-field="date_of_birth" placeholder="dd-MM-yyyy" />',
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="emp-dialog-divider" />

                        <div class="row g-3">
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Nationality", true),
                                    `<select data-style="material" name="nationality_id" class="form-control data-input emp-dialog-input" data-field="nationality_id" placeholder="${LocaleManager.trans("Nationality", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Identity Card", true),
                                    '<input type="text" name="nid" class="form-control data-input emp-dialog-input" data-field="nid" placeholder="CAM100001" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Identity Card Expiry", true),
                                    '<input type="text" data-type="date" name="nid_expiry_date" class="form-control data-input emp-dialog-input" data-field="nid_expiry_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("NSSF ID"),
                                    '<input type="text" name="nssf_id" class="form-control data-input emp-dialog-input" data-field="nssf_id" placeholder="NSSF100001" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Passport Number"),
                                    '<input type="text" name="passport_number" class="form-control data-input emp-dialog-input" data-field="passport_number" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Passport Expiry", true),
                                    '<input type="text" data-type="date" name="passport_expiry_date" class="form-control data-input emp-dialog-input" data-field="passport_expiry_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Place of Birth"),
                                    `<select data-style="material" name="birth_city_id" class="form-control data-input emp-dialog-input" data-field="birth_city_id" placeholder="${LocaleManager.trans("Place of Birth", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Employee Type", true),
                                    `<select data-style="material" name="emp_type_id" class="form-control data-input emp-dialog-input" data-field="emp_type_id" placeholder="${LocaleManager.trans("Employee Type", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Position", true),
                                    `<select data-style="material" name="position_id" class="form-control data-input emp-dialog-input" data-field="position_id" placeholder="${LocaleManager.trans("Position", "labels")}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Phone", true),
                                    '<input type="text" name="phone_number" class="form-control data-input emp-dialog-input" data-field="phone_number" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Email", true),
                                    '<input type="email" name="email" class="form-control data-input emp-dialog-input" data-field="email" placeholder="example@gmail.com" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Salary"),
                                    '<input type="number" name="salary" class="form-control data-input emp-dialog-input" data-field="salary" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Joining Date", true),
                                    '<input type="text" data-type="date" name="joining_date" class="form-control data-input emp-dialog-input" data-field="joining_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Apply Payroll Tax", true),
                                    `<select data-style="material" name="apply_payroll_tax" class="form-control data-input emp-dialog-input" data-field="apply_payroll_tax" placeholder="${LocaleManager.trans("Apply Payroll Tax", "labels")}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Name"),
                                    '<input type="text" name="spouse_name" class="form-control data-input emp-dialog-input" data-field="spouse_name" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Employee"),
                                    `<select data-style="material" name="spouse_emp_id" class="form-control data-input emp-dialog-input" data-field="spouse_emp_id" placeholder="${LocaleManager.trans("None", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Occupation"),
                                    '<input type="text" name="spouse_occ_code" class="form-control data-input emp-dialog-input" data-field="spouse_occ_code" />',
                                )}
                            </div>

                            <div class="col-12">
                                ${wrapField(
                                    lbl("Address", true),
                                    '<textarea name="address" rows="3" class="form-control data-input emp-dialog-input" data-field="address"></textarea>',
                                )}
                            </div>
                        </div>
                    </div>`,
                contentCreated: (me) => {
                    const photoEl = me.self.querySelector("#_emp_dialog_photo");
                    if (photoEl && !me.controls._empPhotoBox) {
                        me.controls._empPhotoBox = new ImageBox(photoEl, {
                            dataset: { field: "photo" },
                            cssClass: "data-input",
                            defaultPhotoName: "default-staff",
                        });
                    }
                    me.self
                        .querySelectorAll('input[data-type="date"]')
                        .forEach((el) => {
                            if (!el._dtp) new DateTimePicker(el, null);
                        });
                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "birth_city_id",
                        data: "cities",
                        textField: "city_name",
                        valueField: "birth_city_id",
                    },
                    {
                        name: "emp_type_id",
                        data: "types",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "position_id",
                        data: "positions",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "apply_payroll_tax",
                        data: "payroll_taxes",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "spouse_emp_id",
                        data: "employees",
                        textField: "name",
                        valueField: "id",
                        firstOption: {
                            value: "",
                            label: LocaleManager.trans("None", "labels"),
                        },
                    },
                ],
                prepareFormOptions: {
                    targetProp: "employee",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/employee/form-options`,
                        params: (op) => ({ id: op.id }),
                    },
                },
                onPrepareForm: (me, data) => {
                    const emp = data?.employee;
                    const isEdit = Number(me.dataOptions.id) > 0;

                    if (me.controls._empPhotoBox) {
                        if (emp?.image_url) {
                            me.controls._empPhotoBox.setImage(emp.image_url);
                        } else if (!isEdit) {
                            me.controls._empPhotoBox.setImage(null);
                        }
                    }

                    if (isEdit) {
                        me.setReadOnly(true, [
                            "emp_type_id",
                            "position_id",
                            "salary",
                        ]);
                    } else if (me.controls.apply_payroll_tax) {
                        me.controls.apply_payroll_tax.value = "1";
                    }
                },
                buttons: [
                    {
                        label: LocaleManager.trans("Cancel", "buttons"),
                        cssClass: "btn emp-dialog-btn-cancel",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: LocaleManager.trans("Save", "buttons"),
                        cssClass: "btn emp-dialog-btn-save",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            if (me.controls._empPhotoBox) {
                                const photo =
                                    me.controls._empPhotoBox.getImage?.() ||
                                    me.controls._empPhotoBox.getValue?.();
                                if (photo) op.photo = photo;
                            }

                            if (!op.id) {
                                op.branch_id = main_view.branch_id;
                                op.status_id = op.status_id || 10;
                            }

                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/employee/save`,
                                    op,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (
                                            typeof me.dataOptions.onClose ===
                                            "function"
                                        ) {
                                            me.dataOptions.onClose();
                                        }
                                        cv_interact.success(
                                            me.dataOptions.id
                                                ? LocaleManager.trans(
                                                      "update_success",
                                                      "message_box_default",
                                                  )
                                                : LocaleManager.trans(
                                                      "create_success",
                                                      "message_box_default",
                                                  ),
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };

    return self;
})();

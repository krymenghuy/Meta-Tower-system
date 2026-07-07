"use strict";

var EmployeeManagementComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Employee";
    mThis.defaultPage = 'employee_list';

    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_employee_management_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddEmployee");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_employee");
    mThis.elEmpType = mThis.self.querySelector("#_emp_type_id");
    mThis.elStatus = mThis.self.querySelector("#_emp_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_employee");
    mThis.divlistView = mThis.self.querySelector("#_employee_list");
    mThis.paginationContainer = mThis.self.querySelector( "#container_pagination");
    mThis.div_filter_fields = mThis.self.querySelector("#div_filter_filed");

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView(mThis.divlistView, {
            fetchApi: `${main_view.base_url}/mhr/employee/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.paginationContainer,
            apiCluster: main_view.apiCluster,
            renderItems: (data, list_container) => {
                mThis.renderEmployeeList(list_container, data);
            },
            listContainerClass: null,
        });
         mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                // branch_id: mThis.el_branch.value,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
                },
            };
            
            EmployeeDialog.show(op);
        };

        mThis.pr_tbl = mThis.EmployeeListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        };

        mThis.tblEmployee = mThis.EmployeeListView.getTable();

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
            }, 250);
        });

        mThis.initAlready = true;
    };
      mThis.getFilterData = () => {
        const p = {"search_value":mThis.elSearch.value};
        const elements =  mThis.div_filter_fields.querySelectorAll(".filter-field");
        elements.forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });

        return p;
    };
    mThis.getPageContainer =(pageName)=>{
        return mThis.pages[pageName];
    };
    mThis.renderEmployeeList = (div, data) => {
        console.log(123, data);
        data = data ?? [];
        // if (!AuthManager) {
        //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
        //     return;
        // }
        AuthManager.init().then((user) => {
            mThis.renderEmployee(data, user);
        });
    };
    mThis.renderEmployee = (data) => {
        let html = `<div class="row g-3">`;
        let cmt = 0;

        if (Array.isArray(data) && data[0]) {
            data.forEach((d) => {
                const status = d.status || "Active";

                let statusColor;

                switch (status) {
                    case "Terminated":
                        statusColor =
                            "background: linear-gradient(rgb(12 32 126), rgb(172 53 39); color: #fff; border:1px solid rgb(201, 38, 17);";
                        break;
                    case "Resigned":
                        statusColor =
                            "background: linear-gradient(rgb(12 32 126), rgb(224 203 48); color: #fff; border:1px solid rgb(225, 225, 14);";
                        break;
                    default:
                        statusColor =
                            "background: linear-gradient(rgb(12 32 126), rgb(22 119 196)); color: #fff; border:1px solid #fffbff;";
                        break;
                }
 html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-center align-items-start mt-3">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:100px;height:100px;">
                                            <img src="${d.image_url || main_view.asset_url + "/images/default/default-tenant.jpg"}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
                                        </div>
                                        <!-- <div class="flex items-start justify-between mb-6">
                                            <span class="fw-semibold text-start mb-1 text-dark text-capitalize">${d.name ?? '-'}</span>
                                            <div class="d-flex align-items-center mt-1 gap-2">
                                                    <span class="text-muted small" style="min-width:70px; text-transform: capitalize;">${d.position ?? '-'}</span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                                                <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                            </a>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                            <div class="card-body text-center" style="background-color:#fbfcfd; padding: 1rem;">
                                <div class="row g-3 border-bottom border-gray">
                                    <div class="col-6 mt-3">
                                        <div class="card bg-prm-custom text-center shadow-sm">
                                                <div class="fs-6 py-1 text-gold-custom">${d.name}</div>
                                        </div>
                                    </div>
                                    <div class="col-1"></div>
                                    <div class="col-6">
                                       

                                    </div>
                                </div>
                                <div class="card_container" style="max-width: 250px;">
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-hashtag me-2 text-muted"></i>
                                        <span>${d.code ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-regular fa-calendar me-2 text-muted"></i>
                                        <span>${d.date_of_birth ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-phone me-2 text-muted"></i>
                                        ${d.phone_number || ""}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-at me-2 text-muted"></i>
                                        ${d.email || "_"}
                                    </p>


                                </div>
                            </div>
                                <div class="d-flex justify-content-between rounded-bottom-2 align-items-center px-2 py-2"
                                    style="font-size: 1rem; background-color: #d4d4db; border-top: 1px solid #e2e8f0;">
                                    <span style="color: #64748b; font-size: 0.85rem;">
                                        <span class="small" vslang="titles.Last Updated">Last Updated</span>:
                                        ${d.update_user || "System"}
                                    </span>
                                    <a href="javascript:void(0)" class="text-primary-custom see-tenant-detail  text-decoration-none" style="font-size: 0.85rem;" data-id="${d.id}">
                                        <span vslang="titles.View Details">View Details</span> <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.85rem;"></i>
                                    </a>
                                </div>

                        </div>
                    </div>
                    `;
                   
                cmt++;
            });
        }

        if (cmt === 0) {
            html = [
                `<div class="w-100 rounded-3  text-center mt-3 mb-3 position-relative">`,
                `<div class="d-flex bg-grey shadow rounded-5 p-3"><span class="d-flex align-items-center justify-content-center p-2 w-100 text-danger">Employee not found! </span></div>`,
                `</div>`,
            ].join("");
        }

        html += `</div>`;
        mThis.divlistView.innerHTML = html;

    };
  
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/employee/form-options`, null)
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',"",LocaleManager.trans("All Statuses", "titles"),"");
                VSUtil.setComboItems(mThis.elEmpType,d.types,'id','name',"",LocaleManager.trans("All Types", "titles"),"");
                if (typeof onFinish === "function") onFinish();
            });
    };
      mThis.showPage = async (pageName, op = {})=>{
       if(mThis.self.style.display !=='block'){
         main_view.setContentView(mThis.self, mThis.title_prop);
       }
       switch(pageName){
         case 'employee_list':{
            mThis.currentPage = 'employee_list';
            mThis.EmployeeListView.showPage(op);
            break;
         }
        
          default:{
             return;
          }
       }
       const targetPage = mThis.getPageContainer(pageName);
       const siblings = Array.from(targetPage.parentElement.children);
       // Hide all siblings smoothly
       siblings.forEach((div) => {
           if (div !== targetPage && div.style.display !== 'none') {
               div.style.display = 'none';
           }
       });
       targetPage.style.display = 'block';
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            mThis.showPage(mThis.defaultPage,mThis.getFilterData());
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

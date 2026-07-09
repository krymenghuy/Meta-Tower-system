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
    mThis.divListContainer = mThis.self.querySelector("#_employee_list_container");
    mThis.divProfileView = mThis.self.querySelector("#_emp_profile_view");
    mThis.divlistView = mThis.self.querySelector("#_employee_list");
    mThis.paginationContainer = mThis.self.querySelector("#container_pagination");
    mThis.div_filter_fields = mThis.self.querySelector("#div_filter_filed");
    mThis.btnBack = mThis.divProfileView.querySelector("#_btn_back_employee");
    mThis.btnPrintCv = mThis.divProfileView.querySelector("#_btn_print_employee_cv");
    mThis.btnEditProfile = mThis.divProfileView.querySelector("#_btn_edit_employee_profile");
    mThis.profileInfoEmployee = mThis.divProfileView.querySelector("#profile_info_employee");
    mThis.profileSkillsEmployee = mThis.divProfileView.querySelector("#profile_skills_employee");
    mThis.pages = {
        employee_list: mThis.divListContainer,
        profile_view: mThis.divProfileView,
    };

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
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.div_filter_fields.addEventListener("change", (e) => {
            if (e.target.classList.contains("filter-field")) {
                e.preventDefault();
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }
        });

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("employee_list", mThis.getFilterData());
        };

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
    mThis.renderEmployeeList = (container, data) => {
        data = data ?? [];
        AuthManager.init().then(() => {
            mThis.renderEmployee(container, data);
        });
    };

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._sexLabel = (sex) => {
        if (sex === "M") return LocaleManager.trans("Male", "titles");
        if (sex === "F") return LocaleManager.trans("Female", "titles");
        return sex || "_";
    };

    mThis._maritalLabel = (status) => {
        if (!status) return "_";
        const map = {
            single: LocaleManager.trans("Single", "titles"),
            married: LocaleManager.trans("Married", "titles"),
            divorced: LocaleManager.trans("Divorced", "titles"),
            widowed: LocaleManager.trans("Widowed", "titles"),
        };
        return map[status] || status;
    };

    mThis._payrollTaxLabel = (value) => {
        if (value === "1" || value === 1) {
            return LocaleManager.trans("Tax", "titles");
        }
        return LocaleManager.trans("Non Tax", "titles");
    };

    mThis._formatSalary = (salary, currency) => {
        if (salary == null || salary === "") return "_";
        if (typeof VSMoney !== "undefined" && VSMoney.formatAmount) {
            return VSMoney.formatAmount(salary, currency || "USD");
        }
        return salary;
    };

    mThis._profileLine = (label, rawValue, { gold = false, muted = false, capitalize = false } = {}) => {
        let valueClass = "emp-profile-line-value";
        let display = "";

        if (muted) {
            valueClass += " is-muted";
            display = mThis._escapeHtml(rawValue);
        } else {
            const isEmpty =
                rawValue == null || rawValue === "" || rawValue === "_";
            if (isEmpty) {
                valueClass += " is-muted";
                display = "_";
            } else {
                if (gold) {
                    valueClass += " is-gold";
                }
                if (capitalize) {
                    valueClass += " is-capitalize";
                }
                display = mThis._escapeHtml(String(rawValue));
            }
        }

        return `
            <div class="emp-profile-line">
                <span class="emp-profile-line-label">${label}</span>
                <span class="emp-profile-line-sep">:</span>
                <span class="${valueClass}">${display}</span>
            </div>`;
    };

    mThis._profileLinePassport = (label, passportNumber) => {
        if (!passportNumber) {
            return mThis._profileLine(
                label,
                LocaleManager.trans("not have yet", "titles"),
                { muted: true },
            );
        }
        return mThis._profileLine(label, passportNumber);
    };

    mThis._profileLineExpiry = (label, expiryDate) => {
        return mThis._profileLine(label, expiryDate);
    };

    mThis.renderEmployee = (container, data) => {
        let html = `<div class="row g-3">`;
        let cmt = 0;

        if (Array.isArray(data) && data[0]) {
            data.forEach((d) => {
 html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-center align-items-start mt-3">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:100px;height:100px;">
                                            <img src="${d.image_url || main_view.base_url + "/assets/images/default/default-staff.png"}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
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
                                    <a href="javascript:void(0)" class="text-primary-custom see-employee-detail text-decoration-none" style="font-size: 0.85rem;" data-id="${d.id}">
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
        container.innerHTML = html;
        LocaleManager.translateZone(container);

        container.querySelectorAll(".see-employee-detail").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const employeeId = e.currentTarget.dataset.id;
                mThis.showPage("profile_view", { id: employeeId });
            });
        });
    };

    mThis.renderProfile = (data) => {
        if (!mThis.profileInfoEmployee || !data) return;

        const defaultPhoto = `${main_view.base_url}/assets/images/default/default-staff.png`;
        const hasPhoto = !!data.image_url;
        const imageUrl = hasPhoto ? data.image_url : defaultPhoto;
        const photoWrapClass = hasPhoto ? "" : " is-empty";

        const html = `
            <div class="emp-profile-card">
                <div class="d-flex flex-column flex-lg-row align-items-stretch p-4">
                    <div class="emp-profile-side d-flex flex-column align-items-center text-center">
                        <div class="emp-profile-photo-wrap mx-auto mb-3${photoWrapClass}">
                            <img src="${imageUrl}" alt="${mThis._escapeHtml(data.name)}"
                                onerror="this.style.display='none';this.parentElement.classList.add('is-empty');">
                            <span class="emp-profile-photo-placeholder align-items-center justify-content-center"><i class="fa-solid fa-user"></i></span>
                            <span class="emp-profile-status-dot"></span>
                        </div>
                        <div class="emp-profile-code mb-2"># : ${mThis._escapeHtml(data.code ?? "_")}</div>
                        <div class="emp-profile-name text-capitalize mb-2">${mThis._escapeHtml(data.name ?? "_")}</div>
                        <div class="emp-profile-position mb-4">${mThis._escapeHtml(data.position ?? "_")}</div>
                        <div class="d-flex justify-content-center align-items-center gap-2 pt-2">
                            <a href="javascript:void(0)" class="emp-profile-social-btn emp-profile-social-facebook d-inline-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" title="Facebook" aria-label="Facebook">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="javascript:void(0)" class="emp-profile-social-btn emp-profile-social-linkedin d-inline-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" title="LinkedIn" aria-label="LinkedIn">
                                <i class="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a href="javascript:void(0)" class="emp-profile-social-btn emp-profile-social-telegram d-inline-flex align-items-center justify-content-center text-decoration-none flex-shrink-0" title="Telegram" aria-label="Telegram">
                                <i class="fa-brands fa-telegram"></i>
                            </a>
                        </div>
                    </div>

                    <div class="emp-profile-details flex-grow-1 min-w-0 pt-1">
                        <div class="emp-profile-info-col min-w-0">
                            ${mThis._profileLine(LocaleManager.trans("Name", "labels"), data.name)}
                            ${mThis._profileLine(LocaleManager.trans("Name KH", "labels"), data.name_kh)}
                            ${mThis._profileLine(LocaleManager.trans("Sex", "labels"), mThis._sexLabel(data.sex))}
                            ${mThis._profileLine(LocaleManager.trans("Nationality", "labels"), data.nationality)}
                            ${mThis._profileLine(LocaleManager.trans("Marital Status", "labels"), mThis._maritalLabel(data.marital_status))}
                        </div>
                        <div class="emp-profile-info-col emp-profile-info-col--divided min-w-0">
                            ${mThis._profileLine(LocaleManager.trans("Staff Type", "labels"), data.type, { gold: true })}
                            ${mThis._profileLine(LocaleManager.trans("Position", "labels"), data.position, { gold: true })}
                            ${mThis._profileLine(LocaleManager.trans("Email", "labels"), data.email)}
                            ${mThis._profileLine(LocaleManager.trans("Phone Number", "labels"), data.phone_number)}
                            ${mThis._profileLine("Husband/Wife Name", data.spouse_name)}
                        </div>
                        <div class="emp-profile-info-col emp-profile-info-col--divided min-w-0">
                            ${mThis._profileLine(LocaleManager.trans("Identity Card", "labels"), data.nid)}
                            ${mThis._profileLinePassport(LocaleManager.trans("Passport ID", "labels"), data.passport_number)}
                            ${mThis._profileLineExpiry(LocaleManager.trans("Passport Expiry", "labels"), data.passport_expiry_date)}
                            ${mThis._profileLine(LocaleManager.trans("NSSF", "labels"), data.nssf_id)}
                            ${mThis._profileLine(LocaleManager.trans("Spouse Occupation", "labels"), data.spouse_occ_code)}
                        </div>

                        <div class="emp-profile-band-divider"></div>

                        <div class="emp-profile-info-col min-w-0">
                            ${mThis._profileLine(LocaleManager.trans("Date Of Birth", "labels"), data.date_of_birth)}
                            ${mThis._profileLine(LocaleManager.trans("Joining Date", "labels"), data.joining_date, { gold: true })}
                            ${mThis._profileLine(LocaleManager.trans("Salary", "labels"), mThis._formatSalary(data.salary, data.currency_code))}
                        </div>
                        <div class="emp-profile-info-col emp-profile-info-col--divided min-w-0">
                            ${mThis._profileLine(LocaleManager.trans("Work Shift", "labels"), data.work_shift)}
                            ${mThis._profileLine(LocaleManager.trans("Payroll Tax", "labels"), mThis._payrollTaxLabel(data.apply_payroll_tax), { gold: true })}
                            ${mThis._profileLine(LocaleManager.trans("Address", "labels"), data.address, { gold: true, capitalize: true })}
                        </div>
                        <div class="emp-profile-info-col emp-profile-info-col--divided d-flex align-items-center justify-content-center align-self-center min-w-0">
                            <div class="d-flex align-items-center justify-content-center gap-2 flex-shrink-0">
                                <button type="button" class="emp-profile-action-btn emp-profile-action-btn-edit d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_edit" title="Edit">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button type="button" class="emp-profile-action-btn emp-profile-action-btn-remove d-inline-flex align-items-center justify-content-center" title="Remove">
                                    <i class="fa-solid fa-user-minus"></i>
                                </button>
                                <button type="button" class="emp-profile-action-btn emp-profile-action-btn-alert d-inline-flex align-items-center justify-content-center" title="Alert">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                </button>
                                <button type="button" class="emp-profile-action-btn emp-profile-action-btn-message d-inline-flex align-items-center justify-content-center" title="Message">
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        mThis.profileInfoEmployee.innerHTML = html;
        LocaleManager.translateZone(mThis.profileInfoEmployee);
        mThis.setProfileActions(data);
        EmployeeSkillComponent.render(
            mThis.profileSkillsEmployee,
            data.skills || [],
            data.id,
            (empId) => mThis.showPage("profile_view", { id: empId }),
        );
    };

    mThis.setProfileActions = (data) => {
        mThis.currentEmployeeId = data?.id;

        const openEditDialog = () => {
            EmployeeDialog.show({
                id: mThis.currentEmployeeId,
                onClose: () => {
                    mThis.showPage("profile_view", { id: mThis.currentEmployeeId });
                },
            });
        };

        if (mThis.btnEditProfile) {
            mThis.btnEditProfile.onclick = (e) => {
                e.preventDefault();
                openEditDialog();
            };
        }

        const inlineEditBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_edit");
        if (inlineEditBtn) {
            inlineEditBtn.onclick = (e) => {
                e.preventDefault();
                openEditDialog();
            };
        }

        if (mThis.btnPrintCv) {
            mThis.btnPrintCv.onclick = (e) => {
                e.preventDefault();
                cv_interact.info(
                    LocaleManager.trans("Print CV feature is coming soon.", "message_box_default"),
                );
            };
        }
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
    mThis.showPage = async (pageName, op = {}) => {
        if (mThis.self.style.display !== "block") {
            main_view.setContentView(mThis.self, mThis.title_prop);
        }

        switch (pageName) {
            case "employee_list": {
                mThis.currentPage = "employee_list";
                mThis.EmployeeListView.showPage(op);
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const employeeId = op.id || op.employee_id || op;
                const res = await vsapi.call(
                    `${main_view.base_url}/mhr/employee/details`,
                    { id: employeeId },
                    false,
                    null,
                );
                if (res.status_code !== 200 || !res.data) {
                    cv_interact.error(
                        res.error_message ||
                            LocaleManager.trans("Employee not found", "message_box_default"),
                    );
                    mThis.showPage("employee_list", mThis.getFilterData());
                    return;
                }
                mThis.renderProfile(res.data);
                break;
            }
            default: {
                return;
            }
        }

        const targetPage = mThis.getPageContainer(pageName);
        if (!targetPage || !targetPage.parentElement) return;

        const siblings = Array.from(targetPage.parentElement.children);
        siblings.forEach((div) => {
            if (div !== targetPage && div.style.display !== "none") {
                div.style.display = "none";
            }
        });
        targetPage.style.display = "block";
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
        return `<label class="form-label fw-semibold mb-1">${t}${required ? ' <span class="text-danger">*</span>' : ""}</label>`;
    };

    const wrapField = (labelHtml, controlHtml) =>
        `<div class="mb-0">${labelHtml}${controlHtml}</div>`;

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
                    <div class="emp-employee-dialog">
                        <div class="row g-3 align-items-start mb-2">
                            <div class="col-md-3">
                                <div id="_emp_dialog_photo" class="emp-dialog-photo-wrap d-flex align-items-center justify-content-center"></div>
                            </div>
                            <div class="col-md-9">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        ${wrapField(
                                            lbl("Name", true),
                                            '<input type="text" name="name" class="form-control data-input" data-field="name" />',
                                        )}
                                    </div>
                                    <div class="col-md-6">
                                        ${wrapField(
                                            lbl("Khmer Name", true),
                                            '<input type="text" name="name_kh" class="form-control data-input" data-field="name_kh" />',
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            lbl("Sex"),
                                            `<select data-style="material" name="sex" class="form-control data-input" data-field="sex" placeholder="${LocaleManager.trans("Sex", "labels")}">
                                                <option value="">${LocaleManager.trans("Select", "labels")}</option>
                                                <option value="M">${LocaleManager.trans("Male", "titles")}</option>
                                                <option value="F">${LocaleManager.trans("Female", "titles")}</option>
                                            </select>`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            lbl("Marital Status", true),
                                            `<select data-style="material" name="marital_status" class="form-control data-input" data-field="marital_status" placeholder="${LocaleManager.trans("Marital Status", "labels")}">
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
                                            '<input type="text" data-type="date" name="date_of_birth" class="form-control data-input" data-field="date_of_birth" placeholder="dd-MM-yyyy" />',
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-secondary-subtle my-3" />

                        <div class="row g-3">
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Nationality", true),
                                    `<select data-style="material" name="nationality_id" class="form-control data-input" data-field="nationality_id" placeholder="${LocaleManager.trans("Nationality", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Identity Card", true),
                                    '<input type="text" name="nid" class="form-control data-input" data-field="nid" placeholder="CAM100001" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Identity Card Expiry", true),
                                    '<input type="text" data-type="date" name="nid_expiry_date" class="form-control data-input" data-field="nid_expiry_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("NSSF ID"),
                                    '<input type="text" name="nssf_id" class="form-control data-input" data-field="nssf_id" placeholder="NSSF100001" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Passport Number"),
                                    '<input type="text" name="passport_number" class="form-control data-input" data-field="passport_number" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Passport Expiry", true),
                                    '<input type="text" data-type="date" name="passport_expiry_date" class="form-control data-input" data-field="passport_expiry_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Place of Birth"),
                                    `<select data-style="material" name="birth_city_id" class="form-control data-input" data-field="birth_city_id" placeholder="${LocaleManager.trans("Place of Birth", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Employee Type", true),
                                    `<select data-style="material" name="emp_type_id" class="form-control data-input" data-field="emp_type_id" placeholder="${LocaleManager.trans("Employee Type", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Position", true),
                                    `<select data-style="material" name="position_id" class="form-control data-input" data-field="position_id" placeholder="${LocaleManager.trans("Position", "labels")}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Phone", true),
                                    '<input type="text" name="phone_number" class="form-control data-input" data-field="phone_number" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Email", true),
                                    '<input type="email" name="email" class="form-control data-input" data-field="email" placeholder="example@gmail.com" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Salary"),
                                    '<input type="number" name="salary" class="form-control data-input" data-field="salary" />',
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Joining Date", true),
                                    '<input type="text" data-type="date" name="joining_date" class="form-control data-input" data-field="joining_date" placeholder="dd-MM-yyyy" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Apply Payroll Tax", true),
                                    `<select data-style="material" name="apply_payroll_tax" class="form-control data-input" data-field="apply_payroll_tax" placeholder="${LocaleManager.trans("Apply Payroll Tax", "labels")}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Name"),
                                    '<input type="text" name="spouse_name" class="form-control data-input" data-field="spouse_name" />',
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Employee"),
                                    `<select data-style="material" name="spouse_emp_id" class="form-control data-input" data-field="spouse_emp_id" placeholder="${LocaleManager.trans("None", "labels")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    lbl("Spouse Occupation"),
                                    '<input type="text" name="spouse_occ_code" class="form-control data-input" data-field="spouse_occ_code" />',
                                )}
                            </div>

                            <div class="col-12">
                                ${wrapField(
                                    lbl("Address", true),
                                    '<textarea name="address" rows="3" class="form-control data-input" data-field="address"></textarea>',
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

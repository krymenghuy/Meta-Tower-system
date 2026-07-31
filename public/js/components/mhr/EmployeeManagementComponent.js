"use strict";

var EmployeeManagementComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Employee";
    mThis.defaultPage = 'employee_list';

    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employee_management_component");

    mThis.elEmployeeStatus = mThis.self.querySelector("#_emp_status_id");
    mThis.elEmployeeType = mThis.self.querySelector("#_emp_type_id");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddEmployee");
    mThis.btnBack = mThis.self.querySelector("#_btn_back_employee");
    mThis.div_filter_fields = mThis.self.querySelector("#div_filter_filed");
    mThis.elSearch = mThis.self.querySelector("#_search_employee");
    mThis.divEmployeeListContainer = mThis.self.querySelector("#_employee_list_container");
    mThis.divProfileView = mThis.self.querySelector("#_emp_profile_view");

    mThis.pages = {
        employee_list: mThis.divEmployeeListContainer,
        profile_view: mThis.divProfileView,
    };

    mThis.profile_info_emp = mThis.divProfileView.querySelector("#profile_info_employee");
    mThis.profile_cards_emp = mThis.divProfileView.querySelector("#profile_cards_employee");

    mThis.divlistView = mThis.self.querySelector("#_employee_list");
    mThis.paginationContainer = mThis.self.querySelector("#container_pagination");
    mThis.employee_id = null;
    mThis.store_filter = {};

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
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
                },
            };

            EmployeeDialog.show(op);
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("employee_list", mThis.getFilterData());
        };
        mThis.div_filter_fields
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
                };
            });

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }, 250);
        };

        mThis.listContainer = mThis.EmployeeListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.height = window.innerHeight - 220 + "px";
        };

        mThis.setActionsProfileInfo(mThis.profile_info_emp);
        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const p = { search_value: mThis.elSearch.value };
        const elements = mThis.div_filter_fields.querySelectorAll(".filter-field");
        elements.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.getPageContainer =(pageName)=>{
        return mThis.pages[pageName];
    };

    mThis.initProfileScroll = () => {
        const scrollEl = mThis.divProfileView;
        if (!scrollEl) return;

        const setHeight = () => {
            scrollEl.style.maxHeight = window.innerHeight - 70 + "px";
        };

        setHeight();
        scrollEl.classList.add("overflow-y-auto", "overflow-x-hidden");

        if (!mThis._profileScrollResizeBound) {
            window.addEventListener("resize", setHeight);
            mThis._profileScrollResizeBound = true;
        }
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

    mThis._statusBadgeClass = (status) => {
        const s = String(status || "").toLowerCase();
        if (s.includes("active")) return "is-active";
        if (s.includes("pending") || s.includes("leave")) return "is-pending";
        if (s.includes("inactive") || s.includes("resign")) return "is-inactive";
        return "is-active";
    };

    mThis._pillText = (value) => {
        if (value == null || value === "") return "_";
        return mThis._escapeHtml(String(value));
    };

    mThis._shortText = (value, max = 48) => {
        if (value == null || value === "") return "_";
        const text = String(value);
        if (text.length <= max) return mThis._escapeHtml(text);
        return mThis._escapeHtml(text.slice(0, max).trim() + "...");
    };

    mThis._formatSalary = (salary, currency) => {
        if (salary == null || salary === "") return "_";
        if (typeof VSMoney !== "undefined" && VSMoney.formatAmount) {
            return VSMoney.formatAmount(salary, currency || "USD");
        }
        return salary;
    };

    mThis._profileLine = (label, rawValue, { gold = false, muted = false, capitalize = false } = {}) => {
        let valueClass = "emp-profile-field-value";
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
            <div class="emp-profile-field">
                <span class="emp-profile-field-label">${label}</span>
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

    mThis._employeeCardDetail = (iconClass, value) => `
        <li class="emp-list-card-detail">
            <span class="emp-list-card-detail-icon" aria-hidden="true">
                <i class="${iconClass}"></i>
            </span>
            <span class="emp-list-card-detail-text">${mThis._pillText(value)}</span>
        </li>`;

    mThis.renderEmployee = (container, data) => {
        let html = `<div class="row g-3">`;
        let cmt = 0;
        const defaultPhoto = `${main_view.base_url}/assets/images/default/default-staff.png`;

        if (Array.isArray(data) && data[0]) {
            data.forEach((d) => {
                const photo = d.image_url || defaultPhoto;
                const updatedBy = d.update_user || "System";

                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <article class="emp-list-card">
                            <div class="emp-list-card-header">
                                <div class="emp-list-card-avatar-wrap">
                                    <div class="emp-list-card-avatar">
                                        <img src="${photo}" alt="${mThis._escapeHtml(d.name || "Employee")}">
                                    </div>
                                </div>
                            </div>
                            <div class="emp-list-card-nameband">
                                <span class="emp-list-card-name">${mThis._escapeHtml(d.name || "_")}</span>
                            </div>
                            <div class="emp-list-card-body">
                                <ul class="emp-list-card-details">
                                    ${mThis._employeeCardDetail("fa-solid fa-hashtag", d.code)}
                                    ${mThis._employeeCardDetail("fa-regular fa-calendar", d.date_of_birth)}
                                    ${mThis._employeeCardDetail("fa-solid fa-phone", d.phone_number)}
                                    ${mThis._employeeCardDetail("fa-solid fa-at", d.email)}
                                </ul>
                            </div>
                            <footer class="emp-list-card-footer">
                                <span class="emp-list-card-footer-meta">
                                    <span vslang="titles.Last Updated">Last Updated</span>:
                                    ${mThis._escapeHtml(updatedBy)}
                                </span>
                                <a href="javascript:void(0)" class="emp-list-card-footer-link see-employee-detail" data-id="${d.id}">
                                    <span vslang="titles.View Details">View Details</span>
                                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                </a>
                            </footer>
                        </article>
                    </div>`;

                cmt++;
            });
        }

        if (cmt === 0) {
            html = `<div class="emp-list-empty">${LocaleManager.trans("Employee not found!", "titles")}</div>`;
        } else {
            html += `</div>`;
        }

        container.innerHTML = html;
        LocaleManager.translateZone(container);

        const seeProfileInfo = container.querySelectorAll(".see-employee-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const employeeId = e.currentTarget.dataset.id;
                mThis.employee_id = employeeId;
                mThis.showPage("profile_view", { id: employeeId });
            });
        });
    };

    mThis.renderProfilePlaceholderCard = (container) => {
        if (!container) return;
        container.innerHTML = `
            <div class="emp-skill-card h-100">
                <div class="emp-skill-header">
                    <div class="emp-skill-header-title">
                        <span class="emp-skill-header-icon">
                            <i class="fa-solid fa-briefcase"></i>
                        </span>
                        <span class="emp-skill-header-label" vslang="titles.Experience">Experience</span>
                    </div>
                </div>
                <div class="emp-skill-body">
                    <div class="emp-skill-empty">
                        <i class="fa-solid fa-briefcase emp-skill-empty-icon"></i>
                        <span class="emp-skill-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
                    </div>
                </div>
            </div>`;
        LocaleManager.translateZone(container);
    };

    mThis.renderProfile = (data) => {
        if (!mThis.profile_info_emp || !data) return;

        mThis.currentEmployeeProfile = data;
        mThis.employee_id = data.id;

        const defaultPhoto = `${main_view.base_url}/assets/images/default/default-staff.png`;
        const hasPhoto = !!data.image_url;
        const imageUrl = hasPhoto ? data.image_url : defaultPhoto;
        const photoWrapClass = hasPhoto ? "" : " is-empty";

        const addressText = data.address || "";
        const addressTitle = addressText
            ? ` title="${mThis._escapeHtml(addressText)}"`
            : "";

        const html = `
            <div class="emp-profile-wrap">
                <section class="emp-personal">
                    <div class="emp-personal-header d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <h5 class="emp-personal-title">
                                <span class="emp-personal-title-icon">
                                    <i class="fa fa-user"></i>
                                </span>

                                <span class="emp-personal-info">
                                    <span class="text-prm-custom fw-semibold emp-personal-name">${data.name}</span>
                                    <span class="text-muted emp-personal-sex">
                                        ${mThis._sexLabel(data.sex)}
                                    </span>
                                </span>
                            </h5>
                        </div>
                      <div class="d-inline-flex align-items-center gap-2 group_action_movement">
                        <button type="button" class="btn btn-warning btn-sm edit_emp_profile_info" data-id="${data.id}" data-status="${data.status_id}" title="Edit">
                            <i class="fa-regular fa-pen-to-square text-white fs-5 ps-2"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm delete_employee" data-id="${data.id}" data-status="${data.status_id}" title="Delete">
                            <i class="fa-regular fa-trash-can fs-5 ps-2"></i>
                        </button>

                        <button type="button"
                            class="btn btn-primary btn-sm movement"
                            data-id="${data.id}"
                            data-status="${data.status_id}"
                            title="Movement">
                            <i class="fa-solid fa-right-left fs-5 ps-2"></i>
                        </button>

                        <button type="button"
                            class="btn btn-success btn-sm movement_detail"
                            data-id="${data.id}"
                            data-status="${data.status_id}"
                            title="Movement Detail">
                            <i class="fa-regular fa-address-book fs-5 ps-2"></i>
                        </button>

                        <button type="button"
                            class="btn btn-info btn-sm set_resign"
                            data-id="${data.id}"
                            data-status="${data.status_id}"
                            title="Set Resign">
                            <i class="fa-brands fa-r-project fs-5 ps-2"></i>
                        </button>

                       

                    </div>
                    </div>

                    <div class="emp-profile-groups">
                        <div class="emp-profile-group">
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Code", "labels"), data.code)}
                                ${mThis._profileLine(LocaleManager.trans("Date of Birth", "labels"), data.date_of_birth)}
                                ${mThis._profileLine(LocaleManager.trans("Phone Number", "labels"), data.phone_number)}
                                ${mThis._profileLine(LocaleManager.trans("Email", "labels"), data.email)}
                                ${mThis._profileLine(LocaleManager.trans("Nationality", "labels"), data.nationality)}
                                ${mThis._profileLine(LocaleManager.trans("ID Card", "labels"), data.nid)}
                                <div class="emp-profile-field emp-profile-field-full">
                                    ${mThis._profileLine(LocaleManager.trans("Address", "labels"), data.address)}
                                </div>
                            </div>
                           
                        </div>
                        <div class="emp-profile-group">
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Position", "labels"), data.position)}
                                ${mThis._profileLine(LocaleManager.trans("Salary", "labels"), mThis._formatSalary(data.salary, data.currency_code))}
                                ${mThis._profileLine(LocaleManager.trans("Type", "labels"), data.type)}
                                ${mThis._profileLine(LocaleManager.trans("Work Shift", "labels"), data.work_shift)}
                                ${mThis._profileLine(LocaleManager.trans("Joining Date", "labels"), data.joining_date)}
                                ${mThis._profileLine(LocaleManager.trans("Apply Tax", "labels"), data.apply_payroll_tax)}
                                <div class="emp-profile-field emp-profile-field-full">
                                    ${mThis._profileLine(LocaleManager.trans("Place of Birth", "labels"), data.city_name)}
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </section>
            </div>
        `;

        mThis.profile_info_emp.innerHTML = html;
        LocaleManager.translateZone(mThis.profile_info_emp);

        if (data.status_id == 20 || data.status_id == 30) {
            const hideEls = mThis.profile_info_emp.querySelectorAll(
                ".movement, .movement_detail, .set_resign, .edit_emp_profile_info, .delete_employee, .group_action_movement"
            );
            hideEls.forEach((el) => {
                el.style.display = "none";
            });
        }

        if (mThis.profile_cards_emp) {
            const cardColClass = "col-12 col-lg-4";
            mThis.profile_cards_emp.innerHTML = "";
            const skillCol = document.createElement("div");
            skillCol.className = cardColClass;
            const eduCol = document.createElement("div");
            eduCol.className = cardColClass;
            const thirdCol = document.createElement("div");
            thirdCol.className = cardColClass;
            const docCol = document.createElement("div");
            docCol.className = cardColClass;
            const taxAllowanceCol = document.createElement("div");
            taxAllowanceCol.className = cardColClass;
            mThis.profile_cards_emp.appendChild(skillCol);
            mThis.profile_cards_emp.appendChild(eduCol);
            mThis.profile_cards_emp.appendChild(thirdCol);
            mThis.profile_cards_emp.appendChild(docCol);
            mThis.profile_cards_emp.appendChild(taxAllowanceCol);
            const refreshProfile = (empId) =>
                mThis.showPage("profile_view", { id: empId });
            EmployeeSkillComponent.render(skillCol,data.skills || [],data.id,refreshProfile);
            EmployeeEducationComponent.render(
                eduCol,
                data.educations || [],
                data.id,
                refreshProfile,
            );
            EmployeeExperienceComponent.render(
                thirdCol,
                data.experiences || [],
                data.id,
                refreshProfile,
            );
            EmployeeDocumentComponent.render(
                docCol,
                data.documents || [],
                data.id,
                refreshProfile,
            );
            TaxAllowanceComponent.render(
                taxAllowanceCol,
                data.tax_allowances || [],
                data.id,
                refreshProfile,
            );
        }
    };

    mThis.setActionsProfileInfo = (divProfile) => {
        if (!divProfile || divProfile._profileActionsBound) return;
        divProfile._profileActionsBound = true;

        divProfile.addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".edit_emp_profile_info");
            if (btn) {
                mThis.editEmployee(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".delete_employee");
            if (btn) {
                mThis.deleteEmployee(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".set_resign");
            if (btn) {
                mThis.setResign(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".movement");
            if (btn) {
                mThis.movement(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".movement_detail");
            if (btn) {
                mThis.movementDetail(btn.dataset.id, btn);
                return;
            }
        });
    };

    mThis.editEmployee = (id, menuLink) => {
        EmployeeDialog.show({
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.showPage("profile_view", { id: id });
            },
        });
    };

    mThis.movement = (id, menuLink) => {
        if (typeof ProfileMovementDialog === "undefined") return;
        ProfileMovementDialog.show({
            id: null,
            emp_id: id,
            employee: mThis.currentEmployeeProfile || null,
            btn: menuLink,
            onClose: () => {
                mThis.showPage("profile_view", { id: id });
            },
        });
    };

    mThis.movementDetail = (id, menuLink) => {
        if (typeof EmployeeMovementHistoryDialog === "undefined") return;
        EmployeeMovementHistoryDialog.show({
            emp_id: id,
            employee: mThis.currentEmployeeProfile || null,
            btn: menuLink,
        });
    };

    mThis.setResign = (id, menuLink) => {
        if (typeof ProfileResignDialog === "undefined") return;
        ProfileResignDialog.show({
            emp_id: id,
            employee: mThis.currentEmployeeProfile || null,
            btn: menuLink,
            onClose: () => {
                mThis.showPage("employee_list", mThis.getFilterData());
            },
        });
    };

    mThis.deleteEmployee = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.showPage("employee_list", mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(...)) return;
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
                            `${main_view.base_url}/mhr/employee/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_employee");
                                mThis.showPage("employee_list", mThis.getFilterData());
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

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/employee/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elEmployeeStatus,
                    d.status,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Statuses", "titles"),
                    ""
                );
                VSUtil.setComboItems(
                    mThis.elEmployeeType,
                    d.types,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Types", "titles"),
                    ""
                );
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
                const employeeId = op.id || op.employee_id || op.emp_id || op;
                mThis.employee_id = employeeId;
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

        if (pageName === "profile_view") {
            mThis.initProfileScroll();
        }
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

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-4">
                            <div class="col-12 col-md-3">
                                <div style="height:180px;" class="data-input border border-secondary rounded-3 justify-content-center align-items-center">
                                    <div name="div_emp_photo" data-field="photo" class="h-100"></div>
                                </div>
                            </div>
                            <div class="col-12 col-md-9 pt-3">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="name" class="form-control data-input" data-field="name" placeholder=" " required />
                                            <label vslang="titles.Full Name"></label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="name_kh" class="form-control data-input" data-field="name_kh" placeholder=" " required />
                                            <label vslang="titles.Full Name (KH)"></label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <select data-style="material" name="sex" class="form-control data-input" data-field="sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <select data-style="material" name="nationality_id" class="form-control data-input" placeholder="${LocaleManager.trans("Nationality", "labels")}" data-field="nationality_id" required></select>
                                    </div>
                                    <div class="col-md-4">
                                        <select data-style="material" name="marital_status" class="form-control data-input" data-field="marital_status" placeholder="${LocaleManager.trans("Marital Status", "labels")}">
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="vs-material-field">
                                            <input data-type="date" name="date_of_birth" class="form-control data-input" data-field="date_of_birth" required />
                                            <label vslang="titles.Date of Birth"></label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="vs-material-field">
                                            <input type="text" name="nid" class="form-control data-input" data-field="nid" placeholder=" " required />
                                            <label vslang="labels.ID Card"></label>
                                        </div>
                                    </div>
                                     <div class="col-md-4">
                                        <div class="vs-material-field">
                                            <input data-type="date" name="nid_expiry_date" class="form-control data-input" data-field="nid_expiry_date" placeholder=" " required />
                                            <label vslang="labels.ID Card Expiry"></label>
                                        </div>
                                    </div>
                                    
                                  
                                </div>
                            </div>
                           
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="nssf_id" class="form-control data-input" data-field="nssf_id" placeholder=" " required />
                                    <label vslang="labels.NSSF ID"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input type="text" name="passport_number" class="form-control data-input" data-field="passport_number" placeholder=" " required />
                                    <label vslang="labels.Passport Number"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input data-type="date" name="passport_expiry_date" class="form-control data-input" data-field="passport_expiry_date" required />
                                    <label vslang="labels.Passport Expiry"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="phone_number" class="form-control data-input" data-field="phone_number" placeholder=" " required />
                                    <label vslang="labels.Phone Number"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="email" name="email" class="form-control data-input" data-field="email" placeholder=" " required />
                                    <label vslang="labels.Email"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <select data-style="material" name="position_id" class="form-control data-input" placeholder="${LocaleManager.trans("Position", "labels")}" data-field="position_id" required></select>
                            </div>  
                            <div class="col-md-3">
                                <select data-style="material" name="emp_type_id" class="form-control data-input" placeholder="${LocaleManager.trans("Type", "labels")}" data-field="emp_type_id" required></select>
                            </div>
                             
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input type="number" name="salary" class="form-control data-input" data-field="salary" placeholder=" " required />
                                    <label vslang="titles.Salary"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <select data-style="material" name="birth_city_id" class="form-control data-input" placeholder="${LocaleManager.trans("Place of Birth", "labels")}" data-field="birth_city_id" required></select>
                            </div>
                            <div class="col-md-6">
                                <select data-style="material" name="work_shift_id" class="form-control data-input" placeholder="${LocaleManager.trans("Work Shift", "labels")}" data-field="work_shift_id" required></select>
                            </div>
                            <div class="col-md-6">
                                <select data-style="material" name="apply_payroll_tax" class="form-control data-input" placeholder="${LocaleManager.trans("Apply Tax", "labels")}" data-field="apply_payroll_tax" required></select>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="joining_date" class="form-control data-input" placeholder=" " data-field="joining_date" required />
                                    <label vslang="labels.Joining Date"></label>
                                </div>
                            </div>
                            <div class="col-md-3 d-none">
                                <div class="vs-material-field">
                                    <input type="text" name="spouse_name" class="form-control data-input" data-field="spouse_name" placeholder=" " required />
                                    <label vslang="labels.Spouse Name"></label>
                                </div>
                            </div>
                            <div class="col-md-3 d-none">
                                <div class="vs-material-field">
                                    <input type="text" name="spouse_occ_code" class="form-control data-input" data-field="spouse_occ_code" placeholder=" " required />
                                    <label vslang="labels.Spouse Occupation"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea type="text" name="address" class="form-control data-input" data-field="address" placeholder=" "></textarea>
                                    <label vslang="labels.Address"></label>
                                </div>
                            </div>
                            
                            <div class="col-md-6 d-none">
                                <select data-style="material" name="spouse_emp_id" class="form-control data-input" placeholder="${LocaleManager.trans('Spouse Employee','labels')}" data-field="spouse_emp_id" required></select>
                            </div>
                            
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const div_emp_photo = me.controls.div_emp_photo;

                    me.empImageBox = new ImageBox(div_emp_photo, {
                        defaultPhotoName: "default-staff",
                        containerClass: "emp-profile-container",
                        imgClass: "data-input",
                        dataset: {
                            field: "photo",
                        },
                    });
                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "nationality",
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
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "apply_payroll_tax",
                        data: "payroll_taxes",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "work_shift_id",
                        data: "work_shifts",
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
                            p.photo = me.empImageBox ? me.empImageBox.getImage() : "";

                            if (!p.id) {
                                p.branch_id = main_view.branch_id;
                                p.status_id = p.status_id || 10;
                            }

                            vsapi.call([main_view.base_url, "/mhr/employee/save"].join(""), p, {loader: false,agent :btn})
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_employee");
                                        } else {
                                            cv_interact.success("create_success_employee");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Employee",
                    modifyTitle: "vslang:titles.Modify Employee",
                    targetProp: "employee",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const emp = data?.employee;
                    const isEdit = Number(me.dataOptions.id) > 0;

                    if (me.empImageBox) {
                        me.empImageBox.setImage(emp?.image_url || null);
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
            });

        dialog.show(op);
    };

    return self;
})();
//end:: EmployeeDialog

const ProfileResignDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(LocaleManager.trans("Employee is required", "message_box_default"));
            return;
        }
        op.emp_id = op.emp_id || op.employee.id;

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="resign_date" class="form-control data-input" data-field="resign_date" placeholder=" " required />
                                    <label vslang="titles.Resign Date"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="effective_date" class="form-control data-input" placeholder=" " data-field="effective_date" required />
                                    <label vslang="titles.Effective Date"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                },
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

                            p.emp_id =
                                me.dataOptions.emp_id ||
                                me.dataOptions.employee?.id ||
                                p.emp_id;

                            if (!p.resign_date) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "Resign Date is required",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }
                            if (!p.effective_date) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "Effective Date is required",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/employee/resign"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose(p);
                                        }
                                        cv_interact.success(
                                            LocaleManager.trans(
                                                "Employee resigned successfully",
                                                "message_box_default",
                                            ),
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Set Resign",
                    modifyTitle: "vslang:titles.Set Resign",
                },

                onPrepareForm: (me, data) => {
                    const emp = me.dataOptions.employee || {};
                    if (me.controls.emp_id) {
                        me.controls.emp_id.value = me.dataOptions.emp_id || emp.id || "";
                    }
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ProfileResignDialog

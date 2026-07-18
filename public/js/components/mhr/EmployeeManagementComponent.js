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
    mThis.profileCardsEmployee = mThis.divProfileView.querySelector("#profile_cards_employee");
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

    mThis.initProfileScroll = () => {
        const scrollEl = mThis.divProfileView;
        if (!scrollEl) return;

        const setHeight = () => {
            scrollEl.style.maxHeight = window.innerHeight - 20 + "px";
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

        container.querySelectorAll(".see-employee-detail").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const employeeId = e.currentTarget.dataset.id;
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
        if (!mThis.profileInfoEmployee || !data) return;

        mThis.currentEmployeeProfile = data;

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
                <section class="emp-hero">
                    <div class="emp-hero-top">
                        <div class="emp-hero-identity">
                            <div class="emp-avatar-wrap${photoWrapClass}">
                                <img src="${imageUrl}" class="emp-avatar" alt="${mThis._escapeHtml(data.name)}"
                                    onerror="this.style.display='none';this.parentElement.classList.add('is-empty');">
                                <span class="emp-avatar-placeholder"><i class="fa-solid fa-user"></i></span>
                            </div>
                            <div class="emp-hero-info">
                                <div class="emp-hero-name-block">
                                    <div class="emp-hero-name-row">
                                        <h2 class="emp-hero-name text-capitalize">${mThis._escapeHtml(data.name ?? "_")}</h2>
                                        <span class="emp-status-badge ${mThis._statusBadgeClass(data.status)}">${mThis._escapeHtml(data.status ?? "Active")}</span>
                                    </div>
                                    <div class="emp-hero-social">
                                        <a href="javascript:void(0)" class="emp-social-btn emp-social-btn--facebook" title="Facebook" aria-label="Facebook">
                                            <i class="fa-brands fa-facebook-f"></i>
                                        </a>
                                        <a href="javascript:void(0)" class="emp-social-btn emp-social-btn--linkedin" title="LinkedIn" aria-label="LinkedIn">
                                            <i class="fa-brands fa-linkedin-in"></i>
                                        </a>
                                        <a href="${
                                            data.phone_number
                                                ? `https://t.me/${mThis._escapeHtml(String(data.phone_number).replace(/[^0-9+]/g, ""))}`
                                                : "javascript:void(0)"
                                        }" class="emp-social-btn emp-social-btn--telegram" title="Telegram" aria-label="Telegram"${data.phone_number ? ' target="_blank" rel="noopener noreferrer"' : ""}>
                                            <i class="fa-brands fa-telegram-plane"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="emp-hero-stats">
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-id-card"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Employee ID", "labels")}</div>
                                <div class="emp-stat-value">${mThis._escapeHtml(data.code ?? "_")}</div>
                            </div>
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-briefcase"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Position", "labels")}</div>
                                <div class="emp-stat-value text-capitalize">${mThis._escapeHtml(data.position ?? "_")}</div>
                            </div>
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-user-tag"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Staff Type", "labels")}</div>
                                <div class="emp-stat-value text-capitalize">${mThis._escapeHtml(data.type ?? "_")}</div>
                            </div>
                        </div>
                    </div>
                    <div class="emp-hero-contact row g-3">
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100">
                                <span class="emp-contact-icon"><i class="fa fa-phone"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Phone Number", "labels")}</span>
                                    <span class="emp-contact-value">${mThis._pillText(data.phone_number)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100">
                                <span class="emp-contact-icon"><i class="fa fa-envelope"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Email", "labels")}</span>
                                    <span class="emp-contact-value">${mThis._pillText(data.email)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100"${addressTitle}>
                                <span class="emp-contact-icon"><i class="fa fa-location-dot"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Address", "labels")}</span>
                                    <span class="emp-contact-value text-capitalize">${mThis._pillText(addressText)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="emp-personal">
                    <div class="emp-personal-header d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <h5 class="emp-personal-title">
                                <span class="emp-personal-title-icon"><i class="fa fa-user"></i></span>
                                <span>${LocaleManager.trans("Personal Information", "titles")}</span>
                            </h5>
                            <p class="emp-personal-subtitle">${LocaleManager.trans("Employee details and work information", "labels")}</p>
                        </div>
                        <div class="d-inline-flex align-items-center gap-2">
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-movement d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_movement" title="Movement" aria-label="Movement">
                                <i class="fa-solid fa-right-left"></i>
                            </button>
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-movement-detail d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_movement_detail" title="Detail Movement" aria-label="Detail Movement">
                                <i class="fa-solid fa-clock-rotate-left"></i>
                            </button>
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-resign d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_resign" title="Set Resign" aria-label="Set Resign">
                                <i class="fa-solid fa-user-xmark"></i>
                            </button>
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-delete d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_delete" title="Delete" aria-label="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-edit d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_edit" title="Edit" aria-label="Edit">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </div>

                    <div class="emp-profile-groups">
                        <div class="emp-profile-group">
                            <h6 class="emp-profile-group-title">${LocaleManager.trans("Personal", "titles")}</h6>
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Name", "labels"), data.name)}
                                ${mThis._profileLine(LocaleManager.trans("Sex", "labels"), mThis._sexLabel(data.sex))}
                                ${mThis._profileLine(LocaleManager.trans("Nationality", "labels"), data.nationality)}
                                ${mThis._profileLine(LocaleManager.trans("Date Of Birth", "labels"), data.date_of_birth)}
                                ${mThis._profileLine(LocaleManager.trans("Phone Number", "labels"), data.phone_number)}
                                ${mThis._profileLine(LocaleManager.trans("Email", "labels"), data.email)}
                            </div>
                        </div>
                        <div class="emp-profile-group">
                            <h6 class="emp-profile-group-title">${LocaleManager.trans("Work", "titles")}</h6>
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Staff Type", "labels"), data.type, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Position", "labels"), data.position, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Joining Date", "labels"), data.joining_date, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Salary", "labels"), mThis._formatSalary(data.salary, data.currency_code))}
                                ${mThis._profileLine(LocaleManager.trans("Identity Card", "labels"), data.nid)}
                                ${mThis._profileLine(LocaleManager.trans("Address", "labels"), data.address, { gold: true, capitalize: true })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        mThis.profileInfoEmployee.innerHTML = html;
        LocaleManager.translateZone(mThis.profileInfoEmployee);
        mThis.setProfileActions(data);
        if (mThis.profileCardsEmployee) {
            const cardColClass = "col-12 col-lg-4";
            mThis.profileCardsEmployee.innerHTML = "";
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
            mThis.profileCardsEmployee.appendChild(skillCol);
            mThis.profileCardsEmployee.appendChild(eduCol);
            mThis.profileCardsEmployee.appendChild(thirdCol);
            mThis.profileCardsEmployee.appendChild(docCol);
            mThis.profileCardsEmployee.appendChild(taxAllowanceCol);
            const refreshProfile = (empId) =>
                mThis.showPage("profile_view", { id: empId });
            EmployeeSkillComponent.render(
                skillCol,
                data.skills || [],
                data.id,
                refreshProfile,
            );
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

        const inlineMovementBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_movement");
        if (inlineMovementBtn) {
            inlineMovementBtn.onclick = (e) => {
                e.preventDefault();
                if (typeof ProfileMovementDialog === "undefined") return;
                ProfileMovementDialog.show({
                    id: null,
                    emp_id: mThis.currentEmployeeId,
                    employee: mThis.currentEmployeeProfile || null,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.showPage("profile_view", { id: mThis.currentEmployeeId });
                    },
                });
            };
        }

        const inlineMovementDetailBtn = mThis.profileInfoEmployee.querySelector(
            "#_emp_profile_btn_movement_detail",
        );
        if (inlineMovementDetailBtn) {
            inlineMovementDetailBtn.onclick = (e) => {
                e.preventDefault();
                if (typeof EmployeeMovementHistoryDialog === "undefined") return;
                EmployeeMovementHistoryDialog.show({
                    emp_id: mThis.currentEmployeeId,
                    employee: mThis.currentEmployeeProfile || null,
                    btn: e.currentTarget,
                });
            };
        }

        const inlineResignBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_resign");
        if (inlineResignBtn) {
            inlineResignBtn.onclick = (e) => {
                e.preventDefault();
                if (typeof ProfileResignDialog === "undefined") return;
                ProfileResignDialog.show({
                    emp_id: mThis.currentEmployeeId,
                    employee: mThis.currentEmployeeProfile || null,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.showPage("employee_list", mThis.getFilterData());
                    },
                });
            };
        }

        const inlineDeleteBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_delete");
        if (inlineDeleteBtn) {
            inlineDeleteBtn.onclick = (e) => {
                e.preventDefault();
                mThis.deleteEmployee(mThis.currentEmployeeId, e.currentTarget);
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

    const materialField = (name, dataField, label, opts = {}) => {
        const typeAttr = opts.date ? ' data-type="date"' : opts.type ? ` type="${opts.type}"` : ' type="text"';
        const required = opts.required ? " required" : "";
        return `
            <div class="vs-material-field">
                <input${typeAttr} name="${name}" class="form-control data-input" data-field="${dataField}" placeholder=" "${required} />
                <label>${label}</label>
            </div>`;
    };

    const sectionTitle = (text) =>
        `<div class="col-12"><div class="fw-semibold mb-1">${text}</div></div>`;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-md-3">
                                <div id="_emp_dialog_photo" class="emp-dialog-photo-wrap d-flex align-items-center justify-content-center"></div>
                            </div>
                            <div class="col-md-9">
                                <div class="row g-3">
                                    <div class="col-12">
                                        ${materialField("name", "name", "Full Name", { required: true })}
                                    </div>
                                    <div class="col-md-6">
                                        ${materialField("name_kh", "name_kh", "Khmer Name", { required: true })}
                                    </div>
                                    <div class="col-md-6">
                                        ${materialField("date_of_birth", "date_of_birth", "Date of Birth", { date: true, required: true })}
                                    </div>
                                    <div class="col-md-6">
                                        <select data-style="material" name="sex" class="form-control data-input" data-field="sex" placeholder="Sex" required>
                                            <option value="">Select</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <select data-style="material" name="marital_status" class="form-control data-input" data-field="marital_status" placeholder="Marital Status" required>
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            ${sectionTitle("Identification")}
                            <div class="col-md-4">
                                <select data-style="material" name="nationality_id" class="form-control data-input" data-field="nationality_id" placeholder="Nationality" required></select>
                            </div>
                            <div class="col-md-4">
                                ${materialField("nid", "nid", "Identity Card", { required: true })}
                            </div>
                            <div class="col-md-4">
                                ${materialField("nid_expiry_date", "nid_expiry_date", "Identity Card Expiry", { date: true, required: true })}
                            </div>
                            <div class="col-md-4">
                                ${materialField("nssf_id", "nssf_id", "NSSF ID")}
                            </div>
                            <div class="col-md-4">
                                ${materialField("passport_number", "passport_number", "Passport Number")}
                            </div>
                            <div class="col-md-4">
                                ${materialField("passport_expiry_date", "passport_expiry_date", "Passport Expiry", { date: true })}
                            </div>

                            ${sectionTitle("Employment & Contact")}
                            <div class="col-md-4">
                                <select data-style="material" name="birth_city_id" class="form-control data-input" data-field="birth_city_id" placeholder="Place of Birth"></select>
                            </div>
                            <div class="col-md-4">
                                <select data-style="material" name="emp_type_id" class="form-control data-input" data-field="emp_type_id" placeholder="Employee Type" required></select>
                            </div>
                            <div class="col-md-4">
                                <select data-style="material" name="position_id" class="form-control data-input" data-field="position_id" placeholder="Position" required></select>
                            </div>
                            <div class="col-md-4">
                                ${materialField("phone_number", "phone_number", "Phone", { required: true })}
                            </div>
                            <div class="col-md-4">
                                ${materialField("email", "email", "Email", { type: "email", required: true })}
                            </div>
                            <div class="col-md-4">
                                ${materialField("salary", "salary", "Salary", { type: "number" })}
                            </div>
                            <div class="col-md-4">
                                ${materialField("joining_date", "joining_date", "Joining Date", { date: true, required: true })}
                            </div>
                            <div class="col-md-8">
                                ${materialField("address", "address", "Address", { required: true })}
                            </div>

                            ${sectionTitle("Family & Payroll")}
                            <div class="col-md-4">
                                ${materialField("spouse_name", "spouse_name", "Spouse Name")}
                            </div>
                            <div class="col-md-4">
                                ${materialField("spouse_occ_code", "spouse_occ_code", "Spouse Occupation")}
                            </div>
                            <div class="col-md-4">
                                <select data-style="material" name="spouse_emp_id" class="form-control data-input" data-field="spouse_emp_id" placeholder="Spouse Employee"></select>
                            </div>
                            <div class="col-md-4">
                                <select data-style="material" name="apply_payroll_tax" class="form-control data-input" data-field="apply_payroll_tax" placeholder="Apply Payroll Tax" required></select>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const photoEl = me.self.querySelector("#_emp_dialog_photo");
                    if (photoEl && !me.controls._empPhotoBox) {
                        me.controls._empPhotoBox = new ImageBox(photoEl, {
                            dataset: { field: "photo" },
                            cssClass: "data-input",
                            defaultPhotoName: "default-staff",
                        });
                    }
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
                    createTitle: "vslang:titles.Add Employee",
                    modifyTitle: "vslang:titles.Modify Employee",
                    targetProp: "employee",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/form-options",
                        ].join(""),
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
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
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
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/save",
                                    ].join(""),
                                    op,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
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
                cssClass: "modal-md vs-modal resign-dialog",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                    <div class="resign-dialog-body">
                        <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />

                        <div class="mb-3">
                            <label class="form-label resign-field-label">
                                Resign Date <span class="text-danger">*</span>
                            </label>
                            <input type="text" data-type="date" name="resign_date"
                                class="form-control data-input resign-field-input"
                                data-field="resign_date" placeholder="dd-MM-yyyy" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label resign-field-label">
                                Effective Date <span class="text-danger">*</span>
                            </label>
                            <input type="text" data-type="date" name="effective_date"
                                class="form-control data-input resign-field-input"
                                data-field="effective_date" placeholder="dd-MM-yyyy" />
                        </div>

                        <div class="mb-1">
                            <label class="form-label resign-field-label">Remarks</label>
                            <textarea name="remarks" rows="4"
                                class="form-control data-input resign-field-input resign-field-remarks"
                                data-field="remarks"></textarea>
                        </div>
                    </div>`;
                },
                contentCreated: (me) => {
                    if (me.controls.resign_date) DateTimePicker.init(me.controls.resign_date);
                    if (me.controls.effective_date) DateTimePicker.init(me.controls.effective_date);

                    const setTitle = () => {
                        const titleEl =
                            me.divModal.querySelector(".modal-title") ||
                            me.divModal.querySelector(".modal-header h5") ||
                            me.divModal.querySelector(".modal-header .modal-title");
                        if (titleEl) titleEl.textContent = "Set Resign";
                    };
                    setTitle();
                    me._setResignTitle = setTitle;
                },
                prepareFormOptions: {
                    createTitle: "Set Resign",
                    modifyTitle: "Set Resign",
                },
                onPrepareForm: (me) => {
                    if (typeof me._setResignTitle === "function") me._setResignTitle();

                    const emp = me.dataOptions.employee || {};
                    if (me.controls.emp_id) {
                        me.controls.emp_id.value = me.dataOptions.emp_id || emp.id || "";
                    }
                    LocaleManager.translateZone(me.divModal);
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
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
                                    `${main_view.base_url}/mhr/employee/resign`,
                                    p,
                                    btn,
                                    null,
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
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
        setTimeout(() => {
            const titleEl = document.querySelector(
                ".resign-dialog .modal-title, .resign-dialog .modal-header h5",
            );
            if (titleEl) titleEl.textContent = "Set Resign";
        }, 0);
    };

    return self;
})();

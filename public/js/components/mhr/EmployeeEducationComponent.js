"use strict";

var EmployeeEducationComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._yearRange = (start, end) => {
        const s = start != null && start !== "" ? String(start) : "";
        const e = end != null && end !== "" ? String(end) : "";
        if (s && e) return `${s} – ${e}`;
        if (s) return s;
        if (e) return e;
        return "";
    };

    mThis._degreeLine = (edu) => {
        const degree = (edu.degree || edu.edu_level || "").trim();
        const major = (edu.major || "").trim();
        if (degree && major) {
            return `${degree} · ${major}`;
        }
        return degree || major || "";
    };

    mThis._schoolLabel = (edu) => {
        const name = (edu.school_name || edu.school || "").trim();
        return name !== "" ? name : "_";
    };

    mThis._bindActions = (container, empId, educationList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_edu_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                EducationDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-edu-action-btn--edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const eduId = btn.dataset.eduId;
                const education = educationList.find(
                    (item) => String(item.id) === String(eduId),
                );
                EducationDialog.show({
                    id: eduId,
                    emp_id: empId,
                    education,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-edu-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const eduId = btn.dataset.eduId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this education?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Education", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/educations/delete`,
                                { id: eduId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, educations, empId, onRefresh) => {
        if (!container) return;

        const educationList = Array.isArray(educations) ? educations : [];

        const rowsHtml = educationList.length
            ? educationList
                  .map((edu, index) => {
                      const years = mThis._yearRange(
                          edu.start_year,
                          edu.end_year,
                      );
                      const degreeLine = mThis._degreeLine(edu);
                      const location = (edu.location || "").trim();

                      return `
                <div class="emp-edu-item" data-edu-id="${edu.id}">
                    <div class="emp-edu-item-card${index === 0 ? "" : " emp-edu-item-card--muted"}">
                        <div class="emp-edu-item-head">
                            <span class="emp-edu-school-icon" aria-hidden="true">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </span>
                            <div class="emp-edu-item-main">
                                <div class="emp-edu-title-row">
                                    <div class="emp-edu-item-left">
                                        <h4 class="emp-edu-school">${mThis._escapeHtml(mThis._schoolLabel(edu))}</h4>
                                        ${
                                            location
                                                ? `<p class="emp-edu-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span class="text-capitalize">${mThis._escapeHtml(location)}</span></p>`
                                                : ""
                                        }
                                    </div>
                                    <div class="emp-edu-item-right">
                                        ${
                                            years
                                                ? `<span class="emp-edu-years">${mThis._escapeHtml(years)}</span>`
                                                : ""
                                        }
                                        ${
                                            degreeLine
                                                ? `<p class="emp-edu-degree">${mThis._escapeHtml(degreeLine)}</p>`
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="emp-edu-item-foot">
                            <button type="button" class="emp-edu-action-btn emp-edu-action-btn--edit" data-edu-id="${edu.id}" title="Edit" aria-label="Edit">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="emp-edu-action-btn emp-edu-action-btn--delete" data-edu-id="${edu.id}" title="Delete" aria-label="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-edu-empty">
                    <i class="fa-solid fa-building-columns emp-edu-empty-icon"></i>
                    <span class="emp-edu-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-edu-card h-100">
                    <div class="emp-edu-header">
                        <div class="emp-edu-header-title">
                            <span class="emp-edu-header-icon">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </span>
                            <span class="emp-edu-header-label" vslang="titles.Education">Education</span>
                        </div>
                        <button type="button" class="emp-edu-add-btn" id="_emp_edu_btn_add" title="Add" aria-label="Add education">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-edu-body">
                        <div class="emp-edu-list${educationList.length ? " emp-edu-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, educationList, onRefresh);
    };

    return mThis;
})();

const EducationDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal emp-edu-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) =>
                    LocaleManager.trans(
                        me.dataOptions.id ? "Modify School" : "New School",
                        "titles",
                    ),
                createContent: () => `
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("School Name", "labels")} <span class="text-danger">*</span></label>
                            <input type="text" name="school_name" class="form-control data-input" data-field="school_name" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Location", "labels")}</label>
                            <input type="text" name="location" class="form-control data-input" data-field="location" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Start Year", "labels")}</label>
                            <input type="number" name="start_year" class="form-control data-input" data-field="start_year" min="1950" max="2100" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("End Year", "labels")}</label>
                            <input type="number" name="end_year" class="form-control data-input" data-field="end_year" min="1950" max="2100" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Degree", "labels")}</label>
                            <input type="text" name="degree" class="form-control data-input" data-field="degree" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Major", "labels")}</label>
                            <input type="text" name="major" class="form-control data-input" data-field="major" />
                        </div>
                    </div>`,
                onPrepareForm: (me) => {
                    const education = me.dataOptions.education;
                    if (!education) return;
                    const fields = [
                        "school_name",
                        "location",
                        "start_year",
                        "end_year",
                        "degree",
                        "major",
                    ];
                    fields.forEach((field) => {
                        if (!me.controls[field]) return;
                        const val = education[field];
                        me.controls[field].value =
                            val !== undefined && val !== null ? val : "";
                    });
                },
                buttons: [
                    {
                        label: LocaleManager.trans("Cancel", "buttons"),
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: LocaleManager.trans("Save", "buttons"),
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/employee/educations/save`,
                                    p,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, p);
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

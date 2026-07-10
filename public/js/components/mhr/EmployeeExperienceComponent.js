"use strict";

var EmployeeExperienceComponent = (function () {
    const mThis = {};

    mThis.ORGANIZATIONS = [
        { id: 1, organization: "Vectorasoft" },
        { id: 2, organization: "APD BANK" },
    ];

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._periodLabel = (exp) => {
        const period =
            exp.period_display ||
            exp.period ||
            "";
        return period !== "" ? period : "";
    };

    mThis._positionLabel = (exp) => {
        const position = (exp.position || "").trim();
        return position !== "" ? position : "";
    };

    mThis._descriptionBullets = (exp) => {
        const desc = (exp.description || "").trim();
        if (!desc) return "";

        const lines = desc
            .split(/\r?\n/)
            .map((line) => line.replace(/^[-•*]\s*/, "").trim())
            .filter(Boolean);

        if (!lines.length) return "";

        const items = lines
            .map((line) => `<li>${mThis._escapeHtml(line)}</li>`)
            .join("");

        return `<ul class="emp-exp-bullets">${items}</ul>`;
    };

    mThis._organizationLabel = (exp) => {
        const org = (exp.organization || "").trim();
        if (org) return org;
        const found = mThis.ORGANIZATIONS.find(
            (item) => String(item.id) === String(exp.organization_id),
        );
        return found ? found.organization : "_";
    };

    mThis._organizationOptionsHtml = (selectedId) => {
        const selected = selectedId != null ? String(selectedId) : "";
        return mThis.ORGANIZATIONS.map((item) => {
            const isSelected =
                selected && selected === String(item.id) ? " selected" : "";
            return `<option value="${item.id}"${isSelected}>${mThis._escapeHtml(item.organization)}</option>`;
        }).join("");
    };

    mThis._bindActions = (container, empId, experienceList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_exp_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                ExperienceDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-exp-action-btn--edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const expId = btn.dataset.expId;
                const experience = experienceList.find(
                    (item) => String(item.id) === String(expId),
                );
                ExperienceDialog.show({
                    id: expId,
                    emp_id: empId,
                    experience,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-exp-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const expId = btn.dataset.expId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this experience?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Experience", "titles"),
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
                                `${main_view.base_url}/mhr/employee/experiences/delete`,
                                { id: expId },
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

    mThis.render = (container, experiences, empId, onRefresh) => {
        if (!container) return;

        const experienceList = Array.isArray(experiences) ? experiences : [];

        const rowsHtml = experienceList.length
            ? experienceList
                  .map((exp, index) => {
                      const period = mThis._periodLabel(exp);
                      const position = mThis._positionLabel(exp);
                      const bullets = mThis._descriptionBullets(exp);

                      return `
                <div class="emp-exp-item" data-exp-id="${exp.id}">
                    <div class="emp-exp-item-card${index === 0 ? "" : " emp-exp-item-card--muted"}">
                        <div class="emp-exp-item-head">
                            <span class="emp-exp-org-icon" aria-hidden="true">
                                <i class="fa-solid fa-briefcase"></i>
                            </span>
                            <div class="emp-exp-item-main">
                                <div class="emp-exp-title-row">
                                    <div class="emp-exp-item-left">
                                        <h4 class="emp-exp-org-name">${mThis._escapeHtml(mThis._organizationLabel(exp))}</h4>
                                        ${
                                            position
                                                ? `<p class="emp-exp-position">${mThis._escapeHtml(position)}</p>`
                                                : ""
                                        }
                                        ${bullets}
                                    </div>
                                    <div class="emp-exp-item-right">
                                        ${
                                            period
                                                ? `<span class="emp-exp-period">${mThis._escapeHtml(period)}</span>`
                                                : ""
                                        }
                                        <div class="emp-exp-actions">
                                            <button type="button" class="emp-exp-action-btn emp-exp-action-btn--edit" data-exp-id="${exp.id}" title="Edit" aria-label="Edit">
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button type="button" class="emp-exp-action-btn emp-exp-action-btn--delete" data-exp-id="${exp.id}" title="Delete" aria-label="Delete">
                                                <i class="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-exp-empty">
                    <i class="fa-solid fa-briefcase emp-exp-empty-icon"></i>
                    <span class="emp-exp-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-exp-card h-100">
                    <div class="emp-exp-header">
                        <div class="emp-exp-header-title">
                            <span class="emp-exp-header-icon">
                                <i class="fa-solid fa-briefcase"></i>
                            </span>
                            <span class="emp-exp-header-label" vslang="titles.Experience">Experience</span>
                        </div>
                        <button type="button" class="emp-exp-add-btn" id="_emp_exp_btn_add" title="Add" aria-label="Add experience">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-exp-body">
                        <div class="emp-exp-list${experienceList.length ? " emp-exp-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, experienceList, onRefresh);
    };

    return mThis;
})();

const ExperienceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal emp-exp-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => `
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Start Date", "labels")}</label>
                            <input data-type="date" type="text" name="start_date" class="form-control data-input" data-field="start_date" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">${LocaleManager.trans("End Date", "labels")}</label>
                            <input data-type="date" type="text" name="end_date" class="form-control data-input" data-field="end_date" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Period (if no dates)", "labels")}</label>
                            <input type="text" name="period" class="form-control data-input" data-field="period" placeholder="e.g. Summer 2022, 2019-2021" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Position", "labels")} <span class="text-danger">*</span></label>
                            <input type="text" name="position" class="form-control data-input" data-field="position" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Organization", "labels")}</label>
                            <select name="organization_id" class="form-control data-input" data-field="organization_id">
                                <option value="">${LocaleManager.trans("Select", "labels")}</option>
                                ${EmployeeExperienceComponent._organizationOptionsHtml()}
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Description", "labels")}</label>
                            <textarea name="description" class="form-control data-input" data-field="description" rows="3"></textarea>
                        </div>
                    </div>`,
                contentCreated: (me) => {
                    if (me.controls.start_date) {
                        DateTimePicker.init(me.controls.start_date);
                    }
                    if (me.controls.end_date) {
                        DateTimePicker.init(me.controls.end_date);
                    }
                },
                onPrepareForm: (me) => {
                    const experience = me.dataOptions.experience || null;
                    if (!experience) return;

                    const fields = [
                        "start_date",
                        "end_date",
                        "period",
                        "position",
                        "organization_id",
                        "description",
                    ];
                    fields.forEach((field) => {
                        if (!me.controls[field]) return;
                        const val = experience[field];
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
                                    `${main_view.base_url}/mhr/employee/experiences/save`,
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

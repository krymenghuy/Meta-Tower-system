"use strict";

var EmployeeSkillComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._iconUrl = () =>
        `${main_view.base_url}/assets/images/default/default-skill.svg`;

    mThis._progressBar = (rate) => {
        const num = Math.max(0, Math.min(100, Number(rate) || 0));
        const display = num.toFixed(2);
        return `
            <div class="emp-skill-col-rate">
                <div class="emp-skill-rate">${display} %</div>
                <div class="emp-skill-progress-track">
                    <div class="emp-skill-progress-fill" style="width:${display}%;"></div>
                </div>
            </div>`;
    };

    mThis._bindActions = (container, empId, skillList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_skill_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                SkillDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-skill-action-btn-edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const skillId = btn.dataset.skillId;
                const skill = skillList.find(
                    (s) => String(s.id) === String(skillId),
                );
                SkillDialog.show({
                    id: skillId,
                    emp_id: empId,
                    skill,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-skill-action-btn-delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const skillId = btn.dataset.skillId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this skill?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Skill", "titles"),
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
                                `${main_view.base_url}/mhr/employee/skills/delete`,
                                { id: skillId },
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

    mThis.render = (container, skills, empId, onRefresh) => {
        if (!container) return;

        const skillList = Array.isArray(skills) ? skills : [];
        const iconUrl = mThis._iconUrl();

        const rowsHtml = skillList.length
            ? skillList
                  .map(
                      (s) => `
                <div class="emp-skill-row d-flex align-items-center justify-content-between gap-2" data-skill-id="${s.id}">
                    <div class="emp-skill-col-name d-flex align-items-center gap-2 min-w-0">
                        <div class="emp-skill-icon">
                            <img src="${iconUrl}" alt="">
                        </div>
                        <span class="emp-skill-name">${mThis._escapeHtml(s.skill_name || s.skill || "_")}</span>
                    </div>
                    ${mThis._progressBar(s.rate)}
                    <div class="emp-skill-col-action d-flex align-items-center gap-1">
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-edit d-inline-flex align-items-center justify-content-center" data-skill-id="${s.id}" title="Edit">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-delete d-inline-flex align-items-center justify-content-center" data-skill-id="${s.id}" title="Delete">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>`,
                  )
                  .join("")
            : `<div class="text-center py-3">
                    <span class="emp-skill-empty-pill">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
            <div class="col-12 col-lg-4">
                <div class="emp-skill-card h-100">
                    <div class="emp-skill-header d-flex align-items-center justify-content-between">
                        <span class="fw-semibold" vslang="titles.Skill">Skill</span>
                        <button type="button" class="emp-skill-add-btn d-inline-flex align-items-center justify-content-center" id="_emp_skill_btn_add" title="Add">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-skill-body">
                        <div class="emp-skill-cols d-flex justify-content-between align-items-center">
                            <span vslang="titles.Skill">Skill</span>
                            <span vslang="labels.Rate">Rate</span>
                            <span vslang="titles.Action">Action</span>
                        </div>
                        ${rowsHtml}
                    </div>
                </div>
            </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, skillList, onRefresh);
    };

    return mThis;
})();

const SkillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal emp-skill-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) =>
                    LocaleManager.trans(
                        me.dataOptions.id ? "Modify Skill" : "Add Skill",
                        "titles",
                    ),
                createContent: () => `
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Skill Name", "labels")} <span class="text-danger">*</span></label>
                            <input type="text" name="skill_name" class="form-control data-input" data-field="skill_name" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Rate", "labels")} (%) <span class="text-danger">*</span></label>
                            <input type="number" name="rate" class="form-control data-input" data-field="rate" min="0" max="100" step="0.01" />
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">${LocaleManager.trans("Description", "labels")}</label>
                            <textarea name="description" class="form-control data-input" data-field="description" rows="3"></textarea>
                        </div>
                    </div>`,
                onPrepareForm: (me) => {
                    const skill = me.dataOptions.skill;
                    if (!skill) return;
                    if (me.controls.skill_name) {
                        me.controls.skill_name.value = skill.skill_name || "";
                    }
                    if (me.controls.rate) {
                        me.controls.rate.value =
                            skill.rate !== undefined && skill.rate !== null
                                ? skill.rate
                                : "";
                    }
                    if (me.controls.description) {
                        me.controls.description.value = skill.description || "";
                    }
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
                                    `${main_view.base_url}/mhr/employee/skills/save`,
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

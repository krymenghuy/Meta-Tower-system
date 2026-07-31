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
        const level =
            num >= 75 ? "high" : num >= 40 ? "mid" : "low";
        return `
            <div class="emp-skill-col-rate">
                <div class="emp-skill-rate-row">
                    <div class="emp-skill-progress-track">
                        <div class="emp-skill-progress-fill emp-skill-progress-fill--${level}" style="width:${display}%;"></div>
                    </div>
                    <span class="emp-skill-rate-badge">${display}%</span>
                </div>
            </div>`;
    };

    mThis._skillOptionsHtml = (skills, selectedId) => {
        const selected = selectedId != null ? String(selectedId) : "";
        const list = Array.isArray(skills) ? skills : [];
        return list
            .map((item) => {
                const isSelected =
                    selected && selected === String(item.id) ? " selected" : "";
                return `<option value="${item.id}"${isSelected}>${mThis._escapeHtml(item.skill_name || item.title || "_")}</option>`;
            })
            .join("");
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
                cv_interact.confirm('confirm_delete',
                    {
                        title: "Delete",
                        context: "delete",
                        confirmButtonText: "Delete",
                    },
                    function (e)  {
                        if (e)
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/skills/delete`,
                                { id: skillId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success('delete_success_skill');
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
                <div class="emp-skill-row" data-skill-id="${s.id}">
                    <div class="emp-skill-col-name">
                        <div class="emp-skill-icon">
                            <img src="${iconUrl}" alt="">
                        </div>
                        <span class="emp-skill-name">${mThis._escapeHtml(s.skill_name || s.title || s.skill || "_")}</span>
                    </div>
                    ${mThis._progressBar(s.rate)}
                    <div class="emp-skill-col-action">
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-edit" data-skill-id="${s.id}" title="Edit" aria-label="Edit">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-delete" data-skill-id="${s.id}" title="Delete" aria-label="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>`,
                  )
                  .join("")
            : `<div class="emp-skill-empty">
                    <i class="fa-solid fa-graduation-cap emp-skill-empty-icon"></i>
                    <span class="emp-skill-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-skill-card">
                    <div class="emp-skill-header">
                        <div class="emp-skill-header-title">
                            <span class="emp-skill-header-icon">
                                <i class="fa-solid fa-lightbulb"></i>
                            </span>
                            <span class="emp-skill-header-label" vslang="titles.Skills">Skills</span>
                        </div>
                        <button type="button" class="emp-skill-add-btn" id="_emp_skill_btn_add" title="Add" aria-label="Add skill">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-skill-body">
                        <div class="emp-skill-cols">
                            <span vslang="titles.Skills">Skills</span>
                            <span vslang="titles.Rating">Rating</span>
                            <span vslang="titles.Action">Action</span>
                        </div>
                        <div class="emp-skill-list">
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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => `
                <div class="row g-3">
                    <div class="col-6">
                        <select data-style="material" name="skill_id" class="form-control data-input" data-field="skill_id" placeholder="${LocaleManager.trans("Skill Name", "labels")}"></select>
                    </div>
                    <div class="col-6">
                        <div class="vs-material-field">
                            <input type="number" name="rate" class="form-control data-input" data-field="rate" min="0" max="100" step="0.01" />
                            <label vslang="labels.Rate"></label>
                        </div>
                    </div>
                </div>`,
                contentCreated: (me) => {
                   
                },
                configSelect: [
                    {
                        name: "skill_id",
                        data: "skills",
                        textField: "skill_name",
                        valueField: "id",
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
                                    if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_skill");
                                        } else {
                                            cv_interact.success("create_success_skill");
                                        }
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Skill",
                    modifyTitle: "vslang:titles.Edit Skill",
                    targetProp: "skill",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/skills/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
    };

    return self;
})();
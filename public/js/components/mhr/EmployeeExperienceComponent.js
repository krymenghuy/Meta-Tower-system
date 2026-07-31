"use strict";

var EmployeeExperienceComponent = (function () {
    const mThis = {};

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
        const position = (exp.position || exp.position_name || "").trim();
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
        return org !== "" ? org : "_";
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
                ExperienceDialog.show({
                    id: btn.dataset.expId,
                    emp_id: empId,
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
                <div class="emp-exp-card">
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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input data-type="date" type="text" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" " />
                                    <label vslang="labels.Start Date"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input data-type="date" type="text" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" " />
                                    <label vslang="labels.End Date"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="period" class="data-input form-control" data-field="period" placeholder=" " />
                                    <label vslang="labels.Period (if no dates)"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="organization" class="form-control data-input" placeholder="${LocaleManager.trans("Organization", "labels")}"  data-field="organization_id"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="position" class="form-control data-input" placeholder="${LocaleManager.trans("Position", "labels")}" data-field="position_id"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" rows="3" placeholder=" "></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "organization",
                        data: "organizations",
                        textField: "organization",
                        valueField: "id",
                    },
                    {
                        name: "position",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                ],
                contentCreated: (me) => {
                    if (me.controls.start_date) {
                        DateTimePicker.init(me.controls.start_date);
                    }
                    if (me.controls.end_date) {
                        DateTimePicker.init(me.controls.end_date);
                    }
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            me.hide(false);
                        },
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
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/experiences/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success");
                                        } else {
                                            cv_interact.success("create_success");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Experience",
                    modifyTitle: "vslang:titles.Modify Experience",
                    targetProp: "employee_experiences",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/experiences/form-options",
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

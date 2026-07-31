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
        const level = (edu.edu_level || edu.degree || "").trim();
        const major = (edu.major || "").trim();
        const diploma = (edu.diploma || "").trim();
        const parts = [level, major, diploma].filter(Boolean);
        return parts.join(" · ");
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
                EducationDialog.show({
                    id: btn.dataset.eduId,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-edu-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const eduId = btn.dataset.eduId;
                cv_interact.confirm('confirm_delete',
                    {
                        title:"Delete",
                        context: "delete",
                        confirmButtonText:"Delete",
                    },
                    function (e){
                        if (e)
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/educations/delete`,
                                { id: eduId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success('delete_education_success');
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
                          edu.finish_year ?? edu.end_year,
                      );
                      const degreeLine = mThis._degreeLine(edu);
                      const period = (edu.period || "").trim();

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
                                            period
                                                ? `<p class="emp-edu-location"><i class="fa-solid fa-clock" aria-hidden="true"></i><span>${mThis._escapeHtml(period)}</span></p>`
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
                <div class="emp-edu-card">
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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <select data-style="material" name="school" class="form-control data-input" placeholder="${LocaleManager.trans("School", "labels")}" data-field="school_id"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="edu_level" class="form-control data-input" placeholder="${LocaleManager.trans("Education Level", "labels")}" data-field="edu_level_id"></select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="period" class="data-input form-control" data-field="period" placeholder=" " />
                                    <label vslang="labels.Period (if no dates)"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input type="number" name="start_year" class="data-input form-control" data-field="start_year" min="1950" max="2100" placeholder=" " />
                                    <label vslang="labels.Start Year"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="vs-material-field">
                                    <input type="number" name="finish_year" class="data-input form-control" data-field="finish_year" min="1950" max="2100" placeholder=" " />
                                    <label vslang="labels.End Year"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="major" class="data-input form-control" data-field="major" placeholder=" " />
                                    <label vslang="labels.Major"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="diploma" class="data-input form-control" data-field="diploma" placeholder=" " />
                                    <label vslang="labels.Degree"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "school",
                        data: "schools",
                        textField: "school",
                        valueField: "id",
                    },
                    {
                        name: "edu_level",
                        data: "edu_levels",
                        textField: "edu_level",
                        valueField: "id",
                    },
                ],
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
                                        "/mhr/employee/educations/save",
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
                                            cv_interact.success("update_education_success");
                                        } else {
                                            cv_interact.success("create_education_success");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.New Education",
                    modifyTitle: "vslang:titles.Modify Education",
                    targetProp: "education_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/educations/form-options",
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

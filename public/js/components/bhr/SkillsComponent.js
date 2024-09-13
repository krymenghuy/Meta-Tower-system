"use strict";

var SkillsComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_skillsComponent");
    this.self = this.jm[0];
    this.title_prop = "Skills";

    this.init = () => {
        if (mThis.initAlready) return;

        // Select elements
        mThis.btnAdd = mThis.self.querySelector("#btnAdd");
        mThis.SkillsNameInput = mThis.self.querySelector("#searchSkill");
        mThis.div_x_list = mThis.self.querySelector("#_skills_list");

        // Add Skill Button
        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            const op = {
                id: null,
                onClose: () => {
                    mThis.displaySkills(); // Refresh Skills list
                },
            };
            SkillsDialog.show(op);
        };

        // Search Skills Input
        mThis.SkillsNameInput.oninput = () => {
            mThis.displaySkills(mThis.SkillsNameInput.value);
        };

        mThis.initAlready = true;
    };

    // Fetch and display the list of Skills with optional filtering
    this.displaySkills = (searchQuery = "") => {
        vsapi
            .call(`${mThis.base_url}/hr/skills/list`, {}, null)
            .then((res) => {
                mThis.div_x_list.innerHTML = "";
                let d = res.status_code === 200 ? res.data : [];

                // Filter Skills based on search query
                d = d.filter((skill) =>
                    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                let html = "";
                d.forEach((skill) => {
                    html += `
                    <div class="mt-5" style="width:450px; padding-left:4.7%">
                        <div class="d-flex justify-content-between border bg-light p-2" style="border-radius: 100px; width:80%">
                            <div class="text-center">${skill.name}</div>
                            <div>
                                <a class="btn_edit_skill mr-2" data-id="${skill.id}" href="javascript:void(0)">
                                    <i class="fa fa-pencil fs-5"></i>
                                </a>
                                <a class="btn_delete_skill mr-2" data-id="${skill.id}" href="javascript:void(0)">
                                    <i class="fa fa-trash fs-5 text-danger"></i>
                                </a>
                            </div>
                        </div>
                        <div>
                            <img class="mt-2" src="${skill.image_url}" alt="" style="border-radius: 10%; width:380px; height:200px" />
                        </div>
                    </div>
                `;
                });

                mThis.div_x_list.innerHTML = html;

                mThis.div_x_list.onclick = (e) => {
                    e.preventDefault();
                    let btn = VSUtil.closestLimited(
                        e.target,
                        ".btn_edit_skill"
                    );
                    if (btn) {
                        let op = {
                            id: btn.dataset.id,
                            onClose: () => {
                                mThis.displaySkills(); // Refresh skill list
                            },
                        };
                        SkillsDialog.show(op);
                        return;
                    }

                    // Handle delete button click
                    btn = VSUtil.closestLimited(e.target, ".btn_delete_skill");
                    if (btn) {
                        let skillId = btn.dataset.id;
                        if (
                            confirm(
                                "Are you sure you want to delete this Skill?"
                            )
                        ) {
                            vsapi
                                .call(
                                    `${mThis.base_url}/bhr/skills/delete`,
                                    { id: skillId },
                                    btn
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        cv_interact.success(
                                            "Skill deleted successfully"
                                        );
                                        mThis.displaySkills(); // Refresh Skill list
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        }
                        return;
                    }
                };
            });
    };

        this.show = function () {
            mThis.init();
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
            mThis.displaySkills();
            main_view.setTitle(mThis.title_prop);
        };

    const SkillsDialog = (() => {
        const self = {};
        let dialog = null;

        self.show = (op) => {
            // Recreate the dialog every time it is shown to ensure fresh state
            dialog = new GeneralDialog({
                title: op.id ? "Edit Skill" : "Add Skill",
                cssClass: "modal-md vs-modal-dialog",
                createContent: () => {
                    return [
                        `<div class="row">`,
                        `<div class="form-group col-12">
                            <label class="form-label" vslang="titles.Skill name"></label>
                            <div><input class="form-control data-input" data-field="name" placeholder="Input Skill here............" /></div>
                        </div>`,
                        `<div class="form-group col-12">
                            <div class="d-flex align-items-center justify-items-center p-1">
                                <div name="div_img"></div>
                            </div>
                        </div>`,
                        `</div>`,
                    ].join("");
                },
                contentCreated: (me, divModal) => {
                    me.logoBox = new ImageBox(me.controls.div_img, {});
                },
                buttons: [
                    {
                        cssClass: "btn btn-warning",
                        label: '<span vslang="DataTransferItemList.Cancel">Cancel</span>',
                        dismissModal: true,
                    },
                    {
                        cssClass: "btn btn-primary",
                        label: '<span vslang="buttons.Save">Save</span>',
                        click: (me, btn, divModal) => {
                            let p = me.getData();
                            p.logo = me.logoBox.getImage();
                            console.log(p);
                            vsapi
                                .call(
                                    `${main_view.base_url}/bhr/skills/save`,
                                    p,
                                    btn,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, p);
                                        cv_interact.success(
                                            "Skill saved successfully"
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: LocaleManager.trans("Add Skill", "titles"),
                    modifyTitle: LocaleManager.trans("Edit Skill", "titles"),
                    targetProp: "Skill",
                    api: {
                        endpoint: `${main_view.base_url}/bhr/skills/form-options`,
                        params: (dataOptions) => {
                            return { id: dataOptions.id };
                        },
                    },
                },
                onPrepareForm: (me) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

            dialog.show(op);
        };

        return self;
    })();
})();

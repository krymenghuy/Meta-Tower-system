"use strict";

var SkillsComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_skillsComponent");

    mThis.title_prop = "Skills";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddSkill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_skills_list_search");

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>`,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-pr-custom">${data.name ?? data.title ?? "-"}</span>`;
            },
        },
        {
            transTitle: "titles.Description",
            className: "align-middle",
            data: (data) => {
                return `<div class="text-primary-custom" style="width:300px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? "_"}</span>
                    </div>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: 'align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_skill_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillsListView = new ListView("_skills_lists", {
            fetchApi: `${mThis.base_url}/mhr/skills/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            SkillListDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SkillsListView.showPage(mThis.getFilterData());
                },
            });
        };

        mThis.listContainer = mThis.SkillsListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };
    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_skill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Job Level</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "btn_edit_skill"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "btn_delete_skill"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "btn_edit_skill": {
                        mThis.editSkill(id, menuLink);
                        break;
                    }
                    case "btn_delete_skill": {
                        mThis.deleteSkill(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.elSearch.addEventListener("keyup", () => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.SkillsListView) {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            }
        }, 200);
    });

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) {
                p[f] = el.value;
            }
        });

        return p;
    };

    

    mThis.editSkill = (id, menulink) => {
        SkillListDialog.show({
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.deleteSkill = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
        };

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
                            `${main_view.base_url}/mhr/skills/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_skill");
                                mThis.SkillsListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error("An error occurred. Please try again.");
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

    mThis.show = function () {
        mThis.init();
        mThis.SkillsListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };

    return mThis;
})();

const SkillListDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="title" required class="data-input form-control" data-field="title" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
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

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/skills/save"].join(""),
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
                    targetProp: "skills",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/skills/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

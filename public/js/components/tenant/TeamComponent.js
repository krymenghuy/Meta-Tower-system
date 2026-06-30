"use strict";

var TeamComponent = new (function() {
    const mThis = this;
    mThis.title_prop = "Team Management";
    this.defaultPage = "team_list";
    mThis.member_count;
    mThis.self = main_view.VSAppContent.querySelector("#_main_team_component");

    mThis.btnAdd = mThis.self.querySelector("#_btnAddTeam");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_team");
    mThis.elSearch = mThis.self.querySelector("#_search_team");
    mThis.elStatus = mThis.self.querySelector("#_el_team_status");
    mThis.btnBack = document.querySelector("#_btn_back_team");
    mThis.divTenantListContainer = mThis.self.querySelector(
        "#_team_list_container"
    );
    mThis.divProfileView = document.querySelector("#_team_profile_view");
    mThis.listViewContainer = mThis.self.querySelector("#_team_list_view");
    mThis.teamCardView = mThis.self.querySelector("#_team_card_view");

    this.pages = {
        team_list: this.divTenantListContainer,
        profile_view: this.divProfileView
    };

    mThis.profile_info_tenant = this.divProfileView.querySelector(
        "#profile_info_team"
    );
    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle"
        },
        {
            transTitle: "titles.Photo",
            className: "align-middle",
            data: data =>
                `<img class="btn-view-tenant-photo" data-id="${
                    data.id
                }" src="${data.image_url ||
                    `${main_view.base_url}/assets/images/default/placeholder.svg`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px;"/>`
        },
        {
            transTitle: "titles.Code",
            className: "align-middle",
            data: data => {
                return `<span class="text-prm-custom text-nowrap">${data.code ??
                    "_"}</span>`;
            }
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: data => {
                const sexLabel = mThis._sexLabel
                    ? mThis._sexLabel(data.sex)
                    : data.sex === "M"
                    ? "Male"
                    : "Female";
                return `
                    <div class="text-prm-custom" style="width:120px;">
                        <span class="text-wrap text-break text-capitalize" style ="word-break:break-word;">${data.name ??
                            "_"}</span>
                        <span class="d-block text-primary" style="font-size:12px;">${sexLabel}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle ",
            data: data => {
                return `<span class="text-prm-custom text-nowrap">${data.start_date ??
                    "_"}</span>`;
            }
        },
        {
            transTitle: "titles.Position",
            className: "align-middle",
            data: data => {
                return `<span class="text-prm-custom text-nowrap">${data.position ??
                    "_"}</span>`;
            }
        },
        {
            transTitle: "titles.Contact Info",
            className: "align-middle",
            data: data =>
                `<span class="d-block text-prm-custom"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone_number ??
                    "_"}</span>
                 <span class="d-block text-primary"><i class="fa-solid text-primary px-1 fa-envelope" style="font-size:12px;"></i> ${data.email ??
                     "_"}</span>`
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: data => {
                const status = data.status;
                let cls =
                    "badge text-warning bg-warning-subtle border border-warning";

                if (status === "Inactive") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                } else if (status === "Active") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px"
                        data-status_id="${data.status_id}">
                        ${data.status ?? ""}
                    </span>
                `;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: data => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ??
                        ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            }
        },
        {
            className: "col_action align-middle",
            data: data => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn-tenant-dropdown-action"
                    data-id="${data.id}"
                    data-statusid="${data.status_id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="cursor: pointer; padding: 8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" ></i>
                    </a>
                </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.staffListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/tenant/team/member-list`,
            perPage: 8,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase text-nowrap",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                if (mThis.initDropdownMenus) mThis.initDropdownMenus(tr);
            }
        });

        // ✅ Create a distinct placeholder element instead of using innerHTML directly
        if (mThis.listViewContainer) {
            // First hide the actual list table if it loaded empty shells
            const tableEl =
                mThis.listViewContainer.querySelector(".table") ||
                mThis.listViewContainer.firstElementChild;
            if (tableEl) tableEl.style.display = "none";

            const placeholder = document.createElement("div");
            placeholder.id = "_team_list_placeholder";
            placeholder.className = "text-center py-5 text-muted";
            placeholder.innerHTML = `
                <i class="fa-solid fa-arrow-pointer fa-2x mb-2 opacity-50"></i>
                <p>Please click a team card first to see its members.</p>
            `;
            mThis.listViewContainer.appendChild(placeholder);
        }

        mThis.btnAdd.onclick = function(e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => mThis.refreshTeamList()
            };
            CreateTeamDialog.show(op);
        };

        mThis.btnBack.onclick = function(e) {
            e.preventDefault();
            mThis.showPage("team_list");
        };

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = listContainer => {
        const menuOptions = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2" vslang="titles.View Details">View Details</span>',
                    icon: `<i class="fa-solid fa-user fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_profile"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Modify Member">Modify Member</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_member"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Delete Member">Delete Member</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_member"
                }
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;

                if (menu.modify_member) {
                    menu.modify_member.style.display =
                        Number(status_id) !== 2 ? "block" : "none";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_profile": {
                        mThis.showPage("profile_view", { member_id: id });
                        break;
                    }
                    case "modify_member": {
                        mThis.editMember(id, menuLink);
                        break;
                    }
                    case "delete_member": {
                        mThis.deleteMember(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };
    mThis.renderView = () => {
        if (mThis.staffListView) {
            // Re-runs the list view with its current page/filters state
            mThis.staffListView.showPage();
        } else {
            mThis.refreshTeamList();
        }
    };

    mThis.editMember = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            team_id: mThis.currentTeamId,
            onClose: () => {
            mThis.staffListView.showPage({
                ...mThis.getFilterData(),
                team_id: mThis.currentTeamId
            });
        }
        };
        CreateTeamMemberDialog.show(op);
    };
    // mThis.deleteMember = (id, menuLink) => {
    //     let op = {
    //         id: id,
    //         btn: menuLink,
    //         onClose: () => {
    //             mThis.renderView();
    //         }
    //     };
    //     // if (!AuthManager.allowed(221, false)) return;
    //     cv_interact.confirm(
    //         "confirm_delete",
    //         {
    //             title: "deleted",
    //             context: "delete",
    //             confirmButtonText: "Delete"
    //         },
    //         function(e) {
    //             if (e) {
    //                 vsapi
    //                     .call(
    //                         `${main_view.base_url}/tenant/team/delete-member`,
    //                         op,
    //                         false,
    //                         false,
    //                         false
    //                     )
    //                     .then(res => {
    //                         if (res.status_code == 200) {
    //                             TeamComponent.staffListView.showPage({
    //                                 ...TeamComponent.getFilterData(),
    //                                 team_id: res.data.team_id
    //                             });
    //                             cv_interact.success("delete_success_tenant");
    //                         } else {
    //                             cv_interact.error(res.error_message);
    //                         }
    //                     });
    //             }
    //         }
    //     );
    // };

    mThis.deleteMember = (id, menuLink) => {
    let op = {
        id: id,
        btn: menuLink,
        onClose: () => {
            mThis.renderView();
        }
    };
    cv_interact.confirm(
        "confirm_delete",
        { title: "deleted", context: "delete", confirmButtonText: "Delete" },
        function (e) {
            if (e) {
                vsapi
                    .call(`${main_view.base_url}/tenant/team/delete-member`, op, false, false, false)
                    .then(res => {
                        if (res.status_code == 200) {
                            const teamId = res.data.team_id;

                            TeamComponent.staffListView.showPage({
                                ...TeamComponent.getFilterData(),
                                team_id: teamId
                            });

                            // ✅ ADD: keep the team card's member count in sync
                            if (teamId && res.data.member_count !== undefined) {
                                updateCardMemberCount(teamId, res.data.member_count);
                            }

                            cv_interact.success("delete_success_tenant");
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            }
        }
    );
};

    mThis.renderTeamCards = (container, data) => {
        console.log(11, data);

        container.innerHTML = "";
        let html = `<div class="row g-3">`;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(team => {
                html += `
                    <div style="padding: 5px;">
                        <div class="team-card" data-id="${team.id}"
                            style="background-color: #f0f1f7; border-radius: 12px; border-bottom: 3px solid #2d4acb; overflow: hidden;">

                            <div style="padding: 14px 16px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 48px; height: 48px; border-radius: 10px; background-color: #dde1f7; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                        <i class="fa-solid fa-users" style="font-size: 20px; color: #2d4acb;"></i>
                                    </div>
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="font-size: 14px; font-weight: 600; color: #1a2566; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">
                                            ${team.team_name ?? "—"}
                                        </div>
                                        <span style="display: inline-block; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; background-color: ${
                                            team.code ? "#dde1f7" : "#e8e9ee"
                                        }; color: ${
                    team.code ? "#2d4acb" : "#6b7280"
                };">
                                            ${team.code ?? "No code"}
                                        </span>
                                    </div>
                                    <div style="text-align: right; flex-shrink: 0;">
                                        <div data-field="member_count" style="font-size: 22px; font-weight: 700; color: #1a2566; line-height: 1;">
                                            ${team.member_count}
                                        </div>
                                        <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Members</div>
                                    </div>
                                </div>
                            </div>

                            <div style="display: flex; gap: 8px; padding: 10px 16px; background-color: #ffffff; border-top: 1px solid #e2e5f5; justify-content: flex-end; align-items: center;">
                                <button class="create-staff-btn" data-id="${
                                    team.id
                                }"
                                        style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border-radius: 8px; cursor: pointer; border: 1.5px solid #22c55e; background: transparent; color: #16a34a; transition: all 0.2s;"
                                        title="Create staff">
                                    <i class="fa-solid fa-user-plus"></i>
                                </button>
                                
                                <button class="edit-team-btn" data-id="${
                                    team.id
                                }"
                                        style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border-radius: 8px; cursor: pointer; border: 1.5px solid #3b82f6; background: transparent; color: #2563eb; transition: all 0.2s;"
                                        title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                
                                <button class="delete-team-btn" data-id="${
                                    team.id
                                }"
                                        style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border-radius: 8px; cursor: pointer; border: 1.5px solid #f87171; background: transparent; color: #dc2626; transition: all 0.2s;"
                                        title="Delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
            });
        } else {
            html += `<div class="text-center py-5 text-muted"><i class="fa-solid fa-users fa-3x mb-3 opacity-25"></i><p>No teams found</p></div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
        mThis.attachTeamCardEvents(container);
    };

    mThis.attachTeamCardEvents = container => {
        // Create Staff Button
        container.querySelectorAll(".create-staff-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const teamId = e.currentTarget.dataset.id;
                CreateTeamMemberDialog.show({
                    id: 0,
                    team_id: teamId
                });
            });
        });

        container.querySelectorAll(".team-card").forEach(card => {
            card.addEventListener("click", async e => {
                if (e.target.closest("button")) return;
                const teamId = e.currentTarget.dataset.id;
                 mThis.currentTeamId = teamId; 

                console.log("Viewing members for team ID:", teamId);

                if (mThis.staffListView) {
                    // ✅ Find and remove our placeholder to restore standard ListView DOM targets
                    const placeholder = mThis.listViewContainer.querySelector(
                        "#_team_list_placeholder"
                    );
                    if (placeholder) {
                        placeholder.remove();
                    }

                    // ✅ Make sure the main list view table/structure is visible again
                    const hiddenTable =
                        mThis.listViewContainer.querySelector(".table") ||
                        mThis.listViewContainer.firstElementChild;
                    if (hiddenTable) {
                        hiddenTable.style.display = "";
                    }

                    // Combine global filters with your selected team ID
                    const currentFilters = mThis.getFilterData();
                    mThis.staffListView.showPage({
                        ...currentFilters,
                        team_id: teamId
                    });
                }
            });
        });

        // Corrected delete button listener (duplication removed)
        container.querySelectorAll(".delete-team-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation(); // Prevents card click event
                const teamId = e.currentTarget.dataset.id; //

                cv_interact.confirm(
                    "confirm_delete",
                    {
                        title: "deleted",
                        context: "delete",
                        confirmButtonText: "Delete"
                    },
                    function(isConfirmed) {
                        if (isConfirmed) {
                            vsapi
                                .call(
                                    `${main_view.base_url}/tenant/team/delete`,
                                    { id: teamId }, //
                                    false,
                                    false,
                                    false
                                )
                                .then(res => {
                                    if (res.status_code == 200) {
                                        mThis.showPage("team_list"); // Refreshes the list
                                        cv_interact.success(
                                            "delete_success_tenant"
                                        ); //
                                    } else {
                                        cv_interact.error(res.error_message); //
                                    }
                                });
                        }
                    }
                );
            });
        });

        container.querySelectorAll(".edit-team-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();

                // ✅ CORRECT: ID is successfully retrieved
                const teamId = e.currentTarget.dataset.id;
                console.log("Opening edit dialog for team ID:", teamId);

                let op = {
                    id: teamId,
                    onClose: () => mThis.refreshTeamList()
                };

                CreateTeamDialog.show(op);
                console.log("Opening edit dialog for team ID:", teamId);
            });
        });
    };

    mThis.refreshTeamList = () => {
        mThis.showPage("team_list");
    };

    mThis.showPage = async (pageName, op = {}) => {
        if (mThis.self.style.display !== "block") {
            main_view.setContentView(mThis.self, mThis.title_prop);
        }

        switch (pageName) {
            case "team_list": {
                mThis.currentPage = "team_list";
                const filter = mThis.getFilterData();

                const res = await vsapi.call(
                    `${main_view.base_url}/tenant/team/list`,
                    filter,
                    false,
                    null
                );

                const teams = res.data || [];

                if (mThis.teamCardView) {
                    mThis.renderTeamCards(mThis.teamCardView, teams);
                }

                // 🛑 CHANGE HERE: Only trigger list fetch if a team_id is actively part of the filters
                if (mThis.staffListView && filter.team_id) {
                    mThis.staffListView.showPage(filter);
                }
                break;
            }

            case "profile_view": {
                mThis.currentPage = "profile_view";
                const team_id = op.id || op.tenant_id || op;

                // Render team details
                const res = await vsapi.call(
                    `${main_view.base_url}/tenant/team/details`,
                    { id: team_id },
                    false,
                    null
                );

                const data = res.data || {};
                if (mThis.renderProfile) mThis.renderProfile(data);

                // Filter staff list to this team
                if (mThis.staffListView) {
                    mThis.staffListView.fetchApi = `${main_view.base_url}/tenant/team/member-list`;
                    mThis.staffListView.showPage({
                        team_id: team_id,
                        ...mThis.getFilterData()
                    });
                }
                break;
            }
        }

        const targetPage = mThis.getPageContainer(pageName);
        if (targetPage && targetPage.parentElement) {
            const siblings = Array.from(targetPage.parentElement.children);
            siblings.forEach(div => {
                if (div !== targetPage) div.style.display = "none";
            });
            targetPage.style.display = "block";
        }
    };

    mThis.getFilterData = () => {
        let p = { search_value: mThis.elSearch ? mThis.elSearch.value : "" };
        if (mThis.divFilter) {
            mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
                p[el.dataset.field] = el.value;
            });
        }
        return p;
    };

    mThis.getPageContainer = pageName => {
        return mThis.pages[pageName];
    };

    mThis.show = options => {
        mThis.init();
        mThis.options = options;
        mThis.showPage(mThis.defaultPage);
    };

    return mThis;
})();

const CreateTeamDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = op => {
        dialog = new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                    <input type="hidden" name="id" class="data-input" data-field="id" />

                    <div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" 
                                    name="team_name" 
                                    class="data-input form-control" 
                                    data-field="team_name" 
                                    placeholder=" " 
                                    required />
                                <label vslang="labels.Team Name">Team Name</label>
                            </div>
                        </div>

                        <div class="col-6 col-md-6">
                            <select name="space_id" 
                                    class="data-input form-control"
                                    data-style="material" 
                                    data-field="space_id"
                                    required
                                    placeholder="${LocaleManager.trans(
                                        "Select Space",
                                        "labels"
                                    )}">      
                            </select>
                        </div>
                                
                    </div>
                `;
            },
            configSelect: [
                {
                    name: "space_id",
                    data: "spaces",
                    textField: "code",
                    valueField: "id"
                }
            ],

            prepareFormOptions: {
                createTitle: "vslang:titles.Create New Team",
                modifyTitle: "vslang:titles.Modify Team",
                targetProp: "team",
                api: {
                    endpoint: `${main_view.base_url}/tenant/team/form-options`,
                    // ✅ FIX 2: Use an empty parameter arrow function to prevent variable shadowing.
                    // This allows correctly passing the outer team ID context.
                    params: () => ({ id: op.id })
                }
            },

            onPrepareForm: (me, data) => {
                const spacesList = data?.spaces || [];
                console.log("AA", spacesList);

                VSUtil.setComboItems(
                    me.controls.space_id,
                    spacesList,
                    "id",
                    "code",
                    "",
                    "Select Space",
                    ""
                );

                // If backend found and returned the team data, bind it to the inputs automatically
                if (data?.team) {
                    const teamData = Array.isArray(data.team)
                        ? data.team[0]
                        : data.team;
                    if (teamData) {
                        me.setData(teamData);
                    }
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: me => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const payload = me.getData();

                        // Ensure the ID accompanies the payload
                        payload.id = me.dataOptions.id || payload.id;

                        vsapi
                            .call(
                                `${main_view.base_url}/tenant/team/save`,
                                payload,
                                btn,
                                null
                            )
                            .then(res => {
                                if (res.status_code === 200) {
                                    const newTeamId = res.data?.id || null;
                                    me.hide(true, payload, newTeamId);

                                    if (payload.id > 0) {
                                        cv_interact.success(
                                            "update_success_team"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_success_team"
                                        );
                                    }

                                    if (typeof op.onClose === "function") {
                                        op.onClose();
                                    }
                                } else {
                                    cv_interact.error(
                                        res.error_message ||
                                            "Failed to save team"
                                    );
                                }
                            });
                    }
                }
            ]
        });

        dialog.show(op);
    };

    return self;
})();

const CreateTeamMemberDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = op => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal ",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                <div class="tenant-form row">
                    <div class="col-12 col-md-3 d-flex justify-content-center">
                        <div id="tenant-profile-container" class="tenant-profile-container d-flex align-items-center justify-content-center" >
                            <div id="tenant-upload-zone" class="tenant-image-card">
                                <input type="file" name="documents" class="data-input form-control" data-field="documents" accept=".png,.jpg,.jpeg" style="display: none;" />
                                <button type="button" id="btn_chooseFile" class="upload-trigger-area">
                                    <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </button>
                            </div>

                            <div id="tenant-preview-zone" class="tenant-image-card d-none">
                                <button type="button" id="btn_removeFile" class="close-badge-btn" aria-label="Remove image">
                                    <span class="close-icon">&times;</span>
                                </button>
                                <div class="preview-crop-box">
                                    <img id="tenant-preview-img" src="" alt="Tenant Profile" />
                                </div>
                                <input type="text" name="documents_display" id="documents_display" class="d-none" readonly />
                            </div>
                        </div>
                    </div>

                    <div class="col-md-9 row align-content-between flex-wrap" > 
                            <div class="col-12 col-md-6 ">
                                <div class="vs-material-field">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder="" />
                                    <label vslang="labels.Full Name">Full Name</label>
                                </div>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <select data-style="material" name="sex" class="data-input form-control" data-field="sex" placeholder="Gender">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                    <label vslang="labels.Start Date">Start Date</label>
                                </div>
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" data-field="date_of_birth" placeholder=" " />
                                    <label vslang="labels.Date of Birth">Date of Birth</label>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 d-none">
                                <select data-style="material" name="tenant_type" class="data-input form-control" data-field="tenant_type" placeholder="Tenant Type">
                                    <option value="1">Premium</option>
                                    <option value="2">Standard</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6" >
                                <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" placeholder="Nationality"></select>
                            </div>
                    </div>
                    <div class="col-12 row g-2"> 
                        <div class="col-12 col-md-6">
                            <div class="vs-material-field">
                                <input type="text" name="position" class="data-input form-control" data-field="position" placeholder=" " />
                                <label vslang="labels.Position">Position</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="vs-material-field">
                                <input type="text" name="national_id" class="data-input form-control" data-field="national_id" placeholder=" " />
                                <label vslang="labels.National ID">National ID</label>
                            </div>
                        </div>
                        <div class="d-none col-6 col-md-6">
                            <select name="space_id" 
                                    class="data-input form-control"
                                    data-style="material" 
                                    data-field="space_id"
                                    required
                                    placeholder="${LocaleManager.trans(
                                        "Select Space",
                                        "labels"
                                    )}">      
                            </select>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="nid_issue_date" class="data-input form-control form_input" data-field="nid_issue_date" placeholder=" " />
                                <label vslang="labels.Issue Date">Issue Date</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="text" name="passport_number" class="data-input form-control" data-field="passport_number" placeholder=" " />
                                <label vslang="labels.Passport">Passport Number</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="number" name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " />
                                <label vslang="labels.Phone Number">Phone Number</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 pt-2">
                            <div class="vs-material-field">
                                <input type="email" name="email" class="data-input form-control" data-field="email" placeholder=" " />
                                <label vslang="labels.Email">Email</label>
                            </div>
                        </div>
                    <div class="col-12 pt-2">
                        <div class="vs-material-field">
                            <textarea name="address" class="data-input form-control" data-field="address" rows="3" placeholder=" "></textarea>
                            <label vslang="labels.Address">Address</label>
                        </div>
                    </div>

                </div>
                `;
            },

            contentCreated: me => {
                me.uploadInput = me.divModal.querySelector(
                    'input[name="documents"]'
                );
                me.uploadZone = me.divModal.querySelector(
                    "#tenant-upload-zone"
                );
                me.previewZone = me.divModal.querySelector(
                    "#tenant-preview-zone"
                );
                me.previewImg = me.divModal.querySelector(
                    "#tenant-preview-img"
                );
                me.displayInput = me.divModal.querySelector(
                    "#documents_display"
                );

                me.controls.btn_chooseFile = me.divModal.querySelector(
                    "#btn_chooseFile"
                );
                me.controls.btn_removeFile = me.divModal.querySelector(
                    "#btn_removeFile"
                );

                me.fileBase64 = null;
                me.ext = null;

                me.renderMembeImage = () => {
                    const src = new URL(me.previewImg.src).pathname
                        .split("/")
                        .pop();

                    if (me.dataOptions.id == null && me.fileBase64) {
                        me.uploadZone.classList.add("d-none");
                        me.previewZone.classList.remove("d-none");
                    } else if (me.dataOptions.id == null && !me.fileBase64) {
                        me.uploadZone.classList.remove("d-none");
                        me.previewZone.classList.add("d-none");
                        me.uploadInput.value = "";
                        if (me.displayInput) me.displayInput.value = "";
                        if (me.previewImg) me.previewImg.src = "";
                    } else if (
                        me.dataOptions.id > 0 &&
                        !me.fileBase64 &&
                        src == "placeholder.svg"
                    ) {
                        me.uploadZone.classList.remove("d-none");
                        me.previewZone.classList.add("d-none");
                        me.uploadInput.value = "";
                        if (me.displayInput) me.displayInput.value = "";
                        if (me.previewImg) me.previewImg.src = "";
                    } else {
                        me.uploadZone.classList.add("d-none");
                        me.previewZone.classList.remove("d-none");
                    }
                };

                me.controls.btn_chooseFile.onclick = () => {
                    me.uploadInput.click();
                };
                me.previewImg.style.cursor = "pointer";
                me.previewImg.title = "Click to change photo";
                me.previewImg.onclick = () => {
                    me.uploadInput.click();
                };

                me.uploadInput.addEventListener("change", e => {
                    const file = e.target.files[0];
                    if (file) {
                        const extension = file.name
                            .split(".")
                            .pop()
                            .toLowerCase();

                        if (!["jpg", "jpeg", "png"].includes(extension)) {
                            cv_interact.error(
                                "Please select a valid image file (.jpg, .jpeg, .png)"
                            );
                            return;
                        }

                        const reader = new FileReader();
                        reader.onload = event => {
                            const fullResult = event.target.result;

                            me.fileBase64 = null;

                            me.fileBase64 = fullResult.split(",")[1];
                            let detectedExt = fullResult
                                .split(";")[0]
                                .split(":")[1];
                            me.ext = detectedExt.split("/")[1];

                            me.previewImg.src = fullResult;
                            me.displayInput.value = file.name;

                            me.renderMembeImage();

                            if (me.dataOptions.id > 0) {
                                me.saveProfilePhoto(
                                    fullResult,
                                    me.dataOptions.id
                                );
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });

                me.controls.btn_removeFile.onclick = async () => {
                    if (me.dataOptions.id > 0) {
                        const yes = await cv_interact.confirm(
                            "Are you sure to delete this profile photo?",
                            { title: "Delete Photo", context: "delete" }
                        );
                        if (yes) {
                            me.deleteProfilePhoto(me.dataOptions.id);
                        }
                    } else {
                        me.fileBase64 = null;
                        me.ext = null;
                        me.renderMembeImage();
                    }
                };

                me.deleteProfilePhoto = id => {
                    const p = { id: id };
                    vsapi
                        .call(
                            [
                                main_view.base_url,
                                "/tenant/team/profile/photo/delete"
                            ].join(""),
                            p,
                            false,
                            false
                        )
                        .then(res => {
                            if (res.status_code == 200) {
                                me.fileBase64 = null;
                                me.ext = null;
                                me.renderMembeImage();
                                cv_interact.success(
                                    "Profile photo was deleted!"
                                );
                            } else cv_interact.error(res.error_message);
                        });
                };

                me.saveProfilePhoto = (photo, id) => {
                    const p = { photo: photo, id: id };
                    vsapi
                        .call(
                            [
                                main_view.base_url,
                                "/tenant/team/profile/photo/save"
                            ].join(""),
                            p,
                            false
                        )
                        .then(res => {
                            if (res.status_code == 200) {
                                cv_interact.success("Profile photo was saved!");
                            } else cv_interact.error(res.error_message);
                        });
                };
            },
            configSelect: [
                {
                    name: "nationality_id",
                    data: "nationalities",
                    textField: "nationality",
                    valueField: "id"
                }
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Create New Staff",
                modifyTitle: "vslang:titles.Modify Staff",
                targetProp: "member",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/tenant/team/form-options-member"
                    ].join(""),
                    // ✅ FIX: empty-parameter arrow to avoid shadowing the
                    // outer `op` (which holds the real member id).
                    params: () => {
                        return { id: op.id };
                    }
                }
            },

            onPrepareForm: (me, data) => {
                me.renderMembeImage();

                if (me.dataOptions && me.dataOptions.team_id) {
                    me.team_id = me.dataOptions.team_id; // Store it
                    // Add hidden input if not exists
                    if (!me.divModal.querySelector('input[name="team_id"]')) {
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = "team_id";
                        hidden.value = me.dataOptions.team_id;
                        me.divModal
                            .querySelector(".tenant-form")
                            .appendChild(hidden);
                    }
                }

                // ✅ FIX: bind the fetched record (data.member) onto the
                // form the same way CreateTeamDialog does with data.team.
                // Team::getFormOptionsMember() returns the key 'member'.
                if (data?.member) {
                    const staffData = Array.isArray(data.member)
                        ? data.member[0]
                        : data.member;
                    if (staffData) {
                        me.setData(staffData);
                    }
                }
            },

            extendMethod: {
                setData: (me, data) => {
                    if (me.dataOptions.id > 0) {
                        if (data && data.image_url) {
                            me.previewImg.src = data.image_url;
                            me.fileBase64 = data.image_url;
                        }
                    }
                }
            },
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const op = me.getData();
                        console.log(6655, op);

                        op.id = me.dataOptions.id;
                        if (me.dataOptions.team_id) {
                            op.team_id = me.dataOptions.team_id;
                        }
                        op.photo = me.fileBase64 ? me.previewImg.src : "";

                        [
                            "start_date",
                            "date_of_birth",
                            "nid_issue_date"
                        ].forEach(f => {
                            if (op[f]) {
                                const d = new Date(op[f]);
                                if (!isNaN(d.getTime())) {
                                    const y = d.getFullYear();
                                    const m = String(d.getMonth() + 1).padStart(
                                        2,
                                        "0"
                                    );
                                    const day = String(d.getDate()).padStart(
                                        2,
                                        "0"
                                    );
                                    op[f] = `${y}-${m}-${day}`;
                                }
                            }
                        });
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/tenant/team/save-member"
                                ].join(""),
                                op,
                                btn,
                                null
                            )
                            .then(res => {
                                console.log(
                                    "Server response received on saving member:",
                                    res
                                );

                                if (res.status_code === 200) {
                                    const newTenantId = res.data?.id || null;
                                    me.hide(true, op, newTenantId);

                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_success_tenant"
                                        );
                                        me.previewZone.classList.add("d-none");
                                    } else {
                                        const activeTeamId =
                                            op.team_id ||
                                            me.dataOptions.team_id;
                                        console.log(
                                            "Target Team ID detected:",
                                            activeTeamId
                                        );

                                        let totalCount = 0;
                                        if (
                                            res.data?.member_count !== undefined
                                        ) {
                                            totalCount = res.data.member_count;
                                        } else if (
                                            res.data?.tenant_team
                                                ?.member_count !== undefined
                                        ) {
                                            totalCount =
                                                res.data.tenant_team
                                                    .member_count;
                                        } else {
                                            // If the server doesn't return the new count, read the current UI number and add 1
                                            const activeCard = document.querySelector(
                                                `.team-card[data-id="${activeTeamId}"]`
                                            );
                                            const currentUiCount = activeCard?.querySelector(
                                                '[data-field="member_count"]'
                                            )?.textContent;
                                            totalCount = currentUiCount
                                                ? parseInt(currentUiCount, 10) +
                                                  1
                                                : 1;
                                            console.warn(
                                                "API response did not include a counter field. Falling back to incremental UI calculation:",
                                                totalCount
                                            );
                                        }

                                        if (activeTeamId) {
                                            updateCardMemberCount(
                                                activeTeamId,
                                                totalCount
                                            );
                                        }

                                        cv_interact.success(
                                            "create_success_tenant"
                                        );
                                        me.previewZone.classList.add("d-none");

                                        TeamComponent.staffListView.showPage({
                                            ...TeamComponent.getFilterData(),
                                            team_id: activeTeamId
                                        });
                                    }
                                } else {
                                    cv_interact.error(res.error_message);
                                    if (me.controls?.documents) {
                                        me.controls.documents.value = "";
                                        me.controls.documents.classList.add(
                                            "d-none"
                                        );
                                    }
                                }
                            });
                    }
                }
            ]
        });
        dialog.show(op);
    };
    return self;
})();

function updateCardMemberCount(teamId, newCount) {
    const card = document.querySelector(`.team-card[data-id="${teamId}"]`);

    card.dataset.memberCount = newCount;

    const countInputDisplay = card.querySelector('[data-field="member_count"]');
    if (countInputDisplay) {
        countInputDisplay.textContent = newCount;
    } else {
        console.error(
            "DOM Error: Could not find an element with data-field='member_count' inside the card container."
        );
    }
}

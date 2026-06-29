"use strict";
var AnnouncementComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Announcements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_announcement_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAnnouncement");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_announcement");
    mThis.elSearch = mThis.self.querySelector("#_search_announcement");

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.AnnouncementListView = new ListView("_announcement_list", {
            fetchApi: `${main_view.base_url}/prm/announcement/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                mThis.renderCards(container, items);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.AnnouncementListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(265, false)) return;
            AnnouncementDialog.show(op);
        };

        mThis.pr_tbl = mThis.AnnouncementListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.AnnouncementListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        return {
            search_value: mThis.elSearch.value,
        };
    };

    mThis.renderCards = (container, data) => {
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                html += `
                    <div class="col-12 col-md-6">
                        <div class="card p-3 border rounded-2 bg-white position-relative h-100 shadow-sm" style="min-height: 120px;">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="fw-bold text-prm-custom m-0 text-capitalize fs-6">${d.title ?? ""}</h5>
                                <div class="d-flex gap-3 align-items-center">
                                    <a href="javascript:void(0)" class="btn-edit-announcement" data-id="${d.id}" style="font-size: 16px;">
                                        <i class="fa-solid fa-pen" style="color: #556ee6;"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn-delete-announcement" data-id="${d.id}" style="font-size: 16px;">
                                        <i class="fa-solid fa-trash-can" style="color: #f46a6a;"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="text-muted small text-wrap text-break" style="word-break: break-word; font-size: 13px; line-height: 1.6;">
                                ${d.description ?? ""}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="col-12 text-center text-muted py-4 bg-white border rounded-2">
                    No announcements found.
                </div>
            `;
        }
        html += `</div>`;
        container.innerHTML = html;

        container.querySelectorAll(".btn-edit-announcement").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                mThis.editAnnouncement(id, btn);
            };
        });

        container.querySelectorAll(".btn-delete-announcement").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                mThis.deleteAnnouncement(id, btn);
            };
        });
    };

    mThis.editAnnouncement = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.AnnouncementListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(266, false)) return;
        AnnouncementDialog.show(op);
    };

    mThis.deleteAnnouncement = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AnnouncementListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(267, false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                'langSection': "message_box_default",
                'translate': true,
                'title': "deleted",
                'context': "delete",
                'confirmButtonText': "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/announcement/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_announcement");
                                mThis.AnnouncementListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        if (typeof onFinish === "function") onFinish();
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.AnnouncementListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const AnnouncementDialog = (() => {
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
                    return `
                <div class="announcement-form">
                        <div class="col-12 row g-3">
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="title" class="data-input form-control" data-field="title" placeholder=" " />
                                    <label vslang="labels.Title"></label>
                                </div>
                            </div>
                             <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" rows="5" placeholder=" "></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div>
                         </div>
                </div>
                `;
                },

                contentCreated: (me) => {},
                configSelect: [],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Announcement",
                    modifyTitle: "vslang:titles.Modify Announcement",
                    targetProp: "announcement_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/announcement/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {},

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/announcement/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success('update_success_announcement');
                                        } else {
                                            cv_interact.success('create_success_announcement');
                                        }
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

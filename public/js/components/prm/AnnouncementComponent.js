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
    mThis.elFilter_category = mThis.self.querySelector("#_filter_category");
    mThis.elFilter_priority = mThis.self.querySelector("#_filter_priority");
    mThis.elFilter_status = mThis.self.querySelector("#_filter_status");
    mThis.elFilter_sort = mThis.self.querySelector("#_filter_sort");

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

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.AnnouncementListView.showPage(mThis.getFilterData());
            }, 250);
        };

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.AnnouncementListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.AnnouncementListView.showPage(mThis.getFilterData());
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {};
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) {
                p[f] = el.value;
            }
        });
        return p;
    };

    const formatDateTime = (sqlDate) => {
        if (!sqlDate) return "";
        const d = new Date(sqlDate.replace(/-/g, "/"));
        if (isNaN(d.getTime())) return sqlDate;
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const monthStr = months[d.getMonth()];
        const day = d.getDate();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hoursStr = String(hours).padStart(2, "0");
        return `${monthStr} ${day}, ${d.getFullYear()} ${hoursStr}:${minutes} ${ampm}`;
    };

    const formatRelativeTime = (sqlDate) => {
        if (!sqlDate || sqlDate.startsWith("0000-00-00")) return "Not set";
        
        let dateStr = sqlDate;
        if (!dateStr.includes("T") && !dateStr.includes("+") && !dateStr.includes("Z")) {
            dateStr = dateStr.replace(" ", "T") + "+07:00";
        }
        const targetDate = new Date(dateStr);
        if (isNaN(targetDate.getTime())) return sqlDate;
        
        const now = new Date();
        const diffMs = now.getTime() - targetDate.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        
        if (diffSec < 0) {
            return formatDateOnly(sqlDate);
        }
        if (diffSec < 60) {
            return "Just now";
        }
        
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
        }
        
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) {
            return `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
        }
        
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        }
        
        return formatDateOnly(sqlDate);
    };

    const formatDateOnly = (sqlDate) => {
        if (!sqlDate || sqlDate.startsWith("0000-00-00")) return "";
        const d = new Date(sqlDate.replace(/-/g, "/"));
        if (isNaN(d.getTime())) return sqlDate;
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const monthStr = months[d.getMonth()];
        const day = d.getDate();
        return `${monthStr} ${day}, ${d.getFullYear()}`;
    };

    const CATEGORY_THEMES = {
        general: {
            iconClass: "fa-solid fa-bullhorn",
            iconBg: "#f0f4f8",
            iconColor: "#3f609f",
            badgeClass: "ann-badge-general",
        },
        maintenance: {
            iconClass: "fa-solid fa-screwdriver-wrench",
            iconBg: "#ecfdf5",
            iconColor: "#10b981",
            badgeClass: "ann-badge-maintenance",
        },
        notice: {
            iconClass: "fa-solid fa-bullhorn",
            iconBg: "#fef2f2",
            iconColor: "#ef4444",
            badgeClass: "ann-badge-notice",
        },
        event: {
            iconClass: "fa-solid fa-calendar-days",
            iconBg: "#f5f3ff",
            iconColor: "#8b5cf6",
            badgeClass: "ann-badge-event",
        },
        policy: {
            iconClass: "fa-solid fa-square-parking",
            iconBg: "#fff7ed",
            iconColor: "#f97316",
            badgeClass: "ann-badge-policy",
        },
        "policy update": {
            iconClass: "fa-solid fa-square-parking",
            iconBg: "#fff7ed",
            iconColor: "#f97316",
            badgeClass: "ann-badge-policy-update",
        }
    };

    mThis.resolveCardTheme = (d) => {
        const categoryLower = (d.category || "").toLowerCase();
        const titleLower = (d.title || "").toLowerCase();

        const baseTheme = CATEGORY_THEMES[categoryLower] || CATEGORY_THEMES.general;
        const theme = { ...baseTheme };

        if (
            titleLower.includes("building water maintenance") ||
            (titleLower.includes("maintenance") &&
                titleLower.includes("water") &&
                !titleLower.includes("interruption"))
        ) {
            theme.iconClass = "fa-solid fa-bullhorn";
            theme.iconBg = "#fef2f2";
            theme.iconColor = "#ef4444";
        } else if (titleLower.includes("water") || titleLower.includes("plumbing")) {
            theme.iconClass = "fa-solid fa-droplet";
            theme.iconBg = "#ecfdf5";
            theme.iconColor = "#10b981";
        } else if (titleLower.includes("parking") || titleLower.includes("car")) {
            theme.iconClass = "fa-solid fa-square-parking";
            theme.iconBg = "#fff7ed";
            theme.iconColor = "#f97316";
        } else if (
            titleLower.includes("holiday") ||
            titleLower.includes("closed") ||
            titleLower.includes("office")
        ) {
            theme.iconClass = "fa-solid fa-building";
            theme.iconBg = "#eff6ff";
            theme.iconColor = "#3b82f6";
        } else if (titleLower.includes("elevator") || titleLower.includes("lift")) {
            theme.iconClass = "fa-solid fa-elevator";
            theme.iconBg = "#f5f3ff";
            theme.iconColor = "#8b5cf6";
        }

        return theme;
    };

    mThis.renderCards = (container, data) => {
        container.innerHTML = "";
        let html = `<div class="announcement-cards-list mt-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                const theme = mThis.resolveCardTheme(d);
                const categoryBadgeClass = theme.badgeClass;
                const categoryBadgeText = d.category || "General";
                const iconBg = theme.iconBg;
                const iconClass = theme.iconClass;
                const iconColor = theme.iconColor;

                const priorityLower = (d.priority || "Low").toLowerCase();
                let priorityBadgeClass = "ann-badge-low";
                let cardPriorityClass = "ann-card-low";
                if (priorityLower === "medium") {
                    priorityBadgeClass = "ann-badge-medium";
                    cardPriorityClass = "ann-card-medium";
                } else if (priorityLower === "high") {
                    priorityBadgeClass = "ann-badge-high";
                    cardPriorityClass = "ann-card-high";
                } else if (priorityLower === "critical") {
                    priorityBadgeClass = "ann-badge-critical";
                    cardPriorityClass = "ann-card-critical";
                }

                let statusBadgeClass = d.status === "Active" ? "ann-status-active" : "ann-status-draft";
                let statusText = d.status === "Active" ? "Active" : "Draft";

                let pubDate = d.publish_date
                    ? formatDateOnly(d.publish_date)
                    : "Not set";
                const hasExpiry = d.expiry_date && 
                                  d.expiry_date !== "null" &&
                                  d.expiry_date !== "0000-00-00" && 
                                  d.expiry_date !== "0000-00-00 00:00:00" && 
                                  d.expiry_date !== "0000-00-00 00:00";
                let expDate = hasExpiry
                    ? "Expires: " + formatDateOnly(d.expiry_date)
                    : "No expiration";

                let buildingName = d.building_name || "All Buildings";

                const isTenant = main_view.main_route === "tenant";

                html += `
                    <div class="card mb-3 shadow-sm rounded-3 overflow-hidden position-relative announcement-card ${cardPriorityClass}">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                
                                <div class="col-auto d-flex align-items-center justify-content-center" style="width: 5%; min-width: 44px;">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 44px; height: 44px; background-color: ${iconBg}; transition: all 0.2s;">
                                        <i class="${iconClass} fs-5" style="color: ${iconColor};"></i>
                                    </div>
                                </div>
                                
                                <div class="ps-3 flex-grow-1" style="width: 65%; min-width: 0;">
                                    <h5 class="fw-bold mb-2 font-size-15" style="color: #1e293b;font-weight: 700; letter-spacing: -0.01em;">${d.title ?? ""}</h5>
                                    <div class="mb-2 text-wrap announcement-desc" style="line-height: 1.6; font-size: 13.5px; color: #1a1655; word-break: break-word; overflow-wrap: break-word;">
                                        ${d.description ?? ""}
                                    </div>

                                    <div class="d-flex flex-wrap gap-2 mt-3">
                                        <span class="badge font-size-10 px-3 py-2 rounded-5 d-inline-flex align-items-center gap-2 ${priorityBadgeClass}">
                                            <i class="fa-solid fa-flag"></i> ${d.priority || "Low"} Priority
                                        </span>
                                        
                                        <span class="badge font-size-10 px-3 py-2 rounded-5 d-inline-flex align-items-center gap-2 ${categoryBadgeClass}">
                                            <i class="${iconClass}"></i> ${categoryBadgeText}
                                        </span>
                                        
                                        <span class="badge font-size-10 px-3 py-2 rounded-5 d-inline-flex align-items-center gap-2 ann-badge-neutral">
                                            <i class="fa-solid fa-building"></i> ${buildingName}
                                        </span>
                                        
                                        <span class="badge font-size-10 px-3 py-2 rounded-5 d-inline-flex align-items-center gap-2 ann-badge-neutral">
                                            <i class="fa-solid fa-users"></i> ${d.audience || "All Tenants"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="ps-4 pe-4 d-none d-md-flex ann-meta-sidebar">
                                    <div class="ann-meta-item">
                                        <span class="ann-status-badge ${statusBadgeClass}">
                                            <span class="ann-status-dot"></span>
                                            ${statusText}
                                        </span>
                                    </div>
                                    <div class="ann-meta-item">
                                        <i class="fa-solid fa-calendar"></i>
                                        <span>${pubDate}</span>
                                    </div>
                                    <div class="ann-meta-item">
                                        <i class="fa-solid fa-clock"></i>
                                        <span>${expDate}</span>
                                    </div>
                                </div>

                                ${
                                    isTenant
                                        ? ""
                                        : `
                                <div class="text-end ps-3 d-flex align-items-center justify-content-end" style="width: 10%;">
                                    <a href="javascript:void(0)" class="btn-edit-announcement d-inline-flex align-items-center justify-content-center rounded-circle" data-id="${d.id}" style="width: 34px; height: 34px; background-color: #f1f5f9; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#e2e8f0'" onmouseout="this.style.backgroundColor='#f1f5f9'">
                                        <i class="fa-solid fa-pen text-primary" style="font-size: 13px;"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn-delete-announcement d-inline-flex align-items-center justify-content-center rounded-circle ms-2" data-id="${d.id}" style="width: 34px; height: 34px; background-color: #f1f5f9; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#fee2e2'" onmouseout="this.style.backgroundColor='#f1f5f9'">
                                        <i class="fa-solid fa-trash-can text-danger" style="font-size: 13px;"></i>
                                    </a>
                                </div>
                                `
                                }

                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="text-center text-muted py-5 bg-white shadow-sm rounded-3">
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

        container
            .querySelectorAll(".btn-delete-announcement")
            .forEach((btn) => {
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
                langSection: "message_box_default",
                translate: true,
                title: "deleted",
                context: "delete",
                confirmButtonText: "Delete",
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
                                cv_interact.success(
                                    "delete_success_announcement",
                                );
                                mThis.AnnouncementListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        const categories = [
            { id: "General", name: "General" },
            { id: "Maintenance", name: "Maintenance" },
            { id: "Notice", name: "Notice" },
            { id: "Event", name: "Event" },
            { id: "Policy Update", name: "Policy Update" },
        ];

        const priorities = [
            { id: "Low", name: "Low" },
            { id: "Medium", name: "Medium" },
            { id: "High", name: "High" },
            { id: "Critical", name: "Critical" },
        ];

        const statuses = [
            { id: "Active", name: "Active" },
            { id: "Draft", name: "Draft" },
        ];

        const sortOptions = [
            { id: "newest", name: "Newest First" },
            { id: "oldest", name: "Oldest First" },
        ];

        VSUtil.setComboItems(
            mThis.elFilter_category,
            categories,
            "id",
            "name",
            "",
            LocaleManager.trans("All Categories", "titles"),
            "",
        );
        VSUtil.setComboItems(
            mThis.elFilter_priority,
            priorities,
            "id",
            "name",
            "",
            LocaleManager.trans("All Priorities", "titles"),
            "",
        );
        VSUtil.setComboItems(
            mThis.elFilter_status,
            statuses,
            "id",
            "name",
            "",
            LocaleManager.trans("All Statuses", "titles"),
            "",
        );
        VSUtil.setComboItems(
            mThis.elFilter_sort,
            sortOptions,
            "id",
            "name",
            "",
            LocaleManager.trans("Sort By", "titles"),
            "",
        );

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
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                <div class="announcement-form">
                        <div class="col-12 row g-3">
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="title" class="data-input form-control" data-field="title" placeholder=" " required />
                                    <label vslang="labels.Title"></label>
                                </div>
                            </div>
                            
                            <div class="col-12">
                                <div class="form-group">
                                    <label class="form-label small d-block" style="color:#757575;" vslang="labels.Description"></label>
                                    <textarea name="description" id="description" class="data-input form-control" data-field="description" placeholder="Enter announcement description..."></textarea>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <select data-style="material" placeholder="${LocaleManager.trans("Category", "labels")}" name="category" class="data-input form-control" data-field="category">
                                        <option value="" disabled selected>${LocaleManager.trans("Category", "labels")}</option>
                                        <option value="General">General</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Notice">Notice</option>
                                        <option value="Event">Event</option>
                                        <option value="Policy Update">Policy Update</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <select data-style="material" placeholder="${LocaleManager.trans("Priority", "labels")}" name="priority" class="data-input form-control" data-field="priority">
                                        <option value="" disabled selected>${LocaleManager.trans("Priority", "labels")}</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <select data-style="material" placeholder="${LocaleManager.trans("Building", "labels")}" name="building_id" class="data-input form-control" data-field="building_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <select data-style="material" placeholder="${LocaleManager.trans("Audience", "labels")}" name="audience" class="data-input form-control" data-field="audience">
                                        <option value="All Tenants">All Tenants</option>
                                        <option value="Staff Only">Staff Only</option>
                                        <option value="Owners Only">Owners Only</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="publish_date" class="data-input form-control form_input" data-field="publish_date" placeholder=" " required />
                                    <label vslang="labels.Publish Date"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="expiry_date" class="data-input form-control form_input" data-field="expiry_date" placeholder=" " />
                                    <label vslang="labels.Expiry Date"></label>
                                </div>
                            </div>


                            <div class="col-12">
                                <label class="form-label text-muted small mb-2 d-block" style="color:#757575;" vslang="label.Status"></label>
                                <div class="d-flex gap-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="status" id="_status_active" value="Active" checked>
                                        <label class="form-check-label text-dark small" for="_status_active">Active</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="status" id="_status_draft" value="Draft">
                                        <label class="form-check-label text-dark small" for="_status_draft">Draft</label>
                                    </div>
                                </div>
                            </div>

                         </div>
                </div>
                `;
                },

                contentCreated: (me) => {
                    const textarea = me.divModal.querySelector(
                        'textarea[name="description"]',
                    );
                    if (textarea && typeof CKEDITOR !== "undefined") {
                        me.editor = CKEDITOR.replace(textarea, {
                            versionCheck: false,
                            toolbar: [
                                { name: "styles", items: ["Format"] },
                                {
                                    name: "basicstyles",
                                    items: ["Bold", "Italic", "Underline"],
                                },
                                {
                                    name: "paragraph",
                                    items: ["BulletedList", "NumberedList"],
                                },
                                {
                                    name: "align",
                                    items: [
                                        "JustifyLeft",
                                        "JustifyCenter",
                                        "JustifyRight",
                                    ],
                                },
                                { name: "links", items: ["Link"] },
                                { name: "insert", items: ["Image"] },
                            ],
                            removePlugins: "elementspath",
                            resize_enabled: false,
                            height: 150,
                            placeholder: "Enter announcement description...",
                        });
                    }
                },
                configSelect: [
                    {
                        name: "building_id",
                        data: "buildings",
                        textField: "building",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Announcement",
                    modifyTitle: "vslang:titles.Modify Announcement",
                    targetProp: "announcement_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/announcement/form-options",
                        ].join(""),
                        params: (me, op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const details = data?.announcement_details;
                    if (me.editor) {
                        me.editor.setData(details?.description || "");
                    }
                },

                extendMethod: {
                    setData: (me, data) => {
                        const divModal = me.divModal;
                        const statusVal = data.status || "Active";
                        const radio = divModal.querySelector(
                            `input[name="status"][value="${statusVal}"]`,
                        );
                        if (radio) {
                            radio.checked = true;
                        }

                        const pubInput = divModal.querySelector('input[name="publish_date"]');
                        const expInput = divModal.querySelector('input[name="expiry_date"]');
                        
                        if (pubInput && pubInput.value) {
                            pubInput.value = pubInput.value.split(" ")[0];
                        }
                        if (expInput && expInput.value) {
                            expInput.value = expInput.value.split(" ")[0];
                        }
                    },

                    getData: (me) => {
                        const divModal = me.divModal;
                        const activeRadio = divModal.querySelector(
                            'input[name="status"]:checked',
                        );
                        return {
                            title: divModal.querySelector('input[name="title"]')
                                .value,
                            description: me.editor
                                ? me.editor.getData()
                                : divModal.querySelector(
                                      'textarea[name="description"]',
                                  ).value,
                            category: divModal.querySelector(
                                'select[name="category"]',
                            ).value,
                            priority: divModal.querySelector(
                                'select[name="priority"]',
                            ).value,
                            building_id: divModal.querySelector(
                                'select[name="building_id"]',
                            ).value,
                            audience: divModal.querySelector(
                                'select[name="audience"]',
                            ).value,
                            publish_date: divModal.querySelector(
                                'input[name="publish_date"]',
                            ).value,
                            expiry_date: divModal.querySelector(
                                'input[name="expiry_date"]',
                            ).value,
                            status: activeRadio ? activeRadio.value : "Active",
                        };
                    },
                },

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
                            if (me.editor) {
                                me.editor.updateElement();
                            }
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            let p = { ...op };

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/announcement/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_announcement",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success_announcement",
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        if (dialog.editor) {
            dialog.editor.setData("");
        }
        dialog.show(op);
    };
    return self;
})();

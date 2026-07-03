"use strict";
var AnnouncementComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Announcements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_announcement_component",
    );
    mThis.divFilter = mThis.self.querySelector("#_divFilter_announcement");
    mThis.elSearch = mThis.self.querySelector("#_search_announcement");
    mThis.elFilter_category = mThis.self.querySelector("#_filter_category");
    mThis.elFilter_priority = mThis.self.querySelector("#_filter_priority");
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
        let p = {
            status: "Active", //Tenants can only view Active announcements
            is_tenant: 1,
        };
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

    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatShortDate = (sqlDate, withYear = true) => {
        if (!sqlDate) return "";
        const d = new Date(sqlDate.replace(/-/g, "/"));
        if (isNaN(d.getTime())) return sqlDate;
        const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
        return withYear ? `${base}, ${d.getFullYear()}` : base;
    };

    const statusMeta = (status) => {
        switch ((status || "").toLowerCase()) {
            case "active":
                return { cls: "ann-badge--active", label: "Active" };
            case "emergency":
                return { cls: "ann-badge--emergency", label: "Emergency" };
            case "scheduled":
                return { cls: "ann-badge--scheduled", label: "Scheduled" };
            case "expired":
                return { cls: "ann-badge--expired", label: "Expired" };
            default:
                return { cls: "ann-badge--draft", label: "Draft" };
        }
    };

    const escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const el = document.createElement("div");
        el.textContent = String(str);
        return el.innerHTML;
    };

    const CATEGORY_THEMES = {
        maintenance: {
            grad: "linear-gradient(135deg, #9AA4C2 0%, #5C6883 100%)",
            accent: "#5c6883",
            soft: "#eef1f6",
            icon: "fa-solid fa-screwdriver-wrench",
        },
        emergency: {
            grad: "linear-gradient(135deg, #E7A199 0%, #BE5E6B 100%)",
            accent: "#c9556a",
            soft: "#fdecec",
            icon: "fa-solid fa-triangle-exclamation",
        },
        notice: {
            grad: "linear-gradient(135deg, #E7A199 0%, #BE5E6B 100%)",
            accent: "#c9556a",
            soft: "#fdecec",
            icon: "fa-solid fa-bullhorn",
        },
        event: {
            grad: "linear-gradient(135deg, #9A8FE6 0%, #6E61C9 100%)",
            accent: "#6d5fd0",
            soft: "#f0eefb",
            icon: "fa-solid fa-calendar-days",
        },
        "policy update": {
            grad: "linear-gradient(135deg, #F4B183 0%, #E08A4A 100%)",
            accent: "#dd8a3f",
            soft: "#fdf1e6",
            icon: "fa-solid fa-file-lines",
        },
        general: {
            grad: "linear-gradient(135deg, #5D50E6 0%, #4436C7 100%)",
            accent: "#4f46e5",
            soft: "#eef0fe",
            icon: "fa-solid fa-bullhorn",
        },
    };

    mThis.cardTheme = (d) => {
        const categoryLower = (d.category || "").toLowerCase();
        const titleLower = (d.title || "").toLowerCase();

        let theme =
            CATEGORY_THEMES[categoryLower] ||
            CATEGORY_THEMES[categoryLower.replace(" update", "")] ||
            CATEGORY_THEMES.general;

        theme = Object.assign({}, theme);

        if (titleLower.includes("water") || titleLower.includes("plumbing")) {
            theme.icon = "fa-solid fa-droplet";
        } else if (titleLower.includes("parking") || titleLower.includes("car")) {
            theme.icon = "fa-solid fa-square-parking";
        } else if (titleLower.includes("elevator") || titleLower.includes("lift")) {
            theme.icon = "fa-solid fa-elevator";
        } else if (titleLower.includes("fire")) {
            theme.icon = "fa-solid fa-fire-extinguisher";
        }

        return theme;
    };

    mThis.priorityMeta = (priority) => {
        switch ((priority || "Low").toLowerCase()) {
            case "critical":
                return {
                    label: "Urgent Action Required",
                    style: "background:#fdeae4; color:#e2513a;",
                };
            case "high":
                return {
                    label: "High Priority",
                    style: "background:#fdeae4; color:#e2513a;",
                };
            case "medium":
                return {
                    label: "Medium Priority",
                    style: "background:#fff4e6; color:#f97316;",
                };
            case "normal":
                return {
                    label: "Normal Priority",
                    style: "background:#eef0fe; color:#5b6bd6;",
                };
            default:
                return {
                    label: "Low Priority",
                    style: "background:#eef5ff; color:#3b82f6;",
                };
        }
    };

    mThis.renderCards = (container, data) => {
        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5 bg-white shadow-sm rounded-3 mt-3">
                    No announcements found.
                </div>
            `;
            return;
        }

        let html = `<div class="ann-grid">`;

        data.forEach((d, index) => {
            const theme = mThis.cardTheme(d);
            const st = statusMeta(d.status);
            const pr = mThis.priorityMeta(d.priority);

            const buildingName = escapeHtml(d.building_name || "All Buildings");
            const audience = escapeHtml(d.audience || "All Tenants");
            const pubDate = d.created_at
                ? formatRelativeTime(d.created_at)
                : "Not set";
            const expDate = d.expiry_date
                ? formatShortDate(d.expiry_date)
                : "No expiration";

            html += `
                <div class="ann-card" data-id="${d.id}" style="--ann-accent:${theme.accent}; --ann-soft:${theme.soft};">
                    <div class="ann-card__banner" style="background:${theme.grad}">
                        <i class="${theme.icon} ann-card__banner-icon"></i>
                        <span class="ann-badge ${st.cls}">${st.label}</span>
                        <span class="ann-cat">${escapeHtml(d.category || "General")}</span>
                        <div class="ann-banner-content">
                            <h5 class="ann-card__title">${escapeHtml(d.title)}</h5>
                            <div class="ann-ref">
                                <span class="ann-ref-label" vslang="labels.Tracking Reference">Tracking Reference</span>
                                <span class="ann-card__id">ID: #ANN-${d.id}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ann-card__body">
                        <div class="ann-desc-block">
                            <div class="ann-desc-text announcement-desc">${d.description ?? ""}</div>
                        </div>
                        <div class="ann-meta-panel">
                            <div class="ann-meta">
                                <div class="ann-meta__item">
                                    <span class="ann-meta__icon"><i class="fa-solid fa-building"></i></span>
                                    <div class="ann-meta__text">
                                        <span class="ann-meta__label" vslang="labels.Building">Building</span>
                                        <div class="ann-meta__value">${buildingName}</div>
                                    </div>
                                </div>
                                <div class="ann-meta__item">
                                    <span class="ann-meta__icon"><i class="fa-solid fa-users"></i></span>
                                    <div class="ann-meta__text">
                                        <span class="ann-meta__label" vslang="labels.Audience">Audience</span>
                                        <div class="ann-meta__value">${audience}</div>
                                    </div>
                                </div>
                                <div class="ann-meta__item">
                                    <span class="ann-meta__icon"><i class="fa-solid fa-calendar"></i></span>
                                    <div class="ann-meta__text">
                                        <span class="ann-meta__label" vslang="labels.Published">Published</span>
                                        <div class="ann-meta__value">${pubDate}</div>
                                    </div>
                                </div>
                                <div class="ann-meta__item">
                                    <span class="ann-meta__icon"><i class="fa-solid fa-hourglass-half"></i></span>
                                    <div class="ann-meta__text">
                                        <span class="ann-meta__label" vslang="labels.Expires">Expires</span>
                                        <div class="ann-meta__value">${expDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ann-card__footer">
                            <span class="ann-priority" style="${pr.style}">${pr.label}</span>
                            <span class="ann-card-count">Card View: ${index + 1} of ${data.length}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

        LocaleManager.translateZone(container);
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
        if (mThis.elFilter_priority) {
            VSUtil.setComboItems(
                mThis.elFilter_priority,
                priorities,
                "id",
                "name",
                "",
                LocaleManager.trans("All Priorities", "titles"),
                "",
            );
        }
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

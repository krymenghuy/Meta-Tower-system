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
            perPage: 6,
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

    const escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const el = document.createElement("div");
        el.textContent = String(str);
        return el.innerHTML;
    };

    const CATEGORY_ICONS = {
        maintenance: "fa-solid fa-screwdriver-wrench",
        emergency: "fa-solid fa-triangle-exclamation",
        notice: "fa-solid fa-bullhorn",
        event: "fa-solid fa-calendar-days",
        "policy update": "fa-solid fa-file-lines",
        policy: "fa-solid fa-file-lines",
        general: "fa-solid fa-bullhorn",
    };

    mThis.categoryIcon = (d) => {
        const categoryLower = (d.category || "general").toLowerCase();
        const titleLower = (d.title || "").toLowerCase();

        let icon =
            CATEGORY_ICONS[categoryLower] ||
            CATEGORY_ICONS[categoryLower.replace(" update", "")] ||
            CATEGORY_ICONS.general;

        if (titleLower.includes("water") || titleLower.includes("plumbing")) {
            icon = "fa-solid fa-droplet";
        } else if (titleLower.includes("parking") || titleLower.includes("car")) {
            icon = "fa-solid fa-square-parking";
        } else if (titleLower.includes("elevator") || titleLower.includes("lift")) {
            icon = "fa-solid fa-elevator";
        } else if (titleLower.includes("fire")) {
            icon = "fa-solid fa-fire-extinguisher";
        }

        return icon;
    };

    mThis.normalizePriority = (priority) => {
        const p = String(priority || "Low").trim().toLowerCase();
        if (["critical", "high", "medium", "normal", "low"].includes(p)) return p;
        return "low";
    };

    mThis.priorityMeta = (priority) => {
        switch (mThis.normalizePriority(priority)) {
            case "critical":
                return {
                    label: "Urgent Action Required",
                    style: "background:#fde0dc; color:#8e1b12;",
                    grad: "linear-gradient(135deg, #C0392B 0%, #7B1E14 100%)",
                    accent: "#8e1b12",
                    soft: "#fbe2df",
                };
            case "high":
                return {
                    label: "High Priority",
                    style: "background:#ffe9dc; color:#d9531e;",
                    grad: "linear-gradient(135deg, #FB923C 0%, #EA580C 100%)",
                    accent: "#ea580c",
                    soft: "#ffeede",
                };
            case "medium":
                return {
                    label: "Medium Priority",
                    style: "background:#fef7dd; color:#b8860b;",
                    grad: "linear-gradient(135deg, #FCD34D 0%, #D4A017 100%)",
                    accent: "#b8860b",
                    soft: "#fdf6dc",
                };
            case "normal":
                return {
                    label: "Normal Priority",
                    style: "background:#eef0fe; color:#5b6bd6;",
                    grad: "linear-gradient(135deg, #8B93E8 0%, #4F46E5 100%)",
                    accent: "#4f46e5",
                    soft: "#eef0fe",
                };
            default:
                return {
                    label: "Low Priority",
                    style: "background:#eef5ff; color:#2563eb;",
                    grad: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)",
                    accent: "#2563eb",
                    soft: "#eaf1fd",
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
            const pr = mThis.priorityMeta(d.priority);
            const icon = mThis.categoryIcon(d);

            const buildingName = escapeHtml(d.building_name || "All Buildings");
            const audience = escapeHtml(d.audience || "All Tenants");
            const pubDate = d.created_at
                ? formatRelativeTime(d.created_at)
                : "Not set";
            const expDate = d.expiry_date
                ? formatShortDate(d.expiry_date)
                : "No expiration";

            html += `
                <div class="ann-card" data-id="${d.id}" style="--ann-accent:${pr.accent}; --ann-soft:${pr.soft};">
                    <div class="ann-card__banner" style="background:${pr.grad}">
                        <i class="${icon} ann-card__banner-icon"></i>
                        <div class="ann-banner-content">
                            <h5 class="ann-card__title">${escapeHtml(d.title)}</h5>
                            <span class="ann-cat">${escapeHtml(d.category || "General")}</span>
                        </div>
                    </div>
                    <div class="ann-card__body">
                        <div class="ann-desc-block">
                            <div class="ann-desc-text announcement-desc">${d.description ?? ""}</div>
                        </div>
                        <div class="ann-meta-panel">
                            <div class="ann-meta ann-meta--two">
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

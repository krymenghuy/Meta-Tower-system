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
    mThis.elFilter_sort = mThis.self.querySelector("#_filter_sort");
    mThis.announcementItemsMap = {};

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
        mThis.elSearch.addEventListener("keyup", () => {
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.refresh();
            }, 250);
        });
        mThis.divFilter.addEventListener("change", () => {
            mThis.refresh();
        });

        mThis.initAlready = true;
    };

    mThis.refresh = () => {
        mThis.AnnouncementListView.showPage(mThis.getFilterData());
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

    // Date formatting helpers
    const MONTHS = [
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

    const formatShortDate = (sqlDate, withYear = true) => {
        if (!sqlDate) return "";
        const d = new Date(sqlDate.replace(/-/g, "/"));
        if (isNaN(d.getTime())) return sqlDate;
        const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
        return withYear
            ? `${base}, ${d.getFullYear()}`
            : `${base}`;
    };

    const formatRelativeTime = (sqlDate) => {
        if (!sqlDate || sqlDate.startsWith("0000-00-00")) return "Not set";

        const dateStr =
            !sqlDate.includes("T") &&
            !sqlDate.includes("+") &&
            !sqlDate.includes("Z")
                ? sqlDate.replace(" ", "T") + "+07:00"
                : sqlDate;
        const targetDate = new Date(dateStr);
        if (isNaN(targetDate.getTime())) return sqlDate;

        const diffSec = Math.floor((Date.now() - targetDate.getTime()) / 1000);
        if (diffSec < 0) return formatShortDate(sqlDate);
        if (diffSec < 60) return "Just now";

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

        return formatShortDate(sqlDate);
    };

    const escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const el = document.createElement("div");
        el.textContent = String(str);
        return el.innerHTML;
    };

    // Theme config mapping
    const PRIORITY_THEMES = {
        critical: { accent: "#b91c1c", soft: "#fca5a5" },
        high: { accent: "#dc2626", soft: "#fee2e2" },
        medium: { accent: "#d97706", soft: "#fef3c7" },
        normal: { accent: "#3b82f6", soft: "#eff6ff" },
        low: { accent: "#3b82f6", soft: "#eff6ff" },
    };

    const getPriorityMeta = (priority) => {
        const p = String(priority || "low")
            .trim()
            .toLowerCase();
        return PRIORITY_THEMES[p] || PRIORITY_THEMES.low;
    };

    // Detail UI rendering
    const renderDetailField = (label, value) => `
        <div class="ann-detail-profile__row">
            <span class="ann-detail-profile__label">${escapeHtml(label)}</span>
            <span class="ann-detail-profile__sep">:</span>
            <span class="ann-detail-profile__value">${value}</span>
        </div>`;

    const buildDetailHtml = (data) => {
        const pub = data.publish_date || data.created_at;
        return `
            <div class="ann-detail-profile overflow-y-auto overflow-x-hidden">
                <div class="ann-detail-profile__title">
                    <h5 class="mb-0">${escapeHtml(data.title || "—")}</h5>
                </div>
                <div class="ann-detail-profile__body">
                    <div class="row g-3 mb-0">
                        <div class="col-12 col-md-6">
                            ${renderDetailField(LocaleManager.trans("Category", "titles"), escapeHtml(data.category || "General"))}
                            ${renderDetailField(LocaleManager.trans("Published", "titles"), escapeHtml(pub ? formatShortDate(pub) : "—"))}
                        </div>
                        <div class="col-12 col-md-6">
                            ${renderDetailField(LocaleManager.trans("Priority", "titles"), escapeHtml(data.priority || "Low"))}
                            ${renderDetailField(LocaleManager.trans("Expires", "titles"), escapeHtml(data.expiry_date ? formatShortDate(data.expiry_date) : "No expiration"))}
                        </div>
                        <div class="col-12 ann-detail-profile__remark">
                            ${renderDetailField(LocaleManager.trans("Description", "titles"), data.description ? `<div class="announcement-desc">${data.description}</div>` : "—")}
                        </div>
                    </div>
                </div>
            </div>`;
    };

    const trackViewed = (id) => {
        try {
            const numId = Number(id);
            [sessionStorage, localStorage].forEach((storage) => {
                const list = JSON.parse(
                    storage.getItem("viewed_announcements") || "[]",
                );
                if (!list.includes(numId)) {
                    list.push(numId);
                    storage.setItem(
                        "viewed_announcements",
                        JSON.stringify(list),
                    );
                }
            });
        } catch (e) {
            console.error("Error saving viewed announcement:", e);
        }
    };

    const loadDetails = (id, callback) => {
        const cached = mThis.announcementItemsMap[id];
        if (cached) return callback(cached);

        vsapi
            .call(
                `${main_view.base_url}/prm/announcement/details`,
                { id },
                null,
                null,
            )
            .then((res) => {
                if (res?.status_code === 200 && res.data) {
                    mThis.announcementItemsMap[id] = res.data;
                    callback(res.data);
                } else {
                    cv_interact.error(
                        res?.error_message || "Announcement not found.",
                    );
                }
            });
    };

    mThis.showAnnouncementDetail = (id) => {
        trackViewed(id);
        loadDetails(id, (data) => {
            AnnouncementViewDialog.show({ contentHtml: buildDetailHtml(data) });
        });
    };

    // Cards layout and rendering
    const buildCardHtml = (d) => {
        mThis.announcementItemsMap[d.id] = d;
        const pr = getPriorityMeta(d.priority);
        const pubDate = d.created_at
            ? formatRelativeTime(d.created_at)
            : "Not set";
        const expDate = d.expiry_date
            ? formatShortDate(d.expiry_date)
            : "No expiration";
        const catClass = `ann-cat-${(d.category || "General").toLowerCase().replace(" ", "-")}`;

        return `
            <div class="ann-card" data-id="${d.id}" style="--ann-accent:${pr.accent}; --ann-soft:${pr.soft};">
                <div class="ann-card__banner">
                    <div class="d-flex align-items-start justify-content-between gap-3">
                        <h5 class="ann-card__title">${escapeHtml(d.title)}</h5>
                        <span class="ann-cat ${catClass}">${escapeHtml(d.category || "General")}</span>
                    </div>
                </div>
                <div class="ann-card__body">
                    <div class="ann-desc-text announcement-desc collapsed">${d.description ?? ""}</div>
                    <div class="ann-card__footer">
                        <div class="ann-meta-item">
                            <span class="ann-meta-icon"><i class="fa-solid fa-calendar"></i></span>
                            <span>Announced: <strong>${pubDate}</strong></span>
                        </div>
                        <div class="ann-meta-item">
                            <span class="ann-meta-icon"><i class="fa-solid fa-hourglass-half"></i></span>
                            <span>Expires: <strong>${expDate}</strong></span>
                        </div>
                    </div>
                </div>
            </div>`;
    };

    const setupReadMore = (descEl) => {
        descEl.classList.remove("collapsed");
        const fullHeight = descEl.offsetHeight;
        descEl.classList.add("collapsed");
        const clampedHeight = descEl.offsetHeight;

        if (clampedHeight > 0 && fullHeight > clampedHeight) {
            const btn = document.createElement("a");
            btn.href = "javascript:void(0)";
            btn.className = "btn-read-more";
            btn.innerText =
                (typeof LocaleManager !== "undefined" &&
                    LocaleManager.trans("Read More", "labels")) ||
                "Read More";
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const card = descEl.closest(".ann-card");
                if (card?.dataset.id) {
                    mThis.showAnnouncementDetail(card.dataset.id);
                }
            });
            descEl.closest(".ann-card__body")?.appendChild(btn);
        } else {
            descEl.classList.remove("collapsed");
        }
    };

    mThis.renderCards = (container, data) => {
        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5 bg-white shadow-sm rounded-3 mt-3">
                    No announcements found.
                </div>`;
            return;
        }

        container.innerHTML = `<div class="ann-grid">${data.map(buildCardHtml).join("")}</div>`;
        container.querySelectorAll(".ann-desc-text").forEach(setupReadMore);
        container.querySelectorAll(".ann-card").forEach((card) => {
            card.addEventListener("click", () =>
                mThis.showAnnouncementDetail(card.dataset.id),
            );
        });

        LocaleManager.translateZone(container);
    };

    mThis.prepareFormOptions = (onFinish) => {
        const populate = (el, items, text) => {
            if (!el) return;
            VSUtil.setComboItems(
                el,
                items.map((id) => ({ id, name: id })),
                "id",
                "name",
                "",
                LocaleManager.trans(text, "titles"),
                "",
            );
        };

        populate(
            mThis.elFilter_category,
            ["General", "Maintenance", "Notice", "Event", "Policy Update"],
            "All Categories",
        );

        if (mThis.elFilter_sort) {
            VSUtil.setComboItems(
                mThis.elFilter_sort,
                [
                    { id: "newest", name: "Newest First" },
                    { id: "oldest", name: "Oldest First" },
                ],
                "id",
                "name",
                "",
                LocaleManager.trans("Sort By", "titles"),
                "",
            );
        }

        if (typeof onFinish === "function") onFinish();
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.refresh();
        });
    };

    return mThis;
})();

const AnnouncementViewDialog = (() => {
    const self = {};
    self.show = (op) => {
        new GeneralDialog({
            title: LocaleManager.trans("Announcement Details", "titles"),
            cssClass: "modal-lg vs-modal modal-content-vs-dialog",
            backdrop: "static",
            keyboard: true,
            createContent: () => op.contentHtml || "",
            contentCreated: (me) => LocaleManager.translateZone(me.divModal),
            buttons: [
                {
                    label: '<span vslang="buttons.Close"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false),
                },
            ],
        }).show(op);
    };
    return self;
})();

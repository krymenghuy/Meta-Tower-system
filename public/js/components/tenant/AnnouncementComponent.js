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
            el.onchange = () => mThis.AnnouncementListView.showPage(mThis.getFilterData());
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status: "Active" //Tenants can only view Active announcements
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
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
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

    mThis.renderCards = (container, data) => {
        container.innerHTML = "";
        let html = `<div class="announcement-cards-list mt-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                const priorityLower = (d.priority || "Low").toLowerCase();
                const categoryLower = (d.category || "").toLowerCase();
                const titleLower = (d.title || "").toLowerCase();

                let iconClass = "fa-solid fa-bullhorn";
                let themeColor = "#3b82f6";  
                let iconBg = "#eff6ff";
                let iconColor = "#3b82f6";

          
                if (titleLower.includes("building water maintenance") || (titleLower.includes("maintenance") && titleLower.includes("water") && !titleLower.includes("interruption"))) {
                    iconClass = "fa-solid fa-bullhorn";
                    themeColor = "#ef4444";  
                    iconBg = "#fef2f2";
                    iconColor = "#ef4444";
                } else if (titleLower.includes("water") || titleLower.includes("plumbing")) {
                    iconClass = "fa-solid fa-droplet";
                    themeColor = "#10b981";  
                    iconColor = "#10b981";
                } else if (titleLower.includes("parking") || titleLower.includes("car")) {
                    iconClass = "fa-solid fa-square-parking";
                    themeColor = "#f97316";  
                    iconBg = "#fff7ed";
                    iconColor = "#f97316";
                } else if (titleLower.includes("holiday") || titleLower.includes("closed") || titleLower.includes("office")) {
                    iconClass = "fa-solid fa-building";
                    themeColor = "#3b82f6";  
                    iconColor = "#3b82f6";
                } else if (titleLower.includes("elevator") || titleLower.includes("lift")) {
                    iconClass = "fa-solid fa-elevator";
                    themeColor = "#8b5cf6";  
                    iconBg = "#f5f3ff";
                    iconColor = "#8b5cf6";
                } else {
                    
                    if (categoryLower === "maintenance") {
                        iconClass = "fa-solid fa-screwdriver-wrench";
                        themeColor = "#10b981";
                        iconBg = "#ecfdf5";
                        iconColor = "#10b981";
                    } else if (categoryLower === "notice") {
                        iconClass = "fa-solid fa-bullhorn";
                        themeColor = "#ef4444";
                        iconBg = "#fef2f2";
                        iconColor = "#ef4444";
                    } else if (categoryLower === "event") {
                        iconClass = "fa-solid fa-calendar-days";
                        themeColor = "#8b5cf6";
                        iconBg = "#f5f3ff";
                        iconColor = "#8b5cf6";
                    } else if (categoryLower === "policy update" || categoryLower === "policy") {
                        iconClass = "fa-solid fa-square-parking";
                        themeColor = "#f97316";
                        iconBg = "#fff7ed";
                        iconColor = "#f97316";
                    }
                }

                let borderLeftColor = themeColor;

                let priorityBadgeStyle = "background-color: #eff6ff !important; color: #3b82f6 !important; border: 1px solid #dbeafe !important; font-weight: 600;";
                let priorityBadgeText = "Low Priority";
                
                if (priorityLower === "high") {
                    priorityBadgeStyle = "background-color: #fef2f2 !important; color: #ef4444 !important; border: 1px solid #fee2e2 !important; font-weight: 600;";
                    priorityBadgeText = "High Priority";
                } else if (priorityLower === "medium") {
                    priorityBadgeStyle = "background-color: #fff7ed !important; color: #f97316 !important; border: 1px solid #ffedd5 !important; font-weight: 600;";
                    priorityBadgeText = "Medium Priority";
                } else if (priorityLower === "low") {
                    priorityBadgeStyle = "background-color: #eff6ff !important; color: #3b82f6 !important; border: 1px solid #dbeafe !important; font-weight: 600;";
                    priorityBadgeText = "Low Priority";
                } else if (priorityLower === "critical") {
                    priorityBadgeStyle = "background-color: #fff1f2 !important; color: #e11d48 !important; border: 1px solid #ffe4e6 !important; font-weight: 700;";
                    priorityBadgeText = "Critical Priority";
                }

                let statusDotColor = d.status === "Active" ? "#10b981" : "#94a3b8";
                let statusText = d.status === "Active" ? "Active" : "Draft";

                let pubDate = d.publish_date ? formatDateTime(d.publish_date) : "Not set";
                let expDate = d.expiry_date ? "Expires: " + formatDateTime(d.expiry_date) : "No expiration";

                let buildingName = d.building_name || "All Buildings";

                html += `
                    <div class="card mb-3 border shadow-sm rounded-3 overflow-hidden position-relative" style="border: 1px solid #e2e8f0 !important; border-left: 6px solid ${borderLeftColor} !important; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                        <div class="card-body p-4">
                            <div class="row align-items-center">
                                
                                <div class="col-12 col-md-9 col-lg-9">
                                    <div class="d-flex align-items-start gap-3">
                                        <!-- Left Icon -->
                                        <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 44px; height: 44px; background-color: ${iconBg}; transition: all 0.2s;">
                                            <i class="${iconClass} fs-5" style="color: ${iconColor};"></i>
                                        </div>
                                        
                                        <!-- Main Info -->
                                        <div>
                                            <h5 class="fw-bold mb-1 font-size-15" style="color: #1e293b !important; font-weight: 700 !important; letter-spacing: -0.01em;">${d.title ?? ""}</h5>
                                            <div class="mb-2 text-wrap" style="line-height: 1.6; font-size: 13.5px; color: #475569 !important;">
                                                ${d.description ? d.description.replace(/<[^>]*>/g, '') : ""}
                                            </div>
                                            <div class="d-flex flex-wrap gap-3 font-size-12">
                                                <span class="d-flex align-items-center" style="color: #64748b !important;">
                                                    <i class="fa-solid fa-building me-2" style="color: #94a3b8;"></i> ${buildingName}
                                                </span>
                                                <span class="d-flex align-items-center" style="color: #64748b !important;">
                                                    <i class="fa-solid fa-users me-2" style="color: #94a3b8;"></i> ${d.audience || "All Tenants"}
                                                </span>
                                                <span class="d-flex align-items-center" style="color: #64748b !important;">
                                                    <i class="fa-solid fa-folder me-2" style="color: #94a3b8;"></i> ${d.category || "General"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Center Stats -->
                                <div class="col-12 col-md-3 col-lg-3 px-4 border-start d-none d-md-block" style="border-color: #e2e8f0 !important;">
                                    <div class="mb-2">
                                        <span class="badge font-size-11 px-3 py-2    rounded-5" style="${priorityBadgeStyle}">${priorityBadgeText}</span>
                                    </div>
                                    <div class="d-flex align-items-center small mb-1.5 font-size-12" style="color: #64748b !important;">
                                        <span class="rounded-circle me-2" style="width: 8px; height: 8px; background-color: ${statusDotColor}; display: inline-block;"></span>
                                        <span>${statusText}</span>
                                    </div>
                                    <div class="font-size-12 mb-1.5 d-flex align-items-center" style="color: #64748b !important;">
                                        <i class="fa-solid fa-calendar me-2" style="color: #94a3b8;"></i> ${pubDate}
                                    </div>
                                    <div class="font-size-12 d-flex align-items-center" style="color: #64748b !important;">
                                        <i class="fa-solid fa-clock me-2" style="color: #94a3b8;"></i> ${expDate}
                                    </div>
                                </div>

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
    };

    mThis.prepareFormOptions = (onFinish) => {
        const categories = [
            { id: "General", name: "General" },
            { id: "Maintenance", name: "Maintenance" },
            { id: "Notice", name: "Notice" },
            { id: "Event", name: "Event" },
            { id: "Policy Update", name: "Policy Update" }
        ];

        const priorities = [
            { id: "Low", name: "Low" },
            { id: "Medium", name: "Medium" },
            { id: "High", name: "High" },
            { id: "Critical", name: "Critical" }
        ];

        const sortOptions = [
            { id: "newest", name: "Newest First" },
            { id: "oldest", name: "Oldest First" }
        ];

        VSUtil.setComboItems(
            mThis.elFilter_category,
            categories,
            "id",
            "name",
            "",
            LocaleManager.trans("All Categories", "titles"),
            ""
        );
        VSUtil.setComboItems(
            mThis.elFilter_priority,
            priorities,
            "id",
            "name",
            "",
            LocaleManager.trans("All Priorities", "titles"),
            ""
        );
        VSUtil.setComboItems(
            mThis.elFilter_sort,
            sortOptions,
            "id",
            "name",
            "",
            LocaleManager.trans("Sort By", "titles"),
            ""
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

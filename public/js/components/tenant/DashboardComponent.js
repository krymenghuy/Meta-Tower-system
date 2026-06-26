"use strict";

var DashboardComponent =  new (function () {
    const mThis = this;
	
    const STYLE_ID = "meta-tower-dashboard-style-v2";

    const COLORS = {
        primary: "#1A1647",
        primary2: "#2E2A72",
        accent: "#F6D673",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#0EA5E9",
        violet: "#4F46E5",
        muted: "#64748B",
        border: "#E8ECF3",
        bg: "#F7F8FC",
        text: "#0F172A"
    };

    const ALERT_MAP = {
        danger: {
            color: COLORS.danger,
            soft: "rgba(239,68,68,.12)"
        },
        warning: {
            color: COLORS.warning,
            soft: "rgba(245,158,11,.14)"
        },
        success: {
            color: COLORS.success,
            soft: "rgba(16,185,129,.12)"
        },
        info: {
            color: COLORS.info,
            soft: "rgba(14,165,233,.12)"
        }
    };

    const CSS = `
        .meta-dashboard {
            --md-primary:${COLORS.primary};
            --md-primary2:${COLORS.primary2};
            --md-accent:${COLORS.accent};
            --md-success:${COLORS.success};
            --md-warning:${COLORS.warning};
            --md-danger:${COLORS.danger};
            --md-info:${COLORS.info};
            --md-violet:${COLORS.violet};
            --md-muted:${COLORS.muted};
            --md-border:${COLORS.border};
            --md-bg:${COLORS.bg};
            --md-text:${COLORS.text};

            min-height:100%;
            padding:18px;
            background:
                radial-gradient(circle at top right, rgba(79,70,229,.08), transparent 28%),
                linear-gradient(180deg, #FAFBFF 0%, var(--md-bg) 100%);
        }

        .meta-dashboard * {
            box-sizing:border-box;
        }

        .md-hero {
            position:relative;
            overflow:hidden;
            border-radius:28px;
            padding:24px;
            margin-bottom:18px;
            color:#fff;
            background:
                radial-gradient(circle at 85% 10%, rgba(246,214,115,.45), transparent 28%),
                radial-gradient(circle at 10% 100%, rgba(14,165,233,.22), transparent 32%),
                linear-gradient(135deg, var(--md-primary), var(--md-primary2));
            box-shadow:0 22px 55px rgba(26,22,71,.28);
        }

        .md-hero:after {
            content:"";
            position:absolute;
            inset:auto -80px -110px auto;
            width:280px;
            height:280px;
            border-radius:50%;
            background:rgba(255,255,255,.08);
        }

        .md-hero-inner {
            position:relative;
            z-index:2;
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:18px;
        }

        .md-hero-eyebrow {
            display:inline-flex;
            padding:7px 11px;
            border-radius:999px;
            background:rgba(255,255,255,.12);
            border:1px solid rgba(255,255,255,.18);
            font-size:12px;
            font-weight:800;
            color:rgba(255,255,255,.9);
            margin-bottom:12px;
        }

        .md-hero-title {
            margin:0;
            font-size:26px;
            line-height:1.15;
            font-weight:900;
            letter-spacing:-.035em;
        }

        .md-hero-subtitle {
            margin-top:8px;
            max-width:760px;
            font-size:14px;
            color:rgba(255,255,255,.76);
        }

        .md-hero-stats {
            display:grid;
            grid-template-columns:repeat(3, minmax(110px, 1fr));
            gap:10px;
            min-width:420px;
        }

        .md-hero-stat {
            padding:13px 14px;
            border-radius:18px;
            background:rgba(255,255,255,.12);
            border:1px solid rgba(255,255,255,.16);
            backdrop-filter:blur(10px);
        }

        .md-hero-stat-value {
            font-size:20px;
            font-weight:900;
            line-height:1;
        }

        .md-hero-stat-label {
            margin-top:6px;
            font-size:12px;
            color:rgba(255,255,255,.72);
            white-space:nowrap;
        }

        .md-card {
            height:100%;
            background:rgba(255,255,255,.92);
            border:1px solid var(--md-border);
            border-radius:24px;
            box-shadow:0 8px 24px rgba(15,23,42,.055);
            transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }

        .md-card:hover {
            transform:translateY(-2px);
            border-color:rgba(79,70,229,.22);
            box-shadow:0 18px 42px rgba(15,23,42,.11);
        }

        .md-kpi-card {
            position:relative;
            overflow:hidden;
            padding:20px;
        }

        .md-kpi-card:before {
            content:"";
            position:absolute;
            top:0;
            left:0;
            right:0;
            height:4px;
            background:linear-gradient(90deg, var(--kpi-color), transparent);
        }

        .md-kpi-top {
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:14px;
        }

        .md-kpi-title {
            color:var(--md-muted);
            font-size:12px;
            font-weight:900;
            text-transform:uppercase;
            letter-spacing:.055em;
        }

        .md-kpi-value {
            margin-top:11px;
            color:var(--md-text);
            font-size:31px;
            font-weight:950;
            line-height:1;
            letter-spacing:-.045em;
        }

        .md-kpi-note {
            margin-top:10px;
            color:var(--md-muted);
            font-size:13px;
            font-weight:600;
        }

        .md-kpi-trend {
            display:inline-flex;
            align-items:center;
            gap:6px;
            margin-top:14px;
            padding:7px 10px;
            border-radius:999px;
            background:var(--kpi-soft);
            color:var(--kpi-color);
            font-size:12px;
            font-weight:900;
        }

        .md-kpi-icon {
            width:48px;
            height:48px;
            border-radius:17px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:var(--kpi-soft);
            color:var(--kpi-color);
            font-size:22px;
            flex:0 0 auto;
        }

        .md-section-card {
            overflow:hidden;
        }

        .md-section-header {
            padding:18px 20px 13px;
            border-bottom:1px solid var(--md-border);
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:12px;
        }

        .md-section-title {
            margin:0;
            color:var(--md-text);
            font-size:16px;
            font-weight:900;
            letter-spacing:-.015em;
        }

        .md-section-subtitle {
            margin-top:4px;
            color:var(--md-muted);
            font-size:12px;
            font-weight:600;
        }

        .md-section-pill {
            padding:7px 10px;
            border-radius:999px;
            background:rgba(26,22,71,.08);
            color:var(--md-primary);
            font-size:12px;
            font-weight:900;
            white-space:nowrap;
        }

        .md-chart-body {
            height:315px;
            padding:18px;
        }

        .md-mini-grid {
            display:grid;
            grid-template-columns:repeat(4, minmax(0, 1fr));
            gap:12px;
            margin-bottom:18px;
        }

        .md-mini-stat {
            padding:15px;
            border-radius:20px;
            background:#fff;
            border:1px solid var(--md-border);
            box-shadow:0 5px 16px rgba(15,23,42,.045);
        }

        .md-mini-value {
            font-size:20px;
            font-weight:950;
            color:var(--md-text);
            line-height:1;
        }

        .md-mini-label {
            margin-top:7px;
            color:var(--md-muted);
            font-size:12px;
            font-weight:700;
        }

        .md-progress-wrap {
            padding:18px 20px 20px;
        }

        .md-progress-item {
            margin-bottom:18px;
        }

        .md-progress-item:last-child {
            margin-bottom:0;
        }

        .md-progress-label {
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:9px;
            color:var(--md-text);
            font-size:13px;
            font-weight:850;
        }

        .md-progress-value {
            color:var(--md-muted);
            font-weight:900;
        }

        .md-progress-track {
            width:100%;
            height:11px;
            background:#EDF2F7;
            border-radius:999px;
            overflow:hidden;
        }

        .md-progress-bar {
            height:100%;
            border-radius:999px;
            background:linear-gradient(90deg, var(--bar-color), var(--bar-soft));
        }

        .md-list {
            padding:16px 18px 18px;
        }

        .md-alert-item,
        .md-insight-item {
            display:flex;
            gap:12px;
            padding:13px 14px;
            border-radius:17px;
            background:#FAFBFD;
            border:1px solid #EEF2F7;
            margin-bottom:10px;
        }

        .md-alert-item:last-child,
        .md-insight-item:last-child {
            margin-bottom:0;
        }

        .md-dot {
            width:11px;
            height:11px;
            border-radius:50%;
            margin-top:5px;
            flex:0 0 auto;
            background:var(--dot-color);
            box-shadow:0 0 0 5px var(--dot-soft);
        }

        .md-list-title {
            font-size:13px;
            font-weight:900;
            color:var(--md-text);
        }

        .md-list-note {
            margin-top:2px;
            font-size:12px;
            color:var(--md-muted);
            font-weight:600;
        }

        .md-timeline {
            padding:18px 20px;
        }

        .md-timeline-item {
            position:relative;
            display:grid;
            grid-template-columns:82px 1fr;
            gap:14px;
            padding-bottom:17px;
        }

        .md-timeline-item:last-child {
            padding-bottom:0;
        }

        .md-timeline-time {
            color:var(--md-muted);
            font-size:12px;
            font-weight:800;
            white-space:nowrap;
        }

        .md-timeline-content {
            position:relative;
            padding-left:18px;
            color:var(--md-text);
            font-size:13px;
            font-weight:750;
        }

        .md-timeline-content:before {
            content:"";
            position:absolute;
            left:0;
            top:5px;
            width:9px;
            height:9px;
            border-radius:50%;
            background:var(--md-violet);
            box-shadow:0 0 0 4px rgba(79,70,229,.12);
        }

        .md-timeline-content:after {
            content:"";
            position:absolute;
            left:4px;
            top:18px;
            bottom:-18px;
            width:1px;
            background:#E5EAF2;
        }

        .md-timeline-item:last-child .md-timeline-content:after {
            display:none;
        }

        .md-table {
            width:100%;
            margin:0;
            font-size:13px;
        }

        .md-table th {
            padding:12px 16px;
            color:var(--md-muted);
            font-size:11px;
            font-weight:950;
            text-transform:uppercase;
            letter-spacing:.04em;
            background:#FAFBFD;
            border-bottom:1px solid var(--md-border);
        }

        .md-table td {
            padding:14px 16px;
            border-bottom:1px solid #EEF2F7;
            color:var(--md-text);
            font-weight:750;
            vertical-align:middle;
        }

        .md-table tr:last-child td {
            border-bottom:0;
        }

        .md-status-pill {
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:6px 9px;
            border-radius:999px;
            background:var(--status-soft);
            color:var(--status-color);
            font-size:11px;
            font-weight:950;
            white-space:nowrap;
        }

        .md-status-pill:before {
            content:"";
            width:7px;
            height:7px;
            border-radius:50%;
            background:var(--status-color);
        }

        @media (max-width:1200px) {
            .md-hero-inner {
                flex-direction:column;
            }

            .md-hero-stats {
                width:100%;
                min-width:0;
            }
        }

        @media (max-width:768px) {
            .meta-dashboard {
                padding:12px;
            }

            .md-hero {
                border-radius:22px;
                padding:20px;
            }

            .md-hero-title {
                font-size:22px;
            }

            .md-hero-stats,
            .md-mini-grid {
                grid-template-columns:1fr 1fr;
            }

            .md-chart-body {
                height:280px;
            }
        }

        @media (max-width:480px) {
            .md-hero-stats,
            .md-mini-grid {
                grid-template-columns:1fr;
            }

            .md-timeline-item {
                grid-template-columns:1fr;
                gap:5px;
            }
        }
    `;

    mThis.title_prop = "Dashboard";
    mThis.base_url = main_view.base_url;
    mThis.asset_url = main_view.asset_url;

    mThis.self =
        main_view.VSAppContent.querySelector("#_main_dashboardComponent") ||
        main_view.VSAppContent.querySelector("#_main_dashboard_component");
	const tenantName = document.querySelector('meta[name="tenant_name"]')?.content || "Tenant";
    mThis.state = {
        initialized: false,
        stylesInjected: false,
        resizeBound: false,
        rendered: false
    };

    mThis.charts = Object.create(null);

    mThis.data = {
        period: "June 2026",

        summary: {
            occupancy_rate: 92,
            occupied_spaces: 128,
            total_spaces: 139,
            active_tenants: 54,
            new_tenants: 3,
            monthly_revenue: 86520,
            revenue_growth: 8.4,
            outstanding_amount: 23480,
            overdue_invoices: 18,
            collection_rate: 96
        },
        kpis: [
			{
				title: "Active Lease",
				value: "1",
				note: "Current rental agreement",
				trend: "Good standing",
				icon: "🏢",
				color: "#2563eb",
				soft: "#dbeafe"
			},
				{
				title: "Outstanding Balance",
				value: "$0.00",
				note: "No unpaid invoices",
				trend: "Fully paid",
				icon: "💳",
				color: "#9333ea",
				soft: "#f3e8ff"
			},
			{
				title: "Amenity Booking",
				value: 0,
				note: "No active bookings",
				trend: "Available",
				icon: "🏢",
				color: "#16a34a",
				soft: "#dcfce7"
			},
			{
				title: "Service Requests",
				value: "2",
				note: "Maintenance requests",
				trend: "In progress",
				icon: "🛠️",
				color: "#ea580c",
				soft: "#ffedd5"
			},
		
		],
       	collection_kpis: [
			{
				title: "Rent Collection",
				value: "96%",
				note: "Monthly rental payments",
				trend: "+2% from last month",
				color: COLORS.violet,
				soft: "#818CF8"
			},
			{
				title: "Electricity Collection",
				value: "94%",
				note: "Utility payments received",
				trend: "+1.5% this month",
				color: COLORS.success,
				soft: "#34D399"
			},
			{
				title: "Service Fee Collection",
				value: "92%",
				note: "Building service charges",
				trend: "Stable performance",
				color: COLORS.warning,
				soft: "#FBBF24"
			},
			{
				title: "Occupancy Rate",
				value: "91%",
				note: "Leased building spaces",
				trend: "+3% occupancy growth",
				color: COLORS.info,
				soft: "#38BDF8"
			},
			{
				title: "Lease Renewal",
				value: "88%",
				note: "Contract renewals completed",
				trend: "Renewal target on track",
				color: COLORS.danger,
				soft: "#FB7185"
			}
		],
        activities: [
            {
                text: "ABC Consulting paid invoice INV-24081",
                time: "10:45 AM"
            },
            {
                text: "XYZ Ltd renewed lease contract",
                time: "09:30 AM"
            },
            {
                text: "June electricity bills generated",
                time: "Yesterday"
            },
            {
                text: "New tenant moved into Floor 6",
                time: "Yesterday"
            }
        ],
        lease_expiry: [
			{
				tenant_name: "ABC Consulting",
				floor_no: 5,
				expiry_date: "2026-07-15",
				days_left: 18,
				status: "due_soon"
			},
			{
				tenant_name: "XYZ Ltd",
				floor_no: 7,
				expiry_date: "2026-07-20",
				days_left: 23,
				status: "pending"
			},
			{
				tenant_name: "Meta Lab",
				floor_no: 2,
				expiry_date: "2026-07-28",
				days_left: 31,
				status: "normal"
			}
		],
		announcements: [
    {
        title: "Water supply maintenance",
        note: "Water will be interrupted from 2PM - 5PM",
        level: "warning"
    },
    {
        title: "Parking policy update",
        note: "New parking rules effective from next month",
        level: "success"
    },
    {
        title: "Emergency drill notice",
        note: "Fire drill scheduled this Friday at 10AM",
        level: "danger"
    }
]
    };

    mThis.init = function () {
        if (mThis.state.initialized) return;

        mThis.state.initialized = true;

        mThis.injectStyles();
        mThis.bindResize();
    };

    mThis.injectStyles = function () {
        if (mThis.state.stylesInjected) return;

        mThis.state.stylesInjected = true;

        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");

        style.id = STYLE_ID;
        style.textContent = CSS;

        document.head.appendChild(style);
    };

    mThis.bindResize = function () {
        if (mThis.state.resizeBound) return;

        mThis.state.resizeBound = true;

        window.addEventListener("resize", mThis.updateHeight, {
            passive: true
        });
    };

    mThis.updateHeight = function () {
        if (!mThis.self) return;

        Object.assign(mThis.self.style, {
            height: `${Math.max(window.innerHeight - 90, 520)}px`,
            overflowY: "auto",
            overflowX: "hidden"
        });
    };

    mThis.escapeHtml = function (value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    mThis.money = function (value) {
        return "$" + Number(value || 0).toLocaleString();
    };

    mThis.percent = function (value) {
        return `${Number(value || 0)}%`;
    };

    mThis.getAlertStyle = function (level) {
        return ALERT_MAP[level] || ALERT_MAP.info;
    };

    mThis.getStatusStyle = function (level) {
        const item = mThis.getAlertStyle(level);

        return {
            color: item.color,
            soft: item.soft
        };
    };

    mThis.renderDashboard = function () {
        if (!mThis.self) {
            console.error("Dashboard root element was not found.");
            return;
        }

        const data = mThis.data;

        mThis.self.innerHTML = `
            <div class="meta-dashboard">
                ${mThis.renderCardTop(data)}
                <div class="row g-3">
                    ${mThis.renderKpis(data.kpis)}
                </div>
                <div class="row g-3 mt-1 pb-3">
                    <div class="col-12 col-xl-6">
                        ${mThis.renderTimeline(data.activities)}
                    </div>
					<div class="col-12 col-xl-6">
						${mThis.renderAnnouncementList({
							title: "Announcements",
							subtitle: "Latest updates and notices for tenants",
							pill: "Broadcast",
							items: data.announcements
						})}
					</div>
                </div>
            </div>
        `;

        mThis.state.rendered = true;

        mThis.updateHeight();
    };

    mThis.renderCardTop = function (data) {
    const h = mThis.escapeHtml;
    const summary = data.summary || {};

    return `
        <section class="md-hero">
            <div class="md-hero-inner">
                <div>
                    <div class="md-hero-eyebrow">
                       Welcome Back, ${tenantName}
                    </div>

                    <h1 class="md-hero-title">
                       Tenant Overview
                    </h1>

                    <div class="md-hero-subtitle">
                        Here's an overview of your rental space at Meta Tower.
                    </div>
                </div>

                <div class="md-hero-stats">

                    <div class="md-hero-stat">
                        <div class="md-hero-stat-value">
                           Active
                        </div>
                        <div class="md-hero-stat-label">
                            Lease Status
                        </div>
                    </div>

					<div class="md-hero-stat">
                        <div class="md-hero-stat-value">
                            Zone1
                        </div>
                        <div class="md-hero-stat-label">
                            Unit
                        </div>
                    </div>

                    <div class="md-hero-stat">
                        <div class="md-hero-stat-value">
                           $ 300
                        </div>
                        <div class="md-hero-stat-label">
                            Monthly Rent
                        </div>
                    </div>

                    

                </div>
            </div>
        </section>
    `;
};

    mThis.renderKpis = function (items) {
        const h = mThis.escapeHtml;

        return items.map(item => `
            <div class="col-12 col-md-6 col-xl-3">
                <article
                    class="md-card md-kpi-card"
                    style="--kpi-color:${item.color};--kpi-soft:${item.soft};"
                >
                    <div class="md-kpi-top">
                        <div>
                            <div class="md-kpi-title">${h(item.title)}</div>
                            <div class="md-kpi-value">${h(item.value)}</div>
                            <div class="md-kpi-note">${h(item.note)}</div>
                            <div class="md-kpi-trend">${h(item.trend)}</div>
                        </div>

                        <div class="md-kpi-icon">${h(item.icon)}</div>
                    </div>
                </article>
            </div>
        `).join("");
    };


    mThis.renderCollectionPerformance = function (items) {
        const h = mThis.escapeHtml;

        return `
            <section class="md-card md-section-card">
                <div class="md-section-header">
                    <div>
                        <h3 class="md-section-title">Collection Performance</h3>
                        <div class="md-section-subtitle">
                            Key operating indicators across billing streams
                        </div>
                    </div>

                    <div class="md-section-pill">Monthly</div>
                </div>

                <div class="md-progress-wrap">
                    ${items.map(item => `
                        <div class="md-progress-item">
                            <div class="md-progress-label">
                                <span>${h(item.title)}</span>
                                <span class="md-progress-value">${h(item.value)}%</span>
                            </div>

                            <div class="md-progress-track">
                                <div
                                    class="md-progress-bar"
                                    style="
                                        width:${Number(item.value || 0)}%;
                                        --bar-color:${item.color};
                                        --bar-soft:${item.soft};
                                    "
                                ></div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    };
	mThis.renderAnnouncementList = function (config) {
    const h = mThis.escapeHtml;
    const configSafe = config || {};
    const items = configSafe.items || [];

    return `
        <section class="md-card md-section-card">
            <div class="md-section-header">
                <div>
                    <h3 class="md-section-title">
                        ${h(configSafe.title || "Announcements")}
                    </h3>

                    <div class="md-section-subtitle">
                        ${h(configSafe.subtitle || "Latest notices and updates for tenants")}
                    </div>
                </div>

                <div class="md-section-pill">
                    ${h(configSafe.pill || "Broadcast")}
                </div>
            </div>

            <div class="md-list">
                ${
                    items.length
                        ? items.map(item => {
                            const style = mThis.getAlertStyle(item.level || "info");

                            return `
                                <div class="md-insight-item">
                                    <span
                                        class="md-dot"
                                        style="
                                            --dot-color:${style.color};
                                            --dot-soft:${style.soft};
                                        "
                                    ></span>

                                    <div>
                                        <div class="md-list-title">
                                            ${h(item.title)}
                                        </div>

                                        <div class="md-list-note">
                                            ${h(item.note)}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join("")
                        : `
                            <div class="md-empty">
                                No announcements available
                            </div>
                        `
                }
            </div>
        </section>
    `;
};


    mThis.renderTimeline = function (items) {
    const h = mThis.escapeHtml;

    const getText = (item) => {
        if (item.type === "payment") {
            return `${item.tenant} paid invoice ${item.ref}`;
        }

        if (item.type === "lease") {
            return `${item.tenant} ${item.action}`;
        }

        return item.text || "";
    };

    return `
        <section class="md-card md-section-card">
            <div class="md-section-header">
                <div>
                    <h3 class="md-section-title">
                        Tenant Activities
                    </h3>

                    <div class="md-section-subtitle">
                        Billing, lease, and tenant transactions
                    </div>
                </div>

                <div class="md-section-pill">
                    Live
                </div>
            </div>

            <div class="md-timeline">
                ${
                    items?.length
                        ? items.map(item => `
                            <div class="md-timeline-item">
                                <div class="md-timeline-time">
                                    ${h(item.time)}
                                </div>

                                <div class="md-timeline-content">
                                    ${h(getText(item))}
                                </div>
                            </div>
                        `).join("")
                        : `
                            <div class="md-empty">
                                No recent tenant activities
                            </div>
                        `
                }
            </div>
        </section>
    `;
};



    mThis.refresh = function (data) {
        if (data && typeof data === "object") {
            mThis.data = {
                ...mThis.data,
                ...data
            };
        }

        mThis.renderDashboard();
    };

    mThis.show = function () {
        mThis.init();

        if (!mThis.self) {
            console.error("Dashboard root element was not found.");
            return;
        }

        main_view.setContentView(mThis.self, mThis.title_prop);

        mThis.renderDashboard();
    };

    return mThis;
})();
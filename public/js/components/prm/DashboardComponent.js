"use strict";

var DashboardComponent =  (() =>{
    const mThis = {};

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
   
    
    mThis.state = {
        initialized: false,
        stylesInjected: false,
        resizeBound: false,
        rendered: false
    };
   
    mThis.charts = Object.create(null);

    // mThis.data = {
    //     period: "June 2026",
    //     summary: {
    //         occupancy_rate: 92,
    //         occupied_spaces: 128,
    //         total_spaces: 139,
    //         active_tenants: 54,
    //         new_tenants: 3,
    //         monthly_revenue: 86520,
    //         revenue_growth: 8.4,
    //         outstanding_amount: 23480,
    //         overdue_invoices: 18,
    //         collection_rate: 96
    //     },

    //     mini_stats: [
    //         {
    //             label: "Average Lease Term",
    //             value: "2.8 yrs"
    //         },
    //         {
    //             label: "Revenue / Tenant",
    //             value: "$1,602"
    //         },
    //         {
    //             label: "Vacant Spaces",
    //             value: "11"
    //         },
    //         {
    //             label: "Payments Today",
    //             value: "12"
    //         }
    //     ],

    //     kpis: [
    //         {
    //             key: "occupancy",
    //             title: "Occupancy Rate",
    //             value: "92%",
    //             note: "128 / 139 spaces occupied",
    //             trend: "↑ +2% this month",
    //             icon: "🏢",
    //             color: COLORS.violet,
    //             soft: "rgba(79,70,229,.11)"
    //         },
    //         {
    //             key: "tenants",
    //             title: "Active Tenants",
    //             value: "54",
    //             note: "Registered companies",
    //             trend: "+3 new tenants",
    //             icon: "👥",
    //             color: COLORS.success,
    //             soft: "rgba(16,185,129,.12)"
    //         },
    //         {
    //             key: "revenue",
    //             title: "Monthly Revenue",
    //             value: "$86,520",
    //             note: "Rent + utilities + service fees",
    //             trend: "↑ 8.4% vs last month",
    //             icon: "💳",
    //             color: COLORS.info,
    //             soft: "rgba(14,165,233,.12)"
    //         },
    //         {
    //             key: "receivables",
    //             title: "Outstanding Receivables",
    //             value: "$23,480",
    //             note: "18 overdue invoices",
    //             trend: "Collection follow-up required",
    //             icon: "⚠",
    //             color: COLORS.danger,
    //             soft: "rgba(239,68,68,.12)"
    //         }
    //     ],

    //     occupancy_by_floor: [
    //         { floor: "Floor 1", occupied: 95, available: 5 },
    //         { floor: "Floor 2", occupied: 87, available: 13 },
    //         { floor: "Floor 3", occupied: 100, available: 0 },
    //         { floor: "Floor 4", occupied: 91, available: 9 },
    //         { floor: "Floor 5", occupied: 84, available: 16 },
    //         { floor: "Floor 6", occupied: 97, available: 3 },
    //         { floor: "Floor 7", occupied: 89, available: 11 }
    //     ],

    //     revenue_trend: {
    //         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    //         rent: [68000, 70000, 73500, 76000, 82000, 86520],
    //         electricity: [9000, 10000, 11000, 10500, 11500, 12000],
    //         service_fee: [5000, 5300, 5600, 5900, 6200, 6500]
    //     },

    //     invoice_status: {
    //         labels: ["Paid", "Pending", "Overdue"],
    //         values: [72, 18, 10]
    //     },

    //     revenue_breakdown: {
    //         labels: ["Rent", "Electricity", "Service Fee"],
    //         values: [72, 18, 10]
    //     },

    //     collection_kpis: [
    //         {
    //             title: "Rent Collection",
    //             value: 96,
    //             color: COLORS.violet,
    //             soft: "#818CF8"
    //         },
    //         {
    //             title: "Electricity Collection",
    //             value: 94,
    //             color: COLORS.success,
    //             soft: "#34D399"
    //         },
    //         {
    //             title: "Service Fee Collection",
    //             value: 92,
    //             color: COLORS.warning,
    //             soft: "#FBBF24"
    //         },
    //         {
    //             title: "Occupancy Rate",
    //             value: 91,
    //             color: COLORS.info,
    //             soft: "#38BDF8"
    //         },
    //         {
    //             title: "Lease Renewal",
    //             value: 88,
    //             color: COLORS.danger,
    //             soft: "#FB7185"
    //         }
    //     ],

    //     insights: [
    //         {
    //             level: "success",
    //             title: "Occupancy remains above 90%",
    //             note: "Meta Tower continues to perform above target."
    //         },
    //         {
    //             level: "success",
    //             title: "Revenue increased 8.4%",
    //             note: "Growth is mainly driven by rental and electricity billing."
    //         },
    //         {
    //             level: "warning",
    //             title: "4 lease agreements expire within 30 days",
    //             note: "Renewal follow-up should be prioritized."
    //         },
    //         {
    //             level: "danger",
    //             title: "18 invoices remain overdue",
    //             note: "Collection team should review high-risk accounts."
    //         }
    //     ],

    //     alerts: [
    //         {
    //             level: "danger",
    //             title: "18 overdue invoices",
    //             note: "Requires collection follow-up."
    //         },
    //         {
    //             level: "warning",
    //             title: "3 utility readings pending",
    //             note: "Electricity billing is not fully completed."
    //         },
    //         {
    //             level: "success",
    //             title: "12 payments received today",
    //             note: "Cash collection has been updated."
    //         }
    //     ],

    //     activities: [
    //         {
    //             text: "ABC Consulting paid invoice INV-24081",
    //             time: "10:45 AM"
    //         },
    //         {
    //             text: "XYZ Ltd renewed lease contract",
    //             time: "09:30 AM"
    //         },
    //         {
    //             text: "June electricity bills generated",
    //             time: "Yesterday"
    //         },
    //         {
    //             text: "New tenant moved into Floor 6",
    //             time: "Yesterday"
    //         }
    //     ],

    //     lease_expiry: [
    //         {
    //             tenant: "ABC Consulting",
    //             floor: "5",
    //             expiry: "15 Jul",
    //             status: "Due Soon",
    //             level: "warning"
    //         },
    //         {
    //             tenant: "XYZ Ltd",
    //             floor: "7",
    //             expiry: "20 Jul",
    //             status: "Pending",
    //             level: "info"
    //         },
    //         {
    //             tenant: "Meta Lab",
    //             floor: "2",
    //             expiry: "28 Jul",
    //             status: "Review",
    //             level: "success"
    //         }
    //     ]
    // };

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

    mThis.renderDashboard = function (data) {
        if (!mThis.self) {
            console.error("Dashboard root element was not found.");
            return;
        }
      
        mThis.self.innerHTML = `
            <div class="meta-dashboard">
                ${mThis.renderHero(data)}

                ${mThis.renderMiniStats(data.mini_stats)}

                <div class="row g-3">
                    ${mThis.renderKpis(data.kpis)}
                </div>

                <div class="row g-3 mt-1">
                    <div class="col-12 col-xl-6">
                        ${mThis.renderChartCard({
                            title: "Occupancy by Floor",
                            subtitle: "Occupied, Booked and Available Units",
                            pill: "Meta Tower",
                            canvasId: "chartOccupancy"
                        })}
                    </div>

                    <div class="col-12 col-xl-6">
                        ${mThis.renderChartCard({
                            title: "Revenue Trend",
                            subtitle: "Rent, electricity, and service fee revenue",
                            pill: "Monthly",
                            canvasId: "chartRevenue"
                        })}
                    </div>
                </div>

                <div class="row g-3 mt-1">
                    <div class="col-12 col-xl-6">
                        ${mThis.renderChartCard({
                            title: "Invoice Status",
                            subtitle: "Paid, pending, and overdue invoice distribution",
                            pill: "Billing",
                            canvasId: "chartInvoiceStatus"
                        })}
                    </div>

                    <div class="col-12 col-xl-6">
                        ${mThis.renderChartCard({
                            title: "Revenue Breakdown",
                            subtitle: "Contribution by rental and utility streams",
                            pill: "Revenue Mix",
                            canvasId: "chartRevenueBreakdown"
                        })}
                    </div>
                </div>

                <div class="row g-3 mt-1">
                    <div class="col-12 col-xl-6">
                        ${mThis.renderCollectionPerformance(data.collection_kpis)}
                    </div>

                    <div class="col-12 col-xl-6">
                        ${mThis.renderInsightList({
                            title: "Executive Insights",
                            subtitle: "Management-level interpretation of current performance",
                            pill: "AI Style",
                            items: data.insights
                        })}
                    </div>
                </div>

                <div class="row g-3 mt-1 pb-3">
                    <div class="col-12 col-xl-6">
                        ${mThis.renderTimeline(data.activities)}
                    </div>

                    <div class="col-12 col-xl-6">
                        ${mThis.renderLeaseExpiry(data.lease_expiry)}
                    </div>
                </div>
            </div>
        `;

        mThis.state.rendered = true;

        mThis.updateHeight();
        mThis.initCharts(data);
    };
    mThis.initFilterForm = ()=>{
         if (mThis.filterConfig) return;

    mThis.lnkFilterButton = document.getElementById("dashboard_filter_btn");
        mThis.filterConfig = mThis.filterConfig || new FilterPanel({
            cssClass:null,
            triggerButton: mThis.lnkFilterButton,
            fields:[
                {
                    "firstOption":{value:'',label:'(All Period)'},
                    "name":"period",
                    "label":"Period",
                    "valueField":"department_id",
                    "textField":"academic_year",
                    "data":"academic_years",
                },
                {
                    "firstOption":{value:'',label:'(All Building)'},
                    "name":"building_id",
                    "label":"Building",
                    "valueField":"id",
                    "textField":"building",
                    "data":"buildings",

                },
                
            ],
            onShow: (me, apiData) => {
                vsapi.call(`${main_view.base_url}/prm/dashboard/filter-options`, {}, null, { loader: false }).then(res => {
                    if (res.status_code === 200) {
                        const d = res.data;
                        VSUtil.setComboItems(me.controls.period, d.period, 'value', 'label',null,null,null);
                        VSUtil.setComboItems(me.controls.building_id, d.buildings, 'id', 'building', '', 'All Building', null);
                    } 
                });

                // me.controls.department_id.addEventListener("change", (e) => {
                //     e.preventDefault();

                //     vsapi.call(`${main_view.base_url}/api/settings/options-program`, {
                //     department_id: e.target.value
                //     }, null, { loader: false }).then(res => {

                //     if (res.status_code === 200) {
                //         const programs = res.data;
                //         VSUtil.setComboItems(me.controls.program_id, programs, 'id', 'program_name', '', 'All Program', null);
                //     } else {
                //         cv_interact.error("Failed to load program.");
                //     }
                //     });
                // });
            },

            onSelect:(me, data)=>{
               console.log(89,data);
               
               mThis.currentFilterProps = {
                    building_id: data.building_id || null,
                    period: data.period || null
                };

                mThis.loadDashboard(mThis.currentFilterProps);
            },
        });
    };
    mThis.renderHero = function (data) {
        const h = mThis.escapeHtml;
        const summary = data.summary;

        return `
            <section class="md-hero">
                <div class="md-hero-inner">
                    <div>
                        <div class="md-hero-eyebrow">
                           <span>Executive Review · ${h(data.period)}</span><i class="fa-solid fa-filter ps-2 fs-6 ms-auto cursor-pointer" id="_db_filter_prm_data"></i>
                        </div>

                        <h1 class="md-hero-title">
                            Meta Tower Performance Dashboard
                        </h1>

                        <div class="md-hero-subtitle">
                            Strategic overview for occupancy, rental revenue, invoicing,
                            billing, electricity service fees, and collection performance.
                        </div>
                    </div>

                    <div class="md-hero-stats">
                        <div class="md-hero-stat">
                            <div class="md-hero-stat-value">
                                ${h(summary.occupancy_rate)}%
                            </div>
                            <div class="md-hero-stat-label">
                                Occupancy
                            </div>
                        </div>

                        <div class="md-hero-stat">
                            <div class="md-hero-stat-value">
                                ${mThis.money(summary.monthly_revenue)}
                            </div>
                            <div class="md-hero-stat-label">
                                Monthly Revenue
                            </div>
                        </div>

                        <div class="md-hero-stat">
                            <div class="md-hero-stat-value">
                                ${h(summary.collection_rate)}%
                            </div>
                            <div class="md-hero-stat-label">
                                Collection Rate
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    };

    mThis.renderMiniStats = function (items) {
        const h = mThis.escapeHtml;

        return `
            <div class="md-mini-grid">
                ${items.map(item => `
                    <div class="md-mini-stat">
                        <div class="md-mini-value">${h(item.value)}</div>
                        <div class="md-mini-label">${h(item.label)}</div>
                    </div>
                `).join("")}
            </div>
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

    mThis.renderChartCard = function (config) {
        const h = mThis.escapeHtml;

        return `
            <section class="md-card md-section-card">
                <div class="md-section-header">
                    <div>
                        <h3 class="md-section-title">${h(config.title)}</h3>
                        <div class="md-section-subtitle">${h(config.subtitle)}</div>
                    </div>

                    <div class="md-section-pill">${h(config.pill || "")}</div>
                </div>

                <div class="md-chart-body">
                    <canvas id="${h(config.canvasId)}"></canvas>
                </div>
            </section>
        `;
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

    mThis.renderInsightList = function (config) {
        const h = mThis.escapeHtml;

        return `
            <section class="md-card md-section-card">
                <div class="md-section-header">
                    <div>
                        <h3 class="md-section-title">${h(config.title)}</h3>
                        <div class="md-section-subtitle">${h(config.subtitle)}</div>
                    </div>

                    <div class="md-section-pill">${h(config.pill)}</div>
                </div>

                <div class="md-list">
                    ${config.items.map(item => {
                        const style = mThis.getAlertStyle(item.level);

                        return `
                            <div class="md-insight-item">
                                <span
                                    class="md-dot"
                                    style="--dot-color:${style.color};--dot-soft:${style.soft};"
                                ></span>

                                <div>
                                    <div class="md-list-title">${h(item.title)}</div>
                                    <div class="md-list-note">${h(item.note)}</div>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </section>
        `;
    };

    mThis.renderTimeline = function (items) {
        const h = mThis.escapeHtml;

        return `
            <section class="md-card md-section-card">
                <div class="md-section-header">
                    <div>
                        <h3 class="md-section-title">Recent Activity Timeline</h3>
                        <div class="md-section-subtitle">
                            Latest billing, lease, and tenant events
                        </div>
                    </div>

                    <div class="md-section-pill">Latest</div>
                </div>

                <div class="md-timeline">
                    ${items.map(item => `
                        <div class="md-timeline-item">
                            <div class="md-timeline-time">${h(item.time)}</div>
                            <div class="md-timeline-content">${h(item.text)}</div>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    };

    mThis.renderLeaseExpiry = function (rows) {
        const h = mThis.escapeHtml;

        return `
            <section class="md-card md-section-card">
                <div class="md-section-header">
                    <div>
                        <h3 class="md-section-title">Upcoming Lease Expiry</h3>
                        <div class="md-section-subtitle">
                            Contracts requiring renewal review
                        </div>
                    </div>

                    <div class="md-section-pill">30 Days</div>
                </div>

                <div class="table-responsive">
                    <table class="md-table">
                        <thead>
                            <tr>
                                <th>Tenant</th>
                                <th>Floor</th>
                                <th>Expiry</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${rows.map(row => {
                                const style = mThis.getStatusStyle(row.level);

                                return `
                                    <tr>
                                        <td>${h(row.tenant)}</td>
                                        <td>Floor ${h(row.floor)}</td>
                                        <td>${h(row.expiry)}</td>
                                        <td>
                                            <span
                                                class="md-status-pill"
                                                style="
                                                    --status-color:${style.color};
                                                    --status-soft:${style.soft};
                                                "
                                            >
                                                ${h(row.status)}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    };

    mThis.destroyCharts = function () {
        Object.keys(mThis.charts).forEach(key => {
            const chart = mThis.charts[key];

            if (chart) {
                chart.destroy();
                mThis.charts[key] = null;
            }
        });
    };

mThis.initCharts = function (data) {

    mThis.destroyCharts();

    mThis.createOccupancyChart(data.occupancy_by_floor || []);
    mThis.createRevenueChart(data.revenue_trend || {});
    mThis.createInvoiceStatusChart(data.invoice_status || {});
    mThis.createRevenueBreakdownChart(data.revenue_breakdown || {});
};


mThis.chartOptions = function () {
    return {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 120,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 18,
                    color: COLORS.muted,
                    font: {
                        size: 12,
                        weight: "700"
                    }
                }
            }
        }
    };
};

   mThis.createOccupancyChart = function (data) {

    const canvas = document.getElementById("chartOccupancy");
    if (!canvas) return;

    const rows = (data || []).map(r => ({
        floor: r.floor,
        occupied: Number(r.occupied || 0),
        available: Number(r.available || 0),
        booked: Number(r.booked || 0)
    }));

    mThis.charts.occupancy = new Chart(canvas, {
        type: "bar",
        data: {
            labels: rows.map(r => r.floor),
            datasets: [
                {
                    label: "Occupied",
                    data: rows.map(r => r.occupied),
                    backgroundColor: "rgb(48 45 89)",
                    borderRadius: 8,
                    categoryPercentage: 0.5,
                    barPercentage: 0.7
                    
                },
                {
                    label: "Booked",
                    data: rows.map(r => r.booked),
                    backgroundColor: "rgb(85 120 214)",
                    borderRadius: 8,
                    categoryPercentage: 0.5,
                    barPercentage: 0.7
                },
                {
                    label: "Available",
                    data: rows.map(r => r.available),
                    backgroundColor: "rgb(10 187 135)",
                    borderRadius: 8,
                    categoryPercentage: 0.5,
                    barPercentage: 0.7
                }
            ]
        },
        options: {
            ...mThis.chartOptions(),
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    max: 100,
                    beginAtZero: true,
                    ticks: {
                        callback: value => value + "%"
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.raw}`
                    }
                }
            }
        }
    });
};

   mThis.createRevenueChart = function (data = {}) {

    const canvas = document.getElementById("chartRevenue");
    if (!canvas) return;

    const trend = data || {};

    mThis.charts.revenue = new Chart(canvas, {
        type: "line",
        data: {
            labels: trend.labels || [],
            datasets: [
                {
                    label: "Rent",
                    data: trend.rent || [],
                    borderColor: COLORS.violet,
                    backgroundColor: "rgba(79,70,229,.08)",
                    fill: true,
                    tension: .42,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderWidth: 3
                },
                {
                    label: "Electricity",
                    data: trend.utility || [],
                    borderColor: COLORS.info,
                    backgroundColor: "rgba(14,165,233,.07)",
                    fill: true,
                    tension: .42,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderWidth: 3
                },
                {
                    label: "Service Fee",
                    data: trend.service_fee || [],
                    borderColor: COLORS.success,
                    backgroundColor: "rgba(16,185,129,.07)",
                    fill: true,
                    tension: .42,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderWidth: 3
                },
                {
                    label: "Service Request",
                    data: trend.service_request || [],
                    borderColor: COLORS.success,
                    backgroundColor: "rgba(16,185,129,.07)",
                    fill: true,
                    tension: .42,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderWidth: 3
                }
            ]
        },
        options: {
            ...mThis.chartOptions(),

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {
                ...mThis.chartOptions().plugins,
                tooltip: {
                    callbacks: {
                        label: ctx =>
                            `${ctx.dataset.label}: ${mThis.money(ctx.raw)}`
                    }
                }
            },

            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: COLORS.muted }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "#EEF2F7" },
                    ticks: {
                        color: COLORS.muted,
                        callback: value => "$" + Number(value).toLocaleString()
                    }
                }
            }
        }
    });
};

   mThis.createInvoiceStatusChart = function (data = {}) {

    const canvas = document.getElementById("chartInvoiceStatus");
    if (!canvas) return;

    const chartData = data || { labels: [], values: [] };

    mThis.charts.invoiceStatus = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: chartData.labels || [],
            datasets: [
                {
                    data: chartData.values || [],
                    backgroundColor: [
                        COLORS.success,   // Paid
                        COLORS.warning,   // Pending
                        COLORS.info,      // Partially Paid
                        COLORS.danger     // Overdue
                    ],
                    borderColor: "#fff",
                    borderWidth: 5,
                    hoverOffset: 8
                }
            ]
        },
        options: {
            ...mThis.chartOptions(),
            cutout: "68%",

            plugins: {
                ...mThis.chartOptions().plugins,
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw}%`
                    }
                }
            }
        }
    });
};

  mThis.createRevenueBreakdownChart = function (data = {}) {

    const canvas = document.getElementById("chartRevenueBreakdown");
    if (!canvas) return;

    const chartData = data || { labels: [], values: [] };

    mThis.charts.revenueBreakdown = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: chartData.labels || [],
            datasets: [
                {
                    data: chartData.values || [],
                    backgroundColor: [
                        COLORS.violet,
                        COLORS.info,
                        COLORS.success
                    ],
                    borderColor: "#fff",
                    borderWidth: 5,
                    hoverOffset: 8
                }
            ]
        },
        options: {
            ...mThis.chartOptions(),
            cutout: "68%",

            plugins: {
                ...mThis.chartOptions().plugins,
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw}%`
                    }
                }
            }
        }
    });
};
    // mThis.refresh = function (data) {
    //     if (data && typeof data === "object") {
    //         mThis.data = {
    //             ...mThis.data,
    //             ...data
    //         };
    //     }

    //     mThis.renderDashboard();
    // };
//     mThis.loadDashboard = async function () {

//     const filter = {
//         building_id: mThis.building_id,
//         period:mThis.period
//     };

//     const [summary, charts, activities, leaseExpiry] = await Promise.all([
//         vsapi.call(`${main_view.base_url}/prm/dashboard/summary`, filter),
//         vsapi.call(`${main_view.base_url}/prm/dashboard/charts`, filter),
//         vsapi.call(`${main_view.base_url}/prm/dashboard/activities`, filter),
//         vsapi.call(`${main_view.base_url}/prm/dashboard/lease-expiry`, filter)
//     ]);

//     mThis.renderDashboard({
//         ...(summary.data || {}),
//         ...(charts.data || {}),
//         ...(activities.data || {}),
//         ...(leaseExpiry.data || {})
//     });
// };
mThis.loadDashboard = async function (filter = {}) {

    const payload = {
        building_id: filter.building_id || null,
        period: filter.period || null
    };

    const [summary, charts, activities, leaseExpiry] = await Promise.all([
        vsapi.call(`${main_view.base_url}/prm/dashboard/summary`, payload),
        vsapi.call(`${main_view.base_url}/prm/dashboard/charts`, payload),
        vsapi.call(`${main_view.base_url}/prm/dashboard/activities`, payload),
        vsapi.call(`${main_view.base_url}/prm/dashboard/lease-expiry`, payload)
    ]);

    mThis.renderDashboard({
        ...(summary.data || {}),
        ...(charts.data || {}),
        ...(activities.data || {}),
        ...(leaseExpiry.data || {})
    });
};
mThis.loadDefaultFilter = function () {

    vsapi.call(`${main_view.base_url}/prm/dashboard/filter-options`, {}, null, { loader: false })
        .then(res => {

            if (res.status_code !== 200) return;

            const d = res.data;

            mThis.currentFilterProps = {
                building_id: d.buildings?.[0]?.id || null,
                period: d.period?.[0]?.value || null
            };

            mThis.loadDashboard(mThis.currentFilterProps);
        });
};
//    mThis.loadDefaultFilter = function () {

//     vsapi.call(`${main_view.base_url}/prm/dashboard/filter-options`, {}, null, { loader: false })
//         .then(res => {

//             if (res.status_code !== 200) return;

//             mThis.db_filter = {
//                 building_id: mThis.building_id
//             };

//             mThis.loadDashboard(mThis.db_filter);
//         });
// };
   mThis.show = function () {

    mThis.init();

    if (!mThis.self) {
        console.error("Dashboard root element was not found.");
        return;
    }

    main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.initFilterForm();

    mThis.loadDefaultFilter();
};

    return mThis;
})();
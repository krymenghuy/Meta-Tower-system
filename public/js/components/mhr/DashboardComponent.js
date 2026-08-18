"use strict";

var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "dashboard";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_dashboardComponent");
    main_view.divTitle = main_view.divTitle || document.querySelector('#screen_title_wrapper'); 

    // *** When DashboardComponent is showing, create Dashboard Filter button near page title
    // mThis.onShow = (options) => {
    //     if (!AuthManager.allowed(254,true)) return;
    //     mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
    //     const btn = main_view.divTitle.querySelector(".btn-db-fitler");
    //     if (!btn) return; 
    //     main_view.divTitle.insertAdjacentHTML(
    //         "beforeend",
    //         '<div class="d-none div-db-filter w-100 text-end"><button class="btn-db-fitler btn btn-sm btn-primary-custom rounded-circle p-2"><i class="fa-solid text-white fa-paper-plane"></i></button></div>'
    //     );
    //     btn = main_view.divTitle.querySelector(".btn-db-fitler");
    //     mThis.createFilterButton(btn);
    // };

    // *** When DashboardComponent is closing, remove Dashboard Filter button near page title
    mThis.onHide = (options) => {

    if (!AuthManager.allowed(254,true)) return;
        mThis.removeFilterButton();
    };

    mThis.init = () => {
        if (mThis.initAlready) return;
        // if(AuthManager.allowed(254,true)){
            mThis.dbChartAll = mThis.self.querySelector("#dbChart_all_top");
            mThis.dbCards = mThis.self.querySelector("#db_cards");
            mThis.db_card_bottom = mThis.self.querySelector("#_db_card_bottom");
            mThis.dashboard_Bottom_left = mThis.self.querySelector("#_dashboard_bottom_left");
            mThis.dbCardOnLeave = mThis.self.querySelector("#_db_card_onLeave");
        // }
        mThis.initAlready = true;
    };

    mThis.removeFilterButton = () => {
        const divTitle = main_view.divTitle;
        const div = divTitle.querySelector("div.div-db-filter");
        if (div) div.remove();
    };

    mThis.createFilterButton = (btn) => {
        mThis.filterConfig = null;
        mThis.filterConfig = new FilterPanel({
            triggerButton: btn,
            fields: [
                {
                    name: "year",
                    label: "Year",
                    valueField: "year",
                    textField: "year",
                    defaultValue: 2024,
                    data: [{ year: 2024 }, { year: 2025 }],
                },
                {
                    name: "month",
                    label: "Month",
                    // "valueField":"value",
                    // "textField":"label",
                    data: [
                        { value: "mThis_month", label: "This month" },
                        { value: "last_month", label: "Last month" },
                    ],
                },
            ],
            // "createContent":()=>{
            //     return [
            //         '<div class="d-flex flex-column p-3">',
            //            '<div>',
            //                 '<label class="form-label" vs-lang="titles.Date">Date</label>',
            //                 '<div><input class="form-control" /></div>',
            //            '</div>',
            //            '<div>',
            //               '<label class="form-label" vs-lang="titles.Branch">Branch</label>',
            //               '<div><select class="form-control"> </select></div>',
            //            '</div>',
            //         '</div>',
            //     ].join('');
            // },
            contentCreated: (me) => {
            },
            onSelect: (me, data) => {
            },
        });
    };

    mThis.renderDBChartAllTop = (data) => {

    data = data || {};

    const doughnut = data.doughnutChart || {};
    const cards = data.cards || {};

    const newStaff = cards.new_staff_count || {};
    const resigningStaff = cards.resigning_staff_count || {};
    const resignedStaff = cards.resigned_staff_count || {};

    let html = `
        <div class="row py-3">

            <!-- Employee Status -->
            <div class="col-12 col-lg-3">
                <div class="dashboard_chart">

                    <div class="chart-title">
                        ${doughnut.title || 'Employee Overview'}
                    </div>

                    <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                        <canvas id="doughnutChart"></canvas>
                    </div>

                </div>
            </div>


            <!-- Monthly Payroll -->
            <div class="col-12 col-lg-6">
                <div class="dashboard_chart">

                    <div class="chart-title">
                        Monthly Payroll Expenses
                        <small class="text-muted fw-normal">
                            (Last 12 Months)
                        </small>
                    </div>

                    <div class="flex-grow-1">
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>

                </div>
            </div>


            <!-- Employee Movement -->
            <div class="col-12 col-lg-3">

                <div class="dashboard_chart">

                    <div class="chart-title">
                        Employee Movement
                    </div>
                    <div class="dashboard-movement-card mb-2">
                        <div class="bg--icon">
                            <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/team.svg" alt="New Staff">
                        </div>
                        <div class="ms-3 flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="fw-bold text-primary fs-4">${newStaff.count ?? 0}</span>
                                <span class="badge bg-info text-white">New Staff</span>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-movement-card mb-2">
                        <div class="bg--icon">
                            <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/letter.svg" alt="Resigning Staff">
                        </div>
                        <div class="ms-3 flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="fw-bold text-warning fs-5">${resigningStaff.count ?? 0}</span>
                                <span class="badge bg-warning text-white">Resigning</span>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-movement-card">
                        <div class="bg--icon">
                            <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/stop-work.svg" alt="Resigned Staff">
                        </div>
                        <div class="ms-3 flex-grow-1">
                            <div class="d-flex align-items-center justify-content-between">
                                <span class="fw-bold text-danger fs-5">
                                    ${resignedStaff.count ?? 0}
                                </span>
                                <span class="badge bg-danger text-white">Resigned</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    `;

    mThis.dbChartAll.innerHTML = html;

    // Render charts AFTER HTML exists
    mThis.renderChartEmployee(doughnut);
    mThis.employeeSalaryChart(data.barCharts || {});
};

    mThis.renderChartEmployee = (data) => {

    data = data || {};

    const canvas = document.getElementById("doughnutChart");

    if (!canvas) return;

    const oldChart = Chart.getChart(canvas);

    if (oldChart) {
        oldChart.destroy();
    }

    const ctx = canvas.getContext("2d");

    const labels = data.labels || [];
    const values = data.values || [];

    const colors = data.colors && data.colors.length
        ? data.colors
        : [
            "#2b3991",
            "#27b7ff",
            "#cab54a",
            "#f44336",
            "#32bcd3",
            "#9219ff"
        ];

    new Chart(ctx, {

        type: "doughnut",

        data: {
            labels: labels,

            datasets: [
                {
                    data: values,

                    backgroundColor: colors,

                    borderColor: "#ffffff",

                    borderWidth: 3,

                    hoverOffset: 5
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {
                    position: "bottom",

                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 12,
                        boxWidth: 8,

                        font: {
                            size: 11
                        }
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function (tooltipItem) {

                            const label = tooltipItem.label || "";
                            const value = tooltipItem.raw || 0;

                            return `${label}: ${value} នាក់`;
                        }
                    }
                },

                datalabels: {

                    color: "#ffffff",

                    font: {
                        size: 11,
                        weight: "600"
                    },

                    formatter: function (value) {

                        return value > 0
                            ? `${value}`
                            : "";
                    }
                }
            }
        }
    });
};
    mThis.employeeSalaryChart = (data) => {

    data = data || {};

    const canvas = document.getElementById("employeeSalaryChart");

    if (!canvas) return;

    const oldChart = Chart.getChart(canvas);

    if (oldChart) {
        oldChart.destroy();
    }

    let labels = [...(data.labels || [])];
    let employees = [...(data.employee_counts || [])];
    let salaries = [...(data.total_salaries || [])];

    while (labels.length < 12) {
        labels.push("_");
        employees.push(0);
        salaries.push(0);
    }

    labels = labels.slice(0, 12);
    employees = employees.slice(0, 12);
    salaries = salaries.slice(0, 12);


    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {
                    type: "bar",

                    label: "Salary Paid",

                    data: salaries,

                    backgroundColor: "#cab54a",

                    borderRadius: 5,

                    borderSkipped: false,

                    yAxisID: "salary"
                },

                {
                    type: "line",

                    label: "Employees",

                    data: employees,

                    borderColor: "#2b3991",

                    backgroundColor: "#2b3991",

                    borderWidth: 2,

                    pointRadius: 3,

                    pointHoverRadius: 5,

                    tension: 0.35,

                    fill: false,

                    yAxisID: "employees"
                }

            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        boxWidth: 8
                    }
                },

                tooltip: {

                    callbacks: {

                        label: function (context) {

                            const value = context.raw || 0;

                            if (context.dataset.yAxisID === "salary") {

                                return ` Salary: ${
                                    VSMoney.symbol("USD") +
                                    VSMoney.formatAmount(value)
                                }`;

                            }

                            return ` Employees: ${value}`;
                        }
                    }
                }
            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },

                employees: {

                    type: "linear",

                    position: "left",

                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Employees"
                    },

                    grid: {
                        color: "rgba(0,0,0,.05)"
                    }
                },

                salary: {

                    type: "linear",

                    position: "right",

                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Salary (USD)"
                    },

                    grid: {
                        drawOnChartArea: false
                    },

                    ticks: {

                        callback: function (value) {

                            if (value >= 1000000) {
                                return (value / 1000000) + "M";
                            }

                            if (value >= 1000) {
                                return (value / 1000) + "K";
                            }

                            return value;
                        }
                    }
                }
            }
        }
    });
};

    mThis.renderDBCards = (data) => {

    data = data || {};

    const cards = data.cards || {};

    const items = [

        {
            key: "exit_form_count",
            title: "Exit Forms",
            color: "#f59e0b",
            status: "Pending"
        },

        {
            key: "intern_staff_count",
            title: cards.intern_staff_count?.title || "Intern Staff",
            color: "#cab54a"
        },

        {
            key: "warning_staff_count",
            title: cards.warning_staff_count?.title || "Warning Staff",
            color: "#f44336"
        },

        {
            key: "probation_staff_count",
            title: cards.probation_staff_count?.title || "Probation Staff",
            color: "#32bcd3"
        }

    ];

    const html = items.map(item => {

        const card = cards[item.key] || {};
        const count = card.count ?? 0;

        return `
            <div class="col-12 col-sm-6 col-lg-3">

                <div class="card-db">

                    <div
                        class="position-relative flex-shrink-0"
                        style="width:60px;height:60px;"
                    >

                        <svg
                            viewBox="0 0 36 36"
                            class="circular-chart"
                        >

                            <path
                                d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#edf0f3"
                                stroke-width="4"
                            />

                            <path
                                d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="${item.color}"
                                stroke-width="4"
                                stroke-dasharray="75, 100"
                                stroke-linecap="round"
                            />

                        </svg>

                        <div
                            class="position-absolute top-50 start-50 translate-middle fw-bold"
                            style="color:${item.color};"
                        >
                            ${count}
                        </div>

                    </div>


                    <div class="ms-3">

                        <div class="fw-semibold text-primary">
                            ${item.title}
                        </div>

                        ${
                            item.status
                                ? `
                                <small class="text-warning">
                                    ${item.status}
                                </small>
                                `
                                : `
                                <small class="text-muted">
                                    Staff
                                </small>
                                `
                        }

                    </div>

                </div>

            </div>
        `;

    }).join("");

    mThis.dbCards.innerHTML = `
        <div class="row g-3">
            ${html}
        </div>
    `;
};

    mThis.renderDBCardBottom = (data) => {

    data = data || {};

    const tableLeave = mThis.renderDBCardOnLeave(data.onLeave || []);
    const tableBenefit = mThis.renderDBCardBenefit(data.benefits || []);
    const payroll = data.accounts?.payrolls || {};
    const wallets = data.accounts?.wallets || {};
    const master = data.accounts?.master_balance || {};

    mThis.db_card_bottom.innerHTML = `

        <div class="row g-3 py-3">

            <!-- Absence -->
            <div class="col-12 col-lg-3">

                <div class="card-container dashboard_chart">

                    <div class="chart-title">
                        Absences
                        <small class="text-muted fw-normal">
                            Last 10 Days
                        </small>
                    </div>

                    ${tableLeave}

                </div>

            </div>


            <!-- Payroll & Wallet -->
            <div class="col-12 col-lg-3">

                <div class="card-container dashboard_chart">

                    <div class="chart-title">
                        Financial Overview
                    </div>


                    <!-- Payroll -->
                    <div class="dashboard-summary">

                        <div class="dashboard-summary-chart">

                            <div
                                class="position-relative"
                                style="width:90px;height:90px;"
                            >

                                <svg
                                    viewBox="0 0 36 36"
                                    width="90"
                                    height="90"
                                >

                                    <path
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#edf0f3"
                                        stroke-width="4"
                                    />

                                    <path
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#9219ff"
                                        stroke-width="4"
                                        stroke-dasharray="85,100"
                                        stroke-linecap="round"
                                    />

                                </svg>

                                <div
                                    class="position-absolute top-50 start-50 translate-middle text-center"
                                >

                                    <strong class="text-primary">
                                        ${payroll.total_count || 0}
                                    </strong>

                                    <small class="d-block text-muted">
                                        Payrolls
                                    </small>

                                </div>

                            </div>

                        </div>


                        <div class="dashboard-summary-content">

                            <small class="text-muted">
                                Total
                            </small>

                            <div class="fw-bold text-primary">
                                ${
                                    VSMoney.symbol("USD") +
                                    VSMoney.formatAmount(
                                        payroll.total_balance || 0
                                    )
                                }
                            </div>

                        </div>

                    </div>


                    <!-- Wallet -->
                    <div class="dashboard-summary">

                        <div class="dashboard-summary-chart">

                            <div
                                class="position-relative"
                                style="width:90px;height:90px;"
                            >

                                <svg
                                    viewBox="0 0 36 36"
                                    width="90"
                                    height="90"
                                >

                                    <path
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#edf0f3"
                                        stroke-width="4"
                                    />

                                    <path
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#32bcd3"
                                        stroke-width="4"
                                        stroke-dasharray="85,100"
                                        stroke-linecap="round"
                                    />

                                </svg>

                                <div
                                    class="position-absolute top-50 start-50 translate-middle text-center"
                                >

                                    <strong class="text-primary">
                                        ${master.total_count || 0}
                                    </strong>

                                    <small class="d-block text-muted">
                                        Master
                                    </small>

                                </div>

                            </div>

                        </div>


                        <div class="dashboard-summary-content">

                            <small class="text-muted">
                                Total
                            </small>

                            <div class="fw-bold text-primary">
                                ${
                                    VSMoney.symbol("USD") +
                                    VSMoney.formatAmount(
                                        master.total_balance || 0
                                    )
                                }
                            </div>

                        </div>

                    </div>


                    <div class="mt-auto text-center">

                        <small class="text-muted">
                            Data from the last 90 days
                        </small>

                    </div>

                </div>

            </div>


            <!-- Benefits -->
            <div class="col-12 col-lg-6">

                <div class="card-container dashboard_chart">

                    <div class="chart-title">
                        Benefit Overview
                        <small class="text-muted fw-normal">
                            As of Now
                        </small>
                    </div>

                    ${tableBenefit}

                </div>

            </div>

        </div>
    `;
};

    mThis.renderDBCardOnLeave = (data) => {

    const rowsHtml = (data || []).map(item => `
        <tr>

            <td>
                <span class="badge bg-light text-warning border">
                    ${item.formatted_date || "-"}
                </span>
            </td>

            <td>
                <span class="badge bg-primary">
                    ${item.staff_count || 0}
                </span>
            </td>

        </tr>
    `).join("");

    return `
        <div class="dashboard-table mt-2">

            <table class="table table-hover">

                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Absence Count</th>
                    </tr>
                </thead>

                <tbody>
                    ${
                        rowsHtml ||
                        `
                        <tr>
                            <td colspan="2"
                                class="text-center text-muted py-4">
                                No absence data
                            </td>
                        </tr>
                        `
                    }
                </tbody>

            </table>

        </div>
    `;
};

   mThis.renderDBCardBenefit = (data) => {

    const rowsHtml = (data || []).map(item => {

        let type = "";

        if (item.benefit_type == 1) {
            type = "Remuneration";
        } else if (item.benefit_type == 2) {
            type = "Fringe";
        }

        return `
            <tr>

                <td>
                    <strong class="text-primary">
                        ${item.benefit_name || "-"}
                    </strong>
                </td>

                <td>
                    <span class="badge bg-light text-primary border">
                        ${type || "-"}
                    </span>
                </td>

                <td class="fw-semibold">
                    ${
                        VSMoney.symbol("USD") +
                        VSMoney.formatAmount(
                            item.total_amount || 0
                        )
                    }
                </td>

                <td class="text-muted">
                    ${item.updated_by || "-"}
                </td>

            </tr>
        `;

    }).join("");

    return `
        <div class="dashboard-table mt-2">

            <table class="table table-hover">

                <thead>
                    <tr>
                        <th>Benefit</th>
                        <th>Category</th>
                        <th>Total</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>

                <tbody>

                    ${
                        rowsHtml ||
                        `
                        <tr>
                            <td colspan="4"
                                class="text-center text-muted py-4">
                                No benefit data
                            </td>
                        </tr>
                        `
                    }

                </tbody>

            </table>

        </div>
    `;
};

    mThis.loadCards = (onFinish) => {
        const p = {};

        vsapi
            .call(
                `${main_view.base_url}/mhr/dashboard/data`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                const data = res.status_code === 200 ? res.data : {};

                mThis.renderDBChartAllTop(data);
                mThis.renderDBCards(data);
                mThis.renderDBCardBottom(data);

                onFinish();
            });
    };
    mThis.prepareFormOptions = (data, onFinish) => {
        mThis.loadCards(onFinish);
    };

    mThis.setDashboardScroll = () => {
        const parent = mThis.self;
        parent.style.height = window.innerHeight - 90 + "px";
        parent.classList.add("overflow-y-auto");
        parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            parent.style.height = window.innerHeight - 90 + "px";
        };
    };

    mThis.show = (options) => {
        // if (!AuthManager.allowed(254,true)){
        //     mThis.self.innerHTML = renderUserHome();
        //     main_view.setContentView(mThis.self, mThis.title_prop);
        //     return;
        // }

        mThis.setDashboardScroll();
        mThis.init();
        options = options || {};
        mThis.prepareFormOptions(null, (d) => {
            main_view.setContentView(mThis.self, mThis.title_prop);
    
        });
    };

    const renderUserHome = ()=>{
        return [
            `<div class="user_home_page">
                <img src="../../../assets/images/default/default-dashboard.jpg" >
            </div>
            <style>
                .user_home_page img{
                    height: 88.8vh;
                    width: 99.2%;
                    margin:5px;
                    background-size: cover;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>`,
        ].join("");

     };
    return mThis;
})();

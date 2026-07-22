"use strict";

var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "Dashboard";
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
        if(AuthManager.allowed(254,true)){
            mThis.dbChartAll = mThis.self.querySelector("#dbChart_all_top");
            mThis.dbCards = mThis.self.querySelector("#db_cards");
            mThis.db_card_bottom = mThis.self.querySelector("#_db_card_bottom");
            mThis.dashboard_Bottom_left = mThis.self.querySelector("#_dashboard_bottom_left");
            mThis.dbCardOnLeave = mThis.self.querySelector("#_db_card_onLeave");
        }
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
        data = data ? data : {};
        let html = [
            `<div class="chart-row py-3">`,
            `<div class="col-md-3">`,
                    '<div class="chart-container dashboard_chart ">',
                        '<span class="fw-semibold fs-5 text-primary-custom text-capitalize">',
                            data.doughnutChart.title,
                        '</span>',
                        '<canvas id="doughnutChart"></canvas>',
                    '</div>',
                `</div>`,
            `<div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            Monthly Payroll Expenses (last 12 months)
                        </span>
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>
                </div>`,
            `<div class="col-md-3">`,
            `<div class="chart-container dashboard_chart bg-white shadow-sm">`,
            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,

            `<div class="bg--icon">`,
            `<img class="img--size" src="`,main_view.base_url,`/assets/images/bhr/dashboard/team.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow   rounded-2" style="background-color:#27b7ff;">${data.cards.new_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1" style="">`,data.cards.new_staff_count.title,`</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,
            `<div class="bg--icon">`,
            `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/letter.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5  text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.resigning_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1">${data.cards.resigning_staff_count.title}</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 " style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,
            `<div class="bg--icon">`,
            `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/stop-work.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.resigned_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1">${data.cards.resigned_staff_count.title}</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `</div>`,
            `</div>`,

            `</div>`
        ].join("");
        mThis.dbChartAll.innerHTML = html;
        mThis.renderChartEmployee(data.doughnutChart);
        mThis.employeeSalaryChart(data.barCharts);
        // mThis.renderCompareChart(data.pieCharts);
    };

    mThis.renderChartEmployee = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById("doughnutChart").getContext("2d");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.values,
                        backgroundColor: data.colors,
                        borderColor: ["#fff", "#fff", "#fff"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "top",
                    },

                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw;
                                return `${label} : ${value} នាក់`;
                            },
                        },
                    },
                    datalabels: {
                        color: "#000",
                        font: {
                            size: 12,
                            weight: "bold",
                        },
                        formatter: function (value, context) {
                            return `${
                                context.chart.data.labels[context.dataIndex]
                            }\n${value} នាក់`;
                        },
                    },
                },
            },
        });
    };
    mThis.employeeSalaryChart = (data) => {
        const ctx = document
            .getElementById("employeeSalaryChart")
            .getContext("2d");

        if (!data.labels || data.labels.length < 12) {
            const defaultCount = 12 - (data.labels ? data.labels.length : 0);
            const placeholders = Array(defaultCount).fill("N/A");
            const placeholderEmployeeCounts = Array(defaultCount).fill(0);
            const placeholderSalaries = Array(defaultCount).fill(0);

            data.labels = data.labels
                ? [...data.labels, ...placeholders]
                : placeholders;
            data.employee_counts = data.employee_counts
                ? [...data.employee_counts, ...placeholderEmployeeCounts]
                : placeholderEmployeeCounts;
            data.total_salaries = data.total_salaries
                ? [...data.total_salaries, ...placeholderSalaries]
                : placeholderSalaries;
        }

        const employeeSalaryData = {
            labels: data.labels,
            datasets: [
                {
                    label: "Total Employees",
                    data: data.employee_counts,
                    backgroundColor: "#2b3991",
                    borderColor: "#fff",
                    borderWidth: 1,
                    yAxisID: "y",
                },
                {
                    label: "Total Salary Paid (រៀល)",
                    data: data.total_salaries,
                    backgroundColor: "#cab54a",
                    borderColor: "#fff",
                    borderWidth: 1,
                    yAxisID: "y1",
                },
            ],
        };

        const config = {
            type: "bar",
            data: employeeSalaryData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    // title: {
                    //     display: true,
                    //     text: 'Employee Count and Total Salary Paid in the Last 12 Months',
                    // },
                },
                scales: {
                    y: {
                        type: "linear",
                        position: "left",
                        title: {
                            display: true,
                            text: "Number of Employees",
                        },
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Salary in KHR (រៀល)",
                            color: "#cab54a",
                        },
                        ticks: {
                            color: "#2b3991",
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                },
            },
        };

        new Chart(ctx, config);
    };

    mThis.renderDBCards = (data) => {
        let html = [
            `<div class="col-md-3">
                 <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="orange" stroke-width="4"
                                    stroke-dasharray="75, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                style="color:orange; font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.exit_form_count.count}</span>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start"
                            style="color: #2b3991; font-size: 1.2rem;">Exit Forms <small class="text-danger">(Pending)</small></span>
                    </div>

            </div>`,
            `<div class="col-md-3">
                      <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#cab54a" stroke-width="4"
                                    stroke-dasharray="50, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                style="color: #2b3991; font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.intern_staff_count.count}</span>
                                <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start"
                            style="color: #2b3991; font-size: 1.2rem;">${data.cards.intern_staff_count.title}</span>
                    </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#f44336" stroke-width="4"
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                      style="color: #f44336; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.warning_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start"
                  style="color: #2b3991; font-size: 1.2rem;">${data.cards.warning_staff_count.title}</span>
          </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#32bcd3" stroke-width="4"
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                      style="color: #32bcd3; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.probation_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start"
                  style="color: #2b3991; font-size: 1.2rem;">${data.cards.probation_staff_count.title}</span>
          </div>

            </div>`,
        ].join("");
        mThis.dbCards.innerHTML = html;
    };

    mThis.renderDBCardBottom = (data) => {
        data = data ? data : {};

        const tableLeave = mThis.renderDBCardOnLeave(data.onLeave);
        const tableBenefit = mThis.renderDBCardBenefit(data.benefits);
        let html = [
            `<div class="card-row  py-2 p-1">`,
            `<div class="col-md-3">
                    <div class="card-container dashboard_chart">
                        <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                            Absences over last 10 days
                        </span>
                        ${tableLeave}
                    </div>
            </div>`,

            `<div class="col-md-3">
                    <div class="card-container dashboard_chart">
                      <div class="w-100 d-flex flex-row justify-content-center align-items-center p-1 mb-2 shadow rounded-3" style="background-color: #ffffff;">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#08b9d5" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#9219ff" stroke-width="4"
                                        stroke-dasharray="75, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">
                                    ${data.accounts.payrolls.total_count || 0}
                                    </p>
                                    <small>Payrolls</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">
                                        ${VSMoney.symbol('KHR') + VSMoney.formatAmount(data.accounts.payrolls.total_balance || 0)}

                                    </p>
                                </div>
                            </div>

                </div>
                <div class="w-100 d-flex flex-row align-items-center justify-content-center align-items-center p-1 shadow rounded-3" style="background-color: #ffffff;">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#eee" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#00e5ff" stroke-width="4"
                                        stroke-dasharray="75, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">${
                                        data.accounts.wallets.total_count || 0
                                    }</p>
                                    <small>Wallets</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">
                                        ${VSMoney.symbol('KHR') + VSMoney.formatAmount(data.accounts.wallets.total_balance || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    <div class="text-center mt-auto">
                        <small class="text-muted">Data from the last 90 days</small>
                    </div>
                </div>
            </div>`,

            `<div class="col-md-6 p-0">
                <div class="card-container dashboard_chart mr-4">
                    <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                        Benefit Overview As of Now
                    </span>
                    ${tableBenefit}
                </div>
            </div>`,

            `</div>`,
        ].join("");

        mThis.db_card_bottom.innerHTML = html;
    };

    mThis.renderDBCardOnLeave = (data) => {
        const rowsHtml = (data || [])
            .map(
                (item) => `
                <tr>
                    <td class="align-middle">
                        <div class="text-primary-custom text-center border rounded-5 d-block p-1" style="width: 100px; background: #d1b54a;font-size: 0.75rem; font-weight: bold;">
                            ${item.formatted_date || ""}
                        </div>
                    </td>
                    <td class="align-middle" style="font-size: 0.75rem;">
                        <span class="p-1 text-white text-center border d-block rounded-5 p-1" style="width: 100px; background: #2b3991cc; font-size: 0.75rem; font-weight: bold;">
                            ${item.staff_count || 0}
                        </span>
                    </td>
                </tr>
            `
            )
            .join("");

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="text-start" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Date</th>
                        <th class="text-start" style="font-size: 0.85rem; color: #2b3991cc; font-weight: bold;">Absence Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
    };

    mThis.renderDBCardBenefit = (data) => {
        const rowsHtml = (data || [])
            .map(
                (item) => `
                <tr>
                   <td class="align-middle">
                        <div class="text-primary-custom " style="width: 20px;font-size: 0.75rem; font-weight: bold;">
                        </div>
                    </td>
                    <td class="align-middle">
                        <div class="text-primary-custom " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.benefit_name}
                        </div>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.benefit_type == 1 ? "Remuneration" : ""} ${item.benefit_type == 2 ? "Fringe" : ""}
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                             ${VSMoney.symbol('KHR') + VSMoney.formatAmount(item.total_amount || 0.0)}
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.updated_by || ""}
                        </span>
                    </td>
                </tr>
            `
            )
            .join("");

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;"></th>

                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Benefit </th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Category</th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Total</th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
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
        parent.style.height = window.innerHeight - 190 + "px";
        parent.classList.add("overflow-y-auto");
        parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            parent.style.height = window.innerHeight - 190 + "px";
        };
    };

    mThis.show = (options) => {
        if (!AuthManager.allowed(254,true)){
            mThis.self.innerHTML = renderUserHome();
            main_view.setContentView(mThis.self, mThis.title_prop);
            return;
        }

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

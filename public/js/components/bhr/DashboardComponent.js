"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dbChartAll = mThis.self.querySelector('#dbChart_all_top');
    this.dbCards = this.self.querySelector('#db_cards');
    this.dashboard_center = mThis.self.querySelector('#_dashboard_center');
    this.dashboard_Bottom = mThis.self.querySelector('#_dashboard_bottom');
    this.dashboard_Bottom_left = mThis.self.querySelector('#_dashboard_bottom_left');
    this.dbCardOnLeave = mThis.self.querySelector('#_db_card_onLeave');
    this.barchart = mThis.self.querySelector('#barchart');

    const formattedNumber = (number) => {
        number = Number(number) || 0;
        return number
            .toLocaleString('en-US', {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            .replace(/,/g, ' ');
    };

    // *** When DashboardComponent is showing, create Dashboard Filter button near page title 
    this.onShow = (options) => {
        mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
        const divTitle = main_view.divTitle;
        let btn = divTitle.querySelector('.btn-db-fitler');
        if (btn) return;
        divTitle.insertAdjacentHTML('beforeend', '<div class="div-db-filter"><button class="btn-db-fitler btn btn-sm btn-primary"><i class="fa fa-list"></i></button></div>');
        btn = divTitle.querySelector('.btn-db-fitler');
        mThis.createFilterButton(btn);
    };

    // *** When DashboardComponent is closing, remove Dashboard Filter button near page title
    this.onHide = (options) => {
        mThis.removeFilterButton();
    }

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    }

    this.removeFilterButton = () => {
        const divTitle = main_view.divTitle;
        const div = divTitle.querySelector('div.div-db-filter');
        if (div) div.remove();
    };

    this.createFilterButton = (btn) => {
        mThis.filterConfig = null;
        mThis.filterConfig = new FilterPanel(
            {
                "triggerButton": btn,
                fields: [
                    {
                        "name": "year",
                        "label": "Year",
                        "valueField": "year",
                        "textField": "year",
                        "defaultValue": 2024,
                        "data": [{ "year": 2024 }, { "year": 2025 }]
                    },
                    {
                        "name": "month",
                        "label": "Month",
                        // "valueField":"value",
                        // "textField":"label",
                        "data": [{ "value": "this_month", "label": "This month" }, { "value": "last_month", "label": "Last month" }],
                    }
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
                    console.log('Filter Content created! ', me.controls);
                },
                onSelect: (me, data) => {
                    console.log('selected data is  : ', data);
                }
            });
    }

    this.renderDBChartAllTop = (data) => {
        data = data ? data : {};
        let onLeaveHtml = this.renderDBOnLeave(data);
        let html = `
            <div class="chart-row py-3">
                <div class="col-md-3">
                    <div class="chart-container dashboard_chart ">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            ${data.doughnutChart.title}
                        </span>
                        <canvas id="doughnutChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            Monthly Employee Salary Overview
                        </span>
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>
                </div> 
                <div class="col-md-3">
                    <div class="chart-container dashboard_chart  shadow-sm" style="max-width: 21rem;">
                        <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #23232f29;">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-icon pt-3 px-3">
                                    <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                                </div>
                                <div class="ms-3 text-center flex-fill">
                                    <span class="fw-semibold fs-4 text-danger">0</span>
                                    <div class="text-muted">Total New Staff</div>
                                </div>
                            </div>
                            <div class="text-center mt-auto">
                                <small class="text-muted">Last 90 days</small>
                            </div>
                        </div>
                        <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #23232f29;">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-icon pt-3 px-3">
                                    <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                                </div>
                                <div class="ms-3 text-center flex-fill">
                                    <span class="fw-semibold fs-4 text-danger">0</span>
                                    <div class="text-muted">Total New Staff</div>
                                </div>
                            </div>
                            <div class="text-center mt-auto">
                                <small class="text-muted">Last 90 days</small>
                            </div>
                        </div>

                        <div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #23232f29;">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-icon pt-3 px-3">
                                    <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                                </div>
                                <div class="ms-3 text-center flex-fill">
                                    <span class="fw-semibold fs-4 text-danger">0</span>
                                    <div class="text-muted">Probation Staff</div>
                                </div>
                            </div>
                            <div class="text-center mt-auto">
                                <small class="text-muted">Last 90 days</small>
                            </div>
                        </div>

                        <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 " style="background-color: #23232f29;">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-icon pt-3 px-3">
                                    <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                                </div>
                                <div class="ms-3 text-center flex-fill">
                                    <span class="fw-semibold fs-4 text-danger">0</span>
                                    <div class="text-warning">Resigned Staff</div>
                                </div>
                            </div>
                            <div class="text-center mt-auto">
                                <small class="text-muted">Last 90 days</small>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
        mThis.dbChartAll.innerHTML = html;
        mThis.renderChartEmployee(data.doughnutChart);
        mThis.employeeSalaryChart(data.barCharts);
        // mThis.renderCompareChart(data.pieCharts);
    };
    


    this.renderChartEmployee = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById('doughnutChart').getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors,
                    borderColor: ['#fff', '#fff', '#fff'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true
                    },
                    datalabels: {
                        color: '#000',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        formatter: function (value, context) {
                            return `${context.chart.data.labels[context.dataIndex]}\n${value}`;
                        }
                    }
                }
            }
        });
    };
    this.employeeSalaryChart = (data) => {
        const ctx = document.getElementById('employeeSalaryChart').getContext('2d');

        const employeeSalaryData = {
            labels: data.labels,
            datasets: [
                {
                    label: 'Total Employees',
                    data: data.employee_counts,
                    backgroundColor: '#2b3991',
                    borderColor: '#fff',
                    borderWidth: 1,
                    yAxisID: 'y',
                },
                {
                    label: 'Total Salary Paid ($)',
                    data: data.total_salaries,
                    backgroundColor: '#cab54a',
                    borderColor: '#fff',
                    borderWidth: 1,
                    yAxisID: 'y1',
                },
            ],
        };

        const config = {
            type: 'bar',
            data: employeeSalaryData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Employee Count and Total Salary Paid in the Last 6 Months',
                    },
                },
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Number of Employees',
                        },
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Salary in USD ($)',
                            color: '#cab54a',
                        },
                        ticks: {
                            color: '#2b3991',
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



    // this.renderCompareChart = (data) => {
    //     const ctx = document.getElementById('compareChart').getContext('2d');

    //     new Chart(ctx, {
    //       type: 'bar',
    //       data: {
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //         datasets: [
    //           {
    //             label: 'Completed',
    //             data: [20, 40, 60, 80, 100, 120],
    //             backgroundColor: 'rgba(54, 162, 235, 0.8)',
    //           },
    //           {
    //             label: 'Remaining Target',
    //             data: [20, 40, 60, 80, 60, 40],
    //             backgroundColor: 'rgba(75, 192, 192, 0.8)',
    //           },
    //         ],
    //       },
    //       options: {
    //         plugins: {
    //           title: {
    //             display: true,
    //             text: 'Performance Comparison (Completed vs Remaining Targets)',
    //             color: '#fff',
    //             font: {
    //               size: 16,
    //             },
    //           },
    //           legend: {
    //             labels: {
    //               color: '#fff',
    //             },
    //           },
    //         },
    //         scales: {
    //           x: {
    //             stacked: true,
    //             ticks: {
    //               color: '#fff',
    //             },
    //           },
    //           y: {
    //             stacked: true,
    //             beginAtZero: true,
    //             ticks: {
    //               color: '#fff',
    //             },
    //           },
    //         },
    //         responsive: true,
    //         maintainAspectRatio: false,
    //       },
    //     });
    // };

    this.renderDBCards = (data) => {
        let html = `
            <div class="row">
                <div class="col-xl-6 col-lg-6">
                    <div class="card shadow-sm border-0 rounded-3 l-bg-cherry">
                        <div class="card-statistic-3 p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="card-icon card-icon-large me-3 text-white bg-danger d-flex justify-content-center align-items-center rounded-circle" style="width: 60px; height: 60px;">
                                    <i class="fas fa-shopping-cart fs-4"></i>
                                </div>
                                <div class="flex-fill">
                                    <h5 class="card-title mb-0 text-muted">For Warning wallet and payroll </h5>
                                </div>
                            </div>
                            <div class="row align-items-center mb-2 d-flex">
                                <div class="col-8">
                                    <h2 class="mb-0 text-primary">3,243</h2>
                                </div>
                                <div class="col-4 text-end">
                                    <span class="text-success fw-bold">12.5% <i class="fa fa-arrow-up"></i></span>
                                </div>
                            </div>
                            <div class="progress mt-2" style="height: 8px;">
                                <div class="progress-bar bg-cyan" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                    <div class="card shadow-sm border-0 rounded-3 l-bg-cherry">
                        <div class="card-statistic-3 p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="card-icon card-icon-large me-3 text-white bg-danger d-flex justify-content-center align-items-center rounded-circle" style="width: 60px; height: 60px;">
                                    <i class="fas fa-shopping-cart fs-4"></i>
                                </div>
                                <div class="flex-fill">
                                    <h5 class="card-title mb-0 text-muted">For Warning wallet and payroll</h5>
                                </div>
                            </div>
                            <div class="row align-items-center mb-2 d-flex">
                                <div class="col-8">
                                    <h2 class="mb-0 text-primary">3,243</h2>
                                </div>
                                <div class="col-4 text-end">
                                    <span class="text-success fw-bold">12.5% <i class="fa fa-arrow-up"></i></span>
                                </div>
                            </div>
                            <div class="progress mt-2" style="height: 8px;">
                                <div class="progress-bar bg-cyan" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        `;
    
        this.dbCards.innerHTML = html;
    };
    

    this.renderDBOnLeave = (data) => {
        const rowsHtml = (data.onLeave || [])
            .map(
                (item) => `
                    <tr>
                        <td class="align-middle text-center">
                            <div class="text-primary-custom" style="font-size: 0.75rem; font-weight: bold;">
                                ${item.emp_name}
                            </div>
                        </td>
                        <td class="align-middle text-center" style="font-size: 0.75rem;">
                            <span class="rounded-pill px-2 py-1 bg-warning text-white d-inline-block">
                                ${item.emp_position}
                            </span>
                        </td>
                        <td class="align-middle text-center" style="font-size: 0.75rem;">
                            <span class="rounded-pill px-2 py-1 bg-primary-custom text-white d-inline-block">
                                ${item.remarks}
                            </span>
                        </td>
                    </tr>
                `
            )
            .join("");

        return `
            <div class="w-100">
                <table class="table bg-white rounded-2 shadow-sm">
                    <thead class="bg-light">
                        <tr>
                            <th class="text-center text-primary-custom" style="width: 30%; font-size: 0.85rem; font-weight: bold;">Name</th>
                            <th class="text-center text-primary-custom" style="width: 30%; font-size: 0.85rem; font-weight: bold;">Position</th>
                            <th class="text-center text-primary-custom" style="width: 40%; font-size: 0.85rem; font-weight: bold;">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    };

    this.renderDBCardOnLeave = (data) => {
        const rowsHtml = (data || [])
            .map(
                (item) => `
                    <tr>
                        <td class="align-middle">
                            <div class="text-primary-custom" style="font-size: 0.75rem; font-weight: bold;">
                                ${item.emp_name}
                            </div>
                        </td>
                        <td class="align-middle text-center" style="font-size: 0.75rem;">
                            <span class="p-1 text-white text-center border d-block rounded-5 p-1" style="width: 100px; background: #2b3991;">
                                ${item.emp_position}
                            </span>
                        </td>
                        <td class="align-middle text-start" style="font-size: 0.75rem;">
                            <span class="p-1 text-primary-custom text-center">
                                ${item.remarks || "No Remarks"}
                            </span>
                        </td>
                    </tr>
                `
            )
            .join("");

        const html = `
            <h3 class="d-flex align-items-start text-primary-custom" style="font-size: 1.2rem;">Staffs on Leave Today</h3>
            <div class="w-100" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius:8px;">
                <table class="table bg-white rounded-4 mb-0">
                    <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                        <tr>
                            <th class="text-start text-primary-custom" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Name</th>
                            <th class="text-start text-primary-custom" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Position</th>
                            <th class="text-start text-primary-custom" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;

        mThis.dbCardOnLeave.innerHTML = html;
    };
    this.loadCards = (onFinish) => {
        let p = {};

        vsapi.call(`${main_view.base_url}/hr/dashboard/data`, p, null, false, false).then(res => {
            let data = (res.status_code === 200) ? res.data : {};

            mThis.renderDBChartAllTop(data);
            mThis.renderDBCards(data.cards);
            mThis.renderDBCardOnLeave(data.onLeave);

            onFinish();
        });
    }
    this.prepareFormOptions = (data, onFinish) => {

        mThis.loadCards(onFinish);

    }
    this.setDashboardScroll = () => {
        const parent = mThis.self;
        parent.style.height = (window.innerHeight - 100) + 'px';
        parent.classList.add('overflow-y-auto');
        parent.classList.add('overflow-x-hidden');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 100) + 'px';
        }
    }
    this.show = (options) => {
        mThis.setDashboardScroll();
        mThis.init();
        if (!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null, (d) => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
        });
    };
})();

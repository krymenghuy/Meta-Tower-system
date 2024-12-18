"use strict";


var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dbChartAll = mThis.self.querySelector('#dbChart_all_top');
    this.dbCards = this.self.querySelector('#db_cards');
    this.db_card_bottom = mThis.self.querySelector('#_db_card_bottom');
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
        divTitle.insertAdjacentHTML('beforeend', '<div class="div-db-filter w-100 text-end"><button class="btn-db-fitler btn btn-sm btn-primary-custom rounded-circle p-2"><i class="fa-solid text-white fa-paper-plane"></i></button></div>');
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
        let html = [`<div class="chart-row py-3">`,
               `<div class="col-md-3">
                    <div class="chart-container dashboard_chart ">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            ${data.doughnutChart.title}
                        </span>
                        <canvas id="doughnutChart"></canvas>
                    </div>
                </div>`,
                `<div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            Monthly Employee Salary Overview
                        </span>
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>
                </div>`,
                `<div class="col-md-3">
                <div class="chart-container dashboard_chart bg-white shadow-sm">
                    <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">
                        <div class="d-flex align-items-center p-2 mb-1">
                            <div class="bg--icon  bg--icon-new-employee-count">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/new_staff.svg" alt="Icon">
                            </div>
                            <div class="ms-3 text-center flex-fill">
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.new_staff_count.count}</span>
                                <div class="text-success" style="">${data.cards.new_staff_count.title}</div>
                            </div>
                        </div>
                        <div class="text-center mt-auto">
                            <small class="text-muted">Last 90 days</small>
                        </div>
                    </div>

                    <div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">
                        <div class="d-flex align-items-center p-2 mb-1">
                            <div class="bg--icon bg--icon-new-employee-resigning">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                            </div>
                            <div class="ms-3 text-center flex-fill">
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.resigning_staff_count.count}</span>
                                <div class="text-warning">${data.cards.resigning_staff_count.title}</div>
                            </div>
                        </div>
                        <div class="text-center mt-auto">
                            <small class="text-muted">Last 90 days</small>
                        </div>
                    </div>

                    <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 " style="background-color: #ededed;">
                        <div class="d-flex align-items-center p-2 mb-1">
                            <div class="bg--icon bg--icon-new-employee-resigned">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/stop.svg" alt="Icon">
                            </div>
                            <div class="ms-3 text-center flex-fill">
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.resigned_staff_count.count}</span>
                                <div class="text-danger">${data.cards.resigned_staff_count.title}</div>
                            </div>
                        </div>
                        <div class="text-center mt-auto">
                            <small class="text-muted">Last 90 days</small>
                        </div>
                    </div>

                </div>
                </div>`,
              
            `</div>`].join('');
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
                    title: {
                        display: true,
                        text: 'Current Employee Count',
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem){
                                const label = tooltipItem.label || '';
                                const value = tooltipItem.raw;
                                return `${label} : ${value} នាក់`;
                            }
                        }
                    },
                    datalabels: {
                        color: '#000',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        formatter: function (value, context) {
                            return `${context.chart.data.labels[context.dataIndex]}\n${value} នាក់`;
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




    
    this.renderDBCards = (data) => {
        let html =
            [`<div class="col-md-3">
                 <div class="card w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#ecdb5e" stroke-width="4" 
                                    stroke-dasharray="50, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                style="color:rgb(26, 232, 70); font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.warning_staff_count.count}</span>
                                <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start" 
                            style="color: #2b3991; font-size: 1.2rem;">Staff Exist Form</span>
                    </div>

            </div>`,
            `<div class="col-md-3">
                      <div class="card w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#ecdb5e" stroke-width="4" 
                                    stroke-dasharray="50, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                style="color: #2b3991; font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.warning_staff_count.count}</span>
                                <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start" 
                            style="color: #2b3991; font-size: 1.2rem;">Intern Staff</span>
                    </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" stroke="#ecdb5e" stroke-width="4" 
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                      style="color: #2b3991; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.warning_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start" 
                  style="color: #2b3991; font-size: 1.2rem;">Warning Staff</span>
          </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" stroke="#ecdb5e" stroke-width="4" 
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                      style="color: #2b3991; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.warning_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start" 
                  style="color: #2b3991; font-size: 1.2rem;">Probation Staff</span>
          </div>

            </div>`,].join('');
        this.dbCards.innerHTML = html;
     
    };

    this.renderDBCardBottom = (data) => {
        data = data ? data : {};
        
        const tableLeave = this.renderDBCardOnLeave(data.onLeave);
        const tableBenefit = this.renderDBCardBenefit(data.onLeave);
        let html = [`<div class="card-row py-3">`,
            `<div class="col-md-3">
                    <div class="card-container dashboard_chart">
                        <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                            Overview last 10 days 
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
                                        fill="none" stroke="#2b3991" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#07D1ED" stroke-width="4" 
                                        stroke-dasharray="100, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">${data.accounts.payrolls.total_count}</p>
                                    <small>Payrolls</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">$ ${data.accounts.payrolls.total_count}</p>
                                </div>
                            </div>

                </div>
                <div class="w-100 d-flex flex-row align-items-center justify-content-center align-items-center p-1 shadow rounded-3" style="background-color: #ffffff;">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#2b3991" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#cab54a" stroke-width="4" 
                                        stroke-dasharray="90, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">${data.accounts.wallets.total_count}</p>
                                    <small>Wallets</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">$ ${data.accounts.wallets.total_balance}</p>
                                </div>
                            </div>
                        </div>
                    
                    
                    <div class="text-center mt-auto">
                        <small class="text-muted">Data from the last 90 days</small>
                    </div>
                </div>
            </div>`,
    

            `<div class="col-md-6">
                <div class="chart-container dashboard_chart">
                    <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                        Overview last 10 days 
                    </span>
                    ${tableBenefit}
                </div>
            </div>`,
           
            `</div>`].join('');
    
      
        mThis.db_card_bottom.innerHTML = html;
    };
    
   this.renderDBCardOnLeave = (data) => {
    console.log(49,data);
    
    
    const rowsHtml = (data || [])
        .map(
            (item) => `
                <tr>
                    <td class="align-middle">
                        <div class="text-primary-custom text-center border rounded-5 d-block p-1" style="width: 100px; background: #d1b54a;font-size: 0.75rem; font-weight: bold;">
                            ${item.formatted_date}
                        </div>
                    </td>
                    <td class="align-middle" style="font-size: 0.75rem;">
                        <span class="p-1 text-white text-center border d-block rounded-5 p-1" style="width: 100px; background: #2b3991cc; font-size: 0.75rem; font-weight: bold;">
                            ${item.staff_count} staff
                        </span>
                    </td>
                </tr>
            `
        ).join(""); 

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="text-start" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Leave Date</th>
                        <th class="text-start" style="font-size: 0.85rem; color: #2b3991cc; font-weight: bold;">Staff Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
    
   };
   this.renderDBCardBenefit = (data) => {
    
    
    const rowsHtml = (data || [])
        .map(
            (item) => `
                <tr>
                    <td class="align-middle">
                        <div class="text-primary-custom text-center" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            Bonus
                        </div>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom text-center" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            Bonus
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom text-center" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            1 000,000.00 KHR
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom text-center" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            Admin
                        </span>
                    </td>
                </tr>
            `
        ).join(""); 

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="text-center" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Benefit</th>
                        <th class="text-center" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Category</th>
                        <th class="text-center" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Total</th>
                        <th class="text-center" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Last Updated</th>



                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
    
   };

    
    this.loadCards = (onFinish) => {
        const p = {};

        vsapi.call(`${main_view.base_url}/hr/dashboard/data`, p, null, false, false).then(res => {
            const data = (res.status_code === 200) ? res.data : {};

            mThis.renderDBChartAllTop(data);
            mThis.renderDBCards(data);
            mThis.renderDBCardBottom(data);

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
        options = options || {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null, (d) => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
        });
    };
})();

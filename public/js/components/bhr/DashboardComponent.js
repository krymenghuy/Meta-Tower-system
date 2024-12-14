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
        let html = [`<div class="chart-row py-3">`,
               `<div class="col-md-3">
                    <div class="chart-container dashboard_chart ">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            ${data.doughnutChart.title}
                        </span>
                        <canvas id="doughnutChart"></canvas>
                    </div>
                </div>`,
                `<div class="col-md-3">
                <div class="chart-container dashboard_chart  shadow-sm">
                    <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #23232f29;">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-icon pt-3 px-3">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation.svg" alt="Icon">
                            </div>
                            <div class="ms-3 text-center flex-fill">
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.new_staff_count.count}</span>
                                <div class="" style="color:#faff00;">${data.cards.new_staff_count.title}</div>
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
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.probation_staff_count.count}</span>
                                <div class="text-success">${data.cards.probation_staff_count.title}</div>
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
                                <span class="fw-semibold fs-4 text-primary-custom">${data.cards.resigning_staff_count.count}</span>
                                <div class="text-info">${data.cards.resigning_staff_count.title}</div>
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
                `<div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            Monthly Employee Salary Overview
                        </span>
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>
                </div> `,
              
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
    this.initCircleCards = (div) => {
        const pies = div.querySelectorAll(".pie");
    
        const elements = Array.from(pies);
        const circle = new CircularProgressBar("pie");
    
        if ("IntersectionObserver" in window) {
            const config = {
                root: null,
                rootMargin: "0px",
                threshold: 0.75,
            };
    
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
                        circle.initial(entry.target); // Initialize the CircularProgressBar on the intersecting target
                        observer.unobserve(entry.target); // Stop observing the target after initialization
                    }
                });
            }, config);
    
            elements.forEach((item) => {
                observer.observe(item); // Observe each pie chart element
            });
        } else {
            // Fallback for browsers without IntersectionObserver support
            elements.forEach((element) => {
                circle.initial(element);
            });
        }
    
        // Optional dynamic animation for demonstration
        setInterval(() => {
            const randomColorHex = `#${Math.floor(Math.random() * 0xffffff)
                .toString(16)
                .padStart(6, "0")}`;
            const randomPercentage = Math.floor(Math.random() * 100 + 1);
            const options = {
                percent: randomPercentage, // Generate a random percentage
                colorSlice: randomColorHex, // Use a random color for the slice
                fontColor: randomColorHex, // Use the same random color for the font
                title: `Progress ${randomPercentage}%`, // Set a dynamic title
            };
    
            // Uncomment this line to enable dynamic animations
            // circle.animationTo(options);
        }, 3000); // Adjust the interval as needed
    };
    
    
    this.renderDBCards = (data) => {
        let html =
            [`<div class="col-md-3">
                <div class="card text-light d-flex justify-content-center align-items-center p-3 shadow rounded-3" style="background-color: #ededed;">
                      <div class="w-100 d-flex flex-row align-items-center">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#fff" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#07D1ED" stroke-width="4" 
                                        stroke-dasharray="50, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="m-0">10</p>
                                    <small>Accounts</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Payroll Account</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-5" style="color: #2b3991;">$ 168,000,000</p>
                                </div>
                            </div>
                        </div>

                </div>
            </div>`,
              `<div class="col-md-3">
                <div class="card text-light d-flex justify-content-center align-items-center p-3 shadow rounded-3" style="background-color: #ededed;">
                      <div class="w-100 d-flex flex-row align-items-center">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#fff" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" stroke="#07D1ED" stroke-width="4" 
                                        stroke-dasharray="50, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="m-0">10</p>
                                    <small>Accounts</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Payroll Account</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-5" style="color: #2b3991;">$ 168,000,000</p>
                                </div>
                            </div>
                        </div>

                </div>
            </div>`,
             `<div class="col-md-6">
                <div class="card card-pie-3 text-light d-flex justify-content-center align-items-center p-3 shadow rounded-3" style="background-color: #ededed;">
                    <div class="card-content d-flex justify-content-center gap-3 w-100">
                  
                        <div class="pie"
                            data-pie='{ 
                                "animationSmooth": "1s ease-out", 
                                "percent": 50, 
                                "colorSlice": "#07D1ED", 
                                "colorCircle": "#FFF" 
                            }'>
                         
                        </div>
                
                        
                        
                        <div class="section-title mt-3 mb-0 fs-6 text-start w-100">
                            <div class="w-100">
                                <p class="fs-6 m-0" style="color: #cab54a;">Saving Account</p>
                                <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                <p class="fs-5" style="color: #2b3991;">$ 99,999,999</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `].join('');
        this.dbCards.innerHTML = html;
        this.initCircleCards(this.dbCards);
     
    };
    
    

 

    this.renderDBCardBottom = (data) => {
        data = data ? data : {};
        const tableLeave = this.renderDBCardOnLeave(data);
        const tableBenefit = this.renderDBCardBenefit(data);
        let html = `
            <div class="card-row py-3">
                <div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                            Overview last 10 days 
                        </span>
                        ${tableBenefit}
                    </div>
                </div> 
                <div class="col-md-3">
                <div class="card-container dashboard_chart">
                    <div class="card w-100 d-flex flex-row align-items-center mt-2 mb-3">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#eee" stroke-width="3" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="#07d1ed" stroke-width="3" 
                                    stroke-dasharray="50, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                style="color: #2b3991; font-size: 1.5rem; font-weight: bold;">
                                10
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start" 
                            style="color: #2b3991; font-size: 1.2rem;">Staff Warnings</span>
                    </div>
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
                                style="color: #2b3991; font-size: 1.5rem; font-weight: bold;">
                                10
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start" 
                            style="color: #2b3991; font-size: 1.2rem;">Staff Exist Form</span>
                    </div>
                    
                    <div class="text-center mt-auto">
                        <small class="text-muted">Data from the last 90 days</small>
                    </div>
                </div>
            </div>
                <div class="col-md-3">
                    <div class="card-container dashboard_chart">
                        <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                            Overview last 10 days 
                        </span>
                        ${tableLeave}
                    </div>
                </div>
           
            </div>
        `;
    
      
        mThis.db_card_bottom.innerHTML = html;
    };
    
   this.renderDBCardOnLeave = (data) => {
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
                            $ 123 
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
                        <th class="text-center" style="font-size: 0.85rem; color: #2b3991cc; font-weight: bold;">Total</th>
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
            mThis.renderDBCards(data.cards);
            mThis.renderDBCardBottom(data.onLeave);

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

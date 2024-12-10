"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dashboard_top = mThis.self.querySelector('#_dashboard_top');
    this.dashboard_card_details = this.self.querySelector('#dashboard_card_load');
    this.dashboard_center = mThis.self.querySelector('#_dashboard_center');
    this.dashboard_Bottom  = mThis.self.querySelector('#_dashboard_bottom');
    this.dashboard_Bottom_left = mThis.self.querySelector('#_dashboard_bottom_left');
    this.dashboard_Bottom_right = mThis.self.querySelector('#_dashboard_bottom_right');
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
    this.onShow =  (options)=> {
        mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
        const divTitle = main_view.divTitle;
       let btn = divTitle.querySelector('.btn-db-fitler');
       if(btn) return;   
         divTitle.insertAdjacentHTML('beforeend','<div class="div-db-filter"><button class="btn-db-fitler btn btn-sm btn-primary"><i class="fa fa-list"></i></button></div>');
         btn = divTitle.querySelector('.btn-db-fitler');
         mThis.createFilterButton(btn);
    };
 
   // *** When DashboardComponent is closing, remove Dashboard Filter button near page title
    this.onHide = (options)=>{
        mThis.removeFilterButton();
    }

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    }

    this.removeFilterButton = ()=>{
        const divTitle = main_view.divTitle; 
        const div = divTitle.querySelector('div.div-db-filter');
        if(div) div.remove();
    };

    this.createFilterButton = (btn) => {
        mThis.filterConfig = null;
        mThis.filterConfig = new FilterPanel(
        {
                "triggerButton":btn,
                fields:[
                   {
                    "name":"year",
                    "label":"Year",
                    "valueField":"year",
                    "textField":"year",
                    "defaultValue":2024,
                    "data":[{"year":2024}, {"year":2025}]
                   },
                   {
                    "name":"month",
                    "label":"Month",
                    // "valueField":"value",
                    // "textField":"label",
                    "data":[{"value":"this_month","label":"This month"}, {"value":"last_month","label":"Last month"}],
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
               contentCreated:(me)=>{
                  console.log('Filter Content created! ', me.controls);
               },
               onSelect: (me, data)=>{
                 console.log('selected data is  : ',data);
               } 
        });
    }

    this.renderDashboardTop = (data) => {
        data = data ? data : {};
        let onLeaveHtml = this.renderDBOnLeave(data);
        let html = `
        <div class="render_chart">
            <div class="row py-3">
                <div class="col-md-3">
                    <div class="card dashboard_chart">
                    <span class="fw-semibold fs-5 text-primary-custom text-capitalize" style="color:">${data.doughnutChart.title}</span>
                        <canvas id="doughnutChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-white dashboard_chart">
                    <span class="fw-semibold fs-5 text-primary-custom text-capitalize" style="color:">${data.barCharts.title}</span>
                        <canvas id="compareChart"></canvas>
                    </div>
                </div> 
                <div class="col-md-3">
                    <div class="card  dashboard_chart" style="height:340px; color:#d9bc4a;">
                    <span class="fw-semibold fs-5 pb-2 text-capitalize">OnLeave Today</span>
                    ${onLeaveHtml}
                    </div>
                </div>


            </div>
            
        </div>
        `;
        mThis.dashboard_top.innerHTML = html;
        mThis.renderChartEmployee(data.doughnutChart);
        mThis.renderCompareChart(data.barCharts);

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
    this.renderCompareChart = (data) => {
        console.log(1,data);
        const ctx = document.getElementById('compareChart').getContext('2d');
    
       
    
        const chartOptions = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.title || 'Data', 
                    data: data.values || [],
                    backgroundColor: data.colors || '#3795E0', 
                    borderColor: data.borderColors || '#fff',
                    borderWidth: data.borderWidth || 1 
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true, 
                        title: {
                            display: true,
                            text: data.xAxisTitle || 'Months'
                        }
                    },
                    y: {
                        beginAtZero: true, 
                        title: {
                            display: true,
                            text: data.yAxisTitle || 'Values'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.raw;
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
                            return `${context.chart.data.labels[context.dataIndex]}\n${value}`;
                        }
                    }
                }
            }
        };
        new Chart(ctx, chartOptions);
        
    
       
    };
    

    this.renderPieChart = (data) => {
        const ctx = document.getElementById('pieChart').getContext('2d');
    
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.title || 'Data', 
                    data: data.values || [],
                    backgroundColor: data.colors || '#3795E0', 
                    borderColor: data.borderColors || '#fff',
                    borderWidth: data.borderWidth || 1 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
        
    };
    this.renderDBOnLeave = (data) => {
        let rowsHtml = (data.onLeave || [])
            .map(
                (data) => `
                <tr>
                    <td>
                        <div class="d-flex flex-column text-center">
                            <div class="d-block"><img src="${data.image_url}" alt="Profile" style="width: 30px; height: 30px; border-radius: 50%;"></div>
                            <div class="d-block" style="font-size:0.65rem;"><small class="text-success">${data.emp_name}</small></div>

                        </div>
                        
                    </td>
                    <td style="font-size: 0.65rem; text-align: center;">
                        <div class="align-middle text-center rounded-5 border text-white bg-warning" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; padding:4px">${data.emp_position}</div>
                    </td>
                    <td style="font-size: 0.65rem; text-align: center;">
                        <div class="align-middle text-center rounded-5 border text-white bg-primary-custom" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; padding:4px">${data.remarks}</div>
                    </td>
                </tr>
            `
            )
            .join("");
    
        return `
            <div class="w-100">
                <table class="rounded-3  shadow bg- table table-sm">
                    <thead>
                        <tr>
                            <th style="width: 30%;font-size: 0.65rem; text-align: center;">Profile</th>
                            <th style="width: 30%;font-size: 0.65rem; text-align: center;">position</th>
                            <th style="width: 40%; font-size: 0.65rem; text-align: center;">reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    };
    

    

  
this.renderDashboardCards = (data) => {
    
    
let html = '';
     html = [`
            <div class="col-md-3">
                <div class="card p-3">
                    <div class="w-100 d-flex justify-content-between">
                        <p class="section-title mb-2 fs-6">Resigned Employees</p>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <p class="text-center fs-4">${data.active_employees.count}</p>
                        <img class="w-15" src="${main_view.asset_url}/images/icons/employee.png" alt="Active Employees"/>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card p-3">
                    <div class="w-100 d-flex justify-content-between">
                        <p class="section-title mb-2 fs-6">Resigned Employees</p>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <p class="text-center fs-4">${data.resigned_employees.count ?? 0}</p>
                        <img class="w-15" src="${main_view.asset_url}/images/icons/employee.png" alt="Resigned Employees"/>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card p-3">
                    <div class="w-100 d-flex justify-content-between">
                        <p class="section-title mb-2 fs-6">Resigned Employees</p>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <p class="text-center fs-4">${data.terminated_employees?.count ?? 0}</p>
                        <img class="w-15" src="${main_view.asset_url}/images/icons/employee.png" alt="Resigned Employees"/>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card p-3">
                    <div class="w-100 d-flex justify-content-between">
                        <p class="section-title mb-2 fs-6">Terminated Employees</p>
                    </div>
                    <div class="w-100 d-flex justify-content-between">
                        <p class="text-center fs-4">${data.branch_count.count ?? 0}</p>
                        <img class="w-15" src="${main_view.asset_url}/images/icons/resign.png" alt="Terminated Employees"/>
                    </div>
                </div>
            </div>`].join('');

    this.dashboard_card_details.innerHTML = html;
};

    
this.renderDashboardCenter = data => {
    console.log(123);



    // let rowsHtml = data.department_data
    //   .map(department => `
    //     <tr>
    //       <td>${department.department_name}</td>
    //       <td >${department.position_title}</td>
    //       <td>${department.staff_count}</td>
    //       <td>${department.internship_count}</td>
    //       <td>${department.in_probation_count}</td>
    //       <td>${department.total_employee_count}</td>
    //     </tr>
    //   `)
    //   .join("");

    let html = `
        <div class="em_departement">
        <h3 class="d-flex align-items-start text-primary" style="font-size: 1.2rem;desplay: flex; justify-content: center;">𝔼𝕞𝕡𝕝𝕠𝕪𝕖𝕖 𝔹𝕪 𝔻𝕖𝕡𝕒𝕣𝕥𝕞𝕖𝕟𝕥</h3>
        <table class="table bg-white rounded-4">
            <thead>
            <tr>
                <th class="w-25">Department</th>
                <th>Position</th>
                <th>Staff</th>
                <th>Internship</th>
                <th>In Probation</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
        
            </tbody>
        </table>
        </div>
    `;
    mThis.dashboard_center.innerHTML = html;
};
    
    this.renderDashboardBottomRight = (data) => {
        if (!data) return;

        let html = `
            <h3 class="d-flex align-items-start text-primary" style="font-size: 1.2rem;">𝔹𝕖𝕟𝕖𝕗𝕚𝕥𝕤</h3>
            <table class="table bg-white rounded-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Bonus</td>
                        <td>${main_view.currency.symbol + formattedNumber(data.total_bonuses)}​</td>
                        <td>${data.lud_bonuses || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Seniority</td>
                        <td>${main_view.currency.symbol + formattedNumber(data.total_seniority)}</td>
                        <td>${data.lud_seniority || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Life Insurance</td>
                        <td>${main_view.currency.symbol + formattedNumber(data.total_life_insurance)}</td>
                        <td>${data.lud_life_insurance || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Other</td>
                        <td>${main_view.currency.symbol + formattedNumber(data.total_other)}</td>
                        <td>${data.lud_other || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td class="text-success">${main_view.currency.symbol + formattedNumber(data.total_amount)}</td>

                    </tr>
                </tbody>
            </table>
        `;

        mThis.dashboard_Bottom_right.innerHTML = html;
    };
    


    this.loadCardsBottomRight = (onFinish)=>{
        let p={};
        vsapi.call(`${main_view.base_url}/hr/dashboard/get-benefits`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            mThis.renderDashboardBottomRight(data);
            onFinish();
          });
    }
    this.loadCards = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/data`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            
            mThis.renderDashboardTop(data);
            mThis.renderDashboardCards(data.cards);
            mThis.renderDashboardCenter(data);
            onFinish();
          });
    }
    this.prepareFormOptions = (data, onFinish) =>{

        mThis.loadCards(onFinish);
        mThis.loadCardsBottomRight(onFinish);

    }
    this.setDashboardScroll = ()=>{
        const parent = mThis.self;
        parent.style.height = (window.innerHeight - 100)+'px';
        parent.classList.add('overflow-y-auto');
        parent.classList.add('overflow-x-hidden');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 100)+'px';
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

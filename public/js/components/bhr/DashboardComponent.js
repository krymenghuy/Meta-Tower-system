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
    this.dashboard_Bottom  = mThis.self.querySelector('#_dashboard_bottom');
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

    this.renderDBChartAllTop = (data) => {
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
                    <div class="w-100"></div>
                    </div>
                </div>


            </div>
            
        </div>
        `;
        mThis.dbChartAll.innerHTML = html;
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
    this.renderDBCards = (data) => {
        let html = `
                <div class="col-md-3 mb-4">
                    <div class="card shadow-sm border-0 rounded-3">
                        <div class="card-body d-flex flex-column align-items-center">
                            <div class="card-title text-center mb-2">
                                <p class="fs-6  mb-0" style="color:#cab54a;">${data.new_staff_count.title}</p>
                                <h3 class="fs-3 text-primary-custom">${data.new_staff_count.count}</h3>
                            </div>
                            <div class="bg--icon bg--icon-new-employee-count">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/new_staff.svg" alt="">
                            </div>
                            <div class="mt-3 text-center">
                                <p class="fs-7 text-muted">${data.new_staff_count.subTitle}</p>
                            </div>
                        </div>
                    </div>
                </div>
                    <div class="col-md-3 mb-4">
                    <div class="card shadow-sm border-0 rounded-3">
                        <div class="card-body bg-white d-flex flex-column align-items-center">
                            <div class="card-title text-center mb-2">
                                <p class="fs-6 mb-0" style="color:#cab54a;">${data.probation_staff_count.title}</p>
                                <h3 class="fs-3 text-primary-custom">${data.probation_staff_count.count}</h3>
                            </div>
                            <div class="bg--icon bg--icon-new-enrollments">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/probation_staff.svg" alt="">
                            </div>
                            <div class="mt-3 text-center">
                                <p class="fs-7 text-muted">${data.probation_staff_count.subTitle}</p>
                            </div>
                        </div>
                    </div>
                </div>
                     <div class="col-md-3 mb-4">
                    <div class="card shadow-sm  border-0 rounded-3">
                        <div class="card-body bg-white d-flex flex-column align-items-center">
                            <div class="card-title text-center mb-2">
                                <p class="fs-6 mb-0" style="color:#cab54a;">${data.resigned_staff_count.title}</p>
                                <h3 class="fs-3 text-primary-custom">${data.resigned_staff_count.count}</h3>
                            </div>
                            <div class="bg--icon bg--icon-special-discount">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/new_staff.svg" alt="">
                            </div>
                            <div class="mt-3 text-center">
                                <p class="fs-7 text-muted">${data.resigned_staff_count.subTitle}</p>
                            </div>
                        </div>
                    </div>
                </div>
                     <div class="col-md-3 mb-4">
                    <div class="card shadow-sm border-0 rounded-3">
                        <div class="card-body d-flex flex-column align-items-center">
                            <div class="card-title text-center mb-2">
                                <p class="fs-6 mb-0" style="color:#cab54a;">${data.warning_staff_count.title}</p>
                                <h3 class="fs-3 text-primary-custom">${data.warning_staff_count.count}</h3>
                            </div>
                            <div class="bg--icon bg--icon-unpaid-student-count">
                                <img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/new_staff.svg" alt="">
                            </div>
                            <div class="mt-3 text-center">
                                <p class="fs-7 text-muted">${data.warning_staff_count.subTitle}</p>
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
    
    
    
    



    this.loadCards = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/data`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            
            mThis.renderDBChartAllTop(data);
            mThis.renderDBCards(data.cards);
            mThis.renderDashboardCenter(data);
            mThis.renderDBCardOnLeave(data.onLeave);

            onFinish();
          });
    }
    this.prepareFormOptions = (data, onFinish) =>{

        mThis.loadCards(onFinish);

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

"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dashboard_top = mThis.self.querySelector('#_dashboard_top');
    this.dashboard_middle = mThis.self.querySelector('#_dashboard_middle');
    this.dashboard_center = mThis.self.querySelector('#_dashboard_center');
    this.dashboard_Bottom  = mThis.self.querySelector('#_dashboard_bottom');
    this.dashboard_Bottom_left = mThis.self.querySelector('#_dashboard_bottom_left');
    this.dashboard_Bottom_right = mThis.self.querySelector('#_dashboard_bottom_right');
    this.barchart = mThis.self.querySelector('#barchart');


    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    }

    this.renderDashboardTop = (data) => {
        if (!data) return;

        let empTypesStaff = data.emp_types.find((type) => type.name === "Staff") || { count: 0 };
        let empTypesInProbation = data.emp_types.find((type) => type.name === "In Probation") || { count: 0 };
        let empTypesInternship = data.emp_types.find((type) => type.name === "Internship") || { count: 0 };

        let html = `
        <div>
            <div class="row">
                <div class="col-md-3">
                    <div class="overview-card card p-2" style="background:#00BFFF">
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="section-title mb-2 fs-6">Department</p>
                        </div>
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="text-center fs-4">${data.d_activeCount}</p>
                            <img class="w-15" src="${main_view.asset_url}/images/icons/department.png" alt=""/>
                        </div>
                    </div>
                </div>
               <div class="col-md-3 ">
                    <div class="overview-card card p-2" style="background:#00BFFF">
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="section-title mb-2 fs-6">Position</p>
                        </div>
                        <div class="w-100 d-flex justify-content-between">
                            <p class="text-center fs-4">${data.p_activeCount}</p>
                            <img class="w-15" src="${main_view.asset_url}/images/icons/position.png" alt=""/>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 ">
                    <div class="overview-card card p-2" style="background:#00FF9C">
                        <div class="w-100 d-flex justify-content-between " >
                            <p class="section-title mb-2 fs-6">Active Employee</p>
                        </div>
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="text-center fs-4">${data.active}</p>
                            <img class="w-15" src="${main_view.asset_url}/images/icons/employee.png" alt=""/>
                        </div>
                    </div>
                </div>
               <div class="col-md-3 ">
                    <div class="overview-card card p-2" style="background:#FA7070">
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="section-title mb-2 fs-6">Resign</p>
                        </div>
                        <div class="w-100 d-flex justify-content-between ">
                            <p class="text-center fs-4">${data.resigned}</p>
                            <img class="w-15" src="${main_view.asset_url}/images/icons/resign.png" alt=""/>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row py-3">
                <div class="col-md-3 p-2">
                    <div class="card bg-grey dashboard_chart" >
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
                 <div class="col-md-6 p-2">
                    <div class=" card bg-grey dashboard_chart">
                        <canvas id="compareChart"></canvas>
                    </div>

                </div>
                <div class="col-md-3 p-2">
                    <div class="card bg-grey dashboard_chart" >
                        <canvas id="accountChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        `;
        mThis.dashboard_top.innerHTML = html;
        mThis.renderemp(data);
        mThis.renderCompareChart(data);
        mThis.renderaccount(data);
    };

    this.renderemp = (data) => {
        if (!data) return;
        const ctx = document.getElementById('myChart').getContext('2d');
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Staff', 'Internship', 'In Probation'],
                datasets: [{
                    data: [
                        data.emp_types.find((type) => type.name === "Staff")?.count || 0,
                        data.emp_types.find((type) => type.name === "Internship")?.count || 0,
                        data.emp_types.find((type) => type.name === "In Probation")?.count || 0,
                    ],
                    backgroundColor: [
                        'rgba(88, 214, 141 )',
                        'rgba(52, 152, 219 )',
                        'rgba(165, 105, 189)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                       'rgba(255, 99, 132, 1)',
                    ],
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
                            return context.chart.data.labels[context.dataIndex] + '\n' + value;
                        }
                    }
                }
            },
            // plugins: [ChartDataLabels]
        });
    };

    this.renderCompareChart = (responseData) => {

        if (!responseData) {
            console.error("Invalid data format or missing data.");
            return;
        }

        const canvas = document.getElementById('compareChart');
        if (!canvas) {
            console.error("Canvas with id 'compareChart' not found.");
            return;
        }
        const ctx = canvas.getContext('2d');

        if (this.compareChartInstance) {
            this.compareChartInstance.destroy();
        }

        const { monthly_totals, dates } = responseData;
        const labels = [
            dates.l3m || 'Last 3 Months',
            dates.l2m || 'Last 2 Months',
            dates.l1m || 'Last Month',
            dates.cm || 'Current Month',
        ];
        const counts = [
            monthly_totals.total_l3m || 0,
            monthly_totals.total_l2m || 0,
            monthly_totals.total_l1m || 0,
            monthly_totals.total_cm || 0,
        ];

        this.compareChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Employees',
                    data: counts,
                    backgroundColor: [
                       'rgba(54, 162, 235)',
                        'rgba(54, 162, 235)',
                        'rgba(54, 162, 235)',
                        'rgba(54, 162, 235)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)',
                        },
                    },
                },
            },
        });
    };

    this.renderaccount = (data) => {
        if (!data) return;
        const acc = document.getElementById('accountChart').getContext('2d');
        if (this.accountInstance) {
            this.accountInstance.destroy();
        }
        this.accountInstance = new Chart(acc, {
            type: 'pie',
            data: {
                labels: ['Payroll', 'Wallet'],
                datasets: [{
                    data: [
                        parseFloat(data.total_payroll.replace(/\s/g, '')),
                        parseFloat(data.total_wallet.replace(/\s/g, ''))
                    ],
                    backgroundColor: [
                        'rgba(88, 214, 141 )',
                        'rgba(93, 173, 226)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
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
                            return context.chart.data.labels[context.dataIndex] + '\n' + value;
                        }
                    }
                }
            },
            // plugins: [ChartDataLabels]
        });
    };


    // this.renderTop = (data) => {
    //     if (!data) return;

    //     let html = `
    //     <div class="employees text-black-50" style="background-color: skyblue;">
    //         <div class="total_employee">
    //             <div class="total_top">
    //                 <span class="total_title">Total Payrolls</span>
    //             </div>
    //             <div class="total_bottom">
    //                 <span class="total_number">${main_view.currency.symbol + data.total_payroll}</span>
    //                <img class="w-15" src="${main_view.asset_url}/images/icons/calculator.png" alt=""/>
    //             </div>
    //         </div>
    //     </div>
    //     <div class="employees text-black-50" style="background-color: #00FF9C;">
    //         <div class="total_employee">
    //             <div class="total_top">
    //                 <span class="total_title">Total Wallets</span>
    //             </div>
    //             <div class="total_bottom">
    //                 <span class="total_number">${main_view.currency.symbol + data.total_wallet}</span>
    //                  <img class="w-15" src="${main_view.asset_url}/images/icons/calculator.png" alt=""/>
    //             </div>
    //         </div>
    //     </div>

    //     <div class="employees text-black-50" style="background-color: #FA7070;">
    //         <div class="total_employee">
    //             <div class="total_top">
    //                 <span class="total_title">Total Warnings</span>
    //             </div>
    //             <div class="total_bottom">
    //                 <span class="total_number">${data.count_warning}</span>
    //                 <img class="w-15" src="${main_view.asset_url}/images/icons/warning.png" alt=""/>
    //             </div>
    //         </div>
    //     </div>
    //     <div class="employees text-black-50" style="background-color: #FFC5C5;">
    //         <div class="total_employee">
    //             <div class="total_top">
    //                 <span class="total_title">On Leaves Today</span>
    //             </div>
    //             <div class="total_bottom">
    //                 <span class="total_number">${data.count}</span>
    //                 <img class="w-15" src="${main_view.asset_url}/images/icons/leave.png" alt=""/>
    //             </div>
    //         </div>
    //     </div>
    //     `;
    //     mThis.dashboard_middle.innerHTML = html;
    // };

    this.renderDashboardCenter = data => {
        if (!data || !data.department_data) return;


        let rowsHtml = data.department_data
          .map(department => `
            <tr>
              <td>${department.department_name}</td>
              <td >${department.position_title}</td>
              <td>${department.staff_count}</td>
              <td>${department.internship_count}</td>
              <td>${department.in_probation_count}</td>
              <td>${department.total_employee_count}</td>
            </tr>
          `)
          .join("");

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
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        `;
        mThis.dashboard_center.innerHTML = html;
      };


      this.renderDashboardBottomLeft = (data) => {
        if (!data || !data.data) return;


        let rowsHtml = data.data
          .map(data => `
            <tr>
            <td><img src="${data.image_url}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%;"></td>
              <td class="pt-4">${data.emp_name}</td>
              <td class="align-items-center m-3 " style="background-color: #3793C7;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        text-align: center;
                                        outline: none;
                                        color: white;
                                        font-size: 12px;
                                        border-radius: 20px;">${data.emp_position}
                </td>
              <td class="pt-4">${data.remarks}</td>

            </tr>
          `)
          .join("");


        let html = `

            <h3 class="d-flex align-items-start text-danger" style="font-size: 1.2rem;desplay: flex; justify-content: center;"> 𝕆𝕟 𝕃𝕖𝕒𝕧𝕖 𝕋𝕠𝕕𝕒𝕪 </h3>
            <table class="table bg-white rounded-4">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

        `;
        mThis.dashboard_Bottom_left.innerHTML = html;
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
                        <td>${main_view.currency.symbol + data.total_bonuses}​</td>
                        <td>${data.lud_bonuses || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Seniority</td>
                        <td>${main_view.currency.symbol + data.total_seniority}</td>
                        <td>${data.lud_seniority || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Life Insurance</td>
                        <td>${main_view.currency.symbol + data.total_life_insurance}</td>
                        <td>${data.lud_life_insurance || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Other</td>
                        <td>${main_view.currency.symbol + data.total_other}</td>
                        <td>${data.lud_other || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td class="text-success">${main_view.currency.symbol + data.total_amount}</td>

                    </tr>
                </tbody>
            </table>
        `;

        mThis.dashboard_Bottom_right.innerHTML = html;
    };

    this.loadCards = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/count-employees`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            // console.log(123,data);
            mThis.renderDashboardTop(data);
            onFinish();
          });
    }

    this.loadCardsCenter = (onFinish)=>{
        let p={};
        vsapi.call(`${main_view.base_url}/hr/dashboard/get-departments`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            mThis.renderDashboardCenter(data);
            onFinish();
          });
    }

    this.loadCardsBottomLeft = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/get-levels`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            mThis.renderDashboardBottomLeft(data);
            // mThis.renderTop(data);
            onFinish();
          });
    }

    this.loadCardsBottomRight = (onFinish)=>{
        let p={};
        vsapi.call(`${main_view.base_url}/hr/dashboard/get-benefits`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ?res.data : {};
            mThis.renderDashboardBottomRight(data);
            onFinish();
          });
    }
    this.prepareFormOptions = (data, onFinish) =>{

        mThis.loadCards(onFinish);
        mThis.loadCardsCenter(onFinish);
        mThis.loadCardsBottomLeft(onFinish);
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

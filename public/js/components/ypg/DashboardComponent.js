"use strict";
var DashboardComponent = new function () {
  const mThis = this;
  this.title_prop = "Dashboard";
  this.self = main_view.VSAppContent.querySelector('#_main_dashboardComponent');
  this.lnkFilterButton = document.querySelector('#_db_filter_data');
  this.init = () => {
    if (mThis.initAlready) return;
    mThis.lnkFilterButton.addEventListener('click',(e)=>{
      e.preventDefault();
      mThis.initFilterDialog(e);
    });
    mThis.initAlready = true;
  }

<<<<<<< HEAD
  this.initFilterDialog = (elBtn) => {
    // vsapi.call(`${main_view.base_url}/api/dashboard/filter-options`, null, null, false).then(res => {
    //   let d = res.status_code == 200 ? res.data : {};
      const op = {
        fields: {
          'academic_year':{
            'name':'academic_year',
            'label':'Academic Year',
            'data':'academic_years',
            'text_field':'academic_year',
            'value_field':'academic_year'
          },
          "campus_id": {
            "label": "Campus",
            // "type": "select",
            "value_field": "id",
            'name':'campus_id',
            "text_field": "campus_name",
            "data": 'campuses',
          }
        },
        end_point:`${main_view.base_url}/api/dashboard/filter-options`,
        default_values: mThis.currentFilterProps
      };
      
      FilterDialog(elBtn, op, null, (d) => {

        //Remember last selected filter data
        
        mThis.currentFilterProps = d;
        mThis.db_filter = d;
        mThis.loadDashBoardData(mThis.currentFilterProps, (d) => {
          mThis.renderDashboard(d);
        });

      });

  }

  this.renderDashboard = (d) => {
    const div = mThis.self;
    let studentByCampus_html = '';
    let totalStudentCard = d.totalStudentCard;
    let filterProps = d.filterProps;
    let campus = filterProps.campus ?? 'TK-Campus',
    academic_year = filterProps.academic_year ?? '2024-2025';
    const cs = totalStudentCard.studentCountByCampus || {};
    for(const b in cs)
    {
      
      studentByCampus_html += `
        <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#1329ea;">${cs[b]?? '0' }</span>
        <p class="set-max-height text-primary-custom mt-2 text-capitalize">Total Students</p>
      `;
    }

    const html = [`<div class="mb-3 p-2 text-primary-custom rounded-3" style="background-color:#f1e6f0;">
                       <h5 class="fw-bold mb-0">${campus} (${academic_year})</h5>
                  </div>
    <div class="row gy-2">
 <!-- <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow h--card l-bg-blue-dark position-relative">
          <div class="d-flex w-100 p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-total-student">
                <img class="img--size" src="${main_view.asset_url}/images/icons/total_student.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                ${studentByCampus_html}
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-muted">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow h--card l-bg-green-dark position-relative">
          <div class="d-flex p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-special-discount">
                <img class="img--size" src="${main_view.asset_url}/images/icons/special_discount.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#ffde2f;">${d.suspendStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.suspendStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-muted">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 l-bg-orange-dark shadow h--card position-relative">
          <div class="d-flex p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-new-enrollments">
                <img class="img--size" src="${main_view.asset_url}/images/icons/new_enrollments.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#eeab00;">${d.dropoutStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.dropoutStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-muted">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between l-bg-cherry rounded-3 shadow h--card bg-white position-relative">
          <div class="d-flex w-100 p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-average-new-student">
                <img class="img--size" src="${main_view.asset_url}/images/icons/average_new_student.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${d.newStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.newStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-muted">${filterProps.academic_year}</small>
          </div>
        </div>
      </div> -->
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative" style="border-left: 6px solid #1329ea;">
          <div class="d-flex w-100 p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-total-student">
                <img class="img--size" src="${main_view.asset_url}/images/icons/total_student.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                ${studentByCampus_html}
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-primary-custom">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative" style="border-left: 6px solid #27b7ff;">
          <div class="d-flex w-100 p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-average-new-student">
                <img class="img--size" src="${main_view.asset_url}/images/icons/average_new_student.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${d.newStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.newStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-primary-custom">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative" style="border-left: 6px solid #eeab00;">
          <div class="d-flex p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-new-enrollments">
                <img class="img--size" src="${main_view.asset_url}/images/icons/new_enrollments.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#eeab00;">${d.dropoutStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.dropoutStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-primary-custom">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative" style="border-left: 6px solid #ffde2f;">
          <div class="d-flex p-1">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-special-discount">
                <img class="img--size" src="${main_view.asset_url}/images/icons/special_discount.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-fill ms-2 overflow-hidden max-height-text-dashboard">
              <div class="text-center p-3">
                <span class="fw-semibold fs-4 text-white px-2 border border-white shadow rounded-2" style="background-color:#ffde2f;">${d.suspendStudentCard.count ?? 0}</span>
                <p class="set-max-height text-primary-custom mt-2 text-capitalize">${d.suspendStudentCard.title}</p>
              </div>
            </div>
          </div>
          <div class="db_details_duration">
            <small class="text-primary-custom">${filterProps.academic_year}</small>
          </div>
        </div>
      </div>
    <!--end render card -->
    <div class="row gy-2 mt-2">
      <div class="col-sm-12 col-lg-3">
        <div class="h-100 bg-white rounded-3 p-3" style="background-image: url(${main_view.asset_url}/images/charts/pie-chart-bg1.jpg);background-repeat: no-repeat; background-size: cover;">
          <p class="fw-semibold fs-5 text-capitalize">${d.studentCountsByProgram.label}</p>
          <div class="chart-container">
            <canvas id="_dash_pie_chart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-3">
        <div class="h-100 rounded-3 p-3" style="background-color:#eee;">
          <div class="chart-container">
            <div class="card-dash l-bg-cherry">
                    <div class="card-statistic-3 p-3">
                        <div class="card-icon card-icon-large"><i class="fa-solid fa-backward"></i></div>
                        <div class="mb-3">
                            <h5 class="card-title mb-0">${d.comebackStudentCard.title}</h5>
                        </div>
                        <div class="row align-items-center mb-2 d-flex">
                            <div class="col-8">
                                <h4 class="d-flex align-items-center mb-0">
                                    ${d.comebackStudentCard.count}
                                </h4>
                            </div>
                        </div>
                        <div class="progress mt-1 " data-height="8" style="height: 8px;">
                            <div class="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                        </div>
                    </div>
                </div>
                <div class="card-dash l-bg-blue-dark">
                    <div class="card-statistic-3 p-3">
                        <div class="card-icon card-icon-large"><i class="fas fa-users"></i></div>
                        <div class="mb-3">
                            <h5 class="card-title mb-0">Total Teachers</h5>
                        </div>
                        <div class="row align-items-center mb-2 d-flex">
                            <div class="col-8">
                                <h4 class="d-flex align-items-center mb-0">
                                    3
                                </h4>
                            </div>
                        </div>
                        <div class="progress mt-1 " data-height="8" style="height: 8px;">
                            <div class="progress-bar l-bg-green" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                        </div>
                    </div>
                </div>
          
                <div class="card-dash l-bg-orange-dark">
                  <div class="card-statistic-3 p-3">
                      <div class="card-icon card-icon-large"><i class="fa-solid fa-users-line"></i></div>
                      <div class="mb-3">
                          <h5 class="card-title mb-0">${d.suspendStudentCard.title}</h5>
                      </div>
                      <div class="row align-items-center mb-2 d-flex">
                          <div class="col-8">
                              <h4 class="d-flex align-items-center mb-0">
                                  ${d.suspendStudentCard.count}
                              </h4>
                          </div>
                        
                      </div>
                      <div class="progress mt-1 " data-height="8" style="height: 8px;">
                          <div class="progress-bar l-bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;"></div>
                      </div>
                  </div>
              </div>
                
            


          </div>
        </div> 
      </div>
      

      <div class="col-sm-12 col-lg-6">
        <div class="h-100 bg-white rounded-3 p-3" style="background-image: url('');background-repeat: no-repeat; background-size: cover;">
          <p class="fw-semibold fs-5 text-capitalize">${d.revenuesByCategory.title}</p>
          <div class="chart-container">
            <canvas id="_dash_line_chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="row gy-2 mt-2">
      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
          <div class="h-100 p-3 rounded-3" style="background-color:#c6c6c62e;">
              <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative mb-3" style="border-left: 6px solid #27b7ff;">
                <div class="d-flex w-100 p-1">
                  <div class="d-flex align-items-start p-2">
                    <div class="position-relative ms-3" style="width: 90px; height: 90px;">
                        <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                            <path class="circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#eee" stroke-width="4" />
                            <path class="circle" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#27b7ff" stroke-width="4"
                                stroke-dasharray="75, 100" stroke-linecap="round" />
                        </svg>
                        <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                            style="color: #194075; font-size: 0.75rem; font-weight: bold; text-align: center;">
                            <span>Payment</span>
                        </div>
                    </div>
                  </div>
                    <div class="mt-4 mx-2 mb-0 fs-5 text-start w-100">
                      <div class="w-100">
                          <p class="fs-6 m-0" style="color: #ca8200;">Total Tuition</p>
                          <hr style="margin: 4px 0; border: 0; border-top: 2px solid #5246467a; width: 80%;">
                          <p class="fs-5" style="color: #194075;">
                            ${d.totalTuitionCard.amount.toLocaleString()} ${d.totalTuitionCard.currency_code}
                          </p>
                      </div>
                   </div>
                </div>
              </div>
              <div class="d-flex flex-column justify-content-between rounded-3 shadow-sm h--card bg-white position-relative mb-3" style="border-left: 6px solid #ffde2f;">
                <div class="d-flex w-100 p-1">
                  <div class="d-flex align-items-start p-2">
                    <div class="position-relative ms-3" style="width: 90px; height: 90px;">
                        <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                            <path class="circle-bg" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#eee" stroke-width="4" />
                            <path class="circle" d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="#ffde2f" stroke-width="4"
                                stroke-dasharray="60, 100" stroke-linecap="round" />
                        </svg>
                        <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                            style="color: #194075; font-size: 0.75rem; font-weight: bold; text-align: center;">
                            <span>Payment</span>
                        </div>
                    </div>
                  </div>
                  <div class="mt-4 mx-2 mb-0 fs-5 text-start w-100">
                    <div class="w-100">
                        <p class="fs-6 m-0" style="color: #ca8200;">Total Non-Tuition</p>
                        <hr style="margin: 4px 0; border: 0; border-top: 2px solid #5246467a; width: 80%;">
                        <p class="fs-5" style="color: #194075;">
                            ${d.totalNonTuitionCard.amount.toLocaleString()} ${d.totalNonTuitionCard.currency_code}
                        </p>

                    </div>
                  </div>
                </div>
              </div>
              
          </div>       
      </div>
      <div class="col-sm-12 col-lg-3">
          <div class="h-100 p-3 rounded-3" style="background-color:#c6c6c62e;">
              <img src="${main_view.asset_url}/images/charts/image1.jpg" 
                  style="background-repeat: no-repeat; background-size: cover; width: 100%; height: auto;" 
                  alt="Chart Image">
          </div>
      </div>

      <div class="col-sm-12 col-lg-6">
        <div class="h-100 p-3 rounded-3" style="background-image: url(${main_view.asset_url}/images/charts/image2.jpg);background-repeat: no-repeat; background-size: cover;">
        </div>
      </div>
    </div>
    


    `].join('');
    div.innerHTML = html;
    mThis.renderDoughnutChart(div, d.studentCountsByProgram);
    mThis.renderLineChart(div, d.revenuesByCategory);

    div.style.height = (window.innerHeight - 90) + 'px';
    div.style.overflow = 'auto';
    
    window.onresize = function (e) {
      e.preventDefault();
      div.style.height = (window.innerHeight - 90) + 'px';
      div.style.overflow = 'auto';
    };
    
    
  }

  this.renderLineChart = (div, data) => {
    data = data || {};
    const lineChart = div.querySelector('#_dash_line_chart');

    new Chart(lineChart, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: data.max_y_scale || undefined,
            ticks: {
              stepSize: 500
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false, // Allow flexible sizing
        onResize: (chart, size) => {
          chart.canvas.style.width = '100%';
          chart.canvas.style.height = '100%';
        }
      }
    });
};


  this.renderDoughnutChart = (div, data) => {
    data = data ? data : {};
    console.log(123,data);
    
    const doughnutChart = div.querySelector('#_dash_pie_chart');

    new Chart(doughnutChart, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        onResize: (chart,size) => {
          chart.canvas.style.width = '100%';
          chart.canvas.style.height = '100%';
        },
        plugins: {
          legend: {
            labels: {
              generateLabels: function (chart) {
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);
                var datasetColors = chart.data.datasets.map(function (e) {
                  return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();
                labelsOriginal.forEach(label => {
                  label.datasetIndex = (label.index - label.index % 2) / 2;
                  label.hidden = !chart.isDatasetVisible(label.datasetIndex);
                  label.fillStyle = datasetColors[label.index];
                });
                return labelsOriginal;
              },
              padding: 20, // Add padding to legend labels
              font: {
                size: 14, // Increase font size for legend labels
              },
            },
            onClick: function (mouseEvent, legendItem, legend) {
              legend.chart.getDatasetMeta(legendItem.datasetIndex).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
              legend.chart.update();
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + context.formattedValue;
              },
            },
          },
        },
      },
    });
  }

  this.loadDashBoardData = (filter, onFinish) => {
    vsapi.call(`${main_view.base_url}/api/dashboard/summaries`, filter, main_view.apiCluster).then(res => {
      const data = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
      if(typeof onFinish === 'function')onFinish(data);
    });
  }

  this.show = (options) => {
    mThis.init();
    if (!options) options = {};
    main_view.setContentView(mThis.self,mThis.title_prop);
    mThis.loadDashBoardData(mThis.db_filter, (d) => {
      mThis.renderDashboard(d);
    
    });
  }
}
=======
var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "Dashboard";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_dashboardComponent");
    // mThis.self = mThis.jm[0];

    // *** When DashboardComponent is showing, create Dashboard Filter button near page title
    mThis.onShow = (options) => {
        if (!AuthManager.allowed(254,true)) return;
        mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
        const divTitle = main_view.divTitle;
        let btn = divTitle.querySelector(".btn-db-fitler");
        if (btn) return;
        divTitle.insertAdjacentHTML(
            "beforeend",
            '<div class="d-none div-db-filter w-100 text-end"><button class="btn-db-fitler btn btn-sm btn-primary-custom rounded-circle p-2"><i class="fa-solid text-white fa-paper-plane"></i></button></div>'
        );
        btn = divTitle.querySelector(".btn-db-fitler");
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


    mThis.renderDBChartAllTop = (data) => {
        data = data ? data : {};
       let html = [
            `<div class="chart-row  py-5">`,
                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart">`,
                        `<span class="fw-semibold fs-5 text-primary-custom text-capitalize">`,
                            data.doughnutChart.title,
                        `</span>`,
                        `<canvas id="doughnutChart"></canvas>`,
                    `</div>`,
                `</div>`,

                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart bg-white shadow-sm">`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/team.svg" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${data.cards.member_never_expired ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Member Never Expires</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/deadline.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.member_near_expiry ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Members Nearing Expiration</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/expired.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.member_expired_date ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Member Has Expired</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                    `</div>`,
                `</div>`,

                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart bg-white shadow-sm">`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${data.cards.grave_slot_avialable ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Available</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.grave_slot_reversed ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Reserve</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.grave_slot_used ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Used</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                    `</div>`,
                `</div>`,

                 `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart">`,
                        `<span class="fw-semibold fs-5 text-primary-custom text-capitalize">`,
                            data.memberTasks.title,
                        `</span>`,
                        `<canvas id="memberTasks"></canvas>`,
                    `</div>`,
                `</div>`,

            `</div>`
        ].join("");

        mThis.dbChartAll.innerHTML = html;
        mThis.renderChartMember(data.doughnutChart);
        mThis.renderChartMemberAssign(data.memberTasks);
    };

    mThis.renderChartMember = (data) => {
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

    mThis.renderChartMemberAssign = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById("memberTasks").getContext("2d");

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


    mThis.renderDBCards = (data) => {
        let html = [
        `<div class="col-md-3">
            <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                <div class="d-flex align-items-center p-2 mb-1">
                    <div class="bg--icon">
                        <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/task.png" alt="Icon">
                    </div>
                    <div class="ms-3 text-center flex-fill">
                        <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.task_type ?? 0}</span>
                        <div class="text-primary mt-1">Task Type</div>
                    </div>
                </div>
                <hr style="border:1px solid #fff; margin:0;">
            </div>
        </div>`,

        `<div class="col-md-3">
            <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                <div class="d-flex align-items-center p-2 mb-1">
                    <div class="bg--icon">
                        <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/task_assign.png" alt="Icon">
                    </div>
                    <div class="ms-3 text-center flex-fill">
                        <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.task_assign ?? 0}</span>
                        <div class="text-primary mt-1">Task Assign</div>
                    </div>
                </div>
                <hr style="border:1px solid #fff; margin:0;">
            </div>
        </div>`,

        `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                    <div class="d-flex align-items-center p-2 mb-1">
                        <div class="bg--icon">
                            <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/deceased.png" alt="Icon">
                        </div>
                        <div class="ms-3 text-center flex-fill">
                            <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.deceased ?? 0}</span>
                            <div class="text-primary mt-1">Register Deceased</div>
                        </div>
                    </div>
                    <hr style="border:1px solid #fff; margin:0;">
                </div>
            </div>
        </div>`
    ].join('');

        mThis.dbCards.innerHTML = html;
    };

    mThis.loadCards = (onFinish) => {
        const p = {};

        vsapi.call(`${main_view.base_url}/ypg/dashboard/data`,p,null,false,false).then((res) => {
            const data = res.status_code === 200 ? res.data : {};
            mThis.renderDBChartAllTop(data);
            mThis.renderDBCards(data);
            // mThis.renderDBCardBottom(data);

            onFinish();
        });
    };
    mThis.prepareFormOptions = (data, onFinish) => {
        mThis.loadCards(onFinish);
    };

    mThis.setDashboardScroll = () => {
        const parent = mThis.self;
        parent.style.height = window.innerHeight - 70 + "px";
        parent.classList.add("overflow-y-auto");
        parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            parent.style.height = window.innerHeight - 70 + "px";
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
                    height: 88.6vh;
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
>>>>>>> 3448493fd7e98ebffab9d945002422948fd537ad

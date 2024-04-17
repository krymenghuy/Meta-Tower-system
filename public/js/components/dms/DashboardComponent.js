"use strict";
var DashboardComponent = new function () {
  const mThis = this;
  this.title_prop = "Dashboard";
  this.self = main_view.appContent.children('#_main_dashboardComponent');

  // this.init = () => { 
  //   if(mThis.initAlready) return;
  //    //Write init code here ....
  //   mThis.initAlready = true;
  // }

  this.renderDashboard = (d) => {
    d = d || {};
    const div = mThis.self;
    let card = d.cards; //|| {"merchant_count":{"count":0,"title":"Active Merchants"}, "driver_count":{"count":0,"title":"Active Drivers"}};
    if(!card){
      div.html(`<div class="p-2 m-3"><h5>Dashboard is not loaded properly. You may have to refresh the page</h5></div>`);
      return;
    }
    //div.html(`<div class="p-2 m-3"> <div id="vs_loading"></div></div>`);
    const html = [`<div class="row gy-2">
      <div class="col-sm-12 col-lg-6 col-xl-3">  
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
              <div class="d-flex align-items-start p-2">
                <div class="bg--icon bg--icon-total-student">
                  <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/marchant.svg" alt=""/>
                </div>
              </div>
              <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
                <div class="text-center px-3">
                  <span class="card-value">${card.merchant_count.count}</span>
                  <p class="text-capitalize">${card.merchant_count.title}</p>
                </div>
              </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.merchant_count.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-average-new-student">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/active_driver.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.driver_count.count}</span>
                <p class="text-capitalize">${card.driver_count.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.driver_count.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-new-enrollments">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/package_count.svg" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.package_count.count}</span>
                <p class="text-capitalize">${card.package_count.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.package_count.subTitle || ''}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-special-discount">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/delivered.svg" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.delivered_count.count}</span>
                <p class="text-capitalize">${card.delivered_count.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.delivered_count.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="row gy-2 mt-2">
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-unpaid-student-count">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/returned.svg" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.returned_count.count}</span>
                <p class="text-capitalize">${card.returned_count.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.returned_count.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-new-student-invoices">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/total_earnings.svg" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.total_earnings.amount}</span><small> ${card.total_earnings.currency_code}</small>
                <p class="text-capitalize">${card.total_earnings.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.total_earnings.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-total-invoices-in-month">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/daily_earnings.svg" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.avg_daily_earnings.amount}</span>
                <small> ${card.avg_daily_earnings.currency_code}</small>
                <p class="text-capitalize">${card.avg_daily_earnings.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.avg_daily_earnings.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-6 col-xl-3">
        <div class="d-flex flex-column rounded-3 shadow-sm db-card bg-white">
          <div class="d-flex">
            <div class="d-flex align-items-start p-2">
              <div class="bg--icon bg--icon-special-discount-pending">
                <img class="img--size" src="${main_view.asset_url}/images/icons/dashboard/mobile_register.png" alt=""/>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-end flex-fill ms-2">
              <div class="text-center px-3">
                <span class="card-value">${card.appDownload.count}</span>
                <p class="text-capitalize">${card.appDownload.title}</p>
              </div>
            </div>
          </div>
          <div class="sub-title">
            <span class="d-block text-center text-muted">
              <small>${card.appDownload.subTitle}</small>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="row gy-2 mt-2">
      <div class="col-sm-12 col-lg-8">
        <div class="h-100 bg-white rounded-3 p-3" style="background-image: url('');background-repeat: no-repeat; background-size: cover;">
          <p class="fw-semibold fs-5 text-capitalize">${d.revenuesByCategory.title}</p>
          <div class="chart-container">
            <canvas id="_dash_line_chart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-4">
        <div class="h-100 bg-white rounded-3 p-3" style="background-image: url(${main_view.asset_url}/images/charts/dashboard/pie-chart-bg.jpg);background-repeat: no-repeat; background-size: cover;">
          <span class="d-block fw-semibold fs-5 text-capitalize text-center">${d.merchantByCategory.title}</span>
          <span class="d-block fw-semibold pb-2 text-center"><small>${d.merchantByCategory.subTitle}</small></span>
          <div class="chart-container">
            <canvas id="_dash_pie_chart"></canvas>
          </div>
        </div>
      </div>
    </div>`].join('');
    div.html(html);
    if(d.merchantByCategory){
      mThis.renderDoughnutChart(div, d.merchantByCategory);
      mThis.renderLineChart(div, d.revenuesByCategory);
    }
    
    div.css({
      height: window.innerHeight - 90,
      overflow: 'auto',
    });

    window.onresize = function (e) {
      e.preventDefault();
      div.css({
        height: window.innerHeight - 90,
        overflow: 'auto',
      });
    };
  }

  this.renderLineChart = (div, data) => {
    data = data ? data : {};
    const lineChart = div.find('#_dash_line_chart');

    new Chart(lineChart, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true, // Allow the y-axis to start at a non-zero value
            suggestedMin: 0, // Adjust the minimum value for the y-axis
            suggestedMax: 16000, // Adjust the maximum value for the y-axis
            stepSize: 500, // Set the interval between y-axis ticks to 20 units
          }
        },
        onResize: () => {
          lineChart.width('100%'),
          lineChart.height('100%');
        },
        responsive: true
      }
    });
  }

  this.renderDoughnutChart = (div, data) => {
    data = data ? data : {};
    const doughnutChart = div.find('#_dash_pie_chart');

    // Calculate the highest percentage
    let highest_amount = 0;
    data.datasets[0].data.forEach(value => {
        highest_amount = Math.max(highest_amount, value);
    });

    new Chart(doughnutChart, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: false,
            onResize: () => {
                doughnutChart.width('100%');
                doughnutChart.height('100%');
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                      generateLabels: function (chart) {
                        const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                        const labelsOriginal = original.call(this, chart);
                        const datasetColors = chart.data.datasets.flatMap(e => e.backgroundColor); // Use flatMap for brevity

                        labelsOriginal.forEach(label => {
                            label.datasetIndex = Math.floor(label.index / 2); // Simplify calculation
                            label.hidden = false; //!chart.isDatasetVisible(label.datasetIndex);
                            label.fillStyle = datasetColors[label.index];
                        });
                        return labelsOriginal;
                    },
                        padding: 20,
                        font: {
                            size: 14,
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return [' ',context.dataset.label , ': $' , context.formattedValue].join('');
                        },
                    },
                },
            },
            cutout: '70%',
            maintainAspectRatio: false,
        },
    });

    // // Create an overlay div for displaying the highest percentage in the center
    // const overlay = document.createElement('div');
    // overlay.innerHTML = `<div style="position: absolute; top: 31%; left: 20%; font-size: 20px; font-weight: 600;">$${highest_amount}</div>`;
    // doughnutChart.parent().append(overlay);
 }



  this.loadDashBoardData = (onFinish = null) => {
    vsapi.call(`${main_view.base_url}/dms/dashboard/data`, null, null,main_view.apiCluster).then(res => {
      const data = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
      onFinish(data);
    });
    //  clearTimeout(mThis.db_timeout);
    //  mThis.db_timeout = setTimeout(()=>{
     
    //  },250);
  }

  this.show = (options ={}) => {
    ///mThis.init();
    if (!options) options = {};
    mThis.loadDashBoardData((d) => {
      mThis.renderDashboard(d);
      main_view.setTitle(mThis.title_prop);
      mThis.self.siblings().hide();
      mThis.self.fadeIn(200);
    });
  }
};
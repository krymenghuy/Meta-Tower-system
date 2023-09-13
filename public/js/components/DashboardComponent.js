"use strict";
var DashboardComponent = new function (){
  let mThis = this;
  this.title_prop = "Dashboard";
  this.self = main_view.appContent.children('#_main_dashboardComponent');

  this.init = () => {}

  this.displayDashboard = (d) => {
    const div = mThis.self;
    let html = [`<div class="row row-cols-lg-4 gy-2">
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-total-student">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/total_student.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p>Total Student</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-average-new-student">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/average_new_student.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p>Average New Student</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-new-enrollments">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/new_enrollments.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p>New Enrollments</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-special-discount">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/special_discount.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p class="p-0 m-0">Special Discount<br/>(Approved Amount)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-cols-lg-4 gy-2 mt-2">
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-unpaid-student-count">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/wallet.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p>Unpaid Student Count</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-new-student-invoices">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/new_student_invoices.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p class="p-0 m-0">New Student Invoices<br/>(Amount)</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-total-invoices-in-month">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/total_invoice_in_month.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p class="text-capitalize">Total invoices in this month</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="d-flex rounded-3 shadow-sm p-2 h--card bg-white">
          <div class="d-flex align-items-start">
            <div class="bg--icon bg--icon-special-discount-pending">
              <img class="img--size" src="${main_view.base_url}/assets/images/icons/special_discount_pending.png" alt=""/>
            </div>
          </div>
          <div class="d-flex align-items-end ms-2">
            <div class="text-center px-3">
              <h1>399</h1>
              <p class="p-0 m-0">Special Discount<br/>(Pending Amount)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row gy-2 mt-2">
      <div class="col-lg-8">
        <div class="h-100 bg-white rounded-3 p-3 chart-container">
          <canvas id="_dash_line_chart"></canvas>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="h-100 bg-white rounded-3 p-3">
          <canvas id="_dash_pie_chart"></canvas>
        </div>
      </div>
    </div>`].join('');
    div.html(html);
    mThis.renderLineChart(div,d);
  }

  this.renderLineChart = (div, data) => {
    data = data ? data : [];
    const lineChart = div.find('#_dash_line_chart'),
    pieChart = div.find('#_dash_pie_chart');
    let dataLineChart = [],
    dataPieChart = [];

    data.map(d => {
      dataLineChart.push({
        label: d.program_name,
        data: d.data_program,
        fill: false,
        borderColor: d.color,
        tension: 0.1
      });

      dataPieChart.push({
        label: d.program_name,
        data: d.data_program,
        backgroundColor:['#6AD500','#DB1717','#432AE3'],
        hoverOffset: 4
      });
    });

    new Chart(lineChart,{
      type: 'line',
      data: {
        labels: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        datasets: dataLineChart
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        onResize: () => {
          lineChart.width('100%'),
          lineChart.height('100%');
        },
        responsive: true
      }
    });

    new Chart(pieChart,{
      type: 'pie',
      data: {
        labels: dataPieChart.label,
        datasets: dataPieChart
      },
      options:{
        onResize: () => {
          pieChart.width('100%'),
          pieChart.height('100%');
        },
        responsive: true
      }
    });
  }

  this.loadDashBoardData = (onFinish = null) => {
    const data = [{
      'program_name': 'Program 1',
      'data_program': [74, 64, 62, 55, 75, 78, 84],
      'color': '#6AD500'
    }];
    if(typeof onFinish === 'function') onFinish(data);
  }

  this.show = (options) => {
    if(!options) options = {};
    mThis.loadDashBoardData((d) => {
      mThis.displayDashboard(d);
      main_view.setTitle(mThis.title_prop);
      let x = mThis.self.siblings(':visible');
      if(x.length === 0){
        mThis.self.hide().fadeIn(200);
        return;
      }
      x.hide(0,function(){
        mThis.self.hide().fadeIn(200);
      });
    });
  }
}

window.addEventListener('DOMContentLoaded',() => {
  DashboardComponent.init();
});
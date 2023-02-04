"use strict";
let DashboardComponent = new function(){
  let mThis = this;
  this.title_prop = "Dashboard";
  this.base_url = $('#__base_url').val();
  this.self = $('#_main_dashboardComponent');
  this.tblDashboard = $('#_dash_tblDashboard');
  this.barCharts = $('#_dash_barChart');
  this.pieCharts = $('#_dash_pieChart');

  this.init = () => {}

  this.displayDashboardTable = () => {
    vsapi.call(`${mThis.base_url}/api/dashboard`,null).then(res => {
      let data = StringSanitizer.sanitizeObject(res.data);

      if(mThis.table){
        mThis.tblDashboard.DataTable().clear().destroy();
        mThis.tblDashboard.empty();
        mThis.table = null;
      }

      let cols = [{
        title: "No",
        data: "id"
      },{
        title: "Code",
        data: "code_id"
      }];

      if(!mThis.table){
        mThis.table = mThis.tblDashboard.DataTable({
          searching:false,
          destroy:true,
          paging:true,
          ordering:false,
          //dom: 'Bfrtip',
          retrieve: true,
          //scrollY:390,
          //scrollX:500,
          //pagingType:'numbers',
          info:true,
          pageLength: 10,
          bLengthChange:false,
          saveState:true,
          'processing': true,
          'language': {
              'loadingRecords': '&nbsp;',
              'processing': 'Loading...',
              "emptyTable": LocaleManager.trans('No data to display','datatable')
          },
          'data': data,
          'columns': cols
          ,"createdRow": function(row, data, dataIndex){
            let tr = $(row);
            tr.data('id',data.id);
          }
        });
      }
    });
  }

  this.displayBarChart = () => {
    new Chart(mThis.barCharts,{
      type: 'bar',
      data:  {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        }
      }
    });

    new Chart(mThis.pieCharts, {
      type: 'pie',
      data: {
        datasets: [{
          data: [10, 20, 30, 40, 50, 60],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }],
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
      },
    });
  }

  this.show = (option) => {
    main_view.setTitle(mThis.title_prop);
    mThis.self.show().siblings().hide();
    mThis.displayDashboardTable();
    mThis.displayBarChart();
  }
}

$(document).ready(() => {
  DashboardComponent.init();
});
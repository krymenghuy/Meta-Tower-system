"use strict";
let Dashboard2Component = new function(){
    let mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_dashboard2Component');
    this.tblDashboard2 = $('#_dash2_tblDashboard2');
    this.barChart = $('#_dash2_barChart');
    this.pieChart = $('#_dash2_pieChart');

    this.init = () => {}

    this.displayDashboardTable = () => {
        vsapi.call(`${mThis.base_url}/api/dashboard2`,null).then(res => {
          let data = StringSanitizer.sanitizeObject(res.data);
    
          if(mThis.table){
            mThis.tblDashboard2.DataTable().clear().destroy();
            mThis.tblDashboard2.empty();
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
            mThis.table = mThis.tblDashboard2.DataTable({
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
        new Chart(mThis.barChart,{
            type: 'bar',
            data: {
                labels: ['January','February', 'March', 'April','May', 'June','July','August','Setember','Octorboer','November','December'],
                datasets:[{
                    label: 'Bar Dataset',
                    data: [10, 7, 30, 40, 89, 75, 19, 84, 84, 74, 45, 73],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(173, 0, 0, 0.6)',
                        'rgba(255, 255, 0, 0.6)',
                        'rgba(0, 255, 255, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)',
                        'rgba(0, 255, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(173, 0, 0, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 255, 0, 1)'
                    ],
                    borderWidth: 1,
                    order: 1
                },{
                    label: 'Bar Dataset',
                    data: [12, 25, 37, 49, 75, 53, 65, 43, 85, 73, 54, 12],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(173, 0, 0, 0.6)',
                        'rgba(255, 255, 0, 0.6)',
                        'rgba(0, 255, 255, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)',
                        'rgba(0, 255, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(173, 0, 0, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 255, 0, 1)'
                    ],
                    borderWidth: 1,
                    order: 2
                }]
            },
            options:{
                scales: {
                    yAxes: [{
                        display: false
                    }]
                }
            }
        });

        new Chart(mThis.pieChart, {
            type: 'pie',
            data: {
              datasets: [{
                data: [300, 200, 100, 500],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
              }],
              labels: ['Class A', 'Class B', 'Class C', 'Class D']
            },
        });
    }

    this.show = (option) => {
        mThis.displayBarChart();
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

$(document).ready(() => {
    Dashboard2Component.init();
});
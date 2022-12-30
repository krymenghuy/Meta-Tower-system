'use strict'
var DashboardComponent = new function(){
    let mThis = this;
    this.base_url = $('#__base_url').val();
    this.title_prop ='dashboard';
    
    this.self = $('#_main_dashboardComponent');
    //this.elScreenTitle = $('#screen_title');
    this.tblLoanApps = $('#dbc_tblLoanApps');
    this.tblMonthlyPmts = $('#dbc_tblMonthlyPmts');

    this.reload_dashboard_data = ()=>{
        vsapi.call(`${mThis.base_url}/api/dashboard/board-data`,null).then((result)=>{
          if(result.status_code ===200){
            let d = result.data?result.data:{};
            mThis.initCards(d.summary); 
            mThis.initPieChart('myPieChart',d.piechart_data);
            mThis.createBarChart('myBarChart',d.barchart_data);
            mThis.initTable_monthly(d.table_data_monthly);
            mThis.initTableLoanApps(d.table_data_apps);
          }else console.error('api/dashboard/board-data returns NULL');
        });
    }

    this.init = ()=>{
        mThis.reload_dashboard_data();

        mThis.tblLoanApps.on('click','.dbc-link_loan_app',function(e){
           e.preventDefault();
           let x = $(this);
           let person_id = x.data('id');
           let loan_app_id = x.data('id');
           let p = {'loan_app_id':loan_app_id,'person_id':person_id};

           let op = {'title':'Review Application','loan_app_id':loan_app_id,'previous_view':mThis,'previous_view_option':{'title':'Dashboard'},'refresh_data':true};
           LoanAppComponent.show(op);    

        });

    //    mThis.initCards(); 
    //    mThis.createPieChart('myPieChart');
    //    mThis.createBarChart('myBarChart');
    //    mThis.initTable();
 
    }

    this.show = (option=null)=>{
      if(!option) option={};
       main_view.setTitle(mThis.title_prop); 
       if(option.refresh_data) mThis.reload_dashboard_data(); 
       mThis.self.show().siblings().hide();
    }

    

    // this.spaTotalReturnToMerchants = (element_id,d) => {
    //     const ctx = document.getElementById(element_id).getContext('2d');
    //     const h_light = document.getElementById([element_id,'_highlight'].join(''));
    //     h_light.innerText = d.total;
        
    //     const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         datasets: [
    //         {
    //             data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
    //             backgroundColor: '#88FFA9',
    //         }
    //         ]
    //     },
    //     options: {
    //         responsive: false,
    //         legend: {
    //         display: false
    //         },
    //         elements: {
    //         line: {
    //             borderColor: '#000000',
    //             borderWidth: 1
    //         },
    //         point: {
    //             radius: 0
    //         }
    //         },
    //         tooltips: {
    //         enabled: false
    //         },
    //         scales: {
    //         yAxes: [
    //             {
    //             display: false
    //             }
    //         ],
    //         xAxes: [
    //             {
    //             display: false
    //             }
    //         ]
    //         }
    //     }
    //     });
    // }

    this.initCards = (d)=>{
                d =d?d:{};
                //begin:: set dashboard card's currency
                let cur = d.currency;
                if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
                if(cur=='$') cur ='USD';
                else if((cur+'').toLowerCase() =='riel') cur ='KHR';
                cur =`<span class="dbc-currency">${cur}</span>`;
            //end:: set dashboard card's currency
    
            d = StringSanitizer.sanitizeObject(d);  
            if (d) {
               //alert(JSON.stringify(result));
               let dd = d.payer_count;

               mThis.self.find('.dbc-card-value').each(function(){
                   let el = $(this);
                   let f = el.data('field');
                   let val = d[f];
    
                   if(el.data('item') =='count'){
                       cur ='';
                   }else val =Number(d[f]).toLocaleString();
                    
                   if(f =='principal_paid_percent') {
                    val = `<span class="dbc-card-percent-delivered">(${d.principal_paid_percent}%)</span>`;
                    cur ='';
                   }
                   //else if(f=='returned_count') val = `${val} <span class="dbc-card-percent-returned">(${returned_percent}%)</span>`;
                   el.html(`${val}${cur}`);
                  
                });
               mThis.self.find('.dbc-card-period').text(d.card_period);
            }

    } 

    // this.spaTotalContinueToDeliver = (element_id,d) => {
    //     const ctx = document.getElementById(element_id).getContext('2d');
    //     const h_light = document.getElementById([element_id,'_highlight'].join(''));
    //     h_light.innerText = d.total;
    //     const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels:d.labels,
    //         datasets: [
    //             {
    //                 data: d.data, //[435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
    //                 backgroundColor: '#FFF482'
    //             }
    //         ]
    //     },
    //     options: {
    //         responsive: false,
    //         legend: {
    //         display: false
    //         },
    //         elements: {
    //         line: {
    //             borderColor: '#000000',
    //             borderWidth: 1
    //         },
    //         point: {
    //             radius: 0
    //         }
    //         },
    //         tooltips: {
    //         enabled: false
    //         },
    //         scales: {
    //         yAxes: [
    //             {
    //             display: false
    //             }
    //         ],
    //         xAxes: [
    //             {
    //             display: false
    //             }
    //         ]
    //         }
    //     }
    //     });
    // }

    // this.spaTotalDoneDeliveries = (element_id,d) => {
    //     const ctx = document.getElementById(element_id).getContext('2d');
    //     const h_light = document.getElementById([element_id,'_highlight'].join(''));
    //     h_light.innerText = d.total;
    //     const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         datasets: [
    //         {
    //             data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
    //             backgroundColor: '#FF8889',
    //         }
    //         ]
    //     },
    //     options: {
    //         responsive: false,
    //         legend: {
    //         display: false
    //         },
    //         elements: {
    //         line: {
    //             borderColor: '#000000',
    //             borderWidth: 1
    //         },
    //         point: {
    //             radius: 0
    //         }
    //         },
    //         tooltips: {
    //         enabled: false
    //         },
    //         scales: {
    //         yAxes: [
    //             {
    //             display: false
    //             }
    //         ],
    //         xAxes: [
    //             {
    //             display: false
    //             }
    //         ]
    //         }
    //     }
    //     });
    // }

    // this.createLineChart = (element_id)=>{

    //     const ctx = document.getElementById(element_id).getContext('2d');
    //     post_ajax(`${mThis.base_url}/api/dashboard/barchart-one`,null,(d)=>{
            
    //         let cur = d.currency;
    //         if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
    //         if(cur=='$') cur ='USD';
    //         else if((cur+'').toLowerCase() =='riel') cur ='KHR';
    //         cur =`<span class="dbc-currency">${cur}</span>`;

    //             d.change_in_earnings = StringSanitizer.sanitizeOut(d.change_in_earnings);
    //             d.last_earnings = StringSanitizer.sanitizeOut(d.last_earnings);
    //             const myChart = new Chart(ctx, {
    //                 type: 'line',
    //                 data: {
    //                     labels: d.months,  //['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'],
    //                     datasets: [{
    //                         label: "Payers",
    //                         borderColor: "#007bff",
    //                         pointBorderColor: "#007bff",
    //                         // pointBackgroundColor: "#80b6f4",
    //                         pointHoverBackgroundColor: "#007bff",
    //                         pointHoverBorderColor: "#007bff",
    //                         pointBorderWidth: 10,
    //                         pointHoverRadius: 10,
    //                         pointHoverBorderWidth: 1,
    //                         pointRadius: 3,
    //                         fill: false,
    //                         borderWidth: 3,
    //                         data: d.payer_counts //[100, 120, 150, 170, 180, 170, 160,150,190,180,201,220,260]
    //                     },
    //                     {
    //                         label: "earnings",
    //                         borderColor: "#ced4da",
    //                         pointBorderColor: "#ced4da",
    //                         // pointBackgroundColor: "#D3D3D3",
    //                         pointHoverBackgroundColor: "#ced4da",
    //                         pointHoverBorderColor: "#ced4da",
    //                         pointBorderWidth: 10,
    //                         pointHoverRadius: 10,
    //                         pointHoverBorderWidth: 1,
    //                         pointRadius: 3,
    //                         fill: false,
    //                         borderWidth: 3,
    //                         data: d.earnings //[200, 120, 300, 170, 180, 190, 160,200,125,105,100,109,180]
    //                     }
                        
    //                 ]
    //                 },
    //                 options: {
    //                     scales: {
    //                         xAxes: [{
    //                             gridLines: {
    //                                 display: false
    //                             }
    //                         }],
    //                         yAxes: [{
    //                             gridLines: {
    //                                 display: false
    //                             }
    //                         }],
                            
    //                     }
    //                 }
    //             });
    //     });
    // }

    this.initPieChart = (element_id,d)=>{
        d= d || {};
        const data = {
            // labels: [
            //   'Red',
            //   'Green',
            //   'Yellow',
            //   'Grey',
            //   'Blue'
            // ],
            labels:d.labels,
            datasets: [
                {
                    label: 'Dataset1',
                   
                    data: d.amounts,
                    backgroundColor:d.back_colors_amount
                },
                {
                    label: 'Dataset2',
                    data: d.counts,
                    backgroundColor: d.back_colors_count
                }
            ]
          };


          const ctx = document.getElementById(element_id).getContext('2d');
          const myPieChart = new Chart(ctx,{
            type: 'doughnut',
            data:data,
            options:{
              plugins:{
                legend:{
                  display:true,
                  position:'bottom',
                  align:'start',
                  labels:{
                    boxWidth:70,
                
                  }
                }
              }
            }
          });

    }

    this.createPieChart1 = (element_id)=>{
         const ctx = document.getElementById(element_id).getContext('2d');
        vsapi.call(`${mThis.base_url}/api/dashboard/piechart-one`,null).then((d)=>{
             if(d){
                        const myPieChart = new Chart(ctx,{
                            type: 'doughnut',
                            data: {
                              labels: d.labels,
                              datasets: [{
                                backgroundColor:d.colors,
                                hoverBorderColor: 'white',
                                data: d.values,
                                datalabels: {
                                  labels: {
                                    index: {
                                      align: 'end',
                                      anchor: 'end',
                                      color: function(ctx) {
                                        return ctx.dataset.backgroundColor;
                                      },
                                      font: {size: 18},
                                      formatter: function(value, ctx) {
                                        return ctx.active
                                          ? 'index'
                                          : '#' + (ctx.dataIndex + 1);
                                      },
                                      offset: 8,
                                      opacity: function(ctx) {
                                        return ctx.active ? 1 : 0.5;
                                      }
                                    },
                                    name: {
                                      align: 'top',
                                      font: {size: 16},
                                      formatter: function(value, ctx) {
                                          return "fff";
                                        // return ctx.active
                                        //   ? 'name'
                                        //   : ctx.chart.data.labels[ctx.dataIndex];
                                      }
                                    },
                                    value: {
                                      align: 'bottom',
                                      backgroundColor: function(ctx) {
                                        var value = ctx.dataset.data[ctx.dataIndex];
                                        return value > 50 ? 'white' : null;
                                      },
                                      borderColor: 'white',
                                      borderWidth: 2,
                                      borderRadius: 4,
                                      color: function(ctx) {
                                        var value = ctx.dataset.data[ctx.dataIndex];
                                        return value > 50
                                          ? ctx.dataset.backgroundColor
                                          : 'white';
                                      },
                                      formatter: function(value, ctx) {
                                        return ctx.active
                                          ? 'value'
                                          : Math.round(value * 1000) / 1000;
                                      },
                                      padding: 4
                                    }
                                  }
                                }
                              }]
                            },
                            options: {
                              plugins: {
                                datalabels: {
                                  color: 'white',
                                  display: function(ctx) {
                                    return ctx.dataset.data[ctx.dataIndex] > 10;
                                  },
                                  formatter: function(value, context) {
                                    return context.chart.data.labels[context.dataIndex];
                                  },
                                  font: {
                                    weight: 'bold',
                                  },
                                  offset: 0,
                                  padding: 0
                                }
                              },
                          
                              // Core options
                              cutout:'30%',
                              aspectRatio: 3 / 2,
                              cutoutPercentage: 8,
                              layout: {
                                padding: 16
                              },
                              elements: {
                                line: {
                                  fill: false,
                                  tension: 0.4
                                },
                                point: {
                                  hoverRadius: 7,
                                  radius: 5
                                }
                              },
                            }
                          });
             }
        });

    }

     
     //Last 12 Loan Applications
     this.initTableLoanApps = (rows)=>{
        let tbody = mThis.tblLoanApps.find('tbody');
        tbody.empty();
       
        rows = StringSanitizer.sanitizeObject(rows);  
        if(rows){
            let i=0;
            let c = null;
            do{
               c = rows[i];
               if(!c) break; 
                let rev_style = 'style="color:orange;"';
                if(c.status_id =2)  rev_style = 'style="color:#1DB1CB;"';
                let cur = c.cur?c.cur:'$';
              
                let html = `<tr>
                <td>${c.create_date}</td>
                <td><a data-id="${c.id}" data-personid="${c.person_id}" href="javascript:void(0);" class="dbc-link_loan_app">${c.name}</a></td>
                <td>${cur}${c.principal}</td>
                <td>${c.monthly_interest_rate}%</td>
                <td ${rev_style}>${c.status}</td>
              </tr>`;
               // <td ${rev_style}>${cur}${Number(c.penalty_fee).toFixed(2)}</td>
               tbody.append(html);
              
               i++;
            }while(c);
        }
    }


    //Monthly payments
    this.initTable_monthly = (rows)=>{
        let tbody = mThis.tblMonthlyPmts.find('tbody');
        tbody.empty();
       
        rows = StringSanitizer.sanitizeObject(rows);  
        if(rows){
            let i=0;
            let c = null;
            do{
               c = rows[i];
               if(!c) break; 
                let rev_style = 'style="color:orange;font-weight:bold;"';
                let cur = c.cur?c.cur:'$';
                if (c.increase_percent > 0) rev_style = 'style="color:green;font-weight:bold;"';

                let html = `<tr>
                <td>${c.month_name}</td>
                <td>${cur}${c.amount}</td>
                <td ${rev_style}>${c.increase_percent}%</td>
                <td>${cur}${c.principal_amount}</td>
                <td ${rev_style}>${cur}${Number(c.interest_amount).toFixed(2)}</td>
               
                <td>${Number(c.pmt_count)} pmts</td>
              </tr>`;
               // <td ${rev_style}>${cur}${Number(c.penalty_fee).toFixed(2)}</td>
                tbody.append(html);
              
               i++;
            }while(c);
        }
    }



    this.createBarChart = (element_id,d) => {
        d =d?d:{};
        let densityCanvas = document.getElementById(element_id);
        // Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;
     
        let cur = d.currency;
        if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
        if(cur=='$') cur ='USD';
        else if((cur+'').toLowerCase() =='riel') cur ='KHR';
        cur =`<span class="dbc-currency">${cur}</span>`;

        document.getElementById('dbc_barchart_summary_value').innerHTML = [d.first_collected_amount,' <i class="fas fa-arrow-right" style="font-size:0.8em"></i>',d.last_collected_amount,cur].join('');
        //document.getElementById('dbc_barchart_summary_value').innerHTML = [d.last_earnings,cur].join('');
        document.getElementById('dbc_barchart_summary_title').innerText = 'Latest Collected Amount';

        let tt = $('#barchart_change_info');
        let change_arrow = 'fa-arrow-up';
        let change_color ='text-success';

        if(d.change_in_collection <0){
            change_arrow ='fa-arrow-down';
            change_color ='text-danger';
        }
        let span = tt.find('.barchart-change-percent');
        span.empty();
        span.append(`<span class="${change_color}">
            <i class="fas ${change_arrow}"></i>${d.change_in_collection}%
            </span>`);

        if (d.change_info_text) tt.find('.barchart-period-text').text(d.change_info_text); 
        
        if(d){
            let payer_counts = {
                label: 'Payer count',
                data: d.payer_counts, //[5427, 5243, 5514, 3933, 1326, 687, 1271, 1638],
                backgroundColor: 'rgba(0,123,255,255)',
                borderWidth: 0,
                yAxisID: "y-axis-density"
                };
        
                let principal_totals = {
                    label: 'Principal',
                    data: d.principal_totals, //[3.7, 8.9, 9.8, 3.7, 23.1, 9.0, 8.7, 11.0],
                    backgroundColor: 'rgb(0, 204, 255)',
                    borderWidth: 0,
                    yAxisID: "y-axis-gravity"
                };

                let earnings_totals = {
                label: 'Earnings',
                data: d.earnings_totals, //[3.7, 8.9, 9.8, 3.7, 23.1, 9.0, 8.7, 11.0],
                backgroundColor: 'rgb(204, 255, 255)',
                borderWidth: 0,
                yAxisID: "y-axis-gravity"
                };
        
                let data_periods = {
                    labels: d.months, //["Jan", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep"],
                    datasets: [payer_counts,principal_totals, earnings_totals]
                };
        
               let chartOptions = {
                responsive: true,
                legend:{
                    display:true
                },
                title:{
                     display:true
                },
                scales: {
                    xAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero:true
                                },
                                barPercentage: 1,
                                categoryPercentage: 0.6
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero:true
                                },
                                id: "y-axis-density"
                                }, {
                                id: "y-axis-gravity"
                            }]
                        }
                };
        
                 let barChart = new Chart(densityCanvas, {
                    type: 'line',
                    data: data_periods,
                    options: chartOptions
                    });
        }

    }
 
    // this.createSnakedBar = (element_id) => {
    //     const ctx = document.getElementById(element_id).getContext('2d');
    //     const mySnakedBar = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
    //             datasets: [{
    //                 label: 'Dataset 1',
    //                 data: [400, 200, 300, 100, 400, 340, 500],
    //                 borderColor: '#FF0000',
    //                 backgroundColor: '#007bff',
    //                 stack: 'combined',
    //                 fill: false,
    //                 type: 'bar'
    //                 },
    //                 {
    //                     label: 'Dataset 2',
    //                     data: [300, 600,200, 400, 100, 450, 50],
    //                     borderColor: '#FF0000',
    //                     backgroundColor: '#007bff',
    //                     stack: 'combined',
    //                     fill: false
    //                   }
    //             ]
                
    //         },
    //         options: {
    //           plugins: {
    //             title: {
    //               display: true,
    //               text: 'Chart.js Stacked Line/Bar Chart'
    //             }
    //           },
    //           scales: {
    //             y: {
    //               stacked: true
    //             }
    //           }
    //         },
    //     });
    // }
 

}

$(document).ready(function(){
    DashboardComponent.init();
});

'use strict'
var DashboardComponent = new function(){
    let mThis = this;
    this.self = $('#_main_dashboardComponent');
    this.elScreenTitle = $('#screen_title');
    this.init = ()=>{
       mThis.initCards(); 
     //mThis.spaTotalFees('spaTotalMarchant');
    //    mThis.spaTotalDoneDeliveries('spaTotalDoneDeliveries');
    //    mThis.spaTotalReturnToMerchants('spaTotalReturnToMerchants');
    //    mThis.spaTotalContinueToDeliver('spaTotalContinueToDeliver');
       mThis.createLineChart('myNewChart');
       mThis.createPieChart('myPieChart');
       mThis.createBarChart('myBarChart');
       mThis.createSnakedBar('myStackedBar');
    }

    this.show = (option)=>{
       mThis.elScreenTitle.html(option.title); 
       mThis.self.show().siblings().hide();
    }

    this.spaTotalFees = (element_id,d) => {
        const ctx = document.getElementById(element_id).getContext('2d');
        const h_light = document.getElementById([element_id,'_highlight'].join(''));
        //d.total_fees = parseFloat(d.total_fees);
        if(!$.isNumeric(d.total_fees)) d.total_fees =0;
        h_light.innerText = ['$',d.total_fees?d.total_fees:'0'].join('');
        const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'a', 'b', 'c', 'd', 'e'],
            datasets: [
            {
                data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397,236,67,676,978,232,235,676,787,789,236,345,459,278],
                backgroundColor: '#007bff',
            }
            ]
        },
        options: {
            responsive: false,
            legend: {
            display: false
            },
            elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
            },
            tooltips: {
            enabled: false
            },
            scales: {
            yAxes: [
                {
                display: false
                }
            ],
            xAxes: [
                {
                display: false
                }
            ]
            }
        }
        });
    }

    this.spaTotalReturnToMerchants = (element_id,d) => {
        const ctx = document.getElementById(element_id).getContext('2d');
        const h_light = document.getElementById([element_id,'_highlight'].join(''));
        h_light.innerText = d.total;
        
        const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
            {
                data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
                backgroundColor: '#88FFA9',
            }
            ]
        },
        options: {
            responsive: false,
            legend: {
            display: false
            },
            elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
            },
            tooltips: {
            enabled: false
            },
            scales: {
            yAxes: [
                {
                display: false
                }
            ],
            xAxes: [
                {
                display: false
                }
            ]
            }
        }
        });
    }

    this.initCards = ()=>{
      let p = {'x_days-ago':30};
      post_ajax([mThis.base_url,'/api/dbs_getData_card1'].join(''),p,function(result){
        if (result) {
           mThis.spaTotalFees('spaTotalFee',result);
        }
     });
     
      p = {'status_id':8,'x_days-ago':30};
      post_ajax([mThis.base_url,'/api/dbs_getPackageCounts'].join(''),p,function(result){
         if (result) {
            mThis.spaTotalDoneDeliveries('spaTotalDoneDeliveries',result);
         }
      });

      p = {'status_id':11,'x_days-ago':30};
      post_ajax([mThis.base_url,'/api/dbs_getPackageCounts'].join(''),p,function(result){
         if (result) {
            mThis.spaTotalReturnToMerchants('spaTotalReturnToMerchants',result);
         }
      });

      p = {'status_id':10,'x_days-ago':30};
      post_ajax([mThis.base_url,'/api/dbs_getPackageCounts'].join(''),p,function(result){
         if (result) {
            mThis.spaTotalContinueToDeliver('spaTotalContinueToDeliver',result); 
         }
      });
    } 

    this.spaTotalContinueToDeliver = (element_id,d) => {
        const ctx = document.getElementById(element_id).getContext('2d');
        const h_light = document.getElementById([element_id,'_highlight'].join(''));
        h_light.innerText = d.total;
        const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels:d.labels,
            datasets: [
                {
                    data: d.data, //[435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
                    backgroundColor: '#FFF482'
                }
            ]
        },
        options: {
            responsive: false,
            legend: {
            display: false
            },
            elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
            },
            tooltips: {
            enabled: false
            },
            scales: {
            yAxes: [
                {
                display: false
                }
            ],
            xAxes: [
                {
                display: false
                }
            ]
            }
        }
        });
    }

    this.spaTotalDoneDeliveries = (element_id,d) => {
        const ctx = document.getElementById(element_id).getContext('2d');
        const h_light = document.getElementById([element_id,'_highlight'].join(''));
        h_light.innerText = d.total;
        const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
            {
                data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
                backgroundColor: '#FF8889',
            }
            ]
        },
        options: {
            responsive: false,
            legend: {
            display: false
            },
            elements: {
            line: {
                borderColor: '#000000',
                borderWidth: 1
            },
            point: {
                radius: 0
            }
            },
            tooltips: {
            enabled: false
            },
            scales: {
            yAxes: [
                {
                display: false
                }
            ],
            xAxes: [
                {
                display: false
                }
            ]
            }
        }
        });
    }

    this.createLineChart = (element_id)=>{

        const ctx = document.getElementById(element_id).getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                    label: "Revenues",
                    borderColor: "#007bff",
                    pointBorderColor: "#007bff",
                    // pointBackgroundColor: "#80b6f4",
                    pointHoverBackgroundColor: "#007bff",
                    pointHoverBorderColor: "#007bff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 10,
                    pointHoverBorderWidth: 1,
                    pointRadius: 3,
                    fill: false,
                    borderWidth: 3,
                    data: [100, 120, 150, 170, 180, 170, 160,150,190,180,201,220,260]
                },
                {
                    label: "Deliveries",
                    borderColor: "#ced4da",
                    pointBorderColor: "#ced4da",
                    // pointBackgroundColor: "#D3D3D3",
                    pointHoverBackgroundColor: "#ced4da",
                    pointHoverBorderColor: "#ced4da",
                    pointBorderWidth: 10,
                    pointHoverRadius: 10,
                    pointHoverBorderWidth: 1,
                    pointRadius: 3,
                    fill: false,
                    borderWidth: 3,
                    data: [200, 120, 300, 170, 180, 190, 160,200,125,105,100,109,180]
                }
                
            ]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                         }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                         }
                    }],
                    
                }
            }
        });
    }

    this.createPieChart = (element_id) => {


        const ctx = document.getElementById(element_id).getContext('2d');
        const myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Merchant A', 'Merchant B', 'Merchant C'],
                datasets: [{
                    
                    data: [100, 120, 150],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                      ],
                },  
            ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

      
    }


    this.createBarChart = (element_id) => {

        var densityCanvas = document.getElementById(element_id);

        // Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;

        var densityData = {
        label: 'សេវាកម្មរហ័ស',
        data: [5427, 5243, 5514, 3933, 1326, 687, 1271, 1638],
        backgroundColor: 'rgba(0,123,255,255)',
        borderWidth: 0,
        yAxisID: "y-axis-density"
        };

        var gravityData = {
        label: 'សេវាកម្មធម្មតា',
        data: [3.7, 8.9, 9.8, 3.7, 23.1, 9.0, 8.7, 11.0],
        backgroundColor: 'rgba(206,212,218,255)',
        borderWidth: 0,
        yAxisID: "y-axis-gravity"
        };

        var planetData = {
            labels: ["Jan", "Mar", "Apr", "May", "June",, "Jul", "Aug", "Sep", "Oct", "Nov","Dec"],
            datasets: [densityData, gravityData]
        };

        var chartOptions = {
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                 },
                barPercentage: 1,
                categoryPercentage: 0.6
            }],
            yAxes: [{
                gridLines: {
                    display: false
                 },
                id: "y-axis-density"
                }, {
                id: "y-axis-gravity"
            }]
        }
        };

        var barChart = new Chart(densityCanvas, {
        type: 'bar',
        data: planetData,
        options: chartOptions
        });

    }


    this.createSnakedBar = (element_id) => {
        const ctx = document.getElementById(element_id).getContext('2d');
        const mySnakedBar = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Dataset 1',
                    data: [400, 200, 300, 100, 400, 340, 500],
                    borderColor: '#FF0000',
                    backgroundColor: '#007bff',
                    stack: 'combined',
                    fill: false,
                    type: 'bar'
                    },
                    {
                        label: 'Dataset 2',
                        data: [300, 600,200, 400, 100, 450, 50],
                        borderColor: '#FF0000',
                        backgroundColor: '#007bff',
                        stack: 'combined',
                        fill: false
                      }
                ]
                
            },
            options: {
              plugins: {
                title: {
                  display: true,
                  text: 'Chart.js Stacked Line/Bar Chart'
                }
              },
              scales: {
                y: {
                  stacked: true
                }
              }
            },
        });
    }


    


}

$(document).ready(function(){
    DashboardComponent.init();
});

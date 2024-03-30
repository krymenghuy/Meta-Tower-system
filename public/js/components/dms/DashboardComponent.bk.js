'use strict';
var DashboardComponent = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.title_prop = "Dashboard";
    this.module_id = 200;
    this.self = main_view.appContent.children('#_main_dashboardComponent');
    this.tblDailyIncomes = this.self.find('#dbc_tblDailyIncomes');
    this.tblDailyCollections= this.self.find('#dbc_tblDailyCollections');
    this.tblDailyPayables = this.self.find('#dbc_tblPayables');
    this.tblPayables = this.self.find('#dbc_tblPayables');
    this.tblDailyCollections = this.self.find('#dbc_tblDailyCollections');
    this.btnExport_payables = this.self.find('#dbc_btn_export_payables');
    this.btnExport_driver_pmts = this.self.find('#dbc_btn_export_driver_pmts');

    this.init = ()=>{
     this.btnExport_payables.on('click',(e)=>{
       e.preventDefault();
       mThis.exportToExcel_payables();
     });

     this.btnExport_driver_pmts.on('click',(e)=>{
        e.preventDefault();
        mThis.exportToExcel_driver_collection();
      });

     //mThis.module_id = AuthManager.getModuleId('Dashboard');   
       mThis.initCards(); 
     //mThis.spaTotalFees('spaTotalMarchant');
    // mThis.spaTotalDoneDeliveries('spaTotalDoneDeliveries');
    // mThis.spaTotalReturnToMerchants('spaTotalReturnToMerchants');
    // mThis.spaTotalContinueToDeliver('spaTotalContinueToDeliver');
       //mThis.createLineChart('myNewChart');
       setTimeout(()=>{
        mThis.createPieChart('myPieChart');
       },250);
       setTimeout(()=>{
         mThis.createBarChart('myBarChart');
       },250);
       setTimeout(()=>{
            //mThis.initTable_one();
            mThis.initTable_daily_collections();
            mThis.initTable_two();
       });
       //mThis.createSnakedBar('myStackedBar');
    }

    this.show = (option)=>{
       if(!option) option ={};
       if(!AuthManager.access_mod(mThis.module_id,true)) return;
            
       mThis.self.siblings().hide(0, function() {
        main_view.setTitle(mThis.title_prop);
		mThis.self.hide().fadeIn(300);
	  });
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
      //let p = {'x_days-ago':30};
      vsapi.call(`${mThis.base_url}/api/dashboard/summarized-values`,null).then(res=>{
           
         if(res.status_code===200){
                    let d = StringSanitizer.sanitizeObject(res.data,null,['currency']);
                           //begin:: set dashboard card's currency
                           let cur = d.currency;
                           if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
                           if(cur=='$') cur ='USD';
                           else if((cur+'').toLowerCase() =='riel') cur ='KHR';
                           cur =`<span class="dbc-currency">${cur}</span>`;
                       //end:: set dashboard card's currency
          
                       let dd = d.package_count;
                       if(d.package_count ==0) dd = 1;
       
                       let delivered_percent = (d.delivered_count *100/dd).toFixed(2);
                       let returned_percent = (d.returned_count *100/dd).toFixed(2);
       
                       mThis.self.find('.dbc-card-value').each(function(){
                           let el = $(this);
                           let f = el.data('field');
                           let val = d[f];
       
                           if(el.data('item') =='count'){
                               cur ='';
                           }else val =Number(d[f]).toFixed(2);
                               
                           if(f =='delivered_count') val = `${val} <span class="dbc-card-percent-delivered">(${delivered_percent}%)</span>`;
                           else if(f=='returned_count') val = `${val} <span class="dbc-card-percent-returned">(${returned_percent}%)</span>`;
                           el.html(`${val}${cur}`);
                           
                           });
                            mThis.self.find('.dbc-card-period').text(d.card_period);
                    
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
        const ctx = mThis.self.find(`#${element_id}`)[0].getContext('2d');
        vsapi.call(`${mThis.base_url}/api/dashboard/barchart-one`,null).then(res=>{
            if(res.status_code === 200){
                let d = StringSanitizer.sanitizeObject(res.data);

                let cur = d.currency;
                if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
                if(cur=='$') cur ='USD';
                else if((cur+'').toLowerCase() =='riel') cur ='KHR';
                cur =`<span class="dbc-currency">${cur}</span>`;
    
                    d.change_in_earnings = StringSanitizer.sanitizeOut(d.change_in_earnings);
                    d.last_earnings = StringSanitizer.sanitizeOut(d.last_earnings);
                    const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: d.months,  //['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'],
                            datasets: [{
                                label: "Merchants",
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
                                data: d.merchant_counts //[100, 120, 150, 170, 180, 170, 160,150,190,180,201,220,260]
                            },
                            {
                                label: "earnings",
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
                                data: d.earnings //[200, 120, 300, 170, 180, 190, 160,200,125,105,100,109,180]
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

            //if there is res.error_message
            else{
                return;
            }
        });
    }

    this.createPieChart1 = (element_id)=>{
       const ctx = mThis.self.find(`#${element_id}`)[0].getContext('2d');
       vsapi.call(`${mThis.base_url}/api/dashboard/piechart-one`,null).then(res=>{
        let d = {};      
        if(res.status_code ===200) d = StringSanitizer.sanitizeObject(res.data);

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
             
        });

    }

    this.createPieChart = (element_id) => {
        const ctx = mThis.self.find(`#${element_id}`)[0].getContext('2d');
        vsapi.call(`${mThis.base_url}/api/dashboard/piechart-one`,null).then(res=>{
             if(res.status_code===200){
                        let d = res.data;  
                        const myPieChart = new Chart(ctx, {
                            type:'pie', //'doughnut', // 'polarArea'
                            data: {
                                labels:d.labels, //['Merchant A', 'Merchant B', 'Merchant C'],
                                datasets: [{ 
                                      data: d.values, //[100, 120, 150],
                                      backgroundColor: d.colors,
                                      borderColor:'#fff',
                                      dataLabels:true
                                   },
                                   { 
                                    data: [100, 120, 150],
                                    backgroundColor: d.colors,
                                    borderColor:'#fff',
                                    dataLabels:{
                                        display:true
                                    }
                                 }
                                
                                 ]

                            },
                            //plugins:[ChartDataLabels],
                            options: {
                                tooltip:{
                                    enabled:false
                                  },
                                responsive:true,
                                cutout:'15',
                               
                                // scales: {
                                //     y: {
                                //         beginAtZero: true
                                //     }
                                //  },
                                 legend:{
                                    display:true,
                                    position:'right',
                                    align:'start',
                                    labels:{
                                      boxWidth:70
                                    }
                                },
                                plugins:{ 
                                    tooltip:{
                                      enabled:false
                                    },
                                     dataLabels:{
                                        color:'#fff',
                                        align:'start',
                                        backgroundColor:'#fff',
                                        borderWidth:2,
                                        offset:-10,
                                        anchor:'end',
                                        backgroundColor:function(context){
                                            return context.dataset.backgroundColor;
                                        },
                                        formatter:function(value){
                                            return [value,'%'].join('');
                                        }
                                     }
                                  }
                                  
                             }//close option
                        });
             }
        });



      
    }

    //Daily Collection table=> columns: "Cash, Bank, Total, Driver_count, sender_count" 
    this.initTable_daily_collections = ()=>{
        let tbody = mThis.tblDailyCollections.find('tbody');
        tbody.empty();
        vsapi.call(`${mThis.base_url}/api/dashboard/daily-collections`,null).then( res=>{
              if(res.status_code===200){
                let rows = StringSanitizer.sanitizeObject(res.data);  
                    let i=0;
                    let c = null;
                    do{
                       c = rows[i];
                       if(!c) break; 
                        let cur = c.cur?c.cur:'$';
                        let html = `<tr>
                        <td>${c.payment_date}</td>
                        <td>${c.package_count} pcs</td>
                        <td>${cur}${c.cash>0?c.cash:['(',Math.abs(c.cash),')'].join('')}</td>
                        <td>${cur}${c.bank}</td>
                        <td ${c.total<0?'style="color:red;font-weight:bold"':null}>${cur}${c.total>0?c.total:['(',Math.abs(c.total),')'].join('')}</td>
                        <td>${c.driver_count}</td>
                      </tr>`;
                        tbody.append(html);
                      
                       i++;
                    }while(c);
      
                     if(i===0)  tbody.append(['<tr><td colspan="6"><div class="dbc-no-rows-found">No Collections</div></tr>'].join(''));
      
                
              }
              else{
                //in case of res.error_message
                return;
              }
        }); 
    }

    //Daily Incomes
    this.initTable_one = ()=>{
        let tbody = mThis.tblDailyIncomes.find('tbody');
        tbody.empty();
        vsapi.call(`${mThis.base_url}/api/dashboard/table-one`,null).then(rows=>{
           if(res.status_code===200){

              rows = StringSanitizer.sanitizeObject(res.data);  
                let i=0;
                let c = null;
                do{
                   c = rows[i];
                   if(!c) break; 
                    let rev_style = 'style="color:red"';
                    let cur = c.cur?c.cur:'$';
                    //c.total_cod_amount is SUM of all cod_amount. where cod_amount = price - cod_fee
                    //c.total_fees includes cod_fee
                    let total_fees = parseFloat(c.total_base_fee)+ parseFloat(c.total_delivery_fee);
                    //IMPORTANT NOTE: in this Revenues caluation, we substract "c.total_fee_paid_by_sender" because "all fees to be paid by senders" are not collected by driver and the Compeny does not receive that fees as actual revenues
                    
                    let revenues = parseFloat(c.total_cod_amount) + total_fees + parseFloat(c.total_cod_fee) - parseFloat(c.total_fee_paid_by_sender);
                    //let revenues = parseFloat(c.total_cod_amount) + parseFloat(c.total_base_fee) + parseFloat(c.total_delivery_fee) + parseFloat(c.total_cod_fee);
                    
                    total_fees = Number(total_fees).toFixed(2);
                    //NOTE that @c.total_cod_amount is ( = Price - cod_fee) and c.total_fees includes @cod_fee, => so we must add @cod_fee back
                    // c.total_fee_paid_by_sender = total_fees except cod_fee that are to be paid by sender when df_payer ='sender' 
                    let amount_to_sender = parseFloat(c.total_cod_amount) - parseFloat(c.total_fee_paid_by_sender);  
                    if(amount_to_sender <=0) rev_style = 'style="color:green;font-weight:bold"';
                    let html = `<tr>
                    <td>${c.arrival_date}</td>
                    <td>${c.package_count} pcs</td>
                    <td style="color:green">${cur}${c.total_cod_fee}</td>
                    <td style="color:green">${cur}${total_fees}</td>
                    <td ${rev_style}>${cur}${Number(amount_to_sender).toFixed(2)}</td>
                    <td ${rev_style}>${cur}${Number(c.total_taxi).toFixed(2)}</td>
                    <td>${cur}${Number(revenues).toFixed(2)}</td>
                  </tr>`;
                   
                    tbody.append(html);
                  
                   i++;
                }while(c);
                
                mThis.driver_pmt_data = rows;

                 if(i===0)  tbody.append(['<tr><td colspan="8"><div class="dbc-no-rows-found">No daily incomes</div></tr>'].join(''));
            
           }
        }); 
    }

    this.getTableData = (table)=>{
        const titles =[];
        table.find('thead th').each(function(){
            titles.push($(this).text());
        });
        let rows = [];
        table.find('tbody>tr').each(function(){
             const tr = $(this);
             let col_index =0;
             let item = {};
             tr.find('td').each(function(){
                const col_name = titles[col_index];
                item[col_name] = $(this).text();
                col_index++;
             });
             rows.push(item);
        });
       return rows;  
    }

    this.exportToExcel_driver_collection = ()=>{
        let file_name ='driver-payments';
        let data = mThis.getTableData(mThis.tblDailyCollections);
        JsonToExcel.exportToExcel(data,file_name,null);
    }
    
    this.processMerchantPaybales = (data)=>{
        let titles = ['date','sender_name','package_count','cod_amount','total_fees','forwarding_cost','amount','account_number','account_name','bank_name'];
        let i=0, c = null;
        let rows = [];
        do{
            c = data[i];
            if(!c) break;
             let item = {};
             titles.map(col=>{
                if(col==='forwarding_cost'){
                    item['taxi'] = c[col];
                }else if (col==='sender_name'){
                    item['merchant'] = c[col];
                }
                else{
                    const f_col = col.replace(/_/g,' ',col);
                    item[f_col] =c[col];
                }
             });
             rows.push(item);
            rows.push();
            i++;
        }while(c); 
        return rows;
    }

    this.exportToExcel_payables = ()=>{
        vsapi.call(`${mThis.base_url}/api/dashboard/table-two`,null,null).then(res => {
            if(res.status_code===200){
                let items = res.data.items;
                let file_name ='merchant-payables';
                const data = mThis.processMerchantPaybales(items);
                JsonToExcel.exportToExcel(data,file_name,null);
            }
        });   
    }

    this.initTable_two = (onFinish = null) => {
        vsapi.call(`${mThis.base_url}/api/dashboard/table-two`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data.items;
            }
 
            let cnt = 1;
            let cols = [{
                title: "Date",
                data: (data, a, b) => {
                    return [`<span>`,data.date,`<span>`].join('');
                }
            },
            {
                title: "Merchant",
                data: (data, a, b) => {
                    let url = data.image_url ? data.image_url : '';
                    return [`<div class="d-flex flex-row">`,
                    //`<img class="img-thumbnail img-tbl-show" src="${url}" alt=""/>`,
                    ` <div class="p-1">`,data.sender_name,`</div></div>`].join('');
                }
            },
            {
                title: "PCS",
                data: (data,a,b)=>{
                    return [data.package_count,` pcs`].join('');
                }
            },
            {
                title: "COD",
                data: (data,a,b)=>{
                    return ['$',data.cod_amount].join('');
                }
            },
            {
                title: "Fees",
                data: (data,a,b)=>{
                    return ['$',data.total_fees].join('');
                }
            },
            {
                title: "Taxi",
                data: (data,a,b)=>{
                    return ['$',data.forwarding_cost].join('');
                }
            },
            {
                title: "Amount",
                data: (data,a,b)=>{
                    return ['<span class="fw-semibold">','$',data.amount,'</span>'].join('');
                }
            },
            {
                title: "Account Info",
                data:(data,a,b)=>{
                  return [`<div class="d-flex flex-column">`,
                    `<div class="d-flex flex-row"><span class="p-1 text-success">`,data.account_number,`</span><span class="p-1"> (`,data.bank_name,`)</span></div>`,
                    `<div class="p-1">`,data.account_name,`</div>`
                  , `</div>`].join('');
                }
            }
            // ,{
            //     title: "Action",
            //     data: (data, a, b) => {
            //         return [`<div class="d-flex gap-2">
            //             <a href="javascript:void(0)" class="btn-ppt-modify" data-id="${data.id}">
            //                 <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
            //             </a>
            //             <a href="javascript:void(0)" class="btn-ppt-delete" data-id="${data.id}">
            //                 <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
            //             </a>
            //         </div>`].join('');
            //     }
            // }
        ];

            if(mThis.table){
                mThis.tblPayables.DataTable().clear().destroy();
                mThis.tblPayables.empty();
                mThis.table = null;
            }
            //if(!mThis.table){
                mThis.table = mThis.tblPayables.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 5,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function(row, data, dataIndex){
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
                 mThis.tblPayables_data = data;
            //}
            
        });
    }

    // //Table two -Merchant payables
    // this.initTable_two = ()=>{
    //     let tbody = mThis.tblDailyPayables.find('tbody');
    //     tbody.empty();
    //     vsapi.call(`${mThis.base_url}/api/dashboard/table-two`,null).then(res=>{
    //          if(res.status_code===200){
    //                     //let period_name = d.period_name;
    //                     let d = res.data?res.data:{};
    //                     let rows = StringSanitizer.sanitizeObject(d.items,null,['account_info']);  
    //                     let i=0;
    //                     let c = null;
    //                     do{
    //                         c = rows[i];
    //                         if(!c) break; 
    //                         //let rev_style = 'style="color:red"';
    //                         if (c.currency=='USD') c.currency ='$';
    //                         let cur = c.currency?c.currency:'$';
    //                         let cod_amount = parseFloat(c.price) - parseFloat(c.cod_fee);

    //                         let amount = cod_amount - parseFloat(c.fees,0) - parseFloat(c.forwarding_cost,0);
    //                         let fees = parseFloat(c.fees) + parseFloat(c.cod_fee);

    //                         let acs = (c.account_info +'').split('|');
    //                         let account_number = [StringSanitizer.sanitizeOut(acs[0]),' (',StringSanitizer.sanitizeOut(acs[2]),')'].join('');
    //                         if (!acs[0] || acs[0]=='null') account_number ='(No Bank Account)';  
    //                         let account_name = StringSanitizer.sanitizeOut(acs[1]);
    //                         let account_info = ['<span style="display:block;font-size:0.9em;color:green">',account_number,'</span><span class="display:block;font-size:1em">',account_name,'</span>'].join('');

    //                         let html = `<tr>
    //                         <td>${c.date}</td>
    //                         <td>${c.sender_name}</td>
    //                         <td>${c.package_count} pcs</td>
    //                         <td >${cur}${Number(cod_amount).toFixed(2)}</td>
    //                         <td>${cur}${Number(fees).toFixed(2)}</td>
    //                         <td>${cur}${Number(c.forwarding_cost).toFixed(2)}</td>
    //                         <td>${cur}${Number(amount).toFixed(2)}</td>
    //                         <td>${account_info}</td>
    //                         </tr>`;
                            
    //                         tbody.append(html);
                            
    //                         i++;
    //                     }while(c);
    //                     if(i==0)  tbody.append(['<tr><td colspan="8"><div class="dbc-no-rows-found">No payables to merchants</div></tr>'].join('')); 
                    
    //          }
    //     }); 
    // }

    this.createBarChart = (element_id) => {
        let densityCanvas = mThis.self.find(`#${element_id}`)[0];
         
        // Chart.defaults.global.defaultFontFamily = "Lato";
        Chart.defaults.global.defaultFontSize = 12;
        vsapi.call(`${mThis.base_url}/api/dashboard/barchart-one`,null).then(res=>{
            if(res.status_code === 200){
                let d = res.data; //StringSanitizer.sanitizeObject(res.data,'',['currency']);
                let cur = d.currency;
                if(cur != '$' && cur != 'USD' && cur !='KHR' && cur != 'Riel') cur ='$';
                if(cur=='$') cur ='USD';
                else if((cur+'').toLowerCase() ==='riel') cur ='KHR';
                cur =`<span class="dbc-currency">${cur}</span>`;
    
                document.getElementById('dbc_barchart_summary_value').innerHTML = [d.first_earnings,' <i class="fas fa-arrow-right" style="font-size:0.8em"></i>',d.last_earnings,cur].join('');
                //document.getElementById('dbc_barchart_summary_value').innerHTML = [d.last_earnings,cur].join('');
                document.getElementById('dbc_barchart_summary_title').innerText = 'Lastest Earnings';
    
                let tt = $('#barchart_change_info');
                let change_arrow = 'fa-arrow-up';
                let change_color ='text-success';
    
                if(d.change_in_earnings <0){
                    change_arrow ='fa-arrow-down';
                    change_color ='text-danger';
                }
                let span = tt.find('.barchart-change-percent');
                span.empty();
                span.append(`<span class="${change_color}">
                    <i class="fas ${change_arrow}"></i>${d.change_in_earnings}%
                    </span>`);
    
                if (d.change_info_text) tt.find('.barchart-period-text').text(d.change_info_text); 
                
                if(d){
                    let merchant_counts = {
                        label: 'Merchants',
                        data: d.merchant_counts, //[5427, 5243, 5514, 3933, 1326, 687, 1271, 1638],
                        backgroundColor: 'rgb(235, 195, 52)',
                        borderColor:'rgb(235, 195, 52)',
                        borderWidth: 3,
                        yAxisID: "y-axis-density",
                        pointStyle: 'circle',
                        pointRadius: 3,
                        pointHoverRadius:5,
                        fill: false,
                    };
                
                        let package_counts = {
                            label: 'Packages',
                            data: d.package_counts, //[3.7, 8.9, 9.8, 3.7, 23.1, 9.0, 8.7, 11.0],
                            backgroundColor: 'rgb(235, 86, 52)',
                            borderColor:'rgb(52, 55, 235)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            yAxisID: "y-axis-gravity",
                            fill: false,
                        };
    
                        let earnings_totals = {
                            label: 'Earnings',
                            data: d.earnings_totals, //[3.7, 8.9, 9.8, 3.7, 23.1, 9.0, 8.7, 11.0],
                            backgroundColor: 'rgb(52,235,201)',
                            borderWidth: 3,
                            borderColor:'rgb(9, 143, 58)',
                            pointStyle: 'circle',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            yAxisID: "y-axis-gravity",
                            fill: true,
                        };
                
                        let data_periods = {
                            labels: d.months, //["Jan", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep"],
                            datasets: [merchant_counts,package_counts, earnings_totals]
                        };
                
                       let chartOptions = {
                        responsive: true,
                        legend:{
                            display:true
                        },
                        title:{
                             display:true
                        },
                        interaction: {
                            mode: 'index',
                            intersect: false
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
                                        categoryPercentage: 0.4
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
            //in case of res.error_message
            else{
                return {}; 
            }   
        });
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

window.addEventListener('DOMContentLoaded',()=>{
    DashboardComponent.init();
});
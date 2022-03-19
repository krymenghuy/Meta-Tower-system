'use strict'
//## begin::DriverPaymentComponent
var DriverPaymentComponent = new function() {
    let xThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_driverPmtComponent');
    this.base_url = $('#__base_url').val();
       
    this.init = function() {
        // window.onresize = function(event) {
        //     let div = mThis.tblItems.parent();
        //     let h = window.screen.height;
        //     if (h>160) h = h-150;
        //     div.css('height',h+'px');
        // }; 
         return; 
    }

    this.show = (option)=>{
        xThis.elScreenTitle.html(option.title);
        xThis.self.show().siblings().hide();
        DriverTabView.show('dpmt_deliveries',false); 
    }
   
    // //create dropdown menus for Driver's transaction list table
    // this.createDropdownMenuHtml_dpmt = function(delivery_id,tknumber,driver_id,status_id) {
    //     //cla = 'class_list_action' = > cla_delete, cla_modify,...
    //     let html = ['<div class="dropdown-menu" data-tripid="',delivery_id,'" data-did="',delivery_id,'" data-tknum="',tknumber,'" data-driverid="',driver_id,'" data-statusid="',status_id,'">',
    //     '<a class="dropdown-item _dpmt_start_trip tog-visible" href="#"><i class="fas fa-calendar-check" style="color:green"></i> Receive Paymnent</a>',
    //     '<a class="dropdown-item _dpmt_stop_trip tog-visible" href="#"><i class="fas fa-times" style="color:red"></i> Delete</a>',
    //     '<a class="dropdown-item _dpmt_change_driver" href="#"><i class="fas fa-edit" style="color:green"></i> Edit Package</a>',
    //     '<div class="dropdown-divider"></div>',
    //       '</div>'].join('');
    //       return html;
    // };
   
}
//## end::DriverPaymentComponent
 
//begin::DriverTabView DriverPaymentTabView
var DriverTabView = new function(){
    let mThis = this;
    this.self = $('#_dpmt_driverTabView');
    //this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.cur_view = 'prices';
    
    this.self.on('click','div.tab-header>a.tab-button',function(e){
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(view_name,true);
    });

     //Show active tab on DriverTabView
     this.show = function(view_name,tab_button_clicked = false){
         if (!view_name) view_name = mThis.cur_view;
         view_name = (view_name+'').toLowerCase(); 

         mThis.self.find('div.tab-body>div.tab-panel').each(function(){
             let this_view_name =($(this).data('viewname')+'').toLowerCase();
            
             if(view_name == this_view_name) {

                 mThis.cur_view =view_name;
                 $(this).show().siblings().hide();
                 //Show content of the selected tab panel
                 mThis.initContentView(mThis.cur_view);  
                 
                  //Add Active css class to current tab button
                  if (!tab_button_clicked) {
                    let tab_btn = mThis.self.find('div.tab-header>a[data-viewname="pmt_deliveries"]');
                    tab_btn.addClass('active').siblings().removeClass('active');
                  }
                   
                 return;
             } 
         }); 
  
         //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
         if(tab_button_clicked) { 
           mThis.self.find('div.tab-header>a.tab-button').each(function() {
             let this_view_name =($(this).data('viewname')+'').toLowerCase();
             if (view_name == this_view_name){
                 $(this).addClass('active').siblings().removeClass('active');
             }
           });
         }        
    } 
  
    this.initContentView = (view_name)=>{
       if (view_name=='dpmt_deliveries'){
           mThis.TabPanel_deliveries.show(); 
       }else  if (view_name=='dpmt_payments'){
           mThis.TabPanel_payments.show(); 
       } if (view_name=='dpmt_reports'){
           mThis.TabPanel_reports.show();  
       }
    };

     //##BEGIN::tabPanel Defintions
         //begin::Deliveries tabview
         this.TabPanel_deliveries = new function(){
                let mThis = this;
                this.base_url = $('#__base_url').val();
                this.self = $('#_dpmt_panel_deliveries');
                this.tblItems = $('#_dpmt_tblItems');
        
                this.elFilter_warehouse = $('#_dpmt_filter_warehouse');
                this.elFilter_driver = $('#_dpmt_filter_driver');
                this.elFilter_start_date = $('#_dpmt_filter_start_date');
                this.elFilter_end_date = $('#_dpmt_filter_end_date');
                this.filterPanel = $('#_dpmt_filter_panel');
                
                this.elSearchPackage = $('#_dpmt_search');
                this.btnSearch = $('#_dpmt_btnSearch');
                this.btnToggleFilter = $('#_dpmt_btnToggleFilter');
                
                this.btnPrint = $('#_dpmt_btnPrint');
                this.btnPDF = $('#_dpmt_btnPDF');
                this.btnExcel = $('#_dpmt_btnExcel');

                this.btnSelectAll = $('#_dpmt_btnSelectAll');
                this.btnReceivePmt = $('#_dpmt_btnReceivePmt');
                this.lblBalanceDue = $('#_dpmt_balance_due');

                //this.tblItems_body = $('this.tblItems_body');
            
                
                 //begin::init() Deliveries Tab Panel
                 this.init = ()=>{
                    if (mThis.initialized==true) return;
                    if (main_view.MULTI_WAREHOUSE_OP ==0) mThis.elFilter_warehouse.hide(); 
                    if(mThis.initialized ==true) return;
                    mThis.loadFilterData();
                    
                    mThis.btnToggleFilter.on('click',(e)=>{
                        let driver_name = mThis.elFilter_driver.find('option:selected').text();
                        if (!mThis.elFilter_driver.val()) {
                            cv_interact.alert('One driver should be selected');
                            return;
                        }
                        let op = {'title':'Filter Transactions','driver_name':driver_name};
                        FilterDialog_dpmt.show(op,(d)=>{
                        if(d) {
                            mThis.displayDeliveryItemsByDriver(d);
                        }
                        });
                    });
             
                    mThis.filterPanel.find('.dpmt_filter_field').on('change',function(e){
                        mThis.displayDeliveryItemsByDriver();
                    });
            
                    mThis.btnSearch.on('click',function(){
                        mThis.displayDeliveryItemsByDriver();
                    });
            
                    mThis.elSearchPackage.on('keyup',function(e){
                    if (e.keyCode ==13){
                        mThis.displayDeliveryItemsByDriver();  
                    }
                    });
  
                mThis.btnSelectAll.on('click',function(e){
                    e.preventDefault();
                    mThis.selectAllRows(true);
                    //mThis.selectAll(true);
                });
            
                $('#_dpmt_btnReceivePmt').on('click',function(e){
                    e.preventDefault();
                    //getSelectionInfo() return json object {'ids','total','packages','error_message'}
                    //error when user select wrong status such as "Failed" for receiving payment
                    let allowed_status = 8 ; //Allow user to select on Delivered packages for receiving payment
                    let sel = mThis.getSelectionInfo(allowed_status,'សូមជ្រើសរើសយកតែទំនិញដែលបានដឹកហើយ!');
                    let ids = sel.ids;
                    let total = sel.total;
                    //pacakges = sel.pacakges // array of {'package_id','adjust_amount','adjust_notes'} to be updated to table "pacakge"
                    if(!ids) {
                        cv_interact.alert('សូមជ្រើសរើសទំនិញដែលបានដឺកហើយ!');
                        return;
                    }
                    if (sel.error_message) {
                        cv_interact.alert(sel.error_message);
                        return;
                    }
                    let driver_id = mThis.elFilter_driver.val();
                    let driver_name = mThis.elFilter_driver.find('option:selected').text();
                    if(driver_id<=0 || !driver_id){
                        cv_interact.alert('No driver selected');
                        return;
                    }
                    let op = {
                    'title':'Receive Payment',
                    'ids':ids,
                    'packages':sel.packages,
                    'package_count':sel.package_count, /** count of packages selected **/
                    'total':total, //Net total
                    'payer_name':driver_name,
                    'payer_type':'driver',
                    'pmt_type':'Payment (from driver)',
                    'payer_id':driver_id,
                    'driver_id':driver_id
                    };
                   //ReceivePaymentDialog
                   ReceivePmtDialog1.show(op,(d)=>{ 
                        if(d){
                            post_ajax([mThis.base_url,'/api/receivePayments'].join(''),d,function(result){
                                if(result){
                                    if(result.status=='OK'){
                                        mThis.displayDeliveryItemsByDriver();
                                    }else cv_interact.alert(result.error_message,'','error');
                                }  
                            });
                        }
                    });
                });
                 
                   //print trip's information (Depart time, destination, status, package count)
                    mThis.tblItems.on('click','a._dpmt_print_barcode',function(e){
                                e.preventDefault();
                                let barcode = $(this).data('barcode');
                                window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
                        });
                        
                        mThis.tblItems.on('change','input._dpmt_check',function(e){
                            e.preventDefault();
                            let checked = $(this).is(':checked');
                            let tr = $(this).closest('tr');
                            let td = tr.find('td.total');
                            if(td) td.toggleClass('billing-paid-text'); 
                            //td.checkbox>input[type="checkbox"
                            mThis.setRowReadOnly(tr,checked?false:true);
                        });

                        mThis.tblItems.on('keyup','tbody>tr>td.fees>input.col-input',function(e){
                            let tr = $(this).closest('tr');
                            mThis.calculateTotal(tr);
                        });
                        mThis.tblItems.on('keyup','tbody>tr>td.cod_amount>input.col-input',function(e){
                            let tr = $(this).closest('tr');
                            mThis.calculateTotal(tr);
                        });

                        mThis.tblItems.on('keyup','tbody>tr>td.forwarding_cost>input.col-input',function(e){
                            let tr = $(this).closest('tr');
                            mThis.calculateTotal(tr);
                        });

                        mThis.initialized = true; //Prevent second time initializtion
                 }
                //end:: init() Deliveries Tab Panel

                          this.loadFilterData = (onFinish)=>{
                                    //DriverPaymentComponent.remembered_filter  
                                    let def =  mThis.remembered_filter? mThis.remembered_filter:{};
                                    if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
                                
                                if (mThis.form_data) {
                                    CommonLib.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                                    CommonLib.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,'(Select Driver)',def.driver_id);
                                    //CommonLib.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'status_id','status_name',false,'(All Status)',def.status_id); 
                                    if(typeof onFinish =='function') onFinish();
                                    return;   
                                }
                                    post_ajax([mThis.base_url,'/api/getForm_options_package_list'].join(''),null,function(data){
                                    if(data){
                                        data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
                                        data.drivers = StringSanitizer.sanitizeObject(data.drivers);      
                                        data.drivers.unshift({'id':null,'driver_name':'(Select Driver)'});
                                        
                                        CommonLib.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                                        CommonLib.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,'(Select Driver)',def.driver_id);
                                        //CommonLib.setComboItems(mThis.elFilter_status,data.statuses,'status_id','status_name',false,null,def.status_id);
                                        mThis.form_data = data;
                                        if(typeof onFinish =='function') onFinish();
                                    }
                                });
                        };

                        this.setRowReadOnly= (tr,readOnly)=>{
                            let elCODAmount = tr.find('td.cod_amount>input.col-input');  
                            let elAmount = tr.find('td.forwarding_cost>input.col-input');
                            let elNotes = tr.find('td.notes>input.col-input');
                            elCODAmount.prop('readOnly',readOnly);
                            elAmount.prop('readOnly',readOnly);
                            elNotes.prop('readOnly',readOnly);    
                            }

                            this.calculateTotal = (tr)=>{
                            if(!tr) return;
                            let cur = tr.data('cursymbol');
                            if(!cur) cur='$';
                            let elTaxiFee = tr.find('td.forwarding_cost>input.col-input');
                            let elCODAmount =tr.find('td.cod_amount>input.col-input'); // tr.find('td.cod_amount>span.value');
                            let elFees = tr.find('td.fees>input.col-input');
                            let elTotal = tr.find('td.total>span.value');
                            let taxi_fee = parseFloat(elTaxiFee.val());
                            if(!$.isNumeric(taxi_fee)) taxi_fee =0;
                            let fees = elFees.val(); //<input type ="number" ...
                            let cod_amount = elCODAmount.val(); //<input>
                            let total =  parseFloat(fees) + parseFloat(cod_amount) - taxi_fee;
                            elTotal.html(Number(total).toFixed(2));
                            //elTotal.data('value',total);
                            tr.data('totalnet',Number(total).toFixed(2));
                        };

                          //select all datatable rows even rows on next paginated pages
                            this.selectAllRows = function (selected = true){
                                if (!mThis.table) return;

                                //var rows = mThis.table.rows().nodes();
                                // Check/uncheck checkboxes for all rows in the table
                                //mThis.tblItems.find('input[type="checkbox"]', rows).prop('checked', selected);
                                       
                                // if (selected==true) 
                                // {
                                //      mThis.table.rows().select();
                                // }
                                // else 
                                //    mThis.table.rows().deselect(); 
                             
                               mThis.table.rows().nodes().each(function(){
                                    let tr = $(this);
                                    let c = tr.find('._dpmt_check'); //Checkbox to select pacakge
                                    //if(c.is('checkbox')) 
                                    c.prop('checked',selected);
                                    //let tr = c.closest('tr');
                                    tr.data('selected',selected?1:0);
                                    mThis.setRowReadOnly(tr,!selected);  
                                });
                                 
                            }
             

                        // this.selectAll = (select) =>{
                        //     mThis.tblItems.find('tbody>tr').each(function(){
                        //         let x = $(this);
                        //         if(select)
                        //           x.find('td.checkbox>input[type="checkbox"]').prop('checked',true);
                        //         else
                        //           x.find('td.checkbox>input[type="checkbox"]').prop('checked',false);
                        //         mThis.setRowReadOnly(x,false);  
                        //     });
                        //   }
                          
                          //returns json object {total:0,"packages"'ids':'123,235,...'}
                          // NOTE @ids is the array of pacakge_ids to be updated
                          //packages is array of {'pacakge_id','driver_adjust_amount','driver_adjust_notes'} for driver only, Not sender
                          this.getSelectionInfo = (allowed_status_id, error_message)=>{
                              let ids = '';
                              let total_sum = 0 ;
                              let sel_row_count = 0;
                              let err = null;
                              let sel_pacakges = [];
                             //mThis.tblItems.find('tbody>tr').each() ....;
                             let rows = mThis.table.rows().nodes();
                             let i=0;
                             let tr = null;
                                    do{
                                        tr =rows[i];
                                        if(!tr) break;
                                        tr = $(tr);
                                        if(tr.length ===0) break;
                                        let el = tr.find('td.checkbox>input[type="checkbox"]');
                                        let elCODAmount = tr.find('td.cod_amount>input.col-input');
                                        let elTaxiFee = tr.find('td.forwarding_cost>input.col-input');
                                        let elAdjustNotes  = tr.find('td.notes>input.col-input');
                                        //let td_net = tr.find('td.total');
                                        if(el){
                                                if(el.is(':checked')) {
                                                    let id = tr.data('pid');

                                                    //let adjust_amount = tr.data('adjustamount'); //driver's adjustment admount
                                                    let total_net = tr.data('totalnet');
                                                    //if(td_net) total_net = td_net.data('value'); //total_net = driver_total - adjustment_amount (such as taxi fee that driver paid his cash) 
                                                    let status_id = tr.data('statusid');
                                                    if(allowed_status_id && status_id != allowed_status_id){
                                                        if(!err || err =='') err = error_message;   
                                                    }
                                                    //alert(id + ' => '+ total_net);
                                                    sel_pacakges.push({'package_id':id,'cod_amount':elCODAmount.val(),'forwarding_cost':elTaxiFee.val(), 'adjust_notes':elAdjustNotes.val()});
                                                    ids = [ids,ids?'|':null,id].join('');
                                                    total_sum += parseFloat(total_net);
                                                    sel_row_count++;
                                                }
                                            } 
                                            i++;
                                    }while(tr);

                             //  mThis.table.rows().nodes().each(function(){

                             //});
                            return {'ids':ids,'package_count':sel_row_count,'total':Number(total_sum).toFixed(2),'packages':sel_pacakges,'error_message':err};
                          } 
                                             
                            this.displayDeliveryItemsByDriver = function()
                            {   
                                let p = FilterDialog_dpmt.getData();
                                //alert(JSON.stringify(p));    
                                //displayItems() | displayPackages(), get merchant or vendor transactions payments
                                post_ajax([mThis.base_url, '/api/getDeliveryItemsByDriver'].join(''),p,function(data) {  
                                    if(typeof data =='string') alert(data);
                                    if (mThis.table){
                                            mThis.tblItems.DataTable().clear().destroy();
                                            //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                                            mThis.tblItems.empty();
                                            //alert('destroyed => '+  mThis.tblItems.html());
                                            mThis.table = null;
                                    }
                                    
                                    data = StringSanitizer.sanitizeObject(data,null,['cur']); //sanitize except field "cur" currency symbol
                                    //begin::Set up columns
                                        //let cnt = 1;
                                        let my_columns = [
                                            { 
                                                className:'checkbox dt-body-center',
                                                data:function(data,a,b){
                                                if (data.driver_pmt_status_id == 1)
                                                return ['<i class="fas fa-check" style="color:green;font-weight:bold;font-size:1.3em"></i>'].join();  
                                                else   return ['<input type="checkbox" class="checkbox-lg _dpmt_check">'].join();   
                                                },
                                                title:'#'

                                            },
                                            {
                                                data:function(data,a,b){
                                                    return ['<div style="display:flex;flex-direction:row">',
                                                    //'<span style="display:block;margin-right:20px">',data.barcode,'</span>',
                                                    '<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_dpmt_print_barcode"><i class="fa fa-barcode"></i></a>',
                                                    '<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_dpmt_check_issue"><i class="fa fa-info" style="font-size:1.2emp; color:green;margin-left:15px"></i> </a>',
                                                    '</div>'].join('');
                                                },
                                                title:'Barcode'
                                            },
                                            {
                                                className:'delivery_date', 
                                                data:'delivery_date',
                                                title:'Delivery Date'
                                            },
                                            {
                                            className:'sender', 
                                            data:function(data,a,b){
                                                return data.sender_name; 
                                            },
                                            title:'Sender'
                                            },
                                            {
                                                className:'receiver', //class is very important for retrieving value @delivery_type to start trip
                                                data:function(data,a,b) {   
                                                    return data.receiver_phone;
                                                },
                                                title:'Receiver'
                                            },
                                            {
                                                className:'status',
                                                data:function(data,a,b){
                                                    let btn_class;
                                                    if(data.status_id ==9) btn_class ="btn btn-sm btn-outline-danger";
                                                    else if (data.status_id ==8) 
                                                    btn_class ="btn btn-sm btn-outline-success";
                                                    else
                                                    btn_class ="btn btn-sm btn-outline-primary";
                                                    return ['<button data-statusid="',data.status_id,'" role-"button" class="',btn_class,'">',data.status,'</button>'].join('');
                                                }, 
                                                title:'Status'
                                            },
                                            // {
                                            //     className:'cod_amount',
                                            //     data:function(data,a,b){
                                            //         return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.cod_amount,'</span>'].join('');
                                            //     },
                                            //     title:'COD'
                                            // },
                                            {
                                                className:'cod_amount', //This cssClass is very important to access Adjustment amount
                                                data:function(data,a,b){
                                                if(data.driver_pmt_status_id==1)
                                                {
                                                    data.cod_amount = Number(data.cod_amount).toFixed(2);
                                                    return ['<span class="billing-cod_amount">',data.cur,data.cod_amount,'</span>'].join('');
                                                }  
                                                else return ['<input type="number" class="form-control col-input" value="',data.cod_amount,'" readOnly="true">'].join('');  
                                                },
                                                title:'COD'
                                            },
                                            {
                                                className:'fees',
                                                data:function(data,a,b){
                                                    let fees =0;
                                                    if ((data.df_payer+'').toLowerCase() =='receiver') fees =  parseFloat(data.base_fee) + parseFloat(data.delivery_fee) + parseFloat(data.cod_fee);
                                                    if (data.driver_pmt_status_id ==1)
                                                      return ['<span class="bl-currency">',data.cur,'</span><span class="value">',fees,'</span>'].join('');
                                                    else
                                                      return ['<input type="number" class="form-control col-input" value="',fees,'" readOnly="true">'].join('');
                                                    
                                                },
                                                title:'Fees'
                                            },
                                            {
                                                className:'forwarding_cost', //This cssClass is very important to access Adjustment amount
                                                data:function(data,a,b){
                                                    data.driver_adjust_amount=data.driver_adjust_amount?data.driver_adjust_amount:0;  
                                                if(data.driver_pmt_status_id==1)
                                                    return ['<span class="billing-forwarding-cost">',data.cur,data.driver_adjust_amount,'</span>'].join('');
                                                else return ['<input type="number" class="form-control col-input" value="',data.driver_adjust_amount,'" readOnly="true">'].join('');  
                                                },
                                                title:'Taxi'
                                            },
                                            {
                                                className:'notes', //This cssclass is of critial importance
                                                data:function(data,a,b){
                                                if(data.driver_pmt_status_id==1) return ['<span class="billing-pmt-notes">',data.driver_pmt_notes,'</span>'].join('');
                                                else return ['<input type="text" class="col-input form-control" value="',data.driver_pmt_notes,'" readOnly="true">'].join('');  
                                                },
                                                title:'Remarks'
                                            },
                                            {
                                                className:'total',
                                                data:function(data,a,b){
                                                    if(!data.cur) data.cur='$';
                                                    if(!$.isNumeric(data.driver_adjust_amount)) data.driver_adjust_amount =0;
                                                    if(!$.isNumeric(data.fees)) data.fees =0;
                                                    if (!$.isNumeric(data.cod_amount)) data.cod_amount =0;
                                                    let fees = 0 ;
                                                    if((data.df_payer+'').toLowerCase() =='receiver') fees = parseFloat(data.fees);
                                                    let driver_total = parseFloat(data.cod_amount) + fees;
                                                    let total_net = driver_total + parseFloat(data.driver_adjust_amount);
                                                    total_net = Number(total_net).toFixed(2);     
                                                    if (data.driver_pmt_status_id ==1) return ['<span class="currency billing-paid-text">',data.cur,'</span><span class="value billing-paid-text">',total_net,'</span>'].join('');
                                                    else return ['<span class="bl-currency">',data.cur,'</span><span class="value">',total_net,'</span>'].join('');
                                                },
                                                title:'Total'
                                            },
                                            {
                                                className:'pmt-status',
                                                data:function(data,a,b){
                                                if (data.driver_pmt_status_id ==1) return ['<span class="billing-paid-text">Paid</span>'].join('');
                                                else return ['<span class="billing-unpaid-text">Unpaid</span>'].join('')
                                                },
                                                title:'Pmt'
                                            },
                                        
                                            //,{
                                            //     className:'col_action',
                                            //     data:function(data,row,display) {
                                            //      let html =['<div class="dropdown">',
                                            //          '<a href="#" data-did="',data.delivery_id,'" data-pid="',data.package_id,'" data-driverid="',data.driver_id,'" data-tknumber="',data.fleet_tracking_number,'" data-statusid="',data.status_id,'" class="btn_dpmt_action" aria-haspopup="true" aria-expanded="false">',
                                            //          '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                                            //          //' Action',
                                            //          '</a>',
                                            //         '</div>'].join('');
                                            //         return html;
                                            
                                            //     } 
                                            // }
                                        ];
                                        
                                    if (!mThis.table)
                                    mThis.table = mThis.tblItems.DataTable({
                                        searching:false,
                                        //destroy:true,
                                        paging:true,
                                        pageLength:10,
                                        ordering:false,
                                        //dom: 'Bfrtip',
                                        //retrieve: true,
                                        //scrollY:390,
                                        //scrollX:500,
                                        //pagingType:'numbers',
                                        info:true,
                                        bLengthChange:false,
                                        saveState:true,
                                        select: true,
                                        // rowReorder: {
                                            // dataSrc: 'sequence'
                                        // },
                                        'processing': true,
                                        'language': {
                                                'loadingRecords': '&nbsp;',
                                                'processing': 'Loading...',
                                                "emptyTable": "No packages found!"
                                            },
                                            data:data,
                                            columns:my_columns 
                                        ,"createdRow": function(row, data, dataIndex)
                                            {
                                                let tr = $(row);
                                                if(!$.isNumeric(data.driver_adjust_amount)) data.driver_adjust_amount =0;
                                                if(!$.isNumeric(data.fees)) data.fees =0;
                                                if (!$.isNumeric(data.cod_amount)) data.cod_amount =0;
                                                let fees= 0;
                                                if ((data.df_payer +'').toLowerCase() ==='receiver') fees = parseFloat(data.fees);
                                                let driver_total = parseFloat(data.cod_amount) + fees;
                                                let total_net = driver_total + parseFloat(data.driver_adjust_amount);
                                                tr.addClass('package_header'); 
                                                tr.data('pid',data.package_id); //package_id  
                                                 
                                                tr.data('cursymbol',data.cur); //Currency symbol, usually $
                                                tr.data('drivertotal',driver_total); //driver_total
                                                tr.data('adjustamount',data.driver_adjust_amount);
                                                tr.data('totalnet',total_net);       
                                                tr.data('did',data.delivery_id); //delivery_id             
                                                //tr.data('tknumber',data.fleet_tracking_number);
                                                tr.data('driverid',data.driver_id); //driver_id
                                                tr.data('statusid',data.status_id);
                                                tr.data('driverpmtstatusid',data.driver_pmt_status_id);

                                                let selected = tr.data('selected');
                                                selected = (selected==1)?true:false;
                                                if(selected== 1)  tr.find('._dpmt_check').prop('checked',selected);
                                            }

                                        //    ,"cellCreated":function(td,data,colIndex) {
                                        //        alert('test');
                                        //      if(colIndex==9){
                                        //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                                        //         $(td).html(html); 
                                        //      }
                                        //   }      								
                                    });
                                
                                    // let div = $('"_dpmt_d_filter_panel');  
                                    // $('"_dpmt_tblPackages_wrapper>div.dt-buttons').prepend(div);
                                    

                                                
                                }); //close post_ajax()
                                        
                            };
           
                    //Show Content of Deliveries Tab Panel 
                    this.show = (option)=>{
                       mThis.init(); //Init() will check itself to Execute only once
                        //mThis.self.show().siblings().hide();
                        mThis.displayDeliveryItemsByDriver();
                    }

         };
         //end::Deliveries tabview
         
         //begin::Payments tabview
         this.TabPanel_payments = new function(){
            let mThis = this;
            mThis.base_url = $('#__base_url').val();
            this.self = $('#_dpmt_panel_payments');
            mThis.tblItems = $('#_dpmt_tblPmts');
            
            this.filter_panel = $('#_dpmt_filter_panel');
            this.elStartDate = $('#_dpmt_filter_pmt_startdate');
            this.elEndDate = $('#_dpmt_filter_pmt_enddate');
            this.elDriver = $('#_dpmt_filter_pmt_driver');

           
            this.init = ()=>{
                if (mThis.initialized) return;
                DriverTabView.TabPanel_reports.prepareData(null,(ds)=>{
                    ds.unshift({'id':null,'driver_name':'(Choose driver)'});
                    CommonLib.setComboItems(mThis.elDriver,ds,'id','driver_name',false,null,null);
                    mThis.drivers = ds;
                });
               
                mThis.tblItems.on('click','tbody a._dpmt_btn_delete_pmt',function(e){
                  e.preventDefault();
                  let x = $(this);
                  mThis.target_tr = x.closest('tr');
                  cv_interact.confirm('Delete this payment?','Delete Payment',function(e){
                      if(e){
                          let trx_type ='receipt';
                          let p = {'id':x.data('id'), 'trx_type':trx_type};
                          post_ajax([mThis.base_url,'/api/deleteTransaction'].join(''),p,function(err){
                             if (!err || err ==''){
                                mThis.target_tr.find('img.trx-img').prop('src',null);
                                //mThis.displayPaymentsFromDriver();
                             }
                             else cv_interact.alert(err);
                          });
                      }
                  },'Delete','Close');
                });

                mThis.elDriver.on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsFromDriver();
                });
                mThis.elEndDate.on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsFromDriver();
                });
                mThis.elStartDate.on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsFromDriver();
                });
 
                mThis.initialized=true;
            }

            
            this.displayPaymentsFromDriver = function()
            {   
                let p = mThis.getFilterData();
                //alert(JSON.stringify(p));
                post_ajax([mThis.base_url, '/api/getPaymentsFromDriver'].join(''),p,function(data) {  
                    if(typeof data =='string') alert(data);
                    if (mThis.table){
                            mThis.tblItems.DataTable().clear().destroy();
                            //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                            mThis.tblItems.empty();
                            //alert('destroyed => '+  mThis.tblItems.html());
                            mThis.table = null;
                    }
                    
                    data = StringSanitizer.sanitizeObject(data,null,['cur']); //sanitize except field "cur" currency symbol
                    //begin::Set up columns
                        //let cnt = 1;
                        let my_columns = [ 
                            {
                                data:function(data,a,b){
                                    return ['<div style="display:flex;flex-direction:row">',
                                    //'<span style="display:block;margin-right:20px">',data.barcode,'</span>',
                                    '<a data-id="',data.id,'" data-amount="',data.amount,'" href="javascript:;" class=" btn btn-sm btn-outline-danger _dpmt_btn_delete_pmt"><i class="fa fa-times"></i></a>',
                                    //'<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_dpmt_check_issue"><i class="fa fa-info" style="font-size:1.2emp; color:green;margin-left:15px"></i> </a>',
                                    '</div>'].join('');
                                },
                                title:''
                            },
                            {
                                className:'payment_date', 
                                data:'payment_date',
                                title:'Payment Date'
                            },
                            {
                            className:'payer_name', 
                            data:function(data,a,b){
                                return data.payer_name; 
                            },
                            title:'Payer Name'
                            },
                            {
                                className:'pmt_method', //class is very important for retrieving value @delivery_type to start trip
                                data:function(data,a,b) {   
                                    return data.pmt_method;
                                },
                                title:'Method'
                            },
                            {
                                className:'amount',
                                data:function(data,a,b){
                                    return data.amount;
                                    }, 
                                title:'Amount'
                            },
                            {
                                className:'cashier_name',
                                data:'cashier_name', 
                                title:'Booked By'
                            }
                        ];
                        
                    if (!mThis.table)
                    mThis.table = mThis.tblItems.DataTable({
                        searching:false,
                        destroy:true,
                        paging:true,
                        pageLength:10,
                        ordering:false,
                        //dom: 'Bfrtip',
                        retrieve: true,
                        //scrollY:390,
                        //scrollX:500,
                        //pagingType:'numbers',
                        info:true,
                        bLengthChange:false,
                        saveState:true,
                        // rowReorder: {
                            // dataSrc: 'sequence'
                        // },
                        'processing': true,
                        'language': {
                                'loadingRecords': '&nbsp;',
                                'processing': 'Loading...',
                                "emptyTable": "No payments found!"
                            },
                            data:data,
                            columns:my_columns 
                        ,"createdRow": function(row, data, dataIndex)
                            {
                                let tr = $(row); 
                                if(!data.id) data.id = data.trx_id;
                                tr.data('id',data.id); // payment id  
                                tr.data('cursymbol',data.cur); //Currency symbol, usually $
                                tr.data('amount',data.amount); // amount of payment
                            }

                        //    ,"cellCreated":function(td,data,colIndex) {
                        //        alert('test');
                        //      if(colIndex==9){
                        //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                        //         $(td).html(html); 
                        //      }
                        //   }      								
                    });
                
                    // let div = $('"_dpmt_d_filter_panel');  
                    // $('"_dpmt_tblPackages_wrapper>div.dt-buttons').prepend(div);
                    

                                
                }); //close post_ajax()
                        
            };

            mThis.getFilterData = ()=>{
                let p = {'start_date':mThis.elStartDate.val(), 'end_date':mThis.elEndDate.val(), 'driver_id':mThis.elDriver.val()};
                return p;
            }
             this.show = ()=>{
               mThis.init();   
               mThis.displayPaymentsFromDriver();
             }

            
         }
         //end::Payments tabview

         //begin::Reports tabview
         this.TabPanel_reports = new function(){
            let mThis = this;
            this.self = $('#_dpmt_panel_reports');
            this.btnRunReport = $('#_dpmt_btnRunReport');

            this.elFilter_report_driver = $('#_dpmt_rptfilter_driver');
            this.elFilter_report_start_date = $('#_dpmt_rptfilter_start_date');
            this.elFilter_report_end_date = $('#_dpmt_rptfilter_end_date');
          
            this.getData =()=>{
                let p = {
                    'report_name':mThis.selected_rpt_name,
                    'driver_id':mThis.elFilter_report_driver.val(),
                    'start_date':mThis.elFilter_report_start_date.val(),
                    'end_date':mThis.elFilter_report_end_date.val(),
                    'driver_name':mThis.elFilter_report_driver.find('option:selected').text()
                };

                if (!p.report_name){
                    cv_interact.alert('No report selected!');
                    return null;
                }
                if (!p.driver_id){
                    cv_interact.alert('No driver selected!');
                    return null;
                }
                return p;
            }

            this.prepareData = (def ={},onFinish)=>{
                if(!def) def = {}; 
                if (mThis.drivers) {
                    //mThis.drivers = DriverTabView.TabPanel_deliveries.drivers;
                    DriverTabView.TabPanel_payments.drivers = mThis.drivers;
                    CommonLib.setComboItems(mThis.elFilter_report_driver,mThis.drivers,'id','driver_name',false,null,def.driver_id);
                    if(typeof onFinish =='function') onFinish(mThis.drivers);
                    return;
                }
               
                post_ajax([mThis.base_url,'/api/getComboItems_driver'].join(''),null,function(rows){
                    if(rows){
                        rows = StringSanitizer.sanitizeObject(rows);
                        CommonLib.setComboItems(mThis.elFilter_report_driver,rows,'id','driver_name',false,null,def.driver_id);
                        if(typeof onFinish =='function') onFinish(rows);
                        mThis.drivers = rows;
                        DriverTabView.TabPanel_payments.drivers = mThis.drivers;
                    }
                });
            }

            this.init = ()=>{
               if(mThis.initialized) return;
               mThis.prepareData();
               this.reportItems = $('#_dpmt_report_list');
               
               mThis.reportItems.on('click','a.report-item',function(e){
                   if (mThis.prev_report_item) mThis.prev_report_item.removeClass('bl-report-selected');
                   $(this).addClass('bl-report-selected');
                   mThis.selected_rpt_name = $(this).data('rptname'); //remember currently selected report name
                   mThis.prev_report_item = $(this);
               });

                this.btnRunReport.on('click',function(e){
                    e.preventDefault();
                    let p = mThis.getData();
                    if (!p) return;
                    let params = ['rtype=',p.report_name,'&wid=',p.warehouse_id,'&driverid=',p.driver_id,'&startdate=',p.start_date,'&enddate=', p.end_date,'&dtype=',p.delivery_type,'&drivername=',p.driver_name].join('');
                    pdfReport.getEncryptData(encodeURI(params),(d)=>{
                        window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
                    });
                   //dr_package_list  
                });


               mThis.initialized = true;

            }
 
             //show Repor Panel content
            this.show = ()=>{
               mThis.init();
            }
         }
         //end::Reports tabview

     //##END::Tabpanel defintions
      
 }
 //end::DriverTabView
 
//begin::FilterDialog_dpmt
var FilterDialog_dpmt = new function(){
    let mThis = this;
    this.self = $('#_dpmt_dlgFilter');
    this.elTitle = $('#_dpmt_dlgFilterTitle');
    this.btnOK = $('#_dpmt_dlgFilter_btnOK');
    //this.body = $('#_dpmt_dlgFilter>div.modal-body');
    this.lblDriverName = $('#_dpmt_filter_driver_name'); 

    this.getData = ()=>{
        let p = {};
        //start popupate filter data from Dialog fields (Package Status, Driver pmt status, startdate, enddate)
        mThis.self.find('.dpmt_filter_field').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            p[dataMember] = el.val();  
        });

        let panel = DriverTabView.TabPanel_deliveries;
        p.driver_id = panel.elFilter_driver.val();
        p.warehouse_id = panel.elFilter_warehouse.val();
        panel.elSearchPackage.val(null);
        p.search_value ='';
        if (!p.driver_pmt_status_id) {
            cv_interact.alert('It seems the filter data are not correct');
            console.log('It seems the filter data are not correct. Please check the css class "dpmt_filter_field" in file DriverPaymentComponent.blade.php');
            return null;
        }
        return p;
    }
    this.btnOK.on('click',(e)=>{
        e.preventDefault();
        mThis.self.modal('hide');
        let p = mThis.getData();
        let xp = DriverTabView.TabPanel_deliveries;
        p.warehouse_id = xp.elFilter_warehouse.val();
        p.driver_id =  xp.elFilter_driver.val();
        if (typeof mThis.onClose =='function') mThis.onClose(p);
    });

    this.show = (op={}, onClose)=>{
        mThis.elTitle.html(op.title);
        mThis.onClose = onClose;
        mThis.lblDriverName.text(op.driver_name);
        mThis.self.modal({
            backdrop:'static'
        });
    }
} 
//end::FilterDialog_dpmt

 //begin::ReceivePmtDialog_driver
 var ReceivePmtDialog1 = new function(){
    let mThis = this;
    this.self = $('#_dpmt_dlgReceivePmt1');
    this.btnOK = $('#_dpmt_dlgReceivePmt_btnOK');
    this.elTitle = $('#_dpmt_dlgReceivePmt1_title');
    this.elPayer_name = $('#_dpmt_receive_payer');
    this.elPackageCount = $('#_dpmt_receive_package_count');

    this.elAmountDue = $('#_dpmt_receive_amount_due');
    this.elAmount_total = $('#_dpmt_receive_amount'); //Total amount
    this.elAmount_cash = $('#_dpmt_receive_cash');
    this.elAmount_noncash = $('#_dpmt_receive_noncash');
    this.elNotes = $('#_dpmt_receive_notes');
    this.elPmtMethod1 = $('#_dpmt_receive_pmt_method1');
    this.elPmtMethod2 = $('#_dpmt_receive_pmt_method2');
    this.elError = $('#_dpmt_error');

    this.btnOK.on('click',(e)=>{
      e.preventDefault();
      let p = mThis.getData();
      if (!p) return;
      mThis.self.modal('hide');
      if (mThis.onClose  instanceof Function) mThis.onClose(p);
    });

    this.elAmount_cash.on('keyup',function(e){
        let val = parseFloat($(this).val());
        let bal = parseFloat(mThis.elAmountDue.val());
        mThis.elAmount_total.val(bal.toFixed(2));
        let d = bal - val;
        mThis.elAmount_noncash.val(d); 
    });
    this.elAmount_noncash.on('keyup',function(e){
        let val = parseFloat($(this).val());
        let bal = parseFloat(mThis.elAmountDue.val());
        mThis.elAmount_total.val(bal.toFixed(2));
        let d = bal - val;
        mThis.elAmount_cash.val(d); 
    });

    this.getData = ()=>{
            let pmts = [];
            let p1 = {
                'payer_id':mThis.payer_id?mThis.payer_id:mThis.driver_id,
                'payer_name':mThis.elPayer_name.val(),
                'amount_due':mThis.elAmountDue.val(),
                //'packages':mThis.packages, //array of {'package_id','adjust_amount','adjust_notes'} to be update to table "pacakage"   
                //'amount':mThis.elAmount_total.val(), // Total amount = amount_cash + amount_non_cash
                //'pmt_method':mThis.elPmtMethod.val(),
                'payer_type':mThis.payer_type,
                'pmt_type':mThis.pmt_type,
                'description':mThis.elNotes.val(),
                'ids':mThis.ids
            };
            let total = parseFloat(mThis.elAmount_cash.val()) + parseFloat(mThis.elAmount_noncash.val());
            if (p1.amount_due > total) {
                mThis.elError.html('ទឹកប្រាក់មិនគ្រប់គ្រាន់');
                return null;
            } 
            else if (p1.amount_due < total) {
                mThis.elError.html('ទឹកប្រាក់ដូចជាជាលើស');
                return null;
            }
            if(!p1.payer_id) {
                mThis.elError.html('Payer identity is not correct!');
                return null;
            }
           
            p1.amount = mThis.elAmount_cash.val();
            p1.pmt_method = mThis.elPmtMethod1.val();
            if(!p1.pmt_method) {
                mThis.elError.html('Payment method one must be Cash');
                return null;
            }
            pmts.push(p1);
            let p2 =  Object.assign({},p1);// clone value of p1 into p2 (NOTE: this is not simple referencing to the same var using = )
            p2.amount = mThis.elAmount_noncash.val();
            p2.pmt_method = mThis.elPmtMethod2.val();
            if(!p2.pmt_method) {
                mThis.elError.html('Payment method two must must be non-cash or bank transfer');
                return null;
            }
            if (p2.amount>0) pmts.push(p2);
            return {'pmts':pmts,'packages':mThis.packages};
    }

    this.show = (option,onClose)=>{
       mThis.elError.html(null);
       mThis.elTitle.html(option.title);
       mThis.onClose = onClose;
       if (option.total<0) option.total = - option.total;
       mThis.elAmountDue.val(option.total);
       mThis.elPayer_name.val(option.payer_name);
       mThis.elPackageCount.val(option.package_count);
 
       mThis.packages = option.packages;
       mThis.ids = option.ids;
       mThis.payer_type = option.payer_type;
       mThis.pmt_type = option.pmt_type,
       mThis.payer_id = option.driver_id;
       mThis.driver_id = option.payer_id;
       mThis.payer_type = option.payer_type;
      
       mThis.self.modal({
           backdrop:'static'
       }).on('shown.bs.modal',()=>{
           let d = Number(mThis.elAmountDue.val());
           mThis.elAmount_total.val(d.toFixed(2));
           d = mThis.elAmountDue.val(d.toFixed(2));
           mThis.elAmount_cash.val();
           mThis.elAmount_noncash.val(0);
           mThis.elAmount_cash.focus();
       });
    }
}
//end::ReceivePmtDialog_driver

$(document).ready(function(){
    DriverPaymentComponent.init();
});
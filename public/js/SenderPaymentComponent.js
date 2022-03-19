'use strict'
//## begin::SenderPaymentComponent
var SenderPaymentComponent = new function() {
    let xThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_senderPmtComponent');
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
        SenderTabView.show('spmt_deliveries',false);

    }
   
    // //create dropdown menus for Driver's transaction list table
    // this.createDropdownMenuHtml_dpmt = function(delivery_id,tknumber,driver_id,status_id) {
    //     //cla = 'class_list_action' = > cla_delete, cla_modify,...
    //     let html = ['<div class="dropdown-menu" data-tripid="',delivery_id,'" data-did="',delivery_id,'" data-tknum="',tknumber,'" data-driverid="',driver_id,'" data-statusid="',status_id,'">',
    //     '<a class="dropdown-item _spmt_start_trip tog-visible" href="#"><i class="fas fa-calendar-check" style="color:green"></i> Receive Paymnent</a>',
    //     '<a class="dropdown-item _spmt_stop_trip tog-visible" href="#"><i class="fas fa-times" style="color:red"></i> Delete</a>',
    //     '<a class="dropdown-item _spmt_change_driver" href="#"><i class="fas fa-edit" style="color:green"></i> Edit Package</a>',
    //     '<div class="dropdown-divider"></div>',
    //       '</div>'].join('');
    //       return html;
    // };
   
}
//## end::SenderPaymentComponent
 
//begin::SenderTabView SenderPaymentTabView
var SenderTabView = new function(){
    let mThis = this;
    this.self = $('#_spmt_senderTabView');
    //this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.cur_view = 'spmt_deliveries';
    
    this.self.on('click','div.tab-header>a.tab-button',function(e){
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(view_name,true);
    });

     //Show active tab on SenderTabView
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
       if (view_name=='spmt_deliveries'){
           mThis.TabPanel_deliveries.show(); 
       }else  if (view_name=='spmt_payments'){
           mThis.TabPanel_payments.show(); 
       } if (view_name=='spmt_reports'){
           mThis.TabPanel_reports.show();  
       }
    };

     //##BEGIN::tabPanel Defintions
         //begin::Deliveries tabview
         this.TabPanel_deliveries = new function(){
                let mThis = this;
                this.self = $('#_spmt_panel_deliveries');
                this.tblItems = $('#_spmt_tblItems');
        
                this.elFilter_warehouse = $('#_spmt_filter_deliveries_warehouse');
                this.elFilter_warehouse .hide();
                this.elFilter_sender = $('#_spmt_filter_deliveries_sender');
                this.elFilter_start_date = $('#_spmt_filter_start_date');
                this.elFilter_end_date = $('#_spmt_filter_end_date');
                this.filterPanel = $('#_spmt_filter_panel');
                
                this.elSearchPackage = $('#_spmt_search');
                this.btnSearch = $('#_spmt_btnSearch');
                this.btnToggleFilter = $('#_spmt_btnToggleFilter');
                
                this.btnPrint = $('#_spmt_btnPrint');
                this.btnPDF = $('#_spmt_btnPDF');
                this.btnExcel = $('#_spmt_btnExcel');

                this.btnSelectAll = $('#_spmt_btnSelectAll');
                this.btnPay = $('#_spmt_btnPay');
                this.btnReceivePmt = $('#_spmt_btnReceivePmt');
                this.btnSettleZero = $('#_spmt_btnSettleZero');
                this.elTotalDue = $('#_spmt_balance_due');

                //this.tblItems_body = $('this.tblItems_body');
            
                
                 //begin::init() Deliveries Tab Panel
                 this.init = ()=>{
                    if (main_view.MULTI_WAREHOUSE_OP ==0) {
                        mThis.elFilter_warehouse.hide();
                    } else  mThis.elFilter_warehouse.show();

                    if (mThis.initialized==true) return;
                    if(mThis.initialized ==true) return;
                    mThis.loadFilterData();
                    
                    mThis.elFilter_sender.on('change',function(e){
                       mThis.displayDeliveryItemsBySender();
                    });

                    mThis.btnToggleFilter.on('click',(e)=>{
                        let sender_name = mThis.elFilter_sender.find('option:selected').text();
                        if (!mThis.elFilter_sender.val()) {
                            cv_interact.alert('One driver should be selected');
                            return;
                        }
                        let op = {'title':'Filter Transactions','sender_name':sender_name};
                        FilterDialog_spmt.show(op,(d)=>{
                        if(d) {
                            mThis.displayDeliveryItemsBySender(d);
                        }
                        });
                    });
             
                    mThis.filterPanel.find('.spmt_filter_field').on('change',function(e){
                        mThis.displayDeliveryItemsBySender();
                    });
            
                    mThis.btnSearch.on('click',function(){
                        mThis.displayDeliveryItemsBySender();
                    });
            
                    mThis.elSearchPackage.on('keyup',function(e){
                    if (e.keyCode ==13){
                        mThis.displayDeliveryItemsBySender();  
                    }
                    });
            
                mThis.btnSelectAll.on('click',function(e){
                    e.preventDefault();
                    mThis.selectAllRows(true);
                });

                mThis.btnSettleZero.on('click',function(e){
                    e.preventDefault();
                    mThis.btnPay.trigger('click');
                });

                mThis.btnReceivePmt.on('click',function(e){
                    e.preventDefault();
                    let allowed_status = 8 ; //Allow user to select on Delivered packages for receiving payment
                    //getSelectionInfo() takes parater @context = 'receive_pmt'
                    let sel = mThis.getSelectionInfo('receive_pmt', allowed_status,'សូមជ្រើសរើសយកតែទំនិញដែលបានដឹកហើយ!');
                    let ids = sel.ids;
                    let total = sel.total;
                    //pacakges = sel.pacakges // array of {'package_id','adjust_amount','adjust_notes'} to be updated to table "pacakge"
                    if(!ids) {
                        cv_interact.alert('No deliveries selected');
                        return;
                    }
                    if (sel.error_message) {
                        cv_interact.alert(sel.error_message);
                        return;
                    }
                    let sender_id = mThis.elFilter_sender.val();
                    let sender_name = mThis.elFilter_sender.find('option:selected').text();
                    if(sender_id<=0 || !sender_id){
                        cv_interact.alert('No vendor selected');
                        return;
                    }

                    let op = {
                        'title':'Receive Payment',
                        'ids':ids,
                        'packages':sel.packages,
                        'package_count':sel.package_count,
                        'total':total, //Net total
                        'payer_name':sender_name,
                        'payer_type':'sender',
                        'pmt_type':'Payment from vendor',
                        'payer_id':sender_id,
                        'sender_id':sender_id
                        };
                        
                       ReceivePmtDialog1.show(op,(d)=>{
                            if(d){
                                post_ajax([mThis.base_url,'/api/receivePayment'].join(''),d,function(result){
                                    if(result){

                                        if(result.status=='OK'){
                                            mThis.displayDeliveryItemsBySender();
                                        }else cv_interact.alert(result.error_message,'','error');
                                    }
                                });
                            }
                        });
                });

                mThis.btnPay.on('click',function(e){
                    e.preventDefault();
                    //getSelectionInfo() return json object {'ids','total','packages','error_message'}
                    //error when user select wrong status such as "Failed" for receiving payment
                    let allowed_status = 8 ; //Allow user to select on Delivered packages for receiving payment
                    let sel = mThis.getSelectionInfo(allowed_status,'សូមជ្រើសរើសយកតែទំនិញដែលបានដឹកហើយ!');
                    let ids = sel.ids;
                    let total = sel.total;
                    //pacakges = sel.pacakges // array of {'package_id','adjust_amount','adjust_notes'} to be updated to table "pacakge"
                    if(!ids) {
                        cv_interact.alert('សូមរើសយកកញ្ចប់ទំនីញដើម្បីទូទាត់!');
                        return;
                    }
                    if (sel.error_message) {
                        cv_interact.alert(sel.error_message);
                        return;
                    }
                    let sender_id = mThis.elFilter_sender.val();
                    let sender_name = mThis.elFilter_sender.find('option:selected').text();
                    if(sender_id<=0 || !sender_id){
                        cv_interact.alert('No vendor selected');
                        return;
                    }
                    let op = {
                    'title':'Pay To Vendor',
                    'ids':ids,
                    'packages':sel.packages,
                    'package_count':sel.package_count, /** number of packages selected for settlement **/
                    'total':total, //Net total
                    'payee_name':sender_name,
                    'payee_type':'sender',
                    'pmt_type':'Payment to Vendor',
                    'payee_id':sender_id,
                    'sender_id':sender_id
                    };

                    //PaymentDialog | PayDialog
                    PayToVendorDialog.show(op,(d)=>{
                        if(d){
                        post_ajax([mThis.base_url,'/api/payToVendor'].join(''),d,function(result){
                            if(result){
                                if(result.status=='OK'){
                                    mThis.displayDeliveryItemsBySender();
                                }else cv_interact.alert(result.error_message,'','error');
                            }
                        });
                        }
                    });
                });
                 
                   //print trip's information (Depart time, destination, status, package count)
                    mThis.tblItems.on('click','a._spmt_print_barcode',function(e){
                                e.preventDefault();
                                let barcode = $(this).data('barcode');
                                window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
                        });
                        
                        mThis.tblItems.on('change','input._spmt_check',function(e){
                            e.preventDefault();
                            let checked = $(this).is(':checked');
                            let tr = $(this).closest('tr');
                            let status_id = tr.data('statusid');
                            
                            //Calcualte and display Total and hide or show "Pay" buttons. Two buttons "Pay To Merchant" or "Receive Pmt"
                            mThis.displayTotalBalance();

                            if(status_id != 8) {
                                $(this).prop('checked',false);
                                cv_interact.alert('សូមជ្រើសរើសយកតែទំនិញដែលបានដឺកហើយ!');
                                return;
                            }
                            let td = tr.find('td.total');
                            if(td) td.toggleClass('billing-paid-text'); 
                            //td.checkbox>input[type="checkbox"
                            mThis.setRowReadOnly(tr,checked?false:true);
                        });

                        mThis.tblItems.on('keyup','tbody>tr>td.adjustment>input.col-input',function(e){
                            let tr = $(this).closest('tr');
                            mThis.calculateTotal(tr);
                        });

                        mThis.initialized = true; //Prevent second time initializtion
                 }
                //end:: init() Deliveries Tab Panel

                          this.loadFilterData = (onFinish)=>{
                                    //SenderPaymentComponent.remembered_filter  
                                    let def =  mThis.remembered_filter? mThis.remembered_filter:{};
                                    if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
                                
                                if (mThis.form_data) {
                                    CommonLib.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                                    CommonLib.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,'(Choose merchant)',def.sender_id);
                                    //CommonLib.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'status_id','status_name',false,'(All Status)',def.status_id); 
                                    if(typeof onFinish =='function') onFinish();
                                    return;   
                                }
                                    post_ajax([mThis.base_url,'/api/getForm_options_package_list'].join(''),null,function(data){
                                    if(data){
                                        data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
                                        data.senders = StringSanitizer.sanitizeObject(data.senders);      
                                        data.senders.unshift({'id':null,'sender_name':'(Choose merchant)'});
                                        
                                        CommonLib.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                                        CommonLib.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,'(Choose merchant)',def.sender_id);
                                        //CommonLib.setComboItems(mThis.elFilter_status,data.statuses,'status_id','status_name',false,null,def.status_id);
                                        mThis.form_data = data;
                                        if(typeof onFinish =='function') onFinish();
                                    }
                                });
                        };

                        this.setRowReadOnly= (tr,readOnly)=>{
                            let elAmount = tr.find('td.adjustment>input.col-input');
                            let elNotes = tr.find('td.notes>input.col-input');
                            elAmount.prop('readOnly',readOnly);
                            elNotes.prop('readOnly',readOnly);    
                        }

                        this.displayTotalBalance = ()=>{
                                //begin:: manipulate display of Total and Pay buttons
                            let sel = mThis.getSelectionInfo();
                            let cur ='$';
                          
                            if (sel.total ==0) {
                                mThis.elTotalDue.html([cur,Math.abs(sel.total)].join(''));
                                mThis.elTotalDue.css('color','green');
                                mThis.btnSettleZero.show().siblings().hide();
                            }else if (sel.total <0) 
                            {
                                mThis.elTotalDue.html(['(',cur,Math.abs(sel.total),')'].join(''));
                                mThis.elTotalDue.css('color','green');
                                mThis.btnReceivePmt.show().siblings().hide();
                            }
                            else { 
                                    mThis.elTotalDue.html([cur,sel.total].join(''));
                                    mThis.elTotalDue.css('color','orange');
                                    mThis.btnPay.show().siblings().hide();
                            }

                            mThis.elTotalDue.html([cur,sel.total].join(''));
                           //end::manipulate display of Total and Pay buttons
                          }

                        this.calculateTotal = (tr)=>{
                            if(!tr) return;
                            let cur = tr.data('cursymbol');
                            //get df_payer from tr.data(). df_payer is Fee Payer that can be "Sender" or "Receiver" of package
                            let df_payer = tr.data('dfp'); 
                            if(!cur) cur='$';
                            let elAdjust = tr.find('td.adjustment>input.col-input');
                            let elCOD = tr.find('td.cod_amount>span.value');
                            let elFees = tr.find('td.fees>span.value');
                            let elForwardingCost = tr.find('td.forwarding_cost>span.value');
                            let elTotal = tr.find('td.total>span.value');
                            let adjust_fee = parseFloat(elAdjust.val());
                            if(!$.isNumeric(adjust_fee)) adjust_fee =0;
                            
                            let fees =0;
                            if((df_payer+'').toLowerCase() ==='sender') fees = elFees.text(); //<td> 

                            let cod_amount = elCOD.text(); //<td>
                            let forwarding_cost = elForwardingCost.text();
                            let total =  parseFloat(cod_amount) + adjust_fee - parseFloat(fees) - parseFloat(forwarding_cost);
                            elTotal.html(Number(total).toFixed(2));
                            //elTotal.data('value',total);
                            //This totalnet is "total" amount to pay to Vendor. If it is negaitve => Vendor owes the company
                            tr.data('totalnet',Number(total).toFixed(2));
                        };

                    
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
                                let c = tr.find('._spmt_check'); //Checkbox to select pacakge
                                //if(c.is('checkbox')) 
                                c.prop('checked',selected);
                                //let tr = c.closest('tr');
                                tr.data('selected',selected?1:0);
                                mThis.setRowReadOnly(tr,!selected);  
                            });
                            //Display total balance for all selected packages
                            mThis.displayTotalBalance();
                             
                        }

                    //    this.selectAll = (select) =>{
                    //         mThis.tblItems.find('tbody>tr').each(function(){
                    //             let x = $(this);
                    //             if(select)
                    //               x.find('td.checkbox>input[type="checkbox"]').prop('checked',true);
                    //             else
                    //               x.find('td.checkbox>input[type="checkbox"]').prop('checked',false);
                    //         });
                    //         //display total balance, hide or show Pay botton according to the total balance - or +
                    //         mThis.displayTotalBalance();
                    //     }
                          
                          //returns json object {total:0,"packages"'ids':'123,235,...'}
                          // NOTE @ids is the array of pacakge_ids to be updated
                          //packages is array of {'pacakge_id','sender_adjust_amount','driver_adjust_notes'} for driver only, Not sender
                          //@context = {'receive_pmt','payment'} payment = disbursement
                          this.getSelectionInfo = (context, allowed_status_id, error_message)=>{
                              let ids = '';
                              let total_sum = 0 ;
                              let err = null;
                              let sel_pacakges = [];
                              let sel_row_count =0;

                             //mThis.tblItems.find('tbody>tr').each() ...;
                             let rows = mThis.table.rows().nodes();
                             let i =0;
                             let tr = null;
                             do{
                                 tr = rows[i];
                                 if(!tr) break;
                                 tr = $(tr);
                                 if(tr.length ===0) break;
                                                let el = tr.find('td.checkbox>input[type="checkbox"]');
                                                let elAdjustAmount = tr.find('td.adjustment>input.col-input');
                                                let elAdjustNotes  = tr.find('td.notes>input.col-input');
                                                let sender_confirmed = tr.data('senderconfirmed');
                                                //let td_net = tr.find('td.total');
                                                if(el){
                                                    if(el.is(':checked')) {
                                                    /** remove comment below if you want Merchant to confirm correctness of each package before payment settlement **/  
                                                    //  if (sender_confirmed !=1) {
                                                    //      el.prop('checked',false);
                                                    //      cv_interact.alert('អ្នកលក់មិនទាន់បញ្ចាក់ថាកញ្ចប់នេះត្រឹមត្រូវទេ','','warning');
                                                    //      return;
                                                    //  }  
                                                    let id = tr.data('pid');
                                                    //let adjust_amount = tr.data('adjustamount'); //driver's adjustment admount
                                                    let total_net = tr.data('totalnet');
                                                    //if(td_net) total_net = td_net.data('value'); //total_net = driver_total - adjustment_amount (such as taxi fee that driver paid his cash) 
                                                    let status_id = tr.data('statusid');
                                                    
                                                    if (context == 'receive_pmt') {
                                                        if (total_net >=0) {
                                                            if(!err || err =='') err = 'សូមជ្រើសរើសយកតែកញ្ចប់ទំនិញដែលអ្នកលក់នៅជំពាក់!';
                                                        }
                                                    }
                                                    
                                                    if(allowed_status_id && status_id != allowed_status_id){
                                                        if(!err || err =='') err = error_message;   
                                                    }
                                                    
                                                    sel_pacakges.push({'package_id':id,'adjust_amount':elAdjustAmount.val(), 'adjust_notes':elAdjustNotes.val()});
                                                    ids = [ids,ids?'|':null,id].join('');
                                                    total_sum += parseFloat(total_net);
                                                    sel_row_count++;
                                                    }
                                                } 
                                   i++;
                             }while(tr);

                            return {'ids':ids,'package_count':sel_row_count,'total':Number(total_sum).toFixed(2),'packages':sel_pacakges,'error_message':err};
                          } 
                                             
                            this.displayDeliveryItemsBySender = function()
                            {   
                                let p = FilterDialog_spmt.getData();   
              
                                //get merchant or vendor transactions payments
                                post_ajax([mThis.base_url, '/api/getDeliveryItemsBySender'].join(''),p,function(data) {  
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
                                                className:'checkbox',
                                                data:function(data,a,b){
                                                if (data.sender_pmt_status_id ==1)
                                                return ['<i class="fas fa-check" style="color:green;font-weight:bold;font-size:1.3em"></i>'].join();  
                                                else   return ['<input type="checkbox" class="checkbox-lg _spmt_check">'].join();   
                                                },
                                                title:'#'

                                            },
                                            {
                                                data:function(data,a,b){
                                                    return ['<div style="display:flex;flex-direction:row">',
                                                    //'<span style="display:block;margin-right:20px">',data.barcode,'</span>',
                                                    '<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_spmt_print_barcode"><i class="fa fa-barcode"></i></a>',
                                                    //'<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_spmt_check_issue"><i class="fa fa-info" style="font-size:1.2emp; color:green;margin-left:15px"></i> </a>',
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
                                                className:'receiver', //class is very important for retrieving value @delivery_type to start trip
                                                data:function(data,a,b) {   
                                                    return data.receiver_phone;
                                                },
                                                title:'Receiver'
                                            },
                                            {
                                                className:'df_payer', //This col determines if Sender has to pay fees or not
                                                data:function(data,a,b) {   
                                                    let cls_sender_confirm ='dms-sender_confirmed';
                                                    if (data.sender_confirmed !=1) cls_sender_confirm ='dms-sender_not_confirmed';
                                                    return [data.df_payer,'<span class="',cls_sender_confirm,'"></span>'].join('');
                                                },
                                                title:'Fee Payer'
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
                                                   
                                                   
                                                    return ['<button data-statusid="',data.status_id,'" role-"button" class="',btn_class,'">',data.status,'</button>'
                                                    ].join('');
                                                }, 
                                                title:'Status'
                                            },
                                            {
                                                className:'cod_amount',
                                                data:function(data,a,b){
                                                    return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.cod_amount,'</span>'].join('');
                                                },
                                                title:'COD'
                                            },
                                            // {
                                            //     className:'cod_fee',
                                            //     data:function(data,a,b){
                                            //         return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.cod_fee,'</span>'].join('');
                                            //     },
                                            //     title:'COD Fee'
                                            // },
                                            {
                                                className:'fees',
                                                data:function(data,a,b){
                                                    let v_value = 0;
                                                    if(data.base_fee <0 || data.delivery_fee <0) 
                                                        return '<span style="color:red;font-size:0.8em">មិនទាន់កំណត់</span>';                           
                                                    else 
                                                        {
                                                         let fees =0;
                                                         if ((data.df_payer+'').toLowerCase() =='sender') fees = parseFloat(data.base_fee) + parseFloat(data.delivery_fee);
                                                        return ['<span class="bl-currency">',data.cur,'</span><span class="value">',fees,'</span>'].join('');
                                                    
                                                        }
                                                    
                                                },
                                                title:'Fees'
                                            },
                                            {
                                                className:'forwarding_cost',
                                                data:function(data,a,b){
                                                    return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.forwarding_cost,'</span>'].join('');
                                                },
                                                title:'Forwarding'
                                            },
                                            {
                                                className:'adjustment', //This cssClass is very important to access Adjustment amount
                                                data:function(data,a,b){
                                                    data.sender_adjust_amount=data.sender_adjust_amount?data.sender_adjust_amount:0;  
                                                if(data.sender_pmt_status_id==1)
                                                    return ['<span class="billing-adjust-amount">',data.cur,data.sender_adjust_amount,'</span>'].join('');
                                                else return ['<input type="number" class="form-control col-input" value="',data.sender_adjust_amount,'" readOnly="true">'].join('');  
                                                },
                                                title:'Adjustmemt'
                                            },
                                            {
                                                className:'notes', //This cssclass is of critial importance
                                                data:function(data,a,b){
                                                if(data.sender_pmt_status_id==1) return ['<span class="billing-pmt-notes">',data.sender_pmt_notes,'</span>'].join('');
                                                else return ['<input type="text" class="col-input form-control" value="',data.sender_pmt_notes,'" readOnly="true">'].join('');  
                                                },
                                                title:'Notes'
                                            },
                                            {
                                                className:'total',
                                                data:function(data,a,b){
                                                    if(!data.cur) data.cur='$';
                                                    if (!$.isNumeric(data.price)) data.price =0;
                                                    if(!$.isNumeric(data.sender_adjust_amount)) data.sender_adjust_amount =0;
                                                    if (!$.isNumeric(data.forwarding_cost)) data.forwarding_cost = 0 ;
                                                    let fees = $.isNumeric(data.fees)? data.fees:0;
                                                    if ((data.df_payer+'').toLowerCase() =='receiver') fees = 0;
                                                    if(!$.isNumeric(data.cod_fee)) data.cod_fee =0;
                                                    if (!$.isNumeric(data.cod_amount)) data.cod_amount =0;
                                                    let amount_to_sender = parseFloat(data.cod_amount) - parseFloat(fees) - parseFloat(data.forwarding_cost) +  parseFloat(data.sender_adjust_amount);
                                                     
                                                    if (data.sender_pmt_status_id ==1) return ['<span class="currency billing-paid-text">',data.cur,'</span><span class="value billing-paid-text">',amount_to_sender,'</span>'].join('');
                                                    else return ['<span class="bl-currency">',data.cur,'</span><span class="value">',amount_to_sender,'</span>'].join('');
                                                },
                                                title:'Total'
                                            },
                                            {
                                                className:'pmt-status',
                                                data:function(data,a,b){
                                                if (data.sender_pmt_status_id ==1) return ['<span class="billing-paid-text">Paid</span>'].join('');
                                                else return ['<span class="billing-unpaid-text">Unpaid</span>'].join('')
                                                },
                                                title:'Pmt'
                                            },
                                        
                                            //,{
                                            //     className:'col_action',
                                            //     data:function(data,row,display) {
                                            //      let html =['<div class="dropdown">',
                                            //          '<a href="#" data-did="',data.delivery_id,'" data-pid="',data.package_id,'" data-driverid="',data.driver_id,'" data-tknumber="',data.fleet_tracking_number,'" data-statusid="',data.status_id,'" class="btn_spmt_action" aria-haspopup="true" aria-expanded="false">',
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
                                                "emptyTable": "No packages found!"
                                            },
                                            data:data,
                                            columns:my_columns 
                                        ,"createdRow": function(row, data, dataIndex)
                                            {
                                                let tr = $(row);
                                                if(!$.isNumeric(data.sender_adjust_amount)) data.sender_adjust_amount =0;
                                                let fees = $.isNumeric(data.fees)? data.fees:0;
                                                if ((data.df_payer+'').toLowerCase() =='receiver') fees = 0;
                                                if (!$.isNumeric(data.cod_amount)) data.cod_amount =0;
                                                let total_net = parseFloat(data.cod_amount) + parseFloat(data.sender_adjust_amount) - parseFloat(fees) - parseFloat(data.forwarding_cost);
                                                tr.addClass('package_header'); 
                                                tr.data('senderconfirmed',data.sender_confirmed) 
                                                tr.data('pid',data.package_id); //package_id  
                                                tr.data('cursymbol',data.cur); //Currency symbol, usually $
                                                //tr.data('drivertotal',driver_total); //driver_total
                                                tr.data('adjustamount',data.sender_adjust_amount);
                                                tr.data('totalnet',total_net);       
                                                tr.data('did',data.delivery_id); //delivery_id             
                                                //tr.data('tknumber',data.fleet_tracking_number);
                                                tr.data('senderid',data.sender_id); //sender_id
                                                tr.data('statusid',data.status_id);
                                                tr.data('driverpmtstatusid',data.sender_pmt_status_id);

                                                //Ensure that the checkboxes are checked on pages that are NOT being displayed by paginaiton
                                                //Problem solved here is that when user Select All packages, only all packages on first page is checked or selected
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
                                
                                    // let div = $('"_spmt_d_filter_panel');  
                                    // $('"_spmt_tblPackages_wrapper>div.dt-buttons').prepend(div);
                                    

                                                
                                }); //close post_ajax()
                                        
                            };
           
                    //Show Content of Deliveries Tab Panel 
                    this.show = (option)=>{
                       mThis.init(); //Init() will check itself to Execute only once
                        //mThis.self.show().siblings().hide();
                        mThis.displayDeliveryItemsBySender();
                    }

         };
         //end::Deliveries tabview
         
         //begin::Payments tabview
         this.TabPanel_payments = new function(){
            let mThis = this;
            mThis.base_url = $('#__base_url').val();
            this.self = $('#_spmt_panel_payments');
            mThis.tblItems = $('#_spmt_tblPmts');
            
            this.filter_panel = $('#_spmt_filter_panel');
            this.elFilter_trx_startdate = $('#_spmt_filter_pmt_startdate');
            this.elFilter_trx_enddate = $('#_spmt_filter_pmt_enddate');
            this.elFilter_trx_sender = $('#_spmt_filter_pmt_sender');
            this.fileChooser = $('#_spmt_fileChooser');

            this.target_tr= null;

            this.init = ()=>{
                this.fileChooser.hide();
                if (mThis.initialized) return;
                
                SenderTabView.TabPanel_reports.prepareData(null,(ds)=>{
                    ds.unshift({'id':null,'sender_name':'(Choose merchant)'});
                    CommonLib.setComboItems(mThis.elFilter_trx_sender,ds,'id','sender_name',false,null,null);
                    mThis.senders = ds;
                });
                 
                //begin:: Process file upload
                        let reader = new FileReader();
                        reader.onload = function (e) {
                                e.preventDefault();	
                                // console.log(e.total); // file size 
                                //Sanitize photo data or photo stream
                                //var photoData = StringSanitizer.sanitizeOut(e.target.result, 'image');
                                let photoData = e.target.result; //No need to sanitize photo stream because Server will sanitize it anyway
                
                                /* Strip off the image type from the base64 String because when we create image file on Server Photos directory, we need only pure byte stream that represents the image */
                                let base64result = photoData.split(',')[1]; /* strip the type off the base64String" 'data:image/jpeg;base64,'" */
                                /*Get file extention or fileType from the base64 String */
                                let fileType = photoData.split('/')[1].split(';')[0];
                                if (fileType == 'jpeg') fileType = 'jpg'; /* make file extension to 3 characters only */
                                /* Display the selected photo image */
                                //mThis.imgLogo.prop('src', photoData); // putting file in dom without server upload.
                
                                //begin:: start upload image
                                  if (mThis.target_tr) {
                                        var p = {};
                                        p.file_type = fileType;
                                        p.user_class='merchant',
                                        p.trx_id = mThis.target_tr.data('trxid');
                                        p.trx_type =mThis.target_tr.data('trxtype');
                                        p.photo_data = base64result; /* NOTE: base64result contains only base64String ready to converted into image. There is no type information in this string */
                                        
                                        if (!p.trx_id){
                                            cv_interact.alert('trx  ID is not valid');
                                            return;
                                        } 
                                        if (!p.file_type){
                                            cv_interact.alert('file type is not valid');
                                            return;
                                        } 
                                        
                                        post_ajax([mThis.base_url,'/api/saveTransactionPhoto'].join(''),p,function(result) {
                                            if (typeof result =='string') alert(result);  
                                            if (result.status =='OK')
                                            {
                                                //todo: sanitize image_url
                                                mThis.target_tr.find('img.trx-img').attr('src',result.image_url);
                                                //mThis.displayTransactionPhoto(mThis.target_tr,result.image_url); 
                                                //cv_interact.alert('Brand image uploaded');
                                            }
                                            else cv_interact.alert(result.error_message,'','error');
                                        });
                                        mThis.fileChooser.val(null); // reset fileInput value to avoid silence later 
                                  }
                                       
                                //end::end upload image
                                   
                            }

                            //begin:: read file into stream and store in fileRead var => "reader"
                                    mThis.fileChooser.off('change').on('change', function () {
                                        var files = mThis.fileChooser.prop('files');
                                            //Note:  reader.readAsDataURL() triggers the reader.onLoad event above
                                            var file = files[0];
                                            if (file) {
                                                if (file.type.match(/^image\/.*/)) {
                                                    //if (file.size >2000) {
                                                    //    alertify.showWarning('The image file is too big');
                                                    //} else {
                                                    reader.readAsDataURL(file); /*return a data that can be set directly to Image.src property */
                                                    //}
                
                                                } else {
                                                    cv_interact.alert('The chosen image file is invalid!','','error');
                                                }
                
                                            }
                                });
                            //end::read file into stream and store in fileRead var => "reader"

                            mThis.tblItems.on('click','tbody a._spmt_attach',function(e){
                                e.preventDefault();
                                mThis.target_tr = $(this).closest('tr');
                                mThis.fileChooser.trigger('click');
                            });
                //end:: Process file upload

                //Click to delete or remove impage or attachment
                mThis.tblItems.on('click','tbody a._spmt_trx_delete_attachment',function(e){
                    e.preventDefault();
                    cv_interact.confirm('Delete this attachment?','Delete Attachment',(e)=>{
                        if(e){
                            let tr = $(this).closest('tr');
                            mThis.deleteTransactionPhoto(tr);
                        }
                    },'Delete','Cancel','delete');
                });

                //Clicks to delete transaction or payment
                mThis.tblItems.on('click','tbody a._spmt_btn_delete_pmt',function(e){
                  e.preventDefault();
                  let x = $(this);
                  let tr = x.closest('tr');
                  cv_interact.confirm('Delete this cash transaction?','Delete Transaction',function(e){
                      if(e){
                          let trx_type = (tr.data('trxtype')+'').toLowerCase(); 
                          let amount = tr.data('amount');
                          let p = {'trx_id':x.data('trxid'), 'trx_type':trx_type,'amount':amount}; //Legit trx_type = {'disbursement','receipt'}
                          //deleteTransaction() deleteDisbursement, DeletePayment => can delete either disbursement or receipt of payment transactions depening on the encountered type
                          if (trx_type !='receipt' && trx_type !='disbursement') {
                              cv_interact.alert('The provided transaction type is not valid. transaction type must be either "receipt" or "disbursement"');
                              return;
                          }
                          
                          post_ajax([mThis.base_url,'/api/deleteTransaction'].join(''),p,function(err){
                             if (!err || err =='') mThis.displayPaymentsToSender();
                             else cv_interact.alert(err);
                          });
                      }
                  },'Delete','Close','delete');
                });

                mThis.elFilter_trx_sender .on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsToSender();
                });
                mThis.elFilter_trx_startdate .on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsToSender();
                });
                mThis.elFilter_trx_enddate.on('change',function(e){
                    e.preventDefault();
                    mThis.displayPaymentsToSender();
                });
 
              mThis.initialized=true;
            }

            this.displayTransactionPhoto = (tr,image_url)=>{
               if(!tr) return;
                   let img = tr.find('td.attachment img.thumbnail');
                   if (img) {
                       img.prop('src',image_url);
                       //img.addClass('trx-img'); //to set size
                   }
               
               //let trx_id = tr.data('pid');
               
            }

            this.deleteTransactionPhoto = (tr)=>{
                if(!tr) return;
                let trx_id = tr.data('trxid');
                let trx_type = tr.data('trxtype');
                //upload_id is empty because there is always one file photo allowed to be attached
                //NOTE: @user_class is used to find correct directory of image in "public/1_data/merchant/images"
                let p = {'trx_id':trx_id,'trx_type':trx_type,'user_class':'merchant'};
             
                post_ajax([mThis.base_url,'/api/deleteTransactionPhoto'].join(''),p,function(err){
                    if(!err || err ==''){
                       let img = tr.find('img.trx-img');
                       img.prop('src',null);
                       //img.removeClass('trx-img'); //make image size shrink smaller
                    }else cv_interact.alert(err,'Delete Attachment','error');
                }); 
            }

            this.displayPaymentsToSender = function()
            {   
                let p = mThis.getFilterData();
                //getTransactionsBySender() | getTransactionList_merchant()
                post_ajax([mThis.base_url, '/api/getVendorTransactions'].join(''),p,function(data){  
                    if(typeof data =='string') alert(data);
                    if (mThis.table){
                            mThis.tblItems.DataTable().clear().destroy();
                            //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                            mThis.tblItems.empty();
                            //alert('destroyed => '+  mThis.tblItems.html());
                            mThis.table = null;
                    }
                    
                    data = StringSanitizer.sanitizeObject(data,null,['image_url','cur','cashier_name','create_user']); //sanitize except field "cur" currency symbol
                    //begin::Set up columns
                        //let cnt = 1;
                        let my_columns = [ 
                            {
                                className:'payment_date', 
                                data:'payment_date',
                                title:'Payment Date'
                            },
                            {
                            className:'trx_type', 
                            data:function(data,a,b){
                                return data.trx_type; 
                            },
                            title:'Type'
                            },
                            {
                                className:'special_notes', 
                                data:function(data,a,b){
                                    return data.special_notes; 
                                },
                                title:'Description'
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
                                className:'attachment',
                                data:function(data,a,b){
                                      //todo: need to sanitize photo data for better security here
                                      let img_div=null;
                                      if(data.image_url) 
                                        img_div = ['<div class="img thumbnail"><img class="trx-img thumbnail" src="',data.image_url,'" ></img></div><a href="javascript:;" class="_spmt_trx_delete_attachment">Remove</a>'].join('');
                                      else 
                                         image_url ='NA';
                                      return img_div;
                                    }, 
                                title:'Attachment'
                            },
                            {
                                className:'cashier_name',
                                data:'cashier_name', 
                                title:'Booked By'
                            },
                            {
                                data:function(data,a,b){
                                    return ['<div style="display:flex;flex-direction:row">',
                                    //'<span style="display:block;margin-right:20px">',data.barcode,'</span>',
                                    '<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="btn btn-sm btn-outline-primary _spmt_attach"><i class="fa fa-upload" style="font-size:1em;color:green;"></i>Photo</a>',
                                    '&nbsp;<a data-id="',data.id,'" data-trxtype="',data.trxtype,'" data-amount="',data.amount,'" href="javascript:;" class=" btn btn-sm btn-outline-danger _spmt_btn_delete_pmt"><i class="fa fa-times"></i></a>',
                                    '</div>'].join('');
                                },
                                title:''
                            },
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
                                if(!data.trx_id) data.trx_id = data.id;
                                
                                let tr = $(row);
                                tr.data('id',data.trx_id); // payment id or transaction id trx_id
                                tr.data('trxid',data.trx_id);
                                 
                                tr.data('trxtype',data.trx_type); // trx_type  
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
                
                    // let div = $('"_spmt_d_filter_panel');  
                    // $('"_spmt_tblPackages_wrapper>div.dt-buttons').prepend(div);
                    

                                
                }); //close post_ajax()
                        
            };

            mThis.getFilterData = ()=>{
                let p = {'start_date':mThis.elFilter_trx_startdate.val(), 'end_date':mThis.elFilter_trx_enddate.val(), 'sender_id':mThis.elFilter_trx_sender.val()};
                return p;
            }

             this.show = ()=>{
               mThis.init();   
               mThis.displayPaymentsToSender();
             }

            
         }
         //end::Payments tabview

         //begin::Reports tabview
         this.TabPanel_reports = new function(){
            let mThis = this;
            this.self = $('#_spmt_panel_reports');
            this.btnRunReport = $('#_spmt_btnRunReport');

            this.elFilter_report_sender = $('#_spmt_rptfilter_sender');
            this.elFilter_report_start_date = $('#_spmt_rptfilter_start_date');
            this.elFilter_report_end_date = $('#_spmt_rptfilter_end_date');
          
            this.getData =()=>{
                let p = {
                    'report_name':mThis.selected_rpt_name,
                    'sender_id':mThis.elFilter_report_sender.val(),
                    'start_date':mThis.elFilter_report_start_date.val(),
                    'end_date':mThis.elFilter_report_end_date.val(),
                    'sender_name':mThis.elFilter_report_sender.find('option:selected').text()
                };

                if (!p.report_name){
                    cv_interact.alert('No report selected!');
                    return null;
                }
                if (!p.sender_id){
                    cv_interact.alert('No merchant selected!');
                    return null;
                }
                return p;
            }
            this.prepareData = (def ={},onFinish)=>{
                if(!def) def = {}; 
                if (mThis.senders) {
                    //mThis.senders = SenderTabView.TabPanel_deliveries.senders;
                    SenderTabView.TabPanel_payments.senders = mThis.senders;
                    CommonLib.setComboItems(mThis.elFilter_report_sender,mThis.senders,'id','sender_name',false,null,def.driver_id);
                    if(typeof onFinish =='function') onFinish(mThis.senders);
                    return;
                }
               
                post_ajax([mThis.base_url,'/api/getComboItems_sender'].join(''),null,function(rows){ 
                    if(rows){
                        rows = StringSanitizer.sanitizeObject(rows);
                        CommonLib.setComboItems(mThis.elFilter_report_sender,rows,'id','sender_name',false,null,def.driver_id);
                        if(typeof onFinish =='function') onFinish(rows);
                        mThis.senders = rows;
                        SenderTabView.TabPanel_payments.senders = mThis.senders;
                    }
                });
            }

            this.init = ()=>{
               if(mThis.initialized) return;
               mThis.prepareData();
               this.reportItems = $('#_spmt_report_list');
               
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
                    let params = ['rtype=',p.report_name,'&wid=',p.warehouse_id,'&senderid=',p.sender_id,'&startdate=',p.start_date,'&enddate=', p.end_date,'&dtype=',p.delivery_type,'&sendername=',p.sender_name,'&statusid='].join('');
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
 //end::SenderTabView
 

//begin::PayToVendorDialog_driver
 var PayToVendorDialog = new function(){
     let mThis = this;
     this.self = $('#_spmt_dlgPayToVendor');
     this.btnOK = $('#_spmt_dlgPayToVendor_btnOK');
     this.elTitle = $('#_spmt_dlgPayToVendor_title');
     this.elPayee_name = $('#_spmt_pv_payee_name');
     this.elPackageCount = $('#_spmt_pv_package_count');
     
     this.elAmountDue = $('#_spmt_pv_amount_due');
     this.elAmount = $('#_spmt_pv_amount');
     this.elNotes = $('#_spmt_pv_des');
     this.elPmtMethod = $('#_spmt_pv_pmt_method');
     
     this.elError = $('#_spmt_pv_error');

     this.btnOK.on('click',(e)=>{
       e.preventDefault();
       let p = {
           'payee_id':mThis.payee_id?mThis.payee_id:mThis.sender_id,
           'payee_name':mThis.elPayee_name.val(),
           'amount_due':mThis.elAmountDue.val(),
           'packages':mThis.packages, //array of {'package_id','adjust_amount','adjust_notes'} to be update to table "pacakage"   
           'amount':mThis.elAmount.val(),
           'pmt_method':mThis.elPmtMethod.val(),
           'payee_type':mThis.payee_type,
           'pmt_type':mThis.pmt_type,
           'notes':mThis.elNotes.val(),
           'ids':mThis.ids
       };
       
       let amount = mThis.elAmount.val(); 
       if (amount <=0 || !amount) {
        mThis.elError.html('Amount is not correct');
        return;
       }
        if(!p.payee_id) {
          mThis.elError.html('Payee identity is not correct!');
          return;
       }
      
        if(!p.pmt_method) {
            mThis.elError.html('Payment method is required!');
            return;
        }

        let amount_due = mThis.elAmountDue.val();
       if (Number(amount) > Number(amount_due)) {
           mThis.elError.html('It seems over payment');
           return;
       }

       if (Number(amount) < Number(amount_due)) {
            mThis.elError.html('Amount of payment must be ' + mThis.elAmountDue.val());
            return;
       }
       mThis.self.modal('hide');
       if (typeof mThis.onClose =='function') mThis.onClose(p);
     });

     this.show = (option,onClose)=>{
        mThis.elError.html(null);
        mThis.elTitle.html(option.title);
        mThis.onClose = onClose;
        mThis.elAmountDue.val(option.total);
        mThis.elPayee_name.val(option.payee_name);
        mThis.elPackageCount.val(option.package_count);

        mThis.packages = option.packages;
        mThis.ids = option.ids;
        mThis.payee_type = option.payee_type;
        mThis.pmt_type = option.pmt_type,
        mThis.payee_id = option.sender_id;
        mThis.sender_id = option.sender_id;
        mThis.payee_type = option.payee_type;

        mThis.self.modal({
            backdrop:'static'
        }).on('shown.bs.modal',()=>{
            mThis.elAmount.val(mThis.elAmountDue.val());
            mThis.elAmount.focus();
        });
     }
 }
//end::PayToVendorDialog_driver

//begin::FilterDialog_spmt Vendor Billing / Merchant Billing / Merchant payments/ Sender payments filter Dialog
var FilterDialog_spmt = new function(){
    let mThis = this;
    this.self = $('#_spmt_dlgFilter');
    this.elTitle = $('#_spmt_dlgFilterTitle');
    this.btnOK = $('#_spmt_dlgFilter_btnOK');
    //this.body = $('#_spmt_dlgFilter>div.modal-body');
    this.lblDriverName = $('#_spmt_filter_sender_name'); 

    this.getData = ()=>{
        let p = {};
        //start popupate filter data from Dialog fields (Package Status, Driver pmt status, startdate, enddate)
        mThis.self.find('.spmt_filter_field').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            p[dataMember] = el.val();  
        });

        let panel = SenderTabView.TabPanel_deliveries;
        p.sender_id = panel.elFilter_sender.val();
        p.warehouse_id = panel.elFilter_warehouse.val();
        panel.elSearchPackage.val(null);
        p.search_value ='';
        // if (!p.sender_pmt_status_id) {
        //     cv_interact.alert('It seems the filter data are not correct');
        //     console.log('It seems the filter data are not correct. Please check the css class "spmt_filter_field" in file SenderPaymentComponent.blade.php');
        //     return null;
        // }
        return p;
    }
    this.btnOK.on('click',(e)=>{
        e.preventDefault();
        mThis.self.modal('hide');
        let p = mThis.getData();
        let xp = SenderTabView.TabPanel_deliveries;
        p.warehouse_id = xp.elFilter_warehouse.val();
        p.driver_id =  xp.elFilter_sender.val();
        if (typeof mThis.onClose =='function') mThis.onClose(p);
    });

    this.show = (op={}, onClose)=>{
        mThis.elTitle.html(op.title);
        mThis.onClose = onClose;
        mThis.lblDriverName.text(op.sender_name);
        mThis.self.modal({
            backdrop:'static'
        });
    }
} 
//end::FilterDialog_spmt

$(document).ready(function(){
    SenderPaymentComponent.init();
});
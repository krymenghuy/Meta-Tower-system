'use strict'
var PickupListComponent = new function() {
    let mThis = this;
    this.form_data = null;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_lnkPickupListComponent');
    this.base_url = $('#__base_url').val();
    this.btnNewRequest = $('#_pl_btnNewPickup');
    this.elSearchPickup = $('#_pl_search');
    //Click to start searching pickup list
    this.btnSearch = $('#_pl_btnSearch');

    this.btnToggleFilter = $('#_pl_btnToggleFilter');
    //this.filterPanel = $('#_pl_filter_panel');

    this.btnPrint = $('#_pl_btnPrint');
    this.btnPDF = $('#_pl_btnPDF');
 
    
    //this.elDate = $('#_pl_requestdate');
    this.tblPickups = $('#_pl_tblPickups');
  
    //this.tblPickups_body = $('#_pl_tblPickups_body');
    
    this.orderCreated_eventHandler = (d)=>{
        //let d = d.data;
        //alert(JSON.stringify(d));
        toastr.info(d.data.message);
        //mThis.findRow_packageDetail(@trip_id, @barcode) returns a html row (tr) that contains the package detail for updating Status Text
        if(mThis.tblPickups.is(':visible')) {
           //todo:display pickup request (refresh)
           let filter_status_id = FilterDialog_pickup.elFilter_status.val();
           //refresh pickup list ONLY WHEN the current filter_status is "Available for Pickup"
           if (filter_status_id ==1 || filter_status_id ==-1)  mThis.live_addOrderRow(d.data); 
        }
    }
 
    this.init = function() {
        mThis.pickup_dropdown_menu = mThis.tblPickups.find('div.dropdown-menu');
          if (main_view.MULTI_WAREHOUSE_OP==1)
            {
                //mThis.elFilter_warehouse.parent().show(); //Warehouse filter field on "Pickup Center"
                PerformPickupDialog.elToWarehouse.parent().show();// Receiving Warehouse field on "PerformPickupDialog"  
                VerifyPackageDialog.elToWarehouse.parent().show();  // Receiving Warehouse field on "VerifyPackageDialog"  
            }
          else 
             {
                //mThis.elFilter_warehouse.parent().hide();
                PerformPickupDialog.elToWarehouse.parent().hide();
                VerifyPackageDialog.elToWarehouse.parent().hide(); 
             }

          FilterDialog_pickup.loadFilterData();

           //## begin::listen to Event Notifier
                      //window.Laravel = {'csrfToken': '{{csrf_token()}}'};
                            //   let branch_id = $('meta[name="sess_branch_id"]').attr('content');
                            //   let user_id = $('meta[name="sess_user_id"]').attr('content'); 
                        //let channel_name = ['backend.',main_view.branch_id,'.',main_view.user_id].join('');

                        window.Echo.private(main_view.backend_channel_name).listen('.merchant_created_order', (d)=>{ 
                            mThis.orderCreated_eventHandler(d);
                        });
                        
                        window.Echo.private(main_view.backend_channel_name).listen( '.driver_accepted_order',(d) =>{
                            let data = d.data;
                            toastr.success(DUtil.escapeHtml(data.message));
                            if(mThis.tblPickups.is(':visible')){
                                let tr = mThis.findRowByOrdderId(data.order_id);
                                //d = {order_id,order_code,status_id,status,completed,branch_id, sender_id,merchant_id}
                                mThis.updatePickupStatus(tr,data);
                            }
                          
                        });

                        window.Echo.private(main_view.backend_channel_name).listen( '.order_status_changed',(d) =>{
                            let data = d.data;
                            toastr.success(DUtil.escapeHtml(data.message));
                            if(mThis.tblPickups.is(':visible')){
                                let tr = mThis.findRowByOrdderId(data.order_id);
                                //d = {order_id,order_code,status_id,status,completed,branch_id, sender_id,merchant_id}
                                mThis.updatePickupStatus(tr,data);
                            } 
                        });
                       
 
            //   window.Echo.channel('public-channel-test').listen('.onMessageReceived',(data)=>{
            //     toastr.success('new order created => testing here ' + JSON.stringify(data));
            //   });

         
           //## end::Listen to Event Notifier

        //   mThis.filterPanel.on('change','.dl_filter_field',function(e){
        //     mThis.displayPickupList();
        //   });

         mThis.btnPrint.on('click',function(e){
            let d = FilterDialog_pickup.getData(); 
            let params = ['rtype=pickuplist&wid=',d.warehouse_id,'&date=',d.date,'&search=',mThis.elSearchPickup.val(),'&sid=',d.sender_id,'&dtype=',d.delivery_type,'&stid=',d.status_id].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
            });
           
         }); 
  
         this.btnPDF.on('click',function(e){
            //let op = {'title':'Pickup List','title_color':'black','start_col_index':1};
            //pdfReport.viewPDF('_pl_tblPickups',op);
            pdfReport.htmlToPdf('_pl_tblPickups');
         });
 
         mThis.btnToggleFilter.on('click',()=>{
            FilterDialog_pickup.show(null,(d)=>{
               if(d){
                   mThis.displayPickupList(d);
               }
            });
         });

         mThis.btnSearch.on('click',(e)=>{
             mThis.displayPickupList();
         });

        //   mThis.elFilter_date.on('change',function(e){
        //     mThis.displayPickupList();
        //   });

        //   mThis.elFilter_sender.on('change',function(e){
        //      mThis.displayPickupList();
        //   });

        //   mThis.elFilter_status.on('change',function(){
        //     mThis.displayPickupList();
        //   });

          mThis.elSearchPickup.on('keyup',function(e){
              if(e.keyCode ==13) {
                  mThis.displayPickupList();
              }
          });

          mThis.elSearchPickup.on('change',function(e){
            if(!$(this).val()) {
                mThis.displayPickupList();
            }
          });

       //##BEGIN:: tblPickups dropdown menu
                mThis.tblPickups.on('click','a.btn_pickup_action',function(e) {
                    e.preventDefault();
                    let p = $(this).parent();
                    let x = $(this);
                     
                    let order_id = x.data('orderid');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let sender_id = x.data('senderid'); 
                    let status_id = x.data('statusid');
           
                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                      
                    p.append(mThis.createDropdownMenuHtml_pickup(order_id,sender_id,status_id));
                      dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
            
                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let x = mThis.tblPickups.find('div.dropdown-menu'); 
                    let container =  x.parent();
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            mThis.tblPickups.find('div.dropdown-menu').removeClass('show');
                        }
                    }
                });
                 
                mThis.tblPickups.on('mouseover','tbody>tr',function(e){
                   let col_action = $(this).find('td.col_action');
                   col_action.find('a.btn_pickup_action>i').addClass('action-button-zoomin');
                     
                 }).on('mouseleave','tbody>tr',function(e) {
                     let col_action = $(this).find('td.col_action');
                     col_action.find('a.btn_pickup_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });

      //##END:: tblPickups dropdown menu
         
       //manage Expanded view for List of Packages
       mThis.tblPickups.on('click','tbody>tr.order_header',function(e){
            let tr = $(this);
            //let order_id = tr.data('orderid');
            //let order_status_id = tr.data('statusid');
            let btn_pickup_action = tr.find('td.col_action .btn_pickup_action');
            let dropdown_menu = tr.find('td.col_action div.dropdown-menu');
            let quick_action_buttons = tr.find('td.col_requestdate div.pkl-quick_action_buttons');
            if(!btn_pickup_action.is(e.target) && btn_pickup_action.has(e.target).length ===0) {
                    //display package list when user click on row (tr) Except clicking on btn_pickup_action 
                    if (!dropdown_menu.is(e.target) && dropdown_menu.has(e.target).length ===0)
                    {
                         if (!quick_action_buttons.is(e.target) && quick_action_buttons.has(e.target).length ===0) mThis.createPackageList(tr); 
                    }
            }
       });
        
        mThis.btnNewRequest.on('click',function(e){
            let option = {'title':'New Pickup Request'};
            let onClose = (d)=>{
                mThis.displayPickupList();
            };

            PickupRequestDialog.show(option,onClose);
            // PickupDialog.show(option,function(d){
            //     if(d){
            //          mThis.displayPickupList();
            //     }
            // });
        });

        mThis.tblPickups.on('click','a._pol_status',function(e){
            e.preventDefault();
            let lnk = $(this);
            let tr = lnk.closest('tr');
            let order_id = lnk.data('orderid'); 
            let def_status_id = lnk.data('statusid');

            let sender_name = tr.find('td.col_sender').text();
            //let driver_name = tr.find('td.col_driver').text();
            let order_code = tr.find('td.col_order_code').text();
            let driver_id = tr.data('driverid');
            let order = {'order_id':order_id,'order_code':order_code,'sender_name':sender_name,'driver_id':driver_id,'status_id':def_status_id};
            // mThis.changePickupStatus(order,lnk); 
            PickupStatusDialog.show(order,function(d){
                //if(e) mThis.displayPickupList();
                if (d){
                    tr.data('driverid',d.driver_id);
                    let td = tr.find('td.col_driver');
                    if(d.deriver_id ==0 || !d.driver_id) d.driver_name ='NA';
                     td.html(d.driver_name);
                    mThis.updatePickupStatus(tr,d);
                    // lnk.data('statusid',d.status_id);
                    // //Change status in dropdown-menu
                    // let div_dropdown = tr.find('td.col_action div.dropdown');
                    // div_dropdown.find('div.div_dropdown-menu').data('statusid',d.status_id);
                    // div_dropdown.find('a.btn_pickup_action').data('statusid',d.status_id);
                    // //Change status color
                    // let el = lnk.find('span.order_status');
                    // el.css('color',mThis.getPickupStatusColor(d.status_id));
                    // el.text(d.status); 
                }
             });
        });
 
         //Admin user changes Driver (for the sake of Correction or Updating only)
         mThis.tblPickups.on('click','a._pl_pa_change_driver',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let tr = x.closest('tr');
            let order_id = x.data('orderid');
            let status_id = x.data('statusid');
            let p = {'order_id':order_id,'status_id':status_id};
            if (status_id ==0) {
                cv_interact.alert('Cannot change driver because this pickup request is canceled!');
                return;
            }  
            if (!order_id || order_id ==0) {
                cv_interact.alert('Invalid order identity');
                return;
            } 

            let option = {'title':'Change Driver','dataLabel':'Select new driver','valueMember':'id','textMember':'driver_name','data':mThis.form_data.drivers,'blankErrorMessage':"Please choose one driver"};
            InputBox2.show(option,function(d){
                if(d){
                    p.driver_id = d.value; /** d.value = driver id and d.text = driver name **/
                    post_ajax([mThis.base_url,'/api/changePickupDriver'].join(''),p,function(err){
                        if(!err) {
                            tr.data('driverid',d.value);
                            tr.find('td.col_driver').text(d.text);
                            //mThis.displayPickupList();
                        } else cv_interact.alert(err,'','error');
                    });
                }
            });
            
        });

        //Admin user assigns a driver to pick up packages. This is like Admin user acts on behalf of driver to accept pickup request
        mThis.tblPickups.on('click','a._pl_pa_assign_driver',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let tr = x.closest('tr');
            let order_id = x.data('orderid');
            let status_id = x.data('statusid');
            let p = {'order_id':order_id,'status_id':status_id};
            if (status_id ==0) {
                cv_interact.alert('Cannot assign driver because this pickup request is canceled!');
                return;
            }
            if (!order_id || order_id ==0) {
                cv_interact.alert('Invalid order identity');
                return;
            }
            let option = {'title':'Assign Driver (Pickup)','dataLabel':'Select a driver','valueMember':'id','textMember':'driver_name','data':mThis.form_data.drivers,'blankErrorMessage':"Please choose one driver"};
            InputBox2.show(option,function(d){
                if(d){
                    p.driver_id = d.value; /** d.value = driver id and d.text = driver name **/
                    post_ajax([mThis.base_url,'/api/assignPickupDriver'].join(''),p,function(result){
                        if(result) {
                            if(result.status =='OK') {
                                let statusInfo = StringSanitizer.sanitizeObject(result.statusInfo);
                                tr.data('driverid',d.value);
                                tr.find('td.col_driver').text(d.text);
                                mThis.updatePickupStatus(tr,statusInfo);
                                //mThis.displayPickupList();
                            } else cv_interact.alert(result.error_message,'','error');
                        }
                        
                    });
                }
            });
            
        });

          //Admin user perform pickup on behalf of driver
          mThis.tblPickups.on('click','a._pl_pa_perform_pickup',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let order_id = x.data('orderid');
            let status_id = x.data('statusid');
            let sender_id = x.data('senderid');
            let p = {'order_id':order_id,'status_id':status_id};
            //let sender_name ='';

            let onDone = (d)=>{
               return;
            }

            if (status_id ==0) {
                cv_interact.alert('The pickup request has been canceled!','','warning');
                return;
            }
            if (status_id !=1 && status_id !=2) {
                cv_interact.alert('The pickup request has been served already','','info');
                return;
            } 
            let option = {'title':'Perform Pickup','order_id':order_id,'tr_row':x.closest('tr'),'sender_id':sender_id};
            PerformPickupDialog.show(option,onDone);
        });
 
        //Delete pickup transaction
        mThis.tblPickups.on('click','a._pl_pa_delete',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let order_id = x.data('orderid');
            let status_id = x.data('statusid');
            let p = {'order_id':order_id,'status_id':status_id};
             cv_interact.confirm('Delete this pickup transaction?','Delete Pickup',function(e){
                 if(e) {
                    post_ajax([mThis.base_url,'/api/deletePickup'].join(''),p,function(err){
                        if(!err || err =='') {
                            mThis.displayPickupList();
                        }else cv_interact.alert(err);
                    });
                 }
             },'Delete','Cancel','delete');
        });

        //Change pickup Status
        mThis.tblPickups.on('click','a._pl_pa_change_status',function(e){
            e.preventDefault();
            let lnk = $(this);
            let tr = lnk.closest('tr');
            let div_menu = lnk.closest('div.dropdown-menu');
            let order_id = div_menu.data('orderid'); 
            let def_status_id = div_menu.data('statusid');

            let sender_name = tr.find('td.col_sender').text();
            //let driver_name = tr.find('td.col_driver').text();
            let order_code = tr.find('td.col_order_code').text();
            let driver_id = tr.data('driverid');
            
            let order = {'order_id':order_id,'order_code':order_code,'sender_name':sender_name,'driver_id':driver_id,'status_id':def_status_id};
           
            // mThis.changePickupStatus(order,lnk); 
            PickupStatusDialog.show(order,function(d){
                //if(e) mThis.displayPickupList();
                if (d){
                    tr.data('driverid',d.driver_id);
                    if(d.deriver_id ==0 || !d.driver_id) d.driver_name ='NA';
                    tr.find('td.col_driver').html(d.driver_name);
                    mThis.updatePickupStatus(tr,d);
                    // tr.data('statusid',d.status_id);
                    // div_menu.data('statusid',d.status_id);
                    // //Change status color
                    // let el = tr.find('td.col_order_status a.order_status');
                    // el.css('color',mThis.getPickupStatusColor(d.status_id));
                    // el.text(d.status)
                    
                }
             });
        });
 
        //Edit pickup
        mThis.tblPickups.on('click','a._pl_pa_modify',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let order_id = x.data('orderid');
            let status_id = x.data('statusid');
            let lnk = x.closest('tr').find('td.order_status>a');

            let option = {'title':'Edit Pickup Details','order_id':order_id};
            PickupDialog.show(option,function(e) {
                if(e) {
                    mThis.displayPickupList();                 
                }
            });
        });

        /**** Remove the following comment if you need to Dropdown menu "Receive Packages" ****/
        //  //"Verify Packages" is same as "Receive Packages" at Warehouse => packages' status would change to "Arrived At Warehouse"
        //  mThis.tblPickups.on('click','a._pl_pa_verify_packages',function(e){
        //     e.preventDefault();
        //     let x = $(this).parent();
        //     let order_id = x.data('orderid');
        //     let status_id = x.data('statusid');
        //     let sender_id = x.data('senderid');
        //     //let lnk = x.closest('tr').find('td.order_status>a');
        //     //3 = Picked, 4 = Picked and Booked
        //     if (status_id < 3) {
        //         cv_interact.alert('This pickup request is not yet picked up','','warning');
        //         return;
        //     }
        //     if (status_id >4) {
        //         cv_interact.alert('These packages are already received at Warehouse','','warning');
        //         return;
        //     }
 
        //     let back_option ={'title':'Pickup Center'};
        //     let op = {'title':'Receive Pacakges','order_id':order_id,'allow_find_sender':false,'prev_component':mThis,'prev_component_option':back_option,'form_data':mThis.form_data};
        //     ReceivePackageComponent.show(op,(d)=>{
        //         if(d){
        //             mThis.displayPickupList();
        //         } 
        //     }); 

        //     // let onDone = (d)=>{
        //     //     mThis.displayPickupList();
        //     // }
        //     // let option = {'title':'Verify/Receive Packages','order_id':order_id,'sender_id':sender_id};
        //     // VerifyPackageDialog.show(option,onDone);
        // });
 
          //On table.pkl-package-list-table (package list for each Order)=> when any SELECT field or TEXT field changes value  
          mThis.tblPickups.on('change','.col-input',function(e){
            let input= $(this);
            let td = input.closest('td');
            let col_name = td.data('field');
            let tr = td.closest('tr');
            td.data('value',input.val());
            //let el = tr.find(['td.',col_name,' .col-input'].join(''));

            //Set service price or delivery prices
            if (col_name =='size' || col_name =='actual_kg') {
                PickupRequestDialog.setBilledKg(tr);     
            }else if (col_name=='receiver_phone') {
                //ensure there is no space in phone number
                let phone = (tr.find('td.receiver_phone .col-input').val()+'').replace(' ','');
                td.data('value',phone);
                input.val(phone);
            }
            mThis.setDeliveryPrices_item(tr);
          });
           
          this.setDeliveryPrices_item = (tr)=>{
            if(!tr) return;
            let p = mThis.getItem(tr);
            p.sender_id = tr.data('senderid');
            //let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};
            post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
                if(d){
                    let cod_amount =0;
                    let cod_fee = 0;
                    let delivery_fee =0;
                    let base_fee =0;

                    d = StringSanitizer.sanitizeObject(d);
                    //EditableTable.setCellValue(tr,'zone_code',d.zone_code);
                    EditableTable.setCellValue(tr,'base_fee',d.base_fee);
                    EditableTable.setCellValue(tr,'delivery_fee',Number(d.delivery_fee).toFixed(2));
                    let price = EditableTable.getCellValue(tr,'price',true);
                    let cod = EditableTable.getCellValue(tr,'cod',true);
                    base_fee = EditableTable.getCellValue(tr,'base_fee',true);
                    delivery_fee = EditableTable.getCellValue(tr,'delivery_fee',true); 

                    if(cod==0) 
                       EditableTable.setCellValue(tr,'cod_fee',0);
                    else {  
                      cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent/100;
                      EditableTable.setCellValue(tr,'cod_fee',Number(cod_fee).toFixed(4));
                    }   
                    //NOTE: 'fees' column display driver_total, not sender_total, not total service fees (or total delivery fees)
                    let fees = base_fee + delivery_fee + cod_fee;
                    //let taxi_fee = EditableTable.getCellValue(tr,'forwarding_cost',true); //apply to Sender only, Not driver
                    let total = fees + cod_amount; //total driver
                    EditableTable.setCellValue(tr,'fees',Number(total).toFixed(2));

                //     //error_span is html element <span class="error_text"> for display error text
                //     if (d.status =='Error') {
                //       //EditableTable.handlePriceError(tr,d,error_span);
                //    } 
              }
            });
          }

          mThis.tblPickups.on('click','a.pkl_btn_delete',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            mThis.deleteItem(tr); 
          });
          
          mThis.tblPickups.on('click','a.pkl_btn_save',function(e){
            e.preventDefault();
             let tr = $(this).closest('tr');
             let p = mThis.getItem(tr);
             p.order_id = tr.data('orderid');
             p.package_id = tr.data('id');
             p.sender_id = tr.data('senderid');
             //alert(JSON.stringify(p));
             post_ajax([mThis.base_url,'/api/saveOrderPackageDetails'].join(''),p,function(result){
                 if(typeof result =='string') console.log('error in api/saveOrderPackageDetails() => '+ result);
                 if(result.status =='OK') {
                     if(result.data.delivery_type) console.log('Problem in api/saveOrderPackageDetails() because tis method returns delivery_type (result.data.delivery_type) as NULL or empty');
                     result.data.delivery_type =result.data.delivery_type.toLowerCase();
                     result.data = StringSanitizer.sanitizeObject(result.data);
                     tr.data('id',result.data.package_id);
                    mThis.setItemReadOnly(tr,false,result.data);
                 }else cv_interact.alert(result.error_message,'','error'); 
             });
          });

          mThis.tblPickups.on('click','a.pkl_btn_cancel_edit',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            mThis.setItemReadOnly(tr,true,null); 
          });

          mThis.tblPickups.on('click','a.pkl_btn_edit',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            mThis.beginEditItem(tr); 
          });

          mThis.tblPickups.on('click','a.pkl_btn_add_package',function(e){
            e.preventDefault();
            let x = $(this);
            let tr = x.closest('tr');
            let order_id = x.data('orderid');
            let sender_id = x.data('senderid');
            let table = tr.closest('table.pkl-package-list-table');
            if(table) {
                let row = {'status_id':1,'delivery_type':'normal','zone_name':null,'receiver_phone':null,'price':0,'cod':1,'fees':0,'receiver_address':null,'cod':1,'base_fee':0,'delivery_fee':0,'actual_kg':0,'billed_kg':0};
                row.sender_id = sender_id;
                row.order_id = order_id;
                let edit_mode = true;
                mThis.addItemRow(table,row,true,edit_mode); 
            }
          });

          mThis.tblPickups.on('click','td.col_requestdate a.pkl_btn_pick',function(e){
                e.preventDefault();
                let lnk = $(this)
                let order_tr = lnk.closest('tr.order_header'); 
                mThis.pickItems(order_tr,function(success){
                     if (success) lnk.hide();  
                });
          });

          mThis.tblPickups.on('click','td.col_requestdate a.pkl_btn_receive',function(e){
             e.preventDefault(); 
             let lnk = $(this);
             let order_tr = lnk.closest('tr.order_header'); 
             mThis.receiveItems_all(order_tr,null);
             
            //  let p ={}; //mThis.getItems();
            //  //alert(JSON.stringify(p));
            //  if (!p) return;
            //  if (!p.pickup_date) p.pickup_date =null; 
            //  if (!p.driver_id) p.driver_id = 0;
            //  p.allow_create_order =1; /* @allow_create_order is used in context of Receiving packages that do not have pre Pickup Request from seller and so the goods are NOT picked up by driver. Usually the goods are brought in Warehouse by Seller themselves */ 
            //  //NOTE: "ReceivePackages" is same as "Verify Packages" when those packages arrive at Warehouse 
            //  p.packages = mThis.getItems();
            //  post_ajax([mThis.base_url,'/api/receivePackages'].join(''),p,function(result){
            //     alert(JSON.stringify(result)); //here
            //  });

          });

         //Convert to Pickup Delivery
        //  mThis.tblPickups.on('click','a._pl_pa_verify_packages',function(e){
        //     e.preventDefault();
        //     let x = $(this).parent();
        //     let order_id = x.data('orderid');
        //     let status_id = x.data('statusid');
        //     let lnk = x.closest('tr').find('td.order_status>a');
            
        //     let option = {'title':'Verify Packages','order_id':order_id};
        //     PickupDialog.show(option,function(e) {
        //         if(e) {

        //         }
        //     });
        // });

        //Clear search box to avoid annoying Browser's auto complete
        mThis.elSearchPickup.val(null);
    }//end:: init()
    
    //receive or verify package | verifyPackage | ReceivePackages Verify packages
    this.receiveItems_all = (tr, onFinish = null)=>{
        let p = {};
        let order_id = tr.data('orderid');
        let sender_id = tr.data('senderid');
        p.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        p.order_id = order_id;
        p.sender_id = sender_id; 
        //if (!p.pickup_date) p.pickup_date =null; 
        //if (!p.driver_id) p.driver_id = 0;
        p.allow_create_order =0; /* @allow_create_order is used in context of Receiving packages that do not have pre Pickup Request from seller and so the goods are NOT picked up by driver. Usually the goods are brought in Warehouse by Seller themselves */ 
        //NOTE: "ReceivePackages" is same as "Verify Packages" when those packages arrive at Warehouse 
        p.packages = mThis.getItems(tr);
        if (!p.packages[0]) {
            cv_interact.alert('មិនឃើញមានកញ្ចប់ទំនិញ');
            return;
        }

        post_ajax([mThis.base_url,'/api/receivePackages'].join(''),p,function(result){
            if (typeof onDone =='function') onFinish(result);
            else //if onDone = null then => process result and show informative message to user
            {
                if(result) {

                    //In case use click on print bar code button in order to save each package
                     if (result.error_message) {
                         cv_interact.alert(result.error_message,'','error');
                         return;
                     }
                    if (result.error_count > 0) {
                    let i=0,c;
                    let html = null;
                    do{
                        c = result.errors[i];
                        if(!c) break;
                        html = [html,'<li><span style="color:green;font-weight:bold">',c,'</span></li>'].join('');
                        i++;
                    }while(c);
                    if(html) html = ['<ul>',html,'</ul>'].join('');
                    cv_interact.alert(html,'','warning'); 
                    }
                     else if (result.success_count >0) 
                    {
                        //NOTE: hideOrderRow() hide delivery_order row => hide order_header row will also hide package_list row as well
                        mThis.hideOrderRow(tr); 
                        cv_interact.alert(['<span style="font-weight:bold;color:green">',result.success_count,' packages received!'].join(''),'','success');
                    }
                    else  cv_interact.alert(['<span style="font-weight:bold;color:red">',result.success_count,' packages received'].join(''),'','warning');     
                     
                }
             }
        });
    }
    this.hideOrderRow = (tr)=>{
        if(!tr) return;
        let next_tr = tr.next();
        //let order_id = tr.data('orderid');
        if (next_tr.hasClass('package_list')) {
           //if (order_id == next_tr.data('orderid')) 
           next_tr.hide();
        }
        tr.hide(); 
    }
    //On Pickup Center tblPickups => PickPackages | Pick Packages | Pick Items | Pick and Book items | Pick and Book packages
    //@tr is the "<tr.order_header"
    this.pickItems = (tr,onFinish)=>{
        if (!tr || tr.length===0) return;
        let p = {'packages':mThis.getItems(tr)};
        p.pickup_date = null;
        p.order_id = tr.data('orderid');
        p.driver_id = null; // use driver_id from table "order".driver_id
        post_ajax([mThis.base_url,'/api/pickOrderPackages'].join(''),p,function(result){
            if(typeof result =='string') console.log(result);
            //alert(JSON.stringify(result));
            if (result.status =='OK') {
                let d = StringSanitizer.sanitizeObject(result.data);
                //cv_interact.alert('Pickup succeeded','','info');
                //@d = {'status_id':d.status_id,'status':d.status,'completed':d.completed}
                mThis.updatePickupStatus(tr,d);
                if (typeof onFinish =='function') onFinish(true);
                //todo: refresh display of driver here
            } else {
                if (typeof onFinish =='function') onFinish(false);
                cv_interact.alert(result.error_message,'','error');
            }
        });
    }

    //deletePackage()
    this.deleteItem = (tr)=>{
        if (!tr || tr.length===0) return;
      let id = tr.data('id'); 
      let status_id = tr.data('statusid');
      let order_id = tr.data('orderid');
      let package_id = tr.data('id'); //pid pacakge_id

      if (status_id > 5) {
          cv_interact.alert('Cannot delete this package','','warning');
          return;
      }
      if (!package_id) 
        tr.remove();
      else{
          cv_interact.confirm('Delete this package?','Delete Package',function(e){
              if(e){
                  let p = {'order_id':order_id,'package_id':package_id};
                  post_ajax([mThis.base_url,'/api/deleteOrderPackage'].join(''),p,(result)=>{
                      if(result.status=='OK') {
                         tr.remove();
                         // mThis.createPackageList(tr,table,false);
                         //mThis.setQty(result.order_id,result.package_count);

                      }else cv_interact.alert(result.error_message);
                  });
                 
              }
          },'Delete Now','Cancel');
      }
    }

    //order_id => table.pl-package-list-table. if (table_or_order_id is table) => directly add row to the table 
    //@is_table =true means the var "table_or_order_id" is a table element, otherwise, it is treated as "order_id" 
    //AddItemRow() is to add packageRow() or add package to pkl-package-list-table (Expanded view in tblPickups)
    this.addItemRow = (table_or_order_id,d,is_table=true,edit_mode =false)=>{
      let display_cols =['delivery_type','zone_name','receiver_phone','price','df_payer','fees','receiver_address','cod','base_fee','delivery_fee','size','actual_kg','billed_kg'];  
      let pTable =null;
      if(is_table==true) 
         pTable = table_or_order_id;
      else //if (table_or_order_id is a number that represent order_id)
         pTable = mThis.getPackageListTable(table_or_order_id);
      let tbody = pTable.find('tbody');
      let i=0,c;
      let html_row = null;
      do{
        c = display_cols[i];
        if(!c) break;
         let val =null;
         if (c !='size') val = StringSanitizer.sanitizeOut(d[c]); 
         else val = DUtil.sanitizePackageSize(d[c]);

         let iType ='text';
         if(['delivery_type','df_payer','cod'].indexOf(c)>=0) iType='select';
         else if (c=='zone_name') iType='select2';
         else if (c=='receiver_phone') iType='phone';
         else if (['delivery_fee','base_fee','price','fees','actual_kg','billed_kg'].indexOf(c) >=0) iType='number';

         let disp_value =val;
         //Transform from Value to display value for SELECT fields
         if (c=='cod') {
            disp_value = 'Yes';
            if(val==0) disp_value ='No';
         }else if (c=='zone_name' || c== 'zone_code') 
         {
            val = d.zone_code; 
            disp_value = d.zone_name;
         }else if (c=='delivery_type')
            disp_value = DUtil.properCase(d.delivery_type);
         else if (c =='size') 
             disp_value = DUtil.getFriendlySize(d.size); //d.size is supposed to be "22 30, 20.7"    
         //else if (c=='fees' || c=='total')
            let readOnly = "0"; //not used for determining ReadOnly. the array readOnlyFields = ['fees','base_fee','delivery_fee'] in function mThis.beginEditItem() is used for this purpose
            html_row = [html_row,'<td data-value="',val,'" data-field="',c,'" data-readonly="',readOnly,'" data-inputtype="',iType,'" class="',c,'">',disp_value,'</td>'].join('');
        i++;
      }while(c); 
    
      if(!d.id) d.id = d.package_id;
      let td_action = ['<td class="col_action">',
      //(d.status_id <5)? '<button class="btn btn-sm btn-outline-success pkl_btn_receive"><i class="fa fa-check"></i></button>':null,
      (d.status_id <=5)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash" style="color:red"></i></a>':null,
      (d.status_id != 11)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fa fa-edit" style="color:green"></i></a>':null,
      ,'</td>'].join('');
      let tr_id = DUtil.createGUID();

      html_row =['<tr id="',tr_id,'" data-orderid="',d.order_id,'" data-senderid="',d.sender_id,'" data-id="',d.id,'" data-statusid="',d.status_id,'" class="pkl-package-row pkl_"',d.id,'>',td_action,html_row,'</tr>'].join('');
      tbody.prepend(html_row);
      let new_tr = tbody.find('tr#'+tr_id);
      //Put the tr row in edit mode id @edit_mode ==true
      if (edit_mode)mThis.beginEditItem(new_tr);  
    }
    
    //@tr is tr.package_list => previous tr is "<tr.order_header ..."
    this.setQty = (tr)=>{
      if (!tr) return;  
      let prev_tr = tr.prev();
      if(prev_tr){
          if(prev_tr.hasClass('order_header')) {
            let x = tr.find('table.pkl-package-list-table>tbody>tr').length;  
            prev_tr.find('td.col_qty>span.package_count').text(x);
          }
      }  
     
    }

    this.getPackageListTable = (order_id)=>{
       let h_tr = mThis.tblPickups.find(['tr.order_',order_id].join(''));
       if(!h_tr) return null;
       let p_tr = h_tr.next();
       if(!p_tr){
           return mThis.createPackageList(h_tr,[],2,true); // create package list table silently
       }else{
           if(p_tr.hasClass('package_list')){
               let tbl = p_tr.find('table.pkl-package-list-table');
               return tbl; 
           }else {
             return mThis.createPackageList(h_tr,[],2,true); // create package list table silently
           }
       }
    }
    
    //popuplate item or packages in the pkl-package-list-table (in expanded view within tblPickups)
    //displayPackageList in within tblPickups (expanded View)
    this.displayItemList = (order_id,sender_id,table,packages=[])=>{
      if(!table) return;
      let p = {'order_id':order_id};
     let tbody = table.find('tbody');
      tbody.empty();
      post_ajax([mThis.base_url,'/api/getOrderPackageList'].join(''),p,function(packages){
          if(packages) {
                let i =0,c;
                do{
                c = packages[i];
                if(!c) break;
                    c.order_id = order_id;
                    //c.sender_id = sender_id;
                    mThis.addItemRow(table,c,true); 
                i++;
                }while(c);

                let div_wrapper = table.closest('div.package_list_wrapper');
                let l = div_wrapper.find('tr.pkl-info');
                if (i ==0) {
                    if(!l) div_wrapper.append(['<tr class="pkl-info"><td style="border:none"><div style="color:orange;font-size:0.9em">មិនទាន់បញ្ចូលកញ្ចប់ទំនិញ</div></td></tr>'].join(''));
                }else {
                    if(l) l.remove(); 
                }   
          }
         
      });
    }
 
    //getData() returns array of packages | getPackages()
    this.getItems =(header_tr)=>{
        if(!header_tr) return null;
        let order_id = header_tr.data('orderid');
        let prev_tr = header_tr.next();
        if (prev_tr.hasClass('package_list') && prev_tr.data('orderid') == order_id) {
            let tbl = prev_tr.find('table.pkl-package-list-table');
            let row_index = 0;
            let rows = []; 
            tbl.find('tbody>tr').each(function(){
                let row = mThis.getItem($(this));
                if(row) rows.push(row);
                row_index++;
            });
            return rows;
        } 
        return []; //No packges found 
    }

    //getData() returns object represent package to be save or updated (Pickup Center > Package List)
    //@tr is package row
    this.getItem = (tr)=>{
        let i = 0 ;
        let p = {};
        let reqiured_fields = ['delivery_type','receiver_phone','zone_name','df_payer','cod']
        let is_editing_mode = tr.data('editing'); // 0,1

       if (is_editing_mode ==1 || is_editing_mode==true) {
        tr.find('td').each(function(){
            let td = $(this);
            td.removeClass('td-has_error');  
            if(i>0){
                let f = td.data('field');
                let el = td.find('.col-input');
                p[f] = el.val();
            
                if(f=='delivery_type') 
                   p.delivery_type = DUtil.properCase(p.delivery_type);
                else if (f=='zone_name') 
                    p.zone_code =p[f];
                else if (f=='size') {
                    if (p.size) {
                        p.size = DUtil.processPackageSize(p.size);
                        if(!p.size)  {
                            td.addClass('td-has_error'); //error the supplied @size is not valid format
                            return null;
                        }
                    } 
                }
                 
                if(reqiured_fields.indexOf(f)>=0) {
                    if(!p[f]){
                         td.addClass('td-has_error');
                         return null;
                    }
                }
            }
            i++;
          });
         return p;
       } 
       else //if the row @tr is NOT in editing mode => it is in (view mode) 
       {
        tr.find('td').each(function(){
            let td = $(this);
            td.removeClass('td-has_error');  
            if(i>0){
                let f = td.data('field');
                p[f] = td.data('value');
                if(f=='delivery_type') 
                   p.delivery_type = DUtil.properCase(p.delivery_type);
                else if (f=='zone_name') 
                   p.zone_code =p[f];
                else if (f=='size'){
                    if (p.size) {
                        p.size = DUtil.processPackageSize(p.size);
                        if(!p.size)  {
                            td.addClass('td-has_error'); //error the supplied @size is not valid format
                            return null;
                        }
                    } 
                }
                
                if(reqiured_fields.indexOf(f)>=0) {
                    if(!p[f]){
                         td.addClass('td-has_error');
                         return null;
                    }
                }
            }
            i++;
          });
       } //close:: if not editing mode 
       return p ;  
    }

    //Set package row readOnly
    //@refresh = true => retrieve data from db again
    this.setItemReadOnly = (tr,refresh=false, data)=>{
        if(refresh) data= null;
        let pid = tr.data('id');
        let order_id = tr.data('orderid');
        let p = {'package_id':pid,'order_id':order_id};
        if (!pid || pid <=0) {
            tr.remove();
            return;
        }

        let index = 0; 
        if (!refresh) {
            let status_id = tr.data('statusid');
            if(!status_id) status_id =1;
            
            //If not data is supplied => use existing values that are entered by users
            data = data?data:mThis.getItem(tr);
            if(!data) data ={};

            tr.find('td').each(function(e){
                let td = $(this);
                let col_name = td.data('field');
                if(index ==0) {
                    let html_buttons =[
                        (status_id <=5)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash" style="color:red"></i></a>':null,
                        (status_id !=11)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fa fa-edit" style="color:green"></i></a>':null].join('');
                        td.empty();
                        td.append(html_buttons);
                }else {
                   
                    //let el = td.find('.col-input');
                    let val = data[col_name];
                    let disp_value = val;
                    
                    if(col_name=='cod') {
                        disp_value='Yes';
                        if(data.cod==0) disp_value ='No';
                    }else if (col_name =='zone_name' || col_name =='zone_code') {
                        disp_value = data.zone_name;
                        val = data.zone_code;
                    }else if (col_name=='delivery_type') {
                        val = data.delivery_type
                        disp_value = DUtil.properCase(data.delivery_type);
                    }else if (col_name =='size') 
                    {
                            if (!data.size || typeof data.size =='string')
                               disp_value = DUtil.getFriendlySize(data.size);
                            else {
                                val = [data.size.width,' ',data.size.length,' ',data.size.height].join('');
                                disp_value= DUtil.getFriendlySize(val);
                            }   
                    }
                    
                    td.empty();
                    td.data('value',val);
                    td.text(disp_value);
                }
                index++;
            });
            tr.data('editing',0); //Set editing flag to 0 (false)
            return;
        }

        //in case of refreshing data from db again
        post_ajax([mThis.base_url,'/api/getOrderPackageDetails'].join(''),p,function(d){
            if(d){
                //let size =  StringSanitizer.sanitizeObject(d.size); 
                d = StringSanitizer.sanitizeObject(d);
                //d.size = size; 
                if (!d.status_id) d.status_id =1;
                tr.find('td').each(function(e){
                    let td = $(this);
                    if(index ==0) {
                        let html_buttons =[
                            (d.status_id <=5)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash" style="color:red"></i></a>':null,
                            (d.status_id !=11)? '&nbsp;<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fa fa-edit" style="color:green"></i></a>':null].join('');
                        td.empty();
                        td.append(html_buttons);
                    }else {
                        let col_name = td.data('field');
                        let val = d[col_name];
                        let disp_value = val;
                        if (col_name=='cod') {
                            val = d.cod;
                            disp_value = 'Yes';
                            if(val==0) disp_value ='No';
                        } else if (col_name=='zone_name' || col_name=='zone_code') {
                            val = d.zone_code;
                            disp_value = d.zone_name;
                        }else if (col_name=='delivery_type'){
                            val = d.delivery_type;
                            disp_value = DUtil.properCase(d.delivery_type);
                        }else if (col_name =='size') 
                            disp_value = DUtil.getFriendlySize(d.size);
                      

                        td.empty();
                        td.data('value',val);
                        td.text(disp_value);
                    }
                    index++;
                });
            }
        });
       
    }
    //Convert table row (package list table row) into Edit mode
    this.beginEditItem = (tr,data)=>{
      let readOnlyFields = ['fees','base_fee','delivery_fee'];
      let i =0; 
      if(!tr) return;
      if (!data) data = mThis.getItem(tr);
      if(!data.status_id) data.status_id =1;
      
      //If there is another row being edittd then => set that row to be in view-only mode
      if (mThis.pkl_prev_editing_row) {
         if (mThis.pkl_prev_editing_row.data('id') != tr.data('id')) {
            if (!mThis.getItem(tr)) return; 
            let refresh_from_database = false;
            if (!mThis.org_item_data) refresh_from_database = true; //If no original data when users click on Cancel Edit then retrieve paclage's data from database again 
            mThis.setItemReadOnly(mThis.pkl_prev_editing_row,refresh_from_database,mThis.org_item_data);
         } 
      }

      tr.find('td').each(function(e){
        let td = $(this);
        let col_name = td.data('field');
        
        if (i==0) {
            let html_buttons;  
            html_buttons = ['<a href="javascript:void(0)" class="pkl_btn_cancel_edit" style="color:orange"><i class="fa fa-times"></i></a>',
            '&nbsp;<a href="javascript:void(0)" class="pkl_btn_save" style="color:green"><i class="fa fa-save"></i></a>'].join('');
          
          td.empty();
          td.append(html_buttons);
        }

        if(i>0) {

            let val = data[col_name]; // td.data('value');
            let disp_value = val;

            //process display values for some coluns (COD, )
            if(col_name=='cod'){
                disp_value ='Yes';
                if (val ==0) disp_value ='No';
            }else if (col_name=='zone_name'){
                val = data.zone_code;
                disp_value = data.zone_name;
            }else if (col_name=='delivery_type') {
                  disp_value = DUtil.properCase(disp_value); 
            }
            else if (col_name=='size') 
            {         disp_value = null;
                      if (typeof val =='string') 
                        disp_value = DUtil.getFriendlySize(val);
                      else if (val) //this case: the size is expectedly to be a json object
                       {
                         val = [val.width,' ',val.length,' ',val.height].join('');
                         disp_value = DUtil.getFriendlySize(val);
                       }
            }
            td.empty();
            let inputType = td.data('inputtype');
            let input_html;
            let is_readOnly = null;
            let readOnly =0; // td.data('readonly'); /* 0,1*/
            if (readOnlyFields.indexOf(col_name)>=0) readOnly ==1;
            if(readOnly ==1){
               if(!inputType || inputType =='number' || inputType =='phone' || inputType =='email' || inputType =='input') 
                  is_readOnly =" readonly";
               else if (inputType =='select' || inputType =='select2') is_readOnly =" disabled";
            }

            if(inputType=='number')
              input_html = ['<input type="number" class="form-control col-input" value="',val,'" style="min-width:150px" ',is_readOnly,'>'].join('');
            else if (inputType=='select2')
                input_html = ['<div><select class="col-input" style="min-width:150px" ',is_readOnly,'></select></div>'].join('');
            else if (inputType=='select')
               input_html = ['<select class="form-control col-input" style="min-width:150px" ',is_readOnly,'></select>'].join('');
            else if (inputType=='phone')
               input_html = ['<input type="text" class="form-control col-input" value="',val,'" style="min-width:150px" ',is_readOnly,'>'].join('');      
            else //if (inputType=='text')
               input_html = ['<input type="text" class="form-control col-input" value="',val,'" style="min-width:220px" ',is_readOnly,'>'].join('');  
            td.append(input_html);
            let field_name = td.data('field');

            //If td->data-inputtype ="select" then check each field_name and add SELECT options accordingly
            if (inputType=='select') {
                let el = td.find('select.col-input');
                el.empty();
                let items;
                let def = null;

                if(field_name =='cod') {
                    items = [{'id':1,'text':'Yes'},{'id':0,'text':'No'}];
                    def = data.cod;
                    if(!def) def =1; 
                  }else if(field_name =='delivery_type'){
                    items = [{'id':'normal','text':'Normal'},{'id':'fast','text':'Fast'}];
                    def = data.delivery_type? (data.delivery_type+'').toLowerCase():null;
                    if(!def) def ='normal';
                  }
                  else if(field_name =='df_payer'){
                    items = [{'id':'Sender','text':'Sender'},{'id':'Receiver','text':'Receiver'}];
                    def = data.df_payer;
                    if(!def) def ='Sender';
                  }
                  if(items) CommonLib.setComboItems(el,items,'id','text',false,null,def);
                  if(field_name =='df_payer' || field_name=='cod') {
                      td.data('value',def);
                  }; 

            } else if (inputType =='select2'){
                if(inputType =='select2') {
                    //select.select2 is placed within a div => "<div>select.select2..." within <td>
                    let e = td.find('select.col-input');
                     e.empty();
                     //If td->data-inputtype ="select2" then check each field_name and add SELECT options accordingly 
                     //Add zone list to SELECT2 box
                     if(field_name =='zone_name'){
                         let zone_code = td.data('value');
                         if(!mThis.form_data) {
                            mThis.form_data= {};
                            mThis.form_data.zones = [];
                            console.error('Error at PickupListComponent.js => this.beginEditItem() => problem: "mThis.form_data" is NULL ');
                         };
                         CommonLib.setComboItems(e,mThis.form_data.zones,'zone_code','zone_name',false,null,zone_code);
                     }
                      e.select2({
                        width:'100%'
                      });
                }
            }
           
        }
        i++;
      });
      tr.data('editing',1); //set editing flag to 1(true)   
      //remember the previous editing row (tr)
      mThis.pkl_prev_editing_row = tr; 
      //remember previous data row in editing mode, so that when user clicks Cencel Edit => it is faster to refverse to orginal data (@mThis.org_item_data) row without retrieving from database again.  
      mThis.org_item_data = data; 
    }

    //@show_mode =0 (Normal), 1 (force_show) , 2(hidden) "Create package_list but do not show"
    //force = Must show the package list
    //Normal=> if currently Visble then hide, if currently hidden then Show
    //Hidden => create package list table but do not show
    this.createPackageList = (tr,show_mode=0,return_table = false)=>{
        if (!tr) return;
        if(!tr.hasClass('order_header')) return;
        let order_id = tr.data('orderid');
        let sender_id = tr.data('senderid');
        let p_tr = tr.next();
         
        if(p_tr.hasClass('package_list')) {
           if (show_mode==1) {
               p_tr.show();
               p_tr.data('senderid',sender_id);
               mThis.displayItemList(order_id,sender_id,p_tr.find('table.pkl-package-list-table'));
               mThis.prev_ptr = p_tr;
               mThis.showQuickButtons(tr,true);
           }else if (show_mode == 0) {
              if(p_tr.is(':visible')) {
                p_tr.hide();  
                mThis.showQuickButtons(tr,false);
              }
              else {
                if(mThis.prev_ptr) mThis.prev_ptr.hide();  
                p_tr.show();
                p_tr.data('senderid',sender_id);
                mThis.displayItemList(order_id,sender_id,p_tr.find('table.pkl-package-list-table'));
                mThis.prev_ptr = p_tr;
                mThis.showQuickButtons(tr,true);
              }
           }
        } else {
            //let order_id = tr.data('orderid');
            if(mThis.prev_ptr)  mThis.prev_ptr.hide();  
            let tr_id = ['_pkl_',DUtil.createGUID()].join('');
            let  pl_wraper_id = ["_pkl_wrapper_",order_id].join('');
            let thead_html =['<thead><tr>',
            '<th>',
            '<a data-senderid="',sender_id,'" data-orderid="',order_id,'" href="javascript:void(0)" style="font-weight:bold;display:block;width:50px" class="pkl_btn_add_package"><i class="fa fa-plus" style="color:green"></i> Add</a>',
            //'&nbsp;&nbsp;<a data-senderid="',sender_id,'" data-orderid="',order_id,'" href="javascript:void(0)" style="color:green;font-weight:bold" class="pkl_btn_receive">Receive</a>',
            '</th>',
            '<th>TYPE</th>',
            '<th>ZONE</th>',
            '<th>RECEIVER PHONE</th>',
            '<th>PRICE</th>',
            '<th>FEE PAYER</th>',
            '<th>FEES</th>',
            '<th>RECEIVER ADDRESS</th>',
            '<th>COD</th>',
            '<th>BASE FEE</th>',
            '<th>ADDITIONAL</th>',
            '<th>SIZE</th>',
            '<th>ACTUAL KG</th>',
            '<th>BILLED KG</th>',
            '</tr></thead>'].join('');
            let p_list = ['<tr id="',tr_id,'" data-orderid="',order_id,'" data-senderid="',sender_id,'" class="package_list"><td colspan="12"><div id="',pl_wraper_id,'" class="flat-box package_list_wrapper"><table class="pkl-package-list-table animate-slide-down">',thead_html,'<tbody></tbody></table></div></td></tr>'].join('');
            tr.after(p_list);
            mThis.prev_ptr = mThis.tblPickups.find('tbody>tr#'+tr_id);
            if(show_mode==2) mThis.prev_ptr.hide(); 
            //Usually when show_mode =2 (Silent) => needs to create new instance of plk-package-list-table and return its instance for inserting new row of package
            let new_tbl = mThis.prev_ptr.find('table.pkl-package-list-table');
            mThis.displayItemList(order_id,sender_id,new_tbl);
            mThis.showQuickButtons(tr,true); 
            if(return_table==true) return new_tbl;
        }
        
    }
    
    //showQuickActionButtons for pickup list => quick buttons are "Pick" and "Arrive" buttons
    this.showQuickButtons = (tr,show_it)=>{
         let sender_id = tr.data('senderid');
         let order_id = tr.data('orderid');
         let status_id = tr.data('statusid');
         if (mThis.prev_quick_buttons)  mThis.prev_quick_buttons.hide();   
         //begin::display quick action buttons (Pick | Arrive)
               //d@tr is header row <tr.order_header ..
               let td  = tr.find('td.col_requestdate');
               let dx = td.find('div.pkl-quick_action_buttons');
               if (dx.length >0) 
                {
                   if (status_id >3) dx.find('.pkl_btn_pick').hide(); else dx.find('.pkl_btn_pick').show();
                   if (show_it)
                   {   
                    // dx.addClass('animate-slide-down').delay(5000).queue(function(){
                    //      $(this).removeClass('animate-slide-down');
                    // });
                    dx.show();
                    //Remember the reviously displayed Quick Buttons panel, so when a new tr.order_header is clicked => then hide this previously display Quick buttons
                    mThis.prev_quick_buttons = dx;
                   } else dx.hide(); 
                   return;
                }
        
               //if (p_tr.is(':visible')){
                if (show_it){
                    td.prepend(['<div id="pkl_quick_buttons_',order_id,'" class="pkl-quick_action_buttons">',
                     (status_id <3)? ['<a href="javascript:void(0)" data-senderid="',sender_id,'" data-orderid="',order_id,'" class="pkl_btn_pick">Pick</a>'].join(''):null,
                     (status_id <5)? ['&nbsp;<a href="javascript:void(0)" data-senderid="',sender_id,'" data-orderid="',order_id,'" class="pkl_btn_receive" style ="color:green">Arrive</a>'].join(''):null,
                    '</div>'].join(''));
                    let dx = td.find('#pkl_quick_buttons_' + order_id);
                    mThis.prev_quick_buttons = dx;
                    //if(status_id >=3)  mThis.prev_quick_buttons.find('a.pkl_btn_pick').hide();
                }    
                   
               //}
           //end::display quick action buttons (Pick | Arrive)
    }

    this.show = (option)=>{
        mThis.elScreenTitle.html(option.title);
        mThis.displayPickupList();
        mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }
        this.getPickupStatusColor = (status_id)=>{
            if(status_id ==0) return '#E6C45B';
            else if (status_id ==1) return '#29E0D4';
            else if (status_id ==2) return '#20A3C8';
            else if (status_id ==3) return '#69E7DB';
            else if (status_id ==4) return 'green';
            else return '#E8570F';
        }
 
    //<tr.order_header ...
    //@status_info = {status_id,satatus,completed}
    this.updatePickupStatus = (tr,status_info)=>{
        if(!tr || !status_info) return;
        let div_dropdown = tr.find('td.col_action div.dropdown');
        let el = div_dropdown.find('a.btn_pickup_action');
        
        el.data('statusid',status_info.status_id);
        el = div_dropdown.find('div.dropdown-menu');
        el.data('statusid',status_info.status_id);
        tr.data('statusid',status_info.status_id); 
        tr.data('completed',status_info.completed);

        el = tr.find('td.col_order_status span.order_status');
        //set css color of status Link (a) text
        el.css('color',mThis.getPickupStatusColor(status_info.status_id));
        el.text(status_info.status);
         
        //This update not very necessary for user's action 
        el = tr.find('td.col_order_status a');
        el.data('statusid',status_info.status_id);

        //Update display of Special Status => value from table `order`.completed
        let div = tr.find('td.col_order_code').find('div.pl-order-special-status');
        //td.col_order_code > div > div.div.pl-order-special-status >  span class="@cls_special_order_cass"
        div.empty();
        let cls_special_order_class = mThis.getSpecialStatusClass(status_info.status_id);
        div.append(['<span class="',cls_special_order_class,'"></span>'].join(''));

        if (!status_info.driver_name) status_info.driver_name ='NA'; 
        if (status_info.driver_name){
            tr.data('driverid',status_info.driver_id);
            tr.find('td.col_driver').text(status_info.driver_name);
        } 
      } 

    // this.changePickupStatus = (order,lnk)=>{
       
    //     // let option = {
    //     //     'title':'Order Status',
    //     //     'valueMember':'id',
    //     //      'textMember':'name', 
    //     //     'data':[{'id':1,name:'Pending'},{'id':2,name:'Accepted'},{id:3,name:'Picked'},{id:4,name:'Arrived at Warehouse'},{id:5,name:'Partially Done'},{id:6,name:'Done'}]
    //     //     ,'dataLabel':'Select status',
    //     //     'blankErrorMessage':'Please select one status',
    //     //     'okBtnText':'OK',
    //     //     'defaultValue': def_status_id
    //     // };
       
    //     // InputBox2.show(option,function(d){
    //     //     if(d){
    //     //         let p = {'order_id':order_id,'driver_id':driver_id,'status_id':d.value};
                
    //     //         post_ajax([mThis.base_url,'/api/updateOrderStatus'].join(''),p,function(err) {
    //     //           if(!err || err =='') {
    //     //               //alert(lnk.data('statusid'));
    //     //               lnk.css('background-color','red'); 
    //     //               lnk.attr('statusid',d.value); //Change Status_id in data-status attribute of the Status link
                      
    //     //               lnk.find('span').text(d.text);
    //     //             } 
    //     //         });
    //     //     }
    //     // });
    // }
     
    this.createDropdownMenuHtml_pickup = function(order_id, sender_id, status_id) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-orderid="',order_id,'" data-senderid="',sender_id,'" data-statusid="',status_id,'">',
          '<a class="dropdown-item _pl_pa_assign_driver" href="#"><i class="fa fa-biking"></i> Assign Driver (Pickup)</a>',
          '<a class="dropdown-item _pl_pa_perform_pickup" href="#"><i class="fa fa-shipping-fast"></i> Perform Pickup</a>',
          //'<a class="dropdown-item  _pl_pa_verify_packages" href="#"><i class="fa fa-clipboard-check" style="color:green"></i> Verify Packages (Arrive At Warehouse)</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _pl_pa_delete" href="#"><i class="fa fa-trash" style="color:red"></i> Delete Pickup</a>',
          //'<a class="dropdown-item _pl_pa_modify" href="#"><i class="fa fa-edit" style="color:green"></i> Modify Pickup Info</a>',
          '<a class="dropdown-item _pl_pa_change_status" href="#"><i class="fa fa-edit" style="color:blue"></i> Change Status</a>',
          '<a class="dropdown-item _pl_pa_change_driver" href="#"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
          '</div>'].join('');
          return html;
    };
    
    //filter = {'date','sender_id','delivery_type','status_id','search_value'}
    this.displayPickupList = function(filter,search_mode = false)
    { 
        let p = {};
        if (filter) 
          p = filter;
        else {
          p = FilterDialog_pickup.getData();
        }
        p.search_value = mThis.elSearchPickup.val();

        //if search_value NOT NULL then search_mode ==1, therefore use only search_value to query the pickup list
        //p.search_mode = (search_mode)==true?1:0;

        //important => status_id = null = > All Status, 0 => Canceled Requests
        post_ajax([mThis.base_url, '/api/getPickupList'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            if (mThis.table){
                 
                    mThis.tblPickups.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblPickups.empty();
                    //alert('destroyed => '+  mThis.tblPickups.html());
                    mThis.table = null;
                
            }
              
            data = StringSanitizer.sanitizeObject(data,[':']);
            
            //begin::Set up columns
                let cnt = 1;
                let my_columns = [
                    {
                        // data:function(data,type,meta) {
                        //     return cnt++;
                        // },
                        // title:'NO.'
                        className:'col_action',
                        data:function(data,row,display) {
                         let html =['<div class="dropdown">',
                             '<a href="#" data-orderid="',data.order_id,'" data-senderid="',data.sender_id,'" data-statusid="',data.status_id,'" class="btn_pickup_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        className:"col_requestdate",
                       data:function(data,a,b) {
                           return ['<span class="pl-request_date">',data.request_date,'</span>',
                           '<span class="pl-request_time">',data.request_time,'</span>'].join('');
                       },
                       title:'Request Date'
                    },
                    {
                        className:"col_order_code",
                        data:function(data,a,b){
                            let cls_special_status_class = mThis.getSpecialStatusClass(data.status_id);
                            return ['<div><div class="pl-order-special-status"><span class="pl-order-special-status-text ',cls_special_status_class,'"></span></div><span class="pl-order_code">',data.order_code,'</span></div>'].join('');
                        },
                        title:'Order ID'
                        // ,data:function(data,type,meta){
                        //     $(td).data('studentcode',data.student_code);
                        //     return ['<input value="',data.student_code,'" />'].join('');
                        // }
                    },
                    // {
                    //     data:function(data,type, meta) { return ['<div style="min-width:200px">',data.name_native,'</div>'].join(''); },
                    //     title:'Name'
                        
                    // },
                    {
                      className:"col_sender",
                      data:'sender_name',
                      title:'Merchant Name'
                    },
                    {
                        className:"col_delivery_condition",
                        data:'delivery_condition',
                        title:'Condition'
                    },
                    {
                        className:"col_vehicletype",
                        data:'request_vehicle_type',
                        title:'Vehicle Type'
                    },
                    {
                        className:"col_producttype",
                        data:'product_type',
                        title:'Product Type'
                    },
                    {
                        className:"col_qty",
                        data:function(data,a,b){
                            return ['<div style="display:flex;flex-direction:row"><span class="package_count" style="display:inline-block;width:50%">',data.qty,'</span>&nbsp;<span class="pk-badge-delivery_type" style="display:inline-block;">',data.delivery_type,'</span></div>'].join('');
                        }, 
                        title:'Num of Packages'
                    },
                    {
                        className:"col_pickup_address",
                        data:'pickup_address',
                        title:'Pickup Address'
                    },
                    // {
                    //     data:'driver_code',
                    //     title:'Driver ID'
                    // },  
                    {
                        className:"col_driver",
                        data:function(data,a,b) {
                            return data.driver_name?data.driver_name:'NA';
                        },
                        title:'Driver'
                    }, 
                    {
                        className:"col_order_status",
                        data:function(data,type,meta) {
                            if (!data.order_status || data.order_status =='') data.order_status ='?';
                            return ['<a class="order_status _pol_status" data-statusid="',data.status_id,'" data-orderid="',data.order_id,'" data-senderid="',data.sender_id,'" href="#"><span class="order_status" style="color:',mThis.getPickupStatusColor(data.status_id),'">',data.order_status,'</span></a>'].join('');
                        },
                        title:'Status'
                    }
                    
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblPickups.DataTable({
                searching:false,
                destroy:true,
                paging:true,
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
                        "emptyTable": "No orders found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          let tr = $(row);
                          tr.addClass('order_header');
                          tr.addClass('order_'+data.order_id);
                          tr.data('orderid',data.order_id); //order_id
                          tr.data('completed',data.completed);
                          tr.data('statusid',data.status_id);
                          tr.data('driverid',data.driver_id); //driver_id
                          tr.data('senderid',data.sender_id); //sender_id
                      }

                //    ,"cellCreated":function(td,data,colIndex) {
                //        alert('test');
                //      if(colIndex==9){
                //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                //         $(td).html(html); 
                //      }
                //   }      								
            });
           				  
        }); //close post_ajax()
                 
    };

    //Given a @order_id, returns a row element (tr) as jquery object
    this.findRowByOrdderId = (order_id)=>{
        let tbody = mThis.tblPickups.find('tbody');
        let tr = tbody.find(['tr.order_',order_id].join(''));
        return (tr.length ===0)? null:tr;
    }

    /** liveUpdate| live| autoUpdate| auto update | live_update_addOrderRow() |socket **/
    this.live_addOrderRow = (d)=>{
 
        if(!d.order_id) d.order_id = d.id;
        if(!d.order_code) d.order_code = d.code;
        if(!d.vehicle_type) d.vehicle_type = d.request_vehicle_type;

        //merchant_id is used instead of d.sender_id, which is ID of merchant or vendor becasue 
        //sender_id was used to identitfy user who sends the event in server mthod Notifier::notify_admin() 
         /**           
                          tr.addClass('order_'+data.order_id);
                          tr.data('orderid',data.order_id); //order_id
                          tr.data('completed',data.completed);
                          tr.data('statusid',data.status_id);
                          tr.data('driverid',data.driver_id); //driver_id
                          tr.data('senderid',data.sender_id); //sender_id
          * **/ 
        let css_display_order =['order_',d.order_id].join('');
        let html_tr = [
            '<tr class="order_header ',css_display_order,' odd" role="row" data-orderid="',d.order_id,'" data-senderid="',d.merchant_id,'" data-completed="',d.completed,'" data-statusid="',d.status_id,'" data-driverid="',d.driver_id,'">',
                '<td class="col_action sorting_1">',
                 '<div class="dropdown">',
                     '<a href="#" data-orderid="',d.order_id,'" data-senderid="',d.merchant_id,'" data-statusid="',d.status_id,'" class="btn_pickup_action" aria-haspopup="true" aria-expanded="false"><i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i></a></div></td>',
                     '<td class=" col_requestdate"><span class="pl-request_date">',d.request_date,'</span><span class="pl-request_time">',d.request_time,'</span></td>',
                     //pl-order-status-1 supposed to be dynamic as "pl-order-status-{status_id}"
                     '<td class=" col_order_code"><div><div class="pl-order-special-status"><span class="pl-order-special-status-text pl-order-status-1"></span>',
                     '</div><span class="pl-order_code">',d.order_code,'</span></div></td>',
                '<td class=" col_sender">',d.sender_name,'</td>',
                '<td class=" col_delivery_condition">',d.delivery_condition,'</td>',
                '<td class=" col_vehicletype">',d.vehicle_type,'</td>',
                '<td class=" col_producttype">',d.product_type,'</td>',
                '<td class=" col_qty"><div style="display:flex;flex-direction:row"><span class="package_count" style="display:inline-block;width:50%">3</span>&nbsp;<span class="pk-badge-delivery_type" style="display:inline-block;">',d.delivery_type,'</span>',
                '</div></td>',
                '<td class=" col_pickup_address">',d.pickup_address,'</td>',
                '<td class=" col_driver">',d.driver_name,'</td>',
                '<td class=" col_order_status"><a class="order_status _pol_status" data-statusid="',d.status_id,'" data-orderid="',d.order_id,'" data-senderid="',d.merchant_id,'" href="#"><span class="order_status" style="color:#29E0D4">',d.status,'</span></a></td>',
                '</tr>'].join('');
              mThis.tblPickups.find('tbody').prepend(html_tr); 
    };

    this.getSpecialStatusClass = (status_id)=>{
        let cls_completed = 'pl-order-pending'; //Picked but not yet arraived warehouse
        if(status_id ==5) 
             cls_completed ='pl-order-status-5'; //status_id = 5 => "Arrived At Warehouse"
        else {
            if (status_id ==2 || status_id ==1 || status_id ==0) cls_completed ='pl-order-status-'+status_id;
        }
        return cls_completed;     
    }
 
}
 
//begin::PickupStatusDialog
 var PickupStatusDialog = new function(){
    let mThis = this;
    this.self = $('#_pl_dlgPickupStatus');
    this.btnOK = $('#_pl_ps_btnOK');

    this.elSenderName = $('#_pl_ps_sender_name');
    this.elOrderCode = $('#_pl_ps_order_code');
    this.elOrderId = $('#_pl_ps_order_id');

    this.elDriver = $('#_pl_ps_driver');
    this.elStatus = $('#_pl_ps_status');
    this.elNotes = $('#_pl_ps_notes');
    this.elError = $('#_pl_ps_error');
 
    this.btnOK.on('click',function(e){
      e.preventDefault();
      let status_id = mThis.elStatus.val();
      let driver_id = mThis.elDriver.val();
 
      if (status_id ==1) {
        driver_id = null;
      } 
      else if (status_id ==2) //Accepted for picking up
      {
         if (!driver_id || driver_id <=0)
         {
             mThis.elError.text('Accepted by which driver?');
             return;
         }
      } 
      else if (status_id ==3) //Packages picked by a driver
       {
        if (!driver_id || driver_id <=0) {
            mThis.elError.text('Picked by which driver?');
            return;
        }
     }  
     else if (status_id ==4) 
     {
         //status_id =3 = > Arrive At Warehouse/Office =? how it arrived? by driver or merchant brings it to the Office
        if (!driver_id || driver_id <=0) {
             // "Arrived At Office" but no "driver_id" => That means Package is brought in by Seller of some other means (No driver picked it up from seller's palce) 
        }
     } 
     else if (status_id ==5 || status_id ==6) //Order is fullfilled (partially Fullfilled or Fullfilled)
     {

     } 
    //  else if (status_id ==0) // Order is canceled by Admin
    //  {
    //     //driver_id = null;
    //  } 
        
            /* mThis.order_id = mThis.option.order_id */
            let p = {'order_id':mThis.order_id,'driver_id':driver_id,'status_id':status_id};
                post_ajax([mThis.base_url,'/api/updateOrderStatus'].join(''),p,function(result) {
                  if(result.status=='OK') {
                      //p.driver_name = mThis.elDriver.find('option:selected').text();
                      //p.status = mThis.elStatus.find('option:selected').text();
                      let x ={};
                      x.driver_id = result.driver_id;
                      x.driver_name = result.driver_name;
                      x.status = result.status_name;
                      x.status_id = result.status_id;
                      //if (!driver_id || driver_id <=0) p.driver_name ='NA';
                    //   if (status_id ==1) {
                    //       p.driver_name ='NA';
                    //       p.driver_id = null;
                    //   } 
                      if(typeof mThis.onClose =='function') mThis.onClose(x);
                      mThis.self.modal('hide');
                      //mThis.option.status_link.attr('statusid',d.value); //Change Status_id in data-status attribute of the Status link
                      //mThis.option.status_link.find('span').text(d.text);
                    } else mThis.elError.text(result.error_message); 
                });
           
    });

    this.show = (order, onClose)=>{
       if(!order) order = {}; 
       mThis.elError.html(null);
       mThis.onClose = onClose;
       mThis.order_id = order.order_id;
       mThis.order = order;
       mThis.form_data = PickupListComponent.form_data;   
      //option.def = {'status_id','driver_id'}  //default value including status_id, driver_id

      mThis.elOrderId.val(order.order_id);
      mThis.elSenderName.val(order.sender_name);
      mThis.elOrderCode.val(order.order_code);
       
       mThis.prepreData(order,()=>{
           mThis.self.modal({
               backdrop:'static'
           });
       }); 
    }

    this.prepreData = (def, onFinish)=>{
        if(!def) def= {};
        if (!mThis.form_data) {
           FilterDialog_pickup.loadFilterData((d)=>{
                mThis.form_data = d;
                if (!mThis.form_data) mThis.form_data = {}; 
                CommonLib.setComboItems(mThis.elStatus,mThis.form_data.order_statuses,'status_id','status_name',true,'(Select status)',def.status_id);
                CommonLib.setComboItems(mThis.elDriver,mThis.form_data.drivers,'id','driver_name',true,'(Select a driver)',def.driver_id);
             
                if (typeof onFinish =='function') onFinish();
           });
        }else{
            CommonLib.setComboItems(mThis.elStatus,mThis.form_data.order_statuses,'status_id','status_name',true,'(Select status)',def.status_id);
            CommonLib.setComboItems(mThis.elDriver,mThis.form_data.drivers,'id','driver_name',true,'(Select a driver)',def.driver_id);
            if (typeof onFinish =='function') onFinish();
        }
      
    }
 }
//end::PickupStatusDialog

//begin::PickupRequestDialog
var PickupRequestDialog = new function() {
    let mThis = this;
    this.self = $('#_pl_dlgPickupRequest');
    this.model_body = $('#_pl_dlgPickupRequest');
    this.base_url = $('#__base_url').val();
    this.elTitle =$('#_pl_dlgPickupRequestTitle');
  
    this.btnAddPackage = $('#_pl_pr_add_package');
    this.btnSaveRequest = $('#_pl_pr_btnSaveRequest');

    this.elOrderId = $('#_pl_pr_order_id');
    this.elOrderCode = $('#_pl_pr_order_code');

    this.elSender = $('#_pl_pr_sender');

    this.elSenderId = $('#_pl_pr_sender_id');
    this.elSenderName = $('#_pl_pr_sender_name');
    this.elSenderCode = $('#_pl_pr_sender_code');
    this.elSenderId = $('#_pl_pr_sender_id');
    //this.elToWarehouse = $('#_pl_pr_warehouse');

    this.elRequestDate = $('#_pl_pr_request_date');
    this.elPickupDate = $('#_pl_pr_pickup_date');

    this.elVechicleType = $('#_pl_pr_vehicle_type');
    this.elCondition = $('#_pl_pr_delivery_condition');
    this.elDeliveryType = $('#_pl_pr_delivery_type');
    this.elProductType = $('#_pl_pr_product_type');
    this.elPickupAddress = $('#_pl_pr_pickup_address');
    this.elQty = $('#_pl_pr_qty');
    //this.elQty.prop('readOnly',true); //make qty readonly
    this.lnkFindSender = $('#_pl_pr_lnkFindSender');
    this.tblPackages = $('#_pl_pr_tblPackages');
    //this.tblPackages_body = $('#_pl_pr_tblPackages_body');

    this.package_columns = [
       {
           className:"col_action",
           //width:'65px',
           data:function(data,a,b) {
              return ['<div class="form-inline">',
                '<button type="button" class="_pl_pr_print_barcode btn btn-sm btn-outline-primary disabled" data-barcode="',data.barcode,'" data-pid="',data.package_id,'" data-senderid="',data.sender_id,'"><i class="fa fa-list-alt" style="color:green"></i></button>&nbsp;',
               '<button type="button" class="_pl_remove_package btn btn-sm btn-outline-danger" data-barcode="',data.barcode,'" data-pid="',data.package_id,'"><i class="fa fa-times" style="color:orange"></i></button>',
               '</div>'].join('');
           },
           title:''
       },
       {
        className:"zone_name",
        data:function(data,a,b) {
            let d = {"inputType":"select","data":data,"columnName":"zone_name","cssClass":"modal-select2","combo_items":mThis.form_options.zones,"valueMember":"zone_code","textMember":"zone_name"};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Destination' //autocomplete
       },
       {
        className:"receiver_phone",
        data:function(data,a,b) {
          let d = {"inputType":"number","data":data,"columnName":"receiver_phone","cssClass":"phone","readOnly":false};
          return EditableTable.makeTableCellEditor(d);
        },
        title:'Receiver Phone'
      }, 
      {
        className:"price",
        data:function(data,a,b) {
            let d = {"inputType":"number","data":data,"columnName":"price","readOnly":false};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Price'
      },
      {
        className:"df_payer", /* delivery fee payer or df_payer  = {'Sender','Receiver'}*/
        data:function(data,a,b) {
            let items = [{"name":"Sender"},{"name":"Receiver"}];
            let d = {"inputType":"select","data":data,"columnName":"df_payer","readOnly":false,"combo_items":items,"valueMember":"name","textMamber":"name","defaultValue":"Sender"};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'DFP'
      },
      {
        className:"fees", //To Express company charges Vendor/Merchant
        data:function(data,a,b) {
            if (!data.fees) data.fees = parseFloat(data.base_fee) + parseFloat(data.delivery_fee);
            data.fees = Number(data.fees).toFixed(2);     
            let d = {"inputType":"number","data":data,"columnName":"fees","readOnly":true,"defaultValue":0};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'fees'
      },
        // {
        //     className:"delivery_type", //Can also use "delivery_type" instead
        //     data:function(data,a,b) {
        //         let items = [{'delivery_type':'normal'},{'delivery_type':'fast'}];//make delivery_type in lower case
        //         data.delivery_type = (data.delivery_type +'').toLowerCase(); 
        //         let d = {"inputType":"select","data":data,"cssClass":"form-control","columnName":"delivery_type","combo_items":items,"valueMember":"delivery_type","textMember":"delivery_type"};
        //         return EditableTable.makeTableCellEditor(d);
        //     },
        //     title:'Delivery Type' //can also be used as "Delivery Type"
        // },
    {
      className:'receiver_address',
      data:function(data,a,b) {
        let d = {"inputType":"input","data":data,"columnName":"receiver_address","cssClass":"address","readOnly":false};
        return EditableTable.makeTableCellEditor(d);
      },
      title:'Receiver Address' 
    },
    {
        className:"cod",
        data:function(data,a,b) {
            let items = [{"id":"0","name":"Not COD"},{"id":"1","name":"COD"}];
            let d = {"inputType":"select","data":data,"columnName":"cod","readOnly":false,"combo_items":items,"valueMember":"id","textMamber":"name","defaultValue":1};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'COD'
    },
       {
        className:"base_fee",
        data:function(data,a,b) {
            let d = {"inputType":"number","data":data,"columnName":"base_fee","readOnly":true};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Base Fee'
     },
       {
           className:"delivery_fee",
           data:function(data,a,b) {
               let d = {"inputType":"number","data":data,"columnName":"delivery_fee","readOnly":true};
               return EditableTable.makeTableCellEditor(d);
           },
           title:'Additional'
       },
       {
        className:"size",
        data:function(data,a,b) {
            if (data.size instanceof Object && data.size) {
                data.size = [data.size.length, ' ',data.size.width,' ',data.size.height].join('');
            } 
            let d = {"inputType":"input","data":data,"columnName":"size","readOnly":false,"placeholder":"eg: 10 9.5 11"};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Size'
    },
    {
        className:"actual_kg",
        data:function(data,a,b) {
            let d = {"inputType":"number","data":data,"columnName":"actual_kg","readOnly":false};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Actual KG'
    },
    {
        className:"billed_kg",
        data:function(data,a,b) {
            let d = {"inputType":"number","data":data,"columnName":"billed_kg","readOnly":false};
            return EditableTable.makeTableCellEditor(d);
        },
        title:'Billed KG'
    },
    // {
    //        className:"cod_fee",
    //        data:function(data,a,b) {
    //            let d = {"inputType":"number","data":data,"columnName":"cod_fee","readOnly":true};
    //            return EditableTable.makeTableCellEditor(d);
    //        },
    //        title:'COD Fee'
    // },  
    //    {
    //        className:'forwarding_cost',
    //        data:function(data,a,b) {
    //            let d = {"inputType":"number","data":data,"columnName":"forwarding_cost","readOnly":false};
    //            return EditableTable.makeTableCellEditor(d);
    //        },
    //        title:'Taxi Fee'
    //    }
   ];

   this.elSender.on('change',(e)=>{
        let m = {'sender_id':mThis.elSender.val()};
        post_ajax([mThis.base_url,'/api/getVendorAddress'].join(''),m,function(address){ 
            address = StringSanitizer.sanitizeOut(address);
            mThis.elPickupAddress.val(address);
        });
   });

//    this.lnkFindSender.on('click',function(e){
//         e.preventDefault();
//         let option = {'title':"Find Merchant","role":"sender","singleSelect":true,"previousDialog":mThis.self};
//         FindPersonDialog.show(option,(persons)=>{
  
//             if(persons[0]){
//                 let p = persons[0];
//                 mThis.elSenderName.val(p.name);
//                 mThis.elSenderCode.val(p.code);
//                 mThis.elSenderId.val(p.id);

//                 let m = {'sender_id':p.id};
//                 post_ajax([mThis.base_url,'/api/getVendorAddress'].join(''),m,function(address){ 
//                     address = StringSanitizer.sanitizeOut(address);
//                     mThis.elPickupAddress.val(address);
//                 });

//                 // //get Seller's price_list and cod_fee_percent, and base_fee
//                 // let p1 = {'sender_id':p.id};
//                 // post_ajax([mThis.base_url,'/api/getSenderPriceInfo'].join(''),p1,function(d){
//                 //     if(d){
//                 //          mThis.sender_id = p.id;
//                 //          //Refresh existing data
//                 //          mThis.tblPackages.find('tbody>tr').each(function(){
//                 //              let tr = $(this);
//                 //              tr.find('td.zone_code>.col-input').trigger('blur'); //refresh zone name, base_fee
//                 //              tr.find('td.billed_kg>.col-input').trigger('blur'); //Refresh Delivery_Fee
//                 //              tr.find('td.cod>.col-input').trigger('change'); //Refresh COD_Fee 
//                 //          });
//                 //          //end of refreshing existing datas
//                 //     }
//                 // });
//             }
//         });
//    });

   mThis.btnSaveRequest.on('click',function(e){
       let p = mThis.getData();
       if (!p.request_date) p.request_date =''; 
       if (!p.pickup_date) p.pickup_date = '';
       if (!p) return; // stop here in case that one of recivers info is invalid  
       post_ajax([mThis.base_url,'/api/savePickupRequest'].join(''),p,function(result){
           if(typeof result =='string') alert(result);
           
           if(result.status=='OK') {
               mThis.self.modal('hide');
               if (typeof mThis.onClose =='function') mThis.onClose(true); 
            //    if (result.error_count > 0) {
            //      let i=0,c;
            //      let html = null;
            //      do{
            //         c = result.errors[i];
            //         if(!c) break;
            //           html = [html,'<li><span style="color:red;">',c,'</span></li>'].join('');
            //         i++;
            //      }while(c);
            //      //In case: some succeeded
            //      if (result.success_count > 0) {
            //        if(html) html = ['<span style="color:red;font-weight:bold">There are ',(i+1),' problems as follows:</span><br><ul>',html,'</ul>'].join('');
            //        cv_interact.alert(html,'','warning'); 
            //      } else //in case: No one package succeeded
            //      {
            //        if(html) html = ['<span style="color:red;font-weight:bold">No packages are picked up. See the following problems:</span><br><ul>',html,'</ul>'].join('');
            //        cv_interact.alert(html,'','warning'); 
            //      } 
               
            //    } else cv_interact.alert('<span style="font-weight:bold;color:green">Pickup action succeeded!','','success'); 
           } else cv_interact.alert(result.error_message,'','error');
       });
   });
 
   mThis.tblPackages.on('blur','td.size>.col-input',function(e){
        let tr= $(this).closest('tr'); 
        mThis.setBilledKg(tr);
   });

   mThis.tblPackages.on('blur','td.actual_kg>.col-input',function(e){
      let tr= $(this).closest('tr'); 
       mThis.setBilledKg(tr);
   });

   mThis.tblPackages.on('change','td.base_fee>.col-input',function(e){
      let tr= $(this).closest('tr'); 
      mThis.setTotalFees(tr);
   });
   //on Additional Fee Changed
   mThis.tblPackages.on('change','td.delivery_fee>.col-input',function(e){
    let tr= $(this).closest('tr'); 
     mThis.setTotalFees(tr);
   });

   //on Pickup Request Form
   this.setBilledKg = (tr,size_string)=>{
       if (!size_string) size_string = EditableTable.getCellValue(tr,'size',false);
       if(!size_string) return;
       if (!size.length) return;

        let size = DUtil.processPackageSize(size_string);
        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b/6015);
        let actual_kg = EditableTable.getCellValue(tr,'actual_kg');
        if (b > actual_kg) 
            kg = b;
        else
            kg = actual_kg;     
            EditableTable.setCellValue(tr,'billed_kg',kg);
   }
 
   //on PickupRequest Pickup Request Form
    mThis.btnAddPackage.on('click',function(e){
        e.preventDefault();
        mThis.addPackageRow();
    });

    // on Pickup Request Form
        mThis.tblPackages.on('click','td.col_action button._pl_remove_package',function(e){
            //e.preventDefault();
            let tr = $(this).closest('tr');
            mThis.packages = mThis.removePackageRow(tr);
            tr.remove();
            
        });
        //Delivery_type in packages table on Create Pickup Request Form  (Not yet exists)
        mThis.tblPackages.on('change','td.delivery_type>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr,'delivery_type');
        });

        mThis.tblPackages.on('change','td.zone_name>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr,'zone_name');
        });

        mThis.tblPackages.on('change','td.billed_kg>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr,'billed_kg');
        });

        mThis.tblPackages.on('keyup','td.actual_kg>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setBilledKg(tr);
            mThis.setDeliveryPrices(tr,'actual_kg');
        });

        mThis.tblPackages.on('blur','td.size>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setBilledKg(tr);
            mThis.setDeliveryPrices(tr,'size');
        });

        mThis.tblPackages.on('change','td.price>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr,'price');
        });

        mThis.tblPackages.on('change','td.cod>.col-input',function(e){
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr,'cod');
        });
         
        // mThis.tblPackages.on('change blur','td.base_fee>.col-input',function(e){
        //     let tr = $(this).closest('tr');
        //     mThis.setDeliveryPrices(tr,'base_fee');
        // });
    
        // mThis.tblPackages.on('keyup','td.delivery_fee>.col-input',function(e){
        //     let tr = $(this).closest('tr');
        //     mThis.setDeliveryPrices(tr,'delivery_fee');
        // });
      
        //On Pickup Request Form
        this.setDeliveryPrices = (tr,change_agent,error_span =null) =>{
            let sender_id = mThis.elSender.val();
            let zone_code, billed_kg=0, price=0, cod;
            let delivery_type = EditableTable.getCellValue(tr,'delivery_type');
            zone_code = EditableTable.getCellValue(tr,'zone_name');
            billed_kg = EditableTable.getCellValue(tr,'billed_kg',true);
            cod = EditableTable.getCellValue(tr,'cod');

            if (!delivery_type) delivery_type = mThis.elDeliveryType.val(); //mThis.elDeliveryType is SELECT box in PickupRequest's header section, Not delivery type of each package. This field is hidden
            let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};
            //This is on PickupDialog 
            post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
                if(d){
                      d = StringSanitizer.sanitizeObject(d);
                      let base_fee =0;
                      let delivery_fee =0;
                      let cod_fee =0;

                      //EditableTable.setCellValue(tr,'zone_code',d.zone_code);
                      EditableTable.setCellValue(tr,'base_fee',d.base_fee);
                      EditableTable.setCellValue(tr,'delivery_fee',d.delivery_fee);
                      price = EditableTable.getCellValue(tr,'price',true);

                      base_fee = EditableTable.getCellValue(tr,'base_fee',true);
                      delivery_fee = EditableTable.getCellValue(tr,'delivery_fee',true); 

                      if(cod==0) 
                        cod_fee = 0;
                      else 
                        cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent/100;
                       
                      EditableTable.setCellValue(tr,'cod_fee',cod_fee);
                      let fees = base_fee + delivery_fee + cod_fee;
                      EditableTable.setCellValue(tr,'fees',fees);
                    //   let total = fees + price;  
                    //   EditableTable.setCellValue(tr,'total',total);

                      //***error_span is html element <span class="error_text"> for display error text
                      if (d.status =='Error') {
                         EditableTable.handlePriceError(tr,d,error_span);
                     } 
                }
            }); 
        }

    //Make sure that all required  properties of package are specified by user.
    //This validatePackage() returns error object {'message'} 
    this.validatePackage = (p)=>{
        if(validator.isNullOrEmpty(p.receiver_phone)) {
            return 'Some packages does not have receiver`s phone number';
        }
        
        if(validator.isNullOrEmpty(p.zone_code)) {
            return 'Some packages does not have destination zone name';
        }
        if (p.cod ==1) {
            if (p.price<=0 || !p.price){
               return 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
            } 
        } 
        if (p.base_fee > 0 || p.delivery_fee > 0) {
            let dfp = (p.df_payer+'').toLowerCase();
            if (dfp != 'sender' && dfp !='receiver'){
                return 'Delivery Fee Payer (DFP) must be Sender or Receiver';
            } 
        } 
       return null; // no error
    }

     this.setBilledKg = (tr,size_string = null)=>{
                //mThis.elError.html(null);
                if (!size_string) size_string = EditableTable.getCellValue(tr,'size');
                if(!size_string) return;
                let size = DUtil.processPackageSize(size_string);
                if(!size) {
                    //mThis.elError.text('Data about package size is not valid');
                    //cv_interact.alert('Data about package size is not valid');
                    return;
                } 
                if (!size.length) return;
                let kg = 0;
                let b = size.length * size.width * size.height;
                b = Number(b/6015);
                let actual_kg = EditableTable.getCellValue(tr,'actual_kg');
                if (b > actual_kg) kg = b; else kg = actual_kg;     
                EditableTable.setCellValue(tr,'billed_kg',Number(kg).toFixed(2));
        }
 
    //PickupRequestDialog.show
    this.show = (option,onClose) =>{
        if(!option) option = {};
        mThis.onClose = onClose;
        mThis.sender_id = option.sender_id;
          
        mThis.elTitle.html(option.title?option.title:' New Pickup Request');
           mThis.prepareFormData(null,()=>{
             //Set default options for PickupRequestDialog
             mThis.elRequestDate.val(DateHelper.getTodayDate());
             mThis.elDeliveryType.val('normal');           
             mThis.elVechicleType.val('moto bike');
            //mThis.elCondition.val('None');
            mThis.displayPackages(null);
                mThis.self.modal({
                    backdrop:'static'
                });
           });
        
    }
  
    // this.loadDrivers = (def,onFinish)=>{
    //     if(!def) def = {};
    //    post_ajax([mThis.base_url,'/api/getComboItems_driver'].join(''),null,function(rows) {
    //        if(rows){
    //            rows = StringSanitizer.sanitizeObject(rows);
    //            CommonLib.setComboItems(mThis.elDriver,rows,'id','driver_name',true,'(Select a driver)',def.driver_id);
    //            if (typeof onFinish =='function') onFinish();
    //        }
    //    });
    // }

    //on PickupRequestDialog Pickup Request Form
    this.prepareFormData= (def,onFinish)=>{
        if(!def) def = {};
        if (!def.delivery_condition) def.delivery_condition ='None';
        //def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        if(mThis.form_options) {
           //CommonLib.setComboItems(mThis.elToWarehouse,mThis.form_options.warehouses,'id','warehouse_name',false,0,def.warehouse_id);      
           CommonLib.setComboItems(mThis.elSender,mThis.form_options.senders,'id','name',true,'(Select a merchant)',def.sender_id);
           CommonLib.setComboItems(mThis.elVechicleType,mThis.form_options.vehicle_types,'code','vehicle_type',true,'(Select Vehicle Type)',def.request_vehicle_type);
           CommonLib.setComboItems(mThis.elCondition,mThis.form_options.conditions,'name','name',true,'(Select Condition)',def.delivery_condition);
           CommonLib.setComboItems(mThis.elProductType,mThis.form_options.product_types,'product_type','product_type',true,'(Select Product Type)',def.product_type);
           onFinish();
           return;
        }
        post_ajax([mThis.base_url,'/api/getFormData_pickup_request'].join(''),null,function(data) {  
            //data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
            data.vehicle_types = StringSanitizer.sanitizeObject(data.vehicle_types);
            data.conditions = StringSanitizer.sanitizeObject(data.conditions);
            data.zones = StringSanitizer.sanitizeObject(data.zones);
            data.senders = StringSanitizer.sanitizeObject(data.senders);
            //CommonLib.setComboItems(mThis.elToWarehouse,data.warehouses,'id','warehouse_name',false,0,def.warehouse_id);      
            CommonLib.setComboItems(mThis.elSender,data.senders,'id','name',true,'(Select a merchant)',def.sender_id);
            CommonLib.setComboItems(mThis.elVechicleType,data.vehicle_types,'code','vehicle_type',true,'(Select Vehicle Type)',def.request_vehicle_type);
            CommonLib.setComboItems(mThis.elCondition,data.conditions,'name','name',true,'(Select Condition)',def.delivery_condition);
            CommonLib.setComboItems(mThis.elProductType,data.product_types,'product_type','product_type',true,'(Select Product Type)',def.product_type);
            mThis.form_options = data;
            onFinish();
         });
     }
 
    //Pickup Request Dialog
    this.addPackageRow = ()=>{
        let def_base_fee = 0;
        if(mThis.senderInfo) def_base_fee = mThis.senderInfo.base_fee;
        let row_data_blank = {'barcode':null,'zone_name':null,'receiver_phone':null,'price':0,'df_payer':'Sender','fees':0,'receiver_address':null,'cod':1,'base_fee':0,'delivery_fee':0,'size':null,'actual_kg':0,'billed_kg':0}; 
       //let rows = mThis.table.data(); // get current "data rows"
       let rows = mThis.getPackages(); //mThis.packages;
       //rows.unshift(row_data_blank); //Add element to beginning of array
       rows.splice(0,0,row_data_blank); //Add row_data_blank to be the first of the existing rows array
      
       mThis.displayPackages(rows);
    }  

    this.removePackageRow = (tr)=>{
       let rows = mThis.getPackages(); //mThis.packages; // get current "data rows"
       let index = tr.data('index'); //row_index
       rows.splice(index,1); //remove array element by index
       mThis.elQty.val(rows.length);
       return rows; //return new set of rows
    }
    
    this.getData = function(){
      let p = {};
       p.order_id = mThis.order_id;
       p.order_code = mThis.elOrderCode.val();
       p.sender_id = mThis.elSender.val(); // mThis.elSenderId.val();
       //p.sender_code = mThis.elSenderCode.val();
       p.pickup_date = mThis.elPickupDate.val();
       p.request_date = mThis.elRequestDate.val();
       p.delivery_type = mThis.elDeliveryType.val(); // This is delivery type field on header, Not on packages table
       p.delivery_condition = mThis.elCondition.val();
       p.qty = mThis.elQty.val();
       p.product_type = mThis.elProductType.val();
       p.pickup_address = mThis.elPickupAddress.val();
       p.request_vehicle_type = mThis.elVechicleType.val();

       p.packages = mThis.getPackages(p.delivery_type);
            
       let i=0,c;
       do{
          c = p.packages[i];
          if(!c) break;
           let error = mThis.validatePackage(c);
           if(error) {
               cv_interact.alert(error,'','error');
               return null;
           }
          i++;
       } while(c);
       return p;
    }

    //on New PickupRequest Form => This.getData(), getPackages() returns array of packages input by user
    this.getPackages = (delivery_type)=>{
       let data = []; 
       mThis.tblPackages.find('>tbody>tr').each(function(){
           let row = {};
           let tr = $(this);
           let btn_barcode = tr.find('td.col_action button._pl_print_barcode');
           row.barcode = btn_barcode.data('barcode');
             //row.package_id = btn_barcode.data('pid');
           tr.find('td>.col-input').each(function(){
               let x =$(this);
               let col_name =x.data('field');

               if (col_name =='size') {
                   row.size =  DUtil.processPackageSize(x.val());
                   //if(size) {
                    
                    //    if(size.width > 0) {
                    //       row[col_name] = [size.length,' ',size.width,' ',size.height].join(''); 
                    //    } else row[col_name]= null;

                   //} else row[col_name] = null;
               } else {
                   row[col_name] =x.val();
               }

           });
           row.delivery_type = delivery_type;
           if(!row.zone_code) row.zone_code = row.zone_name; // because zone_name is "SELECT BOX"
           data.push(row);     
       });
       return data;
    }

    //size = lenght*width*height. 
    //processPackageSize() returns size object = {'length','width','height'}. parem @size_str = 20 10 5 (in cm)
    // this.processPackageSize = (size_str)=>{
    //     size_str = (size_str + '').trim();
    //     if(size_str =='') return {'length':0,'width':0,'height':0};
    //    let parts = size_str.split(' ');
    //    if (!parts[0]) 
    //       return false;
    //    else if (!$.isNumeric(parts[2]) || !$.isNumeric(parts[1]) || !$.isNumeric(parts[0])) 
    //      return false;
    //    else {
    //        let length = parseFloat(parts[0]);
    //        let width =  parseFloat(parts[1]);
    //        let height =  parseFloat(parts[2]);
    //        return {'length':length,'width':width,'height':height};
    //    }      
    //    return null;
    // }

//      this.adjustColumnWidth =(html_table)=>{
//         let i=0;
//         let first_tr = html_table.find('tbody>tr').first();
//         alert(html_table.find('thead tr').find('th').eq(6).text());
//         //loop through each <td> in first <tr>
//         first_tr.find('td').each(function(){
           
//             html_table.find('thead tr').find('th').eq(i).css('width',[$(this).width(),'px'].join(''));
//             i++;
//             //alert($(this).html() + '| width: ' + $(this).width() + ' | eq ' + i);
//         });

//    }
   //begin::displayPackages 
   this.displayPackages= function(data,onFinish,d)
   { 
        
       if (!data || !data[0]) { 
           //make one empty raw for data entry 
           data = [{'barcode':null,'zone_name':null,'receiver_phone':null,'price':0,'base_fee':0,'delivery_fee':0,'df_payer':'Sender','cod':1,'size':'','actual_kg':0,'billed_kg':0,'cod_fee':0}];
           //return;
       }
           if (mThis.table){
                
                   mThis.tblPackages.DataTable().clear().destroy();
                   //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                   mThis.tblPackages.empty();
                   //alert('destroyed => '+  mThis.tblPackages.html());
                   mThis.table = null;
               
           }
           //begin::Set up columns
        let cnt = 1;       
           if (!mThis.table)
           mThis.table = mThis.tblPackages.DataTable({
               searching:false,
               destroy:true,
               paging:true,
               pageLength:5,
               //dom: 'Bfrtip',
               //retrieve: true,
               'ordering':false,
               //scrollY:"500px",
               //scrollX:'1500px',
               scrollCollapse: true,
               paging:false,
               //pagingType:'numbers',
               //info:true,
               bLengthChange:false,
               saveState:true,
               //fixedColumns: true,

                // rowReorder: {
                   // dataSrc: 'sequence'
                 // },
                  'processing': true,
                  'language': {
                       'loadingRecords': '&nbsp;',
                       'processing': 'Loading...',
                       "emptyTable": "No pacakges found"
                   },
                   data:data,
                   columns:mThis.package_columns, 
               "createdRow": function(row, data, dataIndex)
                     {
                         let tr = $(row);
                         tr.data('pid',data.package_id);  
                         tr.data('senderid',data.sender_id);  
                         tr.data('barcode',data.barcode);
                         
                         let i = 0;
                         tr.find('td').each(function(){
                            let td = $(this); 
                            td.find('select.modal-select2').select2({ width:'100%'});
                            if (i==0)  td.css('min-width','75px'); 
                            else if (i==1)  td.css('min-width','180px');
                            else if (i==2)  td.css('min-width','180px'); 
                            else if(i > 0)  td.css('min-width','150px');     
                            // if (i>=0 && i <1 ) 
                            //  {
                            //     td.css('min-width','180px');                           
                            //  }

                            // else if (i>0) 
                            //     td.css('min-width','100px');
                            // else if (i ==9) 
                            //     td.css('min-width','100px');        
                            i++;
                        });
                       
                        // //if (window.jQuery) {  
                        //     let url = [mThis.base_url,'/getAutoCompleteItems-zone'].join('');
                        //     let op = {'url':url,'appendTo':mThis.self,"onSelect":(item)=>{

                        //     },"onResponse":(e,ui)=>{
                              
                        //     }};
                        //     EditableTable.setAutoComplete(tr,'zone_name',op);
                        // //} 
                     }							
           });
    
            mThis.packages = data;
            mThis.elQty.val(mThis.packages.length);
            //mThis.adjustColumnWidth(mThis.tblPackages);
            //mThis.table.columns.adjust().draw(); 
           //mThis.table.fnAdjustColumnSizing();
           if (typeof onFinish =='function') onFinish();
                           
   };
   //end::displayPackages  
    
}
//end::PickupRequestDialog

//begin::PerformPickupDialog
 var PerformPickupDialog = new function() {
     let mThis = this;
     this.self = $('#_pl_dlgPerformPickup');
     this.base_url = $('#__base_url').val();
     this.elTitle =$('#_pl_dlgPerformPickupTitle');
     this.lnkFindDriver = $('#_pl_pp_lnkFindDriver');
     this.btnAddPackage = $('#_pl_pp_add_package');
     this.btnPickup = $('#_pl_pp_btnPickup');
     this.btnPickupOnArrival = $('#_pl_pp_btnPickOnArrival');
   
     this.elDriver = $('#_pl_dd_driver');
     this.elDriverCode = $('#_pl_dd_driver_code');

     this.elOrderId = $('#_pl_dd_order_id');
     this.elOrderCode = $('#_pl_dd_order_code');
     this.elSenderId = $('#_pl_dd_sender_id');
     this.elSenderName = $('#_pl_dd_sender_name');
     this.elSenderCode = $('#_pl_dd_sender_code');
     this.elPickupDate = $('#_pl_dd_pickup_date');
     this.elDeliveryType = $('#_pl_dd_delivery_type');
     this.elToWarehouse = $('#_pl_dd_to_warehouse');

     this.elPickupContext = $('#_pl_dd_pickup_context');
     this.elPickupType = $('#_pl_dd_pickup_type'); // {'Picked and Booked', 'Picked and Arrive at Warehouse'}
     this.tblPackages = $('#_pl_dd_tblPackages');
     //this.tblPackages_body = $('#_pl_dd_tblPackages_body');

     this.package_columns = [
        {
            className:"col_action",
            //width:'65px',
            data:function(data,a,b) {
               return ['<div class="form-inline">',
                 '<button type="button" class="_pl_print_barcode btn btn-sm btn-outline-primary disabled" data-barcode="',data.barcode,'" data-pid="',data.package_id,'" data-senderid="',data.sender_id,'"><i class="fa fa-list-alt" style="color:green"></i></button>&nbsp;',
                '<button type="button" class="_pl_remove_package btn btn-sm btn-outline-danger" data-barcode="',data.barcode,'" data-pid="',data.package_id,'"><i class="fa fa-times" style="color:orange"></i></button>',
                '</div>'].join('');
            },
            title:''
        },
     //    {
     //       visible:function(data,type,row){
     //          //if(data.barcode) return true; else return false;
     //          return true;
     //       },
     //       data: function(data,type,row) {
     //        let d = {"inputType":"input","data":data,"columnName":"barcode","readOnly":true};
     //        return EditableTable.makeTableCellEditor(d);
     //       }, 
     //       title:'Barcode'
     //    },
        // {
        //     className:"zone_code",
        //     data:function(data,a,b) {
        //         let d = {"inputType":"input","data":data,"columnName":"zone_code","readOnly":false,'placeholder':'Zone code'};
        //         return EditableTable.makeTableCellEditor(d);
        //     },
        //     title:'zone code'
        // },
        {
            className:"delivery_type", //Can also use "delivery_type" instead
            data:function(data,a,b) {
                let items = [{'delivery_type':'normal'},{'delivery_type':'fast'}];//make delivery_type in lower case
                data.delivery_type = (data.delivery_type +'').toLowerCase(); 
                let d = {"inputType":"select","data":data,"cssClass":"form-control","columnName":"delivery_type","combo_items":items,"valueMember":"delivery_type","textMember":"delivery_type"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Delivery Type' //can also be used as "Delivery Type"
        },
        {
            className:"zone_name", //Can also use "receiver_address" instead
            data:function(data,a,b) {
                let d = {"inputType":"select","data":data,"cssClass":"modal-select2","columnName":"zone_name","combo_items":PickupListComponent.form_data.zones,"valueMember":"zone_code","textMember":"zone_name"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Destination' //can also be used as "Zone Name"
        },
        {
            className:"receiver_phone",
            data:function(data,a,b) {
              let d = {"inputType":"number","data":data,"columnName":"receiver_phone","readOnly":false};
              return EditableTable.makeTableCellEditor(d);
            },
            title:'Receiver Phone'
        },
        {
            className:"price",
            data:function(data,a,b) {
                let d = {"inputType":"number","data":data,"columnName":"price","readOnly":false};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Price'
        },
        {
            className:"df_payer", /* delivery fee payer or df_payer  = {'Sender','Receiver'}*/
            data:function(data,a,b) {
                let items = [{"name":"Sender"},{"name":"Receiver"}];
                let d = {"inputType":"select","data":data,"columnName":"df_payer","readOnly":false,"combo_items":items,"valueMember":"name","textMamber":"name","defaultValue":"Sender"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'DFP'
        }, 
        {
            className:"fees",
            data:function(data,a,b) {
                if(!data.fees) data.fees = parseFloat(data.base_fees) + parseFloat(data.delivery_fee); 
                data.fees = Number(data.fees).toFixed(2);
                let d = {"inputType":"number","data":data,"columnName":"fees","readOnly":true,"defaultValue":0};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Fees'
        },
        {
          className:"receiver_address",
          data:function(data,a,b) {
            let d = {"inputType":"input","data":data,"columnName":"receiver_address","readOnly":false};
            return EditableTable.makeTableCellEditor(d);
          },
          title:'Receiver Address'
        },
        {
            className:"cod",
            data:function(data,a,b) {
                let items = [{"id":"0","name":"Not COD"},{"id":"1","name":"COD"}];
                let d = {"inputType":"select","data":data,"columnName":"cod","readOnly":false,"combo_items":items,"valueMember":"id","textMamber":"name","defaultValue":1};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'COD'
        },
        {
            className:"base_fee",
            data:function(data,a,b) {
                let d = {"inputType":"number","data":data,"columnName":"base_fee","defaultValue":0,"readOnly":true};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Base Fee'
        },
        {
            className:"delivery_fee",
            data:function(data,a,b) {
                let d = {"inputType":"number","data":data,"columnName":"delivery_fee","defaultValue":0,"readOnly":true};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Additional'
        },
        // {
        //         className:"additional_fee",
        //         data:function(data,a,b) {
        //             let d = {"inputType":"number","data":data,"columnName":"additional_fee","readOnly":true};
        //             return EditableTable.makeTableCellEditor(d);
        //         },
        //         title:'Additional Fee'   
        // },
        {
         className:"size",
         data:function(data,a,b) {
            if (data.size instanceof Object && data.size) {
                data.size = [data.size.length, ' ',data.size.width,' ',data.size.height].join('');
            }
             let d = {"inputType":"input","data":data,"columnName":"size","readOnly":false,"defaultValue":null,"placeholder":"eg: 10 9.5 11"};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Size'
     },
     {
         className:"actual_kg",
         data:function(data,a,b) {
             let d = {"inputType":"number","data":data,"columnName":"actual_kg","readOnly":false};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Actual KG'
     },
     {
         className:"billed_kg",
         data:function(data,a,b) {
             let d = {"inputType":"number","data":data,"columnName":"billed_kg","readOnly":false};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Billed KG'
     }
    //   ,{
    //         className:"cod_fee",
    //         data:function(data,a,b) {
    //             let d = {"inputType":"number","data":data,"columnName":"cod_fee","readOnly":true};
    //             return EditableTable.makeTableCellEditor(d);
    //         },
    //         title:'COD Fee'
    //   },  
     //    {
     //        className:'forwarding_cost',
     //        data:function(data,a,b) {
     //            let d = {"inputType":"number","data":data,"columnName":"forwarding_cost","readOnly":false};
     //            return EditableTable.makeTableCellEditor(d);
     //        },
     //        title:'Taxi Fee'
     //    }
    ];
 

     //Admin Perform pickup by clickin on button "Pick Now". So user need to convert Pickup data into Delviery Data by changing status_id from 4 (Picked and Booked) to 5 (Arrived At Warehouse)
    mThis.btnPickup.on('click',function(e){
      let pick_on_arrival = 0;  
      mThis.performPickup(pick_on_arrival,mThis.tr_row);
    });

     //Admin Perform pickup by clickin on button "Pick on Arrival" => Book Pickup and mark status as "Arrived At Warehouse"
     mThis.btnPickupOnArrival.on('click',function(e){
      let pick_on_arrival = 1;  
      mThis.performPickup(pick_on_arrival,mThis.tr_row);
    });
    
     mThis.btnPickup.on('mouseover',(e)=>{
         mThis.elPickupType.html('You are about to book pickup on behalf of a driver and goods not yet Arrive At Warehouse');
         mThis.elPickupType.css('color','orange');    
    }).on('mouseleave',()=>{
        mThis.elPickupType.html(null); 
    });

    mThis.btnPickupOnArrival.on('mouseover',(e)=>{
        mThis.elPickupType.html('You are about to book packages on Arrival At Warehouse');  
        mThis.elPickupType.css('color','green'); 
   }).on('mouseleave',()=>{
       mThis.elPickupType.html(null); 
   });

    mThis.elDriver.on('change',function(e){
       let driver_id = $(this).val();
       /**
        NOTE: if driver_id = 0 => do not allow "Pick Now" button (disable it)
        if driver_id > 0 and "Pick On Arrival" => Case1: Driver picked the goods without booking and Admin just books those packages on arrival => @pickup_method = "Driver" (table "order.pickup_method") 
        if driver_id <= 0 and "Pick On Arrival" => Case2: The packages are brought in Office or Warehouse by Seller (Not driver), so @pickup_method = "None"
        if (driver_id > 0 and "Pick Now") => Case3: Admin Officer performs picks up On behalf of a driver who just came to pick up the packages => @pickup_method = "Driver" 
        **/
       mThis.btnPickup.prop('disabled',(driver_id <=0 || !driver_id)?true:false); 

       if (driver_id <=0 || !driver_id) {
            mThis.elPickupContext.html('The following packages are NOT picked up by an agent or driver');
            mThis.elPickupContext.css('color','orange');
       } else {
           let driver_name = mThis.elDriver.find('option:selected').text();
           mThis.elPickupContext.html(['The following packages are picked up by an agent named ',driver_name].join(''));
           mThis.elPickupContext.css('color','green');
       }
    });
  
     mThis.lnkFindDriver.on('click',function(e){
       e.preventDefault();
       let onClose = (ds)=>{
          if(ds[0]) {
              let d = ds[0];
            mThis.elDriver.val(d.id); //elDriver is select box (id,name)
            if (!mThis.elDriver.val()) {
                mThis.elDriver.append($('<option/>').val(d.id).text(d.name)).val(d.id);
            }
            mThis.elDriverCode.val(d.code);
            mThis.elDriver.trigger('change');
          }
       };

       let option = {'title':'Find Driver','role':'driver','singleSelect':true,'previousDialog':mThis.self};
       FindPersonDialog.show(option,onClose);
     });

     //on perform Pickup Form | PerformPickup
     mThis.btnAddPackage.on('click',function(e){
         e.preventDefault();
         mThis.addPackageRow();
     });

     mThis.tblPackages.on('click','td.col_action button._pl_remove_package',function(e){
        //e.preventDefault();
        let tr = $(this).closest('tr');
        mThis.packages = mThis.removePackageRow(tr);
        tr.remove();
        
    });

    mThis.tblPackages.on('click','td.col_action button._pl_print_barcode',function(e){
        //e.preventDefault();
        //let tr = $(this).closest('tr');
        let barcode = $(this).data('barcode');
        if (!barcode) 
          cv_interact.alert('Bar code is not yet created');
        else
          window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
    });

   //delivery_type SELECT BOX on Perform Pickup Form 
    mThis.tblPackages.on('change','td.delivery_type>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr,'delivery_type', mThis.elError);
    });

    mThis.tblPackages.on('change','td.zone_name>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr,'zone_name', mThis.elError);
    });

    mThis.tblPackages.on('change','td.billed_kg>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr,'billed_kg', mThis.elError);
    });

    mThis.tblPackages.on('keyup','td.actual_kg>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr,'actual_kg', mThis.elError);
    });

    mThis.tblPackages.on('blur','td.size>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr,'size', mThis.elError);
    });

    mThis.tblPackages.on('change','td.price>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr,'price', mThis.elError);
    });

    mThis.tblPackages.on('change','td.cod>.col-input',function(e){
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr,'cod', mThis.elError);
    });

    // mThis.tblPackages.on('change blur','td.base_fee>.col-input',function(e){
    //     let tr = $(this).closest('tr');
    //     mThis.setDeliveryPrices(tr,'base_fee', mThis.elError);
    // });

    // mThis.tblPackages.on('keyup','td.delivery_fee>.col-input',function(e){
    //     let tr = $(this).closest('tr');
    //     mThis.setDeliveryPrices(tr,'delivery_fee', mThis.elError);
    // });

    //On Perform Pickup form 
    this.setDeliveryPrices = (tr,change_agent) =>{
        let sender_id = mThis.elSender.val();
        //let delivery_type = mThis.elDeliveryType.val();
        let zone_code, billed_kg=0, price=0, cod;
        zone_code = EditableTable.getCellValue(tr,'zone_name');
        let delivery_type = EditableTable.getCellValue(tr,'delivery_type');
        billed_kg = EditableTable.getCellValue(tr,'billed_kg',true);
        cod = EditableTable.getCellValue(tr,'cod');
         
        if (!sender_id) {
            mThis.elError.html('សូមជ្រើសរើសអ្នកលក់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }

        if(!zone_code) {
            mThis.elError.html('សូមជ្រើសរើសតំបន់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }
        if(!delivery_type) {
            mThis.elError.html('សូមជ្រើសរើសប្រភេទសេវាដើម្បីកំណត់តំលៃសេវា');
            return;
        }
        let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};  
        post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
            if(d){
                  d = StringSanitizer.sanitizeObject(d);
                  //EditableTable.setCellValue(tr,'zone_code',d.zone_code);
                  EditableTable.setCellValue(tr,'base_fee',d.base_fee);
                  EditableTable.setCellValue(tr,'delivery_fee',d.delivery_fee);
                  price = EditableTable.getCellValue(tr,'price',true);
                  if(cod==0) 
                     EditableTable.setCellValue(tr,'cod_fee',0);
                  else {
                    let base_fee = EditableTable.getCellValue(tr,'base_fee',true);
                    let delivery_fee = EditableTable.getCellValue(tr,'delivery_fee',true);    
                    let cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent/100;
                    EditableTable.setCellValue(tr,'cod_fee',cod_fee);
                    let fees = base_fee + delivery_fee;
                    EditableTable.setCellValue(tr,'fees',fees);
                  }   
                 
                 if (d.status =='Error') {
                    EditableTable.handlePriceError(tr,d,mThis.elError);
                 } 
            }
        }); 
    }
 
    //Make sure that all required  properties of package are specified by user.
    //This validatePackage() returns error object {'message'} 
    this.validatePackage = (p)=>{
        let error = {};
        if(validator.isNullOrEmpty(p.receiver_phone)) {
            error.message = 'Some packages does not have receiver`s phone number';
            return error;
        }
        if(validator.isNullOrEmpty(p.zone_code)) {
            error.message = 'Some packages does not have a correct destination Zone';
            return error;
        }

        if (p.cod ==1) {
            if (p.price<=0 || !p.price){
                error.message = 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
                return error;
            } 
        } 
        if (p.delivery_fee > 0) {
            let dfp = (p.df_payer+'').toLowerCase();
            if (dfp != 'sender' && dfp !='receiver'){
                error.message = 'Delivery Fee Payer (DFP) must be Sender or Receiver';
                return error;
            } 
        } 
       return null; // no error
     }
 
     this.setBilledKg = (tr,size_string)=>{
                if (!size_string) size_string = EditableTable.getCellValue(tr,'size');
                if(!size_string) return;
                let size = DUtil.processPackageSize(size_string);
                if (!size.length) return;
                let kg = 0;
                let b = size.length * size.width * size.height;
                b = Number(b/6015);
                let actual_kg = EditableTable.getCellValue(tr,'actual_kg');
                if (b > actual_kg) 
                    kg = b;
                else
                    kg = actual_kg;     
                    EditableTable.setCellValue(tr,'billed_kg',kg);
        }
 
     //PerformPickupDialog.show 
     this.show = (option,onClose) =>{
         if(!option) option = {};
         mThis.onClose = onClose;
         mThis.order_id = option.order_id;
         mThis.sender_id = option.sender_id;
         mThis.tr_row = option.tr_row; // tr_row i htm row element that contains pickup data. IT is used to refresh display right way after pickup is performed successfully
         mThis.elTitle.html(option.title?option.title:' Perform Pickup');
         
         mThis.prepareFormData({'driver_id':0});
         mThis.elPickupContext.html(null);
         if (mThis.order_id > 0) {
            mThis.loadOrderInfo(mThis.order_id,function(e){ 
                mThis.self.modal({
                    backdrop:'static'
                });
            });
         } 
        //  else //When no order_id is supplied => do nothing
        //   {
        //     mThis.displayPackages(null,()=>{
        //         mThis.self.modal({
        //             backdrop:'static'
        //         });
        //     });
        //  }

        
     }
   
     //on PerformPickupDilog
     this.prepareFormData = (def,onFinish)=>{
        if(!def) def = {};
        def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        CommonLib.setComboItems(mThis.elToWarehouse,PickupListComponent.form_data.warehouses,'id','warehouse_name',false,null,def.warehouse_id);
        post_ajax([mThis.base_url,'/api/getComboItems_driver'].join(''),null,function(rows) {
            if(rows){
                rows = StringSanitizer.sanitizeObject(rows);
                CommonLib.setComboItems(mThis.elDriver,rows,'id','driver_name',true,'(Not picked by driver)',def.driver_id);
                if (typeof onFinish =='function') onFinish();
            }
        });
     }

     //loadOrderInfo() in PerformPickupDialog
     this.loadOrderInfo = (order_id, onFinish)=>{
         //in context that: Goods are already picked up and current packges's status is either ("Picked" or "Picked and Booked")
         //so method getOrderInfo() returns a list order info (order ID, sender name) and package list from table "package", NOT from table "order_receivers"  => 
         //So this way is actually Converting Pickup to Delivery task. If driver_id is given then => status ="Delivery Started" immediately
        let p = {'order_id':order_id?order_id:0,"context":"0"}; //context =0 (in context of "perform Pickup" on behalf of driver or receive packages that are brought in by Seller at Office)
        post_ajax([mThis.base_url,'/api/getOrderInfo'].join(''),p,function(d) {
           if(d){
                let packages = d.packages?d.packages:[];
                d = StringSanitizer.sanitizeObject(d);
                packages = StringSanitizer.sanitizeObject(packages);
               
               //mThis.elOrderId.val(d.order_id);
               mThis.order_id = d.order_id;
               mThis.elOrderCode.val(d.order_code);
               mThis.elSenderName.val(d.sender_name);
               mThis.elSenderId.val(d.sender_id);
               mThis.elSenderCode.val(d.sender_code);
               mThis.displayPackages(packages,null); 
               if (typeof onFinish == 'function') onFinish();
           }
       });
     }

     this.performPickup = (pick_on_arrival=false, tr=null)=>{
            let p = mThis.getData();
            if(!p) return; // p == null when there are error in input as validated by  mThis.validatePackage()
            if (!p.pickup_date) p.pickup_date =''; 
            if (!p.driver_id) p.driver_id = 0;
             p.pick_on_arrival = (pick_on_arrival==true)?1:0;
            post_ajax([mThis.base_url,'/api/performPickup'].join(''),p,function(result){
                if(typeof result =='string') alert(result);
                
                if(result) {
                    mThis.self.modal('hide');
                    if (typeof mThis.onClose =='function') mThis.onClose(true);
                    if (result.error_count > 0) {
                    let i=0,c;
                    let html = null;
                    do{
                        c = result.errors[i];
                        if(!c) break;
                        html = [html,'<li><span style="color:red;">',c,'</span></li>'].join('');
                        i++;
                    }while(c);
                    //In case: some succeeded
                    if (result.success_count > 0) {
                        if(html) html = ['<span style="color:red;font-weight:bold">There are ',(i+1),' problems as follows:</span><br><ul>',html,'</ul>'].join('');
                        cv_interact.alert(html,'','warning'); 
                    } else //in case: No one package succeeded
                    {
                        if(html) html = ['<span style="color:red;font-weight:bold">No packages are picked up. See the following problems:</span><br><ul>',html,'</ul>'].join('');
                        cv_interact.alert(html,'','warning'); 
                    } 
                    
                    } else if(result.success_count > 0) { 
                        //Hide the Delviery Order when pick up succeeded
                        if (pick_on_arrival==1) {
                            tr.remove();
                        }
                        cv_interact.alert(['<span style="font-weight:bold;color:green">Pickup action succeeded!'].join(''),'','success');
                    }
                    else cv_interact.alert(['<span style="font-weight:bold;color:red">',result.success_count?result.success_count:0,' packages received'].join(''),'','warning');
                    if (result.success_count > 0) PickupListComponent.updatePickupStatus(tr, {'status_id':result.status_id,'status':result.status,'completed':result.completed});
                }
            });
     }
     
     //on Perform Pickup Form | PerformPickup form
     this.addPackageRow = ()=>{
        let row_data_blank = {'barcode':null,'zone_name':null,'receiver_phone':null,'price':0,'df_payer':'Sender','fees':0,'receiver_address':null,'cod':1,'base_fee':0,'delivery_fee':0,'size':null,'actual_kg':0,'billed_kg':0};
        //let rows = mThis.table.data(); // get current "data rows"
        let rows = mThis.getPackages(); //mThis.packages;
        //rows.unshift(row_data_blank); //Add element to beginning of array
        rows.splice(0,0,row_data_blank); //Add row_data_blank to be the first of the existing rows array
        mThis.displayPackages(rows);
     }  

     this.removePackageRow = (tr)=>{
        let rows = mThis.getPackages(); //mThis.packages; // get current "data rows"
        let index = tr.data('index'); //row_index
        rows.splice(index,1); //remove array element by index
        return rows; //return new set of rows
     }
     
     //on "Perform Pickup" form
     this.getData = function(){
       let p = {};
        p.order_id = mThis.order_id;
        //p.delivery_type = mThis.elDeliveryType.val();
        p.order_code = mThis.elOrderCode.val();
        p.sender_id = mThis.elSenderId.val();
        p.sender_code = mThis.elSenderCode.val();
        p.pickup_date = mThis.elPickupDate.val();
        p.to_warehouse_id = mThis.elToWarehouse.val();
        //if(!p.to_warehouse_id) p.to_warehouse_id =1;
        p.packages = mThis.getPackages(p.to_warehouse_id, p.delivery_type);

        let i=0,c;
        do{
           c = p.packages[i];
           if(!c) break;
            let error = mThis.validatePackage(c);
            if(error) {
                cv_interact.alert(error.message,'','error');
                return null;
            }
           i++;
        } while(c);
        p.size = DUtil.processPackageSize(p.size); 
        return p;
     }

     //this.getData(), getPackages() returns array of packages input by user
     this.getPackages = (to_warehouse_id)=>{
        let data = []; 
        mThis.tblPackages.find('tbody>tr').each(function(){
            let row = {};
            let tr = $(this);
            let btn_barcode = tr.find('td.col_action button._pl_print_barcode');
            row.barcode = btn_barcode.data('barcode');
            //row.package_id = btn_barcode.data('pid');
            row.to_warehouse_id = to_warehouse_id;
            tr.find('td>.col-input').each(function(){
                let x =$(this);
                let col_name =x.data('field');
                if (col_name =='size') {
                    row['size'] = DUtil.processPackageSize(x.val());
                    //if(size) {
                      
                        // if(size.width > 0) {
                        //    row[col_name] = [size.length,' ',size.width,' ',size.height].join(''); 
                        // } else row[col_name]= null;
 
                    //} else row[col_name] = null;
                } else {
                    //if (col_name =='delivery_type') alert(x.val());    
                    row[col_name] =x.val();
                }
            });

            if(!row.zone_code) row.zone_code = row.zone_name; // because zone_name is SELECT BOX
            data.push(row);
        });
        return data;
     }
     //size = lenght*width*height. 
    //  //processPackageSize() returns size object = {'length','width','height'}. parem @size_str = 20 10 5 (in cm)
    //  this.processPackageSize = (size_str)=>{
    //     size_str = (size_str + '').trim();
    //     if(size_str =='') return {'length':0,'width':0,'height':0};
    //     let parts = size_str.split(' ');
    //     if (!parts[0]) 
    //        return false;
    //     else if (parts[0] && !parts[2]){
    //         return false;
    //     } else if (!$.isNumeric(parts[2]) || !$.isNumeric(parts[1]) || !$.isNumeric(parts[0])) 
    //       return false;
    //     else {
    //         let length = parseFloat(parts[0]);
    //         let width =  parseFloat(parts[1]);
    //         let height =  parseFloat(parts[2]);
    //         return {'length':length,'width':width,'height':height};
    //     }      
    //     return null;
    //  }

//      this.adjustColumnWidth =(html_table)=>{
//         let i=0;
//         let first_tr = html_table.find('tbody>tr').first();
//         alert(html_table.find('thead tr').find('th').eq(6).text());
//         //loop through each <td> in first <tr>
//         first_tr.find('td').each(function(){
            
//             html_table.find('thead tr').find('th').eq(i).css('width',[$(this).width(),'px'].join(''));
//             i++;
//             //alert($(this).html() + '| width: ' + $(this).width() + ' | eq ' + i);
//         });
 
//    }
    //begin::displayPackages 
    this.displayPackages= function(data,onFinish,d)
    {   
        if (!data || !data[0]) { 
            //Make one empty raw for data entry
            data = [{'barcode':null,'delivery_type':'normal','zone_name':null,'receiver_phone':null,'price':0,'df_payer':'Sender','fees':0,'receiver_address':null,'cod':1,'size':null,'actual_kg':0,'billed_kg':0,'delivery_fee':0,'cod_fee':0,'forwarding_cost':'0'}];
            //return;
        }
       
            if (mThis.table){
                 
                    mThis.tblPackages.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblPackages.empty();
                    //alert('destroyed => '+  mThis.tblPackages.html());
                    mThis.table = null;
                
            }
            //begin::Set up columns
         //let cnt = 1;       
            if (!mThis.table)
            mThis.table = mThis.tblPackages.DataTable({
                searching:false,
                destroy:true,
                //paging:true,
                //dom: 'Bfrtip',
                //retrieve: true,
                'ordering':false,
                //scrollY:"500px",
                //scrollX:'1500px',
                scrollCollapse: true,
                paging:false,
                //pagingType:'numbers',
                //info:true,
                bLengthChange:false,
                saveState:true,
                // columnDefs: [
                //     { width: 65, targets: 0 }
                // ],
                //fixedColumns: true,

                 // rowReorder: {
                    // dataSrc: 'sequence'
                  // },
                   'processing': true,
                   'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": "No pacakges found"
                    },
                    data:data,
                    columns:mThis.package_columns, 
                "createdRow": function(row, data, dataIndex)
                      {
                          let tr = $(row);
                          tr.data('pid',data.package_id);  
                          tr.data('senderid',data.sender_id);  
                          tr.data('barcode',data.barcode); 
                          let i = 0; 
                          tr.find('td').each(function(){
                            let td = $(this);
                            if (i==1 || i==2){ 
                                td.find('select.modal-select2').select2({ width:'100%'});
                            }

                            if (i ==0) td.css('min-width','75px');
                            else if (i==1)  td.css('min-width','180px');
                            else if (i==2)  td.css('min-width','180px');
                            else if (i==3)  td.css('min-width','180px');
                            else if (i >0) td.css('min-width','130px');        
                            i++;
                        });
                      }							
            });
             
             mThis.packages = data;
             //mThis.elQty.val(i+1);
             //mThis.adjustColumnWidth(mThis.tblPackages);
             //mThis.table.columns.adjust().draw(); 
            //mThis.table.fnAdjustColumnSizing();
            if (typeof onFinish =='function') onFinish();
           				 
    };
    //end::displayPackages   
 }
//end::PerformPickupDialog


//begin::VerifyPackageDialog
var VerifyPackageDialog = new function() {
    let mThis = this;
    this.self = $('#_pl_dlgReceivePackages');
    this.base_url = $('#__base_url').val();
    this.elTitle =$('#_pl_dlgReceivePackagesTitle');
    this.lnkFindDriver = $('#_pl_rps_lnkFindDriver');
    this.btnAddPackage = $('#_pl_rps_add_package');
    this. btnVerifyPackages = $('#_pl_rps_btnVerify');
  
    this.elDriver = $('#_pl_rps_driver');
    this.elDriverCode = $('#_pl_rps_driver_code');

    this.elOrderId = $('#_pl_rps_order_id');
    this.elOrderCode = $('#_pl_rps_order_code');
    this.elSenderId = $('#_pl_rps_sender_id');
    this.elSenderName = $('#_pl_rps_sender_name');
    this.elSenderCode = $('#_pl_rps_sender_code');
    this.elDeliveryDate = $('#_pl_rps_delivery_date');
    this.elDeliveryType = $('#_pl_rps_delivery_type');
    this.elToWarehouse = $('#_pl_rps_to_warehouse');

    this.tblPackages = $('#_pl_rps_tblPackages');
    this.elError = $('#_pl_rps_error');
    
    this.lnkFindSender = $('#_pl_rps_lnkFindSender');

    //this.tblPackages_body = $('#_pl_dd_tblPackages_body');

    this.lnkFindSender.on('click',function(e){
        e.preventDefault();
        let option = {'title':"Find Merchant","role":"sender","singleSelect":true,"previousDialog":mThis.self};
        FindPersonDialog.show(option,(persons)=>{
            if(persons[0]){
                let p = persons[0];
                mThis.elSenderName.val(p.name);
                mThis.elSenderCode.val(p.code);
                mThis.elSenderId.val(p.id);
            }
        });
    });

    this.package_columns = [
        {
            className:"col_action",
            //width:'65px',
            data:function(data,a,b) { 
               return ['<div style="width:65px">',
                '<button type="button" class="_pl_print_barcode btn btn-sm btn-outline-primary" data-barcode="',data.barcode,'" data-pid="',data.package_id,'" data-senderid="',data.sender_id,'"><i class="fa fa-list-alt" style="color:green"></i></button>&nbsp;',
                '<button type="button" class="_pl_remove_package btn btn-sm btn-outline-danger" data-barcode="',data.barcode,'" data-pid="',data.package_id,'"><i class="fa fa-times" style="color:orange"></i></button>',
                '</div>'].join('');
            },
            title:''
        },
        {
            className:"delivery_type", //Can also use "delivery_type" instead
            data:function(data,a,b) {
                let items = [{'delivery_type':'normal'},{'delivery_type':'fast'}];//make delivery_type in lower case
                data.delivery_type = (data.delivery_type +'').toLowerCase(); 
                let d = {"inputType":"select","data":data,"cssClass":"form-control","columnName":"delivery_type","combo_items":items,"valueMember":"delivery_type","textMember":"delivery_type"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Delivery Type' //can also be used as "Delivery Type"
        },
        {
            className:"zone_name", //Can also use "receiver_address" instead
            data:function(data,a,b) {
                let d = {"inputType":"select","data":data,"cssClass":"modal-select2","columnName":"zone_name","combo_items":PickupListComponent.form_data.zones,"valueMember":"zone_code","textMember":"zone_name"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Destination' //can also be used as "Zone Name"
        },
        {
            className:"receiver_phone",
            data:function(data,a,b) {
              let d = {"inputType":"number","data":data,"columnName":"receiver_phone","readOnly":false};
              return EditableTable.makeTableCellEditor(d);
            },
            title:'Receiver Phone'
        },
        {
            className:"price",
            data:function(data,a,b) {
                let d = {"inputType":"number","data":data,"columnName":"price","readOnly":false};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Price'
        },
        {
            className:"df_payer", /* delivery fee payer or df_payer  = {'Sender','Receiver'}*/
            data:function(data,a,b) {
                let items = [{"name":"Sender"},{"name":"Receiver"}];
                let d = {"inputType":"select","data":data,"columnName":"df_payer","readOnly":false,"combo_items":items,"valueMember":"name","textMamber":"name","defaultValue":"Sender"};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'DFP'
        }, 
        {
            className:"fees",
            data:function(data,a,b) {
                if(!data.fees) data.fees = parseFloat(data.base_fees) + parseFloat(data.delivery_fee); 
                data.fees = Number(data.fees).toFixed(2);
                let d = {"inputType":"number","data":data,"columnName":"fees","readOnly":false,"defaultValue":0};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'Fees'
        },
        {
          className:"receiver_address",
          data:function(data,a,b) {
            let d = {"inputType":"input","data":data,"columnName":"receiver_address","readOnly":false};
            return EditableTable.makeTableCellEditor(d);
          },
          title:'Receiver Address'
        },
        {
            className:"cod",
            data:function(data,a,b) {
                let items = [{"id":"0","name":"Not COD"},{"id":"1","name":"COD"}];
                let d = {"inputType":"select","data":data,"columnName":"cod","readOnly":false,"combo_items":items,"valueMember":"id","textMamber":"name","defaultValue":1};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'COD'
        },
        {
         className:"size",
         data:function(data,a,b) {
            if (data.size instanceof Object && data.size) {
                data.size = [data.size.length, ' ',data.size.width,' ',data.size.height].join('');
            }
             let d = {"inputType":"input","data":data,"columnName":"size","readOnly":false,"defaultValue":null,"placeholder":"eg: 10 9.5 11"};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Size'
     },
     {
         className:"actual_kg",
         data:function(data,a,b) {
             let d = {"inputType":"number","data":data,"columnName":"actual_kg","readOnly":false};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Actual KG'
     },
     {
         className:"billed_kg",
         data:function(data,a,b) {
             let d = {"inputType":"number","data":data,"columnName":"billed_kg","readOnly":false};
             return EditableTable.makeTableCellEditor(d);
         },
         title:'Billed KG'
     },
     {
            className:"cod_fee",
            data:function(data,a,b) {
                let d = {"inputType":"number","data":data,"columnName":"cod_fee","readOnly":true};
                return EditableTable.makeTableCellEditor(d);
            },
            title:'COD Fee'
     },  
     //    {
     //        className:'forwarding_cost',
     //        data:function(data,a,b) {
     //            let d = {"inputType":"number","data":data,"columnName":"forwarding_cost","readOnly":false};
     //            return EditableTable.makeTableCellEditor(d);
     //        },
     //        title:'Taxi Fee'
     //    }
    ];

        mThis.btnVerifyPackages.on('click',function(e){
            mThis.receivePackages(null);
        });
  
        mThis.lnkFindDriver.on('click',function(e){
                e.preventDefault();
                let onClose = (ds)=>{
                    if(ds[0]) {
                        let d = ds[0];
                        mThis.elDriver.val(d.id); //elDriver is select box (id,name)
                        if (!mThis.elDriver.val()) {
                            mThis.elDriver.append($('<option/>').val(d.id).text(d.name)).val(d.id);
                        }
                        mThis.elDriverCode.val(d.code);
                        mThis.elDriver.trigger('change');
                    }
                };

                let option = {'title':'Find Driver','role':'driver','singleSelect':true,'previousDialog':mThis.self};
                FindPersonDialog.show(option,onClose);
     });

     mThis.btnAddPackage.on('click',function(e){
        e.preventDefault();
       mThis.addPackageRow();
      
    });

    mThis.tblPackages.on('click','td.col_action button._pl_remove_package',function(e){
       //e.preventDefault();
       let x =$(this);
       let tr = x.closest('tr');
       let barcode = x.data('barcode');
       let package_id = x.data('pid');

       if(barcode) {
           cv_interact.confirm('Are you sure to delete this package?','Delete Package',function(e){
               if(e){
                    let p = {'barcode':barcode,'package_id':package_id};
                    post_ajax([mThis.base_url,'/api/deletePackage'].join(''),p,function(err){
                        if(!err || err =='') {
                            mThis.packages = mThis.removePackageRow(tr);
                            tr.remove();
                        } else cv_interact.alert(err,'','warning');
                    });
                   
               }
           });
           return;
       } 

       mThis.packages = mThis.removePackageRow(tr);
       tr.remove();
       
   });

   mThis.tblPackages.on('click','td.col_action button._pl_print_barcode',function(e){
       e.preventDefault();
       let tr = $(this).closest('tr');
       let btn_print_barcode = $(this);
       let barcode = $(this).data('barcode');
       if (!barcode) 
         cv_interact.confirm('No barcode yet! Do you want to save this package?','Print Barcode',function(e){
             if(e){
                
                let onDone = (result)=>{
                    if (result.success_count > 0) {
                        barcode = result.last_new_barcode; // last barcode generated in the packages array
                        //Refresh data in Print barcode button
                            btn_print_barcode.data('barcode',barcode);
                            tr.find('td.col_action button._pl_remove_package').data('barcode',barcode);
                         window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank');  

                    } else {
                         if (result.errors) {
                            if (result.errors[0]){
                                mThis.elError.text(result.errors[0]);
                            } 
                         }
                         
                         
                    }  
                };

                mThis.receivePackages(tr,onDone);
             }
         });
       else
         window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
   });
 
   mThis.tblPackages.on('change','td.zone_name>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setDeliveryPrices(tr,'zone_name');
});

mThis.tblPackages.on('change','td.billed_kg>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setDeliveryPrices(tr,'billed_kg');
});

mThis.tblPackages.on('keyup','td.actual_kg>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setBilledKg(tr);
    mThis.setDeliveryPrices(tr,'actual_kg');
});

mThis.tblPackages.on('blur','td.size>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setBilledKg(tr);
    mThis.setDeliveryPrices(tr,'size');
});

mThis.tblPackages.on('change','td.price>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setDeliveryPrices(tr,'price');
});

mThis.tblPackages.on('change','td.cod>.col-input',function(e){
    let tr = $(this).closest('tr');
    mThis.setDeliveryPrices(tr,'cod');
});

// mThis.tblPackages.on('change blur','td.base_fee>.col-input',function(e){
//     let tr = $(this).closest('tr');
//     mThis.setDeliveryPrices(tr,'base_fee');
// });

// mThis.tblPackages.on('keyup','td.delivery_fee>.col-input',function(e){
//     let tr = $(this).closest('tr');
//     mThis.setDeliveryPrices(tr,'delivery_fee');
// });

  this.setDeliveryPrices = (tr,change_agent) =>{
    let sender_id = mThis.elSenderId.val();
    let delivery_type = mThis.elDeliveryType.val();
    let zone_code, billed_kg=0, price=0, cod;
    zone_code = EditableTable.getCellValue(tr,'zone_name');
    billed_kg = EditableTable.getCellValue(tr,'billed_kg',true);
    cod = EditableTable.getCellValue(tr,'cod');
    
    if (!sender_id) {
        mThis.elError.html('សូមជ្រើសរើសអ្នកលក់ដើម្បីកំណត់តំលៃសេវា');
        return;
    }

    if(!zone_code) {
        mThis.elError.html('សូមជ្រើសរើសតំបន់ដើម្បីកំណត់តំលៃសេវា');
        return;
    }
    if(!delivery_type) {
        mThis.elError.html('សូមជ្រើសរើសប្រភេទសេវាដើម្បីកំណត់តំលៃសេវា');
        return;
    }

       let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};
       post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
        if(d){
              d = StringSanitizer.sanitizeObject(d);
              //EditableTable.setCellValue(tr,'zone_code',d.zone_code);
              EditableTable.setCellValue(tr,'base_fee',d.base_fee);
              EditableTable.setCellValue(tr,'delivery_fee',d.delivery_fee);
              price = EditableTable.getCellValue(tr,'price',true);
              if(cod==0) 
                 EditableTable.setCellValue(tr,'cod_fee',0);
              else {
                let base_fee = EditableTable.getCellValue(tr,'base_fee',true);
                let delivery_fee = EditableTable.getCellValue(tr,'delivery_fee',true);    
                let cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent/100;
                EditableTable.setCellValue(tr,'cod_fee',cod_fee);
              }   
             
              if (d.status =='Error') {
                EditableTable.handlePriceError(tr,d);
             } 
              
        }
      }); 
  }
  
    this.setBilledKg = (tr,size_string)=>{
                if (!size_string) size_string = EditableTable.getCellValue(tr,'size');
                if(!size_string) return;

                let size = DUtil.processPackageSize(size_string);
                if (!size.length) return;

                let kg = 0;
                let b = size.length * size.width * size.height;
                b = Number(b/6015);
                let actual_kg = EditableTable.getCellValue(tr,'actual_kg');
                if (b > actual_kg) 
                    kg = b;
                else
                    kg = actual_kg;     
                    EditableTable.setCellValue(tr,'billed_kg',kg);
    }
   
   //VerifyPackageDialog.show
   //option = {title}
   this.show = (option,onClose) =>{
            if(!option) option = {};
            mThis.elError.html(null);
            mThis.onClose = onClose;
            mThis.order_id = option.order_id;
            mThis.sender_id = option.sender_id;
        mThis.tr_row = option.tr_row; // tr_row i htm row element that contains pickup data. IT is used to refresh display right way after pickup is performed successfully
            mThis.elTitle.html(option.title?option.title:'Verify Packages');
            
            mThis.prepareFormData({'driver_id':0});
           
            if (mThis.order_id > 0) {
                mThis.lnkFindSender.hide(); //Sender or merchant is pre-selected already
                mThis.loadOrderInfo(mThis.order_id,function(e){
                    mThis.self.modal({
                        backdrop:'static'
                    });
                });
            } 
         else //When no order_id is supplied => do nothing
          {
            if (!option.allow_find_sender) 
               return; //Do not show dialog and do nothing
            else {
                mThis.lnkFindSender.show();
                mThis.elSenderName.val(null);
                mThis.elSenderId.val(null);
                mThis.elSenderCode.val(null);
                mThis.elOrderCode.val(null);
                mThis.elOrderId.val(null);
                mThis.tblPackages.find('tbody').empty();
                mThis.addPackageRow();
                mThis.self.modal({
                    backdrop:'static'
                });
            }    
         }
   }
   
    //on VerifyPackageDialog // ReceivePackageDialog
    this.prepareFormData = (def,onFinish)=>{
       if(!def) def = {};
       def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
       CommonLib.setComboItems(mThis.elToWarehouse,PickupListComponent.form_data.warehouses,'id','warehouse_name',false,0,def.warehouse_id);
       post_ajax([mThis.base_url,'/api/getComboItems_driver'].join(''),null,function(rows) {
           if(rows){
               rows = StringSanitizer.sanitizeObject(rows);
               CommonLib.setComboItems(mThis.elDriver,rows,'id','driver_name',true,'(To Be Assigned)',def.driver_id);
               if (typeof onFinish =='function') onFinish();
           }
       });
    }

    //loadOrderInfo() in VerifyPackageDialog form
         //in context that: Goods are already picked up and current packges's status is either ("Picked" or "Picked and Booked")
         //so method getOrderInfo() returns a list order info (order ID, sender name) and package list from table "package", NOT from table "order_receivers"  => 
         //So this way is actually Converting Pickup to Delivery task. If driver_id is given then => status ="Delivery Started" immediately
    this.loadOrderInfo = (order_id, onFinish)=>{
      let p = {'order_id':order_id?order_id:0,"context":1}; //context =1 (in context of "Receive Packages". Receive packages on arrival and mark package status_id to 5 "Arrived At Office" or if driver_id is given => status_id = 6 "Delviery Started" )
      post_ajax([mThis.base_url,'/api/getOrderInfo'].join(''),p,function(d) {
          if(d){
              let packages = d.packages?d.packages:[];
              d = StringSanitizer.sanitizeObject(d); 
              packages = StringSanitizer.sanitizeObject(packages, null,['size'] ); //sanitize all, except column 'size'. Size has data such as "20.2 3.00 10.01", if sanitized then it becomes "203 300 1001"
              
              //mThis.elOrderId.val(d.order_id);
              mThis.order_id = d.order_id;
              mThis.elOrderCode.val(d.order_code);
              mThis.elSenderName.val(d.sender_name);
              mThis.elSenderId.val(d.sender_id);
              mThis.elSenderCode.val(d.sender_code);
              
              mThis.displayPackages(packages,null); 
              if (typeof onFinish == 'function') onFinish();
          }
      });
    }

    //function to verifyPackages() or to receivePackages() they are the same. 
    //if @tr_package is specified => then save or receive only that one package contained in the tr table row
    this.receivePackages = (tr_package = null, onDone = null)=>{
        mThis.elError.html(null);
        let p = mThis.getData(tr_package);
        if (!p) return;
        if (!p.pickup_date) p.pickup_date =''; 
        if (!p.driver_id) p.driver_id = 0;
        p.allow_create_order =1; /* @allow_create_order is used in context of Receiving packages that do not have pre Pickup Request from seller and so the goods are NOT picked up by driver. Usually the goods are brought in Warehouse by Seller themselves */ 
        //NOTE: "ReceivePackages" is same as "Verify Packages" when those packages arrive at Warehouse 
        post_ajax([mThis.base_url,'/api/receivePackages'].join(''),p,function(result){
            if(typeof result =='string') alert(result);
          
            if (typeof onDone =='function') onDone(result);
            else //if onDone = null then => process result and show informative message to user
            {
                if(result) {

                    //In case use click on print bar code button in order to save each package
                     if (result.error_message) {
                         cv_interact.alert(result.error_message,'','error');
                         return;
                     }
                    if (result.error_count > 0) {
                    let i=0,c;
                    let html = null;
                    do{
                        c = result.errors[i];
                        if(!c) break;
                        html = [html,'<li><span style="color:green;font-weight:bold">',c,'</span></li>'].join('');
                        i++;
                    }while(c);
                    if(html) html = ['<ul>',html,'</ul>'].join('');
                    cv_interact.alert(html,'','warning'); 
                    }
                     else if (result.success_count >0) 
                    {
                        mThis.self.modal('hide');
                        if (typeof mThis.onClose =='function') mThis.onClose(true); 
                        cv_interact.alert(['<span style="font-weight:bold;color:green">',result.success_count,' packages received!'].join(''),'','success');
                    }
                    else  cv_interact.alert(['<span style="font-weight:bold;color:red">',result.success_count,' packages received'].join(''),'','warning');     
                     
                }
             }
            
        });
    }

    //Verify package Form
    this.addPackageRow = ()=>{
       let def_base_fee = 0;
       if(mThis.senderInfo) def_base_fee = mThis.senderInfo.base_fee;
       let row_data_blank = {'barcode':null,'zone_name':null,'receiver_phone':null,'price':0,'df_payer':'Sender','fees':0,'receiver_address':null,'cod':1,'base_fee':0,'delivery_fee':0,'size':null,'actual_kg':0,'billed_kg':0}; 
       //let rows = mThis.table.data(); // get current "data rows"
       let rows = mThis.getPackages(); //mThis.packages;
       //rows.unshift(row_data_blank); //Add element to beginning of array
       rows.splice(0,0,row_data_blank); //Add row_data_blank to be the first of the existing rows array
       mThis.displayPackages(rows); 
    }  

    this.removePackageRow = (tr)=>{
       let rows = mThis.getPackages(); //mThis.packages; // get current "data rows"
       let index = tr.data('index'); //row_index
       rows.splice(index,1); //remove array element by index
       return rows; //return new set of rows
    }
    
    /** Receive Packages Form **/
    // NOTE: if @package_tr = null => getData() returns all packages
    //if @package_tr is specified => getData() returns only one specific package contained in that tr row
    this.getData = function(package_tr = null){
      let p = {};
       p.warehouse_id = mThis.elToWarehouse.val();
       p.delivery_type = mThis.elDeliveryType.val();
       p.order_id = mThis.order_id;
       p.order_code = mThis.elOrderCode.val();
       p.sender_id = mThis.elSenderId.val();
       p.sender_code = mThis.elSenderCode.val();
       p.delivery_date = mThis.elDeliveryDate.val();
       p.packages = mThis.getPackages(package_tr,p.delivery_type);
       if(!p.warehouse_id) {
           cv_interact.alert('Warehouse identity is not correct');
           return null;
       }
      
       if (!p.packages) return null;
       return p;
    }

    //On "Receive Packages" Form => this.getData(), getPackages() returns array of packages input by user
    // NOTE: if @tr = null => getData() returns all packages
    //if @tr is specified => getData() returns only one specific package contained in that tr row
    this.getPackages = (tr,delivery_type)=>{
        let ps = []; //packages array
        if (tr) {
            let p = mThis.getPackageObject(tr);
            let err = mThis.validatePackage(p);
            if (err) 
               {
                mThis.elError.text(err);
                return null;
               }
            else 
               {
                 p.delivery_type = delivery_type;
                 p.size = DUtil.processPackageSize(p.size);   
                 ps.push(p);
               }
            return ps; 
        } 
        
        mThis.tblPackages.find('tbody>tr').each(function(){
            let p = mThis.getPackageObject($(this));
            let err = mThis.validatePackage(p);
            if (err) 
               {
                mThis.elError.text(err);
                return null;
               }
            else
            {
                p.size = DUtil.processPackageSize(p.size);
                ps.push(p);   
            }
              
        });
        return ps;
     }
    
     this.getPackageObject = function(tr){
        let row = {};
        let to_warehouse_id = mThis.elToWarehouse.val();
        let btn_barcode = tr.find('td.col_action button._pl_print_barcode');
        row.barcode = btn_barcode.data('barcode');
        //row.package_id = btn_barcode.data('pid');
        tr.find('td>.col-input').each(function(){
            let x =$(this);
            let col_name =x.data('field');

            if (col_name =='size') {
                let size = DUtil.processPackageSize(x.val());
                if(size) {
                    if(size.width > 0) {
                       row[col_name] = [size.length,' ',size.width,' ',size.height].join(''); 
                    } else row[col_name]= null;

                } else row[col_name] = null;
            } else {
                row[col_name] =x.val();
            }
        });
        if (!row.zone_code) row.zone_code = row.zone_name; // because zone_name is Select Box
        row.to_warehouse_id = to_warehouse_id;
        row.warehouse_id = to_warehouse_id; // sameas to_warehouse_id;
        row.delivery_type = mThis.elDeliveryType.val();
        return row; //returns package object
     }

     //Make sure that all required  properties of package are specified by user.
     //This validatePackage() returns error object {'message'} 
    this.validatePackage = (p)=>{
        if(validator.isNullOrEmpty(p.to_warehouse_id)) {
            return  'Receiving warehouse information is not correct';
        }
        if(!p.to_warehouse_id || p.to_warehouse_id <=0) {
            return  'Receiving warehouse information is not correct';
        }
        if(validator.isNullOrEmpty(p.receiver_phone)) {
            return  'Some packages does not have receiver`s phone number';
        }
        
        if(validator.isNullOrEmpty(p.zone_code)) {
            return 'Some packages does not have destination zone';
        }
        if (p.cod ==1) {
            if (p.price<=0 || !p.price){
                return 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
                 
            } 
        } 
        if (p.base_fee > 0 || p.delivery_fee > 0) {
            let dfp = (p.df_payer+'').toLowerCase();
            if (dfp != 'sender' && dfp !='receiver'){
                return 'Delivery Fee Payer (DFP) must be Sender or Receiver';
            } 
        } 
       return null; // no error
    }

     //size = lenght*width*height. 
    //processPackageSize() returns size object = {'length','width','height'}. parem @size_str = 20 10 5 (in cm)
    this.processPackageSize = (size_str)=>{
        size_str = (size_str + '').trim();
        if(size_str =='') return {'length':0,'width':0,'height':0};
       let parts = size_str.split(' ');
       if (!parts[0]) 
          return false;
       else if (parts[0] && !parts[2]){
           return false;
       } else if (!$.isNumeric(parts[2]) || !$.isNumeric(parts[1]) || !$.isNumeric(parts[0])) 
         return false;
       else {
           let length = parseFloat(parts[0]);
           let width =  parseFloat(parts[1]);
           let height =  parseFloat(parts[2]);
           return {'length':length,'width':width,'height':height};
       }      
       return null;
    }

   //begin::displayPackages 
   this.displayPackages= function(data,onFinish,d)
   { 
       if (!data || !data[0]) { 
           //Make one empty raw for data entry
           data = [{'barcode':null,'zone_name':null,'receiver_phone':null,'price':0,'df_payer':'Sender','fees':0,'receiver_address':null,'cod':1,'size':null,'actual_kg':0,'billed_kg':0,'delivery_fee':0,'cod_fee':0,'forwarding_cost':'0'}];
           //return;
       }
      
           if (mThis.table){
                
                   mThis.tblPackages.DataTable().clear().destroy();
                   //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                   mThis.tblPackages.empty();
                   //alert('destroyed => '+  mThis.tblPackages.html());
                   mThis.table = null;
               
           }
           //begin::Set up columns
          //let cnt = 1;       
           if (!mThis.table)
           mThis.table = mThis.tblPackages.DataTable({
               searching:false,
               destroy:true,
               paging:true,
               pageLength:5,
               //dom: 'Bfrtip',                   
               //retrieve: true,
               'ordering':false,
               //scrollY:"500px",
               //scrollX:'1500px',
               scrollCollapse: true,
               paging:false,
               //pagingType:'numbers',
               //info:true,
               bLengthChange:false,
               saveState:true,
               // columnDefs: [
               //     { width: 65, targets: 0 }
               // ],
               //fixedColumns: true,

                // rowReorder: {
                   // dataSrc: 'sequence'
                 // },
                  'processing': true,
                  'language': {
                       'loadingRecords': '&nbsp;',
                       'processing': 'Loading...',
                       "emptyTable": "No pacakges found"
                   },
                   data:data,
                   columns:mThis.package_columns, 
               "createdRow": function(row, data, dataIndex)
                     {
                         let tr = $(row);
                         tr.data('pid',data.package_id);  
                         tr.data('senderid',data.sender_id);  
                         tr.data('barcode',data.barcode);
                         let i = 0;
                         tr.find('td').each(function(){
                            let td = $(this);      
                            if (i>0 && i <=3) 
                              {
                                td.css('min-width','180px');
                                td.find('select.modal-select2').select2({ width:'100%'});
                              }
                            else if (i>0) 
                                td.css('min-width','100px');
                            else if (i ==9) 
                                td.css('min-width','100px');        
                            i++;
                        });
                     }							
           });
            //mThis.adjustColumnWidth(mThis.tblPackages);
            mThis.packages = data;
            //mThis.elQty.val(i+1);
            //mThis.table.columns.adjust().draw(); 
           //mThis.table.fnAdjustColumnSizing();
           if (typeof onFinish =='function') onFinish();
                           
   };
   //end::displayPackages  
    
}
//end::VerifyPackageDialog


/** #### begin::EditableTable => general table maniuplication function **/
        var EditableTable = new function() {
            this.handlePriceError = (tr,d,display_span=null)=>{
               //let el = tr.find('td.delivery_fee>.col-input'); 
               if (display_span) 
                 display_span.text(d.error_message);
               else cv_interact.alert(d.error_message,'','warning'); 
            }

            /** getCellValue() assumes that each <td> has a class which is exactly the same as the column name, and the input within <td> can be textbox or select box with class "col-input" **/
            this.getCellValue = (tr,col_name,is_numeric)=>{
                if(!tr) return 0;
                let selector = ['td.',col_name,' .col-input'].join('');
                let v = tr.find(selector).val();
                if (is_numeric) {
                    if (!$.isNumeric(v)) v=0; 
                    return parseFloat(v);
                } else return v; 
                
            }
           
             /** getCellValue() assumes that each <td> has a class which is exactly the same as the column name, and the input within <td> can be textbox or select box with class "col-input" **/
            this.setCellValue =(tr,col_name, value)=>{
                if(!tr) return;
                let selector = ['td.',col_name,' .col-input'].join('');
                tr.find(selector).val(value);
            }

            // //option = {'url','params','appendToElement','length','delay'}
            // //option.params = {'sender_id','delivery_type','zone_code','billed_kg','onSelect','onChange','onResponse'}
            this.setAutoComplete = function(tr,col_name,option){
                if(!tr) return;
                let selector = ['td.',col_name,' .col-input'].join('');
                let textbox = tr.find(selector);
                if (textbox.length ===0 || !textbox) return;
                if (!option) option ={};
                //alert([option.url,'?term=',StringSanitizer.sanitizeOut(textbox.val())].join(''));
                let new_id = col_name +"_1";

                textbox.attr('id',new_id);
                let config = // API Advanced Configuration Object
                {
                    selector: "#" + new_id,
                    placeHolder: "Search for Food...",
                    data: {
                        src: ["Sauce - Thousand Island", "Wild Boar - Tenderloin", "Goat - Whole Cut"],
                        cache: true,
                    },
                    resultsList: {
                        element: (list, data) => {
                            if (!data.results.length) {
                                // Create "No Results" message element
                                const message = document.createElement("div");
                                // Add class to the created element
                                message.setAttribute("class", "no_result");
                                // Add message text content
                                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                                // Append message element to the results list
                                list.prepend(message);
                            }
                        },
                        noResults: true,
                    },
                    resultItem: {
                        highlight: {
                            render: true
                        }
                    }
                }

                const ttt = new autoComplete(config);                
             };
         
             
        //    this.adjustColumnWidth =(html_table)=>{
        //         let i=0;
        //         let first_tr = html_table.find('tbody>tr').first();
        //         alert(first_tr.html());
        //         //loop through each <td> in first <tr>
        //         first_tr.find('td').each(function(){
        //             i++;
        //             html_table.find('thead tr').find('th').eq(i).width($(this).width());
        //         });
        
        //    }
        
            //option = {inputType, data, columnName,readOnly, valueMember,textMember,[defaultValue],'combo_items','width','onSelect','onChange','onResponse' }
            //inputType ={'text','number','select','autocomplete'}. For "autocomplete" => option.onSelect(), [option.onChange()],[option.onResponse]
            this.makeTableCellEditor = (option)=>{

               if(option.inputType =='date' || option.inputType =='input' || option.inputType =='number') {
                let input_readOnly='', data_select =null;
                if (option.readOnly ==true) input_readOnly =' readOnly';
                let input_type =' type="text"';
                if(option.inputType=='number') input_type =' type ="number"';
                
                //data_select is used only for Date column 
                if (option.input_type =='date') {
                    data_select =' data-select="datepicker" autocomplete="off"';
                    input_type =null;
                }

                let el_style=null;
                if (option.width) el_style =[' style = "width:',option.width,'" '].join('');
                let el_placeholder =null;
                if (option.placeholder) el_placeholder =[' placeholder="',option.placeholder,'"'].join('');
                return [ '<td data-field="',option.columnName,'" class="',option.columnName,'"><input data-field="',option.columnName,'"', input_type,'" class="form-control col-input ',option.cssClass,'"',el_style,' value="',option.data[option.columnName],'"',input_readOnly, el_placeholder,data_select,'></td>',].join(''); 
            }else if (option.inputType =='select') {
                    let input_readOnly='', html_options='';
                    if (option.readOnly ==true) input_readOnly =' disabled';
                    if(option.combo_items) {
                    let i=0,c;
                    do{
                        c = option.combo_items[i];
                        if(!c) break;
                        let value_m = option.valueMember? option.valueMember: 'id';
                        let text_m = option.textMember?option.textMember:'name';
                        let cell_value = option.data[option.columnName];
                        //let def_value = option.defaultvalue?option.defaultvalue:null;
                        let selected ='';
                        if ((cell_value+'').toLowerCase() == (c[value_m]+'').toLowerCase()) selected =" selected";  
                        let o_html = ['<option value="',c[value_m],'" ',selected,'>',c[text_m],'</option>'].join('');
                        html_options = [html_options,o_html].join('');
                        
                        i++;
                    }while(c);
                    }
                    let el_style=null;
                    if (option.width) el_style =[' style = "width:',option.width,'" '].join('');
                    let el_placeholder =null;
                    if (option.placeholder) el_placeholder =[' placeholder="',option.placeholder,'"'].join('');
                    return [ '<td data-field="',option.columnName,'" class="',option.columnName,'"><select data-field="',option.columnName,'" class="form-control col-input ',option.cssClass,'" ',el_style,input_readOnly,el_placeholder,'>',html_options,'</select></td>',].join(''); 
            } 
            };
        }
/**### end:: EditableTable: genral etitable table manipulation functions **/
 
//### begin::FilterDialog_pickup
  var FilterDialog_pickup = new function(){
     let mThis = this;
     this.self = $('#_pl_dlgFilter');
     this.elTitle = $('#_pl_dlgFilterTitle');
     //this.elFilter_date = $('#_pl_filter_date');
     this.elFilter_start_date = $('#_pl_filter_startdate');
     this.elFilter_end_date = $('#_pl_filter_enddate');
     this.elFilter_sender = $('#_pl_filter_sender');
     this.elFilter_driver = $('#_pl_filter_driver');
     this.elFilter_delivery_type = $('#_pl_filter_dtype');
     this.elFilter_status = $('#_pl_filter_status');
     this.elFilter_warehouse = $('#_pl_filter_warehouse'); //Receiving warehouse

     this.form_data =null ; //stores all filter options
     this.remembered_filter;
     this.btnOK = $('#_pl_dlgFilter_btnOK');

     this.self.find('.dl_filter_field').on('change',(e)=>{
         mThis.remembered_filter = mThis.getData();
     });

     this.btnOK.on('click',(e)=>{
        mThis.self.modal('hide');
        let p = mThis.getData();
        if(typeof mThis.onClose =='function') mThis.onClose(p);
     });

     this.loadFilterData = (onFinish)=>{
         let def =  mThis.remembered_filter? mThis.remembered_filter:{};
         if(!def.status_id) def.status_id =-1; // Use "All Statuses" As default status filter
         if (!def.sender_id) def.sender_id = null;
         if (!def.driver_id) def.driver_id = null;
         if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;

        if (mThis.form_data) {
            CommonLib.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
            CommonLib.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id);
            CommonLib.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,null,def.driver_id);
            CommonLib.setComboItems(mThis.elFilter_status,mThis.form_data.order_statuses,'status_id','status_name',false,'(All Status)',def.status_id);
            if(typeof onFinish =='function') onFinish(mThis.form_data);
            return;   
        }
        post_ajax([mThis.base_url,'/api/getForm_options_pickuplist'].join(''),null,function(data){
            if(data){
                data.warehouses = StringSanitizer.sanitizeObject(data.warehouses); 
                data.senders = StringSanitizer.sanitizeObject(data.senders);
                data.order_statuses = StringSanitizer.sanitizeObject(data.order_statuses); 
                data.drivers = StringSanitizer.sanitizeObject(data.drivers);
                data.zones = StringSanitizer.sanitizeObject(data.zones);
                data.order_statuses.unshift({"status_id":"-1","status_name":"(All Statuses)"});
                data.senders.unshift({"id":null,"sender_name":"(All Merchants)"});
                data.drivers.unshift({"id":null,"driver_name":"(All Drivers)"});
                CommonLib.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                CommonLib.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,null,def.sender_id);
                CommonLib.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,null,def.driver_id);
                CommonLib.setComboItems(mThis.elFilter_status,data.order_statuses,'status_id','status_name',false,null,def.status_id);
                mThis.form_data = data;
                if(typeof onFinish =='function') onFinish(data);
                PickupListComponent.form_data = data;
            }
        });
    }
 
    this.show = (option, onClose)=>{
         if(option) {
             mThis.elTitle.text(option.title);
         }
         mThis.onClose = onClose;
         mThis.loadFilterData(()=>{
            if (main_view.MULTI_WAREHOUSE_OP ==0) mThis.elFilter_warehouse.parent().hide(); 
            mThis.self.modal({
                backdrop:'static'
            });
         });
       
     }

    this.getData = ()=>{
        let p = {};
        p.start_date = mThis.elFilter_start_date.val();
        p.end_date = mThis.elFilter_end_date.val();
        //if (!p.request_date) p.request_date =p.date;
        p.sender_id = mThis.elFilter_sender.val();
        p.driver_id = mThis.elFilter_driver.val();
        p.delivery_type = mThis.elFilter_delivery_type.val();
        p.status_id = mThis.elFilter_status.val();
        p.warehouse_id = mThis.elFilter_warehouse.val(); //receiving warehouse
        mThis.remembered_filter = p; //remember previous selection
        return p;
    } 
  }
//### end::FiterDialog_pickup

//##### begin::pdfReport
  var pdfReport = new function(){
      let mThis = this;
      this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        post_ajax([mThis.base_url,'/api/encryptData'].join(''),p,(d)=>{
            onFinish(d);
        }); 
      }
      //Create pdf document base on a given table_id with my default style 
      this.createPDFDocument_table =(table_id,option={})=> {
        let table = document.getElementById(table_id);
        let start_col_index = option.start_col_index? option.start_col_index:0;
        let col_widths=[];
        let header_cols = [];
        if (!table.rows[0]) {
            alert('createPDFDocument_table() => The given table does not have any row');
            return;
        }
        let cnt = table.rows[0].cells.length;
        for (let i = start_col_index; i < cnt; i++) {
            let cell = table.rows[0].cells[i];
            col_widths[i-start_col_index] ='auto';
            let col = {'text':cell.innerText,'style':'th_style'}; 
            header_cols[i-start_col_index]= col;
            //widths[i] = (cell.style.width != ""? cell.style.width : cell.style.offsetWidth); //if the cell's style width is not set, get its' actual width
        }
    
        let bdy=[];
        let c, i=1; //NOTE: $i start from 1, not zero. because 0 is header row
        let col_count =0;
        //insert header_row before adding body rows
        bdy.push(header_cols);
        do{
            c = table.rows[i];
            if(!c) break;
              if(col_count <=0 || !col_count) col_count =cnt; //** OR  col_count = c.cells.length;
              let row = [];
            
              for (let x = start_col_index; x < col_count; x++) {
                    let cell_value =c.cells[x]?c.cells[x].innerText:'';
                    row.push({"text":cell_value,"style":"td_text"});
              } 
              bdy.push(row); 
            i++; 
        }while(c);
               /** prevent error when there are no data row **/
                if (!bdy[1][0]){
                    let empty_row= [];
                    col_count = cnt;
                    for (let x = start_col_index; x < col_count; x++) {
                        empty_row.push({"text":"","style":"td_text"});
                    }
                    bdy[1] = empty_row;
                }

                 // //Define Khmer fonts for pdf doc 
                 pdfMake.fonts = {
                    // Khmer: {
                    // normal: 'Khmer.ttf',
                    // bold: 'Khmer.ttf',
                    // //italics: 'Khmer.ttf',
                    // //bolditalics: 'Khmer.ttf'
                    // },
                    DaunTep: {
                        normal: 'DaunTep.ttf',
                        bold: 'DaunTep.ttf',
                        //italics: 'DaunTeav.ttf',
                        //bolditalics: 'DaunTeav.ttf'
                    },
                    Roboto:{
                        normal: 'Roboto-Regular.ttf', //Khmer unicode font
                        bold: 'Roboto-Regular.ttf',
                        italic:'Roboto-Italic.ttf'

                    }
                }   

                //make custom table layout style
                    pdfMake.tableLayouts = {
                        myCustomLayout: {
                            hLineWidth: function (i, node) {return 1;},
                            vLineWidth: function (i, node) {return 1;},
                            hLineColor: function (i, node) {return '#D9E0DF';},
                            vLineColor: function (i, node) {return '#D9E0DF';},
                            //fillColor: function (i, node) {return 'green';},
                            paddingLeft: function(i, node) {return 10;}
                        }
                    };

            let rpt_title= {'text':option.title?option.title:'Report Title','style':'rpt_title'};
            let rpt_sub_title =null;
            if (option.subTitle) rpt_sub_title = {'text':option.subTitle,'style':'rpt_sub_title'};
            let docDef = {
                            //page header / footer function
                            // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Landscape',
                            //pageMargins:[10,10,10,10], 
                            content: [
                                     rpt_title,
                                     rpt_sub_title,
                                     {
                                        layout:function(){

                                       }
                                     },
                                     { 
                                        layout: 'myCustomLayout', // optional
                                        table: { headerRows: 1, widths: col_widths, body: bdy } 
                                     }],
                                     defaultStyle:{
                                        font: 'DaunTep'
                                     },
                                     styles: {
                                        rpt_title: 
                                            {
                                                //font: 'Khmer',
                                                fontSize: 15,
                                                bold: true,
                                                color:option.title_color?option.title_color:'#2441B8',
                                                margin: [0, 3, 0, 0],
                                                alignment: 'center'
                                            },
                                          rpt_sub_title:{
                                            fontSize: 11,
                                            bold: true,
                                            color:option.sub_title_color?option.sub_title_color:'grey',
                                            margin: [0, 0, 0, 2],
                                            alignment: 'center'
                                          },  
                                            th_style: 
                                            {
                                                //font: 'Khmer',
                                                fontSize: 11,
                                                bold:true, 
                                                fillColor: option.header_back_color?option.header_back_color:'#fff',
                                                color: option.text_color?option.text_color:'#333435',
                                                margin:[5,5,5,5]
                                            },
                                            td_text:{
                                                //font: 'Khmer',
                                                fontSize: 10,
                                                color:option.text_color?option.text_color:'#5E5E61',
                                                margin:[5,5,5,5]
                                            }

                                    }  
              };
            
              return docDef;
    }
     
    //Create pdf document based on JSON data 
    //option.header_columns: [] //list of header's titles, example ['Name','Place of Birth','Date of Birth','Phone Number']
    this.createPDFDocumentFromJson =(data,option={})=> {
        if(!data || !data[0] || data==[]) return null;
        let col_widths=[];
        let header_cols = [];
        let bdy = [];
        let user_header_cols =null;
        if (Array.isArray(option.header_columns)){
           let x =0,c;
           user_header_cols = [];
           do{
               c = option.header_columns[x];
               if(!c) break;
               user_header_cols.push({'text':c,'style':'th_style'});
               x++;
           }while(c);
        }

        //let except_props = option.exceptProps; // array of exceptions ['email','col_name']
        if (Array.isArray(data)) // process Array object = [{pro1,prop2,...}]
		{
			let i=0, myObj;
            let col_cnt=0;
			do
			{
				myObj = data[i]; //rows array of objects
				if (!myObj) break;
                let row =[];
				for (let property in myObj) {
				  if (i==0){
                     col_widths.push('auto');
                     if (!user_header_cols) header_cols.push({'text':property,'style':'th_style'});
                     col_cnt++;
                  }
                     row.push({"text":myObj[property],"style":"td_text"});   
                 } //end::for loop

                  if (user_header_cols){
                    if (!user_header_cols[col_cnt-1]) {
                        alert('Header columns less than number of provided data properties');
                        return;
                    } else if (user_header_cols[col_cnt]) {
                      alert('Header columns more than number of provided data properties');
                      return;
                    }
                  }
                  
                 // Add header row
                 if (i==0) {
                    if(!user_header_cols){
                       bdy.push(header_cols);
                     }else bdy.push(user_header_cols);
                 }

                 bdy.push(row); 
                 i++;				
			}while(myObj);

		} else {
            alert("Invalid json data provided. Expected array of JSON objects");
            return;
        }
                /** NOTE: to keep clean code => the following pdfMake.fonts defintion is written in file vfs_fonts.js **/
                // //Define Khmer fonts for pdf doc 
                 pdfMake.fonts = {
                    // Khmer: {
                    // normal: 'Khmer.ttf',
                    // bold: 'Khmer.ttf',
                    // //italics: 'Khmer.ttf',
                    // //bolditalics: 'Khmer.ttf'
                    // },
                    DaunTep: {
                        normal: 'DaunTep.ttf',
                        bold: 'DaunTep.ttf',
                        //italics: 'DaunTeav.ttf',
                        //bolditalics: 'DaunTeav.ttf'
                    },
                    Roboto:{
                        normal: 'Roboto-Regular.ttf', //Khmer unicode font
                        bold: 'Roboto-Regular.ttf',
                        italic:'Roboto-Italic.ttf'

                    }
                }   

                //pdfMake.vfs = pdfFonts.pdfMake.vfs;
                 //make custom table layout style
                    pdfMake.tableLayouts = {
                        myCustomLayout: {
                            hLineWidth: function (i, node) {return 1;},
                            vLineWidth: function (i, node) {return 1;},
                            hLineColor: function (i, node) {return '#D9E0DF';},
                            vLineColor: function (i, node) {return '#D9E0DF';},
                            //fillColor: function (i, node) {return 'green';},
                            paddingLeft: function(i, node) {return 10;}
                        }
                    };

            let rpt_title= {'text':option.title?option.title:'Report Title','style':'rpt_title'};
            let rpt_sub_title= null;
            if(!option.subTitle) option.subTitle = option.sub_title;
            if (option.subTitle) rpt_sub_title = {'text':option.subTitle,'style':'rpt_sub_title'};
            let docDef = {
                            //page header / footer function
                            // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Landscape',
                            pageMargins:[10,10,10,10], 
                            content: [
                                     rpt_title,
                                     rpt_sub_title,
                                     option.heading_contents,
                                     { 
                                        layout:'myCustomLayout',//'headerLineOnly', // optional
                                        table: { headerRows: 1, widths: col_widths, body: bdy } 
                                     }
                                    ],
                                     defaultStyle:{
                                        font:'DaunTep',
                                        fontSize: 10,
                                        bold:false,
                                     },
                                     styles: {
                                        rpt_title: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 18,
                                                bold: true,
                                                color:option.title_color?option.title_color:'#2441B8',
                                                margin: [0, 3, 0, 0],
                                                alignment: 'center'
                                            },
                                            rpt_sub_title: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 12,
                                                bold: true,
                                                color:option.sub_title_color?option.sub_title_color:'grey',
                                                margin: [0, 0, 0, 2],
                                                alignment: 'center'
                                            },
                                            th_style: 
                                            {
                                                font:'DaunTep',
                                                fontSize: 11,
                                                bold:true, 
                                                fillColor: option.header_back_color?option.header_back_color:'#fff',
                                                color: option.text_color?option.text_color:'#333435',
                                                margin:[5,5,5,5]
                                            },
                                            td_text:{
                                                font:'DaunTep',
                                                fontSize: 10,
                                                color:option.text_color?option.text_color:'#5E5E61',
                                                margin:[5,5,5,5]
                                            }

                                    }  
              };
            
              return docDef;
    }

    //JsonToPDF()
    this.viewPDF_json = (data,option)=>{ 
        let docDef = mThis.createPDFDocumentFromJson(data,option); 
        /**NOTE:  _vfs_fonts is "Virtual File System fonts" defined in javascript file "vfs_fonts.js" that is in the same directory with file pdfMake.min.js **/
        pdfMake.vfs = _vfs_fonts; // _vfs_fonts is built using node command. 'node build-vfs.js "./examples/fonts" '
        if(option.styles) pdfMake.styles = option.styles;
        if (docDef) pdfMake.createPdf(docDef,null,null).open();
        else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');
     }
    
    //viewPDF_fromTable() | htmlTableToPDF()
    this.viewPDF = (table_id,option)=>{
        let docDef = mThis.createPDFDocument_table(table_id,option); 
           //##Start creating PDF using pdfmake.js
                pdfMake.vfs = _vfs_fonts;
                if (docDef) pdfMake.createPdf(docDef).open();
                else cv_interact.alert('It seems no data to display. If you see data, make sure your searchbox is empty');

                // // create the window before the callback
                // var win = window.open('', '_blank');
                // $http.post(mThis.base_url, data).then(function(response) {
                //     // pass the "win" argument
                //     pdfMake.createPdf(docDef).open({}, win);
                // });
           //##end creating pdf
    }

    //HtmlElementToPDF()
    //convert html element (defined by getElementById() ) to image (screenshot) and display as pdf 
    //For element ID need to be prefixed with '#' 
    this.htmlToPdf = (elementId,option={})=>
    {
        //const  html2canvas =  new html2canvas();
        html2canvas(document.getElementById(elementId),{
            Scale: 5, // scale, default is 1
            Allowtaint: false, // allow cross domain images to contaminate the canvas
            Usecors: true, // do you want to use CORS to load images from the server
            Width: '500', // width of canvas
            Height: '500', // height of canvas
            BackgroundColor: '× 000000', // the background color of the canvas, which is transparent by default
        }).then((canvas)=>{
            let rpt_title = {'text':'List of Pickups','style':'rpt_title'};
            let img = canvas.toDataURL("image/png"); //base64
            //let img = canvas.toDataURL(); //base64
            let docDefinition = {
                          // header:function(currentPage, pageCount, pageSize) {
                            //         return [
                            //         { text: 'Pickup List', alignment: (currentPage % 2) ? 'left' : 'right' },
                            //         { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                            //         ]
                            // },
                            pageSize: option.pageSize?option.pageSize:'A4', 
                            pageOrientation: option.pageOrientation?option.pageOrientation:'Portrait',
                content: [
                    rpt_title,
                    {
                        image: img,
                        width: 500
                    }],
                    styles:{
                        rpt_title: 
                        {
                            //font: 'Khmer',
                            fontSize: 15,
                            bold: true,
                            color:option.title_color?option.title_color:'#2441B8',
                            margin: [0, 3, 0, 5],
                            alignment: 'center'
                        }
                    }
            };
            pdfMake.createPdf(docDefinition).open();
        });
    }
            
  }
//##### end::pdfReport
 
$(document).ready(function(){
    PickupListComponent.init();
});
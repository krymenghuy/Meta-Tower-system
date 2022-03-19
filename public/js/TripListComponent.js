'use strict'
//## begin::TripListComponent
var TripListComponent = new function() {
    let mThis = this;
    this.lang ='kh';
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_tripListComponent');
    this.base_url = $('#__base_url').val();
    this.tblTrips = $('#_trl_tblTrips');
    this.trip_dropdown_menu = mThis.tblTrips.find('.dropdown-menu');
     
    this.btnNewTrip = $('#_trl_btnNewTrip');
    this.elSearchTrip = $('#_trl_search');
    this.btnSearch = $('#_trl_btnSearch');
    this.btnShowTrackingMap = $('#_trl_btnShowTrackingMap');
    this.btnToggleFilter = $('#_trl_btnToggleFilter');
    
    this.btnPrint = $('#_trl_btnPrint');
    this.btnPDF = $('#_trl_btnPDF');
    this.btnExcel = $('#_trl_btnExcel');
    this.trip_list_pane = $('#_trl_trip_list_panel');
    //this.tblTrips_body = $('this.tblTrips_body');
 
    this.packageStatusChanged_eventHandler = (d)=>{
               let data = d.data;
                    if (data.status_id ==9) toastr.warning(data.message); else if (data.status_id ==8) toastr.success(data.message); else toastr.info(data.message)
                    
                    //mThis.findRow_packageDetail(@trip_id, @barcode) returns a html row (tr) that contains the package detail for updating Status Text
                    if(mThis.tblTrips.is(':visible')) {
                        let tr = mThis.findRow_packageDetail(data.delivery_id,data.barcode);
                        if (tr) {
                          
                               let btn = tr.find('a.dpl_da_change_status');
                               if (btn) btn.text(data.status);
                        } 
              }
    }

    this.init = function() {
        // window.onresize = function(event) {
        //     let div = mThis.tblTrips.parent();
        //     let h = window.screen.height;
        //     if (h>160) h = h-150;
        //     div.css('height',h+'px');
        // };
        
        if(mThis.initialized ==true) return;
        FilterDialog_trip.loadFilterData();
          
        //## begin::listen to Event Notifier (Using self hosted Pusher)

            window.Echo.private(main_view.backend_channel_name).listen('.package_status_changed', (d)=>{ 
                mThis.packageStatusChanged_eventHandler(d);
            });
       //## begin::listen to Event Notifier  (Using self hosted Pusher)

        //## begin::listen to Event Notifier (Using  free online Pusher service )
                //         //var pusher = new Pusher('PUSHER_API_KEY', {
                //         // encrypted: true
                //         //});
                //         let pusher = new Pusher(main_view.PUSHER_APP_KEY,{
                //             //forceTLS:false,
                //             enabledTransports:['ws', 'wss','sockjs'],
                //             cluster:main_view.PUSHER_APP_CLUSTER,
                //          });
                
                //         // Subscribe to the channel we specified in our Laravel Event
                //         let channel = pusher.subscribe('package_info_channel');
                
                //         // Bind a function to a Event (the full Laravel class)
                //         channel.bind('onPackageStatusChanged', function(d){
                              //mThis.packageStatusChanged_eventHandler(d);
                //         });
        // //## end::listen to Event Notifier (Using  free online Pusher service )

        mThis.findRow_packageDetail = (did,barcode)=>{
           let tbl = mThis.tblTrips.find(['table.packagelist_',did].join(''));
           if (tbl) {
               let package_tr = tbl.find(['tbody>tr[data-barcode="',barcode,'"]'].join(''));
               //alert( did + ' => ' + ['tbody>tr[data-barcode="',barcode,'"]'].join(''));
               return package_tr;
           }
        }

         mThis.btnToggleFilter.on('click',(e)=>{
             let op = {'title':'Filter Trips'};
             FilterDialog_trip.show(op,(d)=>{
               if(d) {
                   mThis.displayDeliveryTrips();
               }
             });
         });

        mThis.btnPrint.on('click',(e)=>{
            let d = FilterDialog_trip.getData(); 
            let params = ['rtype=fleetlist&wid=',d.warehouse_id,'&date=',d.date,'&search=',mThis.elSearchTrip.val(),'&driverid=',d.driver_id,'&dtype=',d.delivery_type,'&stid=',d.status_id].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
            });
        }); 

        mThis.btnPDF.on('click',(e)=>{
            let p = FilterDialog_trip.getData();
            p.search_value = mThis.elSearchTrip.val(); 
            try {
                 post_ajax([mThis.base_url, '/api/getDeliveryTrips_print'].join(''),p,function(data){
                     if(data){
                         //data = StringSanitizer.sanitizeObject(data,'email');
                         //mThis.processDeliveryTripList_print() return object @d = {'data':json array,'titles':[]}
                         let d = mThis.processDeliveryTrips_print(data);
                         let op = {'title':'Delivery Trips','title_color':'black','header_columns':d.titles};
                         pdfReport.viewPDF_json(d.data,op); 
                     } 
            });           
            }catch(e){
                cv_interact.alert(e.toString());
            }
           
        }); 

         mThis.btnSearch.on('click',function(){
            mThis.displayDeliveryTrips(null, true);
         });
        
         mThis.btnShowTrackingMap.on('click',(e)=>{
             TrackingMapView.show();
         });

         mThis.elSearchTrip.on('keyup',function(e){
           if (e.keyCode ==13){
              mThis.displayDeliveryTrips(null,true);  
           }
         });
  
         //##BEGIN:: tblPackages dropdown menu
                mThis.tblTrips.on('click','a.btn_trip_action',function(e) {
                    e.preventDefault();
                    let x = $(this);
                    let p = x.parent();
                    let delivery_id = x.data('did');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let driver_id = x.data('driverid');
                    let tknumber = x.data('tknumber');
                    let status_id = x.data('statusid'); 
                     
                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                        p.append(mThis.createDropdownMenuHtml_trip(delivery_id,tknumber,driver_id,status_id));
                        dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');
                    mThis.toggleStartStop(x.closest('tr.trip_header'));  
                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let x = mThis.tblTrips.find('div.dropdown-menu'); 
                    let container =  x.parent(); 
                    //mThis.trip_dropdown_menu.parent(); // div.dropdown
                    
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            //mThis.trip_dropdown_menu.removeClass('show');
                            x.removeClass('show'); 
                        } 
                    }
                });
  
                mThis.tblTrips.on('mouseover','tr',function(e){
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_start_trip = x.find('button._trl_trip_btn_print_info');
                    btn_start_trip.show();
                    col_action.find('a.btn_trip_action>i').addClass('action-button-zoomin');    
                }).on('mouseleave','tr',function(e) {
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_start_trip = x.find('button._trl_trip_btn_print_info');
                    btn_start_trip.hide();
                    col_action.find('a.btn_trip_action>i').removeClass('action-button-zoomin');
         
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });
                
       //##END:: tblPackages dropdown menu
 
       mThis.tblTrips.on('click','a._tl_trip_delete',function(e){
           e.preventDefault();
           let x = $(this).closest('div.dropdown-menu');
           let delivery_id = x.data('did');
           let status_id = x.data('statusid');
           cv_interact.confirm('Delete this trip?','Delete Trip',function(e){
               if(e) {
                   mThis.deleteDeliveryTrip(delivery_id,x.closest('tr'));
               }
           }); 
       });
       
       //print trip's information (Depart time, destination, status, package count)
       mThis.tblTrips.on('click','a._tl_trip_print_trip_info',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let delivery_id = x.data('did');
            //let pid = x.data('pid'); //package id
            window.open([mThis.base_url,'/trip_info/',delivery_id].join(''),'_blank'); 
      });

       //Quick Start Trip button 
       mThis.tblTrips.on('click','tr button._trl_trip_btn_print_info',function(e){
         e.preventDefault();
         let tr = $(this).closest('tr.trip_header');
         mThis.printTripInfo_pdf(tr);
      });

      
       mThis.tblTrips.on('click','tbody>tr.trip_header',function(e){
           let tr = $(this);
           let did = tr.data('did');
           let btn_trip_action = tr.find('td.col_action .btn_trip_action');
           let dropdown_menu = tr.find('td.col_action div.dropdown-menu');
           if(!btn_trip_action.is(e.target) && btn_trip_action.has(e.target).length ===0) {
              //display package details when user click on row (tr) Except clicking on btn_trip_action 
              if (!dropdown_menu.is(e.target) && dropdown_menu.has(e.target).length ===0)  mThis.expanded_detail.displayPackageList(tr,did,false); 
           }
          
          
       });

       //Update Delviery status
       mThis.tblTrips.on('click','a._tl_trip_change_status',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            let delivery_id = tr.data('did');
            let pid = tr.data('pid');
            //let driver_id = tr.data('driverid');
            let def_status_id = tr.data('statusid');
            //let sender_id = tr.data('senderid');
 
            let option = {
                "title":"Set Trip Status",
                "data":mThis.statuses,
                "textMember":"status_name", //status code
                "valueMember":"id",  // status name of delivery. Whereas status_id is used in table order.status_id
                "dataLabel":"Choose trip status",
                'blankErrorMessage':'Please select one status',
                'okBtnText':'OK',
                'defaultValue': def_status_id
            };

            InputBox2.show(option,function(data) {
                if(data) {
                    let p = {
                        "delivery_id":delivery_id,
                        "status_id":data.value
                    };
                    
                    post_ajax([mThis.base_url,'/api/updateTripStatus'].join(''),p,(err)=>{
                        if(!err || err =='') {
                            let td = tr.find('td.trip-status');
                            td.find('a.pg-text').text(data.text);
                        } else cv_interact.alert(err,'','error');
                    });
                 }
            });
       });

        //click to Stop Delivery usually prematurely
        mThis.tblTrips.on('click','a._tl_trip_start_trip',function(e){
            e.preventDefault();
            let deliveryTypes = ['normal','fast'];
            let x = $(this);
            let tr = x.closest('tr');
            let delivery_id = tr.data('did');
            //let delivery_type = tr.find('td.delivery_type').text();
            //delivery_type = (delivery_type+'').toLowerCase();
            // if(deliveryTypes.indexOf(delivery_type) ==-1) {
            //     cv_interact.alert('Delivery Type is not correct!','','warning');
            //     return;
            // }

            cv_interact.confirm('Are you sure to start this trip now?','Start Trip',function(e){
                if(e){
                   mThis.startDeliveryTrip(delivery_id);
                }
            },'Depart','Close');
       });

       //click to Stop Delivery usually prematurely
       mThis.tblTrips.on('click','a._tl_trip_stop_trip',function(e){
            e.preventDefault();
            let x = $(this);
            let tr = x.closest('tr');
            let delivery_id = tr.data('did');
            let op = {'title':'Finish Trip',defaultValue:'បញ្ចប់ដោយបុក្គលិកការិយាលយ័',dataLabel:'បញ្ចូលហេតុផលសំរាប់ទំនិញមិនទាន់ដឹកដល់ភ្ញៀវ','blankErrorMessage':'ហេតុផល?','btnOKText':'Finish Trip Now'}; 
            InputBox1.show(op,(d)=>{
                mThis.finishDeliveryTrip(delivery_id,d);
            });
              
            // cv_interact.confirm('Are you sure to finish this delivery trip?','Finish Trip',function(e){
            //     if(e){
            //        mThis.finishDeliveryTrip(delivery_id);
            //     }
            // },'Finish Trip Now','Close');
       });
       
       mThis.tblTrips.on('click','a._tl_trip_print_package_list',function(e){
           e.preventDefault();
           let tr = $(this).closest('tr.trip_header');
           mThis.printTripInfo_pdf(tr);
       });
        
         //Admin user clicks to add package to a Delivery Trip for Advanced editing or adjustment with special previlege
         mThis.tblTrips.on('click','a._tl_trip_add_package',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr').next();
            if(tr.hasClass('package_list')){
                mThis.AddItemToTrip(tr);
            } else {
                let tr1 =$(this).closest('tr.trip_header');
                let did =  tr1.data('did');
                let td = tr1.find('td.fleet_tracking_number');
                let tknumber = td?td.text():null;
                mThis.AddItemToTrip(tr,did,tknumber);
            }
         });

       //change Driver to Delivery Trip
       mThis.tblTrips.on('click','a._tl_trip_change_driver',function(e){
        e.preventDefault();
        let x = $(this);
       
        let tr = x.closest('tr');
        //let def_driver_id = tr.data('driverid');
        let delivery_id = tr.data('did');

        let op = {'title':'Change Delivery Driver',role:'driver','singleSelect':true};
        FindPersonDialog.show(op,(ps)=>{
           if(ps[0]) {
               let d = ps[0];
              let p = {'delivery_id':delivery_id,'driver_id':d.id}; 
              post_ajax([mThis.base_url,'/api/changeDeliveryDriver'].join(''),p,function(err){
                 if(!err || err =='') 
                   {
                    tr.data('driverid',d.id);
                    tr.find('td.driver_name').text(d.name);
                   }else cv_interact.alert(err,'','error');
              });
           } 
        });

        // let option = {'title':'Change Driver','dataLabel':'Select a driver','valueMember':'id','textMember':'driver_name','data':mThis.form_data.drivers,'blankErrorMessage':"Please choose one driver"};
        // InputBox2.show(option,function(d){
        //     if(d){
        //         p.driver_id = d.value; /** d.value = driver id and d.text = driver name **/
        //         post_ajax([mThis.base_url,'/api/changeDeliveryDriver'].join(''),p,function(err){
        //             if(!err) {
        //                 tr.data('driverid',d.value);
        //                 tr.find('td.col_driver').text(d.text);
        //                 //mThis.displayPickupList();
        //             } else cv_interact.alert(err,'','error');
        //         });
        //     }
        // });

    });
       
      //Click to refresh package list (in case other users add or remove packages on other machines)
      mThis.tblTrips.on('click','tbody>tr.package_list a.trl_pa_refresh',function(e){
          e.preventDefault();
          let tr= $(this).closest('tr.package_list');
          mThis.expanded_detail.refreshPackageList(tr);
      });
    //Click to print package's barcode
     mThis.tblTrips.on('click','tbody>tr.package_list a.dpl_da_print_barcode',function(e){
        e.preventDefault();
        let barcode = $(this).closest('tr').data('barcode');
        //let pid = x.data('pid'); //package id
        window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
    });
     
     //Click to remove package from a trip
     mThis.tblTrips.on('click','tbody>tr.package_list a.dpl_da_delete',function(e){
        e.preventDefault();
        let tr = $(this).closest('tr');
        let did = tr.data('did');
        let barcode =tr.data('barcode');

        cv_interact.confirm('Take this package out of the trip?','Take Package Out',function(e){
            if(e){
               let p = {'delivery_id':did,'barcode':barcode};
               post_ajax([mThis.base_url,'/api/removePackageFromTrip'].join(''),p,function(result){
                   if(result.status =='OK') {
                      mThis.expanded_detail.refreshPackageList(tr);
                      if (result.package_count ==0) {
                          let header_tr = tr.prev();
                          if(header_tr.hasClass('trip_header')) header_tr.remove();
                          tr.remove();

                          //Refresh Trip header detail (fields: package_count, total, Status)
                          let m = {'status_id':result.status_id,'status':result.status,'total':result.total,'package_count':result.package_count};
                          mThis.refreshTripInfo(header_tr,m);
                      }
                   }else cv_interact.alert(result.error_message,'','error');
               });
            }
        },'Take Out','Cancel');
    });

     //Click to change package's status (Act on behalf of driver to update package's status AS "delivered" or "failed" )
     mThis.tblTrips.on('click','tbody>tr.package_list a.dpl_da_change_status',function(e){
        e.preventDefault();
        let x = $(this);
        let tr = x.closest('tr.package_list');
        let delivery_id = x.data('did');
        //let barcode = x.data('barcode');
        let package_id = x.data('pid');
        let def_status_id = x.data('statusid');
        let def_notes = x.data('notes'); //todo: sanitize notes text for security
        let op = {'title':'Change Package Status','status_id':def_status_id,'notes':def_notes};
        if (!package_id || package_id<=0) {
            cv_interact.alert('Package identity is missing or invalid!');
            return;
        }
        if (!delivery_id || delivery_id<=0) {
            cv_interact.alert('Trip identity is missing or invalid!');
            return;
        }
        PackageStatusDialog.show(op,(d)=>{
            if(d){
                //Checking package's status HERE => also allowing the auto update of trip's status to DONE if all packages are "delivered" or "failed"
                let p = {'update_trip_status':1,'delivery_id':delivery_id,'package_id':package_id,'status_id':d.status_id,'failure_notes':d.notes};
                post_ajax([mThis.base_url,'/api/updatePackageStatus'].join(''),p,function(result){
                    if(result.status=='OK'){ 
                       mThis.expanded_detail.refreshPackageList(tr);
                       if(result.trip_status_id==3) {
                           let trip_tr = tr.prev();
                           if(trip_tr){ 
                              if(trip_tr.hasClass('trip_header')) {
                                mThis.refreshTripInfo(trip_tr,{'status_id':result.trip_status_id,'status':'Done'});
                              }
                           }
                        } 
                    }else cv_interact.alert(result.error_message,'','error');
                });
            }
        }); 
        //alert('todo:change package status');

     });

       //Click to Create new Delivery Trip     
        mThis.btnNewTrip.on('click',function(e){
            e.preventDefault();
            let def_warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
            let option ={'title':'New Delivery Trip','warehouse_id':def_warehouse_id,'delivery_id':null,'driver_id':null};
            DeliveryDialogTrip.show(option,function(d){
                if(d){
                    //Trip started ...
                    //Refresh trip list?
                    mThis.displayDeliveryTrips();
                }
            });  
        });
      
        //initialize class "expanded_detail", which is the package's dropdown expanded detail
        mThis.expanded_detail.init();

        mThis.initialized = true;
    }
    //end::TripListComponent.init()

    //show Trip List panel
    this.show = (option)=>{
        mThis.trip_list_pane.show().siblings().hide();
        mThis.elScreenTitle.html(option.title);
        //set default initial filter data to => "On delivery" only for all dates, all drivers
        //mThis.remembered_filter = {'warehouse_id':main_view.DEF_WAREHOUSE_ID,'date':null,'delivery_type':null,'driver_id':null,status_id:2};
        mThis.displayDeliveryTrips(null);
        mThis.self.show().siblings().hide();
        //Show subComponent: PackageListPanel
    }

    //Toggle visibility of Start/Stop menu item on Dropdown action menu based on trip status
    this.toggleStartStop = (tr)=>{
        if (!tr) return;
        //let tr= action_button.closes('tr');
        let td = tr.find('td.col_action');
        let trip_status_id = tr.data('statusid');
       
        //trip status 1= Pending, 2= ON delivery, 3= Done , 4 =Delayed
        let cls = "._tl_trip_start_trip";
        if(trip_status_id ==2) cls ="._tl_trip_stop_trip";
        td.find(['div.dropdown a.tog-visible', cls].join('')).show().siblings('.tog-visible').hide();
    }

   this.refreshTripInfo = (tr,d)=>{
        if(!tr) return;  

        if(d.status) {
            let status_text = tr.find('td.trip-status>a'); //not "td.status"
            tr.data('statusid',d.status_id);
            status_text.data('statusid',d.status_id);
            status_text.data('status',d.status);
            status_text.text(d.status);
        }
       

        if (d.package_count) {
          tr.find('.package_count').text(d.package_count);
        }

        if(d.status){
            tr.find('.trip-driver-total').text(d.total);
        }
   }

   this.finishDeliveryTrip = (delivery_id,notes)=>{
        let p = {'delivery_id':delivery_id,failure_notes:notes};
        post_ajax([mThis.base_url,'/api/finishDeliveryTrip'].join(''),p,function(err){
            if(!err || err ==''){
            mThis.displayDeliveryTrips();//refresh Trip List of Fleet list
            }else cv_interact.alert(err,'','error');
        });
   }  
  this.startDeliveryTrip = (delivery_id)=>{
    let p = {'delivery_id':delivery_id,'driver_id':mThis.driver_id};
    post_ajax([mThis.base_url,'/api/startDeliveryTrip'].join(''),p,function(result){
        if(result.status =='OK'){
          cv_interact.alert(['<span style="font-weight:bold;font-size:1.2em;color:green">Trip started with tracking number: ',result.fleet_tracking_number,'</span>'].join(''));  
          //For ease of sight => when a new delviery started, set filter to status = "On Delivery" and display last created trip first
          FilterDialog_trip.setFilterData({'date':null,'delivery_type':null,'driver_id':null,'status_id':2});
          TripListComponent.elSearchTrip.val(null);
          mThis.displayDeliveryTrips();//refresh Trip List of Fleet list
        }else cv_interact.alert(result.error_message,'','error');
    });
  }  
 
   this.createDropdownMenuHtml_trip = function(delivery_id,tknumber,driver_id,status_id) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-tripid="',delivery_id,'" data-did="',delivery_id,'" data-tknum="',tknumber,'" data-driverid="',driver_id,'" data-statusid="',status_id,'">',
        '<a class="dropdown-item _tl_trip_start_trip tog-visible" href="#"><i class="fas fa-play trl-menu-icon" style="color:green"></i> Start Trip</a>',
        '<a class="dropdown-item _tl_trip_stop_trip tog-visible" href="#"><i class="fas fa-stop trl-menu-icon" style="color:#2405E1"></i> Finish Trip</a>',
        '<a class="dropdown-item _tl_trip_change_driver" href="#"><i class="fas fa-biking trl-menu-icon" style="color:green"></i> Change Driver</a>',
        '<div class="dropdown-divider"></div>',
        '<a class="dropdown-item _tl_trip_add_package" href="javascript:;"><i class="fas fa-plus trl-menu-icon" style="color:green"></i> Add Package</a>',
        '<a class="dropdown-item _tl_trip_print_package_list" href="#"><i class="fas fa-info trl-menu-icon" style="color:green"></i> Print Trip Info</a>',
        '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _tl_trip_delete" href="#"><i class="fas fa-times trl-menu-icon" style="color:red"></i> Delete Trip</a>',
        //   '<a class="dropdown-item _tl_trip_change_status" href="#"><i class="fa fa-edit trl-menu-icon" style="color:blue"></i> Change Trip Status</a>',
          '</div>'].join('');
          return html;
    };

    this.deleteDeliveryTrip = (delivery_id,tr)=>{
        let p = {'delivery_id':delivery_id};
       post_ajax([mThis.base_url,'/api/deleteDeliveryTrip'].join(''),p,function(err){
         if(!err || err =='') 
             {
                if (tr) {
                    //remove the selected Trip from Trip List without querying again from Server => (Not relaly up to date in case of multi user environment)
                    let detail_tr = tr.next();
                    if (detail_tr.hasClass('package_list')) {
                        detail_tr.remove(); //remove row that contains package list, if any 
                    }
                    tr.remove(); //remove Trip list row
                } else 
                  mThis.displayDeliveryTrips();//refresh Trip List by querying data again from Server
         } else cv_interact.alert(err,'','error');
       });
    }

    //Add item to a trip for Adjustment or advanced editing purpose
    this.AddItemToTrip = (list_tr,did,tknumber)=>{
        if(!list_tr && did) return;  
        if(!tknumber) tknumber = list_tr.data('tknumber');
        //let trip_status_id = list_tr.data('tstatusid'); //Not exists yet
        if (!did) did = list_tr.data('did');
        let op = {'title':['Add Pacakge to Trip',tknumber].join(''),'delivery_id':did};
        let onDone = (p)=>{
          post_ajax([mThis.base_url,'/api/addPackageToTrip'].join(''),p,function(err){
              if(!err || err =='') {
                 if (list_tr) mThis.expanded_detail.refreshPackageList(list_tr); 
                 else cv_interact.alert(['<span style="color:green;font-weight:bold;">1 package added to trip ', tknumber,'</span>'].join(''),'','info');   
              }else cv_interact.alert(err,'','error');
          });
        } 
        AddItemToTripDialog.show(op,onDone);
    }

    this.processPackageListByTrip_print = (data)=>{
        let titles = ['ល.រ','លេខកូដ','អ្នកផ្ញើរ','អ្នកទទួល','ថ្លៃទំនិញ','ថ្លៃសេវា','ថ្លៃបញ្ជូន','សរុប(KHR)','សរុប(KHR)','ស្ថានភាព'];
        if(mThis.lang =='en') titles = ['No','Barcode','Sender Name','Receiver Phone','COD','Fees','Taxi',,'Total (USD)','Total(KHR)','Status'];
        let c,i=0;
        let rows=[];
        do{
          c = data[i];
          if(!c) break;
             if(!c.cur) c.cur ='$';
             if(!c.cod_amount) c.cod_amount =0;
             if(!c.fees) c.fees= parseFloat(c.base_fee) + parseFloat(c.delivery_fee);
             //let fees_khr = (c.fees * parseFloat(c.exchange_rate));
             let total = parseFloat(c.price) + parseFloat(c.fees) + parseFloat(c.forwarding_cost);
             c.fees = Number(c.fees).toFixed(2);
             let total_khr = total * parseFloat(c.exchange_rate);
             total = Number(total).toFixed(2);
             total_khr = Number(total_khr).toFixed(2);
             let row = {'numero':(i+1),'barcode':c.barcode,'sender_name':[c.sender_name,'\r\n',c.sender_phone].join(''),'receiver_phone':[c.zone_name,'\r\n',c.receiver_phone].join(''),'COD':[c.cur,c.price].join(''),'fees':[c.cur,c.fees].join(''),'forwarding_cost':[c.cur,c.forwarding_cost].join(''),'total':[c.cur,total].join(''),'total_khr':['៛',total_khr].join(''),'status':c.status};
              rows.push(row);
             i++;
        }while(c);
        return {'data':rows,'titles':titles};
    }

     //printTripInfo_pdf() is to print trip info including package list in PDF. parameter @tr is the  trip_header_row or <tr class="trip_header" ..> 
     this.printTripInfo_pdf =(tr)=>{
        let did = tr.data('did');
        let tknumber = tr.data('tknumber');
        let p = {'delivery_id':did};
        
         post_ajax([mThis.base_url,'/api/getTripInfo'].join(''),p,function(d) {
             let packages = StringSanitizer.sanitizeObject(d.packages);
             let m = mThis.processPackageListByTrip_print(packages);       
             let op = {'title':['Trip ',tknumber].join(''),'title_color':'blue','sub_title':['Driver ',d.driver_name].join(''),'sub_title_color':'green','header_columns':m.titles};
             if (mThis.lang =='kh')  op = {'title':['ជើងដឹកលេខ ',tknumber].join(''),'title_color':'blue','sub_title':['អ្នកដឹក ',d.driver_name].join(''),'sub_title_color':'green','header_columns':m.titles};
             op.styles = {
                heading_detail_item:{
                    fontSize: 11,
                    bold: true,
                    color:'grey',
                    //margin: [0, 0, 0, 0],
                    alignment: 'left'
                }
             }
             op.heading_contents = [
                {"text":["កាលបរិច្ឆេទ: ",d.depart_date].join(''),"style":"heading_detail_item"},
                {"text":["ចំនួនកញ្ចប់: ",d.package_count],"style":"heading_detail_item"},
                {"text":["ស្ថានភាព  :",d.status].join(''),"style":"heading_detail_item"},
                // {
                //         canvas: 
                //         [
                //             {
                //                 type: 'line',
                //                 x1: 0, y1: 60,
                //                 x2: 260, y2: 60,
                //                 lineColor:'green',
                //                 lineWidth: 2,
                //             }
                //         ]
                // }
             ]; 
             pdfReport.viewPDF_json(m.data,op); 
         });
    }

    //returns json object {array of json_objects, and array of string @titles}
    this.processDeliveryTrips_print = (data)=>{
        let titles =['Date','Tracking#','Driver Name','Vehicle Type','Packages','COD','Base Fee','Delivery Fee','Status'];
        let c,i=0;
        let rows=[];
        do{
          c = data[i];
          if(!c) break;
             if(!c.cur) c.cur ='$';
             if(!c.cod_amount) c.cod_amount =0;
             if(!c.fees) c.fees=0;
             let row = {'depart_date':c.depart_date,'fleet_tracking_number':c.fleet_tracking_number,'driver_name':c.driver_name,'vehicle_type':c.vehicle_type,'package_count':c.package_count,'total_cod_amount':c.cod_amount,'total_base_fee':c.total_base_fee,'total_delivery_fee':c.total_delivery_fee,'status':c.status};
              rows.push(row);
             i++;
        }while(c);
        return {'data':rows,'titles':titles};
    }

    this.displayDeliveryTrips = function(filter,search_action = false)
    {   
        let p = filter;
        if(!p) p = FilterDialog_trip.getData();
              
        if (search_action == true) p.search_value = mThis.elSearchTrip.val();
        // if (!p.warehouse_id) {
        //     //cv_interact.alert('No Origin Warehouse selected!');
        //     return;
        // }
        //getDeliverytripList() , getTripList
        post_ajax([mThis.base_url, '/api/getDeliveryTrips'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            if (mThis.table){
                    mThis.tblTrips.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblTrips.empty();
                    //alert('destroyed => '+  mThis.tblTrips.html());
                    mThis.table = null;
            }
              
            data = StringSanitizer.sanitizeObject(data);
            
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
                             '<a href="#" data-did="',data.id,'" data-driverid="',data.driver_id,'" data-tknumber="',data.fleet_tracking_number,'" data-statusid="',data.status_id,'" class="btn_trip_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        className:'fleet_tracking_number',
                        data:function(data,a,b){
                            let n =data.fleet_tracking_number;
                             return ['<div style="display:flex;flex-direction:row">',
                             '<span style="display:block;margin-right:20px">',n?n:'(?)','</span>',
                             '<button style="display:none" data-did="',data.id,'" type="button" class="btn btn-sm btn-success _trl_trip_btn_print_info"><i class="fas fa-info"></i></button>',
                            '</div>'].join('');
                        },
                        title:'Tracking'
                    },
                    {
                        className:'depart_date', 
                        data:'depart_date',
                        title:'Date'
                    },
                    {
                        className:'depart_time', 
                       data:function(data,a,b){
                           if (data.status_id ==1)
                              return '(Not Yet)';
                           else if (data.status_id >=2)
                              return data.depart_time;
                           else if (data.status_id ==0) 
                            return 'Canceled';
                           else return 'NA';      
                       },
                       title:'Depart Time'
                    },
                    // {
                    //     className:'delivery_type', //class is very important for retrieving value @delivery_type to start trip
                    //     data:function(data,a,b) {   
                    //         return data.delivery_type;
                    //     },
                    //     title:'Type'
                    // },
                    {
                        className:'vehicle_type',
                        data:function(data,a,b){
                            return data.vehicle_type?data.vehicle_type:'NA';
                        }, 
                        title:'Vehicle'
                    },
                    {
                        className:'driver_name',
                        data:'driver_name',
                        title:'Driver'
                    },
                    {
                        className:'package_count',
                        data:'package_count',
                        title:'Package Count'
                    },
                    {
                        className:'driver_total',
                        data:function(data,a,b){
                          return ['<div style="display:flex;flex-direction:column">',
                              '<div><span class="total-value trip-driver-total">',data.driver_total,'</span></div>',
                              //'<div<span class="total-value trip-pmt-status">',data.pmt_status,'</span></div>',
                          '</div>'].join(''); 
                      },
                      title:'Total'
                    },
                    {
                        className:'trip-status',
                        data:function(data,type,meta) {
                            return ['<a class="pg-text _trip_status button-move" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" href="javascript:;">',data.status,'</a>'].join('');
                        },
                        title:'Status'
                    }
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblTrips.DataTable({
                searching:false,
                destroy:true,
                paging:true,
                pageLength:7,
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
                        "emptyTable": "No delivery trips found!"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          let tr = $(row);
                          tr.addClass('trip_header'); 
                          tr.data('did',data.id); //delivery_id                      
                          tr.data('tknumber',data.fleet_tracking_number);
                          tr.data('driverid',data.driver_id); //driver_id
                          tr.data('statusid',data.status_id); 
                       }

                //    ,"cellCreated":function(td,data,colIndex) {
                //        alert('test');
                //      if(colIndex==9){
                //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                //         $(td).html(html); 
                //      }
                //   }      								
            });
          
            // let div = $('#_trl_d_filter_panel');  
            // $('#_trl_tblPackages_wrapper>div.dt-buttons').prepend(div);
             

           				  
        }); //close post_ajax()         
    };
  
   //refresh display of Status data on screen Fleet List or "Trip List" 
   this.updateTripStatus = (tr,d)=>{
      tr.data('statusid',d.status_id);
      tr.find('td.col_status').text(d.status_name);
      if (tr.hasClass('dpl-selected')){
          //todo: update related packages's status
      }
   } 

    //### begin::expanded_detail class Package's expanded detail class view 
        this.expanded_detail = new function(){
            this.is_editing = false;
            let mThis = this;
            this.base_url = $('#__base_url').val()
            
                //begin::expanded_detail.init()
                this.init =()=>{
                  
                  return;
                }
                //end::expanded_detail.int();
  
            //displayPackageDetails() display list of packages belonging to a trip (expanded dropdown list)
            //paramter @tr is <tr.dpl-header> package ehader trow
            this.displayPackageList = (tr,did=0,force_expand =false)=>{
                if(!tr) return; 
                let p = {'delivery_id':did};
                let detail_tr =null;
                if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('dpl-selected');
                tr.removeClass('dpl-selected');
        
                //begin:: if details already displayed, then do not load data again
                let next_tr = tr.next();
                if (!next_tr) 
                detail_tr = null;
                else{
                    if (next_tr.hasClass('package_list')){
                        let is_visible = next_tr.is(':visible');
                        if(is_visible) 
                        {
                                if (force_expand == true) {
                                    tr.addClass('dpl-selected');
                                    if (mThis.prev_package_detail_tr) mThis.prev_package_detail_tr.hide();
                                    //next_tr.find('div.package_list_wrapper').addClass('effect-zoomin');//delay(5000).remove('effect-zoomin');
                                    next_tr.show(); 
                                    mThis.prev_selected_tr = tr;
                                    //next_tr.css('display','inline-block'); 
                                    mThis.prev_package_detail_tr = next_tr;
                                } 
                                else {
                                    next_tr.hide(); 
                                    tr.removeClass('dpl-selected');
                                    return;
                                }
                        }
                        else  
                        {
                            if (mThis.prev_package_detail_tr) mThis.prev_package_detail_tr.hide();
                            next_tr.show();
                            tr.addClass('dpl-selected');
                            //next_tr.css('display','inline-block'); 
                            mThis.prev_package_detail_tr = next_tr; 
                            mThis.prev_selected_tr = tr;
                            return;
                        }
                        
                    } else detail_tr = null;
                }  
                
                //end::if details already displayed, then do not load data again
            
                if(!detail_tr || detail_tr.length <=0){
                        post_ajax([mThis.base_url,'/api/getPackageListByTripId'].join(''),p,function(rows) {
                            if (typeof rows =='string') alert(rows); //in case of unexpected error
                            if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('dpl-selected');
                            TripListComponent.tblTrips.find('tbody>tr.package_list').hide(); 
                            if(rows){
                                rows = StringSanitizer.sanitizeObject(rows);
                                
                                //createExpandedPackageList() is to create expended 'package list' row "<tr.package_list pd_#>" that contains list of packages for the given @delivery_id 
                                mThis.prev_package_detail_tr  = mThis.createExpandedPackageList(tr,did,rows);
                                tr.addClass('dpl-selected');
                                mThis.prev_selected_tr = tr;
                                
                            }
                        });  
                }else{
                    tr.removeClass('dpl-selected');
                    detail_tr.hide(); 
                }
            
            }

            //createExpandedPackageList is to create html row that contains expanded package's dteails (or dropdown details)
            //@tr is <tr.trip_header> trip header header row
            this.createExpandedPackageList = (tr,did,packages)=>{
                let specific_class = ["pl_",did].join(''); //pl_ stands for "package list _#" # is @delivery_id
                //NOTE: tr data-pid ="" is very IMPORTANT for editing expanded package detail in dropdown view
                let p_list = null;
                let i=0,c;
                let action_buttons_html =['<div class="button-group dpl-action_buttons">',
                '<a href="#" class="btn btn-sm btn-outline-danger dpl_da_delete"><i class="fas fa-times"></i></a>&nbsp;',
                //'<a href="#" class="btn btn-sm btn-outline-success dpl_da_edit"><i class="fas fa-edit"></i></a>&nbsp;',
                '<a href="#" class="btn btn-sm btn-outline-success dpl_da_print_barcode"><i class="fa fa-barcode"></i></a>&nbsp;',
                '</div>'].join('');
                let table_header = '<thead><th>Product</th><th>Sender</th><th>Receiver</th><th>Zone</th><th>COD</th><th>Base Fee</th><th>Delivery Fee</th><th>Taxi Fee</th><th>Total</th><th>Status</th><th><a href="#" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:orange;font-size:1.3em"></i></a></th></thead>';
                do{
                c = packages[i];
                if(!c) break;
                if(!c.cur) c.cur ='$';
                if (!c.product_type) c.product_type ='Generic';
                let fees = c.base_fee + c.delivery_fee + c.forwarding_cost; 
                let p_row = ['<tr data-did="',c.delivery_id,'" data-barcode="',c.barcode,'" data-pid="',c.package_id,'">',
                //'<td>',c.barcode,'</td>',
                '<td>',c.product_type,'</td>',
                '<td><span class="trl-sendername-text">',c.sender_name,'</span><span class="trl-senderphone-text">',c.sender_phone,'</span></td>',
                '<td><span class="pg-badge-delivery_type">',c.delivery_type,'</span><span class="trl-receiverphone-text">',c.receiver_phone,'</span></td>',
                '<td><span class="trl-zonecode-text">',c.zone_code,'</span><span class="trl-zonename-text">',c.zone_name,'</span></td>',
                '<td>',[c.cur,c.cod_amount].join(''),'</td>',
                '<td>',[c.cur,c.base_fee].join(''),'</td>',
                '<td>',[c.cur,c.delivery_fee].join(''),'</td>',
                '<td>',[c.cur,c.forwarding_cost].join(''),'</td>',
                '<td>',[c.cur,c.driver_total].join(''),'</td>',
                '<td><a href="#" data-notes="',c.failure_notes,'" data-did="',c.delivery_id,'" data-pid="',c.package_id,'" data-statusid="',c.status_id,'" class="btn btn-sm btn-outline-primary dpl_da_change_status">',c.status,'</a></td>',
                '<td>',action_buttons_html,'</td>',
                '</tr>'].join('');

                p_list = [p_list,p_row].join('');
                i++;
                }while(c);
                if(p_list) 
                p_list = ['<div class="package_list_wrapper"><table class="packagelist_',did,' trl-package_table fixed-body-table">',table_header,'<tbody style="max-height:450px">',p_list,'</tbody></table></div>'].join(''); 
                else  
                 {
                    tr.find('td.package_count').text(0); //ensure the package_count is displayed correctly
                    p_list = '<div class="alert alert-warning">ជើងដឹកមួយនេះមិនមានអីវ៉ាន់​&nbsp;&nbsp;<a href="#" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:#fff;font-size:1.3em"></i></a></div>';
                 }
                let d_html =['<tr data-did="',did,'" class="package_list ',specific_class,'">',
                '<td colspan="11">',p_list,'</td>',
                '</tr>'].join(''); 
                tr.after(d_html);
                return  TripListComponent.tblTrips.find(['tbody>tr.',specific_class].join(''));
            
            }

             this.refreshPackageList = (package_list_tr) =>{
                 if(!package_list_tr) return;
                 let delivery_id = package_list_tr.data('did');
                 if(delivery_id) {
                   let trip_header_row = package_list_tr.prev();
                   if (trip_header_row) {
                    
                      let p = {'delivery_id':delivery_id};
                      post_ajax([mThis.base_url,'/api/getPackageListByTripId'].join(''),p,(packages)=>{
                          if(packages) {
                            packages = StringSanitizer.sanitizeObject(packages,'email');   
                            package_list_tr.remove();
                            mThis.createExpandedPackageList(trip_header_row,delivery_id,packages);
                          }
                      }); 
                   }
                 }
                
             }   
 }
 //##end::expanded_detail class

}
//## end::TripListComponent
 
 

// DeliveryTripDialog DeliveryDialogTrip => user can create New Delivery trip for a particular Sender or Seller. and add multiple packages (from that particular Sender) to be delivered
//begin::DeliveryDialogTrip similar to ReceivePackageDialog, but user can find and set Seller or Sender info
//NOTE DeliveryDialogTrip depends on another javascript class called "EditableTable" that is defined in "PickupListComponent.js"
var DeliveryDialogTrip = new function() {
    let mThis = this;
    this.self = $('#_trl_dlgDeliveryTrip');
    this.base_url = $('#_base_url').val();
    this.elTitle =$('#_trl_dlgDeliveryTripTitle');
    this.lnkFindDriver = $('#_trl_trip_lnkFindDriver');
    this.btnAddPackage = $('#_trl_trip_add_package');
 
    this.btnStartDeliveryTrip = $('#_trl_trip_btnSaveTrip');
    this.btnClose = $('#_trl_trip_btnClose'); 
  
    //this.elDriver = $('#_trl__trip_driver'); //allow user to search instead
    this.elDepartTime = $('#_trl_trip_depart_time');
    this.elDeliveryType = $('#_trl_trip_delivery_type');
    this.elVehicleType = $('#_trl_trip_vehicle_type');
    this.elDriverCode = $('#_trl_trip_driver_code');
    this.elDriverId = $('#_trl_trip_driver_id'); 
    this.elDriverName = $('#_trl_trip_driver_name'); 
   
    this.lnkFindSender = $('#_trl_trip_lnkFindSender');
   

    this.tblTrips = $('#_trl_trip_tblPackages');
    this.elError = $('#_trl_trip_error');
     
    this.tblTrips_body = $('#_trl_trip_tblPackages_body');
    
    this.elBarcode = $('#_trl_trip_barcode');
    this.btnScan = $('#_trl_trip_btnScan');
    this.btnPrintBarCode = $('#_trl_trip_btnPrintBarcode');

    this.btnScan.on('click',(e)=>{
        e.preventDefault();
        let p = mThis.getData();
        mThis.scanPackageOut(p);
    });

    this.elBarcode.on('keypress',function(e){
        if(e.keyCode==13) {
            let p = mThis.getData();
            mThis.scanPackageOut(p);
        }
    });
   
    //Close or cancel
    mThis.btnClose.on('click',function(e){
        e.preventDefault();
        let p = {'delivery_id':mThis.delivery_id};
        //When user cancels or closes the dialog without pressing Start Trip dialog => then Delete the newly created trip
        //deleteNewTrip() is to delete Newly Created Trip without delting related packages.
        //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
        if (p.delivery_id){
            post_ajax([mThis.base_url,'/api/deleteNewTrip'].join(''),p,function(err){
            });
        }
        mThis.self.modal('hide');
   }); 

   mThis.btnStartDeliveryTrip.on('click',function(e){
       let p = mThis.getData();
       if (!p) {
           cv_interact.alert('Invlid delivery data input');
           return;
       }
       p.driver_id = mThis.driver_id;
       post_ajax([mThis.base_url,'/api/startDeliveryTrip'].join(''),p,function(result){
         if (result.status =='OK'){
             if (typeof mThis.onClose =='function') mThis.onClose(p); 
             mThis.self.modal('hide');
             cv_interact.alert(['<span style="color:green;font-size:1.2em">Delivery Started! Fleet tracking number: ',result.fleet_tracking_number,'</span>'].join(''));
         }else{
             cv_interact.alert(result.error_message);
         }
       });
   });
     
    mThis.lnkFindDriver.on('click',function(e){
        e.preventDefault();
        let onClose = (ds)=>{
            if(ds[0]) {
                let d = ds[0];
                mThis.displayDriverInfo(d,false);
            }
        };

        let option = {'title':'Find Driver','role':'driver','singleSelect':true,'previousDialog':mThis.self};
        FindPersonDialog.show(option,onClose);
    });

    mThis.btnAddPackage.on('click',function(e){
        e.preventDefault();
       mThis.scanPackageOut();
      
    });

    mThis.tblTrips.on('click','td.col_action button._pl_remove_package',function(e){
      e.preventDefault();
      alert('todo:remove package');  
   });

   mThis.tblTrips.on('click','td.col_action button._pl_print_barcode',function(e){
       e.preventDefault();
       let tr = $(this).closest('tr');
       //let btn_print_trip_info = $(this);
       let did = $(this).data('did');
       let barcode = $(this).data('barcode');
       window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
   });
  
   mThis.tblTrips.on('click','tbody>tr a._tl_pa_remove',function(e){
       e.preventDefault();
       let tr = $(this).closest('tr');
       mThis.removePackageRow(tr); 
   });
   
   mThis.tblTrips.on('click','tbody>tr a._tl_pa_print_barcode',function(e){
    e.preventDefault();
       let barcode = $(this).data('barcode');
       if((barcode+'').trim() ==''){
        cv_interact.alert('The barcode is invalid or unexpectedly empty!');
        return;
     }
       window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
   });
   
    this.btnPrintBarCode.on('click',(e)=>{
      e.preventDefault();
      let barcode = mThis.elBarcode.val();
      if((barcode+'').trim() ==''){
         mThis.elBarcode.parent().addClass('has-error');
         return;
      }
      window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
    });

   this.clearForm = ()=>{
       mThis.delivery_id = null;
       mThis.warehouse_id =null;
       mThis.tblTrips_body.empty();
       mThis.elDepartTime.val(DateHelper.getTodayDate());
       mThis.elDriverCode.val(null);
       mThis.elDriverId.val(null);
       mThis.elDriverName.val(null);
       mThis.elBarcode.val(null);
       mThis.elVehicleType.val('motobike');
   }

   this.show = (option,onClose) =>{
            if(!option) option = {};
            mThis.elError.html(null);
            mThis.elTitle.html(option.title?option.title:'New Delivery Trip');
            mThis.onClose = onClose;
            mThis.delivery_id = null;
            mThis.clearForm();  
            if (!mThis.form_data) mThis.form_data = TripListComponent.form_data;
            //mThis.delivery_id = option.delivery_id;
            mThis.driver_id = option.driver_id;       //driver_id is optional
            mThis.warehouse_id = option.warehouse_id; //warehouse_id is a MUST (required)
            if (!mThis.warehouse_id || mThis.warehouse_id <=0) {
                 cv_interact.alert('Warehouse identifier is not valid');
                 return;
            }
           
            mThis.loadFormOptions(null,function(){
                if (mThis.driver_id>0) {
                    mThis.displayDriverInfo(mThis.driver_id,true);
                }
                mThis.self.modal({
                    backdrop:'static'
                });
            });
            //mThis.loadDrivers({'driver_id':mThis.driver_id});
           
   }
   
   this.displayDriverInfo = (data,fromServer=false)=>{
     if(fromServer){
         let p = {'driver_id':data};
         post_ajax([mThis.base_url,'/api/getDriverInfo'].join(),p,function(d){
            d = StringSanitizer.sanitizeObject(d);
            mThis.elDriverCode.val(d.code);
            mThis.elDriverId.val(d.id);
            mThis.driver_id = d.id;
            mThis.elDriverName.val(d.name);
         });
     } else {
         mThis.elDriverCode.val(data.code);
         mThis.elDriverId.val(data.id);
         mThis.driver_id = data.id;
         mThis.elDriverName.val(data.name);
        
     } 
   }

    // this.loadDrivers = (def,onFinish)=>{
    //     if(!def) def = {};
    //    post_ajax([mThis.base_url,'/api/getComboItems_driver'].join(''),null,function(rows) {
    //        if(rows){
    //            rows = StringSanitizer.sanitizeObject(rows);
    //            CommonLib.setComboItems(mThis.elDriver,rows,'id','driver_name',true,'(To Be Assigned)',def.driver_id);
    //            if (typeof onFinish =='function') onFinish();
    //        }
    //    });
    // }
 
    this.getData = ()=>{
        let p = {};
        p.delivery_id = mThis.delivery_id;
        p.warehouse_id = mThis.warehouse_id;
        p.barcode = mThis.elBarcode.val();
        p.depart_time = mThis.elDepartTime.val();
        p.delivery_type = mThis.elDeliveryType.val();
        p.driver_id = mThis.elDriverId.val();
        p.vehicle_type = mThis.elVehicleType.val();
        return p;
    }

    this.scanPackageOut = (p_info)=>{
        if(!p_info) return; 
        if(!p_info.delivery_id) p_info.delivery_id = mThis.delivery_id;
        
        mThis.elError.html(null);
        post_ajax([mThis.base_url,'/api/scanPackageOut'].join(''),p_info,function(m) {
            if(typeof m =='string') alert(m);
            if (m.status =='OK') {
                  let d = StringSanitizer.sanitizeObject(m.data);
                  if (!mThis.delivery_id) mThis.delivery_id = d.delivery_id; //This is very important to Start a new delivery trip
                  if (!mThis.delivery_id || mThis.delivery_id<=0) {
                      console.log(['Problem in scanning package "',p_info.barcode,'". Problem in creating delivery trip. The new delivery_id is unexpectedly zero or empty'].join(''));
                  }

                  if(d){
                    if (!$.isNumeric(d.exchange_rate)) d.exchange_rate =1;  
                    if(!d.driver_total_khr || d.driver_total_khr <=0) d.driver_total_khr = (d.driver_total * d.exchange_rate);
                    if (!d.base_cur) d.base_cur ='$';
                    if (!d.other_cur) d.other_cur ='៛';  
                    let html_row = ['<tr data-barcode="',d.barcode,'" data-pid="',d.package_id,'" data-did="',d.delivery_id,'">',
                    '<td class="col_action">',
                    '<div class="form-inline">',
                        '<a href="#" data-pid="',d.package_id,'" class="_tl_pa_remove btn btn-sm btn-outline-danger"><i class="fa fa-times"></i></a>&nbsp;',
                        '<a href="#" data-pid="',d.package_id,'" data-barcode="',d.barcode,'" class="_tl_pa_print_barcode btn btn-sm btn-outline-success"><i class="fa fa-barcode"></i></a>&nbsp;',
                        //'<a href="#" data-pid="',d.package_id,'" class="_tl_pa_edit btn btn-sm btn-outline-success"><i class="fa fa-edit"></i></a>',
                    '</div>'
                    ,'</td>',
                    // '<td class="package_name">',d.package_name,'</td>', 
                    '<td class="sender">',
                       '<span class="sender_name">',d.sender_name,'</span>',
                       '<span class="sender_phone">',(d.sender_phone?d.sender_phone:'Tel:(000)000000'),'</span>',
                    ,'</td>', 
                    '<td class="receiver">',
                       '<span class="receiver_phone">',(d.receiver_phone?d.receiver_phone:'Tel:(000)000000'),'</span>',
                       '<span class="receiver_address">',d.receiver_address,'</span>',
                    '</td>',
                    '<td class="zone">',
                     '<span class="zone_code">',d.zone_code,'</span>',
                     '<span class="zone_name">',d.zone_name,'</span>',
                    '</td>',
                    '<td class="delivery_type"><span class="pg-badge-delivery_type">',d.delivery_type,'</span></td>',
                    '<td class="cod_amount">',d.cod_amount,'</td>',
                    '<td class="other_fees">',d.other_fees,'</td>',          
                    '<td class="driver_total">',[d.base_cur,d.driver_total].join(''),'</td>',
                    '<td class="driver_total"><span class="cur-riel">',d.other_cur,'</span>',d.driver_total_khr,'</td>',     
                    '<td class="delivery_notes">',d.delivery_notes,'</td>'
                   ,'</tr>'].join('');
                   mThis.tblTrips_body.prepend(html_row); 
                  }
                
            }else{
                 mThis.elError.html(m.error_message);
            }
           
        });
    }

    this.removePackageRow = (tr)=>{
        if(!tr) return;
        let barcode = tr.data('barcode');
        let p = {'barcode':barcode,'delivery_id':tr.data('did')};
        post_ajax([mThis.base_url,'/api/removeScannedPackage'].join(''),p,(result)=>{
            if(result.status =='OK') tr.remove(); 
            else mThis.elError.html(result.error_message);
        });
        
    }

    this.loadFormOptions = (def,onFinish)=>{
        if(!def) {
            def ={};
            def.vehicle_type ='motobike';
            def.driver_id =0;
        }
        if(mThis.form_date) {
            mThis.elDepartTime.val(DateHelper.getTodayDate());
            CommonLib.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',false,null,def.vehicle_type);
            if(typeof onFinish =='function') onFinish();
            return;
        }
        post_ajax([mThis.base_url,'/api/getForm_options_delivery_trip'].join(''),null,function(d){
            if(d){
                mThis.form_data ={}; //DeliveryDialog.form_data
                //mThis.form_data.today_date =  StringSanitizer.sanitizeOut(d.today_date,'date');
                mThis.form_data.vehicle_types = StringSanitizer.sanitizeObject(d.vehicle_types);
                mThis.form_data.drivers = StringSanitizer.sanitizeObject(d.drivers);
                mThis.elDepartTime.val(DateHelper.getTodayDate());
                //CommonLib.setComboItems(mThis.elDriver,mThis.form_data.drivers,'id','driver_name',true,'(Driver)',def.driver_id);
                CommonLib.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',false,null,def.vehicle_type);
                if(typeof onFinish =='function') onFinish();
            }
        });
    }     
}
//end::DeliveryDialog

//### begin::FilterDialog_trip
var FilterDialog_trip = new function(){
    let mThis = this;
    this.self = $('#_trl_dlgFilter');
    this.elFilter_warehouse = $('#_trl_filter_warehouse');
    this.elTitle = $('#_trl_dlgFilterTitle');

    this.elFilter_date = $('#_trl_filter_date');
    //this.elFilter_delivery_type = $('#_trl_filter_dtype');
    this.elFilter_driver= $('#_trl_filter_driver');
    this.elFilter_status = $('#_trl_filter_status');
    
    this.form_data =null ; //stores all filter options
    this.remembered_filter;
    this.btnOK = $('#_trl_dlgFilter_btnOK');

    this.self.find('.dl_filter_field').on('change',(e)=>{
        mThis.remembered_filter = mThis.getData();
    });

    this.btnOK.on('click',(e)=>{
       mThis.self.modal('hide');
       let p = mThis.getData();
       if(typeof mThis.onClose =='function') mThis.onClose(p);
    });
  
    this.setFilterData = (d)=>{
       //mThis.elFilter_warehouse.val(d.warehouse_id);
        mThis.elFilter_status.val(d.status_id);
        //mThis.elFilter_delivery_type.val(d.delivery_type);
        mThis.elFilter_date.val(d.date);
        mThis.elFilter_driver.val(d.driver_id);
    }

   this.show = (option, onClose)=>{
        if(option) {
            mThis.elTitle.text(option.title);
        }
        mThis.onClose = onClose;
        mThis.loadFilterData(TripListComponent.remembered_filter, ()=>{
           if (main_view.MULTI_WAREHOUSE_OP ==0) mThis.elFilter_warehouse.parent().hide();  
           mThis.self.modal({
               backdrop:'static'
           });
        });
      
    }

   this.getData = ()=>{
       let p = {};
       //p.search_value = PackageListComponent.elSearchTrip.val();
       p.warehouse_id = mThis.elFilter_warehouse.val();
       p.date = mThis.elFilter_date.val();
       //p.delivery_date = mThis.elFilter_date.val();
       p.driver_id = mThis.elFilter_driver.val();
       //p.delivery_type = mThis.elFilter_delivery_type.val();
       if(p.delivery_type==0)  p.delivery_type=null;
       p.status_id = mThis.elFilter_status.val();
       return p;
   }
    this.loadFilterData = (def ={},onFinish)=>{ 
            if(!def.warehouse_id) def.warehouse_id = main_view.DEF_WAREHOUSE_ID;
            if (!def.status_id) def.status_id =2;  
            if (TripListComponent.form_data) {
                if (!mThis.form_data) mThis.form_data = TripListComponent.form_data;
                CommonLib.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                CommonLib.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,'(All Drivers)',def.driver_id);
                CommonLib.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'status_id','status_name',false,'(All Status)',def.status_id); 
                if(typeof onFinish =='function') onFinish();
                return;   
            }
                post_ajax([mThis.base_url,'/api/getForm_options_delivery_trip'].join(''),null,function(data){
                if(data){
                    data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
                    data.statuses = StringSanitizer.sanitizeObject(data.statuses);
                    data.drivers = StringSanitizer.sanitizeObject(data.drivers);
                     
                    data.statuses.unshift({"status_id":-1,"status_name":"(All Statuses)"});         
                    data.drivers.unshift({'id':null,'driver_name':'(All Drivers)'});
                     
                    CommonLib.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                    CommonLib.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,null,def.driver_id);
                    CommonLib.setComboItems(mThis.elFilter_status,data.statuses,'status_id','status_name',false,null,def.status_id);
                    mThis.form_data = data;
                    if(typeof onFinish =='function') onFinish();
                    TripListComponent.form_data = data;
                }
            });
        }
 }
//### end::FiterDialog_trip
 
//### begin::PackageStatusDialog
  var PackageStatusDialog = new function(){
      let mThis = this;
      this.self = $('#_trl_dlgPackageStatus');
      this.elTitle = $('#_trl_dlgPackageStatusTitle');
      this.btnOK = $('#_trl_dlgPackageStatus_btnSave');
      //Make static array of allowed statuses. Allow only "Delivered","Failed"
      //NOTE: if you comment this "//this.statuses" => then all statuses will be avaiable to user on FilterDialog_trip
      this.statuses = [{'id':8,'status_name':'Delivered'},{'id':9,'status_name':'Failed'},{'id':10,'status_name':'Continue To Deliver'},{'id':11,'status_name':'Returned'},{'id':6,'status_name':'On Delivery'}];
      this.elStatus = $('#_trl_ps_status');
      this.elNotes = $('#_trl_ps_notes');
      this.elError = $('#_trl_ps_error');

      mThis.elStatus.on('change',function(e){
          mThis.elError.html(null);
          if(mThis.elStatus.val()==9 || mThis.elStatus.val() ==11) {
              mThis.elNotes.parent().show();
          }else {
              mThis.elNotes.parent().hide();
          }
      });

      this.btnOK.on('click',function(e){
          let notes = mThis.elNotes.val();
          if (!mThis.elNotes.is(':visible')) notes = null;
          let p = {'status_id':mThis.elStatus.val(),'notes':notes};
          if (p.status_id ==9 || p.status_id ==11) {
              if (!p.notes || (p.notes+'').trim() ==''){
                  mThis.elError.html('ត្រូវការហេតុផលសំរាប់ទំនិញបញ្ជូនមិនបានសំរេច(Failed) និង ទំនិញបញ្ជូនត្រឡប់វិញ(Returned)');
                  return;
              }
          }
          mThis.self.modal('hide');
          if(typeof mThis.onClose =='function') mThis.onClose(p);
       });
      
       this.loadAllowableStatuses = (def_status_id, onFinish)=>{
           if (mThis.statuses){
                CommonLib.setComboItems(mThis.elStatus,mThis.statuses,'id','status_name',false,null,def_status_id);
                onFinish();
                return;
           }
           let ps= [];
           if(FilterDialog_package.form_data)
             {
                ps = FilterDialog_package.form_data.statuses;
                
                mThis.statuses =ps;
                CommonLib.setComboItems(mThis.elStatus,ps,'id','status_name',false,null,def_status_id);
             }
           else {
                    FilterDialog_package.loadFilterData(()=>{
                        ps = FilterDialog_package.form_data.statuses;
                        
                        CommonLib.setComboItems(mThis.elStatus,ps,'id','status_name',false,null,def_status_id);
                        mThis.statuses =ps;
                        onFinish();
                    })
           }
       }

      this.show = (option ={}, onClose)=>{
        mThis.elError.html(null);  
        mThis.elTitle.html(option.title);
        mThis.onClose = onClose;
        mThis.loadAllowableStatuses(option.status_id,()=>{
            mThis.elStatus.val(option.status_id);
            mThis.elNotes.val(option.notes);
            if (option.notes) mThis.elNotes.parent().show();

            mThis.elStatus.trigger('change');
            mThis.self.modal({
                backdrop:'static'
            });
        });
       
      };
  }
//###end::PackageStatusDialog

//begin::AddItemToTripDialog
var AddItemToTripDialog = new function(){
    let mThis = this;
    this.self = $('#_trl_dlgAddItemTotrip');
    this.elTitle = $('#_trl_dlgAddItemTotripTitle');
    this.btnAdd = $('#_trl_dlgAddItemTotrip_btnSave');
    this.elError = $('#_trl_dlgAddItemTotrip_error');

    this.elStatus = $('#_trl_apt_status');
    this.elBarcode = $('#_trl_apt_barcode');
    this.elNotes = $('#_trl_apt_notes');
    this.statuses = [{'id':9,'status_name':'Failed'},{'id':'8',status_name:'Delivered'},{'id':7,'stat_name':'Delayed'}];
    
    this.btnAdd.on('click',function(e){
        let p = {
            'delivery_id':mThis.delivery_id,
            'barcode':mThis.elBarcode.val(),
            'status_id':mThis.elStatus.val(),
            'notes':mThis.elNotes.val()
        };
       
        if (!p.barcode) {
            mThis.elError.html('barcode is not valid');
            return;
        }
        if (p.status_id<=0 || !p.status_id) {
            mThis.elError.html('Status is not correct!');
            return;
        }
        mThis.self.modal('hide');
       if (typeof mThis.onClose =='function') mThis.onClose(p);
    });

    this.show = (op={},onClose)=>{
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.delivery_id = op.delivery_id;
        mThis.elTitle.html(op.title);
        if (!op.delivery_id) {
            cv_interact.alert('trip identity is not valid');
            return;
        }
        CommonLib.setComboItems(mThis.elStatus,mThis.statuses,'id','status_name',true,'Select Status',0);
        mThis.self.modal({
            backdrop:'static'
        });
    }
}
//end::AddItemTotripDialog

//begin::TrackingMapView
 var TrackingMapView = new function(){
     let mThis = this;
     this.self = $('#_trl_tracking_map_panel');
     this.elFilter_tracking_driver = $('#_trl_filter_tracking_driver');
     this.btnSearch = $('#_trl_btnSearch');
     this.btnShowTrips = $('#_trl_btnShowTrips');

     this.btnShowTrips.on('click',function(e){
         let op = {'title':'Manage Fleet'};
         TripListComponent.show(op);
     });

     this.show = (option)=>{
         if(!option) option = {};
         if (!option.title) option.title ='Live Tracking View';
         TripListComponent.elScreenTitle.html(option.title);
         mThis.self.show().siblings().hide();
     }
 }
//end::TrackingMapView

$(document).ready(function(){
    TripListComponent.init();
});


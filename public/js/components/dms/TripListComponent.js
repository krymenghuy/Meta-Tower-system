'use strict';
var TripListComponent = new function() {
    let mThis = this;
    this.lang ='kh';
    this.title_prop = "Fleet Management";
    this.self = main_view.appContent.children('#_main_tripListComponent');
    this.base_url = main_view.base_url;
    this.tblTrips = this.self.find('#_trl_tblTrips');
    //javascript object, not jquery object. It is used for refreshing display of pacakge list, etc
    this.div_triplist_container = document.querySelector('#_trl_triplist_container');
    this.trip_dropdown_menu = mThis.tblTrips.find('.dropdown-menu');
     
    this.btnNewTrip = this.self.find('#_trl_btnNewTrip');
    this.elSearchTrip = this.self.find('#_trl_search');
    this.btnSearch = this.self.find('#_trl_btnSearch');
    this.btnShowTrackingMap = this.self.find('#_trl_btnShowTrackingMap');
    this.btnToggleFilter = this.self.find('#_trl_btnToggleFilter');
    
    this.btnPrint = this.self.find('#_trl_btnPrint');
    this.btnPDF = this.self.find('#_trl_btnPDF');
    this.trip_list_pane = this.self.find('#_trl_trip_list_panel');
    //prev_pacakge_detail_tr is Must be declared within another class named "PackageList"
    // this.prev_package_detail_tr =null;
    this.findRow_packageDetail = (did,package_id,barcode,on_delivery_count =1)=>{
        let cls = ['table.packagelist_',did].join('');

        let tblPackageList = mThis.tblTrips.find(cls);
        let tr=null;

        tblPackageList.find('tbody>tr').each(function(){
            tr = $(this);
            if(package_id>0)
                if(tr.data('pid') == package_id) return false; 
            else
                if(tr.data('barcode') == barcode) return false; 
        });

        let m = {'header_tr': mThis.tblTrips.find(`.trip_${did}`)};        
        m.tr = tr; 
        return m;
    }

    this.packageStatusChanged_eventHandler = (data)=>{
        ////let data = d.data;
        //let title = data.title?data.title:'Package Status Changed'; 
        // if (data.status_id ==9)
        //     toastr.warning(data.message,title);
        // else if (data.status_id ==8)
        //     toastr.success(data.message,title);
        // else
        //     toastr.info(data.message,title)
        if(mThis.tblTrips.is(':visible')) {
            let m = mThis.findRow_packageDetail(data.delivery_id,data.package_id, data.barcode,data.on_delivery_count);

            if (m.tr) {
                let dd = {'status_id':data.trip_status_id,'status':data.trip_status,'trip_total':data.trip_total,'delivered_total':data.delivered_total,'package_count':data.package_count};
                mThis.refreshTripInfo(m.header_tr,dd);

                let btn = m.tr.find('a.dpl_da_change_status');
                let status_class = DUtil.getStatusClass(data.status_id);
                btn.text(data.status).attr('class',`${status_class} dpl_da_change_status`);
                m.tr.find('td.price').text(data.price);
                m.tr.find('td.forwarding_cost').text(data.forwarding_cost);
                m.tr.find('td.driver_total').text(data.driver_total);
            } 
        }
    }

    //begin:: init TripListComponent
    this.initOnce = ()=> {        
        if(mThis.initAlready) return;
        FilterDialog_trip.loadFilterData();
 
        mThis.cfg = new ExpandableRowConfig('_trl_tblTrips',{
            'dontExpandByClickingOn': ['btn_trip_action','_trl_trip_btn_print_info'],
            'wrapperClass':'',
            'transitionClass':'show',
            'onOpen':(container, detail_tr, parent_tr) =>{
                let qtr = $(parent_tr);
                let delivery_id = qtr.data('did');
                //displayPackageList() as trip details
                mThis.displayTripDetails(container,detail_tr,delivery_id);
            }
        });

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
            let params = ['rtype=fleet_list&wid=',d.warehouse_id,'&date=',d.date,'&search=',mThis.elSearchTrip.val(),'&driverid=',d.driver_id,'&dtype=',d.delivery_type,'&stid=',d.status_id].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms-gen-report/',d].join(''),'_blank'); 
            });
        });

        mThis.btnPDF.on('click',(e)=>{
            let p = FilterDialog_trip.getData();
            p.search_value = mThis.elSearchTrip.val(); 
            try {
                vsapi.call([mThis.base_url, '/api/getDeliveryTrips_print'].join(''),p).then(res=>{
                    if(res.status_code ===200){
                        let data = res.data;
                        let d = mThis.processDeliveryTrips_print(data);
                        let op = {'title':'Delivery Trips','title_color':'black','header_columns':d.titles,'pageSize':'A4','pageOrientation':'Portrait'};
                        pdfReport.viewPDF_json(d.data,op); 
                    } 
                });          
            }
            catch(e){
                cv_interact.error(e.toString());
            }
        });

        mThis.btnSearch.on('click',function(){
            mThis.displayDeliveryTrips(null, true);
        });
    
        mThis.btnShowTrackingMap.on('click',(e)=>{
            TrackingMapView.show();
        });

        mThis.elSearchTrip.on('keyup',function(e){
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.displayDeliveryTrips(null,true); 
            },250);
        });
  
        mThis.tblTrips.on('click','a.btn_trip_action',function(e) {
            e.preventDefault();
            let x = $(this);
            let p = x.parent();
            let delivery_id = x.data('did');
            let driver_id = x.data('driverid');
            let tknumber = x.data('tknumber');
            let status_id = x.data('statusid'); 
                
            let dropdownMenu = p.find('.dropdown-menu');
            if (!dropdownMenu || dropdownMenu.length <= 0) {
                p.append(mThis.createDropdownMenuHtml_trip(delivery_id,tknumber,driver_id,status_id));
                dropdownMenu = p.find('.dropdown-menu');
            }
            if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false)
                mThis.prev_dropdownMenu.removeClass('show');
            mThis.toggleStartStop(x.closest('tr.trip_header'));  
            dropdownMenu.toggleClass('show');
            if (dropdownMenu.hasClass('show'))
                mThis.prev_dropdownMenu = dropdownMenu;
        });

        $(document).on('click',function(e){
            let x = mThis.tblTrips.find('div.dropdown-menu'); 
            let container =  x.parent(); 
            
            if(container){
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    x.removeClass('show'); 
                }
            }
        });
  
        mThis.tblTrips.on('mouseover','tr',function(e){
            let x = $(this);
            let col_action = x.find('td.col_action');
            let btn_start_trip = x.find('a._trl_trip_btn_print_info');
            btn_start_trip.show();
            col_action.find('a.btn_trip_action>i').addClass('action-button-zoomin');    
        }).on('mouseleave','tr',function(e) {
            let x = $(this);
            let col_action = x.find('td.col_action');
            let btn_start_trip = x.find('a._trl_trip_btn_print_info');
            btn_start_trip.hide();
            col_action.find('a.btn_trip_action>i').removeClass('action-button-zoomin');
    
            col_action.find('div.dropdown-menu').removeClass('show');  
        });
 
        mThis.tblTrips.on('click','a._tl_trip_delete',function(e){
            e.preventDefault();
            let x = $(this).closest('div.dropdown-menu');
            let delivery_id = x.data('did');
            cv_interact.confirm('Delete this trip?',{title:'Delete Trip',context:'delete',confirmButtonText:'Delete',cancelButtonText:'Cancel'},(e)=>{
                if(e) {
                    mThis.deleteDeliveryTrip(delivery_id,x.closest('tr'));
                }
            }); 
        });
       
        mThis.tblTrips.on('click','a._tl_trip_print_trip_info',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let delivery_id = x.data('did');
            window.open([mThis.base_url,'/trip_info/',delivery_id].join(''),'_blank'); 
        });

        mThis.tblTrips.on('click','tr a._trl_trip_btn_print_info',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr.trip_header');
            mThis.printTripInfo_pdf(tr);
        });

   
        mThis.tblTrips.on('click','a._tl_trip_change_status',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            let delivery_id = tr.data('did');
            //let pid = tr.data('pid');
            let def_status_id = tr.data('statusid');

            let option = {
                "title":"Set Trip Status",
                "data":mThis.statuses,
                "textMember":"status_name",
                "valueMember":"id",
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
                    
                    vsapi.call([mThis.base_url,'/api/updateTripStatus'].join(''),p).then(res=>{
                        if(res.status_code === 200) {
                            let td = tr.find('td.trip-status');
                            td.find('a.pg-text').text(data.text);
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblTrips.on('click','a._tl_trip_start_trip',function(e){
            e.preventDefault();
            let deliveryTypes = ['normal','fast'];
            let x = $(this);
            let tr = x.closest('tr');
            let delivery_id = tr.data('did');
            let driver_id = tr.data('driverid');

            cv_interact.confirm('Are you sure to start this trip now?',{title:'Start Trip',context:'update',confirmButtonText:'Depart',cancelButtonText:'Close'}, e => {
                if(e){
                  mThis.startDeliveryTrip(delivery_id,driver_id);
                }
            });
        });

        mThis.tblTrips.on('click','a._tl_trip_stop_trip',function(e){
            e.preventDefault();
            let x = $(this);
            let tr = x.closest('tr');
            let delivery_id = tr.data('did');
            let op = {'title':'Finish Trip',defaultValue:'បញ្ចប់ដោយបុក្គលិកការិយាលយ័',dataLabel:'បញ្ចូលហេតុផលសំរាប់ទំនិញមិនទាន់ដឹកដល់ភ្ញៀវ','blankErrorMessage':'ហេតុផល?','btnOKText':'Finish Trip Now'}; 
            InputBox1.show(op,(d)=>{
                mThis.finishDeliveryTrip(delivery_id,d);
            });
        });
       
        mThis.tblTrips.on('click','a._tl_trip_print_package_list_all',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr.trip_header');
            let show_all = true;
            mThis.printTripInfo_pdf(tr,show_all);
        });
 
        mThis.tblTrips.on('click','a._tl_trip_print_package_list',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr.trip_header');
            mThis.printTripInfo_pdf(tr,false);
        });

        mThis.tblTrips.on('click','a._tl_trip_add_package',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr').next();
            if(tr.hasClass('package_list')){
                mThis.AddItemToTrip(tr);
            }
            else {
                let tr1 =$(this).closest('tr.trip_header');
                let did =  tr1.data('did');
                let td = tr1.find('td.fleet_tracking_number');
                let tknumber = td?td.text():null;
                mThis.AddItemToTrip(tr,did,tknumber);
            }
        });

        mThis.tblTrips.on('click','a._tl_trip_change_driver',function(e){
            e.preventDefault();
            let x = $(this);
            let tr = x.closest('tr');
            let delivery_id = tr.data('did');
            let op = {'title':'Change Delivery Driver',role:'driver','singleSelect':true};
            FindPersonDialog.show(op,(ps)=>{
                if(ps[0]) {
                    let d = ps[0];
                    let p = {'delivery_id':delivery_id,'driver_id':d.id};
                    if(!d){
                        cv_interact.error("No driver selected!");
                        return;
                    }

                    vsapi.call([mThis.base_url,'/api/changeDeliveryDriver'].join(''),p).then(res=>{
                        if(res.status_code ===200){
                            tr.data('driverid',d.id);
                            tr.find('td.driver_name').text(d.name);
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblTrips.on('click','tbody>tr.detail-row a.trl_pa_refresh',function(e){
            e.preventDefault();
            let delivery_id = $(this).data('did');
            mThis.refreshPackageList(delivery_id,null,null);
        });

        mThis.tblTrips.on('click','tbody>tr.detail-row a.dpl_da_print_barcode',function(e){
            e.preventDefault();
            let barcode = $(this).closest('tr').data('barcode');
            window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
        });

        mThis.tblTrips.on('click','tbody>tr.detail-row a.dpl_da_delete',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            let did = tr.data('did');
            let barcode =tr.data('barcode');

            cv_interact.confirm('Take this package out of the trip?',{title:'Take Package Out',context:'update','confirmButtonText':'Take Out','cancelButtonText':'Cancel'},function(e){
                if(e){
                    let p = {'delivery_id':did,'barcode':barcode};
                    vsapi.call([mThis.base_url,'/api/removePackageFromTrip'].join(''),p).then(res=>{
                        if(res.status_code ===200) {
                            let result =  res.data;

                            let header_tr = mThis.tblTrips.find(`.trip_${result.delivery_id}`);
                            if (result.package_count ==0) {
                                mThis.tblTrips.find(`.pl_${result.delivery_id}`).remove();
                                header_tr.remove();
                            }
                            else{
                                let m = {'status_id':result.trip_status_id,'status':result.trip_status,'trip_total':result.trip_total?result.trip_total:0,'package_count':result.package_count};
                                mThis.refreshTripInfo(header_tr,m);
                                tr.remove();
                            }
                        }
                        else cv_interact.error(res.error_message,'','error');
                    });
                }
            });
        });

        mThis.tblTrips.on('click','tbody>tr.detail-row a.trl_copy_barcode',function(e){
            e.preventDefault();
            let barcode = $(this).data('barcode');
            mThis.copyToClipboard(barcode);
        });

        mThis.tblTrips.on('click','tbody>tr.detail-row a.dpl_da_change_status',function(e){
            e.preventDefault();
            let x = $(this);
            let tr = x.closest('tr.detail-row');
            let delivery_id = x.data('did');
            let package_id = x.data('pid');
            let def_status_id = x.data('statusid');
            let def_notes = x.data('notes');
            let op = {'title':'Change Package Status','status_id':def_status_id,'notes':def_notes};
            if (!package_id || package_id<=0) {
                cv_interact.warning('Package identity is missing or invalid!',{title:'Change Package Status'});
                return;
            }
            if (!delivery_id || delivery_id<=0) {
                cv_interact.warning('Trip identity is missing or invalid!',{title:'Change Package Status'});
                return;
            }
            PackageStatusDialog.show(op,(d)=>{
                if(d){
                    let p = {'update_trip_status':1,'package_id':package_id,'status_id':d.status_id,'failure_notes':d.notes};
                    vsapi.call([mThis.base_url,'/api/updatePackageStatus'].join(''),p).then(res=>{
                        if(res.status_code ===200){ 
                            mThis.refreshPackageList(delivery_id,null,null);
                        }
                        else cv_interact.warning(res.error_message);
                    });
                }
            });
        });
 
        mThis.btnNewTrip.on('click',function(e){
            e.preventDefault();
            let def_warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
            let option ={'title':'New Delivery Trip','warehouse_id':def_warehouse_id,'delivery_id':null,'driver_id':null};
            DeliveryDialogTrip.show(option,function(d){
                if(d){
                    mThis.displayDeliveryTrips();
                }
            });  
        });

        //mThis.expanded_detail.init();
        mThis.initAlready = true;
    }
  //END::TripListComponent

    this.copyToClipboard = (text)=>{
        navigator.clipboard.writeText(text);
    }

    this.show = (option=null)=>{
        mThis.initOnce(); //NOTE: init() will be called only once 
        mThis.displayDeliveryTrips(null,null,null);
        mThis.self.siblings().hide();
        mThis.trip_list_pane.show();
        main_view.setTitle(mThis.title_prop);
        mThis.self.fadeIn(200);
    }

    this.toggleStartStop = (tr)=>{
        if (!tr) return;
        let td = tr.find('td.col_action');
        let trip_status_id = tr.data('statusid');

        let cls = "._tl_trip_start_trip";
        if(trip_status_id ==2) cls ="._tl_trip_stop_trip";
        td.find(['div.dropdown a.tog-visible', cls].join('')).show().siblings('.tog-visible').hide();
    }

    this.refreshTripInfo = (tr,d)=>{
        if(!tr) return;
        if (!d.status) d.status = d.trip_status;
        if(d.status) {
            let status_text = tr.find('td.trip-status>a');
            tr.data('statusid',d.status_id);
            status_text.data('statusid',d.status_id);
            status_text.data('status',d.status);
            status_text.text(d.status);
        }
        
        if (d.package_count) {
            tr.find('.package_count').text([d.package_count,' pcs'].join(''));
        }

        if(d.status && d.trip_total>=0){
            tr.find('.trip-driver-total').text(d.trip_total?d.trip_total:0);
        }
    }

    this.finishDeliveryTrip = (delivery_id,notes)=>{
        let p = {'delivery_id':delivery_id,failure_notes:notes};
        vsapi.call([mThis.base_url,'/api/finishDeliveryTrip'].join(''),p).then(res=>{
            if(res.status_code===200){
                cv_interact.success('The delivery trip is finished');
                mThis.displayDeliveryTrips();
            }
            else cv_interact.error(res.error_message);
        });
    }

    this.startDeliveryTrip = (delivery_id,driver_id)=>{   
        if(!driver_id) driver_id = mThis.driver_id;
        let p = {'delivery_id':delivery_id,'driver_id':driver_id};
    
        vsapi.call([mThis.base_url,'/api/startDeliveryTrip'].join(''),p).then(res=>{
            if(res.status_code ===200){
                let d = res.data;
                cv_interact.info(`Trip started with tracking number: ${d.fleet_tracking_number}`);
                FilterDialog_trip.setFilterData({'start_date':null,'end_date':null,'delivery_type':null,'driver_id':null,'status_id':2});
                TripListComponent.elSearchTrip.val(null);
                mThis.displayDeliveryTrips();
            }
            else cv_interact.error(res.error_message);
        });
    }
 
    this.createDropdownMenuHtml_trip = function(delivery_id,tknumber,driver_id,status_id){
        let html = ['<div class="dropdown-menu bg-white shadow" data-tripid="',delivery_id,'" data-did="',delivery_id,'" data-tknum="',tknumber,'" data-driverid="',driver_id,'" data-statusid="',status_id,'">',
        '<a class="dropdown-item _tl_trip_start_trip tog-visible" href="javascript:void(0)"><i class="fas fa-play trl-menu-icon" style="color:green"></i>Start Trip</a>',
        '<a class="dropdown-item _tl_trip_stop_trip tog-visible" href="javascript:void(0)"><i class="fas fa-stop trl-menu-icon" style="color:#2405E1"></i>Finish Trip</a>',
        '<a class="dropdown-item _tl_trip_change_driver" href="javascript:void(0)"><i class="fas fa-user trl-menu-icon"></i>Change Driver</a>',
        '<div class="dropdown-divider"></div>',
        '<a class="dropdown-item _tl_trip_add_package" href="javascript:void(0)"><i class="fas fa-cube trl-menu-icon" style="color:orange"></i>Add Package</a>',
        '<a class="dropdown-item _tl_trip_print_package_list" href="javascript:void(0)"><i class="fas fa-print trl-menu-icon"></i>Print Package List</a>',
        '<a class="dropdown-item _tl_trip_print_package_list_all" href="javascript:void(0)"><i class="fas fa-print trl-menu-icon"></i>Print Package List (All)</a>',
        '<div class="dropdown-divider"></div>',
        '<a class="dropdown-item _tl_trip_delete" href="javascript:void(0)"><i class="fas fa-trash trl-menu-icon" style="color:red"></i> Delete Trip</a>',
        '</div>'].join('');
        return html;
    };

    this.deleteDeliveryTrip = (delivery_id,tr)=>{
        let p = {'delivery_id':delivery_id};
        vsapi.call([mThis.base_url,'/api/deleteDeliveryTrip'].join(''),p).then(res=>{
            if(res.status_code === 200){
                    if (tr) {
                        let detail_tr = tr.next();
                        if (detail_tr.hasClass('package_list')) {
                            detail_tr.remove();
                        }
                        tr.remove();
                    }
                    else 
                    mThis.displayDeliveryTrips();
            }
            else cv_interact.error(res.error_message);
        });
    }

    this.AddItemToTrip = (list_tr,did,tknumber)=>{
        if(!list_tr && did) return;  
        if(!tknumber) tknumber = list_tr.data('tknumber');
        let status_button = list_tr.find('td.trip-status>a');
        let trip_status_id = status_button.data('statusid');

        if (!did) did = list_tr.data('did');
        let op = {'title':['Add Pacakge to Trip',tknumber].join(''),'delivery_id':did,'trip_status_id':trip_status_id};
        
        AddItemToTripDialog.show(op);
    }

    this.processPackageListByTrip_print = (data)=>{
        let titles = ['ល.រ','អ្នកផ្ញើរ','អ្នកទទួល','អសយដ្ឋាន','តាក់សុី','សរុប(USD)','សរុប(KHR)','សំគាល់'];
        if(mThis.lang ==='en')
            titles = ['No','Sender Name','Receiver Phone','Receiver Address','Taxi','Total (USD)','Total(KHR)','Remarks'];
        let c,i=0;
        let rows=[];
        do{
            c = data[i];
            if(!c) break;
            if(!c.cur) c.cur ='$';
            if(!c.cod_amount) c.cod_amount =0;
            if(!c.fees) c.fees= parseFloat(c.base_fee) + parseFloat(c.delivery_fee);
            let total = c.driver_total;
            c.fees = Number(c.fees).toFixed(2);
            let total_khr = total * parseFloat(c.exchange_rate);
            total = Number(total).toFixed(2);
            total_khr = Number(total_khr).toFixed(2);
            let remarks = c.delivery_notes?c.delivery_notes:(c.status_id==9? ['Failed: ',c.failure_notes].join(''):c.failure_notes);
            let row = {'numero':(i+1),'sender_name':[c.sender_name,' (',c.sender_phone,')'].join(''),'receiver_phone':c.receiver_phone,'receiver_address':[c.zone_name,'. ',c.receiver_address].join(''),'forwarding_cost':null,'total':[c.cur,total].join(''),'total_khr':['៛',total_khr].join(''),'remarks':remarks};
            rows.push(row);
            i++;
        }while(c);
        return {'data':rows,'titles':titles};
    }

    this.printTripInfo_pdf =(tr,show_all_statuses = false)=>{
        let did = tr.data('did');
        let tknumber = tr.data('tknumber');
        let p = {'delivery_id':did,'show_all_statuses':show_all_statuses?1:0};
        
        vsapi.call([mThis.base_url,'/api/getTripInfo'].join(''),p).then(res=> {
            let d = res.data;
            let packages = StringSanitizer.sanitizeObject(d.packages);
            let m = mThis.processPackageListByTrip_print(packages);
            let op = {'sub_title':['Driver ',d.driver_name].join(''),'sub_title_color':'green','header_columns':m.titles};
            if (mThis.lang ==='kh')
                op = {'sub_title':['ជើងលេខ ',tknumber,' អ្នកដឹក ',d.driver_name].join(''),'sub_title_color':'green','header_columns':m.titles};
            op.pageSize='A4';
            op.pageOrientation ='Portrait';
            op.td_style = {
                fontSize: 10,
                color:op.text_color?op.text_color:'#000000',
                margin:[-1,-1,-1,-1]
            };

            op.th_style = {
                fontSize: 10,
                color:op.text_color?op.text_color:'#000000',
                margin:[-1,-1,-1,-1]
            };

            op.styles = {
                heading_detail_item:{
                    fontSize: 10,
                    bold: true,
                    color:'grey',
                    margin: [0, 0, 0, 0],
                    alignment: 'center'
                }
            }
            
            op.heading_contents = [
                {"text":["កាលបរិច្ឆេទ: ",d.depart_date,show_all_statuses? null: ' (Excluding delivered items)'].join(''),"style":"heading_detail_item"}
            ]; 
            pdfReport.viewPDF_json(m.data,op); 
        });
    }

    this.processDeliveryTrips_print = (data)=>{
        let titles =['Date','Tracking#','Driver Name','Vehicle Type','Packages','COD','Base Fee','Additional','Status'];
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

    this.displayDeliveryTrips = function(filter,search_action = false,onFinish=null){   
        let p = filter;
        if(!p) p = FilterDialog_trip.getData();
        if (search_action == true) p.search_value = mThis.elSearchTrip.val();
        p.warehouse_id = main_view.DEF_WAREHOUSE_ID?main_view.DEF_WAREHOUSE_ID:1;

        vsapi.call([mThis.base_url, '/api/getDeliveryTrips'].join(''),p,null,null,main_view.apiCluster).then(res=>{  
            if(mThis.table){
                mThis.tblTrips.DataTable().clear().destroy();
                mThis.tblTrips.empty();
                mThis.table = null;
            }
            let data = [];
            if(res.status_code ===200) data = StringSanitizer.sanitizeObject(res.data,null,['depart_time']);
            let my_columns = [
                {
                    className:'col_action',
                    data:function(data,row,display) {
                        let html =['<div class="dropdown">',
                            '<a href="javascript:void(0)" data-did="',data.id,'" data-driverid="',data.driver_id,'" data-tknumber="',data.fleet_tracking_number,'" data-statusid="',data.status_id,'" class="btn_trip_action" aria-haspopup="true" aria-expanded="false">',
                            '<i class="fa fa-duotone fa-bars" style="color:#E9E7E7;font-size:1em"></i>',
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
                            '<a href="javascript:void(0)" style="display:none" data-did="',data.id,'" class="_trl_trip_btn_print_info"><i class="fas fa-print" style="color:grey;"></i></a>',
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
                {
                    className:'vehicle_type',
                    data:function(data,a,b){
                        return data.vehicle_type?data.vehicle_type:'NA';
                    }, 
                    title:'Vehicle'
                },
                {
                    className:'driver_name',
                    data:(data,a,b)=>{
                        return ['<span class="d-block p-1 fw-semibold">',data.driver_name,'</span>','<div class="d-flex flex-row"><i class="fa fa-phone p-1"></i><span class="d-block text-center p-1">',data.driver_phone_number,'</span></div>'].join('');
                    },
                    title:'Driver'
                },
                {
                    //className:'package_count',
                    data:(data,a,b)=>{
                        return ['<div class="d-flex flex-row"><i class="fa fa-cube p-1"></i> <span class="package_count p-1">',data.package_count,' pcs','</span></div>'].join('');
                    },
                    title:'Package Count'
                },
                {
                    className:'driver_total',
                    data:function(data,a,b){
                        return ['<div style="display:flex;flex-direction:column">',
                            '<div><span class="total-value trip-driver-total text-success p-2">',data.driver_total?data.driver_total:0,'</span></div>',
                        '</div>'].join(''); 
                    },
                    title:'Total'
                },
                {
                    className:'trip-status',
                    data:function(data,type,meta) {
                        return ['<a class="pg-text _trip_status button-move" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" href="javascript:void(0)">',data.status,'</a>'].join('');
                    },
                    title:'Status'
                }
            ];
 
            if (!mThis.table){
                mThis.table = mThis.tblTrips.DataTable({
                    searching:false,
                    destroy:true,
                    paging:true,
                    pageLength:20,
                    ordering:false,
                    retrieve: true,
                    info:true,
                    bLengthChange:false,
                    saveState:true,
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
                        tr.addClass(`trip_header trip_${data.id}`); 
                        tr.data('did',data.id);                   
                        tr.data('tknumber',data.fleet_tracking_number);
                        tr.data('driverid',data.driver_id);
                        tr.data('statusid',data.status_id); 
                    }     								
                });
                if(typeof onFinish==='function') onFinish();
                //this.expanded_detail.prev_package_detail_tr = null;
            }
        });        
    };

    this.updateTripStatus = (tr,d)=>{
        tr.data('statusid',d.status_id);
        tr.find('td.col_status').text(d.status_name);
    }
 
    this.displayTripDetails = (container,detail_tr,did)=>{
        //for addPackageTotrip() to work correctly, detail_tr must have css class `pl_${delivery_id}`
        detail_tr.classList.add(['pl_',did].join(''));
        let specific_id = ["tpd_",did].join('');
        let tbody_id = `${specific_id}_package_list_tbody`;
        let div = container.querySelector(`#${specific_id}`);
        if(!div){
            let div = document.createElement('div');
            div.setAttribute('id',specific_id);
            div.classList.add('package_list_wrapper');
         
            div.innerHTML =`<table class="packagelist_${did} trl-package_table" style="width:100%">
                <thead><th></th><th>Product</th><th>Sender</th><th>Receiver</th><th>Zone</th><th>COD</th><th>Base Fee</th><th>Delivery Fee</th><th>Taxi Fee</th><th>Total</th><th>Status</th><th><a data-did="${did}" href="javascript:void(0)" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:orange;font-size:1.3em"></i></a></th></thead>
                <tbody id="${tbody_id}" style="max-height:450px">
                </tbody>
            </table>`;
            container.appendChild(div);
           LocaleManager.translateZone(specific_id);
        }
        mThis.refreshPackageList(did,null,null);

        // let p = {'delivery_id':did,'search_value':mThis.elSearchTrip.val()};
        // vsapi.call([mThis.base_url,'/api/getPackageListByTripId'].join(''),p,null,false).then(res=>{
        //     let d = res.data;
        //     if(res.status_code !==200){
        //         cv_interact.warning(res.error_message);
        //         return;
        //     }
        //     let rows = StringSanitizer.sanitizeObject(d.packages);
        //     mThis.refreshPackageList(did,rows,p.search_value);
        // });
       
    }
 
   
    //displayPackageList()
    this.refreshPackageList = (did,packages =[],search_value=null)=>{
        let specific_id = ["tpd_",did].join('');
        let tbody_id = `${specific_id}_package_list_tbody`;
        let tbody = mThis.div_triplist_container.querySelector(`#${tbody_id}`);
        if(!tbody) return;
        if(!packages || !packages[0]){
            //If search value is NULL, then try using search_value from the search Box
            if(!search_value) search_value =TripListComponent.elSearchTrip.val();
            let p = {'delivery_id':did,'search_value':search_value};
            vsapi.call(`${mThis.base_url}/api/getPackageListByTripId`,p,null,false).then(res=>{
                let d = res.data;
                if(res.status_code !==200){
                    cv_interact.warning(res.error_message);
                    return;
                }

                tbody.innerHTML = mThis.createPackageRows(StringSanitizer.sanitizeObject(d.packages),search_value);
                let trip_header_class = `trip_${did}`;
                let header_tr = mThis.div_triplist_container.querySelector(['.',trip_header_class].join(''));
                //refresh Header
                //Todo: send currency_code from api instead of using static currency code here for Driver Total
                mThis.refreshTripInfo($(header_tr),{'package_count':d.package_count,'status_id':d.status_id,'trip_status':d.trip_status,'trip_total':d.trip_total});
            
                tbody.querySelectorAll('.dpl_da_change_status').forEach(el=>{ 
                    let notes = el.dataset.notes
                    if(notes){
                        let title_text ='សំគាល់';
                        $(el).popover({ 
                                    html: true,
                                    trigger: "hover",
                                    title: ["<span class='pg-remarks-title'>",title_text,"</span>"].join(''), 
                                    content:notes 
                              });  
                            
                  }
                });
            });
            return;
        }
        tbody.innerHTML = mThis.createPackageRows(packages,search_value);
        
    }

    //returns html string for rendering pacakge items
    //renderRows()| renderPackages() | createPackageItems()
    this.createPackageRows = (packages =[],search_value=null)=>{
        let p_list = null;
        let i=0,c;
        let action_buttons_html =['<div style="width:100px" class="button-group dpl-action_buttons">',
        '<a href="javascript:void(0)" class="btn btn-sm btn-outline-danger dpl_da_delete"><i class="fas fa-times"></i></a>&nbsp;',
        '<a href="javascript:void(0)" class="btn btn-sm btn-outline-success dpl_da_print_barcode"><i class="fa fa-barcode"></i></a>&nbsp;',
        '</div>'].join('');
        do{
            c = packages[i];
            if(!c) break;
            if(!c.cur) c.cur ='$';
            if (!c.product_type) c.product_type ='Generic';
            let notes = (c.status_id ==8 || c.status_id==9)?c.failure_notes:c.delivery_notes;
            let cls_status = DUtil.getStatusClass(c.status_id);
            
            let select_package_class=null, is_search_result=false;
            if (search_value){
                switch(search_value){
                    case c.barcode:{
                        is_search_result=true; 
                        select_package_class='trl-pg-checked';
                        break;
                    }
                    case c.receiver_phone:{
                        is_search_result=true; 
                        select_package_class='trl-pg-checked';
                        break;
                    }
                    case c.sender_phone:{
                        is_search_result=true; 
                        select_package_class='trl-pg-checked';
                        break;
                    }
                    case c.sender_name:{
                        is_search_result=true; 
                        select_package_class='trl-pg-checked';
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
                    
            let p_row = [`<tr id="package_${c.barcode}" data-did="${c.delivery_id}" data-barcode="${c.barcode}" data-pid="${c.package_id}">`,
            `<td><span class="trl-numero ${select_package_class}">`,(i+1),`</span></td>`,
            '<td>',`<a href="javascript:void(0)" data-pid="${c.package_id}" data-barcode="${c.barcode}" class="trl_copy_barcode"><i class="fa fa-copy"></i></a><span class="trl-product-type">${c.product_type}</span>`,'</td>',
            '<td><span class="trl-sendername-text">',c.sender_name,'</span><span class="trl-senderphone-text">',c.sender_phone,'</span></td>',
            '<td><span class="pg-badge-delivery_type">',c.delivery_type,'</span><span class="trl-receiverphone-text">',c.receiver_phone,'</span></td>',
            '<td><span class="trl-zonecode-text">',c.zone_code,'</span><span class="trl-zonename-text">',c.zone_name,'</span></td>',
            '<td class="price">',[c.cur,c.cod_amount].join(''),'</td>',
            '<td class="base_fee">',[c.cur,c.base_fee].join(''),'</td>',
            '<td class="delivery_fee">',[c.cur,c.delivery_fee].join(''),'</td>',
            '<td class="forwarding_cost">',[c.cur,c.forwarding_cost].join(''),'</td>',
            '<td class="driver_total">',[c.cur,c.driver_total].join(''),'</td>',
            '<td><a href="javascript:void(0)" data-notes="',c.failure_notes,'" data-did="',c.delivery_id,'" data-pid="',c.package_id,'" data-statusid="',c.status_id,'" data-notes="',notes,'" class="',cls_status,' dpl_da_change_status">',c.status,'</a></td>',
            '<td>',action_buttons_html,'</td>',
            '</tr>'].join('');

            if(is_search_result)
                p_list = [p_row,p_list].join('');
            else
                p_list = [p_list,p_row].join('');
            i++;
        }while(c);

        if(!p_list) 
        {
             //parent_tr.find('td.package_count').text(0);
             p_list = '<tr><td colspan="100%"><div class="alert alert-warning">មិនមានទំនិញ&nbsp;&nbsp;<a href="javascript:void(0)" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:#fff;font-size:1.3em"></i></a></div></td></tr>';
        }
        return p_list;
    }
}

//     //begin:: expanded_detail| Expandanle Package List pacakgeList
//         this.expanded_detail = new function(){
//             this.is_editing = false;
//             let mThis = this;
//             this.base_url = main_view.base_url;
//             this.prev_package_detail_tr =null;

//             this.init =()=>{
//                 return;
//             }

//             this.displayPackageList = (tr,did=0,force_expand =false)=>{
//                 if(!tr) return; 
//                 //Remove previous Selected row (trip tr)
//                 if (mThis.prev_selected_tr){
//                     mThis.prev_selected_tr.removeClass('dpl-selected');
//                     mThis.prev_package_detail_tr.hide();
//                     //TripListComponent.tblTrips.find('tbody>tr.package_list').hide();
//                 }
  
//                 let detail_tr = tr.next();

//                 if (detail_tr.length >0){
//                     if(detail_tr.hasClass(`pl_${did}`)){

//                         tr.toggleClass('dpl-selected');
//                         detail_tr.toggleClass('hidden');

//                         // alert(detail_tr.is('::visible')); 
//                         // if(detail_tr.is(':visible')){
//                         //     detail_tr.hide(); 
//                         //     tr.removeClass('dpl-selected');
//                         //     return;
//                         // }else{
//                         //     tr.addClass('dpl-selected');
//                         //     detail_tr.show();
//                         //     return;
//                         // }

//                         //Important to stop here by "return"
//                         return;
//                     }
//                 }else{

//                     //if(!detail_tr || detail_tr.length <=0){
//                         let p = {'delivery_id':did,'search_value':TripListComponent.elSearchTrip.val()};
//                         vsapi.call([mThis.base_url,'/api/getPackageListByTripId'].join(''),p).then(res=>{
//                             let d = res.data;
//                             if(res.status_code !==200){
//                                 cv_interact.warning(res.error_message);
//                                 return;
//                             }
//                             let rows = StringSanitizer.sanitizeObject(d.packages);                      
//                             //if(!mThis.prev_package_detail_tr || mThis.prev_package_detail_tr.length === 0)
//                                 mThis.prev_package_detail_tr = mThis.createExpandedPackageList(tr,did,rows,search_value);
//                             //  else{
//                             //      alert(`show existing ${did}`);
//                             //      TripListComponent.tblTrips.find(`tbody>tr.pl_${did}`).show();
//                             // }
                            
//                             tr.addClass('dpl-selected');
//                             mThis.prev_selected_tr = tr;
//                             TripListComponent.tblTrips.find('.dpl_da_change_status').each(function(){
//                                 let el = $(this);
//                                 let notes = el.data('notes');
//                                 if(notes){
//                                     el.popover({ 
//                                         html: true,
//                                         trigger: "hover",
//                                         title: ["<span class='pg-remarks-title'>Remarks</span>"].join(''), 
//                                         content:notes 
//                                     });  
//                                 }
//                             });
//                         });
//                     //}
                    

//                 } 
         
                
//             }

//             this.createExpandedPackageList = (tr,did,packages=[],search_value = null)=>{
//                 if(!packages) packages = [];
//                 if(!packages[0]) return; 

//                 let specific_class = ["pl_",did].join('');
                
//                 let p_list = null;
//                 let i=0,c;
//                 let action_buttons_html =['<div class="button-group dpl-action_buttons">',
//                 '<a href="javascript:void(0)" class="btn btn-sm btn-outline-danger dpl_da_delete"><i class="fas fa-times"></i></a>&nbsp;',
//                 '<a href="javascript:void(0)" class="btn btn-sm btn-outline-success dpl_da_print_barcode"><i class="fa fa-barcode"></i></a>&nbsp;',
//                 '</div>'].join('');
//                 let table_header = '<thead><th></th><th>Product</th><th>Sender</th><th>Receiver</th><th>Zone</th><th>COD</th><th>Base Fee</th><th>Delivery Fee</th><th>Taxi Fee</th><th>Total</th><th>Status</th><th><a href="javascript:void(0)" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:orange;font-size:1.3em"></i></a></th></thead>';
//                 do{
//                     c = packages[i];
//                     if(!c) break;
//                     if(!c.cur) c.cur ='$';
//                     if (!c.product_type) c.product_type ='Generic';
//                     let notes = (c.status_id ==8 || c.status_id==9)?c.failure_notes:c.delivery_notes;
//                     let cls_status = DUtil.getStatusClass(c.status_id);
                    
//                     let select_package_class=null, is_search_result=false;
//                     if (search_value){
//                         switch(search_value){
//                             case c.barcode:{
//                                 is_search_result=true; 
//                                 select_package_class='trl-pg-checked';
//                                 break;
//                             }
//                             case c.receiver_phone:{
//                                 is_search_result=true; 
//                                 select_package_class='trl-pg-checked';
//                                 break;
//                             }
//                             case c.sender_phone:{
//                                 is_search_result=true; 
//                                 select_package_class='trl-pg-checked';
//                                 break;
//                             }
//                             case c.sender_name:{
//                                 is_search_result=true; 
//                                 select_package_class='trl-pg-checked';
//                                 break;
//                             }
//                             default:{
//                                 break;
//                             }
//                         }
//                     }
                            
//                     let p_row = ['<tr data-did="',c.delivery_id,'" data-barcode="',c.barcode,'" data-pid="',c.package_id,'">',
//                     `<td><span class="trl-numero ${select_package_class}">`,(i+1),`</span></td>`,
//                     '<td>',`<a href="javascript:void(0)" data-pid="${c.package_id}" data-barcode="${c.barcode}" class="trl_copy_barcode"><i class="fa fa-copy"></i></a><span class="trl-product-type">${c.product_type}</span>`,'</td>',
//                     '<td><span class="trl-sendername-text">',c.sender_name,'</span><span class="trl-senderphone-text">',c.sender_phone,'</span></td>',
//                     '<td><span class="pg-badge-delivery_type">',c.delivery_type,'</span><span class="trl-receiverphone-text">',c.receiver_phone,'</span></td>',
//                     '<td><span class="trl-zonecode-text">',c.zone_code,'</span><span class="trl-zonename-text">',c.zone_name,'</span></td>',
//                     '<td class="price">',[c.cur,c.cod_amount].join(''),'</td>',
//                     '<td class="base_fee">',[c.cur,c.base_fee].join(''),'</td>',
//                     '<td class="delivery_fee">',[c.cur,c.delivery_fee].join(''),'</td>',
//                     '<td class="forwarding_cost">',[c.cur,c.forwarding_cost].join(''),'</td>',
//                     '<td class="driver_total">',[c.cur,c.driver_total].join(''),'</td>',
//                     '<td><a href="javascript:void(0)" data-notes="',c.failure_notes,'" data-did="',c.delivery_id,'" data-pid="',c.package_id,'" data-statusid="',c.status_id,'" data-notes="',notes,'" class="',cls_status,' dpl_da_change_status">',c.status,'</a></td>',
//                     '<td>',action_buttons_html,'</td>',
//                     '</tr>'].join('');

//                     if(is_search_result)
//                         p_list = [p_row,p_list].join('');
//                     else
//                         p_list = [p_list,p_row].join('');
//                     i++;
//                 }while(c);

//                 if(p_list) 
//                     p_list = ['<div class="package_list_wrapper"><table class="packagelist_',did,' trl-package_table" style="width:100%">',table_header,'<tbody style="max-height:450px">',p_list,'</tbody></table></div>'].join('');
//                 else{
//                     tr.find('td.package_count').text(0);
//                     p_list = '<div class="alert alert-warning">មិនមានទំនិញ&nbsp;&nbsp;<a href="javascript:void(0)" class="trl_pa_refresh"><i class="fas fa-sync-alt" style="color:#fff;font-size:1.3em"></i></a></div>';
//                 }
//                 let d_html =['<tr data-did="',did,'" class="package_list ',specific_class,'">',
//                 '<td colspan="11">',p_list,'</td>',
//                 '</tr>'].join('');
//                 tr.after(d_html);
//                 return TripListComponent.tblTrips.find(['tbody>tr.',specific_class].join(''));
//             }

//             this.setHeaderSelectionState = (trip_header_tr,selected= true)=>{
//                 if (!trip_header_tr) return;
//                 if (selected){
//                     let did = trip_header_tr.data('did');
//                     mThis.displayPackageList(trip_header_tr,did);
//                 }
//                 else{
//                     trip_header_tr.removeClass('dpl-selected');
//                     let tr = trip_header_tr.next();
//                     if (tr.hasClass(`package_list`)) tr.remove();
//                 }
//             }

//             this.refreshPackageList = (package_list_tr,trip_header_row = null) =>{
//                 if(!package_list_tr) return;
//                 let delivery_id = package_list_tr.data('did');
//                 if(delivery_id >0) { 
//                     if (!trip_header_row) trip_header_row = TripListComponent.tblTrips.find(`tr.trip_${delivery_id}`);   
//                     trip_header_row.addClass('dpl-selected');
//                     mThis.prev_selected_tr = trip_header_row;

//                     let p = {'delivery_id':delivery_id};
//                     vsapi.call([mThis.base_url,'/api/getPackageListByTripId'].join(''),p).then(res=>{
//                         if (res.status_code ===200){
//                             let d = res.data;
//                             let packages = StringSanitizer.sanitizeObject(d.packages);
//                             TripListComponent.tblTrips.find(`tr.pl_${delivery_id}`).remove();
//                             mThis.prev_package_detail_tr = mThis.createExpandedPackageList(trip_header_row,delivery_id,packages);
                            
//                             d.trip_total = StringSanitizer.sanitizeOut(d.trip_total);
//                             d.package_count = StringSanitizer.sanitizeOut(d.package_count);
//                             d.status_id = StringSanitizer.sanitizeOut(d.status_id);
//                             TripListComponent.refreshTripInfo(trip_header_row,d);
//                         }
//                     });
//                 }
//             }
//         }
//     //end:: expanded_detail| Expandanle Package List pacakgeList
// }

const DeliveryDialogTrip = new function() {
    let mThis = this;
    this.self = main_view.appContent.children('#_trl_dlgDeliveryTrip');
    this.base_url = main_view.base_url; //this.self.find('#_base_url').val();
    this.elTitle =this.self.find('#_trl_dlgDeliveryTripTitle');
    this.lnkFindDriver = this.self.find('#_trl_trip_lnkFindDriver');
    this.btnAddPackage = this.self.find('#_trl_trip_add_package');
 
    this.btnStartDeliveryTrip = this.self.find('#_trl_trip_btnSaveTrip');
    this.btnClose = this.self.find('#_trl_trip_btnClose'); 

    this.elDepartTime = this.self.find('#_trl_trip_depart_time');
    this.elDeliveryType = this.self.find('#_trl_trip_delivery_type');
    this.elVehicleType = this.self.find('#_trl_trip_vehicle_type');
    this.elDriverCode = this.self.find('#_trl_trip_driver_code');
    this.elDriverId = this.self.find('#_trl_trip_driver_id'); 
    this.elDriverName = this.self.find('#_trl_trip_driver_name'); 
   
    this.lnkFindSender = this.self.find('#_trl_trip_lnkFindSender');

    this.tblTrips = this.self.find('#_trl_trip_tblPackages');
    this.elError = this.self.find('#_trl_trip_error');
     
    this.tblTrips_body = this.self.find('#_trl_trip_tblPackages_body');
    
    this.elBarcode = this.self.find('#_trl_trip_barcode');
    this.btnScan = this.self.find('#_trl_trip_btnScan');
    this.btnPrintBarCode = this.self.find('#_trl_trip_btnPrintBarcode');

    this.btnScan.on('click',(e)=>{
        e.preventDefault();
        let p = mThis.getData();
        mThis.scanPackageOut(p,mThis.elBarcode);
    });

    this.elBarcode.on('keypress',function(e){
        if(e.keyCode==13) {
            let p = mThis.getData();
            mThis.scanPackageOut(p,mThis.elBarcode);
        }
    });

    mThis.btnClose.on('click',function(e){
        e.preventDefault();
        let p = {'delivery_id':mThis.delivery_id};
        if (p.delivery_id){
            vsapi.call([mThis.base_url,'/api/deleteNewTrip'].join(''),p).then(res=>{
                if(res.status_code === 200){
                    return;
                }
            });
        }
        mThis.self.modal('hide');
    });

    mThis.btnStartDeliveryTrip.on('click',function(e){
        let p = mThis.getData();
        if (!p) {
            cv_interact.error('Invlid delivery data input');
            return;
        }
        p.driver_id = mThis.driver_id;
        vsapi.call([mThis.base_url,'/api/startDeliveryTrip'].join(''),p).then(res=>{
            if (res.status_code ===200){
                let d = res.data;
                if (typeof mThis.onClose ==='function') mThis.onClose(p); 
                mThis.self.modal('hide');

                let fleet_tracking_number ="";
                if (d.fleet_tracking_number) 
                    fleet_tracking_number =d.fleet_tracking_number;
                else
                    fleet_tracking_number =res.fleet_tracking_number;    
                mThis.prev_package_detail_tr = null;
                cv_interact.success(`Delivery Started! Fleet tracking number: ${fleet_tracking_number}`);
            }
            else{
                cv_interact.error(res.error_message);
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
        //let did = tr.data('did');
        let barcode = tr.data('barcode');
        if(!barcode){
            cv_interact.error('Barcode is not valid or does not exist');
            return;
        }
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
            cv_interact.error('The barcode is invalid or unexpectedly empty!');
            return;
        }
        window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
    });
   
    this.btnPrintBarCode.on('click',(e)=>{
        e.preventDefault();
        let barcode = mThis.elBarcode.val();
        mThis.elBarcode.parent().removeClass('has-error');
        if((barcode+'').trim() ===''){
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
        mThis.driver_id = option.driver_id;
        mThis.warehouse_id = option.warehouse_id;
        if (!mThis.warehouse_id || mThis.warehouse_id <=0) {
            cv_interact.error('Warehouse identifier is not valid');
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
    }
   
    this.displayDriverInfo = (data,fromServer=false)=>{
        if(fromServer){
            let p = {'driver_id':data};
            vsapi.call([mThis.base_url,'/api/getDriverInfo'].join(),p).then(res=>{
                d = StringSanitizer.sanitizeObject(res.data);
                mThis.elDriverCode.val(d.code);
                mThis.elDriverId.val(d.id);
                mThis.driver_id = d.id;
                mThis.elDriverName.val(d.name);
            });
        }
        else {
            mThis.elDriverCode.val(data.code);
            mThis.elDriverId.val(data.id);
            mThis.driver_id = data.id;
            mThis.elDriverName.val(data.name); 
        } 
    }
 
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

    this.scanPackageOut = (p_info,textbox)=>{
        if(!p_info) return; 
        if(!p_info.delivery_id) p_info.delivery_id = mThis.delivery_id;
        
        mThis.elError.html(null);
        mThis.elBarcode.parent().removeClass('has-error');
        vsapi.call([mThis.base_url,'/api/scanPackageOut'].join(''),p_info).then(res=>{
            if (res.status_code ===200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                if (!mThis.delivery_id) mThis.delivery_id = d.delivery_id;
                if (!mThis.delivery_id || mThis.delivery_id<=0) {
                    console.error(['Problem in scanning package "',p_info.barcode,'". Problem in creating delivery trip. The new delivery_id is unexpectedly zero or empty'].join(''));
                }

                if(d){
                    if (!$.isNumeric(d.exchange_rate)) d.exchange_rate =1;  
                    if(!d.driver_total_khr || d.driver_total_khr <=0) d.driver_total_khr = (d.driver_total * d.exchange_rate);
                    if (!d.base_cur) d.base_cur ='$';
                    if (!d.other_cur) d.other_cur ='៛';
                    let html_row = ['<tr data-barcode="',d.barcode,'" data-pid="',d.package_id,'" data-did="',d.delivery_id,'">',
                    '<td class="col_action">',
                    '<div class="form-inline">',
                        '<a href="javascript:void(0)" data-pid="',d.package_id,'" class="_tl_pa_remove btn btn-sm btn-outline-danger"><i class="fa fa-times"></i></a>&nbsp;',
                        '<a href="javascript:void(0)" data-pid="',d.package_id,'" data-barcode="',d.barcode,'" class="_tl_pa_print_barcode btn btn-sm btn-outline-success"><i class="fa fa-barcode"></i></a>&nbsp;',
                    '</div>'
                    ,'</td>',
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
                    if(textbox) textbox.val(null); 
                }
            }
            else{
                mThis.elError.html(res.error_message);
                if(textbox) textbox.val(null); 
            }
        });
    }

    this.removePackageRow = (tr)=>{
        if(!tr) return;
        let barcode = tr.data('barcode');
        let p = {'barcode':barcode,'delivery_id':tr.data('did')};
        vsapi.call([mThis.base_url,'/api/removeScannedPackage'].join(''),p).then(res=>{
            if(res.status_code ===200) tr.remove(); 
            else mThis.elError.html(res.error_message);
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
            VSUtil.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',false,null,def.vehicle_type);
            if(typeof onFinish == 'function') onFinish();
            return;
        }
        vsapi.call([mThis.base_url,'/api/getForm_options_delivery_trip'].join(''),null).then(res=>{
            let d = res.data;
            if(d){
                mThis.form_data ={};
                mThis.form_data.vehicle_types = StringSanitizer.sanitizeObject(d.vehicle_types);
                mThis.form_data.drivers = StringSanitizer.sanitizeObject(d.drivers);
                mThis.elDepartTime.val(DateHelper.getTodayDate());
                VSUtil.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',false,null,def.vehicle_type);
                if(typeof onFinish =='function') onFinish();
            }
        });
    }     
}

   //FilterDialog
const FilterDialog_trip = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_trl_dlgFilter');
    this.elFilter_warehouse = this.self.find('#_trl_filter_warehouse');
    this.elTitle = this.self.find('#_trl_dlgFilterTitle');

    this.elFilter_start_date = this.self.find('#_trl_filter_startdate');
    this.elFilter_end_date = this.self.find('#_trl_filter_enddate');

    this.elFilter_driver= this.self.find('#_trl_filter_driver');
    this.elFilter_status = this.self.find('#_trl_filter_status');
    
    this.form_data =null;
    //this.remembered_filter = {};
    this.btnOK = this.self.find('#_trl_dlgFilter_btnOK');

    this.self.find('.trip_filter_field').on('change',(e)=>{
        TripListComponent.remembered_filter = mThis.getData();
    });

    this.btnOK.on('click',(e)=>{
       mThis.self.modal('hide');
       let p = mThis.getData();
       if(typeof mThis.onClose =='function') mThis.onClose(p);
    });
  
    this.setFilterData = (d)=>{
        mThis.elFilter_status.val(d.status_id).trigger('change');
        mThis.elFilter_driver.val(d.driver_id).trigger('change');
        mThis.elFilter_start_date.val(d.start_date);
        mThis.elFilter_end_date.val(d.end_date);
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
        p.warehouse_id = mThis.elFilter_warehouse.val();
        p.start_date = mThis.elFilter_start_date.val();
        p.end_date = mThis.elFilter_end_date.val();
        p.driver_id = mThis.elFilter_driver.val();
        if(p.delivery_type==0)  p.delivery_type=null;
        p.status_id = mThis.elFilter_status.val();
        if(!p.start_date && !p.end_date && !p.status_id) p.status_id = 2; 
        return p;
    }

    //loadFilter() 
    this.loadFilterData = (def ={},onFinish)=>{ 
        if(!def.warehouse_id) def.warehouse_id = main_view.DEF_WAREHOUSE_ID;
        if (!def.status_id) def.status_id =2;
        if (TripListComponent.form_data) {
            if (!mThis.form_data) mThis.form_data = TripListComponent.form_data;
            VSUtil.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
            VSUtil.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,'(All Drivers)',def.driver_id);
            VSUtil.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'status_id','status_name',false,'(All Status)',def.status_id); 
 
            mThis.setFilterData(def);
            if(typeof onFinish ==='function') onFinish();
            return;   
        }

        vsapi.call([mThis.base_url,'/api/getForm_options_delivery_trip'].join(''),null,null).then(res=>{
            let data =res.data;
            if(data && data.statuses ){
                data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
                data.statuses = StringSanitizer.sanitizeObject(data.statuses);
                data.drivers = StringSanitizer.sanitizeObject(data.drivers);
                data.statuses.unshift({"status_id":-1,"status_name":"(All Statuses)"});         
                data.drivers.unshift({'id':null,'driver_name':'(All Drivers)'});
                
                VSUtil.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                VSUtil.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,null,def.driver_id);
                VSUtil.setComboItems(mThis.elFilter_status,data.statuses,'status_id','status_name',false,null,def.status_id);
                mThis.setFilterData(def);
                mThis.form_data = data;

                if(typeof onFinish =='function') onFinish();
                TripListComponent.form_data = data;
            }
        });
    }
}

const PackageStatusDialog = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_trl_dlgPackageStatus');
    this.elTitle = this.self.find('#_trl_dlgPackageStatusTitle');
    this.btnOK = this.self.find('#_trl_dlgPackageStatus_btnSave');
    this.statuses = [{'id':8,'status_name':'Delivered'},{'id':9,'status_name':'Failed'}];

    this.elStatus = this.self.find('#_trl_ps_status');
    this.elNotes = this.self.find('#_trl_ps_notes');
    this.elError = this.self.find('#_trl_ps_error');

    mThis.elStatus.on('change',function(e){
        mThis.elError.html(null);
        if(mThis.elStatus.val()==9 || mThis.elStatus.val() ==11) {
            mThis.elNotes.parent().show();
        }
        else {
            mThis.elNotes.parent().hide();
        }
    });

    this.btnOK.on('click',function(e){
        let notes = mThis.elNotes.val();
        if (!mThis.elNotes.is(':visible')) notes = null;
        let p = {'status_id':mThis.elStatus.val(),'notes':notes};
        if (!p.status_id || p.status_id<=0) {
            mThis.elError.html('សូមជ្រើសរើសស្ថានភាពនៃទំនិញ');
            return;
        }

        if (p.status_id ==9 || p.status_id ==11) {
            if ((p.notes ||'').trim() ==''){
                mThis.elError.html('ត្រូវការហេតុផលសំរាប់ទំនិញបញ្ជូនមិនបានសំរេច(Failed) និង ទំនិញបញ្ជូនត្រឡប់វិញ(Returned)');
                return;
            }
        }
        mThis.self.modal('hide');
        if(typeof mThis.onClose ==='function') mThis.onClose(p);
    });
    
    this.loadAllowableStatuses = (def_status_id, onFinish)=>{
        if(def_status_id !=9 && def_status_id !=8) def_status_id = null;
        if (mThis.statuses){
            VSUtil.setComboItems(mThis.elStatus,mThis.statuses,'id','status_name',false,null,def_status_id);
            onFinish();
            return;
        }

        let ps= [];
        if(FilterDialog_package.form_data){
            ps = FilterDialog_package.form_data.statuses;
            mThis.statuses =ps;
            //VSUtil.setComboItems(mThis.elStatus,ps,'id','status_name',false,null,def_status_id);
        }
        else{
            FilterDialog_package.loadFilterData(TripListComponent.remembered_filter, ()=>{
                ps = FilterDialog_package.form_data.statuses;
                
                //VSUtil.setComboItems(mThis.elStatus,ps,'id','status_name',false,null,def_status_id);
                mThis.statuses =ps;
                onFinish();
            });
        }
    }

    //show Status Dialog
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

const AddItemToTripDialog = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_trl_dlgAddItemTotrip');
    this.elTitle = this.self.find('#_trl_dlgAddItemTotripTitle');
    this.btnAdd = this.self.find('#_trl_dlgAddItemTotrip_btnSave');
    this.btnAddAndNew = this.self.find('#_trl_dlgAddItemTotrip_btnSaveAndNew');

    this.elError = this.self.find('#_trl_dlgAddItemTotrip_error');

    this.elStatus = this.self.find('#_trl_apt_status');
    this.elBarcode = this.self.find('#_trl_apt_barcode');
    this.elNotes = this.self.find('#_trl_apt_notes');
    this.statuses = [{'id':9,'status_name':'Failed'},{'id':'8',status_name:'Delivered'},{'id':7,'stat_name':'Delayed'}];
    
    this.elBarcode.on('keyup',(e)=>{
       e.preventDefault();
       if (e.keyCode ===13) mThis.btnAddAndNew.trigger('click');
    });

    this.btnAddAndNew.on('click',(e)=>{
        e.preventDefault();
        mThis.elError.html(null);

        let p = {
            'delivery_id':mThis.delivery_id,
            'barcode':mThis.elBarcode.val()
        };
       
        if (!p.barcode) {
            mThis.elError.html('barcode is not valid');
            return;
        }
       
        mThis.addPackageToTrip(p,false);
    });

    this.btnAdd.on('click',function(e){
        e.preventDefault();
        mThis.elError.html(null);

        let p = {
            'delivery_id':mThis.delivery_id,
            'barcode':mThis.elBarcode.val()
        };
       
        if (!p.barcode) {
            mThis.elError.html('barcode is not valid');
            return;
        }
        mThis.addPackageToTrip(p,true);
    });

    this.addPackageToTrip = (p,closeOnSuccess=false) => {
        vsapi.call([mThis.base_url,'/api/addPackageToTrip'].join(''),p).then(res=>{
            if(res.status_code ===200) {
                let result = StringSanitizer.sanitizeObject(res.data);
                
                if (closeOnSuccess) 
                {
                   cv_interact.success(`Package has been added successfully`);
                   mThis.self.modal('hide');
                }

                //let list_tr = TripListComponent.tblTrips.find(['tr.pl_',p.delivery_id].join(''));
                TripListComponent.refreshPackageList(p.delivery_id,null,null);
                
                if (result.prev_trip_deleted ===1){
                    let trip_header_tr = TripListComponent.tblTrips.find(['tr.trip_',result.prev_delivery_id].join(''));
                    let tr = trip_header_tr.next();
                    if(tr.hasClass(`pl_${result.prev_delivery_id}`)){
                        tr.remove();
                    }
                    trip_header_tr.remove();  
                }
                else if (result.prev_delivery_id > 0) {
                    let prev_trip_header_tr = TripListComponent.tblTrips.find(['tr.trip_',result.prev_delivery_id].join(''));
                    prev_trip_header_tr.removeClass('dpl-selected');
                    let tr = prev_trip_header_tr.next();
                    if(tr.hasClass(`pl_${result.prev_delivery_id}`)) tr.remove();
                    let trip_status = (result.prev_trip_status_id ===3)? 'Done':'On Delivery'; 
                    let d = {'status':trip_status,'status_id':result.prev_trip_status_id,'trip_total':result.prev_trip_total,'package_count':result.prev_trip_package_count};   
                    TripListComponent.refreshTripInfo(prev_trip_header_tr,d);
                }
                if(!closeOnSuccess) mThis.elBarcode.val(null);
                // if (closeOnSuccess) 
                //  {
                //     //cv_interact.success(`Package has been added successfully`);
                //     mThis.self.modal('hide');
                //  }
                // else
                    //mThis.elBarcode.val(null);
            }
            else mThis.elError.text(res.error_message);
        });
    }

    this.show = (op={},onClose)=>{
        mThis.elError.html(null);
        mThis.elBarcode.val(null);
        mThis.onClose = onClose;
        mThis.delivery_id = op.delivery_id;
        mThis.elTitle.html(op.title);
        if (!op.delivery_id) {
            cv_interact.error(localManager.trans('Trip identity is not valid','validation'));
            return;
        }

        VSUtil.setComboItems(mThis.elStatus,mThis.statuses,'id','status_name',true,'Select status',0);
        mThis.self.modal({
            backdrop:'static'
        }).on('shown.bs.modal',function(){
            mThis.elBarcode.focus();
            mThis.elBarcode.select();
        });
    }
}

const TrackingMapView = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_trl_tracking_map_panel');
    this.elFilter_tracking_driver = this.self.find('#_trl_filter_tracking_driver');
    this.btnSearch = this.self.find('#_trl_btnSearch');
    this.btnShowTrips = this.self.find('#_trl_btnShowTrips');

    this.btnShowTrips.on('click',function(e){
        let op = {'title':'Manage Fleet'};
        TripListComponent.show(op);
    });

    this.show = (option)=>{
        if(!option) option = {};
        if (!option.title) option.title ='Live Tracking View';
        mThis.self.siblings().hide();
        main_view.setTitle(mThis.title_prop);
        mThis.self.hide().fadeIn(250);
    }
};
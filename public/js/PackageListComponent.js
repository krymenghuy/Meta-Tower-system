'use strict'
//## begin::PackageListComponent
var PackageListComponent = new function() {
    let mThis = this;
    this.lang ='kh';
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_packageListComponent');
    this.base_url = $('#__base_url').val();
    this.tblPackages = $('#_dl_tblPackages');
    this.package_dropdown_menu = mThis.tblPackages.find('.dropdown-menu');
    
    this.lnkReceivePackage = $('#_dl_lnkReceivePackage');
    this.btnScanBackIn = $('#_dl_btnScanBackIn');
    this.elSearchPackage = $('#_dl_search');
    this.btnSearch = $('#_dl_btnSearch');
    this.btnToggleFilter = $('#_dl_btnToggleFilter');

    this.btnPrint = $('#_dl_btnPrint');
    this.btnPDF = $('#_dl_btnPDF');
    this.btnExcel = $('#_dl_btnExcel');
 
    //this.tblPackages_body = $('this.tblPackages_body');
 
    this.init = function() {
        // window.onresize = function(event) {
        //     let div = mThis.tblPackages.parent();
        //     let h = window.screen.height;
        //     if (h>160) h = h-150;
        //     div.css('height',h+'px');
        // };
        
        if(mThis.initialized ==true) return;
        
        FilterDialog_package.loadFilterData();
         mThis.btnSearch.on('click',function(){
            mThis.displayOutstandingPackageList();
         });

         mThis.elSearchPackage.on('keyup',function(e){
           if (e.keyCode ==13){
              mThis.displayOutstandingPackageList();  
           }
         });

         //mThis.localizePackageStatuses();
         this.btnToggleFilter.on('click',()=>{
             let op = {};
             FilterDialog_package.show(op,(d)=>{
               if(d){
                 mThis.displayOutstandingPackageList(d);
               }
             });
         });

         mThis.btnPrint.on('click',function(e){
            let d = FilterDialog_package.getData(); 
            let params = ['rtype=packagelist&completed=0&wid=',d.warehouse_id,'&date=',d.date,'&search=',mThis.elSearchPackage.val(),'&zonecode=',d.zone_code,'&driverid=',d.driver_id,'&sid=',d.sender_id,'&dtype=',d.delivery_type,'&stid=',d.status_id].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
            });
         }); 
  
         this.btnPDF.on('click',function(e){
           let p = FilterDialog_package.getData();
           p.search_value = mThis.elSearchPackage.val();
           let sub_title =null;
           if(p.start_date && p.end_date) [p.start_date,' to ', p.end_date].join('');
           let rpt_title = 'Package List';
           if (mThis.lang == 'kh') rpt_title = 'បញ្ជីរកញ្ចប់ទំនិញ';
           try {
                post_ajax([mThis.base_url, '/api/getOutstandingPackageList_print'].join(''),p,function(data){
                    if(data){
                        //data = StringSanitizer.sanitizeObject(data,'email');
                        //mThis.processPackageList_print() return object @d = {'data':json array,'titles':[]}
                        let d = mThis.processPackageList_print(data);
                        let op = {'title':rpt_title,'title_color':'blue','subTitle':sub_title,'header_columns':d.titles};
                        pdfReport.viewPDF_json(d.data,op); 
                    } 
           });           
           }catch(e){
               cv_interact.alert(e.toString());
           } 
         });
     
         this.btnExcel.on('click',function(e){
            let p = FilterDialog_package.getData();
            p.search_value = mThis.elSearchPackage.val();
                 post_ajax([mThis.base_url, '/api/getOutstandingPackageList_print'].join(''),p,function(data){
                     if(data){
                         let d = mThis.processPackageList_print(data);
                         JsonToExcel.exportToExcel(d.data,'package_list',d.titles);  
                     } 
            });
          });
         
      //##BEGIN:: tblPackages dropdown menu
                mThis.tblPackages.on('click','a.btn_package_action',function(e) {
                    e.preventDefault();
                    let p = $(this).parent();
                    let x = $(this);
                    
                    let delivery_id = x.data('id');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let package_id = x.data('pid');
                    let barcode = x.data('barcode');
                    let status_id = x.data('statusid'); 
                     
                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                    
                        p.append(mThis.createDropdownMenuHtml_package(delivery_id,package_id,barcode,status_id));
                        dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let x = mThis.tblPackages.find('div.dropdown-menu'); 
                    let container =  x.parent(); 
                    //mThis.package_dropdown_menu.parent(); // div.dropdown
                    
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            //mThis.package_dropdown_menu.removeClass('show');
                            x.removeClass('show'); 
                        } 
                    }
                });
                
                mThis.tblPackages.on('mouseover','tr',function(e){
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_barcode = x.find('a._dl_pa_quick_btn_barcode');
                    btn_barcode.show();
                    col_action.find('a.btn_package_action>i').addClass('action-button-zoomin');    
                }).on('mouseleave','tr',function(e) {
                    let x = $(this);
                    let col_action = x.find('td.col_action');
                    let btn_barcode = x.find('a._dl_pa_quick_btn_barcode');
                    btn_barcode.hide();
                    col_action.find('a.btn_package_action>i').removeClass('action-button-zoomin');
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });
                
       //##END:: tblPackages dropdown menu
 
      
       mThis.popper_div = $('#_dl_pg_pop_view'); 
       mThis.tblPackages.on('mouseover','button.btn-status',function(e){
          let popper_notes = new Popper($(this),mThis.popper_div,{
             placement: 'top'                
          });
          popper_notes.show();
       }).on('mouseleave','button.btn-status',function(e){

       });
 
       mThis.tblPackages.on('click','a._pl_pa_delete',function(e){
           e.preventDefault();
           let x = $(this).closest('div.dropdown-menu');
           let package_id = x.data('pid');
           let barcode = x.data('barcode');
           //let pid = x.data('pid'); //package id
           cv_interact.confirm('Delete this package?','Delete Package',function(e){
               if(e) {
                   mThis.deletePackage(barcode,package_id);
               }
           }); 
       });
       
       //print package's barcode
       mThis.tblPackages.on('click','a._pl_pa_print_barcode',function(e){
            e.preventDefault();
            let x = $(this).parent();
            let barcode = x.data('barcode');
            //let pid = x.data('pid'); //package id
            window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
      });

       //print package's barcode Quick Button 
       mThis.tblPackages.on('click','tr a._dl_pa_quick_btn_barcode',function(e){
        e.preventDefault();
        let x = $(this);
        let barcode = x.data('barcode');
        //let pid = x.data('pid'); //package id
        window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
      });

      
       mThis.tblPackages.on('click','tbody>tr.package_header',function(e){
           let tr = $(this);
           let pid = tr.data('pid');
           let btn_package_action = tr.find('td.col_action .btn_package_action');
           let dropdown_menu = tr.find('td.col_action div.dropdown-menu');
           if(!btn_package_action.is(e.target) && btn_package_action.has(e.target).length ===0) {
              //display package details when user click on row (tr) Except clicking on btn_package_action 
              if (!dropdown_menu.is(e.target) && dropdown_menu.has(e.target).length ===0)  mThis.expanded_detail.displayPackageExpandedDetails(tr,pid,false); 
             
           }
       });

       //Update Delviery status
       mThis.tblPackages.on('click','a._pl_pa_change_status',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            let delivery_id = tr.data('did');
            let pid = tr.data('pid');
            //let driver_id = tr.data('driverid');
            let def_status_id = tr.data('statusid');
            //let sender_id = tr.data('senderid');
 
            let option = {
                "title":"Set Package Status",
                "data":mThis.statuses,
                "textMember":"status_name", //status code
                "valueMember":"id",  // status name of delivery. Whereas status_id is used in table order.status_id
                "dataLabel":"Choose package status",
                'blankErrorMessage':'Please select one status',
                'okBtnText':'OK',
                'defaultValue': def_status_id
            };

            InputBox2.show(option,function(data) {
                if(data) {
                    let p = {
                        "delivery_id":delivery_id,
                        "package_id":pid,
                        "status_id":data.value
                    };
                    
                    post_ajax([mThis.base_url,'/api/updatePackageStatus'].join(''),p,(err)=>{
                        if(!err || err =='') {
                            let td = tr.find('td.package-status');
                            td.find('a.pg-text').text(data.text); 
                            //mThis.expanded_detail.refreshPackageData(tr,pid);
                        } else cv_interact.alert(err,'','error');
                    });
                 }
            });
       });

        //  //Modify delivery information
        //     mThis.tblPackages.on('click','a._pl_pa_modify',function(e){
        //         e.preventDefault();
        //         let delivery_id = $(this).closest('div.dropdown-menu').data('id');
        //         let option = {
        //             'delivery_id':delivery_id,
        //             'title':'Modify Delivery Information'
        //         };

        //         ReceivePackageDialog.show(option,function(d){
        //         if(d) {
        //             mThis.displayOutstandingPackageList();  
        //         }
        //         });
        //     });

        mThis.tblPackages.on('click','a._pl_pa_quick_return_package',function(e){
            e.preventDefault();
            let x =$(this);
            let tr = x.closest('tr');
            let p  = {'package_id':tr.data('pid')};
            //let def_driver_id = tr.data('driverid');
            cv_interact.confirm('Return this package?','Return Package',function(e){
                    if(e){
                        post_ajax([mThis.base_url,'/api/returnPackage'].join(''),p,function(res){
                            if(res.status =='OK'){
                               //update status on package trail | updatePackageStatus() || displayPackageStatus() || displayStatus()
                               let btn = tr.find('a._pol_status');
                               btn.data('statusid',11);
                               btn.data('status','Returned');
                               btn.text('Returned');
                            }else cv_interact.alert(res.error_message);
                        }); 
                    }
            });

          
        });
      
    //    //Quick Assign Driver to Delivery
       mThis.tblPackages.on('click','a._pl_pa_quick_assign_driver',function(e){
            e.preventDefault();
            let x =$(this);
            let tr = x.closest('tr');
            //let delivery_id = tr.data('did');
            let def_driver_id = tr.data('driverid'); //not correct this line yet
            let pacakge_id = tr.data('pid');
            if (!mThis.drivers1){
                let i=0,c;
                mThis.drivers1 = [];
                mThis.drivers1.push({'id':-1,'driver_name':'Unassign'});
                do{
                   c = mThis.form_data.drivers[i];
                   if(!c) break;
                   if (c.id > 0) mThis.drivers1.push(c); 
                   i++;
                }while(c); 
            } 
            let option = {'title':'Assign Driver','dataLabel':'Select a driver','valueMember':'id','textMember':'driver_name','data':mThis.drivers1,'blankErrorMessage':"Please choose one driver","defaultvalue":def_driver_id};
            InputBox2.show(option,function(d){ 
                if(d){
                    let p = {};
                    p.driver_id = d.value; /** d.value = driver id and d.text = driver name **/
                    p.warehouse_id = FilterDialog_package.elFilter_warehouse.val();
                    //p.delivery_id = delivery_id;
                    p.package_id = pacakge_id?pacakge_id:0;
                    if (p.driver_id==-1)  p.driver_id =null; //Set driver to "Unassigned"
                    if(!p.warehouse_id || p.warehouse_id <=0) {
                        cv_interact.alert('Warehouse ID is not valid');
                        return;
                    }
                                                   //assignDriver()
                    post_ajax([mThis.base_url,'/api/b_assignDeliveryDriver'].join(''),p,function(result){
                        if(typeof result == 'string') console.log(result);
                       
                        if(result.status =='OK') {
                            let status = 'On Delivery';
                            let status_id =6;
                            if (!p.driver_id || p.driver_id <=0) {
                               status = 'At Warehouse';
                               status_id =5;
                            }
                            mThis.displayDriverData(tr,{"driver_id":p.driver_id,"driver_name":d.text,'status':status,'status_id':status_id}); 
                        } else cv_interact.alert(result.error_message,'','error');
                    });
                }
            });
       });
 
    
    //    //Change Driver to Delivery
    //    mThis.tblPackages.on('click','a._pl_pa_change_driver',function(e){
    //     e.preventDefault();
    //     let x = $(this);
       
    //     let tr = x.closest('tr');
    //     let def_driver_id = tr.data('driverid');
    //     let pacakge_id = tr.data('pid');
    //     let delivery_id = tr.data('did');
    //     //let status_code = x.data('status');
           
    //     let option = {'title':'Change Driver','dataLabel':'Select a driver','valueMember':'id','textMember':'driver_name','data':mThis.form_data.drivers,'blankErrorMessage':"Choose a driver (Delivery)","defaultValue":def_driver_id};
    //     InputBox2.show(option,function(d){
    //         if(d){
    //             let p = {};
              
    //             p.driver_id = d.value; /** d.value = driver id and d.text = driver name **/
    //             p.delivery_id = delivery_id;
    //             p.package_id = pacakge_id?pacakge_id:0;
    //             //p.def_driver_id = def_driver_id;
    //             if (p.driver_id==-1 || !p.driver_id) p.driver_id =0; //Set driver to "Unassigned"

    //             post_ajax([mThis.base_url,'/api/changeDeliveryDriver'].join(''),p,function(err){
    //                 if(!err) {
    //                     mThis.displayDriverData(delivery_id,{"driver_id":p.driver_id,"driver_name":d.text}); 
    //                 } else cv_interact.alert(err,'','error');
    //             });
    //         }
    //     });
        
    // });
       
    //## begin:: action buttons for package's expanded detail (Edit, Cancel Edit, and Save)
                mThis.tblPackages.on('click','a.pg-detail_edit_button',function(e){
                        e.preventDefault();
                        let x =$(this);
                        let btn_cancel_edit = x.parent().find('a.pg-detail_cancel_edit_button');
                        let btn_save = $(this).parent().find('a.pg-detail_save_button');
                        x.hide();
                        btn_cancel_edit.show();
                        btn_save.show();
                        mThis.expanded_detail.beginEdit(x.closest('tr'));
                }); 

                mThis.tblPackages.on('click','a.pg-detail_cancel_edit_button',function(e){
                    e.preventDefault();
                    mThis.expanded_detail.cancelEdit($(this).closest('tr'));
                }); 

            mThis.tblPackages.on('click','a.pg-detail_save_button',function(e){
                e.preventDefault();
                let x = $(this); 
                let btn_modify = x.parent().find('a.pg-detail_edit_button');
                let btn_cancel_modify = $(this).parent().find('a.pg-detail_cancel_edit_button');
                
                let onDone = (succeeded)=>{
                    if(succeeded) {
                        x.hide();
                        btn_cancel_modify.hide();
                        btn_modify.show();
                    }
                }
                mThis.expanded_detail.saveChanges(x.closest('tr'),onDone);
            });  
    //## end::action buttons for package's expanded detail (Edit, Cancel Edit, and Save)
       
    //Click to Scan in Failed Packages in order to change status to "CTD = Continue to Delvier"
     $('#_dl_btnScanBackIn').on('click',function(e){
        e.preventDefault();
        let op = {'title':'Scan In'};
        ScanInDialog.show(op,()=>{
            //alert('closed');
        }); 
      });

       //Click to Create new Delivery     
        mThis.lnkReceivePackage.on('click',function(e){
            e.preventDefault();
            let back_option ={'title':'Package Trail'};
            let op = {'title':'Receive Pacakges','order_id':null,'allow_find_sender':true,'prev_component':mThis,'prev_component_option':back_option,'form_data':mThis.form_data};
            ReceivePackageComponent.show(op,(d)=>{
                if(d){
                    mThis.displayPickupList();
                } 
            }); 

            // let option ={'title':'Receive Packages','order_id':null,'allow_find_sender':true};
            // VerifyPackageDialog.show(option,function(e){
            //     if(e){
            //         mThis.displayOutstandingPackageList();
            //     }
            // });  
        });

        
        //initialize class "expanded_detail", which is the package's dropdown expanded detail
        mThis.expanded_detail.init();

        mThis.initialized = true;
    }
    //end::PackageListComponent.init()

    this.show = (option)=>{
        mThis.elScreenTitle.html(option.title);
        mThis.displayOutstandingPackageList();
        mThis.self.show().siblings().hide();
    }
    
    this.processPackageList_print = (data)=>{
        let titles =['No','Barcode','Date','Sender','Customer','Driver','Type','COD','Fees','Total','Status'];
        if (mThis.lang =='kh') titles =['ល.រ','លេខកួដ','កាលបរិច្ចេទ','អ្នកផ្ញើរ','អ្នកទទួល','អ្នកដឹក','សេវា','ថ្លៃទំនិញ','ថ្លៃសេវា','សរុប','ស្ថានភាព'] 
        let c,i=0;
        let rows=[];
        do{
          c = data[i];
          if(!c) break;
             if(!c.cur) c.cur ='$';
             if(!c.cod_amount) c.cod_amount =0;
             if(!c.fees) c.fees=0;
             let row = {'No':(i+1),'barcode':c.barcode,'booking_date':c.booking_date,'sender':[c.sender_name,'\n',c.sender_phone].join(''),'zone_name':[c.zone_name,'\n',c.receiver_phone].join(''),'driver':c.driver_name,'type':c.delivery_type,'cod':[c.cur,c.cod_amount].join(''),'fees':[c.cur,c.fees].join(''),'total':[c.cur,c.driver_total].join(''),'status':c.status};
              rows.push(row);
             i++;
        }while(c);
        return {'data':rows,'titles':titles};
    }

    this.displayDriverData = (tr,d)=>{
         let prev_did =0;
         let cnt =0;

       if (tr){
            tr.data('driverid',d.driver_id);
            tr.find('a._pol_driver_name').text(d.driver_name);
            let lnkStatus = tr.find('td.package-status').find('a._pol_status');
            lnkStatus.text(d.status);
            lnkStatus.data('statusid',d.status_id);
            tr.data('statusid',d.status_id);

            let d_tr = tr.next();
            if(d_tr.hasClass('package_detail')) {
                d_tr.find('span.pg-driver').text(d.driver_name);
            }
            return true;
       }  

       mThis.tblPackages.find('tr.package_header').each(function(){
            cnt++;
            let x = $(this);
            let this_id = x.data('did');
            let found = false;
            if(this_id === delivery_id) {
                x.data('driverid',d.driver_id);
                x.find('a._pol_driver_name').text(d.driver_name);
                let lnkStatus = x.find('td.package-status').find('a._pol_status');
                lnkStatus.text(d.status);
                lnkStatus.data('statusid',d.status_id);
                x.data('statusid',d.status_id);

                let d_tr = x.next();
                if(d_tr.hasClass('package_detail')) {
                    d_tr.find('span.pg-driver').text(d.driver_name);
                }
                prev_did = this_id;
                found = true;
            } else {
                if(found==true) return false;
            }
       });
         
        // //the following is to update driver in one row only
        //// the following code needs parameter @tr html row
        //     let detail_tr = null;
        //     if(tr.hasClass('package_detail')) 
        //     detail_tr = tr;
        //     else {
        //         detail_tr = tr.next();
        //     }
        
        //     if(detail_tr){
        //         if(detail_tr.hasClass('package_detail')) {
        //             let span = detail_tr.find('span.pg-driver');  
        //             span.text(driver.driver_name);
        //         } 
        //     }
        // //the above code is to update driver data in one row only
    }

    this.localizePackageStatuses = (onFinish)=>{
        post_ajax([mThis.base_url,'/api/getComboItems_package_status'].join(''),null,function(rows){
            if(rows){
                mThis.statuses = StringSanitizer.sanitizeObject(rows);
                if(typeof onFinish =='function') onFinish();
            }
         }); 
    }
   
    this.createDropdownMenuHtml_package =(delivery_id,package_id,barcode,status_id)=> {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-deliveryid="',delivery_id,'" data-pid="',package_id,'" data-barcode="',barcode,'" data-statusid="',status_id,'">',
        '<a class="dropdown-item _pl_pa_quick_assign_driver" href="#"><i class="fa fa-biking" style="color:green"></i> <span>Assign Driver</span</a>',
        '<a class="dropdown-item _pl_pa_print_barcode" href="#"><i class="fa fa-barcode" style="color:green"></i> Print Barcode</a>',
        //'<a class="dropdown-item _pl_pa_change_receiver_info" href="#"><i class="fa fa-edit" style="color:green"></i> Change Receiver Info</a>',
          //'<a class="dropdown-item _pl_pa_modify" href="#"><i class="fa fa-edit" style="color:green"></i> Modify Package Info</a>',
           
          //'<a class="dropdown-item _pl_pa_modify" href="#"><i class="fa fa-edit" style="color:green"></i> Modify Delivery Info</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _pl_pa_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Package</a>',
          '<a class="dropdown-item _pl_pa_quick_return_package" href="#"><i class="fa fa-tasks" style="color:blue"></i> <span>Return To Store</span</a>',
          //'<a class="dropdown-item _pl_pa_change_status" href="#"><i class="fa fa-edit" style="color:blue"></i> Change Package Status</a>',
          //'<a class="dropdown-item _pl_pa_package_list" href="#"><i class="fa fa-list-alt" style="color:orange"></i> Package List</a>',
          '</div>'].join('');
          return html;
    };

    this.deletePackage = (barcode,package_id)=>{
        let p = {'barcode':barcode?barcode:'','package_id':package_id};
       post_ajax([mThis.base_url,'/api/deletePackage'].join(''),p,function(err){
         if(!err || err =='') {
             mThis.displayOutstandingPackageList();
         } else cv_interact.alert(err,'','error');
       });
    }

    this.displayOutstandingPackageList = function(filter)
    { 
        let p = {};
        if (filter) 
          p = filter;
        else {
          p = FilterDialog_package.getData();
        }
        p.search_value = mThis.elSearchPackage.val();
        post_ajax([mThis.base_url, '/api/getOutstandingPackageList'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
             
            if (mThis.table){
                    mThis.tblPackages.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblPackages.empty();
                    //alert('destroyed => '+  mThis.tblPackages.html());
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
                             '<a href="#" data-barcode="',data.barcode,'" data-pid="',data.package_id,'" data-did="',data.delivery_id,'" data-statusid="',data.status_id,'" class="btn_package_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        data:function(data,a,b){
                            return ['<div style="display:flex;flex-direction:row">',
                             '<div><span class="pg-barcode">',data.barcode,'</span>',
                             '<span class="pg-pickup_time">',data.arrival_time,'</span></div>',
                             '<a href="javascript:;" style="display:none" data-barcode="',data.barcode,'" class="_dl_pa_quick_btn_barcode"><i class="fa fa-barcode" style="color:green"></i></a>',
                            '</div>'].join('');
                        },
                        title:'Barcode'
                    },
                    {
                        data:function(data,a,b) {
                            if(!data.sender_phone) data.sender_phone ='(Contact not available)';
                            return ['<div style="display:flex;flex-direction:column;align-items:justify-content"><span class="pg-text pg-sender_name" data-field="sender_name">',data.sender_name,'</span><div style="display:flex;flex-direction:row">',
                            '<span class="pg-text pg-sender_type" data-field="sender_type">',data.sender_type,'</span>',
                            '<div style="width:15px"></div>',
                            '<span class="pg-text pg-sender_phone" data-field="sender_phone">',data.sender_phone,'</span>',
                            ,'</div></div>'].join('');
                        },
                        title:'Merchant'
                    },
                    {
                        data:function(data,a,b) {
                            if(!data.product_type) data.product_type ='Generic Product';
                            if(!data.receiver_phone || data.receiver_phone =='') 
                              data.receiver_phone ='<span class="pg-no_customer_phone">Customer phone not avaialable</span>';
                            else
                              data.receiver_phone =['<span class="pg-text pg-receiver_phone" data-type="number" data-field="receiver_phone">',data.receiver_phone,'</span>'].join('');  
                            return ['<div style="display:flex;flex-direction:column">',
                                 '<div style="display:flex;flex-direction:row;align-items:space-between">',
                                      '<span class="pg-text pg-product_type" data-field="product_type">',data.product_type,'</span>',
                                      '<span class="pg-text pg-delivery_type pg-badge-delivery_type" style="margin-left:30%" data-field="delivery_type">',data.delivery_type,'</span>',
                                 '</div>',
                              '<div style="width:100%">',data.receiver_phone,'</div>',
                            '</div>'].join('');
                        },
                        title:'Package Info' 
                    },
                    {
                        data:function(data,a,b) {
                            if(!data.zone_code) data.zone_code ='(Zone code)';
                            if(!data.zone_name) data.zone_name ='(Zone Name)';
                            return ['<div style="display:flex;flex-direction:column;align-items:justify-content;margin-top:-10px"><span class="pg-text pg-zone_code" data-field="zone_code">',data.zone_code,'</span><span class="pg-text pg-zone_name" data-field="zone_name">',data.zone_name,'</span></div>'].join('');
              
                        },
                        title:'Destination'
                    },
                    {
                        className:'package-status',
                        data:function(data,type,meta) {
                            let str_driver = ['<a href="javascript:void(0)" class="_pol_driver_name">',data.driver_name?data.driver_name:'មិនមានអ្នកដឹក','</a>'].join('');
                            if (data.status_id==8) 
                               return ['<a class="btn btn-sm btn-outline-success pg-text _pol_status" data-field="status" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" data-senderid="',data.sender_id,'" href="javascript:;">',data.status,'</a>',str_driver].join('');
                            else if (data.status_id ==9)
                               return ['<a class="btn btn-sm btn-outline-danger pg-text _pol_status" data-field="status" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" data-senderid="',data.sender_id,'" href="javascript:;">',data.status,'</a>',str_driver].join('');
                            else if (data.status_id ==9)
                               return ['<a class="btn-on-delivery btn btn-sm btn-outline-warning pg-text done _pol_status" data-field="status" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" data-senderid="',data.sender_id,'" href="javascript:;">',data.status,'</a>',str_driver].join('');
                            else
                               return ['<a class="btn btn-sm btn-outline-primary pg-text _pol_status" data-field="status" data-statusid="',data.status_id,'" data-status="',data.status,'" data-did="',data.delivery_id,'" data-senderid="',data.sender_id,'" href="javascript:;">',data.status,'</a>',str_driver].join('');    
    
                        },
                        title:'Status'
                    },
                    {
                          className:'total', //css class "total" is used for accessing value and update values of totals in <td>
                          data:function(data,a,b){
                            return ['<div style="display:flex;flex-direction:column">',
                                '<div class="pg-total_driver"><span class="total-label">Driver:</span><span class="total-value driver-total">',data.driver_total,'</span></div>',
                                '<div class="pg-total_sender"><span class="total-label">Sender:</span><span class="total-value sender-total">',data.sender_total,'</span></div>',
                            '</div>'].join(''); 
                        },
                        title:'Totals'
                    }
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblPackages.DataTable({
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
                bLengthChange:false,
                saveState:true,
                 // rowReorder: {
                    // dataSrc: 'sequence'
                  // },
                   'processing': true,
                   'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": "No outstanding packages found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          let tr = $(row);
                         
                          if(!data.package_id) data.package_id = data.id;
                          tr.addClass('package_header');
                          tr.data('did',data.delivery_id); //delivery_id
                          tr.data('pid',data.package_id); //package_id
                          tr.data('barcode',data.barcode);
                          tr.data('driverid',data.driver_id); //driver_id
                          tr.data('statusid',data.status_id); 
                        
                         tr.data('senderid',data.sender_id); //(sender_id, delivery_type,zone_code, billed_kg) are important to determine delivery pricing details 
                         tr.data('dtype',data.delivery_type);//(sender_id, delivery_type,zone_code, billed_kg) are important to determine delivery pricing details
                         tr.data('zonecode',data.zone_code);//(sender_id, delivery_type,zone_code, billed_kg) are important to determine delivery pricing details

                         
                      }

                //    ,"cellCreated":function(td,data,colIndex) {
                //        alert('test');
                //      if(colIndex==9){
                //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                //         $(td).html(html); 
                //      }
                //   }      								
            });
            
            // let div = $('#_dl_d_filter_panel');  
            // $('#_dl_tblPackages_wrapper>div.dt-buttons').prepend(div);
                 				  
        }); //close post_ajax()
                 
    };

    //## begin::expanded_detail class Package's expanded detail class view 
    this.expanded_detail = new function(){
       this.is_editing = false;
       let mThis = this;
       this.base_url = $('#__base_url').val();
      
        //begin::expanded_detail.init()
        this.init =()=>{
           let input_selector = 'tbody>tr.package_detail>td.pd-container div.pd-container '; 
           PackageListComponent.tblPackages.on('change',[input_selector,'input.size'].join(''),function(e){
                let tr = $(this).closest('tr'); //tr.package_detail
                mThis.setBilledKg_package_detail(tr);
           });

           PackageListComponent.tblPackages.on('change',[input_selector,'input.actual_kg'].join(''),function(e){
                let tr = $(this).closest('tr'); //tr.package_detail
                mThis.setBilledKg_package_detail(tr);
           });

           PackageListComponent.tblPackages.on('change',[input_selector,'input.billed_kg'].join(''),function(e){
                let tr = $(this).closest('tr'); //tr.package_detail
                //origin is source of change in value
                let origin ='billed_kg';
                //mThis.calculateTotals(tr,origin);
                mThis.getDeliveryPriceInfo(tr,origin);
           });

           PackageListComponent.tblPackages.on('change',[input_selector,'select.cod'].join(''),function(e){
              let tr = $(this).closest('tr'); //tr.package_detail
              mThis.getDeliveryPriceInfo(tr,'cod');
          });
          PackageListComponent.tblPackages.on('change',[input_selector,'select.zone_code'].join(''),function(e){
            let tr = $(this).closest('tr'); //tr.package_detail
            mThis.getDeliveryPriceInfo(tr,'zone_code');
          });
          PackageListComponent.tblPackages.on('change',[input_selector,'select.delivery_type'].join(''),function(e){
            let tr = $(this).closest('tr'); //tr.package_detail
            mThis.getDeliveryPriceInfo(tr,'delivery_type');
          });

          PackageListComponent.tblPackages.on('change',[input_selector,'select.df_payer'].join(''),function(e){
             let tr = $(this).closest('tr'); //tr.package_detail
             mThis.getDeliveryPriceInfo(tr,'df_payer');
          });

          PackageListComponent.tblPackages.on('change',[input_selector,'input.price'].join(''),function(e){
             let tr = $(this).closest('tr'); //tr.package_detail
             mThis.getDeliveryPriceInfo(tr,'price');
          });

        //   PackageListComponent.tblPackages.on('keyup',[input_selector,'input.base_fee'].join(''),function(e){
        //     let tr = $(this).closest('tr'); //tr.package_detail
        //     mThis.getDeliveryPriceInfo(tr,'base_fee');
        //  });

        //  PackageListComponent.tblPackages.on('keyup',[input_selector,'input.delivery_fee'].join(''),function(e){
        //     let tr = $(this).closest('tr'); //tr.package_detail
        //     let origin ='delivery_fee'; //origin of change in other values. Example, change in @delivery_fee causes cahnges in driver $total or sender $total 
        //     mThis.getDeliveryPriceInfo(tr,'delivery_fee');
        //  });

         PackageListComponent.tblPackages.on('keyup', [input_selector,'input.forwarding_cost'].join(''),function(e){
            let tr = $(this).closest('tr'); //tr.package_detail
            mThis.getDeliveryPriceInfo(tr,'forwarding_cost');
         });

          //todo: taxi fee, base_fee changes => ???
        }
        //end::expanded_detail.int();
        
        //set value to editor input such as textbox, selectBox, select2 box on pacakge detail panel
        this.setValue=(tr,col_name,value)=>{
            tr.find(['td.pd-container .',col_name].join('')).val(value);
        }
        //get value back from editor input such as textbox, selectBox, select2 box on package Detail panel div.pd-container inside td.pd-container
        /** NOTE about getValue() method. This method returns value from Editor, but if editor is not yet initiated, it find value from <span> span[data-field="col_name"] instead **/
        this.getValue=(tr,col_name,is_numeric=true)=>{
            let div = tr.find('td.pd-container');
            let val = div.find('.' + col_name).val();
            //let val = tr.find(['td.pd-container .',col_name].join('')).val();
            if(!val) {
                div = div.find(['div[data-field="',col_name,'"]'].join('')); 
                val = div.find(['span[data-field="',col_name,'"]'].join('')).data('value');
            }
            if(is_numeric==true) return parseFloat(val);
            else return val;
        }

        this.setBilledKg_package_detail = (tr)=>{
            let actual_kg =mThis.getValue(tr,'actual_kg',true); 
            let str_size = mThis.getValue(tr,'size',false);
            let size = mThis.processPackageSize(str_size);
            let b = (size.width * size.length * size.height)/6015;
            let billed_kg = 0 ;
            if (actual_kg >= b) billed_kg = actual_kg; else billed_kg = b;
            mThis.setValue(tr,'billed_kg',Number(billed_kg).toFixed(2));
            mThis.getDeliveryPriceInfo(tr,'billed_kg');
        }

        //Set package's price details (COD Fee, base_fee, delivery_fee)
        /** If you want to change package's detail price calcualtion => update these related methods:
           - PacakgeModel->getDeliveryPriceInfo()
           - PackageModel->ReceivePackages()
           - PackageModel->PickOrderPackage()
           - PackageModel->Receivepackage_fast_delivery() 
         **/
        this.getDeliveryPriceInfo = (tr,change_agent)=>{
            change_agent= (change_agent+'').toLowerCase();
            //cod, price, billed_kg, taxi_fee
            let cols = ['delivery_type','zone_code','cod', 'price', 'billed_kg', 'forwarding_cost','df_payer'];
            if (cols.indexOf(change_agent) !=-1) {
                let billed_kg = mThis.getValue(tr,'billed_kg'); //tr.find('td.pd-container input.billed_kg').val();
                if(!$.isNumeric(billed_kg)) billed_kg =0;
                let prev_tr = tr.prev();
                if (prev_tr.hasClass('package_header')){
                    let sender_id = prev_tr.data('senderid');
                    let delivery_type = prev_tr.data('dtype');
                    let zone_code =mThis.getValue(tr,'zone_code',false); // OR get zone_code from header_tr => "let zone_code =  prev_tr.data('zonecode');
                    //Do not proceed if the paramer @p is not succifient
                    
                    /** this line is to resolve problem: On first click to Modify Package on Package trail, the zone_code is not retrieved from Select2() box **/
                    if(!zone_code)  zone_code = prev_tr.data('zonecode'); // get zone_code from header row instead
                    let p = {'sender_id':sender_id,'delivery_type':delivery_type,'zone_code':zone_code,'billed_kg':billed_kg};  
                    post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
                       if(d){
                        d = StringSanitizer.sanitizeObject(d);
                        mThis.setValue(tr,'base_fee',d.base_fee);
                        mThis.setValue(tr,'delivery_fee',d.delivery_fee);
                        let driver_total =0;
                        let sender_total =0;
                        let price = mThis.getValue(tr,'price',true);
                        let cod =  mThis.getValue(tr,'cod');
                        let forwarding_cost =  mThis.getValue(tr,'forwarding_cost',true);
                        let cod_fee = 0, cod_amount = 0;
                        if (cod==1 || cod =='yes') {
                            //alert(price + '|' + d.base_fee  + '| ' + d.delivery_fee + ' | ' + d.cod_fee_percent);
                            cod_fee = (price + parseFloat(d.base_fee) + parseFloat(d.delivery_fee)) * parseFloat(d.cod_fee_percent)/100;
                            cod_amount = price;
                        }
                        
                        driver_total = parseFloat(cod_amount);
                        sender_total = cod_fee + forwarding_cost; //Seller or sender always has to pay for taxi or forwarding cost

                        mThis.setValue(tr,'cod_fee',cod_fee);
                        let df_payer =  mThis.getValue(tr,'df_payer',false);
                        if((df_payer+'').toLowerCase() =='sender')
                            sender_total += parseFloat(d.base_fee) + parseFloat(d.delivery_fee);
                        else
                            driver_total += parseFloat(d.base_fee) + parseFloat(d.delivery_fee); // + forwarding_cost (if receiver has to pay for taxi fee) 
                        //begin:: update values on header fields
                          let receiver_phone =mThis.getValue(tr,'receiver_phone',false);
                          let receiver_address =mThis.getValue(tr,'receiver_address',false);
                          //let zone_name ???
                          let u_data = {'sender_total':sender_total,'driver_total':driver_total,'receiver_address':receiver_address,'receiver_phone':receiver_phone,'zone_code':zone_code,'zone_name':'???'};    
                          mThis.setTotals(tr,u_data);
                        //end::update values on header fields
                        if(d.status =='Error')
                           cv_interact.alert(d.error_message,'','error'); 
                       }
                    });
                }
              
            } else {
                return;
            } 
        }

       //calculateTotals() on package's "expanded_detail" 
       //paramter @orinin is in fact the source of change in value that can causes changes in other values. It is same as field name. 
       //parameter @origin is to avoid cicular event firing causing infinite firing or loops. 
       //parameter @orgin is IMPORTANT for 3 input fields : base_fee, delivery_fee, billed_kg, where these fields are resulted from changes in other vars, but user can also change these value directly
    //    this.calculateTotals = (tr,origin=null)=>{
    //        if (!tr) return;
    //        let pd_container = tr.find('div.pd-container');
    //        let priceInfo = mThis.senderPriceInfo?mThis.senderPriceInfo:{}; 
    //        if(!priceInfo) priceInfo = {'sender_id':null,'price_per_kg':0.15,'base_fee':0,'cod_fee_percent':0.05};
    //        //let size_str = pd_container.find('input.size').val();
    //        let actual_kg = parseFloat(pd_container.find('input.actual_kg').val());
    //        if(!$.isNumeric(actual_kg)) actual_kg=0;

    //         //    let size = mThis.processPackageSize(size_str,true);
    //         //    let billed_kg =0;

    //         //    let cod =  pd_container.find('select.cod').val();
    //         //    if(!$.isNumeric(cod)) cod =0;

    //         //    mThis.setTotals(tr,priceInfo);  
    //    } 
 
       //keywords: updateDriverTotal(), updateTotals, refreshTotals(), 
       //Set total columns. "Total Driver", "Total Sender", "Income", "cost","profit"
       //paramter @tr here is the <tr.package_detail>, which is the detail expanded row, not header row 
       // @data={'driver_total':0,'sender_total':0} // "sender_total" is amount to be paid by sender, not amount to pay to sender such as COD amount
       this.setTotals = (tr, data)=>{
          if(!tr) return null; 
          let pid = tr.data('pid'); 
          let header_tr = tr.prev(); //header row <tr.package_header> that contains "total" element to be displayed

          if(header_tr.hasClass('package_header')){
              //Check to make sure the package_id in detailed row match with the packag_id in header row
              if(header_tr.data('pid') == pid){
                 let td = header_tr.find('td.total'); //tr.package_header>td.totals> contains div and span displaying driver-total, and sender-total 
                 let span_total_driver = td.find('span.driver-total');
                 let span_total_sender = td.find('span.sender-total');
                 data.driver_total = $.isNumeric(data.driver_total)? data.driver_total:0; 
                 data.sender_total = $.isNumeric(data.sender_total)?data.sender_total:0;
                 span_total_driver.html(Number(data.driver_total).toFixed(2));
                 span_total_sender.html(Number(data.sender_total).toFixed(2));

                //  //by the way, setTotal() method will also update Receiver's phone and Zone code on header row
                //  let fields = ['receiver_phone','zone_code','zone_name'];
                //  for(let i=0;i<3;i++){
                //     let field_name = fields[i]; 
                //     let span = header_tr.find(['span.pg-text.pg-',field_name].join(''));
                //     span.text(data[field_name]);
                //  }
              }
          }

       }

       //refresh display of package all data including package's ehader info and expanded dropdown details
        //parameter @tr is html row object (jquery object) that represents the package header row <tr.pg-header> 
        this.refreshPackageData = (tr,pid,force_expand =true)=> {
            if(!tr) return;
        let p = {'package_id':pid};
        //css class "pg-text" refers to every <td> or <span> or <div> that contains data value or text such as sender_name, sender_type, sender_phone, etc... on <"tr.pg-header"> row
        //css class ="vc-value" refers to very <span> in "tr.pg-detail" row that contains data for each field of the package's expaned details
        post_ajax([mThis.base_url,'/api/getPackageInfo'].join(''),p,function(d){
            if(typeof d =='string') alert(d);

            if(d){
                tr.find('td.pg-text').each(function(e){
                    let x = $(this);
                    let data_member = x.data('field');
                    let itemName =null;
                    if(data_member =='email') itemName = 'email'; //anitize email differently by allowing '@' charater
                    x.html(StringSanitizer.sanitizeOut(d[data_member],itemName));
                }); 
                //refresh display of package's dropdown expanded details
                let expanded_detail_row = tr.next();
                if (!expanded_detail_row.hasClass('package_detail'))  expanded_detail_row = mThis.createPackageExpandedDetailRow(tr,pid);
                tr.addClass('pg-selected');
                mThis.setPackageDetailValues(expanded_detail_row,d);
                expanded_detail_row.show(); 
                //mThis.displayPackageExpandedDetails(tr,d,force_expand);  
            }       
        }); 
        } 

    //displayPackageDetails() display package's extended details (expanded dropdown details), but not display header info
    //paramter @tr is <tr.pg-header> package ehader trow
    this.displayPackageExpandedDetails = (tr,pid=0,force_expand =false)=>{
        if(!tr) return;
        if (mThis.editing_detail_row){
            mThis.cancelEdit(mThis.editing_detail_row);
        }
        // if (mThis.editing_detail_row){
        //     cv_interact.confirm('You are editing a package information. Do you want to save changes to the package?','Modify Package Information',function(e){
        //         if(e) mThis.saveChanges(mThis.editing_detail_row); else mThis.cancelEdit(mThis.editing_detail_row);
        //     });
        // }
        let p = {'package_id':pid};
        //let d_html = null;
        //let detail_class = ["pd_",pid].join('');
        let detail_tr =null;
        if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('pg-selected');
        tr.removeClass('pg-selected');
 
        //begin:: if details already displayed, then do not load data again
         let next_tr = tr.next();
         if (!next_tr) 
           detail_tr = null;
         else{
             if (next_tr.hasClass('package_detail')){
                 let is_visible = next_tr.is(':visible');
                 if(is_visible) 
                   {
                         if (force_expand == true) {
                             tr.addClass('pg-selected');
                             if (mThis.prev_package_detail_tr) mThis.prev_package_detail_tr.hide();
                             next_tr.show(); 
                             mThis.prev_selected_tr = tr;
                             //next_tr.css('display','inline-block'); 
                             mThis.prev_package_detail_tr = next_tr;
                         } 
                         else {
                             next_tr.hide(); 
                             tr.removeClass('pg-selected');
                             return;
                         }
                   }
                 else  
                 {
                     if (mThis.prev_package_detail_tr) mThis.prev_package_detail_tr.hide();
                      next_tr.show();
                      tr.addClass('pg-selected');
                      //next_tr.css('display','inline-block'); 
                      mThis.prev_package_detail_tr = next_tr; 
                      mThis.prev_selected_tr = tr;
                      return;
                 }
                  
             } else detail_tr = null;
         }  
        
        //end::if details already displayed, then do not load data again
 
     //    //detail_tr = mThis.tblPackages.find(['tbody>tr.',detail_class].join(''));
     //    if (force_expand ==true) {
     //         if(detail_tr.length >0) {
     //             detail_tr.css('display','block');
     //             mThis.prev_package_detail_tr = detail_tr; 
     //             return;
     //         } 
     //    }
       
        if(!detail_tr || detail_tr.length <=0){
                 post_ajax([mThis.base_url,'/api/getPackageDetails'].join(''),p,function(d) {
                     //if (typeof d =='string') alert(d); //in case of unexpected error
                     if (mThis.prev_selected_tr) mThis.prev_selected_tr.removeClass('pg-selected');
                     PackageListComponent.tblPackages.find('tbody>tr.package_detail').hide(); 
                     if(d){
                         d = StringSanitizer.sanitizeObject(d);
                         //createPackageExpandedDetailRow() is to create expended detail row "<tr.package_detail pd_#>" that contains package's expaneded details 
                         mThis.prev_package_detail_tr  = mThis.createPackageExpandedDetailRow(tr,pid);
                         tr.addClass('pg-selected');
                         mThis.prev_selected_tr = tr;
                         mThis.setPackageDetailValues(mThis.prev_package_detail_tr,d); 
                     }
                 });  
        }else{
            tr.removeClass('pg-selected');
            detail_tr.hide(); 
        }
       
     } 
 
     //createPackageExpandedDetailRow is to create html row that contains expanded package's dteails (or dropdown details)
     //@tr is <tr.pg-header> package header row
     this.createPackageExpandedDetailRow = (tr,pid)=>{
         let detail_class = ["pd_",pid].join('');
         //NOTE: tr data-pid ="" is very IMPORTANT for editing expanded package detail in dropdown view
         let d_html =['<tr data-pid="',pid,'" class="package_detail ',detail_class,'"><td class="col_action" style="vertical-align:top">',
             '<a href="#" class="pg-detail_edit_button" style="display:block;padding:5px"><span style="color:blue;font-weight:bold">Modify</span></a>',
             '<a href="#" class="pg-detail_save_button" style="display:none;padding:5px"><span style="color:green;font-weight:bold">Save</span></a>',
             '<a href="#" class="pg-detail_cancel_edit_button" style="display:none;padding:5px"><span style="color:orange;font-weight:bold">Cancel</span></a>',
         '</td><td class="pd-container" colspan="6">', //css class "pd-container" is very important for element access on user's actions
         '<div style="width:100%;">',
            //'<div style="border-bottom:1.5px solid red;width:50%"></div>', 
            '<div class="row pd-container">',
               '<div class="col-lg-3">',
                    '<div class="vc-control" data-field="receiver_address">',
                            '<span class="vc-label">Receiver Address</span>',
                            '<span class="vc-value" data-value="" data-field="receiver_address"></span>',
                    '</div>',
                    '<div class="vc-control" data-field="cod">',
                        '<span class="vc-label">COD</span>',
                        '<span class="vc-value" data-field="cod">Yes</span>',
                    '</div>',
                    '<div class="vc-control" data-field="price">',
                        '<span class="vc-label">Price</span>',
                        '<span class="vc-value" data-field="price" data-type="number">$25</span>',
                    '</div>',
                    '<div class="vc-control" data-field="base_fee">',
                        '<span class="vc-label">Base Fee</span>',
                        '<span class="vc-value" data-field="base_fee" data-type="number">$1</span>',
                    '</div>',
               '</div>',
 
               '<div class="col-lg-3">',
                    '<div class="vc-control" data-field="zone_code">',
                            '<span class="vc-label">Zone</span>',
                            '<span class="vc-value" data-field="zone_code"></span>',
                    '</div>',
                     '<div class="vc-control" data-field="delivery_fee">',
                         '<span class="vc-label">Delivery Fee</span>',
                         '<span class="vc-value" data-field="delivery_fee" data-type="number">0.15</span>',
                     '</div>',
                     '<div class="vc-control" data-field="df_payer">',
                         '<span class="vc-label">DFP</span>',
                         '<span class="vc-value" data-field="df_payer">Sender</span>',
                      '</div>',
                      '<div class="vc-control" data-field="cod_fee">',
                         '<span class="vc-label">COD Fee</span>',
                         '<span class="vc-value" data-field="cod_fee" data-type="number" data-readonly="1">$0.05</span>',
                       '</div>',
               '</div>',
               '<div class="col-lg-3">',
                    '<div class="vc-control" data-field="receiver_phone">',
                        '<span class="vc-label">Receiver Phone</span>',
                        '<span class="vc-value" data-type="number" data-field="receiver_phone"></span>',
                    '</div>',
                     '<div class="vc-control" data-field="size">',
                         '<span class="vc-label">Size <span class="text-muted"> (width length height)</span></span>',
                         '<span class="vc-value" data-field="size">2 x 32 x 21</span>',
                     '</div>',
                     '<div class="vc-control" data-field="actual_kg">',
                         '<span class="vc-label">Actual KG</span>',
                         '<span class="vc-value" data-field="actual_kg" data-type="number">0</span>',
                         '</div>',
                     '<div class="vc-control" data-field="billed_kg">',
                         '<span class="vc-label">Billed KG</span>',
                         '<span class="vc-value" data-field="billed_kg" data-type="number">0</span>',
                     '</div>',
              '</div>',
               '<div class="col-lg-3">',
                    '<div class="vc-control" data-field="delivery_type">',
                            '<span class="vc-label">Delivery Type</span>',
                            '<span class="vc-value" data-field="delivery_type">Normal</span>',
                    '</div>',
                     '<div class="vc-control" data-field="forwarding_cost">',
                         '<span class="vc-label">Taxi Fee</span>',
                         '<span class="vc-value" data-field="forwarding_cost" data-type="number">$2</span>',
                     '</div>',
                      '<div class="vc-control" data-field="delivery_notes">',
                         '<span class="vc-label">Delivery Instruction</span>',
                         '<span class="vc-value" data-field="delivery_notes"></span>',
                      '</div>',
                     '<div class="vc-control" data-field="driver_name">',
                         '<span class="vc-label">Driver</span>',
                         '<span class="vc-value pg-driver" data-value="0" data-field="driver_name" data-readonly="1"></span>', // "data-did" is delivery_id and acts as fleet identifier number
                     '</div>',
               '</div>',
             '</div>',

         '</div>',
         '</td></tr>'].join('');
         tr.after(d_html);
         return  PackageListComponent.tblPackages.find(['tbody>tr.',detail_class].join(''));
        
     }
 
     //display package header data field/ display packageHeaderData(), refreshHeaderData, updateHeaderData
     this.displayHeaderData = (tr,fields=[],d,tr_is_header_row = false)=>{
         if(!tr) return; 
         let header_tr ;
         if (!tr_is_header_row) header_tr = tr.prev(); else header_tr = tr;
         if(header_tr.data('pid') != d.package_id) {
             console.log('issue #007: PackageListComponent.js/this.displayHeaderData => server method getPackageDetails() return data object without prop "package_id"');
             return;
         }
         let cnt = fields.length;
         for(let i=0;i<cnt;i++){
             let f_name = fields[i];
             let span = header_tr.find(['span.pg-text.pg-',f_name].join(''));
             span.text(d[f_name]);
         }  
     }

     //setPackageDetailValues() is to use the given JSON data about the package and display them on package's expended detail
     this.setPackageDetailValues = (tr,d,missing_value ='NA')=>{
         if(!tr) return;
         let x = tr.find('div.pd-container');
         if(d)
         if(d.cod ==1) d.cod_text ='Yes'; else d.cod_text ='No'; 
         x.find('div.vc-control').each(function(){
             let k = $(this); //div.vc-control
             let dataMember = k.data('field');
             let el = k.find('.vc-value'); //span
             k.find('.vc-value-edit').hide(); // only in case that the expanded detail has been edited before this moment
            
             let value = d[dataMember]?d[dataMember]:missing_value;;
             if(dataMember =='cod') { 
                d.cod_text = (d.cod==1)?'Yes':'No';
                if (!d.cod_text) d.cod_text ='NA';
                el.html(d.cod_text); //display Yes or No instead of 0 or 1 in <span>
             } else  if(dataMember =='size') {
                el.html([Number(d.dim_x),' ',Number(d.dim_y),' ',Number(d.dim_h)].join('')); //dim_x, dim_y, dim)h in cm
             }
             else if (dataMember =='zone_code') {
                 let select2 =  x.find('.select2-container');
                 select2.hide();
                 el.html(d.zone_name); //view Zone Name like Combo Box, but "zone_code" is important value
             }
            //  else if (dataMember =='receiver_address') {
            //       el.html(d[dataMember]); 
            //  }
             else{ 
                el.html(value?value:'NA');
             }
             el.data('value',value); //store data-value ="some value" // used only for COD combo Item, where value 0= No, 1 = Yes
             el.show();
            
         });
         //display header details for some fields such as *delivery_type, *zone_code, *zone_name, *recever_phone, 
         mThis.displayHeaderData(tr,['delivery_type','receiver_phone','receiver_address','zone_code','zone_name','driver_total','sender_total'],d,false);
     }

       //@tr is expanded detail row <tr.pg_detail>
       this.beginEdit = (tr)=>{
           tr.find('.vc-control').each(function(e){
               let x = $(this);
               let span = x.find('.vc-value');
               let input = x.find('.vc-value-edit');
               let data_member = span.data('field');
               let readonly = span.data('readonly');
               let att_readOnly =null;
               if (readonly ==1 || readonly==true) att_readOnly =" readOnly"; //applied readonly to textboxes, no select box used for Readonly fields

            // if(!readonly || readonly ==0) {
                span.hide();
                if (data_member=='cod') 
                { 
                            let cod = span.data('value');
                            if(!$.isNumeric(cod)) cod =0;
                            if(!cod) cod =0;
                            if (input.is('select')) 
                             {
                                input.val(cod);
                                input.show();
                                input.trigger('change');
                             }
                            else   
                            {
                                let el = x.append($(['<select class="vc-value-edit form-control ',data_member,'">',
                                '<option value="0">No</option>',
                                '<option value="1">Yes</option>',
                                ,'</select>'].join('')));
                                el = el.find('select');
                                el.val(cod);
                                el.trigger('change');

                            }
                 }else if (data_member =='delivery_type'){
                            let dtype = span.data('value');
                            if(!dtype) dtype ='normal';
                            if (input.is('select')) 
                            {
                                input.val(dtype);
                                input.show();
                                input.trigger('change');
                            }
                            else   
                            {
                                let el = x.append($(['<select class="vc-value-edit form-control ',data_member,'">',
                                '<option value="Normal">Normal</option>',
                                '<option value="Fast">Fast</option>',
                                ,'</select>'].join('')));
                                el = el.find('select');
                                el.val(dtype);
                                el.trigger('change');
                            }

                 }
                 else if(data_member =='df_payer') {
                    let df_payer = span.data('value');
                    if(!df_payer) df_payer ='Sender';
                    if (input.is('select')) 
                     {
                        input.val(df_payer);
                        input.show();
                        input.trigger('change');
                     }
                    else   
                    {
                        let els = x.append($(['<select class="vc-value-edit form-control ',data_member,'">',
                        '<option value="Sender">Sender</option>',
                        '<option value="Receiver">Receiver</option>',
                        ,'</select>'].join('')));
                        let el = els.find('select');
                        el.val(df_payer).trigger('change'); 
                    }
                 }
                else if (data_member=='zone_code') {
                        let zone_code = span.data('value');
                        //let select2 = x.find('.select2-container'); //x is "<div.vc-control" with data-field="zone_code"
                        let el = x.find('select.'+ data_member); // el is a normal "Select box"
                        if (el.length ===0) {
                            let els = x.append($(['<select class="vc-value-edit ',data_member,'">',
                            ,'</select>'].join('')));
                            el = els.find('select.'+ data_member); // el is a normal "Select box"    
                        }               
                       //In case select2 for zone_code is not found then convert Simple Select box to Select2() 
                       if (el.length > 0) {
                            if(!mThis.zones) if (FilterDialog_package.form_data) mThis.zones = FilterDialog_package.form_data.zones;
                            if(!mThis.zones) mThis.zones =[];
                            mThis.zones[0] = {'zone_code':null,'zone_name':'(Choose zone)'};
                            CommonLib.setComboItems(el, mThis.zones,'zone_code','zone_name',false,null,zone_code);
                            el.select2({width:'100%'});
                       }     
                 }
                // else if (data_member=='receiver_address') {
                //     let value = span.text();
                //     //let element = tr.find('div.pg-receiver_address_container');
                //     AddressWidget.editAddress(span,value);   
                //  }
                else {
                        let data_type = span.data('type');
                        let value = span.text();
                        if (value =='NA' || value =='អត់មាន' || value =='គ្មាន') value = null;
                        if(data_type !=='number') data_type =='text';
                        if (input.is('input')) 
                         {
                            input.val(value);
                            input.show();
                         }
                        else
                           x.append($(['<input type="',data_type,'" class="vc-value-edit form-control ',data_member,'" value="',value,'" ',att_readOnly,'>'].join(''))).val(value); 
                }
            //} close:: if readonlt ==true
           });

            mThis.is_edition = true;
            mThis.editing_detail_row = tr;
       }  
        
       //Change from Edit Mode to View mode. 
       //if paremeter @data is specified => user has made changes to package details and therefore => display new details 
       //parameter @tr is expanded detail row <tr.pg_detail>
       this.cancelEdit = (tr)=>{
          let pid = tr.data('pid');
          let p = {'package_id':pid};
          //alway refresh package's expaneded detail from server's database
          post_ajax([mThis.base_url,'/api/getPackageDetails'].join(''),p,function(d){
              if(typeof d =='string') alert(d);
              if(d){
                  mThis.setPackageDetailValues(tr,d); 
                  mThis.is_edition = false;
                  mThis.editing_detail_row = null;
              }
              mThis.editing_detail_row = null;
              let td = tr.find('td.col_action');
              td.find('a.pg-detail_cancel_edit_button').hide();
              td.find('a.pg-detail_save_button').hide();
              td.find('a.pg-detail_edit_button').show();
          });    
                    
       }

       this.getData =(tr)=>{
          if(!tr) return null;
          let p = {};
          p.package_id = tr.data('pid'); //pacakge_id;
          
          tr.find('div.vc-control').each(function(){
              let x = $(this);
              let span = x.find('.vc-value');
              let input = x.find('.vc-value-edit');
              let data_member = span.data('field');
              p[data_member] = input.val();
          });
         
          if (!p.package_id) {
                cv_interact.alert('Package identity is not valid');
                return null;
         }

          if (p.cod ==1) {
             if (p.price <=0 || !$.isNumeric(p.price)) {
                 cv_interact.alert('When COD is Yes then Price is required','','warning');
                 return null;
             }
          }

          if ((p.df_payer+'').toLowerCase() !='sender' && (p.df_payer+'').toLowerCase() != 'receiver') {
            cv_interact.alert('DFP stands for Delivery Fee Payer. This must be Sender or Receiver','','warning');
            return null;
          }
           let size = mThis.processPackageSize(p.size);
           if (!size) {
            cv_interact.alert('<span class="error_text">Package size is not correct format</span><br><span style="color:green;font-weight:bold">Package Size is formated as Width Length Height. Example 20.2 11 15. all number in centimeter (cm)</span>','','warning');
            return null;
          } else {
              p.dim_x = size.width;
              p.dim_y = size.length;
              p.dim_h = size.height;
          }
          return p;
       }

        //size = width * length * height.  Return null in case of error or invalid size data. If @size_str i empty returns size(0,0,0)
        //processPackageSize() returns size object = {'length','width','height'}. parem @size_str = 20 10 5 (in cm)
        this.processPackageSize = (size_str)=>{
            if(!size_str || (size_str+'').trim() =='') return {'length':0,'width':0,'height':0};
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

       this.saveChanges = (tr,onDone)=>{
           if(!tr) return;
          let p = mThis.getData(tr);//here
          if (!p) return;
           let pid = tr.data('pid');
           let driver_total =0,sender_total=0;
           //(sender_id, delivery_type,zone_code,billed_kg) are important to determine pricing details
           let sender_id, delivery_type, zone_code; 

          //begin:: get driver_total and sender_total values
                let header_tr = tr.prev();
                if(header_tr.hasClass('package_header')) {
                    if(header_tr.data('pid') == pid ) {
                        let td = header_tr.find('td.total');
                        driver_total = td.find('span.driver-total').text();
                        sender_total = td.find('span.sender-total').text();
                        sender_id = header_tr.data('senderid'); //(sender_id, delivery_type,zone_code,billed_kg) are important to determine pricing details
                        //delivery_type = header_tr.data('dtype'); // Do not use this @delivery_type from header row
                        zone_code = header_tr.data('zonecode'); // get zone_code from header_tr
                    }
                }
          //end:: get driver_toal and sender_total
          p.sender_id = sender_id;
          //p.delivery_type = delivery_type;
          //p.zone_code =  //zone_code;

          p.driver_total = parseFloat(driver_total);
          p.sender_total = parseFloat(sender_total);
          //imporant params are "sender_d,df_payer, delivery_type,zone_code,billed_kg" in order to determine the price
          post_ajax([mThis.base_url,'/api/updatePackageExpandedDetails'].join(''),p,function(data){
              if(data) {
                if(data.status =='OK'){
                    let d =StringSanitizer.sanitizeObject(data.details);
                    mThis.setPackageDetailValues(tr,d);
                    if(typeof onDone =='function') onDone(true); 
                 }else cv_interact.alert(data.error_message,'','error');
              }
          });
          //mThis.cancelEdit(tr);
       }
    }
    //##end::expanded_detail class
}
//## end::PackageListComponent
 
//Modify Receiver Information for a specific package. Admin user can do this for Driver in some situations
//begin::ReceiverDialog (Modify receiver's info such as ddress, phone, zone, etc)
 var ReceiverDialog = new function(){
     let mThis = this;
     this.self = $('#dg_dlgReceiver');
     this.base_url = $('#__base_url').val();
     this.elTitle = $('#dg_dlgReceiverTitle');
     this.elError = $('#_dl_rd_error');

     this.elSenderName = $('#_dl_rd_sender_name');
     this.elZone = $('#_dl_rd_zone_code');
     this.elZoneName = $('#_dl_rd_zone_name');
     this.elBaseFee = $('#_dl_rd_base_fee');
     this.elDeliveryFee = $('#_dl_rd_delivery_fee');
     this.elDeliveryType = $('#_dl_rd_delivery_type'); 
     this.btnOK = $('#dg_dlgReceiver_btnOK');
      
     mThis.btnOK.on('click',function(e){
        let p = mThis.getData();
       post_ajax([mThis.base_url,'/api/updatePackageReceiverInfo'].join(''),p,function(err){
          if(!err || err ==null) {
             mThis.self.modal('hide');
             if(typeof mThis.onClose =='function') mThis.onClose(true);
          }else cv_interact.alert(err,'','error');
       });
     });

    this.elZone.on('blur',function(e){
         let el = $(this);
         let delivery_type = mThis.delviery_type?mThis.delviery_type:null; 
         let sender_id = mThis.sender_id?mThis.sender_id:0;
         let billed_kg = mThis.billed_kg?mThis.billed_kg:0;

         //Changing zone is to change delivery_fee, which depends on Delivery_type. => @deliver_type is used to get default_price (delivery_fee)
            let p = {'zone_code':el.val(),'delivery_type':delivery_type,'sender_id':sender_id,'billed_kg':billed_kg}; 
            post_ajax([mThis.base_url,'/api/getZonePrices'].join(''),p,function(d){
             if (d.error_message) {
                 d = StringSanitizer.sanitizeObject(d);
                 //mThis.elError.text(d.error_message + '. Check price list for sender named ' + mThis.elSenderName.val());
                 mThis.elError.text(d.error_message);
                 mThis.elZoneName.val(d.zone_name);
             }   
            if(d) {
                    d= StringSanitizer.sanitizeObject(d);
                    mThis.elZoneName.val(d.zone_name);
                    //d.sender_base_price is more special and higher priority because it has validity period and it is set within Promotion period.
                    //d.base_price is base_price retrieved from table "sender_price_list" or table "price_list", no validity period, but there is range of kgs (@start_kg and @end_kg) 
                    if(d.sender_base_price > d.base_price) d.base_price = d.sender_base_price;
                    mThis.elBaseFee.val(d.base_price);
                    mThis.elDeliveryFee.val(d.delivery_fee);
                }  
            });
    }); 

     this.getData = ()=>{
         let p = {};
         p.package_id = mThis.package_id;
         mThis.self.find('.data-input').each(function(){
             let data_member = $(this).data('field');
             p[data_member] = $(this).val();
         });
         return p;
     }

     this.show = (option ={}, onClose)=>{
        mThis.onClose = onClose;
        mThis.elError.html(null);

        mThis.package_id = option.package_id;
        if(!mThis.package_id)  {
            cv_interact.alert('package identity is not valid');
            return;
        }
        mThis.elTitle.html('Package Receiver Info');
        
        mThis.prepareData(mThis.package_id,()=>{
            mThis.self.modal({
                backdrop:'static'
            });
        });
      
     }

     this.prepareData = (pid,onFinish)=>{
          let p = {'package_id':pid};

          mThis.setData(null); //clear form data first
          post_ajax([mThis.base_url,'/api/getPackageReceiverInfo'].join(''),p,function(d){
              if(d){
                  d = StringSanitizer.sanitizeObject(d);
                  mThis.sender_id = d.sender_id;
                  mThis.delivery_type = d.delivery_type;
                  mThis.billed_kg = d.billed_kg;
                  mThis.setData(d);
                  onFinish();
              }
          });
     }

     this.setData = (d)=>{
         if(!d){
            mThis.self.find('.data-input').each(function(){
                $(this).val(null);
            }); 
            return;
         }

        mThis.package_id = d.id;
        //mThis.sender_id = d.sender_id;
        //mThis.delivery_type = d.delivery_type;
        //mThis.billed_kg = d.billed_kg;
        if(!d.delivery_time) d.delivery_time='Pending';
        mThis.self.find('.data-input').each(function(){
            let data_member = $(this).data('field');
            $(this).val(d[data_member]);
        }); 
     }
 }
//end::ReceiverDialog
 
//### begin::FilterDialog_package
var FilterDialog_package = new function(){
    let mThis = this;
    this.self = $('#_dl_dlgFilter');
    this.elFilter_warehouse = $('#_dl_filter_warehouse'); //Receiving warehouse
    this.elTitle = $('#_dl_dlgFilterTitle');
    this.elFilter_date = $('#_dl_filter_date');
    this.elFilter_sender = $('#_dl_filter_sender');
    this.elFilter_driver= $('#_dl_filter_driver');
    this.elFilter_zone = $('#_dl_filter_zone');
    this.elFilter_delivery_type = $('#_dl_filter_dtype');
    this.elFilter_status = $('#_dl_filter_status');
    
    this.form_data =null ; //stores all filter options
    this.remembered_filter;
    this.btnOK = $('#_dl_dlgFilter_btnOK');

    this.self.find('.dl_filter_field').on('change',(e)=>{
        mThis.remembered_filter = mThis.getData();
    });

    this.btnOK.on('click',(e)=>{
       mThis.self.modal('hide');
       let p = mThis.getData();
       if(typeof mThis.onClose =='function') mThis.onClose(p);
    });
  
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
       //p.search_value = PackageListComponent.elSearchPackage.val();
       p.date = mThis.elFilter_date.val();
       p.boooking_date = mThis.elFilter_date.val();
       p.driver_id = mThis.elFilter_driver.val();
       p.zone_code =mThis.elFilter_zone.val();
       p.sender_id =mThis.elFilter_sender.val();
       p.delivery_type = mThis.elFilter_delivery_type.val();
       if( p.delivery_type==0)  p.delivery_type=null;
       p.status_id = mThis.elFilter_status.val();
       return p;
   } 

    this.loadFilterData = (onFinish)=>{
                let def =  mThis.remembered_filter? mThis.remembered_filter:{};
                if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;

            if (mThis.form_data) {
                CommonLib.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                CommonLib.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id);
                CommonLib.setComboItems(mThis.elFilter_driver,mThis.form_data.drivers,'id','driver_name',false,'(All Drivers)',def.driver_id);
                CommonLib.setComboItems(mThis.elFilter_zone,mThis.form_data.zones,'zone_code','zone_name',false,null,def.zone_code);
                CommonLib.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'id','status_name',false,null,def.status_id); 
                if(typeof onFinish =='function') onFinish();
                return;   
            }
                post_ajax([mThis.base_url,'/api/getForm_options_package_list'].join(''),null,function(data){
                if(data){
                    data.warehouses = StringSanitizer.sanitizeObject(data.warehouses); 
                    data.senders = StringSanitizer.sanitizeObject(data.senders);
                    data.statuses = StringSanitizer.sanitizeObject(data.statuses);
                    data.drivers = StringSanitizer.sanitizeObject(data.drivers);
                    data.zones = StringSanitizer.sanitizeObject(data.zones); 
                    data.statuses= DUtil.process_statuses(data.statuses,[8,11],{"status_id":-1,"status_name":"(All Statuses)"});

                    data.zones.unshift({'zone_code':null,'zone_name':"(All Zones)"});
                    data.drivers.unshift({'id':null,'driver_name':'(All Drivers)'});
                    data.senders.unshift({'id':null,'sender_name':'(All Merchants)'});

                    CommonLib.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                    CommonLib.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,null,def.sender_id);
                    CommonLib.setComboItems(mThis.elFilter_driver,data.drivers,'id','driver_name',false,null,def.driver_id);
                    CommonLib.setComboItems(mThis.elFilter_zone,data.zones,'zone_code','zone_name',false,null,def.zone_code);
                    CommonLib.setComboItems(mThis.elFilter_status,data.statuses,'id','status_name',false,null,def.status_id);
                    mThis.form_data = data;
                    if(typeof onFinish =='function') onFinish();
                    PackageListComponent.form_data = data;
                }
            });
        }


 }
//### end::FiterDialog_package

//##begin::ScanInDialog
 var ScanInDialog = new function(){
    let mThis = this;
    this.self = $('#_dl_dlgScanIn');
    this.elTitle = $('#_dl_dlgScanIn_title');
    this.btnClose = $('#_dl_dlgScanIn_btnClose');

    this.btnScanIn = $('#_dl_dlgScanIn_btnScan');
    
    this.btnClose.on('click',(e)=>{
        e.preventDefault();
        mThis.self.modal('hide');
    });
    this.show = (op,onClose)=>{
        if(!op) op = {};
        if (op.title) mThis.elTitle.text(op.title);
        mThis.onClose = onClose;
        mThis.self.modal({
            backdrop:'static'
        }).off('hide.bs.modal').on('hide.bs.modal',(e)=>{
            if (typeof mThis.onClose =='function') mThis.onClose(); 
        });
    }

 }
//##end::ScanInDialog
$(document).ready(function(){
    PackageListComponent.init();
});


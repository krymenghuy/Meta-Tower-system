'use strict'
//Sender is a Merchant or Seller of products that need to be delivered to customers (receivers)
var DriverListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_driverListComponent');
    this.elFilter_emp_type = $('#_drl_filter_emp_type');
    this.elFilter_driver_status = $('#_drl_filter_driver_status');
    this.elFilter_shift   = $('#_drl_filter_driver_shift');

    this.btnNewDriver = $('#_drl_btnNewDriver');
    this.elSearch = $('#_drl_search_driver');
    this.btnSearch = $('#_drl_btnSearch');
    this.tblDrivers= $('#_drl_tblDrivers');
    this.tblDrivers_body = $('#_drl_tblDrivers_body');
    this.driver_dropdown_menu = mThis.tblDrivers.find('div.dropdown');
    
    this.btnPrint = $('#_drl_btnPrint');
    this.btnPDF = $('#_drl_btnPDF');
    this.btnExcel = $('#_drl_btnExcel');

    this.loadFilterData = (def)=>{
        if(!def) def={};
        //def.emp_type =0;
        //def.status_code = 0;
        post_ajax([mThis.base_url,'/api/getFormData_driverdialog'].join(''),null,function(d){
           if(d){
               d.emp_types = StringSanitizer.sanitizeObject(d.emp_types);
               d.shifts = StringSanitizer.sanitizeObject(d.shifts);
               d.driver_statuses = StringSanitizer.sanitizeObject(d.driver_statuses);
               CommonLib.setComboItems(mThis.elFilter_shift,d.shifts,'shift','shift_name',true,'(All Shift)',0);
               CommonLib.setComboItems(mThis.elFilter_driver_status,d.driver_statuses,'status_code','status_name',true,'(All Status)',0);
               mThis.form_data = d;
           }
        });
    }

    this.init = ()=>{
        mThis.loadFilterData();
        
        mThis.btnPrint.on('click',function(e){
            let d = FilterDialog_pickup.getData(); 
            let params = ['rtype=driverlist&wid=',d.warehouse_id,'&search=',mThis.elSearch.val(),'&statuscode=',mThis.elFilter_driver_status.val(),'&&shift=',mThis.elFilter_shift.val()].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
            });
         }); 
  
         this.btnPDF.on('click',function(e){
            let op = {'title':'Driver List','title_color':'black','start_col_index':1};
            pdfReport.viewPDF('_drl_tblDrivers',op);
         });

        mThis.btnExcel.on('click',function(e){
           alert('Export to Excel');
        });

        mThis.self.find('._drl_filter_field').on('change',function(e){
           mThis.displayDriverList();
        });

         this.btnNewDriver.on('click',function(e){
             DriverDialog.show({'title':'New Driver'},function(driver){
                 if(driver) {
                    mThis.displayDriverList();
                 }
             });
         });
 
         //##BEGIN:: tblPickups dropdown menu
                mThis.tblDrivers.on('click','a.btn_driver_action',function(e) {
                    e.preventDefault();
                    let p = $(this).parent();
                    let x = $(this);
                    
                    let driver_id = x.data('driverid');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let driver_code = x.data('drivercode')
                    let status_code = x.data('statuscode');
 
                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                    
                    p.append(mThis.createDropdownMenuHtml_driver(driver_id,driver_code,status_code));
                    dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let container = mThis.driver_dropdown_menu.parent(); // div.dropdown or $('#_pmt_stf_dropdown_container')
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            mThis.driver_dropdown_menu.removeClass('show');
                        }
                    }
                });
                
                mThis.tblDrivers.on('mouseover','tr',function(e){
                let col_action = $(this).find('td.col_action');
                col_action.find('a.btn_driver_action>i').css('color','red'); 
                    
                }).on('mouseleave','tr',function(e) {
                    let col_action = $(this).find('td.col_action');
                    col_action.find('a.btn_driver_action>i').css('color','grey');  
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });
                
        //##END:: tblPickups dropdown menu

                mThis.tblDrivers.on('click','a.driver_status_action',function(e){
                    e.preventDefault();
                    let lnk = $(this);
                    let driver_id = lnk.data('driverid'); 
                    let def_status_code = lnk.data('statuscode');
                    mThis.changeDriverStatus(def_status_code,lnk); 
                });
 
                //Delete Merchant info
                mThis.tblDrivers.on('click','a._drl_da_delete',function(e){
                e.preventDefault();
                let x = $(this).parent();
                let driver_id = x.data('driverid');
                let status_code = x.data('statuscode');
                let p = {'driver_id':driver_id,'status_code':status_code};
                cv_interact.confirm('Delete this driver?','Delete Driver',function(e){
                    if(e) {
                            post_ajax([mThis.base_url,'/api/deleteDriver'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displayDriverList();
                                }else cv_interact.alert(err);
                            });
                       }
                    });
                });

                 //Modify or Edit Merchant Details
                 mThis.tblDrivers.on('click','a._drl_da_modify',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let driver_id = x.data('driverid');
                    //let status_code = x.data('statuscode');

                    let option = {'driver_id':driver_id,'title':'Modify Driver Details'};
                      DriverDialog.show(option,(d)=>{
                         if(d) {
                           mThis.displayDriverList();
                         }
                      });
                    
                    });
                
               //Modify Driver's commisiion rates
               mThis.tblDrivers.on('click','a._drl_da_compensation',function(e){
                   e.preventDefault();
                   let x = $(this).parent();
                   let driver_id = x.data('driverid');
                   let driver_name = x.closest('tr').find('td.name').text();
                   let driver_code = x.data('drivercode');
                   let option ={'title':'Driver Commissions','driver_id':driver_id,'driver_name':driver_name,'driver_code':driver_code};
                 
                   DriverComp.show(option,function(e){
                       if(e){

                       }
                   });
               });    
            
               //Change driver status
                 mThis.tblDrivers.on('click','a._drl_da_change_status',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let driver_id = x.data('driverid');
                    let status_code = x.data('statuscode');

                    let option = {'title':'Set Driver Status',"dataLabel":"Driver status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":status_code};
                      InputBox2.show(option,(d)=>{
                         if(d) {
                            let p = {"driver_id":driver_id,"status_code":d.value}; 
                            post_ajax([mThis.base_url,'/api/updateDriverStatus'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displayDriverList();
                                }else cv_interact.alert(err,'','error'); 
                            });
                         }
                      });
                    
                });

                //From Driver List => click to crate login for Mobile App 
                mThis.tblDrivers.on('click','a._drl_da_create_login',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    //let driver_id = x.data('driverid');
                    //let status_code = x.data('statuscode');
                    let driver_code = x.data('drivercode'); 
                    let option= {"official_code":driver_code,"user_class":"driver","goBackFunction":()=>{
                         DriverListComponent.show(DriverListComponent.option);    
                    }};
                    AddUserPanel.show(option);
                });

          mThis.elSearch.on('keyup',function(e){
              if(e.keyCode ==13) mThis.displayDriverList();
          });     
          
          mThis.btnSearch.on('click',function(){
              mThis.displayDriverList();
          });
    }
    //end::DriverListComponent.init()

    this.show = (option)=>{
      mThis.option = option;  
      mThis.elScreenTitle.html(option.title);
      mThis.displayDriverList(); 
      mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }	  
    this.createDropdownMenuHtml_driver = function(driver_id,driver_code, status_code) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-drivercode="',driver_code,'" data-driverid="',driver_id,'" data-statuscode="',status_code,'">',
        '<a class="dropdown-item _drl_da_modify" href="#"><i class="fa fa-edit" style="color:green"></i> Modify Driver Info</a>',
        '<a class="dropdown-item _drl_da_compensation" href="#"><i class="fa fa-money-bill-alt" style="color:orange"></i> Modify Driver Commissions</a>',
        '<a class="dropdown-item _drl_da_create_login" href="#"><i class="fa fa-user" style="color:blue"></i> Create Mobile App Login</a>',
        '<a class="dropdown-item _drl_da_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Driver</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _drl_da_change_status" href="#"><i class="fa fa-tasks" style="color:green"></i> Change Driver Status</a>',
         
          //'<a class="dropdown-item _drl_da_issue_list" href="#"><i class="fa fa-tasks" style="color:orange"></i> Issue List</a>', 
         
          '</div>'].join('');
          return html;
    };

    this.displayDriverList = function()
    { 
        let p = {};
        p.search_value = mThis.elSearch.val();
        p.emp_type = mThis.elFilter_emp_type.val();
        p.status_code = mThis.elFilter_driver_status.val();
        p.shift = mThis.elFilter_shift.val();
        if(!p.emp_type) p.emp_type = 0;
        if (!p.search_value) p.search_value ='';
        if (! p.status_code)  p.status_code ='';
        
        post_ajax([mThis.base_url, '/api/getDriverList'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            
            if (mThis.table){
                 
                    mThis.tblDrivers.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblDrivers.empty();
                    //alert('destroyed => '+  mThis.tblDrivers.html());
                    mThis.table = null;
                
            }
              
            data = StringSanitizer.sanitizeObject(data,null,['email']);
            
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
                             '<a href="#" data-driverid="',data.id,'" data-drivercode="',data.code,'" data-statuscode="',data.status_code,'" class="btn_driver_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:grey;font-size:1.3em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        className:'code',
                        data:'code',
                        title:'Driver ID'
                    },
                    {
                       className:'name', 
                       data:'name',
                       title:'Driver Name'
                    },
                    {
                        data:'sex',
                        title:'Sex'
                     },
                    {
                        className:'emp_type',
                        data:'emp_type',
                        title:'Employment Type'
                        // ,data:function(data,type,meta){
                        //     $(td).data('studentcode',data.student_code);
                        //     return ['<input value="',data.student_code,'" />'].join('');
                        // }
                    },
                    {
                        data:'shift',
                        title:'Shift' 
                    },
                    {
                        data:'phone_number',
                        title:'Phone Number'
                    },
                    {
                        data:function(data,a,b){
                            return StringSanitizer.sanitizeOut(data.email,'email');
                        },
                        title:'Email'
                    },
                    {
                        data:'vehicle_type',
                        title:'Vehicle Type'
                    },
                    {
                        data:'vehicle_number',
                        title:'Vehicle Number'
                    },
                    {
                        className:'driver-status',
                        data:function(data,type,meta) {
                            //if (!data.status_name || data.status_name =='') data.status_name ='?';
                            return ['<a class="driver_status_action" data-statuscode="',data.status_code,'" data-driverid="',data.driver_id,'" href="#"><span>',data.status_code,'</span></a>'].join('');
                        },
                        title:'Status'
                    }
                    
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblDrivers.DataTable({
                searching:false,
                destroy:true,
                paging:true,
                // dom: 'Bfrtip',
                // buttons: [
                //     // {
                //     //     text: 'PDF1',
                //     //     action: function ( e, dt, node, config ) {
                //     //         alert('ddd');
                //     //        mThis.convertToPDF(mThis.tblPickups.attr('id'));
                //     //     }
                //     // },
                //     {
                //         extend: 'pdfHtml5', // 'pdf'
                //         pageSize : 'A4',
                //         orientation: 'landscape',
                //         download: 'open',
                //         columns:'visible',
                //         customize: function (doc) {
                //             //var tblBody = doc.content[1].table.body;
                //             //tblBody.padding =[10, 10, 10, 10];
                //             // Here's where you can control the cell padding
                //               doc.styles.tableHeader.margin =
                //               doc.styles.tableBodyOdd.margin =
                //               doc.styles.tableBodyEven.margin = [10, 10, 10, 10];
                //         }
                        
                //     },
                //     'excelHtml5',
                //     'csvHtml5'],
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
                        "emptyTable": "No drivers found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          $(this).data('driverid',data.id); //driver_id
                          $(this).data('statuscode',data.status_code); //status_code
                         
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
                 
    }

    this.changeDriverStatus = ()=>{
       return;
    }
 
}
//end::SenderListComponent

//begin::DriverDialog
var DriverDialog = new function(){
   let mThis = this;
   this.self = $('#_drl_dlgDriver');
   this.base_url = $('#__base_url').val();
   this.elTitle = $('#_drl_dlgDriverTitle');
   this.btnSave = $('#_drl_driver_btnSave');
   this.elEmpType = $('#_drl_driver_emptype');
   this.elStatus = $('#_drl_driver_status');
   this.elVehicleType = $('#_drl_driver_vehicletype');
   this.elVehicleNumber = $('#_drl_driver_vehiclenumber');
   this.elShift = $('#_drl_driver_shift');
   this.elWarehouse_default = $('#_drl_driver_default_warehouse'); 

   this.onClose = null;
   this.elError = $('#_drl_driver_error');
   
   this.body = $('#_drl_dlgDriver_body');

   this.prepareData = (def,onFinish)=>{
       if(!def) {
           def = {};
           def.warehouse_id =1;
           def.emp_type =0;
        };

       if (mThis.form_data){
        //CommonLib.setComboItems(mThis.elWarehouse_default,mThis.form_data.warehouses,'id','warehouse_name',true,'(Select warehouse)',def.warehouse_id);
        CommonLib.setComboItems(mThis.elEmpType,mThis.form_data.emp_types,'emp_type','emp_type',true,'(Select Employment Type)',def.emp_type);
        CommonLib.setComboItems(mThis.elShift,mThis.form_data.shifts,'shift','shift_name',true,'(Select Shift)',def.shift);
        CommonLib.setComboItems(mThis.elStatus,mThis.form_data.driver_statuses,'status_code','status_name',true,'(Select Status)',def.status_code);
        CommonLib.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',true,'(Select Vehicle)',def.vehicle_type);
        if(typeof onFinish =='function') onFinish();
        return;
       }
      post_ajax([mThis.base_url,'/api/getFormData_driverdialog'].join(''),null,function(d) {
         if(d){
             d.warehouses = StringSanitizer.sanitizeObject(d.warehouses);
             d.emp_types = StringSanitizer.sanitizeObject(d.emp_types);
             d.shifts = StringSanitizer.sanitizeObject(d.shifts);
             d.driver_statuses = StringSanitizer.sanitizeObject(d.driver_statuses);
             d.vehicle_types = StringSanitizer.sanitizeObject(d.vehicle_types);

             CommonLib.setComboItems(mThis.elWarehouse_default,d.warehouses,'id','warehouse_name',true,'(select warehouse)',def.warehouse_id);
             CommonLib.setComboItems(mThis.elShift,d.shifts,'shift','shift_name',true,'(Select Shift)',def.shift);
             CommonLib.setComboItems(mThis.elEmpType,d.emp_types,'emp_type','emp_type',true,'(Select Employment Type)',def.emp_type);
             CommonLib.setComboItems(mThis.elStatus,d.driver_statuses,'status_code','status_name',true,'(Select Status)',def.status_code);
             CommonLib.setComboItems(mThis.elVehicleType,d.vehicle_types,'code','vehicle_type',true,'(Select Vehicle)',def.vehicle_type);
             mThis.form_data = d;
             if(typeof onFinish =='function') onFinish();
         }
      });

   }

   mThis.btnSave.on('click',function(e){
      let p = mThis.getData();
  
      if(!p.name) {
          mThis.elError.html('Driver name is required!');
          return;
      }
      if(p.sex !='M' && p.sex !='F') {
        mThis.elError.html('Driver`s Gender is not correct!');
        return;
     }
      if(!p.emp_type) {
        mThis.elError.html('Employment type is not correct!');
        return;
      }

      if(!p.phone_number) {
        mThis.elError.html('Phone number is required!');
        return;
      }
    //   if(!p.status_code) {
    //     mThis.elError.html('Status is not correct!');
    //     return;
    //   }
      post_ajax([mThis.base_url,'/api/saveDriver'].join(''),p,function(res){
            if(res.status =='OK') {
                mThis.self.modal('hide');
                if (typeof mThis.onClose =='function') mThis.onClose(p);
            } else mThis.elError.text(res.error_message); 
      });
       
   });

   this.show = (option,onClose)=>{
       if(!option) option ={};
       mThis.onClose = onClose;
       mThis.driver_id = option.driver_id;
       mThis.elTitle.html(option.title);
       mThis.elError.html(null);
       if (main_view.MULTI_WAREHOUSE_OP==0) mThis.elWarehouse_default.parent().hide();
       
       if (mThis.driver_id > 0) {
          mThis.elTitle.html("Driver Details");
          let p = {'driver_id':mThis.driver_id};
          post_ajax([mThis.base_url,'/api/getDriverById'].join(''),p,function(d) {
                if(d){
                   d = StringSanitizer.sanitizeObject(d);
                   
                   mThis.prepareData(d, function(){
                        mThis.setData(d);
                        //ensure there is valid default warehouse_id
                        let def_warehouse_id = mThis.elWarehouse_default.val();
                        if (def_warehouse_id ==0 || !def_warehouse_id)  mThis.elWarehouse_default.val(1);
                        
                        mThis.self.modal({
                            backdrop:'static'
                        });       
                   });
                  
                }
          });
       }else {
          mThis.elTitle.html("New Driver");
                mThis.prepareData(null, function(){
                        mThis.setData(null);
                        mThis.elWarehouse_default.val(1);
                        mThis.self.modal({
                            backdrop:'static'
                        });       
                });
       }

   }

   this.setData = (d)=>{
       if(!d) {
          mThis.body.find('.data-input').each(function(){
            $(this).val(null);
          });
          mThis.elWarehouse_default.val(1); //default warehouse id to 1
          return;
       }
     mThis.body.find('.data-input').each(function(){
         let el =$(this);
         let data_member = el.data('field');
         el.val(d[data_member]);
     });
   }

   this.getData = ()=>{
        let p = {};
        p.id = mThis.driver_id;
        mThis.body.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            p[data_member] = el.val();
        });  
        return p;
   }
} 
//end::DriverDialog

//begin::DriverCompDialog DriverCompensationDialog
 var DriverComp = new function(){
     let mThis = this;
     this.base_url = $('#__base_url').val();
     this.self = $('#_drl_dlgDriverComp');
     this.elError = $('#_drl_dlgDriverComp_error');
     this.elTitle = $('#_drl_dlgDriverCompTitle');

     this.btnSave = $('#_drl_comm_btnSave');
     this.elDriverCode = $('#_drl_comm_driver_code');
     this.elDriverName = $('#_drl_comm_driver_name');
     
     this.elEmpType = $('#_drl_comm_emp_type');
     this.elShift = $('#_drl_comm_shift');

     this.elSalary = $('#_drl_comm_salary');
     this.elComm_pickup_normal = $('#commission_pickup_normal');
     this.elComm_delivery_normal = $('#commission_delivery_normal');
     
     this.elComm_pickup_fast = $('#commission_pickup_fast');
     this.elComm_delivery_fast = $('#commission_delivery_fast');

     this.btnSave.on('click',function(){
         let p = mThis.getData();
         if(!p) return;
         
         post_ajax([mThis.base_url,'/api/saveDriverCommissions'].join(''),p,function(err){
             if(!err || err =='') {
                if(typeof mThis.onClose =='function') mThis.onClose(true);
                mThis.self.modal('hide');
             } else cv_interact.alert(err,'','error');
         });
       
     });

     this.show = (option,onClose)=>{
        if(!option) option = {};
        option = StringSanitizer.sanitizeObject(option);

        mThis.driver_id = option.driver_id;
        mThis.elTitle.html(option.title);
        mThis.onClose = onClose;
        mThis.elError.html(null);

        mThis.elDriverCode.val(option.driver_code);
        mThis.elDriverName.val(option.driver_name);

        mThis.getDriverCommisions(mThis.driver_id,()=>{
            mThis.self.modal({
                backdrop:'static'
            });
        });
        
     }

     this.getDriverCommisions= (driver_id,onFinish)=>{
        let p = {'driver_id':driver_id?driver_id:0};
        post_ajax([mThis.base_url,'/api/getDriverCommissions'].join(''),p,function(d){
            if(d){
                //mThis.driver_id = driver_id;
                d.rates = StringSanitizer.sanitizeObject(d.rates);
      
                mThis.elDriverCode.val(d.driver_code);
                mThis.elDriverName.val(d.driver_name);
                mThis.elSalary.val(d.salary);
                mThis.elEmpType.val(d.emp_type);
                mThis.elShift.val(d.shift);

                //Clear commission inputs first
                mThis.elComm_pickup_normal.val(0);
                mThis.elComm_delivery_normal.val(0);
                mThis.elComm_pickup_fast.val(0);
                mThis.elComm_delivery_fast.val(0);

                let i=0,c;
                do{
                    c = d.rates[i];
                    if(!c) break;
                    c.delivery_type = (c.delivery_type+'').toLowerCase();
                    if(c.delivery_type =='normal') {
                         mThis.elComm_pickup_normal.val(c.pickup_commission);
                         mThis.elComm_delivery_normal.val(c.delivery_commission);
                        
                    } else  if(c.delivery_type =='fast'){
                        mThis.elComm_pickup_fast.val(c.pickup_commission);
                        mThis.elComm_delivery_fast.val(c.delivery_commission);
                    }

                    i++;
                }while(c);
                if (typeof onFinish =='function') onFinish();
            }
        });
     }

     this.getData = ()=>{
         let data = {};
         data.rates = []; 

         data.driver_id = mThis.driver_id;
         data.salary = mThis.elSalary.val();
         if (!data.driver_id) {
             mThis.elError.html('Driver identity is not valid');
             return;
         } 
         data.emp_type = mThis.elEmpType.val(); //{'full time','part time'} all in lower case
         data.shift = mThis.elShift.val(); //shift abbreviate such as 'FD' = Full Day,'HD' = Half Day, 
         //data.shift_id = mThis.elShift.val(); //To be used later when shift_id is used instead of string text (FD,HD) 
         let p = {};
        
         p.delivery_type="normal";
         p.commission_pickup= mThis.elComm_pickup_normal.val();
         if(!p.commission_pickup)  p.commission_pickup =0;

         p.commission_delivery= mThis.elComm_delivery_normal.val();
         if(!p.commission_delivery)  p.commission_delivery =0;
         p.commission_per_pickup =1;
         data.rates.push(p);
         
         let p1 = {};
         p1.delivery_type="fast";
         p1.commission_pickup= mThis.elComm_pickup_fast.val();
         if (!p1.commission_pickup) p1.commission_pickup =0;
         p1.commission_delivery= mThis.elComm_delivery_fast.val();
         if (!p1.commission_delivery)  p1.commission_delivery=0;
         p1.commission_per_pickup =1;
         data.rates.push(p1);
         return data;

     }
 }
//end::DriverCompDialog

$(document).ready(function() {
    DriverListComponent.init();
});
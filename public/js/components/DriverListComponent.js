'use strict';
//Sender is a Merchant or Seller of products that need to be delivered to customers (receivers)
var DriverListComponent = new function(){
    let mThis = this;
    this.title_prop ="Driver Management";
    this.base_url =main_view.base_url;
    this.self = main_view.appContent.children('#_main_driverListComponent');
    this.elFilter_emp_type = this.self.find('#_drl_filter_emp_type');
    this.elFilter_driver_status = this.self.find('#_drl_filter_driver_status');
    this.elFilter_shift   = this.self.find('#_drl_filter_driver_shift');

    this.btnNewDriver = this.self.find('#_drl_btnNewDriver');
    this.elSearch = this.self.find('#_drl_search_driver');
    this.btnSearch = this.self.find('#_drl_btnSearch');
      
    this.btnPrint = this.self.find('#_drl_btnPrint');
    this.btnPDF = this.self.find('#_drl_btnPDF');
    this.btnExcel = this.self.find('#_drl_btnExcel');

    this.cols = [
        {
            className:'col_action',
            data:function(data,index,tr) {
             let html =['<div class="dropdown">',
                 '<a href="#" data-id="',data.id,'" data-drivername="',data.name,'" data-drivercode="',data.code,'" data-statuscode="',data.status_code,'" class="btn_driver_action" aria-haspopup="true" aria-expanded="false">',
                 '<i class="fa fa-chevron-down" style="color:grey;font-size:1.4em"></i>',
                 //' Action',
                 '</a>',
                '</div>'].join('');
                return html;
           
            } 
        },
        {
            title:'Driver ID',
            className:"code",
            data:(data,index,tr)=>{
                return `<span class="code">${data.code}</span>`;
            }
           
        },
        {
           className:'name', 
           data:(data,index,tr)=>{
            let mobile_login = data.mobile_login || {};
            let acive_class = (mobile_login.status || '').toLowerCase() =='active'? 'text-success':'text-danger';
            const app_status = VSUtil.properCase(mobile_login.status);
            let mobile_login_html =  [`<span class="d-block p-1 ${acive_class}">App: `,(mobile_login.login_name? [mobile_login.login_name, '(',app_status,')'].join('') :`មិនទាន់មាន`),`</span>`].join('');
            if(!mobile_login.login_name){
                mobile_login_html =  [`<span class="d-block p-1 text-danger">App: `,mobile_login.login_name?mobile_login.login_name:`មិនទាន់មាន`,`</span>`].join('');
            }

             return [`<div class="d-flex flex-column">`,`<span class="d-block name">${data.name}</span>`,
             mobile_login_html,
             `</div>`].join('');
           },
           title:'Driver Name'
        },
        {
            title:'Khmer Name',
            data:(data,index,tr)=>{
                return `<span class="name_kh">${data.name_kh}</span>`;
            }
           
        },
        {
           
            title:'Sex',
            data:(data,index,tr)=>{
                return data.sex? data.sex:'NA';
            }
         },
        {
            className:'emp_type',
            data:'emp_type',
            title:'Employment'
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
            title:'Contact Info',
            className:"contact-info",
            data:(data,index,tr)=>{
                let email = StringSanitizer.sanitizeOut(data.email,'email');
                email = email?email:LocaleManager.trans('No email','titles');
                return [`<div class="d-flex flex-column">`,
                 `<div class="d-flex"><i class="fas fa-phone mt-2"></i><span class="p-1 phone_number">`,data.phone_number,`</span></div>`,
                 `<div class="d-flex"><i class="fas fa-envelope"></i><span class="p-1 email">`,email,`</span></div>`,
                `</div>`].join('');
            }
        },
        {
            title:'Vehicle',
            data:(data,index,tr)=>{ 
                let vechicle_number  = ['<span class="d-block fw-semibold">លេខ: ',data.vehicle_number?data.vehicle_number:LocaleManager.trans('NA','titles'),'</span>'].join('');
                let vechicle = `<span class="d-block p-1">${data.vehicle_type?data.vehicle_type:'NA'}</span>`; 
                return [`<div class="d-flex flex-column"`,vechicle,vechicle_number,'</div>'].join('');
            }
         
        },
        {
            className:'driver-status',
            data:function(data,index,tr) {
                const cls_class = (data.status_code || '').toLowerCase() ==='active'? 'bg-success':'bg-danger';
                const status_code = data.status_code? VSUtil.properCase(data.status_code):'Inactive';
                return ['<a class="driver_status_action" data-statuscode="',status_code,'" data-driverid="',data.id,`" href="javascript:void(0)"><span style="min-width:68px;" class="d-block text-center text-white ${cls_class} p-2 shadow rounded-4">`,status_code,'</span></a>'].join('');
            },
            title:'Status'
        }
        
    ];
  
    this.loadFilterData = (def)=>{
        if(!def) def={};
        //def.emp_type =0;
        //def.status_code = 0;
        vsapi.call ([mThis.base_url,'/api/driver/form-options'].join(''),null,null,main_view.apiCluster).then(res=>{
           if(res.status_code ===200){
               let d = res.data;
               d.emp_types = StringSanitizer.sanitizeObject(d.emp_types);
               d.shifts = StringSanitizer.sanitizeObject(d.shifts);
               d.driver_statuses = StringSanitizer.sanitizeObject(d.driver_statuses);
               VSUtil.setComboItems(mThis.elFilter_shift,d.shifts,'shift','shift_name',true,'(All Shift)',0);
               VSUtil.setComboItems(mThis.elFilter_driver_status,d.driver_statuses,'status_code','status_name',true,'(All Status)',0);
               mThis.form_data = d;
           }
        });
    }

    this.init = ()=>{
        if (mThis.initAlready) return;
        mThis.driverListView = new ListView("_drl_driver_list", {
            fetchApi: `${main_view.base_url}/api/driver/list`,
            processResponse: (res) => {
                let d = res.status_code === 200 ? res.data : {};
                const driver_count = d.driver_count;
                const active_count = d.actiive_count;
                const inactive_count = d.inactiive_count;
                /** d.data is pagination object containing paging info and driver list per page */
                return d.data;
            },
            // renderComplete:(drivers)=>{
            //     mThis.stored_drivers = drivers;
            // },
            rowCreated:(data,index,tr)=>{
                tr.dataset.id = data.id;
            },
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 10,
            columns: mThis.cols,
            listContainerClass: null,
        });

        mThis.tblDrivers = mThis.driverListView.getTable();
        mThis.driver_dropdown_menu = mThis.tblDrivers.querySelectorAll('div.dropdown');
        mThis.loadFilterData();
        
        mThis.btnPrint.on('click',function(e){
            let d = FilterDialog_pickup.getData(); 
            let params = ['rtype=driver_list&wid=',d.warehouse_id,'&search=',mThis.elSearch.val(),'&statuscode=',mThis.elFilter_driver_status.val(),'&&shift=',mThis.elFilter_shift.val()].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms-gen-report/',d].join(''),'_blank'); 
            });
         }); 
  
         this.btnPDF.on('click',function(e){
            let op = {'title':'Driver List','title_color':'black','start_col_index':1};
            pdfReport.viewPDF(mThis.tblDrivers.getAttribute('id'),op);
         });

        mThis.btnExcel.on('click',function(e){
           cv_interact.info('Export to Excel');
        });

        mThis.self.find('._drl_filter_field').on('change',function(e){
           mThis.driverListView.showPage(mThis.getFilterData());
        });

         this.btnNewDriver.on('click',function(e){
             DriverDialog.show({'title':'New Driver'},function(driver){
                 if(driver) {
                    mThis.driverListView.showPage(mThis.getFilterData());
                 }
             });
         });
 
         //##BEGIN:: tblPickups dropdown menu
                mThis.tblDrivers.addEventListener('click',e => {
                    e.preventDefault();

                 // Click on btn_action
                let btn =  e.target.closest('a.btn_driver_action');
                if (btn) {
                    let td = btn.closest('td');

                    let driver_id = btn.dataset.id;
                    let driver_code = btn.dataset.drivercode;
                    let status_code = btn.dataset.statuscode;

                    let dropdownMenu = td.querySelector('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                        let tr = td.closest('tr');
                        let op = {
                            id:driver_id,
                            code:driver_code,
                            status_code:status_code,
                            name:tr.querySelector('td.name .name').textContent
                        };
                        td.insertAdjacentHTML('beforeend', mThis.createDropdownMenuHtml_driver(op));
                        dropdownMenu = td.querySelector('.dropdown-menu');
                    }

                    // Style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                        mThis.prev_dropdownMenu.classList.remove('show');
                    }
                    const pos = btn.getBoundingClientRect();
                    dropdownMenu.style.top = [(pos.y - pos.height -60),'px'].join('');
                    dropdownMenu.style.left =[(pos.x - pos.width - 230),'px'].join('');
                    dropdownMenu.classList.add('show');
                    //if (dropdownMenu.classList.contains('show')) {
                        mThis.prev_dropdownMenu = dropdownMenu;
                    //}
                    return;
                }
                  
                //Click on change status of driver
                btn = VSUtil.getElementByClass(e.target,'_drl_da_change_status');
                if(btn){
                    let driver_id = btn.dataset.id;
                    let status_code = btn.dataset.status || btn.dataset.statuscode;
                    let name = btn.dataset.drivername;
                    mThis.changeDriverStatus(driver_id,status_code,name);   
                    return;
                }
            
                 //Click on Delete driver
                 btn = VSUtil.getElementByClass(e.target,'_drl_da_delete');
                 if(btn){
                    let driver_id = btn.dataset.id;
                    let status_code = btn.dataset.statuscode;
                    let p = {'driver_id':driver_id,'status_code':status_code};
                    cv_interact.confirm('Delete this driver?',{title:'Delete Driver',context:'delete'},e=>{
                        if(e) {
                                vsapi.call([mThis.base_url,'/api/driver/delete'].join(''),p,null,null,main_view.apiCluster).then(res=>{
                                    if(res.status_code===200) {
                                        mThis.driverListView.showPage(mThis.getFilterData());
                                    }else cv_interact.error(res.error_message);
                                });
                           }
                        });
                    return;
                 }

                 //Click Edit driver | modify driver info
                 btn = VSUtil.getElementByClass(e.target,'_drl_da_modify');
                 if(btn){
                    let driver_id = btn.dataset.id;
                    let option = {'driver_id':driver_id,'title':'Modify Driver Details'};
                      DriverDialog.show(option,(d)=>{
                         if(d) {
                           mThis.driverListView.showPage(mThis.getFilterData());
                         }
                    });
                    return;
                 }

              //Click on Driver's commisiion rates
              btn = VSUtil.getElementByClass(e.target,'_drl_da_compensation');
              if(btn){
                let driver_id = btn.dataset.id;
                let driver_name = btn.dataset.drivername;
                let driver_code =btn.dataset.drivercode;
                let option ={'title':'Driver Commissions','driver_id':driver_id,'driver_name':driver_name,'driver_code':driver_code};
              
                DriverComp.show(option,function(e){
                    if(e){
                       cv_interact.success('Driver commissions have been updated!');
                    }
                });
                return;
              }

              //From Driver List => click to crate login for Mobile App
              btn = VSUtil.getElementByClass(e.target,'_drl_da_create_login');
              if(btn){
                const driver_id = btn.dataset.id;
                mThis.createAppAccount(btn.closest("tr"));
              }
             
            });

                document.addEventListener('click', function (e) {
                    // e.preventDefault(); // Commented out because it prevents normal click behavior; uncomment if needed
                    let container = mThis.driver_dropdown_menu.parentNode;
                    if (container) {
                        if (!container.contains(e.target)) {
                            mThis.driver_dropdown_menu.classList.remove('show');
                        }
                    }
                });
                
                // $(document).on('click',function(e){
                //     //e.preventDefault();
                //     let container = mThis.driver_dropdown_menu.parent();
                //     if(container){
                //         if (!container.is(e.target) && container.has(e.target).length === 0) {
                //             mThis.driver_dropdown_menu.removeClass('show');
                //         }
                //     }
                // });
 
                mThis.tblDrivers.addEventListener('mouseover',e=>{
                    let tr = e.target;
                    if(tr.tagName ==='TD'){
                        tr = tr.closest('tr');
                    }
                    if (tr){
                        let btnIcon = tr.querySelector('td.col_action .btn_driver_action > i');
                        if(btnIcon) btnIcon.classList.add('text-danger','fw-semibold');
                        if(mThis.prev_tr){
                            btnIcon = mThis.prev_tr.querySelector('td.col_action .btn_driver_action > i');
                            if(btnIcon) btnIcon.classList.remove('text-danger','fw-semibold');
                            let dropdownMenu = mThis.prev_tr.querySelector('div.dropdown-menu');
                            if (dropdownMenu) {
                                    dropdownMenu.classList.remove('show');
                            }
                        }
                        mThis.prev_tr = tr;
                     }
                    
                });
            
                // mThis.tblDrivers.on('mouseover','tr',function(e){
                // let col_action = $(this).find('td.col_action');
                // col_action.find('a.btn_driver_action>i').css('color','red'); 
                    
                // }).on('mouseleave','tr',function(e) {
                //     let col_action = $(this).find('td.col_action');
                //     col_action.find('a.btn_driver_action>i').css('color','grey');  
                //     col_action.find('div.dropdown-menu').removeClass('show');  
                // });
                
        //##END:: tblPickups dropdown menu
          
          mThis.elSearch.on('keyup',function(e){
             clearTimeout(mThis.search_timeout);
             mThis.search_timeout = setTimeout(()=>{
                 mThis.driverListView.showPage(mThis.getFilterData());
             },250);
          });     
          
          mThis.btnSearch.on('click',function(){
              mThis.driverListView.showPage(mThis.getFilterData()); 
          });

        mThis.initAlready = true;  
    }
    //end::DriverListComponent.init()

    this.getFilterData = ()=>{
         return {
           'search_value':mThis.elSearch.val(),
           'shift':mThis.elFilter_shift.val(),
           'status_code':mThis.elFilter_driver_status.val()
         };
    }

    this.getDriverDetailsForLogin = (tr)=>{
      return  {
         "official_id":tr.dataset.id,
         "official_code":tr.querySelector("td.code .code").textContent,
         "full_name":tr.querySelector('td.name .name').textContent,
         "email":tr.querySelector("td.contact-info .email").textContent,
         "phone_number":tr.querySelector('td.contact-info .phone_number').textContent,
         "user_class":"driver"
       };
        
    }

    /** Create App Login for Driver */
    this.createAppAccount = (tr)=>{ 
            const driver = mThis.getDriverDetailsForLogin(tr);
            const op = {
            user_id: null,
            open: 'add-user',
            default: driver, //{"official_code":driver.code,"user_class":"Driver","phone_number":driver.phone_number,"full_name":driver.name},
            onClose: () => {
                mThis.elSearch.val(driver.phone_number);
                mThis.driverListView.showPage(mThis.getFilterData());
            }
        };
        if(!AuthManager.allowed(100)) return;
        AddUserDialog.show(op);
    }

    this.show = (options = null )=>{
      mThis.init();  
      mThis.options = options;
      mThis.driverListView.showPage(mThis.getFilterData());
      mThis.self.siblings().hide();
      main_view.setTitle(mThis.title_prop);
      mThis.self.hide().fadeIn(250);	
    }

    this.hide = ()=>{
        mThis.self.hide();
    }
    /** data = {"id","code","status_code"}*/	  
    this.createDropdownMenuHtml_driver = function(data) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu bg-white shadow" data-drivercode="',data.code,'" data-driverid="',data.id,'" data-id="',data.id,'" data-statuscode="',data.status_code,'">',
        '<a class="dropdown-item _drl_da_modify" data-id="',data.id,'"  href="javascript:void(0)"><i class="fa fa-edit" style="color:green"></i> Modify Driver Info</a>',
        '<a class="dropdown-item _drl_da_compensation" data-id="',data.id,'" href="javascript:void(0)"><i class="fa fa-money-bill-alt" style="color:orange"></i> Modify Driver Commissions</a>',
        '<a class="dropdown-item _drl_da_create_login" data-id="',data.id,'" href="javascript:void(0)"><i class="fa fa-user" style="color:blue"></i> Create Mobile App Login</a>',
        '<a class="dropdown-item _drl_da_delete" data-id="',data.id,'" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete Driver</a>',
        '<div class="dropdown-divider"></div>',
        '<a class="dropdown-item _drl_da_change_status" data-drivername="',data.name,'" data-id="',data.id,'" data-status="',data.status_code,'" href="javascript:void(0)"><i class="fa fa-tasks" style="color:green"></i> Change Driver Status</a>',
        '</div>'].join('');
        return html;
    };
 
    this.changeDriverStatus = (driver_id, def_status_code,name)=>{
        let option = {'title':['Set Driver Status (',name,')'].join(''),"dataLabel":"Driver status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":def_status_code};        
        InputBox2.show(option,(d)=>{
           if(d) {
              let p = {"driver_id":driver_id,"status_code":d.value}; 
              vsapi.call([mThis.base_url,'/api/driver/update-status'].join(''),p).then(res=>{
                  if(res.status_code === 200) {
                      cv_interact.success('Driver status has been updated!');
                      mThis.driverListView.showPage(mThis.getFilterData());
                  }else cv_interact.error(res.error_message); 
              });
           }
        });
    }
 
}
//end::SenderListComponent

//begin::DriverDialog
const DriverDialog = new function(){
   let mThis = this;
   this.self = main_view.appContent.children('#_drl_dlgDriver');
   this.base_url = main_view.base_url;
   this.elTitle = this.self.find('#_drl_dlgDriverTitle');
   this.btnSave = this.self.find('#_drl_driver_btnSave');
   this.elEmpType = this.self.find('#_drl_driver_emptype');
   this.elStatus = this.self.find('#_drl_driver_status');
   this.elVehicleType = this.self.find('#_drl_driver_vehicletype');
   this.elVehicleNumber = this.self.find('#_drl_driver_vehiclenumber');
   this.elShift = this.self.find('#_drl_driver_shift');
   this.elWarehouse_default = this.self.find('#_drl_driver_default_warehouse'); 

   this.onClose = null;
   this.elError =this.self.find('#_drl_driver_error');
   
   this.body = this.self.find('#_drl_dlgDriver_body');

   this.prepareData = (def,onFinish)=>{
       if(!def) {
           def = {};
           def.warehouse_id =1;
           def.emp_type =0;
        };

       if (mThis.form_data){
        //VSUtil.setComboItems(mThis.elWarehouse_default,mThis.form_data.warehouses,'id','warehouse_name',true,'(Select warehouse)',def.warehouse_id);
        VSUtil.setComboItems(mThis.elEmpType,mThis.form_data.emp_types,'emp_type','emp_type',true,'(Select Emp Type)',def.emp_type);
        VSUtil.setComboItems(mThis.elShift,mThis.form_data.shifts,'shift','shift_name',true,'(Select Shift)',def.shift);
        VSUtil.setComboItems(mThis.elStatus,mThis.form_data.driver_statuses,'status_code','status_name',true,'(Select Status)',def.status_code);
        VSUtil.setComboItems(mThis.elVehicleType,mThis.form_data.vehicle_types,'code','vehicle_type',true,'(Select Vehicle)',def.vehicle_type);
        if(typeof onFinish =='function') onFinish();
        return;
       }

      vsapi.call([mThis.base_url,'/api/driver/form-options'].join(''),null,null,main_view.apiCluster).then(res=>{
         if(res.status_code===200){
             let d = res.data;

             d.warehouses = StringSanitizer.sanitizeObject(d.warehouses);
             d.emp_types = StringSanitizer.sanitizeObject(d.emp_types);
             d.shifts = StringSanitizer.sanitizeObject(d.shifts);
             d.driver_statuses = StringSanitizer.sanitizeObject(d.driver_statuses);
             d.vehicle_types = StringSanitizer.sanitizeObject(d.vehicle_types);

             VSUtil.setComboItems(mThis.elWarehouse_default,d.warehouses,'id','warehouse_name',true,'(select warehouse)',def.warehouse_id);
             VSUtil.setComboItems(mThis.elShift,d.shifts,'shift','shift_name',true,'(Select Shift)',def.shift);
             VSUtil.setComboItems(mThis.elEmpType,d.emp_types,'emp_type','emp_type',true,'(Select Emp Type)',def.emp_type);
             VSUtil.setComboItems(mThis.elStatus,d.driver_statuses,'status_code','status_name',true,'(Select Status)',def.status_code);
             VSUtil.setComboItems(mThis.elVehicleType,d.vehicle_types,'code','vehicle_type',true,'(Select Vehicle)',def.vehicle_type);
             mThis.form_data = d;
             if(typeof onFinish ==='function') onFinish();
         }
      });

   }

   mThis.btnSave.on('click',function(e){
      let p = mThis.getData();
    //   if(!p.name) {
    //       mThis.elError.html('Driver name is required!');
    //       return;
    //   }
    //   if(p.sex !='M' && p.sex !='F') {
    //     mThis.elError.html('Driver`s Gender is not correct!');
    //     return;
    //  }
    //   if(!p.emp_type) {
    //     mThis.elError.html('Employment type is not correct!');
    //     return;
    //   }

    //   if(!p.phone_number) {
    //     mThis.elError.html('Phone number is required!');
    //     return;
    //   }

    //   if(!p.status_code) {
    //     mThis.elError.html('Status is not correct!');
    //     return;
    //   }
      vsapi.call([mThis.base_url,'/api/driver/save'].join(''),p).then(res=>{
            if(res.status_code === 200) {
                mThis.self.modal('hide');
                if (typeof mThis.onClose ==='function') mThis.onClose(p);
            } else cv_interact.error(res.error_message); 
      });
       
   });

   this.show = (option,onClose)=>{
       if(!option) option ={};
       mThis.onClose = onClose;
       mThis.driver_id = option.driver_id;
       mThis.elTitle.html(option.title);
       mThis.elError.html(null);
       //if (main_view.MULTI_WAREHOUSE_OP==0) mThis.elWarehouse_default.parent().hide();
       
       if (mThis.driver_id > 0) {
          mThis.elTitle.html("Driver Details");
          let p = {'driver_id':mThis.driver_id};
          vsapi.call([mThis.base_url,'/api/driver/details'].join(''),p).then(res=> {
                if(res.status_code === 200){
                   let d = StringSanitizer.sanitizeObject(res.data,null,['email']);
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
 let DriverComp = new function(){
     let mThis = this;
     this.base_url =main_view.base_url;
     this.self = main_view.appContent.children('#_drl_dlgDriverComp');
     this.elError = this.self.find('#_drl_dlgDriverComp_error');
     this.elTitle = this.self.find('#_drl_dlgDriverCompTitle');

     this.btnSave = this.self.find('#_drl_comm_btnSave');
     this.elDriverCode =this.self.find('#_drl_comm_driver_code');
     this.elDriverName = this.self.find('#_drl_comm_driver_name');
     
     this.elEmpType = this.self.find('#_drl_comm_emp_type');
     this.elShift = this.self.find('#_drl_comm_shift');

     this.elSalary = this.self.find('#_drl_comm_salary');
     this.elComm_pickup_normal = this.self.find('#commission_pickup_normal');
     this.elComm_delivery_normal = this.self.find('#commission_delivery_normal');
     
     this.elComm_pickup_fast = this.self.find('#commission_pickup_fast');
     this.elComm_delivery_fast = this.self.find('#commission_delivery_fast');

     this.btnSave.on('click',function(){
         let p = mThis.getData();
         if(!p) return;
         
         vsapi.call([mThis.base_url,'/api/driver/commissions/save'].join(''),p).then(res =>{
             if(res.status_code===200) {
                if(typeof mThis.onClose ==='function') mThis.onClose(true);
                mThis.self.modal('hide');
             } else cv_interact.error(res.error_message);
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
        vsapi.call([mThis.base_url,'/api/driver/commissions'].join(''),p).then(res=>{
            if(res.status_code===200){
                //mThis.driver_id = driver_id;
                let d = res.data;
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
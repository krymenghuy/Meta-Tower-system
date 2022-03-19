'use strict'
var ReceivePackageComponent = new function(){
    let mThis = this;
    this.self = $('#_main_receivePackageComponent');
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.btnBack = $('#_main_rpi_btnBack');
     
    this.elWarehouse = $('#_rpc_warehouse'); 
    this.elOrderCode = $('#_rpc_order_code');
    this.elSenderName = $('#_rpc_sender_name');
    this.elDeliveryDate = $('#_rpc_delivery_date');
    this.elDeliveryTime = $('#_rpc_delivery_time');
    //this.elOrderId = $('#_main_rpi_order_id');
    //this.elSenderCode = $('#_main_rpi_sender_code');
    //this.elSenderId = $('#_main_rpi_sender_id');
    this.order_id = null;
    this.sender_code =null;
    this.sender_id = null;
    this.lnkFindSender = $('#_rpc_lnkFindSender');
    this.tblPackagesWrapper = $('#_rpc_tblPackages_wrapper');

    this.init = ()=>{
        //this.p_container = $('#pl_list_container');
        //this.detail_panel = $('#_rpc_detail_panel');
        //this.package_detail = $('#_rpc_package_detail');
        
        if (main_view.MULTI_WAREHOUSE_OP ==0) mThis.elWarehouse.parent().hide(); else mThis.elWarehouse.parent().show();
        
        mThis.PackageDetailView.prepareData();
 
        this.btnBack.on('click',(e)=>{
            e.preventDefault();
            if (typeof mThis.onClose =='function') mThis.onClose(mThis.item_count);
            if(mThis.prev_component); mThis.prev_component.show(mThis.prev_component_option);
        });
 
        // this.btnOK1.on('click',function(e){
        //     e.preventDefault();
        //     mThis.receivePackage(true); 
        //     //mThis.btnBack.trigger('click');
        // });
        // this.btnOK_new1.on('click',function(e){
        //     e.preventDefault();
        //     mThis.receivePackage(false); 
        // });

        // this.btnOK.on('click',function(e){
        //     e.preventDefault();
        //     mThis.receivePackage(true); 
        //     //mThis.btnBack.trigger('click');
        // });
        // this.btnOK_new.on('click',function(e){
        //     e.preventDefault();
        //     mThis.receivePackage(false); 
        // });

        this.lnkFindSender.on('click',(e)=>{
            e.preventDefault();
            let option = {'title':"Find Merchant","role":"sender","singleSelect":true,"previousDialog":null};
            FindPersonDialog.show(option,(persons)=>{
      
                if(persons[0]){
                    let p = persons[0];
                    mThis.elSenderName.text(p.name);
                    mThis.sender_code = p.code;
                    mThis.sender_id = p.id;
                }
            });

        });
  
    }
 
    /** this.show() shows ReceviePackageComponent View **/
    //option = {'title','order_id','form_data','prev_component','prev_component_option'}
    this.show = (option)=>{
       if (!option) option ={'title':'Receive Packages','prev_component':null,'prev_component_option':null};  
       mThis.elScreenTitle.html(option.title); 

       //NOTE: showError(), and elSuccess are defined in sub class => mThis.PackageDetailView
       mThis.PackageDetailView.showError(null); //hide error text field
       mThis.PackageDetailView.elSuccess.html(null);//Hide previous success message

       mThis.allow_find_sender = option.allow_find_sender; 
       mThis.order_id = option.order_id; //order_id is used to display packages when user open New Pacakge and add new pacakge and then come back to PacalgeList.show(), after that user can press Back button to come back to "Pickup Center" or "package trail" 
       if (!option.allow_find_sender) mThis.lnkFindSender.hide(); else mThis.lnkFindSender.show();
     
       mThis.prev_component = option.prev_component;
       mThis.prev_component_option= option.prev_component_option;

       if (mThis.order_id > 0) {
            mThis.allow_find_sender = false;
            mThis.displayOrderInfo(mThis.order_id,()=>{
                mThis.self.show().siblings().hide();
            });
      } else {
        mThis.clearForm();   
        // //Clear existing previous entered values
        // mThis.elOrderCode.val(null);
        // mThis.elSenderName.val(null);
        // mThis.sender_id = null;
        // mThis.order_id = null;
        mThis.self.show().siblings().hide();
      }
    }

    //Clear ReceivePackageComponent view including sender_name, sender_id, order_code, order_id, etc...
    this.clearForm = ()=>{
        mThis.sender_id = null;
        mThis.order_id = null;
        mThis.barcode = null;

        mThis.elSenderName.text(null);
        mThis.elOrderCode.text(null);
       
        mThis.elDeliveryTime.val(null);
        mThis.elDeliveryDate.val(null);
        mThis.PackageList.clearForm();
        mThis.PackageDetailView.show(null,'add');
    }

    this.displayOrderInfo = (order_id, onFinish)=>{
        let p = {'order_id':order_id?order_id:0,"context":"1"}; //context =1 (in context of "Receive Packages". Receive packages on arrival and mark package status_id to 5 "Arrived At Office")
        
        mThis.PackageList.p_container.empty();

        post_ajax([mThis.base_url,'/api/getOrderInfo'].join(''),p,function(d) {
           if(d){
                let packages = d.packages?d.packages:[];
                d = StringSanitizer.sanitizeObject(d);
                packages = StringSanitizer.sanitizeObject(packages,null,['size']); //sanitize all clumns except column "size"
               
               //mThis.elOrderId.val(d.order_id);
               mThis.order_id = d.order_id;
               mThis.elOrderCode.text(d.order_code);
               mThis.elSenderName.text(d.sender_name);
               mThis.sender_id = d.sender_id;
               mThis.sender_code  = d.sender_code;
               mThis.PackageList.displayPackageList_from_data(packages);    
            //    if(packages[0]){
               
            //     //mThis.package_list_panel.show().siblings().hide();   
            //     //mThis.displayPackageList(packages); 
            //    }else {
            //        mThis.package_detail.show().siblings().hide();
            //    }
              
               if (typeof onFinish == 'function') onFinish();
           }
       });
    }
   
    // this.beginEditPackageDetail = (tr)=>{
    //   if(!tr) return;
    //   //Create json object thtat represents the row 
    //   let p = {};
    //   tr.find('td').each(function(){
    //       let x = $(this);
    //       let data_member = x.data('field');
    //       if (data_member) p[data_member] = x.data('value'); 
    //   });
      
    //    this.PackageDetailView.show();
    //   //alert( mThis.package_detail.html());
    //   //mThis.package_list_panel.hide(); 
    //   mThis.setData(p);
    
    // }
 
    //###begin::PackageList class (subclass of ReceivePackageComponent)
    this.PackageList = new function(){
         let inThis = this;
         this.self = $('#div_rpc_package_list');
         this.p_container = $('#_rpc_package_list_wrapper');
         this.btnSearch = $('#_rpc_btnSearchPackage');
         this.btnNewPackage = $('#_rpc_btnNewPackage');

         this.btnNewPackage.on('click',function(e){
             mThis.PackageDetailView.show();
          });

         this.p_container.on('click','a.pg-item-btn_delete',function(e){
             e.preventDefault();
             let x = $(this);
             let barcode = x.data('barcode');
             //let pid = x.data('pid');
             let p = {'barcode':barcode};
             if (!p.barcode) {
                 cv_interact.alert('Failed to delete because package identity is not valid','','error');
                 return;
             }
             cv_interact.confirm('Delete this package?','Delete Package',function(e){
                 if(e){
                    post_ajax([mThis.base_url,'/api/deletePackage'].join(''),p,function(err){
                        if(!err | err =='') 
                        mThis.displayOrderInfo(mThis.order_id);
                        else cv_interact.alert(err,'','error');     
                    });
                 }
             },'Delete','Close');
         }); 

         this.p_container.on('click','a.pg-item-btn_edit',function(e){
            e.preventDefault();
            let x = $(this);
            //let pid = x.data('pid');
            let div = x.closest('div.pg-item');
            let d = mThis.PackageDetailView.getPackageDetail(div);
            if(!d.barcode) {
                cv_interact.alert('Package identity is not valid','','warning');
                return;
            }
            mThis.PackageDetailView.show(d,'edit');//view in edit mode => so show only "Close" button and "Save Changes" button
        });
 
        this.p_container.on('click','a.pg-item-btn_print_barcode',function(e){
            e.preventDefault();
            let x = $(this);
            let barcode = x.data('barcode');
            window.open([mThis.base_url,'/package_barcode/',encodeURI(barcode)].join(''),'_blank'); 
        });

        this.p_container.on('click','a.pg-item-btn_verify',function(e){
            e.preventDefault();
            let x = $(this);
            let barcode = x.data('barcode');
            alert('todo:accept package here');
            let p = {'barcode':barcode,'order_id':order_id};
            post_ajax([mThis.base_url,'/api/acceptPackage'].join(''),p,function(err){
                if(!err || err =='') {
                  
                }else cv_interact.alert(err,'','error');
            });
        });
        
        this.clearForm = ()=>{
           inThis.p_container.empty();  
        }
 
         //Create package details as html format 
         this.createPackage_html = (p,cols,prop_names)=>{   
             let i= 0;
             let html = null;
             for(let x in cols) {
                    let display_name = null;
                    if (prop_names[i]) 
                       display_name = prop_names[i]; 
                    else 
                       display_name ='???';
                    let col_name = cols[x];
                    //custom specific code for zone_name field
                    //let display_col_name = col_name; //Example: display_col_name ="zone_name" and col_name ="zone_code"
                    let display_text = 'អត់មាន';
                    //For zone_name => use "zone_code" as value and "zone_name" as displayed text
                    //For "cod" => use 1 for Yes and use 0 for No 
                 if (col_name =='zone_name') {
                     col_name ='zone_code'; //use zone_code as value instead of zone_name
                     //display_col_name = 'zone_name';
                     display_text = p.zone_name;
                 } else if (col_name =='size') {
                    let size = DUtil.processPackageSize(p.size); 
                    size.width = $.isNumeric(size.width)?size.width:0; 
                    size.length = $.isNumeric(size.length)?size.length:0; 
                    size.height = $.isNumeric(size.height)?size.height:0; 
                    if(size) display_text = [size.width,'x',size.length, 'x',size.height,' (cm)'].join(''); 
                    else display_text='(Invalid)';
                 } 
                 else if (col_name=='cod')
                 {
                                if (p.cod==1) 
                                     display_text ='Yes'; 
                                else 
                                    display_text ='No'; 
                }
                 else 
                    display_text = p[col_name];
                    html = [html,
                        '<div class="pg-prop" data-value="', p[col_name],'" data-field="',col_name,'">',
                        '<span class="pg-prop-label">',display_name,'</span>',
                        '<span class="pg-prop-value">',display_text,'</span>',
                        '</div>'
                ].join('');
                i++;

             }

             //p.barcode and p.package_id are specific fields here
             html = [ '<div class="pg-item" data-barcode="',p.barcode,'" data-pid="',p.package_id,'" >',html,
               '<div style="margin-top:5px">',
                  '<a href="javascript:;" data-barcode="',p.barcode,'" data-pid="',p.package_id,'" class="pg-item-btn_delete"><i class="fa fa-trash" style="color:red"></i></a>',
                  '&nbsp;<a href="javascript:;" data-barcode="',p.barcode,'" data-pid="',p.package_id,'" class="pg-item-btn_edit"><i class="fa fa-edit"></i></a>',
                  '&nbsp;<a href="javascript:;" data-barcode="',p.barcode,'" data-pid="',p.package_id,'" class="pg-item-btn_print_barcode"><i class="fa fa-barcode" style="color:green"></i></a>',
                  //'&nbsp;<a href="javascript:;" data-barcode="',p.barcode,'" data-pid="',p.package_id,'" class="pg-item-btn_verify"><i class="fa fa-check" style="color:green"></i></a>',
               '</div>',
             '</div>'].join('');
            
              return html;
         }
         
         //add new display of package to the package List
        this.addPackage = (p)=>{
          //when display_col is "zone_name" => "zone_code" is used for value and "zone_name" for displayed value. This is defined in createPackage_html()   
          let display_cols = ['Delivery Type','Receiver Phone','Receiver Address','Zone','Price','COD','Base Fee','Additional','Fee Payer','Size','Actual KG','Billed KG','Notes','Status'];
          let cols = ['delivery_type','receiver_phone','receiver_address','zone_name','price','cod','base_fee','delivery_fee','df_payer','size','actual_kg','billed_kg','delivery_notes','status']
          let html = inThis.createPackage_html(p,cols,display_cols);
          inThis.p_container.append(html);
        }
         
        this.displayPackageList_from_data = (ps)=>{
            let i =0,c;
            inThis.p_container.empty();
            do{
                c = ps[i];
                if(!c) break;
                   inThis.addPackage(c);
                i++;
            }while(c);

            if  (i==0){
              let e_html ='<div style="margin:auto;width:60%;padding:15px;border-radius:3px;background:#fff;color:blue;border:1.2px solid grey">អត់ទាន់មានពត៏មានទំនិញ</div>'; 
              inThis.p_container.append(e_html);
            }
        }
       
        /** this.show()=> shows Package List  PackageList in case that packages have been booked before **/
        this.show =(ps)=>{
          inThis.self.show().siblings().hide();  
          if (ps) 
             inThis.displayPackageList_from_data(ps); //display data from give dataset (json array)
          else 
             //NOTE: mThis refers to "ReceivePackageComponent" while "inThis" refers to this class mThis->"PackageList", a sub class
             mThis.displayOrderInfo(mThis.order_id); //display data from database
        }
    }
    //###end:: PackageList class (sub class)
    
    //###begin::PackageDetailView (sub class of ReceivePackageComponent)
    this.PackageDetailView = new function(){
      let inThis = this;
      this.self = $('#_rpc_package_detail');
      this.btnClose = $('#_rpc_package_detail_btnClose');
      this.btnSaveClose = $('#_rpc_package_detail_btnSaveClose');
      this.btnSaveNew = $('#_rpc_package_detail_btnSaveNew');

      this.field_container = $('#_rpc_package_detail');
      this.elZone = $('#_rpc_zone_code');
      this.elSize = $('#_rpc_size');
      this.elBilledKg = $('#_rpc_billed_kg');
      this.elActualKg = $('#_rpc_actual_kg');
      this.elDeliveryType = $('#_rpc_delivery_type');
      this.elDeliveryFee = $('#_rpc_delivery_fee');
      this.elBaseFee = $('#_rpc_base_fee');
      this.elCODFee = $('#_rpc_cod_fee');
      this.elCOD = $('#_rpc_cod');
      this.elPayer = $('#_rpc_df_payer');

      this.elError = $('#_rpc_error'); //display error of current package
      this.elSuccess = $('#_rpc_success'); //display numer of package received
  
      //this.order_id = null;
      //this.sender_code =null;
      //this.sender_id = null;
      this.item_count = 0 ; // count newly received pacakges. This var is reset then this form is shown
       
       //Init field array
       inThis.p_fields = [];
       
       //##start: direct init() codes
      //=====================================
       inThis.field_container.find('.data-input').each(function(){
           let x = $(this);
           inThis.p_fields.push({'element':x,'dataMember':x.data('field')});
       });
      
       inThis.elSize.on('blur',function(){
          inThis.setBilledKg();
       });

       inThis.field_container.on('change','.data-input',function(e){
          let el = $(this);
          let data_member = el.data('field');
          let calc_cols = ['delivery_type','zone_code','cod','price','df_payer','size','actual_kg','billed_kg'];
          if(calc_cols.indexOf(data_member) !=-1) {
              if (data_member =='size' || data_member =='actual_kg') {
                 inThis.setBilledKg(el.val()); 
              }
              inThis.calculatePrices();
          }
      });
 
      inThis.btnClose.on('click',function(e){
        e.preventDefault();
        inThis.showError(null);
        inThis.elSuccess.html(null);
        mThis.PackageList.show(null);
      });

      inThis.btnSaveClose.on('click',function(e){
         inThis.receivePackage(true);
      });

      inThis.btnSaveNew.on('click',function(e){
        inThis.receivePackage(false);
      });
       
     //end::direct init() codes
     //=========================================

      this.getData = ()=>{
            let p = {
                'warehouse_id':mThis.elWarehouse.val(),
                'sender_id':mThis.sender_id,
                'order_id':mThis.order_id,
                'delivery_date':mThis.elDeliveryDate.val(),
                'delivery_time':mThis.elDeliveryTime.val()
            };
            let item = {};
            for(let i in inThis.p_fields){ 
                let f = inThis.p_fields[i];
                item[f.dataMember] = f.element.val(); 
            }
            
            if (item.size) {
                let size = DUtil.processPackageSize(item.size);
                item.size = size;
            }

            item.barcode =  inThis.barcode; // NOTE "inThis" refer to PackageDetaiLView (or Editing package view)
            p.packages =[item];
            return p;
     }
        
     this.setBilledKg = (str_size)=>{
        if(!str_size) return;
        let billed_kg = inThis.elBilledKg.val();
        let actual_kg = inThis.elActualKg.val();
        let size = DUtil.processPackageSize(str_size);
        if(size){
            billed_kg = parseFloat(size.width * size.length * size.height)/6015;
            if (billed_kg < actual_kg) billed_kg = actual_kg;   
        }
        inThis.elBilledKg.val(billed_kg);
     }

     this.calculatePrices = ()=>{
        inThis.showError(null);
        let billed_kg = inThis.elBilledKg.val();
        let zone_code = inThis.elZone.val();
        let p = {'sender_id':mThis.sender_id,'delivery_type':inThis.elDeliveryType.val(),'zone_code':zone_code,'billed_kg':billed_kg};
        post_ajax([mThis.base_url,'/api/getDeliveryPriceInfo'].join(''),p,function(d){
            if(d){
               
                  d = StringSanitizer.sanitizeObject(d);
                  inThis.elBaseFee.val(d.base_fee);
                  inThis.elDeliveryFee.val(d.delivery_fee);
                  inThis.elDeliveryFee.val(d.delivery_fee);  
                  let total = (d.base_fee + d.delivery_fee);
                
                  //check COD and COD Fee
                    let cod_fee =0;
                    let cod = parseFloat(inThis.elCOD.val());
                    if(cod==1 || (cod+'').toLowerCase() =='yes') cod_fee = (total * d.cod_fee_percent/100);
                    inThis.elCODFee.val(cod_fee);   
                  //end of checking COD and COD Fee

                 if (d.status =='Error') {
                    inThis.showError(d.error_message); 
                 }   
            }
        }); 
    }

     this.clearForm =()=>{
         for(let i in inThis.p_fields){
             let f = inThis.p_fields[i];
             f.element.val(null); 
         }
     }
 
     this.setData = (d)=>{ 
        if (!d) {
            for(let i in inThis.p_fields){
                let f = inThis.p_fields[i];
                f.element.val(null);  
            }
            inThis.barcode = null;
            //set default values
            inThis.elDeliveryType.val('normal');
            inThis.elCOD.val(1);
            inThis.elPayer.val('Sender');
            return;
        }
       
        inThis.barcode = d.barcode; //Very important for Editing and Updating the package detail 
        for(let i in inThis.p_fields){
            let f = inThis.p_fields[i];
            f.element.val(d[f.dataMember]);
           
        }
        //inThis.elZone.select2('val',d.zone_code);
        inThis.elZone.val(d.zone_code).trigger('change'); //To make select2() take selected value
     }

     //method=> PackageDetailView.receivePackage()
     this.receivePackage = (receive_and_close= false)=>{
        inThis.showError(null);
        let p = inThis.getData();
       
        //NOTE: "mThis.allow_find_sender" is set to TRUE or FALSE within method ReceivePacakgeComponent.show()
        if (mThis.allow_find_sender ==true) p.allow_create_order =1; else p.allow_create_order =0;
        post_ajax([mThis.base_url,'/api/receivePackages'].join(''),p,function(result){
         if(typeof result =='string') 
            alert(result);
         else
         {
             
             if(result) {
                 if (result.status =='Error') {
                     inThis.showError(result.error_message);
                     return;
                 }
                 if (result.success_count > 0){
                     if (!inThis.barcode) inThis.item_count +=result.success_count;
                     inThis.order_id = result.order_id; //mThis.packageDetailView.order_id. This is importand in case when User Receive package without inputting Order ID (e.g: packages brougt in by sellers)
                     mThis.order_id =  result.order_id; // ReceivePackageComponent.order_id
                     inThis.elSuccess.html([inThis.item_count,' packages received'].join(''));
                     if (receive_and_close== true)  {
                         if (typeof inThis.onClose =='function') inThis.onClose(inThis.item_count);
                         //Close this mThis.PackageDetaiLView() and show mThis.PackageList()
                         mThis.PackageList.show();
                     } else inThis.setData(null);
                 } else {
                     if (result.error_count >0) inThis.showError(result.errors[0]);
                 }
  
             }
          }
         
         });
     }

     this.showError = (err) =>{
        if (err) {
            inThis.elError.parent().show();
            inThis.elError.html(err);
        }else inThis.elError.parent().hide();
     }
  
      //this.show()=> shows Edit Detail of package PackageDetailView class
      this.show = (data,view_mode='edit')=>{
         inThis.self.addClass('animate-slide-left').delay(2000).queue(function(){
            $(this).removeClass("animate-slide-left").dequeue();
         });
         
         inThis.showError(null); //hide error text field
         inThis.elSuccess.html(null);
         
        if (data){
            inThis.setData(data);
        }else {
            inThis.barcode = null; // Very important to avoid confusing Edit mode and New mode
            inThis.setData(null);
           // inThis.clearForm();
        }    
          
        inThis.self.show().siblings().hide();
      }

      //div is "div.pg-item", container of each package detail
      this.getPackageDetail = (div)=>{
         if(!div) return;
         let p = {};
        div.find('div.pg-prop').each(function(){
            let x = $(this);
            let dataMember = x.data('field');
            //let span = x.find('span.pg-prop-value'); 
            p[dataMember] = x.data('value'); //(span)?span.data('value'):null;
        });
        if ((p.cod+'').toLowerCase()=='yes') p.cod =1; else p.cod =0;
        //In case of editing existing Package => the prop "p.barcode" is critical importance to avoid dubplicate inserting of packages 
        p.barcode = div.data('barcode');  
        p.package_id = div.data('pid');
        return p; 
      }
      
      //prepareData() is called in ReceivePackageComponent.init() because
      // (1) => ReceivePackageComponent.elWarehouse needs to be populated early
      // (2) => Save time
      this.prepareData = (onFinish)=>{
        if (inThis.form_data) {
            CommonLib.setComboItems(mThis.elWarehouse,inThis.form_data.warehouses,'id','warehouse_name',false,null,1);
            CommonLib.setComboItems(inThis.elZone,inThis.form_data.zones,'zone_code','zone_name',false,null);
            if(typeof onFinish =='function') onFinish();
            return;
        }
        post_ajax([mThis.base_url,'/api/getForm_options_package_list'].join(''),null,function(data){
            data.zones = StringSanitizer.sanitizeObject(data.zones);
            data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
            CommonLib.setComboItems(mThis.elWarehouse,data.warehouses,'id','warehouse_name',false,null,1);
            CommonLib.setComboItems(inThis.elZone,data.zones,'zone_code','zone_name',false,null);
            if(typeof onFinish =='function') onFinish();
        });
      }

    }  
    //###end::PackageDetailView (sub class of ReceivePackageComponent)  
}

$(document).ready(()=>{
    ReceivePackageComponent.init();
});
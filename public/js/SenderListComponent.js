'use strict'
//Sender is a Merchant or Seller of products that need to be delivered to customers (receivers)
var SenderListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_senderListComponent');
    this.elFilter_business_type = $('#_sdl_filter_business_type');
    this.elFilter_sender_type = $('#_sdl_filter_sender_type');
    this.elFilter_sender_status = $('#_sdl_filter_sender_status');
    this.elFilter_sales_agent = $('#_sdl_filter_sales_agent');
       
    this.btnNewSender = $('#_sdl_btnNewSender');
    this.elSearch = $('#_sdl_search_sender');
    this.btnSearch = $('#_sdl_btnSearch');
    this.tblSenders = $('#_sdl_tblSenders');
    this.tblSenders_body = $('#_sdl_tblSenders_body');
    this.sender_dropdown_menu = mThis.tblSenders.find('div.dropdown');

    this.btnPrint = $('#_sdl_btnPrint');
    this.btnPDF = $('#_sdl_btnPDF');
    
    this.loadFilterData = (def,onFinish)=>{
        if(!def) {
            def={}
            def.business_type = 0;
            def.sender_type_id =0;
            def.status_code =0;
            def.sales_agent_id = 0;
        }
        post_ajax([mThis.base_url,'/api/getFormData_senderdialog'].join(''),null,function(d){
           if(d){
               d.sender_types = StringSanitizer.sanitizeObject(d.sender_types);
               d.sender_statuses = StringSanitizer.sanitizeObject(d.sender_statuses);
               d.business_types = StringSanitizer.sanitizeObject(d.business_types);
               d.sales_agents = StringSanitizer.sanitizeObject(d.sales_agents);
               d.sales_agents.unshift({'id':'-1','agent_name':'(All)'}); //vendors With / and without referer
               CommonLib.setComboItems(mThis.elFilter_sender_type,d.sender_types,'id','sender_type',true,'(All Merchant Types)',def.sender_type_id);
               CommonLib.setComboItems(mThis.elFilter_sender_status,d.sender_statuses,'status_code','status_name',true,'(All Status)',def.status_code);
               CommonLib.setComboItems(mThis.elFilter_business_type,d.business_types,'business_type','business_type',true,'(All Business Types)',def.business_type);
               CommonLib.setComboItems(mThis.elFilter_sales_agent,d.sales_agents,'id','agent_name',true,'(No referral)',def.sales_agent_id);
               //Sales Agent SELECT BOX on SenderDialog
               CommonLib.setComboItems(SenderDialog.elSalesAgent,d.sales_agents,'id','agent_name',true,'(No referral)',def.sales_agent_id);  
               mThis.form_data = d;
               if (typeof onFinish =='function') mThis.onFinish();
           }
        });
    }

    //get list of price_list names for user to choose and assign price list to mechant
    this.getPriceListItems =(onFinish)=>{
        post_ajax([mThis.base_url,'/api/getComboItems_price_list'].join(''),null,function(items){
            if(typeof items =='string') console.error('getComboItems_price_list() return error ' + items);
                if(items) {
                    if (typeof onFinish =='function') onFinish(items);
                }
        });
   }
    
    this.init = ()=>{
        mThis.loadFilterData();

        mThis.self.find('._sdl_filter_field').on('change',function(e){
           mThis.displaySenderList();
        });

         this.btnNewSender.on('click',function(e){
             SenderDialog.show({'title':'New Merchant'},function(sender){
                 if(sender) {
                    mThis.displaySenderList();
                 }
             });
         });
 
         //##BEGIN:: tblPickups dropdown menu
                mThis.tblSenders.on('click','a.btn_sender_action',function(e) {
                    e.preventDefault();
                    let p = $(this).parent();
                    let x = $(this);
                    
                    let sender_id = x.data('senderid');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let status_code = x.data('statuscode');
                    let sender_code = x.data('sendercode');

                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                    
                    p.append(mThis.createDropdownMenuHtml_sender(sender_id,sender_code,status_code));
                    dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let container = mThis.sender_dropdown_menu.parent(); // div.dropdown or $('#_pmt_stf_dropdown_container')
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            mThis.sender_dropdown_menu.removeClass('show');
                        }
                    }
                });
                
                mThis.tblSenders.on('mouseover','tr',function(e){
                let col_action = $(this).find('td.col_action');
                col_action.find('a.btn_sender_action>i').addClass('action-button-zoomin'); 
                    
                }).on('mouseleave','tr',function(e) {
                    let col_action = $(this).find('td.col_action');
                    col_action.find('a.btn_sender_action>i').removeClass('action-button-zoomin');  
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });
                
        //##END:: tblPickups dropdown menu

                mThis.tblSenders.on('click','a.sender_status_action',function(e){
                    e.preventDefault();
                    let lnk = $(this);
                    let sender_id = lnk.data('senderid'); 
                    let def_status_code = lnk.data('statuscode');
                    mThis.changeSenderStatus(def_status_code,lnk); 
                });
 
                //Set Price List for Merchant
                mThis.tblSenders.on('click','a._sdl_sa_set_price_list',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let sender_id = x.data('senderid');
                    let tr = x.closest('tr');
                    mThis.getPriceListItems((items)=>{
                                     items.unshift({'id':null,'name':'Select price list'});
                                    let option = {'title':'Set Merchant\'s Price List',"dataLabel":"Price list name","valueMember":"id","textMember":"name","blankErrorMessage":"Please a price list","data":items,"defaultValue":null};
                                      InputBox2.show(option,(d)=>{
                                                if(d) {
                                                            let p = {"sender_id":sender_id,"price_list_id":d.value}; 
                                                            post_ajax([mThis.base_url,'/api/setMerchantPriceList'].join(''),p,function(err){
                                                                if(!err || err =='') {
                                                                    tr.find('td.sl-td-price-list').text(d.text); 
                                                                    cv_interact.alert('Price list name is ' + d.text + ' has been assigned to the merchant successfully','','success');
                                                                }else cv_interact.alert(err,'','error'); 
                                                            });
                                                    }
                                      });
                                });
                 
                    });

                //Delete Merchant info
                mThis.tblSenders.on('click','a._sdl_sa_delete',function(e){
                e.preventDefault();
                let x = $(this).parent();
                let sender_id = x.data('senderid');
                let status_code = x.data('statuscode');
                let p = {'sender_id':sender_id,'status_code':status_code};
                cv_interact.confirm('Delete this merchant?','Delete Merchant',function(e){
                    if(e) {
                            post_ajax([mThis.base_url,'/api/deleteSender'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displaySenderList();
                                }else cv_interact.alert(err);
                            });
                       }
                    });
                });

                 //Modify or Edit Merchant Details
                 mThis.tblSenders.on('click','a._sdl_sa_modify',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let sender_id = x.data('senderid');
                    //let status_code = x.data('statuscode');

                    let option = {'sender_id':sender_id,'title':'Modify Merchant Details'};
                      SenderDialog.show(option,(d)=>{
                         if(d) {
                           mThis.displaySenderList();
                         }
                      });
                    
                    });

                //Change sender status
                 mThis.tblSenders.on('click','a._sdl_sa_change_status',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let sender_id = x.data('senderid');
                    let status_code = x.data('statuscode');

                    let option = {'title':'Set Merchant Status',"dataLabel":"Merchant status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":status_code};
                      InputBox2.show(option,(d)=>{
                         if(d) {
                            let p = {"sender_id":sender_id,"status_code":d.value}; 
                            post_ajax([mThis.base_url,'/api/updateSenderStatus'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displaySenderList();
                                }else cv_interact.alert(err,'','error'); 
                            });
                         }
                      });
                    
                    });
                
              //Create Mobile Login 
              mThis.tblSenders.on('click','a._sdl_sa_create_mobile_login',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    //let sender_id = x.data('senderid');
                    //let status_code = x.data('statuscode');
                    let sender_code = x.data('sendercode');
 
                     let option1= {"official_code":sender_code,"user_class":"merchant","goBackFunction":()=>{
                            SenderListComponent.show(SenderListComponent.option);    
                      }};
                      AddUserPanel.show(option1);

                });

          mThis.elSearch.on('keyup',function(e){
              if(e.keyCode ==13) mThis.displaySenderList();
          });     
          
          mThis.btnSearch.on('click',function(){
              mThis.displaySenderList();
          });
    }
    //end::init()

    this.show = (option)=>{
      mThis.option = option;
      mThis.elScreenTitle.html(option.title);
      mThis.displaySenderList(); 
      mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }	  

    this.createDropdownMenuHtml_sender = function(sender_id,sender_code, status_code) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-senderid="',sender_id,'" data-sendercode="',sender_code,'" data-statuscode="',status_code,'">',
        '<a class="dropdown-item _sdl_sa_set_price_list" href="#"><i class="fa fa-list-alt" style="color:green"></i> Set Price List</a>', 
          '<a class="dropdown-item _sdl_sa_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete Merchant</a>',
          '<a class="dropdown-item _sdl_sa_modify" href="#"><i class="fa fa-edit" style="color:green"></i> Modify Merchant Info</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _sdl_sa_change_status" href="#"><i class="fa fa-edit" style="color:blue"></i> Change Merchant Status</a>',
          //'<a class="dropdown-item _sdl_sa_transaction_list" href="#"><i class="fa fa-tasks" style="color:orange"></i> View Transactions</a>',
          //'<a class="dropdown-item _sdl_sa_issue_list" href="#"><i class="fa fa-tasks" style="color:orange"></i> Issue List</a>', 
          '<a class="dropdown-item _sdl_sa_create_mobile_login" href="#"><i class="fa fa-tasks" style="color:orange"></i> Create Mobile Login</a>',
          '</div>'].join('');
          return html;
    };

    this.displaySenderList = function()
    { 
        let p = {};
        p.search_value = mThis.elSearch.val();
        p.sender_type_id = mThis.elFilter_sender_type.val();
        if(!p.sender_type_id) p.sender_type_id = 0;
        if (!p.search_value) p.search_value ='';
        p.business_type = mThis.elFilter_business_type.val();
        p.status = mThis.elFilter_sender_status.val();
        p.sales_agent_id = mThis.elFilter_sales_agent.val();
        //p.sales_agent_id =-1 //vendors with and withut referer
        //p.sales_agent = 0 //vendors without erefers
        //p.sales-agent_id > 0 //vendors with specific refererd (sales agent)
        if(!p.business_type ) p.business_type  ='';
        if (! p.status)  p.status ='';
        
        post_ajax([mThis.base_url, '/api/getSenderList'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            
            if (mThis.table){
                 
                    mThis.tblSenders.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblSenders.empty();
                    //alert('destroyed => '+  mThis.tblSenders.html());
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
                             '<a href="#" data-senderid="',data.id,'" data-statuscode="',data.status_code,'" data-sendercode="',data.code,'" class="btn_sender_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.3em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        data:'code',
                        title:'Merchant ID'
                     },
                    {
                       data:'name',
                       title:'Merchant Name'
                    },
                    {
                        className:'sl-td-price-list',
                        data:'price_list_name',
                        title:'Price List'
                    },
                    {
                        data:'sender_type',
                        title:'Merchant Type'
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
                      data:'business_type',
                      title:'Business Type'
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
                        data:'address',
                        title:'Address'
                    },
                    // {
                    //   data:function(data,a,b){
                    //      return [data.cod_fee_percent?data.cod_fee_percent:0.05,'%'].join('');
                    //   },title:'COD Charge'
                    // },
                    {
                        className:'sender-status',
                        data:function(data,type,meta) {
                            if (!data.status_code || data.status_code =='') data.status_code ='?';
                            return ['<a class="sender_status_action" data-statuscode="',data.status_code,'" data-senderid="',data.sender_id,'" href="#"><span>',data.status_code,'</span></a>'].join('');
                        },
                        title:'Status'
                    }
                    
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblSenders.DataTable({
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
                        "emptyTable": "No merchants found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          $(row).data('senderid',data.sender_id); //sender_id
                         
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

    this.changeSenderStatus = ()=>{
        return;
     }
 
}
//end::SenderListComponent

//begin::SenderDialog
var SenderDialog = new function(){
   let mThis = this;
   this.self = $('#_sdl_dlgSender');
   this.base_url = $('#__base_url').val();
   this.elTitle = $('#_sdl_dlgSenderTitle');
   this.btnSave = $('#_sdl_sender_btnSave');
   this.elSenderType = $('#_sdl_sender_sendertype');
   this.elBusinessType = $('#_sdl_sender_businesstype');
   this.elSalesAgent = $('#_sdl_sales_agent');
   this.onClose = null;
   this.elError = $('#_sdl_sender_error');
   
   this.body = $('#_sdl_dlgSender_body');
   this.sender_panel = $('#_sdl_dlgSender_sender_panel');
   this.prepareData = (def,onFinish)=>{
       if(!def) def = {};
       if (mThis.form_data){
        CommonLib.setComboItems(mThis.elSenderType,mThis.form_data.sender_types,'id','sender_type',true,'(Select Merchant Type)',def.sender_type);
        CommonLib.setComboItems(mThis.elSalesAgent,mThis.form_data.sales_agents,'id','agent_name',true,'(No Referrer)',def.sales_agent_id);
        if(typeof onFinish =='function') onFinish();
        return;
       }
      post_ajax([mThis.base_url,'/api/getFormData_senderdialog'].join(''),null,function(d) {
         if(d){
             d.sender_types = StringSanitizer.sanitizeObject(d.sender_types);
             CommonLib.setComboItems(mThis.elSenderType,d.sender_types,'id','sender_type',true,'(Select Merchant Type)',def.sender_type);
             CommonLib.setComboItems(mThis.elBusinessType,d.business_types,'business_type','business_type',true,'(Select Business Type)',def.business_type);
             mThis.form_data = d;
             if(typeof onFinish =='function') onFinish();
         }
      });

   }

   this.btnSave.on('click',function(e){
      let p = mThis.getData();
      if(!p.name) {
          mThis.elError.html('Merchant name is required!');
          return;
      }
      if(p.sender_type_id<=0 || !p.sender_type_id) {
        mThis.elError.html('Merchant type is not correct!');
        return;
      }

      if(!p.phone_number) {
        mThis.elError.html('Phone number is required!');
        return;
      }
      post_ajax([mThis.base_url,'/api/saveSender'].join(''),p,function(res){
            if(res.status =='OK') {
                mThis.self.modal('hide');
                if (typeof mThis.onClose =='function') mThis.onClose(p);
            } else mThis.elError.text(res.error_message); 
      });
   });
 
   this.show = (option,onClose)=>{
       if(!option) option ={};
       mThis.onClose = onClose;
       mThis.sender_id = option.sender_id;
       mThis.elTitle.html(option.title);

       if (mThis.sender_id > 0) {
          mThis.elTitle.html("Merchant Details");
          let p = {'sender_id':mThis.sender_id};
          post_ajax([mThis.base_url,'/api/getSenderById'].join(''),p,function(d) {
                if(d){
                   let bank_accounts = StringSanitizer.sanitizeObject(d.bank_accounts); 
                   d = StringSanitizer.sanitizeObject(d,'email');
                   mThis.prepareData(d, function(){
                       d.bank_accounts = bank_accounts;
                        mThis.setData(d);
                        mThis.self.modal({
                            backdrop:'static'
                        });       
                   });
                  
                }
          });
       }else {
          mThis.elTitle.html("New Merchant");
                mThis.prepareData(null, function(){
                        mThis.setData(null);
                        mThis.self.modal({
                            backdrop:'static'
                        });       
                });
       }

   }

   this.setData = (d)=>{
          mThis.body.find('.data-input').each(function(){
            $(this).val(null);
          });
       if (!d) return;

       //begin:: Display Merchant's information
         let bank_accounts = d.bank_accounts;
            d.bank_accounts = null;  
            mThis.sender_panel.find('.data-input').each(function(){
                let el =$(this);
                let data_member = el.data('field');
                el.val(d[data_member]);
            });
       //end:: Display Merchant's information

     //begin:: Display bank information

             
        let i=0,c;
            do{
                c = bank_accounts[i];
                if(!c) break;
                let css_class ='primary_bank_panel';
                if (c.is_primary == 0) css_class ='secondary_bank_panel';
                    let div = mThis.body.find(['div.',css_class].join(''));
                    div.find('input.data-input').each(function(e){
                        let el = $(this);
                        let dataMember = el.data('field');
                        el.val(c[dataMember]);
                    });
                i++;
            }while(c); 
       //end:: Display bank information    
   }

   this.getData = ()=>{
        let p = {};
        p.id = mThis.sender_id;
        mThis.sender_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            p[data_member] = el.val();
        });
        p.banks = mThis.getBanks();
        return p;
   }

   //getBanks() returns array of bankinfo {bank_name, account_number, account_name} for data input to save Merchant Profile
   this.getBanks = ()=>{
       let ps = [];
       let div = mThis.body.find('div.primary_bank_panel');
       let p = {};
       p.is_primary =1;
       div.find('input.data-input').each(function(){
           let el = $(this);
           let dataMember = el.data('field');
           p[dataMember] = el.val();
       });
       ps.push(p);

       div = mThis.body.find('div.secondary_bank_panel');
       let p1 = {};
       p1.is_primary =0;
       div.find('input.data-input').each(function(){
           let el = $(this);
           let dataMember = el.data('field');
           p1[dataMember] = el.val();
       });
       ps.push(p1);
       return ps; 
   }
} 
//end::SenderDialog

$(document).ready(function() {
    SenderListComponent.init();
});
'use strict'
var SalesAgentsComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_saleAgentsComponent');
    //this.elFilter_business_type = $('#_sal_filter_business_type');
    this.elFilter_agent_type = $('#_sal_filter_agent_type');
    this.elFilter_agent_status = $('#_sal_filter_agent_status');
    
    this.btnNewSalesAgent = $('#_sal_btnNewSalesAgent');
    this.elSearch = $('#_sal_search_agent');
    this.btnSearch = $('#_sal_btnSearch');
    this.tblSalesAgents = $('#_sal_tblSalesAgents');
    this.tblSalesAgents_body = $('#_sal_tblSalesAgents_body');
    this.salesagent_dropdown_menu = mThis.tblSalesAgents.find('div.dropdown');

    this.loadFilterData = (def)=>{
        if(!def) {
            def={}
            def.agent_type_id =1;
            def.status_code ='Active';
        }
       
        post_ajax([mThis.base_url,'/api/getFormData_salesAgent'].join(''),null,function(d){
           if(d){
               d.agent_types = StringSanitizer.sanitizeObject(d.agent_types);
               d.statuses = StringSanitizer.sanitizeObject(d.statuses);
            
               CommonLib.setComboItems(mThis.elFilter_agent_type,d.agent_types,'id','agent_type',true,'(All Types)',def.agent_type_id);
               CommonLib.setComboItems(mThis.elFilter_agent_status,d.statuses,'status_code','status_name',true,'(All Status)',def.status_code);
               //CommonLib.setComboItems(mThis.elFilter_business_type,d.business_types,'business_type','business_type',true,'(All Business Types)',def.business_type);
               mThis.form_data = d;
           }
        });
    }

    this.init = ()=>{
        mThis.loadFilterData();
        mThis.self.find('._sal_filter_field').on('change',function(e){
           mThis.displayAgentList();
        });

         this.btnNewSalesAgent.on('click',function(e){
             SalesAgentDialog.show({'title':'New Sales Agent'},function(sender){
                 if(sender) {
                    mThis.displayAgentList();
                    SenderListComponent.loadFilterData();
                 }
             });
         });
 
         //##BEGIN:: tblSalesAgents dropdown menu
                mThis.tblSalesAgents.on('click','a.btn_salesagent_action',function(e) {
                    e.preventDefault();
                    let p = $(this).parent();
                    let x = $(this);
                    
                    let agent_id = x.data('agentid');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
                    let status_code = x.data('statuscode');
                    let sender_code = x.data('agentcode');

                    let dropdownMenu = p.find('.dropdown-menu');
                    if (!dropdownMenu || dropdownMenu.length <= 0) {
                    
                    p.append(mThis.createDropdownMenuHtml_salesagent(agent_id,sender_code,status_code));
                    dropdownMenu = p.find('.dropdown-menu');
                    }
                    //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                    if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

                    dropdownMenu.toggleClass('show');
                    if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

                });

                $(document).on('click',function(e){
                    //e.preventDefault();
                    let container = mThis.salesagent_dropdown_menu.parent(); // div.dropdown or $('#_pmt_stf_dropdown_container')
                    if(container){
                        if (!container.is(e.target) && container.has(e.target).length === 0) {
                            mThis.salesagent_dropdown_menu.removeClass('show');
                        }
                    }
                });
                
                mThis.tblSalesAgents.on('mouseover','tr',function(e){
                let col_action = $(this).find('td.col_action');
                col_action.find('a.btn_salesagent_action>i').addClass('action-button-zoomin'); 
                    
                }).on('mouseleave','tr',function(e) {
                    let col_action = $(this).find('td.col_action');
                    col_action.find('a.btn_salesagent_action>i').removeClass('action-button-zoomin');  
                    col_action.find('div.dropdown-menu').removeClass('show');  
                });
                
        //##END:: tblSalesAgents dropdown menu

                mThis.tblSalesAgents.on('click','a._sal_sa_change_status',function(e){
                    e.preventDefault();
                    let lnk = $(this);
                    let agent_id = lnk.data('agentid'); 
                    let def_status_code = lnk.data('statuscode');
                    mThis.changeAgentStatus(def_status_code,lnk); 
                });


                //Delete Merchant info
                mThis.tblSalesAgents.on('click','a._sal_sa_delete',function(e){
                
                let x = $(this).parent();
                let agent_id = x.data('agentid');
                let status_code = x.data('statuscode');
                let p = {'agent_id':agent_id,'status_code':status_code};
                cv_interact.confirm('Delete this sales agent?','Delete Sales Agent',function(e){
                    if(e) {
                            post_ajax([mThis.base_url,'/api/deleteSalesAgent'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displayAgentList();
                                }else cv_interact.alert(err);
                            });
                       }
                    },'Delete','Close');
                });

                 //Modify or Edit Agent Details
                 mThis.tblSalesAgents.on('click','a._sal_sa_modify',function(e){
                        e.preventDefault();
                        let x = $(this).parent();
                        let agent_id = x.data('agentid');
                        //let status_code = x.data('statuscode');

                        let option = {'agent_id':agent_id,'title':'Modify Agent Details'};
                        SalesAgentDialog.show(option,(d)=>{
                            if(d) {
                            mThis.displayAgentList();
                            }
                        });
                    
                    });

                //Change Sales Agent status
                 mThis.tblSalesAgents.on('click','a._sal_sa_change_status',function(e){
                    e.preventDefault();
                    let x = $(this).parent();
                    let agent_id = x.data('agentid');
                    let status_code = x.data('statuscode');

                    let option = {'title':'Set Agent Status',"dataLabel":"Agent status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":status_code};
                      InputBox2.show(option,(d)=>{
                         if(d) {
                            let p = {"agent_id":agent_id,"status_code":d.value}; 
                            post_ajax([mThis.base_url,'/api/updateSalesAgentStatus'].join(''),p,function(err){
                                if(!err || err =='') {
                                    mThis.displayAgentList();
                                }else cv_interact.alert(err,'','error'); 
                            });
                         }
                      });
                    });
                
            //   //Create Mobile Login 
            //   mThis.tblSalesAgents.on('click','a._sal_sa_create_mobile_login',function(e){
            //         e.preventDefault();
            //         let x = $(this).parent();
            //         //let agent_id = x.data('agentid');
            //         //let status_code = x.data('statuscode');
            //         let sender_code = x.data('agentcode');
 
            //          let option1= {"official_code":sender_code,"user_class":"sales agent","goBackFunction":()=>{
            //                 SenderListComponent.show(SenderListComponent.option);    
            //           }};
            //           AddUserPanel.show(option1);

            //     });

          mThis.elSearch.on('keyup',function(e){
              if(e.keyCode ==13) mThis.displayAgentList();
          });     
          
          mThis.btnSearch.on('click',function(){
              mThis.displayAgentList();
          });
    }
    //end::init()

    this.show = (option)=>{
      mThis.option = option;
      mThis.elScreenTitle.html(option.title);
      mThis.displayAgentList(); 
      mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }	  

    this.createDropdownMenuHtml_salesagent = function(agent_id,agent_code, status_code) {
        //cla = 'class_list_action' = > cla_delete, cla_modify,...
        let html = ['<div class="dropdown-menu" data-agentid="',agent_id,'" data-agentcode ="',agent_code,'" data-statuscode="',status_code,'">',
          '<a class="dropdown-item _sal_sa_delete" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete Sales Agent</a>',
          '<a class="dropdown-item _sal_sa_modify" href="javascript:void(0)"><i class="fa fa-edit" style="color:green"></i> Modify Agent Details</a>',
          '<div class="dropdown-divider"></div>',
          '<a class="dropdown-item _sal_sa_change_status" href="#"><i class="fa fa-edit" style="color:blue"></i> Change Agent Status</a>',
          //'<a class="dropdown-item _sdl_sa_transaction_list" href="#"><i class="fa fa-tasks" style="color:orange"></i> View Transactions</a>',
          //'<a class="dropdown-item _sdl_sa_issue_list" href="#"><i class="fa fa-tasks" style="color:orange"></i> Issue List</a>', 
          //'<a class="dropdown-item _sdl_sa_create_mobile_login" href="#"><i class="fa fa-tasks" style="color:orange"></i> Create Mobile Login</a>',
          '</div>'].join('');
          return html;
    };

    this.displayAgentList = function()
    { 
        let p = {};
        p.search_value = mThis.elSearch.val();
        p.agent_type_id = mThis.elFilter_agent_type.val();
        if(!p.agent_type) p.agent_type = '';
        if (!p.search_value) p.search_value ='';
        p.status = mThis.elFilter_agent_status.val();
        if (! p.status)  p.status ='';
        post_ajax([mThis.base_url, '/api/getSalesAgentList'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            
            if (mThis.table){
                 
                    mThis.tblSalesAgents.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblSalesAgents.empty();
                    //alert('destroyed => '+  mThis.tblSalesAgents.html());
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
                             '<a href="#" data-agentid="',data.id,'" data-statuscode="',data.status_code,'" data-agentcode="',data.code,'" class="btn_salesagent_action" aria-haspopup="true" aria-expanded="false">',
                             '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.3em"></i>',
                             //' Action',
                             '</a>',
                            '</div>'].join('');
                            return html;
                       
                        } 
                    },
                    {
                        data:'code',
                        title:'Agent ID'
                     },
                    {
                       data:'name',
                       title:'Agent Name'
                    },
                    {
                        data:'agent_type',
                        title:'Agent Type'
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
                            return ['<a class="salesagent_status_action" data-statuscode="',data.status_code,'" data-agentid="',data.agent_id,'" href="javascript:void(0);"><span>',data.status_code,'</span></a>'].join('');
                        },
                        title:'Status'
                    }
                ];
                 
            if (!mThis.table)
            mThis.table = mThis.tblSalesAgents.DataTable({
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
                        "emptyTable": "No sales agents found"
                    },
                    data:data,
                    columns:my_columns 
                ,"createdRow": function(row, data, dataIndex)
                      {
                          $(row).data('agentid',data.agent_id); //agent_id
                         
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

    this.changeAgentStatus = ()=>{
        return;
     }
 
}
//end::SalesAgentsComponent

//begin::SalesAgentDialog
var SalesAgentDialog = new function(){
   let mThis = this;
   this.self = $('#_sal_dlgSalesAgent');
   this.base_url = $('#__base_url').val();
   this.elTitle = $('#_sal_dlgSalesAgentTitle');
   this.elAgentType = $('#_sal_agent_type');
   this.onClose = null;
   this.elError = $('#_sal_agent_error');
   
   this.body = $('#_sal_dlgSalesAgent_body');
   this.agent_fields_panel = $('#_sal_dlgSalesAgent_fields');
   this.btnSave = $('#_sal_dlgSalesAgent_btnSave');

   this.prepareData = (def,onFinish)=>{
       if(!def) def = {};
       if (mThis.form_data){
        CommonLib.setComboItems(mThis.elAgentType,mThis.form_data.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
        if(typeof onFinish =='function') onFinish();
        return;
       }
      post_ajax([mThis.base_url,'/api/getFormData_salesAgent'].join(''),null,function(d) {
         if(d){
             d.agent_types = StringSanitizer.sanitizeObject(d.agent_types);
             CommonLib.setComboItems(mThis.elAgentType,d.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
             mThis.form_data = d;
             if(typeof onFinish =='function') onFinish();
         }
      });
   }

   this.btnSave.on('click',function(e){
      let p = mThis.getData();
      if(!p.name) {
          mThis.elError.html('Agent name is required!');
          return;
      }
    //   if(p.agent_type) {
    //     mThis.elError.html('Agent type is not correct!');
    //     return;
    //   }

      if(!p.phone_number) {
        mThis.elError.html('Phone number is required!');
        return;
      }
      post_ajax([mThis.base_url,'/api/saveSalesAgent'].join(''),p,function(res){
         
            if(res.status =='OK') {
                mThis.self.modal('hide');
                if (typeof mThis.onClose =='function') mThis.onClose(p);
            } else mThis.elError.text(res.error_message); 
      });
   });

   this.show = (option,onClose)=>{
       if(!option) option ={};

       mThis.elError.html(null);
       mThis.onClose = onClose;
       mThis.agent_id = option.agent_id;
       mThis.elTitle.html(option.title);

       if (mThis.agent_id > 0) {
          mThis.elTitle.html("Sales Agent Details");
          let p = {'agent_id':mThis.agent_id};
          post_ajax([mThis.base_url,'/api/getSalesAgentById'].join(''),p,function(d) {
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
          mThis.elTitle.html("New Sales Agent");
                mThis.prepareData(null, function(){
                        mThis.setData(null);
                        mThis.self.modal({
                            backdrop:'static'
                        });       
                });
       }

   }

   this.setData = (d)=>{
       mThis.agent_id = null;
          mThis.body.find('.data-input').each(function(){
            $(this).val(null);
          });
        if(!d) return;
        mThis.agent_id = d.id;
       //begin:: Display Sales Agent's information
            mThis.agent_fields_panel.find('.data-input').each(function(){
                let el =$(this);
                let data_member = el.data('field');
                el.val(d[data_member]);
            });
       //end:: Display Sales Agent's information    
   }

   this.getData = ()=>{
        let p = {};
        p.agent_id = mThis.agent_id;
        mThis.agent_fields_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            p[data_member] = el.val();
        });
        p.agent_id = mThis.agent_id; //used for editing or upating
        return p;
   }
    
} 
//end::SalesAgentDialog

$(document).ready(function() {
    SalesAgentsComponent.init();
});
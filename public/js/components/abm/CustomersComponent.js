'use strict';
var CustomersComponent = new function(){
    const mThis = this;
    this.title_prop ="Customers";
  
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customersComponent');
    this.elFilter_customer_type = this.self[0].querySelector('#_cul_filter_customer_type');
    this.elFilter_customer_status = this.self[0].querySelector ('#_cul_filter_customer_status');
    
    this.btnNewCustomer = this.self.find('#_cul_btnNew');
    this.elSearch = this.self.find('#_cul_search_agent');
    this.btnSearch = this.self.find('#_cul_btnSearch');
    this.btnPrint = this.self.find('#_cul_btnPrint');
         
    this.div_filter_fields = this.self[0].querySelector('#_cul_filter_fields');
    this.form_data= {};
    this.store_agents = {};
 
   this.cols = [

    {
        title: " CUSTOMER ID",
        className: "align-middle text-danger text-nowrap",
        data: (data, index,tr) =>{
            return (data.code ?? 'គ្មាន');
        }
    },
    {
        title: "NAME",
        className: "align-middle text-capitalize text-nowrap",
        data:"name"
    },
    {
        title: "EMAIL",
        className: "align-middle text-capitalize",
        data: (data,index,tr)=>{
            return ['<div class="d-flex" ><i class="fas mt-2 text-success fa-envelope"></i><span class="d-block p-1">',(data.email ?? 'គ្មាន'),'</span></div>','<div class="d-flex"><i class="fas text-warning fa-phone mt-2"></i><span class="d-block p-1 text-primary">',data.phone_number,'</span></div>'].join('');
        }
    },

    {
        title: " Customer Type",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) => {
            return (data.sender_type ?? 'គ្មាន');
        }
    },

    {
        title: "Business",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{
           return ['<span class="d-block text-nowrap">',(data.business_type ?? 'NA'),'</span>'].join('');
        }  
    },
    {
        title: "Price List",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{

            return ['<span>',(data.price_list_name ?? 'N/A'),'</span>'].join('');

        }  
    },
    {
        title: "Create By",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{
            return ['<span class="d-block p-1 text-danger" >',data.create_user,'</span>','<span class="d-block p-1">',data.created_at,'</span>'].join('');
        }
    },
    {
        title: "Status",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          const status_class = (data.status_code || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-warning text-warning text-center';  
          return ['<a href="javascript:void(0)" class="d-block lnk-agent-status" data-id ="',data.id,'" data-status="',data.status_code,'"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status_class,'">',data.status_code,'</span></a>'].join(''); 
        }
    },
    
    {
        title: "Action",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          return ['<div class="d-flex gap-2">',
          //'<a href="javascript:void(0)" class="btn-customer-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-customer-edit" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-edit text-primary fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-customer-login" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-user text-primary fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-customer-delete" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-trash-can text-danger fs-5"></i></a>',
          '</div>'].join(''); 
        }
    }
  ];

    this.loadFilterData = (def = {},onFinish)=>{
        if(!def) {
            def={}
            def.agent_type_id =1;
            def.status_code ='Active';
        }
       
        vsapi.call([mThis.base_url,'/abm/customers/form-options'].join(''),{'id':null},null,main_view.apiCluster).then(res => {
                let d = res.status_code ===200?  StringSanitizer.sanitizeObject(res.data) : {};  
                //VSUtil.setComboItems(mThis.elFilter_customer_type,d.sender_types,'id','sender_type',true,'(All Sender)',def.sender_type_id);
                //VSUtil.setComboItems(mThis.elFilter_customer_status,d.statuses,'status_code','status_name',true,'(All Status)',def.status_code);
                onFinish();
        });
    }

    this.init = ()=>{
        if(mThis.initAlready ) return;
        mThis.customerListView = new ListView('_cul_customer_list',{
            'fetchApi':`${main_view.base_url}/abm/customers/list`,
            'columns': mThis.cols,
            apiCluster:main_view.apiCluster,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
                mThis.store_agents[data.id] = {
                    code: data.code,
                    name: data.name,
                    user_id: data.user_id,
                    phone_number: data.phone_number
                };
            },
            'beforeRender':()=>{}
        });

        mThis.tblCustomers = mThis.customerListView.getTable();
 
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=> {
            el.addEventListener('change',e=>{
              e.preventDefault();
              if(!mThis.filter_disabled){
                 mThis.customerListView.showPage(mThis.getFilterData());
              }
            });
        }); 
        
       

        mThis.tblCustomers.querySelector('tbody').addEventListener('click', e=> {
            e.preventDefault();

              //Click on Change Status
              let lnk = VSUtil.closestLimited(e.target,'.lnk-customer-status');
              if(lnk){
                  let agent_id = lnk.dataset.id;
                  let status_code = Validator.properCase(lnk.dataset.status);
                  let option = {
                      confirmButtonText:'OK',
                      title: 'Set Customer Status',
                      dataLabel: "Status",
                      valueMember: "status_code",
                      textMember: "status_code",
                      blankErrorMessage: "Please select a correct status",
                      //data: [],
                      defaultValue: status_code,
                      autoClose:true
                  };
                  
                  this.getLeadStatuses().then(statuses => {
                      option.data = statuses;
                      InputBox2.show(option,(d)=>{
                          if(d) {
                              let p = {
                                  id: agent_id,
                                  status_code: d.value
                              };
                              vsapi.call(`${mThis.base_url}/abm/customers/update-status`,p).then(res => {
                                  if(res.status_code === 200){
                                      mThis.elFilter_agent_status.value =  d.value;
                                      mThis.elFilter_agent_status.dispatchEvent(new Event('change'));
                                      //mThis.elFilter_sender_status.dispatchEvent(new Event('change'));
                                      const new_status = res.data? `to ${res.data.new_status}`: null;
                                      cv_interact.info([`Customer status has been changed `,d.new_status].join(''));
                                      //InputBox2.self.modal('hide');
                                  }
                                  else
                                      cv_interact.error(res.error_message); 
                              });
                          }
                      });
                  });
                  return;
              }

            //Click on Edit
            let btn = VSUtil.getElementByClass(e.target,'btn-customer-edit');
            if(btn){
                let agent_id = btn.dataset.id;
                let op = {
                    id:agent_id,
                    onClose: d => {
                        mThis.agentListView.showPage(mThis.getFilterData());
                    }
                };
                CustomerDialog.show(op);
                return;
            }
 
            //Click on Modify Login "btn-customer-login"
            btn = VSUtil.closestLimited(e.target,'.btn-customer-login');
            if(btn){
                    
                    const agent = mThis.store_agents[btn.dataset.id] || {};
                    const op = {
                        user_id: agent.user_id,
                        open: 'add-user',
                        default: {
                            official_code: agent.code,
                            user_class: "abm_customer",
                            phone_number: agent.phone_number,
                            full_name: agent.name
                        },
                        onClose: () => {
                            if(mThis.agentListView.current_page > 1) mThis.elSearch.val(agent.phone_number);
                            mThis.agentListView.showPage(mThis.getFilterData());
                        }
                    };
                    if(!AuthManager.allowed(100)) return;
                    AddUserDialog.show(op);
                return;
            }

            //Click on Delete
            btn = VSUtil.closestLimited(e.target,'.btn-customer-delete');
            if(btn){

                let agent_id = btn.dataset.id;
                let status_code = btn.dataset.status;
                let p = {'id':agent_id,'status_code':status_code};
                cv_interact.confirm('Delete this customer?',{title:'Delete Customer',context:'delete'},function(e){
                    if(e){
                        vsapi.call([mThis.base_url,'/abm/customers/delete'].join(''),p,btn,false).then(res=>{
                            if(res.status_code===200) {
                                mThis.agentListView.showPage(mThis.getFilterData());
                            }
                            else cv_interact.error(res.error_message);
                        });
                    }
                });
                return;
            }

             //Click on Change Status
             btn = VSUtil.getElementByClass(e.target,'btn-customer-status');
             if(btn){
                let agent_id = btn.dataset.id; 
                let def_status_code = btn.dataset.status;
                mThis.changeAgentStatus(agent_id,def_status_code); 
                 return;
             }
        });
       
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.customerListView.showPage(mThis.getFilterData());
            }
        });

        mThis.btnNewCustomer.on('click',function(e){
            e.preventDefault();
            let op = {
                'id':null,
                'onClose':(d)=>{
                    mThis.customerListView.showPage(mThis.getFilterData());
                }
            }
            CustomerDialog.show(op);

            
        });

        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.customerListView.showPage(mThis.getFilterData());
            },250);
        });     
        
        mThis.btnSearch.on('click',function(){
            mThis.customerListView.showPage(mThis.getFilterData());
        });
       mThis.initAlready = true;
    }
    //END: CustomerComponent.init() 

    this.changeAgentStatus = (agent_id, def_status_code)=>{
        //alert('Change agent commission here');
        return;
    }

    this.getFilterData = ()=>{
        let p = {};
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
         let f = el.dataset.field;
          p[f] = el.value;
       });
       p.search_value = mThis.elSearch.val();
       return p; 
    }

    this.getLeadStatuses = () => {
        if(mThis.form_data.statuses){
            return new Promise((resolve) =>{
                resolve( mThis.form_data.statuses);
            });
        }

        return new Promise((resolve, reject) => {
            vsapi.call(`${main_view.base_url}/abm/settings/options-customer-status`, null, false).then(res => {
               if(res.status_code == 200){
                 mThis.form_data.statuses = res.data;
                 resolve(mThis.form_data.statuses);
               }else{
                cv_interact.error(res.error_message);
               }
            }).catch(error => {
                cv_interact.error('Failed to load status options');
                reject(error); // Reject with the error
            });
        });
    }

    this.show = (options = {})=>{
        mThis.init() ; // NOTE: init once only based on mThis.initAlready = true or false

        if(!options ) options = {};
        mThis.options = options;
        mThis.loadFilterData({},()=>{
            mThis.customerListView.showPage(mThis.getFilterData());
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop);
            mThis.self.hide().fadeIn(250);
        });

       
    }
      
};
 
const CustomerDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.children('#_cul_dlgCustomer');
    this.base_url =main_view.base_url;
    this.elTitle = this.self[0].querySelector('#_cul_dlgCustomerTitle');

    //this.elAgentType = this.self[0].querySelector('#_cul_agent_type');
    this.onClose = null;
    this.body =  this.self.find('.modal-body')[0];

    this.body = this.self[0].querySelector('#_cul_dlgCustomer_body');
    this.btnSave = this.self[0].querySelector('#_cul_dlgCustomer_btnSave');
 
    this.options = {};

    
  

    this.show = (options)=>{
        console.log(options);
        mThis.options = options || {};
        mThis.elTitle.innerHTML = options.title;
        if (mThis.options.id > 0) {
            // mThis.elTitle.innerHTML = "Customer Details";
            // let p = {'id':mThis.options.id};
            // vsapi.call([main_view.base_url,'/abm//customers/details'].join(''),p,null).then(res=>{
            //     if(res.status_code === 200){
            //         let d = res.data;
            //        d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
            //         mThis.prepareData(d, () => {
            //             mThis.setData(d);
            //             mThis.self.modal({
            //                 backdrop:'static'
            //             });
            //         });
            //     }
            // });
        }
        else{
            mThis.elTitle.innerHTML =  "New Customer";
           // mThis.prepareData({'agent_type_id':1}, ()=>{
                mThis.setData(null);
                mThis.self.modal({
                    backdrop:'static'
                });       
           // });
        }
    }

    // this.setData = (d)=>{
    //     d = d || {};
    //     mThis.body.querySelectorAll('.data-input').forEach(el =>{
    //         const f = el.dataset.field;
    //         el.value = d[f] ?? '';
    //         if(el.tagName ==='SELECT'){
    //              el.dispatchEvent(new Event('change'));
    //         }else if(el.tagName ==='IMG'){
    //             el.setAttribute('src',d[f] || '');
    //         }
    //     });
    //     mThis.imgBox.setImage(d.photo || d.image_url);
    //     //mThis.divLoginInfo.style.display = d.name ? 'none':'block';
    // }

    // this.getData = ()=>{
    //     let p = {};
    //     p.id = mThis.options.id;
    //     mThis.agent_fields_panel.querySelectorAll('.data-input').forEach(el =>{
    //         const f = el.dataset.field;
    //        if(el.tagName ==='IMG') p[f] = el.getAttribute('src');
    //        else p[f] = el.value;
    //     });
    //     return p;
    // }
}
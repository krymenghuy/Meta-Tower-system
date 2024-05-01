'use strict';
var CustomersComponent = new function(){
    const mThis = this;
    this.title_prop ="Customers";
  
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customersComponent');
    this.elFilter_customer_type = this.self[0].querySelector('#_cul_filter_customer_type');
    this.elFilter_customer_status = this.self[0].querySelector ('#_cul_filter_customer_status');
    
    this.btnNewCustomer = this.self.find('#_cul_btnNew');
    this.elSearch = this.self.find('#_cul_search_customer');
    this.btnSearch = this.self.find('#_cul_btnSearch');
    this.btnPrint = this.self.find('#_cul_btnPrint');
         
    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
    this.form_data= {};
    this.store_agents = {};
 
   this.cols = [
    {
        className: "",
        data: (data,index,tr)=>{
            return "";
        },
        // title: mThis.trans('Sender ID')
        title: ' '
    },
    {
        title: "Photo",
        className: ' align-middle',
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },

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
            return ['<div class="d-flex p-1" ><i class="fas mt-2 text-success fa-envelope"></i><span class="d-block p-1">',(data.email || 'គ្មាន'),'</span></div>','<div class="d-flex p-1"><i class="fas text-warning fa-phone mt-2"></i><span class="d-block p-1 text-primary">',data.phone_number,'</span></div>'].join('');
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
          return ['<a href="javascript:void(0)" class="d-block lnk-customer-status" data-id ="',data.id,'" data-status="',data.status_code,'"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status_class,'">',data.status_code,'</span></a>'].join(''); 
        }
    },
    
    {
        title: "Action",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          return ['<div class="d-flex gap-2">',
          //'<a href="javascript:void(0)" class="btn-customer-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-customer-edit" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-edit text-primary fs-5"></i></a>',
          //'<a href="javascript:void(0)" class="btn-customer-login" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-user text-primary fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-customer-delete" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-trash-can text-danger fs-5"></i></a>',
          '</div>'].join(''); 
        }
    }
  ];

    this.loadFilterData = (def = {},onFinish)=>{
        if(!def) {
            def={}
            def.sender_types_id =1;
            def.status_code ='Active';
        }
       
        vsapi.call([mThis.base_url,'/abm/customers/form-options'].join(''),{'id':null},null,main_view.apiCluster).then(res => {
                let d = res.status_code ===200?  StringSanitizer.sanitizeObject(res.data) : {};  
                VSUtil.setComboItems(mThis.elFilter_customer_status,d.customer_statuses,'status_code','status_name',true,'(All Status)',def.status_code);
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

        
        this.sh_container = mThis.customerListView.getListContainer();
        // mThis.setEvents($(mThis.container));
        // console.log(mThis.container.parentElement); 
        const sh_parent = mThis.sh_container.parentElement;
            sh_parent.style.height = (window.innerHeight - 190)+'px';
            sh_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                sh_parent.style.height = (window.innerHeight - 190)+'px';
        }
 
        // mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=> {
        //     el.addEventListener('change',e=>{
        //       e.preventDefault();
        //       if(!mThis.filter_disabled){
        //          mThis.customerListView.showPage(mThis.getFilterData());
        //       }
        //     });
        // }); 
        
        mThis.tblCustomers.querySelector('tbody').addEventListener('click', e=> {
            e.preventDefault();

        //       //Click on Change Status
        //       let lnk = VSUtil.closestLimited(e.target,'.lnk-customer-status');
        //       if(lnk){
        //           let agent_id = lnk.dataset.id;
        //           let status_code = Validator.properCase(lnk.dataset.status);
        //           let option = {
        //               confirmButtonText:'OK',
        //               title: 'Set Customer Status',
        //               dataLabel: "Status",
        //               valueMember: "status_code",
        //               textMember: "status_code",
        //               blankErrorMessage: "Please select a correct status",
        //               //data: [],
        //               defaultValue: status_code,
        //               autoClose:true
        //           };
                  
        //           this.getLeadStatuses().then(statuses => {
        //               option.data = statuses;
        //               InputBox2.show(option,(d)=>{
        //                   if(d) {
        //                       let p = {
        //                           id: agent_id,
        //                           status_code: d.value
        //                       };
        //                       vsapi.call(`${mThis.base_url}/abm/customers/update-status`,p).then(res => {
        //                           if(res.status_code === 200){
        //                               mThis.elFilter_agent_status.value =  d.value;
        //                               mThis.elFilter_agent_status.dispatchEvent(new Event('change'));
        //                               //mThis.elFilter_sender_status.dispatchEvent(new Event('change'));
        //                               const new_status = res.data? `to ${res.data.new_status}`: null;
        //                               cv_interact.info([`Customer status has been changed `,d.new_status].join(''));
        //                               //InputBox2.self.modal('hide');
        //                           }
        //                           else
        //                               cv_interact.error(res.error_message); 
        //                       });
        //                   }
        //               });
        //           });
        //           return;
        //       }

        //     //Click on Edit
            let btn = VSUtil.getElementByClass(e.target,'btn-customer-edit');
            if(btn){
                // let agent_id = btn.dataset.id;
                let op = {
                    id:btn.dataset.id,
                    onClose: d => {
                        mThis.agentListView.showPage(mThis.getFilterData());
                    }
                };
                CustomerDialog.show(op);
                return;
            }
 
        //     //Click on Modify Login "btn-customer-login"
        //     btn = VSUtil.closestLimited(e.target,'.btn-customer-login');
        //     if(btn){
                    
        //             const agent = mThis.store_agents[btn.dataset.id] || {};
        //             const op = {
        //                 user_id: agent.user_id,
        //                 open: 'add-user',
        //                 default: {
        //                     official_code: agent.code,
        //                     user_class: "abm_customer",
        //                     phone_number: agent.phone_number,
        //                     full_name: agent.name
        //                 },
        //                 onClose: () => {
        //                     if(mThis.agentListView.current_page > 1) mThis.elSearch.val(agent.phone_number);
        //                     mThis.agentListView.showPage(mThis.getFilterData());
        //                 }
        //             };
        //             if(!AuthManager.allowed(100)) return;
        //             AddUserDialog.show(op);
        //         return;
        //     }

        //     //Click on Delete
        //     btn = VSUtil.closestLimited(e.target,'.btn-customer-delete');
        //     if(btn){

        //         let agent_id = btn.dataset.id;
        //         let status_code = btn.dataset.status;
        //         let p = {'id':agent_id,'status_code':status_code};
        //         cv_interact.confirm('Delete this customer?',{title:'Delete Customer',context:'delete'},function(e){
        //             if(e){
        //                 vsapi.call([mThis.base_url,'/abm/customers/delete'].join(''),p,btn,false).then(res=>{
        //                     if(res.status_code===200) {
        //                         mThis.agentListView.showPage(mThis.getFilterData());
        //                     }
        //                     else cv_interact.error(res.error_message);
        //                 });
        //             }
        //         });
        //         return;
        //     }

        //      //Click on Change Status
        //      btn = VSUtil.getElementByClass(e.target,'btn-customer-status');
        //      if(btn){
        //         let agent_id = btn.dataset.id; 
        //         let def_status_code = btn.dataset.status;
        //         mThis.changeAgentStatus(agent_id,def_status_code); 
        //          return;
        //      }
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

    // this.changeAgentStatus = (agent_id, def_status_code)=>{
    //     //alert('Change agent commission here');
    //     return;
    // }

    this.getFilterData = ()=>{
        let p = {};
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
         let f = el.dataset.field;
          p[f] = el.value;
       });
       p.search_value = mThis.elSearch.val();
       return p; 
    }

    // this.getLeadStatuses = () => {
    //     if(mThis.form_data.statuses){
    //         return new Promise((resolve) =>{
    //             resolve( mThis.form_data.statuses);
    //         });
    //     }

    //     return new Promise((resolve, reject) => {
    //         vsapi.call(`${main_view.base_url}/abm/customers/form-options`, null, false).then(res => {
    //            if(res.status_code == 200){
    //              mThis.form_data.statuses = res.data;
    //              resolve(mThis.form_data.statuses);
    //            }else{
    //             cv_interact.error(res.error_message);
    //            }
    //         }).catch(error => {
    //             cv_interact.error('Failed to load status options');
    //             reject(error); // Reject with the error
    //         });
    //     });
    // }

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
    this.self = main_view.appContent.find('#CustomerDialog');
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.find('#_cul_dlgCustomerTitle');
    this.btnSave =  this.self.find('#_cul_dlgCustomer_btnSave');
    this.elBusinessType =  this.self.find('#_cul_business_type');
    this.elSalesAgent =  this.self.find('#_cul_sales_agent');
    this.elPriceList =  this.self.find('#_cul_price_list');
    this.elCustomerType = this.self.find('#_cul_sender_type') ;
    this.onClose = null;
    this.body =  this.self.find('.modal-body')[0];
    this.div_sender_info =  this.body.querySelector('#_cul_dlgCustomer_body');
  
    
    // this.body = this.self.find('.modal-body')[0];
  
    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/abm/customers/form-options`,{id: id },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
            // VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No Sales Agent)', def.sales_agent_id);
            VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'price_list', true, '(Price List)', def.price_list_id);
            VSUtil.setComboItems(mThis.elCustomerType,d.sender_types,'id','sender_type',true,'(Customer Type)',def.sender_type_id);
            console.log(d);

            mThis.form_data = d;
            onFinish(d);
        });
    }

    this.btnSave.on('click', function(e){
        e.preventDefault();
        let p = mThis.getData();
        console.log(p);
        vsapi.call(`${mThis.base_url}/abm/customers/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

            }
            else
                cv_interact.error(res.error_message);
        });
        
     });
      this.setData = (d) => {
        d = d || {};
        console.log(d);
        // mThis.body.querySelectorAll('.data-input').forEach(el =>{
        //     el.value = null;
        // });
        mThis.div_sender_info.querySelectorAll('.data-input').forEach(el =>{ 
            const data_member = el.dataset.field;
            if(el.tagName.toLowerCase() === 'select'){

                el.value = d[data_member];
                let event = new Event('change',{
                    bubbles: true,
                    cancelable: true
                });
                el.dispatchEvent(event);
            }
            else{
                el.value = d[data_member]?? '';
            }
        });
  
       
    }
    

    this.getData = () => {
        let p = {};
        p.id = mThis.options.id;
        mThis.self[0].querySelectorAll('.data-input').forEach(el=>{
            let f = el.dataset.field;
            
            p [f] = el.value;
        });
        
        
        return p;
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
       // console.log('grth');
         
        mThis.prepareData(mThis.options.id,{},data => {
            if(data.sender){
                
                mThis.elTitle.text("Modify Customer");
            }
            else{
                mThis.elTitle.text("Create Customer");
            }
// console.log(data.customer);
            mThis.setData(data.sender);

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }

  

  
}
 

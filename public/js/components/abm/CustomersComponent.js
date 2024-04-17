'use strict';
var CustomersComponent = new function(){
    let mThis = this;
    this.title_prop ="Customers";
  
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customersComponent');
    this.elFilter_agent_type = this.self[0].querySelector('#_cul_filter_customer_type');
    this.elFilter_agent_status = this.self[0].querySelector ('#_cul_filter_customer_status');
    
    this.btnNewCustomer = this.self.find('#_cul_btnNew');
    this.elSearch = this.self.find('#_cul_search_agent');
    this.btnSearch = this.self.find('#_cul_btnSearch');
    this.btnPrint = this.self.find('#_cul_btnPrint');
         
    this.div_filter_fields = this.self[0].querySelector('#_cul_filter_fields');
    this.form_data= {};
    this.store_agents = {};
 
   this.cols = [
    {
        title: "Photo",
        className: 'align-middle',
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "ID",
        className: "align-middle text-capitalize text-nowrap",
        data: "code"
    },
    {
        title: "Name",
        className: "align-middle text-capitalize text-nowrap",
        data: (data,index,tr)=>{
            let sex = data.sex ==='M'? 'Male':'Female';
            if(!data.sex) sex = '';
            return [`<span class="d-block fw-semibold">`,data.name,`</span><span class="d-block text-muted text-left">`,sex,`</span>`].join('');
        }
    },
    {
        title: "Email",
        className: "align-middle text-capitalize",
        data: (data,index,tr)=>{
            return ['<span class="d-block text-nowrap">',data.email,'</span>','<span class="d-block text-nowrap">',data.phone_number,'</span>'].join('');
        }
    },
    {
        title: "Type",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) => {
            return data.agent_type;
        }
    },
    {
        title: "Start Date",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{
            return ['<span class="d-block text-nowrap">',data.create_date,'</span>'].join('');
        }
    },
    {
        title: "Commission",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{
           return ['<span class="d-block text-nowrap">',(data.policy_name ?? 'NA'),'</span>'].join('');
        }  
    },
    {
        title: "Target Count",
        className: 'align-middle text-capitalize',
        data: (data, index,tr) =>{
           let cls_status = data.summary_type ==='closed'? 'text-danger':'text-info'; 
           let str_summary_status = [`<span class="${cls_status}">(`,data.summary_type,`)</span>`].join('');
           return [`<div class="d-flex flex-column"><span class="p-1 text-success">Achieved in `,data.current_month,` ,`,data.current_year,`</span>`,`<span class="p-1 text-nowrap">`,data.target_count,` `,data.count_type, str_summary_status,`</span>`,`</div>`].join('');
        }  
    },
    {
        title: "Status",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          const status_class = (data.status_code || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-danger text-danger text-center';  
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
       
        vsapi.call([mThis.base_url,'/api/sales-module/agent/form-options'].join(''),{'id':null},null,main_view.apiCluster).then(res => {
                let d = res.status_code ===200?  StringSanitizer.sanitizeObject(res.data) : {};  
                VSUtil.setComboItems(mThis.elFilter_agent_type,d.agent_types,'id','agent_type',true,'(All Types)',def.agent_type_id);
                VSUtil.setComboItems(mThis.elFilter_agent_status,d.statuses,'status_code','status_name',true,'(All Status)',def.status_code);
                onFinish();
        });
    }

    this.init = ()=>{
        if(mThis.initAlready ) return;
        mThis.agentListView = new ListView('div_customer_list',{
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

        mThis.tblCustomers = mThis.agentListView.getTable();
 
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=> {
            el.addEventListener('change',e=>{
              e.preventDefault();
              if(!mThis.filter_disabled){
                 mThis.agentListView.showPage(mThis.getFilterData());
              }
            });
        }); 
        
        this.btnNewCustomer.on('click',function(e){
            let op = {
                'id':null,
                'onClose':(d)=>{
                    mThis.agentListView.showPage(mThis.getFilterData());
                }
            };
            CustomerDialog.show(op);
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
                mThis.agentListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.agentListView.showPage(mThis.getFilterData());
            },250);
        });     
        
        mThis.btnSearch.on('click',function(){
            mThis.agentListView.showPage(mThis.getFilterData());
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
            mThis.agentListView.showPage(mThis.getFilterData());
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop);
            mThis.self.hide().fadeIn(250);
        });

       
    }
      
};
 
const CustomerDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.children('#_cul_dlgCustomer');
    this.base_url =main_view.base_url;
    this.elTitle = this.self[0].querySelector('#_cul_dlgCustomerTitle');
    this.elAgentType = this.self[0].querySelector('#_cul_agent_type');
    this.onClose = null;
        
    this.body = this.self[0].querySelector('div.modal-body');
    this.agent_fields_panel = this.self[0].querySelector('#_cul_dlgCustomer_fields');
    this.btnSave = this.self[0].querySelector('#_cul_dlgCustomer_btnSave');
    
    this.divPhoto = this.self[0].querySelector('#_agent_profile_photo');
    //this.divLoginInfo = this.body.querySelector('.div_login_info');
    this.elPhoneNumber = this.body.querySelector('#_cul_phone_number');
    this.elLoginName = this.body.querySelector('#_cul_login_name');
    this.elPassword = this.body.querySelector('#_cul_password');
    
    this.options = {};

    mThis.imgBox = new ImageBox(mThis.divPhoto,{
        "dataField":"photo",
        "cssClass":"data-input",
        containerClass:null,
        // onDeleteImage:()=>{
        //   alert('Deleting image');
        //   return false;
        // },
        "onLoadImage":(photo) =>{
            let p = {"id":mThis.options.id,"sales_agent_id":mThis.options.id,"photo":photo};
            if(!p.id) return; 
            vsapi.call(`${main_view.base_url}/api/sales-app/agent/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                    cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/api/sales-app/agent/delete-profile-picture`,
            "params":()=>{
                return {"id": mThis.options.id,"sales_agent_id":mThis.options.id}
            }
        }
    });

    this.elPhoneNumber.onkeyup = (e)=>{
       e.preventDefault();
       if(!mThis.options.id || mThis.options.id ==0){
            mThis.elLoginName.value = e.target.value;
       }
    }

    this.prepareData = (def,onFinish)=>{
        if(!def) def = {};
        if (mThis.form_data){
            VSUtil.setComboItems(mThis.elAgentType,mThis.form_data.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
            if(typeof onFinish === 'function') onFinish();
            return;
        }

        vsapi.call([mThis.base_url,'/api/sales-module/agent/form-options'].join(''),null).then(res=>{
            if(res.status_code===200){
                let d = res.data;
                d.agent_types = StringSanitizer.sanitizeObject(d.agent_types);
                VSUtil.setComboItems(mThis.elAgentType,d.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
                mThis.form_data = d;
                if(typeof onFinish ==='function') onFinish();
            }
        });
    }

    this.btnSave.addEventListener('click',e =>{
        let p = mThis.getData();
        //if(!p) return;
        vsapi.call([mThis.base_url,'/api/sales-module/agent/save'].join(''),p, this.btnSave,null).then(res=>{
            if(res.status_code ===200) {
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
                const new_code = res.data? res.data.new_code:null;
                if (new_code){
                    cv_interact.success(['New Sales agent created with code ',new_code].join(''));
                }
            }
            else cv_interact.warning(res.error_message);
        });
    });

    this.show = (options)=>{
        mThis.options = options || {};
        mThis.elTitle.innerHTML = options.title;
        if (mThis.options.id > 0) {
            mThis.elTitle.innerHTML = "Sales Agent Details";
            let p = {'id':mThis.options.id};
            vsapi.call([main_view.base_url,'/api/sales-module/agent/details'].join(''),p,null).then(res=>{
                if(res.status_code === 200){
                    let d = res.data;
                    d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
                    mThis.prepareData(d, () => {
                        mThis.setData(d);
                        mThis.self.modal({
                            backdrop:'static'
                        });
                    });
                }
            });
        }
        else{
            mThis.elTitle.innerHTML =  "New Sales Agent";
            mThis.prepareData({'agent_type_id':1}, ()=>{
                mThis.setData(null);
                mThis.self.modal({
                    backdrop:'static'
                });       
            });
        }
    }

    this.setData = (d)=>{
        d = d || {};
        mThis.body.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            el.value = d[f] ?? '';
            if(el.tagName ==='SELECT'){
                 el.dispatchEvent(new Event('change'));
            }else if(el.tagName ==='IMG'){
                el.setAttribute('src',d[f] || '');
            }
        });
        mThis.imgBox.setImage(d.photo || d.image_url);
        //mThis.divLoginInfo.style.display = d.name ? 'none':'block';
    }

    this.getData = ()=>{
        let p = {};
        p.id = mThis.options.id;
        mThis.agent_fields_panel.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
           if(el.tagName ==='IMG') p[f] = el.getAttribute('src');
           else p[f] = el.value;
        });
        return p;
    }
}
'use strict';
var SalesAgentsComponent = new function(){
    let mThis = this;
    this.title_prop ="Sales Agents";
  
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_saleAgentsComponent');
    this.elFilter_agent_type = this.self.find('#_sal_filter_agent_type');
    this.elFilter_agent_status = this.self.find('#_sal_filter_agent_status');
    
    this.btnNewSalesAgent = this.self.find('#_sal_btnNewAgent');
    this.elSearch = this.self.find('#_sal_search_agent');
    this.btnSearch = this.self.find('#_sal_btnSearch');
    this.btnPrint = this.self.find('#_sal_btnPrint');
  
   this.div_filter_fields = this.self.find('#div_filter_fields')[0];

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
        data: "name"
    },
    {
        title: "Sex",
        className: 'align-middle text-capitalize',
        data:(data,index,tr)=>{
            let sex = data.sex === 'M' ? 'Male' : 'Female';
            return sex;
        }
    },
    {
        title: "Email",
        className: "align-middle text-capitalize",
        data: "email"
    },
    {
        title: "Phone Number",
        className: "align-middle text-capitalize",
        data: "phone_number"
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
        data: (data, index,tr) => {
            return data.start_date ? new Date(data.start_date).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year': 'numeric'
            }).replace(',','') : '';
        }
    },
    {
        title: "Status",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          return ['<span class="border rounded-5 border-success text-success p-2">',data.status_code,'</span>'].join(''); 
        }
    },
    {
        title: "Action",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          return ['<div class="d-flex gap-2">',
          '<a href="javascript:void(0)" class="btn-agent-status"><i class="fa fa-list text-success"></i></a>',
          '<a href="javascript:void(0)" class="btn-agent-edit"><i class="fa fa-edit text-primary"></i></a>',
          '<a href="javascript:void(0)" class="btn-agent-delete"><i class="fa fa-trash-can text-danger"></i></a>',
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
       
        vsapi.call([mThis.base_url,'/api/sales-agent/form-options'].join(''),{'id':null},null,main_view.apiCluster).then(res => {
                let d = res.status_code ===200?  StringSanitizer.sanitizeObject(res.data) : {};  
                VSUtil.setComboItems(mThis.elFilter_agent_type,d.agent_types,'id','agent_type',true,'(All Types)',def.agent_type_id);
                VSUtil.setComboItems(mThis.elFilter_agent_status,d.statuses,'status_code','status_name',true,'(All Status)',def.status_code);
                onFinish();
        });
    }

    this.init = ()=>{
        if(mThis.initAlready ) return;
        mThis.listView = new ListView('div_sales_agent_list',{
            'fetchApi':`${main_view.base_url}/api/sales-agent/list`,
            'columns': mThis.cols,
            apiCluster:main_view.apiCluster,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });

        mThis.tblSalesAgents = mThis.listView.getTable();
 
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=> {
            el.addEventListener('change',e=>{
              e.preventDefault();
              if(!mThis.filter_disabled){
                 mThis.listView.showPage(mThis.getFilterData());
              }
            });
        }); 
        
        this.btnNewSalesAgent.on('click',function(e){
            let op = {
                'id':null,
                'onClose':(d)=>{
                    mThis.listView.showPage(mThis.getFilterData());
                }
            };
            SalesAgentDialog.show(op);
        });

        mThis.tblSalesAgents.querySelector('tbody').addEventListener('click', e=> {
            e.preventDefault();

            //Click on Edit
            let btn = VSUtil.getElementByClass(e.target,'btn-agent-edit');
            if(btn){
                let agent_id = btn.dataset.id;

                let op = {
                    id:agent_id,
                    onClose: d => {
                        mThis.listView.showPage(mThis.getFilterData());
                    }
                };
                SalesAgentDialog.show(op);
                return;
            }


            //Click on Delete
            btn = VSUtil.getElementByClass(e.target,'btn-agent-delete');
            if(btn){

                let agent_id = btn.dataset.id;
                let status_code = btn.dataset.status;
                let p = {'agent_id':agent_id,'status_code':status_code};
                cv_interact.confirm('Delete this sales agent?',{title:'Delete Sales Agent',context:'delete'},function(e){
                    if(e){
                        vsapic.call([mThis.base_url,'/api/sales-agent/delete'].join(''),p,null).then(res=>{
                            if(res.status_code===200) {
                                mThis.listView.showPage(mThis.getFilterData());
                            }
                            else cv_interact.error(res.error_message);
                        });
                    }
                });
                return;
            }

             //Click on Change Status
             btn = VSUtil.getElementByClass(e.target,'btn-agent-status');
             if(btn){
                let agent_id = btn.dataset.id; 
                let def_status_code = btn.dataset.status;
                mThis.changeAgentStatus(agent_id,def_status_code); 
                 return;
             }
        });
         
        // mThis.tblSalesAgents.on('click','a._sal_sa_change_status',function(e){
        //     e.preventDefault();
        //     let x = $(this).parent();
        //     let agent_id = x.data('agentid');
        //     let status_code = x.data('statuscode');

        //     let option = {'title':'Set Agent Status',"dataLabel":"Agent status","valueMember":"status_code","textMember":"name","blankErrorMessage":"Please select a correct Status","data":[{"status_code":"active","name":"Active"},{"status_code":"inactive","name":"Inactive"}],"defaultValue":status_code};
        //     InputBox2.show(option,(d)=>{
        //         if(d) {
        //             let p = {"agent_id":agent_id,"status_code":d.value}; 
        //             vsapi.call([mThis.base_url,'/api/updateSalesAgentStatus'].join(''),p).then(res=>{
        //                 if(res.status_code===200) {
        //                     mThis.displayAgentList();
        //                 }
        //                 else cv_interact.error(res.error_message); 
        //             });
        //         }
        //     });
        // });

        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.listView.showPage(mThis.getFilterData());
            },250);
        });     
        
        mThis.btnSearch.on('click',function(){
            mThis.listView.showPage(mThis.getFilterData());
        });
       mThis.initAlready = true;
    }
    //END: SalesAgentComponent.init() 

    this.changeAgentStatus = (agent_id, def_status_code)=>{
        alert('Change agent status');
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

    this.show = (options = {})=>{
        mThis.init() ; // NOTE: init once only based on mThis.initAlready = true or false

        if(!options ) options = {};
        mThis.options = options;
        mThis.loadFilterData({},()=>{
            mThis.listView.showPage(mThis.getFilterData());
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop);
            mThis.self.hide().fadeIn(250);
        });

       
    }
      
};
 
const SalesAgentDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.children('#_sal_dlgSalesAgent');
    this.base_url =main_view.base_url;
    this.elTitle = this.self.find('#_sal_dlgSalesAgentTitle');
    this.elAgentType = this.self.find('#_sal_agent_type');
    this.onClose = null;
    this.elError = this.self.find('#_sal_agent_error');
    
    this.body = this.self.find('#_sal_dlgSalesAgent_body');
    this.agent_fields_panel = this.self.find('#_sal_dlgSalesAgent_fields');
    this.btnSave = this.self.find('#_sal_dlgSalesAgent_btnSave');

    this.prepareData = (def,onFinish)=>{
        if(!def) def = {};
        if (mThis.form_data){
            VSUtil.setComboItems(mThis.elAgentType,mThis.form_data.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
            if(typeof onFinish =='function') onFinish();
            return;
        }

        vsapi.call([mThis.base_url,'/api/sales-agent/form-options'].join(''),null).then(res=>{
            if(res.status_code===200){
                let d = res.data;
                d.agent_types = StringSanitizer.sanitizeObject(d.agent_types);
                VSUtil.setComboItems(mThis.elAgentType,d.agent_types,'id','agent_type',true,'(Select Agent Type)',def.agent_type);
                mThis.form_data = d;
                if(typeof onFinish ==='function') onFinish();
            }
        });
    }

    this.btnSave.on('click',function(e){
        let p = mThis.getData();
        if(!p.name) {
            mThis.elError.html('Agent name is required!');
            return;
        }

        if(!p.phone_number) {
            mThis.elError.html('Phone number is required!');
            return;
        }

        vsapi.call([mThis.base_url,'/api/saveSalesAgent'].join(''),p).then(res=>{
            if(res.status_code ===200) {
                mThis.self.modal('hide');
                if (typeof mThis.onClose === 'function') mThis.onClose(p);
            }
            else mThis.elError.text(res.error_message);
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
            vsapi.call([mThis.base_url,'/api/getSalesAgentById'].join(''),p).then(res=>{
                if(res.status_code===200){
                    let d = res.data;
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
        }
        else{
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
        mThis.agent_fields_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            el.val(d[data_member]);
        });
    }

    this.getData = ()=>{
        let p = {};
        p.agent_id = mThis.agent_id;
        mThis.agent_fields_panel.find('.data-input').each(function(){
            let el =$(this);
            let data_member = el.data('field');
            p[data_member] = el.val();
        });
        p.agent_id = mThis.agent_id;
        return p;
    }
}
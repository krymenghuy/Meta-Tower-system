'use strict';

var SalesAgentsComponent = new function () {
    const mThis = this;
    this.title_prop = "Sales Agents";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_salesAgentsComponent');
    this.elFilter_sale_agent_type = this.self[0].querySelector('#_sale_agent_filter_type');
    this.elFilter_sale_agent_status = this.self[0].querySelector('#_sale_agent_filter_status');

    this.btnNewSalesAgents = this.self.find('#_sale_agent_btnNew');
    this.elSearch = this.self.find('#_sale_agent_search');
    this.btnSearch = this.self.find('#_sale_agent_btnSearch');
    this.btnPrint = this.self.find('#_sale_agent_btnPrint');

    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
    this.form_data={};
    this.store_agents = {};

    // this.cols = [
    
    //     {
    //         title: "ID",
    //         className: "align-middle text-capitalize text-nowrap",
    //         data: "code"
    //     },
    //     {
    //         title: "Name",
    //         className: "align-middle text-capitalize text-nowrap",
    //         data: (data,index,tr)=>{
    //             let sex = data.sex === 'M' ? 'Male' : 'Female';
    //             return [`<span class="d-block fw-semibold">`,data.name,`</span><span class="d-block text-muted text-left">`,sex,`</span>`].join('');
    //         }
    //     },
    //     {
    //         title: "Email",
    //         className: "align-middle text-capitalize",
    //         data: (data,index,tr)=>{
    //             return ['<span class="d-block text-nowrap">',data.email,'</span>','<span class="d-block text-nowrap">',data.phone_number,'</span>'].join('');
    //         }
    //     },
        
    //     {
    //         title: "Agents Type",
    //         className: 'align-middle text-capitalize',
    //         data: (data, index,tr) => {
    //             return data.agent_type;
    //         }
    //     },
    //     {
    //         title: "Start Date",
    //         className: 'align-middle text-capitalize',
    //         data: (data, index,tr) =>{
    //             return ['<span class="d-block text-nowrap">',data.create_date,'</span>'].join('');
    //         }
    //     },
    //     {
    //         title: "Position",
    //         className: 'align-middle text-capitalize',
    //         data: (data, index,tr) =>{
    //            return ['<span class="d-block text-nowrap">',(data.position_title ?? 'NA'),'</span>'].join('');
    //         }  
    //     },
  
    //     {
    //         title: "Status",
    //         className: 'align-middle text-capitalize',
    //         data: (data, index, tr) => {
    //           const status_class = (data.status_code || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-danger text-danger text-center';  
    //           return ['<a href="javascript:void(0)" class="d-block lnk-agent-status" data-id ="',data.id,'" data-status="',data.status_code,'"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status_class,'">',data.status_code,'</span></a>'].join(''); 
    //         }
    //     },
    //     {
    //         title: "Action",
    //         className: 'align-middle text-capitalize',
    //         data: (data, index, tr) => {
    //           return ['<div class="d-flex gap-2">',
    //           //'<a href="javascript:void(0)" class="btn-agent-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
    //           '<a href="javascript:void(0)" class="btn-agent-edit" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-edit text-primary fs-5"></i></a>',
    //           '<a href="javascript:void(0)" class="btn-agent-login" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-user text-primary fs-5"></i></a>',
    //           '<a href="javascript:void(0)" class="btn-agent-delete" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-trash-can text-danger fs-5"></i></a>',
    //           '</div>'].join(''); 
    //         }
    //     }
    //   ];

     
   this.cols = [
  
    {
        title: "ID",
        className: "align-middle text-capitalize text-nowrap",
        data:(data,index,tr)=>{
            return `<span class="code text-danger">${data.code ? data.code:'N/A'}</span>`;
        }
    },
    {
        title: "Name",
        className: "align-middle text-capitalize text-nowrap",
        data: (data,index,tr)=>{
            let sex = data.sex === 'M' ? 'Male' : 'Female';
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
          const status_class = (data.status_id || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-danger text-danger text-center';  
          return ['<a href="javascript:void(0)" class="d-block lnk-agent-status" data-id ="',data.id,'" data-status="',data.status_id,'"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status_class,'">',data.status_id,'</span></a>'].join(''); 
        }
    },
    {
        title: "Action",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
          return ['<div class="d-flex gap-2">',
          //'<a href="javascript:void(0)" class="btn-agent-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-agent-edit" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-edit text-primary fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-agent-login" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-user text-primary fs-5"></i></a>',
          '<a href="javascript:void(0)" class="btn-agent-delete" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-trash-can text-danger fs-5"></i></a>',
          '</div>'].join(''); 
        }
    }
  ];


    this.init= () => {
        if(mThis.initAlready) return;

        mThis.salesAgentsListView = new ListView('_sale_agent_list',{
            'fetchApi':`${main_view.base_url}/api/sales-agents/list`,
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
        mThis.tblSalesAgents = mThis.salesAgentsListView.getTable();

        // this.btnNewSalesAgents.on('click',function(e){
        //     let op = {
        //         'id':null,
        //         'onClose':(d)=>{
        //             mThis.agentListView.showPage();
        //         }
        //     };
        //     SalesAgentsDialog.show(op);
        // });
        
        
        mThis.initAlready = true;

    }

    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
            mThis.options = options;    
            mThis.salesAgentsListView.showPage(null);

            main_view.setTitle(mThis.title_prop);
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(204);
        // });
    }
}

// const SalesAgentsDialog = new function(){
//     let mThis = this;
//     this.self = main_view.appContent.children('#_sale_agent_dlg');
//     this.base_url =main_view.base_url;
//     this.options = {};
//     this.elTitle = this.self[0].querySelector('#_sale_agent_dlgTitle');
//    // this.elAgentType = this.self[0].querySelector('#_sal_agent_type');
//     this.onClose = null;
        
//     this.body = this.self[0].querySelector('#_sale_agent_dlg_body');
//     this.btnSave = this.self[0].querySelector('#_sale_agent_dlg_btnSave');
//     this.body =  this.self.find('.modal-body')[0];

//     this.btnSave.on('click', function(e){
//         e.preventDefault();
//         let p = mThis.getData();
//         vsapi.call(`${mThis.base_url}/api/sales-agents/save`, p).then(res => {
//             if(res.status_code === 200){
//                 mThis.self.modal('hide');
//                 if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

//             }
//             else
//                 cv_interact.error(res.error_message);
//         });
        
//      });
   
   

 

   

   

  
//     this.setData = (d)=>{
//         d = d || {};
//         mThis.body.querySelectorAll('.data-input').forEach(el =>{
//             const f = el.dataset.field;
//             if(el.tagName.toLowerCase() ==='select'){

//                  el.value = d[f];
//                  let event = new Event('change',{
//                     bubbles: true,
//                     cancelable: true
//                  });
//                  el.dispatchEvent(event);
//             }else{
//                 el.value = d[f]?? '';
//             }
//         });

//     }

//     this.getData = ()=>{
//         let p = {};
//         p.id = mThis.options.id;
//         mThis.self[0].querySelectorAll('.data-input').forEach(el =>{
//             const f = el.dataset.field;
//             p[f] = el.value;
//         });
//         return p;
//     }
//     this.show = (options)=>{
//         mThis.options = options || {};
//         mThis.options = options;

//         mThis.setData();
//         mThis.self.modal({
//             backdrop:'static'
//         });
                    
//     }
// }

   

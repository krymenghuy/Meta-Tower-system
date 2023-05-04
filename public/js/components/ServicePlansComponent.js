"use strict";
let ServicePlansComponent = new function () {
    let mThis = this;
    this.title_prop = "Service Plans";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_servicePlansComponent');
    this.btnNewPlan = $('#_spl_btnNewPlan');
    this.elSearch = $('#_spl_search');
    this.elFilter_status = $('#_spl_filter_status');
    this.tblItems = $('#_spl_tblServicePlans');
    this.div_container = $('#service_plan_container');
    
    this.form_data = {};
    this.init = () => {
        mThis.elSearch.on('keyup', (e) => {
            //if (e.key==='Enter') 
            if(!mThis.elSearch.val() || (mThis.elSearch.val()+'').length>=3) mThis.displayServicePlans();
        });

        mThis.btnNewPlan.on('click', (e) => {
            let op = {
                onClose: (d) => {
                    if (d) {
                        //mThis.renderServicePlanInfo(d);
                        mThis.displayServicePlans();
                    }
                }
            };
            ServicePlanDialog.show(op);
        });
 
        mThis.div_container.on('click','.btn-members',e=>{
          e.preventDefault();
          let lnk = e.target.closest('.btn-members');
          let id = lnk.dataset.id;
          let op = {'id':id,'onClose':(e)=>{

          }};

          MembersDialog.show(op);
        });

        mThis.div_container.on('click','.btn-delete-plan',function(e){
          e.preventDefault();
          let x = $(this);
          let id = x.data('id');
          cv_interact.confirm('Delete this plan?',{title:'Delete Plan','context':'delete'},(e)=>{
            if(e){
                let p = {'id':id};
                vsapi.call(`${main_view.base_url}/api/service-plan/delete`,p,null,false).then(res=>{
                    if(res.status_code===200){
                         mThis.displayServicePlans();
                    }else cv_interact.error(res.error_message);
                });
            }
          }); 
        });

        mThis.div_container.on('click','.btn-add-member',function(e){
            e.preventDefault();
            let x = $(this);
            let id = x.data('id');
            alert(JSON.stringify(id));
            // let op = {

            // };
            // MemberDialog.show(op); 
        });

        mThis.div_container.on('click','.btn-edit-plan',function(e){
            e.preventDefault();
            let x = $(this);
            let id = x.data('id');
            let op = {'id':id,
            onClose:(res)=>{
               if(res.status_code ===200){
                 mThis.renderServicePlanInfo(res.data);
               }
            }
          };

            ServicePlanDialog.show(op); 
          });

        mThis.tblItems.on('click', '.btn_item_modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayServicePlans();
                    }
                }
            };
            MedicalServiceDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this service?`, { title: "Delete Service", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/service/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayServicePlans();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elFilter_status.on('change', (e) => {
            mThis.displayServicePlans();
        });
    }

    this.refreshMemberCount = (id,cnt)=>{
      let count_id = `sp_member_count_${id}`;
      mThis.div_container.find(`#${count_id}`).text(cnt);

    }

    this.create_row_content = (c={},add_container = false)=>{
        c.member_count = c.member_count?c.member_count:0;
        //NOTE: each container's id is "srp_${c.id}"
     return [ add_container? `<div id="srp_${c.id}" class="row m-2" style="background:#E8F2F2;min-height:100px;border:1px solid #E7E4E4;padding:10px;margin-top:5px">`:'',
       `<div class="col-4 p-1">
            <h5>${c.name}</h5>
            <p class="text-muted">${c.description ? c.description:'No description'}</p>
        </div>
        <div class="col-3 p-1">
            <h5>Members</h5>
            <span class="d-block p-2 fw-bold" id="sp_member_count_${c.id}">${c.member_count}</span>
            <span class="d-block">&nbsp;<a href="javascript:void(0)" class="btn-members" data-id="${c.id}"><i class="fa fa-list-alt"></i></a></span>
        </div>
        <div class="col-3 p-1">
            <h5>Price</h5>
            <span class="d-block p-2 fw-bold">$ ${c.price} monthly</span>
        </div>

        <div class="col-2 p-1">
            <div class="d-flex flex-row">`
                //,`<a href="javascript:void(0)" class="btn-add-member" data-id="${c.id}"><i class="fa fa-plus-circle"></i></a>&nbsp;`
                ,`<a href="javascript:void(0)" class="btn-edit-plan" data-id="${c.id}"><i class="fa fa-edit"></i></a>&nbsp;`
                ,`<a href="javascript:void(0)" class="btn-delete-plan" data-id="${c.id}"><i class="fa fa-trash"></i></a>`
            ,`</div>
        </div>`,
        add_container?'</div>':''].join('');
    }

    this.renderServicePlanInfo = (d={})=>{
        let div_id = `srp_${d.id}`;
        let div = mThis.div_container.find(`#${div_id}`);
        div.html(mThis.create_row_content(d));
    }

    this.displayServicePlans = (onFinish = null) => {
        //NOTE: status_id filter is not yet used
        let p = { 'status_id': mThis.elFilter_status.val(),'search_value':mThis.elSearch.val()};
        mThis.div_container.html('');
        vsapi.call(`${mThis.base_url}/api/service-plan/list`, p,null, null).then(res => {
            let items = [];
            if (res.status_code === 200) items = res.data;
            mThis.div_container.html('');
            let cnt =0;
            items.map(c =>{
                mThis.div_container.append(mThis.create_row_content(c,true));
                cnt++;
            });
            if(cnt===0){
                mThis.div_container.html(`<div id="srp_empty_info" class="row m-2" style="background:#E8F2F2;min-height:100px;border:1px solid #E7E4E4;padding:10px;margin-top:5px"><span text-muted h3>There are no service plans created!</span></div>`);  
            }
        });
    };

    this.loadFilterOptions = (onFinish) => {
        onFinish();
    }

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;

        mThis.loadFilterOptions((items) => {
            mThis.elFilter_status.val(1).trigger('change');
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ServicePlanDialog = new function () {
    let mThis = this;
    this.self = $(`#_spl_dlgServicePlan`);
    this.elService = $('#_spl_service');

    this.prepareFormOptions = (default_id, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/service-plan/form-options`,null,null,false).then(res=>{
            if(res.status_code ===200){
                onFinish(res.data);
            }
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Service Plan",
        "formId": '_spl_dlgServicePlan',
        "instance": this,
        "apiSave": `${main_view.base_url}/api/service-plan/save`,
        "apiGet": `${main_view.base_url}/api/service-plan/details`,
        "modifyTitle": "Modify Service Plan",
        "createTitle": "New Service Plan",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => { }
    });

    this.show = (options) => {
        mThis.prepareFormOptions(options.department_id, (data) => {
            VSUtil.setComboItems(mThis.elService,data.services,'id','service_name',true,'(select service)',null);
            mThis.formUntil.show(options);
        })
    }
}

let MembersDialog = new function(){
    let mThis = this;
    this.self = $('#st_dlgSubsribers');
    this.elTitle = $('#st_dlgSubsribers_title');

    this.tblMembers = $('#sp_tblMembers_body');
    this.tblMembers_tbody = $('#sp_tblMembers_body');
    this.btnAddMember = $(`#sp_btnAddMember`);
    this.elPhone = $('#st_add_member_phone');
    this.elName = $('#st_add_member_name');
    this.elAgent = $('#st_sales_agent');
    this.elAgentCommission = $('#st_agent_commission');
    this.elExpirationDate = $('#st_expiration_date');
    this.elStartDate = $('#st_start_date');
    this.elCommissionType = $('#st_expiration_type');

    this.btnNewMember = $('#sp_btnNewMember');
    this.btnCancelNewMember = $('#sp_btnCancelNewMember');
    this.btnClose = $(`#st_dlgSubsribers_btnClose`);
    this.div_add_member = $('#st_div_add_member');
  
    this.btnNewMember.on('click',(e)=>{
       mThis.clearFields();
    //    this.loadSalesAgents(()=>{
    //       mThis.div_add_member.addClass('active');
    //    });
       mThis.div_add_member.addClass('active');
    });

    this.btnCancelNewMember.on('click',(e)=>{
        mThis.div_add_member.removeClass('active');
    });
    
    this.elPhone.on('blur',(e)=>{
        mThis.findClient();
    });

    this.elPhone.on('keyup',(e)=>{
       e.preventDefault();
       if(e.key==='Enter'){
        mThis.findClient();
       }
    });

    this.btnAddMember.off('click').on('click',(e)=>{
        e.preventDefault();
        let p = {'client_id':mThis.client_id,'service_plan_id':mThis.service_plan_id,'expiration_date':mThis.elExpirationDate.val(),'commission_type':mThis.elCommissionType.val(),'sales_agent_id':mThis.elAgent.val(), 'commission':mThis.elAgentCommission.val()};
        vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/add`,p,null,false).then(res=>{
            if(res.status_code === 200){
              let d = res.data?res.data:{};  
              mThis.displayMembers(d.members);
              ServicePlansComponent.refreshMemberCount(mThis.service_plan_id,d.members.length);
              //hide Add Member Panel
              mThis.div_add_member.removeClass('active');
            }else cv_interact.error(res.error_message);
        });
    })

    this.tblMembers_tbody.on('click','a.sp-btn-remove-member',function(e){
        e.preventDefault();
        let client_id = $(this).data('clientid');
        let p = {'service_plan_id':mThis.service_plan_id,'client_id':client_id};
        cv_interact.confirm('Remove this subscriber?',{title:'Remove Subscriber','context':'delete'},(e)=>{
            if(e){
                vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/remove`,p,null,false).then(res=>{
                    if(res.status_code===200){
                        let d = res.data?res.data:{};
                        mThis.displayMembers(d);
                        ServicePlansComponent.refreshMemberCount(mThis.service_plan_id,d.members.length);
                    }else cv_interact.error(res.error_message);
                });
            }
        });      
    });

    this.findClient = ()=>{
        vsapi.call(`${main_view.base_url}/api/appointment/find-client`,{'search_value':this.elPhone.val()},null,false).then(res=>{
            if(res.status_code===200){
               let d = res.data?res.data:{};
               mThis.elName.val(d.name);
               mThis.client_id = d.id;  
            }
        });
    }
 
    this.displayMembers = (members=[])=>{
        mThis.tblMembers_tbody.empty();
        let i =0,c=null;
            do{
               c = members[i];
               if(!c) break;
               let cur_symbol = c.currency_code ==='KHR'?'៛':'$';
               let html = [`<tr><td>${(i+1)}</td><td>`,c.code,`</td><td>`,c.name,`</td><td>`,c.sex,`</td><td>`,c.phone_number,`</td><td>`,c.subscription_status,`</td><td>`,c.sales_agent_name,`</td><td><a href="javascript:void(0)" class="sp-edit-agent"><i class="fa fa-user-edit"></i></a>&nbsp;<a href="javascript:void(0)" class="sp-btn-remove-member" data-id="${c.id}" data-clientid="${c.client_id}"><i class="fa fa-times" style="color:red"></i></a></td></tr>`].join('');
               mThis.tblMembers_tbody.append(html);
               i++;
            }while(c);        
    }

    this.refreshMembers = (onFinish=null)=>{
        vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/list`,{'id':mThis.service_plan_id},null,false).then(res=>{
            if(res.status_code===200){
              let rows = res.data;
              mThis.displayMembers(rows);
              if(typeof onFinish ==='function') onFinish();
            }
        });
    }
    mThis.loadSalesAgents=(onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/settings/options-sales-agent`,null,null,false).then(res=>{
            if(res.status_code===200){
              let items = res.data;
              VSUtil.setComboItems(mThis.elAgent,items,'id','sales_agent_name',true,'(None)',null);
              if(typeof onFinish ==='function') onFinish();
            }
        });
    }

    this.clearFields = ()=>{
       mThis.div_add_member.find('.data-input').each(function(){
          $(this).val(null);
       });
       mThis.elStartDate.val('Today');
    }
    
    //Load sales agent
    mThis.loadSalesAgents();

    this.show = (options)=>{
       options = options?options:{};
       mThis.onClose = options.onClose;
       mThis.service_plan_id = options.id;
       mThis.div_add_member.removeClass('active');
       mThis.clearFields(); 
       mThis.elTitle.text('Subscribers');
       mThis.refreshMembers(()=>{
           mThis.self.modal({
            backdrop:true
           });
       }); 
   
    }
}

// let MemberDialog = new function(){
//     let mThis = this;
//     this.self = $('#st_dlgAddMember');
//     this.elClientPhone = $('#stm_client_phone');
//     this.btnSearchClient = $('#stm_btn_find_client');

//     this.elServicePlan = $('#stm_service_plan');
//     this.elPrice = $('#stm_price');
//     this.elAgent = $('#stm_sales_agent');

//     this.btnSave = $('#stm_btnSave');

//     this.btnSave.on('click',function(e){
//       e.preventDefault();
//       let p = {'client_id':mThis.client_id,'service_plan_id':mThis.elServicePlan.val(), 'price':mThis.elPrice.val(), 'sales_agent_id':mThis.elAgent.val()};
//       vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/add`,p,null,false).then(res=>{
           
//       });
//     });

//     this.show = (options)=>{
//         mThis.self.modal({
//             backdrop:false
//         });
//     }
// }

window.addEventListener('DOMContentLoaded',function () {
    ServicePlansComponent.init();
});
"use strict";
let ServicePlansComponent = new function () {
    let mThis = this;
    this.title_prop = "Service Plans";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_servicePlansComponent');
    this.btnNewPlan = $('#_spl_btnNewPlan');
    this.elSearchItem = $('#_spl_search');
    this.elFilter_status = $('#_spl_filter_status');
    this.tblItems = $('#_spl_tblServicePlans');
    this.div_container = $('#service_plan_container');

    this.form_data = {};
    this.init = () => {
        mThis.elSearchItem.on('keyup', (e) => {
            if (e.key==='Enter') mThis.displayServicePlans();
        });

        mThis.btnNewPlan.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayServicePlans();
                    }
                }
            };
            ServicePlanDialog.show(op);
        });

        mThis.div_container.on('click','.btn-add-member',e=>{

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
            alert(id);
        });

        mThis.div_container.on('click','.btn-edit-plan',function(e){
            e.preventDefault();
            let x = $(this);
            let id = x.data('id');
            let op = {'id':id,
            onClose:(e)=>{
               if(e){
                  mThis.displayServicePlans();
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

    this.displayServicePlans = (onFinish = null) => {
        let p = { 'status_id': mThis.elFilter_status.val()};
        mThis.div_container.html('');
        vsapi.call(`${mThis.base_url}/api/service-plan/list`, p,null, null).then(res => {
            let items = [];
            if (res.status_code === 200) items = res.data;
            items.map(c =>{
                let html = [`<div class="row m-2" style="background:#E8F2F2;min-height:100px;border:1px solid #E7E4E4;padding:10px;margin-top:5px">
                <div class="col-4 p-1">
                  <h5>${c.name}</h5>
                  <p class="text-muted">${c.description ? c.description:'No description'}</p>
                </div>
                <div class="col-3 p-1">
                  <h5>Members</h5>
                  <span class="d-block p-2 fw-bold">25</span>
                  <span class="d-block"><a href="javascript:void(0)" class="btn-add-member" data-id="${c.id}"><i class="fa fa-plus-circle"></i></a>&nbsp;<a href="javascript:void(0)" class="btn-members" data-id="${c.id}"><i class="fa fa-list-alt"></i></a></span>
                </div>
                <div class="col-3 p-1">
                  <h5>Price</h5>
                  <span class="d-block p-2 fw-bold">$ ${c.price} monthly</span>
                </div>

                <div class="col-2 p-1">
                   <div class="d-flex flex-row">`
                     ,`<a href="javascript:void(0)" class="btn-edit-plan" data-id="${c.id}"><i class="fa fa-edit"></i></a>&nbsp;`
                     ,`<a href="javascript:void(0)" class="btn-delete-plan" data-id="${c.id}"><i class="fa fa-trash"></i></a>`
                   ,`</div>
                </div>

              </div>`].join('');
               mThis.div_container.append(html);
            });
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
     
    this.prepareFormOptions = (default_id, onFinish) => {
        onFinish();
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
        mThis.prepareFormOptions(options.department_id, () => {
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

    this.btnNewMember = $('#sp_btnNewMember');
    this.btnCancelNewMember = $('#sp_btnCancelNewMember');
    this.btnClose = $(`#st_dlgSubsribers_btnClose`);
    this.div_add_member = $('#st_div_add_member');

    this.btnNewMember.on('click',(e)=>{
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
        vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/add`,{'client_id':this.client_id,'service_plan_id':mThis.service_plan_id},null,false).then(res=>{
            if(res.status_code===200){
              let d = res.data;  
              mThis.displayMembers(d.members);
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
                        mThis.displayMembers(res.data.members);
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
               let html = [`<tr><td>${(i+1)}</td><td>`,c.code,`</td><td>`,c.name,`</td><td>`,c.sex,`</td><td>`,c.phone_number,`</td><td>`,c.email,`</td><td><a href="javascript:void(0)" class="sp-btn-remove-member" data-id="${c.id}" data-clientid="${c.client_id}"><i class="fa fa-times" style="color:red"></i></a></td></tr>`].join('');
               mThis.tblMembers_tbody.append(html);
               i++;
            }while(c);        
    }

    this.refreshMembers = ()=>{
        vsapi.call(`${main_view.base_url}/api/service-plan/subscriber/list`,{'id':mThis.service_plan_id},null,false).then(res=>{
            if(res.status_code===200){
              let rows = res.data;
              mThis.displayMembers(rows);
            }
        });
    }

    this.show = (options)=>{
       options = options?options:{};
       mThis.service_plan_id = options.id;
       mThis.div_add_member.removeClass('active');

       mThis.elTitle.text('Subscribers');
       mThis.refreshMembers(); 
       mThis.self.modal({
        backdrop:true
       });
    }
}

window.addEventListener('DOMContentLoaded',function () {
    ServicePlansComponent.init();
});
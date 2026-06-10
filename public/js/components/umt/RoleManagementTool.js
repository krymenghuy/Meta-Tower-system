'use strict';
/** begin:RoleManagementComponent */
var RoleManagementComponent = new function(){
    const mThis = this;
    this.selected_role = null;
    this.title_prop = 'Role Management';
    this.base_url = main_view.base_url;
    this.self = main_view.VSAppContent.querySelector('#_um_roleManagementComponent');

    this.div_role_list = this.self.querySelector('div#_um_rolelist');    
    //this.tblCard_body = this.self.querySelector('div#_um_card');    
//  console.log(mThis.tblCard_body);
    this.lnkNewRole = this.self.querySelector('#_lnkNewRole');
    this.elSearchRole = this.self.querySelector('#_search_role');
    this.btnPrint = this.self.querySelector('#_cul_btnPrint');
    this.div_search_widget = this.self.querySelector('#um_search_widget');
    this.lblSelectedRoleName = this.self.querySelector('#um_selected_role');
    this.lnkToggleRoleList = this.self.querySelector('#um_lnk_toggle_list');

    this.exportData = (jsonObject, fileName =null ) =>{
        const jsonString = JSON.stringify(jsonObject, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName || "data"}.json`;  // Default filename, user can change it
        document.body.appendChild(link);
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
    }

    this.importData = (jsonData,itemType, onFinish=null)=>{
        let p = {
            data: jsonData,
            type:itemType
        };
        vsapi.call(`${main_view.base_url}/api/um/data/import`,p,false,false).then(res =>{
            if(res.status_code ==200){
                let d = res.data;
                onFinish();
                cv_interact.success(['html:',d.success_count,' ', `${itemType || 'item'}`,'s were imported <br/>',d.exists_count,' already exists'].join(''));   
            }else cv_interact.error(res.error_message);
        });
    }

    this.deleteRole = (role_id)=>{
        let p = {id:role_id};
        vsapi.call([main_view.base_url,'/api/role/delete'].join(''),p,false,false).then(res =>{
           if(res.status_code ==200){
             mThis.loadRoles(mThis.getFilterData(),roles =>{
                 mThis.renderRoleCards(roles,null,null);
             }); 
             cv_interact.success(['Role ', (mThis.selected_role? mThis.selected_role.name: '') , ' has been deleted'].join(''));   
           }else cv_interact.warning(res.error_message);
        }) 
    }

    this.renderRoleCards = (data, container = null,selected_role = null) => {;
        let html = '';
        let cnt = 0;
        container = container || mThis.div_role_list;
        if (container.style.display =='none') mThis.setRoleListState(1);
        container.innerHTML =  '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';
        (data || []).map(item =>{ 
            html = [ html,`<div data-id="`,item.id,`" data-roleid="`,item.id,`" data-usersearchvalue="`,item.user_search_value,`" data-userclass="${item.user_class}" data-rolename="${item.name}" class="col-sm-2 role-card">
            <div class="card-content card bg-white shadow p-2 border rounded-3 d-flex flex-column justify-content-between" data-roleid="${item.id}" style="height:20vh;min-width:120px;">
               <div class="d-flex flex-column justify-content-center align-items-center p-2">
                  <span class="data-input text-primary-custom text-center" style="font-size:1em" data-field="user_class">${item.name}</span>
                  <span class="role-name-title mt-2">
                    ${item.name.charAt(0).toUpperCase()} 
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: ${item.user_count ?? 0}</span>

                <div class="d-flex flex-row justify-content-between align-items-center border-top border-1">
                  <span class="text-muted p-1">${item.user_class ?? 'NA'}</span>
                  <div class="edit_menus d-flex flex-row flex-wrap justify-content-end gap-2" style="visibility:hidden">
                    <a data-roleid="`,item.id,`" href="javascript:void(0)" class="lnk-edit-role"><span class="pr-2 pl-2 pt-1 pb-1 bg-info border rounded-4" ><i class="fa fa-pencil text-white fw-semibold"></i></span></a>
                    <a data-roleid="`,item.id,`"  href="javascript:void(0)" class="lnk-delete-role"><span class="pr-2 pl-2 pt-1 pb-1 bg-danger rounded-4"><i class="fa fa-times text-white"></i></span></a>
                  </div> 
                </div>
            </div>
           
         </div>`].join('');
          cnt++;
        });
        container.innerHTML = html;

        /** Hide RoleTabView initially if there is no Role selected at first show */
          if(!mThis.selected_role){
            try{
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display= 'none';
            }catch (e){
                console.error(e);
            };
        }  
        
        container.addEventListener('mouseenter',e=>{
           e.preventDefault();
           let x = mThis.lnkToggleRoleList.dataset;
           const role_list_state = x? x.state:null;
           if(role_list_state == 1) container.style.overflowX = 'auto';  
        });

        container.addEventListener('mouseleave',e=>{
            e.preventDefault();
            container.style.overflowX = 'hidden';  
         });

        container.querySelectorAll('div.role-card').forEach(div =>{
            div.onmouseleave = e=>{
                e.preventDefault();
                let edit_menus = div.querySelector('div.edit_menus');
                if(edit_menus){
                   setTimeout(()=>{
                    edit_menus.style.visibility = 'hidden';
                   },60);
                } 
            }
        });

        container.onclick = e =>{
            e.preventDefault();
            let card = VSUtil.closestLimited(e.target, 'div.role-card');
            if(card){  
               Array.from(container.children).map(x =>{
                    if(x !== card) x.classList.remove('selected');
                });
                card.classList.add('selected');

                let role_id = card.dataset.roleid || card.dataset.id;
                let user_class = card.dataset.userclass; 
                let role_name = card.dataset.rolename || card.dataset.name; 
                const selected_role = {"role_id":role_id,"user_class":user_class, "name":role_name};
                mThis.lblSelectedRoleName.innerHTML = selected_role.name;
                mThis.selected_role = selected_role;
                //alert(JSON.stringify(mThis.selected_role));
                RoleTabView.displayContent(selected_role);
                return;
            }
        };
 
       let card = null; 
       let user_search_value = null;
       if(cnt ===1){
            card = container.querySelector('div.role-card');
            if(card) user_search_value = card.dataset.usersearchvalue;
       }else if (cnt >1 ){
            if(!selected_role) 
               card = container.querySelectorAll('div.role-card')[0]; 
            else{
               card = mThis.getRoleCard(selected_role.id || selected_role.role_id);
            }
       }else{
          container.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><h5>No roles were found!</h5></div>'
       }

       let role = null;
       if(card){
         const role_id = card.dataset.roleid || card.dataset.id;
         role = {
            "role_id":role_id,
            "id":role_id,
            "name":card.dataset.rolename || card.dataset.name,
            "user_class":card.dataset.userclass
         }
         card.classList.add('selected');
          mThis.selected_role = role; // ensure one role is selected on first load
         mThis.scrollCardToView(card);
         mThis.lblSelectedRoleName.innerHTML = role.name;
       }
       RoleTabView.displayContent(role,null,{"user_search_value":user_search_value}); 
    }
 
    this.scrollCardToView =(div_card) =>{
        //mThis.div_role_list.style.overflow = 'auto';
        div_card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //mThis.div_role_list.style.overflow = 'hidden';
    }

    this.getRoleCard = (role_id)=>{
        let found_card = null;
        mThis.div_role_list.querySelectorAll('div.role-card').forEach(div =>{
            let m_id = div.dataset.id || div.dataset.roleid;
            if(m_id ==role_id){
                found_card = div;
                return false;
            }
        }); 
        return found_card;
    }

    /** displayItems() display items by category as its header similiar to Report Center's reports display layout */
    this.displayItems = (data, div) => {
        div.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';
     
            let html = '';
            Object.values(data).forEach(cat => {
                let item_html = '';
                cat.list.map(rpt =>{
                    item_html = [item_html,`<a class="rpc-report text-black" href="javascript:void(0)" data-code="`,rpt.code,`" data-id="`,rpt.id,`">`,'<i class="fs-5 fa fa-pointer text-muted"></i> ',rpt.name,`</a>`].join('');
                    mThis.reports[rpt.code] = rpt;
                });
                
                let group_html = ['<a href="javascript:void(0)" class="rpc-group-header fs-5 d-block" data-category="',cat.category,'" data-categoryid="',cat.id,'">','<span class="text-nowrap fw-semibold p-2">','<img class="rpc-category-icon" src="', main_view.asset_url,'/images/icons/report.png','"> ',cat.category,'</span>','</a>'].join('');
                group_html = [group_html,`<div class="rpc-reports d-flex flex-column gap-2 justify-content-start align-items-start flex-wrap p-2 overflow-hidden">`,item_html,`</div>`].join('');
                html = [html, group_html].join('');
            });
            mThis.div_report_list.innerHTML = html;
    }

    this.loadRoles = (filter, onFinish)=>{
        filter = filter || {"search_value":mThis.elSearchRole.value};
        vsapi.call(`${main_view.base_url}/api/role/list`,filter,null,false).then(res =>{
           const roles = res.status_code ==200? res.data : [];
           onFinish(roles);
        })
        .catch((e)=>{
            console.error(e);
            onFinish([]);
        });
    }


    function slideDown(element, duration = 500, onFinish = null) {
        // Check if the element is already fully visible
        if (element.style.display === 'block' && element.style.maxHeight === 'none') {
            return;
        }
    
        element.style.display = 'block';
        element.style.overflow = 'hidden';  // Ensure content overflow is hidden
        let height = element.scrollHeight + 'px';
        element.style.maxHeight = '0';
        element.offsetHeight; // Trigger a reflow, flushing the CSS changes
        element.style.transition = `max-height ${duration}ms ease-in-out`;
        element.style.maxHeight = height;
    
        setTimeout(() => {
            element.style.maxHeight = 'none';
            if (onFinish) onFinish();
        }, duration);
    }
    
    function slideUp(element, duration = 500, onFinish = null) {
        // Check if the element is already hidden
        if (element.style.display === 'none' || element.style.maxHeight === '0px') {
            return;
        }
    
        // Ensure the element's height is set before starting the transition
        element.style.maxHeight = element.scrollHeight + 'px';
        element.offsetHeight; // Trigger a reflow, flushing the CSS changes
        element.style.transition = `max-height ${duration}ms ease-in-out`;
        element.style.maxHeight = '0';
    
        setTimeout(() => {
            element.style.display = 'none';
            element.style.maxHeight = '0';
            if (onFinish) onFinish();
        }, duration);
    }

      
    /** if state == null => setRoleListState() is like toggleRoleList() */
    this.setRoleListState = (state = null,duration = 600) =>{
        const div =  mThis.div_role_list;
        mThis.lnkToggleRoleList.classList.add('disabled');
        if(state === 1){
           //div.classList.add('d-flex');
           //div.style.display ='flex';
          // *** Todo: later put funcitons slideDown() and slideUp() in general reusable library
           slideDown(div,duration,()=>{
            mThis.lnkToggleRoleList.dataset.state =1;
            mThis.lnkToggleRoleList.innerHTML = `<i class="fa fa-minimize text-white fs-6"></i>`;
            mThis.lnkToggleRoleList.classList.remove('disabled');
           });
        //   setTimeout(() => {
        //     div.classList.remove('fade-out');
        //     div.classList.add('fade-in');
        //   }, 500); // A small delay to ensure fade-in works properly

        }else if (state === 0){
            //div.classList.remove('d-flex','fade-in');
          
            slideUp(div,duration,()=>{
                mThis.lnkToggleRoleList.dataset.state =0;
                mThis.lnkToggleRoleList.innerHTML = `<i class="fa fa-maximize text-white fs-6"></i>`;
                mThis.lnkToggleRoleList.classList.remove('disabled');
                //mThis.div_role_list.innerHTML = '<div class="d-flex justify-content-center"><a href="javascript:void(0)"> <i class="fas fa-chevron-double-down fs-5 fw-semibold"></i> </a></div>'; 
            });
            // setTimeout(() => {
            //     div.style.display = 'none';
            // }, 500);

        }else{
            let x = state ==1? 0:1;
            this.setRoleListState(x);
        }
    }

    this.init = () => {
        if(mThis.initAlready) return;

        mThis.searchWidget = new SearchWidget(mThis.div_search_widget,{
            inputClass:'form-control-sm form-control border border-secondary rounded-4',
            placeHolder:'Search role or user',
            onkeyup:(value,e)=>{
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(()=>{
                    let p =  {"search_value":value};
                    mThis.loadRoles(p, roles =>{
                        mThis.renderRoleCards(roles);
                    });
                },250);
            }
        });
  
        mThis.lnkToggleRoleList.onclick = e =>{
             e.preventDefault();
             //state => 1 = Maximized or view list, 0 = Minimized
             let state = mThis.lnkToggleRoleList.dataset.state;
             mThis.setRoleListState(state);
        }

        mThis.div_role_list.onmouseover = e=>{
            e.preventDefault();
            let card = VSUtil.closestLimited(e.target,'div.role-card');
            if(card){
                let edit_menus = card.querySelector('div.edit_menus');
                if(edit_menus){
                   setTimeout(()=>{
                    edit_menus.style.visibility = 'visible';
                   },60); 
                } 
            } 
        }
  
        this.div_role_list.addEventListener('click', e=>{
            e.preventDefault();
              //Click on Delete Role icon
            let lnk = VSUtil.closestLimited(e.target,'a.lnk-delete-role');
            if(lnk){
               let role_id = lnk.dataset.roleid;
               if(!AuthManager.allowed(103)) return;
               cv_interact.confirm(['Delete ', (RoleTabView.selected_role? `role ${RoleTabView.selected_role.name}`: 'this role') ,' permanently?'].join(''),{context:"delete","title":"Delete Role",confirmButtonText:"Delete"}, e=>{
                    if(e){
                        mThis.deleteRole(role_id);
                    }
               }); 
               return;
            } 

            //Click on Edit Role icon
            lnk = VSUtil.closestLimited(e.target,'a.lnk-edit-role');
            if(lnk){
                let role_id = lnk.dataset.roleid;
                if(!role_id || role_id ===0){
                    cv_interact.warning('Role ID is missing');
                    return;
                }
                const op = {
                  id: role_id,
                  onClose:(d)=>{
                        let p = mThis.getFilterData();
                        mThis.loadRoles(p, roles =>{
                            let new_role = d.role;
                            mThis.renderRoleCards(roles,null,new_role);
                        }); 
                  }
                };
                if(!AuthManager.allowed(104)) return;
                RoleDialog.show(op);
                return;
            }
     
        });

         
        mThis.lnkNewRole.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                id: null,
                group_id:1,
                onClose:(d)=>{
                    let p = mThis.getFilterData();
                    mThis.loadRoles(p, roles =>{
                        let new_role = d.role;
                        mThis.renderRoleCards(roles,null,new_role);
                    }); 
                }
            }
            if(!AuthManager.allowed(102)) return;
            RoleDialog.show(op);
        });
      
        mThis.initAlready = true;
    }
 
    this.getFilterData = ()=>{
        let p = {};
        p.search_value = mThis.searchWidget? mThis.searchWidget.getValue() : ''; 
        return p; 
    }
    
    this.show = (options)=>{
        options = options || {};
        mThis.init();
        mThis.selected_role = null;
        mThis.options = options;
        mThis.div_role_list.style.maxHeight='';

        mThis.loadRoles(this.getFilterData(), roles =>{
  
            mThis.setRoleListState(1,0);
            mThis.renderRoleCards(roles,null);
           // mThis.setEvent();

        });
        main_view.setContentView(mThis.self, mThis.title_prop);
    }

    this.updateSelectRole = function(col_name, data){
        let selected_class_name = 'row-selected';
        mThis.div_role_list.querySelector(`tr.${selected_class_name}>td.${col_name}`).innerHTML = data;
    }

};

/** begin:: vs-tab-view for role details */
const RoleTabView = new function(){
    const mThis = this;
    this.self = RoleManagementComponent.self.querySelector('#_um_role_tab');
    this.tabHeader = this.self.querySelector('div.vs-tab-header');
    this.tabBody = this.self.querySelector('div.vs-tab-body');
    this.userListView = null;
    this.tabPages = {};
    this.last_view_name = 'view_users';
    
    const user_cols = [
        {
            title:"Photo",
            data:(data,index,tr)=>{
                return [`<img src="`,data.image_url,`" class="image-student-tbl">`].join('');
            }
 
        },
        {
           title:"Full Name",
           data:(data,index,tr)=>{
               return data.full_name;
           }

        },
        {
           title:"Loin Name",
           className:"login_name",
           data:(data,index,tr)=>{
               let lock_html = data.is_locked ==1? '<span class="d-block text-danger fw-sembold p-1">Locked</span>' : '';
               return [data.login_name,lock_html].join('');
           }

        },
        {
            title:"User Class",
            data:(data,index,tr)=>{
                return data.user_class;
            }
 
        },
        {
            title: "Primary Role",
            data: (data, index, tr) => {
                return [
                    '<span class="d-block">', data.role_name, '</span>',
                    data.official_code
                        ? '<span class="text-left p-1"><span class="text-nowrap">ID: </span>' + data.official_code + '</span>'
                        : ''
                ].join('');
            }
        },
        {
           title:"Last Login",
           data:(data,index,tr)=>{
               return `<span class="d-block p-1">Last login: ${data.last_login_date || 'N/A'}</span>`;

           }

        },
        {
           title:"Created By",
           data:(data,index,tr)=>{
               return ['<span class="d-block">', data.create_user ,'</span><span class="d-block text-muted"><small>',data.create_date,'</small></span>'].join('');
           }

        },
        {
            title:"Action",
            data:(data,index,tr)=>{
                return [`<div class="d-flex gap-2 flex-wrap">`,
                // `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-edit-user"><i class="fa fa-edit"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-reset-password"><i class="fa fa-key text-warning"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" data-action="`,(data.is_locked ==1? 'unlock':'lock'),`" class="lnk-lock-user"><i class="${data.is_locked==1? 'fa fa-unlock text-info':'fa fa-lock text-danger'}"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-remove-user"><span class="p-1 rounded-4"><i class="fa fa-times text-danger fw-bold"></i></span></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="user_action"><span class="p-1 rounded-4"><i class="fa fa-tasks text-info fw-bold"></i></span></a>`,
                `</div>`].join('');
            }
 
         }
  ]; 

  mThis.beginSwapItem = (type,op)=>{
     cv_interact.info('Swap Item feature is not yet available');
  }

  mThis.deleteItem = (type,div_item, item_id, onFinish = null)=>{
     let msg = `delete this ${type}?`;
     cv_interact.confirm(msg, {title:`Delete ${type}`, context:'delete'}, e=>{
         if(e){
            let endpoint = `${main_view.base_url}/api`;
            switch((type || "").toLowerCase()){
                case "module":{
                    endpoint = [endpoint,'/module/delete'].join('');
                    break;
                } 
               case "permission":{
                 endpoint = [endpoint,'/permission/delete'].join('');
                 break;
               }
              case "report":
              {
                endpoint = [endpoint,'/report/delete'].join('');
                break;
              } 
              default:{
                cv_interact.error('Invlid item type. Item to delete must be Module, Permission, or report');
                return;
              }
            }

            let p = {id:item_id};
            vsapi.call(endpoint,p,false,false,false).then(res=>{
                if(res.status_code ===200){
                    div_item?.closest('.item-wrapper').remove();
                    if(onFinish) onFinish();
                }else cv_interact.warning(res.error_message);
            });
         }
     });
  }

  mThis.editItem = (type, op)=>{
        switch(type.toLowerCase()){
            case "module":{
                mThis.ModulePanel.createOrUpdateModule(op) 
                break;
            } 
        case "permission":{
            mThis.PermissionPanel.createOrUpdatePermission(op);
            break;
        }
        case "report":
        {
            //Report is a special type of permission. Report is a permission whose category is "Report"
            mThis.ReportPanel.createOrUpdateReport(op);
            break;
        } 
        default:{
            cv_interact.error('Invlid item type. Item to delete must be Module, Permission, or report');
            return;
        }
        }

  }

  mThis.setItemActionButtons = (divContainer, app_id,type, onDeleted = null)=>{
        if (!divContainer) return;
        divContainer.querySelectorAll('.um-item').forEach(dv =>{
            dv.onmouseover = e =>{
                   let act_div = dv.querySelector('.um_prn_actions');
                    if(!act_div){
                        act_div = document.createElement('div');
                        act_div.className = "um_prn_actions d-flex flex-row gap-3";
                        act_div.innerHTML = [
                            '<a class="um_lnk_edit" href="javascript:void(0)"><i class="fa fa-pencil"></i></a>',
                            '<a class="um_lnk_delete" href="javascript:void(0)"><i class="fa fa-trash text-danger"></i></a>',
                            '<a class="um_lnk_swap" href="javascript:void(0)"><i class="fa fa-transfers"></i>Swap</a>'
                        ].join('');
                        dv.querySelector('.um-item-name').after(act_div);
                        act_div.onclick = e =>{
                            let lnk = VSUtil.closestLimited(e.target,'.um_lnk_edit');
                            if(lnk){
                                let d = lnk.closest('.item-wrapper')?.dataset;
                                 d =d || {};
                                let item_id = d.id;
                                let ds = {
                                  report_id: d.reportid,
                                  code: d.code,
                                  params: d.params,
                                  export_pdf: d.export_pdf,
                                  export_excel : d.export_excel,
                                  export_csv: d.export_csv,
                                  display_order : d.displayorder
                                }
                                if(!item_id){
                                    cv_interact.error('Item ID is unexpectedly missing!');
                                    return;
                                }
                                /** NOTE that the api/report/save() will handling saving or creating new report in both tables, first in "um_permissions" and then in table "reports" */ 
                                let op = {
                                    id:item_id,
                                    app_id : app_id,
                                    ...ds // This variable "ds" contains all necessary report's attributes such as report_group, code, params,export_excel, export_pdf, 
                                }
     
                                //Modify module, permission, and report
                                mThis.editItem(type, op); 
                                return;
                            }

                            lnk = VSUtil.closestLimited(e.target,'.um_lnk_delete');
                            if(lnk){
                                let item_id = lnk?.closest('.item-wrapper')?.dataset.id;
                                if(!item_id){
                                    cv_interact.error('Item ID is unexpectedly missing!');
                                    return;
                                }
                                //Delete Module, Permission, and Report
                                mThis.deleteItem(type, dv, item_id, onDeleted); 
                                return;
                            }

                            lnk = VSUtil.closestLimited(e.target,'.um_lnk_swap');
                            if(lnk){
                                let item_id = lnk.dataset.id;
                                let op = {
                                    id:item_id,
                                    app_id : app_id
                                }
                                //Edit or Update Module, Permission, and Report
                                mThis.beginSwapItem(type, op); 
                                return;
                            }
                        }
                    }
                    if(act_div){
                        act_div.style.visibility ='visible';
                        act_div.classList.add('fade-in');
                    }
             }

             dv.onmouseleave = e =>{
                let test = dv.querySelector('.um_prn_actions');
                if(test) {
                    test.classList.remove('fade-in');
                    test.style.visibility = 'hidden';
              }
             
            }
             
        });
  
 }
 

/** begin:: AppPanel definition */
 this.AppPanel = new function(){
     const that = this;
     this.self = mThis.tabBody.querySelector('#view_apps');
     this.divAppList = this.self.querySelector('#_um_role_app_list');
     let div = this.divAppList.parentElement?.querySelector('.app_action_buttons');
     if(!div){
        div = this.divAppList.parentElement;
        div.insertAdjacentHTML('afterbegin',`<div class="app_action_buttons"> <a href="javascript:void(0)" class="lnk_add_app p-2">New Application</a></div>`);
        let btn = div.querySelector( 'a.lnk_add_app'); 
        if(btn){
            btn.onclick = e =>{
                e.preventDefault();
                that.createApp();
            }
        } 
    }
    
    //displayAppList()
     this.loadApps =()=>{
        let p = {
            subs_id: main_view.subs_id,
            role_id:mThis.selected_role.role_id,
            show_hidden:1
        };
        vsapi.call(`${main_view.base_url}/api/role/apps`,p,false,false).then(res=>{
            let apps = res.status_code ==200? res.data : [];
            that.renderContent(apps);
        });
     }

     this.renderContent = (apps)=>{
        let html = '';
        apps.map(app =>{
            const allowed = (app.allowed || 0); 
            let checkStatus = (allowed ==1) ? '<i class="fa fa-check text-success fs-3 fw-bold "></i>' : '<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
            html = [html,
                '<div class="app-box d-flex justify-content-between mt-3">',
                  `<div data-id="`,app.id,`" data-ismobile="`,app.is_mobile_app,`" class="um_app d-flex gap-2 rounded-2 shadow p-3 justify-contents-center align-items-center">`,
                    //`<img class="border border-secondary rounded-5" style="width:40px;height:40px" src="/uploads/public/1_data/default/images/mr1.jpg" alt="">`,
                    `<div class="um_app_check d-flex justify-items-center justify-content-center border border-secondary rounded-5 p-1" style="width:35px;height:35px"><a href="javascript:void(0)" data-state="`,allowed,`" class="link_check_app">`,checkStatus,`</a></div>`,
                    `<span class="fs-6 fw-semibold">`,app.name,`</span>`,
                    `<div style="visibility:hidden" class="div_app_action d-flex flex-row gap-2">`,
                       `<a class="lnk_delete_app" data-id="`,app.id,`" href="javascript:void(0)"><i class="fa fa-trash-can text-danger"></i></a>`,
                       `<a class="lnk_edit_app" data-id="`,app.id,`" href="javascript:void(0)"><i class="fa fa-pencil"></i></a>`,
                       `<a class="lnk_copy_app_id" data-id="`,app.id,`" href="javascript:void(0)"><i class="fa fa-save"></i></a>`,
                    `</div>`, 
                `</div>`,
              '</div>'].join('');
        });

        that.divAppList.innerHTML = html;
        let max_width = 0;
        const appBoxes = that.divAppList.querySelectorAll('div.app-box');
        appBoxes.forEach(div_app => {
            max_width = Math.max(max_width, div_app.offsetWidth);
        });
        
        appBoxes.forEach(div_app => {
            div_app.querySelector('.um_app').style.width = `${max_width}px`;

            div_app.onmouseover = e =>{
                div_app.querySelector('.div_app_action').style.visibility = 'visible';
            }
            div_app.onmouseleave = e =>{
                div_app.querySelector('.div_app_action').style.visibility = 'hidden';
            }
        });

        that.divAppList.onclick = e =>{
             e.preventDefault();
             let btn = VSUtil.closestLimited( e.target,'.link_check_app');
             if(btn){
                that.toggleCheck(btn);
                return;
             }
            btn = VSUtil.closestLimited(e.target,'.lnk_delete_app'); 
            if(btn){
                const app_id = btn.dataset.id;
                that.deleteApp(app_id);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.lnk_edit_app'); 
            if(btn){
                const app_id = btn.dataset.id;
                that.createApp({"id":app_id});
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.lnk_copy_app_id'); 
            if(btn){
                const app_id = btn.dataset.id;
                that.copyToClipboard(app_id);
                return;
            }
        }
     }
 
     this.createApp = (op)=>{
        that.AppDialog = that.AppDialog || new GeneralDialog({  
         createContent:()=>{
           return [
             `<div class="form-group col-md-12">
                <label vslang="titles.App Name">App Name</label>
                <input type="text" class="form-control data-input"  name="name" data-field="name" placeholder=" " />
              </div>`,
              `<div class="form-group col-md-12">
               <label vslang="titles.Is Mobile App">Is Mobile App</label>
                <select class="data-input" name="is_mobile_app" data-field="is_mobile_app"></select>
               </div>`,
               `<div class="form-group col-md-12">
                    <label vslang="titles.Home Route">Home Route</label>
                    <input class="form-control data-input" name="home_route" data-field="home_route" placeholder=" " />
                </div>`,
             `<div class="form-group col-md-12">
                <label vslang="titles.User Class">User Class</label>
                <select class="data-input" name="user_class" data-field="user_class"></select>
             </div>`,
            ].join('');
         },
          contentCreated:(me)=>{
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    // btnClose.classList.add('d-none');
                    header.classList.add('bg-primary-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';
                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                

                    headerTitle.classList.add('text-white', 'text-center', 'w-100');
                    headerWrapper.appendChild(headerTitle);

                    header.innerHTML = '';
                    header.appendChild(headerWrapper);
        
            },
         showCancelButton:true,
         configSelect:[
           {
             name:'user_class',
             data:'user_classes',
             textField:'user_class_name',
             valueField:'user_class'
           }
         ],
         buttons:[
            {
              label:'<span vslang="buttons.Cancel"></span>',
              cssClass: 'btn-vs-cancel',
              click:(me,btn)=>{
                 me.hide(false);
              }
            },
            {
                label:"<span vslang='buttons.Save'>Save</span",
                   cssClass:'btn-vs-save',
                click:(me, btn,divModal)=>{
                     const p = me.getData();
                     
                     p.subs_id = main_view.subs_id;
                     if(!p.subs_id){
                        cv_interact.error('subs_id is missing!');
                        return;
                     }
                     console.log(2,p);
                     vsapi.call(`${main_view.base_url}/api/application/save`,p,btn,false).then(res =>{
                          if(res.status_code ==200){
                             me.hide(true,p);
                             mThis.AppPanel.loadApps();
                          }else cv_interact.error(res.error_message);
                     });
                }
            }
         ],
         prepareFormOptions:{
             modifyTitle:"Edit App",
             createTitle:"Add App",
             api:{
                targetProp:"app",
                endpoint: `${main_view.base_url}/api/application/form-options`,
                params:(dataOption)=>{
                    return {"id":dataOption.id};
                },
                // onResponse:(me,res)=>{
                //      console.log(res.data);
                // }
             }
         },
         onPrepareForm:(me)=>{
             let fields = me.getFields();
             const app_types = [
                {value:0, label:"Web Application"},
                {value:1, label:"Mobile App"}
             ];
             VSUtil.setComboItems(fields.is_mobile_app,app_types,"value","label",null,null,0);
         }
             
       });
      
       that.AppDialog.show(op);
     }

     //Copy AppId to clibaord;
     this.copyToClipboard = (text)=>{
        navigator.clipboard.writeText(text);
    }

     this.deleteApp = (app_id) =>{
        cv_interact.confirm("Delete This application?",{title:"Delete App",context:'delete'},e =>{
           if(e){
                let p = {"app_id":app_id};
                vsapi.call(`${main_view.base_url}/api/application/delete`,p,false,false).then(res =>{
                    if(res.status_code == 200){
                      mThis.AppPanel.loadApps();
                    }else cv_interact.error(res.error_message);
                });
           } 
        });
    }
 
     /** set checkbox will also toggle Checkbox when state is NULL */
     this.toggleCheck = (btn)=>{
         let state = btn.dataset.state;
         state = state ==1? 0:1;
         if(state == 0){
            btn.innerHTML ='<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
            btn.dataset.state =0;
         }else if (state ==1){
            btn.innerHTML ='<i class="fa fa-check text-success fs-3 fw-bold "></i>';
            btn.dataset.state = 1;  
         }
         let allowed = state;
         let div = btn.closest('div.um_app');
         let app_id = div.dataset.id;  
         onAppStatusChange(btn,app_id, allowed);
     }
       
        function onAppStatusChange(btn,app_id, allowed ) {
            const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
            const p = {role_id: role_id, app_id: app_id, allowed : allowed};
           
            vsapi.call(`${main_view.base_url}/api/role/apps/set-status`,p,false,false,false).then(res =>{
                if(res.status_code ==200){
                    return;
                }else {
                    btn.innerHTML ='<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
                    btn.dataset.state =0;
                    cv_interact.warning(res.error_message)
                };
            });
        }

 }
/**end:: AppPanel definition */
 

/** begin: UserPanel defintion */
 this.UserPanel = new function(){
    //NOTE  "mThis" refers to RoleTabView instance
    const that = this;
    this.divSelf =  mThis.tabBody.querySelector('#view_users');
    this.btnAddRoleMember = this.divSelf.querySelector('#_um_role_add_member');
    this.btnCreateUser = this.divSelf.querySelector('#_um_role_create_user');
    this.elSearchUser = this.divSelf.querySelector('#_um_role_search_user');
    
    this.deleteUser = (user_id)=>{
       let p = {"id":user_id}  
      cv_interact.confirm('Delete this user permanently?',{context:"delete",title:"Delete User"}, e=>{
         if(e){
             vsapi.call(`${main_view.base_url}/api/user/delete`,p,false,false).then(res =>{
                 if(res.status_code ==200){
                    mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
                 }else cv_interact.error(res.error_message);
             })
         }
      });
    }

    // //CreateUser
    // this.createLogin = (user_class=null)=>{
    //     const op = {
    //         user_id: null,
    //         open: 'add-user',
    //         default: {
    //             official_code: "",
    //             user_class: mThis.selected_role.user_class,
    //             role_id:mThis.selected_role.role_id,
    //             phone_number: "",
    //             full_name: ""
    //         },
    //         onClose: (user) => {
    //             if (user){
    //                 that.elSearchUser.value =  user.login_name;
    //                 mThis.userListView.showPage(that.getFilterData());
    //             }
    //         }
    //     };
    //     if(!AuthManager.allowed(100)) return;
    //     AddUserDialog.show(op);
    // }
   
    this.getFilterData = ()=>{
         return {"role_id":mThis.selected_role? mThis.selected_role.role_id: -1, "search_value":that.elSearchUser.value};
    }
     
    this.btnAddRoleMember.onclick = e =>{
        e.preventDefault();
        if (!mThis.selected_role) {
            cv_interact.error('No role selected!');
            return;
        }

        const op = {
            "multiple_select": true,
            "user_class": null,
            "onClose":(users) =>{
                let ids = '';
                let cnt = 0;
                users.map(u =>{
                    ids = [ids, (ids? '|':'') ,(u.id || u.user_id)].join('');
                    if(u.id > 0) cnt++;
                }); 
               const p = {"role_id":mThis.selected_role.role_id, "user_ids":ids,'is_primary':1};
               vsapi.call([main_view.base_url, '/api/role/add-members'].join(''),p,null,false).then(res =>{
                  if(res.status_code == 200){
                     let d = res.data;
                     mThis.userListView.showPage(RoleTabView.UserPanel.getFilterData());
                     cv_interact.success([d.success_count,' users have been added as members of ', (mThis.selected_role.name || 'the role. NOTE that any user is allowed to have only one role as primary role')].join(''));
                  } else cv_interact.error(res.error_message);
               });
            }
        };
        FindUserDialog.show(op);
    }

    this.btnCreateUser.onclick = e =>{
        e.preventDefault();
        // that.createLogin(null);
        
        const op = {
            id:null,
            btn: e.target,
            role_id: mThis.selected_role.role_id || mThis.selected_role.id,
            onClose: (user)=>{
               that.elSearchUser.value = user.login_name; 
               const role_id = mThis.selected_role.id || mThis.selected_role.role_id;
               mThis.userListView.showPage({"role_id":role_id,"search_value":  that.elSearchUser.value});           
            }
        }

        // UserDialog.show(op); 
        if(!AuthManager.allowed(107)) return;
        CreateLoginDialog.show(op); 
    }
   
    that.elSearchUser.onkeyup = e =>{
        e.preventDefault();
        setTimeout(()=>{
           mThis.userListView.showPage(that.getFilterData());
        },250);
    };  
 }
/** end: Userpanel defintion */
     
/** begin: ModulePanel defintion */
this.ModulePanel = new function(){
    const that = this;
    this.elAppFilter = mThis.self.querySelector('#mod_app_chooser');
    this.elAppFilter.onchange = e=>{
      e.preventDefault();
      that.def_app_id = e.target.value;
      that.displayModules(mThis.selected_role.role_id, that.def_app_id);
    }

    //loadAppOptions
    this.loadAppChoices = async ()=>{
        let apps = await getAccessibleApps();
       
        let icon_apps = apps.map(x =>({
            value: x.id,
            label:`<i class="fas fa-volleyball-ball text-muted"></i>  <span>${x.name}</span>`
        }));
        that.def_app_id = that.def_app_id || (icon_apps[0]? icon_apps[0].value : "");
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",true,"(All Apps)",(that.def_app_id || ""));
        
        that.displayModules(mThis.selected_role.role_id, that.def_app_id);

    }

    this.displayModules = (role_id,app_id)=>{
            mThis.div_modules = mThis.div_modules || mThis.self.querySelector('#_um_role_mod_list');
            let div = mThis.div_modules.parentElement?.querySelector('.mod_action_buttons');
            if(!div){
               div =  mThis.div_modules.parentElement; 
                div.insertAdjacentHTML('afterbegin',
                    `<div class="mod_action_buttons d-flex flex-wrap gap-2">
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_add_module">New Module</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_import_modules">Import</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_export_modules">Export</a>
                    </div>
                `);

                div.addEventListener('click', e=>{
                    e.preventDefault();
                    let btn = VSUtil.closestLimited(e.target,'#_um_lnk_add_module');
                    if(btn){
                        let op = {app_id: that.elAppFilter.value};
                        that.createOrUpdateModule(op); 
                        return;
                    }

                    btn = VSUtil.closestLimited(e.target,'#_um_lnk_import_modules');
                    if(btn){
                        that.importModules(); 
                        return;
                    }

                    btn = VSUtil.closestLimited(e.target,'#_um_lnk_export_modules');
                    if(btn){
                        that.exportModules(); 
                        return;
                    }
                }); 
            }

            mThis.modulesList = mThis.modulesList || new  UMExpandItemView(mThis.div_modules,{
                emptyInfoText:"No module control list",
                headerClass:"mod-category",
                itemName:"Module",
                statuses:{
                    1: {
                    name:'Allowed',  
                    signClass:'fa fa-check text-success fs-5', 
                    //cssClass:'text-success', 
                    textColorClass:'text-success',
                    backgroundClass:'' 
                    }, 
                0:{
                    name:'Denied',
                    signClass:'fa fa-times text-danger fs-5',
                    //cssClass:'text-danger',
                    textColorClass:'text-danger',
                    backgroundColorClass:''
                }
                },
                onStatusChange:(statusInfo,item_id,parent_id,checkBox)=>{
                    //console.log('todo: save permission via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
                    const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
                    const p = {
                        "role_id": role_id,
                        "module_id":item_id,
                        "app_id": parent_id,
                        "status_id": (statusInfo.status_id || statusInfo.id)
                    };
                    vsapi.call(`${main_view.base_url}/api/role/modules/set-status`,p,false,false).then(res =>{
                        if(res.status_code ==200){
                           return;
                        }else{
                            mThis.modulesList.setCheck(checkBox,0);
                            cv_interact.warning(res.error_message);
                        }
                    });
                }
            });

            const p = {"role_id":role_id,"app_id":app_id,"order_by":"display_order"};
            vsapi.call(`${main_view.base_url}/api/role/modules`,p,false,false,false).then(res =>{
                let data = res.status_code ==200 ? res.data : [];
                mThis.modulesList.setData(data);
                mThis.setItemActionButtons(mThis.modulesList.getContainer(), app_id,"module");
            });
           
        }

        this.deleteModule = (id)=>{
            let p = {id:id};
            cv_interact.confirm("Delete this module?",{title:"Delete Module",context:'delete'}, e=>{
              if(e){
                 vsapi.call(`${main_view.base_url}/api/module/delete`,p,false,false).then(res=>{
                     if(res.status_code ==200){
                       that.displayModules(mThis.selected_role.role_id, that.elAppFilter.value);
                     }else cv_interact.warning(res.error_message);
                   });
              }
            });
         }
     
         this.importModules = (app_id) =>{
             //Import json file
             FileChooser.chooseFile({accept:"*.json, application/json", dataFormat:"normal"},d =>{
                try{
                    const data = JSON.parse(d.content); 
                    RoleManagementComponent.importData(d.fileContent,"module",()=>{
                        that.elAppFilter.dispatchEvent(new Event("change"));
                    });
                }catch (e){
                    console.error(e);
                    cv_interact.error('There was a problem parsing data into JSON format');
                }
             });
         }

         this.exportModules= (app_id) =>{
            let d = that.getModuleList();
            RoleManagementComponent.exportData(d,"modules");
          }
       
          function cleanItemName(str) {
              // Use a regular expression to find the last part enclosed in parentheses
              return str.replace(/\s*\(\d+\)$/, '');
          }
          //get permission list for exporting as json file
          this.getModuleList = ()=>{
              let div = mThis.modulesList.getContainer();
              let divItems = div.querySelectorAll('div.item-wrapper');
              let items = [];  
              divItems.forEach(div =>{
                const d = div.dataset;
                let item = {
                  id: d.id,
                  app_id: d.parentid || d.appid,
                  name: cleanItemName(div.querySelector('.um-item-name').textContent)
                }
                 items.push(item); 
              });
              return items;
          }
      
        
         this.createOrUpdateModule = (op)=>{
           that.ModuleDialog = that.ModuleDialog || new GeneralDialog({
              cssClass:"",
              createContent:()=>{
                return [
                  `<div class="form-group col-md-12">`,
                  `<label class="form-label" vslang="titles.Role Group">Role Group</label>`,
                    `<div><select name="app" class="form-control data-input" data-field="app_id"></select></div>`,
                  `</div>`,
                 `<div class="form-group col-md-12">`,
                    `<label vslang="titles.Module Name">Module Name</label>`,
                    `<input type="text" name="name" class="form-control data-input" data-field="name" placeholder=" " />`,
                 `</div>`,
                 `<div class="form-group col-md-12">`,
                   `<label vslang="titles.Visibility">Visibility</label>`,
                   `<div><select name="visibility"  class="form-control data-input" data-field="hidden"></select></div>`,
                 `</div>`,
               ].join('');
              },
               contentCreated:(me)=>{
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-primary-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                    headerTitle.classList.add('text-white','text-center', 'w-100');
                    headerWrapper.appendChild(headerTitle);
                    header.innerHTML = '';
                    header.appendChild(headerWrapper);
  
            },
              //showCancelButton:true,
              buttons:[
                {
                  label:"<span>Cancel</span>",
                  cssClass:"btn-vs-cancel",
                  click:(me,btn)=>{
                     me.hide(false);
                  }
                },
                   {
                     label:"<span>Save</span>",
                     cssClass:'btn-vs-save',
                     click:(me,dataOptions, divModal)=>{
                         let p = me.getData();
                         vsapi.call(`${main_view.base_url}/api/module/save`,p,false,false,false).then(res =>{
                             if(res.status_code == 200){
                                me.hide();
                                let app_id = me.controls.app.value; 
                                if(app_id){
                                  that.elAppFilter.value = app_id;
                                  that.elAppFilter.dispatchEvent(new Event("change"));
                                }
                                cv_interact.success(['Module ', (res.data.name? `named ${res.data.name} (${res.data.id})`: '') ,' has been saved'].join(''));
                             }else cv_interact.error(res.error_message); 
                         })
                     }
                 }
              ],
              configSelect:[
                {
                    name:"visibility",
                    data:"visible_options",
                    defaultValue: 0, //not hidden, so it is visible
                },
                {
                    name:"app",
                    data:"apps",
                    defaultValue:(me,dataOptions)=>{
                        return dataOptions.app_id;
                    }
                }
              ],
              prepareFormOptions:{
                 createTitle:"New Module",
                 modifyTitle:"Edit Module",
                 targetProp:"module",
                 api:{
                     endpoint:`${main_view.base_url}/api/module/form-options`,
                     params:(dataOptions)=>{
                         return {id: dataOptions.id};
                     }
                 }
              },
              onShow:(me)=>{
                me.controls.name.select();
                me.controls.name.focus();
                // me.controls.visibility.value = 1;
                // me.controls.visibility.dispatchEvent(new Event("change"));
                // me.controls.app.value = me.dataOptions.app_id;
                // me.controls.app.dispatchEvent(new Event("change"));
              }
           });
      
           that.ModuleDialog.show(op);
         }

}
/**end: Modulepanel definition */

/** begin: PermissionPanel defintion */
this.PermissionPanel = new function(){
    const that = this;
    this.elAppFilter = mThis.self.querySelector('#prn_app_chooser');
    this.elSearchPrn = mThis.self.querySelector('#prn_search');
    this.elAppFilter.onchange = e=>{
        e.preventDefault();
        that.def_app_id = e.target.value || "";
        that.displayPermissionList(mThis.selected_role.role_id, that.def_app_id, that.elSearchPrn.value);
    }

    this.elSearchPrn.onkeyup = e =>{
       e.preventDefault();
       setTimeout(()=>{
            if((e.target.value || '').length > 0){
                that.elAppFilter.value ="";
            }
            that.elAppFilter.dispatchEvent(new Event("change"));
       },250);
      
    }

    this.loadAppChoices = async ()=>{
        let apps =  await getAccessibleApps();
        let icon_apps = apps.map(x =>({
            value: x.id,
            label:`<i class="fas fa-volleyball-ball text-muted"></i>  <span>${x.name}</span>`
        }));
        that.def_app_id = that.def_app_id || (apps[0]?.id);
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",true,"All Applications",(that.def_app_id || ""));
        
        that.displayPermissionList(mThis.selected_role.role_id, that.def_app_id, that.elSearchPrn.value);

    }

    this.displayPermissionList = (role_id, app_id,search_value)=>{
        mThis.div_permissions = mThis.div_permissions || mThis.self.querySelector('#_um_role_prn_list');
        let div = mThis.div_permissions.parentElement?.querySelector('.prn_action_buttons');
            if(!div){
               div =  mThis.div_permissions.parentElement;
               div.insertAdjacentHTML('afterbegin',
                    `<div class="prn_action_buttons d-flex flex-wrap gap-2">
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_add_prn">New Permission</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_import_prns">Import</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_export_prns">Export</a>
                    </div>
                `);
             div.querySelector('.prn_action_buttons').onclick = e =>{
                e.preventDefault();
                let btn = VSUtil.closestLimited(e.target,'#_um_lnk_add_prn');
                if(btn){
                    let op = {
                        app_id: that.elAppFilter.value
                    };
                    that.createOrUpdatePermission(op); 
                    return;
                }

                btn = VSUtil.closestLimited(e.target,'#_um_lnk_import_prns');
                if(btn){
                     //Import json file
                    that.importPermissions();
                    return;
                }

                btn = VSUtil.closestLimited(e.target,'#_um_lnk_export_prns');
                if(btn){
                    that.exportPermissions(that.elAppFilter.value);
                    return;
                }
             };   
        }

        that.prnAttributes = ['category','module_id'];
        mThis.permissionList = mThis.permissionList || new UMExpandItemView( mThis.div_permissions,{
            emptyInfoText:"No permission control",
            headerClass:"prn-category",
            itemDataset: that.prnAttributes,
            itemName:"Permission",
            statuses:{
                1: {name:'Allowed',  
                  signClass:'fa fa-check text-success fs-5', 
                  //cssClass:'text-success', 
                  textColorClass:'text-success',
                  backgroundClass:'' 
                }, 
               0:{
                name:'Denied',
                signClass:'fa fa-times text-danger fs-5',
                //cssClass:'text-danger',
                textColorClass:'text-danger',
                backgroundColorClass:''
              }
            },
            onStatusChange:(statusInfo,item_id,parent_id, checkBox)=>{
                const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
                const p = {
                    role_id: role_id,
                    prn_id: item_id,
                    status_id: statusInfo.status_id
                };
                vsapi.call(`${main_view.base_url}/api/role/permissions/set-status`,p,false,false).then(res =>{
                     if(res.status_code ==200){
                        return;
                     }else cv_interact.warning(res.error_message);
                });
                //console.log('todo: save permission via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
            }
        });
     
            let p = {"role_id":role_id,"app_id":app_id, "search_value":search_value,"order_by":"display_order"};
            vsapi.call(`${main_view.base_url}/api/role/permissions`,p,false,false,false).then(res =>{
                let data = res.status_code ==200 ? res.data : [];
                mThis.permissionList.setData(data);
                mThis.setItemActionButtons(mThis.permissionList.getContainer(), app_id,"permission");
            });
    }

    this.deletePermission = (id)=>{
       let p = {id:id};
       cv_interact.confirm("Delete this module?",{title:"Delete Module",context:'delete'}, e=>{
         if(e){
            vsapi.call(`${main_view.base_url}/api/module/delete`,p,false,false).then(res=>{
                if(res.status_code ==200){
                  that.displayModules(mThis.selected_role.role_id, that.elAppFilter.value);
                }else cv_interact.warning(res.error_message);
              });
         }
       });
    }

    this.importPermissions = () =>{
        FileChooser.chooseFile({accept:"*.json, application/json", dataFormat:"normal"},d =>{
            try{
                const data = JSON.parse(d.content); 
                RoleManagementComponent.importData(data,"permission",()=>{
                    that.elAppFilter.dispatchEvent(new Event("change"));
                });
            }catch (e){
                console.error(e);
                cv_interact.error('There was a problem parsing data into JSON format');
            }
         });
    }

    this.exportPermissions = (app_id) =>{
      let d = that.getPermissionList();
      RoleManagementComponent.exportData(d,"prns");
    }
 
    function cleanItemName(str) {
        // Use a regular expression to find the last part enclosed in parentheses
        return str.replace(/\s*\(\d+\)$/, '');
    }

    //get permission list for exporting as json file
    this.getPermissionList = ()=>{
        let div = mThis.permissionList.getContainer();
        let divItems = div.querySelectorAll('div.item-wrapper');
        let items = [];  
        divItems.forEach(div =>{
          const d = div.dataset;
          let item = {
            id: d.id,
            app_id: d.parentid || d.appid,
            name: cleanItemName(div.querySelector('.um-item-name').textContent),
          }
          
          that.prnAttributes.map(fieldName =>{
            let dsName = fieldName.replace(/_/g,'').toLowerCase();
            item[fieldName] = d[dsName] || null;
          });

           items.push(item); 
        });
        return items;
    }

    this.createOrUpdatePermission = (op)=>{
        that.PermissionDialog = that.PermissionDialog || new GeneralDialog({
           cssClass:"",
           createContent:()=>{
             return [
              `<div class="form-group col-md-12">`,
                `<label vslang="titles.Permission Number">Permission Number</label>`,
                `<input name ="force_permission_id" class="data-input form-control" data-field="force_permission_id" placeholder=" " />`,
              `</div>`,
              `<div class="form-group col-md-12">`,
                `<label vslang="titles.Applications">Applications</label>`,
                `<div><select name ="app" class="data-input" data-field="app_id"></select></div>`,
              `</div>`,
              `<div class="form-group col-md-12">`,
              `<label vslang="titles.Module">Module</label>`,
              `<div><select name ="module" class="data-input" data-field="module_id"></select></div>`,
              `</div>`,
              `<div class="form-group col-md-12">`,
                `<label vslang="titles.Permission Name">Permission Name</label>`,
                `<input name ="name" class="data-input form-control" data-field="name" placeholder=" " />`,
              `</div>`,
              `<div class="form-group col-md-12">`,
              `<label vslang="titles.Category">Category</label>`,
              `<div><select name="category" class="form-control data-input" data-field="category"></select></div>`,
              `</div>`,
              `<div class="form-group col-md-12">`,
                `<label vslang="titles.Actions">Actions</label>`,
                `<input name ="actions" class="data-input form-control" data-field="actions" placeholder=" " />`,
              `</div>`].join('');
           },
           showCancelButton:true,
           extendMethod:{
             "getData":(me)=>{
                 if (me.dataOptions.id > 0) return null;
                 else return {"force_permission_id": me.controls.force_permission_id.value}; 
             },
             "setData":(me,d)=>{
                me.controls.force_permission_id.value = d.id || d.permission_id;
                me.org_actions = d.actions; //remember original actions if any , especially useful in case of Editing existing permission
             } 
           },
           buttons:[
              {
                  label:"<span>Cancel</span>",
                  cssClass:"btn-vs-cancel",
                  click:(me,btn)=>{
                     me.hide(false);
                  }
                },
                {
                  label:"<span>Save</span>",
                  cssClass:"btn-vs-save",
                  click:(me,btn, divModal)=>{
                      const p = me.getData();
                      vsapi.call(`${main_view.base_url}/api/permission/save`,p,btn, false,false).then(res =>{
                          if(res.status_code ==200){
                              me.hide();
                             const app_id =  me.controls.app.value;
                             if(app_id){
                               that.elAppFilter.value = app_id;
                               that.elAppFilter.dispatchEvent(new Event("change"));
                             }
                             if (res.data.change_id_error){
                                cv_interact.warning(res.data.change_id_error);
                             }else{
                                cv_interact.success(['Permission ', (res.data.name? `named ${res.data.name} (${res.data.id})`: '') ,' has been saved'].join(''));
                             }
                             
                          }else cv_interact.error(res.error_message); 
                      })
                  }
              }
           ],
           configSelect:[
              {
                  name: "app",
                  data:"apps",
                  // filterData:(data,res)=>{
                  //     return data.options;
                  // }
              },
              {
                name:"category",
                data:"categories",
              //   textField:"category",
              //   valueField:"category"
              },
              {
                  name:"module",
                  // data:"modules",
                  // filterOptions:{
                  //     triggerBy:"app",
                  //     filter:(me,data,controls)=>{
                  //       return data.filter(x =>{
                  //          return x.app_id === controls.app.value;
                  //       }); 
                  //     }
                  // },
  
                  valueField:"id",
                  textField:"name",
                  depends:{
                      triggerBy:"app",
                      api:{
                          endpoint:`${main_view.base_url}/api/module/list`,
                          params: (me,dataOptions,controls)=>{
                              return {"app_id": controls.app.value};
                          },
                        //   onResponse:(me,res)=>{
                        //        console.log(111,res.data);
                        //   }
                      }
  
                  }
              }
           ],
           prepareFormOptions:{
              createTitle:"New Permission",
              modifyTitle:"Edit Permission",
              targetProp:"permission",
              api:{
                  endpoint:`${main_view.base_url}/api/permission/form-options`,
                  params:(dataOptions)=>{
                      return {id: dataOptions.id};
                  },
                //   onResponse:(me,res)=>{
                //        console.log(111,res.data);
                //   }
              }
           },
           contentCreated:(me)=>{
              me.getNextPermissionId = async ()=>{
                 const res = await vsapi.get([main_view.base_url,'/api/settings/next-prn-id'].join(''),null,false,false);
                 return res.data;
              }
              me.controls.category.onchange = e =>{
                 const cat = (e.target.value || '').toLowerCase();
                 console.log(22,cat);
                 
                 if(cat ==='report'){
                    me.actions.value = 'view|print|export_pdf|export_excel|export_csv'; 
                 }else{
                    me.actions.value = me.org_actions;
                 } 
              };
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');

                header.classList.add('bg-primary-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

    

                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);

                header.innerHTML = '';
                header.appendChild(headerWrapper);
           },
           onPrepareForm: async (me) => {
             //me.controls.force_id_field.style.display= me.dataOptions.id > 0 ? 'none':'block';
             if(me.dataOptions.id > 0){
                me.controls.force_permission_id.value = me.dataOptions.id;
             }else{
                const test = await me.getNextPermissionId();
                me.controls.force_permission_id.value = await me.getNextPermissionId();
             } 
             me.controls.name.focus();
             me.controls.name.select();
           }
        });
   
        that.PermissionDialog.show(op);
      }
     
}

/**end: PermissionPanel definition */

/** begin: ReportPanel defintion */
this.ReportPanel = new function(){
    const that = this;
    this.elAppFilter = mThis.self.querySelector('#rpt_app_chooser');
    this.elSearchRpt =mThis.self.querySelector('#rpt_search');

    this.elAppFilter.onchange = e=>{
        e.preventDefault();
        that.def_app_id = e.target.value;
        that.displayReportList(mThis.selected_role.role_id, that.def_app_id, that.elSearchRpt.value);
    }
 
    this.elSearchRpt.onkeyup = e =>{
        e.preventDefault();
        setTimeout(()=>{
            if ((e.target.value || "").length > 0){
                 that.elAppFilter.value = "";
            }
            that.elAppFilter.dispatchEvent(new Event("change"));
        },250);
    }

    this.loadAppChoices = async ()=>{
        let apps =  await getAccessibleApps();; 
      
        let icon_apps = apps.map(x =>({
            value: x.id,
            label:`<i class="fas fa-volleyball-ball text-muted"></i>  <span>${x.name}</span>`
        }));
        that.def_app_id = that.def_app_id || (icon_apps[0]? icon_apps[0].value:"");
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",false,null,that.def_app_id);
    }

    this.displayReportList = async (role_id,app_id,search_value) => {
        const that = this;
        role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;

        mThis.div_reports = mThis.div_reports || mThis.self.querySelector('#_um_role_report_list');
         let div = mThis.div_reports.parentElement?.querySelector('.rpt_action_buttons');
            if(!div){
                div =  mThis.div_reports.parentElement;
                div?.insertAdjacentHTML('afterbegin',
                    `<div class="rpt_action_buttons d-flex flex-wrap gap-2">
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_add_report">New Report</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_import_reports">Import</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_export_reports">Export</a>
                        <a href="javascript:void(0)" class="border border-warning rounded-3 p-2" id="_um_lnk_sync_reports">Sync</a>
                    </div>
                `);
                 
                div.querySelector('.rpt_action_buttons').onclick = e =>{
                    e.preventDefault();
                    let btn = VSUtil.closestLimited(e.target,'#_um_lnk_add_report');
                    if(btn){
                        let op = {
                            app_id: that.elAppFilter.value
                        };
                        mThis.ReportPanel.createOrUpdateReport(op);
                        return;
                    }
    
                    btn = VSUtil.closestLimited(e.target,'#_um_lnk_import_reports');
                    if(btn){
                        that.importReports(that.elAppFilter.value);
                        return;
                    }

                    btn = VSUtil.closestLimited(e.target,'#_um_lnk_export_reports');
                    if(btn){
                        that.exportReports(that.elAppFilter.value);
                        return;
                    }

                    btn = VSUtil.closestLimited(e.target,'#_um_lnk_sync_reports');
                    if(btn){
                        that.syncReports(that.elAppFilter.value);
                        return;
                    }
                 }; 
        }
        if (!that.reportActions){
            const res = that.reportActions || await vsapi.get(`${main_view.base_url}/api/settings/report/actions`,null,false);
            that.reportActions = res.data;
        }
       
        //ReportAttributes is only used for collecting report list when user Export report list to .json file, and used for Editing existing report.
        that.reportAttributes = ['report_id','category','module_id','report_group','code','params','export_pdf','export_excel','export_csv','display_order'];
        mThis.reportList = mThis.reportList || new  UMExpandItemView(mThis.div_reports,{
            emptyInfoText:"No controlled reports",
            headerClass:"rpt-category",
            permissionActions: that.reportActions,
            itemDataset: that.reportAttributes,
            itemName:"Report",
            statuses:{
                1: {name:'Allowed',  
                  signClass:'fa fa-check text-success fs-5', 
                  //cssClass:'text-success', 
                  textColorClass:'text-success',
                  backgroundClass:'' 
                }, 
               0:{
                name:'Denied',
                signClass:'fa fa-times text-danger fs-5',
                //cssClass:'text-danger',
                textColorClass:'text-danger',
                backgroundColorClass:''
              }
            },
            onStatusChange:(statusInfo,item_id,parent_id)=>{
                //console.log('todo: save via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
                const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id; 
                const p = {role_id: role_id, prn_id:item_id, app_id:null, status_id : statusInfo.status_id};
                vsapi.call([main_view.base_url,'/api/role/reports/set-status'].join(''),p, null,false).then(res =>{
                    if (res.status_code==200){
                    }else cv_interact.warning(res.error_message);
                });
            }
        });

        const p = {role_id: mThis.selected_role.role_id, app_id:app_id, search_value:search_value};
        vsapi.call([main_view.base_url, '/api/role/reports'].join(''), p,false,false).then(res =>{
             const d = res.status_code ==200? res.data: {};
             mThis.reportList.setData(d);
             mThis.setItemActionButtons( mThis.reportList.getContainer(), app_id,"report");
        });
    }
 
    this.createOrUpdateReport = (op)=>{
        that.ReportDialog = that.ReportDialog || new GeneralDialog({
           cssClass:"modal-md",
           createContent:()=>{
             return [
             '<div class="row g-2">',
              `<div class="col-md-6">`,
              `<label style="color:#0f6694; font-size:11px;" vslang="titles.Application">Application</label>`,
              `<div class="material-input outlined">`,
                `<div><select name ="app" class="data-input" data-field="app_id"></select></div>`,
              `</div>`,
              `</div>`,
              `<div class="col-md-6">`,
              `<label style="color:#0f6694; font-size:11px;" vslang="titles.Module">Module</label>`,

              `<div class="material-input outlined">`,
              `<div><select name ="module" class="data-input" data-field="module_id"></select></div>`,
            `</div>`,
            `</div>`,
              `<div class="col-md-12">`,
              `<div class="material-input outlined">`,
                 `<input name="name" class="form-control data-input" data-field="name" placeholder=" " />`,
                 `<label vslang="titles.Report Name">Report Name</label>`,
              `</div>`,
              `</div>`,

              `<div class="col-md-12">`,
              `<div class="material-input outlined">`,
                 `<input name="code" class="form-control data-input" data-field="code" placeholder= " " />`,
                 `<label vslang="titles.Report Code">Report Code</label>`,
             `</div>`,
             `</div>`,

              `<div class="col-md-12">`,
              `<div class="material-input outlined">`,
                `<input name="params" class="form-control data-input" data-field="params" placeholder= " " />`,
                `<label vslang="titles.Params">Report Filters</label>`,
             `</div>`,
             `</div>`,

              `<div class="col-md-12">`,
              `<div class="material-input outlined">`,
                `<input name="export_group" class="form-control data-input" data-field="report_group" placeholder= " " />`,
                `<label class="form-label" vslang="titles.Report Group">Report Group</label>`,
             `</div>`,
             `</div>`,
    
             `<div class="col-md-6 d-none">`,
                `<div class="material-input outlined">`,
                `<input type="number" name="export_pdf" class="form-control data-input" data-field="export_pdf" placeholder= " " />`,
                `<label vslang="titles.Export to PDF">Export to PDF</label>`,
                `</div>`,
            `</div>`,
          `<div class="col-md-6 d-none">`,
          `<div class="material-input outlined">`,
          `<input type="number" name="export_excel" class="form-control data-input" data-field="export_excel" placeholder= " "/>`,
          `<label vslang="titles.Export to Excel">Export to Excel</label>`,
       `</div>`,
       `</div>`,

    `<div class="col-md-6 d-none">`,
        `<div class="material-input outlined">`,
        `<input type="number" name="export_csv" class="form-control data-input" data-field="export_csv"/>`,
        `<label vslang="titles.Export to CSV">Export To CSV</label>`,
        `</div>`,
     `</div>`,
     `<div class="col-md-12">`,
     `<div class="material-input outlined">`,
        `<input type="text" name="actions" class="form-control data-input" data-field="actions" placeholder= " " />`,
        `<label vslang="titles.Actions">Actions</label>`,
     `</div>`,
     `</div>`,
        `<div class="col-md-12">`,
        `<div class="material-input outlined">`,
            `<input type="number" name="display_order" class="form-control data-input" data-field="display_order" placeholder=" " />`,
            `<label class="form-label" vslang="titles.Display Order">Display Order</label>`,
        `</div>`,
        `</div>`,
    '</div>'     
   ].join('');
    
    },
      contentCreated:(me)=>{
                   
  
            },
           showCancelButton:true,
           buttons:[
              {
                  label:"<span>Cancel</span>",
                  cssClass:"btn btn-sm text-white btn-warning",
                  click:(me,btn)=>{
                     me.hide(false);
                  }
                },
                {
                  label:"<span>Save</span>",
                  cssClass:"btn btn-sm btn-yp-custom",
                  click:(me,btn,divModal)=>{
                      let p = me.getData();
                      //report_id is primary key of table "reports", while "id" is, in fact, the permission's ID 
                    //   let keysToMerge = ['report_id','code','params','export_pdf','export_excel','export_csv','display_order'];

                    //   //Merge the necessary report's attribute data (such as report_id, params, code, export_pdf, ...) with the api's bosy p
                    //   const dOptions = me.dataOptions;
                    //   keysToMerge.forEach(key => {
                    //     if (key in dOptions) {
                    //         if(dOptions.hasOwnProperty(key)) p[key] = dOptions[key] || "";
                    //     }
                    //   });
                    p.report_id = me.dataOptions.report_id;
                      vsapi.call(`${main_view.base_url}/api/report/save`,p,false,false,false).then(res =>{
                          if(res.status_code ==200){
                             me.hide();
                             let app_id = me.controls.app.value 
                             if(app_id){
                               that.elAppFilter.value = app_id;
                               that.elAppFilter.dispatchEvent(new Event("change"));
                             }
                             cv_interact.success(['Report ', (res.data.name? `named ${res.data.name} (${res.data.id})`: '') ,' has been saved'].join(''));
                          }else cv_interact.error(res.error_message); 
                      });
                  }
              }
           ],
           configSelect:[
              {
                  name: "app",
                  data:"apps",
                  // filterData:(data,res)=>{
                  //     return data.options;
                  // }
              },
              {
                  name:"module",
                  // data:"modules",
                  // filterOptions:{
                  //     triggerBy:"app",
                  //     filter:(me,data,controls)=>{
                  //       return data.filter(x =>{
                  //          return x.app_id === controls.app.value;
                  //       }); 
                  //     }
                  // },
  
                  valueField:"id",
                  textField:"name",
                  depends:{
                      triggerBy:"app",
                      api:{
                          endpoint:`${main_view.base_url}/api/module/list`,
                          params: (me,dataOption,controls)=>{
                              return {"app_id": controls.app.value};
                          },
                            onResponse:(me,res)=>{
                               console.log(111,res.data);
                          }
                      }
  
                  }
              }
           ],
           extendMethod:{
              "setData":(me,data)=>{
                  if(!me.dataOptions.id || me.dataOptions.id ==0) me.controls.actions.value = 'view|print|export_excel|export_pdf|export_csv';
              }
           },
           prepareFormOptions:{
              createTitle:"New Report",
              modifyTitle:"Edit Report",
              targetProp:"report",
              api:{
                  endpoint:`${main_view.base_url}/api/report/form-options`,
                  params:(dataOptions)=>{
                      return {id: dataOptions.id};
                  }
              }
           },
           onShow:(me)=>{
             me.controls.name.focus();
             me.controls.name.select();
           }
        });
   
        that.ReportDialog.show(op);
      }

      this.importReports = (app_id)=>{
            //Import json file
            FileChooser.chooseFile({accept:"*.json, application/json", dataFormat:"normal"},d =>{
                try{
                    const data = JSON.parse(d.content); 
                    RoleManagementComponent.importData(data,"report",()=>{
                        that.elAppFilter.dispatchEvent(new Event("change"));
                    });
                }catch (e){
                    console.error(e);
                    cv_interact.error('There was a problem parsing data into JSON format');
                }
             });
      }

      this.exportReports = (app_id) =>{
        const d = that.getReportList();
        RoleManagementComponent.exportData(d,"reports");
      }
   
      this.syncReports = (app_id) =>{
         const p = {app_id, app_id};
         vsapi.call(`${main_view.base_url}/api/um/reports/sync`,p,false,false).then(res =>{
             if(res.status_code ==200){
                const d = res.data;
                cv_interact.success(['html:',d.create_count,' report-permissions created. <br/>', d.sync_count, ' reports with same IDs were synced <br/>',d.missing_module_count,' reports do not have valid module ID'].join(''));
                that.elAppFilter.dispatchEvent(new Event("change")); 
            }else cv_interact.error(res.error_message);
         }); 
      }

      function cleanItemName(str) {
          // Use a regular expression to find the last part enclosed in parentheses
          return str.replace(/\s*\(\d+\)$/, '');
      }

      //get report list for exporting as json file
      this.getReportList = ()=>{
          const div = mThis.reportList.getContainer();
          const divItems = div.querySelectorAll('div.item-wrapper');
          let items = [];  
          divItems.forEach(div =>{
            const d = div.dataset;
            let item = {
              id: d.id,
              app_id: d.parentid || d.appid,
              name: cleanItemName(div.querySelector('.um-item-name').textContent),
            }
             
            that.reportAttributes.map(fieldName =>{
                let dsName = fieldName.replace(/_/g,'').toLowerCase();
                item[fieldName] = d[dsName] || null;
             });

             item.category =  "report", // || d.category
             items.push(item); 
          });
          return items;
      }
  
}
/**end: ReportPanel definition */

 async function getAccessibleApps(){
    const p = {id: (mThis.selected_role.role_id || mThis.selected_role.id)}; 
    let res = await vsapi.call(`${main_view.base_url}/api/role/accessible-apps`,p,false,false,false);
    return res.status_code ==200? res.data : [];
 }

    //begin::init RoleTabView
        this.initOnce = ()=>{
            if (mThis.initAlready) return;
            mThis.tabHeader.querySelectorAll('a.tab-button').forEach(lnk => {
                let page_id = lnk.dataset.target;
                const div = mThis.tabBody.querySelector(`#${page_id}`);
                if(div) mThis.tabPages[page_id] = div;         
            });
        
            this.tabHeader.addEventListener('click', e=>{
                e.preventDefault();
                const lnk = VSUtil.closestLimited(e.target,'a.tab-button');
                if(lnk){
                    let view_name = lnk.dataset.target || lnk.dataset.view;
                    //let view_name = lnk.dataset.view || lnk.dataset.viewname;
                    mThis.displayContent(mThis.selected_role,view_name);
                    mThis.setActivePage(view_name, lnk); 
                    return;
                }
                
            });

            mThis.userListView = new ListView('_um_role_user_list',{     
              tableClass:'table user-table',
              columns: user_cols,
              perPage:10,        
               fetchApi:[main_view.base_url,'/api/role/members'].join(''),
               processResponse:(res)=>{
                   return res.data;
               },
               apiCluster:null,
               rowCreated:(data,index,tr) => {
                 tr.dataset.id = data.id || data.user_id;
                 tr.dataset.login = data.login_name;
                 tr.dataset.fullname = data.full_name;
                 tr.dataset.userclass = data.user_class;
                 tr.dataset.roleid = data.role_id;
               }
            }); 
 
            mThis.tblUsers = mThis.userListView.getTable();

            const userActionOptions = {
                containerElement: mThis.tblUsers,
                // className:"",
                // menuItemClass:"",
                actionButtonClass:'user_action',
                menus:[
                    {
                        //text:"",
                        html:"<span>Change Login Name</span>",
                        icon:"<i class='fa fa-edit text-warning fs-6'></i>",
                        name:"change_login_name"
                    },
                    {
                        html:"<span>Reset Password</span>",
                        icon:"<i class='fa fa-key text-info fs-6'></i>",
                        name:"reset_password"
                    },
                    {
                        //text:"",
                        html:'<span>Delete user</span>',
                        icon:"<i class='fa fa-trash-can text-danger fs-6'></i>",
                        name:"delete_user"
                    } 
                ],
                adjustPosition:{
                    top:0
                },
                // onShow:(me, downdownMenu)=>{
                //     //let d = downdownMenu.dataset;
                //     //let menus = me.getMenus();
                //     //menus.reset_password.style.display='none';
                //     // if(d.status_id ==3)
                //     //   menus.start_delivery.style.display = 'none';
                //     // else menus.start_delivery.style.display = 'block'; 
                // },
                onClick:( (lnk, id, name) =>{
                    switch(name){
                        case 'change_login_name':{
                            let tr = lnk.closest('tr');
                            let oldLoginName = '';
                            if(tr) oldLoginName = tr.querySelector('td.login_name').textContent;
                            let op = {
                                id: id,
                                login_name: oldLoginName,
                                onClose:(p)=>{
                                    mThis.UserPanel.elSearchUser.value = p.login_name;
                                    mThis.userListView.showPage({"search_value":p.login_name});
                                    return;
                                }
                            };
                            ChangeLoginNameDialog.show(op);
                            break;
                       }
                       case 'reset_password':{
                                if(!AuthManager.allowed(109)) return;
                                let op = {
                                    login_name: lnk.dataset.loginname,
                                    id: lnk.dataset.id || lnk.dataset.userid,
                                    onClose:()=>{
                                        return;
                                    }
                                };
                            SetPasswordDialog.show(op);
                         break;
                       }
                       case 'delete_user':{
                         mThis.UserPanel.deleteUser(id,lnk);
                         break;
                       } 
                    }
                    //alert(' is click on  ID '+ id + ' action: ' + action);
                })
             };
 
            new VSDropdownMenu(userActionOptions);

            this.role_container = mThis.userListView.getListContainer();

            const role_parent = mThis.role_container.parentElement;
            role_parent.style.height = (window.innerHeight - 500) + 'px';
            role_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                role_parent.style.height = (window.innerHeight - 500) + 'px';
            }

            mThis.tblUsers.onclick = e=>{
               e.preventDefault();
              //Click on Remove User
               let lnk = VSUtil.closestLimited(e.target,'.lnk-remove-user');
               if (lnk){
                 cv_interact.confirm(['Are you sure to remove the selected user from ',mThis.selected_role.name || 'the role', '?'].join(''),{"title":"Remove User","context":'delete', "confirmButtonText":"Remove"},e =>{
                     if(e){
                         let user_id = lnk.dataset.id || lnk.dataset.userid;
                         let p = {"role_id":mThis.selected_role.role_id, "user_id":user_id};  
                         vsapi.call([main_view.base_url, '/api/role/remove-member'].join(''),p,null,false).then(res =>{
                             if(res.status_code ==200){
                                 mThis.userListView.showPage(RoleTabView.UserPanel.getFilterData());
                             }else cv_interact.warning(res.error_message);
                         });
                     }
                 } );
                 return;
               }

               //Click on reset password
               lnk = VSUtil.closestLimited(e.target,'.lnk-reset-password');
               if(lnk){
                    if(!AuthManager.allowed(109)) return;
                    let op = {
                        login_name: lnk.dataset.loginname,
                        id: lnk.dataset.id || lnk.dataset.userid,
                        onClose:()=>{
                            return;
                        }
                    };
                SetPasswordDialog.show(op);
               }

             //Click on lock user
             lnk = VSUtil.closestLimited(e.target,'.lnk-lock-user');
             if(lnk){
                if(!AuthManager.allowed(113)) return;
                    const user_id = lnk.dataset.id || lnk.dataset.userid;
                    const tr = VSUtil.closestLimited(e.target,'tr');
                    const user_name = tr.dataset.fullname;
                    const login_name = tr.dataset.login;
                    //let islocked = tr.dataset.islocked;
                    let action = lnk.dataset.action; //islocked ==1? 'unlock': 'lock';
                    const op = {
                        user_id: user_id,
                        user_name: user_name,
                        action: action,
                        status_code: action
                    };
                     action =(action || '').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    cv_interact.confirm(['Do you want to ',action.toLowerCase() ,' user ',user_name.replace(/^\w/, (c) => c.toUpperCase()),'?'].join(''),{
                        title: `${action || ''} User`,
                        context: `update`,
                        confirmButtonText:`${action || ''} Now`
                    },(e) => {
                        if(e)
                        {
                            delete(op.user_name);
                            vsapi.call(`${main_view.base_url}/api/user/status/update`,op,lnk,false).then(res => {
                                if(res.status_code === 200)
                                {
                                    mThis.UserPanel.elSearchUser.value = login_name;
                                    mThis.userListView.showPage(mThis.UserPanel.getFilterData(),mThis.userListView.current_page); 
                                }
                                else cv_interact.error(res.error_message);
                               
                            });
                        }
                    });
                    
                return;
             }


            // //Click on edit user
            //  lnk = VSUtil.closestLimited(e.target,'.lnk-edit-user');
            //  if(lnk){
            //       if(!AuthManager.allowed(112)) return;
            //       let user_id = lnk.dataset.id || lnk.dataset.userid;
            //       let tr = VSUtil.closestLimited(e.target,'tr'); 
            //       //get primary role_id. If user does not have primary role_id, then do not allow edit information
            //       const role_id = tr.dataset.roleid;
            //       const user_class = tr.dataset.userclass;
            //       // if(!role_id || role_id==0){
            //       //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
            //       //   return;
            //       // }
            //       let op = {
            //           user_id: user_id,
            //           role_id: role_id,
            //           default:{
            //               user_class: user_class
            //           },
            //           open: 'add-user',
            //           onClose: () => {
            //               mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
            //           }
            //       };
            //       if(op.user_id > 0) AddUserDialog.show(op); else cv_interact.error('User ID is unexpectedly missing or No user ID is selected');
             
            //      return;
            // } 

            };


            mThis.initAlready = true ;
        }

       mThis.initOnce();
    //end::init RoleTabeView

    
    //Set active Tab or tab page
    this.setActivePage = (view_name, lnk = null) =>{
        const selectedDiv = this.tabPages[view_name];
        lnk = lnk || mThis.tabHeader.querySelector(`a.${view_name}`);
        if (lnk){
            if (selectedDiv) {
                selectedDiv.style.display = 'block';
                lnk.classList.add('active');
              
                lnk.parentElement.querySelectorAll('a').forEach(el =>{
                    if (el !== lnk && el.classList.contains('active')) {
                        el.classList.remove('active');
                    }
                });
            } 
        
            Object.values(this.tabPages).forEach(div => {
                if (div && div !== selectedDiv) {
                    div.style.display = 'none';
                }
            });

            mThis.last_view_name = view_name; //remember the last selected view_name
        }
    }
 
    // @role = {"role_id","user_class"}
    this.displayContent = async (role,view_name = null,op=null) =>{
         op = op || {};
         //remember role_id
         mThis.selected_role = role;
       
        if(!role || (!role.role_id || role.role_id ==0)){
            RoleTabView.self.classList.remove('d-flex');
            RoleTabView.self.style.display='none';
            return;
        }
        view_name = view_name || mThis.last_view_name;
        const role_id = role.role_id;  
        let apps = [], cfg = null;
        switch(view_name){
            case 'view_users':
              mThis.userListView.showPage({"role_id":role_id,"search_value":op.user_search_value});                
              break;
            case 'view_applications':
            case 'view_apps':
               this.AppPanel.loadApps();
               break;   
            case 'view_modules':
                //mThis.moduleListView.showPage({"role_id":role_id});         
                this.ModulePanel.loadAppChoices();
               break;   
            case 'view_permissions':
                this.PermissionPanel.loadAppChoices();
               break;
            case 'view_reports':
               this.ReportPanel.loadAppChoices(); 
              break;
            default:
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display='none';
                return;
                //break;                        
        }
        RoleTabView.self.classList.add('d-flex');
        //RoleTabViewself.style.display='block';
        mThis.setActivePage(view_name);
    }
    
  
}
/**end:: vs-tab-view for role details */


//begin:: FindUserDialog
const FindUserDialog = new function () {
    let mThis = this;
    this.self = main_view.VSAppContent.querySelector('#_um_dlgFindUser');
    this.modal = new bootstrap.Modal(this.self);
    this.elTitle = this.self.querySelector('.modal-title');
    this.elSearch = this.self.querySelector('.search-user');
    this.btnOK = this.self.querySelector('#_um_dlgFindUser_btnOK');
 
    this.options = {};
    const found_student_cols = [
       {
         "title":"Login Name",
         "data":(data,index,tr)=>{
            return data.login_name;
         }
       },
       {
        "title":"Full Name",
        "data":(data,index,tr)=>{
           return data.full_name;
        }
      },
      {
        "title":"ID",
        "data":(data,index,tr)=>{
           return data.official_code;
        }
      },
      {
        "title":"Phone Number",
        "data":(data,index,tr)=>{
           return data.phone_number;
        }
      },
      {
        "title":"User Class",
        "data":(data,index,tr)=>{
           return data.user_class;
        }
      },
      {
        "title":"Role Name",
        "data":(data,index,tr)=>{
           return data.role_name;
        }
      }
    ];

    this.foundUserList = new ListView('_um_role_found_user_list',{
         columns:found_student_cols,
         fetchApi:[main_view.base_url, '/api/user/list'].join(''),
         apiCluster:null,
         clientSidePagination:false,
         perPage:5,
         rowCreated:(data,index,tr)=>{
            tr.dataset.id = data.id || data.user_id;
            tr.dataset.login =  data.login_name;
            tr.dataset.name = data.full_name;
            tr.dataset.officialcode = data.official_code;
            tr.dataset.phonenumber = data.phone_number;
            tr.dataset.email = data.email;
            tr.dataset.rolename = data.role_name;
            tr.dataset.roleid = data.role_id;
            tr.dataset.userclass = data.user_class;
         }
    });

    mThis.tblUsers = this.foundUserList.getTable();

    /** find User on FindUserDialog */
    mThis.elSearch.addEventListener('keyup', e => {
        e.preventDefault();
        setTimeout(()=>{
            mThis.foundUserList.showPage({"search_value":mThis.elSearch.value});
        },250);
       
    });

    this.tblUsers.addEventListener('click', e => {
        e.preventDefault();
        let tr = e.target.closest('tr');
        if (tr) {
            tr.classList.toggle('selected');
            tr.querySelector('td:first-child').classList.toggle('checked');
        }
    });
    
 
    this.btnOK.onclick =  e => {
        e.preventDefault();
        let users = mThis.getSelection();
        if (!users[0]) {
            cv_interact.warning("No users selected");
            return;
        }
        if (typeof mThis.options.onClose === 'function') mThis.options.onClose(users);
        //if (mThis.modal)
         mThis.modal.hide(); 
        //else mThis.jm.modal('hide');
    };
 
    this.getSelection = () => {
        let ps = [];
        mThis.tblUsers.querySelectorAll('tr.selected').forEach(tr => {
            const d = tr.dataset;
            ps.push({ "id": d.id, "login_name":d.login, "name": d.name, "user_class": d.userclass, "role_name":d.rolename, "role_id":d.roleid });
        }); 
        return ps;
    }
  
    this.renderUsers = (users = []) => {
        const tbody = mThis.tblUsers.querySelector('tbody');
        tbody.innerHTML = '';
        let cnt = 0;
        let html = '';
        (users || []).map(user => {
            html = [html, `<tr data-id="${user.id}"><td class="checkbox"></td>`,
            `<td>`, user.login_name, `</td>`,
            `<td>`, user.full_name, `</td>`,
            `<td>`, user.phone_number ? user.phone_number : 'Not Available', `</td>`,
            `<td>`, user.user_class, `</td>`,
            `<td>`,user.role_name,`</td>`,
            `</tr>`].join('');
            cnt++;
        });
        if (cnt === 0) html = `<tr><td colspan="100%"><div class="p-3 text-center text-secondary w-100"> No matched users!</div></td></tr>`;
        tbody.innerHTML = html;
    }
 
    this.show = (options = null) => {
        options = options || {};
        mThis.options = options;
        mThis.onSelect = options.onSelect;
        mThis.elSearch.value  = '';
        //mThis.tblUsers.querySelector('tbody').innerHTML = '<tr><td colspan="100%"><div class="w-100 d-flex flex-wrap justify-content-center p-3"><h5>Search for users</h5> </div></td></tr>';

        //if (mThis.modal) 
        mThis.modal.show(); 
        // mThis.jm.modal({
        //     'backdrop': "static"
        // });
    }
}
//end:: FindUserDialog
  
const RoleDialog = (()=>{
  const self = {};
  let dialog = null;
  self.show = (op)=>{
    dialog = dialog || new GeneralDialog({
        cssClass:"vs-modal-dialog",
        // fields:[
        //   {
        //      name:"group_id",
        //      label:"Role Group",
        //      inputType:"select",
        //      required:true
        //   },
        //   {
        //     name:"user_class",
        //     label:"User Class",
        //     inputType:"select",
        //     required:true
        //   },
        //   {
        //      name:"name",
        //      label:"Role Name",
        //      inputType:"text",
        //      required:true
        //   }
        // ],
        createContent:() =>{
            return [`<div class="row">
                        <div class="col-12">
                              <label style="color:#0f6694;" class="">Role Group</label>
                              <div class="material-input filed">
                                 <select name="group_id" class="data-input form-control" data-field="group_id"></select>
                                 <label class="d-none">Role Group</label>
                              </div>
                           </div>
                           <div class="col-12">
                            <label style="color:#0f6694;" class="">User Class</label>
                              <div class="material-input outlined">
                                 <select name="user_class" class="modal-select2 data-input form-control" data-field="user_class"></select>
                                 <label class="d-none">User Class</label>
                              </div>
                           </div>
                           <div class="col-12">
                              <label style="color:#0f6694;">Role Name</label>
                              <div class="material-input outlined">
                                 <input name="name" class="form-control data-input" data-field="name" placeholder=" " />
                                 <label class="d-none">Role Name</label>
                              </div>
                           </div>                     
                    </div>`].join('');
        },
        contentCreated:(me)=>{
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');
                const btnClose = header.querySelector('button');

                btnClose.classList.add('d-none');
                header.classList.add('bg-primary-custom', 'modal-header-custom');
                header.parentElement.style = 'border-radius: 20px !important';
                header.parentElement.classList.add('overflow-hidden');

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);

                header.innerHTML = '';
                header.appendChild(headerWrapper);
    
            },
        configSelect:[
            {
                name:"group_id",
                data:"role_groups",
                valueField:"id",
                textField:"role_group_name",
                defaultValue:"Official"
            },{
                name:"user_class",
                data:"user_classes",
                valueField:"user_class",
                textField:"user_class_name",
            }
        ],
        buttons:[
          {
             label:"Cancel",
             cssClass:"btn btn-vs-cancel",
             dismissModal:true
          },
          {
             label:"Save",
             cssClass:"btn btn-vs-save",
             click:(modal,btn,divModal)=>{
                 let p = modal.getData();
                 //let p = {id:mThis.options.id, group_id:mThis.elRoleGroup.value, name: mThis.elRoleName.value};
                 vsapi.call(`${main_view.base_url}/api/role/save`, p,null,false).then(res => {
                     if(res.status_code == 200){
                         const d = res.data;
                         modal.hide();
                         modal.dataOptions.onClose({role:d? d.new_role: null});
                        //  if(typeof mThis.options.onClose ==='function') mThis.options.onClose({role:d? d.new_role: null});
                     }else cv_interact.error(res.error_message);
                 });
             }
          }
        ],
        prepareFormOptions:{
          createTitle:"Add Role",
          modifyTitle:"Modify Role",
          targetProp:"role",
          api:{
            endpoint:`${main_view.base_url}/api/role/form-options`,
            params:(op)=>{
                return {id: op.id};
            },
            // onResponse:(res)=>{
            //     console.log(res);
            // }
          }
        },
    onPrepareForm: (me, data) => {
            // LocaleManager.translateZone(me.divModal);
            const header = me.divModal.querySelector('.modal-header');

            const btnClose = header.querySelector('button');
            if(btnClose) btnClose.classList.add('d-none');
        },
        // onClose:(canceled)=>{} 
     });

     dialog.show(op);  
  };

  return self;
})();

 
/** begin:: UserDialog */
 window.UserDialog1 = window.UserDialog1 || new function(){
     const mThis = this;
     this.self = main_view.VSAppContent.querySelector('#_um_dlgUser');
     this.modal = new bootstrap.Modal(this.self);
     this.btnSave = this.self.querySelector('#_um_dlgUser_btnSave');
     this.elRole = this.self.querySelector('#_um_nu_role');
     this.elUserClass = this.self.querySelector('#um_nu_user_class');
     this.elOfficialCode = this.self.querySelector('#_um_nu_official_code');
     
     this.modalBody = this.self.querySelector('div.modal-body');
     this.elTitle = this.self.querySelector('.modal-title');
    
     this.imgBox = new ImageBox(this.self.querySelector('#_um_user_photo'),{

     });

     this.elOfficialCode.addEventListener('blur',e =>{
        e.preventDefault();
        let official_code = mThis.elOfficialCode.value;
        this.showProfile(official_code);
     });

     this.elUserClass.onchange = e=>{
        e.preventDefault();
        let official_code = mThis.elOfficialCode.value;
        this.showProfile(official_code);
     }

     this.btnSave.onclick = e =>{
         e.preventDefault();
         let p = mThis.getFormData();
         vsapi.call([main_view.base_url,'/api/user/save'].join(''),p,false,false).then(res =>{
               if(res.status_code ==200){
                   mThis.modal.hide();
                   if(typeof mThis.options.onClose ==='function') mThis.options.onClose(p);
               }else cv_interact.error(res.error_message);
         });
     }

     this.showProfile = (code) =>{
       let fields = ['full_name','email','phone_number','login_name']; 
       let p = {"official_code":code,'user_class':mThis.elUserClass.value}; 
       vsapi.call([main_view.base_url,'/api/user/profile-by-code'].join(''),p,false,false).then(res =>{
         let d = res.status_code ==200? res.data: {};
         d = d || {}; 
         mThis.modalBody.querySelectorAll('.data-input').forEach(el =>{
            const f =el.dataset.field;
            if(fields.indexOf(f)>=0){
                el.value = d[f] || "";
            }
           
         });

       });
     }

     this.getFormData = ()=>{
        let p = {};
        mThis.modalBody.querySelectorAll('.data-input').forEach(el =>{
            let f = el.dataset.field;
            p[f] = el.value || '';
        }); 
        return p;
     }
  
     this.setFormData = (d = null)=>{
        d = d || {};
        mThis.modalBody.querySelectorAll('.data-input').forEach(el =>{
            let f = el.dataset.field;
            el.value = d[f] || '';
            if(el.tagName ==='SELECT'){
                el.dispatchEvent(new Event('change'));
            }
            //else if (el.tagName ==='IMG') el.setAttribute('src',el.image_url);
        });
     }

     this.prepareForm = (op, onFinish)=>{
         let user_id = op.id || op.user_id;
         let p = {id:user_id}; 
         vsapi.call([main_view.base_url,'/api/user/form-options'].join(''),p,null,false,false).then(res=>{
             let d = res.status_code ==200 ? res.data : {};
             VSUtil.setComboItems(mThis.elUserClass,d.user_classes,'user_class','user_class_name',null,null,null);
             VSUtil.setComboItems(mThis.elRole,d.roles,'id','role_name',null,null,op.role_id);
             onFinish(d);
         });
     }

     this.show = (options)=>{
        mThis.options = options || {};
        let op = {id:options.id,role_id:options.role_id, createUserButton: options.btn};
 
        mThis.prepareForm(op,(d) =>{
            let title = 'Create User';
            mThis.btnSave.innerHTML = `<span class=" " vslang="buttons.Create">${LocaleManager.trans('Create','buttons')}</span>`;
            if(d.user){
                title = 'Edit User Information';
                mThis.btnSave.innerHTML = `<span class=" " vslang="buttons.Update">${LocaleManager.trans('Update','buttons')}</span>`;
            } else d.user = {role_id : options.role_id};
            mThis.elTitle.textContent = title;

            mThis.setFormData(d.user);
            mThis.modal.show();
         });
     }

 } 
/**end::UserDialog */
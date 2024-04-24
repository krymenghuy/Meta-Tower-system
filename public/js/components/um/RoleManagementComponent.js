'use strict';
var RoleManagementComponent = new function(){
    const mThis = this;
    this.title_prop = 'Role Management';
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_um_roleManagementComponent');
 
    this.lnkNewRole = this.self[0].querySelector('#_lnkNewRole');
    this.elSearch = this.self[0].querySelector('#_search_role');
    this.btnSearch = this.self[0].querySelector('#_role_btnSearch');
    this.btnPrint = this.self[0].querySelector('#_cul_btnPrint');
    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
    this.div_role_list = this.self[0].querySelector('div#_um_rolelist');    

    this.renderRoleCards = (data, container = null) => {
        let html = '';
        let cnt = 0;
        container = container || mThis.div_role_list;
        
        (data || []).map(item => {
            html = [ html,`<div class="col-sm-2">
            <div class="card bg-white shadow p-2 border rounded-3 d-flex flex-column justify-content-between" style="height:20vh;min-width:120px;">
               <div class="d-flex flex-column justify-content-center align-items-center p-2">
                  <span class="data-input text-success text-center" style="font-size:1em" data-field="user_class">${item.name}</span>
                  <span class="role_name_title mt-2">
                    ${item.name.charAt(0).toUpperCase()} 
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: ${item.user_count}</span>

                <div class="border-top border-1">
                 <span class="text-muted p-1">${item.user_class}</span>
                </div>
            </div>
           
         </div>`].join('');

        });
        container.innerHTML = html;
    }

    this.loadRoles = (filter, onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/role/list`,filter,null,false).then(res =>{
           const roles = res.status_code ==200? res.data : [];
           onFinish(roles); 
        });
       
    }

    this.init = () => {
        if(mThis.initAlready) return;
        
        mThis.lnkNewRole.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                'id': null,
                'onclose':(d)=>{
                    mThis.loadRoles(mThis.getFilterData(), roles =>{
                        this.renderRoleCards(roles);
                    }); 
                }
            }
            RoleDialog.show(op);
        });

        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.loadRoles(mThis.getFilterData(), roles =>{
                    this.renderRoleCards(roles);
                });
            }
        });

        mThis.elSearch.addEventListener('keyup',e =>{
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.loadRoles(mThis.getFilterData(), roles =>{
                    this.renderRoleCards(roles);
                });

            },250);
        });     
          
        mThis.initAlready = true;
    }

    this.getFilterData = ()=>{
        let p = {};
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
         let f = el.dataset.field;
          p[f] = el.value;
       });
       p.search_value = mThis.elSearch.value;
       return p; 
    }
  
    this.show = (options)=>{
        mThis.init();
        if(!options) options={};
        main_view.setTitle(mThis.title_prop);
         
        main_view.setTitle(mThis.title_prop);

        mThis.loadRoles(this.getFilterData(), roles =>{
            mThis.renderRoleCards(roles,null);
        });

        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
    }

};

const RoleDialog = new function(){
        const mThis = this;
        this.self = main_view.appContent.find('#roleDialog');
        this.base_url = main_view.base_url;
        this.options = {};
        
        this.elTitle = this.self.find('#_role_dlgTitle');
        this.btnSave =  this.self.find('#_role_dlg_btnOK');
       
        this.elUserClass = this.self.find('#user_class') ;
        this.onClose = null;
        this.body =  this.self.find('.modal-body')[0];
        this.div_sender_info =  this.body.querySelector('#div_merchant_info');
      
        
        // this.body = this.self.find('.modal-body')[0];
      
        this.prepareData = (def, onFinish) => {
            if(!def) def = {};
            if(mThis.user_classes){
                VSUtil.setComboItems(mThis.elUserClass, mThis.user_classes, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
                if(typeof onFinish == 'function') onFinish();
                return;
            }
    
            vsapi.call(`${main_view.base_url}/api/user/options-user-class`, null).then(res => {
                if(res.status_code === 200){
                    let rows = StringSanitizer.sanitizeObject(res.data);
                    VSUtil.setComboItems(mThis.elUserClass, rows, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
                    mThis.user_classes = rows;
                    if(typeof onFinish == 'function') onFinish();
                }
            });
        }
    
        
          
   
    
       
    this.show = (options)=>{
        if (!options) options = {};
        mThis.options = options;
        
        mThis.self.modal({
            backdrop: 'static'
        
    
      
    
    });
}
}
    

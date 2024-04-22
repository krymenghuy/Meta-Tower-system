'use strict';
var RoleManagementComponent = new function(){
    const mThis = this;
    this.title_prop = 'Role Management';
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_um_roleManagementComponent');

   

    this.lnkNewRole = this.self.find('#_lnkNewRole');
    this.elSearch = this.self.find('#_search_role');
    this.btnSearch = this.self.find('#_role_btnSearch');
    this.btnPrint = this.self.find('#_cul_btnPrint');
    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
    

    this.renderCard = (container, data) => {
        let html = '';
        let cnt = 0;
        // container.style.display = 'none';
        // mThis.store_senders = {};
        (data || []).map(item => {
            html += ` <div class="col-sm-2 box">
            <div class="card bg-white shadow p-3 border rounded-3 m-3">
              <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
                <span class="data-input text-success " style="font-size:0.8em" data-field="user_class">${item.name}</span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >User Class: ${item.user_class}</span>
                <span class=" role_name_title">
                ${item.name.charAt(0).toUpperCase()} 
                 
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: ${item.user_count}</span>
            </div> 
        </div>
        
         `

        });
        container.innerHTML = html;
        container.style.display = 'flex';
    }
    this.init = () => {
        if(mThis.initAlready) return;
        let div = document.getElementById('_card');
 
        mThis.roleListView = new ListView('_card',{
            fetchApi: `${main_view.base_url}/api/role/list-paginate`,
            perPage: 20,
            display:'card',
           //clientSidePagination:true,
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                console.log(items); 
                mThis.renderCard(list_container,items);
            },
            listContainerClass: null
            
        });
        mThis.lnkNewRole.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': null,
                'onclose':(d)=>{
                    mThis.roleListView.showPage(mThis.getFilterData());
                }
            }
            RoleDialog.show(op);
        })
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.roleListView.showPage(mThis.getFilterData());
            }
        });
        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.roleListView.showPage(mThis.getFilterData());
            },250);
        });     
        
        mThis.btnSearch.on('click',function(){
            mThis.roleListView.showPage(mThis.getFilterData());
        });
        
        
      
        mThis.initAlready = true;
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
  
    this.show = (options)=>{
        mThis.init();
        if(!options) options={};
        main_view.setTitle(mThis.title_prop);


        
        main_view.setTitle(mThis.title_prop);
        mThis.roleListView.showPage(mThis.getFilterData(),null,() => {
            $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
        });
        
       
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
    

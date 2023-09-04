'use strict';
let AuthManager = new function(){
    let mThis = this;
    //this.base_url = $('meta[name="base_url"]').attr('content');
    this.base_url = window.location.origin;
    this.prns = [];
    this.modules = [];
    this.is_super_admin = 0;
 
    this.init = ()=>{
        vsapi.call(`${mThis.base_url}/api/auth/auth-data`,null).then((res)=>{
            if(res.status_code===200){
                let d = res.data;
                d =d?d:{};
                if(!d.prns) d.prns = [];
                mThis.prns = d.prns;
                mThis.is_super_admin = d.is_super_admin;
                mThis.modules = d.modules?d.modules:[]; 
            }
        });
    }
    
   //BEGIN:: code block to init AuthManager as fast as possible 
        let x=null; 
        if (!this.base_url){
            x = document.querySelector('meta[name="base_url"]');
            if(x) this.base_url = x.getAttribute('content');
        };
        if (!this.asset_url){
            x = document.querySelector('meta[name="asset_url"]');
            this.asset_url = x? x.getAttribute('content'):null;
        }

        //directly initialized on page load as soon as possible
        mThis.init();
   //END:: code block to init AuthManager as fast as possible 

    this.access_mod = (mod_id,show_unauth_page=true)=>{
       if (mThis.is_super_admin || mThis.is_super_admin==1) return true;
       let m = mThis.modules.find(mod => mod.id == mod_id);
       if(m) return true; 
       if(show_unauth_page){
          UnauthComponent.show();
       }
        return false;
    }

    this.allowed =(prn_number,silent_mode = false)=>{
        if (mThis.is_super_admin || mThis.is_super_admin==1) return true;
        let i=0,c;
        do{
            c = mThis.prns[i];
            if(!c) break;
            if (!c.permission_id) c.permission_id = c.prn_number;
            if (c.permission_id == prn_number) return true;
            i++;
        }while(c);
        if(!silent_mode) cv_interact.alert(`Permission ${prn_number} is required to perform this action!`,'','warning');
        return false;  
    }
}

// window.addEventListener('DOMContentloaded',()=>{
//    AuthManager.init();
// });
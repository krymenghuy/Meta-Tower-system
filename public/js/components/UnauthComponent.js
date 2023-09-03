"use strict";
var UnauthComponent = new function(){
     let mThis = this;
     this.title_prop ='Access Forbidden';
     this.divInfo = {};
     
     this.init = ()=>{
       const app = document.querySelector('#_app_content');
       let c = app.querySelector('#_main_unauthcomponent');
       if(!c){
         let div = document.createElement('div');
         div.setAttribute('id','_main_unauthcomponent');
         div.style.display='none';
         div.style.margin ='25px';
         div.innerHTML ='<div  id="_div_unauth_info" class="p-2 w-100 border rounded-2 border-secondary shadow-lg m-3"></div>';
         app.appendChild(div);
         this.self = $(div);
       }
      
       this.divInfo = this.self.find('#_div_unauth_info');
     }

     this.show = (options)=>{
        options = options?options:{};
        if(!options.title) options.title = mThis.title_prop;
        if (!options.html) options.html = '<h5 class="text-center text-secondary p-2">Previlege is required to view content</h5>';
        mThis.divInfo.html(options.html);
        main_view.setTitle(options.title); 
        mThis.self.show().siblings().hide();
     }
}

window.addEventListener('DOMContentLoaded',(e)=>{
    UnauthComponent.init();
})
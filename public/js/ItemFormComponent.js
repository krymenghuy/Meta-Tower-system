'use strict'
let ItemFormComponent = new function(){
    let mThis = this;
    this.self = $('#_main_itemFormComponent');
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    //item_type as "Good" or "Service"
    this.div_item_type = $('#_itemform_div_itemtype');

    this.init = ()=>{ 

      mThis.div_item_type.on('change','.m-checkbox',function(e){
         
          mThis.div_item_type.find('.m-checkbox').each(function(){
             $(this).prop('checked',false);
          });
          
          $(this).prop('checked',true);
      });    
    }

    this.show = (option, onClose)=>{
         mThis.elScreenTitle.html(option.title);
         mThis.self.show().siblings().hide();
    }
}

window.addEventListener('load',(e)=>{
   ItemFormComponent.init();
}); 
'use strict';
var generalSettingsComponent = new function(){
   let mThis = this;
   this.title_prop = "General Settings";
   this.base_url =main_view.base_url;
   this.self = main_view.appContent.children('#_main_generalSettingsComponent');
   this.btnNewProductType = this.self.find('#_gsttn_btnNewProductType');
   this.btnNewBusinessType = this.self.find('#_gsttn_btnNewBusinessType');
   
   this.tblBusinessTypes = this.self.find('#_gsttn_tblBusinessTypes');
   this.tblBusinessTypes_body = this.self.find('#_gsttn_tblBusinessTypes_body');
   this.tblProductTypes = this.self.find('#_gsttn_tblProductTypes');
   this.tblProductTypes_body = this.self.find('#_gsttn_tblProductTypes_body');

    this.btnSendMessage = this.self.find('#btnSendMessage');
    this.elTextEditor = this.self.find('#_textEditor');

   this.displayBusinessTypes = ()=>{
     vsapi.call(`${mThis.base_url}/dms/getBusinessTypes`,null).then(res => {
         if(res.status_code === 200) {
             mThis.tblBusinessTypes_body.empty();
             let rows = StringSanitizer.sanitizeObject(res.data);
             let i =0, c;
             do{
                 c = rows[i];
                 if(!c) break;
                 let html_tr = ['<tr data-id="',c.id,'"><td>',(i+1),'</td><td>',c.name,'</td><td><a href="#" class="btn_btype_delete"><i class="fa fa-times" style="color:red"></i></td></tr>'].join('');    
                 mThis.tblBusinessTypes_body.append(html_tr);
                 i++;
             }while(c); 
         }
     });
   }

   this.displayProductTypes = ()=>{
    vsapi.call(`${mThis.base_url}/dms/getProductTypes`,null).then(res => {
        if(res.status_code === 200) {
            mThis.tblProductTypes_body.empty();
            let rows = StringSanitizer.sanitizeObject(res.data);
            let i =0, c;
            do{
                c = rows[i];
                if(!c) break;
                let html_tr = ['<tr data-id="',c.id,'"><td>',(i+1),'</td><td>',c.name,'</td><td><a href="#" class="btn_ptype_delete"><i class="fa fa-times" style="color:red"></i></td></tr>'].join('');    
                mThis.tblProductTypes_body.append(html_tr);
                i++;
            }while(c); 
        }
    });
  }
   this.init = ()=>{
     mThis.btnSendMessage.on('click',(e)=>{
        let text = 'This is test message';
        let p = {'phone_number':'010428632','text':text};
        alert(JSON.stringify(p));
        vsapi.call(`${mThis.base_url}/dms/sendMessage`,p).then(res =>{
            alert(res);
        });
     });
   }

   this.show = (option)=>{
       if(!option) option={};
       mThis.self.siblings().hide(0, function() {
        main_view.setTitle(mThis.title_prop);
        mThis.self.hide().fadeIn(250);
      });
   }
}

//begin:: ProductTypesView
 var ProductTypesView = new function(){
     let mThis = this;
     this.base_url =main_view.base_url;
     
     //option = {item_name, addMethod, deleteMethod}
     this.init = (option)=>{
        mThis.option = option;
        //mThis.base_url = option.base_url;
     }
      
     this.deleteItem = (tr)=>{
        let p = {};
        p[mThis.option.key_field] = tr.data('id');   
        cv_interact.confirm('Delete this item?','Delete Item',function(e){
            if(e){
                vsapi.call(`${mThis.base_url}/dms/',mThis.option.deleteMethod`,p).then(res => {
                    if(res.status_code === 200) {
                        mThis.displayItems();
                    }
                });
            }
        }); 
        
     }
     this.displayItems = ()=>{
        vsapi.call(`${mThis.base_url}/dms/getCom`,p).then(res => {
            if(res.status_code === 200) {
                mThis.displayItems();
            }
        });
     }
 }
//end:: ProductTypesView

$(document).ready(()=>{
    generalSettingsComponent.init();
});

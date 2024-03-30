class SimpleItemEditor{
    constructor(options=null){
      this.options = options;
      this.options =this.options?this.options:{};
      
      //NOTE: api_save = {'endpoint'=> url endpoint ,'data'=> params data. This can be function or Json object}
      this.api_save = this.options.api_create?this.options.api_create:this.options.api_save;
      this.api_delete = this.options.api_delete;
      this.editLink = this.options.editLink;
      if (this.options.editLinkId) this.editLink = $(`#${this.options.editLinkId}`);
      this.deleteLink = this.options.deleteLink;
      if (this.options.deleteLinkId) this.deleteLink = $(`#${this.options.deleteLinkId}`);
      
      this.onItemDeleted =()=>{return;};
      if(this.api_delete) this.onItemDeleted = this.api_delete.onItemDeleted  
      this.onItemSaved = ()=>{return;};
      if(this.api_save) this.onItemSaved = this.api_save.onItemSaved; 
      //We assume that "displayElement" is always a Select or dropdown list
      this.displayElement = this.options.displayElement;

      this.options.title = this.options.title?this.options.title:'Title';
      this.options.label = this.options.label?this.options.label:'Item Name';
      
      this.hideWhenNull_items =[this.editLink, this.deleteLink];

      let that = this;

      this.displayElement.on('change',function(e){
          if($(this).val()){
           that.hideWhenNull_items.map(e=>{
            e.show();
           });
          }else{
             that.hideWhenNull_items.map(e=>{
              e.hide();
             });
          } 
      });

      // if (!this.displayElement.val()){
      //   that.hideWhenNull_items.map(e=>{
      //     e.hide();
      //    });
      // }

      this.deleteLink.on('click',function(e){
        e.preventDefault();
        if(!that.displayElement.val()){
          cv_interact.warning('No item selected');
          return;
        }
        let item_name = that.displayElement.find('option:selected').text();
        cv_interact.confirm(`Delete ${item_name?item_name:'this item'}?`,{title:'Delete Item',context:'delete'},e=>{
           if(e){
              let p = (typeof that.api_delete.data ==='function')? that.api_delete.data(): that.api_delete.data;
              vsapi.call(that.api_delete.endpoint,p,null,false).then(res=>{
                 if(res.status_code ==200)
                   //refresh items options in displayElement
                   that.onItemDeleted(p);
                  else cv_interact.error(res.error_message);
              });
           }
        });
      });

      this.editLink.on('click',function(e){
        e.preventDefault();
          if(!that.displayElement.val()){
            cv_interact.warning('No item selected');
            return;
          }
           let def_value = (typeof that.options.defaultValue ==='function')? that.options.defaultValue():that.options.defaultValue; 
           cv_interact.inputBox(that.options.title,that.options.label,'text',def_value,null).then(res=>{
                  if(res.isConfirmed){
                      //let p = (typeof that.api_save.data ==='function')? that.api_save.data(): that.api_save.data;
                      let p = {id: that.displayElement.val(),name:res.value};
                      vsapi.call(that.api_save.endpoint,p,null,false).then(res=>{
                          if(res.status_code ===200)
                            //refresh items options in displayElement
                            that.onItemSaved(p);
                          else cv_interact.error(res.error_message);
                      });
                  }
           });
      });
    }  
    
}
"use strict";
/***
 * "options"=> {
       "selectElement": mThis.elBrand,
       "label":"Brand Name",
       "langprop":"brand",
       "dataprop":"brands",    used for refreshing options. The default prop is "options" that is returned from api
       "value_field":"id",
       "text_field":"brand_name",
       "apiSave":{
          "endpoint":"",
          "params": ()=>{
             return {"id":"something"};
          }
       },
       "apiDelete":{
          "endpoint":"",
          "params": ()=>{
             return {"id":"something"};
          }
       }
    }
**/
class OptionEditor{
    constructor(div_id,options){
       
        this.div = document.querySelector(`#${div_id}`);
        if(!this.div) throw "Error at OptionEditor: the provided div_id is not valid";
        options =options?options:{};
        this.options = options;

        //default dataprop is "options". this dataprop is used for refreshing options after delete or create or update option text 
        this.options.dataprop = this.options.dataprop?this.options.dataprop:this.options.dataProp;
        if(!this.options.dataprop) this.options.dataprop = "options";
        this.options.value_field =this.options.value_field?this.options.value_field:"id";
        this.options.text_field =  this.options.text_field? this.options.text_field:"name";

        this.options.label = this.options.label?this.options.label:"Your label";
        this.options.buttons = (this.options.buttons)? this.options.buttons: ['add','edit','delete'];
        if(!this.options.langprop) this.options.langprop = this.options.langProp;
        const langprop = [this.options.langprop,'.',this.options.label].join('');
        this.elSelect = $(this.options.selectElement);

        const add_button = this.options.buttons.indexOf('add')>=0? ` &nbsp;<a href="javascript:void(0)" data-action="add" class="oe-action oe_lnk_add">
        <i class="fas fa-plus-circle text-success" style="font-size: 14px;"></i>
        </a> `:null;

        const edit_button = this.options.buttons.indexOf('edit')>=0? ` &nbsp; <a href="javascript:void(0)" data-action="edit" class="oe-action oe_lnk_edit">
        <i class="fas fa-edit text-secondary" style="font-size: 14px;"></i>
        </a>`:null;

        const delete_button = this.options.buttons.indexOf('delete')>=0? ` &nbsp;<a href="javascript:void(0)" data-action="delete" class="oe-action oe_lnk_delete">
        <i class="fas fa-trash text-danger"></i>
        </a>`:null;

        let html =[`
          <span class="form-label trans-text" data-langprop="${langprop}">${this.options.label}</span>`,add_button,edit_button,delete_button
        ].join('');

        this.div.innerHTML = html;

        const that = this;

        this.buttonClickHandlers ={
            "add":()=>{
                let def_value = ""; //that.elSelect.find('option:selected').text(); 
                cv_interact.inputBox(`Add  ${that.options.label}`,that.options.label,'text',def_value,null).then(res=>{
                       if(res.isConfirmed){
                           let p = (typeof that.options.apiSave.params ==='function')? that.options.apiSave.params(that.elSelect.val(), res.value): that.options.apiSave.params;
                           if(!p) {
                             p= {};
                             //p[that.options.value_field] = that.elSelect.val();
                             p[that.options.text_field] = res.value;
                             p.name = res.value;
                           }
                          
                           vsapi.call(that.options.apiSave.endpoint,p,null,false).then(res=>{
                               if(res.status_code ===200)
                               {
                                 //refresh items options in displayElement
                                 //that.onItemSaved(p);
                                 if (!res.data) throw `Problem in refreshing option because api "${that.options.apiSave.endpoint}" does not reaturn array of options in response res.data.${that.options.dataprop}`;  
                                 const items = res.data[that.options.dataprop];
                                 let def_value = res.data[that.options.value_field];
                                 that.refreshOptions(items,def_value);
                               }
                               else cv_interact.error(res.error_message);
                           });
                       }
                });
            },
            "edit":()=>{
                if(!that.elSelect.val()){
                    cv_interact.warning('No item selected');
                    return;
                  }
                   let def_value = that.elSelect.find('option:selected').text(); 
                   cv_interact.inputBox(`Modify ${that.options.label}`,that.options.label,'text',def_value,null).then(res=>{
                          if(res.isConfirmed){
                              let p = (typeof that.options.apiSave.params ==='function')? that.options.apiSave.params(that.elSelect.val(), res.value): that.options.apiSave.params;
                              if(!p) {
                                p= {};
                                p[that.options.value_field] = that.elSelect.val();
                                p[that.options.text_field] = res.value;
                                p.name = res.value;
                              }
                             
                              vsapi.call(that.options.apiSave.endpoint,p,null,false).then(res=>{
                                  if(res.status_code ===200)
                                  {
                                    //refresh items options in displayElement
                                    //that.onItemSaved(p);
                                    if (!res.data) throw `Problem in refreshing option because api "${that.options.apiSave.endpoint}" does not reaturn array of options in response res.data.${that.options.dataprop}`;  
                                    that.refreshOptions(res.data[that.options.dataprop],that.elSelect.val());
                                  }
                                  else cv_interact.error(res.error_message);
                              });
                          }
                   });
            },
            "delete":()=>{
                if(!that.elSelect.val()){
                     cv_interact.warning('No item selected');
                     return;
                  }
                  let item_name = that.elSelect.find('option:selected').text();
                  cv_interact.confirm(`Delete ${item_name?item_name:'this item'}?`,{title:'Delete Item',context:'delete'},e=>{
                     if(e){
                        let p = (typeof that.options.apiDelete.params ==='function')? that.options.apiDelete.params(that.elSelect.val()): that.options.apiDelete.params;
                        if(!p){
                          p={};
                          p[that.options.value_field] =  that.elSelect.val();
                        }
      
                        vsapi.call(that.options.apiDelete.endpoint,p,null,false).then(res=>{
                           if(res.status_code ==200)
                            {
                               //refresh items options in displayElement
                               //that.onItemDeleted(p);
                               if (!res.data) throw `Problem in refreshing option because api "${that.options.apiDelete.endpoint}" does not reaturn array of options in response res.data.${that.options.dataprop}`;
                               that.refreshOptions(res.data[that.options.dataprop],0);
                            }
                            else cv_interact.error(res.error_message);
                        });
                     }
                  });
            }
        };

        this.elSelect.on('change',e=>{
            const val = that.elSelect.val(); 
            if(!val || val ==0){
                let el = that.div.querySelector('a.oe_lnk_delete');
                if(el) el.style.display ='none';
                el = that.div.querySelector('a.oe_lnk_edit');
                if(el) el.style.display ='none';
            }else{
                let el = that.div.querySelector('a.oe_lnk_delete');
                if(el) el.style.display ='inline-block';
                el = that.div.querySelector('a.oe_lnk_edit');
                if(el) el.style.display ='inline-block';
            }    
        });
        
        this.div.addEventListener('click',(e)=>{
            const lnk = e.target.closest('.oe-action');
            if(lnk){
                 e.preventDefault();
                 const action = lnk.dataset.action;
                 that.buttonClickHandlers[action]();
            }
            
        });
 
    }

    refreshOptions(items=[],def_value=0){
        let item_name = ['(',this.options.text_field.replace('/ _/g',' '),')'].join('');
        VSUtil.setComboItems(this.elSelect,items,this.options.value_field,this.options.text_field,true,item_name,null);
        this.elSelect.val(def_value).trigger('change');
    }
}
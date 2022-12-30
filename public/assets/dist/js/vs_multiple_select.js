(function($){
    var _vs_ms_local_datastore_12121 = [];
    
    var _vs_multipleSelect = function (objectStore, option){
        var that = this;
        //constructor code here
        //this.objectStore = objectStore;
        this.option = option;
        this.self =$('#'+objectStore.element_id);  
        this.wrapper = this.self;
        this.element_id = objectStore.element_id;
        this.self.addClass('_vs_multiple_select_wrapper');
        this.self.addClass(option.className);
    
            //option.data = [{'value','text'},...]
            if (option.data) this.setData(option.data,option.valueMember, option.textMember,option.selectedValues);
            this.self.on('change','input._vs_ms_checkbox',function(e){  
               if (typeof that.option.onCheckChange =='function') {
                   let x = $(this);
                let item = {'value':x.data('value'), 'text':x.siblings('span._vs-checkbox-text').text()};   
                let checked = x.is(':checked');
                that.option.onCheckChange($(this), item,checked);
               }
            });    
    }

    _vs_multipleSelect.prototype.getSelections = function() {
        let items = [];
        this.wrapper.find('ul>li._vs_ms_item input._vs_ms_checkbox ').each(function(){
            let x = $(this);
            if (x.is(':checked')){
                let val = x.closest('li').data('value');
                let text = x.siblings('span._vs-checkbox-text').text();
                items.push({'value':val,'text':text,'name':text}); 
            }  
         }); 
       return items;
    }
    _vs_multipleSelect.prototype.in_array = function(a,ar=[]){
        let cnt= (ar)?ar.length:0;
        for(let i = 0; i<cnt;i++){
            let c = ar[i];
            if($.isNumeric(a)) {
                if (parseFloat(a) === parseFloat(c)) return true;
            }else if ((a+'').toLocaleLowerCase() === (c+'').toLowerCase()) return true;   
        }
        return false;
    }
    _vs_multipleSelect.prototype.select = function(values = []) {
       let that = this; 
       this.wrapper.find('ul>li._vs_ms_item').each(function(){
            let val = $(this).data('value');
            if (that.in_array(val,values)) {
                $(this).find('input._vs_ms_checkbox').prop('checked',true); 
            }  
       }); 
    }
    _vs_multipleSelect.prototype.checkAll = function(checked=true,excepts=[]) {
        let that = this; 
        this.wrapper.find('ul>li._vs_ms_item').each(function(){
             let val = $(this).data('value');
             if (that.in_array(val,excepts)) {
                 $(this).find('input._vs_ms_checkbox').prop('checked',!checked); 
             } else $(this).find('input._vs_ms_checkbox').prop('checked',checked);   
        }); 
     }

     _vs_multipleSelect.prototype.disableOptions = function(disabled=true,excepts=[]) {
        let that = this; 
        this.wrapper.find('ul>li._vs_ms_item').each(function(){
             let val = $(this).data('value');
             if (that.in_array(val,excepts)) {
                 $(this).find('input._vs_ms_checkbox').prop('disabled',!disabled); 
             } else $(this).find('input._vs_ms_checkbox').prop('disabled',disabled);   
        }); 
     }

    _vs_multipleSelect.prototype.setData = function(data,valueMember='value',textMembers='text',selectedValues=[]) {
      if (data) {
          let i=0,c;
          let list =null;
          let many_cols = Array.isArray(textMembers);
          //alert(JSON.stringify(textMembers));
          do{
            c = data[i];
            if(!c) break;
            let str_check ='';
            let textMember = textMembers; //this is either string as col name or array of colnames ['col1','col2']
              let val = c[valueMember]
              let li_html = null; 
              if (selectedValues.indexOf(c[valueMember]) >=0) str_check =' checked ="checked"';

              if (many_cols==true) {
                 let x=0,field;
                 let item_cols = null;
                 do{
                    field = textMembers[x];
                    if(!field) break;
                      item_cols =[item_cols,'<div class="col_',field,'">',c[field],'</div>'].join(''); 
                    x++;
                 }while(field);

                 li_html = ['<li class="_vs_ms_item" data-value="',val,'"><div class="checkbox-item">',
                  '<input data-value="',val,'" type="checkbox" class="_vs_ms_checkbox _vs-checkbox-lg" ',str_check,'><span class="_vs-checkbox-text">',item_cols,'</span>',
                  '</div></li>'].join('');

              } else
              {
                  //display One column
                  li_html = ['<li class="_vs_ms_item" data-value="',val,'"><div class="checkbox-item">',
                  '<input data-value="',val,'" type="checkbox" class="_vs_ms_checkbox _vs-checkbox-lg" ',str_check,'><span class="_vs-checkbox-text">',c[textMember],'</span>',
                  '</div></li>'].join('');
              } 
              list = [list,li_html].join('');
            i++;
          }while(c);
          if(list) list = ['<ul>',list,'</ul>'].join('');  
          this.self.empty();
          this.self.append(list); 
        }
    }

            
        //option = {'className'}
        $.fn.vs_multipleSelect = function(option, args) /** options.columns, options.data, options.base_url OR optons can be a method's name **/
        {
            let div_id = $(this).attr('id');
            //set default option
            if(!option) option = {className:'_vs_multiple_select_wrapper',data:[]};
            let initObj = CommonLib.findData_local(_vs_ms_local_datastore_12121,div_id);
            if(option && typeof option =='string'){
                        if (!initObj) 
                        {
                                alert(['Cannot execute function "',option,'" because $.fn.vs_multipleSelect() is not not yet initialized'].join(''));
                                return;
                        }

                        if (option =='setData') {
                            //Assume that args is an JSON object, otherwise throw error
                            let d = args;
                            if(d){
                                initObj.setData(d.data,d.valueMember,d.textMember,d.selectedValues); 
                            }   
                        }
            }else // if option is JSON object => init or calling a method 
            {
                   if (!initObj)  
                    {
                    //objectStore contains list of additional props required for script manipulation or jquery actions 
                        var objectStore = {};
                        objectStore.wrapper =$('#'+div_id);
                        objectStore.self =objectStore.wrapper;
                        objectStore.element_id = div_id;

                        initObj = new _vs_multipleSelect(objectStore,option);

                        //Store initObj that provides access to mThis (static instance) of class vs_multipleSelect for accessing its member functions 
                        CommonLib.setData_local(_vs_ms_local_datastore_12121,div_id,initObj);
                        //Store instance of the initialized vs_multipleSelect. This is important in case there many instances of ItemsView on same page 
                        //CommonLib.setData_local(_vs_ms_local_datastore_12121,[div_id,'_instance'].join(''),objectStore);
                    } 
                    return initObj;     
            }
            
        };

 })(jQuery);

 
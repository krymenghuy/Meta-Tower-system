'use strict';
/***
  For the save of maintainability, this MagicEntryUtil class is create to provide important functions to MagicEntryDialog class
  For this reason, @mThis = mThis object in MagicEntryDialog, so that using @mThis here can access to the public members and method in MagicEntryDialog. 
  For example, "this.elements.elCommand" is the same as if we call "this.elements.elCommand" in MagicEntryDialog  
  ***/

class MagicEntryUtil{
    /**
     @data = {'zones',''} 
    **/  
     constructor(elements) {
      this.elements = elements;
      this.base_url =main_view.base_url;

        this.singleCommands = [
            {
            cmd:'t-n|normal|-n',
            field:{'name':'delivery_type','text':'Delivery Type','value':'Normal'}
            },
            {
            cmd:'t-f|fast|-f',
            field:{'name':'delivery_type','text':'Delivery Type','value':'Fast'}
            },
            {
            cmd:'c-y|c-1|cod-1|cod-yes',
            field:{'name':'cod','text':'COD','value':'1'}
            },
            {
            cmd:'c-n|c-0|cod-0|cod-no',
            field:{'name':'cod','text':'COD','value':'0'}
            }
        ]; 
 
        this.fields = [
            { 
                order:1,
                text:'Zone',
                name:'zone_code'
            },
            { 
                order:2,
                text:'Receiver Phone',
                name:'receiver_phone'
            },
          
          { 
              order:3,
              text:'Price',
              name:'price'
          },
       
          { 
              order:4,
              text:'Fee Payer',
              name:'df_payer'
          },
          { 
            order:5,
            text:'Receiver Address',
            name:'receiver_address'
         },
          { 
              order:6,
              text:'Weight',
              name:'billed_kg'
          },
          { 
            order:7,
            text:'COD',
            name:'cod'
         },
          { 
              order:8,
              text:'Size',
              name:'size'
          },
            { 
                order:9,
                text:'Delivery Type',
                name:'delivery_type'
            }
        ];

        this.data = {};
        this.data.action_by_user = true;

        this.field_count = 9; //**** count number of fields or columns***//
        //this.field_index =-1;
        this.fieldTips = [{cmd:'t-',name:'delivery_type'},{cmd:'r-',name:'receiver_phone'},{cmd:'p-',name:'price'},{cmd:'f-',name:'df_payer'},{cmd:'z-',name:'zone_code'},{cmd:'w-',name:'billed_kg'},{cmd:'c-',name:'cod'},{cmd:'a-',name:'receiver_address'},{cmd:'s-',name:'size'}];
        this.rem_fields = [];
    }
  
    // Whene user change Sender or Merchant by selecting from Select BOX then load a list of related orders
    reloadOrders(sender_id,order_id=null){
        let p = {'sender_id':sender_id};
        let that = this;

       vsapi.call(`${this.base_url}/api/magic-entry/order-list`,p).then(res=>{
          if(res.status_code===200){
                let orders = res.data;
                VSUtil.setComboItems(that.elements.elOrder,orders,'id','order_code',false,null,null);
            if (!order_id) order_id = orders[0]?orders[0]:{}.id;
            if(order_id>0) that.elements.elOrder.val(order_id).trigger('change');
          }  
       });
    }

    //After user press Enter key and the command successfully processed => display field info in section below
    displayField(d){
                let that = this;
                let found = false;  
                let disp_value = d.disp_value? d.disp_value : d.value;
                let elements = this.elements;
                if (!d.name) return;

                this.elements.div_fields.find(`.${d.name}`).each(function(){
                    let x = $(this);   
                    if(d.name ==='cod' || d.name == 'cod') disp_value = (d.value === 1)?'Yes':'No';
                    x.find('.pkl-pg-item-label').text(d.text); //User-friendly field name
                    x.find('.pkl-pg-item-value').text(disp_value).data('value',d.value);
                    found =true;
                    return false;
                });
            
                //begin:: Add COD = Yes field in case the provided @price > 0
                        let cod = 0;
                        let cod_field_html = '';
                        if (d.name ==='price'){
                            if (d.value > 0) cod =1; else cod =0; 
                            let cod_field_found = false;

                            that.elements.div_fields.find(`.cod`).each(function(){
                                let x = $(this);
                                x.find('.pkl-pg-item-label').text('COD'); //User-friendly field name
                                x.find('.pkl-pg-item-value').text((cod==1)?'Yes':'No').data('value',cod); 
                                cod_field_found=true;
                                return false;
                            });

                            if(!cod_field_found){
                                    let field_name = 'cod';
                                    cod_field_html =`<div class="pkl-pg-item cod">
                                    <span class="pkl-pg-item-label">COD</span>
                                    <span class="pkl-pg-item-value" data-field="${field_name}" data-value="${cod}">${(cod==1)?'Yes':'No'}</span>
                                    </div>`;
                            }
                            
                        }
                    //end:: Add COD = Yes field in case the provided @price > 0

                    if (!found){
                            let disp_value = null;

                            if(d.name ==='cod') 
                                disp_value = (d.value===1)?'Yes':'No';
                            else 
                                disp_value = d.disp_value? d.disp_value : d.value;

                            let html = `<div class="pkl-pg-item ${d.name}">
                                    <span class="pkl-pg-item-label">${d.text}</span>
                                    <span class="pkl-pg-item-value" data-field="${d.name}" data-value="${d.value}">${disp_value}</span>
                                </div> ${cod_field_html}`;

                            elements.div_fields.append(html);
                            found =true;
                    } 

                    //Set required fields for price/fess calculation 
                    if (found){
                        //NOTE: @price_fields =['delivery_type','zone_code','df_payer','price','cod','billed_kg']
                        //NOTE: @p_data is json object, a params for getDeliveryPriceInfo_magicEntry() via route "/api/magic-entry/calculate"
                        //if (!elements.price_fields) elements.price_fields =['delivery_type','zone_code','df_payer','price','cod','billed_kg'];  
                        if (elements.price_fields.indexOf(d.name) >=0){
                            //element.p_data must be global var in this class 
                            if(!elements.p_data) elements.p_data= {};
                            elements.p_data.order_id = this.data.order_id;
                            elements.p_data[d.name] = d.value;
                            vsapi.call(`${this.base_url}/api/magic-entry/calculate`,elements.p_data).then(res => {
                                if(res.status_code === 200){
                                    let d = res.data;
                                    //alert(JSON.stringify(d));
                                    that.displayTotals(d); 
                                }
                            });
                        }
        }

         this.removeFieldTip(d.name);
 
         //In fact, we display Next field by the order defined in array MEUtil.fields[] 
        //  let c = this.getFieldByIndex(this.field_index);
        //  if(!c) c ={};
        //  elements.elField.val(c.name).trigger('change');
        let next_field_name = this.getNextFieldName(elements.elField.val());
        //alert(elements.elField.val() +  '=> '+ next_field_name + ' ### ' + JSON.stringify(this.fields));
        elements.elField.val(next_field_name).trigger('change');
        elements.elCommand.val(null);
         
    }
 
    //returns next field name based on the "elements.elField"
    getNextFieldName(field_name){
       let i =0, c = null;

       do{
         c = this.fields[i];
         if(!c) break;
 
         if(c.name === field_name){
            if (i>this.field_count-1) return null;
            else return (this.fields[i+1]?this.fields[i+1]:{}).name; 
         } 
         i++;
       }while(c);
       return null;
    }

    //display zone_code first as Default field  when the magic Entry form is shown
    loadFields(def_field){
        let i =0,c;
        this.elements.elField.empty();
        do{
            c = this.fields[i];
            if(!c) break;
            this.elements.elField.append($('<option/>').text(c.text).val(c.name));  
            i++;
        }while(c);
        if(def_field) this.elements.elField.val(def_field).trigger('change');
      }
     
    /** getData() returns json object as input data for save package ***/
     getData(){
        this.div_fields.find('.data') 
     }

     getFieldByIndex(index){
        let i=0,c;
        do{
           c = this.fields[i];
           if(!c) break;
           if (index === c.order-1) return c;
           i++;
        }while(c);
        return null;
      }

      //Load important data such as merchant list, zone_list for fast searching
      //Currently, we use only zone list  (i.e: data.zones) for quick access to zone information when user press Enter Key
      initData(order_id, onFinish){
          let p = {'order_id':order_id};
          let that = this;
          vsapi.call(`${this.base_url}/api/magic-entry/data`,p).then(res =>{
            let d = res.data;
              //d = {'zones','senders','order_info'}
              // order_info = {'order_id','order_code','sender_name','sender_phone','package_count'}
              if(!that.data) that.data = {};
             

                //Set current order info such as (order_id,order_code, sender_name)
                    that.data.order_id = StringSanitizer.sanitizeOut(d.order_info.order_id);
                    that.data.sender_id = StringSanitizer.sanitizeOut(d.order_info.sender_id);
                    //that.data.sender_name = StringSanitizer.sanitizeObject(d.order_info.sender_name);
                    //this.data.sender_phone = d.order_info.sender_phone;

                    that.data.zones = StringSanitizer.sanitizeObject(d.zones);
                    that.data.senders = StringSanitizer.sanitizeObject(d.senders);

                    VSUtil.setComboItems(that.elements.elSender,that.data.senders,'id','sender_name',null,null,null);
                    that.elements.elSender.val(that.data.sender_id).trigger('change');  
                    // that.elements.elSender.val(that.data.sender_id);
                    // that.elements.elOrder.val(that.data.order_id);
              if(typeof onFinish ==='function') onFinish();
          });
      };
      
      //SetOrderInfo() is called when user change value of "Order" SELECT BOX (Order's change event fired)
      setOrderInfo (order_id,onFinish){
            let p = {'order_id':order_id}; 
            let that = this;
            if(!order_id) return;
            that.elements.elError.html(null);
            //this getOrderInfo() api returns object {'order_id','order_code','package_count','status_id'}
            vsapi.call(`${this.base_url}/api/magic-entry/order-info`,p).then(res =>{
                let d = StringSanitizer.sanitizeObject(res.data);
                if (!d){
                    that.elements.elError.html(`Order ID ${order_id?order_id:'Empty'} is not found!`);
                }else{
                    that.data.sender_name = d.sender_name;
                    that.data.sender_id = d.sender_id;
                    that.data.order_id = d.order_id;
                    that.data.order_code = d.order_code;
                 
                    //if (!that.elements.elSender.val()) 
                    //that.elements.elSender.val(d.sender_id).trigger('change');
                    ////that.elements.elOrder.val(d.order_id).trigger('change');
                    //alert('set sender = ' + d.sender_id);
                    that.elements.elPackageCount.text(d.package_count);

                  //Set action_by_user = true to ensure that when user selects and change the Order by selecting option in elOrder SELECT BOX => the 'change' event fires
                    that.data.action_by_user = true;
                  //NOTE @action_by_user is set to FALSE then user uses command shortcut to change Order
  
                }
                that.elements.elCommand.val(null);
 
                if(typeof onFinish ==='function') onFinish(d);
            });
      };
     
      getZoneByCode(zone_code){
          if (!this.data) this.data = {};
         if(!this.data.zones) this.data.zones = [];
         let i=0,c;
         zone_code = (zone_code+'').toLowerCase();
         let similar_zones = [];
         do{
            c = this.data.zones[i];
            if(!c) break;
               let z_code = (c.zone_code+'').toLowerCase();

              if (z_code.indexOf(zone_code)>=0) return c; 
              else if(z_code === zone_code) return c;

              else if (z_code.indexOf(zone_code)>=0){
                 similar_zones.push(c);
              } 
              else if((c.zone_name + '').toLowerCase() === zone_code) return c;
            i++;
         }while(c);
          if (similar_zones[0] && !similar_zones[1]) return similar_zones[0];
         return null;
      }
    
      getFieldBySingleCommand(cmd){
        let i=0,c;
        do{
            c = this.singleCommands[i];
            if(!c) break;
               let arr = c.cmd.split('|');
               if (arr.indexOf(cmd) !=-1) return c.field;
            i++;
        }while(c);
    
        return null;
      };
    
      getFieldByCommand(cmd){
          cmd = (cmd+'').toLowerCase();
    
          /** Check single entry such as "t-n", "n","normal" that is intended to be "delivery_type = Normal" **/
          let f = this.getFieldBySingleCommand(cmd);
          if (f) return f;
          else if (cmd.indexOf('-') === 1){
             //split $cmd by '-'. The left part is field directive, the right part is field's value. For example "p-35" => means price = $35
             let st = (cmd+'').split('-');
             let a = st[0].toLocaleLowerCase();
             //define currency for the money field: Price
             let cur ='$';

             if(a==='p'){
                 let val = (parseFloat(st[1]) >=0)?st[1]:0;
                 return {'name':'price','text':'Price','value':val,'disp_value':[cur,val].join('')};
             }
             else if (a==='r'){
                return {'name':'receiver_phone','text':'Receiver Phone','value':st[1]};
             }
             else if (a==='z' || a==='zone'){
                let zone_code = st[1];
                let z = this.getZoneByCode(zone_code);
                if(!z){
                    this.elements.elError.text(`Zone code "${zone_code}" not found!`);
                    return null;
                }
                return {'name':'zone_code','text':'Zone','value':z.zone_code,'disp_value':z.zone_name};
             }
             else if (a=='w' || a=='kg' || a=='weight'){
                let val = (parseFloat(st[1]) >=0)?st[1]:0;
                return {'name':'billed_kg','text':'Billed KG','value':val,'disp_value':[val,' kg'].join('')};
             } 
             else if (a==='f' || a==='dfp' || a==='payer'){
                let val = (st[1]+'').toLowerCase(); 
                if (val==0 || val==='s' || val==='m' || val==='merchant') val='sender';
                else val='receiver';
                return {'name':'df_payer','text':'Fee Payer','value':val};
             }
             else if (a==='s' || a==='size'){
                 let val = st[1];
                 let f_size = DUtil.getFriendlySize(val);  
                 
                 return {'name':'size','text':'(Width Length Height)','value':val,'disp_value':f_size};
             }
             else if (a==='a' || a==='adr' || a ==='address'){
                let cnt = st.length;
                let val = '';
                for (let i =1; i<cnt;i++){
                   val =[val,st[i]].join('');
                }
                val = DUtil.escapeHtml(val);
                return {'name':'receiver_address','text':'Receiver Address','value':val,'disp_value':val};
            }
             else if (a==='c' || a==='cod'){
                let val = (st[1]+'').toLowerCase();
                if (val ==='y' || val ==='yes' || val ==='1') val =1;
                else val = 0; 
                return {'name':'cod','text':'COD','value':val,'disp_value':(val===1)?'Yes':'No'};
             }
             else if (a==='o' || a==='order'){
                let order_id = st[1];
                let that = this;

                that.data.action_by_user = false;
                this.setOrderInfo(order_id,(d)=>{
                    //@d = {sender_id,order_id,package_count}
                    //This is the case where user uses Command shortcut to change Order Info => so we must set value of elements.elSender, elements.elOrder
                    if(!d) return;
                    that.data.default_order_id = d.order_id; 
                    that.elements.elSender.val(d.sender_id).trigger('change');
                });
                //returning -1 means when user enter "order-267 or o-267" in order to switch to another order
                return -1; 
             } 
            
             
          } 
         else if (cmd ==='cls' || cmd ==='clear') /** this case: cmd is exact string such as "cls" or "clear" **/
         {
              this.clearForm(); 
              return -1;
         }
         else /** this case: cmd is not in this format one-letter-command followed by dash such as "o- or t- or z-, ....etc ")**/
         {
            //getValue() transforms object {name,text,value}. method getValue() transforms shortcut value to real value. For example:
             //For delivery_type => transform 'n' to 'Normal', and tranform 'f' to 'Fast'
              let mField = this.getValue(cmd);
              return {'name':mField.name,'text':mField.text,'value':mField.value,'disp_value':mField.disp_value};
         }
        //return cm;
      };
    
      //getValue() transforms shortcut to real value. For example, from 'n' to 'Normal'
      getValue(cmd){
         let field = this.elements.elField.val();
         let fiendly_name = this.elements.elField.find('option:selected').text();

         switch(field){
            // case 'price':
            //     {
            //         alert(cmd); 
            //         break;
            //            //return {name:'delivery_type',text:'Delivery Type',value:'Fast'};
            //     }
            case 'delivery_type':
            {
                   if (cmd==='n') return {name:'delivery_type',text:'Delivery Type',value:'Normal'};
                   else if (cmd==='f') return {name:'delivery_type',text:'Delivery Type',value:'Fast'};
            }
            case 'zone_code':
            {
                let z = this.getZoneByCode(cmd);
                if (!z) z = {};
                return {'name':'zone_code','text':'Zone','value':z.zone_code,'disp_value':z.zone_name};
            }   
            case 'size':
            {
                //if (cmd==='1' || cmd==='s' || cmd==='sender') return {name:'df_payer',text:'Fee Payer',value:'sender'};
                return {name:'size',text:'Size',value:cmd,'disp_value':DUtil.getFriendlySize(cmd)};
            } 
            case 'df_payer':
            {
                       if (cmd==='1' || cmd === 's' || cmd==='sender' ||cmd==='merchant' || cmd==='vendor') 
                         return {name:'df_payer',text:'Fee Payer',value:'sender','disp_value':'Sender'};
                       else return {name:'df_payer',text:'Fee Payer',value:'receiver','disp_value':'Receiver'};
            }
            case 'cod':{
                return {name:'cod',text:'COD',value:(cmd===1)?cmd:0,'disp_value':(cmd===1)?'Yes':'No'};
            } 
            case 'billed_kg':{
                   //The following code is to ensure the cmd or value is numeric to avoid error
                   let val = $.isNumeric(cmd)?cmd:0;
                   return {name:'billed_kg',text:'Weight',value:val,'disp_value':[val,' kg'].join('')};
            }    
            case 'price':{
                //The following code is to ensure the cmd or value is numeric to avoid error
                let val = $.isNumeric(cmd)?cmd:0;
                if (val<0) return -1;
                return {name:'price',text:'Price',value:val,'disp_value':['$',val].join('')};
            }    
            default:
                break;
         }

         return {name:field,text:fiendly_name,value:cmd}; 
          
      };

      //displaySummary()
      displayTotals(d){
         if(!d) {
            this.elements.div_summary.find('.pkl-summary-total').each(function(){
                let el = $(this);
                let f = el.data('field');
                //let f_name = el.data('name');// user friendly field name
                el.text(0);
             });
             return;
         }

         if (d.fees<0) d ={}; 
         if(!this.elements.div_summary.is(':visible')) {
            this.elements.div_summary.addClass('effect-zoomin');
            this.elements.div_summary.show();
         }
          this.elements.div_summary.find('.pkl-summary-total').each(function(){
           let el = $(this);
           let f = el.data('field');
           let f_name = el.data('name');// user friendly field name
           if(!d.cur) d.cur = '$';
           el.text([f_name,' : ',d.cur,d[f]?d[f]:0].join(''));
        });
      }
      
    clearForm(){
          let default_deliveryType = this.elements.elDefaultDeliveryType.val(); 
          //Clear all fields
          this.elements.div_fields.empty();
          if(!default_deliveryType) default_deliveryType='-n';
          if (default_deliveryType ==='-f' || default_deliveryType === '-n'){
              let c = this.getFieldBySingleCommand(default_deliveryType);
              this.displayField(c);
          }else
          //{
               //Append fields header text "Package Information"
               this.elements.div_fields.append('<span class="pkl-me-pginfo">Package Information</span>');
          //}
        
          this.elements.elCommand.val(null);
          //display field tips, except "delivery_type"
          this.setFieldTips(['delivery_type']);
          this.elements.elField.val('zone_code').trigger('change');
          
          //this.field_index = 0;
          this.elements.div_summary.hide();
    }
    
    setFieldTips(excepts =[]){
       let i=0,c;
       this.elements.div_field_tips.empty();
        do{
           c = this.fieldTips[i];
           if(!c) break;
                if (excepts.indexOf(c.name) <0) {
                    let html =[`<a class="field-tip" data-name="`,c.name,`" href="javascript:void(0)">`,c.cmd,`</a>`].join(''); 
                    this.elements.div_field_tips.append(html);
                }
           i++;
       }while(c);
    }

    removeFieldTip(field_name){
        field_name = (field_name+'').toLowerCase();
        this.elements.div_field_tips.find('.field-tip').each(function(){
            let el = $(this);
            let name = (el.data('name')+'').toLowerCase();
            if(name === field_name) {
                el.remove();
                return false;
            }  
        });
    }

    getItem(){
        let p = {
            'order_id':this.data.order_id
            //,'sender_id':this.data.sender_id
        };

        this.elements.div_fields.find('.pkl-pg-item-value').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(f === 'size' || f == 'size') 
              p[f] = DUtil.processPackageSize(el.data('value'));
            else 
              p[f] = el.data('value');
        });

        return p;
    }

    savePackageInfo(){
        let that = this;
        let p = this.getItem();
        vsapi.call(`${this.base_url}/api/saveOrderPackageDetails`,p).then(res => {
            if(res.status_code === 200){
                let result = res.data;
               that.elements.elPackageCount.text(result.package_count);
               that.clearForm();  
            }else that.elements.elError.text(res.error_message);
        });
        //alert(JSON.stringify(this.getItem()));
    }
         
}


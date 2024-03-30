'use strict';
/***
  NOTE: corresponding HTML of dialog is written in PickupListComponent.blade.php 
 ***/
//## begin:: MagicEntryDialog
let MagicEntryDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.children('#_dlgMagicEntry');
    
    this.elements = new function() {
      this.price_fields = ['delivery_type','zone_code','df_payer','price','cod','billed_kg']; //fields that are used to calculate prices and fees  
      this.btnSubmit = mThis.self.find('#_dlgMagicEntry_btnSubmit');  
      this.btnClose = mThis.self.find('#_dlgMagicEntry_btnClose');
      this.div_fields = mThis.self.find('#_pkl_pg_fields'); 
      this.elError = mThis.self.find('#_dlgMagicEntry_error');
    
      this.elSender = mThis.self.find('#_pkl_me_sender');
      this.elDefaultDeliveryType = mThis.self.find('#_pkl_default_delivery_type');
      this.elOrder = mThis.self.find('#_pkl_me_order_code');
      this.elPackageCount = mThis.self.find('#_pkl_me_pkg_count');

      this.lblFieldName = mThis.self.find('#_bkl_fiel_name'); //field name displayed for help to user
      this.div_summary = mThis.self.find('#_pkl_me_summary');
      this.div_field_tips = mThis.self.find('#_pkl_field_tips');
   
      this.elCommand = mThis.self.find('#_pkl_command');
      this.elField = mThis.self.find('#_pkl_field');
    }
    this.visible = false;
    this.default_order_id = null;

    //If user type one the following char then add dash char '-' to it 
    this.key_words =[
        'z','t','f','p','c','r','w','a','s','o'
    ];
  //   //Current @order object {'order_id',['order_code'],'sender_id','sender_name'}
  //   this.order = new function(){
  //     this.sender_id = null;
  //     this.order_id; 
  //   }
  
    let MEUtil = null;
    
    this.savePackageInfo = ()=>{
        if(!MEUtil) {
            console.error('Error: MEUtil object has not been initialized');
            return;
        }
        MEUtil.savePackageInfo();
    }
    //begin:: MagicEntry.init()
    this.init = function() {
                  //mThis.field_index = 0;
                  MEUtil = new MagicEntryUtil(this.elements);

                  this.elements.btnSubmit.on('click',function(e){
                      e.preventDefault();
                      MEUtil.savePackageInfo();
                  });

                  this.elements.elDefaultDeliveryType.on('change',function(e){
                        let cmd = $(this).val();
                        let f = MEUtil.getFieldBySingleCommand(cmd);
                        MEUtil.displayField(f);
                  });

                //   this.elements.elField.on('change',function(e){
                //      //MEUtil.field_index =$(this).find('option:selected').index(); 
                //      alert($(this).val());
                //   });

                  this.elements.elSender.on('change',function(e){
                      MEUtil.data.sender_id = $(this).val();
                      MEUtil.reloadOrders(MEUtil.data.sender_id, MEUtil.data.default_order_id);
                  });

                  this.elements.elOrder.on('change',function(e){
                      //MEUtil.data.order_id = $(this).val();
                      let order_id = $(this).val();
                      MEUtil.setOrderInfo(order_id);
                  });

                  this.elements.elCommand.on('keyup',function(e){
                      e.preventDefault();
                            if (e.key==='Enter' && e.ctrlKey){
                                mThis.savePackageInfo();
                                return;
                            }
                            
                            if(e.key ==="Enter"){
                                MEUtil.displayTotals();
                                let cmd = $(this).val(); 
                                //Clear Error before processing new cmd
                                mThis.elements.elError.html(null);
                                //MEUtil.field_index++;

                                // //This line will select Field "Zone" after all fields are entered (value) by user
                                // if (MEUtil.field_index > MEUtil.field_count-1) MEUtil.field_index =0;
                                
                                //This line will select empty field after all fields are entered (value) by user
                                //if (MEUtil.field_index > MEUtil.field_count-1) MEUtil.field_index =-1;
                                  
                                let x = MEUtil.getFieldByCommand(cmd);
                                if(x === -1)  
                                {
                                        //mThis.setOrderInfo(); //switch to another Order. This is done in function getFieldByCommand() when user enter, for example: "order-267 or o-267"
                                        return ;
                                }
                                else if (x){
                                    MEUtil.displayField(x);
                                }
                                else{
                                    if (!mThis.elements.elField.val()){
                                        mThis.elements.elError.html('No field selected!');
                                        return;
                                    }
                                    let text = mThis.elements.elField.find('option:selected').text();
                                    let x = {'name':mThis.elements.elField.val(),'text':text,'value':cmd};
                                    MEUtil.displayField(x);
                                }

                                //MEUtil.field_index = mThis.field_index;
                                //Display next field in SELECT BOX elField
                        
                            } else if (e.key ===" "){
                                let val = (mThis.elements.elCommand.val()+'').trim().toLowerCase();
                                if(val.length===1){
                                    if(mThis.key_words.indexOf(val) !=-1) mThis.elements.elCommand.val([val,'-'].join(''));
                                }
                            } 
                  });
                   
                  this.elements.btnClose.on('click',(e)=>{
                      e.preventDefault();
                      //if (typeof mThis.onClose === 'function') mThis.onClose(null);
                      mThis.self.modal('hide');
                  });

                  this.self.on('hide.bs.modal',()=>{
                      if (typeof mThis.onClose === 'function') mThis.onClose(null);
                      mThis.visible = false;
                  });
                   
    }
    //end:: MagicEntry.init()
     
    
      //begin:: MagicEntryDialog.show()
      this.show = (op, onClose)=>{
          if (!mThis.order)  mThis.order = {};
          mThis.field_index = 0;
          mThis.elements.div_fields.empty().append('<span class="pkl-me-pginfo">Package Information</span>');
          mThis.elements.elError.html(null);
          mThis.elements.elPackageCount.text(0);
          mThis.onClose = onClose;
 
          MEUtil.loadFields('zone_code');
          
          // variable "MEUtil.data.default_order_id" is used in elSender.on('change') event
          MEUtil.data.default_order_id = op.order_id;

          //mThis.order.order_id = op.order_id;
          //mThis.order.sender_id = op.sender_id;
          //mThis.order.sender_name = op.sender_name;
  
          MEUtil.initData(op.order_id, 
              ()=>{
                      MEUtil.clearForm();
                      mThis.elements.elSender.val(op.sender_id).trigger('change'); 

                      mThis.self.modal({
                          'backdrop':'static'
                      }).on('shown.bs.modal',function(){
                          mThis.visible = true;
                      });

              }
          );
  
       
         
      }
     //end:: MagicEntry.show()
  
     //Call MagicEntry.init()
     mThis.init();
  
  }
  //end::MagicEntryDialog
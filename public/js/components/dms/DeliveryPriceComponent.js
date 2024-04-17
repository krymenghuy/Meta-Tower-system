'use strict';
var DeliveryPriceComponent = new function(){
    let mThis = this;
    this.title_prop = "Price Lists";//Price Lists
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_sttn_deliveryPriceComponent');

    this.init = function(){
      //mThis.title ='Zone Prices';
      return null;
    } 
    //end::DeliveryZoneCompoent.init()
      
    this.show = function(option) {
      PriceTabView.show('prices',true);
      mThis.self.siblings().hide();
      main_view.setTitle(mThis.title_prop);
      mThis.self.hide().fadeIn(200);
    }

    this.hide = function(){
      mThis.self.hide();
    }
}
//end::DeliveryPriceComponent

//begin::PriceTabView
const PriceTabView = new function(){
    let mThis = this;
    this.self = DeliveryPriceComponent.self.find('#_sttn_priceTabView');
    this.title_prop = "Price";

    this.base_url =main_view.base_url;
    this.elFilter_deliverytype = this.self.find('#_sttn_price_filter_dtype');
    this.elFilter_zone = this.self.find('#_sttn_price_filter_zone');
    this.elFilter_sender = this.self.find('#_sttn_price_filter_sender');
    
    this.elScriptText = this.self.find('#_sttn_price_script_text');
    this.elScriptMeaning = this.self.find('#_sttn_price_script_meaning');
    this.btnRunScript = this.self.find('#_sttn_btnRunScript');
    this.btnGetSampleScript = this.self.find('#_sttn_btnGetSample');
    this.btnImportScript = this.self.find('#_sttn_btnImportScript');
    this.elError = this.self.find('#_sttn_script_error');

    this.form_data = null;
    this.cur_view = 'prices';
    
    this.self.on('click','div.tab-header>a.tab-button',function(e){
        e.preventDefault();
        //alert($(this).data('target'));
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.show(view_name,true);
    }); 
   
    this.elFilter_deliverytype.on('change',function(){
       mThis.displayPrices(null);
    });
  
   this.elFilter_zone.on('change',function(){
       mThis.displayPrices(null);
    });

   this.elFilter_sender.on('change',function(){
       mThis.displayPrices(null);
   });

    //PriceTabView => load sender list, zone list, delivery_type
    this.loadFilterData = (def,onFinish)=>{
      if(!def) def = {};
      if (!def.sender_id) def.sender_id = null;
      if(!def.zone_code) def.zone_code ='all';

      if (mThis.form_data) {
        VSUtil.setComboItems(mThis.elFilterSender_cod,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id); //Sender filter on tab view "COD FEE"
        VSUtil.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id); //Sender filter on tab view "PRICE BY ZONE"
        VSUtil.setComboItems(mThis.elFilter_zone,mThis.form_data.zones,'zone_code','zone_name',false,null,def.zone_code); //Zone filter on tab view "PRICE BY ZONE"
        if (typeof onFinish == 'function') onFinish();
        return;
      }
       vsapi.call([mThis.base_url,'/dms/getFormOptions_priceline'].join(''),null).then(res=>{
         if(res.status_code===200){
          let data = res.data;
           data.zones = StringSanitizer.sanitizeObject(data.zones);
           data.senders = StringSanitizer.sanitizeObject(data.senders);
           data.zones.unshift({'zone_code':'all','zone_name':'(All Zones)'});
           data.senders.unshift({'id':null,'sender_name':'(All Merchants)'});
           VSUtil.setComboItems(mThis.elFilterSender_cod,data.senders,'id','sender_name',false,null,def.sender_id); //Sender filter on tab view "COD FEE"
           VSUtil.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,null,def.sender_id); //Sender filter on tab view "PRICE BY ZONE"
           VSUtil.setComboItems(mThis.elFilter_zone,data.zones,'zone_code','zone_name',false,null,def.zone_code); //Zone filter on tab view "PRICE BY ZONE"
           mThis.form_data = data;
           if (typeof onFinish === 'function') onFinish();
         }
       });
    }

    //parameter @def_filter_data = {'delivery_type','zone_code','sender_id'} used to display price list
    this.show = function(view_name,tab_button_clicked = false,filter_data){
       main_view.setTitle(mThis.title_prop);
       //Show PriceTabView and hide PriceLinePanel object
       PriceLinePanel.self.hide(); //Hide PriceLinePanel view
       mThis.self.show(); //show TabView container 

         mThis.loadFilterData(null,()=>{
          mThis.elFilter_zone.trigger('change');
         });

         if (!view_name) view_name = mThis.cur_view;
         view_name = (view_name+'').toLowerCase(); 

         mThis.self.find('div.tab-body>div.tab-panel').each(function(){
             let this_view_name =($(this).data('viewname')+'').toLowerCase();
            
             if(view_name == this_view_name) {

                 mThis.cur_view =view_name;
                 $(this).show().siblings().hide();

                  //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
                       if (view_name =='prices') {
                           mThis.displayPrices(filter_data? filter_data : mThis.prev_filter_data);
                            
                       } else if (view_name =='other_fees') //COD FEE tab view
                       {
                    
                         mThis.displayCODFees(false);
                       }else if (view_name=='promotions')
                       { 
                          //Fixed Price All zone promotion by Sender with expiry date
                          mThis.displayBaseFees();
                       }
                       // else {
                       //   //do nothing   
                       // }
                  //end:: dispay content data
  
                  //Add Active css class to current tab button
                  if (!tab_button_clicked) {
                    let tab_btn = mThis.self.find('div.tab-header>a[data-viewname="prices"]');
                    tab_btn.addClass('active').siblings().removeClass('active');
                  }
                 return;
             } 
         }); 
  
         //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
         if(tab_button_clicked) { 
           mThis.self.find('div.tab-header>a.tab-button').each(function() {
             let this_view_name =($(this).data('viewname')+'').toLowerCase();
             if (view_name == this_view_name){
                 $(this).addClass('active').siblings().removeClass('active');
             }
           });
         }        
    } 
  
    //begin::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
           //begin::define specific elements, tables within this PriceTabView tasks 
               //this.container = $('#_sttn_price_container');   
               const div = this.self;
               this.tblPrices = div.find('#_sttn_price_tblPrices');
               this.tblPrices_body = div.find('#_sttn_price_tblPrices_body');
               this.tblBaseFees = div.find('#_sttn_tblBaseFees');

               this.tblCODs = div.find('#_sttn_price_tblcods');
               this.tblCODs_body = div.find('#_sttn_price_tblcods_body');
               this.btnNewCOD = div.find('#_sttn_btnNewCOD');
               //this.elSearch_cod = div.find('#_sttn_cod_search');
               this.elFilterSender_cod = $('#_sttn_filter_cod_sender'); 
               this.elFilterDeliveryType_cod = div.find('#_sttn_filter_cod_dtype'); 

               this.tblBaseFees_cols = [];
               this.btnNewBaseFee = div.find('#_sttn_btnNewBaseFee');

               this.lnkAddPrice= div.find('#_sttn_price_lnkNewPrice');
               this.btnSaveCODCharge = div.find('#_sttn_btnSaveCODCharge');
               this.elCODFeeChargePercent = div.find('#_sttn_CODFeeChargePercent'); 

               this.elFilter_delivery_type = div.find('#_sttn_price_filter_dtype');  
               this.elFilter_zone= div.find('#_sttn_price_filter_zone');  
               this.elFilter_sender = div.find('#_sttn_price_filter_sender') 
               
               //Price Script

               //importScript() | importPrices| uploadPrices|upload|import
               mThis.btnImportScript.on('click',(e)=>{
                   e.preventDefault();
                   let text = mThis.elScriptText.val();
                    let p = {'p_script':text};
                    vsapi.call([mThis.base_url,'/dms/importPricesByScript'].join(''),p).then(res=>{
                       //if(result.error_count > 0) mThis.elError.
                    });
               });

               mThis.btnGetSampleScript.on('click',(e)=>{
                  let text = mThis.elScriptText.val();
                  vsapi.call([mThis.base_url,'/dms/getSampleScript'].join(''),null).then(res=>{
                    //d = StringSanitizer.sanitizeOut(d,null,['=','#',',']);
                    //mThis.elScriptText.clear();
                    let d = res.data;
                    mThis.elScriptText.val(d);
                  });
               });

               mThis.btnRunScript.on('click',(e)=>{
                  let text = mThis.elScriptText.val();
                  let p = {'p_script':text};
                  vsapi.call(`${mThis.base_url}/dms/translateScript`,p).then(res => {
                    if(res.status_code === 200){
                      let d = res.data;
                      mThis.elScriptMeaning.html(d);
                    }
                  });
                });


               //Click to Save COD Charge 
               this.btnSaveCODCharge.on('click',function(e){
                 e.preventDefault();
                 let p = {'sender_id':null,'cod_fee_percent':mThis.elCODFeeChargePercent.val(), 'cod_fee':0,'charge_option':'percentage'};
                 vsapi.call(`${mThis.base_url}/dms/saveCODFeeCharge`,p).then(res => {
                    if(res.status_code === 200) {
                        cv_interact.info('COD Fee Charge has been saved!');
                    }else cv_interact.error(error_message);
                 });
               });
 
               //Click to add new price 
               this.lnkAddPrice.on('click',function(e){
                   e.preventDefault();
                   let sender_id = mThis.elFilter_sender.val();
                   let option = {'title':'New Price Line','form_data':mThis.form_data,'sender_id':sender_id,'price_id':null};
                   PriceLinePanel.show(option, function(d){
                      //let f = {'delivery_type':d.delivery_type,'zone_code':d.zone_code,'sender_id':d.sender_id}; 
                      let tab_view_name ='prices';  
                      PriceTabView.show(tab_view_name,true,d) //refresh Price List 
                      //todo: call mThis.swapRows(from_tr,to_tr,cssClass,2500) to put newly edited row First and higlight it for a few ms
                   }); 

               });
  
               //Filter sender on tabl view "COD FEE"
               mThis.elFilterSender_cod.on('change',function(e){
                   mThis.displayCODFees();
               });

               mThis.elFilterDeliveryType_cod.on('change',function(e){
                  mThis.displayCODFees();
               });

               //Add New Base Fee Promotion
               this.btnNewBaseFee.on('click',function(e){
                 e.preventDefault();
                  mThis.addRow_blank();
                });

               //Click to add new COD fee per Sender and Delivery type  (tab view "COD FEE")
               this.btnNewCOD.on('click',function(e){
                  e.preventDefault();
                  let sender_anme = mThis.elFilterSender_cod.find('option:selected').text();
                  let option = {'title':'New COD','sender_id':mThis.elFilterSender_cod.val(), 'sender_name':sender_anme};
                  CODDialog.show(option,(d)=>{
                    if(d){
                       //d = {'sender_id','delivery_type'} used as filter to display cod fees in tbCODs
                       mThis.elFilterSender_cod.val(d.sender_id);
                       mThis.elFilterDeliveryType_cod.val(d.delivery_type);
                       mThis.displayCODFees(false);
                    }
                  });
                }); 
              //  this.elFilter_delivery_type.on('change',function(){
                
              //  });
  
              //   //On CommuneListPanel: User select Filter City, then displays list of related districts, and when user select District => display List of communes
              //   this.elFilter_zone.on('change', function(){
                   
              //   });
              
              //  this.elFilter_sender.on('change', function(){
                  
              //  });
               
               mThis.tblPrices_body.on('click','a._sttn_price_edit_price',function(e){
                 e.preventDefault();
                 let id = $(this).data('id');
                 let sender_id = mThis.elFilter_sender.val();
                 let option ={'title':'Edit Price Line','price_id':id,'form_data':mThis.form_data,'sender_id':sender_id};
                 
                 PriceLinePanel.show(option,function(d){
                    if(d){
                        PriceTabView.show('prices',true,d);
                    }
                 });
               });

               mThis.tblPrices_body.on('click','a._sttn_price_delete_price',function(e){
                e.preventDefault();
                let id = $(this).data('id');
                let sender_id = mThis.elFilter_sender.val(); // $(this).data('senderid');
                cv_interact.confirm('Delete this Price Line?','Delete Price Line',function(e){
                      if(e){
                        let p = {'id':id,'sender_id':sender_id}; // NOTE parameter @sender_id is used to find target table "price_list" or "sender_price_list" for deleting
                         vsapi.call([mThis.base_url,'/dms/deletePriceLine'].join(''),p).then(res=>{
                            if (res.status_code===200){
                               mThis.displayPrices();
                            } else cv_interact.error(res.error_message);
                         });
                      }
                }); 
              });

               mThis.tblPrices_body.on('click','a._sttn_price_delete_city',function(e){
                 e.preventDefault();
                 let p = {'id':$(this).data('id')};
                 if(!p.city_id) p.city_id=0;
                 //p.id = p.city_id;
                 cv_interact.confirm('Delete this price?',{title:'Delete Price'},(e)=>{
                   if(e){
                     vsapi.call(`${mThis.base_url}/dms/deletePrice`,p).then(res => {
                       if(res.status_code === 200){
                         mThis.displayPrices(mThis.country_id);
                       } else cv_interact.error(error_message);
                     });
                   }
                 });
               });
              
                //  //When user enter Merchant ID, and then get sender name into Merchant Name box
                //  mThis.tblBaseFees.on('click','tbody>tr col-input',function(e){
                //     e.preventDefault();
                    
                //  });

                  //When user click on Edit button on each (tblBaseFees) table Row 
                  mThis.tblBaseFees.on('click','tbody>tr button._sttn_bf_edit',function(e){
                      e.preventDefault();
                      let tr = $(this).closest('tr');
                      mThis.changeRowState(tr,'edit');
                  });

                   //When user click on Edit button on each (tblBaseFees) table Row 
                   mThis.tblBaseFees.on('click','button._sttn_bf_cancel',function(e){
                      e.preventDefault();
                      let tr = $(this).closest('tr');
                      mThis.changeRowState(tr,'view'); 
                   });

                     //When user click on Save button in the row in order to save changes of base Fee to server 
                     mThis.tblBaseFees.on('click','button._sttn_bf_save',function(e){
                      e.preventDefault();
                      let tr = $(this).closest('tr');
                      let p = mThis.getRowData(tr);
                      if (!p) return;
                      vsapi.call(`${mThis.base_url}/dms/saveBaseFee`,p).then(res => {
                         if (res.status_code === 200) {
                             mThis.changeRowState(tr,'view');
                         }else cv_interact.error(error_message);
                      });  
                   });

                    //When user click to delete base fee row in tblBaseFees 
                    mThis.tblBaseFees.on('click','button._sttn_bf_delete',function(e){
                      e.preventDefault();
                      let tr = $(this).closest('tr');
                      mThis.deleteBaseFee(tr);
                   });

                   //When user click to Find Sender button in row in table tblBaseFees 
                   mThis.tblBaseFees.on('click','button._sttn_bf_find_sender',function(e){
                        e.preventDefault();
                        let tr = $(this).closest('tr');
                        let option = {'title':'Find Merchant','role':'sender','singleSelect':true};
                        FindPersonDialog.show(option,(ps)=>{
                          if(ps[0]){
                              let d = ps[0];
                              EditableTable.setCellValue(tr,'sender_name',d.name);
                              EditableTable.setCellValue(tr,'sender_code',d.code);
                              tr.data('senderid',d.id);
                          }
                        }); 
                 });
                 
                 //Click to delete COD Fee
                 mThis.tblCODs_body.on('click','a._sttn_price_cod_delete',function(e){
                   e.preventDefault();
                     let x = $(this);
                     let p = {'id':x.data('id')};
                     cv_interact.confirm('Delete COD?',{title:'Delete COD'},function(e){
                       if(e) {
                          vsapi.call(`${mThis.base_url}/dms/deleteCODFee`,p).then(res => {
                            if (res.status_code === 200) {
                              mThis.displayCODFees();
                            } cv_interact.error(error_message);
                          });
                       }
                     });
                  });
                   //Click to edit COD Fee
                 mThis.tblCODs_body.on('click','a._sttn_price_cod_edit',function(e){
                  e.preventDefault();
                    let x = $(this);
                    let p = {'id':x.data('id')};
                    alert('todo: edit COD Fee');
                 });

                 mThis.tblBaseFees.on('mouseover','tbody>tr',function(e){
                    let tr = $(this);
                    if (tr.hasClass('editing')) {
                      let td = tr.find('td.col_action');
                      let btnFind = td.find('button._sttn_bf_find_sender');
                      btnFind.show();
                    }
                 }).on('mouseleave','tbody>tr',function(e){
                      let tr = $(this);
                      if (tr.hasClass('editing')) {
                        let td= $(this).find('td.col_action');
                        let btnFind = td.find('button._sttn_bf_find_sender');
                        btnFind.hide();
                      }
                 });

              //end::define specific elements
         
          //target_state = {'edit','view'}// target state = 'edit' means When user click on Edit button then show Save button and Cancel Save button
          //target_state ='view' => changeRowState() sets the current row to view mode, and user cannot edit information in each cell 
          this.changeRowState = function(tr,target_state){
            let td = tr.find('td.col_action');
             
             let base_fee_id= tr.data('id'); 
             let sender_id = tr.data('senderid');
           
               if (target_state ==='edit') //When user click on Edit button => then switch row state to Editable mode with two buttons (Save, Cancel)
               {
                     //todo: change previous row state that is being edited to View mode first 
                     let div1 = td.find('div._sttn_bf_save_cancel'); //div that contains Save button and Cancel button
                      if(div1.length ==0 || !div1) {
                      
                        let html =['<div class="_sttn_bf_save_cancel">',
                        '<button type="button" class="_sttn_bf_save btn btn-sm btn-outline-primary" data-id="',base_fee_id,'" data-senderid="',sender_id,'">Save</button>&nbsp;',
                        '<button type="button" class="_sttn_bf_cancel btn btn-sm btn-outline-danger" data-id="',base_fee_id,'">Cancel</button>&nbsp;',
                        '<button style="display:none" type="button" class="_sttn_bf_find_sender btn btn-sm btn-outline-success" data-id="',base_fee_id,'"><i class="fa fa-search"></i></button>',
                        '</div>'].join('');

                        td.append(html);
                        let dx = td.find('div._sttn_bf_save_cancel');
                        
                        dx.show().siblings().hide();
                      } else {
                         div1.show().siblings().hide();
                      } 
                      mThis.setReadOnly_row(tr,false);
                      tr.data('editing',1);
                      tr.addClass('editing');

                } else //If user click on Save or Cancel button => switch Row state to View mode with two buttons (Edit, Delete)
                {
                   let div = td.find('div._sttn_bf_edit_delete'); //div that contains Edit button and Delete button
                   if (div.length > 0){
                      div.show().siblings().hide();
                   }else{
                    let html =['<div class="_sttn_bf_edit_delete">',
                    '<button type="button" class="_sttn_bf_edit btn btn-sm btn-outline-primary" data-id="',base_fee_id,'" data-senderid="',sender_id,'"><i class="fa fa-edit" style="color:green"></i></button>&nbsp;',
                    '<button type="button" class="_sttn_bf_delete btn btn-sm btn-outline-danger" data-id="',base_fee_id,'"><i class="fa fa-times" style="color:orange"></i></button>',
                    '</div>'].join('');

                        td.append(html);
                        let dx = td.find('div._sttn_bf_edit_delete');
                        dx.show().siblings().hide();
                   }
                   mThis.setReadOnly_row(tr,true);
                   tr.data('editing',0);
                   tr.removeClass('editing');
                }
           
          } //end of this.changeRowState()

          this.setReadOnly_row= (tr,readOnly=true)=>{
                tr.find('.col-input').each(function(){
                  let el = $(this);
                  (el.is('input'))? el.prop('readOnly',readOnly):el.prop('disabled',readOnly);
                  if (!readOnly){
                    let dataMember = el.data('field');
                    if (dataMember =='sender_name') el.prop('readOnly',true);
                  }
                });
          }

          //getRowData() returns json data object to be passed to server's method saveBaseFee()
          this.getRowData = (tr)=>{
            let p = {};
            p.id = tr.data('id');
            p.sender_id = tr.data('senderid');
            tr.find('.col-input').each(function(){
              let el = $(this);
              let dataMember = el.data('field');
              p[dataMember] = el.val(); 
            });
            return p;
          } 

          //remove target tr row and returns array of remainin row data
          this.removeRow = (tr)=>{
            let rows = mThis.data_base_fees; // get current "data rows" in table tblBaseFees
            let index = tr.data('index'); //row_index
            rows.splice(index,1); //remove array element by index
            tr.remove();
            return rows; //return new set of rows
          }

          this.addRow_blank = ()=>{
            let row_data_blank = {'id':null,'sender_id':null,'sender_code':null,'sender_name':null,'base_fee':0,'start_date':null,'never_expires':null,'end_date':null}; 
            //let rows = mThis.table.data(); // get current "data rows"
            let rows = mThis.data_base_fees; //mThis.packages;
            //rows.unshift(row_data_blank); //Add element to beginning of array
            rows.splice(0,0,row_data_blank) //Add row_data_blank to be the first of the existing rows array
            mThis.populateBaseFeesTable(rows); 
            let tr = mThis.tblBaseFees.find('tbody>tr:first');
            mThis.changeRowState(tr,'edit');
          }

          // //display COD fee percent for all senders in gernal 0.05% of total transaction per package    
          // this.displayCODFee = ()=>{
          //    let p = {'sender_id':null};
          //    mThis.elCODFeeChargePercent.val(0);
          //    post_ajax([mThis.base_url,'/dms/getCODFeeCharge'].join(''),p,function(d){
          //       if (!d) d = 0;
          //       mThis.elCODFeeChargePercent.val(d);
          //    });
          // }

           //NOTE: if paramter @refresh = true then setfilterData() also acts as displayPrices()    
           this.setFilterData =(d ={},refresh = false)=>{
             mThis.elFilter_deliveryType.val(d.delivery_type);
             mThis.elFilter_zone.val(d.zone_code);
             mThis.elFilter_sender.val((d.sender_id>0)?d.sender_id:null);
             if (refresh) mThis.displayPrices();
           } 

           this.addRow_price_by_zone = (c, above = true)=>{
              let cur ='$';
              let kg_text = [c.start_kg,' to ',c.end_kg,' (kg)'].join('');
              if (c.start_kg ==-1 && c.end_kg > 0) 
                 kg_text = 'Below ' + c.end_kg + 'kg';
              else if (c.start_kg==0 && c.end_kg ==0) 
                 kg_text ='Any Weight';
              else if (c.start_kg <0) {
                kg_text ='Any Weight';
              }
              else if (c.end_kg ==-1 && c.start_kg >0) 
                   kg_text ='Above ' + c.start_kg + 'kg';
              else if (c.start_kg ==0 && c.end_kg ==0)
                   kg_text ='Any Weight';
              else if (c.end_kg <0) {
                    kg_text ='Any Weight';
                  }    
             let delivery_fee = [cur,c.delivery_fee?c.delivery_fee:0].join('');
             let price_per_kg = [cur,c.price_per_kg?c.price_per_kg:0].join('');

             if (c.price_option =='per_kg') {
                delivery_fee ='(Not used)';
             } else{
                price_per_kg ='(Not used)';
             }
              //let zone_codes = (c.zone_codes+'').replace('|',', ');
              let senders = ['<a onclick="PriceTabView.toggleSenderList(this)" href="javascript:;" class="btn btn-block btn-outline-success price_detail_toggler sender-toggler" data-id="',c.id,'"><i class="fa fa-angle-double-down"></i> Merchants</a>'].join('');
              let zone_codes = ['<a onclick="PriceTabView.toggleZoneList(this)" href="javascript:;" class="btn btn-block btn-outline-primary price_detail_toggler zone-toggler" data-id="',c.id,'"><i class="fa fa-angle-double-down"></i> Zones</a>'].join('');
             
              let html = ['<tr class="price_header" data-id="',c.id,'" data-dtype="',c.delivery_type,'" data-zonecode="',c.zone_code,'" data-senderid="',c.sender_id,'">',
              '<td class="senders">',senders,'</td>',
              '<td class="zone_codes">',zone_codes,'</td>',
              '<td class="delivery_type">',c.delivery_type,'</td>',
              '<td class="kg_range">',kg_text,'</td>',
              '<td class="base_fee">',[cur,c.base_fee?c.base_fee:0].join(''),'</td>',
              '<td class="delivery_fee">',delivery_fee,'</td>',
              '<td class="price_per_kg">',price_per_kg,'</td>',
              '<td class="price_option"><span class="po-',c.price_option,'">',(c.price_option=='per_kg')? 'Per KG':'Fixed','</span></td>',
              '<td class="col_action">',
                '<a href="#" class="_sttn_price_edit_price" data-senderid="',c.sender_id,'" data-id="',c.id,'"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
                '<a href="#" class="_sttn_price_delete_price" data-senderid="',c.sender_id,'" data-id="',c.id,'"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
              '</td>',            
              '</tr>'].join('');
              if (above) mThis.tblPrices_body.prepend(html);
              else mThis.tblPrices_body.append(html);
           } 
           
           //DisplayApplicableZones displayZones
           this.toggleZoneList = (me)=>{
            if(!me) return;
             let btn = $(me);
             let header_tr = btn.closest('tr.price_header');
             if (!header_tr) return;
             header_tr.find('a.price_detail_toggler').each(function(){
                 $(this).find('i').removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
             });
            
             let detail_tr = header_tr.next();
             if (detail_tr.hasClass('price_detail')) 
             {
                if (!detail_tr.hasClass('price-zones')) detail_tr.remove();
                 else{
                  detail_tr.remove();
                  btn.html('<i class="fa fa-angle-double-down"></i> Zones');       
                  return;
                 }
             }
             let p = {'price_id':header_tr.data('id')};
             let html_zones =null;
      
             vsapi.call([mThis.base_url,'/dms/getApplicableZones'].join(''),p).then(res=>{
              if (res.status_code===200){
                      let rows = StringSanitizer.sanitizeObject(res.data);
                      let i=0,c;
                      do{
                        c = rows[i];
                        if(!c) break;
                        html_zones = [html_zones,'<tr>',
                        '<td>',c.zone_code,'</td>',
                        '<td>',c.zone_name,'</td>',
                        '<td>',c.city,'</td>',
                        '</tr>'].join('');
                        i++;
                      }while(c);

                      if(!html_zones) 
                        html_zones = '<div class="">សូមកំណត់ថាតំលៃខាងលើនេះ អនុវត្តចំពោះតំបន់ណាខ្លះ</div>';
                      else {
                        html_zones = ['<table class="fixed-body-table" style="width:50%"><tbody>',html_zones,'</tbody></table>'].join('');
                      }
                           let html= ['<tr class="price_detail price-zones"><td colspan="8"><div class="price_detail_panel">',
                            '<span class="price-inner-title">Applicable Zones &nbsp;</span>',
                            //'<div class="div-line" style="border-color:#B3E0BF;width:50%"></div>',
                            html_zones,
                            ,'</div></td></tr>'].join('');

                            header_tr.after(html);
                            btn.html('<i class="fa fa-angle-double-up"></i> Zones');   
                    }

             });
       
          }

           //displaySenderList(), displayApplicableSender
           this.toggleSenderList = (me)=>{
             if(!me) return;
              let btn = $(me);
              let header_tr = btn.closest('tr.price_header');
              if (!header_tr) return;
              let detail_tr = header_tr.next();
              if (detail_tr.hasClass('price_detail')) 
              {
                  if (!detail_tr.hasClass('price-senders')) detail_tr.remove();
                  else{
                    detail_tr.remove();
                    btn.html('<i class="fa fa-angle-double-down"></i> Zones');       
                    return;
                  }
              }

              let p = {'price_id':header_tr.data('id')};
              let htm_senders =null;
       
              vsapi.call([mThis.base_url,'/dms/getApplicableSenders'].join(''),p).then(res=>{
                 if (res.status_code===200){
                   let rows = StringSanitizer.sanitizeObject(res.data);
                   let i=0,c;
                   do{
                      c = rows[i];
                      if(!c) break;
                      htm_senders = [htm_senders,'<tr>',
                      '<td>',c.code,'</td>',
                      '<td>',c.name,'</td>',
                      '<td>',c.phone_number,'</td>',
                      '</tr>'].join('');
                      i++;
                   }while(c);

                   if(!htm_senders) 
                      htm_senders = '<div class="">សូមកំណត់ថាតំលៃខាងលើនេះ អនុវត្តចំពោះអ្នកលក់មួយណា</div>';
                   else {
                      htm_senders = ['<table class="fixed-body-table" style="width:50%"><tbody>',htm_senders,'</tbody></table>'].join('');
                   }
                   let html= ['<tr class="price_detail price-senders"><td colspan="8"><div class="price_detail_panel">',
                   '<span class="price-inner-title">Applicable Merchants &nbsp;</span>',
                   //'<div class="div-line" style="border-color:#B3E0BF;width:50%"></div>',
                     htm_senders,
                   ,'</div></td></tr>'].join('');

                   header_tr.after(html);
                   btn.html('<i class="fa fa-angle-double-up"></i> Merchants');    
                 }
              });
 
           }

           this.addRow_cod = (c, above = true)=>{
            let cur ='$';
            let html = ['<tr data-id="',c.id,'" data-dtype="',c.delivery_type,'" data-zonecode="',c.zone_code,'" data-senderid="',c.sender_id,'">',
            '<td class="sender_name">',c.sender_name,'</td>',
            '<td class="delivery_type">',c.delivery_type,'</td>',
            '<td class="cod_fee_percent">',[c.cod_fee_percent?c.cod_fee_percent:0,'%'].join(''),'</td>',
            '<td class="remarks">',c.remarks,'</td>',
            '<td class="col_action">',
              //'<a href="#" class="_sttn_price_cod_edit" data-senderid="',c.sender_id,'" data-id="',c.id,'"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
              '<a href="#" class="_sttn_price_cod_delete" data-senderid="',c.sender_id,'" data-id="',c.id,'"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
            '</td>',            
            '</tr>'].join('');
            if (above) mThis.tblCODs_body.prepend(html);
            else mThis.tblCODs_body.append(html);
         }

          //  this.swapRows = (from_tr, to_tr, cssClass,delayTime=2500)=>{
          //     let from_html = from_tr.html();
          //     let to_html = to_tr.html();
          //     to_tr.html(from_html);
          //     from_tr.html(to_html);
          //     if(cssClass) to_tr.addClass(cssClass).delayTime(delayTime).removeClass(cssClass);
          //  } 

         //*** begin::displayBaseFees table (Fixed Price Promotions)
          this.tblBaseFees_cols = [
                        {
                          className:"col_action",
                          //width:'65px',
                          data:function(data,a,b) { 
                            return ['<div class="_sttn_bf_edit_delete">',
                            '<button type="button" class="_sttn_bf_edit btn btn-sm btn-outline-primary" data-id="',data.id,'" data-senderid="',data.sender_id,'"><i class="fa fa-edit" style="color:green"></i></button>&nbsp;',
                            '<button type="button" class="_sttn_bf_delete btn btn-sm btn-outline-danger" data-id="',data.id,'"><i class="fa fa-times" style="color:orange"></i></button>',
                            '</div>'].join('');
                          },
                          title:''
                      },
                  {
                      className:"sender_code",
                      data:function(data,a,b) {
                          let d = {"inputType":"input","data":data,"columnName":"sender_code","readOnly":true,'placeholder':'Merchant ID'};
                          return EditableTable.makeTableCellEditor(d);
                      },
                      title:'Merchant ID'
                  },
                  {
                      className:"sender_name",
                      data:function(data,a,b) {
                          let d = {"inputType":"input","data":data,"columnName":"sender_name","readOnly":true};
                          return EditableTable.makeTableCellEditor(d);
                      },
                      title:'Merchant Name'
                  }, 
                  {
                    className:"base_fee",
                    data:function(data,a,b) {
                        let d = {"inputType":"number","data":data,"columnName":"base_fee","readOnly":true,'placeholder':'Base Fee'};
                        return EditableTable.makeTableCellEditor(d);
                    },
                    title:'Base Fee'
                }, 
                {
                  className:"start_date",
                  data:function(data,a,b) {
                      let d = {"inputType":"date","data":data,"columnName":"start_date","readOnly":true,'placeholder':'Start Date'};
                      return EditableTable.makeTableCellEditor(d);
                  },
                  title:'Start Date'
              },
              {
                className:"never_expires",
                data:function(data,a,b) {
                    let items = [{"value":"1","text":"Never Expires"},{"value":"0","text":"Will Expire"}];
                    let d = {"inputType":"select","data":data,"columnName":"never_expires","readOnly":true,"combo_items":items,"valueMember":"value","textMember":"text"};
                    return EditableTable.makeTableCellEditor(d);
                },
                title:'Expiration'
              },
              {
                className:"end_date",
                data:function(data,a,b) {
                    let d = {"inputType":"date","data":data,"columnName":"end_date","readOnly":true,'placeholder':'End Date'};
                    return EditableTable.makeTableCellEditor(d);
                },
                title:'End Date'
            }
          ];

          this.displayBaseFees = (onFinish=null)=>{
            vsapi.call(`${mThis.base_url}/dms/getSenderBaseFees`,null).then(res => {
              if (res.status_code === 200)
                mThis.populateBaseFeesTable(res.data,onFinish);
            });  
          }

          //populateBaseFeesTable() takes rows returned from server method and poulate in html table tblBaseFees (using dataTable)
          this.populateBaseFeesTable = function(data,onFinish=null)
          { 
              if (!data || !data[0]) { 
                  //Make one empty raw for data entry
                  data = [{'sender_code':null,'sender_name':null,'base_fee':null,'start_date':null,'never_expires':1,'end_date':null}];
                  //return;
              }
             
                  if (mThis.table_baseFee){
                       
                          mThis.tblBaseFees.DataTable().clear().destroy();
                          //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                          mThis.tblBaseFees.empty();
                          mThis.table_baseFee = null;
                      
                  }
  
                  if (!mThis.table_baseFee)
                  mThis.table_baseFee = mThis.tblBaseFees.DataTable({
                      searching:false,
                      destroy:true,
                      paging:true,
                      pageLength:7,
                      //dom: 'Bfrtip',
                      //retrieve: true,
                      'ordering':false,
                      //scrollY:"500px",
                      //scrollX:'1500px',
                      scrollCollapse: true,
                      //pagingType:'numbers',
                      //info:true,
                      bLengthChange:false,
                      saveState:true,
                      // columnDefs: [
                      //     { width: 65, targets: 0 }
                      // ],
                      //fixedColumns: true,
       
                       // rowReorder: {
                          // dataSrc: 'sequence'
                        // },
                         'processing': false,
                        //  'language': {
                        //       'loadingRecords': '&nbsp;',
                        //       'processing': 'Loading...',
                        //       "emptyTable": "No base fees found"
                        //   },
                          data:data,
                          columns:mThis.tblBaseFees_cols, 
                      "createdRow": function(row, data, dataIndex)
                            {
                                let tr = $(row);
                                tr.data('id',data.id);  
                                tr.data('senderid',data.sender_id);
                            }							
                  });

                  mThis.data_base_fees = data; //remember baseFee records for manipulating Add Row or Delete Row
                  if (typeof onFinish =='function') onFinish();
                                  
          };
        //*** end::displayBaseFees table (Fixed Price Promotions) 
       
         this.deleteBaseFee = (tr)=>{
           let id =  tr.data('id');
           if (!id) 
                mThis.data_base_fees = mThis.removeRow(tr); 
           else{
              let p = {'id':id};
              cv_interact.confirm('Delete this base fee?',{title:'Delete Base Fee',context:'delete'},function(e){
                if (e){
                   let p = {'id':id};
                   vsapi.call(`${mThis.base_url}/dms/deleteBaseFee`,p).then(res => {
                     if(res.status_code === 200) {
                        mThis.displayBaseFees();
                     } else cv_interact.error(error_message);
                   });
                }
              });
           } 
         
         }
           //To avoid ciricular event firing problem => paramter @def_filter must be NULL when user Choose filter data directly in select box such as "elFiltre_delivery_type, elFilter_zone, elFilter_sender"
           this.displayPrices = function(def_filter, animate = false) {
            let div = mThis.tblPrices.parent();
            let p = {};
            if (animate) div.removeClass('animate-slide-left');
                   if (def_filter){
                      let f = def_filter;
                      mThis.elFilter_deliverytype.val(f.delivery_type);
                      mThis.elFilter_zone.val(f.zone_code?f.zone_code:'all');
                      mThis.elFilter_sender.val(f.sender_id);
                      p = f;
                       
                   } else p = {'delivery_type':mThis.elFilter_deliverytype.val(),'zone_code':mThis.elFilter_zone.val(),'sender_id':mThis.elFilter_sender.val()}; 
                  
                   mThis.tblPrices_body.empty();  
                   vsapi.call(`${mThis.base_url}/dms/getPriceList`,p).then(res => {
                       let rows = StringSanitizer.sanitizeObject(res.data);
                       if(rows){
                          rows = StringSanitizer.sanitizeObject(rows);
                          let i=0, c;
                          do{
                              c = rows[i];
                              if(!c) break;
                                  mThis.addRow_price_by_zone(c);
                              i++;
                          }while(c);
                          if (animate) div.addClass('animate-slide-left');
                       }       
                   });

                   mThis.prev_filter_data = p;
           }       
           
           this.displayCODFees = function( animate = false) {
            let div = mThis.tblPrices.parent();
            let p = {'sender_id':mThis.elFilterSender_cod.val(),'search_value':null, 'delivery_type':mThis.elFilterDeliveryType_cod.val()};
            if (animate) div.removeClass('animate-slide-left');
                   mThis.tblCODs_body.empty();
                   
                   vsapi.call([mThis.base_url,'/dms/getCODFees'].join(''),p).then(res=>{
                     
                        if(res.status_code===200){
                          let rows = StringSanitizer.sanitizeObject(res.data);
                          let i=0, c;
                          do{
                              c = rows[i];
                              if(!c) break;
                                  mThis.addRow_cod(c); // add row (tr) to tblCODs
                              i++;
                          }while(c);
                          if (animate) div.addClass('animate-slide-left');
                       }       
                   });

                   mThis.prev_filter_cod_data = p;
           }          
    //end::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
  }
  //end::PriceTabview
 
 //begin::PriceLinePanel
   let PriceLinePanel = new function(){
    this.self = DeliveryPriceComponent.self.find('#sttn_price_line_panel');
    let mThis = this;
    this.elError = this.self.find('#_sttn_price_error');
    this.elFilter_sender = this.self.find('#_sttn_newprice_filter_sender');
    this.elFilter_zone = this.self.find('#_sttn_newprice_filter_zone');
    this.elFilter_deliveryType = this.self.find('#_sttn_newprice_filter_delivery_type');
     
    this.elSender = this.self.find('#_sttn_newprice_filter_sender');
    this.elZone = this.self.find('#_sttn_newprice_filter_zone');
    this.elDeliveryType = this.self.find('#_sttn_newprice_filter_delivery_type');

    this.elDeliveryFee = this.self.find('#_sttn_newprice_delivery_fee');
    this.elPricePerKg = this.self.find('#_sttn_newprice_price_per_kg');
    this.elPriceOption = this.self.find('#_sttn_newprice_price_option');
    this.price_per_kg_field = this.self.find('#_sttn_price_per_kg_field');
    this.fixed_price_field = this.self.find('#_sttn_fixed_price_field');

    this.lnkBack = this.self.find('#_sttn_btnBack');
    this.btnBack1 = this.self.find('#_sttn_btnBack1');
    this.btnSavePrice = this.self.find('#_sttn_btnSavePrice');
    this.title_prop = "Price";
    // let test = (e,item)=>{
    //   alert(JSON.stringify(mThis.zone_list.getSelections()));
    // }
    this.sender_list = null; // $('#_sttn_newprice_sender_list').vs_multipleSelect(); //Wait for vs_muitipleSelect.js to fulluy loaded
    this.zone_list = null; // $('#_sttn_newprice_zone_list').vs_multipleSelect();
    this.fields = []; //collection of data fields
  
    //begin:: gather fields inforamtion
       mThis.self.find('.data-input').each(function(){
         let e = $(this);
         let type = e.is('select')?'select':'input';
         mThis.fields.push({
           'dataMember':e.data('field'),
           'element':e,
           'inputType':type
         });
       });
    //end::gathering field information
    
    this.lnkBack.on('click',function(e){
       e.preventDefault();
       PriceTabView.show('prices');
    });

    this.btnBack1.on('click',function(e){
      e.preventDefault();
      mThis.lnkBack.trigger('click');
    });

    this.elPriceOption.on('change',function(){
       let op = $(this).val();
       if (op =='per_kg') 
          {
            mThis.price_per_kg_field.show();
            mThis.fixed_price_field.hide(); 
          }else{
            mThis.price_per_kg_field.hide();
            mThis.fixed_price_field.show();
          } 
    });

    this.btnSavePrice.on('click',function(e){
      e.preventDefault();
      let p = mThis.getData();
      if (!p) return;
      vsapi.call(`${mThis.base_url}/dms/savePriceLine`,p).then(res => {
         if (res.status_code === 200) {
          let d = [];
            d.data =StringSanitizer.sanitizeObject(d.data,'email');
            //This line is to prevent unexpected problem when method savePriceLine() does not return d.sender_id correctly
            if (!d.sender_id) d.sender_id = mThis.elSender.val(); // OR   d.sender_id  = mThis.elFilter_sender.val(); // mThis.elFilter_sender is the same as mThis.elSender
            if (typeof mThis.onClose =='function') mThis.onClose(d.data); 
            mThis.self.hide();
           
         }else mThis.elError.text(d.error_message); 
      });
    });
     
    //manageChecks() is to ensure that if user check "All" then other items are disabled and unchecked, otherwise enable all items
     this.manageChecks = (element, checkbox)=>{
        let val = checkbox.data('value');
        if ((val+'').toLowerCase() =='all') {
          if (checkbox.is(':checked')){
            if ((val+'').toLowerCase() =='all') {
              element.checkAll(false,[val]);
              element.disableOptions(true,[val]);
            }   
          } else element.disableOptions(false);
        } 
     } 
     //PriceLinePanel => load sender list, zone list, delivery_type
      this.loadFormOptions = (def,onFinish)=>{
        if(!def) def = {};
        if (!def.sender_ids) def.sender_ids = [];
        if(!def.zone_codes) def.zone_codes =[];
        
        //init multipleSelectBox of ListBox with checkbox items
        if (!mThis.sender_list || !mThis.zone_list) {
          mThis.sender_list =  mThis.self.find('#_sttn_newprice_sender_list').vs_multipleSelect({'onCheckChange':function(chk){
            mThis.manageChecks(mThis.sender_list, chk);
          }}); //init here because wait for vs_muitipleSelect.js to fulluy loaded

          mThis.zone_list = mThis.self.find('#_sttn_newprice_zone_list').vs_multipleSelect({'onCheckChange':function(chk){
            mThis.manageChecks(mThis.zone_list, chk);
          }});
        }

        // if (typeof onFinish =='function') onFinish();
        // if (mThis.form_data) {
        //     //mThis.zone_list.vs_multipleSelect('setData',{'data':mThis.form_data.zones,'valueMember':'zone_code','textMember':'zone_name'});
        //     mThis.sender_list.setData(mThis.form_data.senders, 'id','sender_name',['10','9','5']);
        //     mThis.zone_list.setData(mThis.form_data.zones, 'zone_code','zone_name',def.zone_codes);
        //     //VSUtil.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',false,null,def.sender_id);
        //     //VSUtil.setComboItems(mThis.elFilter_zone,mThis.form_data.zones,'zone_code','zone_name',false,null,def.zone_code);
        //     if (typeof onFinish =='function') onFinish();
        //     return;
        // }
  
         vsapi.call([mThis.base_url,'/dms/getFormOptions_priceline'].join(''),null).then(res=>{
           if(res.status_code ===200){
                let data = res.data;
                data.zones = StringSanitizer.sanitizeObject(data.zones);
                data.senders = StringSanitizer.sanitizeObject(data.senders);
                let text1 = LocaleManager.trans('unspecified','zone');
                data.zones.unshift({'zone_code':'all','zone_name':`(${text1})`});
                data.senders.unshift({'id':'all','sender_name':`(${text1})`});

                 //mThis.zone_list.vs_multipleSelect('setData',{'data':data.zones,'valueMember':'zone_code','textMember':'zone_name'});
                 let i=0,c;
                 do{
                   c= data.zones[i];
                   if(!c) break;
                     c.zone_name = ['<div style="width:100%" class="form-inline"><div style="width:70px">',c.zone_code,'</div> <div>',c.zone_name,'</div></div>'].join('');
                    i++;
                 }while(c);

                 mThis.zone_list.setData(data.zones, 'zone_code','zone_name',def.zone_codes);
                 mThis.sender_list.setData(data.senders, 'id','sender_name',['10','9','5']);
                //VSUtil.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,null,def.sender_id);
                //VSUtil.setComboItems(mThis.elFilter_zone,data.zones,'zone_code','zone_name',false,null,def.zone_code);
                mThis.form_data = data;
                if (typeof onFinish =='function') onFinish();
           }
         });
      }
 
      this.displayPriceLine = (sender_id,price_id,onFinish)=>{
        /** 
         * NOTE: paramter @sender_id is VERY IMPORTANT IMPORTANT to determine which 
        table is to be queried => "price_list" or "sender_price_list" **/
        let p = {'sender_id':sender_id,'id':price_id};
        vsapi.call(`${mThis.base_url}/dms/getPriceLineData`,p).then(res => {
           if (res.status_code === 200) {
              let d = StringSanitizer.sanitizeObject(res.data,null,['zone_codes','sender_ids']);
              mThis.setData(d);
              if (typeof onFinish ==='function') onFinish(d);
           }else {
              //This case: error, price_id > 0 but there is no price_data found. Usually because @sender_id is not correct, and confusing between tables "price_list" and "sender_price_list" 
              if (typeof onFinish ==='function') onFinish(d);
           }
        });
      }

    //Set Data displaying on PriceLinePanel view for editing  
    this.setData = (d)=>{   
      if (!d){
            let i=0,c;
            do{
              c = mThis.fields[i];
              if(!c) break;
               c.element.val(null);
              i++;
            }while(c);
            //set default price option
            mThis.elDeliveryType.val(mThis.self.find('#_sttn_price_filter_dtype').val());  
            //mThis.elSender.val($('#_sttn_price_filter_sender').val());
            //mThis.elZone.val($('#_sttn_price_filter_zone').val());
            mThis.elPriceOption.val('fixed').trigger('change');
          return;
      }
    
      let i=0,c;
      do{
        c = mThis.fields[i];
        if(!c) break;
         c.element.val(d[c.dataMember]);
        i++;
      }while(c);

      let zone_codes = [];
      let sender_ids = [];
     
      if (d.zone_codes) zone_codes = d.zone_codes.split('|');
      if(d.sender_ids) sender_ids = d.sender_ids.split('|');
      d.zone_codes = zone_codes; //convert to array
      d.sender_ids = sender_ids; //become array
      mThis.sender_list.select(sender_ids);
      mThis.zone_list.select(zone_codes);
      mThis.elPriceOption.trigger('change'); 
    }

    this.formatInput = (d)=>{
      let i=0,c;
      let values = null;
      do{
        c = d[i];
        if(!c) break;
          let val = c.value?c.value:c.id;
          values = [values,values?'|':null,val].join('');
        i++;
      }while(c);
      return values;
    }

    //get data in PriceLinePanel view
    this.getData = ()=>{
       let p = {};
       p.id = mThis.price_id;
       let i=0, c;
       do{
         c = mThis.fields[i];
         if(!c)break;
           p[c.dataMember] = c.element.val();
         i++;
       }while(c);
       
       p.zone_codes = mThis.formatInput(mThis.zone_list.getSelections());
       p.sender_ids = mThis.formatInput(mThis.sender_list.getSelections());
       if (!p.delivery_type) {
         mThis.elError.html('Delivery Type is not correct');
         return null;
       }
       if (!p.zone_codes) {
         p.zone_codes ='all';
        // mThis.elError.html('Please select destination zones');
        // return null;
       }
       if (!p.sender_ids) {
        p.sender_ids ='all';
       // mThis.elError.html('Please select destination zones');
       // return null;
      }

      if (!p.price_option) {
        mThis.elError.html('Price option is not correct');
        return null;
      }
       return p; 
    }
 
      //show PriceLinePanel view
      this.show = function(option, onClose) {
        mThis.elError.html(null);
    
        if(!option) option = {};
        mThis.form_data = option.form_data;
        mThis.price_id = option.price_id;
        mThis.sender_id = option.sender_id; // sender_id is VERY IMPORTANT for updating existing Price Line because it tells which table to update "price_list" or "sender_perice_list"
        mThis.onClose = onClose;
        //Set screen title
        mThis.elScreenTitle.text(option.title); 
        
        let onFinish = ()=>{  
            mThis.elSender.val(mThis.sender_id).prop('disabled',true); //always disable elSender on PriceLinePanel (Not allowing user to choose, so that there is no confusion in Saving or Creating price_line) 
           //price_id > 0 => Edit or Modify Existing price_line
          
           if (mThis.price_id > 0) {
                mThis.displayPriceLine(mThis.sender_id,mThis.price_id,function(d){ 
                mThis.self.show().siblings().hide();
              });
           } else {
                //Clear form and Create New price line
                mThis.setData(null);
                mThis.elPriceOption.trigger('change'); 
                mThis.self.show().siblings().hide();
           }          
        }
        let def = {'zone_codes':[],'sender_ids':[]};
        mThis.loadFormOptions(def,onFinish);

      }
       
   }
 //end::PriceLinePanel
 
 //begin::CODDialog
   const CODDialog = new function(){
     let mThis =this;
     this.self = main_view.appContent.children('#_sttn_cod_dlgcod');
     this.base_url =main_view.base_url;
     this.elTitle =this.self.find('#_sttn_cod_dlgcod_title');
     this.elTitle = this.self.find('.modal-title');
     mThis.sender_id = null;
     mThis.btnFindSender = this.self.find('#_sttn_cod_lnkFindSender');
     //this.id = null;
     //this.onClose;
     this.elSenderName = this.self.find('#_sttn_cod_sender_name');
     this.elCODFeePercent = this.self.find('#_sttn_cod_fee_percent');
     this.elRemarks = this.self.find('#_sttn_cod_remarks');
     this.elError = this.self.find('#_sttn_cod_error');
     this.btnOK = this.self.find('#_sttn_cod_btnOK');

     this.btnOK.on('click',function(e){
        let p = mThis.getData();
        if(!p) return;
        
        vsapi.call(`${mThis.base_url}/dms/saveCODFeeBySender`,p).then(res => {
          if(res.status_code === 200) {
            if (typeof mThis.onClose =='function')  mThis.onClose(p);
            mThis.self.modal('hide');
          }else mThis.elError.text(res.error_message);
        });
    });

     this.btnFindSender.on('click',(e)=>{
       e.preventDefault();
          let option = {'title':'Find Merchant','role':'sender','singleSelect':true,'previousDialog':mThis.self};
          FindPersonDialog.show(option,(ps)=>{
            if(ps[0]){
                let d = ps[0];
                mThis.elSenderName.val(d.name);
                mThis.sender_id = d.id;
            }
          });
     });

     this.show = (option,onClose)=>{
       mThis.id = null;
        mThis.setData(null);

        if(option) {
          mThis.elTitle.html(option.title);
          mThis.id = option.id;
          mThis.elSenderName.val(option.sender_name).prop('readOnly',true);
          mThis.sender_id = option.sender_id;
        }
        mThis.elError.html(null);
        mThis.onClose = onClose;

        // if (mThis.id >0) {
             
        // }
      
        mThis.self.modal({
          backdrop:'static'
        }); 
     }

     this.setData = (d)=>{
          mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            if (!d) 
              el.val(null);
            else  
              el.val(d[dataMember]);
        });
     }
     
     this.getData = ()=>{
        let p = {};
        p.id = mThis.id;
        p.sender_id = mThis.sender_id;
        mThis.self.find('.data-input').each(function(){
           let el = $(this);
           let dataMember = el.data('field');
           p[dataMember] = el.val(); 
        });
        if (!p.sender_id || p.sender_id ==0) {
          mThis.elError.text('Sender identity is not valid');
          return null;
        }
        if (!p.delivery_type ) {
          mThis.elError.text('Delivery Type is not valid');
          return null;
        }
        return p;
    }

   }
 //end::CODDialog
 
$(document).ready(function(){
   DeliveryPriceComponent.init();
});
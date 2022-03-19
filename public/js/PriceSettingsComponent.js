'use strict'
var PriceSettingsComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_sttn_priceSettingsComponent');

    this.elSearch_pl = $('#ps_pl_search_merchant');

    this.elFilter_price_list = $('#ps-filter_price_list');
    this.elZones = $('#ps-filter_zones');
    this.tblPrices = $('#ps-tbl-prices');
 
    this.btnNewPriceZones = $('#ps-btnNewPriceZones');
    this.lnkAddPriceList = $('#ps-lnk_add_price_list');
    this.lnkDeletePriceList = $('#ps-lnk_delete_price_list');
    this.lnkViewMerchantList = $('#ps-lnk_merchant_list');
      
    this.init = function(){

      mThis.base_url = $('#__base_url').val();  
      mThis.title ='Price Settings';

      mThis.lnkViewMerchantList.on('click',(e)=>{
        e.preventDefault();
          let id = mThis.elFilter_price_list.val();
          let price_list_name = mThis.elFilter_price_list.find('option:selected').text();
          let title = ['Merchants who use price list "',price_list_name,'"'].join('');
          let op = {'title':title,'price_list_id':id,'price_list_name':price_list_name};
          MerchantListDialog.show(op);
      });

      mThis.elSearch_pl.on('keyup',function(e){
         e.preventDefault();
         if(e.keyCode ==13){
            let p = {'search_value':mThis.elSearch_pl.val()};
            post_ajax([mThis.base_url,'/api/getPriceListIdBySearchValue'].join(''),p,function(d){
              if(d.status =='OK'){
                  d.price_list_id = StringSanitizer.sanitizeOut(d.price_list_id);
                  mThis.elFilter_price_list.val(d.price_list_id).trigger('change');
              }else cv_interact.alert(d.error_message); 
            });
         }
      });

      mThis.lnkAddPriceList.on('click',function(e){
           e.preventDefault();
           let op = {'title':'New Price List'};
           PriceListDialog.show(op,(new_id)=>{
              if(new_id){
                  mThis.loadFilterData(new_id);
              }
           });
      });

      mThis.lnkDeletePriceList.on('click',function(e){
        e.preventDefault();
        let id = mThis.elFilter_price_list.val();
        let p = {'price_list_id':id};
        cv_interact.confirm('Delete this price list?','Delete Price List',function(e){
            if(e){
              post_ajax([mThis.base_url,'/api/deletePriceList'].join(''),p,function(err){
                if(!err || err ==''){
                  mThis.loadFilterData(null); 
                  mThis.elFilter_price_list.val(null);
                  mThis.displayPrices();
                } else cv_interact.alert(err,'','error');
              });
            }
        },'Delete','Cancel','delete');
           
     });

     if(!mThis.elFilter_price_list.val()) mThis.lnkViewMerchantList.hide();
      mThis.elFilter_price_list.on('change',function(){
          if(!$(this).val()) mThis.lnkViewMerchantList.hide(); else mThis.lnkViewMerchantList.show();
          mThis.displayPrices();
      });

      mThis.tblPrices.on('click','.ps-btn_delete_zones',function(e){
        e.preventDefault();
        let zone_codes = $(this).data('zones');
        let p = {'zone_codes':zone_codes};
        cv_interact.confirm('Delete this pricing zones?','Delete Pricing Zones',function(e){
           if(e){
                post_ajax([mThis.base_url,'/api/deletePriceZones'].join(''),p,function(err){
                    if(!err || err =='') {
                        mThis.displayPrices();
                    }else cv_interact.alert(err,'','error');
                });
           }
        },'Delete','Cancel','delete');

    
      });
      
      mThis.tblPrices.on('click','a.ps-btn-edit-prices',function(e){
         e.preventDefault();
         
         let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
         mThis.setEditMode($(this),div);
      });
 
      mThis.tblPrices.on('click','a.ps-btn-save-prices',function(e){
        e.preventDefault();
        let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
        mThis.savePrices($(this),div); 
     });

      mThis.btnNewPriceZones.on('click',()=>{
        if(!mThis.elFilter_price_list.val()) {
          cv_interact.alert('Please select a price list');
          return;
        }

        let op = {'title':'New Zones','price_list_id':mThis.elFilter_price_list.val()};
        PriceLineDialog.show(op,(p)=>{ 
               
                post_ajax([mThis.base_url,'/api/savePriceLineZones'].join(''),p,function(result){
                    if(result.status =='OK'){
                        mThis.displayPrices();
                    }else cv_interact.alert(result.error_message,'','error');
                });
        });

      });

    } //end::PriceSettingsCompoent.init()

    this.loadFilterData = (def_list_id)=>{
      post_ajax([mThis.base_url,'/api/getComboItems_price_list'].join(''),null,function(items){
         if(items){  
            let b = def_list_id;
            if(!b) b = mThis.elFilter_price_list.val();
            CommonLib.setComboItems(mThis.elFilter_price_list,items,'id','name',false,null,b);
            mThis.displayPrices();
         }
      });
    };

     /** savePrices() save edited prices (i.e: base_fee, additional, price_option)  and then make div.ps-fast or div.ps-normal container to be in View mode **/
     this.savePrices = (that, div)=>{
      
           let btnEdit =  div.find('a.ps-btn-edit-prices');
           let has_error = false;
           let p = {};
           div.find('.dd-field').each(function(){
              let field = $(this);
              let span = field.find('.dd-value');
              let input = field.find('.dd-input');
              input.removeClass('has-error');

              let f = field.data('field');
              let val = (input.val()+'').toLowerCase().trim();

              if(f=='base_fee'){
                 if (!val || val<0) {
                  input.addClass('has-error');
                  has_error = true;
                  return false;
                 }
              } else if(f=='delivery_fee') {
                if (!val || val<0) {
                  input.addClass('has-error');
                  has_error = true;
                  return false;
                 }
              } else if (f =='price_option') {
                if (val !='fixed' && val !='per_kg' && val !='per kg') {
                  input.addClass('has-error');
                  has_error = true;
                  return false;
                 }
              }
              p[f] = input.val();
              if(!has_error){
                div.find('.dd-value').show();
                span.text(input.val());
                input.remove();
              }
           });

           if(!has_error){
              let price_list_id = mThis.elFilter_price_list.val();
              //let x =  div.closest('div.ps-zones');
              let zone_codes = that.data('zones'); 
              //need to modify html
              let section = that.data('section'); /** @section refers to {'above','below'}. "above" means Above 3 kg (for example) **/
              //need to modify html
              let delivery_type = that.data('dtype');

              p.id=that.data('id');
              p.price_list_id = price_list_id;
              p.zone_codes = zone_codes;
              p.section = section;
              p.delivery_type = delivery_type;
              
              post_ajax([mThis.base_url,'/api/savePriceLineInfo'].join(''),p,function(result){
                 if(result.status =='OK'){
                     that.data('id',result.id);
                 } else cv_interact.alert(result.error_message,'','error');
              });

              //hide btnSave
              that.hide(); 

              //Show back btnEdit
              btnEdit.show();
           }
         

     }

     /** set each block of div.ps-fast or div.ps-normal to be in Edit mode **/
     //div is div.ps-fast or div.ps-normal
     this.setEditMode = (me,div)=>{
          let btnSave =  div.find('a.ps-btn-save-prices');
          //Hide btnEdit
          me.hide();
          
          //remove existing inputs if the target div is already in Edit mode
          div.find('.dd-input').remove();

          //Show btnSave
          btnSave.show();
          div.find('.dd-value').each(function(){
              let el = $(this);
              el.after($('<input class="dd-input" style="outline:none;margin-top:3px;width:50px"/>').val(el.text()));
              el.hide();
          });

    }


    this.show = function(option) {
      mThis.elScreenTitle.html(option.title);
      mThis.loadFilterData(); 
      mThis.self.show().siblings().hide();
    }

    this.hide = function(){
      mThis.self.hide();
    }

    //return html for displaying Prices (base_fee,additional, proce_option) by the given zones
    //d = {'zone_codes','fast_items','normal_items'}
    //@section ={'above','below'}. "below" means for example "Below 5 kg"
    this.price_by_zones = (d,section)=>{

      //d.normal_items = {'base_fee':1,'delivery_fee':0,'price_option':'Fixed'}
      let n = d.normal_items?d.normal_items:{};
      let f = d.fast_items?d.fast_items:{};
      let zones = d.zone_codes;
      if(!zones) zones ='';

      //zones = zones.slice(0,50)
      let i= 0,c;
      let ex_html =null;
      let m_zones =null;
      let arrs = [];
      zones = zones.trim();
      if(zones.slice(0,1) =='|' || zones.slice(0,1) ==',') zones = zones.trim().slice(1);
      if(zones.indexOf('|')>0) arrs = zones.split('|',10);
      else arrs = zones.split(',',10);
      
      do{
        c = arrs[i];
        if(!c) break;
            if(i==6){
              if(arrs[7]) ex_html ='... <a data-id="" href="javascript:void(0)" class="btn_view_zones"><i class="fa fa-list"></i></a>'; 
              break;
            } 
            m_zones = [m_zones,(m_zones?', ':''),c].join('');
        i++;
      }while(c);
 
      //zones = zones.split('|').join(', ');
    
      //set default
      if(!n.base_fee) n.base_fee =0;
      if(!n.delivery_fee) n.delivery_fee=0;
      if(!n.price_option) n.price_option='Fixed';

      if(!f.base_fee) f.base_fee =0;
      if(!f.delivery_fee) f.delivery_fee=0;
      if(!f.price_option)f.price_option='Fixed';
      
      /** delivery types must be exactly {'Fast','Normal'} for the price list display to be displayed correctly **/
      let _dtype_fast ='Fast';
      let _dtype_normal = 'Normal';

      //NOTE @zones = 11|15|12  or A1|A10|A15|A33  (List of zone_codes separated by | ). This @zones value must be exactly the same as the one in price_list.zone_codes for Updating or Inserting purpose
      let html = ['<td>',
      '<div style="width:100%;display:flex;flex-direction:column;align-items:justify">',
            '<div class="ps-zones">',m_zones,ex_html,
            '&nbsp;<a href="javascript:void(0)" data-zones="',d.zone_codes,'" class="ps-btn_delete_zones"><i class="fa fa-trash" style="color:red"></i></a>',
            '</div>',
            '<div style="display:flex;flex-direction:row">',
                  '<div data-value="',_dtype_fast,'" class="ps-dtype ps-fast" style="width:50%">',
                      '<span class="ps-dtype-fast-text">',
                          'Fast',
                          '&nbsp;<a href="javascript:void(0)" data-id="',f.id,'" data-zones="',d.zone_codes,'" data-section="',section,'" data-dtype="',_dtype_fast,'" class="ps-btn-edit-prices"><i class="fa fa-edit"></i></a>',
                          '&nbsp;<a style="display:none" href="javascript:void(0)" data-id="',f.id,'" data-zones="',d.zone_codes,'" data-section="',section,'" data-dtype="',_dtype_fast,'" class="ps-btn-save-prices"><i class="fa fa-save"></i></a>',
                      '</span>',
                      '<div class="dd-field-container">',
                        '<div class="dd-field" data-field="base_fee">',
                            '<span class="dd-label">Base fee</span>',
                            '<span class="dd-value">',f.base_fee,'</span>',
                        '</div>',
                        '<div class="dd-field" data-field="delivery_fee">',
                            '<span class="dd-label">Additional fee</span>',
                            '<span class="dd-value">',f.delivery_fee,'</span>',
                        '</div>',
                        '<div class="dd-field" data-field="price_option">',
                            '<span class="dd-label">Price option</span>',
                            '<span class="dd-value">',f.price_option,'</span>',
                        '</div>',
                      '</div>',
                  '</div>',
                  /** following is the Normal Delviery section under the zone_codes **/
                  '<div data-value="',_dtype_normal,'" class="ps-dtype ps-normal" style="width:50%">',
                    '<span class="ps-dtype-normal-text">',
                      'Normal',
                      '&nbsp;<a href="javascript:void(0)" data-id="',n.id,'" data-zones="',d.zone_codes,'" data-section="',section,'" data-dtype="',_dtype_normal,'" class="ps-btn-edit-prices"><i class="fa fa-edit"></i></a>',
                      '&nbsp;<a style="display:none" href="javascript:void(0)" data-id="',n.id,'" data-zones="',d.zone_codes,'" data-section="',section,'" data-dtype="',_dtype_normal,'" class="ps-btn-save-prices"><i class="fa fa-save"></i></a>',
                    '</span>',
                    '<div class="dd-field-container">',
                           '<div class="dd-field" data-field="base_fee">',
                              '<span class="dd-label">Base fee</span>',
                              '<span class="dd-value">',n.base_fee,'</span>',
                           '</div>',
                           '<div class="dd-field" data-field="delivery_fee">',
                              '<span class="dd-label">Additional fee</span>',
                              '<span class="dd-value">',n.delivery_fee,'</span>',
                           '</div>',
                           '<div class="dd-field" data-field="price_option">',
                              '<span class="dd-label">Price option</span>',
                              '<span class="dd-value">',n.price_option,'</span>',
                              '</div>',
                           '</div>',
                        '</div>',
                  '</div>',
      
            '</div>',
         '</td>'].join('');
        return html;
    }

    //return html for display price_line consisting of x_kg threhold (Above or below X kg), and Zones and Delivery Type 
    // @d = {d.above_kg_data, d.below_kg_data};
    // @above_kg_data = {'fast_items','normal_items'}

    //CreatePriceLine
    this.createRowHtml = (d)=>{
       /** Below X Kg **/
       let section ='below';
       let td_html_below = mThis.price_by_zones(d.below,section);

        /** Above X Kg **/
       //let m = {'fast':d.,'normal':};
       section ='above';
       let td_html_above = mThis.price_by_zones(d.above,section);
       
       return ['<tr>',td_html_below,td_html_above,'</tr>'].join(''); 
    }

    this.displayPrices = ()=>{
        let p = {'price_list_id':mThis.elFilter_price_list.val(),'zone_codes':mThis.elZones.val()};
        let tbody = mThis.tblPrices.find('tbody');

        if(!p.price_list_id) 
        {
          tbody.empty();
          return;
        }

        post_ajax([mThis.base_url,'/api/getPriceList_data'].join(''),p,function(rows){
          if (typeof rows =='string') console.log(rows);
          tbody.empty();
          mThis.tblPrices.find('.ps-below-kg').text('5kg and Below');
          mThis.tblPrices.find('.ps-above-kg').text('Above 5 kg');
          if(rows) {
              let i = 0,c;
              do{
                c = rows[i];
                 if(!c) break;
                    let html = mThis.createRowHtml(c);
                    tbody.append(html);
                 i++;
              }while(c);
          }

        });
 
    }
   
}
//end::PriceSettingsComponent
 
//begin::PriceLineDialog
var PriceLineDialog = new function(){
   let mThis = this;
   this.self = $('#_ps_dlgPriceLine');
   this.base_url = $('#__base_url').val();
   this.elTitle = $('#_ps_dlgPriceLineTitle');
   this.elZone = $('#_ps_newzone_zone');
   this.elZones = $('#_ps_newzone_zone_codes');
   //btnAddZone adds each selected zone to the list of zone_codes
   this.btnAddZone = $('#_ps_btnAddZone');

   this.btnOK = $('#_ps_dlgPriceLine_btnOK');
   this.elError = $('#_ps_dlgPriceLine_error');

   this.loadZones =()=>{
      post_ajax([mThis.base_url,'/api/getComboItems_zone'].join(''),null,function(items){
         CommonLib.setComboItems(mThis.elZone,items,'zone_code','zone_name',false,null,null);
      });
   }

   //click to add zone_codes to price_list table
   this.btnOK.on('click',function(){
      mThis.elError.html(null);

      let p = {'price_list_id':mThis.price_list_id,'zone_codes':mThis.elZones.val()};
      if(!p.zone_codes) {
        mThis.elError.html('zone codes cannot be empty');
        return;
      }
      if(typeof mThis.onClose =='function') mThis.onClose(p);
      mThis.self.modal('hide');
   });

   this.elZone.on('change',function(){
     mThis.btnAddZone.trigger('click');
   });
 
   mThis.btnAddZone.on('click',function(){
      let thisVal = mThis.elZone.val();
      let st = mThis.elZones.val()+'';
      let ds = [];
      if(st !='') ds = st.split(',');
      if(thisVal) {
        if(ds.indexOf(thisVal) < 0) {
          ds.push(thisVal);
        }
      }

      // let cnt = ds.length;
      // let codes= null;
      // let sp = ',';
      // for(let i=0;i<cnt;i++){
      //   if(ds[i]) codes = [codes?sp:null,codes].join(''); 
      // }
      mThis.elZones.val(ds.join(','));
   });

   this.show = (option, onClose)=>{
     mThis.elError.html(null);
      mThis.elTitle.text(option.title);
      mThis.onClose = onClose;
      //price_list_id is required, cannot be empty. It is selected from filter SELECT BOX before showing this modal form
      mThis.price_list_id = option.price_list_id; 

      mThis.loadZones();
      mThis.self.modal({
        backdrop:'static'
      });
   }
}
//end::PriceLineDialog

//begin::PriceListDialog
 var PriceListDialog = new function(){
   let mThis = this;
   this.btnOK = $('#ps_dlgPriceList_btnOK');
   this.elError = $('#ps_dlgPriceList_error');
   this.elTitle = $('#ps_dlgPriceListTitle');

   this.elName = $('#ps-newpl_name');
   this.elWeightMarker = $('#ps-newpl_kg_marker');
   this.self = $('#ps_dlgPriceList');

   this.btnOK.on('click',(e)=>{
      let p = mThis.getData();
       if(!p.name) {
        mThis.elError.html('Name cannot be empty');
        return;
      }

     if(!$.isNumeric(p.kg_marker)) {
       mThis.elError.html('Weight Marker is not valid');
       return;
     }
 
       post_ajax([mThis.base_url,'/api/createPriceList'].join(''),p,function(result){
         if(result.status =='OK') {
           if(typeof mThis.onClose =='function') mThis.onClose(result.id);
           mThis.self.modal('hide');
         }else mThis.elError.text(result.error_message);
       });

   });

   this.getData = ()=>{
     let p = {};
     p.name = mThis.elName.val();
     p.kg_marker = mThis.elWeightMarker.val();
 
     return p;
   }

   this.show = (option, onClose)=>{
      mThis.elError.html(null);
      mThis.elTitle.html(option.title)
      mThis.onClose = onClose;
 
      mThis.self.modal({
        backdrop:'static'
      });
   }
 }
//end::PriceListDialog

//begin::MerchantListDialog
 var MerchantListDialog = new function(){
    let mThis = this;
    this.self = $('#ps_dlgMerchantList');
    this.btnOK = $('#ps_dlgMerchantList_btnOK');
    this.elTitle = $('#ps_dlgMerchantListTitle');
    this.base_url = $('#__base_url').val();
    this.elError = $('#ps_dlgMerchantList_error');
    this.tblMerchants = $('#ps-tblMerchants');
    this.tblMerchants_body = $('#ps-tblMerchants_body');
    
    this.lnkAddMerchant = $('#ps-lnkAddMerchant');
    
    this.btnSearchMerchant = $('#ps-btnSearchMerchant');
    this.elSearch = $('#ps-search_merchant');

    this.elSearch.on('keyup',function(e){
        mThis.showMerchantList();
    });

    this.btnSearchMerchant.on('click',function(e){
       mThis.showMerchantList();
    });

    this.lnkAddMerchant.on('click',(e)=>{
       e.preventDefault();
       
       let option = {'title':"Find Merchant","role":"sender","singleSelect":true,"previousDialog":mThis.self};
       FindPersonDialog.show(option,(persons)=>{
                    if(persons[0]){
                        let p = persons[0];
                        let m = {'sender_id':p.id,'price_list_id':mThis.price_list_id};
                         post_ajax([mThis.base_url,'/api/setMerchantPriceList'].join(''),m,function(err){ 
                             if(!err || err=='')
                                mThis.showMerchantList();
                             else cv_interact.alert(err,'','error');   
                         });
          
                    }
          });

    });

    this.tblMerchants_body.on('click','a.ps-btn_add_merchant',function(e){
      e.preventDefault();
      let p = {};
      let x = $(this);
      p.sender_id = x.data('senderid');
      p.price_list_id = mThis.price_list_id;
      if (!mThis.price_list_id) {
        cv_interact.alert('Current price list is not valid','','warning');
        return;   
      }

      post_ajax([mThis.base_url,'/api/setMerchantPriceList'].join(''),p,function(err){ 
          if(!err || err=='')
             mThis.showMerchantList();
             //x.hide();
          else cv_interact.alert(err,'','error');   
      });
    });

    this.tblMerchants_body.on('click','a.ps-btn_remove_merchant',function(e){
      e.preventDefault();
      let sender_id = $(this).data('senderid');
      cv_interact.confirm('Remove this merchant from the Price List?','Remove Merchant',(e)=>{
          if(e){
              let p = {'price_list_id':mThis.price_list_id,'sender_id':sender_id};
              post_ajax([mThis.base_url,'/api/removeMerchantFromPriceList'].join(''),p,function(err){
                 if(!err || err =='') {
                   mThis.showMerchantList();
                 }else cv_interact.alert(err,'','error');
              });
          }
      },'Remove','Cancel','remove');
    });

    this.showMerchantList = (onFinish)=>{
       let p = {'price_list_id':mThis.price_list_id,'search_value':mThis.elSearch.val()};
       post_ajax([mThis.base_url,'/api/getMerchantsByPriceList'].join(''),p,function(items){
          if(items) {
             items = StringSanitizer.sanitizeObject(items);
             let i=0,c;
             mThis.tblMerchants_body.empty();
             do{
                c = items[i];
                if(!c) break;
                 let htm_button =  ['<a data-senderid="',c.id,'" href="javascript:void(0)" class="ps-btn_add_merchant"><span style="color:blue">Add Now</span></a>'].join('');
                 if(c.is_member ==1) htm_button = ['<a data-senderid="',c.id,'" href="javascript:void(0)" class="ps-btn_remove_merchant"><span style="color:red">Remove</span></a>'].join('');
                 let css_class ='ps-is-member';
                 if(c.is_member !=1) css_class=null;
                 if (!c.price_list_name) c.price_list_name ='<span style="color:red">No Price List</span>';
                 let html= ['<tr class="',css_class,'">',
                 '<td>',(i+1),'</td>',
                 '<td>',c.code,'</td>',
                 '<td>',c.name,' (',c.price_list_name,')','</td>',
                 '<td>',c.phone_number,'</td>',
                 '<td>',htm_button,'</td>',
                 '</tr>'].join('');
                 mThis.tblMerchants_body.append(html);
                i++;
             }while(c);
             if (typeof onFinish =='function') onFinish();
          }else {
            if (typeof onFinish =='function') onFinish();
            console.log('error occured in method .../api/getMerchantsByPriceList() returning @items as NULL');
          }
       });
    }

    this.show = (option,onClose)=>{
         mThis.elError.html(null);
         mThis.elTitle.text(option.title);
         mThis.onClose = onClose;
         //NOTE: "option.price_list_id" is required
         if(!option.price_list_id) {
           cv_interact.alert('option.price_list_id is not supplied');
           return;
         }
         mThis.price_list_id = option.price_list_id; 
         mThis.showMerchantList(()=>{
              mThis.self.modal({
                backdrop:'static'
              });
         });        
    }

 }
//end::MerchantListDialog

$(document).ready(function(){
  PriceSettingsComponent.init();
});

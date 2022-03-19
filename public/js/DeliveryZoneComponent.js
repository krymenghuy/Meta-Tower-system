'use strict'
var DeliveryZoneComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    //this.btnBack = $('#_enroll_panel_btnBack');
    this.base_url = $('#__base_url').val();
    this.self = $('#_sttn_deliveryZoneComponent');
    this.base_url = $('#__base_url').val();
    this.tblZones = $('#_sttn_zon_tblZones');
    this.tblZones_body = $('#_sttn_zon_tblZones_body');
    this.lnkNewZone = $('#_sttn_zon_lnkNewZone');
    
    this.elFilter_country = $('#_sttn_zon_filter_country');
    this.elFilter_city = $('#_sttn_zon_filter_city');
    this.elFilter_district = $('#_sttn_zon_filter_district');

    this.init = function(){
      mThis.base_url = $('#__base_url').val();  
      mThis.title ='Manage Delivery Zones';  
       
      // mThis.btnBack.on('click',function(e){
      //       Settings.showPrevious(); 
      // });

      mThis.lnkNewZone.on('click',function(e){
        e.preventDefault();
        let option = {title:'New Delivery Zone','def':null,'zone_id':null};
        ZoneDialog.show(option,function(e){
          if(e) mThis.displayDeliveryZones();
        });
      });
 
      mThis.tblZones_body.on('click','a._sttn_zon_delete',function(e){
        e.preventDefault();
        let p = {'id':$(this).closest('tr').data('id')};
        if(!p.id) p.id=0;
            cv_interact.confirm('Delete this delivery zone?','Delete Delivery Zone',function(e){
                  if(e)
                  {
                      post_ajax([mThis.base_url,'/api/deleteDeliveryZone'].join(''),p,function(err){
                        if(!err || err ==''){
                          mThis.displayDeliveryZones();
                        } else cv_interact.alert(err);
                      });
                  }
            });
      });
  
      //Edit zone details
      mThis.tblZones_body.on('click','a._sttn_zon_edit',function(e){
        e.preventDefault();
        let zone_id = $(this).closest('tr').data('id');
        let p = {'id':zone_id};
        if(!p.id) p.id=0;

        let onDone=(e)=>{
          if (e) mThis.displayDeliveryZones();
        }

        let option ={'title':'Modify Zone Details','zone_id':zone_id};
         ZoneDialog.show(option,onDone);
      });

      mThis.tblZones_body.on('mouseover','tr',function(e){
        // let td_action = $(this).find('td.col_action');
        // td_action.find('a.').css('display','block');
        $(this).find('td.col_action>a._sttn_zon_delete').show();
      }).on('mouseleave','tr',function(e){
        // let td_action = $(this).find('td.col_action');
        // td_action.find('a').css('display','none');
        $(this).find('td.col_action>a._sttn_zon_delete').hide();
      });
   
      mThis.tblZones.on('click','tbody>tr',function(e){
        if(mThis.prev_selected_row ) mThis.prev_selected_row.removeClass('selected-animate');
        $(this).toggleClass('selected-animate');
        if ($(this).hasClass('selected-animate')){
          mThis.selected_country_id = $(this).data('countryid');
          mThis.selected_country_name = $(this).data('countryname');
          mThis.prev_selected_row = $(this);
        }
      });
 

    } //end::DeliveryZoneCompoent.init()

    this.show = function(option) {
      mThis.elScreenTitle.html(option.title);
      mThis.displayDeliveryZones(true); 
      mThis.self.show().siblings().hide();
    }

    this.hide = function(){
      mThis.self.hide();
    }
 
    
    this.displayDeliveryZones = function(animate =false){
      mThis.selected_zone_name = null;
      mThis.selected_zone_id = null;

      let div = mThis.tblZones.parent();
      if (animate) div.removeClass('animate-slide-up');
      mThis.tblZones_body.empty();
      post_ajax([mThis.base_url,'/api/getDeliveryZoneList'].join(''),null,function(rows){
         if(rows){
            rows = StringSanitizer.sanitizeObject(rows);
            let i=0,c;
            do{
                c = rows[i];
                if(!c) break;
                if(!c.currency_symbol) c.currency_symbol ='$';
                if(!c.price) c.price =0;
                let html = ['<tr data-zonename="',c.zone_name,'" data-id="',c.id,'">',
                 '<td class="zone_code">',c.zone_type,'</td>',
                 '<td class="zone_code">',c.zone_code,'</td>',
                 '<td class="zone_name">',c.zone_name,'</td>',
                 '<td class="zone_name">',c.commune_name,'</td>',
                 '<td class="district_name">',c.district_name,'</td>',
                 '<td class="city_name">',c.city_name,'</td>',
                 '<td class="commune_name">',c.country_name,'</td>',
                 //'<td class="price">',[c.price,c.currency_symbol].join(''),'</td>',
                 '<td class="col_action">',
                 '<a data-countryid="',c.country_id,'" data-city_id="',c.city_id,'" data-districtid="',c.district_id,'" data-communeid="',c.commune_id,'" href="#" class="_sttn_zon_edit btn-sm btn-outine-warning"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
                 '<a data-countryid="',c.country_id,'" data-city_id="',c.city_id,'" data-districtid="',c.district_id,'" data-communeid="',c.commune_id,'" href="#" class="_sttn_zon_delete" style="display:none"><i class="fa fa-times" style="color:red;font-size:1.4em"></i></a>',
                 '</td>',
                ,'</tr>'].join('');
                mThis.tblZones_body.append(html);
                i++;
            }while(c);
            //mThis.tblZones_body.find('a._sttn_zon_delete_country').css('display','none');
            if (animate) div.addClass('animate-slide-up');
         }
      });   
    }
}
//end::DeliveryZoneComponent
 
//begin::ZoneDialog
var ZoneDialog = new function(){
  let mThis = this;
  this.self = $('#_sttn_dlgZone');
  this.base_url = $('#__base_url').val();
  this.elTitle = $('#_sttn_dlgZoneTitle');
  this.elCountry = $('#_sttn_zon_country');
  this.elCity = $('#_sttn_zon_city');
  this.elDistrict = $('#_sttn_zon_district');
  this.elCommune = $('#_sttn_zon_commune');

  this.fields =[];
  this.btnOK = $('#_sttn_dlgZone_btnOK');
  this.elError = $('#_sttn_dlgZone_error');

  this.self.find('.data-input').each(function(){
    let el = {dataMember:$(this).data('field'),'element':$(this)};
    mThis.fields.push(el);
  }); 

  this.getData = ()=>{
     let p = {};
     let i=0,c;
     do{
       c = mThis.fields[i];
       if(!c) break;
        p[c.dataMember] = c.element.val();     
       i++;
     }while(c);
     p.id = mThis.zone_id;
     return p;
  }

  this.setData = (d)=>{
      let i=0,c;
      if(!d){

        do{
          c = mThis.fields[i];
          if(!c) break;
            c.element.val(null);     
          i++;
        }while(c);
        return;
      }

      i=0;
      do{
        c = mThis.fields[i];
        if(!c) break;
          c.element.val(d[c.dataMember]);     
        i++;
      }while(c);

     mThis.city_id = d.city_id;
     mThis.district_id = d.district_id; 
     mThis.commune_id = d.commune_id;
     mThis.elCountry.trigger('change');
  }

  this.btnOK.on('click',function(e){
     let p = mThis.getData();
     if(!p.zone_code) {
      mThis.elError.text('Zone Code cannot be empty!');
       return;
     } 
     if(!p.zone_name) {
      mThis.elError.text('Zone Name cannot be empty!');
       return;
     }
     if(!p.commune_id || p.commune_id<=0) {
      mThis.elError.text('Commune or Sangkat is not correct');
       return;
     }
     
     if(!p.district_id || p.district_id<=0) {
      mThis.elError.text('district is not correct');
       return;
     }

     if(!p.city_id || p.city_id<=0) {
      mThis.elError.text('City is not correct');
       return;
     }
     if(!p.country_id || p.country_id<=0) {
      mThis.elError.text('Country is not correct');
       return;
     }
    if (!$.isNumeric(p.price)) p.price =0;
     post_ajax([mThis.base_url,'/api/saveDeliveryZone'].join(''),p,function(err){
       if(!err || err =='') 
       {
          mThis.self.modal('hide');
          if(typeof mThis.onClose =='function') mThis.onClose(true);
       } else mThis.elError.text(err);
     });

  });

  this.show = (option,onClose)=>{
    mThis.elError.html(null);
    if (!option) option = {};
    mThis.onClose = onClose;
    mThis.zone_id = option.zone_id;

    if (mThis.zone_id > 0) {
      mThis.elTitle.text('Modify Zone Details');
      let p = {'zone_id':mThis.zone_id};
      post_ajax([mThis.base_url,'/api/getDeliveryZoneDetails'].join(''),p,function(d){
            if(d){
                    d = StringSanitizer.sanitizeObject(d);
                    if(!option.def) option.def = {};
                    option.def.country_id = d.country_id;
                    option.def.city_id = d.city_id;
                    option.def.district_id = d.district_id;
                    option.def.commune_id = d.commune_id;
                    mThis.prepareFormData(option.def,()=>{
                            mThis.setData(d);
                            mThis.self.modal({
                              backdrop:'static'
                            });
                    });
            }
      });

  } else{
        mThis.elTitle.text('New Delivery Zone');

          let onDone = (e)=>{
                mThis.setData(null);
                mThis.self.modal(
                {
                    backdrop:'static'
                }
            ); 
          }//Close onDone()
        mThis.prepareFormData(null,onDone);   
        
    }

}
//close::this.show()

    this.elCity.off('change').on('change',function(){
          let p = {'city_id':mThis.elCity.val()};

          post_ajax([mThis.base_url,'/api/getComboItems_district'].join(''),p,function(rows){
            if(rows){
              rows = StringSanitizer.sanitizeObject(rows);
              CommonLib.setComboItems(mThis.elDistrict,rows,'district_id','name_kh',true,'(Select District)',mThis.district_id);
              if(mThis.elDistrict.val() > 0 ) mThis.elDistrict.trigger('change');
            }
          });
    });

    mThis.elDistrict.off('change').on('change',function(){
      let p = {'district_id':$(this).val()};
       post_ajax([mThis.base_url,'/api/getComboItems_commune'].join(''),p,function(rows){
        if(rows){
          rows = StringSanitizer.sanitizeObject(rows);
          CommonLib.setComboItems(mThis.elCommune,rows,'commune_id','name_kh',true,'(Select Commune)',mThis.commune_id);
        }
       });
    });

  this.prepareFormData = (def, onFinish)=>{
      mThis.loadCountries(def,mThis.elCountry); 
      if(typeof onFinish =='function') onFinish();
  };

  mThis.elCountry.off('change').on('change',function(){
    let p = {'country_id':$(this).val()};
    post_ajax([mThis.base_url,'/api/getComboItems_city'].join(''),p,function(rows){
      if(rows){
        rows = StringSanitizer.sanitizeObject(rows);
        let val = mThis.elCity.val();
        CommonLib.setComboItems(mThis.elCity,rows,'city_id','name_kh',true,'(Select City)',val);
        if(mThis.elCity.val() > 0) mThis.elCity.trigger('change');
      }
    });
 });

  this.loadCountries = (def)=>{
     if(!def) def = {};
     post_ajax([mThis.base_url,'/api/getComboItems_country'].join(''),null,function(rows){
       if(rows){
         rows = StringSanitizer.sanitizeObject(rows);
         CommonLib.setComboItems(mThis.elCountry,rows,'country_id','name_kh',true,'(Select Country)',def.country_id);
         if(mThis.elCountry.val() >0) mThis.elCountry.trigger('change');
       }
     });  
  } 

} 
//end::ZoneDialog

$(document).ready(function(){
   DeliveryZoneComponent.init();
});

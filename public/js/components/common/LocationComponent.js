'use strict';

var LocationComponent = new function(){
    const mThis = this;
    this.title_prop = 'Location Management';
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_sttn_locationsComponent');
    this.apiCluster ='locapi';

    this.show = (options=null) => {
      CountryListPanel.displayCountries();
      let tab_view_name ='cities';
      ZoneTabView.show(mThis.selected_country_id,tab_view_name,false);
      mThis.self.siblings().hide();
      main_view.setTitle(mThis.title_prop);
      mThis.self.hide().fadeIn(250);
    }
    this.hide = function(){
      mThis.self.hide();
    }
}
//end::LocationsComponent

//begin::CountryListPanel
 var CountryListPanel  = new function(){
    const mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_sttn_loc_countryListpanel');
    this.tblCountries = LocationComponent.self.find('#_sttn_loc_tblCountries');
    this.tblCountries_body = this.tblCountries.find('tbody');
    this.lnkNewCountry = LocationComponent.self.find('#_sttn_loc_lnkNewCountry');

    mThis.lnkNewCountry.on('click',function(e){
      e.preventDefault();
      let options = {
        title:'New Country','def':null, 'id':null,'onClose':()=>{
                  mThis.displayCountries();

          }
      };
      ZoneDialog1.show(options);

    });

    mThis.tblCountries_body.on('click','a._sttn_loc_edit_country',function(e){
        e.preventDefault();
        let op = {
            id: this.dataset.id,
            onClose: () => {
                cv_interact.success('Country Updated Successfully');
                mThis.displayCountries();
            },
        };

        ZoneDialog1.show(op);
      });

    mThis.tblCountries_body.on('click','a._sttn_loc_delete_country',function(e){
      e.preventDefault();

      let p = {'id':this.dataset.id};

      if(!p.id) p.id=0;
          cv_interact.confirm('Delete this country?',{title:'Delete Country','context':'delete'},function(e){
                if(e)
                {
                    vsapi.call([mThis.base_url,'/api/location/country/delete'].join(''),p).then((res)=>{
                      if(res.status_code===200){

                        mThis.displayCountries();
                      } else cv_interact.error(res.error_message);
                    });
                }
          });
    });

    // mThis.tblCountries_body.on('mouseover','tr',function(e){
    //   // let td_action = $(this).find('td.col_action');
    //   // td_action.find('a.').css('display','block');
    //   $(this).find('td.col_action>a._sttn_loc_delete_country').show();
    // }).on('mouseleave','tr',function(e){
    //   // let td_action = $(this).find('td.col_action');
    //   // td_action.find('a').css('display','none');
    //   $(this).find('td.col_action>a._sttn_loc_delete_country').hide();
    // });

    mThis.tblCountries.on('click','tr', function(e) {
      e.preventDefault();
      const el = $(this);
      if(mThis.prev_selected_row) mThis.prev_selected_row.removeClass('row-selected');
      el.toggleClass('row-selected');
      if (el.hasClass('row-selected')){
        mThis.selected_country_id = el.data('id');
        mThis.selected_country_name = el.data('name');
        mThis.prev_selected_row = el;
      }
      ZoneTabView.show(mThis.selected_country_id,null,false);
      ZoneTabView.loadComboItems_zone(mThis.selected_country_id,'city',null);
     // alert(123);
    });

    this.displayCountries = function(){
      mThis.selected_country_name = null;
      mThis.selected_country_id = null;

      mThis.tblCountries_body.html(null);
      vsapi.call([mThis.base_url,'/api/location/countries'].join(''),null,null).then((res)=>{
         if(res.status_code===200){
            let rows = res.data;
            let i=0,c;
            let html = ['<tr class=" color-text text-white bg-primary-custom">',
                        `<th>Flag</th>`,
                        `<th>Country </th>`,
                        `<th>Currency Code</th>`,
                        `<th>Action</th>`,
                      '<tr/>'].join('');
                        mThis.tblCountries_body.append(html);
                        do {
                            c = rows[i];
                            if (!c) break;
                            let html2 = [
                                '<tr data-name="', c.name, '" data-id="', c.id, '" id="country_row">',
                                '<td><img class="image-student-tbl border border-primary" src="', c.image_url, '" alt="" ',
                                'style="width: 80px; height: 40px; margin-right: 10px; border-radius: 0;"/></td>',
                                '<td class="col_country_name text-uppercase">', c.name, '</td>',
                                '<td class="col_country_code text-uppercase">', c.currency_code, '</td>',
                                '<td class="col_action">',
                                '   <!-- Edit Button -->',
                                '   <a data-id="', c.id, '" data-name="', c.name, '" href="javascript:void(0)" ',
                                '      class="_sttn_loc_edit_country btn btn-sm text-primary rounded-5">',
                                '      <i class="fa-solid fa-pen ms-1"></i>',
                                '   </a>',
                                '   <!-- Delete Button -->',
                                '   <a data-id="', c.id, '" data-name="', c.name, '" href="javascript:void(0)" ',
                                '      class="_sttn_loc_delete_country btn btn-sm text-danger rounded-5">',
                                '      <i class="fa-solid fa-trash ms-1"></i>',
                                '   </a>',
                                '</td>',
                                '</tr>'
                            ].join('');

                            mThis.tblCountries_body.append(html2);
                            i++;
                        } while (c);
         }
      });
    }
 }
//end::CountryListpanel

// const ZoneDialog1 = new function () {
//   let mThis = this;
//   this.self = main_view.appContent.children('#_sttn_dlgZon');
//   this.base_url = main_view.base_url;
//   this.elTitle = this.self.find('#_sttn_dlgZoneTitle');
//   this.elZoneType = this.self.find('#_sttn_zoneType');
//   this.elCountry = this.self.find('#_sttn_zon_country');
//   this.elCity = this.self.find('#_sttn_zon_city');
//   this.elDistrict = this.self.find('#_sttn_zon_district');
//   this.elCommune = this.self.find('#_sttn_zon_commune');

//   this.options = {};
//   this.fields = [];
//   this.btnOK = this.self.find('#_sttn_dlgZone_btnOK');
//   this.elError = this.self.find('#_sttn_dlgZone_error');
//   this.self.find('.data-input').each(function () {
//     let el = { dataMember: $(this).data('field'), 'element': $(this) };
//     mThis.fields.push(el);
//   });

//   this.getData = () => {
//     let p = {};
//     let i = 0, c;
//     do {
//       c = mThis.fields[i];
//       if (!c) break;
//       p[c.dataMember] = c.element.val();
//       i++;
//     } while (c);

//     //zone_id
//     p.id = mThis.options.id;
//     return p;
//   }

//   this.setData = (d) => {
//     let i = 0, c;
//     if (!d) {

//       do {
//         c = mThis.fields[i];
//         if (!c) break;
//         c.element.val(null);
//         i++;
//       } while (c);
//       return;
//     }

//     i = 0;
//     do {
//       c = mThis.fields[i];
//       if (!c) break;
//       c.element.val(d[c.dataMember]);
//       i++;
//     } while (c);

//     mThis.city_id = d.city_id;
//     mThis.district_id = d.district_id;
//     mThis.commune_id = d.commune_id;
//     mThis.elCountry.trigger('change');
//   }



//   this.btnOK.on('click', function (e) {
//     let p = mThis.getData();

//     vsapi.call(`${mThis.base_url}/api/location/country/save`, p, null).then(res => {
//       if (res.status_code === 200) {
//         mThis.self.modal('hide');
//         if (typeof mThis.options.onClose === 'function') mThis.options.onClose(true);
//       } else cv_interact.warning(res.error_message);
//     });
//   });

//   this.show = (options = {}) => {
//     mThis.elError.html(null);
//     options = options || {};
//     options.id = options.id || options.zone_id;
//     mThis.options = options;

//     mThis.prepareFormData(options.id, options.def, (d) => {
//       if (d.zone) {
//         mThis.elTitle.text('Modify Zone Details');
//       } else {
//         mThis.elTitle.text('New Delivery Zone');
//       }

//       mThis.setData(d.zone);
//       mThis.self.modal({
//         backdrop: 'static'
//       });
//     });
//   }
//   //close::this.show()

//   this.prepareFormData = (id, def, onFinish) => {

//     vsapi.call(`${main_view.base_url}/api/location/options-country`, { 'id': id }, null).then(res => {
//       let d = res.status_code === 200 ? res.data : {};
//       // VSUtil.setComboItems(mThis.elCountry, d.countries, 'id', 'country', true, '(Select country)', null);
//       // VSUtil.setComboItems(mThis.elZoneType, d.zone_types, 'zone_type', 'zone_type', true, '(Select zone type)', null);
//       onFinish(d);
//     });
//   };

//   // this.loadCountries = (def)=>{
//   //    if(!def) def = {};
//   //    vsapi.call(`${mThis.base_url}/api/location/options-country`,null).then(res => {
//   //      if(res.status_code === 200){
//   //        let rows = Sanitizer.sanitizeObject(res.data);
//   //        VSUtil.setComboItems(mThis.elCountry,rows,'id','name',true,'(Select Country)',def.country_id);
//   //        if(mThis.elCountry.val() >0) mThis.elCountry.trigger('change');
//   //      }
//   //    });
//   // }

// }
//end::ZoneDialog


//begin::ZoneTabView
var ZoneTabView = new function(){
  const mThis = this;
  this.self = LocationComponent.self.find('#_sttn_loc_subLocationTabView');
  this.base_url =main_view.base_url;

  this.cur_view = 'cities';

  this.self.on('click','div.tab-header>a.tab-button',function(e){
      e.preventDefault();
      //alert($(this).data('target'));
      $(this).addClass('active').siblings().removeClass('active');
      let view_name = $(this).data('viewname').toLowerCase();

      mThis.show(mThis.country_id,view_name,true);

  });

  //Load filter zone, for districts and commune and village
  this.loadComboItems_zone= (parent_zone_id,zone_name,def)=>{
    if(!def) def= {};
    let method_name ='location/options-city';
    let p = {};
    if(zone_name ==='city')
     {
      p.country_id = parent_zone_id;
      method_name = 'location/options-city';
     }
    else if (zone_name ==='district')
    {
      p.city_id = parent_zone_id;
      method_name = 'location/districts';
    }
    else if (zone_name ==='commune'){
      p.district_id = parent_zone_id;
      method_name = 'location/options-commune';
    } else if (zone_name =='village'){
      p.district_id = parent_zone_id;
      method_name = 'location/options-village';
    }

     vsapi.call([mThis.base_url,'/api/',method_name].join(''),p,null,LocationComponent.apiCluster).then((res)=>{
        if (res.status_code===200){
              let rows = Sanitizer.sanitizeObject(res.data);

              if (zone_name ==='city')
                {
                  VSUtil.setComboItems(mThis.elFilter_city,rows,'id','name',true,'(Select a city)',def.city_id);
                  VSUtil.setComboItems(mThis.elFilter_city_district,rows,'id','name',true,'(Select a city)',def.city_id);
                  //mThis.elFilter_city.val(rows[0]?rows[0].city_id:0).trigger('change'); //error 429 Too many requests
                }
              else if (zone_name ==='district')
              {
                VSUtil.setComboItems(mThis.elFilter_district,rows,'id','name',true,'(Select a district)',def.district_id);

                //mThis.elFilter_district.val(rows[0]?rows[0].district_id:0); //Cause some error "Maximum calls limit in laravel"
              } else if (zone_name ==='commune')
              {
                VSUtil.setComboItems(mThis.elFilter_commune,rows,'id','name',true,'(Select a commune)',def.commune_id);
                //mThis.elFilter_commune.val(rows[0]?rows[0].district_id:0);
              }

        }

     });
  }

  this.show = function(country_id,view_name,tab_button_clicked = false){
       mThis.country_id = country_id;
       if (!view_name) view_name = mThis.cur_view;
       view_name = (view_name+'').toLowerCase();
       mThis.self.find('div.tab-body>div.tab-panel').each(function(){
           let this_view_name =($(this).data('viewname')+'').toLowerCase();
           if(view_name == this_view_name) {
               mThis.cur_view =view_name;
               $(this).show().siblings().hide();

                //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
                     if (view_name ==='cities'){
                         mThis.displayCities(CountryListPanel.selected_country_id);
                     } else if (view_name =='districts') {
                         mThis.elFilter_city.trigger('change');
                         //mThis.displayDistricts();
                     }else if (view_name==='communes')
                     {
                         //let district_id = mThis.elFilter_district.val();
                         mThis.elFilter_district.trigger('change');
                         //mThis.displayCommunes();
                     }
                     // else {
                     //   //do nothing
                     // }
                //end:: dispay content data

               return;
           }
       });

       //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
       if(!tab_button_clicked) {
         mThis.self.find('div.tab-header>a.tab-button').each(function() {
           let this_view_name =($(this).data('viewname')+'').toLowerCase();
           if (view_name === this_view_name){
               $(this).addClass('active').siblings().removeClass('active');
           }
         });
       }
  }

  //begin::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
         //begin::define specific elements, tables within this ZoneTabView tasks
             const div = LocationComponent.self;
             this.tblCities = div.find('#_sttn_loc_tblCities');
             this.tblCities_body = div.find('#_sttn_loc_tblCities_body');
             this.tblDistricts =div.find('#_sttn_loc_tblDistricts');
             this.tblDistricts_body = div.find('#_sttn_loc_tblDistricts_body');

             this.lnkAddCity= div.find('#_sttn_loc_lnkNewCity');
             this.lnkAddDistrict = div.find('#_sttn_loc_lnkNewDistrict');
             this.lnkAddCommune = div.find('#_sttn_loc_lnkNewCommune');

             this.tblCommunes_body  = div.find('#_sttn_loc_tblCommunes_body');
             this.tblCommunes = div.find('#_sttn_tblCommunes');
             this.elFilter_city = div.find('#_sttn_loc_filter_city'); //City Filter on District Panel. CommuneList requires TWO filters (City,District)
             this.elFilter_city_district = div.find('#_sttn_loc_filter_city_district'); // City filter on CommuneListPanel
             this.elFilter_district = div.find('#_sttn_loc_filter_district')
             this.elFilter_commune = div.find('#_sttn_loc_filter_commune');

             //link to Add Accessible module
             this.lnkAddCity.on('click',function(e){
                 e.preventDefault();
                 let x =$(this);
                 let id = x.data('id');
                 if(!CountryListPanel.selected_country_id) {
                     cv_interact.error('No country selected!');
                     return ;
                 }
                  let option = {'title':['New City/Province in ' ,CountryListPanel.selected_country_name].join(''),'dataLabel':'Enter City name','btnOKText':'Add Now','blankErrorMessage':'City name cannot be empty'};
                  InputBox1.show(option,function(d){
                    if(d){
                       let p = {'id':id,'country_id':CountryListPanel.selected_country_id,'name':d,'name_kh':d};
                       vsapi.call([mThis.base_url,'/api/location/city/save'].join(''),p).then((res)=>{
                         if(res.status_code===200) {
                            mThis.displayCities(CountryListPanel.selected_country_id);
                         } else cv_interact.error(res.error_message);
                       });
                    }
                  });
             });

             this.elFilter_city.on('change',function(){
                 mThis.displayDistricts($(this).val(),true);
             });

              //On CommuneListPanel: User select Filter City, then displays list of related districts, and when user select District => display List of communes
              this.elFilter_city_district.off('change').on('change', function(){
                 let def = {'district_id':mThis.elFilter_district.val()};
                 mThis.loadComboItems_zone($(this).val(),'district',def);
              });

             this.elFilter_district.on('change', function(){
                mThis.displayCommunes($(this).val(),true);
             });

             this.lnkAddDistrict.on('click',function(e){
                 e.preventDefault();
                 if(!mThis.elFilter_city.val()) {
                  cv_interact.error('No city selected!');
                  return ;
                }
                  let city_name = mThis.elFilter_city.find('option:selected').text();
                  let option = {'title':['New District in ', city_name].join('') ,'dataLabel':'Enter District name','btnOKText':'Add Now','blankErrorMessage':'District name cannot be empty'};
                  InputBox1.show(option,function(d){
                    if(d){
                        let p = {'city_id':mThis.elFilter_city.val(),'name':d,'name_kh':d};
                        vsapi.call([mThis.base_url,'/api/location/district/save'].join(''),p,null,false).then((res)=>{
                          if(res.status_code === 200) {
                              mThis.elFilter_city.trigger('change');
                              //mThis.displayDistricts(p.city_id);
                          } else cv_interact.error(res.error_message);
                        });
                    }
                  });
             });

             this.lnkAddCommune.on('click',function(e){
              e.preventDefault();
              if(!CountryListPanel.selected_country_id) {
               cv_interact.error('No country selected!');
               return ;
             }
              if(!mThis.elFilter_district.val() || mThis.elFilter_district.val() <=0) {
                cv_interact.error('No district selected!');
                return ;
              }
                let option = {'title':'New Commune','dataLabel':'Enter Commune name','btnOKText':'Add Now','blankErrorMessage':'Commune name cannot be empty'};
                InputBox1.show(option,function(d){
                  if(d){
                        let p = {'district_id':mThis.elFilter_district.val(),'name':d,'name_kh':d};
                        vsapi.call([mThis.base_url,'/api/location/commune/save'].join(''),p).then((res)=>{
                          if(res.status_code===200) {
                            mThis.displayCommunes(p.district_id);
                          } else cv_interact.error(res.error_message);
                        });
                  }
                });
             });

             mThis.tblCities_body.on('click','a._sttn_loc_delete_city',function(e){
               e.preventDefault();
               let p = {'city_id':$(this).data('cityid')};
               if(!p.city_id) p.city_id=0;
               //p.id = p.city_id;
               cv_interact.confirm('Delete this city?',{title:'Delete City',context:'delete'},function(e){
                 if(e){
                   vsapi.call([mThis.base_url,'/api/location/city/delete'].join(''),p).then((res)=>{
                     if(res.status_code===200){
                         mThis.displayCities(mThis.country_id);
                     } else cv_interact.error(res.error_message);
                   });
                 }
               });
             });


             mThis.tblCommunes_body.on('click','a._sttn_loc_delete_commune',function(e){
              e.preventDefault();
              let p = {'id':$(this).data('id')};
              if(!p.id) p.id=0;
              //p.id = p.city_id;
              cv_interact.confirm('Delete this commune?',{'title':'Delete Commune',context:'delete'},function(e){
                if(e){
                  vsapi.call([mThis.base_url,'/api/location/commune/delete'].join(''),p,null,false).then(res=>{
                    if(res.status_code===200){
                      mThis.displayCommunes(mThis.elFilter_district.val());
                    } else cv_interact.error(res.error_message);
                  });
                }
              });
            });

             mThis.tblDistricts_body.on('click','a._sttn_loc_delete_district',function(e){
              e.preventDefault();
              let p = {'district_id':$(this).data('id')};
              if(!p.district_id) p.district_id=0;
              //p.id = p.city_id;
              cv_interact.confirm('Delete this distrinct?',{title:'Delete District',context:'delete'},function(e){
                if(e){
                  vsapi.call([mThis.base_url,'/api/location/district/delete'].join(''),p).then((res)=>{
                    if(res.status_code===200){
                      mThis.displayDistricts(mThis.elFilter_city.val());
                    } else cv_interact.error(res.error_message);
                  });
                }
              });
            });

            mThis.tblCities_body.on('click','a._sttn_loc_edit_city',function(e){
              e.preventDefault();
              let x = $(this);
              let city_id = $(this).data('cityid');
              let city_name = x.closest('tr').find('td.col_city_name').text();
              let country_id = CountryListPanel.selected_country_id;
              if(!country_id) {
                cv_interact.warning('No country selected!');
                return;
              }
              mThis.editCity(city_id, city_name, country_id);
            });

            mThis.tblDistricts_body.on('click','a._sttn_loc_edit_district',function(e){
              e.preventDefault();
              let x = $(this);
              let district_id = $(this).data('id');
              let district_name = x.closest('tr').find('td.col_district_name').text();
              let city_id = mThis.elFilter_city.val();
              if(!city_id) {
                cv_interact.error('No city selected!','','warning');
                return;
              }
              mThis.editDistrict(district_id, district_name, city_id);
            });

            mThis.tblCommunes_body.on('click','a._sttn_loc_edit_commune',function(e){
              e.preventDefault();
              let x= $(this);
              let commune_id = x.data('id');
              let commune_name = x.closest('tr').find('td.col_commune_name').text();
              mThis.editCommune(commune_id,commune_name,mThis.elFilter_district.val());
            });
         //end::define specific elements

          this.displayCities = function(country_id) {
          //let div = mThis.tblCities.parent();
          //div.removeClass('animate-slide-left');

                 let p = {};
                 p.country_id = country_id;
                 mThis.tblCities_body.empty();

                 vsapi.call([mThis.base_url,'/api/location/cities'].join(''),p,null,LocationComponent.apiCluster).then((res)=>{
                     if (res.status_code===200){
                          let rows = Sanitizer.sanitizeObject(res.data);
                          let i=0, c;
                          do{
                              c = rows[i];
                              if(!c) break;
                                  let html = ['<tr data-cityname="',c.name,'" data-cityid="',c.id,'">',
                                  '<td><i class="icon-city-default"></i></td>',
                                  '<td class="col_city_name">',c.name,'</td>',
                                  '<td class="col_action">',
                                  '<a href="#" class="_sttn_loc_edit_city" data-cityid="',c.id,'"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
                                  '<a href="#" class="_sttn_loc_delete_city" data-cityid="',c.id,'"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
                                  '</td>',
                                  '</tr>'].join('');
                                  mThis.tblCities_body.append(html);
                              i++;
                          }while(c);
                          //div.addClass('animate-slide-left');
                     }

                 });
                  // this.sh_container = mThis.tblCities.getListContainer();
              // mThis.setEvents($(mThis.container));
            // console.log(mThis.container.parentElement);
            
              // const sh_parent = mThis.tblCities;
              //     sh_parent[0].style.height = (window.innerHeight - 230)+'px';
              //     sh_parent[0].classList.add('overflow-y-auto');
              //     window.onresize = () => {
              //         sh_parent[0].style.height = (window.innerHeight - 230)+'px';
              //     }
          }

          this.displayDistricts = function(city_id,isOnSelectChange=false) {
             //let div = mThis.tblDistricts.parent();
             //div.removeClass('effect-zoomin');
             if(!isOnSelectChange){
               mThis.elFilter_city.val(city_id).trigger('change');
               return;
             }

             let p = {};
             //let def_city_id = mThis.elFilter_city_district.val();
             if(!city_id) {
                city_id = mThis.elFilter_city_district.val();
             }
             p.city_id = city_id;
             mThis.tblDistricts_body.empty();

             vsapi.call([mThis.base_url,'/api/location/districts'].join(''),p,null,LocationComponent.apiCluster).then(res=>{
               if(res.status_code===200){
                let rows = Sanitizer.sanitizeObject(res.data);
                let i =0, c;
                do{
                  c = rows[i];
                  if(!c) break;
                    let html = ['<tr data-id"',c.id,'">',
                    '<td class="col_district_name">',c.name,'</td>',
                    '<td class="col_city_name">',c.city_name,'</td>',
                    '<td>',c.country_name,'</td>',
                    '<td class="col_action">',
                    '<a href="#" class="_sttn_loc_edit_district" data-id="',c.id,'"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
                    '<a href="#" class="_sttn_loc_delete_district" data-id="',c.id,'"><i class="fa fa-times" style="color:red;font-size:1.4em"></i></a>',
                    '</td>',
                    '</tr>'].join('');
                    mThis.tblDistricts_body.append(html);
                  i++;
                }while(c);
                //div.addClass('effect-zoomin');
               }
             });
          };

          this.displayCommunes = function(district_id, isOnSelectChange=false){
                //let div = mThis.tblCommunes.parent();
                //div.removeClass('effect-slide-up');
                if(!isOnSelectChange){
                  mThis.elFilter_district.val(district_id).trigger('change');
                  return;
                }

                let p = {};
                if(!district_id) district_id = mThis.elFilter_district.val();
                p.district_id = district_id;
                mThis.tblCommunes_body.empty();
                vsapi.call([mThis.base_url,'/api/location/communes'].join(''),p,null,LocationComponent.apiCluster).then(res=>{
                  if(res.status_code===200){
                        let rows = Sanitizer.sanitizeObject(res.data);
                        let i =0, c;
                      do{
                        c = rows[i];
                        if(!c) break;
                          let html = ['<tr data-id"',c.id,'">',
                          '<td class="col_commune_name">',c.name,'</td>',
                          '<td class="col_district_name">',c.district,'</td>',
                          '<td class="col_city_name">',c.city,'</td>',
                          '<td class="col_action">',
                          '<a href="#" class="_sttn_loc_edit_commune" data-id="',c.id,'"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
                          '<a href="#" class="_sttn_loc_delete_commune" data-id="',c.id,'"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
                          '</td>',
                          '</tr>'].join('');
                          mThis.tblCommunes_body.append(html);
                        i++;
                      }while(c);
                      //div.addClass('effect-slide-up');
                  }

                });
          }

          this.editCommune = (id,name,district_id)=>{
            let option = {title:'Rename Commune','blankErrorMessage':'Location name cannot be empty','btnOKText':'Save Change','dataLabel':'Commune Name','defaultValue':name};
            InputBox1.show(option,function(d){
               let p = {'id':id,'name':d,'district_id':district_id};

               vsapi.call([mThis.base_url,'/api/location/commune/save'].join(''),p).then((res)=>{
                 if(res.status_code===200) {
                     mThis.displayCommunes(district_id);
                 } else cv_interact.error(res.error_message);
               });
            });
          }

          this.editDistrict = (id,name,city_id)=>{
          let option = {title:'Rename District','blankErrorMessage':'Location name cannot be empty','btnOKText':'Save Change','dataLabel':'District Name','defaultValue':name};
          InputBox1.show(option,function(d){
             let p = {'id':id,'name':d,'city_id':city_id};
             vsapi.call([mThis.base_url,'/api/location/district/save'].join(''),p).then((res)=>{
               if(res.status_code===200) {
                  mThis.displayDistricts(city_id);
               } else cv_interact.error(res.error_message);
             });
          });
          }

          this.editCity = (id,name,country_id)=>{
        let option = {title:'Rename City','blankErrorMessage':'Location name cannot be empty','btnOKText':'Save Change','dataLabel':'City Name','defaultValue':name};
        InputBox1.show(option,function(d){
           let p = {'id':id,'name':d,'country_id':country_id};
           vsapi.call([mThis.base_url,'/api/location/city/save'].join(''),p).then((res)=>{
             if(res.status_code===200) {
               mThis.displayCities(country_id);
             } else cv_interact.error(res.error_message);
           });
        });
          }
  //end::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
}
//end::ZoneTabview

const ZoneDialog1 = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {

        dialog = new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row">`,
                        `<div class="col-3">`,
                            `<div style="height:165px;" class="data-input border border-secondary rounded-3 justify-content-center align-items-center">`,
                                `<div name="div_flag_photo" data-field="flag" class="h-100"></div>`,
                            `</div>`,
                        `</div>`,
                        `<div class="col-9">`,
                            `<div class="row">`,
                                `<div class="form-group col-6">
                                    <label for="name" class="form-label text-primary-custom" vslang="titles.Name"></label>
                                    <span class="text-danger">*</span>
                                    <input name="name" class="form-control data-input" data-field="name" />
                                </div>`,
                                `<div class="form-group col-6">
                                    <label for="name_kh" class="form-label text-primary-custom" vslang="titles.Khmer Name"></label>
                                    <span class="text-danger">*</span>
                                    <input name="name_kh" class="form-control data-input" data-field="name_kh" />
                                </div>`,
                                `<div class="form-group col-6">
                                    <label for="nationality" class="form-label text-primary-custom" vslang="titles.Nationality"></label>
                                    <span class="text-danger">*</span>
                                    <input name="nationality" class="form-control data-input" data-field="nationality" />
                                </div>`,
                                `<div class="form-group col-6">
                                    <label for="lang_code" class="form-label text-primary-custom" vslang="titles.Language Code"></label>
                                    <span class="text-danger">*</span>
                                    <input name="lang_code" class="form-control data-input" data-field="lang_code" />
                                </div>`,

                            `</div>`,

                        `</div>`,

                        `<div class="form-group col-6">
                                <label for="currency_code" class="form-label text-primary-custom" vslang="titles.Currency Code"></label>
                                <span class="text-danger">*</span>
                                <input name="currency_code" class="form-control data-input" data-field="currency_code" />
                        </div>`,
                        `<div class="form-group col-6">
                                <label for="region" class="form-label text-primary-custom" vslang="titles.Region"></label>
                                <span class="text-danger">*</span>
                                <input name="region" class="form-control data-input" data-field="region" />
                        </div>`,

                    `</div>`,
                ].join("");
            },
            contentCreated: (me) => {

                const div_flag_photo = me.controls.div_flag_photo;

                me.flagImageBox = new ImageBox(div_flag_photo, {
                    defaultPhotoName:'default-staff',
                    containerClass: "emp-profile-container",
                    imgClass: "data-input",
                    dataset: { field: "flag" }, /** please set field: flag so that we can use for both Edit and Create easily */
                    //dataset: { field: "image_url" },
                    beforeDeleteImage: async ()=> {
                       if(me.dataOptions.id > 0){
                           const answer = await cv_interact.confirm('Are you sure to delete this Flag photo?', {title:'Delete Photo','context':'delete'});
                           if(answer){
                                me.deleteFlagPhoto(me.dataOptions.id);
                                return true;
                           } else return false;

                       }
                       return true;
                    },
                    //When user browse new image and loads it in
                    onOpenImage: (img)=>{
                        if(me.dataOptions.id > 0){
                          me.saveFlagPhoto(img, me.dataOptions.id);
                       }
                    },
                    // onImageLoaded: (img)=>{
                    //    if(me.dataOptions.id > 0){
                    //         const p = {"photo":me.flagImageBox.getImage(), "id" : me.dataOptions.id};
                    //         vsapi.call([main_view.base_url,'/bhr/employee/profile-photo/save'].join(''), p,false).then(res =>{
                    //             if(res.status_code == 200){
                    //             cv_interact.info('Profile photo was deleted!');
                    //             }else cv_interact.error(res.error_message);
                    //         });
                    //    }
                    // }
                });

                me.deleteFlagPhoto = (country_id)=>{
                    const p = {"id":country_id};
                    vsapi.call([main_view.base_url,'/api/location/country/delete-flag'].join(''),p,false,false).then(res =>{
                        if(res.status_code == 200){
                          me.flagImageBox.setImage(null);
                          cv_interact.info('Flag photo was deleted!');
                        }else cv_interact.error(res.error_message);
                    });
                };

                me.saveFlagPhoto = (flag, country_id)=>{
                    const p = {"flag": flag, "id" : country_id};
                    vsapi.call([main_view.base_url,'/api/location/country/save-flag'].join(''), p,false).then(res =>{
                        if(res.status_code == 200){
                          me.flagImageBox.setImage(res.data.image_url);
                          cv_interact.success('Flag photo was deleted!');
                        }else cv_interact.error(res.error_message);
                   });
                };


            },
            prepareFormOptions: {
                createTitle: "Create Country",
                modifyTitle: "Edit Country",
                targetProp: "country",
                api: {
                  endpoint: [
                    main_view.base_url,
                    "/api/location/options-country",
                  ].join(""),
                    params: (op) => {
                        return { id: 14 };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log(777, res);
                // },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
            configSelect: [

            ],
            // overrideMethod:{
            //     "setData":(me, data)=> {
            //         const id = me.dataOptions.id;
            //         const fields = me.fields;
            //         //fields to be reasOnly or disabled when Editing employee
            //         me.flagImageBox.setImage(data.image_url);
            //     },
            // },
            buttons: [
                {
                    label: '<span class="text-white">Cancel</span>',
                    cssClass: "btn btn-sm btn-danger",
                    click: (me, btn) => {
                        //Close with Cancel button
                        me.hide(false);
                    },
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-sm btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();
                        p.flag = me.flagImageBox
                            ? me.flagImageBox.getImage()
                            : '';
                        vsapi
                            .call(
                                [main_view.base_url, "/api/location/country/save"].join(""),
                                p,
                                btn,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],

            //onClose: (canceled) => {},
        });

        dialog.show(op);
    };

    return self;
})();

'use strict';

var LocationComponent = (() =>{
    const mThis = {};
    mThis.title_prop = 'Location Management';
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector('#_sttn_locationsComponent');
    mThis.apiCluster ='locapi';

    mThis.show = (options=null) => {  
      CountryListPanel.displayCountries();
      let tab_view_name ='cities';
      ZoneTabView.show(mThis.selected_country_id,tab_view_name,false);
      main_view.setContentView(mThis.self, mThis.title_prop);
    }
    mThis.hide = function(){
      mThis.self.hide();
    }
    return mThis;
})();
//end::LocationsComponent

//begin::CountryListPanel
 var CountryListPanel  = (() =>{
    const mThis = {};
    const parentContainer = LocationComponent.self;
    mThis.base_url = main_view.base_url;
    mThis.self = parentContainer.querySelector('#_sttn_loc_countryListpanel');
    mThis.tblCountries = parentContainer.querySelector('#_sttn_loc_tblCountries');
    mThis.tblCountries_body = mThis.tblCountries.querySelector('tbody');
    mThis.lnkNewCountry = parentContainer.querySelector('#_sttn_loc_lnkNewCountry');

    mThis.lnkNewCountry.onclick = e =>{
      e.preventDefault();
      const options = {
        title:'New Country','def':null, 'id':null,'onClose':()=>{
                  mThis.displayCountries();

          }
      };
      if (!AuthManager.allowed(407)) return;
      CountryDialog.show(options);

    };

    mThis.tblCountries_body.onclick = e => {
        e.preventDefault();


        let lnk = VSUtil.closestLimited(e.target, 'a._sttn_loc_edit_country');
        if (lnk) {
            const op = {
            id: lnk.dataset.id,
            onClose: () => {
                cv_interact.success('Country Updated Successfully');
                mThis.displayCountries();
            },
            };
            if (!AuthManager.allowed(408)) return;

            CountryDialog.show(op);
            return;
        }

        lnk = VSUtil.closestLimited(e.target, 'a._sttn_loc_delete_country');
        if (lnk) {
            const p = { id: lnk.dataset.id };
            if (!AuthManager.allowed(409)) return;
            if (!p.id) p.id = 0;
            cv_interact.confirm('Delete this country?', { title: 'Delete Country', context: 'delete' }, function (e) {
            if (e) {
                vsapi.call([mThis.base_url, '/api/location/country/delete'].join(''), p).then((res) => {
                if (res.status_code === 200) {
                    mThis.displayCountries();
                } else cv_interact.error(res.error_message);
                });
            }
            });
            return;
        }

        let tr = VSUtil.closestLimited(e.target, 'tr');
        if (tr) {
            mThis.country_id = tr.dataset.id;
            if (mThis.prev_selected_row) mThis.prev_selected_row.classList.remove('row-selected');

            tr.classList.toggle('row-selected');
            if (tr.classList.contains('row-selected')) {
            mThis.selected_country_id = tr.dataset.id;
            mThis.selected_country_name = tr.dataset.name;
            mThis.prev_selected_row = tr;
            }
            ZoneTabView.show(mThis.selected_country_id, null, false);
            ZoneTabView.loadComboItems_zone(mThis.selected_country_id, 'city', null);

            return;
        }
        };


    mThis.displayCountries = function(){
      mThis.selected_country_name = null;
      mThis.selected_country_id = null;

      mThis.tblCountries_body.innerHTML = '';
      vsapi.call([mThis.base_url,'/api/location/countries'].join(''),null,false).then((res)=>{
         if(res.status_code == 200){
            let rows = res.data;
            let i=0,c = null;
            let html = ['<tr class="color-text text-yp-custom bg-primary-custom">',
                        `<th>Flag</th>`,
                        `<th>Country </th>`,
                        `<th>Currency Code</th>`,
                        `<th>Action</th>`,
                      '<tr/>'].join('');
                        mThis.tblCountries_body.insertAdjacentHTML('beforeend',html);
                        do {
                            c = rows[i];
                            if (!c) break;
                            let html2 = [
                                '<tr data-name="', c.name, '" data-id="', c.id, '" id="country_row">',
                                '<td><img class="image-student-tbl border border-primary" src="', c.image_url, '" alt="" ',
                                'style="width: 80px; height: 40px; margin-right: 10px; border-radius: 0;"/></td>',
                                '<td class="col_country_name text-uppercase">' + c.name_kh + '<br>' + c.name + '</td>',
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

                            mThis.tblCountries_body.insertAdjacentHTML('beforeend',html2);
                            i++;
                        } while (c);
         }
      });
    }

    return mThis;
 })();
//end::CountryListpanel

//begin::ZoneTabView
var ZoneTabView =  ( () =>{
  const mThis = {};
  const parentContainer = LocationComponent.self;
  mThis.self = parentContainer.querySelector('#_sttn_loc_subLocationTabView');
  mThis.base_url = main_view.base_url;

  mThis.cur_view = 'cities';
  mThis.tabHeaders = mThis.self.querySelector('div.tab-header');
 mThis.tabHeaders.onclick = e => {
  e.preventDefault();

  const lnk = VSUtil.closestLimited(e.target, 'a.tab-button');
  if (!lnk) return;

  // Toggle tab-button active state
  lnk.parentElement.querySelectorAll('a.tab-button').forEach(btn => {
    if (btn === lnk) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const view_name = lnk.dataset.viewname?.toLowerCase();
  mThis.show(mThis.country_id, view_name, true);
};


  //Load filter zone, for districts and commune and village
  mThis.loadComboItems_zone= (parent_zone_id,zone_name,def)=>{
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
      p.commune_id = parent_zone_id;
      method_name = 'location/options-village';
    }

     vsapi.call([mThis.base_url,'/api/',method_name].join(''),p,null,LocationComponent.apiCluster).then((res)=>{
        if (res.status_code===200){
              let rows = res.data;

              if (zone_name ==='city')
                {
                  VSUtil.setComboItems(mThis.elFilter_city,rows,'id','name','','(Select a city)',def.city_id);
                  VSUtil.setComboItems(mThis.elFilter_city_district,rows,'id','name','','(Select a city)',def.city_id);
                  VSUtil.setComboItems(mThis.elFilter_city_village,rows,'id','name','','(Select a city)',def.city_id);
                }
              else if (zone_name ==='district')
              {
                VSUtil.setComboItems(mThis.elFilter_district,rows,'id','name','','(Select a district)',def.district_id);
                VSUtil.setComboItems(mThis.elFilter_district_village,rows,'id','name','','(Select a district)',def.district_id);

              } else if (zone_name ==='commune')
              {
                VSUtil.setComboItems(mThis.elFilter_commune,rows,'id','name','','(Select a commune)',def.commune_id);
              }
              else if (zone_name ==='village')
              {
                VSUtil.setComboItems(mThis.elFilter_village,rows,'id','name','','(Select a village)',def.village_id);
              }

        }

     });
  }

 mThis.show = function(country_id, view_name, tab_button_clicked = false) {
    mThis.country_id = country_id;
    view_name = (view_name || mThis.cur_view || '').toLowerCase();

    mThis.tabBody = mThis.tabBody || mThis.self.querySelector('div.tab-body');

    // Loop through tab panels
    mThis.tabBody.querySelectorAll('div.tab-panel').forEach(tabPanel => {
        const this_view_name = (tabPanel.dataset.viewname || '').toLowerCase();

        if (view_name === this_view_name) {
            mThis.cur_view = view_name;
            tabPanel.style.display = 'block';

            // Hide siblings
            Array.from(tabPanel.parentElement.children).forEach(sibling => {
                if (sibling !== tabPanel) sibling.style.display = 'none';
            });

            // Display content depending on view
            if (view_name === 'cities') {
                mThis.displayCities(CountryListPanel.selected_country_id);
            } else if (view_name === 'districts') {
                mThis.elFilter_city.dispatchEvent(new Event('change'));
            } else if (view_name === 'communes') {
                mThis.elFilter_district.dispatchEvent(new Event('change'));
            }
            else if (view_name === 'villages') {
                mThis.elFilter_commune.dispatchEvent(new Event('change'));
            }

            return;
        }
    });

    // Handle active tab button (if not triggered by user click)
    if (!tab_button_clicked) {
        mThis.tabHeaders = mThis.tabHeaders || mThis.self.querySelector('div.tab-header');

        mThis.self.querySelectorAll('a.tab-button').forEach(tabButton => {
            const this_view_name = (tabButton.dataset.viewname || '').toLowerCase();

            if (view_name === this_view_name) {
                tabButton.classList.add('active');

                // Remove 'active' from sibling buttons
                Array.from(tabButton.parentElement.children).forEach(sibling => {
                    if (sibling !== tabButton) sibling.classList.remove('active');
                });
            }
        });
    }
};


  //begin::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
         //begin::define specific elements, tables within this ZoneTabView tasks
           const div = LocationComponent.self;
           const $ = sel => div.querySelector(sel);
           
            Object.assign(mThis, {
                    tblCities: $("#_sttn_loc_tblCities"),
                    tblDistricts: $("#_sttn_loc_tblDistricts"),
                    tblCommunes: $("#_sttn_tblCommunes"),
                    tblVillages: $("#_sttn_loc_tblVillages"),

                    tblCities_body: $("#_sttn_loc_tblCities_body"),
                    tblDistricts_body: $("#_sttn_loc_tblDistricts_body"),
                    tblCommunes_body: $("#_sttn_loc_tblCommunes_body"),
                    tblVillages_body: $("#_sttn_loc_tblVillages_body"),

                    lnkAddCity: $("#_sttn_loc_lnkNewCity"),
                    lnkAddDistrict: $("#_sttn_loc_lnkNewDistrict"),
                    lnkAddCommune: $("#_sttn_loc_lnkNewCommune"),
                    lnkAddVillage: $("#_sttn_loc_lnkNewVillage"),

                    // Filters
                    elFilter_city: $("#_sttn_loc_filter_city"),
                    elFilter_city_district: $("#_sttn_loc_filter_city_district"),
                    elFilter_district: $("#_sttn_loc_filter_district"),
                    elFilter_commune: $("#_sttn_loc_filter_commune"),
                    elFilter_village: $("#_sttn_loc_filter_village"),
                    elFilter_city_village: $("#_sttn_loc_filter_city_village"),
                    elFilter_district_village: $("#_sttn_loc_filter_district_village"),
            });


            mThis.contry_id = null;

             //link to Add Accessible module
            mThis.lnkAddCity.onclick = e =>{
                e.preventDefault();
                const op = {
                    country_id: CountryListPanel.selected_country_id,
                    zone_type: 'city',
                    onClose: function(){
                        mThis.displayCities(LocationComponent.country_id);
                    }
                };

                ZoneDialog.show(op);
            };

            mThis.elFilter_city.onchange = e =>{
                mThis.displayDistricts(e.target.value,true);
            };

            mThis.elFilter_district.onchange = e =>{
                mThis.displayCommunes(e.target.value,true);
            };

            mThis.elFilter_commune.onchange = e =>{
                mThis.displayVillages(e.target.value,true);
            };

              //On CommuneListPanel: User select Filter City, then displays list of related districts, and when user select District => display List of communes
            mThis.elFilter_city_district.onchange = e =>{
                const def = {'district_id':mThis.elFilter_district.value};
                mThis.loadComboItems_zone(e.target.value,'district',def);
            };

            mThis.elFilter_city_village.onchange = e =>{
                const def = {'district_id':mThis.elFilter_district_village.value};
                mThis.loadComboItems_zone(e.target.value,'district',def);
            };

            mThis.elFilter_district_village.onchange = e =>{
                const def = {'commune_id':mThis.elFilter_commune.value};
                mThis.loadComboItems_zone(e.target.value,'commune',def);
            };


            mThis.lnkAddDistrict.onclick = e =>{
                e.preventDefault();
                const op = {
                    city_id: mThis.elFilter_city.value,
                    zone_type: 'district',
                    onClose: function(){
                        mThis.displayDistricts(mThis.elFilter_city.value);
                    }
                }

                ZoneDialog.show(op);

            };

            mThis.lnkAddCommune.onclick = e =>{
              e.preventDefault();
              const op = {
                  district_id: mThis.elFilter_district.value,
                  zone_type: 'commune',
                  onClose: function(){
                      mThis.displayCommunes(mThis.elFilter_district.value);
                  }
              }

              ZoneDialog.show(op);

            };

            mThis.lnkAddVillage.onclick = e =>{
              e.preventDefault();
              const op = {
                  commune_id: mThis.elFilter_commune.value,
                  zone_type: 'village',
                  onClose: function(){
                      mThis.displayVillages(mThis.elFilter_commune.value);
                  }
              }

              ZoneDialog.show(op);

            };

           mThis.tblDistricts_body.onclick = function(e){
              e.preventDefault();

              //** If User clicks on Delete District **/
              let lnk = VSUtil.closestLimited(e.target, 'a._sttn_loc_delete_district');
                if(lnk){
                    const p = {'district_id':lnk.dataset.id};
                    if(!p.district_id) p.district_id=0;
                    //p.id = p.city_id;
                    cv_interact.confirm('Delete this distrinct?',{title:'Delete District',context:'delete'},function(e){
                      if(e){
                        vsapi.call([mThis.base_url,'/api/location/district/delete'].join(''),p,false).then((res)=>{
                          if(res.status_code===200){
                            mThis.displayDistricts(mThis.elFilter_city.value);
                          } else cv_interact.error(res.error_message);
                        });
                      }
                });
                return;
              }


              //** If User clicks on Edit District **/
              lnk = VSUtil.closestLimited(e.target, 'a._sttn_loc_edit_district');
                if(lnk){
                    const op = {
                        id: lnk.dataset.id,
                        city_id: lnk.dataset.cityid,
                        zone_type: 'district',
                        onClose: function(){
                            mThis.displayDistricts(op.city_id);
                        }
                    };
                    ZoneDialog.show(op);
                    return;
                }
          };

          mThis.tblCities_body.onclick  = function(e){
              e.preventDefault();

               /** If user clicks on Delete City link **/
               let lnk = VSUtil.closestLimited(e.target,'a._sttn_loc_delete_city');
               if(lnk){
                      const p = {'city_id':lnk.dataset.cityid};
                        if(!p.city_id) p.city_id=0;
                        //p.id = p.city_id;
                        cv_interact.confirm('Delete this city?',{title:'Delete City',context:'delete'},function(e){
                          if(e){
                            vsapi.call([mThis.base_url,'/api/location/city/delete'].join(''),p,false).then((res)=>{
                              if(res.status_code == 200){
                                  mThis.displayCities(LocationComponent.country_id);
                              } else cv_interact.error(res.error_message);
                            });
                          }
                        });

                    return;
                }

              /** If user clicks on Edit City link **/
             lnk = VSUtil.closestLimited(e.target, 'a._sttn_loc_edit_city');
                if (lnk){
                    const op = {
                        id: lnk.dataset.cityid,
                        country_id: lnk.dataset.countryid,
                        zone_type : 'city',
                        onClose: () => {
                            mThis.displayCities(op.country_id);
                        }
                    };
                    ZoneDialog.show(op);
                    return;
                }


        };

        mThis.tblCommunes_body.onclick = function(e){
              e.preventDefault();

              /** User clicks on Edit Commune **/
              let lnk = VSUtil.closestLimited(e.target,'a._sttn_loc_edit_commune');
              if(lnk){
                    const op = {
                        id: lnk.dataset.id,
                        district_id: lnk.dataset.districtid,
                        zone_type : 'commune',
                        onClose: () => {
                            mThis.displayCommunes(op.district_id);
                        }
                    };
                    ZoneDialog.show(op);
                    return;
              }

              /** User clicks on Delete Commune **/
              lnk = VSUtil.closestLimited(e.target,'a._sttn_loc_delete_commune');
                if(lnk){
                        const p = {'id': lnk.dataset.id};
                        if(!p.id) p.id=0;
                        //p.id = p.city_id;
                        cv_interact.confirm('Delete this commune?',{'title':'Delete Commune',context:'delete'},function(e){
                            if(e){
                            vsapi.call([mThis.base_url,'/api/location/commune/delete'].join(''),p,false,false).then(res=>{
                                if(res.status_code===200){
                                mThis.displayCommunes(mThis.elFilter_district.value);
                                } else cv_interact.error(res.error_message);
                            });
                            }
                        });
                   return;
                }

        };

        mThis.tblVillages_body.onclick = function(e){
              e.preventDefault();

              /** User clicks on Edit Village **/
              let lnk = VSUtil.closestLimited(e.target,'a._sttn_loc_edit_village');
              if(lnk){
                    const op = {
                        id: lnk.dataset.id,
                        commune_id: lnk.dataset.communeid,
                        zone_type : 'village',
                        onClose: () => {
                            mThis.displayVillages(op.commune_id);
                        }
                    };
                    ZoneDialog.show(op);

                    return;
              }

              /** User clicks on Delete Village **/
              lnk = VSUtil.closestLimited(e.target,'a._sttn_loc_delete_village');
                if(lnk){
                        const p = {'id': lnk.dataset.id};
                        if(!p.id) p.id=0;
                        cv_interact.confirm('Delete this village?',{'title':'Delete Village',context:'delete'},function(e){
                            if(e){
                            vsapi.call([mThis.base_url,'/api/location/village/delete'].join(''),p,false,false).then(res=>{
                                if(res.status_code===200){
                                mThis.displayVillages(mThis.elFilter_commune.value);
                                } else cv_interact.error(res.error_message);
                            });
                            }
                        });
                   return;
                }
        };
         //END::define specific elements

          mThis.displayCities = function(country_id) {

                const p = {};
                p.country_id = country_id;
                mThis.tblCities_body.innerHTML = '';

                vsapi.call([mThis.base_url,'/api/location/cities'].join(''),p,null,LocationComponent.apiCluster).then((res)=>{
                    if (res.status_code===200){
                        const rows = res.data;
                        let i=0, c = null, html = '';
                        do{
                            c = rows[i];
                            if(!c) break;
                                html = [html,'<tr data-cityname="',c.name,'" data-cityid="',c.id,'">',
                                '<td><i class="icon-city-default"></i></td>',
                                '<td class="col_city_name text-yp-custom">',c.name,'</td>',
                                '<td class="col_city_name text-yp-custom">',c.name_kh,'</td>',
                                '<td class="col_action">',
                                '<a href="#" class="_sttn_loc_edit_city" data-cityid="',c.id,'" data-countryid="',c.country_id,'"><i class="fa fa-edit text-warning" style="font-size:1.2em"></i></a>&nbsp;&nbsp;',
                                '<a href="#" class="_sttn_loc_delete_city" data-cityid="',c.id,'"><i class="fa-regular fa-trash-can text-danger" style="font-size:1.2em"></i></a>',
                                '</td>',
                                '</tr>'].join('');
                            i++;
                        }while(c);
                        mThis.tblCities_body.innerHTML = html;
                    }

                });

          }

          mThis.displayDistricts = function(city_id,isOnSelectChange=false) {
             if(!isOnSelectChange){
               mThis.elFilter_city.value =  city_id;
               mThis.elFilter_city.dispatchEvent(new Event('change'));
               return;
             }

             const p = {};
             if(!city_id) {
                city_id = mThis.elFilter_city_district.value;
             }
             p.city_id = city_id;
             mThis.tblDistricts_body.innerHTML = '';

             vsapi.call([mThis.base_url,'/api/location/districts'].join(''),p,false,LocationComponent.apiCluster).then(res=>{
               if(res.status_code===200){
                const rows = res.data;
                let i =0, c = null, html = '';
                do{
                  c = rows[i];
                  if(!c) break;
                    html = [html,'<tr data-id"',c.id,'">',
                    '<td class="col_district_name">',c.name,'</td>',
                    '<td class="col_district_name">',c.name_kh,'</td>',
                    '<td class="col_city_name">',c.city_name,'</td>',
                    '<td>',c.country_name,'</td>',
                    '<td class="col_action">',
                    '<a href="#" class="_sttn_loc_edit_district" data-id="',c.id,'" data-cityid="',c.city_id,'"><i class="fa fa-edit text-warning" style="font-size:1.2em"></i></a>&nbsp;&nbsp;',
                    '<a href="#" class="_sttn_loc_delete_district" data-id="',c.id,'"><i class="fa-regular fa-trash-can text-danger" style="font-size:1.2em"></i></a>',
                    '</td>',
                    '</tr>'].join('');

                  i++;
                }while(c);
                 mThis.tblDistricts_body.innerHTML = html;
               }
             });
          };

          mThis.displayCommunes = function(district_id, isOnSelectChange=false){

                if(!isOnSelectChange){
                  mThis.elFilter_district.value =  district_id;
                   mThis.elFilter_district.dispatchEvent(new Event('change'));
                  return;
                }

                const p = {};
                if(!district_id) district_id = mThis.elFilter_district.value;
                p.district_id = district_id;
                mThis.tblCommunes_body.innerHTML = '';
                vsapi.call([mThis.base_url,'/api/location/communes'].join(''),p,false,LocationComponent.apiCluster).then(res=>{
                  if(res.status_code===200){
                        let rows = res.data;

                        let i =0, c = null, html = '';
                      do{
                        c = rows[i];
                        if(!c) break;
                           html = [html,'<tr data-id"',c.id,'">',
                          '<td class="col_commune_name">',c.name,'</td>',
                          '<td class="col_commune_name">',c.name_kh,'</td>',
                          '<td class="col_district_name">',c.district,'</td>',
                          '<td class="col_city_name">',c.city,'</td>',
                          '<td class="col_action">',
                          '<a href="#" class="_sttn_loc_edit_commune" data-id="',c.id,'" data-districtid="',c.district_id,'"><i class="fa fa-edit text-warning" style="font-size:1.2em"></i></a>&nbsp;&nbsp;',
                          '<a href="#" class="_sttn_loc_delete_commune" data-id="',c.id,'"><i class="fa-regular fa-trash-can text-danger" style="font-size:1.2em"></i></a>',
                          '</td>',
                          '</tr>'].join('');

                        i++;
                      }while(c);
                       mThis.tblCommunes_body.innerHTML = html;
                  }

                });
          }

        mThis.displayVillages = function(commune_id, isOnSelectChange=false){

                if(!isOnSelectChange){
                  mThis.elFilter_commune.value =  commune_id;
                   mThis.elFilter_commune.dispatchEvent(new Event('change'));
                  return;
                }

                const p = {};
                if(!commune_id) commune_id = mThis.elFilter_commune.value;
                p.commune_id = commune_id;
                mThis.tblVillages_body.innerHTML = '';

                vsapi.call([mThis.base_url,'/api/location/villages'].join(''),p,false,LocationComponent.apiCluster).then(res=>{
                  if(res.status_code===200){
                        let rows = res.data;

                        let i =0, c = null, html = '';
                      do{
                        c = rows[i];
                        if(!c) break;
                           html = [html,'<tr data-id"',c.id,'">',
                          '<td class="col_village_name">',c.name,'</td>',
                          '<td class="col_village_name">',c.name_kh,'</td>',
                          '<td class="col_commune_name">',c.commune,'</td>',
                          '<td class="col_district_name">',c.district,'</td>',
                        //   '<td class="col_city_name">',c.city,'</td>',
                          '<td class="col_action">',
                          '<a href="#" class="_sttn_loc_edit_village" data-id="',c.id,'" data-communeid="',c.commune_id,'"><i class="fa fa-edit text-warning" style="font-size:1.2em"></i></a>&nbsp;&nbsp;',
                          '<a href="#" class="_sttn_loc_delete_village" data-id="',c.id,'"><i class="fa-regular fa-trash-can text-danger" style="font-size:1.2em"></i></a>',
                          '</td>',
                          '</tr>'].join('');

                        i++;
                      }while(c);
                       mThis.tblVillages_body.innerHTML = html;
                  }

                });
        }


   return mThis;
})();
//end::ZoneTabview

const CountryDialog = (() => {
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
                                `<div name="div_flag_photo" data-field="flag" class="h-75"></div>`,
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
                    dataset: { field: "flag" },
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
                  endpoint: (me, op)=>{
                     //check if zoneType is city or district then change the endpoint accordingly
                     return [main_view.base_url, "/api/location/options-country",].join("");
                  },
                    params: (op) => {
                        return { id: 14 };
                    },
                },

            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);

                if (data && data.country.image_url && me.flagImageBox) {
                    me.flagImageBox.setImage(data.country.image_url);
                }
            },

            configSelect: [

            ],
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
                        p.flag = me.flagImageBox? me.flagImageBox.getImage(): '';
                        vsapi.call([main_view.base_url, "/api/location/country/save"].join(""),p,btn,false,false).then((res) => {
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

const ZoneDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {

        dialog = new GeneralDialog({
            cssClass: "modal-md modal-content-vs-dialog",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
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

                    `</div>`,
                ].join("");
            },
            contentCreated: (me) => {

            },
            prepareFormOptions: {
                createTitle: "Create",
                modifyTitle: "Edit",
                targetProp: "zone",
                api: {
                  endpoint: (me, op)=>{
                    return [main_view.base_url, `/api/location/${op.zone_type}/from-option`,].join("");
                  },
                    params: (op) => {
                        return { id: op.id };
                    },
                },

            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
            configSelect: [

            ],

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
                        const op = me.dataOptions;

                        if(op.zone_type == 'city'){
                            p.country_id = me.dataOptions.country_id;
                        }
                        else if(op.zone_type == 'district'){
                            p.city_id = me.dataOptions.city_id;
                        }
                        else if (op.zone_type == 'commune') {
                            p.district_id = me.dataOptions.district_id;
                        }
                        else if (op.zone_type == 'village') {
                            p.commune_id = me.dataOptions.commune_id;
                        }

                        vsapi.call([main_view.base_url, `/api/location/${op.zone_type}/save`].join(""),p,btn,false,false).then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    me.dataOptions.onClose();
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

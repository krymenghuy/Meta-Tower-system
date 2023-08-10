'use strict';
var LocationComponent = new function () {
  let mThis = this;
  this.title_prop = 'Location Management';
  this.elScreenTitle = $('#screen_title');

  this.init = function(){
    mThis.base_url = $('#__base_url').val();
    mThis.title = 'Locations';
    mThis.self = $('#_sttn_locationsComponent');
  }

  this.show = function(option){
    CountryListPanel.displayCountries();
    let tab_view_name = 'cities';
    ZoneTabView.show(mThis.selected_country_id, tab_view_name, false);
    main_view.setTitle(mThis.title_prop);
    let x = mThis.self.siblings(':visible');
    x.fadeOut('fast', function () {
      mThis.self.hide().fadeIn(300);
    });
  }
  this.hide = function () {
    mThis.self.hide();
  }
}

let CountryListPanel = new function () {
  let mThis = this;
  this.base_url = $('#__base_url').val();
  this.self = $('#_sttn_loc_countryListpanel');
  this.tblCountries = document.querySelector('#_sttn_loc_tblCountries');
  this.tblCountries_body = this.tblCountries.querySelector('#_sttn_loc_tblCountries_body');
  this.lnkNewCountry = $('#_sttn_loc_lnkNewCountry');

  mThis.lnkNewCountry.on('click', function (e) {
    e.preventDefault();
    let op = {
      "id": "",
      "onClose": (countries) => {
        mThis.renderCountries(countries);
      }
    };

    CountryDialog.show(op);
    return;
  });

  mThis.tblCountries_body.addEventListener('click', function (e) {
    e.preventDefault();
    let c = e.target.closest('.btn-delete-country');
    if(c){
      const id = c.dataset.countryid;
      let p = { 'id': id };
      if (!p.id) p.id = 0;
      cv_interact.confirm('Delete this country?', { title: 'Delete Country', 'context': 'delete' }, function(e){
        if(e){
          window.vsapi.call([mThis.base_url, '/api/location/country/delete'].join(''), p).then((res) => {
            if(res.status_code === 200){
              mThis.displayCountries();
            }
            else
              cv_interact.error(res.error_message);
          });
        }
      });
    }
    else{
      c = e.target.closest('.btn-edit-country');
      if(c){
        const id = c.dataset.countryid;
        let op = {
          'id': id,
          'onClose': (countries) => {
            mThis.renderCountries(countries);
          }
        };
        CountryDialog.show(op);
      }
    }
  });

  $(mThis.tblCountries).on('click', 'tbody>tr', function (e) {
    if (mThis.prev_selected_row) mThis.prev_selected_row.removeClass('selected-animate');
    $(this).toggleClass('country-selected').siblings().removeClass('country-selected');
    if($(this).hasClass('country-selected')){
      mThis.selected_country_id = $(this).data('countryid');
      mThis.selected_country_name = $(this).data('countryname');
      mThis.prev_selected_row = $(this);
    }
    ZoneTabView.show(mThis.selected_country_id, null, false);
    ZoneTabView.loadComboItems_zone(mThis.selected_country_id, 'city', null);
  });

  this.renderCountries = (cs = null) => {
    mThis.selected_country_id = null;
    mThis.selected_country_name = null;

    mThis.tblCountries_body.innerHTML = null;
    (cs || []).map(c => {
      let tr = document.createElement('tr');
      tr.dataset.countryname = c.name;
      tr.dataset.countryid = c.id;
      let action_html = ['<div class="d-flex flex-row"><a data-countryid="', c.id, '" href="javascript:void(0)" class="btn-edit-country"><i class="fa fa-edit text-secondary"></i></a><a href="javascript:void(0)" data-countryid="', c.id, '" class="btn-delete-country"><i class="fa fa-trash text-secondary"></i></a></div>'].join('');
      c.nationality = c.nationality ? c.nationality : c.name;
      tr.innerHTML = ['<td class="flag"><img class="country-flag" src="', c.flag, '" alt="Flag"></td><td class="col_country_name country">', c.name, '</td><td class="nationality">', c.nationality, '</td><td class="action">', action_html, '</td>'].join('');
      mThis.tblCountries_body.appendChild(tr);
    });
  }

  this.displayCountries = function(){
    mThis.selected_country_id = null;
    mThis.selected_country_name = null;

    mThis.tblCountries_body.innerHTML = null;
    window.vsapi.call([mThis.base_url, '/api/location/countries'].join(''), null).then((res) => {
      if(res.status_code === 200){
        let countries = StringSanitizer.sanitizeObject(res.data, null, ['flag', 'image', 'image_url']);
        mThis.renderCountries(countries);
      }
    });
  }
}

var ZoneTabView = new function () {
  let mThis = this;
  this.self = $('#_sttn_loc_subLocationTabView');
  this.base_url = $('#__base_url').val();

  this.cur_view = 'cities';

  this.self.on('click', 'div.tab-header>a.tab-button', function (e) {
    e.preventDefault();
    $(this).addClass('active').siblings().removeClass('active');
    let view_name = $(this).data('viewname').toLowerCase();
    mThis.show(mThis.country_id, view_name, true);
  });

  this.loadComboItems_zone = (parent_zone_id, zone_name, def) => {
    if (!def) def = {};
    let method_name = 'location/options-city';
    let p = {};
    if(zone_name === 'city'){
      p.country_id = parent_zone_id;
      method_name = 'location/options-city';
    }
    else if(zone_name === 'district'){
      p.city_id = parent_zone_id;
      method_name = 'location/options-district';
    }
    else if(zone_name === 'commune'){
      p.district_id = parent_zone_id;
      method_name = 'location/options-commune';
    }
    else if(zone_name == 'village'){
      p.district_id = parent_zone_id;
      method_name = 'location/options-village';
    }

    window.vsapi.call([mThis.base_url, '/api/', method_name].join(''), p).then((res) => {
      if(res.status_code === 200){
        let rows = StringSanitizer.sanitizeObject(res.data);

        if (zone_name === 'city') {
          VSUtil.setComboItems(mThis.elFilter_city, rows, 'id', 'city', true, '(Select a city)', def.city_id);
          VSUtil.setComboItems(mThis.elFilter_city_district, rows, 'id', 'city', true, '(Select a city)', def.city_id);
        }
        else if(zone_name === 'district'){
          VSUtil.setComboItems(mThis.elFilter_district, rows, 'id', 'district', true, '(Select a district)', def.district_id);
        }
        else if (zone_name === 'commune'){
          VSUtil.setComboItems(mThis.elFilter_commune, rows, 'id', 'commume', true, '(Select a commune)', def.commune_id);
        }
      }
    });
  }

  this.show = function (country_id, view_name, tab_button_clicked = false) {
    mThis.country_id = country_id;
    if (!view_name) view_name = mThis.cur_view;
    view_name = (view_name + '').toLowerCase();
    mThis.self.find('div.tab-body>div.tab-panel').each(function () {
      let this_view_name = ($(this).data('viewname') + '').toLowerCase();
      if (view_name == this_view_name) {
        mThis.cur_view = view_name;
        $(this).show().siblings().hide();
        if(view_name === 'cities'){
          mThis.displayCities(CountryListPanel.selected_country_id);
        }
        else if(view_name == 'districts'){
          mThis.elFilter_city.trigger('change');
        }
        else if (view_name === 'communes'){
          mThis.elFilter_district.trigger('change');
        }
        return;
      }
    });

    if(!tab_button_clicked){
      mThis.self.find('div.tab-header>a.tab-button').each(function(){
        let this_view_name = ($(this).data('viewname') + '').toLowerCase();
        if(view_name === this_view_name){
          $(this).addClass('active').siblings().removeClass('active');
        }
      });
    }
  }

  this.tblCities = $('#_sttn_loc_tblCities');
  this.tblCities_body = $('#_sttn_loc_tblCities_body');
  this.tblDistricts = $('#_sttn_loc_tblDistricts');
  this.tblDistricts_body = $('#_sttn_loc_tblDistricts_body');

  this.lnkAddCity = $('#_sttn_loc_lnkNewCity');
  this.lnkAddDistrict = $('#_sttn_loc_lnkNewDistrict');
  this.lnkAddCommune = $('#_sttn_loc_lnkNewCommune');

  this.tblCommunes_body = $('#_sttn_loc_tblCommunes_body');
  this.tblCommunes = $('#_sttn_tblCommunes');
  this.elFilter_city = $('#_sttn_loc_filter_city');
  this.elFilter_city_district = $('#_sttn_loc_filter_city_district');
  this.elFilter_district = $('#_sttn_loc_filter_district')
  this.elFilter_commune = $('#_sttn_loc_filter_commune');

  this.lnkAddCity.on('click', function (e) {
    e.preventDefault();
    let x = $(this);
    let id = x.data('id');
    if(!CountryListPanel.selected_country_id){
      cv_interact.error('No country selected!');
      return;
    }
    let option = { 'title': ['New City/Province in ', CountryListPanel.selected_country_name].join(''), 'dataLabel': 'Enter City name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'City name cannot be empty' };
    InputBox1.show(option,function(d){
      if(d){
        let p = { 'id': id, 'country_id': CountryListPanel.selected_country_id, 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/location/city/save'].join(''), p).then((res) => {
          if(res.status_code === 200){
            mThis.displayCities(CountryListPanel.selected_country_id);
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  this.elFilter_city.on('change',function(){
    mThis.displayDistricts($(this).val(), true);
  });

  this.elFilter_city_district.off('change').on('change',function(){
    let def = { 'district_id': mThis.elFilter_district.val() };
    mThis.loadComboItems_zone($(this).val(), 'district', def);
  });

  this.elFilter_district.on('change', function(){
    mThis.displayCommunes($(this).val(), true);
  });

  this.lnkAddDistrict.on('click', function(e){
    e.preventDefault();
    if(!mThis.elFilter_city.val()){
      cv_interact.error('No city selected!');
      return;
    }
    let city_name = mThis.elFilter_city.find('option:selected').text();
    let option = { 'title': ['New District in ', city_name].join(''), 'dataLabel': 'Enter District name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'District name cannot be empty' };
    InputBox1.show(option,function(d){
      if(d){
        let p = { 'city_id': mThis.elFilter_city.val(), 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/location/district/save'].join(''), p, null, false).then((res) => {
          if(res.status_code === 200){
            mThis.elFilter_city.trigger('change');
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  this.lnkAddCommune.on('click', function(e){
    e.preventDefault();
    if(!CountryListPanel.selected_country_id){
      cv_interact.error('No country selected!');
      return;
    }
    if(!mThis.elFilter_district.val() || mThis.elFilter_district.val() <= 0){
      cv_interact.error('No district selected!');
      return;
    }
    let option = { 'title': 'New Commune', 'dataLabel': 'Enter Commune name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'Commune name cannot be empty' };
    InputBox1.show(option, function(d){
      if(d){
        let p = { 'district_id': mThis.elFilter_district.val(), 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/location/commune/save'].join(''), p).then((res) => {
          if(res.status_code === 200){
            mThis.displayCommunes(p.district_id);
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCities_body.on('click', 'a._sttn_loc_delete_city', function (e) {
    e.preventDefault();
    let p = { 'city_id': $(this).data('cityid') };
    if (!p.city_id) p.city_id = 0;
    cv_interact.confirm('Delete this city?', { title: 'Delete City', context: 'delete' }, function(e){
      if(e){
        window.vsapi.call([mThis.base_url, '/api/location/city/delete'].join(''), p).then((res) => {
          if(res.status_code === 200){
            mThis.displayCities(mThis.country_id);
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCommunes_body.on('click', 'a._sttn_loc_delete_commune', function(e){
    e.preventDefault();
    let p = { 'id': $(this).data('id') };
    if (!p.id) p.id = 0;
    cv_interact.confirm('Delete this commune?', { 'title': 'Delete Commune', context: 'delete' }, function(e){
      if(e){
        window.vsapi.call([mThis.base_url, '/api/location/commune/delete'].join(''), p, null, false).then(res => {
          if(res.status_code === 200){
            mThis.displayCommunes(mThis.elFilter_district.val());
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblDistricts_body.on('click', 'a._sttn_loc_delete_district', function (e) {
    e.preventDefault();
    let p = { 'district_id': $(this).data('id') };
    if (!p.district_id) p.district_id = 0;
    cv_interact.confirm('Delete this distrinct?', { title: 'Delete District', context: 'delete' }, function(e){
      if(e){
        window.vsapi.call([mThis.base_url, '/api/location/district/delete'].join(''), p).then((res) => {
          if(res.status_code === 200){
            mThis.displayDistricts(mThis.elFilter_city.val());
          }
          else
            cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCities_body.on('click', 'a._sttn_loc_edit_city', function (e) {
    e.preventDefault();
    let x = $(this);
    let city_id = $(this).data('cityid');
    let city_name = x.closest('tr').find('td.col_city_name').text();
    let country_id = CountryListPanel.selected_country_id;
    if(!country_id){
      cv_interact.warning('No country selected!');
      return;
    }
    mThis.editCity(city_id, city_name, country_id);
  });

  mThis.tblDistricts_body.on('click', 'a._sttn_loc_edit_district', function (e) {
    e.preventDefault();
    let x = $(this);
    let district_id = $(this).data('id');
    let district_name = x.closest('tr').find('td.col_district_name').text();
    let city_id = mThis.elFilter_city.val();
    if(!city_id){
      cv_interact.error('No city selected!', '', 'warning');
      return;
    }
    mThis.editDistrict(district_id, district_name, city_id);
  });

  mThis.tblCommunes_body.on('click', 'a._sttn_loc_edit_commune', function (e) {
    e.preventDefault();
    let x = $(this);
    let commune_id = x.data('id');
    let commune_name = x.closest('tr').find('td.col_commune_name').text();
    mThis.editCommune(commune_id, commune_name, mThis.elFilter_district.val());
  });

  this.displayCities = function(country_id){
    let p = {};
    p.country_id = country_id;
    mThis.tblCities_body.empty();

    window.vsapi.call([mThis.base_url, '/api/location/cities'].join(''), p).then((res) => {
      if(res.status_code === 200){
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do{
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-cityname="', c.name, '" data-cityid="', c.id, '">',
            '<td><i class="icon-city-default"></i></td>',
            '<td class="col_city_name">', c.name, '</td>',
            '<td class="col_action">',
            '<a href="javascript:void(0)" class="_sttn_loc_edit_city" data-cityid="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
            '<a href="javascript:void(0)" class="_sttn_loc_delete_city" data-cityid="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblCities_body.append(html);
          i++;
        }while(c);
        if(i === 0){
          mThis.tblCities_body.html('<tr><td colspan="100%"><div>No cities or provinces to display</div></td></tr>');
        }
      }
    });
  }

  this.displayDistricts = function (city_id, isOnSelectChange = false){
    if(!isOnSelectChange){
      mThis.elFilter_city.val(city_id).trigger('change');
      return;
    }

    let p = {};
    if(!city_id){
      city_id = mThis.elFilter_city_district.val();
    }
    p.city_id = city_id;
    mThis.tblDistricts_body.empty();

    window.vsapi.call([mThis.base_url, '/api/location/districts'].join(''), p).then(res => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do{
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-id"', c.id, '">',
            '<td class="col_district_name">', c.name, '</td>',
            '<td class="col_city_name">', c.city_name, '</td>',
            '<td>', c.country_name, '</td>',
            '<td class="col_action">',
            '<a href="javascript:void(0)" class="_sttn_loc_edit_district" data-id="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
            '<a href="javascript:void(0)" class="_sttn_loc_delete_district" data-id="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.4em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblDistricts_body.append(html);
          i++;
        }while (c);
      }
    });
  };

  this.displayCommunes = function (district_id, isOnSelectChange = false){
    if (!isOnSelectChange) {
      mThis.elFilter_district.val(district_id).trigger('change');
      return;
    }

    let p = {};
    if (!district_id) district_id = mThis.elFilter_district.val();
    p.district_id = district_id;
    mThis.tblCommunes_body.empty();
    window.vsapi.call([mThis.base_url, '/api/location/communes'].join(''), p, null, false).then(res => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do{
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-id"', c.id, '">',
            '<td class="col_commune_name">', c.name, '</td>',
            '<td class="col_district_name">', c.district, '</td>',
            '<td class="col_city_name">', c.city, '</td>',
            '<td class="col_action">',
            '<a href="javascript:void(0)" class="_sttn_loc_edit_commune" data-id="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
            '<a href="javascript:void(0)" class="_sttn_loc_delete_commune" data-id="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblCommunes_body.append(html);
          i++;
        }while (c);
      }
    });
  }

  this.editCommune = (id, name, district_id) => {
    let option = { title: 'Rename Commune', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'Commune Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'district_id': district_id };

      window.vsapi.call([mThis.base_url, '/api/location/commune/save'].join(''), p).then((res) => {
        if(res.status_code === 200){
          mThis.displayCommunes(district_id);
        }
        else
          cv_interact.error(res.error_message);
      });
    });
  }

  this.editDistrict = (id, name, city_id) => {
    let option = { title: 'Rename District', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'District Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'city_id': city_id };
      window.vsapi.call([mThis.base_url, '/api/location/district/save'].join(''), p).then((res) => {
        if(res.status_code === 200){
          mThis.displayDistricts(city_id);
        }
        else
          cv_interact.error(res.error_message);
      });
    });
  }

  this.editCity = (id, name, country_id) => {
    let option = { title: 'Rename City', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'City Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'country_id': country_id };
      window.vsapi.call([mThis.base_url, '/api/location/city/save'].join(''), p).then((res) => {
        if(res.status_code === 200){
          mThis.displayCities(country_id);
        }
        else
          cv_interact.error(res.error_message);
      });
    });
  }
}

let CountryDialog = new function () {
  let mThis = this;
  this.self = $('#_loc_dlgCountry');
  this.elTitle = this.self.find('.modal-title');
  this.btnSave = this.self.find('.btn-save-country');
  this.imgFlag = this.self.find('img.country-flag');
  this.options = {};

  this.imgBox = new ImageBox('_loc_img_flag', {
    altText: "Image",
  });

  this.btnSave.on('click', (e) => {
    e.preventDefault();
    let p = mThis.getFormData();
    vsapi.call([main_view.base_url, '/api/location/country/save'].join(''), p, null, false).then(res => {
      if(res.status_code === 200){
        let countries = res.data.countries;
        if (typeof mThis.onClose === 'function') mThis.onClose(countries);
        mThis.self.modal('hide');
      }
      else
        cv_interact.warning(res.error_message);
    });
  });

  this.get_src_type = (src) => {
    if(src.startsWith("data:image")){
      return "base64";
    }
    if(src.startsWith("http://") || src.startsWith("https://")){
      return "url";
    }
    return "Invalid Source";
  }

  this.setFormData = (d = null) => {
    if(!d){
      mThis.imgBox.setImage(null);
      d = {};
    }

    mThis.self.find('.data-input').each(function(){
      let el = $(this);
      let f = el.data('field');
      el.val(d[f]);
    });
    mThis.imgBox.setImage(d.flag);
  };

  this.getFormData = () => {
    let p = {};
    mThis.self.find('.data-input').each(function () {
      let el = $(this);
      let f = el.data('field');
      if(el.is('img')){
        const src = el.prop('src');
        if(mThis.get_src_type(src) === 'base64'){
          p.flag = src;
        }
      }
      else
        p[f] = el.val();
    });
    p.id = mThis.options.id;
    return p;
  }

  this.show = (options) => {
    if (!options) options = {};
    mThis.options = options;
    mThis.onClose = options.onClose;
    if(options.id > 0){
      let p = { 'id': options.id };
      vsapi.call([main_view.base_url, '/api/location/country/details'].join(''), p, null, false).then(res => {
        mThis.elTitle.text('Edit Country');
        if(res.status_code === 200){
          let d = res.data;
          mThis.setFormData(d);
          mThis.self.modal({
            backdrop: 'static'
          });
        }
      });
    }
    else{
      mThis.elTitle.text('New Country');
      mThis.setFormData(null);
      mThis.self.modal({
        backdrop: 'static'
      });
    }
  }
}

window.addEventListener('DOMContentLoaded',function(){
  LocationComponent.init();
});
'use strict';
let LocationComponent = new function () {
  let mThis = this;
  this.title_prop = 'Location Management';

  this.init = function () {
    mThis.base_url = $('#__base_url').val();
    mThis.title = 'Locations';
    mThis.self = $('#_sttn_locationsComponent');
  } //end::LocationsCompoent.init()

  this.show = function (option) {
    CountryListPanel.displayCountries();
    let tab_view_name = 'cities';
    ZoneTabView.show(mThis.selected_country_id, tab_view_name, false);
    mThis.self.show().siblings().hide();
    main_view.setTitle(mThis.title_prop);
  }
  this.hide = function () {
    mThis.self.hide();
  }
}
//end::LocationsComponent

//begin::CountryListPanel
let CountryListPanel = new function () {
  let mThis = this;
  this.base_url = $('#__base_url').val();
  this.self = $('#_sttn_loc_countryListpanel');
  this.tblCountries = $('#_sttn_loc_tblCountries');
  this.tblCountries_body = $('#_sttn_loc_tblCountries_body');
  this.lnkNewCountry = $('#_sttn_loc_lnkNewCountry');

  mThis.lnkNewCountry.on('click', function (e) {
    e.preventDefault();
    let option = { title: 'New Country', 'dataLabel': 'Enter country name', 'btnOKText': 'Add Country', 'defaultValue': null, 'blankErrorMessage': 'Country name cannot be empty' };
    InputBox1.show(option, function (d) {
      if (d) {
        let p = { 'name': d, 'name_native': d };
        window.vsapi.call([mThis.base_url, '/api/saveCountry'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCountries();
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCountries_body.on('click', 'a._sttn_loc_delete_country', function (e) {
    e.preventDefault();

    let p = { 'id': $(this).data('countryid') };
    if (!p.id) p.id = 0;
    cv_interact.confirm('Delete this country?', 'Delete Country', function (e) {
      if (e) {
        window.vsapi.call([mThis.base_url, '/api/deleteCountry'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCountries();
          } else cv_interact.alert(res.error_message);
        });
      }
    });
  });

  mThis.tblCountries_body.on('mouseover', 'tr', function (e) {
    $(this).find('td.col_action>a._sttn_loc_delete_country').show();
  }).on('mouseleave', 'tr', function (e) {
    $(this).find('td.col_action>a._sttn_loc_delete_country').hide();
  });



  mThis.tblCountries.on('click', 'tr', function (e) {
    if (mThis.prev_selected_row) mThis.prev_selected_row.removeClass('selected-animate');
    $(this).toggleClass('selected-animate');
    if ($(this).hasClass('selected-animate')) {
      mThis.selected_country_id = $(this).data('countryid');
      mThis.selected_country_name = $(this).data('countryname');
      mThis.prev_selected_row = $(this);
    }
    ZoneTabView.show(mThis.selected_country_id, null, false);
    ZoneTabView.loadComboItems_zone(mThis.selected_country_id, 'city', null);
  });

  this.displayCountries = function () {
    mThis.selected_country_name = null;
    mThis.selected_country_id = null;

    mThis.tblCountries_body.empty();
    window.vsapi.call([mThis.base_url, '/api/getCountryList'].join(''), null).then((res) => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do {
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-countryname="', c.name, '" data-countryid="', c.id, '">',
            '<td class="col_country_name">', c.name, '</td>',
            '<td class="col_action"><a data-countryid="', c.id, '" data-countryname="', c.name, '" href="#" class="_sttn_loc_delete_country" style="display:none"><i class="fa fa-times" style="color:red;"></i></a></td>',
            , '</tr>'].join('');
          mThis.tblCountries_body.append(html);
          i++;
        } while (c);
      }
    });
  }
}
//end::CountryListpanel

//begin::ZoneTabView 
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

  //Load filter zone, for districts and commune and village 
  this.loadComboItems_zone = (parent_zone_id, zone_name, def) => {
    if (!def) def = {};
    let method_name = 'getComboItems_city';
    let p = {};
    if (zone_name === 'city') {
      p.country_id = parent_zone_id;
      method_name = 'getComboItems_city';
    }
    else if (zone_name === 'district') {
      p.city_id = parent_zone_id;
      method_name = 'getComboItems_district';
    }
    else if (zone_name === 'commune') {
      p.district_id = parent_zone_id;
      method_name = 'getComboItems_commune';
    } else if (zone_name == 'village') {
      p.district_id = parent_zone_id;
      method_name = 'getComboItems_village';
    }

    window.vsapi.call([mThis.base_url, '/api/', method_name].join(''), p).then((res) => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        if (zone_name === 'city') {
          CommonLib.setComboItems(mThis.elFilter_city, rows, 'city_id', 'name', true, '(Select a city)', def.city_id);
          CommonLib.setComboItems(mThis.elFilter_city_district, rows, 'city_id', 'name', true, '(Select a city)', def.city_id);
        }
        else if (zone_name === 'district') {
          CommonLib.setComboItems(mThis.elFilter_district, rows, 'district_id', 'name', true, '(Select a district)', def.district_id);
        } else if (zone_name === 'commune') {
          CommonLib.setComboItems(mThis.elFilter_commune, rows, 'commune_id', 'name', true, '(Select a commune)', def.commune_id);
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

        //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
        if (view_name === 'cities') {
          mThis.displayCities(CountryListPanel.selected_country_id);
        } else if (view_name == 'districts') {
          mThis.displayDistricts();
        } else if (view_name === 'communes') {
          mThis.displayCommunes();
        }
        //end:: dispay content data
        return;
      }
    });

    //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
    if (!tab_button_clicked) {
      mThis.self.find('div.tab-header>a.tab-button').each(function () {
        let this_view_name = ($(this).data('viewname') + '').toLowerCase();
        if (view_name === this_view_name) {
          $(this).addClass('active').siblings().removeClass('active');
        }
      });
    }
  }

  //begin::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
  //begin::define specific elements, tables within this ZoneTabView tasks 
  this.tblCities = $('#_sttn_loc_tblCities');
  this.tblCities_body = $('#_sttn_loc_tblCities_body');
  this.tblDistricts = $('#_sttn_loc_tblDistricts');
  this.tblDistricts_body = $('#_sttn_loc_tblDistricts_body');

  this.lnkAddCity = $('#_sttn_loc_lnkNewCity');
  this.lnkAddDistrict = $('#_sttn_loc_lnkNewDistrict');
  this.lnkAddCommune = $('#_sttn_loc_lnkNewCommune');

  this.tblCommunes_body = $('#_sttn_loc_tblCommunes_body');
  this.tblCommunes = $('#_sttn_tblCommunes');
  this.elFilter_city = $('#_sttn_loc_filter_city'); //City Filter on District Panel. CommuneList requires TWO filters (City,District) 
  this.elFilter_city_district = $('#_sttn_loc_filter_city_district'); // City filter on CommuneListPanel
  this.elFilter_district = $('#_sttn_loc_filter_district')
  this.elFilter_commune = $('#_sttn_loc_filter_commune');

  //link to Add Accessible module 
  this.lnkAddCity.on('click', function (e) {
    e.preventDefault();
    if (!CountryListPanel.selected_country_id) {
      cv_interact.alert('No country selected!');
      return;
    }
    let option = { 'title': ['New City/Province in ', CountryListPanel.selected_country_name].join(''), 'dataLabel': 'Enter City name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'City name cannot be empty' };
    InputBox1.show(option, function (d) {
      if (d) {
        let p = { 'country_id': CountryListPanel.selected_country_id, 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/saveCity'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCities(CountryListPanel.selected_country_id);
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  this.elFilter_city.on('change', function () {
    mThis.displayDistricts($(this).val());
  });

  //On CommuneListPanel: User select Filter City, then displays list of related districts, and when user select District => display List of communes
  this.elFilter_city_district.on('change', function () {
    let def = { 'district_id': mThis.elFilter_district.val() };
    mThis.loadComboItems_zone($(this).val(), 'district', def);
  });

  this.elFilter_district.on('change', function () {
    mThis.displayCommunes($(this).val());
  });

  this.lnkAddDistrict.on('click', function (e) {
    e.preventDefault();

    if (!mThis.elFilter_city.val()) {
      cv_interact.alert('No city selected!');
      return;
    }
    let city_name = mThis.elFilter_city.find('option:selected').text();
    let option = { 'title': ['New District in ', city_name].join(''), 'dataLabel': 'Enter District name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'District name cannot be empty' };
    InputBox1.show(option, function (d) {
      if (d) {
        let p = { 'city_id': mThis.elFilter_city.val(), 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/saveDistrict'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayDistricts(p.city_id);
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  this.lnkAddCommune.on('click', function (e) {
    e.preventDefault();
    if (!CountryListPanel.selected_country_id) {
      cv_interact.alert('No country selected!');
      return;
    }
    if (!mThis.elFilter_district.val() || mThis.elFilter_district.val() <= 0) {
      cv_interact.alert('No district selected!');
      return;
    }
    let option = { 'title': 'New Commune', 'dataLabel': 'Enter Commune name', 'btnOKText': 'Add Now', 'blankErrorMessage': 'Commune name cannot be empty' };
    InputBox1.show(option, function (d) {
      if (d) {
        let p = { 'district_id': mThis.elFilter_district.val(), 'name': d, 'name_kh': d };
        window.vsapi.call([mThis.base_url, '/api/saveCommune'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCommunes(p.district_id);
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCities_body.on('click', 'a._sttn_loc_delete_city', function (e) {
    e.preventDefault();
    let p = { 'city_id': $(this).data('cityid') };
    if (!p.city_id) p.city_id = 0;
    cv_interact.confirm('Delete this city?', 'Delete City', function (e) {
      if (e) {
        window.vsapi.call([mThis.base_url, '/api/deleteCity'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCities(mThis.country_id);
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblCommunes_body.on('click', 'a._sttn_loc_delete_commune', function (e) {
    e.preventDefault();
    let p = { 'commune_id': $(this).data('id') };
    if (!p.commune_id) p.commune_id = 0;
    cv_interact.confirm('Delete this commune?', { 'title': 'Delete Commune' }, function (e) {
      if (e) {
        window.vsapi.call([mThis.base_url, '/api/deleteCommune'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayCommunes(mThis.elFilter_district.val());
          } else cv_interact.error(res.error_message);
        });
      }
    });
  });

  mThis.tblDistricts_body.on('click', 'a._sttn_loc_delete_district', function (e) {
    e.preventDefault();
    let p = { 'district_id': $(this).data('id') };
    if (!p.district_id) p.district_id = 0;
    cv_interact.confirm('Delete this distrinct?', 'Delete District', function (e) {
      if (e) {
        window.vsapi.call([mThis.base_url, '/api/deleteDistrict'].join(''), p).then((res) => {
          if (res.status_code === 200) {
            mThis.displayDistricts(mThis.elFilter_city.val());
          } else cv_interact.error(res.error_message);
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
    if (!country_id) {
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
    if (!city_id) {
      cv_interact.alert('No city selected!', '', 'warning');
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
  //end::define specific elements

  this.displayCities = function (country_id) {
    let p = {};
    p.country_id = country_id;
    mThis.tblCities_body.empty();

    window.vsapi.call([mThis.base_url, '/api/getCityList'].join(''), p).then((res) => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do {
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-cityname="', c.name, '" data-cityid="', c.id, '">',
            '<td><i class="icon-city-default"></i></td>',
            '<td class="col_city_name">', c.name, '</td>',
            '<td class="col_action">',
            '<a href="#" class="_sttn_loc_edit_city" data-cityid="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.3em"></i></a>&nbsp;&nbsp;',
            '<a href="#" class="_sttn_loc_delete_city" data-cityid="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblCities_body.append(html);
          i++;
        } while (c);
      }
    });
  }

  this.displayDistricts = function (city_id) {
    let p = {};
    if (!city_id) {
      city_id = mThis.elFilter_city_district.val();
    }
    p.city_id = city_id;
    mThis.tblDistricts_body.empty();

    window.vsapi.call([mThis.base_url, '/api/getDistrictList'].join(''), p).then((rows) => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do {
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-id"', c.id, '">',
            '<td class="col_district_name">', c.name, '</td>',
            '<td class="col_city_name">', c.city_name, '</td>',
            '<td>', c.country_name, '</td>',
            '<td class="col_action">',
            '<a href="#" class="_sttn_loc_edit_district" data-id="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
            '<a href="#" class="_sttn_loc_delete_district" data-id="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.4em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblDistricts_body.append(html);
          i++;
        } while (c);
      }
    });
  };

  this.displayCommunes = function (district_id) {
    let p = {};
    if (!district_id) district_id = mThis.elFilter_district.val();
    p.district_id = district_id;
    mThis.tblCommunes_body.empty();
    window.vsapi.call([mThis.base_url, '/api/getCommuneList'].join(''), p).then((res) => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        do {
          c = rows[i];
          if (!c) break;
          let html = ['<tr data-id"', c.id, '">',
            '<td class="col_commune_name">', c.name_kh, '</td>',
            '<td class="col_district_name">', c.district_name, '</td>',
            '<td class="col_city_name">', c.city_name, '</td>',
            '<td class="col_action">',
            '<a href="#" class="_sttn_loc_edit_commune" data-id="', c.id, '"><i class="fa fa-edit" style="color:green;font-size:1.2em"></i></a>&nbsp;&nbsp;',
            '<a href="#" class="_sttn_loc_delete_commune" data-id="', c.id, '"><i class="fa fa-times" style="color:red;font-size:1.3em"></i></a>',
            '</td>',
            '</tr>'].join('');
          mThis.tblCommunes_body.append(html);
          i++;
        } while (c);
      }
    });
  }

  this.editCommune = (id, name, district_id) => {
    let option = { title: 'Rename Commune', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'Commune Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'district_id': district_id };

      window.vsapi.call([mThis.base_url, '/api/saveCommune'].join(''), p).then((res) => {
        if (res.status_code === 200) {
          mThis.displayCommunes(district_id);
        } else cv_interact.error(res.error_message);
      });
    });
  }

  this.editDistrict = (id, name, city_id) => {
    let option = { title: 'Rename District', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'District Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'city_id': city_id };
      window.vsapi.call([mThis.base_url, '/api/saveDistrict'].join(''), p).then((res) => {
        if (res.status_code === 200) {
          mThis.displayDistricts(city_id);
        } else cv_interact.error(res.error_message);
      });
    });
  }

  this.editCity = (id, name, country_id) => {
    let option = { title: 'Rename City', 'blankErrorMessage': 'Location name cannot be empty', 'btnOKText': 'Save Change', 'dataLabel': 'City Name', 'defaultValue': name };
    InputBox1.show(option, function (d) {
      let p = { 'id': id, 'name': d, 'country_id': country_id };
      window.vsapi.call([mThis.base_url, '/api/saveCity'].join(''), p).then((res) => {
        if (res.status_code === 200) {
          mThis.displayCities(country_id);
        } else cv_interact.error(res.error_message);
      });
    });
  }
  //end::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
}
//end::ZoneTabview

$(document).ready(function () {
  LocationComponent.init();
});
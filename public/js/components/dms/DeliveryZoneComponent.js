'use strict';
var DeliveryZoneComponent = new function () {
  this.lang = 'en';
  let mThis = this;
  this.title_prop = "Delivery Zones";
  this.base_url = main_view.base_url;
  this.self = main_view.appContent.children('#_sttn_deliveryZoneComponent');
  this.tblZones = this.self.find('#_sttn_zon_tblZones');
  this.tblZones_body = this.self.find('#_sttn_zon_tblZones_body');
  this.lnkNewZone = this.self.find('#_sttn_zon_lnkNewZone');

  this.elSearch = this.self.find('#_sttn_zone_search');
  this.btnSearch = this.self.find('#_sttn_btnSearch');

  this.btnPrint = this.self.find('#_zone_btnPrint');
  this.elFilter_country = this.self.find('#_sttn_zon_filter_country');
  this.elFilter_city = this.self.find('#_sttn_zon_filter_city');
  this.elFilter_district = this.self.find('#_sttn_zon_filter_district');

  mThis.cols = [
    {
      title: "Zone Type",
      data: (data, index, tr) => {
        return data.zone_type;
      }
    },
    {
      title: "Zone Code",
      data: (data, index, tr) => {
        return data.zone_code;
      }
    },
    {
      title: "Zone Name",
      data: (data, index, tr) => {
        return data.zone_name;
      }
    },
    {
      title: "Sangkat",
      data: (data, index, tr) => {
        return data.commune_name;
      }
    },
    {
      title: "Khan",
      data: (data, index, tr) => {
        return data.district_name;
      }
    },
    {
      title: "City",
      data: (data, index, tr) => {
        return data.city_name;
      }
    },
    {
      title: "Country",
      data: (data, index, tr) => {
        return data.country_name;
      }
    },
    {
      title: "Action",
      data: (data, index, tr) => {
        return [`<div class="d-flex gap-2">
          <a href="javascript:void(0)" data-id ="${data.id}" class="_sttn_zon_edit">
            <i class="fa fa-regular fa-edit fs-5 text-warning"></i>
          </a>
          <a href="javascript:void(0)" data-id ="${data.id}" class="_sttn_zon_delete">
            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
          </a>
        </div>`].join('');
      }
    }
  ];

  this.processZoneList_print = (zones) => {
    zones = zones || [];
    let titles = ['No', 'Code', 'Zone Name', 'Sangkat', 'Khan', 'City', 'Country'];
    if (mThis.lang == 'kh') titles = ['ល.រ', 'កួដតំបន់', 'ឈ្មោះតំបន់', 'សង្កាត់', 'ខណ្ឌ័', 'ទីក្រុង', 'ប្រទេស'];
    let c, i = 0;
    let rows = [];
    do {
      c = zones[i];
      if (!c) break;
      let row = { 'No': (i + 1), 'zone_code': c.zone_code, 'zone_name': c.zone_name, 'commune_name': c.commune_name, 'district_name': c.district_name, 'city_name': c.city_name, 'country_name': c.country_name };
      rows.push(row);
      i++;
    } while (c);
    return { 'data': rows, 'titles': titles };
  }

  this.init = function () {
    if(mThis.initAlready) return;
    mThis.listView = new ListView('_sttn_delivery_zones', {
      'fetchApi': `${main_view.base_url}/dms/zone/list`,
      'apiCluster': main_view.apiCluster,
      'tableClass': 'table header-uppercase',
      'perPage': 10,
      'columns': mThis.cols,
      'listContainerClass': null
    });

    mThis.tblZones = mThis.listView.getTable();

    mThis.btnSearch.on('click', e => {
      e.preventDefault();
      mThis.listView.showPage(mThis.getFilterData());
    });

    mThis.elSearch.on('keyup', e => {
      e.preventDefault();
      clearTimeout(mThis.search_timeout);
      mThis.search_timeout = setTimeout(() => {
        mThis.listView.showPage(mThis.getFilterData());
      }, 250);
    });

    mThis.btnPrint.on('click', (e) => {
      e.preventDefault();
      let p = mThis.getFilterData();
      vsapi.call(`${main_view.base_url}/api/zone/list-all`, p, null).then(res => {
        let zones = res.status_code == 200 ? res.data : [];
        let d = mThis.processZoneList_print(zones);
        let op = { 'title': 'Delviery Zone List', 'title_color': 'blue', 'subTitle': 'Destination Zones', 'header_columns': d.titles };
        pdfReport.viewPDF_json(d.data, op);
      });
    });

    mThis.lnkNewZone.on('click', function (e) {
      e.preventDefault();
      let options = {
        title: 'New Delivery Zone', 'def': null, 'zone_id': null, 'onClose': () => {
          mThis.listView.showPage(mThis.getFilterData());
        }
      };

      ZoneDialog.show(options);
    });

    mThis.tblZones.addEventListener('click', e => {
      e.preventDefault();

      //Click on Delete Button
      let btn = VSUtil.getElementByClass(e.target, '_sttn_zon_delete');
      if (btn) {
        let p = { 'id': btn.dataset.id };
        cv_interact.confirm('Delete this delivery zone?', { title: 'Delete Delivery Zone', 'context': 'delete' }, e => {
          if (e) {
            vsapi.call(`${mThis.base_url}/dms/zone/delete`, p, null).then(res => {
              if (res.status_code === 200) {
                mThis.listView.showPage(mThis.getFilterData());
              } else cv_interact.error(res.error_message);
            });
          }
        });
        return;
      }

      //Click on Edit button
      btn = VSUtil.getElementByClass(e.target, '_sttn_zon_edit');
      if (btn) {
        let zone_id = btn.dataset.id;
        let p = { 'id': zone_id };
        let option = {
          'title': 'Modify Zone Details', 'zone_id': zone_id, 'onClose': () => {
            mThis.listView.showPage(mThis.getFilterData());
          }
        };
        ZoneDialog.show(option);
        return;
      }
    });

    mThis.initAlready = true;
  }

  this.getFilterData = () => {
    return { 'search_value': mThis.elSearch.val() };
  }

  this.show = function (options = null) {
    mThis.init();
    mThis.listView.showPage(mThis.getFilterData());
    mThis.self.siblings().hide();
    mThis.self.fadeIn(250);
    main_view.setTitle(mThis.title_prop);
  }

  this.hide = function () {
    mThis.self.hide();
  }
}

//begin::ZoneDialog
const ZoneDialog = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#_sttn_dlgZone');
  this.base_url = main_view.base_url;
  this.elTitle = this.self.find('#_sttn_dlgZoneTitle');
  this.elZoneType = this.self.find('#_sttn_zoneType');
  this.elCountry = this.self.find('#_sttn_zon_country');
  this.elCity = this.self.find('#_sttn_zon_city');
  this.elDistrict = this.self.find('#_sttn_zon_district');
  this.elCommune = this.self.find('#_sttn_zon_commune');

  this.options = {};
  this.fields = [];
  this.btnOK = this.self.find('#_sttn_dlgZone_btnOK');
  this.elError = this.self.find('#_sttn_dlgZone_error');
  this.self.find('.data-input').each(function () {
    let el = { dataMember: $(this).data('field'), 'element': $(this) };
    mThis.fields.push(el);
  });

  this.getData = () => {
    let p = {};
    let i = 0, c;
    do {
      c = mThis.fields[i];
      if (!c) break;
      p[c.dataMember] = c.element.val();
      i++;
    } while (c);

    //zone_id 
    p.id = mThis.options.id;
    return p;
  }

  this.setData = (d) => {
    let i = 0, c;
    if (!d) {

      do {
        c = mThis.fields[i];
        if (!c) break;
        c.element.val(null);
        i++;
      } while (c);
      return;
    }

    i = 0;
    do {
      c = mThis.fields[i];
      if (!c) break;
      c.element.val(d[c.dataMember]);
      i++;
    } while (c);

    mThis.city_id = d.city_id;
    mThis.district_id = d.district_id;
    mThis.commune_id = d.commune_id;
    mThis.elCountry.trigger('change');
  }

  this.elCity.off('change').on('change', function () {
    let p = { 'city_id': mThis.elCity.val() };

    vsapi.call(`${mThis.base_url}/api/location/options-district`, p).then(res => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        VSUtil.setComboItems(mThis.elDistrict, rows, 'id', 'district', true, '(Select District)', mThis.district_id);
        if (mThis.elDistrict.val() > 0) mThis.elDistrict.trigger('change');
      }
    });
  });

  mThis.elDistrict.off('change').on('change', function () {
    let p = { 'district_id': $(this).val() };
    vsapi.call(`${mThis.base_url}/api/location/options-commune`, p).then(res => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        VSUtil.setComboItems(mThis.elCommune, rows, 'id', 'commune', true, '(Select Commune)', mThis.commune_id);
      }
    });
  });

  mThis.elCountry.off('change').on('change', function () {
    let p = { 'country_id': $(this).val() };
    vsapi.call(`${mThis.base_url}/api/location/options-city`, p).then(res => {
      if (res.status_code === 200) {
        let rows = StringSanitizer.sanitizeObject(res.data);
        let val = mThis.elCity.val();
        VSUtil.setComboItems(mThis.elCity, rows, 'id', 'city', true, '(Select City)', val);
        //if(mThis.elCity.val() > 0) mThis.elCity.trigger('change');
      }
    });
  });

  this.btnOK.on('click', function (e) {
    let p = mThis.getData();
    if (!p.zone_code) {
      cv_interact.warning('Zone Code cannot be empty!');
      return;
    }
    if (!p.zone_name) {
      cv_interact.warning('Zone Name cannot be empty!');
      return;
    }
    if (!p.commune_id || p.commune_id <= 0) {
      cv_interact.warning('Commune or Sangkat is not correct');
      return;
    }

    if (!p.district_id || p.district_id <= 0) {
      cv_interact.warning('district is not correct');
      return;
    }

    if (!p.city_id || p.city_id <= 0) {
      cv_interact.warning('City is not correct');
      return;
    }
    if (!p.country_id || p.country_id <= 0) {
      cv_interact.warning('Country is not correct');
      return;
    }
    if (isNaN(p.price)) p.price = 0;
    vsapi.call(`${mThis.base_url}/dms/zone/save`, p, null).then(res => {
      if (res.status_code === 200) {
        mThis.self.modal('hide');
        if (typeof mThis.options.onClose === 'function') mThis.options.onClose(true);
      } else cv_interact.warning(res.error_message);
    });
  });

  this.show = (options = {}) => {
    mThis.elError.html(null);
    options = options || {};
    options.id = options.id || options.zone_id;
    mThis.options = options;

    mThis.prepareFormData(options.id, options.def, (d) => {
      if (d.zone) {
        mThis.elTitle.text('Modify Zone Details');
      } else {
        mThis.elTitle.text('New Delivery Zone');
      }

      mThis.setData(d.zone);
      mThis.self.modal({
        backdrop: 'static'
      });
    });
  }
  //close::this.show()

  this.prepareFormData = (zone_id, def, onFinish) => {
    //mThis.loadCountries(def,mThis.elCountry);
    // let p = {'zone_id':mThis.zone_id};
    // vsapi.call(`${mThis.base_url}/api/getDeliveryZoneDetails`,p).then(res => {
    //       if(res.status_code === 200){
    //               let d = StringSanitizer.sanitizeObject(res.data);
    //               if(!option.def) option.def = {};
    //               option.def.country_id = d.country_id;
    //               option.def.city_id = d.city_id;
    //               option.def.district_id = d.district_id;
    //               option.def.commune_id = d.commune_id;

    //       }
    // });
    vsapi.call(`${main_view.base_url}/dms/zone/form-options`, { 'id': zone_id }, null).then(res => {
      let d = res.status_code === 200 ? res.data : {};
      VSUtil.setComboItems(mThis.elCountry, d.countries, 'id', 'country', true, '(Select country)', null);
      VSUtil.setComboItems(mThis.elZoneType, d.zone_types, 'zone_type', 'zone_type', true, '(Select zone type)', null);
      onFinish(d);
    });
  };

  // this.loadCountries = (def)=>{
  //    if(!def) def = {};
  //    vsapi.call(`${mThis.base_url}/api/location/options-country`,null).then(res => {
  //      if(res.status_code === 200){
  //        let rows = StringSanitizer.sanitizeObject(res.data);
  //        VSUtil.setComboItems(mThis.elCountry,rows,'id','name',true,'(Select Country)',def.country_id);
  //        if(mThis.elCountry.val() >0) mThis.elCountry.trigger('change');
  //      }
  //    });  
  // } 

}
//end::ZoneDialog
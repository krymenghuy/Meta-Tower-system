'use strict';
var CountryZonesComponent  = new function () {
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

  this.cols = [

    {
      title: "Standard Zone",
      className: "align-middle  text-capitalize text-nowrap",
      data: (data, index, tr) => {
        return ['<div class="ms-5">',data.standard_zone,'</div>'].join('');
      }
    },
    {
      title: "Country",
      className: "align-middle text-success text-nowrap",

      data: (data, index, tr) => {
        return ['<div class="text-uppercase"><i class="fa-sharp text-danger fa-solid fa-flag"></i><span class="d-block p-1">',data.name,'</span></div>'].join('');

      }
    },
    {
      title: "Country Code",
      className: "align-middle ",
      data: (data, index, tr) => {
        return ['<div class="ms-5 ">',data.name.slice(0, 3).toUpperCase(),'</div>'].join('');
      }
    },
   
    {
      title:"Create By",
      data:(data,index,tr)=>{
        return ['<div class="d-flex align-item-center" ><i class="fas mt-2 text-success fa-user"></i><span class="d-block p-1">',(data.create_user ?? 'គ្មាន'),
        '</span></div>','<div class="d-flex"><i class="bi bi-balloon-fill"></i><span class="d-block p-1 text-primary">',data.create_date,'</span></div>'].join('');
        
      }
    },
  
   
    {
      title: "Action",
      className:"align-middle",
      data: (data, index, tr) => {
        return [`<div class="d-flex align-item-center gap-2">
          
          <a href="javascript:void(0)" data-id ="${data.id}" class="_sttn_zon_delete btn btn-sm btn-outline-danger rounded-5">
          <i class="fa fa-times"></i>
          </a>
        </div>`].join('');
      }
    }

  ];



  this.init = function () {
    if(mThis.initAlready) return;
    mThis.listView = new ListView('_sttn_delivery_zones', {
      fetchApi: `${main_view.base_url}/api/location/countries`,
      apiCluster: main_view.apiCluster,
      tableClass: 'table header-uppercase',
      processResponse: (res)=>{
        console.log(res.data);

        return res.data;
      },
      
      clientSidePagination: true,
      perPage: 10,
      columns: mThis.cols,
   
      'listContainerClass': null
    });

    mThis.tblZones = mThis.listView.getTable();
    //console.log(mThis.tblZones);
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

    this.s_container = mThis.listView.getListContainer();
    // mThis.setEvents($(mThis.container));
    // console.log(mThis.container.parentElement); 
    const s_parent = mThis.s_container.parentElement;
        s_parent.style.height = (window.innerHeight - 190)+'px';
        s_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            s_parent.style.height = (window.innerHeight - 190)+'px';
        }


  

    mThis.lnkNewZone.on('click', function (e) {
      e.preventDefault();
      let options = {
        title: 'New Delivery Zone', 'def': null, 'zone_id': null, 'onClose': () => {
          mThis.listView.showPage(mThis.getFilterData());
        }
      };

      ZoneDialog1.show(options);
    });

    mThis.tblZones.addEventListener('click', e => {
      e.preventDefault();

      //Click on Delete Button
      let btn = VSUtil.getElementByClass(e.target, '_sttn_zon_delete');
      if (btn) {
        let p = { 'id': btn.dataset.id };
        cv_interact.confirm('Delete this country zone?', { title: 'Delete Country Zone', 'context': 'delete' }, e => {
          if (e) {
            vsapi.call(`${mThis.base_url}/api/location/country/delete`, p, null).then(res => {
              if (res.status_code === 200) {
                mThis.listView.showPage(mThis.getFilterData());
              } else cv_interact.error(res.error_message);
            });
          }
        });
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

//begin::ZoneDialog1
const ZoneDialog1 = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#_sttn_dlgZon');
  this.base_url = main_view.base_url;
  this.elTitle = this.self.find('#_sttn_dlgZoneTitle');
 
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

 

  this.btnOK.on('click', function (e) {
    let p = mThis.getData();
  
    vsapi.call(`${mThis.base_url}/api/location/country/save`, p, null).then(res => {
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

  this.prepareFormData = (id, def, onFinish) => {
    
    vsapi.call(`${main_view.base_url}/api/country/details`, { 'id': id }, null).then(res => {
      let d = res.status_code === 200 ? res.data : {};
      // VSUtil.setComboItems(mThis.elCountry, d.countries, 'id', 'country', true, '(Select country)', null);
      // VSUtil.setComboItems(mThis.elZoneType, d.zone_types, 'zone_type', 'zone_type', true, '(Select zone type)', null);
      onFinish(d);
    });
  };

}
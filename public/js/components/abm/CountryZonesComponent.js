'use strict';
var CountryZonesComponent = new function(){
    this.lang = 'en';

    const mThis = this;
    this.title_prop = "Country Zone";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_countryZonesComponent');
    this.lnkNewCountryZones = this.self.find('#_countryZones_lnkNewZone');
  

    this.elSearch = this.self.find('#_countryZones_search');
    this.btnSearch = this.self.find('#_countryZones_btnSearch')
   

    mThis.cols = [
        {
          title: "Country Code",
          data: (data, index, tr) => {
            return data.country_code;
          }
        },
        {
          title: "Country Name",
          data: (data, index, tr) => {
            return data.country_name;
          }
        },
        {
          title: "Standard Zone",
          data: (data, index, tr) => {
            return data.standard_zone;
          }
        },
        {
          title: "Action",
          data: (data, index, tr) => {
            return [`<div class="d-flex gap-2">
              <a href="javascript:void(0)" data-id ="${data.id}" class="_countryZones_edit">
                <i class="fa fa-regular fa-edit fs-5 text-warning"></i>
              </a>
              <a href="javascript:void(0)" data-id ="${data.id}" class="_countryZones_delete">
                <i class="fa-regular fa-trash-can text-danger fs-5"></i>
              </a>
            </div>`].join('');
          }
        }
      ];

    this.init = () => {
        if(mThis.initAlready) return;
     
        mThis.countryZoneListView = new ListView("_countryZones", {
            clientSidePagination: true,
            fetchApi: `${main_view.base_url}/api/country/list-all`,
        
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 10,
            columns: mThis.cols,
            rowCreated : (data,index,tr)=>{
                    tr.dataset.id = data.id;
                },
            listContainerClass: null,
        });
        mThis.btnSearch.on('click',e=>{
          e.preventDefault();
          mThis.countryZoneListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.on('keyup',e=>{
          e.preventDefault();
          clearTimeout(mThis.search_Timeout);
          mThis.search_timeout = setTimeout(()=>{
            mThis.countryZoneListView.showPage(mThis.getFilterData());
          },250);
        });
        this.getFilterData = () => {
          return { 'search_value': mThis.elSearch.val() };
        }
        mThis.lnkNewCountryZones.on('click',function(e){
          e.preventDefault();
          let op = {
            'id':null,
            'onClose':(d)=>{

              mThis.countryZoneListView.showPage(mThis.getFilterData());

            }


          };
          CountryZoneDialog.show(op);

        });

        

        mThis.initAlready = true;
    }
    this.show = (options) => {
        mThis.init();
        mThis.countryZoneListView.showPage(mThis.getFilterData());
        main_view.setTitle(mThis.title_prop);
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    }

};
const CountryZoneDialog = new function (){
  let mThis = this;
  this.self = main_view.appContent.children('#_countryZone_dlg');
  this.base_url = main_view.base_url;
  this.elTitle = this.self.find('#_countryZone_dlgTitle');
  this.elCountry = this.self.find('#country_name');
  this.onClose = null;
  this.options={};
  this.filed=[];
  this.modalBody = this.self.find('#_countryZones_dlg_body');
  this.btnOK = this.self.find('#_countryZones_dlg_btnOK');
  //this.elError = this.find('#_countryZones_dlg_error');
  mThis.btnOK.onclick = function (e){
    e.preventDefault();
    const p = mThis.getDataForm();
    console.log(p);
    vsapi.call(`${main_view.base_url}/api/country/save`,p,this).then(res => {
        if(res.status_code === 200){
            $(mThis.self).modal('hide');
            if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
        }
        else{
            cv_interact.error(res.error_message ?? 'Something went wrong!');
        }
    });
  }





  this.show =(options,onClose=null)=>{
    //console.log(options.id);
    if(!options) options = {};
    mThis.options = options;
    mThis.prepareFormOptions (options.id,(d)=>{
        let title = d.workspace ? "Modify Country" : "New Country";
        title = LocaleManager.trans(title,"titles");
        mThis.elTitle.innerHTML = title;
        mThis.setDataForm(d.workspace);
        mThis.self.modal({
            backdrop: "static",
        });
    });

}
  

}

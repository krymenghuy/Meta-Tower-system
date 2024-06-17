'use strict';
var CountryZonesComponent  = new function () {
  this.lang = 'en';
  let mThis = this;
  this.title_prop = "Country Zones";
  this.base_url = main_view.base_url;
  this.self = main_view.appContent.children('#_sttn_zoneCountryComponent')[0];

  this.btnAddCountry = this.self.querySelector('#_sttn_btnAddCountry');
  this.elSearch = this.self.querySelector('#_sttn_zone_search');
  this.btnSearch = this.self.querySelector('#_sttn_btnSearch');

  this.btnPrint = this.self.querySelector('#_zone_btnPrint');
  this.elFilter_country = this.self.querySelector('#_sttn_zon_filter_country');

  this.cols = [
    {
      title: "Country",
      className: "country_name align-middle text-nowrap",

      data: (data, index, tr) => {
        return ['<div class="d-flex flex-row gap-2"><span class="d-block p-1">',data.country_name,'</span>','<a href="javascript:void(0)" style="visibility:hidden" class="lnk_edit_country"><i class="fa fa-pencil"></i></a>','</span></div>'].join('');
      }
    },
    {
      title: "Country Code",
      className: "align-middle ",
      data: (data, index, tr) => {
        return ['<div class="ms-5 text-uppercase">',(data.country_code || "មិនទាន់មាន"),'</div>'].join('');
      }
    },
    {
      title: "Zone Code",
      className: "zone_code align-middle  text-capitalize text-nowrap",
      data: (data, index, tr) => {
        let lnkEditZone = '<a href="javascript:void(0)" style="visibility:hidden" class="lnk_zone"><i class="fa fa-pencil"></i></a>';
        return ['<div class="ms-5 d-flex flex-row gap-2">','<span class="zone_code_text">',(data.zone_code || "(មិនទាន់មាន)"),'</span>',lnkEditZone,'</div>'].join('');
      }
    },
    {
      title:"Last Updated",
      data:(data,index,tr)=>{
        return ['<div class="d-flex align-item-center " ><span class="d-block p-1">',(data.update_user || 'NA'),
        '</span></div>','<div class="d-flex"><i class="bi bi-balloon-fill"></i><span class="d-block p-1 text-muted">',(data.update_date || ""),'</span></div>'].join('');
        
      }
    },
    {
      title: "Action",
      className:"align-middle",
      data: (data, index, tr) => {
        return [`<div class="d-flex align-item-center gap-2">
          <a href="javascript:void(0)" data-id ="${data.id}" class="lnk_delete_country btn text-danger align-item-center rounded-5">
          <i class="fa-solid fa-trash ms-1"></i>
          </a>
        </div>`].join('');
      }
    }

  ];
 
  /** Show or hide element with class $target_class when user puts mouse over tr or td with class $td_class */
  function setInstanceVisible(tr, td_class, target_class) {
    if (!tr) return;

    const td = td_class ? tr.querySelector(`td.${td_class}`) : null;
    const target = tr.querySelector(`.${target_class}`);

    if (!target) return;

    const showTarget = () => {
        target.style.visibility = 'visible';
    };

    const hideTarget = () => {
        target.style.visibility = 'hidden';
    };

    if (td) {
        td.addEventListener('mouseenter', showTarget);
        td.addEventListener('mouseleave', hideTarget);
    } else {
        tr.addEventListener('mouseenter', showTarget);
        tr.addEventListener('mouseleave', hideTarget);
    }
 }
    
  this.init = function () {
    if(mThis.initAlready) return;

    mThis.listView = new ListView('_sttn_zone_country_list', {
      fetchApi: `${main_view.base_url}/abm/country/list`,
      apiCluster: main_view.apiCluster,
      tableClass: 'table header-uppercase',
      processResponse: (res)=>{
        return res.data;
      },
      rowCreated:(data,index,tr)=>{
          tr.dataset.id = data.id;
          tr.dataset.countryid = data.country_id;
          setInstanceVisible(tr,'country_name',['lnk_edit_country']);
          setInstanceVisible(tr,'zone_code',['lnk_zone']);
      },
      clientSidePagination: true,
      perPage: 10,
      columns: mThis.cols,
      'listContainerClass': null
    });

    mThis.tblZones = mThis.listView.getTable();
    
    // mThis.btnSearch.on('click', e => {
    //   e.preventDefault();
    //   mThis.listView.showPage(mThis.getFilterData());
    // });

    mThis.elSearch.addEventListener('keyup', e => {
      e.preventDefault();
      clearTimeout(mThis.search_timeout);
      mThis.search_timeout = setTimeout(() => {
        mThis.listView.showPage(mThis.getFilterData());
      }, 250);
    });

    //this.s_container = mThis.listView.getListContainer();
    
    // const s_parent = mThis.s_container.parentElement;
    //     s_parent.style.height = (window.innerHeight - 190)+'px';
    //     s_parent.classList.add('overflow-y-auto');
    //     window.onresize = () => {
    //         s_parent.style.height = (window.innerHeight - 190)+'px';
    //  }
  
    mThis.btnAddCountry.addEventListener('click', e => {
      e.preventDefault();
      let op = {
        id:null,
        country: null,
        onClose:(data)=>{
           mThis.listView.showPage(mThis.getFilterData());
        }
      }

      CountryDialog.show(op);
    });
   

    mThis.tblZones.addEventListener('click', e => {
      e.preventDefault();

      //Click on Delete Button
      let btn = VSUtil.closestLimited(e.target, '.lnk_delete_country');
      if (btn) {
        let p = { 'id': btn.dataset.id };
        cv_interact.confirm('Delete this country?', { title: 'Delete Country', 'context': 'delete' }, e => {
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

      //Click on Edit Zone Code / and save zone code
      btn = VSUtil.closestLimited(e.target,'.lnk_zone');
      if(btn){
        let tr = VSUtil.closestLimited(e.target,'tr');
        let id = tr.dataset.id;
        let span = btn.parentElement.querySelector('.zone_code_text');
        let orgValue = span.textContent;
        const editing = btn.dataset.editing;
        if(editing ==1){
          let val = span.querySelector('input').value;
          if(isNaN(val)){
             cv_interact.warning('Please enter a valid number for zone code');
             return;
          }
          if(val !== orgValue && !isNaN(val)){
             let p = {"id":tr.dataset.id,"country_id":tr.dataset.countryid, "zone_code":val};
             vsapi.call(`${mThis.base_url}/abm/country/save`, p,false,false,false).then(res =>{
                if(res.status_code ==200){
                  span.textContent = val || "(មិនទាន់មាន)";
                  btn.innerHTML = '<i class="fa fa-pencil"></i>';
                  btn.dataset.editing ="0";
                }else cv_interact.warning(res.error_message);
             });
          }else{
            span.textContent = val || "(មិនទាន់មាន)";
            btn.innerHTML = '<i class="fa fa-pencil"></i>';
            btn.dataset.editing ="0";
          }
        
        }else{
          let val = span.textContent;
          span.dataset.value = val;
          let html = ['<input type="number" style="max-width:100px" class="form-control" value="',(isNaN(val)? "":val),'" />'].join('');
          span.innerHTML = html;
          btn.innerHTML = '<i class="fa fa-save fs-5"></i>';
          btn.dataset.editing ="1";
        }
      
        return;
      }
 
        //Click on Edit Country / and save country
        btn = VSUtil.closestLimited(e.target,'.lnk_edit_country');
        if(btn){
           let tr = VSUtil.closestLimited(e.target,'tr');
           let op = {
            id: tr.dataset.id, 
            country_id: tr.dataset.countryid,  
            onClose:(data)=>{
               mThis.listView.showPage(mThis.getFilterData());
            }};
           CountryDialog.show(op);
           return;
        }
    });

    mThis.initAlready = true;
  }

  this.getFilterData = () => {
    return { 'search_value': mThis.elSearch.value };
  }
  
  this.show = function (options = null) {
    mThis.init();
    mThis.listView.showPage(mThis.getFilterData());
    main_view.setTitle(mThis.title_prop);
    mThis.jm = mThis.jm || $(mThis.self);
    mThis.jm.siblings().hide();
    mThis.jm.fadeIn(250);
   
  }

  this.hide = function () {
    if(mThis.jm.length > 0) mThis.jm.hide();
  }
}

const CountryDialog = new GeneralDialog({
    title:"Edit Country",
    //cssClass:"",
    fields:[
      { 
        name:"country_name",
        label:"Country Name",
        require: true
      },
      {
        name:"country_code",
        label:"Country Code",
        require: true
      },
      {
        name:"zone_code",
        label:"Zone Code",
        require: true
      }
    ],
    //showCancelButton:true,
    buttons:[
      {
        text:"<span>Save</span>",
        click:(me,btn,divModal)=>{
           let p = me.getData();
           console.log(p);
           vsapi.call(`${main_view.base_url}/abm/country/save`,p,btn,false,false).then(res =>{
               if(res.status_code ==200){
                 me.hide();
               } else cv_interact.warning(res.error_message);  
           })
        }
      }
    ],
    prepareFormOptions:{
      createTitle:"Add Country",
      modifyTitle:"Edit Country",
      targetProp:"country",
      api:{
        endpoint:`${main_view.base_url}/abm/country/form-options`,
        params:(dataOptions)=>{
           return {"id":dataOptions.id, "country_id": dataOptions.country_id};
        }
      }
    },
    extendMethod:{
      getData:(instance, divModal)=>{
         return {"country_id": instance.dataOptions.country_id};
      }
    }
});
 
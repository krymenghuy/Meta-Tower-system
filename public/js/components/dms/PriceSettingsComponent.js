'use strict';
var PriceSettingsComponent = new function () {
  let mThis = this;
  this.title_prop = "Price Setttings";
  this.base_url = main_view.base_url;
  this.self = main_view.appContent.children('#_sttn_priceSettingsComponent');

  this.elSearch_pl = this.self.find('#ps_pl_search_merchant');

  this.elFilter_price_list = this.self.find('#ps-filter_price_list');
  this.elZones = this.self.find('#ps-filter_zones');
  this.tblPrices = this.self.find('#ps-tbl-prices');

  this.btnNewPriceZones = this.self.find('#ps-btnNewPriceZones');
  this.lnkAddPriceList = this.self.find('#ps-lnk_add_price_list');
  this.lnkDeletePriceList = this.self.find('#ps-lnk_delete_price_list');
  this.lnkRenamePriceList = this.self.find('#ps-lnk_rename_price_list');
  this.lnkViewMerchantList = this.self.find('#ps-lnk_merchant_list');

  this.init = function () {
    mThis.lnkViewMerchantList.on('click', (e) => {
      e.preventDefault();
      let id = mThis.elFilter_price_list.val();
      let price_list_name = mThis.elFilter_price_list.find('option:selected').text();
      let title = ['Merchants who use price list "', price_list_name, '"'].join('');
      let op = { 'title': title, 'price_list_id': id, 'price_list_name': price_list_name };
      MerchantListDialog.show(op);
    });

    mThis.elSearch_pl.on('keyup', function (e) {
      e.preventDefault();
      if (e.keyCode == 13) {
        let p = { 'search_value': mThis.elSearch_pl.val() };
        vsapi.call(`${mThis.base_url}/api/getPriceListIdBySearchValue`, p).then(res => {
          if (res.status_code === 200) {
            let d = res.data;
            d.price_list_id = StringSanitizer.sanitizeOut(d.price_list_id);
            mThis.elFilter_price_list.val(d.price_list_id).trigger('change');
          } else cv_interact.error(res.error_message);
        });
      }
    });

    mThis.lnkAddPriceList.on('click', function (e) {
      e.preventDefault();
      let op = { 'title': 'New Price List' };
      PriceListDialog.show(op, (new_id) => {
        if (new_id) {
          mThis.loadFilterData(new_id);
        }
      });
    });

    mThis.lnkRenamePriceList.on('click', function (e) {
      let id = mThis.elFilter_price_list.val();
      let def_name = mThis.elFilter_price_list.find('option:selected').text();
      if (!id || id === 0) return;
      cv_interact.inputBox('Enter new name', "Price List Name", 'text', def_name, null).then(d => {
        if (d.isConfirmed) {
          let p = { 'id': id, 'name': d.value };
          vsapi.call(`${mThis.base_url}/api/renamePriceList`, p, null, false).then(res => {
            if (res.status_code === 200) {
              //refresh price list options //here
              mThis.refreshPriceListOptions(id);
            } else cv_interact.error(res.error_message);
          });
        }
      });
    });

    mThis.lnkDeletePriceList.on('click', function (e) {
      e.preventDefault();
      let id = mThis.elFilter_price_list.val();
      let p = { 'price_list_id': id };
      cv_interact.confirm('Delete this price list?', { title: 'Delete Price List', context: "delete" }, function (e) {
        if (e) {
          vsapi.call(`${mThis.base_url}/api/deletePriceList`, p).then(res => {
            if (res.status_code === 200) {
              mThis.loadFilterData(null);
              mThis.elFilter_price_list.val(null);
              mThis.displayPrices();
            } else cv_interact.error(res.error_message);
          });
        }
      });
    });

    if (!mThis.elFilter_price_list.val()) mThis.lnkViewMerchantList.hide();
    mThis.elFilter_price_list.on('change', function () {

      if (mThis.elFilter_price_list.val() > 0) {
        mThis.lnkViewMerchantList.show();
        mThis.lnkDeletePriceList.show();
        mThis.lnkRenamePriceList.show();
      } else {
        mThis.lnkViewMerchantList.hide();
        mThis.lnkDeletePriceList.hide();
        mThis.lnkRenamePriceList.hide();
      }
      mThis.displayPrices();
    });

    mThis.tblPrices.on('click', '.btn_view_zones', function (e) {
      e.preventDefault();
      let btnViewZone = $(this);
      let div = $(this).closest('div.ps-zones');
      let zone_codes = div.data('zones');
      let disp_zones = null;// (zone_codes+'').replace(/|/g,','); 
      let zons = zone_codes.split('|');
      let cnt = zons.length;
      let codes = [];
      for (let i = 0; i < cnt; i++) {
        let code = zons[i];
        if (code) {
          if (codes.indexOf(code) == -1) codes.push(code);
        }
      }

      disp_zones = codes.join(',');
      let op = { 'title': 'Modify Price Zones', 'def_values': disp_zones, 'price_list_id': mThis.elFilter_price_list.val(), 'closeDialog': false };
      PriceLineDialog.show(op, (p) => {
        //p = {price_list_id,zone_codes}
        //Add org zone_codes for updating only zone_codes
        p.org_zone_codes = zone_codes;
        vsapi.call(`${mThis.base_url}/api/updateZoneCodes`, p, null, false).then(res => {
          if (res.status_code === 200) {
            mThis.displayZoneCodes(btnViewZone, p.zone_codes);
            PriceLineDialog.hide();
            cv_interact.success('Price Line has been updated!');
          } else cv_interact.warning(res.error_message);
        });
      });

    });

    mThis.tblPrices.on('click', '.ps-btn_delete_zones', function (e) {
      e.preventDefault();
      //get full list of zone_codes from parent DIV.ps-zones
      let zone_codes = $(this).closest('.ps-zones').data('zones');
      let p = { 'zone_codes': zone_codes };
      cv_interact.confirm('Delete this pricing zones?', { title: 'Delete Pricing Zones', context: "delete" }, function (e) {
        if (e) {
          vsapi.call(`${mThis.base_url}/api/deletePriceZones`, p).then(res => {
            if (res.status_code === 200) {
              mThis.displayPrices();
            } else cv_interact.error(res.error_message);
          });
        }
      });
    });

    mThis.tblPrices.on('click', 'a.ps-btn-edit-prices', function (e) {
      e.preventDefault();
      let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
      mThis.setEditMode($(this), div);
    });

    mThis.tblPrices.on('click', 'a.ps-btn-save-prices', function (e) {
      e.preventDefault();
      let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
      mThis.savePrices($(this), div);
    });

    mThis.btnNewPriceZones.on('click', () => {
      if (!mThis.elFilter_price_list.val()) {
        cv_interact.warning('Please select a price list');
        return;
      }

      //closeDialog:false => Do not close dialog when user has clicked OK or Save button.
      let op = { 'title': 'New Zones', 'price_list_id': mThis.elFilter_price_list.val(), 'closeDialog': false };

      PriceLineDialog.show(op, (p) => {
        //alert(JSON.stringify(p.zone_codes));
        vsapi.call(`${mThis.base_url}/api/savePriceLineZones`, p).then(res => {
          if (res.status_code === 200) {
            mThis.displayPrices();
            PriceLineDialog.hide();
            cv_interact.success("New price line has been added!");
          } else cv_interact.warning(res.error_message);
        });
      });
    });
  } //end::PriceSettingsCompoent.init()

  this.refreshPriceListOptions = (def_list_id = null) => {
    vsapi.call(`${mThis.base_url}/api/getComboItems_price_list`, null).then(res => {
      if (res.status_code === 200) {
        let items = StringSanitizer.sanitizeObject(res.data);
        let b = def_list_id;
        if (!b) b = mThis.elFilter_price_list.val();
        VSUtil.setComboItems(mThis.elFilter_price_list, items, 'id', 'name', false, null, b);
        if (mThis.elFilter_price_list.val() > 0) mThis.displayPrices();
      }
    });
  }

  this.loadFilterData = (def_list_id) => {
    mThis.refreshPriceListOptions(def_list_id);
  };

  /** savePrices() save edited prices (i.e: base_fee, additional, price_option)  and then make div.ps-fast or div.ps-normal container to be in View mode **/
  this.savePrices = (that, div) => {
    let btnEdit = div.find('a.ps-btn-edit-prices');
    let has_error = false;
    let p = {};
    div.find('.dd-field').each(function () {
      let field = $(this);
      let span = field.find('.dd-value');
      let input = field.find('.dd-input');
      input.removeClass('has-error');

      let f = field.data('field');
      let val = (input.val() + '').toLowerCase().trim();

      if (f == 'base_fee') {
        if (!val || val < 0) {
          input.addClass('has-error');
          has_error = true;
          return false;
        }
      } else if (f == 'delivery_fee') {
        if (!val || val < 0) {
          input.addClass('has-error');
          has_error = true;
          return false;
        }
      } else if (f == 'price_option') {
        if (val != 'fixed' && val != 'per_kg' && val != 'per kg') {
          input.addClass('has-error');
          has_error = true;
          return false;
        }
      }
      p[f] = input.val();
      if (!has_error) {
        div.find('.dd-value').show();
        span.text(input.val());
        input.remove();
      }
    });

    if (!has_error) {
      let price_list_id = mThis.elFilter_price_list.val();
      //let x =  div.closest('div.ps-zones');
      let zone_codes = that.data('zones');
      //need to modify html
      let section = that.data('section'); /** @section refers to {'above','below'}. "above" means Above 3 kg (for example) **/
      //need to modify html
      let delivery_type = that.data('dtype');

      p.id = that.data('id');
      p.price_list_id = price_list_id;
      p.zone_codes = zone_codes;
      p.section = section;
      p.delivery_type = delivery_type;
      vsapi.call(`${mThis.base_url}/api/savePriceLineInfo`, p).then(res => {
        if (res.status_code === 200) {
          that.data('id', res.id);
        } else cv_interact.error(res.error_message);
      });

      //hide btnSave
      that.hide();

      //Show back btnEdit
      btnEdit.show();
    }
  }

  /** set each block of div.ps-fast or div.ps-normal to be in Edit mode **/
  //div is div.ps-fast or div.ps-normal
  this.setEditMode = (me, div) => {
    let btnSave = div.find('a.ps-btn-save-prices');
    //Hide btnEdit
    me.hide();

    //remove existing inputs if the target div is already in Edit mode
    div.find('.dd-input').remove();

    //Show btnSave
    btnSave.show();
    div.find('.dd-value').each(function () {
      let el = $(this);
      el.after($('<input class="dd-input" style="outline:none;margin-top:3px;width:50px"/>').val(el.text()));
      el.hide();
    });
  }

  this.show = function (option = null) {
    mThis.loadFilterData();
    mThis.self.siblings().hide();
    main_view.setTitle(mThis.title_prop);
      mThis.self.fadeIn(250);
  }

  this.hide = function () {
    mThis.self.hide();
  }

  //return html for displaying Prices (base_fee,additional, proce_option) by the given zones
  //d = {'zone_codes','fast_items','normal_items'}
  //@section ={'above','below'}. "below" means for example "Below 5 kg"
  this.price_by_zones = (d, section) => {
    let n = d.normal_items ? d.normal_items : {};
    let f = d.fast_items ? d.fast_items : {};
    let zones = d.zone_codes;
    if (!zones) zones = '';

    //zones = zones.slice(0,50)
    let i = 0, c;
    let ex_html = null;
    let m_zones = null;
    let arrs = [];
    zones = zones.trim();
    if (zones.slice(0, 1) == '|' || zones.slice(0, 1) == ',')
      zones = zones.trim().slice(1);
    if (zones.indexOf('|') > 0)
      arrs = zones.split('|', 10);
    else
      arrs = zones.split(',', 10);

    do{
      c = arrs[i];
      if(!c) break;
      ex_html = '<a data-id="" href="javascript:void(0)" class="btn_view_zones"><i class="fa fa-list fs-5"></i></a>';
      if(i == 6){
        if(arrs[7])
          ex_html = ['...', ex_html].join(' ');
        break;
      }
      m_zones = [m_zones, (m_zones ? ', ' : ''), c].join('');
      i++;
    }while(c);

    //set default
    if (!n.base_fee) n.base_fee = 0;
    if (!n.delivery_fee) n.delivery_fee = 0;
    if (!n.price_option) n.price_option = 'Fixed';

    if (!f.base_fee) f.base_fee = 0;
    if (!f.delivery_fee) f.delivery_fee = 0;
    if (!f.price_option) f.price_option = 'Fixed';

    /** delivery types must be exactly {'Fast','Normal'} for the price list display to be displayed correctly **/
    let _dtype_fast = 'Fast';
    let _dtype_normal = 'Normal';

    //NOTE @zones = 11|15|12  or A1|A10|A15|A33  (List of zone_codes separated by | ). This @zones value must be exactly the same as the one in price_list.zone_codes for Updating or Inserting purpose
    let html = [`<td>
      <div class="d-flex flex-column border rounded-3 p-2" style="align-items:justify">
        <div class="ps-zones d-flex gap-2 justify-content-center" data-zones="${d.zone_codes}">
          <span class="ps-zones-text">${m_zones}</span>
          <span class="fs-6">${ex_html}</span>
          <a href="javascript:void(0)" class="ps-btn_delete_zones">
            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
          </a>
        </div>
        <div class="d-flex">
          <div data-value="${_dtype_fast}" class="ps-dtype ps-fast w-50">
            <span class="ps-dtype-fast-text fs-6">
              Fast
              <a href="javascript:void(0)" data-id="${f.id}" data-zones="${d.zone_codes}" data-section="${section}" data-dtype="${_dtype_fast}" class="ps-btn-edit-prices">
                <i class="fa fa-edit text-warning fs-5"></i>
              </a>
              <a style="display:none" href="javascript:void(0)" data-id="${f.id}" data-zones="${d.zone_codes}" data-section="${section}" data-dtype="${_dtype_fast}" class="ps-btn-save-prices">
                <i class="fa fa-save text-primary fs-5"></i>
              </a>
            </span>
            <div class="dd-field-container fs-6">
              <div class="dd-field" data-field="base_fee">
                <span class="dd-label fs-5-08">Base fee</span>
                <span class="dd-value fs-5-08">${f.base_fee}</span>
              </div>
              <div class="dd-field" data-field="delivery_fee">
                <span class="dd-label fs-5-08">Additional fee</span>
                <span class="dd-value fs-5-08">${f.delivery_fee}</span>
              </div>
              <div class="dd-field" data-field="price_option">
                <span class="dd-label fs-5-08">Price option</span>
                <span class="dd-value text-capitalize fs-5-08">${f.price_option}</span>
              </div>
            </div>
          </div>
          <div data-value="${_dtype_normal}" class="ps-dtype ps-normal w-50">
            <span class="ps-dtype-normal-text fs-6">
              Normal
              <a href="javascript:void(0)" data-id="${n.id}" data-zones="${d.zone_codes}" data-section="${section}" data-dtype="${_dtype_normal}" class="ps-btn-edit-prices">
                <i class="fa fa-edit text-warning fs-5"></i>
              </a>
              <a style="display:none" href="javascript:void(0)" data-id="${n.id}" data-zones="${d.zone_codes}" data-section="${section}" data-dtype="${_dtype_normal}" class="ps-btn-save-prices">
                <i class="fa fa-save fs-5"></i>
              </a>
            </span>
            <div class="dd-field-container fs-6">
              <div class="dd-field" data-field="base_fee">
                <span class="dd-label fs-5-08">Base fee</span>
                <span class="dd-value fs-5-08">${n.base_fee}</span>
              </div>
              <div class="dd-field" data-field="delivery_fee">
                <span class="dd-label fs-5-08">Additional fee</span>
                <span class="dd-value fs-5-08">${n.delivery_fee}</span>
              </div>
              <div class="dd-field" data-field="price_option">
                <span class="dd-label fs-5-08">Price option</span>
                <span class="dd-value text-capitalize fs-5-08">${n.price_option}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>`].join('');
    return html;
  }

  //return html for display price_line consisting of x_kg threhold (Above or below X kg), and Zones and Delivery Type 
  // @d = {d.above_kg_data, d.below_kg_data};
  // @above_kg_data = {'fast_items','normal_items'}

  //CreatePriceLine
  this.createRowHtml = (d) => {
    /** Below X Kg **/
    let section = 'below';
    let td_html_below = mThis.price_by_zones(d.below, section);

    /** Above X Kg **/
    section = 'above';
    let td_html_above = mThis.price_by_zones(d.above, section);

    return ['<tr>', td_html_below, td_html_above, '</tr>'].join('');
  }

  this.displayZoneCodes = (btn, new_zone_codes) => {
    let div = btn.closest('div.ps-zones');
    //ensure that new_zone_codes is list of zone codes separated by '|'  
    new_zone_codes = new_zone_codes.replace(/,/g, '|');
    let zons = new_zone_codes.split('|');
    let cnt = zons.length;
    let valid_zone_codes = [];
    let disp_zones = [];
    let disp_zone_count = 6;
    let x = 0;
    for (let i = 0; i < cnt; i++) {
      let z = zons[i];
      if (z) if (valid_zone_codes.indexOf(z) == -1) {
        valid_zone_codes.push(z);
        if (x <= disp_zone_count - 1) {
          disp_zones.push(z);
        }
        x++;
      }
    }
    new_zone_codes = ['|', valid_zone_codes.join('|'), '|'].join('');
    if (div.length > 0) div.data('zones', new_zone_codes); else console.error('Failed to update div.ps-zones[data-zones]');

    //zone_codes is the displayed list of zone codes
    div.find('.ps-zones-text').text(disp_zones.join(', '));
    div.find('a.ps-btn-edit-prices').data('zones', new_zone_codes);
    div.find('a.ps-btn-save-prices').data('zones', new_zone_codes);
  }

  this.displayPrices = () => {
    let p = { 'price_list_id': mThis.elFilter_price_list.val(), 'zone_codes': mThis.elZones.val() };
    let tbody = mThis.tblPrices.find('tbody');

    if (!p.price_list_id) {
      tbody.empty();
      return;
    }

    vsapi.call(`${mThis.base_url}/api/getPriceList_data`, p).then(res => {
      tbody.empty();
      mThis.tblPrices.find('.ps-below-kg').text('5kg and Below');
      mThis.tblPrices.find('.ps-above-kg').text('Above 5 kg');
      if(res.status_code === 200){
        let rows = res.data;
        let i = 0, c;
        do{
          c = rows[i];
          if (!c) break;
          let html = mThis.createRowHtml(c);
          tbody.append(html);
          i++;
        }while(c);
        const parent = mThis.tblPrices[0].parentElement;
        parent.style.height = (window.innerHeight - 250)+'px';
        window.onresize = function(){
          parent.style.height = (window.innerHeight - 250)+'px';
        }
      }
    });
  }
}
//end::PriceSettingsComponent

//begin::PriceLineDialog
var PriceLineDialog = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#_ps_dlgPriceLine');
  this.base_url = main_view.base_url;
  this.elTitle = this.self.find('#_ps_dlgPriceLineTitle');
  this.elZone = this.self.find('#_ps_newzone_zone');
  this.elZones = this.self.find('#_ps_newzone_zone_codes');
  //btnAddZone adds each selected zone to the list of zone_codes
  this.btnAddZone = this.self.find('#_ps_btnAddZone');

  this.btnOK = this.self.find('#_ps_dlgPriceLine_btnOK');
  this.elError = this.self.find('#_ps_dlgPriceLine_error');

  this.loadZones = () => {
    vsapi.call(`${mThis.base_url}/api/settings/options-delivery-zone`, null).then(res => {
      let items = StringSanitizer.sanitizeObject(res.data, null, ['zone_name']);
      VSUtil.setComboItems(mThis.elZone, items, 'zone_code', 'zone_name', false, null, null);
    });
  }

  //Click to add zone_codes to price_list table
  this.btnOK.on('click', function () {
    mThis.elError.html(null);
    let p = { 'price_list_id': mThis.price_list_id, 'zone_codes': mThis.elZones.val() };
    if (!p.zone_codes) {
      cv_interact.warning('No zone codes provided!');
      return;
    }
    if (typeof mThis.onClose === 'function') mThis.onClose(p);
    if (mThis.closeDialog) mThis.self.modal('hide');
  });

  this.elZone.on('change', function () {
    mThis.btnAddZone.trigger('click');
  });

  mThis.btnAddZone.on('click', function () {
    let thisVal = mThis.elZone.val();
    let st = mThis.elZones.val() + '';
    let ds = [];
    if (st != '') ds = st.split(',');
    if (thisVal) {
      if (ds.indexOf(thisVal) < 0) {
        ds.push(thisVal);
      }
    }

    mThis.elZones.val(ds.join(','));
  });

  this.hide = () => {
    mThis.self.modal('hide')
  }

  this.show = (option, onClose) => {
    if (!option) option = {};
    mThis.elError.html(null);
    mThis.elTitle.text(option.title);
    mThis.onClose = onClose;
    //price_list_id is required, cannot be empty. It is selected from filter SELECT BOX before showing this modal form
    mThis.price_list_id = option.price_list_id;

    mThis.loadZones();
    mThis.elZones.val(option.def_values);
    mThis.self.modal({
      backdrop: 'static'
    });
  }
}
//end::PriceLineDialog

//begin::PriceListDialog
const PriceListDialog = new function () {
  let mThis = this;
  this.base_url = main_view.base_url;
  this.self = main_view.appContent.children('#ps_dlgPriceList');
  this.btnOK = this.self.find('#ps_dlgPriceList_btnOK');
  this.elError = this.self.find('#ps_dlgPriceList_error');
  this.elTitle = this.self.find('#ps_dlgPriceListTitle');

  this.elName = this.self.find('#ps-newpl_name');
  this.elWeightMarker = this.self.find('#ps-newpl_kg_marker');

  this.btnOK.on('click', (e) => {
    let p = mThis.getData();
    if (!p.name) {
      mThis.elError.html('Name cannot be empty');
      return;
    }

    if (!$.isNumeric(p.kg_marker)) {
      mThis.elError.html('Weight Marker is not valid');
      return;
    }

    vsapi.call([mThis.base_url, '/api/createPriceList'].join(''), p).then(res => {
      if (res.status_code === 200) {
        let d = res.data;
        if (typeof mThis.onClose === 'function') mThis.onClose(d.id);
        mThis.self.modal('hide');
      } else mThis.elError.text(res.error_message);
    });

  });

  this.getData = () => {
    let p = {};
    p.name = mThis.elName.val();
    p.kg_marker = mThis.elWeightMarker.val();

    return p;
  }

  this.show = (option, onClose) => {
    mThis.elError.html(null);
    mThis.elTitle.html(option.title)
    mThis.onClose = onClose;

    mThis.self.modal({
      backdrop: 'static'
    });
  }
}
//end::PriceListDialog

//begin::MerchantListDialog
const MerchantListDialog = new function () {
  let mThis = this;
  this.self = main_view.appContent.children('#ps_dlgMerchantList');
  this.btnOK = this.self.find('#ps_dlgMerchantList_btnOK');
  this.elTitle = this.self.find('#ps_dlgMerchantListTitle');
  this.base_url = main_view.base_url;
  this.elError = this.self.find('#ps_dlgMerchantList_error');
  this.tblMerchants = this.self.find('#ps-tblMerchants');
  this.tblMerchants_body = this.self.find('#ps-tblMerchants_body');

  this.lnkAddMerchant = this.self.find('#ps-lnkAddMerchant');

  this.btnSearchMerchant = this.self.find('#ps-btnSearchMerchant');
  this.elSearch = this.self.find('#ps-search_merchant');

  this.elSearch.on('keyup', e => {
    e.preventDefault();
    clearTimeout(mThis.search_timeout);
    mThis.search_timeout = setTimeout(() => {
      mThis.showMerchantList();
    }, 250);
  });

  this.btnSearchMerchant.on('click', function (e) {
    mThis.showMerchantList();
  });

  this.lnkAddMerchant.on('click', (e) => {
    e.preventDefault();

    let option = { 'title': "Find Merchant", "role": "sender", "singleSelect": true, "previousDialog": mThis.self };
    FindPersonDialog.show(option, (persons) => {
      if (persons[0]) {
        let p = persons[0];
        let m = { 'sender_id': p.id, 'price_list_id': mThis.price_list_id };
        vsapi.call([mThis.base_url, '/api/setMerchantPriceList'].join(''), m).then(res => {
          if (res.status_code === 200)
            mThis.showMerchantList();
          else cv_interact.error(res.error_message);
        });

      }
    });

  });

  this.tblMerchants_body.on('click', 'a.ps-btn_add_merchant', function (e) {
    e.preventDefault();
    let p = {};
    let x = $(this);
    p.sender_id = x.data('senderid');
    p.price_list_id = mThis.price_list_id;
    if (!mThis.price_list_id) {
      cv_interact.warning('Current price list is not valid');
      return;
    }

    vsapi.call([mThis.base_url, '/api/setMerchantPriceList'].join(''), p).then(res => {
      if (res.status_code === 200)
        mThis.showMerchantList();
      //x.hide();
      else cv_interact.error(res.error_message);
    });
  });

  this.tblMerchants_body.on('click', 'a.ps-btn_remove_merchant', function (e) {
    e.preventDefault();
    let sender_id = $(this).data('senderid');
    cv_interact.confirm('Remove this merchant from the Price List?', { title: 'Remove Merchant', 'context': 'delete' }, (e) => {
      if (e) {
        let p = { 'price_list_id': mThis.price_list_id, 'sender_id': sender_id };
        vsapi.call([mThis.base_url, '/api/removeMerchantFromPriceList'].join(''), p).then(res => {
          if (res.status_code === 200) {
            mThis.showMerchantList();
          } else cv_interact.error(res.error_message);
        });
      }
    }, 'Remove', 'Cancel', 'remove');
  });

  this.showMerchantList = (onFinish) => {
    let p = { 'price_list_id': mThis.price_list_id, 'search_value': mThis.elSearch.val() };
    vsapi.call([mThis.base_url, '/api/getMerchantsByPriceList'].join(''), p).then(res => {
      if (res.status_code === 200) {
        let items = StringSanitizer.sanitizeObject(res.data);
        let i = 0, c;
        mThis.tblMerchants_body.empty();
        do {
          c = items[i];
          if (!c) break;
          let htm_button = ['<a data-senderid="', c.id, '" href="javascript:void(0)" class="ps-btn_add_merchant"><span style="color:blue">Add Now</span></a>'].join('');
          if (c.is_member == 1) htm_button = ['<a data-senderid="', c.id, '" href="javascript:void(0)" class="ps-btn_remove_merchant"><span style="color:red">Remove</span></a>'].join('');
          let css_class = 'ps-is-member';
          if (c.is_member != 1) css_class = null;
          if (!c.price_list_name) c.price_list_name = '<span style="color:red">No Price List</span>';
          let html = ['<tr class="', css_class, '">',
            '<td>', (i + 1), '</td>',
            '<td>', c.code, '</td>',
            '<td>', c.name, ' (', c.price_list_name, ')', '</td>',
            '<td>', c.phone_number, '</td>',
            '<td>', htm_button, '</td>',
            '</tr>'].join('');
          mThis.tblMerchants_body.append(html);
          i++;
        } while (c);
        if (typeof onFinish === 'function') onFinish();
      } else {
        if (typeof onFinish === 'function') onFinish();
        console.log('error occured in method .../api/getMerchantsByPriceList() returning @items as NULL');
      }
    });
  }

  this.show = (option, onClose) => {
    mThis.elError.html(null);
    let title_text = LocaleManager.trans(option.title, 'titles');
    mThis.elTitle.text(title_text);
    mThis.onClose = onClose;
    //NOTE: "option.price_list_id" is required
    if (!option.price_list_id) {
      cv_interact.warning('option.price_list_id is not supplied');
      return;
    }
    mThis.price_list_id = option.price_list_id;
    mThis.showMerchantList(() => {
      mThis.self.modal({
        backdrop: 'static'
      });
    });
  }

}
//end::MerchantListDialog

window.addEventListener('DOMContentLoaded', e => {
  PriceSettingsComponent.init();
});
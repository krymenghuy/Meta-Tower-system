const FilterDialog = (function(){
  let d_options = {};
  let isFilterVisible = null;
  let divFilterDialog = null;

  function showFilter(btn, op = {}){
    op = d_options;
    const appContent = main_view.appContent[0];

    if(!divFilterDialog){
      const div = document.createElement('div');
      div.classList.add('bg-white', 'd-flex', 'flex-column', 'position-absolute', 'shadow', 'p-3', 'rounded-3');
      div.setAttribute('id', '_dlg_filter_danymic');
      div.innerHTML = op.html || '';
      divFilterDialog = appContent.appendChild(div);
    }
    else{
      divFilterDialog.remove();
      divFilterDialog = null;
      isFilterVisible = false;
      return;
    }

    if(typeof op.onChange !== 'function') op.onChange = () => { return; };

    if(!op.html){
      op.html = '';
      for(let [index, key] of Object.keys(op.fields).entries()){
        let f = op.fields[key];
        f.name = key;
        let field_html = getFilterFieldHtml(f);
        op.html += field_html;
      }
    }

    divFilterDialog.innerHTML = op.html;

    const pos = btn.getClientRects()[0];

    divFilterDialog.style.top = `${pos.y - btn.clientHeight - 20}px`;
    divFilterDialog.style.left = `${pos.x + pos.width - divFilterDialog.clientWidth - 100}px`;
    divFilterDialog.style.zIndex = `99`;
    divFilterDialog.style.display = 'block';

    divFilterDialog.querySelectorAll('.data-filter').forEach(el => {
      let f = el.dataset.field;
      if(['select', 'date', 'time'].indexOf(f) >= 0){
        el.addEventListener('change', e => {
          e.preventDefault();
          op.onChange();
        });
      }
      else{
        el.addEventListener('input', e => {
          e.preventDefault();
          setTimeout(() => {
            op.onChange();
          }, 250);
        });
      }
    });

    const select2Elements = divFilterDialog.querySelectorAll('select.modal-select2');
    select2Elements.forEach(el => {
      setupSelect2(el, op.fields);
    });

    const dates = divFilterDialog.querySelectorAll('input.field-date');
    dates.forEach(el => {
      setupDateInput(el);
    });
  }

  function getFilterFieldHtml(f) {
    let field_html = '';
    switch ((f.type + '').toLowerCase()) {
      case 'select':
        field_html = `<div class="form-group">
            <div class="width--filter-inner">
                <label for="${f.name}" class="form-label">${f.label ? f.label : f.name}</label>
                <select class="modal-select2 data-filter" data-field="${f.name}"></select>
            </div>
        </div>`;
        break;
      case 'number':
        field_html = `<div class="form-group">
            <div class="width--filter-inner">
                <label for="${f.name}" class="form-label">${f.label ? f.label : f.name}</label>
                <input type="number" class="form-control data-filter" data-field="${f.name}"/>
            </div>
        </div>`;
        break;
      case 'date':
        field_html = `<div class="form-group">
            <div class="width--filter-inner">
                <label for="${f.name}" class="form-label">${f.label ? f.label : f.name}</label>
                <input type="text" class="form-control data-filter field-date" data-field="${f.name}"/>
            </div>
        </div>`;
        break;
      case 'time':
        field_html = `<div class="form-group">
          <div class="width--filter-inner">
            <label for="${f.name}" class="form-label">${f.label ? f.label : f.name}</label>
            <input type="time" class="form-control data-filter field-time" data-field="${f.name}"/>
          </div>
        </div>`;
        break;
      default:
        field_html = `<div class="form-group">
          <div class="width--filter-inner">
            <label for="${f.name}" class="form-label">${f.label ? f.label : f.name}</label>
            <input type="text" class="form-control data-filter" data-field="${f.name}"/>
          </div>
        </div>`;
        break;
    }
    return field_html;
  }

  function setupSelect2(el, fields) {
    const defvalue = el.dataset.defvalue;
    const name = el.dataset.field;
    const f = fields[name];
    const api = f.api;
    if(api){
      let p = (typeof api.params === 'function') ? api.params() : api.params;
      vsapi.call(api.endPoint, p, null, false).then(res => {
        let select_options = res.status_code == 200 ? res.data : [];
        const x_el = $(el);
        x_el.select2();
        VSUtil.setComboItems(this, select_options, f.valueField, f.textField, null, null, defvalue);
      });
    }
    else{
      const select_options = f.data;
      VSUtil.setComboItems(el, select_options, f.valueField, f.textField, null, null, null);
      const x_el = $(el);
      x_el.select2();
      if(defvalue) x_el.val(defvalue).trigger('change');
    }
  }

  function setupDateInput(el){
    const defvalue = el.dataset.defvalue;
    const x_el = $(el);
    DateHelper.init(x_el, defvalue);
  }

  return{
    init: function (btn, options = {}) {
      lnk = btn;
      d_options = options;
      divFilterDialog = document.getElementById('_dlg_filter_danymic');
      isFilterVisible = false;

      document.onmousedown = function (e) {
        if(btn.contains(e.target)){
          showFilter(btn, d_options);
        }
        else if (divFilterDialog) {
          if(!divFilterDialog.contains(e.target)){
            divFilterDialog.remove();
            divFilterDialog = null;
            isFilterVisible = false;
          }
        }
      };
    }
  };
})();
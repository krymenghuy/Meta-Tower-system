'use strict';
var TermComponent = new function () {
    let mThis = this;
    this.title_prop = 'Terms';
    this.self = $('#_main_termComponent');
    this.elFilter_academic_year = this.self.find('#_term_filter_academic_year');

    //this.tblTerm = mThis.self.find('#_trm_tbl');
    this.btnNew = mThis.self.find('#_trm_btn_new');

    this.cols = [{
        title: "Term Name",
        data: (data, a, b) => {
            return ['<div class="d-flex flex-column"><p class="fw-bold">', data.name, '</p>'
                , '</div>'].join('');
        }
    },
    {
        title: "Start Date",
        data: "start_date"
    },
    {
        title: "End Date",
        data: "end_date"
    },
    {
        title: "Academic Year",
        data: "academic_year"
    },
    {
        title: "Created By",
        data: (data, index, tr) => {
            return ['<div class="d-flex flex-column"><p class="">', data.create_user, '</p><p class="text-left text-muted">', data.created_at, '</p></div>'].join('');
        }
    },
    {
        title: "Previous Term",
        data: (data, index,tr) => {
            return data.prev_term_name ? data.prev_term_name : 'NA';
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-trm-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-trm-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];
 
    this.getFilterData = ()=>{
      return {'academic_year':mThis.elFilter_academic_year.val()};
    }

    this.init = () => {
        mThis.termListView = new ListView('_term_list',{
            'fetchApi':`${main_view.base_url}/api/term/list-paginate`,
            'perPage':10,
            'columns':mThis.cols,
            // 'renderItems':(items,list_container) => {
            //     mThis.renderStudents(list_container,items);
            // },
            'listContainerClass':null
        });

        mThis.tblTerm = $(mThis.termListView.getTable());

        mThis.elFilter_academic_year.on('change',e=>{
           e.preventDefault();
           mThis.termListView.showPage(mThis.getFilterData());
        });

        mThis.btnNew.on('click', function (e) {
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayTerm();
                }
            };
            TermDialog.show(op);
        });

        mThis.tblTerm.on('click',e=> {
            e.preventDefault();

             //Click event for Modify Term  lnk's class "btn-trm-modify"
            let lnk = VSUtil.clickOnClass(e.target,'btn-trm-modify');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id,
                    'onClose': () => {
                        mThis.termListView.showPage(mThis.getFilterData()); 
                    }
                };
                TermDialog.show(op);
                return;
            }
           
            //Click event for Delete Term  lnk's class "btn-trm-delete"
            lnk = VSUtil.clickOnClass(e.target,'btn-trm-delete');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id
                };
                cv_interact.confirm('Delete this term?', { title: 'Delete Term', context: 'delete' }, (e) => {
                    if (e) {
                        vsapi.call(`${main_view.base_url}/api/term/delete`, op, null).then(res => {
                            if (res.status_code === 200) {
                               mThis.termListView.showPage(mThis.getFilterData()); 
                            }else cv_interact.warning(res.error_message);
                        });
                    }
                });
                return;
            }
 
        });
        
    }
 
    this.prepareFormOption = (onFinish)=>{
        vsapi.call([main_view.base_url,'/api/settings/options-academic-year'].join(''),null,false).then(res=>{
             const yrs = res.status_code===200? res.data:[];
             VSUtil.setComboItems(mThis.elFilter_academic_year,yrs,'academic_year','academic_year',true,'(All Years)',0);
             onFinish();
        });
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.prepareFormOption(()=>{
                mThis.termListView.showPage(mThis.getFilterData(),null,()=>{
                    main_view.setTitle(mThis.title_prop);
                    let x = mThis.self.siblings(':visible');
                    x.fadeOut('fast', function () {
                        mThis.self.hide().fadeIn(200);
                    });
                });
        });       
    }
}

const TermDialog = new function () {
    let mThis = this;
    this.self = $('#dlg_trm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_trm_btn_save');
    this.elAcademic = mThis.self.find('#dlg_trm_academic');
    this.elPrevTerm = this.self.find('#dlg_trm_prev_term');

    this.group_label = new OptionEditor('_term_acad_year_label', {
        "selectElement": mThis.elAcademic,
        "buttons": ["add", "edit", "delete"],
        'label': "Academic Year",
        "text_field": "academic_year",
        "value_field": "id",
        "dataprop": "academic_years",
        "langprop": "general",
        //when user clicks on Add, Edit button => use ItemGroupDialog to add or edit Group because Group has many attributes such as code, name, UOM, and Category
        "buttonClick": (action) => {
            let op = null;
            if (action === 'add') {
                op = {
                    'id': null,
                    'previousDialog': mThis,
                    'previousDialog_options': mThis.options,
                    'onClose': (d) => {
                        //NOTE: here we use academic_year_id in SELECT box
                        mThis.refreshOptions('academic_year', d.academic_years, d ? d.id:null);
                    }
                };
                AcademicDialog.show(op);
                return;

            } else if (action === 'edit') {
                op = {
                    'id': mThis.elAcademic.val(),
                    'previousDialog': mThis,
                    'previousDialog_options': mThis.options,
                    'onClose': (d) => {
                         //NOTE: here we use academic_year_id in SELECT box
                         mThis.refreshOptions('academic_year', d.academic_years, d.id, d ? d.id : null);
                    }
                };
                AcademicDialog.show(op);
                return;
            }
            else if (action === 'delete') {
                cv_interact.confirm('Delete this academic year?', { 'context': 'delete', 'title': 'Delete Academic Year' }, e => {
                    if (e) {
                        vsapi.call(`${main_view.base_url}/api/academic-year/delete`, { 'id': mThis.elAcademic.val() }, null, false).then(res => {
                            if (res.status_code === 200) {
                                mThis.refreshOptions('academic_year', res.data.academic_years, null);
                            }else cv_interact.warning(res.error_message);
                        });
                    }
                })

            }
        }
    });


    mThis.btnSave.on('click', function (e) {
        e.preventDefault();
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/term/save`, p, null).then(res => {
            if (res.status_code === 200) {
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id
        };
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            if (el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.prepareFormOption = (term_id, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/term/form-options`, { 'id': term_id }, null, false).then(res => {
            let d = {};
            if (res.status_code === 200) {
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elAcademic, d.academic_years, 'id', 'academic_year', null, null, null);
            VSUtil.setComboItems(mThis.elPrevTerm, d.terms, 'id', 'term_name', null, null, null);
            onFinish(d);
        });
    }

    /**
     * items = [] it is select options
     * if items are provided, the api for querying select options is not called again
    */
    this.refreshOptions = (field_name, items = null, def_value = null) => {
        let method_name = '';
        let el = null;
        let text_field = '';
        let value_field = 'id';
        //data_prop is property name of mThis.form_data such as mThis.form_data[data_prop] => example mThis.form_data.categories that is used to remmember categories options
        let data_prop = '';

        switch (field_name) {
            case 'academic_year':
                {
                    el = mThis.elAcademic;
                    text_field = 'academic_year';
                    data_prop = 'academic_years';
                    method_name = 'api/settings/options-academic-year';
                    break;
                }
            default: {
                method_name = 'api/settings/unknown???';
                data_prop = 'unknown';
                break;
            }
        }

        if (items) {
            VSUtil.setComboItems(el, items, value_field, text_field, false, null, null);
            if (def_value) el.val(def_value).trigger('change');
            return;
        }

        vsapi.call(`${main_view.base_url}/${method_name}`, null, null, false).then(res => {
            if (res.status_code === 200) {
                items = StringSanitizer.sanitizeObject(res.data, null, ['academic_year']);
                VSUtil.setComboItems(el, items, 'academic_year', 'academic_year', false, null, null);
                if (def_value) el.val(def_value).trigger('change');
            }
        });
    }

    this.close = () => {
        mThis.self.modal('hide');
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(options.id, d => {
            if (options.term) {
                mThis.elTitle.text(LocaleManager.trans('Modify Term', 'titles'));
            }
            else {
                mThis.elTitle.text(LocaleManager.trans('New Term', 'titles'));
            }
            mThis.setDataForm(d.term);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

let AcademicYearDoalog = new function () {
    let mThis = this;
    this.self = $('#dlgAcadYear');
    this.elTitle = this.self.find('.modal-title');
    this.btnSave = this.self.find('#dlgAcadYear_btnSave');

    this.btnSave.on('click', (e) => {
        e.preventDefault();
        let p = mThis.getFormData();
        vsapi.call(`${main_view.base_url}/api/academic-year/save`, p, null, false).then(res => {
            if (res.status_code === 200) {
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose({ 'academic_years': res.data.academic_years, 'id': res.data.id });
                mThis.self.modal('hide');
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.self.on('show.bs.modal',(e) => {
        e.preventDefault();
        if (mThis.options.previousDialog) mThis.options.previousDialog.close();
    });

    this.self.on('hide.bs.modal', (e) => {
        e.preventDefault();
        let op = mThis.options.previousDialog_options;
        op.term = {
            'ac_year_id': mThis.options.id
        };
        if (mThis.options.previousDialog) mThis.options.previousDialog.show(op);
    });

    this.setFormData = (d) => {
        if (!d) d = {};
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            if (el.is('select')) el.val(d[f]).trigger('change');
            else el.val(d[f]);
        });
    }

    this.getFormData = (d) => {
        if (!d) d = {};
        let p = {};
        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        p.id = mThis.options.id;
        return p;
    }


    this.prepareFormOption = (ac_year_id, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/academic-year/form-options`, { 'id': ac_year_id }, false, false).then(res => {
            if (res.status_code === 200) {
                onFinish(res.data);
            }
        });
    }

    this.show = (options = null) => {
        options = options ? options : {};
        mThis.options = options;
        mThis.prepareFormOption(options.id, d => {
            if (d.academicYearInfo) {
                mThis.elTitle.text(LocaleManager.trans('Edit Acadmic Year'));
            } else {
                mThis.elTitle.text(LocaleManager.trans('New Year'));
            }
            mThis.setFormData(d.academicYearInfo);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',function(){
    TermComponent.init();
});
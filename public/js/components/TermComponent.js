'use strict';
var TermComponent = new function () {
    let mThis = this;
    this.title_prop = 'Term';
    this.self = $('#_main_termComponent');

    this.tblTerm = mThis.self.find('#_trm_tbl');
    this.btnNew = mThis.self.find('#_trm_btn_new');

    this.init = () => {
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

        mThis.tblTerm.on('click', 'a.btn-trm-modify', function (e) {
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayTerm();
                }
            };
            TermDialog.show(op);
        });

        mThis.tblTerm.on('click', 'a.btn-trm-delete', function (e) {
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this term?', { title: 'Delete Term', context: 'delete' }, (e) => {
                if (e) {
                    vsapi.call(`${main_view.base_url}/api/term/delete`, op, null).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayTerm();
                        }
                    });
                }
            });
        });
    }

    this.displayTerm = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/term/list`, null, null).then(res => {
            let data = [];
            if (res.status_code === 200) {
                data = res.data;
            }

            let cols = [{
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
                data: (data, a, b) => {
                    return ['<div class="d-flex flex-column"><p class="">', data.create_user, '</p><p class="text-left text-muted">', data.created_at, '</p></div>'].join('');
                }
            },
            {
                title: "Previous Term",
                data: (data, a, b) => {
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

            if (mThis.table) {
                mThis.tblTerm.DataTable().clear().destroy();
                mThis.tblTerm.empty();
                mThis.table = null;
            }

            if (!mThis.table) {
                mThis.table = mThis.tblTerm.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }

            if (typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.displayTerm(() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast', function () {
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let TermDialog = new function () {
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
                        mThis.refreshOptions('academic_year', d.academic_years, d ? d.id : null);
                    }
                };
                AcademicYearDoalog.show(op);
                return;

            } else if (action === 'edit') {
                op = {
                    'id': mThis.elAcademic.val(),
                    'previousDialog': mThis,
                    'previousDialog_options': mThis.options,
                    'onClose': (d) => {
                        mThis.refreshOptions('academic_year', d.academic_years, d.id, d ? d.id : null);
                    }
                };
                AcademicYearDoalog.show(op);
                return;
            }
            else if (action === 'delete') {
                cv_interact.confirm('Delete this academic year?', { 'context': 'delete', 'title': 'Delete Academic Year' }, e => {
                    if (e) {
                        vsapi.call(`${main_view.base_url}/api/academic-year/delete`, { 'id': mThis.elAcademic.val() }, null, false).then(res => {
                            if (res.status_code === 200) {
                                mThis.refreshOptions('academic_year', res.data.academic_years, null);
                            }
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

    this.btnSave.on('click', e => {
        e.preventDefault();
        let p = mThis.getFormData();
        vsapi.call(`${main_view.base_url}/api/academic-year/save`, p, null, false).then(res => {
            if (res.status_code === 200) {
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose({ 'academic_years': res.data.academic_years, 'id': res.data.id });
                mThis.self.modal('hide');
            } else cv_interact.error(res.error_message);
        });
    });

    this.self.on('show.bs.modal', e => {
        if (mThis.options.previousDialog) mThis.options.previousDialog.close();
    });

    this.self.on('hide.bs.modal', e => {
        let op = mThis.options.previousDialog_options;
        op.term = { 'ac_year_id': mThis.options.id };
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
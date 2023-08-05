'use strict';
var TermComponent = new function(){
    let mThis = this;
    this.title_prop = 'Term';
    this.self = $('#_main_termComponent');

    this.tblTerm = mThis.self.find('#_trm_tbl');
    this.btnNew = mThis.self.find('#_trm_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayTerm();
                }
            };
            TermDialog.show(op);
        });

        mThis.tblTerm.on('click','a.btn-trm-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayTerm();
                }
            };
            TermDialog.show(op);
        });

        mThis.tblTerm.on('click','a.btn-trm-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this term?',{ title: 'Delete Term', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/term/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayTerm();
                        }
                    });
                }
            });
        });
    }

    this.displayTerm = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/term/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Name",
                data: "name"
            },
            {
                title: "Period Type",
                data: "period_type"
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
                data: "create_user"
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

            if(mThis.table){
                mThis.tblTerm.DataTable().clear().destroy();
                mThis.tblTerm.empty();
                mThis.table = null;
            }

            if(!mThis.table){
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

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayTerm(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let TermDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_trm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_trm_btn_save');
    this.elAcademic = mThis.self.find('#dlg_trm_academic');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/term/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id
        };
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.prepareFormOption = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elAcademic,d,'academic_year','academic_year',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.loadFormDetail = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/term/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        
        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Term','titles'));
                mThis.loadFormDetail(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Term','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    TermComponent.init();
});
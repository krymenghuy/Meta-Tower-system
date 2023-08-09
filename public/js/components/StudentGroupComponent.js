'use strict';
var StudentGroupComponent = new function(){
    let mThis = this;
    this.title_prop = 'Student Group';
    this.self = $('#_main_studentGroupComponent');

    this.tblStudentGroup = mThis.self.find('#_sdg_tbl');
    this.btnNew = mThis.self.find('#_sdg_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayStudentGroup();
                }
            };
            StudentGroupDialog.show(op);
        });

        mThis.tblStudentGroup.on('click','a.btn-sdg-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayStudentGroup();
                }
            };
            StudentGroupDialog.show(op);
        });

        mThis.tblStudentGroup.on('click','a.btn-sdg-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this group?',{title: 'Delete Group', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/student-group/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayStudentGroup();
                        }
                    });
                }
            });
        });
    }

    this.displayStudentGroup = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/student-group/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Name",
                data: "name"
            },
            {
                title: "Program Type",
                data: "program_type"
            },
            {
                title: "Session",
                data: "session"
            },
            {
                title: "Level",
                data: "level"
            },
            {
                title: "Total Student",
                data: "total_students"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-sdg-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-sdg-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblStudentGroup.DataTable().clear().destroy();
                mThis.tblStudentGroup.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblStudentGroup.DataTable({
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
                        loadingRecords: '&nbsp;',
                        processing: 'Loading...',
                        emptyTable: LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        row.setAttribute('data-id',data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayStudentGroup(() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            if(x.length === 0){
                mThis.self.hide().fadeIn(300);
                return;
            }
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let StudentGroupDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_sdg_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.elSession = mThis.self.find('#dlg_sdg_session');
    this.elLevel = mThis.self.find('#dlg_sdg_level');
    this.btnSave = mThis.self.find('#dlg_sdg_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/student-group/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose();
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

    this.loadFormDetail = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/student-group/details`,{'id': options.id},null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setDataForm(d);
        });
    }

    this.prepareFormOption = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elSession,d.sessions,'id','name',null,null,null);
            VSUtil.setComboItems(mThis.elLevel,d.levels,'id','level',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Student Group','titles'));
                mThis.loadFormDetail(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Student Group','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentGroupComponent.init();
});
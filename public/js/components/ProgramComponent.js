'use strict';
var ProgramComponent = new function(){
    let mThis = this;
    this.title_prop = "Program";
    this.self = $('#_main_programComponent');

    this.tblProgram = mThis.self.find('#_pgm_tbl');
    this.btnNew = mThis.self.find('#_pgm_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayProgram();
                }
            };
            ProgramDialog.show(op);
        });

        mThis.tblProgram.on('click','a.btn-pgm-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayProgram();
                }
            };
            ProgramDialog.show(op);
        });
    }

    this.displayProgram = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/program/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Name",
                data: "name"
            },
            {
                title: "Department",
                data: "department"
            },
            {
                title: "Created",
                data: "create_user"
            },
            {
                title: "Date",
                data: "date"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-pgm-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-pgm-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblProgram.DataTable().clear().destroy();
                mThis.tblProgram.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblProgram.DataTable({
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
        mThis.displayProgram(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ProgramDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_pgm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_pgm_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/program/save`,p,null).then(res => {
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
            el.val(d[f]);
        });
    }

    this.loadFormDetails = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/program/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        
        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Modify','titles'));
            mThis.loadFormDetails(options);
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('New','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop:'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ProgramComponent.init();
});
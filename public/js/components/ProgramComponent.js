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

        mThis.tblProgram.on('click','a.btn-pgm-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this program?',{title: 'Delete Program', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/program/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayProgram();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        mThis.cfg = new ExpandableRowConfig('_pgm_tbl', {
            'dontExpandByClickingOn': ['btn-pgm-modify', 'btn-pgm-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                if(id > 0)
                    mThis.displayProgramLevel(detail_tr, id);
            }
        });
    }

    this.displayProgramLevel = (tr, id) => {
        let tr_id = ['_pgm_tbl_detail_',id].join('');
        tr.setAttribute('id', tr_id);
        let div_wrapper = $(tr).find('.expandable-row-container');
        let html = null;

        div_wrapper.empty();

        window.vsapi.call(`${main_view.base_url}/api/program/levels`,{'id': id},null).then(res => {
            let data = [];

            if(res.status_code === 200){
                data = res.data;
            }

            html = [`<div class="rounded-3 p-3 bg-white">
                <button data-programid="${id}" class="btn-add-level btn btn-sm btn-outline-primary btn-sm" type="button">
                    <span class="trans-text">${LocaleManager.trans('Add Level','buttons')}</span>
                </button>
            </div>
            <div class="table-responsive p-2">
            <table class="table tbl_pgm_level">
            <thead>
                <tr>
                    <th>Level</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>`].join('');

            html = [html,`</table></div>`].join('');
            div_wrapper.html(html);

            let tbody = div_wrapper.find('table.tbl_pgm_level > tbody');

            div_wrapper.find('.btn-add-level').on('click',function(e){
                e.preventDefault();
                let prog_id = $(this).data('programid');
                let op = {
                    'id': null,
                    'program_id':prog_id,
                    'onClose': (levels) => {
                        mThis.renderProgramLevels(tbody,levels);
                    }
                };
                ProgramLevelDialog.show(op);
            });

            mThis.renderProgramLevels(tbody, data);
        });
    }

    this.setActionHandlers = (tbody) => {
        tbody.on('click','.btn-pgm-detail-modify',function(e){
            e.preventDefault();
            let prog_id = $(this).data('programid');
            let op = {
                'id': $(this).data('id'),
                'program_id':prog_id,
                'onClose': (levels) => {
                    mThis.renderProgramLevels(tbody,levels);
                }
            };
            ProgramLevelDialog.show(op);
        });
 
        tbody.on('click','a.btn-pgm-detail-delete',function(e){
            e.preventDefault();
            let x = $(this);
            let prog_id = x.data('programid');
            let p = {
                'program_id':prog_id,
                'id':x.data('id')
            };
            cv_interact.confirm('Delete this level?',{title: 'Delete Level', context: 'delete'},e => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/program-level/delete`,p,null,false).then(res => {
                        if(res.status_code === 200){
                            mThis.renderProgramLevels(tbody,res.data.levels)
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.renderProgramLevels = (tbody, data) => {
        let html = null;
        if(!data) data = [];
        data.map(level => {
            html = [html,`<tr>
                <td>${level.name}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-pgm-detail-modify" data-programid ="${level.program_id}" data-id="${level.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-pgm-detail-delete" data-programid ="${level.program_id}" data-id="${level.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>
                </td>
            </tr>`].join('');
        });
        tbody.html(html);
        mThis.setActionHandlers(tbody);
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
                        row.setAttribute('data-id',data.id);
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
    this.elProgram = mThis.self.find('#dlg_pgm_program');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/program/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose(res.data.levels);
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id,
            'program_id':mThis.options.program_id
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

    this.prepareFormOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/option/prev-program`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elProgram,d,'id','program',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        
        mThis.prepareFormOptions(() => {
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
        });
    }
}

let ProgramLevelDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_detail_pgm_');
    this.options = {};

    this.btnSave = this.self.find('#dlg_pgm_detail_btn_save');
    this.elTitle = mThis.self.find('.modal-title');
    this.elLevel = mThis.self.find('#dlg_detail_pgm_level');
    
    this.btnSave.on('click',function(){
        let p =mThis.getDataForm();

        window.vsapi.call(`${main_view.base_url}/api/program-level/save`,p,null,false).then(res=>{
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose(res.data.levels);
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id,
            'program_id':mThis.options.program_id
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
        window.vsapi.call(`${main_view.base_url}/api/program-level/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/option/prev-program-level`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elLevel,d,'id','level',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify','titles'));
                mThis.loadFormDetails(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ProgramComponent.init();
});
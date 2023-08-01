'use strict';
var CampusComponent = new function(){
    let mThis = this;
    this.title_prop = 'Campus';
    this.self = $('#_main_campusComponent');

    this.tblCampus = mThis.self.find('#_cps_tbl');
    this.btnNew = mThis.self.find('#_cps_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayCampus();
                }
            };
            CampusDialog.show(op);
        });

        mThis.tblCampus.on('click','a.btn-cps-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayCampus();
                }
            };
            CampusDialog.show(op);
        });

        mThis.tblCampus.on('click','a.btn-cps-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this campus?',{title: 'Delete Campus', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayCampus();
                        }
                    });
                }
            });
        });
    }

    this.displayCampus = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/campus/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Name",
                data: "name"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-cps-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-cps-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblCampus.DataTable().clear().destroy();
                mThis.tblCampus.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblCampus.DataTable({
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
        mThis.displayCampus(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let CampusDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_cps_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_cps_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/campus/save`,p,null).then(res => {
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
            el.val(d[f]);
        });
    }

    this.loadFormDetail = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/campus/details`,{'id': options.id},null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setDataForm(d);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Modify Campus','titles'));
            mThis.loadFormDetail(options);
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('New Campus','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    CampusComponent.init();
});
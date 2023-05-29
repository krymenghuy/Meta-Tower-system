"use strict";
var TuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Tuition Fee";
    this.self = $('#_main_tuitionFeeComponent');
    
    this.tblTuitionFee = mThis.self.find('.tbl-ttf');
    this.btnAdd = mThis.self.find('.btn--add');

    this.init = () => {
        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': (e) => {
                    if(e){
                        mThis.displayTuitionFee();
                    }
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-duplicate',function(e){
            e.preventDefault();
            console.log("Clicked Duplicate");
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': (e) => {
                    if(e){
                        mThis.displayTuitionFee();
                    }
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this tuition fee?',{title: 'Delete Tuition Fee', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayTuitionFee();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });
    }

    this.displayTuitionFee = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            
            let cols = [{
                title: "Name",
                data: "name"
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
                data: "created_by"
            },
            {
                title: "Authorized By",
                data: "authorized_by"
            },
            {
                title: "Status",
                data: "status"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-ttf-duplicate" data-id="${data.id}">
                            <i class="fa-regular fa-clone text-primary fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ttf-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ttf-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblTuitionFee.DataTable().clear().destroy();
                mThis.tblTuitionFee.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblTuitionFee.DataTable({
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
        mThis.displayTuitionFee(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let TuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__ttf');

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('.btn--save');

    this.options = {};

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/`,p,null).then(res => {
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
        let id = mThis.options.id ? mThis.options.id : 0;
        let p = {'id': id};
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

    this.loadDataEdit = (id, onFinish) => {
        let op = {'id': id};
        window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            onFinish && onFinish(data);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Edit Price List','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check item details before editing','titles'));
            mThis.loadDataEdit(options.id, (data) => {
                mThis.setDataForm(data);
            });
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('Add Price List','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input tuition fee details','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    TuitionFeeComponent.init();
});
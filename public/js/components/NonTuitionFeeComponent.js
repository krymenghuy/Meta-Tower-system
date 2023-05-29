"use strict";
var NonTuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Non-tuition Fee";
    this.self = $('#_main_nonTuitionFeeComponent');

    this.tblNonTuitionFee = mThis.self.find('.tbl_ntf');
    this.btnAdd = mThis.self.find('.btn--add');

    this.init = () => {
        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': (e) => {
                    if(e){
                        mThis.displayNonTuitionFee();
                    }
                }
            };
            NonTuitionFeeOutsideDialog.show(op);
        });

        mThis.tblNonTuitionFee.on('click','a.btn-ntf-duplicate',function(e){
            e.preventDefault();
            console.log("Clicked Duplicate!");
        });

        mThis.tblNonTuitionFee.on('click','a.btn-ntf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': (e) => {
                    if(e){
                        mThis.displayNonTuitionFee();
                    }
                }
            };
            NonTuitionFeeOutsideDialog.show(op);
        });

        mThis.tblNonTuitionFee.on('click','a.btn-ntf-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this Fee Type',{title: 'Delete Fee Type', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayNonTuitionFee();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });
    }

    this.displayNonTuitionFee = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cols = [{
                title: "Fee Type",
                data: "fee_type"
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
                        <a href="javascript:void(0)" class="btn-ntf-duplicate" data-id="${data.id}">
                            <i class="fa-solid fa-clone text-primary"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ntf-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ntf-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can text-danger"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblNonTuitionFee.DataTable().clear().destroy();
                mThis.tblNonTuitionFee.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblNonTuitionFee.DataTable({
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
        mThis.displayNonTuitionFee(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let NonTuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__ntf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('.btn--save');

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
            mThis.elTitle.text(LocaleManager.trans('Modify Fee Type List','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check fee type details before editing','titles'));
            mThis.loadDataEdit(options.id, (data) => {
                mThis.setDataForm(data);
            });
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('Add Fee Type List','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input fee type details','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    NonTuitionFeeComponent.init();
});
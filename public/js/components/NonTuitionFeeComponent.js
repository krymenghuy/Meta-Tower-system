"use strict";
var NonTuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Non-tuition Fee";
    this.self = $('#_main_nonTuitionFeeComponent');

    this.tblNonTuitionFee = mThis.self.find('#tbl_ntf');
    this.btnAdd = mThis.self.find('#ntf_btn_add');
    this.elSearch = mThis.self.find('#el_ntf_search');

    this.init = () => {
        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayNonTuitionFee();
                }
            };
            NonTuitionFeeOutsideDialog.show(op);
        });

        mThis.tblNonTuitionFee.on('click','a.btn-ntf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayNonTuitionFee();
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
                    vsapi.call(`${main_view.base_url}/api/other-fee/delete`,op,null).then(res => {
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

        new SearchData(mThis.elSearch,mThis.tblNonTuitionFee);
    }

    this.displayNonTuitionFee = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/other-fee/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cols = [{
                title: "Fee Type",
                data: "name"
            },
            {
                title: "Program",
                data: "program_name"
            },
            {
                title: "Amount",
                data: (data, a, b) => {
                    let amount = data.amount ? data.amount : '', currency = data.currency_code ? data.currency_code : '';
                    return [amount,currency].join(' ');
                }
            },
            {
                title: "Academic Year",
                data: "academic_year"
            },
            {
                title: "Created By",
                data: (data, a, b) => {
                    let user = data.create_user ? data.create_user : '', date = data.created_at ? data.created_at : '';

                    return [`<p class="pb-0 mb-0">${user}</p>
                    <p class="pb-0 mb-0">${date}</p>`].join('');
                }
            },
            {
                title: "Authorized By",
                data: (data, a, b) => {
                    let user = data.auth_user ? data.auth_user : '', date = data.auth_date ? data.auth_date : '';

                    return [`<p class="pb-0 mb-0">${user}</p>
                    <p class="pb-0 mb-0">${date}</p>`].join('');
                }
            },
            {
                title: "Description",
                data: "description"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-ntf-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ntf-delete" data-id="${data.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
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
        mThis.displayNonTuitionFee(() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let NonTuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_ntf');
    this.options = {};
    let ref = {
        click: true
    };

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_ntf_btn_save');
    this.elProgram = mThis.self.find('#dlg_ntf_program');
    this.elAcademic = mThis.self.find('#dlg_ntf_academic');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/other-fee/save`,p,null).then(res => {
                ref.click = false;
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function')
                        mThis.options.onClose();
                    ref.click = true;
                }
                else{
                    cv_interact.error(res.error_message);
                    ref.click = true;
                }
            });
        }
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

    this.loadDataEdit = (options) => {
        vsapi.call(`${main_view.base_url}/api/other-fee/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data,null,['academic_year']);
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOption = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',null,null,null);
            VSUtil.setComboItems(mThis.elAcademic,d.academic_year,'academic_year','academic_year',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Fee Type List','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check fee type details before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Fee Type List','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input fee type details','titles'));
                mThis.setDataForm(null);
            }

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    NonTuitionFeeComponent.init();
});
"use strict";
var DepositFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Deposit Fee";
    this.self = $('#_main_depositFeeComponent');

    this.tblDepositFee = mThis.self.find('#tbl_dpf_');
    this.btnNew = mThis.self.find('#dpf_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': (e) => {
                    if(e){
                        mThis.displayDepositFee();
                    }
                }
            };
            DepositFeeDialog.show(op);
        });
    }

    this.displayDepositFee = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/deposite/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cols = [{
                title: "Student Name",
                data: "student_name"
            },
            {
                title: "Class",
                data: "level"
            },
            {
                title: "Parent Phone",
                data: "parent_phone"
            },
            {
                title: "Date of Birth",
                data: "date_of_birth"
            },
            {
                title: "Expire Date",
                data: "expire_date"
            },
            {
                title: "Amount",
                data: (data, a, b) => {
                    let cur_symbol = data.cur_symbol ? data.cur_symbol : '', amount = data.amount ? data.amount : '';
                    return [`${cur_symbol} ${amount}`].join('');
                }
            },
            {
                title: "Status",
                data: (data, a, b) => {
                    let status = data.status ? data.status : '';
                    return [`<span class="p-2 bg-success rounded-3 text-white text-capitalize">${status}</span>`].join('');
                }
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-dpf-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-dpf-delete" data-id="${data.id}" style="display: ${data.status == 'approval' ? `none`: `block`}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblDepositFee.DataTable().clear().destroy();
                mThis.tblDepositFee.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblDepositFee.DataTable({
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
        mThis.displayDepositFee(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let DepositFeeDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_dpf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnTab = mThis.self.find('.btn-tab');
    this.btnSave = mThis.self.find('.btn--save');

    this.div_newStudent = mThis.self.find('.dpf-new-student');
    this.div_oldStudent = mThis.self.find('.dpf-old-student');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = {};

        if(mThis.options.dn === 'new'){
            p = mThis.getDataForm(mThis.div_newStudent);
        }
        else if(mThis.options.dn === 'old'){
            p = mThis.getDataForm(mThis.div_oldStudent);
        }

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

    mThis.btnTab.on('click',function(e){
        e.preventDefault();
        $(this).parent().addClass('div--tab-inner').siblings().removeClass('div--tab-inner');
        mThis.options.dn = $(this).data('name');
        mThis.togglePanel(mThis.options.dn);
    });

    this.togglePanel = (value) => {
        switch(value){
            case 'new':{
                mThis.setDataForm(null, mThis.div_newStudent, () => {
                    mThis.div_newStudent.show('slow').siblings().hide('slow');
                });
                break;
            }
            case 'old':{
                mThis.setDataForm(null, mThis.div_oldStudent, () => {
                    mThis.div_oldStudent.show('slow').siblings().hide('slow');
                });
                break;
            }
            default:{
                return false;
            }
        }
    }

    this.getDataForm = (div) => {
        let id = mThis.options.id ? mThis.options.id : 0;
        let p = {'id': id};

        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d, div, onFinish) => {
        d = d ? d : {};
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select')){
                el.val(d[f]).trigger('change');
            }
            else{
                el.val(d[f]);
            }
        });

        if(typeof onFinish === 'function') onFinish();
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        mThis.options.dn = 'new';

        if(options.id > 0){}
        else{
            mThis.elTitle.text(LocaleManager.trans('New Deposit','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input deposit details','titles'));
        }

        mThis.self.modal({
            backdrop: 'static'
        })
    }
}

window.addEventListener('DOMContentLoaded',() => {
    DepositFeeComponent.init();
});
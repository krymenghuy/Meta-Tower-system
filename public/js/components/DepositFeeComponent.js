"use strict";
var DepositFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Deposit Fee";
    this.self = $('#_main_depositFeeComponent');

    this.tblDepositFee = mThis.self.find('#tbl_dpf_');
    this.btnNew = mThis.self.find('#dpf_btn_new');
    this.elSearch = mThis.self.find('#_dpf_elSearch');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayDepositFee();
                }
            };
            DepositFeeDialog.show(op);
        });

        mThis.tblDepositFee.on('click','a.btn-dpf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayDepositFee();
                }
            };
            DepositFeeDialog.show(op);
        });

        mThis.tblDepositFee.on('click','a.btn-dpf-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this deposit?',{title: 'Delete Deposit', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/deposite/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayDepositFee();
                        }
                    });
                }
            });
        });
    }

    this.displayDepositFee = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/deposite/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cols = [{
                title: "Student Name",
                className: 'text-capitalize',
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
                data: (data, a, b) => {
                    let dob = data.date_of_birth ? data.date_of_birth : '';
                    return new Date(dob).toLocaleDateString('km-KH',{
                        'day':'numeric',
                        'month':'short',
                        'year':'numeric'
                    }).replaceAll(' ','-').replace(',','');
                }
            },
            {
                title: "Expire Date",
                data: (data, a, b) => {
                    let expire_date = data.expire_date ? data.expire_date : '';
                    return new Date(expire_date).toLocaleDateString('km-KH',{
                        'day':'numeric',
                        'month':'short',
                        'year':'numeric'
                    }).replaceAll(' ','-').replace(',','');
                }
            },
            {
                title: "Amount",
                data: (data, a, b) => {
                    let cur_symbol = data.cur_symbol ? data.cur_symbol : '$', amount = data.amount ? data.amount : '';
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
                    createdRow: function (row, data, dataIndex){
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }
            this.search = new SearchData(mThis.elSearch,mThis.tblDepositFee);

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayDepositFee(() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let DepositFeeDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_dpf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnTab = mThis.self.find('.btn-tab');
    this.btnSave = mThis.self.find('#dlg_dpf_btn_save');

    this.div_newStudent = mThis.self.find('#dpf-new-student');
    this.div_oldStudent = mThis.self.find('#dpf-old-student');
    this.elStudent = mThis.div_oldStudent.find('#dlg_dpf_student');
    
    mThis.elStudent.on('change',function(e){
        e.preventDefault();
        let id = $(this).val();
        if(id > 0){
            vsapi.call(`${main_view.base_url}/api/deposite/student-info`,{'id': id},null,false).then(res => {
                let data = {};
                if(res.status_code === 200){
                    data = res.data;
                }
                mThis.setDataForm(data,mThis.div_oldStudent);
            });
        }
    });

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = null;

        if(mThis.options.dn === 'new'){
            p = mThis.getDataForm(mThis.div_newStudent,false);
        }
        else if(mThis.options.dn === 'old'){
            p = mThis.getDataForm(mThis.div_oldStudent,false);
        }
        if(!p) return;

        if(p.student_id) delete(p.id);

        vsapi.call(`${main_view.base_url}/api/deposite/save`,p,null).then(res => {
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
                mThis.prepareFormOptionOld(() => {
                    mThis.setDataForm(null, mThis.div_oldStudent, () => {
                        mThis.div_oldStudent.show('slow').siblings().hide('slow');
                    });
                });
                break;
            }
            default:{
                return false;
            }
        }
    }

    this.setOptionsOld = (div, d) => {
        d = d ? d : {};
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            switch(f){
                case 'campus_id':
                    VSUtil.setComboItems(el,d.options_campus,'id','campus_name',null,null,null);
                    break;
                case 'level_id':
                    VSUtil.setComboItems(el,d.options_program_level,'id','level',null,null,null);
                    break;
                case 'session_id':
                    VSUtil.setComboItems(el,d.options_session,'id','session',null,null,null);
                    break;
                case 'student_id':
                    VSUtil.setComboItems(el,d.options_student,'id','student_name',null,null,null);
                    break;
                default:
                    break;
            }
        });
    }

    this.prepareFormOptionOld = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/settings/deposite-options`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setOptionsOld(mThis.div_oldStudent,d);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.getDataForm = (div,slient=false) => {
        let p = {
            'id': mThis.options.id ? mThis.options.id : 0
        };
        let has_error = false;
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                if(!slient) cv_interact.warning([Validator.properCase(f),' is not correct'].join(''));
                has_error = true;
                return false;
            }

            if(f === 'student_id')
                p['student_name'] = el.find(':selected').text();
            p[f] = el.val();
        });
        return has_error? null:p;
    }

    this.setDataForm = (d=null, div, onFinish=null) => {
        d = d ? d : {};
        Validator.clearErrors(div);
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(f !== 'student_id'){
                if(el.is('select')){
                    el.val(d[f]).trigger('change');
                }
                else{
                    el.val(d[f]);
                }
            }
        });

        if(typeof onFinish === 'function') onFinish();
    }

    this.setOptionsNew = (div, d) => {
        d = d ? d : {};
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            switch(f){
                case 'campus_id':
                    VSUtil.setComboItems(el,d.campuses,'id','campus',null,null,null);
                    break;
                case 'level_id':
                    VSUtil.setComboItems(el,d.levels,'id','level',null,null,null);
                    break;
                case 'session_id':
                    VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                    break;
                default:
                    break;
            }
        });
    }

    this.prepareFormOptionNew = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setOptionsNew(mThis.div_newStudent,d);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.loadFormDetails = (options) => {
        mThis.self.find('.div--tab').removeClass('d-flex').hide();
        mThis.div_newStudent.show().siblings().hide();
        vsapi.call(`${main_view.base_url}/api/deposite/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data,mThis.div_newStudent);
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        mThis.options.dn = 'new';

        mThis.prepareFormOptionNew(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Deposit','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input deposit details','titles'));
                mThis.loadFormDetails(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Deposit','titles'));
                mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input deposit details','titles'));
                mThis.self.find('.div--tab').addClass('d-flex').show();
                mThis.setDataForm(null,mThis.div_newStudent);
                mThis.setDataForm(null,mThis.div_oldStudent);
            }

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    DepositFeeComponent.init();
});
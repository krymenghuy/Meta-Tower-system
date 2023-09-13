"use strict";
var DepositFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Deposits";
    this.self = main_view.appContent.children('#_main_depositFeeComponent');

    this.tblDepositFee ={};
    this.btnNew = mThis.self.find('#dpf_btn_new');
    this.elSearch = mThis.self.find('#_dpf_elSearch');

    this.cols = [
    {
        title: "Student Name",
        className: 'align-middle text-capitalize',
        data: "student_name"
    },
    {
        title: "Class",
        className: 'align-middle text-capitalize',
        data: "level"
    },
    {
        title: "Parent Phone",
        className: 'align-middle text-capitalize',
        data: "parent_phone"
    },
    {
        title: "Date of Birth",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
            return data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replace(',','') : '';
        }
    },
    {
        title: "Expire Date",
        className: 'align-middle text-capitalize',
        data: (data, index, tr) => {
            return data.expire_date ? new Date(data.expire_date).toLocaleDateString('km-KH',{
                'day':'numeric',
                'month':'short',
                'year':'numeric'
            }).replace(',','') : '';
        }
    },
    {
        title: "Amount",
        className: 'align-middle text-capitalize',
        data: (data, a, b) => {
            const cur_symbol = data.cur_symbol ? data.cur_symbol : '$', amount = data.amount ? data.amount : '0';
            return [cur_symbol, amount].join(' ');
        }
    },
    {
        title: "Status",
        className: 'align-middle text-capitalize',
        data: (data, a, b) => {
            const status = data.status ? data.status : '';
            return [`<span class="p-2 bg-success rounded-3 text-white text-capitalize">${status}</span>`].join('');
        }
    },
    {
        title: "Action",
        className: 'align-middle text-capitalize',
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

    this.init = () => {
        mThis.depositFeeListView = new ListView('_deposit_fee_list',{
            'fetchApi':`${main_view.base_url}/api/deposit/list-paginate`,
            'perPage':5,
            'columns':mThis.cols,
            // 'renderItems':(items,list_container) => {
            //     mThis.renderStudents(list_container,items);
            // },
            'listContainerClass':null
        });

        mThis.tblDepositFee = $(mThis.depositFeeListView.getTable());

        mThis.elSearch.on('keyup',(e) => {
            e.preventDefault();
            mThis.depositFeeListView.showPage(mThis.getFilterData()); 
        });

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

        mThis.tblDepositFee.on('click',(e) => {
            e.preventDefault();
            let lnk = VSUtil.clickOnClass(e.target,'btn-dpf-modify');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id,
                    'onClose': () => {
                        mThis.depositFeeListView.showPage(mThis.getFilterData());
                    }
                };
                DepositFeeDialog.show(op);
                return;
            }

            lnk = VSUtil.clickOnClass(e.target,'btn-dpf-delete');
            if(lnk){

                let op = {
                    'id': lnk.dataset.id
                };
                cv_interact.confirm('Delete this deposit?',{title: 'Delete Deposit', context: 'delete'},(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/deposit/delete`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.depositFeeListView.showPage(mThis.getFilterData());
                            }
                        });
                    }
                });
                return;
            }
        });      
    }
 
    this.getFilterData =()=>{
        return {'search_value':mThis.elSearch.val()};
    }
    
    this.show = (options) => {
        if(!options) options = {};
        mThis.depositFeeListView.showPage(mThis.getFilterData(),null,()=>{
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

const DepositFeeDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_dpf');
    this.options = {};
    let ref = {
        click: true
    };

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
            vsapi.call(`${main_view.base_url}/api/deposit/student-info`,{'id': id},null,false).then(res => {
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

        if(p.student_id) delete(p.id);

        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/deposit/save`,p,null).then(res => {
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
        vsapi.call(`${main_view.base_url}/api/settings/deposit-options`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setOptionsOld(mThis.div_oldStudent,d);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.getDataForm = (div) => {
        let p = {
            'id': mThis.options.id ? mThis.options.id : 0
        };
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(f === 'student_id')
                p['student_name'] = el.find(':selected').text();
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d=null, div, onFinish=null) => {
        d = d ? d : {};
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
        vsapi.call(`${main_view.base_url}/api/deposit/details`,{'id': options.id},null).then(res => {
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
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input deposit details','titles'));
                mThis.loadFormDetails(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Deposit','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input deposit details','titles'));
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
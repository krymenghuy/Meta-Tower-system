"use strict";
var NonTuitionFeeComponent = new function(){
    let mThis = this;
    this.currency_code ='USD';
    this.title_prop = "Non-tuition Fee";
    this.self = main_view.appContent.children('#_main_nonTuitionFeeComponent');

    this.tblNonTuitionFee = mThis.self.find('#tbl_ntf');
    this.btnAdd = mThis.self.find('#ntf_btn_add');
    this.elSearch = mThis.self.find('#el_ntf_search');

    this.cols = [{
        title: "Fee Type",
        data: (data,index,tr)=>{
            return [`<span class="fw-semibold">`,data.name,`</span>`].join('');
        }
    },
    {
        title: "Program",
        data:  (data,index,tr)=>{
            return [`<span class="">`,data.program_name?data.program_name:'NA',`</span>`].join('');
        }
    },
    {
        title: "Amount",
        data: (data, a, b) => {
            let amount = data.amount ? data.amount : '', currency_code = data.currency_code ? data.currency_code : '';
            return ['<span class="d-block fw-semibold">',amount,currency_code,'</span></span class="text-primary text-left">',data.amount_input_mode,'</span>'].join(' ');
        }
    },
    {
        title: "Academic Year",
        data: "academic_year"
    },
    {
        title: "Description",
        data: (data,index,tr)=>{
            return data.description?data.description:'NA';
        }
    },
    {
        title: "Last Updated",
        data: (data, a, b) => {
            //let user = data.update_user ? data.update_user : '', date = data.updated_at ? data.updated_at : '';
            return [`<p class="pb-0 mb-0">`,data.update_user,`</p>
            <p class="pb-0 mb-0"><small>`,data.updated_at,`</small></p>`].join('');
        }
    },
    {
        title: "Authorization",
        data: (data, a, b) => {
            let user = data.authorized ==1? data.auth_user: '';
            let date = data.authorized ==1? data.auth_date : '';
            return [`<p class="pb-0 mb-0">`,user,`</p>
            <p class="pb-0 mb-0"><small>`,date,`</small></p>`].join('');
        }
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

    this.init = () => {

        mThis.feeListView = new ListView('_ntf_list',{
            'fetchApi':`${main_view.base_url}/api/other-fee/list-paginate`,
            'columns':mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });

        mThis.tblNonTuitionFee = $(mThis.feeListView.getTable());
 
        mThis.elSearch.on('keyup',(e)=>{
            e.preventDefault();
            mThis.feeListView.showPage(mThis.getFilterData());
        });

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.feeListView.showPage(mThis.getFilterData());
                }
            };
            NonTuitionFeeOutsideDialog.show(op);
        });

        mThis.tblNonTuitionFee.on('click','a.btn-ntf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.feeListView.showPage(mThis.getFilterData());
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
                            mThis.feeListView.showPage(mThis.getFilterData());
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        //new SearchData(mThis.elSearch,mThis.tblNonTuitionFee);
    }
 
    this.getFilterData = ()=>{
        return {'search_value':mThis.elSearch.val()};
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.feeListView.showPage(mThis.getFilterData());
        main_view.setTitle(mThis.title_prop);
        let x = mThis.self.siblings(':visible');
        x.hide(0,function(){
            mThis.self.hide().fadeIn(200);
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
    //this.elAcademic = mThis.self.find('#dlg_ntf_academic');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/other-fee/save`,p,mThis.btnSave).then(res => {
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
        d.currency_code = d.currency_code?d.currency_code: NonTuitionFeeComponent.currency_code;
        d.amount_input_mode?d.amount_input_mode:'auto';
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
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',true,'None',0);
            //VSUtil.setComboItems(mThis.elAcademic,d.academic_year,'academic_year','academic_year',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify Fee Item','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check fee type details before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Fee Item','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input fee type details','titles'));
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
"use strict";
var TuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Tuition Fee";
    this.self = main_view.appContent.children('#_main_tuitionFeeComponent');
    
    this.btnAdd = mThis.self.find('#ttf_btn_add');
    this.btnFind = this.self.find('#ttf_btn_find');
    this.elSearch = mThis.self.find('#ttf_search');
    this.elFilter_academic_year = this.self.find('#_ttf_filter_acad_year');

    this.cols = [{
        title: "Price List",
        data: "name"
    },
    {
        title: "Date Range",
        data:(data,index,tr)=>{
            return [`<span class="border rounded-3 p-2">`,data.start_date,'</span> to <span class="border rounded-3 p-2">',data.end_date,'<span>'].join('');
        }
    },
    {
        title: "Applied To",
        data: (data,index,tr)=>{
            const cls_class = data.use_case_count>0? 'text-danger':'text-muted'; 
            return [`<span class="`,cls_class,`">`,data.use_case_count,` students</span>`].join('');
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
        title: "Created By",
        data: (data, index, tr) => {
            let user = data.update_user ? data.update_user : '';
            let date = data.updated_at ? data.updated_at : '';
            return [`<p class="pb-0 mb-0">${user}</p>
            <p class="pb-0 mb-0"><small>${date}</small></p>`].join('');
        }
    },
    {
        title: "Authorization",
        data: (data, index, tr) => {
            let user = data.authorized ==1? data.auth_user:null;
            if(data.authorized ==1 && !user) user = data.update_user;
            let date = data.authorized ==1? data.auth_date:null;
            return [`<p class="pb-0 mb-0">`,user?user:'Unknown',`</p>
            <p class="pb-0 mb-0"><small>`,date,`</small></p>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-ttf-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                </a>
                <a href="javascript:void(0)" class="btn-ttf-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('_ttf_tbl',{
            'fetchApi':`${main_view.base_url}/api/price-list/list-paginate`,
            'columns':mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });

        mThis.tblTuitionFee = $(mThis.itemView.getTable());

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage({'search_value': $(this).val()});
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.itemView.showPage({'search_value': $(this).val()});
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
                    vsapi.call(`${main_view.base_url}/api/price-list/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage({'search_value': $(this).val()});
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_ttf_tbl_table',{
            'dontExpandByClickingOn': ['btn-ttf-modify', 'btn-ttf-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                if(id > 0)
                    mThis.displayPriceListItem(detail_tr, id);
            }
        });

        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            if(e.keyCode === 13)
                mThis.itemView.showPage({'search_value': $(this).val()});
        });

        new SearchData(mThis.elSearch,mThis.tblTuitionFee);
    }

    this.displayPriceListItem = (tr, id) => {
        let wrapper_id = ['tbl_ttf_item',id].join('_');
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.attr('id',wrapper_id);

        div_wrapper.empty();
        let html = null;
        let btn_id = [wrapper_id,'btn',id].join('_');

        vsapi.call(`${main_view.base_url}/api/price-list/items`,{'id': id},null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            html = [`<div class="p-3 rounded-3 bg-white">
                <button id="${btn_id}" class="btn btn-outline-primary btn-sm border rounded-5" type="button">
                    <span class="trans-text text-nowrap" data-langprop="buttons.Add Pricing Option"></span>
                </button>
            </div>
            <div class="table-responsive p-2">
                <table class="tbl_tff_item table">
                    <thead>
                        <th>Program</th>
                        <th>Session</th>
                        <th>Price</th>
                        <th>Action</th>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`].join('');

            div_wrapper.html(html);
            div_wrapper.find(`#${btn_id}`).on('click',function(e){
                e.preventDefault();
                let op = {
                    'id': 0,
                    'list_id': id,
                    'onClose': (d) => {
                        mThis.renderExpandable($(tr).find('tbody'),d, id);
                    }
                };
                PriceItemDialog.show(op);
            });

            mThis.renderExpandable($(tr).find('tbody'),data, id);
            LocaleManager.translateZone(`${wrapper_id}`);
        });
    }

    this.renderExpandable = (tbody, data, id) => {
        let html = null;
        data = data ? data : [];
        
        data.map(item => {
            html = [html, `<tr>
                <td>${item.program_name}</td>
                <td>${item.session}</td>
                <td>${item.price} ${item.currency_code}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-ttf-item-modify" data-id="${item.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ttf-item-delete" data-id="${item.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>
                </td>
            </tr>`].join('');
        });
        tbody.html(html);
        mThis.controlPriceListItem(tbody, id);
    }

    this.controlPriceListItem = (tbody, id) => {
        tbody.on('click','a.btn-ttf-item-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'list_id': id,
                'onClose': (d) => {
                    mThis.renderExpandable(tbody, d, id);
                }
            };
            PriceItemDialog.show(op);
        });

        tbody.on('click','a.btn-ttf-item-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'list_id': id
            };
            cv_interact.confirm('Delete this price?',{title: 'Delete Price', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/price-list/delete-item`,op,null).then(res => {
                        if(res.status_code === 200){
                            let d = res.data;
                            mThis.renderExpandable(tbody,d.price_list_items, id);
                        }
                    });
                }
            });
        });
    }
    
    this.elSearch.on('keyup',(e)=>{
        e.preventDefault();
        mThis.itemView.showPage({'academic_year':mThis.elFilter_academic_year.value,'search_value':mThis.elSearch.val()});
    });

    this.btnFind.on('click',e=>{
        mThis.itemView.showPage({'academic_year':mThis.elFilter_academic_year.val(),'search_value':mThis.elSearch.val()});
    });

    this.elFilter_academic_year.on('change',(e)=>{
        mThis.itemView.showPage({'academic_year':e.target.value,'search_value':mThis.elSearch.val()});
    });

    this.prepareFormOptions =(onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null).then(res => {
            const d = res.status_code===200? res.data: [];
            VSUtil.setComboItems(mThis.elFilter_academic_year,d,'academic_year','academic_year',true,'(All Years)',0);
            onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOptions(()=>{
            mThis.elFilter_academic_year.trigger('change');
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

let TuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_ttf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_ttf_btn_save');
    this.elPrice = mThis.self.find('#dlg_tff_academic');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/price-list/save`,p,null).then(res => {
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
        //Clear error signs
        Validator.clearErrors(mThis.self.find('.modal-body'));
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            el.val(d[f]);
        });
    }

    this.loadDataEdit = (options) => {
        vsapi.call(`${main_view.base_url}/api/price-list/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOption = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elPrice,d,'academic_year','academic_year',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Edit Price List','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check item details before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('Add Price List','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input tuition fee details','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

let PriceItemDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_ttf_item');
    this.options = {};
    let ref = {
        click: true
    };

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_ttf_item_btn_save');
    this.elProgram = mThis.self.find('#dlg_ttf_item_program');
    this.elSession = mThis.self.find('#dlg_ttf_item_session');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/price-list/save-item`,p,null).then(res => {
                ref.click = false;
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    let d = res.data;
                    if(typeof mThis.options.onClose === 'function')
                        mThis.options.onClose(d.price_list_items);
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
            'id': mThis.options.id,
            'list_id': mThis.options.list_id
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

    this.prepareFormOption = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',null,null,null);
            VSUtil.setComboItems(mThis.elSession,d.sessions,'id','name',null,null,null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.loadDataEdit = (options) => {
        vsapi.call(`${main_view.base_url}/api/price-list/item-details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            mThis.setDataForm(data);
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Edit Pricing Option','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check item details before editing','titles'));
                mThis.loadDataEdit(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Pricing Option','titles'));
                //mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please input item details','titles'));
                mThis.setDataForm(null);
            }

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    TuitionFeeComponent.init();
});
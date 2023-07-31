"use strict";
var TuitionFeeComponent = new function(){
    let mThis = this;
    this.title_prop = "Tuition Fee";
    this.self = $('#_main_tuitionFeeComponent');
    
    this.btnAdd = mThis.self.find('.btn--add');

    this.cols = [{
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
        data: (data, a, b) => {
            return [`<p class="pb-0 mb-0">${data.create_user}</p>
            <p class="pb-0 mb-0">${data.created_at}</p>`].join('');
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
                    mThis.itemView.showPage(null);
                }
            };
            TuitionFeeOutsideDialog.show(op);
        });

        mThis.tblTuitionFee.on('click','a.btn-ttf-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.itemView.showPage(null);
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
                    window.vsapi.call(`${main_view.base_url}/api/price-list/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
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
    }

    this.displayPriceListItem = (tr, id) => {
        let wrapper_id = ['tbl_ttf_item',id].join('_');
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.attr('id',wrapper_id);

        div_wrapper.empty();
        let html = null;

        window.vsapi.call(`${main_view.base_url}/api/price-list/items`,{'id': id},null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            html = [`<div class="p-3 rounded-3 bg-white">
                    <button class="btn btn-outline-primary btn-sm" type="button">
                        <span class="trans-text text-nowrap" data-langprop="buttons.Add Price Item"></span>
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
            mThis.renderExpandable($(tr).find('tbody'),data);
            LocaleManager.translateZone(`${wrapper_id}`);
        });
    }

    this.renderExpandable = (tbody, data) => {
        let html = null;
        
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
    }

    this.controlPriceListItem = () => {}

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let TuitionFeeOutsideDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__ttf');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_ttf_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        window.vsapi.call(`${main_view.base_url}/api/price-list/save`,p,null).then(res => {
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

    this.loadDataEdit = (options) => {
        window.vsapi.call(`${main_view.base_url}/api/price-list/details`,{'id': options.id},null).then(res => {
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

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Edit Price List','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please check item details before editing','titles'));
            mThis.loadDataEdit(options);
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
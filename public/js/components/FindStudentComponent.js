"use strict";
var FindStudentComponent = new function(){
    let mThis = this;
    this.title_prop = "Find Student";
    this.self = $('#_main_findStudentComponent');

    this.div_filter = mThis.self.find('#div--ssp');
    this.div_list = mThis.self.find('#div--fsd');
    this.btnFind = mThis.self.find('#btn--find');
    this.btnFilter = mThis.self.find('#_fns_btn_filter');
    this.panelStudentList = mThis.div_list.find('#_fns_list');

    this.init = () => {
        mThis.btnFind.on('click',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_filter);
            mThis.displayStudentList(p,() => {
                mThis.div_list.show().siblings().hide();
            });
        });

        mThis.btnFilter.on('click',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_list);
            mThis.displayStudentList(p);
        });
    }

    this.getDataForm = (div) => {
        let p = {};
        div.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.prepareOptions = (div,onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null,false).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            div.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'academic_year':
                        VSUtil.setComboItems(el,data,'academic_year','academic_year',null,null,null);
                        break;
                    default:
                        break;
                }
            });
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.displayStudentList = (op, onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/student/find`,op,null).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            d = d.data;

            let html = null;
            d.map(item => {
                html = [html,`<div class="d-flex p-3 bg-white h-info-student">
                    <div class="div-img">
                        <img src="${item.image_url}" alt=""/>
                    </div>
                    <div class="d-block ms-3 w-100">
                        <div class="row row-cols-3 mb-0">
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Student ID"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.student_code}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Female"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.sex === 'M' ? 'Male':'Female'}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Date of Birth"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.date_of_birth}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Name"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.parent_info && item.parent_info.parent_name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Phone"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.parent_info && item.parent_info.phone_number}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Email"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.parent_info && item.parent_info.email}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex align-items-start justify-content-end gap-2">
                                    <button class="btn btn-sm btn-primary rounded-3 btn--gnInvoice" type="button" data-id="${item.id}">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Ganerate Invoice"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative text-nowrap" type="button">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                        <i class="fa-solid fa-caret-down ps-2"></i>
                                        <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                            <a href="javascript:void(0)" class="btn-fns-details border-bottom pb-2" data-id="${item.id}">
                                                <i class="fa-solid fa-up-right-from-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Detials"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="btn-fns-delete pt-2" data-id="${item.id}">
                                                <i class="fa-regular fa-trash-can fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Delete"></span>
                                            </a>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr class="bg-dark m-1 p-0"/>
                        <div class="row row-cols-5 mt-2">
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Academic Year"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.academic_year}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Campus"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.campus}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Class"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.level}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Session"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.session}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Student Type"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.student_type}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`].join('');
            });

            mThis.panelStudentList.html(html);
            LocaleManager.translateZone('_fns_list');
            mThis.controlOption();
            mThis.prepareOptions(mThis.div_list);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.controlOption = () => {
        let div = mThis.panelStudentList.find('.w-options');
        let btn = mThis.panelStudentList.find('.btn--Options');

        btn.on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });

        mThis.panelStudentList.find('.btn--gnInvoice').on('click',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            GenerateInvoiceFSN.show(op);
        });

        if(div.length != 0){
            let prev_div = null;
            $(document).on('mouseup',function(e){
                e.preventDefault();
                if((!div.is(e.target) && div.has(e.target).length === 0) && prev_div){
                    prev_div.hide('fast');
                }
                else{
                    if((!div.is(e.target) && div.has(e.target).length === 0) && (!btn.is(e.target) && btn.has(e.target).length === 0)){
                        prev_div = div;
                        div.hide('fast');
                    }
                }
            });

            div.on('click','a.btn-fns-details',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };
                mThis.loadFormDetails(op,(data) => {
                    StudentDetailDialog.show(data);
                });
            });

            div.on('click','a.btn-fns-delete',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };

                cv_interact.confirm('Delete this information?',{title: 'Delete Information', context: 'delete'},(e) => {
                    if(e){
                        window.vsapi.call(`${main_view.base_url}/api/student/delete-verified`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.displayStudentList();
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
            });
        }
    }

    this.loadFormDetails = (op, onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/student/details-student`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareOptions(mThis.div_filter,() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let GenerateInvoiceFSN = new function(){
    let mThis = this;
    this.self = $('#dlg_fns_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.tblInvoice = mThis.self.find('#dlg_fns_tbl');
    this.btnGenerate = mThis.self.find('#dlg_fns_btn_save');

    mThis.btnGenerate.on('click',function(e){
        e.preventDefault();
        let p = {};
        if(mThis.options.action === 'modify'){
            p = mThis.getDataFormUpdate();
            window.vsapi.call(`${main_view.base_url}/api/student/invoice-update`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    cv_interact.success('Invoice Updated Successfully!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        }
        else{
            p = mThis.getDataForm();
            window.vsapi.call(`${main_view.base_url}/api/student/generate-invoice`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    cv_interact.success('Invoice Created Successfully!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        }
    });

    this.loadFormDetails = (div,options,onFinish = null) => {
        let op = {
            'id': options.id
        };
        if(options.action === 'modify')
            op.invoice_number = options.invoice_number;
        window.vsapi.call(`${main_view.base_url}/api/student/generate-invoice/details`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }

            const current = new Date();
            const format = new Intl.DateTimeFormat('en-US',{
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(current);

            mThis.self.find('.data-invoice').each(function(){
                let el = $(this);
                let f = el.data('field');
                if(f === 'inv_date')
                    el.text(format);
                else if(f === 'due_date')
                    el.val(data[f]);
                else
                    el.text(data[f]);
            });

            let tab = mThis.self.find('a.btn-tuition-fee');
            tab.off('click').on('click',function(e){
                e.preventDefault();
                let name = $(this).data('view');
                switch(name){
                    case 'ttn-fee':
                        $(this).addClass('ttn-fee').siblings().removeClass('n-ttn-fee');
                        mThis.prepareTable(div,data);
                        break;
                    case 'n-ttn-fee':
                        $(this).addClass('n-ttn-fee').siblings().removeClass('ttn-fee');
                        mThis.prepareTable(div,data,true);
                        break;
                    default:
                        $(this).addClass('n-ttn-fee').siblings().removeClass('ttn-fee');
                        mThis.prepareTable(div,data);
                        break;
                }
            });

            if(options.action === 'modify'){
                tab.first().hide();
                tab.last().trigger('click').off('click');
                mThis.prepareTable(div,data,true,true);
            }
            else{
                tab.first().show();
                tab.first().trigger('click');
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.prepareTable = (div, d, name=false, modify=false) => {
        d = d ? d : [];
        let btn = [d.fee_type,'btn'].join('_');
        let fee_type = d.fee_type ? d.fee_type.replace('_',' ') : 'N/A';
        let inner_html = null;

        let html = [`<table class="table">
            <thead>
                <th>Fee Type</th>
                <th>Description</th>
                <th>Date Range</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Special Discount</th>
                <th>Child Policy</th>
                <th colspan="2">Total</th>
            </thead>
            <tbody>
                ${name ? '': `<tr>
                    <td class="text-capitalize data-get" data-field="fee_type" data-value="${d.fee_type}">${fee_type}</td>
                    <td>${d.description ? d.description : 'N/A'}</td>
                    <td>${d.date_range ? d.date_range : 'N/A'}</td>
                    <td>${d.amount ? ['$',d.amount].join(' ') : 'N/A'}</td>
                    <td>${d.discount ? ['%',d.discount].join(' ') : 'N/A'}</td>
                    <td>${d.special_discount ? ['%',d.special_discount].join(' ') : 'N/A'}</td>
                    <td>${d.second_child_discount ? d.second_child_discount : 'N/A'}</td>
                    <td>${d.total ? ['$',d.total].join(' ') : 'N/A'}</td>
                    <td>
                        <a href="javascript:void(0)" class="btn-fee-type-delete d-none">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </td>
                </tr>`}
                ${modify ? (inner_html,d && d.other_fees.map(fee => {
                    inner_html = [inner_html,`<tr>
                        <td class="data-get" data-field="fee_type" data-value="${fee.fee_type}">${fee.fee_type ? fee.fee_type : 'N/A'}</td>
                        <td>${fee.description ? fee.description : 'N/A'}</td>
                        <td>${fee.date_range ? fee.date_range : 'N/A'}</td>
                        <td>${fee.amount ? ['$',fee.amount].join(' ') : 'N/A'}</td>
                        <td>${fee.discount ? ['%',fee.discount].join(' ') : 'N/A'}</td>
                        <td>${fee.special_discount ? ['%',fee.special_discount].join(' ') : 'N/A'}</td>
                        <td>${fee.second_child_discount ? fee.second_child_discount : 'N/A'}</td>
                        <td>${fee.total ? ['$',fee.total].join(' ') : 'N/A'}</td>
                        <td>
                            <a href="javascript:void(0)" class="btn-fee-type-delete" data-id="${fee.invoice_item_id}" data-amount="${fee.amount}">
                                <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                            </a>
                        </td>
                    </tr>`].join('');
                }),inner_html) : ''}
            </tbody>
        </table>
        <div class="mt-2">
            <button id="${btn}" class="btn btn-outline-success btn-sm" type="button">Add Field</button>
        </div>`].join('');

        div.html(html);
        mThis.addRow(div.find('tbody'),d,btn);
        mThis.deleteFeeRow(div.find('tbody'));
    }

    this.addRow = (tbody,d, btn) => {
        let html=null, option=null;
        window.vsapi.call(`${main_view.base_url}/api/option/other-fee`,{'academic_year': d.academic_year}).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            let select=[btn,'select'].join('_');
            
            html = [`<tr>
                <td colspan="9">
                    <select id="${select}" class="form-select form-select-sm form-select-extend" style="max-width:200px">
                        ${option,d && d.map(op => {
                            option = [option,`<option value="${op.name}">${op.name}</option>`].join('');
                        }),option=[option,'<option value="" selected>Select A Option</option>'].join('')}
                    </select>
                </td>
            </tr>`].join('');

            tbody.closest('.table-responsive').find(`#${btn}`).off('click').on('click',function(e){
                e.preventDefault();
                let value = tbody.find(`#${select}`).val();
                if(value === undefined)
                    tbody.append(html);

                if(((value == null) || (value == '')) && (value !== undefined))
                    cv_interact.warning('Select an option before add!');
                else{
                    mThis.displayFeeAsRow(tbody, select);
                    mThis.deleteFeeRow(tbody);
                }
            });
        });
    }

    this.displayFeeAsRow = (tbody, select) => {
        tbody.find(`#${select}`).off('change').on('change',function(e){
            e.preventDefault();
            let tr = $(this).closest('tr');
            window.vsapi.call(`${main_view.base_url}/api/option/other-fee-info`,{'name': $(this).val()},null,false).then(res => {
                let d = {};
                if(res.status_code === 200){
                    d = res.data;
                }
                tr.html([`<td class="data-get" data-field="fee_type" data-value="${d.fee_type}">${d.fee_type ? d.fee_type : 'N/A'}</td>
                <td>${d.description ? d.description : 'N/A'}</td>
                <td>${d.date_range ? d.date_range : 'N/A'}</td>
                <td>${d.amount ? ['$',d.amount].join(' ') : 'N/A'}</td>
                <td>${d.discount ? ['%',d.discount].join(' ') : 'N/A'}</td>
                <td>${d.special_discount ? ['%',d.special_discount].join(' ') : 'N/A'}</td>
                <td>${d.second_child_discount ? d.second_child_discount: 'N/A'}</td>
                <td>${d.total ? ['$',d.total].join(' ') : 'N/A'}</td>
                <td>
                    <a href="javascript:void(0)" class="btn-fee-type-delete">
                        <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                    </a>
                </td>`].join(''));
                mThis.deleteFeeRow(tbody);
            });
        });
    }

    this.deleteFeeRow = (tbody) => {
        tbody.find('.btn-fee-type-delete').off('click').on('click',function(e){
            e.preventDefault();
            let op = {
                'invoice_item_id': $(this).data('id'),
                'amount': $(this).data('amount')
            };
            cv_interact.confirm('Do you want to delete this fee?',{title: 'Delete Fee', context: 'delete'},(e) => {
                if(e){
                    if(op.invoice_item_id > 0){
                        mThis.options.fee_item = mThis.options.fee_item ? mThis.options.fee_item : [];
                        mThis.options.fee_item.push(op);
                    }
                    $(this).closest('tr').remove();
                }
            });
        });
    }

    this.getDataForm = () => {
        let d = {
            'student_id': mThis.options.id,
            'fee_types': []
        };

        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            d[f] = el.val();
        });

        mThis.self.find('.data-get').each(function(){
            let p = {};
            let el = $(this);
            let f = el.data('field');
            p[f] = el.data('value');
            d.fee_types.push(p);
        });
        
        return d;
    }

    this.getDataFormUpdate = () => {
        let p = {
            'id': mThis.options.invoice_id,
            'delete_info': mThis.options.fee_item
        };

        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });

        return p;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.loadFormDetails(mThis.tblInvoice,options,() => {
            mThis.elTitle.text(LocaleManager.trans('Generate Invoice','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please select item details','titles'));

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    FindStudentComponent.init();
});
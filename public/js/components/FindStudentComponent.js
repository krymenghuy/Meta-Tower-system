"use strict";
var FindStudentComponent = new function(){
    let mThis = this;
    this.title_prop = "Find Student";
    this.self = main_view.appContent.children('#_main_findStudentComponent');

    this.div_filter = mThis.self.find('#div--ssp');
    this.div_list = mThis.self.find('#div--fsd');
    this.btnFind = mThis.self.find('#_fns_btnFind');
    this.btnFilter = mThis.self.find('#_fns_btn_filter');
    this.elSearchStudent = this.self.find('#_fns_search');
    this.studentListView = null;

    this.init = () => {
        mThis.studentListView = new ListView('_fns_student_list',{
            'fetchApi':`${main_view.base_url}/api/student/find`,
            'perPage':3,
            'renderItems':(items,list_container) => {
                list_container.inner_html = '';
                mThis.renderStudents(list_container,items);
            },
            'listContainerClass':null
        });
 
        mThis.elSearchStudent.on('keyup',(e) => {
            e.preventDefault();
            mThis.studentListView.showPage(mThis.getFilterData());
        });

        mThis.btnFind.on('click',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_filter);
            mThis.studentListView.showPage(mThis.getFilterData());
        });

        mThis.btnFilter.on('click',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_list);
            mThis.studentListView.showPage(mThis.getFilterData());
        });
    }

    this.getFilterData = ()=>{
        return {
            'search_value':mThis.elSearchStudent.val()
        };
    }

    this.filterStudent = (div) => {
        let p = {};
        $(div).find('.data-filter').each(function(){
            const el = $(this);
            el.on('change',function(e){
                e.preventDefault();
                const f = el.data('field');
                p[f] = el.val();
                mThis.displayStudentList(p);
            });
        });
    }

    this.getDataForm = (div) => {
        let p = {};
        div.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    //Create on row or one Card to display one found student
    this.createCard_html = (item) => {
        if(!item) item = {};
            const cls = item.pmt_status.toLowerCase() === 'paid' ? 'text-success' : item.pmt_status.toLowerCase() === 'unpaid' ? 'text-dark' : 'text-danger';
            const html = [`<div class="div-img">
                    <img src="${item.image_url}" alt=""/>
                </div>
                <div class="d-block ms-3 w-100">
                    <div class="row row-cols-lg-4 mb-0">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Student ID"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.student_code}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-capitalize text-nowrap">${item.name}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Female"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.sex === 'M' ? 'Male':'Female'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Date of Birth"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString('km-KH',{'day':'numeric','month':'short','year':'numeric'}).replace(',','') : 'N/A'}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-capitalize text-nowrap">${item.parent_info && item.parent_info.parent_name}</p>
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
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Tuition Due"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.cur_symbol} ${item.tuition_due ? item.tuition_due : '0.00'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Tuition Paid"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.cur_symbol} ${item.tuition_paid ? item.tuition_paid : '0.00'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text" data-langprop="titles.Payment Status"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.pmt_status}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.End Date"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap ${cls}">${item.tuition_end_date ? new Date(item.tuition_end_date).toLocaleDateString('km-KH',{'day':'numeric','month':'short','year':'numeric'}).replace(',','') : 'N/A'}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex align-items-start justify-content-end gap-2">
                                <button class="btn btn-sm btn-primary rounded-3 btn--gnInvoice" type="button" data-id="${item.enrollment_id}">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Ganerate Invoice"></span>
                                </button>
                                <button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative text-nowrap" type="button">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                    <i class="fa-solid fa-caret-down ps-2"></i>
                                    <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                        <a href="javascript:void(0)" class="btn-fns-details border-bottom pb-2" data-id="${item.enrollment_id}">
                                            <i class="fa-solid fa-up-right-from-square fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Detials"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-fns-discount border-bottom pb-2" data-studentid="${item.student_id}" data-id="${item.enrollment_id}">
                                            <i class="fa-solid fa-tags fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Set Discount"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-fns-delete" data-id="${item.enrollment_id}">
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
                </div>`].join('');
            const div = document.createElement('div');
            div.innerHTML = html;
            div.classList.add('d-flex','p-3','bg-white','mt-2','h-info-student');
            return div;
    } 

    this.renderStudents = (container, data=[]) => {
        const cur_symbol = '$';
        let cnt = 0;
        container.innerHTML = '';
        (data || []).map(item =>{
            item.cur_symbol = item.cur_symbol ? item.cur_symbol : cur_symbol;
            container.appendChild(mThis.createCard_html(item));
            cnt++;
        });
        LocaleManager.translateZone(container);
        
        //Force one time convesion from htm element "container" to jquery mThis.jquery_container;
        if(cnt === 0){
            container.innerHTML = [`<div class="d-flex p-3 border rounded-3 shadow"><h4>There is where you can search for students in preparation to generate invoices</h4></div>`].join('');
            return;
        }
        if(!mThis.jquery_container){
            mThis.jquery_container = $(container);
        }
 
        mThis.setEvents(mThis.jquery_container);
    }

    this.setEvents = (div_con) => {
        const div = div_con.find('.w-options');
        const btn = div_con.find('.btn--Options');
        div_con.css('max-height',(window.innerHeight - 250)+'px').addClass('overflow-hover-auto');
        $(window).on('resize',function(e){
            e.preventDefault();
            div_con.css('max-height',(window.innerHeight - 250)+'px');
        });

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });

        div_con.find('.btn--gnInvoice').on('click',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.studentListView.showPage(mThis.getFilterData());
                }
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

            div_con.on('click',e=>{
                let lnk = VSUtil.clickOnClass(e.target,'btn-fns-discount');
                if(lnk){
                    const student_id = lnk.dataset.studentid;
                    const enrollment_id = lnk.dataset.id;
                    let op = {
                        'student_id':student_id,
                        'enrollment_id':enrollment_id
                    };
 
                    StudentDiscountDialog.show(op);
                    return;
                }

                lnk = VSUtil.clickOnClass(e.target,'btn-fns-details');
                if(lnk){
                    const enrollment_id = lnk.dataset.id;
                    let op = {
                        'id': enrollment_id
                    };
                    mThis.loadFormDetails(op,(data) => {
                        StudentDetailDialog.show(data);
                    });
                    return;
                }

                lnk = VSUtil.clickOnClass(e.target,'btn-fns-delete');
                if(lnk){
                    let op = {
                        'id': lnk.dataset.id
                    };
                    cv_interact.confirm('Delete this information?',{title: 'Delete Information', context: 'delete'},(e) => {
                        if(e){
                            vsapi.call(`${main_view.base_url}/api/enrollment/delete-verified`,op,null).then(res => {
                                if(res.status_code === 200){
                                    mThis.studentListView.showPage(mThis.getFilterData());
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    });
                    return;
                }
            });
        }
    }

    this.loadFormDetails = (op, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/enrollment/details`,op,null,null).then(res => {
            const data = res.status_code === 200 ? res.data : {};
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
     
        let x = mThis.self.siblings(':visible');
        mThis.studentListView.showPage(mThis.getFilterData(),null,()=>{
            x.hide(0,function(){
                main_view.setTitle(mThis.title_prop);
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

const GenerateInvoiceFSN = new function(){
    const mThis = this;
    this.self = $('#dlg_fns_');
    this.options = {};
    let ref = {
        click: true
    };

    this.elTitle = mThis.self.find('.modal-title');
    this.tblInvoice = mThis.self.find('#dlg_fns_tbl');
    this.btnGenerate = mThis.self.find('#dlg_fns_btn_save');

    mThis.btnGenerate.on('click',function(e){
        e.preventDefault();
        let p = {};
        if(ref.click){
            if(mThis.options.action === 'modify'){
                p = mThis.getDataFormUpdate();
                p.commision_type = 'percentage';
                vsapi.call(`${main_view.base_url}/api/student/invoice-update`,p,null).then(res => {
                    ref.click = false;
                    if(res.status_code === 200){
                        mThis.self.modal('hide');
                        if(typeof mThis.options.onClose === 'function')
                            mThis.options.onClose();
                        cv_interact.success('Invoice Updated Successfully!');
                        ref.click = true;
                    }
                    else{
                        cv_interact.error(res.error_message);
                        ref.click = true;
                    }
                });
            }
            else{
                p = mThis.getDataForm();
                p.commision_type = 'percentage';
                vsapi.call(`${main_view.base_url}/api/student/generate-invoice`,p,null).then(res => {
                    ref.click = false;
                    if(res.status_code === 200){
                        mThis.self.modal('hide');
                        if(typeof mThis.options.onClose === 'function')
                            mThis.options.onClose();
                        cv_interact.success('Invoice Created Successfully!');
                        ref.click = true;
                    }
                    else{
                        cv_interact.error(res.error_message);
                        ref.click = true;
                    }
                });
            }
        }
    });

    this.setTotal = (tbody,def_value=0) => {
        const div = mThis.self, span_total = div.find('#inv_total');
        let total = def_value;
        tbody.find('.total-item').each(function(){
            const el = $(this);
            let total_item = el.text().replace('$ ','');
            total_item = parseInt(total_item);
            total += total_item;
        });
        span_total.text(['$',total.toLocaleString('en-US',{
            minimumFractionDigits: 2
        })].join(' '));
    }

    this.loadFormDetails = (div,options,onFinish=null) => {
        let op = {
            'id': options.id
        };
        if(options.action === 'modify'){
            op.invoice_number = options.invoice_number;
            op.inv_id = options.invoice_id;
        }
        vsapi.call(`${main_view.base_url}/api/student/generate-invoice/details`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }

            const current = new Date();
            const format = new Intl.DateTimeFormat('en-US',{
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(current);

            mThis.self.find('.data-invoice').each(function(){
                const el = $(this);
                const f = el.data('field');
                if(f === 'inv_date')
                    el.text(format);
                else if(f === 'due_date')
                    el.val(data[f]);
                else if(f === 'referrer_id' || f === 'commission')
                    el.is('select') ? el.val(data['referal'][f]).trigger('change') : el.val(data['referal'][f]);
                else if(f === 'deposite_amount' || f === 'total')
                    el.text(data[f] ? '$ '+data[f] : '');
                else if(f === 'deduct_referral_fee')
                    el.text(data[f] ? data[f]+' %' : '0');
                else
                    el.text(data[f]);
            });

            const tab = mThis.self.find('a.btn-tuition-fee');
            tab.off('click').on('click',function(e){
                e.preventDefault();
                const name = $(this).data('view');
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

            if((options.action === 'modify') || (data.pmt_status === 'paid')){
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

    this.prepareReferralFee = (div,options,onFinish = null) => {
        const modal_body = div.closest('.modal-body');
        vsapi.call(`${main_view.base_url}/api/options/payment-method`,null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data.students;
                const el = modal_body.find('#el_fns_referrer');
                VSUtil.setComboItems(el,d,'student_id','student_name',null,null,null);
                if(typeof onFinish === 'function'){
                    mThis.loadFormDetails(div,options);
                    onFinish();
                }
            }
        });
    }

    this.prepareTable = (div, d, name=false, modify=false) => {
        d = d ? d : [];
        const btn = [d.fee_type,'btn'].join('_');
        const fee_type = d.fee_type ? d.fee_type.replace('_',' ') : 'N/A';
        let inner_html = '';

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
                ${name || (d.pmt_status === 'paid') ? '': `<tr>
                    <td class="text-nowrap text-capitalize data-get" data-field="fee_type" data-value="${d.fee_type}">${fee_type}</td>
                    <td>${d.description ? d.description : 'N/A'}</td>
                    <td>${d.date_range ? d.date_range : 'N/A'}</td>
                    <td class="text-nowrap">${d.tuition ? ['$',d.tuition].join(' ') : 'N/A'}</td>
                    <td class="text-nowrap">${d.discount ? ['%',d.discount].join(' ') : 'N/A'}</td>
                    <td class="text-nowrap">${d.special_discount ? ['%',d.special_discount].join(' ') : 'N/A'}</td>
                    <td class="text-nowrap">${d.second_child_discount ? d.second_child_discount : 'N/A'}</td>
                    <td class="text-nowrap">${d.amount ? ['$',d.amount].join(' ') : 'N/A'}</td>
                    <td>
                        <a href="javascript:void(0)" class="btn-fee-type-delete d-none">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </td>
                </tr>`}
                ${modify ? (inner_html,d && (d.other_fees || []).map(fee => {
                    inner_html = [inner_html,`<tr>
                        <td class="data-get text-nowrap" data-field="fee_type" data-value="${fee.fee_type}" data-id="${fee.invoice_item_id}">${fee.fee_type ? fee.fee_type : 'N/A'}</td>
                        <td>${fee.description ? fee.description : 'N/A'}</td>
                        <td>${fee.date_range ? fee.date_range : 'N/A'}</td>
                        <td class="text-nowrap">${fee.tuition ? ['$',fee.tuition].join(' ') : 'N/A'}</td>
                        <td class="text-nowrap">${fee.discount ? ['%',fee.discount].join(' ') : 'N/A'}</td>
                        <td class="text-nowrap">${fee.special_discount ? ['%',fee.special_discount].join(' ') : 'N/A'}</td>
                        <td class="text-nowrap">${fee.second_child_discount ? fee.second_child_discount : 'N/A'}</td>
                        <td class="total-item text-nowrap">${fee.total ? ['$',fee.total].join(' ') : 'N/A'}</td>
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
        mThis.addRow(div.find('tbody'),d,btn,d.total);
        mThis.deleteFeeRow(div.find('tbody'),d.total);
        mThis.setTotal(div.find('tbody'),d.total);
    }

    this.addRow = (tbody,d, btn, total=0) => {
        let html=null, option=null;
        vsapi.call(`${main_view.base_url}/api/option/other-fee`,{'academic_year': d.academic_year}).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            const select = [btn,'select'].join('_');
            
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
                const value = tbody.find(`#${select}`).val();
                if(value === undefined)
                    tbody.append(html);

                if(((value == null) || (value == '')) && (value !== undefined))
                    cv_interact.warning('Select an option before add!');
                else{
                    mThis.displayFeeAsRow(tbody, select, total);
                    mThis.deleteFeeRow(tbody,total);
                }
            });
        });
    }

    this.displayFeeAsRow = (tbody, select, total=0) => {
        tbody.find(`#${select}`).off('change').on('change',function(e){
            e.preventDefault();
            const tr = $(this).closest('tr');
            vsapi.call(`${main_view.base_url}/api/option/other-fee-info`,{'name': $(this).val()},null,false).then(res => {
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
                <td class="total-item">${d.total ? ['$',d.total].join(' ') : 'N/A'}</td>
                <td>
                    <a href="javascript:void(0)" class="btn-fee-type-delete">
                        <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                    </a>
                </td>`].join(''));
                mThis.deleteFeeRow(tbody,total);
                mThis.setTotal(tbody,total);
            });
        });
    }

    this.deleteFeeRow = (tbody,total=0) => {
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
                    mThis.setTotal(tbody,total);
                }
            });
        });
    }

    this.getDataForm = () => {
        let d = {
            'enrollment_id': mThis.options.id,
            'fee_types': []
        };

        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            d[f] = el.val();
        });

        mThis.self.find('.data-get').each(function(){
            let p = {};
            const el = $(this);
            const f = el.data('field');
            p[f] = el.data('value');
            d.fee_types.push(p);
        });
        
        return d;
    }

    this.getDataFormUpdate = () => {
        let p = {
            'id': mThis.options.invoice_id,
            'delete_info': mThis.options.fee_item,
            'insert_info': []
        };

        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            p[f] = el.val();
        });

        mThis.self.find('.data-get').each(function(){
            let d = {};
            const el = $(this);
            const f = el.data('field');
            d[f] = el.data('value');
            if(el.data('id')){
                d['invoice_item_id'] = el.data('id')
            }
            p.insert_info.push(d);
        });
        return p;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareReferralFee(mThis.tblInvoice, options, () => {
            mThis.elTitle.text(LocaleManager.trans('Generate Invoice','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please select item details','titles'));
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

const StudentDiscountDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_dlgStudentDiscount');
    this.btnSave = this.self.find('#_dlgStudentDiscount_btnSave');

    this.btnSave.on('click',(e) => {
        e.preventDefault();
        const p = mThis.getFormData(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/price-list/save-student-discount`,p,null).then(res=>{
            if(res.status_code ===200){
               if (typeof mThis.options.onClose ==='function') mThis.options.onClose(); 
            }
            else 
                cv_interact.warning(res.error_message);
        });
    });

    this.prepareFormOption = (enrollment_id,onFinish)=>{
        let p = {'enrollment_id':enrollment_id};
        vsapi.call(`${main_view.base_url}/api/student-price-list/form-options`,p,false).then(res=>{
            if(res.status_code ===200){
                onFinish();
            }
        });
    }

    this.show = (options=null)=>{
        options = options ? options:{};
        mThis.prepareFormOption(options.id,() => {
            mThis.self.modal({
                'backdrop':'static'
            });
        });        
    }
}

window.addEventListener('DOMContentLoaded',() => {
    FindStudentComponent.init();
});
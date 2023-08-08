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
            console.log(p);
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
                d = StringSanitizer.sanitizeObject(res.data);
            }
            console.log(d);
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
                                    <p class="text-nowrap">${item.student_id}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.student_name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Female"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.gender}</p>
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
                                    <p class="text-nowrap">${item.parent_name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Phone"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.parent_phone}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Email"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.parent_email}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex align-items-start justify-content-end gap-2">
                                    <button class="btn btn-sm btn-primary rounded-3 btn--gnInvoice" type="button" data-id="${item.id}">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Ganerate Invoice"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative" type="button">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                        <i class="fa-solid fa-caret-down ps-2"></i>
                                        <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                            <a href="javascript:void(0)" class="btn-fns-details border-bottom pb-2" data-id="${item.id}">
                                                <i class="fa-solid fa-up-right-from-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Detials"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="btn-fns-edit border-bottom py-2" data-id="${item.id}">
                                                <i class="fa-regular fa-pen-to-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Edit"></span>
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
                                    <p class="text-nowrap">${item.class}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Section"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.section}</p>
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

        mThis.panelStudentList.find('.btn--Options').on('click',function(e){
            e.preventDefault();
            div.toggle('slow');
        });

        mThis.panelStudentList.find('.btn--gnInvoice').on('click',function(e){
            e.preventDefault();
            GenerateInvoiceFSN.show(null);
        });

        if(div.length != 0){
            $(document).on('mouseup',function(e){
                e.preventDefault();
                if(!div.is(e.target) && div.has(e.target).length === 0){
                    div.hide('slow');
                }
            });

            div.on('click','a.btn-fns-details',function(e){
                e.preventDefault();
                console.log("Clicked Details!");
            });

            div.on('click','a.btn-fns-edit',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };
                console.log(op);
            });

            div.on('click','a.btn-fns-delete',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };

                cv_interact.confirm('Delete this information?',{title: 'Delete Information', context: 'delete'},(e) => {
                    if(e){
                        window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
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

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareOptions(mThis.div_filter,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let GenerateInvoiceFSN = new function(){
    let mThis = this;
    this.self = $('#dlg__fns');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){}
        else{
            mThis.elTitle.text(LocaleManager.trans('Generate Invoice','titles'));
            mThis.elTitle.siblings('.modal-title--sm').text(LocaleManager.trans('Please select item details','titles'));
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    FindStudentComponent.init();
});
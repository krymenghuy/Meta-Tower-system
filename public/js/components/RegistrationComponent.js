"use strict";
var RegistrationComponent = new function(){
    let mThis = this;
    this.title_prop = "Registration";
    this.self = $('#_main_registrationComponent');
    this.options = {};
    
    this.btnRegister = $('#_rgs_btnRegister');
    this.div_input = mThis.self.find('#st-register--input');
    this.div_list = mThis.self.find('#st-register--list');
    this.div_register_list = mThis.self.find('#_rgs_list');

    this.init = () => {
        mThis.btnRegister.on('click',function(e){
            e.preventDefault();
            mThis.setDataForm(null);
            mThis.div_input.show().siblings().hide();
        });

        mThis.div_input.on('click','i.back--rgs',function(e){
            e.preventDefault();
            mThis.div_list.show().siblings().hide();
        });

        mThis.div_input.on('click','button.btn--save',function(e){
            e.preventDefault();
            let p = mThis.getDataForm();
            window.vsapi.call(`${main_view.base_url}/api/`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.displayStudentList(() => {
                        mThis.div_list.show().siblings().hide();
                    });
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        });
    }

    this.displayStudentList = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/student/list-paginate`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }

            let html = null;
            d && d.data.map(item => {
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
                                    <p class="text-nowrap">${item.sex}</p>
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
                                    <button class="btn btn-sm btn-primary rounded-3 btn--gnCard" type="button" data-id="${item.id}">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Ganerate Card"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative" type="button">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                        <i class="fa-solid fa-caret-down ps-2"></i>
                                        <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                            <a href="javascript:void(0)" class="btn-rgs-details border-bottom pb-2" data-id="${item.id}">
                                                <i class="fa-solid fa-up-right-from-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Detials"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="btn-rgs-edit border-bottom py-2" data-id="${item.id}">
                                                <i class="fa-regular fa-pen-to-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Edit"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="btn-rgs-delete pt-2" data-id="${item.id}">
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

            mThis.div_register_list.html(html);
            mThis.controlOption();
            LocaleManager.translateZone('_rgs_list');
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.controlOption = () => {
        let div = mThis.div_register_list.find('.w-options');

        mThis.div_register_list.off('click').on('click','button.btn--Options',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('slow');
        });

        mThis.div_register_list.on('click','button.btn--gnCard',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            mThis.loadDataPrint(op,(data) => {
                PrintCardDialog.show(data);
            });
        });

        if(div.length != 0){
            $(document).off('click').on('mouseup',function(e){
                e.preventDefault();
                if((!div.is(e.target) && div.has(e.target).length === 0)){
                    div.hide('slow');
                }
            });

            div.on('click','a.btn-rgs-details',function(e){
                e.preventDefault();
                console.log("Clicked Details!");
            });

            div.on('click','a.btn-rgs-edit',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };

                mThis.loadDataEdit(op, (data) => {
                    mThis.setDataForm(data);
                    mThis.div_input.show().siblings().hide();
                });
            });

            div.on('click','a.btn-rgs-delete',function(e){
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

    this.loadDataEdit = (op, onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            onFinish && onFinish(data);
        });
    }

    this.loadDataPrint = (op, onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/`,op,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            onFinish && onFinish(data);
        });
    }

    this.getDataForm = () => {
        let id = mThis.options.id ? mThis.options.id : 0;
        let p = {'id': id};
        mThis.div_input.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.div_input.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            el.val(d[f]);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayStudentList(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let PrintCardDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__rgs');
    this.elTitle = mThis.self.find('.modal-title');
    this.btnPrint = mThis.self.find('.btn--print');

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        console.log("Print Now!");
    });

    this.show = (options) => {
        if(!options) options = {};
        mThis.elTitle.text(LocaleManager.trans('Generated Card','titles'));
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RegistrationComponent.init();
});
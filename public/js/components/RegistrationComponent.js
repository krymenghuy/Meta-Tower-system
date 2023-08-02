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
        mThis.div_input.find('#clickable_img').on('click',function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.options.photo = d.dataUrl;
                    mThis.renderImage($(this).parent(), d.dataUrl);
                }
            });
        });

        mThis.btnRegister.on('click',function(e){
            e.preventDefault();
            mThis.options.id = null;
            mThis.prepareFormOption(mThis.div_input,'data-input',() => {
                mThis.setDataForm(null);
                mThis.div_input.show().siblings().hide();
            });
        });

        mThis.div_input.on('click','i#back--rgs',function(e){
            e.preventDefault();
            mThis.options.id = null;
            mThis.div_list.show().siblings().hide();
        });

        mThis.div_input.on('click','button#btn--save',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_input, 'data-input');
            p = mThis.prepareData(p);
            console.log(p);
            window.vsapi.call(`${main_view.base_url}/api/student/registration`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.displayStudentList(null,() => {
                        mThis.div_list.show().siblings().hide();
                    });
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        });
    }

    this.renderImage = (div, image) => {
        let html = null;
        mThis.checkIsUrl(image,(d) => {
            if(d){
                mThis.convertUrlToBase64(image, (img) => {
                    mThis.options.photo = img;
                });
            }
        });

        if(image && image != 'undefined'){
            html = [`<img class="img-show data-input" src="${image}" data-field="photo"/>
            <div class="btn-options">
                <i class="fa-regular fa-trash-can text-danger fs-5 btn-delete"></i>
            </div>`].join('');
        }
        else{
            html = [`<div id="clickable_img">
                <i class="fa-regular fa-image text-muted fs-3"></i>
            </div>`].join('');
        }
        div.html(html);

        div.find('#clickable_img').on('click',function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.options.photo = d.dataUrl;
                    mThis.renderImage(div, d.dataUrl);
                }
            });
        });

        div.find('.btn-delete').on('click',function(e){
            e.preventDefault();

            div.html([`<div id="clickable_img">
                <i class="fa-regular fa-image text-muted fs-3"></i>
            </div>`].join(''));

            div.find('#clickable_img').on('click',function(e){
                e.preventDefault();
                FileChooser.chooseFile(null,(d) => {
                    if(d){
                        mThis.options.photo = d.dataUrl;
                        mThis.renderImage(div, d.dataUrl);
                    }
                });
            });
        });
    }

    this.prepareData = (d) => {
        d = d ? d : {};

        d.parent_info = [
            {
                'father_name': d.father_name,
                'father_email': d.father_email,
                'father_phone': d.father_phone,
                'address': d.father_address,
                'father_nid': d.father_nid,
                'role': 'father',
                'religion': d.father_religion
            },
            {
                'mother_name': d.mother_name,
                'mother_email': d.mother_email,
                'mother_phone': d.mother_phone,
                'address': d.mother_address,
                'mother_nid': d.mother_nid,
                'role': 'mother',
                'religion': d.mother_religion
            }
        ];

        ['father_name','father_email','father_phone','father_address','father_id_card','father_religion','mother_name','mother_email','mother_phone','mother_address','mother_id_card','mother_religion'].map(ob => {
            delete d[ob];
        });
        d.photo = mThis.options.photo;

        return d;
    }

    this.convertUrlToBase64 = (imageUrl, callback) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL();
            callback && callback(dataURL);
            canvas.remove();
        };
        img.src = imageUrl;
    }

    this.checkIsUrl = (imageUrl, callback) => {
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
        callback && callback(regex.test(imageUrl));
    }

    this.displayStudentList = (op=null, onFinish = null) => {
        op = op ? op : {
            'current_page':'1',
            'per_page':'8'
        }
        window.vsapi.call(`${main_view.base_url}/api/student/list-paginate`,op,null).then(res => {
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
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Sex"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.sex == 'M' ? 'Male':'Female'}</p>
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
                                    <button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative text-nowrap" type="button">
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

            if(d.data.length > 0){
                html = [html,`<div class="d-flex bg-white p-3 rounded-3 align-items-center gap-2">
                    <div class="d-flex gap-1">
                        ${mThis.createPagination(d, op.current_page)}
                    </div>
                    <span class="text-nowrap">${d.data && d.data.length} of ${d.total} students</span>
                </div>`].join('');
            }

            mThis.div_register_list.html(html);
            mThis.controlOption(mThis.div_register_list,op);
            LocaleManager.translateZone('_rgs_list');
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.createPagination = (d, current_page) => {
        d = d ? d : {};
        let html = null,
        end_page = Math.ceil((d && d.total)/(d && d.per_page)),
        start_page = 1;

        if(current_page == end_page){
            html = [html,`<button class="btn btn-sm border btn-pagination ${(current_page-1) == 0 ? 'd-none':''}">${current_page-1}</button>
            <button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>`].join('');
        }
        else if(current_page == start_page){
            html = [html,`<button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>
            <button class="btn btn-sm border btn-pagination">${parseInt(current_page)+1}</button>`].join('');
        }
        else{
            html = [html,`<button class="btn btn-sm border btn-pagination">${current_page-1}</button>
            <button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>
            <button class="btn btn-sm border btn-pagination">${parseInt(current_page)+1}</button>`].join('');
        }
        return html;
    }

    this.controlOption = (container, op) => {
        let div = container.find('.w-options');

        container.find('button.btn-pagination').on('click',function(e){
            e.preventDefault();
            op.current_page = $(this).text();
            mThis.displayStudentList(op);
        });

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
                mThis.options.id = op.id;

                mThis.loadDataEdit(op, (data) => {
                    mThis.prepareFormOption(mThis.div_input,'data-input',() => {
                        mThis.setDataForm(data);
                        mThis.div_input.show().siblings().hide();
                    });
                });
            });

            div.on('click','a.btn-rgs-delete',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };

                cv_interact.confirm('Delete this information?',{title: 'Delete Information', context: 'delete'},(e) => {
                    if(e){
                        window.vsapi.call(`${main_view.base_url}/api/student/delete-student`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.displayStudentList(null);
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
        window.vsapi.call(`${main_view.base_url}/api/student/details-student`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data,null,['image_url']);
            }
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    this.loadDataPrint = (op, onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/student/details-student`,op,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    this.getDataForm = (div, class_name) => {
        let p = {
            'id': mThis.options.id ? mThis.options.id : 0
        };
        div.find(`.${class_name}`).each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        let div = mThis.div_input.find('#contain_img');
        mThis.renderImage(div,d.image_url);

        mThis.div_input.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else if(f === 'father_religion')
                el.val(d['parent_info'] && d['parent_info'][0] && d['parent_info'][0]['religion']);
            else if(f === 'father_address')
                el.val(d['parent_info'] && d['parent_info'][0] && d['parent_info'][0]['address']);
            else if(f === 'mother_religion')
                el.val(d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['religion']);
            else if(f === 'mother_address')
                el.val(d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['address']);
            else
                el.val(d[f] || (d['parent_info'] && d['parent_info'][0] && d['parent_info'][0][f]) || (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1][f]));
        });
    }

    this.prepareFormOption = (div, class_name, onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            div.find(`.${class_name}`).each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'level_id':
                        VSUtil.setComboItems(el,d.levels,'id','level',null,null,null);
                        break;
                    case 'session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                        break;
                    case 'campus_id':
                        VSUtil.setComboItems(el,d.campuses,'id','campus',null,null,null);
                        break;
                    default:
                        break;
                }
            });
            mThis.displayStudentList(null);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(mThis.div_list,'data-select',() => {
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
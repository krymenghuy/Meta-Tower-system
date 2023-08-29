"use strict";
var RegistrationComponent = new function(){
    let mThis = this;
    this.title_prop = "Registration";
    this.self = $('#_main_registrationComponent');
    this.options = {};
    
    this.btnRegister = this.self.find('#_rgs_btnRegister');
    this.div_filter_form = this.self.find('#_rgs_filters');
    this.div_input = mThis.self.find('#st-register--input');
    this.div_list = mThis.self.find('#st-register--list');
    this.elFilter_program = this.self.find('#_rgs_filter_program');
    this.elFilter_level = this.self.find('#_rgs_filter_level');

    this.elTerm = this.self.find('#_rgs_term');
    this.elGroup = this.self.find('#_rgs_group');

    this.elPrevSchool = this.self.find('#_rgs_prev_school');
    this.lnkAddGroup = this.self.find('#_rgs_lnkAddStudentGroup');
 
    this.selected_options = {};

    this.init = () => {
        mThis.studentListView = new ListView('_reg_list_view',{
            'fetchApi':`${main_view.base_url}/api/enrollment/list-paginate`,
            'perPage':5,
            'renderItems':(items,list_container) => {
                mThis.renderStudents(list_container,items);
            },
            'listContainerClass':null
        });
        
        this.prev_school_label = new OptionEditor('_rgs_prev_school_label',{
            "selectElement":mThis.elPrevSchool,
            'label':"Previous School",
            "buttons":['add','delete','edit'],
            "value_field":"id",
            "text_field":"name",
            "dataprop":"schools",
            "langprop":"titles",
            "apiSave":{
               "endpoint":`${main_view.base_url}/api/settings/school/save`
            //    ,"params":(oldValue,newValue)=>{
            //        return {'name':newValue};
            //    }
            },
            "apiDelete":{
               "endpoint":`${main_view.base_url}/api/settings/school/delete`
            }
        });

        mThis.div_filter_form.find('.filter-field').each(function(){
           const el = $(this);
           el.on('change',function(e){
              e.preventDefault();
              mThis.studentListView.showPage(mThis.getFilterData());
           });   
        });

        mThis.lnkAddGroup.on('click',e=>{
            const group_id = 0;
            let op = {
               'id':group_id, 
               'onClose':(d)=>{
                  alert('onClose');
               }
            };
            StudentGroupDialog.show(op);
        });

        mThis.elTerm.on('change',e=>{
            e.preventDefault();
            vsapi.get(`${main_view.base_url}/api/settings/options-group-all`,{'term_id':mThis.elTerm.val()}).then(res=>{
                let items = res.status_code ===200?res.data:[];
                VSUtil.setComboItems(mThis.elGroup,items,'id','group_name',true,'(Choose Group)',null);
                mThis.elGroup.val(mThis.selected_options.group_id).trigger('change');
            });
        });

          mThis.elFilter_program.on('change',function(e){
              vsapi.get(`${main_view.base_url}/api/settings/options-level`,{'program_id':$(this).val()}).then(res=>{
                  let items = res.status_code ===200?res.data:[];
                  VSUtil.setComboItems(mThis.elFilter_level,items,'id','level_name',true,'(All Grades)',0);
                  mThis.elFilter_level.val(0).trigger('change');
              });
          });

        mThis.elFilter_level.on('change',function(e){
           mThis.studentListView.showPage(mThis.getFilterData());
        });

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
            mThis.options.father_id = null;
            mThis.options.mother_id = null;
            mThis.options.photo = null;
            mThis.prepareFormOption(mThis.div_input,'data-input',() => {
                mThis.setDataForm(null);
                mThis.div_input.siblings(":visible").fadeOut("fast", function() {
                    mThis.div_input.hide().fadeIn(300);
                });
            });
        });

        mThis.div_input.on('click','i#back--rgs',function(e){
            e.preventDefault();
            mThis.options.id = null;
            mThis.options.father_id = null;
            mThis.options.mother_id = null;
            mThis.options.photo = null;
            mThis.div_list.show().siblings().hide();
        });

        mThis.div_input.on('click','button#btn--save',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_input, 'data-input');
            p = mThis.prepareData(p);
            window.vsapi.call(`${main_view.base_url}/api/enrollment/save`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.options.photo = null;
                    mThis.div_list.show().siblings().hide();
                }
                else cv_interact.error(res.error_message);
            });
        });
    }

    this.renderImage = (div, image) => {
        let html = null;
        // mThis.checkIsUrl(image,(d) => {
        //     if(d){
        //         mThis.convertUrlToBase64(image, (img) => {
        //             mThis.options.photo = img;
        //         });
        //     }
        // });

        if(image && image != 'undefined'){
            html = [`<img class="img-show data-input" src="${image}" data-field="photo" data-required="false"/>
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
            mThis.options.photo = null;

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
                'id': mThis.options.father_id,
                'father_name': d.father_name,
                'father_email': d.father_email,
                'father_phone': d.father_phone,
                'address': d.father_address,
                'father_nid': d.father_nid,
                'role': 'father',
                'religion': d.father_religion
            },
            {
                'id': mThis.options.mother_id,
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

    // this.convertUrlToBase64 = (imageUrl, callback) => {
    //     const canvas = document.createElement('canvas');
    //     const ctx = canvas.getContext('2d');
    //     const img = new Image();
    //     img.crossOrigin = 'anonymous';
    //     img.onload = function(){
    //         canvas.width = img.width;
    //         canvas.height = img.height;
    //         ctx.drawImage(img, 0, 0);
    //         const dataURL = canvas.toDataURL();
    //         callback && callback(dataURL);
    //         canvas.remove();
    //     };
    //     img.src = imageUrl;
    // }

    // this.checkIsUrl = (imageUrl, callback) => {
    //     const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    //     callback && callback(regex.test(imageUrl));
    // }

     
    this.renderStudents = (div_register_list,data) => {
            let html = null;
            let cnt =0;
            (data || []).map(item => {
                console.log(item.parent_info);
                html = [html,`<div class="d-flex p-3 bg-white h-info-student mb-2">
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
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Grade"></p>
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
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Group"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.group_name?item.group_name:'(Group)'}</p>
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
                cnt++;
            });

            if(cnt ==0){
                html =`<div class="d-flex bg-white p-3 rounded-3 align-items-center">There are no registered students</div>`;
            }

            div_register_list.innerHTML = html;
            const j_div = $(div_register_list);
            mThis.setEvents(j_div);
            LocaleManager.translateZone(j_div);
    }

    // this.createPagination = (d, current_page) => {
    //     d = d ? d : {};
    //     let html = null,
    //     end_page = Math.ceil((d && d.total)/(d && d.per_page)),
    //     start_page = 1;

    //     if(current_page == end_page){
    //         html = [html,`<button class="btn btn-sm border btn-pagination ${(current_page-1) == 0 ? 'd-none':''}">${current_page-1}</button>
    //         <button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>`].join('');
    //     }
    //     else if(current_page == start_page){
    //         html = [html,`<button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>
    //         <button class="btn btn-sm border btn-pagination">${parseInt(current_page)+1}</button>`].join('');
    //     }
    //     else{
    //         html = [html,`<button class="btn btn-sm border btn-pagination">${current_page-1}</button>
    //         <button class="btn btn-primary btn-sm btn-pagination">${current_page}</button>
    //         <button class="btn btn-sm border btn-pagination">${parseInt(current_page)+1}</button>`].join('');
    //     }
    //     return html;
    // }

    this.setEvents = (container) => {
        let div = container.find('.w-options');
        let btn = container.find('button.btn--Options');

        // container.find('button.btn-pagination').on('click',function(e){
        //     e.preventDefault();
        //     op.current_page = $(this).text();
        //     mThis.renderStudents(op);
        // });

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });

        container.on('click','button.btn--gnCard',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            mThis.loadDataPrint(op,(data) => {
                PrintCardDialog.show(data);
            });
        });

        if(div.length != 0){
            let prev_div = null;
            $(document).off('click').on('mouseup',function(e){
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

            div.on('click','a.btn-rgs-details',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };
                mThis.loadDataPrint(op,(data) => {
                    StudentDetailDialog.show(data);
                });
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
                        mThis.studentListView.showPage(mThis.getFilterData());
                        mThis.div_input.show().siblings().hide();
                    });
                });
            });

            div.on('click','a.btn-rgs-delete',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };

                cv_interact.confirm('Delete this enrollment?',{title: 'Delete Information', context: 'delete'},(e) => {
                    if(e){
                        window.vsapi.call(`${main_view.base_url}/api/enrollment/delete`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.studentListView.showPage(mThis.getFilterData());
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
        console.error(op);
        window.vsapi.call(`${main_view.base_url}/api/enrollment/details`,op,null,false).then(res => {
            const  data = res.status_code ===200? StringSanitizer.sanitizeObject(res.data,null,['image_url','father_email','mother_email']):{};
           
            if(typeof onFinish === 'function') onFinish(data);
        });
    }
    this.loadDataPrint = (op, onFinish) => {
        window.vsapi.call(`${main_view.base_url}/api/enrollment/details`,op,null).then(res => {
            const data = res.status_code === 200? StringSanitizer.sanitizeObject(res.data,null,['image_url']):{};
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    this.getDataForm = (div, class_name) => {
        let p = {
            'id': mThis.options.id ? mThis.options.id : null
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
        //mThis.validate.resetForm();
        let div = mThis.div_input.find('#contain_img');
        mThis.renderImage(div,d.image_url);

        mThis.options.father_id = (d['parent_info'] && d['parent_info'][0] && d['parent_info'][0]['id']);
        mThis.options.mother_id = (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['id']);

        mThis.div_input.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
            {
                mThis.selected_options[f] =d[f];
                el.val(d[f]).trigger('change');
            }
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

    this.prepareFormOption = (div,className, onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/enrollment/form-options`,null,null).then(res => {
            const d = res.status_code ===200? StringSanitizer.sanitizeObject(res.data,null,[]):{};
            div.find(`.${className}`).each(function(){
                const el = $(this);
                const f = el.data('field');
                switch(f){
                    case 'academic_year':
                        VSUtil.setComboItems(el,d.academic_years,'academic_year','academic_year',null,null,null);
                        break;
                    case 'program_id':
                            VSUtil.setComboItems(el,d.programs,'id','program_name',null,null,null);
                            break;    
                    // case 'level_id':
                    //     VSUtil.setComboItems(el,d.levels,'id','level_name',null,null,null);
                    //     break;
                    case 'session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','session_name',null,null,null);
                        break;
                    case 'campus_id':
                        VSUtil.setComboItems(el,d.campuses,'id','campus_name',null,null,null);
                        break;
                    case 'term_id':
                        VSUtil.setComboItems(el,d.terms,'id','acad_term',null,null,null);
                        break;
                    case 'group_id':
                        VSUtil.setComboItems(el,d.groups,'id','group_name',null,null,null);
                        break;
                    case 'prev_school_id':
                        VSUtil.setComboItems(el,d.schools,'id','name',true,'None',0);
                        break;    
                    default:
                        break;
                }
            });
            if(typeof onFinish === 'function') onFinish();
        });
    }

    // this.validate = new FormValidator(mThis.div_input,{
    //     className: 'data-input'
    // });
    
    this.getFilterData = ()=>{
        let p = {};
        mThis.div_filter_form.find('.filter-field').each(function(){
            let el = $(this);
            const f = el.data('field');
            if(f) p[f] = el.val();
        });
        return p;
    }

    //Set Filter options on Registration Form. In case of this.setFilterData(null) then the default options will be first option of every SELECT box
    this.setFilterData =(d=null)=>{
        const use_default =!d;
        d = d?d:{};
        mThis.div_filter_form.find('.filter-field').each(function(){
            let el = $(this);
            const f = el.data('field');
            if(use_default) 
            {
                const first = el.find('option:first').val();
                el.val(first).trigger('change');
            }
            else el.val(d[f]).trigger('change');
        });
    }

    //Show Registration Component
    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(mThis.div_list,'filter-field',() => {
            //Set default options for Filter fields
            mThis.setFilterData(options.filter); 
            main_view.setTitle(mThis.title_prop);
            mThis.studentListView.showPage(mThis.getFilterData());
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let PrintCardDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_rgs_card');
    this.elTitle = mThis.self.find('.modal-title');
    this.btnPrint = mThis.self.find('#dlg_rgs_card_btn_print');

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        console.log("Print Now!");
    });

    this.setDataForm = (d) => {
        d = d ? d : {};
        d['sex'] = d['sex'] === 'M' ? 'Male':'Female';

        mThis.self.find('.data-show').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('img')){
                if(f === 'mother_profile')
                    el.attr('src',(d['parent_info'] && d['parent_info'][1] && d['parent_info'][1][f]));
                else if(f === 'father_profile')
                    el.attr('src',(d['parent_info'] && d['parent_info'][0] && d['parent_info'][0][f]));
                else
                    el.attr('src',d[f]);
            }
            else
                el.text(d[f]);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.elTitle.text(LocaleManager.trans('Generated Card','titles'));
        mThis.setDataForm(options);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

let StudentDetailDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_rgs_detail');
    this.btnPrint = mThis.self.find('#dlg_rgs_detail_btn_print');

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        console.log("Print Now!");
    });

    this.setDataForm = (d) => {
        d = d ? d : {};
        d['sex'] = d['sex'] === 'M' ? 'Male':'Female';
        mThis.self.find('.data-show').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('img'))
                el.attr('src',d[f]);
            else{
                let mother_address = (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['address']) ? (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['address']) : (d['parent_info'] && d['parent_info'][0] && d['parent_info'][0][f]);

                el.text(d[f] || (d['parent_info'] && d['parent_info'][0] && d['parent_info'][0][f]) || (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1][f]) || mother_address);
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.setDataForm(options);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    RegistrationComponent.init();
});
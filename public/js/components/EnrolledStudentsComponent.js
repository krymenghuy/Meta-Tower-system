"use strict";
var EnrolledStudentsComponent = new function(){
    const mThis = this;
    this.title_prop = "Enrolled Students";
    this.self = main_view.appContent.children('#_main_registrationComponent');
    this.options = {};
    
    this.btnRegister = this.self.find('#_rgs_btnRegister');
    this.div_filter_form = this.self.find('#_rgs_filters');
    this.div_input = mThis.self.find('#st-register--input');
    this.div_list = mThis.self.find('#st-register--list');
    this.div_enroll_path = this.div_input.find('#_rgs_div_enrollment_path');

    this.elFilter_program = this.div_filter_form.find('#_rgs_filter_program');
    this.elFilter_level = this.div_filter_form.find('#_rgs_filter_level');

    this.elAcademicYear = this.self.find('#_rgs_acad_year');
    this.elTerm = this.self.find('#_rgs_term');
    this.elLevel = this.self.find('#_rgs_level');
    this.elCampus = this.self.find('#_rgs_campus');
    this.elSession = this.self.find('#_rgs_session');
    this.elGroup = this.self.find('#_rgs_group');
    this.elSearchStudent = this.self.find('#_rgs_search_student');

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
            },
            "apiDelete":{
               "endpoint":`${main_view.base_url}/api/settings/school/delete`
            }
        });

        mThis.div_filter_form.find('.filter-field').on('change',(e) => {
            e.preventDefault();
            const el = e.target;
            const f = el ? el.dataset.field : null;
            if(f === 'academic_year'){
                vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':el.value},false).then(res=>{
                    const terms = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : [];
                    VSUtil.setComboItems(mThis.elFilter_term,terms,'id','term_name',true,'(All Terms)',0);
                });
            }
            else if(f === 'program_id'){
                vsapi.call(`${main_view.base_url}/api/settings/options-level`,{'program_id':el.value},null,false).then(res=>{
                    let items = res.status_code === 200 ? res.data : [];
                    VSUtil.setComboItems(mThis.elFilter_level,items,'id','level_name',true,'(All Grades)',0);
                });
            }
            if(!mThis.disable_filter){
                mThis.studentListView.showPage(mThis.getFilterData());
            }
        });

        mThis.div_enroll_path.on('change','.g-filter',function(e){
            e.preventDefault();
            mThis.loadOptions_group();
        });
        
        mThis.lnkAddGroup.on('click',(e)=>{
            e.preventDefault();
            let group_id = null;
            const sel_level_id = mThis.elLevel.val();
            if(sel_level_id == 0 || !sel_level_id){
                cv_interact.warning('Please select a Level or Grade');
                return;
            }
            if(!mThis.elAcademicYear.val()){
                cv_interact.warning('Please select Academic year');
                return;
            }
            if(!mThis.elTerm.val()){
                cv_interact.warning('Please select Term or Semester');
                return;
            }
            if(!mThis.elSession.val()){
                cv_interact.warning('Please select Session as Half Day or Full Day');
                return;
            }

            let op = {
                'id':group_id,
                'academic_year':mThis.elAcademicYear.val(),
                'term_id':mThis.elTerm.val(),
                'campus_id':mThis.elCampus.val(), /**/
                'program_id':null, /** user select only Level to create student Group */
                'level_id':mThis.elLevel.val(),
                'session_id':mThis.elSession.val(), /**/
                'onClose':(group) => {
                   cv_interact.success(['Student group ',group.name,' was created successfully'].join('')); 
                   mThis.selected_options.group_id = group.id; 
                   mThis.elLevel.trigger('change');
                }
            };
            StudentGroupDialog.show(op);
        });
      
        mThis.elSearchStudent.on('keyup',(e) => {
            e.preventDefault();
            mThis.studentListView.showPage(mThis.getFilterData());
        });

        mThis.elAcademicYear.on('change',function(e){
            e.preventDefault();
            let op = {
                'academic_year': $(this).val()
            };

            vsapi.post(`${main_view.base_url}/api/settings/options-term`,op,false).then(res=>{
                let items = res.status_code === 200 ? res.data : [];
                VSUtil.setComboItems(mThis.elTerm,items,'id','term_name',true,'(Choose Term)',null);
                mThis.elTerm.val(mThis.selected_options.term_id).trigger('change');
            });
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
            mThis.options.family_code = null;
            mThis.prepareFormOption(null,mThis.div_input,'data-input',() => {
                //Set some default data such as Term_id, and Session etc from the currently selected filter on the main form
                mThis.setDataForm(mThis.getFilterData());
                mThis.getFamilyID();
                mThis.div_input.siblings(":visible").fadeOut("fast", function(){
                    mThis.div_input.hide().fadeIn(200);
                });
            });
        });

        mThis.div_input.on('click','i#back--rgs',function(e){
            e.preventDefault();
            mThis.options.id = null;
            mThis.options.father_id = null;
            mThis.options.mother_id = null;
            mThis.options.photo = null;
            mThis.options.family_code = null;
            mThis.div_list.show().siblings().hide();
        });

        mThis.div_input.on('click','button#btn--save',function(e){
            e.preventDefault();
            let p = mThis.getDataForm(mThis.div_input, 'data-input');
            p = mThis.prepareData(p);
            vsapi.call(`${main_view.base_url}/api/enrollment/save`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.options.photo = null;
                    const d = res.data;
                    //const filter = mThis.getEnrollmentPath();
                    //NOTE that: after successfully save enrollment info => api enrollment/save() return "res.data.enrollment_path" that is used as filter to refresh the back page in order to display the newly enrolled student
                    mThis.setFilterData(d.enrollment_path);
                    if(d.login_info && d.login_info.parent_login_changed == 1){
                        cv_interact.info(['Parent login has changed to ',d.login_info.new_login_name].join(''));
                    }
                    mThis.div_list.fadeIn(200).siblings().hide();
                }
                else{
                    cv_interact.error(res.error_message ? res.error_message : 'May be something wrong on server side');
                }
            });
        });
    }

    this.setParentInfo = (d) => {
        d = d ? d : {};
        mThis.options.family_code = d.family_code;
        const div = mThis.div_input,
        div_parent = div.find('#_rgs_parent_info');
        div_parent.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            if(el.is('select')){
                el.val(d[f]).trigger('change');
            }
            else if(f === 'father_religion')
                el.val(d && d[0] && d[0]['religion']);
            else if(f === 'father_address')
                el.val(d && d[0] && d[0]['address']);
            else if(f === 'mother_religion')
                el.val(d && d[1] && d[1]['religion']);
            else if(f === 'mother_address')
                el.val(d && d[1] && d[1]['address']);
            else
                el.val(d[f] || (d && d[0] && d[0][f]) || (d && d[1] && d[1][f]));
        });
    }

    this.getFamilyID = () => {
        const div = mThis.div_input,
        search = div.find('#el_rgs_search');
        search.on('click',function(e){
            e.preventDefault();
            let op = {
                'onClose': (d) => {
                    mThis.setParentInfo(d)
                }
            };
            FamilyDialog.show(op);
        });
    }

    //renderPhoto()
    this.renderImage = (div, image) => {
        let html = null;
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
        //Must store options.photo as image url or as base64 in order to pass back to api. because NULL photo passed to api => means delete the student's photo
        mThis.options.photo = image;
        div.find('#clickable_img').on('click',function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.options.photo = d.dataUrl;
                    mThis.renderImage(div, d.dataUrl);
                }
            });
        });

        div.on('mouseenter', () => {
            div.find('.btn-delete').show();
        }).on('mouseleave', () => {
            div.find('.btn-delete').hide();
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
   
    /** return enrollment path such as {'academic_year','term_id','level_id','session_id','group_id'} 
     * This enrollment path will be used as filter data when user closes the mThis.div_input, which is the Register Form for new student
    */
    this.getEnrollmentPath = ()=>{
        let p = {};
        mThis.div_enroll_path.find('.data-input').each(function(){
            const el = $(this);  
            const f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    /** load Select options in Group select box*/
    this.loadOptions_group = ()=>{
        //mThis.getEnrollmentPath() will return the selected op such as  {'academic_year','term_id','level_id','session_id'}
        const op = mThis.getEnrollmentPath();
        vsapi.call(`${main_view.base_url}/api/settings/options-group`,op,null,false).then(res=>{
            let items = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data,null,['group_name']):[];
            VSUtil.setComboItems(mThis.elGroup,items,'id','group_name',true,'(Choose Group)',null);
            mThis.elGroup.val(mThis.selected_options.group_id).trigger('change');
        });
    }

    this.prepareData = (d) => {
        d = d ? d : {};
        const family_code = mThis.options.family_code;
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

        ['father_name','father_email','father_phone','father_address','father_nid','father_religion','mother_name','mother_email','mother_phone','mother_address','mother_nid','mother_religion'].map(ob => {
            delete d[ob];
        });
        //NOTE: if provide NULL photo to api enrollment/save() => it will delete existing photo, but if provide url, it wont delete or update the student's photo
        //mThis.options.photo is a url in case of viewing existing photo. If this url is passed to api, it wont update or delete student's photo
        d.photo = mThis.options.photo;
        if(family_code){
            d.family_code = family_code;
            delete(d.parent_info);
        }
        return d;
    }
    
    this.renderStudents = (div_register_list,data) => {
            let html = null;
            let cnt = 0;
            div_register_list.style.display = 'none';
            (data || []).map(item => {
                let finalized = item.enroll_finalized == 1 ? 'd-none':''; 
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
                            <div class="col position-relative">
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
                                            <a href="javascript:void(0)" class="btn-rgs-setleave border-bottom pb-2" data-id="${item.id}" data-finalized="${item.enroll_finalized}">
                                                <i class="fa-regular fa-circle-stop fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Set Leave"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="${finalized} btn-rgs-edit border-bottom py-2" data-id="${item.id}">
                                                <i class="fa-regular fa-pen-to-square fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Edit"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="${finalized} btn-rgs-delete pt-2" data-id="${item.id}">
                                                <i class="fa-regular fa-trash-can fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Delete"></span>
                                            </a>
                                        </div>
                                    </button>
                                </div>
                                <div class="d-flex justify-content-end align-items-center h-100" role="button">
                                    <div class="d-block position-relative">
                                        <button class="btn-finalize btn btn-sm ${item.enroll_finalized == 1 ? 'glow-on-hover-finalized' : 'glow-on-hover'}" type="button" data-id="${item.id}" data-status="${item.enroll_finalized}">
                                            <span class="trans-text" data-langprop="buttons.Finalize${item.enroll_finalized == 1 ? 'd':''}"></span>
                                        </button>
                                    </div>
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
                                    <p class="text-nowrap">${item.group_name ? item.group_name:'(Group)'}</p>
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

            if(cnt == 0){
                html =[`<div class="d-flex bg-white p-3 rounded-3 align-items-center"><h5>`,LocaleManager.trans('No data to display!'),`</h5></div>`].join('');
            }

            div_register_list.innerHTML = html;
            mThis.setEvents($(div_register_list));
            LocaleManager.translateZone(div_register_list);
            setTimeout(() => {
                div_register_list.style.display = 'block';
            }, 200);
            const parent = div_register_list.closest('._rgs_list');
            parent.style.maxHeight = (window.innerHeight - 280)+'px';
            window.addEventListener('resize',(e) => {
                e.preventDefault();
                parent.style.maxHeight = (window.innerHeight - 280)+'px';
            });
    }

   this.clickOnClass = (target,cssClass)=>{
      if( target.classList.contains(cssClass)) return target;
      if(target.parentNode.classList.contains(cssClass)) return target.parentNode;
   }

    this.setEvents = (container) => {
        const div =  container.find('.w-options');
        const btn = container.find('.btn--Options');

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });

        container.find('button.btn--gnCard').on('click',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            mThis.loadDataPrint(op,(data) => {
                PrintCardDialog.show(data);
            });
        });

        container.off('click').on('click','button.btn-finalize',function(e){
            e.preventDefault();
            const is_finalized = $(this).data('status');
            let op = {
                'enrollment_id': $(this).data('id')
            };
            if(is_finalized == 1){
                cv_interact.warning('This registration is already finalized!');
            }
            else{
                cv_interact.confirm('After finalizing registration, you will not be able to edit or modify it directly. Do you wish to proceed now?',{
                    title: 'Finalize Registration',
                    context: 'OK'
                },(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/enrollment/finalize`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.studentListView.showPage(mThis.getFilterData());
                                cv_interact.success('Registration has been finalized!');
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
            }
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

            div.on('click',e=>{
                e.preventDefault();

               let lnk = mThis.clickOnClass(e.target,'btn-rgs-details');
               if(lnk){
                    let op = {
                        'id': lnk.dataset.id
                    };
                    mThis.loadDataPrint(op,(data) => {
                        StudentDetailDialog.show(data);
                    });
                  return;
               }
               
               lnk = mThis.clickOnClass(e.target,'btn-rgs-edit');
               if(lnk){
                    const enrollment_id = lnk.dataset.id;
                    mThis.options.id = enrollment_id;

                    mThis.prepareFormOption(enrollment_id,mThis.div_input,'data-input',(d) => {
                        mThis.setDataForm(d.enrollment_info);
                        mThis.div_input.fadeIn(200).siblings().hide();
                    });

                    return;
               }

               lnk = mThis.clickOnClass(e.target,'btn-rgs-delete');
               if(lnk){
                let op = {
                    'id': lnk.dataset.id
                };

                cv_interact.confirm('Delete this enrollment?',{title: 'Delete Information', context: 'delete'},(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/enrollment/delete`,op,null).then(res => {
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

               //Set Leave Dialog
               lnk = mThis.clickOnClass(e.target,'btn-rgs-setleave');
               if(lnk){
                  const enrollment_id = lnk.dataset.id;
                  const is_finalized = lnk.dataset.finalized;
                  //alert('Set student on leave ' + id);
                  if(is_finalized !=1){
                    cv_interact.warning('This enrollment is not yet finalized!');
                    return;
                  }
                  const op = {
                    'id':null,
                    'enrollment_id':enrollment_id, //id  here is the enrollment_id
                    'onClose':()=>{
                        mThis.studentListView.showPage(mThis.getFilterData());
                    }
                  };

                  LeaveDialog.show(op);
               }

            });
        }
    }

    this.loadDataPrint = (op, onFinish) => {
        vsapi.call(`${main_view.base_url}/api/enrollment/details`,op,null).then(res => {
            const data = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data,null,['image_url','father_profile','mother_profile','father_email','mother_email']) : {};
            if(typeof onFinish === 'function') onFinish(data);
        });
    }

    /** May revise to be => getDataForm() returns object {data,error} . If there is validation error, the prop "error" is not empty */
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
        const div = mThis.div_input.find('#contain_img');
        mThis.renderImage(div,d.image_url);

        mThis.options.father_id = (d['parent_info'] && d['parent_info'][0] && d['parent_info'][0]['id']);
        mThis.options.mother_id = (d['parent_info'] && d['parent_info'][1] && d['parent_info'][1]['id']);

        mThis.div_input.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select')){
                mThis.selected_options[f] = d[f];
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

    this.prepareFormOption = (enrollment_id,div,className, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/enrollment/form-options`,{'enrollment_id':enrollment_id},null,false).then(res => {
            const d = res.status_code === 200 ? res.data : {};

            div.find(`.${className}`).each(function(){
                const el = $(this);
                const f = el.data('field');
                switch(f){
                    case 'academic_year':
                        VSUtil.setComboItems(el,d.academic_years,'academic_year','academic_year',null,null,null);
                        break;
                    case 'level_id':
                        VSUtil.setComboItems(el,d.levels,'id','level_name',null,null,null);
                        break;
                    case 'program_id':
                        VSUtil.setComboItems(el,d.programs,'id','program_name',true,'(All Programs)',0);
                        break;
                    case 'session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','session_name',null,null,null);
                        break;
                    case 'campus_id':
                        VSUtil.setComboItems(el,d.campuses,'id','campus_name',null,null,null);
                        break;
                    case 'term_id':
                        VSUtil.setComboItems(el,d.terms,'id','term_name',null,null,null);
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
            if(typeof onFinish === 'function') onFinish(d);
        });
    }
    
    this.getFilterData = () => {
        let p = {};
        mThis.div_filter_form.find('.filter-field').each(function(){
            let el = $(this);
            const f = el.data('field');
            if(f)
                p[f] = el.val();
        });
        p.search_value = mThis.elSearchStudent.val();
        return p;
    }

    //Set Filter options on Registration Form. In case of this.setFilterData(null) then the default options will be first option of every SELECT box
    this.setFilterData =(d=null)=>{
        const use_default = !d;
        mThis.disable_filter = true;
        d = d ? d : {};
        mThis.div_filter_form.find('.filter-field').each(function(){
            let el = $(this);
            const f = el.data('field');
            if(use_default){
                const first = el.find('option:first').val();
                el.val(first).trigger('change');
            }
            else
                el.val(d[f]).trigger('change');
        });

        let filter = mThis.getFilterData();
        filter.level_id=0;
        mThis.studentListView.showPage(filter);
        mThis.disable_filter = false;
    }

    //Show Registration Component
    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(null,mThis.div_list,'filter-field',() => {
            //Set default options for Filter fields
            mThis.setFilterData(options.filter); 
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.fadeIn(200);
            });
        });
    }
}

let PrintCardDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_rgs_card');
    this.elTitle = mThis.self.find('.modal-title');
    this.btnPrint = mThis.self.find('#dlg_rgs_card_btn_print');

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        console.log("Print Now!");
    });

    this.setDataForm = (d) => {
        d = d ? d : {};
        d['sex'] = d['sex'] === 'M' ? 'Male' : 'Female';

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

const StudentDetailDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_rgs_detail');
    this.btnPrint = mThis.self.find('#dlg_rgs_detail_btn_print');

    mThis.btnPrint.on('click',function(e){
        e.preventDefault();
        console.log("Print Now!");
    });

    this.setDataForm = (d) => {
        d = d ? d : {};
        d['sex'] = d['sex'] === 'M' ? 'Male' : 'Female';
        mThis.self.find('.data-show').each(function(){
            const el = $(this);
            const f = el.data('field');
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

let FamilyDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_rgs_family_');

    this.prepareFormOption = (option) => {
        const el = mThis.self.find('.data-input');
        vsapi.call(`${main_view.base_url}/api/guardian/options-family`,null,null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                VSUtil.setComboItems(el,d,'family_code','family',null,null,null);
            }
        });
        el.on('change',function(e){
            e.preventDefault();
            const op = {
                'family_code': $(this).val()
            };
            vsapi.call(`${main_view.base_url}/api/enrollment/get-guardian-info`,op,null,false).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    let d = res.data;
                    d.family_code = op.family_code;
                    if(typeof option.onClose === 'function')
                        option.onClose(d);
                }
            });
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(options);
        mThis.self.modal({
            backdrop:'static'
        });
    }
}

//begin::LeaveDialog
const LeaveDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.find('#_leave_dlgLeave');
    this.btnSave = this.self.find('#_leave_dlgLeave_btnSave');
    this.elTitle = this.self.find('.modal-title');
    this.elAcademicYear = this.self.find('#_leave_acad_year');
    this.elTerm = this.self.find('#_leave_term');
    this.elLeaveType = this.self.find('#_leave_type');
    this.elLeaveDate = this.self.find('#_leave_date');
    this.options = {};
    this.selected_options = {};

    this.btnSave.on('click',e=>{
        const p = mThis.getFormData(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/leave/save`,p,mThis.btnSave).then(res=>{
            if(res.status_code ===200){
                mThis.options.onClose(); 
                mThis.self.modal('hide');
            }else cv_interact.warning(res.error_message);
        });
        
    });
    
    this.elAcademicYear.on('change',e=>{
      e.preventDefault();
      vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':mThis.elAcademicYear.val()},null).then(res=>{
          let terms = res.status_code ==200? StringSanitizer.sanitizeObject(res.data,null,['term_name']):[]; 
          VSUtil.setComboItems(mThis.elTerm,terms,'id','term_name',true,'(Choose Term)',mThis.selected_options.leave_term_id);
          mThis.elTerm.prop('disabled',mThis.elTerm.val()>0);
      });
    });

    this.getFormData = (silent)=>{
        let p = {};
        let has_error = false;
        mThis.self.find('.data-input').each(function(){
             const el = $(this);
             const f = el.data('field');
             if(el.data('error') ==1){
                has_error = true;
                if(!silent) cv_interact.error([Validator.properCase(f),' is not correct'].join(''));
                return false;
             }
           
             p[f] = el.val();
        });
        p.id = mThis.options.id;
        p.enrollment_id = mThis.options.enrollment_id;
        return has_error? null:p;
    }

    this.setFormData = (d)=>{
        d = d?d:{};
        mThis.self.find('.data-input').each(function(){
             const el = $(this);
             const f = el.data('field');
             if(el.is('select')){
                 mThis.selected_options[f] = d[f]; 
                 el.val(d[f]).trigger('change');
             }else{
                el.val(d[f]);
             }
        });
        mThis.elAcademicYear.prop('disabled',d.academic_year && d.leave_term_id);
        mThis.elLeaveDate.val(DateHelper.getTodayDate());
    }

    //NOTE: op = {'id','enrollent_id'} . id = leave_id
    this.prepareFormOptions = (op,onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/leave/form-options`,op,false).then(res=>{
            if(res.status_code ===200){
                const d = res.data;
                const enroll_info = d.enrollment_info? d.enrollment_info:{};
                let leave_info = d.leave_info?d.leave_info:{};
                leave_info.student_name = enroll_info.student_name;
                leave_info.sex = enroll_info.sex;
                leave_info.phone_number =enroll_info.phone_number;
                leave_info.group_name =enroll_info.group_name;
                leave_info.image_url = enroll_info.image_url;
                leave_info.academic_year = enroll_info.academic_year;
                leave_info.leave_term_id = enroll_info.leave_term_id;
                leave_info.level_name = enroll_info.level_name;
                mThis.selected_options.leave_term_id =enroll_info.leave_term_id;
                d.leave_info = leave_info;

                VSUtil.setComboItems(mThis.elAcademicYear,d.academic_years,'academic_year','academic_year',true,'(Academic Year)',0);
                //VSUtil.setComboItems(mThis.elTerm,d.terms,'id','term_id',true,'(Choose Term)',0);
                VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',true,'(Leave Type)',null);
                mThis.elLeaveType.val(d.leave_types[0]?d.leave_types[0].id:null).trigger('change');
                onFinish(d);
            }else cv_interact.warning('Failed to load form options for Leave Dialog');
           
        });
    }

    this.show = (options)=>{
      mThis.options = options? options:{};
      mThis.prepareFormOptions({'id':options.id,'enrollment_id':options.enrollment_id},(d)=>{
        if(d.leaveInfo){
            mThis.elTitle.text('Modify Leave Info');
        }else{
            mThis.elTitle.text('Set Leave Info');
        }
        mThis.setFormData(d.leave_info);
        mThis.self.modal({
          'backdrop':'static'
        });
      });
     
    }
}
//end::LeaveDialog
 
window.addEventListener('DOMContentLoaded',() => {
    EnrolledStudentsComponent.init();
});
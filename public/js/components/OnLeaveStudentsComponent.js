"use strict";
var OnLeaveStudentsComponent = new function(){
    let mThis = this;
    this.title_prop = "On-Leave Students";
    this.self = $('#_main_onLeaveComponent');
    this.options = {};
    
    this.btnPrint = this.self.find('#_rgs_btnPrint');
    this.div_filter_form = this.self.find('#_rgs_filters');
    this.div_input = mThis.self.find('#st-register--input');
    this.div_list = mThis.self.find('#st-register--list');
    this.div_enroll_path = this.div_input.find('#_rgs_div_enrollment_path');

    this.elFilter_program = this.div_filter_form.find('#_rgs_filter_program');
    this.elFilter_level = this.div_filter_form.find('#_rgs_filter_level');

    //this.elAcademicYear = this.self.find('#_rgs_acad_year');
    // this.elTerm = this.self.find('#_rgs_term');
    // this.elLevel = this.self.find('#_rgs_level');
    // this.elCampus = this.self.find('#_rgs_campus');
    // this.elSession = this.self.find('#_rgs_session');
    // this.elGroup = this.self.find('#_rgs_group');
    this.elSearchStudent = this.self.find('#_onleave_search_student');

    //this.elPrevSchool = this.self.find('#_rgs_prev_school');
    //this.lnkAddGroup = this.self.find('#_rgs_lnkAddStudentGroup');
    
    //this.selected_options = {};

    this.init = () => {
        mThis.studentListView = new ListView('_onleave_list_view',{
            'fetchApi':`${main_view.base_url}/api/leave/list-paginate`,
            'perPage':5,
            'renderItems':(items,list_container) => {
                mThis.renderStudents(list_container,items);
            },
            'listContainerClass':null
        });
         
        mThis.div_filter_form.find('.filter-field').each(function(){
            const el = $(this);
            el.on('change',function(e){
                e.preventDefault();
                mThis.studentListView.showPage(mThis.getFilterData());
            });
        });

        mThis.div_enroll_path.on('change','.g-filter',function(e){
            e.preventDefault();
            mThis.loadOptions_group();
        });
       
        mThis.elSearchStudent.on('keyup',e=>{
          e.preventDefault();
          mThis.studentListView.showPage(mThis.getFilterData()); 
        });

        // mThis.elAcademicYear.on('change',function(e){
        //     e.preventDefault();
        //     let op = {
        //         'academic_year': $(this).val()
        //     };

        //     vsapi.post(`${main_view.base_url}/api/settings/options-term`,op,false).then(res=>{
        //         let items = res.status_code === 200 ? res.data : [];
        //         VSUtil.setComboItems(mThis.elTerm,items,'id','term_name',true,'(Choose Term)',null);
        //         mThis.elTerm.val(mThis.selected_options.term_id).trigger('change');
        //     });
        // });

        mThis.elFilter_program.on('change',function(e){
            vsapi.call(`${main_view.base_url}/api/settings/options-level`,{'program_id':$(this).val()},null,false).then(res=>{
                let items = res.status_code === 200 ? res.data : [];
                VSUtil.setComboItems(mThis.elFilter_level,items,'id','level_name',true,'(All Grades)',0);
                mThis.elFilter_level.val(0).trigger('change');
            });
        });

        mThis.elFilter_level.on('change',function(e){
            e.preventDefault();
           mThis.studentListView.showPage(mThis.getFilterData());
        });
 
        mThis.btnPrint.on('click',function(e){
            e.preventDefault();
            alert('Print Leave report');
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
 
    // //renderPhoto()
    // this.renderImage = (div, image) => {
    //     let html = null;
    //     if(image && image != 'undefined'){
    //         html = [`<img class="img-show data-input" src="${image}" data-field="photo" data-required="false"/>
    //         <div class="btn-options">
    //             <i class="fa-regular fa-trash-can text-danger fs-5 btn-delete"></i>
    //         </div>`].join('');
    //     }
    //     else{
    //         html = [`<div id="clickable_img">
    //             <i class="fa-regular fa-image text-muted fs-3"></i>
    //         </div>`].join('');
    //     }
    //     div.html(html);
    //     //Must store options.photo as image url or as base64 in order to pass back to api. because NULL photo passed to api => means delete the student's photo
    //     mThis.options.photo = image;
    //     div.find('#clickable_img').on('click',function(e){
    //         e.preventDefault();
    //         FileChooser.chooseFile(null,(d) => {
    //             if(d){
    //                 mThis.options.photo = d.dataUrl;
    //                 mThis.renderImage(div, d.dataUrl);
    //             }
    //         });
    //     });

    //     div.on('mouseenter', () => {
    //         div.find('.btn-delete').show();
    //     }).on('mouseleave', () => {
    //         div.find('.btn-delete').hide();
    //     });

    //     div.find('.btn-delete').on('click',function(e){
    //         e.preventDefault();
    //         mThis.options.photo = null;

    //         div.html([`<div id="clickable_img">
    //             <i class="fa-regular fa-image text-muted fs-3"></i>
    //         </div>`].join(''));

    //         div.find('#clickable_img').on('click',function(e){
    //             e.preventDefault();
    //             FileChooser.chooseFile(null,(d) => {
    //                 if(d){
    //                     mThis.options.photo = d.dataUrl;
    //                     mThis.renderImage(div, d.dataUrl);
    //                 }
    //             });
    //         });
    //     });
    // }
   
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
     
    this.renderStudents = (div_register_list,data) => {
            let html = null;
            let cnt = 0;
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
                                            <a href="javascript:void(0)" class="btn-rgs-suspend border-bottom pb-2" data-id="${item.id}">
                                                <i class="fa-solid fa-spinner fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Suspended"></span>
                                            </a>
                                            <a href="javascript:void(0)" class="btn-rgs-dropout border-bottom pb-2" data-id="${item.id}">
                                                <i class="fa-regular fa-circle-stop fs-5"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Dropout"></span>
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
                html =[`<div class="d-flex bg-white p-3 rounded-3 align-items-center"><h5>`,LocaleManager.trans('No data to display'),`</h5></div>`].join('');
            }

            div_register_list.innerHTML = html;
            const j_div = $(div_register_list);
            mThis.setEvents(j_div);
            LocaleManager.translateZone(j_div);
    }

    this.setEvents = (container) => {
        const div = container.find('.w-options'),
        btn = container.find('button.btn--Options');

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });

        container.find('button.btn--gnCard').on('click',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
           alert('supposed print card here');
        });

        container.off('click').on('click','button.btn-finalize',function(e){
            e.preventDefault();
            let op = {
                'enrollment_id': $(this).data('id')
            };
            if($(this).data('status') == 1){
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

            div.on('click','a.btn-rgs-details',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
                };
                mThis.loadDataPrint(op,(data) => {
                    LeaveDetailDialog.show(data);
                });
            });

            //Edit enrollment info
            div.on('click','a.btn-rgs-edit',function(e){
                e.preventDefault();
                const enrollment_id = $(this).data('id');
                mThis.options.id = enrollment_id;

                mThis.prepareFormOption(enrollment_id,mThis.div_input,'data-input',(d) => {
                    mThis.setDataForm(d.enrollment_info);
                    mThis.div_input.fadeIn(200).siblings().hide();
                });
            });

            div.on('click','a.btn-rgs-delete',function(e){
                e.preventDefault();
                let op = {
                    'id': $(this).data('id')
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
    }

    //Show Registration Component
    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(null,mThis.div_list,'filter-field',() => {
            //Set default options for Filter fields
            mThis.setFilterData(options.filter); 
            main_view.setTitle(mThis.title_prop);
            mThis.studentListView.showPage(mThis.getFilterData());
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}
 
let LeaveDetailDialog = new function(){
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
 
window.addEventListener('DOMContentLoaded',() => {
    OnLeaveStudentsComponent.init();
});
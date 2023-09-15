"use strict";
var OnLeaveStudentsComponent = new function(){
    let mThis = this;
    this.title_prop = "On-Leave Students";
    this.self = main_view.appContent.children('#_main_onLeaveStudentsComponent');
    this.options = {};
    
    this.btnPrint = this.self.find('#_onleave_btnPrint');
    this.div_filter_form = this.self.find('#_onleave_filters');
    this.div_input = mThis.self.find('#st-leave--input');
    this.div_list = mThis.self.find('#st-leave--list');
    this.div_enroll_path = this.div_input.find('#_onleave_div_enrollment_path');

    this.elFilter_program = this.div_filter_form.find('#_onleave_filter_program');
    this.elFilter_level = this.div_filter_form.find('#_onleave_filter_level');

    //this.elAcademicYear = this.self.find('#_onleave_acad_year');
    // this.elTerm = this.self.find('#_onleave_term');
    // this.elLevel = this.self.find('#_onleave_level');
    // this.elCampus = this.self.find('#_onleave_campus');
    // this.elSession = this.self.find('#_onleave_session');
    // this.elGroup = this.self.find('#_onleave_group');
    this.elSearchStudent = this.self.find('#_onleave_search_student');

    //this.elPrevSchool = this.self.find('#_onleave_prev_school');
    //this.lnkAddGroup = this.self.find('#_onleave_lnkAddStudentGroup');
    
    //this.selected_options = {};
    // this.cols = [
    //    {
    //      "title":"ID",
    //      "data":(data,index,tr)=>{
    //         return ['<span class="fw-semibold">',data.student_code,'</span>'].join('');
    //      }
    //    },
    //    {
    //     "title":"Student Name",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="">',data.name,'</span>'].join('');
    //     }
    //    },
    //    {
    //     "title":"Sex",
    //     "data":"sex" 
    //    },
    //    {
    //     "title":"Date of Birth",
    //     "data":"date_of_birth"
    //    },
    //    {
    //     "title":"Phone Number",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="">',data.phone_number,'</span>'].join('');
    //     }
    //    },
    //    {
    //     "title":"Level",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="">',data.level_name,'</span>'].join('');
    //     }
    //    },
    //    {
    //     "title":"Days to End",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="">',data.days_to_enddate,' days</span>'].join('');
    //     }
    //    },
    //    {
    //       "title":"Leave Type",
    //       "data":"leave_type"
    //    },
    //    {
    //     "title":"Reason",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="">',data.leave_remarks,'</span>'].join('');
    //     }
    //    },
    //    {
    //     "title":"Return Info",
    //     "data":(data,index,tr)=>{
    //        const return_str = data.has_returned ==1? ['<span class="border rounded-5 p-1 shadow bg-success">Returned</span>'].join('') : data.leave_type;
    //        const return_date = data.return_date? ['<span class="d-block text-nowrap">Expected Return: ',data.return_date,'</span>'].join('') : '';  
    //        return [return_date,return_str].join('');
    //     }
    //    },
    //    {
    //     "title":"Booked By",
    //     "data":(data,index,tr)=>{
    //        return ['<span class="d-block fw-semibold">',data.update_user,'</span>','<span class=""><small>',data.updated_at,'</small></span>'].join('');
    //     }
    //    },
    //    {
    //     "title":"Authorization",
    //     "data":(data,index,tr)=>{
    //        let auth_user ='Pending';
    //        let auth_date =''; 
    //        if(data.authorized == 1){
    //           auth_user= data.auth_user;
    //           auth_date = data.auth_date;
    //        }  
    //        return ['<span class="d-block fw-semibold">',auth_user,'</span>','<span class=""><small>',auth_date,'</small></span>'].join('');
    //     }
    //    }
    // ];

    this.init = () => {
        mThis.studentListView = new ListView('_onleave_list_view',{
            'fetchApi':`${main_view.base_url}/api/leave/list-paginate`,
            'perPage':5,
            //'columns':mThis.cols,
            'renderItems':(items,list_container) => {
                mThis.renderStudents(list_container,items);
            },
            'listContainerClass':null
        });
       
        mThis.div_filter_form.find('.filter-field').on('change',e=>{
           
            const el = e.target;
            const f = el?el.dataset.field:null;

            if(f ==='academic_year'){
               vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':el.value},false).then(res=>{
                   const terms = res.status_code ===200? StringSanitizer.sanitizeObject(res.data):[];
                   VSUtil.setComboItems(mThis.elFilter_term,terms,'id','term_name',true,'(All Terms)',0);
               });  
            }
            else if(f==='program_id'){
                vsapi.call(`${main_view.base_url}/api/settings/options-level`,{'program_id':el.value},null,false).then(res=>{
                    let items = res.status_code === 200 ? res.data : [];
                    VSUtil.setComboItems(mThis.elFilter_level,items,'id','level_name',true,'(All Grades)',0);
                });
            } 

            if(!mThis.disable_filter){
                mThis.studentListView.showPage(mThis.getFilterData());
            }

        });

        // mThis.div_filter_form.find('.filter-field').each(function(){
        //     const el = $(this);
        //     el.on('change',function(e){
        //         e.preventDefault();
        //         mThis.studentListView.showPage(mThis.getFilterData());
        //     });
        // });
 
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
  
        mThis.btnPrint.on('click',function(e){
            e.preventDefault();
            alert('Print Leave report');
        });
    }

    this.setParentInfo = (d) => {
        d = d ? d : {};
        mThis.options.family_code = d.family_code;
        const div = mThis.div_input,
        div_parent = div.find('#_onleave_parent_info');
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
                //let finalized = item.enroll_finalized == 1 ? 'd-none':''; 
                let return_info = item.authorized == 1? null:'<span class="d-block p-2 border rounded-5 border-success">Pending</span>';
                if(!return_info) return_info = item.has_returned ==1? '<span class="d-block p-2 border rounded-5 border-success">Returned</span>':['<span class="d-block p-2 border rounded-5 border-danger">',item.leave_type,'</span>'].join('');
                
                const finalize_button = `<div class="d-block position-relative" >
                                            <button class="btn-finalize btn btn-sm glow-on-hover" type="button" data-id="${item.id}" data-status="${item.authorized}">
                                                <span class="trans-text" data-langprop="buttons.Finalize"></span>
                                            </button>
                                        </div>`;

                html = [html,`<div class="d-flex p-3 bg-white h-info-student mb-2">
                    <div class="div-img">
                        <img src="${item.image_url}" alt=""/>
                    </div>
                    <div class="d-block ms-3 w-100">
                        <div class="row row-cols-3 mb-0">
                            <div class="col">`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Student ID"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.student_code}</p>
                                </div>`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.name}</p>
                                </div>`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Sex"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.sex == 'M' ? 'Male':'Female'}</p>
                                </div>`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Date of Birth"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.date_of_birth}</p>
                                </div>`,
                            `</div>
                            <div class="col">`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Year"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.academic_year}</p>
                                </div>`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Semester"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.term_name}</p>
                                </div>`,

                                `<div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Campus"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${item.campus}</p>
                               </div>`,
                                `<div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Grade"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">`,item.level_name,`</p>
                               </div>`,
                           `</div>
                            <div class="col position-relative">
                                <div class="d-flex align-items-start justify-content-end gap-2">`,
                                    `<button class="btn-leave-delete btn btn-sm btn-danger rounded-3 btn--gnCard" type="button" data-id="${item.id}">
                                        <span class="text-nowrap trans-text" data-langprop="buttons.Delete"></span>
                                    </button>`,
                                    `<button class="btn-leave-return btn btn-sm btn-success rounded-3 btn--gnCard" type="button" data-id="${item.id}">
                                      <span class="text-nowrap trans-text" data-langprop="buttons.Return"></span>
                                    </button>`,

                                //     `<button class="btn btn-sm btn-danger rounded-3 btn--Options position-relative text-nowrap" type="button">
                                //         <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                //         <i class="fa-solid fa-caret-down ps-2"></i>
                                //         <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                //             <a href="javascript:void(0)" class="btn-rgs-details border-bottom pb-2" data-id="${item.id}">
                                //                 <i class="fa-solid fa-up-right-from-square fs-5"></i>
                                //                 <span class="ps-2 trans-text" data-langprop="titles.Detials"></span>
                                //             </a>
                                //             <a href="javascript:void(0)" class="btn-rgs-suspend border-bottom pb-2" data-id="${item.id}">
                                //                 <i class="fa-solid fa-spinner fs-5"></i>
                                //                 <span class="ps-2 trans-text" data-langprop="titles.Suspended"></span>
                                //             </a>
                                //             <a href="javascript:void(0)" class="btn-rgs-dropout border-bottom pb-2" data-id="${item.id}">
                                //                 <i class="fa-regular fa-circle-stop fs-5"></i>
                                //                 <span class="ps-2 trans-text" data-langprop="titles.Dropout"></span>
                                //             </a>
                                //             <a href="javascript:void(0)" class="${finalized} btn-rgs-edit border-bottom py-2" data-id="${item.id}">
                                //                 <i class="fa-regular fa-pen-to-square fs-5"></i>
                                //                 <span class="ps-2 trans-text" data-langprop="titles.Edit"></span>
                                //             </a>
                                //             <a href="javascript:void(0)" class="${finalized} btn-rgs-delete pt-2" data-id="${item.id}">
                                //                 <i class="fa-regular fa-trash-can fs-5"></i>
                                //                 <span class="ps-2 trans-text" data-langprop="titles.Delete"></span>
                                //             </a>
                                //         </div>
                                //     </button>`,
                                 `</div>`,
                                `<div class="d-flex justify-content-end align-items-center h-100" role="button">
                                   ${item.authorized == 1? '':finalize_button}
                                </div>`,
                            `</div>`,
                        `</div>
                        <hr class="bg-dark m-1 p-0"/>
                        <div class="row row-cols-5 mt-2">
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Leave Type"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.leave_type}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Leave Date"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${item.leave_date}</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.DTE"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">`,item.days_to_enddate,` days (`,item.tuition_end_date?item.tuition_end_date:'NA',`)`,`</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">${return_info}</div>
                            </div>`,
                        `</div>
                           <div class="row row-col-5 mt-2">
                                <div class="col">
                                    <div class="d-flex">
                                        <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Reason"></p>
                                        <p class="px-2">:</p>
                                        <p class="text-nowrap">${item.leave_remarks}</p>
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
            mThis.setEvents(div_register_list);
            LocaleManager.translateZone(div_register_list,{'jQuery':true,'hide':true});
    }

    this.setEvents = (container) => {
        // const div = container.querySelector('.w-options'),
        // btn = container.querySelector('button.btn--Options');

        // btn.addEventListener.on('click',e=>{
        //     e.preventDefault();
        //     e.target.querySelector('.w-options').toggle('fast');
        // });

        // container.find('button.btn--gnCard').on('click',function(e){
        //     e.preventDefault();
        //     let op = {
        //         'id': $(this).data('id')
        //     };
        //    alert('supposed print card here');
        // });
        const btnFinalize = container.querySelector('.btn-finalize');
        if(btnFinalize){
            btnFinalize.addEventListener('click',e=>{
                e.preventDefault();
                let op = {
                    'id': btnFinalize.dataset.id
                };

                if(btnFinalize.dataset.authorized == 1){
                    cv_interact.warning('This Leave Information is already finalized!');
                }
                else{
                    cv_interact.confirm('You are about to set the student on Leave as "dropout". Do you wish to proceed now?',{
                        title: 'Finalize Leave',
                        context: 'OK'
                    },(e) => {
                        if(e){
                            vsapi.call(`${main_view.base_url}/api/leave/finalize`,op,null).then(res => {
                                if(res.status_code === 200){
                                    mThis.studentListView.showPage(mThis.getFilterData());
                                    cv_interact.success('Leave Status has been finalized!');
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    });
                }
            });
        }


        let btn = container.querySelector('.btn-leave-delete');
        if(btn){
             btn.addEventListener('click',e=>{
                e.preventDefault();
                const id = btn.dataset.id;
                cv_interact.confirm('Delete this Leave Request?',{'context':'delete','title':'Delete Leave'},e=>{
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/leave/delete`,{'id':id},false).then(res=>{
                            if(res.status_code===200){
                                 mThis.studentListView.showPage(mThis.getFilterData());
                            }
                        }); 
                    }
                })
               
             });
        }
        
        btn = container.querySelector('.btn-leave-return');
        if(btn){
             btn.addEventListener('click',e=>{
                e.preventDefault();
                const id = btn.dataset.id;
                //alert('return ' + id);
                let op = {
                    'id':id,
                    'onClose':()=>{
                       mThis.studentListView.showPage(mThis.getFilterData()); 
                    }
                }
                ReturnDialog.show(op); 
             });
        }
        
        // if(div.length != 0){
        //     // let prev_div = null;
        //     // $(document).off('click').on('mouseup',function(e){
        //     //     e.preventDefault();
        //     //     if((!div.is(e.target) && div.has(e.target).length === 0) && prev_div){
        //     //         prev_div.hide('fast');
        //     //     }
        //     //     else{
        //     //         if((!div.is(e.target) && div.has(e.target).length === 0) && (!btn.is(e.target) && btn.has(e.target).length === 0)){
        //     //             prev_div = div;
        //     //             div.hide('fast');
        //     //         }
        //     //     }
        //     // });
 
        //     // //Edit enrollment info
        //     // div.on('click','a.btn-rgs-edit',function(e){
        //     //     e.preventDefault();
        //     //     const enrollment_id = $(this).data('id');
        //     //     mThis.options.id = enrollment_id;

        //     //     mThis.prepareFormOption(enrollment_id,mThis.div_input,'data-input',(d) => {
        //     //         mThis.setDataForm(d.enrollment_info);
        //     //         mThis.div_input.fadeIn(200).siblings().hide();
        //     //     });
        //     // });

        //     // div.on('click','a.btn-rgs-delete',function(e){
        //     //     e.preventDefault();
        //     //     let op = {
        //     //         'id': $(this).data('id')
        //     //     };

        //     //     cv_interact.confirm('Delete this enrollment?',{title: 'Delete Information', context: 'delete'},(e) => {
        //     //         if(e){
        //     //             vsapi.call(`${main_view.base_url}/api/enrollment/delete`,op,null).then(res => {
        //     //                 if(res.status_code === 200){
        //     //                     mThis.studentListView.showPage(mThis.getFilterData());
        //     //                 }
        //     //                 else{
        //     //                     cv_interact.error(res.error_message);
        //     //                 }
        //     //             });
        //     //         }
        //     //     });
        //     // });
        // }
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
        mThis.disable_filter = true;
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
        mThis.disable_filter = false;
        let filter = mThis.getFilterData();
        filter.level_id = 0;
        mThis.studentListView.show(filter);
    }

    //Show OnLeaveStudentsComponent
    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareFormOption(null,mThis.div_list,'filter-field',() => {
            //Set default options for Filter fields
            mThis.setFilterData(options.filter);  //set filterData() will also refresh the student list
            main_view.setTitle(mThis.title_prop);
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

const ReturnDialog = new function(){
   let mThis = this;
   this.self = main_view.appContent.children('#_leave_dlgReturn');
   this.btnSave = this.self.find('#_leave_dlgReturn_btnSave');

   this.elPrevSchool = this.self.find('#_leave_comeback_prev_school');
   this.elAcademicYear = this.self.find('#_leave_comeback_year');
   this.elTerm = this.self.find('#_leave_comeback_term');
   this.elCampus = this.self.find('#_leave_comeback_campus');
   this.elSession = this.self.find('#_leave_comeback_session');
   this.elLevel = this.self.find('#_leave_comeback_level');
   this.elGroup = this.self.find('#_leave_comeback_group');
   this.lnkAddGroup = this.self.find('#_leave_lnkAddGroup');

   this.selected_options = {};
   this.options = {};

   this.prev_school_label = new OptionEditor('_leave_prev_school_label',{
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

        const c_op = mThis.options;
        c_op.default_data = mThis.getFormData();

        let op = {
                'id':group_id,
                'academic_year':mThis.elAcademicYear.val(),
                'term_id':mThis.elTerm.val(),
                'campus_id':mThis.elCampus.val(), /**/
                'program_id':null, /** user select only Level to create student Group */
                'level_id':mThis.elLevel.val(),
                'session_id':mThis.elSession.val(), /**/
                'previousDialog':mThis,
                'previousDialogOptions':c_op,
                'onClose':(group)=>{
                cv_interact.success(['Student group ',group.name,' was created successfully'].join('')); 
                alert(group.id);
                mThis.selected_options.group_id = group.id; 
                mThis.elLevel.trigger('change');
            }
        };
        StudentGroupDialog.show(op);
  });

   this.btnSave.on('click',e=>{
       let p = mThis.getFormData(false);
       if(!p) return;
       //save-return |return/save
       console.log(p);
       vsapi.call(`${main_view.base_url}/api/leave/comeback/save`,p,null,false).then(res=>{
           if(res.status_code ===200){
               cv_interact.success('Student has now returned to school');
               mThis.options.onClose();
               mThis.self.modal('hide');
           }else cv_interact.warning(res.error_message);  
       });

   });
 
   this.elAcademicYear.on('change',e=>{
        vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':mThis.elAcademicYear.val()},null).then(res=>{
              const items = res.status_code ===200? res.data:[];
              const def_term_id = mThis.selected_options.term_id? mThis.selected_options.term_id : (items[0]?items[0].id:null);
              VSUtil.setComboItems(mThis.elTerm,items,'id','term_name',null,null,def_term_id);
        });

   });

   this.self.on('change','.group-filter',e=>{
      e.preventDefault();
      mThis.loadOptions_group();
   });

   this.getEnrollmentPath = ()=>{
        let p = {};
        mThis.self.find('select.group-filter').each(function(){
            const el = $(this);  
            const f = el.data('field');
            p[f] = el.val();
        });
        p.term_id = p.term_id? p.term_id: p.return_term_id;
        return p;
   }

   this.loadOptions_group = ()=>{
        //mThis.getEnrollmentPath() will return the selected op such as  {'academic_year','term_id','level_id','session_id'}
        const op = mThis.getEnrollmentPath();
        vsapi.call(`${main_view.base_url}/api/settings/options-group`,op,null,false).then(res=>{
            let items = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data,null,['group_name']):[];
            VSUtil.setComboItems(mThis.elGroup,items,'id','group_name',true,'(Choose Group)',mThis.selected_options.group_id);
        });
  }
  
   this.prepareFormOptions = (onFinish)=>{
      vsapi.call(`${main_view.base_url}/api/leave/comeback/form-options`,null,null).then(res=>{
          let d = res.status_code ===200? res.data : {};
          VSUtil.setComboItems(mThis.elPrevSchool,d.schools,'id','name',true,'None',0);
          VSUtil.setComboItems(mThis.elAcademicYear,d.academic_years,'academic_year','academic_year',null,null,null);
          VSUtil.setComboItems(mThis.elCampus,d.campuses,'id','campus_name',null,null,null);
          VSUtil.setComboItems(mThis.elLevel,d.levels,'id','level_name',null,null,null);
          VSUtil.setComboItems(mThis.elSession,d.sessions,'id','session_name',null,null,null);
          onFinish();
      });
   }

   this.getFormData = (slient = false)=>{
      let p = {};
      let has_error = false;
      mThis.self.find('.data-input').each(function(){
          const el = $(this);
          const f = el.data('field');
          if(el.data('error') ==1){
            has_error = true;
            if(!silent) cv_interact.error([f,' is not correct']);
            return false;
          }
          p[f] = el.val();
      });
      //LeaveId
      p.id = mThis.options.id;
      return has_error? null:p;
   }

   this.setFormData = (d)=>{
     d =d?d:{};
     mThis.self.find('.data-input').each(function(){
        const el = $(this);
        const f = el.data('field');
        if(f){
            mThis.selected_options[f] = d[f];
            if(el.is('select')) 
              el.val(d[f]).trigger('change');
            else el.val(d[f]);
        }
     });
   }

   this.show = (options)=>{
      options = options? options:{};
      mThis.prepareFormOptions(()=>{
        //NOTE options.default_data is {academic_year,term_id,campus_id,level_id,session_id,group_id}
        mThis.setFormData(options.default_data);
        mThis.self.modal({
            backdrop:'static'
          });
      });
     
   }

}

window.addEventListener('DOMContentLoaded',() => {
    OnLeaveStudentsComponent.init();
});
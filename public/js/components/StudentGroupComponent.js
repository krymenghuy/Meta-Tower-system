'use strict';
var StudentGroupComponent = new function(){
    const mThis = this;
    this.sessions =[];
    this.levels = [];
    this.campuses = [];
    this.title_prop = 'Student Groups';
    this.self = $('#_main_studentGroupComponent');
    this.tblStudentGroup = mThis.self.find('#_sdg_tbl');
    this.btnNew = mThis.self.find('#_sdg_btn_new');
  
    this.elFilter_term = this.self.find('#_sdg_filter_term');
    this.elFilter_program = this.self.find('#_sdg_filter_program');
    this.elFilter_session = this.self.find('#_sdg_filter_session');

    this.cols = [{
            title: "Group Name",
            data: (data, index, tr) => {
                if(data.name == data.descriptive_name) data.name = '';
                if(!data.descriptive_name) data.descriptive_name = data.name;
                return ['<div class="d-flex flex-column"><span class="fw-semibold">',data.descriptive_name,'</span><span class="text-left text-muted">',data.name,'</span></div>'].join('');
            }
        },
        {
            title: "Session",
            data: "session_name"
        },
        {
            title: "Program",
            data: (data, index, tr) =>{
                return ['<div class="d-flex flex-column"><span class="fw-semibold">',data.program_name,'</span><span class="text-left">',data.level_name,'</span></div>'].join('');
            }
        },
        {
            title: "Students",
            data: "student_count"
        },
        {
            title: "Remarks",
            data: (data, index, tr) => {
                return data.remarks ? data.remarks : 'No Remarks';
            }
        },
        {
            title: "Action",
            data: (data, index, tr) => {
                return [`<div class="d-flex gap-2">
                    <a href="javascript:void(0)" class="btn-sdg-modify" data-id="${data.id}">
                        <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                    </a>
                    <a href="javascript:void(0)" class="btn-sdg-delete" data-id="${data.id}">
                        <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                    </a>
                </div>`].join('');
            }
        }];

    this.getFilterData = () => {
        return {
            'term_id':mThis.elFilter_term.val(),
            'program_id':mThis.elFilter_program.val(),
            'session_id':mThis.elFilter_session.val()
        };
    }

   //*** init StudentGroupsComponent
    this.init = () => {
        mThis.groupListview = new ListView('div_group_list',{
            'fetchApi':`${main_view.base_url}/api/student-group/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-id',data.id);
                tr.setAttribute('data-sessionid',data.session_id);
            },
            'beforeRender':()=>{}
        });

        mThis.tblStudentGroup = $(mThis.groupListview.getTable());

        mThis.elFilter_term.on('change',function(e){
            e.preventDefault();
            mThis.groupListview.showPage(mThis.getFilterData(),null,null);
        });

        mThis.elFilter_program.on('change',function(e){
            e.preventDefault();
            mThis.groupListview.showPage(mThis.getFilterData(),null,null);
        });

        mThis.elFilter_session.on('change',function(e){
            e.preventDefault();
            mThis.groupListview.showPage(mThis.getFilterData(),null,null);
        });

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.groupListview.showPage(mThis.getFilterData(),null,null);
                }
            };
            StudentGroupDialog.show(op);
        });

        mThis.tblStudentGroup.on('click','a.btn-sdg-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.groupListview.showPage(mThis.getFilterData())
                }
            };
            StudentGroupDialog.show(op);
        });

        mThis.tblStudentGroup.on('click','a.btn-sdg-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this group?',{title: 'Delete Group', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/student-group/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.groupListview.showPage(mThis.getFilterData());
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });
    }
 
    this.loadFilterOptions = (onFinish=null)=>{
        vsapi.call(`${main_view.base_url}/api/student-group/form-options`,null,null,false).then(res => {
            if(res.status_code === 200){
                const d =StringSanitizer.sanitizeObject(res.data,null,[]);
                const def_term_id =d.terms[0]?d.terms[0].id:null;
                VSUtil.setComboItems(mThis.elFilter_term,d.terms,'id','term_name',null,null,null);
                VSUtil.setComboItems(mThis.elFilter_program,d.programs,'id','program_name',true,'(All Programs)',0);
                VSUtil.setComboItems(mThis.elFilter_session,d.sessions,'id','session_name',true,'(All Session)',0);
                mThis.elFilter_term.val(def_term_id).trigger('change');
                onFinish(d);
            }
            else
                cv_interact.error('Failed to load Filter data for Student Groups Component');
        });
    }

    this.show = (options) => {
        if(!options) options = {};

        mThis.loadFilterOptions(()=>{
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let StudentGroupDialog = new function(){
    const mThis = this;
    this.self = $('#dlg_sdg_');
    this.options = {};
 
    this.elTitle = mThis.self.find('.modal-title');
    this.elSession = mThis.self.find('#dlg_sdg_session');
    this.elProgram = mThis.self.find('#dlg_sdg_program');
    this.elCampus = mThis.self.find('#dlg_sdg_campus');
    this.elGroupName = mThis.self.find('#dlg_sdg_name');
    this.elAcademicYear = mThis.self.find('#dlg_sdg_academic_year');
    this.elTerm = mThis.self.find('#dlg_sdg_term');
    this.elLevel = mThis.self.find('#dlg_sdg_level');
    this.btnSave = mThis.self.find('#dlg_sdg_btn_save');
    this.selected_options = {};

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        const p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/student-group/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose(res.data.student_group);
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

    this.setFormData = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            if(el.is('select')){
                mThis.selected_options[f] = d[f];
                el.val(d[f]).trigger('change');
                if (!d.id || d.id==0){
                    //In case of creating New Group => When there are (academic_year,term_id,campus_shortcut,level_id, session_shortcut) supplied as default => then disable SELECT to preven user from chaning it
                    el.prop('disabled',(d[f] || d[f]>0));
                }else{
                    //In case of Editing Group Info
                    el.prop('disabled',(d.has_member || d.has_member==1));
                }
            }
            else{
                const readOnly = (d.has_attendnace_scanned || d.has_attendnace_scanned==1) && ((f == 'checkin_time') || (f == 'checkout_time'));
                el.prop('readonly',readOnly);
                el.val(d[f]);
            }
        });

        if(!d.id || d.id ==0) mThis.setGroupName();
    }

    mThis.elCampus.change('change',function(e){
        e.preventDefault();
        mThis.setGroupName();
    });

    mThis.elProgram.on('change',function(e){
        e.preventDefault();
        vsapi.call(`${main_view.base_url}/api/settings/options-level`,{'program_id':mThis.elProgram.val()},null,false).then(res => {
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data,null,null):[];
            VSUtil.setComboItems(mThis.elLevel,d,'id','level_name',null,null,mThis.selected_options.level_id);
        });
    });

    mThis.elAcademicYear.on('change',function(e){
        e.preventDefault();
        vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':mThis.elAcademicYear.val()},null,false).then(res => {
            let terms = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data,null,null) : {};
            VSUtil.setComboItems(mThis.elTerm,terms,'id','term_name',null,null,mThis.selected_options.term_id);
        });
    });

    mThis.elLevel.on('change',function(e){
        e.preventDefault();
        mThis.setGroupName();
    });

    mThis.elSession.on('change',function(e){
        e.preventDefault();
        mThis.setGroupName();
    });

    mThis.elTerm.on('change',function(e){
        e.preventDefault();
        mThis.setGroupName();
    });
  
   this.prepareFormOption = (group_id, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/student-group/form-options`,{'id': group_id},null,false).then(res => {
            const d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data,null,['academic_year','checkin_time','checkout_time']) : {};
            VSUtil.setComboItems(mThis.elCampus,d.campuses,'shortcut','campus_name',null,null,null);
            VSUtil.setComboItems(mThis.elAcademicYear,d.academic_years,'academic_year','academic_year',null,null,null);
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',null,null,null);
            VSUtil.setComboItems(mThis.elSession,d.sessions,'shortcut','session_name',null,null,null);
            mThis.campuses = d.campuses;
            mThis.sessions = d.sessions;
            mThis.levels =d.levels;/** This levels array is used for searching for program_id when there is only level_id is provided */ 
            if(typeof onFinish === 'function') onFinish(d);
        });
   }

    this.setGroupName = () => {
        let c = mThis.elCampus.val();
        let l = mThis.elLevel.find('option:selected').text();
        l = StringSanitizer.sanitizeOut(l);
        l = (l+'').replace(/\s/g,'',l);
        let s = mThis.elSession.val();
        let g_name = [c,'.',l,'.',s,'#'].join('');
        mThis.elGroupName.val(g_name);
    }
 
    this.getProgramId = (level_id) => {
        for (const l of mThis.levels) {
            if (l.id == level_id) {
                return l.program_id;
            }
        }
        return null;
    }

    this.getCampusShortcut = (campus_id) => {
        for (const c of mThis.campuses) {
            if (c.id == campus_id) {
                return c.shortcut;
            }
        }
        return null;
    }

    this.getSessionShortcut = (session_id) => {
        for (const s of mThis.sessions) {
            if (s.id == session_id) {
                return s.shortcut;
            }
        }
        return null;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(options.id ,(d) => {
            if(d.student_group){
                mThis.setFormData(d.student_group);
                mThis.elTitle.text(LocaleManager.trans('Modify Student Group','titles'));
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Student Group','titles'));
                const def_op = {'academic_year':options.academic_year,'term_id':options.term_id,'campus_id':options.campus_id,'level_id':options.level_id,'session_id':options.session_id};
                if(def_op.level_id > 0){
                    def_op.program_id = mThis.getProgramId(def_op.level_id);
                }
                def_op.campus_shortcut = def_op.campus_id > 0? mThis.getCampusShortcut(def_op.campus_id):null;
                def_op.session_shortcut = def_op.session_id > 0? mThis.getSessionShortcut(def_op.session_id):null;
                mThis.setFormData(def_op);
            }
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentGroupComponent.init();
});
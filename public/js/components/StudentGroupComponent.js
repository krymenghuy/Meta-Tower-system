'use strict';
var StudentGroupComponent = new function(){
    let mThis = this;
    this.title_prop = 'Student Groups';
    this.self = $('#_main_studentGroupComponent');
    this.tblStudentGroup = mThis.self.find('#_sdg_tbl');
    this.btnNew = mThis.self.find('#_sdg_btn_new');
  
    this.elFilter_term = this.self.find('#_sdg_filter_term');
    this.elFilter_program = this.self.find('#_sdg_filter_program');
    this.elFilter_session = this.self.find('#_sdg_filter_session');

    this.cols = [{
            title: "Group Name",
            data: (data, index, tr) =>{
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

    this.getFilterData = ()=>{
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
                    mThis.displayStudentGroup();
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
                            mThis.displayStudentGroup();
                        }
                    });
                }
            });
        });
    }
 
    this.loadFilterOptions = (onFinish=null)=>{
        vsapi.call(`${main_view.base_url}/api/student-group/form-options`,{'id':null},null,false).then(res => {
            if(res.status_code === 200){
                let d =StringSanitizer.sanitizeObject(res.data,null,[]);
                VSUtil.setComboItems(mThis.elFilter_term,d.terms,'id','term_name',null,null,null);
                VSUtil.setComboItems(mThis.elFilter_program,d.programs,'id','program_name',null,null,null);
                VSUtil.setComboItems(mThis.elFilter_session,d.sessions,'id','session_name',true,'(All Session)',0);
                mThis.elFilter_term.val(d.term && d.terms[0].id).trigger('change');
                onFinish();
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
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let StudentGroupDialog = new function(){
    let mThis = this;
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

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/student-group/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose();
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
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    mThis.elCampus.change('change',function(e){
        e.preventDefault();
       mThis.setGroupName();
    });

    mThis.elProgram.on('change',function(e){
        e.preventDefault();
        vsapi.call(`${main_view.base_url}/api/settings/options-level`,{'program_id':mThis.elProgram.val()},null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = StringSanitizer.sanitizeObject(res.data,null,null);
            }
            VSUtil.setComboItems(mThis.elLevel,d,'id','level_name',null,null,null);
        });
    });

    mThis.elAcademicYear.on('change',function(e){
        e.preventDefault();
        vsapi.call(`${main_view.base_url}/api/settings/options-term`,{'academic_year':mThis.elAcademicYear.val()},null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = StringSanitizer.sanitizeObject(res.data,null,null);
            }
            VSUtil.setComboItems(mThis.elTerm,d,'id','term_name',null,null,null);
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
 
    this.prepareFormOption = (group_id,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/student-group/form-options`,{'id': group_id},null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = StringSanitizer.sanitizeObject(res.data,null,['academic_year']);
            }
            VSUtil.setComboItems(mThis.elCampus,d.campuses,'shortcut','campus_name',null,null,null);
            VSUtil.setComboItems(mThis.elAcademicYear,d.academic_years,'academic_year','academic_year',null,null,null);
            VSUtil.setComboItems(mThis.elProgram,d.programs,'id','program_name',null,null,null);
            VSUtil.setComboItems(mThis.elSession,d.sessions,'shortcut','session_name',null,null,null);
            if(typeof onFinish === 'function') onFinish(d);
        });
    }

    this.setGroupName = ()=>{
        let c = mThis.elCampus.val();
        let l = mThis.elLevel.find('option:selected').text();
        l = StringSanitizer.sanitizeOut(l);
        l = (l+'').replace(/\s/g,'',l);
        let s = mThis.elSession.val();
        let term_id = mThis.elTerm.val();
        let g_name = [term_id,'.',c,'.',l,'.',s,'#'].join('');
        mThis.elGroupName.val(g_name);
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(options.id,(d) => {
            if(d.student_group){
                mThis.elTitle.text(LocaleManager.trans('Modify Student Group','titles'));
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New Student Group','titles'));
            }
            mThis.setFormData(d.student_group);
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentGroupComponent.init();
});
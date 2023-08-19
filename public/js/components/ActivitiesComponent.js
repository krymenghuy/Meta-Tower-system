"use strict";
var ActivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_activitiesComponent');

    this.panelActivities = mThis.self.find('#div_att_hasList');
    this.tblActivities = mThis.panelActivities.find('#div_att_list');
    this.containerFilter = mThis.self.find('#_att_elFilter');
    this.elRequest = mThis.panelActivities.find('#_att_elRequest');
    this.btnNew = mThis.panelActivities.find('#_att_btn_new');
    this.btnSendRequest = mThis.panelActivities.find('#att_send_request');

    this.cols = [{
        title: 'Check',
        className: 'position-relative text-center',
        data: () => {
            return [`<input type="checkbox" class="form-check-input"/>`].join('');
        }
    },
    {
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "School",
        data: "school"
    },
    {
        title: "Student ID",
        data: "student_code"
    },
    {
        title: "Full Name",
        data: "student_name"
    },
    {
        title: "Full Name (KH)",
        data: "name_kh"
    },
    {
        title: "Sex",
        data: "sex"
    },
    {
        title: "Date of Birth",
        data: "date_of_birth"
    },
    {
        title: "Admission Date",
        data: "admission_date"
    },
    {
        title: "Session",
        data: "session"
    },
    {
        title: "Class",
        data: "level"
    },
    {
        title: "Family ID",
        data: "family_id"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            return [`<span class="p-2 bg-warning text-white rounded-3 text-capitalize">${data.status}</span>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2 ${data.status === 'pending' ? '':'d-none'}">
                <a href="javascript:void(0)" class="btn-att-send" data-requestid="${data.request_id}">
                    <i class="fa-regular fa-paper-plane text-success fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-att-delete" data-requestid="${data.request_id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('div_att_list',{
            'fetchApi':`${main_view.base_url}/api/activity/request-change/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
                tr.setAttribute('data-requestid',data.request_id);
            },
            'beforeRender':()=>{}
        });
        mThis.tblActivities = $(mThis.itemView.getTable());

        mThis.tblActivities.on('click','a.btn-att-send',function(e){
            e.preventDefault();
            let op = {
                'request_info': [
                    {
                        'request_id': $(this).data('requestid')
                    }
                ]
            }
            window.vsapi.call(`${main_view.base_url}/api/activity/send-request-change`,op,null).then(res => {
                if(res.status_code === 200){
                    mThis.itemView.showPage(null);
                    cv_interact.success('Request has been seen!');
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        });

        mThis.tblActivities.on('click','a.btn-att-delete',function(e){
            e.preventDefault();
            let op = {
                'request_id': $(this).data('requestid')
            };
            cv_interact.confirm('Delete this request?',{title: 'Delete Request', context: 'delete'},(e) => {
                if(e){
                    window.vsapi.call(`${main_view.base_url}/api/activity/request-change/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                    });
                }
            });
        });

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            RequestDialog.show(op);
        });

        mThis.btnSendRequest.on('click',function(e){
            e.preventDefault();
            mThis.getRequestID(mThis.tblActivities);
        });
    }

    this.getRequestID = (tbl) => {
        let p = {
            'request_info': []
        };
        tbl.find('input[type="checkbox"]:checked').each(function(){
            let tr = $(this).closest('tr');
            let obj = {};
            obj['request_id'] = tr.data('requestid');
            p.request_info.push(obj);
        });
        window.vsapi.call(`${main_view.base_url}/api/activity/send-request-change`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.itemView.showPage(null);
                cv_interact.success('Request has been seen!');
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    }

    this.prepareOptions = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/form-option`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.containerFilter.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'academic_year':
                        VSUtil.setComboItems(el,d.academic_year,'academic_year','academic_year',null,null,null);
                        break;
                    case 'campus_id':
                        VSUtil.setComboItems(el,d.campuses,'id','campus',null,null,null);
                        break;
                    case 'level_id':
                        VSUtil.setComboItems(el,d.levels,'id','level',null,null,null);
                        break;
                    case 'session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                        break;
                    default:
                        break;
                }
            });
            mThis.prepareRequest();
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.prepareRequest = () => {
        window.vsapi.call(`${main_view.base_url}/api/option/request-type`,null,null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elRequest,d,'id','name',null,null,null);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareOptions(() => {
            mThis.itemView.showPage(null,null,() => {
                main_view.setTitle(mThis.title_prop);
                let x = mThis.self.siblings(':visible');
                x.fadeOut('fast',function(){
                    mThis.self.hide().fadeIn(300);
                });
            });
        });
    }
}

let RequestDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_att_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_att_btn_save');

    this.data = null;

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        mThis.validate.validator(() => {
            let p = mThis.getDataForm();
            window.vsapi.call(`${main_view.base_url}/api/activity/create-request-change`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
                }
            });
        });
    });

    this.prepareFormOption = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/option/request-type-dialog`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.addOptionToElement(d);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.addOptionToElement = (d, second_call=false) => {
        d = d ? d : {};
        let option = '';
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            switch(f){
                case 'student_id':
                    second_call ? false : ((option, d && d.student_list_options.map(op => {
                        option = [option,`<option value="${op.student_id}">${op.student_name} (${op.student_code})</option>`].join('');
                    }),option = [`<option selected></option>`,option].join(''),el.html(option)),
                    mThis.getStudentEnrollment(el, d));
                    break;
                case 'request_type_id':
                    second_call ? false : (VSUtil.setComboItems(el,d.request_type_options,'id','name',null,null,null),
                    mThis.getField(el, d));
                    break;
                case 'to_level_id':
                    VSUtil.setComboItems(el,d.level_options,'id','level',null,null,null);
                    break;
                case 'from_level_id':
                    VSUtil.setComboItems(el,d.level_options,'id','level',null,null,null);
                    if(mThis.data && mThis.options.std_id)
                        el.val(mThis.data['level_id']).trigger('change');
                    break;
                case 'to_campus_id':
                    VSUtil.setComboItems(el,d.campus_options,'id','campus',null,null,null);
                    break;
                case 'from_campus_id':
                    VSUtil.setComboItems(el,d.campus_options,'id','campus',null,null,null);
                    if(mThis.data && mThis.options.std_id)
                        el.val(mThis.data['campus_id']).trigger('change');
                    break;
                case 'to_session_id':
                    VSUtil.setComboItems(el,d.sessions_options,'id','name',null,null,null);
                    break;
                case 'from_session_id':
                    VSUtil.setComboItems(el,d.sessions_options,'id','name',null,null,null);
                    if(mThis.data && mThis.options.std_id)
                        el.val(mThis.data['session_id']).trigger('change');
                    break;
                default:
                    break;
            }
        });
    }

    this.getStudentEnrollment = (el, data) => {
        let elAfter = null, elNext = el.closest('.form-group');
        el.on('change',function(e){
            e.preventDefault();
            let id = $(this).val();

            if(id){
                let html = null, inner_html = null;
                window.vsapi.call(`${main_view.base_url}/api/option/student-enrollment`,{'student_id': id},null,false).then(res => {
                    let d = [];
                    if(res.status_code === 200){
                        d = res.data;
                    }
                    html = [`<div class="enroll form-group">
                        <label for="enrollment_id" class="form-label">Enrollment</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input enroll-select" data-field="enrollment_id">
                                ${inner_html=null,d & d.map(enroll => {
                                    inner_html = [inner_html,`<option value="${enroll.enrollment_id}">${enroll.level}</option>`].join('');
                                }),inner_html=[inner_html,`<option selected></option>`]}
                            </select>
                        </div>
                    </div>`].join('');
                    let parent = elNext.parent();
                    if(elAfter)
                        elAfter.remove();
                    elNext.after(html);
                    elAfter = parent.find('.enroll');
                    parent.find('select.modal-select2').select2();
                    mThis.getStudentInfo(parent.find('select.enroll-select'));
                });
            }
            else{
                if(elAfter)
                    elAfter.remove();
            }
            mThis.addOptionToElement(data,true);
        });
    }

    this.getStudentInfo = (el) => {
        el.on('change',function(e){
            e.preventDefault();
            let op = {
                'enrollment_id': $(this).val()
            };
            mThis.options.std_id = op.enrollment_id;

            if((op.enrollment_id != '') && (op.enrollment_id > 0)){
                window.vsapi.call(`${main_view.base_url}/api/option/student-request-info`,op,null,false).then(res => {
                    let d = {};
                    if(res.status_code === 200){
                        d = res.data;
                        mThis.data = d;
                    }

                    let field = null;
                    let input = el.closest('.form-group').nextUntil('.stop')[1];
                    if(input)
                        field = $(input).children().find('select.data-input');
                    if(field){
                        let f = field.data('field').substr(5);
                        field.val(d[f]).trigger('change');
                    }
                });
            }
            else{
                mThis.data = {};
            }
        });
    }

    this.getField = (el,data) => {
        data = data ? data : {};
        let html = null;

        el.off('change').on('change',function(e){
            e.preventDefault();
            window.vsapi.call(`${main_view.base_url}/api/option/request-type-input`,{'request_type_id': $(this).val()},null,false).then(res => {
                let d = {};
                if(res.status_code === 200){
                    d = res.data;
                }
                let div = el.closest('.form-group');

                if(d){
                    html = [`<div class="form-group">
                        <label for="${d.from}" class="form-label">From ${d.label}</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="${d.from}"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="${d.to}" class="form-label">To ${d.label}</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="${d.to}"></select>
                        </div>
                    </div>`].join('');

                    if(div.nextUntil('div.stop').length > 0)
                        div.nextUntil('div.stop').remove();
                    $(html).insertAfter(div);
                    div.parent().find('select.modal-select2').select2();
                    if(mThis.data){
                        let field = div.next().find('select.data-input');
                        let f = field.data('field').substr(5);
                        field.val(mThis.data[f]).trigger('change');
                    }
                }
                else{
                    if(div.nextUntil('div.stop').length > 0)
                        div.nextUntil('div.stop').remove();
                }
                mThis.addOptionToElement(data,true);
            });
        });
    }

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

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.validate.resetForm();
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.validate = new FormValidator(mThis.self,{
        className: 'data-input'
    });

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            mThis.elTitle.text(LocaleManager.trans('New Request','titles'));
            mThis.setDataForm(null);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ActivitiesComponent.init();
});
"use strict";
var AactivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_aActivitiesComponent');

    this.containerFilter = mThis.self.find('#container_aavt_filter');

    this.data_request = [];

    this.cols = [{
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "Student ID",
        data: "student_code"
    },
    {
        title: "Full Name",
        className: 'Full-Name text-capitalize',
        data: "student_name"
    },
    {
        title: "Full Name (KH)",
        className: 'text-capitalize',
        data: "name_kh"
    },
    {
        title: "Sex",
        data: (data, a, b) => {
            let sex = data.sex === 'M' ? 'Male':'Female';
            return sex;
        }
    },
    {
        title: "Date of Birth",
        data: (data, a, b) => {
            let dob = data.date_of_birth ? data.date_of_birth : '';
            return new Date(dob).toLocaleDateString('km-KH',{
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Approved By",
        data: (data, a, b) => {
            let auth_user = data.auth_user ? data.auth_user : '', date = data.auth_date ? data.auth_date : '';
            return [`<p class="pb-0 mb-1">${auth_user}</p>
            <small>${date}</small>`].join('');
        }
    },
    {
        title: "Cancelled By",
        data: (data, a, b) => {
            let reject_by = data.reject_by ? data.reject_by : '', date = data.reject_date ? data.reject_date : '';
            return [`<p class="pb-0 mb-1">${reject_by}</p>
            <small>${date}</small>`].join('');
        }
    },
    {
        title: "Admission Date",
        data: (data, a, b) => {
            let admission_date = data.admission_date ? data.admission_date : '';
            return new Date(admission_date).toLocaleDateString('km-KH',{
                day: 'numeric',
                month:'short',
                year: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "School",
        data: "school"
    },
    {
        title: "Status",
        data: (data, a, b) => {
            let cls = data.status === 'pending' ? 'bg-warning' : data.status === 'approved' ? 'bg-success' : 'bg-info';
            return [`<span class="p-2 ${cls} text-white rounded-3 text-capitalize">${data.status}</span>`].join('');
        }
    },
    {
        title: "Action",
        data: (data, a, b) => {
            let cls = data.status === 'pending' ? '' : data.status === 'rejected' ? '' : 'd-none';
            let rejected_cls = data.status === 'rejected' ? 'd-none' : '';
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-aavt-approval ${cls}" data-requestid="${data.request_id}" data-studentid="${data.student_id}" data-request_typeid="${data.request_type_id}" data-requestname="${data.request_name}" data-from="${data.request_change.from_id}" data-to="${data.request_change.to_id}">
                    <i class="fa-regular fa-circle-check fs-5 text-success"></i>
                </a>
                <a href="javascript:void(0)" class="btn-aavt-reject ${rejected_cls} ${cls}" data-requestid="${data.request_id}">
                    <i class="fa-regular fa-circle-xmark text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-aavt-delete ${cls}" data-requestid="${data.request_id}">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl__aavt',{
            'fetchApi':`${main_view.base_url}/api/approval/request-change-list`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-studentid',data.student_id);
                tr.setAttribute('data-request_typeid',data.request_type_id);
                tr.setAttribute('data-requestid',data.request_id);
                let op = {
                    'student_id': data.student_id,
                    'request_type_id' : data.request_type_id,
                    'request_id': data.request_id,
                    'request_change': data.request_change
                };
                mThis.data_request.push(op);
            },
            'beforeRender':()=>{}
        });
        mThis.tblActivaties = $(mThis.itemView.getTable());

        mThis.tblActivaties.on('click','a.btn-aavt-approval',function(e){
            e.preventDefault();
            let op = {
                'student_id': $(this).data('studentid'),
                'request_id': $(this).data('requestid'),
                'request_type_id': $(this).data('request_typeid'),
                'request_type_name': $(this).data('requestname'),
                'from_id': $(this).data('from'),
                'to_id': $(this).data('to'),
                'student_name': $(this).closest('tr').find('.Full-Name').text(),
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            ApprovalDialog.show(op);
        });

        mThis.tblActivaties.on('click','a.btn-aavt-reject',function(e){
            e.preventDefault();
            let op = {
                'request_id': $(this).data('requestid')
            };
            Swal.fire({
                input: 'textarea',
                inputLabel: 'Why You Reject This Request?',
                inputPlaceholder: 'Type your reasons here...',
                inputAttributes: {
                    'aria-label': 'Type your reasons here'
                },
                showCancelButton: true,
                inputValidator: (value) => {
                    if(!value){
                        return 'You need to write something!'
                    }
                    else{
                        op.remark = value;
                        vsapi.call(`${main_view.base_url}/api/approval/reject-request-change`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.itemView.showPage(null);
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                }
            });
        });

        mThis.tblActivaties.on('click','a.btn-aavt-delete',function(e){
            e.preventDefault();
            let op = {
                'request_id': $(this).data('requestid')
            };
            cv_interact.confirm('Delete this request?',{title: 'Delete Request', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/activity/request-change/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                        }
                    });
                }
            });
        });

        mThis.cfg = new ExpandableRowConfig('tbl__aavt_table', {
            'dontExpandByClickingOn': ['btn-aavt-approval', 'btn-aavt-reject','btn-aavt-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let op = {
                    'student_id': qtr.data('studentid'),
                    'request_type_id': qtr.data('request_typeid'),
                    'request_id': qtr.data('requestid')
                };
                if((op.student_id > 0) && (op.request_type_id > 0))
                    mThis.displayApprovalActivityDetails(detail_tr,op);
            }
        });
    }

    this.prepareOption = (onFinish = null) => {
        let div = mThis.containerFilter;
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null,false).then(res => {
            if(res.status_code === 200){
                let d = res.data;
                if(d && !($.isEmptyObject(d))){
                    div.find('.data-input').each(function(){
                        let el = $(this);
                        let f = el.data('field');
                        switch(f){
                            case 'discount_type':
                                VSUtil.setComboItems(el,d.discount_type,'id','name',null,null,null);
                                break;
                            case 'academic_year':
                                VSUtil.setComboItems(el,d.academic_year,'academic_year','academic_year',null,null,null);
                                break;
                            default:
                                break;
                        }
                    });
                }
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.displayApprovalActivityDetails = (tr, op) => {
        let div_wrapper = $(tr).find('.expandable-row-container');

        let html = null, inner_html = null, cur_symbol = '$';
        div_wrapper.empty();

        let request_change = mThis.data_request.filter((d) => {
            if((d.student_id == op.student_id) && (d.request_type_id == op.request_type_id) && (d.request_id == op.request_id)){
                return d;
            }
        });

        request_change = request_change[0].request_change;
        ['from_id','to_id','request_type_id'].map(obj => {
            delete(request_change[obj]);
        });

        vsapi.call(`${main_view.base_url}/api/activity/preview-request-payment`,op,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            if(d && !($.isEmptyObject(d))){
                html = [`<div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="bg-light h-100 rounded-3">
                            <div class="rounded-top-3 bg-warning-subtle p-2">Payment Preview</div>
                            <div class="row row-cols-2 gy-2 p-3">
                                <div class="col-md-6">
                                    <p>
                                        <span>Old Days Fee</span>
                                        <span>:</span>
                                        <span>${cur_symbol} ${d.old_days_fee}</span>
                                    </p>
                                    <p>
                                        <span>Fee Left</span>
                                        <span>:</span>
                                        <span>${cur_symbol} ${d.fee_left}</span>
                                    </p>
                                    <p>
                                        <span>New Level</span>
                                        <span>:</span>
                                        <span>${cur_symbol} ${d.new_level}</span>
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        <span>Surcharge</span>
                                        <span>:</span>
                                        <span>${cur_symbol} ${d.surcharge}</span>
                                    </p>
                                    <p>
                                        <span>Return Fee</span>
                                        <span>:</span>
                                        <span>${cur_symbol} ${d.return_fee}</span>
                                    </p>
                                    <p>
                                        <span>Academic Year</span>
                                        <span>:</span>
                                        <span>${d.academic_year}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="bg-light h-100 rounded-3">
                            <div class="rounded-top-3 bg-danger-subtle p-2">Request Change Preview</div>
                            <div class="row row-cols-2 gy-2 p-3">
                                ${inner_html,Object.keys(request_change).map(key => {
                                    inner_html = [inner_html,`<div class="col-md-6 mb-1">
                                        <span class="text-capitalize">${key.replace('_',' ')}</span>
                                        <span>:</span>
                                        <span>${request_change[`${key}`]}</span>
                                    </div>`].join('');
                                }),inner_html}
                            </div>
                        </div>
                    </div>
                </div>`].join('');
                div_wrapper.html(html).addClass(['p-3','rounded-3']);
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            mThis.prepareOption(() => {
                main_view.setTitle(mThis.title_prop);
                let x = mThis.self.siblings(':visible');
                x.hide(0,function(){
                    mThis.self.hide().fadeIn(300);
                });
            });
        });
    }
}

let ApprovalDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_aact_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.elBody = mThis.self.find('#modal_body');
    this.btnSave = mThis.self.find('#dlg_aact_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let op = {
            'approve_info': [
                {
                    'request_id': mThis.options.request_id
                }
            ]
        };
        vsapi.call(`${main_view.base_url}/api/approval/approve-request-change`,op,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                cv_interact.success('Approved Successfully!');
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.renderBody = (d,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/option/request-type-input`,{'request_type_id': d.request_type_id},null,false).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            let html = [`<div class="row gy-2">
                <div class="col-lg-6">
                    <div class="form-group">
                        <label for="student_id" class="form-label">Student Name</label>
                        <input type="text" class="form-control" value="${d.student_name}" readonly/>
                    </div>
                    <div class="form-group">
                        <label for="student_id" class="form-label">Request Type</label>
                        <input type="text" class="form-control" value="${d.request_type_name}" readonly/>
                    </div>
                    <div class="form-group">
                        <label for="${data.from}" class="form-label">From ${data.label}</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="${data.from}" disabled></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="${data.to}" class="form-label">To ${data.label}</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="${data.to}"></select>
                        </div>
                    </div>
                </div>
                <div id="pre_price" class="col-lg-6 d-flex align-items-center"></div>
            </div>`].join('');
            mThis.elBody.html(html);
            mThis.elBody.find('select.modal-select2').select2({
                tag: 'true'
            });
            mThis.setOption(mThis.elBody, d, mThis.elBody.find('#pre_price'));
        });
        if(typeof onFinish === 'function') onFinish();
    }

    this.setOption = (body, data, div) => {
        vsapi.call(`${main_view.base_url}/api/option/request-type-dialog`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            body.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'from_level_id':
                        VSUtil.setComboItems(el,d.level_options,'id','level',null,null,data.from_id);
                        break;
                    case 'to_level_id':
                        VSUtil.setComboItems(el,d.level_options,'id','level',null,null,data.to_id);
                        mThis.getDataPreview(el,data,div);
                        break;
                    case 'from_session_id':
                        VSUtil.setComboItems(el,d.sessions_options,'id','name',null,null,data.from_id);
                        break;
                    case 'to_session_id':
                        VSUtil.setComboItems(el,d.sessions_options,'id','name',null,null,data.to_id);
                        mThis.getDataPreview(el,data,div);
                        break;
                    case 'from_campus_id':
                        VSUtil.setComboItems(el,d.campus_options,'id','campus',null,null,data.from_id);
                        break;
                    case 'to_campus_id':
                        VSUtil.setComboItems(el,d.campus_options,'id','campus',null,null,data.to_id);
                        mThis.getDataPreview(el,data,div);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    this.getDataPreview = (el,d,div) => {
        let html = null, inner_html = null;
        el.on('change',function(e){
            e.preventDefault();
            let op = {
                'student_id': d.student_id,
                'request_type_id': d.request_type_id
            }
            op[$(this).data('field')] = $(this).val();

            vsapi.call(`${main_view.base_url}/api/activity/preview-request-payment`,op,null,null,false).then(res => {
                let data = {};
                if(res.status_code === 200){
                    data = res.data;
                }
                if(data){
                    html = [`<div class="row gy-2 w-100 h-100">
                        <div class="border rounded-3 p-3">
                            ${inner_html=null, Object.keys(data).map(key => {
                                inner_html = [inner_html,`<div class="col-md-12 mb-3">
                                    <span class="text-capitalize text-primary">${key.replaceAll('_',' ')}</span>
                                    <span>:</span>
                                    <span>${key === 'academic_year' ? '':'$'} ${data[key]}</span>
                                </div>`].join('');
                            }),inner_html ? inner_html : ''}
                        </div>
                    </div>`].join('');
                    div.html(html);
                }
                else{
                    div.empty();
                }
            });
        });

        if(div.children().length === 0)
            el.trigger('change');
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.renderBody(options, () => {
            mThis.elTitle.text(LocaleManager.trans('Apply Approval','titles'));
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    AactivitiesComponent.init();
});
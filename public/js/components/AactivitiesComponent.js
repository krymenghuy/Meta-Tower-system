"use strict";
var AactivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_aActivitiesComponent');

    this.data_request = [];

    this.cols = [{
        title: "Check",
        className: "position-relative text-center",
        data: () => {
            return [` <input class="form-check-input" type="checkbox"/>`].join('');
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
        title: "Approved By",
        data: "auth_user"
    },
    {
        title: "Cancelled By",
        data: "reject_by"
    },
    {
        title: "Date",
        data: "date"
    },
    {
        title: "Admission Date",
        data: "admission_date"
    },
    {
        title: "School",
        data: "school"
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
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-aavt-approval" data-studentid="${data.student_id}" data-request_typeid="${data.request_type_id}" data-requestname="${data.request_name}">
                    <i class="fa-regular fa-circle-check fs-5 text-success"></i>
                </a>
                <a href="javascript:void(0)" class="btn-aavt-reject" data-studentid="${data.student_id}" data-request_typeid="${data.request_type_id}">
                    <i class="fa-regular fa-circle-xmark text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-aavt-delete" data-studentid="${data.student_id}" data-request_typeid="${data.request_type_id}">
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
                'request_type_id': $(this).data('request_typeid'),
                'request_type_name': $(this).data('requestname'),
                'student_name': $(this).closest('tr').find('.Full-Name').text()
            };
            ApprovalDialog.show(op);
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

    this.displayApprovalActivityDetails = (tr, op) => {
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.addClass(['p-3','rounded-3']);

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

        window.vsapi.call(`${main_view.base_url}/api/activity/preview-request-payment`,op,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
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
            div_wrapper.html(html);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let ApprovalDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_aact_');

    this.elTitle = mThis.self.find('.modal-title');
    this.elBody = mThis.self.find('#modal_body');

    this.renderBody = (d,onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/option/request-type-input`,{'request_type_id': d.request_type_id},null,false).then(res => {
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
                            <select class="modal-select2 data-input" data-field="${data.from}"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="${data.to}" class="form-label">To ${data.label}</label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="${data.to}"></select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6"></div>
            </div>`].join('');
            mThis.elBody.html(html);
            mThis.elBody.find('select.modal-select2').select2({
                tag: 'true'
            });
            mThis.setOption(mThis.elBody);
        });
        if(typeof onFinish === 'function') onFinish();
    }

    this.setOption = (body) => {
        window.vsapi.call(`${main_view.base_url}/api/option/request-type-dialog`,null,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            body.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                switch(f){
                    case 'from_level_id':
                        VSUtil.setComboItems(el,d.level_options,'id','level',null,null,null);
                        break;
                    case 'to_level_id':
                        VSUtil.setComboItems(el,d.level_options,'id','level',null,null,null);
                        break;
                    case 'from_session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                        break;
                    case 'to_session_id':
                        VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    this.show = (options) => {
        if(!options) options = {};

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
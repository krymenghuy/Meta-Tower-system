"use strict";
var StudentAttendanceComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance";
    this.self = $('#_main_studentAttendanceComponent');

    this.elSearch = mThis.self.find('#el_san_search');

    this.cols = [{
        title: "Student ID",
        data: "code"
    },
    {
        title: "Full Name",
        className: 'text-capitalize',
        data: "name"
    },
    {
        title: "Full Name (KH)",
        className: 'text-capitalize',
        data: "name_kh"
    },
    {
        title: "Age",
        data: "age"
    },
    {
        title: "Date of Birth",
        data: (data, a, b) => {
            let dob = data.dob ? data.dob : '';
            return new Date(dob).toLocaleDateString('km-KH',{
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).replaceAll(' ','-');
        }
    },
    {
        title: "Sex",
        data: (data, a, b) => {
            let sex = data.sex === 'M' ? 'Male' : 'Female';
            return sex;
        }
    },
    {
        title: "Family ID",
        data: "family_id"
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl--san',{
            'fetchApi':`${main_view.base_url}/api/student/attendance-list`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });
        
        mThis.tblStudent = $(mThis.itemView.getTable());
        new SearchData(mThis.elSearch, mThis.tblStudent);

        mThis.cfg = new ExpandableRowConfig('tbl--san_table',{
            'dontExpandByClickingOn': [],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let op = {
                    'student_id': qtr.data('id')
                };
                if(op.student_id > 0)
                    mThis.displayStudentAttendanceDetails(detail_tr, op);
            }
        });
    }

    this.displayStudentAttendanceDetails = (tr, op) => {
        let div_wrapper = $(tr).find('.expandable-row-container');

        vsapi.call(`${main_view.base_url}/api/student/attendance-details`,op,null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.renderAttendance(div_wrapper, d, op);
        });
    }

    this.renderAttendance = (div_wrapper, d, op) => {
        div_wrapper.addClass('bg-light-subtle');
        div_wrapper.empty();
        let html = null, first = 0;

        d && d.map(t => {
            let inner_html=null;
            t && t.attendance_list.map(dt => {
                let cls = dt.status === 'P' ? 'bg-success-subtle text-success' : dt.status === 'Pr' ? 'bg-info-subtle text-primary' : dt.status === 'A' ? 'bg-danger-subtle text-danger' : dt.status === 'Sun' ? 'text-danger-emphasis bg-secondary-subtle' : dt.status === 'Sat' ? 'text-warning-emphasis bg-secondary-subtle' : 'bg-secondary-subtle';

                inner_html = [inner_html,`<div class="d-block">
                    <div class="px-3 py-2 text-center" style="width: ${(div_wrapper.width())/32}">${dt.day ? dt.day : ''}</div>
                    <div class="tooltip-custom position-relative px-3 py-2 text-center rounded-3 ${cls}" data-id="${dt.attendance_id}" data-status="${dt.status_id}" data-day="${[dt.day,t.date].join('-')}" data-groupid="${t.group_id}" style="width: ${(div_wrapper.width())/32}" role="button" data-details="${JSON.stringify(dt).replaceAll('\"','\'')}">${dt.status}</div>
                </div>`].join('');
            });
            
            html = [html,`<div class="${first == 0 ? '' : 'mt-3'}"><p>${t.date} ( ${t.group_name} )</p>`,'<div class="d-flex gap-2 flex-nowrap mt-3">',inner_html,`</div>
                <div class="d-flex gap-3 w-100 justify-content-end pt-3">
                    <p class="m-0">
                        <span class="pe-4">Present:</span>
                        <span class="text-success">${t.status ? t.status.present : ''}</span>
                    </p>
                    <p class="m-0">
                        <span class="pe-4">Permission:</span>
                        <span class="text-info">${t.status ? t.status.permission : ''}</span>
                    </p>
                    <p class="m-0">
                        <span class="pe-4">Absent:</span>
                        <span class="text-danger">${t.status ? t.status.absent : ''}</span>
                    </p>
                </div>
            </div>`].join('');
            first = 1;
        });

        div_wrapper.html(['<div class="position-absolute p-3">',html,'</div>'].join(''));
        if(d.length > 0)
            div_wrapper.addClass(['p-3','max-height-details']);
        let div = div_wrapper.find('.tooltip-custom');

        div.each(function(){
            let details = $(this).data('details');
            details = details.replaceAll("\'","\"");
            details = JSON.parse(details);

            $(this).popover({
                html: true,
                trigger : 'hover',
                title: ["<span>Attendance Details</span>"].join(''),
                content: [`<p>
                    <span class="text-info">Check In Remarks</span>
                    <span>:</span></br>
                    <span>${details.check_in_remarks ? details.check_in_remarks : ''}</span>
                </p>
                <p>
                    <span class="text-info">Check Out Remarks</span>
                    <span>:</span></br>
                    <span>${details.check_out_remarks ? details.check_out_remarks : ''}</span>
                </p>`].join('')
            });
        });

        div.on('click',function(e){
            e.preventDefault();
            let p = {
                'id': $(this).data('id'),
                'group_id': $(this).data('groupid'),
                'student_id': op.student_id,
                'date': $(this).data('day'),
                'status_id': $(this).data('status'),
                'onClose': (d) => {
                    mThis.renderAttendance(div_wrapper, d, op);
                }
            };
            if(p.status_id != 4)
                StudentAttendanceDialog.show(p);
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

let StudentAttendanceDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_san_');
    this.options = {};

    this.btnSave = mThis.self.find('#dlg_san_btn_save');
    this.elStatus = mThis.self.find('#dlg_el_status');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let op = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/student/attendance-save`,op,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose(res.data);
                cv_interact.success('Updated Attedance Successfully!');
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.loadFormDetails = (op) => {
        let p = {
            'id': op.id,
            'student_id': op.student_id,
            'date': op.date,
            'group_id': op.group_id
        };
        vsapi.call(`${main_view.base_url}/api/student/attendance-date-details`,p,null,false).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
                d.extend = op;
            }
            mThis.setDataForm(d);
        });
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.handleData(d);

        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f]).trigger('change');
            else
                el.val(d[f]);
        });
    }

    this.handleData = (d) => {
        d = d ? d : {};
        mThis.options.student_id = d.student_id ? d.student_id : mThis.options.student_id;
        mThis.options.id = d.id ? d.id : d.extend.id;

        d.session_date = d.session_date ? d.session_date : d.extend.date;
        d.status_id = d.status_id ? d.status_id : d.extend.status_id;

        ['checkin_time','checkout_time'].map(key => {
            d[key] = d[key].split(' ')[1] ? d[key].split(' ')[1] : d[key];
        });
        delete(d.extend);
    }

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id,
            'student_id': mThis.options.student_id
        };
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.prepareFormOption = (op, onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/student/options-attendance-types`,null,null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elStatus,d,'id','name',null,null,null);
            mThis.loadFormDetails(op);
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(options, () => {
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceComponent.init();
});
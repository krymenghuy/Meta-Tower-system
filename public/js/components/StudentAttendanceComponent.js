"use strict";
var StudentAttendanceComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance";
    this.self = $('#_main_studentAttendanceComponent');

    this.cols = [{
        title: "Student ID",
        data: "code"
    },
    {
        title: "Full Name",
        data: "name"
    },
    {
        title: "Full Name (KH)",
        data: "name_kh"
    },
    {
        title: "Age",
        data: "age"
    },
    {
        title: "Date of Birth",
        data: "dob"
    },
    {
        title: "Sex",
        data: "sex"
    },
    {
        title: "Group",
        data: "group_name"
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
        div_wrapper.addClass(['p-3','bg-light-subtle']);
        div_wrapper.empty();
        let html = null, inner_html = null;

        window.vsapi.call(`${main_view.base_url}/api/student/attendance-details`,op,null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }

            d && d.map(t => {
                t && t.attendance_list.map(dt => {
                    let cls = dt.status === 'P' ? 'bg-success-subtle text-success' : dt.status === 'Pr' ? 'bg-info-subtle text-primary' : dt.status === 'A' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle';

                    inner_html = [inner_html,`<div class="d-block">
                        <div class="px-3 py-2 text-center" style="width: ${(div_wrapper.width())/32}">${dt.day ? dt.day : ''}</div>
                        <div class="px-3 py-2 rounded-3 ${cls}" style="width: ${(div_wrapper.width())/32}">${dt.status}</div>
                    </div>`].join('');
                });
                
                html = [html,`<p>${t.date}</p>`,'<div class="d-flex gap-2 flex-nowrap mt-3">',inner_html,'</div>'].join('');
            });
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

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceComponent.init();
});
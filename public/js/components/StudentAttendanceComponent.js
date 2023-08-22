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
        title: "Session",
        data: "session"
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
                    'id': qtr.data('id')
                };
                if(op.id > 0)
                    mThis.displayStudentAttendanceDetails(detail_tr, op);
            }
        });
    }

    this.displayStudentAttendanceDetails = (tr, op) => {
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.addClass(['p-3']);
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
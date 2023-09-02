"use strict";
var StudentAttendanceReportComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance Report";
    this.self = $('#_main_studentAttendanceReportComponent');

    this.cols = [{
        title: "Photo",
        data: (data, a, b) => {
            let image = [`<img class="image-student-tbl" src="${data.image_url ? data.image_url : ''}" alt=""/>`].join('');
            return image;
        }
    },
    {
        title: "Student ID",
        data: "code"
    },
    {
        title: "Student Name",
        data: "name"
    },
    {
        title: "Gender",
        data: (data, a, b) => {
            let sex = data.sex === 'M' ? 'Male' : 'Female';
            return sex;
        }
    },
    {
        title: "Class",
        data: "level"
    },
    {
        title: "Session",
        data: "session"
    },
    {
        title: "Date",
        data: (data, a, b) => {
            let session_date = data.session_date ? data.session_date : '';
            return new Date(session_date).toLocaleDateString('km-KH',{
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Check-In",
        data: (data, a, b) => {
            let checkIn = data.checkin_time ? data.checkin_time : '';
            return new Date(`1970-01-01T${checkIn}Z`).toLocaleTimeString('en-US',{
                timeZone: 'UTC',
                hour12: true,
                hour:'numeric',
                minute: 'numeric'
            });
        }
    },
    {
        title: "Come Late",
        data: (data, a, b) => {
            let comeLate = data.in_remarks ? data.in_remarks : '';
            comeLate = comeLate.replace(/^\D+/g, '');
            return comeLate;
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl_astr_',{
            'fetchApi':`${main_view.base_url}/api/student/attendance-list-report`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-id',data.id);
            },
            'beforeRender':() => {}
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceReportComponent.init();
});
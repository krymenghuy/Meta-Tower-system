"use strict";
var StudentAttendanceReportComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance Report";
    this.self = $('#_main_studentAttendanceReportComponent');

    this.tblStudentAttendanceReport = mThis.self.find('.tbl--sar');

    this.init = () => {}
    
    this.displayStudentAttendanceReport = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cnt = 1;
            let cols = [{
                title: "No",
                data: (data, a, b) => {
                    return [`<span>${cnt++}</span>`].join('');
                }
            },
            {
                title: "Image",
                data: (data, a, b) => {
                    return [`<img src="${data.image_url}" alt=""/>`].join('');
                }
            },
            {
                title: "Student ID",
                data: "student_id"
            },
            {
                title: "Student Name",
                data: "student_name"
            },
            {
                title: "Sex",
                data: "sex"
            },
            {
                title: "Class",
                data: "class"
            },
            {
                title:"Section",
                data: "section"
            },
            {
                title: "Date",
                data: "date"
            },
            {
                title: "Check-in",
                data: "check_in"
            },
            {
                title: "Come Late",
                data: "come_late"
            },
            {
                title: "School Bus",
                data: "school_bus"
            },
            {
                title: "Pick Up",
                data: "pick_up"
            },
            {
                title: "Check-out",
                data: "check_out"
            },
            {
                title: "Leave Early",
                data: "leave_early"
            },
            {
                title: "Leave Late",
                data: "leave_late"
            },
            {
                title: "Family ID",
                data: "parent_id"
            },
            {
                title: "Father Phone",
                data: "father_phone"
            }];

            if(!mThis.table){
                mThis.tblStudentAttendanceReport.DataTable().clear().destroy();
                mThis.tblStudentAttendanceReport.empty();
                mThis.table = null;
            }

            if(mThis.table){
                mThis.table = mThis.tblStudentAttendanceReport.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayStudentAttendanceReport(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceReportComponent.init();
});
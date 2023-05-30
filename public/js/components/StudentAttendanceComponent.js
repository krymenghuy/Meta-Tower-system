"use strict";
var StudentAttendanceComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance";
    this.self = $('#_main_studentAttendanceComponent');

    this.tblStudentAttendance = mThis.self.find('.tbl--san');

    this.init = () => {}

    this.displayStudentAttendance = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.satinizeObject(res.data);
            }

            let cnt = 1;
            let cols = [{
                title: "No",
                data: (data, a, b) => {
                    return [`<span>${cnt++}</span>`].join('');
                }
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
                title: "Age",
                data: "age"
            },
            {
                title: "DOB",
                data: "date_of_birth"
            },
            {
                title: "Section",
                data: "section"
            },
            {
                title: "Present",
                data: "present"
            },
            {
                title: "Permission",
                data: "permission"
            },
            {
                title: "Absent",
                data: "ansent"
            },
            {
                title: "Date",
                data: "date"
            },
            {
                title: "Family ID",
                data: "parent_id"
            },
            {
                title: "Father Phone",
                data: "father_phone"
            }];

            if(mThis.table){
                mThis.tblStudentAttendance.DataTable().clear().destroy();
                mThis.tblStudentAttendance.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblStudentAttendance.DataTable({
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
        mThis.displayStudentAttendance(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceComponent.init();
});
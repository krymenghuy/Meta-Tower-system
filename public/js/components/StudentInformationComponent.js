"use strict";
var StudentInformationComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Information";
    this.self = $('#_main_studentInformationComponent');

    this.tblStudentInformation = mThis.self.find('.tbl--sin');

    this.init = () => {}

    this.displayStudentInformation = (onFinish = null) => {
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
                    return [`<img src="${data.image_url}" alt=""/>`].join();
                }
            },
            {
                title: "School",
                data: "school"
            },
            {
                title: "Student ID",
                data: "student_id"
            },
            {
                title: "Full Name",
                data: "full_name"
            },
            {
                title: "Full Name (KH)",
                data: "full_name_kh"
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
                title: "Section",
                data: "section"
            },
            {
                title: "Class",
                data: "class"
            },
            {
                title: "Father Name",
                data: "father_name"
            },
            {
                title: "Family ID",
                data: "family_id"
            },
            {
                title: "Father Phone",
                data: "father_phone"
            },
            {
                title: "Action",
                data: (data, a, b) => {
                    return [`<button class="btn btn-danger btn-sm">
                        <span class="trans-text" data-langprop="buttons.Options">Options</span>
                        <i class="fa-solid fa-caret-down ps-2"></i>
                    </button>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblStudentInformation.DataTable().clear().destroy();
                mThis.tblStudentInformation.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblStudentInformation.DataTable({
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
        mThis.displayStudentInformation(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentInformationComponent.init();
});
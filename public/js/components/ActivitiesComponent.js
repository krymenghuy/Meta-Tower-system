"use strict";
var ActivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_activitiesComponent');

    this.panelNoData = mThis.self.find('.div--att-empty');
    this.panelActivities = mThis.self.find('.div--att-hasList');

    this.tblActivities = mThis.panelActivities.find('.div--att-list');

    this.init = () => {}

    this.displayActivitiesList = (onFinish = null) => {
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
                className: 'select-checkbox',
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Checked',
                            value: function(rowData,rowIdx) {}
                        },
                        {
                            label: 'Un-Checked',
                            value: function(rowData, rowIdx) {}
                        }
                    ]
                },
            },
            {
                title: "Image",
                data: (data, a, b) => {
                    return [`<img src="${data.image_url}" alt=""/>`].join('');
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
                data: "adminssio_date"
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
                    return [`<button class="btn btn-danger btn-sm" type="button">
                        <span class="trans-text" data-langprop="buttons.Options">Options</span>
                        <i class="fa-solid fa-caret-down ps-2"></i>
                    </button>`].join('');
                }
            }];

            if(data.length === 0){
                mThis.panelNoData.show().siblings().hide();
            }
            else{
                mThis.panelActivities.show().siblings().hide();
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayActivitiesList(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ActivitiesComponent.init();
});
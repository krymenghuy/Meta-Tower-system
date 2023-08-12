"use strict";
var ActivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_activitiesComponent');

    this.panelActivities = mThis.self.find('#div_att_hasList');
    this.tblActivities = mThis.panelActivities.find('#div_att_list');

    let cnt = 1;
    this.cols = [{
        title: "No",
        data: () => {
            return cnt++;
        }
    },
    {
        title: 'Check',
        className: 'check-input',
        data: () => {
            return [`<input type="checkbox" class="form-check-input"/>`].join('');
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
        title: "School",
        data: "school_name"
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
        title: "Admission Date",
        data: "admission_date"
    },
    {
        title: "Session",
        data: "session"
    },
    {
        title: "Class",
        data: "level"
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
    }];

    this.init = () => {
        mThis.itemView = new ListView('div_att_list',{
            'fetchApi':`${main_view.base_url}/api/activity/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
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
    ActivitiesComponent.init();
});
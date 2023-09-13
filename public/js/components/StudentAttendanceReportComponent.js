"use strict";
var StudentAttendanceReportComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Attendance Report";
    this.self = main_view.appContent.children('#_main_studentAttendanceReportComponent');

    this.containerFilter = mThis.self.find('#container_astr_filter');

    this.cols = [{
        title: "Photo",
        data: (data, a, b) => {
            let image = [`<img class="image-student-tbl" src="${data.image_url ? data.image_url : ''}" alt=""/>`].join('');
            return image;
        }
    },
    {
        title: "Student ID",
        className: 'align-middle',
        data: "code"
    },
    {
        title: "Student Name",
        className: 'align-middle',
        data: "name"
    },
    {
        title: "Gender",
        className: 'align-middle',
        data: (data, a, b) => {
            let sex = data.sex === 'M' ? 'Male' : 'Female';
            return sex;
        }
    },
    {
        title: "Class",
        className: 'align-middle',
        data: "level"
    },
    {
        title: "Session",
        className: 'align-middle',
        data: "session"
    },
    {
        title: "Date",
        className: 'align-middle',
        data: (data, a, b) => {
            let session_date = data.session_date ? data.session_date : '';
            return new Date(session_date).toLocaleDateString('en-GB',{
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).replaceAll(' ','-').replace(',','');
        }
    },
    {
        title: "Check-In",
        className: 'align-middle',
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
        className: 'align-middle',
        data: (data, a, b) => {
            let comeLate = data.in_remarks ? data.in_remarks : '';
            return comeLate;
        }
    },
    {
        title: "School Bus",
        className: 'align-middle',
        data: ""
    },
    {
        title: "Pick Up",
        className: 'align-middle',
        data: ""
    },
    {
        title: "Check-Out",
        className: 'align-middle',
        data: (data, a, b) => {
            let checkOut = data.checkout_time ? data.checkout_time : '';
            return new Date(`1970-01-01T${checkOut}Z`).toLocaleTimeString('en-US',{
                timeZone: 'UTC',
                hour12: true,
                hour:'numeric',
                minute: 'numeric'
            });
        }
    },
    {
        title: "Leave Early",
        className: 'align-middle',
        data: ""
    },
    {
        title: "Leave Late",
        className: 'align-middle',
        data: (data, a, b) => {
            let leaveLate = data.out_remarks ? data.out_remarks : '';
            return leaveLate;
        }
    },
    {
        title: "Remarks",
        className: 'align-middle',
        data: ""
    },
    {
        title: "Family ID",
        className: 'align-middle',
        data: "family_id"
    },
    {
        title: "Phone",
        className: 'align-middle',
        data: (data, a, b) => {
            let phone = data.parent_phone ? data.parent_phone : [];
            let phone_number = null;
            phone.map(p => {
                phone_number = [phone_number,p.phone_number].join('<br/>');
            });
            return phone_number.replace('<br/>','');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl_astr_',{
            'fetchApi':`${main_view.base_url}/api/student/attendance-list-report`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.classList.add(['text-nowrap']);
                tr.setAttribute('data-id',data.id ? data.id : '');
            },
            'beforeRender':() => {}
        });
    }

    this.prepareOptions = (onFinish = null) => {
        let div = mThis.containerFilter;
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then(res => {
            if(res.status_code === 200){
                let d = res.data;
                if(d && !($.isEmptyObject(d))){
                    div.find('.data-input').each(function(){
                        let el = $(this);
                        let f = el.data('field');
                        switch(f){
                            case 'academic_year':
                                VSUtil.setComboItems(el,d.academic_year,'academic_year','academic_year',null,null,null);
                                break;
                            case 'campus_id':
                                VSUtil.setComboItems(el,d.campuses,'id','campus',null,null,null);
                                break;
                            case 'level_id':
                                VSUtil.setComboItems(el,d.levels,'id','level',null,null,null);
                                break;
                            case 'session_id':
                                VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                                break;
                            default:
                                break;
                        }
                    });
                }
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            mThis.prepareOptions(() => {
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentAttendanceReportComponent.init();
});
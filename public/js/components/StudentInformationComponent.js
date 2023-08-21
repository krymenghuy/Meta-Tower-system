"use strict";
var StudentInformationComponent = new function(){
    let mThis = this;
    this.title_prop = "Student Information";
    this.self = $('#_main_studentInformationComponent');

    this.cols = [{
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "Student ID",
        data: "student_code"
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
        title: "Sex",
        data: (data, a, b) => {
            return [`${data.sex === 'M' ? 'Male' : 'Female'}`].join('');
        }
    },
    {
        title: "Date of Birth",
        data: "date_of_birth"
    },
    {
        title: "Family ID",
        data: "family_id"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-sin-details" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl--sin',{
            'fetchApi':`${main_view.base_url}/api/student/information`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.setAttribute('data-id',data.id);
            },
            'beforeRender':()=>{}
        });

        mThis.cfg = new ExpandableRowConfig('tbl--sin_table',{
            'dontExpandByClickingOn': ['btn-sin-details'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                if(id > 0)
                    mThis.displayStudentInformationDetails(detail_tr,id);
            }
        });
    }

    this.displayStudentInformationDetails = (tr, id) => {
        let div_wrapper = $(tr).find('.expandable-row-container');
        div_wrapper.addClass(['gap-2','on-hover-to-scroll']);
        div_wrapper.empty();
        let html = null;

        window.vsapi.call(`${main_view.base_url}/api/student/enrollment-details`,{'student_id': id},null,false).then(res => {
            let d = [], cur_symbol = '$';
            if(res.status_code === 200){
                d = res.data;
            }
            
            d && d.map(enroll => {
                let cls = enroll.status === 'pending' ? 'text-danger' : enroll.status === 'surcharge' ? 'text-warning' : enroll.status === 'verified' ? 'text-primary' : 'text-success';

                html = [html, `<div class="d-flex w-50 rounded-3 bg-light gap-2 min-width-box-enroll">
                    <div class="w-50 p-3 text-nowrap">
                        <p>
                            <span class="text-primary-emphasis">Campus</span>
                            <span>:</span>
                            <span>${enroll.campus}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Session</span>
                            <span>:</span>
                            <span>${enroll.session}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Level</span>
                            <span>:</span>
                            <span>${enroll.level}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Academic Year</span>
                            <span>:</span>
                            <span>${enroll.academic_year}</span>
                        </p>
                    </div>
                    <div class="w-50 p-3">
                        <p>
                            <span class="text-primary-emphasis">Tuition</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Tuition Due</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition_due}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Tuition Paid</span>
                            <span>:</span>
                            <span>${cur_symbol} ${enroll.tuition_paid}</span>
                        </p>
                        <p>
                            <span class="text-primary-emphasis">Status</span>
                            <span>:</span>
                            <span class="text-capitalize ${cls}">${enroll.status}</span>
                        </p>
                    </div>
                </div>`].join('');
            });

            div_wrapper.html(['<div class="position-absolute d-flex gap-2">',html,'</div>'].join(''));
            div_wrapper.on('wheel',function(e){
                let event = e.originalEvent;
                this.scrollLeft += event.deltaY;
            });
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
    StudentInformationComponent.init();
});
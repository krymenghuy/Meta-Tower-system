'use strict';


const main_view = new function () {
    this.secure_endpoint = [this.base_url, '/api/1a2b3c4d5e6f7g8h9i0j1k2l3m/en'].join('');
    this.base_url = window.location.origin;
}
var ScanAttendanceComponent = new function () {
    const mThis = this;
    this.title_prop = "Attendance Scan";
    this.base_url = window.location.origin;
    // const main_view =this.base_url;
    this.self = document.querySelector('#_main_attendanceScanComponent');
    this.elInput = mThis.self.querySelector('#_scan_employee_code');
    // this.elInput = mThis.self.querySelector('#_scan_card_number');
    this.elCurrentTime = mThis.self.querySelector('#_scan_current_time');
    this.elCurrentDate = mThis.self.querySelector('#_scan_current_date');
    this.elOption = mThis.self.querySelector('#_scan_option');
    this.studentTable = mThis.self.querySelector('#employee_Info_container');
    this.studentImgBox = mThis.self.querySelector('#employee_img_box');


    this.init = () => {
        setTimeout(() => {
            mThis.elInput.focus();
            mThis.renderTableStudent();
        }, 0);

        mThis.elInput.oninput = function (e) {
            e.preventDefault();

            clearTimeout(mThis.timeOut);
            mThis.timeOut = setTimeout(() => {
                //const today = new Date(),
                //current_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
                //present_time = today.getHours() + ":" + today.getMinutes();

                const op = {
                    employee_code: this.value,
                    current_date: mThis.elCurrentDate.value || null,
                    present_time: mThis.elCurrentTime.value || null,
                };

                if (mThis.elOption.value == 'force_checkin') op.force_checkin = 1;
                else if (mThis.elOption.value == 'force_checkout') op.force_checkout = 1;
                if (mThis.elCurrentTime.value) op.present_time = mThis.elCurrentTime.value;
                if (mThis.elCurrentDate.value) {
                    op.current_date = mThis.elCurrentDate.value;
                    op.session_date = mThis.elCurrentDate.value;
                }
                mThis.sendStudentCode(this, op);
            }, 200);
        }
    }

    this.sendStudentCode = (elInput, op) => {
        elInput.value = '';
        console.log(op);
        vsapi.call(`${mThis.base_url}/hr/employee/attendance/scan`, {
            employee_code: op.employee_code,
            current_date: op.current_date,
            present_time: op.present_time,
            force_checkin: op.force_checkin ?? 0,
            force_checkout: op.force_checkout ?? 0,
        }, null, false).then(res => {
            console.log(res);
            if (res.status_code === 200) {
                const d = res.data;
                // mThis.popDialog(d);
                mThis.renderTableStudent();
                mThis.renderStudentImage(d);

            }
            else {
                let timerInterval;
                Swal.fire({
                    icon: "error",
                    text: res.error_message,
                    timer: 2000,
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    width: 600
                });
            }
        });
    }

    this.popDialog = (d) => {
        let timerInterval;
        Swal.fire({
            title: "Student Information",
            html: mThis.renderStudent(d),
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
            width: 880,
            customClass: {
                title: 'bg-primary text-white p-2 m-0',
                footer: 'bg-primary p-2 m-0'
            }
        });
    }

    this.renderStudent = (d) => {

       
        const html = `<div class="d-flex">
            <div class="d-flex align-items-center justify-content-center w-50">
                <div class="container-image-logo-dialog">
                    <img class="w-100 h-100 object-fit-scale" src="${mThis.base_url}/assets/images/logo/kwis-logo.png" alt="company-logo"/>
                </div>
            </div>
            <div class="w-50">
                <div class="d-flex flex-column w-100">
                    <div class="d-flex align-items-center flex-column gap-2">
                        <div class="container-image-student rounded-circle overflow-hidden">
                            <img class="w-100 h-100 object-fit-scale" src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_student.avif`}" alt="student-profile"/>
                        </div>
                        <p class="fs-5 fw-semibold">${d.employee_name ?? ''}</p>
                    </div>
                    <div class="d-flex align-items-start flex-column gap-3">
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Student ID</p>
                            <p class="p-0 m-0">${d.employee_code ?? ''}</p>
                        </div>
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Grade</p>
                            <p class="p-0 m-0">${d.level ?? ''}</p>
                        </div>
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Group</p>
                            <p class="p-0 m-0">${d.group ?? ''}</p>
                        </div>
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Status</p>
                            <p class="p-0 m-0">${d.scan_status ?? ''}</p>
                        </div>
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Remark</p>
                            <p class="p-0 m-0">${d.remarks ?? ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    this.renderStudentImage = (d) => {
        d = d ?? [];
        const html = `
                        <img class="h-100 object-fit-scale" src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_student.avif`}" alt="student-profile"/>
                    `;
        mThis.studentImgBox.innerHTML = html;
        setTimeout(() => {
            mThis.studentImgBox.innerHTML = '';
        }, 2000);

    }
    this.number_student=0;
    this.renderTableStudent = () => {
        let per_page = mThis.number_student <=3 ? mThis.number_student : 3;
        let rows = null; 
        let html = `<table class="table border header-light-blue header-uppercase" id="tbl_astr__table">
                <thead>
                    <tr>
                        <th class="Student-ID">Student ID</th>
                        <th class="Student-Name">Student Name</th>
                        <th class="Session">Session</th>
                        <th class="Date">Date</th>
                        <th class="Check-In">Check-In</th>
                        <th class="Come-Late">Come-Late</th>
                        <th class="Check-Out">Check-Out</th>
                        <th class="Leave-Early">Leave Early</th>
                        <th class="Family-ID">Family ID</th>
                        <th class="Phone">Parent Phone</th>
                    </tr>
                </thead>
        `;
        console.log(234,per_page);
        vsapi.call(`${mThis.base_url}/api/student/attendance/last-students-scan`, {
            "per_page":per_page
        }, null, false).then(res => {
            console.log(123,res);
            if (res.status_code === 200) {
                const d = res.data;
                console.log(JSON.stringify(d,null,2));
                if(d.length > 0){
                    html += `
                    <tbody>
                    ${rows = null,
                        d.map( s =>{
                            rows = [rows,`<tr class="text-nowrap" data-id="">
                                
                                <td class="align-middle Student-ID">${s.code}</td>
                                <td class="align-middle Student-Name">
                                    <p class="pb-0 mb-1 text-capitalize">${s.name}</p>
                                    <span class="text-success">${s.sex}</span>
                                </td>
                                <td class="align-middle Session">
                                    <p class="pb-0 mb-1 text-nowrap">${s.session ?? ''}</p>
                                    <span>Class: </span><span class="text-success">${d.level ?? ''}</span>
                                </td>
                                <td class="align-middle Date">${s.date_of_birth ?? ''}</td>
                                <td class="align-middle Check-In">
                                    <div class="d-flex flex-column">
                                        <span>${s.checkin_time ?? ''}</span>
                                    </div>
                                </td>
                                <td class="align-middle Come-Late">${s.in_remarks ?? ''}</td>
                                <td class="align-middle Check-Out">${s.checkout_time ?? ''}</td>
                                <td class="align-middle Leave-Late">${s.out_remarks ?? ''}</td>
                                <td class="align-middle Family-ID">${s.family_id ?? ''}</td>
                                <td class="align-middle Phone">${s.parent_phone[0].phone_number ?? ''} ${s.parent_phone[1]? '<br>'+s.parent_phone[1].phone_number : ''}</td>
                            </tr>`].join('');
                        }),rows ?? ''
                    }
                        
                    </tbody>
                    `;
                }
                else{
                    html += `<tbody><tr><td colspan="100%" class="text-center"> <span>No data to display</span> </td></tr> </tbody>`;
                }
            
                    
                html+= '</table>';
                mThis.studentTable.innerHTML = html;
                mThis.number_student ++;
            }
            else {

            }

        });
        
        
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ScanAttendanceComponent.init();
});
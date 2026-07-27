"use strict";

// const main_view = new function(){
//     mThis.secure_endpoint =  [mThis.base_url,'/api/1a2b3c4d5e6f7g8h9i0j1k2l3m/en'].join('');
//     mThis.base_url = window.location.origin;
// }

var ScanAttendanceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Attendance Scan";
    mThis.base_url = window.location.origin;
    const main_view =mThis.base_url;
    mThis.self = document.querySelector('#_main_attendanceScanComponent');
    // mThis.elInput = mThis.self.querySelector('#_scan_card_number');
    // mThis.elCurrentTime = mThis.self.querySelector('#_scan_current_time');
    // mThis.elCurrentDate = mThis.self.querySelector('#_scan_current_date');
    // mThis.elOption = mThis.self.querySelector('#_scan_option');


    mThis.elInput = mThis.self.querySelector('#_scan_employee_code');
    mThis.elCurrentTime = mThis.self.querySelector('#_scan_current_time');
    mThis.elCurrentDate = mThis.self.querySelector('#_scan_current_date');
    mThis.elOption = mThis.self.querySelector('#_scan_option');
    mThis.employeeTable = mThis.self.querySelector('#employee_Info_container');
    mThis.employeeImageBox = mThis.self.querySelector('#student_img_box');


    mThis.init = () => {

        setTimeout(() => {

            if (mThis.elInput) {
                mThis.elInput.focus();
                mThis.renderTableEmployee();
            }
        }, 0);

        // Attach input event handler
        if (mThis.elInput) {
            mThis.elInput.onkeyup = function (e) {
                e.preventDefault();

                clearTimeout(mThis.timeOut);
                mThis.timeOut = setTimeout(() => {
                    const op = {
                        employee_code: mThis.elInput.value,
                        current_date: mThis.elCurrentDate?.value || null,
                        present_time: mThis.elCurrentTime?.value || null,
                    };

                    if (mThis.elOption?.value === 'force_checkin') {
                        op.force_checkin = 1;
                    } else if (mThis.elOption?.value === 'force_checkout') {
                        op.force_checkout = 1;
                    }

                    if (mThis.elCurrentTime?.value) {
                        op.present_time = mThis.elCurrentTime.value;
                    }

                    if (mThis.elCurrentDate?.value) {
                        op.current_date = mThis.elCurrentDate.value;
                        op.session_date = mThis.elCurrentDate.value;
                    }

                    mThis.sendEmployeeCode(mThis.elInput, op);
                }, 200);
            };
        }
    };


    mThis.sendEmployeeCode = (elInput, op) => {
        elInput.value = '';
        let p  = {
            employee_code: op.employee_code,
            current_date: op.current_date,
            present_time: op.present_time,
            force_checkin: op.force_checkin ?? 0,
            force_checkout: op.force_checkout ?? 0,
        }

        vsapi.fetch([main_view.base_url,"/mhr/employee/attendance/scan",].join(""),p,{ method: 'POST', authType: vsapi.authTypes.NONE }).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data;
                // mThis.popDialog(d);
                mThis.renderTableEmployee();
                // console.log(123,d);
                mThis.renderEmployeeImage(d);
            }
            else
            {
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
        })

    }

    mThis.popDialog = (d) => {
        let timerInterval;
        Swal.fire({
            title: "Student Information",
            html: mThis.renderEmployee(d),
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

    // mThis.renderEmployee = (d) => {
    //     const html = `<div class="d-flex">
    //         <div class="d-flex align-items-center justify-content-center w-50">
    //             <div class="container-image-logo-dialog">
    //                 <img class="w-100 h-100 object-fit-scale" src="${mThis.base_url}/assets/images/logo/ksm-logo.png" alt="company-logo"/>
    //             </div>
    //         </div>
    //         <div class="w-50">
    //             <div class="d-flex flex-column w-100">
    //                 <div class="d-flex align-items-center flex-column gap-2">
    //                     <div class="container-image-student rounded-circle overflow-hidden">
    //                         <img class="w-100 h-100 object-fit-scale" src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_student.avif`}" alt="student-profile"/>
    //                     </div>
    //                     <p class="fs-5 fw-semibold">${d.student_name ?? ''}</p>
    //                 </div>
    //                 <div class="d-flex align-items-start flex-column gap-3">
    //                     <div class="d-flex">
    //                         <p class="text-start p-0 m-0 width-p-in-popup">Student ID</p>
    //                         <p class="p-0 m-0">${d.student_code ?? ''}</p>
    //                     </div>
    //                     <div class="d-flex">
    //                         <p class="text-start p-0 m-0 width-p-in-popup">Grade</p>
    //                         <p class="p-0 m-0">${d.level ?? ''}</p>
    //                     </div>
    //                     <div class="d-flex">
    //                         <p class="text-start p-0 m-0 width-p-in-popup">Group</p>
    //                         <p class="p-0 m-0">${d.group ?? ''}</p>
    //                     </div>
    //                     <div class="d-flex">
    //                         <p class="text-start p-0 m-0 width-p-in-popup">Status</p>
    //                         <p class="p-0 m-0">${d.scan_status ?? ''}</p>
    //                     </div>
    //                     <div class="d-flex">
    //                         <p class="text-start p-0 m-0 width-p-in-popup">Remark</p>
    //                         <p class="p-0 m-0">${d.remarks ?? ''}</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>`;
    //     return html;
    // }

        mThis.renderEmployee = (d) => {
        console.log(555,d);

        const html = `<div class="d-flex">
            <div class="d-flex align-items-center justify-content-center w-50">
                <div class="container-image-logo-dialog">
                    <img class="w-100 h-100 object-fit-scale" src="${mThis.base_url}/assets/images/logo/ksm-logo.png" alt="moyes-logo"/>
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
    mThis.renderEmployeeImage = (d) => {
        d = d ?? [];
        const html = `
                        <div class="overflow-hidden rounded-circle mx-auto p-auto d-flex justify-content-center border bg-white border-4 mb-3 " style="width: 200px; height: 200px;">
                            <img class="h-100 " src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_student.avif`}" alt="student-profile"/>
                        </div>`;
        mThis.employeeImageBox.innerHTML = html;
        setTimeout(() => {
            mThis.employeeImageBox.innerHTML = '';
        }, 2000);

    }
    mThis.number_employee=0;
    mThis.renderTableEmployee = () => {
        let per_page = mThis.number_employee <=3 ? mThis.number_employee : 3;
        let rows = null;
        let html = `<table class="table border header-light-blue header-uppercase" id="tbl_astr__table">
                <thead>
                    <tr>
                        <th class="employee-id">Employee ID</th>
                        <th class="employee-name">Employee Name</th>
                        <th class="session-date"> Date </th>
                        <th class="status">Status</th>
                        <th class="Scan-Time">Scan Time</th>
                        <th class="auto-remarks">Remarks</th>

                    </tr>
                </thead>
        `;
        console.log(234,per_page);
         vsapi.fetch([main_view.base_url,"/mhr/employee/attendance/last-scan",].join(""),{ "per_page":per_page },{ method: 'POST', authType: vsapi.authTypes.NONE }).then(res => {
            if (res.status_code === 200) {
                const d = res.data;
                console.log(JSON.stringify(d,null,2));
                if(d.length > 0){
                    html += `
                    <tbody>
                    ${rows = null,
                        d.map( s =>{
                            rows = [rows,`<tr class="text-nowrap" data-id="">

                                <td class="align-middle employee-id">${s.code}</td>
                                <td class="align-middle employee-name">
                                    <p class="pb-0 mb-1 text-capitalize">${s.name}</p>
                                     <span class="text-success">${s.name_kh ?? ''} </span><br>
                                    <span class="text-success">${s.sex == "M" ? "Male" : "Female"} </span>
                                </td>
                                <td class="align-middle session-date">${s.attendance_date ?? ''}</td>
                                 <td class="align-middle Student-Name">
                                    <p class="pb-0 mb-1 text-capitalize text-success">${s.scan_action ?? '-'}</p>
                                </td>
                                <td class="align-middle Scan-Time">
                                    <div class="d-flex flex-column">
                                        <span>${s.scan_time ?? ''}</span>
                                    </div>
                                </td>
                                <td class="align-middle auto-remarks">
                                    <div class="d-flex flex-column">
                                        <span>${s.remarks ?? ''}</span>
                                    </div>
                                </td>


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
                mThis.employeeTable.innerHTML = html;
                mThis.number_employee ++;
            }
            else {

            }

        });


    }

    return mThis;
})();

window.addEventListener('DOMContentLoaded',() => {
    ScanAttendanceComponent.init();
});

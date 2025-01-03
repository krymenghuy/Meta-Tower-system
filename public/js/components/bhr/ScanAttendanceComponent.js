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
    this.employeeTable = mThis.self.querySelector('#employee_Info_container');
    this.employeeImgBox = mThis.self.querySelector('#employee_img_box');

    this.init = () => {
        setTimeout(() => {
            mThis.elInput.focus();
            mThis.renderTableEmployee();
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
                mThis.sendEmployeeCode(this, op);
            }, 200);
        }
    }

    this.sendEmployeeCode = (elInput, op) => {
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
                mThis.renderTableEmployee();
                console.log(123,d);
                mThis.renderEmployeeImage(d);

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
            title: "Employee Information",
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

    this.renderEmployee = (d) => {

       
        const html = `<div class="d-flex">
            <div class="d-flex align-items-center justify-content-center w-50">
                <div class="container-image-logo-dialog">
                    <img class="w-100 h-100 object-fit-scale" src="${mThis.base_url}/assets/images/logo/kwis-logo.png" alt="company-logo"/>
                </div>
            </div>
            <div class="w-50">
                <div class="d-flex flex-column w-100">
                    <div class="d-flex align-items-center flex-column gap-2">
                        <div class="container-image-employee rounded-circle overflow-hidden">
                            <img class="w-100 h-100 object-fit-scale" src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_employee.avif`}" alt="employee-profile"/>
                        </div>
                        <p class="fs-5 fw-semibold">${d.employee_name ?? ''}</p>
                    </div>
                    <div class="d-flex align-items-start flex-column gap-3">
                        <div class="d-flex">
                            <p class="text-start p-0 m-0 width-p-in-popup">Employee ID</p>
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
    this.renderEmployeeImage = (d) => {
        d = d ?? [];
        const html = `
                        <div class="overflow-hidden rounded-circle mx-auto p-auto d-flex justify-content-center border bg-white border-4 mb-3 " style="width: 200px; height: 200px;">
                            <img class="h-100 " src="${d.image_url ?? `${mThis.base_url}/assets/images/logo/default_image_employee.avif`}" alt="employee-profile"/>
                        </div>`;
        mThis.employeeImgBox.innerHTML = html;
        setTimeout(() => {
            mThis.employeeImgBox.innerHTML = '';
        }, 2000);

    }
    this.number_employee=0;
    this.renderTableEmployee = () => {
        let per_page = mThis.number_employee <=3 ? mThis.number_employee : 3;
        let rows = null; 
        let html = `<table class="table border header-light-blue header-uppercase" id="tbl_astr__table">
                <thead>
                    <tr>
                        <th class="Employee-ID">Employee ID</th>
                        <th class="Employee-Name">Employee Name</th>
                        <th class="Session">Session</th>
                        <th class="Check-In">Check-In</th>
                        <th class="Check-Out">Check-Out</th>
                    </tr>
                </thead>
        `;
        console.log(234,per_page);
        vsapi.call(`${mThis.base_url}/api/employee/attendance/last-employees-scan`, {
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
                                
                                <td class="align-middle Employee-ID">${s.code}</td>
                                <td class="align-middle Employee-Name">
                                    <p class="pb-0 mb-1 text-capitalize">${s.name}</p>
                                    <span class="text-success">${s.sex}</span>
                                </td>
                                <td class="align-middle Session">
                                    <p class="pb-0 mb-1 text-nowrap">${s.session ?? ''}</p>
                                    <span>Class: </span><span class="text-success">${d.level ?? ''}</span>
                                </td>
                                <td class="align-middle Check-In">
                                    <div class="d-flex flex-column">
                                        <span>${s.checkin_time ?? ''}</span>
                                    </div>
                                </td>
                                <td class="align-middle Check-Out">${s.checkout_time ?? ''}</td>
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
}

window.addEventListener('DOMContentLoaded', () => {
    ScanAttendanceComponent.init();
});
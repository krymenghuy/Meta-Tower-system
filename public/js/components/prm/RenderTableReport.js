"use strict";
let HtmlString = null;
/**
 * These function for generate student attendance table of reports
 */
const formattedNumber = (number) => {
    number = Number(number) || 0;
    return number
        .toLocaleString("en-US", {
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        .replace(/,/g, " ");
};
function employeeAttendance(div, data = null) {
    let html = `<title>Monthly Employee Attendance Sheet</title>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }

      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }

      .employee-name {
        background-color: #e0e0e0;
      }

      .totals {
        font-weight: bold;
        background-color: #d0d0d0;
      }
    </style>

  <h5 class="text-primary">Monthly Employee Attendance Sheet</h5>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>11</th>
        <th>12</th>
        <th>13</th>
        <th>14</th>
        <th>15</th>
        <th>16</th>
        <th>17</th>
        <th>18</th>
        <th>19</th>
        <th>20</th>
        <th>Totals</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="employee-name">Luiza Leveque<br>Sales Associate<br>Sales</td>
        <td>H</td>
        <td>H</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>N</td>
        <td>N</td>
        <td>P</td>
        <td>P</td>
        <td>Y</td>
        <td>Y</td>
        <td>H</td>
        <td>H</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td class="totals">Attended: 15<br>Sick/PTO: 5<br>Unpaid Leave: 5<br>Holiday/Non-work: 9<br>No Show/No Call: 2<br>Attendance: 42%</td>
      </tr>
      </tbody>
  </table>`;
    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}
function employeeBenefitsReport(div, data = null) {
    let html = `<title>Monthly Employee Benefit Sheet</title>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }

      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }

      .employee-name {
        background-color: #e0e0e0;
      }

      .totals {
        font-weight: bold;
        background-color: #d0d0d0;
      }
    </style>

  <h2>Monthly Employee Attendance Sheet</h2>

  <table>
    <thead>
      <tr>
        <th></th>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>11</th>
        <th>12</th>
        <th>13</th>
        <th>14</th>
        <th>15</th>
        <th>16</th>
        <th>17</th>
        <th>18</th>
        <th>19</th>
        <th>20</th>
        <th>Totals</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="employee-name">Luiza Leveque<br>Sales Associate<br>Sales</td>
        <td>H</td>
        <td>H</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>N</td>
        <td>N</td>
        <td>P</td>
        <td>P</td>
        <td>Y</td>
        <td>Y</td>
        <td>H</td>
        <td>H</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
        <td>Y</td>
      </tr>
      </tbody>
  </table>`;
    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}
function employeeCV(div1, d = null) {
    const div = div1 instanceof jQuery ? div1 : $(div1);

    const data = d.data[0];

    let html = "";
    if (data) {
        html = `<title>Employee CV</title>
                <style>
                    .employee_cv {
                        max-width: 90%;
                        margin: 50px;
                        padding: 20px;
                        border: 1px solid #ddd;
                        background-color: #f9f9f9;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    .section_header>h5 {
                        font-size: 18px;
                        color: #555;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        border-bottom: 2px solid #ddd;
                        padding-bottom: 5px;
                    }
                    .emp_cv_header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .cv_header_left {
                        flex: 0 0 100px;
                        height: 100px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 20px;
                    }
                    .cv_header_left img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .cv_header_right {
                        flex: 1;
                        text-align: left;
                    }
                    .cv_header_right h4 {
                        margin: 0;
                        font-size: 24px;
                        color: #222;
                    }
                    .cv_header_right p {
                        margin: 5px 0;
                        font-size: 14px;
                        color: #555;
                    }
                    .section_header {
                        margin-top: 20px;
                    }
                    .sub_info {
                        color: #666;
                        font-size: 14px;
                    }
                    .info_cv_group {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    .info_cv_group li {
                        background: #f5f5f5;
                        border: 1px solid #ddd;
                        padding: 10px;
                        margin-bottom: 10px;
                        border-radius: 5px;
                        color: #333;
                    }
                    .two-column {
                        gap: 20px;
                        margin-top: 10px;
                    }
                    .two-column > div {
                        flex: 1;
                    }
                </style>
                <div class="employee_cv">
                    <div class="emp_cv_header">
                        <div class="cv_header_left">
                            <img src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png" }" alt="Profile Image">
                        </div>
                        <div class="cv_header_right">
                            <h4>${data.name}</h4>
                            <p>Position: ${data.position_id}</p>
                        </div>
                    </div>`;

        html += `<div class="section_header">
                    <h5>About Me</h5>
                    <p class="sub_info">My name’s ${data.name}. I excelent in problem-solving, teamwork, and designing scalable applications. With a proven track record of delivering high-quality projects on time, I specialize in creating intuitive user interfaces and robust backend systems. My ability to adapt to challenges and communicate effectively enables me to thrive in dynamic environments. I am passionate about leveraging technology to solve real-world problems and committed to continuous learning and professional growth.</p>
                </div>`;

        if (data.skills && data.skills.length > 0) {
            html += `<div class="section_header">
                        <h5>Technical Skills</h5>
                        <div class="two-column">`;
            data.skills.forEach((skill) => {
                html += `<div><ul class="info_cv_group">
                            <li>${skill.skill} (${skill.rate}%) - ${skill.description}</li>
                        </ul></div>`;
            });
            html += `</div></div>`;
        } else {
            html += `<div class="section_header">
                        <h5>Technical Skills</h5>
                        <p class="sub_info">No skills data available.</p>
                    </div>`;
        }

        if (data.experiences && data.experiences.length > 0) {
            html += `<div class="section_header">
                        <h5>Professional Experience</h5>`;
            data.experiences.forEach((experience) => {
                html += `
                    <ul class="info_cv_group">
                        <li>
                            <h6>${experience.position} at ${experience.organization} (${experience.period})</h6>
                            <p>${experience.description}</p>
                        </li>
                    </ul>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="section_header">
                        <h5>Professional Experience</h5>
                        <p class="sub_info">No professional experience data available.</p>
                    </div>`;
        }

        if (data.educations && data.educations.length > 0) {
            html += `<div class="section_header">
                        <h5>Education</h5>`;
            data.educations.forEach((education) => {
                html += `
                    <ul class="info_cv_group">
                        <li>
                            <h6>${education.edu_level} in ${education.major}</h6>
                            <p>${education.school} (${education.start_year} - ${education.finish_year})</p>
                        </li>
                    </ul>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="section_header">
                        <h5>Education</h5>
                        <p class="sub_info">No education data available.</p>
                    </div>`;
        }

        html += `<div class="section_header">
                    <h5>Additional Information</h5>
                    <ul class="info_cv_group">
                        <li>Languages: ${data.nationality}</li>
                        <li>Country: ${data.country}</li>
                        <li>Address: ${data.address}</li>
                        <li>Phone Number: ${data.phone_number}</li>
                    </ul>
                </div>
            </div>`;
    }

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

this.viewEmployeeCV = (id, menuLink) => {
    let op = {
        id: id,
    };

    vsapi
        .call(
            `${main_view.base_url}/ypg/reports/employee/print-employee-cv`,
            op,
            false,
            false,
            false
        )
        .then((res) => {
            if (res.status_code == 200) {
                let d = res.data;
                employeeCV(menuLink, d);
            }
        });
};
function windowPrintCV(html,style)
{
    if(html)
    {
        let myWindow = window.open('','PRINT');
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>CV Print</title>

                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/css_for_print_invoice.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/font-awesome/6.2.0/css/all.min.css" media="print//"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css" media="print//"/>
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:14px;
                    }
                    ${style}
                </style>
            </head>
            <body>
                ${html.replace(/table-responsive/g,'')}
            </body>
        </html>`);
        myWindow.document.close();

        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        },200);
    }
}


function paySlipReport(div, d = null) {
    const data = d.data[0] || null;
    let html = "";
    if (data)
        html = `<title>Pay Slip</title>
                <style>
                    .paySlip_card {
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        padding: 10px;
                        width: 98%;
                    }
                    .paySlip_details {
                        display: flex;
                        justify-content: center;
                        height: 510px;
                    }

                    .paySlip-header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        padding: 10px;
                        padding-bottom: 20px;
                    }

                    .paySlip-title {
                        text-align: center;
                        flex-grow: 1;
                    }
                    .paySlip_profile {
                        gap: 10px;
                        justify-content: center;
                        border: 1px solid #ccc;
                        padding: 10px;
                        border-radius: 5px;
                    }

                    .paySlip_img {
                        display: flex;
                        justify-content: center;
                        width: 80px;
                        height: 80px;
                        overflow: hidden;
                        border-radius: 50%;

                    }

                    .paySlip_table{
                        display: flex;
                        padding: 10px;
                    }

                </style>
                <div class="paySlip_card overflow-y-auto overflow-x-hidden">
                    <div class="paySlip-header">
                        <div class="paySlip-title">
                            <h4>Pay Slip : ${data.duration}</h4>
                        </div>

                    </div>

                    <div class="paySlip_profile">
                        <div class="row cols-2 mb-0">
                            <div class="col-2">
                                <div class="paySlip_img" data-id="" data-imageurl="">
                                <img src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png" }" alt="Profile Image">
                                </div>
                            </div>
                            <div class="col-5 p_profile_left">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Employee Name</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize data-get">${
                                        data.emp_name || "N/A"
                                    }</p>
                                </div>

                               <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Sex</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize">
                                        ${
                                            data.sex === "M"
                                                ? "Male"
                                                : data.sex === "F"
                                                ? "Female"
                                                : "Other"
                                        }
                                    </p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Employee ID</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap">${
                                        data.emp_code || "N/A"
                                    }</p>
                                </div>
                            </div>
                            <div class="col-5 p_profile_right">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Branch</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.branch_name || "N/A"
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Position</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.emp_position || "N/A"
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Join Date</p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.joining_date || "N/A"
                                    }</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="paySlip_table row "style="display: flex !important">
                    <div class="col-6">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> Salary </td>
                                    <td>${formattedNumber(
                                        data.p_salary || 0.0
                                    )}</td>
                                </tr>
                                 <tr>
                                    <td>Days</td>
                                    <td>${data.count_day || 0}</td>
                                </tr>
                                <tr>
                                    <td>Taxable BFT</td>
                                    <td class="text-success">${formattedNumber(
                                        data.benefit_taxable || 0.0
                                    )}</td>
                                </tr>
                                <tr>
                                    <td>BFT (${
                                        data.flat_tax_rate || 0.0
                                    } % tax)</td>
                                    <td class="text-success">${formattedNumber(
                                        data.benefit_flat_rate || 0.0
                                    )}</td>
                                </tr>
                                <tr>
                                    <td>Deduction</td>
                                    <td class="text-danger">${formattedNumber(
                                        data.deduction || 0.0
                                    )}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div class="col-6">

                        <table class="table ">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>Allowance</td>
                                    <td>${formattedNumber(
                                        data.p_allowance || 0.0
                                    )}</td>
                                </tr>

                                 <tr>
                                    <td>Tax Rate</td>
                                    <td>${data.tax_rate || 0.0}%</td>
                                </tr>
                                <tr>
                                    <td>Nontax BFT</td>
                                    <td class="text-success">${formattedNumber(
                                        data.benefit_non_tax || 0.0
                                    )}</td>
                                </tr>
                                <tr>
                                    <td>Benefit Tax Flat Rate</td>
                                    <td class="text-danger">${formattedNumber(
                                        data.benefit_tax || 0.0
                                    )}</td>
                                </tr>
                                <tr>
                                    <td>Tax Base</td>
                                    <td class ="text-danger">${formattedNumber(
                                        data.tax_base || 0.0
                                    )}</td>
                                </tr>
                            </tbody>

                        </table>
                        </div>
                           <div class="col-12 d-flex justify-content-center pb-1">
                                <p class=" text-success rounded-5 m-0 border p-2 bg-light">Total Salary : ${formattedNumber(
                                    data.total_salary || 0.0
                                )}</p>
                           </div>
                    </div>

                </div>
            `;
    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}
this.viewPaySlip = (id, menuLink) => {
    let op = {
        id: id,
    };

    vsapi
        .call(
            `${main_view.base_url}/ypg/reports/employee/payslip-print`,
            op,
            false,
            false,
            false
        )
        .then((res) => {
            if (res.status_code == 200) {
                let d = res.data;
                mThis.paySlipReport(d);
            }
        });
};
function studentAttendance(div, data) {
    if (data && !$.isEmptyObject(data)) {
        let html = `<div class="d-flex justify-content-center mb-3">
            <div class="w-25 position-relative">
                <img class="w-100 object-fit-scale set-min-size-logo" src="${
                    main_view.base_url
                }/assets/images/logo/photo_report.png" alt=""/>
            </div>
        </div>
        <div class="d-flex position-relative w-100">
            <div class="d-block w-100">
                <h4 class="text-center text-uppercase">Monthly Student Attendance</h4>
                <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">
                    Kindergarten
                    (${data.session ?? ""}) - ${data.level ?? ""} ${
            data.program ?? ""
        }
                </p>
            </div>
            <div class="width-show-total">
                <h5 class="text-nowrap">Campus: ${data.campus ?? ""}</h5>
                <div class="d-flex text-nowrap">
                    Total Students:
                    <p class="w-100 text-center">${
                        data.count_students ? data.count_students.all : ""
                    }</p>
                </div>
                <div class="d-flex text-nowrap">
                    Female Students:
                    <p class="w-100 text-center">${
                        data.count_students ? data.count_students.female : ""
                    }</p>
                </div>
            </div>
        </div>`;

        data &&
            data.session_date &&
            data.session_date.map((tbl) => {
                let student = null,
                    days = null,
                    cnt = 1,
                    cols = tbl.days.length,
                    attendance = {};

                html = [
                    html,
                    `<div class="table-responsive mt-3 pt-3 pb-3 bg-white overflow-x-hover-auto">
                <table class="table table-bordered text-nowrap">
                    <thead>
                        <tr>
                            <th rowspan="2" class="align-middle text-center count-th">No</th>
                            <th rowspan="2" class="align-middle text-center count-th">Student Name</th>
                            <th rowspan="2" class="align-middle text-center count-th">Sex</th>
                            <th rowspan="2" class="align-middle text-center count-th">Age</th>
                            <th rowspan="2" class="align-middle text-center count-th">DOB</th>
                            <th rowspan="2" class="align-middle text-center count-th">Admission Date</th>
                            <th rowspan="2" class="align-middle text-center count-th">Shift</th>
                            <th class="align-middle text-center" colspan="${parseInt(
                                cols + 3
                            )}">${tbl.date ?? ""}</th>
                            <th rowspan="2" class="align-middle text-center count-th">Phone Number</th>
                        </tr>
                        <tr>
                            ${
                                ((days = null),
                                tbl &&
                                    tbl.days &&
                                    tbl.days.map((d) => {
                                        days = [
                                            days,
                                            `<th class="align-middle text-center count-th">${
                                                d.day ?? ""
                                            }</th>`,
                                        ].join("");
                                    }),
                                days ?? "")
                            }
                            <th style="background-color:#0abb87;color:#ffffff" class="align-middle text-center text-white bg-success count-th">P</th>
                            <th style="background-color:#ffb822;color:#ffffff" class="align-middle text-center text-white bg-warning count-th">Pr</th>
                            <th style="background-color:#fd397a;color:#ffffff" class="align-middle text-center text-white bg-danger count-th">A</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            ((attendance.total_present = 0),
                            (attendance.total_permission = 0),
                            (attendance.total_absent = 0),
                            (student = null),
                            tbl &&
                                tbl.students &&
                                tbl.students.map((st, index) => {
                                    const options = {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    };
                                    attendance.total_present =
                                        attendance.total_present +
                                        parseInt(
                                            tbl.monthly_attendance[index]
                                                .present
                                        );
                                    attendance.total_permission =
                                        attendance.total_permission +
                                        parseInt(
                                            tbl.monthly_attendance[index]
                                                .permission
                                        );
                                    attendance.total_absent =
                                        attendance.total_absent +
                                        parseInt(
                                            tbl.monthly_attendance[index].absent
                                        );

                                    let inner_html = null;
                                    st &&
                                        st.list &&
                                        st.list.map((d) => {
                                            let cls, inline_style;
                                            d.status === "A"
                                                ? ((cls =
                                                      "text-white bg-danger"),
                                                  (inline_style =
                                                      "background-color:#fd397a;color:#ffffff"))
                                                : d.status === "P"
                                                ? ((cls =
                                                      "text-white bg-success"),
                                                  (inline_style =
                                                      "background-color:#0abb87;color:#ffffff"))
                                                : d.status === "Sat"
                                                ? ((cls =
                                                      "text-danger-emphasis bg-danger-subtle"),
                                                  (inline_style =
                                                      "background-color:#f8d7da;color:#58151c"))
                                                : d.status === "Sun"
                                                ? ((cls =
                                                      "text-danger bg-danger-subtle"),
                                                  (inline_style =
                                                      "background-color:#f8d7da;color:#dc3545"))
                                                : d.status === "Pr"
                                                ? ((cls =
                                                      "text-white bg-warning"),
                                                  (inline_style =
                                                      "background-color:#ffc107;color:#ffffff"))
                                                : ((cls =
                                                      "text-body-emphasis bg-dark-subtle"),
                                                  (inline_style =
                                                      "background-color:#ced4da;color:#fff"));

                                            inner_html = [
                                                inner_html,
                                                `<td style="${inline_style}" class="align-middle ${cls}">${d.status}</td>`,
                                            ].join("");
                                        });

                                    student = [
                                        student,
                                        `<tr>
                                    <td class="align-middle">${cnt++}</td>
                                    <td class="align-middle text-capitalize">${
                                        st.name ?? ""
                                    }</td>
                                    <td class="align-middle">${
                                        st.sex === "M" ? "Male" : "Female"
                                    }</td>
                                    <td class="align-middle">${calculate_age(
                                        new Date(st.date_of_birth)
                                    )}</td>
                                    <td class="align-middle">${
                                        st.date_of_birth
                                            ? new Date(st.date_of_birth)
                                                  .toLocaleDateString(
                                                      "km-KH",
                                                      options
                                                  )
                                                  .replace(",", "")
                                            : ""
                                    }</td>
                                    <td class="align-middle">${
                                        st.start_date
                                            ? new Date(st.start_date)
                                                  .toLocaleDateString(
                                                      "km-KH",
                                                      options
                                                  )
                                                  .replace(",", "")
                                            : ""
                                    }</td>
                                    <td class="align-middle">${
                                        data.session ?? ""
                                    }</td>
                                    ${inner_html ?? "<td></td>"}
                                    <td style="background-color:#0abb87;color:#ffffff" class="align-middle text-center text-white bg-success">
                                        ${
                                            tbl.monthly_attendance &&
                                            tbl.monthly_attendance[index]
                                                .present
                                        }
                                    </td>
                                    <td style="background-color:#ffb822;color:#ffffff" class="align-middle text-center text-white bg-warning">
                                        ${
                                            tbl.monthly_attendance &&
                                            tbl.monthly_attendance[index]
                                                .permission
                                        }
                                    </td>
                                    <td style="background-color:#fd397a;color:#ffffff" class="align-middle text-center text-white bg-danger">
                                        ${
                                            tbl.monthly_attendance &&
                                            tbl.monthly_attendance[index].absent
                                        }
                                    </td>
                                    <td class="align-middle">
                                        ${
                                            ((options.phone = null),
                                            tbl.phone_number &&
                                                tbl.phone_number[index].map(
                                                    (p, i) => {
                                                        options.phone = [
                                                            options.phone,
                                                            p.phone_number,
                                                        ].join(
                                                            `${
                                                                i % 2 == 0
                                                                    ? "<br/>"
                                                                    : " / "
                                                            }`
                                                        );
                                                    }
                                                ),
                                            options.phone.replace("<br/>", ""))
                                        }
                                    </td>
                                </tr>`,
                                    ].join("");
                                }),
                            student ?? "")
                        }

                        ${
                            ((attendance.daily = null),
                            (attendance.absent = null),
                            (attendance.permission = null),
                            (attendance.present = null),
                            tbl &&
                                tbl.daily_attendance &&
                                tbl.daily_attendance.map((at) => {
                                    let cls, inline_style;
                                    at.absent == 0 &&
                                    at.permission == 0 &&
                                    at.present == 0
                                        ? ((cls = "bg-danger-subtle"),
                                          (inline_style =
                                              "background-color:#2c0b0e"))
                                        : (cls = "align-middle text-center");

                                    attendance.absent = [
                                        attendance.absent,
                                        `<td ${inline_style} class="${cls}">${
                                            at.absent == 0 ? "" : at.absent
                                        }</td>`,
                                    ].join("");

                                    attendance.permission = [
                                        attendance.permission,
                                        `<td ${inline_style} class="${cls}">${
                                            at.permission == 0
                                                ? ""
                                                : at.permission
                                        }</td>`,
                                    ].join("");

                                    attendance.present = [
                                        attendance.present,
                                        `<td ${inline_style} class="${cls}">${
                                            at.present == 0 ? "" : at.present
                                        }</td>`,
                                    ].join("");
                                }),
                            (attendance.daily = [
                                `<tr>
                            <td colspan="4" rowspan="3" class="align-middle text-center fs-4">Total</td>
                            <td colspan="2" class="align-middle text-end">Present:</td>
                            <td style="background-color:#198754;color:#ffffff" class="text-white bg-success text-center">P</td>
                            ${attendance.present ?? "<td></td>"}
                            <td rowspan="3" style="background-color:#198754;color:#ffffff" class="align-middle text-center text-white bg-success">${
                                attendance.total_present ?? ""
                            }</td>
                            <td rowspan="3" style="background-color:#ffc107;color:#ffffff" class="align-middle text-center text-white bg-warning">${
                                attendance.total_permission ?? ""
                            }</td>
                            <td rowspan="3" style="background-color:#dc3545;color:#ffffff" class="align-middle text-center text-white bg-danger">${
                                attendance.total_absent ?? ""
                            }</td>
                            <td rowspan="3" class="align-middle text-center"></td>
                        </tr>
                        <tr>
                            <td colspan="2" class="align-middle text-end">Permission:</td>
                            <td style="background-color:#ffc107;color:#ffffff" class="text-white bg-warning text-center">Pr</td>
                            ${attendance.permission ?? "<td></td>"}
                        </tr>
                        <tr>
                            <td colspan="2" class="align-middle text-end">Absent:</td>
                            <td style="background-color:#dc3545;color:#ffffff" class="text-white bg-danger text-center">A</td>
                            ${attendance.absent ?? "<td></td>"}
                        </tr>`,
                            ].join("")),
                            attendance.daily ?? "")
                        }
                    </tbody>
                </table>
            </div>`,
                ].join("");
            });

        div.html(html);
        togglePanelTable(div);
        HtmlString = html;
    }
}

function jsonToTable(div, d) {
    d = d ?? {};
    let header = null,
        body = null,
        tr = null;
    const thead = d.header ?? [],
        tbody = d.data ?? [],
        company_info = d.company_profile ?? d.company_info ?? {};

    const html = [
        `<div class="d-block position-relative min-height-top">
            <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
                <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
                <p class="text-center w-100 fs-5-1 get-subtitle fs-5">${d.sub_title ?? ""}</p>
            </div>
        </div>
        <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
            <table class="table table-bordered table_reports">
                <thead>
                    <tr>
                        ${
                            ((header = null),
                            thead.map((t) => {
                                header = [
                                    header,
                                    `<th style="background-color:#fff3cd;text-transform:capitalize" class="bg-warning-subtle text-nowrap text-capitalize count-th">
                                        ${t.name.toLowerCase() === "starting date" ? "Admission Date" :
                                          t.name === "Tuition Fee" ? "School Fee" :
                                          t.name ?? ""}
                                    </th>`,
                                ].join("");
                            }),
                            header ?? "")
                        }
                    </tr>
                </thead>
                <tbody>
                    ${
                        ((body = null),
                        tbody.map((row) => {
                            body = [
                                body,
                                `<tr class="text-nowrap">${
                                    ((tr = null),
                                    thead.map((col) => {
                                        let value = row[col.key] ?? "";
                                        let cellClass = "text-capitalize";

                                        if (col.key.toLowerCase() === "status") {
                                            const statusVal = String(value).toLowerCase();
                                            if (statusVal === "active" || statusVal === "done") {
                                                cellClass += " text-success";
                                            } else if (statusVal === "inactive" || statusVal === "used") {
                                                cellClass += " text-danger";
                                            } else if (statusVal === "pending" || statusVal === "reserved") {
                                                cellClass += " text-warning";
                                            } else {
                                                cellClass += " text-info";
                                            }


                                        }
                                        if (col.key.toLowerCase() === "expiry_status") {
                                            const statusVal = String(value).toLowerCase();
                                            if (statusVal === "expired") {
                                                cellClass += " text-warning";
                                            }
                                        }

                                        if (col.key.toLowerCase() === "sex" || col.key.toLowerCase() === "member_sex" || col.key.toLowerCase() === "tomb_owner_sex") {
                                            let statusVal = String(value).toLowerCase();

                                            if (statusVal === "m") statusVal = "male";
                                            else if (statusVal === "f") statusVal = "female";
                                            else if (statusVal === "o") statusVal = "other";

                                            value = statusVal;
                                            cellClass += " text-info";
                                        }



                                        tr = [
                                            tr,
                                            `<td class="${cellClass}">${value}</td>`,
                                        ].join("");
                                    }),
                                    tr ?? "")
                                }</tr>`,
                            ].join("");
                        }),
                        body ?? "")
                    }
                </tbody>
            </table>
        </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}



function tenantList(div, data) {
     const d = data?.list ?? [];
     const company_info = data.company_profile ?? {};
    let html = `
    <div class="d-block position-relative">
        <div class="height-logo-report position-absolute overflow-hidden">
            <img style="max-width: 100px; max-height: 100px;" class=" object-fit-scale set-min-size-logo" src="${company_info.logo_url ?? ''}" alt=""/>
        </div>
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${data.title ?? ''}</h4>
            <p class="text-center w-100 fs-5-1 pb-0 mb-0 get-subtitle fs-5">${data.sub_title ?? ''}</p>
        </div>
    </div>
    `;
    html += `
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white overflow-x-hover-auto">
        <table class="table table-bordered text-nowrap">
            <thead>
                <tr>
                    <th class="text-center">No</th>
                    <th class="text-center">Name</th>
                    <th class="text-center">Sex</th>
                    <th class="text-center">Phone</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">National ID</th>
                    <th class="text-center">Passport</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Address</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (d.length) {
        d.forEach((st, index) => {
            html += `
                <tr>
                    <td class="text-center align-middle">
                        ${index + 1}
                    </td>
                    <td class="align-middle">
                        ${st.name ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${
                            st.sex === 'M'
                                ? 'Male'
                                : st.sex === 'F'
                                ? 'Female'
                                : 'Other'
                        }
                    </td>
                    <td class="text-center align-middle">
                        ${st.phone_number ?? 'N/A'}
                    </td>
                    <td class="align-middle">
                        ${st.email ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${st.national_id ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${st.passport_number ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${st.status ?? 'N/A'}
                    </td>
                    <td class="align-middle">
                        ${st.address ?? 'N/A'}
                    </td>
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="13" class="text-center">
                    No data found
                </td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    </div>
    `;

    div.innerHTML = html;
    // togglePanelTable(div);
    HtmlString = html;
}
function totalPaymentHistory(div, data) {
    let html = `
        <div class="d-flex position-relative w-100">
            <div class="d-block mt-3 w-100">
                <h4 class="text-center text-uppercase">
                    ${data?.title ?? ''}
                </h4>
                <p class="text-center w-100 fs-5-1 get-subtitle fs-5">${data?.sub_title ?? ""}</p>
            </div>
        </div>
    `;

    const d = data?.list ?? [];

    html += `
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white overflow-x-hover-auto">
        <table class="table table-bordered text-nowrap">
            <thead>
                <tr>
                    <th class="text-center">No</th>
                    <th class="text-center">Payment Date</th>
                    <th class="text-center">Reference No</th>
                    <th class="text-center">Vendor</th>
                    <th class="text-center">Amount</th>
                    <th class="text-center">Payment Method</th>
                </tr>
            </thead>
            <tbody>
    `;
  if (d.length) {
        d.forEach((st, index) => {
            html += `
                <tr>
                    <td class="text-center align-middle">
                        ${index + 1}
                    </td>
                    <td class="text-center align-middle">
                        ${st.payment_date ?? 'N/A'}
                    </td>
                    <td class="align-middle">
                        ${st.ref_no ?? 'N/A'}
                    </td>
                    <td class="align-middle">
                        ${st.vendor_name ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${st.amount ?? 'N/A'}
                    </td>
                    <td class="text-center align-middle">
                        ${st.payment_method ?? 'N/A'}
                    </td>
                    
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="13" class="text-center">
                    No data found
                </td>
            </tr>
        `;
    }
    

    html += `
            </tbody>
        </table>
    </div>
    `;

    div.innerHTML = html;
    // togglePanelTable(div);

    HtmlString = html;
}
function employeeListByBranchTable(div, d) {
    d = d ?? {};
    let header = null,
        body = null,
        tr = null;
    const thead = d.header ?? [],
        tbody = d.list ?? [],
        company_info = d.company_profile ?? {};

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th rowspan="2" style="background-color:#cff4fc" class="bg-info-subtle text-nowrap text-center align-middle count-th">No.</th>
                    <th colspan="4" style="background-color:#198754;color:#ffffff" class="bg-success text-nowarp text-center align-middle text-white">Recommemder</th>
                    <th colspan="11" style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-nowrap text-center align-middle text-white">Are Recommended</th>
                    <th colspan="3" style="background-color:#198754;color:#ffffff" class="bg-success text-nowrap text-center align-middle text-white">Recommemder</th>
                    <th rowspan="2" style="background-color:#cff4fc" class="bg-info-subtle text-nowrap text-center align-middle count-th">Remark</th>
                </tr>
                <tr>
                    ${
                        ((header = null),
                        thead &&
                            thead.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="text-nowrap bg-info-subtle count-th">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header ?? "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    tbody.map((d, i) => {
                        body = [
                            body,
                            `<tr class="text">
                        ${
                            ((tr = null),
                            thead.map((k) => {
                                tr = [
                                    tr,
                                    `<td class="text-capitalize align-middle ${
                                        k.key == "ref_parent"
                                            ? "text-break"
                                            : "text-nowrap"
                                    }" style=" ${
                                        k.key == "ref_parent"
                                            ? "min-width: 250px"
                                            : ""
                                    }">${d[k.key] ?? ""}</td>`,
                                ].join("");
                            }),
                            tr
                                ? `<td class="text-nowrap align-middle">${
                                      i + 1
                                  }</td>` +
                                  tr +
                                  `<td class="text-capitalize align-middle " style="min-width:300px">${
                                      d.remarks || ""
                                  }</td>`
                                : "")
                        }</tr>`,
                        ].join("");
                    }),
                    body ?? "")
                }
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-between">
        <div class="d-block">
            <p>Prepared By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Officer</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Verified By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Manager</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Checked By</p>
            <hr class="bg-dark mt-5"/>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Approved By</p>
            <hr class="bg-dark mt-5"/>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

// const reportLayout = (container,data) =>{

// }

function nonTuitionFeeTable(div, d) {
    let header = null,
        body = null,
        tr = null,
        table = null,
        cnt = 0;
    const thead = d.header ?? [],
        tbody = d.list.all_fee ?? [],
        company_info = d.company_profile ?? {};
    const length = tbody.length;

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
        ${
            ((cnt = 0),
            (table = null),
            tbody &&
                tbody.map((tbl, i) => {
                    cnt++;
                    table = [
                        table,
                        `<p class="pb-0 mb-1 text-capitalize get-title">${
                            tbl.class ?? ""
                        }</p>
                <table class="table table-bordered">
                    <thead>
                        <tr class="bg-info-subtle">
                            ${
                                ((header = null),
                                thead &&
                                    thead.map((th) => {
                                        header = [
                                            header,
                                            `<th style="background-color:#cff4fc" class="text-nowrap${
                                                i === 0 ? " count-th" : ""
                                            }">${
                                                th.name.toLowerCase() ===
                                                "starting date"
                                                    ? "Admission Date"
                                                    : th.name ?? ""
                                            }</th>`,
                                        ].join("");
                                    }),
                                header
                                    ? '<th style="background-color:#cff4fc" class="count-th">No.</th>' +
                                      header
                                    : "")
                            }
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            ((body = null),
                            tbl &&
                                tbl.students &&
                                tbl.students.map((d, i) => {
                                    body = [
                                        body,
                                        `<tr class="text-nowrap ">
                                ${
                                    ((tr = null),
                                    thead.map((k) => {
                                        tr = [
                                            tr,
                                            `<td  class="text-capitalize align-middle ${
                                                k.key === "remarks"
                                                    ? " text-break"
                                                    : ""
                                            }" style="${
                                                k.key === "remarks"
                                                    ? "min-width: 300px"
                                                    : ""
                                            }">${d[k.key] ?? ""}</td>`,
                                        ].join("");
                                    }),
                                    tr
                                        ? `<td class="align-middle">${
                                              i + 1
                                          }</td>` + tr
                                        : "")
                                }</tr>`,
                                    ].join("");
                                }),
                            body
                                ? body +
                                  `<tr class="bg-body-secondary">
                            <td style="background-color:#e9ecef" class=" bg-secondary text-uppercase text-center fw-bold" colspan="${
                                d.header.length - 1
                            }">${
                                      tbl.label ??
                                      "Total " + tbl.class.replace(/_/g, " ")
                                  }</td>
                            <td class="text-center bg-secondary">${
                                tbl.total ?? ""
                            }</td>
                            <td class="text-center bg-secondary"></td>
                        </tr>`
                                : "")
                        }
                    </tbody>
                    <tfoot>${cnt === length ? footerHtml(d) : ""}</tfoot>
                </table>`,
                    ].join("");
                }),
            table ?? "")
        }

        ${
            table
                ? ""
                : `<table class="table table-bordered">
            <thead>
                <tr class="bg-info-subtle">
                    ${
                        ((header = null),
                        thead &&
                            thead.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="text-nowrap count-th">${
                                        th.name.toLowerCase() ===
                                        "starting date"
                                            ? "Admission Date"
                                            : th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header
                            ? '<th style="background-color:#cff4fc" class="count-th">No.</th>' +
                              header
                            : "")
                    }
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot>${footerHtml(d)}</tfoot>
        </table>`
        }
    </div>
    <div class="d-flex justify-content-between">
        <div class="d-block">
            <p>Prepared By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Officer</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Checked By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Manager</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Approved By</p>
            <hr class="bg-dark mt-5"/>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function incomeByCategoryTable(div, d) {
    let header = null,
        body = null,
        tr = null,
        table = null,
        cnt = 0;
    const thead = d.header ?? [],
        tbody = d.list.all_fee ?? [],
        company_info = d.company_profile ?? {};
    const length = tbody.length;

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
        ${
            ((cnt = 0),
            (table = null),
            tbody &&
                tbody.map((tbl, i) => {
                    cnt++;
                    table = [
                        table,
                        `<p class="pb-0 mb-1 text-center text-capitalize fs-5-1 get-title">${
                            tbl.fee_type ? tbl.fee_type.replace(/\_/g, " ") : ""
                        }</p>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            ${
                                ((header = null),
                                thead &&
                                    thead.map((th) => {
                                        header = [
                                            header,
                                            `<th style="background-color:#fff3cd" class="bg-warning-subtle text-nowarp${
                                                i === 0 ? " count-th" : ""
                                            }">${th.name ?? ""}</th>`,
                                        ].join("");
                                    }),
                                header
                                    ? `<th style="background-color:#fff3cd" class="bg-warning-subtle${
                                          i === 0 ? " count-th" : ""
                                      }">No.</th>` + header
                                    : "")
                            }
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            ((body = null),
                            tbl &&
                                tbl.fee &&
                                tbl.fee.map((d, i) => {
                                    body = [
                                        body,
                                        `<tr class="text-nowrap">
                                ${
                                    ((tr = null),
                                    thead.map((k) => {
                                        tr = [
                                            tr,
                                            `<td class="text-capitalize align-middle ${
                                                k.key == "remark"
                                                    ? "text-break"
                                                    : ""
                                            }" style="${
                                                k.key == "remark"
                                                    ? "min-width: 250px"
                                                    : ""
                                            }">${d[k.key] ?? ""}</td>`,
                                        ].join("");
                                    }),
                                    tr
                                        ? `<td class="align-middle">${
                                              i + 1
                                          }</td>` + tr
                                        : "")
                                }</tr>`,
                                    ].join("");
                                }),
                            body +
                                `<tr>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle text-uppercase text-center" colspan="4">${
                                tbl.sub_label ??
                                "Sub Total " + tbl.fee_type.replace(/\_/g, " ")
                            }</td>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle text-center">${
                                tbl.total_cash ?? ""
                            }</td>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle text-center">${
                                tbl.total_cheque ?? ""
                            }</td>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle text-center">${
                                tbl.total_transfer ?? ""
                            }</td>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle text-center"</td>
                        </tr>
                        <tr>
                            <td style="background-color:#e9ecef" class="bg-body-secondary text-uppercase text-center" colspan="4">${
                                tbl.label ??
                                "Total " + tbl.fee_type.replace(/\_/g, " ")
                            }</td>
                            <td style="background-color:#e9ecef" class="bg-body-secondary text-center" colspan="3">${
                                tbl.total ?? ""
                            }</td>
                            <td style="background-color:#e9ecef" class="bg-body-secondary text-center" colspan=""></td>
                        </tr>`)
                        }
                    </tbody>
                    <tfoot>${cnt === length ? footerHtml(d) : ""}</tfoot>
                </table>`,
                    ].join("");
                }),
            table ?? "")
        }
    </div>
    <div class="d-flex justify-content-between">
        <div class="d-block">
            <p>Prepared By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Officer</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Checked By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Manager</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Approved By</p>
            <hr class="bg-dark mt-5"/>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function totalPaymentByYear(div, d) {
    let header = null,
        body = null,
        tr = null,
        table = null;
    const thead = d.header ?? [],
        tbody = d.list ?? [],
        company_info = d.company_profile ?? {};

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 pb-0 mb-0 get-subtitle fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
        ${
            ((table = null),
            tbody &&
                tbody.map((tbl, i) => {
                    table = [
                        table,
                        `<p class="pb-0 mb-1 text-capitalize get-title">${
                            tbl.type ? tbl.type.replace(/\_/g, " ") : ""
                        }</p>
                <style>
                table th, td{
                    border-collapse: collapse;
                    border: 1px solid #c4dae3 !important;
                }
                </style>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            ${
                                ((header = null),
                                thead &&
                                    thead.map((th) => {
                                        header = [
                                            header,
                                            th.key == "amount_paid" ||
                                            th.key == "amount_unpaid" ||
                                            th.key == "overdue"
                                                ? ""
                                                : `<th ${
                                                      th.name ==
                                                      "Old Student Payment"
                                                          ? `colspan="2"`
                                                          : `rowspan="2"`
                                                  } rowspan="" style="background-color:#deeaf7" class="bg--secondary text-center align-middle text-nowrap${
                                                      i === 0 ? " count-th" : ""
                                                  }">${th.name ?? ""}</th>`,
                                        ].join("");
                                    }),
                                header ?? "")
                            }
                        </tr>
                        <tr>
                            <th style="background-color:#deeaf7" class="bg-info--subtle text-nowrap text-center align-middle count-th">Amount Paid</th>
                            <th style="background-color:#deeaf7;" class=" text-nowarp text-center align-middle ">Overdue</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            ((body = null),
                            tbl &&
                                tbl.fee &&
                                tbl.fee.map((item) => {
                                    body = [
                                        body,
                                        `<tr>
                                ${
                                    ((tr = null),
                                    thead &&
                                        thead.map((th) => {
                                            tr = [
                                                tr,
                                                th.key ==
                                                    "old_student_payment" ||
                                                th.key == "amount_unpaid"
                                                    ? ""
                                                    : `<td class="text-nowrap">${
                                                          item[th.key] ?? ""
                                                      }</td>`,
                                            ].join("");
                                        }),
                                    tr ?? "")
                                }</tr>`,
                                    ].join("");
                                }),
                            body ?? "")
                        }
                    </tbody>
                </table>`,
                    ].join("");
                }),
            table ?? "")
        }
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function totalPaymentHistory1(div, d) {
    let header = null,
        body = null,
        tr = null,
        td = null,
        once = true;
    const thead = d.header ?? [],
        tbody = d.list.all_fee ?? [],
        grand_total = d.list.fee_grand_totals ?? [],
        company_info = d.company_profile ?? {};

    const html = [
        `
    <div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((header = null),
                        (once = true),
                        thead &&
                            thead.map((th) => {
                                header = [
                                    header,
                                    th.name == "Tuition Fee"
                                        ? ""
                                        : `<th style="background-color:#e9ecef" class="bg-body-secondary count-th" ${
                                              once ? "count-th colspan='2'" : ""
                                          }>${
                                              th.name
                                                  ? th.name.replace(/\_/g, " ")
                                                  : ""
                                          }</th>`,
                                ].join("");
                                once = false;
                            }),
                        header ?? "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    tbody &&
                        tbody.map((list) => {
                            body = [
                                body,
                                `<tr>
                            <td style="background-color:#fff3cd" class="bg-warning-subtle" colspan="${
                                parseInt(thead.length) + 1
                            }">${list.level ?? ""}</td>
                        </tr>
                        ${
                            ((tr = null),
                            list &&
                                list.fee &&
                                list.fee.map((t, i) => {
                                    tr = [
                                        tr,
                                        `<tr>
                                    ${
                                        ((td = null),
                                        thead &&
                                            thead.map((k) => {
                                                td = [
                                                    td,
                                                    k.name == "Tuition Fee"
                                                        ? ""
                                                        : `<td>${
                                                              t[k.key] ?? ""
                                                          }</td>`,
                                                ].join("");
                                            }),
                                        td ? `<td>${i + 1}</td>` + td : "")
                                    }
                                </tr>`,
                                    ].join("");
                                }),
                            tr ?? "")
                        }
                        <tr>
                            ${
                                ((tr = null),
                                (once = true),
                                thead &&
                                    thead.map((k) => {
                                        tr = [
                                            tr,
                                            k.name == "Tuition Fee"
                                                ? ""
                                                : `<td style="background-color:#e9ecef" class="bg-body-secondary" ${
                                                      once ? "colspan='2'" : ""
                                                  }>${
                                                      list.fee_totals[k.key] ??
                                                      `${
                                                          once
                                                              ? `Total ${
                                                                    list.level ??
                                                                    ""
                                                                }`
                                                              : ""
                                                      }`
                                                  }</td>`,
                                        ].join("");
                                        once = false;
                                    }),
                                tr ?? "")
                            }
                        </tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
                ${[
                    `<tr>
                    ${
                        ((tr = null),
                        grand_total &&
                            grand_total.map((t, i) => {
                                tr = [
                                    tr,
                                    `<tr>
                                ${
                                    ((td = null),
                                    thead &&
                                        thead.map((k) => {
                                            td = [
                                                td,
                                                k.name == "Tuition Fee"
                                                    ? ""
                                                    : k.key == "name"
                                                    ? ""
                                                    : `<td style="background-color:#4765ac;color: white;">${
                                                          t[k.key] ?? ""
                                                      }</td>`,
                                            ].join("");
                                        }),
                                    td
                                        ? `<td style="background-color:#4765ac ;color: white;" class="bg-body--secondary" ${"colspan='2'"}> Grand Total </td>` +
                                          td
                                        : "")
                                }
                            </tr>`,
                                ].join("");
                            }),
                        tr ?? "")
                    }
                </tr>`,
                ].join("")}
            </tbody>
            <tfoot>${footerHtml(d)}</tfoot>
        </table>
    </div>`,
    ].join("");

    div.innerHTML = html;
    // togglePanelTable(div);
    HtmlString = html;
}

function leaveStudent(div, d) {
    let header = null,
        body = null,
        tr = null;
    const thead = d.header ?? {},
        tbody = d.list ?? [],
        company_info = d.company_profile ?? {};

    let namesToRemove = ["Date", "Last Payment", "Dropout"];
    let headerMerged = thead.first_row.filter(
        (obj) => !namesToRemove.includes(obj.name)
    );
    headerMerged = headerMerged
        .slice(0, 6)
        .concat(thead.second_row, headerMerged.slice(6));
    [headerMerged[9], headerMerged[11]] = [headerMerged[11], headerMerged[9]];
    [headerMerged[12], headerMerged[10]] = [headerMerged[10], headerMerged[12]];

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((header = null),
                        thead &&
                            thead.first_row &&
                            thead.first_row.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="bg-info-subtle text-capitalize text-nowrap text-center align-middle" ${
                                        th.name.toLowerCase() === "date"
                                            ? "colspan='3'"
                                            : th.name.toLowerCase() ===
                                                  "last payment" ||
                                              th.name.toLowerCase() ===
                                                  "dropout"
                                            ? "Leave"
                                            : "count-th rowspan='2'"
                                    }>${
                                        th.name.toLowerCase() === "dropout"
                                            ? d.leave_type
                                            : th.name.toLowerCase() ===
                                              "reason for drop"
                                            ? "Reason For " + d.leave_type
                                            : th.name.toLowerCase() ===
                                              "starting date"
                                            ? "Admission Date"
                                            : th.name.toLowerCase() === "time"
                                            ? "Session"
                                            : th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header
                            ? '<th style="background-color:#cff4fc" class="bg-info-subtle text-center align-middle count-th" rowspan="2">No</th>' +
                              header
                            : "")
                    }</tr>
                <tr>
                    ${
                        ((header = null),
                        thead &&
                            thead.second_row &&
                            thead.second_row.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="bg-info-subtle text-nowrap text-center count-th">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header ?? "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    tbody &&
                        tbody.map((td, i) => {
                            body = [
                                body,
                                `<tr>
                            ${
                                ((tr = null),
                                headerMerged &&
                                    headerMerged.map((k) => {
                                        tr = [
                                            tr,
                                            `<td class="text-nowrap">${
                                                td[k.key] ?? ""
                                            }</td>`,
                                        ].join("");
                                    }),
                                tr ? `<td>${i + 1}</td>` + tr : "")
                            }
                        </tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
            </tbody>
        </table>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function attendanceList(div, d) {
    let header = null,
        body = null,
        tr = null;
    const thead = d.header ?? {},
        tbody = d.list ?? [],
        company_info = d.company_profile ?? {};

    let namesToRemove = ["Date", "Last Payment", "Dropout"];
    let headerMerged = thead.first_row.filter(
        (obj) => !namesToRemove.includes(obj.name)
    );
    headerMerged = headerMerged
        .slice(0, 6)
        .concat(thead.second_row, headerMerged.slice(6));
    if (d.leave_type.toLowerCase() === "suspended") {
        [headerMerged[9], headerMerged[11]] = [
            headerMerged[11],
            headerMerged[9],
        ];
        [headerMerged[12], headerMerged[10]] = [
            headerMerged[10],
            headerMerged[12],
        ];
    }
    {
        [headerMerged[9], headerMerged[13]] = [
            headerMerged[13],
            headerMerged[9],
        ];
        [headerMerged[9], headerMerged[10]] = [
            headerMerged[10],
            headerMerged[9],
        ];
    }

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((header = null),
                        thead &&
                            thead.first_row &&
                            thead.first_row.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="bg-info-subtle text-capitalize text-nowrap text-center align-middle" ${
                                        th.name.toLowerCase() === "date"
                                            ? "colspan='3'"
                                            : th.name.toLowerCase() ===
                                                  "last payment" ||
                                              th.name.toLowerCase() ===
                                                  "dropout"
                                            ? "Leave"
                                            : "count-th rowspan='2'"
                                    } ${
                                        d.leave_type.toLowerCase() ===
                                            "suspended" &&
                                        th.name.toLowerCase() === "dropout"
                                            ? "colspan='2'"
                                            : ""
                                    } >${
                                        th.name.toLowerCase() === "dropout"
                                            ? d.leave_type
                                            : th.name.toLowerCase() ===
                                              "reason for drop"
                                            ? "Reason For " + d.leave_type
                                            : th.name.toLowerCase() ===
                                              "starting date"
                                            ? "Admission Date"
                                            : th.name.toLowerCase() === "a time"
                                            ? "Time"
                                            : th.name.toLowerCase() === "time"
                                            ? "Session"
                                            : th.name ?? ""
                                    } </th>`,
                                ].join("");
                            }),
                        header
                            ? '<th style="background-color:#cff4fc" class="bg-info-subtle text-center align-middle count-th" rowspan="2">No</th>' +
                              header
                            : "")
                    }</tr>
                <tr>
                    ${
                        ((header = null),
                        thead &&
                            thead.second_row &&
                            thead.second_row.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#cff4fc" class="bg-info-subtle text-nowrap text-center count-th">${
                                        th.name.toLowerCase() === "s from"
                                            ? "From"
                                            : th.name.toLowerCase() ===
                                              "s end date"
                                            ? "End Date"
                                            : th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header ?? "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    tbody &&
                        tbody.map((td, i) => {
                            body = [
                                body,
                                `<tr>
                            ${
                                ((tr = null),
                                headerMerged &&
                                    headerMerged.map((k) => {
                                        tr = [
                                            tr,
                                            `<td class="text-nowrap">${
                                                td[k.key] ?? ""
                                            }</td>`,
                                        ].join("");
                                    }),
                                tr ? `<td>${i + 1}</td>` + tr : "")
                            }
                        </tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
            </tbody>
        </table>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function Payments(div, data) {
    let html = ` 
    <div class="d-block position-relative">
  
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${data?.title ?? ''}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${data?.sub_title ?? ''}</p>
        </div>
    </div>
    <div class="d-flex justify-content-end w-100">
        <div class="d-flex border rounded-3 shadow-sm ps-3 pt-3 me-3 pb-0 w-25" style="min-width: 400px; margin-top: -70px;">
            <div class="w-50">
                <p class="text-nowrap">Vendor</p>
                <p class="text-nowrap">Phone</p>
                <p class="text-nowrap">CP Name</p>
                <p class="text-nowrap">CP Phone</p>
            </div>
            <div class="w-50">
                <p class="text-nowrap">${data?.vendor_info?.name ?? '_'}</p>
                <p class="text-nowrap">${data?.vendor_info?.phone_number ?? '_'}</p>
                <p class="text-nowrap">${data?.vendor_info?.contact_person ?? '_'}</p>
                <p class="text-nowrap">${data?.vendor_info?.contact_phone ?? '_'}</p>
            </div>
        </div>
    </div>
    `;
     const d = data?.list ?? [];

    html += `
    <div class="table-responsive mt-3 pt-3 pb-3 bg-white overflow-x-hover-auto">
        <table class="table table-bordered text-nowrap">
            <thead>
                <tr>
                    <th class="text-center">Payment Date</th>
                    <th class="text-center">Ref No</th>
                    <th class="text-center">Total Amount</th>
                    <th class="text-center">Paid Amount</th>
                    <th class="text-center">Balance</th>
                    
                </tr>
            </thead>
            <tbody>
    `;

    if (d.length) {
        d.forEach((st, index) => {
            html += `
                <tr>
                    <td class="text-start align-middle">
                        ${st.payment_date ?? '_'}
                    </td>
                    <td class="align-middle">
                        ${st.ref_no ?? '_'}
                    </td>
                    <td class="align-middle text-primary text-end">
                        ${st.total_amount ?? '_'}
                    </td>
                    <td class="align-middle text-success text-end">
                        ${st.paid_amount ?? '_'}
                    </td><td class="align-middle text-danger text-end">
                        ${st.balance ?? '_'}
                    </td>
                    
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="13" class="text-center">
                    No data found
                </td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    </div>
    `;
  
    div.innerHTML = html;
    // togglePanelTable(div);
    HtmlString = html;
}

// function incomeByClassTable(div,d)
// {
//     let header = null, body = null, tr_html = null, td_html = null;
//     const company_info = d.company_profile ?? {},
//     all_classes = d.all_classes ?? [],
//     list_all_class = all_classes.list ?? {},
//     new_students = d.new_students ?? {},
//     suspend_students = d.suspend_students ?? {},
//     drop_students = d.drop_students ?? {};

//     const html = [`<div class="d-block position-relative">
//         <div class="height-logo-report position-absolute float-start">
//             <img style="max-width: 100px; max-height: 100px;" class=" object-fit-scale set-min-size-logo" src="${company_info.logo_url ?? ''}" alt="" />
//         </div>
//         <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
//             <h4 class="text-center text-uppercase">${d.title ?? ''}</h4>
//             <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${ d.sub_title ?? 'Income By Class Date At: last 3 month'}</p>
//         </div>
//     </div>
//     <div class="table-responsive p-3 mt-3 bg-white">
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     ${header=null,
//                         all_classes.header && all_classes.header.map(th => {
//                             header = [header,`<th style="background-color:#e9ecef" class="bg-body-secondary text-nowrap align-middle count-th">${th.name ?? ''}</th>`].join('');
//                         }),
//                     header ?? ''}
//                 </tr>
//                 <tbody>
//                     ${body=null,
//                         list_all_class.all_classes && list_all_class.all_classes.map(cls => {
//                             body = [body,`${tr_html=null,
//                                 cls.fee && cls.fee.map(td => {
//                                     tr_html = [tr_html,`<tr>
//                                         ${td_html=null,
//                                             all_classes.header && all_classes.header.map(k => {
//                                                 td_html = [td_html,`<td class="align-middle text-end">${td[k.key] ?? ''}</td>`].join('');
//                                             }),td_html ?? ''}
//                                     </tr>`].join('');
//                                 }),tr_html ?? ''}`].join('');
//                             body = [body,`<tr>
//                                 <td style="background-color:#fff3cd" class="bg-warning-subtle align-middle text-end">Total</td>
//                                 ${tr_html=null,
//                                     all_classes.header && all_classes.header.map(k => {
//                                         tr_html = [tr_html,`${cls.class_fee_totals[k.key] ? `<td style="background-color:#fff3cd" class="bg-warning-subtle align-middle text-end">${cls.class_fee_totals[k.key] ?? ''}</td>` : ''}`].join('')
//                                     }),
//                                 tr_html ?? ''}
//                             </tr>`].join('')
//                         }),
//                     body ? body+`<tr>
//                             <td style="background-color:#e9ecef" class="bg-body-secondary align-middle text-end">Sub Total</td>
//                             ${tr_html=null,
//                                 all_classes.header && all_classes.header.map(k => {
//                                     tr_html = [tr_html,`${list_all_class.fee_totals[k.key] ? `<td style="background-color:#e9ecef" class="bg-body-secondary align-middle text-end">${list_all_class.fee_totals[k.key] ?? ''}</td>` : ''}`].join('')
//                                 }),
//                             tr_html ?? ''}
//                         </tr>
//                         <tr>
//                             <td class="align-middle text-center text-capitalize" colspan="${all_classes.header.length}">${list_all_class.grand_total ?? ''}</td>
//                         </tr>` : ''}
//                 </tbody>
//             </thead>
//         </table>
//         <p class="text-capitalize">1. Number of ${new_students.title ?? ''}<p/>
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     ${header=null,
//                         new_students.header && new_students.header.map(th => {
//                             header = [header,`<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${th.name ?? ''}</th>`].join('');
//                         }),
//                     header ? '<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>'+header : ''}
//                 </tr>
//             </thead>
//             <tbody>
//                 ${body=null,
//                     new_students.list && new_students.list.map((tr,i) => {
//                         body = [body,`<tr>${tr_html=null,
//                             new_students.header && new_students.header.map(k => {
//                                 tr_html = [tr_html,`<td class="align-middle">${tr[k.key] ?? ''}</td>`].join('');
//                             }),
//                         tr_html ? `<td class="align-middle">${i+1}</td>`+tr_html : ''}</tr>`].join('');
//                     }),
//                 body ?? ''}
//             </tbody>
//         </table>
//         <p class="text-capitalize">2. Number of ${suspend_students.title ?? ''}</p>
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     ${header=null,
//                         suspend_students.header && suspend_students.header.map(th => {
//                             header = [header,`<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${th.name ?? ''}</th>`].join('');
//                         }),
//                     header ? `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>`+header : ''}
//                 </tr>
//             </thead>
//             <tbody>
//                 ${body=null,
//                     suspend_students.list && suspend_students.list.map((tr,i) => {
//                         body = [body,`<tr>
//                             ${tr_html=null,
//                                 suspend_students.header && suspend_students.header.map(k => {
//                                     tr_html = [tr_html,`<td class="align-middle">${tr[k.key] ?? ''}</td>`].join('');
//                                 }),
//                             tr_html ? `<td class="align-middle">${i+1}</td>`+tr_html : ''}
//                         </tr>`].join('');
//                     }),
//                 body ?? ''}
//             </tbody>
//         </table>
//         <p class="text-capitalize">3. Number of ${drop_students.title ?? ''}</p>
//         <table class="table table-bordered">
//             <thead>
//                 <tr>
//                     ${header=null,
//                         drop_students.header && drop_students.header.map(th => {
//                             header = [header,`<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${th.name ?? ''}</th>`].join('');
//                         }),
//                     header ? `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>`+header : ''}
//                 </tr>
//             </thead>
//             <tbody>
//                 ${body=null,
//                     drop_students.list && drop_students.list.map((tr,i) => {
//                         body = [body,`<tr>
//                             ${tr_html=null,
//                                 drop_students.header && drop_students.header.map(k => {
//                                     tr_html = [tr_html,`<td class="align-middle text-capitalize">${tr[k.key] ? tr[k.key].replace(/\(|\)/g,'') : ''}</td>`].join('');
//                                 }),
//                             tr_html ? `<td class="align-middle">${i+1}</td>`+tr_html : ''}
//                         </tr>`].join('');
//                     }),
//                 body ?? ''}
//             </tbody>
//         </table>
//     </div>
//     <div class="d-flex justify-content-between">
//         <div class="d-block">
//             <p>Prepared By</p>
//             <hr class="bg-dark pb-0 mb-1 mt-5"/>
//             <p class="pb-0 mb-1">Finance Officer</p>
//             <p>Date: ${(('.').repeat(15)+'/').repeat(3).slice(0,-1)}</p>
//         </div>
//         <div class="d-block">
//             <p>Checked By</p>
//             <hr class="bg-dark pb-0 mb-1 mt-5"/>
//             <p class="pb-0 mb-1">Finance Manager</p>
//             <p>Date: ${(('.').repeat(15)+'/').repeat(3).slice(0,-1)}</p>
//         </div>
//         <div class="d-block">
//             <p>Approved By</p>
//             <hr class="bg-dark mt-5"/>
//             <p>Date: ${(('.').repeat(15)+'/').repeat(3).slice(0,-1)}</p>
//         </div>
//     </div>`].join('');

//     div.html(html);
//     togglePanelTable(div);
//     HtmlString = html;
// }

function incomeByClassTable(div, d) {
    let header = null,
        body = null,
        tr_html = null,
        td_html = null;
    const company_info = d.company_profile ?? {},
        all_classes = d.all_classes ?? [],
        list_all_class = all_classes.list ?? {},
        new_students = d.new_students ?? {},
        suspend_students = d.suspend_students ?? {},
        drop_students = d.drop_students ?? {};

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? "Income By Class Date At: last 3 month"
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((header = null),
                        all_classes.header &&
                            all_classes.header.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#e9ecef" class="bg-body-secondary text-nowrap align-middle count-th">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header ?? "")
                    }
                </tr>
                <tbody>
                    ${
                        ((body = null),
                        list_all_class.all_classes &&
                            list_all_class.all_classes.map((cls) => {
                                body = [
                                    body,
                                    `<tr>
                                <td style="background-color:#fff3cd" class="bg-warning-subtle" colspan="${
                                    parseInt(all_classes.header.length) + 1
                                }">${cls.program ?? ""}</td>
                            </tr class="text-start">
                            ${
                                ((tr_html = null),
                                cls.group_name &&
                                    cls.group_name.map((gn) => {
                                        cls.classes[gn] &&
                                            cls.classes[gn].map((td) => {
                                                tr_html = [
                                                    tr_html,
                                                    `<tr class="text-end">
                                            ${
                                                ((td_html = null),
                                                all_classes.header &&
                                                    all_classes.header.map(
                                                        (k) => {
                                                            td_html = [
                                                                td_html,
                                                                `<td class="align-middle ">${
                                                                    td[k.key] ??
                                                                    ""
                                                                }</td>`,
                                                            ].join("");
                                                        }
                                                    ),
                                                td_html ?? "")
                                            }
                                        </tr>`,
                                                ].join("");
                                            });
                                    }),
                                tr_html ?? "")
                            }`,
                                ].join("");
                                // body = [body,`<tr>
                                //     <td style="background-color:#fff3cd" class="bg-warning-subtle align-middle text-end">Total</td>
                                //     ${tr_html=null,
                                //         all_classes.header && all_classes.header.map(k => {
                                //             tr_html = [tr_html,`${cls.class_fee_totals[k.key] ? `<td style="background-color:#fff3cd" class="bg-warning-subtle align-middle text-end">${cls.class_fee_totals[k.key] ?? ''}</td>` : ''}`].join('')
                                //         }),
                                //     tr_html ?? ''}
                                // </tr>`].join('')
                            }),
                        body
                            ? body +
                              `<tr>
                            <td style="background-color:#e9ecef" class="bg-body-secondary align-middle text-start">Sub Total</td>
                            ${
                                ((tr_html = null),
                                all_classes.header &&
                                    all_classes.header.map((k) => {
                                        tr_html = [
                                            tr_html,
                                            `${
                                                list_all_class.fee_totals[k.key]
                                                    ? `<td style="background-color:#e9ecef" class="bg-body-secondary align-middle text-end">${
                                                          list_all_class
                                                              .fee_totals[
                                                              k.key
                                                          ] ?? ""
                                                      }</td>`
                                                    : ""
                                            }`,
                                        ].join("");
                                    }),
                                tr_html ?? "")
                            }
                        </tr>
                        <tr>
                            <td class="align-middle text-center text-capitalize" colspan="${
                                all_classes.header.length
                            }">${list_all_class.grand_total ?? ""}</td>
                        </tr>`
                            : "")
                    }
                </tbody>
            </thead>
        </table>
        <p class="text-capitalize">1. Number of ${new_students.title ?? ""}<p/>
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((header = null),
                        new_students.header &&
                            new_students.header.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header
                            ? '<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>' +
                              header
                            : "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    new_students.list &&
                        new_students.list.map((tr, i) => {
                            body = [
                                body,
                                `<tr class="text-nowrap">${
                                    ((tr_html = null),
                                    new_students.header &&
                                        new_students.header.map((k, c) => {
                                            tr_html = [
                                                tr_html,
                                                `<td class="align-middle ${
                                                    c > 6 && c < 17
                                                        ? "text-end"
                                                        : ""
                                                }">${tr[k.key] ?? ""}</td>`,
                                            ].join("");
                                        }),
                                    tr_html
                                        ? `<td class="align-middle">${
                                              i + 1
                                          }</td>` + tr_html
                                        : "")
                                }</tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
            </tbody>
        </table>
        <p class="text-capitalize">2. Number of ${
            suspend_students.title ?? ""
        }</p>
        <table class="table table-bordered">
            <thead>
                <tr class="text-nowrap">
                    ${
                        ((header = null),
                        suspend_students.header &&
                            suspend_students.header.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header
                            ? `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>` +
                              header
                            : "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    suspend_students.list &&
                        suspend_students.list.map((tr, i) => {
                            body = [
                                body,
                                `<tr class="text-nowrap">
                            ${
                                ((tr_html = null),
                                suspend_students.header &&
                                    suspend_students.header.map((k) => {
                                        tr_html = [
                                            tr_html,
                                            `<td class="align-middle">${
                                                tr[k.key] ?? ""
                                            }</td>`,
                                        ].join("");
                                    }),
                                tr_html
                                    ? `<td class="align-middle">${i + 1}</td>` +
                                      tr_html
                                    : "")
                            }
                        </tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
            </tbody>
        </table>
        <p class="text-capitalize">3. Number of ${drop_students.title ?? ""}</p>
        <table class="table table-bordered">
            <thead>
                <tr class="text-nowrap">
                    ${
                        ((header = null),
                        drop_students.header &&
                            drop_students.header.map((th) => {
                                header = [
                                    header,
                                    `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">${
                                        th.name ?? ""
                                    }</th>`,
                                ].join("");
                            }),
                        header
                            ? `<th style="background-color:#e9ecef" class="bg-body-secondary align-middle text-nowrap">No</th>` +
                              header
                            : "")
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((body = null),
                    drop_students.list &&
                        drop_students.list.map((tr, i) => {
                            body = [
                                body,
                                `<tr class="text-nowrap">
                            ${
                                ((tr_html = null),
                                drop_students.header &&
                                    drop_students.header.map((k) => {
                                        tr_html = [
                                            tr_html,
                                            `<td class="align-middle text-capitalize">${
                                                tr[k.key]
                                                    ? tr[k.key].replace(
                                                          /\(|\)/g,
                                                          ""
                                                      )
                                                    : ""
                                            }</td>`,
                                        ].join("");
                                    }),
                                tr_html
                                    ? `<td class="align-middle">${i + 1}</td>` +
                                      tr_html
                                    : "")
                            }
                        </tr>`,
                            ].join("");
                        }),
                    body ?? "")
                }
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-between">
        <div class="d-block">
            <p>Prepared By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Officer</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Checked By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-1">Finance Manager</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Approved By</p>
            <hr class="bg-dark mt-5"/>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function studentChangeCampus(div, d) {
    let thead = "",
        tbody = "",
        tr_html = "";
    const company_info = d.company_profile ?? {},
        header = d.header ?? [],
        body = d.list ?? [];

    const firstHeader = header.filter((th) => {
        if (th.key != "payment" && th.key != "from" && th.key != "end_date") {
            return th;
        }
    });

    const secondHeader = header.filter((th) => {
        if (th.key == "payment" || th.key == "from" || th.key == "end_date") {
            return th;
        }
    });

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((thead = ""),
                        firstHeader.map((th) => {
                            thead += `<th rowspan="2" class="align-middle text-center text-nowrap text-dark bg-info-subtle">${
                                th.name.toLowerCase() === "starting date"
                                    ? "Admission Date"
                                    : th.name ?? ""
                            }</th>
                        ${
                            th.key === "starting_date"
                                ? '<th colspan="3" class="align-middle text-center text-nowrap text-dark bg-info-subtle">Date</th>'
                                : ""
                        }`;
                        }),
                        `<th rowspan="2" class="align-middle text-center text-nowrap text-dark bg-info-subtle">No</th>` +
                            thead)
                    }
                </tr>
                <tr>
                    ${
                        ((thead = ""),
                        secondHeader.map((th) => {
                            thead += `<th class="align-middle text-center text-nowrap text-dark bg-info-subtle">${
                                th.name ?? ""
                            }</th>`;
                        }),
                        thead)
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((tbody = ""),
                    body.map((tr, index) => {
                        tbody += `<tr>
                        ${
                            ((tr_html = ""),
                            header.map((k) => {
                                tr_html += `<td>${tr[k.key] ?? ""}</td>`;
                            }),
                            `<td>${index + 1}</td>` + tr_html)
                        }
                    </tr>`;
                    }),
                    tbody)
                }
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-between">
        <div class="d-block">
            <p>Prepared By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-3">Name</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Checked By</p>
            <hr class="bg-dark pb-0 mb-1 mt-5"/>
            <p class="pb-0 mb-3">Name</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
        <div class="d-block">
            <p>Approved By</p>
            <hr class="bg-dark mt-5"/>
            <p class="pb-0 mb-3">Name</p>
            <p>Date: ${(".".repeat(15) + "/").repeat(3).slice(0, -1)}</p>
        </div>
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function crossYearPayment(div, d) {
    let header_html = "",
        table_html = "",
        tr_html = "",
        th_html = "",
        td_html = "";

    const company_info = d.company_profile ?? {},
        student_header = d.student_header ?? [],
        student_info = d.student_info ?? [],
        table_header = d.table_header ?? [],
        header_length = table_header.length;

    const html = [
        `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title ?? ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title ?? ""
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white">
        ${
            ((header_html = ""),
            (student_info || []).forEach((st, index) => {
                (student_header || []).forEach((th) => {
                    header_html += `<div class="d-flex align-items-center text-nowrap">
                    <p class="p-0 m-0 fw-semibold width-text-student-prepayment">${
                        th.name ?? ""
                    }</p>
                    <span class="px-2">:</span>
                    <p class="p-0 m-0 text-capitalize">${st[th.key] ?? ""}</p>
                </div>`;
                });

                table_html += `<div class="d-flex gap-2 flex-column ${
                    index > 0 ? "my-3" : "mb-3"
                }">${header_html}</div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        ${
                            ((th_html = ""),
                            (table_header || []).forEach((th) => {
                                th_html += `<th class="text-center align-middle">${
                                    th.name ?? ""
                                }</th>`;
                            }),
                            th_html)
                        }
                    </tr>
                </thead>
                <tbody>
                    ${
                        ((tr_html = ""),
                        (st.list || []).forEach((tr) => {
                            ((td_html = ""), table_header || []).forEach(
                                (th) => {
                                    td_html += `<td class="align-middle">${
                                        tr[th.key] ?? ""
                                    }</td>`;
                                }
                            );
                            tr_html += `<tr>${td_html}</tr>`;
                        }),
                        tr_html +
                            `<tr>
                        <td colspan="${
                            header_length - 1
                        }" class="text-center align-middle">
                            <p class="p-0 m-0 fw-semibold">Balance of student
                                <span class="text-capitalize">${
                                    st.student_name ?? ""
                                }</span>
                            </p>
                        </td>
                        <td class="align-middle text-center">${
                            st.balance ?? ""
                        }</td>
                    </tr>`)
                    }
                </tbody>
            </table>`;
            }),
            table_html)
        }
    </div>`,
    ].join("");

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function upgradeFee(div, d) {
    const company_info = d.company_profile || {},
        header = d.header || [],
        list = d.list || [];

    let th_html = "",
        tr_html = "",
        td_html = "",
        merge_name = null;

    const html = `<div class="d-block position-relative">
        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase">${d.title || ""}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle  fs-5">${
                d.sub_title || ""
            }</p>
        </div>
    </div>
    <div class="table-responsive p-3 mt-3 bg-white set-font-size">
        <table class="table table-bordered">
            <thead>
                <tr>
                    ${
                        ((th_html = ""),
                        header.forEach((th) => {
                            if (th.merge_name) {
                                if (merge_name !== th.merge_name)
                                    th_html += `<th colspan="${
                                        header.filter(
                                            (arr) =>
                                                arr.merge_name === th.merge_name
                                        ).length
                                    }" class="text-nowrap bg-secondary-subtle align-middle text-center text-capitalize">${
                                        th.merge_name.toLowerCase() ===
                                        "starting date"
                                            ? "Admission Date"
                                            : th.merge_name || ""
                                    }</th>`;
                                merge_name = th.merge_name;
                            } else {
                                th_html += `<th rowspan="2" class="text-nowrap bg-secondary-subtle align-middle text-center text-capitalize">${
                                    th.name.toLowerCase() === "starting date"
                                        ? "Admission Date"
                                        : th.name || ""
                                }</th>`;
                            }
                        }),
                        th_html)
                    }
                </tr>
                <tr>
                    ${
                        ((th_html = ""),
                        header.forEach((th) => {
                            if (th.merge_name) {
                                th_html += `<th class="text-nowrap bg-secondary-subtle align-middle text-center text-capitalize">${
                                    th.name.toLowerCase() === "starting date"
                                        ? "Admission Date"
                                        : th.name || ""
                                }</th>`;
                            }
                        }),
                        th_html)
                    }
                </tr>
            </thead>
            <tbody>
                ${
                    ((tr_html = ""),
                    list.forEach((tr) => {
                        tr_html += `<tr>
                            ${
                                ((td_html = ""),
                                header.forEach((td) => {
                                    td_html += `<td class="text-nowrap align-middle">${
                                        tr[td.key] || ""
                                    }</td>`;
                                }),
                                td_html)
                            }
                        </tr>`;
                    }),
                    tr_html)
                }
            </tbody>
        </table>
    </div>`;

    div.html(html);
    togglePanelTable(div);
    HtmlString = html;
}

function footerHtml(d) {
    let footer = "",
        inner_html = "";
    const fee_total = d.list.fee_totals;
    switch (fee_total.form) {
        case "daily_cash":
            footer = `<tr>
                <td style="background-color:#e9ecef" class="bg-body-secondary text-uppercase text-center fw-bold" colspan="6">${
                    fee_total.label ?? ""
                }</td>
                ${
                    ((inner_html = ""),
                    d.header.forEach((k) => {
                        inner_html += fee_total[k.key]
                            ? `<td style="background-color:#e9ecef" class="bg-body-secondary">${
                                  fee_total[k.key] ?? ""
                              }</td>`
                            : "";
                    }),
                    inner_html)
                }
            </tr>`;
            break;
        case "monthly_cash":
            footer = `<tr>
                <td style="background-color:#e9ecef; width:120px;" class="bg-body-secondary text-uppercase text-center fw-bold">${
                    fee_total.label ?? ""
                }</td>
                ${
                    ((inner_html = ""),
                    d.header.forEach((k) => {
                        inner_html += fee_total[k.key]
                            ? `<td style="background-color:#e9ecef" class="bg-body-secondary">${
                                  fee_total[k.key] ?? ""
                              }</td>`
                            : "";
                    }),
                    inner_html)
                }
            </tr>`;
            footer += `<tr>
                <td style="background-color:#e9ecef; width:120px;" class="bg-body-secondary text-capitalize text-center fw-bold text-break">${
                    fee_total.service_fee ?? ""
                }</td>
                ${
                    ((inner_html = ""),
                    d.header.forEach((k) => {
                        inner_html += fee_total[k.key]
                            ? `<td style="background-color:#e9ecef" class="bg-body-secondary">${
                                  fee_total.service_fee[k.key] ?? ""
                              }</td>`
                            : "";
                    }),
                    inner_html)
                }
            </tr>`;
            break;
        case "school_fee":
        case "non_tuition":
            footer = `<tr>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-uppercase text-center text-white" colspan="${
                    d.header.length - 1
                }">${fee_total.label ?? ""}</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-white text-center">${
                    fee_total.total ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-white text-center"></td>
            </tr>`;
            break;
        case "income_by_category":
            footer = `<tr class="text-center">
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary align-middle text-white" colspan="4" rowspan="2">${
                    fee_total.label ?? "Grand Total"
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white">${
                    fee_total.cash ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white">${
                    fee_total.transfer ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white">${
                    fee_total.cheque ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white"></td>
            </tr>
            <tr class="text-center">
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white" colspan="3">${
                    fee_total.grand_total ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-center text-white" colspan=""></td>
            </tr>`;
            break;
        case "total_payment_history_by_year":
            footer = `<tr>
                <td style="background-color:#e9ecef" class="bg-body-secondary text-center">${
                    fee_total.label ?? "Total"
                }</td>
                ${
                    ((inner_html = ""),
                    d.header.forEach((k) => {
                        inner_html += fee_total[k.key]
                            ? `<td style="background-color:#e9ecef" class="bg-body-secondary text-center">${
                                  fee_total[k.key] ?? ""
                              }</td>`
                            : "";
                    }),
                    inner_html)
                }
            </tr>`;
            break;
        case "deposit":
            footer = `<tr class="text-center">
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary text-uppercase align-middle text-white" colspan="5">${
                    fee_total.label ?? ""
                }</td>
                <td style="background-color:#0d6efd;color:#ffffff" class="bg-primary align-middle text-white">${
                    fee_total.total ?? ""
                }</td>
                ${returnEmptyTD(parseInt(d.header.length) - 6)}
            </tr>`;
            break;
        default:
            break;
    }
    return footer;
}

function returnEmptyTD(length) {
    let td = "";
    for (let i = 0; i < length; i++) {
        td +=
            '<td style="background-color:#0d6efd;color:#ffffff" class="bg-primary align-middle text-white"></td>';
    }
    return td;
}

/**
 * This function toggle filter on report component
 */
function togglePanelTable(div) {
    if(!div || div.length===0 ) return;
    let zoom = 100;

    div.find("table.table").on("wheel", function (e) {
        if (e.originalEvent.shiftKey) {
            e.originalEvent.deltaY > 0 ? (zoom -= 0.7) : (zoom += 0.7);
            $(this).css("zoom", zoom + "%");
        }
    });
    // div.closest('.main-container').find('#_rpt_container').toggle('slow'); //old

    const main_conrain = div.closest(".main-container");
    const rpt_input_filter = main_conrain.find("#_rpt_input_filter");
    main_conrain.find("#_rpt_list").slideUp("slow");
    const div_filter = main_conrain.find("#_div_filter");
    div_filter.addClass("d-none");
    div_filter.removeClass("d-block");
    rpt_input_filter[0].querySelectorAll("div.el_filter").forEach((el) => {
        el.classList.add("col-lg-2");
        el.classList.remove("col-lg-6");
    });
    rpt_input_filter.find("#_rpt_btn_list").slideDown("slow");
    rpt_input_filter.find("#_rpt_btn_print").slideDown("slow");

    rpt_input_filter.children().slideDown("slow");
}

/**
 * These function for print report table
 */
function windowPrint(html=null, style) {
    HtmlString = html ? html : HtmlString;
    if (HtmlString) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
           <title>Print Report</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
                <!-- <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/css_for_print_invoice.css"/> -->
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    ${style}
                    .table.w-100.mt-5{
                        margin-top: 80px !important;
                    }
                    .set-min-size-container-title {
                        min-height: 100px;
                    }
                        .table tbody>tr>td {
                        max-height: 150px;
                        max-width: 300px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                </style>

            </head>
            <body class="row flex-column" style="overflow: unset;">${HtmlString.replace(/table-responsive\s+/g,'')}</body>
        </html>`);
        //${HtmlString.replace(/table-responsive\s+/g,'')}
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 500);
    } else cv_interact.warning("Select run report before print!");
}
function windowPrintExitForm(html, style) {
    if (html) {

        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Exit Form</title>

                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/css_for_print_invoice.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/font-awesome/6.2.0/css/all.min.css" media="print//"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/ksm_style.css" media="print//"/>
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:14px;
                    }
                    ${style}
                </style>
            </head>
            <body>
                ${html.replace(/table-responsive/g, "")}
            </body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 200);
    }
}
function windowPrintBenfit(html, style) {
    if (html) {

        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Benefits</title>

                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/css_for_print_invoice.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/font-awesome/6.2.0/css/all.min.css" media="print//"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/ksm_style.css" media="print//"/>
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:14px;
                    }
                    ${style}
                </style>
            </head>
            <body>
                ${html.replace(/table-responsive/g, "")}
            </body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 200);
    }
}

function windowPrintRole(html = null, style = null) {
    HtmlString = html ? html : HtmlString;
    if (HtmlString) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Print Role List</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/ksm_style.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/css_for_print_invoice.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    ${style}

                </style>

            </head>
            <body class"d-flex justify-contains-center">${HtmlString.replace(
                /table-responsive\s+/g,
                ""
            )}</body>
        </html>`);
        //${HtmlString.replace(/table-responsive\s+/g,'')}
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 500);
    } else cv_interact.warning("Select run report before print!");
}

function khmerNum(number) {
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(number).replace(/\d/g, (digit) => khmerNumbers[digit]);
}

function exportToExcel() {
    if (HtmlString) {
        const numTable = (HtmlString.match(new RegExp("<table", "g")) || [])
                .length,
            numTh = (HtmlString.match(new RegExp("count-th", "g")) || [])
                .length;
        let startIndex = HtmlString.indexOf("<img"),
            endIndex = HtmlString.indexOf('"/>', startIndex);

        let tStartIndex = 0,
            tLastIndex,
            subTitle = "";

        if (HtmlString.indexOf('get-subtitle">') !== -1) {
            tStartIndex =
                HtmlString.indexOf('get-subtitle">', tStartIndex) + 14;
            tLastIndex = tStartIndex;
            tLastIndex = HtmlString.indexOf("</p>", tLastIndex);

            subTitle = `<tr><th colspan="${numTh - 2}">${HtmlString.substring(
                tStartIndex,
                tLastIndex
            )}</th></tr>`;
        }

        const image =
            `<tr><th ${
                subTitle ? 'rowspan="2"' : ""
            } colspan="2"><div>${HtmlString.substring(
                startIndex,
                endIndex + 3
            ).replace(/<\img/g, '<img width="100" height="100"')}</div></th>
        <th colspan="${
            numTh - 2
        }" style="text-center:center;align-vertical:middle">${HtmlString.substring(
                HtmlString.indexOf("<h4"),
                HtmlString.indexOf("</h4>", HtmlString.indexOf("<h4")) + 5
            ).replace(
                /\<h4/g,
                '<h4 style="font-size:16px;font-weight:600"'
            )}</th></tr>` + subTitle;

        let tblStartIndex = 0,
            tblLastIndex,
            i = 0;

        (tStartIndex = 0), tLastIndex;

        let newHtml = "",
            prefixHtml = "",
            tblHtml = "",
            tblCaption = "";

        while (i < numTable) {
            if (HtmlString.indexOf('get-title">') !== -1) {
                (tStartIndex =
                    HtmlString.indexOf('get-title">', tStartIndex) + 11),
                    (tLastIndex = tStartIndex),
                    (tLastIndex = HtmlString.indexOf("</p>", tLastIndex));

                tblCaption = `<tr><th colspan="${numTh}" style="font-size:16px;font-wieght:500">${HtmlString.substring(
                    tStartIndex,
                    tLastIndex
                )}</th></tr>`;
                tStartIndex = tLastIndex;
            }

            (tblStartIndex = HtmlString.indexOf("<table", tblStartIndex)),
                (tblLastIndex = tblStartIndex),
                (tblLastIndex =
                    HtmlString.indexOf("</table>", tblLastIndex) + 8);

            newHtml = HtmlString.substring(tblStartIndex, tblLastIndex).replace(
                /\<table/g,
                '<table border="1"'
            );
            tblStartIndex = tblLastIndex;

            startIndex = newHtml.indexOf("<thead>") + 7;
            prefixHtml = newHtml.substring(0, startIndex);
            newHtml =
                i === 0
                    ? prefixHtml +
                      image +
                      tblCaption +
                      newHtml.substring(startIndex)
                    : prefixHtml + tblCaption + newHtml.substring(startIndex);
            tblHtml += newHtml;
            i++;
        }

        let attribute = "";
        const attr = {
            "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
            "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet",
            "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
            "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
            "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
            "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
            "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
            "xmlns:fo":
                "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
            "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
            "xmlns:number":
                "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
            "xmlns:presentation":
                "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
            "xmlns:svg":
                "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
            "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
            "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
            "xmlns:math": "http://www.w3.org/1998/Math/MathML",
            "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
            "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
            "xmlns:ooo": "http://openoffice.org/2004/office",
            "xmlns:ooow": "http://openoffice.org/2004/writer",
            "xmlns:oooc": "http://openoffice.org/2004/calc",
            "xmlns:dom": "http://www.w3.org/2001/xml-events",
            "xmlns:xforms": "http://www.w3.org/2002/xforms",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
            "xmlns:rpt": "http://openoffice.org/2005/report",
            "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
            "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
            "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
            "xmlns:tableooo": "http://openoffice.org/2009/table",
            "xmlns:drawooo": "http://openoffice.org/2010/draw",
            "xmlns:calcext":
                "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
            "xmlns:loext":
                "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
            "xmlns:field":
                "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
            "xmlns:formx":
                "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
            "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
            "office:version": "1.2",
        };

        Object.keys(attr).forEach((ob) => {
            attribute += " " + ob + "=" + '"' + attr[ob] + '"';
        });

        const style = {
            text_center_th: `text-align:center; vertical-align:middle; font-size:14px; font-family:Khmer OS Battambang; color:#5578eb;`,
            text_center_td: `text-align:left; vertical-align:middle; font-size:12px; font-family:Khmer OS Battambang; color:#000000;`,
        };
        const location =
            "data:application/vnd.oasis.opendocument.spreadsheet;base64,";
        const excelTemplate = `<html ${attribute}>
            <head>
                <!--[if gte mso 9]>
                    <xml version="1.0" encoding="UTF-8" standalone="yes">
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>Report Sheet</x:Name>
                                    <x:WorksheetOptions>
                                        <x:Panes></x:Panes>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                <![endif]-->
                <media:formatDocument xmlns:media="http://www.w3.org/TR-REC-html40">
                    <media:format>
                        <media:mstype="application/vnd.ms-excel"></media:mstype>
                        <media:extension="xlsx"></media:extension>
                    </media:format>
                </media>
            </head>
            <body>${tblHtml
                .replace(/\<th\s/g, '<th style="' + style.text_center_th + '" ')
                .replace(
                    /<td/g,
                    '<td style="' + style.text_center_td + '"'
                )}</body>
        </html>`;

        const uri =
            location + window.btoa(unescape(encodeURIComponent(excelTemplate)));
        const link = document.createElement("a");
        link.href = uri;
        link.download = (new Date() + "Excel-Report.xls")
            .replace(/GMT\+0700\s\(Indochina Time\)/g, "")
            .replace(/\s/g, "-");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        cv_interact.warning("Select run report before print!");
    }
}

function ComponentExportToExcel(HTML, name = "Referral Fee Component") {
    HTML = HTML ?? null;
    HtmlString = `<div class="d-block position-relative">

        <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
            <h4 class="text-center text-uppercase"> ${name}</h4>
            <p class="text-center w-100 fs-5-1 get-subtitle fs-5"></p>
        </div>
    </div>`;
    HtmlString += `<table class"table">${HTML}</table>`;
    if (HtmlString) {
        const numTable = (HtmlString.match(/<table/g) || []).length,
            numTh = (HtmlString.match(/count-th/g) || []).length;
        let startIndex = HtmlString.indexOf("<img"),
            endIndex = HtmlString.indexOf('"/>', startIndex);
        // return;
        let tStartIndex = 0,
            tLastIndex,
            subTitle = "";

        if (HtmlString.indexOf('get-subtitle">') !== -1) {
            tStartIndex =
                HtmlString.indexOf('get-subtitle">', tStartIndex) + 14;
            tLastIndex = tStartIndex;
            tLastIndex = HtmlString.indexOf("</p>", tLastIndex);

            subTitle = `<tr><th colspan="${numTh - 2}">${HtmlString.substring(
                tStartIndex,
                tLastIndex
            )}</th></tr>`;
        }

        const image =
            `<tr><th ${
                subTitle ? 'rowspan="2"' : ""
            } colspan="2"><div>${HtmlString.substring(
                startIndex,
                endIndex + 3
            ).replace(/<\img/g, '<img width="100" height="100"')}</div></th>
        <th colspan="${
            numTh - 2
        }" style="text-center:center;align-vertical:middle">${HtmlString.substring(
                HtmlString.indexOf("<h4"),
                HtmlString.indexOf("</h4>", HtmlString.indexOf("<h4")) + 5
            ).replace(
                /\<h4/g,
                '<h4 style="font-size:18px;font-weight:600"'
            )}</th></tr>` + subTitle;

        let tblStartIndex = 0,
            tblLastIndex,
            i = 0;

        (tStartIndex = 0), tLastIndex;

        let newHtml = "",
            prefixHtml = "",
            tblHtml = "",
            tblCaption = "";

        while (i < numTable) {
            if (HtmlString.indexOf('get-title">') !== -1) {
                (tStartIndex =
                    HtmlString.indexOf('get-title">', tStartIndex) + 11),
                    (tLastIndex = tStartIndex),
                    (tLastIndex = HtmlString.indexOf("</p>", tLastIndex));

                tblCaption = `<tr><th colspan="${numTh}" style="font-size:16px;font-wieght:500">${HtmlString.substring(
                    tStartIndex,
                    tLastIndex
                )}</th></tr>`;
                tStartIndex = tLastIndex;
            }

            (tblStartIndex = HtmlString.indexOf("<table", tblStartIndex)),
                (tblLastIndex = tblStartIndex),
                (tblLastIndex =
                    HtmlString.indexOf("</table>", tblLastIndex) + 8);

            newHtml = HtmlString.substring(tblStartIndex, tblLastIndex).replace(
                /\<table/g,
                '<table border="1"'
            );
            tblStartIndex = tblLastIndex;

            startIndex = newHtml.indexOf("<thead>") + 7;
            prefixHtml = newHtml.substring(0, startIndex);
            newHtml =
                i === 0
                    ? prefixHtml +
                      image +
                      tblCaption +
                      newHtml.substring(startIndex)
                    : prefixHtml + tblCaption + newHtml.substring(startIndex);
            tblHtml += newHtml;
            i++;
        }

        let attribute = "";
        const attr = {
            "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
            "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet",
            "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
            "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
            "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
            "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
            "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
            "xmlns:fo":
                "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
            "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
            "xmlns:number":
                "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
            "xmlns:presentation":
                "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
            "xmlns:svg":
                "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
            "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
            "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
            "xmlns:math": "http://www.w3.org/1998/Math/MathML",
            "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
            "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
            "xmlns:ooo": "http://openoffice.org/2004/office",
            "xmlns:ooow": "http://openoffice.org/2004/writer",
            "xmlns:oooc": "http://openoffice.org/2004/calc",
            "xmlns:dom": "http://www.w3.org/2001/xml-events",
            "xmlns:xforms": "http://www.w3.org/2002/xforms",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
            "xmlns:rpt": "http://openoffice.org/2005/report",
            "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
            "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
            "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
            "xmlns:tableooo": "http://openoffice.org/2009/table",
            "xmlns:drawooo": "http://openoffice.org/2010/draw",
            "xmlns:calcext":
                "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
            "xmlns:loext":
                "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
            "xmlns:field":
                "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
            "xmlns:formx":
                "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
            "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
            "office:version": "1.2",
        };

        Object.keys(attr).forEach((ob) => {
            attribute += " " + ob + "=" + '"' + attr[ob] + '"';
        });

        const style = {
            text_center_th: `text-align:center; vertical-align:middle; font-size:16px; font-family:Khmer OS Battambang; color:#5578eb;`,
            text_center_td: `text-align:center; vertical-align:middle; font-size:14px; font-family:Khmer OS Battambang; color:#000000;`,
        };
        const location =
            "data:application/vnd.oasis.opendocument.spreadsheet;base64,";
        const excelTemplate = `<html ${attribute}>
            <head>
                <!--[if gte mso 9]>
                    <xml version="1.0" encoding="UTF-8" standalone="yes">
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>Report Sheet</x:Name>
                                    <x:WorksheetOptions>
                                        <x:Panes></x:Panes>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                <![endif]-->
                <media:formatDocument xmlns:media="http://www.w3.org/TR-REC-html40">
                    <media:format>
                        <media:mstype="application/vnd.ms-excel"></media:mstype>
                        <media:extension="xlsx"></media:extension>
                    </media:format>
                </media>
            </head>
            <body>${tblHtml
                .replace(/\<th\s/g, '<th style="' + style.text_center_th + '" ')
                .replace(
                    /<td/g,
                    '<td style="' + style.text_center_td + '"'
                )}</body>
        </html>`;
        const uri =
            location + window.btoa(unescape(encodeURIComponent(excelTemplate)));
        const link = document.createElement("a");
        link.href = uri;
        link.download = (new Date() + `Excel-${name}.xls`)
            .replace(/GMT\+0700\s\(Indochina Time\)/g, "")
            .replace(/\s/g, "-");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        cv_interact.warning("Select run report before print!");
    }
}

function windowPrintInvoice(html, style) {
    if (html) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Student Receipt</title>

                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/font-awesome/6.2.0/css/all.min.css" media="print//"/>
                <style>
                    *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:14px;
                    }
                    ${style}
                </style>
            </head>
            <body>
                ${html.replace(/table-responsive/g, "")}
            </body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 200);
    }
}

function windowPrintInfo(html) {
    if (html) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Student Information</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/css_for_info.css"/>
            </head>
            <body>
                <div class="modal-body-custom">${html}</div>
            </body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 100);
    }
}

function windowPrintCard(html) {
    if (html) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html >
            <head>
                <title>Student ID Card</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/font-awesome/6.2.0/css/all.min.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/ksm_style.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${
                    main_view.base_url
                }/assets/css/css_for_card.css"/>
            </head>
            <body>
                <div class="set-width-height p-0 m-0">${html
                    .replace(/col-sm-12/g, "col-6 col-sm-6")
                    .replace(/col-md-12/g, "col-md-6")
                    .replace(/\s+/g, " ")}</div>
            </body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 500);
    }
}

function printParentLogin(html) {
    const myWindow = window.open("", "PRINT");
    myWindow.document.write(`<!DOCTYPE html>
    <html>
        <head>
            <title>Parent Login</title>
            <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
            <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css"/>
            <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
            <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/css_for_parentLogin.css"/>
        </head>
        <tbody>
            <div class="set-card-display">${html}</div>
        </tbody>
    </html>`);
    myWindow.document.close();
    setTimeout(() => {
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }, 1000);
}

function htmlToTable(file_name, html) {
    const myWindow = window.open("", "PRINT");
    myWindow.document.write(`<!DOCTYPE html>
    <html>
        <head>
            <title>${file_name}</title>
            <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
        </head>
        <tbody>
            ${html}
        </tbody>
    </html>`);
    myWindow.document.close();
    setTimeout(() => {
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }, 500);
}

/**
 * This function for calculate age of person
 */
function calculate_age(dob) {
    if (!dob) {
        return 0;
    } else {
        let diff_ms = Date.now() - dob.getTime();
        let age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
}

/**
 * This function for convert number of currency to word
 */
function convertCurrencyToWords(number) {
    const units = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ];
    const teens = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];
    const scales = ["", "thousand", "million", "billion", "trillion"];

    if (number === 0) {
        return "zero";
    }

    const numberParts = String(number).split(".");
    let integerPart = parseInt(numberParts[0]);
    const decimalPart = parseInt(numberParts[1] || 0);

    function convertThreeDigitNumber(num) {
        const parts = [];

        if (num >= 100) {
            parts.push(units[Math.floor(num / 100)]);
            parts.push("hundred");
            num %= 100;
        }

        if (num >= 10 && num <= 19) {
            parts.push(teens[num - 10]);
            num = 0;
        } else if (num >= 20) {
            parts.push(tens[Math.floor(num / 10)]);
            num %= 10;
        }

        if (num > 0) {
            parts.push(units[num]);
        }

        return parts.join(" ");
    }

    const integerWords = [];
    let scaleIndex = 0;

    while (integerPart > 0) {
        const threeDigitNumber = integerPart % 1000;

        if (threeDigitNumber !== 0) {
            const scale = scales[scaleIndex];
            const words = convertThreeDigitNumber(threeDigitNumber);

            integerWords.unshift(words + (scale ? " " + scale : ""));
        }

        integerPart = Math.floor(integerPart / 1000);
        scaleIndex++;
    }

    const decimalWords = convertThreeDigitNumber(decimalPart);

    let result =
        integerWords.join(" ") +
        " Dollars " +
        `${decimalPart > 0 ? "" : "Only."}`;

    if (decimalPart > 0) {
        result += " And " + decimalWords + " Cents Only.";
    }

    return result;
}

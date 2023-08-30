let HtmlString = null;

function renderTable(div, data){
    if(data && !($.isEmptyObject(data))){
        let html = [`<div class="d-flex justify-content-center mb-3">
            <div class="w-25 position-relative">
                <img class="w-100 object-fit-contain" src="${main_view.base_url}/assets/images/logo/photo_report.png" alt=""/>
            </div>
        </div>
        <div class="d-flex position-relative w-100">
            <div class="d-block w-100">
                <h4 class="text-center text-uppercase">Monthly Student Attendance</h4>
                <p class="text-center w-100 fs-5-1">
                    Kindergarten
                    (${data.session ? data.session : ''}) - ${data.level ? data.level : ''} ${data.program ? data.program : ''}
                </p>
            </div>
            <div class="width-show-total">
                <h5 class="text-nowrap">Campus: ${data.campus ? data.campus : ''}</h5>
                <div class="d-flex text-nowrap">
                    Total Students:
                    <p class="w-100 text-center">${data.count_students ? data.count_students.all : ''}</p>
                </div>
                <div class="d-flex text-nowrap">
                    Female Students:
                    <p class="w-100 text-center">${data.count_students ? data.count_students.female : ''}</p>
                </div>
            </div>
        </div>`].join('');

        data && data.session_date && data.session_date.map(tbl => {
            let student = null, days = null,cnt = 1, cols = tbl.days.length;

            html = [html,`<div class="table-responsive mt-3 p-3 bg-white table-responsive-hover">
                <table class="table table-bordered text-nowrap">
                    <thead>
                        <tr>
                            <td rowspan="2" class="align-middle text-center">No</td>
                            <td rowspan="2" class="align-middle text-center">Student Name</td>
                            <td rowspan="2" class="align-middle text-center">Sex</td>
                            <td rowspan="2" class="align-middle text-center">Age</td>
                            <td rowspan="2" class="align-middle text-center">DOB</td>
                            <td rowspan="2" class="align-middle text-center">Starting Date</td>
                            <td rowspan="2" class="align-middle text-center">Shift</td>
                            <td class="align-middle text-center" colspan="${parseInt(cols)}">${tbl.date ? tbl.date : ''}</td>
                            <td rowspan="2" class="align-middle text-center">Phone Number</td>
                        </tr>
                        <tr>
                            ${days=null,tbl && tbl.days && tbl.days.map(d => {
                                days = [days,`<td class="align-middle text-center">${d.day}</td>`].join('')
                            }),days}
                        </tr>
                    </thead>
                    <tbody>
                        ${student=null,tbl && tbl.students && tbl.students.map(st => {
                            const options = {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            };

                            let inner_html=null;
                            st && st.list && st.list.map(d => {
                                let cls = d.status === 'A' ? 'text-white bg-danger' : d.status === 'P' ? 'text-white bg-success' : d.status === 'Sat' ? 'text-danger-emphasis bg-danger-subtle' : d.status === 'Sun' ? 'text-danger bg-danger-subtle' : d.status === 'Pr' ? 'text-white bg-warning' : 'text-body-emphasis bg-dark-subtle';

                                inner_html = [inner_html,`<td class="${cls}">${d.status}</td>`].join('');
                            });

                            student = [student,`<tr>
                                <td>${cnt++}</td>
                                <td class="text-capitalize">${st.name ? st.name : ''}</td>
                                <td>${st.sex === 'M' ? 'Male' : 'Female'}</td>
                                <td>${calculate_age(new Date(st.date_of_birth))}</td>
                                <td>${st.date_of_birth ? new Date(st.date_of_birth).toLocaleDateString('km-kh',options).replaceAll(' ','-') : ''}</td>
                                <td>${st.start_date ? new Date(st.start_date).toLocaleDateString('km-kh',options).replaceAll(' ','-') : ''}</td>
                                <td>${data.session ? data.session : ''}</td>
                                ${inner_html ? inner_html : '<td></td>'}
                                <td></td>
                            </tr>`].join('');
                        }),student}
                    </tbody>
                </table>
            </div>`].join('');
        });

        div.html(html);
        let zoom = 100;
        div.find('table.table').on('wheel',function(e){
            if(e.originalEvent.shiftKey){
                e.originalEvent.deltaY > 0 ? zoom -= 0.5 : zoom += 0.5;
                $(this).css('zoom',zoom+'%');
            }
        });
        div.closest('.main-container').find('#_rpt_container').toggle('slow');
        HtmlString = html;
    }
}

function windowPrint(){
    if(HtmlString){
        let myWindow = window.open('','PRINT');
        myWindow.document.write(`<!DOCTYPE html>
        <html >
            <head>
                <title>Student Attendaces Report</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
                <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/css_for_print.css"/>
            </head>
            <body>${HtmlString.replaceAll('table-responsive ','')}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        },100);
    }
    else{
        cv_interact.warning('Select Run Report Before Print!');
    }
}

function exportToExcel(){
    if(HtmlString){
        const location = 'data:application/vnd.ms-excel;base64,';
        let excelTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Test Sheet</x:Name>
                                <x:WorksheetOptions>
                                    <x:Panes></x:Panes>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
            </head>
            <body>${HtmlString.replaceAll('table-responsive ','')}</body>
        </html>`;
        window.location.href = location + window.btoa(unescape(encodeURIComponent(excelTemplate)));
    }
    else{
        cv_interact.warning('Select Run Report Before Print!');
    }
}

function calculate_age(dob){
    if(!dob){
        return 0;
    }
    else{
        let diff_ms = Date.now() - dob.getTime();
        let age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear()-1970);
    }
}
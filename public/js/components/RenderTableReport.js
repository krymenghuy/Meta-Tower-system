function renderTable(div, data){
    console.log(data);
    data = data ? data : {};
    let html = [`<div class="d-flex justify-content-center mb-3">
        <div class="w-25 position-relative">
            <img class="w-100 object-fit-contain" src="${main_view.base_url}/assets/images/logo/photo_report.png" alt=""/>
        </div>
    </div>
    <div class="d-flex position-relative">
        <div class="d-block w-100">
            <h4 class="text-center text-uppercase">Monthly Student Attendance</h4>
            <p class="text-center w-100">
                Kindergarten (${data.session ? data.session : ''}) - ${data.level ? data.level : ''}
            </p>
        </div>
        <div class="width-show-total">
            <h5>Campus: ${data.campus ? data.campus : ''}</h5>
            <p>Total Students: ${data.total_student ? data.total_student : ''}</p>
            <p>Female Students: ${data.female_student ? data.female_student : ''}</p>
        </div>
    </div>`].join('');

    data && data.session_date.map(tbl => {
        let student = null, cnt = 1, cols = 0;

        tbl.list.map(at => {
            cols = cols > at.attendance_list.length ? cols : at.attendance_list.length;
        });

        html = [html,`<div class="table-responsive mt-3 p-3 bg-white table-responsive-hover">
            <table class="table table-bordered text-nowrap">
                <thead>
                    <tr>
                        <td rowspan="2" class="align-middle">No</td>
                        <td rowspan="2" class="align-middle">Student Name</td>
                        <td rowspan="2" class="align-middle">Sex</td>
                        <td rowspan="2" class="align-middle">Age</td>
                        <td rowspan="2" class="align-middle">DOB</td>
                        <td rowspan="2" class="align-middle">Starting Date</td>
                        <td rowspan="2" class="align-middle">Shift</td>
                        <td class="text-center" colspan="${cols}">${tbl.date ? tbl.date : ''}</td>
                        <td rowspan="2" class="align-middle">Phone Number</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    ${student=null,tbl && tbl.list.map(st => {
                        let inner_html=null;
                        st && st.attendance_list.map(d => {
                            let cls = d.status === 'A' ? 'bg-danger' : d.status === 'P' ? 'bg-warning' : 'bg-success';
                            inner_html = [inner_html,`<td class="text-white ${cls}">${d.status}</td>`].join('');
                        });

                        student = [student,`<tr>
                            <td>${cnt++}</td>
                            <td class="text-capitalize">${st.name ? st.name : ''}</td>
                            <td>${st.sex === 'M' ? 'Male' : 'Female'}</td>
                            <td>${calculate_age(new Date(st.date_of_birth))}</td>
                            <td>${st.date_of_birth ? st.date_of_birth : ''}</td>
                            <td></td>
                            <td></td>
                            ${inner_html ? inner_html : ''}
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
}

function calculate_age(dob){
    let diff_ms = Date.now() - dob.getTime();
    let age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}
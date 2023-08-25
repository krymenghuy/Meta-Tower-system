function renderTable(div, data){
    console.log(data);
    let html = [`<div class="mb-3"></div>
    <h4 class="text-center text-uppercase">Monthly Student Attendance</h4>`].join('');
    data.map(tbl => {
        html = [html,`<div class="d-flex position-relative">
            <div class="d-block w-100">
                <p class="text-center fs-5 w-100">
                    Kindergarten (${tbl.session ? tbl.session : ''}) - ${tbl.level ? tbl.level : ''}
                </p>
                <p class="text-center fs-5 w-100">
                </p>
            </div>
            <div class="width-show-total">
                <h5>Campus: ${tbl.campus ? tbl.campus : ''}</h5>
                <p>Total Students: ${tbl.total_student ? tbl.total_student : ''}</p>
                <p>Female Students: ${tbl.female_student ? tbl.female_student : ''}</p>
            </div>
        </div>
        <div class="table-responsive">
            <table class=""></table>
        </div>`].join('');
    });
    div.html(html);
    div.closest('.main-container').find('#_rpt_container').toggle('slow');
}
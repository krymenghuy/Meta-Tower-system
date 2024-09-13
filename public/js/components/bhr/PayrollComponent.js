"use strict";

var PayrollComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll";

    this.cols = [

        {
            title: "Name",
            className: "align-middle",
            data: "name"
        },
        {
            title: "Position",
            className: "align-middle",
            data: "position"
        },
        {
            title: "Rate",
            className: "align-middle",
            data: "rate"
        },
        {
            title: "Period",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.start_date.replace(/-/g, '/') ?? ''} - ${data.end_date.replace(/-/g, '/') ?? ''}</p>`;
            }
        },
        {
            title: "Working_hours",
            className: "align-middle",
            data: "working_hours"
        },
        {
            title: "Salary",
            className: "align-middle",
            data: "salary"
        },
        {
            title: "Status",
            className: "align-middle",
            data: "status"
        },

    ];
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView('_payroll_list',{
            fetchApi : `${main_view.base_url}/hr/payroll/list-paginate`,
            perPage: 10,
            //paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--blue  header-uppercase',
            listContainerClass: null
        });

        mThis.initAlready = true;
    };


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.PayrollListView.showPage(null,null,() => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
        });
    };

});

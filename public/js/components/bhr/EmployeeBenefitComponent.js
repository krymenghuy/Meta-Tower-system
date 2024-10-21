"use strict";

var EmployeeBenefitComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children(
        "#_main_employee_benefit_component"
    );
    this.self = this.jm[0];
    this.title_prop = "Employee Benefits";

    this.init = function () {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };
    // Show component
    this.show = function () {
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();

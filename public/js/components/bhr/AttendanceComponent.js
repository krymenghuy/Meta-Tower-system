"use strict";

var AttendanceComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_attendanceComponent");
    this.self = this.jm[0];
    this.title_prop = "Attendance";

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };
    // Show component
    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();

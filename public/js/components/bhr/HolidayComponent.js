"use strict";

var HolidayComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_holidayComponent");
    this.self = this.jm[0];
    this.title_prop = "Holiday";

    // Show component
    this.show = function () {
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();

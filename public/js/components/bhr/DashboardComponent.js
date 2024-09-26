"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Dashboard";

    // Initialize component
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };
    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();

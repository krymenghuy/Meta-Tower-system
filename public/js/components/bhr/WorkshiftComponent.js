"use strict";

var WorkshiftComponent = new (function () {
    const mThis = this;
    this.title_prop = "Workshifts";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_workshiftComponent");
    this.self = this.jm[0];

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    this.show = (options) => {
        mThis.init();
        if (!options) options = {};
        main_view.setTitle(mThis.title_prop);
        // mThis.bookingListView.showPage(mThis.getFilterData());
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
    };
})();

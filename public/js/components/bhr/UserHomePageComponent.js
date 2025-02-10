"use strict";
var UserHomePageComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_user_homepage_component");
    mThis.self = mThis.jm[0];
    mThis.title_prop = "User Home Page";
    mThis.paginationContainer = mThis.self.querySelector(
        "#user_homepage_container_pagination"
    );

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();

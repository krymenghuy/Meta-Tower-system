"use strict";

var PolicyComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Association Policy";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_policy_component");
    mThis.self = mThis.jm[0];




 mThis.show = function () {
        main_view.setTitle(mThis.title_prop);
        
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();

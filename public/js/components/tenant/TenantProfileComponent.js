"use strict";
var TenantProfileComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Profile Overview";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_profile_component",
    );

    mThis.init = () => {
        if (mThis.initAlready) return;

       

        mThis.initAlready = true;
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

"use strict";
var ZoneManagementComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Zone & Floor";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_accountStaff_component");

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





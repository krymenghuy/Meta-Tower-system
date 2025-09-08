"use strict";
var ServiceComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Service Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_component");


    mThis.init = () => {
        if (mThis.initAlready) return;

  

        mThis.initAlready = true;
    };


    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
   

    };
    return mThis;
})();




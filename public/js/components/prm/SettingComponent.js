"use strict";
var SettingComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Setting";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_setting_component");


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




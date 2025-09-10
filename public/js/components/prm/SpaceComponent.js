"use strict";

var SpaceComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Space Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_space_component");
    mThis.RegisterGrave = mThis.self.querySelector("#_btnSpace");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_space");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_grave_info");
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

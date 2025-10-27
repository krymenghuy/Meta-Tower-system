"use strict";
var AnnouncementComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Annountcement Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_announ_component");
     mThis.btnAdd = mThis.self.querySelector("#_btnAddAnnoun");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_announ");
    mThis.elSearch = mThis.self.querySelector("#_search_announ_info");
    mThis.elFilter_status = mThis.self.querySelector("#el_status");

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




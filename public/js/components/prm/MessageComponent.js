"use strict";

var MessageComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Message Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_message_component");
     mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant");


    mThis.listContainer = mThis.self.querySelector("#_tenant_list");

    mThis.cols = [
        {}

    ];
    return mThis;
})();
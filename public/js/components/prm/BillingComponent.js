"use strict";
var BillingComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Billing Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_billing_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBilling");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_billing");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_billing");


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




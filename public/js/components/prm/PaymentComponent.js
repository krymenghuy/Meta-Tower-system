"use strict";
var PaymentComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Payment";
    mThis.self = main_view.VSAppContent.querySelector("#_main_payment_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_payment");
    mThis.elSearch = mThis.self.querySelector("#_search_payment");


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




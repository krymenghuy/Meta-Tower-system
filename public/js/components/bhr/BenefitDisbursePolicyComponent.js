"use strict";

var BenefitDisbursePolicyComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_benefit_disbursement_policy_component");
    this.self = this.jm[0];
    this.title_prop = "Benefits Disbursement Policy";
    this.btnAdd = this.self.querySelector("#_btnAddTaxBracket");
    this.divFilter = this.self.querySelector("#_divFilter");

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };
 
    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();

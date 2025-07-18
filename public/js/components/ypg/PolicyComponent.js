"use strict";

var PolicyComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Association Policy";
    mThis.self = main_view.VSAppContent.querySelector("#_main_policy_component");

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    mThis.renderPolicy = () => {
        const div = mThis.self;
        const html = `
            <div class="policy-container">
                <div class="box-policy">
                    <img src="${main_view.asset_url}/images/yavpheng/policy_khmer.jpg" class="policy-img" alt="Policy Khmer" />
                    <img src="${main_view.asset_url}/images/yavpheng/policy_chinese.jpg" class="policy-img" alt="Policy Chinese" />
                </div>
            </div>
        `;
        div.innerHTML = html;

        Object.assign(div.style, {
            height: (window.innerHeight - 70) + "px",
            overflow: 'auto'
        });

        window.onresize = () => {
            Object.assign(div.style, {
                height: (window.innerHeight - 70) + "px",
                overflow: 'auto'
            });
        };
    };

    mThis.show = () => {
        mThis.init();
        mThis.renderPolicy();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
